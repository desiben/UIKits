# Facet UI — Figma file guide

**File:** delivered with your purchase (open the Figma link in your Gumroad receipt).

## Before you start
1. Install **Mona Sans** (Google Fonts) so text renders correctly.
2. Use a Figma **Professional** plan or higher — variable modes (brand, light/dark, density) require it.
3. Duplicate the file to your drafts, or publish it as a team library and enable it in your product files.

## Pages
| Page | What to do there |
|---|---|
| 00 — Start Here | Read the principles and inventory; status reflects what exists in the file. |
| 01 — Foundations | Color ramps, type scale, spacing, radius, elevation, icons. |
| 02 — Design Tokens | Theme matrix, density, CSS reference, **brand color examples** (6 modes side by side). |
| 03 — Components | 144 components (78 variant sets, 504 variants) and 147 icons. Each has variant properties (Variant, Size, State…), boolean and text props and icon swaps. |
| 04 — Patterns | Ready-made sections (app shell, filter bar, auth forms, AI dock, marketing). |
| 05 — Templates | 10 annotated apps, desktop + mobile. Duplicate a screen to start a new design. |
| 06 — Playground | Sandboxes + theme lab + **prototype flows** (press Present). |
| 07 — Documentation | Doc card per key component + customization guide. |
| 08 — Changelog | Versions and known limitations. |

## Switching themes
Select a frame → right sidebar → **Layer → Variable modes**:
- **Brand:** Iris · Ember · Lagoon · Rose · Cobalt · Forest
- **Color:** Light · Dark
- **Density:** Comfortable · Compact

## Adding your own brand color
1. Variables → **Primitives** → create `yourbrand/50 … /950` (use `scripts/generate_palette.py` or the style guide's Brand colors page to generate hex values).
2. Variables → **Brand** → **+** add a mode → alias each `brand/*` step to your ramp.
3. Keep `brand/600` ≥ 4.5:1 on white and `brand/700` ≥ 6:1.

## Developer handoff
Every variable has a WEB code-syntax value (e.g. `var(--bg-primary)`), so Dev Mode shows the same CSS variable names as `tokens/tokens.css`. Component descriptions include the React/shadcn mapping and accessibility notes.
