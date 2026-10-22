/*! FacetUI Industry Templates · Automotive & Mobility · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, tabs, accordion, kitForm, field, choices, checkbox, datePicker, mapFrame } from "../../kit/ui.mjs";
import content from "./content.mjs";

const modelById = (tpl, id) => tpl.models.find((m) => m.id === id);
const modelPage = (m) => ({ page: `model-${m.id}` });
const bookLink = (m, trim) => ({ page: "test-drive", query: trim ? { model: m.id, trim: `${m.id}-${trim.id}` } : { model: m.id } });

/* Oversized model name drawn as SVG so it scales with the stage width (decorative). */
const word = (m) => html`<svg class="vm-word" viewBox="0 0 1000 190" preserveAspectRatio="xMidYMin meet" aria-hidden="true" focusable="false"><text x="500" y="168" text-anchor="middle">${m.name.toUpperCase()}</text></svg>`;

/* Four headline specs: range, 0–60, fast charge, starting price. */
function specStrip(m, { size } = {}) {
  const cells = [["range", "route"], ["zero", "gauge"], ["charge", "zap"], ["price", "tag"]];
  return html`<dl class="${size === "sm" ? "vm-specs vm-specs--sm" : "vm-specs"}">${cells.map(([k, ic]) => {
    const [v, unit, label] = m.key[k];
    return html`<div class="vm-spec"><dt>${icon(ic, { size: "sm" })}${label}</dt><dd><span class="vm-spec-v k-num">${v}</span>${unit ? html`<span class="vm-spec-u">${unit}</span>` : ""}</dd></div>`;
  })}</dl>`;
}

/* ------------------------------------------------- signature: trim comparison */
function compareTable(ctx, m, { id }) {
  const groups = [];
  for (const [g, label, vals] of m.rows) {
    let grp = groups.find((x) => x.name === g);
    if (!grp) groups.push((grp = { name: g, rows: [] }));
    grp.rows.push({ label, vals, same: vals.every((v) => v === vals[0]) });
  }
  const diffCount = m.rows.filter(([, , v]) => !v.every((x) => x === v[0])).length;
  return html`<div class="vm-cmp" data-vm-cmp>
    <div class="vm-cmp-bar">
      <p class="vm-cmp-count t-body-sm text-secondary"><b class="k-num">${diffCount}</b> of <span class="k-num">${m.rows.length}</span> features differ between ${m.name} trims.</p>
      <div class="vm-cmp-toggles" role="group" aria-label="Comparison view options for ${m.name}">
        <label class="switch"><input type="checkbox" role="switch" data-vm-hl checked>Highlight differences</label>
        <label class="switch"><input type="checkbox" role="switch" data-vm-hide>Hide identical rows</label>
      </div>
    </div>
    <div class="table-wrap vm-cmp-wrap"><table class="table vm-cmp-table vm-cmp--hl" id="${id}">
      <caption class="sr-only">${m.name} trims compared, ${m.trims.length} columns</caption>
      <thead><tr><th scope="col" class="vm-cmp-corner"><span class="sr-only">Feature</span></th>${m.trims.map((t) => html`<th scope="col"><span class="vm-trim-name">${t.name}</span><span class="vm-trim-drive">${t.drive}</span><span class="vm-trim-price k-num">${t.price}</span></th>`)}</tr></thead>
      ${groups.map((g) => html`<tbody${g.rows.every((r) => r.same) ? raw(' data-same="true"') : ""}>
        <tr class="vm-cmp-group"><th scope="colgroup" colspan="${m.trims.length + 1}">${g.name}</th></tr>
        ${g.rows.map((r) => html`<tr${r.same ? raw(' data-same="true"') : raw(' data-diff="true"')}><th scope="row">${r.label}${r.same ? "" : html`<span class="vm-diff-tag">Differs</span>`}</th>${r.vals.map((v, i) => html`<td${!r.same && i > 0 && v !== r.vals[i - 1] ? raw(' class="vm-step"') : ""}>${v === "Not available" ? html`<span class="vm-na">${icon("minus", { size: "sm" })}Not available</span>` : v === "Standard" ? html`<span class="vm-std">${icon("check", { size: "sm" })}Standard</span>` : v}</td>`)}</tr>`)}
      </tbody>`)}
      <tfoot><tr><th scope="row"><span class="sr-only">Book</span></th>${m.trims.map((t) => html`<td><a class="btn btn-outline btn-sm" href="${ctx.href(bookLink(m, t))}">Test-drive<span class="sr-only"> ${m.name} ${t.name}</span></a></td>`)}</tr></tfoot>
    </table></div>
    <p class="t-caption text-tertiary vm-cmp-note">Marked cells change from the trim to their left. Figures are sample data for this template.</p>
  </div>`;
}

/* ------------------------------------------------------------------ home */
function hero(ctx) {
  const { tpl } = ctx; const H = tpl.hero;
  return html`<section class="vm-hero" aria-labelledby="vm-title" data-vm-hero><div class="k-wrap k-wrap--wide">
    <div class="vm-hero-head k-enter">
      <h1 class="k-h1 vm-hero-title" id="vm-title" style="--i:0">${H.title}</h1>
      <div class="vm-pick" style="--i:1">
        <span class="label" id="vm-pick-label">Show model</span>
        <div class="segment lg vm-seg" role="radiogroup" aria-labelledby="vm-pick-label" data-vm-seg>${tpl.models.map((m, i) =>
          html`<button type="button" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-value="${m.id}">${icon(m.icon, { size: "sm" })}${m.name}<span class="vm-seg-body">${m.body}</span></button>`)}</div>
      </div>
    </div>
    <div class="vm-stage">${tpl.models.map((m, i) => html`<div class="vm-stage-item" data-model="${m.id}"${i === 0 ? raw(' data-active="true"') : raw(' aria-hidden="true"')}>${word(m)}${media(ctx, `${m.id}-hero`, { ratio: "21/9", ratioSm: "4/3", priority: i === 0, hideBrief: i !== 0 })}</div>`)}</div>
    <p class="sr-only" aria-live="polite" data-vm-status></p>
    <div class="vm-panels">${tpl.models.map((m, i) => html`<div class="vm-panel" data-model="${m.id}"${i ? raw(" hidden") : ""}>
      <div class="vm-panel-id">
        <h2 class="vm-panel-name">${m.name} <span>${m.body.toLowerCase()}</span></h2>
        <p class="vm-panel-pitch">${m.pitch}</p>
        <div class="k-cluster">${btn({ label: `Book a ${m.name} test drive`, href: ctx.href(bookLink(m)) })}${btn({ label: `Explore ${m.name}`, href: ctx.href(modelPage(m)), variant: "outline", iconEnd: "arrow-right" })}</div>
      </div>
      ${specStrip(m)}
    </div>`)}</div>
    <p class="t-caption text-tertiary vm-foot">${H.footnote}</p>
  </div></section>`;
}

function lineup(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section vm-lineup-sec" id="models" aria-labelledby="ln-title"><div class="k-wrap k-wrap--wide">
    ${sectionHead({ title: "The lineup", lede: tpl.hero.lede, id: "ln-title" })}
    <ul class="vm-lineup" role="list">${tpl.models.map((m) => html`<li><a class="vm-line" href="${ctx.href(modelPage(m))}">
      <span class="vm-line-icon">${icon(m.icon)}</span>
      <span class="vm-line-id"><span class="vm-line-name">${m.name}</span><span class="vm-line-body">${m.body}, ${m.seats}</span></span>
      <span class="vm-line-pitch">${m.pitch}</span>
      <span class="vm-line-facts"><span><b class="k-num">${m.key.range[0]} mi</b> range</span><span><b class="k-num">${m.trims.length}</b> trims</span><span>from <b class="k-num">${m.key.price[0]}</b></span></span>
      ${icon("arrow-up-right", { className: "vm-line-go" })}
    </a></li>`)}</ul>
  </div></section>`;
}

function compare(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section vm-compare" id="compare" aria-labelledby="cmp-title"><div class="k-wrap k-wrap--wide">
    <div class="vm-compare-head">
      <h2 class="k-h2" id="cmp-title">Compare trims side by side</h2>
      <p class="k-lede">Every trim of a model shares the same body and cabin. What changes is battery, motors and a short list of comfort features. Turn on highlighting to see exactly where.</p>
    </div>
    ${tabs({ id: "cmp", label: "Choose a model to compare", style: "pill", tabs: tpl.models.map((m) => ({ id: m.id, label: m.name, icon: m.icon, panel: compareTable(ctx, m, { id: `cmp-${m.id}-table` }) })) })}
  </div></section>`;
}

function charging(ctx) {
  const { tpl } = ctx; const C = tpl.charging;
  const maxHome = Math.max(...tpl.models.map((m) => m.charging.home));
  const maxFast = Math.max(...tpl.models.map((m) => m.charging.fast));
  const bar = (v, max) => html`<span class="vm-bar" aria-hidden="true"><span style="--w:${Math.round((v / max) * 100)}%"></span></span>`;
  return html`<section class="k-section k-surface" id="charging" aria-labelledby="ch-title"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:5fr;--k-split-b:7fr">
    ${media(ctx, "charging", { ratio: "4/5", ratioSm: "4/3" })}
    <div class="k-stack" style="--k-gap:var(--space-8)">
      <div class="k-stack" style="--k-gap:var(--space-4)"><h2 class="k-h2" id="ch-title">Charging, in miles not kilowatts</h2><p class="k-lede">${C.lede}</p></div>
      <div class="table-wrap"><table class="table vm-charge"><caption class="sr-only">Estimated miles of range added while charging, by model</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Home wall charger, 1 hour</th><th scope="col">Fast charger, 15 minutes</th></tr></thead>
        <tbody>${tpl.models.map((m) => html`<tr><th scope="row">${m.name}</th><td><span class="vm-charge-cell"><span class="k-num">+${m.charging.home} mi</span>${bar(m.charging.home, maxHome)}</span></td><td><span class="vm-charge-cell"><span class="k-num">+${m.charging.fast} mi</span>${bar(m.charging.fast, maxFast)}</span></td></tr>`)}</tbody>
      </table></div>
      <dl class="vm-notes">${C.notes.map(([t, d]) => html`<div><dt>${t}</dt><dd>${d}</dd></div>`)}</dl>
      <p class="t-caption text-tertiary">Estimates for the longest-range trim at 70°F. Fast-charge figures start at 10% battery.</p>
    </div>
  </div></section>`;
}

function ownership(ctx) {
  return html`<section class="k-section" id="ownership" aria-labelledby="own-title"><div class="k-wrap k-wrap--wide">
    ${sectionHead({ title: "After you drive it home", id: "own-title" })}
    <ul class="vm-own" role="list">${ctx.tpl.ownership.map((o) => html`<li>${icon(o.icon)}<h3>${o.title}</h3><p>${o.text}</p></li>`)}</ul>
  </div></section>`;
}

function showrooms(ctx) {
  const { tpl } = ctx;
  const pins = tpl.showrooms.map((s, i) => ({ x: s.pin.x, y: s.pin.y, label: `${s.name} showroom`, icon: "map-pin", alt: i > 0, popup: html`${s.address}` }));
  return html`<section class="k-section k-surface" id="showrooms" aria-labelledby="sr-title"><div class="k-wrap k-wrap--wide">
    ${sectionHead({ title: "Three showrooms, cars charged and ready", lede: "Every showroom keeps each model on hand to drive. Book ahead and the car you picked is waiting at the door.", id: "sr-title", action: btn({ label: "Book a test drive", href: ctx.href({ page: "test-drive" }), variant: "secondary" }) })}
    <div class="vm-sr-grid">
      <div class="k-stack" style="--k-gap:var(--space-4)">
        ${mapFrame({ pins, label: "Map of Voltaro showroom locations", height: 380, id: "vmmap", className: "vm-map" })}
        ${media(ctx, "showroom", { ratio: "3/2", ratioSm: "4/3", shape: "sm" })}
      </div>
      <ul class="vm-sr-list" role="list">${tpl.showrooms.map((s) => html`<li class="vm-sr">
        <h3 class="vm-sr-name">${s.name}</h3>
        <p class="t-body-sm">${s.address}<br><a class="link" href="tel:+1${s.phone.replace(/\D/g, "")}">${s.phone}</a></p>
        <table class="vm-hours"><caption class="sr-only">${s.name} opening hours</caption><tbody>${s.hours.map(([d, h]) => html`<tr><th scope="row">${d}</th><td>${h}</td></tr>`)}</tbody></table>
        <p class="t-body-sm text-secondary">${s.note}</p>
        <div class="vm-sr-foot"><span class="k-cluster" style="--k-gap:var(--space-1-5)" aria-label="Models to drive at ${s.name}">${s.models.map((id) => badge(modelById(tpl, id).name, "outline"))}</span>
        <a class="link t-label-md" href="${ctx.href({ page: "test-drive", query: { showroom: s.id } })}">Book at ${s.name}</a></div>
      </li>`)}</ul>
    </div>
  </div></section>`;
}

const ctaBand = (ctx, m) => html`<section class="vm-cta" aria-labelledby="cta-title"><div class="k-wrap k-wrap--wide vm-cta-inner">
  <h2 class="k-h2" id="cta-title">${m ? `Drive a ${m.name} this week` : "Drive one this week"}</h2>
  <p class="k-lede">Thirty minutes in town or an hour with highway miles. No deposit, and nobody follows up unless you ask.</p>
  ${btn({ label: "Book a test drive", href: ctx.href(m ? bookLink(m) : { page: "test-drive" }), size: "lg", iconEnd: "arrow-right" })}
</div></section>`;

/* ---------------------------------------------------------------- model page */
function modelDetail(m, i) {
  return {
    key: `model-${m.id}`, file: `model-${m.id}.html`, title: `${m.name} ${m.body.toLowerCase()}`, short: "Model", kitbar: i === 0,
    description: `Voltaro ${m.name} ${m.body.toLowerCase()}: ${m.pitch} Trims, specs and test drives.`,
    render(ctx) {
      const { tpl } = ctx;
      const others = tpl.models.filter((x) => x.id !== m.id);
      const specTabs = m.specs.map(([g, rows]) => html`<div class="vm-sheet"><h3 class="vm-sheet-title">${g}</h3><table class="vm-kv"><caption class="sr-only">${m.name} ${g.toLowerCase()}</caption><tbody>${rows.map(([k, v]) => html`<tr><th scope="row">${k}</th><td>${v}</td></tr>`)}</tbody></table></div>`);
      return html`
<section class="vm-mhead"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Models", href: ctx.href({ page: "home", hash: "models" }) }, { label: m.name }])}
  <div class="vm-mhead-grid k-enter">
    <div class="k-stack" style="--k-gap:var(--space-4);--i:0">
      <span class="vm-kicker">${icon(m.icon, { size: "sm" })}${m.body}, ${m.seats}</span>
      <h1 class="k-display">Voltaro ${m.name}</h1>
    </div>
    <p class="k-lede" style="--i:1">${m.lede}</p>
  </div>
</div></section>
<div class="k-wrap k-wrap--wide vm-mstage">${word(m)}${media(ctx, `${m.id}-hero`, { ratio: "21/9", ratioSm: "4/3", priority: true })}</div>
<section class="k-section k-section--tight" aria-label="${m.name} key specs"><div class="k-wrap k-wrap--wide">${specStrip(m)}</div></section>

<section class="k-section k-section--flush-top" id="trims" aria-labelledby="tr-title"><div class="k-wrap k-wrap--wide">
  ${sectionHead({ title: `${m.name} trims`, lede: "Same body, same cabin. Pick the battery and motors that fit how far and how hard you drive.", id: "tr-title" })}
  <ol class="vm-trims" role="list">${m.trims.map((t, n) => html`<li class="vm-trim">
    <span class="vm-trim-step k-num">${n + 1} of ${m.trims.length}</span>
    <h3 class="vm-trim-title">${t.name}</h3>
    <p class="t-body-sm text-secondary">${t.drive}</p>
    <p class="vm-trim-cost"><span class="t-caption text-tertiary">From</span><span class="k-num">${t.price}</span></p>
    <p class="t-body-sm">${t.note}.</p>
    <a class="btn btn-outline btn-sm" href="${ctx.href(bookLink(m, t))}">Test-drive the ${t.name}</a>
  </li>`)}</ol>
</div></section>

<section class="k-section k-surface" id="compare" aria-labelledby="mc-title"><div class="k-wrap k-wrap--wide">
  ${sectionHead({ title: "Every difference, row by row", lede: "Switch off highlighting for a clean sheet, or hide the rows that are the same on every trim.", id: "mc-title" })}
  ${compareTable(ctx, m, { id: `mc-${m.id}-table` })}
</div></section>

<section class="k-section" aria-labelledby="hl-title"><div class="k-wrap k-wrap--wide k-split k-split--center" style="--k-split-a:6fr;--k-split-b:5fr">
  ${media(ctx, `${m.id}-interior`, { ratio: "4/3", shape: "sm" })}
  <div class="k-stack" style="--k-gap:var(--space-6)">
    <h2 class="k-h2" id="hl-title">Why people pick the ${m.name}</h2>
    <dl class="vm-notes vm-notes--lg">${m.highlights.map(([t, d]) => html`<div><dt>${t}</dt><dd>${d}</dd></div>`)}</dl>
  </div>
</div></section>

<section class="k-section k-section--flush-top" id="specs" aria-labelledby="sp-title"><div class="k-wrap k-wrap--wide">
  ${sectionHead({ title: "Full specifications", id: "sp-title" })}
  <div class="vm-sheets">${specTabs}</div>
</div></section>

${ctaBand(ctx, m)}

<section class="k-section" aria-labelledby="other-title"><div class="k-wrap k-wrap--wide">
  <h2 class="k-h4 vm-other-title" id="other-title">Other Voltaro models</h2>
  <ul class="vm-other" role="list">${others.map((o) => html`<li><a href="${ctx.href(modelPage(o))}"><span class="vm-other-name">${o.name}</span><span class="t-body-sm text-secondary">${o.body}, from ${o.key.price[0]}</span>${icon("arrow-right", { className: "vm-other-go" })}</a></li>`)}</ul>
</div></section>`;
    },
  };
}

/* ---------------------------------------------------------------- test drive */
const testDrive = {
  key: "test-drive", file: "test-drive.html", title: "Book a test drive", short: "Test drive",
  description: "Book a Voltaro test drive at a showroom near you: choose a model, a time and you're set.",
  render(ctx) {
    const { tpl } = ctx;
    const s1 = html`
      ${choices({ name: "model", legend: "Model", required: true, cols: 3, span: "full", error: "Choose the model you want to drive.", options: tpl.models.map((m, i) => ({ value: m.id, label: m.name, desc: `${m.body}, from ${m.key.price[0]}`, icon: m.icon, checked: i === 0 })) })}
      ${field({ id: "trim", label: "Trim", type: "select", placeholder: "No preference", options: tpl.models.flatMap((m) => m.trims.map((t) => ({ value: `${m.id}-${t.id}`, label: `${m.name} ${t.name}` }))), help: "Trims drive differently. Pick one if you've narrowed it down." })}
      ${choices({ name: "length", legend: "Drive length", style: "buttons", required: true, error: "Choose how long you'd like to drive.", options: [{ value: "30", label: "30 min, town", checked: true }, { value: "60", label: "60 min, with highway" }] })}
      ${choices({ name: "showroom", legend: "Showroom", required: true, cols: 3, span: "full", error: "Choose a showroom.", help: "Tamber van drives are offered at Harbor District and Northfield.", options: tpl.showrooms.map((s) => ({ value: s.id, label: s.name, desc: s.address })) })}`;
    const s2 = datePicker({ name: "date", label: "Date", timeName: "time", timeLabel: "Start time", closed: [1], leadDays: 1, horizon: 30, slots: ["10:00 AM", "10:45 AM", "11:30 AM", "1:00 PM", "1:45 PM", "2:30 PM", "3:15 PM", "4:00 PM", "5:30 PM"] });
    const s3 = html`
      ${field({ id: "first", label: "First name", required: true, autocomplete: "given-name", error: "Enter your first name." })}
      ${field({ id: "last", label: "Last name", required: true, autocomplete: "family-name", error: "Enter your last name." })}
      ${field({ id: "email", label: "Email", type: "email", required: true, autocomplete: "email", error: "Enter an email address like name@example.com." })}
      ${field({ id: "phone", label: "Mobile number", type: "tel", required: true, autocomplete: "tel", inputmode: "tel", help: "The showroom texts to confirm and when your car is ready.", error: "Enter a mobile number so the showroom can confirm." })}
      ${field({ id: "notes", label: "Anything we should know?", type: "textarea", rows: 3, maxlength: 300, help: "For example a child seat to fit, a trade-in question or a route you want to try." })}
      ${checkbox({ name: "license", label: "I'll bring a valid, unexpired driver's license. Learner's permits can't be used for test drives.", required: true, error: "Confirm you'll bring a valid driver's license." })}
      ${checkbox({ name: "updates", label: "Send me charging and ownership tips by email. Optional, and you can unsubscribe any time." })}`;
    return html`
<section class="k-section k-section--tight vm-book-head"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Voltaro", href: ctx.href({ page: "home" }) }, { label: "Book a test drive" }])}
  <h1 class="k-display">Book a test drive</h1>
  <p class="k-lede">Choose a model and a showroom, then a time. It takes about two minutes, and there's no deposit.</p>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  ${kitForm({ id: "drive-form", label: "Test drive booking", submitLabel: "Book test drive",
    steps: [{ title: "Vehicle and showroom", body: s1 }, { title: "Date and time", body: s2 }, { title: "Driver and contact", body: s3 }],
    success: { title: "Test drive request complete", text: "In a live site, the showroom would text you within the hour to confirm your time, and the car you picked would be charged and parked at the door when you arrive.", next: btn({ label: "Compare trims while you wait", href: ctx.href({ page: "home", hash: "compare" }), variant: "secondary" }) } })}
  <aside class="k-stack k-sticky-col vm-book-aside" style="--k-gap:var(--space-5)" aria-label="Test drive details">
    ${media(ctx, "showroom", { ratio: "3/2", shape: "sm" })}
    <div class="k-stack" style="--k-gap:var(--space-3)">
      <h2 class="k-h5">What happens on the day</h2>
      <ol class="vm-day" role="list">
        <li><b>Check in</b><span>Show your license at the front desk. We scan it, then hand you the key card.</span></li>
        <li><b>Five-minute walkaround</b><span>Seat, mirrors, screen and drive modes, set up before you pull out.</span></li>
        <li><b>Drive</b><span>A specialist rides along with route suggestions, or stays behind if you prefer.</span></li>
      </ol>
    </div>
    <p class="t-body-sm text-secondary">Questions first? Call <a class="link" href="tel:+15550130100">(555) 013-0100</a>, Tuesday to Sunday.</p>
  </aside>
</div></section>
<section class="k-section k-surface" id="faq" aria-labelledby="faq-title"><div class="k-wrap k-wrap--narrow k-stack" style="--k-gap:var(--space-5)">
  <h2 class="k-h2" id="faq-title">Test drive questions</h2>
  ${accordion(tpl.faqs, { openFirst: true })}
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${hero(ctx)}${lineup(ctx)}${compare(ctx)}${charging(ctx)}${ownership(ctx)}${showrooms(ctx)}${ctaBand(ctx)}`,
};

export default [home, ...content.models.map(modelDetail), testDrive];
