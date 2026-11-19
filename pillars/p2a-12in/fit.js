// Shrinks each .fit group (logo / text) just enough to fit the 12in face, about x = 8 (face centre in the
// original 16in coordinates) and the group's own anchor y. Then saves the final SVG, print PDF and a preview.
// Usage: node fit.js <basename>
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const base = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 12 * 96, height: 120 * 96 }, deviceScaleFactor: 30 / 96 });
  await p.goto('file://' + path.join(__dirname, base + '.html'));
  await p.evaluate(() => Promise.all(['900 1em Orbitron', '700 1em Rajdhani'].map(x => document.fonts.load(x))));
  const report = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('g.fit').forEach(g => {
      const bb = g.getBBox();
      const max = g.dataset.kind === 'logo' ? 9.6 : 10.4;   // inches; leaves >= 0.8in each side
      const left = Math.min(bb.x - 2, 12 - (bb.x + bb.width - 2));
      const s = Math.min(1, max / bb.width);
      const y = +g.dataset.y;
      if (s < 1) g.setAttribute('transform', `translate(8 ${y}) scale(${s.toFixed(4)}) translate(-8 ${-y})`);
      g.removeAttribute('class'); delete g.dataset.kind; delete g.dataset.y;
      out.push({ text: (g.textContent || 'logo').trim().slice(0, 30) || 'logo', width: +bb.width.toFixed(2), scale: +s.toFixed(3) });
    });
    return out;
  });
  console.table(report);
  const svg = await p.evaluate(() => document.querySelector('svg').outerHTML);
  fs.writeFileSync(path.join(__dirname, base + '_source.svg'), svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"').replace('xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"', 'xmlns="http://www.w3.org/2000/svg"'));
  await p.pdf({ path: path.join(__dirname, base + '_PRINT.pdf'), width: '12in', height: '120in', printBackground: true });
  await p.screenshot({ path: path.join(__dirname, 'preview-' + base + '.png') });
  await b.close();
})();
