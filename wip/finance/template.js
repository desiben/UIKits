/*! FacetUI Industry Templates · Finance & Investment · © 2026 ETKits.
   Fee calculator: an illustrative flat fee from plan type, household and complexity factors.
   Figures are sample data from content.mjs (same maths as pages.mjs), not a quote. */
(function () {
  "use strict";
  const root = document.querySelector("[data-ca-calc]");
  const dataEl = document.getElementById("ca-fees-data");
  if (!root || !dataEl) return;
  const D = JSON.parse(dataEl.textContent);
  const $ = (s) => root.querySelector(s);
  const money = (n) => "$" + n.toLocaleString("en-US");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Deep link from service pages: ?hh=couple&f=business,retire#fees
  const params = new URLSearchParams(location.search);
  if (params.get("hh")) { const r = root.querySelector(`input[name=household][value="${CSS.escape(params.get("hh"))}"]`); if (r) r.checked = true; }
  (params.get("f") || "").split(",").filter(Boolean).forEach((id) => { const c = root.querySelector(`input[name=factor][value="${CSS.escape(id)}"]`); if (c) c.checked = true; });

  function render() {
    const plan = root.querySelector("input[name=plan]:checked").value;
    const hh = root.querySelector("input[name=household]:checked").value;
    const on = [...root.querySelectorAll("input[name=factor]:checked")].map((c) => c.value);
    const lines = D.factors.filter((f) => on.includes(f.id));
    const base = D.base[plan][hh];
    const total = base + lines.reduce((s, f) => s + f[plan], 0);
    const tierIndex = D.tiers.findIndex((t) => lines.length <= t.max);
    const tier = D.tiers[tierIndex];
    const p = D.plans.find((x) => x.id === plan);

    $("[data-ca-total]").textContent = money(total);
    $("[data-ca-unit]").textContent = plan === "once" ? "one time" : "per year";
    $("[data-ca-billing]").textContent = plan === "once"
      ? `${p.billing}: ${money(total / 2)} each.`
      : `${p.billing}: ${money(total / 4)} a quarter.`;
    $("[data-ca-tier]").textContent = tier.label;
    $("[data-ca-tier-text]").textContent = tier.text;
    root.querySelectorAll(".ca-tier-bar span").forEach((s, i) => (s.dataset.on = i <= tierIndex ? "true" : "false"));
    D.factors.forEach((f) => { const a = root.querySelector(`[data-ca-amt="${f.id}"]`); if (a) a.textContent = "+" + money(f[plan]); });
    $("[data-ca-lines]").innerHTML =
      `<div><dt>Base fee, ${hh === "single" ? "one person" : "two people"}</dt><dd class="k-num">${money(base)}</dd></div>` +
      lines.map((f) => `<div><dt>${esc(f.label)}</dt><dd class="k-num">+${money(f[plan])}</dd></div>`).join("") +
      `<div class="ca-lines-total"><dt>Total ${plan === "once" ? "flat fee" : "annual fee"}</dt><dd class="k-num">${money(total)}</dd></div>`;
  }
  root.addEventListener("change", render);
  render();
})();
