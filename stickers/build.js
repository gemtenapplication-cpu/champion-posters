// Builds CHAMPION window & door stickers as print-ready PDF + PNG.
// Every sticker is authored at real size in CSS inches (1in = 96 CSS px),
// with a 0.125in bleed on every side. Run from repo root: node stickers/build.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const QR = require('qrcode');

const DIR = __dirname;
const SRC = path.join(DIR, 'src');
const OUT = path.join(DIR, 'print');
const BLEED = 0.125;
const BOOK_URL = 'https://champion.gemten.com.bd';
const LOC = '4TH FLOOR · IFIC BANK BUILDING · RANIR BAZAR, CUMILLA';

const F = '../../node_modules/@fontsource';
const B = '../../brand';

function head(w, h, css) {
  const W = w + 2 * BLEED, H = h + 2 * BLEED;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(${F}/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@page{size:${W}in ${H}in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}in;height:${H}in}
html,body{overflow:hidden}
.pg{position:relative;width:100%;height:100%;overflow:hidden}
body{position:relative;overflow:hidden;font-family:Rajdhani,sans-serif;color:#0B0B0C;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.bg{position:absolute;inset:0;background:linear-gradient(165deg,#FFFFFF 0%,#F4F8FF 55%,#DCEBFF 100%)}
.bgblue{position:absolute;inset:0;background:linear-gradient(160deg,#4DA3FF 0%,#2B83F6 45%,#1F6FE5 100%)}
.trim{position:absolute;left:${BLEED}in;top:${BLEED}in;width:${w}in;height:${h}in}
.c{position:absolute;left:0;right:0;text-align:center}
.orb{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900}
.orb7{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700}
.blue{color:#2B83F6}.dblue{color:#1F6FE5}
/* HUD corner brackets */
.hud i{position:absolute;border-color:#2B83F6;border-style:solid}
${css}
</style></head><body><div class="pg">`;
}
const tail = '</div></body></html>';

// dot grid that covers the bleed too
const dots = (r, gap, col = '#2B83F622') =>
  `<div style="position:absolute;inset:0;background-image:radial-gradient(${col} ${r}in,transparent ${r}in);background-size:${gap}in ${gap}in"></div>`;

// four corner brackets inset from the trim edge
function hud(inset, len, th, { col = '#2B83F6', topOnly = false } = {}) {
  const s = `width:${len}in;height:${len}in;border-color:${col};`;
  return `<div class="hud">
<i style="${s}left:${inset}in;top:${inset}in;border-width:${th}in 0 0 ${th}in"></i>
<i style="${s}right:${inset}in;top:${inset}in;border-width:${th}in ${th}in 0 0"></i>` + (topOnly ? '' : `
<i style="${s}left:${inset}in;bottom:${inset}in;border-width:0 0 ${th}in ${th}in"></i>
<i style="${s}right:${inset}in;bottom:${inset}in;border-width:0 ${th}in ${th}in 0"></i>`) + '</div>';
}

// generic gamepad drawn with CSS (no console brand symbols)
function pad(w, col = '#FFFFFF', acc = '#1F6FE5') {
  const h = w * 0.52;
  return `<div style="position:relative;width:${w}in;height:${h}in">
<div style="position:absolute;left:0;top:0;width:${w}in;height:${h * 0.8}in;background:${col};border-radius:${h * 0.4}in"></div>
<div style="position:absolute;left:${w * 0.04}in;top:${h * 0.35}in;width:${w * 0.3}in;height:${h * 0.65}in;background:${col};border-radius:${w * 0.15}in"></div>
<div style="position:absolute;right:${w * 0.04}in;top:${h * 0.35}in;width:${w * 0.3}in;height:${h * 0.65}in;background:${col};border-radius:${w * 0.15}in"></div>
<div style="position:absolute;left:${w * 0.17}in;top:${h * 0.27}in;width:${w * 0.2}in;height:${w * 0.065}in;background:${acc};border-radius:${w * 0.015}in"></div>
<div style="position:absolute;left:${w * 0.2375}in;top:${h * 0.27 - w * 0.0675}in;width:${w * 0.065}in;height:${w * 0.2}in;background:${acc};border-radius:${w * 0.015}in"></div>
<div style="position:absolute;right:${w * 0.25}in;top:${h * 0.15}in;width:${w * 0.075}in;height:${w * 0.075}in;background:${acc};border-radius:50%"></div>
<div style="position:absolute;right:${w * 0.16}in;top:${h * 0.3}in;width:${w * 0.075}in;height:${w * 0.075}in;background:${acc};border-radius:50%"></div>
<div style="position:absolute;right:${w * 0.34}in;top:${h * 0.3}in;width:${w * 0.075}in;height:${w * 0.075}in;background:${acc};border-radius:50%"></div>
<div style="position:absolute;right:${w * 0.25}in;top:${h * 0.45}in;width:${w * 0.075}in;height:${w * 0.075}in;background:${acc};border-radius:50%"></div>
</div>`;
}

const key = (n, cls = '') => `<i class="${cls}"></i>`.repeat(n);
const KB = [
  `<div>${key(14)}</div>`,
  `<div>${key(1, 'm')}${key(12)}</div>`,
  `<div>${key(1, 'm')}${key(11)}${key(1, 'm')}</div>`,
  `<div>${key(3)}<i class="w"></i>${key(3)}</div>`,
].join('');

async function qrSvg() {
  return QR.toString(BOOK_URL, {
    type: 'svg', errorCorrectionLevel: 'Q', margin: 0,
    color: { dark: '#0B0B0C', light: '#FFFFFF' },
  });
}

function stickers(qr) {
  const qrBox = (size, padIn) =>
    `<div style="width:${size}in;height:${size}in;padding:${padIn}in;background:#fff;border:${size * 0.012}in solid #2B83F6;border-radius:${size * 0.06}in">
<div style="width:100%;height:100%">${qr.replace('<svg ', '<svg width="100%" height="100%" ')}</div></div>`;

  return [
    // ───────────────────────────── DOOR ─────────────────────────────
    {
      id: '01-door-main-welcome', folder: 'door', w: 24, h: 36, dpi: 150,
      title: 'Main glass door — welcome sticker',
      css: `
.tiles{position:absolute;left:2in;right:2in;top:18.6in;display:flex;gap:.6in}
.tile{flex:1;height:6.2in;background:#fff;border:.08in solid #2B83F633;border-radius:.6in;text-align:center;padding-top:.75in}
.tile .n{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:2.5in;line-height:1;color:#2B83F6}
.tile .l{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.54in;letter-spacing:.04in;margin-top:.58in}
.tile .s{font-weight:600;font-size:.7in;color:#1F6FE5;margin-top:.2in}
.book{position:absolute;left:2in;right:2in;top:25.9in;height:7in;display:flex;align-items:center;gap:.8in}
.bt .k{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:.95in;line-height:1.15}
.bt .u{font-weight:700;font-size:1.12in;color:#1F6FE5;margin-top:.3in}
.bt .s{font-weight:600;font-size:.72in;color:#0B0B0Caa;margin-top:.15in}
.band{position:absolute;left:0;right:0;bottom:-${BLEED}in;height:${2.6 + BLEED}in;background:linear-gradient(90deg,#2B83F6,#1F6FE5);color:#fff;display:flex;align-items:center;justify-content:center;padding-bottom:${BLEED}in;font-weight:700;font-size:.74in;letter-spacing:.05in}
`,
      body: (w, h) => `<div class="bg"></div>${dots(0.055, 0.8)}
<div class="trim">${hud(0.9, 2, 0.16, { topOnly: true })}
<img src="${B}/logo-color-on-light.png" style="position:absolute;left:3in;top:2.3in;width:18in">
<div class="c" style="top:6.75in"><span class="orb7" style="display:inline-block;background:#2B83F6;color:#fff;font-size:.95in;letter-spacing:.32in;padding:.38in .7in .38in 1.02in;border-radius:1in">GAMING ZONE</span></div>
<div class="c orb" style="top:9.75in;font-size:2.55in;line-height:1.12">Welcome,<br><span class="blue">Player.</span></div>
<div class="c" style="top:16.05in;font-weight:600;font-size:1.05in">Squad up. Level up. Become the Champion.</div>
<div class="tiles">
 <div class="tile"><div class="n">2</div><div class="l">PS5 STATIONS</div><div class="s">play side by side</div></div>
 <div class="tile"><div class="n">55"</div><div class="l">BIG SCREENS</div><div class="s">on every PS5</div></div>
 <div class="tile"><div class="n">1</div><div class="l">GAMING PC</div><div class="s">with 30" monitor</div></div>
</div>
<div class="book">${qrBox(6.6, 0.45)}
 <div class="bt"><div class="k">BOOK YOUR<br>SLOT ONLINE</div><div class="u">champion.gemten.com.bd</div><div class="s">Scan the code or visit the site</div></div>
</div>
<div class="band">${LOC}</div>
</div>`,
    },
    {
      id: '02-door-push', folder: 'door', w: 10, h: 4, dpi: 300,
      title: 'Door handle sticker — PUSH',
      css: `.side{position:absolute;left:-${BLEED}in;top:-${BLEED}in;bottom:-${BLEED}in;width:${3.4 + BLEED}in;background:linear-gradient(160deg,#4DA3FF,#2B83F6 45%,#1F6FE5)}
.word{position:absolute;left:3.4in;right:0;top:.62in;text-align:center;font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:1.55in;line-height:1;letter-spacing:.06in}
.sub{position:absolute;left:3.4in;right:0;top:2.72in;text-align:center;font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.27in;letter-spacing:.09in;color:#1F6FE5}`,
      body: () => `<div class="bg"></div><div class="trim">
<div class="side"></div>
<img src="${B}/trophy-white.png" style="position:absolute;left:.82in;top:.6in;height:2.8in">
<div class="word">PUSH</div>
<div class="sub">CHAMPION · GAMING ZONE</div></div>`,
    },
    {
      id: '03-door-pull', folder: 'door', w: 10, h: 4, dpi: 300,
      title: 'Door handle sticker — PULL',
      css: `.side{position:absolute;left:-${BLEED}in;top:-${BLEED}in;bottom:-${BLEED}in;width:${3.4 + BLEED}in;background:linear-gradient(160deg,#4DA3FF,#2B83F6 45%,#1F6FE5)}
.word{position:absolute;left:3.4in;right:0;top:.62in;text-align:center;font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:1.55in;line-height:1;letter-spacing:.06in}
.sub{position:absolute;left:3.4in;right:0;top:2.72in;text-align:center;font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.27in;letter-spacing:.09in;color:#1F6FE5}`,
      body: () => `<div class="bg"></div><div class="trim">
<div class="side"></div>
<img src="${B}/trophy-white.png" style="position:absolute;left:.82in;top:.6in;height:2.8in">
<div class="word">PULL</div>
<div class="sub">CHAMPION · GAMING ZONE</div></div>`,
    },
    {
      id: '04-glass-safety-band', folder: 'door', w: 48, h: 4, dpi: 200,
      title: 'Glass safety band (eye level, cut to door/window width)',
      css: `.ln{position:absolute;left:-${BLEED}in;right:-${BLEED}in;height:.16in;background:#2B83F6}
.row{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:space-around}
.row img{height:2.1in}
.row span{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.78in;letter-spacing:.14in;color:#1F6FE5;white-space:nowrap}`,
      body: () => `<div style="position:absolute;inset:0;background:#fff"></div><div class="trim">
<div class="ln" style="top:.3in"></div><div class="ln" style="bottom:.3in"></div>
<div class="row">
 <img src="${B}/trophy-blue.png"><span>PLAY + CONNECT + WIN</span>
 <img src="${B}/trophy-blue.png"><span>GAMING ZONE</span>
 <img src="${B}/trophy-blue.png"><span>PLAY + CONNECT + WIN</span>
 <img src="${B}/trophy-blue.png">
</div></div>`,
    },
    {
      id: '05-door-opening-soon', folder: 'door', w: 18, h: 12, dpi: 200,
      title: 'OPENING SOON (removable — take off on opening day)',
      css: `.pill{display:inline-block;background:#fff;color:#0B0B0C;border-radius:.6in;padding:.22in .6in;font-weight:700;font-size:.72in}
.pill b{color:#1F6FE5}`,
      body: () => `<div class="bgblue"></div>${dots(0.05, 0.6, '#FFFFFF2e')}
<div class="trim">${hud(0.5, 1.2, 0.12, { col: '#FFFFFF' })}
<img src="${B}/logo-white.png" style="position:absolute;left:3.5in;top:1.25in;width:11in">
<div class="c orb" style="top:4.15in;font-size:2.05in;line-height:1.1;color:#fff;letter-spacing:.04in">OPENING<br>SOON</div>
<div class="c" style="top:9.3in"><span class="pill">Book online: <b>champion.gemten.com.bd</b></span></div>
</div>`,
    },
    {
      id: '06-building-entrance-4th-floor', folder: 'door', w: 12, h: 18, dpi: 200,
      title: 'Building entrance / stair sticker — points visitors to the 4th floor',
      css: `.arrow{position:absolute;left:50%;top:5.2in;width:0;height:0;margin-left:-2.1in;border-left:2.1in solid transparent;border-right:2.1in solid transparent;border-bottom:2.1in solid #2B83F6}
.shaft{position:absolute;left:50%;top:7.25in;width:1.5in;margin-left:-.75in;height:1.6in;background:#2B83F6}
.band{position:absolute;left:0;right:0;bottom:-${BLEED}in;height:${1.55 + BLEED}in;background:linear-gradient(90deg,#2B83F6,#1F6FE5);color:#fff;display:flex;align-items:center;justify-content:center;padding-bottom:${BLEED}in;font-weight:700;font-size:.66in}`,
      body: () => `<div class="bg"></div>${dots(0.035, 0.5)}
<div class="trim">${hud(0.45, 1, 0.1, { topOnly: true })}
<img src="${B}/logo-color-on-light.png" style="position:absolute;left:1.5in;top:1.05in;width:9in">
<div class="c" style="top:3.25in"><span class="orb7" style="display:inline-block;background:#2B83F6;color:#fff;font-size:.5in;letter-spacing:.17in;padding:.2in .4in .2in .57in;border-radius:.5in">GAMING ZONE</span></div>
<div class="arrow"></div><div class="shaft"></div>
<div class="c orb" style="top:9.25in;font-size:2.9in;line-height:1">4TH</div>
<div class="c orb blue" style="top:12.3in;font-size:1.35in;line-height:1;letter-spacing:.12in;padding-left:.12in">FLOOR</div>
<div class="c" style="top:14.05in;font-weight:700;font-size:.72in">IFIC Bank Building</div>
<div class="band">champion.gemten.com.bd</div>
</div>`,
    },

    // ──────────────────────────── WINDOW ────────────────────────────
    {
      id: '07-window-street-banner', folder: 'window', w: 72, h: 36, dpi: 100,
      title: 'Street-facing window banner (big type, readable from the road)',
      css: `.chips{position:absolute;left:0;right:0;top:20.1in;display:flex;justify-content:center;gap:1.6in}
.chip{background:#fff;border:.16in solid #2B83F6;border-radius:3in;padding:.55in 1.5in;font-weight:700;font-size:2.35in;line-height:1}
.chip b{color:#2B83F6}
.band{position:absolute;left:-${BLEED}in;right:-${BLEED}in;bottom:-${BLEED}in;height:${8.2 + BLEED}in;background:linear-gradient(90deg,#2B83F6,#1F6FE5);color:#fff;display:flex;align-items:center;padding:0 ${4 + BLEED}in ${BLEED}in}
.fl{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:3.9in;line-height:1;letter-spacing:.1in}
.dv{width:.2in;height:5in;background:#ffffff66;margin:0 3.2in}
.bk .k{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:1.25in;letter-spacing:.25in;opacity:.9}
.bk .u{font-weight:700;font-size:3.2in;line-height:1.05;margin-top:.2in}`,
      body: () => `<div class="bg"></div>${dots(0.12, 1.8)}
<img src="${B}/trophy-gradient.png" style="position:absolute;right:-3in;top:-2in;height:30in;opacity:.06">
<div class="trim">${hud(1.6, 4, 0.35, { topOnly: true })}
<img src="${B}/logo-color-on-light.png" style="position:absolute;left:12in;top:2.6in;width:48in">
<div class="c orb" style="top:12.5in;font-size:5.3in;line-height:1;letter-spacing:.55in;padding-left:.55in">GAMING ZONE</div>
<div class="chips"><div class="chip"><b>2 PS5</b> · 55" SCREENS</div><div class="chip"><b>GAMING PC</b> · 30" MONITOR</div></div>
<div class="band"><div class="fl">4TH<br>FLOOR</div><div class="dv"></div>
 <div class="bk"><div class="k">BOOK YOUR SLOT ONLINE</div><div class="u">champion.gemten.com.bd</div></div></div>
</div>`,
    },
    {
      id: '08-window-ps5-stations', folder: 'window', w: 24, h: 36, dpi: 150,
      title: 'Window panel — 2 PS5 stations on 55" screens',
      css: `.tvs{position:absolute;left:1.6in;right:1.6in;top:15.6in;display:flex;justify-content:space-between}
.tv{width:9.8in;text-align:center}
.scr{height:5.9in;background:#0B0B0C;border-radius:.35in;padding:.28in}
.scr>div{width:100%;height:100%;border-radius:.15in;background:linear-gradient(150deg,#4DA3FF,#2B83F6 50%,#1F6FE5);display:flex;align-items:center;justify-content:center}
.neck{width:1.1in;height:.6in;background:#0B0B0C;margin:0 auto}
.foot{width:4.4in;height:.3in;background:#0B0B0C;border-radius:.15in;margin:0 auto}
.sz{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:1.5in;color:#2B83F6;margin-top:.45in;line-height:1}
.szl{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.5in;letter-spacing:.12in;margin-top:.2in}
.band{position:absolute;left:0;right:0;bottom:-${BLEED}in;height:${3.1 + BLEED}in;background:linear-gradient(90deg,#2B83F6,#1F6FE5);color:#fff;text-align:center;padding-top:.55in}
.band .k{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.5in;letter-spacing:.14in;opacity:.9}
.band .u{font-weight:700;font-size:1.1in;margin-top:.12in;line-height:1}`,
      body: () => `<div class="bg"></div>${dots(0.055, 0.8)}
<div class="trim">${hud(0.9, 2, 0.16, { topOnly: true })}
<img src="${B}/logo-color-on-light.png" style="position:absolute;left:4.5in;top:2in;width:15in">
<div class="c orb7 dblue" style="top:5.55in;font-size:.68in;letter-spacing:.3in;padding-left:.3in">ON THE BIG SCREEN</div>
<div class="c orb" style="top:6.75in;font-size:4.3in;line-height:1">2 PS5</div>
<div class="c orb blue" style="top:11.25in;font-size:2.15in;line-height:1;letter-spacing:.1in;padding-left:.1in">STATIONS</div>
<div class="tvs">
 <div class="tv"><div class="scr"><div>${pad(4.4)}</div></div><div class="neck"></div><div class="foot"></div><div class="sz">55"</div><div class="szl">SCREEN</div></div>
 <div class="tv"><div class="scr"><div>${pad(4.4)}</div></div><div class="neck"></div><div class="foot"></div><div class="sz">55"</div><div class="szl">SCREEN</div></div>
</div>
<div class="c" style="top:27.5in;font-weight:600;font-size:1.02in">Grab a controller. Bring your Player 2.</div>
<div class="c dblue" style="top:29.2in;font-weight:700;font-size:.74in">4th Floor · IFIC Bank Building, Ranir Bazar</div>
<div class="band"><div class="k">BOOK YOUR SLOT ONLINE</div><div class="u">champion.gemten.com.bd</div></div>
</div>`,
    },
    {
      id: '09-window-gaming-pc', folder: 'window', w: 24, h: 36, dpi: 150,
      title: 'Window panel — gaming PC with 30" monitor',
      css: `.mon{position:absolute;left:3.2in;top:14.7in;width:17.6in;height:10.4in;background:#0B0B0C;border-radius:.4in;padding:.36in}
.mon .s{width:100%;height:100%;border-radius:.15in;background:linear-gradient(150deg,#4DA3FF,#2B83F6 50%,#1F6FE5);position:relative;overflow:hidden}
.mon .s i{position:absolute;left:1.1in;height:.36in;border-radius:.18in;background:#ffffff55}
.mon .tag{position:absolute;right:.9in;bottom:.8in;font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:2.4in;color:#fff;line-height:1}
.mon .tg2{position:absolute;right:.95in;bottom:3.3in;font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.5in;letter-spacing:.14in;color:#fff}
.neck{position:absolute;left:11.2in;top:25.1in;width:1.6in;height:1in;background:#0B0B0C}
.kb{position:absolute;left:3.6in;top:26.2in;width:13.6in;height:2.3in;background:#0B0B0C;border-radius:.3in;padding:.22in .25in;display:flex;flex-direction:column;justify-content:space-between}
.kb div{display:flex;gap:.1in;height:.36in}
.kb i{flex:1;background:#2B83F6;border-radius:.06in}
.kb i.w{flex:6}.kb i.m{flex:1.6}
.ms{position:absolute;left:18.1in;top:26.4in;width:1.2in;height:1.9in;background:#0B0B0C;border-radius:.6in}
.ms:after{content:"";position:absolute;left:.52in;top:.25in;width:.16in;height:.5in;border-radius:.08in;background:#2B83F6}
.band{position:absolute;left:0;right:0;bottom:-${BLEED}in;height:${3.1 + BLEED}in;background:linear-gradient(90deg,#2B83F6,#1F6FE5);color:#fff;text-align:center;padding-top:.55in}
.band .k{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.5in;letter-spacing:.14in;opacity:.9}
.band .u{font-weight:700;font-size:1.1in;margin-top:.12in;line-height:1}`,
      body: () => `<div class="bg"></div>${dots(0.055, 0.8)}
<div class="trim">${hud(0.9, 2, 0.16, { topOnly: true })}
<img src="${B}/logo-color-on-light.png" style="position:absolute;left:4.5in;top:2in;width:15in">
<div class="c orb7 dblue" style="top:5.55in;font-size:.68in;letter-spacing:.3in;padding-left:.3in">YOUR DESK IS READY</div>
<div class="c orb" style="top:6.75in;font-size:3.5in;line-height:1">GAMING</div>
<div class="c orb blue" style="top:10.55in;font-size:3.5in;line-height:1">PC</div>
<div class="mon"><div class="s">
 <i style="top:1.1in;width:6.5in"></i><i style="top:1.8in;width:4.4in"></i><i style="top:2.5in;width:5.4in"></i>
 <div class="tg2">MONITOR</div><div class="tag">30"</div></div></div>
<div class="neck"></div><div class="kb">${KB}</div><div class="ms"></div>
<div class="c" style="top:28.95in;font-weight:600;font-size:1.02in">Keyboard, mouse and a 30" monitor.</div>
<div class="c dblue" style="top:30.55in;font-weight:700;font-size:.74in">4th Floor · IFIC Bank Building, Ranir Bazar</div>
<div class="band"><div class="k">BOOK YOUR SLOT ONLINE</div><div class="u">champion.gemten.com.bd</div></div>
</div>`,
    },
    {
      id: '10-window-book-online-qr', folder: 'window', w: 24, h: 24, dpi: 150,
      title: 'Window / entrance glass — book online with QR code',
      css: `.band{position:absolute;left:0;right:0;bottom:-${BLEED}in;height:${2.6 + BLEED}in;background:linear-gradient(90deg,#2B83F6,#1F6FE5);color:#fff;display:flex;align-items:center;justify-content:center;padding-bottom:${BLEED}in;font-weight:700;font-size:1.2in}`,
      body: () => `<div class="bg"></div>${dots(0.05, 0.75)}
<div class="trim">${hud(0.75, 1.7, 0.14, { topOnly: true })}
<img src="${B}/logo-color-on-light.png" style="position:absolute;left:5.5in;top:1.55in;width:13in">
<div class="c orb" style="top:4.75in;font-size:1.48in;line-height:1">SKIP THE WAIT.</div>
<div class="c" style="top:6.55in;font-weight:700;font-size:1.05in;color:#1F6FE5">Book your slot online</div>
<div style="position:absolute;left:7in;top:8.3in">${qrBox(10, 0.65)}</div>
<div class="c orb7" style="top:18.75in;font-size:.7in;letter-spacing:.3in;padding-left:.3in">SCAN TO BOOK</div>
<div class="band">champion.gemten.com.bd</div>
</div>`,
    },
  ];
}

(async () => {
  fs.mkdirSync(SRC, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });
  const qr = await qrSvg();
  const list = stickers(qr);
  const only = process.argv[2];
  const browser = await chromium.launch();
  const manifest = [];
  for (const s of list) {
    if (only && !s.id.startsWith(only)) continue;
    const html = head(s.w, s.h, s.css) + s.body(s.w, s.h) + tail;
    const srcFile = path.join(SRC, s.id + '.html');
    fs.writeFileSync(srcFile, html);
    const W = s.w + 2 * BLEED, H = s.h + 2 * BLEED;
    const name = `${s.id}_${s.w}x${s.h}in`;
    fs.mkdirSync(path.join(OUT, s.folder), { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: Math.round(W * 96), height: Math.round(H * 96) },
      deviceScaleFactor: s.dpi / 96,
    });
    const page = await ctx.newPage();
    await page.goto('file://' + srcFile);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    });
    // flag any text that spills out of its box or past the trim safe area
    const issues = await page.evaluate((b) => {
      const out = [];
      const trim = document.querySelector('.trim').getBoundingClientRect();
      const safe = 0.25 * 96;
      for (const el of document.querySelectorAll('.trim *')) {
        if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const r = el.getBoundingClientRect();
        const range = document.createRange(); range.selectNodeContents(el);
        const tr = range.getBoundingClientRect();
        if (tr.left < trim.left + safe - 1 || tr.right > trim.right - safe + 1)
          out.push(`outside safe area: "${el.textContent.trim().slice(0, 40)}" (${((tr.left - trim.left) / 96).toFixed(2)}in .. ${((trim.right - tr.right) / 96).toFixed(2)}in)`);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible')
          out.push(`overflow: "${el.textContent.trim().slice(0, 40)}"`);
      }
      return out;
    }, BLEED);
    await page.pdf({ path: path.join(OUT, s.folder, name + '.pdf'), width: `${W}in`, height: `${H}in`, printBackground: true, preferCSSPageSize: true });
    await page.screenshot({ path: path.join(OUT, s.folder, name + '.png') });
    await ctx.close();
    manifest.push({ ...s, name, css: undefined, body: undefined, issues });
    console.log(name, issues.length ? '\n  ' + issues.join('\n  ') : 'ok');
  }
  await browser.close();
  if (!only) fs.writeFileSync(path.join(DIR, 'manifest.json'), JSON.stringify(manifest.map(({ id, folder, w, h, dpi, title, name }) => ({ id, folder, w, h, dpi, title, name })), null, 2));
})();
