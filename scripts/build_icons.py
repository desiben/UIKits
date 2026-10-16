"""Rebuild styleguide/assets/icons.js: keeps every existing symbol and adds Lucide icons by name.
Usage: python3 scripts/build_icons.py <path-to-lucide-static/icons> name1 name2 ...  (Lucide v0.460.0, ISC)"""
import re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(ROOT, "styleguide/assets/icons.js")
src = open(JS).read()
syms = dict(re.findall(r'<symbol id="([^"]+)" viewBox="0 0 24 24">(.*?)</symbol>', src))
order = list(syms)
lib, names = sys.argv[1], sys.argv[2:]
for n in names:
    if n in syms: continue
    svg = open(os.path.join(lib, n + ".svg")).read()
    inner = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
    inner = re.sub(r"\s*\n\s*", " ", inner).strip()
    syms[n] = inner; order.append(n)
sprite = "".join(f'<symbol id="{n}" viewBox="0 0 24 24">{syms[n]}</symbol>' for n in order)
out = ('/* Facet UI icon sprite — Lucide v0.460.0 (ISC License, https://lucide.dev). Injected at runtime so <use href="#name"> works everywhere, including file:// */\n'
       "(function(){var s='<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display:none\" aria-hidden=\"true\">" + sprite.replace("'", "\\'") + "</svg>';"
       'var d=document.createElement("div");d.innerHTML=s;var ins=function(){document.body.insertBefore(d.firstChild,document.body.firstChild)};if(document.body)ins();else document.addEventListener("DOMContentLoaded",ins);'
       "window.FACET_ICONS=" + "[" + ",".join(f'"{n}"' for n in order) + "];})();\n")
open(JS, "w").write(out)
print(len(order), "icons")
