// ETKits license admin API, used by /admin.
// Every request needs  Authorization: Bearer <ETKITS_ADMIN_PASSWORD>  (12+ characters, set on this
// Vercel project; the dashboard stays locked until you do).
//   GET  /api/admin                       -> { licenses, products }
//   POST /api/admin  { action, id, ... }  -> { license }
//     revoke {id, reason} · restore {id} · limit {id, limit|null} · claimLimit {id, limit|null}
//     resetClaims {id} · removeDevice {id, device} · resetDevices {id} · note {id, note}
//     add {key?, email, products[], note}   (a key you issue yourself: press, testers, direct sales)
const crypto = require("crypto")
const { load, update, listAll, hash, blank, pushEvent, forget, product, slugs, KEY_PATTERN } = require("./_lib/licenses")

function send(res, status, body) {
  res.statusCode = status
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "no-store")
  res.setHeader("x-robots-tag", "noindex")
  res.end(JSON.stringify(body))
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
function authorized(req) {
  const pass = process.env.ETKITS_ADMIN_PASSWORD || ""
  if (pass.length < 12) return null
  const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "")
  return crypto.timingSafeEqual(crypto.createHash("sha256").update(given).digest(), crypto.createHash("sha256").update(pass).digest())
}
const mask = (k) => (k && k.length > 12 ? `${k.slice(0, 4)}…${k.slice(-4)}` : "••••")
function view(r) {
  return {
    id: r.id, keyMasked: mask(r.key), store: r.store, products: r.products || [], email: r.email || null, variant: r.variant || null,
    purchasedAt: r.purchasedAt || null, firstSeen: r.firstSeen || r.createdAt, lastSeen: r.lastSeen || null,
    revoked: !!r.revoked, revokedReason: r.revokedReason || null, revokedAt: r.revokedAt || null,
    storeOk: r.storeOk !== false, storeReason: r.storeReason || null,
    limit: r.limit || null, claimLimit: r.claimLimit || null, claims: r.claims || 0,
    devices: r.devices || [], events: r.events || [], note: r.note || "",
  }
}
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") { try { return JSON.parse(req.body) } catch { return {} } }
  const chunks = []; for await (const c of req) chunks.push(c)
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") } catch { return {} }
}
const bad = (msg) => Object.assign(new Error(msg), { http: 400 })
const limitArg = (v) => { if (v == null || v === "") return null; const n = parseInt(v, 10); if (!(n >= 1 && n <= 1000)) throw bad("Limits are 1 to 1000."); return n }

module.exports = async function handler(req, res) {
  const ok = authorized(req)
  if (ok === null) return send(res, 503, { error: "The license dashboard isn't set up yet: add ETKITS_ADMIN_PASSWORD (12+ characters) to the et-uikits Vercel project and redeploy." })
  if (!ok) { await sleep(800); return send(res, 401, { error: "Wrong password." }) }
  try {
    if (req.method === "GET") {
      const all = (await listAll()).map(view).sort((a, b) => String(b.lastSeen || b.firstSeen).localeCompare(String(a.lastSeen || a.firstSeen)))
      const products = slugs().map((s) => { const p = product(s); return { slug: s, name: p.name, deviceLimit: p.deviceLimit, claimLimit: p.claimLimit, gumroad: !!p.gumroadProductId, envato: p.envatoItemIds.length > 0, figma: !!p.figmaUrl("any") } })
      return send(res, 200, { licenses: all, products })
    }
    if (req.method !== "POST") { res.setHeader("allow", "GET, POST"); return send(res, 405, { error: "Use GET or POST." }) }
    const b = await readBody(req)
    const t = new Date().toISOString()

    if (b.action === "add") {
      const key = String(b.key || "").trim() || `ETK-${crypto.randomBytes(12).toString("hex").toUpperCase().match(/.{1,8}/g).join("-")}`
      if (!KEY_PATTERN.test(key)) throw bad("Keys use letters, numbers, - and _ (6 to 80 characters).")
      const products = [].concat(b.products || []).filter((s) => slugs().includes(s))
      if (!products.length) throw bad("Pick at least one product.")
      const id = hash(key)
      if (await load(id)) return send(res, 409, { error: "That key is already in the list." })
      const r = await update(id, (x) => { pushEvent(x, { kind: "admin", ok: true, note: "added" }) }, () => Object.assign(blank(key, "manual"), { products, email: String(b.email || "").slice(0, 120) || null, note: String(b.note || "").slice(0, 500), storeOk: true }))
      return send(res, 200, { license: view(r), key }) // the full key is shown once
    }

    const id = String(b.id || "")
    if (!/^[a-f0-9]{64}$/.test(id)) throw bad("Missing license id.")
    const r = await update(id, (x) => {
      switch (b.action) {
        case "revoke": x.revoked = true; x.revokedAt = t; x.revokedReason = String(b.reason || "").slice(0, 200) || null; break
        case "restore": x.revoked = false; x.revokedAt = null; x.revokedReason = null; break
        case "limit": x.limit = limitArg(b.limit); break
        case "claimLimit": x.claimLimit = limitArg(b.limit); break
        case "resetClaims": x.claims = 0; break
        case "removeDevice": x.devices = (x.devices || []).filter((d) => d.id !== b.device); break
        case "resetDevices": x.devices = []; break
        case "note": x.note = String(b.note || "").slice(0, 500); break
        default: throw bad("Unknown action.")
      }
      pushEvent(x, { kind: "admin", ok: true, note: b.action })
    })
    if (!r) return send(res, 404, { error: "No license with that id." })
    forget()
    return send(res, 200, { license: view(r) })
  } catch (e) {
    return send(res, e.http || 500, { error: e.http ? e.message : "Something went wrong talking to the license store." })
  }
}
