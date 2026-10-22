/*! FacetUI Industry Templates · © 2026 ETKits. All rights reserved. */
import { html, raw, attrs, cx, esc } from "./html.mjs";
import { icon, btn, brandMark } from "./ui.mjs";

export const KIT = { name: "FacetUI Industry Templates", by: "ETKits", year: 2026, version: "1.0.0" };

/* ------------------------------------------------------------ header */
function navLinks(ctx, cls = "") {
  return ctx.tpl.nav.map((l) => {
    const current = l.page && l.page === ctx.page.key;
    return html`<a${attrs({ href: ctx.href(l), class: cls || null, "aria-current": current ? "page" : null })}>${l.label}</a>`;
  });
}

export function siteHeader(ctx) {
  const { tpl } = ctx;
  const h = tpl.header || {};
  const variant = (ctx.page.header && ctx.page.header.variant) || h.variant || "bar";
  const cta = h.cta ? btn({ ...h.cta, href: ctx.href(h.cta), size: "sm", className: h.ctaHideSm ? "hide-sm" : null }) : "";
  const secondary = h.secondary ? btn({ ...h.secondary, href: ctx.href(h.secondary), size: "sm", variant: "ghost", className: "hide-sm" }) : "";
  const menuId = "site-menu";
  const utility = h.utility
    ? html`<div class="k-utility"><div class="k-wrap k-utility-inner">${h.utility.map((u) =>
        u.href ? html`<a class="k-utility-item" href="${ctx.href(u)}">${u.icon ? icon(u.icon, { size: "sm" }) : ""}${u.label}</a>` : html`<span class="k-utility-item">${u.icon ? icon(u.icon, { size: "sm" }) : ""}${u.label}</span>`)}</div></div>`
    : "";
  return html`<div class="${cx("k-header", `k-header--${variant}`, h.sticky !== false && "k-header--sticky")}" data-kit-header>
  ${utility}
  <header class="navbar">
    <div class="navbar-inner k-wrap">
      <a class="navbar-brand k-brand" href="${ctx.href({ page: "home" })}" aria-label="${tpl.brand.name} home">${brandMark(tpl.brand)}<span class="k-brand-name">${tpl.brand.name}</span></a>
      <nav class="navbar-links" aria-label="Main">${navLinks(ctx)}</nav>
      <div class="navbar-actions">${secondary}${cta}<button class="btn btn-ghost btn-sm icon-btn navbar-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="${menuId}"><svg class="icon" aria-hidden="true"><use href="#menu"/></svg></button></div>
    </div>
    <nav class="navbar-mobile" id="${menuId}" aria-label="Main (mobile)">${navLinks(ctx)}${h.cta ? html`<a class="btn btn-block" href="${ctx.href(h.cta)}">${h.cta.label}</a>` : ""}</nav>
  </header>
</div>`;
}

/* ------------------------------------------------------------ footer */
export function siteFooter(ctx) {
  const { tpl } = ctx;
  const f = tpl.footer || {};
  const variant = f.variant || "columns";
  const legal = html`<div class="k-footer-legal">
    <p>${tpl.brand.name} is a fictional ${tpl.business} created to demonstrate this template. Names, people, prices and figures are sample content.</p>
    <p>Template © ${KIT.year} ${KIT.by}. Built with Facet UI.</p>
  </div>`;
  const cols = (f.columns || []).map((c) => html`<div class="k-footer-col"><h2 class="k-footer-title">${c.title}</h2><ul>${c.links.map((l) => html`<li><a href="${ctx.href(l)}">${l.label}</a></li>`)}</ul></div>`);
  const contact = f.contact ? html`<address class="k-footer-contact">${f.contact.map((c) => html`<span>${c.icon ? icon(c.icon, { size: "sm" }) : ""}${c.href ? html`<a href="${c.href}">${c.label}</a>` : c.label}</span>`)}</address>` : "";
  const brand = html`<div class="k-footer-brand"><a class="k-brand" href="${ctx.href({ page: "home" })}">${brandMark(tpl.brand)}<span class="k-brand-name">${tpl.brand.name}</span></a>${f.blurb ? html`<p>${f.blurb}</p>` : ""}${contact}</div>`;
  if (variant === "compact") {
    return html`<footer class="k-footer k-footer--compact"><div class="k-wrap">${brand}<nav aria-label="Footer" class="k-footer-inline">${(f.columns || []).flatMap((c) => c.links).map((l) => html`<a href="${ctx.href(l)}">${l.label}</a>`)}</nav>${legal}</div></footer>`;
  }
  return html`<footer class="${cx("k-footer", `k-footer--${variant}`)}"${f.theme ? html` data-theme="${f.theme}"` : ""}><div class="k-wrap">
    ${variant === "statement" && f.statement ? html`<p class="k-footer-statement">${f.statement}</p>` : ""}
    <div class="k-footer-grid">${brand}<nav aria-label="Footer" class="k-footer-cols">${cols}</nav></div>
    ${legal}
  </div></footer>`;
}

/* ------------------------------------------------------------ kit bar */
function kitBar(ctx) {
  if (ctx.tpl.kitBar === false) return "";
  return html`<div class="k-kitbar" data-theme="dark"><div class="k-wrap k-kitbar-inner">
    <a href="${ctx.root}index.html">${icon("layout-grid", { size: "sm" })}All templates</a>
    <span class="k-kitbar-meta">${ctx.tpl.industry} · ${ctx.tpl.brand.name}</span>
    <nav aria-label="Template pages" class="k-kitbar-pages">${ctx.pages.filter((p) => p.kitbar !== false).map((p) => html`<a href="${p.file}"${p.key === ctx.page.key ? raw(' aria-current="page"') : ""}>${p.short || p.title}</a>`)}</nav>
  </div></div>`;
}

/* ------------------------------------------------------------ document */
export function documentShell(ctx, body) {
  const { tpl, page } = ctx;
  const t = tpl.theme;
  const title = page.key === "home" ? `${tpl.brand.name} · ${tpl.brand.tagline}` : `${page.title} · ${tpl.brand.name}`;
  const themeAttrs = {
    lang: "en",
    "data-theme": t.mode || "light",
    "data-brand": t.brand,
    "data-density": t.density || "comfortable",
    "data-style": t.style || null,
    "data-kit": tpl.slug,
  };
  return `<!doctype html>
<!-- ${KIT.name} v${KIT.version} · © ${KIT.year} ${KIT.by}. Template: ${tpl.industry} (${tpl.brand.name}, fictional). -->
<html${attrs(themeAttrs)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description || tpl.description)}">
<meta name="theme-color" content="${esc(t.themeColor || "#ffffff")}">
<meta name="generator" content="${KIT.name} by ${KIT.by}">
<link rel="preload" href="${ctx.root}assets/fonts/mona-sans-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ctx.root}assets/facet/tokens.css">
<link rel="stylesheet" href="${ctx.root}assets/facet/facet.css">
<link rel="stylesheet" href="${ctx.root}assets/kit/kit.css">
${ctx.brandCss ? `<style>${ctx.brandCss}</style>\n` : ""}<link rel="stylesheet" href="./template.css">
<script src="${ctx.root}assets/icons.js"></script>
<script src="${ctx.root}assets/facet/facet.js"></script>
<script>/* Theme guard: facet.js restores the last theme saved on this origin. Templates share an origin, so re-apply this template's own theme. */(function(r,t){["theme","brand","density","style"].forEach(function(k){t[k]?r.dataset[k]=t[k]:delete r.dataset[k]});delete r.dataset.custom;for(var s of[50,100,200,300,400,500,600,700,800,900,950])r.style.removeProperty("--brand-"+s)})(document.documentElement,${JSON.stringify({ theme: t.mode || "light", brand: t.brand, density: t.density || "comfortable", style: t.style || "" })});</script>
<script src="${ctx.root}assets/kit/kit.js" defer></script>
${ctx.templateJs ? `<script src="./template.js" defer></script>\n` : ""}</head>
<body class="${cx("k-page", `k-page--${page.key}`, page.bodyClass)}">
<a class="k-skip btn" href="#main">Skip to main content</a>
${kitBar(ctx)}
${siteHeader(ctx)}
<main id="main" tabindex="-1">
${body}
</main>
${siteFooter(ctx)}
</body>
</html>
`;
}
