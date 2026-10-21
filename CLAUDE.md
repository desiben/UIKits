# Branch rules

- `main` is reserved for the ETKits marketing landing page (`index.html`, `assets/`, `kits/<id>/` showreel media). Do not put kit source content on `main`.
- Each UI kit lives on its own branch. All Facet UI work is committed and pushed to the `FacetUI` branch.
- To showcase a new kit, follow "Adding a kit" in README.md.
- Never link a kit's Figma source file or this (private) repo from the site. Store links live in `ETKITS_STORES` in `assets/kits.js`.
- Figma delivery links live only in Vercel environment variables, returned by `api/claim.js` after a license check. Never hardcode them.
- ETKits is the license hub for every product (`api/_lib/licenses.js`, `api/licenses/verify.js`, dashboard at `/admin`). Product sites ask the hub; they don't keep their own license records.
