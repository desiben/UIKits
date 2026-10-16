
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
