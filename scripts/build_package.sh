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
cp "$ROOT/START-HERE.md" "$ROOT/LICENSE.md" "$ROOT/CHANGELOG.md" "$ROOT/THIRD_PARTY_NOTICES.md" "$PKG/"
cp "$ROOT/figma/README.md" "$PKG/figma/"
cp -r "$ROOT/tokens" "$ROOT/styleguide" "$PKG/"
rm -rf "$PKG/styleguide/marketing" "$PKG/styleguide/assets/src" "$PKG/styleguide/api" "$PKG/styleguide/vercel.json"
# Animated React components (source); buyers can also install them with the shadcn CLI.
mkdir -p "$PKG/react" && (cd "$ROOT/react" && tar --exclude=node_modules --exclude=.smoke -cf - .) | (cd "$PKG/react" && tar -xf -)
# Turn links to the private repo into plain file names.
python3 - "$PKG/CHANGELOG.md" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
open(p, "w").write(re.sub(r'\[`([^`]+)`\]\(https://github\.com/desiben/[^)]+\)', r'`\1`', s))
PY
if grep -rIl "github.com/desiben\|figma.com/design\|figma.com/file" "$PKG"; then echo "private link found, aborting" >&2; exit 1; fi
(cd "$OUT" && zip -qr "FacetUI-v$V.zip" "FacetUI-v$V")
echo "built $OUT/FacetUI-v$V.zip"
