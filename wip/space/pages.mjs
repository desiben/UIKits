/*! FacetUI Industry Templates · Space & Astronomy · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, breadcrumb, accordion, kitForm, field, choices, checkbox, filterable, chip } from "../../kit/ui.mjs";
import content from "./content.mjs";

const byId = (tpl, id) => tpl.missions.find((m) => m.id === id);
const entryData = (tpl, e) => (e.mission ? { ...byId(tpl, e.mission), next: e.next } : e);
const statusTone = (m) => (m.status === "flown" ? "outline" : m.next || m.id === "quiet-harbor" ? "brand" : "success");

/* ------------------------------------------------------------ orbit diagram
   Cross-section of the shell above Earth. Altitudes are drawn at 0.35 px/km (about twice
   Earth's curvature scale) so the bands stay readable; the caption says so. */
const O = { cx: 400, cy: 1440, R: 1100, k: 0.35, w: 800, h: 440 };
const rAt = (alt) => O.R + O.k * alt;
const yAtX = (x, alt) => O.cy - Math.sqrt(rAt(alt) ** 2 - (x - O.cx) ** 2);
const f = (n) => Math.round(n * 10) / 10;

function orbitSvg(tpl, { id = "orbit", highlight = null } = {}) {
  const entries = tpl.manifest.map((e) => entryData(tpl, e));
  const n = entries.length;
  const sats = entries.map((m, i) => {
    const th = ((-16 + (32 * i) / (n - 1)) * Math.PI) / 180;
    const r = rAt(m.altitude);
    return { m, x: f(O.cx + r * Math.sin(th)), y: f(O.cy - r * Math.cos(th)) };
  });
  const band = (o) => { const [lo, hi] = tpl.orbits[o].band; return html`<circle class="mo-band mo-band--${o}" data-mo-band="${o}" cx="${O.cx}" cy="${O.cy}" r="${f((rAt(lo) + rAt(hi)) / 2)}" stroke-width="${f(O.k * (hi - lo))}"/>`; };
  const ticks = [200, 400, 600, 800];
  const desc = entries.map((m) => `${m.code} ${m.name}: ${m.altitude} km, ${tpl.orbits[m.orbit].short}`).join("; ");
  return html`<svg class="${highlight ? "mo-orbit mo-orbit--focus" : "mo-orbit"}" viewBox="0 0 ${O.w} ${O.h}" role="img" aria-labelledby="${id}-t ${id}-d" data-mo-orbit>
    <title id="${id}-t">Orbit altitudes Meridian Orbital flies</title>
    <desc id="${id}-d">Mid-inclination LEO band from 400 to 480 km and sun-synchronous band from 500 to 600 km above Earth. Missions: ${desc}.</desc>
    <g class="mo-grid">${[100, 200, 300, 400, 500, 600, 700, 800].map((a) => html`<circle cx="${O.cx}" cy="${O.cy}" r="${rAt(a)}"/>`)}</g>
    ${band("leo")}${band("sso")}
    <circle class="mo-karman" cx="${O.cx}" cy="${O.cy}" r="${rAt(100)}"/>
    <circle class="mo-earth" cx="${O.cx}" cy="${O.cy}" r="${O.R}"/>
    <g class="mo-ticks">${ticks.map((a) => html`<text x="18" y="${f(yAtX(18, a) - 6)}">${a} km</text>`)}<text x="${O.w - 18}" y="${f(yAtX(O.w - 18, 100) - 6)}" text-anchor="end">Kármán line, 100 km</text></g>
    <text class="mo-earth-label" x="${O.cx}" y="${O.cy - O.R + 46}" text-anchor="middle">Earth</text>
    <g class="mo-sats">${sats.map(({ m, x, y }) => html`<g class="${m.id === highlight ? "mo-sat mo-sat--on" : m.status === "upcoming" ? "mo-sat mo-sat--up" : "mo-sat"}" data-orbit="${m.orbit}">
      ${m.id === highlight ? html`<circle class="mo-sat-halo" cx="${x}" cy="${y}" r="13"/>` : ""}<circle class="mo-sat-dot" cx="${x}" cy="${y}" r="5"/>
      <text x="${x}" y="${f(y - 14)}" text-anchor="middle">${m.code}</text>
    </g>`)}</g>
  </svg>`;
}

/* ------------------------------------------------------------------ home */
function remaining(target) {
  let s = Math.max(0, Math.floor((Date.parse(target) - Date.now()) / 1000));
  if (!s) s = 23 * 86400 + 14 * 3600 + 6 * 60;
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad2 = (n) => String(n).padStart(2, "0");

function hero(ctx) {
  const { tpl } = ctx;
  const m = byId(tpl, tpl.hero.mission);
  const t = remaining(m.target);
  const unit = (k, v, label) => html`<div class="mo-count-unit"><span class="mo-count-num k-num" data-u="${k}">${k === "d" ? v : pad2(v)}</span><span class="mo-count-label">${label}</span></div>`;
  return html`<section class="mo-hero" aria-labelledby="mo-title">
  <div class="mo-hero-media">${media(ctx, "hero-launch", { shape: "none", priority: true, fill: true })}</div>
  <div class="k-wrap k-wrap--wide mo-hero-inner">
    <div class="mo-hero-text k-enter">
      <p class="mo-hero-kicker" style="--i:0">${icon("rocket", { size: "sm" })}<span>Next launch</span><span class="mo-hero-code">${m.code}</span></p>
      <h1 class="k-display k-display--xl mo-hero-title" id="mo-title" style="--i:1">${m.name}</h1>
      <p class="k-lede mo-hero-lede" style="--i:2">${tpl.hero.lede}</p>
      <div class="k-cluster" style="--i:3">${btn({ label: "Reserve a payload slot", href: ctx.href({ page: "inquire" }), size: "lg" })}${btn({ label: "Mission details", href: ctx.href({ page: `mission-${m.id}` }), variant: "outline", size: "lg" })}</div>
    </div>
    <div class="mo-count-panel facet" data-mo-count data-target="${m.target}">
      <div class="mo-count-head"><span class="t-label-md">Window opens in</span><button type="button" class="btn btn-ghost btn-sm" data-mo-pause aria-pressed="false">${icon("pause")}<span>Pause countdown</span></button></div>
      <div class="mo-count" role="timer" aria-label="Countdown to the ${m.name} launch window">
        <span class="mo-count-t" aria-hidden="true">T–</span>${unit("d", t.d, "days")}${unit("h", t.h, "hours")}${unit("m", t.m, "min")}${unit("s", t.s, "sec")}
      </div>
      <dl class="mo-count-facts">
        <div><dt>Window</dt><dd>${m.dateShort}, ${m.window}</dd></div>
        <div><dt>Orbit</dt><dd>SSO ${m.altitude} km, ${m.inclination}</dd></div>
        <div><dt>Aboard</dt><dd>${m.payloads} payloads, fully booked</dd></div>
      </dl>
      <p class="mo-count-note">${icon("info", { size: "sm" })}<span>Countdown simulated for this template.</span></p>
    </div>
  </div>
</section>`;
}

function orbitsSection(ctx) {
  const { tpl } = ctx;
  const o = Object.values(tpl.orbits);
  return html`<section class="k-section mo-orbits" id="orbits" aria-labelledby="orb-title"><div class="k-wrap k-wrap--wide">
    <div class="mo-orbits-head">
      <h2 class="k-h2" id="orb-title">Two orbits, flown on a fixed rhythm</h2>
      <p class="k-lede">Every Meridian mission goes to one of two altitude bands. Pick the band your mission needs and we'll match you to the next flight that serves it.</p>
    </div>
    <div class="mo-orbit-card facet">
      <div class="mo-orbit-tools">
        <span class="t-label-sm text-secondary" id="orb-hl">Highlight</span>
        <div class="segment sm" role="radiogroup" aria-labelledby="orb-hl" data-mo-hl>
          <button type="button" role="radio" aria-checked="true" data-value="all">All missions</button>
          <button type="button" role="radio" aria-checked="false" tabindex="-1" data-value="sso">SSO</button>
          <button type="button" role="radio" aria-checked="false" tabindex="-1" data-value="leo">Mid-inc LEO</button>
        </div>
      </div>
      ${orbitSvg(tpl, { id: "orb-home" })}
      <p class="mo-orbit-cap">Altitudes drawn at twice the scale of Earth's curvature so the bands are readable.</p>
    </div>
    <dl class="mo-regimes">${o.map((r) => html`<div class="mo-regime mo-regime--${r.id}">
      <dt><span class="mo-swatch mo-swatch--${r.id}" aria-hidden="true"></span>${r.name}</dt>
      <dd class="mo-regime-alt k-num">${r.band[0]} to ${r.band[1]} km</dd>
      <dd class="mo-regime-text">${r.text}</dd>
    </div>`)}</dl>
  </div></section>`;
}

function manifestEntry(ctx, e) {
  const { tpl } = ctx;
  const m = entryData(tpl, e);
  const orbit = tpl.orbits[m.orbit];
  const page = e.mission ? ctx.href({ page: `mission-${m.id}` }) : null;
  const label = m.status === "flown" ? "Flown" : m.next ? "Next launch" : "Booking open";
  const payloads = e.mission ? (m.status === "flown" ? `${m.payloads} payloads deployed` : m.booked === m.slots ? `${m.payloads} payloads, fully booked` : `${m.booked} of ${m.slots} slots booked`) : m.payloads;
  return html`<article class="${["mo-entry", `mo-entry--${m.status}`, m.next ? "mo-entry--next" : ""].join(" ").trim()}" data-status="${m.status}" data-orbit="${m.orbit}">
    <span class="mo-entry-node" aria-hidden="true">${m.status === "flown" ? icon("check", { size: "sm" }) : m.next ? icon("rocket", { size: "sm" }) : ""}</span>
    <div class="mo-entry-body">
      ${m.next ? html`<p class="mo-entry-flag">Next on the pad</p>` : ""}
      <div class="mo-entry-top"><time class="mo-entry-date k-num">${e.mission ? m.dateShort : m.date}</time>${badge(label, m.status === "flown" ? "outline" : m.next ? "brand" : "success", { dot: m.status !== "flown" })}</div>
      <h3 class="mo-entry-title"><span class="mo-entry-code k-num">${m.code}</span> ${page ? html`<a href="${page}">${m.name}</a>` : m.name}</h3>
      <p class="mo-entry-meta">${orbit.short} · ${m.altitude} km · ${m.inclination}</p>
      <p class="mo-entry-pay">${payloads}</p>
      ${m.open ? html`<a class="link t-label-md" href="${ctx.href({ page: "inquire", query: { mission: m.id } })}">Ask about a slot on ${m.name}</a>` : ""}
    </div>
  </article>`;
}

function manifestSection(ctx) {
  const { tpl } = ctx;
  const flown = tpl.manifest.map((e) => entryData(tpl, e)).filter((m) => m.status === "flown");
  const deployed = flown.reduce((n, m) => n + (typeof m.payloads === "number" ? m.payloads : parseInt(m.payloads, 10)), 0);
  const controls = html`${chip("All missions", { filter: "status", value: "", pressed: true })}${chip("Flown", { filter: "status", value: "flown" })}${chip("Upcoming", { filter: "status", value: "upcoming" })}<select class="select select-sm mo-select" data-filter="orbit" aria-label="Filter by orbit"><option value="">Any orbit</option><option value="sso">Sun-synchronous</option><option value="leo">Mid-inclination LEO</option></select>`;
  return html`<section class="k-section mo-manifest" id="manifest" aria-labelledby="man-title"><div class="k-wrap k-wrap--wide mo-manifest-grid">
    <div class="mo-manifest-side k-sticky-col">
      <h2 class="k-h2" id="man-title">Launch manifest</h2>
      <p class="k-lede">Every mission we've flown and every one we're booking, in order. Fully booked flights still list their orbit so you can plan around them.</p>
      <dl class="mo-tally">
        <div><dt>Missions flown</dt><dd class="k-num">${flown.length}</dd></div>
        <div><dt>Payloads deployed</dt><dd class="k-num">${deployed}</dd></div>
        <div><dt>Missions booking</dt><dd class="k-num">2</dd></div>
      </dl>
    </div>
    ${filterable({ id: "man-filter", label: "Filter the manifest", controls, items: tpl.manifest.map((e) => manifestEntry(ctx, e)), itemsClass: "mo-timeline", countLabel: "missions",
      empty: { icon: "orbit", title: "No missions match", text: "Nothing in the manifest has that status in that orbit yet. New missions are added about nine months before launch.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Show the full manifest</button>` } })}
  </div></section>`;
}

function classesSection(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section mo-classes" id="classes" aria-labelledby="cls-title"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:4fr;--k-split-b:7fr">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="cls-title">Payload classes</h2>
      <p class="k-lede">Prices are per slot and include the dispenser, integration in our cleanroom, one fit check and separation telemetry.</p>
      <p class="t-body-sm text-secondary">University teams pay a reduced rate on up to two 1U to 6U slots per mission. Ask in your inquiry and we'll quote both.</p>
      ${btn({ label: "Get a quote for your payload", href: ctx.href({ page: "inquire" }), variant: "secondary", iconEnd: "arrow-right" })}
    </div>
    <div class="table-wrap"><table class="table mo-table"><caption class="sr-only">Payload classes, limits and starting prices</caption>
      <thead><tr><th scope="col">Class</th><th scope="col">Mass</th><th scope="col">Envelope</th><th scope="col">Carried in</th><th scope="col" class="num">From</th></tr></thead>
      <tbody>${tpl.classes.map((c) => html`<tr><th scope="row"><span class="mo-class"><span class="mo-cube" style="--u:${c.u || 24}" aria-hidden="true"></span>${c.name}</span></th><td>${c.mass}</td><td class="k-num">${c.envelope}</td><td>${c.dispenser}</td><td class="num"><b>${c.from}</b></td></tr>`)}</tbody>
    </table></div>
  </div></section>`;
}

function integrationSection(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section mo-integ" id="integration" aria-labelledby="int-title"><div class="k-wrap k-wrap--wide">
    <div class="mo-integ-head"><h2 class="k-h2" id="int-title">From reservation to separation</h2><p class="k-lede">The countdown on your payload starts about nine months out. Here's what happens at each mark.</p></div>
    <ol class="mo-track">${tpl.integration.map(([t, title, text]) => html`<li><span class="mo-track-t k-num">${t}</span><h3 class="mo-track-title">${title}</h3><p>${text}</p></li>`)}</ol>
    <div class="mo-integ-foot k-split" style="--k-split-a:5fr;--k-split-b:7fr">
      ${media(ctx, "cleanroom", { shape: "facet" })}
      <div class="k-stack" style="--k-gap:var(--space-5)">
        <h3 class="k-h3">Questions teams ask first</h3>
        ${accordion(tpl.faq, { openFirst: true })}
      </div>
    </div>
  </div></section>`;
}

function whoSection(ctx) {
  const { tpl } = ctx;
  const img = { universities: "students", startups: "ground-station" };
  return html`<section class="k-section mo-who" id="who" aria-labelledby="who-title"><div class="k-wrap k-wrap--wide">
    <h2 class="k-h2 mo-who-title" id="who-title">Who flies with us</h2>
    <div class="mo-who-grid">${tpl.audiences.map((a, i) => html`<article class="mo-aud mo-aud--${i}">
      ${media(ctx, img[a.id], { shape: "sm", ratio: "3/2" })}
      <div class="mo-aud-body">
        <h3 class="k-h3 mo-aud-title">${icon(a.icon)}${a.title}</h3>
        <p class="t-body-md text-secondary">${a.text}</p>
        <ul class="mo-points">${a.points.map((p) => html`<li>${icon("check", { size: "sm" })}${p}</li>`)}</ul>
      </div>
    </article>`)}</div>
  </div></section>`;
}

function openSlots(ctx) {
  const { tpl } = ctx;
  const sl = byId(tpl, "second-light");
  const ember = tpl.manifest.find((e) => e.code === "MO-12");
  const row = (name, code, date, orbit, booked, slots, link, page) => html`<li class="mo-slot">
    <div><span class="mo-slot-code k-num">${code}</span><b class="mo-slot-name">${page ? html`<a href="${page}">${name}</a>` : name}</b><span class="t-body-sm text-secondary">${date} · ${orbit}</span></div>
    <div class="mo-slot-meter"><div class="row" style="justify-content:space-between"><span class="t-label-sm">${slots - booked} slots open</span><span class="t-label-sm k-num text-tertiary">${booked} of ${slots} booked</span></div><div class="progress" role="progressbar" aria-label="${name} slots booked" aria-valuenow="${Math.round((booked / slots) * 100)}" aria-valuemin="0" aria-valuemax="100"><span style="--value:${Math.round((booked / slots) * 100)}%"></span></div></div>
    ${btn({ label: `Ask about ${name}`, href: link, variant: "secondary", size: "sm" })}
  </li>`;
  return html`<section class="k-section mo-open" aria-labelledby="open-title"><div class="k-wrap k-wrap--wide mo-open-inner facet">
    <div class="k-stack" style="--k-gap:var(--space-4)"><h2 class="k-h2" id="open-title">Slots still open</h2><p class="k-lede">Quiet Harbor is full. These two missions are booking now.</p></div>
    <ul class="mo-slots" role="list">
      ${row(sl.name, sl.code, sl.dateShort, `SSO ${sl.altitude} km`, sl.booked, sl.slots, ctx.href({ page: "inquire", query: { mission: "mo-11" } }), ctx.href({ page: "mission-second-light" }))}
      ${row(ember.name, ember.code, ember.date, `Mid-inc LEO ${ember.altitude} km`, 6, 18, ctx.href({ page: "inquire", query: { mission: "mo-12" } }))}
    </ul>
  </div></section>`;
}

/* ------------------------------------------------------------- mission page */
function missionPage(m, i, all) {
  const next = all[(i + 1) % all.length];
  return {
    key: `mission-${m.id}`, file: `mission-${m.id}.html`, title: `${m.code} ${m.name}`, short: "Mission", kitbar: i === 2,
    description: `${m.code} ${m.name}: ${m.lede}`,
    render(ctx) {
      const { tpl } = ctx;
      const orbit = tpl.orbits[m.orbit];
      const up = m.status === "upcoming";
      const open = up && m.booked < m.slots;
      const pct = Math.round((m.booked / m.slots) * 100);
      const label = m.id === "quiet-harbor" ? "Next launch" : m.statusLabel;
      const status = m.status === "flown"
        ? html`<div class="alert alert-success" role="status">${icon("circle-check")}<div><div class="alert-title">Mission complete</div><div class="alert-desc">${m.result}</div></div></div>`
        : html`<div class="mo-book card"><div class="card-body k-stack" style="--k-gap:var(--space-3)">
            <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:var(--space-2)"><b class="t-label-lg">${open ? `${m.slots - m.booked} slots open` : "Fully booked"}</b><span class="t-label-sm k-num text-tertiary">${m.booked} of ${m.slots} slots booked</span></div>
            <div class="progress" role="progressbar" aria-label="${m.name} slots booked" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="--value:${pct}%"></span></div>
            ${open
              ? btn({ label: `Ask about a slot on ${m.name}`, href: ctx.href({ page: "inquire", query: { mission: m.code.toLowerCase() } }), block: true })
              : html`<p class="t-body-sm text-secondary">The next sun-synchronous mission with open slots is MO-11 Second Light.</p>${btn({ label: "Ask about Second Light", href: ctx.href({ page: "inquire", query: { mission: "mo-11" } }), variant: "secondary", block: true })}`}
          </div></div>`;
      const nodeIcon = { done: "check", current: "circle-dot", next: "clock" };
      return html`
<section class="mo-mhead"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Manifest", href: ctx.href({ page: "home", hash: "manifest" }) }, { label: `${m.code} ${m.name}` }])}
  <div class="mo-mhead-grid k-enter">
    <div class="k-stack" style="--k-gap:var(--space-4)">
      <div class="k-cluster" style="--i:0;--k-gap:var(--space-2)">${badge(label, m.status === "flown" ? "outline" : m.id === "quiet-harbor" ? "brand" : "success", { dot: up })}<span class="mo-mcode k-num">${m.code}</span></div>
      <h1 class="k-display" style="--i:1">${m.name}</h1>
    </div>
    <p class="k-lede" style="--i:2">${m.lede}</p>
  </div>
  <dl class="mo-mfacts">
    <div><dt>${m.status === "flown" ? "Launched" : "Launch"}</dt><dd>${m.date}</dd></div>
    <div><dt>Orbit</dt><dd>${orbit.short}, ${m.altitude} km</dd></div>
    <div><dt>Inclination</dt><dd class="k-num">${m.inclination}</dd></div>
    <div><dt>Payloads</dt><dd>${m.status === "flown" ? `${m.payloads} deployed` : `${m.booked} of ${m.slots} booked`}</dd></div>
    <div><dt>Vehicle</dt><dd>Arcline 2</dd></div>
  </dl>
</div></section>
<div class="k-wrap k-wrap--wide">${media(ctx, m.image, { shape: "facet", priority: true })}</div>
<section class="k-section"><div class="k-wrap k-wrap--wide mo-mbody">
  <div class="k-stack" style="--k-gap:var(--space-10)">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h3">About the mission</h2>
      ${m.story.map((p) => html`<p class="mo-story">${p}</p>`)}
      ${status}
    </div>
    <div class="k-stack" style="--k-gap:var(--space-5)" id="window">
      <h2 class="k-h3">Launch window</h2>
      <table class="mo-kv"><caption class="sr-only">Launch window and site</caption><tbody>
        <tr><th scope="row">${m.status === "flown" ? "Liftoff" : "Primary window"}</th><td>${m.status === "flown" ? `${m.date}, ${m.window}` : `${m.date}, ${m.window}`}</td></tr>
        <tr><th scope="row">${m.status === "flown" ? "Attempts" : "Backup window"}</th><td>${m.backup}</td></tr>
        <tr><th scope="row">Launch site</th><td>${m.pad}</td></tr>
        <tr><th scope="row">Vehicle</th><td>Arcline 2, rideshare configuration with second-generation dispenser plate</td></tr>
      </tbody></table>
    </div>
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h3">Mission status</h2>
      <ol class="timeline mo-status">${m.milestones.map(([st, t, d]) => html`<li class="mo-ms mo-ms--${st}"><span class="${st === "next" ? "node" : "node brand"}">${icon(nodeIcon[st], { size: "sm" })}</span><div><b>${t}</b><time>${d}</time>${st === "current" ? html`<p>${badge("In progress", "brand", { dot: true })}</p>` : ""}</div></li>`)}</ol>
    </div>
  </div>
  <aside class="k-sticky-col mo-maside" aria-labelledby="mo-orb-title">
    <div class="mo-orbit-card facet">
      <h2 class="t-label-lg" id="mo-orb-title">Where ${m.name} ${m.status === "flown" ? "went" : "is going"}</h2>
      ${orbitSvg(tpl, { id: `orb-${m.id}`, highlight: m.id })}
      <dl class="mo-params">
        <div><dt>Orbit type</dt><dd>${orbit.name}</dd></div>
        <div><dt>Altitude</dt><dd class="k-num">${m.altitude} km circular</dd></div>
        <div><dt>Inclination</dt><dd class="k-num">${m.inclination}</dd></div>
        <div><dt>Local time</dt><dd>${m.ltan}</dd></div>
      </dl>
    </div>
  </aside>
</div></section>
<section class="k-section k-section--flush-top" aria-labelledby="pl-title"><div class="k-wrap k-wrap--wide k-stack" style="--k-gap:var(--space-5)">
  <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);align-items:end"><h2 class="k-h3" id="pl-title">Payloads aboard</h2><span class="t-body-sm text-secondary">${m.manifest.length} of ${m.status === "flown" ? m.payloads : m.booked} shown. Other customers asked not to be listed.</span></div>
  <div class="table-wrap"><table class="table mo-table"><caption class="sr-only">Payloads on ${m.code} ${m.name}</caption>
    <thead><tr><th scope="col">Payload</th><th scope="col">Operator</th><th scope="col">Class</th><th scope="col" class="num">Mass</th><th scope="col">Purpose</th></tr></thead>
    <tbody>${m.manifest.map(([p, org, cls, mass, why]) => html`<tr><th scope="row">${p}</th><td>${org}</td><td>${cls}</td><td class="num k-num">${mass}</td><td>${why}</td></tr>`)}</tbody>
  </table></div>
</div></section>
<nav class="mo-next" aria-label="Next mission"><div class="k-wrap k-wrap--wide">
  <a href="${ctx.href({ page: `mission-${next.id}` })}"><span class="t-label-sm text-tertiary">Next in the manifest</span><span class="mo-next-name"><span class="k-num mo-next-code">${next.code}</span>${next.name}</span>${icon("arrow-right")}</a>
</div></nav>`;
    },
  };
}

/* --------------------------------------------------------------- inquiry */
const inquire = {
  key: "inquire", file: "inquire.html", title: "Reserve a payload slot", short: "Inquire",
  description: "Ask Meridian Orbital about a rideshare slot: orbit, payload, target window, integration needs and your organization.",
  render(ctx) {
    const { tpl } = ctx;
    const s1 = html`
      ${choices({ name: "orbit", legend: "Which orbit does your mission need?", required: true, span: "full", error: "Choose an orbit, or let us advise.", options: [
        { value: "sso", label: "Sun-synchronous, 500 to 600 km", desc: "Consistent lighting for imaging. Morning and afternoon local times.", icon: "sun" },
        { value: "leo", label: "Mid-inclination LEO, 400 to 480 km", desc: "45 or 53 degrees. Shorter orbital life, no propulsion needed to deorbit.", icon: "earth" },
        { value: "advise", label: "Not sure yet", desc: "Tell us about the mission and we'll recommend one.", icon: "compass" },
      ] })}
      ${field({ id: "mission", label: "Preferred mission", type: "select", placeholder: "Any mission that fits", options: [{ value: "mo-11", label: "MO-11 Second Light, NET Feb 2027, SSO 600 km" }, { value: "mo-12", label: "MO-12 Ember Line, May 2027, mid-inc LEO 525 km" }], help: "Quiet Harbor (MO-10) is fully booked." })}`;
    const s2 = html`
      ${choices({ name: "class", legend: "Payload class", required: true, cols: 3, span: "full", error: "Choose the class closest to your spacecraft.", options: tpl.classes.map((c) => ({ value: c.id, label: c.name, desc: c.mass })) })}
      ${field({ id: "mass", label: "Mass at launch (kg)", type: "number", required: true, min: 1, max: 60, inputmode: "decimal", help: "Include rails and any interface hardware. Up to 60 kg.", error: "Enter a mass between 1 and 60 kg." })}
      ${field({ id: "dims", label: "Stowed dimensions", placeholder: "For example 10 × 22.6 × 36.6 cm", help: "Needed for microsatellites and anything outside a standard cubesat envelope." })}
      ${choices({ name: "propulsion", legend: "Propulsion", style: "buttons", required: true, span: "full", error: "Tell us whether the payload carries propulsion.", options: [{ value: "none", label: "None" }, { value: "cold-gas", label: "Cold gas" }, { value: "electric", label: "Electric" }, { value: "other", label: "Other" }] })}`;
    const s3 = html`
      ${choices({ name: "window", legend: "Target launch window", required: true, cols: 2, span: "full", error: "Choose a target window.", options: [
        { value: "q1-2027", label: "Early 2027", desc: "Second Light, SSO 600 km" },
        { value: "q2-2027", label: "Mid 2027", desc: "Ember Line, mid-inc LEO 525 km" },
        { value: "h2-2027", label: "Second half of 2027", desc: "Missions MO-13 and MO-14, orbits to be set" },
        { value: "flexible", label: "Flexible", desc: "First mission that fits our orbit" },
      ] })}
      ${choices({ name: "flex", legend: "If that mission slips or fills", style: "buttons", required: true, span: "full", error: "Choose how flexible your date is.", options: [{ value: "fixed", label: "We need that date" }, { value: "one", label: "One mission later is fine" }, { value: "any", label: "Any later mission" }] })}
      ${field({ id: "ready", label: "Flight unit ready by", type: "date", help: "When your flight unit can ship to Halvard Point." })}`;
    const s4 = html`
      ${choices({ name: "needs", type: "checkbox", legend: "Integration support you'll need", span: "full", cols: 2, help: "Choose any that apply. All are included in the slot price.", options: [
        { value: "charging", label: "Battery charging after integration", desc: "Through the dispenser access port" },
        { value: "purge", label: "Dry nitrogen purge", desc: "For optics and sensitive detectors" },
        { value: "rehearsal", label: "Fit-check rehearsal", desc: "A practice run before the real fit check" },
        { value: "deorbit", label: "Help with deorbit analysis", desc: "Common for first-time teams" },
      ] })}
      ${field({ id: "notes", label: "Anything unusual about the payload?", type: "textarea", maxlength: 600, rows: 4, help: "Deployables, hazardous materials, tight thermal limits or a late-access request." })}`;
    const s5 = html`
      ${field({ id: "org", label: "Organization", required: true, autocomplete: "organization", error: "Enter your university, company or lab." })}
      ${choices({ name: "orgtype", legend: "Organization type", style: "buttons", required: true, span: "full", error: "Choose an organization type.", options: [{ value: "university", label: "University" }, { value: "startup", label: "Startup or company" }, { value: "lab", label: "Government lab" }, { value: "other", label: "Other" }] })}
      ${field({ id: "name", label: "Your name", required: true, autocomplete: "name", error: "Enter your name." })}
      ${field({ id: "email", label: "Work email", type: "email", required: true, autocomplete: "email", help: "We reply from manifest@meridianorbital.example.", error: "Enter an email address like name@university.edu." })}
      ${field({ id: "phone", label: "Phone", type: "tel", autocomplete: "tel" })}
      ${field({ id: "country", label: "Country of the payload owner", type: "select", required: true, placeholder: "Choose a country", options: ["United States", "Canada", "United Kingdom", "Germany", "Japan", "Australia", "Other"], help: "Affects the export documents we'll ask for.", error: "Choose the country of the payload owner." })}
      ${checkbox({ name: "review", label: "We understand a slot is confirmed only after the interface review is passed.", required: true, error: "Confirm you understand how slots are confirmed." })}`;
    return html`
<section class="k-section k-section--tight mo-inq-head"><div class="k-wrap k-wrap--wide">
  ${breadcrumb([{ label: "Meridian Orbital", href: ctx.href({ page: "home" }) }, { label: "Reserve a payload slot" }])}
  <div class="k-enter k-stack" style="--k-gap:var(--space-4)">
    <h1 class="k-display" style="--i:0">Reserve a payload slot</h1>
    <p class="k-lede" style="--i:1">Five short steps, about six minutes. Rough numbers are fine; the interface review is where details get pinned down.</p>
  </div>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-wrap--wide k-split" style="--k-split-a:7fr;--k-split-b:4fr">
  <div class="mo-form-card facet">${kitForm({ id: "slot-form", label: "Payload slot inquiry", submitLabel: "Send slot inquiry",
    steps: [{ title: "Orbit", body: s1 }, { title: "Payload", body: s2 }, { title: "Window", body: s3 }, { title: "Integration", body: s4 }, { title: "Organization", body: s5 }],
    success: { title: "Payload slot inquiry complete", text: "On a live site, Meridian's manifest team would reply within two business days with slot availability on your target missions, a price for your payload class and the interface control document checklist.", next: btn({ label: "Back to the manifest", href: ctx.href({ page: "home", hash: "manifest" }), variant: "secondary" }) } })}</div>
  <aside class="k-stack k-sticky-col mo-inq-aside" style="--k-gap:var(--space-5)" aria-label="About slot inquiries">
    ${media(ctx, "fit-check", { shape: "sm" })}
    <div class="k-stack" style="--k-gap:var(--space-3)">
      <h2 class="t-label-lg">What happens next</h2>
      <ol class="mo-after">
        <li><b>Availability and price</b><span>Within two business days, for each mission that matches your orbit and window.</span></li>
        <li><b>A slot on hold</b><span>We hold it for 30 days while you review the interface control document.</span></li>
        <li><b>Interface review</b><span>A one-hour call with a mission engineer. Your slot is confirmed when it passes.</span></li>
      </ol>
    </div>
    <p class="t-body-sm text-secondary">Prefer to talk first? Call the manifest desk at <a class="link" href="tel:+15550142290">(555) 014-2290</a>, weekdays 8 AM to 5 PM Eastern.</p>
  </aside>
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home", header: { variant: "overlay" }, bodyClass: "mo-home",
  render: (ctx) => html`${hero(ctx)}${manifestSection(ctx)}${orbitsSection(ctx)}${classesSection(ctx)}${integrationSection(ctx)}${whoSection(ctx)}${openSlots(ctx)}`,
};

export default [home, ...content.missions.map(missionPage), inquire];
