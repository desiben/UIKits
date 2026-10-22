/*! FacetUI Industry Templates · Gaming & Esports · © 2026 ETKits. */
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, tabs, accordion, kitForm, field, choices, checkbox, filterable, chip, emptyState, avatar } from "../../kit/ui.mjs";
import content from "./content.mjs";

const team = (tpl, id) => tpl.teams.find((t) => t.id === id);
const game = (tpl, id) => tpl.games.find((g) => g.id === id);
const mark = (t, size = "") => html`<span class="nf-mark nf-c${t.color} ${size}" aria-hidden="true">${t.tag}</span>`;
const statusTone = { open: "success", live: "danger", soon: "outline" };

/* ---------------------------------------------------------------- bracket */
function bracket(tpl, { compact } = {}) {
  const b = tpl.bracket;
  return html`<div class="${compact ? "nf-bracket nf-bracket--compact" : "nf-bracket"}" role="list" aria-label="Playoff bracket" data-kit-scroll data-label="Playoff bracket">
    ${b.rounds.map((r, ri) => html`<div class="nf-round" role="listitem"><h3 class="nf-round-title">${r}</h3><ol class="nf-round-matches" role="list">
      ${b.matches[ri].map(([a, sa, bb, sb, state]) => {
        if (state === "tbd") return html`<li class="nf-match nf-match--tbd"><span class="nf-row"><span class="nf-tbd">Winner, semifinal 1</span></span><span class="nf-row"><span class="nf-tbd">Winner, semifinal 2</span></span><span class="nf-match-state">Sat 8:00 PM</span></li>`;
        const ta = team(tpl, a), tb = team(tpl, bb);
        const done = !state;
        const win = done ? (sa > sb ? "a" : "b") : null;
        return html`<li class="${`nf-match${state === "live" ? " nf-match--live" : ""}`}">
          <span class="nf-row${win === "a" ? " nf-win" : ""}">${mark(ta, "sm")}<span class="nf-team">${ta.name}</span><span class="nf-score k-num">${sa ?? "–"}</span></span>
          <span class="nf-row${win === "b" ? " nf-win" : ""}">${mark(tb, "sm")}<span class="nf-team">${tb.name}</span><span class="nf-score k-num">${sb ?? "–"}</span></span>
          ${state === "live" ? html`<span class="nf-match-state">${badge("Live", "danger", { dot: true })}</span>` : state === "next" ? html`<span class="nf-match-state">Tonight 7:30 PM</span>` : html`<span class="sr-only">${win === "a" ? ta.name : tb.name} won ${Math.max(sa, sb)} to ${Math.min(sa, sb)}</span>`}
        </li>`;
      })}
    </ol></div>`)}
  </div>`;
}

/* ------------------------------------------------------------------ home */
function live(ctx) {
  const { tpl } = ctx; const L = tpl.live;
  const A = team(tpl, L.a), B = team(tpl, L.b);
  return html`<section class="nf-hero" id="live" aria-labelledby="nf-title"><div class="k-wrap">
    <div class="nf-hero-head k-enter">
      <h1 class="k-display" id="nf-title" style="--i:0">Compete in the open.</h1>
      <p class="k-lede" style="--i:1">Weekly cups and leagues for amateur and semi-pro teams, with real brackets, real admins and prize pools paid on time.</p>
      <div class="k-cluster" style="--i:2">${btn({ label: "Register a team", href: ctx.href({ page: "register" }), size: "lg" })}${btn({ label: "Browse tournaments", href: "#tournaments", variant: "outline", size: "lg" })}</div>
    </div>
    <div class="nf-broadcast-grid">
      <article class="nf-broadcast" aria-labelledby="live-title">
        ${media(ctx, "live", { shape: "facet", priority: true, hideBrief: true })}
        <div class="nf-scorebar" data-nf-live>
          <div class="nf-scorebar-top"><span class="badge badge-danger"><span class="dot"></span>Live</span><h2 class="nf-event" id="live-title">${L.event}</h2><span class="nf-viewers">${icon("eye", { size: "sm" })}<span class="k-num">${L.viewers}</span><span class="sr-only">watching</span></span></div>
          <div class="nf-versus">
            <div class="nf-side">${mark(A, "lg")}<span class="nf-side-name">${A.name}</span><span class="nf-series k-num" aria-label="${A.name} has won ${L.seriesScore[0]} games">${L.seriesScore[0]}</span></div>
            <div class="nf-center"><span class="nf-big k-num"><span data-nf-a>${L.score[0]}</span><span aria-hidden="true">:</span><span data-nf-b>${L.score[1]}</span></span><span class="nf-map">${L.map} · <span class="k-num" data-nf-clock>${L.clock}</span></span></div>
            <div class="nf-side nf-side--b"><span class="nf-series k-num" aria-label="${B.name} has won ${L.seriesScore[1]} games">${L.seriesScore[1]}</span><span class="nf-side-name">${B.name}</span>${mark(B, "lg")}</div>
          </div>
          <div class="nf-scorebar-foot"><button type="button" class="btn btn-sm" data-sonner='{"title":"Stream opens here","description":"In a live site this opens the broadcast player.","type":"info"}'>${icon("play")}Watch stream</button><button type="button" class="btn btn-ghost btn-sm" data-nf-pause>${icon("pause")}Pause live updates</button><span class="t-caption text-tertiary">Round scores are simulated for this template.</span></div>
        </div>
      </article>
      <aside class="nf-rail card" aria-labelledby="sched-title">
        <div class="card-header"><h2 class="card-title" id="sched-title">Today and this week</h2></div>
        <ol class="nf-sched" role="list">${tpl.schedule.map((s) => { const a = team(tpl, s.a), b = team(tpl, s.b); return html`<li>
          <span class="nf-sched-time k-num">${s.time}</span>
          <span class="nf-sched-teams">${mark(a, "sm")}<span>${a.name}</span><span class="text-tertiary">vs</span>${mark(b, "sm")}<span>${b.name}</span></span>
          <span class="nf-sched-event">${s.event}</span>
          <button type="button" class="btn btn-ghost btn-sm icon-btn" aria-label="Remind me: ${a.name} vs ${b.name}" data-sonner='{"title":"Reminder set","description":"Demo only: in a live site you'd get a notification 10 minutes before.","type":"success"}'>${icon("bell")}</button>
        </li>`; })}</ol>
      </aside>
    </div>
  </div></section>`;
}

function tourneyCard(ctx, t) {
  const g = game(ctx.tpl, t.game);
  const pct = Math.round((t.filled / t.slots) * 100);
  return html`<article class="nf-tcard card" data-game="${t.game}" data-status="${t.status}">
    ${media(ctx, `game-${t.game}`, { ratio: "16/9", shape: "none", hideBrief: true })}
    <div class="card-body k-stack" style="--k-gap:var(--space-3)">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:var(--space-2)">${badge(t.statusLabel, statusTone[t.status], { dot: t.status !== "soon" })}<span class="t-label-sm text-tertiary">${g.name}</span></div>
      <h3 class="nf-tcard-title"><a href="${ctx.href({ page: `tournament-${t.id}` })}">${t.name}</a></h3>
      <dl class="nf-tfacts"><div><dt>Dates</dt><dd>${t.dates}</dd></div><div><dt>Prize pool</dt><dd>${t.prize}</dd></div><div><dt>Entry</dt><dd>${t.entry}</dd></div></dl>
      <div class="nf-slots"><div class="row" style="justify-content:space-between"><span class="t-label-sm">Teams</span><span class="t-label-sm k-num">${t.filled} of ${t.slots}</span></div><div class="progress" role="progressbar" aria-label="${t.name} teams registered" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="--value:${pct}%"></span></div></div>
    </div>
  </article>`;
}

function tournamentsSection(ctx) {
  const { tpl } = ctx;
  const controls = html`${chip("All games", { filter: "game", value: "", pressed: true })}${tpl.games.map((g) => chip(g.name, { filter: "game", value: g.id }))}<select class="select select-sm nf-status-filter" data-filter="status" aria-label="Filter by status"><option value="">Any status</option><option value="open">Registration open</option><option value="live">Live now</option><option value="soon">Opening soon</option></select>`;
  return html`<section class="k-section" id="tournaments" aria-labelledby="t-title"><div class="k-wrap">
    ${sectionHead({ title: "Tournaments", lede: "Pick a game, check the format and lock in a slot before they fill.", id: "t-title" })}
    ${filterable({ id: "t-filter", label: "Filter tournaments", controls, items: tpl.tournaments.map((t) => tourneyCard(ctx, t)), itemsClass: "k-grid k-grid--4 nf-tgrid", countLabel: "tournaments", empty: { icon: "trophy", title: "No tournaments match", text: "There's nothing in that game with that status right now. New cups are announced every Monday.", action: html`<button type="button" class="btn btn-outline btn-sm" data-kit-clear>Show all tournaments</button>` } })}
  </div></section>`;
}

function standings(ctx) {
  const { tpl } = ctx;
  const trend = { up: ["trending-up", "Up"], down: ["trending-down", "Down"], flat: ["minus", "No change"] };
  return html`<section class="k-section nf-tables" id="standings" aria-labelledby="st-title"><div class="k-wrap nf-tables-grid">
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)"><h2 class="k-h2" id="st-title">Night League standings</h2><a class="link t-label-md" href="${ctx.href({ page: "tournament-hollowstar-night-league" })}">League page</a></div>
      <div class="table-wrap"><table class="table nf-table"><caption class="sr-only">Hollowstar Night League regular season standings</caption>
        <thead><tr><th scope="col" class="num">#</th><th scope="col">Team</th><th scope="col" class="num">W</th><th scope="col" class="num">L</th><th scope="col" class="num">Diff</th><th scope="col" class="num">Pts</th><th scope="col"><span class="sr-only">Trend</span></th></tr></thead>
        <tbody>${tpl.standings.map((s, i) => { const t = team(tpl, s.team); return html`<tr${i < 8 && i < 4 ? raw(' class="nf-qual"') : ""}><td class="num">${i + 1}</td><th scope="row"><span class="nf-tteam">${mark(t, "sm")}${t.name}</span></th><td class="num">${s.w}</td><td class="num">${s.l}</td><td class="num">${s.diff}</td><td class="num"><b>${s.pts}</b></td><td>${icon(trend[s.trend][0], { size: "sm", label: trend[s.trend][1] })}</td></tr>`; })}</tbody>
      </table></div>
      <p class="t-caption text-tertiary">Top four take upper-bracket seeds in the playoffs.</p>
    </div>
    <div class="k-stack" style="--k-gap:var(--space-5)">
      <h2 class="k-h2">Playoffs</h2>
      ${bracket(tpl, { compact: true })}
    </div>
  </div></section>`;
}

function roster(ctx) {
  return html`<section class="k-section" id="roster" aria-labelledby="ro-title"><div class="k-wrap">
    ${sectionHead({ title: "Nightforge pro roster", lede: "Our own players compete across three games and stream community coaching nights every Thursday.", id: "ro-title" })}
    <ul class="nf-roster" role="list">${ctx.tpl.roster.map((p) => html`<li class="nf-player card">${avatar(p.name, { size: "lg" })}<span class="nf-handle">${p.handle}</span><span class="t-body-sm text-secondary">${p.name}</span><span class="t-label-sm">${p.role}</span><span class="t-caption text-tertiary">${p.country}</span></li>`)}</ul>
  </div></section>`;
}

function how(ctx) {
  return html`<section class="k-section nf-how" id="how" aria-labelledby="how-title"><div class="k-wrap">
    ${sectionHead({ title: "How tournaments work", id: "how-title", action: btn({ label: "Register a team", href: ctx.href({ page: "register" }), iconEnd: "arrow-right" }) })}
    <ol class="nf-steps">${ctx.tpl.how.map(([t, d]) => html`<li><h3>${t}</h3><p>${d}</p></li>`)}</ol>
  </div></section>`;
}

/* ---------------------------------------------------------- tournament page */
function tournamentPage(t, i) {
  return {
    key: `tournament-${t.id}`, file: `tournament-${t.id}.html`, title: t.name, short: "Tournament", kitbar: i === 0,
    description: `${t.name}: ${t.format}. ${t.prize} prize pool. ${t.statusLabel}.`,
    render(ctx) {
      const { tpl } = ctx; const g = game(tpl, t.game);
      const reg = t.status === "open"
        ? btn({ label: "Register a team", href: ctx.href({ page: "register", query: { tournament: t.id } }), size: "lg", block: true })
        : t.status === "live" ? html`<p class="t-body-sm text-secondary">Registration closed. The league is in its playoffs.</p>${btn({ label: "Watch live", href: ctx.href({ page: "home", hash: "live" }), variant: "outline", block: true })}`
        : html`<button type="button" class="btn btn-lg btn-block" disabled>Registration opens Nov 30</button><button type="button" class="btn btn-ghost btn-block" data-sonner='{"title":"We'll let you know","description":"Demo only: a live site would email you when registration opens.","type":"success"}'>${icon("bell")}Notify me</button>`;
      const pct = Math.round((t.filled / t.slots) * 100);
      const overview = html`<div class="k-stack" style="--k-gap:var(--space-5)"><p class="k-prose">${t.name} is a ${g.format} tournament for teams in ${t.region}. Format: ${t.format.toLowerCase()}. Check-in opens ${t.checkin}.</p>
        <table class="nf-kv"><tbody><tr><th scope="row">First matches</th><td>${t.start}</td></tr><tr><th scope="row">Region</th><td>${t.region}</td></tr><tr><th scope="row">Team size</th><td>${g.team} players plus up to 2 substitutes</td></tr><tr><th scope="row">Entry</th><td>${t.entry}</td></tr></tbody></table></div>`;
      const bracketPanel = t.id === "hollowstar-night-league" ? bracket(tpl) : emptyState({ icon: "git-fork", title: "Bracket not drawn yet", text: `Seeds are drawn when check-in closes on ${t.start}. Registered teams get an email when it's published.` });
      const prizes = html`<div class="table-wrap"><table class="table"><caption class="sr-only">Prize distribution</caption><thead><tr><th scope="col">Placement</th><th scope="col" class="num">Prize</th></tr></thead><tbody>${t.prizes.map(([p, v]) => html`<tr><th scope="row">${p}</th><td class="num">${v}</td></tr>`)}</tbody></table></div>`;
      return html`
<section class="nf-thead"><div class="k-wrap">
  ${breadcrumb([{ label: "Tournaments", href: ctx.href({ page: "home", hash: "tournaments" }) }, { label: t.name }])}
  <div class="nf-thead-grid">
    <div class="k-stack k-enter" style="--k-gap:var(--space-4)">
      <div class="k-cluster" style="--i:0">${badge(t.statusLabel, statusTone[t.status], { dot: t.status !== "soon" })}${badge(g.name, "outline")}</div>
      <h1 class="k-display" style="--i:1">${t.name}</h1>
      <dl class="nf-thead-facts" style="--i:2"><div><dt>Dates</dt><dd>${t.dates}</dd></div><div><dt>Prize pool</dt><dd>${t.prize}</dd></div><div><dt>Format</dt><dd>${t.format}</dd></div><div><dt>Region</dt><dd>${t.region}</dd></div></dl>
    </div>
    <aside class="card nf-reg" aria-label="Registration"><div class="card-body k-stack" style="--k-gap:var(--space-3)">
      <div class="nf-slots"><div class="row" style="justify-content:space-between"><span class="t-label-md">Teams registered</span><span class="t-label-md k-num">${t.filled} / ${t.slots}</span></div><div class="progress" role="progressbar" aria-label="Teams registered" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="--value:${pct}%"></span></div></div>
      ${reg}
    </div></aside>
  </div>
</div></section>
<div class="k-wrap">${media(ctx, "venue", { shape: "facet", priority: true })}</div>
<section class="k-section"><div class="k-wrap">
  ${tabs({ id: "tt", label: "Tournament details", tabs: [{ id: "overview", label: "Overview", panel: overview }, { id: "bracket", label: "Bracket", panel: bracketPanel }, { id: "prizes", label: "Prizes", panel: prizes }] })}
</div></section>
<section class="k-section nf-rules" id="rules" aria-labelledby="rules-title"><div class="k-wrap k-wrap--narrow k-stack" style="--k-gap:var(--space-5)">
  <h2 class="k-h2" id="rules-title">Rules</h2>
  ${accordion(tpl.rules, { openFirst: true })}
</div></section>`;
    },
  };
}

/* --------------------------------------------------------------- register */
const register = {
  key: "register", file: "register.html", title: "Register a team", short: "Register",
  description: "Register your team for a Nightforge tournament in three steps.",
  render(ctx) {
    const { tpl } = ctx;
    const open = tpl.tournaments.filter((t) => t.status === "open");
    const s1 = html`
      ${choices({ name: "tournament", legend: "Tournament", required: true, cols: 2, span: "full", error: "Choose a tournament.", options: open.map((t, i) => ({ value: t.id, label: t.name, desc: `${game(tpl, t.game).name} · ${t.dates} · ${t.slots - t.filled} slots left`, icon: "trophy", checked: i === 0 })) })}
      ${field({ id: "team", label: "Team name", required: true, maxlength: 32, help: "Shown on brackets and broadcasts. Keep it friendly.", error: "Enter your team name." })}
      ${field({ id: "tag", label: "Team tag", required: true, pattern: "[A-Za-z0-9]{2,5}", maxlength: 5, help: "2 to 5 letters or numbers, for example NVC.", error: "Use 2 to 5 letters or numbers, no spaces." })}
      ${field({ id: "region", label: "Region", type: "select", required: true, placeholder: "Choose a region", options: ["North America East", "North America West", "Europe West", "Europe North", "Latin America"], error: "Choose the region your team plays from." })}`;
    const s2 = html`
      ${field({ id: "captain", label: "Captain's in-game name", required: true, autocomplete: "nickname" })}
      ${field({ id: "email", label: "Captain's email", type: "email", required: true, autocomplete: "email", help: "Match-day messages and prize payouts go here." })}
      ${field({ id: "p2", label: "Player 2", required: true, placeholder: "In-game name" })}
      ${field({ id: "p3", label: "Player 3", required: true, placeholder: "In-game name" })}
      ${field({ id: "p4", label: "Player 4", placeholder: "Required for 5v5 games" })}
      ${field({ id: "p5", label: "Player 5", placeholder: "Required for 5v5 games" })}
      ${field({ id: "sub", label: "Substitute", placeholder: "In-game name" })}
      ${choices({ name: "ages", legend: "Player ages", required: true, span: "full", error: "Tell us whether any players are under 18.", options: [{ value: "adults", label: "Every player is 18 or older" }, { value: "minors", label: "Some players are 16 or 17", desc: "We'll email their parent or guardian to approve before check-in." }] })}`;
    const s3 = html`
      ${choices({ name: "reminders", legend: "Match-day reminders", style: "buttons", required: true, span: "full", error: "Choose how to get reminders.", options: [{ value: "email", label: "Email", checked: true }, { value: "server", label: "Community server" }, { value: "both", label: "Both" }] })}
      ${checkbox({ name: "rules", label: "Our team has read the tournament rules and agrees to follow them.", required: true, error: "Agree to the rules to register." })}
      ${checkbox({ name: "fairplay", label: "No player on this roster is banned from a Nightforge event.", required: true, error: "Confirm the fair play statement." })}`;
    return html`
<section class="k-section k-section--tight"><div class="k-wrap">
  ${breadcrumb([{ label: "Nightforge", href: ctx.href({ page: "home" }) }, { label: "Register a team" }])}
  <h1 class="k-display">Register a team</h1>
  <p class="k-lede nf-reg-lede">Takes about three minutes. Captains can edit the roster until check-in closes.</p>
</div></section>
<section class="k-section k-section--flush-top"><div class="k-wrap k-split" style="--k-split-a:2fr;--k-split-b:1fr">
  ${kitForm({ id: "reg-form", label: "Team registration", submitLabel: "Register team", steps: [{ title: "Team", body: s1 }, { title: "Roster", body: s2 }, { title: "Rules", body: s3 }],
    success: { title: "Team registration complete", text: "In a live site your team page would now be live, and the captain would get a confirmation email with check-in times.", next: btn({ label: "Browse tournaments", href: ctx.href({ page: "home", hash: "tournaments" }), variant: "secondary" }) } })}
  <aside class="k-stack k-sticky-col" style="--k-gap:var(--space-4)" aria-label="Registration help">
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">Before you start</b><ul class="nf-before"><li>${icon("check", { size: "sm" })}Everyone's in-game names</li><li>${icon("check", { size: "sm" })}A captain email you check on match days</li><li>${icon("check", { size: "sm" })}A parent or guardian email for players under 18</li></ul></div></div>
    <div class="card"><div class="card-body k-stack" style="--k-gap:var(--space-2)"><b class="t-label-lg">Questions?</b><p class="t-body-sm text-secondary">Admins answer in the community server every evening, or email <a class="link" href="mailto:ops@nightforge.example">ops@nightforge.example</a>.</p></div></div>
  </aside>
</div></section>`;
  },
};

const home = {
  key: "home", file: "index.html", title: "Home", short: "Home",
  render: (ctx) => html`${live(ctx)}${tournamentsSection(ctx)}${standings(ctx)}${roster(ctx)}${how(ctx)}`,
};

export default [home, ...content.tournaments.map(tournamentPage), register];
