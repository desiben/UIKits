// Builds the Lucide icon sprites for the style guide.
//   node scripts/build-lucide.mjs <lucide-static package dir> <lucide repo dir>
// Get the inputs with:
//   npm pack lucide-static && tar xzf lucide-static-*.tgz            (-> ./package)
//   git clone --depth 1 --filter=blob:none --sparse https://github.com/lucide-icons/lucide.git
//   git -C lucide sparse-checkout set --no-cone '/categories/*.json' '/icons/*.json'
// Writes:
//   styleguide/assets/lucide.js  every Lucide icon (+ legacy alias ids) and its search metadata
//   styleguide/assets/icons.js   the core sprite (the icons the kit itself uses), redrawn from the same version
import fs from "node:fs"
import path from "node:path"

const [pkgDir, repoDir] = process.argv.slice(2)
if (!pkgDir || !repoDir) {
  console.error("usage: node scripts/build-lucide.mjs <lucide-static package dir> <lucide repo dir>")
  process.exit(1)
}
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"))
const version = read(path.join(pkgDir, "package.json")).version
const nodes = read(path.join(pkgDir, "icon-nodes.json"))
const tags = read(path.join(pkgDir, "tags.json"))

const categories = {}
for (const f of fs.readdirSync(path.join(repoDir, "categories")).filter((f) => f.endsWith(".json")).sort()) {
  categories[f.slice(0, -5)] = read(path.join(repoDir, "categories", f)).title
}
const catIds = Object.keys(categories)
const aliases = {}
const meta = {}
for (const name of Object.keys(nodes)) {
  const f = path.join(repoDir, "icons", name + ".json")
  const m = fs.existsSync(f) ? read(f) : {}
  meta[name] = { cats: m.categories || [], tags: tags[name] || [] }
  for (const a of m.aliases || []) aliases[typeof a === "string" ? a : a.name] = name
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
const inner = (name) => nodes[name].map(([tag, at]) => `<${tag}${Object.entries(at).filter(([k]) => k !== "key").map(([k, v]) => ` ${k}="${esc(v)}"`).join("")}/>`).join("")
const symbol = (id, body) => `<symbol id="${id}" viewBox="0 0 24 24">${body}</symbol>`
const names = Object.keys(nodes).sort()
const js = (s) => JSON.stringify(s).replace(/<\//g, "<\\/")

// Full set: every icon once, legacy names point at the current drawing.
const full = names.map((n) => symbol(n, inner(n))).join("") +
  Object.entries(aliases).filter(([a]) => !nodes[a]).map(([a, n]) => symbol(a, `<use href="#${n}"/>`)).join("")
const index = names.map((n) => [n, meta[n].cats.map((c) => catIds.indexOf(c)).filter((k) => k >= 0), meta[n].tags.join(" ")])
fs.writeFileSync(path.join(ROOT, "styleguide/assets/lucide.js"),
  `/* Facet UI — the full Lucide icon set v${version} (ISC License, https://lucide.dev). ${names.length} icons + ${Object.keys(aliases).length} legacy names.\n` +
  `   Load it after icons.js. Ids already on the page are skipped, so it never clashes with the core sprite. */\n` +
  `(function(){var s=${js(`<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${full}</svg>`)};` +
  `var d=document.createElement("div");d.innerHTML=s;var svg=d.firstChild;` +
  `[].slice.call(svg.children).forEach(function(c){if(document.getElementById(c.id))svg.removeChild(c)});` +
  `var ins=function(){document.body.insertBefore(svg,document.body.firstChild);window.FACET_LUCIDE=${js({ version, categories: catIds.map((c) => categories[c]), aliases, icons: index })};document.dispatchEvent(new Event("facet:lucide"))};` +
  `if(document.body)ins();else document.addEventListener("DOMContentLoaded",ins)})();\n`)

// Core sprite: keep its ids (old names included) so every page keeps working; redraw from this version.
const corePath = path.join(ROOT, "styleguide/assets/icons.js")
const core = fs.readFileSync(corePath, "utf8")
const ids = [...core.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1])
const kept = Object.fromEntries([...core.matchAll(/(<symbol id="([^"]+)"[^>]*>[\s\S]*?<\/symbol>)/g)].map((m) => [m[2], m[1]]))
const list = core.match(/window\.FACET_ICONS=(\[[^\]]*\])/)[1]
const coreSymbols = ids.map((id) => {
  const n = nodes[id] ? id : aliases[id]
  return n ? symbol(id, inner(n)) : kept[id] // brand icons Lucide dropped (e.g. github) stay as they were
}).join("")
fs.writeFileSync(corePath,
  `/* Facet UI icon sprite — Lucide v${version} (ISC License, https://lucide.dev). Injected at runtime so <use href="#name"> works everywhere, including file://\n` +
  `   This is the core set the kit uses. assets/lucide.js adds every other Lucide icon. */\n` +
  `(function(){var s=${js(`<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${coreSymbols}</svg>`)};` +
  `var d=document.createElement("div");d.innerHTML=s;var ins=function(){document.body.insertBefore(d.firstChild,document.body.firstChild)};if(document.body)ins();else document.addEventListener("DOMContentLoaded",ins);window.FACET_ICONS=${list};})();\n`)

console.log(`lucide.js: ${names.length} icons, ${Object.keys(aliases).length} aliases, ${catIds.length} categories · icons.js: ${ids.length} core icons (v${version})`)
