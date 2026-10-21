// POST /api/claim  { "key": "<Gumroad license key or Envato purchase code>" }
// Verifies the purchase through the ETKits license manager (api/_lib/licenses.js) and, only for a
// valid, paid, non-refunded, non-revoked sale under its claim limit, returns the private delivery
// links for that product. Links live in Vercel environment variables (see api/_lib/products.js).
// UI8 has no public verification API: UI8 buyers download from UI8 directly.
const { claim } = require("./_lib/licenses")

function send(res, status, payload) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", "no-store")
  res.end(JSON.stringify(payload))
}
function readKey(req) {
  const body = req.body
  if (body && typeof body === "object") return body.key
  if (typeof body === "string") { try { return JSON.parse(body).key } catch (e) { return undefined } }
  return undefined
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return send(res, 405, { ok: false, error: "Use POST." }) }
  try {
    const r = await claim(readKey(req))
    if (!r.ok) return send(res, r.status, { ok: false, error: r.error })
    return send(res, 200, { ok: true, product: r.product.name, store: r.record.store, license: r.record.variant || null, usesLeft: r.usesLeft, figmaUrl: r.figmaUrl, downloadUrl: r.downloadUrl || null })
  } catch (e) {
    return send(res, 502, { ok: false, error: "We couldn't verify your purchase right now. Please try again in a minute." })
  }
}
