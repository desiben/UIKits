// ETKits license manager, shared by every product.
// One private Vercel Blob record per license key (licenses/<sha256 of key>.json):
//   which store sold it (gumroad, envato, manual), the products it unlocks, the buyer, the devices that
//   use it (browsers and machines, per product), its Figma claims, limits, a revoked flag and activity.
// Used by api/claim.js (Figma delivery), api/licenses/verify.js (product sites such as Facet UI)
// and api/admin.js (the dashboard at /admin).
//
// Env: BLOB_READ_WRITE_TOKEN (set by Vercel for the etkits-licenses store), ENVATO_TOKEN,
//      per-product variables in products.js, BLOCKED_KEYS (optional, comma-separated).
const crypto = require("crypto")
const { product, slugs, byEnvatoItem } = require("./products")

const REVERIFY_MS = 6 * 60 * 60 * 1000 // re-check the store (refunds, disputes) at most every 6 hours
const TOUCH_MS = 60 * 60 * 1000 // update a device's "last seen" at most hourly
const MAX_EVENTS = 40
const ENVATO_CODE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const KEY_PATTERN = /^[\w-]{6,80}$/
const list = (v) => String(v || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
const hash = (key) => crypto.createHash("sha256").update(key.trim().toLowerCase()).digest("hex")
const now = () => new Date().toISOString()
const fail = (status, error) => ({ ok: false, status, error })

/* ---------- storage: private Vercel Blob (or memory for local tests) ---------- */
const memory = new Map()
const useMemory = () => process.env.LICENSE_STORE === "memory"
const pathFor = (id) => `licenses/${id}.json`

async function load(id) {
  if (useMemory()) { const v = memory.get(id); return v ? { record: JSON.parse(v.body), etag: v.etag } : null }
  const { get } = require("@vercel/blob")
  const res = await get(pathFor(id), { access: "private", useCache: false })
  if (!res) return null
  return { record: JSON.parse(await new Response(res.stream).text()), etag: res.blob && res.blob.etag }
}

async function save(record, etag) {
  record.updatedAt = now()
  const body = JSON.stringify(record)
  if (useMemory()) {
    const cur = memory.get(record.id)
    if (etag && cur && cur.etag !== etag) throw Object.assign(new Error("conflict"), { conflict: true })
    memory.set(record.id, { body, etag: crypto.randomUUID() }); return
  }
  const { put } = require("@vercel/blob")
  try {
    await put(pathFor(record.id), body, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true, ...(etag ? { ifMatch: etag } : {}) })
  } catch (e) {
    if (/precondition|etag|412/i.test(String(e && (e.message || e.name)))) e.conflict = true
    throw e
  }
}

async function listAll() {
  if (useMemory()) return [...memory.values()].map((v) => JSON.parse(v.body))
  const { list: blobList, get } = require("@vercel/blob")
  const out = []
  let cursor
  do {
    const page = await blobList({ prefix: "licenses/", cursor, limit: 1000 })
    cursor = page.cursor
    out.push(...(await Promise.all(page.blobs.map(async (b) => {
      const res = await get(b.pathname, { access: "private", useCache: false }).catch(() => null)
      return res ? JSON.parse(await new Response(res.stream).text()) : null
    }))).filter(Boolean))
  } while (cursor)
  return out
}

// Read-modify-write with optimistic concurrency. fn returns false to skip the write.
async function update(id, fn, create) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const cur = await load(id)
    const record = cur ? cur.record : create ? create() : null
    if (!record) return null
    if ((await fn(record)) === false) return record
    try { await save(record, cur && cur.etag); return record } catch (e) { if (!e.conflict || attempt === 2) throw e }
  }
}

const blank = (key, store) => ({ id: hash(key), key, store, products: [], email: null, createdAt: now(), firstSeen: now(), lastSeen: null, devices: [], claims: 0, revoked: false, limit: null, claimLimit: null, events: [], note: "" })
function pushEvent(r, e) { r.events = [{ t: now(), ...e }, ...(r.events || [])].slice(0, MAX_EVENTS) }

/* ---------- stores ---------- */
const storeCache = new Map() // `${slug}|${key}` -> { until, data }, per warm instance
async function gumroad(key, p) {
  if (!p.gumroadProductId) return { ok: false, reason: "not-configured" }
  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ product_id: p.gumroadProductId, license_key: key, increment_uses_count: "false" }),
  }).catch(() => null)
  if (!res) return { ok: false, reason: "unreachable" }
  const d = await res.json().catch(() => ({}))
  if (d.success !== true || !d.purchase) return { ok: false, reason: "invalid" }
  const s = d.purchase
  if (s.refunded || s.chargebacked || s.disputed) return { ok: false, reason: s.refunded ? "refunded" : s.chargebacked ? "chargebacked" : "disputed" }
  if (s.subscription_ended_at || s.subscription_cancelled_at || s.subscription_failed_at) return { ok: false, reason: "subscription ended" }
  return { ok: true, store: "gumroad", info: { email: s.email || null, purchasedAt: s.created_at || null, saleId: s.sale_id || null, variant: s.variants || null } }
}
async function envato(code) {
  const token = process.env.ENVATO_TOKEN
  if (!token) return { ok: false, reason: "not-configured" }
  const res = await fetch("https://api.envato.com/v3/market/author/sale?code=" + encodeURIComponent(code), { headers: { Authorization: "Bearer " + token, "User-Agent": "ETKits license check" } }).catch(() => null)
  if (!res) return { ok: false, reason: "unreachable" }
  if (res.status === 404) return { ok: false, reason: "invalid" }
  if (!res.ok) return { ok: false, reason: "unreachable" }
  const s = await res.json().catch(() => null)
  const p = s && s.item && byEnvatoItem(s.item.id)
  if (!p) return { ok: false, reason: "invalid" }
  return { ok: true, store: "envato", product: p.slug, info: { email: s.buyer || null, purchasedAt: s.sold_at || null, saleId: code, variant: s.license || null } }
}
// Is this key a genuine, paid, non-refunded purchase of `slug`?
async function storeCheck(key, slug) {
  const ck = slug + "|" + key, hit = storeCache.get(ck)
  if (hit && hit.until > Date.now()) return hit.data
  let out
  if (ENVATO_CODE.test(key)) { out = await envato(key); if (out.ok && out.product !== slug) out = { ok: false, reason: "invalid" } }
  else out = await gumroad(key, product(slug))
  if (out.reason !== "unreachable") storeCache.set(ck, { until: Date.now() + 10 * 60 * 1000, data: out })
  return out
}
const storeMessage = (reason, p) => reason === "not-configured" ? `Licensing for ${p ? p.name : "this product"} isn't set up yet. Please email contact@etkits.us.`
  : reason === "unreachable" ? "Couldn't reach the store to check your license. Please try again in a minute."
  : ["refunded", "chargebacked", "disputed"].includes(reason) ? "This purchase was refunded or disputed, so the license no longer works."
  : reason === "subscription ended" ? "This subscription is no longer active."
  : `This license key isn't valid for ${p ? p.name : "this product"}.`

// Shared first half of authorize() and claim(): blocked list, revoked flag, store re-check.
async function check(key, slug, kind) {
  if (!KEY_PATTERN.test(key)) return fail(400, "That doesn't look like a license key. Please check it and try again.")
  if (list(process.env.BLOCKED_KEYS).includes(key.toLowerCase())) return fail(403, "This license key has been disabled. Email contact@etkits.us if you think this is a mistake.")
  const p = product(slug)
  if (!p) return fail(404, "Unknown product.")
  const id = hash(key)
  const cur = await load(id)
  const r = cur && cur.record
  if (r && r.revoked) return fail(403, "This license has been revoked. Email contact@etkits.us if you think this is a mistake.")
  const trusted = r && r.store === "manual" && r.products.includes(slug)
  const fresh = r && r.products.includes(slug) && r.storeOk !== false && r.verifiedAt && Date.now() - Date.parse(r.verifiedAt) < REVERIFY_MS
  let s = null
  if (!trusted && !fresh) {
    s = await storeCheck(key, slug)
    if (!s.ok && s.reason === "unreachable" && r && r.products.includes(slug) && r.storeOk !== false) s = null // store down: trust the last good check
    else if (!s.ok) {
      if (r) await update(id, (x) => { x.storeOk = false; x.storeReason = s.reason; x.verifiedAt = now(); pushEvent(x, { kind, product: slug, ok: false, note: s.reason }) }).catch(() => {})
      return fail(s.reason === "unreachable" || s.reason === "not-configured" ? 503 : 403, storeMessage(s.reason, p))
    }
  }
  return { ok: true, id, p, s }
}
function applyStore(x, slug, s) {
  if (!s) return
  if (!x.products.includes(slug)) x.products.push(slug)
  Object.assign(x, { store: x.store === "manual" ? "manual" : s.store, storeOk: true, storeReason: null, verifiedAt: now() })
  for (const [k, v] of Object.entries(s.info || {})) if (v) x[k] = v
}

/* ---------- product access: style guide unlock, CLI installs ---------- */
// device: { id, kind: "web" | "cli", name }. Returns { ok, record } or { ok: false, status, error }.
async function authorize(key, slug, device) {
  key = String(key || "").trim()
  const c = await check(key, slug, device.kind || "api")
  if (!c.ok) return c
  let denied = null
  const record = await update(c.id, (x) => {
    applyStore(x, slug, c.s)
    if (x.revoked) { denied = fail(403, "This license has been revoked."); return false }
    const t = now(); x.lastSeen = t
    const mine = x.devices.filter((d) => d.product === slug)
    const d = mine.find((y) => y.id === device.id)
    if (d) {
      const stale = Date.now() - Date.parse(d.lastSeen) > TOUCH_MS
      d.lastSeen = t; d.uses = (d.uses || 0) + 1
      if (!stale && !c.s) return false // skip a write on every request
      pushEvent(x, { kind: device.kind, product: slug, device: device.id.slice(0, 8), ok: true })
      return true
    }
    const limit = x.limit || c.p.deviceLimit
    if (mine.length >= limit) {
      pushEvent(x, { kind: device.kind, product: slug, device: device.id.slice(0, 8), ok: false, note: "device limit" })
      denied = fail(403, `This license is already used on ${mine.length} device${mine.length === 1 ? "" : "s"} (the limit is ${limit}). Email contact@etkits.us to free up a device, or buy a team license.`)
      return true
    }
    x.devices.push({ id: device.id, product: slug, kind: device.kind || "web", name: String(device.name || "").slice(0, 80), firstSeen: t, lastSeen: t, uses: 1 })
    pushEvent(x, { kind: device.kind, product: slug, device: device.id.slice(0, 8), ok: true, note: "new device" })
    return true
  }, () => blank(key, c.s ? c.s.store : "gumroad"))
  return denied || { ok: true, record }
}

/* ---------- Figma delivery (claim page) ---------- */
// Works out which product the key belongs to, then counts a claim against the key's claim limit.
async function claim(key) {
  key = String(key || "").trim()
  if (!KEY_PATTERN.test(key)) return fail(400, "That doesn't look like a purchase code. Please check it and try again.")
  const known = await load(hash(key)).catch(() => null)
  let candidates = known ? known.record.products : []
  if (!candidates.length) {
    if (ENVATO_CODE.test(key)) { const e = await envato(key); candidates = e.ok ? [e.product] : []; if (!e.ok && e.reason !== "invalid") return fail(503, storeMessage(e.reason)) }
    else {
      const configured = slugs().filter((s) => product(s).gumroadProductId)
      if (!configured.length) return fail(503, "Claiming isn't available yet. Please email contact@etkits.us.")
      for (const s of configured) { const g = await storeCheck(key, s); if (g.ok) { candidates = [s]; break } if (g.reason !== "invalid") return fail(g.reason === "unreachable" ? 503 : 403, storeMessage(g.reason, product(s))) }
    }
  }
  if (!candidates.length) return fail(403, "This purchase code isn't valid for any ETKits product.")
  const slug = candidates[0]
  const c = await check(key, slug, "figma")
  if (!c.ok) return c
  const figmaUrl = c.p.figmaUrl(c.s ? c.s.store : (known && known.record.store) || "gumroad")
  if (!figmaUrl) return fail(503, `Claiming for ${c.p.name} isn't set up yet. Please email contact@etkits.us.`)
  let denied = null
  const record = await update(c.id, (x) => {
    applyStore(x, slug, c.s)
    const limit = x.claimLimit || c.p.claimLimit
    if ((x.claims || 0) >= limit) {
      pushEvent(x, { kind: "figma", product: slug, ok: false, note: "claim limit" })
      denied = fail(403, "This purchase code has already been claimed the maximum number of times. Email contact@etkits.us if you need help.")
      return true
    }
    x.claims = (x.claims || 0) + 1; x.lastSeen = now()
    pushEvent(x, { kind: "figma", product: slug, ok: true, note: "claimed" })
    return true
  }, () => blank(key, c.s ? c.s.store : "gumroad"))
  if (denied) return denied
  return { ok: true, product: c.p, record, figmaUrl, downloadUrl: c.p.downloadUrl, usesLeft: Math.max(0, (record.claimLimit || c.p.claimLimit) - record.claims) }
}

function forget() { storeCache.clear() }

module.exports = { authorize, claim, load, update, listAll, hash, blank, pushEvent, forget, product, slugs, KEY_PATTERN }
