// Facet UI asks ETKits whether a license key may be used. ETKits (www.etkits.us) is the license
// hub for every ETKits product: it checks the purchase with the store, counts devices, and lets you
// revoke keys from its dashboard at www.etkits.us/admin.
//
// Env: ETKITS_SERVICE_TOKEN (same value as on the et-uikits project), ETKITS_URL (optional).
const PRODUCT = "facetui"
const HUB = () => (process.env.ETKITS_URL || "https://www.etkits.us").replace(/\/$/, "")
const recentOk = new Map() // key|device -> until. The CLI fetches many items in a row; ask the hub once a minute.

// device: { id, kind: "web" | "cli", name }. Returns { ok: true } or { ok: false, status, error }.
async function authorize(key, device) {
  const memo = key + "|" + device.id
  if ((recentOk.get(memo) || 0) > Date.now()) return { ok: true }
  const token = process.env.ETKITS_SERVICE_TOKEN
  if (!token) return { ok: false, status: 503, error: "License checking isn't set up yet. Please contact support." }
  const res = await fetch(`${HUB()}/api/licenses/verify`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ key, product: PRODUCT, device }),
  }).catch(() => null)
  if (!res) return { ok: false, status: 503, error: "Couldn't reach the license server. Please try again in a minute." }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) return { ok: false, status: res.status === 401 ? 503 : res.status || 503, error: data.error || "License check failed. Please try again in a minute." }
  recentOk.set(memo, Date.now() + 60 * 1000)
  return { ok: true }
}

// Device info sent by the style guide (assets/license.js) and the CLI (cli/bin/facetui.mjs).
function deviceFrom(req, fallbackKind) {
  const h = (n) => String(req.headers[n] || "").slice(0, 120)
  return { id: h("x-facet-device").replace(/[^\w-]/g, "") || null, kind: (h("x-facet-client") || fallbackKind || "api").replace(/\W/g, "").slice(0, 10), name: h("x-facet-device-name") }
}

module.exports = { authorize, deviceFrom }
