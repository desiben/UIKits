#!/usr/bin/env python3
"""FacetUI Industry Templates · verify.py · (c) 2026 ETKits.

Automated checks for built templates (run `node build.mjs` first):
  python3 tools/verify.py [slug ...] [--shots DIR] [--previews]

Per page, at 375 / 390 / 768 / 1024 / 1440 px:
  - horizontal overflow, console errors, failed requests, broken icon references
  - axe-core WCAG 2.0/2.1/2.2 A+AA rules (once per page, at 390 and 1440)
Per template:
  - mobile menu opens with keyboard, Escape closes it and returns focus
  - conversion flow: empty submit shows the error summary; filling every required
    field (incl. calendar + time slot) reaches the success state, marked as simulated
  - filters change the visible count; "?demo=error" shows the failure state
  - full-page screenshots at 390 and 1440 (--shots) and gallery previews (--previews)
Exit code 1 if any check fails.
"""
import json, os, re, sys, threading, functools, http.server, socketserver, pathlib, io

os.environ.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = pathlib.Path(os.environ["DIST_DIR"]).resolve() if os.environ.get("DIST_DIR") else ROOT / "dist"
AXE = (ROOT / "tools/node_modules/axe-core/axe.min.js").read_text()
WIDTHS = [375, 390, 768, 1024, 1440]

args = [a for a in sys.argv[1:] if not a.startswith("--")]
SHOTS = None
if "--shots" in sys.argv:
    SHOTS = pathlib.Path(sys.argv[sys.argv.index("--shots") + 1]); SHOTS.mkdir(parents=True, exist_ok=True)
    args = [a for a in args if a != str(SHOTS)]
PREVIEWS = "--previews" in sys.argv

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def serve():
    handler = functools.partial(Quiet, directory=str(DIST))
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, f"http://127.0.0.1:{httpd.server_address[1]}"

FILL_JS = r"""
(step) => {
  const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const done = [];
  step.querySelectorAll('[data-kit-group]').forEach(g => {
    if (!vis(g)) return;
    const hidden = g.querySelector('input[type=hidden]');
    if (hidden) return; // calendars handled separately
    const opts = [...g.querySelectorAll('input:not([disabled])')];
    if (opts.length && !opts.some(o => o.checked)) { opts[0].click(); done.push(g.dataset.kitGroup); }
  });
  step.querySelectorAll('.field input, .field select, .field textarea').forEach(el => {
    if (!vis(el) && el.type !== 'file' && el.type !== 'checkbox') return;
    if (el.closest('[data-kit-group]') && el.closest('[data-kit-group]') !== el.closest('.field')) return;
    if (!el.required) return;
    const set = (v) => { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); };
    if (el.type === 'checkbox') { if (!el.checked) el.click(); }
    else if (el.tagName === 'SELECT') { const o = [...el.options].find(o => o.value); if (o) { el.value = o.value; el.dispatchEvent(new Event('change', {bubbles:true})); } }
    else if (el.type === 'email') set('alex.rivera@example.com');
    else if (el.type === 'tel') set('555 010 1234');
    else if (el.type === 'date') set('1990-04-12');
    else if (el.type === 'number') set(el.min || '1');
    else if (el.type === 'file') {}
    else if (el.pattern) set(el.dataset.sample || '12345');
    else set(el.tagName === 'TEXTAREA' ? 'Sample details for the demo flow test.' : 'Alex Rivera');
    done.push(el.name);
  });
  return done;
}
"""

def check_template(pw_page, base, slug, report):
    tdir = DIST / "t" / slug
    pages = sorted(p.name for p in tdir.glob("*.html"))
    fails = report.setdefault(slug, {"errors": [], "checks": []})
    def fail(msg): fails["errors"].append(msg)
    def ok(msg): fails["checks"].append(msg)
    console = []
    pw_page.on("console", lambda m: console.append(m.text) if m.type == "error" else None)
    pw_page.on("pageerror", lambda e: console.append(str(e)))
    pw_page.on("requestfailed", lambda r: console.append(f"request failed: {r.url}"))

    for name in pages:
        url = f"{base}/t/{slug}/{name}"
        for w in WIDTHS:
            console.clear()
            pw_page.set_viewport_size({"width": w, "height": 900})
            pw_page.goto(url, wait_until="networkidle")
            pw_page.wait_for_timeout(150)
            ov = pw_page.evaluate("() => { const d=document.documentElement; const over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(); if (!(r.right>innerWidth+1) || getComputedStyle(e).position==='fixed' || e.closest('[data-overflow-ok]')) return false; for (let a=e.parentElement; a && a!==document.body; a=a.parentElement) { const ox=getComputedStyle(a).overflowX; if (ox!=='visible' && a.getBoundingClientRect().right<=innerWidth+1) return false; } return true;}).slice(0,3).map(e=>e.tagName.toLowerCase()+'.'+[...e.classList].join('.')); return {sw:d.scrollWidth, iw:innerWidth, over}; }")
            if ov["sw"] > ov["iw"] + 1 or ov["over"]:
                fail(f"{name} @{w}px horizontal overflow (scrollWidth {ov['sw']}): {ov['over']}")
            bad_icons = pw_page.evaluate("() => [...new Set([...document.querySelectorAll('use')].map(u=>u.getAttribute('href')).filter(h=>h && h.startsWith('#') && !document.getElementById(h.slice(1))))]")
            if bad_icons: fail(f"{name} @{w}px missing icons {bad_icons}")
            errs = [c for c in console if "favicon" not in c]
            if errs: fail(f"{name} @{w}px console: {errs[:3]}")
            if w in (390, 1440):
                pw_page.add_script_tag(content=AXE)
                res = pw_page.evaluate("async () => { const r = await axe.run(document, {runOnly:{type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}); return r.violations.map(v=>({id:v.id, impact:v.impact, n:v.nodes.length, sample:v.nodes.slice(0,2).map(n=>n.target.join(' ')+' :: '+(n.failureSummary||'').split('\\n')[1])})) }")
                for v in res: fail(f"{name} @{w}px axe {v['id']} ({v['impact']}, {v['n']} nodes): {v['sample']}")
                if SHOTS:
                    pw_page.screenshot(path=str(SHOTS / f"{slug}--{name[:-5]}--{w}.png"), full_page=True)
    ok(f"{len(pages)} pages × {len(WIDTHS)} widths loaded")

    # Mobile menu keyboard behaviour
    pw_page.set_viewport_size({"width": 390, "height": 800})
    pw_page.goto(f"{base}/t/{slug}/index.html", wait_until="networkidle")
    tog = pw_page.locator(".navbar-toggle")
    tog.focus(); pw_page.keyboard.press("Enter"); pw_page.wait_for_timeout(120)
    opened = pw_page.evaluate("() => document.querySelector('.navbar').dataset.open === 'true' && getComputedStyle(document.querySelector('.navbar-mobile')).display !== 'none'")
    focus_in = pw_page.evaluate("() => !!document.activeElement.closest('.navbar-mobile')")
    pw_page.keyboard.press("Escape"); pw_page.wait_for_timeout(80)
    closed = pw_page.evaluate("() => document.querySelector('.navbar').dataset.open !== 'true' && document.activeElement.classList.contains('navbar-toggle')")
    (ok if (opened and focus_in and closed) else fail)(f"mobile menu keyboard open={opened} focus-in={focus_in} escape-close={closed}")

    # Keyboard focus visibility on the first tab stops
    pw_page.set_viewport_size({"width": 1440, "height": 900})
    pw_page.goto(f"{base}/t/{slug}/index.html", wait_until="networkidle")
    invisible = []
    for _ in range(12):
        pw_page.keyboard.press("Tab")
        r = pw_page.evaluate("() => { const e=document.activeElement; const s=getComputedStyle(e); const vis = s.boxShadow!=='none' || (s.outlineStyle!=='none' && parseFloat(s.outlineWidth)>0); const r=e.getBoundingClientRect(); const hdr=document.querySelector('[data-kit-header]'); return {vis, tag:e.tagName+'.'+e.className, inView:r.bottom>0 && r.top<innerHeight}; }")
        if not r["vis"]: invisible.append(r["tag"])
        if not r["inView"]: invisible.append("offscreen:" + r["tag"])
    (fail if invisible else ok)(f"focus ring visible on first 12 tab stops{': ' + str(invisible[:4]) if invisible else ''}")

    # Conversion flows
    for name in pages:
        pw_page.set_viewport_size({"width": 390, "height": 900})
        pw_page.goto(f"{base}/t/{slug}/{name}", wait_until="networkidle")
        if not pw_page.locator("[data-kit-form]").count(): continue
        form = pw_page.locator("[data-kit-form]").first
        # Empty submit on the first step
        nxt = form.locator("[data-kit-next]")
        if nxt.count() and nxt.is_visible(): nxt.click()
        else:
            # clear required checkbox defaults by submitting directly
            form.locator("[data-kit-submit]").click()
        pw_page.wait_for_timeout(100)
        summary = pw_page.evaluate("() => { const b=document.querySelector('[data-kit-errors]'); return b && !b.hidden ? b.querySelectorAll('li').length : 0 }")
        (ok if summary else fail)(f"{name}: empty submit shows error summary ({summary} errors)")
        for _ in range(8):
            step = form.locator(".k-step:not([hidden])") if form.locator(".k-step").count() else form
            handle = step.first.element_handle()
            pw_page.evaluate(FILL_JS, handle)
            # calendar + slots
            cal = step.first.locator("[data-kit-calendar]")
            if cal.count():
                day = cal.locator(".cal-day:not([aria-disabled=true])").first
                if not day.count():
                    cal.locator("[data-cal=next]").click(); day = cal.locator(".cal-day:not([aria-disabled=true])").first
                day.click(); pw_page.wait_for_timeout(50)
                slot = cal.locator("[data-kit-slots] input:not([disabled])").first
                if slot.count(): slot.check(force=True)
            nxt = form.locator("[data-kit-next]")
            if nxt.count() and nxt.is_visible():
                nxt.click(); pw_page.wait_for_timeout(80)
                errs = pw_page.evaluate("() => { const b=document.querySelector('[data-kit-errors]'); return b && !b.hidden ? [...b.querySelectorAll('li')].map(l=>l.textContent) : [] }")
                if errs: fail(f"{name}: step blocked after auto-fill: {errs}"); break
                continue
            form.locator("[data-kit-submit]").click()
            pw_page.wait_for_timeout(1500)
            break
        st = pw_page.evaluate("() => { const s=document.querySelector('[data-kit-success]'); const e=document.querySelector('[data-kit-errors]'); return {ok: s && !s.hidden, simulated: s && /Simulated/.test(s.textContent), rows: s ? s.querySelectorAll('dt').length : 0, errors: e && !e.hidden ? [...e.querySelectorAll('li')].map(l=>l.textContent) : []} }")
        (ok if st["ok"] and st["simulated"] else fail)(f"{name}: flow reaches simulated success (summary rows {st['rows']}) {st['errors'] or ''}")
        # Failure state
        pw_page.goto(f"{base}/t/{slug}/{name}?demo=error", wait_until="networkidle")
        if pw_page.locator("[data-kit-form] .k-step").count() == 0:
            pw_page.evaluate(FILL_JS, pw_page.locator("[data-kit-form]").first.element_handle())
            pw_page.locator("[data-kit-submit]").first.click(); pw_page.wait_for_timeout(1400)
            failed = pw_page.evaluate("() => !document.querySelector('[data-kit-fail]').hidden")
            (ok if failed else fail)(f"{name}: ?demo=error shows failure state")

    # Filters
    for name in pages:
        pw_page.goto(f"{base}/t/{slug}/{name}", wait_until="networkidle")
        for i in range(pw_page.locator("[data-kit-filter]").count()):
            box = pw_page.locator("[data-kit-filter]").nth(i)
            before = box.locator("[data-kit-count]").inner_text()
            chips = box.locator(".chip[data-filter]")
            if chips.count() > 1:
                chips.nth(1).click(); pw_page.wait_for_timeout(300)
                after = box.locator("[data-kit-count]").inner_text()
                (ok if after and after != before else fail)(f"{name}: filter #{i} chip changes count ({before} → {after})")

    if PREVIEWS:
        from PIL import Image
        pw_page.set_viewport_size({"width": 1440, "height": 1080})
        pw_page.goto(f"{base}/t/{slug}/index.html", wait_until="networkidle")
        pw_page.evaluate("() => { const k=document.querySelector('.k-kitbar'); if (k) k.remove(); }")
        png = pw_page.screenshot()
        (ROOT / "previews").mkdir(exist_ok=True)
        Image.open(io.BytesIO(png)).convert("RGB").resize((720, 540), Image.LANCZOS).save(ROOT / "previews" / f"{slug}.webp", "WEBP", quality=82)
        ok("preview captured")

def main():
    httpd, base = serve()
    slugs = args or sorted(p.name for p in (DIST / "t").iterdir() if p.is_dir())
    report = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        for slug in slugs:
            ctx = b.new_context(reduced_motion="reduce")
            page = ctx.new_page()
            try: check_template(page, base, slug, report)
            except Exception as e: report.setdefault(slug, {"errors": [], "checks": []})["errors"].append(f"verifier crashed: {e}")
            ctx.close()
        # Gallery
        ctx = b.new_context(); page = ctx.new_page()
        for w in WIDTHS:
            page.set_viewport_size({"width": w, "height": 900}); page.goto(f"{base}/index.html", wait_until="networkidle")
            sw = page.evaluate("() => document.documentElement.scrollWidth")
            if sw > w + 1: report.setdefault("gallery", {"errors": [], "checks": []})["errors"].append(f"gallery @{w}px overflow {sw}")
        page.add_script_tag(content=AXE)
        res = page.evaluate("async () => (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id+': '+v.nodes.slice(0,2).map(n=>n.target.join(' ')).join(', '))")
        g = report.setdefault("gallery", {"errors": [], "checks": []}); g["errors"] += [f"axe {r}" for r in res]
        if SHOTS: page.set_viewport_size({"width": 1440, "height": 900}); page.screenshot(path=str(SHOTS / "gallery--1440.png"), full_page=True)
        b.close()
    httpd.shutdown()
    bad = 0
    for slug, r in report.items():
        status = "PASS" if not r["errors"] else "FAIL"
        bad += bool(r["errors"])
        print(f"\n[{status}] {slug}")
        for c in r["checks"]: print(f"   ✓ {c}")
        for e in r["errors"]: print(f"   ✗ {e}")
    (ROOT / "tools/last-report.json").write_text(json.dumps(report, indent=2))
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
