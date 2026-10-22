/*! FacetUI Industry Templates · kit.js · © 2026 ETKits. All rights reserved.
   Progressive enhancement shared by all 36 templates. Loads after facet.js; no dependencies.
   - Mobile menu: Escape closes, link click closes, focus returns to the toggle
   - Overlays (dialog/sheet/drawer): focus trap while open
   - Forms [data-kit-form]: validation, error summary, multi-step, simulated submit/success/failure
     (append ?demo=error to the URL to see the failure state), prefill from the query string
   - Date picker [data-kit-calendar]: keyboard calendar + time slots
   - Filters [data-kit-filter]: chips / selects / search / sort over data-* attributes
*/
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const sonner = (o) => (window.Facet && window.Facet.sonner ? window.Facet.sonner(o) : null);
  const icon = (n) => `<svg class="icon icon-sm" aria-hidden="true"><use href="#${n}"/></svg>`;
  const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------ header */
  function setHeaderHeight() {
    const h = $("[data-kit-header]");
    if (h) document.documentElement.style.setProperty("--k-header-h", h.getBoundingClientRect().height + "px");
  }
  function closeMenu(nav, focus) {
    const t = $(".navbar-toggle", nav);
    nav.dataset.open = "false";
    if (t) { t.setAttribute("aria-expanded", "false"); t.setAttribute("aria-label", "Open menu"); t.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#menu"/></svg>'; if (focus) t.focus(); }
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".navbar-toggle");
    if (t) {
      // facet.js toggles state first; we sync the label and move focus into the menu.
      requestAnimationFrame(() => {
        const open = t.getAttribute("aria-expanded") === "true";
        t.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        t.querySelector("svg") && t.querySelector("svg").setAttribute("aria-hidden", "true");
        if (open) { const first = $(".navbar-mobile a", t.closest(".navbar")); if (first) first.focus(); }
      });
    }
    const link = e.target.closest(".navbar-mobile a");
    if (link) closeMenu(link.closest(".navbar"), false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const nav = $('.navbar[data-open="true"]');
    if (nav) closeMenu(nav, true);
  });
  window.addEventListener("resize", () => {
    setHeaderHeight();
    $$('.navbar[data-open="true"]').forEach((n) => { if (n.getBoundingClientRect().width >= 1024) closeMenu(n, false); });
  }, { passive: true });

  /* ------------------------------------------------------------ overlay focus trap */
  const focusables = (root) => $$('a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root).filter((el) => el.offsetParent !== null || el === document.activeElement);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const o = $$(".overlay:not([hidden])").pop();
    if (!o) return;
    const f = focusables(o);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!o.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Lock page scroll while an overlay is open.
  new MutationObserver(() => { document.body.style.overflow = $(".overlay:not([hidden])") ? "hidden" : ""; })
    .observe(document.body, { attributes: true, attributeFilter: ["hidden"], subtree: true });

  /* ------------------------------------------------------------ forms */
  const labelFor = (el) => {
    if (el.dataset.label) return el.dataset.label;
    const group = el.closest("[data-kit-group]");
    if (group && (el.type === "radio" || el.type === "hidden" || group.querySelectorAll("input").length > 1)) {
      const lg = $("legend", group); if (lg) return lg.textContent.replace(/\*|\(required\)/g, "").trim();
    }
    const lab = el.id && $(`label[for="${CSS.escape(el.id)}"]`);
    if (lab) return lab.textContent.replace(/\*|\(required\)|Optional/g, "").trim();
    const wrap = el.closest("label"); return wrap ? wrap.textContent.trim() : el.name;
  };
  function setInvalid(container, help, msg) {
    container.dataset.invalid = msg ? "true" : "false";
    if (!help) return;
    help.innerHTML = msg ? icon("circle-alert") + escHtml(msg) : escHtml(help.dataset.help || "");
  }
  function validateControl(el) {
    const field = el.closest(".field");
    if (!field) return null;
    const help = field.querySelector(".help");
    const v = el.type === "checkbox" ? el.checked : (el.type === "file" ? el.files.length : el.value.trim());
    let msg = "";
    const name = labelFor(el);
    if (el.required && !v) msg = el.dataset.error || (el.type === "checkbox" ? "Tick this box to continue." : el.tagName === "SELECT" ? `Choose ${name.toLowerCase()}.` : `Enter ${name.toLowerCase()}.`);
    else if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) msg = "Enter an email address like name@example.com.";
    else if (v && el.type === "tel" && el.value.replace(/\D/g, "").length < 7) msg = "Enter a phone number with at least 7 digits.";
    else if (v && el.pattern && !new RegExp(`^(?:${el.pattern})$`).test(el.value.trim())) msg = el.dataset.error || `Check the format of ${name.toLowerCase()}.`;
    else if (v && el.type === "number" && ((el.min !== "" && +el.value < +el.min) || (el.max !== "" && +el.value > +el.max))) msg = `Enter a number from ${el.min} to ${el.max}.`;
    else if (v && el.minLength > 0 && el.value.trim().length < el.minLength) msg = `Use at least ${el.minLength} characters.`;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    setInvalid(field, help, msg);
    return msg ? { el, msg, name } : null;
  }
  function validateGroup(g) {
    const inputs = $$("input", g);
    const help = $(".help", g);
    const ok = inputs.some((i) => (i.type === "hidden" ? i.value : i.checked));
    const msg = g.dataset.required === "true" && !ok ? (g.dataset.error || "Choose an option.") : "";
    setInvalid(g, help, msg);
    const target = inputs.find((i) => i.type !== "hidden") || $(".cal-day:not([aria-disabled=true])", g.closest("[data-kit-calendar]") || g);
    return msg ? { el: target, msg, name: ($("legend", g) || {}).textContent || "" } : null;
  }
  function validateScope(scope) {
    const errors = [];
    $$(".field input:not([type=hidden]), .field select, .field textarea", scope).forEach((el) => {
      if (el.closest("[data-kit-group]") && el.closest("[data-kit-group]") !== el.closest(".field")) return;
      if (el.closest("[hidden]") && !scope.matches("[hidden]")) return;
      const r = validateControl(el); if (r) errors.push(r);
    });
    $$("[data-kit-group]", scope).forEach((g) => { if (g.closest("[hidden]")) return; const r = validateGroup(g); if (r) errors.push(r); });
    return errors;
  }
  function showErrors(form, errors) {
    const box = $("[data-kit-errors]", form);
    if (!errors.length) { box.hidden = true; return; }
    $("ul", box).innerHTML = errors.map((e, i) => `<li><a href="#" data-kit-jump="${i}">${escHtml(e.msg)}</a></li>`).join("");
    box.hidden = false;
    box._errors = errors;
    box.focus();
  }
  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-kit-jump]");
    if (!j) return;
    e.preventDefault();
    const err = j.closest("[data-kit-errors]")._errors[+j.dataset.kitJump];
    if (err && err.el) { err.el.focus(); err.el.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" }); }
  });
  // Re-validate a touched control as the user fixes it.
  document.addEventListener("change", (e) => {
    const form = e.target.closest && e.target.closest("[data-kit-form]"); if (!form) return;
    const g = e.target.closest("[data-kit-group]");
    if (g && g.dataset.invalid === "true") validateGroup(g);
    if (e.target.closest(".field") && e.target.getAttribute("aria-invalid") === "true") validateControl(e.target);
  });
  document.addEventListener("input", (e) => {
    if (e.target.getAttribute && e.target.getAttribute("aria-invalid") === "true") validateControl(e.target);
  });
  // File inputs: list chosen files.
  document.addEventListener("change", (e) => {
    if (e.target.type !== "file") return;
    const list = $(`[data-kit-files="${CSS.escape(e.target.id)}"]`);
    if (list) list.innerHTML = Array.from(e.target.files).map((f) => `<li>${icon("file")} ${escHtml(f.name)} · ${Math.max(1, Math.round(f.size / 1024))} KB</li>`).join("");
  });

  function summarize(form) {
    const rows = [];
    const seen = new Set();
    $$("input, select, textarea", form).forEach((el) => {
      if (!el.name || seen.has(el.name) || el.type === "submit" || el.dataset.summary === "false") return;
      let val = "";
      if (el.type === "radio" || el.type === "checkbox") {
        const group = $$(`[name="${CSS.escape(el.name)}"]`, form);
        if (group.length === 1 && el.type === "checkbox") { if (el.closest(".k-fieldset") == null) return; }
        val = group.filter((i) => i.checked).map((i) => (i.closest("label") ? (i.closest("label").querySelector("b") || i.closest("label")).textContent.trim() : i.value)).join(", ");
      } else if (el.type === "file") val = Array.from(el.files).map((f) => f.name).join(", ");
      else if (el.tagName === "SELECT") val = el.value ? el.options[el.selectedIndex].text : "";
      else val = el.dataset.display || el.value.trim();
      seen.add(el.name);
      if (val) rows.push([labelFor(el), val]);
    });
    return rows;
  }
  function stepState(form, i) {
    const steps = $$(".k-step", form);
    steps.forEach((s, n) => (s.hidden = n !== i));
    $$(".stepper .step", form).forEach((s, n) => {
      const st = n < i ? "complete" : n === i ? "current" : "upcoming";
      s.dataset.state = st;
      if (st === "current") s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
      const sub = s.querySelector("span:last-child"); if (sub) sub.textContent = st === "complete" ? "Done" : st === "current" ? "Current step" : "Next";
    });
    form.dataset.step = i;
    $("[data-kit-back]", form).hidden = i === 0;
    $("[data-kit-next]", form).hidden = i === steps.length - 1;
    $("[data-kit-submit]", form).hidden = i !== steps.length - 1;
    const legend = $(".k-step-legend", steps[i]);
    if (legend) { legend.tabIndex = -1; legend.focus(); }
  }
  document.addEventListener("click", (e) => {
    const next = e.target.closest("[data-kit-next]"), back = e.target.closest("[data-kit-back]");
    if (!next && !back) return;
    const form = e.target.closest("[data-kit-form]");
    const i = +(form.dataset.step || 0);
    if (back) { $("[data-kit-errors]", form).hidden = true; return stepState(form, i - 1); }
    const errs = validateScope($$(".k-step", form)[i]);
    showErrors(form, errs);
    if (!errs.length) stepState(form, i + 1);
  });
  let failedOnce = false;
  document.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-kit-form]");
    if (!form) return;
    e.preventDefault();
    const steps = $$(".k-step", form);
    const scope = steps.length ? steps[+(form.dataset.step || 0)] : form;
    const errs = validateScope(scope);
    showErrors(form, errs);
    if (errs.length) return;
    const btn = $("[data-kit-submit]", form);
    const fail = $("[data-kit-fail]", form);
    fail.hidden = true;
    btn.dataset.loading = "true"; btn.setAttribute("aria-disabled", "true");
    const label = btn.innerHTML; btn.innerHTML = '<span class="spinner" role="status" aria-label="Sending"></span> Sending…';
    setTimeout(() => {
      btn.removeAttribute("data-loading"); btn.removeAttribute("aria-disabled"); btn.innerHTML = label;
      if (params.get("demo") === "error" && !failedOnce) { failedOnce = true; fail.hidden = false; fail.focus(); return; }
      const flow = form.closest("[data-kit-flow]");
      const done = $("[data-kit-success]", flow);
      const sum = $("[data-kit-summary]", done);
      sum.innerHTML = summarize(form).map(([k, v]) => `<dt>${escHtml(k)}</dt><dd>${escHtml(v)}</dd>`).join("");
      form.hidden = true; done.hidden = false; done.focus();
      done.scrollIntoView({ block: "start", behavior: reduced() ? "auto" : "smooth" });
      flow.dispatchEvent(new CustomEvent("kit:submitted", { bubbles: true }));
    }, 1100);
  });
  document.addEventListener("click", (e) => {
    const r = e.target.closest("[data-kit-reset]"); if (!r) return;
    const flow = r.closest("[data-kit-flow]"); const form = $("[data-kit-form]", flow);
    form.reset(); $$("[aria-invalid]", form).forEach((x) => x.setAttribute("aria-invalid", "false"));
    $$("[data-invalid]", form).forEach((x) => (x.dataset.invalid = "false"));
    $$("[data-kit-calendar]", form).forEach((c) => c._kit && c._kit.reset());
    $$("[data-kit-files]", form).forEach((l) => (l.innerHTML = ""));
    $("[data-kit-errors]", form).hidden = true;
    $("[data-kit-success]", flow).hidden = true; form.hidden = false;
    if ($$(".k-step", form).length) stepState(form, 0); else { const f = $("input, select, textarea", form); if (f) f.focus(); }
  });
  // Prefill: ?service=pediatrics sets a field/radio named "service" (lets detail pages deep-link into flows).
  function prefill() {
    params.forEach((v, k) => {
      if (k === "demo") return;
      $$(`[data-kit-form] [name="${CSS.escape(k)}"]`).forEach((el) => {
        if (el.type === "radio" || el.type === "checkbox") { if (el.value === v) el.checked = true; }
        else if (el.tagName === "SELECT") { if ($$("option", el).some((o) => o.value === v)) el.value = v; }
        else if (el.type !== "file" && el.type !== "hidden") el.value = v;
      });
    });
  }

  /* ------------------------------------------------------------ date picker */
  const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const fmtLong = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const fmtShort = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const fmtMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

  function calendar(wrap) {
    const root = $("[data-kit-cal-root]", wrap);
    const input = $(`input[type=hidden][name="${CSS.escape(wrap.dataset.kitCalendar)}"]`, wrap);
    const closed = (wrap.dataset.closed || "").split(",").filter(Boolean).map(Number);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const first = addDays(today, +(wrap.dataset.lead || 1));
    const last = addDays(today, +(wrap.dataset.horizon || 45));
    const slots = (wrap.dataset.slots || "").split(",").filter(Boolean);
    const timeName = wrap.dataset.time;
    let view = new Date(first.getFullYear(), first.getMonth(), 1);
    let focusDate = new Date(first);
    let selected = null;
    const isOpen = (d) => d >= first && d <= last && !closed.includes(d.getDay());

    function render(moveFocus) {
      const y = view.getFullYear(), m = view.getMonth();
      const start = new Date(y, m, 1); const offset = (start.getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      const prevOk = new Date(y, m, 0) >= first, nextOk = new Date(y, m + 1, 1) <= last;
      let cells = DOW.map((d) => `<span class="dow" aria-hidden="true">${d}</span>`).join("") + "<span aria-hidden=\"true\"></span>".repeat(offset);
      for (let n = 1; n <= days; n++) {
        const d = new Date(y, m, n); const open = isOpen(d);
        const sel = selected && iso(selected) === iso(d);
        const tab = iso(d) === iso(focusDate) ? 0 : -1;
        cells += `<button type="button" class="cal-day${iso(d) === iso(today) ? " today" : ""}${open ? "" : " muted"}" data-date="${iso(d)}" tabindex="${tab}" aria-label="${fmtLong.format(d)}${open ? "" : ", unavailable"}"${open ? "" : ' aria-disabled="true"'} aria-pressed="${!!sel}"${sel ? ' aria-selected="true"' : ""}>${n}</button>`;
      }
      root.innerHTML = `<div class="cal-head"><button type="button" class="btn btn-ghost btn-sm icon-btn" data-cal="prev" aria-label="Previous month"${prevOk ? "" : " disabled"}>${icon("chevron-left")}</button><span class="k-cal-title" aria-live="polite">${fmtMonth.format(view)}</span><button type="button" class="btn btn-ghost btn-sm icon-btn" data-cal="next" aria-label="Next month"${nextOk ? "" : " disabled"}>${icon("chevron-right")}</button></div><div class="cal-grid" role="group" aria-label="${fmtMonth.format(view)}">${cells}</div>`;
      if (moveFocus) { const b = $(`[data-date="${iso(focusDate)}"]`, root); if (b) b.focus(); }
    }
    function renderSlots() {
      if (!timeName) return;
      const list = $("[data-kit-slots]", wrap), empty = $("[data-kit-slots-empty]", wrap);
      if (!selected) { list.innerHTML = ""; empty.hidden = false; return; }
      empty.hidden = true;
      const h = hash(iso(selected));
      list.innerHTML = slots.map((s, i) => {
        const booked = ((h >> i) & 3) === 0; // deterministic sample availability
        return `<label class="choice"><input type="radio" name="${timeName}" value="${s}"${booked ? " disabled" : ""}><b>${s}${booked ? '<span class="sr-only"> (booked)</span>' : ""}</b></label>`;
      }).join("");
    }
    function choose(d) {
      selected = new Date(d); focusDate = new Date(d);
      input.value = iso(d); input.dataset.display = fmtShort.format(d);
      render(true); renderSlots();
      const g = input.closest("[data-kit-group]"); if (g && g.dataset.invalid === "true") validateGroup(g);
    }
    function move(d) {
      if (d < first) d = new Date(first); if (d > last) d = new Date(last);
      focusDate = d;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(true);
    }
    root.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-cal]");
      if (nav) { view = new Date(view.getFullYear(), view.getMonth() + (nav.dataset.cal === "next" ? 1 : -1), 1); focusDate = isOpen(view) ? new Date(view) : new Date(Math.max(view, first)); render(false); return; }
      const b = e.target.closest(".cal-day"); if (!b) return;
      e.stopPropagation();
      if (b.getAttribute("aria-disabled") === "true") return;
      choose(new Date(b.dataset.date + "T00:00"));
    }, true);
    root.addEventListener("keydown", (e) => {
      const b = e.target.closest(".cal-day"); if (!b) return;
      const d = new Date(b.dataset.date + "T00:00");
      const k = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (k) { e.preventDefault(); move(addDays(d, k)); }
      else if (e.key === "Home") { e.preventDefault(); move(addDays(d, -((d.getDay() + 6) % 7))); }
      else if (e.key === "End") { e.preventDefault(); move(addDays(d, 6 - ((d.getDay() + 6) % 7))); }
      else if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); const x = new Date(d); x.setMonth(x.getMonth() + (e.key === "PageDown" ? 1 : -1)); move(x); }
    });
    wrap._kit = { reset() { selected = null; input.value = ""; focusDate = new Date(first); view = new Date(first.getFullYear(), first.getMonth(), 1); render(false); renderSlots(); } };
    render(false); renderSlots();
  }

  /* ------------------------------------------------------------ filters */
  function filter(box) {
    const items = $$("[data-kit-items] > *", box);
    const count = $("[data-kit-count]", box);
    const empty = $("[data-kit-empty]", box);
    const holder = $("[data-kit-items]", box);
    const label = box.dataset.countLabel || "results";
    let timer;
    function apply(animate) {
      const active = {};
      $$("[data-filter]", box).forEach((c) => {
        const key = c.dataset.filter;
        if (c.classList.contains("chip")) { if (c.getAttribute("aria-pressed") === "true" && c.dataset.value) (active[key] = active[key] || []).push(c.dataset.value); }
        else if (c.value) active[key] = key === "q" ? c.value.trim().toLowerCase() : [c.value];
      });
      let n = 0;
      items.forEach((it) => {
        let ok = true;
        for (const [k, vals] of Object.entries(active)) {
          if (k === "q") { ok = ok && (it.dataset.search || it.textContent).toLowerCase().includes(vals); continue; }
          const have = (it.dataset[k] || "").split(" ");
          ok = ok && vals.some((v) => have.includes(v));
        }
        it.hidden = !ok; if (ok) n++;
      });
      const sort = $("[data-sort]", box);
      if (sort && sort.value) {
        const [key, dir] = sort.value.split(":");
        items.slice().sort((a, b) => ((parseFloat(a.dataset[key]) || 0) - (parseFloat(b.dataset[key]) || 0)) * (dir === "desc" ? -1 : 1)).forEach((it) => holder.appendChild(it));
      }
      const show = () => {
        holder.classList.remove("is-loading"); holder.removeAttribute("aria-busy");
        count.textContent = `${n} ${n === 1 ? label.replace(/s$/, "") : label}`;
        empty.hidden = n !== 0; holder.hidden = n === 0;
      };
      if (animate) { holder.classList.add("is-loading"); holder.setAttribute("aria-busy", "true"); clearTimeout(timer); timer = setTimeout(show, 220); } else show();
    }
    box.addEventListener("click", (e) => {
      const c = e.target.closest(".chip[data-filter]");
      if (c) {
        // Chips within one key act as a single-select group; the "All" chip has an empty value.
        $$(`.chip[data-filter="${CSS.escape(c.dataset.filter)}"]`, box).forEach((x) => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
        apply(true);
      }
      if (e.target.closest("[data-kit-clear]")) {
        $$(".chip[data-filter]", box).forEach((x) => x.setAttribute("aria-pressed", x.dataset.value ? "false" : "true"));
        $$("select[data-filter], input[data-filter]", box).forEach((x) => (x.value = ""));
        apply(true);
        const firstCtl = $("[data-filter]", box); if (firstCtl) firstCtl.focus();
      }
    });
    box.addEventListener("input", (e) => { if (e.target.matches("input[data-filter]")) apply(false); });
    box.addEventListener("change", (e) => { if (e.target.matches("select[data-filter], [data-sort]")) apply(true); });
    // Facet's [data-toggle] would flip chips independently; chips here are managed by the kit.
    $$(".chip[data-filter]", box).forEach((c) => c.removeAttribute("data-toggle"));
    // Initial state from query string (?type=x).
    params.forEach((v, k) => { const c = $(`.chip[data-filter="${CSS.escape(k)}"][data-value="${CSS.escape(v)}"]`, box); if (c) $$(`.chip[data-filter="${CSS.escape(k)}"]`, box).forEach((x) => x.setAttribute("aria-pressed", x === c ? "true" : "false")); const s = $(`select[data-filter="${CSS.escape(k)}"]`, box); if (s) s.value = v; });
    apply(false);
  }

  /* ------------------------------------------------------------ scroll regions
     Horizontally scrolling containers must be reachable by keyboard (WCAG 2.1.1). */
  function scrollRegions() {
    $$(".table-wrap, .k-hscroll, [data-kit-scroll]").forEach((el) => {
      const scrolls = el.scrollWidth > el.clientWidth + 1;
      if (scrolls) {
        el.tabIndex = 0;
        if (!el.getAttribute("role")) el.setAttribute("role", "region");
        if (!el.getAttribute("aria-label")) {
          const cap = el.querySelector("caption, [aria-label]");
          el.setAttribute("aria-label", (el.dataset.label || (cap && (cap.textContent.trim() || cap.getAttribute("aria-label"))) || "Scrollable content") + " (scrolls sideways)");
        }
      } else if (el.tabIndex === 0) { el.removeAttribute("tabindex"); }
    });
  }
  window.addEventListener("resize", () => { clearTimeout(scrollRegions._t); scrollRegions._t = setTimeout(scrollRegions, 150); }, { passive: true });

  /* ------------------------------------------------------------ init */
  function init() {
    setHeaderHeight();
    $$(".navbar-toggle").forEach((t) => t.setAttribute("aria-label", "Open menu"));
    prefill();
    $$("[data-kit-calendar]").forEach(calendar);
    $$("[data-kit-filter]").forEach(filter);
    scrollRegions();
    $$("[data-kit-form][data-kit-steps]").forEach((f) => stepState(f, 0));
    // stepState focuses the legend; don't steal focus on load.
    if (document.activeElement && document.activeElement.classList.contains("k-step-legend")) document.activeElement.blur();
    document.dispatchEvent(new CustomEvent("kit:ready"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
