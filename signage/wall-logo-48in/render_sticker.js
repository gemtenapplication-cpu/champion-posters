// 48 x 120 in office wall sticker: vector PDF at real size + PNG previews.
const { chromium } = require('playwright'); const path = require('path');
const dpi = +(process.argv[2] || 0);
(async () => { const b = await chromium.launch();
  const file = 'file://' + path.resolve(__dirname, 'office-wall-sticker-48x120.html');
  let p = await b.newPage({ viewport: { width: 48 * 96, height: 120 * 96 } }); await p.goto(file);
  await p.pdf({ path: path.resolve(__dirname, 'champion-office-wall-sticker-48x120in.pdf'), width: '48in', height: '120in', printBackground: true });
  await p.close();
  for (const d of [30, dpi].filter(Boolean)) {
    p = await b.newPage({ viewport: { width: 48 * 96, height: 120 * 96 }, deviceScaleFactor: d / 96 }); await p.goto(file);
    await p.screenshot({ path: path.resolve(__dirname, d === 30 ? 'preview-office-wall-sticker.png' : `champion-office-wall-sticker-48x120in-${d}dpi.png`) });
    await p.close(); }
  await b.close(); })();
