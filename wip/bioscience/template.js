/*! FacetUI Industry Templates · Bioscience & Biotechnology · © 2026 ETKits.
   1. Turnaround toggle: swaps every matrix cell between standard and priority working days.
   2. Scoping estimate: longest turnaround for the chosen sample type and assays (sample data). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tier = (d) => (d <= 5 ? 1 : d <= 10 ? 2 : 3);

  /* ------------------------------------------------------------ matrix toggle */
  document.addEventListener("facet:change", (e) => {
    const seg = e.target.closest && e.target.closest("[data-cw-tat]");
    if (!seg) return;
    const mode = e.detail && e.detail.value === "pri" ? "pri" : "std";
    const scope = seg.closest("section") || document;
    $$("[data-cw-matrix] .cw-days", scope).forEach((el) => {
      el.textContent = el.dataset[mode];
      el.closest("td").dataset.tier = tier(+el.dataset[mode]);
    });
  });

  /* ------------------------------------------------------------ scoping estimate */
  const dataEl = $("#cw-data");
  const form = $("#scope-form");
  const out = $("[data-cw-estimate-out]");
  if (!dataEl || !form || !out) return;
  const data = JSON.parse(dataEl.textContent);
  const initial = out.innerHTML;

  function render() {
    const sample = (form.querySelector("input[name=sample]:checked") || {}).value;
    const prio = (form.querySelector("input[name=tier]:checked") || {}).value === "priority";
    const picked = $$("input[name=assay]:checked", form).map((i) => i.value);
    const unsure = picked.includes("unsure");
    const rows = data.assays.filter((a) => picked.includes(a.id));
    if (!sample || (!rows.length && !unsure)) { out.innerHTML = initial; return; }
    const st = data.samples.find((s) => s.id === sample);
    const offered = rows.filter((a) => a.std[sample] != null).map((a) => ({ name: a.name, d: (prio ? a.pri : a.std)[sample] }));
    const missing = rows.filter((a) => a.std[sample] == null);
    const longest = offered.reduce((m, r) => Math.max(m, r.d), 0);
    out.innerHTML = `
      ${offered.length ? `<p class="cw-est-big"><span class="k-num">${longest}</span> working days</p><p class="t-body-sm text-secondary">Longest ${prio ? "priority" : "standard"} assay for ${esc(st.label.toLowerCase())}. Assays run in parallel.</p>
      <ul class="cw-est-list" role="list">${offered.map((r) => `<li><span>${esc(r.name)}</span><span class="k-num">${r.d} d</span></li>`).join("")}</ul>` : ""}
      ${missing.length ? `<div class="alert alert-warning" role="note"><svg class="icon" aria-hidden="true"><use href="#triangle-alert"/></svg><div><div class="alert-title">Not on the standard menu for ${esc(st.label.toLowerCase())}</div><div class="alert-desc">${missing.map((a) => esc(a.name)).join(", ")}. We can discuss a custom method on the scoping call.</div></div></div>` : ""}
      ${unsure ? `<p class="t-body-sm text-secondary">You asked us to recommend assays; we'll add their times to your study plan.</p>` : ""}`;
  }
  form.addEventListener("change", render);
  form.closest("[data-kit-flow]").addEventListener("click", (e) => { if (e.target.closest("[data-kit-reset]")) setTimeout(render, 0); });
  document.addEventListener("kit:ready", render);
  window.addEventListener("load", render);
  render();
})();
