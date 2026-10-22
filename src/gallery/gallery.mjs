/*! FacetUI Industry Templates · gallery · © 2026 ETKits. All rights reserved. */
import { html, raw, esc, attrs } from "../kit/html.mjs";
import { icon, chip, filterable } from "../kit/ui.mjs";
import { KIT } from "../kit/layout.mjs";
import { sectors } from "../templates/registry.mjs";

export function renderGallery({ registry, builtSlugs, previews }) {
  const ready = registry.filter((r) => builtSlugs.has(r.slug)).length;
  const cards = registry.map((r) => {
    const isReady = builtSlugs.has(r.slug);
    const sectorKey = r.sector.toLowerCase().replace(/[^a-z]+/g, "-");
    const preview = previews(r.slug)
      ? html`<img src="assets/previews/${r.slug}.webp" alt="" loading="lazy" decoding="async" width="720" height="540">`
      : html`<span class="g-noprev" aria-hidden="true">${icon(isReady ? "image" : "hourglass")}</span>`;
    const body = html`<span class="g-thumb">${preview}</span>
      <span class="g-meta"><span class="g-num k-num">${String(r.n).padStart(2, "0")}</span><span class="g-industry">${r.industry}</span></span>
      <span class="g-brand">${r.brandName}</span>
      <span class="g-summary">${r.summary}</span>
      <span class="g-status">${isReady ? html`<span class="badge badge-success"><span class="dot"></span>Ready</span>` : html`<span class="badge badge-outline">In production</span>`}</span>`;
    return isReady
      ? html`<a class="g-card" href="t/${r.slug}/index.html" data-sector="${sectorKey}" data-status="ready" data-search="${`${r.industry} ${r.brandName} ${r.summary} ${r.sector}`.toLowerCase()}">${body}</a>`
      : html`<div class="g-card g-card--pending" data-sector="${sectorKey}" data-status="pending" data-search="${`${r.industry} ${r.brandName} ${r.summary} ${r.sector}`.toLowerCase()}" aria-label="${r.industry}, in production">${body}</div>`;
  });
  const controls = html`
    <div class="g-search input-shell"><span class="input-shell-addon">${icon("search", { size: "sm" })}</span><input type="search" data-filter="q" placeholder="Search industries, brands or features" aria-label="Search templates"></div>
    <div class="k-cluster g-chips" role="group" aria-label="Filter by sector">${chip("All sectors", { filter: "sector", value: "", pressed: true })}${sectors.map((s) => chip(s, { filter: "sector", value: s.toLowerCase().replace(/[^a-z]+/g, "-") }))}</div>
    <select class="select select-sm g-status-filter" data-filter="status" aria-label="Filter by status"><option value="">Any status</option><option value="ready">Ready to use</option><option value="pending">In production</option></select>`;
  return `<!doctype html>
<!-- ${KIT.name} v${KIT.version} · © ${KIT.year} ${KIT.by}. -->
<html lang="en" data-theme="light" data-brand="iris" data-density="comfortable">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${KIT.name} · ${KIT.by}</title>
<meta name="description" content="36 responsive industry website templates built on Facet UI, by ${KIT.by}.">
<link rel="preload" href="assets/fonts/mona-sans-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/facet/tokens.css">
<link rel="stylesheet" href="assets/facet/facet.css">
<link rel="stylesheet" href="assets/kit/kit.css">
<link rel="stylesheet" href="assets/gallery.css">
<script src="assets/icons.js"></script>
<script src="assets/facet/facet.js"></script>
<script>(function(r){r.dataset.theme="light";r.dataset.brand="iris";r.dataset.density="comfortable";delete r.dataset.style;delete r.dataset.custom;})(document.documentElement);</script>
<script src="assets/kit/kit.js" defer></script>
</head>
<body class="k-page g-page">
<a class="k-skip btn" href="#main">Skip to main content</a>
<header class="g-header"><div class="k-wrap g-header-inner">
  <span class="g-logo">${KIT.by}</span>
  <span class="t-label-sm text-tertiary">Built on Facet UI</span>
</div></header>
<main id="main" tabindex="-1">
<section class="g-hero"><div class="k-wrap g-hero-inner k-enter">
  <h1 class="k-display" style="--i:0">36 industries. One design system.</h1>
  <p class="k-lede" style="--i:1">Responsive website templates for real businesses, each with a home page, an inner page and a working conversion flow. Every template shares Facet UI's tokens and components, so a brand change is one attribute.</p>
  <dl class="g-stats" style="--i:2"><div><dt>Templates ready</dt><dd class="k-num">${ready} of ${registry.length}</dd></div><div><dt>Pages per template</dt><dd>3 or more</dd></div><div><dt>Accessibility target</dt><dd>WCAG 2.2 AA</dd></div></dl>
</div></section>
<section class="k-section k-section--flush-top" aria-labelledby="g-list"><div class="k-wrap">
  <h2 class="sr-only" id="g-list">Templates</h2>
  ${String(filterable({ id: "gallery", label: "Filter templates", controls, items: cards, itemsClass: "g-grid", countLabel: "templates", empty: { icon: "search-x", title: "No templates match", text: "Try a broader word such as “booking” or clear the sector filter.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Clear filters</button>` } }))}
</div></section>
</main>
<footer class="k-footer"><div class="k-wrap k-footer-legal" style="margin:0;border:0;padding:0">
  <p>${KIT.name} v${KIT.version}. Brands, people and figures in the templates are fictional sample content.</p>
  <p>© ${KIT.year} ${KIT.by}. All rights reserved. Facet UI © ${KIT.year} ${KIT.by}. Mona Sans (SIL OFL 1.1) · Lucide icons (ISC).</p>
</div></footer>
</body>
</html>
`;
}
