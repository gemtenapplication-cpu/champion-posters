// CHAMPION business card — standard 3.5 x 2 in (88.9 x 50.8 mm), 3 mm bleed, matte lamination + emboss.
//   front: "spec sheet" — embossed CHAMPION wordmark, contact grid, ghost trophy, vertical tagline
//   back:  community QR inside a lock-on reticle, "Find your rival."
// Day (white & blue) and night (deep navy) versions. Facts from champion.gemten.com.bd.
// Run from repo root: node cards/build-bizcard.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const QR = require('qrcode');

const DIR = __dirname;
const OUT = path.join(DIR, 'print');
const W = 88.9, H = 50.8, BL = 3, DPI = 600;
const PW = W + 2 * BL, PH = H + 2 * BL;
const F = '../node_modules/@fontsource';
const B = '../brand';
const COMMUNITY_URL = 'https://champion.gemten.com.bd/champion-community';

// CHAMPION wordmark on the front — embossed. The emboss mask uses exactly this box.
const MARK = { left: 6.2, top: 6.9, w: 46 };

const ICON = {
  phone: '<path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>',
  web: '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.6"/><ellipse cx="12" cy="12" rx="3.7" ry="8.6"/><path d="M3.6 9h16.8M3.6 15h16.8"/></g>',
  mail: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.8 7l8.2 6 8.2-6"/></g>',
  pin: '<path fill="currentColor" fill-rule="evenodd" d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7zm0 4.4a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4z"/>',
  clock: '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.3 2.1"/></g>',
};
const theme = (night) => night
  ? { bg: 'linear-gradient(155deg,#0D1733 0%,#070B16 58%,#0A1531 100%)', ink: '#FFFFFF', muted: '#FFFFFFa8', acc: '#4DA3FF', line: '#4DA3FF', ghost: 0.11, glow: '#2B83F62e' }
  : { bg: 'linear-gradient(155deg,#FFFFFF 0%,#F7FAFF 58%,#E9F1FF 100%)', ink: '#0B0B0C', muted: '#0B0B0C99', acc: '#1F6FE5', line: '#2B83F6', ghost: 0.085, glow: '#DCEBFFcc' };

function head(night, css) {
  const t = theme(night);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(${F}/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@page{size:${PW}mm ${PH}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${PW}mm;height:${PH}mm;overflow:hidden}
body{--ghost:${t.ghost};font-family:Rajdhani,sans-serif;color:${t.ink};background:${night ? '#070B16' : '#FFFFFF'};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:100%;height:100%;overflow:hidden}
.bg{position:absolute;inset:0;background:${t.bg}}
.trim{position:absolute;left:${BL}mm;top:${BL}mm;width:${W}mm;height:${H}mm}
.o9{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900}
.o7{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700}
.acc{color:${t.acc}}
.mut{color:${t.muted}}
/* signature: four micro corner brackets */
.cb{position:absolute;width:2.6mm;height:2.6mm;border-style:solid;border-color:${t.line}}
.bar{position:absolute;left:0;right:0;bottom:0;height:${2.4 + BL}mm;background:linear-gradient(90deg,#1F6FE5 0%,#2B83F6 45%,#4DA3FF 72%,#1F6FE5 100%)}
.ghost{position:absolute;left:${BL + 57.5}mm;top:${BL - 2}mm;height:59mm;opacity:var(--ghost)}
.hair{position:absolute;height:.26mm;background:linear-gradient(90deg,${t.line},${t.line}00)}
${css}
</style></head><body><div class="pg"><div class="bg"></div>`;
}
const corners = (inset = 3.2, th = 0.3) => `
<i class="cb" style="left:${inset}mm;top:${inset}mm;border-width:${th}mm 0 0 ${th}mm"></i>
<i class="cb" style="right:${inset}mm;top:${inset}mm;border-width:${th}mm ${th}mm 0 0"></i>
<i class="cb" style="left:${inset}mm;bottom:${inset}mm;border-width:0 0 ${th}mm ${th}mm"></i>
<i class="cb" style="right:${inset}mm;bottom:${inset}mm;border-width:0 ${th}mm ${th}mm 0"></i>`;

function front(night) {
  const t = theme(night);
  const row = (k, v, cls = '') => `<div class="r ${cls}"><span class="ic"><svg viewBox="0 0 24 24">${ICON[k]}</svg></span><span class="v">${v}</span></div>`;
  const css = `
.glow{position:absolute;right:-10mm;top:-6mm;width:60mm;height:46mm;background:radial-gradient(ellipse at center,${t.glow},transparent 70%)}
.sub{position:absolute;left:7.2mm;top:13.55mm;font-size:1.38mm;letter-spacing:.42mm;white-space:nowrap}
.spec{position:absolute;left:7.2mm;top:19.1mm}
.r{display:flex;align-items:center;gap:2.1mm;height:4.55mm}
.r.two{height:7.5mm}
.ic{width:3.4mm;height:3.4mm;flex:none;border-radius:50%;border:.22mm solid ${t.acc};background:${t.acc}1c;color:${t.acc};display:flex;align-items:center;justify-content:center}
.ic svg{width:1.95mm;height:1.95mm}
.v{font-weight:600;font-size:2.55mm;line-height:1.18;white-space:nowrap}
.v b{font-weight:700}
.tag{position:absolute;left:84.5mm;top:25.4mm;transform:translate(-50%,-50%) rotate(-90deg);font-size:1.3mm;letter-spacing:.56mm;white-space:nowrap;padding-left:.56mm}`;
  return head(night, css) + `
<div class="glow"></div>
<img class="ghost" src="${B}/trophy-blue.png">
<div class="bar"></div>
<div class="trim">
 <img src="${B}/${night ? 'wordmark-white-gradient-trophy' : 'wordmark-color-on-light'}.png" style="position:absolute;left:${MARK.left}mm;top:${MARK.top}mm;width:${MARK.w}mm">
 <div class="sub o7 acc">PLAYSTATION · RANIR BAZAR</div>
 <div class="hair" style="left:7.2mm;width:44mm;top:17.4mm"></div>
 <div class="spec">
  ${row('phone', '<b>01603-754074</b>')}
  ${row('web', '<b>champion.gemten.com.bd</b>')}
  ${row('mail', 'champion@gemten.com.bd')}
  ${row('pin', 'IFIC Bank Building, 4th Floor<br>Ranir Bazar, Cumilla', 'two')}
  ${row('clock', 'Open 10:00 – 23:00')}
 </div>
 <div class="tag o7 mut">PLAY + CONNECT + WIN</div>
</div></div></body></html>`;
}

async function back(night) {
  const t = theme(night);
  const qr = (await QR.toString(COMMUNITY_URL, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#0B0B0C', light: '#FFFFFF' } }))
    .replace('<svg ', '<svg width="100%" height="100%" ');
  // QR tile and the reticle around it
  const Q = { x: 6.5, y: 10.4, s: 24.6 }, g = 1.7, R = { x: Q.x - g, y: Q.y - g, s: Q.s + 2 * g }, arm = 3.4, th = 0.36, tick = 1.5;
  const cx = R.x + R.s / 2, cy = R.y + R.s / 2;
  const css = `
.glow{position:absolute;left:${BL + cx - 26}mm;top:${BL + cy - 22}mm;width:52mm;height:44mm;background:radial-gradient(ellipse at center,${t.glow},transparent 70%)}
.tile{position:absolute;left:${Q.x}mm;top:${Q.y}mm;width:${Q.s}mm;height:${Q.s}mm;background:#fff;border-radius:1.1mm;padding:1.45mm;border:.25mm solid ${t.line}80}
.rt{position:absolute;width:${arm}mm;height:${arm}mm;border-style:solid;border-color:${t.line}}
.tk{position:absolute;background:${t.line}}
.scan{position:absolute;left:${cx - 15}mm;width:30mm;top:${R.y + R.s + 2.75}mm;text-align:center;font-size:1.85mm;line-height:1;letter-spacing:.12mm}
.url{position:absolute;left:${cx - 15}mm;width:30mm;top:${R.y + R.s + 5.65}mm;text-align:center;font-weight:700;font-size:1.98mm;line-height:1}
.col{position:absolute;left:38.6mm;right:4.6mm}
.lab{font-size:1.38mm;letter-spacing:.38mm;white-space:nowrap}
.hl{font-size:4.6mm;line-height:1.08}
.body{font-weight:600;font-size:2.3mm;line-height:1.2}
.free{font-size:1.25mm;letter-spacing:.3mm;white-space:nowrap}`;
  return head(night, css) + `
<div class="glow"></div>
<img class="ghost" src="${B}/trophy-blue.png">
<div class="bar"></div>
<div class="trim">
 <i class="rt" style="left:${R.x}mm;top:${R.y}mm;border-width:${th}mm 0 0 ${th}mm"></i>
 <i class="rt" style="left:${R.x + R.s - arm}mm;top:${R.y}mm;border-width:${th}mm ${th}mm 0 0"></i>
 <i class="rt" style="left:${R.x}mm;top:${R.y + R.s - arm}mm;border-width:0 0 ${th}mm ${th}mm"></i>
 <i class="rt" style="left:${R.x + R.s - arm}mm;top:${R.y + R.s - arm}mm;border-width:0 ${th}mm ${th}mm 0"></i>
 <i class="tk" style="left:${cx - th / 2}mm;top:${R.y - tick - 0.5}mm;width:${th}mm;height:${tick}mm"></i>
 <i class="tk" style="left:${cx - th / 2}mm;top:${R.y + R.s + 0.5}mm;width:${th}mm;height:${tick}mm"></i>
 <i class="tk" style="left:${R.x - tick - 0.5}mm;top:${cy - th / 2}mm;width:${tick}mm;height:${th}mm"></i>
 <i class="tk" style="left:${R.x + R.s + 0.5}mm;top:${cy - th / 2}mm;width:${tick}mm;height:${th}mm"></i>
 <div class="tile">${qr}</div>
 <div class="scan o9">SCAN TO JOIN</div>
 <div class="url acc">champion.gemten.com.bd</div>

 <div class="col lab o7 acc" style="top:14.5mm">THE CHAMPION COMMUNITY</div>
 <div class="col hl o9" style="top:17.7mm">FIND YOUR<br><span class="acc">RIVAL.</span></div>
 <div class="col body mut" style="top:29.4mm">Challenge friends, form a team, enter<br>tournaments and climb the leaderboard.</div>
 <div class="hair" style="left:38.6mm;width:45.7mm;top:37.4mm"></div>
 <div class="col free o7 mut" style="top:39.5mm">FREE WITH YOUR CHAMPION ACCOUNT</div>
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
    jobs.push([`champion-card-${mode}-front`, front(night)], [`champion-card-${mode}-back`, await back(night)]);
  }
  jobs.push(['champion-card-emboss-mask-front', embossMask()]);
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
