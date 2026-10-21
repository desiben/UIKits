// POST /api/licenses/verify — for ETKits product sites (server to server), e.g. Facet UI's style guide
// unlock and its `npx facetui` installer.
//   Authorization: Bearer <ETKITS_SERVICE_TOKEN>      (same value set on the product's Vercel project)
//   { "key": "<buyer's license key>", "product": "facetui", "device": { "id": "…", "kind": "web" | "cli", "name": "Chrome on macOS" } }
// -> 200 { ok: true, product, email }   or   4xx/5xx { ok: false, error }   (error is safe to show the buyer)
const crypto = require("crypto")
const { authorize } = require("../_lib/licenses")

function send(res, status, body) {
  res.statusCode = status
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "no-store")
  res.end(JSON.stringify(body))
}
function serviceOk(req) {
  const token = process.env.ETKITS_SERVICE_TOKEN || ""
  if (token.length < 24) return null
  const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "")
  return crypto.timingSafeEqual(crypto.createHash("sha256").update(given).digest(), crypto.createHash("sha256").update(token).digest())
}
async function body(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") { try { return JSON.parse(req.body) } catch { return {} } }
  const chunks = []; for await (const c of req) chunks.push(c)
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") } catch { return {} }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("allow", "POST"); return send(res, 405, { ok: false, error: "Use POST." }) }
  const ok = serviceOk(req)
  if (ok === null) return send(res, 503, { ok: false, error: "License checking isn't set up yet. Please contact support." })
  if (!ok) return send(res, 401, { ok: false, error: "Not allowed." })
  const b = await body(req)
  const d = b.device || {}
  const device = { id: String(d.id || "").replace(/[^\w-]/g, "").slice(0, 64), kind: String(d.kind || "web").replace(/\W/g, "").slice(0, 10), name: String(d.name || "").slice(0, 80) }
  if (!device.id) return send(res, 400, { ok: false, error: "Missing device id." })
  try {
    const r = await authorize(b.key, String(b.product || ""), device)
    if (!r.ok) return send(res, r.status, { ok: false, error: r.error })
    return send(res, 200, { ok: true, product: b.product, email: r.record.email || null })
  } catch (e) {
    return send(res, 503, { ok: false, error: "License check failed. Please try again in a minute." })
  }
}
