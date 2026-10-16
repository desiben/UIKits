# ET-UIKits

<sub>by ELTouch apps</sub>

The marketing site for ET-UIKits, the ELTouch apps UI kit collection. The first product is Facet UI. Open `index.html` in a browser, or deploy the repo root as a static site; no build step.

## Kits

| Kit | Branch | Live |
|---|---|---|
| **Facet UI** v1.2 | [`FacetUI`](https://github.com/desiben/UIKits/tree/FacetUI) | [facetui.vercel.app](https://facetui.vercel.app) |

## How this repo is organized

- **`main`** holds only the ET-UIKits landing page: `index.html`, `assets/`, and one showreel per kit in `kits/<id>/` (a poster image and a short muted reel).
- **Each kit has its own branch** holding all of its content: Figma notes, tokens, style guide, marketing and so on. Facet UI lives on [`FacetUI`](https://github.com/desiben/UIKits/tree/FacetUI), and all Facet UI changes are pushed there, never to `main`.

## Adding a kit

1. Create a branch named after the kit and put the kit's content there.
2. On `main`, add `kits/<id>/` with a poster (`.jpg`, 16:9) and a short reel (`.webm`, plus `.mp4` for older Safari).
3. Add an entry to `window.UIKITS` in [`assets/kits.js`](assets/kits.js), and lower `UIKITS_COMING_SOON` if you want fewer placeholder tiles.
4. Add a row to the table above.

## Credits

Mona Sans by GitHub, under the SIL Open Font License ([`assets/fonts/MONA-SANS-OFL.txt`](assets/fonts/MONA-SANS-OFL.txt)).
