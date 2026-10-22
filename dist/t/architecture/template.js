/*! FacetUI Industry Templates · Architecture & Interiors · © 2026 ETKits.
   Project index: hovering or focusing a project name shows its image on the stage.
   Links still navigate, so nothing depends on hover. */
(function () {
  "use strict";
  const list = document.querySelector("[data-sv-list]");
  const stage = document.querySelector("[data-sv-stage]");
  if (!list || !stage) return;
  const items = Array.from(stage.children);
  const links = Array.from(list.querySelectorAll("[data-sv-target]"));
  function show(i) {
    items.forEach((it, n) => (n === i ? it.setAttribute("data-active", "true") : it.removeAttribute("data-active")));
    links.forEach((l, n) => (n === i ? l.setAttribute("data-on", "true") : l.removeAttribute("data-on")));
  }
  links.forEach((l) => {
    const i = +l.dataset.svTarget;
    l.addEventListener("mouseenter", () => show(i));
    l.addEventListener("focus", () => show(i));
  });
})();
