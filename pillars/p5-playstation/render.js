// Renders each Pillar 5 face: PRINT PDF at 16 x 120 in, a 30 DPI preview PNG, and one overview sheet of all four.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const faces = fs.readdirSync(__dirname).filter(f => /^Champion_12_P5.*\.html$/.test(f)).sort();
(async () => {
  const b = await chromium.launch();
  for (const f of faces) {
    const base = f.replace('.html', '');
    const p = await b.newPage({ viewport: { width: 16 * 96, height: 120 * 96 }, deviceScaleFactor: 30 / 96 });
    await p.goto('file://' + path.join(__dirname, f));
    await p.evaluate(() => Promise.all(['900 1em Orbitron', '700 1em Rajdhani'].map(x => document.fonts.load(x))));
    await p.pdf({ path: path.join(__dirname, base + '_PRINT.pdf'), width: '16in', height: '120in', printBackground: true });
    await p.screenshot({ path: path.join(__dirname, 'preview-' + base + '.png') });
    await p.close();
  }
  await b.close();
})();
