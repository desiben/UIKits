// Renders every <section class="scene"> in marketing/src/scenes.html to a 2x JPG (+ 1x WebP thumb via ffmpeg).
// Usage: python3 -m http.server 8765 (repo root) → node scripts/render_marketing_images.js [scene-id …]
const { chromium } = require(process.env.PW || "playwright");
const { execFileSync } = require("child_process");
const OUT = "styleguide/marketing/media";
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto("http://localhost:8765/marketing/src/scenes.html", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : await p.$$eval("section.scene", (s) => s.map((x) => x.id));
  for (const id of ids) {
    const file = `${OUT}/facet-ui-${id}.jpg`;
    await p.locator("section#" + id).screenshot({ path: file, type: "jpeg", quality: 90 });
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", file, "-vf", "scale=iw/2:-1:flags=lanczos", "-quality", "82", `${OUT}/thumbs/facet-ui-${id}.webp`]);
    console.log("rendered", id);
  }
  await b.close();
})();
