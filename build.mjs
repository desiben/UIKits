/*! FacetUI Industry Templates · build.mjs · © 2026 ETKits. All rights reserved.
   Zero-dependency static build (Node 18+):  node build.mjs   →  dist/
   - Renders every template in src/templates/<slug>/ (content.mjs + pages.mjs + template.css)
   - Generates custom brand ramps with Facet UI's own algorithm (facet.js → theme.cssFor)
   - Builds an icon sprite: Facet's core set + any Lucide icons the pages use
   - Picks up photos dropped in src/templates/<slug>/images/<slot>.(avif|webp|jpg|png)
   - Writes the gallery (dist/index.html) and the image manifest (IMAGE-MANIFEST.md / .json)
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";
import { documentShell, KIT } from "./src/kit/layout.mjs";
import { renderGallery } from "./src/gallery/gallery.mjs";
import { registry } from "./src/templates/registry.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

/* ------------------------------------------------------------ helpers */
const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
const mk = (p) => fs.mkdirSync(p, { recursive: true });
const cp = (a, b) => { mk(path.dirname(b)); fs.copyFileSync(a, b); };
const write = (p, s) => { mk(path.dirname(p)); fs.writeFileSync(p, s); };
const exists = (p) => fs.existsSync(p);

/** Run facet.js in a sandbox to reuse its OKLCH brand ramp (keeps custom brands identical to Facet's). */
function facetTheme() {
  const noop = () => {};
  const el = () => ({ dataset: {}, style: { setProperty: noop, removeProperty: noop }, classList: { add: noop, remove: noop, contains: () => false }, setAttribute: noop, appendChild: noop, querySelector: () => null, querySelectorAll: () => [] });
  const document = { documentElement: el(), readyState: "loading", addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], createElement: el, body: el(), dispatchEvent: noop };
  const sandbox = { document, localStorage: { getItem: () => null, setItem: noop }, matchMedia: () => ({ matches: false, addEventListener: noop }), CustomEvent: class {}, Event: class {}, MutationObserver: class { observe() {} }, ResizeObserver: class { observe() {} }, IntersectionObserver: class { observe() {} }, requestAnimationFrame: noop, setTimeout: noop, clearTimeout: noop, addEventListener: noop, navigator: {}, console };
  sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(SRC, "facet/facet.js"), "utf8"), sandbox);
  return sandbox.Facet.theme;
}

/** Read width/height from PNG, JPEG or WebP headers (no image library needed). */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(1, 4).toString() === "PNG") return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP") {
    const fmt = b.slice(12, 16).toString();
    if (fmt === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (fmt === "VP8L") { const n = b.readUInt32LE(21); return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return {};
}

/** Parse symbols out of a Facet sprite file (icons.js / lucide.js). */
function symbols(file) {
  const js = fs.readFileSync(file, "utf8");
  const m = js.match(/var s="((?:\\.|[^"\\])*)"/);
  const svg = JSON.parse(`"${m[1]}"`);
  const map = new Map();
  for (const s of svg.matchAll(/<symbol id="([^"]+)"[\s\S]*?<\/symbol>/g)) map.set(s[1], s[0]);
  return map;
}

/* ------------------------------------------------------------ build */
const theme = facetTheme();
const core = symbols(path.join(SRC, "facet/icons.js"));
const lucide = symbols(path.join(SRC, "facet/lucide.js"));
const usedIcons = new Set(["menu", "x", "circle-alert", "circle-check", "file", "chevron-left", "chevron-right", "layout-grid", "flask-conical", "camera", "image"]);
const problems = [];
const manifest = [];
const built = [];

if (!only.length) rm(DIST);
mk(DIST);

// Shared assets
for (const f of ["tokens.css", "facet.css", "facet.js", "LUCIDE-LICENSE.txt"]) cp(path.join(SRC, "facet", f), path.join(DIST, "assets/facet", f));
for (const f of ["kit.css", "kit.js"]) cp(path.join(SRC, "kit", f), path.join(DIST, "assets/kit", f));
for (const f of fs.readdirSync(path.join(SRC, "fonts"))) cp(path.join(SRC, "fonts", f), path.join(DIST, "assets/fonts", f));

for (const entry of registry) {
  const dir = path.join(SRC, "templates", entry.slug);
  if (!exists(path.join(dir, "pages.mjs"))) continue;
  if (only.length && !only.includes(entry.slug)) { built.push(entry); continue; }
  const tpl = { ...(await import(pathToFileURL(path.join(dir, "content.mjs")) + `?v=${Date.now()}`)).default, ...entry };
  const pages = (await import(pathToFileURL(path.join(dir, "pages.mjs")) + `?v=${Date.now()}`)).default;
  const out = path.join(DIST, "t", entry.slug);
  rm(out); mk(out);

  // Photos supplied by the buyer/author
  const imgDir = path.join(dir, "images");
  const imageFiles = {};
  const credits = exists(path.join(imgDir, "credits.json")) ? JSON.parse(fs.readFileSync(path.join(imgDir, "credits.json"), "utf8")) : {};
  for (const key of Object.keys(tpl.images || {})) {
    for (const ext of ["avif", "webp", "jpg", "jpeg", "png"]) {
      const p = path.join(imgDir, `${key}.${ext}`);
      if (exists(p)) { cp(p, path.join(out, "images", `${key}.${ext}`)); imageFiles[key] = { name: `${key}.${ext}`, ...imageSize(p) }; break; }
    }
  }

  let brandCss = "";
  if (tpl.theme.custom) brandCss = theme.cssFor(tpl.theme.custom.hex, tpl.theme.brand).replace(/\n\s*/g, " ");

  const templateJs = exists(path.join(dir, "template.js"));
  if (templateJs) cp(path.join(dir, "template.js"), path.join(out, "template.js"));
  const usedImages = new Set();
  const pageList = pages.map((p) => ({ key: p.key, file: p.file, title: p.title, short: p.short, kitbar: p.kitbar }));
  const fileFor = (key) => { const p = pages.find((x) => x.key === key); if (!p) throw new Error(`[${entry.slug}] link to unknown page "${key}"`); return p.file; };
  for (const page of pages) {
    const ctx = {
      tpl, slug: entry.slug, page, pages: pageList, root: "../../", brandCss, templateJs,
      images: tpl.images || {}, imageFiles, usedImages,
      assetImg: (f) => `images/${f.name}`,
      href(l) {
        if (!l) return "#";
        if (typeof l === "string") return l;
        if (l.href) return l.href;
        const file = l.page ? fileFor(l.page) : "";
        const q = l.query ? "?" + new URLSearchParams(l.query) : "";
        return `${file}${q}${l.hash ? "#" + l.hash : ""}` || "#";
      },
    };
    const body = String(page.render(ctx));
    const doc = documentShell(ctx, body);
    for (const m of doc.matchAll(/href="#([a-z0-9-]+)"/g)) if (lucide.has(m[1]) || core.has(m[1])) usedIcons.add(m[1]);
    for (const m of doc.matchAll(/<use href="#([a-z0-9-]+)"/g)) { usedIcons.add(m[1]); if (!core.has(m[1]) && !lucide.has(m[1])) problems.push(`[${entry.slug}/${page.file}] unknown icon "${m[1]}"`); }
    for (const m of doc.matchAll(/href="([^"#:?]+\.html)/g)) if (!pages.some((p) => p.file === m[1]) && m[1] !== "../../index.html") problems.push(`[${entry.slug}/${page.file}] link to missing page ${m[1]}`);
    if (/lorem ipsum/i.test(doc)) problems.push(`[${entry.slug}/${page.file}] contains lorem ipsum`);
    if (/style="[^"]*#[0-9a-f]{3,8}\b/i.test(body)) problems.push(`[${entry.slug}/${page.file}] raw hex color in inline style (use tokens)`);
    write(path.join(out, page.file), doc);
  }
  cp(path.join(dir, "template.css"), path.join(out, "template.css"));
  const css = fs.readFileSync(path.join(dir, "template.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of css.matchAll(/#[0-9a-f]{3,8}\b/gi)) problems.push(`[${entry.slug}/template.css] raw hex color ${m[0]} (use tokens)`);
  for (const m of css.matchAll(/font-family\s*:/gi)) problems.push(`[${entry.slug}/template.css] font-family declared (Mona Sans only)`);

  for (const [key, im] of Object.entries(tpl.images || {})) {
    if (!usedImages.has(key)) problems.push(`[${entry.slug}] image "${key}" registered but unused`);
    const c = credits[key] || {};
    manifest.push({ template: entry.slug, industry: entry.industry, slot: key, placement: im.placement || "", ratio: im.ratio || "4/3", focal: im.focal || "50% 50%", alt: im.alt, brief: im.brief, search: im.search || "", status: imageFiles[key] ? "supplied" : "pending", file: imageFiles[key] ? `src/templates/${entry.slug}/images/${imageFiles[key].name}` : "", source: c.source || "", page: c.page || "", creator: c.creator || "", license: c.license || "", attribution: c.attribution || "" });
  }
  built.push(entry);
  console.log(`✓ ${entry.slug} (${pages.length} pages)`);
}

// Icon sprite: core + used extras, same injection pattern as Facet's icons.js
const sprite = new Map(core);
for (const n of usedIcons) if (!sprite.has(n) && lucide.has(n)) sprite.set(n, lucide.get(n));
// Legacy Lucide names are aliases (<use href="#canonical">); pull in what they point to.
for (let added = true; added; ) {
  added = false;
  for (const sym of [...sprite.values()]) for (const m of sym.matchAll(/href="#([a-z0-9-]+)"/g)) if (!sprite.has(m[1]) && (lucide.has(m[1]) || core.has(m[1]))) { sprite.set(m[1], lucide.get(m[1]) || core.get(m[1])); added = true; }
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${[...sprite.values()].join("")}</svg>`;
write(path.join(DIST, "assets/icons.js"), `/* Facet UI core icons + icons used by ${KIT.name} — Lucide v1.61.0 (ISC License, https://lucide.dev). */\n(function(){var s=${JSON.stringify(svg)};function ins(){if(document.getElementById("kit-sprite"))return;var d=document.createElement("div");d.id="kit-sprite";d.innerHTML=s;document.body.insertBefore(d.firstChild,document.body.firstChild);d.firstChild||0}if(document.body)ins();else document.addEventListener("DOMContentLoaded",ins)})();\n`);

// Gallery
const builtSlugs = new Set(built.map((b) => b.slug));
write(path.join(DIST, "index.html"), renderGallery({ registry, builtSlugs, previews: (slug) => exists(path.join(ROOT, "previews", `${slug}.webp`)) }));
for (const f of fs.existsSync(path.join(ROOT, "previews")) ? fs.readdirSync(path.join(ROOT, "previews")) : []) cp(path.join(ROOT, "previews", f), path.join(DIST, "assets/previews", f));
cp(path.join(SRC, "gallery/gallery.css"), path.join(DIST, "assets/gallery.css"));

// Image manifest (only on full builds, so partial builds don't drop rows)
if (!only.length) {
  write(path.join(ROOT, "image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  const pending = manifest.filter((m) => m.status === "pending").length;
  const rows = manifest.map((m) => `| ${m.template} | ${m.slot} | ${m.placement} | ${m.ratio} | ${m.status} | ${m.search || m.brief} | ${m.source || "—"} | ${m.page ? `[link](${m.page})` : "—"} | ${m.creator || "—"} | ${m.license || "—"} |`);
  write(path.join(ROOT, "IMAGE-MANIFEST.md"), `# Image manifest\n\nGenerated by \`node build.mjs\`. ${manifest.length} image slots across ${built.length} templates; **${pending} pending**, ${manifest.length - pending} supplied.\n\nPending slots render as clearly labelled, art-directed placeholders. They are not finished imagery. To fill one, save a photo as \`src/templates/<template>/images/<slot>.webp\` (or .jpg/.png/.avif) and record its source in \`src/templates/<template>/images/credits.json\`:\n\n\`\`\`json\n{ "hero": { "source": "Unsplash", "page": "https://unsplash.com/photos/…", "creator": "Name", "license": "Unsplash License", "attribution": "Photo by Name on Unsplash" } }\n\`\`\`\n\n| Template | Slot | Placement | Ratio | Status | Search brief | Library | Asset page | Creator | License |\n|---|---|---|---|---|---|---|---|---|---|\n${rows.join("\n")}\n`);
}

if (problems.length) { console.error("\nProblems:\n" + problems.map((p) => "  ✗ " + p).join("\n")); process.exitCode = 1; }
console.log(`\nBuilt ${built.length}/${registry.length} templates → dist/  ·  ${sprite.size} icons`);
