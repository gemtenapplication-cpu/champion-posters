// usage:
//   node render.js stills <mode> <outdir> t1 t2 ...        -> PNG stills
//   node render.js video  <mode> <t0> <t1> <out.mp4|.mov>  -> frames piped to ffmpeg
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const FPS = 30;

(async () => {
  const [cmd, mode, ...rest] = process.argv.slice(2);
  const legal = process.env.LEGAL || 'A';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const url = 'file://' + path.join(__dirname, 'scene.html') + `?mode=${mode}&legal=${legal}`;
  await page.goto(url);
  await page.evaluate(() => window.ready);
  const cdp = await page.context().newCDPSession(page);
  const alpha = mode === 'B';
  if (alpha) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });

  async function grab(t, fmt) {
    await page.evaluate(t => new Promise(r => { window.renderAt(t); requestAnimationFrame(() => requestAnimationFrame(r)); }), t);
    const { data } = await cdp.send('Page.captureScreenshot', fmt === 'png' ? { format: 'png', optimizeForSpeed: true } : { format: 'jpeg', quality: 93, optimizeForSpeed: true });
    return Buffer.from(data, 'base64');
  }

  if (cmd === 'stills') {
    const [outdir, ...times] = rest;
    fs.mkdirSync(outdir, { recursive: true });
    for (const t of times) fs.writeFileSync(path.join(outdir, `s_${String(t).padStart(5, '0')}.png`), await grab(parseFloat(t), 'png'));
  } else {
    const [t0, t1, out] = rest;
    const f0 = Math.round(parseFloat(t0) * FPS), f1 = Math.round(parseFloat(t1) * FPS);
    const args = alpha
      ? ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'qtrle', '-pix_fmt', 'argb', out]
      : ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', out];
    const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
    const t = Date.now();
    for (let f = f0; f < f1; f++) {
      const buf = await grab(f / FPS, alpha ? 'png' : 'jpeg');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - f0) % 150 === 0) console.error(`[${out}] frame ${f - f0}/${f1 - f0} ${((Date.now() - t) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
