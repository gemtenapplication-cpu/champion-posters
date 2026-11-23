// Renders trailer frames with Playwright. Usage: node frames.js test <t1,t2,...> <outdir>   |   node frames.js all <outdir> [fps]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [mode, a2, a3, a4] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('http://127.0.0.1:8765/videos/opening-trailer/trailer.html');
  await p.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  const canvas = await p.$('#c');
  if (mode === 'test') {
    const out = a3; fs.mkdirSync(out, { recursive: true });
    for (const t of a2.split(',').map(Number)) {
      await p.evaluate(t => draw(t), t);
      await canvas.screenshot({ path: path.join(out, `t${t.toFixed(2)}.jpg`), type: 'jpeg', quality: 80 });
    }
  } else {
    const out = a2, fps = +(a3 || 30); fs.mkdirSync(out, { recursive: true });
    const total = await p.evaluate(() => TM.total); const n = Math.round(total * fps);
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => draw(t), i / fps);
      await canvas.screenshot({ path: path.join(out, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
      if (i % 150 === 0) console.log('frame', i, '/', n);
    }
  }
  await b.close();
})();
