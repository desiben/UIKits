/* Facet UI · license unlock for the code in the style guide and the templates page.
   Live demos are public; copyable code is for buyers. A buyer enters the license key from their
   Gumroad receipt once: the server checks it (the same check as `npx facetui`) and returns the code,
   and the key is remembered in this browser. The buyer download sets window.FACET_BUYER, so the
   offline copy is unlocked without a network check. */
(function () {
  var STORE = "facet-license";
  var me = document.currentScript && document.currentScript.getAttribute("src");
  var root = me ? me.replace(/assets\/license\.js.*$/, "") : "";
  var endpoint = root + "r/docs-snippets.json";
  var state = { unlocked: false, data: null };
  if (window.FACET_BUYER) state = { unlocked: true, data: window.FACET_BUYER };

  // Styles for the locked panel (shared by the docs and the templates page).
  var st = document.createElement("style");
  st.textContent = ".code-locked{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px dashed var(--border-default,#d4d4dc);border-radius:12px 4px 12px 12px;background:var(--bg-subtle,#f6f6fa);color:var(--text-secondary,#41424a);margin:8px 0}" +
    ".code-locked>.icon{flex:none;width:22px;height:22px;color:var(--icon-brand,#5d4ff3)}.code-locked>div{flex:1;min-width:0;display:grid;gap:2px}" +
    ".code-locked b{font-weight:600;color:var(--text-primary,#15151b)}.code-locked span{font-size:13px;color:var(--text-tertiary,#5d5d64)}" +
    "@media (max-width:560px){.code-locked{flex-wrap:wrap}.code-locked .btn{width:100%}}";
  document.head.appendChild(st);

  var saved = function () { try { return localStorage.getItem(STORE); } catch (e) { return null; } };
  var store = function (k) { try { k ? localStorage.setItem(STORE, k) : localStorage.removeItem(STORE); } catch (e) {} };
  var emit = function () { document.dispatchEvent(new CustomEvent("facet:license", { detail: state })); };

  // A random id for this browser, so a license can be limited to a number of devices.
  function deviceId() {
    try { var d = localStorage.getItem("facet-device"); if (d) return d; d = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()); localStorage.setItem("facet-device", d); return d; } catch (e) { return "no-storage"; }
  }
  function deviceName() {
    var ua = navigator.userAgent, b = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
    var os = /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "";
    return b + (os ? " on " + os : "");
  }

  function verify(key) {
    return fetch(endpoint, { headers: { Authorization: "Bearer " + key, "X-Facet-Device": deviceId(), "X-Facet-Client": "web", "X-Facet-Device-Name": deviceName() }, cache: "no-store" })
      .catch(function () { throw new Error("Couldn't reach the license server. Check your connection and try again."); })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          if (!r.ok) { var e = new Error(d.error || "That license key didn't work."); e.status = r.status; throw e; }
          state = { unlocked: true, data: d }; store(key); emit(); return d;
        });
      });
  }

  // Re-check a remembered key quietly; forget it only if the server rejects it.
  if (!state.unlocked && saved()) verify(saved()).catch(function (e) { if (e.status === 401 || e.status === 403) store(null); });

  var dlg;
  function open() {
    if (state.unlocked) return;
    if (!dlg) {
      dlg = document.createElement("div");
      dlg.className = "overlay license-overlay"; dlg.hidden = true;
      dlg.innerHTML = '<form class="dialog" role="dialog" aria-modal="true" aria-labelledby="lic-t" novalidate>' +
        '<div class="dialog-header"><div class="dialog-title" id="lic-t">Unlock the code</div>' +
        '<div class="dialog-desc">The live demos are free to try. The HTML and React code is for Facet UI buyers: enter the license key from your Gumroad receipt.</div></div>' +
        '<div class="dialog-body"><div class="field"><label class="label" for="lic-key">License key</label>' +
        '<input class="input" id="lic-key" autocomplete="off" spellcheck="false" placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX" required>' +
        '<p class="help" id="lic-msg" role="status"></p></div></div>' +
        '<div class="dialog-footer"><a class="btn btn-ghost" href="https://www.etkits.us/#facetui" target="_blank" rel="noopener">Buy Facet UI</a>' +
        '<button type="button" class="btn btn-outline" data-lic-close>Cancel</button><button class="btn" type="submit" data-lic-go>Unlock</button></div></form>';
      document.body.appendChild(dlg);
      var input = dlg.querySelector("#lic-key"), msg = dlg.querySelector("#lic-msg"), go = dlg.querySelector("[data-lic-go]");
      var close = function () { dlg.hidden = true; };
      dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-lic-close]")) close(); });
      dlg.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      dlg.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var key = input.value.trim(); if (!key) { input.focus(); return; }
        go.disabled = true; go.textContent = "Checking…"; msg.textContent = ""; input.removeAttribute("aria-invalid"); input.parentNode.removeAttribute("data-invalid");
        verify(key).then(function () {
          close();
          if (window.Facet && Facet.toast) Facet.toast({ title: "Code unlocked", description: "Thanks for buying Facet UI.", timeout: 2200 });
        }).catch(function (err) {
          msg.textContent = err.message; input.setAttribute("aria-invalid", "true"); input.parentNode.setAttribute("data-invalid", "true"); input.focus();
        }).then(function () { go.disabled = false; go.textContent = "Unlock"; });
      });
    }
    dlg.hidden = false;
    setTimeout(function () { dlg.querySelector("#lic-key").focus(); }, 30);
  }

  function signOut() { store(null); if (!window.FACET_BUYER) { state = { unlocked: false, data: null }; emit(); } }

  // Markup for a locked code panel; any element with [data-unlock] opens the dialog.
  function lockedHTML(what) {
    return '<div class="code-locked"><svg class="icon" aria-hidden="true"><use href="#lock"/></svg><div><b>' + (what || "Code") +
      ' is for Facet UI buyers</b><span>Try the live demo above for free. Unlock the code with your license key.</span></div>' +
      '<button type="button" class="btn btn-sm" data-unlock>Unlock code</button></div>';
  }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-unlock]")) { e.preventDefault(); open(); } });

  window.FacetLicense = {
    get unlocked() { return state.unlocked; },
    get data() { return state.data; },
    get buyerCopy() { return !!window.FACET_BUYER; },
    open: open, verify: verify, signOut: signOut, lockedHTML: lockedHTML,
  };
})();
