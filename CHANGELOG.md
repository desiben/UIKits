# Changelog

All notable changes to Facet UI. Dates are YYYY-MM-DD.

## [1.1.0] — 2026-10-16

### Added
- Motion layer: `styleguide/assets/motion.css` + `motion.js`. These add micro-interactions to every component: hover lift and cursor spotlight, press ripple, lively icons, spring switches, check-draw, gliding tab/menu/sidebar indicators, 3D tilt (`data-tilt`), magnetic buttons (`data-magnetic`), count-up KPIs, chart reveal, smooth accordions, staggered menus, and toast progress with exit.
- Motion tokens: `--duration-instant/slow/slower`, `--ease-spring`, `--ease-in-out`, `--ease-bounce`, `--lift-sm/md`, `--press-scale`.
- A Motion page in the style guide (principles, live demos, tokens, interaction catalog, React mapping), a Motion note on every component page, and a ⚡ motion toggle in the header.
- Figma: 78 component interactions now use Smart Animate with a Gentle spring. Hover variants of buttons, icon buttons and chips have Elevation/2. New "Motion & micro-interactions" guide on 07 — Documentation.
- Marketplace previews: 8 images at 1920×1080 on 00 — Start Here, also in `docs/marketplace/`.

### Fixed
- The Accordion docs page rendered as one collapsed block, because of an unescaped `<details>` in its description.

## [1.0.0] — 2026-10-16

### Added — Figma
- 04 Patterns: 23 pattern components (app shell, filter bar, KPI row, table toolbar, auth forms, onboarding, AI dock, marketing sections).
- 05 Templates: 10 apps, 26 desktop + mobile screens (SaaS analytics, CRM, project management, AI workspace, e-commerce, finance, calendar, settings, auth & onboarding, marketing).
- 06 Playground: sandboxes, theme lab, component tray and clickable prototype flows (Auth → Onboarding → Dashboard; Settings sections).
- 78 interactive component states (hover / press / toggle) on Button, Icon Button, Tab, Checkbox, Switch, Toggle, Menu Item, Sidebar Item, Input, Chip, Accordion.
- 07 Documentation: 20 component doc cards and a customization & handoff guide.
- Brand modes Rose, Cobalt and Forest (6 total) and a "Change the brand color in one click" section on 02 Design Tokens.
- Text styles Display/3XL, Display/LG and Body/XL (25 total).

### Added — Code
- `tokens/` — CSS variables, W3C DTCG JSON and Tailwind preset generated from Figma variables.
- `styleguide/` — living style guide (30 component pages, foundations, theming, brand studio, ⌘K search).
- `Facet.theme.setCustomBrand(hex)` — accessible brand ramp from any color.
- Example pages: dashboard, login (with OTP step), settings.

### Fixed
- HTML-escaped characters in component descriptions.
- Placeholder values in Email / Password fields across templates.
- Timeline item body text now wraps inside its card.

## [0.6.0] — 2026-10-15
- Calendar, date / range / time pickers, popover, hover card, sheet, drawer, navigation menu, menubar, context menu, input OTP, chip, link, stepper, dropzone, attachment, chart set.
- Signature set: AI copilot panel, prompt composer, message, source card, code block, activity timeline, notification center, kanban, pricing card, tree, filter builder, workflow builder, resource planner, expandable data card.

## [0.5.0] — 2026-10-15
- Direction exploration (Graphite, Paper, Facet → Facet selected).
- 6 variable collections (228 variables), 22 Mona Sans text styles, 8 effect styles, 100 Lucide icons.
- 45 core components / 351 variants, all token-bound.
