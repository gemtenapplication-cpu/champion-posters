// CHAMPION business card — standard 3.5 x 2 in (88.9 x 50.8 mm), 3 mm bleed, matte lamination + emboss.
//   front: brand + contact, with the trophy mark embossed (see emboss mask)
//   back:  promotes the community QR, with Champ (the site mascot)
// Day (white & blue) and night (dark navy) versions.  Run from repo root: node cards/build-bizcard.js
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

// Trophy mark on the front (embossed). The emboss mask uses exactly this box.
const TROPHY = { left: 7.4, top: 6.2, h: 20.5 };

const champ = (mood, h) => fs.readFileSync(path.join(DIR, '..', 'banners', 'assets', `champ-${mood}.svg`), 'utf8')
  .replace(/<!--[\s\S]*?-->\s*/, '').replace('<svg ', `<svg style="overflow:visible;display:block;height:${h}mm;width:auto" `);

// simple generic contact icons (24x24 grid), drawn in white on a blue dot
const ICON = {
  phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="#fff"/>',
  web: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="#fff" stroke-width="2"/><ellipse cx="12" cy="12" rx="3.6" ry="8.5" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M3.8 9h16.4M3.8 15h16.4" stroke="#fff" stroke-width="1.8"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="#fff" stroke-width="2"/><path d="M3.8 7l8.2 6 8.2-6" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>',
  pin: '<path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7z" fill="#fff"/><circle cx="12" cy="9.6" r="2.7" fill="#2B83F6"/>',
};
const icon = (k) => `<span class="ico"><svg viewBox="0 0 24 24">${ICON[k]}</svg></span>`;

function head(night, css) {
  const ink = night ? '#FFFFFF' : '#0B0B0C';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(${F}/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@font-face{font-family:Inter;font-weight:800;src:url(${F}/inter/files/inter-latin-800-normal.woff2)}
@page{size:${PW}mm ${PH}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${PW}mm;height:${PH}mm;overflow:hidden}
body{font-family:Rajdhani,sans-serif;color:${ink};background:${night ? '#070C1A' : '#FFFFFF'};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:100%;height:100%;overflow:hidden}
.bg{position:absolute;inset:0;background:${night
    ? 'radial-gradient(ellipse 60mm 40mm at 70% 40%,#2B83F633,transparent 70%),linear-gradient(160deg,#0B1530 0%,#070C1A 55%,#0B1A3D 100%)'
    : 'radial-gradient(ellipse 60mm 40mm at 70% 40%,#DCEBFF99,transparent 70%),linear-gradient(160deg,#FFFFFF 0%,#F4F8FF 55%,#DCEBFF 100%)'}}
.dots{position:absolute;inset:0;background-image:radial-gradient(${night ? '#4DA3FF24' : '#2B83F62e'} .2mm,transparent .24mm);background-size:3mm 3mm}
.trim{position:absolute;left:${BL}mm;top:${BL}mm;width:${W}mm;height:${H}mm}
.o9{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900}
.o7{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700}
.lb{color:${night ? '#4DA3FF' : '#2B83F6'}}
.sub{color:${night ? '#FFFFFFc4' : '#0B0B0Cb8'}}
${css}
</style></head><body><div class="pg"><div class="bg"></div><div class="dots"></div>`;
}

function front(night) {
  const css = `
.panel{position:absolute;left:0;top:0;bottom:0;width:${BL + 31.5}mm;clip-path:polygon(0 0,100% 0,84% 100%,0 100%);background:linear-gradient(160deg,#4DA3FF 0%,#2B83F6 45%,#1F6FE5 100%)}
.panel-d{position:absolute;inset:0;background-image:radial-gradient(#FFFFFF2e .2mm,transparent .24mm);background-size:3mm 3mm}
.gz{position:absolute;left:0;width:29mm;top:29.6mm;text-align:center;color:#fff;font-size:1.75mm;letter-spacing:.34mm;padding-left:.34mm}
.rule{position:absolute;left:10.5mm;width:8mm;top:33.2mm;height:.35mm;background:#FFFFFF99}
.open{position:absolute;left:0;width:27.5mm;top:35.2mm;text-align:center;color:#fff;font-weight:700;font-size:2.35mm;line-height:1.05}
.open small{display:block;font-family:Orbitron,Rajdhani,sans-serif;font-size:1.35mm;letter-spacing:.3mm;opacity:.85;margin-bottom:.5mm}
.logo{position:absolute;left:35mm;top:7.4mm;width:49mm}
.ct{position:absolute;left:35.4mm;top:21.2mm;right:2mm}
.row{display:flex;align-items:flex-start;gap:1.9mm;height:4.75mm}
.row.two{height:7.6mm}
.ico{width:3.4mm;height:3.4mm;flex:none;border-radius:50%;background:#2B83F6;display:flex;align-items:center;justify-content:center;margin-top:.05mm}
.ico svg{width:2.1mm;height:2.1mm}
.row p{font-weight:600;font-size:2.75mm;line-height:1.2;white-space:nowrap;padding-top:.1mm}
.row p b{font-weight:700}`;
  return head(night, css) + `
<div class="panel"><div class="panel-d"></div></div>
<div class="trim">
 <img src="${B}/trophy-white.png" style="position:absolute;left:${TROPHY.left}mm;top:${TROPHY.top}mm;height:${TROPHY.h}mm">
 <div class="gz o7">GAMING ZONE</div>
 <div class="rule"></div>
 <div class="open"><small>OPEN HOURS</small>10:00 – 23:00</div>
 <img class="logo" src="${B}/${night ? 'logo-white-gradient-trophy' : 'logo-color-on-light'}.png">
 <div class="ct">
  <div class="row">${icon('phone')}<p><b>01603-754074</b></p></div>
  <div class="row">${icon('web')}<p><b>champion.gemten.com.bd</b></p></div>
  <div class="row">${icon('mail')}<p>champion@gemten.com.bd</p></div>
  <div class="row two">${icon('pin')}<p>IFIC Bank Building (4th Floor)<br>Ranir Bazar, Cumilla</p></div>
 </div>
</div></div></body></html>`;
}

async function back(night) {
  const qr = (await QR.toString(COMMUNITY_URL, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#0B0B0C', light: '#FFFFFF' } }))
    .replace('<svg ', '<svg width="100%" height="100%" ');
  const css = `
.qrbox{position:absolute;left:31.4mm;top:5.2mm;width:24.6mm;height:24.6mm;background:#fff;border:.4mm solid #2B83F6;border-radius:2mm;padding:1.25mm}
.scan{position:absolute;left:30.2mm;width:27mm;top:31.6mm;text-align:center;font-size:2.15mm;line-height:1}
.url{position:absolute;left:30.2mm;width:27mm;top:34.7mm;text-align:center;font-weight:700;font-size:2.12mm;line-height:1}
.kick{position:absolute;left:4.2mm;top:5.6mm;font-size:1.7mm;letter-spacing:.5mm}
.hl{position:absolute;left:4mm;top:8.6mm;font-size:3.15mm;line-height:1.12}
.free{position:absolute;left:4.2mm;width:25mm;top:16.6mm;font-weight:700;font-size:2.3mm;line-height:1.12}
.list{position:absolute;left:4.2mm;top:23.6mm}
.list p{display:flex;align-items:center;gap:1.3mm;font-weight:600;font-size:2.3mm;line-height:1;height:3.5mm;white-space:nowrap}
.list i{width:1.35mm;height:1.35mm;border-radius:.3mm;background:#2B83F6;transform:rotate(45deg);flex:none}
.halo{position:absolute;left:58mm;top:7.6mm;width:27mm;height:27mm;border-radius:50%;border:.4mm solid #2B83F6;
 background:${night ? 'radial-gradient(circle at 50% 40%,#2B83F655 0%,#13254E 72%)' : 'radial-gradient(circle at 50% 40%,#FFFFFF 0%,#E6F0FF 55%,#C9DFFF 100%)'}}
.ch{position:absolute;left:56mm;top:4.2mm}
.tag{position:absolute;left:71.5mm;top:36.6mm;transform:translateX(-50%);background:linear-gradient(90deg,#1F6FE5,#2B83F6);color:#fff;font-size:1.45mm;letter-spacing:.32mm;padding:.75mm 1.8mm .75mm 2.1mm;border-radius:1.5mm;white-space:nowrap;border:.3mm solid ${night ? '#0B1630' : '#FFFFFF'}}
.band{position:absolute;left:0;right:0;bottom:0;height:${7.6 + BL}mm;padding-bottom:${BL + 1.6}mm;background:linear-gradient(90deg,#1F6FE5,#2B83F6 50%,#1F6FE5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:2.3mm;white-space:nowrap}`;
  return head(night, css) + `
<div class="band">New tournaments are posted in the community first.</div>
<div class="trim">
 <div class="kick o7 lb">COMMUNITY</div>
 <div class="hl o9">JOIN THE<br><span class="lb">SQUAD.</span></div>
 <div class="free">Free with your<br>Champion account.</div>
 <div class="list"><p><i></i>Challenges &amp; teams</p><p><i></i>Tournaments &amp; gifts</p><p><i></i>Leaderboard &amp; chat</p></div>
 <div class="qrbox">${qr}</div>
 <div class="scan o9">SCAN TO JOIN</div>
 <div class="url lb">champion.gemten.com.bd</div>
 <div class="halo"></div>
 <div class="ch">${champ('wave', 35)}</div>
 <div class="tag o7">MEET CHAMP</div>
</div></div></body></html>`;
}

// Emboss die artwork: 100% black = raised. Same page size and position as the front.
function embossMask() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:${PW}mm ${PH}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${PW}mm;height:${PH}mm;overflow:hidden;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.trim{position:absolute;left:${BL}mm;top:${BL}mm;width:${W}mm;height:${H}mm}
</style></head><body><div class="trim">
<img src="${B}/trophy-black.png" style="position:absolute;left:${TROPHY.left}mm;top:${TROPHY.top}mm;height:${TROPHY.h}mm">
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
