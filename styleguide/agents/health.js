/* Health — agent example */
(function () {
  const chart = (c) => `<div class="chart" data-chart='${JSON.stringify(c)}'></div>`;
  const wk = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  window.APP = {
    brand: "rose", name: "Pulse", short: "your health", icon: "heart-pulse", page: "Today", org: "Personal",
    nav: [{ items: [["activity", "Today", "", 1], ["dumbbell", "Workouts"], ["moon-star", "Sleep"], ["salad", "Nutrition"], ["droplet", "Hydration"]] }, { label: "Goals", items: [["flag", "Half marathon"], ["flame", "Protein 140g"]] }],
    state: { move: 74, run: false },
    render(s, i) {
      return `<div class="surface-head"><div><h1>Today</h1><p>Thursday · Day 61 of your 90-day plan</p></div><div class="row"><button class="btn btn-sm" onclick="APP_RUN(3)">${i("plus", "icon-sm")} Log activity</button></div></div>
      <div class="g3">
        <div class="widget"><div class="widget-header"><div><span class="widget-title">Rings</span><span class="widget-desc">Move · Sleep · Protein</span></div></div><div class="widget-content">${chart({ type: "radial", size: 180, format: "percent", data: [{ name: "Move", value: s.move }, { name: "Sleep", value: 88 }, { name: "Protein", value: 63 }] })}</div></div>
        <div class="widget span-2"><div class="widget-header"><div><span class="widget-title">Sleep</span><span class="widget-desc">Hours per night · last 14 days</span></div></div><div class="widget-content">${chart({ type: "area", height: 190, labels: Array.from({ length: 14 }, (_, k) => "Oct " + (k + 3)), format: "decimal", series: [{ name: "Sleep", data: [7.2, 6.8, 7.5, 6.1, 7.9, 8.2, 7.4, 6.6, 7.1, 7.8, 6.9, 7.3, 8.0, 7.6] }, { name: "Goal", data: Array(14).fill(7.5), dashed: true, color: "var(--chart-6)" }] })}</div></div>
      </div>
      <div class="kpi-group"><div class="kpi"><span class="kpi-label">Resting HR</span><span class="kpi-value">54 bpm</span><span class="trend-chip">${i("trending-down")} 3 bpm</span></div><div class="kpi"><span class="kpi-label">Steps</span><span class="kpi-value">${s.run ? "13,904" : "8,412"}</span><span class="trend-chip">${i("trending-up")} ${s.run ? "64" : "12"}%</span></div><div class="kpi"><span class="kpi-label">VO₂ max</span><span class="kpi-value">48.2</span><span class="trend-chip">${i("trending-up")} 0.6</span></div><div class="kpi"><span class="kpi-label">Weekly distance</span><span class="kpi-value">${s.run ? "29.4" : "24.4"} km</span><span class="trend-chip" data-trend="neutral">${i("flag")} Goal 30 km</span></div></div>
      <div class="widget"><div class="widget-header"><div><span class="widget-title">This week</span><span class="widget-desc">Training plan</span></div></div><div class="widget-content"><div class="agenda"><div class="agenda-day"><div class="agenda-date today"><b>16</b><span>Thu</span></div><div class="agenda-list">
        <div class="agenda-event ${s.run ? "" : "now"}" data-tone="lime"><time>7:00</time><div style="min-width:0"><b>Easy run · 5 km</b><span>${s.run ? "Done · 27:41 · 5:32/km" : "Zone 2 · ~28 min"}</span></div>${s.run ? `<span class="badge badge-success">${i("check", "icon-sm")} Done</span>` : ""}</div>
        <div class="agenda-event" data-tone="amber"><time>18:30</time><div style="min-width:0"><b>Strength · lower body</b><span>45 min</span></div></div></div></div></div></div></div>`;
    },
    agent: {
      name: "Health coach", greeting: "How are you feeling today?", sub: "I look at your sleep, training and food to keep your plan on track. Not medical advice.",
      prompts: [
        { label: "How did I sleep this month?", hint: "Trends and tips", icon: "moon-star", keys: ["sleep", "rest", "tired", "night"],
          steps: [["Reading 30 nights", "Avg 7h 18m"], ["Comparing to your goal", "7.5h"]],
          text: "<p>You averaged <strong>7h 18m</strong> — 12 minutes under your goal. Your short nights all followed <strong>late workouts</strong> (after 8pm). Moving strength sessions earlier could add ~25 minutes on those nights.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Sleep by workout time</span><span class="widget-desc">Hours</span></div></div><div class="widget-content">${chart({ type: "bar", height: 150, labels: ["Morning", "Afternoon", "After 8pm", "Rest day"], format: "decimal", series: [{ name: "Avg sleep", data: [7.6, 7.4, 6.5, 7.8] }] })}</div></div>` },
        { label: "Plan next week's workouts", hint: "Toward your half marathon", icon: "dumbbell", keys: ["plan", "workout", "week", "training", "schedule"],
          steps: [["Checking training load", "Acute:chronic 1.1"], ["Building the week", "4 runs · 2 strength"]],
          text: "<p>Next week builds to <strong>32 km</strong> with one long run. Here it is:</p>",
          ui: () => `<div class="agenda">${[["20", "Mon", "Rest + mobility", "20 min", "blue"], ["21", "Tue", "Intervals · 6×800m", "Zone 4", "rose"], ["23", "Thu", "Easy run · 6 km", "Zone 2", "lime"], ["25", "Sat", "Long run · 16 km", "Fuel at 45 min", "amber"]].map(([d, w, b, sp, t]) => `<div class="agenda-day"><div class="agenda-date"><b>${d}</b><span>${w}</span></div><div class="agenda-list"><div class="agenda-event" data-tone="${t}"><time>${w}</time><div style="min-width:0"><b>${b}</b><span>${sp}</span></div></div></div></div>`).join("")}</div>` },
        { label: "Am I hitting my protein goal?", hint: "Last 7 days", icon: "salad", keys: ["protein", "food", "eat", "nutrition", "goal"],
          steps: [["Reading food log", "7 days · 21 meals"]],
          text: "<p>You're averaging <strong>118g</strong> of protein — <strong>84%</strong> of your 140g goal. Breakfast is the gap: adding Greek yogurt or eggs would close most of it.</p>",
          ui: () => `<div class="widget"><div class="widget-header"><div><span class="widget-title">Protein per day</span><span class="widget-desc">Grams · goal 140g</span></div></div><div class="widget-content">${chart({ type: "composed", height: 150, labels: wk, series: [{ name: "Protein", data: [112, 134, 98, 121, 142, 105, 114], type: "bar" }, { name: "Goal", data: Array(7).fill(140), type: "line", dashed: true, color: "var(--chart-6)" }] })}</div></div>` },
        { label: "Log my 5k run", hint: "This morning · 27:41", icon: "footprints", keys: ["log", "run", "5k", "record", "add"],
          steps: [["Reading your watch", "Run · 5.02 km · 27:41"]],
          tool: { name: "watch.latest_workout", icon: "activity", args: '{ <span class="k">"type"</span>: "run" }', result: "Found 1" },
          text: "<p>Nice — <strong>5.02 km in 27:41</strong> (5:32/km), average HR 142. That completes today's planned run.</p>",
          approval: { tool: "journal.add_workout", icon: "footprints", cta: "Log run", summary: "Add <b>Easy run · 5.02 km · 27:41</b> to today's journal?", done: "Run logged", doneSub: "Move ring +18%", after: "Logged. Your Move ring jumped to 92%.", onApprove(s) { s.move = 92; s.run = true; } } },
      ],
    },
    autoplay: 3,
  };
})();
