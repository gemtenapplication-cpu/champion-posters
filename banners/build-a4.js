// Two A4 stickers (for PVC board) in the X-banner's dark navy theme:
//   1. Membership — free sign-up, Silver 10% off, points, Gold, referral
//   2. Community  — feed, leaderboard, challenges, teams, tournaments, chat
// Facts: champion.gemten.com.bd (pricing, community page, membership/points/referral policies, 16 Nov 2026).
// Authored in mm with 3 mm bleed. Run from repo root: node banners/build-a4.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const QR = require('qrcode');

const DIR = __dirname;
const OUT = path.join(DIR, 'print');
const W = 210, H = 297, BL = 3, DPI = 300;
const F = '../node_modules/@fontsource';
const B = '../brand';
const SITE = 'champion.gemten.com.bd';
// theme: dark (default) or light = white & blue, for brightly lit / daylight spots
const LIGHT = process.argv[2] === 'light';
const SUFFIX = LIGHT ? '-white-blue' : '';
const LIGHT_CSS = `
body{color:#0B0B0C;background:#FFFFFF}
.bg{background:radial-gradient(ellipse 150mm 90mm at 50% 36%,#DCEBFFb3,transparent 70%),linear-gradient(170deg,#FFFFFF 0%,#F4F8FF 48%,#DCEBFF 100%)}
.grid{background-image:radial-gradient(#2B83F633 .45mm,transparent .5mm);background-size:7mm 7mm;background-position:0 0}
.streak{background:linear-gradient(90deg,transparent,#2B83F655,transparent)}
.hud i{border-color:#2B83F6}
.lb{color:#2B83F6}
.silv{color:#5B6B82}
.sec i{background:linear-gradient(90deg,transparent,#2B83F6)}
.sec i:last-child{background:linear-gradient(90deg,#2B83F6,transparent)}
.sec span{color:#1F6FE5}
.tile{background:#FFFFFF;border:.45mm solid #2B83F659}
.tile span{color:#0B0B0Cb8}
.cta{background:#FFFFFF;border:.7mm solid #2B83F6}
.qr{border:.45mm solid #2B83F680}
.ct .u{color:#1F6FE5}
.ct .s{color:#0B0B0Cb8}
.fine{color:#0B0B0C99}
.glow{background:radial-gradient(ellipse at center,#2B83F638,transparent 70%)}
.card{background:linear-gradient(128deg,#E9EDF2 0%,#AFB9C7 26%,#DEE3EA 47%,#8D99AA 72%,#CBD2DC 100%);border:.7mm solid #0B1630}
.card-back{display:block}
.step{background:#FFFFFF}
.step span{color:#0B0B0Cb0}`;
const FOOT = 'IFIC Bank Building (4th Floor), Ranir Bazar, Cumilla · Open 10:00–23:00 · 01603-754074';

const qrSvg = async (url) => (await QR.toString(url, { type: 'svg', errorCorrectionLevel: 'Q', margin: 0, color: { dark: '#0B0B0C', light: '#FFFFFF' } }))
  .replace('<svg ', '<svg width="100%" height="100%" ');

// ── small CSS icons (sizes in mm) ──
const d = (css) => `<div style="position:absolute;${css}"></div>`;
const box = (s, inner) => `<div style="position:relative;width:${s}mm;height:${s}mm">${inner}</div>`;
function pad(w, col = '#FFFFFF', acc = '#1F6FE5') {
  const h = w * 0.52;
  return `<div style="position:relative;width:${w}mm;height:${h}mm">
${d(`left:0;top:0;width:${w}mm;height:${h * 0.8}mm;background:${col};border-radius:${h * 0.4}mm`)}
${d(`left:${w * 0.04}mm;top:${h * 0.35}mm;width:${w * 0.3}mm;height:${h * 0.65}mm;background:${col};border-radius:${w * 0.15}mm`)}
${d(`right:${w * 0.04}mm;top:${h * 0.35}mm;width:${w * 0.3}mm;height:${h * 0.65}mm;background:${col};border-radius:${w * 0.15}mm`)}
${d(`left:${w * 0.17}mm;top:${h * 0.27}mm;width:${w * 0.2}mm;height:${w * 0.065}mm;background:${acc}`)}
${d(`left:${w * 0.2375}mm;top:${h * 0.27 - w * 0.0675}mm;width:${w * 0.065}mm;height:${w * 0.2}mm;background:${acc}`)}
${[[0.25, 0.15], [0.16, 0.3], [0.34, 0.3], [0.25, 0.45]].map(([r, t]) => d(`right:${w * r}mm;top:${h * t}mm;width:${w * 0.075}mm;height:${w * 0.075}mm;background:${acc};border-radius:50%`)).join('')}</div>`;
}
const people = (s, c = '#fff') => box(s, `
${d(`left:${s * 0.06}mm;top:${s * 0.14}mm;width:${s * 0.3}mm;height:${s * 0.3}mm;border-radius:50%;background:${c};opacity:.55`)}
${d(`left:0;top:${s * 0.5}mm;width:${s * 0.44}mm;height:${s * 0.34}mm;border-radius:${s * 0.22}mm ${s * 0.22}mm ${s * 0.05}mm ${s * 0.05}mm;background:${c};opacity:.55`)}
${d(`left:${s * 0.42}mm;top:${s * 0.08}mm;width:${s * 0.36}mm;height:${s * 0.36}mm;border-radius:50%;background:${c}`)}
${d(`left:${s * 0.32}mm;top:${s * 0.5}mm;width:${s * 0.56}mm;height:${s * 0.38}mm;border-radius:${s * 0.28}mm ${s * 0.28}mm ${s * 0.05}mm ${s * 0.05}mm;background:${c}`)}`);
const gift = (s, c = '#fff', r = '#1F6FE5') => box(s, `
${d(`left:${s * 0.28}mm;top:${s * 0.02}mm;width:${s * 0.24}mm;height:${s * 0.22}mm;border:${s * 0.07}mm solid ${c};border-radius:${s * 0.12}mm ${s * 0.12}mm 0 ${s * 0.12}mm;transform:rotate(-12deg)`)}
${d(`left:${s * 0.48}mm;top:${s * 0.02}mm;width:${s * 0.24}mm;height:${s * 0.22}mm;border:${s * 0.07}mm solid ${c};border-radius:${s * 0.12}mm ${s * 0.12}mm ${s * 0.12}mm 0;transform:rotate(12deg)`)}
${d(`left:${s * 0.02}mm;top:${s * 0.27}mm;width:${s * 0.96}mm;height:${s * 0.22}mm;background:${c};border-radius:${s * 0.04}mm`)}
${d(`left:${s * 0.08}mm;top:${s * 0.51}mm;width:${s * 0.84}mm;height:${s * 0.47}mm;background:${c}`)}
${d(`left:${s * 0.43}mm;top:${s * 0.27}mm;width:${s * 0.14}mm;height:${s * 0.71}mm;background:${r}`)}`);
const feed = (s, c = '#fff') => box(s, `
${d(`left:${s * 0.1}mm;top:${s * 0.08}mm;width:${s * 0.8}mm;height:${s * 0.84}mm;border-radius:${s * 0.1}mm;background:${c}`)}
${d(`left:${s * 0.22}mm;top:${s * 0.2}mm;width:${s * 0.22}mm;height:${s * 0.22}mm;border-radius:50%;background:#1F6FE5`)}
${d(`left:${s * 0.5}mm;top:${s * 0.24}mm;width:${s * 0.28}mm;height:${s * 0.07}mm;border-radius:${s * 0.04}mm;background:#1F6FE5`)}
${d(`left:${s * 0.22}mm;top:${s * 0.52}mm;width:${s * 0.56}mm;height:${s * 0.07}mm;border-radius:${s * 0.04}mm;background:#4DA3FF`)}
${d(`left:${s * 0.22}mm;top:${s * 0.67}mm;width:${s * 0.42}mm;height:${s * 0.07}mm;border-radius:${s * 0.04}mm;background:#4DA3FF`)}`);
const bars = (s, c = '#fff') => box(s, [[0.1, 0.45], [0.38, 0.75], [0.66, 0.6]].map(([l, h]) =>
  d(`left:${s * l}mm;bottom:${s * 0.1}mm;width:${s * 0.24}mm;height:${s * h}mm;border-radius:${s * 0.04}mm ${s * 0.04}mm 0 0;background:${c}`)).join(''));
const chat = (s, c = '#fff') => box(s, `
${d(`left:${s * 0.04}mm;top:${s * 0.12}mm;width:${s * 0.92}mm;height:${s * 0.62}mm;border-radius:${s * 0.18}mm;background:${c}`)}
${d(`left:${s * 0.2}mm;top:${s * 0.66}mm;width:0;height:0;border-left:${s * 0.08}mm solid transparent;border-right:${s * 0.16}mm solid transparent;border-top:${s * 0.22}mm solid ${c}`)}
${[0.28, 0.46, 0.64].map(l => d(`left:${s * l}mm;top:${s * 0.36}mm;width:${s * 0.12}mm;height:${s * 0.12}mm;border-radius:50%;background:#1F6FE5`)).join('')}`);
const vs = (s) => `<div style="font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:${s * 0.42}mm;line-height:1;color:#fff">VS</div>`;
const trophy = (s) => `<img src="${B}/trophy-white.png" style="height:${s}mm">`;
const word = (t, s = 4.6) => `<div style="font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:${s}mm;line-height:1;color:#fff;white-space:nowrap">${t}</div>`;

function head(css) {
  const PW = W + 2 * BL, PH = H + 2 * BL;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(${F}/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@page{size:${PW}mm ${PH}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${PW}mm;height:${PH}mm;overflow:hidden}
body{font-family:Rajdhani,sans-serif;color:#fff;background:#070C1A;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:100%;height:100%;overflow:hidden}
.bg{position:absolute;inset:0;background:
  radial-gradient(ellipse 120mm 80mm at 50% 34%,#2B83F640,transparent 70%),
  radial-gradient(ellipse 150mm 70mm at 50% 0%,#1F6FE533,transparent 70%),
  radial-gradient(ellipse 120mm 70mm at 50% 88%,#1F6FE52e,transparent 70%),
  linear-gradient(172deg,#0B1530 0%,#070C1A 40%,#081127 72%,#0B1A3D 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(#4DA3FF12 .25mm,transparent .25mm),linear-gradient(90deg,#4DA3FF12 .25mm,transparent .25mm);background-size:10mm 10mm;background-position:-1mm -1mm}
.streak{position:absolute;height:.5mm;border-radius:.3mm;background:linear-gradient(90deg,transparent,#4DA3FF88,transparent);transform:rotate(-24deg)}
.trim{position:absolute;left:${BL}mm;top:${BL}mm;width:${W}mm;height:${H}mm}
.hud i{position:absolute;width:16mm;height:16mm;border-style:solid;border-color:#4DA3FF}
.c{position:absolute;left:0;right:0;text-align:center}
.o9{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900}
.o7{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700}
.lb{color:#4DA3FF}
.sec{position:absolute;left:12mm;right:12mm;display:flex;align-items:center;gap:4mm}
.sec i{flex:1;height:.4mm;background:linear-gradient(90deg,transparent,#4DA3FF)}
.sec i:last-child{background:linear-gradient(90deg,#4DA3FF,transparent)}
.sec span{font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;font-size:4.2mm;letter-spacing:1.4mm;color:#4DA3FF;padding-left:1.4mm;white-space:nowrap}
.tiles{position:absolute;left:9mm;right:9mm;display:grid;grid-template-columns:1fr 1fr;gap:3.5mm 4mm}
.tile{border-radius:4mm;background:#0F1F45d9;border:.35mm solid #4DA3FF55;display:flex;align-items:center;gap:3.6mm;padding:0 3.6mm}
.ic{width:14mm;height:14mm;flex:none;border-radius:3.2mm;background:linear-gradient(150deg,#2B83F6,#1F6FE5);display:flex;align-items:center;justify-content:center}
.tile b{display:block;font-size:5.4mm;line-height:1.05}
.tile span{display:block;font-weight:600;font-size:4.1mm;color:#FFFFFFc4;line-height:1.14;margin-top:.8mm}
.cta{position:absolute;left:9mm;right:9mm;top:240mm;height:38mm;border-radius:5mm;background:linear-gradient(150deg,#13254Ee6,#0B1630e6);border:.4mm solid #4DA3FF77;display:flex;align-items:center;gap:6mm;padding:0 3mm}
.qr{width:32mm;height:32mm;flex:none;background:#fff;border-radius:2.6mm;padding:2.3mm}
.ct .k{font-size:7.4mm;line-height:1;white-space:nowrap}
.ct .u{font-weight:700;font-size:7.4mm;color:#4DA3FF;margin-top:2.6mm;line-height:1}
.ct .s{font-weight:600;font-size:4.4mm;color:#FFFFFFc4;margin-top:2.2mm;line-height:1.18}
.silv{color:#D5DCE6}
.fine{color:#FFFFFF99}
.band{color:#fff;position:absolute;left:-${BL}mm;right:-${BL}mm;bottom:-${BL}mm;height:${11 + BL}mm;padding-bottom:${BL}mm;background:linear-gradient(90deg,#1F6FE5,#2B83F6 50%,#1F6FE5);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:4mm;white-space:nowrap}
${css}
${LIGHT ? LIGHT_CSS : ''}
</style></head><body><div class="pg"><div class="bg"></div><div class="grid"></div>
<div class="streak" style="left:-12mm;top:60mm;width:70mm"></div>
<div class="streak" style="left:150mm;top:30mm;width:70mm"></div>
<div class="streak" style="left:150mm;top:200mm;width:60mm;opacity:.7"></div>
<div class="trim"><div class="hud">
<i style="left:7mm;top:7mm;border-width:1.1mm 0 0 1.1mm"></i><i style="right:7mm;top:7mm;border-width:1.1mm 1.1mm 0 0"></i></div>
<img src="${B}/${LIGHT ? 'logo-color-on-light' : 'logo-white-gradient-trophy'}.png" style="position:absolute;left:47.5mm;top:13mm;width:115mm">`;
}
const tail = `<div class="band">${FOOT}</div></div></div></body></html>`;

async function membership() {
  const qr = await qrSvg(`https://${SITE}/login?mode=signup`);
  const css = `
.card{position:absolute;left:30mm;top:75.5mm;width:150mm;height:80mm;border-radius:6.5mm;transform:rotate(-3deg);overflow:hidden;
 background:linear-gradient(128deg,#F5F7FA 0%,#C3CCD8 26%,#F0F3F7 47%,#A7B1BF 72%,#E4E8EE 100%);border:.55mm solid #FFFFFFaa}
.card-back{display:none;position:absolute;left:30mm;top:75.5mm;width:150mm;height:80mm;border-radius:6.5mm;transform:translate(2mm,2.5mm) rotate(3deg);background:linear-gradient(150deg,#4DA3FF,#2B83F6 50%,#1F6FE5)}
.card .sh{position:absolute;top:-15mm;height:122mm;transform:rotate(28deg)}
.card .tag{position:absolute;right:6.9mm;top:7.6mm;background:#0B1630;color:#E3E8EF;border-radius:4mm;padding:1.5mm 3.2mm 1.5mm 3.8mm;font-size:3.5mm;letter-spacing:.6mm}
.card .big{position:absolute;left:7.2mm;top:20.5mm;font-size:36mm;line-height:1;color:#0B1630;letter-spacing:-.4mm}
.card .off{position:absolute;right:7.2mm;top:23.5mm;text-align:right;color:#1F6FE5;font-size:15.2mm;line-height:1}
.card .off small{display:block;font-family:Rajdhani,sans-serif;font-weight:700;font-size:6.3mm;color:#0B1630;margin-top:1.9mm;line-height:1.05}
.card .bot{position:absolute;left:7.2mm;bottom:6.4mm;font-size:3.8mm;letter-spacing:1mm;color:#0B1630}
.card .bot span{color:#1F6FE5}
.glow{position:absolute;left:25mm;top:150mm;width:160mm;height:24mm;background:radial-gradient(ellipse at center,#2B83F670,transparent 70%)}
.tile{height:21mm}`;
  const t = (ic, b, s) => `<div class="tile"><div class="ic">${ic}</div><div><b>${b}</b><span>${s}</span></div></div>`;
  return head(css) + `
<div class="c o7 lb" style="top:39mm;font-size:4.2mm;letter-spacing:1.4mm;padding-left:1.4mm">CHAMPION MEMBERSHIP · FREE</div>
<div class="c o9" style="top:46mm;font-size:13.5mm;line-height:1">SIGN UP FREE</div>
<div class="c" style="top:61.5mm;font-weight:700;font-size:8.2mm;line-height:1">&amp; become a <span class="silv">Silver member</span></div>
<div class="glow"></div>
<div class="card-back"></div>
<div class="card">
 <div class="sh" style="left:-30mm;width:23mm;background:linear-gradient(90deg,transparent,#FFFFFF8c,transparent)"></div>
 <div class="sh" style="left:69mm;width:9mm;background:linear-gradient(90deg,transparent,#FFFFFF66,transparent)"></div>
 <img src="${B}/logo-black.png" style="position:absolute;left:7.2mm;top:7.2mm;width:64mm">
 <div class="tag o7">SILVER MEMBER</div>
 <div class="big o9">10%</div>
 <div class="off o9">OFF<small>every<br>session</small></div>
 <div class="bot o7">MEMBER ID <span>+</span> QR CARD</div>
 <img src="${B}/trophy-black.png" style="position:absolute;right:7.6mm;bottom:5.3mm;height:17.5mm;opacity:.85">
</div>
<div class="tiles" style="top:166.5mm">
 ${t(word('10%', 4.8), '10% off every session', 'on standard sessions booked from your account')}
 ${t(word('ID', 6), 'Member ID &amp; QR card', 'in Rewards — show it at the counter')}
 ${t(word('+10', 4.8), 'Earn points', '10 points for every Tk 100 you pay')}
 ${t(gift(8.5), 'Rewards at the counter', 'use points for rewards, such as a free hour')}
 ${t(word('GOLD', 3.6), 'Gold at 2,000 points', 'book Fridays &amp; Saturdays 30 days ahead')}
 ${t(people(10), 'Refer a friend', 'get 20% off one slot after their first visit')}
</div>
<div class="cta"><div class="qr">${qr}</div>
 <div class="ct"><div class="k o9">SCAN TO SIGN UP</div><div class="u">${SITE}</div><div class="s">Free. Takes a minute — with your mobile<br>or your Gemten account.</div></div></div>
<div class="c fine" style="top:280.2mm;font-weight:600;font-size:3.2mm">Member discount applies to standard sessions, not to packs &amp; offers. Points and rewards have no cash value.</div>
` + tail;
}

async function community() {
  const qr = await qrSvg(`https://${SITE}/champion-community`);
  const css = `.tile{height:27mm}
.steps{position:absolute;left:9mm;right:9mm;top:196mm;display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}
.step{height:36mm;border-radius:4mm;border:.35mm solid #4DA3FF55;background:#0B1630cc;text-align:center;padding-top:3.4mm}
.step .n{width:10mm;height:10mm;margin:0 auto;border-radius:50%;background:linear-gradient(150deg,#2B83F6,#1F6FE5);font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:3.9mm;line-height:10mm}
.step b{display:block;font-size:4.7mm;line-height:1.05;margin-top:2.6mm}
.step span{display:block;font-weight:600;font-size:3.6mm;line-height:1.12;color:#FFFFFFbb;margin-top:1.2mm;padding:0 2mm}`;
  const t = (ic, b, s) => `<div class="tile"><div class="ic">${ic}</div><div><b>${b}</b><span>${s}</span></div></div>`;
  const st = (n, b, s) => `<div class="step"><div class="n">${n}</div><b>${b}</b><span>${s}</span></div>`;
  return head(css) + `
<div class="c o7 lb" style="top:39mm;font-size:4.2mm;letter-spacing:1.4mm;padding-left:1.4mm">CHAMPION COMMUNITY</div>
<div class="c o9" style="top:46mm;font-size:11.5mm;line-height:1.12">PLAY TOGETHER.<br><span class="lb">RISE TOGETHER.</span></div>
<div class="c" style="top:74.5mm;font-weight:700;font-size:6.6mm;line-height:1">Free with your Champion account.</div>
<div class="tiles" style="top:86mm">
 ${t(feed(10), 'Feed', 'Post your wins, react GG and cheer your friends.')}
 ${t(bars(10), 'Leaderboard', 'Every confirmed match moves your Champion score.')}
 ${t(vs(12), 'Challenges', 'Challenge anyone, play at Champion, both confirm the score.')}
 ${t(people(10), 'Teams', 'Build your squad, invite players, pick a captain.')}
 ${t(trophy(10.5), 'Tournaments', 'Play on the big screens. Win gifts and the trophy.')}
 ${t(chat(10), 'Chat &amp; groups', 'Message players, make squad groups, run polls.')}
</div>
<div class="sec" style="top:187.6mm"><i></i><span>FROM SIGN-UP TO THE TROPHY</span><i></i></div>
<div class="steps">
 ${st('01', 'Join<br>Champion', 'it takes a minute')}
 ${st('02', 'Pick your<br>@handle', 'follow players &amp; teams')}
 ${st('03', 'Challenge<br>&amp; play', 'both confirm the score')}
 ${st('04', 'Climb<br>&amp; win', 'trophies and gifts')}
</div>
<div class="cta"><div class="qr">${qr}</div>
 <div class="ct"><div class="k o9">SCAN TO JOIN</div><div class="u">${SITE}</div><div class="s">New tournaments are posted<br>in the community first.</div></div></div>
` + tail;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = [['champion-a4-membership' + SUFFIX, await membership()], ['champion-a4-community' + SUFFIX, await community()]];
  const browser = await chromium.launch();
  const PW = W + 2 * BL, PH = H + 2 * BL, px = 96 / 25.4;
  for (const [id, html] of jobs) {
    const src = path.join(DIR, id + '.html');
    fs.writeFileSync(src, html);
    const ctx = await browser.newContext({ viewport: { width: Math.round(PW * px), height: Math.round(PH * px) }, deviceScaleFactor: DPI / 96 });
    const page = await ctx.newPage();
    await page.goto('file://' + src);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
    const issues = await page.evaluate((mm) => {
      const out = [], trim = document.querySelector('.trim').getBoundingClientRect(), safe = 6 * mm;
      for (const el of document.querySelectorAll('.trim *')) {
        if (el.closest('.band')) continue;
        if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const r = document.createRange(); r.selectNodeContents(el); const t = r.getBoundingClientRect();
        if (t.left < trim.left + safe || t.right > trim.right - safe) out.push(`near edge: "${el.textContent.trim().slice(0, 40)}"`);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== 'inline') out.push(`overflow: "${el.textContent.trim().slice(0, 40)}"`);
      }
      const band = document.querySelector('.band'); if (band.scrollWidth > band.clientWidth + 1) out.push('footer band text too wide');
      return out;
    }, px);
    const name = `${id}_A4`;
    await page.pdf({ path: path.join(OUT, name + '.pdf'), width: `${PW}mm`, height: `${PH}mm`, printBackground: true, preferCSSPageSize: true });
    await page.screenshot({ path: path.join(OUT, name + '.png') });
    await ctx.close();
    console.log(name, issues.length ? '\n  ' + issues.join('\n  ') : 'ok');
  }
  await browser.close();
})();
