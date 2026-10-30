// Etsy order lookups for the license hub. Etsy has no license keys: a buyer enters their Etsy order
// number (the receipt id) and we check that the receipt belongs to our shop, is paid and not refunded,
// and contains one of our listings (products.js maps listing ids to products and tiers).
//
// Env: ETSY_KEYSTRING, ETSY_SHARED_SECRET (both from the Etsy app), ETSY_SHOP_ID,
//      ETSY_REFRESH_TOKEN (from the first OAuth grant, scope transactions_r).
// Access tokens last an hour. Each refresh returns a new refresh token, which is kept in the private
// Blob store (etsy/token.json) and used from then on; the env value is only the starting point.
// /api/etsy-keepalive (daily cron) refreshes once a day so the 90-day refresh token never lapses.
const API = "https://api.etsy.com/v3"
const TOKEN_PATH = "etsy/token.json"
const memory = { token: null }
const useMemory = () => process.env.LICENSE_STORE === "memory"

const configured = () => !!(process.env.ETSY_KEYSTRING && process.env.ETSY_SHARED_SECRET && process.env.ETSY_SHOP_ID && process.env.ETSY_REFRESH_TOKEN)
// Etsy requires "keystring:shared secret" in x-api-key.
const apiKey = () => `${process.env.ETSY_KEYSTRING}:${process.env.ETSY_SHARED_SECRET}`

async function readToken() {
  if (useMemory()) return memory.token
  const { get } = require("@vercel/blob")
  const res = await get(TOKEN_PATH, { access: "private", useCache: false }).catch(() => null)
  return res ? JSON.parse(await new Response(res.stream).text()) : null
}
async function writeToken(t) {
  if (useMemory()) { memory.token = t; return }
  const { put } = require("@vercel/blob")
  await put(TOKEN_PATH, JSON.stringify(t), { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true })
}

let cached = null // { access, expires } per warm instance
async function refresh(refreshToken) {
  const res = await fetch(`${API}/public/oauth/token`, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: process.env.ETSY_KEYSTRING, refresh_token: refreshToken }),
  }).catch(() => null)
  if (!res) return { ok: false, reason: "unreachable" }
  const d = await res.json().catch(() => ({}))
  if (!res.ok || !d.access_token) return { ok: false, reason: res.status >= 500 ? "unreachable" : "auth", detail: d.error_description || d.error || res.status }
  const t = { access: d.access_token, refresh: d.refresh_token || refreshToken, expires: Date.now() + (d.expires_in || 3600) * 1000 - 120000, refreshedAt: new Date().toISOString() }
  await writeToken(t)
  cached = t
  return { ok: true, token: t }
}
// A valid access token, refreshing when needed. Tries the stored refresh token first, then the env one.
async function accessToken(force) {
  if (!force && cached && cached.expires > Date.now()) return { ok: true, token: cached }
  const stored = await readToken().catch(() => null)
  if (!force && stored && stored.expires > Date.now()) { cached = stored; return { ok: true, token: stored } }
  const tries = [stored && stored.refresh, process.env.ETSY_REFRESH_TOKEN].filter((v, i, a) => v && a.indexOf(v) === i)
  let last = { ok: false, reason: "auth" }
  for (const rt of tries) { last = await refresh(rt); if (last.ok || last.reason === "unreachable") return last }
  return last
}

async function call(path) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const t = await accessToken(attempt > 0)
    if (!t.ok) return { status: 0, reason: t.reason }
    const res = await fetch(API + path, { headers: { "x-api-key": apiKey(), authorization: `Bearer ${t.token.access}` } }).catch(() => null)
    if (!res) return { status: 0, reason: "unreachable" }
    if (res.status === 401 && attempt === 0) { cached = null; continue } // token revoked or expired early
    return { status: res.status, data: await res.json().catch(() => null) }
  }
}

// Order numbers as buyers type them: "3456789012", "#3456789012", "Order #3456789012".
const ORDER = /^(?:order\s*)?#?\s*(\d{6,15})$/i
const orderNumber = (key) => { const m = String(key || "").trim().match(ORDER); return m ? m[1] : null }

// -> { ok: true, items: [{ listingId, title }], info } or { ok: false, reason }
async function receipt(orderNo) {
  if (!configured()) return { ok: false, reason: "not-configured" }
  const r = await call(`/application/shops/${encodeURIComponent(process.env.ETSY_SHOP_ID)}/receipts/${encodeURIComponent(orderNo)}`)
  if (r.status === 0) return { ok: false, reason: r.reason === "auth" ? "not-configured" : "unreachable" }
  if (r.status === 404 || r.status === 400 || r.status === 403) return { ok: false, reason: "invalid" } // not an order of this shop
  if (r.status !== 200 || !r.data) return { ok: false, reason: "unreachable" }
  const d = r.data
  if (d.shop_id && String(d.shop_id) !== String(process.env.ETSY_SHOP_ID)) return { ok: false, reason: "invalid" }
  const status = String(d.status || "").toLowerCase()
  if (status === "canceled" || status === "fully refunded") return { ok: false, reason: "refunded" }
  if (d.is_paid === false || status === "payment processing" || status === "open") return { ok: false, reason: "unpaid" }
  const items = (d.transactions || []).map((t) => ({ listingId: String(t.listing_id), title: t.title || "" }))
  const ts = d.create_timestamp || d.created_timestamp
  return { ok: true, items, info: { email: d.buyer_email || null, purchasedAt: ts ? new Date(ts * 1000).toISOString() : null, saleId: String(d.receipt_id || orderNo) } }
}

module.exports = { configured, orderNumber, receipt, accessToken }
