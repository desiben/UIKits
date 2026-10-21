// Facet UI React registry, gated by license key.
// GET /r/<name>.json  (rewritten to /api/r/<name>)  with  Authorization: Bearer <Gumroad license key>
// Used by the facetui CLI (cli/). /r/index.json lists every item.
// Env: GUMROAD_PRODUCT_ID (required)  ·  FACET_EXTRA_KEYS (optional, comma-separated keys for testers/press)
//      FACET_BLOCKED_KEYS (optional, comma-separated keys to refuse, e.g. a leaked key)
const fs = require("fs")
const path = require("path")

const REGISTRY_DIR = [path.join(__dirname, "..", "_registry"), path.join(process.cwd(), "api", "_registry")].find((d) =>
  fs.existsSync(d),
)
const DOCS = "https://facetui.vercel.app/react/#install"
const TTL_MS = 10 * 60 * 1000
const verified = new Map() // key -> expiry timestamp (per warm instance)

const list = (v) => String(v || "").split(",").map((s) => s.trim()).filter(Boolean)

async function isValidKey(key) {
  if (list(process.env.FACET_BLOCKED_KEYS).includes(key)) return false
  const extra = (process.env.FACET_EXTRA_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean)
  if (extra.includes(key)) return true
  const until = verified.get(key)
  if (until && until > Date.now()) return true
  const productId = process.env.GUMROAD_PRODUCT_ID
  if (!productId) return false
  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ product_id: productId, license_key: key, increment_uses_count: "false" }),
  }).catch(() => null)
  const data = res ? await res.json().catch(() => ({})) : {}
  const p = data.purchase || {}
  const ok = data.success === true && !p.refunded && !p.chargebacked && !p.disputed
  if (ok) verified.set(key, Date.now() + TTL_MS)
  return ok
}

function fail(res, status, error) {
  res.statusCode = status
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "no-store")
  res.end(JSON.stringify({ error, docs: DOCS }))
}

module.exports = async function handler(req, res) {
  const name = String((req.query && req.query.name) || "").replace(/\.json$/, "")
  if (!/^[a-z0-9-]+$/.test(name)) return fail(res, 400, "Unknown item.")
  if (!REGISTRY_DIR) return fail(res, 500, "Registry is not available.")
  const file = path.join(REGISTRY_DIR, `${name}.json`)
  if (!fs.existsSync(file)) return fail(res, 404, `No Facet UI item called "${name}".`)
  const auth = String(req.headers.authorization || "")
  const key = ((auth.match(/^Bearer\s+(.+)$/i) || [])[1] || "").trim()
  if (!key || key.startsWith("${")) {
    return fail(res, 401, "Facet UI license key required. Add FACET_LICENSE_KEY=<key from your Gumroad receipt> to .env.local, then run npx facetui@latest add <component>.")
  }
  if (!(await isValidKey(key))) return fail(res, 403, "This Facet UI license key is not valid (or the purchase was refunded).")
  res.statusCode = 200
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "private, no-store")
  res.end(fs.readFileSync(file))
}
