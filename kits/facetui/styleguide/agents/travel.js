/* Travel — agent example */
(function () {
  const chart = (c) => `<div class="chart" data-chart='${JSON.stringify(c)}'></div>`;
  const map = (i, route) => `<div class="map" style="height:300px"><div class="map-layer" style="position:absolute;inset:0"><svg class="map-base" viewBox="0 0 720 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="water" d="M0 0 H180 C150 80 210 170 160 320 H0Z"/><path class="water" d="M180 260 C320 240 420 300 720 270 V320 H160Z"/><circle class="park" cx="470" cy="110" r="44"/><rect class="park" x="300" y="40" width="90" height="60" rx="14"/>
    <path class="road" d="M180 150 H730"/><path class="road" d="M420 -10 V330"/><path class="road minor" d="M200 60 C320 70 520 40 730 70"/><path class="road minor" d="M240 330 C300 200 260 120 330 -10"/><path class="road minor" d="M560 -10 C540 120 600 220 580 330"/>
    ${route ? '<path class="route" d="M250 210 C300 170 360 160 420 150 S520 120 560 90"/>' : ""}</svg>
    <span class="map-pin" style="left:35%;top:66%" data-popup="mp-a">${i("hotel")}</span><span class="map-pin alt" style="left:58%;top:47%">${i("utensils")}</span><span class="map-pin alt" style="left:78%;top:28%">${i("camera")}</span>
    <div class="map-popup" id="mp-a" style="left:35%;top:66%" hidden><b>Casa Alfama</b>Boutique hotel · ★ 4.8</div></div>
    <div class="map-controls"><button data-zoom="in" aria-label="Zoom in">${i("plus")}</button><button data-zoom="out" aria-label="Zoom out">${i("minus")}</button></div>
    <span class="map-chip">${i("map-pin", "icon-sm")} Lisbon, Portugal</span></div>`;
  window.APP = {
    brand: "lagoon", name: "Wayfarer", short: "your trip", icon: "plane", page: "Lisbon trip", org: "Personal",
    nav: [{ items: [["map", "Trips", "", 1], ["calendar", "Itinerary"], ["hotel", "Stays", "1"], ["ticket", "Bookings"], ["wallet", "Budget"]] }, { label: "Saved", items: [["star", "Lisbon"], ["star", "Porto"], ["star", "Seville"]] }],
    state: { booked: false },
    render(s, i) {
      return `<div class="surface-head"><div><h1>Lisbon · Nov 21–24</h1><p>2 travelers · 3 nights</p></div><div class="row"><button class="btn btn-outline btn-sm">${i("share-2", "icon-sm")} Share</button><button class="btn btn-sm" onclick="APP_RUN(0)">${i("sparkles", "icon-sm")} Plan with AI</button></div></div>
      <div class="g2"><div class="span-2">${map(i, true)}</div></div>
      <div class="g2">
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Itinerary</span><span class="widget-desc">Day 1 · Friday</span></div></div><div class="widget-content"><div class="agenda"><div class="agenda-day"><div class="agenda-date today"><b>21</b><span>Fri</span></div><div class="agenda-list">
          <div class="agenda-event" data-tone="blue"><time>11:20</time><div style="min-width:0"><b>Land at LIS</b><span>TP 1351 from London</span></div></div>
          <div class="agenda-event" data-tone="lime"><time>14:00</time><div style="min-width:0"><b>${s.booked ? "Check in · Casa Alfama" : "Find a hotel in Alfama"}</b><span>${s.booked ? "Confirmed · 3 nights" : "Not booked yet"}</span></div>${s.booked ? `<span class="badge badge-success">${i("check", "icon-sm")} Booked</span>` : ""}</div>
          <div class="agenda-event" data-tone="amber"><time>19:30</time><div style="min-width:0"><b>Dinner at Taberna da Rua</b><span>Reserved for 2</span></div></div></div></div></div></div></div>
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Stays nearby</span><span class="widget-desc">Alfama · per night</span></div></div><div class="widget-content"><div class="g3" style="grid-template-columns:1fr 1fr;gap:10px">
          <div><div class="thumb-img" style="--tone:linear-gradient(135deg,var(--lagoon-400),var(--blue-700))"><b>Casa Alfama</b></div><div class="row" style="justify-content:space-between;margin-top:6px"><span class="t-label-sm">$184</span><span class="rating rating-sm" data-readonly><span class="t-caption text-tertiary">★ 4.8</span></span></div></div>
          <div><div class="thumb-img" style="--tone:linear-gradient(135deg,var(--amber-300),var(--ember-700))"><b>Memmo Alfama</b></div><div class="row" style="justify-content:space-between;margin-top:6px"><span class="t-label-sm">$262</span><span class="t-caption text-tertiary">★ 4.9</span></div></div>
        </div></div></div>
      </div>`;
    },
    agent: {
      name: "Trip planner", greeting: "Where are we going next?", sub: "I can plan days, compare places, budget the trip and book — with your OK.",
      prompts: [
        { label: "Plan 3 days in Lisbon", hint: "Food, views, a day trip", icon: "calendar", keys: ["plan", "days", "itinerary", "lisbon"],
          steps: [["Reading your saved places", "14 pins"], ["Grouping by neighborhood", "Alfama · Baixa · Belém"], ["Checking opening hours", "Nov 21–24"]],
          text: "<p>Here's a relaxed plan that keeps walking under 8 km a day:</p>",
          ui: () => `<div class="agenda">${[["21", "Fri", [["Afternoon", "Alfama & Castelo", "Sunset at Miradouro da Senhora do Monte", "lime"], ["19:30", "Taberna da Rua", "Petiscos · booked", "amber"]]], ["22", "Sat", [["10:00", "Belém", "Pastéis, monastery, MAAT", "blue"], ["Evening", "Bairro Alto", "Fado at Tasca do Chico", "rose"]]], ["23", "Sun", [["All day", "Sintra day trip", "Train from Rossio · 40 min", "lime"]]]].map(([d, w, ev]) => `<div class="agenda-day"><div class="agenda-date"><b>${d}</b><span>${w}</span></div><div class="agenda-list">${ev.map(([t, b, sp, tone]) => `<div class="agenda-event" data-tone="${tone}"><time>${t}</time><div style="min-width:0"><b>${b}</b><span>${sp}</span></div></div>`).join("")}</div></div>`).join("")}</div>` },
        { label: "Compare Lisbon and Porto", hint: "For a November trip", icon: "scan-search", keys: ["compare", "porto", "vs", "versus"],
          steps: [["Pulling weather and prices", "November averages"], ["Scoring each city", "6 factors"]],
          text: "<p>Lisbon wins on <strong>weather and day trips</strong>; Porto is <strong>cheaper</strong> and better for food and wine. For a first visit in November I'd pick Lisbon.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">City scores</span><span class="widget-desc">Out of 10</span></div></div><div class="widget-content">${chart({ type: "radar", size: 260, max: 10, labels: ["Weather", "Food", "Price", "Day trips", "Nightlife", "Walkable"], series: [{ name: "Lisbon", data: [8, 8, 6, 9, 8, 7] }, { name: "Porto", data: [6, 9, 8, 6, 7, 8] }] })}</div></div>` },
        { label: "Budget the trip", hint: "2 people · 3 nights", icon: "wallet", keys: ["budget", "cost", "price", "money", "spend"],
          steps: [["Adding flights and stays", ""], ["Estimating food and activities", "Mid-range"]],
          text: "<p>Estimated total: <strong>$2,140</strong> for two — about <strong>$357 per person per day</strong>.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Trip budget</span><span class="widget-desc">USD</span></div></div><div class="widget-content">${chart({ type: "pie", size: 170, format: "$compact", centerSub: "Total", data: [{ name: "Flights", value: 780 }, { name: "Hotel", value: 552 }, { name: "Food", value: 480 }, { name: "Activities", value: 210 }, { name: "Transport", value: 118 }] })}</div></div>` },
        { label: "Book Casa Alfama", hint: "3 nights · $184/night", icon: "hotel", keys: ["book", "hotel", "stay", "alfama", "reserve"],
          steps: [["Checking availability", "Nov 21–24 · Double room"], ["Applying your loyalty rate", "−8%"]],
          tool: { name: "stays.quote", icon: "hotel", args: '{ <span class="k">"hotel"</span>: "casa-alfama", <span class="k">"nights"</span>: 3, <span class="k">"guests"</span>: 2 }', result: "$552 total" },
          text: "<p>A double room is available for <strong>$552</strong> (3 nights, free cancellation until Nov 19).</p>",
          approval: { tool: "stays.book", icon: "hotel", cta: "Book for $552", summary: "Book <b>Casa Alfama</b>, Nov 21–24, double room, <b>$552</b> on Visa ••4242?", done: "Booking confirmed", doneSub: "Casa Alfama · Nov 21–24", after: "Booked! It's on your itinerary for Friday afternoon.", onApprove(s) { s.booked = true; } } },
      ],
    },
    autoplay: 0,
  };
})();
