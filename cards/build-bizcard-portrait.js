// CHAMPION business card — PORTRAIT, standard 2 x 3.5 in (50.8 x 88.9 mm), 3 mm bleed, matte lamination + emboss.
// Same design language as the landscape card (cards/build-bizcard.js):
//   front: embossed CHAMPION wordmark, PLAYSTATION label, contact rows with icons, ghost trophy, bottom bar
//   back:  "Find your rival." + community QR inside a lock-on reticle, trophy watermark, bottom bar
// The back keeps a quiet zone at the top (watermark only): the wordmark's emboss impression lands there.
// Run from repo root: node cards/build-bizcard-portrait.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const QR = require('qrcode');

const DIR = __dirname;
const OUT = path.join(DIR, 'print');
const W = 50.8, H = 88.9, BL = 3, DPI = 600;
const PW = W + 2 * BL, PH = H + 2 * BL;
const F = '../node_modules/@fontsource';
const B = '../brand';
const COMMUNITY_URL = 'https://champion.gemten.com.bd/champion-community';
const PREFIX = 'champion-card-portrait';

// CHAMPION wordmark on the front — embossed. The emboss mask uses exactly this box.
const MARK = { left: 4.9, top: 13, w: 41 };
const X0 = 5.8; // left edge of the wordmark's letters; everything on the front aligns to it

const ICON = {
  phone: '<path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
  web: '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.6"/><ellipse cx="12" cy="12" rx="3.7" ry="8.6"/><path d="M3.6 9h16.8M3.6 15h16.8"/></g>',
  mail: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.8 7l8.2 6 8.2-6"/></g>',
  pin: '<path fill="currentColor" fill-rule="evenodd" d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7zm0 4.4a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4z"/>',
  clock: '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.3 2.1"/></g>',
};
// Champ, the site's mascot (banners/assets/champ-*.svg, taken from champion.gemten.com.bd)
const champ = (mood, h) => fs.readFileSync(path.join(DIR, '..', 'banners', 'assets', `champ-${mood}.svg`), 'utf8')
  .replace(/<!--[\s\S]*?-->\s*/, '').replace('<svg ', `<svg style="overflow:visible;display:block;height:${h}mm;width:auto" `);
const theme = (night) => night
  ? { bg: 'linear-gradient(165deg,#0D1733 0%,#070B16 55%,#0A1531 100%)', ink: '#FFFFFF', muted: '#FFFFFFa8', acc: '#4DA3FF', line: '#4DA3FF', ghost: 0.11, glow: '#2B83F62e' }
  : { bg: 'linear-gradient(165deg,#FFFFFF 0%,#F7FAFF 55%,#E9F1FF 100%)', ink: '#0B0B0C', muted: '#0B0B0C99', acc: '#1F6FE5', line: '#2B83F6', ghost: 0.085, glow: '#DCEBFFcc' };

function head(night, css) {
  const t = theme(night);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(${F}/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@font-face{font-family:Inter;font-weight:800;src:url(${F}/inter/files/inter-latin-800-normal.woff2)}
@page{size:${PW}mm ${PH}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${PW}mm;height:${PH}mm;overflow:hidden}
body{font-family:Rajdhani,sans-serif;color:${t.ink};background:${night ? '#070B16' : '#FFFFFF'};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:100%;height:100%;overflow:hidden}
.bg{position:absolute;inset:0;background:${t.bg}}
.trim{position:absolute;left:${BL}mm;top:${BL}mm;width:${W}mm;height:${H}mm}
.o9{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900}
.o7{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700}
.acc{color:${t.acc}}
.mut{color:${t.muted}}
.bar{position:absolute;left:0;right:0;bottom:0;height:${2.4 + BL}mm;background:linear-gradient(90deg,#1F6FE5 0%,#2B83F6 45%,#4DA3FF 72%,#1F6FE5 100%)}
.ghost{position:absolute;opacity:${t.ghost}}
.hair{position:absolute;height:.26mm;background:linear-gradient(90deg,${t.line},${t.line}00)}
.hairc{position:absolute;height:.26mm;background:linear-gradient(90deg,${t.line}00,${t.line},${t.line}00)}
${css}
</style></head><body><div class="pg"><div class="bg"></div>`;
}

function front(night) {
  const t = theme(night);
  const row = (k, v, cls = '') => `<div class="r ${cls}"><span class="ic"><svg viewBox="0 0 24 24">${ICON[k]}</svg></span><span class="v">${v}</span></div>`;
  const css = `
.glow{position:absolute;left:${BL + 8}mm;top:${BL + 44}mm;width:60mm;height:56mm;background:radial-gradient(ellipse at center,${t.glow},transparent 70%)}
.sub{position:absolute;left:${X0}mm;top:20.3mm;font-size:1.25mm;letter-spacing:.36mm;white-space:nowrap}
.spec{position:absolute;left:${X0}mm;top:28.6mm}
.r{display:flex;align-items:center;gap:2.1mm;height:4.75mm}
.r.two{height:7.8mm}
.ic{width:3.4mm;height:3.4mm;flex:none;border-radius:50%;border:.22mm solid ${t.acc};background:${t.acc}1c;color:${t.acc};display:flex;align-items:center;justify-content:center}
.ic svg{width:1.95mm;height:1.95mm}
.v{font-weight:600;font-size:2.55mm;line-height:1.18;white-space:nowrap}
.v b{font-weight:700}
.tag{position:absolute;left:${X0}mm;top:80.6mm;font-size:1.28mm;letter-spacing:.5mm;white-space:nowrap}`;
  return head(night, css) + `
<div class="glow"></div>
<img class="ghost" src="${B}/trophy-blue.png" style="left:${BL + 21}mm;top:${BL + 47}mm;height:52mm">
<div class="bar"></div>
<div class="trim">
 <img src="${B}/${night ? 'wordmark-white-gradient-trophy' : 'wordmark-color-on-light'}.png" style="position:absolute;left:${MARK.left}mm;top:${MARK.top}mm;width:${MARK.w}mm">
 <div class="sub o7 acc">PLAYSTATION · RANIR BAZAR</div>
 <div class="hair" style="left:${X0}mm;width:34mm;top:24.3mm"></div>
 <div class="spec">
  ${row('phone', '<b>01603-754074</b>')}
  ${row('web', '<b>champion.gemten.com.bd</b>')}
  ${row('mail', 'champion@gemten.com.bd')}
  ${row('pin', 'IFIC Bank Building, 4th Floor<br>Ranir Bazar, Cumilla', 'two')}
  ${row('clock', 'Open 10:00 – 23:00')}
 </div>
 <div style="position:absolute;left:4.7mm;top:60.2mm;width:17.8mm;height:17.8mm;border-radius:50%;border:.3mm solid ${night ? '#2B83F6' : '#2B83F6'};background:${night ? 'radial-gradient(circle at 50% 40%,#2B83F666 0%,#13254E 75%)' : 'radial-gradient(circle at 50% 40%,#FFFFFF 0%,#E6F0FF 55%,#C9DFFF 100%)'}"></div>
 <div style="position:absolute;left:${X0 - 1.2}mm;top:58.4mm">${champ('wave', 20.5)}</div>
 <div class="tag o7 mut">PLAY + CONNECT + WIN</div>
</div></div></body></html>`;
}

async function back(night) {
  const t = theme(night);
  const qr = (await QR.toString(COMMUNITY_URL, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#0B0B0C', light: '#FFFFFF' } }))
    .replace('<svg ', '<svg width="100%" height="100%" ');
  const Q = { s: 23, y: 49.6 }; Q.x = (W - Q.s) / 2;
  const g = 1.7, R = { x: Q.x - g, y: Q.y - g, s: Q.s + 2 * g }, arm = 3.4, th = 0.36, tick = 1.5;
  const cx = R.x + R.s / 2, cy = R.y + R.s / 2;
  const css = `
.glow{position:absolute;left:${BL + cx - 30}mm;top:${BL + cy - 26}mm;width:60mm;height:52mm;background:radial-gradient(ellipse at center,${t.glow},transparent 70%)}
.tile{position:absolute;left:${Q.x}mm;top:${Q.y}mm;width:${Q.s}mm;height:${Q.s}mm;background:#fff;border-radius:1.1mm;padding:1.4mm;border:.25mm solid ${t.line}80}
.rt{position:absolute;width:${arm}mm;height:${arm}mm;border-style:solid;border-color:${t.line}}
.tk{position:absolute;background:${t.line}}
.c{position:absolute;left:0;right:0;text-align:center}
.lab{font-size:1.25mm;letter-spacing:.36mm;white-space:nowrap;padding-left:.36mm}
.hl{font-size:4.5mm;line-height:1.07}
.body{font-weight:600;font-size:2.18mm;line-height:1.22}
.free{font-size:1.15mm;letter-spacing:.27mm;white-space:nowrap;padding-left:.27mm}
.scan{font-size:1.85mm;line-height:1;letter-spacing:.12mm}
.url{font-weight:700;font-size:1.98mm;line-height:1}`;
  return head(night, css) + `
<div class="glow"></div>
<img class="ghost" src="${B}/trophy-blue.png" style="left:${BL + 24.5}mm;top:${BL - 9}mm;height:46mm;-webkit-mask-image:linear-gradient(to bottom,#000 50%,transparent 73%);mask-image:linear-gradient(to bottom,#000 50%,transparent 73%)">
<div class="bar"></div>
<div class="trim">
 <div class="c lab o7 acc" style="top:21.5mm">THE CHAMPION COMMUNITY</div>
 <div class="c hl o9" style="top:24.3mm">FIND YOUR<br><span class="acc">RIVAL.</span></div>
 <div class="c body mut" style="top:35.6mm">Challenge friends, form a team,<br>enter tournaments and climb<br>the leaderboard.</div>

 <i class="rt" style="left:${R.x}mm;top:${R.y}mm;border-width:${th}mm 0 0 ${th}mm"></i>
 <i class="rt" style="left:${R.x + R.s - arm}mm;top:${R.y}mm;border-width:${th}mm ${th}mm 0 0"></i>
 <i class="rt" style="left:${R.x}mm;top:${R.y + R.s - arm}mm;border-width:0 0 ${th}mm ${th}mm"></i>
 <i class="rt" style="left:${R.x + R.s - arm}mm;top:${R.y + R.s - arm}mm;border-width:0 ${th}mm ${th}mm 0"></i>
 <i class="tk" style="left:${cx - th / 2}mm;top:${R.y - tick - 0.5}mm;width:${th}mm;height:${tick}mm"></i>
 <i class="tk" style="left:${cx - th / 2}mm;top:${R.y + R.s + 0.5}mm;width:${th}mm;height:${tick}mm"></i>
 <i class="tk" style="left:${R.x - tick - 0.5}mm;top:${cy - th / 2}mm;width:${tick}mm;height:${th}mm"></i>
 <i class="tk" style="left:${R.x + R.s + 0.5}mm;top:${cy - th / 2}mm;width:${tick}mm;height:${th}mm"></i>
 <div class="tile">${qr}</div>
 <div class="c scan o9" style="top:${R.y + R.s + 2.75}mm">SCAN TO JOIN</div>
 <div class="c url acc" style="top:${R.y + R.s + 5.65}mm">champion.gemten.com.bd</div>
 <div class="c free o7 mut" style="top:${R.y + R.s + 9.2}mm">FREE WITH YOUR CHAMPION ACCOUNT</div>
</div></div></body></html>`;
}

// Emboss die artwork: 100% black = raised. Same page size and position as the front wordmark.
function embossMask() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:${PW}mm ${PH}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${PW}mm;height:${PH}mm;overflow:hidden;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.trim{position:absolute;left:${BL}mm;top:${BL}mm;width:${W}mm;height:${H}mm}
</style></head><body><div class="trim">
<img src="assets/emboss-wordmark-silhouette.png" style="position:absolute;left:${MARK.left}mm;top:${MARK.top}mm;width:${MARK.w}mm">
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = [];
  for (const night of [false, true]) {
    const mode = night ? 'night' : 'day';
    jobs.push([`${PREFIX}-${mode}-front`, front(night)], [`${PREFIX}-${mode}-back`, await back(night)]);
  }
  jobs.push([`${PREFIX}-emboss-mask-front`, embossMask()]);
  const px = 96 / 25.4;
  const browser = await chromium.launch();
  for (const [id, html] of jobs) {
    const src = path.join(DIR, id + '.html');
    fs.writeFileSync(src, html);
    const ctx = await browser.newContext({ viewport: { width: Math.round(PW * px), height: Math.round(PH * px) }, deviceScaleFactor: DPI / 96 });
    const page = await ctx.newPage();
    await page.goto('file://' + src);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
    // every text run must sit 3 mm inside the trim
    const issues = await page.evaluate((mm) => {
      const out = [], trim = document.querySelector('.trim').getBoundingClientRect(), safe = 3 * mm;
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n; (n = tw.nextNode());) {
        if (!n.textContent.trim()) continue;
        const r = document.createRange(); r.selectNodeContents(n); const t = r.getBoundingClientRect();
        if (t.left < trim.left + safe - 1 || t.right > trim.right - safe + 1 || t.top < trim.top + safe - 1 || t.bottom > trim.bottom - safe + 1)
          out.push(`outside 3mm safe zone: "${n.textContent.trim().slice(0, 40)}"`);
      }
      return out;
    }, px);
    await page.pdf({ path: path.join(OUT, id + '.pdf'), width: `${PW}mm`, height: `${PH}mm`, printBackground: true, preferCSSPageSize: true });
    await page.screenshot({ path: path.join(OUT, id + '.png') });
    await ctx.close();
    console.log(id, issues.length ? '\n  ' + issues.join('\n  ') : 'ok');
  }
  await browser.close();
})();
