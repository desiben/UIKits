/*! FacetUI Industry Templates · Architecture & Interiors · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, media, breadcrumb, kitForm, field, choices, filterable, chip } from "../../kit/ui.mjs";
import content from "./content.mjs";

/* ------------------------------------------------------------------ home */
function indexHero(ctx) {
  const { tpl } = ctx;
  return html`<section class="sv-index" aria-labelledby="sv-title"><div class="k-wrap k-wrap--wide sv-index-grid">
    <div class="sv-index-text k-enter">
      <h1 class="k-display sv-title" id="sv-title" style="--i:0">Houses and interiors that start from the site</h1>
      <nav class="sv-list" aria-label="Recent projects" style="--i:1" data-sv-list>
        <ol role="list">${tpl.projects.map((p, i) => html`<li><a href="${ctx.href({ page: `project-${p.id}` })}" data-sv-target="${i}"${i === 0 ? raw(' data-on="true"') : ""}><span class="sv-list-name">${p.name}</span><span class="sv-list-place">${p.place}</span><span class="sv-list-year k-num">${p.status === "On site" ? "On site" : p.year}</span></a></li>`)}</ol>
      </nav>
    </div>
    <div class="sv-stage" data-sv-stage aria-hidden="true">
      ${tpl.projects.map((p, i) => html`<div class="sv-stage-item"${i === 0 ? raw(' data-active="true"') : ""}>${media(ctx, `${p.id}-hero`, { ratio: "4/5", ratioSm: "4/3", shape: "none", priority: i === 0, fill: true })}</div>`)}
    </div>
  </div></section>`;
}

function intro(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section" aria-label="About the studio"><div class="k-wrap k-wrap--wide sv-intro">
    <p class="sv-statement">${tpl.intro}</p>
    <dl class="sv-facts">${tpl.facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
  </div></section>`;
}

function work(ctx) {
  const { tpl } = ctx;
  const items = tpl.projects.map((p, i) => html`<article class="sv-work sv-work--${i % 6}" data-type="${p.type}">
    <a href="${ctx.href({ page: `project-${p.id}` })}" class="sv-work-link">
      ${media(ctx, `${p.id}-hero`, { ratio: i % 3 === 0 ? "3/2" : "4/5", shape: "sm", hideBrief: false })}
      <span class="sv-work-meta"><span class="sv-work-name">${p.name}</span><span class="sv-work-sub">${p.typeLabel}, ${p.place}</span><span class="sv-work-year k-num">${p.status === "On site" ? "On site" : p.year}</span></span>
    </a>
  </article>`);
  const controls = html`${chip("All work", { filter: "type", value: "", pressed: true })}${tpl.filters.map((f) => chip(f.label, { filter: "type", value: f.id }))}`;
  return html`<section class="k-section k-section--flush-top" id="work" aria-labelledby="work-title"><div class="k-wrap k-wrap--wide">
    <div class="sv-head"><h2 class="k-h2" id="work-title">Selected work</h2></div>
    ${filterable({ id: "work-filter", label: "Filter projects by type", controls, items, itemsClass: "sv-work-grid", countLabel: "projects", empty: { icon: "folder-open", title: "Nothing in this category yet", text: "Choose another type to see more of the studio's work.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Show all work</button>` } })}
  </div></section>`;
}

function approach(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-surface" id="approach" aria-labelledby="ap-title"><div class="k-wrap k-wrap--wide">
    <div class="sv-head sv-head--split"><h2 class="k-h2" id="ap-title">How a project runs</h2><p class="k-lede">Most new homes take two to three years from first visit to keys. Renovations and interiors are quicker. You'll always know which stage you're in and what comes next.</p></div>
    <ol class="sv-process">${tpl.process.map((s) => html`<li><span class="sv-process-time">${s.time}</span><h3 class="sv-process-title">${s.title}</h3><p>${s.text}</p></li>`)}</ol>
  </div></section>`;
}

function studio(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section" id="studio" aria-labelledby="st-title"><div class="k-wrap k-wrap--wide k-split k-split--center" style="--k-split-a:7fr;--k-split-b:5fr">
    ${media(ctx, "studio", { shape: "sm" })}
    <div class="k-stack" style="--k-gap:var(--space-6)">
      <h2 class="k-h2" id="st-title">The studio</h2>
      <p class="k-lede">Fourteen architects and interior designers in a converted foundry by the canal. Every project is led by a director from first visit to handover.</p>
      <ul class="sv-people" role="list">${tpl.people.map((p) => html`<li><span>${p.name}</span><span>${p.role}</span></li>`)}</ul>
    </div>
  </div></section>`;
}

const cta = (ctx) => html`<section class="k-section sv-cta" data-theme="dark" aria-labelledby="cta-title"><div class="k-wrap k-wrap--wide sv-cta-inner">
  <h2 class="k-h1" id="cta-title">Have a site, or a house that isn't working?</h2>
  <div class="k-stack" style="--k-gap:var(--space-5)"><p class="k-lede">First consultations are free and take about an hour, at the studio or on site.</p>${btn({ label: "Start a project", href: ctx.href({ page: "consult" }), size: "lg", iconEnd: "arrow-right" })}</div>
</div></section>`;

/* ------------------------------------------------------------- project page */
function projectPage(p, i, all) {
  const next = all[(i + 1) % all.length];
  return {
    key: `project-${p.id}`, file: `project-${p.id}.html`, title: p.name, short: "Project", kitbar: i === 0,
    description: `${p.name}, ${p.place}: ${p.lede}`,
    bodyClass: "sv-project",
    render(ctx) {
      return html`
<section class="k-section k-section--tight"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Work", href: ctx.href({ page: "home", hash: "work" }) }, { label: p.name }])}
  <div class="sv-proj-head k-enter">
    <h1 class="k-display" style="--i:0">${p.name}</h1>
    <p class="sv-proj-lede" style="--i:1">${p.lede}</p>
  </div>
  <dl class="sv-proj-facts">
    <div><dt>Location</dt><dd>${p.place}</dd></div>
    <div><dt>${p.status === "On site" ? "Status" : "Completed"}</dt><dd>${p.status === "On site" ? "On site, due 2027" : p.year}</dd></div>
    <div><dt>Type</dt><dd>${p.typeLabel}</dd></div>
    <div><dt>Area</dt><dd>${p.area}</dd></div>
    <div><dt>Team</dt><dd>${p.team}</dd></div>
  </dl>
</div></section>
<div class="k-wrap k-wrap--wide">${media(ctx, `${p.id}-hero`, { ratio: "21/9", ratioSm: "4/3", shape: "sm", priority: true })}</div>
<section class="k-section" aria-labelledby="story-title"><div class="k-wrap k-wrap--wide sv-story">
  <aside class="sv-story-side k-sticky-col">
    <h2 class="k-h4" id="story-title">The project</h2>
    <h3 class="sv-mat-title">Materials</h3>
    <ul class="sv-materials" role="list">${p.materials.map((m) => html`<li>${m}</li>`)}</ul>
  </aside>
  <div class="sv-story-body">
    <p class="sv-story-p">${p.story[0]}</p>
    <div class="sv-pair">${media(ctx, `${p.id}-a`, { shape: "sm" })}${media(ctx, `${p.id}-b`, { shape: "sm" })}</div>
    ${p.story.slice(1).map((s) => html`<p class="sv-story-p">${s}</p>`)}
    <figure class="sv-drawing">${media(ctx, `${p.id}-plan`, { shape: "sm" })}<figcaption class="t-caption text-tertiary">Ground floor plan. Drawing by Studio Verran.</figcaption></figure>
  </div>
</div></section>
<nav class="sv-next" aria-label="Next project"><div class="k-wrap k-wrap--wide">
  <a href="${ctx.href({ page: `project-${next.id}` })}"><span class="t-label-sm text-tertiary">Next project</span><span class="sv-next-name">${next.name}</span>${icon("arrow-right", { size: "lg" })}</a>
</div></nav>
${cta(ctx)}`;
    },
  };
}

/* ---------------------------------------------------------------- consult */
const consult = {
  key: "consult", file: "consult.html", title: "Start a project", short: "Consultation",
  description: "Tell Studio Verran about your site or home and book a free first consultation.",
  render(ctx) {
    const body = html`
      ${choices({ name: "type", legend: "What kind of project is it?", required: true, cols: 2, span: "full", error: "Choose the kind of project.", options: [
        { value: "new-home", label: "A new home", desc: "On land you own or are buying", icon: "house" },
        { value: "renovation", label: "Renovation or extension", desc: "Rework or add to an existing house", icon: "hammer" },
        { value: "interior", label: "Interior", desc: "Kitchens, joinery, finishes and furniture", icon: "sofa" },
        { value: "unsure", label: "Not sure yet", desc: "We'll help you work out the right scope", icon: "circle-help" },
      ] })}
      ${field({ id: "location", label: "Where is the site?", required: true, placeholder: "Town or neighborhood", help: "We work on homes within a day's drive of the studio.", error: "Tell us roughly where the site is." })}
      ${field({ id: "budget", label: "Build budget", type: "select", required: true, placeholder: "Choose a range", options: ["Under $500,000", "$500,000 – $1M", "$1M – $2M", "Over $2M", "Not sure yet"], help: "Construction cost only, before fees and taxes.", error: "Choose a budget range, or ‘Not sure yet’." })}
      ${choices({ name: "site", legend: "Where are you with the site?", style: "buttons", required: true, span: "full", error: "Tell us where you are with the site.", options: [{ value: "own", label: "We own it" }, { value: "buying", label: "Buying it" }, { value: "looking", label: "Still looking" }, { value: "home", label: "It's our home" }] })}
      ${field({ id: "start", label: "When would you like to start?", type: "select", placeholder: "Choose a time", options: ["As soon as possible", "In the next 6 months", "6–12 months", "More than a year away"] })}
      ${field({ id: "files", label: "Site photos, surveys or sketches", type: "file", multiple: true, accept: ".pdf,.jpg,.jpeg,.png", placeholder: "PDF, JPG or PNG, up to 20 MB each" })}
      ${field({ id: "about", label: "Tell us about the project", type: "textarea", required: true, rows: 5, maxlength: 1200, help: "Who will live there, what's not working now, anything you love about the site.", error: "Add a few lines about the project." })}
      ${field({ id: "name", label: "Your name", required: true, autocomplete: "name" })}
      ${field({ id: "email", label: "Email", type: "email", required: true, autocomplete: "email" })}
      ${field({ id: "phone", label: "Phone", type: "tel", autocomplete: "tel", help: "If you'd prefer a call." })}
      ${field({ id: "heard", label: "How did you hear about us?", type: "select", placeholder: "Choose one", options: ["A friend or past client", "A builder or engineer", "Search", "A magazine or book", "Instagram", "Other"] })}`;
    return html`
<section class="k-section k-section--tight"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Studio Verran", href: ctx.href({ page: "home" }) }, { label: "Start a project" }])}
  <h1 class="k-display sv-consult-title">Start a project</h1>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:7fr;--k-split-b:4fr">
  ${kitForm({ id: "consult-form", label: "Project inquiry", body, submitLabel: "Send inquiry",
    success: { title: "Inquiry complete", text: "In a live site, a director would reply within three working days to arrange a first meeting at the studio or on site.", next: btn({ label: "Back to selected work", href: ctx.href({ page: "home", hash: "work" }), variant: "secondary" }) } })}
  <aside class="sv-aside k-sticky-col" aria-label="What happens next">
    <h2 class="k-h4">What happens next</h2>
    <ol class="sv-next-steps">
      <li><b>We read every inquiry</b><span>A director replies within three working days.</span></li>
      <li><b>First meeting, free</b><span>About an hour at the studio or on site, to talk through the brief and budget.</span></li>
      <li><b>Fee proposal</b><span>A written proposal for the first two stages, so you can decide without obligation.</span></li>
    </ol>
    <p class="t-body-sm text-secondary">Fees for new homes are usually 10–14% of the construction cost, depending on scope.</p>
    <address class="sv-address">41 Canal Wharf<br>Riverside Works<br><a class="link" href="tel:+15550162290">(555) 016-2290</a></address>
  </aside>
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${indexHero(ctx)}${intro(ctx)}${work(ctx)}${approach(ctx)}${studio(ctx)}${cta(ctx)}`,
};

export default [home, ...content.projects.map(projectPage), consult];
