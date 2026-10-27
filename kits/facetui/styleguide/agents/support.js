/* Support — agent example */
(function () {
  const chart = (c) => `<div class="chart" data-chart='${JSON.stringify(c)}'></div>`;
  window.APP = {
    brand: "forest", name: "Helpdesk", short: "the queue", icon: "life-buoy", page: "Queue", org: "Northwind Support",
    nav: [{ items: [["inbox", "Queue", "42", 1], ["user", "Mine", "7"], ["circle-alert", "Breaching", "3"], ["circle-check", "Solved"]] }, { label: "Insights", items: [["bar-chart-3", "Reports"], ["users-round", "Team"], ["book-open", "Knowledge base"]] }],
    state: {
      t: [["#4821", "Can't export invoices to CSV", "Globex", "High", "18m left", "", "warning"], ["#4819", "SSO login loop after update", "Initech", "Urgent", "Breached", "", "danger"], ["#4816", "Charged twice for October", "Umbrella", "High", "Breached", "", "danger"], ["#4812", "Add teammate to workspace", "Soylent", "Low", "6h left", "Aiko", ""], ["#4809", "API rate limit question", "Hooli", "Normal", "3h left", "Jonas", ""], ["#4802", "Feature request: dark mode PDF", "Pied Piper", "Low", "1d left", "", ""]],
    },
    render(s, i) {
      const breach = s.t.filter((r) => r[4] === "Breached").length;
      return `<div class="surface-head"><div><h1>Queue</h1><p>${s.t.length} open · ${breach} breaching SLA</p></div><div class="row"><button class="btn btn-outline btn-sm" onclick="APP_RUN(1)">${i("sparkles", "icon-sm")} Triage with AI</button></div></div>
      <div class="kpi-group"><div class="kpi"><span class="kpi-label">Open tickets</span><span class="kpi-value">42</span><span class="trend-chip" data-trend="down">${i("trending-up")} 8</span></div><div class="kpi"><span class="kpi-label">SLA breaches</span><span class="kpi-value">${breach}</span><span class="trend-chip" data-trend="${breach ? "down" : "neutral"}">${i(breach ? "circle-alert" : "check")} ${breach ? "Act now" : "None"}</span></div><div class="kpi"><span class="kpi-label">CSAT</span><span class="kpi-value">91%</span><span class="trend-chip" data-trend="down">${i("trending-down")} 3 pt</span></div><div class="kpi"><span class="kpi-label">First response</span><span class="kpi-value">1h 12m</span><span class="trend-chip">${i("trending-down")} 9m</span></div></div>
      <div class="widget"><div class="widget-header"><div><span class="widget-title">Tickets</span><span class="widget-desc">Sorted by SLA</span></div></div><div class="widget-content flush"><div class="table-wrap" style="border:0;border-radius:0"><table class="table"><thead><tr><th>Ticket</th><th>Customer</th><th>Priority</th><th>SLA</th><th>Assignee</th></tr></thead><tbody>
        ${s.t.map(([id, sub, c, p, sla, a, tone]) => `<tr class="${s.changed && s.changed.includes(id) ? "hl-new" : ""}"><td><b class="t-label-md">${sub}</b><div class="t-caption text-tertiary">${id}</div></td><td>${c}</td><td><span class="badge ${p === "Urgent" ? "badge-danger" : p === "High" ? "badge-warning" : ""}">${p}</span></td><td><span class="${tone ? "text-" + (tone === "danger" ? "danger" : "warning") : "text-tertiary"} t-label-sm">${sla}</span></td><td>${a ? `<div class="cell-user"><span class="avatar avatar-sm av-${a.length % 5 + 1}">${a[0]}</span>${a}</div>` : `<span class="text-tertiary t-body-xs">Unassigned</span>`}</td></tr>`).join("")}
      </tbody></table></div></div></div>
      <div class="g2"><div class="widget"><div class="widget-header"><div><span class="widget-title">Volume</span><span class="widget-desc">Tickets per day · 14 days</span></div></div><div class="widget-content">${chart({ type: "area", height: 170, labels: Array.from({ length: 14 }, (_, k) => "Oct " + (k + 3)), series: [{ name: "New", data: [38, 42, 35, 51, 47, 22, 19, 44, 49, 46, 58, 61, 28, 24] }, { name: "Solved", data: [36, 40, 38, 45, 44, 24, 20, 41, 44, 47, 50, 52, 30, 22], color: "var(--chart-2)" }] })}</div></div>
      <div class="widget"><div class="widget-header"><div><span class="widget-title">CSAT by topic</span><span class="widget-desc">Last 30 days</span></div></div><div class="widget-content">${chart({ type: "bar", height: 170, labels: ["Billing", "SSO", "Export", "API", "Other"], format: "percent", max: 100, series: [{ name: "CSAT", data: [78, 84, 93, 96, 94] }] })}</div></div></div>`;
    },
    agent: {
      name: "Support copilot", greeting: "Let's clear the queue.", sub: "I can triage, assign, draft replies and spot trends. I'll check with you before changing tickets.",
      prompts: [
        { label: "Which tickets breach SLA today?", hint: "2 already breached", icon: "circle-alert", keys: ["sla", "breach", "late", "overdue", "urgent"],
          steps: [["Checking SLA timers", "42 open tickets"]],
          text: "<p><strong>2 tickets have breached</strong> and 1 breaches in 18 minutes:</p>",
          ui: (s) => `<div class="item-card-group joined">${s.t.filter((r) => r[6]).map(([id, sub, c, p, sla, a, tone]) => `<div class="item-card"><span class="item-card-icon" style="color:var(--icon-${tone})"><svg class="icon"><use href="#circle-alert"/></svg></span><div class="item-card-content"><span class="item-card-title">${sub}</span><span class="item-card-desc">${id} · ${c}</span></div><span class="badge badge-${tone}">${sla}</span></div>`).join("")}</div>` },
        { label: "Triage the queue", hint: "Assign by skill and load", icon: "users-round", keys: ["triage", "assign", "route", "queue"],
          steps: [["Reading unassigned tickets", "4 tickets"], ["Matching skills", "Billing → Dara · SSO → Jonas"], ["Balancing load", "Max 8 per agent"]],
          tool: { name: "tickets.suggest_assignees", icon: "users-round", args: '{ <span class="k">"status"</span>: "unassigned" }', result: "4 suggestions" },
          text: "<p>Here's who I'd assign — billing to Dara, auth to Jonas, export bugs to Aiko:</p>",
          ui: () => `<div class="table-wrap"><table class="table"><thead><tr><th>Ticket</th><th>Assign to</th></tr></thead><tbody><tr><td>#4819 SSO login loop</td><td>Jonas</td></tr><tr><td>#4816 Charged twice</td><td>Dara</td></tr><tr><td>#4821 CSV export</td><td>Aiko</td></tr><tr><td>#4802 Dark mode PDF</td><td>Aiko</td></tr></tbody></table></div>`,
          approval: { tool: "tickets.bulk_assign", icon: "users-round", cta: "Assign 4", summary: "Assign <b>4 tickets</b> to Jonas, Dara and Aiko and notify them in Slack?", done: "4 tickets assigned", doneSub: "Notified in #support", after: "Assigned and notified. The two breached tickets are now owned.",
            onApprove(s) { const m = { "#4819": "Jonas", "#4816": "Dara", "#4821": "Aiko", "#4802": "Aiko" }; s.t.forEach((r) => { if (m[r[0]]) r[5] = m[r[0]]; }); s.changed = Object.keys(m); } } },
        { label: "Why did CSAT drop?", hint: "−3 points this month", icon: "trending-down", keys: ["csat", "satisf", "drop", "why", "score"],
          steps: [["Reading 412 survey replies", ""], ["Clustering comments", "5 themes"]],
          text: "<p>CSAT fell <strong>3 points</strong>, almost all from <strong>billing</strong> (78%). Customers mention <strong>double charges after the Oct 1 plan migration</strong> and slow refunds. Fixing the migration bug and auto-refunding duplicates should recover most of it.</p>",
          ui: () => `<div class="chat-sources"><a class="chat-source" href="#"><span class="fav">1</span><span>Survey · “charged twice”, 38×</span></a><a class="chat-source" href="#"><span class="fav">2</span><span>Ticket #4816</span></a><a class="chat-source" href="#"><span class="fav">3</span><span>Changelog · Oct 1 migration</span></a></div>` },
        { label: "Draft a reply to #4816", hint: "Charged twice", icon: "reply", keys: ["draft", "reply", "4816", "respond", "write"],
          steps: [["Reading the ticket", "Umbrella · charged twice"], ["Checking Stripe", "Duplicate charge $2,115"]],
          text: "<p>Draft reply:</p><blockquote>Hi Sam — sorry about this. You were charged twice for October because of a billing migration on our side. I've refunded the duplicate <strong>$2,115.00</strong>; it'll appear in 5–7 days. — Dara</blockquote>",
          approval: { tool: "billing.refund + tickets.reply", icon: "receipt", cta: "Refund & send", summary: "Refund <b>$2,115.00</b> to Umbrella and send this reply on <b>#4816</b>?", done: "Refunded and replied", doneSub: "#4816 · Umbrella", after: "Refund issued and reply sent. #4816 is marked pending customer.",
            onApprove(s) { s.t = s.t.map((r) => (r[0] === "#4816" ? [r[0], r[1], r[2], "Normal", "Pending", "Dara", ""] : r)); s.changed = ["#4816"]; } } },
      ],
    },
    autoplay: 1,
  };
})();
