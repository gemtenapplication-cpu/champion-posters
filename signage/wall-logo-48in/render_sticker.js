// 48 x 120 in office wall sticker: vector PDF at real size, 30 DPI previews (plain + desk/chair mockup)
// and, when a DPI is passed (node render_sticker.js 100), a full-size print PNG.
const { chromium } = require('playwright'); const path = require('path');
const dpi = +(process.argv[2] || 0);
const file = 'file://' + path.resolve(__dirname, 'office-wall-sticker-48x120.html');
const vp = { width: 48 * 96, height: 120 * 96 };
(async () => {
  const b = await chromium.launch();
  let p = await b.newPage({ viewport: vp }); await p.goto(file);
  await p.pdf({ path: path.resolve(__dirname, 'champion-office-wall-sticker-48x120in.pdf'), width: '48in', height: '120in', printBackground: true });
  await p.close();
  const shots = [[30, '', 'preview-office-wall-sticker.png'], [30, '#mock', 'preview-office-wall-sticker-with-desk-chair.png']];
  if (dpi) shots.push([dpi, '', `champion-office-wall-sticker-48x120in-${dpi}dpi.png`]);
  for (const [d, hash, out] of shots) {
    p = await b.newPage({ viewport: vp, deviceScaleFactor: d / 96 }); await p.goto(file + hash);
    await p.screenshot({ path: path.resolve(__dirname, out) }); await p.close();
  }
  await b.close();
})();
