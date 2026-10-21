// Facet UI license manager.
// One private Vercel Blob record per license key (licenses/<sha256>.json) holds the buyer, the
// devices that use the key (browsers that unlocked the docs, machines that ran `npx facetui`),
// a device limit, a revoked flag and recent activity. The admin page (/admin) edits these records.
//
// Env:
//   GUMROAD_PRODUCT_ID     Gumroad product the keys belong to (required for buyer keys)
//   BLOB_READ_WRITE_TOKEN  set by Vercel when the facet-licenses store is connected
//   FACET_DEVICE_LIMIT     default devices per key (default 5)
//   FACET_EXTRA_KEYS       optional comma-separated keys that are always valid (press, testers)
//   FACET_BLOCKED_KEYS     optional comma-separated keys that are always refused
const crypto = require("crypto")

const DEFAULT_LIMIT = () => Math.max(1, parseInt(process.env.FACET_DEVICE_LIMIT || "5", 10) || 5)
const REVERIFY_MS = 6 * 60 * 60 * 1000 // re-check Gumroad (refunds, disputes) at most every 6 hours per key
const TOUCH_MS = 60 * 60 * 1000 // update a device's "last seen" at most hourly
const MAX_EVENTS = 30
const list = (v) => String(v || "").split(",").map((s) => s.trim()).filter(Boolean)
const hash = (key) => crypto.createHash("sha256").update(key).digest("hex")
const now = () => new Date().toISOString()

/* ---------- storage: private Vercel Blob (or memory for local tests) ---------- */
const memory = new Map()
const useMemory = () => process.env.FACET_LICENSE_STORE === "memory"
const pathFor = (id) => `licenses/${id}.json`

async function load(id) {
  if (useMemory()) { const v = memory.get(id); return v ? { record: JSON.parse(v.body), etag: v.etag } : null }
  const { get } = require("@vercel/blob")
  const res = await get(pathFor(id), { access: "private", useCache: false })
  if (!res) return null
  const body = await new Response(res.stream).text()
  return { record: JSON.parse(body), etag: res.blob && res.blob.etag }
}

async function save(record, etag) {
  record.updatedAt = now()
  const body = JSON.stringify(record)
  if (useMemory()) {
    const cur = memory.get(record.id)
    if (etag && cur && cur.etag !== etag) { const e = new Error("conflict"); e.conflict = true; throw e }
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
    const recs = await Promise.all(page.blobs.map(async (b) => {
      const res = await get(b.pathname, { access: "private", useCache: false }).catch(() => null)
      return res ? JSON.parse(await new Response(res.stream).text()) : null
    }))
    out.push(...recs.filter(Boolean))
  } while (cursor)
  return out
}

// Read-modify-write with optimistic concurrency (retries if another request wrote in between).
async function update(id, fn, create) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const cur = await load(id)
    const record = cur ? cur.record : create ? create() : null
    if (!record) return null
    const result = await fn(record)
    if (result === false) return record // nothing to write
    try { await save(record, cur && cur.etag); return record } catch (e) { if (!e.conflict || attempt === 2) throw e }
  }
}

/* ---------- Gumroad ---------- */
const gumroadCache = new Map() // key -> { until, data } per warm instance
async function gumroad(key) {
  const hit = gumroadCache.get(key)
  if (hit && hit.until > Date.now()) return hit.data
  const productId = process.env.GUMROAD_PRODUCT_ID
  if (!productId) return { ok: false, reason: "not-configured" }
  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ product_id: productId, license_key: key, increment_uses_count: "false" }),
  }).catch(() => null)
  if (!res) return { ok: false, reason: "unreachable" }
  const data = await res.json().catch(() => ({}))
  const p = data.purchase || {}
  const out = data.success === true
    ? { ok: !p.refunded && !p.chargebacked && !p.disputed, reason: p.refunded ? "refunded" : p.chargebacked ? "chargebacked" : p.disputed ? "disputed" : null,
        email: p.email || null, purchasedAt: p.created_at || null, product: p.product_name || null, variant: p.variants || null, saleId: p.sale_id || null }
    : { ok: false, reason: "invalid" }
  gumroadCache.set(key, { until: Date.now() + 10 * 60 * 1000, data: out })
  return out
}

/* ---------- authorize a request ---------- */
// device: { id, kind: "web" | "cli" | "figma", name }
// Returns { ok: true, record } or { ok: false, status, error }.
const recentOk = new Map() // key|device -> until: skip the store for a minute after a success (the CLI fetches many items)
async function authorize(key, device = {}) {
  if (!key || !/^[\w-]{6,80}$/.test(key)) return { ok: false, status: 401, error: "Facet UI license key required." }
  const memo = key + "|" + (device.id || "")
  if ((recentOk.get(memo) || 0) > Date.now()) return { ok: true, cached: true }
  if (list(process.env.FACET_BLOCKED_KEYS).includes(key)) return { ok: false, status: 403, error: "This Facet UI license key has been disabled. Contact support if you think this is a mistake." }
  const id = hash(key)
  const extra = list(process.env.FACET_EXTRA_KEYS).includes(key)
  let existing = await load(id).catch((e) => { if (process.env.FACET_LICENSE_STRICT) throw e; return null })
  const rec0 = existing && existing.record
  if (rec0 && rec0.revoked) return { ok: false, status: 403, error: "This Facet UI license has been revoked. Contact support if you think this is a mistake." }

  // Is the key genuine? Manual/extra keys are trusted; Gumroad keys are re-checked every few hours.
  let g = null
  const trusted = extra || (rec0 && rec0.source === "manual")
  if (!trusted && (!rec0 || !rec0.verifiedAt || Date.now() - Date.parse(rec0.verifiedAt) > REVERIFY_MS || rec0.gumroadOk === false)) {
    g = await gumroad(key)
    if (g.reason === "unreachable" && rec0 && rec0.gumroadOk) g = null // Gumroad down: trust the last good check
    else if (!g.ok) {
      if (rec0) await update(id, (r) => { r.gumroadOk = false; r.gumroadReason = g.reason; r.verifiedAt = now(); pushEvent(r, device, false, g.reason) }).catch(() => {})
      const msg = g.reason === "not-configured" ? "License checking isn't set up yet. Please contact support."
        : g.reason === "unreachable" ? "Couldn't reach the license server. Please try again in a minute."
        : ["refunded", "chargebacked", "disputed"].includes(g.reason) ? "This Facet UI purchase was refunded or disputed, so the license no longer works."
        : "This Facet UI license key is not valid."
      return { ok: false, status: g.reason === "unreachable" || g.reason === "not-configured" ? 503 : 403, error: msg }
    }
  }

  // Record the device and enforce the limit.
  let denied = null
  const record = await update(id, (r) => {
    if (g) Object.assign(r, { gumroadOk: true, gumroadReason: null, verifiedAt: now(), email: g.email || r.email, purchasedAt: g.purchasedAt || r.purchasedAt, product: g.product || r.product, variant: g.variant || r.variant, saleId: g.saleId || r.saleId })
    if (r.revoked) { denied = { status: 403, error: "This Facet UI license has been revoked." }; return false }
    const t = now()
    r.lastSeen = t
    if (!device.id || device.kind === "figma") { pushEvent(r, device, true); return true }
    const d = r.devices.find((x) => x.id === device.id)
    if (d) {
      const stale = Date.now() - Date.parse(d.lastSeen) > TOUCH_MS
      d.lastSeen = t; d.uses = (d.uses || 0) + 1
      if (!stale && !g) return false // avoid a write on every request
      pushEvent(r, device, true)
      return true
    }
    const limit = r.limit || DEFAULT_LIMIT()
    if (r.devices.length >= limit) {
      pushEvent(r, device, false, "device limit")
      denied = { status: 403, error: `This license is already used on ${r.devices.length} device${r.devices.length === 1 ? "" : "s"} (the limit is ${limit}). Remove an old device by contacting support, or buy a team license.` }
      return true
    }
    r.devices.push({ id: device.id, kind: device.kind || "web", name: String(device.name || "").slice(0, 80), firstSeen: t, lastSeen: t, uses: 1 })
    pushEvent(r, device, true, "new device")
    return true
  }, () => ({ id, key, source: extra ? "extra" : "gumroad", createdAt: now(), firstSeen: now(), devices: [], events: [], revoked: false, limit: null, note: "" }))
  if (denied) return { ok: false, ...denied }
  recentOk.set(memo, Date.now() + 60 * 1000)
  return { ok: true, record }
}

function pushEvent(r, device, ok, note) {
  r.events = [{ t: now(), kind: device.kind || "api", device: device.id ? String(device.id).slice(0, 12) : null, ok, ...(note ? { note } : {}) }, ...(r.events || [])].slice(0, MAX_EVENTS)
}

// Device info sent by the CLI and the style guide.
function deviceFrom(req, fallbackKind) {
  const h = (n) => String(req.headers[n] || "").slice(0, 120)
  const id = h("x-facet-device").replace(/[^\w-]/g, "")
  return { id: id || null, kind: (h("x-facet-client") || fallbackKind || "api").replace(/[^\w]/g, "").slice(0, 10), name: h("x-facet-device-name") }
}

function forget() { recentOk.clear(); gumroadCache.clear() }

module.exports = { authorize, forget, deviceFrom, load, save, update, listAll, hash, DEFAULT_LIMIT, gumroad }
