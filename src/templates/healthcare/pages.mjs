/*! FacetUI Industry Templates · Healthcare & Medical · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, tabs, accordion, kitForm, field, choices, checkbox, datePicker, filterable, chip, avatar, mapFrame, alertBox } from "../../kit/ui.mjs";

const svcById = (tpl, id) => tpl.services.find((s) => s.id === id);
const locById = (tpl, id) => tpl.locations.find((l) => l.id === id);

/* ------------------------------------------------------------------ home */
function hero(ctx) {
  const { tpl } = ctx;
  const data = { services: tpl.services.map(({ id, name, short, intents, visit }) => ({ id, name, short, intents, visit })), locations: tpl.locations.map(({ id, name, address, services, week }) => ({ id, name, address, services, week })), pages: Object.fromEntries(tpl.services.map((s) => [s.id, ctx.href({ page: `service-${s.id}` })])), book: ctx.href({ page: "book" }) };
  return html`<section class="hl-hero" aria-labelledby="hero-title">
  <div class="k-wrap hl-hero-grid">
    <div class="hl-hero-main k-enter">
      <h1 class="k-display" id="hero-title" style="--i:0">${tpl.hero.title}</h1>
      <p class="k-lede" style="--i:1">${tpl.hero.lede}</p>
      <div class="hl-finder card" style="--i:2" data-hl-finder>
        <fieldset class="k-fieldset hl-intents">
          <legend class="label">What brings you in?</legend>
          <div class="hl-intent-list">${tpl.hero.intents.map((it, i) => html`<label class="hl-intent"><input type="radio" name="intent" value="${it.id}"${i === 0 ? raw(" checked") : ""}>${icon(it.icon, { size: "sm" })}<span>${it.label}</span></label>`)}</div>
        </fieldset>
        <div class="hl-finder-loc">
          <span class="label" id="loc-label">Nearest clinic</span>
          <div class="segment sm" role="radiogroup" aria-labelledby="loc-label" data-hl-loc>
            <button type="button" role="radio" aria-checked="true" data-value="any">Any</button>${tpl.locations.map((l) => html`<button type="button" role="radio" aria-checked="false" tabindex="-1" data-value="${l.id}">${l.name}</button>`)}
          </div>
        </div>
        <div class="hl-result" aria-live="polite" data-hl-result>
          <noscript><p class="t-body-sm">Browse <a class="link" href="#services">all services</a> or <a class="link" href="${ctx.href({ page: "book" })}">request an appointment</a>.</p></noscript>
        </div>
      </div>
      <p class="hl-911" style="--i:3">${icon("siren", { size: "sm" })}${tpl.hero.note}</p>
    </div>
    <div class="hl-hero-media">
      ${media(ctx, "hero", { priority: true })}
      <div class="hl-hero-tag card-elevated facet">
        <span class="hl-hero-tag-icon">${icon("sunrise")}</span>
        <div><b>Sick-visit slots held every morning</b><span>Released at 7:00 AM on weekdays</span></div>
      </div>
    </div>
  </div>
  <script type="application/json" id="hl-data">${raw(JSON.stringify(data).replace(/</g, "\\u003c"))}</script>
</section>`;
}

function tasks(ctx) {
  return html`<section class="hl-tasks" aria-label="Patient tasks"><div class="k-wrap hl-task-grid">
    ${ctx.tpl.tasks.map((t) => html`<a class="item-card" data-variant="transparent" href="#${t.hash}"><span class="item-card-icon brand">${icon(t.icon)}</span><span class="item-card-content"><span class="item-card-title">${t.title}</span><span class="item-card-desc">${t.text}</span></span></a>`)}
  </div></section>`;
}

function services(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section" id="services" aria-labelledby="services-title"><div class="k-wrap k-split hl-services">
    <div class="k-sticky-col k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="services-title">Services under one record</h2>
      <p class="k-lede">Every clinician at Harbor Lane sees the same chart, so a referral from primary care to physical therapy doesn't mean repeating your story.</p>
      <div class="card hl-callout"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">Not sure which service you need?</b><p class="t-body-sm text-secondary">Our nurses answer around the clock and can book you in during the call.</p><a class="btn btn-outline btn-sm" href="tel:+15550104100">${icon("phone")}Call (555) 010-4100</a></div></div>
    </div>
    <ul class="hl-service-list" role="list">${tpl.services.map((s) => html`<li><a class="hl-service" href="${ctx.href({ page: `service-${s.id}` })}">
      <span class="hl-service-icon">${icon(s.icon)}</span>
      <span class="hl-service-body"><span class="hl-service-name">${s.name}</span><span class="hl-service-text">${s.short}</span>
      <span class="k-cluster" style="--k-gap:var(--space-1-5)">${badge(s.ages)}${s.visit.includes("Video") ? badge("Video visits", "info") : ""}</span></span>
      ${icon("arrow-up-right", { className: "hl-service-go" })}
    </a></li>`)}</ul>
  </div></section>`;
}

function locations(ctx) {
  const { tpl } = ctx;
  const pins = tpl.locations.map((l, i) => ({ x: l.pin.x, y: l.pin.y, label: `${l.name} clinic`, icon: "hospital", alt: i > 0, popup: html`${l.address}` }));
  return html`<section class="k-section k-surface" id="locations" aria-labelledby="loc-title"><div class="k-wrap">
    ${sectionHead({ title: "Three clinics, one team", lede: "Each clinic offers primary care. Choose a location to see its hours, services and how to get there.", id: "loc-title" })}
    <div class="hl-loc-grid">
      ${mapFrame({ pins, label: "Map of Harbor Lane clinic locations", height: 420, id: "hlmap", className: "hl-map" })}
      ${tabs({ id: "loc", label: "Clinic locations", tabs: tpl.locations.map((l) => ({ id: l.id, label: l.name, panel: html`
        <div class="hl-loc">
          ${media(ctx, `loc-${l.id}`, { shape: "sm" })}
          <div class="k-stack" style="--k-gap:var(--space-4)">
            <p class="t-body-md">${icon("map-pin", { size: "sm" })} ${l.address}<br>${icon("phone", { size: "sm" })} <a class="link" href="tel:+1${l.phone.replace(/\D/g, "")}">${l.phone}</a></p>
            <table class="hl-hours"><caption class="sr-only">${l.name} opening hours</caption><tbody>${l.hours.map(([d, h]) => html`<tr><th scope="row">${d}</th><td>${h}</td></tr>`)}</tbody></table>
            <p class="t-body-sm text-secondary">${l.transit}</p>
            <div class="k-cluster" style="--k-gap:var(--space-1-5)" aria-label="Services at ${l.name}">${l.services.map((id) => badge(svcById(tpl, id).name, "outline"))}</div>
            ${btn({ label: `Book at ${l.name}`, href: ctx.href({ page: "book", query: { location: l.id } }), variant: "secondary", size: "sm" })}
          </div>
        </div>` })) })}
    </div>
  </div></section>`;
}

function clinicians(ctx) {
  const { tpl } = ctx;
  const items = tpl.clinicians.map((c) => {
    const svc = svcById(tpl, c.service), loc = locById(tpl, c.location);
    const first = c.name.replace(/^Dr\.\s+/, "").split(" ")[0];
    return html`<article class="hl-clinician card" data-service="${c.service}" data-accepting="${c.accepting ? "yes" : "no"}" data-location="${c.location}">
      <div class="card-body k-stack" style="--k-gap:var(--space-3)">
        <div class="row" style="--gap:var(--space-3)">${avatar(c.name)}<div><h3 class="t-label-lg">${c.name}</h3><p class="t-body-sm text-secondary">${c.role}</p></div></div>
        <p class="t-body-sm text-secondary">${icon("map-pin", { size: "sm" })} ${loc.name} · ${icon("languages", { size: "sm" })} ${c.languages}</p>
        <div class="row hl-clinician-foot">${c.accepting ? badge("Accepting new patients", "success", { dot: true }) : badge("Current patients only", "outline")}
        ${c.accepting ? html`<a class="link t-label-sm" href="${ctx.href({ page: "book", query: { service: c.service, location: c.location, clinician: c.name } })}">Book with ${first}<span class="sr-only">, ${svc.name}</span></a>` : ""}</div>
      </div>
    </article>`;
  });
  const controls = html`<div class="k-cluster" role="group" aria-label="Filter by service">${chip("All services", { filter: "service", value: "", pressed: true })}${tpl.services.map((s) => chip(s.name, { filter: "service", value: s.id }))}</div>    <select class="select select-sm hl-loc-filter" data-filter="location" aria-label="Filter by clinic"><option value="">All clinics</option>${tpl.locations.map((l) => html`<option value="${l.id}">${l.name}</option>`)}</select>
    <select class="select select-sm" data-filter="accepting" aria-label="Filter by availability"><option value="">Any availability</option><option value="yes">Accepting new patients</option></select>`;
  return html`<section class="k-section" id="clinicians" aria-labelledby="cl-title"><div class="k-wrap">
    ${sectionHead({ title: "Find a clinician", lede: "Choose someone who fits: by service, clinic or the languages they speak.", id: "cl-title" })}
    ${filterable({ id: "cl-filter", label: "Filter clinicians", controls, items, itemsClass: "k-grid k-grid--4 hl-cl-grid", countLabel: "clinicians", empty: { icon: "user-search", title: "No clinicians match those filters", text: "Try another clinic or service. Every clinic has primary care clinicians accepting new patients.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Clear filters</button>` } })}
  </div></section>`;
}

function insurance(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-surface" id="insurance" aria-labelledby="ins-title"><div class="k-wrap k-split" style="--k-split-a:3fr;--k-split-b:2fr">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="ins-title">Check your insurance</h2>
      <p class="k-lede">We work with most regional plans. Pick yours to see whether Harbor Lane is in network.</p>
      <div class="field hl-ins-field"><label class="label" for="ins-plan">Your insurance plan</label>
        <select class="select" id="ins-plan" data-hl-ins aria-describedby="ins-result"><option value="">Choose a plan</option>${tpl.insurance.plans.map((p) => html`<option${tpl.insurance.outOfNetwork.includes(p) ? raw(' data-out="true"') : ""}>${p}</option>`)}<option value="none">I don't have insurance</option></select>
      </div>
      <div id="ins-result" aria-live="polite" data-hl-ins-result></div>
      <p class="t-caption text-tertiary">Plan names are sample data for this template.</p>
    </div>
    <div class="card facet hl-selfpay"><div class="card-body k-stack" style="--k-gap:var(--space-3)">
      <span class="hl-hero-tag-icon">${icon("wallet")}</span>
      <h3 class="k-h4">Paying without insurance</h3>
      <p class="t-body-md text-secondary">${tpl.insurance.selfPay}</p>
      <button type="button" class="btn btn-outline btn-sm" data-sonner='{"title":"Bill payment opens here","description":"In a live site this links to your billing provider.","type":"info"}'>${icon("receipt")}Pay a bill</button>
    </div></div>
  </div></section>`;
}

function patients(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section" id="patients" aria-labelledby="np-title"><div class="k-wrap k-split">
    <div class="k-stack" style="--k-gap:var(--space-6)">
      <h2 class="k-h2" id="np-title">New to Harbor Lane?</h2>
      <ol class="hl-steps">${tpl.newPatients.map(([t, d]) => html`<li><b>${t}</b><span>${d}</span></li>`)}</ol>
      <div class="k-cluster">${btn({ label: "Request your first visit", href: ctx.href({ page: "book" }) })}<button type="button" class="btn btn-ghost" data-sonner='{"title":"Patient portal","description":"In a live site this opens your patient portal sign-in.","type":"info"}'>${icon("log-in")}Patient portal</button></div>
    </div>
    <div class="k-stack" style="--k-gap:var(--space-4)">
      <h3 class="k-h4">Common questions</h3>
      ${accordion(tpl.faqs, { openFirst: true })}
    </div>
  </div></section>`;
}

/* ------------------------------------------------------------- service page */
function servicePage(svc) {
  return {
    key: `service-${svc.id}`, file: `service-${svc.id}.html`, title: svc.name, short: "Service detail", kitbar: svc.id === "pediatrics",
    description: `${svc.name} at Harbor Lane Health: ${svc.short}`,
    render(ctx) {
      const { tpl } = ctx;
      const locs = tpl.locations.filter((l) => l.services.includes(svc.id));
      const team = tpl.clinicians.filter((c) => c.service === svc.id);
      const others = tpl.services.filter((s) => s.id !== svc.id);
      return html`
<section class="k-section k-section--tight hl-svc-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Services", href: ctx.href({ page: "home", hash: "services" }) }, { label: svc.name }])}
  <div class="k-split k-split--center" style="--k-split-a:5fr;--k-split-b:6fr">
    <div class="k-stack k-enter" style="--k-gap:var(--space-5)">
      <span class="hl-service-icon hl-service-icon--lg" style="--i:0">${icon(svc.icon)}</span>
      <h1 class="k-h1" style="--i:1">${svc.name}</h1>
      <p class="k-lede" style="--i:2">${svc.about}</p>
      <dl class="hl-facts" style="--i:3"><div><dt>Who it's for</dt><dd>${svc.ages}</dd></div><div><dt>Visit types</dt><dd>${svc.visit.join(" or ")}</dd></div><div><dt>Typical length</dt><dd>${svc.length}</dd></div></dl>
    </div>
    ${media(ctx, `svc-${svc.id}`, { priority: true })}
  </div>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  <div class="k-stack" style="--k-gap:var(--space-12)">
    <section aria-labelledby="expect-title" class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h3" id="expect-title">What to expect</h2>
      <ol class="hl-steps hl-steps--timeline">${svc.expect.map(([t, d]) => html`<li><b>${t}</b><span>${d}</span></li>`)}</ol>
    </section>
    <section aria-labelledby="bring-title" class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h3" id="bring-title">What to bring</h2>
      <ul class="hl-checklist">${svc.prepare.map((p) => html`<li>${icon("check")}${p}</li>`)}</ul>
    </section>
    ${team.length ? html`<section aria-labelledby="team-title" class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h3" id="team-title">Your ${svc.name.toLowerCase()} team</h2>
      <ul class="hl-team" role="list">${team.map((c) => html`<li class="item-card" data-variant="outline">${avatar(c.name)}<span class="item-card-content"><span class="item-card-title">${c.name}</span><span class="item-card-desc">${c.role} · ${locById(ctx.tpl, c.location).name}</span></span><span class="item-card-action">${c.accepting ? badge("Accepting", "success", { dot: true }) : badge("Waitlist", "outline")}</span></li>`)}</ul>
    </section>` : ""}
    <section aria-labelledby="faq-title" class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h3" id="faq-title">Questions</h2>
      ${accordion(tpl.faqs)}
    </section>
  </div>
  <aside class="k-sticky-col" aria-label="Book ${svc.name}">
    <div class="card facet hl-book-card"><div class="card-body k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h4">Book ${svc.name.toLowerCase()}</h2>
      <ul class="hl-book-locs" role="list">${locs.map((l) => html`<li><a href="${ctx.href({ page: "book", query: { service: svc.id, location: l.id } })}"><span><b>${l.name}</b><span>${l.hours[0][0]} · ${l.hours[0][1]}</span></span>${icon("chevron-right")}</a></li>`)}</ul>
      ${btn({ label: "Request an appointment", href: ctx.href({ page: "book", query: { service: svc.id } }), block: true })}
      <p class="t-body-xs text-tertiary">Questions first? Call the nurse line on <a class="link" href="tel:+15550104100">(555) 010-4100</a>.</p>
    </div></div>
  </aside>
</div></section>
<section class="k-section k-surface" aria-labelledby="more-title"><div class="k-wrap">
  ${sectionHead({ title: "Other services", id: "more-title", level: 2 })}
  <ul class="k-grid k-grid--3 hl-other" role="list">${others.map((s) => html`<li><a class="item-card" data-variant="outline" href="${ctx.href({ page: `service-${s.id}` })}"><span class="item-card-icon brand">${icon(s.icon)}</span><span class="item-card-content"><span class="item-card-title">${s.name}</span><span class="item-card-desc">${s.ages}</span></span><span class="item-card-action">${icon("chevron-right")}</span></a></li>`)}</ul>
</div></section>`;
    },
  };
}

/* ---------------------------------------------------------------- booking */
const book = {
  key: "book", file: "book.html", title: "Request an appointment", short: "Book a visit",
  description: "Request an appointment at Harbor Lane Health in three short steps.",
  render(ctx) {
    const { tpl } = ctx;
    const step1 = html`
      ${choices({ name: "service", legend: "Service", required: true, cols: 2, error: "Choose the service you need.", span: "full", options: tpl.services.map((s) => ({ value: s.id, label: s.name, desc: s.ages, icon: s.icon })) })}
      ${choices({ name: "location", legend: "Clinic", required: true, cols: 3, error: "Choose a clinic.", span: "full", options: tpl.locations.map((l) => ({ value: l.id, label: l.name, desc: l.address })) })}
      ${choices({ name: "visit", legend: "Visit type", style: "buttons", required: true, error: "Choose in person or video.", options: [{ value: "in-person", label: "In person", checked: true }, { value: "video", label: "Video" }] })}
      ${choices({ name: "returning", legend: "Have you been to Harbor Lane before?", style: "buttons", required: true, error: "Tell us if you're a new patient.", options: [{ value: "no", label: "No, I'm new" }, { value: "yes", label: "Yes" }] })}
      ${field({ id: "clinician", label: "Preferred clinician", placeholder: "No preference", help: "Optional. We'll match you with the first available clinician otherwise." })}`;
    const step2 = html`${datePicker({ name: "date", label: "Date", timeName: "time", timeLabel: "Time", closed: [0], slots: ["8:00 AM", "8:40 AM", "9:20 AM", "10:40 AM", "11:20 AM", "1:00 PM", "2:20 PM", "3:40 PM", "4:20 PM"] })}`;
    const step3 = html`
      ${field({ id: "first", label: "First name", required: true, autocomplete: "given-name" })}
      ${field({ id: "last", label: "Last name", required: true, autocomplete: "family-name" })}
      ${field({ id: "dob", label: "Date of birth", type: "date", required: true, autocomplete: "bday", error: "Enter the patient's date of birth." })}
      ${field({ id: "phone", label: "Mobile number", type: "tel", required: true, autocomplete: "tel", inputmode: "tel", help: "We'll text to confirm your time." })}
      ${field({ id: "email", label: "Email", type: "email", required: true, autocomplete: "email", span: "full" })}
      ${field({ id: "insurance", label: "Insurance", type: "select", placeholder: "Choose a plan", options: [...tpl.insurance.plans, "Self-pay"] })}
      ${field({ id: "reason", label: "Reason for visit", type: "textarea", maxlength: 400, rows: 3, help: "A sentence or two helps us prepare. Don't include anything urgent; call us instead." })}
      ${checkbox({ name: "consent", label: "I agree to be contacted by text or email about this request.", required: true, error: "Tick the box so we can confirm your appointment." })}`;
    return html`
<section class="k-section k-section--tight hl-book-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Request an appointment" }])}
  <h1 class="k-h1">Request an appointment</h1>
  <p class="k-lede">Three short steps. We'll confirm your time by text within two working hours.</p>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  ${kitForm({
    id: "book-form", label: "Appointment request", submitLabel: "Send request",
    steps: [{ title: "Your visit", body: step1 }, { title: "Date and time", body: step2 }, { title: "Your details", body: step3 }],
    success: { title: "Appointment request complete", text: "In a live site, Harbor Lane would now text you to confirm the time and send forms to complete before you arrive.", next: btn({ label: "Back to home", href: ctx.href({ page: "home" }), variant: "secondary" }) },
  })}
  <aside class="k-stack k-sticky-col" style="--k-gap:var(--space-4)" aria-label="Booking help">
    ${alertBox({ tone: "danger", icon: "siren", title: "Is this an emergency?", text: "Call 911 for chest pain, trouble breathing, severe bleeding or signs of stroke.", role: "note" })}
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">Prefer to talk?</b><p class="t-body-sm text-secondary">Our nurses can book you in by phone, any time of day.</p><a class="link t-label-md" href="tel:+15550104100">(555) 010-4100</a></div></div>
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">Changing plans</b><p class="t-body-sm text-secondary">Cancel or move your visit up to 24 hours before at no charge, from the link in your confirmation.</p></div></div>
  </aside>
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${hero(ctx)}${tasks(ctx)}${services(ctx)}${locations(ctx)}${clinicians(ctx)}${insurance(ctx)}${patients(ctx)}`,
};

import content from "./content.mjs";
export default [home, ...content.services.map(servicePage), book];
