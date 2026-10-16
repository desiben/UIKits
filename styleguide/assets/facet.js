/* =========================================================================
   Facet UI — runtime (v1.0). No dependencies.
   - Facet.theme  : light/dark, brand presets, density, custom brand from any color
   - Facet.ui     : progressive enhancement for tabs, menus, dialogs, toggles, OTP, toasts
   Usage: <script src="assets/facet.js" defer></script>
   ========================================================================= */
(function (global) {
  "use strict";

  /* ---------------- Color math (sRGB <-> OKLCH) ---------------- */
  const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  function hexToRgb(hex) {
    let h = String(hex).trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error("Invalid hex color: " + hex);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  }
  const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
  function rgbToOklch([r, g, b]) {
    r = toLin(r); g = toLin(g); b = toLin(b);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
  }
  function oklchToRgb([L, C, H]) {
    const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(toGam);
  }
  const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
  function oklchToHex(lch) {
    let [L, C, H] = lch;
    while (C > 0 && !inGamut(oklchToRgb([L, C, H]))) C -= 0.002; // reduce chroma to fit sRGB
    return rgbToHex(oklchToRgb([L, Math.max(C, 0), H]));
  }
  function luminance(hex) { const [r, g, b] = hexToRgb(hex).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  /* Same lightness / chroma curve used to generate the Figma primitives (scripts/generate_palette.py) */
  const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const L = { 50: 0.975, 100: 0.945, 200: 0.89, 300: 0.82, 400: 0.72, 500: 0.63, 600: 0.545, 700: 0.475, 800: 0.39, 900: 0.3, 950: 0.215 };
  const CF = { 50: 0.18, 100: 0.32, 200: 0.55, 300: 0.78, 400: 0.95, 500: 1, 600: 1, 700: 0.92, 800: 0.8, 900: 0.62, 950: 0.5 };

  /** Build an 11-step brand ramp (50–950) from any color. Guarantees brand-600 >= 4.5:1 on white. */
  function ramp(hex) {
    const [, c, h] = rgbToOklch(hexToRgb(hex));
    const peak = Math.min(c, 0.26); // greys stay neutral (c ≈ 0)
    const out = {};
    for (const s of STEPS) out[s] = oklchToHex([L[s], peak * CF[s], h]);
    // Accessibility guard: darken 600/700 until they pass AA against white text.
    let l6 = L[600];
    while (contrast(out[600], "#ffffff") < 4.5 && l6 > 0.3) { l6 -= 0.01; out[600] = oklchToHex([l6, peak, h]); }
    let l7 = Math.min(L[700], l6 - 0.06);
    out[700] = oklchToHex([l7, peak * CF[700], h]);
    while (contrast(out[700], "#ffffff") < 6 && l7 > 0.25) { l7 -= 0.01; out[700] = oklchToHex([l7, peak * CF[700], h]); }
    return out;
  }

  /* ---------------- Theme API ---------------- */
  const root = document.documentElement;
  const KEY = "facet-theme";
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  const theme = {
    presets: { iris: "#5d4ff3", ember: "#be4000", lagoon: "#00817c", rose: "#c02b6c", cobalt: "#0072c5", forest: "#00864c" },
    ramp, contrast,
    get() { return { mode: root.dataset.theme || "light", brand: root.dataset.brand || "iris", density: root.dataset.density || "comfortable", custom: root.dataset.custom || null }; },
    setMode(mode) { root.dataset.theme = mode; this._save(); this._emit(); },
    setDensity(d) { root.dataset.density = d; this._save(); this._emit(); },
    /** Switch to a built-in brand preset (iris | ember | lagoon | rose | cobalt | forest). */
    setBrand(name) { this._clearCustom(); root.dataset.brand = name; this._save(); this._emit(); },
    /** Use ANY color as the brand. Generates and applies --brand-50 … --brand-950. Returns the ramp. */
    setCustomBrand(hex, el = root) {
      const r = ramp(hex);
      for (const s of STEPS) el.style.setProperty(`--brand-${s}`, r[s]);
      if (el === root) { root.dataset.custom = hex; root.dataset.brand = "custom"; this._save(); this._emit(); }
      return r;
    },
    /** CSS you can paste into your own stylesheet for a generated brand. */
    cssFor(hex, name = "custom") {
      const r = ramp(hex);
      return `[data-brand="${name}"] {\n` + STEPS.map((s) => `  --brand-${s}: ${r[s]};`).join("\n") + "\n}";
    },
    _clearCustom() { for (const s of STEPS) root.style.removeProperty(`--brand-${s}`); delete root.dataset.custom; },
    _save() { store.set(this.get()); },
    _emit() { document.dispatchEvent(new CustomEvent("facet:theme", { detail: this.get() })); },
    restore() {
      const s = store.get();
      if (s.mode) root.dataset.theme = s.mode;
      if (s.density) root.dataset.density = s.density;
      if (s.custom) this.setCustomBrand(s.custom); else if (s.brand) root.dataset.brand = s.brand;
    },
  };

  /* ---------------- Toasts ---------------- */
  function toast({ title = "Saved", description = "", tone = "var(--bg-primary)", icon = "check-circle-2", timeout = 4000 } = {}) {
    let region = document.querySelector(".toast-region");
    if (!region) { region = document.createElement("div"); region.className = "toast-region"; region.setAttribute("role", "status"); region.setAttribute("aria-live", "polite"); document.body.appendChild(region); }
    const t = document.createElement("div");
    t.className = "toast"; t.style.setProperty("--tone", tone);
    t.innerHTML = `<svg class="icon" style="color:${tone};margin-top:2px"><use href="#${icon}"/></svg><div class="grow"><b></b><span></span></div><button class="btn btn-ghost btn-sm icon-btn" aria-label="Dismiss"><svg class="icon icon-sm"><use href="#x"/></svg></button>`;
    t.querySelector("b").textContent = title; t.querySelector("span").textContent = description;
    t.querySelector("button").onclick = () => t.remove();
    region.appendChild(t);
    if (timeout) setTimeout(() => t.remove(), timeout);
    return t;
  }

  /* ---------------- Behaviours (event delegation) ---------------- */
  let lastFocus = null;
  function openOverlay(id) {
    const o = document.getElementById(id); if (!o) return;
    lastFocus = document.activeElement; o.hidden = false;
    const f = o.querySelector("[autofocus], input, button, [tabindex]:not([tabindex='-1'])"); if (f) f.focus();
  }
  function closeOverlay(o) { o.hidden = true; if (lastFocus) lastFocus.focus(); }

  function enhance(scope = document) {
    scope.querySelectorAll(".slider").forEach((s) => {
      const upd = () => s.style.setProperty("--val", ((s.value - (s.min || 0)) / ((s.max || 100) - (s.min || 0))) * 100 + "%");
      upd(); s.addEventListener("input", upd);
    });
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    // Tabs
    const tab = t.closest('[role="tab"]');
    if (tab) {
      const list = tab.closest('[role="tablist"]');
      list.querySelectorAll('[role="tab"]').forEach((x) => { x.setAttribute("aria-selected", x === tab); x.tabIndex = x === tab ? 0 : -1; const p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = x !== tab; });
    }
    // Toggle buttons & chips
    const tg = t.closest("[data-toggle]");
    if (tg) {
      const group = tg.closest("[data-single]");
      if (group) group.querySelectorAll("[data-toggle]").forEach((x) => x.setAttribute("aria-pressed", x === tg));
      else tg.setAttribute("aria-pressed", tg.getAttribute("aria-pressed") !== "true");
    }
    // Dropdowns
    const trig = t.closest("[data-dropdown-trigger]");
    document.querySelectorAll('.dropdown[data-open="true"]').forEach((d) => { if (!trig || !d.contains(trig)) { d.dataset.open = "false"; const b = d.querySelector("[data-dropdown-trigger]"); if (b) b.setAttribute("aria-expanded", "false"); } });
    if (trig) { const d = trig.closest(".dropdown"); const open = d.dataset.open !== "true"; d.dataset.open = open; trig.setAttribute("aria-expanded", open); if (open) { const first = d.querySelector(".menu-item"); if (first) first.focus(); } }
    if (t.closest(".dropdown .menu-item")) { const d = t.closest(".dropdown"); d.dataset.open = "false"; }
    // Overlays
    const op = t.closest("[data-open]"); if (op && op.dataset.open && !op.classList.contains("dropdown")) openOverlay(op.dataset.open);
    if (t.closest("[data-close]")) closeOverlay(t.closest(".overlay"));
    if (t.classList && t.classList.contains("overlay")) closeOverlay(t);
    // Toast trigger
    const tt = t.closest("[data-toast]"); if (tt) (global.Facet.toast || toast)(JSON.parse(tt.dataset.toast || "{}"));
    // Calendar day select
    const day = t.closest(".cal-day"); if (day && !day.classList.contains("muted")) { day.closest(".cal-grid").querySelectorAll(".cal-day").forEach((d) => d.removeAttribute("aria-selected")); day.setAttribute("aria-selected", "true"); }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const o = [...document.querySelectorAll(".overlay:not([hidden])")].pop(); if (o) closeOverlay(o);
      document.querySelectorAll('.dropdown[data-open="true"]').forEach((d) => (d.dataset.open = "false"));
    }
    // Arrow keys within tablists and menus
    const tl = e.target.closest('[role="tablist"]');
    if (tl && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      const tabs = [...tl.querySelectorAll('[role="tab"]')]; const i = tabs.indexOf(e.target.closest('[role="tab"]'));
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); n.click();
    }
    const menu = e.target.closest(".menu");
    if (menu && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault(); const items = [...menu.querySelectorAll(".menu-item:not([aria-disabled='true'])")]; const i = items.indexOf(document.activeElement);
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
    }
  });

  // OTP: auto-advance, backspace, paste
  document.addEventListener("input", (e) => {
    const inp = e.target; if (!inp.closest || !inp.closest(".otp")) return;
    inp.value = inp.value.replace(/\D/g, "").slice(-1);
    if (inp.value) { let n = inp.nextElementSibling; while (n && n.tagName !== "INPUT") n = n.nextElementSibling; if (n) n.focus(); }
  });
  document.addEventListener("keydown", (e) => {
    const inp = e.target; if (!inp.closest || !inp.closest(".otp") || e.key !== "Backspace" || inp.value) return;
    let p = inp.previousElementSibling; while (p && p.tagName !== "INPUT") p = p.previousElementSibling; if (p) { p.focus(); p.value = ""; }
  });
  document.addEventListener("paste", (e) => {
    const otp = e.target.closest && e.target.closest(".otp"); if (!otp) return; e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").split("");
    otp.querySelectorAll("input").forEach((x, i) => (x.value = digits[i] || ""));
  });

  theme.restore();
  document.addEventListener("DOMContentLoaded", () => enhance());
  global.Facet = { theme, toast, enhance, open: openOverlay, close: closeOverlay, color: { ramp, contrast, rgbToOklch, hexToRgb } };
})(window);

/* =========================================================================
   Facet UI v1.2 — behaviours for the new components (event delegation, no deps)
   Carousel · Data grid · File tree · Floating TOC · Holo card · Map · Chat (scroll,
   actions, tool approval) · Reactions · Rating · Resizable · Cells · Number stepper ·
   Rich text editor · Segment · Navbar · App layout · Context menu · Emoji picker ·
   Number value · Prompt input · Code block copy
   ========================================================================= */
(function () {
  "use strict";
  /* ---------- Style themes: <html data-style="glass|mono|soft"> ---------- */
  const STYLES = { default: "Default", soft: "Soft", glass: "Glass", mono: "Mono" };
  if (window.Facet && Facet.theme) {
    const T = Facet.theme, root = document.documentElement, get0 = T.get.bind(T);
    T.styles = STYLES;
    T.get = () => ({ ...get0(), style: root.dataset.style || "default" });
    T.setStyle = (name) => { if (!name || name === "default") delete root.dataset.style; else root.dataset.style = name; try { localStorage.setItem("facet-style", name || "default"); } catch (e) {} T._emit(); };
    try { const st = localStorage.getItem("facet-style"); if (st && st !== "default" && !root.dataset.style) root.dataset.style = st; } catch (e) {}
  }
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (t, s, fn, opt) => document.addEventListener(t, (e) => { const el = e.target.closest && e.target.closest(s); if (el) fn(e, el); }, opt);
  const toast = (o) => window.Facet && Facet.toast && Facet.toast(o);
  const copy = (txt) => (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast({ title: "Copied to clipboard", timeout: 1600 })).catch(() => {});

  /* ---------- Carousel ---------- */
  function carousel(c) {
    if (c._init) return; c._init = 1;
    const tr = c.querySelector(".carousel-track"), dots = c.querySelector(".carousel-dots"); if (!tr) return;
    const slides = Array.from(tr.children);
    if (dots && !dots.children.length) dots.innerHTML = slides.map((_, k) => `<button aria-label="Go to slide ${k + 1}"></button>`).join("");
    const idx = () => Math.round(tr.scrollLeft / (slides[0].offsetWidth + parseFloat(getComputedStyle(tr).columnGap || 0)));
    const sync = () => { const k = idx(); if (dots) Array.from(dots.children).forEach((d, j) => d.setAttribute("aria-current", j === k)); };
    tr.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true }); sync();
    c.addEventListener("click", (e) => {
      const go = (k) => { const s = slides[Math.max(0, Math.min(slides.length - 1, k))]; tr.scrollTo({ left: s.offsetLeft - tr.offsetLeft, behavior: "smooth" }); };
      if (e.target.closest(".carousel-nav.prev")) go(idx() - 1);
      if (e.target.closest(".carousel-nav.next")) go(idx() + 1);
      const d = e.target.closest(".carousel-dots button"); if (d) go(Array.from(dots.children).indexOf(d));
    });
    if (c.dataset.autoplay) setInterval(() => { if (c.matches(":hover")) return; const k = idx(); tr.scrollTo({ left: k >= slides.length - 1 ? 0 : slides[k + 1].offsetLeft - tr.offsetLeft, behavior: "smooth" }); }, +c.dataset.autoplay || 4000);
  }

  /* ---------- Data grid ---------- */
  function gridRecalc(grid) {
    $$("td[data-sum]", grid).forEach((td) => {
      const col = +td.dataset.sum; let s = 0;
      $$("tbody tr", grid).forEach((tr) => { if (tr.contains(td)) return; const c = tr.children[col]; if (c) { const v = parseFloat((c.textContent || "").replace(/[^0-9.-]/g, "")); if (!isNaN(v)) s += v; } });
      td.textContent = (td.dataset.prefix || "") + s.toLocaleString("en-US");
    });
  }
  function gridSelect(grid, td) {
    $$("td.sel", grid).forEach((x) => x.classList.remove("sel"));
    if (!td) return; td.classList.add("sel");
    const fx = grid.querySelector(".fx span"); if (fx) fx.textContent = td.dataset.sum !== undefined ? `=SUM(${String.fromCharCode(65 + +td.dataset.sum - 1)}:${String.fromCharCode(65 + +td.dataset.sum - 1)})` : td.textContent.trim();
    const ref = grid.querySelector(".fx-ref"); if (ref) { const tr = td.parentElement; ref.textContent = String.fromCharCode(64 + Array.from(tr.children).indexOf(td)) + (Array.from(tr.parentElement.children).indexOf(tr) + 1); }
  }
  function gridEdit(td) {
    if (!td.hasAttribute("data-edit")) return;
    td._orig = td.textContent; td.contentEditable = "true"; td.classList.add("editing"); td.focus();
    const r = document.createRange(); r.selectNodeContents(td); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function gridCommit(td, cancel) { if (!td.classList.contains("editing")) return; if (cancel) td.textContent = td._orig; td.contentEditable = "false"; td.classList.remove("editing"); gridRecalc(td.closest(".data-grid")); gridSelect(td.closest(".data-grid"), td); }
  on("click", ".data-grid td", (e, td) => { const g = td.closest(".data-grid"); const ed = g.querySelector("td.editing"); if (ed && ed !== td) gridCommit(ed); gridSelect(g, td); });
  on("dblclick", ".data-grid td[data-edit]", (e, td) => gridEdit(td));
  document.addEventListener("keydown", (e) => {
    const g = e.target.closest && e.target.closest(".data-grid"); if (!g) return;
    const ed = g.querySelector("td.editing"), sel = g.querySelector("td.sel");
    if (ed) { if (e.key === "Enter") { e.preventDefault(); gridCommit(ed); } else if (e.key === "Escape") gridCommit(ed, true); return; }
    if (!sel) return;
    const tr = sel.parentElement, ci = Array.from(tr.children).indexOf(sel);
    const mv = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[e.key];
    if (mv) { e.preventDefault(); const rows = $$("tbody tr", g); const ri = rows.indexOf(tr) + mv[0]; const row = rows[Math.max(0, Math.min(rows.length - 1, ri))]; const td = row.children[Math.max(1, Math.min(row.children.length - 1, ci + mv[1]))]; if (td && td.tagName === "TD") gridSelect(g, td); }
    else if (e.key === "Enter" || e.key === "F2") { e.preventDefault(); gridEdit(sel); }
  });
  on("change", ".data-grid thead input[type=checkbox]", (e, cb) => $$("tbody tr", cb.closest(".data-grid")).forEach((tr) => { const c = tr.querySelector("input[type=checkbox]"); if (c) { c.checked = cb.checked; tr.setAttribute("aria-selected", cb.checked); } }));
  on("change", ".data-grid tbody input[type=checkbox]", (e, cb) => cb.closest("tr").setAttribute("aria-selected", cb.checked));

  /* ---------- File tree ---------- */
  on("click", ".file-tree .ft-row", (e, row) => { $$(".ft-row[aria-selected]", row.closest(".file-tree")).forEach((r) => r.removeAttribute("aria-selected")); row.setAttribute("aria-selected", "true"); });

  /* ---------- Floating TOC ---------- */
  function floatingToc(t) {
    if (t._init || !("IntersectionObserver" in window)) return; t._init = 1;
    const links = $$("a[href^='#']", t), map = new Map();
    links.forEach((a) => { const id = a.getAttribute("href").slice(1); const h = document.getElementById(id); if (h) { if (!map.has(h)) map.set(h, []); map.get(h).push(a); } });
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { links.forEach((l) => l.classList.remove("on")); (map.get(en.target) || []).forEach((l) => l.classList.add("on")); } }), { rootMargin: "0px 0px -70% 0px" });
    map.forEach((_, h) => io.observe(h));
  }

  /* ---------- Holo card ---------- */
  document.addEventListener("pointermove", (e) => {
    const h = e.target.closest && e.target.closest(".holo-card:not([data-static])"); if (!h || document.documentElement.dataset.motion === "off") return;
    const r = h.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height, k = +h.dataset.tilt || 14;
    h.style.setProperty("--mx", px * 100 + "%"); h.style.setProperty("--my", py * 100 + "%");
    h.style.setProperty("--ry", ((px - 0.5) * k).toFixed(2) + "deg"); h.style.setProperty("--rx", ((0.5 - py) * k).toFixed(2) + "deg");
  }, { passive: true });
  document.addEventListener("pointerout", (e) => { const h = e.target.closest && e.target.closest(".holo-card"); if (h && !h.contains(e.relatedTarget)) ["--rx", "--ry", "--mx", "--my"].forEach((p) => h.style.removeProperty(p)); });

  /* ---------- Map ---------- */
  on("click", ".map-controls [data-zoom]", (e, b) => { const m = b.closest(".map"), base = m.querySelector(".map-layer") || m.querySelector(".map-base"); const z = Math.max(1, Math.min(3, (+m.dataset.z || 1) + (b.dataset.zoom === "in" ? 0.35 : -0.35))); m.dataset.z = z; base.style.transformOrigin = "50% 50%"; base.style.transition = "transform .45s cubic-bezier(.34,1.3,.64,1)"; base.style.transform = `scale(${z})`; });
  on("click", ".map-pin[data-popup]", (e, p) => { const pop = document.getElementById(p.dataset.popup); if (pop) pop.hidden = !pop.hidden; });

  /* ---------- Chat ---------- */
  function chatConversation(c) {
    if (c._init) return; c._init = 1;
    const btn = c.querySelector(".chat-scroll-btn"); if (!btn) return;
    const sync = () => { btn.hidden = c.scrollHeight - c.scrollTop - c.clientHeight < 60; };
    c.addEventListener("scroll", sync, { passive: true }); sync();
    btn.addEventListener("click", () => c.scrollTo({ top: c.scrollHeight, behavior: "smooth" }));
  }
  on("click", ".msg-actions [data-action]", (e, b) => {
    const a = b.dataset.action, bar = b.closest(".msg-actions");
    if (a === "copy") { const t = b.closest(".chat-msg").querySelector(".chat-msg-text"); copy(t ? t.innerText : ""); }
    if (a === "up" || a === "down") { const was = b.getAttribute("aria-pressed") === "true"; $$("[data-action=up],[data-action=down]", bar).forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", !was); if (!was) toast({ title: a === "up" ? "Thanks for the feedback" : "We'll do better", timeout: 1800 }); }
    if (a === "regenerate") { b.querySelector(".icon").animate([{ transform: "rotate(0)" }, { transform: "rotate(-360deg)" }], { duration: 600, easing: "cubic-bezier(.65,0,.35,1)" }); }
  });
  on("click", ".chat-tool [data-approve], .chat-tool [data-deny]", (e, b) => {
    const t = b.closest(".chat-tool"), ok = b.hasAttribute("data-approve"), st = t.querySelector(".status");
    t.dataset.state = ok ? "approved" : "denied";
    if (st) { st.dataset.state = ok ? "done" : "error"; st.innerHTML = ok ? '<svg class="icon icon-sm"><use href="#check"/></svg> Approved' : '<svg class="icon icon-sm"><use href="#x"/></svg> Denied'; }
    t.dispatchEvent(new CustomEvent("facet:approval", { bubbles: true, detail: { approved: ok } }));
  });
  on("click", "[data-copy-code]", (e, b) => { const pre = b.closest(".code-block").querySelector("pre"); copy(pre.innerText); });

  /* ---------- Reactions ---------- */
  on("click", ".reaction:not(.add)", (e, r) => { const p = r.getAttribute("aria-pressed") === "true", c = r.querySelector(".n"); r.setAttribute("aria-pressed", !p); if (c) c.textContent = Math.max(0, +c.textContent + (p ? -1 : 1)); });

  /* ---------- Rating ---------- */
  function ratingSync(r) { const v = +(r.querySelector("input:checked") || {}).value || 0; $$("label", r).forEach((l, k) => l.classList.toggle("on", k < v)); const o = r.parentElement.querySelector(".rating-value"); if (o && r.querySelector("input")) o.textContent = v ? v + ".0" : "—"; }
  on("change", ".rating input", (e, i) => ratingSync(i.closest(".rating")));

  /* ---------- Resizable ---------- */
  on("pointerdown", ".resizable-handle", (e, h) => {
    const box = h.parentElement, vert = box.dataset.direction === "vertical", a = h.previousElementSibling, b = h.nextElementSibling;
    const total = (vert ? a.offsetHeight + b.offsetHeight : a.offsetWidth + b.offsetWidth), start = vert ? e.clientY : e.clientX, sa = vert ? a.offsetHeight : a.offsetWidth;
    const min = +box.dataset.min || 80; h.classList.add("dragging"); h.setPointerCapture(e.pointerId); e.preventDefault();
    const mv = (ev) => { const d = (vert ? ev.clientY : ev.clientX) - start; const na = Math.max(min, Math.min(total - min, sa + d)); a.style.flex = `${na} 1 0`; b.style.flex = `${total - na} 1 0`; h.setAttribute("aria-valuenow", Math.round((na / total) * 100)); };
    const up = () => { h.classList.remove("dragging"); h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); };
    h.addEventListener("pointermove", mv); h.addEventListener("pointerup", up);
  });
  on("keydown", ".resizable-handle", (e, h) => {
    const box = h.parentElement, vert = box.dataset.direction === "vertical", k = vert ? { ArrowUp: -1, ArrowDown: 1 } : { ArrowLeft: -1, ArrowRight: 1 }; const d = k[e.key]; if (!d) return; e.preventDefault();
    const a = h.previousElementSibling, b = h.nextElementSibling, total = vert ? a.offsetHeight + b.offsetHeight : a.offsetWidth + b.offsetWidth, na = Math.max(80, Math.min(total - 80, (vert ? a.offsetHeight : a.offsetWidth) + d * 24));
    a.style.flex = `${na} 1 0`; b.style.flex = `${total - na} 1 0`;
  });

  /* ---------- Cells ---------- */
  on("input", ".cell-slider input[type=range]", (e, i) => { const o = i.closest(".cell-slider").querySelector("output"); if (o) o.textContent = (i.dataset.prefix || "") + i.value + (i.dataset.suffix || ""); });
  on("click", ".cell-swatches button", (e, b) => { $$("button", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === b)); const v = b.closest(".cell").querySelector(".cell-value"); if (v) v.textContent = b.getAttribute("aria-label") || ""; });
  on("input", ".cell-swatches input[type=color]", (e, i) => { const v = i.closest(".cell").querySelector(".cell-value"); if (v) v.textContent = i.value.toUpperCase(); $$("button", i.parentElement).forEach((x) => x.setAttribute("aria-pressed", "false")); });

  /* ---------- Number stepper ---------- */
  on("click", ".number-stepper button", (e, b) => {
    const w = b.closest(".number-stepper"), inp = w.querySelector("input"), step = +inp.step || 1, min = inp.min === "" ? -Infinity : +inp.min, max = inp.max === "" ? Infinity : +inp.max;
    const v = Math.max(min, Math.min(max, (+inp.value || 0) + (b.dataset.step === "down" ? -step : step)));
    inp.value = +v.toFixed(4); inp.classList.remove("bump"); void inp.offsetWidth; inp.classList.add("bump"); stepperSync(w); inp.dispatchEvent(new Event("change", { bubbles: true }));
  });
  on("input", ".number-stepper input", (e, i) => stepperSync(i.closest(".number-stepper")));
  function stepperSync(w) { const i = w.querySelector("input"); const [dn, up] = [w.querySelector("[data-step=down]"), w.querySelector("[data-step=up]")]; if (dn) dn.disabled = i.min !== "" && +i.value <= +i.min; if (up) up.disabled = i.max !== "" && +i.value >= +i.max; }

  /* ---------- Rich text editor ---------- */
  on("mousedown", ".rte-toolbar .btn, .rte-bubble .btn", (e) => e.preventDefault());
  on("click", ".rte [data-cmd]", (e, b) => {
    const rte = b.closest(".rte"), ed = rte.querySelector(".rte-content"); ed.focus();
    const c = b.dataset.cmd;
    if (c === "link") { const u = prompt("Link URL", "https://"); if (u) document.execCommand("createLink", false, u); }
    else if (c === "h2" || c === "p" || c === "blockquote") document.execCommand("formatBlock", false, c);
    else document.execCommand(c, false, null);
    rteSync(rte);
  });
  on("change", ".rte-toolbar select", (e, s) => { const rte = s.closest(".rte"); rte.querySelector(".rte-content").focus(); document.execCommand("formatBlock", false, s.value); rteSync(rte); });
  on("input", ".rte-content", (e, ed) => rteSync(ed.closest(".rte")));
  function rteSync(rte) {
    $$("[data-cmd]", rte).forEach((b) => { try { if (["bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList"].includes(b.dataset.cmd)) b.setAttribute("aria-pressed", document.queryCommandState(b.dataset.cmd)); } catch (err) {} });
    const wc = rte.querySelector(".rte-count"); if (wc) { const t = rte.querySelector(".rte-content").innerText.trim(); wc.textContent = (t ? t.split(/\s+/).length : 0) + " words"; }
  }
  document.addEventListener("selectionchange", () => {
    const s = getSelection(); if (!s.rangeCount) return; const n = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement); const rte = n && n.closest && n.closest(".rte"); if (!rte) return;
    rteSync(rte);
    const bub = rte.querySelector(".rte-bubble"); if (!bub) return;
    if (s.isCollapsed) return bub.classList.remove("on");
    const r = s.getRangeAt(0).getBoundingClientRect(), box = rte.getBoundingClientRect();
    bub.classList.add("on"); bub.style.left = Math.max(4, r.left - box.left + r.width / 2 - bub.offsetWidth / 2) + "px"; bub.style.top = r.top - box.top - bub.offsetHeight - 8 + "px";
  });

  /* ---------- Segment ---------- */
  function segmentSync(seg, instant) {
    let th = seg.querySelector(".seg-thumb"); if (!th) { th = document.createElement("span"); th.className = "seg-thumb"; seg.prepend(th); }
    const a = seg.querySelector('[aria-checked="true"]'); if (!a) return;
    if (instant) th.style.transition = "none";
    th.style.width = a.offsetWidth + "px"; th.style.transform = `translateX(${a.offsetLeft}px)`; seg.classList.add("ready");
    if (instant) { th.offsetWidth; th.style.transition = ""; }
  }
  on("click", ".segment > button", (e, b) => { const seg = b.parentElement; $$(":scope > button", seg).forEach((x) => { x.setAttribute("aria-checked", x === b); x.tabIndex = x === b ? 0 : -1; }); segmentSync(seg); seg.dispatchEvent(new CustomEvent("facet:change", { bubbles: true, detail: { value: b.dataset.value || b.textContent.trim() } })); });
  on("keydown", ".segment > button", (e, b) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; const bs = $$(":scope > button", b.parentElement); const n = bs[(bs.indexOf(b) + d + bs.length) % bs.length]; n.focus(); n.click(); });
  window.addEventListener("resize", () => $$(".segment.ready").forEach((s) => segmentSync(s, true)), { passive: true });

  /* ---------- Navbar & App layout ---------- */
  on("click", ".navbar-toggle", (e, b) => { const n = b.closest(".navbar"); const open = n.dataset.open !== "true"; n.dataset.open = open; b.setAttribute("aria-expanded", open); b.innerHTML = `<svg class="icon"><use href="#${open ? "x" : "menu"}"/></svg>`; });
  on("click", "[data-app-toggle]", (e, b) => {
    const L = b.closest(".app-layout"); if (!L) return; const t = b.dataset.appToggle;
    if (t === "sidebar") L.dataset.sidebar = L.dataset.sidebar === "collapsed" ? "expanded" : "collapsed";
    if (t === "mobile") L.dataset.mobileNav = L.dataset.mobileNav === "open" ? "closed" : "open";
    if (t === "aside") { const cur = L.dataset.aside === "auto" ? (L.offsetWidth > 1024 ? "open" : "closed") : L.dataset.aside; L.dataset.aside = cur === "open" ? "closed" : "open"; }
  });
  on("click", ".app-scrim", (e, s) => { const L = s.closest(".app-layout"); L.dataset.mobileNav = "closed"; if (L.offsetWidth <= 1024) L.dataset.aside = "closed"; });
  document.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { const L = document.querySelector(".app-layout.full"); if (L) { e.preventDefault(); L.dataset.sidebar = L.dataset.sidebar === "collapsed" ? "expanded" : "collapsed"; } } });

  /* ---------- Context menu ---------- */
  let openCtx = null, press = null;
  const closeCtx = () => { if (openCtx) { openCtx.classList.remove("open"); openCtx = null; } };
  function showCtx(menu, x, y) { closeCtx(); menu.classList.add("open"); const w = menu.offsetWidth, h = menu.offsetHeight; menu.style.left = Math.min(x, innerWidth - w - 8) + "px"; menu.style.top = Math.min(y, innerHeight - h - 8) + "px"; openCtx = menu; const f = menu.querySelector(".menu-item"); if (f) f.focus({ preventScroll: true }); }
  document.addEventListener("contextmenu", (e) => { const a = e.target.closest && e.target.closest("[data-context-menu]"); if (!a) return; const m = document.getElementById(a.dataset.contextMenu); if (!m) return; e.preventDefault(); showCtx(m, e.clientX, e.clientY); });
  on("pointerdown", "[data-context-menu]", (e, a) => { if (e.pointerType !== "touch") return; press = setTimeout(() => { const m = document.getElementById(a.dataset.contextMenu); if (m) showCtx(m, e.clientX, e.clientY); }, 520); });
  document.addEventListener("pointerup", () => clearTimeout(press)); document.addEventListener("pointermove", () => clearTimeout(press), { passive: true });
  document.addEventListener("click", (e) => { if (openCtx && !openCtx.contains(e.target)) closeCtx(); const it = e.target.closest && e.target.closest(".context-menu .menu-item"); if (it) { if (it.hasAttribute("aria-checked")) { it.setAttribute("aria-checked", it.getAttribute("aria-checked") !== "true"); return; } closeCtx(); toast({ title: it.textContent.trim(), timeout: 1400 }); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCtx(); });
  document.addEventListener("scroll", closeCtx, { passive: true, capture: true });

  /* ---------- Emoji picker ---------- */
  const EMOJI = {
    "Smileys": "😀 grin,😃 smile,😄 happy,😁 beam,😆 laugh,😅 sweat,🤣 rofl,😂 joy,🙂 slight,😉 wink,😊 blush,😇 halo,🥰 love,😍 heart eyes,🤩 star,😘 kiss,😋 yum,😎 cool,🤓 nerd,🧐 monocle,🤔 think,🤨 brow,😐 neutral,😴 sleep,🥳 party,😮 wow,😢 cry,😡 angry,🤯 mind blown,🥹 grateful",
    "Gestures": "👍 thumbs up,👎 thumbs down,👏 clap,🙌 raise,🙏 pray,👋 wave,🤝 handshake,✌️ peace,🤞 fingers crossed,👌 ok,💪 strong,🫶 heart hands,👀 eyes,🧠 brain,🫡 salute,🤙 call",
    "Objects": "🔥 fire,✨ sparkles,⭐ star,⚡ zap,💡 idea,🎉 tada,🎯 target,🚀 rocket,📈 chart up,📉 chart down,💰 money,🧾 receipt,📌 pin,📎 clip,🔒 lock,🗂️ folder,🗓️ calendar,⏰ alarm,🛠️ tools,🧪 test",
    "Symbols": "❤️ red heart,🧡 orange heart,💛 yellow heart,💚 green heart,💙 blue heart,💜 purple heart,✅ check,❌ cross,⚠️ warning,❓ question,💯 hundred,➕ plus,🔁 repeat,🆕 new,🔴 red,🟢 green",
  };
  const ICONS = { Smileys: "😀", Gestures: "👍", Objects: "🔥", Symbols: "❤️" };
  function emojiPicker(p) {
    if (p._init) return; p._init = 1;
    p.innerHTML = `<div class="ep-search"><div class="input-group"><svg class="icon"><use href="#search"/></svg><input class="input input-sm" placeholder="Search emoji" aria-label="Search emoji"></div></div>
      <div class="ep-cats" role="tablist">${Object.keys(EMOJI).map((c, k) => `<button role="tab" aria-selected="${!k}" data-cat="${c}" aria-label="${c}">${ICONS[c]}</button>`).join("")}</div>
      <div class="ep-body">${Object.entries(EMOJI).map(([c, list]) => `<div class="ep-label" id="ep-${c}">${c}</div><div class="ep-grid">${list.split(",").map((x) => { const [e, ...n] = x.split(" "); return `<button data-e="${e}" data-n="${n.join(" ")}" aria-label="${n.join(" ")}">${e}</button>`; }).join("")}</div>`).join("")}</div>
      <div class="ep-foot"><span class="big">👋</span><span class="name">Pick an emoji</span><span class="ep-tones">${["#ffcc4d", "#f7dece", "#e0bb95", "#bf8f68", "#9b643d", "#594539"].map((c, k) => `<button style="--sw:${c}" aria-pressed="${!k}" aria-label="Skin tone ${k + 1}"></button>`).join("")}</span></div>`;
    const body = p.querySelector(".ep-body"), foot = p.querySelector(".ep-foot");
    p.addEventListener("click", (e) => {
      const c = e.target.closest("[data-cat]"); if (c) { $$("[data-cat]", p).forEach((x) => x.setAttribute("aria-selected", x === c)); body.scrollTo({ top: p.querySelector("#ep-" + c.dataset.cat).offsetTop - body.offsetTop, behavior: "smooth" }); }
      const em = e.target.closest("[data-e]"); if (em) p.dispatchEvent(new CustomEvent("facet:emoji", { bubbles: true, detail: { emoji: em.dataset.e, name: em.dataset.n } }));
      const t = e.target.closest(".ep-tones button"); if (t) $$(".ep-tones button", p).forEach((x) => x.setAttribute("aria-pressed", x === t));
    });
    p.addEventListener("pointerover", (e) => { const em = e.target.closest("[data-e]"); if (em) { foot.querySelector(".big").textContent = em.dataset.e; foot.querySelector(".name").textContent = ":" + em.dataset.n.replace(/ /g, "_") + ":"; } });
    p.querySelector("input").addEventListener("input", (e) => { const q = e.target.value.toLowerCase(); $$("[data-e]", p).forEach((b) => (b.hidden = q && !b.dataset.n.includes(q))); $$(".ep-label", p).forEach((l) => (l.hidden = !!q)); });
  }
  on("facet:emoji", ".emoji-picker", (e, p) => { const tgt = document.getElementById(p.dataset.target || ""); if (tgt) { if ("value" in tgt) tgt.value += e.detail.emoji; else tgt.textContent = e.detail.emoji; } });

  /* ---------- Number value ---------- */
  function numberValue(n) {
    const v = +n.dataset.value, f = n.dataset.format || "decimal", o = { maximumFractionDigits: +(n.dataset.digits ?? 1) };
    if (f === "currency") Object.assign(o, { style: "currency", currency: n.dataset.currency || "USD", maximumFractionDigits: +(n.dataset.digits ?? 0) });
    if (f === "compact") o.notation = "compact"; if (f === "percent") Object.assign(o, { style: "percent", maximumFractionDigits: +(n.dataset.digits ?? 1) });
    if (n.dataset.sign) o.signDisplay = "exceptZero";
    const txt = new Intl.NumberFormat(n.dataset.locale || "en-US", o).format(f === "percent" ? v / 100 : v);
    n.textContent = txt;
  }

  /* ---------- Prompt input ---------- */
  on("input", ".prompt-input textarea", (e, t) => { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 200) + "px"; const s = t.closest(".prompt-input").querySelector(".send"); if (s) s.disabled = !t.value.trim(); });
  on("keydown", ".prompt-input textarea", (e, t) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); const s = t.closest(".prompt-input").querySelector(".send"); if (s && !s.disabled) s.click(); } });

  /* ---------- init / refresh ---------- */
  function refresh(scope = document) {
    $$(".carousel", scope).forEach(carousel); $$(".floating-toc", scope).forEach(floatingToc); $$(".chat-conversation", scope).forEach(chatConversation);
    $$(".rating", scope).forEach(ratingSync); $$(".segment", scope).forEach((s) => segmentSync(s, true)); $$(".emoji-picker", scope).forEach(emojiPicker);
    $$(".number-value[data-value]", scope).forEach(numberValue); $$(".number-stepper", scope).forEach(stepperSync); $$(".data-grid", scope).forEach(gridRecalc); $$(".rte", scope).forEach(rteSync);
    if (window.Facet && Facet.charts) Facet.charts.refresh(scope);
  }
  const init = () => refresh();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  const prevEnhance = window.Facet && Facet.enhance;
  if (window.Facet) Facet.enhance = (scope = document) => { if (prevEnhance) prevEnhance(scope); refresh(scope); };
  window.Facet = window.Facet || {}; window.Facet.ui = Object.assign(window.Facet.ui || {}, { refresh, segment: segmentSync });
})();
