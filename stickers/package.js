// Packs stickers/print/* into a zip with a preview sheet, README and brand logos.
// Run after build.js:  node stickers/package.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..');
const PRINT = path.join(DIR, 'print');
const NAME = 'Champion-Window-Door-Stickers';
const STAGE = path.join(DIR, 'build-pkg', NAME);
const ZIP = path.join(DIR, NAME + '.zip');
const list = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
const by = Object.fromEntries(list.map(s => [s.id.slice(0, 2), s]));
const cm = n => (n * 2.54).toFixed(1).replace(/\.0$/, '');

// Bangla placement notes for the printer / fitter
const where = {
  '01': 'মূল কাচের দরজা, চোখের লেভেলে (মাঝখান মেঝে থেকে ~150 cm)',
  '02': 'দরজার হাতলের পাশে — যে দিক থেকে ঠেলতে হয়',
  '03': 'দরজার হাতলের পাশে — যে দিক থেকে টানতে হয়',
  '04': 'কাচের দরজা/জানালায় আড়াআড়ি বর্ডার (মেঝে থেকে ~140–160 cm) — কাচের মাপে কেটে নিন, যাতে কেউ কাচে ধাক্কা না খায়',
  '05': 'দরজা বা জানালা — রিমুভেবল ভিনাইলে প্রিন্ট করুন, ওপেনিং-এর দিন তুলে ফেলবেন',
  '06': 'বিল্ডিংয়ের নিচতলার গেট/সিঁড়ির মুখে — বিল্ডিং কর্তৃপক্ষের অনুমতি নিয়ে লাগাবেন',
  '07': 'রাস্তার দিকের বড় জানালা — দূর থেকে পড়া যায় এমন বড় লেখা',
  '08': 'জানালা/সামনের কাচ — PS5 প্যানেল',
  '09': 'জানালা/সামনের কাচ — গেমিং PC প্যানেল',
  '10': 'এন্ট্রান্সের কাচ বা রিসেপশনের পাশে — QR স্ক্যান করে বুকিং',
};

function readme() {
  const row = s => ` ${s.id.slice(0, 2)}  ${s.name}.pdf / .png\n     সাইজ: ${s.w} x ${s.h} ইঞ্চি (${cm(s.w)} x ${cm(s.h)} cm)  ·  PNG ${s.dpi} DPI\n     কোথায়: ${where[s.id.slice(0, 2)]}\n`;
  const door = list.filter(s => s.folder === 'door');
  const win = list.filter(s => s.folder === 'window');
  return `CHAMPION GAMING ZONE — জানালা ও দরজার স্টিকার (প্রিন্ট ফাইল)
=================================================================

এই ফোল্ডারে যা আছে
-------------------
  00-preview-all.jpg   সব ডিজাইন একসাথে দেখার জন্য
  door/                দরজার স্টিকার (৬টি)
  window/              জানালার স্টিকার (৪টি)
  logo-files/          অরিজিনাল লোগো (ট্রান্সপারেন্ট PNG) — কাট-ভিনাইল বা অন্য কাজে

প্রতিটি ডিজাইনের ২টি ফাইল:
  .pdf  প্রিন্টের মূল ফাইল — লেখা ভেক্টর, বড় সাইজেও শার্প থাকবে। প্রেসে এটাই দিন।
  .png  একই ডিজাইন ছবি হিসেবে (PDF না চললে এটা ব্যবহার করুন)

ব্লিড: সব ফাইলে চারপাশে 0.125 ইঞ্চি (3 mm) ব্লিড দেওয়া আছে।
নিচের সাইজগুলো কাটার পর ফাইনাল সাইজ (ট্রিম সাইজ)।

দরজা — door/
-------------
${door.map(row).join('\n')}
জানালা — window/
----------------
${win.map(row).join('\n')}
প্রিন্টের নোট
--------------
• ম্যাটেরিয়াল: প্রিন্টেড ভিনাইল স্টিকার + ল্যামিনেশন (কাচে লাগানোর জন্য)।
  রাস্তার দিকের জানালায় (06) চাইলে one-way vision ভিনাইল ব্যবহার করা যায় —
  ভেতর থেকে বাইরে দেখা যাবে।
• 05 OPENING SOON স্টিকারটি রিমুভেবল ভিনাইলে করুন, ওপেনিং-এর পর তুলে ফেলবেন।
• 04 সেফটি ব্যান্ডটি 48 ইঞ্চি লম্বা — দরজা/জানালার চওড়া অনুযায়ী কেটে নিন,
  বড় জানালার জন্য একাধিক কপি পাশাপাশি লাগান।
• 10 নম্বরটি বিল্ডিংয়ের কমন জায়গায় লাগবে — আগে বিল্ডিং কর্তৃপক্ষের অনুমতি নিন।
• ফাইলগুলো RGB কালারে। প্রেস CMYK-তে কনভার্ট করলে একটা প্রুফ দেখে নিন —
  ব্র্যান্ড ব্লু #2B83F6 যেন ধূসর/বেগুনি না হয়ে যায়।
• 01 আর 10-এর QR কোড টেস্ট করা হয়েছে: স্ক্যান করলে
  https://champion.gemten.com.bd খোলে। প্রিন্টের পর লাগানোর আগে একবার ফোনে স্ক্যান করে দেখুন।
• আপনার কাচের মাপ আলাদা হলে মাপ জানালে ঐ সাইজে নতুন ফাইল বানিয়ে দেওয়া যাবে।

ব্র্যান্ড কালার: Blue #2B83F6 · Light blue #4DA3FF · Deep blue #1F6FE5 · Near-black #0B0B0C
ফন্ট: Orbitron + Rajdhani (PDF-এ এমবেড করা আছে, আলাদা ইনস্টল লাগবে না)
`;
}

function sheetHtml() {
  const card = (k, span = 1, h = 520) => {
    const s = by[k];
    const img = path.join(PRINT, s.folder, s.name + '.png');
    return `<div class="card" style="grid-column:span ${span}"><div class="im" style="height:${h}px"><img src="file://${img}"></div>
<div class="lb"><b>${k}</b> ${s.title}<span>${s.w} × ${s.h} in · ${cm(s.w)} × ${cm(s.h)} cm</span></div></div>`;
  };
  const F = path.join(ROOT, 'node_modules/@fontsource');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(file://${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(file://${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(file://${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1800px;background:#E9EEF6;font-family:Rajdhani,sans-serif;color:#0B0B0C;padding:50px}
h1{font-family:Orbitron;font-weight:900;font-size:40px;letter-spacing:2px}
h1 em{font-style:normal;color:#2B83F6}
.sub{font-size:22px;font-weight:600;color:#0B0B0C99;margin:6px 0 30px}
h2{font-family:Orbitron;font-weight:900;font-size:22px;letter-spacing:6px;color:#1F6FE5;margin:34px 0 14px}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.card{background:#fff;border-radius:18px;padding:18px;border:2px solid #2B83F622}
.im{display:flex;align-items:center;justify-content:center;background:repeating-conic-gradient(#f3f5f9 0 25%,#fff 0 50%) 0 0/24px 24px;border-radius:10px}
.im img{max-width:100%;max-height:100%;box-shadow:0 4px 14px #0B0B0C33}
.lb{font-size:21px;font-weight:600;margin-top:12px;line-height:1.25}
.lb b{display:inline-block;background:#2B83F6;color:#fff;font-weight:700;border-radius:8px;padding:0 8px;margin-right:6px}
.lb span{display:block;color:#1F6FE5;font-weight:700;font-size:19px}
</style></head><body>
<h1>CHAMPION <em>·</em> Window &amp; Door Stickers</h1>
<div class="sub">${list.length} print-ready designs · PDF + PNG · 0.125 in bleed included · sizes shown are trim sizes</div>
<h2>WINDOW</h2>
<div class="g">${card('07', 3, 760)}${card('08')}${card('09')}${card('10')}</div>
<h2>DOOR</h2>
<div class="g">${card('01')}${card('06')}${card('05', 1, 520)}${card('02', 1, 200)}${card('03', 1, 200)}<div></div>${card('04', 3, 160)}</div>
</body></html>`;
}

(async () => {
  fs.rmSync(path.join(DIR, 'build-pkg'), { recursive: true, force: true });
  fs.mkdirSync(STAGE, { recursive: true });
  for (const sub of ['door', 'window']) fs.cpSync(path.join(PRINT, sub), path.join(STAGE, sub), { recursive: true });
  fs.mkdirSync(path.join(STAGE, 'logo-files'));
  for (const f of ['logo-color-on-light', 'logo-black', 'logo-white', 'trophy-blue', 'trophy-gradient', 'trophy-white', 'trophy-black'])
    fs.copyFileSync(path.join(ROOT, 'brand', f + '.png'), path.join(STAGE, 'logo-files', f + '.png'));
  fs.writeFileSync(path.join(STAGE, 'README.txt'), readme());

  const sheet = path.join(DIR, 'build-pkg', 'sheet.html');
  fs.writeFileSync(sheet, sheetHtml());
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } });
  await page.goto('file://' + sheet);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
  await page.screenshot({ path: path.join(STAGE, '00-preview-all.jpg'), fullPage: true, type: 'jpeg', quality: 88 });
  await browser.close();

  fs.rmSync(ZIP, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', ZIP, NAME], { cwd: path.join(DIR, 'build-pkg') });
  console.log('wrote', ZIP, (fs.statSync(ZIP).size / 1e6).toFixed(1) + ' MB');
})();
