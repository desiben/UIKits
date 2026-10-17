/* Facet UI v1.2 registry — Charts + Data display. Pushes into window.FACET_REGISTRY. */
(function () {
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const chart = (cfg, style = "") => `<div class="chart" data-chart='${JSON.stringify(cfg)}'${style ? ` style="${style}"` : ""}></div>`;
  const add = (o) => window.FACET_REGISTRY.push({ isNew: true, ...o });
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mrr = [142, 151, 158, 166, 171, 183, 190, 204, 212, 226, 238, 249];
  const exp = [38, 41, 40, 46, 49, 52, 50, 57, 61, 63, 68, 72];
  const widget = (title, desc, body, legend = "", foot = "") => `<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">${title}</span><span class="widget-desc">${desc}</span></div>${legend}</div>
  <div class="widget-content">${body}</div>${foot ? `\n  <div class="widget-footer">${foot}</div>` : ""}
</div>`;
  const lg = (items) => `<div class="chart-legend">${items.map(([n, c]) => `<span><i style="--c:${c}"></i>${n}</span>`).join("")}</div>`;

  /* ------------------------------ Charts ------------------------------ */
  add({ slug: "area-chart", name: "Area Chart", group: "Charts", figma: "Chart · Area · Default · Stacked · Gaps",
    desc: "Shows a trend over time with a filled area. Stack several series to show composition. Hover to see exact values.",
    examples: [
      { title: "Default", layout: "block", html: widget("Monthly recurring revenue", "Last 12 months", chart({ type: "area", labels: months, format: "$compact", series: [{ name: "MRR", data: mrr.map((v) => v * 1000) }] })) },
      { title: "Stacked", layout: "block", html: widget("Revenue by source", "New vs. expansion", chart({ type: "area", stacked: true, labels: months, format: "$compact", series: [{ name: "New", data: mrr.map((v) => v * 700) }, { name: "Expansion", data: exp.map((v) => v * 1000) }] }), lg([["New", "var(--chart-1)"], ["Expansion", "var(--chart-2)"]])) },
      { title: "Gaps & straight lines", layout: "block", html: widget("Uptime checks", "Missing points are left as gaps", chart({ type: "area", curve: false, labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], format: "percent", max: 100, series: [{ name: "Uptime", data: [99.2, 99.8, null, 98.9, 99.6, 99.9, 99.7], color: "var(--chart-5)" }] })) },
    ],
    react: `<AreaChart data={rows} labels="month" series={[{ key: "mrr", name: "MRR" }]} format="$compact" stacked={false} />`,
    api: [["data-chart", "JSON", "Config: type, labels, series[{name, data, color?}], format, stacked, curve, connectNulls, height"], ["format", "string", "currency · $compact · compact · percent"], ["stacked", "boolean", "Stack area series on top of each other"], ["connectNulls", "boolean", "Bridge gaps (null) instead of breaking the line"]],
    a11y: ["The SVG has role=img and an aria-label — set it with the label option.", "Pair charts with a visible summary (title, key number) so they're not the only source of the data."] });

  add({ slug: "bar-chart", name: "Bar Chart", group: "Charts", figma: "Chart · Bar · Default · Grouped · Stacked",
    desc: "Compares values across categories. Use grouped bars to compare series, stacked bars to show totals and parts.",
    examples: [
      { title: "Default", layout: "block", html: widget("Weekly signups", "Last 8 weeks", chart({ type: "bar", labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], series: [{ name: "Signups", data: [420, 510, 470, 640, 590, 720, 680, 810] }] })) },
      { title: "Grouped", layout: "block", html: widget("Revenue vs. expenses", "2026, in USD", chart({ type: "bar", labels: months.slice(4), format: "$compact", series: [{ name: "Revenue", data: [171, 183, 190, 204, 212, 226, 238, 249].map((v) => v * 1000) }, { name: "Expenses", data: [120, 131, 128, 140, 151, 149, 160, 158].map((v) => v * 1000), color: "var(--chart-6)" }] }), lg([["Revenue", "var(--chart-1)"], ["Expenses", "var(--chart-6)"]])) },
      { title: "Stacked", layout: "block", html: widget("Tickets by channel", "This week", chart({ type: "bar", stacked: true, labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], series: [{ name: "Email", data: [42, 51, 46, 58, 49, 22, 18] }, { name: "Chat", data: [31, 36, 40, 44, 39, 17, 14] }, { name: "Phone", data: [12, 15, 11, 16, 13, 4, 3] }] }), lg([["Email", "var(--chart-1)"], ["Chat", "var(--chart-2)"], ["Phone", "var(--chart-3)"]])) },
    ],
    react: `<BarChart data={rows} labels="week" series={[{ key: "signups" }]} stacked />`,
    api: [["type", "\"bar\"", "Vertical bars"], ["stacked", "boolean", "Stack series per category"], ["barWidth", "0–1", "Share of each category band used by bars (default 0.62)"]],
    a11y: ["Hovering a bar dims the others; the tooltip lists every series value for that category."] });

  add({ slug: "line-chart", name: "Line Chart", group: "Charts", figma: "Chart/Line · Single · Multiple · Target",
    desc: "Shows how one or more values change over time. Dashed lines work well for targets and forecasts.",
    examples: [
      { title: "Multiple series", layout: "block", html: widget("Active users", "Daily, last 14 days", chart({ type: "line", labels: Array.from({ length: 14 }, (_, k) => "Oct " + (k + 2)), format: "compact", series: [{ name: "Web", data: [3200, 3350, 3290, 3510, 3620, 3580, 3790, 3910, 3870, 4020, 4190, 4150, 4320, 4480] }, { name: "Mobile", data: [2100, 2180, 2260, 2240, 2390, 2470, 2450, 2600, 2710, 2690, 2840, 2950, 3010, 3120] }] }), lg([["Web", "var(--chart-1)"], ["Mobile", "var(--chart-2)"]])) },
      { title: "With target and dots", layout: "block", html: widget("Net revenue retention", "Quarterly", chart({ type: "line", labels: ["Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26"], format: "percent", series: [{ name: "NRR", data: [104, 107, 106, 111, 114, 116, 118], dots: true }, { name: "Target", data: [110, 110, 110, 110, 115, 115, 115], dashed: true, color: "var(--chart-6)" }] })) },
    ],
    react: `<LineChart data={rows} series={[{ key: "nrr", dots: true }, { key: "target", dashed: true }]} />`,
    api: [["series[].dashed", "boolean", "Dashed stroke for targets/forecasts"], ["series[].dots", "boolean", "Show a dot on every point"], ["curve", "boolean", "Smooth curves (default) or straight segments"]],
    a11y: ["Don't rely on color alone: dashed vs. solid separates targets from actuals."] });

  add({ slug: "composed-chart", name: "Composed Chart", group: "Charts", figma: "Chart / Composed",
    desc: "Combines bars and lines on the same axes — for example volume as bars and a rate or average as a line.",
    examples: [{ title: "Bars + line", layout: "block", html: widget("Orders and conversion", "Last 8 weeks", chart({ type: "composed", labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], series: [{ name: "Orders", data: [320, 410, 380, 520, 470, 610, 580, 690], type: "bar" }, { name: "Avg. order (×10)", data: [410, 420, 405, 440, 452, 470, 468, 492], type: "line", color: "var(--chart-4)", dots: true }] }), lg([["Orders", "var(--chart-1)"], ["Avg. order", "var(--chart-4)"]])) }],
    react: `<ComposedChart data={rows}><Bar dataKey="orders" /><Line dataKey="aov" /></ComposedChart>`,
    api: [["series[].type", "\"bar\" | \"line\" | \"area\"", "Per-series mark type"]],
    a11y: ["Explain both measures in the widget description when they use different units."] });

  add({ slug: "pie-chart", name: "Pie Chart", group: "Charts", figma: "Chart / Pie · Donut",
    desc: "Shows parts of a whole. Prefer the donut with a total in the middle; keep it to six slices or fewer.",
    examples: [
      { title: "Donut", layout: "block", html: widget("Revenue by plan", "October 2026", chart({ type: "pie", format: "$compact", centerSub: "MRR", data: [{ name: "Scale", value: 114500 }, { name: "Growth", value: 69700 }, { name: "Starter", value: 39800 }, { name: "Add-ons", value: 24900 }] })) },
      { title: "Pie", layout: "block", html: widget("Traffic sources", "Last 30 days", chart({ type: "pie", donut: false, size: 200, data: [{ name: "Organic", value: 46 }, { name: "Direct", value: 24 }, { name: "Referral", value: 18 }, { name: "Paid", value: 12 }] })) },
    ],
    react: `<PieChart data={plans} donut centerSub="MRR" format="$compact" />`,
    api: [["data", "[{name, value, color?}]", "Slices"], ["donut", "boolean", "Donut (default) or full pie"], ["centerLabel / centerSub", "string", "Text in the middle of the donut"]],
    a11y: ["The legend shows the percentage of each slice as text."] });

  add({ slug: "radar-chart", name: "Radar Chart", group: "Charts", figma: "Chart / Radar",
    desc: "Compares several qualities at once — plan features, skill profiles, product scores.",
    examples: [{ title: "Two series", layout: "block", html: widget("Plan comparison", "Scores out of 100", chart({ type: "radar", max: 100, labels: ["Speed", "Security", "Support", "Integrations", "Analytics", "Price"], series: [{ name: "Growth", data: [72, 80, 64, 70, 58, 86] }, { name: "Scale", data: [90, 96, 92, 88, 90, 60] }] })) }],
    react: `<RadarChart labels={axes} series={[{ name: "Growth", data }]} max={100} />`,
    api: [["labels", "string[]", "Axes"], ["max", "number", "Outer ring value"]], a11y: ["Keep axis labels short so they fit around the chart on mobile."] });

  add({ slug: "radial-chart", name: "Radial Chart", group: "Charts", figma: "Chart / Radial · Gauge",
    desc: "Progress toward a goal as rings or a half gauge. Good for quotas, storage and scores.",
    examples: [
      { title: "Rings", layout: "block", html: widget("Quarterly goals", "Progress toward target", chart({ type: "radial", format: "percent", data: [{ name: "Revenue", value: 82 }, { name: "Pipeline", value: 64 }, { name: "Retention", value: 91 }] })) },
      { title: "Half gauge", layout: "block", html: `<div class="card card-body" style="width:300px;margin:auto">${chart({ type: "radial", half: true, size: 240, format: "percent", centerSub: "Storage used", data: [{ name: "Storage", value: 68 }] })}<div class="row" style="justify-content:space-between;margin-top:4px" ><span class="t-body-xs text-tertiary">68 GB of 100 GB</span><a class="link t-label-sm" href="#">Upgrade</a></div></div>` },
    ],
    react: `<RadialChart data={[{ name: "Storage", value: 68 }]} half />`,
    api: [["half", "boolean", "Half-circle gauge"], ["thickness", "number", "Ring thickness"], ["data[].max", "number", "Per-ring maximum (default 100)"]], a11y: ["Show the value as text in the center or next to the chart."] });

  add({ slug: "chart-tooltip", name: "Chart Tooltip", group: "Charts", figma: "Chart Tooltip · 1, 2 or 3 rows",
    desc: "The floating panel that shows exact values under the cursor. Every Facet chart includes it; it's also available as plain markup for custom charts.",
    examples: [{ title: "Static markup", html: `<div class="chart-tooltip on" style="position:static">
  <b>October 2026</b>
  <div><i style="--c:var(--chart-1)"></i>Revenue<span>$238,400</span></div>
  <div><i style="--c:var(--chart-2)"></i>Expansion<span>$68,100</span></div>
  <div><i style="--c:var(--chart-6)"></i>Churned<span>−$4,900</span></div>
</div>` }, { title: "On a chart (hover)", layout: "block", html: widget("Hover the chart", "Crosshair, dots and tooltip follow the pointer", chart({ type: "area", labels: months, format: "$compact", series: [{ name: "Revenue", data: mrr.map((v) => v * 1000) }, { name: "Expansion", data: exp.map((v) => v * 1000) }] })) }],
    react: `<ChartTooltip label="October 2026" items={[{ name: "Revenue", value: 238400 }]} />`,
    api: [["tooltip", "boolean", "Set false in a chart config to hide it"], [".chart-tooltip.on", "class", "Visible state"]], a11y: ["Tooltips are a convenience — key numbers should also be visible without hovering."] });

  /* ------------------------------ Data display ------------------------------ */
  add({ slug: "widget", name: "Widget", group: "Data display", figma: "Widget · Header · Content · Footer · Legend",
    desc: "A dashboard container: a soft outer shell with a title, description and legend, and an elevated content area for a chart, table or KPIs.",
    examples: [
      { title: "With chart and footer", layout: "block", html: widget("Revenue", "Daily MRR · last 30 days", chart({ type: "area", height: 180, labels: Array.from({ length: 30 }, (_, k) => "Oct " + (k + 1)), format: "$compact", series: [{ name: "MRR", data: Array.from({ length: 30 }, (_, k) => Math.round(212000 + k * 1250 + Math.sin(k / 2) * 4000)) }] }), lg([["MRR", "var(--chart-1)"]]), `${i("clock", "icon-sm")} Updated 4 min ago<span style="margin-left:auto"><a class="link t-label-sm" href="#">View report</a></span>`) },
      { title: "Dashboard grid", layout: "block", html: `<div class="widget-grid" style="width:100%">
  ${widget("Plan mix", "Active subscriptions", chart({ type: "pie", size: 180, format: "compact", centerSub: "Accounts", data: [{ name: "Scale", value: 214 }, { name: "Growth", value: 512 }, { name: "Starter", value: 558 }] }))}
  ${widget("Goals", "Q4 progress", chart({ type: "radial", size: 180, format: "percent", data: [{ name: "Revenue", value: 82 }, { name: "Pipeline", value: 64 }] }))}
</div>` },
      { title: "With table (flush)", layout: "block", html: `<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Top accounts</span><span class="widget-desc">By MRR</span></div><button class="btn btn-ghost btn-sm" style="margin-left:auto">View all ${i("arrow-right", "icon-sm")}</button></div>
  <div class="widget-content flush"><table class="table"><thead><tr><th>Account</th><th>Plan</th><th class="num">MRR</th></tr></thead><tbody>
    <tr><td><div class="cell-user"><span class="avatar avatar-sm av-1">NW</span><b>Northwind</b></div></td><td><span class="badge badge-brand">Scale</span></td><td class="num">$12,400</td></tr>
    <tr><td><div class="cell-user"><span class="avatar avatar-sm av-2">GL</span><b>Globex</b></div></td><td><span class="badge">Growth</span></td><td class="num">$8,950</td></tr>
    <tr><td><div class="cell-user"><span class="avatar avatar-sm av-4">IN</span><b>Initech</b></div></td><td><span class="badge">Growth</span></td><td class="num">$6,120</td></tr>
  </tbody></table></div>
</div>` },
    ],
    react: `<Widget><Widget.Header><Widget.Title>Revenue</Widget.Title><Widget.Legend>…</Widget.Legend></Widget.Header><Widget.Content>…</Widget.Content></Widget>`,
    api: [["widget · widget-header · widget-title · widget-desc · widget-content · widget-footer", "class", "Parts"], ["widget-content.flush", "class", "Edge-to-edge content (tables)"], ["widget-grid", "class", "Responsive grid of widgets"]],
    a11y: ["Use a real heading (h2/h3) for the title if widgets are page sections."] });

  add({ slug: "kpi", name: "KPI", group: "Data display", figma: "KPI · Default · Sparkline · Icon + Footer · Progress",
    desc: "A key number with its label, trend and optional sparkline, progress or footer.",
    examples: [
      { title: "Variants", html: `<div class="card kpi" style="width:260px"><div class="kpi-head"><span class="kpi-label">Monthly recurring revenue</span><button class="btn btn-ghost btn-sm icon-btn" aria-label="More">${i("more-horizontal")}</button></div><div class="kpi-row"><span class="kpi-value">$248,920</span><span class="trend-chip">${i("trending-up")} 12.4%</span></div>${chart({ type: "spark", height: 48, tooltip: false, series: [{ name: "MRR", data: mrr }] }, "margin-top:8px")}</div>
<div class="card kpi" style="width:260px"><div class="kpi-head"><span class="kpi-icon" data-status="success">${i("users")}</span><span class="kpi-label">Active customers</span></div><div class="kpi-row"><span class="kpi-value">1,284</span><span class="trend-chip">${i("trending-up")} 3.1%</span></div><div class="kpi-footer"><span>vs. last month</span><span>+39</span></div></div>
<div class="card kpi" style="width:260px"><div class="kpi-head"><span class="kpi-icon" data-status="warning">${i("gauge")}</span><span class="kpi-label">Quota attainment</span></div><div class="kpi-row"><span class="kpi-value">72%</span><span class="trend-chip" data-trend="neutral">${i("minus")} 0.0%</span></div><div class="progress progress-sm kpi-progress"><span style="--value:72%"></span></div></div>` },
    ],
    react: `<KPI><KPI.Header><KPI.Title>MRR</KPI.Title><KPI.Actions /></KPI.Header><KPI.Value value={248920} /><KPI.Trend value={12.4} /><KPI.Chart data={mrr} /></KPI>`,
    api: [["kpi-head · kpi-icon[data-status] · kpi-row · kpi-value · kpi-footer · kpi-progress", "class", "Parts"], ["chart type spark", "chart", "Sparkline with no axes"]], a11y: ["Don't encode trend only with color — the chip shows an arrow and a sign."] });

  add({ slug: "kpi-group", name: "KPI Group", group: "Data display", figma: "KPI Group · 2–5 items",
    desc: "Several KPIs joined into one card with shared dividers. It wraps to two columns, then one, on smaller screens.",
    examples: [{ title: "Four metrics", layout: "block", html: `<div class="kpi-group" style="width:100%">
  <div class="kpi"><span class="kpi-label">MRR</span><div class="kpi-row"><span class="kpi-value">$248.9k</span><span class="trend-chip">${i("trending-up")} 12.4%</span></div></div>
  <div class="kpi"><span class="kpi-label">Customers</span><div class="kpi-row"><span class="kpi-value">1,284</span><span class="trend-chip">${i("trending-up")} 3.1%</span></div></div>
  <div class="kpi"><span class="kpi-label">Net retention</span><div class="kpi-row"><span class="kpi-value">118%</span><span class="trend-chip">${i("trending-up")} 2 pt</span></div></div>
  <div class="kpi"><span class="kpi-label">Churn</span><div class="kpi-row"><span class="kpi-value">2.4%</span><span class="trend-chip" data-trend="down">${i("trending-up")} 0.3 pt</span></div></div>
</div>` }],
    react: `<KPIGroup>{metrics.map((m) => <KPI key={m.id} {...m} />)}</KPIGroup>`, api: [["kpi-group", "class", "Grid container with joined borders"]], a11y: ["Order KPIs by importance — on mobile they stack in source order."] });

  add({ slug: "item-card", name: "Item Card", group: "Data display", figma: "Item Card · 5 variants · Show icon",
    desc: "A horizontal row card with an icon, title, description and an optional trailing action (switch, select, chevron).",
    examples: [
      { title: "Variants", layout: "block", html: `<div class="stack" style="--gap:10px;max-width:440px;margin:auto">
  <div class="item-card"><span class="item-card-icon brand">${i("shield-check")}</span><div class="item-card-content"><span class="item-card-title">Two-factor authentication</span><span class="item-card-desc">Protect your account with an authenticator app</span></div><div class="item-card-action"><label class="switch"><input type="checkbox" role="switch" checked aria-label="Two-factor"></label></div></div>
  <div class="item-card" data-variant="secondary"><span class="item-card-icon">${i("smartphone")}</span><div class="item-card-content"><span class="item-card-title">iPhone 16 Pro</span><span class="item-card-desc">Last active 2 min ago · San Francisco</span></div><div class="item-card-action"><span class="badge badge-success"><span class="dot"></span>This device</span></div></div>
  <a class="item-card" data-variant="outline" href="#"><span class="item-card-icon">${i("credit-card")}</span><div class="item-card-content"><span class="item-card-title">Visa ending 4242</span><span class="item-card-desc">Expires 08/28</span></div><div class="item-card-action">${i("chevron-right")}</div></a>
  <div class="item-card" data-variant="transparent"><div class="item-card-content"><span class="item-card-title">Title only, no icon</span></div><div class="item-card-action"><select class="select select-sm" style="width:auto" aria-label="Frequency"><option>Weekly</option><option>Daily</option></select></div></div>
</div>` },
    ],
    react: `<ItemCard variant="secondary"><ItemCard.Icon>…</ItemCard.Icon><ItemCard.Content><ItemCard.Title>…</ItemCard.Title></ItemCard.Content><ItemCard.Action>…</ItemCard.Action></ItemCard>`,
    api: [["data-variant", "default · secondary · tertiary · outline · transparent", "Surface style"], ["a.item-card / [data-pressable]", "element", "Pressable rows get a hover state"]], a11y: ["When the whole card is a link, don't put other buttons inside it."] });

  add({ slug: "item-card-group", name: "Item Card Group", group: "Data display", figma: "Item Card Group · joined · list · grid",
    desc: "Arranges item cards as a spaced list, a joined list with dividers, or a responsive grid, with an optional section header.",
    examples: [
      { title: "Joined (settings list)", layout: "block", html: `<div class="item-card-group joined" style="max-width:440px;margin:auto">
  <header>Notifications</header>
  <div class="item-card"><span class="item-card-icon">${i("mail")}</span><div class="item-card-content"><span class="item-card-title">Email</span><span class="item-card-desc">Weekly digest and mentions</span></div><div class="item-card-action"><label class="switch"><input type="checkbox" role="switch" checked aria-label="Email"></label></div></div>
  <div class="item-card"><span class="item-card-icon">${i("bell")}</span><div class="item-card-content"><span class="item-card-title">Push</span><span class="item-card-desc">Only direct messages</span></div><div class="item-card-action"><label class="switch"><input type="checkbox" role="switch" aria-label="Push"></label></div></div>
  <div class="item-card"><span class="item-card-icon">${i("message-square")}</span><div class="item-card-content"><span class="item-card-title">Slack</span><span class="item-card-desc">#sales-alerts</span></div><div class="item-card-action">${i("chevron-right")}</div></div>
</div>` },
      { title: "Grid", layout: "block", html: `<div class="item-card-group grid" style="width:100%">
  <header>Connected apps <a class="link t-label-sm" href="#" style="text-transform:none;letter-spacing:0">Browse</a></header>
  ${[["database", "Postgres", "Synced 2 min ago"], ["cloud", "S3 bucket", "3 folders"], ["git-branch", "GitHub", "facet/ui"], ["message-square", "Slack", "2 channels"]].map(([ic, t, d]) => `<a class="item-card" href="#"><span class="item-card-icon brand">${i(ic)}</span><div class="item-card-content"><span class="item-card-title">${t}</span><span class="item-card-desc">${d}</span></div></a>`).join("\n  ")}
</div>` },
    ],
    react: `<ItemCardGroup layout="joined" title="Notifications">…</ItemCardGroup>`, api: [["item-card-group", "class", "Spaced list"], [".joined", "class", "One card with dividers"], [".grid", "class", "Responsive grid"]], a11y: ["Use a list (ul/li) when the group is a navigational list."] });

  add({ slug: "list-view", name: "List View", group: "Data display", figma: "List View · List Row",
    desc: "A selectable list of rows with a leading avatar or icon, two lines of text and trailing metadata — for inboxes, files and people.",
    examples: [{ title: "Selectable", layout: "block", html: `<div class="list-view" style="max-width:520px;margin:auto">
  <div class="list-view-head">${i("inbox")} Inbox <span class="badge" style="margin-left:auto">12 unread</span></div>
  <div class="list-row" data-interactive aria-selected="true"><span class="avatar av-1">MC</span><div class="list-main"><b>Maya Chen</b><span>Q4 pricing proposal — final numbers attached</span></div><span class="list-meta">9:41</span></div>
  <div class="list-row" data-interactive><span class="avatar av-3">JR</span><div class="list-main"><b>Jonas Richter</b><span>Re: Security review for Globex</span></div><span class="list-meta hide-sm">Yesterday</span></div>
  <div class="list-row" data-interactive><span class="avatar av-4">AK</span><div class="list-main"><b>Aiko Kato</b><span>Design sync notes and next steps</span></div><span class="list-meta hide-sm">Mon</span></div>
</div>` }],
    react: `<ListView selectionMode="single">{threads.map((t) => <ListView.Item key={t.id}>…</ListView.Item>)}</ListView>`, api: [["list-row[aria-selected]", "attribute", "Selected row with the signal rail"], [".hide-sm", "class", "Hidden when the list is under 420px wide"]], a11y: ["Use role=listbox with aria-selected for single-select lists."] });

  add({ slug: "agenda", name: "Agenda", group: "Data display", figma: "Agenda · Day · Event",
    desc: "A day-by-day list of events with times, colored categories and the current event highlighted.",
    examples: [{ title: "Two days", layout: "block", html: `<div class="agenda" style="max-width:560px;margin:auto">
  <div class="agenda-day"><div class="agenda-date today"><b>18</b><span>Wed · Today</span></div><div class="agenda-list">
    <div class="agenda-event"><time>9:00–9:30</time><div style="min-width:0"><b>Standup</b><span>Product team · Zoom</span></div><span class="avatar-group"><span class="avatar avatar-xs av-1">MC</span><span class="avatar avatar-xs av-2">JR</span></span></div>
    <div class="agenda-event now" data-tone="lime"><time>11:00–12:00</time><div style="min-width:0"><b>Northwind renewal call</b><span>Now · Room 4B</span></div><button class="btn btn-sm">Join</button></div>
    <div class="agenda-event" data-tone="amber"><time>15:30–16:00</time><div style="min-width:0"><b>Design review</b><span>Onboarding v2</span></div></div>
  </div></div>
  <div class="agenda-day"><div class="agenda-date"><b>19</b><span>Thu</span></div><div class="agenda-list">
    <div class="agenda-event" data-tone="rose"><time>All day</time><div style="min-width:0"><b>Offsite — Lisbon</b><span>Leadership team</span></div></div>
  </div></div>
</div>` }],
    react: `<Agenda days={days} renderEvent={(e) => <Agenda.Event {...e} />} />`, api: [["agenda-event[data-tone]", "lime · amber · rose · blue", "Category color (rail)"], [".now", "class", "Highlights the current event"]], a11y: ["Use <time datetime> for event times."] });

  add({ slug: "action-bar", name: "Action Bar", group: "Data display", figma: "Action Bar",
    desc: "A floating bar that appears when items are selected and offers bulk actions. On small screens labels collapse to icons.",
    examples: [{ title: "Bulk actions", layout: "block", html: `<div class="action-bar">
  <span class="count"><b>3</b> selected</span>
  <button class="btn btn-ghost btn-sm">${i("archive")} <span class="label-text">Archive</span></button>
  <button class="btn btn-ghost btn-sm">${i("tag")} <span class="label-text">Label</span></button>
  <button class="btn btn-ghost btn-sm">${i("download")} <span class="label-text">Export</span></button>
  <button class="btn btn-destructive btn-sm">${i("trash-2")} <span class="label-text">Delete</span></button>
  <button class="btn btn-ghost btn-sm icon-btn" aria-label="Clear selection">${i("x")}</button>
</div>` }],
    react: `<ActionBar isOpen={selected.size > 0} count={selected.size}>…</ActionBar>`, api: [[".floating", "class", "Sticks to the bottom of the scroll area and rises in"]], a11y: ["Announce the selection count with aria-live=polite.", "Escape should clear the selection."] });

  add({ slug: "carousel", name: "Carousel", group: "Data display", figma: "Carousel · Slide · Dots",
    desc: "Swipeable slides with scroll-snap, arrow buttons and dots. Add data-peek to show part of the next slide on wider screens.",
    examples: [{ title: "Peek", layout: "block", html: `<div class="carousel" data-peek style="max-width:640px;margin:auto">
  <div class="carousel-track">
    <div class="carousel-slide"><div><b>Facet cut</b><span>The signature corner</span></div></div>
    <div class="carousel-slide" style="background:linear-gradient(135deg,var(--lagoon-500),var(--lagoon-800))"><div><b>6 brands</b><span>Switch with one variable</span></div></div>
    <div class="carousel-slide" style="background:linear-gradient(135deg,var(--ember-500),var(--rose-700))"><div><b>Live code</b><span>Tokens, CSS and React</span></div></div>
    <div class="carousel-slide" style="background:linear-gradient(135deg,var(--ink-700),var(--ink-950))"><div><b>Dark mode</b><span>Every component</span></div></div>
  </div>
  <button class="btn btn-outline btn-sm icon-btn carousel-nav prev" aria-label="Previous">${i("chevron-left")}</button>
  <button class="btn btn-outline btn-sm icon-btn carousel-nav next" aria-label="Next">${i("chevron-right")}</button>
  <div class="carousel-dots"></div>
</div>` }],
    react: `<Carousel opts={{ align: "start" }}><Carousel.Content>…</Carousel.Content><Carousel.Previous /><Carousel.Next /></Carousel>`, api: [["data-peek", "attribute", "46% slides from 640px"], ["data-autoplay", "ms", "Advance automatically (pauses on hover)"]], a11y: ["Don't autoplay content people need to read.", "Arrow buttons have labels; dots are buttons."] });

  add({ slug: "data-grid", name: "Data Grid", group: "Data display", figma: "Data Grid · Cell · Header",
    desc: "A spreadsheet-like grid: select a cell, move with arrow keys, press Enter or double-click to edit. Totals recalculate. Sticky header and first column.",
    examples: [{ title: "Editable", layout: "block", html: `<div class="data-grid" tabindex="0" style="max-width:100%">
  <div class="data-grid-bar"><span class="badge badge-outline fx-ref mono">B2</span><span class="fx"><i>fx</i><span>$12,400</span></span><button class="btn btn-outline btn-sm">${i("plus")} Row</button></div>
  <table><thead><tr><th class="rownum"></th><th>Account</th><th class="num">MRR</th><th class="num">Seats</th><th>Owner</th><th>Status</th></tr></thead><tbody>
    <tr><td class="rownum">1</td><td data-edit>Northwind</td><td class="num" data-edit>12,400</td><td class="num" data-edit>120</td><td data-edit>Maya</td><td><span class="badge badge-success"><span class="dot"></span>Active</span></td></tr>
    <tr><td class="rownum">2</td><td data-edit>Globex</td><td class="num" data-edit>8,950</td><td class="num" data-edit>85</td><td data-edit>Jonas</td><td><span class="badge badge-warning"><span class="dot"></span>Renewal</span></td></tr>
    <tr><td class="rownum">3</td><td data-edit>Initech</td><td class="num" data-edit>6,120</td><td class="num" data-edit>60</td><td data-edit>Aiko</td><td><span class="badge badge-success"><span class="dot"></span>Active</span></td></tr>
    <tr><td class="rownum">4</td><td data-edit>Umbrella</td><td class="num" data-edit>2,115</td><td class="num" data-edit>20</td><td data-edit>Maya</td><td><span class="badge badge-danger"><span class="dot"></span>At risk</span></td></tr>
    <tr><td class="rownum">Σ</td><td><b>Total</b></td><td class="num formula" data-sum="2" data-prefix="$"></td><td class="num formula" data-sum="3"></td><td></td><td></td></tr>
  </tbody></table>
</div>` }],
    react: `<DataGrid columns={cols} rows={rows} onCellEdit={save} pinnedColumns={1} />`, api: [["td[data-edit]", "attribute", "Editable cell"], ["td[data-sum]", "column index", "Live total of a column"], [".fx", "class", "Formula bar mirrors the selected cell"]], a11y: ["Use role=grid with aria-rowindex/colindex for large production grids.", "Arrow keys move, Enter/F2 edits, Escape cancels."] });

  add({ slug: "file-tree", name: "File Tree", group: "Data display", figma: "File Tree · Folder · File",
    desc: "A nested, collapsible tree of folders and files with indent guides, selection and status dots.",
    examples: [{ title: "Project files", html: `<div class="card file-tree" style="width:280px">
  <ul>
    <li><details open><summary class="ft-row">${i("chevron-right", "chev")}${i("folder", "folder-closed")}${i("folder-open", "folder-open")}src</summary>
      <ul>
        <li><details open><summary class="ft-row">${i("chevron-right", "chev")}${i("folder", "folder-closed")}${i("folder-open", "folder-open")}components</summary>
          <ul><li><div class="ft-row" aria-selected="true">${i("file-code")}button.tsx<span class="ft-dot" title="Modified"></span></div></li><li><div class="ft-row">${i("file-code")}card.tsx</div></li></ul></details></li>
        <li><div class="ft-row">${i("file-code")}tokens.css<span class="meta">16 KB</span></div></li>
      </ul></details></li>
    <li><details><summary class="ft-row">${i("chevron-right", "chev")}${i("folder", "folder-closed")}${i("folder-open", "folder-open")}public</summary><ul><li><div class="ft-row">${i("file-image")}logo.svg</div></li></ul></details></li>
    <li><div class="ft-row">${i("file-text")}README.md</div></li>
  </ul>
</div>` }],
    react: `<FileTree items={tree} selectedKey="button.tsx" onSelect={open} />`, api: [["details/summary.ft-row", "element", "Folder (native open/close)"], ["ft-row[aria-selected]", "attribute", "Selected item"], [".ft-dot / .meta", "class", "Status dot / trailing metadata"]], a11y: ["For large trees use role=tree with arrow-key navigation."] });

  add({ slug: "floating-toc", name: "Floating TOC", group: "Data display", figma: "Floating TOC · collapsed · open",
    desc: "A minimal table of contents: short bars mark each heading and expand into a panel on hover or focus. The active heading follows the scroll.",
    examples: [{ title: "Hover the bars", layout: "left", html: `<div style="display:flex;gap:16px;align-items:flex-start;min-height:200px">
  <nav class="floating-toc" aria-label="On this page">
    <a href="#ftoc-a" class="on"></a><a href="#ftoc-b" class="lvl-2"></a><a href="#ftoc-c" class="lvl-2"></a><a href="#ftoc-d"></a>
    <div class="floating-toc-panel"><a href="#ftoc-a" class="on">Overview</a><a href="#ftoc-b" class="lvl-2">Installation</a><a href="#ftoc-c" class="lvl-2">Theming</a><a href="#ftoc-d">API reference</a></div>
  </nav>
  <div class="t-body-sm text-tertiary" style="max-width:360px">Hover or tab into the bars on the left. In a real page each link points at a heading id, and the active bar follows the scroll position.</div>
</div>` }],
    react: `<FloatingTOC items={headings} />`, api: [["a.lvl-2", "class", "Second-level heading"], ["a.on", "class", "Active heading"]], a11y: ["The panel opens on keyboard focus, not only on hover."] });

  add({ slug: "holo-card", name: "Holo Card", group: "Data display", figma: "Holo Card · membership · credit",
    desc: "A card that tilts in 3D with a holographic glare that follows the pointer — for memberships, passes and collectibles. Flat when motion is reduced.",
    examples: [{ title: "Membership & card", html: `<div class="holo-card"><div class="holo-surface"><span class="holo-inset"></span><div class="row" style="justify-content:space-between"><b class="t-label-lg">Facet Pro</b><span class="badge badge-accent">Founding member</span></div><div><div class="t-caption" style="opacity:.75">Member since 2026</div><div class="holo-num">MAYA RODRIGUEZ</div></div></div></div>
<div class="holo-card" style="--holo-bg:linear-gradient(135deg,#0b2e2b,#0f6b64 50%,#06201e)"><div class="holo-surface"><span class="holo-inset"></span><div class="row" style="justify-content:space-between"><span class="holo-chip"></span><b class="t-label-md">Northwind Bank</b></div><div><div class="holo-num">4242 •••• •••• 9018</div><div class="row" style="justify-content:space-between;margin-top:8px"><span class="t-caption" style="opacity:.8">M. RODRIGUEZ</span><span class="t-caption" style="opacity:.8">08/28</span></div></div></div></div>` }],
    react: `<HoloCard gradient="…"><HoloCard.Content>…</HoloCard.Content></HoloCard>`, api: [["--holo-bg", "CSS var", "Card background gradient"], ["data-static", "attribute", "Turns off tilt and glare"], ["data-tilt", "number", "Max tilt in degrees (default 14)"]], a11y: ["Keep text contrast high — the glare is decorative only.", "Respects prefers-reduced-motion."] });

  add({ slug: "map", name: "Map", group: "Data display", figma: "Map · Pin · Popup · Controls",
    desc: "A lightweight, illustrative map surface with pins, a popup, an animated route and zoom controls. Swap the base for real tiles (Mapbox, MapLibre) in production.",
    examples: [{ title: "Route with pins", layout: "block", html: `<div class="map" style="height:320px;max-width:720px;margin:auto">
  <div class="map-layer" style="position:absolute;inset:0"><svg class="map-base" viewBox="0 0 720 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="water" d="M0 230 C120 210 180 260 300 250 S520 200 720 240 V320 H0Z"/><rect class="park" x="430" y="40" width="150" height="90" rx="18"/><circle class="park" cx="120" cy="90" r="46"/>
    <path class="road" d="M-10 150 H730"/><path class="road" d="M260 -10 V330"/><path class="road minor" d="M-10 70 C200 60 420 110 730 90"/><path class="road minor" d="M520 -10 C500 120 560 200 540 330"/><path class="road minor" d="M80 -10 C110 120 60 220 120 330"/>
    <path class="route" d="M150 190 C220 150 250 150 260 150 S400 150 470 135 S560 115 598 112"/>
  </svg>
  <span class="map-dot" style="left:21%;top:59%"></span>
  <span class="map-pin" style="left:83%;top:36%" data-popup="mp1">${i("map-pin")}</span>
  <span class="map-pin alt" style="left:36%;top:47%">${i("coffee")}</span>
  <div class="map-popup" id="mp1" style="left:78%;top:36%"><b>Northwind HQ</b>14 min · 3.2 mi via Market St</div></div>
  <div class="map-controls"><button data-zoom="in" aria-label="Zoom in">${i("plus")}</button><button data-zoom="out" aria-label="Zoom out">${i("minus")}</button></div>
  <span class="map-chip">${i("navigation", "icon-sm")} 14 min · Fastest route</span>
</div>` }],
    react: `<Map center={sf} zoom={12}><Map.Marker coords={hq} /><Map.Route path={route} /></Map>`, api: [["map-pin[data-popup]", "id", "Toggles the popup"], ["map-controls [data-zoom]", "in | out", "Zoom the map layer"], [".route", "class", "Animated dashed route"]], a11y: ["Provide the same information as text (address, ETA) next to the map."] });
})();
