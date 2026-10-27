// Facet UI registry, gated by license key.
// GET /r/<name>.json  (rewritten to /api/r/<name>)  with  Authorization: Bearer <license key>
// Used by the facetui CLI (cli/) and by the style guide's "Unlock code" (docs-snippets).
// /r/index.json lists every item. Keys, devices and revocation: see ../_lib/license.js and /admin.
const fs = require("fs")
const path = require("path")
const { authorize, deviceFrom } = require("../_lib/license")

const REGISTRY_DIR = [path.join(__dirname, "..", "_registry"), path.join(process.cwd(), "api", "_registry")].find((d) =>
  fs.existsSync(d),
)
const DOCS = "https://facet.etkits.us/react/#install"

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
  const device = deviceFrom(req, name === "docs-snippets" ? "web" : "cli")
  if (!device.id) return fail(res, 400, "This version of facetui is out of date. Run npx facetui@latest (or reload the style guide).")
  let result
  try { result = await authorize(key, device) }
  catch (e) { return fail(res, 503, "License check failed. Please try again in a minute.") }
  if (!result.ok) return fail(res, result.status, result.error)
  res.statusCode = 200
  res.setHeader("content-type", "application/json")
  res.setHeader("cache-control", "private, no-store")
  res.end(fs.readFileSync(file))
}
