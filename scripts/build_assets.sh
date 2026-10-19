#!/bin/sh
# Rebuild styleguide/assets/facet.css and facet.js from their parts.
cd "$(dirname "$0")/../styleguide/assets/src" || exit 1
cat base.css v12-a.css v12-b.css v13.css v12-themes.css > ../facet.css
cat base.js facet-v12.js v13.js > ../facet.js
echo "facet.css + facet.js rebuilt"
