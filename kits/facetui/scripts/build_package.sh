#!/bin/sh
# Build the buyer download (code, tokens, docs; the Figma file is delivered via the claim page).
#   sh scripts/build_package.sh 1.3   → dist/FacetUI-v1.3.zip
# Leaves out seller-only material: README.md, marketing/, styleguide/marketing and private repo links.
set -e
V="${1:?usage: build_package.sh <version>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist"; PKG="$OUT/FacetUI-v$V"
rm -rf "$PKG" "$PKG.zip"; mkdir -p "$PKG/figma"
sh "$ROOT/scripts/build_assets.sh"
node "$ROOT/scripts/build_llms.mjs"
cp "$ROOT/START-HERE.md" "$ROOT/LICENSE.md" "$ROOT/CHANGELOG.md" "$ROOT/THIRD_PARTY_NOTICES.md" "$ROOT/FACETUI-LLMS.md" "$PKG/"
cp "$ROOT/figma/README.md" "$PKG/figma/"
cp -r "$ROOT/tokens" "$ROOT/styleguide" "$PKG/"
rm -rf "$PKG/styleguide/marketing" "$PKG/styleguide/assets/src" "$PKG/styleguide/api" "$PKG/styleguide/vercel.json" \
  "$PKG/styleguide/node_modules" "$PKG/styleguide/public-build" "$PKG/styleguide/package.json" "$PKG/styleguide/package-lock.json" "$PKG/styleguide/build-public.mjs"
# The buyer's copy of the style guide shows all code offline: license.js treats window.FACET_BUYER as unlocked.
python3 - "$ROOT/react/registry/docs-snippets.json" "$PKG/styleguide" <<'PY'
import json, sys, os
snippets, site = sys.argv[1], sys.argv[2]
data = json.load(open(snippets))
open(os.path.join(site, "assets/buyer.js"), "w").write("/* Facet UI buyer copy: unlocks the code in this style guide. */\nwindow.FACET_BUYER = " + json.dumps(data) + ";\n")
for page, src in (("index.html", "assets/buyer.js"), ("templates/index.html", "../assets/buyer.js")):
    f = os.path.join(site, page); s = open(f).read()
    lic = src.replace("buyer.js", "license.js")
    assert lic in s, f
    s = s.replace('<script src="%s"></script>' % lic, '<script src="%s"></script>\n<script src="%s"></script>' % (src, lic), 1)
    open(f, "w").write(s)
PY
# Animated React components (source); buyers can also install them with the facetui CLI.
mkdir -p "$PKG/react" && (cd "$ROOT/react" && tar --exclude=node_modules --exclude=.smoke -cf - .) | (cd "$PKG/react" && tar -xf -)
# Turn links to the private repo into plain file names.
python3 - "$PKG/CHANGELOG.md" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
open(p, "w").write(re.sub(r'\[`([^`]+)`\]\(https://github\.com/desiben/[^)]+\)', r'`\1`', s))
PY
# The style guide's Changelog page reads CHANGELOG.md next to index.html.
cp "$PKG/CHANGELOG.md" "$PKG/styleguide/CHANGELOG.md"
if grep -rIl "github.com/desiben\|figma.com/design\|figma.com/file" "$PKG"; then echo "private link found, aborting" >&2; exit 1; fi
(cd "$OUT" && zip -qr "FacetUI-v$V.zip" "FacetUI-v$V")
echo "built $OUT/FacetUI-v$V.zip"
