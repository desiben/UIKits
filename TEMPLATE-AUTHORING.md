# Authoring a template

FacetUI Industry Templates · © 2026 ETKits. This is the contract every template follows. Read it fully, then read the three reference templates before writing anything:

- `src/templates/healthcare/`: service discovery and multi-step booking (light, soft style, lagoon)
- `src/templates/architecture/`: image-led editorial portfolio (light, mono style, custom brand, expanded type)
- `src/templates/gaming/`: dense live data (dark, glass style, custom brand, condensed type)

## 1. Files

```
src/templates/<slug>/
  content.mjs    default export: brand, theme, header, nav, footer, copy, demo data, images
  pages.mjs      default export: array of page definitions (structure only, reads content)
  template.css   composition styles for this template only (tokens only)
  template.js    optional: interactions specific to this template
  images/        optional: <slot>.webp|jpg|png|avif + credits.json (photos supplied later)
```

Build and check only your template, in your own output folder, so parallel work never collides:

```bash
DIST_DIR=/tmp/claude-0/dist-<slug> node build.mjs <slug>
DIST_DIR=/tmp/claude-0/dist-<slug> python3 tools/verify.py <slug> --shots /tmp/claude-0/shots-<slug>
```

`build.mjs` fails on unknown icons, links to missing pages, raw hex colors, `font-family` in template.css, lorem ipsum, and registered-but-unused images. `verify.py` checks every page at 375/390/768/1024/1440 px for overflow, console errors, broken icons and axe WCAG 2.2 AA; it also tests the mobile menu with the keyboard, focus visibility, filters, the conversion flow (empty submit → error summary, auto-fill → simulated success) and `?demo=error`. **A template is done only when it shows `[PASS]` and you have looked at the desktop and mobile screenshots yourself and fixed what looks wrong.**

## 2. content.mjs

```js
export default {
  slug: "food",
  business: "wood-fire restaurant",            // used in the footer's "fictional" notice
  description: "…",                            // meta description for the home page
  brand: { name: "…", tagline: "…", markPath: "M… (32×32 viewBox SVG path)" },  // or markText: "FE"
  theme: { mode: "light"|"dark", brand: "iris|ember|lagoon|rose|cobalt|forest" | "<custom-name>",
           custom: { hex: "#rrggbb" },         // only for custom brands: build generates the ramp with Facet's algorithm
           style: "soft"|"glass"|"mono"|undefined, density: "comfortable"|"compact", themeColor: "#…" },
  header: { variant: "bar"|"overlay", utility: [{ icon, label, href|page+hash }], secondary: {label, page, hash}, cta: { label, page } },
  nav: [{ label, page, hash? , query? }],     // `page` is a page key from pages.mjs
  footer: { variant: "columns"|"statement"|"compact", statement?, blurb, contact: [{icon,label,href}], columns: [{ title, links }], theme?: "dark" },
  images: { key: { alt, brief, search, focal: "50% 40%", ratio: "4/3", ratioSm?, icon?, placement } },
  // …any demo data the pages need
};
```

Links are objects: `{ page: "book", query: { service: "x" }, hash: "faq" }`; `ctx.href(link)` turns them into URLs. Query parameters prefill fields with the same `name` in any kit form.

## 3. pages.mjs

```js
import { html, raw } from "../../kit/html.mjs";
import { icon, btn, badge, media, sectionHead, breadcrumb, tabs, accordion, stepper, kitForm, field, choices,
         checkbox, datePicker, filterable, chip, emptyState, alertBox, avatar, mapFrame, demoNotice } from "../../kit/ui.mjs";
import content from "./content.mjs";
export default [
  { key: "home", file: "index.html", title: "Home", short: "Home", render: (ctx) => html`…` },
  { key: "item-x", file: "item-x.html", title: "…", short: "Detail", kitbar: false, render(ctx) {…} },
  { key: "book", file: "book.html", title: "…", short: "Book", render(ctx) {…} },
];
```

- `html\`\`` escapes every interpolation; use `raw()` only for trusted markup you built.
- Generate one detail page per item when the home page links to items (see healthcare services, architecture projects). Every link must go somewhere real. Set `kitbar: false` on all but one generated detail page.
- `ctx` gives `tpl` (content), `page`, `pages`, `href()`, `images`. Read the helper signatures in `src/kit/ui.mjs`.
- Required per template: **home**, at least one **inner page**, and a **conversion flow** built with `kitForm()` (single page or `steps`). The success text must say what *would* happen on a live site; the kit adds the "Simulated: no request was sent" line and the summary automatically.
- Other demo actions (watch, save, notify, pay) use Facet's declarative toast: `data-sonner='{"title":"…","description":"Demo only: …","type":"info"}'`. Never imply a real transaction happened.

## 4. Components and classes

Use Facet UI classes exactly as documented (FacetUI guide §12): `btn`, `card`, `card-body`, `badge-*`, `item-card`, `table-wrap > table.table`, `progress`, `avatar`, `chip`, `segment`, `tabs-list`, `accordion`, `alert-*`, `empty`, `skeleton`, `map`, `carousel`, `stepper`… Prefer the `ui.mjs` helpers; they wire accessibility and kit behaviors.

Kit layout classes (`src/kit/kit.css`): `k-wrap` (`--narrow`, `--wide`), `k-section` (`--tight`, `--flush-top`), `k-surface`, `k-grid k-grid--2|3|4`, `k-split` (+ `--k-split-a/-b` ratios, `k-split--center`), `k-sticky-col`, `k-stack` (`--k-gap`), `k-cluster`, `k-hscroll`, type: `k-display` (`--xl`), `k-h1…k-h5`, `k-lede`, `k-prose`, `k-num`. One orchestrated entrance per page: put `k-enter` on the hero's text container and `style="--i:n"` on its children.

Section-level theme switches are allowed: `<section class="k-section" data-theme="dark">`.

## 5. Visual rules (FacetUI)

1. **Tokens only** in template.css and inline styles: `var(--bg-*)`, `--text-*`, `--border-*`, `--icon-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--text-heading-h3` etc., `--duration-*`, `--ease-*`, `--chart-1…6`, `--brand-50…950`. No hex/rgb/hsl, no px font sizes, no `font-family`.
2. **Mona Sans only.** Personality comes from width (`--k-stretch-display`, `--k-stretch-heading`: 75%–125%), weight (400/500/600 via `--k-weight-display`) and scale.
3. **Keep the Facet signature:** the Facet cut (`facet`, `facet-sm`, or `border-radius: var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)`) on containers, and the signal rail where something is active.
4. Prefix every class in template.css with a 2–3 letter template prefix (`hl-`, `sv-`, `nf-`). Never restyle Facet classes globally; scope overrides under your prefix.
5. Motion: `transform`/`opacity` only. kit.css disables animation under reduced motion. Anything that updates on its own for more than 5 seconds needs a visible pause control.
6. Breakpoints (mobile-first): 480, 768, 1024, 1280, 1440. Design each width; don't just shrink. The kit collapses the navbar below 1024px.

## 6. Composition: make it unmistakably this industry

Each template's brief names its **hero archetype** and **signature element**. Spend your boldness there; keep the rest quiet. Hard rules:

- No generic "centered headline + three feature cards + testimonials + pricing grid" page. No testimonial carousels with invented quotes from named customers.
- The hero opens with the most characteristic thing in the industry's world (a working tool, a live state, a menu, a map, an object), not a stock slogan.
- Vary section sequencing, density and alignment. Numbered markers only for real sequences.
- Avoid template tells: ALL-CAPS eyebrow labels over every heading, `A · B · C` meta strings everywhere, a `→` appended to every link, gradient washes as decoration, identical cards with identical shadows.
- Filterable collections use `filterable()` and must include an empty state with a clear-filters action.

## 7. Copy

- US English, sentence case, plain verbs. CTAs say what happens ("Request a viewing", not "Submit"); the success title echoes the action ("Viewing request complete").
- All brands, people, addresses (use `(555) 01x-xxxx` phone numbers and `.example` domains) and figures are fictional. **Don't present invented certifications, regulatory approvals, awards, clinical outcomes, investment returns, endorsements, customer quotes, or affiliations with real organizations as facts.** Don't use real game, film, music or product titles.
- No lorem ipsum, no "Lorem", no "Your text here", no unfinished sections.
- Errors explain what to fix. Empty states invite the next action.

## 8. Images

Stock photo sites were not reachable when the collection was built, so every image is a registered **slot**: `media(ctx, "key", { ratio, ratioSm, shape: "facet"|"sm"|"none", priority, fill, hideBrief })`. A slot renders as a labelled, art-directed placeholder until a photo is dropped into `images/<key>.webp`. For each image write:

- `alt`: what the photo will show (empty string for decorative art), `brief`: a one-line art direction, `search`: 3–6 words to search Unsplash/Pexels with, `focal` (and `focalSm` if the mobile crop differs), `ratio`/`ratioSm`, `placement`.
- Be specific to the business and audience; never a generic office or handshake. Scientific/technical content needs the right subject (no "lab" stock for an observatory).
- Keep the count sensible: roughly 6–14 slots per template. Use icons, data, maps, avatars and typography for the rest.
- Only one `priority: true` image per page (the hero); everything else lazy-loads.

## 9. Accessibility (WCAG 2.2 AA)

- One `h1` per page; headings in order; landmarks come from the layout.
- Every control has a visible label; icon-only buttons need `aria-label`. Use `<button>` for actions and `<a>` for navigation.
- Status is never color-only: badges carry text.
- Touch targets ≥ 44px where practical (kit handles navbar, chips and small buttons on touch screens).
- Tables use `<caption>` (can be `sr-only`), `<th scope>`; wide tables go in `.table-wrap` (the kit makes it keyboard-scrollable).
- Hover may enhance but never be the only way to reach content.
