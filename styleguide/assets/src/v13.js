
/* =========================================================================
   Facet UI v1.3 — behaviours for the shadcn/ui parity components
   Sonner · Select · Combobox · Menubar · Navigation Menu · Message Scroller ·
   Questionnaire · Bubble (show more) · Textarea (counter, autosize)
   ========================================================================= */
(function () {
  "use strict";
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (t, s, fn, opt) => document.addEventListener(t, (e) => { const el = e.target.closest && e.target.closest(s); if (el) fn(e, el); }, opt);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ico = (n) => `<svg class="icon" aria-hidden="true"><use href="#${n}"/></svg>`;

  /* ---------- Sonner: Facet.sonner({ title, description, type, action, duration, target }) ---------- */
  const TYPE_ICON = { success: "circle-check", error: "circle-x", info: "info", warning: "circle-alert", loading: "loader-circle", default: "" };
  const MAX_VISIBLE = 3;
  function sonnerRegion(target) {
    if (target) return typeof target === "string" ? document.getElementById(target) : target;
    let r = document.querySelector(".sonner:not([data-inline])");
    if (!r) { r = document.createElement("section"); r.className = "sonner"; r.setAttribute("aria-label", "Notifications"); r.setAttribute("aria-live", "polite"); document.body.appendChild(r); }
    return r;
  }
  function sonnerLayout(r) {
    const items = $$(".sonner-toast:not([data-leaving])", r).reverse();
    let y = 0;
    items.forEach((t, i) => {
      t.style.setProperty("--i", Math.min(i, MAX_VISIBLE));
      t.style.setProperty("--y", -y + "px");
      y += t.offsetHeight + 8;
      t.toggleAttribute("data-front", i === 0);
      t.toggleAttribute("data-hidden", i >= MAX_VISIBLE);
    });
    if (items[0]) r.style.setProperty("--front-h", items[0].scrollHeight + "px");
    r.style.minHeight = r.matches(":hover, [data-expanded]") ? y + "px" : "";
  }
  function dismiss(t) {
    if (!t || t.hasAttribute("data-leaving")) return;
    const r = t.parentElement; t.setAttribute("data-leaving", ""); clearTimeout(t._timer);
    sonnerLayout(r); setTimeout(() => { t.remove(); sonnerLayout(r); }, 300);
  }
  function sonner(o = {}) {
    if (typeof o === "string") o = { title: o };
    const r = sonnerRegion(o.target);
    const t = document.createElement("div");
    t.className = "sonner-toast"; t.setAttribute("role", o.type === "error" ? "alert" : "status");
    if (o.type && o.type !== "default") t.dataset.type = o.type;
    if (o.rich) t.setAttribute("data-rich", "");
    const icon = TYPE_ICON[o.type || "default"];
    t.innerHTML = `<button class="sonner-close" aria-label="Close">${ico("x")}</button>${icon ? ico(icon) : ""}<div class="grow"><b>${esc(o.title || "Notification")}</b>${o.description ? `<span>${esc(o.description)}</span>` : ""}</div>${o.action ? `<button class="btn btn-sm">${esc(o.action.label || o.action)}</button>` : ""}`;
    t.querySelector(".sonner-close").onclick = () => dismiss(t);
    const act = t.querySelector(".btn"); if (act) act.onclick = () => { if (o.action.onClick) o.action.onClick(); dismiss(t); };
    r.appendChild(t); sonnerLayout(r);
    const arm = (ms) => { clearTimeout(t._timer); if (ms !== Infinity && ms > 0) t._timer = setTimeout(() => dismiss(t), ms); };
    arm(o.type === "loading" ? Infinity : o.duration || 4000);
    t.update = (n) => { const next = sonner.__swap(t, n); arm(n.duration || 4000); return next; };
    return t;
  }
  sonner.__swap = (t, n) => {
    if (n.type) t.dataset.type = n.type; const ic = t.querySelector(":scope > .icon"); if (ic) ic.querySelector("use").setAttribute("href", "#" + TYPE_ICON[n.type || "default"]);
    if (n.title) t.querySelector("b").textContent = n.title;
    let d = t.querySelector(".grow > span"); if (n.description) { if (!d) { d = document.createElement("span"); t.querySelector(".grow").appendChild(d); } d.textContent = n.description; }
    sonnerLayout(t.parentElement); return t;
  };
  sonner.promise = (p, msgs = {}) => { const t = sonner({ type: "loading", title: msgs.loading || "Loading…", target: msgs.target }); Promise.resolve(p).then(() => t.update({ type: "success", title: msgs.success || "Done" }), () => t.update({ type: "error", title: msgs.error || "Something went wrong" })); return t; };
  sonner.dismiss = (t) => (t ? dismiss(t) : $$(".sonner-toast").forEach(dismiss));
  ["success", "error", "info", "warning", "loading"].forEach((k) => (sonner[k] = (title, o = {}) => sonner({ ...o, title, type: k })));
  document.addEventListener("mouseover", (e) => { const r = e.target.closest && e.target.closest(".sonner"); if (r && !r._hover) { r._hover = 1; sonnerLayout(r); $$(".sonner-toast", r).forEach((t) => clearTimeout(t._timer)); } });
  document.addEventListener("mouseout", (e) => { const r = e.target.closest && e.target.closest(".sonner"); if (r && !r.contains(e.relatedTarget)) { r._hover = 0; requestAnimationFrame(() => sonnerLayout(r)); $$(".sonner-toast:not([data-type=loading])", r).forEach((t) => (t._timer = setTimeout(() => dismiss(t), 2500))); } });
  on("click", "[data-sonner]", (e, b) => {
    const o = JSON.parse(b.dataset.sonner || "{}");
    if (o.promise) { sonner.promise(new Promise((res, rej) => setTimeout(o.promise === "reject" ? rej : res, 1800)), { loading: o.title, success: o.success, error: o.error, target: o.target }); return; }
    if (o.action) o.action = { label: o.action, onClick: () => sonner({ title: "Undone", type: "info", target: o.target }) };
    sonner(o);
  });

  /* ---------- Select (custom listbox) ---------- */
  function selectSync(dd) {
    const sel = $$('.menu-item[role="option"][aria-selected="true"]', dd).map((o) => o.dataset.label || o.textContent.trim());
    const v = dd.querySelector(".select-trigger .value"); if (!v) return;
    if (dd.hasAttribute("data-multiple")) {
      const chips = dd.querySelector(".combobox-chips");
      if (chips) { chips.innerHTML = sel.map((s) => `<span class="badge badge-outline">${esc(s)}</span>`).join(""); v.hidden = !!sel.length; }
      else v.textContent = sel.length > 2 ? `${sel.length} selected` : sel.join(", ");
    } else v.textContent = sel[0] || "";
  }
  on("click", '.dropdown[data-select] .menu-item[role="option"]', (e, o) => {
    const dd = o.closest(".dropdown"), multi = dd.hasAttribute("data-multiple");
    if (multi) { e.stopPropagation(); o.setAttribute("aria-selected", o.getAttribute("aria-selected") !== "true"); }
    else { $$('.menu-item[role="option"]', dd).forEach((x) => x.setAttribute("aria-selected", x === o)); }
    selectSync(dd);
    dd.dispatchEvent(new CustomEvent("facet:change", { bubbles: true, detail: { value: multi ? $$('[role="option"][aria-selected="true"]', dd).map((x) => x.dataset.value) : o.dataset.value } }));
  }, true);

  /* ---------- Combobox: search filters the listbox ---------- */
  on("input", ".combobox-search input", (e, inp) => {
    const menu = inp.closest(".menu"), q = inp.value.trim().toLowerCase(); let n = 0;
    $$('.menu-item[role="option"]', menu).forEach((o) => { const hit = !q || o.textContent.toLowerCase().includes(q); o.hidden = !hit; if (hit) n++; });
    $$(".menu-label", menu).forEach((l) => { let s = l.nextElementSibling, any = false; while (s && !s.classList.contains("menu-label")) { if (s.matches('[role="option"]') && !s.hidden) any = true; s = s.nextElementSibling; } l.hidden = !any; });
    menu.toggleAttribute("data-empty", !n);
  });
  on("keydown", ".combobox-search input", (e, inp) => {
    if (e.key === "ArrowDown") { e.preventDefault(); const f = inp.closest(".menu").querySelector('.menu-item[role="option"]:not([hidden])'); if (f) f.focus(); }
    if (e.key === "Enter") { e.preventDefault(); const f = inp.closest(".menu").querySelector('.menu-item[role="option"]:not([hidden])'); if (f) f.click(); }
  });
  on("click", ".dropdown[data-combobox] > [data-dropdown-trigger]", (e, b) => {
    const dd = b.closest(".dropdown"); setTimeout(() => { if (dd.dataset.open === "true") { const i = dd.querySelector(".combobox-search input"); if (i) i.focus(); } }, 0);
  });

  /* ---------- Menubar: hover switches menus once one is open, ←/→ move ---------- */
  on("mouseover", ".menubar .menubar-trigger", (e, b) => {
    const bar = b.closest(".menubar"), open = bar.querySelector('.dropdown[data-open="true"]'), dd = b.closest(".dropdown");
    if (open && open !== dd) { open.dataset.open = "false"; open.querySelector(".menubar-trigger").setAttribute("aria-expanded", "false"); dd.dataset.open = "true"; b.setAttribute("aria-expanded", "true"); b.focus(); }
  });
  on("keydown", ".menubar", (e, bar) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const trigs = $$(".menubar-trigger", bar), cur = e.target.closest(".dropdown"), i = trigs.indexOf(cur.querySelector(".menubar-trigger"));
    const next = trigs[(i + (e.key === "ArrowRight" ? 1 : -1) + trigs.length) % trigs.length]; e.preventDefault();
    const wasOpen = cur.dataset.open === "true"; cur.dataset.open = "false"; cur.querySelector(".menubar-trigger").setAttribute("aria-expanded", "false");
    if (wasOpen) { next.closest(".dropdown").dataset.open = "true"; next.setAttribute("aria-expanded", "true"); const f = next.closest(".dropdown").querySelector(".menu-item"); if (f) f.focus(); } else next.focus();
  });

  /* ---------- Navigation Menu ---------- */
  function navOpen(nav, trig) {
    const vp = nav.querySelector(".nav-menu-viewport");
    $$(".nav-menu-trigger", nav).forEach((t) => t.setAttribute("aria-expanded", t === trig));
    $$(".nav-menu-panel", nav).forEach((p) => p.toggleAttribute("data-active", trig && p.id === trig.getAttribute("aria-controls")));
    if (trig) { vp.setAttribute("data-open", ""); vp.style.left = Math.max(0, trig.offsetLeft - 4) + "px"; } else vp.removeAttribute("data-open");
  }
  on("click", ".nav-menu-trigger", (e, t) => { const nav = t.closest(".nav-menu"); navOpen(nav, t.getAttribute("aria-expanded") === "true" ? null : t); });
  on("mouseover", ".nav-menu-trigger", (e, t) => { if (matchMedia("(hover: hover)").matches) navOpen(t.closest(".nav-menu"), t); });
  document.addEventListener("mouseout", (e) => { const nav = e.target.closest && e.target.closest(".nav-menu"); if (nav && !nav.contains(e.relatedTarget) && matchMedia("(hover: hover)").matches) navOpen(nav, null); });
  document.addEventListener("click", (e) => { $$(".nav-menu").forEach((n) => { if (!n.contains(e.target)) navOpen(n, null); }); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".nav-menu").forEach((n) => { const t = n.querySelector('.nav-menu-trigger[aria-expanded="true"]'); navOpen(n, null); if (t && n.contains(document.activeElement)) t.focus(); }); });

  /* ---------- Message Scroller ---------- */
  function scroller(s) {
    if (s._init) return; s._init = 1;
    const vp = s.querySelector(".message-scroller-viewport"), content = s.querySelector(".message-scroller-content"), jump = s.querySelector(".message-scroller-jump");
    if (!vp || !content) return;
    let unread = 0;
    const atBottom = () => vp.scrollHeight - vp.scrollTop - vp.clientHeight < 48;
    const count = jump && jump.querySelector(".badge");
    const sync = () => { if (atBottom()) unread = 0; if (jump) { jump.hidden = atBottom(); if (count) { count.textContent = unread; count.hidden = !unread; } } };
    vp.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    if (jump) jump.addEventListener("click", () => { vp.scrollTo({ top: vp.scrollHeight }); unread = 0; sync(); });
    // Anchor: a new user turn scrolls to the top of the viewport so the reply streams in below it.
    new MutationObserver((muts) => {
      const added = muts.flatMap((m) => Array.from(m.addedNodes)).filter((n) => n.nodeType === 1 && !n.hasAttribute("data-prepend"));
      if (!added.length) return;
      const turn = added.find((n) => n.hasAttribute("data-turn"));
      if (turn) vp.scrollTo({ top: turn.offsetTop - content.offsetTop });
      else if (s._stick) vp.scrollTo({ top: vp.scrollHeight });
      else unread += added.length;
      sync();
    }).observe(content, { childList: true });
    vp.addEventListener("scroll", () => { s._stick = atBottom(); }, { passive: true });
    // Visibility tracking: messages report data-seen once half visible.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.dataset.seen = "true"; io.unobserve(x.target); s.dispatchEvent(new CustomEvent("facet:seen", { bubbles: true, detail: { id: x.target.id } })); } }), { root: vp, threshold: 0.5 });
      const watch = () => $$('[data-seen="false"]', content).forEach((m) => io.observe(m));
      watch(); new MutationObserver(watch).observe(content, { childList: true });
    }
    vp.scrollTop = vp.scrollHeight; s._stick = true; sync();
  }
  on("click", "[data-scroll-to]", (e, b) => {
    const m = document.getElementById(b.dataset.scrollTo); if (!m) return;
    const vp = m.closest(".message-scroller-viewport"); vp.scrollTo({ top: m.offsetTop - vp.querySelector(".message-scroller-content").offsetTop - 12 });
    m.removeAttribute("data-highlight"); void m.offsetWidth; m.setAttribute("data-highlight", "");
  });
  on("click", "[data-scroller-demo]", (e, b) => {
    const s = document.getElementById(b.dataset.scrollerDemo), content = s.querySelector(".message-scroller-content");
    const kind = b.dataset.kind || "reply";
    if (kind === "earlier") {
      const vp = s.querySelector(".message-scroller-viewport"), h = vp.scrollHeight;
      const el = document.createElement("div"); el.className = "bubble-row"; el.setAttribute("data-prepend", "");
      el.innerHTML = `<div class="bubble">An earlier message, restored from history.</div>`;
      content.insertBefore(el, content.querySelector(".message-scroller-load").nextSibling); vp.scrollTop += vp.scrollHeight - h; return;
    }
    if (kind === "ask") {
      const el = document.createElement("div"); el.className = "bubble-row"; el.dataset.align = "end"; el.setAttribute("data-turn", "");
      el.innerHTML = `<div class="bubble" data-variant="primary">Can you summarise this thread?</div>`; content.appendChild(el);
    }
    const r = document.createElement("div"); r.className = "bubble-row";
    r.innerHTML = `<div class="bubble"></div>`; content.appendChild(r);
    const words = "Sure — the team agreed to ship the redesign on Friday, Ada owns QA, and the pricing page waits for legal sign-off.".split(" ");
    let i = 0; const bub = r.firstChild, vp = s.querySelector(".message-scroller-viewport");
    const tick = setInterval(() => { bub.textContent += (i ? " " : "") + words[i++]; if (s._stick) vp.scrollTop = vp.scrollHeight; if (i >= words.length) clearInterval(tick); }, 60);
  });

  /* ---------- Questionnaire ---------- */
  function qInit(q) {
    if (q._init) return; q._init = 1;
    const steps = $$(".q-step", q); if (!steps.length) return;
    q._i = 0; qShow(q);
  }
  function qShow(q) {
    const steps = $$(".q-step", q), i = q._i, step = steps[i];
    steps.forEach((s, k) => s.toggleAttribute("data-active", k === i));
    const p = q.querySelector(".q-head .progress > div"), lab = q.querySelector(".q-count");
    if (p) p.style.width = ((i + 1) / steps.length) * 100 + "%"; if (lab) lab.textContent = `${i + 1} of ${steps.length}`;
    const back = q.querySelector("[data-q-back]"), next = q.querySelector("[data-q-next]"), skip = q.querySelector("[data-q-skip]");
    if (back) back.disabled = i === 0;
    if (next) { next.textContent = i === steps.length - 1 ? "Submit" : "Next"; next.disabled = step.hasAttribute("data-required") && !qAnswer(step).length; }
    if (skip) skip.hidden = step.hasAttribute("data-required");
  }
  function qAnswer(step) {
    const vals = $$("input:checked", step).map((i) => i.value === "__other" ? (step.querySelector(".q-other input") || {}).value || "" : i.value).filter(Boolean);
    const free = step.querySelector("textarea"); if (free && free.value.trim()) vals.push(free.value.trim());
    return vals;
  }
  function qGo(q, d) {
    const steps = $$(".q-step", q);
    if (d > 0 && q._i === steps.length - 1) {
      const dl = q.querySelector(".q-summary dl");
      if (dl) dl.innerHTML = steps.map((s) => `<dt>${esc(s.dataset.key || s.querySelector("h4").textContent)}</dt><dd>${esc(qAnswer(s).join(", ") || "Skipped")}</dd>`).join("");
      q.setAttribute("data-done", "");
      q.dispatchEvent(new CustomEvent("facet:submit", { bubbles: true, detail: Object.fromEntries(steps.map((s) => [s.dataset.key || s.querySelector("h4").textContent, qAnswer(s)])) }));
      return;
    }
    q._i = Math.max(0, Math.min(steps.length - 1, q._i + d)); qShow(q);
    const f = steps[q._i].querySelector("input, textarea"); if (f) f.focus({ preventScroll: true });
  }
  on("click", "[data-q-next]", (e, b) => qGo(b.closest(".questionnaire"), 1));
  on("click", "[data-q-back]", (e, b) => qGo(b.closest(".questionnaire"), -1));
  on("click", "[data-q-skip]", (e, b) => { const q = b.closest(".questionnaire"); $$("input", $$(".q-step", q)[q._i]).forEach((i) => (i.checked = false)); qGo(q, 1); });
  on("click", "[data-q-restart]", (e, b) => { const q = b.closest(".questionnaire"); q.removeAttribute("data-done"); q._i = 0; $$("input", q).forEach((i) => { i.checked = false; if (i.type === "text") i.value = ""; }); $$("textarea", q).forEach((t) => (t.value = "")); qShow(q); });
  on("change", ".questionnaire input", (e, i) => { const q = i.closest(".questionnaire"); qShow(q); if (i.value === "__other" && i.checked) { const o = i.closest(".q-step").querySelector(".q-other input"); if (o) o.focus(); } });
  on("input", ".questionnaire textarea, .questionnaire .q-other input", (e, i) => qShow(i.closest(".questionnaire")));
  on("keydown", ".questionnaire", (e, q) => {
    if (q.hasAttribute("data-done") || e.target.matches("textarea, input[type=text]")) { if (e.key === "Enter" && e.target.matches("input[type=text]")) { e.preventDefault(); qGo(q, 1); } return; }
    const step = $$(".q-step", q)[q._i], opts = $$(".q-option input", step);
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= opts.length) { e.preventDefault(); const o = opts[n - 1]; o.checked = o.type === "checkbox" ? !o.checked : true; o.dispatchEvent(new Event("change", { bubbles: true })); }
    if (e.key === "Enter") { const nx = q.querySelector("[data-q-next]"); if (nx && !nx.disabled) { e.preventDefault(); qGo(q, 1); } }
  });

  /* ---------- Bubble: show more ---------- */
  on("click", ".bubble-toggle", (e, b) => { const bub = b.closest(".bubble"), x = !bub.hasAttribute("data-expanded"); bub.toggleAttribute("data-expanded", x); b.textContent = x ? "Show less" : "Show more"; b.setAttribute("aria-expanded", x); });

  /* ---------- Textarea: counter + autosize ---------- */
  function taSync(t) {
    const c = t.parentElement.querySelector(".textarea-count");
    if (c) { const max = +t.getAttribute("maxlength") || +t.dataset.max || 0; c.textContent = max ? `${t.value.length} / ${max}` : t.value.length; c.toggleAttribute("data-over", max && t.value.length >= max); }
    if (t.hasAttribute("data-autosize")) { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
  }
  on("input", ".textarea", (e, t) => taSync(t));

  /* ---------- init / refresh ---------- */
  function refresh(scope = document) {
    $$(".message-scroller", scope).forEach(scroller); $$(".questionnaire", scope).forEach(qInit);
    $$(".dropdown[data-select]", scope).forEach(selectSync); $$(".textarea-wrap .textarea, .textarea[data-autosize]", scope).forEach(taSync);
    $$(".sonner[data-inline]", scope).forEach(sonnerLayout);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => refresh()); else refresh();
  const prevEnhance = window.Facet && Facet.enhance;
  window.Facet = window.Facet || {};
  Facet.enhance = (scope = document) => { if (prevEnhance) prevEnhance(scope); refresh(scope); };
  Facet.sonner = sonner;
  Facet.ui = Object.assign(Facet.ui || {}, { refreshV13: refresh });
})();
