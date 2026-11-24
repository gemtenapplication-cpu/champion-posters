// Champion Refer-a-friend promo — scene data
const DATA = {
 imgs: { rwr: {}, kref: {}, kmem2: {} },
 sections: [
  { a: 'r3-0.9', b: 'r5-0.9', num: '01', title: 'COPY YOUR LINK', bn: 'আপনার নিজের রেফার লিংক', mascot: 'm1' },
  { a: 'r5-0.9', b: 'r7-0.9', num: '02', title: 'SHARE', bn: 'বন্ধুদের পাঠিয়ে দিন', mascot: null },
  { a: 'r7-0.9', b: 'r9-0.9', num: '03', title: 'GET 20% OFF', bn: 'বন্ধু খেললেই আপনার রিওয়ার্ড', mascot: null },
  { a: 'r9-0.9', b: 'r11-0.9', num: '04', title: 'TRACK', bn: 'সব হিসাব এক জায়গায়', mascot: 'm3' },
  { a: 'r11-0.9', b: 'r14e+0.5', num: '05', title: 'RULES', bn: 'কয়েকটা নিয়ম জেনে রাখুন', mascot: 'm2' },
 ],
 kf: [
  { t: 'r3-0.9', img: 'rwr', url: '/my/rewards', r: [0, 0, 1568, 516, 1], rv: [0, 60, 900, 440] },
  { t: 'r3w9-0.2', img: 'rwr', url: '/my/rewards', r: [886, 282, 644, 196], rv: [886, 282, 644, 196] },
  { t: 'r4-0.2', img: 'rwr', url: '/my/rewards', r: [900, 330, 620, 80], rv: [1000, 340, 520, 80] },
  { t: 'r9-0.9', img: 'rwr', url: '/my/rewards', r: [886, 282, 644, 196], rv: [886, 282, 644, 196] },
  { t: 'r9w0-0.2', img: 'rwr', url: '/my/rewards', r: [900, 398, 616, 70], rv: [900, 398, 616, 70] },
  { t: 'r11-0.9', img: 'kref', url: '/my/knowledge', r: [450, 140, 1080, 300], rv: [455, 140, 640, 300] },
  { t: 'r11w4-0.2', img: 'kref', url: '/my/knowledge', r: [460, 330, 640, 100], rv: [478, 350, 420, 40] },
  { t: 'r12-0.2', img: 'kref', url: '/my/knowledge', r: [470, 355, 600, 70], rv: [480, 370, 570, 45] },
  { t: 'r13-0.2', img: 'kref', url: '/my/knowledge', r: [470, 262, 600, 170], rv: [480, 262, 590, 170] },
  { t: 'r14-0.4', img: 'kmem2', url: '/my/knowledge', r: [470, 240, 600, 90], rv: [480, 280, 470, 40] },
 ],
 hl: [
  { a: 'r3w5-0.2', b: 'r3w9-0.3', img: 'rwr', r: [14, 182, 160, 30], label: 'Rewards & points', below: true },
  { a: 'r3w10-0.1', b: 'r3e+0.3', img: 'rwr', r: [890, 288, 636, 186], label: 'Refer a friend' },
  { a: 'r4w0-0.1', b: 'r4w5-0.2', img: 'rwr', r: [905, 365, 533, 29], label: 'আপনার নিজের লিংক', below: true },
  { a: 'r4w5-0.1', b: 'r4e+0.3', img: 'rwr', r: [1445, 365, 65, 29], label: 'কপি!', below: true },
  { a: 'r9w0-0.1', b: 'r9w3-0.2', img: 'rwr', r: [905, 407, 197, 53], label: 'Joined' },
  { a: 'r9w3-0.1', b: 'r9w6-0.2', img: 'rwr', r: [1110, 407, 196, 53], label: 'Rewards ready' },
  { a: 'r9w6-0.1', b: 'r9e+0.3', img: 'rwr', r: [1313, 407, 197, 53], label: 'Used' },
  { a: 'r11w4-0.1', b: 'r11e+0.3', img: 'kref', r: [484, 360, 390, 16], label: 'শুধু নতুন বন্ধু' },
  { a: 'r12w0-0.1', b: 'r12w5-0.2', img: 'kref', r: [484, 383, 302, 16], label: 'নিজেকে নয়' },
  { a: 'r12w5-0.1', b: 'r12e+0.3', img: 'kref', r: [790, 383, 255, 16], label: 'এক বন্ধু = এক মেম্বার', below: true },
  { a: 'r13w0-0.1', b: 'r13w7-0.2', img: 'kref', r: [776, 276, 282, 16], label: 'প্যাকেজ বা মেম্বারশিপে নয়' },
  { a: 'r13w7-0.1', b: 'r13e+0.3', img: 'kref', r: [484, 406, 172, 16], label: 'ক্যাশ ভ্যালু নেই', below: true },
  { a: 'r14w0', b: 'r14e+0.4', img: 'kmem2', r: [484, 293, 458, 16], label: 'যেটা বড়, সেটাই', below: true },
 ],
 cur: [
  { t: 'r3w6', img: 'rwr', x: 90, y: 197 },
  { t: 'r4w8', img: 'rwr', x: 1478, y: 380 },
 ],
 badges: [
  { a: 'r2w6', b: 'r3-0.55', y: 700, yv: 860, arrows: true, items: [{ t: 'r2w8', ic: '১', txt: 'লিংক কপি' }, { t: 'r2w9', ic: '২', txt: 'শেয়ার' }, { t: 'r2w10', ic: '৩', txt: '২০% ছাড়' }] },
  { a: 'r4w8+0.15', b: 'r4e+0.5', items: [{ t: 'r4w8+0.15', ic: '✓', txt: 'লিংক কপি হয়েছে' }] },
 ],
 noSub: [], noCap: [],
 winOp(t) { let o = Math.min(P(t, S('r3') - 1.0, S('r3') - .6), 1 - P(t, S('r5') - 1.0, S('r5') - .6));
   o = Math.max(o, Math.min(P(t, S('r9') - 1.0, S('r9') - .6), 1 - P(t, E('r14') + .4, E('r14') + .8))); return clamp(o) },
 bgOp(t) { return 1 },
 wmOp(t) { return Math.min(P(t, S('r1') - .3, S('r1') + .2), 1 - P(t, S('q8') - .5, S('q8') - .1)) },
 sfx: [['r1w9-0.05', 'hit', -7, true], ['r1w9', 'sparkle', -10], ['r5w3', 'notif', -12], ['r5w5', 'notif', -12], ['r6w6', 'notif', -11], ['r6w8', 'ding', -11],
   ['r7w5', 'pop', -9], ['r7w9', 'pop', -9], ['r7w15-0.05', 'hit', -8, true], ['r7w15', 'sparkle', -9], ['r8w3', 'pop', -9], ['r8w9', 'pop', -9], ['r8w13', 'whip', -12],
   ['r10w0', 'pop', -9], ['r10w4', 'pop', -9], ['r10w6', 'hit', -9, true], ['r15w6', 'hit', -9, true], ['r15w10', 'hit', -9, true], ['r15w12', 'hit', -8, true], ['r15w12', 'sparkle', -11]],
 endA: 'r16',
};
// ---------- custom scenes ----------
const ICON = {
 globe: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.9 2.8 16.1 0 19M12 2.5c-2.8 2.9-2.8 16.1 0 19"/></svg>',
 pin: '<svg width="60" height="60" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
 wa: '<svg width="64" height="64" viewBox="0 0 24 24"><path fill="#fff" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2z"/></svg>',
 cal: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 pad: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M7 8h10a5 5 0 0 1 4.6 7l-.6 1.4a2.5 2.5 0 0 1-4.2.6L15 15H9l-1.8 2a2.5 2.5 0 0 1-4.2-.6L2.4 15A5 5 0 0 1 7 8z"/><path d="M7 10.5v3M5.5 12h3"/><circle cx="16" cy="11" r=".9" fill="#fff"/><circle cx="17.8" cy="13" r=".9" fill="#fff"/></svg>',
 check: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 ret: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/></svg>',
 gift: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="9" width="18" height="4" rx="1"/><rect x="5" y="13" width="14" height="8" rx="1"/><path d="M12 9v12M12 9c-1.5-3.5-6-4-6-1.5S10 9 12 9zm0 0c1.5-3.5 6-4 6-1.5S14 9 12 9z"/></svg>',
 msg: '<svg width="44" height="44" viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.5 3 2.5 6.8 2.5 11.4c0 2.6 1.3 4.9 3.4 6.4V21l3.1-1.7c.9.3 1.9.4 3 .4 5.5 0 9.5-3.8 9.5-8.3S17.5 3 12 3zm1 11.2-2.4-2.6-4.7 2.6 5.2-5.5 2.5 2.6 4.6-2.6z"/></svg>',
 share: '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>',
};
function el(html, parent = 'cust1') { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; $(parent).appendChild(e); return e }
let C = {};
const ticket = (big, small) => `<div class="tix"><div class="tl">${ICON.gift}</div><div class="tr"><div class="tb">${big}</div><div class="ts">${small}</div></div></div>`;
DATA.build = function () {
 const st = document.createElement('style'); st.textContent = `
  .tix{position:absolute;display:flex;align-items:stretch;border-radius:26px;overflow:hidden;background:linear-gradient(120deg,#ffd76a,#ffb21f 55%,#ff8a00);box-shadow:0 0 70px rgba(255,180,40,.55),0 24px 60px rgba(0,0,0,.55)}
  .tix .tl{display:flex;align-items:center;justify-content:center;background:rgba(120,50,0,.22);border-right:6px dashed rgba(90,40,0,.45)}
  .tix .tr{display:flex;flex-direction:column;justify-content:center}
  .tix .tb{font-family:Anton;color:#2a1200;line-height:1.05;letter-spacing:2px;white-space:nowrap}.tix .ts{font-weight:800;color:#3b1d00;white-space:nowrap}
  .phone{position:absolute;border-radius:58px;background:#050b1c;border:10px solid #1c2a52;box-shadow:0 0 0 2px rgba(120,170,255,.35),0 40px 90px rgba(0,0,0,.6),0 0 70px rgba(47,124,246,.3);overflow:hidden}
  .phone .ph{position:absolute;left:0;top:0;width:100%;display:flex;align-items:center;gap:16px;background:#0f1d42;border-bottom:1px solid rgba(120,170,255,.25)}
  .phone .av{border-radius:50%;background:linear-gradient(145deg,#6a8cff,#3b5bdb);display:flex;align-items:center;justify-content:center;font-family:Montserrat;font-weight:900}
  .phone .body{position:absolute;left:0;width:100%;bottom:0;background:linear-gradient(180deg,#0a1636,#081129);display:flex;flex-direction:column;justify-content:flex-end;gap:14px}
  .bub{padding:14px 22px;max-width:84%;border-radius:22px;font-weight:700;line-height:1.3;box-shadow:0 6px 16px rgba(0,0,0,.35)}
  .bub.o{align-self:flex-end;background:linear-gradient(180deg,#3d8bff,#1f66e0);border-bottom-right-radius:6px}
  .bub.i{align-self:flex-start;background:#eef3ff;color:#0b1d4f;border-bottom-left-radius:6px}
  .bub.lk{background:#fff;color:#0b1d4f;padding:0!important;overflow:hidden}
  .lk .lt{display:flex;align-items:center;gap:12px;background:linear-gradient(145deg,#1d4fd8,#0b2a7a)}
  .lk .lt{padding:14px 18px}.lk .lb{padding:12px 20px 16px}.lk .lt img{height:46px}.lk .lt img+img{height:auto;width:210px}.lk .lu{font-family:Inter;font-weight:700;color:#1f66e0;font-size:.74em;word-break:break-all}.lk .ld{color:#45506b;font-weight:600}
  .dots{display:flex;gap:8px}.dots i{width:14px;height:14px;border-radius:50%;background:#7f8db0;display:block}
  .app{position:absolute;display:flex;align-items:center;gap:18px;padding:14px 30px 14px 16px;border-radius:50px;background:rgba(6,14,40,.92);border:2px solid #4d94ff;font-weight:800;box-shadow:0 10px 30px rgba(0,0,0,.45)}
  .app .ai{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .tag{position:absolute;font-weight:800;color:#06321a;background:linear-gradient(180deg,#9cf7bd,#2fcf6c);border-radius:40px;padding:10px 30px;box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 40px rgba(47,207,108,.45);white-space:nowrap}
  .node{position:absolute;display:flex;flex-direction:column;align-items:center;gap:14px}
  .node .c{border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(8,18,48,.9);border:4px solid rgba(110,165,255,.45)}
  .node .c.on{background:linear-gradient(145deg,#4aa0ff,#1f5fd6);border-color:#bfe0ff;box-shadow:0 0 50px rgba(77,148,255,.8)}
  .node .nl{font-weight:800;white-space:nowrap;text-align:center}
  .rl{position:absolute;height:8px;border-radius:4px;background:rgba(110,165,255,.25);overflow:hidden}.rl i{display:block;height:100%;background:linear-gradient(90deg,#4aa0ff,#9fd0ff)}
  .info{position:absolute;display:flex;gap:24px;align-items:center;padding:26px 32px;border-radius:26px;background:rgba(8,18,48,.92);border:2px solid rgba(110,165,255,.6);box-shadow:0 0 40px rgba(47,124,246,.25),0 20px 50px rgba(0,0,0,.5)}
  .info .ic{width:104px;height:104px;flex:none;border-radius:26px;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#4aa0ff,#1f5fd6)}
  .info .a{font-weight:800;line-height:1.2}.info .b{font-weight:700;color:#cfe0ff;line-height:1.25}`;
 document.head.appendChild(st);
 // intro
 C.k1 = el(`<div class="abs kin hide">REFER A FRIEND</div>`); C.k1b = el(`<div class="abs kinB hide">বন্ধু আনুন — ছাড় নিন!</div>`);
 C.km = el(`<img class="abs hide" src="ss/m4.svg">`);
 C.stamp = el(ticket('20% OFF', 'আপনার জন্য · এক স্লটে'));
 // phone
 C.phone = el(`<div class="phone hide"><div class="ph"><div class="av">B</div><div><div class="pn" style="font-weight:800">বন্ধু</div><div class="po" style="color:#8fb0e8;font-weight:600">online</div></div></div><div class="body"></div></div>`);
 const body = C.phone.querySelector('.body');
 const add = h => { const d = document.createElement('div'); d.innerHTML = h.trim(); const e = d.firstChild; body.appendChild(e); return e };
 C.m1 = add(`<div class="bub o">চল চ্যাম্পিয়নে খেলি! আমার লিংক দিয়ে বুক কর</div>`);
 C.m2 = add(`<div class="bub o lk"><div class="lt"><img src="../inv/brand/icon_white.png"><img src="../inv/brand/wordmark_clean.png"></div><div class="lb"><div class="lu">champion.gemten.com.bd/r/YOURCODE</div><div class="ld">PLAY + CONNECT + WIN</div></div></div>`);
 C.typ = add(`<div class="bub i"><div class="dots"><i></i><i></i><i></i></div></div>`);
 C.m3 = add(`<div class="bub i">বুক করে ফেললাম! দেখা হবে চ্যাম্পিয়নে</div>`);
 C.apps = [['WhatsApp', ICON.wa.replace(/64/g, 38), '#1fbf5c'], ['Messenger', ICON.msg, '#7b5cff'], ['যেখানে খুশি', ICON.share, '#2f7cf6']].map(([n, ic, bg]) => el(`<div class="app hide"><div class="ai" style="background:${bg}">${ic}</div><div>${n}</div></div>`));
 C.tag = el(`<div class="tag hide">✓ আপনার রেফার করা বন্ধু</div>`);
 // reward track
 C.track = el(`<div class="abs hide" style="left:0;top:0;width:100%;height:100%"></div>`);
 C.nodes = [['cal', 'বুকিং'], ['pad', 'প্রথম সেশন'], ['check', 'চেক আউট']].map(([ic, l]) => { const d = document.createElement('div'); d.className = 'node'; d.innerHTML = `<div class="c">${ICON[ic]}</div><div class="nl">${l}</div>`; C.track.appendChild(d); return d });
 C.rails = [0, 1].map(() => { const d = document.createElement('div'); d.className = 'rl'; d.innerHTML = '<i></i>'; C.track.appendChild(d); return d });
 C.tix = el(ticket('20% OFF', 'এক স্লটে · আপনার রিওয়ার্ড'));
 C.iA = el(`<div class="info hide"><div class="ic">${ICON.cal}</div><div><div class="a">পরের বুকিংয়েই ছাড়</div><div class="b">রিওয়ার্ড কাজে লাগবে সেখানেই</div></div></div>`);
 C.iB = el(`<div class="info hide"><div class="ic" style="background:linear-gradient(145deg,#3ee07a,#14a34a)">${ICON.ret}</div><div><div class="a">বুকিং বাতিল হলে?</div><div class="b">রিওয়ার্ড আবার ফেরত আসবে</div></div></div>`);
 // r10 fan
 C.scrim = el(`<div class="abs full hide" style="background:rgba(3,8,24,.8)"></div>`);
 C.fan = [0, 1, 2].map(() => el(ticket('20% OFF', 'রিওয়ার্ড')));
 C.k10 = el(`<div class="abs kinB hide">যত বন্ধু, তত ছাড়!</div>`);
 // outro
 C.ow = ['SHARE', 'PLAY', 'SAVE'].map(w => el(`<div class="abs kin hide">${w}</div>`));
 C.ob = el(`<div class="abs kinB hide">আজই লিংক শেয়ার করুন</div>`);
 C.om = el(`<img class="abs hide" src="ss/m4.svg">`);
 // end cards
 const card2 = (id, ic, k, v, cls = '', vc = '') => el(`<div id="${id}" class="card2 ${cls} hide"><div class="ic">${ICON[ic]}</div><div><div class="k">${k}</div><div class="v ${vc}">${v}</div></div></div>`, 'cust2');
 C.cU = card2('cU', 'globe', 'আপনার রেফার লিংক পাবেন', 'champion.gemten.com.bd', '', 'u'); C.cA = card2('cA', 'pin', 'ঠিকানা', 'রানীর বাজার, IFIC ব্যাংক বিল্ডিং<br>৪র্থ তলা, কুমিল্লা'); C.cW = card2('cW', 'wa', 'হোয়াটসঅ্যাপ', '01603-754074', 'wa', 'n');
 C.em = el(`<img class="abs hide" src="ss/m1.svg">`, 'cust2');
 C.fin = el(`<div id="fin" class="abs hide" style="left:0;width:100%"><img id="finI" src="../inv/brand/icon_white.png"><img id="finW" src="../inv/brand/wordmark_clean.png"><div id="finB">REFER A FRIEND · PLAY + CONNECT + WIN</div>
   <div class="fr"><div class="i">${ICON.globe.replace(/64/g, 26)}</div>champion.gemten.com.bd</div><div class="fr wa"><div class="i">${ICON.wa.replace(/64/g, 26)}</div>WhatsApp: 01603-754074</div>
   <div class="fr"><div class="i">${ICON.pin.replace(/60/g, 26)}</div>রানীর বাজার, IFIC ব্যাংক বিল্ডিং, ৪র্থ তলা, কুমিল্লা</div></div>`, 'cust2');
 const tixSize = (e, w, h, fb, fs) => { pos(e, { width: w + 'px', height: h + 'px' }); pos(e.querySelector('.tl'), { width: h * .85 }); e.querySelector('.tl svg').setAttribute('width', h * .45); e.querySelector('.tl svg').setAttribute('height', h * .45);
   pos(e.querySelector('.tr'), { padding: `0 ${h * .2}px` }); e.querySelector('.tb').style.fontSize = fb + 'px'; e.querySelector('.ts').style.fontSize = fs + 'px' };
 const node = (d, x, y, s, fs) => { pos(d, { left: x - 150, top: y - s / 2, width: 300 }); pos(d.querySelector('.c'), { width: s, height: s }); d.querySelector('.nl').style.fontSize = fs + 'px' };
 if (!V) {
  pos(C.k1, { left: 0, width: 1920, top: 210, fontSize: '120px' }); pos(C.k1b, { left: 0, width: 1920, top: 380, fontSize: '64px' }); pos(C.km, { left: 1460, top: 560, width: 300 });
  tixSize(C.stamp, 760, 250, 108, 34); pos(C.stamp, { left: 580, top: 520 });
  pos(C.phone, { left: 700, top: 160, width: 520, height: 820 }); pos(C.phone.querySelector('.ph'), { height: 110, padding: '0 26px', fontSize: '30px' }); pos(C.phone.querySelector('.av'), { width: 64, height: 64, fontSize: '28px' });
  pos(C.phone.querySelector('.body'), { top: 110, padding: '24px 22px' }); body.style.fontSize = '30px';
  C.apps.forEach((a, i) => { pos(a, { left: 1310, top: 330 + i * 130, fontSize: '38px' }) }); pos(C.tag, { left: 1240, top: 720, fontSize: '40px' });
  node(C.nodes[0], 560, 360, 160, 40); node(C.nodes[1], 960, 360, 160, 40); node(C.nodes[2], 1360, 360, 160, 40);
  pos(C.rails[0], { left: 660, top: 356, width: 200 }); pos(C.rails[1], { left: 1060, top: 356, width: 200 });
  tixSize(C.tix, 720, 230, 100, 32);
  pos(C.iA, { left: 250, top: 640, width: 680 }); pos(C.iB, { left: 990, top: 640, width: 680 }); for (const e of [C.iA, C.iB]) { e.querySelector('.a').style.fontSize = '44px'; e.querySelector('.b').style.fontSize = '32px' }
  C.fan.forEach(f => tixSize(f, 520, 170, 72, 24)); pos(C.k10, { left: 0, width: 1920, top: 700, fontSize: '96px' });
  C.ow.forEach((w, i) => pos(w, { left: 0, width: 640, top: 330, fontSize: '120px' })); pos(C.ob, { left: 0, width: 1920, top: 560, fontSize: '64px' }); pos(C.om, { left: 820, top: 660, width: 280 });
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 310, top: 640, width: 1300 }); pos(C.em, { left: 1640, top: 600, width: 230 });
  pos(C.fin, { top: 140 }); $('finI').style.height = '130px'; $('finW').style.width = '600px'; $('finB').style.fontSize = '52px'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '34px');
 } else {
  pos(C.k1, { left: 0, width: 1080, top: 400, fontSize: '100px', whiteSpace: 'normal', lineHeight: '1.05' }); C.k1.innerHTML = 'REFER A<br>FRIEND'; pos(C.k1b, { left: 0, width: 1080, top: 660, fontSize: '60px' }); pos(C.km, { left: 380, top: 1180, width: 320 });
  tixSize(C.stamp, 860, 260, 112, 36); pos(C.stamp, { left: 110, top: 820 });
  pos(C.phone, { left: 230, top: 360, width: 620, height: 1060 }); pos(C.phone.querySelector('.ph'), { height: 130, padding: '0 30px', fontSize: '36px' }); pos(C.phone.querySelector('.av'), { width: 76, height: 76, fontSize: '34px' });
  pos(C.phone.querySelector('.body'), { top: 130, padding: '28px 26px' }); body.style.fontSize = '36px';
  C.apps.forEach((a, i) => { pos(a, { left: 0, top: 1610, fontSize: '34px', padding: '10px 24px 10px 12px' }); pos(a.querySelector('.ai'), { width: 54, height: 54 }) }); pos(C.tag, { left: 0, top: 1610, fontSize: '42px' });
  node(C.nodes[0], 200, 520, 150, 40); node(C.nodes[1], 540, 520, 150, 40); node(C.nodes[2], 880, 520, 150, 40);
  pos(C.rails[0], { left: 290, top: 516, width: 160 }); pos(C.rails[1], { left: 630, top: 516, width: 160 });
  tixSize(C.tix, 860, 250, 108, 36);
  pos(C.iA, { left: 60, top: 860, width: 960 }); pos(C.iB, { left: 60, top: 1120, width: 960 }); for (const e of [C.iA, C.iB]) { e.querySelector('.a').style.fontSize = '50px'; e.querySelector('.b').style.fontSize = '36px' }
  C.fan.forEach(f => tixSize(f, 560, 180, 76, 26)); pos(C.k10, { left: 0, width: 1080, top: 1060, fontSize: '92px' });
  C.ow.forEach((w, i) => pos(w, { left: 0, width: 1080, top: 380 + i * 190, fontSize: '150px' })); pos(C.ob, { left: 0, width: 1080, top: 960, fontSize: '60px' }); pos(C.om, { left: 390, top: 1080, width: 300 });
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 40, top: 1180, width: 1000 }); pos(C.em, { left: 400, top: 700, width: 280 });
  pos(C.fin, { top: 300 }); $('finI').style.height = '130px'; $('finW').style.width = '560px'; $('finB').style.fontSize = '44px'; $('finB').style.whiteSpace = 'normal'; $('finB').style.width = '900px'; $('finB').style.textAlign = 'center'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '30px');
 }
};
function slam(e, t, a, b, s0 = 1.6, rot = 0) { const v = vis(t, a, b, .01, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .4)); e.style.opacity = Math.min(1, P(t, a, a + .1)) * v; e.style.transform = `scale(${s0 - (s0 - 1) * k}) rotate(${rot}deg)`; return v }
function pop(e, t, a, b, dy = 40) { const v = vis(t, a, b, .2, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .45)); e.style.opacity = v; e.style.transform = `translateY(${(1 - k) * dy}px) scale(${.85 + .15 * k})`; return v }
const W2 = () => V ? 1080 : 1920;
DATA.render = function (t) {
 let fl = 0;
 logo(t, 0, S('r1') - .15, 470, 860); fl = Math.max(fl, vis(t, 0, .3, .01, .29) * .8);
 // intro r1–r2
 { const a = S('r1') - .15, b = S('r3') - .55; slam(C.k1, t, a, b, 1.5); slam(C.k1b, t, a + .5, T('r2w6'), 1.3);
   const vm = vis(t, a + .3, b, .2, .3); show(C.km, vm > 0); if (vm) { const k = eback(P(t, a + .3, a + .8)); C.km.style.opacity = vm; C.km.style.transform = `translateY(${(1 - k) * 200 + Math.abs(Math.sin(t * 3)) * -20}px)` }
   const ts = T('r1w9') - .1; if (slam(C.stamp, t, ts, T('r2w6'), 2.2, -5)) { if (P(t, ts, ts + .15) < 1) fl = Math.max(fl, .3) }
   if (V) { /* in vertical the mascot sits under the chips area once the stamp leaves */ } }
 // phone r5–r6
 { const a = S('r5') - .5, b = S('r7') - .7, v = vis(t, a, b, .3, .3); show(C.phone, v > 0);
   if (v) { C.phone.style.opacity = v; C.phone.style.transform = `translateY(${(1 - eo(P(t, a, a + .6))) * 120}px)`;
     const msg = (e, ta, tb = 1e9) => { const on = t >= ta && t < tb; e.style.display = on ? '' : 'none'; if (on) { const k = eback(P(t, ta, ta + .35)); e.style.opacity = P(t, ta, ta + .12); e.style.transform = `scale(${.7 + .3 * k})`; e.style.transformOrigin = e.classList.contains('o') ? '100% 100%' : '0 100%' } };
     msg(C.m1, T('r5w3')); msg(C.m2, T('r5w5')); msg(C.typ, S('r6') - .1, T('r6w6')); msg(C.m3, T('r6w6'));
     C.typ.querySelectorAll('i').forEach((d, i) => d.style.opacity = .4 + .6 * Math.abs(Math.sin(t * 6 - i * .7))) }
   C.apps.forEach((ap, i) => { const ta = T('r5w' + (7 + i)) - .1; const vv = V ? pop(ap, t, ta, (i < 2 ? T('r5w' + (8 + i)) - .05 : E('r5') + .3), 30) : pop(ap, t, ta, b, 30); if (vv && V) ap.style.left = (540 - ap.offsetWidth / 2) + 'px' });
   if (pop(C.tag, t, T('r6w8') - .05, b, 30) && V) C.tag.style.left = (540 - C.tag.offsetWidth / 2) + 'px' }
 // reward r7–r8
 { const a = S('r7') - .5, b = S('r8') + .1, v = vis(t, a, b, .3, .35); show(C.track, v > 0);
   if (v) { C.track.style.opacity = v; const on = [S('r7') - .2, T('r7w5'), T('r7w9')];
     C.nodes.forEach((n, i) => { const k = eback(P(t, a + i * .12, a + i * .12 + .5)); n.style.opacity = P(t, a + i * .12, a + i * .12 + .2); n.style.transform = `translateY(${(1 - k) * 60}px) scale(${t >= on[i] && t < on[i] + .3 ? 1.12 : 1})`;
       n.querySelector('.c').classList.toggle('on', t >= on[i]) });
     C.rails.forEach((r, i) => r.firstChild.style.width = (100 * eo(P(t, on[i + 1] - .45, on[i + 1]))) + '%') }
   const ta = T('r7w15') - .1, te = E('r8') + .4, vt = vis(t, ta, te, .01, .3); show(C.tix, vt > 0);
   if (vt) { const k = eback(P(t, ta, ta + .45)); const mv = eio(P(t, S('r8') - .1, S('r8') + .5));
     const W = V ? 860 : 720, H = V ? 250 : 230; const y0 = V ? 820 : 600, y1 = V ? 480 : 300; const sc0 = 1, sc1 = V ? .85 : .8;
     const sc = (sc0 + (sc1 - sc0) * mv) * (2.0 - 1.0 * k); C.tix.style.left = (W2() / 2 - W / 2) + 'px'; C.tix.style.top = (y0 + (y1 - y0) * mv) + 'px';
     C.tix.style.opacity = Math.min(1, P(t, ta, ta + .1)) * vt; C.tix.style.transform = `scale(${sc}) rotate(${-3 + 3 * mv}deg)`; if (P(t, ta, ta + .15) < 1) fl = Math.max(fl, .35) }
   pop(C.iA, t, T('r8w3') - .1, te, 40); const vb = pop(C.iB, t, T('r8w9') - .1, te, 40);
   if (vb) { const ic = C.iB.querySelector('svg'); const p = P(t, T('r8w13') - .1, T('r8w13') + .6); ic.style.transform = `rotate(${-360 * eio(p)}deg)`; C.iB.style.borderColor = p > 0 && p < 1 ? '#5af59a' : ''; C.iB.style.boxShadow = p > 0 && p < 1 ? '0 0 60px rgba(47,207,108,.6)' : '' } }
 // r10 fan
 { const a = S('r10') - .3, b = E('r10') + .35, v = vis(t, a, b, .3, .3); show(C.scrim, v > 0); if (v) C.scrim.style.opacity = v;
   C.fan.forEach((f, i) => { const ta = T(['r10w0', 'r10w4', 'r10w6'][i]) - .1; const vv = vis(t, ta, b, .01, .3); show(f, vv > 0); if (!vv) return; const k = eback(P(t, ta, ta + .45));
     const W = V ? 560 : 520, cx = W2() / 2 - W / 2 + (i - 1) * (V ? 150 : 260), cy = (V ? 640 : 330) + Math.abs(i - 1) * 40; f.style.left = cx + 'px'; f.style.top = cy + 'px'; f.style.opacity = Math.min(1, P(t, ta, ta + .1)) * vv;
     f.style.transform = `scale(${1.8 - .8 * k}) rotate(${(i - 1) * 9}deg)`; f.style.zIndex = i === 1 ? 3 : 1 });
   slam(C.k10, t, T('r10w6') - .1, b, 1.5) }
 // outro r15
 { const a = S('r15') - .3, b = S('r16') - .3;
   C.ow.forEach((w, i) => { const ta = T(['r15w6', 'r15w10', 'r15w12'][i]) - .1; if (!V) w.style.left = (320 + i * 640 - 320) + 'px'; slam(w, t, ta, b, 1.8) });
   slam(C.ob, t, T('r15w4') - .1, b, 1.3);
   const v = vis(t, a, b, .3, .3); show(C.om, v > 0); if (v) { const k = eback(P(t, a, a + .5)); C.om.style.opacity = v; C.om.style.transform = `translateY(${(1 - k) * 200 + Math.abs(Math.sin(t * 3.2)) * -24}px)` } }
 // end cards
 const cd = (e, a, b) => { const v = vis(t, a, b, .3, .25); show(e, v > 0); if (v) { e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(P(t, a, a + .4))) * 60}px)` } return v };
 cd(C.cU, S('r16') - .15, S('q5') - .2); cd(C.cA, S('q5') - .15, S('q7') - .2); cd(C.cW, S('q7') - .15, S('q8') - .3);
 { const v = vis(t, S('r16') - .2, S('q8') - .3, .3, .3); show(C.em, v > 0); if (v) { C.em.style.opacity = v; C.em.style.transform = `translateY(${Math.sin(t * 2.4) * 10}px) rotate(${Math.sin(t * 1.8) * 3}deg)` } }
 { const a = S('q8') - .3, o = t >= a; show(C.fin, o); if (o) { C.fin.style.opacity = P(t, a, a + .4); $('finB').style.transform = `scale(${1.3 - .3 * eback(P(t, a + .2, a + .6))})`;
   C.fin.querySelectorAll('.fr').forEach((e, i) => { const v = P(t, a + .5 + i * .25, a + .85 + i * .25); e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(v)) * 30}px)` }) } fl = Math.max(fl, vis(t, a, a + .3, .01, .29) * .6) }
 return fl;
};
