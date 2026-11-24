// Champion Silver membership sign-up promo — scene data
const DATA = {
 imgs: { rw1x: {}, kpts: {}, kmem1: {}, kmem2: {} },
 sections: [
  { a: 'g4-0.9', b: 'g8-0.9', num: '01', title: '3 BIG BENEFITS', bn: 'সিলভার মেম্বারের সুবিধা', mascot: 'm4' },
  { a: 'g8-0.9', b: 'g9-0.9', num: '02', title: 'MEMBER CARD', bn: 'আপনার নিজের মেম্বার কার্ড', mascot: 'm1' },
  { a: 'g9-0.9', b: 'g12-0.9', num: '03', title: 'ROAD TO GOLD', bn: 'পয়েন্ট জমিয়ে গোল্ড', mascot: 'm3' },
  { a: 'g12-0.9', b: 'g13-0.9', num: '04', title: 'JOIN FREE', bn: 'এক মিনিটেই মেম্বার', mascot: null },
  { a: 'g13-0.9', b: 'g13e+0.5', num: '05', title: 'GOOD TO KNOW', bn: 'জেনে রাখুন', mascot: 'm2' },
 ],
 kf: [
  { t: 'g5-1.0', img: 'rw1x', url: '/my/rewards', r: [0, 0, 1568, 559, 1], rv: [227, 130, 650, 330] },
  { t: 'g5w1-0.2', img: 'rw1x', url: '/my/rewards', r: [227, 319, 643, 129], rv: [227, 319, 643, 129] },
  { t: 'g6-0.4', img: 'kpts', url: '/my/knowledge', r: [470, 200, 600, 110], rv: [480, 222, 490, 30] },
  { t: 'g7-0.4', img: 'rw1x', url: '/my/rewards', r: [227, 319, 643, 129], rv: [227, 319, 643, 129] },
  { t: 'g8-0.9', img: 'rw1x', url: '/my/rewards', r: [227, 132, 775, 171], rv: [227, 132, 775, 171] },
  { t: 'g9-0.9', img: 'rw1x', url: '/my/rewards', r: [1017, 132, 513, 171], rv: [1017, 132, 513, 171] },
  { t: 'g10-0.3', img: 'rw1x', url: '/my/rewards', r: [886, 319, 644, 129], rv: [886, 319, 644, 129] },
  { t: 'g11-0.4', img: 'kmem1', url: '/my/knowledge', r: [470, 262, 600, 100], rv: [480, 330, 420, 30] },
  { t: 'g13-0.9', img: 'kmem2', url: '/my/knowledge', r: [470, 240, 1000, 70], rv: [480, 262, 330, 30] },
  { t: 'g13w4-0.2', img: 'kmem2', url: '/my/knowledge', r: [470, 240, 1000, 70], rv: [790, 262, 670, 30] },
 ],
 hl: [
  { a: 'g5w2-0.1', b: 'g5e+0.3', img: 'rw1x', r: [245, 366, 132, 15], label: 'প্রতিটা সেশনে ১০% ছাড়', below: true },
  { a: 'g6w2-0.1', b: 'g6e+0.3', img: 'kpts', r: [484, 229, 480, 16], label: '১০০ টাকায় ১০ পয়েন্ট', below: true },
  { a: 'g7w2-0.1', b: 'g7e+0.3', img: 'rw1x', r: [245, 412, 152, 15], label: '৩০ দিন আগে পর্যন্ত বুকিং', below: true },
  { a: 'g8w3-0.1', b: 'g8w6-0.2', img: 'rw1x', r: [245, 150, 180, 13], label: 'সিলভার মেম্বার কার্ড', below: true },
  { a: 'g8w6-0.1', b: 'g8w9-0.2', img: 'rw1x', r: [238, 265, 215, 22], label: 'মেম্বার আইডি' },
  { a: 'g8w9-0.1', b: 'g8w11-0.2', img: 'rw1x', r: [904, 151, 80, 80], label: 'QR', below: true },
  { a: 'g8w11-0.1', b: 'g8e+0.3', img: 'rw1x', r: [878, 273, 106, 12], label: 'কাউন্টারে দেখান' },
  { a: 'g9w1-0.1', b: 'g9w7-0.2', img: 'rw1x', r: [1036, 192, 474, 14], label: 'Road to Gold', below: true },
  { a: 'g9w7-0.1', b: 'g9e+0.3', img: 'rw1x', r: [1466, 208, 46, 12], label: '২,০০০ পয়েন্ট', below: true },
  { a: 'g10w0-0.1', b: 'g10w5-0.2', img: 'rw1x', r: [903, 412, 120, 15], label: 'সিলভারের সব সুবিধা', below: true },
  { a: 'g10w5-0.1', b: 'g10e+0.3', img: 'rw1x', r: [903, 389, 240, 15], label: 'শুক্র-শনি ৩০ দিন আগে' },
  { a: 'g11w0-0.1', b: 'g11e+0.3', img: 'kmem1', r: [484, 337, 414, 16], label: 'লেভেল কমে না', below: true },
  { a: 'g13w0-0.1', b: 'g13w4-0.2', img: 'kmem2', r: [484, 270, 306, 16], label: 'স্ট্যান্ডার্ড সেশনে', below: true },
  { a: 'g13w4-0.1', b: 'g13e+0.3', img: 'kmem2', r: [790, 270, 670, 16], label: 'প্যাকেজ-অফারে নিজস্ব দাম', below: true },
 ],
 cur: [],
 badges: [
  { a: 'g3-0.2', b: 'g4-0.55', y: 790, yv: 1230, items: [{ t: 'g3w0', ic: '✓', txt: 'কোনো ফি নেই' }, { t: 'g3w3', ic: '✓', txt: 'কোনো ঝামেলা নেই' }, { t: 'g3w6', ic: '✓', txt: 'মোবাইল দিয়ে সাইন আপ' }] },
  { a: 'g6w7-0.1', b: 'g6e+0.5', items: [{ t: 'g6w7', ic: '★', txt: 'যত খেলবেন, তত পয়েন্ট' }] },
 ],
 noSub: [], noCap: [],
 winOp(t) { let o = Math.min(P(t, S('g5') - 1.0, S('g5') - .6), 1 - P(t, E('g11') + .4, E('g11') + .8));
   o = Math.max(o, Math.min(P(t, S('g13') - 1.0, S('g13') - .6), 1 - P(t, E('g13') + .4, E('g13') + .8))); return clamp(o) },
 bgOp(t) { return 1 },
 wmOp(t) { return Math.min(P(t, S('g1') - .3, S('g1') + .2), 1 - P(t, S('q8') - .5, S('q8') - .1)) },
 sfx: [['g1w0-0.05', 'hit', -9, true], ['g1w6', 'whip', -11], ['g2w8-0.05', 'hit', -7, true], ['g2w8', 'sparkle', -10], ['g2w12-0.05', 'hit', -8, true],
   ['g4w4', 'pop', -8], ['g4w5', 'pop', -8], ['g4w6', 'pop', -8], ['g9w11', 'sparkle', -10], ['g12w6', 'pop', -9], ['g12w8', 'pop', -9], ['g12w15', 'ding', -10], ['g12w2', 'pop', -10],
   ['g14w2-0.05', 'hit', -8, true], ['g14w4-0.05', 'hit', -8, true], ['g14w4', 'sparkle', -11]],
 endA: 'g15',
};
// ---------- custom scenes ----------
const ICON = {
 globe: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.9 2.8 16.1 0 19M12 2.5c-2.8 2.9-2.8 16.1 0 19"/></svg>',
 pin: '<svg width="60" height="60" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
 wa: '<svg width="64" height="64" viewBox="0 0 24 24"><path fill="#fff" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2z"/></svg>',
 cal: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 star: '<svg width="70" height="70" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>',
 pct: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="17" r="2.6"/></svg>',
 phone: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="6" y="2.5" width="12" height="19" rx="2.6"/><path d="M10.5 18.5h3"/></svg>',
 check: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
};
function el(html, parent = 'cust1') { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; $(parent).appendChild(e); return e }
let C = {};
DATA.build = function () {
 const st = document.createElement('style'); st.textContent = `
  .scard{position:absolute;border-radius:34px;overflow:hidden;background:linear-gradient(135deg,#f3f6fb 0%,#c3ccd9 32%,#eef2f8 52%,#9aa7ba 78%,#dfe5ee 100%);box-shadow:0 0 0 3px rgba(255,255,255,.55),0 0 80px rgba(190,210,240,.45),0 30px 70px rgba(0,0,0,.55);color:#0b1d4f}
  .scard .sh{position:absolute;top:-20%;width:30%;height:140%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0));transform:rotate(18deg)}
  .scard .s1{position:absolute;font-family:Montserrat;font-weight:900;letter-spacing:4px;color:#33415f}
  .scard .s2{position:absolute;font-family:Anton;line-height:1;color:#0b1d4f}
  .scard .s3{position:absolute;font-weight:800;color:#1d2c50}
  .scard .s4{position:absolute;font-family:Montserrat;font-weight:800;letter-spacing:3px;color:#fff;background:#0b1d4f;border-radius:30px}
  .scard img{position:absolute;filter:brightness(0) saturate(100%);opacity:.78}
  .free{position:absolute;font-family:Anton;letter-spacing:2px;color:#06321a;background:linear-gradient(180deg,#a5f9c4,#2fcf6c);border-radius:22px;box-shadow:0 0 50px rgba(47,207,108,.55),0 14px 34px rgba(0,0,0,.5);white-space:nowrap}
  .ptag{position:absolute;font-weight:800;color:#fff;background:rgba(150,24,40,.9);border:2px solid #ff6b7d;border-radius:18px;white-space:nowrap}
  .ptag i{position:absolute;left:-4%;top:50%;height:8px;background:#ff3b52;border-radius:4px;transform:rotate(-8deg);box-shadow:0 0 16px rgba(255,60,80,.8)}
  .info{position:absolute;display:flex;gap:24px;align-items:center;padding:26px 30px;border-radius:26px;background:rgba(8,18,48,.92);border:2px solid rgba(110,165,255,.6);box-shadow:0 0 40px rgba(47,124,246,.25),0 20px 50px rgba(0,0,0,.5)}
  .info .ic{width:104px;height:104px;flex:none;border-radius:26px;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#4aa0ff,#1f5fd6)}
  .info .n{font-family:Anton;color:#7fc0ff;line-height:1}.info .a{font-weight:800;line-height:1.2}.info .b{font-weight:700;color:#cfe0ff;line-height:1.25}`;
 document.head.appendChild(st);
 // g1
 C.q1 = el(`<div class="abs kinB hide">চ্যাম্পিয়নে খেলেন?</div>`); C.q2 = el(`<div class="abs kinB hide" style="color:#ffd76a">প্রতিবার পুরো দাম কেন?</div>`);
 C.ptag = el(`<div class="ptag hide">পুরো দাম<i></i></div>`);
 // g2–g3
 C.t2 = el(`<div class="abs kin hide">SILVER MEMBER</div>`);
 C.card = el(`<div class="scard hide"><div class="sh"></div><div class="s1">CHAMPION · SILVER MEMBER</div><div class="s2">10% OFF</div><div class="s3">প্রতিটা সেশনে</div><div class="s4">MEMBER ID · QR</div><img src="../inv/brand/icon_white.png"></div>`);
 C.free = el(`<div class="free hide">একদম ফ্রি!</div>`);
 C.km = el(`<img class="abs hide" src="ss/m4.svg">`);
 // g4 tiles
 C.tiles = el(`<div class="abs hide" style="display:flex;gap:30px;justify-content:center"></div>`);
 C.tl = [['pct', '১০% ছাড়', 'প্রতিটা সেশনে'], ['star', 'পয়েন্ট', 'প্রতি টাকায়'], ['cal', '৩০ দিন', 'আগে বুকিং']].map(([ic, a, b]) => { const d = document.createElement('div'); d.className = 'card'; d.style.cssText = 'position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;padding:34px 44px';
   d.innerHTML = `<div style="width:130px;height:130px;border-radius:32px;background:linear-gradient(145deg,#4aa0ff,#1f5fd6);display:flex;align-items:center;justify-content:center">${ICON[ic]}</div><div><div class="tt" style="font-weight:800;line-height:1.15"></div><div class="tb" style="font-weight:700;color:#cfe0ff"></div></div>`;
   d.querySelector('.tt').textContent = a; d.querySelector('.tb').textContent = b; C.tiles.appendChild(d); return d });
 // g12 join steps
 C.js = [['১', ICON.globe, 'সাইটে যান', 'champion.gemten.com.bd'], ['২', ICON.phone, 'মোবাইল দিয়ে সাইন আপ', 'কোনো ফি নেই'], ['৩', ICON.check, 'আপনি সিলভার মেম্বার!', 'সঙ্গে সঙ্গেই ১০% ছাড়']].map(([n, ic, a, b], i) =>
   el(`<div class="info hide"><div class="ic" style="${i === 2 ? 'background:linear-gradient(145deg,#3ee07a,#14a34a)' : ''}">${ic}</div><div><div class="a">${a}</div><div class="b">${b}</div></div></div>`));
 C.min1 = el(`<div class="abs hide" style="font-weight:800;color:#0b1d4f;background:linear-gradient(180deg,#fff,#cfe0ff);border-radius:40px;padding:8px 30px;white-space:nowrap">মাত্র ১ মিনিট</div>`);
 // outro
 C.o1 = el(`<div class="abs kin hide">SIGN UP</div>`); C.o2 = el(`<div class="free hide" style="font-family:Anton">FREE</div>`);
 C.ob = el(`<div class="abs kinB hide">পরের সেশন থেকেই সাশ্রয়</div>`);
 C.om = el(`<img class="abs hide" src="ss/m4.svg">`);
 // end cards
 const card2 = (id, ic, k, v, cls = '', vc = '') => el(`<div id="${id}" class="card2 ${cls} hide"><div class="ic">${ICON[ic]}</div><div><div class="k">${k}</div><div class="v ${vc}">${v}</div></div></div>`, 'cust2');
 C.cU = card2('cU', 'globe', 'ফ্রি অ্যাকাউন্ট খুলুন', 'champion.gemten.com.bd', '', 'u'); C.cA = card2('cA', 'pin', 'ঠিকানা', 'রানীর বাজার, IFIC ব্যাংক বিল্ডিং<br>৪র্থ তলা, কুমিল্লা'); C.cW = card2('cW', 'wa', 'হোয়াটসঅ্যাপ', '01603-754074', 'wa', 'n');
 C.em = el(`<img class="abs hide" src="ss/m1.svg">`, 'cust2');
 C.fin = el(`<div id="fin" class="abs hide" style="left:0;width:100%"><img id="finI" src="../inv/brand/icon_white.png"><img id="finW" src="../inv/brand/wordmark_clean.png"><div id="finB">SILVER MEMBER · FREE · PLAY + CONNECT + WIN</div>
   <div class="fr"><div class="i">${ICON.globe.replace(/64/g, 26)}</div>champion.gemten.com.bd</div><div class="fr wa"><div class="i">${ICON.wa.replace(/64/g, 26)}</div>WhatsApp: 01603-754074</div>
   <div class="fr"><div class="i">${ICON.pin.replace(/60/g, 26)}</div>রানীর বাজার, IFIC ব্যাংক বিল্ডিং, ৪র্থ তলা, কুমিল্লা</div></div>`, 'cust2');
 const cardL = (x, y, w, h) => { pos(C.card, { left: x, top: y, width: w, height: h }); const k = w / 600; const q = s => C.card.querySelector(s);
   pos(q('.s1'), { left: 40 * k, top: 36 * k, fontSize: 22 * k + 'px' }); pos(q('.s2'), { left: 40 * k, top: 96 * k, fontSize: 112 * k + 'px' }); pos(q('.s3'), { left: 44 * k, top: 222 * k, fontSize: 34 * k + 'px' });
   pos(q('.s4'), { left: 40 * k, top: 280 * k, fontSize: 18 * k + 'px', padding: `${8 * k}px ${18 * k}px` }); pos(q('img'), { right: 36 * k, top: 34 * k, height: 104 * k }) };
 const info = (e, x, y, w, fa, fb) => { pos(e, { left: x, top: y, width: w }); e.querySelector('.a').style.fontSize = fa + 'px'; e.querySelector('.b').style.fontSize = fb + 'px' };
 if (!V) {
  pos(C.q1, { left: 0, width: 1920, top: 280, fontSize: '96px' }); pos(C.q2, { left: 0, width: 1920, top: 440, fontSize: '96px' }); pos(C.ptag, { left: 790, top: 660, fontSize: '60px', padding: '10px 40px' });
  pos(C.t2, { left: 0, width: 1920, top: 150, fontSize: '104px' }); cardL(660, 320, 600, 340); pos(C.free, { left: 1180, top: 280, fontSize: '64px', padding: '8px 34px' }); pos(C.km, { left: 330, top: 380, width: 260 });
  pos(C.tiles, { left: 0, width: 1920, top: 330 }); C.tl.forEach(d => { d.style.width = '440px'; d.querySelector('.tt').style.fontSize = '60px'; d.querySelector('.tb').style.fontSize = '36px'; d.querySelector('.tt').style.textAlign = d.querySelector('.tb').style.textAlign = 'center' });
  info(C.js[0], 120, 330, 540, 40, 28); info(C.js[1], 690, 330, 540, 40, 28); info(C.js[2], 1260, 330, 540, 40, 28); pos(C.min1, { left: 0, top: 640, fontSize: '50px' });
  pos(C.o1, { left: 0, width: 1920, top: 200, fontSize: '150px' }); pos(C.o2, { left: 0, top: 420, fontSize: '110px', padding: '4px 50px' }); pos(C.ob, { left: 0, width: 1920, top: 640, fontSize: '64px' }); pos(C.om, { left: 1500, top: 420, width: 280 });
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 310, top: 640, width: 1300 }); pos(C.em, { left: 1640, top: 600, width: 230 });
  pos(C.fin, { top: 140 }); $('finI').style.height = '130px'; $('finW').style.width = '600px'; $('finB').style.fontSize = '50px'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '34px');
 } else {
  pos(C.q1, { left: 40, width: 1000, top: 500, fontSize: '92px' }); pos(C.q2, { left: 40, width: 1000, top: 680, fontSize: '92px', whiteSpace: 'normal', lineHeight: '1.25' }); pos(C.ptag, { left: 0, top: 1040, fontSize: '64px', padding: '10px 44px' });
  pos(C.t2, { left: 0, width: 1080, top: 360, fontSize: '110px', whiteSpace: 'normal', lineHeight: '1.05' }); C.t2.innerHTML = 'SILVER<br>MEMBER'; cardL(110, 680, 860, 487); pos(C.free, { left: 610, top: 610, fontSize: '70px', padding: '8px 36px' }); pos(C.km, { left: 2000, top: 0, width: 10 });
  pos(C.tiles, { left: 0, width: 1080, top: 380, flexDirection: 'column', alignItems: 'center', gap: '28px' }); C.tl.forEach(d => { d.style.width = '760px'; d.style.flexDirection = 'row'; d.style.gap = '36px'; d.style.padding = '26px 40px'; d.querySelector('.tt').style.fontSize = '66px'; d.querySelector('.tb').style.fontSize = '40px' });
  info(C.js[0], 60, 420, 960, 50, 36); info(C.js[1], 60, 680, 960, 50, 36); info(C.js[2], 60, 940, 960, 50, 36); pos(C.min1, { left: 0, top: 1230, fontSize: '52px' });
  pos(C.o1, { left: 0, width: 1080, top: 400, fontSize: '170px' }); pos(C.o2, { left: 0, top: 640, fontSize: '130px', padding: '4px 56px' }); pos(C.ob, { left: 40, width: 1000, top: 930, fontSize: '64px', whiteSpace: 'normal' }); pos(C.om, { left: 390, top: 1080, width: 300 });
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 40, top: 1180, width: 1000 }); pos(C.em, { left: 400, top: 700, width: 280 });
  pos(C.fin, { top: 300 }); $('finI').style.height = '130px'; $('finW').style.width = '560px'; $('finB').style.fontSize = '44px'; $('finB').style.whiteSpace = 'normal'; $('finB').style.width = '900px'; $('finB').style.textAlign = 'center'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '30px');
 }
};
function slam(e, t, a, b, s0 = 1.6, rot = 0) { const v = vis(t, a, b, .01, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .4)); e.style.opacity = Math.min(1, P(t, a, a + .1)) * v; e.style.transform = `scale(${s0 - (s0 - 1) * k}) rotate(${rot}deg)`; return v }
function pop(e, t, a, b, dy = 40) { const v = vis(t, a, b, .2, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .45)); e.style.opacity = v; e.style.transform = `translateY(${(1 - k) * dy}px) scale(${.85 + .15 * k})`; return v }
const W2 = () => V ? 1080 : 1920;
const ctr = e => e.style.left = (W2() / 2 - e.offsetWidth / 2) + 'px';
DATA.render = function (t) {
 let fl = 0;
 logo(t, 0, S('g1') - .15, 470, 860); fl = Math.max(fl, vis(t, 0, .3, .01, .29) * .8);
 // g1 question
 { const b = S('g2') - .3; slam(C.q1, t, S('g1') - .15, b, 1.4); slam(C.q2, t, T('g1w2') - .1, b, 1.4);
   if (slam(C.ptag, t, T('g1w4') - .1, b, 1.5, -3)) { ctr(C.ptag); const i = C.ptag.querySelector('i'); i.style.width = (108 * eo(P(t, T('g1w6'), T('g1w6') + .35))) + '%' } }
 // g2–g3 silver card
 { const a = S('g2') - .15, b = S('g4') - .55; slam(C.t2, t, T('g2w8') - .15, b, 1.5);
   const v = vis(t, a, b, .3, .3); show(C.card, v > 0);
   if (v) { const k = eback(P(t, a, a + .6)), fk = eback(P(t, T('g2w8') - .15, T('g2w8') + .35)); C.card.style.opacity = v;
     C.card.style.transform = `perspective(1400px) rotateY(${(1 - fk) * 70}deg) translateY(${(1 - k) * 120}px) scale(${.88 + .12 * fk})`;
     C.card.querySelector('.sh').style.left = (-40 + 180 * ((t * .45) % 1.4)) + '%'; if (P(t, T('g2w8') - .15, T('g2w8')) > 0 && P(t, T('g2w8') - .15, T('g2w8')) < 1) fl = Math.max(fl, .3) }
   slam(C.free, t, T('g2w12') - .1, b, 2.0, 7);
   const vm = vis(t, a + .3, b, .2, .3); show(C.km, vm > 0); if (vm) { const k = eback(P(t, a + .3, a + .8)); C.km.style.opacity = vm; C.km.style.transform = `translateY(${(1 - k) * 200 + Math.abs(Math.sin(t * 3)) * -20}px)` } }
 // g4 tiles
 { const a = S('g4') - .3, b = S('g5') - .7, v = vis(t, a, b, .2, .3); show(C.tiles, v > 0); if (v) { C.tiles.style.opacity = v;
   C.tl.forEach((d, i) => { const ti = T(['g4w4', 'g4w5', 'g4w6'][i]) - .15, k = eback(P(t, ti, ti + .4)); d.style.opacity = P(t, ti, ti + .1); d.style.transform = `scale(${.5 + .5 * k})` }) } }
 // g12 join steps
 { const b = S('g13') - .7; C.js.forEach((e, i) => { const ta = T(['g12w6', 'g12w8', 'g12w15'][i]) - .15; pop(e, t, ta, b, 50); if (t >= ta && i === 2) { const p = P(t, ta, ta + .5); e.style.boxShadow = p < 1 ? `0 0 ${80 * (1 - p)}px rgba(47,207,108,.8)` : '' } });
   if (pop(C.min1, t, T('g12w2') - .1, T('g12w6') - .1, 30)) ctr(C.min1) }
 // outro
 { const a = S('g14') - .3, b = S('g15') - .3; slam(C.o1, t, T('g14w2') - .1, b, 1.7); if (slam(C.o2, t, T('g14w4') - .1, b, 2.2, -4)) ctr(C.o2);
   slam(C.ob, t, T('g14w6') - .1, b, 1.3); const v = vis(t, a, b, .3, .3); show(C.om, v > 0); if (v) { const k = eback(P(t, a, a + .5)); C.om.style.opacity = v; C.om.style.transform = `translateY(${(1 - k) * 200 + Math.abs(Math.sin(t * 3.2)) * -24}px)` } }
 // end cards
 const cd = (e, a, b) => { const v = vis(t, a, b, .3, .25); show(e, v > 0); if (v) { e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(P(t, a, a + .4))) * 60}px)` } return v };
 cd(C.cU, S('g15') - .15, S('q5') - .2); cd(C.cA, S('q5') - .15, S('q7') - .2); cd(C.cW, S('q7') - .15, S('q8') - .3);
 { const v = vis(t, S('g15') - .2, S('q8') - .3, .3, .3); show(C.em, v > 0); if (v) { C.em.style.opacity = v; C.em.style.transform = `translateY(${Math.sin(t * 2.4) * 10}px) rotate(${Math.sin(t * 1.8) * 3}deg)` } }
 { const a = S('q8') - .3, o = t >= a; show(C.fin, o); if (o) { C.fin.style.opacity = P(t, a, a + .4); $('finB').style.transform = `scale(${1.3 - .3 * eback(P(t, a + .2, a + .6))})`;
   C.fin.querySelectorAll('.fr').forEach((e, i) => { const v = P(t, a + .5 + i * .25, a + .85 + i * .25); e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(v)) * 30}px)` }) } fl = Math.max(fl, vis(t, a, a + .3, .01, .29) * .6) }
 return fl;
};
