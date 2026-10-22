/* Facet UI — living style guide app (hash router, no build step) */
(function () {
  "use strict";
  const R = window.FACET_REGISTRY, M = window.FACET_META, T = Facet.theme;
  const $ = (s, el = document) => el.querySelector(s);
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // The Figma source is delivered after purchase, so public links go to the store.
  const FIGMA = "https://www.etkits.us/#get";

  /* ---------- syntax highlight (tiny, HTML/JS/CSS) ---------- */
  function hl(code, lang) {
    let s = esc(code);
    if (lang === "html") {
      s = s.replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="tk-tag">$2</span>')
           .replace(/ ([a-zA-Z-:@]+)=(&quot;|")(.*?)\2/g, ' <span class="tk-attr">$1</span>=<span class="tk-str">"$3"</span>')
           .replace(/ ([a-zA-Z-:@]+)='(.*?)'/g, " <span class=\"tk-attr\">$1</span>=<span class=\"tk-str\">'$2'</span>");
    } else {
      // strings and comments in one pass so "https://…" stays a string
      s = s.replace(/("[^"\n]*"|'[^'\n]*'|`[^`]*`)|(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (m, str, com) => str ? `<span class="tk-str">${str}</span>` : `<span class="tk-com">${com}</span>`)
           .replace(/\b(import|from|const|let|return|export|default|function|module|exports|presets|require)\b/g, '<span class="tk-kw">$1</span>')
           .replace(/(&lt;\/?)([A-Z][A-Za-z.]*)/g, '$1<span class="tk-tag">$2</span>');
    }
    return s;
  }
  // Pretty-print preview HTML: collapse inline SVG <use> to a readable form
  const tidy = (h) => h.replace(/<svg class="icon([^"]*)" aria-hidden="true"><use href="#([^"]+)"\/><\/svg>/g, '<svg class="icon$1"><use href="#$2"/></svg>');
  /* facetui CLI install command with package-manager tabs (choice remembered across pages). */
  const PM = { npm: (c) => `npx facetui@latest ${c}`, pnpm: (c) => `pnpm dlx facetui@latest ${c}`, yarn: (c) => `yarn dlx facetui@latest ${c}`, bun: (c) => `bunx facetui@latest ${c}` };
  const pmNow = () => { try { return PM[localStorage.getItem("facet-pm")] ? localStorage.getItem("facet-pm") : "npm"; } catch (e) { return "npm"; } };
  const install = (cmd) => { const pm = pmNow(), full = PM[pm](cmd); return `<div class="pm-install" data-pm-cmd="${esc(cmd)}"><div class="pm-tabs" role="tablist" aria-label="Package manager">${i("terminal", "icon-sm")}${Object.keys(PM).map((k) => `<button type="button" role="tab" data-pm="${k}" aria-selected="${k === pm}">${k}</button>`).join("")}<button type="button" class="btn btn-ghost btn-sm icon-btn pm-copy" data-copy-text="${esc(full)}" aria-label="Copy command">${i("copy", "icon-sm")}</button></div><pre class="code"><code>${esc(full)}</code></pre></div>`; };
  const codeBlock = (code, lang = "js") => `<div class="codeblock"><button class="copy" data-copy>${i("copy", "icon-sm")} Copy</button><pre class="code"><code data-raw="${esc(code).replace(/"/g, "&quot;")}">${hl(code, lang)}</code></pre></div>`;

  /* ---------- AI agent examples (agents/*.html) ---------- */
  const AGENTS = [
    { id: "banking", name: "Business Banking", icon: "landmark", desc: "Cash, burn, runway and vendor spend — with approval-gated transfers.", tags: ["Charts", "Approvals", "KPIs"] },
    { id: "commerce", name: "Commerce Ops", icon: "store", desc: "Orders, inventory and channel revenue, with approval-based restocking.", tags: ["Data grid", "Approvals", "Charts"] },
    { id: "travel", name: "Travel", icon: "plane", desc: "Compare destinations, build a day-by-day itinerary and budget the trip.", tags: ["Map", "Agenda", "Cards"] },
    { id: "email", name: "Email", icon: "mail", desc: "Find, summarize, draft and safely send email from a real inbox.", tags: ["List view", "Rich text", "Approvals"] },
    { id: "health", name: "Health", icon: "heart-pulse", desc: "Workouts, sleep and nutrition over 90 days, with goal tracking.", tags: ["Radial", "Charts", "Agenda"] },
    { id: "support", name: "Support", icon: "life-buoy", desc: "Ticket queues, SLA health and CSAT, with triage actions.", tags: ["Tables", "Charts", "Tools"] },
  ];

  /* ---------- navigation model ---------- */
  const PAGES = [
    { group: "Getting started", items: [["introduction", "Introduction"], ["installation", "Installation"], ["theming", "Theming"], ["brand-colors", "Brand colors"], ["styles", "Style themes", "New"], ["figma", "Figma file"], ["showcase", "Showcase"]] },
    { group: "Foundations", items: [["colors", "Colors"], ["typography", "Typography"], ["spacing", "Spacing & density"], ["radius", "Radius & the Facet cut"], ["elevation", "Elevation & focus"], ["motion", "Motion", "New"], ["icons", "Icons"]] },
  ];
  // v1.2 categories (older "Signature" entries are filed into their natural category)
  const REGROUP = { "command-palette": "Navigation", kanban: "Data display", pricing: "Data display", ai: "AI", timeline: "Data display", "empty-state": "Feedback", charts: "Charts" };
  R.forEach((c) => { if (REGROUP[c.slug]) c.group = REGROUP[c.slug]; });
  const CATS = ["Actions", "Forms", "Data display", "Charts", "AI", "Feedback", "Layout", "Navigation", "Overlays"];
  const CAT_ICON = { Actions: "mouse-pointer-click", Forms: "text-cursor", "Data display": "layout-grid", Charts: "bar-chart-3", AI: "sparkles", Feedback: "star", Layout: "panel-left", Navigation: "navigation", Overlays: "layers" };
  R.sort((a, b) => CATS.indexOf(a.group) - CATS.indexOf(b.group) || a.name.localeCompare(b.name));
  PAGES.push({ group: "Components", items: [["components", "All components", "v1.3"]] });
  CATS.forEach((g) => { const items = R.filter((c) => c.group === g); if (items.length) PAGES.push({ group: g, items: items.map((c) => ["components/" + c.slug, c.name, c.isNew ? "New" : ""]) }); });
  PAGES.push({ group: "AI agents", items: [["agents", "Agent examples", "New"]].concat(AGENTS.map((a) => ["agents/" + a.id, a.name])) });
  PAGES.push({ group: "Examples", items: [["examples", "All examples"], ["examples/dashboard", "Dashboard"], ["examples/login", "Login"], ["examples/settings", "Settings"]] });
  const FLAT = PAGES.flatMap((g) => g.items.map(([id, label]) => ({ id, label, group: g.group })));

  function renderSide(cur) {
    $(".docs-side").innerHTML = PAGES.map((g) => `<h6>${g.group}</h6>` + g.items.map(([id, label, tag]) => `<a href="#/${id}" class="${id === cur ? "on" : ""}">${label}${tag ? `<span class="tag">${tag}</span>` : ""}</a>`).join("")).join("");
  }

  /* ---------- page helpers ---------- */
  const page = (crumb, title, lead, body, meta = "") => `<article><div class="crumbs">${crumb}</div><h1 class="doc-title">${title}</h1><p class="doc-lead">${lead}</p>${meta ? `<div class="doc-meta">${meta}</div>` : '<div style="height:24px"></div>'}${body}</article>`;
  // Copyable code is for buyers (see assets/license.js); the live previews stay public.
  const LIC = window.FacetLicense || { unlocked: false, data: null, open() {}, lockedHTML: () => "" };
  const example = (ex, k) => {
    const id = "ex" + k + Math.random().toString(36).slice(2, 6);
    const code = LIC.unlocked ? tidy(ex.html.trim()) : "";
    return `<h3 id="${id}">${ex.title}</h3><div class="example">
      <div class="example-bar"><div class="seg" role="tablist"><button role="tab" aria-selected="true" data-view="p">Preview</button><button role="tab" aria-selected="false" data-view="c">HTML</button></div><div class="seg vp" role="group" aria-label="Viewport"><button aria-selected="true" data-vp="desktop" aria-label="Desktop">${i("monitor", "icon-sm")}</button><button aria-selected="false" data-vp="mobile" aria-label="Mobile">${i("smartphone", "icon-sm")}</button></div><span class="spacer"></span>${LIC.unlocked ? `<button class="copy" data-copy-ex>${i("copy", "icon-sm")} <span class="label-text">Copy HTML</span></button>` : `<button class="copy" data-unlock>${i("lock", "icon-sm")} <span class="label-text">Unlock HTML</span></button>`}</div>
      <div class="preview-wrap" data-pane="p"><div class="preview ${ex.layout || ""}">${ex.html}</div></div>
      ${LIC.unlocked ? `<pre class="code" data-pane="c" hidden><code data-raw="${esc(code).replace(/"/g, "&quot;")}">${hl(code, "html")}</code></pre>` : `<div data-pane="c" hidden>${LIC.lockedHTML("The HTML")}</div>`}</div>`;
  };

  /* ---------- pages ---------- */
  const P = {};
  P.introduction = () => page("Getting started", "Facet UI", "A token-driven UI kit for product teams — Figma library, design tokens and a framework-agnostic CSS/JS implementation that follows the component model React developers already know with its own visual language.",
    `<div class="ex-cards">
      ${[["layers", "158 components", "In Figma with Variables and every state, including every standard product-UI component. 109 are documented and working on this site."], ["palette", "6 brand themes", "Iris, Ember, Lagoon, Rose, Cobalt, Forest — or any color you pick."], ["sun", "Light & dark", "62 semantic color tokens with values for both modes."], ["sliders-horizontal", "Density", "Comfortable and Compact control heights, padding and row heights."]].map(([ic, b, s]) => `<div class="card ex-card" data-tilt="3"><span class="icon-wrap">${i(ic)}</span><b>${b}</b><span>${s}</span></div>`).join("")}
    </div>
    <div class="example" style="margin-top:24px"><video class="showcase-video" autoplay muted loop playsinline preload="metadata" poster="assets/showcase/facet-micro-interactions-poster.jpg" aria-label="Facet UI micro-interactions demo"><source src="assets/showcase/facet-micro-interactions.webm" type="video/webm"><source src="assets/showcase/facet-micro-interactions.mp4" type="video/mp4"></video></div>
    <p class="t-body-sm text-tertiary">Micro-interactions demo · <a href="#/showcase">Showcase</a></p>
    <h2 id="principles">Design principles</h2>
    <ul class="prose"><li><b>Tokens first.</b> Every color, space, radius and type style in the components is a variable. Change the token, not the component.</li>
    <li><b>The Facet cut.</b> Containers and controls have a slightly sharper top-right corner — a quiet, recognizable signature.</li>
    <li><b>Signal rail.</b> A 3px brand bar marks active, selected and toned states (sidebar, menus, alerts, toasts).</li>
    <li><b>Familiar API.</b> Names and anatomy follow common React conventions, so engineers can map components 1:1 to code.</li></ul>
    <h2 id="whats-inside">What's inside</h2>
    <table class="api"><thead><tr><th>Part</th><th>Path</th><th>Use it for</th></tr></thead><tbody>
      <tr><td><code>tokens.css</code></td><td>tokens/</td><td>CSS custom properties for every theme, brand and density</td></tr>
      <tr><td><code>facet.tokens.json</code></td><td>tokens/</td><td>W3C Design Tokens format (Style Dictionary, Tokens Studio)</td></tr>
      <tr><td><code>tailwind.preset.js</code></td><td>tokens/</td><td>Tailwind projects</td></tr>
      <tr><td><code>facet.css</code> + <code>facet.js</code></td><td>styleguide/assets/</td><td>Drop-in components for plain HTML</td></tr>
      <tr><td>Figma library</td><td><a href="${FIGMA}" target="_blank" rel="noopener">Get the Figma file</a></td><td>Design, prototypes, documentation, templates</td></tr></tbody></table>
    <div class="callout">${i("info")}<div>The CSS here is a faithful reference implementation of the Figma components, not a React package. For React, install the <a href="react/">animated React components</a> with the Facet CLI, <code>npx facetui</code> (see <a href="#/installation">Installation</a>).</div></div>`);

  P.installation = () => page("Getting started", "Installation", "Four ways to use Facet: animated React components, plain HTML, Tailwind CSS, or tokens only.", `
    <h2 id="react">React · animated components <span class="badge badge-brand">New</span></h2>
    <p>All ${R.length} components ship as React components with motion on every interaction (springs, layout animations, gestures), built on Radix and Tailwind. They install into your project with the Facet CLI, so you own the code. <a href="react/">Browse them live</a>.</p>
    <p><b>1.</b> In your React project (Next.js, Vite, React Router, Astro or TanStack Start), set up Facet. This adds Tailwind CSS v4 if needed, the <code>@/</code> import alias and the Facet theme. It asks once for the license key from your Gumroad receipt and saves it to <code>.env.local</code>.</p>${install("init")}
    <p><b>2.</b> Add any components, or everything at once:</p>${install("add button dialog tabs")}${install("add --all")}
    <p>Wrap your app in <code>&lt;FacetMotion&gt;</code> (from <code>@/lib/motion</code>) once so every animation respects the OS "reduce motion" setting.</p>
    <h2 id="html">1 · Plain HTML / any framework</h2><p>Copy <code>styleguide/assets/</code> from your Facet UI download into your project and include:</p>
    ${codeBlock(`<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/facet.css">
<script src="assets/icons.js" defer></script>
<script src="assets/facet.js" defer></script>

<html data-theme="light" data-brand="iris" data-density="comfortable">`, "html")}
    <p>Then copy any example's HTML from the component pages.</p>
    <h2 id="tailwind">2 · Tailwind CSS</h2>
    ${codeBlock(`// tailwind.config.js
module.exports = {
  presets: [require("./tokens/tailwind.preset.js")],
  content: ["./src/**/*.{ts,tsx}"],
}`, "js")}
    ${codeBlock(`/* app/globals.css */
@import "./tokens/tokens.css";
body { font-family: var(--font-sans); background: var(--bg-canvas); color: var(--text-primary); }`, "js")}
    <p>The preset maps the standard semantic names (<code>bg-primary</code>, <code>text-muted-foreground</code>, <code>border-input</code>, <code>ring</code>) to Facet tokens, and adds the full Facet groups: <code>bg-bg-subtle</code>, <code>text-fg-secondary</code>, <code>border-line-strong</code>, <code>rounded-lg</code>, <code>h-control-md</code>…</p>
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
    <p><a class="btn" href="${FIGMA}" target="_blank" rel="noopener">${i("external-link")} Get the Facet UI Figma file</a></p>
    <table class="api"><thead><tr><th>Page</th><th>Contents</th></tr></thead><tbody>
    ${[["00 — Start Here", "Cover, design directions, principles, inventory & status, getting started"], ["01 — Foundations", "Color ramps, typography (25 Mona Sans styles), spacing, radius, elevation, icons"], ["02 — Design Tokens", "Theme matrix (brand × light/dark), density, CSS reference, brand color examples"], ["03 — Components", "158 components / 105 variant sets with properties, states and sizes + 147 core icons"], ["04 — Patterns", "23 pattern components (app shell, filter bar, auth forms, AI dock, marketing sections…)"], ["05 — Templates", "10 apps, 26 desktop + mobile screens: dashboard, CRM, PM, AI, e-commerce, finance, calendar, settings, auth, marketing"], ["06 — Playground", "Sandboxes, theme lab, component tray, clickable prototype flows"], ["07 — Documentation", "20 component doc cards (anatomy, props, a11y, React code, do/don't) + customization guide"], ["08 — Changelog", "Version history and known limitations"], ["10 — Icons", "All 1,903 Lucide icons as components, grouped by category"]].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`).join("")}</tbody></table>
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

  P.motion = () => page("Foundations", "Motion & micro-interactions", "Every component responds to the cursor with a small, springy motion — fast enough to feel instant, soft enough to feel alive. Hover anything on this site to try it.", `
    <div class="example"><video class="showcase-video" autoplay muted loop playsinline preload="metadata" poster="assets/showcase/facet-micro-interactions-poster.jpg" aria-label="Facet UI micro-interactions demo"><source src="assets/showcase/facet-micro-interactions.webm" type="video/webm"><source src="assets/showcase/facet-micro-interactions.mp4" type="video/mp4"></video></div>
    <h2 id="principles">Principles</h2>
    <ul class="prose"><li><b>Responsive, not decorative.</b> Motion confirms an action (press, select, open) or guides the eye (sliding indicators). Nothing moves on its own except live-status pulses.</li>
    <li><b>Fast.</b> 80–320ms. State changes use a gentle spring overshoot; exits are quicker than entrances.</li>
    <li><b>Transform & opacity.</b> Animations stay on the compositor, so they never cause layout shifts or jank.</li>
    <li><b>Respectful.</b> <code>prefers-reduced-motion</code> turns everything off, and so does <code>&lt;html data-motion="off"&gt;</code> (the ⚡ toggle in the header).</li></ul>
    <h2 id="try">Try it</h2>
    <div class="example"><div class="preview">
      <button class="btn" data-magnetic>${i("sparkles")} Magnetic button</button>
      <button class="btn btn-outline">Continue ${i("arrow-right")}</button>
      <button class="btn btn-secondary icon-btn" aria-label="Add">${i("plus")}</button>
      <button class="btn btn-ghost icon-btn" aria-label="Notifications">${i("bell")}</button>
      <button class="btn btn-ghost icon-btn" aria-label="Delete">${i("trash-2")}</button>
      <label class="switch"><input type="checkbox" role="switch" checked> Spring switch</label>
      <label class="check"><input type="checkbox"><span>Draw a check</span></label>
    </div>
    <div class="preview" style="padding-top:0">
      <div class="card kpi" data-tilt="4" style="width:260px"><span class="kpi-label">Tilt + spotlight card</span><span class="kpi-value">$248,920</span><span class="t-caption text-tertiary">Hover and move the cursor</span></div>
      <div class="tabs-pill" role="tablist" aria-label="Range"><button class="tab" role="tab" aria-selected="false">Day</button><button class="tab" role="tab" aria-selected="true">Week</button><button class="tab" role="tab" aria-selected="false">Month</button></div>
      <div class="menu" role="menu" style="width:220px"><button class="menu-item" role="menuitem">${i("pencil")} Gliding highlight</button><button class="menu-item" role="menuitem">${i("copy")} Duplicate</button><button class="menu-item" role="menuitem">${i("download")} Export</button><button class="menu-item danger" role="menuitem">${i("trash-2")} Delete</button></div>
    </div></div>
    <h2 id="tokens">Motion tokens</h2>
    <table class="api"><thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead><tbody>
      <tr><td><code>--duration-instant</code></td><td>80ms</td><td>Press feedback</td></tr>
      <tr><td><code>--duration-fast</code></td><td>120ms</td><td>Color, background</td></tr>
      <tr><td><code>--duration-base</code></td><td>200ms</td><td>Shadows, fades</td></tr>
      <tr><td><code>--duration-slow</code></td><td>320ms</td><td>Springs: indicators, pops, lifts</td></tr>
      <tr><td><code>--duration-slower</code></td><td>480ms</td><td>Overlays, reveals</td></tr>
      <tr><td><code>--ease-out</code></td><td>cubic-bezier(.2,.8,.2,1)</td><td>Default exit / fade</td></tr>
      <tr><td><code>--ease-spring</code></td><td>cubic-bezier(.34,1.56,.64,1)</td><td>State changes with a soft overshoot</td></tr>
      <tr><td><code>--ease-in-out</code></td><td>cubic-bezier(.65,0,.35,1)</td><td>Height / loops</td></tr>
      <tr><td><code>--lift-sm / --lift-md</code></td><td>-1px / -2px</td><td>Hover lift for controls / cards</td></tr>
      <tr><td><code>--press-scale</code></td><td>.97</td><td>Press feedback</td></tr></tbody></table>
    <h2 id="setup">Setup</h2>
    ${codeBlock(`<link rel="stylesheet" href="assets/motion.css">   <!-- after facet.css -->
<script src="assets/motion.js" defer></script>        <!-- after facet.js -->

<div class="card" data-tilt="4">…</div>               <!-- 3D tilt, max 4° -->
<button class="btn" data-magnetic="0.12">…</button>   <!-- follows the cursor, max 6px -->
<span data-countup>$248,920</span>                    <!-- counts up on first view -->`, "html")}
    ${codeBlock(`Facet.motion.set("off")      // or "on" — persisted per browser
Facet.motion.refresh(el)    // after injecting new markup (SPA routes, modals)`, "js")}
    <h2 id="catalog">Interaction catalog</h2>
    <table class="api"><thead><tr><th>Component</th><th>Trigger</th><th>Behaviour</th></tr></thead><tbody>
    ${R.filter((c) => MOTION[c.slug]).map((c) => `<tr><td><a href="#/components/${c.slug}">${c.name}</a></td><td>${MOTION[c.slug][0]}</td><td>${MOTION[c.slug][1]}</td></tr>`).join("")}</tbody></table>
    <h2 id="react-motion">In React</h2><p>The CSS layer works with any React markup, and the animated React components already include this motion. For JS-driven effects (tilt, magnetic, sliding indicators) use <code>motion</code> (Framer Motion) with the same values:</p>
    ${codeBlock(`import { motion } from "motion/react"
const spring = { type: "spring", stiffness: 420, damping: 28 }  // ≈ --ease-spring @ 320ms

<motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={spring} />
<motion.span layoutId="tab-indicator" transition={spring} />    // sliding tab underline`, "js")}`);

  P.showcase = () => {
    const shots = [["01-cover","Cover"],["02-components","158 components"],["03-brands-themes","6 brands × light & dark"],["04-templates","10 app templates"],["05-light-dark","Light & dark"],["06-mobile","Mobile screens"],["07-ai-signature","AI & signature components"],["08-tokens-handoff","Tokens & developer handoff"]];
    return page("Getting started", "Showcase", "The Facet UI marketing kit, marketplace previews and the micro-interaction demo. Every image is 1920×1080 and ready to upload to Figma Community, Gumroad, UI8 or Creative Market.", `
    <div class="row" style="margin:-8px 0 24px"><a class="btn btn-ghost" href="${FIGMA}" target="_blank" rel="noopener">${i("component")} Get the Figma file</a></div>
    <h2 id="marketing">Marketing kit</h2><p>A 55-second product demo, a 33-second components reel, 13 angled hero images (3840×2160 and 2160×2160) and ready-to-paste listing copy. Everything is on the <a href="marketing/">marketing page</a> with download links.</p>
    <div class="example" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px"><video class="showcase-video" controls muted playsinline preload="none" poster="marketing/media/facet-ui-demo-poster.jpg" aria-label="Facet UI product demo"><source src="marketing/media/facet-ui-demo.webm" type="video/webm"><source src="marketing/media/facet-ui-demo.mp4" type="video/mp4"></video><video class="showcase-video" controls muted playsinline preload="none" poster="marketing/media/facet-ui-components-reel-poster.jpg" aria-label="Facet UI components reel"><source src="marketing/media/facet-ui-components-reel.webm" type="video/webm"><source src="marketing/media/facet-ui-components-reel.mp4" type="video/mp4"></video></div>
    <div class="row" style="margin:12px 0 8px"><a class="btn" href="marketing/">${i("external-link")} Open the marketing kit</a></div>
    <h2 id="video">Micro-interactions demo</h2><p>24 seconds, 1280×720. Hover the components on the <a href="#/motion">Motion</a> page to try them yourself.</p>
    <div class="example"><video class="showcase-video" autoplay muted loop playsinline preload="metadata" poster="assets/showcase/facet-micro-interactions-poster.jpg" aria-label="Facet UI micro-interactions demo"><source src="assets/showcase/facet-micro-interactions.webm" type="video/webm"><source src="assets/showcase/facet-micro-interactions.mp4" type="video/mp4"></video></div>
    <h2 id="previews">Marketplace previews</h2><p>Click an image to open it full size. The source frames live on <b>00 — Start Here → Marketplace previews</b> in Figma, set to export at 1x and 2x.</p>
    <div class="showcase-grid">${shots.map(([f, t]) => `<a class="card showcase-shot" data-tilt="3" href="assets/showcase/${f}.png" target="_blank" rel="noopener"><img src="assets/showcase/${f}.png" alt="${t} — Facet UI marketplace preview" loading="lazy" width="1920" height="1080"><span>${t}</span></a>`).join("")}</div>`);
  };

  P.icons = () => page("Foundations", "Icons", `Every <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a> icon (ISC license), searchable by name and tag. Click an icon to copy its HTML, SVG or React code. The Figma file has the same set as components on the <b>10 — Icons</b> page.`, `
    <div class="icon-tools">
      <div class="input-group">${i("search")}<input class="input" id="icon-q" type="search" placeholder="Search 1,900+ icons — try “arrow”, “money”, “chart”" autocomplete="off"></div>
      <select class="select" id="icon-cat" aria-label="Category"><option value="">All categories</option></select>
      <span class="icon-count" id="icon-count" aria-live="polite"></span>
    </div>
    <div class="icon-detail card" id="icon-detail" hidden></div>
    <div class="icon-grid" id="icon-grid"><p class="icon-loading">${i("loader-circle", "spin")} Loading the full icon set…</p></div>
    <h2 id="usage">Usage</h2>
    <p><code>icons.js</code> is the core sprite: the ${window.FACET_ICONS.length} icons the kit itself uses (small, loaded on every page). Add <code>lucide.js</code> after it when you want the whole set.</p>${codeBlock(`<script src="assets/icons.js" defer></script>
<script src="assets/lucide.js" defer></script>   <!-- optional: all Lucide icons -->

<svg class="icon"><use href="#sparkles"/></svg>  <!-- .icon-sm / .icon-lg -->`, "html")}
    <p>In React, use <code>lucide-react</code>, which the animated components already depend on: <code>import { Sparkles } from "lucide-react"</code>. Old Lucide names (for example <code>home</code> for <code>house</code>) still work in both sprites.</p>`);

  P.examples = () => page("Examples", "Examples", "Full pages built only with Facet components. Open them standalone or view them inline.", `<div class="ex-cards">${[["dashboard", "layout-dashboard", "Dashboard", "KPIs, revenue chart, deals table, activity"], ["login", "lock", "Login", "Sign in with SSO / email, OTP verify"], ["settings", "settings", "Settings", "Profile, notifications, danger zone"]].map(([s, ic, b, d]) => `<a class="card ex-card" data-tilt="3" href="#/examples/${s}"><span class="icon-wrap">${i(ic)}</span><b>${b}</b><span>${d}</span></a>`).join("")}</div>
    <p>The Figma file has 10 complete templates (26 screens) — CRM, project management, AI workspace, e-commerce, finance, calendar, settings, auth and marketing.</p>`);
  ["dashboard", "login", "settings"].forEach((s) => {
    P["examples/" + s] = () => page(`Examples ${i("chevron-right", "icon-sm")} ${s}`, s[0].toUpperCase() + s.slice(1), `Built from Facet components. <a href="examples/${s}.html" target="_blank" rel="noopener">Open standalone ${i("external-link", "icon-sm")}</a>`,
      `<div class="example"><iframe class="example-frame" src="examples/${s}.html" title="${s} example" loading="lazy"></iframe></div>`);
  });

  P.styles = () => page("Getting started", "Style themes", "Four looks on top of the six brand colors and light/dark: Default, Soft, Glass and Mono. They change shape, surfaces and depth — not your content. Switch with one attribute in code, or one Variable mode in Figma.",
    `<div class="style-grid">${Object.entries(T.styles).map(([k, n]) => `<button class="style-card" data-style-pick="${k}" aria-label="Use ${n}"><div class="style-demo" data-style="${k === "default" ? "" : k}"><div class="card kpi"><span class="kpi-label">Revenue</span><div class="kpi-row"><span class="kpi-value">$248.9k</span><span class="trend-chip">${i("trending-up")} 12%</span></div><div class="row" style="--gap:6px;margin-top:10px"><span class="btn btn-sm">Primary</span><span class="btn btn-outline btn-sm">Outline</span></div></div></div><div class="style-cap"><b>${n}</b><span>${STYLE_DESC[k]}</span></div></button>`).join("")}</div>
    <h2 id="use">Use it in code</h2>${codeBlock(`<html data-theme="light" data-brand="iris" data-style="glass">  <!-- default | soft | glass | mono -->\n\n// or at runtime\nFacet.theme.setStyle("glass");`, "html")}
    <h2 id="figma">Use it in Figma</h2><p>The <b>Style</b> collection has four modes — Default, Soft, Glass, Mono. Select a frame and pick the mode in the Layer panel's <b>Appearance → Variable modes</b>. Radius, borders and surfaces update together, and you can still switch Brand and Light/Dark independently.</p>
    <h2 id="tokens">What changes</h2><table class="api"><thead><tr><th>Style</th><th>Radius</th><th>Surfaces & borders</th><th>Depth</th></tr></thead><tbody><tr><td>Default</td><td>Facet cut · 8/12 px</td><td>Solid, 1px hairlines</td><td>Soft layered shadows</td></tr><tr><td>Soft</td><td>12/18 px</td><td>Borderless, brand-tinted canvas</td><td>Wide, diffused shadows</td></tr><tr><td>Glass</td><td>12/16 px</td><td>Translucent + 18px backdrop blur over a color mesh</td><td>Inner highlight + drop shadow</td></tr><tr><td>Mono</td><td>2–4 px</td><td>Black & white, ink borders; brand becomes ink</td><td>Hard offset shadows</td></tr></tbody></table>`);

  P.agents = () => page("AI agents", "AI agent examples", "Six product surfaces with an AI assistant built from Facet's AI components. Each one has its own data, suggested prompts and answers that render real UI — charts, approval cards, tables and maps. They work on desktop and mobile.",
    `<div class="agent-grid">${AGENTS.map((a) => `<a class="agent-card" href="#/agents/${a.id}"><div class="agent-shot"><img src="agents/shots/${a.id}.jpg" alt="${a.name} agent example" loading="lazy" width="1440" height="900"></div><div class="agent-meta"><span class="item-card-icon brand">${i(a.icon)}</span><div class="grow"><b>${a.name}</b><span>${a.desc}</span></div></div><div class="row" style="--gap:6px;padding:0 16px 16px">${a.tags.map((t) => `<span class="badge">${t}</span>`).join("")}</div></a>`).join("")}</div>
    <h2 id="how">How they're built</h2><p>Every example is one HTML page made only of Facet components: <a href="#/components/app-layout">App Layout</a>, <a href="#/components/chat-conversation">Chat Conversation</a>, <a href="#/components/chain-of-thought">Chain Of Thought</a>, <a href="#/components/chat-tool">Chat Tool</a> (with approvals), <a href="#/components/prompt-input">Prompt Input</a>, <a href="#/components/prompt-suggestion">Prompt Suggestion</a> and the chart components. A small script (<code>agents/agent.js</code>) plays scripted answers so you can try them without a backend — swap it for your model's streaming API.</p>
    ${codeBlock(`// agents/agent.js — plug in your own model\nFacetAgent.mount("#assistant", {\n  prompts: ["Show my runway", "Pay the AWS invoice"],\n  async reply(text, ui) {\n    ui.thinking(["Reading balances", "Forecasting burn"]);\n    const res = await fetch("/api/agent", { method: "POST", body: text });\n    ui.stream(res.body);           // markdown, charts, approvals\n  },\n});`, "js")}`);
  AGENTS.forEach((a) => {
    P["agents/" + a.id] = () => page(`AI agents ${i("chevron-right", "icon-sm")} ${a.name}`, a.name, `${a.desc} <a href="agents/${a.id}.html" target="_blank" rel="noopener">Open full screen ${i("external-link", "icon-sm")}</a>`,
      `<div class="example agent-frame-wrap"><div class="example-bar"><span class="t-label-sm text-tertiary" style="padding-left:4px">Live demo — click a suggested prompt</span><span class="spacer"></span><div class="seg vp-frame" role="group" aria-label="Viewport"><button aria-selected="true" data-frame="desktop" aria-label="Desktop">${i("monitor", "icon-sm")}</button><button aria-selected="false" data-frame="mobile" aria-label="Mobile">${i("smartphone", "icon-sm")}</button></div></div><div class="agent-frame-box"><iframe class="agent-frame" src="agents/${a.id}.html" title="${a.name} agent example" loading="lazy"></iframe></div></div>`);
  });

  const MOTION = {
    button: ["Hover", "Lifts 1px, gains a soft shadow and a spotlight that follows the cursor."], 
    toggle: ["Press / select", "Presses to 97%; in single-select groups a pill glides to the chosen option."],
    input: ["Focus", "Focus ring springs open; leading icon turns brand and scales up; invalid fields shake on submit."],
    field: ["Focus / error", "Same spring focus as Input; error text stays put so layout never jumps."],
    checkbox: ["Check", "Box pops with a spring and the check mark draws left-to-right; hover scales 1.08."],
    switch: ["Toggle", "Thumb springs across and stretches while pressed (like iOS); hover shows a soft halo."],
    slider: ["Drag", "Thumb grows on hover and more while dragging; progress bars ease to their value with a moving sheen."],
    "input-otp": ["Type", "Each slot lifts on focus and pops when a digit lands; focus auto-advances."],
    dropzone: ["Hover / drag", "Icon floats up; the zone swells slightly while a file is dragged over."],
    badge: ["Hover / live", "Lifts 1px; success dots pulse gently to signal live status."],
    avatar: ["Hover", "Avatar lifts and scales; groups fan out so each face is visible."],
    kbd: ["Press", "Key depresses (bottom border collapses) when hovered or when its button is pressed."],
    card: ["Hover", "Border tints toward the brand and a radial spotlight tracks the cursor; KPI values count up on first view."],
    table: ["Hover", "Row tint; the row avatar tilts and scales; action menus stagger in."],
    calendar: ["Hover / select", "Days scale on hover; the selected day pops."],
    charts: ["Reveal / hover", "Bars grow from the baseline with a stagger when scrolled into view; hovered bars brighten and legends dim the others."],
    alert: ["Enter", "Rises in and the signal rail draws downward."],
    toast: ["Enter / exit", "Springs up from below, shows a draining progress line (pauses on hover) and slides out right."],
    "empty-state": ["Idle", "Icon floats with a slow breathing motion."],
    dialog: ["Open", "Backdrop blurs; panel scales up from 95% with a gentle overshoot."],
    sheet: ["Open", "Sheet slides in from the edge; drawer rises from the bottom with a spring."],
    "dropdown-menu": ["Open / hover", "Menu scales from its trigger corner, items stagger in, and a highlight glides between items."],
    popover: ["Open / hover", "Tooltips wait 120ms, then spring in; popovers scale from 96%."],
    accordion: ["Expand", "Height animates open with a spring; the chevron flips; the row nudges right on hover."],
    tabs: ["Select", "The underline (or pill) slides to the new tab with a spring instead of jumping."],
    breadcrumb: ["Hover", "Page buttons lift; the current page pops; chevrons nudge in their direction."],
    chip: ["Press / select", "Press-to-97% with a ripple; the check icon pops in when selected; links underline from the left."],
    stepper: ["Reveal", "Progress bars fill one after another when the stepper scrolls into view."],
    sidebar: ["Hover", "A highlight glides between items; icons scale up slightly."],
    "command-palette": ["Open / navigate", "Results stagger in; the selection highlight glides with arrow keys."],
    ai: ["Compose / send", "Composer lifts on focus; the send arrow flies out and back; messages rise in; the AI mark shimmers."],
    kanban: ["Hover / drag", "Cards lift on hover; while grabbed they tilt 1.5° with a deeper shadow."],
    timeline: ["Reveal / live", "Items rise in sequence; AI nodes pulse; unread notifications ping."],
    pricing: ["Idle / hover", "The featured plan has a slowly rotating gradient border; cards lift on hover."],
  };
  P.components = () => page("Components", "Components", `${R.length} documented components in ${CATS.length} categories — ${R.filter((c) => c.isNew && !c.since).length} new in v1.2 and ${R.filter((c) => c.since === "1.3").length} in v1.3, covering every standard product-UI component. Every one is a real Figma component with Variables, and a working HTML/CSS version here. Each card is a live, scaled-down preview.`,
    `<div class="ov-filter"><div class="input-group" style="max-width:320px;flex:1"><svg class="icon"><use href="#search"/></svg><input class="input" id="ov-q" placeholder="Filter components…" aria-label="Filter components"></div><div class="row ov-chips">${CATS.map((g) => `<a class="chip" href="javascript:void 0" data-scroll="cat-${g.replace(/\W+/g, "-")}">${i(CAT_ICON[g], "icon-sm")} ${g}</a>`).join("")}</div></div>` +
    CATS.map((g) => { const items = R.filter((c) => c.group === g); if (!items.length) return ""; return `<h2 id="cat-${g.replace(/\W+/g, "-")}">${g} <span class="badge">${items.length}</span></h2><div class="ov-grid">${items.map((c) => `<a class="ov-card" href="#/components/${c.slug}" data-name="${c.name.toLowerCase()} ${g.toLowerCase()}"><div class="ov-thumb" aria-hidden="true" inert><div class="ov-inner">${c.examples[0].html}</div></div><div class="ov-meta"><b>${c.name}</b>${c.isNew ? '<span class="badge badge-accent">New</span>' : ""}<span class="ov-count">${c.examples.length} example${c.examples.length > 1 ? "s" : ""}</span></div></a>`).join("")}</div>`; }).join(""),
    `<span class="badge badge-outline">${i("layers", "icon-sm")} ${R.length} documented · 144 in Figma</span><button class="badge badge-outline" data-copy-md style="cursor:pointer;border:0">${i("copy", "icon-sm")} Copy Markdown</button>`);
  const md = (c) => `# ${c.name}\n\n${c.desc}\n\nCategory: ${c.group} · Figma: ${c.figma}\n\n` + c.examples.map((e) => `## ${e.title}\n\n\`\`\`html\n${tidy(e.html.trim())}\n\`\`\`\n`).join("\n") + `\n## React\n\n\`\`\`tsx\n${(LIC.data && LIC.data.react && LIC.data.react[c.slug]) || ""}\n\`\`\`\n\n## API\n\n| Name | Type | Description |\n|---|---|---|\n` + c.api.map(([a, b, d]) => `| \`${a}\` | ${b} | ${d} |`).join("\n") + `\n\n## Accessibility\n\n` + c.a11y.map((x) => `- ${x}`).join("\n") + "\n";
  window.FACET_MD = md;
  R.forEach((c) => {
    P["components/" + c.slug] = () => page(`Components ${i("chevron-right", "icon-sm")} ${c.group}`, c.name, c.desc,
      c.examples.map(example).join("") +
      (MOTION[c.slug] ? `<h2 id="motion">Motion</h2><div class="callout">${i("zap")}<div><b>${MOTION[c.slug][0]}.</b> ${MOTION[c.slug][1]} Turned off automatically for reduced-motion users. <a href="#/motion">Motion guide</a></div></div>` : "") +
      `<h2 id="react-animated">React · animated</h2><p>Install the animated React version with the Facet CLI. <a href="react/#${c.slug}">See it live</a> · <a href="#/installation">First-time setup</a></p>${install(`add ${c.slug}`)}
       <h2 id="react">React markup</h2>${LIC.unlocked && LIC.data && LIC.data.react && LIC.data.react[c.slug] ? codeBlock(LIC.data.react[c.slug], "js") : LIC.lockedHTML("The React markup")}
       <h2 id="api">API</h2><table class="api"><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>${c.api.map(([a, b, d]) => `<tr><td><code>${esc(a)}</code></td><td>${b}</td><td>${d}</td></tr>`).join("")}</tbody></table>
       <h2 id="a11y">Accessibility</h2><ul class="prose">${c.a11y.map((x) => `<li>${esc(x).replace(/&lt;(\/?\w+)&gt;/g, "<code>&lt;$1&gt;</code>")}</li>`).join("")}</ul>`,
      `<span class="badge badge-outline">${i("component", "icon-sm")} Figma: ${c.figma}</span><a class="badge badge-outline" href="${FIGMA}" target="_blank" rel="noopener" style="text-decoration:none">${i("external-link", "icon-sm")} Get the Figma file</a><button class="badge badge-outline" data-copy-md="${c.slug}" style="cursor:pointer;border:0">${i("copy", "icon-sm")} Copy Markdown</button>${c.isNew ? `<span class="badge badge-accent">New in v${c.since || "1.2"}</span>` : ""}`);
  });

  /* ---------- router ---------- */
  function route() {
    const id = (location.hash.replace(/^#\/?/, "") || "introduction").split("?")[0];
    const fn = P[id] || P.introduction; const cur = P[id] ? id : "introduction";
    const main = $(".docs-main"); main.innerHTML = fn();
    const idx = FLAT.findIndex((f) => f.id === cur), prev = FLAT[idx - 1], next = FLAT[idx + 1];
    main.querySelector("article").insertAdjacentHTML("beforeend", `<nav class="pager">${prev ? `<a href="#/${prev.id}"><small>Previous</small>${prev.label}</a>` : ""}${next ? `<a href="#/${next.id}"><small>Next</small>${next.label}</a>` : ""}</nav><p class="doc-credit">Facet UI v1.3 · by ETKits</p>`);
    renderSide(cur); toc(); Facet.enhance(main); if (Facet.motion) Facet.motion.refresh(document); document.body.classList.remove("nav-open");
    document.title = (FLAT[idx] ? FLAT[idx].label + " — " : "") + "Facet UI";
    window.scrollTo(0, 0);
    if (cur === "brand-colors") studio();
    if (cur === "icons") iconsPage();
    main.querySelectorAll("[data-custom-brand]").forEach((el) => T.setCustomBrand(el.dataset.customBrand, el));
    const on = $(".docs-side a.on"); if (on) on.scrollIntoView({ block: "nearest" });
    document.querySelectorAll(".header-nav a").forEach((a) => a.classList.toggle("on", cur.startsWith(a.dataset.sec)));
  }
  function toc() {
    const hs = [...document.querySelectorAll(".docs-main article > h2, .docs-main article > h3")];
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

  /* ---------- icons page (full Lucide set, loaded on demand) ---------- */
  const pascal = (n) => n.replace(/(^|-)([a-z0-9])/g, (m, a, b) => b.toUpperCase());
  let iconIndex = null;
  function iconsPage() {
    if (window.FACET_LUCIDE) return renderIcons();
    document.addEventListener("facet:lucide", renderIcons, { once: true });
    if (!document.querySelector("script[data-lucide]")) { const sc = document.createElement("script"); sc.src = "assets/lucide.js"; sc.dataset.lucide = ""; document.head.appendChild(sc); }
  }
  function renderIcons() {
    const L = window.FACET_LUCIDE, grid = $("#icon-grid"); if (!grid) return;
    if (!iconIndex) {
      const al = {}; Object.entries(L.aliases).forEach(([a, n]) => (al[n] = (al[n] || "") + " " + a));
      iconIndex = L.icons.map(([n, cats, tags]) => ({ n, cats, names: (n + (al[n] || "")).split(" "), hay: (n + " " + tags + (al[n] || "")).toLowerCase() }));
    }
    const counts = L.categories.map((_, k) => iconIndex.filter((x) => x.cats.includes(k)).length);
    $("#icon-cat").insertAdjacentHTML("beforeend", L.categories.map((c, k) => [c, k]).sort((a, b) => a[0].localeCompare(b[0])).map(([c, k]) => `<option value="${k}">${esc(c)} (${counts[k]})</option>`).join(""));
    grid.innerHTML = iconIndex.map((x) => `<button class="icon-cell" data-icon="${x.n}" title="${x.n}">${i(x.n)}<span>${x.n}</span></button>`).join("");
    filterIcons();
  }
  function filterIcons() {
    if (!iconIndex || !$("#icon-grid")) return;
    const q = $("#icon-q").value.toLowerCase().trim(), cat = $("#icon-cat").value, words = q.split(/\s+/).filter(Boolean);
    let shown = 0;
    $("#icon-grid").querySelectorAll(".icon-cell").forEach((c, k) => {
      const x = iconIndex[k], ok = (cat === "" || x.cats.includes(+cat)) && words.every((w) => x.hay.includes(w));
      c.hidden = !ok; if (ok) shown++;
      // exact name first, then names that start with / contain the query, then tag matches
      c.style.order = !q || !ok ? "" : x.names.includes(q) ? 0 : x.names.some((m) => m.startsWith(q)) ? 1 : x.n.includes(q) ? 2 : 3;
    });
    $("#icon-count").textContent = shown === iconIndex.length ? `${shown.toLocaleString()} icons` : `${shown.toLocaleString()} of ${iconIndex.length.toLocaleString()}`;
  }
  function showIcon(n) {
    const L = window.FACET_LUCIDE, x = iconIndex.find((y) => y.n === n), sym = document.getElementById(n); if (!x || !sym) return;
    const html = `<svg class="icon"><use href="#${n}"/></svg>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${sym.innerHTML}</svg>`;
    const react = `import { ${pascal(n)} } from "lucide-react"\n\n<${pascal(n)} className="size-4" />`;
    const row = (label, code) => `<div class="icon-code"><span>${label}</span><code>${esc(code.split("\n").pop())}</code><button class="btn btn-ghost btn-sm" data-copy-text="${esc(code).replace(/"/g, "&quot;")}">${i("copy", "icon-sm")} Copy</button></div>`;
    const d = $("#icon-detail"); d.hidden = false;
    d.innerHTML = `<div class="icon-preview">${i(n)}</div><div class="icon-info"><div class="icon-head"><b>${n}</b>${x.cats.map((k) => `<button class="badge badge-outline" data-icon-cat="${k}">${esc(L.categories[k])}</button>`).join("")}<button class="btn btn-ghost btn-sm icon-btn" data-icon-close aria-label="Close">${i("x", "icon-sm")}</button></div>${row("HTML", html)}${row("SVG", svg)}${row("React", react)}</div>`;
    document.querySelectorAll(".icon-cell[aria-pressed]").forEach((c) => c.removeAttribute("aria-pressed"));
    const cell = document.querySelector(`.icon-cell[data-icon="${n}"]`); if (cell) cell.setAttribute("aria-pressed", "true");
    d.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  document.addEventListener("click", (e) => {
    const c = e.target.closest(".icon-cell[data-icon]"); if (c) showIcon(c.dataset.icon);
    const k = e.target.closest("[data-icon-cat]"); if (k) { $("#icon-cat").value = k.dataset.iconCat; filterIcons(); }
    if (e.target.closest("[data-icon-close]")) { $("#icon-detail").hidden = true; document.querySelectorAll(".icon-cell[aria-pressed]").forEach((x) => x.removeAttribute("aria-pressed")); }
  });
  document.addEventListener("change", (e) => { if (e.target.id === "icon-cat") filterIcons(); });

  /* ---------- header controls ---------- */
  function syncHeader() {
    const s = T.get();
    $("#mode-btn").innerHTML = i(s.mode === "dark" ? "sun" : "moon");
    $("#mode-btn").setAttribute("aria-label", s.mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
    $("#density-btn").setAttribute("aria-pressed", s.density === "compact");
    $("#brand-dot").style.setProperty("--sw", s.custom || T.presets[s.brand] || "#5d4ff3");
    const mb = $("#motion-btn"); if (mb) mb.setAttribute("aria-pressed", document.documentElement.dataset.motion !== "off");
    document.querySelectorAll("#brand-menu [data-b]").forEach((b) => b.setAttribute("aria-checked", !s.custom && b.dataset.b === s.brand));
    document.querySelectorAll("[data-style-pick]").forEach((b) => b.setAttribute("aria-checked", b.dataset.stylePick === s.style));
    const sl = $("#style-label"); if (sl) sl.textContent = (T.styles || {})[s.style] || "Default";
  }
  const STYLE_DESC = { default: "Facet cut, crisp borders", soft: "Rounder, borderless, tinted", glass: "Frosted, translucent", mono: "Black & white, hard shadows" };
  const styleThumb = (k) => `<span class="style-thumb" data-style-preview="${k}"><i></i><i></i><b></b></span>`;
  $("#style-menu").innerHTML = `<div class="menu-label">Style theme</div>` + Object.entries(T.styles || {}).map(([k, n]) => `<button class="menu-item style-item" role="menuitemradio" data-style-pick="${k}">${styleThumb(k)}<span class="grow"><b>${n}</b><small>${STYLE_DESC[k]}</small></span></button>`).join("") + `<div class="menu-sep"></div><a class="menu-item" role="menuitem" href="#/styles">${i("book-open")} About style themes</a>`;
  $("#brand-menu").innerHTML = `<div class="menu-label">Brand</div>` + Object.entries(T.presets).map(([n, h]) => `<button class="menu-item" role="menuitemradio" data-b="${n}"><span class="swatch-dot" style="--sw:${h}"></span>${n[0].toUpperCase() + n.slice(1)}</button>`).join("") + `<div class="menu-sep"></div><a class="menu-item" role="menuitem" href="#/brand-colors">${i("palette")} Custom color…</a>`;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-b]"); if (b) T.setBrand(b.dataset.b);
    if (e.target.closest("#mode-btn")) T.setMode(T.get().mode === "dark" ? "light" : "dark");
    if (e.target.closest("#motion-btn") && Facet.motion) { Facet.motion.set(document.documentElement.dataset.motion === "off" ? "on" : "off"); syncHeader(); }
    if (e.target.closest("#density-btn")) T.setDensity(T.get().density === "compact" ? "comfortable" : "compact");
    if (e.target.closest(".mobile-nav")) document.body.classList.toggle("nav-open");
    const sc = e.target.closest("[data-scroll]"); if (sc) document.getElementById(sc.dataset.scroll).scrollIntoView({ behavior: "smooth" });
    // example tabs
    const v = e.target.closest(".example-bar [data-view]");
    if (v) { const ex = v.closest(".example"); ex.querySelectorAll("[data-view]").forEach((x) => x.setAttribute("aria-selected", x === v)); ex.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== v.dataset.view)); }
    const fr = e.target.closest("[data-frame]");
    if (fr) { const ex = fr.closest(".example"); ex.querySelectorAll("[data-frame]").forEach((x) => x.setAttribute("aria-selected", x === fr)); ex.classList.toggle("is-mobile", fr.dataset.frame === "mobile"); }
    // viewport toggle
    const vp = e.target.closest(".example-bar [data-vp]");
    if (vp) { const ex = vp.closest(".example"); ex.querySelectorAll("[data-vp]").forEach((x) => x.setAttribute("aria-selected", x === vp)); ex.classList.toggle("is-mobile", vp.dataset.vp === "mobile"); requestAnimationFrame(() => { if (Facet.ui) Facet.ui.refresh(ex); if (Facet.charts) ex.querySelectorAll(".chart[data-chart]").forEach((c) => Facet.charts.render(c, c._chart)); }); }
    // copy markdown
    const cm = e.target.closest("[data-copy-md]");
    if (cm && cm.dataset.copyMd && !LIC.unlocked) { LIC.open(); return; }
    if (cm) { const slug = cm.dataset.copyMd; const txt = slug ? window.FACET_MD(R.find((c) => c.slug === slug)) : `# Facet UI components\n\n` + CATS.map((g) => `## ${g}\n\n` + R.filter((c) => c.group === g).map((c) => `- **${c.name}** — ${c.desc}`).join("\n")).join("\n\n"); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => Facet.toast({ title: "Markdown copied", description: "Paste it into your AI assistant or docs.", timeout: 2200 })).catch(() => {}); }
    // style themes
    const st = e.target.closest("[data-style-pick]"); if (st) T.setStyle(st.dataset.stylePick);
    // package manager tabs on install commands
    const pmb = e.target.closest("[data-pm]");
    if (pmb) {
      const pm = pmb.dataset.pm; try { localStorage.setItem("facet-pm", pm); } catch (err) {}
      document.querySelectorAll(".pm-install").forEach((box) => { const full = PM[pm](box.dataset.pmCmd); box.querySelectorAll("[data-pm]").forEach((b) => b.setAttribute("aria-selected", b.dataset.pm === pm)); box.querySelector("code").textContent = full; box.querySelector(".pm-copy").dataset.copyText = full; });
    }
    // copy
    const cp = e.target.closest("[data-copy], [data-copy-ex], [data-copy-text]");
    if (cp) {
      const txt = cp.dataset.copyText || (cp.hasAttribute("data-copy-ex") ? cp.closest(".example").querySelector("code").dataset.raw : cp.parentElement.querySelector("code").dataset.raw);
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => Facet.toast({ title: "Copied to clipboard", timeout: 1600 })).catch(() => Facet.toast({ title: "Copy failed", description: "Select the code and copy manually.", tone: "var(--icon-danger)", icon: "alert-circle" }));
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "ov-q") { const q = e.target.value.toLowerCase().trim(); document.querySelectorAll(".ov-card").forEach((c) => (c.hidden = q && !c.dataset.name.includes(q))); document.querySelectorAll(".docs-main h2[id^=cat-]").forEach((h) => { const g = h.nextElementSibling; h.hidden = g.hidden = q && ![...g.children].some((c) => !c.hidden); }); }
    if (e.target.id === "icon-q" || e.target.id === "icon-cat") filterIcons();
  });
  document.addEventListener("facet:theme", syncHeader);
  document.addEventListener("facet:license", () => { const y = window.scrollY; route(); window.scrollTo(0, y); syncLicense(); });
  function syncLicense() {
    const b = $("#license-btn"); if (!b) return;
    b.hidden = !!LIC.buyerCopy;
    b.innerHTML = LIC.unlocked ? `${i("badge-check", "icon-sm")}<span class="label-text">Licensed</span>` : `${i("lock", "icon-sm")}<span class="label-text">Unlock code</span>`;
    b.toggleAttribute("data-unlock", !LIC.unlocked);
    b.setAttribute("aria-label", LIC.unlocked ? "Licensed. Click to forget the license key on this browser" : "Unlock the code with your license key");
  }
  syncLicense();
  document.addEventListener("click", (e) => { if (e.target.closest("#license-btn") && LIC.unlocked && !LIC.buyerCopy && confirm("Forget the license key on this browser?")) LIC.signOut(); });

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
