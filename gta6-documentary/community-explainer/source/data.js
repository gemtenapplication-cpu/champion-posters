// Champion Community explainer — scene data
const BGL = '#f5f8fe';
const DATA = {
 imgs: { hero: { src: 'ss/hero.png', bg: '#07090d' }, feed1: {}, feed2: {}, feed3: {}, post: {}, lb: {}, prof1: {}, prof2: {}, chal: {}, teams: {}, tprof: {},
   tour: {}, org: {}, msgs: {}, chat: {}, chatgg: {}, find: {} },
 sections: [
  { a: 'c2-0.6', b: 'c4-0.7', num: '01', title: 'CHAMPION COMMUNITY', bn: 'খেলোয়াড়দের নিজেদের জায়গা', mascot: 'm0' },
  { a: 'c4-0.7', b: 'c6-0.9', num: '02', title: 'GET STARTED', bn: 'শুরু করুন এক মিনিটে', mascot: null },
  { a: 'c6-0.9', b: 'c9-0.9', num: '03', title: 'FEED', bn: 'পোস্ট · রিঅ্যাকশন · গেম রিকোয়েস্ট', mascot: 'm1' },
  { a: 'c9-0.9', b: 'c24-0.9', num: '04', title: 'LEADERBOARD', bn: 'স্কোর বাড়ান, টপে উঠুন', mascot: 'm3' },
  { a: 'c24-0.9', b: 'c12-0.9', num: '05', title: 'PLAYER PROFILE', bn: 'আপনার গেমিং পরিচয়', mascot: 'm4' },
  { a: 'c12-0.9', b: 'c14-0.9', num: '06', title: 'CHALLENGES', bn: 'যে কাউকে চ্যালেঞ্জ দিন', mascot: 'm0' },
  { a: 'c14-0.9', b: 'c16-0.9', num: '07', title: 'TEAMS', bn: 'নিজের স্কোয়াড বানান', mascot: 'm1' },
  { a: 'c16-0.9', b: 'c18-0.9', num: '08', title: 'TOURNAMENTS', bn: 'বড় স্ক্রিনে, ট্রফির লড়াই', mascot: 'm4' },
  { a: 'c18-0.9', b: 'c19-0.7', num: '09', title: 'CHAT & GROUPS', bn: 'মেসেজ · গ্রুপ · পোল', mascot: 'm2' },
  { a: 'c19-0.7', b: 'c19e+0.6', num: '10', title: 'FIND PLAYERS', bn: 'নতুন বন্ধু খুঁজুন', mascot: 'm1' },
 ],
 kf: [
  { t: 'c2-0.6', img: 'hero', url: '/champion-community', r: [150, 0, 2100, 612, 1], rv: [330, 30, 1100, 560] },
  { t: 'c3-0.2', img: 'hero', url: '/champion-community', r: [330, 380, 820, 180], rv: [330, 320, 760, 280] },
  // feed
  { t: 'c6-0.9', img: 'feed1', url: '/community', r: [0, 0, 1568, 559, 1] , rv: [230, 40, 820, 520] },
  { t: 'c6w2', img: 'feed1', url: '/community', r: [500, 58, 560, 170], rv: [510, 58, 540, 360] },
  { t: 'c6w8-0.2', img: 'feed1', url: '/community', r: [500, 255, 560, 170], rv: [510, 230, 540, 220] },
  { t: 'c7-0.2', img: 'feed1', url: '/community', r: [521, 60, 518, 160], rv: [540, 55, 480, 200] },
  { t: 'c22-0.3', img: 'feed2', url: '/community', r: [500, 115, 560, 185], rv: [510, 110, 540, 200] },
  { t: 'c22w4-0.1', img: 'feed2', url: '/community', r: [500, 300, 560, 215], rv: [510, 300, 540, 215] },
  { t: 'c22w8-0.2', img: 'post', url: '/community/p/8', r: [515, 55, 530, 200], rv: [520, 55, 520, 200] },
  { t: 'c23-0.2', img: 'feed2', url: '/community', r: [500, 300, 560, 215], rv: [510, 300, 540, 215] },
  { t: 'c23w8-0.2', img: 'feed3', url: '/community', r: [790, 330, 280, 110], rv: [790, 300, 280, 170] },
  { t: 'c8-0.2', img: 'feed1', url: '/community', r: [1045, 322, 292, 64], rv: [1045, 300, 292, 110] },
  // leaderboard
  { t: 'c9-0.9', img: 'lb', url: '/community/leaderboard', r: [0, 0, 1568, 559, 1], rv: [230, 40, 820, 480] },
  { t: 'c9w4-0.2', img: 'lb', url: '/community/leaderboard', r: [524, 63, 519, 81], rv: [524, 50, 519, 160] },
  { t: 'c11-0.3', img: 'lb', url: '/community/leaderboard', r: [524, 160, 519, 190], rv: [524, 150, 519, 210] },
  // profile
  { t: 'c24-0.9', img: 'prof1', url: '/community/u/261', r: [0, 0, 1568, 559, 1], rv: [230, 40, 820, 520] },
  { t: 'c24w2', img: 'prof1', url: '/community/u/261', r: [528, 222, 506, 148], rv: [528, 200, 506, 190] },
  { t: 'c25-0.2', img: 'prof2', url: '/community/u/261', r: [515, 95, 530, 200], rv: [515, 90, 530, 210] },
  // challenges
  { t: 'c12-0.9', img: 'chal', url: '/community/challenges', r: [0, 0, 1568, 559, 1], rv: [230, 40, 820, 480] },
  { t: 'c12w2', img: 'chal', url: '/community/challenges', r: [524, 48, 521, 90], rv: [524, 40, 521, 300] },
  { t: 'c13-0.2', img: 'chal', url: '/community/challenges', r: [700, 40, 360, 110], rv: [760, 40, 300, 200] },
  // teams
  { t: 'c14-0.9', img: 'teams', url: '/community/teams', r: [0, 0, 1568, 559, 1], rv: [230, 40, 820, 480] },
  { t: 'c14w3', img: 'teams', url: '/community/teams', r: [700, 50, 360, 100], rv: [740, 40, 320, 220] },
  { t: 'c15-0.2', img: 'teams', url: '/community/teams', r: [520, 135, 520, 110], rv: [520, 130, 300, 120] },
  { t: 'c26-0.3', img: 'tprof', url: '/community/teams/1', r: [524, 70, 519, 175], rv: [600, 70, 440, 175] },
  // tournaments
  { t: 'c16-0.9', img: 'tour', url: '/community/tournaments', r: [0, 0, 1568, 559, 1], rv: [230, 40, 820, 480] },
  { t: 'c16w2', img: 'tour', url: '/community/tournaments', r: [524, 52, 521, 85], rv: [524, 45, 521, 280] },
  { t: 'c17-0.3', img: 'org', url: '/community/organizers/1', r: [520, 55, 525, 145], rv: [520, 50, 525, 260] },
  // messages
  { t: 'c18-0.9', img: 'msgs', url: '/community/messages', r: [0, 0, 1568, 559, 1], rv: [0, 40, 700, 520] },
  { t: 'c18w5', img: 'chat', url: '/community/messages/2', r: [190, 40, 1100, 510], rv: [190, 40, 1080, 510] },
  { t: 'c27-0.2', img: 'chat', url: '/community/messages/2', r: [280, 430, 720, 120], rv: [280, 400, 420, 160] },
  { t: 'c27w7', img: 'chatgg', url: '/community/messages/4', r: [880, 140, 420, 120], rv: [1000, 130, 300, 140] },
  // find players
  { t: 'c19-0.7', img: 'find', url: '/community/people', r: [520, 55, 528, 370], rv: [520, 55, 528, 370] },
 ],
 hl: [
  { a: 'c3w3-0.2', b: 'c3e+0.3', img: 'hero', r: [372, 432, 348, 84], label: 'ফ্রি — চ্যাম্পিয়ন অ্যাকাউন্টেই' },
  { a: 'c6w3', b: 'c6w8-0.3', img: 'feed1', r: [530, 118, 500, 92], label: 'জয়ের খবর পোস্ট করুন' },
  { a: 'c6w9-0.2', b: 'c6e+0.3', img: 'feed1', r: [536, 366, 500, 32], label: 'React · Comment · Share' },
  { a: 'c7w5-0.2', b: 'c7w7-0.2', img: 'feed1', r: [577, 82, 40, 25], label: 'পোস্ট' },
  { a: 'c7w7-0.2', b: 'c7w10-0.2', img: 'feed1', r: [629, 82, 74, 25], label: 'চ্যালেঞ্জ' },
  { a: 'c7w10-0.2', b: 'c7e+0.3', img: 'feed1', r: [719, 82, 100, 25], label: 'গেম চেয়ে নিন' },
  { a: 'c22w2-0.2', b: 'c22w4-0.2', img: 'feed2', r: [592, 249, 50, 26], label: 'GG!' },
  { a: 'c22w4', b: 'c22w8-0.3', img: 'feed2', r: [590, 482, 56, 28], label: 'Love' },
  { a: 'c22w9', b: 'c22e+0.3', img: 'post', r: [538, 208, 492, 32], label: 'সরাসরি কমেন্ট' },
  { a: 'c23w3', b: 'c23w8-0.3', img: 'feed2', r: [536, 402, 488, 50], label: 'গেম রিকোয়েস্ট' },
  { a: 'c23w9', b: 'c23e+0.3', img: 'feed3', r: [920, 374, 96, 28], label: 'I want this too' },
  { a: 'c8w1', b: 'c8e+0.3', img: 'feed1', r: [1064, 355, 258, 22], label: 'সবচেয়ে বেশি চাওয়া গেম' },
  { a: 'c9w5-0.2', b: 'c9e+0.4', img: 'lb', r: [536, 110, 494, 30], label: 'সবাই শুরু করে ১২০০ থেকে' },
  { a: 'c11w2', b: 'c11e+0.3', img: 'lb', r: [690, 266, 190, 26], label: 'প্রথম জয়েই টপে!' },
  { a: 'c24w3-0.2', b: 'c24w5-0.2', img: 'prof1', r: [536, 231, 157, 66], label: 'চ্যাম্পিয়ন স্কোর' },
  { a: 'c24w5-0.2', b: 'c24w7-0.2', img: 'prof1', r: [703, 231, 154, 66], label: 'র‍্যাঙ্ক' },
  { a: 'c24w7-0.2', b: 'c24w10-0.2', img: 'prof1', r: [866, 231, 160, 66], label: 'জয়-হারের রেকর্ড' },
  { a: 'c24w10-0.2', b: 'c24w13-0.2', img: 'prof1', r: [536, 307, 157, 56], label: 'সেশন' },
  { a: 'c24w13-0.2', b: 'c24e+0.3', img: 'prof1', r: [703, 307, 154, 56], label: 'খেলার সময়' },
  { a: 'c25w8', b: 'c25e+0.3', img: 'prof2', r: [785, 197, 254, 92], label: 'ট্রফি' },
  { a: 'c13w1-0.1', b: 'c13w4', img: 'chal', r: [929, 64, 114, 28], label: 'New challenge' },
  { a: 'c14w5-0.1', b: 'c14e+0.3', img: 'teams', r: [940, 66, 104, 28], label: 'Make a team' },
  { a: 'c15w10', b: 'c15e+0.3', img: 'teams', r: [580, 180, 108, 18], label: 'জয়-হারের হিসাব' },
  { a: 'c26w1-0.2', b: 'c26w4-0.2', img: 'tprof', r: [724, 153, 72, 28], label: 'ফলো' },
  { a: 'c26w4-0.2', b: 'c26w8-0.2', img: 'tprof', r: [803, 153, 127, 28], label: 'ক্যাপ্টেনকে মেসেজ' },
  { a: 'c26w8-0.2', b: 'c26e+0.3', img: 'tprof', r: [937, 153, 92, 28], label: 'টিমকে চ্যালেঞ্জ' },
  { a: 'c16w3', b: 'c16w7-0.1', img: 'tour', r: [560, 80, 286, 20], label: 'চ্যাম্পিয়নের ভেন্যুতে' },
  { a: 'c16w7-0.1', b: 'c16e+0.3', img: 'tour', r: [522, 107, 180, 26], label: 'Open · Running · Finished' },
  { a: 'c17w8', b: 'c17e+0.3', img: 'org', r: [954, 94, 74, 25], label: 'ফলো করুন' },
  { a: 'c18w6', b: 'c18w10-0.2', img: 'chat', r: [1118, 310, 140, 30], label: 'সরাসরি মেসেজ' },
  { a: 'c18w10-0.2', b: 'c18w13-0.2', img: 'chat', r: [198, 62, 32, 28], label: 'গ্রুপ বানান' },
  { a: 'c18w13-0.2', b: 'c18e+0.3', img: 'chat', r: [294, 509, 30, 28], label: 'পোল ও আরও' },
  { a: 'c27w2-0.2', b: 'c27w7-0.2', img: 'chat', r: [292, 468, 372, 32], label: 'এক ট্যাপে রিপ্লাই' },
  { a: 'c27w7+0.2', b: 'c27e+0.3', img: 'chatgg', r: [1217, 205, 41, 26], label: 'GG!' },
  { a: 'c19w1', b: 'c19w5', img: 'find', r: [524, 106, 520, 32], label: 'নাম বা @handle দিয়ে খুঁজুন' },
  { a: 'c19w7', b: 'c19e+0.3', img: 'find', r: [972, 234, 64, 25], label: 'Follow' },
 ],
 cur: [
  { t: 'c6w4', img: 'feed1', x: 700, y: 160 },
  { t: 'c7w5', img: 'feed1', x: 598, y: 95 }, { t: 'c7w7', img: 'feed1', x: 668, y: 95 }, { t: 'c7w11', img: 'feed1', x: 770, y: 95 },
  { t: 'c22w2', img: 'feed2', x: 618, y: 262 },
  { t: 'c23w9', img: 'feed3', x: 968, y: 388 },
  { t: 'c13w2', img: 'chal', x: 986, y: 78 },
  { t: 'c14w6', img: 'teams', x: 992, y: 80 },
  { t: 'c17w9', img: 'org', x: 990, y: 106 },
  { t: 'c27w3', img: 'chat', x: 318, y: 484 },
  { t: 'c19w8', img: 'find', x: 1004, y: 246 },
 ],
 badges: [
  { a: 'c2w4', b: 'c2e+0.6', items: [{ t: 'c2w5', txt: 'চ্যালেঞ্জ' }, { t: 'c2w7', txt: 'টিম' }, { t: 'c2w9', txt: 'টুর্নামেন্ট' }, { t: 'c2w12', txt: 'লিডারবোর্ড' }] },
  { a: 'c22w2-0.1', b: 'c22w8-0.2', items: [{ t: 'c22w2', txt: 'GG' }, { t: 'c22w4', txt: 'Love' }, { t: 'c22w6', txt: 'Trophy' }] },
  { a: 'c12w9-0.1', b: 'c12e+0.5', items: [{ t: 'c12w9', txt: 'FC' }, { t: 'c12w10', txt: 'GTA' }, { t: 'c12w11', txt: 'রেসিং' }, { t: 'c12w13', txt: 'ফাইটিং' }] },
  { a: 'c13w4-0.1', b: 'c13e+0.6', arrows: true, items: [{ t: 'c13w4', txt: 'প্রতিপক্ষ' }, { t: 'c13w8', txt: 'চ্যাম্পিয়নে খেলা' }, { t: 'c13w11', txt: 'দুজনেই কনফার্ম ✓' }, { t: 'c13w16', txt: 'লিডারবোর্ড' }] },
  { a: 'c15w1-0.1', b: 'c15w10-0.3', items: [{ t: 'c15w1', txt: 'ইনভাইট' }, { t: 'c15w3', txt: 'ক্যাপ্টেন' }, { t: 'c15w8', txt: 'এক টিম' }] },
 ],
 noSub: [], noCap: [],
 winOp(t) { let o = Math.min(P(t, S('c2') - .7, S('c2') - .3), 1 - P(t, S('c4') - .6, S('c4') - .25));
   o = Math.max(o, Math.min(P(t, S('c6') - 1.0, S('c6') - .6), 1 - P(t, E('c19') + .3, E('c19') + .7))); return clamp(o) },
 bgOp(t) { return 1 - .45 * Math.max(1 - P(t, S('c2') - .8, S('c2') - .2), P(t, S('c20') - .8, S('c20') - .2)) },
 wmOp(t) { return Math.min(P(t, S('c1') - .3, S('c1') + .2), 1 - P(t, S('q8') - .5, S('q8') - .1)) },
};
// ---------- custom scenes ----------
const ICON = {
 globe: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.9 2.8 16.1 0 19M12 2.5c-2.8 2.9-2.8 16.1 0 19"/></svg>',
 pin: '<svg width="60" height="60" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
 wa: '<svg width="64" height="64" viewBox="0 0 24 24"><path fill="#fff" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2z"/></svg>',
 cal: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 star: '<svg width="70" height="70" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>',
 users: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.8"/><path d="M16.5 14.6c2.6.2 4.5 2 5 5"/></svg>',
};
function el(html, parent = 'cust1') { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; $(parent).appendChild(e); return e }
let C = {};
DATA.build = function () {
 C.k1 = el(`<div class="abs kin hide">CHAMPION COMMUNITY</div>`); C.k1b = el(`<div class="abs kinB hide">এসে গেছে আমাদের নিজেদের কমিউনিটি!</div>`);
 C.km = el(`<img class="abs hide" src="ss/m4.svg">`);
 // steps
 C.steps = el(`<div class="abs hide"></div>`);
 const ST = [['01', 'Join Champion', 'অ্যাকাউন্ট খুলুন', 'm1'], ['02', 'Pick your @handle', 'নিজের হ্যান্ডেল', 'm2'], ['03', 'Challenge & play', 'চ্যালেঞ্জ দিন, খেলুন', 'm3'], ['04', 'Climb & win', 'টপে উঠুন, জিতুন', 'm4']];
 C.st = ST.map(([n, a, b, m], i) => { const c = document.createElement('div'); c.className = 'card'; c.innerHTML = `<div style="font-family:Anton;color:#4d94ff" class="sn">${n}</div><div class="sa" style="font-family:Montserrat;font-weight:900"></div><div class="sb" style="font-weight:700;color:#cfe0ff"></div><img src="ss/${m}.svg" style="position:absolute">`;
   c.querySelector('.sa').textContent = a; c.querySelector('.sb').textContent = b; C.steps.appendChild(c); return c });
 C.handle = el(`<div class="abs hide" style="font-family:Inter;font-weight:700;color:#fff;background:#1f66e0;border-radius:40px;padding:8px 26px;box-shadow:0 10px 30px rgba(0,0,0,.5)"></div>`);
 C.min1 = el(`<div class="abs hide" style="font-weight:800;color:#0b1d4f;background:linear-gradient(180deg,#fff,#cfe0ff);border-radius:40px;padding:8px 26px">মাত্র ১ মিনিট</div>`);
 // duel
 C.scrim = el(`<div class="abs full hide" style="background:rgba(3,8,24,.78)"></div>`, 'cust1');
 C.duel = el(`<div class="abs hide" style="display:flex;align-items:center;gap:40px"></div>`);
 const pc = (n, s, c) => `<div class="card" style="position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:26px 46px"><div style="font-family:Montserrat;font-weight:900;letter-spacing:3px;color:${c}" class="pn">${n}</div><div class="ps" style="font-family:Anton;line-height:1">${s}</div><div style="font-weight:700;color:#9fb6e0" class="pl">Champion score</div><div class="pd" style="position:absolute;right:-22px;top:-26px;font-family:Anton;border-radius:16px;padding:4px 16px"></div></div>`;
 C.duel.innerHTML = pc('YOU', '1200', '#7fc0ff') + `<div style="font-family:Anton;color:#ff5a5a" class="vs">VS</div>` + pc('STRONGER RIVAL', '1350', '#ffb36b');
 C.conf = el(`<div class="abs hide" style="font-family:Montserrat;font-weight:900;letter-spacing:3px;color:#0d3b1f;background:linear-gradient(180deg,#8ff5b4,#2fcf6c);border-radius:16px;padding:10px 30px;box-shadow:0 10px 30px rgba(0,0,0,.5)">✓ CONFIRMED BY BOTH</div>`);
 // one account
 C.one = el(`<div class="abs kin hide">ONE ACCOUNT</div>`);
 C.tiles = el(`<div class="abs hide" style="display:flex;gap:30px;justify-content:center"></div>`);
 C.tl = [['cal', 'বুকিং'], ['star', 'পয়েন্ট'], ['users', 'কমিউনিটি']].map(([ic, t]) => { const d = document.createElement('div'); d.className = 'card'; d.style.cssText = 'position:relative;display:flex;flex-direction:column;align-items:center;gap:14px;padding:30px 50px';
   d.innerHTML = `<div style="width:120px;height:120px;border-radius:30px;background:linear-gradient(145deg,#4aa0ff,#1f5fd6);display:flex;align-items:center;justify-content:center">${ICON[ic]}</div><div class="tt" style="font-weight:800">${t}</div>`; C.tiles.appendChild(d); return d });
 // end cards
 const card2 = (id, ic, k, v, cls = '', vc = '') => el(`<div id="${id}" class="card2 ${cls} hide"><div class="ic">${ICON[ic]}</div><div><div class="k">${k}</div><div class="v ${vc}">${v}</div></div></div>`, 'cust2');
 C.cU = card2('cU', 'globe', 'আজই জয়েন করুন', 'champion.gemten.com.bd', '', 'u'); C.cA = card2('cA', 'pin', 'ঠিকানা', 'রানীর বাজার, IFIC ব্যাংক বিল্ডিং<br>৪র্থ তলা, কুমিল্লা'); C.cW = card2('cW', 'wa', 'হোয়াটসঅ্যাপ', '01603-754074', 'wa', 'n');
 C.em = el(`<img class="abs hide" src="ss/m1.svg">`, 'cust2');
 C.fin = el(`<div id="fin" class="abs hide" style="left:0;width:100%"><img id="finI" src="../inv/brand/icon_white.png"><img id="finW" src="../inv/brand/wordmark_clean.png"><div id="finB">CHAMPION COMMUNITY · PLAY + CONNECT + WIN</div>
   <div class="fr"><div class="i">${ICON.globe.replace(/64/g, 26)}</div>champion.gemten.com.bd</div><div class="fr wa"><div class="i">${ICON.wa.replace(/64/g, 26)}</div>WhatsApp: 01603-754074</div>
   <div class="fr"><div class="i">${ICON.pin.replace(/60/g, 26)}</div>রানীর বাজার, IFIC ব্যাংক বিল্ডিং, ৪র্থ তলা, কুমিল্লা</div></div>`, 'cust2');
 // layout
 if (!V) {
  pos(C.k1, { left: 0, width: 1920, top: 330, fontSize: '110px' }); pos(C.k1b, { left: 0, width: 1920, top: 500, fontSize: '64px' }); pos(C.km, { left: 830, top: 620, width: 260 });
  pos(C.steps, { left: 120, top: 250, width: 1680, height: 560 });
  C.st.forEach((c, i) => { pos(c, { left: i * 430, top: 0, width: 400, height: 520, padding: '34px 30px' }); c.querySelector('.sn').style.fontSize = '64px'; c.querySelector('.sa').style.fontSize = '34px'; c.querySelector('.sb').style.fontSize = '32px'; pos(c.querySelector('img'), { right: 20, bottom: 14, width: 170 }) });
  pos(C.handle, { left: 560, top: 840, fontSize: '46px' }); pos(C.min1, { left: 150, top: 840, fontSize: '40px' });
  pos(C.duel, { left: 0, width: 1920, top: 300, justifyContent: 'center' }); C.duel.querySelectorAll('.ps').forEach(e => e.style.fontSize = '150px'); C.duel.querySelectorAll('.pn').forEach(e => e.style.fontSize = '34px'); C.duel.querySelectorAll('.pl,.pd').forEach(e => e.style.fontSize = '30px'); C.duel.querySelector('.vs').style.fontSize = '110px';
  pos(C.conf, { left: 0, top: 760, fontSize: '44px' });
  pos(C.one, { left: 0, width: 1920, top: 240, fontSize: '110px' }); pos(C.tiles, { left: 0, width: 1920, top: 450 }); C.tl.forEach(d => d.querySelector('.tt').style.fontSize = '54px');
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 310, top: 640, width: 1300 }); pos(C.em, { left: 1640, top: 600, width: 230 });
  pos(C.fin, { top: 140 }); $('finI').style.height = '130px'; $('finW').style.width = '600px'; $('finB').style.fontSize = '56px'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '34px');
 } else {
  pos(C.k1, { left: 0, width: 1080, top: 420, fontSize: '84px', whiteSpace: 'normal', lineHeight: '1.05' }); C.k1.innerHTML = 'CHAMPION<br>COMMUNITY'; pos(C.k1b, { left: 40, width: 1000, top: 680, fontSize: '56px' }); pos(C.km, { left: 360, top: 860, width: 360 });
  pos(C.steps, { left: 40, top: 420, width: 1000, height: 1000 });
  C.st.forEach((c, i) => { pos(c, { left: (i % 2) * 510, top: Math.floor(i / 2) * 500, width: 490, height: 470, padding: '30px 28px' }); c.querySelector('.sn').style.fontSize = '64px'; c.querySelector('.sa').style.fontSize = '34px'; c.querySelector('.sb').style.fontSize = '36px'; pos(c.querySelector('img'), { right: 16, bottom: 10, width: 170 }) });
  pos(C.handle, { left: 0, top: 1660, fontSize: '48px' }); pos(C.min1, { left: 0, top: 1660, fontSize: '44px' });
  pos(C.duel, { left: 0, width: 1080, top: 520, flexDirection: 'column', gap: '30px' }); C.duel.querySelectorAll('.ps').forEach(e => e.style.fontSize = '140px'); C.duel.querySelectorAll('.pn').forEach(e => e.style.fontSize = '34px'); C.duel.querySelectorAll('.pl,.pd').forEach(e => e.style.fontSize = '32px'); C.duel.querySelector('.vs').style.fontSize = '90px';
  pos(C.conf, { left: 0, top: 1380, fontSize: '42px' });
  pos(C.one, { left: 0, width: 1080, top: 380, fontSize: '96px' }); pos(C.tiles, { left: 0, width: 1080, top: 560, flexDirection: 'column', alignItems: 'center', gap: '30px' }); C.tl.forEach(d => { d.style.width = '640px'; d.style.flexDirection = 'row'; d.querySelector('.tt').style.fontSize = '58px' });
  for (const c of [C.cU, C.cA, C.cW]) pos(c, { left: 40, top: 1180, width: 1000 }); pos(C.em, { left: 400, top: 700, width: 280 });
  pos(C.fin, { top: 300 }); $('finI').style.height = '130px'; $('finW').style.width = '560px'; $('finB').style.fontSize = '44px'; $('finB').style.whiteSpace = 'normal'; $('finB').style.width = '900px'; $('finB').style.textAlign = 'center'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '30px');
 }
};
function slam(e, t, a, b, s0 = 1.6) { const v = vis(t, a, b, .01, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .4)); e.style.opacity = Math.min(1, P(t, a, a + .1)) * v; e.style.transform = `scale(${s0 - (s0 - 1) * k})`; return v }
DATA.render = function (t) {
 let fl = 0;
 const lo = logo(t, 0, S('c1') - .15, 470, 860); fl = Math.max(fl, vis(t, 0, .3, .01, .29) * .8);
 // c1 kinetic
 { const a = S('c1') - .15, b = S('c2') - .55; slam(C.k1, t, a, b, 1.5); slam(C.k1b, t, a + .6, b, 1.3); const v = vis(t, a + .3, b, .2, .3); show(C.km, v > 0); if (v) { const k = eback(P(t, a + .3, a + .8)); C.km.style.opacity = v; C.km.style.transform = `translateY(${(1 - k) * 200 + Math.abs(Math.sin(t * 3)) * -20}px)` } }
 // steps
 { const a = S('c4') - .3, b = S('c6') - .8, v = vis(t, a, b, .3, .35); show(C.steps, v > 0); if (v) { C.steps.style.opacity = v;
   const act = t < S('c5') - .2 ? 0 : 1; C.st.forEach((c, i) => { const k = eback(P(t, a + i * .12, a + i * .12 + .5)); const on = i === act; c.style.transform = `translateY(${(1 - k) * 80}px) scale(${on ? 1.04 : .97})`; c.style.opacity = P(t, a + i * .12, a + i * .12 + .2) * (on ? 1 : .55);
     c.style.borderColor = on ? '#7fc0ff' : 'rgba(110,165,255,.4)'; c.style.boxShadow = on ? '0 0 60px rgba(77,148,255,.6),0 20px 50px rgba(0,0,0,.5)' : '' }) }
   const vm = vis(t, T('c4w7'), S('c5') - .25, .2, .2); show(C.min1, vm > 0); if (vm) { C.min1.style.opacity = vm; if (V) { C.min1.style.left = (540 - C.min1.offsetWidth / 2) + 'px' } }
   const vh = vis(t, T('c5w4'), b, .2, .35); show(C.handle, vh > 0); if (vh) { const full = '@your_handle', n = Math.floor(clamp((t - T('c5w4')) / 0.9) * full.length); C.handle.textContent = full.slice(0, Math.max(1, n)) + (t % .8 < .4 ? '|' : ' '); C.handle.style.opacity = vh;
     if (V) C.handle.style.left = (540 - C.handle.offsetWidth / 2) + 'px' } }
 // duel (c10)
 { const a = S('c10') - .3, b = E('c10') + .3, v = vis(t, a, b, .3, .3); show(C.scrim, v > 0); show(C.duel, v > 0); if (v) { C.scrim.style.opacity = v; C.duel.style.opacity = v; C.duel.style.transform = `scale(${.9 + .1 * eo(P(t, a, a + .5))})`;
   const sc = C.duel.querySelectorAll('.ps'), pd = C.duel.querySelectorAll('.pd'); const tw = T('c10w4'), tl = T('c10w9');
   let me = 1200, d0 = '', c0 = ''; if (t >= tw && t < tl) { me = Math.round(1200 + 24 * eo(P(t, tw, tw + .8))); d0 = '+24 ▲'; c0 = '#2fcf6c' } else if (t >= tl) { me = Math.round(1224 - 12 * eo(P(t, tl, tl + .8))); d0 = '−12 ▼'; c0 = '#ff5a5a' }
   sc[0].textContent = me; pd[0].textContent = d0; pd[0].style.background = c0; pd[0].style.color = '#fff'; pd[0].style.display = d0 ? 'block' : 'none'; pd[1].style.display = 'none';
   const vc = vis(t, T('c10w12') - .1, b, .01, .3); show(C.conf, vc > 0); if (vc) { const k = eback(P(t, T('c10w12') - .1, T('c10w12') + .3)); C.conf.style.opacity = vc; C.conf.style.transform = `scale(${1.6 - .6 * k}) rotate(-3deg)`; C.conf.style.left = ((V ? 1080 : 1920) / 2 - C.conf.offsetWidth / 2) + 'px'; if (P(t, T('c10w12') - .1, T('c10w12') + .15) < 1) fl = Math.max(fl, .25) } } else show(C.conf, false) }
 // one account (c20)
 { const a = S('c20') - .5, b = E('c20') + .4; slam(C.one, t, a, b, 1.4); const v = vis(t, a + .2, b, .2, .3); show(C.tiles, v > 0); if (v) { C.tiles.style.opacity = v;
   C.tl.forEach((d, i) => { const ti = T(['c20w3', 'c20w4', 'c20w6'][i]) - .1, k = eback(P(t, ti, ti + .4)); d.style.opacity = P(t, ti, ti + .1); d.style.transform = `scale(${.5 + .5 * k})` }) } }
 // end cards
 const cd = (e, a, b) => { const v = vis(t, a, b, .3, .25); show(e, v > 0); if (v) { e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(P(t, a, a + .4))) * 60}px)` } return v };
 cd(C.cU, S('c21') - .15, S('q5') - .2); cd(C.cA, S('q5') - .15, S('q7') - .2); cd(C.cW, S('q7') - .15, S('q8') - .3);
 { const v = vis(t, S('c21') - .2, S('q8') - .3, .3, .3); show(C.em, v > 0); if (v) { C.em.style.opacity = v; C.em.style.transform = `translateY(${Math.sin(t * 2.4) * 10}px) rotate(${Math.sin(t * 1.8) * 3}deg)` } }
 { const a = S('q8') - .3, o = t >= a; show(C.fin, o); if (o) { C.fin.style.opacity = P(t, a, a + .4); $('finB').style.transform = `scale(${1.3 - .3 * eback(P(t, a + .2, a + .6))})`;
   C.fin.querySelectorAll('.fr').forEach((e, i) => { const v = P(t, a + .5 + i * .25, a + .85 + i * .25); e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(v)) * 30}px)` }) } fl = Math.max(fl, vis(t, a, a + .3, .01, .29) * .6) }
 return fl;
};
