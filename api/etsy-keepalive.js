// GET /api/etsy-keepalive: run daily by Vercel Cron (vercel.json) so the Etsy refresh token is used
// regularly and never reaches its 90-day expiry, even when no Etsy buyer claims for a while.
// Vercel sends "Authorization: Bearer <CRON_SECRET>"; anything else is refused.
const etsy = require("./_lib/etsy")

module.exports = async function handler(req, res) {
  const send = (status, body) => { res.statusCode = status; res.setHeader("content-type", "application/json"); res.setHeader("cache-control", "no-store"); res.end(JSON.stringify(body)) }
  const secret = process.env.CRON_SECRET
  if (!secret || String(req.headers.authorization || "") !== `Bearer ${secret}`) return send(401, { ok: false })
  if (!etsy.configured()) return send(200, { ok: false, reason: "not-configured" })
  const t = await etsy.accessToken(true)
  return send(t.ok ? 200 : 502, { ok: t.ok, reason: t.ok ? undefined : t.reason, refreshedAt: t.ok ? t.token.refreshedAt : undefined })
}
