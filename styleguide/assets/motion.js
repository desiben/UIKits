/* =========================================================================
   Facet UI — motion runtime (micro-interactions) v1.1. No dependencies.
   Load after facet.js:  <script src="assets/motion.js" defer></script>
   Pointer spotlight (--mx/--my), tilt ([data-tilt]), magnetic ([data-magnetic]),
   press ripples, sliding indicators (tabs, pills, menus, sidebars),
   count-up numbers, reveal-on-scroll for charts/steps, smooth accordions,
   staggered menus, toast progress, OTP pop, send-button fly.
   API: Facet.motion.refresh(scope?)  ·  Facet.motion.set("on" | "off")
   ========================================================================= */
(function () {
  "use strict";
  const root = document.documentElement;
  const rm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const off = () => rm.matches || root.dataset.motion === "off";
  const fine = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)").matches : true;

  /* ---------- pointer spotlight + tilt + magnetic ---------- */
  const SPOT = ".btn, .card, .chip, .kanban-card, .pricing, .preset, .icon-cell, .token, [data-spotlight]";
  let raf = 0, lastEv = null;
  function onMove(e) {
    lastEv = e; if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0; const ev = lastEv; if (!ev || off()) return;
      const t = ev.target.closest ? ev.target : null; if (!t) return;
      const s = t.closest(SPOT);
      if (s) { const r = s.getBoundingClientRect(); s.style.setProperty("--mx", ev.clientX - r.left + "px"); s.style.setProperty("--my", ev.clientY - r.top + "px"); }
      const tl = t.closest("[data-tilt], .kanban-card");
      if (tl && fine) { const r = tl.getBoundingClientRect(); const px = (ev.clientX - r.left) / r.width - 0.5, py = (ev.clientY - r.top) / r.height - 0.5; const max = parseFloat(tl.dataset.tilt) || 3;
        if (tl.hasAttribute("data-tilt")) { tl.style.setProperty("--ry", (px * max).toFixed(2) + "deg"); tl.style.setProperty("--rx", (-py * max).toFixed(2) + "deg"); } }
      const mg = t.closest("[data-magnetic]");
      if (mg && fine) { const r = mg.getBoundingClientRect(); const k = parseFloat(mg.dataset.magnetic) || 0.12, cl = (v) => Math.max(-6, Math.min(6, v)); mg.style.setProperty("--tx", cl((ev.clientX - r.left - r.width / 2) * k).toFixed(1) + "px"); mg.style.setProperty("--ty2", cl((ev.clientY - r.top - r.height / 2) * k).toFixed(1) + "px"); }
    });
  }
  function onLeave(e) {
    const el = e.target; if (!el || !el.style) return;
    if (el.matches && el.matches("[data-tilt]")) { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); }
    if (el.matches && el.matches("[data-magnetic]")) { el.style.removeProperty("--tx"); el.style.removeProperty("--ty2"); }
  }
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave, true);
  document.addEventListener("pointerout", (e) => { if (e.relatedTarget && e.target.contains && e.target.contains(e.relatedTarget)) return; onLeave(e); }, true);

  /* ---------- press ripple ---------- */
  document.addEventListener("pointerdown", (e) => {
    if (off() || e.button !== 0) return;
    const b = e.target.closest(".btn:not(:disabled):not(.btn-link), .chip, .toggle, .page-btn, .preset"); if (!b) return;
    let fx = b.querySelector(":scope > .m-fx"); if (!fx) { fx = document.createElement("span"); fx.className = "m-fx"; b.prepend(fx); }
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
    const s = document.createElement("span"); s.className = "m-ripple"; s.style.width = s.style.height = d + "px";
    s.style.left = e.clientX - r.left + "px"; s.style.top = e.clientY - r.top + "px"; fx.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }, { passive: true });

  /* ---------- sliding indicators ---------- */
  const SEL_GROUPS = [
    { sel: ".tabs-list", item: '[role="tab"]', active: '[aria-selected="true"]', mode: "select" },
    { sel: ".tabs-pill", item: '[role="tab"]', active: '[aria-selected="true"]', mode: "select" },
    { sel: ".toggle-group[data-single]", item: ".toggle", active: '[aria-pressed="true"]', mode: "select" },
    { sel: ".menu, .command-list", item: ".menu-item", active: '[aria-selected="true"]', mode: "hover" },
    { sel: ".docs-side, .settings-nav, .sidebar", item: "a, .sidebar-item", active: null, mode: "hover" },
  ];
  function ind(container) {
    let i = container.querySelector(":scope > .m-ind");
    if (!i) { i = document.createElement("span"); i.className = "m-ind"; i.setAttribute("aria-hidden", "true"); container.prepend(i);
      if (getComputedStyle(container).position === "static") container.style.position = "relative"; container.classList.add("m-ready"); }
    return i;
  }
  function moveTo(container, item, instant) {
    const i = ind(container); if (!item || item.offsetParent === null) { i.classList.remove("on"); return; }
    const cr = container.getBoundingClientRect(), ir = item.getBoundingClientRect();
    const x = ir.left - cr.left - container.clientLeft + container.scrollLeft, y = ir.top - cr.top - container.clientTop + container.scrollTop;
    if (instant || !i.classList.contains("on")) { i.style.transition = "none"; }
    i.style.transform = `translate(${x}px, ${y}px)`; i.style.width = ir.width + "px"; i.style.height = ir.height + "px";
    if (instant || !i.classList.contains("on")) { i.offsetWidth; i.style.transition = ""; }
    i.classList.add("on");
  }
  function syncSelect(scope = document) {
    for (const g of SEL_GROUPS) if (g.mode === "select" || g.active) scope.querySelectorAll(g.sel).forEach((c) => {
      const a = c.querySelector(":scope > " + g.item + g.active) || (g.mode === "select" ? null : null);
      if (g.mode === "select") moveTo(c, a, !c.classList.contains("m-ready"));
      else if (a) moveTo(c, a);
    });
  }
  document.addEventListener("pointerover", (e) => {
    if (off()) return;
    for (const g of SEL_GROUPS) { if (g.mode !== "hover") continue;
      const c = e.target.closest(g.sel); if (!c) continue; const it = e.target.closest(g.item);
      if (it && it.parentElement === c) moveTo(c, it); }
  });
  document.addEventListener("pointerout", (e) => {
    for (const g of SEL_GROUPS) { if (g.mode !== "hover") continue;
      const c = e.target.closest && e.target.closest(g.sel); if (!c || (e.relatedTarget && c.contains(e.relatedTarget))) continue;
      const i = c.querySelector(":scope > .m-ind"); if (!i) continue;
      const a = g.active && c.querySelector(":scope > " + g.item + g.active); if (a) moveTo(c, a); else i.classList.remove("on"); }
  });
  document.addEventListener("focusin", (e) => {
    for (const g of SEL_GROUPS) { if (g.mode !== "hover") continue; const c = e.target.closest && e.target.closest(g.sel); const it = e.target.closest && e.target.closest(g.item); if (c && it && it.parentElement === c) moveTo(c, it); }
  });
  // selection changes (tabs, toggle groups, command list) → follow with a spring
  const mo = new MutationObserver((muts) => { if (muts.some((m) => m.attributeName === "aria-selected" || m.attributeName === "aria-pressed")) requestAnimationFrame(() => syncSelect()); });
  mo.observe(document.body || root, { attributes: true, subtree: true, attributeFilter: ["aria-selected", "aria-pressed"] });
  window.addEventListener("resize", () => syncSelect(), { passive: true });

  /* ---------- stagger indices for menus, lists, timelines, steps, bars ---------- */
  function stagger(scope = document) {
    scope.querySelectorAll(".menu, .command-list, .timeline, .stepper, .bars").forEach((list) => {
      let k = 0; for (const ch of list.children) { if (ch.classList.contains("m-ind")) continue; ch.style.setProperty("--i", k);
        const bar = ch.querySelectorAll("i"); bar.forEach((b) => b.style.setProperty("--i", k)); k++; }
    });
  }

  /* ---------- count-up numbers ---------- */
  const NUM = /^([^\d-]*?)(-?[\d,]*\.?\d+)(.*)$/;
  function countUp(el) {
    if (el.dataset.mCounted) return; el.dataset.mCounted = "1";
    const m = (el.dataset.countup || el.textContent.trim()).match(NUM); if (!m || off()) return;
    const [, pre, num, post] = m; const target = parseFloat(num.replace(/,/g, "")); const dec = (num.split(".")[1] || "").length; const comma = num.includes(",");
    const fmt = (v) => { let s = v.toFixed(dec); if (comma) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); return pre + s + post; };
    const t0 = performance.now(), dur = 900;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(target * e); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target); };
    requestAnimationFrame(step);
  }

  /* ---------- reveal on scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => {
    for (const en of ents) if (en.isIntersecting) { const el = en.target; io.unobserve(el);
      if (el.matches(".kpi-value, [data-countup]")) countUp(el); else el.classList.remove("m-wait"); }
  }, { threshold: 0.25 }) : null;
  function reveal(scope = document) {
    if (!io || off()) return;
    scope.querySelectorAll(".bars, .stepper").forEach((el) => { if (el.dataset.mSeen) return; el.dataset.mSeen = "1"; el.classList.add("m-wait"); io.observe(el); });
    scope.querySelectorAll(".kpi-value, [data-countup]").forEach((el) => { if (!el.dataset.mCounted) io.observe(el); });
  }

  /* ---------- accordion: animate height ---------- */
  document.addEventListener("click", (e) => {
    const sm = e.target.closest(".accordion summary"); if (!sm || off()) return;
    const d = sm.parentElement, body = d.querySelector(":scope > div"); if (!body || !body.animate) return;
    e.preventDefault();
    if (d.open) { const h = body.offsetHeight; const a = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 240, easing: "cubic-bezier(.65,0,.35,1)" }); a.onfinish = () => { d.open = false; }; }
    else { d.open = true; const h = body.offsetHeight; body.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" }); }
  });

  /* ---------- small delights ---------- */
  document.addEventListener("input", (e) => { const t = e.target; if (t.closest && t.closest(".otp") && t.value) { t.classList.remove("m-filled"); t.offsetWidth; t.classList.add("m-filled"); } });
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn"); if (b && b.querySelector('use[href="#send"]')) { b.classList.remove("m-sent"); b.offsetWidth; b.classList.add("m-sent"); }
    if (e.target.closest(".dropdown [data-dropdown-trigger]")) requestAnimationFrame(() => stagger(e.target.closest(".dropdown")));
  });
  // shake invalid inputs when a form is submitted
  document.addEventListener("submit", () => requestAnimationFrame(() => document.querySelectorAll('[aria-invalid="true"]').forEach((i) => { i.classList.remove("m-shake"); i.offsetWidth; i.classList.add("m-shake"); })), true);

  /* ---------- toasts: progress bar + exit animation (wraps Facet.toast) ---------- */
  function wrapToast() {
    if (!window.Facet || !Facet.toast || Facet.toast.mWrapped) return;
    const orig = Facet.toast;
    const wrapped = (opts = {}) => {
      const timeout = opts.timeout === undefined ? 4000 : opts.timeout;
      const t = orig({ ...opts, timeout: 0 });
      if (timeout) {
        const p = document.createElement("i"); p.className = "m-progress"; p.style.animationDuration = timeout + "ms"; t.appendChild(p);
        p.addEventListener("animationend", () => leave(t));
      }
      const x = t.querySelector("button"); if (x) x.onclick = () => leave(t);
      return t;
    };
    const leave = (t) => { if (off()) return t.remove(); t.classList.add("m-leaving"); setTimeout(() => t.remove(), 220); };
    wrapped.mWrapped = true; Facet.toast = wrapped;
  }

  /* ---------- public API ---------- */
  function refresh(scope = document) { stagger(scope); reveal(scope); requestAnimationFrame(() => syncSelect(scope)); }
  function set(mode) { root.dataset.motion = mode; try { localStorage.setItem("facet-motion", mode); } catch (e) {} document.dispatchEvent(new CustomEvent("facet:motion", { detail: mode })); }
  try { const m = localStorage.getItem("facet-motion"); if (m) root.dataset.motion = m; } catch (e) {}
  const init = () => { wrapToast(); refresh(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => syncSelect()); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.Facet = window.Facet || {}; window.Facet.motion = { refresh, set, countUp };
})();
