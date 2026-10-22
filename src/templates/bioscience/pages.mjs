/*! FacetUI Industry Templates · Bioscience & Biotechnology · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, kitForm, field, choices, checkbox, filterable, chip, alertBox } from "../../kit/ui.mjs";
import content from "./content.mjs";

const areaById = (tpl, id) => tpl.areas.find((a) => a.id === id);
const stById = (tpl, id) => tpl.sampleTypes.find((s) => s.id === id);
const tier = (d) => (d <= 5 ? 1 : d <= 10 ? 2 : 3);
const range = (vals) => { const v = vals.filter((x) => x != null); const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? `${lo} days` : `${lo}–${hi} days`; };
const codeTag = (a, cls = "") => html`<span class="cw-code ${cls}" aria-hidden="true">${a.code}</span>`;

/* ------------------------------------------------------------------ matrix */
function matrixTable(ctx, rows, { caption, groups = true }) {
  const { tpl } = ctx;
  const cell = (a, st) => {
    const d = a.std[st.id];
    if (d == null) return html`<td class="cw-none"><span aria-hidden="true">–</span><span class="sr-only">Not offered</span></td>`;
    return html`<td class="cw-cell" data-tier="${tier(d)}"><a href="${ctx.href({ page: "scope", query: { assay: a.id, sample: st.id } })}"><span class="cw-days k-num" data-std="${d}" data-pri="${a.pri[st.id]}">${d}</span><span class="cw-unit" aria-hidden="true">d</span><span class="sr-only"> working days. Scope ${a.name.toLowerCase()} for ${st.label.toLowerCase()}</span></a></td>`;
  };
  const row = (a) => html`<tr><th scope="row"><span class="cw-assay">${a.name}</span><span class="cw-method">${a.method}</span></th>${tpl.sampleTypes.map((st) => cell(a, st))}</tr>`;
  const bodies = groups
    ? tpl.areas.map((ar) => html`<tbody><tr class="cw-group"><th scope="colgroup" colspan="${tpl.sampleTypes.length + 1}"><a href="${ctx.href({ page: `capability-${ar.id}` })}">${codeTag(ar)}<span>${ar.long}</span>${icon("arrow-up-right", { size: "sm" })}</a></th></tr>${rows.filter((a) => a.area === ar.id).map(row)}</tbody>`)
    : html`<tbody>${rows.map(row)}</tbody>`;
  return html`<div class="table-wrap cw-matrix-wrap" data-label="${caption}"><table class="table cw-matrix" data-cw-matrix>
    <caption class="sr-only">${caption}</caption>
    <thead><tr><th scope="col" class="cw-corner">Assay <span class="cw-corner-x">by sample type</span></th>${tpl.sampleTypes.map((st) => html`<th scope="col"><span class="cw-st">${st.short}</span></th>`)}</tr></thead>
    ${bodies}
  </table></div>`;
}

function tatToggle(id) {
  return html`<div class="cw-tat"><span class="label" id="${id}">Turnaround</span>
    <div class="segment sm" role="radiogroup" aria-labelledby="${id}" data-cw-tat>
      <button type="button" role="radio" aria-checked="true" data-value="std">Standard</button><button type="button" role="radio" aria-checked="false" tabindex="-1" data-value="pri">Priority</button>
    </div></div>`;
}

const legend = html`<ul class="cw-legend" role="list" aria-label="Turnaround key">
  <li><span class="cw-swatch" data-tier="1"></span>5 days or less</li>
  <li><span class="cw-swatch" data-tier="2"></span>6–10 days</li>
  <li><span class="cw-swatch" data-tier="3"></span>11 days or more</li>
  <li><span class="cw-swatch cw-swatch--none">–</span>Not offered</li>
</ul>`;

function hero(ctx) {
  const { tpl } = ctx;
  return html`<section class="cw-hero" id="matrix" aria-labelledby="hero-title"><div class="k-wrap k-wrap--wide">
    <div class="cw-hero-head k-enter">
      <h1 class="k-display" id="hero-title" style="--i:0">${tpl.hero.title}</h1>
      <div class="cw-hero-side" style="--i:1">
        <p class="k-lede">${tpl.hero.lede}</p>
        <dl class="cw-facts">${tpl.hero.facts.map(([k, v]) => html`<div><dt>${k}</dt><dd class="k-num">${v}</dd></div>`)}</dl>
      </div>
    </div>
    <div class="cw-matrix-bar">
      ${tatToggle("tat-label")}
      ${legend}
      ${btn({ label: "Scope a project", href: ctx.href({ page: "scope" }), size: "sm", iconEnd: "arrow-right", className: "cw-bar-cta" })}
    </div>
    ${matrixTable(ctx, tpl.assays, { caption: "Assays by sample type, turnaround in working days from sample receipt" })}
    <p class="cw-matrix-note">${icon("info", { size: "sm" })}<span>Select a number to start a scoping request with that assay and sample type filled in. Priority slots carry a surcharge and depend on queue capacity; we confirm them in your study plan.</span></p>
  </div></section>`;
}

/* ------------------------------------------------------------------ research areas index */
function areasIndex(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section cw-areas" id="areas" aria-labelledby="areas-title"><div class="k-wrap k-wrap--wide">
    <div class="cw-head-split">
      <h2 class="k-h2" id="areas-title">Research areas</h2>
      <p class="k-lede">Four groups, each led by a staff scientist who scopes, runs and signs off your study. You talk to the person reading the data, not an account manager.</p>
    </div>
    <ol class="cw-index" role="list">${tpl.areas.map((a) => {
      const list = tpl.assays.filter((x) => x.area === a.id);
      const pubs = tpl.publications.filter((p) => p.area === a.id).length;
      return html`<li><a class="cw-index-row" href="${ctx.href({ page: `capability-${a.id}` })}">
        ${codeTag(a, "cw-code--lg")}
        <span class="cw-index-main"><span class="cw-index-name">${a.long}</span><span class="cw-index-sum">${a.summary}</span></span>
        <span class="cw-index-assays">${list.map((x) => html`<span>${x.name}</span>`)}</span>
        <span class="cw-index-meta"><span><b class="k-num">${list.length}</b> assays</span><span><b class="k-num">${pubs}</b> papers and notes</span><span><b class="k-num">${range(list.flatMap((x) => Object.values(x.std)))}</b> standard</span></span>
        ${icon("arrow-right", { className: "cw-index-go" })}
      </a></li>`;
    })}</ol>
  </div></section>`;
}

/* ------------------------------------------------------------------ bench */
function bench(ctx) {
  return html`<section class="k-section k-surface cw-bench" aria-labelledby="bench-title"><div class="k-wrap k-wrap--wide">
    <div class="cw-head-split">
      <h2 class="k-h2" id="bench-title">On the bench</h2>
      <p class="k-lede">Instruments are owned, calibrated and maintained in house, so a study never waits on a shared core facility.</p>
    </div>
    <div class="cw-bench-grid">
      <figure class="cw-tile cw-tile--a">${media(ctx, "bench-ms", { shape: "sm" })}<figcaption><b>LC-MS suite</b><span>Four high-resolution mass spectrometers, each paired with its own UHPLC.</span></figcaption></figure>
      <figure class="cw-tile cw-tile--b">${media(ctx, "bench-columns", { shape: "sm" })}<figcaption><b>Column library</b><span>Dedicated columns per client molecule, logged by injection count.</span></figcaption></figure>
      <figure class="cw-tile cw-tile--c">${media(ctx, "bench-plates", { shape: "sm" })}<figcaption><b>Crystallization</b><span>Nanoliter drops in 96-well sitting-drop plates, imaged on a schedule.</span></figcaption></figure>
      <figure class="cw-tile cw-tile--d">${media(ctx, "bench-robot", { shape: "sm" })}<figcaption><b>Automated liquid handling</b><span>Digests, dilution series and plate layouts prepared the same way every run.</span></figcaption></figure>
    </div>
  </div></section>`;
}

/* ------------------------------------------------------------------ publications */
function pubItem(ctx, p, { filterable: f = true } = {}) {
  const { tpl } = ctx;
  const a = areaById(tpl, p.area);
  const toast = JSON.stringify({ title: "PDF request noted", description: `Demo only: on a live site the PDF of "${p.title}" would be emailed to you.`, type: "info" });
  return html`<article class="cw-pub"${f ? html` data-area="${p.area}" data-year="${p.year}" data-type="${p.type}" data-search="${`${p.title} ${p.authors} ${p.venue}`.toLowerCase()}"` : ""}>
    <span class="cw-pub-year k-num">${p.year}</span>
    <div class="cw-pub-body">
      <h3 class="cw-pub-title">${p.title}</h3>
      <p class="cw-pub-authors">${p.authors}</p>
      <p class="cw-pub-venue">${p.venue}</p>
    </div>
    <div class="cw-pub-side">
      <span class="k-cluster" style="--k-gap:var(--space-1-5)">${badge(tpl.pubTypes[p.type], p.type === "article" ? "brand" : p.type === "poster" ? "outline" : "info")}<span class="cw-pub-area">${codeTag(a)}${a.name}</span></span>
      <button type="button" class="btn btn-ghost btn-sm" data-sonner='${raw(toast.replace(/'/g, "&#39;"))}'>${icon("download")}Request PDF<span class="sr-only">: ${p.title}</span></button>
    </div>
  </article>`;
}

function publications(ctx) {
  const { tpl } = ctx;
  const years = [...new Set(tpl.publications.map((p) => p.year))].sort((a, b) => b - a);
  const controls = html`<div class="k-cluster cw-chips" role="group" aria-label="Filter by research area" style="--k-gap:var(--space-1-5)">${chip("All areas", { filter: "area", value: "", pressed: true })}${tpl.areas.map((a) => chip(a.name, { filter: "area", value: a.id }))}</div>
    <div class="cw-pub-selects">
      <label class="sr-only" for="pub-year">Year</label><select class="select select-sm" id="pub-year" data-filter="year"><option value="">All years</option>${years.map((y) => html`<option value="${y}">${y}</option>`)}</select>
      <label class="sr-only" for="pub-type">Type</label><select class="select select-sm" id="pub-type" data-filter="type"><option value="">All types</option>${Object.entries(tpl.pubTypes).map(([k, v]) => html`<option value="${k}">${v}</option>`)}</select>
      <label class="sr-only" for="pub-q">Search titles and authors</label><input class="input input-sm cw-pub-q" id="pub-q" type="search" data-filter="q" placeholder="Search titles and authors">
    </div>`;
  return html`<section class="k-section" id="publications" aria-labelledby="pub-title"><div class="k-wrap k-wrap--wide cw-pubs">
    <div class="cw-pubs-side k-sticky-col">
      <h2 class="k-h2" id="pub-title">Publications and application notes</h2>
      <p class="k-lede">Methods our scientists have written up, from peer-reviewed articles to short application notes you can hand to a reviewer.</p>
      ${alertBox({ tone: "info", icon: "flask-conical", title: "Sample data", text: "Every title, author and journal in this list is fictional, written to demonstrate the template.", role: "note" })}
    </div>
    ${filterable({ id: "pub-filter", label: "Filter publications", controls, items: tpl.publications.map((p) => pubItem(ctx, p)), itemsClass: "cw-pub-list", countLabel: "publications",
      empty: { icon: "file-search", title: "No publications match", text: "Try another year or research area, or clear the search to see all fourteen.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Clear filters</button>` } })}
  </div></section>`;
}

/* ------------------------------------------------------------------ process */
function process(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-surface" id="process" aria-labelledby="proc-title"><div class="k-wrap k-wrap--wide">
    <div class="cw-head-split">
      <h2 class="k-h2" id="proc-title">How a project runs</h2>
      <p class="k-lede">The turnaround clock starts when samples clear receiving, not when the quote is signed. Here's what happens either side of it.</p>
    </div>
    <ol class="cw-process">${tpl.process.map((s) => html`<li><span class="cw-process-time">${s.time}</span><h3 class="cw-process-title">${s.title}</h3><p>${s.text}</p></li>`)}</ol>
  </div></section>`;
}

/* ------------------------------------------------------------------ shipping */
function shipping(ctx) {
  const { tpl } = ctx;
  const s = tpl.shipping;
  return html`<section class="k-section" id="shipping" aria-labelledby="ship-title"><div class="k-wrap k-wrap--wide cw-ship">
    <div class="cw-ship-media">${media(ctx, "receiving", { shape: "facet" })}</div>
    <div class="k-stack" style="--k-gap:var(--space-6)">
      <h2 class="k-h2" id="ship-title">Sending samples</h2>
      <dl class="cw-rules">${s.rules.map(([t, d]) => html`<div><dt>${t}</dt><dd>${d}</dd></div>`)}</dl>
      <div class="cw-address card facet"><div class="card-body">
        <span class="cw-address-label">Ship to</span>
        <address>${s.address.map((l) => html`${l}<br>`)}</address>
        <div class="k-cluster" style="--k-gap:var(--space-2)">
          <button type="button" class="btn btn-outline btn-sm" data-sonner='{"title":"Sample manifest template","description":"Demo only: on a live site this downloads the spreadsheet manifest.","type":"info"}'>${icon("file-spreadsheet")}Download manifest template</button>
          ${btn({ label: "Scope a project first", href: ctx.href({ page: "scope" }), variant: "ghost", size: "sm" })}
        </div>
      </div></div>
    </div>
  </div></section>`;
}

/* ------------------------------------------------------------------ capability page */
function capabilityPage(area, i, all) {
  const next = all[(i + 1) % all.length];
  return {
    key: `capability-${area.id}`, file: `capability-${area.id}.html`, title: area.long, short: "Capability", kitbar: i === 0,
    description: `${area.long} at Cellwright Labs: ${area.summary}`,
    render(ctx) {
      const { tpl } = ctx;
      const list = tpl.assays.filter((a) => a.area === area.id);
      const pubs = tpl.publications.filter((p) => p.area === area.id);
      const scopeAll = ctx.href({ page: "scope", query: list.map((a) => ["assay", a.id]) });
      const fastest = Math.min(...list.flatMap((a) => Object.values(a.pri).filter((v) => v != null)));
      return html`
<section class="k-section k-section--tight cw-cap-head"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Cellwright Labs", href: ctx.href({ page: "home" }) }, { label: "Research areas", href: ctx.href({ page: "home", hash: "areas" }) }, { label: area.long }])}
  <div class="cw-cap-grid">
    <div class="k-stack k-enter" style="--k-gap:var(--space-5)">
      <span style="--i:0">${codeTag(area, "cw-code--xl")}</span>
      <h1 class="k-h1" style="--i:1">${area.long}</h1>
      <p class="k-lede" style="--i:2">${area.summary}</p>
      <dl class="cw-facts" style="--i:3"><div><dt>Assays</dt><dd class="k-num">${list.length}</dd></div><div><dt>Standard turnaround</dt><dd class="k-num">${range(list.flatMap((a) => Object.values(a.std)))}</dd></div><div><dt>Fastest priority slot</dt><dd class="k-num">${fastest} days</dd></div></dl>
    </div>
    ${media(ctx, `cap-${area.id}`, { priority: true, shape: "facet" })}
  </div>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:8fr;--k-split-b:3fr">
  <div class="k-stack" style="--k-gap:var(--space-12)">
    <div class="cw-cap-intro">
      <div class="k-prose">${area.intro.map((p) => html`<p>${p}</p>`)}</div>
      <section aria-labelledby="q-title" class="cw-questions">
        <h2 class="k-h5" id="q-title">Questions this answers</h2>
        <ul role="list">${area.questions.map((q) => html`<li>${icon("circle-help", { size: "sm" })}<span>${q}</span></li>`)}</ul>
      </section>
    </div>
    <section aria-labelledby="assay-title" class="k-stack" style="--k-gap:var(--space-4)">
      <div class="cw-subhead"><h2 class="k-h3" id="assay-title">Assays and turnaround</h2>${tatToggle("tat-cap")}</div>
      ${matrixTable(ctx, list, { caption: `${area.long} assays by sample type, turnaround in working days`, groups: false })}
      ${legend}
    </section>
    <div class="cw-cap-two">
      <section aria-labelledby="inst-title" class="k-stack" style="--k-gap:var(--space-4)">
        <h2 class="k-h4" id="inst-title">Instruments</h2>
        <ul class="cw-inst" role="list">${area.instruments.map(([n, d]) => html`<li class="rail"><b>${n}</b><span>${d}</span></li>`)}</ul>
      </section>
      <section aria-labelledby="req-title" class="k-stack" style="--k-gap:var(--space-4)">
        <h2 class="k-h4" id="req-title">Sample requirements</h2>
        <table class="cw-kv"><caption class="sr-only">Sample requirements for ${area.long.toLowerCase()}</caption><tbody>${area.requirements.map(([k, v]) => html`<tr><th scope="row">${k}</th><td>${v}</td></tr>`)}</tbody></table>
      </section>
    </div>
    <section aria-labelledby="del-title" class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h4" id="del-title">What you receive</h2>
      <ul class="cw-checklist" role="list">${area.deliverables.map((d) => html`<li>${icon("file-check")}<span>${d}</span></li>`)}</ul>
    </section>
    <section aria-labelledby="rel-title" class="k-stack" style="--k-gap:var(--space-2)">
      <div class="cw-subhead"><h2 class="k-h4" id="rel-title">Related publications</h2><a class="link t-label-md" href="${ctx.href({ page: "home", query: { area: area.id }, hash: "publications" })}">All ${area.name.toLowerCase()} papers and notes</a></div>
      <p class="t-body-xs text-tertiary">Sample data: titles, authors and journals are fictional.</p>
      <div class="cw-pub-list">${pubs.map((p) => pubItem(ctx, p, { filterable: false }))}</div>
    </section>
  </div>
  <aside class="k-sticky-col" aria-label="Scope a ${area.name.toLowerCase()} study">
    <div class="card facet cw-scope-card"><div class="card-body k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h5">Scope a ${area.name.toLowerCase()} study</h2>
      <p class="t-body-sm text-secondary">Tell us the molecule and the question. A ${area.name.toLowerCase()} scientist replies with a study plan and fixed quote within two working days.</p>
      ${btn({ label: "Start scoping request", href: scopeAll, block: true })}
      <p class="t-body-xs text-tertiary">All ${list.length} assays in this area are preselected; untick what you don't need.</p>
    </div></div>
  </aside>
</div></section>
<nav class="cw-next" aria-label="Next research area"><div class="k-wrap k-wrap--wide">
  <a href="${ctx.href({ page: `capability-${next.id}` })}">${codeTag(next, "cw-code--lg")}<span class="cw-next-text"><span class="t-label-sm text-tertiary">Next research area</span><span class="cw-next-name">${next.long}</span></span>${icon("arrow-right", { size: "lg" })}</a>
</div></nav>`;
    },
  };
}

/* ------------------------------------------------------------------ scoping request */
const scope = {
  key: "scope", file: "scope.html", title: "Scope a project", short: "Scope a project",
  description: "Send Cellwright Labs your sample details, assays, timeline and protocols for a study plan and fixed quote.",
  render(ctx) {
    const { tpl } = ctx;
    const step1 = html`
      ${choices({ name: "sample", legend: "Sample type", required: true, cols: 2, span: "full", error: "Choose the type of sample you'll send.", options: tpl.sampleTypes.map((s) => ({ value: s.id, label: s.label, desc: s.desc })) })}
      ${field({ id: "count", label: "Number of samples", type: "number", required: true, min: 1, max: 500, inputmode: "numeric", help: "Count each lot, time point or stress condition separately.", error: "Enter how many samples you'll send, from 1 to 500." })}
      ${field({ id: "amount", label: "Amount available per sample", type: "select", required: true, placeholder: "Choose a range", options: ["Under 50 µg", "50–300 µg", "300 µg – 2 mg", "More than 2 mg", "Not sure yet"], help: "We'll tell you if an assay needs more.", error: "Choose roughly how much material you have, or ‘Not sure yet’." })}
      ${choices({ name: "storage", legend: "How will samples ship?", style: "buttons", required: true, span: "full", error: "Tell us how the samples will be shipped.", options: [{ value: "frozen", label: "Frozen, dry ice" }, { value: "chilled", label: "2–8 °C" }, { value: "ambient", label: "Ambient" }, { value: "lyophilized", label: "Lyophilized" }] })}
      ${field({ id: "molecule", label: "Molecule or sample description", type: "textarea", rows: 3, maxlength: 600, help: "Format, expression host, buffer, anything we should know. Don't include sequences here; attach them in the last step." })}`;
    const step2 = html`
      ${choices({ name: "assay", legend: "Assays", type: "checkbox", required: true, cols: 2, span: "full", error: "Choose at least one assay, or ‘Not sure’ and we'll recommend some.", help: "Choose all that apply. The estimate beside the form updates as you go.",
        options: [...tpl.assays.map((a) => ({ value: a.id, label: a.name, desc: `${areaById(tpl, a.area).name}: ${a.method}` })), { value: "unsure", label: "Not sure", desc: "Describe the question and we'll recommend assays" }] })}
      ${field({ id: "question", label: "What do you need to find out?", type: "textarea", rows: 3, maxlength: 800, span: "full", help: "For example: compare aggregation in three formulation buffers after two weeks at 40 °C." })}`;
    const step3 = html`
      ${field({ id: "needby", label: "When do you need results?", type: "select", required: true, placeholder: "Choose a timeframe", options: ["Within 2 weeks", "Within 4 weeks", "Within 8 weeks", "Flexible", "Tied to a specific date"], error: "Choose when you need results." })}
      ${field({ id: "ship", label: "Samples ready to ship", type: "date", help: "Optional. Helps us reserve instrument time." })}
      ${choices({ name: "tier", legend: "Turnaround", required: true, cols: 2, span: "full", error: "Choose standard or priority turnaround.", options: [{ value: "standard", label: "Standard", desc: "Times shown in the matrix", checked: true }, { value: "priority", label: "Priority", desc: "About 40% faster, surcharge applies, subject to capacity" }] })}
      ${field({ id: "stage", label: "Program stage", type: "select", placeholder: "Choose a stage", options: ["Discovery", "Lead selection", "Developability", "Process development", "Preclinical", "Other"] })}`;
    const step4 = html`
      ${choices({ name: "confidentiality", legend: "Confidentiality", required: true, cols: 3, span: "full", error: "Choose how you'd like to handle confidentiality.", options: [
        { value: "our-nda", label: "Use your mutual NDA", desc: "Two pages, signed electronically before the scoping call", icon: "file-lock" },
        { value: "client-nda", label: "We'll send our NDA", desc: "Attach it below; we reply within three working days", icon: "file-pen" },
        { value: "none", label: "No NDA needed", desc: "Reference materials or method development only", icon: "file-text" },
      ] })}
      ${checkbox({ name: "blinded", label: "Code my samples blind. We'll label tubes with your codes and never ask for the key." })}
      ${field({ id: "files", label: "Protocols, sequences and prior data", type: "file", multiple: true, accept: ".pdf,.docx,.xlsx,.csv,.fasta,.fa,.txt", placeholder: "PDF, Word, Excel, CSV or FASTA, up to 25 MB each", span: "full" })}
      ${field({ id: "name", label: "Your name", required: true, autocomplete: "name" })}
      ${field({ id: "email", label: "Work email", type: "email", required: true, autocomplete: "email", error: "Enter a work email so the study lead can reply." })}
      ${field({ id: "org", label: "Organization", required: true, autocomplete: "organization", error: "Enter your company or institution." })}
      ${field({ id: "phone", label: "Phone", type: "tel", autocomplete: "tel", inputmode: "tel" })}
      ${checkbox({ name: "nophi", label: "I confirm the files and descriptions contain no patient-identifiable information.", required: true, error: "Confirm there is no patient-identifiable information so we can accept the files." })}`;
    const data = { assays: tpl.assays.map(({ id, name, std, pri }) => ({ id, name, std, pri })), samples: tpl.sampleTypes.map(({ id, label }) => ({ id, label })) };
    return html`
<section class="k-section k-section--tight"><div class="k-wrap k-wrap--wide cw-scope-head">
  ${breadcrumb([{ label: "Cellwright Labs", href: ctx.href({ page: "home" }) }, { label: "Scope a project" }])}
  <h1 class="k-h1">Scope a project</h1>
  <p class="k-lede">Four short steps. A staff scientist reads every request and replies with a study plan and fixed quote, usually within two working days.</p>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:8fr;--k-split-b:4fr">
  ${kitForm({
    id: "scope-form", label: "Project scoping request", submitLabel: "Send scoping request",
    steps: [{ title: "Samples", body: step1 }, { title: "Assays", body: step2 }, { title: "Timeline", body: step3 }, { title: "Confidentiality and files", body: step4 }],
    success: { title: "Scoping request complete", text: "On a live site, the study lead for your first assay would email within two working days to book a scoping call and send the NDA you chose.", next: btn({ label: "Back to the assay matrix", href: ctx.href({ page: "home", hash: "matrix" }), variant: "secondary" }) },
  })}
  <aside class="k-stack k-sticky-col" style="--k-gap:var(--space-4)" aria-label="Turnaround estimate and next steps">
    <div class="card facet cw-estimate" data-cw-estimate><div class="card-body k-stack" style="--k-gap:var(--space-3)">
      <h2 class="k-h5">Turnaround estimate</h2>
      <div aria-live="polite" data-cw-estimate-out><p class="t-body-sm text-secondary">Choose a sample type and assays to see the longest turnaround in your study.</p></div>
      <p class="t-body-xs text-tertiary">Working days from sample receipt, from the published matrix. Your study plan confirms the final dates.</p>
    </div></div>
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)">
      <h2 class="t-label-lg">What happens next</h2>
      <ol class="cw-next-steps"><li>A scientist reviews your request</li><li>Scoping call and NDA, if you chose one</li><li>Written study plan with a fixed price</li><li>You ship samples with our manifest</li></ol>
    </div></div>
    <p class="t-body-sm text-secondary">Rather talk first? Call the project team on <a class="link" href="tel:+15550137740">(555) 013-7740</a>.</p>
  </aside>
</div></section>
<script type="application/json" id="cw-data">${raw(JSON.stringify(data).replace(/</g, "\\u003c"))}</script>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${hero(ctx)}${areasIndex(ctx)}${bench(ctx)}${publications(ctx)}${process(ctx)}${shipping(ctx)}`,
};

export default [home, ...content.areas.map(capabilityPage), scope];
