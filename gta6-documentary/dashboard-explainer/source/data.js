// Champion Dashboard explainer — scene data
const DATA = {
 imgs: { ov1: {}, ov2: {}, ov3: {}, ov4: {}, ov5: {}, book1: {}, book2: {}, mybk: {}, bkd1: {}, bkd2: {}, rw1: {}, rw2: {}, price1: {}, price4: {}, price5: {},
   myteams: {}, dtour: {}, live: {}, tickets: {}, contact: {}, know: {}, billing: {}, activity: {}, notif: {}, pset2: {}, pset3: {} },
 sections: [
  { a: 'd2-0.8', b: 'd7-0.9', num: '01', title: 'OVERVIEW', bn: 'এক নজরে সবকিছু', mascot: 'm1' },
  { a: 'd7-0.9', b: 'd10-0.9', num: '02', title: 'BOOK A SLOT', bn: 'কয়েক ধাপে বুকিং', mascot: 'm3' },
  { a: 'd10-0.9', b: 'd13-0.9', num: '03', title: 'MY BOOKINGS', bn: 'কোড · QR · স্লিপ', mascot: 'm0' },
  { a: 'd13-0.9', b: 'd16-0.9', num: '04', title: 'REWARDS & POINTS', bn: 'মেম্বার কার্ড · লেভেল · রেফার', mascot: 'm4' },
  { a: 'd16-0.9', b: 'd18-0.9', num: '05', title: 'PRICES & OFFERS', bn: 'প্যাক আর অফার', mascot: 'm1' },
  { a: 'd18-0.9', b: 'd19-0.9', num: '06', title: 'TEAMS & TOURNAMENTS', bn: 'আপনার টিম, আপনার রেকর্ড', mascot: 'm4' },
  { a: 'd19-0.9', b: 'd22-0.8', num: '07', title: 'SUPPORT', bn: 'লাইভ চ্যাট · টিকিট · কন্টাক্ট', mascot: 'm1' },
  { a: 'd22-0.8', b: 'd23-0.8', num: '08', title: 'KNOWLEDGE', bn: 'নিয়ম আর পলিসি', mascot: 'm2' },
  { a: 'd23-0.8', b: 'd24e+0.6', num: '09', title: 'MY ACCOUNT', bn: 'বিলিং · লগ · নোটিফিকেশন · সেটিংস', mascot: 'm0' },
 ],
 kf: [
  { t: 'd1w9-0.4', img: 'ov1', url: '/my', r: [0, 0, 1568, 559, 1], rv: [0, 40, 880, 520] },
  { t: 'd2-0.2', img: 'ov1', url: '/my', r: [220, 60, 660, 320], rv: [220, 60, 660, 330] },
  { t: 'd3-0.2', img: 'ov1', url: '/my', r: [880, 150, 655, 400], rv: [880, 150, 655, 400] },
  { t: 'd4-0.3', img: 'ov2', url: '/my', r: [226, 118, 1306, 190], rv: [226, 118, 700, 190] },
  { t: 'd4w8', img: 'ov2', url: '/my', r: [226, 118, 1306, 190], rv: [830, 118, 700, 190] },
  { t: 'd5-0.3', img: 'ov3', url: '/my', r: [226, 40, 1306, 290], rv: [226, 40, 700, 300] },
  { t: 'd5w4', img: 'ov3', url: '/my', r: [226, 340, 1306, 160], rv: [830, 340, 700, 160] },
  { t: 'd6-0.3', img: 'ov4', url: '/my', r: [226, 66, 1306, 292], rv: [226, 66, 660, 292] },
  { t: 'd6w8', img: 'ov5', url: '/my', r: [226, 340, 868, 175], rv: [226, 340, 700, 175] },
  { t: 'd7-0.9', img: 'book1', url: '/my/book', r: [580, 90, 600, 470], rv: [580, 90, 600, 470] },
  { t: 'd7w6', img: 'book1', url: '/my/book', r: [596, 205, 562, 140], rv: [596, 200, 562, 150] },
  { t: 'd8-0.2', img: 'book2', url: '/my/book', r: [596, 200, 562, 310], rv: [596, 200, 562, 310] },
  { t: 'd10-0.9', img: 'mybk', url: '/my/bookings', r: [220, 55, 665, 150], rv: [220, 55, 665, 150] },
  { t: 'd10w5-0.2', img: 'mybk', url: '/my/bookings', r: [880, 55, 665, 100], rv: [880, 55, 665, 100] },
  { t: 'd11-0.3', img: 'bkd1', url: '/my/bookings/15', r: [615, 95, 525, 460], rv: [615, 95, 525, 460] },
  { t: 'd12-0.3', img: 'bkd2', url: '/my/bookings/15', r: [615, 210, 525, 275], rv: [615, 200, 525, 290] },
  { t: 'd13-0.9', img: 'rw1', url: '/my/rewards', r: [220, 120, 790, 190], rv: [220, 120, 790, 190] },
  { t: 'd14w4-0.2', img: 'rw1', url: '/my/rewards', r: [1010, 120, 525, 190], rv: [1010, 120, 525, 190] },
  { t: 'd14w8', img: 'rw2', url: '/my/rewards', r: [880, 128, 655, 145], rv: [880, 128, 655, 145] },
  { t: 'd15-0.2', img: 'rw2', url: '/my/rewards', r: [880, 275, 655, 210], rv: [880, 275, 655, 210] },
  { t: 'd16-0.9', img: 'price1', url: '/my/offers', r: [220, 330, 700, 230], rv: [220, 330, 660, 230] },
  { t: 'd16w7', img: 'price1', url: '/my/offers', r: [220, 130, 1315, 190], rv: [220, 130, 700, 190] },
  { t: 'd17-0.2', img: 'price4', url: '/my/offers', r: [220, 85, 1315, 425], rv: [220, 150, 880, 360] },
  { t: 'd17w12', img: 'price5', url: '/my/offers', r: [220, 140, 880, 145], rv: [220, 140, 880, 145] },
  { t: 'd18-0.9', img: 'myteams', url: '/my/teams', r: [220, 60, 1325, 320], rv: [880, 60, 665, 320] },
  { t: 'd18w3-0.2', img: 'dtour', url: '/my/tournaments', r: [220, 60, 900, 200], rv: [220, 60, 700, 200] },
  { t: 'd19-0.9', img: 'live', url: '/my/support', r: [220, 70, 860, 300], rv: [220, 70, 700, 300] },
  { t: 'd20-0.3', img: 'tickets', url: '/my/tickets', r: [220, 60, 700, 120], rv: [220, 60, 600, 200] },
  { t: 'd20w5', img: 'tickets', url: '/my/tickets', r: [900, 55, 645, 120], rv: [1000, 55, 545, 200] },
  { t: 'd21-0.3', img: 'contact', url: '/my/contact', r: [220, 165, 1060, 250], rv: [220, 165, 1060, 250] },
  { t: 'd22-0.8', img: 'know', url: '/my/knowledge', r: [220, 120, 880, 430], rv: [220, 120, 700, 430] },
  { t: 'd23-0.8', img: 'billing', url: '/my/billing', r: [480, 60, 800, 330], rv: [480, 60, 800, 330] },
  { t: 'd23w4-0.2', img: 'activity', url: '/my/activity', r: [220, 60, 1325, 215], rv: [220, 60, 760, 215] },
  { t: 'd23w10-0.2', img: 'notif', url: '/my/notifications', r: [580, 65, 605, 255], rv: [580, 65, 605, 255] },
  { t: 'd24-0.3', img: 'pset2', url: '/my/profile', r: [620, 120, 515, 360], rv: [620, 120, 515, 360] },
  { t: 'd24w12', img: 'pset3', url: '/my/profile', r: [610, 130, 540, 185], rv: [610, 130, 540, 185] },
 ],
 hl: [
  { a: 'd2w3-0.2', b: 'd2w5-0.2', img: 'ov1', r: [229, 150, 640, 222], label: 'মেম্বার কার্ড', below: true },
  { a: 'd2w5-0.2', b: 'd2w8-0.2', img: 'ov1', r: [242, 172, 64, 70], label: 'মেম্বারশিপ লেভেল' },
  { a: 'd2w8-0.2', b: 'd2e+0.3', img: 'ov1', r: [243, 246, 612, 44], label: 'গোল্ডের পথে কতটা বাকি' },
  { a: 'd3w4-0.1', b: 'd3w6-0.1', img: 'ov1', r: [936, 231, 127, 42], label: 'স্টেশন' },
  { a: 'd3w6-0.1', b: 'd3w8-0.1', img: 'ov1', r: [936, 286, 54, 59], label: 'দিন' },
  { a: 'd3w8-0.1', b: 'd3w10-0.1', img: 'ov1', r: [994, 301, 88, 44], label: 'সময়' },
  { a: 'd3w10-0.1', b: 'd3e+0.3', img: 'ov1', r: [936, 377, 144, 95], label: 'লাইভ কাউন্টডাউন' },
  { a: 'd4w2-0.1', b: 'd4w8-0.2', img: 'ov2', r: [266, 176, 1226, 74], label: 'প্রতি সেশনে একটা স্ট্যাম্প' },
  { a: 'd4w8', b: 'd4e+0.3', img: 'ov2', r: [1414, 174, 76, 76], label: 'পূর্ণ হলেই বিশেষ ছাড়' },
  { a: 'd5w4', b: 'd5e+0.3', img: 'ov3', r: [1326, 360, 187, 41], label: 'কমিউনিটিতে যান' },
  { a: 'd6w1', b: 'd6w8-0.2', img: 'ov4', r: [244, 190, 1270, 160], label: 'কোন স্টেশন কখন খোলা' },
  { a: 'd6w9', b: 'd6e+0.3', img: 'ov5', r: [240, 395, 840, 112], label: 'আপনার জন্য অফার' },
  { a: 'd7w6', b: 'd7e+0.3', img: 'book1', r: [618, 258, 460, 60], label: 'দিন বেছে নিন' },
  { a: 'd8w1-0.2', b: 'd8w4-0.2', img: 'book2', r: [620, 258, 512, 100], label: 'স্টেশন বেছে নিন' },
  { a: 'd8w4-0.2', b: 'd8w7-0.2', img: 'book2', r: [632, 316, 230, 18], label: 'স্ক্রিন · কন্ট্রোলার' },
  { a: 'd8w7-0.2', b: 'd8e+0.3', img: 'book2', r: [632, 342, 110, 18], label: 'কতগুলো স্লট ফাঁকা' },
  { a: 'd10w2', b: 'd10w5-0.1', img: 'mybk', r: [229, 71, 644, 123], label: 'আসন্ন বুকিং', below: true },
  { a: 'd10w5-0.1', b: 'd10e+0.3', img: 'mybk', r: [889, 71, 648, 68], label: 'আগের বুকিং', below: true },
  { a: 'd11w3', b: 'd11w5', img: 'bkd1', r: [637, 487, 94, 26], label: 'বুকিং কোড' },
  { a: 'd11w5', b: 'd11e+0.3', img: 'bkd1', r: [1030, 384, 90, 90], label: 'QR কোড' },
  { a: 'd12w0-0.1', b: 'd12w6', img: 'bkd2', r: [637, 295, 293, 30], label: 'স্লিপ · ক্যালেন্ডার · ম্যাপ' },
  { a: 'd12w6', b: 'd12e+0.3', img: 'bkd2', r: [637, 428, 223, 30], label: 'সময় বদলান বা বাতিল করুন', below: true },
  { a: 'd13w4-0.1', b: 'd13w7-0.1', img: 'rw1', r: [226, 129, 776, 170], label: 'ডিজিটাল মেম্বার কার্ড', below: true },
  { a: 'd13w7-0.1', b: 'd13e+0.3', img: 'rw1', r: [876, 268, 112, 18], label: 'কাউন্টারে দেখান' },
  { a: 'd14w4-0.1', b: 'd14w8-0.1', img: 'rw1', r: [1030, 180, 490, 50], label: 'পয়েন্ট জমছে' },
  { a: 'd14w9', b: 'd14e+0.3', img: 'rw2', r: [886, 135, 643, 130], label: 'গোল্ড লেভেল', below: true },
  { a: 'd15w1', b: 'd15w5', img: 'rw2', r: [898, 296, 140, 32], label: 'Refer a friend' },
  { a: 'd15w5', b: 'd15e+0.3', img: 'rw2', r: [1443, 363, 72, 31], label: 'লিংক কপি করুন' },
  { a: 'd16w3-0.1', b: 'd16w7-0.2', img: 'price1', r: [224, 338, 184, 36], label: 'দামের তালিকা' },
  { a: 'd16w8', b: 'd16e+0.3', img: 'price1', r: [226, 230, 1303, 124], label: 'শুধু আপনার জন্য', below: true },
  { a: 'd17w4-0.1', b: 'd17w6-0.1', img: 'price4', r: [226, 159, 427, 165], label: 'Day Play' },
  { a: 'd17w6-0.1', b: 'd17w8-0.1', img: 'price4', r: [664, 159, 428, 165], label: 'Student Hour' },
  { a: 'd17w8-0.1', b: 'd17w10-0.1', img: 'price4', r: [1102, 159, 428, 165], label: 'Squad Pack' },
  { a: 'd17w10-0.1', b: 'd17w12-0.1', img: 'price4', r: [664, 337, 428, 167], label: 'Full Zone' },
  { a: 'd17w12+0.2', b: 'd17e+0.3', img: 'price5', r: [226, 148, 866, 131], label: 'Hour Bank' },
  { a: 'd18w1-0.1', b: 'd18w3-0.3', img: 'myteams', r: [1435, 78, 105, 30], label: 'Make a team' },
  { a: 'd18w5', b: 'd18w8', img: 'dtour', r: [226, 128, 1312, 80], label: 'টুর্নামেন্টের রেকর্ড', below: true },
  { a: 'd18w8', b: 'd18e+0.3', img: 'dtour', r: [602, 220, 96, 36], label: 'Performance', below: true },
  { a: 'd19w2', b: 'd19e+0.3', img: 'live', r: [527, 148, 248, 30], label: 'চ্যাম্পিয়ন সাপোর্ট' },
  { a: 'd20w6-0.2', b: 'd20e+0.3', img: 'tickets', r: [1446, 83, 94, 29], label: 'New ticket', below: true },
  { a: 'd21w3-0.1', b: 'd21w4-0.1', img: 'contact', r: [226, 175, 201, 117], label: 'হটলাইন' },
  { a: 'd21w4-0.1', b: 'd21w5-0.1', img: 'contact', r: [649, 175, 200, 117], label: 'WhatsApp' },
  { a: 'd21w5-0.1', b: 'd21w6-0.1', img: 'contact', r: [861, 175, 200, 117], label: 'Messenger' },
  { a: 'd21w6-0.1', b: 'd21w8-0.1', img: 'contact', r: [1072, 175, 202, 117], label: 'TikTok' },
  { a: 'd21w8-0.1', b: 'd21e+0.4', img: 'contact', r: [226, 307, 201, 101], label: 'Telegram', below: true },
  { a: 'd22w2-0.1', b: 'd22w4-0.1', img: 'know', r: [233, 134, 196, 59], label: 'বুকিংয়ের নিয়ম' },
  { a: 'd22w4-0.1', b: 'd22w5-0.1', img: 'know', r: [233, 193, 196, 59], label: 'মেম্বারশিপ' },
  { a: 'd22w5-0.1', b: 'd22w7-0.1', img: 'know', r: [233, 252, 196, 57], label: 'পয়েন্ট' },
  { a: 'd22w7-0.1', b: 'd22e+0.3', img: 'know', r: [233, 311, 196, 52], label: 'রেফারেল' },
  { a: 'd23w1', b: 'd23w4-0.3', img: 'billing', r: [490, 112, 784, 22], label: 'সব পেমেন্টের হিসাব', below: true },
  { a: 'd23w6-0.1', b: 'd23w10-0.3', img: 'activity', r: [226, 150, 1312, 112], label: 'প্রতিটা সাইন ইন' },
  { a: 'd23w11-0.1', b: 'd23e+0.3', img: 'notif', r: [600, 120, 560, 60], label: 'বুকিংয়ের আপডেট' },
  { a: 'd24w3-0.1', b: 'd24w7-0.1', img: 'pset2', r: [640, 262, 475, 212], label: 'পছন্দের গেম' },
  { a: 'd24w7-0.1', b: 'd24w12-0.2', img: 'pset2', r: [640, 130, 232, 49], label: 'বার্থডে ট্রিট' },
  { a: 'd24w13', b: 'd24e+0.3', img: 'pset3', r: [621, 141, 516, 163], label: 'কীভাবে মেসেজ পাবেন', below: true },
 ],
 cur: [
  { t: 'd5w6', img: 'ov3', x: 1418, y: 380 },
  { t: 'd7w8', img: 'book1', x: 702, y: 290 },
  { t: 'd8w1', img: 'book2', x: 760, y: 286 },
  { t: 'd12w1', img: 'bkd2', x: 680, y: 310 }, { t: 'd12w4', img: 'bkd2', x: 790, y: 310 }, { t: 'd12w8', img: 'bkd2', x: 700, y: 443 },
  { t: 'd15w6', img: 'rw2', x: 1478, y: 378 },
  { t: 'd18w2', img: 'myteams', x: 1487, y: 93 },
  { t: 'd20w7', img: 'tickets', x: 1493, y: 97 },
  { t: 'd24w4', img: 'pset2', x: 760, y: 330 },
 ],
 badges: [
  { a: 'd9-0.2', b: 'd9e+0.6', arrows: true, items: [{ t: 'd9w0', txt: 'সময় বেছে নিন' }, { t: 'd9w3', txt: 'কনফার্ম ✓' }, { t: 'd9w5', txt: 'খেলার পরে পেমেন্ট' }] },
  { a: 'd20w0-0.1', b: 'd20w6-0.2', items: [{ t: 'd20w0', txt: 'পেমেন্ট' }, { t: 'd20w1', txt: 'বুকিং' }, { t: 'd20w3', txt: 'অভিযোগ' }] },
 ],
 noSub: [], noCap: [],
 winOp(t) { return clamp(Math.min(P(t, T('d1w9') - .6, T('d1w9') - .2), 1 - P(t, E('d24') + .3, E('d24') + .7))) },
 bgOp(t) { return 1 - .45 * Math.max(1 - P(t, S('d1') + .3, T('d1w9') - .2), P(t, S('d25') - .8, S('d25') - .2)) },
 wmOp(t) { return Math.min(P(t, S('d1') - .3, S('d1') + .2), 1 - P(t, S('q8') - .5, S('q8') - .1)) },
};
const ICON = {
 globe: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.9 2.8 16.1 0 19M12 2.5c-2.8 2.9-2.8 16.1 0 19"/></svg>',
 pin: '<svg width="60" height="60" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
 wa: '<svg width="64" height="64" viewBox="0 0 24 24"><path fill="#fff" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2z"/></svg>',
 cal: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 star: '<svg width="70" height="70" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>',
 tag: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.6" fill="#fff"/></svg>',
 head: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="1.5"/><rect x="17" y="13" width="4" height="7" rx="1.5"/></svg>',
};
function el(html, parent = 'cust1') { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; $(parent).appendChild(e); return e }
let C = {};
DATA.build = function () {
 C.k1 = el(`<div class="abs kin hide">MY DASHBOARD</div>`); C.k1b = el(`<div class="abs kinB hide">আপনার নিজের চ্যাম্পিয়ন ড্যাশবোর্ড</div>`);
 C.km = el(`<img class="abs hide" src="ss/m1.svg">`);
 C.one = el(`<div class="abs kin hide">ALL IN ONE</div>`);
 C.tiles = el(`<div class="abs hide" style="display:flex;gap:26px;justify-content:center"></div>`);
 C.tl = [['cal', 'বুকিং'], ['star', 'পয়েন্ট'], ['tag', 'অফার'], ['head', 'সাপোর্ট']].map(([ic, t]) => { const d = document.createElement('div'); d.className = 'card'; d.style.cssText = 'position:relative;display:flex;flex-direction:column;align-items:center;gap:14px;padding:28px 40px';
   d.innerHTML = `<div style="width:120px;height:120px;border-radius:30px;background:linear-gradient(145deg,#4aa0ff,#1f5fd6);display:flex;align-items:center;justify-content:center">${ICON[ic]}</div><div class="tt" style="font-weight:800">${t}</div>`; C.tiles.appendChild(d); return d });
 const card2 = (id, ic, k, v, cls = '', vc = '') => el(`<div id="${id}" class="card2 ${cls} hide"><div class="ic">${ICON[ic]}</div><div><div class="k">${k}</div><div class="v ${vc}">${v}</div></div></div>`, 'cust2');
 C.cU = card2('cU', 'globe', 'আজই অ্যাকাউন্ট খুলুন', 'champion.gemten.com.bd', '', 'u'); C.cA = card2('cA', 'pin', 'ঠিকানা', 'রানীর বাজার, IFIC ব্যাংক বিল্ডিং<br>৪র্থ তলা, কুমিল্লা'); C.cW = card2('cW', 'wa', 'হোয়াটসঅ্যাপ', '01603-754074', 'wa', 'n');
 C.em = el(`<img class="abs hide" src="ss/m4.svg">`, 'cust2');
 C.fin = el(`<div id="fin" class="abs hide" style="left:0;width:100%"><img id="finI" src="../inv/brand/icon_white.png"><img id="finW" src="../inv/brand/wordmark_clean.png"><div id="finB">MY DASHBOARD · PLAY + CONNECT + WIN</div>
   <div class="fr"><div class="i">${ICON.globe.replace(/64/g, 26)}</div>champion.gemten.com.bd</div><div class="fr wa"><div class="i">${ICON.wa.replace(/64/g, 26)}</div>WhatsApp: 01603-754074</div>
   <div class="fr"><div class="i">${ICON.pin.replace(/60/g, 26)}</div>রানীর বাজার, IFIC ব্যাংক বিল্ডিং, ৪র্থ তলা, কুমিল্লা</div></div>`, 'cust2');
 if (!V) {
  pos(C.k1, { left: 0, width: 1920, top: 330, fontSize: '120px' }); pos(C.k1b, { left: 0, width: 1920, top: 510, fontSize: '64px' }); pos(C.km, { left: 830, top: 630, width: 260 });
  pos(C.one, { left: 0, width: 1920, top: 200, fontSize: '110px' }); pos(C.tiles, { left: 0, width: 1920, top: 400 }); C.tl.forEach(d => d.querySelector('.tt').style.fontSize = '52px');
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 310, top: 700, width: 1300 }); pos(C.em, { left: 1640, top: 640, width: 230 });
  pos(C.fin, { top: 140 }); $('finI').style.height = '130px'; $('finW').style.width = '600px'; $('finB').style.fontSize = '56px'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '34px');
 } else {
  pos(C.k1, { left: 0, width: 1080, top: 430, fontSize: '96px', whiteSpace: 'normal', lineHeight: '1.05' }); C.k1.innerHTML = 'MY<br>DASHBOARD'; pos(C.k1b, { left: 40, width: 1000, top: 690, fontSize: '54px' }); pos(C.km, { left: 360, top: 860, width: 360 });
  pos(C.one, { left: 0, width: 1080, top: 300, fontSize: '96px' }); pos(C.tiles, { left: 140, width: 800, top: 450, flexWrap: 'wrap', gap: '30px' }); C.tl.forEach(d => { d.style.width = '380px'; d.querySelector('.tt').style.fontSize = '52px' });
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 40, top: 1180, width: 1000 }); pos(C.em, { left: 400, top: 700, width: 280 });
  pos(C.fin, { top: 300 }); $('finI').style.height = '130px'; $('finW').style.width = '560px'; $('finB').style.fontSize = '44px'; $('finB').style.whiteSpace = 'normal'; $('finB').style.width = '900px'; $('finB').style.textAlign = 'center'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '30px');
 }
};
function slam(e, t, a, b, s0 = 1.6) { const v = vis(t, a, b, .01, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .4)); e.style.opacity = Math.min(1, P(t, a, a + .1)) * v; e.style.transform = `scale(${s0 - (s0 - 1) * k})`; return v }
DATA.render = function (t) {
 let fl = 0;
 logo(t, 0, S('d1') - .15, 470, 860); fl = Math.max(fl, vis(t, 0, .3, .01, .29) * .8);
 { const a = S('d1') - .15, b = T('d1w9') - .5; slam(C.k1, t, a, b, 1.5); slam(C.k1b, t, a + .6, b, 1.3); const v = vis(t, a + .3, b, .2, .3); show(C.km, v > 0); if (v) { const k = eback(P(t, a + .3, a + .8)); C.km.style.opacity = v; C.km.style.transform = `translateY(${(1 - k) * 200 + Math.sin(t * 3) * 8}px)` } }
 // all in one (d25 first half)
 { const a = S('d25') - .5, b = T('d25w9') - .2; slam(C.one, t, a, b, 1.4); const v = vis(t, a + .2, b, .2, .3); show(C.tiles, v > 0); if (v) { C.tiles.style.opacity = v;
   C.tl.forEach((d, i) => { const ti = T(['d25w0', 'd25w1', 'd25w2', 'd25w4'][i]) - .1, k = eback(P(t, ti, ti + .4)); d.style.opacity = P(t, ti, ti + .1); d.style.transform = `scale(${.5 + .5 * k})` }) } }
 const cd = (e, a, b) => { const v = vis(t, a, b, .3, .25); show(e, v > 0); if (v) { e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(P(t, a, a + .4))) * 60}px)` } return v };
 cd(C.cU, T('d25w9') - .15, S('q5') - .2); cd(C.cA, S('q5') - .15, S('q7') - .2); cd(C.cW, S('q7') - .15, S('q8') - .3);
 { const v = vis(t, T('d25w9') - .2, S('q8') - .3, .3, .3); show(C.em, v > 0); if (v) { C.em.style.opacity = v; C.em.style.transform = `translateY(${Math.sin(t * 2.4) * 10}px) rotate(${Math.sin(t * 1.8) * 3}deg)` } }
 { const a = S('q8') - .3, o = t >= a; show(C.fin, o); if (o) { C.fin.style.opacity = P(t, a, a + .4); $('finB').style.transform = `scale(${1.3 - .3 * eback(P(t, a + .2, a + .6))})`;
   C.fin.querySelectorAll('.fr').forEach((e, i) => { const v = P(t, a + .5 + i * .25, a + .85 + i * .25); e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(v)) * 30}px)` }) } fl = Math.max(fl, vis(t, a, a + .3, .01, .29) * .6) }
 return fl;
};
