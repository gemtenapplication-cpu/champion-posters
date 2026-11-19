// Renders the glass door sticker: 150 DPI PNG (4350 x 10500 px) + print PDF at 29in x 70in, day and night.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const file = 'file://' + path.resolve(__dirname, 'glass-door.html');
  for (const theme of ['day', 'night']) {
    const p = await b.newPage({ viewport: { width: 29 * 96, height: 70 * 96 }, deviceScaleFactor: 150 / 96 });
    await p.goto(file + '#' + theme);
    await p.waitForSelector('body[data-ready="1"]');
    await p.screenshot({ path: path.join(__dirname, `champion-glass-door-29x70in-${theme}-150dpi.png`) });
    await p.pdf({ path: path.join(__dirname, `champion-glass-door-29x70in-${theme}.pdf`), width: '29in', height: '70in', printBackground: true });
    await p.close();
  }
  await b.close();
})();
