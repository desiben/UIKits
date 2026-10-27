// Smoke-test demos in isolation: node scripts/smoke.mjs <name> [name...] [--dark] [--out=DIR]
// Bundles demos/<name>.tsx with the showcase CSS, opens it in Chromium, prints runtime
// errors and writes DIR/<name>.png (default DIR: ./.smoke). Exit code 1 on any error.
import { build } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { chromium } from "playwright"
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { join, extname } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const args = process.argv.slice(2)
const dark = args.includes("--dark")
const outDir = (args.find((a) => a.startsWith("--out=")) || "--out=" + join(root, ".smoke")).slice(6)
const names = args.filter((a) => !a.startsWith("--"))
if (!names.length) { console.error("usage: node scripts/smoke.mjs <name> [...]"); process.exit(2) }
mkdirSync(outDir, { recursive: true })

mkdirSync(join(root, ".smoke"), { recursive: true })
const tmp = mkdtempSync(join(root, ".smoke", "tmp-"))
writeFileSync(join(tmp, "styles.css"), `@import "tailwindcss";\n@import "${root}showcase/theme.css";\n@source "${root}registry";\n@source "${root}demos";\n@custom-variant dark (&:is(.dark *));\n@layer base { * { border-color: var(--border); } body { background: var(--background); color: var(--foreground); font-family: ui-sans-serif, system-ui, sans-serif; } }\n`)
const entries = {}
for (const n of names) {
  if (!existsSync(join(root, "demos", n + ".tsx"))) { console.error(`no demo: demos/${n}.tsx`); process.exit(2) }
  writeFileSync(join(tmp, `${n}.tsx`), `import { createRoot } from "react-dom/client"\nimport { FacetMotion } from "@/registry/facet/lib/motion"\nimport Demo from "@/demos/${n}"\nimport "./styles.css"\n${dark ? 'document.documentElement.classList.add("dark")\n' : ""}createRoot(document.getElementById("root")!).render(<FacetMotion><div style={{padding:32,maxWidth:1100}}><Demo /></div></FacetMotion>)\n`)
  writeFileSync(join(tmp, `${n}.html`), `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script type="module" src="./${n}.tsx"></script></body></html>`)
  entries[n] = join(tmp, `${n}.html`)
}
await build({
  configFile: false, root: tmp, base: "./", logLevel: "error",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": root.replace(/\/$/, "") } },
  build: { outDir: join(tmp, "out"), rollupOptions: { input: entries }, chunkSizeWarningLimit: 99999 },
})

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" }
const browser = await chromium.launch()
let failed = false
for (const n of names) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
  const errs = []
  page.on("pageerror", (e) => errs.push(e.message))
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()) })
  await page.route("http://smoke.local/**", (route) => {
    const p = join(tmp, "out", new URL(route.request().url()).pathname)
    if (!existsSync(p)) return route.fulfill({ status: 404, body: "" })
    route.fulfill({ status: 200, body: readFileSync(p), contentType: types[extname(p)] || "application/octet-stream" })
  })
  await page.goto(`http://smoke.local/${n}.html`)
  await page.waitForTimeout(900)
  const empty = await page.evaluate(() => (document.getElementById("root")?.innerText || "").trim().length === 0 && !document.querySelector("#root svg, #root canvas, #root img, #root input"))
  if (empty) errs.push("demo rendered nothing")
  await page.screenshot({ path: join(outDir, `${n}${dark ? "-dark" : ""}.png`), fullPage: true })
  console.log(`${errs.length ? "FAIL" : "ok  "} ${n}${errs.length ? "\n  - " + errs.join("\n  - ") : ""}`)
  if (errs.length) failed = true
  await page.close()
}
await browser.close()
rmSync(tmp, { recursive: true, force: true })
process.exit(failed ? 1 : 0)
