// Renders scene backgrounds, subtitle overlays and the static watermark overlay as PNGs.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const script = JSON.parse(fs.readFileSync(path.join(DIR, 'script.json'), 'utf8'));
const OUT = path.join(DIR, 'frames');
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;800&family=Bebas+Neue&display=swap" rel="stylesheet">`;

const THEMES = {
  sunset: { sky: ['#0b0221', '#2a0845', '#7a1460', '#ff2e88', '#ffb347'], sun: ['#ffe259', '#ff4e8a'], grid: '#ff3ea5', accent: '#ff5fb0', glow: '#ff2e88' },
  night:  { sky: ['#01030f', '#06122e', '#0c2752', '#145a8a', '#1fa3c4'], sun: ['#c8f7ff', '#3ad0ff'], grid: '#2ad7ff', accent: '#4fe3ff', glow: '#1fb6ff' },
  red:    { sky: ['#0a0105', '#24030d', '#4d0819', '#a1122d', '#ff5a3c'], sun: ['#ffb199', '#ff1f3d'], grid: '#ff2b4a', accent: '#ff6a6a', glow: '#ff1f3d' },
  neon:   { sky: ['#04010d', '#14062e', '#3a0d6e', '#7b2cbf', '#22d3ee'], sun: ['#7ff9ff', '#c026d3'], grid: '#b84dff', accent: '#5ff4ff', glow: '#a855f7' },
  gold:   { sky: ['#080402', '#251006', '#5a2608', '#c2590c', '#ffc94d'], sun: ['#fff3b0', '#ff9a1f'], grid: '#ffb02e', accent: '#ffd166', glow: '#ff9a1f' },
};

// deterministic pseudo-random
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function skyline(seed, color) {
  const r = rng(seed); let x = 0; let rects = '';
  while (x < 2400) {
    const w = 40 + r() * 90, h = 60 + r() * (r() > 0.85 ? 320 : 170);
    rects += `<rect x="${x.toFixed(0)}" y="${(400 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}"/>`;
    // windows
    for (let wy = 400 - h + 14; wy < 390; wy += 22) for (let wx = x + 8; wx < x + w - 10; wx += 18)
      if (r() > 0.78) rects += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="7" height="9" fill="${color}" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
    x += w + r() * 8;
  }
  return `<svg class="skyline" viewBox="0 0 2400 400" preserveAspectRatio="none"><g fill="#07020f">${rects}</g></svg>`;
}

function grid(color) {
  // ground area: 1920 x 412 (y 668..1080); vanishing point at (960, -260)
  let l = '';
  const H = 412, vy = -260;
  for (let i = -24; i <= 24; i++) {
    const xb = 960 + i * 150;               // x at bottom edge
    const xt = 960 + (xb - 960) * (0 - vy) / (H - vy); // x at top edge
    l += `<line x1="${xt.toFixed(1)}" y1="0" x2="${xb.toFixed(1)}" y2="${H}"/>`;
  }
  for (let k = 1; k < 16; k++) { const y = H * Math.pow(k / 15, 2.2); l += `<line x1="0" y1="${y.toFixed(1)}" x2="1920" y2="${y.toFixed(1)}"/>`; }
  return `<svg class="gridsvg" viewBox="0 0 1920 ${H}" preserveAspectRatio="none"><g stroke="${color}" stroke-width="2.2" fill="none">${l}</g></svg>`;
}

function palm(cls) {
  return `<svg class="palm ${cls}" viewBox="0 0 300 700"><g fill="#06010c">
  <path d="M150 700 C 158 520 170 360 160 210 L 148 210 C 150 360 136 520 128 700 Z"/>
  <path d="M155 215 C 100 150 40 150 0 190 C 50 160 100 175 150 222 Z"/>
  <path d="M155 215 C 120 120 60 90 10 100 C 70 110 115 150 150 222 Z"/>
  <path d="M155 215 C 170 110 220 70 290 80 C 230 100 190 140 160 222 Z"/>
  <path d="M155 215 C 210 160 270 170 300 220 C 250 185 205 185 160 225 Z"/>
  <path d="M155 215 C 150 140 160 80 140 30 C 175 80 172 150 162 220 Z"/>
  <path d="M155 215 C 110 200 70 240 60 300 C 90 250 120 235 152 228 Z"/>
  <path d="M158 215 C 205 205 245 245 250 300 C 225 255 195 238 160 228 Z"/></g></svg>`;
}

const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:transparent}
body{font-family:'Anek Bangla','Noto Sans Bengali',sans-serif;color:#fff}
`;

function sceneHTML(s, idx) {
  const t = THEMES[s.theme];
  const r = rng(idx * 97 + 13);
  let stars = '';
  for (let i = 0; i < 90; i++) stars += `<i style="left:${(r() * 100).toFixed(2)}%;top:${(r() * 45).toFixed(2)}%;opacity:${(0.2 + r() * 0.8).toFixed(2)};transform:scale(${(0.5 + r()).toFixed(2)})"></i>`;
  const isCard = s.kind === 'title' || s.kind === 'end';
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
.sky{position:absolute;inset:0;background:linear-gradient(180deg,${t.sky[0]} 0%,${t.sky[1]} 25%,${t.sky[2]} 45%,${t.sky[3]} 57%,${t.sky[4]} 63%)}
.stars i{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff}
.sun{position:absolute;width:620px;height:620px;border-radius:50%;left:${isCard ? 650 : 1180}px;top:${isCard ? 190 : 150}px;
  background:linear-gradient(180deg,${t.sun[0]} 10%,${t.sun[1]} 90%);
  -webkit-mask:linear-gradient(180deg,#000 0 52%,transparent 52% 55%,#000 55% 63%,transparent 63% 67%,#000 67% 74%,transparent 74% 79%,#000 79% 85%,transparent 85% 91%,#000 91%);
  filter:drop-shadow(0 0 60px ${t.glow});}
.skyline{position:absolute;left:-240px;width:2400px;height:260px;top:420px}
.ground{position:absolute;left:0;right:0;top:668px;bottom:0;background:linear-gradient(180deg,#120320,#05010a);overflow:hidden;perspective:420px}
.gridsvg{position:absolute;left:0;top:0;width:1920px;height:412px;opacity:.7;filter:drop-shadow(0 0 5px ${t.grid})}
.horizon{position:absolute;left:0;right:0;top:664px;height:6px;background:${t.grid};box-shadow:0 0 30px 8px ${t.glow}}
.ground:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,1,10,.35) 0%,rgba(5,1,10,0) 25%,rgba(5,1,10,.35) 100%)}
.palm{position:absolute;bottom:130px;filter:drop-shadow(0 0 2px rgba(0,0,0,.6))}
.palm.r1{right:-40px;width:330px;height:770px}.palm.r2{right:200px;width:220px;height:520px;bottom:150px}
.palm.l1{left:-90px;width:260px;height:610px;transform:scaleX(-1)}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(0,0,0,.65) 100%)}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.08) 0 2px,transparent 2px 4px)}
.text{position:absolute;left:150px;top:190px;width:1100px}
.kicker{font-size:34px;font-weight:600;letter-spacing:3px;color:${t.accent};text-shadow:0 0 18px ${t.glow};display:flex;align-items:center;gap:20px}
.kicker:before{content:"";width:70px;height:4px;background:${t.accent};box-shadow:0 0 12px ${t.glow}}
.title{font-size:150px;font-weight:800;line-height:1.15;margin-top:18px;
  text-shadow:0 0 2px #fff,0 0 28px ${t.glow},0 0 70px ${t.glow},0 6px 0 rgba(0,0,0,.5)}
.sub{font-size:46px;font-weight:500;margin-top:22px;color:#fff;opacity:.95;text-shadow:0 3px 14px rgba(0,0,0,.9);
  display:inline-block;padding:10px 26px;border-left:6px solid ${t.accent};background:rgba(5,1,15,.45)}
.card{position:absolute;left:0;right:0;top:${s.kind === 'end' ? 150 : 210}px;text-align:center}
.big{font-family:'Bebas Neue',sans-serif;font-size:330px;line-height:.9;letter-spacing:14px;color:#fff;
  text-shadow:0 0 4px #fff,0 0 30px ${t.glow},0 0 90px ${t.glow},0 10px 0 rgba(0,0,0,.45)}
.tag{font-size:72px;font-weight:800;margin-top:${s.kind==='title'?150:10}px;text-shadow:0 0 24px ${t.glow},0 4px 12px rgba(0,0,0,.8)}
.small{font-size:34px;font-weight:500;margin-top:24px;color:${t.accent};text-shadow:0 0 14px ${t.glow}}
.credits{font-size:36px;line-height:1.75;font-weight:500;margin-top:30px;text-shadow:0 3px 12px #000}
.credits b{color:${t.accent};font-weight:600}
.panel{display:inline-block;padding:40px 70px;border-radius:20px;background:rgba(6,2,18,.78);border:2px solid ${t.accent};box-shadow:0 0 40px ${t.glow}}
.disc{font-size:28px;opacity:.8;margin-top:26px}
</style></head><body>
<div class="sky"></div><div class="stars">${stars}</div><div class="sun"></div>
${skyline(idx * 31 + 7, t.sun[0])}
<div class="horizon"></div><div class="ground">${grid(t.grid)}</div>
${palm('l1')}${isCard ? '' : palm('r2')}${palm('r1')}
<div class="vignette"></div><div class="scan"></div>
${s.kind === 'title' ? `<div class="card"><div class="big">GTA VI</div><div class="tag">অপেক্ষার ১৩ বছর</div><div class="small">একটি বাংলা ডকুমেন্টারি</div></div>`
 : s.kind === 'end' ? `<div class="card"><div class="panel"><div class="tag">ধন্যবাদ</div><div class="credits">
   <b>ভয়েসওভার:</b> জাফর (Jafor — ElevenLabs AI ভয়েস)<br><b>ফুটেজ:</b> Rockstar Games — GTA VI Trailer 1 ও Launch Trailer<br><b>তথ্যসূত্র:</b> Rockstar Games, Take-Two Interactive, Metacritic, সংবাদমাধ্যম</div>
   <div class="disc">সকল গেম ফুটেজের স্বত্ব Rockstar Games-এর; শুধু আলোচনা ও পর্যালোচনার উদ্দেশ্যে ব্যবহৃত।<br>এটি একটি ফ্যান-নির্মিত ডকুমেন্টারি, Rockstar Games বা Take-Two-এর সাথে সম্পর্কিত নয়।<br>বিক্রির তথ্য কোম্পানির নিজস্ব দাবি অনুযায়ী।</div></div></div>`
 : `<div class="text"><div class="kicker">${s.kicker}</div><div class="title">${s.title}</div><div class="sub">${s.sub}</div></div>`}
</body></html>`;
}

function subHTML(text) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
.wrap{position:absolute;left:0;right:0;bottom:70px;display:flex;justify-content:center}
.box{max-width:1560px;text-align:center;font-size:48px;font-weight:500;line-height:1.45;padding:14px 34px;border-radius:12px;
  background:rgba(4,1,12,.72);box-shadow:0 8px 30px rgba(0,0,0,.45);text-shadow:0 2px 6px rgba(0,0,0,.9)}
</style></head><body><div class="wrap"><div class="box">${text}</div></div></body></html>`;
}

function panelHTML(s) {
  const t = THEMES[s.theme];
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,1,10,.82) 0%,rgba(3,1,10,.55) 38%,rgba(3,1,10,0) 62%)}
.text{position:absolute;left:130px;top:250px;width:1100px}
.kicker{font-size:34px;font-weight:600;letter-spacing:3px;color:${t.accent};text-shadow:0 0 18px ${t.glow},0 2px 6px #000;display:flex;align-items:center;gap:20px}
.kicker:before{content:"";width:70px;height:4px;background:${t.accent};box-shadow:0 0 12px ${t.glow}}
.title{font-size:140px;font-weight:800;line-height:1.15;margin-top:14px;text-shadow:0 0 2px #fff,0 0 26px ${t.glow},0 0 60px ${t.glow},0 6px 10px rgba(0,0,0,.7)}
.sub{font-size:44px;font-weight:500;margin-top:20px;display:inline-block;padding:10px 26px;border-left:6px solid ${t.accent};background:rgba(5,1,15,.6);text-shadow:0 2px 8px #000}
</style></head><body><div class="shade"></div><div class="text"><div class="kicker">${s.kicker}</div><div class="title">${s.title}</div><div class="sub">${s.sub}</div></div></body></html>`;
}

function creditHTML() {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
.c{position:absolute;left:56px;top:46px;font-size:26px;font-weight:500;padding:7px 16px;border-radius:8px;background:rgba(0,0,0,.5);opacity:.92}
.c b{font-weight:600;color:#ffd1e8}
</style></head><body><div class="c"><b>ফুটেজ:</b> Rockstar Games — GTA VI অফিসিয়াল ট্রেলার</div></body></html>`;
}

function chromeHTML() {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
.wm{position:absolute;right:56px;top:44px;font-size:28px;font-weight:600;letter-spacing:1px;opacity:.85;
  padding:8px 18px;border:2px solid rgba(255,255,255,.55);border-radius:8px;background:rgba(0,0,0,.25)}
.wm span{font-family:'Bebas Neue';font-size:34px;letter-spacing:3px;margin-right:10px;vertical-align:-2px}
</style></head><body><div class="wm"><span>GTA VI</span>বাংলা ডকুমেন্টারি</div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  // backgrounds rendered at 1.25x so ffmpeg can slowly zoom without upscaling blur
  const bg = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.25 });
  const scenes = [{ id: 's00', kind: 'title', theme: 'sunset' }, ...script, { id: 's11', kind: 'end', theme: 'neon' }];
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    await bg.setContent(sceneHTML(s, i), { waitUntil: 'networkidle' });
    await bg.evaluate(() => document.fonts.ready);
    await bg.screenshot({ path: path.join(OUT, `${s.id}_bg.png`) });
    console.log('bg', s.id);
  }
  const ov = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  for (const s of script) for (let i = 0; i < s.lines.length; i++) {
    await ov.setContent(subHTML(s.lines[i].sub), { waitUntil: 'networkidle' });
    await ov.evaluate(() => document.fonts.ready);
    await ov.screenshot({ path: path.join(OUT, `${s.id}_${String(i).padStart(2, '0')}_sub.png`), omitBackground: true });
  }
  for (const sc of script) {
    await ov.setContent(panelHTML(sc), { waitUntil: 'networkidle' }); await ov.evaluate(() => document.fonts.ready);
    await ov.screenshot({ path: path.join(OUT, `${sc.id}_panel.png`), omitBackground: true });
  }
  await ov.setContent(creditHTML(), { waitUntil: 'networkidle' }); await ov.evaluate(() => document.fonts.ready);
  await ov.screenshot({ path: path.join(OUT, `credit.png`), omitBackground: true });
  await ov.setContent(chromeHTML(), { waitUntil: 'networkidle' });
  await ov.evaluate(() => document.fonts.ready);
  await ov.screenshot({ path: path.join(OUT, `chrome.png`), omitBackground: true });
  await browser.close();
  console.log('done');
})();
