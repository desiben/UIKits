# Changelog

All notable changes to Facet UI. Dates are YYYY-MM-DD.

## [Unreleased]

### Added
- **Animated React components.** All 109 components are React components with motion on every interaction: spring presses, sliding layout indicators, height-animated disclosure, popovers that open from their trigger, drag (kanban, carousel, sheets), tilt (holo card), rolling numbers and streaming AI states. They're built on Radix primitives and Tailwind v4, and the animations respect reduced motion.
- **shadcn registry with license-key access.** Install with `shadcn add @facet/<name>`, or `@facet/all`. `@facet/theme` maps Facet's light and dark tokens onto the standard shadcn variables, plus Facet extras and the signature corner utilities (`rounded-facet*`). The `/r/<name>.json` endpoint checks the buyer's Gumroad license key.
- **React showcase** at `/react/` with live demos and copyable install commands (pnpm, npm, yarn, bun).
- **Style guide:** every component page has a "React · animated" install section, the Installation page has a React section, and the header nav has a React link.

### Changed
- The maker credit is now **ETKits** (was ELTouch apps) everywhere: README, license, style guide, marketing page, Figma file, and the re-rendered marketing images and videos.

## [1.3.0] — 2026-10-20

Every component in the shadcn/ui list now has a Facet counterpart in Figma and in the style guide.

### Added
- Style guide: 17 new components, each with live examples, a React (shadcn/ui) snippet, API and accessibility notes: Aspect Ratio, Button Group, Input Group, Label, Collapsible, Scroll Area, Sonner, Bubble, Marker, Message Scroller, Questionnaire, Trace, Combobox, Select, Textarea, Menubar and Navigation Menu (109 documented components in total).
- Figma: 13 new variant sets (57 variants) plus a composed Trace, in three new groups on the Components page:
  - Forms & Actions: Label (Default, Required, Optional, Disabled), Button Group (Outline, Split, With Input, Vertical), Input Group (Icon + Text × Default/Focus/Error, Prefix + Suffix, Button, Textarea), Q Option, Questionnaire (Single, Multiple, Freeform, Summary).
  - Layout & Feedback: Aspect Ratio (16:9, 4:3, 1:1, 9:16), Collapsible (Closed, Open), Scroll Area (Vertical, Horizontal), Sonner (7 types, Stack, Expanded).
  - AI: Bubble (5 variants × Start/End), Marker (Date, Status, Unread, Pill), Trace Item (Done, Running, Error, Pending), Message Scroller (At bottom, Scrolled up).
- `src/v13.css` and `src/v13.js` (built into `facet.css` / `facet.js`). `Facet.sonner()` with `success`, `error`, `info`, `warning`, `loading`, `promise` and `dismiss`.

- FacetUI-Templates: 36 pre-made blocks (56 variants) built from Facet components — dashboards, marketing sections, e-commerce, forms and system states.
  - Code: `styleguide/templates/` — a living page with a brand-color picker (six presets or any color), light/dark, four styles, motion on/off and replay, desktop/mobile preview and copy-paste HTML for every variant. Real Unsplash photography throughout — full-bleed photo heroes with a slow Ken Burns zoom, a commerce hero with product shots, and photo backdrops on the dark hero, 404, CTA, stats band, footer and contact map.
  - Figma: new page "09 — FacetUI-Templates" with all 36 blocks. Switch the Brand and Color modes on the wrapper frame to re-theme every block at once. Every image slot is filled with its Unsplash photo (layer names keep the `unsplash/<id>` reference).

### Changed
- Dropdowns stay open for clicks inside the menu (such as a combobox search box), and arrow keys skip filtered-out options.
- "New in v1.x" badges show the release a component arrived in.

## [1.2.1] — 2026-10-17

### Figma
- Every v1.2 component now has the variants its style-guide examples show. New variant sets: Chart · Area (Default, Stacked, Gaps), Chart · Bar (Default, Grouped, Stacked), Chart/Line (Single, Multiple, Target), Chart Tooltip (1–3 rows), KPI (Default, Sparkline, Icon + Footer, Progress), Item Card Group (Joined, List, Grid), Floating TOC (Collapsed, Open), Holo Card (Membership, Credit), Code Block (Default, Numbered, Diff), Resizable (Horizontal, Vertical), Checkbox Button Group (List, Grid), Radio Button Group (Cards, Buttons), Rich Text Editor (Toolbar, Bubble), Context Menu (Default, Checkable, Submenu).
- New axes on existing sets: Rating Size (SM, MD, LG), Cell Slider Secondary, Native Select State (Default, Disabled, Invalid), Number Stepper Style (Default, Pill, Ghost), Segment Size and Primary style, App Layout Layout (Sidebar, Inset, Aside), Sheet Side Bottom, Menu Item Type Submenu, and a Show icon property on Item Card.
- Original components were kept as the default variant, so existing instances stay linked.
- Removed 56 stray layers from the Components page.

### Changed
- Style guide "Figma" labels now name the exact Figma component and variants.

## [1.2.0] — 2026-10-16

### Added
- 56 new components (144 in Figma, 78 variant sets, 504 variants; 92 documented on the site):
  - Charts: line, composed, pie/donut, radar, radial (rings, gauge), sparkline, chart tooltip.
  - Data display: Widget, KPI, KPI Group, Trend Chip, Item Card, Item Card Group, List View, Agenda, Action Bar, Carousel, Data Grid, File Tree, Floating TOC, Holo Card, Map.
  - AI: Chat Conversation, Chain of Thought, Chat Tool (with approval), Chat Loader, Message Actions, Chat List, Prompt Suggestion, Citation, Chat Attachment, Markdown, Text Shimmer.
  - Feedback and layout: Rating (half stars), Emoji Reaction, Number Value, Pressable, Resizable.
  - Forms: Cell (switch, select, slider, color), Cell Group, Checkbox/Radio Button Group, Inline Select, Native Select, Number Stepper, Rich Text Editor.
  - Navigation and overlays: Segment, Navbar, App Layout (desktop + mobile, auto aside), Context Menu, Emoji Picker, Sheet.
- `assets/charts.js`: a declarative SVG chart renderer.
- Style themes Default, Soft, Glass and Mono (`Facet.theme.setStyle`), a header Style menu and a Styles page. In Figma: a Style collection plus a Brand Mono mode.
- 6 AI agent demos (`styleguide/agents/`) and an Agents gallery page.
- Components overview with live previews and search, Copy Markdown on every page, and a Desktop / Mobile viewport toggle on every example.
- 47 new Lucide icons (147 in Figma, 199 in the site sprite).
- Build scripts: `scripts/build_assets.sh` (concatenates `assets/src/` into `facet.css` / `facet.js`) and `scripts/build_icons.py`.

### Changed
- Sidebar categories were reorganised into Actions, Forms, Data display, Charts, AI, Feedback, Layout, Navigation and Overlays.
- Responsive internals use container queries, so components adapt to their container, not just to the viewport.

## [1.1.2] — 2026-10-16

### Added
- Marketing kit page at [`/marketing/`](https://facetui.vercel.app/marketing/), linked from the style guide header and the Showcase page.
- Product demo video (55 s, 1920×1080, MP4 + WebM) and components reel (33 s, live components with a real cursor).
- 13 marketing images: 11 angled 16:9 shots at 3840×2160 and 2 squares at 2160×2160, with WebP thumbnails.
- Listing copy (tagline, one-liner, description, feature bullets) with copy buttons.
- Sources and render scripts: `marketing/` and `scripts/render_marketing_images.js`, `render_marketing_video.js`, `render_marketing_reel.js`.
- A subtle "by ETKits" credit in the README, style guide pages, marketing images, videos and Figma cover.

## [1.1.0] — 2026-10-16

### Added
- Motion layer: `styleguide/assets/motion.css` + `motion.js`. These add micro-interactions to every component: hover lift and cursor spotlight, press ripple, lively icons, spring switches, check-draw, gliding tab/menu/sidebar indicators, 3D tilt (`data-tilt`), magnetic buttons (`data-magnetic`), count-up KPIs, chart reveal, smooth accordions, staggered menus, and toast progress with exit.
- Motion tokens: `--duration-instant/slow/slower`, `--ease-spring`, `--ease-in-out`, `--ease-bounce`, `--lift-sm/md`, `--press-scale`.
- A Motion page in the style guide (principles, live demos, tokens, interaction catalog, React mapping), a Motion note on every component page, and a ⚡ motion toggle in the header.
- Figma: 78 component interactions now use Smart Animate with a Gentle spring. Hover variants of buttons, icon buttons and chips have Elevation/1. New "Motion & micro-interactions" guide on 07 — Documentation.
- Marketplace previews: 8 images at 1920×1080 on 00 — Start Here, also in [`FacetUI-marketplace-previews/`](https://github.com/desiben/UIKits/tree/FacetUI/FacetUI-marketplace-previews).
- Demo video [`facet-micro-interactions.mp4`](https://github.com/desiben/UIKits/blob/FacetUI/facet-micro-interactions.mp4), and a Showcase page in the style guide.

### Changed
- Hover states are subtler: a fainter cursor spotlight (2.5%), a lighter brand tint on borders, 1px lifts, smaller shadows (shadow-1 on buttons, shadow-2 on cards) and a gentler tilt (max 3–4°).

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
