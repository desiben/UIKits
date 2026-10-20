/* =========================================================================
   FacetUI-Templates — page runtime
   Builds the gallery and block sections from window.TPL, wires the theme bar
   (brand presets, any custom color, light/dark, style, motion) and every
   block interaction: reveal-on-scroll, rotating words, feature tabs, billing
   toggle, sliders, mega menu, countdown, sticky header, forms, wizard,
   catalog filters, product gallery zoom, cart drawer, checkout, data table,
   skeleton reload, cookie banners and the video player.
   ========================================================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (t, s, fn) => document.addEventListener(t, (e) => { const el = e.target.closest && e.target.closest(s); if (el) fn(e, el); });
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const T = window.Facet && Facet.theme;
  const root = document.documentElement;
  const toast = (title, o = {}) => (Facet.sonner ? Facet.sonner({ title, ...o }) : Facet.toast && Facet.toast({ title }));
  const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const blocks = window.TPL || [];
  const CATS = ["All", ...new Set(blocks.map((b) => b.cat))];

  /* ---------- build: gallery + sections ---------- */
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const thumbHTML = (html) => html.replace(/<a\b/g, "<span").replace(/<\/a>/g, "</span>").replace(/<(button|form|input|select|textarea)\b/g, (m, t) => "<" + t + " tabindex=\"-1\"").replace(/\sid="[^"]*"/g, "").replace(/\sdata-(feed|wizard|catalog|pdp|cart|table|skel|cookie|video|slider|tabshow|pricing|mega|faq|sticky-demo)\b/g, "");
  const nVariants = blocks.reduce((a, b) => a + b.variants.length, 0);
  $("#tp-count").textContent = blocks.length; $("#tp-vcount").textContent = nVariants;

  $("#tp-cats").innerHTML = CATS.map((c, k) => `<button class="chip" aria-pressed="${!k}" data-filter="${c}">${c}</button>`).join("");
  $("#tp-gallery").innerHTML = blocks.map((b) => `<a class="tp-card" href="#${b.slug}" data-cat="${b.cat}" data-name="${b.name.toLowerCase()} ${b.desc.toLowerCase()}"><div class="tp-thumb"><div class="tp-thumb-inner" inert aria-hidden="true">${thumbHTML(b.variants[0].html)}</div></div><b><span class="num">${String(b.n).padStart(2, "0")}</span>${b.name}</b><small>${b.variants.length} variant${b.variants.length > 1 ? "s" : ""} · ${b.cat}</small></a>`).join("");
  $("#tp-blocks").innerHTML = blocks.map((b) => `<section class="tp-block" id="${b.slug}" data-cat="${b.cat}"><div class="tp-block-head"><div class="grow"><span class="num">${String(b.n).padStart(2, "0")} · ${b.cat}</span><h2>${b.name}</h2><p>${b.desc}</p></div><a class="btn btn-ghost btn-sm" href="#top">${i("arrow-up", "icon-sm")} All blocks</a></div>
    ${b.variants.map((v, k) => `<div class="tp-variant" data-view="preview"><div class="tp-vbar"><b>${v.name}</b><span class="badge badge-outline">${k + 1}/${b.variants.length}</span><span class="grow"></span>
      <span class="seg" role="group" aria-label="Device"><button aria-pressed="true" data-device="desktop" aria-label="Desktop">${i("monitor", "icon-sm")}</button><button aria-pressed="false" data-device="mobile" aria-label="Mobile">${i("smartphone", "icon-sm")}</button></span>
      <span class="seg" role="group" aria-label="View"><button aria-pressed="true" data-view="preview">Preview</button><button aria-pressed="false" data-view="code">HTML</button></span>
      <button class="btn btn-ghost btn-sm" data-copy>${i("copy", "icon-sm")} Copy</button><button class="btn btn-ghost btn-sm icon-btn" data-replay aria-label="Replay animations">${i("rotate-ccw", "icon-sm")}</button></div>
      <div class="tp-frame" data-device="desktop"><div class="tp-canvas">${v.html}</div></div><pre class="tp-code"><code>${esc(v.html.trim())}</code></pre></div>`).join("")}</section>`).join("");

  // Thumbnails: scale the 1200px-wide first variant into each card.
  function fitThumbs() { $$(".tp-thumb").forEach((t) => { const s = (t.clientWidth - 36) / 1200, inner = t.firstElementChild, h = inner.offsetHeight * s; t.style.setProperty("--s", s); inner.style.top = Math.max(18, (t.clientHeight - h) / 2) + "px"; }); }
  fitThumbs(); addEventListener("resize", fitThumbs);

  /* ---------- gallery filter + search ---------- */
  let cat = "All";
  function filter() {
    const q = $("#tp-search").value.trim().toLowerCase(); let n = 0;
    $$(".tp-card").forEach((c) => { const show = (cat === "All" || c.dataset.cat === cat) && (!q || c.dataset.name.includes(q)); c.hidden = !show; if (show) n++; });
    $$(".tp-block").forEach((s) => (s.hidden = !(cat === "All" || s.dataset.cat === cat)));
    $("#tp-results").textContent = `${n} block${n === 1 ? "" : "s"}`;
  }
  on("click", "[data-filter]", (e, b) => { cat = b.dataset.filter; $$("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", x === b)); filter(); });
  $("#tp-search").addEventListener("input", filter);

  /* ---------- theme bar ---------- */
  const brandBtns = $$("[data-brand-set]");
  function syncBar() {
    const custom = root.dataset.brand === "custom";
    brandBtns.forEach((b) => b.setAttribute("aria-pressed", !custom && (root.dataset.brand || "iris") === b.dataset.brandSet));
    $("#tp-picker").setAttribute("aria-pressed", !!custom);
    $$("[data-mode-set]").forEach((b) => b.setAttribute("aria-checked", (root.dataset.theme || "light") === b.dataset.modeSet));
    $$("[data-style-set]").forEach((b) => b.setAttribute("aria-checked", (root.dataset.style || "default") === b.dataset.styleSet));
    $("#tp-hex").textContent = custom ? root.dataset.custom || $("#tp-color").value : T.presets[root.dataset.brand || "iris"];
    $("#tp-motion").setAttribute("aria-pressed", root.dataset.motion !== "off");
  }
  on("click", "[data-brand-set]", (e, b) => { T.setBrand(b.dataset.brandSet); syncBar(); });
  $("#tp-color").addEventListener("input", (e) => { T.setCustomBrand(e.target.value); syncBar(); });
  on("click", "[data-mode-set]", (e, b) => { T.setMode(b.dataset.modeSet); syncBar(); });
  on("click", "[data-style-set]", (e, b) => { T.setStyle(b.dataset.styleSet); syncBar(); });
  $("#tp-motion").addEventListener("click", () => { const off = root.dataset.motion !== "off"; if (Facet.motion) Facet.motion.set(off ? "off" : "on"); else root.dataset.motion = off ? "off" : "on"; syncBar(); });
  $("#tp-replay").addEventListener("click", () => replay(document));
  document.addEventListener("facet:theme", () => { syncBar(); if (Facet.charts) Facet.charts.refresh(document); });
  // Default look for this page: Cobalt, unless the visitor already picked something.
  try { if (!localStorage.getItem("facet-theme")) T.setBrand("cobalt"); } catch (e) { T.setBrand("cobalt"); }
  syncBar();

  /* ---------- variant toolbar ---------- */
  on("click", ".tp-vbar [data-device]", (e, b) => { const v = b.closest(".tp-variant"); $$("[data-device]", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === b)); $(".tp-frame", v).dataset.device = b.dataset.device; setTimeout(() => Facet.charts && Facet.charts.refresh(v), 600); });
  on("click", ".tp-vbar [data-view]", (e, b) => { const v = b.closest(".tp-variant"); $$("[data-view]", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === b)); v.dataset.view = b.dataset.view; });
  on("click", "[data-copy]", (e, b) => { const code = $(".tp-code", b.closest(".tp-variant")).textContent; (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => toast("HTML copied", { type: "success", duration: 1800 })).catch(() => {}); });
  on("click", "[data-replay]", (e, b) => replay(b.closest(".tp-variant")));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); onReveal(x.target); } }), { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
  function watch(scope) { $$("[data-anim]", scope).forEach((el) => { if (!el.closest(".tp-thumb")) io.observe(el); }); $$("[data-cookie]", scope).forEach((el) => io.observe(el)); }
  function onReveal(el) { if (el.matches("[data-cookie]")) setTimeout(() => $$(".tp-cookie", el).forEach((c) => c.classList.add("show")), 500); }
  function replay(scope) {
    $$("[data-anim]", scope).forEach((el) => { if (el.closest(".tp-thumb")) return; el.classList.remove("is-in"); void el.offsetWidth; });
    $$("[data-countup]", scope).forEach((el) => { delete el.dataset.mCounted; });
    $$("[data-cookie]", scope).forEach((el) => { $$(".tp-cookie", el).forEach((c) => c.classList.remove("show")); $$(".tp-prefs", el).forEach((p) => p.classList.remove("open")); });
    requestAnimationFrame(() => { watch(scope); if (Facet.motion) Facet.motion.refresh(scope); });
  }
  watch(document);

  /* ---------- hero: rotating words ---------- */
  setInterval(() => { if (root.dataset.motion === "off") return; $$(".tp-word").forEach((w) => { const s = $$("span", w), k = s.findIndex((x) => x.classList.contains("on")); s[k].classList.remove("on"); s[(k + 1) % s.length].classList.add("on"); }); }, 2600);

  /* ---------- forms with a success message (hero capture, newsletter, footer) ---------- */
  on("submit", "form[data-success]", (e, f) => { e.preventDefault(); const inp = $("input[type=email]", f); if (inp && !inp.checkValidity()) { inp.setAttribute("aria-invalid", "true"); inp.focus(); toast("Please enter a valid email", { type: "error", duration: 2200 }); return; } inp && inp.removeAttribute("aria-invalid"); toast(f.dataset.success, { type: "success" }); f.reset(); f.classList.remove("tp-ok-pop"); void f.offsetWidth; f.classList.add("tp-ok-pop"); });

  /* ---------- feature tabs: click or auto-advance every 5s ---------- */
  function tabTo(show, k) { const btns = $$(".tp-tabbtn", show), imgs = $$(".tp-tabstage .tp-img", show); btns.forEach((b, j) => b.setAttribute("aria-selected", j === k)); imgs.forEach((im, j) => im.classList.toggle("on", j === k)); }
  on("click", ".tp-tabbtn", (e, b) => { const show = b.closest("[data-tabshow]"); if (show) tabTo(show, $$(".tp-tabbtn", show).indexOf(b)); });
  setInterval(() => { if (root.dataset.motion === "off") return; $$("[data-tabshow]").forEach((show) => { const btns = $$(".tp-tabbtn", show); const k = btns.findIndex((b) => b.getAttribute("aria-selected") === "true"); tabTo(show, (k + 1) % btns.length); }); }, 5000);

  /* ---------- pricing: monthly / yearly ---------- */
  on("click", "[data-billing] [data-cycle]", (e, b) => {
    const sec = b.closest("[data-pricing]"); const y = b.dataset.cycle === "y";
    $$("[data-cycle]", sec).forEach((x) => x.setAttribute("aria-checked", x === b));
    $(".tp-save", sec).hidden = !y;
    $$(".amt", sec).forEach((a, k) => { a.classList.add("flip"); setTimeout(() => { a.textContent = y ? a.dataset.y : a.dataset.m; a.classList.remove("flip"); }, 160 + k * 60); });
  });

  /* ---------- testimonial slider ---------- */
  function slide(sl, d) { const s = $$(".tp-slide", sl), p = $$(".photos .tp-img", sl), dots = $$(".dots i", sl); const k = s.findIndex((x) => x.classList.contains("on")); const n = (k + d + s.length) % s.length; [s, p, dots].forEach((arr) => arr.forEach((x, j) => x.classList.toggle("on", j === n))); }
  on("click", "[data-slider] [data-next]", (e, b) => slide(b.closest("[data-slider]"), 1));
  on("click", "[data-slider] [data-prev]", (e, b) => slide(b.closest("[data-slider]"), -1));
  setInterval(() => { if (root.dataset.motion !== "off") $$(".tp-canvas [data-slider]").forEach((sl) => { if (!sl.matches(":hover")) slide(sl, 1); }); }, 6500);

  /* ---------- mega menu ---------- */
  function mega(stage, btn) { const m = $(".tp-mega", stage); const open = btn.getAttribute("aria-expanded") !== "true"; $$("[data-mega-trigger]", stage).forEach((x) => x.setAttribute("aria-expanded", x === btn && open)); m.classList.toggle("open", open); if (open) { m.classList.remove("open"); void m.offsetWidth; m.classList.add("open"); } }
  on("click", "[data-mega-trigger]", (e, b) => mega(b.closest("[data-mega]"), b));
  on("mouseover", "[data-mega-trigger]", (e, b) => { if (b.getAttribute("aria-expanded") !== "true" && matchMedia("(hover: hover)").matches) mega(b.closest("[data-mega]"), b); });

  /* ---------- announcement banners ---------- */
  on("click", ".tp-announce .x", (e, b) => { const a = b.closest(".tp-announce"); a.classList.add("gone"); setTimeout(() => a.classList.remove("gone"), 4000); });
  setInterval(() => $$("[data-countdown]").forEach((c) => { let s = +c.dataset.countdown - 1; if (s < 0) s = 7200; c.dataset.countdown = s; const p = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, "0")); $$("span", c).forEach((x, k) => (x.textContent = p[k])); }), 1000);

  /* ---------- sticky header demo ---------- */
  document.addEventListener("scroll", (e) => { const sc = e.target; if (!sc.matches || !sc.matches("[data-sticky-demo]")) return; const y = sc.scrollTop, max = sc.scrollHeight - sc.clientHeight; $(".tp-sticky", sc).classList.toggle("stuck", y > 24); $(".tp-progress", sc).style.setProperty("--p", max ? y / max : 0); $(".tp-fab", sc).classList.toggle("show", y > 160); }, true);

  /* ---------- roadmap votes ---------- */
  on("click", "[data-vote]", (e, b) => { const n = $("span", b); const voted = b.classList.toggle("btn-outline"); n.textContent = +n.textContent + (voted ? 1 : -1); n.parentElement.classList.remove("tp-bump"); void n.offsetWidth; n.parentElement.classList.add("tp-bump"); });

  /* ---------- FAQ search + topics ---------- */
  on("input", "[data-faq-search]", (e, inp) => { const sec = inp.closest("[data-faq]"), q = inp.value.trim().toLowerCase(); let n = 0; $$("details", sec).forEach((d) => { const hit = !q || d.textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) n++; if (q && hit) d.open = true; }); $("[data-faq-empty]", sec).hidden = !!n; });
  on("click", "[data-faq] .chip", (e, c) => { $$(".chip", c.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === c)); });

  /* ---------- contact form validation ---------- */
  on("submit", "form[data-validate]", (e, f) => {
    e.preventDefault(); let ok = true;
    $$("[required]", f).forEach((inp) => { const v = inp.checkValidity(); inp.setAttribute("aria-invalid", !v); const h = inp.parentElement.querySelector(".help"); if (h) h.hidden = v; inp.closest(".field").dataset.invalid = !v; if (!v && ok) { inp.focus(); ok = false; } });
    if (!ok) { f.animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }], { duration: 300 }); return; }
    const btn = $("button[type=submit]", f); btn.dataset.loading = "true"; btn.innerHTML = `<span class="spinner" style="width:16px;height:16px"></span> Sending…`;
    setTimeout(() => { f.classList.add("done"); toast("Message sent", { type: "success" }); setTimeout(() => { f.classList.remove("done"); f.reset(); btn.removeAttribute("data-loading"); btn.innerHTML = `Send message ${i("send")}`; }, 4500); }, 1100);
  });
  on("input", "form[data-validate] [required]", (e, inp) => { if (inp.getAttribute("aria-invalid") === "true" && inp.checkValidity()) { inp.setAttribute("aria-invalid", "false"); const h = inp.parentElement.querySelector(".help"); if (h) h.hidden = true; inp.closest(".field").dataset.invalid = "false"; } });

  /* ---------- activity feed: simulate ---------- */
  const SIM = [["p5", "David Chen", "deployed <b>Embeds v2</b> to production"], ["p7", "Sara Kim", "closed <b>Globex renewal</b> · $86,400"], ["p8", "Tom Becker", "shared <b>Pricing test results</b>"]];
  let simK = 0;
  on("click", "[data-feed-sim]", (e, b) => { const feed = $(".tp-feed", b.closest("[data-feed]")); const [p, n, a] = SIM[simK++ % SIM.length]; const src = window.TP_HELPERS.av(p, 40); const d = document.createElement("div"); d.className = "tp-feed-item tp-feed-new"; d.innerHTML = `${src}<div><div class="head"><b>${n}</b> ${a}<time>just now</time></div></div>`; feed.prepend(d); });
  on("click", ".reaction", (e, r) => { /* handled by facet.js; add a hop */ r.classList.remove("tp-bump"); void r.offsetWidth; r.classList.add("tp-bump"); });

  /* ---------- wizard ---------- */
  function wz(w, k) {
    const panes = $$(".pane", w), steps = $$(".step", w); const last = panes.length - 1; w._k = Math.max(0, Math.min(last, k));
    $(".track", w).style.transform = `translateX(${-100 * w._k}%)`;
    steps.forEach((s, j) => { s.dataset.state = j < w._k ? "complete" : j === w._k ? "current" : "upcoming"; });
    $("[data-wz-back]", w).disabled = w._k === 0 || w._k === last; $("[data-wz-next]", w).hidden = w._k === last;
    $("[data-wz-count]", w).textContent = w._k === last ? "Done" : `Step ${w._k + 1} of ${last}`;
    if (w._k === last && root.dataset.motion !== "off") { const c = $(".tp-confetti", w); c.innerHTML = Array.from({ length: 40 }, () => `<i style="left:${Math.random() * 100}%;background:hsl(${Math.random() * 360} 85% 60%);animation-delay:${Math.random() * 0.4}s;transform:rotate(${Math.random() * 180}deg)"></i>`).join(""); setTimeout(() => (c.innerHTML = ""), 2400); }
  }
  on("click", "[data-wz-next]", (e, b) => { const w = b.closest("[data-wizard]"); wz(w, (w._k || 0) + 1); });
  on("click", "[data-wz-back]", (e, b) => { const w = b.closest("[data-wizard]"); wz(w, (w._k || 0) - 1); });
  on("click", "[data-wz-restart]", (e, b) => wz(b.closest("[data-wizard]"), 0));

  /* ---------- catalog: filter, search, sort, view ---------- */
  function catalog(sec) {
    const grid = $(".tp-products", sec), cat = ($("[data-cat][aria-pressed=true]", sec) || {}).dataset?.cat || "All", q = $("[data-cat-search]", sec).value.trim().toLowerCase(), sort = $("[data-cat-sort]", sec).value;
    const items = $$(".tp-prod", grid); let n = 0;
    items.forEach((p) => { const show = (cat === "All" || p.dataset.cat === cat) && (!q || p.dataset.name.toLowerCase().includes(q)); const was = !p.hidden; p.hidden = !show; if (show) { n++; if (!was) { p.classList.remove("enter"); void p.offsetWidth; p.classList.add("enter"); } } });
    const key = { low: (a, b) => a.dataset.price - b.dataset.price, high: (a, b) => b.dataset.price - a.dataset.price, rate: (a, b) => b.dataset.rating - a.dataset.rating }[sort];
    if (key) items.sort(key).forEach((p) => grid.appendChild(p));
    $("[data-cat-count]", sec).textContent = `${n} product${n === 1 ? "" : "s"}`;
  }
  on("click", "[data-catalog] .tp-tags .chip", (e, c) => { $$(".chip", c.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === c)); catalog(c.closest("[data-catalog]")); });
  on("input", "[data-cat-search]", (e, inp) => catalog(inp.closest("[data-catalog]")));
  on("change", "[data-cat-sort]", (e, s) => { const sec = s.closest("[data-catalog]"); $$(".tp-prod", sec).forEach((p) => { p.classList.remove("enter"); void p.offsetWidth; p.classList.add("enter"); }); catalog(sec); });
  on("click", "[data-cat-view] [data-v]", (e, b) => { const sec = b.closest("[data-catalog]"); $(".tp-products", sec).classList.toggle("list", b.dataset.v === "list"); });

  /* ---------- product cards: wishlist + quick add ---------- */
  on("click", ".tp-prod .fav", (e, b) => { const p = b.getAttribute("aria-pressed") === "true"; b.setAttribute("aria-pressed", !p); b.animate([{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 400, easing: "cubic-bezier(.34,1.4,.64,1)" }); if (!p) toast("Saved to wishlist", { type: "success", duration: 1600 }); });
  on("click", "[data-add]", (e, b) => {
    e.preventDefault(); toast(`${b.dataset.add} added to bag`, { type: "success", action: { label: "View bag", onClick: () => {} } });
    $$("[data-cart-count]").forEach((c) => { c.textContent = +c.textContent + 1; c.classList.remove("tp-bump"); void c.offsetWidth; c.classList.add("tp-bump"); });
    b.animate([{ transform: "scale(1)" }, { transform: "scale(.94)" }, { transform: "scale(1)" }], { duration: 250 });
  });

  /* ---------- product detail: thumbnails, zoom, swatches, sizes ---------- */
  on("click", "[data-pdp] .thumbs button", (e, b) => { const pdp = b.closest("[data-pdp]"), main = $(".tp-zoom img", pdp); $$(".thumbs button", pdp).forEach((x) => x.setAttribute("aria-pressed", x === b)); if (!main) return; main.classList.add("swap"); setTimeout(() => { main.src = b.dataset.full; main.onload = () => main.classList.remove("swap"); setTimeout(() => main.classList.remove("swap"), 400); }, 200); });
  on("mousemove", "[data-zoom]", (e, z) => { const r = z.getBoundingClientRect(); z.style.setProperty("--zx", ((e.clientX - r.left) / r.width) * 100 + "%"); z.style.setProperty("--zy", ((e.clientY - r.top) / r.height) * 100 + "%"); });
  on("click", ".tp-swatches button", (e, b) => { $$("button", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === b)); const n = $("[data-color-name]", b.closest("[data-pdp]")); if (n) n.textContent = b.dataset.name; });
  on("click", ".tp-sizes button", (e, b) => { $$("button", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", x === b)); });

  /* ---------- cart drawer ---------- */
  function cartTotals(cart) {
    let sub = 0, qty = 0; $$(".tp-line", cart).forEach((l) => { const q = +$("input", l).value || 0; sub += q * +l.dataset.price; qty += q; });
    const free = 500, ship = sub >= free || !sub ? 0 : 9;
    $("[data-sub]", cart).textContent = money(sub); $("[data-shipcost]", cart).textContent = ship ? money(ship) : "Free"; $("[data-total]", cart).textContent = money(sub + ship);
    $("[data-ship]", cart).innerHTML = sub >= free ? `${i("circle-check", "icon-sm")} You've unlocked <b>free shipping</b><div class="progress"><div style="width:100%"></div></div>` : `You're <b>${money(free - sub).replace(".00", "")}</b> away from free shipping<div class="progress"><div style="width:${Math.min(100, (sub / free) * 100)}%"></div></div>`;
    const b = $("[data-cart-qty]", cart); b.textContent = qty; b.classList.remove("tp-bump"); void b.offsetWidth; b.classList.add("tp-bump");
  }
  on("click", "[data-cart-open]", (e, b) => b.closest("[data-cart]").classList.add("open"));
  on("click", "[data-cart-close]", (e, b) => b.closest("[data-cart]").classList.remove("open"));
  on("click", "[data-cart] [data-remove]", (e, b) => { const l = b.closest(".tp-line"), cart = b.closest("[data-cart]"); l.classList.add("out"); setTimeout(() => { $("input", l).value = 0; l.remove(); cartTotals(cart); }, 350); });
  on("click", "[data-cart] .number-stepper button", (e, b) => { const cart = b.closest("[data-cart]"); setTimeout(() => { const l = b.closest(".tp-line"); if (l && +$("input", l).value === 0) { l.classList.add("out"); setTimeout(() => { l.remove(); cartTotals(cart); }, 350); } else cartTotals(cart); }, 0); });

  /* ---------- checkout ---------- */
  on("submit", "[data-coupon]", (e, f) => { e.preventDefault(); const sum = f.closest(".tp-summary"); const ok = /^facet20$/i.test($("input", f).value.trim()); f.classList.toggle("ok", ok); $("[data-coupon-msg]", sum).hidden = !ok; $("[data-discount]", sum).hidden = !ok; $("[data-co-total]", sum).textContent = ok ? "$286.40" : "$358.00"; if (!ok) toast("That code isn't valid", { type: "error", duration: 2000 }); });
  on("click", "[data-pay]", (e, b) => { if (b.dataset.loading) return; const html = b.innerHTML; b.dataset.loading = "true"; b.innerHTML = `<span class="spinner" style="width:16px;height:16px"></span> Processing…`; setTimeout(() => { b.innerHTML = `${i("circle-check", "icon-sm")} Paid — order #48213`; b.style.background = "var(--bg-success, #16a34a)"; toast("Payment successful", { type: "success", description: "Order #48213 confirmed" }); setTimeout(() => { b.innerHTML = html; b.style.background = ""; delete b.dataset.loading; }, 3500); }, 1600); });

  /* ---------- data table ---------- */
  function dtSync(t) { const boxes = $$("tbody input[type=checkbox]", t), n = boxes.filter((x) => x.checked).length; $("[data-dt-bulk]", t).classList.toggle("on", n > 0); $("[data-dt-selcount]", t).textContent = `${n} selected`; const all = $("[data-dt-all]", t); all.checked = n === boxes.length; all.indeterminate = n > 0 && n < boxes.length; boxes.forEach((b) => b.closest("tr").setAttribute("aria-selected", b.checked)); }
  on("change", "[data-table] tbody input[type=checkbox]", (e, c) => dtSync(c.closest("[data-table]")));
  on("change", "[data-dt-all]", (e, c) => { const t = c.closest("[data-table]"); $$("tbody input[type=checkbox]", t).forEach((x) => (x.checked = c.checked)); dtSync(t); });
  on("click", "[data-table] th[data-sort] button", (e, b) => {
    const th = b.closest("th"), t = th.closest("[data-table]"), key = th.dataset.sort, dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
    $$("th[data-sort]", t).forEach((x) => x.removeAttribute("aria-sort")); th.setAttribute("aria-sort", dir);
    const body = $("tbody", t), rows = $$("tr", body); const get = (r) => (key === "name" ? r.dataset.name : +r.dataset[key]);
    rows.sort((a, c) => (get(a) > get(c) ? 1 : get(a) < get(c) ? -1 : 0) * (dir === "ascending" ? 1 : -1)).forEach((r) => { body.appendChild(r); r.classList.remove("flash"); void r.offsetWidth; r.classList.add("flash"); });
  });
  on("input", "[data-dt-search]", (e, inp) => { const t = inp.closest("[data-table]"), q = inp.value.trim().toLowerCase(); let n = 0; $$("tbody tr", t).forEach((r) => { const hit = !q || r.textContent.toLowerCase().includes(q); r.hidden = !hit; if (hit) n++; }); $("[data-dt-range]", t).textContent = q ? `${n} match${n === 1 ? "" : "es"}` : "Showing 1–8 of 128"; });
  on("click", "[data-table] .page-btn", (e, b) => { if (b.getAttribute("aria-hidden") || !/^\d+$/.test(b.textContent.trim())) return; $$(".page-btn", b.parentElement).forEach((x) => x.removeAttribute("aria-current")); b.setAttribute("aria-current", "page"); const t = b.closest("[data-table]"); $$("tbody tr", t).forEach((r) => { r.classList.remove("flash"); void r.offsetWidth; r.classList.add("flash"); }); });

  /* ---------- skeleton reload ---------- */
  function skel(s) { s.classList.remove("tp-loaded"); clearTimeout(s._t); s._t = setTimeout(() => s.classList.add("tp-loaded"), 2200); }
  on("click", "[data-skel-reload]", (e, b) => skel(b.closest("[data-skel]")));
  $$(".tp-canvas [data-skel]").forEach(skel);

  /* ---------- cookie consent ---------- */
  on("click", "[data-cookie-ok]", (e, b) => { const st = b.closest("[data-cookie]"); $$(".tp-cookie", st).forEach((c) => c.classList.remove("show")); $$(".tp-prefs", st).forEach((p) => p.classList.remove("open")); toast("Preferences saved", { type: "success", duration: 1800 }); });
  on("click", "[data-prefs-open]", (e, b) => $(".tp-prefs", b.closest("[data-cookie]")).classList.add("open"));
  on("click", "[data-prefs-close]", (e, b) => b.closest(".tp-prefs").classList.remove("open"));
  on("click", "[data-cookie-replay]", (e, b) => { const st = b.closest("[data-cookie]"); $$(".tp-cookie", st).forEach((c) => c.classList.remove("show")); setTimeout(() => $$(".tp-cookie", st).forEach((c) => c.classList.add("show")), 450); });

  /* ---------- video ---------- */
  on("click", "[data-video] .play", (e, b) => { const v = b.closest("[data-video]"), vid = $("video", v); v.classList.add("playing"); vid.play && vid.play().catch(() => {}); });

  /* ---------- charts & Facet behaviours inside the frames ---------- */
  if (window.Facet && Facet.enhance) Facet.enhance(document);
  if (window.Facet && Facet.charts) Facet.charts.refresh(document);
  if (location.hash) setTimeout(() => { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }, 50);
})();
