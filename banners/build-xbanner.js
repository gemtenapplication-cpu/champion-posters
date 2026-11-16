// CHAMPION X-banner (2 ft x 5 ft) — "Sign up, become a Silver member, 10% off" + community tournaments.
// Facts from champion.gemten.com.bd (pricing page, membership/points policies, community page, 16 Nov 2026).
// Authored in CSS inches (1in = 96px) with 0.125in bleed. Run from repo root: node banners/build-xbanner.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const QR = require('qrcode');

const DIR = __dirname;
const OUT = path.join(DIR, 'print');
const ID = 'champion-xbanner-silver-member';
const W = 24, H = 60, BLEED = 0.125, DPI = 100;
const SIGNUP_URL = 'https://champion.gemten.com.bd/login?mode=signup';
const F = '../node_modules/@fontsource';
const B = '../brand';

// generic gamepad (no console brand symbols)
function pad(w, col = '#FFFFFF', acc = '#1F6FE5') {
  const h = w * 0.52;
  const d = (css) => `<div style="position:absolute;${css}"></div>`;
  return `<div style="position:relative;width:${w}in;height:${h}in">
${d(`left:0;top:0;width:${w}in;height:${h * 0.8}in;background:${col};border-radius:${h * 0.4}in`)}
${d(`left:${w * 0.04}in;top:${h * 0.35}in;width:${w * 0.3}in;height:${h * 0.65}in;background:${col};border-radius:${w * 0.15}in`)}
${d(`right:${w * 0.04}in;top:${h * 0.35}in;width:${w * 0.3}in;height:${h * 0.65}in;background:${col};border-radius:${w * 0.15}in`)}
${d(`left:${w * 0.17}in;top:${h * 0.27}in;width:${w * 0.2}in;height:${w * 0.065}in;background:${acc};border-radius:${w * 0.015}in`)}
${d(`left:${w * 0.2375}in;top:${h * 0.27 - w * 0.0675}in;width:${w * 0.065}in;height:${w * 0.2}in;background:${acc};border-radius:${w * 0.015}in`)}
${[[0.25, 0.15], [0.16, 0.3], [0.34, 0.3], [0.25, 0.45]].map(([r, t]) => d(`right:${w * r}in;top:${h * t}in;width:${w * 0.075}in;height:${w * 0.075}in;background:${acc};border-radius:50%`)).join('')}
</div>`;
}

// two players (community icon)
function people(s, col = '#FFFFFF') {
  const d = (css) => `<div style="position:absolute;background:${col};${css}"></div>`;
  return `<div style="position:relative;width:${s}in;height:${s * 0.8}in">
${d(`left:${s * 0.08}in;top:${s * 0.05}in;width:${s * 0.3}in;height:${s * 0.3}in;border-radius:50%;opacity:.55`)}
${d(`left:0;top:${s * 0.4}in;width:${s * 0.46}in;height:${s * 0.36}in;border-radius:${s * 0.23}in ${s * 0.23}in ${s * 0.06}in ${s * 0.06}in;opacity:.55`)}
${d(`left:${s * 0.42}in;top:0;width:${s * 0.36}in;height:${s * 0.36}in;border-radius:50%`)}
${d(`left:${s * 0.32}in;top:${s * 0.42}in;width:${s * 0.56}in;height:${s * 0.38}in;border-radius:${s * 0.28}in ${s * 0.28}in ${s * 0.06}in ${s * 0.06}in`)}
</div>`;
}

// gift box
function gift(s, col = '#FFFFFF', rib = '#1F6FE5') {
  const d = (css) => `<div style="position:absolute;${css}"></div>`;
  return `<div style="position:relative;width:${s}in;height:${s}in">
${d(`left:${s * 0.3}in;top:${s * 0.02}in;width:${s * 0.22}in;height:${s * 0.22}in;border:${s * 0.07}in solid ${col};border-radius:${s * 0.12}in ${s * 0.12}in 0 ${s * 0.12}in;transform:rotate(-12deg)`)}
${d(`left:${s * 0.48}in;top:${s * 0.02}in;width:${s * 0.22}in;height:${s * 0.22}in;border:${s * 0.07}in solid ${col};border-radius:${s * 0.12}in ${s * 0.12}in ${s * 0.12}in 0;transform:rotate(12deg)`)}
${d(`left:${s * 0.02}in;top:${s * 0.26}in;width:${s * 0.96}in;height:${s * 0.22}in;background:${col};border-radius:${s * 0.04}in`)}
${d(`left:${s * 0.08}in;top:${s * 0.5}in;width:${s * 0.84}in;height:${s * 0.48}in;background:${col};border-radius:0 0 ${s * 0.05}in ${s * 0.05}in`)}
${d(`left:${s * 0.43}in;top:${s * 0.26}in;width:${s * 0.14}in;height:${s * 0.72}in;background:${rib}`)}
</div>`;
}

function hud(inset, len, th, col) {
  const s = `position:absolute;width:${len}in;height:${len}in;border-style:solid;border-color:${col};`;
  return `<i style="${s}left:${inset}in;top:${inset}in;border-width:${th}in 0 0 ${th}in"></i>
<i style="${s}right:${inset}in;top:${inset}in;border-width:${th}in ${th}in 0 0"></i>`;
}

async function html() {
  const qr = (await QR.toString(SIGNUP_URL, { type: 'svg', errorCorrectionLevel: 'Q', margin: 0, color: { dark: '#0B0B0C', light: '#FFFFFF' } }))
    .replace('<svg ', '<svg width="100%" height="100%" ');
  const PW = W + 2 * BLEED, PH = H + 2 * BLEED;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(${F}/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@page{size:${PW}in ${PH}in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${PW}in;height:${PH}in}
html,body{overflow:hidden}
.pg{position:relative;width:100%;height:100%;overflow:hidden}
body{position:relative;overflow:hidden;font-family:Rajdhani,sans-serif;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#070C1A}
.bg{position:absolute;inset:0;background:
  radial-gradient(ellipse 15in 11in at 50% 31%,#2B83F64d,transparent 70%),
  radial-gradient(ellipse 13in 9in at 30% 62%,#1F6FE540,transparent 70%),
  radial-gradient(ellipse 18in 10in at 50% 0%,#1F6FE533,transparent 70%),
  linear-gradient(172deg,#0B1530 0%,#070C1A 38%,#081127 70%,#0B1A3D 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(#4DA3FF12 .02in,transparent .02in),linear-gradient(90deg,#4DA3FF12 .02in,transparent .02in);background-size:1.2in 1.2in;background-position:-.1in -.1in}
.streak{position:absolute;height:.06in;border-radius:.03in;background:linear-gradient(90deg,transparent,#4DA3FF99,transparent);transform:rotate(-24deg)}
.trim{position:absolute;left:${BLEED}in;top:${BLEED}in;width:${W}in;height:${H}in}
.c{position:absolute;left:0;right:0;text-align:center}
.o9{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900}
.o7{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700}
.lb{color:#4DA3FF}
/* member card */
.card{position:absolute;left:2.2in;top:13.55in;width:19.6in;height:10.8in;border-radius:.85in;transform:rotate(-3deg);overflow:hidden;
 background:linear-gradient(128deg,#F5F7FA 0%,#C3CCD8 26%,#F0F3F7 47%,#A7B1BF 72%,#E4E8EE 100%);border:.07in solid #FFFFFFaa}
.card .sheen{position:absolute;left:-4in;top:-2in;width:3in;height:16in;background:linear-gradient(90deg,transparent,#FFFFFF8c,transparent);transform:rotate(28deg)}
.card .sheen2{position:absolute;left:9in;top:-2in;width:1.2in;height:16in;background:linear-gradient(90deg,transparent,#FFFFFF66,transparent);transform:rotate(28deg)}
.card .tag{position:absolute;right:.9in;top:1in;background:#0B1630;color:#E3E8EF;border-radius:.5in;padding:.2in .42in .2in .5in;font-size:.46in;letter-spacing:.08in}
.card .big{position:absolute;left:.95in;top:2.75in;font-size:4.7in;line-height:1;color:#0B1630;letter-spacing:-.05in}
.card .off{position:absolute;right:.95in;top:3.15in;text-align:right;color:#1F6FE5;font-size:2in;line-height:1}
.card .off small{display:block;font-family:Rajdhani,sans-serif;font-weight:700;font-size:.82in;color:#0B1630;margin-top:.25in;line-height:1.05}
.card .bot{position:absolute;left:.95in;bottom:.85in;font-size:.5in;letter-spacing:.14in;color:#0B1630}
.card .bot span{color:#1F6FE5}
.glow{position:absolute;left:3in;top:23in;width:18in;height:3in;background:radial-gradient(ellipse at center,#2B83F680,transparent 70%)}
.chips{position:absolute;left:1.5in;right:1.5in;top:25.65in;display:flex;justify-content:center;gap:.4in}
.chip{border:.06in solid #4DA3FF88;background:#0B1A3Dcc;border-radius:.6in;padding:.18in .42in;font-weight:700;font-size:.6in;white-space:nowrap}
.chip b{color:#4DA3FF}
/* section divider */
.div{position:absolute;left:2in;right:2in;display:flex;align-items:center;gap:.5in}
.div i{flex:1;height:.05in;background:linear-gradient(90deg,transparent,#4DA3FF)}
.div i:last-child{background:linear-gradient(90deg,#4DA3FF,transparent)}
.div span{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.6in;letter-spacing:.22in;color:#4DA3FF;padding-left:.22in}
/* tournament */
.halo{position:absolute;left:1.2in;top:33.1in;width:10in;height:10in;border-radius:50%;background:radial-gradient(circle,#2B83F655 0%,#2B83F622 45%,transparent 70%)}
.ring{position:absolute;left:2.45in;top:34.35in;width:7.5in;height:7.5in;border-radius:50%;border:.06in solid #4DA3FF55}
.steps{position:absolute;left:11.4in;right:1.6in;top:35.3in;display:flex;flex-direction:column;gap:.62in}
.st{display:flex;align-items:center;gap:.45in}
.ic{width:1.75in;height:1.75in;flex:none;border-radius:.4in;background:linear-gradient(150deg,#2B83F6,#1F6FE5);display:flex;align-items:center;justify-content:center}
.st p{font-weight:700;font-size:.74in;line-height:1.02}
.st p span{display:block;font-weight:600;font-size:.6in;color:#FFFFFFb8;margin-top:.06in}
/* CTA */
.cta{position:absolute;left:2in;right:2in;top:44.6in;height:8.2in;border-radius:.7in;background:linear-gradient(150deg,#13254Ecc,#0B1630cc);border:.06in solid #4DA3FF66;display:flex;align-items:center;gap:.75in;padding:0 .6in}
.qr{width:7in;height:7in;flex:none;background:#fff;border-radius:.4in;padding:.45in}
.ct .k{font-size:1.32in;line-height:1.08}
.ct .u{font-weight:700;font-size:.9in;color:#4DA3FF;margin-top:.35in;line-height:1}
.ct .s{font-weight:600;font-size:.62in;color:#FFFFFFbf;margin-top:.22in;line-height:1.1}
.fine{position:absolute;left:2in;right:2in;top:53.25in;text-align:center;font-weight:600;font-size:.42in;color:#FFFFFF99;line-height:1.2}
.band{position:absolute;left:-${BLEED}in;right:-${BLEED}in;bottom:-${BLEED}in;height:${5.1 + BLEED}in;background:linear-gradient(90deg,#1F6FE5,#2B83F6 50%,#1F6FE5);text-align:center;display:flex;flex-direction:column;justify-content:center;padding-bottom:${BLEED}in}
.band .a{font-weight:700;font-size:.78in;line-height:1.1}
.band .b{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:.58in;letter-spacing:.06in;margin-top:.32in}
</style></head><body><div class="pg">
<div class="bg"></div><div class="grid"></div>
<div class="streak" style="left:-2in;top:9in;width:9in"></div>
<div class="streak" style="left:17in;top:6in;width:8in"></div>
<div class="streak" style="left:16in;top:29in;width:9in;opacity:.7"></div>
<div class="streak" style="left:-1in;top:44in;width:7in;opacity:.6"></div>
<div class="trim">
${hud(1.5, 2.2, 0.16, '#4DA3FF')}
<img src="${B}/logo-white-gradient-trophy.png" style="position:absolute;left:3.5in;top:2.7in;width:17in">

<div class="c o7 lb" style="top:7.05in;font-size:.62in;letter-spacing:.2in;padding-left:.2in">JOIN CHAMPION · IT'S FREE</div>
<div class="c o9" style="top:8.1in;font-size:3in;line-height:1">SIGN UP</div>
<div class="c" style="top:11.3in;font-weight:700;font-size:1.2in;line-height:1">&amp; become a <span style="color:#D5DCE6">Silver member</span></div>

<div class="glow"></div>
<div class="card"><div class="sheen"></div><div class="sheen2"></div>
 <img src="${B}/logo-black.png" style="position:absolute;left:.95in;top:.95in;width:8.4in">
 <div class="tag o7">SILVER MEMBER</div>
 <div class="big o9">10%</div>
 <div class="off o9">OFF<small>every<br>session</small></div>
 <div class="bot o7">MEMBER ID <span>+</span> QR CARD</div>
 <img src="${B}/trophy-black.png" style="position:absolute;right:1in;bottom:.7in;height:2.3in;opacity:.85">
</div>
<div class="chips"><div class="chip"><b>Free</b> to join</div><div class="chip"><b>Points</b> on every visit</div><div class="chip"><b>1 minute</b> sign-up</div></div>

<div class="div" style="top:28.65in"><i></i><span>COMMUNITY TOURNAMENTS</span><i></i></div>
<div class="c o9" style="top:30.05in;font-size:2.55in;line-height:1">WIN <span class="lb">GIFTS</span></div>
<div class="halo"></div><div class="ring"></div>
<img src="${B}/trophy-gradient.png" style="position:absolute;left:3.45in;top:35.05in;height:7.6in">
<div class="steps">
 <div class="st"><div class="ic">${people(1.15)}</div><p>Join the community<span>free with your account</span></p></div>
 <div class="st"><div class="ic">${pad(1.3)}</div><p>Play tournaments<span>on the big screens</span></p></div>
 <div class="st"><div class="ic">${gift(1.05)}</div><p>Win &amp; take home<span>gifts and the trophy</span></p></div>
</div>

<div class="cta"><div class="qr">${qr}</div>
 <div class="ct"><div class="k o9">SCAN<br>TO SIGN UP</div><div class="u">champion.gemten.com.bd</div><div class="s">Book, earn points and join<br>tournaments with one account.</div></div>
</div>
<div class="fine">10% member discount applies to standard sessions booked from your account. Not combined with packs &amp; offers.</div>

<div class="band"><div class="a">IFIC Bank Building (4th Floor), Ranir Bazar, Cumilla</div><div class="b">OPEN 10:00–23:00 · 01603-754074</div></div>
</div>
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const src = path.join(DIR, ID + '.html');
  fs.writeFileSync(src, await html());
  const PW = W + 2 * BLEED, PH = H + 2 * BLEED;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: Math.round(PW * 96), height: Math.round(PH * 96) }, deviceScaleFactor: DPI / 96 });
  const page = await ctx.newPage();
  await page.goto('file://' + src);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode()));
  });
  // text that crosses the 1in safe margin (eyelet corners) or overflows its box
  const issues = await page.evaluate(() => {
    const out = [], trim = document.querySelector('.trim').getBoundingClientRect(), safe = 96;
    for (const el of document.querySelectorAll('.trim *')) {
      if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      const r = document.createRange(); r.selectNodeContents(el); const t = r.getBoundingClientRect();
      if (t.left < trim.left + safe || t.right > trim.right - safe) out.push(`near edge: "${el.textContent.trim().slice(0, 40)}"`);
    }
    return out;
  });
  const name = `${ID}_${W}x${H}in`;
  await page.pdf({ path: path.join(OUT, name + '.pdf'), width: `${PW}in`, height: `${PH}in`, printBackground: true, preferCSSPageSize: true });
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  await browser.close();
  console.log(name, issues.length ? '\n  ' + issues.join('\n  ') : 'ok');
})();
