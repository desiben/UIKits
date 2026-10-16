# ETKits

<sub>by ELTouch apps</sub>

The storefront and marketing site for ETKits, the ELTouch apps UI kit collection. The first product is **Facet UI**.

Live: **[etkits.vercel.app](https://etkits.vercel.app)**. It is a static site with no build step: open `index.html` in a browser, or serve the repo root.

## Kits

| Kit | Branch | Live preview | Stores |
|---|---|---|---|
| **Facet UI** v1.2 | [`FacetUI`](https://github.com/desiben/UIKits/tree/FacetUI) | [facetui.vercel.app](https://facetui.vercel.app) | Gumroad, Envato Market, UI8 (set in `ETKITS_STORES`) |

## What's on the page

Styled after HeroUI Pro, with a light, dark and system theme switch in the top-right corner (the choice is saved per browser).

- **Hero:** two-tone headline, a gray stage with the Facet UI showreel and floating cards, and preview tabs (Showreel, Themes, Mobile, Handoff).
- **Logo row:** *placeholder* sample brands. Replace them with real customer logos (search `index.html` for `PLACEHOLDER LOGOS`).
- **Kits:** cards rendered from [`assets/kits.js`](assets/kits.js); hover plays the reel, click opens it full size.
- **Features**, **Templates** (segmented switcher), **Get Facet UI** (the three layers) and **FAQ**.

## Selling: keep the kit behind the purchase

- **Stores and buy buttons:** set each store's product URL in `window.ETKITS_STORES` in [`assets/kits.js`](assets/kits.js). The "Available on" row shows every store (those without a URL say "Coming soon"), and every "Buy" button uses the first store that has a URL. Until one is set, buy buttons scroll to the `#get` section.
- **Never link the Figma source file or this repo** from the site. Buyers unlock the Figma file on the claim page (below) after purchase.
- The public live preview (facetui.vercel.app) is a demo; anything it serves can be saved from a browser.

### License check: the claim page

Buyers never see a Figma link until their purchase is verified:

| Store | What the buyer gets | Verified by `api/claim.js` |
|---|---|---|
| **Gumroad** | A unique **license key** per sale | Gumroad license API. Refunded, charged-back and disputed sales are rejected; each key can be claimed `CLAIM_MAX_USES` times. |
| **Envato Market** | A unique **purchase code** per sale (a UUID) | Envato author API (`/v3/market/author/sale`), only for your own item IDs. |
| **UI8** | Files from their UI8 downloads | Not needed: UI8 has no public verification API and delivers the files itself. |

1. The buyer enters their purchase code at **[etkits.vercel.app/claim](https://etkits.vercel.app/claim)** (`claim.html`, hidden from search engines). The function tells Gumroad keys and Envato codes apart by their format.
2. [`api/claim.js`](api/claim.js), a Vercel function, verifies it with the right store and only for a valid purchase returns the Figma link (and optional download link) from private environment variables.

**Setup (once per kit):**

1. **Gumroad:** open the product → **Content** → enable **Generate a unique license key per sale**, and copy the **product ID** shown there. **Envato:** once the item is approved, note its item ID (in the item URL) and create a personal token at [build.envato.com](https://build.envato.com/create-token/) with the *View your items' sales history* permission.
2. In Figma, make a *sale copy* of the kit, share it as view-only with copying allowed only via its duplicate link, and copy that link. Keep the master file as *Only people invited*.
3. In Vercel → project **et-uikits** → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `GUMROAD_PRODUCT_ID` | the Gumroad product ID from step 1 |
| `ENVATO_TOKEN` | the Envato personal token from step 1 |
| `ENVATO_ITEM_ID` | the Envato item ID (comma-separate several) |
| `FIGMA_DELIVERY_URL` | the Figma duplicate link from step 2 |
| `FIGMA_DELIVERY_URL_GUMROAD`, `FIGMA_DELIVERY_URL_ENVATO` | optional: a separate sale copy per store, so a leak can be traced and swapped per store |
| `DOWNLOAD_URL` | optional: link to the code + tokens zip |
| `CLAIM_MAX_USES` | optional: claims per key (default 3) |

4. Redeploy. Until a store's variables are set, the claim page answers "Claiming for … purchases is not set up yet".

In the Gumroad receipt and the Envato item description, tell buyers: *"Unlock the Figma file at etkits.vercel.app/claim with your purchase code."* (Gumroad calls it a license key; buyers paste it in the same box.) If a link ever leaks, make a new sale copy and update `FIGMA_DELIVERY_URL`; the old link stops being handed out immediately.

Listing images for each store (Gumroad, UI8, Envato) live on the `FacetUI` branch in [`marketing/listings/`](https://github.com/desiben/UIKits/tree/FacetUI/marketing/listings).

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
