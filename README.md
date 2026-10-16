# ETKits

<sub>by ELTouch apps</sub>

The storefront and marketing site for ETKits, the ELTouch apps UI kit collection. The first product is **Facet UI**.

Live: **[etkits.vercel.app](https://etkits.vercel.app)**. It is a static site with no build step: open `index.html` in a browser, or serve the repo root.

## Kits

| Kit | Branch | Live preview | Buy |
|---|---|---|---|
| **Facet UI** v1.2 | [`FacetUI`](https://github.com/desiben/UIKits/tree/FacetUI) | [facetui.vercel.app](https://facetui.vercel.app) | Gumroad (set `ETKITS_BUY_URL`) |

## What's on the page

Styled after HeroUI Pro, with a light, dark and system theme switch in the top-right corner (the choice is saved per browser).

- **Hero:** two-tone headline, a gray stage with the Facet UI showreel and floating cards, and preview tabs (Showreel, Themes, Mobile, Handoff).
- **Logo row:** *placeholder* sample brands. Replace them with real customer logos (search `index.html` for `PLACEHOLDER LOGOS`).
- **Kits:** cards rendered from [`assets/kits.js`](assets/kits.js); hover plays the reel, click opens it full size.
- **Features**, **Templates** (segmented switcher), **Get Facet UI** (the three layers) and **FAQ**.

## Selling: keep the kit behind the purchase

- **Buy buttons:** set the Gumroad product URL once, in `window.ETKITS_BUY_URL` in [`assets/kits.js`](assets/kits.js). Until it is set, buy buttons scroll to the `#get` section.
- **Never link the Figma source file or this repo** from the site. Buyers get the Figma file, tokens and code through Gumroad after purchase.
- The public live preview (facetui.vercel.app) is a demo; anything it serves can be saved from a browser.

Gumroad listing images for Facet UI (cover, highlights, templates, thank-you, square thumbnail, long description) live on the `FacetUI` branch in [`marketing/gumroad/`](https://github.com/desiben/UIKits/tree/FacetUI/marketing/gumroad).

## How this repo is organized

- **`main`** holds only the ETKits site: `index.html`, `assets/` and one showreel per kit in `kits/<id>/` (a poster, a short muted reel and a few preview images).
- **Each kit has its own branch** holding all of its content: Figma notes, tokens, style guide, marketing and so on. Facet UI lives on [`FacetUI`](https://github.com/desiben/UIKits/tree/FacetUI), and all Facet UI changes are pushed there, never to `main`.
- The repo is **private**. Keep it that way: it contains the full kits.

## Deployment

| Site | Vercel project | Production branch |
|---|---|---|
| etkits.vercel.app | `et-uikits` | `main` |
| facetui.vercel.app | `facetui` | `FacetUI` (root directory `styleguide`) |

## Adding a kit

1. Create a branch named after the kit and put the kit's content there.
2. On `main`, add `kits/<id>/` with a poster (`.jpg`, 16:9) and a short reel (`.webm`, plus `.mp4` for older Safari).
3. Add an entry to `window.UIKITS` in [`assets/kits.js`](assets/kits.js) (use `buy: true` for the purchase link, never a Figma or repo link), and lower `UIKITS_COMING_SOON` if you want fewer placeholder tiles.
4. Add a row to the table above.

## Credits

Inter by Rasmus Andersson, loaded from Google Fonts under the SIL Open Font License.
