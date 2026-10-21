# Facet UI on Gumroad: listing kit

Copy-paste text and settings for the Gumroad product page. The images are in this folder.

## 1. Product basics

| Field | Value |
|---|---|
| Type | Digital product |
| Name | Facet UI: Design System & Dashboard UI Kit for Figma |
| URL slug | `facet-ui` |
| Cover images (in order) | `01-cover.png`, `02-highlights.png`, `03-templates.png`, `04-thank-you.png` (1920×1080) |
| Thumbnail | `05-thumbnail-square.png` (1200×1200) |
| Description image | `facet-ui-gumroad-long.png` (optional, 1280 wide) |
| Live preview link | https://facetui.vercel.app |

## 2. Versions (pricing tiers)

Create these as **Versions** on one product, so each buyer gets one license key whatever tier they pick. The prices are suggestions; change them to suit you.

| Version | Suggested price | Who it's for |
|---|---|---|
| Personal | $49 | One designer or developer, personal and client work, unlimited projects |
| Commercial | $99 | One designer or developer, use in commercial products and SaaS sold to end users |
| Team | $249 | Up to 10 people in one company, all Commercial rights |

Version descriptions (paste into each version):

- **Personal:** 1 seat. Use Facet UI in unlimited personal and client projects. No resale or redistribution.
- **Commercial:** 1 seat. Everything in Personal, plus use in commercial products, SaaS and apps you sell. No resale or redistribution.
- **Team:** Up to 10 seats in one company. Everything in Commercial, shared in your team's Figma workspace.

## 3. Summary (the one-liner under the title)

> 158 Figma components with Variables, every standard product-UI component, 10 app templates, light & dark, 6 brand colors and matching HTML/CSS + React code.

## 4. Description

Paste this into the description editor. Use the editor's heading and list buttons for the `##` and `-` lines.

```
Facet UI is a complete design system and dashboard UI kit for Figma, with code that matches it one to one.

Every color, space, radius and text style is a Figma Variable. Switch brand, light/dark and density in one click, and hand off exact CSS variable names to developers.

Live preview: https://facetui.vercel.app

## What's inside

- 158 components, 105 variant sets and 622 variants, all built with Variables and Auto Layout
- Every standard product-UI component, including the new chat and agent components: Bubble, Message Scroller, Marker, Questionnaire and Trace
- 10 app templates, 26 screens, desktop and mobile (CRM, finance, analytics, settings, auth and more)
- Light & Dark modes, 6 brand colors and 4 style themes (Default, Soft, Glass, Mono)
- Comfortable and Compact density
- 147 Lucide icons as components
- 23 ready-made patterns and 2 clickable prototype flows
- Charts: area, bar, line, composed, pie, radar, radial and sparkline

## Code included

- HTML/CSS reference implementation of 109 components with working behaviour
- Design tokens as CSS variables, JSON and a Tailwind preset that maps standard semantic class names to Facet tokens
- 6 AI agent demos (chain of thought, tool calls, approvals)

## Requirements

- Figma (Professional plan or higher for variable modes)
- Mona Sans font (free, Google Fonts)

## How you get the Figma file

After you buy, Gumroad emails you a license key. Enter it at https://etkits.vercel.app/claim to open your copy of the Figma file. The download includes the code, tokens and a Start Here guide.

## License

Personal, Commercial and Team licenses. No resale or redistribution of the kit or its parts. See LICENSE.md in the download.
```

## 5. Tags

`figma`, `ui kit`, `design system`, `dashboard`, `react`, `figma variables`, `saas`, `admin template`, `tailwind`, `components`

## 6. Content (what the buyer gets)

- Upload `FacetUI-v1.3.zip` as the product file.
- **Settings → Generate a unique license key per sale: on.** The claim page checks this key.
- Leave "Allow customers to choose a quantity" off.

## 7. Receipt / thank-you message

```
Thanks for buying Facet UI!

1. Open https://etkits.vercel.app/claim
2. Enter your license key (it's in this email) and press Unlock.
3. Open the Figma file and choose "Duplicate" to save it to your drafts.

Your key can be claimed up to 3 times. Need help? Reply to this email.
```

## 8. Before you publish

1. In Figma, set the master file's sharing to **Only people invited** and make a sale copy that buyers duplicate. Copy its link.
2. Publish the Gumroad product once (it can be unlisted) and copy its **product ID** from the content page, next to the license key setting.
3. Add these to the `et-uikits` Vercel project (Settings → Environment Variables), then redeploy:
   - `GUMROAD_PRODUCT_ID`: the product ID from step 2
   - `FIGMA_DELIVERY_URL`: the sale-copy link from step 1
   - `DOWNLOAD_URL`: optional, a link to the code download
4. Test with a 100% discount code: buy it, then claim the key at https://etkits.vercel.app/claim.
5. Add the product link to `ETKITS_STORES` on the ETKits site so the "Available on" button points to it.
