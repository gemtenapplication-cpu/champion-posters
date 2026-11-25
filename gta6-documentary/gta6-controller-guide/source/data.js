// GTA 6 · PS5 controller tutorial — scene data (default control scheme, cross-checked across 5 launch guides)
const SYM = {
 T: '<svg viewBox="0 0 24 24"><path d="M12 4.5l7.6 13.2H4.4z" fill="none" stroke="#3fe0b0" stroke-width="2.6" stroke-linejoin="round"/></svg>',
 O: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.8" fill="none" stroke="#ff5f74" stroke-width="2.6"/></svg>',
 X: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#7fb2ff" stroke-width="2.8" stroke-linecap="round"/></svg>',
 S: '<svg viewBox="0 0 24 24"><rect x="5.5" y="5.5" width="13" height="13" rx="1" fill="none" stroke="#f08ad8" stroke-width="2.6"/></svg>',
};
function dpadSvg(on) { const a = (d, p) => `<path d="${p}" fill="${on === d ? '#7fc0ff' : 'rgba(255,255,255,.35)'}"/>`;
  return `<svg viewBox="0 0 24 24">${a('UP', 'M9.5 2.5h5v6l-2.5 2.5-2.5-2.5z')}${a('DN', 'M9.5 21.5h5v-6l-2.5-2.5-2.5 2.5z')}${a('LF', 'M2.5 9.5v5h6l2.5-2.5-2.5-2.5z')}${a('RT', 'M21.5 9.5v5h-6l-2.5-2.5 2.5-2.5z')}</svg>` }
window.GLYPH = function (k, sz) {
  const s = sz, f = Math.round(sz * .36);
  if (SYM[k]) return `<span class="gl round" style="width:${s}px;height:${s}px">${SYM[k].replace('<svg', `<svg width="${s * .72}" height="${s * .72}"`)}</span>`;
  if (['UP', 'DN', 'LF', 'RT', 'DP'].includes(k)) return `<span class="gl round" style="width:${s}px;height:${s}px">${dpadSvg(k).replace('<svg', `<svg width="${s * .78}" height="${s * .78}"`)}</span>`;
  if (['LS', 'RS', 'L3', 'R3'].includes(k)) { const t = { LS: 'L', RS: 'R', L3: 'L3', R3: 'R3' }[k]; return `<span class="gl round" style="width:${s}px;height:${s}px;font-size:${f}px;box-shadow:inset 0 0 0 ${s * .09}px #3a4256">${t}</span>` }
  const txt = { L1: 'L1', R1: 'R1', L2: 'L2', R2: 'R2', TP: 'TOUCHPAD', OPT: 'OPTIONS', CRE: 'CREATE', PS: 'PS', MUTE: 'MUTE' }[k] || k;
  const w = txt.length > 2 ? s * 2.4 : s * 1.18; return `<span class="gl pill" style="width:${w}px;height:${s * .8}px;font-size:${txt.length > 2 ? f * .62 : f}px">${txt}</span>` };
window.ICONS = {
 foot: '<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><circle cx="13" cy="4" r="2.2"/><path d="M10.5 7.5l3.5-.6 2 3.3 3 1.2-.6 1.7-3.8-1.4-1-1.5-1 3.6 2.6 2.4V22h-2v-4.6l-3-2.6-1.3 3.3L5 21l-1.4-1.3 3.4-3.2 2-6.3-1.6.7-1 3H4.4l1.3-4.3z"/></svg>',
 gun: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/></svg>',
 car: '<svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 1.5 1.9V17h-2v1.5a1 1 0 0 1-2 0V17H7.5v1.5a1 1 0 0 1-2 0V17h-2v-4.1A2 2 0 0 1 5 11zm2.1 0h9.8l-1.2-3.3a.8.8 0 0 0-.7-.5H9a.8.8 0 0 0-.7.5zM6.5 13.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm11 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"/></svg>',
 plane: '<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0v5l-8 5v2l8-2.5v5.5l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5V13z"/></svg>',
 phone: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="6" y="2.5" width="12" height="19" rx="2.6"/><path d="M10.5 18.5h3"/></svg>',
 gear: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>',
};
const GP = { LS: 'lstick', RS: 'rstick', L3: 'lstick', R3: 'rstick', X: 'cross', O: 'circle', T: 'triangle', S: 'square', L1: 'L1', R1: 'R1', L2: 'L2', R2: 'R2', UP: 'dUp', DN: 'dDown', LF: 'dLeft', RT: 'dRight', TP: 'touchpad', OPT: 'options', CRE: 'create', PS: 'ps', MUTE: 'mute' };
const DATA = {
 sections: [
  { a: 'k4-0.9', b: 'k12-0.9', num: '01', title: 'CONTROLLER TOUR', bn: 'কন্ট্রোলার পরিচিতি' },
  { a: 'k12-0.9', b: 'k17-0.9', num: '02', title: 'ON FOOT', bn: 'হাঁটা-চলা', icon: 'foot', ptitle: 'হাঁটা-চলা', rows: [
    { t: 'k12w5', g: ['LS'], txt: 'হাঁটা' }, { t: 'k12w8', g: ['RS'], txt: 'চারপাশ দেখা' }, { t: 'k13w1', g: ['L3'], txt: 'দৌড়' }, { t: 'k14w0', g: ['X'], txt: 'লাফ / বেয়ে ওঠা' },
    { t: 'k14w5', g: ['O'], txt: 'বসে পড়া' }, { t: 'k14w8', g: ['S'], txt: 'হাতাহাতি' }, { t: 'k15w0', g: ['T'], txt: 'ইন্টারঅ্যাক্ট' }, { t: 'k16w0', g: ['R3'], hold: 1, txt: 'পেছনে তাকানো' }] },
  { a: 'k17-0.9', b: 'k23-0.9', num: '03', title: 'COMBAT', bn: 'অস্ত্র ও লড়াই', icon: 'gun', ptitle: 'অস্ত্র ও লড়াই', rows: [
    { t: 'k17w1', g: ['L2'], hold: 1, txt: 'নিশানা' }, { t: 'k17w4', g: ['R2'], txt: 'গুলি' }, { t: 'k18w0', g: ['R1'], txt: 'কভার' }, { t: 'k18w2', g: ['L1'], txt: 'অস্ত্র সরিয়ে রাখা' },
    { t: 'k18w6', g: ['L1'], hold: 1, txt: 'লোডআউট' }, { t: 'k19w2', g: ['T'], txt: 'দ্রুত অস্ত্র বদল' }, { t: 'k19w6', g: ['LF'], txt: 'কাঁধ বদল' }, { t: 'k20w1', g: ['UP', 'DN'], txt: 'স্কোপ জুম' },
    { t: 'k20w4', g: ['R3'], txt: 'জুম / গ্রেনেডের পথ' }, { t: 'k21w0', g: ['R1'], hold: 1, txt: 'বিস্ফোরক ছোড়া' }, { t: 'k22w1', g: ['L2'], txt: 'লক (হাতাহাতি)' }, { t: 'k22w3', g: ['S'], txt: 'ঘুষি' },
    { t: 'k22w5', g: ['X'], txt: 'ব্লক / সরে যাওয়া' }] },
  { a: 'k23-0.9', b: 'k28-0.9', num: '04', title: 'DRIVING', bn: 'ড্রাইভিং', icon: 'car', ptitle: 'গাড়ি চালানো', rows: [
    { t: 'k23w1', g: ['R2'], txt: 'এক্সেলারেটর' }, { t: 'k23w4', g: ['L2'], txt: 'ব্রেক / রিভার্স' }, { t: 'k23w9', g: ['LS'], txt: 'স্টিয়ারিং' }, { t: 'k24w0', g: ['X'], txt: 'হ্যান্ডব্রেক' },
    { t: 'k25w0', g: ['L3'], txt: 'হর্ন / নাইট্রাস' }, { t: 'k25w4', g: ['O'], txt: 'হেডলাইট' }, { t: 'k26w0', g: ['R1'], txt: 'গাড়ি থেকে গুলি' }, { t: 'k26w4', g: ['T'], txt: 'গাড়ি থেকে নামা' },
    { t: 'k27w0', g: ['LF', 'RT'], txt: 'ইন্ডিকেটর' }, { t: 'k27w3', g: ['LF'], hold: 1, txt: 'রেডিও / গাড়ির মেনু' }] },
  { a: 'k28-0.9', b: 'k31-0.9', num: '05', title: 'AIR & WATER', bn: 'আকাশ ও পানি', icon: 'plane', ptitle: 'আকাশ ও পানি', rows: [
    { t: 'k28w3', g: ['R2'], txt: 'গতি / উচ্চতা বাড়ানো' }, { t: 'k28w8', g: ['L2'], txt: 'গতি / উচ্চতা কমানো' }, { t: 'k28w10', g: ['S', 'O'], txt: 'বাঁয়ে / ডানে ঘোরা' },
    { t: 'k29w1', g: ['L3'], txt: 'জোরে সাঁতার' }, { t: 'k29w4', g: ['R1'], hold: 1, txt: 'ডুব' }, { t: 'k29w7', g: ['X'], txt: 'ভেসে ওঠা' }, { t: 'k30w1', g: ['X'], txt: 'প্যারাশুট খোলা' }, { t: 'k30w3', g: ['L2', 'R2'], txt: 'প্যারাশুটের দিক' }] },
  { a: 'k31-0.9', b: 'k33-0.9', num: '06', title: 'MAP & MENUS', bn: 'ম্যাপ, ফোন ও মেনু', icon: 'phone', ptitle: 'ম্যাপ, ফোন ও মেনু', rows: [
    { t: 'k31w0', g: ['TP'], txt: 'ম্যাপ' }, { t: 'k31w2', g: ['OPT'], txt: 'পজ' }, { t: 'k32w0', g: ['UP'], txt: 'ফোন' }, { t: 'k32w3', g: ['DN'], txt: 'অবজেক্টিভ' },
    { t: 'k32w5', g: ['RT'], txt: 'বিস্ফোরক ফাটানো' }, { t: 'k32w8', g: ['RT'], hold: 1, txt: 'পার্টনার মেনু' }] },
  { a: 'k33-0.9', b: 'k34e+0.6', num: '07', title: 'PRO TIPS', bn: 'সেটিংস টিপস', icon: 'gear', ptitle: 'Settings › Control Scheme', rows: [
    { t: 'k33w9', g: ['X'], txt: 'Classic — দৌড়' }, { t: 'k33w14', g: ['S'], txt: 'Classic — লাফ' }, { t: 'k34w3', g: ['LS', 'RS'], txt: 'Left-Handed — স্টিক অদলবদল' }] },
 ],
 cams: {
  intro: { p: [0, -17, 8], g: [0, -1, 1] }, title: { p: [0, -15, 12], g: [0, -1.5, 0] }, hero: { p: [0, -12.5, 19], g: [0, -1.7, .6] }, top: { p: [0, -6.5, 21], g: [0, .8, .6] },
  sticks: { p: [0, -7.5, 11.5], g: [0, -1.3, 2.2], k: 1.6 }, lstick: { p: [-2.5, -5.2, 8.2], g: [-2.5, -1.3, 2.3], k: 1.75 }, rstick: { p: [2.5, -5.2, 8.2], g: [2.5, -1.3, 2.3], k: 1.75 },
  dpad: { p: [-5.1, -3.2, 8.5], g: [-5.1, .8, 2.1], k: 1.75 }, face: { p: [5.06, -3.2, 8.5], g: [5.06, .8, 2.1], k: 1.75 }, back: { p: [0, 16, 10], g: [0, 3.6, .6] },
  touch: { p: [0, -3.5, 10], g: [0, 1.9, 2.1], k: 1.7 }, touchW: { p: [0, -6, 12.5], g: [0, 1.5, 2.1] }, center: { p: [0, -7, 10], g: [0, -.9, 2.1] },
  under: { p: [3.5, -7, -16], g: [0, -2.4, 0] }, promo: { p: [0, -15, 11], g: [0, -1, 0], k: 1.8 },
 },
 shots: [
  { t: 0, c: 'intro' }, { t: 'k2-0.3', c: 'title', d: 2.5 }, { t: 'k4-0.9', c: 'sticks', d: 1.4 }, { t: 'k4w1-0.25', c: 'lstick', d: 1.0 }, { t: 'k4w4-0.25', c: 'rstick', d: 1.0 },
  { t: 'k4w6-0.2', c: 'sticks', d: 1.0 }, { t: 'k5-0.5', c: 'dpad', d: 1.2 }, { t: 'k6-0.5', c: 'face', d: 1.3 }, { t: 'k7-0.6', c: 'back', d: 1.8 }, { t: 'k8-0.6', c: 'touch', d: 1.8 },
  { t: 'k8w5-0.25', c: 'touchW', d: 1.0 }, { t: 'k9w5-0.25', c: 'center', d: 1.2 }, { t: 'k10-0.6', c: 'under', d: 2.0 }, { t: 'k12-0.9', c: 'hero', d: 2.0 },
  { t: 'k17-0.9', c: 'top', d: 1.6 }, { t: 'k19-0.3', c: 'hero', d: 1.4 }, { t: 'k23-0.9', c: 'top', d: 1.6 }, { t: 'k24-0.3', c: 'hero', d: 1.4 },
  { t: 'k28-0.9', c: 'top', d: 1.6 }, { t: 'k29-0.3', c: 'hero', d: 1.4 }, { t: 'k31-0.9', c: 'touchW', d: 1.5 }, { t: 'k32-0.4', c: 'hero', d: 1.3 }, { t: 'k35-0.8', c: 'promo', d: 2.0 },
 ],
 HL: [
  { a: 'k4w1-0.1', b: 'k4w4-0.15', parts: ['lstick'], move: 1, label: 'Left stick', sub: 'বাঁ স্টিক', g: ['LS'], side: 'l' },
  { a: 'k4w4-0.1', b: 'k4w6-0.15', parts: ['rstick'], move: 1, label: 'Right stick', sub: 'ডান স্টিক', g: ['RS'], side: 'r' },
  { a: 'k4w12-0.1', b: 'k4w14-0.1', parts: ['lstick'], press: ['k4w12'], label: 'L3', sub: 'বাঁ স্টিক চাপা', g: ['L3'], side: 'l' },
  { a: 'k4w14-0.1', b: 'k4e+0.4', parts: ['rstick'], press: ['k4w14'], label: 'R3', sub: 'ডান স্টিক চাপা', g: ['R3'], side: 'r' },
  { a: 'k5w2-0.1', b: 'k5w4-0.15', parts: ['dUp', 'dDown', 'dLeft', 'dRight'], label: 'D-pad', sub: 'চার দিকের বাটন', g: ['DP'], side: 't', halo: 3.4 },
  { a: 'k5w4-0.1', b: 'k5w5-0.1', parts: ['dUp'], press: ['k5w4'], label: 'উপর', g: ['UP'], side: 't' },
  { a: 'k5w5-0.1', b: 'k5w6-0.1', parts: ['dDown'], press: ['k5w5'], label: 'নিচ', g: ['DN'], side: 'b' },
  { a: 'k5w6-0.1', b: 'k5w8-0.1', parts: ['dLeft'], press: ['k5w6'], label: 'বাম', g: ['LF'], side: 'l' },
  { a: 'k5w8-0.1', b: 'k5e+0.4', parts: ['dRight'], press: ['k5w8'], label: 'ডান', g: ['RT'], side: 'r' },
  { a: 'k6w5-0.1', b: 'k6w6-0.1', parts: ['triangle'], press: ['k6w5'], label: 'Triangle', g: ['T'], side: 't' },
  { a: 'k6w6-0.1', b: 'k6w7-0.1', parts: ['circle'], press: ['k6w6'], label: 'Circle', g: ['O'], side: 'r' },
  { a: 'k6w7-0.1', b: 'k6w9-0.1', parts: ['cross'], press: ['k6w7'], label: 'Cross', g: ['X'], side: 'b' },
  { a: 'k6w9-0.1', b: 'k6e+0.4', parts: ['square'], press: ['k6w9'], label: 'Square', g: ['S'], side: 'l' },
  { a: 'k7w1-0.1', b: 'k7w3-0.1', parts: ['L1'], press: ['k7w1'], label: 'L1', sub: 'বাঁ বাম্পার', g: ['L1'], side: 'tr', sv: 't' },
  { a: 'k7w3-0.1', b: 'k7w7-0.1', parts: ['R1'], press: ['k7w3'], label: 'R1', sub: 'ডান বাম্পার', g: ['R1'], side: 'tl', sv: 't' },
  { a: 'k7w9-0.1', b: 'k7w11-0.1', parts: ['L2'], press: ['k7w9'], hold: .9, label: 'L2', sub: 'বাঁ ট্রিগার', g: ['L2'], side: 'br', sv: 'b' },
  { a: 'k7w11-0.1', b: 'k7e+0.4', parts: ['R2'], press: ['k7w11'], hold: .9, label: 'R2', sub: 'ডান ট্রিগার', g: ['R2'], side: 'bl', sv: 'b' },
  { a: 'k8w2-0.1', b: 'k8w5-0.1', parts: ['touchpad'], press: ['k8w2'], label: 'Touchpad', sub: 'চাপা ও সোয়াইপ', g: ['TP'], side: 't', halo: 6.5 },
  { a: 'k8w5-0.1', b: 'k8w7-0.1', parts: ['create'], press: ['k8w5'], label: 'Create', g: ['CRE'], side: 'l' },
  { a: 'k8w7-0.1', b: 'k8e+0.4', parts: ['options'], press: ['k8w7'], label: 'Options', g: ['OPT'], side: 'r' },
  { a: 'k9w0-0.1', b: 'k9w5-0.15', parts: ['create'], press: ['k9w0'], label: 'Create', sub: 'স্ক্রিনশট / ক্লিপ', g: ['CRE'], side: 'l' },
  { a: 'k9w6-0.1', b: 'k9w10-0.15', parts: ['ps'], press: ['k9w6'], label: 'PS বাটন', sub: 'কন্ট্রোল সেন্টার', g: ['PS'], side: 'r' },
  { a: 'k9w10-0.1', b: 'k9e+0.4', parts: ['mute'], press: ['k9w10'], label: 'Mute', sub: 'মাইক বন্ধ / চালু', g: ['MUTE'], side: 'b' },
  { a: 'k10w2-0.1', b: 'k11e+0.4', parts: ['BL', 'BR'], label: 'পেছনের প্যাডেল', sub: 'যেকোনো বাটনের কাজ বসানো যায়', side: 't', sv: 't', dh: 260, dv: 300, halo: 3 },
 ],
 noSub: ['k1'], noCap: ['k1'],
};
// gameplay highlights generated from the panel rows (glow + press/move on the 3D controller)
DATA.sections.forEach(s => { if (!s.rows) return; s.rows.forEach((r, i) => { const nx = s.rows[i + 1]; const b = nx ? nx.t + '-0.12' : s.b;
  const parts = r.g.map(g => GP[g]); const move = r.g.some(g => g === 'LS' || g === 'RS');
  DATA.HL.push({ a: r.t + '-0.1', b, parts, move: move ? 1 : 0, press: move ? [] : [r.t], hold: r.hold ? 1.0 : 0, halo: r.g.includes('TP') ? 6.5 : 2.4 }) }) });
const span = (t, a, b, fi = .8, fo = .8) => vis(t, a, b, fi, fo);
DATA.panelOp = t => span(t, S('k12') - 1.0, E('k34') + .7);
DATA.ctlOp = t => Math.min(P(t, S('k2') - .6, S('k2') + .6), 1 - P(t, S('q5') - .6, S('q5') - .1) * .55, 1 - P(t, S('q8') - .5, S('q8') - .1));
DATA.paddles = t => t > S('k10') - .8 && t < E('k11') + .8;
DATA.drift = t => [Math.sin(t * .3) * .35, 0, Math.cos(t * .23) * .25];
DATA.viewOff = t => { const p = DATA.panelOp(t), ti = span(t, S('k2') - .6, S('k4') - .7, .5, 1.2), pr = P(t, S('k35') - .8, S('k35') + .6);
  if (!V) return [-0.2 * p + .21 * pr, .13 * ti + .02 * pr];
  return [0, -.17 * p + .12 * ti - .19 * pr - .04 * span(t, S('k4') - .9, S('k12') - .8)] };
DATA.rootAt = t => { const a = S('k2') - .6, k = eo(P(t, a, a + 2.4)); const pr = Math.max(0, t - (S('k35') - .8));
  return { z: -9 * (1 - k), rz: -1.3 * (1 - k) + .12 * Math.sin(t * .4) * span(t, a, S('k4') - .7, 1, 1) + pr * .28, rx: .9 * (1 - k) } };
DATA.wmOp = t => Math.min(P(t, S('k2') - .3, S('k2') + .3), 1 - P(t, S('q8') - .5, S('q8') - .1));
// ---------- custom scenes ----------
const ICON = {
 globe: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.9 2.8 16.1 0 19M12 2.5c-2.8 2.9-2.8 16.1 0 19"/></svg>',
 pin: '<svg width="60" height="60" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
 wa: '<svg width="64" height="64" viewBox="0 0 24 24"><path fill="#fff" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2z"/></svg>',
 star: '<svg width="66" height="66" viewBox="0 0 24 24" fill="#0b1d4f"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>',
};
function el(html, parent = 'cust1') { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstChild; $(parent).appendChild(e); return e }
let C = {};
DATA.build = function () {
 C.lg = el(`<div class="abs hide" style="left:0;width:100%;display:flex;flex-direction:column;align-items:center"><img id="lgI" src="../inv/brand/icon_white.png"><img id="lgW" src="../inv/brand/wordmark_clean.png" style="margin-top:24px"><div id="lgP" class="kin" style="margin-top:34px">PRESENTS</div></div>`, 'cust2');
 C.t1 = el(`<div class="abs gta hide">GTA 6</div>`); C.t2 = el(`<div class="abs kinB hide">PS5 কন্ট্রোলার গাইড</div>`);
 C.t3 = el(`<div class="abs hide" style="font-family:Montserrat;font-weight:700;letter-spacing:8px;color:#9fc3ff;text-align:center">DEFAULT CONTROLS · STEP BY STEP</div>`);
 C.p1 = el(`<div class="abs kinB hide">বড় স্ক্রিনে PS5 খেলতে</div>`); C.p2 = el(`<div class="abs kinB hide" style="color:#7fc0ff">চলে আসুন চ্যাম্পিয়নে!</div>`);
 const card2 = (id, ic, k, v, cls = '', vc = '') => el(`<div id="${id}" class="card2 ${cls} hide"><div class="ic">${ICON[ic]}</div><div><div class="k">${k}</div><div class="v ${vc}">${v}</div></div></div>`, 'cust2');
 C.cS = card2('cS', 'star', 'ফ্রি অ্যাকাউন্ট = সিলভার মেম্বার', 'প্রতিটা সেশনে ১০% ছাড়', 'sl');
 C.cU = card2('cU', 'globe', 'স্লট বুক করুন অনলাইনে', 'champion.gemten.com.bd', '', 'u'); C.cA = card2('cA', 'pin', 'ঠিকানা', 'রানীর বাজার, IFIC ব্যাংক বিল্ডিং<br>৪র্থ তলা, কুমিল্লা'); C.cW = card2('cW', 'wa', 'হোয়াটসঅ্যাপ', '01603-754074', 'wa', 'n');
 C.fin = el(`<div id="fin" class="abs hide" style="left:0;width:100%"><img id="finI" src="../inv/brand/icon_white.png"><img id="finW" src="../inv/brand/wordmark_clean.png"><div id="finB">GTA 6 · PS5 · CHAMPION</div>
   <div class="fr"><div class="i">${ICON.globe.replace(/64/g, 26)}</div>champion.gemten.com.bd</div><div class="fr wa"><div class="i">${ICON.wa.replace(/64/g, 26)}</div>WhatsApp: 01603-754074</div>
   <div class="fr"><div class="i">${ICON.pin.replace(/60/g, 26)}</div>রানীর বাজার, IFIC ব্যাংক বিল্ডিং, ৪র্থ তলা, কুমিল্লা</div></div>`, 'cust2');
 if (!V) {
  pos(C.lg, { top: 300 }); $('lgI').style.height = '210px'; $('lgW').style.width = '760px'; $('lgP').style.fontSize = '64px'; $('lgP').style.letterSpacing = '22px';
  pos(C.t1, { left: 0, width: 1920, top: 110, fontSize: '190px' }); pos(C.t2, { left: 0, width: 1920, top: 300, fontSize: '70px' }); pos(C.t3, { left: 0, width: 1920, top: 412, fontSize: '26px' });
  pos(C.p1, { left: 90, width: 1000, top: 210, fontSize: '66px', textAlign: 'left', transformOrigin: '0 50%' }); pos(C.p2, { left: 90, width: 1000, top: 320, fontSize: '84px', textAlign: 'left', transformOrigin: '0 50%' });
  for (const c of [C.cS, C.cU, C.cA, C.cW]) pos(c, { left: 90, top: 560, width: 1000 });
  pos(C.fin, { top: 140 }); $('finI').style.height = '130px'; $('finW').style.width = '600px'; $('finB').style.fontSize = '56px'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '34px');
 } else {
  pos(C.lg, { top: 640 }); $('lgI').style.height = '220px'; $('lgW').style.width = '820px'; $('lgP').style.fontSize = '60px'; $('lgP').style.letterSpacing = '20px';
  pos(C.t1, { left: 0, width: 1080, top: 330, fontSize: '200px' }); pos(C.t2, { left: 0, width: 1080, top: 540, fontSize: '72px' }); pos(C.t3, { left: 40, width: 1000, top: 655, fontSize: '24px', letterSpacing: '6px' });
  pos(C.p1, { left: 0, width: 1080, top: 1010, fontSize: '64px' }); pos(C.p2, { left: 0, width: 1080, top: 1100, fontSize: '80px' });
  for (const c of [C.cS, C.cU, C.cA, C.cW]) pos(c, { left: 40, top: 1240, width: 1000 });
  pos(C.fin, { top: 300 }); $('finI').style.height = '130px'; $('finW').style.width = '560px'; $('finB').style.fontSize = '50px'; C.fin.querySelectorAll('.fr').forEach(e => e.style.fontSize = '30px');
 }
};
function slam(e, t, a, b, s0 = 1.6) { const v = vis(t, a, b, .01, .3); show(e, v > 0); if (!v) return 0; const k = eback(P(t, a, a + .4)); e.style.opacity = Math.min(1, P(t, a, a + .1)) * v; e.style.transform = `scale(${s0 - (s0 - 1) * k})`; return v }
DATA.render = function (t) {
 let fl = 0;
 // Champion presents
 { const a = .3, b = S('k2') - .4, v = vis(t, a, b, .5, .5); show(C.lg, v > 0); if (v) { C.lg.style.opacity = v; const k = eback(P(t, a, a + .7)); $('lgI').style.transform = `scale(${.5 + .5 * k})`;
   $('lgW').style.clipPath = `inset(0 ${100 - 100 * eo(P(t, a + .5, a + 1.4))}% 0 0)`; const tp = T('k1w1') - .1; $('lgP').style.opacity = P(t, tp, tp + .12); $('lgP').style.transform = `scale(${1.6 - .6 * eback(P(t, tp, tp + .4))})`;
   $('lgP').style.letterSpacing = ((V ? 20 : 22) - 8 * eo(P(t, tp, tp + 1.2))) + 'px'; if (P(t, tp, tp + .12) > 0 && P(t, tp, tp + .12) < 1) fl = Math.max(fl, .35) } }
 fl = Math.max(fl, vis(t, .3, .6, .01, .29) * .5);
 // title
 { const a = T('k2w0') - .15, b = S('k4') - .9; slam(C.t1, t, a, b, 1.7); if (P(t, a, a + .12) > 0 && P(t, a, a + .12) < 1) fl = Math.max(fl, .3); slam(C.t2, t, a + .5, b, 1.3);
   const v = vis(t, a + 1.0, b, .4, .3); show(C.t3, v > 0); if (v) { C.t3.style.opacity = v } }
 // promo
 { const b = S('q5') - .3; slam(C.p1, t, T('k35w7') - .1, b, 1.3); if (slam(C.p2, t, T('k35w10') - .1, b, 1.5) && P(t, T('k35w10') - .1, T('k35w10')) < 1) fl = Math.max(fl, .25) }
 const cd = (e, a, b) => { const v = vis(t, a, b, .3, .25); show(e, v > 0); if (v) { e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(P(t, a, a + .4))) * 60}px)` } return v };
 cd(C.cS, S('k36') - .15, S('k37') - .2); cd(C.cU, S('k37') - .15, S('q5') - .2); cd(C.cA, S('q5') - .15, S('q7') - .2); cd(C.cW, S('q7') - .15, S('q8') - .3);
 { const a = S('q8') - .3, o = t >= a; show(C.fin, o); if (o) { C.fin.style.opacity = P(t, a, a + .4); $('finB').style.transform = `scale(${1.3 - .3 * eback(P(t, a + .2, a + .6))})`;
   C.fin.querySelectorAll('.fr').forEach((e, i) => { const v = P(t, a + .5 + i * .2, a + .8 + i * .2); e.style.opacity = v; e.style.transform = `translateY(${(1 - eo(v)) * 30}px)` }) } fl = Math.max(fl, vis(t, a, a + .3, .01, .29) * .6) }
 return fl;
};
DATA.sfx = [['k1w1-0.1', 'hit', -7, true], ['k1w1-0.1', 'sparkle', -11], ['k2w0-0.15', 'hit', -7, true], ['k2w0-0.15', 'whoosh', -10], ['k35w10-0.1', 'hit', -9, true]];
DATA.endA = 'k37';
