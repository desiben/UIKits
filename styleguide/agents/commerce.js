/* Commerce Ops — agent example */
(function () {
  const chart = (c) => `<div class="chart" data-chart='${JSON.stringify(c)}'></div>`;
  const usd = (v) => "$" + Math.round(v).toLocaleString("en-US");
  const days = ["Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15", "Oct 16"];
  window.APP = {
    brand: "ember", name: "Lumen Goods", short: "your store", icon: "store", page: "Operations", org: "Lumen Goods Co.",
    nav: [{ items: [["layout-dashboard", "Operations", "", 1], ["shopping-cart", "Orders", "38"], ["boxes", "Inventory", "4"], ["users", "Customers"], ["tag", "Discounts"]] }, { label: "Channels", items: [["globe", "Online store"], ["smartphone", "App"], ["store", "Retail"]] }],
    state: {
      stock: [["Linen throw — Sand", "LT-SND", 6, 40, 24], ["Ceramic mug — Moss", "CM-MOS", 9, 60, 18], ["Oak tray — Large", "OT-LRG", 3, 25, 9], ["Wool socks — Ash", "WS-ASH", 54, 80, 31], ["Candle — Cedar", "CD-CED", 112, 120, 22]],
      orders: [["#4821", "Ava Lindqvist", 128, "Paid"], ["#4820", "Ben Kowalski", 64, "Fulfilled"], ["#4819", "Chen Rui", 212, "Paid"], ["#4818", "Dara Okafor", 46, "Refunded"]],
    },
    render(s, i) {
      const low = s.stock.filter((r) => r[2] < 10).length;
      return `<div class="surface-head"><div><h1>Operations</h1><p>Thursday, Oct 16 · all channels</p></div><div class="row"><div class="segment sm" role="radiogroup" aria-label="Range"><button role="radio" aria-checked="true">Today</button><button role="radio" aria-checked="false">7d</button><button role="radio" aria-checked="false">30d</button></div></div></div>
      <div class="kpi-group">
        <div class="kpi"><span class="kpi-label">Revenue today</span><span class="kpi-value">$8,420</span><span class="trend-chip">${i("trending-up")} 14%</span></div>
        <div class="kpi"><span class="kpi-label">Orders</span><span class="kpi-value">38</span><span class="trend-chip">${i("trending-up")} 6</span></div>
        <div class="kpi"><span class="kpi-label">Avg. order</span><span class="kpi-value">$43.36</span><span class="trend-chip" data-trend="down">${i("trending-down")} 2%</span></div>
        <div class="kpi"><span class="kpi-label">Low stock</span><span class="kpi-value">${low} SKUs</span><span class="trend-chip" data-trend="${low ? "down" : "neutral"}">${i(low ? "circle-alert" : "check")} ${low ? "Needs restock" : "All good"}</span></div>
      </div>
      <div class="g2">
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Revenue by channel</span><span class="widget-desc">Last 8 days</span></div></div><div class="widget-content">${chart({ type: "bar", stacked: true, height: 190, labels: days, format: "$compact", series: [{ name: "Online", data: [4200, 4600, 3900, 5100, 5400, 4800, 5600, 5900] }, { name: "App", data: [1500, 1700, 1600, 1900, 2100, 2000, 2200, 2300] }, { name: "Retail", data: [600, 500, 700, 800, 650, 700, 900, 220] }] })}</div></div>
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Recent orders</span><span class="widget-desc">Live</span></div></div><div class="widget-content flush"><div class="list-view" style="border:0;border-radius:0">${s.orders.map(([n, c, a, st]) => `<div class="list-row"><span class="avatar avatar-sm av-${(n.charCodeAt(4) % 5) + 1}">${c.split(" ").map((x) => x[0]).join("")}</span><div class="list-main"><b>${c}</b><span>${n}</span></div><span class="badge ${st === "Paid" ? "badge-success" : st === "Refunded" ? "badge-danger" : ""}">${st}</span><span class="list-meta hide-sm">${usd(a)}</span></div>`).join("")}</div></div></div>
      </div>
      <div class="widget"><div class="widget-header"><div><span class="widget-title">Inventory</span><span class="widget-desc">Double-click a cell to edit</span></div><button class="btn btn-outline btn-sm" style="margin-left:auto" onclick="APP_RUN(0)">${i("sparkles", "icon-sm")} Restock with AI</button></div><div class="widget-content flush"><div class="data-grid" tabindex="0" style="border:0;border-radius:0"><table><thead><tr><th>Product</th><th>SKU</th><th class="num">On hand</th><th class="num">Reorder at</th><th class="num">Sold 7d</th><th>Status</th></tr></thead><tbody>
        ${s.stock.map(([n, sku, oh, ro, sold]) => `<tr class="${s.restocked && s.restocked.includes(sku) ? "hl-new" : ""}"><td data-edit>${n}</td><td class="mono">${sku}</td><td class="num" data-edit>${oh}</td><td class="num" data-edit>${ro}</td><td class="num">${sold}</td><td>${oh < 10 ? `<span class="badge badge-danger"><span class="dot"></span>Low</span>` : oh < ro ? `<span class="badge badge-warning"><span class="dot"></span>Reorder</span>` : `<span class="badge badge-success"><span class="dot"></span>OK</span>`}</td></tr>`).join("")}
      </tbody></table></div></div></div>`;
    },
    agent: {
      name: "Ops assistant", greeting: "What should we look at today?", sub: "I can check stock, compare channels and create purchase orders — I'll ask before placing any.",
      prompts: [
        { label: "Restock low inventory", hint: "3 SKUs under 10 units", icon: "boxes", keys: ["stock", "restock", "inventory", "low", "reorder"],
          steps: [["Scanning inventory", "5 SKUs · 2 warehouses"], ["Forecasting demand", "Next 14 days"], ["Checking supplier lead times", "Oakline · 5 days"]],
          tool: { name: "inventory.low_stock", icon: "boxes", args: '{ <span class="k">"threshold"</span>: 10 }', result: "3 SKUs" },
          text: "<p>Three products will sell out within a week at the current pace. I'd order enough for <strong>3 weeks</strong> of demand:</p>",
          ui: (s) => `<div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th class="num">Order</th><th class="num">Cost</th></tr></thead><tbody><tr><td>Linen throw — Sand</td><td class="num">72</td><td class="num">$1,728</td></tr><tr><td>Ceramic mug — Moss</td><td class="num">54</td><td class="num">$486</td></tr><tr><td>Oak tray — Large</td><td class="num">27</td><td class="num">$945</td></tr><tr><td><b>Total</b></td><td class="num"><b>153</b></td><td class="num"><b>$3,159</b></td></tr></tbody></table></div>`,
          approval: { tool: "purchasing.create_po", icon: "receipt", cta: "Place order", summary: "Create purchase order <b>PO-2291</b> with Oakline Supply for <b>153 units · $3,159</b>?", done: "Purchase order placed", doneSub: "PO-2291 · arrives Oct 21", after: "Done — PO-2291 is placed. I've updated on-hand counts as incoming stock.",
            onApprove(s) { const add = { "LT-SND": 72, "CM-MOS": 54, "OT-LRG": 27 }; s.stock.forEach((r) => { if (add[r[1]]) r[2] += add[r[1]]; }); s.restocked = Object.keys(add); } } },
        { label: "Compare channel revenue", hint: "Online vs. app vs. retail", icon: "bar-chart-3", keys: ["channel", "compare", "revenue", "online", "app", "retail"],
          steps: [["Aggregating orders by channel", "30 days"]],
          text: "<p>Online is still <strong>62%</strong> of revenue, but the <strong>app grew 31%</strong> month over month and has the highest average order ($51). Retail is flat.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Share of revenue</span><span class="widget-desc">Last 30 days</span></div></div><div class="widget-content">${chart({ type: "pie", size: 170, format: "$compact", centerSub: "30 days", data: [{ name: "Online", value: 152000 }, { name: "App", value: 61000 }, { name: "Retail", value: 32000 }] })}</div></div>` },
        { label: "Summarize today's orders", hint: "38 orders so far", icon: "shopping-cart", keys: ["order", "today", "summar"],
          steps: [["Reading today's orders", "38 orders"], ["Grouping by status", ""]],
          text: "<p><strong>38 orders · $8,420</strong> so far today, up 14% on last Thursday.</p><ul><li><strong>31</strong> paid and ready to ship</li><li><strong>5</strong> fulfilled</li><li><strong>2</strong> refunds — both for the Oak tray (damaged in transit)</li></ul><p>You might want to check packaging for the Oak tray.</p>" },
        { label: "Draft a promo for slow movers", hint: "Candles are overstocked", icon: "tag", keys: ["promo", "discount", "slow", "email", "campaign"],
          steps: [["Finding overstocked items", "Candle — Cedar · 112 units"], ["Checking margin", "62% gross"]],
          text: "<p>Here's a promo that keeps margin above 45%:</p><blockquote><strong>Cozy season: 20% off cedar candles</strong><br>Light up longer evenings. This week only, with code <code>CEDAR20</code>.</blockquote>",
          approval: { tool: "discounts.create", icon: "tag", cta: "Create discount", summary: "Create code <b>CEDAR20</b> (20% off Candle — Cedar) valid until <b>Oct 23</b>?", done: "Discount created", doneSub: "CEDAR20 · 20% off", after: "CEDAR20 is live until Oct 23." } },
      ],
    },
    autoplay: 0,
  };
})();
