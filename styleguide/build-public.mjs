// Builds the public copy of the style guide that Vercel serves (public-build/).
// The repo and the buyer download keep the readable source; the public site gets minified
// CSS/JS with a license banner, and never the source parts (assets/src) or the registry data.
//   node build-public.mjs        (Vercel runs this as the build command)
import fs from "node:fs"
import path from "node:path"
import { transform } from "esbuild"

const ROOT = path.dirname(new URL(import.meta.url).pathname)
const OUT = path.join(ROOT, "public-build")
// Never published: the server code + registry, readable sources, and build tooling.
const SKIP = new Set(["public-build", "node_modules", "api", "package.json", "package-lock.json", "build-public.mjs", "vercel.json", ".gitignore", "assets/src", "assets/buyer.js"])
// Already minified (React showcase) or third-party under its own license (Lucide, ISC).
const KEEP = (rel) => rel.startsWith("react/assets/") || rel === "assets/icons.js" || rel === "assets/lucide.js"
const BANNER = "/*! Facet UI · © 2026 ETKits · Licensed to Facet UI buyers only, not for redistribution. https://www.etkits.us */"

let min = 0, copied = 0, saved = 0
async function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name)
    if (SKIP.has(rel) || e.name === ".DS_Store") continue
    const from = path.join(ROOT, rel), to = path.join(OUT, rel)
    if (e.isDirectory()) { await walk(rel); continue }
    fs.mkdirSync(path.dirname(to), { recursive: true })
    const ext = path.extname(e.name)
    if ((ext === ".css" || ext === ".js") && !KEEP(rel)) {
      const src = fs.readFileSync(from, "utf8")
      const { code } = await transform(src, { loader: ext.slice(1), minify: true, legalComments: "none", target: "es2019" })
      fs.writeFileSync(to, `${BANNER}\n${code}`)
      saved += src.length - code.length; min++
    } else { fs.copyFileSync(from, to); copied++ }
  }
}
fs.rmSync(OUT, { recursive: true, force: true })
await walk(".")
// The style guide's Changelog page reads CHANGELOG.md from the repo root.
const CHANGELOG = path.join(ROOT, "../CHANGELOG.md")
if (fs.existsSync(CHANGELOG)) fs.copyFileSync(CHANGELOG, path.join(OUT, "CHANGELOG.md"))
else console.warn("CHANGELOG.md not found next to styleguide/: the Changelog page will show a fallback")
console.log(`public-build: ${min} files minified (${Math.round(saved / 1024)} KB smaller), ${copied} copied`)
