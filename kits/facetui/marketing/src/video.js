/* Facet UI — deterministic video timeline for scenes.html.
   Open scenes.html?video=demo and call window.setTime(seconds). Each call renders that exact frame,
   so a capture script can step frame-by-frame (see scripts/render_marketing.js). */
(function () {
  if (!/video=demo/.test(location.search)) return;

  const style = document.createElement("style");
  style.textContent = `
    html, body { width: 1920px; height: 1080px; overflow: hidden; background: #07070c !important; }
    body { display: block !important; padding: 0 !important; margin: 0; position: relative; }
    section.scene { position: absolute !important; left: 0; top: 0; opacity: 0; will-change: opacity, scale; }
    section.scene.sq, #hero-light { display: none !important; }
    .vbig .mark { font-size: 64px; gap: 28px; }
    .vbig .mark b { width: 104px; height: 104px; border-radius: 28px 9px 28px 28px; }
    .vbig .mark b::after { width: 38px; height: 38px; border-radius: 9px 3px 9px 9px; }
    #intro .center, #outro .center { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; text-align: center; }
    #intro .sub, #outro .sub { margin-top: 26px; font: 450 26px/1.4 "Mona Sans"; color: var(--muted); letter-spacing: -0.005em; }
    #outro .h1 { font-size: 104px; margin-top: 34px; }
    #outro .url { margin-top: 40px; display: inline-flex; gap: 12px; align-items: center; height: 60px; padding: 0 28px; border-radius: 999px;
      background: linear-gradient(145deg, #8f84ff, #5d4ff3 55%, #3b2fc0); font: 600 22px/1 "Mona Sans"; box-shadow: 0 20px 60px -10px rgb(93 79 243 / .6), inset 0 1px 0 rgb(255 255 255 / .3); }
    #outro .by { margin-top: 30px; font: 500 18px/1 "Mona Sans"; color: rgb(255 255 255 / .5); letter-spacing: .02em; }
    #intro .line { width: 0; height: 2px; margin-top: 30px; background: linear-gradient(90deg, transparent, var(--brand-2), transparent); }
    #themes .split .seam { transition: none; }
  `;
  document.head.appendChild(style);

  const mk = (id, html) => { const s = document.createElement("section"); s.className = "scene bg-grid noise vbig"; s.id = id; s.innerHTML = html; document.body.appendChild(s); return s; };
  mk("intro", `<div class="glow brand" style="width:900px;height:700px;left:510px;top:190px;opacity:.5"></div>
    <div class="center"><span class="mark"><b></b>Facet UI</span><div class="line"></div><p class="sub">The design system with an edge.</p></div>
    <div class="credit">Facet UI <span class="dot"></span> by ETKits</div>`);
  mk("outro", `<div class="glow brand" style="width:1000px;height:700px;left:460px;top:260px;opacity:.5"></div>
    <div class="glow lime" style="width:500px;height:400px;left:1400px;top:760px"></div>
    <div class="center"><span class="mark"><b></b>Facet UI</span>
      <h2 class="h1">Ship SaaS UI <span class="grad">faster.</span></h2>
      <p class="sub">Figma UI kit · 158 components · 10 templates · tokens &amp; code</p>
      <span class="url">facet.etkits.us</span>
      <span class="by">Made by ETKits</span></div>`);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const out = (t) => 1 - Math.pow(1 - t, 3);
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const base = new WeakMap();
  const baseOpacity = (el) => { if (!base.has(el)) base.set(el, parseFloat(getComputedStyle(el).opacity) || 1); return base.get(el); };

  // Fade + slide an element in at local time u.
  function enter(el, u, start, dur = 0.8, o = {}) {
    if (!el) return;
    const p = out(clamp((u - start) / dur));
    const { x = 0, y = 36, s = 0, blur = 0 } = o;
    el.style.opacity = baseOpacity(el) * p;
    el.style.translate = `${x * (1 - p)}px ${y * (1 - p)}px`;
    if (s) el.style.scale = String(1 - s * (1 - p));
    if (blur) el.style.filter = p < 1 ? `blur(${blur * (1 - p)}px)` : "";
  }
  const stagger = (els, u, start, step, dur, o) => els.forEach((el, i) => enter(el, u, start + i * step, dur, o));
  const copyIn = (sec, u, start = 0.15) => stagger($$(".copy > *, .head > div > *, .head > .mark", sec), u, start, 0.12, 0.8, { y: 34 });

  // counters
  $$("#stats .stat b").forEach((b) => { b.dataset.target = b.textContent; });

  const T = {
    intro(s, u, d) {
      const mark = $(".mark", s), b = $(".mark b", s);
      enter(b, u, 0.2, 1.0, { y: 0, s: 0.4, blur: 18 });
      b.style.rotate = `${-90 * (1 - out(clamp((u - 0.2) / 1.0)))}deg`;
      const txt = mark.childNodes[1];
      mark.style.letterSpacing = `${-0.02 + 0.25 * (1 - out(clamp((u - 0.6) / 1.2)))}em`;
      mark.style.color = `rgb(255 255 255 / ${out(clamp((u - 0.6) / 0.9))})`;
      $(".line", s).style.width = `${520 * inOut(clamp((u - 1.0) / 1.0))}px`;
      enter($(".sub", s), u, 1.3, 0.9, { y: 18 });
      enter($(".credit", s), u, 1.6, 0.9, { y: 0 });
    },
    hero(s, u, d) {
      copyIn(s, u);
      const shots = $$(".stack .shot", s).reverse();
      stagger(shots, u, 0.35, 0.16, 1.2, { x: 260, y: 40 });
      $(".stack", s).style.translate = `${-40 * (u / d)}px ${-10 * (u / d)}px`;
    },
    features(s, u) {
      copyIn(s, u);
      stagger($$(".fcard", s), u, 0.5, 0.09, 0.8, { y: 50, s: 0.04 });
    },
    themes(s, u, d) {
      copyIn(s, u);
      stagger($$(".brands span", s), u, 0.55, 0.06, 0.6, { y: 16, s: 0.1 });
      enter($(".split", s), u, 0.45, 0.9, { y: 60 });
      const p = inOut(clamp((u - 1.2) / 1.6));
      const a = 100 - 42 * p, bb = a - 20;
      $(".split .dk", s).style.clipPath = `polygon(${a}% 0, 100% 0, 100% 100%, ${bb}% 100%)`;
      const m = a - 10.2;
      const sm = $(".split .seam", s); if (sm) sm.style.background = `linear-gradient(105deg, transparent ${m - 0.2}%, rgb(255 255 255 / .9) ${m}%, transparent ${m + 0.4}%)`;
      const lbls = $$(".split .lbl", s); enter(lbls[0], u, 0.9, 0.6, { y: 10 }); enter(lbls[1], u, 2.4, 0.6, { y: 10 });
      stagger($$(".stack .shot", s), u, 0.7, 0.18, 1.1, { x: 200 });
    },
    variables(s, u) {
      copyIn(s, u);
      enter($(".vars", s), u, 0.45, 0.8, { y: 40 });
      stagger($$(".vars tbody tr", s), u, 0.8, 0.07, 0.6, { x: -24, y: 0 });
      enter($(".canvas", s), u, 0.55, 0.9, { x: 80, y: 0 });
      stagger($$(".canvas .modebar .pill", s), u, 1.0, 0.08, 0.5, { y: 12 });
      const comps = $$(".canvas .comp", s); enter(comps[0], u, 1.2, 0.8, { y: 30 }); enter(comps[1], u, 1.5, 0.8, { y: 30 });
      stagger($$(".canvas .redline, .canvas .measure", s), u, 2.0, 0.12, 0.5, { y: 0, s: 0.06 });
    },
    layers(s, u) {
      copyIn(s, u);
      enter($(".panel-l", s), u, 0.45, 0.8, { x: -60, y: 0 });
      stagger($$(".panel-l .row", s), u, 0.7, 0.05, 0.5, { x: -16, y: 0 });
      enter($(".canvas", s), u, 0.6, 0.9, { y: 50, s: 0.03 });
      stagger($$(".canvas button", s), u, 1.0, 0.1, 0.6, { y: 20, s: 0.15 });
      enter($(".panel-r", s), u, 0.75, 0.8, { x: 60, y: 0 });
      stagger($$(".panel-r .row", s), u, 1.0, 0.05, 0.5, { x: 16, y: 0 });
    },
    wall(s, u, d) {
      const p = u / d;
      $(".plane", s).style.translate = `${-160 + 320 * p}px ${90 - 180 * p}px`;
      copyIn(s, u, 0.4);
    },
    components(s, u, d) {
      copyIn(s, u);
      stagger($$("#float > div", s), u, 0.45, 0.08, 0.9, { y: 120 });
      $("#float", s).style.translate = `0 ${-30 * (u / d)}px`;
    },
    mobile(s, u, d) {
      copyIn(s, u);
      const ph = $$(".phone", s); [ph[1], ph[0], ph[2]].forEach((el, i) => enter(el, u, 0.35 + i * 0.18, 1.1, { y: 220 }));
      $(".stage", s).style.translate = `${-30 * (u / d)}px 0`;
    },
    handoff(s, u, d) {
      copyIn(s, u);
      stagger($$(".codecard", s), u, 0.6, 0.22, 0.8, { x: -40, y: 0 });
      enter($(".browser", s), u, 0.4, 1.1, { x: 240, y: 0 });
    },
    stats(s, u) {
      copyIn(s, u);
      $$(".stat", s).forEach((el, i) => {
        enter(el, u, 0.35 + i * 0.08, 0.7, { y: 30 });
        const b = $("b", el), tgt = b.dataset.target, n = parseInt(tgt, 10), plus = tgt.endsWith("+") ? "+" : "";
        const p = out(clamp((u - 0.4 - i * 0.08) / 1.5));
        b.textContent = Math.round(n * p) + (p >= 1 ? plus : "");
      });
    },
    outro(s, u) {
      const els = [$(".mark", s), $(".h1", s), $(".sub", s), $(".url", s), $(".by", s)];
      enter(els[0], u, 0.15, 0.9, { y: 0, s: 0.2, blur: 10 });
      stagger(els.slice(1), u, 0.45, 0.16, 0.9, { y: 30 });
    },
  };

  // Timeline: [scene id, duration]
  const PLAN = [["intro", 3.2], ["hero", 5], ["features", 4.8], ["themes", 5.2], ["variables", 4.6], ["layers", 4.4], ["wall", 4.4],
    ["components", 5], ["mobile", 4.6], ["handoff", 4.6], ["stats", 4.2], ["outro", 5]];
  const XF = 0.6; // crossfade
  let acc = 0;
  const timeline = PLAN.map(([id, d]) => { const r = { id, d, t0: acc, el: document.getElementById(id) }; acc += d; return r; });
  window.VIDEO_DURATION = acc;

  window.setTime = function (t) {
    for (const sc of timeline) {
      const u = t - sc.t0;
      const vis = u > -XF / 2 && u < sc.d + XF / 2;
      if (!vis) { sc.el.style.opacity = 0; sc.el.style.visibility = "hidden"; continue; }
      sc.el.style.visibility = "visible";
      const first = sc === timeline[0], last = sc === timeline[timeline.length - 1];
      const fin = first ? (u < 0 ? 0 : clamp(u / 0.3)) : clamp((u + XF / 2) / XF);
      const fout = last ? 1 - clamp((u - (sc.d - 0.8)) / 0.8) : 1 - clamp((u - (sc.d - XF / 2)) / XF);
      sc.el.style.opacity = Math.min(fin, fout);
      sc.el.style.zIndex = Math.round(10 + sc.t0);
      sc.el.style.scale = String(1.035 - 0.035 * clamp((u + XF / 2) / (sc.d + XF)));
      T[sc.id](sc.el, Math.max(0, u), sc.d);
    }
  };
  window.setTime(0);
})();
