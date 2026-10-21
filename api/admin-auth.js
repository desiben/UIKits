// POST /api/admin-auth — sign-in for the ETKits dashboard (password + authenticator code).
// See api/_lib/admin-auth.js for the steps.
const { signIn } = require("./_lib/admin-auth")

async function qrSvg(text) { return require("qrcode").toString(text, { type: "svg", margin: 1, errorCorrectionLevel: "M" }) }
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") { try { return JSON.parse(req.body) } catch { return {} } }
  const chunks = []; for await (const c of req) chunks.push(c)
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") } catch { return {} }
}

module.exports = async function handler(req, res) {
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "no-store")
  res.setHeader("x-robots-tag", "noindex")
  if (req.method !== "POST") { res.statusCode = 405; res.setHeader("allow", "POST"); return res.end(JSON.stringify({ error: "Use POST." })) }
  try {
    const b = await readBody(req)
    const r = await signIn({ password: String(b.password || ""), code: b.code, recovery: b.recovery, secret: b.secret }, qrSvg)
    if (r.status === 401) await new Promise((ok) => setTimeout(ok, 700)) // slow down guessing
    res.statusCode = r.status
    res.end(JSON.stringify(r.body))
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: "Sign-in failed. Please try again." }))
  }
}
