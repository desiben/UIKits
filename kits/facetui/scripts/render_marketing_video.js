// Renders marketing/src/scenes.html?video=demo frame-by-frame into an MP4 + WebM.
// Usage: serve the repo root on :8765, then  node scripts/render_marketing_video.js <out-basename>
const { chromium } = require(process.env.PW || "playwright");
const { spawn } = require("child_process");
(async () => {
  const outBase = process.argv[2] || "facet-demo";
  const fps = 30;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto("http://localhost:8765/marketing/src/scenes.html?video=demo", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => window.VIDEO_DURATION);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", outBase + ".mp4"], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(dur * fps);
  for (let f = 0; f < n; f++) {
    await p.evaluate((t) => window.setTime(t), f / fps);
    const buf = await p.screenshot({ type: "jpeg", quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`frame ${f}/${n}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await b.close();
})();
