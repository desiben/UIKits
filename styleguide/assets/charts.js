/* =========================================================================
   Facet UI — charts (v1.2). No dependencies. ~9 KB.
   Declarative: <div class="chart" data-chart='{"type":"area", ...}'></div>
   Types: area · line · bar · composed · pie (donut) · radar · radial · spark
   Colors default to the chart/1–6 tokens, so charts follow brand + light/dark.
   API: Facet.charts.render(el, config?) · Facet.charts.refresh(scope?)
   ========================================================================= */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];
  let uid = 0;
  const el = (tag, attrs = {}, style) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (style) n.setAttribute("style", style); return n; };
  const reduce = () => (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) || document.documentElement.dataset.motion === "off";

  function formatter(f) {
    if (typeof f === "function") return f;
    const nf = (o) => new Intl.NumberFormat("en-US", o);
    switch (f) {
      case "currency": return (v) => nf({ style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
      case "compact": return (v) => nf({ notation: "compact", maximumFractionDigits: 1 }).format(v);
      case "$compact": return (v) => "$" + nf({ notation: "compact", maximumFractionDigits: 1 }).format(v);
      case "percent": return (v) => nf({ maximumFractionDigits: 1 }).format(v) + "%";
      default: return (v) => nf({ maximumFractionDigits: 2 }).format(v);
    }
  }
  const niceMax = (m) => { if (m <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(m))); const n = m / p; const step = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => n <= x); return step * p; };
  function smooth(pts) { // monotone-ish cubic through points
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1] || pts[i], [x1, y1] = pts[i], [x2, y2] = pts[i + 1], [x3, y3] = pts[i + 2] || pts[i + 1];
      const t = 0.18;
      d += ` C${x1 + (x2 - x0) * t},${y1 + (y2 - y0) * t} ${x2 - (x3 - x1) * t},${y2 - (y3 - y1) * t} ${x2},${y2}`;
    }
    return d;
  }
  const straight = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0] + "," + p[1]).join(" ");

  function legend(host, items) {
    const lg = document.createElement("div"); lg.className = "chart-legend";
    lg.innerHTML = items.map((s) => `<span><i style="--c:${s.color}"></i>${s.name}</span>`).join("");
    host.appendChild(lg);
  }

  /* ---------- cartesian: area, line, bar, composed, spark ---------- */
  function cartesian(host, c, W) {
    const spark = c.type === "spark";
    const H = c.height || (spark ? 48 : 220);
    const series = c.series.map((s, k) => ({ ...s, color: s.color || PALETTE[k % 6], kind: s.type || (c.type === "composed" ? (k ? "line" : "bar") : c.type === "spark" ? "area" : c.type) }));
    const labels = c.labels || series[0].data.map((_, i) => i + 1);
    const n = labels.length, f = formatter(c.format);
    const pad = spark ? { t: 4, r: 2, b: 4, l: 2 } : { t: 10, r: 8, b: 26, l: c.hideY ? 8 : 44 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const stacked = !!c.stacked;
    let max = 0;
    for (let i = 0; i < n; i++) {
      if (stacked) max = Math.max(max, series.filter((s) => s.kind !== "line").reduce((a, s) => a + (s.data[i] || 0), 0), ...series.filter((s) => s.kind === "line").map((s) => s.data[i] || 0));
      else max = Math.max(max, ...series.map((s) => s.data[i] || 0));
    }
    max = c.max || niceMax(max * 1.05);
    const hasBars = series.some((s) => s.kind === "bar");
    const band = iw / n, x = (i) => pad.l + (hasBars ? band * (i + 0.5) : n === 1 ? iw / 2 : (iw * i) / (n - 1));
    const y = (v) => pad.t + ih - (v / max) * ih;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": c.label || "Chart" });
    const defs = el("defs"); svg.appendChild(defs);
    if (!spark) {
      const g = el("g", { class: "grid" }), ax = el("g", { class: "axis" });
      const ticks = c.ticks || 4;
      for (let t = 0; t <= ticks; t++) {
        const v = (max / ticks) * t, yy = Math.round(y(v)) + 0.5;
        g.appendChild(el("line", { x1: pad.l, x2: W - pad.r, y1: yy, y2: yy }));
        if (!c.hideY) { const tx = el("text", { x: pad.l - 8, y: yy + 4, "text-anchor": "end" }); tx.textContent = f(v); ax.appendChild(tx); }
      }
      const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 56))));
      labels.forEach((l, i) => { if (i % every) return; const tx = el("text", { x: x(i), y: H - 6, "text-anchor": "middle" }); tx.textContent = l; ax.appendChild(tx); });
      svg.appendChild(g); svg.appendChild(ax);
    }
    // bars
    const barSeries = series.filter((s) => s.kind === "bar");
    if (barSeries.length) {
      const gb = el("g");
      const groupW = band * (c.barWidth || 0.62), bw = stacked ? groupW : groupW / barSeries.length;
      const r = Math.min(4, bw / 3);
      for (let i = 0; i < n; i++) {
        let acc = 0;
        barSeries.forEach((s, k) => {
          const v = s.data[i] || 0, x0 = x(i) - groupW / 2 + (stacked ? 0 : k * bw), top = stacked ? y(acc + v) : y(v), bot = stacked ? y(acc) : y(0);
          const h = Math.max(0, bot - top);
          const isTop = !stacked || k === barSeries.length - 1;
          const path = isTop && h > r ? `M${x0},${bot} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x0 + bw - (stacked ? 0 : 1.5) - r} Q${x0 + bw - (stacked ? 0 : 1.5)},${top} ${x0 + bw - (stacked ? 0 : 1.5)},${top + r} V${bot} Z` : `M${x0},${bot} V${top} H${x0 + bw - (stacked ? 0 : 1.5)} V${bot} Z`;
          const p = el("path", { d: path, class: "series-bar", "data-i": i }, `fill:${s.color}`);
          if (!reduce()) { p.style.transformOrigin = `0 ${bot}px`; p.style.transformBox = "view-box"; p.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 600, delay: i * 30, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }); }
          gb.appendChild(p); acc += v;
        });
      }
      svg.appendChild(gb);
    }
    // areas & lines
    let accum = new Array(n).fill(0);
    series.filter((s) => s.kind === "area" || s.kind === "line").forEach((s) => {
      const base = stacked && s.kind === "area" ? accum.slice() : new Array(n).fill(0);
      const vals = s.data.map((v, i) => (v == null ? null : (stacked && s.kind === "area" ? base[i] + v : v)));
      const segs = []; let cur = [];
      vals.forEach((v, i) => { if (v == null) { if (!c.connectNulls && cur.length) { segs.push(cur); cur = []; } } else cur.push([x(i), y(v), i]); });
      if (cur.length) segs.push(cur);
      const line = c.curve === false || s.curve === false ? straight : smooth;
      if (s.kind === "area") {
        const id = "fx-g" + ++uid;
        const lg = el("linearGradient", { id, x1: 0, x2: 0, y1: 0, y2: 1 });
        lg.appendChild(el("stop", { offset: "0%" }, `stop-color:${s.color};stop-opacity:${s.opacity ?? (spark ? 0.28 : 0.32)}`));
        lg.appendChild(el("stop", { offset: "100%" }, `stop-color:${s.color};stop-opacity:0`));
        defs.appendChild(lg);
        segs.forEach((pts) => {
          const top = line(pts);
          const bottom = stacked ? line(pts.map((p) => [p[0], y(base[p[2]])]).reverse()).replace(/^M/, "L") : `L${pts[pts.length - 1][0]},${y(0)} L${pts[0][0]},${y(0)}`;
          svg.appendChild(el("path", { d: `${top} ${bottom} Z`, class: "series-area" }, `fill:url(#${id})`));
        });
      }
      segs.forEach((pts) => {
        const p = el("path", { d: line(pts), class: "series-line" }, `stroke:${s.color};${s.dashed ? "stroke-dasharray:5 5;" : ""}`);
        svg.appendChild(p);
        if (!reduce() && !s.dashed) { const L = p.getTotalLength ? 2000 : 0; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1100, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }).onfinish = () => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; }; }
      });
      if (s.dots) vals.forEach((v, i) => v != null && svg.appendChild(el("circle", { cx: x(i), cy: y(v), r: 3.5, class: "dot" }, `fill:${s.color}`)));
      if (stacked && s.kind === "area") accum = accum.map((a, i) => a + (s.data[i] || 0));
    });
    host.appendChild(svg);
    // tooltip
    if (c.tooltip !== false) {
      const tip = document.createElement("div"); tip.className = "chart-tooltip"; host.appendChild(tip);
      const cursor = el("line", { class: "cursor", y1: pad.t, y2: pad.t + ih, opacity: 0 }); svg.insertBefore(cursor, svg.children[2] || null);
      const dots = series.filter((s) => s.kind !== "bar").map((s) => { const d = el("circle", { r: 4, class: "dot", opacity: 0 }, `fill:${s.color}`); svg.appendChild(d); return d; });
      const move = (e) => {
        const r = svg.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W;
        let i = hasBars ? Math.floor((px - pad.l) / band) : Math.round(((px - pad.l) / iw) * (n - 1));
        i = Math.max(0, Math.min(n - 1, i));
        cursor.setAttribute("x1", x(i)); cursor.setAttribute("x2", x(i)); cursor.setAttribute("opacity", hasBars ? 0 : 1);
        let acc2 = 0;
        series.filter((s) => s.kind !== "bar").forEach((s, k) => { const v = s.data[i]; const vv = stacked && s.kind === "area" ? (acc2 += v || 0) : v; if (v == null) return dots[k].setAttribute("opacity", 0); dots[k].setAttribute("cx", x(i)); dots[k].setAttribute("cy", y(vv)); dots[k].setAttribute("opacity", 1); });
        tip.innerHTML = `<b>${labels[i]}</b>` + series.map((s) => `<div><i style="--c:${s.color}"></i>${s.name}<span>${s.data[i] == null ? "—" : f(s.data[i])}</span></div>`).join("");
        const tx = (x(i) / W) * r.width, tw = tip.offsetWidth;
        tip.style.left = Math.max(0, tx + 12 + tw > r.width ? tx - 12 - tw : tx + 12) + "px";
        tip.style.top = Math.max(0, ((e.clientY - r.top) / r.height) * r.height - tip.offsetHeight - 12) + "px";
        tip.classList.add("on");
      };
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerleave", () => { tip.classList.remove("on"); cursor.setAttribute("opacity", 0); dots.forEach((d) => d.setAttribute("opacity", 0)); });
    }
    if (c.legend && !spark) legend(host, series);
  }

  /* ---------- pie / donut ---------- */
  function pie(host, c, W) {
    const size = Math.min(c.size || 220, W), R = size / 2, inner = c.donut === false ? 0 : R * (c.inner || 0.62);
    const items = c.data.map((d, k) => ({ ...d, color: d.color || PALETTE[k % 6] }));
    const total = items.reduce((a, d) => a + d.value, 0), f = formatter(c.format);
    const svg = el("svg", { viewBox: `0 0 ${size} ${size}`, role: "img", "aria-label": c.label || "Pie chart" }, `max-width:${size}px;margin:0 auto`);
    let a0 = -Math.PI / 2; const gap = items.length > 1 ? (c.gap ?? 0.012) : 0;
    const tip = document.createElement("div"); tip.className = "chart-tooltip";
    items.forEach((d, k) => {
      const a1 = a0 + (d.value / total) * Math.PI * 2;
      const s0 = a0 + gap / 2, s1 = a1 - gap / 2, large = s1 - s0 > Math.PI ? 1 : 0;
      const p = (r, a) => [R + r * Math.cos(a), R + r * Math.sin(a)];
      const [x0, y0] = p(R, s0), [x1, y1] = p(R, s1), [x2, y2] = p(inner, s1), [x3, y3] = p(inner, s0);
      const path = inner ? `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${inner},${inner} 0 ${large} 0 ${x3},${y3} Z` : `M${R},${R} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`;
      const sl = el("path", { d: path, class: "slice" }, `fill:${d.color}`);
      if (!reduce()) sl.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }], { duration: 500, delay: k * 70, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
      sl.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); tip.innerHTML = `<div><i style="--c:${d.color}"></i>${d.name}<span>${f(d.value)} · ${Math.round((d.value / total) * 100)}%</span></div>`; tip.style.left = Math.min(e.clientX - r.left + 12, r.width - tip.offsetWidth) + "px"; tip.style.top = e.clientY - r.top - 40 + "px"; tip.classList.add("on"); });
      sl.addEventListener("pointerleave", () => tip.classList.remove("on"));
      svg.appendChild(sl); a0 = a1;
    });
    if (inner && c.center !== false) {
      const t1 = el("text", { x: R, y: R + 4, "text-anchor": "middle", class: "center-label" }); t1.textContent = c.centerLabel || f(total);
      const t2 = el("text", { x: R, y: R + 24, "text-anchor": "middle", class: "center-sub" }); t2.textContent = c.centerSub || "Total";
      svg.appendChild(t1); svg.appendChild(t2);
    }
    host.appendChild(svg); host.appendChild(tip);
    if (c.legend !== false) legend(host, items.map((d) => ({ name: `${d.name} <b style="color:var(--text-primary);margin-left:2px">${Math.round((d.value / total) * 100)}%</b>`, color: d.color })));
  }

  /* ---------- radar ---------- */
  function radar(host, c, W) {
    const size = Math.min(c.size || 280, W), R = size / 2 - 34, cx = size / 2, cy = size / 2;
    const axes = c.labels, n = axes.length, max = c.max || niceMax(Math.max(...c.series.flatMap((s) => s.data)));
    const pt = (i, v) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * R * (v / max), cy + Math.sin(a) * R * (v / max)]; };
    const svg = el("svg", { viewBox: `0 0 ${size} ${size}`, role: "img", "aria-label": c.label || "Radar chart" }, `max-width:${size}px;margin:0 auto`);
    for (let r = 1; r <= 4; r++) svg.appendChild(el("polygon", { points: axes.map((_, i) => pt(i, (max * r) / 4).join(",")).join(" "), class: "radar-web" }));
    axes.forEach((l, i) => { const [x1, y1] = pt(i, max); svg.appendChild(el("line", { x1: cx, y1: cy, x2: x1, y2: y1, class: "radar-web" })); const [lx, ly] = pt(i, max * 1.17); const t = el("text", { x: lx, y: ly + 4, "text-anchor": Math.abs(lx - cx) < 4 ? "middle" : lx > cx ? "start" : "end" }); t.textContent = l; const g = el("g", { class: "axis" }); g.appendChild(t); svg.appendChild(g); });
    const series = c.series.map((s, k) => ({ ...s, color: s.color || PALETTE[k % 6] }));
    series.forEach((s) => {
      const poly = el("polygon", { points: s.data.map((v, i) => pt(i, v).join(",")).join(" ") }, `fill:${s.color};fill-opacity:.18;stroke:${s.color};stroke-width:2;stroke-linejoin:round`);
      if (!reduce()) { poly.style.transformOrigin = `${cx}px ${cy}px`; poly.style.transformBox = "view-box"; poly.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 700, easing: "cubic-bezier(.34,1.56,.64,1)" }); }
      svg.appendChild(poly);
      s.data.forEach((v, i) => { const [x1, y1] = pt(i, v); svg.appendChild(el("circle", { cx: x1, cy: y1, r: 3, class: "dot" }, `fill:${s.color}`)); });
    });
    host.appendChild(svg);
    if (c.legend !== false && series.length > 1) legend(host, series);
  }

  /* ---------- radial (gauges / radial bars) ---------- */
  function radial(host, c, W) {
    const size = Math.min(c.size || 220, W), cx = size / 2, cy = size / 2;
    const items = c.data.map((d, k) => ({ ...d, color: d.color || PALETTE[k % 6] }));
    const thick = c.thickness || (items.length > 1 ? 12 : 16), gap = 6, f = formatter(c.format);
    const sweep = c.half ? Math.PI : Math.PI * 2 * 0.75, start = c.half ? Math.PI : Math.PI * 0.75;
    const H = c.half ? size / 2 + 24 : size;
    const svg = el("svg", { viewBox: `0 0 ${size} ${H}`, role: "img", "aria-label": c.label || "Radial chart" }, `max-width:${size}px;margin:0 auto`);
    const arc = (r, a0, a1) => { const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1}`; };
    items.forEach((d, k) => {
      const r = size / 2 - thick / 2 - 2 - k * (thick + gap), pct = Math.max(0, Math.min(1, d.value / (d.max || c.max || 100)));
      svg.appendChild(el("path", { d: arc(r, start, start + sweep), class: "track" }, `fill:none;stroke-width:${thick};stroke-linecap:round`));
      const p = el("path", { d: arc(r, start, start + Math.max(0.001, sweep * pct)) }, `fill:none;stroke:${d.color};stroke-width:${thick};stroke-linecap:round`);
      svg.appendChild(p);
      if (!reduce()) { const L = r * sweep * pct; p.style.strokeDasharray = `${L} ${L + 10}`; p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1000, delay: k * 90, easing: "cubic-bezier(.34,1.3,.64,1)", fill: "backwards" }); }
    });
    if (c.center !== false) {
      const t1 = el("text", { x: cx, y: c.half ? cy - 6 : cy + 6, "text-anchor": "middle", class: "center-label" }); t1.textContent = c.centerLabel || (items.length === 1 ? f(items[0].value) : "");
      const t2 = el("text", { x: cx, y: c.half ? cy + 14 : cy + 26, "text-anchor": "middle", class: "center-sub" }); t2.textContent = c.centerSub || (items.length === 1 ? items[0].name : "");
      svg.appendChild(t1); svg.appendChild(t2);
    }
    host.appendChild(svg);
    if (c.legend !== false && items.length > 1) legend(host, items.map((d) => ({ name: `${d.name} <b style="color:var(--text-primary);margin-left:2px">${f(d.value)}</b>`, color: d.color })));
  }

  function render(host, cfg) {
    const c = cfg || JSON.parse(host.dataset.chart || "{}");
    host._chart = c;
    host.querySelectorAll(":scope > svg, :scope > .chart-legend, :scope > .chart-tooltip").forEach((n) => n.remove());
    const W = Math.max(120, Math.round(host.clientWidth || 480));
    if (c.type === "pie" || c.type === "donut") pie(host, c, W);
    else if (c.type === "radar") radar(host, c, W);
    else if (c.type === "radial") radial(host, c, W);
    else cartesian(host, c, W);
    host._w = W;
  }
  const ro = "ResizeObserver" in window ? new ResizeObserver((ents) => { for (const e of ents) { const h = e.target; const w = Math.round(h.clientWidth); if (h._chart && Math.abs(w - (h._w || 0)) > 12) render(h, h._chart); } }) : null;
  function refresh(scope = document) {
    scope.querySelectorAll(".chart[data-chart]").forEach((h) => { if (!h._chart || h._dirty) { try { render(h); } catch (err) { console.warn("Facet chart:", err); } if (ro) ro.observe(h); } });
  }
  window.Facet = window.Facet || {};
  window.Facet.charts = { render, refresh, palette: PALETTE, format: formatter };
  const init = () => refresh();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  if ("MutationObserver" in window) new MutationObserver((muts) => { if (muts.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches?.(".chart[data-chart]") || n.querySelector?.(".chart[data-chart]"))))) requestAnimationFrame(() => refresh()); }).observe(document.documentElement, { childList: true, subtree: true });
})();
