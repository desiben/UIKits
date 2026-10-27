/* Business Banking — agent example */
(function () {
  const chart = (c, st = "") => `<div class="chart" data-chart='${JSON.stringify(c)}'${st ? ` style="${st}"` : ""}></div>`;
  const usd = (v) => "$" + Math.round(v).toLocaleString("en-US");
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const cash = [2410, 2350, 2290, 2240, 2205, 2150, 2090, 2040, 1990, 1940, 1890, 1842].map((v) => v * 1000);
  const tx = [
    ["Stripe payout", "Revenue", 48210, "Today", "green"], ["Gusto payroll", "Payroll", -96400, "Oct 15", ""], ["AWS", "Infrastructure", -18760, "Oct 12", ""],
    ["Figma", "Software", -1440, "Oct 10", ""], ["WeWork", "Rent", -12500, "Oct 1", ""], ["Stripe payout", "Revenue", 51880, "Sep 30", "green"],
  ];
  window.APP = {
    brand: "cobalt", name: "Northwind Finance", short: "your finances", icon: "landmark", page: "Overview", org: "Northwind Labs",
    nav: [{ items: [["layout-dashboard", "Overview", "", 1], ["wallet", "Accounts"], ["arrow-left-right", "Transactions", "6"], ["receipt", "Bills", "2"], ["credit-card", "Cards"]] }, { label: "Planning", items: [["trending-up", "Forecast"], ["piggy-bank", "Budgets"], ["users", "Vendors"]] }],
    state: { cash: 1842300, bills: [{ v: "AWS", amt: 18760, due: "Oct 24" }, { v: "Datadog", amt: 4120, due: "Oct 28" }], tx },
    render(s, i) {
      const runway = (s.cash / 142000).toFixed(1);
      return `<div class="surface-head"><div><h1>Good morning, Maya</h1><p>Here's where Northwind Labs stands today.</p></div><div class="row"><button class="btn btn-outline btn-sm">${i("download", "icon-sm")} Export</button><button class="btn btn-sm">${i("send-horizontal", "icon-sm")} New transfer</button></div></div>
      <div class="ai-callout"><span class="ai-mark">${i("sparkles", "icon-sm")}</span><div class="grow"><b>Burn is up 9% this month</b><span>Infrastructure drove most of it. Ask the assistant for a breakdown.</span></div><button class="btn btn-outline btn-sm" onclick="APP_RUN(1)">Explain</button></div>
      <div class="kpi-group">
        <div class="kpi"><span class="kpi-label">Cash balance</span><div class="kpi-row"><span class="kpi-value">${usd(s.cash)}</span></div><span class="trend-chip" data-trend="down">${i("trending-down")} 2.5% MoM</span></div>
        <div class="kpi"><span class="kpi-label">Monthly burn</span><div class="kpi-row"><span class="kpi-value">$142.1k</span></div><span class="trend-chip" data-trend="down">${i("trending-up")} 9.2%</span></div>
        <div class="kpi"><span class="kpi-label">Runway</span><div class="kpi-row"><span class="kpi-value">${runway} mo</span></div><span class="trend-chip" data-trend="neutral">${i("minus")} Target 18 mo</span></div>
        <div class="kpi"><span class="kpi-label">MRR</span><div class="kpi-row"><span class="kpi-value">$98.4k</span></div><span class="trend-chip">${i("trending-up")} 6.8%</span></div>
      </div>
      <div class="g2">
        <div class="widget span-2"><div class="widget-header"><div><span class="widget-title">Cash balance</span><span class="widget-desc">All accounts · last 12 months</span></div></div><div class="widget-content">${chart({ type: "area", height: 200, labels: months, format: "$compact", series: [{ name: "Cash", data: cash.slice(0, 11).concat([s.cash]) }] })}</div></div>
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Spend by category</span><span class="widget-desc">October</span></div></div><div class="widget-content">${chart({ type: "pie", size: 190, format: "$compact", centerSub: "Spent", data: [{ name: "Payroll", value: 96400 }, { name: "Infra", value: 18760 }, { name: "Rent", value: 12500 }, { name: "Software", value: 8240 }, { name: "Other", value: 6200 }] })}</div></div>
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Upcoming bills</span><span class="widget-desc">${s.bills.length ? s.bills.length + " due this month" : "All paid"}</span></div></div><div class="widget-content flush"><div class="list-view" style="border:0;border-radius:0">${s.bills.length ? s.bills.map((b) => `<div class="list-row"><span class="item-card-icon">${i("receipt")}</span><div class="list-main"><b>${b.v}</b><span>Due ${b.due}</span></div><span class="list-meta"><b class="t-label-md" style="color:var(--text-primary)">${usd(b.amt)}</b></span></div>`).join("") : `<div class="empty" style="padding:24px"><span class="icon-wrap">${i("circle-check")}</span><p>Nothing due. Nice.</p></div>`}</div></div></div>
      </div>
      <div class="widget"><div class="widget-header"><div><span class="widget-title">Recent transactions</span><span class="widget-desc">Operating account ••4421</span></div></div><div class="widget-content flush"><div class="table-wrap" style="border:0;border-radius:0"><table class="table"><thead><tr><th>Description</th><th>Category</th><th>Date</th><th class="num">Amount</th></tr></thead><tbody>
        ${s.tx.map(([d, c, a, dt, tone], k) => `<tr class="${s.newTx === k ? "hl-new" : ""}"><td><div class="cell-user"><span class="avatar avatar-sm ${a > 0 ? "av-2" : "av-1"}">${d.slice(0, 2).toUpperCase()}</span><b>${d}</b></div></td><td><span class="badge">${c}</span></td><td>${dt}</td><td class="num" style="color:${a > 0 ? "var(--text-success)" : "inherit"}">${a > 0 ? "+" : "−"}${usd(Math.abs(a))}</td></tr>`).join("")}
      </tbody></table></div></div></div>`;
    },
    agent: {
      name: "Finance copilot", greeting: "How can I help with your money today?", sub: "I can read your accounts, forecast runway and move money — with your approval.",
      prompts: [
        { label: "What's our runway?", hint: "Forecast at current burn", icon: "hourglass", keys: ["runway", "forecast", "cash", "last"],
          steps: [["Reading balances", "3 accounts · $1.84M"], ["Averaging burn", "Last 90 days · $138k/mo"], ["Projecting cash", "Including committed bills"]],
          tool: { name: "ledger.forecast", icon: "trending-up", args: '{ <span class="k">"horizon"</span>: "18m", <span class="k">"method"</span>: "trailing_90d" }', result: "18 months" },
          text: "<p>At the current burn of <strong>$142k/month</strong> you have <strong>13 months of runway</strong> — cash reaches zero around <strong>November 2027</strong>. Cutting infrastructure back to September's level adds about <strong>1.4 months</strong>.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Cash forecast</span><span class="widget-desc">Current burn vs. optimized</span></div></div><div class="widget-content">${chart({ type: "line", height: 170, labels: ["Nov", "Jan", "Mar", "May", "Jul", "Sep", "Nov"], format: "$compact", series: [{ name: "Current", data: [1842, 1558, 1274, 990, 706, 422, 138].map((v) => v * 1000) }, { name: "Optimized", data: [1842, 1586, 1330, 1074, 818, 562, 306].map((v) => v * 1000), dashed: true, color: "var(--chart-2)" }] })}</div></div>` },
        { label: "Why did burn go up?", hint: "Break down this month", icon: "flame", keys: ["burn", "spend", "why", "up", "expens"],
          steps: [["Comparing October to September", ""], ["Grouping by vendor", "42 vendors"]],
          text: "<p>Burn rose <strong>$12k (+9.2%)</strong>. Three vendors explain almost all of it:</p><ul><li><strong>AWS</strong> +$7,940 — a new GPU cluster started Oct 3</li><li><strong>Datadog</strong> +$2,310 — log volume doubled</li><li><strong>Contractors</strong> +$1,800</li></ul>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Change by vendor</span><span class="widget-desc">Oct vs. Sep</span></div></div><div class="widget-content">${chart({ type: "bar", height: 160, labels: ["AWS", "Datadog", "Contract", "Figma", "Other"], format: "$compact", series: [{ name: "Change", data: [7940, 2310, 1800, 240, 410] }] })}</div></div>` },
        { label: "Pay the AWS invoice", hint: "$18,760 · due Oct 24", icon: "send-horizontal", keys: ["pay", "aws", "invoice", "bill", "transfer"],
          steps: [["Finding the invoice", "AWS · INV-88213"], ["Checking balance", "Operating ••4421"]],
          tool: { name: "bills.lookup", icon: "receipt", args: '{ <span class="k">"vendor"</span>: "AWS", <span class="k">"status"</span>: "open" }', result: "1 open bill" },
          text: "<p>I found AWS invoice <strong>INV-88213</strong> for <strong>$18,760.00</strong>, due Oct 24. Paying from Operating ••4421 leaves <strong>$1,823,540</strong>.</p>",
          approval: { tool: "payments.send", icon: "send-horizontal", cta: "Pay $18,760", summary: "Send <b>$18,760.00</b> to <b>Amazon Web Services</b> from Operating ••4421 today?", done: "Payment sent", doneSub: "AWS · $18,760.00", after: "Paid. The bill is cleared and the transaction is at the top of your list.",
            onApprove(s) { s.cash -= 18760; s.bills = s.bills.filter((b) => b.v !== "AWS"); s.tx.unshift(["AWS · INV-88213", "Infrastructure", -18760, "Just now", ""]); s.newTx = 0; } } },
        { label: "Revenue vs. burn", hint: "Last 6 months", icon: "bar-chart-3", keys: ["revenue", "mrr", "profit", "vs"],
          steps: [["Pulling Stripe revenue", "6 months"], ["Matching expenses", ""]],
          text: "<p>Revenue is growing faster than burn — the gap closed by <strong>$21k/month</strong> since May. At this pace you reach break-even in about <strong>11 months</strong>.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Revenue vs. burn</span><span class="widget-desc">May–Oct</span></div></div><div class="widget-content">${chart({ type: "composed", height: 170, labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"], format: "$compact", series: [{ name: "Burn", data: [131, 128, 133, 135, 130, 142].map((v) => v * 1000), type: "bar", color: "var(--chart-6)" }, { name: "Revenue", data: [66, 72, 79, 85, 92, 98].map((v) => v * 1000), type: "line", dots: true }] })}</div></div>` },
      ],
    },
    autoplay: 2,
  };
})();
