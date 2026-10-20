/* FacetUI-Templates — block registry, part A: marketing & site blocks.
   Each block: { slug, n, name, cat, desc, variants: [{ name, html }] } pushed into window.TPL.
   Photos: Unsplash (free to use under the Unsplash License). Every <img> falls back to a brand gradient. */
(function () {
  const TPL = (window.TPL = window.TPL || []);
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  // Unsplash photo IDs, grouped by subject.
  const U = {
    p1: "1494790108377-be9c29b29330", p2: "1507003211169-0a1dd7228f2d", p3: "1438761681033-6461ffad8d80", p4: "1500648767791-00dcc994a43e",
    p5: "1472099645785-5658abf4ff4e", p6: "1534528741775-53994a69daeb", p7: "1544005313-94ddf0286df2", p8: "1506794778202-cad84cf45f1d",
    w1: "1522202176988-66273c2fd55f", w2: "1517245386807-bb43f82c33c4", w3: "1497366216548-37526070297c", w4: "1556761175-5973dc0f32e7",
    w5: "1519389950473-47ba0277781c", w6: "1504384308090-c894fdcc538d", w7: "1531482615713-2afd69097998", w8: "1552664730-d307ca884978",
    t1: "1460925895917-afdab827c52f", t2: "1498050108023-c5249f4df085", t3: "1486312338219-ce68d2c6f44d", t4: "1551288049-bebda4e38f71", t5: "1518770660439-4636190af475",
    n1: "1506905925346-21bda4d32df4", n2: "1469474968028-56623f02e42e", n3: "1501785888041-af3ef285b470", n4: "1470071459604-3b5ec3a7fe05",
    n5: "1486406146926-c627a92ad1ab", n6: "1449824913935-59a10b8d2000", n7: "1441974231531-c6227db76b6e",
    g1: "1505740420928-5e560c06d30e", g2: "1523275335684-37898b6baf30", g3: "1542291026-7eec264c27ff", g4: "1526170375885-4d8ecf77b99f",
    g5: "1572635196237-14b3f281503f", g6: "1491553895911-0055eca6402d", g7: "1549298916-b41d501d3772", g8: "1585386959984-a4155224a1ad",
  };
  const src = (k, w = 800, h = 600) => `https://images.unsplash.com/photo-${U[k] || k}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
  // Image box: gradient background, the photo on top; a failed photo is removed so the gradient shows.
  const img = (k, alt = "", w = 800, h = 600, cls = "", style = "", extra = "") => `<div class="tp-img ${cls}"${style ? ` style="${style}"` : ""}><img src="${src(k, w, h)}" alt="${alt}" loading="lazy" onerror="this.remove()">${extra}</div>`;
  const av = (k, size = 40) => `<div class="tp-img round" style="width:${size}px;height:${size}px;flex:none"><img src="${src(k, size * 3, size * 3)}" alt="" loading="lazy" onerror="this.remove()"></div>`;
  const avs = (ks, size = 32) => `<span class="row" style="--gap:0">${ks.map((k, n) => `<span style="margin-left:${n ? -10 : 0}px;border:2px solid var(--bg-canvas);border-radius:50%;display:inline-flex">${av(k, size)}</span>`).join("")}</span>`;
  // Fictional company logos (simple geometric marks).
  const MARKS = {
    Northwind: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 22 20H2z"/></svg>`,
    Globex: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>`,
    Umbrella: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z"/><rect x="11" y="12" width="2" height="9" rx="1"/></svg>`,
    Initech: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="4"/><rect x="3" y="13" width="8" height="8" rx="4"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>`,
    Hooli: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 4v16M19 4v16M5 12h14"/></svg>`,
    Vandelay: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h6l4 10 4-10h6L14 20h-4z"/></svg>`,
    Soylent: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="8" r="5"/><circle cx="16" cy="16" r="5" opacity=".6"/></svg>`,
    Stark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z"/></svg>`,
  };
  const logo = (name) => `<span class="tp-logo">${MARKS[name] || MARKS.Northwind}${name}</span>`;
  const LOGOS = Object.keys(MARKS);
  const nav = (dark, cta = "Get started") => `<nav class="tp-nav"><a class="tp-logo" style="color:var(--text-primary)" href="#">${MARKS.Initech}Lumen</a><div class="links"><a href="#">Product</a><a href="#">Solutions</a><a href="#">Pricing</a><a href="#">Customers</a><a href="#">Docs</a></div><span class="grow"></span><a class="btn btn-ghost btn-sm tp-hide-sm" href="#"${dark ? ' style="color:#fff"' : ""}>Sign in</a><a class="btn btn-sm" href="#">${cta}</a></nav>`;
  const mini = () => `<div class="tp-app">
    <aside class="side"><div class="workspace"><span class="logo">L</span><b class="t-label-md grow">Lumen</b></div>
      <a class="sidebar-item" aria-current="page">${i("layout-dashboard")}Overview</a><a class="sidebar-item">${i("inbox")}Inbox<span class="count">8</span></a><a class="sidebar-item">${i("users")}Customers</a><a class="sidebar-item">${i("bar-chart-3")}Reports</a><a class="sidebar-item">${i("settings")}Settings</a></aside>
    <div class="main"><div class="top"><b class="t-h5 grow">Good morning, Maya</b><span class="badge badge-success"><span class="dot"></span>Live</span></div>
      <div class="kpis">${[["Revenue", "$248.9k", "12.4%"], ["Customers", "1,284", "3.1%"], ["NRR", "118%", "2.0%"], ["Churn", "2.4%", "0.3%"]].map(([l, v, t]) => `<div class="card kpi"><span class="kpi-label">${l}</span><div class="kpi-row"><span class="kpi-value">${v}</span><span class="trend-chip">${i("trending-up")} ${t}</span></div></div>`).join("")}</div>
      <div class="two"><div class="card" style="padding:16px"><b class="t-label-md">Revenue</b><div class="chart" data-chart='{"type":"area","height":170,"format":"$compact","labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],"series":[{"name":"MRR","data":[142000,151000,158000,166000,171000,183000,190000,204000,226000,249000]}]}'></div></div>
      <div class="card" style="padding:16px"><b class="t-label-md">By plan</b><div class="chart" data-chart='{"type":"donut","size":170,"format":"percent","data":[{"name":"Growth","value":52},{"name":"Starter","value":28},{"name":"Enterprise","value":20}]}'></div></div></div></div></div>`;

  /* ---------------- 09 Hero ---------------- */
  TPL.push({ slug: "hero", n: 9, name: "Hero sections", cat: "Marketing", desc: "High-impact top-of-page banners: value proposition, CTAs and product imagery. Headline words rotate, mockups float and the glow drifts.",
    variants: [
      { name: "Centered with product mockup", html: `<section class="tp-sec tp-center" style="padding-top:0">
  <div class="tp-glow" style="width:520px;height:420px;left:12%;top:120px"></div><div class="tp-glow" style="width:420px;height:360px;right:8%;top:60px;background:var(--brand-300);animation-delay:-6s"></div><div class="tp-dots"></div>
  ${nav()}
  <div class="tp-narrow" style="padding-top:56px;position:relative">
    <a class="tp-hero-pill" href="#" data-anim="down"><span class="badge badge-brand">New</span> Lumen AI copilot is live ${i("arrow-right", "icon-sm")}</a>
    <h1 class="tp-h1" data-anim="up" style="--d:1">Analytics your team will <span class="tp-word tp-grad"><span class="on">actually use.</span><span>trust.</span><span>love.</span></span></h1>
    <p class="tp-lead" data-anim="up" style="--d:2">One workspace for revenue, product and support metrics, with answers in plain English. Set up in minutes, no SQL required.</p>
    <div class="tp-ctas" data-anim="up" style="--d:3"><a class="btn btn-lg" href="#" data-magnetic>Start free trial ${i("arrow-right")}</a><a class="btn btn-outline btn-lg" href="#">${i("play")} Watch demo</a></div>
  </div>
  <div class="tp-hero-mock" data-anim="flip" style="--d:4">
    <div class="tp-hero-float tp-float card kpi tp-hide-sm" style="left:-48px;top:110px;width:210px;padding:14px"><span class="kpi-label">Conversion</span><div class="kpi-row"><span class="kpi-value" data-countup="4.8">4.8</span><span class="trend-chip">${i("trending-up")} 0.6%</span></div></div>
    <div class="tp-hero-float tp-float b card tp-hide-sm" style="right:-40px;bottom:70px;width:250px;padding:12px;display:flex;gap:10px;align-items:center">${av("p1", 36)}<div><b class="t-label-sm">Maya closed Globex</b><div class="t-body-xs text-tertiary">$86,400 ARR · just now</div></div></div>
    <div class="inner">${mini()}</div>
  </div>
</section>` },
      { name: "Split with photo collage", html: `<section class="tp-sec" style="padding-top:0">
  ${nav()}
  <div class="tp-wrap tp-g2" style="padding-top:48px">
    <div>
      <span class="tp-eyebrow" data-anim="right">For distributed teams</span>
      <h1 class="tp-h1" data-anim="right" style="--d:1">Work happens <span class="tp-grad">everywhere.</span> Now it's in one place.</h1>
      <p class="tp-lead" data-anim="right" style="--d:2">Docs, decisions and deadlines in a single calm workspace — built for teams who'd rather ship than search.</p>
      <div class="tp-ctas" data-anim="right" style="--d:3"><a class="btn btn-lg" href="#">Get started free</a><a class="btn btn-ghost btn-lg" href="#">Talk to sales ${i("arrow-right")}</a></div>
      <div class="tp-proof" data-anim="up" style="--d:4">${avs(["p1", "p2", "p3", "p4"], 34)}<div><span class="tp-stars">★★★★★</span><div>Loved by <b>12,000+</b> teams</div></div></div>
    </div>
    <div class="tp-collage">
      ${img("w1", "Team working together", 700, 800, "zoom", "", "")}
      ${img("w6", "Workspace", 600, 400, "zoom")}
      ${img("w8", "Planning session", 600, 400, "zoom")}
    </div>
  </div>
</section>` },
      { name: "Dark with email capture", html: `<section class="tp-sec ink tp-center" style="padding-top:0">
  <div class="tp-glow" style="width:640px;height:520px;left:50%;top:40px;translate:-50% 0;opacity:.45"></div><div class="tp-dots" style="--text-primary:#fff;opacity:.35"></div>
  ${nav(true, "Join waitlist")}
  <div class="tp-narrow" style="padding:72px 0 24px;position:relative">
    <span class="tp-hero-pill" data-anim="zoom" style="background:rgb(255 255 255 / .06);border-color:rgb(255 255 255 / .12);color:#ddd"><span class="badge badge-accent">Beta</span> 2,400 teams on the waitlist</span>
    <h1 class="tp-h1" data-anim="blur" style="--d:1;font-size:72px">Ship your roadmap <br><span class="tp-grad">twice as fast.</span></h1>
    <p class="tp-lead" data-anim="up" style="--d:2">AI that turns customer feedback into prioritised, scoped tickets — and keeps everyone in the loop.</p>
    <form class="tp-capture" data-anim="up" style="--d:3;background:#15151f;border-color:rgb(255 255 255 / .12)" data-success="You're on the list — see you soon!"><input type="email" placeholder="you@company.com" aria-label="Email" required><button class="btn" type="submit">Join waitlist</button></form>
    <p class="t-body-xs" style="margin-top:12px;color:#8a8a99">No spam. Unsubscribe anytime.</p>
  </div>
</section>` }] });

  /* ---------------- 06 Feature Items ---------------- */
  TPL.push({ slug: "feature-items", n: 6, name: "Feature Items", cat: "Marketing", desc: "Individual capabilities with imagery and micro-copy: alternating rows, or tabs that auto-advance with a progress bar.",
    variants: [
      { name: "Alternating rows", html: `<section class="tp-sec"><div class="tp-wrap">
  <div class="tp-alt"><div data-anim="right"><span class="tp-eyebrow">Insights</span><h2 class="tp-h2">Every metric, explained in plain English.</h2><p class="tp-lead">Ask “why did churn spike?” and get a chart, the cause and the accounts behind it.</p>
    <ul class="tp-checks"><li>${i("circle-check")}Natural-language questions over all your data</li><li>${i("circle-check")}Root-cause analysis with linked accounts</li><li>${i("circle-check")}Weekly digest to Slack or email</li></ul></div>
    ${img("t4", "Charts on a laptop", 900, 720, "zoom", "", "").replace('class="tp-img zoom"', 'class="tp-img zoom" data-anim="left"')}</div>
  <div class="tp-alt flip"><div data-anim="left"><span class="tp-eyebrow">Collaboration</span><h2 class="tp-h2">Decide together, without the meeting.</h2><p class="tp-lead">Comment on any chart, assign follow-ups and watch decisions land in your roadmap.</p>
    <div class="tp-ctas"><a class="btn" href="#">Explore collaboration</a></div></div>
    ${img("w7", "Team planning", 900, 720, "zoom").replace('class="tp-img zoom"', 'class="tp-img zoom" data-anim="right"')}</div>
</div></section>` },
      { name: "Auto-advancing tabs", html: `<section class="tp-sec alt"><div class="tp-wrap">
  <div class="tp-center"><span class="tp-eyebrow">How teams use Lumen</span><h2 class="tp-h2">One tool, three superpowers.</h2></div>
  <div class="tp-tabs-show tp-mt" data-tabshow>
    <div role="tablist" aria-label="Features">
      <button class="tp-tabbtn" role="tab" aria-selected="true"><b>${i("bar-chart-3")} Live dashboards</b><p>Real-time KPIs that update the moment data lands.</p><span class="bar"></span></button>
      <button class="tp-tabbtn" role="tab" aria-selected="false"><b>${i("sparkles")} AI answers</b><p>Ask a question, get a chart and a written explanation.</p><span class="bar"></span></button>
      <button class="tp-tabbtn" role="tab" aria-selected="false"><b>${i("users")} Shared workspaces</b><p>Every team gets a space — permissions handled for you.</p><span class="bar"></span></button>
    </div>
    <div class="tp-tabstage">${img("t1", "Dashboard", 1000, 760, "on")}${img("t3", "Laptop", 1000, 760)}${img("w5", "Team", 1000, 760)}</div>
  </div>
</div></section>` }] });

  /* ---------------- 17 Feature Grids ---------------- */
  TPL.push({ slug: "feature-grids", n: 17, name: "Feature Grids", cat: "Marketing", desc: "Scannable multi-column layouts with icons — a hairline grid, or a bento with live components inside the tiles.",
    variants: [
      { name: "Icon grid", html: `<section class="tp-sec"><div class="tp-wrap">
  <div class="tp-center"><span class="tp-eyebrow">Everything included</span><h2 class="tp-h2">Built for the whole team.</h2><p class="tp-lead">Security, speed and polish — on every plan.</p></div>
  <div class="tp-fgrid tp-mt">${[["zap", "Instant setup", "Connect your stack in under five minutes with 80+ integrations."], ["shield-check", "SOC 2 Type II", "Encryption at rest and in transit, SSO and audit logs."], ["sparkles", "AI copilot", "Summaries, forecasts and anomaly alerts written for humans."], ["globe", "Global edge", "Sub-100ms dashboards from 30 regions worldwide."], ["git-branch", "Version history", "Every change is tracked; roll back any chart in a click."], ["life-buoy", "Human support", "Real engineers on chat, with a 4-minute median reply."]].map(([ic, t, d], k) => `<div data-anim="up" style="--d:${k}"><span class="tp-ico">${i(ic)}</span><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>
</div></section>` },
      { name: "Bento grid", html: `<section class="tp-sec alt"><div class="tp-wrap">
  <span class="tp-eyebrow">Platform</span><h2 class="tp-h2">A bento of good decisions.</h2>
  <div class="tp-bento tp-mt">
    <div class="tp-tile w4 h2" data-anim="zoom"><span class="tp-ico">${i("bar-chart-3")}</span><b class="t-h5">Revenue at a glance</b><p class="t-body-sm text-secondary">MRR, expansion and churn in one living chart.</p><div class="chart" style="margin-top:auto" data-chart='{"type":"bar","height":190,"stacked":true,"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],"series":[{"name":"New","data":[42,51,46,58,62,70,74,81]},{"name":"Expansion","data":[12,15,18,16,21,24,26,30]}]}'></div></div>
    <div class="tp-tile h2" data-anim="zoom" style="--d:1;padding:0;overflow:hidden">${img("p6", "Customer", 500, 700, "", "position:absolute;inset:0;border-radius:0")}<div style="position:relative;margin-top:auto;padding:18px;color:#fff;background:linear-gradient(transparent,rgb(0 0 0 / .7))"><b>“We cut reporting time by 70%.”</b><div class="t-body-xs" style="opacity:.8">Ana Ruiz · Head of Ops, Globex</div></div></div>
    <div class="tp-tile" data-anim="up" style="--d:2"><span class="tp-ico">${i("zap")}</span><b class="t-h5" data-countup="99.99">99.99</b><span class="t-body-sm text-secondary">% uptime last 12 months</span></div>
    <div class="tp-tile" data-anim="up" style="--d:3"><span class="tp-ico">${i("lock")}</span><b class="t-label-lg">SSO & SCIM</b><label class="switch"><input type="checkbox" role="switch" checked> Enforce SSO</label></div>
    <div class="tp-tile" data-anim="up" style="--d:4"><span class="tp-ico">${i("users")}</span><b class="t-label-lg">Your whole team</b>${avs(["p1", "p2", "p3", "p5", "p7"], 30)}</div>
  </div>
</div></section>` }] });

  /* ---------------- 18 Stats ---------------- */
  TPL.push({ slug: "stats", n: 18, name: "Stats & Metrics Counters", cat: "Marketing", desc: "Big numbers that count up when they scroll into view, with progress bars that fill.",
    variants: [
      { name: "Counters with bars", html: `<section class="tp-sec"><div class="tp-wrap">
  <div class="tp-g2" style="align-items:end"><div><span class="tp-eyebrow">By the numbers</span><h2 class="tp-h2">Trusted at scale.</h2></div><p class="tp-lead">From two-person startups to public companies, Lumen keeps 40,000 teams on the same page.</p></div>
  <div class="tp-stats" data-anim="up">${[["99.9", "%", "Uptime SLA", "99%"], ["10", "M+", "Events per minute", "82%"], ["40", "k", "Teams worldwide", "64%"], ["4", " min", "Median support reply", "35%"]].map(([n, s, l, w]) => `<div><b><span data-countup="${n}">${n}</span>${s}</b><span>${l}</span><div class="bar"><i style="--w:${w}"></i></div></div>`).join("")}</div>
</div></section>` },
      { name: "Brand band", html: `<section class="tp-sec brand tp-center"><div class="tp-dots" style="--text-primary:#fff;opacity:.4"></div><div class="tp-wrap" style="position:relative">
  <h2 class="tp-h2" data-anim="up">Numbers that speak for themselves.</h2>
  <div class="tp-g4 tp-mt">${[["2.4", "B", "Rows analysed daily"], ["180", "+", "Countries"], ["4.9", "/5", "G2 rating"], ["32", "%", "Avg. time saved"]].map(([n, s, l], k) => `<div data-anim="zoom" style="--d:${k}"><b style="font:700 56px/1 var(--font-sans);letter-spacing:-.04em"><span data-countup="${n}">${n}</span>${s}</b><div class="t-body-md" style="opacity:.8;margin-top:8px">${l}</div></div>`).join("")}</div>
</div></section>` }] });

  /* ---------------- 19 Logo Clouds ---------------- */
  TPL.push({ slug: "logo-cloud", n: 19, name: "Logo Clouds", cat: "Marketing", desc: "Social-proof strips of client and partner logos. Hover lifts each cell.",
    variants: [{ name: "Hairline grid", html: `<section class="tp-sec tight"><div class="tp-wrap tp-center" style="padding:24px 0">
  <p class="t-label-md text-secondary">Trusted by fast-moving teams at</p>
  <div class="tp-logos">${LOGOS.slice(0, 6).map((n, k) => `<div data-anim="zoom" style="--d:${k}">${logo(n)}</div>`).join("")}</div>
</div></section>` }] });

  /* ---------------- 27 Logo Carousels ---------------- */
  TPL.push({ slug: "logo-carousel", n: 27, name: "Logo & Brand Carousels", cat: "Marketing", desc: "Infinite marquees in opposite directions; hover pauses them.",
    variants: [{ name: "Double marquee", html: `<section class="tp-sec tight alt"><div class="tp-center" style="padding:20px 0">
  <p class="t-label-md text-secondary" style="margin-bottom:12px">Integrates with the tools you already use</p>
  <div class="tp-marquee"><div class="track">${[...LOGOS, ...LOGOS].map((n) => `<span class="tp-badge-logo">${logo(n)}</span>`).join("")}</div></div>
  <div class="tp-marquee rev"><div class="track">${[...LOGOS.slice().reverse(), ...LOGOS.slice().reverse()].map((n) => `<span class="tp-badge-logo">${logo(n)}</span>`).join("")}</div></div>
</div></section>` }] });

  /* ---------------- 20 How it works ---------------- */
  TPL.push({ slug: "how-it-works", n: 20, name: "Step-by-Step / How It Works", cat: "Marketing", desc: "Numbered milestones; the connecting line draws itself when the section appears.",
    variants: [
      { name: "Three steps", html: `<section class="tp-sec"><div class="tp-wrap tp-center">
  <span class="tp-eyebrow">How it works</span><h2 class="tp-h2">From signup to insight in three steps.</h2>
  <div class="tp-steps" data-anim="up"><span class="line-fill"></span>${[["Connect", "Plug in Stripe, HubSpot, Postgres or any of 80+ sources."], ["Ask", "Type a question. Lumen writes the query and draws the chart."], ["Share", "Pin it to a dashboard, schedule a digest or embed it anywhere."]].map(([t, d], k) => `<div class="tp-step" data-anim="up" style="--d:${k + 1}"><span class="n">${k + 1}</span><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>
</div></section>` },
      { name: "Vertical with image", html: `<section class="tp-sec alt"><div class="tp-wrap tp-vsteps">
  <div><span class="tp-eyebrow">Onboarding</span><h2 class="tp-h2">Live in an afternoon.</h2><div class="tp-mt-s">${[["Create your workspace", "Invite your team with Google or SSO."], ["Connect data", "OAuth to your tools — read-only, encrypted."], ["Pick a template", "Start from 40+ dashboards made by experts."], ["Go live", "Share a link or embed on your site."]].map(([t, d], k) => `<div class="tp-vstep" data-anim="right" style="--d:${k}"><span class="n">${k + 1}</span><div><h4>${t}</h4><p>${d}</p></div></div>`).join("")}</div></div>
  ${img("w2", "Team onboarding", 800, 900, "zoom", "aspect-ratio:4/5", "").replace('class="tp-img zoom"', 'class="tp-img zoom" data-anim="left"')}
</div></section>` }] });

  /* ---------------- 21 Timeline / Roadmap ---------------- */
  TPL.push({ slug: "timeline", n: 21, name: "Timeline / Roadmap", cat: "Marketing", desc: "Public roadmap columns with live status, and a company history that alternates sides.",
    variants: [
      { name: "Product roadmap", html: `<section class="tp-sec"><div class="tp-wrap">
  <div class="tp-g2" style="align-items:end"><div><span class="tp-eyebrow">Roadmap</span><h2 class="tp-h2">What we're building.</h2></div><p class="tp-lead">Vote on what matters to you — we ship weekly.</p></div>
  <div class="tp-roadmap">${[["Shipped", "badge-success", [["AI digests", "Weekly summaries in Slack"], ["Dark mode", "Every screen, every chart"]]], ["In progress", "badge-brand", [["Embeds v2", "Theming + row-level security"], ["Mobile app", "iOS beta in TestFlight"]]], ["Next", "badge-warning", [["Forecasting", "Seasonality-aware predictions"]]], ["Exploring", "badge-outline", [["Data apps", "Build tools on top of charts"], ["Offline mode", "Cached dashboards"]]]].map(([h, b, items], k) => `<div class="col" data-anim="up" style="--d:${k}"><header>${h}<span class="badge ${b}">${items.length}</span></header>${items.map(([t, d]) => `<div class="item"><b>${t}</b>${d}<div class="row" style="margin-top:10px;justify-content:space-between"><span class="t-caption text-tertiary">${["Q3 2026", "Q4 2026", "Q1 2027", "Later"][k]}</span><button class="btn btn-ghost btn-sm" data-vote>${i("thumbs-up", "icon-sm")} <span>${12 + k * 7}</span></button></div></div>`).join("")}</div>`).join("")}</div>
</div></section>` },
      { name: "Company history", html: `<section class="tp-sec alt"><div class="tp-wrap tp-center"><span class="tp-eyebrow">Our story</span><h2 class="tp-h2">Seven years of building.</h2>
  <div class="tp-history" style="text-align:initial">${[["2019", "Founded in a garage", "Two engineers, one whiteboard, zero dashboards."], ["2021", "Series A", "$18M to make analytics conversational."], ["2023", "40,000 teams", "Lumen becomes the default for SaaS ops."], ["2026", "Lumen AI", "Every chart now explains itself."]].map(([y, t, d], k) => `<div class="ev" data-anim="${k % 2 ? "left" : "right"}"><span class="yr">${y}</span><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>
</div></section>` }] });

  /* ---------------- 11 Testimonials ---------------- */
  const quotes = [["p1", "Ana Ruiz", "Head of Ops, Globex", "We replaced three tools and a weekly reporting meeting. The AI answers are scarily good."], ["p2", "Marcus Lee", "CTO, Initech", "Setup took 12 minutes. By lunch the whole company was asking questions in plain English."], ["p3", "Priya Shah", "VP Sales, Hooli", "Forecasts went from a spreadsheet ritual to a link I share every Monday."], ["p4", "Tom Becker", "Founder, Vandelay", "Finally, dashboards my board actually opens."], ["p6", "Lena Kovač", "Data Lead, Soylent", "Row-level security and embeds made our customer portal possible in a week."], ["p5", "David Chen", "RevOps, Stark", "The support team answers faster than our own Slack."]];
  TPL.push({ slug: "testimonials", n: 11, name: "Testimonials", cat: "Marketing", desc: "Social proof with avatars, ratings and roles: a masonry wall, or a large auto-playing quote slider.",
    variants: [
      { name: "Masonry wall", html: `<section class="tp-sec alt"><div class="tp-wrap"><div class="tp-center"><span class="tp-eyebrow">Wall of love</span><h2 class="tp-h2">Teams can't stop talking.</h2></div>
  <div class="tp-masonry">${quotes.map(([p, n, r, q], k) => `<figure class="tp-quote" data-anim="up" style="--d:${k % 3}"><span class="tp-stars">★★★★★</span><p style="margin-top:10px">“${q}”</p><figcaption class="who">${av(p, 40)}<div><b>${n}</b><span>${r}</span></div></figcaption></figure>`).join("")}</div>
</div></section>` },
      { name: "Featured quote slider", html: `<section class="tp-sec"><div class="tp-wrap"><div class="tp-bigquote" data-slider>
  <div class="photos">${quotes.slice(0, 3).map(([p], k) => img(p, "", 600, 750, k ? "" : "on")).join("")}</div>
  <div><span class="tp-eyebrow">Customer stories</span><div class="tp-slides tp-mt-s">${quotes.slice(0, 3).map(([, n, r, q], k) => `<figure class="tp-slide${k ? "" : " on"}"><blockquote>“${q}”</blockquote><cite>${n}<span>${r}</span></cite></figure>`).join("")}</div>
  <div class="tp-slider-nav"><button class="btn btn-outline btn-sm icon-btn" data-prev aria-label="Previous">${i("chevron-left")}</button><button class="btn btn-outline btn-sm icon-btn" data-next aria-label="Next">${i("chevron-right")}</button><span class="dots"><i class="on"></i><i></i><i></i></span></div></div>
</div></div></section>` }] });

  /* ---------------- 16 CTA banners ---------------- */
  TPL.push({ slug: "cta", n: 16, name: "Call to Action Banners", cat: "Marketing", desc: "High-contrast conversion blocks: a photo pill banner and a glowing brand box.",
    variants: [
      { name: "Photo pill", html: `<section class="tp-sec tight"><div class="tp-wrap"><div class="tp-cta-pill" data-anim="zoom">${img("w4", "", 1400, 400)}<div class="grow"><b>Built for teams who think in systems</b><span style="display:block;margin-top:4px">Used by 40,000+ teams worldwide</span></div><a class="btn btn-lg tp-white" href="#" data-magnetic>Start free ${i("arrow-right")}</a></div></div></section>` },
      { name: "Brand box", html: `<section class="tp-sec"><div class="tp-wrap"><div class="tp-cta-box" data-anim="up"><div class="tp-dots"></div><div style="position:relative"><h2 class="tp-h2">Ready to see your data clearly?</h2><p class="tp-lead">Start free for 14 days. No credit card, cancel anytime.</p><div class="tp-ctas" style="justify-content:center"><a class="btn btn-lg tp-white" href="#" data-magnetic>Start free trial</a><a class="btn btn-lg btn-outline" href="#">Book a demo</a></div></div></div></div></section>` }] });

  /* ---------------- 08 Pricing ---------------- */
  const tiers = [["Starter", "For individuals", 0, 0, ["5 dashboards", "7-day history", "Community support"], ""], ["Growth", "For growing teams", 29, 23, ["Unlimited dashboards", "AI copilot", "1-year history", "Slack digests"], "featured"], ["Scale", "For larger orgs", 79, 63, ["Everything in Growth", "SSO & SCIM", "Row-level security", "Priority support"], ""]];
  TPL.push({ slug: "pricing", n: 8, name: "Pricing Tiers", cat: "Marketing", desc: "Plans with a monthly/annual toggle — prices flip with a spring — plus a full comparison table.",
    variants: [
      { name: "Three tiers with billing toggle", html: `<section class="tp-sec" data-pricing><div class="tp-wrap tp-center">
  <span class="tp-eyebrow">Pricing</span><h2 class="tp-h2">Simple pricing that scales.</h2><p class="tp-lead">Start free. Upgrade when your team does.</p>
  <div class="tp-row" style="justify-content:center;margin-top:24px"><div class="segment primary" role="radiogroup" aria-label="Billing" data-billing><button role="radio" aria-checked="true" data-cycle="m">Monthly</button><button role="radio" aria-checked="false" data-cycle="y">Yearly</button></div><span class="badge badge-success tp-save" hidden>Save 20%</span></div>
  <div class="tp-pricing" style="text-align:left">${tiers.map(([n, s, m, y, f, cls], k) => `<div class="card pricing ${cls}" data-tilt="3" data-anim="up" style="--d:${k}"><div class="row" style="justify-content:space-between"><b class="t-h4">${n}</b>${cls ? '<span class="badge badge-accent">Most popular</span>' : ""}</div><p class="t-body-sm text-tertiary">${s}</p><div class="price tp-price">$<span class="amt" data-m="${m}" data-y="${y}">${m}</span><small> /user/mo</small></div><button class="btn ${cls ? "" : "btn-outline"} btn-block">${m ? "Start free trial" : "Get started"}</button><ul>${f.map((x) => `<li>${i("check")}${x}</li>`).join("")}</ul></div>`).join("")}</div>
</div></section>` },
      { name: "Comparison table", html: `<section class="tp-sec alt"><div class="tp-wrap"><div class="tp-center"><h2 class="tp-h2">Compare plans</h2></div>
  <div style="overflow:auto"><table class="tp-compare"><thead><tr><th></th>${tiers.map(([n, s, m], k) => `<th class="${k === 1 ? "hl" : ""}">${n}<small>$${m}/user/mo</small><button class="btn btn-sm ${k === 1 ? "" : "btn-outline"}">Choose</button></th>`).join("")}</tr></thead><tbody>
  <tr class="grp"><td colspan="4">Core</td></tr>${[["Dashboards", "5", "Unlimited", "Unlimited"], ["History", "7 days", "1 year", "Unlimited"], ["AI copilot", 0, 1, 1]].map((r) => `<tr>${r.map((c, k) => `<td class="${k === 2 ? "hl" : ""}">${c === 1 ? i("check") : c === 0 ? `<span class="no">—</span>` : c}</td>`).join("")}</tr>`).join("")}
  <tr class="grp"><td colspan="4">Security</td></tr>${[["SSO & SCIM", 0, 0, 1], ["Row-level security", 0, 0, 1], ["Audit log", 0, 1, 1]].map((r) => `<tr>${r.map((c, k) => `<td class="${k === 2 ? "hl" : ""}">${c === 1 ? i("check") : c === 0 ? `<span class="no">—</span>` : c}</td>`).join("")}</tr>`).join("")}
  </tbody></table></div></div></section>` }] });

  /* ---------------- 05 FAQ ---------------- */
  const faqs = [["How does the free trial work?", "You get every Growth feature for 14 days. No credit card required — we'll remind you before it ends."], ["Can I change plans later?", "Yes. Upgrades are prorated instantly; downgrades apply at the next billing date."], ["Is my data secure?", "We're SOC 2 Type II certified, encrypt everything at rest and in transit, and never train models on your data."], ["Do you offer discounts?", "Startups under $1M ARR and non-profits get 50% off the first year."], ["What integrations are supported?", "80+ sources including Stripe, HubSpot, Salesforce, Postgres, BigQuery and Snowflake."]];
  const acc = (open = 0) => `<div class="accordion">${faqs.map(([q, a], k) => `<details${k === open ? " open" : ""}><summary>${q}${i("chevron-down")}</summary><div>${a}</div></details>`).join("")}</div>`;
  TPL.push({ slug: "faq", n: 5, name: "FAQ Page", cat: "Marketing", desc: "Accordion questions with smooth open/close: a two-column layout, and a centred version with search and topics.",
    variants: [
      { name: "Two columns", html: `<section class="tp-sec tp-faq"><div class="tp-wrap tp-faq-grid"><div><span class="tp-eyebrow">FAQ</span><h2 class="tp-h2">Questions, answered.</h2><p class="tp-lead">Can't find what you need? Our team replies in about 4 minutes.</p><div class="tp-faq-help"><div class="row">${avs(["p1", "p2", "p3"], 30)}<b class="t-label-md">Still curious?</b></div><p class="t-body-sm text-secondary" style="margin:8px 0 12px">Chat with a real human, 24/7.</p><button class="btn btn-sm">${i("message-square")} Start a chat</button></div></div>${acc(0)}</div></section>` },
      { name: "Centered with search", html: `<section class="tp-sec alt tp-faq" data-faq><div class="tp-narrow tp-center"><h2 class="tp-h2">How can we help?</h2>
  <div class="input-group" style="margin:24px auto 0;max-width:460px">${i("search")}<input class="input input-lg" placeholder="Search questions…" aria-label="Search FAQ" data-faq-search></div>
  <div class="row" style="justify-content:center;margin:16px 0 8px">${["All", "Billing", "Security", "Integrations"].map((c, k) => `<button class="chip" aria-pressed="${!k}">${c}</button>`).join("")}</div>
  <div style="text-align:left">${acc(-1)}</div><p class="t-body-sm text-tertiary" data-faq-empty hidden style="margin-top:20px">No questions match your search.</p></div></section>` }] });

  /* ---------------- 07 Footer ---------------- */
  const cols = [["Product", ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"]], ["Company", ["About", "Careers", "Press", "Contact"]], ["Resources", ["Docs", "Guides", "Templates", "Community"]], ["Legal", ["Privacy", "Terms", "Security", "Cookies"]]];
  const social = `<div class="tp-social">${["globe", "message-square", "mail", "rss"].map((n) => `<a href="#" aria-label="${n}">${i(n, "icon-sm")}</a>`).join("")}</div>`;
  TPL.push({ slug: "footer", n: 7, name: "Footer", cat: "Marketing", desc: "Sitemap, social links, newsletter opt-in and legal — light with newsletter, or dark with a giant wordmark.",
    variants: [
      { name: "Sitemap + newsletter", html: `<footer class="tp-footer"><div class="tp-wrap"><div class="tp-footer-grid">
  <div><a class="tp-logo" style="color:var(--text-primary)" href="#">${MARKS.Initech}Lumen</a><p class="t-body-sm text-secondary" style="margin:14px 0 18px;max-width:280px">Analytics your team will actually use. Made with care in Lisbon & Toronto.</p><form class="row" data-success="Subscribed!" style="--gap:8px;flex-wrap:nowrap"><input class="input input-sm" type="email" placeholder="you@company.com" aria-label="Email" required><button class="btn btn-sm" type="submit">Subscribe</button></form></div>
  ${cols.map(([h, ls]) => `<div><h5>${h}</h5><ul>${ls.map((l) => `<li><a href="#">${l}</a></li>`).join("")}</ul></div>`).join("")}
</div><div class="tp-footer-bottom"><span>© 2026 Lumen Inc. All rights reserved.</span><span class="row"><span class="badge badge-success"><span class="dot"></span>All systems normal</span>${social}</span></div></div></footer>` },
      { name: "Dark with wordmark", html: `<footer class="tp-footer tp-sec ink" style="padding-bottom:0"><div class="tp-wrap"><div class="tp-footer-grid"><div><h3 class="tp-h3" style="max-width:260px">Let's build something people love.</h3><a class="btn tp-white" href="#" style="margin-top:18px">Contact sales ${i("arrow-right")}</a></div>${cols.map(([h, ls]) => `<div><h5>${h}</h5><ul>${ls.map((l) => `<li><a href="#">${l}</a></li>`).join("")}</ul></div>`).join("")}</div>
  <div class="tp-footer-bottom"><span>© 2026 Lumen Inc.</span>${social}</div><div class="tp-wordmark" data-anim="up">Lumen</div></div></footer>` }] });

  /* ---------------- 12 Mega Menus ---------------- */
  TPL.push({ slug: "mega-menu", n: 12, name: "Mega Menus", cat: "Navigation", desc: "Multi-column dropdown with icons, descriptions and a featured photo card. Items stagger in; hover or click to open.",
    variants: [{ name: "Products mega menu", html: `<div class="tp-mega-stage" data-mega><nav class="tp-nav" style="border-bottom:1px solid var(--border-subtle)"><a class="tp-logo" style="color:var(--text-primary)" href="#">${MARKS.Initech}Lumen</a><div class="links"><button aria-expanded="true" data-mega-trigger>Product ${i("chevron-down")}</button><button data-mega-trigger aria-expanded="false">Solutions ${i("chevron-down")}</button><a href="#">Pricing</a><a href="#">Docs</a></div><span class="grow"></span><a class="btn btn-sm" href="#">Get started</a>
  <div class="tp-mega open">${[["Analyze", [["bar-chart-3", "Dashboards", "Live KPIs for every team"], ["sparkles", "AI copilot", "Ask in plain English"], ["trending-up", "Forecasts", "See next quarter today"]]], ["Collaborate", [["message-square", "Comments", "Discuss on any chart"], ["bell", "Alerts", "Know when metrics move"], ["share-2", "Embeds", "Charts in your product"]]], ["Govern", [["shield-check", "Security", "SSO, SCIM, audit log"], ["database", "Sources", "80+ integrations"], ["lock", "Permissions", "Row-level access"]]]].map(([h, items]) => `<div class="col"><h6>${h}</h6>${items.map(([ic, t, d]) => `<a class="item" href="#"><span class="tp-ico">${i(ic)}</span><span><b>${t}</b><span>${d}</span></span></a>`).join("")}</div>`).join("")}
    <a class="feat" href="#">${img("t3", "", 700, 700)}<span class="badge badge-accent" style="align-self:flex-start">New</span><b class="t-h5" style="margin-top:8px">Lumen AI is here</b><span class="t-body-xs" style="opacity:.85">Every chart now explains itself →</span></a></div></nav>
  <div class="tp-filler"><div class="line"></div><div class="line s"></div><div class="line"></div></div></div>` }] });

  /* ---------------- 13 Announcement banners ---------------- */
  TPL.push({ slug: "announcement", n: 13, name: "Announcement Banners", cat: "Navigation", desc: "Thin top bars for promos, maintenance and status. Dismiss collapses them smoothly; the promo counts down.",
    variants: [{ name: "Promo, maintenance, status, ticker", html: `<div>
  <div class="tp-announce promo"><span>🎉 Black Friday: 40% off annual plans — ends in <span class="tp-countdown" data-countdown="7200"><span>02</span>:<span>00</span>:<span>00</span></span></span><a href="#" style="color:#fff">Claim offer →</a><button class="x" aria-label="Dismiss">${i("x", "icon-sm")}</button></div>
  <div class="tp-announce warn">${i("triangle-alert", "icon-sm")}<span>Scheduled maintenance Sunday 02:00–03:00 UTC. Dashboards will be read-only.</span><button class="x" aria-label="Dismiss">${i("x", "icon-sm")}</button></div>
  <div class="tp-announce ok"><span class="tp-pulse"></span><span>All systems operational · <a href="#" style="color:inherit">View status</a></span><button class="x" aria-label="Dismiss">${i("x", "icon-sm")}</button></div>
  <div class="tp-announce ink" style="justify-content:flex-start;padding-right:0"><div class="tp-ticker">${Array(2).fill(`<span>${i("sparkles", "icon-sm")} Lumen AI now in 12 languages</span><span>${i("zap", "icon-sm")} New: Snowflake connector</span><span>${i("calendar", "icon-sm")} Webinar Thursday — Forecasting 101</span><span>${i("gift", "icon-sm")} Refer a team, get a month free</span>`).join("")}</div></div>
  ${nav()}
</div>` }] });

  /* ---------------- 14 Breadcrumbs ---------------- */
  TPL.push({ slug: "breadcrumbs", n: 14, name: "Breadcrumbs", cat: "Navigation", desc: "Location trails: plain with icons, collapsed with a dropdown, pills, chevron arrows, and inside a page header.",
    variants: [{ name: "Five styles", html: `<div class="tp-sec tight" style="display:grid;gap:26px">
  <ol class="tp-crumbs" aria-label="Breadcrumb"><li><a href="#">${i("house", "icon-sm")}Home</a></li>${i("chevron-right", "icon-sm")}<li><a href="#">Projects</a></li>${i("chevron-right", "icon-sm")}<li><a href="#">Q4 Launch</a></li>${i("chevron-right", "icon-sm")}<li aria-current="page">Budget</li></ol>
  <ol class="tp-crumbs"><li><a href="#">${i("house", "icon-sm")}</a></li><span class="tp-muted">/</span><li class="dropdown tp-crumb-more"><button class="btn btn-ghost btn-sm icon-btn" data-dropdown-trigger aria-expanded="false" aria-label="Show path">${i("ellipsis", "icon-sm")}</button><div class="menu"><button class="menu-item">${i("folder")}Workspace</button><button class="menu-item">${i("folder")}Marketing</button><button class="menu-item">${i("folder")}Campaigns</button></div></li><span class="tp-muted">/</span><li><a href="#">Black Friday</a></li><span class="tp-muted">/</span><li aria-current="page">Email #3</li></ol>
  <ol class="tp-crumbs pills"><li><a href="#">Store</a></li>${i("chevron-right", "icon-sm")}<li><a href="#">Footwear</a></li>${i("chevron-right", "icon-sm")}<li aria-current="page">Runners</li></ol>
  <ol class="tp-crumbs arrows"><li><a href="#">Cart</a></li><li><a href="#">Shipping</a></li><li><span aria-current="step">Payment</span></li><li><a href="#" style="opacity:.6">Review</a></li></ol>
  <div class="card" style="padding:22px"><ol class="tp-crumbs"><li><a href="#">Settings</a></li>${i("chevron-right", "icon-sm")}<li aria-current="page">Members</li></ol><div class="row" style="margin-top:8px;justify-content:space-between"><b class="t-h3">Members</b><button class="btn btn-sm">${i("user-plus")} Invite</button></div></div>
</div>` }] });

  /* ---------------- 15 Sticky header ---------------- */
  TPL.push({ slug: "sticky-header", n: 15, name: "Sticky & Floating Headers", cat: "Navigation", desc: "Scroll inside the frame: the header shrinks into a floating glass pill, a reading-progress bar fills and a floating action bar slides up.",
    variants: [{ name: "Shrinking glass header", html: `<div class="tp-scroller" data-sticky-demo><div class="tp-progress"></div>
  <header class="tp-sticky"><span class="logo-t">Lumen<span class="tp-grad">.</span></span><nav class="tp-nav" style="padding:0"><div class="links"><a href="#">Product</a><a href="#">Pricing</a><a href="#">Blog</a></div></nav><span class="grow" style="flex:1"></span><a class="btn btn-sm" href="#">Get started</a></header>
  <div class="tp-sec" style="padding-top:20px"><span class="tp-eyebrow">Scroll this frame ↓</span><h2 class="tp-h2">The header follows you.</h2><p class="tp-lead">Watch it shrink into a floating pill with a blurred glass background, while the progress bar tracks how far you've read.</p></div>
  <div class="tp-filler">${Array.from({ length: 14 }, (_, k) => `<div class="line${k % 3 === 2 ? " s" : ""}"></div>`).join("")}${img("n3", "", 1200, 500, "", "height:220px")}${Array.from({ length: 10 }, (_, k) => `<div class="line${k % 3 === 1 ? " s" : ""}"></div>`).join("")}</div>
  <div class="tp-fab"><button class="btn btn-ghost btn-sm">${i("thumbs-up", "icon-sm")} 128</button><button class="btn btn-ghost btn-sm">${i("message-square", "icon-sm")} 24</button><button class="btn btn-ghost btn-sm">${i("share-2", "icon-sm")} Share</button><button class="btn btn-sm">Subscribe</button></div>
</div>` }] });

  /* ---------------- 22 Contact ---------------- */
  TPL.push({ slug: "contact", n: 22, name: "Contact Forms", cat: "Forms", desc: "Inquiry form with live validation, a success state and a map. Submit it empty to see the errors.",
    variants: [{ name: "Form + map", html: `<section class="tp-sec"><div class="tp-wrap tp-contact">
  <div><span class="tp-eyebrow">Contact</span><h2 class="tp-h2">Let's talk.</h2><p class="tp-lead">Tell us about your team and we'll get back within one business day.</p>
    <div class="info">${[["mail", "Email", "hello@lumen.app"], ["phone", "Phone", "+1 (415) 555-0132"], ["map-pin", "Office", "55 Market St, San Francisco"]].map(([ic, t, d]) => `<div><span class="tp-ico">${i(ic)}</span><span><b>${t}</b><span>${d}</span></span></div>`).join("")}</div>
    <div class="map"><div class="map-layer" style="position:absolute;inset:0"><svg class="map-base" viewBox="0 0 720 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path class="water" d="M0 230 C120 210 180 260 300 250 S520 200 720 240 V320 H0Z"/><rect class="park" x="430" y="40" width="150" height="90" rx="18"/><path class="road" d="M-10 150 H730"/><path class="road" d="M260 -10 V330"/><path class="road minor" d="M-10 70 C200 60 420 110 730 90"/></svg><span class="map-pin" style="left:40%;top:45%">${i("map-pin")}</span></div></div>
  </div>
  <form data-validate novalidate>
    <div class="two"><div class="field"><label class="label" for="cf-n">Full name <span class="req">*</span></label><input class="input" id="cf-n" required placeholder="Maya Rodriguez"><span class="help" hidden>Please enter your name.</span></div><div class="field"><label class="label" for="cf-e">Work email <span class="req">*</span></label><input class="input" id="cf-e" type="email" required placeholder="maya@company.com"><span class="help" hidden>Enter a valid email.</span></div></div>
    <div class="field"><label class="label" for="cf-c">Company size</label><select class="select" id="cf-c"><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></div>
    <div class="field"><label class="label" for="cf-m">Message <span class="req">*</span></label><textarea class="textarea" id="cf-m" required minlength="10" placeholder="How can we help?"></textarea><span class="help" hidden>Tell us a bit more (10+ characters).</span></div>
    <label class="check"><input type="checkbox" checked> <span class="t-body-sm">Send me product updates</span></label>
    <button class="btn btn-lg" type="submit">Send message ${i("send")}</button>
    <div class="tp-sent"><span class="tp-ico">${i("circle-check")}</span><b class="t-h4">Message sent!</b><p class="t-body-sm text-secondary" style="margin-top:6px">We'll reply within one business day.</p></div>
  </form>
</div></section>` }] });

  /* ---------------- 23 Newsletter ---------------- */
  TPL.push({ slug: "newsletter", n: 23, name: "Newsletter / Lead Capture", cat: "Forms", desc: "Inline card and a dark split card with a photo; both validate and celebrate on submit.",
    variants: [
      { name: "Inline card", html: `<section class="tp-sec tight"><div class="tp-wrap"><div class="tp-news-card" data-anim="up"><div><span class="tp-eyebrow">Newsletter</span><h3 class="tp-h3" style="margin-top:8px">The Monday metric — one chart, every week.</h3><p class="t-body-sm text-secondary" style="margin-top:6px">Join 38,000 operators. Unsubscribe anytime.</p></div><form data-success="You're in! Check your inbox." novalidate><input class="input input-lg" type="email" required placeholder="you@company.com" aria-label="Email"><button class="btn btn-lg" type="submit">Subscribe</button></form></div></div></section>` },
      { name: "Dark split with photo", html: `<section class="tp-sec tight"><div class="tp-wrap"><div class="tp-news-split" data-anim="zoom">${img("n4", "", 900, 700)}<div><span class="tp-eyebrow" style="color:var(--brand-300)">Free guide</span><h3 class="tp-h2" style="font-size:34px">Get the 2026 SaaS Metrics Report</h3><p class="t-body-md" style="color:#b9b9c6;margin-top:10px">Benchmarks from 4,000 companies, in your inbox.</p><form class="row" style="margin-top:20px;flex-wrap:nowrap" data-success="Report on its way ✉️" novalidate><input class="input input-lg" type="email" required placeholder="Work email" aria-label="Work email"><button class="btn btn-lg" type="submit">Send it</button></form></div></div></div></section>` }] });

  /* ---------------- 26 Team ---------------- */
  TPL.push({ slug: "team", n: 26, name: "Team Profiles", cat: "Marketing", desc: "Leadership grid — photos warm from grayscale to color on hover and reveal social links.",
    variants: [{ name: "Leadership grid", html: `<section class="tp-sec"><div class="tp-wrap"><div class="tp-center"><span class="tp-eyebrow">Our team</span><h2 class="tp-h2">The people behind Lumen.</h2><p class="tp-lead">A small, senior team across six time zones.</p></div>
  <div class="tp-team">${[["p6", "Lena Kovač", "CEO & Co-founder", "Previously data lead at Soylent."], ["p2", "Marcus Lee", "CTO & Co-founder", "Built query engines at Initech."], ["p3", "Priya Shah", "VP Product", "Shipped analytics for 10M users."], ["p8", "Tom Becker", "Head of Design", "Designs calm software."]].map(([p, n, r, b], k) => `<div class="tp-member" data-anim="up" style="--d:${k}">${img(p, n, 600, 750, "", "", `<span class="soc"><a href="#" aria-label="Website">${i("globe", "icon-sm")}</a><a href="#" aria-label="Email">${i("mail", "icon-sm")}</a></span>`)}<h4>${n}</h4><span>${r}</span><p>${b}</p></div>`).join("")}</div>
</div></section>` }] });

  /* ---------------- 28 Video / Media ---------------- */
  TPL.push({ slug: "video", n: 28, name: "Video / Media Showcase", cat: "Marketing", desc: "Poster with a pulsing play button that plays the real Facet UI demo video, plus a transcript and a media row.",
    variants: [{ name: "Video with transcript", html: `<section class="tp-sec"><div class="tp-wrap"><div class="tp-center" style="margin-bottom:32px"><span class="tp-eyebrow">See it in action</span><h2 class="tp-h2">A two-minute tour.</h2></div>
  <div class="tp-video" data-video data-anim="zoom">${img("t1", "", 1600, 900, "poster")}<button class="play" aria-label="Play video">${i("play")}</button><div class="cap"><div><b>Product tour</b><span style="display:block">Dashboards, AI answers and sharing</span></div><span class="badge" style="background:rgb(0 0 0 / .5);color:#fff">0:55</span></div><video src="../marketing/media/facet-ui-demo.mp4" playsinline controls preload="none"></video></div>
  <details class="tp-transcript"><summary>${i("file-text", "icon-sm")} Read transcript</summary><ol><li><time>0:00</time>Meet Lumen — analytics your team will actually use.</li><li><time>0:12</time>Connect a source and your first dashboard builds itself.</li><li><time>0:31</time>Ask a question in plain English and get a chart with an explanation.</li><li><time>0:48</time>Share it with a link, or embed it anywhere.</li></ol></details>
  <div class="tp-media-row">${[["w5", "Customer webinar", "24:10"], ["t2", "Building embeds", "8:42"], ["w2", "Ops at Globex", "5:06"]].map(([p, t, d], k) => img(p, t, 800, 500, "zoom", "", `<span class="tag">${i("play", "icon-sm")} ${t} · ${d}</span>`).replace('class="tp-img zoom"', `class="tp-img zoom" data-anim="up" style="--d:${k}"`)).join("")}</div>
</div></section>` }] });

  /* ---------------- 04 Blog ---------------- */
  const posts = [["n5", "Engineering", "How we made dashboards load in 80ms", "A deep dive into our columnar cache and edge rendering.", "p2", "Marcus Lee", "8 min"], ["w7", "Product", "Introducing Lumen AI", "Every chart can now explain itself — and answer follow-ups.", "p3", "Priya Shah", "5 min"], ["n1", "Culture", "Remote, but not distant", "Rituals that keep a six-time-zone team close.", "p6", "Lena Kovač", "6 min"], ["t5", "Data", "The 2026 SaaS metrics report", "Benchmarks from 4,000 companies, free to download.", "p8", "Tom Becker", "12 min"]];
  const post = ([p, c, t, d, a, n, r], k) => `<a class="tp-post" href="#" data-anim="up" style="--d:${k}">${img(p, t, 800, 500, "zoom")}<div class="row"><span class="badge badge-brand">${c}</span><span class="t-caption tp-muted">${r} read</span></div><h3>${t}</h3><p>${d}</p><div class="tp-byline">${av(a, 28)}<b>${n}</b> · Oct ${12 + k}, 2026</div></a>`;
  TPL.push({ slug: "blog", n: 4, name: "Blog", cat: "Content", desc: "Article index with a featured story and a grid, or a list with category sidebar. Images zoom on hover.",
    variants: [
      { name: "Featured + grid", html: `<section class="tp-sec"><div class="tp-wrap"><span class="tp-eyebrow">Blog</span><h2 class="tp-h2">Notes from the team.</h2>
  <a class="tp-feature-post tp-mt" href="#" data-anim="up">${img("w3", "", 1200, 900, "zoom")}<div><div class="row"><span class="badge badge-accent">Featured</span><span class="t-caption tp-muted">10 min read</span></div><h3 class="tp-h2" style="font-size:34px">Why we rebuilt our query engine from scratch</h3><p class="tp-lead">Lessons from rewriting 400k lines of code without stopping the world.</p><div class="tp-byline" style="margin-top:20px">${av("p5", 36)}<span><b>David Chen</b><br>Oct 10, 2026</span></div></div></a>
  <div class="tp-g3 tp-mt">${posts.slice(0, 3).map(post).join("")}</div>
</div></section>` },
      { name: "List with categories", html: `<section class="tp-sec alt"><div class="tp-wrap tp-blog-list"><div>${posts.map(([p, c, t, d, a, n, r], k) => `<a class="tp-blog-row" href="#" data-anim="right" style="--d:${k}">${img(p, t, 500, 380, "zoom")}<div><div class="row"><span class="badge badge-brand">${c}</span><span class="t-caption tp-muted">${r} read</span></div><h3 class="tp-h3" style="margin-top:8px">${t}</h3><p class="t-body-sm text-secondary" style="margin-top:6px">${d}</p><div class="tp-byline" style="margin-top:12px">${av(a, 24)}<b>${n}</b></div></div></a>`).join("")}<nav class="pagination" style="margin-top:24px" aria-label="Pagination"><button class="page-btn">${i("chevron-left")}</button><button class="page-btn" aria-current="page">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">${i("chevron-right")}</button></nav></div>
  <aside><div class="input-group">${i("search")}<input class="input" placeholder="Search articles…" aria-label="Search articles"></div><h5 class="t-overline tp-muted" style="margin:24px 0 10px">CATEGORIES</h5><div class="stack" style="--gap:4px">${[["Engineering", 24], ["Product", 18], ["Culture", 9], ["Data", 31]].map(([c, n]) => `<a class="sidebar-item" href="#">${c}<span class="count">${n}</span></a>`).join("")}</div>${img("n2", "", 500, 400, "", "aspect-ratio:5/4;margin-top:24px")}</aside>
</div></section>` }] });

  /* ---------------- 10 News ---------------- */
  TPL.push({ slug: "news", n: 10, name: "News Articles", cat: "Content", desc: "Press coverage cards with publication marks, pull quotes and dates.",
    variants: [{ name: "Press grid", html: `<section class="tp-sec alt"><div class="tp-wrap"><div class="tp-g2" style="align-items:end"><div><span class="tp-eyebrow">Press</span><h2 class="tp-h2">In the news.</h2></div><p class="tp-lead">Press kit and logos at <a href="#">lumen.app/press</a>.</p></div>
  <div class="tp-g3 tp-mt">${[["Globex", "“The most approachable analytics tool we've tested this year.”", "Product review", "Oct 2, 2026"], ["Hooli", "“Lumen raises $40M to make every chart explain itself.”", "Funding", "Sep 18, 2026"], ["Vandelay", "“How a 30-person startup took on the BI giants.”", "Feature", "Aug 29, 2026"]].map(([pub, q, kind, date], k) => `<a class="tp-news" href="#" data-anim="up" style="--d:${k}">${logo(pub)}<blockquote>${q}</blockquote><footer><span class="badge badge-outline">${kind}</span><span>${date}</span></footer></a>`).join("")}</div>
  <div class="tp-g2 tp-mt">${[["n6", "Company update", "Lumen opens a Lisbon office", "Our second hub brings us closer to European customers."], ["w4", "Announcement", "SOC 2 Type II, achieved", "An independent audit of our security controls, now public."]].map(([p, c, t, d], k) => `<a class="tp-post" href="#" data-anim="up" style="--d:${k}">${img(p, t, 900, 500, "zoom")}<span class="badge badge-brand" style="align-self:flex-start">${c}</span><h3>${t}</h3><p>${d}</p></a>`).join("")}</div>
</div></section>` }] });

  window.TP_HELPERS = { i, img, av, avs, src, logo, MARKS, U, mini };
})();
