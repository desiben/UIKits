/*! FacetUI Industry Templates · Healthcare & Medical · © 2026 ETKits.
   Care finder: matches a visit reason to a service and shows the next open slot per clinic.
   Availability is generated sample data (deterministic per day), not a live schedule. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const dataEl = $("#hl-data");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------ finder */
  if (dataEl) {
    const data = JSON.parse(dataEl.textContent);
    const finder = $("[data-hl-finder]");
    const out = $("[data-hl-result]");
    let loc = "any";
    const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
    const fmtTime = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
    const dayName = (d, i) => (i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "long" }));

    function nextSlot(svc, l) {
      const now = new Date();
      for (let i = 0; i < 8; i++) {
        const d = new Date(now); d.setDate(now.getDate() + i);
        const hrs = l.week[d.getDay()]; if (!hrs) continue;
        let start = hrs[0];
        if (i === 0) start = Math.max(start, Math.ceil((now.getHours() * 60 + now.getMinutes() + 60) / 20) * 20);
        for (let t = start; t <= hrs[1] - 30; t += 20) {
          if (hash(`${svc.id}|${l.id}|${d.toDateString()}|${t}`) % 3 !== 0) return { label: `${dayName(d, i)} · ${fmtTime(t)}`, soon: i === 0 };
        }
      }
      return null;
    }
    function render() {
      const intent = (finder.querySelector("input[name=intent]:checked") || {}).value;
      const matches = data.services.filter((s) => s.intents.includes(intent));
      const svc = matches[0];
      if (!svc) { out.innerHTML = ""; return; }
      const locs = data.locations.filter((l) => l.services.includes(svc.id) && (loc === "any" || l.id === loc));
      const rows = locs.map((l) => ({ l, slot: nextSlot(svc, l) })).filter((r) => r.slot);
      const also = matches[1];
      out.innerHTML = `<div class="hl-match">
        <div class="hl-match-head"><span class="badge badge-brand">Recommended</span><h2 class="hl-match-title">${esc(svc.name)}</h2><p class="t-body-sm text-secondary">${esc(svc.short)}</p></div>
        ${rows.length ? `<ul class="hl-slots" role="list">${rows.map(({ l, slot }) => `<li><span class="hl-slot-info"><b>${esc(l.name)}</b><span>${slot.soon ? '<span class="badge badge-success">Today</span> ' : ""}${esc(slot.label.replace(/^Today · /, ""))}</span></span><a class="btn btn-sm" href="${esc(data.book)}?service=${svc.id}&location=${l.id}">Book<span class="sr-only"> ${esc(svc.name)} at ${esc(l.name)}</span></a></li>`).join("")}</ul>`
          : `<p class="t-body-sm text-secondary hl-none">${esc(svc.name)} isn't offered at this clinic. <button type="button" class="btn btn-link btn-sm" data-hl-any>Show all clinics</button></p>`}
        <p class="t-body-sm hl-match-more"><a class="link" href="${esc(data.pages[svc.id])}">About ${esc(svc.name.toLowerCase())}</a>${also ? ` · Also consider <a class="link" href="${esc(data.pages[also.id])}">${esc(also.name.toLowerCase())}</a>` : ""}${svc.visit.includes("Video") ? " · Video visits available" : ""}</p>
      </div>`;
    }
    finder.addEventListener("change", (e) => { if (e.target.name === "intent") render(); });
    finder.addEventListener("facet:change", () => {
      const b = finder.querySelector('[data-hl-loc] [aria-checked="true"]'); loc = b ? b.dataset.value : "any"; render();
    });
    finder.addEventListener("click", (e) => {
      if (!e.target.closest("[data-hl-any]")) return;
      const any = finder.querySelector('[data-hl-loc] [data-value="any"]'); any.click(); any.focus();
    });
    render();
  }

  /* ------------------------------------------------------------ insurance checker */
  const ins = $("[data-hl-ins]");
  if (ins) {
    const out = $("[data-hl-ins-result]");
    const box = (tone, ic, title, text) => `<div class="alert alert-${tone}" role="status"><svg class="icon" aria-hidden="true"><use href="#${ic}"/></svg><div><div class="alert-title">${title}</div><div class="alert-desc">${text}</div></div></div>`;
    ins.addEventListener("change", () => {
      const o = ins.options[ins.selectedIndex];
      if (!ins.value) out.innerHTML = "";
      else if (ins.value === "none") out.innerHTML = box("info", "wallet", "You can still be seen", "Self-pay rates are shown up front and payment plans are interest-free.");
      else if (o.dataset.out) out.innerHTML = box("warning", "triangle-alert", `${esc(o.text)} is out of network`, "You can still book. We'll give you a cost estimate before your visit.");
      else out.innerHTML = box("success", "circle-check", `${esc(o.text)} is in network`, "Bring your card to your first visit. Co-pays are collected at check-in.");
    });
  }
})();
