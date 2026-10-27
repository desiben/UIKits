/* =========================================================================
   Facet UI — AI agent example engine. Builds an App Layout with a product
   surface and an assistant panel, then plays scripted, generative-UI answers.
   Each example defines window.APP = { brand, name, icon, nav, render(state), agent }.
   Swap reply() for your model's streaming API in production.
   ========================================================================= */
(function () {
  "use strict";
  const A = window.APP; if (!A) return;
  const i = (n, c = "") => `<svg class="icon${c ? " " + c : ""}" aria-hidden="true"><use href="#${n}"/></svg>`;
  const $ = (s, r = document) => r.querySelector(s);
  const slow = !(matchMedia("(prefers-reduced-motion: reduce)").matches);
  const wait = (ms) => new Promise((r) => setTimeout(r, slow ? ms : 0));
  const state = A.state || {};
  window.APP_I = i;

  document.documentElement.dataset.brand = A.brand || "iris";
  document.title = `${A.name} — Facet UI agent example`;
  const app = document.getElementById("app");
  app.innerHTML = `<div class="app-layout full" data-variant="inset" data-aside="auto">
    <nav class="sidebar" aria-label="Main">
      <div class="workspace"><span class="logo">${i(A.icon, "icon-sm")}</span><b class="t-label-md grow label-text">${A.name}</b></div>
      ${A.nav.map((g) => (g.label ? `<div class="sidebar-label">${g.label}</div>` : "") + g.items.map(([ic, t, c, cur]) => `<a class="sidebar-item" href="#"${cur ? ' aria-current="page"' : ""}>${i(ic)}<span class="label-text">${t}</span>${c ? `<span class="count">${c}</span>` : ""}</a>`).join("")).join("")}
      <div class="grow"></div>
      <a class="sidebar-item" href="../#/agents">${i("chevron-left")}<span class="label-text">All examples</span></a>
      <div class="workspace" style="margin-top:4px"><span class="avatar avatar-sm av-1">MR</span><span class="label-text grow"><b class="t-label-sm" style="display:block">Maya Rodriguez</b><span class="t-caption text-tertiary">${A.org || "Acme Inc."}</span></span></div>
    </nav>
    <div class="app-body">
      <header class="app-navbar">
        <button class="btn btn-ghost btn-sm icon-btn app-menu-toggle" data-app-toggle="mobile" aria-label="Open menu">${i("menu")}</button>
        <button class="btn btn-ghost btn-sm icon-btn app-desk-only" data-app-toggle="sidebar" aria-label="Collapse sidebar">${i("panel-left")}</button>
        <ol class="breadcrumb"><li>${A.name}</li><li>${i("chevron-right")}</li><li aria-current="page">${A.page}</li></ol>
        <span class="grow"></span>
        <button class="btn btn-ghost btn-sm icon-btn app-desk-only" aria-label="Search">${i("search")}</button>
        <button class="btn btn-ghost btn-sm icon-btn" id="mode" aria-label="Toggle dark mode">${i("moon")}</button>
        <button class="btn btn-sm ask-ai" data-app-toggle="aside">${i("sparkles", "icon-sm")} <span>Ask AI</span></button>
      </header>
      <main class="app-main" id="surface"></main>
    </div>
    <aside class="app-aside agent" aria-label="Assistant">
      <div class="app-aside-head"><span class="ai-mark" style="width:24px;height:24px">${i("sparkles", "icon-sm")}</span><span>${A.agent.name || "Assistant"}</span><span class="badge badge-outline" style="margin-left:4px">Beta</span><span class="grow"></span>
        <button class="btn btn-ghost btn-sm icon-btn" id="reset" aria-label="New chat">${i("square-pen")}</button><button class="btn btn-ghost btn-sm icon-btn" data-app-toggle="aside" aria-label="Close">${i("x")}</button></div>
      <div class="chat-conversation" id="conv" role="log" aria-live="polite"><div class="chat-conversation-content" id="msgs"></div><button class="btn btn-outline btn-sm chat-scroll-btn" hidden>${i("arrow-down", "icon-sm")} Latest</button></div>
      <div class="agent-compose"><div class="composer prompt-input"><textarea rows="1" placeholder="Ask about ${A.short || A.name.toLowerCase()}…" aria-label="Message" id="q"></textarea><div class="composer-bar"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach">${i("paperclip")}</button><span class="ctx-chip">${i(A.icon, "icon-sm")} ${A.page}</span><span class="grow"></span><button class="btn btn-sm icon-btn send" id="send" aria-label="Send" disabled>${i("arrow-up")}</button></div></div><div class="agent-hint">Demo with scripted answers · <a href="../#/agents">How it works</a></div></div>
    </aside>
    <div class="app-scrim"></div>
  </div>`;
  const L = $(".app-layout"), msgs = $("#msgs"), conv = $("#conv");
  const paint = () => { $("#surface").innerHTML = A.render(state, i); if (window.Facet) { Facet.enhance && Facet.enhance($("#surface")); Facet.motion && Facet.motion.refresh($("#surface")); } };
  paint();
  window.APP_REPAINT = paint;

  $("#mode").addEventListener("click", () => { const d = document.documentElement.dataset.theme === "dark"; Facet.theme.setMode(d ? "light" : "dark"); $("#mode").innerHTML = i(d ? "moon" : "sun"); });
  if (document.documentElement.dataset.theme === "dark") $("#mode").innerHTML = i("sun");

  const scroll = () => requestAnimationFrame(() => conv.scrollTo({ top: conv.scrollHeight, behavior: slow ? "smooth" : "auto" }));
  function welcome() {
    msgs.innerHTML = `<div class="agent-welcome"><span class="ai-mark" style="width:40px;height:40px">${i("sparkles")}</span><h2 class="t-h4">${A.agent.greeting}</h2><p class="t-body-sm text-tertiary">${A.agent.sub}</p>
      <div class="prompt-suggestions cards">${A.agent.prompts.slice(0, 4).map((p, k) => `<button class="prompt-suggestion" data-p="${k}">${i(p.icon || "sparkles")}<b>${p.label}</b><small>${p.hint || ""}</small></button>`).join("")}</div></div>`;
  }
  welcome();

  let busy = false;
  const userMsg = (t) => { msgs.insertAdjacentHTML("beforeend", `<div class="chat-msg" data-role="user"><div class="chat-msg-body"><div class="chat-msg-text"></div></div></div>`); msgs.lastElementChild.querySelector(".chat-msg-text").textContent = t; };
  async function run(p, typed) {
    if (busy) return; busy = true;
    const w = $(".agent-welcome", msgs); if (w) w.remove();
    userMsg(typed || p.label); scroll();
    msgs.insertAdjacentHTML("beforeend", `<div class="chat-msg">${`<span class="ai-mark">${i("sparkles", "icon-sm")}</span>`}<div class="chat-msg-body"></div></div>`);
    const body = msgs.lastElementChild.querySelector(".chat-msg-body");
    // 1. reasoning
    if (p.steps) {
      body.insertAdjacentHTML("beforeend", `<details class="cot" open><summary><span class="text-shimmer">Working on it…</span>${i("chevron-down", "icon-sm chev")}</summary><ol class="cot-steps"></ol></details>`);
      const cot = body.lastElementChild, ol = cot.querySelector("ol"); scroll();
      for (const [t, sub] of p.steps) {
        ol.insertAdjacentHTML("beforeend", `<li class="cot-step" data-state="active"><span class="node"></span><div><b>${t}</b>${sub ? `<small>${sub}</small>` : ""}</div></li>`); scroll();
        await wait(650);
        ol.lastElementChild.dataset.state = "done"; ol.lastElementChild.querySelector(".node").innerHTML = i("check");
      }
      cot.querySelector("summary").innerHTML = `${i("brain", "icon-sm")} Thought for ${(p.steps.length * 0.7).toFixed(1)}s ${i("chevron-down", "icon-sm chev")}`;
      cot.open = false;
    }
    // 2. tool call
    if (p.tool) {
      body.insertAdjacentHTML("beforeend", `<details class="chat-tool"><summary><span class="tool-ico">${i(p.tool.icon || "wrench")}</span><code>${p.tool.name}</code><span class="status">${'<span class="spinner" style="width:12px;height:12px"></span>'} Running</span></summary><pre>${p.tool.args}</pre></details>`);
      scroll(); await wait(700);
      const st = body.lastElementChild.querySelector(".status"); st.dataset.state = "done"; st.innerHTML = `${i("check", "icon-sm")} ${p.tool.result}`;
    }
    // 3. streamed answer
    if (p.text) {
      body.insertAdjacentHTML("beforeend", `<div class="chat-msg-text markdown"></div>`);
      const tx = body.lastElementChild; const parts = p.text.split(/(\s+)/); let acc = "";
      for (let k = 0; k < parts.length; k++) { acc += parts[k]; if (k % 3 === 0 || k === parts.length - 1) { tx.innerHTML = acc; scroll(); await wait(18); } }
      tx.innerHTML = p.text;
    }
    // 4. generative UI
    if (p.ui) {
      const html = typeof p.ui === "function" ? p.ui(state, i) : p.ui;
      body.insertAdjacentHTML("beforeend", `<div class="gen-ui">${html}</div>`);
      if (window.Facet) { Facet.enhance && Facet.enhance(body); }
      scroll(); await wait(200);
    }
    // 5. approval
    if (p.approval) {
      const ap = p.approval;
      body.insertAdjacentHTML("beforeend", `<div class="chat-tool" data-state="pending"><div class="chat-tool-head"><span class="tool-ico">${i(ap.icon || "shield-check")}</span><code>${ap.tool}</code><span class="status" data-state="pending">${i("hourglass", "icon-sm")} Needs approval</span></div><div class="chat-tool-approval"><p>${ap.summary}</p><div class="row"><button class="btn btn-outline btn-sm" data-deny>Deny</button><button class="btn btn-sm" data-approve>${i("check", "icon-sm")} ${ap.cta || "Allow"}</button></div></div></div>`);
      const card = body.lastElementChild; scroll();
      const say = (t) => { const act = body.querySelector(".msg-actions"); const h = `<div class="chat-msg-text markdown"><p>${t}</p></div>`; act ? act.insertAdjacentHTML("beforebegin", h) : body.insertAdjacentHTML("beforeend", h); };
      card.addEventListener("facet:approval", async (e) => {
        if (e.detail.approved) { if (ap.onApprove) ap.onApprove(state); paint(); flash(); Facet.toast && Facet.toast({ title: ap.done || "Done", description: ap.doneSub || "", timeout: 3200 }); say(ap.after || "Done."); }
        else say("No problem — I didn't change anything.");
        scroll();
      }, { once: true });
    }
    // 6. actions + follow-ups
    body.insertAdjacentHTML("beforeend", `<div class="msg-actions"><button class="btn btn-ghost btn-sm icon-btn" data-action="copy" aria-label="Copy">${i("copy", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-action="up" aria-pressed="false" aria-label="Good response">${i("thumbs-up", "icon-sm")}</button><button class="btn btn-ghost btn-sm icon-btn" data-action="down" aria-pressed="false" aria-label="Bad response">${i("thumbs-down", "icon-sm")}</button></div>`);
    const next = A.agent.prompts.filter((x) => x !== p && !x.hidden).slice(0, 2);
    if (next.length) body.insertAdjacentHTML("beforeend", `<div class="prompt-suggestions">${next.map((x) => `<button class="prompt-suggestion" data-p="${A.agent.prompts.indexOf(x)}">${i(x.icon || "sparkles", "icon-sm")} ${x.label}</button>`).join("")}</div>`);
    scroll(); busy = false;
  }
  function flash() { const s = $("#surface"); s.classList.remove("flash"); void s.offsetWidth; s.classList.add("flash"); }
  function match(text) {
    const t = text.toLowerCase();
    let best = null, score = 0;
    A.agent.prompts.forEach((p) => { const sc = (p.keys || p.label.toLowerCase().split(/\W+/)).filter((k) => k.length > 2 && t.includes(k)).length; if (sc > score) { score = sc; best = p; } });
    return best || { text: `<p>I can help with that in the full product. In this demo, try one of these:</p>`, steps: [["Understanding the request", ""]] };
  }

  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-p]"); if (s) { if (L.offsetWidth <= 1024 && L.dataset.aside !== "open") L.dataset.aside = "open"; run(A.agent.prompts[+s.dataset.p]); }
    if (e.target.closest("#reset")) { if (!busy) welcome(); }
  });
  const q = $("#q"), send = $("#send");
  send.addEventListener("click", () => { const t = q.value.trim(); if (!t) return; q.value = ""; q.style.height = "auto"; send.disabled = true; run(match(t), t); });
  // open the assistant automatically on first visit to show it off (desktop only already open)
  if (location.hash === "#ask") L.dataset.aside = "open";
  // surface-level prompt buttons (e.g. "Ask AI about this")
  window.APP_RUN = (k) => { if (L.offsetWidth <= 1024) L.dataset.aside = "open"; run(A.agent.prompts[k]); };
  if (A.autoplay !== undefined && /autoplay/.test(location.search)) setTimeout(() => window.APP_RUN(A.autoplay), 600);
})();
