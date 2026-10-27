// Renders marketing/src/reel.html into an MP4 with a real, scripted mouse and virtual-time animations.
// Usage: serve the repo root on :8765, then  node scripts/render_marketing_reel.js <out-basename> [t1 t2 … to dump test stills]
const { chromium } = require(process.env.PW || "playwright");
const { spawn } = require("child_process");
(async () => {
  const outBase = process.argv[2] || "facet-reel";
  const stills = process.argv.slice(3).map(Number);
  const fps = 30;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1.6 });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto("http://localhost:8765/marketing/src/reel.html", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => window.reel.duration);
  let isDown = false;
  async function render(t) {
    const st = await p.evaluate((t) => window.reel.frame(t), t);
    await p.mouse.move(st.x, st.y);
    if (st.down && !isDown) { await p.mouse.down(); isDown = true; }
    if (!st.down && isDown) { await p.mouse.up(); isDown = false; }
    await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await p.evaluate((t) => window.reel.sync(t), t);
    return p.screenshot({ type: "jpeg", quality: 94 });
  }
  if (stills.length) {
    // walk the timeline up to each still so state is realistic
    let f = 0; const fs = require("fs");
    for (const s of stills) { const target = Math.round(s * fps); for (; f <= target; f++) { const buf = await render(f / fps); if (f === target) fs.writeFileSync(`${outBase}-${s}.jpg`, buf); } }
    await b.close(); return;
  }
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", outBase + ".mp4"], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(dur * fps);
  for (let f = 0; f < n; f++) {
    const buf = await render(f / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`frame ${f}/${n}`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await b.close();
})();
