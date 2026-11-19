const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'size-sheet.html'));
  await p.evaluate(() => Promise.all(['900 1em Orbitron','700 1em Orbitron','700 1em Rajdhani','600 1em Rajdhani'].map(f => document.fonts.load(f))));
  await p.pdf({ path: path.resolve(__dirname, 'champion-wall-48in-acrylic-piece-sizes.pdf'), format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true });
  await b.close(); })();
