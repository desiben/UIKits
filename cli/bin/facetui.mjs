#!/usr/bin/env node
// facetui — installs Facet UI animated React components into your project.
// Made by ETKits · https://facetui.vercel.app/react/
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { createInterface } from "node:readline/promises"
import os from "node:os"
import { randomUUID } from "node:crypto"

const VERSION = "1.0.0"
const REGISTRY = (process.env.FACET_REGISTRY_URL || "https://facetui.vercel.app/r").replace(/\/$/, "")
const CONFIG = "facet.json"
const DOCS = "https://facetui.vercel.app/react/#install"
const cwd = process.cwd()

/* ---------- output ---------- */
const tty = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : String(s))
const c = { dim: paint(2), bold: paint(1), green: paint(32), red: paint(31), yellow: paint(33), cyan: paint(36) }
const log = (...a) => console.log(...a)
const ok = (s) => log(`${c.green("✔")} ${s}`)
const info = (s) => log(`${c.cyan("›")} ${s}`)
const warn = (s) => log(`${c.yellow("!")} ${s}`)
class CliError extends Error {}
const fail = (s) => { throw new CliError(s) }

/* ---------- args ---------- */
const argv = process.argv.slice(2)
const flags = new Set(argv.filter((a) => a.startsWith("-")))
const opt = (name) => { const i = argv.findIndex((a) => a === name || a.startsWith(name + "=")); if (i < 0) return undefined; const a = argv[i]; return a.includes("=") ? a.split("=").slice(1).join("=") : argv[i + 1] }
const positional = argv.filter((a, i) => !a.startsWith("-") && !["--css", "--cwd"].includes(argv[i - 1]))
const [command, ...names] = positional
const has = (...f) => f.some((x) => flags.has(x))

/* ---------- project helpers ---------- */
const root = opt("--cwd") ? path.resolve(cwd, opt("--cwd")) : cwd
const p = (...s) => path.join(root, ...s)
const exists = (f) => fs.existsSync(p(f))
const read = (f) => fs.readFileSync(p(f), "utf8")
const write = (f, s) => { fs.mkdirSync(path.dirname(p(f)), { recursive: true }); fs.writeFileSync(p(f), s) }
// tsconfig files are JSONC: drop comments and trailing commas before parsing.
const jsonc = (s) => JSON.parse(s.replace(/("(?:[^"\\]|\\.)*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str || "").replace(/,(\s*[}\]])/g, "$1"))

function pkgJson() {
  if (!exists("package.json")) fail(`No package.json in ${root}. Run facetui inside a React project (Next.js, Vite, React Router, Astro or TanStack Start).`)
  return JSON.parse(read("package.json"))
}
const allDeps = (pkg) => ({ ...pkg.dependencies, ...pkg.devDependencies })

function packageManager() {
  const ua = process.env.npm_config_user_agent || ""
  if (exists("pnpm-lock.yaml")) return "pnpm"
  if (exists("bun.lockb") || exists("bun.lock")) return "bun"
  if (exists("yarn.lock")) return "yarn"
  if (exists("package-lock.json")) return "npm"
  return ["pnpm", "bun", "yarn"].find((m) => ua.startsWith(m)) || "npm"
}

function framework(pkg) {
  const d = allDeps(pkg)
  if (d.next) return "next"
  if (d["@react-router/dev"]) return "react-router"
  if (d.astro) return "astro"
  if (d["@tanstack/react-start"]) return "tanstack-start"
  if (d.vite) return "vite"
  return "unknown"
}

const CSS_CANDIDATES = {
  next: ["app/globals.css", "src/app/globals.css", "styles/globals.css", "src/styles/globals.css"],
  vite: ["src/index.css", "src/App.css", "src/styles.css"],
  "react-router": ["app/app.css", "app/root.css"],
  astro: ["src/styles/global.css", "src/styles/globals.css"],
  "tanstack-start": ["src/styles.css", "src/styles/app.css", "app/styles/app.css"],
  unknown: ["src/index.css", "src/styles.css", "app/globals.css"],
}
function findCss(fw) {
  const list = CSS_CANDIDATES[fw] || CSS_CANDIDATES.unknown
  const hit = list.find(exists)
  if (hit) return hit
  // Otherwise any stylesheet that already imports Tailwind.
  const walk = (dir, depth = 0) => {
    if (depth > 3 || !fs.existsSync(p(dir))) return null
    for (const e of fs.readdirSync(p(dir), { withFileTypes: true })) {
      if (["node_modules", ".git", "dist", "build", ".next"].includes(e.name)) continue
      const rel = path.join(dir, e.name)
      if (e.isDirectory()) { const f = walk(rel, depth + 1); if (f) return f }
      else if (e.name.endsWith(".css") && /@import\s+["']tailwindcss["']/.test(read(rel))) return rel
    }
    return null
  }
  return walk(".")
}

function tsconfigFiles() { return ["tsconfig.json", "tsconfig.app.json"].filter(exists) }
// Where "@/…" points, read from tsconfig paths (e.g. "./src/*" -> "src").
function aliasBase() {
  for (const f of tsconfigFiles()) {
    try { const t = (jsonc(read(f)).compilerOptions || {}).paths?.["@/*"]?.[0]; if (t) return path.normalize(t.replace(/\*$/, "")).replace(/\/$/, "") || "." } catch {}
  }
  return null
}

function install(pm, deps, dev = false) {
  if (!deps.length) return
  const cmd = { npm: ["install", ...(dev ? ["-D"] : [])], pnpm: ["add", ...(dev ? ["-D"] : [])], yarn: ["add", ...(dev ? ["-D"] : [])], bun: ["add", ...(dev ? ["-d"] : [])] }[pm]
  info(`Installing ${deps.join(", ")} ${c.dim(`(${pm})`)}`)
  const r = spawnSync(pm, [...cmd, ...deps], { cwd: root, stdio: has("--verbose") ? "inherit" : ["ignore", "ignore", "inherit"], shell: process.platform === "win32" })
  if (r.status !== 0) fail(`${pm} could not install: ${deps.join(" ")}. Run it yourself, then try again.`)
}

/* ---------- license key ---------- */
function envFileKey() {
  for (const f of [".env.local", ".env"]) {
    if (!exists(f)) continue
    const m = read(f).match(/^\s*FACET_LICENSE_KEY\s*=\s*["']?([^"'\s#]+)/m)
    if (m) return m[1]
  }
  return null
}
async function licenseKey({ ask }) {
  const key = process.env.FACET_LICENSE_KEY || envFileKey()
  if (key) return key
  if (!ask || !process.stdin.isTTY) fail(`No license key found. Add FACET_LICENSE_KEY=<key from your Gumroad receipt> to .env.local (see ${DOCS}).`)
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question(`${c.cyan("?")} Facet UI license key ${c.dim("(from your Gumroad receipt)")}: `)).trim()
  rl.close()
  if (!answer) fail("A license key is required to download Facet UI components.")
  const env = exists(".env.local") ? read(".env.local") : ""
  write(".env.local", `${env}${env && !env.endsWith("\n") ? "\n" : ""}FACET_LICENSE_KEY=${answer}\n`)
  const gi = exists(".gitignore") ? read(".gitignore") : ""
  if (!/^\.env(\.local|\*|\.\*)?\s*$/m.test(gi)) write(".gitignore", `${gi}${gi && !gi.endsWith("\n") ? "\n" : ""}.env.local\n`)
  ok("Saved the key to .env.local (git-ignored)")
  return answer
}

/* ---------- registry ---------- */
// A random id for this machine, so a license can be limited to a number of devices.
let device
function deviceHeaders() {
  if (!device) {
    const dir = path.join(os.homedir(), ".config", "facetui"), file = path.join(dir, "device.json")
    try { device = JSON.parse(fs.readFileSync(file, "utf8")) } catch {}
    if (!device || !device.id) {
      device = { id: randomUUID() }
      try { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file, JSON.stringify(device) + "\n") } catch {}
    }
  }
  const platform = { darwin: "macOS", win32: "Windows", linux: "Linux" }[process.platform] || process.platform
  return { "X-Facet-Device": device.id, "X-Facet-Client": "cli", "X-Facet-Device-Name": `${os.hostname().split(".")[0].slice(0, 40)} · ${platform}` }
}

async function fetchItem(name, key) {
  let res
  try { res = await fetch(`${REGISTRY}/${encodeURIComponent(name)}.json`, { headers: { Authorization: `Bearer ${key}`, "User-Agent": `facetui/${VERSION}`, ...deviceHeaders() } }) }
  catch (e) { fail(`Could not reach ${REGISTRY} (${e.cause?.code || e.message}). Check your connection.`) }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) fail(body.error || `The registry answered ${res.status} for "${name}".`)
  return body
}
async function resolve(namesIn, key) {
  const seen = new Map()
  const visit = async (n) => {
    if (seen.has(n)) return
    seen.set(n, null)
    const item = await fetchItem(n, key)
    for (const r of item.requires || []) await visit(r)
    seen.set(n, item)
  }
  for (const n of namesIn) await visit(n)
  return [...seen.values()]
}

/* ---------- config ---------- */
function loadConfig() {
  if (!exists(CONFIG)) fail(`No ${CONFIG} here. Run ${c.bold("npx facetui@latest init")} first.`)
  return JSON.parse(read(CONFIG))
}
// "@/components/ui" -> "src/components/ui"
const aliasToPath = (cfg, alias) => alias.startsWith("@/") ? path.join(cfg.baseDir || ".", alias.slice(2)) : alias

function rewriteImports(src, cfg) {
  return src
    .replace(/(["'])@\/registry\/facet\/ui\//g, `$1${cfg.aliases.ui}/`)
    .replace(/(["'])@\/registry\/facet\/lib\/utils(["'])/g, `$1${cfg.aliases.utils}$2`)
    .replace(/(["'])@\/registry\/facet\/lib\//g, `$1${cfg.aliases.lib}/`)
    .replace(/(["'])@\/registry\/facet\/hooks\//g, `$1${cfg.aliases.hooks}/`)
}
function targetFor(file, cfg) {
  const name = path.basename(file.path)
  if (file.type === "ui") return path.join(aliasToPath(cfg, cfg.aliases.ui), name)
  if (file.type === "hook") return path.join(aliasToPath(cfg, cfg.aliases.hooks), name)
  if (name.startsWith("utils.")) return aliasToPath(cfg, cfg.aliases.utils) + path.extname(name)
  return path.join(aliasToPath(cfg, cfg.aliases.lib), name)
}

const START = "/* facet-ui:theme — managed by `npx facetui`, edits here are replaced on update */"
const END = "/* facet-ui:theme end */"
function applyTheme(cfg, css) {
  let s = exists(cfg.css) ? read(cfg.css) : ""
  const block = `${START}\n${css.trim()}\n${END}`
  const re = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
  if (re.test(s)) s = s.replace(re, block)
  else {
    if (!/@import\s+["']tailwindcss["']/.test(s)) s = `@import "tailwindcss";\n${s}`
    s = s.replace(/(@import\s+["']tailwindcss["'][^;]*;\n?)/, `$1\n${block}\n`)
  }
  if (exists(cfg.css) && read(cfg.css) === s) return false
  write(cfg.css, s)
  return true
}

/* ---------- commands ---------- */
async function add(list, { all = false, ask = true } = {}) {
  const cfg = loadConfig()
  const pkg = pkgJson()
  const wanted = all ? ["all"] : list
  if (!wanted.length) fail(`Name at least one component, e.g. ${c.bold("npx facetui add button")}, or use ${c.bold("--all")}.`)
  const key = await licenseKey({ ask })
  const items = await resolve(wanted, key)
  const written = [], skipped = [], deps = new Set()
  for (const item of items) {
    for (const d of item.dependencies || []) deps.add(d)
    if (item.type === "theme" && item.css && !has("--dry-run") && applyTheme(cfg, item.css)) written.push(`${cfg.css} ${c.dim("(theme)")}`)
    for (const f of item.files || []) {
      const target = targetFor(f, cfg)
      const content = rewriteImports(f.content, cfg)
      if (exists(target)) {
        if (read(target) === content) continue
        if (!has("--overwrite", "-o")) { skipped.push(target); continue }
      }
      if (!has("--dry-run")) write(target, content)
      written.push(target)
    }
  }
  const have = allDeps(pkg)
  const missing = [...deps].filter((d) => !have[d])
  if (has("--dry-run")) { log(c.bold("Dry run — nothing written.")); written.forEach((f) => log(`  ${f}`)); if (missing.length) log(`  packages: ${missing.join(", ")}`); return }
  install(packageManager(), missing)
  const comps = items.filter((i) => i.type === "component").length
  if (written.length) { ok(`Added ${comps ? `${comps} component${comps === 1 ? "" : "s"}` : "the base files"}:`); written.forEach((f) => log(`  ${c.dim("•")} ${f}`)) }
  if (skipped.length) { warn(`Kept ${skipped.length} file${skipped.length === 1 ? "" : "s"} you already have (use --overwrite to replace):`); skipped.forEach((f) => log(`  ${c.dim("•")} ${f}`)) }
  if (!written.length && !skipped.length) ok("Everything is already up to date.")
}

async function init() {
  const pkg = pkgJson()
  const fw = framework(pkg)
  const pm = packageManager()
  const d = allDeps(pkg)
  log(`${c.bold("Facet UI")} ${c.dim(`· ${fw === "unknown" ? "React project" : fw} · ${pm}`)}`)
  if (!d.react) fail("This project doesn't use React. Facet UI components need React 19 or newer.")
  if (exists(CONFIG) && !has("--force")) {
    info(`${CONFIG} already exists — refreshing the theme and base files (use --force to start over).`)
    return add(["theme", "utils", "motion"])
  }

  // Tailwind CSS v4
  const twMajor = parseInt(String(d.tailwindcss || "").replace(/[^\d.]/g, ""), 10)
  if (!d.tailwindcss) {
    if (fw === "vite" || fw === "react-router" || fw === "tanstack-start") {
      install(pm, ["tailwindcss", "@tailwindcss/vite"])
      const vc = ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"].find(exists)
      if (vc) {
        let s = read(vc)
        if (!s.includes("@tailwindcss/vite")) {
          s = `import tailwindcss from "@tailwindcss/vite"\n${s}`.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ")
          write(vc, s); ok(`Added Tailwind to ${vc}`)
        }
      } else warn("Add the @tailwindcss/vite plugin to your Vite config.")
    } else if (fw === "next") {
      install(pm, ["tailwindcss", "@tailwindcss/postcss", "postcss"])
      if (!["postcss.config.mjs", "postcss.config.js", "postcss.config.cjs"].some(exists)) { write("postcss.config.mjs", `export default { plugins: { "@tailwindcss/postcss": {} } }\n`); ok("Created postcss.config.mjs") }
    } else if (fw === "astro") {
      install(pm, ["tailwindcss", "@tailwindcss/vite"])
      warn("Add tailwindcss() from @tailwindcss/vite to vite.plugins in astro.config.mjs.")
    } else warn("Install Tailwind CSS v4 (https://tailwindcss.com/docs/installation), then run init again.")
  } else if (twMajor && twMajor < 4) fail(`Facet UI needs Tailwind CSS v4 (this project has ${d.tailwindcss}). Upgrade with: npx @tailwindcss/upgrade`)

  // The stylesheet the theme goes into
  const css = opt("--css") || findCss(fw)
  if (!css) fail("Couldn't find your global stylesheet. Pass it with --css, e.g. npx facetui init --css src/index.css")

  // "@/" import alias
  let base = aliasBase()
  if (!base) {
    base = fs.existsSync(p("src")) ? "src" : "."
    const target = base === "." ? "./*" : `./${base}/*`
    for (const f of tsconfigFiles()) {
      const t = jsonc(read(f))
      t.compilerOptions = { ...(t.compilerOptions || {}), paths: { ...(t.compilerOptions?.paths || {}), "@/*": [target] } }
      write(f, JSON.stringify(t, null, 2) + "\n"); ok(`Added the @/* path alias to ${f}`)
    }
    if (!tsconfigFiles().length) warn(`No tsconfig.json found. Make "@/*" point at ./${base === "." ? "" : base + "/"} in your bundler.`)
    const vc = ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"].find(exists)
    if (vc && (fw === "vite" || fw === "tanstack-start")) {
      let s = read(vc)
      if (!/alias/.test(s)) {
        s = `import path from "node:path"\n${s}`.replace(/defineConfig\(\{/, `defineConfig({\n  resolve: { alias: { "@": path.resolve(__dirname, "./${base === "." ? "" : base}") } },`)
        write(vc, s); ok(`Added the @ alias to ${vc}`)
        if (!d["@types/node"]) install(pm, ["@types/node"], true)
      }
    }
  }

  const cfg = {
    framework: fw,
    css,
    baseDir: base,
    aliases: { components: "@/components", ui: "@/components/ui", lib: "@/lib", utils: "@/lib/utils", hooks: "@/hooks" },
  }
  write(CONFIG, JSON.stringify(cfg, null, 2) + "\n")
  ok(`Wrote ${CONFIG}`)
  await add(["theme", "utils", "motion"])
  log(`\n${c.bold("Ready.")} Add components with ${c.cyan("npx facetui add button dialog tabs")} or everything with ${c.cyan("npx facetui add --all")}.`)
  log(c.dim("Wrap your app in <FacetMotion> (from @/lib/motion) so animations respect reduced motion."))
}

async function listItems() {
  const key = await licenseKey({ ask: true })
  const idx = await fetchItem("index", key)
  const comps = idx.items.filter((i) => i.type === "component")
  const groups = {}
  for (const it of comps) (groups[it.category] = groups[it.category] || []).push(it)
  for (const [g, list] of Object.entries(groups).sort()) {
    log(`\n${c.bold(g[0].toUpperCase() + g.slice(1))}`)
    for (const it of list) log(`  ${c.cyan(it.name.padEnd(22))} ${c.dim(it.description)}`)
  }
  log(`\n${comps.length} components · npx facetui add <name>`)
}

function removeItems(list) {
  const cfg = loadConfig()
  if (!list.length) fail("Name the components to remove, e.g. npx facetui remove carousel")
  for (const n of list) {
    const f = path.join(aliasToPath(cfg, cfg.aliases.ui), `${n}.tsx`)
    if (exists(f)) { fs.rmSync(p(f)); ok(`Removed ${f}`) } else warn(`${f} isn't there.`)
  }
}

function help() {
  log(`${c.bold("facetui")} ${c.dim(`v${VERSION}`)} — Facet UI animated React components, by ETKits

${c.bold("Usage")}
  npx facetui@latest init                set up Tailwind, the @/ alias, the theme and base files
  npx facetui@latest add <name…>         add components (and everything they need)
  npx facetui@latest add --all           add every component
  npx facetui@latest list                show all components
  npx facetui@latest remove <name…>      delete component files

${c.bold("Options")}
  --overwrite, -o   replace files you already have
  --dry-run         show what would change without writing
  --css <file>      your global stylesheet (init)
  --cwd <dir>       run in another directory
  --verbose         show package manager output

Your license key comes from FACET_LICENSE_KEY (environment or .env.local).
Docs: ${DOCS}`)
}

/* ---------- main ---------- */
try {
  if (has("--version", "-v")) log(VERSION)
  else if (!command || has("--help", "-h") || command === "help") help()
  else if (command === "init") await init()
  else if (command === "add") await add(names, { all: has("--all", "-a") })
  else if (command === "list" || command === "ls") await listItems()
  else if (command === "remove" || command === "rm") removeItems(names)
  else fail(`Unknown command "${command}". Run npx facetui --help.`)
} catch (e) {
  if (e instanceof CliError) { console.error(`${c.red("✖")} ${e.message}`); process.exit(1) }
  throw e
}
