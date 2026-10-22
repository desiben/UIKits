/*! FacetUI Industry Templates · Finance & Investment · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, accordion, kitForm, field, choices, checkbox, datePicker, avatar, alertBox } from "../../kit/ui.mjs";
import content from "./content.mjs";

const money = (n) => "$" + n.toLocaleString("en-US");
const svcById = (tpl, id) => tpl.services.find((s) => s.id === id);

/** Flat fee for a household, plan type and set of complexity factors (same maths as template.js). */
function feeFor(fees, plan, hh, ids) {
  const base = fees.base[plan][hh];
  const lines = fees.factors.filter((f) => ids.includes(f.id)).map((f) => ({ label: f.label, amount: f[plan] }));
  const total = base + lines.reduce((s, l) => s + l.amount, 0);
  const tier = fees.tiers.find((t) => lines.length <= t.max);
  return { base, lines, total, tier, tierIndex: fees.tiers.indexOf(tier) };
}
const presetRange = (fees, svc) => svc.presets.map(([hh, ...ids]) => feeFor(fees, "once", hh, ids).total);
const generalNote = (tpl) => html`<p class="ca-note">${icon("info", { size: "sm" })}<span>${tpl.generalNote}</span></p>`;

/* ------------------------------------------------------------------ home */
function hero(ctx) {
  const { tpl } = ctx;
  return html`<section class="ca-hero" id="questions" aria-labelledby="ca-title"><div class="k-wrap">
    <div class="ca-hero-head k-enter">
      <h1 class="k-display ca-hero-title" id="ca-title" style="--i:0">${tpl.hero.title}</h1>
      <p class="k-lede" style="--i:1">${tpl.hero.lede}</p>
    </div>
    <ul class="ca-questions" role="list" aria-label="Common questions we help with">
      ${tpl.questions.map((q) => { const s = svcById(tpl, q.service); return html`<li><a class="ca-q" href="${ctx.href({ page: `service-${s.id}` })}">
        <span class="ca-q-text">${q.q}</span>
        <span class="ca-q-first">${q.first}</span>
        <span class="ca-q-route">${icon(s.icon, { size: "sm" })}<span>${s.name}</span>${icon("arrow-right", { size: "sm", className: "ca-q-go" })}</span>
      </a></li>`; })}
    </ul>
    <div class="ca-hero-foot">
      <p class="ca-hero-other">${icon("message-circle")}<span>${tpl.hero.other}</span></p>
      <div class="k-cluster">${btn({ label: "Book a free intro call", href: ctx.href({ page: "book" }), icon: "calendar-check" })}${btn({ label: "Estimate your fee", href: "#fees", variant: "outline", icon: "calculator" })}</div>
    </div>
  </div></section>`;
}

function statement(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section ca-statement" aria-labelledby="st-title"><div class="k-wrap ca-statement-grid">
    ${media(ctx, "plan-table", { className: "ca-statement-media" })}
    <div class="k-stack ca-statement-text" style="--k-gap:var(--space-8)">
      <h2 class="ca-big" id="st-title">We're paid a flat fee by the people we plan for. <span>Not by fund companies, insurers or lenders. Not by a slice of your savings.</span></h2>
      <dl class="ca-facts">${tpl.facts.map((f) => html`<div><dt>${f.k}</dt><dd class="k-num">${f.v}</dd></div>`)}</dl>
      <a class="link t-label-lg ca-inline-link" href="#paid">See how we're paid, and how we're not</a>
    </div>
  </div></section>`;
}

function services(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-section--flush-top" id="services" aria-labelledby="svc-title"><div class="k-wrap">
    ${sectionHead({ title: "Four kinds of planning", lede: "Most households need one of these to start. Plans often grow to cover the others, at a fee agreed before anything changes.", id: "svc-title" })}
    <ul class="ca-services" role="list">${tpl.services.map((s) => { const [lo, hi] = presetRange(tpl.fees, s); return html`<li class="ca-svc">
      ${media(ctx, `svc-${s.id}`, { shape: "sm", hideBrief: true })}
      <div class="ca-svc-body">
        <h3 class="k-h3"><a class="ca-svc-link" href="${ctx.href({ page: `service-${s.id}` })}">${s.name}</a></h3>
        <p class="t-body-md text-secondary">${s.short}</p>
        <ul class="ca-svc-qs" role="list">${s.questions.slice(0, 2).map((q) => html`<li>${q}</li>`)}</ul>
        <p class="ca-svc-fee"><span>Typical one-time plan</span><b class="k-num">${money(lo)} to ${money(hi)}</b></p>
      </div>
    </li>`; })}</ul>
  </div></section>`;
}

function feeExplainer(ctx) {
  const { tpl } = ctx; const F = tpl.fees;
  const init = feeFor(F, "once", "couple", []);
  const data = { base: F.base, factors: F.factors.map(({ id, label, once, ongoing }) => ({ id, label, once, ongoing })), tiers: F.tiers, plans: F.plans };
  return html`<section class="k-section k-surface ca-fees" id="fees" aria-labelledby="fees-title"><div class="k-wrap">
    <div class="ca-fees-head">
      <h2 class="k-h1" id="fees-title">What it costs, before you ask</h2>
      <p class="k-lede">Our fee depends on how much there is to plan, never on how much you have. Choose what applies to you and the estimate updates as you go.</p>
    </div>
    <div class="ca-calc" data-ca-calc>
      <div class="ca-calc-form card facet" role="group" aria-label="Fee estimate options">
        <fieldset class="ca-fs">
          <legend class="label">Type of plan</legend>
          <div class="ca-opts ca-opts--plan">${F.plans.map((p, i) => html`<label class="ca-opt"><input type="radio" name="plan" value="${p.id}"${i === 0 ? raw(" checked") : ""}><span class="ca-opt-body"><b>${p.label}</b><span>${p.desc}</span></span></label>`)}</div>
        </fieldset>
        <fieldset class="ca-fs">
          <legend class="label">Who the plan is for</legend>
          <div class="ca-opts ca-opts--hh">${F.households.map((h) => html`<label class="ca-opt ca-opt--pill"><input type="radio" name="household" value="${h.id}"${h.id === "couple" ? raw(" checked") : ""}><span class="ca-opt-body"><b>${h.label}</b></span></label>`)}</div>
        </fieldset>
        <fieldset class="ca-fs">
          <legend class="label">What applies to you?</legend>
          <p class="t-body-sm text-tertiary ca-fs-help">Each one adds planning work, so each one adds a fixed amount.</p>
          <div class="ca-factors">${F.factors.map((f) => html`<label class="check ca-factor"><input type="checkbox" name="factor" value="${f.id}"><span>${f.label}</span><span class="ca-factor-amt k-num" data-ca-amt="${f.id}">+${money(f.once)}</span></label>`)}</div>
        </fieldset>
      </div>
      <div class="ca-result" aria-labelledby="est-title">
        <div class="ca-result-top">
          <h3 class="t-label-lg" id="est-title">Illustrative flat fee</h3>
          <p class="ca-total k-num" aria-live="polite" aria-atomic="true"><span data-ca-total>${money(init.total)}</span><span class="ca-total-unit" data-ca-unit>one time</span></p>
          <p class="t-body-sm ca-billing" data-ca-billing>${F.plans[0].billing}.</p>
        </div>
        <div class="ca-tier">
          <div class="ca-tier-bar" aria-hidden="true">${F.tiers.map((t, i) => html`<span${i <= init.tierIndex ? raw(' data-on="true"') : ""}></span>`)}</div>
          <p class="t-body-sm"><b data-ca-tier>${init.tier.label}</b> plan. <span data-ca-tier-text>${init.tier.text}</span></p>
        </div>
        <dl class="ca-lines" data-ca-lines>
          <div><dt>Base fee</dt><dd class="k-num">${money(init.base)}</dd></div>
        </dl>
        <p class="ca-cap">${icon("shield-check", { size: "sm" })}<span>The fee in your engagement letter is the fee you pay. If the work takes longer than we expected, that's on us.</span></p>
        <div class="k-cluster">${btn({ label: "Talk it through on a free call", href: ctx.href({ page: "book" }), variant: "secondary", size: "sm" })}</div>
        <p class="ca-disclaimer">Illustrative sample figures for this template, not a quote. ${tpl.generalNote}</p>
      </div>
    </div>
    <script type="application/json" id="ca-fees-data">${raw(JSON.stringify(data).replace(/</g, "\\u003c"))}</script>

    <div class="ca-paid" id="paid">
      <div class="ca-paid-head">
        <h2 class="k-h2">How we're paid, and how we're not</h2>
        <p class="k-lede">Ask any advisor for this list. If the answers aren't this short, ask why.</p>
      </div>
      <div class="table-wrap ca-paid-wrap"><table class="table ca-paid-table">
        <caption class="sr-only">Ways a financial advisor can be paid, and whether Clearwater is paid that way</caption>
        <thead><tr><th scope="col">Way an advisor can be paid</th><th scope="col">Clearwater</th><th scope="col">What it means for you</th></tr></thead>
        <tbody>${F.paid.map((r) => html`<tr data-us="${r.us ? "yes" : "no"}">
          <th scope="row">${r.way}</th>
          <td>${r.us ? html`<span class="ca-yes">${icon("check", { size: "sm" })}How we're paid</span>` : html`<span class="ca-no">${icon("ban", { size: "sm" })}Never</span>`}</td>
          <td>${r.why}</td>
        </tr>`)}</tbody>
      </table></div>
      <p class="t-body-sm text-tertiary ca-paid-foot">Hourly sessions are ${money(F.hourly)} an hour, billed in 15-minute steps after the call.</p>
    </div>
  </div></section>`;
}

function process(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section" id="process" aria-labelledby="pr-title"><div class="k-wrap">
    ${sectionHead({ title: "How working together goes", lede: "Five steps from first call to a plan you can act on. You can stop after any of them.", id: "pr-title", action: btn({ label: "Start with step one", href: ctx.href({ page: "book" }), variant: "outline" }) })}
    <ol class="ca-process">${tpl.process.map((p) => html`<li><span class="ca-process-time">${p.time}</span><h3 class="k-h4">${p.title}</h3><p>${p.text}</p></li>`)}</ol>
  </div></section>`;
}

function team(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-section--flush-top" id="team" aria-labelledby="tm-title"><div class="k-wrap ca-team">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="tm-title">The people you'd talk to</h2>
      <p class="k-lede">A small team, so you'll work with the same planner from the intro call onward. None of us is paid more for recommending one thing over another.</p>
      <ul class="ca-planners" role="list">${tpl.planners.map((p) => html`<li>${avatar(p.name)}<div><h3 class="t-label-lg">${p.name}</h3><p class="t-body-sm text-secondary">${p.role}. ${p.focus}.</p><p class="t-body-sm text-tertiary">${p.note}</p></div></li>`)}</ul>
    </div>
    <div class="ca-office">
      ${media(ctx, "office", { shape: "facet" })}
      <div class="ca-office-card card"><div class="card-body k-stack" style="--k-gap:var(--space-2)">
        <h3 class="t-label-lg">${icon("map-pin", { size: "sm" })} Visit or meet by video</h3>
        <p class="t-body-sm">${tpl.office.address}<br>${tpl.office.hours}</p>
        <p class="t-body-sm text-secondary">${tpl.office.note}</p>
      </div></div>
    </div>
  </div></section>`;
}

function faq(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-surface" id="faq" aria-labelledby="faq-title"><div class="k-wrap k-split" style="--k-split-a:5fr;--k-split-b:7fr">
    <div class="k-stack k-sticky-col" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="faq-title">Common questions</h2>
      <p class="k-lede">Straight answers about how we work. If yours isn't here, ask it on the intro call.</p>
      <div class="k-cluster">${btn({ label: "Book an intro call", href: ctx.href({ page: "book" }) })}<a class="btn btn-ghost" href="tel:+15550142280">${icon("phone")}(555) 014-2280</a></div>
      ${generalNote(tpl)}
    </div>
    ${accordion(tpl.faqs, { openFirst: true })}
  </div></section>`;
}

/* ------------------------------------------------------------- service page */
function servicePage(svc) {
  return {
    key: `service-${svc.id}`, file: `service-${svc.id}.html`, title: svc.name, short: "Service", kitbar: svc.id === "retirement",
    description: `${svc.name} at Clearwater Advisory: ${svc.short}`,
    render(ctx) {
      const { tpl } = ctx;
      const [lo, hi] = presetRange(tpl.fees, svc);
      const others = tpl.services.filter((s) => s.id !== svc.id);
      const [hh, ...ids] = svc.presets[0];
      return html`
<section class="k-section k-section--tight ca-svc-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Services", href: ctx.href({ page: "home", hash: "services" }) }, { label: svc.name }])}
  <div class="k-split k-split--center" style="--k-split-a:6fr;--k-split-b:5fr">
    <div class="k-stack k-enter" style="--k-gap:var(--space-5)">
      <span class="ca-svc-icon" style="--i:0">${icon(svc.icon)}</span>
      <h1 class="k-h1" style="--i:1">${svc.name}</h1>
      <p class="k-lede" style="--i:2">${svc.about}</p>
      <dl class="ca-svc-facts" style="--i:3"><div><dt>Who it's for</dt><dd>${svc.forWho}</dd></div><div><dt>Typical one-time fee</dt><dd class="k-num">${money(lo)} to ${money(hi)}</dd></div><div><dt>Meetings</dt><dd>By video or in Lakeview</dd></div></dl>
    </div>
    ${media(ctx, `svc-${svc.id}`, { priority: true })}
  </div>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  <div class="k-stack" style="--k-gap:var(--space-12)">
    <section aria-labelledby="q-title" class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h3" id="q-title">Questions this answers</h2>
      <ul class="ca-ask" role="list">${svc.questions.map((q) => html`<li>${icon("circle-help")}<span>${q}</span></li>`)}</ul>
    </section>
    <section aria-labelledby="get-title" class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h3" id="get-title">What your plan includes</h2>
      <ul class="ca-checklist" role="list">${svc.deliverables.map((d) => html`<li>${icon("file-check")}<span>${d}</span></li>`)}</ul>
    </section>
    <section aria-labelledby="ex-title" class="ca-example facet">
      <h2 class="k-h4" id="ex-title">How this might look for one household</h2>
      <p class="t-body-lg">${svc.example}</p>
      ${generalNote(tpl)}
    </section>
    <section aria-labelledby="bring-title" class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h3" id="bring-title">What we'll ask you to bring</h2>
      <ul class="ca-bring" role="list">${svc.bring.map((b) => html`<li>${icon("folder-lock", { size: "sm" })}<span>${b}</span></li>`)}</ul>
      <p class="t-body-sm text-secondary">You upload documents to a secure folder after you sign. We never ask for account logins or passwords.</p>
    </section>
    <section aria-labelledby="sfaq-title" class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h3" id="sfaq-title">Questions about ${svc.name.toLowerCase()}</h2>
      ${accordion([...svc.faqs, tpl.faqs[0]])}
    </section>
  </div>
  <aside class="k-sticky-col k-stack" style="--k-gap:var(--space-4)" aria-label="Book a call about ${svc.name.toLowerCase()}">
    <div class="card facet ca-side"><div class="card-body k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h4">Talk it through first</h2>
      <p class="t-body-sm text-secondary">A free 30-minute video call with a planner. You'll leave knowing whether we can help and what it would cost.</p>
      ${btn({ label: "Book an intro call", href: ctx.href({ page: "book", query: { topics: svc.id } }), block: true, icon: "calendar-check" })}
      <div class="ca-side-fee">
        <span class="t-label-sm text-tertiary">Typical one-time fee</span>
        <b class="ca-side-num k-num">${money(lo)} to ${money(hi)}</b>
        <a class="link t-label-md" href="${ctx.href({ page: "home", query: { hh, f: ids.join(",") }, hash: "fees" })}">Estimate the fee for your situation</a>
      </div>
    </div></div>
    <p class="t-body-xs text-tertiary">Prefer the phone? Call <a class="link" href="tel:+15550142280">(555) 014-2280</a>, Monday to Friday.</p>
  </aside>
</div></section>
<section class="k-section k-surface" aria-labelledby="more-title"><div class="k-wrap">
  ${sectionHead({ title: "Other planning we do", id: "more-title" })}
  <ul class="k-grid k-grid--3 ca-other" role="list">${others.map((s) => html`<li><a class="item-card" data-variant="outline" href="${ctx.href({ page: `service-${s.id}` })}"><span class="item-card-icon brand">${icon(s.icon)}</span><span class="item-card-content"><span class="item-card-title">${s.name}</span><span class="item-card-desc">${s.questions[0]}</span></span><span class="item-card-action">${icon("chevron-right")}</span></a></li>`)}</ul>
</div></section>`;
    },
  };
}

/* ---------------------------------------------------------------- intro call */
const book = {
  key: "book", file: "book.html", title: "Book an intro call", short: "Intro call",
  description: "Book a free 30-minute intro call with a Clearwater Advisory planner by video.",
  render(ctx) {
    const { tpl } = ctx;
    const step1 = html`
      ${choices({ name: "topics", legend: "What would you like to talk about?", type: "checkbox", required: true, cols: 2, span: "full", error: "Choose at least one topic, or pick \u201cNot sure yet\u201d.", help: "Choose as many as apply.", options: tpl.topics.map((t) => ({ value: t.value, label: t.label, icon: t.icon })) })}
      ${choices({ name: "household", legend: "Who would the plan be for?", style: "buttons", required: true, span: "full", error: "Tell us who the plan would cover.", options: [{ value: "single", label: "Just me" }, { value: "couple", label: "Me and a partner" }, { value: "family-business", label: "Our household and a business" }] })}
      ${field({ id: "notes", label: "Anything we should know before the call?", type: "textarea", rows: 3, maxlength: 500, help: "A sentence or two is plenty. Please leave out account numbers and passwords; we'll never ask for them." })}`;
    const step2 = html`
      ${datePicker({ name: "date", label: "Date", timeName: "time", timeLabel: "Video-call time (Pacific)", closed: [0, 6], leadDays: 1, horizon: 30, slots: ["8:30 AM", "9:30 AM", "11:00 AM", "12:30 PM", "2:00 PM", "3:30 PM", "4:30 PM"] })}
      ${field({ id: "zone", label: "Your time zone", type: "select", value: "pacific", options: [{ value: "pacific", label: "Pacific Time" }, { value: "mountain", label: "Mountain Time" }, { value: "central", label: "Central Time" }, { value: "eastern", label: "Eastern Time" }], help: "We'll show the time in your zone in the confirmation." })}`;
    const step3 = html`
      ${field({ id: "first", label: "First name", required: true, autocomplete: "given-name" })}
      ${field({ id: "last", label: "Last name", required: true, autocomplete: "family-name" })}
      ${field({ id: "email", label: "Email", type: "email", required: true, autocomplete: "email", help: "The video-call link goes here." })}
      ${field({ id: "phone", label: "Phone", type: "tel", autocomplete: "tel", inputmode: "tel", help: "Only used if the video link fails." })}
      ${field({ id: "heard", label: "How did you hear about us?", type: "select", placeholder: "Choose one", span: "full", options: ["A friend or family member", "My accountant or lawyer", "A search engine", "A podcast or article", "The first-home workshop at the library", "Somewhere else"] })}
      ${checkbox({ name: "consent", label: "I understand the intro call is free, and that Clearwater may email me about this call.", required: true, error: "Tick the box so we can email you the call details." })}`;
    return html`
<section class="k-section k-section--tight ca-book-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Book an intro call" }])}
  <div class="k-stack" style="--k-gap:var(--space-3)">
    <h1 class="k-h1">Book a free intro call</h1>
    <p class="k-lede">Thirty minutes by video with a planner. Tell us what's on your mind; we'll tell you honestly whether we can help and what it would cost.</p>
  </div>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  ${kitForm({
    id: "intro-form", label: "Intro call request", submitLabel: "Request intro call",
    steps: [{ title: "What's on your mind", body: step1 }, { title: "Pick a time", body: step2 }, { title: "Your details", body: step3 }],
    success: { title: "Intro call request complete", text: "In a live site, a Clearwater planner would confirm your time by email within one business day, with a video-call link and a short list of what's useful to have nearby. The call is free and there's nothing to sign.", next: btn({ label: "Read about our fees", href: ctx.href({ page: "home", hash: "fees" }), variant: "secondary" }) },
  })}
  <aside class="k-stack k-sticky-col" style="--k-gap:var(--space-5)" aria-label="About the intro call">
    ${media(ctx, "video-call", { shape: "facet", hideBrief: true })}
    <div class="ca-callcard">
      <h2 class="k-h4">What the call is</h2>
      <ul class="ca-is" role="list">
        <li>${icon("check", { size: "sm" })}<span>A conversation about your question, at your pace</span></li>
        <li>${icon("check", { size: "sm" })}<span>An honest answer on whether we're the right fit</span></li>
        <li>${icon("check", { size: "sm" })}<span>A rough fee, so there are no surprises later</span></li>
      </ul>
      <h2 class="k-h4">What it isn't</h2>
      <ul class="ca-isnt" role="list">
        <li>${icon("x", { size: "sm" })}<span>A sales pitch for insurance, annuities or funds</span></li>
        <li>${icon("x", { size: "sm" })}<span>A request for account logins or statements</span></li>
      </ul>
    </div>
    ${alertBox({ tone: "info", icon: "info", title: "General information only", text: "Nothing on this site or on the intro call is personal financial advice until we've agreed an engagement in writing.", role: "note" })}
  </aside>
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${hero(ctx)}${statement(ctx)}${services(ctx)}${feeExplainer(ctx)}${process(ctx)}${team(ctx)}${faq(ctx)}`,
};

export default [home, ...content.services.map(servicePage), book];
