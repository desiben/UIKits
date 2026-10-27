# Facet UI v{{VERSION}}: reference for AI coding assistants

> Give this file to ChatGPT, Claude, Cursor, Copilot or any other assistant before asking it to build UI with Facet UI. It explains how Facet works, the rules to follow, and the exact markup of all {{COUNT}} documented components.
> Facet UI © 2026 ETKits. Licensed to Facet UI buyers only: don't publish this file.

## 1. What Facet UI is

Facet UI is a token-driven design system by ETKits for SaaS products, dashboards, admin tools and AI apps. It ships as three layers that match one to one:

- **Figma library:** 158 components (105 variant sets, 622 variants), Figma Variables for every value, 10 app templates (26 screens), 36 page blocks, 23 patterns, 4 style themes and 1,903 Lucide icons.
- **HTML/CSS/JS:** a framework-free implementation of 109 components (`facet.css`, `facet.js`, optional `motion.css`/`motion.js` and `charts.js`). No build step, no dependencies.
- **Animated React components:** the same 109 components for React, built on Radix and Tailwind CSS v4, installed into your project with the `facetui` CLI.

Its visual signature is **the Facet cut** (containers have one sharper top-right corner) and **the signal rail** (a 3 px brand bar on active items).

## 2. Rules for the assistant

1. **Use tokens, never raw values.** Colors, spacing, radius, type and shadows come from CSS variables (`var(--bg-surface)`, `var(--space-4)`, `var(--radius-lg)`, `var(--text-body-sm)`). Don't write hex colors, pixel spacing or font stacks in component code.
2. **Use semantic tokens, not primitives.** Prefer `--bg-primary`, `--text-secondary`, `--border-default` over `--iris-600` or `--ink-200`, so light/dark and brand switching keep working.
3. **Use the documented classes.** Build with the classes in section 12 (`btn`, `card`, `input`, `badge`…). Don't invent class names that look like Facet's; put your own layout styles in your own stylesheet.
4. **Theme with attributes.** `data-theme`, `data-brand`, `data-density` and `data-style` on `<html>` (or any subtree). Don't fork CSS per theme.
5. **Icons are sprite references:** `<svg class="icon"><use href="#name"/></svg>` with Lucide names. Icon-only buttons need `aria-label`.
6. **Keep the HTML semantic:** `<button>` for actions, `<a>` for navigation, real `<label for>`, `<table>` for tabular data, native inputs.
7. **Respect motion settings.** Animations must use `transform`/`opacity` and stop under `prefers-reduced-motion` or `html[data-motion="off"]`.
8. **After injecting markup at runtime** (SPA routes, modals), call `Facet.enhance(el)`; for charts `Facet.charts.refresh(el)`; for motion `Facet.motion.refresh(el)`.
9. **In React, use the installed components** (`@/components/ui/...` from `npx facetui add`) rather than re-creating them, and wrap the app once in `<FacetMotion>`.
10. **One typeface:** Mona Sans (400/500/600). Don't add other fonts.

## 3. Setup: plain HTML

Copy `styleguide/assets/` from the download (`tokens.css`, `facet.css`, `facet.js`, `icons.js`, and optionally `motion.css`, `motion.js`, `charts.js`, `lucide.js`).

```html
<!doctype html>
<html lang="en" data-theme="light" data-brand="iris" data-density="comfortable">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/tokens.css">
  <link rel="stylesheet" href="assets/facet.css">
  <link rel="stylesheet" href="assets/motion.css">  <!-- optional micro-interactions -->
  <script src="assets/icons.js"></script>          <!-- icon sprite (or lucide.js for all 1,903) -->
  <script src="assets/facet.js"></script>          <!-- theme API + behaviours -->
  <script src="assets/charts.js"></script>         <!-- optional charts -->
  <script src="assets/motion.js" defer></script>   <!-- optional cursor effects -->
</head>
<body>
  <button class="btn"><svg class="icon"><use href="#plus"/></svg>New project</button>
</body>
</html>
```

## 4. Setup: React (animated components)

Works in Next.js, Vite, React Router, Astro and TanStack Start.

```bash
npx facetui@latest init               # Tailwind v4, the @/ alias, Facet theme, lib/utils.ts, lib/motion.tsx
npx facetui@latest add button dialog  # any components, with their dependencies
npx facetui@latest add --all          # every component
npx facetui@latest list               # what's available
npx facetui@latest remove carousel    # delete a component's files
```

Flags: `--overwrite`/`-o` replaces existing files, `--dry-run` shows changes, `--css <file>` names your global stylesheet, `--cwd <dir>`, `--verbose`. pnpm, yarn and bun work too (`pnpm dlx`, `yarn dlx`, `bunx`).

`init` asks once for the license key (from the purchase receipt) and saves it as `FACET_LICENSE_KEY` in `.env.local`. Components land in your own code (`components/ui/`), so you can edit them.

```tsx
import { FacetMotion } from "@/lib/motion"
import { Button } from "@/components/ui/button"

export default function App() {
  return <FacetMotion><Button>Save</Button></FacetMotion>
}
```

Motion presets (springs, easings, variants) live in `lib/motion.tsx`; change them there to retune the whole kit. The theme adds Tailwind utilities for the Facet cut: `rounded-facet-sm`, `rounded-facet`, `rounded-facet-lg`, `rounded-facet-xl`.

## 5. Setup: Tailwind with the tokens only

```js
// tailwind.config.js
module.exports = { presets: [require("./tokens/tailwind.preset.js")], content: ["./src/**/*.{ts,tsx}"] }
```

```css
@import "./tokens/tokens.css";
body { font-family: var(--font-sans); background: var(--bg-canvas); color: var(--text-primary); }
```

The preset maps the usual semantic class names to Facet tokens: `bg-background` → `--bg-canvas`, `bg-primary`/`text-primary-foreground` → `--bg-primary`/`--text-on-primary`, `bg-muted`/`text-muted-foreground` → `--bg-muted`/`--text-tertiary`, `bg-destructive` → `--bg-danger`, `border-input`/`ring` → `--border-input`/`--border-focus`. Full groups are exposed as `bg-bg-*`, `text-fg-*`, `border-line-*`, `fill-icon-*`, `bg-chart-1…6`, plus radius, spacing and `h-control-sm|md|lg`.

## 6. Theming

| Axis | Attribute | Values | JS |
|---|---|---|---|
| Mode | `data-theme` | `light`, `dark` | `Facet.theme.setMode("dark")` |
| Brand | `data-brand` | `iris` (#5d4ff3, default), `ember` (#be4000), `lagoon` (#00817c), `rose` (#c02b6c), `cobalt` (#0072c5), `forest` (#00864c) | `Facet.theme.setBrand("lagoon")` |
| Any brand color | — | any hex | `Facet.theme.setCustomBrand("#ff5a1f", el?)` |
| Density | `data-density` | `comfortable`, `compact` | `Facet.theme.setDensity("compact")` |
| Style | `data-style` | none (Default), `soft`, `glass`, `mono` | `Facet.theme.setStyle("glass")` |
| Motion | `data-motion` | `off` to disable | `Facet.motion.set("off")` |

- Attributes work on any subtree: `<section data-brand="ember" data-theme="dark">…</section>`.
- `Facet.theme.cssFor("#ff5a1f", "acme")` returns a `[data-brand="acme"] { --brand-50 … --brand-950 }` block to paste into CSS, then use `data-brand="acme"`.
- Custom brands are generated in OKLCH and darkened until `brand-600` is ≥ 4.5:1 and `brand-700` ≥ 6:1 against white, so primary buttons and links stay WCAG AA.
- `Facet.theme.get()` returns `{ mode, brand, density, custom }`; the `facet:theme` event fires on every change. Choices persist in `localStorage` (`facet-theme`).

## 7. Tokens

Layering: **Primitives → Brand (6 modes) → Semantic color (light/dark) → Components.** Components only use semantic tokens.

- **Primitives:** ramps `--iris-*`, `--ember-*`, `--lagoon-*`, `--lime-*`, `--green-*`, `--amber-*`, `--red-*`, `--blue-*`, `--rose-*` (50–950) and neutrals `--ink-0 … --ink-1000`.
- **Brand:** `--brand-50 … --brand-950` (follows `data-brand`).
- **Backgrounds:** `--bg-canvas`, `--bg-surface`, `--bg-subtle`, `--bg-muted`, `--bg-elevated`, `--bg-inverse`, `--bg-hover`, `--bg-active`, `--bg-selected`, `--bg-disabled`, `--bg-primary` (`-hover`, `-active`, `-subtle`), `--bg-secondary` (`-hover`), `--bg-danger` (`-hover`, `-subtle`), `--bg-success-subtle`, `--bg-warning-subtle`, `--bg-info-subtle`, `--bg-accent`, `--bg-overlay`, `--bg-control-off`.
- **Text:** `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-placeholder`, `--text-disabled`, `--text-inverse`, `--text-on-primary`, `--text-on-accent`, `--text-brand`, `--text-link`, `--text-danger`, `--text-success`, `--text-warning`, `--text-info`.
- **Borders:** `--border-default`, `--border-subtle`, `--border-strong`, `--border-input`, `--border-focus`, `--border-brand`, `--border-danger`, `--border-success`, `--border-warning`.
- **Icons:** `--icon-primary`, `--icon-secondary`, `--icon-brand`, `--icon-on-primary`, `--icon-danger`, `--icon-success`, `--icon-warning`, `--icon-info`.
- **Charts:** `--chart-1 … --chart-6`.
- **Space:** `--space-0`, `-0-5` (2px), `-1` (4), `-1-5` (6), `-2` (8), `-2-5` (10), `-3` (12), `-4` (16), `-5` (20), `-6` (24), `-8` (32), `-10` (40), `-12` (48), `-16` (64), `-20` (80).
- **Radius:** `--radius-none`, `-xs` (2), `-sm` (4), `-md` (8), `-lg` (12), `-xl` (16), `-2xl` (24), `-full`.
- **Density:** `--control-height-sm|md|lg` (32/36/44 comfortable, 28/32/36 compact), `--control-padding-x`, `--control-gap`, `--layout-card-padding`, `--layout-row-height`, `--layout-section-gap`.
- **Type (shorthand `font` values):** `--text-display-3xl|2xl|xl|lg`, `--text-heading-h1…h5`, `--text-body-xl|lg|md|sm|xs`, `--text-label-lg|md|sm|xs`, `--text-caption`, `--text-overline`, `--text-data-xl|lg|md`, `--text-code-md|sm`; each has a matching `--tracking-*`. Use as `font: var(--text-body-sm)`.
- **Elevation and focus:** `--shadow-0 … --shadow-5`, `--ring`, `--ring-danger`.
- **Motion:** `--duration-instant` (80ms), `-fast` (120), `-base` (200), `-slow` (320), `-slower` (480); `--ease-out`, `--ease-spring`, `--ease-in-out`, `--ease-bounce`; `--lift-sm|md`, `--press-scale`.

Files: `tokens/tokens.css` (CSS), `tokens/facet.tokens.json` (W3C DTCG, for Style Dictionary / Tokens Studio), `tokens/tailwind.preset.js`.

## 8. Utilities and text classes

- Text: `t-display-3xl|2xl|xl|lg`, `t-h1 … t-h5`, `t-body-xl|lg|md|sm|xs`, `t-label-lg|md|sm|xs`, `t-caption`, `t-overline`, `t-data-xl|lg|md`, `t-code`; colors `text-secondary`, `text-brand`.
- Layout: `row` (horizontal flex with gap), `stack` (vertical), `grow` (fill remaining space), `sr-only`.
- Signature: `facet` / `facet-sm` add the Facet cut to any box; `rail` adds the signal rail (color via `--rail`). To remove the cut everywhere, set `--radius-sm` equal to `--radius-lg`.

## 9. JavaScript APIs (HTML version)

- `Facet.theme`: see section 6.
- `Facet.enhance(scope)`: wire behaviours (tabs, menus, dialogs, switches, OTP…) on markup added later.
- `Facet.toast({ title, description, icon, timeout })`: single toast.
- `Facet.sonner({ title, description, type, action, duration })`, `Facet.sonner.success|error|info|warning|loading(title)`, `Facet.sonner.promise(promise, { loading, success, error })`, `Facet.sonner.dismiss()`: stacked toasts. Declarative: `<button data-sonner='{"title":"Saved","type":"success"}'>`.
- `Facet.charts.render(el, config)`, `Facet.charts.refresh(scope)`. Declarative: `<div class="chart" data-chart='{"type":"area","labels":["Jan","Feb"],"format":"$compact","series":[{"name":"MRR","data":[12,18]}]}'></div>`. Types: `area`, `line`, `bar`, `composed`, `pie` (donut), `radar`, `radial`, `spark`. Options include `stacked`, `curve`, `max`, `format` (`currency`, `compact`, `$compact`, `percent`) and per-series `color`. Colors default to `--chart-1…6`, so charts follow brand and mode; they re-render on resize and theme change.
- `Facet.motion.set("on"|"off")`, `Facet.motion.refresh(el)`, attributes `data-tilt="4"` (3D tilt), `data-magnetic="0.12"` (pull toward cursor), `data-countup` (numbers count up on first view).

## 10. Ready-made pages

- **Templates** (`styleguide/templates/`): 36 blocks with 56 variants in 7 categories (Marketing, Navigation, Forms, Content, App, Commerce, System): heroes, feature grids, stats, logo clouds, how-it-works, roadmaps, testimonials, CTAs, pricing, FAQ, footers, mega menus, announcement bars, breadcrumbs, sticky headers, contact and newsletter forms, team, video, blog, news, dashboards, activity feeds, 404, multi-step wizard, catalog filters, product cards, product gallery, cart drawer, checkout, data tables, empty states, skeleton loaders and cookie banners. Each block's HTML is copyable for buyers.
- **App pages** (`styleguide/examples/`): `dashboard.html`, `login.html` (SSO, email/password, one-time code) and `settings.html` (profile, appearance, notifications, security, danger zone). `example.css` is the app-shell layout they share.
- **AI agent demos** (`styleguide/agents/`): Business Banking, Commerce Ops, Travel, Email, Health and Support, showing chain of thought, tool calls, approvals and generative UI.

## 11. Accessibility baseline

- Primary fills are ≥ 4.5:1 with white text in every brand; body text 10:1, secondary text 6.5:1.
- Visible two-layer focus ring (`--ring`) in every theme; `--ring-danger` for destructive actions.
- Keyboard: arrow keys in tabs and menus, Escape closes overlays and returns focus, ⌘K command palette, OTP auto-advance and paste.
- Known gap: `--border-input` is 2.5:1 against white; if an audit needs 3:1 for control borders, set it to `var(--ink-500)`.
- In the HTML version, dialog focus-trapping and the full calendar keyboard model are simplified; the React components (Radix) implement them fully.
