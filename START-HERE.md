# Facet UI — Start here

Thanks for buying Facet UI v1.3!

## 1. Open the Figma file

1. Go to **https://www.etkits.us/claim**.
2. Enter your purchase code (your Gumroad license key, or your Envato purchase code) and press **Unlock**.
3. Open the Figma file and choose **Duplicate** to save your own copy.

Install the free **Mona Sans** font first so text renders correctly. Variable modes (brand, light/dark, density) need a Figma Professional plan or higher.

## 2. Use the code

| Folder | What it is |
|---|---|
| `tokens/` | `tokens.css` (CSS variables), `facet.tokens.json`, and `tailwind.preset.js` for Tailwind |
| `styleguide/` | The full style guide. Open `styleguide/index.html`, or serve the folder with any static server |
| `styleguide/assets/` | `facet.css` + `facet.js` (all components), `tokens.css`, `icons.js`, `charts.js` |
| `styleguide/templates/` | 36 page blocks, plus the App pages gallery |
| `styleguide/examples/` | Dashboard, Login and Settings app pages |
| `styleguide/agents/` | 6 AI agent demos |
| `FACETUI-LLMS.md` | The whole kit in one file for AI assistants (ChatGPT, Claude, Cursor, Copilot) |

Quick start:

```html
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/facet.css">
<script src="assets/icons.js"></script>
<script src="assets/facet.js"></script>
```

Theme with attributes on `<html>`: `data-theme="dark"`, `data-brand="ember"`, `data-density="compact"`, `data-style="glass"`.

## 3. Read more

- `styleguide/index.html`: full documentation for every component, token and theme (also live at https://facet.etkits.us)
- `figma/README.md`: Figma file guide (pages, themes, adding your brand)
- `FACETUI-LLMS.md`: give this to your AI coding assistant
- React: `npx facetui@latest init`, then `npx facetui@latest add button` (uses your license key)
- `CHANGELOG.md`: what's new (also at https://facet.etkits.us/#/changelog)
- `LICENSE.md`: what you can and can't do

Need help? Reply to your purchase email.
