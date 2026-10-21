// Facet UI license admin API, used by /admin.
// Every request needs  Authorization: Bearer <FACET_ADMIN_PASSWORD>  (set it on the Vercel project;
// the dashboard stays locked until you do).
//   GET  /api/admin                       -> { licenses: [...], defaultLimit }
//   POST /api/admin  { action, id, ... }  -> { license }
//     revoke {id, reason} · restore {id} · limit {id, limit|null} · removeDevice {id, device}
//     resetDevices {id} · note {id, note} · add {key, email, note}  (a manual key, e.g. for press)
const crypto = require("crypto")
const { load, update, listAll, hash, DEFAULT_LIMIT, forget } = require("./_lib/license")

function send(res, status, body) {
  res.statusCode = status
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "no-store")
  res.setHeader("x-robots-tag", "noindex")
  res.end(JSON.stringify(body))
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function authorized(req) {
  const pass = process.env.FACET_ADMIN_PASSWORD || ""
  if (pass.length < 12) return null // not configured (or too short to be safe)
  const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "")
  const a = crypto.createHash("sha256").update(given).digest(), b = crypto.createHash("sha256").update(pass).digest()
  return crypto.timingSafeEqual(a, b)
}

// What the dashboard sees: the key itself is only shown masked.
const mask = (k) => (k.length > 12 ? `${k.slice(0, 4)}…${k.slice(-4)}` : "••••")
function view(r) {
  return {
    id: r.id, keyMasked: mask(r.key || ""), source: r.source, email: r.email || null, product: r.product || null, variant: r.variant || null,
    purchasedAt: r.purchasedAt || null, firstSeen: r.firstSeen || r.createdAt, lastSeen: r.lastSeen || null,
    revoked: !!r.revoked, revokedReason: r.revokedReason || null, revokedAt: r.revokedAt || null,
    gumroadOk: r.gumroadOk !== false, gumroadReason: r.gumroadReason || null,
    limit: r.limit || null, devices: r.devices || [], events: r.events || [], note: r.note || "",
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") { try { return JSON.parse(req.body) } catch { return {} } }
  const chunks = []; for await (const c of req) chunks.push(c)
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") } catch { return {} }
}

module.exports = async function handler(req, res) {
  const ok = authorized(req)
  if (ok === null) return send(res, 503, { error: "The license dashboard isn't set up yet: add FACET_ADMIN_PASSWORD (12+ characters) to the facetui Vercel project and redeploy." })
  if (!ok) { await sleep(800); return send(res, 401, { error: "Wrong password." }) }

  try {
    if (req.method === "GET") {
      const all = (await listAll()).map(view).sort((a, b) => String(b.lastSeen || b.firstSeen).localeCompare(String(a.lastSeen || a.firstSeen)))
      return send(res, 200, { licenses: all, defaultLimit: DEFAULT_LIMIT() })
    }
    if (req.method !== "POST") { res.setHeader("allow", "GET, POST"); return send(res, 405, { error: "Use GET or POST." }) }

    const b = await readBody(req)
    const t = new Date().toISOString()
    if (b.action === "add") {
      const key = String(b.key || "").trim() || `FACET-${crypto.randomBytes(12).toString("hex").toUpperCase().match(/.{1,8}/g).join("-")}`
      if (!/^[\w-]{6,80}$/.test(key)) return send(res, 400, { error: "Keys use letters, numbers, - and _ (6 to 80 characters)." })
      const id = hash(key)
      if (await load(id)) return send(res, 409, { error: "That key is already in the list." })
      const r = await update(id, () => true, () => ({ id, key, source: "manual", email: String(b.email || "").slice(0, 120) || null, note: String(b.note || "").slice(0, 500), createdAt: t, firstSeen: t, devices: [], events: [], revoked: false, limit: null, gumroadOk: true }))
      return send(res, 200, { license: view(r), key }) // the full key is shown once, so you can send it
    }

    const id = String(b.id || "")
    if (!/^[a-f0-9]{64}$/.test(id)) return send(res, 400, { error: "Missing license id." })
    const r = await update(id, (rec) => {
      switch (b.action) {
        case "revoke": rec.revoked = true; rec.revokedAt = t; rec.revokedReason = String(b.reason || "").slice(0, 200) || null; break
        case "restore": rec.revoked = false; rec.revokedAt = null; rec.revokedReason = null; break
        case "limit": { const n = b.limit == null || b.limit === "" ? null : parseInt(b.limit, 10); if (n !== null && !(n >= 1 && n <= 1000)) throw Object.assign(new Error("Limit must be 1 to 1000."), { http: 400 }); rec.limit = n; break }
        case "removeDevice": rec.devices = (rec.devices || []).filter((d) => d.id !== b.device); break
        case "resetDevices": rec.devices = []; break
        case "note": rec.note = String(b.note || "").slice(0, 500); break
        default: throw Object.assign(new Error("Unknown action."), { http: 400 })
      }
      rec.events = [{ t, kind: "admin", ok: true, note: b.action }, ...(rec.events || [])].slice(0, 30)
    })
    if (!r) return send(res, 404, { error: "No license with that id." })
    forget() // drop this instance's caches so the change applies at once here
    return send(res, 200, { license: view(r) })
  } catch (e) {
    return send(res, e.http || 500, { error: e.http ? e.message : "Something went wrong talking to the license store." })
  }
}
