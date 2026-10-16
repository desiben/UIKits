(function () {
  var kits = window.UIKITS || [];
  var grid = document.getElementById("kit-grid");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function sources(video, reel) {
    reel.forEach(function (s) { video.appendChild(el("source", { src: s.src, type: s.type })); });
  }

  function card(kit) {
    var video = el("video", { muted: "", loop: "", playsinline: "", preload: "none", poster: kit.poster, "aria-hidden": "true" });
    video.muted = true;
    sources(video, kit.reel);

    var media = el("button", { class: "kit-media", type: "button", "data-reel": kit.id, "aria-label": "Play the " + kit.name + " showreel" }, [
      video,
      el("span", { class: "play", "aria-hidden": "true", text: "▶" }),
      el("span", { class: "badge", text: kit.version })
    ]);

    var stats = el("dl", { class: "stats" }, kit.stats.map(function (s) {
      return el("div", {}, [el("dt", { text: s[0] }), el("dd", { text: s[1] })]);
    }));
    var tags = el("ul", { class: "tags" }, kit.tags.map(function (t) { return el("li", { text: t }); }));
    var links = el("div", { class: "links" }, kit.links.map(function (l) {
      return el("a", { class: "btn" + (l.primary ? " btn-primary" : ""), href: l.href, target: "_blank", rel: "noopener", text: l.label });
    }));

    var article = el("article", { class: "kit", id: kit.id, style: "--accent:" + kit.accent }, [
      media,
      el("div", { class: "kit-body" }, [
        kit.label ? el("p", { class: "kit-label", text: kit.label }) : null,
        el("h3", { text: kit.name }),
        el("p", { class: "tagline", text: kit.tagline }),
        el("p", { class: "muted", text: kit.description }),
        stats, tags, links
      ])
    ]);

    // Hover/focus preview: play the muted reel in place.
    if (!reduceMotion) {
      var play = function () { var p = video.play(); if (p && p.catch) p.catch(function () {}); };
      var stop = function () { video.pause(); };
      media.addEventListener("mouseenter", play);
      media.addEventListener("focus", play);
      media.addEventListener("mouseleave", stop);
      media.addEventListener("blur", stop);
    }
    return article;
  }

  kits.forEach(function (k) { grid.appendChild(card(k)); });
  for (var i = 0; i < (window.UIKITS_COMING_SOON || 0); i++) {
    grid.appendChild(el("article", { class: "kit kit-soon", "aria-label": "Upcoming kit" }, [
      el("div", { class: "soon-art", "aria-hidden": "true" }),
      el("div", { class: "kit-body" }, [el("h3", { text: "Next kit" }), el("p", { class: "muted", text: "In the works." })])
    ]));
  }
  document.getElementById("kit-count").textContent =
    kits.length + (kits.length === 1 ? " kit" : " kits") + " released, more on the way";

  // Full-size showreel dialog.
  var dialog = document.getElementById("reel");
  var player = document.getElementById("reel-video");
  var title = document.getElementById("reel-title");

  function openReel(id) {
    var kit = kits.filter(function (k) { return k.id === id; })[0];
    if (!kit) return;
    player.pause();
    player.innerHTML = "";
    player.poster = kit.poster;
    sources(player, kit.reel);
    player.load();
    title.textContent = kit.name + " · " + kit.version + " showreel";
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
    var p = player.play(); if (p && p.catch) p.catch(function () {});
  }
  function closeReel() {
    player.pause();
    if (dialog.close) dialog.close(); else dialog.removeAttribute("open");
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-reel]");
    if (trigger) { e.preventDefault(); openReel(trigger.getAttribute("data-reel")); return; }
    if (e.target.closest("[data-close]") || e.target === dialog) closeReel();
  });
  dialog.addEventListener("close", function () { player.pause(); });
})();
