/* Facet UI — living style guide app (hash router, no build step) */
(function () {
  "use strict";
  const R = window.FACET_REGISTRY, M = window.FACET_META, T = Facet.theme;
  const $ = (s, el = document) => el.querySelector(s);
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const FIGMA = "https://www.figma.com/design/tVf9mqBojGDNrUBrGt5hxi";
  const REPO = "https://github.com/desiben/UIKits/tree/FacetUI";

  /* ---------- syntax highlight (tiny, HTML/JS/CSS) ---------- */
  function hl(code, lang) {
    let s = esc(code);
    if (lang === "html") {
      s = s.replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="tk-tag">$2</span>')
           .replace(/ ([a-zA-Z-:@]+)=(&quot;|")(.*?)\2/g, ' <span class="tk-attr">$1</span>=<span class="tk-str">"$3"</span>')
           .replace(/ ([a-zA-Z-:@]+)='(.*?)'/g, " <span class=\"tk-attr\">$1</span>=<span class=\"tk-str\">'$2'</span>");
    } else {
      s = s.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="tk-com">$1</span>')
           .replace(/("[^"\n]*"|'[^'\n]*'|`[^`]*`)/g, '<span class="tk-str">$1</span>')
           .replace(/\b(import|from|const|let|return|export|default|function|module|exports|presets|require)\b/g, '<span class="tk-kw">$1</span>')
           .replace(/(&lt;\/?)([A-Z][A-Za-z.]*)/g, '$1<span class="tk-tag">$2</span>');
    }
    return s;
  }
  // Pretty-print preview HTML: collapse inline SVG <use> to a readable form
  const tidy = (h) => h.replace(/<svg class="icon([^"]*)" aria-hidden="true"><use href="#([^"]+)"\/><\/svg>/g, '<svg class="icon$1"><use href="#$2"/></svg>');
  const codeBlock = (code, lang = "js") => `<div class="codeblock"><button class="copy" data-copy>${i("copy", "icon-sm")} Copy</button><pre class="code"><code data-raw="${esc(code).replace(/"/g, "&quot;")}">${hl(code, lang)}</code></pre></div>`;

  /* ---------- navigation model ---------- */
  const PAGES = [
    { group: "Getting started", items: [["introduction", "Introduction"], ["installation", "Installation"], ["theming", "Theming"], ["brand-colors", "Brand colors", "New"], ["figma", "Figma file"]] },
    { group: "Foundations", items: [["colors", "Colors"], ["typography", "Typography"], ["spacing", "Spacing & density"], ["radius", "Radius & the Facet cut"], ["elevation", "Elevation & focus"], ["icons", "Icons"]] },
  ];
  const groups = [...new Set(R.map((c) => c.group))];
  groups.forEach((g) => PAGES.push({ group: g === "Signature" ? "Signature components" : g, items: R.filter((c) => c.group === g).map((c) => ["components/" + c.slug, c.name]) }));
  PAGES.push({ group: "Examples", items: [["examples", "All examples"], ["examples/dashboard", "Dashboard"], ["examples/login", "Login"], ["examples/settings", "Settings"]] });
  const FLAT = PAGES.flatMap((g) => g.items.map(([id, label]) => ({ id, label, group: g.group })));

  function renderSide(cur) {
    $(".docs-side").innerHTML = PAGES.map((g) => `<h6>${g.group}</h6>` + g.items.map(([id, label, tag]) => `<a href="#/${id}" class="${id === cur ? "on" : ""}">${label}${tag ? `<span class="tag">${tag}</span>` : ""}</a>`).join("")).join("");
  }

  /* ---------- page helpers ---------- */
  const page = (crumb, title, lead, body, meta = "") => `<article><div class="crumbs">${crumb}</div><h1 class="doc-title">${title}</h1><p class="doc-lead">${lead}</p>${meta ? `<div class="doc-meta">${meta}</div>` : '<div style="height:24px"></div>'}${body}</article>`;
  const example = (ex, k) => {
    const id = "ex" + k + Math.random().toString(36).slice(2, 6);
    const code = tidy(ex.html.trim());
    return `<h3 id="${id}">${ex.title}</h3><div class="example">
      <div class="example-bar"><div class="seg" role="tablist"><button role="tab" aria-selected="true" data-view="p">Preview</button><button role="tab" aria-selected="false" data-view="c">HTML</button></div><span class="spacer"></span><button class="copy" data-copy-ex>${i("copy", "icon-sm")} Copy HTML</button></div>
      <div class="preview ${ex.layout || ""}" data-pane="p">${ex.html}</div>
      <pre class="code" data-pane="c" hidden><code data-raw="${esc(code).replace(/"/g, "&quot;")}">${hl(code, "html")}</code></pre></div>`;
  };

  /* ---------- pages ---------- */
  const P = {};
  P.introduction = () => page("Getting started", "Facet UI", "A token-driven UI kit for product teams — Figma library, design tokens and a framework-agnostic CSS/JS implementation that mirrors shadcn/ui's component model with its own visual language.",
    `<div class="ex-cards">
      ${[["layers", "88 components", "53 variant sets, 420+ variants in Figma; the most-used 30 are implemented here."], ["palette", "6 brand themes", "Iris, Ember, Lagoon, Rose, Cobalt, Forest — or any color you pick."], ["sun", "Light & dark", "62 semantic color tokens with values for both modes."], ["sliders-horizontal", "Density", "Comfortable and Compact control heights, padding and row heights."]].map(([ic, b, s]) => `<div class="card ex-card"><span class="icon-wrap">${i(ic)}</span><b>${b}</b><span>${s}</span></div>`).join("")}
    </div>
    <h2 id="principles">Design principles</h2>
    <ul class="prose"><li><b>Tokens first.</b> Every color, space, radius and type style in the components is a variable. Change the token, not the component.</li>
    <li><b>The Facet cut.</b> Containers and controls have a slightly sharper top-right corner — a quiet, recognizable signature.</li>
    <li><b>Signal rail.</b> A 3px brand bar marks active, selected and toned states (sidebar, menus, alerts, toasts).</li>
    <li><b>Familiar API.</b> Names and anatomy follow shadcn/ui so engineers can map components 1:1 to React.</li></ul>
    <h2 id="whats-inside">What's inside</h2>
    <table class="api"><thead><tr><th>Part</th><th>Path</th><th>Use it for</th></tr></thead><tbody>
      <tr><td><code>tokens.css</code></td><td>tokens/</td><td>CSS custom properties for every theme, brand and density</td></tr>
      <tr><td><code>facet.tokens.json</code></td><td>tokens/</td><td>W3C Design Tokens format (Style Dictionary, Tokens Studio)</td></tr>
      <tr><td><code>tailwind.preset.js</code></td><td>tokens/</td><td>Tailwind / shadcn/ui projects</td></tr>
      <tr><td><code>facet.css</code> + <code>facet.js</code></td><td>styleguide/assets/</td><td>Drop-in components for plain HTML</td></tr>
      <tr><td>Figma library</td><td><a href="${FIGMA}" target="_blank" rel="noopener">Open in Figma</a></td><td>Design, prototypes, documentation, templates</td></tr></tbody></table>
    <div class="callout">${i("info")}<div>The CSS here is a faithful reference implementation of the Figma components, not a React package. For React, use shadcn/ui components with the Facet Tailwind preset (see <a href="#/installation">Installation</a>).</div></div>`);

  P.installation = () => page("Getting started", "Installation", "Three ways to use Facet: plain HTML, Tailwind + shadcn/ui, or tokens only.", `
    <h2 id="html">1 · Plain HTML / any framework</h2><p>Copy <code>styleguide/assets/</code> into your project and include:</p>
    ${codeBlock(`<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/facet.css">
<script src="assets/icons.js" defer></script>
<script src="assets/facet.js" defer></script>

<html data-theme="light" data-brand="iris" data-density="comfortable">`, "html")}
    <p>Then copy any example's HTML from the component pages.</p>
    <h2 id="tailwind">2 · Tailwind CSS + shadcn/ui</h2>
    ${codeBlock(`// tailwind.config.js
module.exports = {
  presets: [require("./tokens/tailwind.preset.js")],
  content: ["./src/**/*.{ts,tsx}"],
}`, "js")}
    ${codeBlock(`/* app/globals.css */
@import "./tokens/tokens.css";
body { font-family: var(--font-sans); background: var(--bg-canvas); color: var(--text-primary); }`, "js")}
    <p>The preset maps shadcn's names (<code>bg-primary</code>, <code>text-muted-foreground</code>, <code>border-input</code>, <code>ring</code>) to Facet tokens, and adds the full Facet groups: <code>bg-bg-subtle</code>, <code>text-fg-secondary</code>, <code>border-line-strong</code>, <code>rounded-lg</code>, <code>h-control-md</code>…</p>
    <h2 id="tokens">3 · Tokens only</h2><p>Use <code>tokens/facet.tokens.json</code> with Style Dictionary or Tokens Studio, or regenerate everything with <code>python3 scripts/build_tokens.py</code>.</p>`);

  P.theming = () => page("Getting started", "Theming", "Three independent axes, set with data attributes on &lt;html&gt; or on any subtree.", `
    <table class="api"><thead><tr><th>Attribute</th><th>Values</th><th>Figma collection</th></tr></thead><tbody>
      <tr><td><code>data-theme</code></td><td>light · dark</td><td>Color (Light / Dark)</td></tr>
      <tr><td><code>data-brand</code></td><td>iris · ember · lagoon · rose · cobalt · forest</td><td>Brand (6 modes)</td></tr>
      <tr><td><code>data-density</code></td><td>comfortable · compact</td><td>Density</td></tr></tbody></table>
    ${codeBlock(`<html data-theme="dark" data-brand="lagoon" data-density="compact">

<!-- or scope a section -->
<section data-brand="ember">…</section>`, "html")}
    <h2 id="js">JavaScript API</h2>
    ${codeBlock(`Facet.theme.setMode("dark")
Facet.theme.setBrand("rose")
Facet.theme.setDensity("compact")
Facet.theme.setCustomBrand("#ff5a1f")   // any color → full 50–950 ramp
Facet.theme.cssFor("#ff5a1f", "acme")   // CSS to paste into your stylesheet`, "js")}
    <p>Choices persist in <code>localStorage</code> (key <code>facet-theme</code>) and are restored on load. A <code>facet:theme</code> event fires on every change.</p>
    <h2 id="tokens-arch">How tokens are layered</h2>
    <ol class="prose"><li><b>Primitives</b> — OKLCH ramps (<code>--iris-600</code>, <code>--ink-200</code>). Never use directly in components.</li>
    <li><b>Brand</b> — <code>--brand-50…950</code> alias one primitive ramp per brand mode.</li>
    <li><b>Semantic</b> — <code>--bg-primary</code>, <code>--text-secondary</code>, <code>--border-focus</code>… alias brand or neutral steps per light/dark.</li>
    <li><b>Components</b> consume only semantic, dimension and density tokens.</li></ol>`);

  P["brand-colors"] = () => {
    const presets = Object.entries(T.presets);
    const mini = (name, attrs, label) => `<div class="mini" ${attrs}>
      <header><span class="swatch-dot" style="--sw:var(--bg-primary)"></span>${label}<small>brand-600</small></header>
      <div class="row"><button class="btn btn-sm">Create project</button><button class="btn btn-outline btn-sm">Invite</button><span class="badge badge-brand">New</span></div>
      <div class="row" style="--gap:16px"><label class="switch"><input type="checkbox" role="switch" checked> Auto-sync</label><label class="check"><input type="checkbox" checked><span>Digest</span></label></div>
      <div class="tabs-list" role="tablist"><button class="tab" role="tab" aria-selected="true">Overview</button><button class="tab" role="tab" aria-selected="false">Analytics</button><button class="tab" role="tab" aria-selected="false">Reports</button></div>
      <div class="progress"><span style="--value:68%"></span></div>
      <div class="bars" style="height:64px">${[40, 62, 50, 78, 66, 90].map((v) => `<div><i style="--h:${v}%"></i></div>`).join("")}</div>
    </div>`;
    return page("Getting started", "Brand colors", "Purple is only the default. Pick a preset or type any color — Facet generates an accessible 11-step ramp and every component updates instantly.", `
    <div class="studio">
      <div class="card card-body stack" style="--gap:16px">
        <b class="t-h5">Presets</b>
        <div class="preset-grid">${presets.map(([n, h]) => `<button class="preset" data-preset="${n}" aria-pressed="false"><i style="--sw:${h}"></i>${n[0].toUpperCase() + n.slice(1)}</button>`).join("")}</div>
        <hr class="separator">
        <b class="t-h5">Any color</b>
        <div class="color-input"><input type="color" id="bc-picker" value="#ff5a1f" aria-label="Pick a brand color"><input class="input" id="bc-hex" value="#ff5a1f" aria-label="Hex value" style="font-family:var(--code-font)"><button class="btn" id="bc-apply">Apply</button></div>
        <div class="row" style="--gap:6px">${["#ff5a1f", "#e11d48", "#7c3aed", "#0ea5e9", "#16a34a", "#ca8a04", "#111827"].map((h) => `<button class="swatch-dot" style="--sw:${h};width:22px;height:22px;border:0;cursor:pointer" data-try="${h}" aria-label="Try ${h}"></button>`).join("")}</div>
        <div id="bc-contrast" class="t-body-xs text-tertiary"></div>
      </div>
      <div class="stack" style="--gap:16px">
        <div class="ramp" id="bc-ramp"></div>
        ${mini("live", "", "Live preview (whole page)")}
      </div>
    </div>
    <h2 id="export">Use it in your code</h2><p>Copy the generated CSS into your stylesheet, then set <code>data-brand</code> to its name:</p>
    <div id="bc-css"></div>
    <h2 id="gallery">Examples</h2><p>Each card below is scoped with <code>data-brand</code> (and some with <code>data-theme="dark"</code>) — the same markup, six identities.</p>
    <div class="brand-gallery">
      ${presets.map(([n], k) => mini(n, `data-brand="${n}"${k % 3 === 2 ? ' data-theme="dark"' : ""}`, n[0].toUpperCase() + n.slice(1) + (k % 3 === 2 ? " · dark" : ""))).join("")}
      ${[["#ff5a1f", "Custom · Tangerine"], ["#7c3aed", "Custom · Violet"], ["#111827", "Custom · Graphite"]].map(([h, l]) => mini("c", `data-custom-brand="${h}" data-brand`, l)).join("")}
    </div>
    <h2 id="figma">In Figma</h2><ol class="prose"><li>Select a frame → right sidebar → <b>Layer › Variable modes › Brand</b> → pick a mode.</li><li>To add your own: Variables › <b>Primitives</b> add a 50–950 ramp, then <b>Brand</b> › + new mode and alias brand/50…950 to it.</li><li>See <b>02 — Design Tokens › Brand color examples</b> for all six modes side by side.</li></ol>
    <div class="callout">${i("shield")}<div>The generator keeps <code>brand-600</code> ≥ 4.5:1 and <code>brand-700</code> ≥ 6:1 against white by darkening those steps when needed, so primary buttons and links stay AA-compliant whatever color you choose.</div></div>`);
  };

  P.figma = () => page("Getting started", "Figma file", "The design source of truth. Nine pages, all token-driven.", `
    <p><a class="btn" href="${FIGMA}" target="_blank" rel="noopener">${i("external-link")} Open Facet UI in Figma</a></p>
    <table class="api"><thead><tr><th>Page</th><th>Contents</th></tr></thead><tbody>
    ${[["00 — Start Here", "Cover, design directions, principles, inventory & status, getting started"], ["01 — Foundations", "Color ramps, typography (25 Mona Sans styles), spacing, radius, elevation, icons"], ["02 — Design Tokens", "Theme matrix (brand × light/dark), density, CSS reference, brand color examples"], ["03 — Components", "88 components / 53 variant sets with properties, states and sizes + 100 Lucide icons"], ["04 — Patterns", "23 pattern components (app shell, filter bar, auth forms, AI dock, marketing sections…)"], ["05 — Templates", "10 apps, 26 desktop + mobile screens: dashboard, CRM, PM, AI, e-commerce, finance, calendar, settings, auth, marketing"], ["06 — Playground", "Sandboxes, theme lab, component tray, clickable prototype flows"], ["07 — Documentation", "20 component doc cards (anatomy, props, a11y, React code, do/don't) + customization guide"], ["08 — Changelog", "Version history and known limitations"]].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`).join("")}</tbody></table>
    <h2 id="prototype">Prototype</h2><p>Open <b>06 — Playground</b> and press Present. Flows: <i>Auth → Onboarding → Dashboard</i> and <i>Settings sections</i>. Interactive components (button, tabs, checkbox, switch, toggle, chip, accordion, menu item, sidebar item, input) have hover/press/toggle states wired.</p>`);

  P.colors = () => {
    const fams = Object.keys(M.families);
    const groupsS = {}; Object.keys(M.semantic).forEach((k) => { const g = k.split("/")[0]; (groupsS[g] = groupsS[g] || []).push(k); });
    return page("Foundations", "Colors", "Primitive ramps feed brand and semantic tokens. Click any token to copy its CSS variable.", `
    <h2 id="semantic">Semantic tokens</h2><p>Use these in product code. Values change with theme and brand.</p>
    ${Object.entries(groupsS).map(([g, ks]) => `<h3 id="sem-${g}">${g}</h3><div class="token-list">${ks.map((k) => { const v = "--" + k.replace(/\//g, "-"); return `<button class="token" data-copy-text="var(${v})"><i style="--c:var(${v})"></i><div><code>${v}</code><span>${M.semantic[k].light} · ${M.semantic[k].dark}</span></div></button>`; }).join("")}</div>`).join("")}
    <h2 id="brand-ramp">Brand ramp</h2><div class="swatch-grid">${["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"].map((s) => `<div class="swatch"><i style="--c:var(--brand-${s})"></i><b>${s}</b></div>`).join("")}</div>
    <h2 id="primitives">Primitives</h2>${fams.map((f) => `<h3 id="p-${f}">${f}</h3><div class="swatch-grid" style="grid-template-columns:repeat(${M.families[f].length},1fr)">${M.families[f].map((s) => `<div class="swatch"><i style="--c:var(--${f}-${s})"></i><b>${s}</b></div>`).join("")}</div>`).join("")}`);
  };

  P.typography = () => page("Foundations", "Typography", "Mona Sans (SIL OFL 1.1) in weights 400/500/600. 25 text styles map 1:1 to Figma.", `
    ${M.text.map((t) => { const slug = t.name.toLowerCase().replace("/", "-"); const cls = "t-" + slug.replace("heading-", "").replace("code-md", "code").replace("code-sm", "code"); return `<div class="type-row"><div><b class="t-label-sm">${t.name}</b><br><code>${t.size}/${t.lh} · ${t.w}</code></div><div style="font:var(--text-${slug});letter-spacing:var(--tracking-${slug});${slug === "overline" ? "text-transform:uppercase" : ""};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${/data/.test(slug) ? "$248,920.40" : /code/.test(slug) ? "const theme = useFacet()" : "Ship work your team is proud of"}</div></div>`; }).join("")}
    <h2 id="usage">Usage</h2>${codeBlock(`<h1 class="t-h1">Dashboard</h1>
<p class="t-body-md text-secondary">…</p>

/* or with the variables */
.title { font: var(--text-heading-h2); letter-spacing: var(--tracking-heading-h2); }`, "html")}
    <div class="callout">${i("info")}<div>Code/Data styles also use Mona Sans (font/mono = Mona Sans) to keep the kit single-family. Swap <code>--font-mono</code> for a true monospace if you show a lot of code.</div></div>`);

  P.spacing = () => page("Foundations", "Spacing & density", "A 4px scale for gaps and padding; density modes adjust control and layout sizes.", `
    <h2 id="scale">Space scale</h2>${Object.entries(M.space).filter(([k]) => k.startsWith("space/")).map(([k, v]) => `<div class="space-row"><code>--${k.replace("/", "-")}</code><span>${v}px</span><i style="width:${v * 3}px"></i></div>`).join("")}
    <h2 id="density">Density</h2><table class="api"><thead><tr><th>Token</th><th>Comfortable</th><th>Compact</th></tr></thead><tbody>${Object.entries(M.density).map(([k, v]) => `<tr><td><code>--${k.replace("/", "-")}</code></td><td>${v.Comfortable}px</td><td>${v.Compact}px</td></tr>`).join("")}</tbody></table>
    <p>Toggle density in the header to see buttons, inputs, cards and table rows tighten.</p>`);

  P.radius = () => page("Foundations", "Radius & the Facet cut", "Facet's signature is a sharper top-right corner on containers and controls.", `
    <div class="row" style="--gap:16px;margin:24px 0">${Object.entries(M.space).filter(([k]) => k.startsWith("radius/")).map(([k, v]) => `<div class="stack" style="--gap:8px;align-items:center"><div style="width:72px;height:72px;background:var(--bg-primary-subtle);border:1.5px solid var(--border-brand);border-radius:var(--${k.replace("/", "-")})"></div><code>${k.split("/")[1]}</code><span class="t-caption text-tertiary">${v === 999 ? "full" : v + "px"}</span></div>`).join("")}</div>
    <h2 id="cut">The Facet cut</h2><div class="row" style="--gap:24px"><div class="card facet" style="width:200px;height:120px"></div><button class="btn">Control cut</button></div>
    ${codeBlock(`.facet    { border-radius: var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg); }
.facet-sm { border-radius: var(--radius-md) var(--radius-xs) var(--radius-md) var(--radius-md); }
/* Remove the signature: set --radius-sm equal to --radius-lg */`, "js")}`);

  P.elevation = () => page("Foundations", "Elevation & focus", "Six elevation levels and a two-layer focus ring.", `
    <div class="row" style="--gap:20px;margin:24px 0">${[0, 1, 2, 3, 4, 5].map((n) => `<div class="card facet" style="width:120px;height:90px;box-shadow:var(--shadow-${n});display:grid;place-items:center"><code>--shadow-${n}</code></div>`).join("")}</div>
    <h2 id="focus">Focus ring</h2><div class="row"><button class="btn" style="box-shadow:var(--ring)">Focused</button><button class="btn btn-destructive" style="box-shadow:var(--ring-danger)">Danger focus</button><input class="input" style="width:220px;box-shadow:var(--ring);border-color:var(--border-focus)" value="Focused input"></div>
    ${codeBlock(`:focus-visible { box-shadow: var(--ring); } /* 1.5px surface gap + 3px border/focus */`, "js")}`);

  P.icons = () => page("Foundations", "Icons", `Lucide (ISC). ${window.FACET_ICONS.length} icons are bundled in the sprite; the Figma file has 100 as components. Click to copy.`, `
    <div class="input-group" style="max-width:360px;margin-bottom:16px">${i("search")}<input class="input" id="icon-q" placeholder="Filter icons…"></div>
    <div class="icon-grid" id="icon-grid">${window.FACET_ICONS.map((n) => `<button class="icon-cell" data-copy-text='<svg class="icon"><use href="#${n}"/></svg>' data-name="${n}">${i(n)}${n}</button>`).join("")}</div>
    <h2 id="usage">Usage</h2>${codeBlock(`<script src="assets/icons.js" defer></script>
<svg class="icon"><use href="#sparkles"/></svg>  <!-- .icon-sm / .icon-lg -->`, "html")}
    <p>Need more? Add any icon from <a href="https://lucide.dev" target="_blank" rel="noopener">lucide.dev</a> to the sprite, or use <code>lucide-react</code> in React.</p>`);

  P.examples = () => page("Examples", "Examples", "Full pages built only with Facet components. Open them standalone or view them inline.", `<div class="ex-cards">${[["dashboard", "layout-dashboard", "Dashboard", "KPIs, revenue chart, deals table, activity"], ["login", "lock", "Login", "Sign in with SSO / email, OTP verify"], ["settings", "settings", "Settings", "Profile, notifications, danger zone"]].map(([s, ic, b, d]) => `<a class="card ex-card" href="#/examples/${s}"><span class="icon-wrap">${i(ic)}</span><b>${b}</b><span>${d}</span></a>`).join("")}</div>
    <p>The Figma file has 10 complete templates (26 screens) — CRM, project management, AI workspace, e-commerce, finance, calendar, settings, auth and marketing.</p>`);
  ["dashboard", "login", "settings"].forEach((s) => {
    P["examples/" + s] = () => page(`Examples ${i("chevron-right", "icon-sm")} ${s}`, s[0].toUpperCase() + s.slice(1), `Built from Facet components. <a href="examples/${s}.html" target="_blank" rel="noopener">Open standalone ${i("external-link", "icon-sm")}</a>`,
      `<div class="example"><iframe class="example-frame" src="examples/${s}.html" title="${s} example" loading="lazy"></iframe></div>`);
  });

  R.forEach((c) => {
    P["components/" + c.slug] = () => page(`Components ${i("chevron-right", "icon-sm")} ${c.group}`, c.name, c.desc,
      c.examples.map(example).join("") +
      `<h2 id="react">React (shadcn/ui + Facet preset)</h2>${codeBlock(c.react, "js")}
       <h2 id="api">API</h2><table class="api"><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>${c.api.map(([a, b, d]) => `<tr><td><code>${esc(a)}</code></td><td>${b}</td><td>${d}</td></tr>`).join("")}</tbody></table>
       <h2 id="a11y">Accessibility</h2><ul class="prose">${c.a11y.map((x) => `<li>${esc(x).replace(/&lt;(\/?\w+)&gt;/g, "<code>&lt;$1&gt;</code>")}</li>`).join("")}</ul>`,
      `<span class="badge badge-outline">${i("component", "icon-sm")} Figma: ${c.figma}</span><a class="badge badge-outline" href="${FIGMA}" target="_blank" rel="noopener" style="text-decoration:none">${i("external-link", "icon-sm")} Open in Figma</a>`);
  });

  /* ---------- router ---------- */
  function route() {
    const id = (location.hash.replace(/^#\/?/, "") || "introduction").split("?")[0];
    const fn = P[id] || P.introduction; const cur = P[id] ? id : "introduction";
    const main = $(".docs-main"); main.innerHTML = fn();
    const idx = FLAT.findIndex((f) => f.id === cur), prev = FLAT[idx - 1], next = FLAT[idx + 1];
    main.querySelector("article").insertAdjacentHTML("beforeend", `<nav class="pager">${prev ? `<a href="#/${prev.id}"><small>Previous</small>${prev.label}</a>` : ""}${next ? `<a href="#/${next.id}"><small>Next</small>${next.label}</a>` : ""}</nav>`);
    renderSide(cur); toc(); Facet.enhance(main); document.body.classList.remove("nav-open");
    document.title = (FLAT[idx] ? FLAT[idx].label + " — " : "") + "Facet UI";
    window.scrollTo(0, 0);
    if (cur === "brand-colors") studio();
    main.querySelectorAll("[data-custom-brand]").forEach((el) => T.setCustomBrand(el.dataset.customBrand, el));
    const on = $(".docs-side a.on"); if (on) on.scrollIntoView({ block: "nearest" });
    document.querySelectorAll(".header-nav a").forEach((a) => a.classList.toggle("on", cur.startsWith(a.dataset.sec)));
  }
  function toc() {
    const hs = [...document.querySelectorAll(".docs-main h2, .docs-main h3")];
    hs.forEach((h, k) => { if (!h.id) h.id = "s" + k; });
    $(".docs-toc").innerHTML = hs.length ? `<b>On this page</b>` + hs.map((h) => `<a href="javascript:void 0" data-scroll="${h.id}" style="${h.tagName === "H3" ? "padding-left:22px" : ""}">${h.textContent}</a>`).join("") : "";
  }

  /* ---------- brand studio ---------- */
  function studio() {
    const showRamp = () => {
      const cs = getComputedStyle(document.documentElement);
      const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
      const vals = steps.map((s) => cs.getPropertyValue("--brand-" + s).trim());
      $("#bc-ramp").innerHTML = steps.map((s, k) => `<div style="background:${vals[k]};color:${k < 5 ? "#15151b" : "#fff"}">${s}</div>`).join("");
      const c6 = T.contrast(vals[6], "#ffffff"), c7 = T.contrast(vals[7], "#ffffff");
      $("#bc-contrast").innerHTML = `brand-600 on white: <b class="${c6 >= 4.5 ? "text-success" : "text-danger"}">${c6.toFixed(2)}:1</b> · brand-700: <b class="${c7 >= 4.5 ? "text-success" : "text-danger"}">${c7.toFixed(2)}:1</b>`;
      const st = T.get(); const hex = st.custom || T.presets[st.brand] || "#5d4ff3";
      $("#bc-css").innerHTML = codeBlock(st.custom ? T.cssFor(hex, "acme") : `<html data-brand="${st.brand}">  <!-- built-in preset -->`, st.custom ? "js" : "html");
      document.querySelectorAll(".preset").forEach((p) => p.setAttribute("aria-pressed", !st.custom && p.dataset.preset === st.brand));
    };
    const apply = (h) => { if (!/^#?[0-9a-f]{6}$/i.test(h)) return; h = h.startsWith("#") ? h : "#" + h; $("#bc-hex").value = h; $("#bc-picker").value = h; T.setCustomBrand(h); };
    $("#bc-picker").addEventListener("input", (e) => apply(e.target.value));
    $("#bc-apply").addEventListener("click", () => apply($("#bc-hex").value.trim()));
    $("#bc-hex").addEventListener("keydown", (e) => { if (e.key === "Enter") apply(e.target.value.trim()); });
    document.querySelectorAll("[data-try]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.try)));
    document.querySelectorAll(".preset").forEach((b) => b.addEventListener("click", () => T.setBrand(b.dataset.preset)));
    document.addEventListener("facet:theme", () => { if ($("#bc-ramp")) requestAnimationFrame(showRamp); });
    showRamp();
  }

  /* ---------- header controls ---------- */
  function syncHeader() {
    const s = T.get();
    $("#mode-btn").innerHTML = i(s.mode === "dark" ? "sun" : "moon");
    $("#mode-btn").setAttribute("aria-label", s.mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
    $("#density-btn").setAttribute("aria-pressed", s.density === "compact");
    $("#brand-dot").style.setProperty("--sw", s.custom || T.presets[s.brand] || "#5d4ff3");
    document.querySelectorAll("#brand-menu [data-b]").forEach((b) => b.setAttribute("aria-checked", !s.custom && b.dataset.b === s.brand));
  }
  $("#brand-menu").innerHTML = `<div class="menu-label">Brand</div>` + Object.entries(T.presets).map(([n, h]) => `<button class="menu-item" role="menuitemradio" data-b="${n}"><span class="swatch-dot" style="--sw:${h}"></span>${n[0].toUpperCase() + n.slice(1)}</button>`).join("") + `<div class="menu-sep"></div><a class="menu-item" role="menuitem" href="#/brand-colors">${i("palette")} Custom color…</a>`;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-b]"); if (b) T.setBrand(b.dataset.b);
    if (e.target.closest("#mode-btn")) T.setMode(T.get().mode === "dark" ? "light" : "dark");
    if (e.target.closest("#density-btn")) T.setDensity(T.get().density === "compact" ? "comfortable" : "compact");
    if (e.target.closest(".mobile-nav")) document.body.classList.toggle("nav-open");
    const sc = e.target.closest("[data-scroll]"); if (sc) document.getElementById(sc.dataset.scroll).scrollIntoView({ behavior: "smooth" });
    // example tabs
    const v = e.target.closest(".example-bar [data-view]");
    if (v) { const ex = v.closest(".example"); ex.querySelectorAll("[data-view]").forEach((x) => x.setAttribute("aria-selected", x === v)); ex.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== v.dataset.view)); }
    // copy
    const cp = e.target.closest("[data-copy], [data-copy-ex], [data-copy-text]");
    if (cp) {
      const txt = cp.dataset.copyText || (cp.hasAttribute("data-copy-ex") ? cp.closest(".example").querySelector("code").dataset.raw : cp.parentElement.querySelector("code").dataset.raw);
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => Facet.toast({ title: "Copied to clipboard", timeout: 1600 })).catch(() => Facet.toast({ title: "Copy failed", description: "Select the code and copy manually.", tone: "var(--icon-danger)", icon: "alert-circle" }));
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "icon-q") { const q = e.target.value.toLowerCase(); document.querySelectorAll(".icon-cell").forEach((c) => (c.hidden = !c.dataset.name.includes(q))); }
  });
  document.addEventListener("facet:theme", syncHeader);

  /* ---------- ⌘K search ---------- */
  const cmd = $("#cmdk"), q = $("#cmdk-q"), list = $("#cmdk-list");
  let sel = 0, results = [];
  function renderCmd() {
    const s = q.value.trim().toLowerCase();
    results = FLAT.filter((f) => !s || f.label.toLowerCase().includes(s) || f.group.toLowerCase().includes(s)).slice(0, 40);
    const extra = s ? [] : [{ id: "_dark", label: "Toggle dark mode", group: "Actions" }, { id: "_brand", label: "Change brand color…", group: "Actions" }];
    results = results.concat(extra); sel = Math.min(sel, results.length - 1);
    let last = ""; list.innerHTML = results.map((r, k) => { const head = r.group !== last ? `<div class="menu-label">${(last = r.group)}</div>` : ""; return head + `<div class="menu-item" role="option" data-k="${k}" aria-selected="${k === sel}">${i(r.id.startsWith("components") ? "component" : r.id.startsWith("_") ? "zap" : "file-text")} ${r.label}</div>`; }).join("") || `<div class="empty" style="padding:24px"><p>No results for “${esc(q.value)}”.</p></div>`;
  }
  function go(k) { const r = results[k]; if (!r) return; cmd.hidden = true; if (r.id === "_dark") T.setMode(T.get().mode === "dark" ? "light" : "dark"); else if (r.id === "_brand") location.hash = "#/brand-colors"; else location.hash = "#/" + r.id; }
  function openCmd() { cmd.hidden = false; q.value = ""; sel = 0; renderCmd(); q.focus(); }
  $("#search-btn").addEventListener("click", openCmd);
  q.addEventListener("input", () => { sel = 0; renderCmd(); });
  list.addEventListener("click", (e) => { const it = e.target.closest("[data-k]"); if (it) go(+it.dataset.k); });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmd.hidden ? openCmd() : (cmd.hidden = true); }
    if (cmd.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length; renderCmd(); const a = list.querySelector('[aria-selected="true"]'); if (a) a.scrollIntoView({ block: "nearest" }); }
    if (e.key === "Enter") { e.preventDefault(); go(sel); }
  });

  window.addEventListener("hashchange", route);
  syncHeader(); route();
})();
