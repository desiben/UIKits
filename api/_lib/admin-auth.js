// Admin sign-in for the ETKits dashboard: password + authenticator code (TOTP, RFC 6238),
// one-time recovery codes, signed 12-hour sessions, and a lockout after repeated failures.
// The 2FA secret and hashed recovery codes live in the private license store (admin/2fa.json),
// so setup happens on the login page with no redeploy.
//
// Env: ETKITS_ADMIN_PASSWORD (12+ characters)
//      ETKITS_2FA_RESET=1   (emergency only: lets you set up 2FA again with the password alone;
//                            remove it and redeploy straight after)
const crypto = require("crypto")

const SESSION_MS = 12 * 60 * 60 * 1000
const MAX_FAILS = 5, LOCK_MS = 15 * 60 * 1000
const STEP = 30, DIGITS = 6
const ISSUER = "ETKits"

/* ---------- small JSON store on the private Blob store (memory for local tests) ---------- */
const memory = new Map()
const useMemory = () => process.env.LICENSE_STORE === "memory"
async function read(pathname) {
  if (useMemory()) { const v = memory.get(pathname); return v ? { data: JSON.parse(v.body), etag: v.etag } : null }
  const { get } = require("@vercel/blob")
  const res = await get(pathname, { access: "private", useCache: false })
  return res ? { data: JSON.parse(await new Response(res.stream).text()), etag: res.blob && res.blob.etag } : null
}
async function write(pathname, data, etag) {
  const body = JSON.stringify(data)
  if (useMemory()) {
    const cur = memory.get(pathname)
    if (etag && cur && cur.etag !== etag) throw Object.assign(new Error("conflict"), { conflict: true })
    memory.set(pathname, { body, etag: crypto.randomUUID() }); return
  }
  const { put } = require("@vercel/blob")
  await put(pathname, body, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true, ...(etag ? { ifMatch: etag } : {}) })
}
async function remove(pathname) {
  if (useMemory()) return void memory.delete(pathname)
  const { del } = require("@vercel/blob")
  await del(pathname).catch(() => {})
}
const TWOFA = "admin/2fa.json", LOCK = "admin/lockout.json"

/* ---------- TOTP ---------- */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
function base32(buf) { let bits = "", out = ""; for (const b of buf) bits += b.toString(2).padStart(8, "0"); for (let i = 0; i + 5 <= bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5), 2)]; return out }
function unbase32(s) { let bits = ""; for (const c of s.replace(/=+$/, "").toUpperCase()) { const v = B32.indexOf(c); if (v < 0) continue; bits += v.toString(2).padStart(5, "0") } const out = []; for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2)); return Buffer.from(out) }
function hotp(secret, counter) {
  const buf = Buffer.alloc(8); buf.writeBigUInt64BE(BigInt(counter))
  const h = crypto.createHmac("sha1", unbase32(secret)).update(buf).digest()
  const o = h[h.length - 1] & 15
  return String(((h.readUInt32BE(o) & 0x7fffffff) % 10 ** DIGITS)).padStart(DIGITS, "0")
}
// Returns the matching time step (to stop reuse), or null. Allows one step of clock drift.
function totpStep(secret, code, at = Date.now()) {
  const step = Math.floor(at / 1000 / STEP)
  for (const s of [step, step - 1, step + 1]) if (crypto.timingSafeEqual(Buffer.from(hotp(secret, s)), Buffer.from(String(code).padStart(DIGITS, "0").slice(0, DIGITS)))) return s
  return null
}
const newSecret = () => base32(crypto.randomBytes(20))
const otpauth = (secret) => `otpauth://totp/${encodeURIComponent(ISSUER + ":admin")}?secret=${secret}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=${DIGITS}&period=${STEP}`
const hashCode = (c) => crypto.createHash("sha256").update(String(c).replace(/[^a-z0-9]/gi, "").toLowerCase()).digest("hex")
const newRecoveryCodes = () => Array.from({ length: 10 }, () => crypto.randomBytes(5).toString("hex").replace(/(.{5})/, "$1-"))

/* ---------- password, lockout, sessions ---------- */
const sameHash = (a, b) => crypto.timingSafeEqual(crypto.createHash("sha256").update(String(a)).digest(), crypto.createHash("sha256").update(String(b)).digest())
function passwordOk(given) { const p = process.env.ETKITS_ADMIN_PASSWORD || ""; return p.length >= 12 && sameHash(given || "", p) }
const configured = () => (process.env.ETKITS_ADMIN_PASSWORD || "").length >= 12

async function lockState() { const l = await read(LOCK).catch(() => null); return l ? l.data : { fails: 0, until: 0 } }
async function locked() { const l = await lockState(); return l.until > Date.now() ? Math.ceil((l.until - Date.now()) / 60000) : 0 }
async function failed() { const l = await lockState(); const fails = (l.until && l.until < Date.now() ? 0 : l.fails) + 1; await write(LOCK, { fails, until: fails >= MAX_FAILS ? Date.now() + LOCK_MS : 0 }).catch(() => {}) }
async function cleared() { await write(LOCK, { fails: 0, until: 0 }).catch(() => {}) }

// Sessions are signed with a key derived from the password and the 2FA secret: changing either signs everyone out.
const sessionKey = (secret) => crypto.createHash("sha256").update("etkits-admin|" + (process.env.ETKITS_ADMIN_PASSWORD || "") + "|" + secret).digest()
function issue(secret) {
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MS, n: crypto.randomBytes(6).toString("hex") })).toString("base64url")
  return body + "." + crypto.createHmac("sha256", sessionKey(secret)).update(body).digest("base64url")
}
async function verifySession(req) {
  if (!configured()) return { ok: false, status: 503, error: "The license dashboard isn't set up yet: add ETKITS_ADMIN_PASSWORD (12+ characters) to the et-uikits Vercel project and redeploy." }
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "")
  const [body, sig] = token.split(".")
  const tf = await read(TWOFA).catch(() => null)
  if (!body || !sig || !tf || !tf.data.enabled) return { ok: false, status: 401, error: "Please sign in." }
  const want = crypto.createHmac("sha256", sessionKey(tf.data.secret)).update(body).digest("base64url")
  if (want.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(want), Buffer.from(sig))) return { ok: false, status: 401, error: "Please sign in." }
  let p; try { p = JSON.parse(Buffer.from(body, "base64url").toString()) } catch { p = null }
  if (!p || p.exp < Date.now()) return { ok: false, status: 401, error: "Your session expired. Please sign in again." }
  return { ok: true }
}

/* ---------- sign-in steps ---------- */
// 1. { password }                      -> { next: "code" } or { next: "setup", secret, otpauth, qr }
// 2. { password, code | recovery }     -> { token }
//    setup: { password, secret, code } -> { token, recoveryCodes }  (shown once)
async function signIn({ password, code, recovery, secret: setupSecret }, qrSvg) {
  if (!configured()) return { status: 503, body: { error: "The license dashboard isn't set up yet: add ETKITS_ADMIN_PASSWORD (12+ characters) to the et-uikits Vercel project and redeploy." } }
  const mins = await locked()
  if (mins) return { status: 429, body: { error: `Too many attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.` } }
  if (!passwordOk(password)) { await failed(); return { status: 401, body: { error: "Wrong password." } } }

  const reset = process.env.ETKITS_2FA_RESET === "1"
  let tf = await read(TWOFA).catch(() => null)
  if (reset && tf && tf.data.enabled && !setupSecret) { await remove(TWOFA); tf = null }

  // First time (or after a reset): set up the authenticator app.
  if (!tf || !tf.data.enabled) {
    if (!setupSecret) { const s = newSecret(); return { status: 200, body: { next: "setup", secret: s, otpauth: otpauth(s), qr: await qrSvg(otpauth(s)) } } }
    if (!/^[A-Z2-7]{32}$/.test(setupSecret)) return { status: 400, body: { error: "Setup expired. Please start again." } }
    const step = totpStep(setupSecret, String(code || "").replace(/\D/g, ""))
    if (step === null) { await failed(); return { status: 401, body: { error: "That code didn't match. Check the time on your phone and try the newest code." } } }
    const codes = newRecoveryCodes()
    await write(TWOFA, { enabled: true, secret: setupSecret, enabledAt: new Date().toISOString(), lastStep: step, recovery: codes.map(hashCode) }, tf && tf.etag)
    await cleared()
    return { status: 200, body: { token: issue(setupSecret), recoveryCodes: codes } }
  }

  const s = tf.data
  if (!code && !recovery) return { status: 200, body: { next: "code" } }
  if (recovery) {
    const h = hashCode(recovery), i = (s.recovery || []).indexOf(h)
    if (i < 0) { await failed(); return { status: 401, body: { error: "That recovery code isn't valid (each one works once)." } } }
    s.recovery.splice(i, 1)
    await write(TWOFA, s, tf.etag); await cleared()
    return { status: 200, body: { token: issue(s.secret), recoveryLeft: s.recovery.length } }
  }
  const step = totpStep(s.secret, String(code).replace(/\D/g, ""))
  if (step === null || step <= (s.lastStep || 0)) { await failed(); return { status: 401, body: { error: step === null ? "That code didn't match. Try the newest code from your authenticator app." : "That code was already used. Wait for the next one." } } }
  s.lastStep = step
  await write(TWOFA, s, tf.etag).catch((e) => { if (!e.conflict) throw e })
  await cleared()
  return { status: 200, body: { token: issue(s.secret), recoveryLeft: (s.recovery || []).length } }
}

// Signed-in only: fresh recovery codes (old ones stop working).
async function regenerateRecovery() {
  const tf = await read(TWOFA)
  const codes = newRecoveryCodes()
  tf.data.recovery = codes.map(hashCode)
  await write(TWOFA, tf.data, tf.etag)
  return codes
}
async function status() { const tf = await read(TWOFA).catch(() => null); return { enabled: !!(tf && tf.data.enabled), enabledAt: tf && tf.data.enabledAt, recoveryLeft: tf ? (tf.data.recovery || []).length : 0 } }

module.exports = { signIn, verifySession, regenerateRecovery, status, hotp, totpStep, unbase32 }
