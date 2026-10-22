/*! FacetUI Industry Templates · Technology & Software · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, tabs, kitForm, field, choices, filterable, chip, avatar, brandMark } from "../../kit/ui.mjs";
import content from "./content.mjs";

const wfPage = (w) => `workflow-${w.id}`;
const kindLabel = { trigger: "Trigger", action: "Action", condition: "Condition" };

/* ------------------------------------------------------------ pricing math (shared with template.js) */
function estimate(p, runs, annual) {
  const rows = [{ label: `Platform fee, includes ${p.included.toLocaleString("en-US")} runs`, runs: Math.min(runs, p.included), cost: p.base }];
  let from = p.included;
  for (const [to, rate] of p.tiers) {
    if (runs <= from) break;
    const n = Math.min(runs, to) - from;
    rows.push({ label: `Runs ${(from + 1).toLocaleString("en-US")}${to === Infinity ? " and up" : `–${to.toLocaleString("en-US")}`} at $${rate.toFixed(3).replace(/0$/, "")}`, runs: n, cost: n * rate });
    from = to;
  }
  const sub = rows.reduce((s, r) => s + r.cost, 0);
  const total = annual ? sub * (1 - p.annual) : sub;
  return { rows, sub, total, perRun: total / runs };
}
const usd = (n, d = 0) => `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const shortRuns = (n) => (n >= 1000 ? `${n / 1000}k` : String(n));

/* ------------------------------------------------------------ workflow canvas (signature) */
function nodeInner(n, kind, label) {
  return html`<span class="rp-node-icon">${icon(n.icon)}</span>
    <span class="rp-node-body">
      <span class="rp-node-top"><span class="rp-kind">${label || kindLabel[kind]}</span>${n.app ? html`<span class="rp-app">${n.app}</span>` : ""}</span>
      <span class="rp-node-title">${n.title}</span>
      <span class="rp-node-detail">${n.detail}</span>
    </span>
    <span class="rp-node-state" aria-hidden="true">${icon("check", { size: "sm" })}</span>`;
}

function flow(w) {
  return html`<ol class="rp-flow" role="list" aria-label="${w.name} steps">${w.steps.map((s) => {
    if (s.kind !== "branch") return html`<li class="rp-node" data-kind="${s.kind}" data-rp-step>${nodeInner(s, s.kind)}</li>`;
    return html`<li class="rp-branch">
      <div class="rp-node" data-kind="condition" data-rp-step>${nodeInner(s, "condition")}</div>
      <div class="rp-forks">
        <div class="rp-fork" data-path="yes"><span class="rp-fork-label">Yes</span><div class="rp-node" data-kind="action" data-rp-step>${nodeInner(s.yes, "action", "If yes")}</div></div>
        <div class="rp-fork" data-path="no"><span class="rp-fork-label">No</span><div class="rp-node" data-kind="action" data-rp-step data-rp-alt>${nodeInner(s.no, "action", "If no")}</div></div>
      </div>
    </li>`;
  })}</ol>`;
}

function runLog(w) {
  return html`<aside class="rp-log" aria-label="${w.name}: recent runs">
    <div class="rp-log-head"><h3 class="rp-log-title">Recent runs</h3><span class="t-caption text-tertiary"><span class="k-num">${w.runsToday}</span> today</span></div>
    <ul class="rp-log-list" role="list">${w.runs.map((r) => html`<li>
      <span class="rp-log-ref k-num">${r.ref}</span><span class="rp-log-when k-num">${r.when}</span>
      <span class="rp-log-what">${r.what}</span>
      <span class="rp-log-state">${badge(r.state, r.tone, { dot: true })}</span>
    </li>`)}</ul>
  </aside>`;
}

function appPanel(ctx, w, { level = 2, link = true } = {}) {
  const H = `h${level}`;
  return html`<div class="rp-panel" data-rp-panel>
    <div class="rp-panel-head">
      <div class="rp-panel-id">
        ${raw(`<${H} class="rp-panel-title">`)}${w.name}${raw(`</${H}>`)}
        <span class="rp-panel-meta">${badge("Live", "success", { dot: true })}<span>${w.edited}</span></span>
      </div>
      <div class="rp-panel-actions">
        <span class="rp-run-status t-label-sm" aria-live="polite" data-rp-status></span>
        ${link ? btn({ label: "How it works", href: ctx.href({ page: wfPage(w) }), variant: "ghost", size: "sm", className: "rp-hide-xs" }) : ""}
        <button type="button" class="btn btn-secondary btn-sm" data-rp-run>${icon("play")}Run a test<span class="sr-only"> of ${w.name}</span></button>
      </div>
    </div>
    <div class="rp-panel-grid">
      <div class="rp-canvas">${flow(w)}</div>
      ${runLog(w)}
    </div>
  </div>`;
}

function appChrome(ctx, inner, crumb) {
  const { tpl } = ctx;
  return html`<div class="rp-app" data-rp-app>
    <div class="rp-app-bar" aria-hidden="true">
      <span class="rp-app-ws">${brandMark(tpl.brand, { size: 20 })}<span>${tpl.hero.workspace}</span></span>
      <span class="rp-app-crumb">${icon("chevron-right", { size: "sm" })}${crumb}</span>
      <span class="rp-app-search">${icon("search", { size: "sm" })}<span>Search workflows</span><span class="kbd">/</span></span>
      <span class="rp-app-people">${avatar("Dana Kowalski", { size: "sm", tone: 2 })}${avatar("Marcus Bell", { size: "sm", tone: 4 })}${avatar("Lena Fischer", { size: "sm", tone: 1 })}</span>
    </div>
    ${inner}
  </div>`;
}

/* ------------------------------------------------------------------ home */
function hero(ctx) {
  const { tpl } = ctx;
  const app = appChrome(ctx, tabs({ id: "wf", label: "Example workflows", style: "pill", className: "rp-app-tabs", tabs: tpl.workflows.map((w) => ({ id: w.id, label: w.name, icon: w.icon, panel: appPanel(ctx, w) })) }), "Workflows");
  return html`<section class="rp-hero" id="product" aria-labelledby="rp-title">
  <div class="k-wrap">
    <div class="rp-hero-text k-enter">
      <h1 class="k-display" id="rp-title" style="--i:0">${tpl.hero.title}</h1>
      <div class="rp-hero-side" style="--i:1">
        <p class="k-lede">${tpl.hero.lede}</p>
        <div class="k-cluster">${btn({ label: "Book a demo", href: ctx.href({ page: "demo" }), size: "lg" })}${btn({ label: "Estimate your cost", href: "#pricing", variant: "outline", size: "lg" })}</div>
      </div>
    </div>
    <div class="rp-hero-app">
      <p class="rp-hint">${icon("mouse-pointer-click", { size: "sm" })}${tpl.hero.note}</p>
      ${app}
    </div>
  </div>
</section>`;
}

function wordmark(t) {
  return html`<span class="rp-wm rp-wm--${t.wm}">${t.name}</span>`;
}

function integrations(ctx) {
  const { tpl } = ctx;
  const items = tpl.tools.map((t) => html`<div class="rp-tool" data-team="${t.team}">${wordmark(t)}<span class="rp-tool-kind">${t.kind}</span></div>`);
  const controls = html`${chip("All tools", { filter: "team", value: "", pressed: true })}${chip("Finance ops", { filter: "team", value: "finance" })}${chip("People ops", { filter: "team", value: "people" })}${chip("IT", { filter: "team", value: "it" })}`;
  return html`<section class="k-section rp-integrations" id="integrations" aria-labelledby="int-title"><div class="k-wrap">
    <div class="rp-int-head">
      <h2 class="k-h2" id="int-title">Connects to the tools you already run on</h2>
      <p class="k-lede">Accounting, HR, identity, help desk and chat. Each connection uses the narrowest permission the tool allows, and you can see exactly what a step reads and writes.</p>
    </div>
    ${filterable({ id: "int-filter", label: "Filter integrations by team", controls, items, itemsClass: "rp-tool-grid", countLabel: "integrations", empty: { icon: "plug", title: "No integrations for that team yet", text: "Show every tool, or ask us about the one you need during your demo.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Show all tools</button>` } })}
    <p class="t-caption text-tertiary rp-int-note">Tool names are fictional sample data for this template. Anything with an API or webhooks can be connected with a custom step.</p>
  </div></section>`;
}

function teams(ctx) {
  const { tpl } = ctx;
  const t = (id) => tpl.toolById[id];
  return html`<section class="k-section k-surface" id="teams" aria-labelledby="teams-title"><div class="k-wrap">
    ${sectionHead({ title: "Built for the teams that keep the company running", lede: "Start with the process that generates the most follow-up messages. Most teams automate a second one within a month.", id: "teams-title" })}
    ${tabs({ id: "team", label: "Use cases by team", className: "rp-team-tabs", tabs: tpl.teams.map((tm) => ({ id: tm.id, label: tm.name, panel: html`<div class="rp-team">
      <div class="rp-team-intro">
        ${media(ctx, tm.image, { shape: "facet" })}
        <h3 class="k-h3">${tm.line}</h3>
        <p class="t-body-md text-secondary">${tm.text}</p>
      </div>
      <ul class="rp-uses" role="list">${tm.flows.map((f) => html`<li class="rp-use${f.page ? " rp-use--feature" : ""}">
        <div class="rp-use-main">
          <h4 class="rp-use-title">${f.page ? html`<a href="${ctx.href({ page: f.page })}">${f.title}</a>` : f.title}</h4>
          <p class="t-body-sm text-secondary">${f.text}</p>
        </div>
        <span class="rp-path" aria-label="Tools: ${f.path.map((id) => t(id).name.toLowerCase()).join(", then ")}">${f.path.map((id, i) => html`${i ? icon("chevron-right", { size: "sm" }) : ""}<span class="rp-path-step">${t(id).name}</span>`)}</span>
        ${f.page ? html`<span class="rp-use-go">${badge("In the preview above", "brand")}${icon("arrow-up-right", { size: "sm" })}</span>` : html`<span class="rp-use-go">${badge("Template", "outline")}</span>`}
      </li>`)}</ul>
    </div>` })) })}
  </div></section>`;
}

function security(ctx) {
  const { tpl } = ctx; const s = tpl.security;
  return html`<section class="k-section" id="security" aria-labelledby="sec-title"><div class="k-wrap rp-sec">
    <div class="rp-sec-side k-sticky-col">
      <h2 class="k-h2" id="sec-title">Security, in plain language</h2>
      <p class="k-lede">${s.lede}</p>
      <div class="card rp-pack facet"><div class="card-body k-stack" style="--k-gap:var(--space-3)">
        <span class="rp-pack-icon">${icon("folder-lock")}</span>
        <h3 class="k-h5">Security review pack for your IT team</h3>
        <ul class="rp-pack-list" role="list">${s.pack.map((p) => html`<li>${icon("file-text", { size: "sm" })}${p}</li>`)}</ul>
        ${btn({ label: "Request the review pack", href: ctx.href({ page: "demo", query: { topic: "security" } }), variant: "secondary", size: "sm" })}
      </div></div>
    </div>
    <dl class="rp-qa">${s.items.map((it) => html`<div class="rp-qa-item">
      <dt>${icon(it.icon)}<span>${it.q}</span></dt>
      <dd>${it.a}</dd>
    </div>`)}</dl>
  </div></section>`;
}

function pricing(ctx) {
  const { tpl } = ctx; const p = tpl.pricing;
  const e = estimate(p, p.defaultVolume, false);
  const data = { base: p.base, included: p.included, tiers: p.tiers.map(([to, r]) => [to === Infinity ? null : to, r]), annual: p.annual };
  return html`<section class="k-section k-surface rp-pricing" id="pricing" aria-labelledby="price-title"><div class="k-wrap k-split k-split--center" style="--k-split-a:5fr;--k-split-b:7fr">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2" id="price-title">Pay for the runs you use</h2>
      <p class="k-lede">No per-seat pricing, so the controller, every hiring manager and the whole IT team can approve without you counting licenses. Pick a monthly volume to see an illustrative cost.</p>
      <ul class="rp-notes" role="list">${p.notes.map((n) => html`<li>${icon("check", { size: "sm" })}${n}</li>`)}</ul>
    </div>
    <div class="card facet rp-est" data-rp-est>
      <div class="card-body k-stack" style="--k-gap:var(--space-5)">
        <div class="rp-est-row">
          <span class="label" id="est-runs-label">Runs per month</span>
          <div class="segment block rp-seg" role="radiogroup" aria-labelledby="est-runs-label" data-rp-volume>
            ${p.volumes.map((v) => html`<button type="button" role="radio" aria-checked="${v === p.defaultVolume}" tabindex="${v === p.defaultVolume ? 0 : -1}" data-value="${v}" aria-label="${v.toLocaleString("en-US")} runs">${shortRuns(v)}</button>`)}
          </div>
        </div>
        <label class="switch rp-annual"><input type="checkbox" data-rp-annual><span>Billed annually, save ${Math.round(p.annual * 100)}%</span></label>
        <div class="rp-est-out" aria-live="polite" data-rp-out>
          <p class="rp-total"><span class="rp-total-num k-num" data-rp-total>${usd(e.total)}</span><span class="rp-total-unit">per month, illustrative</span></p>
          <div class="rp-bar" aria-hidden="true" data-rp-bar>${e.rows.map((r, i) => html`<span class="rp-bar-seg rp-c${i + 1}" style="--w:${((r.cost / e.sub) * 100).toFixed(2)}%"></span>`)}</div>
          <table class="rp-break"><caption class="sr-only">Cost breakdown</caption><tbody data-rp-rows>${e.rows.map((r, i) => html`<tr><th scope="row"><span class="rp-key rp-c${i + 1}" aria-hidden="true"></span>${r.label}</th><td class="k-num">${usd(r.cost, 2)}</td></tr>`)}</tbody></table>
          <p class="t-body-sm text-secondary" data-rp-per>About <span class="k-num">${usd(e.perRun, 3)}</span> per run.</p>
        </div>
        <div class="rp-est-foot">
          <p class="t-caption text-tertiary">Sample rates for this template, not a quote. A live site would show real pricing.</p>
          ${btn({ label: "Get a quote for your volume", href: ctx.href({ page: "demo" }), size: "sm" })}
        </div>
      </div>
    </div>
    <script type="application/json" id="rp-pricing">${raw(JSON.stringify(data))}</script>
  </div></section>`;
}

function closing(ctx) {
  return html`<section class="k-section rp-close" data-theme="dark" aria-labelledby="close-title"><div class="k-wrap rp-close-inner">
    <div class="k-stack" style="--k-gap:var(--space-4)">
      <h2 class="k-h1" id="close-title">Bring the process you're tired of chasing.</h2>
      <p class="k-lede">In thirty minutes we'll build it with you in a sandbox, connected to the tools you use, and show you what it would cost to run.</p>
    </div>
    <div class="k-cluster">${btn({ label: "Book a demo", href: ctx.href({ page: "demo" }), size: "lg" })}${btn({ label: "Browse the workflows", href: ctx.href({ page: "workflow-invoice-approval" }), variant: "outline", size: "lg" })}</div>
  </div></section>`;
}

/* ------------------------------------------------------------ feature pages */
function workflowPage(w, i, all) {
  return {
    key: wfPage(w), file: `${wfPage(w)}.html`, title: w.name, short: "Workflow", kitbar: i === 0,
    description: `${w.name} with Relaypoint: ${w.summary}`,
    render(ctx) {
      const { tpl } = ctx;
      const others = all.filter((o) => o.id !== w.id);
      return html`
<section class="rp-fhead"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Workflows", href: ctx.href({ page: "home", hash: "product" }) }, { label: w.name }])}
  <nav class="rp-wfnav" aria-label="Workflows">${all.map((o) => html`<a href="${ctx.href({ page: wfPage(o) })}"${o.id === w.id ? raw(' aria-current="page"') : ""}>${icon(o.icon, { size: "sm" })}${o.name}</a>`)}</nav>
  <div class="rp-fhead-grid">
    <div class="k-stack k-enter" style="--k-gap:var(--space-4)">
      <span style="--i:0">${badge(w.team, "brand")}</span>
      <h1 class="k-h1" style="--i:1">${w.name}</h1>
      <p class="k-lede" style="--i:2">${w.lede}</p>
    </div>
    <div class="rp-fhead-side">
      <p class="label">Works with</p>
      <ul class="rp-with" role="list">${w.tools.map((id) => html`<li>${wordmark(tpl.toolById[id])}</li>`)}</ul>
      <div class="k-cluster">${btn({ label: "See it in a demo", href: ctx.href({ page: "demo", query: { workflow: w.id } }) })}${btn({ label: "Estimate cost", href: ctx.href({ page: "home", hash: "pricing" }), variant: "ghost" })}</div>
    </div>
  </div>
</div></section>
<section class="rp-fcanvas" aria-label="${w.name} workflow preview"><div class="k-wrap">
  ${appChrome(ctx, appPanel(ctx, w, { level: 2, link: false }), w.name)}
</div></section>
<section class="k-section" aria-labelledby="walk-title"><div class="k-wrap k-split" style="--k-split-a:7fr;--k-split-b:5fr">
  <div class="k-stack" style="--k-gap:var(--space-8)">
    ${media(ctx, `wf-${w.id}`, { priority: true, shape: "facet" })}
    <h2 class="k-h2" id="walk-title">Step by step</h2>
    <ol class="rp-walk">${w.walkthrough.map(([t, d]) => html`<li><h3>${t}</h3><p>${d}</p></li>`)}</ol>
  </div>
  <aside class="k-sticky-col k-stack" style="--k-gap:var(--space-4)" aria-labelledby="rules-title">
    <div class="card facet rp-rules"><div class="card-body k-stack" style="--k-gap:var(--space-4)">
      <div class="rp-rules-head"><h2 class="k-h4" id="rules-title">Rules you can change</h2>${badge("Version 14", "outline")}</div>
      <dl class="rp-kv">${w.settings.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
      <p class="t-body-sm text-secondary">Every setting is per workflow. Published changes are versioned, so you can compare and roll back.</p>
    </div></div>
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">Want to see it with your rules?</b><p class="t-body-sm text-secondary">We'll set this workflow up in a sandbox during the demo, using your thresholds and approvers.</p>${btn({ label: "Book a demo", href: ctx.href({ page: "demo", query: { workflow: w.id } }), variant: "secondary", size: "sm" })}</div></div>
  </aside>
</div></section>
<section class="k-section k-surface" aria-labelledby="edge-title"><div class="k-wrap">
  ${sectionHead({ title: "When things don't go to plan", lede: "The exceptions are where manual processes break down. These are handled out of the box.", id: "edge-title" })}
  <ul class="rp-edges" role="list">${w.edges.map((e) => { const [head, ...rest] = e.split(": "); return html`<li><span class="rp-edge-icon">${icon("corner-down-right", { size: "sm" })}</span><div><b>${head}</b><p>${rest.join(": ")}</p></div></li>`; })}</ul>
</div></section>
<section class="k-section" aria-labelledby="more-title"><div class="k-wrap">
  ${sectionHead({ title: "Other workflows", id: "more-title" })}
  <ul class="rp-more" role="list">${others.map((o) => html`<li><a class="rp-more-card facet" href="${ctx.href({ page: wfPage(o) })}">
    <span class="rp-more-top">${badge(o.team, "outline")}${icon("arrow-up-right", { className: "rp-more-go" })}</span>
    <span class="rp-more-name">${o.name}</span>
    <span class="t-body-sm text-secondary">${o.summary}</span>
    <span class="rp-mini" aria-hidden="true">${o.steps.map((s, n) => html`${n ? raw('<span class="rp-mini-link"></span>') : ""}<span class="rp-mini-node" data-kind="${s.kind === "branch" ? "condition" : s.kind}">${icon(s.icon, { size: "sm" })}</span>`)}</span>
  </a></li>`)}</ul>
</div></section>`;
    },
  };
}

/* ------------------------------------------------------------ demo request */
const demo = {
  key: "demo", file: "demo.html", title: "Book a demo", short: "Book a demo",
  description: "Book a 30-minute Relaypoint demo built around one of your own workflows.",
  render(ctx) {
    const { tpl } = ctx; const d = tpl.demo;
    const body = html`
      ${field({ id: "name", label: "Full name", required: true, autocomplete: "name", error: "Enter your name." })}
      ${field({ id: "email", label: "Work email", type: "email", required: true, autocomplete: "email", pattern: "(?![^@]*@(gmail|yahoo|hotmail|outlook|icloud|aol)\\.)[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}", help: "We'll set up a sandbox workspace for this address.", error: "Enter your work email, like name@yourcompany.com. Personal addresses can't get a sandbox." })}
      ${field({ id: "company", label: "Company", required: true, autocomplete: "organization", error: "Enter your company name." })}
      ${field({ id: "size", label: "Company size", type: "select", required: true, placeholder: "Choose a range", options: d.sizes, error: "Choose your company size." })}
      ${choices({ name: "teams", legend: "Which teams would use Relaypoint?", type: "checkbox", required: true, cols: 2, span: "full", error: "Choose at least one team.", help: "Choose all that apply.", options: [
        { value: "finance", label: "Finance ops", desc: "Bills, expenses, close", icon: "receipt" },
        { value: "people", label: "People ops", desc: "Onboarding, changes, offboarding", icon: "user-plus" },
        { value: "it", label: "IT", desc: "Access, devices, accounts", icon: "key-round" },
        { value: "other", label: "Another team", desc: "Tell us below", icon: "ellipsis" },
      ] })}
      ${choices({ name: "tools", legend: "Tools you use today", type: "checkbox", style: "buttons", span: "full", help: "Optional. We'll connect these in your sandbox.", options: tpl.tools.map((t) => ({ value: t.id, label: t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase() })) })}
      ${field({ id: "workflow", label: "Workflow to see first", type: "select", placeholder: "No preference", options: [...tpl.workflows.map((w) => ({ value: w.id, label: w.name })), { value: "other", label: "Something else" }] })}
      ${field({ id: "zone", label: "Your time zone", type: "select", required: true, placeholder: "Choose a time zone", options: d.zones, error: "Choose your time zone so we can suggest times." })}
      ${choices({ name: "window", legend: "Preferred time window", required: true, cols: 3, span: "full", error: "Choose a time window for the call.", help: "Weekdays, in your time zone.", options: d.windows })}
      ${field({ id: "notes", label: "Anything we should know?", type: "textarea", rows: 3, maxlength: 600, help: "For example, the process that causes the most follow-ups today." })}
      ${choices({ name: "topic", legend: "Security review", type: "checkbox", span: "full", options: [{ value: "security", label: "Send the security review pack to my IT team", desc: "It arrives with your demo confirmation.", icon: "folder-lock" }] })}`;
    return html`
<section class="k-section k-section--tight rp-demo-head"><div class="k-wrap">
  ${breadcrumb([{ label: "Home", href: ctx.href({ page: "home" }) }, { label: "Book a demo" }])}
  <h1 class="k-h1">Book a demo</h1>
  <p class="k-lede">Thirty minutes with a solutions engineer, built around one of your own processes. You'll leave with a working sandbox.</p>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:7fr;--k-split-b:4fr">
  ${kitForm({ id: "demo-form", label: "Demo request", body, submitLabel: "Request a demo",
    success: { title: "Demo request complete", text: "In a live site, a Relaypoint solutions engineer would email you within one business day with two times in your window, and a sandbox workspace with your chosen tools ready to connect.", next: btn({ label: "Back to the product", href: ctx.href({ page: "home", hash: "product" }), variant: "secondary" }) } })}
  <aside class="k-sticky-col k-stack rp-demo-aside" style="--k-gap:var(--space-5)" aria-labelledby="cover-title">
    ${media(ctx, "demo-call", { shape: "facet" })}
    <h2 class="k-h4" id="cover-title">What we'll cover</h2>
    <ol class="rp-cover">${d.covers.map(([t, x]) => html`<li><b>${t}</b><span>${x}</span></li>`)}</ol>
    <p class="t-body-sm text-secondary">Rather email first? Write to <a class="link" href="mailto:sales@relaypoint.example">sales@relaypoint.example</a> or call <a class="link" href="tel:+15550143380">(555) 014-3380</a>.</p>
  </aside>
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${hero(ctx)}${integrations(ctx)}${teams(ctx)}${security(ctx)}${pricing(ctx)}${closing(ctx)}`,
};

export default [home, ...content.workflows.map(workflowPage), demo];
