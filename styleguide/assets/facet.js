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
    const tt = t.closest("[data-toast]"); if (tt) toast(JSON.parse(tt.dataset.toast || "{}"));
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
