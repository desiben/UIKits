/*! FacetUI Industry Templates · Gaming & Esports · © 2026 ETKits.
   Live scorebar: simulated round updates and match clock for the demo (labelled on the page). */
(function () {
  "use strict";
  const bar = document.querySelector("[data-nf-live]");
  if (!bar) return;
  const a = bar.querySelector("[data-nf-a]"), b = bar.querySelector("[data-nf-b]"), clock = bar.querySelector("[data-nf-clock]");
  let [m, s] = clock.textContent.split(":").map(Number);
  let sa = +a.textContent, sb = +b.textContent;
  const pause = bar.querySelector("[data-nf-pause]");
  let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const syncPause = () => { pause.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${paused ? "play" : "pause"}"/></svg>${paused ? "Resume live updates" : "Pause live updates"}`; };
  pause.addEventListener("click", () => { paused = !paused; syncPause(); });
  syncPause();
  const bump = (el) => { el.classList.remove("nf-bump"); void el.offsetWidth; el.classList.add("nf-bump"); };
  setInterval(() => {
    if (paused) return;
    s += 1; if (s === 60) { s = 0; m += 1; }
    clock.textContent = `${m}:${String(s).padStart(2, "0")}`;
  }, 1000);
  setInterval(() => {
    if (paused) return;
    if (sa >= 16 || sb >= 16) { sa = 0; sb = 0; }
    if (Math.random() < 0.55) { sa += 1; a.textContent = sa; bump(a); } else { sb += 1; b.textContent = sb; bump(b); }
  }, 7000);
})();
