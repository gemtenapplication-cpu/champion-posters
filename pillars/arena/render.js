// Renders each Arena face to a print PDF (real size) and a 30 DPI preview PNG.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const faces = fs.readdirSync(__dirname).filter(f => /^Champion_12_Arena_.*\.html$/.test(f)).sort();
(async () => {
  const b = await chromium.launch();
  for (const f of faces) {
    const base = f.replace('.html', ''); const W = +base.match(/_(\d+)x120in/)[1];
    const p = await b.newPage({ viewport: { width: W * 96, height: 120 * 96 }, deviceScaleFactor: 30 / 96 });
    await p.goto('file://' + path.join(__dirname, f));
    await p.evaluate(() => Promise.all(['900 1em Orbitron', '700 1em Rajdhani'].map(x => document.fonts.load(x))));
    await p.pdf({ path: path.join(__dirname, base + '_PRINT.pdf'), width: W + 'in', height: '120in', printBackground: true });
    await p.screenshot({ path: path.join(__dirname, 'preview-' + base + '.png') });
    await p.close();
  }
  await b.close();
})();
