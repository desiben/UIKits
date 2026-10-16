/* Facet UI — components reel timeline. A capture script calls reel.frame(t) for every frame,
   moves the real mouse to the returned point (so hover, magnetic, spotlight and tilt fire for real)
   and then calls reel.sync(t), which pins every CSS animation/transition to virtual time t. */
(function () {
  const $ = (id) => document.getElementById(id);
  // calendar days
  $("calgrid").innerHTML = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => `<span class="dow">${d}</span>`).join("") +
    Array.from({ length: 30 }, (_, k) => `<button class="cal-day${k + 1 === 15 ? " today" : ""}" id="d${k + 1}"${k + 1 === 18 ? ' aria-selected="true"' : ""}>${k + 1}</button>`).join("");
  $("save").dataset.toast = JSON.stringify({ title: "Changes saved", description: "Your workspace settings are up to date.", timeout: 600000 });
  document.querySelectorAll(".kpi-value,[data-countup]").forEach((e) => (e.dataset.mCounted = "1"));
  document.addEventListener("click", (e) => { const a = e.target.closest("a"); if (a) e.preventDefault(); });

  const P = (x, y) => ({ x, y });
  const SHOTS = [
    { id: "s-title", d: 2.6 },
    { id: "s-buttons", d: 4.4, t: "Magnetic buttons & ripples", p: "Buttons lean toward the pointer and ripple on press.",
      wp: [[0, P(938, 625)], [0.9, "b1", 0.3, 0.5], [1.5, "b1", 0.72, 0.62], [1.9, "b1", 0.55, 0.5], [2.6, "b2", 0.5, 0.5], [3.3, "b3", 0.5, 0.5], [4.0, "b6", 0.5, 0.5], [4.4, "b6", 0.55, 0.6]],
      clicks: [2.0, 2.7, 4.05] },
    { id: "s-cards", d: 4.6, t: "Spotlight & tilt", p: "Cards track the cursor with a soft brand spotlight and a gentle tilt.",
      wp: [[0, P(438, 625)], [0.8, "c1", 0.5, 0.3], [1.4, "c1", 0.72, 0.72], [2.0, "c2", 0.3, 0.28], [2.7, "c2", 0.78, 0.55], [3.3, "c2b", 0.5, 0.5], [3.7, "c2b", 0.55, 0.5], [4.2, "c3", 0.4, 0.4], [4.6, "c3", 0.62, 0.6]],
      clicks: [3.5] },
    { id: "s-tabs", d: 4.4, t: "Sliding indicators", p: "Tabs, segmented controls and menus glide between states.",
      wp: [[0, P(812, 594)], [0.7, "t2"], [0.9, "t2"], [1.4, "t3"], [1.6, "t3"], [2.1, "t4"], [2.3, "t4"], [2.9, "u2"], [3.1, "u2"], [3.6, "u3"], [3.8, "u3"], [4.3, "u1"], [4.4, "u1"]],
      clicks: [0.8, 1.5, 2.2, 3.0, 3.7, 4.32] },
    { id: "s-forms", d: 4.6, t: "Switches, checks & sliders", p: "Spring-loaded toggles with crisp, accessible focus states.",
      wp: [[0, P(875, 625)], [0.8, "w2", 0.1, 0.5], [1.2, "w2", 0.1, 0.5], [1.9, "w1", 0.1, 0.5], [2.2, "w1", 0.1, 0.5], [2.8, "k1", 0.04, 0.22], [3.1, "k1", 0.04, 0.22], [3.5, "sl", 0.3, 0.5], [4.3, "sl", 0.86, 0.5], [4.6, "sl", 0.86, 0.5]],
      clicks: [1.0, 2.05, 2.95], drags: [[3.55, 4.35]] },
    { id: "s-nav", d: 4.6, t: "Hover rails", p: "Sidebar and command-palette highlights follow the pointer.",
      wp: [[0, P(562, 625)], [0.6, "n2", 0.4, 0.5], [1.0, "n3", 0.4, 0.5], [1.4, "n4", 0.4, 0.5], [1.85, "n5", 0.4, 0.5], [2.5, "m1", 0.4, 0.5], [3.0, "m2", 0.4, 0.5], [3.5, "m3", 0.4, 0.5], [4.0, "m4", 0.4, 0.5], [4.6, "m4", 0.45, 0.5]] },
    { id: "s-feedback", d: 4.6, t: "Lift, focus & feedback", p: "Hover lift on cards and days, toasts that confirm every action.",
      wp: [[0, P(562, 625)], [0.6, "d10"], [1.0, "d12"], [1.4, "d19"], [1.8, "d25"], [2.4, "kb", 0.4, 0.4], [3.0, "kb", 0.7, 0.62], [3.5, "save"], [4.6, "save", 0.6, 0.5]],
      clicks: [3.65] },
    { id: "s-outro", d: 3.4 },
  ];
  const XF = 0.4;
  let acc = 0;
  SHOTS.forEach((s) => { s.t0 = acc; acc += s.d; s.el = $(s.id); });
  const DUR = acc;
  const capped = SHOTS.filter((s) => s.t);
  $("dots").innerHTML = capped.map(() => "<i><b></b></i>").join("");
  const dots = [...$("dots").children].map((i) => i.firstChild);

  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const io = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = (t) => 1 - Math.pow(1 - t, 3);
  const pt = (w) => {
    if (typeof w[1] === "object") return w[1];
    const r = $(w[1]).getBoundingClientRect();
    return P(r.left + r.width * (w[2] ?? 0.5), r.top + r.height * (w[3] ?? 0.5));
  };
  function cursorAt(s, u) {
    const wp = s.wp; if (!wp) return null;
    if (u <= wp[0][0]) return pt(wp[0]);
    for (let k = 1; k < wp.length; k++) {
      if (u <= wp[k][0]) { const a = pt(wp[k - 1]), b = pt(wp[k]); const p = io((u - wp[k - 1][0]) / (wp[k][0] - wp[k - 1][0]));
        // slight arc for a natural hand movement
        const arc = Math.sin(p * Math.PI) * Math.min(25, Math.hypot(b.x - a.x, b.y - a.y) * 0.08);
        return P(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p - arc); }
    }
    return pt(wp[wp.length - 1]);
  }
  function enter(el, u, start, dur = 0.8, y = 30, sc = 0) {
    const p = out(clamp((u - start) / dur)); el.style.opacity = p; el.style.translate = `0 ${y * (1 - p)}px`; if (sc) el.style.scale = String(1 - sc * (1 - p));
  }

  let lastPos = P(1060, 625);
  function frame(t) {
    let cur = null, down = false, cursorOpacity = 0, active = null;
    for (const s of SHOTS) {
      const u = t - s.t0, vis = u > -XF / 2 && u < s.d + XF / 2;
      s.el.style.visibility = vis ? "visible" : "hidden";
      if (!vis) { s.el.style.opacity = 0; continue; }
      const first = s === SHOTS[0], last = s === SHOTS[SHOTS.length - 1];
      const fi = first ? 1 : clamp((u + XF / 2) / XF), fo = last ? 1 - clamp((u - (s.d - 0.6)) / 0.6) : 1 - clamp((u - (s.d - XF / 2)) / XF);
      s.el.style.opacity = Math.min(fi, fo);
      s.el.style.zIndex = Math.round(10 + s.t0 * 10);
      if (u >= 0 && u < s.d) active = { s, u };
      if (s.id === "s-title" || s.id === "s-outro") {
        const c = s.el.querySelector(".center").children; [...c].forEach((el, k) => enter(el, Math.max(0, u), 0.1 + k * 0.14, 0.8, 16, k === 0 ? 0.25 : 0));
      }
      const zi = s.el.querySelector(".zoom"); if (zi) zi.style.scale = String(0.985 + 0.015 * out(clamp((u + XF / 2) / 1.2)));
    }
    if (active && active.s.wp) {
      const { s, u } = active; cur = cursorAt(s, u); cursorOpacity = clamp(u / 0.25) * clamp((s.d - u) / 0.25);
      for (const c of s.clicks || []) if (u >= c && u < c + 0.12) down = true;
      for (const [a, b] of s.drags || []) if (u >= a && u < b) down = true;
    }
    // caption
    const ci = active && active.s.t ? capped.indexOf(active.s) : -1;
    const cap = $("cap");
    if (ci >= 0) {
      const { s, u } = active;
      if (cap.dataset.i != ci) { cap.dataset.i = ci; $("capn").textContent = String(ci + 1).padStart(2, "0") + " / " + String(capped.length).padStart(2, "0"); $("capt").textContent = s.t; $("capp").textContent = s.p; }
      const a = clamp((u - 0.1) / 0.5), b = clamp((s.d - u) / 0.3);
      [...cap.children].forEach((el, k) => { const p = out(clamp((u - 0.1 - k * 0.08) / 0.6)); el.style.opacity = Math.min(p, b); el.style.translate = `0 ${10 * (1 - p)}px`; });
    } else [...cap.children].forEach((el) => (el.style.opacity = 0));
    const chrome = ci >= 0 ? 1 : 0;
    $("btag").style.opacity = $("dots").style.opacity = chrome;
    dots.forEach((d, k) => { const s = capped[k]; d.style.transform = `scaleX(${clamp((t - s.t0) / s.d)})`; });
    const tr = document.querySelector(".toast-region"); if (tr) { const fb = SHOTS.find((x) => x.id === "s-feedback"); tr.style.opacity = String(clamp((fb.t0 + fb.d + XF / 2 - t) / XF)); }
    // fake cursor
    const cEl = $("cursor");
    if (cur) lastPos = cur;
    cEl.style.translate = `${lastPos.x - 3}px ${lastPos.y - 1}px`;
    cEl.style.opacity = cursorOpacity;
    cEl.style.scale = down ? "0.88" : "1";
    const ring = cEl.querySelector(".ring"); ring.style.opacity = down ? 0.9 : 0; ring.style.scale = down ? "1" : "0.6";
    return { x: cur ? cur.x : 1197, y: cur ? cur.y : 672, down, scene: active ? active.s.id : null };
  }

  // Pin every CSS animation / transition (and WAAPI) to virtual time.
  const starts = new WeakMap();
  function sync(t) {
    for (const a of document.getAnimations()) {
      if (!starts.has(a)) starts.set(a, t);
      const ct = (t - starts.get(a)) * 1000;
      const end = a.effect && a.effect.getComputedTiming().endTime;
      try { if (isFinite(end) && ct >= end) a.finish(); else { a.pause(); a.currentTime = ct; } } catch (e) {}
    }
  }
  window.reel = { frame, sync, duration: DUR };
  frame(0);
})();
