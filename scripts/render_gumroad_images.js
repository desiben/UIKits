// Renders marketing/gumroad/mockups.html into PNG listing images.
//
//   python3 -m http.server 8765 &          # from the repo root
//   node scripts/render_gumroad_images.js  # → marketing/gumroad/*.png
//
// Produces one PNG per board plus facet-ui-gumroad-long.png, a 1280-wide
// stack of the 16:9 boards for a marketplace description.
const { chromium } = require("playwright");
const path = require("path");

const BASE = process.env.BASE_URL || "http://localhost:8765/marketing/gumroad/mockups.html";
const OUT = path.join(__dirname, "..", "marketing", "gumroad");
const BOARDS = [
  ["cover", "01-cover.png"],
  ["highlights", "02-highlights.png"],
  ["templates", "03-templates.png"],
  ["thanks", "04-thank-you.png"],
  ["thumbnail", "05-thumbnail-square.png"],
];
const LONG = ["cover", "highlights", "templates", "thanks"];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
  for (const [id, file] of BOARDS) {
    await page.goto(`${BASE}?board=${id}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(`#${id}`).screenshot({ path: path.join(OUT, file) });
    console.log("wrote", file);
  }

  // Long description image: stack the 16:9 boards at 1280px wide.
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
  }, LONG);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, "facet-ui-gumroad-long.png"), fullPage: true });
  console.log("wrote facet-ui-gumroad-long.png");
  await browser.close();
})();
