// Renders marketing/listings/mockups.html into listing images for each store.
//
//   python3 -m http.server 8765 &           # from the repo root
//   node scripts/render_listing_images.js   # → marketing/listings/{gumroad,ui8,envato}/
//
// Sizes follow each store's usual listing format; check the current upload
// form before submitting, and change SETS below if a store's spec changes.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE_URL || "http://localhost:8765/marketing/listings/mockups.html";
const OUT = path.join(__dirname, "..", "marketing", "listings");
const WIDE = ["cover", "highlights", "templates", "thanks"];

// [board, file, frame ("WxH") or null for the board's own size, fit]
const SETS = {
  gumroad: [
    ["cover", "01-cover.png"],
    ["highlights", "02-highlights.png"],
    ["templates", "03-templates.png"],
    ["thanks", "04-thank-you.png"],
    ["thumbnail", "05-thumbnail-square.png"],
  ],
  ui8: [
    ["cover", "01-cover.png", "1600x1200"],
    ["highlights", "02-highlights.png", "1600x1200"],
    ["templates", "03-templates.png", "1600x1200"],
    ["thanks", "04-thank-you.png", "1600x1200"],
  ],
  envato: [
    ["icon", "thumbnail-80x80.png", "80x80"],
    ["cover", "preview-590x300.jpg", "590x300", "cover"],
    ["cover", "screenshots/01-cover.jpg"],
    ["highlights", "screenshots/02-highlights.jpg"],
    ["templates", "screenshots/03-templates.jpg"],
    ["thanks", "screenshots/04-thank-you.jpg"],
  ],
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });

  for (const [store, items] of Object.entries(SETS)) {
    for (const [board, file, frame, fit] of items) {
      const out = path.join(OUT, store, file);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const qs = `board=${board}` + (frame ? `&frame=${frame}&fit=${fit || "contain"}` : "");
      await page.goto(`${BASE}?${qs}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const target = page.locator(frame ? "#canvas" : `#${board}`);
      const jpeg = file.endsWith(".jpg");
      await target.screenshot({ path: out, type: jpeg ? "jpeg" : "png", quality: jpeg ? 90 : undefined });
      console.log("wrote", path.join(store, file));
    }
  }

  // Gumroad long description image: the 16:9 boards stacked at 1280px wide.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate((ids) => {
    document.querySelectorAll(".board").forEach((b) => { if (!ids.includes(b.id)) b.remove(); });
    const scale = 1280 / 1920;
    document.body.style.margin = "0";
    document.body.style.width = "1280px";
    document.querySelectorAll(".board").forEach((b) => {
      const wrap = document.createElement("div");
      wrap.style.cssText = `width:1280px;height:${1080 * scale}px;overflow:hidden`;
      b.style.margin = "0";
      b.style.transform = `scale(${scale})`;
      b.style.transformOrigin = "0 0";
      b.parentNode.insertBefore(wrap, b);
      wrap.appendChild(b);
    });
  }, WIDE);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, "gumroad", "facet-ui-gumroad-long.png"), fullPage: true });
  console.log("wrote", path.join("gumroad", "facet-ui-gumroad-long.png"));
  await browser.close();
})();
