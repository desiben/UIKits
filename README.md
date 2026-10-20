<div align="center">

# Facet UI

<sub>by ELTouch apps</sub>

**A token-driven design system: a Figma library, design tokens and a framework-agnostic HTML/CSS/JS implementation.**

It follows shadcn/ui's component model and naming but has its own visual language: the *Facet cut* and the *signal rail*.

**[Live style guide](https://facetui.vercel.app)** · **[Marketing kit](https://facetui.vercel.app/marketing/)** · **[Buy on ETKits](https://etkits.vercel.app/#get)** · Figma file (delivered with purchase) · [▶ Demo video](https://github.com/desiben/UIKits/blob/FacetUI/facet-micro-interactions.mp4) · [Marketplace previews](https://github.com/desiben/UIKits/tree/FacetUI/FacetUI-marketplace-previews) · [Tokens](tokens/) · [Examples](https://facetui.vercel.app/#/examples) · [Changelog](CHANGELOG.md)

![Facet UI — the design system with an edge](styleguide/marketing/media/facet-ui-hero.jpg)

</div>

---

## What's new in v1.3

- **Full shadcn/ui coverage.** Every component in the shadcn/ui list now has a Facet counterpart in Figma and in the style guide.
- **17 new style-guide components:** Aspect Ratio, Button Group, Input Group, Label, Collapsible, Scroll Area, Sonner (stacked toasts), Bubble, Marker, Message Scroller, Questionnaire, Trace, Combobox, Select, Textarea, Menubar and Navigation Menu.
- **13 new Figma variant sets (57 variants)** on the Components page, plus a composed Trace: Label, Button Group, Input Group, Q Option, Questionnaire, Aspect Ratio, Collapsible, Scroll Area, Sonner, Bubble, Marker, Trace Item and Message Scroller. All are bound to Facet variables and text styles, and built from existing Button, Icon Button, Input, Kbd and Badge instances.
- **`Facet.sonner()`** for stacked toasts, with types, actions and `Facet.sonner.promise()`.

## What's new in v1.2

- **56 new components** across Charts, Data display, AI, Feedback, Forms, Layout, Navigation and Overlays — built in Figma (Variables, variants) and live on the site with a **Desktop / Mobile preview toggle** on every example.
- **Charts** — `assets/charts.js` renders area, line, bar, composed, pie, radar, radial and sparkline charts from `data-chart` JSON, with tooltips and auto re-render on resize and theme change.
- **Style themes** — Default, Soft, Glass and Mono (`html[data-style]`, `Facet.theme.setStyle()`), stacked on top of the 6 brand colors and light/dark. In Figma they live in the **Style** collection.
- **AI agents** — 6 working demos at [`/#/agents`](https://facetui.vercel.app/#/agents) (Banking, Commerce ops, Travel, Email, Health, Support): chain of thought, tool calls, generative UI and approvals that really change the app.
- **Components overview** at [`/#/components`](https://facetui.vercel.app/#/components) with live previews, search and **Copy Markdown** for AI coding tools.

## Table of contents

1. [What is Facet UI?](#what-is-facet-ui)
2. [What's in this repository](#whats-in-this-repository)
3. [Quick start](#quick-start)
4. [The living style guide](#the-living-style-guide)
5. [Theming: change purple to any color](#theming-change-purple-to-any-color)
6. [Motion & micro-interactions](#motion--micro-interactions)
7. [Marketplace previews](#marketplace-previews)
8. [Marketing kit: videos & images](#marketing-kit-videos--images)
9. [Selling on Gumroad, Envato and UI8](#selling-on-gumroad-envato-and-ui8)
10. [Design tokens](#design-tokens)
11. [Using Facet with Tailwind CSS and shadcn/ui](#using-facet-with-tailwind-css-and-shadcnui)
12. [Components](#components)
13. [Example pages](#example-pages)
14. [The Figma file](#the-figma-file)
15. [Accessibility](#accessibility)
16. [Browser support](#browser-support)
17. [Regenerating tokens](#regenerating-tokens)
18. [Project structure](#project-structure)
19. [Known limitations](#known-limitations)
20. [Credits and licenses](#credits-and-licenses)

---

## What is Facet UI?

Facet UI is a UI kit for building SaaS products, dashboards, admin tools and AI apps. It has three layers that stay in sync:

| Layer | What it is | Who uses it |
|---|---|---|
| **Figma library** | 9 pages, 158 components (105 variant sets, 622 variants), 147 icons, 4 style themes, 23 patterns, 10 app templates (26 screens), prototype flows and documentation | Designers |
| **Design tokens** | 246 Figma variables exported as CSS custom properties, W3C DTCG JSON and a Tailwind preset | Designers and developers |
| **Living style guide** | A dependency-free HTML/CSS/JS reference implementation with live previews, copy-paste code and a theme studio | Developers |

**Highlights**

- **6 brand themes × light/dark × 2 densities.** Switch with a data attribute, or generate a brand from **any color** in one line of JS.
- **Token-only components.** Every color, space, radius and text style is a variable. A QA pass on the Figma file found 0 hard-coded fills and 0 unstyled text in the components.
- **A familiar API.** Component names, anatomy and props mirror shadcn/ui, so each Figma component maps to a React component.
- **One typeface.** Mona Sans (SIL OFL) in weights 400/500/600, with 25 text styles.
- **Signature components.** Command palette with AI scope, prompt composer, AI copilot panel, kanban, workflow builder, resource planner, filter builder and activity timeline.

---

## What's in this repository

```
.
├── README.md                    ← you are here
├── CHANGELOG.md
├── THIRD_PARTY_NOTICES.md
├── facet-micro-interactions.mp4 ← 20-second motion demo
├── FacetUI-marketplace-previews/ ← 8 marketplace images, 1920×1080
├── tokens/
│   ├── tokens.css               ← CSS custom properties (all themes, brands, densities)
│   ├── facet.tokens.json        ← W3C Design Tokens (DTCG) format
│   ├── tailwind.preset.js       ← Tailwind / shadcn/ui preset
│   └── source/                  ← raw exports used to generate the files above
├── styleguide/
│   ├── index.html               ← the living style guide (open this)
│   ├── assets/
│   │   ├── tokens.css           ← copy of tokens/tokens.css
│   │   ├── facet.css            ← component styles
│   │   ├── facet.js             ← theming API + interactive behaviours
│   │   ├── motion.css / motion.js ← micro-interactions (hover, press, spring, reveal)
│   │   ├── icons.js             ← Lucide icon sprite (89 icons)
│   │   ├── docs.css / docs.js   ← style guide chrome (not needed in your app)
│   │   ├── registry.js          ← component docs data (examples, API, a11y)
│   │   └── tokens-meta.js       ← token metadata for the docs pages
│   └── examples/                ← full pages: dashboard, login, settings
├── scripts/
│   ├── build_tokens.py          ← regenerates tokens + style guide assets
│   ├── generate_palette.py      ← OKLCH palette generator (with contrast checks)
│   └── render_listing_images.js ← renders marketing/listings/*
├── marketing/
│   ├── src/                     ← sources for the marketing videos and images
│   └── listings/                ← listing images for Gumroad, UI8 and Envato
├── figma/
│   └── README.md                ← page-by-page guide to the Figma file
└── docs/images/                 ← screenshots used in this README
```

---

## Quick start

### 1. Browse the style guide

There's no build step. Serve the folder with any static server:

```bash
git clone https://github.com/desiben/UIKits.git
cd UIKits/styleguide
python3 -m http.server 8000      # or: npx serve .
# open http://localhost:8000
```

> Opening `index.html` straight from disk (`file://`) also works. A local server is better because the example pages load inside iframes.

### 2. Use Facet in your own HTML

Copy `styleguide/assets/tokens.css`, `facet.css`, `motion.css`, `facet.js`, `motion.js` and `icons.js` into your project:

```html
<!doctype html>
<html lang="en" data-theme="light" data-brand="iris" data-density="comfortable">
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/tokens.css">
  <link rel="stylesheet" href="assets/facet.css">
  <link rel="stylesheet" href="assets/motion.css">   <!-- optional: micro-interactions -->
  <script src="assets/icons.js"></script>
  <script src="assets/facet.js"></script>
  <script src="assets/motion.js"></script>          <!-- optional: cursor-aware effects -->
</head>
<body>
  <button class="btn"><svg class="icon"><use href="#plus"/></svg> New project</button>
  <button class="btn btn-outline">Cancel</button>
</body>
</html>
```

Every component page in the style guide has a **Copy HTML** button. The copied markup is exactly what the preview renders.

---

## The living style guide

**Live at [facetui.vercel.app](https://facetui.vercel.app)** (deployed automatically by Vercel from the `FacetUI` branch, root directory `styleguide`; in the **facetui** Vercel project, Production Branch must be set to `FacetUI`). It is a public preview, so it never links the Figma source file or the private repo.

`styleguide/index.html` is a documentation site in the style of [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components), built with Facet itself.

![Style guide — Button](docs/images/styleguide-button.png)

| Feature | Details |
|---|---|
| **Sidebar navigation** | Getting started, Foundations, 30 component pages grouped by category, Examples |
| **Live previews** | Each example has Preview and HTML tabs and a one-click copy button |
| **React mapping** | Each component shows its shadcn/ui React equivalent |
| **API tables** | Classes, attributes and JS hooks for every component |
| **Accessibility notes** | Per-component guidance |
| **⌘K / Ctrl K search** | Command palette to jump to any page or toggle the theme |
| **Theme controls** | Brand picker, density toggle and light/dark switch in the header; persisted per browser |
| **Brand colors studio** | Pick any color, see the generated ramp and contrast ratios, copy the CSS |
| **Motion** | Micro-interactions on every component, plus a Motion guide page and a ⚡ on/off toggle |
| **Showcase** | The marketplace previews and the demo video, on the [Showcase page](https://facetui.vercel.app/#/showcase) |
| **Responsive** | Works down to 390 px (the sidebar becomes a drawer) |

---

## Theming: change purple to any color

Purple (**Iris**) is only the default. Every component reads `--brand-50 … --brand-950` through semantic tokens, so changing the brand recolors buttons, focus rings, selection, links, charts and the signal rail at once.

![Brand color studio](docs/images/styleguide-brand-colors.png)

### Option A: built-in presets (no JS)

```html
<html data-brand="iris">     <!-- #5d4ff3 · default -->
<html data-brand="ember">    <!-- #be4000 -->
<html data-brand="lagoon">   <!-- #00817c -->
<html data-brand="rose">     <!-- #c02b6c -->
<html data-brand="cobalt">   <!-- #0072c5 -->
<html data-brand="forest">   <!-- #00864c -->
```

Attributes also work on any subtree, so you can mix brands on one page:

```html
<section data-brand="ember" data-theme="dark"> … </section>
```

![Six brands, same markup](docs/images/styleguide-brand-gallery.png)

### Option B: any color, generated at runtime

```js
Facet.theme.setCustomBrand("#ff5a1f");          // whole page
Facet.theme.setCustomBrand("#7c3aed", element); // one subtree
```

The generator converts your color to OKLCH, keeps its hue and chroma, and builds an 11-step ramp on the same lightness curve as the built-in palettes. It then checks accessibility: if `brand-600` is below **4.5:1** against white, or `brand-700` is below **6:1**, it darkens those steps until they pass. Primary buttons and links stay WCAG AA whatever color you choose. It works for greys too (`#111827` produces a neutral graphite brand).

### Option C: generate CSS once and ship it statically

```js
console.log(Facet.theme.cssFor("#ff5a1f", "acme"));
```

```css
[data-brand="acme"] {
  --brand-50:  #fff4f1;
  --brand-100: #fee7e0;
  /* … */
  --brand-600: #c13b02;
  --brand-950: #320900;
}
```

Paste the output into your stylesheet and use `<html data-brand="acme">`.

### Option D: in Figma

1. Select a frame (or the page), then go to the right sidebar → **Layer → Variable modes → Brand** and pick Iris, Ember, Lagoon, Rose, Cobalt or Forest.
2. To add your own brand: **Variables → Primitives**, add a 50–950 ramp. Then **Brand → + new mode** and alias `brand/50…950` to the new ramp.
3. See **02 — Design Tokens → "Change the brand color in one click"** for all six modes side by side.

![Brand modes in Figma](docs/images/figma-brand-colors.png)

### Other theme axes

```js
Facet.theme.setMode("dark");          // light | dark
Facet.theme.setDensity("compact");    // comfortable | compact
Facet.theme.setBrand("lagoon");       // preset, clears any custom color
Facet.theme.get();                    // { mode, brand, density, custom }
document.addEventListener("facet:theme", (e) => console.log(e.detail));
```

Choices are saved in `localStorage` (key `facet-theme`) and restored on load.

![Dashboard in Lagoon + dark](docs/images/example-dashboard-dark-lagoon.png)

---

## Motion & micro-interactions

Every component reacts to the cursor with a small, springy motion, in the spirit of Kokonut UI, Motion and Animate UI. It's fast enough to feel instant and soft enough to feel alive. The effects come from two optional, dependency-free files: `motion.css` (CSS-only effects) and `motion.js` (cursor-aware effects).

**▶ [Watch the 20-second demo](https://github.com/desiben/UIKits/blob/FacetUI/facet-micro-interactions.mp4)**. You can also see it on the [live Showcase page](https://facetui.vercel.app/#/showcase), or try every effect yourself on the [Motion page](https://facetui.vercel.app/#/motion).

![Micro-interactions demo](docs/motion/facet-micro-interactions.gif)

| Component | Interaction |
|---|---|
| **Button** | Lifts 1 px with a shadow and a spotlight that follows the cursor. Presses to 97% with a ripple. Icons act out their meaning: arrows nudge forward, plus rotates 90°, the trash can wiggles, the bell rings, send flies off. |
| **Input / Field** | The focus ring springs open and the leading icon turns brand-colored. Invalid fields shake on submit. |
| **Checkbox / Radio** | The box pops with a spring and the check mark draws left → right. |
| **Switch** | The thumb springs across and stretches while pressed, iOS-style. A soft halo appears on hover. |
| **Slider / Progress** | The thumb grows on hover and while dragging. Bars ease to their value with a moving sheen. |
| **Tabs / Toggle group** | The underline or pill *glides* to the new option instead of jumping. |
| **Menu / Command palette / Sidebar** | A highlight glides between items with the signal rail. Items stagger in when a menu opens. |
| **Card / KPI** | A brand-tinted spotlight tracks the cursor. Optional 3D tilt (`data-tilt`). KPI numbers count up the first time they scroll into view. |
| **Charts** | Bars grow from the baseline with a stagger. The hovered bar brightens and the legend dims the other series. |
| **Dialog / Sheet / Drawer** | The backdrop blurs and the panel springs in from 95%, the edge or the bottom. |
| **Toast** | Springs up from below with a draining progress line (pauses on hover), then slides out. |
| **Accordion** | Height springs open, the chevron flips, and the row nudges on hover. |
| **Avatar group / Badge / Kbd** | Avatars fan out on hover, success dots pulse, and keys depress. |
| **Kanban / Pricing / AI** | Cards lift and tilt while dragged. The featured plan has a rotating gradient border. The composer lifts on focus and the AI mark shimmers. |

**Using it**

```html
<div class="card" data-tilt="4">…</div>              <!-- 3D tilt, max 4° -->
<button class="btn" data-magnetic="0.12">…</button>  <!-- pulls toward the cursor, max 6px -->
<span data-countup>$248,920</span>                   <!-- counts up on first view -->
```

```js
Facet.motion.set("off");     // or "on" (saved per browser)
Facet.motion.refresh(el);    // after injecting new markup (SPA routes, modals)
```

**Motion tokens:** `--duration-instant` 80 ms · `--duration-fast` 120 ms · `--duration-base` 200 ms · `--duration-slow` 320 ms · `--duration-slower` 480 ms · `--ease-out` · `--ease-spring` `cubic-bezier(.34,1.56,.64,1)` · `--ease-in-out` · `--lift-sm/md` · `--press-scale`.

**Accessibility:** everything is switched off for users with `prefers-reduced-motion`, and with `<html data-motion="off">` (the ⚡ button in the style guide header). Animations only use `transform` and `opacity`, so they never shift layout.

**In Figma:** the 78 interactive component states use Smart Animate with a Gentle spring (320 ms, or 120 ms for press). Hover variants of buttons, icon buttons and chips gain Elevation/1 for a lift. The full spec is in **07 — Documentation → Motion & micro-interactions**. Effects that follow the cursor (spotlight, tilt, magnetic pull, gliding indicators) can't be expressed in Figma prototypes, so they exist only in code.

**In React:** the CSS layer works unchanged with shadcn/ui markup. For the JS-driven effects, use `motion` (Framer Motion) with `{ type: "spring", stiffness: 420, damping: 28 }`, which roughly matches `--ease-spring` at 320 ms.

---

## Marketplace previews

Eight ready-to-upload gallery images (1920×1080 PNG) for Figma Community, Gumroad, UI8 or Creative Market. They're in [`FacetUI-marketplace-previews/`](https://github.com/desiben/UIKits/tree/FacetUI/FacetUI-marketplace-previews) and on the [live Showcase page](https://facetui.vercel.app/#/showcase). In Figma, they're the "Marketplace previews" section on **00 — Start Here**, set to export at 1x and 2x.

| | |
|---|---|
| **Cover**<br>![Cover](FacetUI-marketplace-previews/01-cover.png) | **Components**<br>![Components](FacetUI-marketplace-previews/02-components.png) |
| **Brands & themes**<br>![Brands & themes](FacetUI-marketplace-previews/03-brands-themes.png) | **Templates**<br>![Templates](FacetUI-marketplace-previews/04-templates.png) |
| **Light & dark**<br>![Light & dark](FacetUI-marketplace-previews/05-light-dark.png) | **Mobile**<br>![Mobile](FacetUI-marketplace-previews/06-mobile.png) |
| **AI & signature components**<br>![AI & signature components](FacetUI-marketplace-previews/07-ai-signature.png) | **Tokens & developer handoff**<br>![Tokens & developer handoff](FacetUI-marketplace-previews/08-tokens-handoff.png) |

For a short listing video, use [`facet-micro-interactions.mp4`](https://github.com/desiben/UIKits/blob/FacetUI/facet-micro-interactions.mp4) (1280×720, 24 s). For full-HD videos and angled hero images, see the marketing kit below.

---

## Marketing kit: videos & images

Everything you need to market and sell Facet UI is on one page: **[facetui.vercel.app/marketing](https://facetui.vercel.app/marketing/)**. The files are in [`styleguide/marketing/media/`](https://github.com/desiben/UIKits/tree/FacetUI/styleguide/marketing/media), and the sources that generate them are in [`marketing/`](marketing/).

| Asset | Details |
|---|---|
| [▶ Product demo](https://github.com/desiben/UIKits/blob/FacetUI/styleguide/marketing/media/facet-ui-demo.mp4) | 55 s, 1920×1080, 30 fps (MP4 + WebM). Features, theming, variables, layers, templates, components, mobile and code. |
| [▶ Components reel](https://github.com/desiben/UIKits/blob/FacetUI/styleguide/marketing/media/facet-ui-components-reel.mp4) | 33 s, 1920×1080, 30 fps (MP4 + WebM). Live components with a real cursor: magnetic buttons, spotlight cards, sliding tabs, switches, hover rails, toasts. |
| 11 wide images | 3840×2160 JPG: angled 3D hero shots, a template wall, feature cards, theming, variables, layers, floating components, phones, code handoff and stats. |
| 2 square images | 2160×2160 JPG for Instagram, X and Figma Community thumbnails. |
| Listing copy | Tagline, one-liner, description and feature bullets, each with a copy button. |

The videos are silent so you can add your own music.

| | |
|---|---|
| ![Hero](styleguide/marketing/media/thumbs/facet-ui-hero.webp) | ![Key features](styleguide/marketing/media/thumbs/facet-ui-features.webp) |
| ![Theming](styleguide/marketing/media/thumbs/facet-ui-themes.webp) | ![Template wall](styleguide/marketing/media/thumbs/facet-ui-wall.webp) |
| ![Components](styleguide/marketing/media/thumbs/facet-ui-components.webp) | ![Mobile](styleguide/marketing/media/thumbs/facet-ui-mobile.webp) |
| ![Variables](styleguide/marketing/media/thumbs/facet-ui-variables.webp) | ![Hero (light)](styleguide/marketing/media/thumbs/facet-ui-hero-light.webp) |

The images highlight what buyers look for:

- Built for Figma — no plugins or setup required
- Fully editable colors, grids, spacing and styles
- Auto Layout + Variables for instant theme switching
- Organized layers, semantic naming and a systemized structure
- Pixel-perfect, professional and scalable components
- Works equally well for light, dark and custom brand themes

To re-render them (for example after changing the brand), see [`marketing/README.md`](marketing/README.md).

---

## Selling on Gumroad, Envato and UI8

Facet UI is sold on **Gumroad**, **Envato Market** and **UI8**. The storefront is the ETKits site ([etkits.vercel.app](https://etkits.vercel.app), the `main` branch), which lists all three stores.

### Listing images

`marketing/listings/` has a set of listing images for each store, all rendered from one source (`marketing/listings/mockups.html`) with monitor, laptop and phone mockups built from the real template screens:

| Store | Folder | Files |
|---|---|---|
| **Gumroad** | `marketing/listings/gumroad/` | 4 × 1920×1080 gallery images (cover, highlights, templates, thank-you), a 1200×1200 thumbnail and `facet-ui-gumroad-long.png` (1280 wide, for the description) |
| **UI8** | `marketing/listings/ui8/` | 4 × 1600×1200 (4:3) gallery images |
| **Envato Market** | `marketing/listings/envato/` | `thumbnail-80x80.png`, `preview-590x300.jpg` and 4 × 1920×1080 JPG screenshots |

| | |
|---|---|
| ![Cover](marketing/listings/gumroad/01-cover.png) | ![Highlights](marketing/listings/gumroad/02-highlights.png) |
| ![Templates](marketing/listings/gumroad/03-templates.png) | ![Thank you](marketing/listings/gumroad/04-thank-you.png) |

The sizes follow each store's usual listing format; check the current upload form before submitting. Edit `mockups.html` (or the sizes in `scripts/render_listing_images.js`) and re-render everything with `node scripts/render_listing_images.js` (see [`marketing/README.md`](marketing/README.md)).

### Keep the kit behind the purchase

| Store | How buyers get the Figma file |
|---|---|
| **Gumroad** | Gumroad emails a unique license key; the buyer unlocks the file at [etkits.vercel.app/claim](https://etkits.vercel.app/claim). |
| **Envato Market** | Each sale has a unique purchase code; the buyer unlocks the file on the same claim page (verified with the Envato author API). |
| **UI8** | UI8 hosts and delivers the files itself; upload the `.fig`/zip there. |

- **Figma:** never link the master file. Keep it *Only people invited*, turn off copying and export for viewers, and use a separate sale copy per store so a leak can be traced and replaced.
- **Repo:** keep `desiben/UIKits` private. The ETKits site and the public style guide must not link to it.
- **Live preview:** [facetui.vercel.app](https://facetui.vercel.app) is public, so treat it as a demo. Everything it serves (CSS, JS, tokens) can be saved from a browser.
- **Envato exclusivity:** selling on Gumroad and UI8 as well means listing on Envato as a *non-exclusive* author.

Claim-page setup (store IDs, tokens and Figma links as Vercel environment variables) is documented in the README on `main`.

### Licensing

Each store applies its own license: Gumroad uses yours (sell Personal, Commercial and Team/Extended tiers as product versions and ship a `LICENSE.md` that forbids resale and redistribution), Envato uses its Regular and Extended licenses, and UI8 uses its standard license.

---

## Design tokens

Tokens are layered. Components only use the semantic layer and up.

```
Primitives  →  Brand (6 modes)  →  Semantic Color (Light / Dark)  →  Components
--iris-600     --brand-600         --bg-primary, --text-link …
--ink-200                          --border-default …
```

| Collection (Figma) | CSS examples | Count | Modes |
|---|---|---|---|
| Primitives | `--iris-600`, `--ink-200`, `--lime-300` | 115 | — |
| Brand | `--brand-50 … --brand-950` | 11 | Iris, Ember, Lagoon, Rose, Cobalt, Forest |
| Color | `--bg-canvas`, `--bg-primary`, `--text-secondary`, `--border-focus`, `--chart-1…6` | 62 | Light, Dark |
| Dimension | `--space-0 … --space-20`, `--radius-xs … --radius-full`, `--icon-md` | 30 | — |
| Density | `--control-height-md`, `--layout-card-padding`, `--layout-row-height` | 8 | Comfortable, Compact |
| Typography | `--font-sans`, `--font-mono` | 2 | — |

The CSS also includes 25 text style shorthands (`--text-heading-h2`, `--tracking-heading-h2`, …), 6 elevation shadows (`--shadow-0 … --shadow-5`) and the focus rings (`--ring`, `--ring-danger`).

**Semantic color groups:** `bg/*` (canvas, surface, subtle, muted, elevated, inverse, hover, active, selected, primary, danger, success/warning/info-subtle, accent, overlay, control-off), `text/*`, `border/*`, `icon/*`, `chart/*`.

Files:

- **`tokens/tokens.css`**: drop-in CSS variables.
- **`tokens/facet.tokens.json`**: [W3C Design Tokens](https://design-tokens.github.io/community-group/format/) format for Style Dictionary and Tokens Studio.
- **`tokens/tailwind.preset.js`**: Tailwind preset (next section).

---

## Using Facet with Tailwind CSS and shadcn/ui

```js
// tailwind.config.js
module.exports = {
  presets: [require("./tokens/tailwind.preset.js")],
  content: ["./src/**/*.{ts,tsx}"],
};
```

```css
/* globals.css */
@import "./tokens/tokens.css";
body { font-family: var(--font-sans); background: var(--bg-canvas); color: var(--text-primary); }
```

The preset maps **shadcn/ui's names** to Facet tokens, so existing shadcn components pick up Facet's look without changes:

| shadcn class | Facet token |
|---|---|
| `bg-background` | `--bg-canvas` |
| `bg-primary` / `text-primary-foreground` | `--bg-primary` / `--text-on-primary` |
| `bg-muted` / `text-muted-foreground` | `--bg-muted` / `--text-tertiary` |
| `bg-destructive` | `--bg-danger` |
| `border-input` / `ring` | `--border-input` / `--border-focus` |

It also exposes the full Facet groups (`bg-bg-subtle`, `text-fg-secondary`, `border-line-strong`, `fill-icon-brand`, `bg-chart-1`), the radius scale (`rounded-lg`), the spacing scale and density heights (`h-control-md`).

To add the Facet cut to a shadcn component:

```tsx
<Card className="rounded-lg rounded-tr-sm">…</Card>
<Button className="rounded-md rounded-tr-xs">…</Button>
```

---

## Components

Each Figma component maps to a class-based HTML implementation and a shadcn/ui React equivalent. ✅ means it's implemented in the style guide. Figma-only components are listed below the table.

| Category | Components (✅ = in the HTML style guide) |
|---|---|
| **Actions** | Button ✅ · Button Group ✅ · Icon Button ✅ · Toggle ✅ · Toggle Group ✅ |
| **Forms** | Input ✅ · Input Group ✅ · Label ✅ · Field ✅ · Textarea ✅ · Select ✅ · Native Select ✅ · Checkbox ✅ · Radio ✅ · Switch ✅ · Slider ✅ · Input OTP ✅ · Dropzone ✅ · Combobox ✅ · Questionnaire ✅ · Date Picker · Date Range Picker · Time Picker |
| **Data display** | Badge ✅ · Avatar ✅ · Avatar Group ✅ · Kbd ✅ · Spinner ✅ · Skeleton ✅ · Separator ✅ · Progress ✅ · Card ✅ · KPI Card ✅ · Data Table ✅ · Calendar ✅ · Charts (bar ✅, area, donut, tooltip, legend ✅) |
| **Feedback** | Alert ✅ · Toast ✅ · Sonner ✅ · Empty State ✅ · Tooltip ✅ |
| **Layout** | Aspect Ratio ✅ · Collapsible ✅ · Scroll Area ✅ · Resizable ✅ |
| **AI** | Bubble ✅ · Marker ✅ · Message Scroller ✅ · Trace ✅ · Chain of Thought ✅ · Attachment ✅ |
| **Overlays** | Dialog ✅ · Alert Dialog ✅ · Sheet ✅ · Drawer ✅ · Dropdown Menu ✅ · Popover ✅ · Hover Card ✅ · Accordion ✅ · Context Menu ✅ · Menubar ✅ |
| **Navigation** | Tabs ✅ · Breadcrumb ✅ · Pagination ✅ · Chip ✅ · Link ✅ · Stepper ✅ · Sidebar ✅ · Navigation Menu ✅ |
| **Signature** | Command Palette ✅ · Prompt Composer ✅ · Message ✅ · Kanban ✅ · Activity Timeline ✅ · Notification Center ✅ · Pricing Card ✅ · AI Copilot Panel · Source Card · Code Block ✅ · Tree · Filter Builder · Workflow Builder · Resource Planner · Expandable Data Card |

Components without a ✅ exist in Figma, fully tokenized, but don't yet have an HTML reference implementation. In React, use the shadcn/ui component with the Tailwind preset.

### Signature motifs

- **The Facet cut.** Containers use `radius-lg` with a sharper `radius-sm` top-right corner; controls use `radius-md` with `radius-xs`. Use the `.facet` and `.facet-sm` utilities. To remove it, set `--radius-sm` equal to `--radius-lg`.
- **The signal rail.** A 3 px brand bar marks the active sidebar item, highlighted menu item, alert/toast tone and selected command. Use the `.rail` utility (override the color with `--rail`).

---

## Example pages

Full pages built only from Facet components and tokens. Each one responds to the theme, brand and density settings.

| Page | File | What it shows |
|---|---|---|
| Dashboard | `styleguide/examples/dashboard.html` | Sidebar, topbar, KPI cards, stacked bar chart, activity timeline, table with row menus, pagination, "New report" dialog, toast |
| Login | `styleguide/examples/login.html` | SSO buttons, email/password with validation and show/hide, remember me, OTP verification step |
| Settings | `styleguide/examples/settings.html` | Profile form, appearance (theme + brand + density, live), notifications, security, danger zone with confirm dialog |

| Dashboard | Login | Settings |
|---|---|---|
| ![](docs/images/example-dashboard.png) | ![](docs/images/example-login.png) | ![](docs/images/example-settings.png) |

The Figma file goes further, with **10 templates and 26 desktop and mobile screens**: SaaS analytics, CRM, project management, AI workspace, e-commerce admin, finance, calendar and scheduling, settings and account, authentication and onboarding, and a marketing website.

![Figma dashboard template](docs/images/figma-template-dashboard.png)

---

## The Figma file

The Figma file is delivered with your purchase: open the Figma link in your Gumroad receipt.

| Page | Contents |
|---|---|
| **00 — Start Here** | Cover, design directions explored, principles, inventory and build status, getting started |
| **01 — Foundations** | Color ramps, typography, spacing, radius, elevation, iconography |
| **02 — Design Tokens** | Theme matrix (brand × light/dark), density comparison, CSS reference, brand-color examples |
| **03 — Components** | 158 components, 105 variant sets, 622 variants, 147 Lucide icon components |
| **04 — Patterns** | 23 patterns: app shell, filter bar, KPI row, table toolbar, auth forms, onboarding, AI dock, marketing sections |
| **05 — Templates** | 10 apps, 26 screens (desktop and mobile), annotated |
| **06 — Playground** | Desktop and mobile sandboxes, theme lab, component tray, **clickable prototype flows** |
| **07 — Documentation** | 20 component doc cards (anatomy, properties, a11y, React code, do/don't) and a customization guide |
| **08 — Changelog** | Version history and known limitations |

**Prototype:** open *06 — Playground* and press **Present**. There are two flows: *Auth → Onboarding → Dashboard* and *Settings sections*. Interactive components (button, tabs, checkbox, switch, toggle, chip, accordion, menu item, sidebar item, input) have 78 hover, press and toggle states wired.

**Requirements:** Figma Professional plan or higher to switch variable modes. Install Mona Sans locally (free on Google Fonts).

See [`figma/README.md`](figma/README.md) for a full walkthrough.

---

## Accessibility

- **Contrast checked in code.** All primary fills are ≥ 4.5:1 with white text (iris-600 5.42, ember-600 5.35, lagoon-600 4.74, rose-600 5.52, cobalt-600 4.98, forest-600 4.65). Body text is 10.0:1 and secondary text is 6.5:1.
- **Visible focus everywhere.** A two-layer focus ring (surface gap + `border-focus`) shows on light, dark and colored backgrounds, with a danger variant for destructive actions.
- **Semantic HTML first.** Native `<button>`, `<input>`, `<details>` and `<table>`, with the correct ARIA roles for tabs, menus, dialogs, switches and OTP inputs.
- **Keyboard support.** Arrow keys for tabs and menus, Escape closes overlays and menus, focus returns to the trigger, ⌘K search, OTP auto-advance, backspace and paste.
- **Reduced motion.** `prefers-reduced-motion` (or `data-motion="off"`) disables every animation and micro-interaction.

See [Known limitations](#known-limitations) for the open accessibility notes.

---

## Browser support

Current versions of Chrome, Edge, Firefox and Safari. Facet uses CSS custom properties, `color-mix()`, `:focus-visible`, `backdrop-filter` and `inset`, which are all supported in 2023+ evergreen browsers. No build tools or frameworks are required.

---

## Regenerating tokens

The tokens come from the Figma variables, exported to `tokens/source/figma_export.json`, plus the OKLCH palette in `tokens/source/palette.json`.

```bash
# 1. (optional) regenerate primitive ramps — requires `pip install coloraide`
python3 scripts/generate_palette.py

# 2. rebuild tokens.css, facet.tokens.json, tailwind.preset.js
#    and sync styleguide/assets/tokens.css + tokens-meta.js
python3 scripts/build_tokens.py
```

To add a brand permanently, add its ramp to `palette.json` and a mode to `figma_export.json → vars.Brand`, then rebuild.

---

## Project structure

| Path | Purpose | Ship it in your app? |
|---|---|---|
| `tokens/tokens.css` | All CSS variables | ✅ |
| `styleguide/assets/facet.css` | Component classes | ✅ (if not using Tailwind) |
| `styleguide/assets/facet.js` | Theme API + behaviours (≈ 12 KB unminified, no deps) | ✅ (optional) |
| `styleguide/assets/motion.css` + `motion.js` | Micro-interactions (≈ 36 KB unminified, no deps) | ✅ (optional) |
| `styleguide/assets/icons.js` | Lucide sprite | ✅ (or use `lucide` / `lucide-react`) |
| `styleguide/assets/docs.*`, `registry.js`, `tokens-meta.js` | Style guide site only | ❌ |
| `styleguide/examples/example.css` | App-shell layout for the examples | Optional starting point |
| `styleguide/marketing/` | Marketing page, videos and images | ❌ |
| `marketing/`, `scripts/render_marketing_*.js` | Sources and render scripts for the marketing kit | ❌ |
| `marketing/listings/`, `scripts/render_listing_images.js` | Store listing images and their renderer | ❌ |

---

## Known limitations

Facet aims to be honest about what isn't finished:

1. **`border/input` contrast is 2.5:1** against white. That's below WCAG 1.4.11's 3:1 for control boundaries. Labels and placeholders carry the meaning, but if your audit requires 3:1, change `--border-input` to `var(--ink-500)`.
2. **Code and Data text styles use Mona Sans**, not a true monospace, to keep the kit to one family. Swap `--font-mono` if you show a lot of code.
3. **The HTML style guide documents 109 components.** A few Figma components (e.g. Workflow Builder, Resource Planner, Date Range Picker) are Figma-only for now.
4. **The HTML is a reference implementation, not a React package.** Focus-trapping in dialogs and the full calendar keyboard model are simplified. For production React apps, use shadcn/ui (Radix) with the Facet preset.
5. **The Figma prototype covers two flows.** The remaining template screens are static.
6. **Mona Sans loads from Google Fonts.** Offline, it falls back to the system UI font.

---

## Credits and licenses

- **Typeface:** [Mona Sans](https://github.com/github/mona-sans) by GitHub, SIL Open Font License 1.1.
- **Icons:** [Lucide](https://lucide.dev) v0.460.0, ISC License (see `styleguide/assets/LUCIDE-LICENSE.txt`).
- **Marketing kit:** rendered with Playwright and ffmpeg from the sources in `marketing/`.
- **Inspiration:** the component inventory and API conventions of [shadcn/ui](https://ui.shadcn.com) (MIT). Facet does not copy shadcn's code or visual design.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Facet UI itself is sold under [LICENSE.md](LICENSE.md) (Personal, Commercial and Team). Buyers start with [START-HERE.md](START-HERE.md).

<div align="center"><sub>Facet UI v1.3 · by ELTouch apps · Built with Figma variables, OKLCH color and plain CSS.</sub></div>
