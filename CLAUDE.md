# Repository layout

- Facet UI source lives in `main/kits/facetui` per the owner’s migration request. The former `FacetUI` branch is retained for history.
- Root files contain the ETKits storefront and license hub. `build-storefront.mjs` copies only public storefront files and approved showcase media; never publish the full repository.
- Other kits retain their existing branch arrangement.
- Never expose master Figma links or private repository links on public pages. Delivery links belong in server-side environment variables and are returned only after license verification.
