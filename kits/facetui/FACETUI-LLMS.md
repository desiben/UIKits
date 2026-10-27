# Facet UI v1.3.0: reference for AI coding assistants

> Give this file to ChatGPT, Claude, Cursor, Copilot or any other assistant before asking it to build UI with Facet UI. It explains how Facet works, the rules to follow, and the exact markup of all 109 documented components.
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

## 12. Component reference (109 components)

Generated from the style guide registry. For each component: what it is, the classes, attributes and JS it uses, accessibility rules, the React install command and one working HTML example (the shortest one documented). Icons are `<svg class="icon"><use href="#name"/></svg>` and need `icons.js` on the page.

### Actions

#### Button

Triggers an action. One primary button per view; pair with secondary or ghost for the rest.

- Docs page: `#/components/button`
- Figma: Button · 6 variants × 3 sizes × 6 states
- React: `npx facetui@latest add button`

| Name | Kind | Notes |
|---|---|---|
| `btn-secondary \| btn-outline \| btn-ghost \| btn-destructive \| btn-link` | class | Visual variant (default: primary) |
| `btn-sm \| btn-lg` | class | Size — heights follow the Density tokens (32/36/44 comfortable) |
| `icon-btn` | class | Square icon-only button. Always add aria-label |
| `data-loading` | attribute | Shows loading state and blocks pointer events |
| `disabled` | attribute | Native disabled state |

Accessibility:
- Use <button> for actions and <a> for navigation.
- Icon-only buttons need aria-label (and optionally a tooltip).
- Focus ring is a 2-layer token ring (border/focus) visible in every theme.

Example (Sizes):

```html
<button class="btn btn-sm">Small</button>
<button class="btn">Medium</button>
<button class="btn btn-lg">Large</button>
```

#### Button Group

Joins related buttons into one control: shared borders, one outer corner shape. Works with outline, solid and ghost buttons, a split dropdown, text addons and inputs.

- Docs page: `#/components/button-group`
- Figma: Button Group · Outline · Split · With Input · Vertical
- React: `npx facetui@latest add button-group`

| Name | Kind | Notes |
|---|---|---|
| `btn-group` | class | Horizontal group (default) |
| `btn-group-vertical` | modifier | Stack vertically |
| `btn-group-text` | class | Static text addon |
| `btn-group-sep` | class | Separator between solid buttons |

Accessibility:
- Give the wrapper role="group" and an aria-label.
- Icon-only buttons need their own aria-label.

Example (Outline group):

```html
<div class="btn-group" role="group" aria-label="Message actions"><button class="btn btn-outline btn-sm"><svg class="icon icon-sm"><use href="#archive"/></svg> Archive</button><button class="btn btn-outline btn-sm">Report</button><button class="btn btn-outline btn-sm">Snooze</button><button class="btn btn-outline btn-sm icon-btn" aria-label="More"><svg class="icon icon-sm"><use href="#ellipsis"/></svg></button></div>
```

#### Toggle & Toggle Group

Two-state buttons for formatting and view switching. A toggle group can be single- or multi-select.

- Docs page: `#/components/toggle`
- Figma: Toggle, Toggle Group
- React: `npx facetui@latest add toggle`

| Name | Kind | Notes |
|---|---|---|
| `data-toggle` | attribute | Enables click-to-toggle (facet.js) |
| `aria-pressed` | attribute | Current state — styles key off it |
| `data-single` | attribute (group) | Makes the group behave as a radio set |

Accessibility:
- aria-pressed communicates state to assistive tech.
- Group needs role=group and an aria-label.

Example (Toggle):

```html
<button class="toggle" data-toggle aria-pressed="true" aria-label="Bold"><b>B</b></button>
<button class="toggle" data-toggle aria-pressed="false" aria-label="Italic"><i>I</i></button>
<button class="toggle toggle-outline" data-toggle aria-pressed="false"><svg class="icon"><use href="#star"/></svg> Favorite</button>
```

### Forms

#### Cell Color Picker

A settings row with preset swatches and a custom color input.

- Docs page: `#/components/cell-color-picker`
- Figma: Cell / Color Picker
- React: `npx facetui@latest add cell-color-picker`

| Name | Kind | Notes |
|---|---|---|
| `cell-swatches button[aria-pressed]` | attribute | Selected swatch |
| `input[type=color]` | element | Custom color |

Accessibility:
- Swatches are buttons with color names as labels.

Example (Accent color):

```html
<div class="cell-group" style="max-width:480px;margin:auto">
  <div class="cell"><span class="cell-label">Accent color<small class="cell-value">Iris</small></span><div class="cell-swatches">
    <button style="--sw:#5d4ff3" aria-label="Iris" aria-pressed="true"></button><button style="--sw:#be4000" aria-label="Ember" aria-pressed="false"></button><button style="--sw:#00817c" aria-label="Lagoon" aria-pressed="false"></button><button class="hide-sm" style="--sw:#c02b6c" aria-label="Rose" aria-pressed="false"></button><button class="hide-sm" style="--sw:#0072c5" aria-label="Cobalt" aria-pressed="false"></button>
    <input type="color" value="#5d4ff3" aria-label="Custom color"></div></div>
</div>
```

#### Cell Select

A settings row with a compact, right-aligned native select.

- Docs page: `#/components/cell-select`
- Figma: Cell / Select
- React: `npx facetui@latest add cell-select`

| Name | Kind | Notes |
|---|---|---|
| `cell-select` | class | Borderless select with chevrons |

Accessibility:
- Each select has an aria-label matching the row label.

Example (Preferences):

```html
<div class="cell-group" style="max-width:440px;margin:auto">
  <div class="cell"><span class="cell-icon" style="--tone:var(--lagoon-600)"><svg class="icon"><use href="#globe"/></svg></span><span class="cell-label">Language</span><select class="cell-select" aria-label="Language"><option>English (US)</option><option>Deutsch</option><option>Français</option></select></div>
  <div class="cell"><span class="cell-icon" style="--tone:var(--amber-500)"><svg class="icon"><use href="#clock"/></svg></span><span class="cell-label">Time zone</span><select class="cell-select" aria-label="Time zone"><option>Pacific (GMT−8)</option><option>Eastern (GMT−5)</option><option>Berlin (GMT+1)</option></select></div>
  <div class="cell"><span class="cell-icon" style="--tone:var(--rose-600)"><svg class="icon"><use href="#calendar"/></svg></span><span class="cell-label">Week starts on</span><select class="cell-select" aria-label="Week starts on"><option>Monday</option><option>Sunday</option></select></div>
</div>
```

#### Cell Slider

A settings row with a label, live value and a full-width slider.

- Docs page: `#/components/cell-slider`
- Figma: Cell · Slider · Slider Secondary
- React: `npx facetui@latest add cell-slider`

| Name | Kind | Notes |
|---|---|---|
| `data-prefix · data-suffix` | attribute | Format the output |
| `cell-group[data-variant=secondary]` | attribute | Muted group surface |

Accessibility:
- The output shows the current value as text.

Example (Slider group):

```html
<div class="cell-group" data-variant="secondary" style="max-width:440px;margin:auto">
  <div class="cell cell-slider"><div class="cell-top"><span class="cell-label">Volume</span><output>60%</output></div><input class="slider" type="range" min="0" max="100" value="60" data-suffix="%" aria-label="Volume"></div>
  <div class="cell cell-slider"><div class="cell-top"><span class="cell-label">Monthly budget</span><output>$1,200</output></div><input class="slider" type="range" min="0" max="5000" step="100" value="1200" data-prefix="$" aria-label="Monthly budget"></div>
  <div class="cell cell-slider"><div class="cell-top"><span class="cell-label">Seats</span><output>24</output></div><input class="slider" type="range" min="1" max="100" value="24" aria-label="Seats"></div>
</div>
```

#### Cell Switch

A settings row with a label, description and a switch on the right. The whole row is clickable.

- Docs page: `#/components/cell-switch`
- Figma: Cell / Switch
- React: `npx facetui@latest add cell-switch`

| Name | Kind | Notes |
|---|---|---|
| `label.cell` | element | Whole row toggles the switch |
| `cell-icon --tone` | CSS var | Icon tile color |

Accessibility:
- The label element connects text and switch for screen readers.

Example (Settings group):

```html
<div class="cell-group" style="max-width:440px;margin:auto">
  <div class="cell-group-label">Privacy</div>
  <label class="cell"><span class="cell-icon" style="--tone:var(--blue-600)"><svg class="icon"><use href="#eye"/></svg></span><span class="cell-label">Show activity status<small>Let teammates see when you're online</small></span><span class="switch"><input type="checkbox" role="switch" checked></span></label>
  <label class="cell"><span class="cell-icon" style="--tone:var(--ember-600)"><svg class="icon"><use href="#mail"/></svg></span><span class="cell-label">Read receipts</span><span class="switch"><input type="checkbox" role="switch"></span></label>
  <label class="cell"><span class="cell-icon" style="--tone:var(--green-600)"><svg class="icon"><use href="#shield-check"/></svg></span><span class="cell-label">Private mode<small>Hide your profile from search</small></span><span class="switch"><input type="checkbox" role="switch"></span></label>
</div>
```

#### Checkbox & Radio

Select one or many options. Built on native inputs, so keyboard and forms work for free.

- Docs page: `#/components/checkbox`
- Figma: Checkbox · Radio
- React: `npx facetui@latest add checkbox`

| Name | Kind | Notes |
|---|---|---|
| `check` | class (label) | Wraps a native checkbox/radio and its text |
| `indeterminate` | JS property | el.indeterminate = true shows the dash state |

Accessibility:
- The whole label is the hit target.
- Use a fieldset/legend or role=radiogroup with a name for groups.

Example (Radio):

```html
<div class="stack" role="radiogroup" aria-label="Plan">
  <label class="check"><input type="radio" name="plan" checked><span>Monthly</span></label>
  <label class="check"><input type="radio" name="plan"><span>Yearly <span class="badge badge-success">-20%</span></span></label>
</div>
```

#### Checkbox Button Group

Large, card-style checkboxes for choosing several options — with icons, descriptions and a grid layout.

- Docs page: `#/components/checkbox-button-group`
- Figma: Checkbox Button Group · list · grid
- React: `npx facetui@latest add checkbox-button-group`

| Name | Kind | Notes |
|---|---|---|
| `choice-group[data-layout=grid]` | attribute | Responsive grid |
| `--cols` | CSS var | Fixed column count |

Accessibility:
- Group in a fieldset with a legend; the native input stays focusable.

Example (Grid):

```html
<fieldset class="choice-group" data-layout="grid" style="border:0;padding:0;margin:0;width:100%">
  <legend class="label" style="margin-bottom:8px">Integrations</legend>
  <label class="choice"><input type="checkbox" checked><span class="choice-body"><b>Slack</b><span>Alerts in your channels</span></span><span class="choice-icon"><svg class="icon"><use href="#message-square"/></svg></span></label>
  <label class="choice"><input type="checkbox"><span class="choice-body"><b>GitHub</b><span>Link pull requests</span></span><span class="choice-icon"><svg class="icon"><use href="#git-branch"/></svg></span></label>
  <label class="choice"><input type="checkbox" checked><span class="choice-body"><b>Postgres</b><span>Sync your warehouse</span></span><span class="choice-icon"><svg class="icon"><use href="#database"/></svg></span></label>
  <label class="choice"><input type="checkbox" disabled><span class="choice-body"><b>Salesforce</b><span>Scale plan only</span></span><span class="choice-icon"><svg class="icon"><use href="#cloud"/></svg></span></label>
</fieldset>
```

#### Combobox

A select with a search box: type to filter, Enter to pick the first match. Shows an empty state when nothing matches. Works single or multiple.

- Docs page: `#/components/combobox`
- Figma: Select · Combobox · Open
- React: `npx facetui@latest add combobox`

| Name | Kind | Notes |
|---|---|---|
| `dropdown[data-select][data-combobox]` | wrapper | Select + search |
| `combobox-search` | class | Search field at the top of the list |
| `combobox-empty` | class | Shown when nothing matches |
| `combobox-chips` | class | Chips for multiple selection |

Accessibility:
- The search input gets role="combobox" and aria-autocomplete="list".
- ↓ from the search moves into the list; Enter picks the first match.

Example (Single):

```html
<div class="dropdown" data-select data-combobox style="width:260px;margin-bottom:300px"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Framework"><span class="value" data-placeholder="Select framework…"></span><svg class="icon"><use href="#chevrons-up-down"/></svg></button><div class="menu listbox" role="listbox"><div class="combobox-search"><svg class="icon"><use href="#search"/></svg><input placeholder="Search framework…" aria-label="Search framework" role="combobox" aria-autocomplete="list"></div><button class="menu-item" role="option" data-value="next" aria-selected="false">Next.js<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="remix" aria-selected="false">Remix<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="astro" aria-selected="false">Astro<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="nuxt" aria-selected="false">Nuxt<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="svelte" aria-selected="false">SvelteKit<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="solid" aria-selected="false">SolidStart<svg class="icon check-mark"><use href="#check"/></svg></button><div class="combobox-empty">No framework found.</div></div></div>
```

#### Dropzone

File upload target with drag state.

- Docs page: `#/components/dropzone`
- Figma: Dropzone · Attachment
- React: `npx facetui@latest add dropzone`

| Name | Kind | Notes |
|---|---|---|
| `dropzone` | class | Dashed container |
| `data-drag="true"` | attribute | Set while dragging over |

Accessibility:
- Keep a real <input type=file> inside so keyboard users can browse.

Example (Dropzone):

```html
<label class="dropzone facet" style="max-width:460px;margin:auto">
  <span class="icon-wrap"><svg class="icon"><use href="#upload-cloud"/></svg></span>
  <b class="t-label-md" style="color:var(--text-primary)">Drop files or <span class="text-brand">browse</span></b>
  <span class="t-body-xs text-tertiary">PNG, PDF or CSV up to 20 MB</span>
  <input type="file" class="sr-only" multiple>
</label>
```

#### Field

Label + control + help/error text. Use for every form input.

- Docs page: `#/components/field`
- Figma: Field · Default / Error / Disabled
- React: `npx facetui@latest add field`

| Name | Kind | Notes |
|---|---|---|
| `field` | class | Vertical stack with 6px gap |
| `data-invalid` | attribute | Turns help text red |
| `label / .req` | class | Label + required marker |

Accessibility:
- Connect help/error text with aria-describedby.
- Mark required fields in the label, not only with color.

Example (Textarea & select):

```html
<div class="stack" style="width:340px;--gap:20px">
  <div class="field"><label class="label" for="f3">Bio</label><textarea class="textarea" id="f3" placeholder="Add context for your teammates"></textarea></div>
  <div class="field"><label class="label" for="f4">Role</label><select class="select" id="f4"><option>Admin</option><option selected>Member</option><option>Viewer</option></select></div>
</div>
```

#### Inline Select

A select that sits inside a sentence — for filters and natural-language settings.

- Docs page: `#/components/inline-select`
- Figma: Inline Select
- React: `npx facetui@latest add inline-select`

| Name | Kind | Notes |
|---|---|---|
| `inline-select select` | element | Native select styled as text |

Accessibility:
- Each select needs an aria-label because the sentence isn't its label.

Example (In a sentence):

```html
<p class="t-body-lg" style="text-align:center">Show <span class="inline-select"><select aria-label="Metric"><option>revenue</option><option>signups</option><option>churn</option></select></span> for <span class="inline-select"><select aria-label="Range"><option>the last 30 days</option><option>this quarter</option><option>this year</option></select></span> grouped by <span class="inline-select"><select aria-label="Group"><option>plan</option><option>region</option></select></span>.</p>
```

#### Input

Single-line text entry. Facet inputs carry the control facet cut and a 2-layer focus ring.

- Docs page: `#/components/input`
- Figma: Input · 3 sizes × 6 states
- React: `npx facetui@latest add input`

| Name | Kind | Notes |
|---|---|---|
| `input-sm \| input-lg` | class | Size |
| `aria-invalid="true"` | attribute | Error styling + danger focus ring |
| `input-group` | wrapper | Leading icon / trailing kbd |

Accessibility:
- Always pair with a visible <label> (see Field).
- border/input is 2.5:1 on white — it is decorative; the label and placeholder carry meaning. Raise to ink/500 if your audit requires 3:1 for control edges.

Example (Default):

```html
<input class="input" style="max-width:320px" placeholder="you@company.com" type="email">
```

#### Input Group

One bordered control that holds an input plus addons: icons, text, kbd hints, inline buttons, or a toolbar above or below a textarea. Focus rings the whole group.

- Docs page: `#/components/input-group`
- Figma: Input Group · Icon + Text · Prefix + Suffix · Button · Textarea
- React: `npx facetui@latest add input-group`

| Name | Kind | Notes |
|---|---|---|
| `input-shell` | class | Bordered wrapper; put a bare input or textarea inside |
| `input-shell-addon` | class | Icon, text, kbd or buttons |
| `data-tone="muted"` | addon | Filled prefix/suffix segment |
| `data-block + data-align="block-start\|block-end"` | attribute | Toolbar above or below a textarea |
| `data-invalid / data-disabled` | attribute | States |

Accessibility:
- The inner input still needs a label (visible or aria-label).
- Icon-only addon buttons need an aria-label.

Example (Textarea with toolbar):

```html
<div class="input-shell" data-block style="width:420px">
  <span class="input-shell-addon" data-align="block-start"><span class="t-label-xs text-tertiary"><svg class="icon icon-sm"><use href="#file-text"/></svg> release-notes.md</span></span>
  <textarea placeholder="Ask, search or make anything…" aria-label="Prompt"></textarea>
  <span class="input-shell-addon" data-align="block-end"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach"><svg class="icon icon-sm"><use href="#paperclip"/></svg></button><button class="btn btn-ghost btn-sm"><svg class="icon icon-sm"><use href="#sparkles"/></svg> Auto</button><span class="grow"></span><span class="t-caption text-tertiary">52% used</span><button class="btn btn-sm icon-btn" aria-label="Send"><svg class="icon icon-sm"><use href="#arrow-up"/></svg></button></span>
</div>
```

#### Input OTP

One-time code entry with auto-advance, backspace and paste support.

- Docs page: `#/components/input-otp`
- Figma: Input OTP · OTP Slot
- React: `npx facetui@latest add input-otp`

| Name | Kind | Notes |
|---|---|---|
| `otp` | class | Container; facet.js handles focus movement and paste |

Accessibility:
- Use autocomplete="one-time-code" on the first input in production.
- Label each slot.

Example (6-digit code):

```html
<div class="otp" role="group" aria-label="Verification code">
  <input inputmode="numeric" maxlength="1" aria-label="Digit 1"><input inputmode="numeric" maxlength="1" aria-label="Digit 2"><input inputmode="numeric" maxlength="1" aria-label="Digit 3">
  <span class="sep"></span>
  <input inputmode="numeric" maxlength="1" aria-label="Digit 4"><input inputmode="numeric" maxlength="1" aria-label="Digit 5"><input inputmode="numeric" maxlength="1" aria-label="Digit 6">
</div>
```

#### Label

Accessible text for a control. Clicking it focuses or toggles the control. Shows required and optional markers and dims with a disabled control.

- Docs page: `#/components/label`
- Figma: Label · Default · Required · Optional · Disabled
- React: `npx facetui@latest add label`

| Name | Kind | Notes |
|---|---|---|
| `label` | class | Label text |
| `req · opt` | child class | Required / optional marker |
| `label-row` | class | Inline label around a checkbox, radio or switch |
| `data-disabled` | attribute | Dims the label |

Accessibility:
- Connect with for/id or wrap the control.
- Mark required fields with the required attribute too — the asterisk is visual only.

Example (Labels):

```html
<div class="stack" style="--gap:16px;width:300px">
  <div class="field"><label class="label" for="lb1">Email <span class="req" aria-hidden="true">*</span></label><input class="input" id="lb1" type="email" placeholder="you@company.com" required></div>
  <div class="field"><label class="label" for="lb2">Company <span class="opt">(optional)</span></label><input class="input" id="lb2" placeholder="Northwind"></div>
  <label class="check"><input type="checkbox" checked> <span>Accept terms and conditions</span></label>
  <div class="field"><label class="label" data-disabled="true" for="lb3">Workspace ID</label><input class="input" id="lb3" value="ws_8f2a91" disabled></div>
</div>
```

#### Native Select

The browser's own select, styled to match Facet inputs. Best on mobile, where it opens the system picker.

- Docs page: `#/components/native-select`
- Figma: Native Select · 3 sizes · default · disabled · invalid
- React: `npx facetui@latest add native-select`

| Name | Kind | Notes |
|---|---|---|
| `select · select-sm · select-lg` | class | Sizes |
| `aria-invalid` | attribute | Error state |

Accessibility:
- Native selects get the platform's accessible picker for free.

Example (Sizes & states):

```html
<div class="stack" style="--gap:12px;max-width:320px;margin:auto">
  <div class="field"><label class="label" for="ns1">Country</label><select class="select" id="ns1"><option>United States</option><option>Canada</option><option>Germany</option></select></div>
  <select class="select select-sm" aria-label="Small"><option>Small</option></select>
  <select class="select select-lg" aria-label="Large"><option>Large</option></select>
  <div class="field" data-invalid="true"><label class="label" for="ns2">Role</label><select class="select" id="ns2" aria-invalid="true"><option>Choose a role…</option></select><span class="help">Pick a role to continue.</span></div>
  <select class="select" disabled aria-label="Disabled"><option>Disabled</option></select>
</div>
```

#### Number Stepper

A number input with − and + buttons, min/max/step, and buttons that disable at the limits.

- Docs page: `#/components/number-stepper`
- Figma: Number Stepper · 2 sizes · default · pill · ghost
- React: `npx facetui@latest add number-stepper`

| Name | Kind | Notes |
|---|---|---|
| `min · max · step` | input attributes | Limits and increment |
| `.pill · .sm · .ghost` | class | Variants |

Accessibility:
- It's a real number input, so typing and the keyboard arrows work.

Example (Variants):

```html
<div class="number-stepper"><button data-step="down" aria-label="Decrease"><svg class="icon"><use href="#minus"/></svg></button><input type="number" value="3" min="1" max="10" aria-label="Seats"><button data-step="up" aria-label="Increase"><svg class="icon"><use href="#plus"/></svg></button></div>
<div class="number-stepper pill"><button data-step="down" aria-label="Decrease"><svg class="icon"><use href="#minus"/></svg></button><input type="number" value="1" min="1" max="99" aria-label="Quantity"><button data-step="up" aria-label="Increase"><svg class="icon"><use href="#plus"/></svg></button></div>
<div class="number-stepper sm ghost"><button data-step="down" aria-label="Decrease"><svg class="icon icon-sm"><use href="#minus"/></svg></button><input type="number" value="0.5" min="0" max="2" step="0.25" aria-label="Rate"><button data-step="up" aria-label="Increase"><svg class="icon icon-sm"><use href="#plus"/></svg></button></div>
```

#### Questionnaire

A multi-step question flow for agent clarifications, onboarding and surveys: single or multiple choice, an Other field, freeform answers, skippable steps, number-key shortcuts and a summary.

- Docs page: `#/components/questionnaire`
- Figma: Questionnaire · Q Option · Single · Multiple · Freeform · Summary
- React: `npx facetui@latest add questionnaire`

| Name | Kind | Notes |
|---|---|---|
| `questionnaire > q-step` | class | One step per question |
| `data-required` | step | Hides Skip, Next waits for an answer |
| `data-key` | step | Key used in the summary and facet:submit detail |
| `value="__other" + q-other` | option | Other with free text |
| `data-q-next · data-q-back · data-q-skip` | attribute | Footer controls |
| `facet:submit` | event | { key: answers[] } |

Accessibility:
- Options are real radios/checkboxes inside labels, so screen readers announce the group.
- Number keys 1–9 pick options; Enter continues.

Example (Agent clarification):

```html
<div class="questionnaire" tabindex="-1">
  <div class="q-head"><span class="q-count">1 of 3</span><div class="progress" role="presentation"><div style="width:33%"></div></div><span><svg class="icon icon-sm"><use href="#sparkles"/></svg> Facet AI</span></div>
  <section class="q-step" data-key="Audience" data-required><h4>Who is this report for?</h4><p>I'll adjust depth and tone.</p><div class="q-options" role="radiogroup">
    <label class="q-option"><input type="radio" name="qa" value="Executives"><span class="kbd">1</span><span>Executives<small>One page, headline numbers</small></span><svg class="icon q-check"><use href="#check"/></svg></label>
    <label class="q-option"><input type="radio" name="qa" value="Sales team"><span class="kbd">2</span><span>Sales team<small>Deal-level detail</small></span><svg class="icon q-check"><use href="#check"/></svg></label>
    <label class="q-option"><input type="radio" name="qa" value="Board"><span class="kbd">3</span><span>Board<small>Quarterly trends and risks</small></span><svg class="icon q-check"><use href="#check"/></svg></label>
    <label class="q-option"><input type="radio" name="qa" value="__other"><span class="kbd">4</span><span>Other</span><svg class="icon q-check"><use href="#check"/></svg></label>
  </div><div class="q-other"><input class="input input-sm" placeholder="Describe the audience" aria-label="Other audience"></div></section>
  <section class="q-step" data-key="Include"><h4>What should I include?</h4><p>Pick any. You can skip this.</p><div class="q-options">
    <label class="q-option"><input type="checkbox" value="Pipeline"><span class="kbd">1</span><span>Pipeline by stage</span><svg class="icon q-check"><use href="#check"/></svg></label>
    <label class="q-option"><input type="checkbox" value="Churn risk"><span class="kbd">2</span><span>Churn risk</span><svg class="icon q-check"><use href="#check"/></svg></label>
    <label class="q-option"><input type="checkbox" value="Forecast"><span class="kbd">3</span><span>Forecast vs target</span><svg class="icon q-check"><use href="#check"/></svg></label>
  </div></section>
  <section class="q-step" data-key="Notes"><h4>Anything else?</h4><p>Optional — deadlines, format, things to avoid.</p><textarea class="textarea" rows="3" placeholder="e.g. Keep it under 300 words" aria-label="Notes"></textarea></section>
  <div class="q-foot"><button class="btn btn-ghost btn-sm" data-q-back>Back</button><span class="grow hint hide-sm">Press 1–4 to choose · Enter to continue</span><button class="btn btn-ghost btn-sm" data-q-skip>Skip</button><button class="btn btn-sm" data-q-next>Next</button></div>
  <div class="q-summary"><div class="row" style="gap:8px"><svg class="icon"><use href="#circle-check"/></svg> <b class="t-label-md">Thanks — drafting your report</b></div><dl></dl><button class="btn btn-outline btn-sm" style="margin-top:16px" data-q-restart>Start over</button></div>
</div>
```

#### Radio Button Group

Card-style radios for picking one option, such as a plan — and a compact button style for short options.

- Docs page: `#/components/radio-button-group`
- Figma: Radio Button Group · cards · buttons
- React: `npx facetui@latest add radio-button-group`

| Name | Kind | Notes |
|---|---|---|
| `data-style=buttons` | attribute | Compact button radios |

Accessibility:
- Arrow keys move between radios (native behaviour).

Example (Buttons):

```html
<fieldset class="choice-group" data-style="buttons" style="border:0;padding:0;margin:0;width:340px"><legend class="label" style="margin-bottom:8px">Size</legend><label class="choice"><input type="radio" name="size"><b>XS</b></label><label class="choice"><input type="radio" name="size"><b>S</b></label><label class="choice"><input type="radio" name="size" checked><b>M</b></label><label class="choice"><input type="radio" name="size"><b>L</b></label><label class="choice"><input type="radio" name="size"><b>XL</b></label></fieldset>
```

#### Rich Text Editor

A lightweight editor with a toolbar, a floating bubble on selection and a word count. Swap in Tiptap or Lexical for production.

- Docs page: `#/components/rich-text-editor`
- Figma: Rich Text Editor · toolbar · bubble
- React: `npx facetui@latest add rich-text-editor`

| Name | Kind | Notes |
|---|---|---|
| `[data-cmd]` | bold · italic · underline · strikeThrough · insertUnorderedList · insertOrderedList · link · undo · redo | Toolbar commands |
| `rte-bubble` | class | Floating menu on selection |

Accessibility:
- The editable area has a label; toolbar buttons expose aria-pressed.

Example (Editor):

```html
<div class="rte" style="max-width:640px;margin:auto;position:relative">
  <div class="rte-toolbar">
    <select aria-label="Block style"><option value="p">Paragraph</option><option value="h2">Heading</option><option value="blockquote">Quote</option></select><span class="sep"></span>
    <button class="btn btn-ghost btn-sm icon-btn" data-cmd="bold" aria-label="Bold"><svg class="icon"><use href="#bold"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="italic" aria-label="Italic"><svg class="icon"><use href="#italic"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="underline" aria-label="Underline"><svg class="icon"><use href="#underline"/></svg></button><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="strikeThrough" aria-label="Strikethrough"><svg class="icon"><use href="#strikethrough"/></svg></button><span class="sep"></span>
    <button class="btn btn-ghost btn-sm icon-btn" data-cmd="insertUnorderedList" aria-label="Bulleted list"><svg class="icon"><use href="#list"/></svg></button><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="insertOrderedList" aria-label="Numbered list"><svg class="icon"><use href="#list-ordered"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="link" aria-label="Link"><svg class="icon"><use href="#link"/></svg></button>
    <span class="grow"></span><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="undo" aria-label="Undo"><svg class="icon"><use href="#undo-2"/></svg></button><button class="btn btn-ghost btn-sm icon-btn hide-sm" data-cmd="redo" aria-label="Redo"><svg class="icon"><use href="#redo-2"/></svg></button>
  </div>
  <div class="rte-content" contenteditable="true" data-placeholder="Write something…" aria-label="Editor"><h2>Launch notes</h2><p>Facet v1.2 adds <b>50+ components</b>, style themes and AI agent examples. Select some text to see the bubble menu.</p><ul><li>New charts</li><li>AI chat primitives</li></ul></div>
  <div class="rte-bubble"><button class="btn btn-ghost btn-sm icon-btn" data-cmd="bold" aria-label="Bold"><svg class="icon icon-sm"><use href="#bold"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="italic" aria-label="Italic"><svg class="icon icon-sm"><use href="#italic"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-cmd="link" aria-label="Link"><svg class="icon icon-sm"><use href="#link"/></svg></button></div>
  <div class="rte-foot"><span class="rte-count">0 words</span><span>Saved</span></div>
</div>
```

#### Select

A styled listbox for picking one value (or several) from a list, with groups, icons and a check on the chosen option. Use Native Select on mobile-heavy forms.

- Docs page: `#/components/select`
- Figma: Select · Placeholder · Filled · Hover · Open · Error · Disabled
- React: `npx facetui@latest add select`

| Name | Kind | Notes |
|---|---|---|
| `dropdown[data-select]` | wrapper | Turns a dropdown into a select |
| `data-multiple` | attribute | Multi-select; the menu stays open |
| `select-trigger > .value[data-placeholder]` | class | Shows the selection or placeholder |
| `menu-item[role=option][aria-selected]` | option | Option + selected state |
| `facet:change` | event | detail.value |

Accessibility:
- Trigger has aria-haspopup="listbox"; options use role="option" with aria-selected.
- Arrow keys move, Enter selects, Escape closes.

Example (Multiple):

```html
<div class="dropdown" data-select data-multiple style="width:300px;margin-bottom:220px"><button class="select-trigger" data-dropdown-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Labels"><span class="value" data-placeholder="Add labels"></span><svg class="icon"><use href="#chevrons-up-down"/></svg></button><div class="menu listbox" role="listbox" aria-multiselectable="true"><button class="menu-item" role="option" data-value="bug" aria-selected="true">Bug<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="feature" aria-selected="true">Feature<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="docs" aria-selected="false">Docs<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="design" aria-selected="false">Design<svg class="icon check-mark"><use href="#check"/></svg></button><button class="menu-item" role="option" data-value="perf" aria-selected="false">Performance<svg class="icon check-mark"><use href="#check"/></svg></button></div></div>
```

#### Slider & Progress

Slider picks a value in a range; Progress shows completion of a task.

- Docs page: `#/components/slider`
- Figma: Slider · Progress
- React: `npx facetui@latest add slider`

| Name | Kind | Notes |
|---|---|---|
| `slider` | class (input range) | Track fill follows value via facet.js |
| `--value` | CSS var | Progress width, e.g. 75% |

Accessibility:
- Give sliders an aria-label or visible label.
- Use role=progressbar with aria-valuenow.

Example (Slider & progress):

```html
<div class="stack" style="width:360px;--gap:20px">
  <input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">
  <div class="stack" style="--gap:6px"><div class="row t-label-sm" style="justify-content:space-between"><span>Uploading assets</span><span class="text-tertiary">75%</span></div>
  <div class="progress" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"><span style="--value:75%"></span></div></div>
  <div class="progress progress-sm"><span style="--value:30%"></span></div>
</div>
```

#### Switch

Instant on/off settings. Use a checkbox instead when the change needs a Save button.

- Docs page: `#/components/switch`
- Figma: Switch · SM / MD
- React: `npx facetui@latest add switch`

| Name | Kind | Notes |
|---|---|---|
| `switch` | class (label) | Wrapper |
| `switch-sm` | class | Small size |
| `role="switch"` | attribute | Announces as a switch |

Accessibility:
- Add role="switch" to the input.
- The off state uses bg/control-off (≥3:1) so the track is visible.

Example (Switch):

```html
<label class="switch"><input type="checkbox" role="switch" checked> Auto-sync</label>
<label class="switch"><input type="checkbox" role="switch"> Notifications</label>
<label class="switch switch-sm"><input type="checkbox" role="switch" checked> Small</label>
<label class="switch"><input type="checkbox" role="switch" disabled> Disabled</label>
```

#### Textarea

Multi-line text input with an optional character counter and auto-grow. Uses the same border, focus and error tokens as Input.

- Docs page: `#/components/textarea`
- Figma: Textarea · Default · Focus · Error · Disabled
- React: `npx facetui@latest add textarea`

| Name | Kind | Notes |
|---|---|---|
| `textarea` | class | Base |
| `textarea-wrap + textarea-count` | class | Live counter (uses maxlength) |
| `data-autosize` | attribute | Grows with content |
| `aria-invalid` | attribute | Error state |

Accessibility:
- Link help and error text with aria-describedby.
- The counter is aria-live so screen readers hear the limit.

Example (Textarea):

```html
<div class="stack" style="--gap:16px;width:360px">
  <div class="field"><label class="label" for="ta1">Bio</label><div class="textarea-wrap"><textarea class="textarea" id="ta1" maxlength="160" placeholder="Tell us a little about yourself"></textarea><span class="textarea-count" aria-live="polite"></span></div><span class="help">Shown on your public profile.</span></div>
  <div class="field"><label class="label" for="ta2">Notes (auto-grow)</label><textarea class="textarea" id="ta2" data-autosize rows="2" placeholder="Type a few lines…"></textarea></div>
  <div class="field" data-invalid="true"><label class="label" for="ta3">Reason</label><textarea class="textarea" id="ta3" aria-invalid="true" aria-describedby="ta3h">x</textarea><span class="help" id="ta3h">Please give at least 20 characters.</span></div>
  <textarea class="textarea" disabled aria-label="Disabled">Locked by an admin.</textarea>
</div>
```

### Data display

#### Action Bar

A floating bar that appears when items are selected and offers bulk actions. On small screens labels collapse to icons.

- Docs page: `#/components/action-bar`
- Figma: Action Bar
- React: `npx facetui@latest add action-bar`

| Name | Kind | Notes |
|---|---|---|
| `.floating` | class | Sticks to the bottom of the scroll area and rises in |

Accessibility:
- Announce the selection count with aria-live=polite.
- Escape should clear the selection.

Example (Bulk actions):

```html
<div class="action-bar">
  <span class="count"><b>3</b> selected</span>
  <button class="btn btn-ghost btn-sm"><svg class="icon"><use href="#archive"/></svg> <span class="label-text">Archive</span></button>
  <button class="btn btn-ghost btn-sm"><svg class="icon"><use href="#tag"/></svg> <span class="label-text">Label</span></button>
  <button class="btn btn-ghost btn-sm"><svg class="icon"><use href="#download"/></svg> <span class="label-text">Export</span></button>
  <button class="btn btn-destructive btn-sm"><svg class="icon"><use href="#trash-2"/></svg> <span class="label-text">Delete</span></button>
  <button class="btn btn-ghost btn-sm icon-btn" aria-label="Clear selection"><svg class="icon"><use href="#x"/></svg></button>
</div>
```

#### Activity Timeline & Notifications

Chronological activity and an inbox of notifications.

- Docs page: `#/components/timeline`
- Figma: Activity Timeline · Notification Center
- React: `npx facetui@latest add timeline`

| Name | Kind | Notes |
|---|---|---|
| `timeline > li > .node` | structure | Node + connector line |
| `notif[data-unread]` | class | Unread dot |

Accessibility:
- Use <time datetime> in production.

Example (Timeline & notifications):

```html
<ul class="timeline" style="width:340px">
  <li><span class="node brand"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div><b>AI drafted the launch plan</b><p>12 tasks proposed in Q4 Launch</p><time>2 min ago</time></div></li>
  <li><span class="node"><svg class="icon icon-sm"><use href="#check"/></svg></span><div><b>Maya approved the budget</b><p>$48,000 · Marketing</p><time>1 h ago</time></div></li>
  <li><span class="node"><svg class="icon icon-sm"><use href="#upload-cloud"/></svg></span><div><b>Jordan uploaded 6 files</b><time>Yesterday</time></div></li>
</ul>
<div class="card" style="width:360px">
  <div class="notif" data-unread><span class="avatar avatar-sm av-1">MC</span><div><b>Maya mentioned you</b><p>“Can you review the pricing page copy?”</p><time>5 min ago</time></div></div><hr class="separator">
  <div class="notif"><span class="avatar avatar-sm av-4"><svg class="icon icon-sm"><use href="#credit-card"/></svg></span><div><b>Invoice paid</b><p>INV-2041 · $12,400</p><time>3 h ago</time></div></div>
</div>
```

#### Agenda

A day-by-day list of events with times, colored categories and the current event highlighted.

- Docs page: `#/components/agenda`
- Figma: Agenda · Day · Event
- React: `npx facetui@latest add agenda`

| Name | Kind | Notes |
|---|---|---|
| `agenda-event[data-tone]` | lime · amber · rose · blue | Category color (rail) |
| `.now` | class | Highlights the current event |

Accessibility:
- Use <time datetime> for event times.

Example (Two days):

```html
<div class="agenda" style="max-width:560px;margin:auto">
  <div class="agenda-day"><div class="agenda-date today"><b>18</b><span>Wed · Today</span></div><div class="agenda-list">
    <div class="agenda-event"><time>9:00–9:30</time><div style="min-width:0"><b>Standup</b><span>Product team · Zoom</span></div><span class="avatar-group"><span class="avatar avatar-xs av-1">MC</span><span class="avatar avatar-xs av-2">JR</span></span></div>
    <div class="agenda-event now" data-tone="lime"><time>11:00–12:00</time><div style="min-width:0"><b>Northwind renewal call</b><span>Now · Room 4B</span></div><button class="btn btn-sm">Join</button></div>
    <div class="agenda-event" data-tone="amber"><time>15:30–16:00</time><div style="min-width:0"><b>Design review</b><span>Onboarding v2</span></div></div>
  </div></div>
  <div class="agenda-day"><div class="agenda-date"><b>19</b><span>Thu</span></div><div class="agenda-list">
    <div class="agenda-event" data-tone="rose"><time>All day</time><div style="min-width:0"><b>Offsite — Lisbon</b><span>Leadership team</span></div></div>
  </div></div>
</div>
```

#### Avatar

Represents a person or workspace. Initials fall back automatically to tinted tiles.

- Docs page: `#/components/avatar`
- Figma: Avatar · Avatar Group
- React: `npx facetui@latest add avatar`

| Name | Kind | Notes |
|---|---|---|
| `avatar-sm \| avatar-lg \| avatar-square` | class | Size / shape |
| `data-status` | online \| away \| busy | Presence dot |
| `av-1 … av-5` | class | Fallback tints |

Accessibility:
- Give images alt text; decorative initials can be aria-hidden when the name is adjacent.

Example (Avatars):

```html
<span class="avatar avatar-sm av-1">MC</span>
<span class="avatar av-2" data-status="online">JR</span>
<span class="avatar avatar-lg av-3" data-status="away">AK</span>
<span class="avatar avatar-square av-4">AC</span>
<span class="avatar-group"><span class="avatar av-1">MC</span><span class="avatar av-2">JR</span><span class="avatar av-3">AK</span><span class="avatar av-5">+4</span></span>
```

#### Badge

Short status or metadata labels.

- Docs page: `#/components/badge`
- Figma: Badge · 8 variants × 2 sizes
- React: `npx facetui@latest add badge`

| Name | Kind | Notes |
|---|---|---|
| `badge-{brand\|success\|warning\|danger\|info\|accent\|outline\|solid}` | class | Tone |
| `.dot` | child | Status dot |

Accessibility:
- Don't rely on color alone — the text must say the status.

Example (Variants):

```html
<span class="badge badge-brand">Brand</span>
<span class="badge">Neutral</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-success"><span class="dot"></span>Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Overdue</span>
<span class="badge badge-info">Beta</span>
<span class="badge badge-accent">New</span>
<span class="badge badge-solid">Solid</span>
```

#### Calendar

Month grid for picking dates. Today is outlined, selection uses the brand fill.

- Docs page: `#/components/calendar`
- Figma: Calendar · Date Picker · Date Range Picker
- React: `npx facetui@latest add calendar`

| Name | Kind | Notes |
|---|---|---|
| `cal-day.today \| .muted \| .in-range` | class | Day states |
| `aria-selected="true"` | attribute | Selected day |

Accessibility:
- Production calendars need roving tabindex + arrow-key navigation (react-day-picker provides it).

Example (Calendar):

```html
<div class="card calendar">
  <div class="cal-head"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Previous month"><svg class="icon"><use href="#chevron-left"/></svg></button>October 2026<button class="btn btn-ghost btn-sm icon-btn" aria-label="Next month"><svg class="icon"><use href="#chevron-right"/></svg></button></div>
  <div class="cal-grid" role="grid">
    <span class="dow">Mo</span><span class="dow">Tu</span><span class="dow">We</span><span class="dow">Th</span><span class="dow">Fr</span><span class="dow">Sa</span><span class="dow">Su</span>
    <button class="cal-day muted">28</button><button class="cal-day muted">29</button><button class="cal-day muted">30</button><button class="cal-day">1</button><button class="cal-day">2</button><button class="cal-day">3</button><button class="cal-day">4</button><button class="cal-day">5</button><button class="cal-day">6</button><button class="cal-day">7</button><button class="cal-day">8</button><button class="cal-day">9</button><button class="cal-day">10</button><button class="cal-day">11</button><button class="cal-day">12</button><button class="cal-day">13</button><button class="cal-day">14</button><button class="cal-day today">15</button><button class="cal-day">16</button><button class="cal-day">17</button><button class="cal-day">18</button><button class="cal-day">19</button><button class="cal-day" aria-selected="true">20</button><button class="cal-day">21</button><button class="cal-day">22</button><button class="cal-day">23</button><button class="cal-day">24</button><button class="cal-day">25</button><button class="cal-day">26</button><button class="cal-day">27</button><button class="cal-day">28</button><button class="cal-day">29</button><button class="cal-day">30</button><button class="cal-day">31</button><button class="cal-day muted">1</button>
  </div>
</div>
```

#### Card

Groups related content. Carries the Facet cut — the sharper top-right corner.

- Docs page: `#/components/card`
- Figma: Card · Default / Elevated
- React: `npx facetui@latest add card`

| Name | Kind | Notes |
|---|---|---|
| `card / card-elevated` | class | Container |
| `card-header \| card-body \| card-footer` | class | Sections; padding = layout/card-padding (density-aware) |
| `kpi, kpi-label, kpi-value, delta` | class | Metric card parts |

Accessibility:
- If the entire card is clickable, use one link and keep other actions outside it.

Example (Card):

```html
<div class="card" style="width:380px">
  <div class="card-header"><div class="grow"><div class="card-title">Northwind renewal</div><div class="card-desc">Enterprise · closes Nov 30</div></div><span class="badge badge-success">On track</span></div>
  <div class="card-body t-body-sm text-secondary">Legal review finished. Waiting on procurement to confirm seat count before sending the order form.</div>
  <div class="card-footer"><button class="btn btn-ghost btn-sm">Dismiss</button><button class="btn btn-sm">Open deal</button></div>
</div>
```

#### Carousel

Swipeable slides with scroll-snap, arrow buttons and dots. Add data-peek to show part of the next slide on wider screens.

- Docs page: `#/components/carousel`
- Figma: Carousel · Slide · Dots
- React: `npx facetui@latest add carousel`

| Name | Kind | Notes |
|---|---|---|
| `data-peek` | attribute | 46% slides from 640px |
| `data-autoplay` | ms | Advance automatically (pauses on hover) |

Accessibility:
- Don't autoplay content people need to read.
- Arrow buttons have labels; dots are buttons.

Example (Peek):

```html
<div class="carousel" data-peek style="max-width:640px;margin:auto">
  <div class="carousel-track">
    <div class="carousel-slide"><div><b>Facet cut</b><span>The signature corner</span></div></div>
    <div class="carousel-slide" style="background:linear-gradient(135deg,var(--lagoon-500),var(--lagoon-800))"><div><b>6 brands</b><span>Switch with one variable</span></div></div>
    <div class="carousel-slide" style="background:linear-gradient(135deg,var(--ember-500),var(--rose-700))"><div><b>Live code</b><span>Tokens, CSS and React</span></div></div>
    <div class="carousel-slide" style="background:linear-gradient(135deg,var(--ink-700),var(--ink-950))"><div><b>Dark mode</b><span>Every component</span></div></div>
  </div>
  <button class="btn btn-outline btn-sm icon-btn carousel-nav prev" aria-label="Previous"><svg class="icon"><use href="#chevron-left"/></svg></button>
  <button class="btn btn-outline btn-sm icon-btn carousel-nav next" aria-label="Next"><svg class="icon"><use href="#chevron-right"/></svg></button>
  <div class="carousel-dots"></div>
</div>
```

#### Data Grid

A spreadsheet-like grid: select a cell, move with arrow keys, press Enter or double-click to edit. Totals recalculate. Sticky header and first column.

- Docs page: `#/components/data-grid`
- Figma: Data Grid · Cell · Header
- React: `npx facetui@latest add data-grid`

| Name | Kind | Notes |
|---|---|---|
| `td[data-edit]` | attribute | Editable cell |
| `td[data-sum]` | column index | Live total of a column |
| `.fx` | class | Formula bar mirrors the selected cell |

Accessibility:
- Use role=grid with aria-rowindex/colindex for large production grids.
- Arrow keys move, Enter/F2 edits, Escape cancels.

Example (Editable):

```html
<div class="data-grid" tabindex="0" style="max-width:100%">
  <div class="data-grid-bar"><span class="badge badge-outline fx-ref mono">B2</span><span class="fx"><i>fx</i><span>$12,400</span></span><button class="btn btn-outline btn-sm"><svg class="icon"><use href="#plus"/></svg> Row</button></div>
  <table><thead><tr><th class="rownum"></th><th>Account</th><th class="num">MRR</th><th class="num">Seats</th><th>Owner</th><th>Status</th></tr></thead><tbody>
    <tr><td class="rownum">1</td><td data-edit>Northwind</td><td class="num" data-edit>12,400</td><td class="num" data-edit>120</td><td data-edit>Maya</td><td><span class="badge badge-success"><span class="dot"></span>Active</span></td></tr>
    <tr><td class="rownum">2</td><td data-edit>Globex</td><td class="num" data-edit>8,950</td><td class="num" data-edit>85</td><td data-edit>Jonas</td><td><span class="badge badge-warning"><span class="dot"></span>Renewal</span></td></tr>
    <tr><td class="rownum">3</td><td data-edit>Initech</td><td class="num" data-edit>6,120</td><td class="num" data-edit>60</td><td data-edit>Aiko</td><td><span class="badge badge-success"><span class="dot"></span>Active</span></td></tr>
    <tr><td class="rownum">4</td><td data-edit>Umbrella</td><td class="num" data-edit>2,115</td><td class="num" data-edit>20</td><td data-edit>Maya</td><td><span class="badge badge-danger"><span class="dot"></span>At risk</span></td></tr>
    <tr><td class="rownum">Σ</td><td><b>Total</b></td><td class="num formula" data-sum="2" data-prefix="$"></td><td class="num formula" data-sum="3"></td><td></td><td></td></tr>
  </tbody></table>
</div>
```

#### Data Table

Tabular data with selection, numeric alignment and row actions. Row height follows the Density mode.

- Docs page: `#/components/table`
- Figma: Data Table · Table Row · Header Cell
- React: `npx facetui@latest add table`

| Name | Kind | Notes |
|---|---|---|
| `table-wrap` | class | Scroll container with border + facet cut |
| `num` | class (td/th) | Right-aligned tabular numbers |
| `aria-selected="true"` | tr attribute | Selected row |

Accessibility:
- Use real <table> markup with <th> headers.
- Sortable headers should be buttons with aria-sort on the th.

Example (Table):

```html
<div class="table-wrap">
<table class="table">
  <thead><tr><th style="width:40px"><label class="check"><input type="checkbox" aria-label="Select all"></label></th><th><button>Customer <svg class="icon icon-sm"><use href="#chevrons-up-down"/></svg></button></th><th>Status</th><th class="num">MRR</th><th style="width:48px"></th></tr></thead>
  <tbody>
    <tr aria-selected="true"><td><label class="check"><input type="checkbox" checked aria-label="Select row"></label></td><td><div class="cell-user"><span class="avatar avatar-sm av-1">NW</span><div><b>Northwind</b><span>ops@northwind.io</span></div></div></td><td><span class="badge badge-success"><span class="dot"></span>Active</span></td><td class="num">$12,400</td><td><button class="btn btn-ghost btn-sm icon-btn" aria-label="Row actions"><svg class="icon"><use href="#more-horizontal"/></svg></button></td></tr>
    <tr><td><label class="check"><input type="checkbox" aria-label="Select row"></label></td><td><div class="cell-user"><span class="avatar avatar-sm av-2">GL</span><div><b>Globex</b><span>finance@globex.com</span></div></div></td><td><span class="badge badge-warning">Trial</span></td><td class="num">$3,150</td><td><button class="btn btn-ghost btn-sm icon-btn" aria-label="Row actions"><svg class="icon"><use href="#more-horizontal"/></svg></button></td></tr>
    <tr><td><label class="check"><input type="checkbox" aria-label="Select row"></label></td><td><div class="cell-user"><span class="avatar avatar-sm av-3">IN</span><div><b>Initech</b><span>it@initech.co</span></div></div></td><td><span class="badge badge-danger">Past due</span></td><td class="num">$890</td><td><button class="btn btn-ghost btn-sm icon-btn" aria-label="Row actions"><svg class="icon"><use href="#more-horizontal"/></svg></button></td></tr>
  </tbody>
</table></div>
```

#### File Tree

A nested, collapsible tree of folders and files with indent guides, selection and status dots.

- Docs page: `#/components/file-tree`
- Figma: File Tree · Folder · File
- React: `npx facetui@latest add file-tree`

| Name | Kind | Notes |
|---|---|---|
| `details/summary.ft-row` | element | Folder (native open/close) |
| `ft-row[aria-selected]` | attribute | Selected item |
| `.ft-dot / .meta` | class | Status dot / trailing metadata |

Accessibility:
- For large trees use role=tree with arrow-key navigation.

Example (Project files):

```html
<div class="card file-tree" style="width:280px">
  <ul>
    <li><details open><summary class="ft-row"><svg class="icon chev"><use href="#chevron-right"/></svg><svg class="icon folder-closed"><use href="#folder"/></svg><svg class="icon folder-open"><use href="#folder-open"/></svg>src</summary>
      <ul>
        <li><details open><summary class="ft-row"><svg class="icon chev"><use href="#chevron-right"/></svg><svg class="icon folder-closed"><use href="#folder"/></svg><svg class="icon folder-open"><use href="#folder-open"/></svg>components</summary>
          <ul><li><div class="ft-row" aria-selected="true"><svg class="icon"><use href="#file-code"/></svg>button.tsx<span class="ft-dot" title="Modified"></span></div></li><li><div class="ft-row"><svg class="icon"><use href="#file-code"/></svg>card.tsx</div></li></ul></details></li>
        <li><div class="ft-row"><svg class="icon"><use href="#file-code"/></svg>tokens.css<span class="meta">16 KB</span></div></li>
      </ul></details></li>
    <li><details><summary class="ft-row"><svg class="icon chev"><use href="#chevron-right"/></svg><svg class="icon folder-closed"><use href="#folder"/></svg><svg class="icon folder-open"><use href="#folder-open"/></svg>public</summary><ul><li><div class="ft-row"><svg class="icon"><use href="#file-image"/></svg>logo.svg</div></li></ul></details></li>
    <li><div class="ft-row"><svg class="icon"><use href="#file-text"/></svg>README.md</div></li>
  </ul>
</div>
```

#### Floating TOC

A minimal table of contents: short bars mark each heading and expand into a panel on hover or focus. The active heading follows the scroll.

- Docs page: `#/components/floating-toc`
- Figma: Floating TOC · collapsed · open
- React: `npx facetui@latest add floating-toc`

| Name | Kind | Notes |
|---|---|---|
| `a.lvl-2` | class | Second-level heading |
| `a.on` | class | Active heading |

Accessibility:
- The panel opens on keyboard focus, not only on hover.

Example (Hover the bars):

```html
<div style="display:flex;gap:16px;align-items:flex-start;min-height:200px">
  <nav class="floating-toc" aria-label="On this page">
    <a href="#ftoc-a" class="on"></a><a href="#ftoc-b" class="lvl-2"></a><a href="#ftoc-c" class="lvl-2"></a><a href="#ftoc-d"></a>
    <div class="floating-toc-panel"><a href="#ftoc-a" class="on">Overview</a><a href="#ftoc-b" class="lvl-2">Installation</a><a href="#ftoc-c" class="lvl-2">Theming</a><a href="#ftoc-d">API reference</a></div>
  </nav>
  <div class="t-body-sm text-tertiary" style="max-width:360px">Hover or tab into the bars on the left. In a real page each link points at a heading id, and the active bar follows the scroll position.</div>
</div>
```

#### Holo Card

A card that tilts in 3D with a holographic glare that follows the pointer — for memberships, passes and collectibles. Flat when motion is reduced.

- Docs page: `#/components/holo-card`
- Figma: Holo Card · membership · credit
- React: `npx facetui@latest add holo-card`

| Name | Kind | Notes |
|---|---|---|
| `--holo-bg` | CSS var | Card background gradient |
| `data-static` | attribute | Turns off tilt and glare |
| `data-tilt` | number | Max tilt in degrees (default 14) |

Accessibility:
- Keep text contrast high — the glare is decorative only.
- Respects prefers-reduced-motion.

Example (Membership & card):

```html
<div class="holo-card"><div class="holo-surface"><span class="holo-inset"></span><div class="row" style="justify-content:space-between"><b class="t-label-lg">Facet Pro</b><span class="badge badge-accent">Founding member</span></div><div><div class="t-caption" style="opacity:.75">Member since 2026</div><div class="holo-num">MAYA RODRIGUEZ</div></div></div></div>
<div class="holo-card" style="--holo-bg:linear-gradient(135deg,#0b2e2b,#0f6b64 50%,#06201e)"><div class="holo-surface"><span class="holo-inset"></span><div class="row" style="justify-content:space-between"><span class="holo-chip"></span><b class="t-label-md">Northwind Bank</b></div><div><div class="holo-num">4242 •••• •••• 9018</div><div class="row" style="justify-content:space-between;margin-top:8px"><span class="t-caption" style="opacity:.8">M. RODRIGUEZ</span><span class="t-caption" style="opacity:.8">08/28</span></div></div></div></div>
```

#### Item Card

A horizontal row card with an icon, title, description and an optional trailing action (switch, select, chevron).

- Docs page: `#/components/item-card`
- Figma: Item Card · 5 variants · Show icon
- React: `npx facetui@latest add item-card`

| Name | Kind | Notes |
|---|---|---|
| `data-variant` | default · secondary · tertiary · outline · transparent | Surface style |
| `a.item-card / [data-pressable]` | element | Pressable rows get a hover state |

Accessibility:
- When the whole card is a link, don't put other buttons inside it.

Example (Variants):

```html
<div class="stack" style="--gap:10px;max-width:440px;margin:auto">
  <div class="item-card"><span class="item-card-icon brand"><svg class="icon"><use href="#shield-check"/></svg></span><div class="item-card-content"><span class="item-card-title">Two-factor authentication</span><span class="item-card-desc">Protect your account with an authenticator app</span></div><div class="item-card-action"><label class="switch"><input type="checkbox" role="switch" checked aria-label="Two-factor"></label></div></div>
  <div class="item-card" data-variant="secondary"><span class="item-card-icon"><svg class="icon"><use href="#smartphone"/></svg></span><div class="item-card-content"><span class="item-card-title">iPhone 16 Pro</span><span class="item-card-desc">Last active 2 min ago · San Francisco</span></div><div class="item-card-action"><span class="badge badge-success"><span class="dot"></span>This device</span></div></div>
  <a class="item-card" data-variant="outline" href="#"><span class="item-card-icon"><svg class="icon"><use href="#credit-card"/></svg></span><div class="item-card-content"><span class="item-card-title">Visa ending 4242</span><span class="item-card-desc">Expires 08/28</span></div><div class="item-card-action"><svg class="icon"><use href="#chevron-right"/></svg></div></a>
  <div class="item-card" data-variant="transparent"><div class="item-card-content"><span class="item-card-title">Title only, no icon</span></div><div class="item-card-action"><select class="select select-sm" style="width:auto" aria-label="Frequency"><option>Weekly</option><option>Daily</option></select></div></div>
</div>
```

#### Item Card Group

Arranges item cards as a spaced list, a joined list with dividers, or a responsive grid, with an optional section header.

- Docs page: `#/components/item-card-group`
- Figma: Item Card Group · joined · list · grid
- React: `npx facetui@latest add item-card-group`

| Name | Kind | Notes |
|---|---|---|
| `item-card-group` | class | Spaced list |
| `.joined` | class | One card with dividers |
| `.grid` | class | Responsive grid |

Accessibility:
- Use a list (ul/li) when the group is a navigational list.

Example (Joined (settings list)):

```html
<div class="item-card-group joined" style="max-width:440px;margin:auto">
  <header>Notifications</header>
  <div class="item-card"><span class="item-card-icon"><svg class="icon"><use href="#mail"/></svg></span><div class="item-card-content"><span class="item-card-title">Email</span><span class="item-card-desc">Weekly digest and mentions</span></div><div class="item-card-action"><label class="switch"><input type="checkbox" role="switch" checked aria-label="Email"></label></div></div>
  <div class="item-card"><span class="item-card-icon"><svg class="icon"><use href="#bell"/></svg></span><div class="item-card-content"><span class="item-card-title">Push</span><span class="item-card-desc">Only direct messages</span></div><div class="item-card-action"><label class="switch"><input type="checkbox" role="switch" aria-label="Push"></label></div></div>
  <div class="item-card"><span class="item-card-icon"><svg class="icon"><use href="#message-square"/></svg></span><div class="item-card-content"><span class="item-card-title">Slack</span><span class="item-card-desc">#sales-alerts</span></div><div class="item-card-action"><svg class="icon"><use href="#chevron-right"/></svg></div></div>
</div>
```

#### Kanban

Board column and draggable task cards.

- Docs page: `#/components/kanban`
- Figma: Kanban Card · Kanban Column
- React: `npx facetui@latest add kanban`

| Name | Kind | Notes |
|---|---|---|
| `kanban-col / kanban-card` | class | Parts |

Accessibility:
- Support keyboard moves (Space to lift, arrows to move) — dnd-kit provides this.

Example (Kanban):

```html
<div class="kanban-col">
  <header><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--chart-1)"></span>In progress <span class="badge">3</span></header>
  <article class="kanban-card"><div class="row" style="--gap:6px"><span class="badge badge-brand">Design</span><span class="badge badge-danger">P1</span></div><b>Redesign onboarding</b><div class="progress progress-sm"><span style="--value:75%"></span></div><footer><span class="row" style="--gap:4px"><svg class="icon icon-sm"><use href="#calendar"/></svg> Oct 24</span><span class="avatar-group"><span class="avatar avatar-sm av-1">MC</span><span class="avatar avatar-sm av-2">JR</span></span></footer></article>
  <article class="kanban-card"><div class="row" style="--gap:6px"><span class="badge badge-info">Eng</span></div><b>Billing webhooks retry</b><footer><span class="row" style="--gap:4px"><svg class="icon icon-sm"><use href="#message-square"/></svg> 4</span><span class="avatar avatar-sm av-3">AK</span></footer></article>
</div>
```

#### Kbd, Spinner, Skeleton, Separator

Small utilities used across the system.

- Docs page: `#/components/kbd`
- Figma: Kbd · Spinner · Skeleton · Separator
- React: `npx facetui@latest add kbd`

| Name | Kind | Notes |
|---|---|---|
| `kbd \| spinner \| skeleton \| separator` | class | — |

Accessibility:
- Spinners need role=status and a label.

Example (Utilities):

```html
<div class="stack" style="width:360px;--gap:16px">
  <div class="row"><span class="kbd">⌘</span><span class="kbd">K</span><span class="t-body-sm text-tertiary">to search</span><span class="spinner text-brand" role="status" aria-label="Loading"></span></div>
  <hr class="separator">
  <div class="row" style="--gap:12px"><div class="skeleton" style="width:40px;height:40px;border-radius:50%"></div><div class="stack grow" style="--gap:8px"><div class="skeleton" style="height:12px;width:70%"></div><div class="skeleton" style="height:12px;width:45%"></div></div></div>
</div>
```

#### KPI

A key number with its label, trend and optional sparkline, progress or footer.

- Docs page: `#/components/kpi`
- Figma: KPI · Default · Sparkline · Icon + Footer · Progress
- React: `npx facetui@latest add kpi`

| Name | Kind | Notes |
|---|---|---|
| `kpi-head · kpi-icon[data-status] · kpi-row · kpi-value · kpi-footer · kpi-progress` | class | Parts |
| `chart type spark` | chart | Sparkline with no axes |

Accessibility:
- Don't encode trend only with color — the chip shows an arrow and a sign.

Example (Variants):

```html
<div class="card kpi" style="width:260px"><div class="kpi-head"><span class="kpi-label">Monthly recurring revenue</span><button class="btn btn-ghost btn-sm icon-btn" aria-label="More"><svg class="icon"><use href="#more-horizontal"/></svg></button></div><div class="kpi-row"><span class="kpi-value">$248,920</span><span class="trend-chip"><svg class="icon"><use href="#trending-up"/></svg> 12.4%</span></div><div class="chart" data-chart='{"type":"spark","height":48,"tooltip":false,"series":[{"name":"MRR","data":[142,151,158,166,171,183,190,204,212,226,238,249]}]}' style="margin-top:8px"></div></div>
<div class="card kpi" style="width:260px"><div class="kpi-head"><span class="kpi-icon" data-status="success"><svg class="icon"><use href="#users"/></svg></span><span class="kpi-label">Active customers</span></div><div class="kpi-row"><span class="kpi-value">1,284</span><span class="trend-chip"><svg class="icon"><use href="#trending-up"/></svg> 3.1%</span></div><div class="kpi-footer"><span>vs. last month</span><span>+39</span></div></div>
<div class="card kpi" style="width:260px"><div class="kpi-head"><span class="kpi-icon" data-status="warning"><svg class="icon"><use href="#gauge"/></svg></span><span class="kpi-label">Quota attainment</span></div><div class="kpi-row"><span class="kpi-value">72%</span><span class="trend-chip" data-trend="neutral"><svg class="icon"><use href="#minus"/></svg> 0.0%</span></div><div class="progress progress-sm kpi-progress"><span style="--value:72%"></span></div></div>
```

#### KPI Group

Several KPIs joined into one card with shared dividers. It wraps to two columns, then one, on smaller screens.

- Docs page: `#/components/kpi-group`
- Figma: KPI Group · 2–5 items
- React: `npx facetui@latest add kpi-group`

| Name | Kind | Notes |
|---|---|---|
| `kpi-group` | class | Grid container with joined borders |

Accessibility:
- Order KPIs by importance — on mobile they stack in source order.

Example (Four metrics):

```html
<div class="kpi-group" style="width:100%">
  <div class="kpi"><span class="kpi-label">MRR</span><div class="kpi-row"><span class="kpi-value">$248.9k</span><span class="trend-chip"><svg class="icon"><use href="#trending-up"/></svg> 12.4%</span></div></div>
  <div class="kpi"><span class="kpi-label">Customers</span><div class="kpi-row"><span class="kpi-value">1,284</span><span class="trend-chip"><svg class="icon"><use href="#trending-up"/></svg> 3.1%</span></div></div>
  <div class="kpi"><span class="kpi-label">Net retention</span><div class="kpi-row"><span class="kpi-value">118%</span><span class="trend-chip"><svg class="icon"><use href="#trending-up"/></svg> 2 pt</span></div></div>
  <div class="kpi"><span class="kpi-label">Churn</span><div class="kpi-row"><span class="kpi-value">2.4%</span><span class="trend-chip" data-trend="down"><svg class="icon"><use href="#trending-up"/></svg> 0.3 pt</span></div></div>
</div>
```

#### List View

A selectable list of rows with a leading avatar or icon, two lines of text and trailing metadata — for inboxes, files and people.

- Docs page: `#/components/list-view`
- Figma: List View · List Row
- React: `npx facetui@latest add list-view`

| Name | Kind | Notes |
|---|---|---|
| `list-row[aria-selected]` | attribute | Selected row with the signal rail |
| `.hide-sm` | class | Hidden when the list is under 420px wide |

Accessibility:
- Use role=listbox with aria-selected for single-select lists.

Example (Selectable):

```html
<div class="list-view" style="max-width:520px;margin:auto">
  <div class="list-view-head"><svg class="icon"><use href="#inbox"/></svg> Inbox <span class="badge" style="margin-left:auto">12 unread</span></div>
  <div class="list-row" data-interactive aria-selected="true"><span class="avatar av-1">MC</span><div class="list-main"><b>Maya Chen</b><span>Q4 pricing proposal — final numbers attached</span></div><span class="list-meta">9:41</span></div>
  <div class="list-row" data-interactive><span class="avatar av-3">JR</span><div class="list-main"><b>Jonas Richter</b><span>Re: Security review for Globex</span></div><span class="list-meta hide-sm">Yesterday</span></div>
  <div class="list-row" data-interactive><span class="avatar av-4">AK</span><div class="list-main"><b>Aiko Kato</b><span>Design sync notes and next steps</span></div><span class="list-meta hide-sm">Mon</span></div>
</div>
```

#### Map

A lightweight, illustrative map surface with pins, a popup, an animated route and zoom controls. Swap the base for real tiles (Mapbox, MapLibre) in production.

- Docs page: `#/components/map`
- Figma: Map · Pin · Popup · Controls
- React: `npx facetui@latest add map`

| Name | Kind | Notes |
|---|---|---|
| `map-pin[data-popup]` | id | Toggles the popup |
| `map-controls [data-zoom]` | in \| out | Zoom the map layer |
| `.route` | class | Animated dashed route |

Accessibility:
- Provide the same information as text (address, ETA) next to the map.

Example (Route with pins):

```html
<div class="map" style="height:320px;max-width:720px;margin:auto">
  <div class="map-layer" style="position:absolute;inset:0"><svg class="map-base" viewBox="0 0 720 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path class="water" d="M0 230 C120 210 180 260 300 250 S520 200 720 240 V320 H0Z"/><rect class="park" x="430" y="40" width="150" height="90" rx="18"/><circle class="park" cx="120" cy="90" r="46"/>
    <path class="road" d="M-10 150 H730"/><path class="road" d="M260 -10 V330"/><path class="road minor" d="M-10 70 C200 60 420 110 730 90"/><path class="road minor" d="M520 -10 C500 120 560 200 540 330"/><path class="road minor" d="M80 -10 C110 120 60 220 120 330"/>
    <path class="route" d="M150 190 C220 150 250 150 260 150 S400 150 470 135 S560 115 598 112"/>
  </svg>
  <span class="map-dot" style="left:21%;top:59%"></span>
  <span class="map-pin" style="left:83%;top:36%" data-popup="mp1"><svg class="icon"><use href="#map-pin"/></svg></span>
  <span class="map-pin alt" style="left:36%;top:47%"><svg class="icon"><use href="#coffee"/></svg></span>
  <div class="map-popup" id="mp1" style="left:78%;top:36%"><b>Northwind HQ</b>14 min · 3.2 mi via Market St</div></div>
  <div class="map-controls"><button data-zoom="in" aria-label="Zoom in"><svg class="icon"><use href="#plus"/></svg></button><button data-zoom="out" aria-label="Zoom out"><svg class="icon"><use href="#minus"/></svg></button></div>
  <span class="map-chip"><svg class="icon icon-sm"><use href="#navigation"/></svg> 14 min · Fastest route</span>
</div>
```

#### Pricing Card

Plan comparison for marketing and upgrade flows.

- Docs page: `#/components/pricing`
- Figma: Pricing Card
- React: `npx facetui@latest add pricing`

| Name | Kind | Notes |
|---|---|---|
| `pricing / pricing.featured` | class | Card + highlighted plan |

Accessibility:
- Make the price readable as text, not an image.

Example (Pricing):

```html
<div class="card pricing" data-tilt="3" style="width:280px"><div><b class="t-h4">Starter</b><p class="t-body-sm text-tertiary">For small teams</p></div><div class="price">$0<small> /user/mo</small></div><button class="btn btn-outline btn-block">Get started</button><ul><li><svg class="icon"><use href="#check"/></svg>Up to 5 projects</li><li><svg class="icon"><use href="#check"/></svg>Basic analytics</li></ul></div>
<div class="card pricing featured" data-tilt="3" style="width:280px"><div class="row" style="justify-content:space-between"><b class="t-h4">Growth</b><span class="badge badge-accent">Popular</span></div><div class="price">$24<small> /user/mo</small></div><button class="btn btn-block">Start free trial</button><ul><li><svg class="icon"><use href="#check"/></svg>Unlimited projects</li><li><svg class="icon"><use href="#check"/></svg>AI copilot</li><li><svg class="icon"><use href="#check"/></svg>Advanced permissions</li></ul></div>
```

#### Widget

A dashboard container: a soft outer shell with a title, description and legend, and an elevated content area for a chart, table or KPIs.

- Docs page: `#/components/widget`
- Figma: Widget · Header · Content · Footer · Legend
- React: `npx facetui@latest add widget`

| Name | Kind | Notes |
|---|---|---|
| `widget · widget-header · widget-title · widget-desc · widget-content · widget-footer` | class | Parts |
| `widget-content.flush` | class | Edge-to-edge content (tables) |
| `widget-grid` | class | Responsive grid of widgets |

Accessibility:
- Use a real heading (h2/h3) for the title if widgets are page sections.

Example (Dashboard grid):

```html
<div class="widget-grid" style="width:100%">
  <div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Plan mix</span><span class="widget-desc">Active subscriptions</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"pie","size":180,"format":"compact","centerSub":"Accounts","data":[{"name":"Scale","value":214},{"name":"Growth","value":512},{"name":"Starter","value":558}]}'></div></div>
</div>
  <div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Goals</span><span class="widget-desc">Q4 progress</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"radial","size":180,"format":"percent","data":[{"name":"Revenue","value":82},{"name":"Pipeline","value":64}]}'></div></div>
</div>
</div>
```

### Charts

#### Area Chart

Shows a trend over time with a filled area. Stack several series to show composition. Hover to see exact values.

- Docs page: `#/components/area-chart`
- Figma: Chart · Area · Default · Stacked · Gaps
- React: `npx facetui@latest add area-chart`

| Name | Kind | Notes |
|---|---|---|
| `data-chart` | JSON | Config: type, labels, series[{name, data, color?}], format, stacked, curve, connectNulls, height |
| `format` | string | currency · $compact · compact · percent |
| `stacked` | boolean | Stack area series on top of each other |
| `connectNulls` | boolean | Bridge gaps (null) instead of breaking the line |

Accessibility:
- The SVG has role=img and an aria-label — set it with the label option.
- Pair charts with a visible summary (title, key number) so they're not the only source of the data.

Example (Gaps & straight lines):

```html
<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Uptime checks</span><span class="widget-desc">Missing points are left as gaps</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"area","curve":false,"labels":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],"format":"percent","max":100,"series":[{"name":"Uptime","data":[99.2,99.8,null,98.9,99.6,99.9,99.7],"color":"var(--chart-5)"}]}'></div></div>
</div>
```

#### Bar Chart

Compares values across categories. Use grouped bars to compare series, stacked bars to show totals and parts.

- Docs page: `#/components/bar-chart`
- Figma: Chart · Bar · Default · Grouped · Stacked
- React: `npx facetui@latest add bar-chart`

| Name | Kind | Notes |
|---|---|---|
| `type` | "bar" | Vertical bars |
| `stacked` | boolean | Stack series per category |
| `barWidth` | 0–1 | Share of each category band used by bars (default 0.62) |

Accessibility:
- Hovering a bar dims the others; the tooltip lists every series value for that category.

Example (Default):

```html
<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Weekly signups</span><span class="widget-desc">Last 8 weeks</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"bar","labels":["W1","W2","W3","W4","W5","W6","W7","W8"],"series":[{"name":"Signups","data":[420,510,470,640,590,720,680,810]}]}'></div></div>
</div>
```

#### Chart Tooltip

The floating panel that shows exact values under the cursor. Every Facet chart includes it; it's also available as plain markup for custom charts.

- Docs page: `#/components/chart-tooltip`
- Figma: Chart Tooltip · 1, 2 or 3 rows
- React: `npx facetui@latest add chart-tooltip`

| Name | Kind | Notes |
|---|---|---|
| `tooltip` | boolean | Set false in a chart config to hide it |
| `.chart-tooltip.on` | class | Visible state |

Accessibility:
- Tooltips are a convenience — key numbers should also be visible without hovering.

Example (Static markup):

```html
<div class="chart-tooltip on" style="position:static">
  <b>October 2026</b>
  <div><i style="--c:var(--chart-1)"></i>Revenue<span>$238,400</span></div>
  <div><i style="--c:var(--chart-2)"></i>Expansion<span>$68,100</span></div>
  <div><i style="--c:var(--chart-6)"></i>Churned<span>−$4,900</span></div>
</div>
```

#### Charts

Chart colors come from chart/1–6 tokens, so charts re-theme with the brand. Use any chart library and map its palette to these variables.

- Docs page: `#/components/charts`
- Figma: Chart Bar · Chart Area · Chart Donut · Legend
- React: `npx facetui@latest add charts`

| Name | Kind | Notes |
|---|---|---|
| `--chart-1 … --chart-6` | CSS vars | Categorical palette (chart/1 follows brand) |

Accessibility:
- Provide a data table or summary text for screen readers.
- Don't encode meaning by color alone; add labels or patterns.

Example (Bar chart (CSS)):

```html
<div class="card card-body" style="max-width:560px;margin:auto">
  <div class="row" style="justify-content:space-between;margin-bottom:16px"><div><div class="card-title">Revenue</div><div class="card-desc">Last 8 weeks</div></div><div class="legend"><span><i style="--c:var(--chart-1)"></i>New</span><span><i style="--c:var(--chart-2)"></i>Expansion</span></div></div>
  <div class="bars"><div><i style="--h:46%"></i><span>W1</span></div><div><i style="--h:58%"></i><span>W2</span></div><div><i style="--h:52%" class="alt"></i><span>W3</span></div><div><i style="--h:70%"></i><span>W4</span></div><div><i style="--h:64%"></i><span>W5</span></div><div><i style="--h:82%" class="alt"></i><span>W6</span></div><div><i style="--h:76%"></i><span>W7</span></div><div><i style="--h:94%"></i><span>W8</span></div></div>
</div>
```

#### Composed Chart

Combines bars and lines on the same axes — for example volume as bars and a rate or average as a line.

- Docs page: `#/components/composed-chart`
- Figma: Chart / Composed
- React: `npx facetui@latest add composed-chart`

| Name | Kind | Notes |
|---|---|---|
| `series[].type` | "bar" \| "line" \| "area" | Per-series mark type |

Accessibility:
- Explain both measures in the widget description when they use different units.

Example (Bars + line):

```html
<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Orders and conversion</span><span class="widget-desc">Last 8 weeks</span></div><div class="chart-legend"><span><i style="--c:var(--chart-1)"></i>Orders</span><span><i style="--c:var(--chart-4)"></i>Avg. order</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"composed","labels":["W1","W2","W3","W4","W5","W6","W7","W8"],"series":[{"name":"Orders","data":[320,410,380,520,470,610,580,690],"type":"bar"},{"name":"Avg. order (×10)","data":[410,420,405,440,452,470,468,492],"type":"line","color":"var(--chart-4)","dots":true}]}'></div></div>
</div>
```

#### Line Chart

Shows how one or more values change over time. Dashed lines work well for targets and forecasts.

- Docs page: `#/components/line-chart`
- Figma: Chart/Line · Single · Multiple · Target
- React: `npx facetui@latest add line-chart`

| Name | Kind | Notes |
|---|---|---|
| `series[].dashed` | boolean | Dashed stroke for targets/forecasts |
| `series[].dots` | boolean | Show a dot on every point |
| `curve` | boolean | Smooth curves (default) or straight segments |

Accessibility:
- Don't rely on color alone: dashed vs. solid separates targets from actuals.

Example (With target and dots):

```html
<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Net revenue retention</span><span class="widget-desc">Quarterly</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"line","labels":["Q1 25","Q2 25","Q3 25","Q4 25","Q1 26","Q2 26","Q3 26"],"format":"percent","series":[{"name":"NRR","data":[104,107,106,111,114,116,118],"dots":true},{"name":"Target","data":[110,110,110,110,115,115,115],"dashed":true,"color":"var(--chart-6)"}]}'></div></div>
</div>
```

#### Pie Chart

Shows parts of a whole. Prefer the donut with a total in the middle; keep it to six slices or fewer.

- Docs page: `#/components/pie-chart`
- Figma: Chart / Pie · Donut
- React: `npx facetui@latest add pie-chart`

| Name | Kind | Notes |
|---|---|---|
| `data` | [{name, value, color?}] | Slices |
| `donut` | boolean | Donut (default) or full pie |
| `centerLabel / centerSub` | string | Text in the middle of the donut |

Accessibility:
- The legend shows the percentage of each slice as text.

Example (Pie):

```html
<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Traffic sources</span><span class="widget-desc">Last 30 days</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"pie","donut":false,"size":200,"data":[{"name":"Organic","value":46},{"name":"Direct","value":24},{"name":"Referral","value":18},{"name":"Paid","value":12}]}'></div></div>
</div>
```

#### Radar Chart

Compares several qualities at once — plan features, skill profiles, product scores.

- Docs page: `#/components/radar-chart`
- Figma: Chart / Radar
- React: `npx facetui@latest add radar-chart`

| Name | Kind | Notes |
|---|---|---|
| `labels` | string[] | Axes |
| `max` | number | Outer ring value |

Accessibility:
- Keep axis labels short so they fit around the chart on mobile.

Example (Two series):

```html
<div class="widget" style="width:100%;max-width:640px">
  <div class="widget-header"><div><span class="widget-title">Plan comparison</span><span class="widget-desc">Scores out of 100</span></div></div>
  <div class="widget-content"><div class="chart" data-chart='{"type":"radar","max":100,"labels":["Speed","Security","Support","Integrations","Analytics","Price"],"series":[{"name":"Growth","data":[72,80,64,70,58,86]},{"name":"Scale","data":[90,96,92,88,90,60]}]}'></div></div>
</div>
```

#### Radial Chart

Progress toward a goal as rings or a half gauge. Good for quotas, storage and scores.

- Docs page: `#/components/radial-chart`
- Figma: Chart / Radial · Gauge
- React: `npx facetui@latest add radial-chart`

| Name | Kind | Notes |
|---|---|---|
| `half` | boolean | Half-circle gauge |
| `thickness` | number | Ring thickness |
| `data[].max` | number | Per-ring maximum (default 100) |

Accessibility:
- Show the value as text in the center or next to the chart.

Example (Half gauge):

```html
<div class="card card-body" style="width:300px;margin:auto"><div class="chart" data-chart='{"type":"radial","half":true,"size":240,"format":"percent","centerSub":"Storage used","data":[{"name":"Storage","value":68}]}'></div><div class="row" style="justify-content:space-between;margin-top:4px" ><span class="t-body-xs text-tertiary">68 GB of 100 GB</span><a class="link t-label-sm" href="#">Upgrade</a></div></div>
```

### AI

#### AI: Prompt Composer & Message

Composer with context chips and model picker; messages for user and assistant.

- Docs page: `#/components/ai`
- Figma: Prompt Composer · Message · AI Copilot Panel
- React: `npx facetui@latest add ai`

| Name | Kind | Notes |
|---|---|---|
| `composer, ctx-chip, composer-bar` | class | Composer parts |
| `msg / msg-user, ai-mark` | class | Messages |

Accessibility:
- Announce streamed responses via an aria-live region.
- Show Stop while generating.

Example (Conversation):

```html
<div class="stack" style="max-width:620px;margin:auto;--gap:16px">
  <div class="msg msg-user"><div class="msg-body">Draft a launch plan for the Q4 release.</div></div>
  <div class="msg"><span class="ai-mark"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div class="msg-body">Here's a 3-phase plan: <b>Prepare</b> (assets, docs), <b>Launch</b> (email + in-app), <b>Measure</b> (activation dashboard). Want me to create tasks?</div></div>
  <div class="composer">
    <div class="row" style="--gap:6px"><span class="ctx-chip"><svg class="icon icon-sm"><use href="#file-text"/></svg> Launch brief</span><span class="ctx-chip"><svg class="icon icon-sm"><use href="#folder"/></svg> Q4 Launch</span></div>
    <textarea placeholder="Ask Facet AI…" aria-label="Prompt"></textarea>
    <div class="composer-bar"><button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach"><svg class="icon"><use href="#paperclip"/></svg></button><button class="btn btn-ghost btn-sm"><svg class="icon icon-sm"><use href="#sparkles"/></svg> Facet Pro <svg class="icon icon-sm"><use href="#chevron-down"/></svg></button><span class="grow"></span><button class="btn btn-sm icon-btn" aria-label="Send"><svg class="icon icon-sm"><use href="#send"/></svg></button></div>
  </div>
</div>
```

#### Bubble

The message surface for chat: variants, start/end alignment, grouped corners, reactions, link previews, action buttons and collapsible long content.

- Docs page: `#/components/bubble`
- Figma: Bubble · Default · Primary · Outline · Tinted · Ghost × Start / End
- React: `npx facetui@latest add bubble`

| Name | Kind | Notes |
|---|---|---|
| `bubble-row[data-align="end"]` | wrapper | Groups bubbles from one sender; end aligns right |
| `bubble[data-variant]` | attribute | default · primary · outline · tinted · ghost |
| `bubble-reactions · bubble-link · bubble-actions · bubble-meta` | class | Parts |
| `bubble-more + bubble-toggle` | class | Collapsible long content |

Accessibility:
- Put sender and time in visible or visually-hidden text, not only alignment.
- The Show more button reports aria-expanded.

Example (Bubbles):

```html
<div class="stack" style="--gap:10px;max-width:520px;margin:auto">
  <div class="bubble-row"><div class="bubble">Hey! Did the new pricing page ship?</div><div class="bubble">Marketing wants to link it in the newsletter 🙏</div><span class="bubble-meta">Ada · 9:41</span></div>
  <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">Yes — live since this morning.<span class="bubble-reactions">👍 2</span></div></div>
  <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">Here's the link:<a class="bubble-link" href="#"><div class="aspect-ratio" style="--ratio:2/1"><div class="aspect-fill">facet.dev/pricing</div></div><div><b>Pricing · Facet UI</b><span>Simple plans for every team</span></div></a></div><span class="bubble-meta">You · 9:43</span></div>
  <div class="bubble-row"><div class="bubble" data-variant="outline"><div class="bubble-more"><p>Release checklist for v1.3: tokens audited, Figma variants rebuilt, docs regenerated, changelog written, accessibility pass on the new components, Sonner stacking checked on Safari, and the questionnaire tested with a screen reader.</p><p>Ping me once the store listings are updated.</p></div><button class="bubble-toggle" aria-expanded="false">Show more</button></div></div>
  <div class="bubble-row"><div class="bubble" data-variant="tinted">Want me to schedule the newsletter?<div class="bubble-actions"><button class="btn btn-sm">Schedule</button><button class="btn btn-outline btn-sm">Not now</button></div></div></div>
</div>
```

#### Chain Of Thought

Shows the assistant's reasoning as collapsible steps — done, active or pending — with optional source chips.

- Docs page: `#/components/chain-of-thought`
- Figma: Chat / Chain of Thought · step states
- React: `npx facetui@latest add chain-of-thought`

| Name | Kind | Notes |
|---|---|---|
| `cot-step[data-state]` | done · active · (pending) | Step state |

Accessibility:
- Collapsed by default once the answer arrives; it's a native <details>.

Example (Running):

```html
<details class="cot" open style="max-width:520px;margin:auto">
  <summary><span class="text-shimmer">Researching your pipeline…</span> <svg class="icon icon-sm chev"><use href="#chevron-down"/></svg></summary>
  <ol class="cot-steps">
    <li class="cot-step" data-state="done"><span class="node"><svg class="icon"><use href="#check"/></svg></span><div><b>Searched CRM</b><small>Found 14 deals over $50k closing in Q4</small><span class="chip"><svg class="icon icon-sm"><use href="#database"/></svg> Salesforce</span></div></li>
    <li class="cot-step" data-state="done"><span class="node"><svg class="icon"><use href="#check"/></svg></span><div><b>Compared seat usage</b><small>2 accounts dropped more than 25%</small></div></li>
    <li class="cot-step" data-state="active"><span class="node"></span><div><b>Checking open invoices</b><small>Stripe · 3 of 14 accounts</small></div></li>
    <li class="cot-step"><span class="node"><svg class="icon"><use href="#circle-dot"/></svg></span><div><b>Write summary</b></div></li>
  </ol>
</details>
```

#### Chat Attachment

File and image previews for the composer and messages, with type, size, upload progress and remove.

- Docs page: `#/components/chat-attachment`
- Figma: Chat / Attachment · file · image · uploading
- React: `npx facetui@latest add chat-attachment`

| Name | Kind | Notes |
|---|---|---|
| `--tone` | CSS var | Thumbnail color by file type |
| `data-state` | uploading | Shows progress |
| `.image` | class | Square image preview |

Accessibility:
- Remove buttons are labeled; announce upload completion.

Example (Files & images):

```html
<div class="chat-attachments">
  <div class="chat-attachment"><span class="thumb"><svg class="icon"><use href="#file-text"/></svg></span><div><b>Q4-pricing.pdf</b><span>PDF · 2.4 MB</span></div><button class="btn btn-ghost btn-sm icon-btn x" aria-label="Remove"><svg class="icon icon-sm"><use href="#x"/></svg></button></div>
  <div class="chat-attachment" style="--tone:var(--green-600)"><span class="thumb"><svg class="icon"><use href="#file-spreadsheet"/></svg></span><div><b>pipeline.csv</b><span>CSV · 84 KB</span></div><button class="btn btn-ghost btn-sm icon-btn x" aria-label="Remove"><svg class="icon icon-sm"><use href="#x"/></svg></button></div>
  <div class="chat-attachment" data-state="uploading" style="--tone:var(--blue-600)"><span class="thumb"><svg class="icon"><use href="#image"/></svg></span><div><b>dashboard.png</b><span>Uploading… 64%</span></div><div class="progress progress-sm"><span style="--value:64%"></span></div></div>
  <div class="chat-attachment image"><span class="thumb" style="background:linear-gradient(135deg,var(--brand-400),var(--lagoon-500))"></span></div>
</div>
```

#### Chat Conversation

The scrolling container for a chat: messages, reasoning, tool calls and the composer, with a jump-to-latest button when you scroll up.

- Docs page: `#/components/chat-conversation`
- Figma: Chat / Conversation · full chat
- React: `npx facetui@latest add chat-conversation`

| Name | Kind | Notes |
|---|---|---|
| `chat-conversation · chat-conversation-content` | class | Scroll viewport + centered column (max 720px) |
| `chat-scroll-btn` | class | Shows when you're more than 60px from the bottom |

Accessibility:
- Give the message list role=log and aria-live=polite so new replies are announced.

Example (Full chat):

```html
<div class="card" style="max-width:720px;margin:auto;height:520px;display:flex;flex-direction:column;overflow:hidden">
  <div class="chat-conversation" style="flex:1">
    <div class="chat-conversation-content">
      <div class="chat-msg" data-role="user"><div class="chat-msg-body"><div class="chat-msg-text">Which enterprise deals are at risk this quarter?</div></div></div>
      <div class="chat-msg"><span class="ai-mark"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div class="chat-msg-body">
        <details class="cot"><summary><svg class="icon icon-sm"><use href="#brain"/></svg> Thought for 4 seconds <svg class="icon icon-sm chev"><use href="#chevron-down"/></svg></summary><ol class="cot-steps"><li class="cot-step" data-state="done"><span class="node"><svg class="icon"><use href="#check"/></svg></span><div><b>Searched CRM</b><small>Deals over $50k closing in Q4</small></div></li><li class="cot-step" data-state="done"><span class="node"><svg class="icon"><use href="#check"/></svg></span><div><b>Checked usage</b><small>Seat usage dropped for 2 accounts</small></div></li></ol></details>
        <div class="chat-msg-text markdown"><p><strong>Two deals need attention</strong> <a class="cite" href="#">1</a></p><ul><li><strong>Globex</strong> — $12,950, seat usage down 31%.</li><li><strong>Umbrella</strong> — $8,400, invoice 38 days overdue.</li></ul></div>
        <div class="chat-sources"><a class="chat-source" href="#"><span class="fav">S</span><span>Salesforce · Q4 pipeline</span></a><a class="chat-source" href="#"><span class="fav">M</span><span>Mixpanel · seat usage</span></a></div>
        <div class="msg-actions"><button class="btn btn-ghost btn-sm icon-btn" data-action="copy" aria-label="Copy"><svg class="icon icon-sm"><use href="#copy"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="up" aria-pressed="false" aria-label="Good response"><svg class="icon icon-sm"><use href="#thumbs-up"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="down" aria-pressed="false" aria-label="Bad response"><svg class="icon icon-sm"><use href="#thumbs-down"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="regenerate" aria-label="Regenerate"><svg class="icon icon-sm"><use href="#rotate-ccw"/></svg></button></div>
      </div></div>
      <div class="chat-msg" data-role="user"><div class="chat-msg-body"><div class="chat-msg-text">Draft a check-in email to Globex.</div></div></div>
      <div class="chat-msg"><span class="ai-mark"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div class="chat-msg-body"><span class="chat-loader"><span class="typing"><i></i><i></i><i></i></span></span></div></div>
    </div>
    <button class="btn btn-outline btn-sm chat-scroll-btn" hidden><svg class="icon icon-sm"><use href="#arrow-down"/></svg> Latest</button>
  </div>
  <div style="padding:12px;border-top:1px solid var(--border-subtle)"><div class="composer prompt-input" style="width:100%;max-width:640px;margin:auto">
  <textarea rows="1" placeholder="Ask Facet AI anything…" aria-label="Message"></textarea>
  <div class="composer-bar">
    <button class="btn btn-ghost btn-sm icon-btn" aria-label="Attach"><svg class="icon"><use href="#paperclip"/></svg></button>
    <button class="model hide-sm"><svg class="icon icon-sm"><use href="#sparkles"/></svg> Facet Pro <svg class="icon icon-sm"><use href="#chevron-down"/></svg></button>
    <span class="grow"></span>
    <button class="btn btn-ghost btn-sm icon-btn" aria-label="Voice"><svg class="icon"><use href="#mic"/></svg></button>
    <button class="btn btn-sm icon-btn send" aria-label="Send" disabled><svg class="icon"><use href="#arrow-up"/></svg></button>
  </div>
</div></div>
</div>
```

#### Chat List View

Thread rows for a chat sidebar, grouped by date, with unread dots and a hover menu.

- Docs page: `#/components/chat-list-view`
- Figma: Chat / Thread List
- React: `npx facetui@latest add chat-list-view`

| Name | Kind | Notes |
|---|---|---|
| `chat-thread[aria-current]` | attribute | Open thread |
| `.unread` | class | Unread dot |

Accessibility:
- Use a nav landmark labeled 'Chats'.

Example (Sidebar threads):

```html
<div class="card" style="width:300px;padding:8px">
  <button class="btn btn-outline btn-block btn-sm" style="margin-bottom:6px"><svg class="icon"><use href="#square-pen"/></svg> New chat</button>
  <div class="chat-list">
    <div class="chat-list-label">Today</div>
    <a class="chat-thread" href="#" aria-current="true"><div class="grow"><b>At-risk enterprise deals</b><span>Two deals need attention…</span></div><time>9:41</time></a>
    <a class="chat-thread" href="#"><div class="grow"><b>Draft Globex email</b><span>Here's a friendly check-in…</span></div><span class="unread"></span></a>
    <div class="chat-list-label">Previous 7 days</div>
    <a class="chat-thread" href="#"><div class="grow"><b>Q4 board deck outline</b><span>Slide 1: Highlights…</span></div><button class="btn btn-ghost btn-sm icon-btn more" aria-label="More"><svg class="icon icon-sm"><use href="#more-horizontal"/></svg></button></a>
    <a class="chat-thread" href="#"><div class="grow"><b>SQL for churn cohort</b><span>SELECT account_id…</span></div><time>Mon</time></a>
  </div>
</div>
```

#### Chat Loader

Waiting states while the assistant works: typing dots, a shimmering status and a pulsing dot.

- Docs page: `#/components/chat-loader`
- Figma: Chat / Loader · typing · thinking · pulse
- React: `npx facetui@latest add chat-loader`

| Name | Kind | Notes |
|---|---|---|
| `typing · text-shimmer · pulse-dot` | class | Loader styles |

Accessibility:
- Pair with aria-busy=true on the message list.

Example (Loaders):

```html
<span class="chat-loader"><span class="typing"><i></i><i></i><i></i></span></span>
<span class="chat-loader"><span class="spinner"></span><span class="text-shimmer">Thinking…</span></span>
<span class="chat-loader"><span class="pulse-dot"></span>Searching 3 sources</span>
```

#### Chat Message

A message from the user or the assistant. Assistant messages are plain by default and can use a bubble; user messages are right-aligned bubbles.

- Docs page: `#/components/chat-message`
- Figma: Chat / Message · user · assistant · bubble
- React: `npx facetui@latest add chat-message`

| Name | Kind | Notes |
|---|---|---|
| `data-role` | user \| assistant | Alignment and bubble |
| `data-variant` | bubble | Bubble for assistant messages |
| `chat-msg-meta` | class | Name + time |

Accessibility:
- Label who said what for screen readers (visible name or sr-only text).

Example (Roles & variants):

```html
<div class="stack" style="--gap:20px;max-width:640px;margin:auto">
  <div class="chat-msg" data-role="user"><span class="avatar avatar-sm av-1">MR</span><div class="chat-msg-body"><div class="chat-msg-meta"><b>Maya</b><time>9:41</time></div><div class="chat-msg-text">Summarize this week's revenue changes.</div></div></div>
  <div class="chat-msg"><span class="ai-mark"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div class="chat-msg-body"><div class="chat-msg-meta"><b>Facet AI</b><time>9:41</time></div><div class="chat-msg-text">MRR grew <strong>4.6%</strong> to $248,920. Expansion drove most of it — Northwind added 40 seats.</div><div class="msg-actions"><button class="btn btn-ghost btn-sm icon-btn" data-action="copy" aria-label="Copy"><svg class="icon icon-sm"><use href="#copy"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="up" aria-pressed="false" aria-label="Good response"><svg class="icon icon-sm"><use href="#thumbs-up"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="down" aria-pressed="false" aria-label="Bad response"><svg class="icon icon-sm"><use href="#thumbs-down"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="regenerate" aria-label="Regenerate"><svg class="icon icon-sm"><use href="#rotate-ccw"/></svg></button></div></div></div>
  <div class="chat-msg" data-variant="bubble"><span class="ai-mark"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div class="chat-msg-body"><div class="chat-msg-text">Bubble variant for compact assistant surfaces like a support widget.</div></div></div>
</div>
```

#### Chat Message Actions

Copy, rate and regenerate controls under an assistant reply. Thumbs are mutually exclusive.

- Docs page: `#/components/chat-message-actions`
- Figma: Chat / Message Actions
- React: `npx facetui@latest add chat-message-actions`

| Name | Kind | Notes |
|---|---|---|
| `[data-action]` | copy · up · down · regenerate | Built-in behaviours |

Accessibility:
- Icon-only buttons have aria-labels; rating buttons expose aria-pressed.

Example (Default):

```html
<div class="msg-actions"><button class="btn btn-ghost btn-sm icon-btn" data-action="copy" aria-label="Copy"><svg class="icon icon-sm"><use href="#copy"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="up" aria-pressed="false" aria-label="Good response"><svg class="icon icon-sm"><use href="#thumbs-up"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="down" aria-pressed="false" aria-label="Bad response"><svg class="icon icon-sm"><use href="#thumbs-down"/></svg></button><button class="btn btn-ghost btn-sm icon-btn" data-action="regenerate" aria-label="Regenerate"><svg class="icon icon-sm"><use href="#rotate-ccw"/></svg></button></div>
```

#### Chat Source

Source chips and inline numbered citations that show where an answer came from.

- Docs page: `#/components/chat-source`
- Figma: Chat / Source · Citation
- React: `npx facetui@latest add chat-source`

| Name | Kind | Notes |
|---|---|---|
| `chat-source · fav` | class | Chip + favicon/index |
| `cite` | class | Inline numbered citation |

Accessibility:
- Citations link to their source; give them aria-label='Source 1'.

Example (Sources & citations):

```html
<div class="stack" style="--gap:12px;max-width:560px;margin:auto">
  <p class="t-body-md">Northwind's renewal is on track <a class="cite" href="#">1</a> and usage is up 18% this month <a class="cite" href="#">2</a>.</p>
  <div class="chat-sources"><a class="chat-source" href="#"><span class="fav">1</span><span>salesforce.com · Northwind renewal</span></a><a class="chat-source" href="#"><span class="fav">2</span><span>mixpanel.com · Seat usage</span></a><a class="chat-source" href="#"><span class="fav">+3</span><span>More sources</span></a></div>
</div>
```

#### Chat Tool

A tool call made by the agent, with its input and output, a status, and an approval gate for sensitive actions.

- Docs page: `#/components/chat-tool`
- Figma: Chat / Tool Call · running · done · approval
- React: `npx facetui@latest add chat-tool`

| Name | Kind | Notes |
|---|---|---|
| `status[data-state]` | done · pending · error | Status color |
| `[data-approve] / [data-deny]` | button | Fires facet:approval {approved} |

Accessibility:
- Approval buttons are real buttons and clearly say what will happen.

Example (Done & needs approval):

```html
<div class="stack" style="--gap:12px;max-width:560px;margin:auto">
  <details class="chat-tool"><summary><span class="tool-ico"><svg class="icon"><use href="#database"/></svg></span><code>crm.search_deals</code><span class="status" data-state="done"><svg class="icon icon-sm"><use href="#check"/></svg> 14 results</span></summary><pre>{ <span class="k">"stage"</span>: "negotiation", <span class="k">"minValue"</span>: 50000, <span class="k">"closeBy"</span>: "2026-12-31" }</pre></details>
  <div class="chat-tool" data-state="pending"><div class="chat-tool-head"><span class="tool-ico"><svg class="icon"><use href="#send"/></svg></span><code>email.send</code><span class="status" data-state="pending"><svg class="icon icon-sm"><use href="#hourglass"/></svg> Needs approval</span></div>
    <div class="chat-tool-approval"><p>Send <b>“Checking in on your renewal”</b> to <b>ops@globex.com</b>?</p><div class="row"><button class="btn btn-outline btn-sm" data-deny>Deny</button><button class="btn btn-sm" data-approve><svg class="icon icon-sm"><use href="#check"/></svg> Allow</button></div></div></div>
</div>
```

#### Code Block

Syntax-highlighted code with a filename, language tag, copy button, line numbers and highlighted or diff lines.

- Docs page: `#/components/code-block`
- Figma: Code Block · default · numbered · diff
- React: `npx facetui@latest add code-block`

| Name | Kind | Notes |
|---|---|---|
| `.numbered` | class | Line numbers |
| `span.hl · .add · .del` | class | Highlighted / diff lines |
| `[data-copy-code]` | button | Copies the code |

Accessibility:
- Use a <pre> so code stays selectable and scrolls horizontally.

Example (Diff):

```html
<div class="code-block" style="max-width:640px;margin:auto"><div class="code-block-head"><span class="lang">css</span>tokens.css<button class="btn btn-ghost btn-sm" data-copy-code><svg class="icon icon-sm"><use href="#copy"/></svg> Copy</button></div><pre><span class="del">  --brand-600: #5d4ff3;</span>
<span class="add">  --brand-600: #be4000;</span>
<span>  --bg-primary: var(--brand-600);</span></pre></div>
```

#### Markdown

Prose styles for rendered Markdown in AI answers and docs: headings, lists, task lists, quotes, inline code and tables.

- Docs page: `#/components/markdown`
- Figma: Markdown · prose styles
- React: `npx facetui@latest add markdown`

| Name | Kind | Notes |
|---|---|---|
| `markdown` | class | Wrap any HTML from a Markdown renderer |

Accessibility:
- Keep heading levels in order inside answers.

Example (Rendered answer):

```html
<div class="markdown" style="margin:auto">
  <h2>Q4 renewal plan</h2>
  <p>Three accounts renew in December. Focus on <strong>Globex</strong> first — usage is down and the champion changed roles.</p>
  <ul><li>Book an exec check-in by <code>Nov 22</code></li><li>Share the new analytics add-on</li></ul>
  <ul><li class="task"><input type="checkbox" checked disabled> Pull usage report</li><li class="task"><input type="checkbox" disabled> Send renewal quote</li></ul>
  <blockquote>“Tokens and components finally say the same thing.”</blockquote>
  <table><thead><tr><th>Account</th><th>Renews</th><th>MRR</th></tr></thead><tbody><tr><td>Globex</td><td>Dec 1</td><td>$12,950</td></tr><tr><td>Initech</td><td>Dec 9</td><td>$6,120</td></tr></tbody></table>
</div>
```

#### Marker

Separators and status notes inside a conversation: date breaks, “Ada joined”, “New messages”, “Conversation summarised”.

- Docs page: `#/components/marker`
- Figma: Marker · Date · Status · Unread · Pill
- React: `npx facetui@latest add marker`

| Name | Kind | Notes |
|---|---|---|
| `marker` | class | Line + centered label (date break) |
| `data-variant` | attribute | status · unread · pill |
| `marker-pill` | class | Pill label for the pill variant |

Accessibility:
- Use role="separator" on breaks; status markers are plain text so they're read in order.

Example (Markers):

```html
<div class="stack" style="--gap:18px;max-width:520px;margin:auto">
  <div class="marker" role="separator">Today</div>
  <div class="marker" data-variant="status"><svg class="icon"><use href="#user"/></svg> <span><b>Ada Lovelace</b> joined the conversation</span></div>
  <div class="marker" data-variant="unread" role="separator">New messages</div>
  <div class="marker" data-variant="pill" role="separator"><span class="marker-pill"><svg class="icon icon-sm"><use href="#sparkles"/></svg> Earlier messages summarised</span></div>
  <div class="marker" data-variant="status"><svg class="icon"><use href="#clock"/></svg> <span>Agent paused for approval · 2m</span></div>
</div>
```

#### Message Scroller

The scroll container for a conversation: sticks to the bottom while replies stream, anchors each new turn to the top, restores history without jumping, counts unread messages, jumps to any message and reports when messages are seen.

- Docs page: `#/components/message-scroller`
- Figma: Message Scroller · At bottom · Scrolled up
- React: `npx facetui@latest add message-scroller`

| Name | Kind | Notes |
|---|---|---|
| `message-scroller > message-scroller-viewport > message-scroller-content` | class | Structure |
| `data-turn` | message | Anchor this message to the top when added |
| `data-prepend` | message | Restored history: keep the scroll position |
| `data-seen="false"` | message | Becomes true when half visible; fires facet:seen |
| `message-scroller-jump (+ .badge)` | class | Jump to latest with unread count |
| `data-scroll-to="id"` | attribute | Jump to and highlight a message |

Accessibility:
- Give the log role="log" or aria-live on the content if replies should be announced.
- The jump button is a real button and appears only when you're scrolled up.

Example (Conversation):

```html
<div class="stack" style="--gap:10px;max-width:560px;margin:auto">
  <div class="card" style="height:380px;padding:0;overflow:hidden"><div class="message-scroller" id="ms-demo">
    <div class="message-scroller-viewport"><div class="message-scroller-content">
      <button class="btn btn-ghost btn-sm message-scroller-load" data-scroller-demo="ms-demo" data-kind="earlier">Load earlier</button>
      <div class="marker" role="separator">Yesterday</div>
      <div class="bubble-row" id="ms-m1"><div class="bubble">Can you pull last quarter's churn numbers?</div></div>
      <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">On it. Churn was 2.8%, down from 3.4%.</div></div>
      <div class="bubble-row"><div class="bubble">Nice. Which segment improved most?</div></div>
      <div class="bubble-row" data-align="end"><div class="bubble" data-variant="primary">Mid-market — onboarding emails cut early churn by a third.</div></div>
      <div class="marker" role="separator">Today</div>
      <div class="bubble-row"><div class="bubble">Great, let's add that to the board deck.</div></div>
      <div class="bubble-row" data-align="end" data-seen="false"><div class="bubble" data-variant="primary">Added as slide 7.</div><span class="bubble-meta">9:12</span></div>
    </div></div>
    <button class="btn btn-outline btn-sm message-scroller-jump" hidden><svg class="icon icon-sm"><use href="#arrow-down"/></svg> Latest <span class="badge" hidden>0</span></button>
  </div></div>
  <div class="row" style="flex-wrap:wrap;gap:8px;justify-content:center"><button class="btn btn-sm" data-scroller-demo="ms-demo" data-kind="ask">Ask a question</button><button class="btn btn-outline btn-sm" data-scroller-demo="ms-demo">Stream a reply</button><button class="btn btn-ghost btn-sm" data-scroll-to="ms-m1">Jump to first question</button></div>
</div>
```

#### Prompt Input

The composer: grows with your text, sends on Enter (Shift+Enter for a new line), and holds attachments, a model picker and voice input.

- Docs page: `#/components/prompt-input`
- Figma: Prompt Input · default · attachments · recording
- React: `npx facetui@latest add prompt-input`

| Name | Kind | Notes |
|---|---|---|
| `prompt-input textarea` | element | Autosizes up to 200px |
| `.send` | button | Disabled until there's text |
| `.hide-sm` | class | Hidden under 420px |

Accessibility:
- The textarea has a label; Enter sends, Shift+Enter adds a line.

Example (Recording):

```html
<div class="composer prompt-input" style="width:100%;max-width:640px;margin:auto;flex-direction:row;align-items:center"><span class="pulse-dot" style="background:var(--icon-danger)"></span><span class="voice-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="t-label-sm text-tertiary">0:07</span><span class="grow"></span><button class="btn btn-ghost btn-sm">Cancel</button><button class="btn btn-sm icon-btn send" aria-label="Send"><svg class="icon"><use href="#arrow-up"/></svg></button></div>
```

#### Prompt Suggestion

Suggested prompts shown in an empty chat or under a reply. Chips for short prompts, cards for richer starters.

- Docs page: `#/components/prompt-suggestion`
- Figma: Prompt Suggestion · chip · card
- React: `npx facetui@latest add prompt-suggestion`

| Name | Kind | Notes |
|---|---|---|
| `prompt-suggestions.cards` | class | Card layout |

Accessibility:
- They're buttons; clicking one fills or sends the prompt.

Example (Chips):

```html
<div class="prompt-suggestions" style="justify-content:center"><button class="prompt-suggestion"><svg class="icon icon-sm"><use href="#sparkles"/></svg> Summarize this week</button><button class="prompt-suggestion"><svg class="icon icon-sm"><use href="#trending-up"/></svg> Forecast Q4 revenue</button><button class="prompt-suggestion"><svg class="icon icon-sm"><use href="#mail"/></svg> Draft a follow-up</button></div>
```

#### Text Shimmer

A light sweep across text to show work in progress — for 'Thinking…' states and loading labels.

- Docs page: `#/components/text-shimmer`
- Figma: Text Shimmer
- React: `npx facetui@latest add text-shimmer`

| Name | Kind | Notes |
|---|---|---|
| `.brand` | class | Brand-colored sweep |

Accessibility:
- Turns off with reduced motion (text stays readable).

Example (Neutral & brand):

```html
<span class="text-shimmer t-h4">Analyzing 1,284 accounts…</span>
<span class="text-shimmer brand t-h4">Generating your report</span>
```

#### Trace

Lists the steps an agent takes — searches, tool calls, file reads — with status, timing and collapsible input/output for each step.

- Docs page: `#/components/trace`
- Figma: Trace · Trace Item · Done · Running · Error · Pending
- React: `npx facetui@latest add trace`

| Name | Kind | Notes |
|---|---|---|
| `trace > trace-item` | class | Ordered list of steps |
| `data-status` | item | done · running · error · pending |
| `trace-line · trace-icon · trace-title · trace-meta · trace-desc` | class | Parts |
| `details.trace-collapsible` | element | Collapsible input/output |

Accessibility:
- Use an ordered list; status is also given by the icon shape and the text, not color alone.

Example (Agent run):

```html
<ol class="trace" aria-label="Agent steps">
  <li class="trace-item" data-status="done"><span class="trace-line"></span><span class="trace-icon"><svg class="icon"><use href="#search"/></svg></span><div class="trace-title">Searched the web <span class="trace-meta">1.2s</span></div><div class="trace-desc">“enterprise churn benchmarks 2026” · 8 results</div></li>
  <li class="trace-item" data-status="done"><span class="trace-line"></span><span class="trace-icon"><svg class="icon"><use href="#database"/></svg></span><div class="trace-title">Queried warehouse <span class="trace-meta">0.4s</span></div><details class="trace-collapsible"><summary><svg class="icon"><use href="#chevron-right"/></svg> Input &amp; output</summary><pre>SELECT segment, churn_rate FROM churn_q3 ORDER BY churn_rate;
→ 4 rows · mid-market 1.9%</pre></details></li>
  <li class="trace-item" data-status="error"><span class="trace-line"></span><span class="trace-icon"><svg class="icon"><use href="#circle-x"/></svg></span><div class="trace-title">Read file <code>board-deck.pptx</code> <span class="trace-meta">0.1s</span></div><details class="trace-collapsible" open><summary><svg class="icon"><use href="#chevron-right"/></svg> Error</summary><pre>Permission denied: request access from the deck owner.</pre></details></li>
  <li class="trace-item" data-status="running"><span class="trace-line"></span><span class="trace-icon"><svg class="icon"><use href="#loader-circle"/></svg></span><div class="trace-title">Drafting summary <span class="trace-meta">3.8s</span></div></li>
  <li class="trace-item" data-status="pending"><span class="trace-line"></span><span class="trace-icon"><svg class="icon"><use href="#send"/></svg></span><div class="trace-title">Send to #revenue</div></li>
</ol>
```

### Feedback

#### Alert

Inline, persistent messages. The signal rail on the left carries the tone.

- Docs page: `#/components/alert`
- Figma: Alert · 5 variants
- React: `npx facetui@latest add alert`

| Name | Kind | Notes |
|---|---|---|
| `alert-{success\|warning\|danger\|info}` | class | Tone |

Accessibility:
- Use role="alert" only for urgent errors; role="status" otherwise.

Example (Variants):

```html
<div class="stack" style="width:100%;max-width:560px">
  <div class="alert" role="status"><svg class="icon"><use href="#info"/></svg><div><div class="alert-title">Heads up</div><div class="alert-desc">Workspace billing moves to the 1st of each month.</div></div></div>
  <div class="alert alert-success" role="status"><svg class="icon"><use href="#check-circle-2"/></svg><div><div class="alert-title">Payment received</div><div class="alert-desc">Invoice INV-2041 was paid in full.</div></div></div>
  <div class="alert alert-warning" role="status"><svg class="icon"><use href="#alert-triangle"/></svg><div><div class="alert-title">Seat limit almost reached</div><div class="alert-desc">23 of 25 seats are in use.</div></div></div>
  <div class="alert alert-danger" role="alert"><svg class="icon"><use href="#alert-circle"/></svg><div><div class="alert-title">Sync failed</div><div class="alert-desc">We couldn't reach Salesforce. Retrying in 5 minutes.</div></div></div>
</div>
```

#### Emoji Reaction Button

Emoji reactions with counts. Click to add or remove yours; the selected state uses the brand color.

- Docs page: `#/components/emoji-reaction`
- Figma: Reaction · default · selected · add
- React: `npx facetui@latest add emoji-reaction`

| Name | Kind | Notes |
|---|---|---|
| `aria-pressed` | boolean | Selected by you |
| `.n` | element | Count updates on click |

Accessibility:
- Give each button an aria-label like '12 thumbs-up reactions'.

Example (Reactions):

```html
<div class="reactions"><button class="reaction" aria-pressed="true"><span class="emo">👍</span><span class="n">12</span></button><button class="reaction" aria-pressed="false"><span class="emo">🎉</span><span class="n">4</span></button><button class="reaction" aria-pressed="false"><span class="emo">👀</span><span class="n">2</span></button><button class="reaction add" aria-label="Add reaction"><svg class="icon icon-sm"><use href="#smile"/></svg></button></div>
```

#### Empty State

Explains why a view is empty and what to do next.

- Docs page: `#/components/empty-state`
- Figma: Empty State
- React: `npx facetui@latest add empty-state`

| Name | Kind | Notes |
|---|---|---|
| `empty` | class | Centered stack |

Accessibility:
- Lead with a clear heading; keep one primary action.

Example (Empty state):

```html
<div class="card empty" style="width:440px"><span class="icon-wrap"><svg class="icon"><use href="#folder"/></svg></span><b class="t-h5">No projects yet</b><p>Projects group your tasks, files and docs. Create one to get your team started.</p><div class="row" style="margin-top:8px"><button class="btn btn-outline btn-sm">Import</button><button class="btn btn-sm"><svg class="icon"><use href="#plus"/></svg> New project</button></div></div>
```

#### Number Value

Formats numbers with the browser's Intl API: currency, compact, percent and signed values, in any locale.

- Docs page: `#/components/number-value`
- Figma: Number Value
- React: `npx facetui@latest add number-value`

| Name | Kind | Notes |
|---|---|---|
| `data-value` | number | Raw value |
| `data-format` | decimal · currency · compact · percent | Style |
| `data-currency · data-locale · data-digits · data-sign` | attributes | Intl options |

Accessibility:
- Formatted text is real text, so screen readers read it naturally.

Example (Formats):

```html
<div class="stack" style="--gap:8px">
  <span class="t-data-lg number-value" data-value="248920" data-format="currency"></span>
  <span class="t-data-lg number-value" data-value="1284000" data-format="compact"></span>
  <span class="t-data-lg number-value" data-value="18.4" data-format="percent" data-sign="1"></span>
  <span class="t-data-lg number-value" data-value="248920" data-format="currency" data-currency="EUR" data-locale="de-DE"></span>
</div>
```

#### Pressable Feedback

Adds tactile press feedback to anything clickable: scale on press, a highlight, or lift on hover.

- Docs page: `#/components/pressable`
- Figma: Pressable · scale · highlight · lift
- React: `npx facetui@latest add pressable`

| Name | Kind | Notes |
|---|---|---|
| `pressable` | class | Scale to --press-scale on press |
| `data-feedback` | highlight · lift | Alternative styles |

Accessibility:
- Pressable things must be focusable and have a role (button/link).

Example (Three styles):

```html
<div class="card card-body pressable" tabindex="0" style="width:180px;text-align:center"><b class="t-label-md">Scale</b><div class="t-body-xs text-tertiary">Press me</div></div>
<div class="card card-body pressable" data-feedback="highlight" tabindex="0" style="width:180px;text-align:center"><b class="t-label-md">Highlight</b><div class="t-body-xs text-tertiary">Press me</div></div>
<div class="card card-body pressable" data-feedback="lift" tabindex="0" style="width:180px;text-align:center"><b class="t-label-md">Lift</b><div class="t-body-xs text-tertiary">Hover me</div></div>
```

#### Rating

Star rating built on radio buttons, so it works with the keyboard and in forms. Also a read-only display with half stars.

- Docs page: `#/components/rating`
- Figma: Rating · 3 sizes · 4 values (incl. half)
- React: `npx facetui@latest add rating`

| Name | Kind | Notes |
|---|---|---|
| `rating-sm · rating-lg` | class | Sizes |
| `data-readonly` | attribute | Display only |
| `--fill` | CSS var | Partial star (e.g. 50%) |

Accessibility:
- Interactive rating = radio group in a fieldset with a legend.
- Read-only rating has role=img and an aria-label.

Example (Interactive & read-only):

```html
<div class="stack" style="--gap:14px">
  <div class="row"><fieldset class="rating rating-lg" style="border:0;padding:0;margin:0"><legend class="sr-only">Rate your experience</legend><input type="radio" name="rate1" id="r1-1" value="1"><label for="r1-1" aria-label="1 star"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></label><input type="radio" name="rate1" id="r1-2" value="2"><label for="r1-2" aria-label="2 stars"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></label><input type="radio" name="rate1" id="r1-3" value="3"><label for="r1-3" aria-label="3 stars"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></label><input type="radio" name="rate1" id="r1-4" value="4" checked><label for="r1-4" aria-label="4 stars"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></label><input type="radio" name="rate1" id="r1-5" value="5"><label for="r1-5" aria-label="5 stars"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></label></fieldset><span class="rating-value"></span></div>
  <div class="row"><span class="rating" data-readonly role="img" aria-label="4.5 out of 5"><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star" style="--fill:50%"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg><span class="fill"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span></span></span><span class="rating-value">4.5 · 1,284 reviews</span></div>
  <span class="rating rating-sm" data-readonly><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star on"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span><span class="star"><svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span></span>
</div>
```

#### Sonner

Stacked toasts: new ones slide in front, older ones tuck behind, hover to fan the stack out. Types, actions and promise toasts that go from loading to done.

- Docs page: `#/components/sonner`
- Figma: Sonner · Default · Success · Error · Info · Warning · Loading · Action · Stack · Expanded
- React: `npx facetui@latest add sonner`

| Name | Kind | Notes |
|---|---|---|
| `Facet.sonner(o)` | function | { title, description, type, action, duration, target } |
| `Facet.sonner.success\|error\|info\|warning\|loading(title)` | function | Shortcuts |
| `Facet.sonner.promise(p, msgs)` | function | Loading → success/error |
| `sonner[data-position="top-center"]` | attribute | Region position (default bottom-right) |
| `data-sonner='{…}'` | attribute | Declarative trigger |

Accessibility:
- The region is aria-live="polite"; errors use role="alert".
- Hovering or focusing the stack pauses dismissal.

Example (Try it):

```html
<div class="stack" style="--gap:16px;align-items:center;width:100%">
  <div class="row" style="flex-wrap:wrap;justify-content:center;gap:8px"><button class="btn btn-outline btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;Event created&quot;,&quot;description&quot;:&quot;Sunday, Dec 03 at 9:00 AM&quot;}">Default</button><button class="btn btn-outline btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;Invoice paid&quot;,&quot;type&quot;:&quot;success&quot;}">Success</button><button class="btn btn-outline btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;Couldn&#39;t sync&quot;,&quot;description&quot;:&quot;Check your connection.&quot;,&quot;type&quot;:&quot;error&quot;}">Error</button><button class="btn btn-outline btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;New version available&quot;,&quot;type&quot;:&quot;info&quot;}">Info</button><button class="btn btn-outline btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;Storage almost full&quot;,&quot;type&quot;:&quot;warning&quot;}">Warning</button><button class="btn btn-outline btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;Message archived&quot;,&quot;action&quot;:&quot;Undo&quot;}">Action</button><button class="btn btn btn-sm" data-sonner="{&quot;target&quot;:&quot;sonner-demo&quot;,&quot;title&quot;:&quot;Saving changes…&quot;,&quot;promise&quot;:&quot;resolve&quot;,&quot;success&quot;:&quot;Changes saved&quot;,&quot;error&quot;:&quot;Save failed&quot;}">Promise</button></div>
  <section class="sonner" id="sonner-demo" data-inline aria-label="Notifications" aria-live="polite"><div class="sonner-toast" data-type="success"><button class="sonner-close" aria-label="Close"><svg class="icon"><use href="#x"/></svg></button><svg class="icon"><use href="#circle-check"/></svg><div class="grow"><b>Deploy finished</b><span>facet-ui · production · 42s</span></div></div></section>
</div>
```

#### Toast

Transient confirmation. Fire from JS with Facet.toast().

- Docs page: `#/components/toast`
- Figma: Toast
- React: `npx facetui@latest add toast`

| Name | Kind | Notes |
|---|---|---|
| `Facet.toast({ title, description, tone, icon, timeout })` | JS | Returns the toast element |

Accessibility:
- Region uses aria-live=polite.
- Never put the only copy of important info in a toast.

Example (Trigger toasts):

```html
<button class="btn btn-outline" data-toast='{"title":"Project created","description":"Q4 Launch is ready for your team."}'>Show toast</button>
<button class="btn btn-outline" data-toast='{"title":"Changes discarded","description":"Your draft was removed.","tone":"var(--icon-danger)","icon":"trash-2"}'>Danger toast</button>
```

#### Trend Chip

A small chip that shows a change with an arrow and a sign — green for up, red for down, grey for no change.

- Docs page: `#/components/trend-chip`
- Figma: Trend Chip · up · down · neutral
- React: `npx facetui@latest add trend-chip`

| Name | Kind | Notes |
|---|---|---|
| `data-trend` | up (default) · down · neutral | Color and meaning |
| `.plain` | class | No background |

Accessibility:
- The arrow and sign carry the meaning, not only the color.

Example (States):

```html
<span class="trend-chip"><svg class="icon"><use href="#trending-up"/></svg> 12.4%</span>
<span class="trend-chip" data-trend="down"><svg class="icon"><use href="#trending-down"/></svg> 3.1%</span>
<span class="trend-chip" data-trend="neutral"><svg class="icon"><use href="#minus"/></svg> 0.0%</span>
<span class="trend-chip plain"><svg class="icon"><use href="#arrow-up-right"/></svg> +$4,280</span>
```

### Layout

#### Aspect Ratio

Keeps media at a fixed ratio while it scales: images, video, maps and embeds. Set --ratio; the content covers the frame.

- Docs page: `#/components/aspect-ratio`
- Figma: Aspect Ratio · 16:9 · 4:3 · 1:1 · 9:16
- React: `npx facetui@latest add aspect-ratio`

| Name | Kind | Notes |
|---|---|---|
| `aspect-ratio` | class | Frame |
| `--ratio` | CSS var | e.g. 16/9 (default), 4/3, 1 |
| `figcaption` | child | Optional overlay caption |

Accessibility:
- Images still need alt text; decorative ones use alt="".

Example (Ratios):

```html
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;align-items:start;max-width:720px;margin:auto">
  <figure class="aspect-ratio" style="--ratio:16/9;margin:0"><div class="aspect-fill">16 : 9</div><figcaption>Video</figcaption></figure>
  <figure class="aspect-ratio" style="--ratio:4/3;margin:0"><div class="aspect-fill" style="filter:hue-rotate(40deg)">4 : 3</div><figcaption>Photo</figcaption></figure>
  <figure class="aspect-ratio" style="--ratio:1;margin:0"><div class="aspect-fill" style="filter:hue-rotate(90deg)">1 : 1</div><figcaption>Avatar</figcaption></figure>
  <figure class="aspect-ratio" style="--ratio:9/16;margin:0"><div class="aspect-fill" style="filter:hue-rotate(160deg)">9 : 16</div><figcaption>Story</figcaption></figure>
</div>
```

#### Collapsible

Shows and hides one region with a trigger. Built on <details>, so it works without JavaScript. Use Accordion for a set of sections.

- Docs page: `#/components/collapsible`
- Figma: Collapsible · Closed · Open
- React: `npx facetui@latest add collapsible`

| Name | Kind | Notes |
|---|---|---|
| `details.collapsible` | element | Wrapper; add open to start expanded |
| `collapsible-trigger` | class | Icon that flips when open |
| `collapsible-content` | class | The hidden region |

Accessibility:
- <summary> is a native button: Enter and Space toggle it and the expanded state is announced.

Example (Collapsible):

```html
<details class="collapsible" style="width:340px" open>
  <summary><span>@peduarte starred 3 repositories</span><span class="collapsible-trigger btn btn-ghost btn-sm icon-btn" aria-hidden="true"><svg class="icon icon-sm"><use href="#chevrons-up-down"/></svg></span></summary>
  <div class="collapsible-row">@radix-ui/primitives</div>
  <div class="collapsible-content"><div class="collapsible-row">@radix-ui/colors</div><div class="collapsible-row">@stitches/react</div></div>
</details>
```

#### Resizable

Panels separated by a drag handle. Drag with a mouse or touch, or focus the handle and use the arrow keys.

- Docs page: `#/components/resizable`
- Figma: Resizable · horizontal · vertical
- React: `npx facetui@latest add resizable`

| Name | Kind | Notes |
|---|---|---|
| `data-direction` | horizontal · vertical | Layout |
| `data-min` | px | Minimum panel size (default 80) |

Accessibility:
- Handles are role=separator, focusable, with arrow-key resizing.

Example (Horizontal + vertical):

```html
<div class="resizable" style="height:280px">
  <div class="resizable-panel" style="flex:1 1 0"><b class="t-label-md">Sidebar</b><p class="t-body-sm text-tertiary">Drag the handle →</p></div>
  <div class="resizable-handle" role="separator" aria-orientation="vertical" tabindex="0" aria-valuenow="33" aria-label="Resize"></div>
  <div class="resizable" data-direction="vertical" style="flex:2 1 0;border:0;border-radius:0;min-height:0">
    <div class="resizable-panel" style="flex:2 1 0"><b class="t-label-md">Editor</b></div>
    <div class="resizable-handle" role="separator" aria-orientation="horizontal" tabindex="0" aria-label="Resize"></div>
    <div class="resizable-panel" style="flex:1 1 0"><b class="t-label-md">Terminal</b></div>
  </div>
</div>
```

#### Scroll Area

A bounded scroll region with slim, themed scrollbars on every browser and optional edge fades. Native scrolling, so touch, wheel and keyboard all work.

- Docs page: `#/components/scroll-area`
- Figma: Scroll Area · Vertical · Horizontal
- React: `npx facetui@latest add scroll-area`

| Name | Kind | Notes |
|---|---|---|
| `scroll-area` | class | Bounded region (set a height or width) |
| `scroll-area-x` | modifier | Horizontal row |
| `data-fade` | attribute | Fade the scrolling edges |
| `data-bare` | attribute | No border or background |

Accessibility:
- Give the region tabindex="0" and an aria-label so keyboard users can scroll it.

Example (Vertical):

```html
<div class="scroll-area" style="height:240px;width:220px" tabindex="0" aria-label="Tags"><div class="scroll-area-viewport"><b class="t-label-sm">Tags</b><div class="scroll-area-list" style="margin-top:8px"><div>v1.2.0-beta.30</div><div>v1.2.0-beta.29</div><div>v1.2.0-beta.28</div><div>v1.2.0-beta.27</div><div>v1.2.0-beta.26</div><div>v1.2.0-beta.25</div><div>v1.2.0-beta.24</div><div>v1.2.0-beta.23</div><div>v1.2.0-beta.22</div><div>v1.2.0-beta.21</div><div>v1.2.0-beta.20</div><div>v1.2.0-beta.19</div><div>v1.2.0-beta.18</div><div>v1.2.0-beta.17</div><div>v1.2.0-beta.16</div><div>v1.2.0-beta.15</div><div>v1.2.0-beta.14</div><div>v1.2.0-beta.13</div><div>v1.2.0-beta.12</div><div>v1.2.0-beta.11</div><div>v1.2.0-beta.10</div><div>v1.2.0-beta.9</div><div>v1.2.0-beta.8</div><div>v1.2.0-beta.7</div><div>v1.2.0-beta.6</div><div>v1.2.0-beta.5</div><div>v1.2.0-beta.4</div><div>v1.2.0-beta.3</div><div>v1.2.0-beta.2</div><div>v1.2.0-beta.1</div></div></div></div>
```

### Navigation

#### App Layout

A full app shell: sidebar, sticky navbar, main area and an optional right aside. The sidebar collapses to icons (⌘B); on phones it becomes a sheet and the aside becomes an overlay.

- Docs page: `#/components/app-layout`
- Figma: App Layout · sidebar · inset · aside
- React: `npx facetui@latest add app-layout`

| Name | Kind | Notes |
|---|---|---|
| `data-variant` | inset | Inset card body |
| `data-sidebar` | collapsed | Icon rail |
| `data-aside` | auto · open · closed | Right panel (auto = open on desktop, hidden below 1024px) |
| `data-app-toggle` | sidebar · mobile · aside | Toggle buttons |
| `⌘B / Ctrl+B` | shortcut | Collapse the sidebar (full-page layouts) |

Accessibility:
- Landmarks: nav (sidebar), header, main, aside.
- On phones the sidebar opens as a sheet with a scrim; tap the scrim to close.

Example (Inset with aside — try the Mobile toggle):

```html
<div class="app-layout" data-variant="inset" data-aside="auto" style="width:100%;height:560px">
  <nav class="sidebar" aria-label="Main">
    <div class="workspace"><span class="logo">A</span><b class="t-label-md grow label-text">Acme Inc.</b></div>
    <div class="sidebar-label">Workspace</div>
    <a class="sidebar-item" href="#" aria-current="page"><svg class="icon"><use href="#layout-dashboard"/></svg><span class="label-text">Dashboard</span></a>
    <a class="sidebar-item" href="#"><svg class="icon"><use href="#inbox"/></svg><span class="label-text">Inbox</span><span class="count">8</span></a>
    <a class="sidebar-item" href="#"><svg class="icon"><use href="#users"/></svg><span class="label-text">Customers</span></a>
    <a class="sidebar-item" href="#"><svg class="icon"><use href="#bar-chart-3"/></svg><span class="label-text">Reports</span></a>
  </nav>
  <div class="app-body">
    <header class="app-navbar">
      <button class="btn btn-ghost btn-sm icon-btn app-menu-toggle" data-app-toggle="mobile" aria-label="Open menu"><svg class="icon"><use href="#menu"/></svg></button>
      <button class="btn btn-ghost btn-sm icon-btn app-desk-only" data-app-toggle="sidebar" aria-label="Collapse sidebar"><svg class="icon"><use href="#panel-left"/></svg></button>
      <ol class="breadcrumb"><li><a href="#">Acme</a></li><li><svg class="icon"><use href="#chevron-right"/></svg></li><li aria-current="page">Dashboard</li></ol>
      <span class="grow"></span>
      <button class="btn btn-ghost btn-sm icon-btn" aria-label="Search"><svg class="icon"><use href="#search"/></svg></button>
      <button class="btn btn-sm" data-app-toggle="aside"><svg class="icon icon-sm"><use href="#sparkles"/></svg> <span class="label-text">Ask AI</span></button>
    </header>
    <main class="app-main">
      <div class="kpi-group"><div class="kpi"><span class="kpi-label">MRR</span><span class="kpi-value">$248.9k</span></div><div class="kpi"><span class="kpi-label">Customers</span><span class="kpi-value">1,284</span></div><div class="kpi"><span class="kpi-label">Churn</span><span class="kpi-value">2.4%</span></div></div>
      <div class="card card-body" style="min-height:160px"><b class="t-label-md">Content</b><p class="t-body-sm text-tertiary">Main column scrolls; navbar stays on top.</p></div>
    </main>
  </div>
  <aside class="app-aside"><div class="app-aside-head"><svg class="icon icon-sm"><use href="#sparkles"/></svg> Facet AI<span class="grow"></span><button class="btn btn-ghost btn-sm icon-btn" data-app-toggle="aside" aria-label="Close"><svg class="icon"><use href="#x"/></svg></button></div><div style="padding:16px" class="stack"><div class="chat-msg"><span class="ai-mark"><svg class="icon icon-sm"><use href="#sparkles"/></svg></span><div class="chat-msg-body"><div class="chat-msg-text t-body-sm">Ask me about this dashboard.</div></div></div><div class="prompt-suggestions"><button class="prompt-suggestion">Why did churn rise?</button></div></div></aside>
  <div class="app-scrim"></div>
</div>
```

#### Breadcrumb & Pagination

Where you are, and how to move through pages of results.

- Docs page: `#/components/breadcrumb`
- Figma: Breadcrumb · Pagination
- React: `npx facetui@latest add breadcrumb`

| Name | Kind | Notes |
|---|---|---|
| `breadcrumb` | class (ol) | — |
| `page-btn[aria-current=page]` | class | Current page |

Accessibility:
- Wrap in <nav> with aria-label.

Example (Breadcrumb & pagination):

```html
<div class="stack" style="--gap:24px">
<nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="#">Acme</a></li><svg class="icon"><use href="#chevron-right"/></svg><li><a href="#">Projects</a></li><svg class="icon"><use href="#chevron-right"/></svg><li aria-current="page">Q4 Launch</li></ol></nav>
<nav class="pagination" aria-label="Pagination"><button class="page-btn"><svg class="icon icon-sm"><use href="#chevron-left"/></svg> Prev</button><button class="page-btn">1</button><button class="page-btn" aria-current="page">2</button><button class="page-btn">3</button><span class="page-btn" aria-hidden="true">…</span><button class="page-btn">12</button><button class="page-btn">Next <svg class="icon icon-sm"><use href="#chevron-right"/></svg></button></nav>
</div>
```

#### Chip & Link

Chips filter or select; links navigate.

- Docs page: `#/components/chip`
- Figma: Chip · Link
- React: `npx facetui@latest add chip`

| Name | Kind | Notes |
|---|---|---|
| `chip[aria-pressed]` | class | Selectable |
| `link` | class | Underlined text link |

Accessibility:
- Links must have discernible, unique text.

Example (Chips & links):

```html
<button class="chip" data-toggle aria-pressed="true"><svg class="icon icon-sm"><use href="#check"/></svg> Enterprise</button>
<button class="chip" data-toggle aria-pressed="false">SMB</button>
<button class="chip" data-toggle aria-pressed="false">Startup</button>
<a class="link" href="#">Read the docs</a>
```

#### Command Palette

Keyboard-first search, actions and AI in one surface. Press ⌘K / Ctrl K anywhere in this guide to try the live one.

- Docs page: `#/components/command-palette`
- Figma: Command Palette ★
- React: `npx facetui@latest add command-palette`

| Name | Kind | Notes |
|---|---|---|
| `command, command-input, command-list, command-foot` | class | Parts |
| `scope` | class | Scope chip (⇥ to change) |

Accessibility:
- Use combobox + listbox semantics (cmdk handles this).

Example (Command palette):

```html
<div class="command" style="margin:auto" role="dialog" aria-label="Command palette">
  <div class="command-input"><svg class="icon"><use href="#search"/></svg><span class="scope"><svg class="icon icon-sm"><use href="#folder"/></svg> Q4 Launch</span><input value="budget" aria-label="Search"><span class="kbd">esc</span></div>
  <div class="command-list" role="listbox">
    <div class="menu-label">Ask AI</div>
    <div class="menu-item" role="option" aria-selected="true"><svg class="icon"><use href="#sparkles"/></svg> Summarize budget changes this week</div>
    <div class="menu-label">Results in Q4 Launch</div>
    <div class="menu-item" role="option"><svg class="icon"><use href="#file-text"/></svg> Budget review — doc <span class="shortcut">⌘1</span></div>
    <div class="menu-item" role="option"><svg class="icon"><use href="#list-todo"/></svg> Approve budget — task assigned to you <span class="shortcut">⌘2</span></div>
    <div class="menu-label">Actions</div>
    <div class="menu-item" role="option"><svg class="icon"><use href="#plus"/></svg> Create budget request <span class="shortcut">⌘N</span></div>
  </div>
  <div class="command-foot"><span><span class="kbd">↑↓</span> Navigate</span><span><span class="kbd">↵</span> Open</span><span><span class="kbd">⇥</span> Change scope</span></div>
</div>
```

#### Menubar

A desktop-app style menu bar. Click a menu to open it, then hover or use ←/→ to move between menus. Supports shortcuts, checkable items and separators.

- Docs page: `#/components/menubar`
- Figma: Menubar
- React: `npx facetui@latest add menubar`

| Name | Kind | Notes |
|---|---|---|
| `menubar[role=menubar]` | class | Bar |
| `dropdown > menubar-trigger` | class | Each menu (reuses Dropdown Menu) |
| `menuitemcheckbox[aria-checked]` | item | Checkable item |

Accessibility:
- ←/→ move between menus, ↑/↓ inside a menu, Escape closes.
- Shortcuts are hints only — register them in your app too.

Example (Menubar):

```html
<div class="menubar" role="menubar" aria-label="Editor" style="margin-bottom:240px">
  <div class="dropdown"><button class="menubar-trigger" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" role="menuitem">File</button><div class="menu" role="menu"><button class="menu-item" role="menuitem"><svg class="icon"><use href="#file"/></svg>New tab<span class="shortcut">⌘T</span></button><button class="menu-item" role="menuitem">New window<span class="shortcut">⌘N</span></button><button class="menu-item" role="menuitem">New incognito window</button><div class="menu-sep"></div><button class="menu-item" role="menuitem">Share <svg class="icon sub-arrow"><use href="#chevron-right"/></svg></button><div class="menu-sep"></div><button class="menu-item" role="menuitem">Print…<span class="shortcut">⌘P</span></button></div></div>
  <div class="dropdown"><button class="menubar-trigger" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" role="menuitem">Edit</button><div class="menu" role="menu"><button class="menu-item" role="menuitem"><svg class="icon"><use href="#undo-2"/></svg>Undo<span class="shortcut">⌘Z</span></button><button class="menu-item" role="menuitem"><svg class="icon"><use href="#redo-2"/></svg>Redo<span class="shortcut">⇧⌘Z</span></button><div class="menu-sep"></div><button class="menu-item" role="menuitem"><svg class="icon"><use href="#search"/></svg>Find…<span class="shortcut">⌘F</span></button><button class="menu-item" role="menuitem"><svg class="icon"><use href="#copy"/></svg>Copy<span class="shortcut">⌘C</span></button></div></div>
  <div class="dropdown"><button class="menubar-trigger" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" role="menuitem">View</button><div class="menu" role="menu"><button class="menu-item" role="menuitemcheckbox" aria-checked="true"><svg class="icon check-mark"><use href="#check"/></svg> Always show bookmarks</button><button class="menu-item" role="menuitemcheckbox" aria-checked="false"><svg class="icon check-mark"><use href="#check"/></svg> Always show full URLs</button><div class="menu-sep"></div><button class="menu-item" role="menuitem"><svg class="icon"><use href="#refresh-cw"/></svg>Reload<span class="shortcut">⌘R</span></button><button class="menu-item" role="menuitem"><svg class="icon"><use href="#maximize-2"/></svg>Toggle fullscreen</button></div></div>
  <div class="dropdown"><button class="menubar-trigger" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" role="menuitem">Profiles</button><div class="menu" role="menu"><button class="menu-item" role="menuitem"><svg class="icon"><use href="#user"/></svg>Andy</button><button class="menu-item" role="menuitem"><svg class="icon"><use href="#user"/></svg>Benoit</button><button class="menu-item" role="menuitem"><svg class="icon"><use href="#user"/></svg>Luis</button><div class="menu-sep"></div><button class="menu-item" role="menuitem"><svg class="icon"><use href="#pencil"/></svg>Edit…</button><button class="menu-item" role="menuitem"><svg class="icon"><use href="#plus"/></svg>Add profile…</button></div></div>
</div>
```

#### Navbar

A sticky, blurred top bar with brand, links and actions. Under 720px the links collapse into a menu button.

- Docs page: `#/components/navbar`
- Figma: Navbar · desktop · mobile open
- React: `npx facetui@latest add navbar`

| Name | Kind | Notes |
|---|---|---|
| `navbar[data-open]` | attribute | Mobile menu open |
| `navbar-toggle` | button | Shown under 720px |

Accessibility:
- The menu button has aria-expanded; the mobile menu is a nav landmark.

Example (Responsive):

```html
<header class="navbar" style="width:100%;border:1px solid var(--border-default);border-radius:14px 5px 14px 14px">
  <div class="navbar-inner">
    <a class="navbar-brand" href="#"><span class="logo">F</span>Facet</a>
    <nav class="navbar-links"><a href="#" aria-current="page">Product</a><a href="#">Components</a><a href="#">Pricing</a><a href="#">Docs</a></nav>
    <div class="navbar-actions"><a class="btn btn-ghost btn-sm hide-sm" href="#">Sign in</a><a class="btn btn-sm" href="#">Get started</a><button class="btn btn-ghost btn-sm icon-btn navbar-toggle" aria-label="Menu" aria-expanded="false"><svg class="icon"><use href="#menu"/></svg></button></div>
  </div>
  <nav class="navbar-mobile"><a href="#">Product</a><a href="#">Components</a><a href="#">Pricing</a><a href="#">Docs</a><a class="btn btn-outline btn-block" href="#">Sign in</a></nav>
</header>
```

#### Navigation Menu

Site navigation with rich dropdown panels: a featured card plus links with descriptions. Opens on hover on desktop and on tap on touch screens.

- Docs page: `#/components/navigation-menu`
- Figma: Navigation Menu · Navigation Menu Item · Mega
- React: `npx facetui@latest add navigation-menu`

| Name | Kind | Notes |
|---|---|---|
| `nav-menu > nav-menu-list` | class | Bar |
| `nav-menu-trigger[aria-controls]` | button | Opens the panel with that id |
| `nav-menu-viewport > nav-menu-panel` | class | Panels (data-layout="feature" for a featured card) |
| `nav-menu-card · nav-menu-feature · nav-menu-link` | class | Content |

Accessibility:
- Triggers are buttons with aria-expanded; Escape closes and returns focus.
- Wrap the menu in <nav> with an aria-label.

Example (Navigation menu):

```html
<div style="min-height:340px;display:flex;justify-content:center;align-items:flex-start"><nav class="nav-menu" aria-label="Main"><ul class="nav-menu-list">
  <li><button class="nav-menu-trigger" aria-expanded="false" aria-controls="nm-start">Getting started <svg class="icon"><use href="#chevron-down"/></svg></button></li>
  <li><button class="nav-menu-trigger" aria-expanded="false" aria-controls="nm-comp">Components <svg class="icon"><use href="#chevron-down"/></svg></button></li>
  <li><a class="nav-menu-link" href="#">Docs</a></li>
</ul>
<div class="nav-menu-viewport">
  <div class="nav-menu-panel" id="nm-start" data-layout="feature"><a class="nav-menu-feature" href="#"><svg class="icon"><use href="#sparkles"/></svg><b>Facet UI</b><span>Tokens, components and Figma variants in one kit.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#book-open"/></svg> Introduction</b><span>Install and set up your theme.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#layers"/></svg> Theming</b><span>Brand colors, density and style themes.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#code"/></svg> Installation</b><span>CSS + JS, React or Tailwind preset.</span></a></div>
  <div class="nav-menu-panel" id="nm-comp"><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#bell"/></svg> Alert Dialog</b><span>Interrupts with important content.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#message-square"/></svg> Hover Card</b><span>Preview content behind a link.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#sliders-horizontal"/></svg> Progress</b><span>Shows completion of a task.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#panel-left"/></svg> Scroll Area</b><span>Slim, themed scrollbars.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#layout-grid"/></svg> Tabs</b><span>Layered sections of content.</span></a><a class="nav-menu-card" href="#"><b><svg class="icon"><use href="#circle-help"/></svg> Tooltip</b><span>Info on hover or focus.</span></a></div>
</div></nav></div>
```

#### Segment

A segmented control for switching views or values. The thumb slides between options; arrow keys move the selection.

- Docs page: `#/components/segment`
- Figma: Segment · 3 sizes · default · primary · icon
- React: `npx facetui@latest add segment`

| Name | Kind | Notes |
|---|---|---|
| `role=radio aria-checked` | attribute | Selected option |
| `.sm · .lg · .block · .icon-only · .primary` | class | Variants |
| `facet:change` | event | Fires with {value} |

Accessibility:
- Radiogroup semantics with roving tabindex and arrow keys.

Example (Variants):

```html
<div class="stack" style="--gap:14px;align-items:center">
  <div class="segment" role="radiogroup" aria-label="Range"><button role="radio" aria-checked="false">Day</button><button role="radio" aria-checked="true">Week</button><button role="radio" aria-checked="false">Month</button><button role="radio" aria-checked="false">Year</button></div>
  <div class="segment icon-only" role="radiogroup" aria-label="View"><button role="radio" aria-checked="true" aria-label="List"><svg class="icon"><use href="#list"/></svg></button><button role="radio" aria-checked="false" aria-label="Grid"><svg class="icon"><use href="#layout-grid"/></svg></button><button role="radio" aria-checked="false" aria-label="Map"><svg class="icon"><use href="#map"/></svg></button></div>
  <div class="segment primary sm" role="radiogroup" aria-label="Billing"><button role="radio" aria-checked="true">Monthly</button><button role="radio" aria-checked="false">Yearly · save 20%</button></div>
  <div class="segment block lg" role="radiogroup" aria-label="Theme" style="width:100%;max-width:360px"><button role="radio" aria-checked="false"><svg class="icon icon-sm"><use href="#sun"/></svg> Light</button><button role="radio" aria-checked="true"><svg class="icon icon-sm"><use href="#moon"/></svg> Dark</button><button role="radio" aria-checked="false"><svg class="icon icon-sm"><use href="#monitor"/></svg> Auto</button></div>
</div>
```

#### Sidebar

Primary app navigation. The active item gets the signal rail and brand icon.

- Docs page: `#/components/sidebar`
- Figma: Sidebar · Sidebar Item
- React: `npx facetui@latest add sidebar`

| Name | Kind | Notes |
|---|---|---|
| `sidebar-item[aria-current=page]` | class | Active item |
| `sidebar-label` | class | Section label |
| `.count` | child | Trailing count |

Accessibility:
- Use aria-current="page" on the active link.

Example (Sidebar):

```html
<nav class="sidebar card" aria-label="Main" style="height:420px">
  <div class="workspace"><span class="logo">A</span><b class="t-label-md grow">Acme Inc.</b><svg class="icon icon-sm"><use href="#chevrons-up-down"/></svg></div>
  <div class="sidebar-label">Workspace</div>
  <a class="sidebar-item" href="#" aria-current="page"><svg class="icon"><use href="#layout-dashboard"/></svg> Dashboard</a>
  <a class="sidebar-item" href="#"><svg class="icon"><use href="#inbox"/></svg> Inbox <span class="count">12</span></a>
  <a class="sidebar-item" href="#"><svg class="icon"><use href="#folder"/></svg> Projects</a>
  <a class="sidebar-item" href="#"><svg class="icon"><use href="#users"/></svg> Customers</a>
  <div class="sidebar-label">Insights</div>
  <a class="sidebar-item" href="#"><svg class="icon"><use href="#bar-chart-3"/></svg> Reports</a>
  <a class="sidebar-item" href="#"><svg class="icon"><use href="#settings"/></svg> Settings</a>
</nav>
```

#### Stepper

Progress through a multi-step flow (onboarding, checkout).

- Docs page: `#/components/stepper`
- Figma: Step · Stepper
- React: `npx facetui@latest add stepper`

| Name | Kind | Notes |
|---|---|---|
| `data-state` | complete \| current \| upcoming | Step state |

Accessibility:
- Mark the current step with aria-current="step".

Example (Stepper):

```html
<ol class="stepper" style="max-width:640px;margin:auto">
  <li class="step" data-state="complete"><span class="step-bar"></span><b>Account</b><span>Done</span></li>
  <li class="step" data-state="current" aria-current="step"><span class="step-bar"></span><b>Workspace</b><span>In progress</span></li>
  <li class="step" data-state="upcoming"><span class="step-bar"></span><b>Invite team</b><span>Next</span></li>
  <li class="step" data-state="upcoming"><span class="step-bar"></span><b>Connect data</b><span>Optional</span></li>
</ol>
```

#### Tabs

Switch between views of the same context. Arrow keys move between tabs.

- Docs page: `#/components/tabs`
- Figma: Tab · Tab List (Underline / Pill)
- React: `npx facetui@latest add tabs`

| Name | Kind | Notes |
|---|---|---|
| `tabs-list \| tabs-pill` | class (tablist) | Style |
| `aria-selected / aria-controls` | attribute | State + panel link |

Accessibility:
- Roving tabindex: only the selected tab is in the tab order.

Example (Pill):

```html
<div class="tabs-pill" role="tablist" aria-label="Range">
  <button class="tab" role="tab" aria-selected="false">Day</button><button class="tab" role="tab" aria-selected="true">Week</button><button class="tab" role="tab" aria-selected="false">Month</button>
</div>
```

### Overlays

#### Accordion

Progressive disclosure using native &lt;details&gt;.

- Docs page: `#/components/accordion`
- Figma: Accordion · Accordion Item
- React: `npx facetui@latest add accordion`

| Name | Kind | Notes |
|---|---|---|
| `accordion > details > summary` | structure | Native disclosure |

Accessibility:
- Native details/summary is keyboard and screen-reader accessible.

Example (Accordion):

```html
<div class="accordion" style="max-width:560px;margin:auto">
  <details open><summary>Can I change the brand color?<svg class="icon"><use href="#chevron-down"/></svg></summary><div>Yes — switch data-brand or call Facet.theme.setCustomBrand('#ff5a1f').</div></details>
  <details><summary>Does it support dark mode?<svg class="icon"><use href="#chevron-down"/></svg></summary><div>Every semantic token has Light and Dark values.</div></details>
  <details><summary>Does it work with React?<svg class="icon"><use href="#chevron-down"/></svg></summary><div>Yes. Install the animated React components with <code>npx facetui</code>, or use the Tailwind preset with your own markup.</div></details>
</div>
```

#### Context Menu

A menu that opens on right-click (or long-press on touch) at the cursor, with shortcuts, checkable items and a danger action.

- Docs page: `#/components/context-menu`
- Figma: Context Menu · items · checkable · submenu
- React: `npx facetui@latest add context-menu`

| Name | Kind | Notes |
|---|---|---|
| `data-context-menu` | menu id | Element that opens the menu |
| `role=menuitemcheckbox aria-checked` | attribute | Checkable item |

Accessibility:
- Opens with the context-menu key too; Escape closes.
- Offer the same actions somewhere visible — not everyone right-clicks.

Example (Right-click the area):

```html
<div class="context-area" data-context-menu="ctx-demo" style="max-width:520px;margin:auto"><svg class="icon"><use href="#mouse-pointer-click"/></svg><div>Right-click here (or long-press on a phone)</div></div>
<div class="menu context-menu" id="ctx-demo" role="menu">
  <button class="menu-item" role="menuitem"><svg class="icon"><use href="#copy"/></svg> Copy<span class="shortcut">⌘C</span></button>
  <button class="menu-item" role="menuitem"><svg class="icon"><use href="#pencil"/></svg> Rename<span class="shortcut">F2</span></button>
  <button class="menu-item" role="menuitem"><svg class="icon"><use href="#share-2"/></svg> Share…</button>
  <div class="menu-sep"></div>
  <button class="menu-item" role="menuitemcheckbox" aria-checked="true"><svg class="icon check-mark"><use href="#check"/></svg> Show grid</button>
  <button class="menu-item" role="menuitemcheckbox" aria-checked="false"><svg class="icon check-mark"><use href="#check"/></svg> Snap to pixels</button>
  <div class="menu-sep"></div>
  <button class="menu-item danger" role="menuitem"><svg class="icon"><use href="#trash-2"/></svg> Delete<span class="shortcut">⌫</span></button>
</div>
```

#### Dialog

Modal for focused tasks or confirmation. Escape and backdrop click close it; focus returns to the trigger.

- Docs page: `#/components/dialog`
- Figma: Dialog · Alert Dialog
- React: `npx facetui@latest add dialog`

| Name | Kind | Notes |
|---|---|---|
| `data-open="id"` | trigger attribute | Opens the overlay with that id |
| `data-close` | attribute | Closes the nearest overlay |
| `overlay > dialog` | structure | Backdrop + panel |

Accessibility:
- role=dialog + aria-modal + aria-labelledby.
- For production, add a focus trap (Radix Dialog does this).

Example (Dialog):

```html
<button class="btn" data-open="demo-dialog">Invite teammates</button>
<div class="overlay" id="demo-dialog" hidden>
  <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dt">
    <div class="dialog-header"><div class="dialog-title" id="dt">Invite teammates</div><div class="dialog-desc">They'll get an email with a link to join Acme.</div></div>
    <div class="dialog-body"><div class="field"><label class="label" for="dm">Email addresses</label><input class="input" id="dm" placeholder="name@acme.co, …" autofocus></div>
      <div class="field"><label class="label" for="dr">Role</label><select class="select" id="dr"><option>Member</option><option>Admin</option></select></div></div>
    <div class="dialog-footer"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn" data-close>Send invites</button></div>
  </div>
</div>
```

#### Dropdown Menu

Actions in a floating menu. Highlighted items show the signal rail. Arrow keys move focus.

- Docs page: `#/components/dropdown-menu`
- Figma: Dropdown Menu · Menu Item · Context Menu
- React: `npx facetui@latest add dropdown-menu`

| Name | Kind | Notes |
|---|---|---|
| `dropdown` | class | Positioning wrapper; dropdown-end aligns right |
| `data-dropdown-trigger` | attribute | Toggles the menu |
| `menu-item.danger` | class | Destructive item |

Accessibility:
- role=menu / menuitem; trigger has aria-haspopup and aria-expanded.
- Escape closes.

Example (Dropdown):

```html
<div class="dropdown" style="margin-bottom:220px">
  <button class="btn btn-outline" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false">Options <svg class="icon"><use href="#chevron-down"/></svg></button>
  <div class="menu" role="menu">
    <div class="menu-label">Project</div>
    <button class="menu-item" role="menuitem"><svg class="icon"><use href="#pencil"/></svg> Rename <span class="shortcut">⌘R</span></button>
    <button class="menu-item" role="menuitem"><svg class="icon"><use href="#copy"/></svg> Duplicate <span class="shortcut">⌘D</span></button>
    <button class="menu-item" role="menuitem"><svg class="icon"><use href="#share-2"/></svg> Share</button>
    <div class="menu-sep" role="separator"></div>
    <button class="menu-item danger" role="menuitem"><svg class="icon"><use href="#trash-2"/></svg> Delete</button>
  </div>
</div>
```

#### Emoji Picker

Search, categories, skin tones and a live preview. Fires facet:emoji with the chosen emoji; data-target inserts it into an input.

- Docs page: `#/components/emoji-picker`
- Figma: Emoji Picker
- React: `npx facetui@latest add emoji-picker`

| Name | Kind | Notes |
|---|---|---|
| `data-target` | element id | Insert into this input |
| `facet:emoji` | event | {emoji, name} |

Accessibility:
- Every emoji is a button with its name as the label; search filters by name.

Example (Picker):

```html
<div class="stack" style="--gap:10px;align-items:center"><div class="emoji-picker" data-target="ep-out"></div><input class="input" id="ep-out" placeholder="Picked emoji appear here" style="width:320px"></div>
```

#### Popover, Hover Card & Tooltip

Lightweight floating content. Tooltips are CSS-only via data-tooltip.

- Docs page: `#/components/popover`
- Figma: Popover · Hover Card · Tooltip
- React: `npx facetui@latest add popover`

| Name | Kind | Notes |
|---|---|---|
| `data-tooltip` | attribute | Tooltip text |
| `data-tooltip-side="bottom"` | attribute | Placement |
| `popover` | class | Floating surface |

Accessibility:
- Tooltips must not hold essential info; they don't show on touch.

Example (Tooltip & popover):

```html
<button class="btn btn-outline" data-tooltip="Copy link"><svg class="icon"><use href="#link"/></svg> Hover me</button>
<div class="popover"><div class="row" style="--gap:12px"><span class="avatar av-1">MC</span><div><b class="t-label-md">Maya Chen</b><div class="t-body-xs text-tertiary">Design lead · Lisbon</div></div></div><p class="t-body-sm text-secondary" style="margin-top:12px">Owns the design system and onboarding redesign.</p></div>
```

#### Sheet (sides & parts)

Side panels with a header, scrolling body and footer. Use left for navigation, right for details and forms, bottom (drawer) on mobile.

- Docs page: `#/components/sheet-pro`
- Figma: Sheet · right · left · bottom
- React: `npx facetui@latest add sheet-pro`

| Name | Kind | Notes |
|---|---|---|
| `sheet-overlay · sheet-left` | class | Right (default) or left |
| `sheet-head · sheet-body · sheet-foot` | class | Parts |

Accessibility:
- Trap focus inside and return it to the trigger on close.

Example (Right sheet (inline demo)):

```html
<div class="inline-sheet"><div class="overlay sheet-overlay"><div class="sheet" role="dialog" aria-label="Edit deal">
  <div class="sheet-head"><b class="t-h5 grow">Edit deal</b><button class="btn btn-ghost btn-sm icon-btn" aria-label="Close"><svg class="icon"><use href="#x"/></svg></button></div>
  <div class="sheet-body"><div class="field"><label class="label" for="sh1">Name</label><input class="input" id="sh1" value="Northwind renewal"></div><div class="field"><label class="label" for="sh2">Amount</label><input class="input" id="sh2" value="$12,400"></div><div class="field"><label class="label" for="sh3">Stage</label><select class="select" id="sh3"><option>Negotiation</option></select></div></div>
  <div class="sheet-foot"><button class="btn btn-outline">Cancel</button><button class="btn">Save</button></div>
</div></div></div>
```

#### Sheet & Drawer

Side panel for long forms and detail views; bottom drawer on mobile.

- Docs page: `#/components/sheet`
- Figma: Sheet · Drawer
- React: `npx facetui@latest add sheet`

| Name | Kind | Notes |
|---|---|---|
| `overlay.sheet-overlay > .sheet` | structure | Right-side panel |
| `overlay.drawer-overlay > .drawer` | structure | Bottom drawer |

Accessibility:
- Same rules as Dialog.

Example (Sheet / drawer):

```html
<button class="btn btn-outline" data-open="demo-sheet">Open sheet</button>
<button class="btn btn-outline" data-open="demo-drawer">Open drawer</button>
<div class="overlay sheet-overlay" id="demo-sheet" hidden>
  <aside class="sheet" role="dialog" aria-modal="true" aria-label="Edit customer">
    <div class="dialog-header row" style="justify-content:space-between"><div class="dialog-title">Edit customer</div><button class="btn btn-ghost btn-sm icon-btn" data-close aria-label="Close"><svg class="icon"><use href="#x"/></svg></button></div>
    <div class="dialog-body grow"><div class="field"><label class="label" for="sn">Company</label><input class="input" id="sn" value="Northwind"></div><div class="field"><label class="label" for="se">Billing email</label><input class="input" id="se" value="ops@northwind.io"></div></div>
    <div class="dialog-footer"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn" data-close>Save</button></div>
  </aside>
</div>
<div class="overlay drawer-overlay" id="demo-drawer" hidden>
  <div class="drawer" role="dialog" aria-modal="true" aria-label="Share">
    <div class="dialog-body"><div class="dialog-title">Share “Q4 Launch”</div><button class="btn btn-block"><svg class="icon"><use href="#link"/></svg> Copy link</button><button class="btn btn-outline btn-block" data-close>Done</button></div>
  </div>
</div>
```

---

Generated by `node scripts/build_llms.mjs` from Facet UI v1.3.0. Facet UI © 2026 ETKits. Licensed to Facet UI buyers only; do not publish this file.
