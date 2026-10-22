/*! FacetUI Industry Templates · Education & Learning · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, accordion, kitForm, field, choices, checkbox, filterable, chip, avatar, alertBox } from "../../kit/ui.mjs";
import content from "./content.mjs";

/* ---------------------------------------------------------------- helpers */
const DAY_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const DAY_MED = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TRACK = [8, 22]; // the schedule strip shows 8 AM to 10 PM

const subjectOf = (tpl, id) => tpl.subjects.find((s) => s.id === id);
const money = (n) => `$${n.toLocaleString("en-US")}`;
const clock = (h) => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")}`; };
const mer = (h) => (h < 12 ? "AM" : "PM");
const timeRange = (c) => (mer(c.start) === mer(c.end) ? `${clock(c.start)}–${clock(c.end)} ${mer(c.end)}` : `${clock(c.start)} ${mer(c.start)}–${clock(c.end)} ${mer(c.end)}`);
const joinDays = (names) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0]);
export const daysLabel = (c) => joinDays(c.days.map((d) => DAY_MED[d]));
export const scheduleLabel = (c) => `${daysLabel(c)}, ${timeRange(c)}`;
const scheduleSpoken = (c) => `Meets ${joinDays(c.days.map((d) => DAY_LONG[d]))}, ${timeRange(c).replace("–", " to ")}`;

function dayDate(term, offset) {
  const d = new Date(`${term.monday}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}
const fmtDate = (d) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
export function cohortDates(c, term) {
  const first = dayDate(term, c.days[0]);
  const last = dayDate(term, (c.weeks - 1) * 7 + c.days[c.days.length - 1]);
  return { first, last, label: `${fmtDate(first)} – ${fmtDate(last)}`, firstLabel: `${DAY_MED[c.days[0]]}, ${fmtDate(first)}` };
}
const seatsBadge = (n) => (n === 0 ? badge("Waitlist only", "outline") : n <= 5 ? badge(`${n} seats left`, "warning", { dot: true }) : badge(`${n} seats open`, "success", { dot: true }));

/** Signature: a week of seven mini day-tracks (8 AM–10 PM) with the class block placed at its real time. */
function weekStrip(c, { size } = {}) {
  const s = ((c.start - TRACK[0]) / (TRACK[1] - TRACK[0])).toFixed(3);
  const e = ((c.end - TRACK[0]) / (TRACK[1] - TRACK[0])).toFixed(3);
  return html`<div class="${size === "lg" ? "ba-week ba-week--lg" : "ba-week"}">
    <div class="ba-week-days" role="img" aria-label="${scheduleSpoken(c)}">${DAY_SHORT.map((d, i) => {
      const on = c.days.includes(i);
      return html`<span class="${on ? "ba-day is-on" : i > 4 ? "ba-day is-weekend" : "ba-day"}" aria-hidden="true"><span class="ba-day-name">${d}</span><span class="ba-day-track">${on ? html`<span class="ba-slot" style="--s:${s};--e:${e}"></span>` : ""}</span></span>`;
    })}</div>
    <p class="ba-week-label">${icon(c.when === "weekends" ? "sun" : "moon", { size: "sm" })}<span>${scheduleLabel(c)}</span></p>
  </div>`;
}

/* ------------------------------------------------------------------ home */
function courseCard(ctx, c) {
  const { tpl } = ctx;
  const subj = subjectOf(tpl, c.subject);
  const next = tpl.terms.findIndex((t, i) => c.seats[i] > 0);
  const nextTerm = tpl.terms[next];
  return html`<article class="ba-card" data-subject="${c.subject}" data-when="${c.when}" data-format="${c.format.join(" ")}" data-search="${`${c.name} ${c.blurb} ${subj.label} ${c.short}`.toLowerCase()}">
    <div class="ba-card-top"><span class="ba-subj">${icon(subj.icon, { size: "sm" })}${subj.label}</span><span class="ba-level">${c.level}</span></div>
    <h3 class="ba-card-title"><a href="${ctx.href({ page: `course-${c.id}` })}">${c.name}</a></h3>
    <p class="ba-card-blurb">${c.blurb}</p>
    ${weekStrip(c)}
    <dl class="ba-card-facts">
      <div><dt>Length</dt><dd>${c.weeks} ${c.when === "weekends" && c.days.length > 1 ? "weekends" : "weeks"}</dd></div>
      <div><dt>Format</dt><dd>${c.formatLabel}</dd></div>
      <div><dt>Tuition</dt><dd class="k-num">${money(c.tuition)}</dd></div>
    </dl>
    <p class="ba-card-next">${icon("calendar-days", { size: "sm" })}<span>${next === 0 ? "Starts" : "Next open cohort"} ${cohortDates(c, nextTerm).firstLabel}</span>${seatsBadge(c.seats[next])}</p>
  </article>`;
}

function catalog(ctx) {
  const { tpl } = ctx;
  const group = (id, label, chips) => html`<div class="ba-fgroup"><span class="ba-flabel" id="${id}">${label}</span><div class="ba-chips" role="group" aria-labelledby="${id}">${chips}</div></div>`;
  const controls = html`
    <div class="ba-search"><label class="label" for="ba-q">Search courses</label><div class="input-group">${icon("search")}<input class="input" type="search" id="ba-q" data-filter="q" placeholder="Try SQL, trim or Spanish" autocomplete="off"></div></div>
    ${group("f-subject", "Subject", html`${chip("All subjects", { filter: "subject", value: "", pressed: true })}${tpl.subjects.map((s) => chip(s.label, { filter: "subject", value: s.id, icon: s.icon }))}`)}
    ${group("f-when", "When", html`${chip("Any time", { filter: "when", value: "", pressed: true })}${chip("Evenings", { filter: "when", value: "evenings", icon: "moon" })}${chip("Weekends", { filter: "when", value: "weekends", icon: "sun" })}`)}
    ${group("f-format", "Format", html`${chip("Any format", { filter: "format", value: "", pressed: true })}${chip("Online", { filter: "format", value: "online", icon: "monitor" })}${chip("On campus", { filter: "format", value: "campus", icon: "building-2" })}`)}`;
  return html`<section class="ba-hero" id="catalog" aria-labelledby="ba-title"><div class="k-wrap">
    <div class="ba-hero-head k-enter">
      <h1 class="k-display" id="ba-title" style="--i:0">${tpl.hero.title}</h1>
      <div class="ba-hero-aside" style="--i:1">
        <p class="k-lede">${tpl.hero.lede}</p>
        <p class="ba-term-note">${icon("calendar-check", { size: "sm" })}<span><b>Winter term starts January 11.</b> Applications close January 4.</span></p>
      </div>
    </div>
    <div class="ba-catalog">
      ${filterable({ id: "catalog-filter", label: "Filter courses", controls, items: tpl.courses.map((c) => courseCard(ctx, c)), itemsClass: "k-grid k-grid--3 ba-grid", countLabel: "courses",
        empty: { icon: "search-x", title: "No courses match those filters", text: "Try another schedule or format. Every subject has at least one evening course, and new courses are added each term.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Clear filters</button>` } })}
    </div>
  </div></section>`;
}

function timetable(ctx) {
  const { tpl } = ctx;
  const rows = [
    { label: "Evenings", sub: "From 6:00 PM", match: (c) => c.when === "evenings" },
    { label: "Daytime", sub: "Weekends only", match: (c) => c.when === "weekends" },
  ];
  return html`<section class="k-section k-surface" id="week" aria-labelledby="week-title"><div class="k-wrap">
    ${sectionHead({ title: "The week at Brightfield", lede: "Every course meets on the same days and times all term. Find the evenings you already have free, then work backward to a course.", id: "week-title" })}
    <div class="table-wrap ba-tt-wrap"><table class="table ba-tt"><caption class="sr-only">Weekly timetable of all courses</caption>
      <thead><tr><th scope="col"><span class="sr-only">Time of day</span></th>${DAY_LONG.map((d, i) => html`<th scope="col"${i > 4 ? raw(' class="ba-tt-we"') : ""}><span aria-hidden="true">${DAY_MED[i]}</span><span class="sr-only">${d}</span></th>`)}</tr></thead>
      <tbody>${rows.map((r) => html`<tr><th scope="row"><b>${r.label}</b><span>${r.sub}</span></th>${DAY_LONG.map((d, i) => {
        const list = tpl.courses.filter((c) => r.match(c) && c.days.includes(i));
        const cls = i > 4 ? "ba-tt-we" : "";
        if (!list.length) return html`<td class="${cls}"><span class="ba-tt-free">${i === 4 && r.label === "Evenings" ? "Building closed" : "No classes"}</span></td>`;
        return html`<td class="${cls}"><ul class="ba-tt-list" role="list">${list.map((c) => html`<li><a class="ba-tt-item" data-subject="${c.subject}" href="${ctx.href({ page: `course-${c.id}` })}"><b>${c.short}</b><span class="k-num">${timeRange(c)}</span></a></li>`)}</ul></td>`;
      })}</tr>`)}</tbody>
    </table></div>
    <p class="ba-tt-key">${tpl.subjects.map((s) => html`<span class="ba-key" data-subject="${s.id}">${icon(s.icon, { size: "sm" })}${s.label}</span>`)}</p>
  </div></section>`;
}

function term(ctx) {
  return html`<section class="k-section" id="term" aria-labelledby="term-title"><div class="k-wrap">
    ${sectionHead({ title: "How a winter term runs", lede: "Ten to fourteen weeks, one start date for everyone, and a catch-up week built in for the evening you'll inevitably have to miss.", id: "term-title", action: btn({ label: "Apply for winter", href: ctx.href({ page: "enroll", query: { cohort: "winter" } }), variant: "secondary" }) })}
    <ol class="ba-term">${ctx.tpl.term.map(([when, t, d]) => html`<li><span class="ba-term-when">${when}</span><h3 class="ba-term-title">${t}</h3><p>${d}</p></li>`)}</ol>
  </div></section>`;
}

function tuition(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section k-surface" id="tuition" aria-labelledby="tu-title"><div class="k-wrap k-split" style="--k-split-a:7fr;--k-split-b:5fr">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="tu-title">What a course costs</h2>
      <p class="k-lede">One tuition price per course, the same for every cohort. Materials are listed separately and only where a course needs them.</p>
      <div class="table-wrap"><table class="table ba-price"><caption class="sr-only">Tuition and materials by course</caption>
        <thead><tr><th scope="col">Course</th><th scope="col" class="num">Tuition</th><th scope="col" class="num">Materials</th><th scope="col" class="num">Total</th></tr></thead>
        <tbody>${tpl.courses.map((c) => html`<tr><th scope="row"><a class="link" href="${ctx.href({ page: `course-${c.id}` })}">${c.short}</a></th><td class="num">${money(c.tuition)}</td><td class="num">${c.materials ? money(c.materials) : html`<span class="text-tertiary">None</span>`}</td><td class="num"><b>${money(c.tuition + c.materials)}</b></td></tr>`)}</tbody>
      </table></div>
    </div>
    <div class="k-stack" style="--k-gap:var(--space-4)">
      <h3 class="k-h4">Four ways to pay</h3>
      <ul class="ba-pay" role="list">${tpl.payment.map((p) => html`<li><span class="ba-pay-icon">${icon(p.icon)}</span><span><b>${p.label}</b><span>${p.text}</span></span></li>`)}</ul>
      <p class="t-body-sm text-secondary">You choose a payment option on the application. Nothing is charged until an advisor confirms your seat.</p>
    </div>
  </div></section>`;
}

function instructors(ctx) {
  const { tpl } = ctx;
  return html`<section class="k-section" id="instructors" aria-labelledby="in-title"><div class="k-wrap">
    ${sectionHead({ title: "Taught by people who do the work", lede: "Every instructor practices what they teach during the day and teaches at Brightfield in the evening or on weekends.", id: "in-title" })}
    <ul class="ba-people" role="list">${tpl.courses.map((c) => html`<li class="ba-person">
      ${avatar(c.instructor.name, { size: "lg" })}
      <div class="ba-person-body"><h3 class="ba-person-name">${c.instructor.name}</h3><p class="t-body-sm text-secondary">${c.instructor.role}</p>
      <a class="link t-label-sm" href="${ctx.href({ page: `course-${c.id}`, hash: "instructor" })}">Teaches ${c.short}</a></div>
    </li>`)}</ul>
  </div></section>`;
}

function campus(ctx) {
  const { tpl } = ctx; const cp = tpl.campus;
  return html`<section class="k-section k-surface" id="campus" aria-labelledby="cp-title"><div class="k-wrap ba-campus">
    <div class="ba-campus-media">
      ${media(ctx, "evening", { shape: "facet" })}
      ${media(ctx, "workshop", { shape: "sm" })}
    </div>
    <div class="k-stack ba-campus-text" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="cp-title">${cp.name}</h2>
      <p class="k-lede">Three floors of a former foundry, open in the evenings and at weekends when you're actually free.</p>
      <p class="t-body-md">${icon("map-pin", { size: "sm" })} ${cp.address}</p>
      <dl class="ba-floors">${cp.floors.map(([f, d]) => html`<div><dt>${f}</dt><dd>${d}</dd></div>`)}</dl>
      <table class="ba-hours"><caption class="t-label-md">Front desk hours</caption><tbody>${cp.hours.map(([d, h]) => html`<tr><th scope="row">${d}</th><td>${h}</td></tr>`)}</tbody></table>
      <p class="t-body-sm text-secondary">${cp.transit}</p>
    </div>
  </div></section>`;
}

function faq(ctx) {
  return html`<section class="k-section" id="faq" aria-labelledby="faq-title"><div class="k-wrap k-split" style="--k-split-a:4fr;--k-split-b:7fr">
    <div class="k-stack k-sticky-col" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="faq-title">Questions before you apply</h2>
      <div class="card facet ba-advisor"><div class="card-body k-stack" style="--k-gap:var(--space-3)">
        <b class="t-label-lg">Not sure which course fits?</b>
        <p class="t-body-sm text-secondary">An advisor can talk through your goals and your week, usually in about fifteen minutes. Advising is free and you don't need to have applied.</p>
        <div class="k-cluster" style="--k-gap:var(--space-2)"><a class="btn btn-sm" href="tel:+15550142200">${icon("phone")}(555) 014-2200</a><button type="button" class="btn btn-outline btn-sm" data-sonner='{"title":"Advising call requested","description":"Demo only: a live site would ask for a time and send a calendar invite.","type":"info"}'>${icon("calendar-clock")}Book a call</button></div>
      </div></div>
    </div>
    ${accordion(ctx.tpl.faqs, { openFirst: true })}
  </div></section>`;
}

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${catalog(ctx)}${timetable(ctx)}${term(ctx)}${tuition(ctx)}${instructors(ctx)}${campus(ctx)}${faq(ctx)}`,
};

/* ------------------------------------------------------------- course page */
function coursePage(c, idx) {
  return {
    key: `course-${c.id}`, file: `course-${c.id}.html`, title: c.name, short: "Course", kitbar: idx === 0,
    description: `${c.name} at Brightfield Academy: ${c.blurb}`,
    render(ctx) {
      const { tpl } = ctx;
      const subj = subjectOf(tpl, c.subject);
      const next = Math.max(0, tpl.terms.findIndex((t, i) => c.seats[i] > 0));
      const others = tpl.courses.filter((o) => o.id !== c.id);
      const cohorts = tpl.terms.map((t, i) => ({ t, seats: c.seats[i], dates: cohortDates(c, t) }));
      return html`
<section class="ba-course-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Courses", href: ctx.href({ page: "home", hash: "catalog" }) }, { label: subj.label, href: ctx.href({ page: "home", query: { subject: subj.id }, hash: "catalog" }) }, { label: c.short }])}
  <div class="ba-course-grid">
    <div class="k-stack k-enter" style="--k-gap:var(--space-5)">
      <div class="k-cluster" style="--i:0;--k-gap:var(--space-2)"><span class="ba-subj">${icon(subj.icon, { size: "sm" })}${subj.label}</span>${badge(c.level, "outline")}</div>
      <h1 class="k-h1" style="--i:1">${c.name}</h1>
      <p class="k-lede" style="--i:2">${c.about}</p>
      <div style="--i:3">${weekStrip(c, { size: "lg" })}</div>
      <dl class="ba-facts" style="--i:4">
        <div><dt>Length</dt><dd>${c.weeks} ${c.days.length > 1 && c.when === "weekends" ? "weekends" : "weeks"}</dd></div>
        <div><dt>Format</dt><dd>${c.formatLabel}</dd></div>
        <div><dt>Tuition</dt><dd class="k-num">${money(c.tuition)}</dd></div>
        <div><dt>Next start</dt><dd>${cohorts[next].dates.firstLabel}</dd></div>
      </dl>
    </div>
    ${media(ctx, `course-${c.id}`, { priority: true })}
  </div>
</div></section>
<section class="k-section"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  <div class="k-stack" style="--k-gap:var(--space-12)">
    <section class="k-stack" style="--k-gap:var(--space-4)" aria-labelledby="out-title">
      <h2 class="k-h3" id="out-title">By the last session you'll be able to</h2>
      <ul class="ba-outcomes">${c.outcomes.map((o) => html`<li>${icon("check")}<span>${o}</span></li>`)}</ul>
    </section>
    <section class="k-stack" style="--k-gap:var(--space-4)" aria-labelledby="syl-title" id="syllabus">
      <h2 class="k-h3" id="syl-title">Syllabus</h2>
      ${accordion(c.syllabus.map(([w, t, d]) => ({ title: html`<span class="ba-syl-sum"><span class="ba-syl-when">${w}</span><span>${t}</span></span>`, body: html`<p class="t-body-md text-secondary">${d}</p>` })), { openFirst: true, className: "ba-syllabus" })}
      <p class="ba-needs">${icon("backpack", { size: "sm" })}<span><b>What you'll need.</b> ${c.needs}</span></p>
    </section>
    <section class="k-stack" style="--k-gap:var(--space-4)" aria-labelledby="ins-title" id="instructor">
      <h2 class="k-h3" id="ins-title">Your instructor</h2>
      <div class="ba-instructor facet">${avatar(c.instructor.name, { size: "lg" })}<div class="k-stack" style="--k-gap:var(--space-1-5)"><b class="t-heading-h4">${c.instructor.name}</b><span class="t-label-md text-secondary">${c.instructor.role}</span><p class="t-body-md">${c.instructor.bio}</p></div></div>
    </section>
    <section class="k-stack" style="--k-gap:var(--space-4)" aria-labelledby="co-title" id="cohorts">
      <h2 class="k-h3" id="co-title">Cohort start dates</h2>
      <div class="table-wrap"><table class="table ba-cohorts"><caption class="sr-only">Upcoming cohorts for ${c.name}</caption>
        <thead><tr><th scope="col">Term</th><th scope="col">Dates</th><th scope="col">Apply by</th><th scope="col">Seats</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead>
        <tbody>${cohorts.map(({ t, seats, dates }) => html`<tr><th scope="row">${t.label}</th><td class="k-num">${dates.label}, 2027</td><td>${t.closes}</td><td>${seatsBadge(seats)}</td><td>${seats ? html`<a class="link t-label-md" href="${ctx.href({ page: "enroll", query: { course: c.id, cohort: t.id } })}">Apply<span class="sr-only"> for ${t.label}</span></a>` : html`<button type="button" class="btn btn-ghost btn-sm" data-sonner='{"title":"Added to the waitlist","description":"Demo only: a live site would email you if a seat opens.","type":"info"}'>Join waitlist<span class="sr-only"> for ${t.label}</span></button>`}</td></tr>`)}</tbody>
      </table></div>
      <p class="t-body-sm text-secondary">Every cohort meets ${scheduleLabel(c)}.${c.format.length > 1 ? " Choose campus or online each week." : ""}</p>
    </section>
  </div>
  <aside class="k-sticky-col" aria-label="Cost and enrollment">
    <div class="card facet ba-cost"><div class="card-body k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h4">Cost</h2>
      <table class="ba-cost-table"><caption class="sr-only">Cost of ${c.name}</caption><tbody>
        <tr><th scope="row">Tuition</th><td class="k-num">${money(c.tuition)}</td></tr>
        <tr><th scope="row">Materials</th><td class="k-num">${c.materials ? money(c.materials) : "None"}</td></tr>
        <tr class="ba-cost-total"><th scope="row">Total</th><td class="k-num">${money(c.tuition + c.materials)}</td></tr>
      </tbody></table>
      <p class="t-body-sm text-secondary">Or three payments of <b class="k-num">${money(Math.ceil((c.tuition + c.materials) / 3))}</b>, no interest. Employer invoicing and reduced tuition are also available.</p>
      ${btn({ label: `Apply for ${tpl.terms[next].label.toLowerCase()}`, href: ctx.href({ page: "enroll", query: { course: c.id, cohort: tpl.terms[next].id } }), block: true })}
      <a class="link t-label-md" href="${ctx.href({ page: "home", hash: "faq" })}">Talk to an advisor first</a>
    </div></div>
  </aside>
</div></section>
<section class="k-section k-surface" aria-labelledby="more-title"><div class="k-wrap">
  ${sectionHead({ title: "Fits alongside this course", lede: "Courses that meet on different days, if you want to take two in one term.", id: "more-title" })}
  <ul class="ba-more" role="list">${others.filter((o) => !o.days.some((d) => c.days.includes(d))).concat(others.filter((o) => o.days.some((d) => c.days.includes(d)))).slice(0, 3).map((o) => html`<li><a class="ba-more-item" href="${ctx.href({ page: `course-${o.id}` })}"><span class="ba-more-name">${o.name}</span>${weekStrip(o)}</a></li>`)}</ul>
</div></section>`;
    },
  };
}

/* ---------------------------------------------------------------- enroll */
const enroll = {
  key: "enroll", file: "enroll.html", title: "Apply to enroll", short: "Apply",
  description: "Apply to enroll in a Brightfield Academy course: choose a course and cohort, tell us about yourself and pick a payment option.",
  render(ctx) {
    const { tpl } = ctx;
    const first = tpl.courses[0];
    const total = first.tuition + first.materials;
    const data = {
      terms: tpl.terms.map((t) => ({ id: t.id, label: t.label })),
      courses: Object.fromEntries(tpl.courses.map((c) => [c.id, { name: c.name, schedule: scheduleLabel(c), format: c.formatLabel, tuition: c.tuition, materials: c.materials, cohorts: Object.fromEntries(tpl.terms.map((t, i) => [t.id, { dates: `${cohortDates(c, t).label}, 2027`, seats: c.seats[i] }])) }])),
    };
    const payPrice = { full: money(Math.round(first.tuition * 0.95) + first.materials), monthly: `3 × ${money(Math.ceil(total / 3))}`, employer: money(total), reduction: "Varies" };
    const s1 = html`
      ${choices({ name: "course", legend: "Course", required: true, cols: 2, span: "full", error: "Choose the course you'd like to take.", options: tpl.courses.map((c) => ({ value: c.id, label: c.name, desc: `${scheduleLabel(c)}. ${c.formatLabel}.`, icon: subjectOf(tpl, c.subject).icon })) })}
      ${choices({ name: "cohort", legend: "Cohort", required: true, cols: 3, span: "full", error: "Choose which term you'd like to start.", help: "Seats are held in the order applications arrive.", options: tpl.terms.map((t) => ({ value: t.id, label: t.label, desc: `Starts the week of ${MONTHS_LONG[dayDate(t, 0).getUTCMonth()]} ${dayDate(t, 0).getUTCDate()}. Apply by ${t.closes}.` })) })}
      ${choices({ name: "attend", legend: "How will you attend?", style: "buttons", required: true, span: "full", error: "Tell us whether you'll attend on campus or online.", help: "Only Python for everyday automation offers both. For other courses, choose the format listed.", options: [{ value: "campus", label: "On campus" }, { value: "online", label: "Online" }] })}`;
    const s2 = html`
      ${field({ id: "first", label: "First name", required: true, autocomplete: "given-name", error: "Enter your first name." })}
      ${field({ id: "last", label: "Last name", required: true, autocomplete: "family-name", error: "Enter your last name." })}
      ${field({ id: "email", label: "Email", type: "email", required: true, autocomplete: "email", help: "Your advisor and instructor will write to you here.", error: "Enter an email address like name@example.com." })}
      ${field({ id: "phone", label: "Phone", type: "tel", required: true, autocomplete: "tel", inputmode: "tel", help: "For your 15-minute advising call.", error: "Enter a phone number we can call." })}
      ${field({ id: "work", label: "Current job or field", placeholder: "For example, warehouse supervisor", span: "full", help: "Helps your instructor pick examples that fit the class." })}
      ${choices({ name: "experience", legend: "Experience with this subject", style: "buttons", required: true, span: "full", error: "Tell us how much experience you have.", options: [{ value: "none", label: "Brand new" }, { value: "some", label: "I've tried it a little" }, { value: "regular", label: "I use it at work" }] })}
      ${field({ id: "goal", label: "What would you like to be able to do afterward?", type: "textarea", rows: 3, maxlength: 400, span: "full", help: "A sentence is plenty." })}`;
    const s3 = html`
      ${choices({ name: "payment", legend: "Payment option", required: true, cols: 2, span: "full", error: "Choose how you'd like to pay.", help: "Prices update for the course you chose.", options: tpl.payment.map((p) => ({ value: p.id, label: p.label, desc: p.text, icon: p.icon, price: payPrice[p.id] })) })}
      ${field({ id: "employer", label: "Employer name", placeholder: "Only if we're invoicing your employer", autocomplete: "organization", span: "full" })}
      <div class="k-span-full">${alertBox({ tone: "info", icon: "info", title: "Nothing is charged here", text: "This step records your preference only. On a live site, payment would be arranged after an advisor confirms your seat.", role: "note" })}</div>`;
    const s4 = html`
      ${checkbox({ name: "attendance", label: "I understand I need to attend at least 80% of sessions to receive a certificate of completion.", required: true, error: "Confirm the attendance requirement to continue." })}
      ${checkbox({ name: "refunds", label: "I've read the refund policy: full refund before the second session, pro rata until the halfway point.", required: true, error: "Confirm you've read the refund policy." })}
      ${checkbox({ name: "contact", label: "Brightfield may contact me by email and phone about this application.", required: true, error: "We need permission to contact you about your application." })}
      ${checkbox({ name: "updates", label: "Send me the course catalog when each new term is announced." })}`;
    return html`
<section class="k-section k-section--tight ba-enroll-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Apply to enroll" }])}
  <h1 class="k-h1">Apply to enroll</h1>
  <p class="k-lede">Four short steps, about ten minutes. Applying doesn't commit you to pay; an advisor confirms your seat first.</p>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  ${kitForm({
    id: "enroll-form", label: "Enrollment application", submitLabel: "Send application",
    steps: [{ title: "Course and cohort", body: s1 }, { title: "About you", body: s2 }, { title: "Payment option", body: s3 }, { title: "Consent", body: s4 }],
    success: { title: "Enrollment application complete", text: "On a live site, an advisor from Brightfield would email you within two working days to schedule your advising call and hold your seat. Payment would only be arranged after your seat is confirmed.", next: btn({ label: "Back to the catalog", href: ctx.href({ page: "home", hash: "catalog" }), variant: "secondary" }) },
    error: { title: "We couldn't send your application", text: "This demo simulated a network failure. Your answers are still here, so try again." },
  })}
  <aside class="k-stack k-sticky-col" style="--k-gap:var(--space-4)" aria-label="Your application">
    <div class="card facet ba-summary" data-ba-summary><div class="card-body k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h4">Your choice so far</h2>
      <div class="ba-summary-body" aria-live="polite" data-ba-summary-body><p class="t-body-sm text-secondary">Choose a course to see its schedule, dates and cost here.</p></div>
      ${tpl.courses.map((c) => html`<template data-ba-strip="${c.id}">${weekStrip(c)}</template>`)}
    </div></div>
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">What happens next</b>
      <ol class="ba-next"><li>An advisor emails you within two working days.</li><li>A 15-minute call to confirm the course fits.</li><li>Your seat is held and payment is arranged.</li></ol>
    </div></div>
  </aside>
</div></section>
<script type="application/json" id="ba-data">${raw(JSON.stringify(data).replace(/</g, "\\u003c"))}</script>`;
  },
};

export default [home, ...content.courses.map(coursePage), enroll];
