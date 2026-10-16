# Facet UI — marketing kit sources

Everything on the live [marketing page](https://facetui.vercel.app/marketing/) is generated from this folder, so you can re-brand or re-render it.

| File | What it is |
|---|---|
| `src/scenes.html` + `src/mkt.css` | 13 marketing scenes (1920×1080 and 1080×1080) built from real template screenshots and live Facet components |
| `src/video.js` | Deterministic timeline that turns the scenes into the 55-second demo video (`scenes.html?video=demo`) |
| `src/reel.html` + `src/reel.js` | Components reel: live components, a scripted real mouse and virtual-time animations |
| `src/screens/` | 1x template screenshots exported from Figma |
| `src/fonts/` | Mona Sans (SIL OFL 1.1) |

## Re-render

```bash
# from the repo root
python3 -m http.server 8765 &
npm i -D playwright            # once
node scripts/render_marketing_images.js          # → styleguide/marketing/media/*.jpg + thumbs/*.webp
node scripts/render_marketing_video.js styleguide/marketing/media/facet-ui-demo
node scripts/render_marketing_reel.js  styleguide/marketing/media/facet-ui-components-reel
# WebM versions
ffmpeg -i styleguide/marketing/media/facet-ui-demo.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 styleguide/marketing/media/facet-ui-demo.webm
```

Needs Node 18+, Playwright's Chromium and ffmpeg. Change `data-brand` on `<html>` in `scenes.html` or `reel.html` to re-theme the live components (the template screenshots in `src/screens/` stay as exported from Figma).

Made by ELTouch apps.
