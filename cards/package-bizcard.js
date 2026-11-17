// Packs the business card files into a zip with a preview sheet, emboss guide and printer README.
// Run after build-bizcard.js:  node cards/package-bizcard.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const DIR = __dirname;
const PRINT = path.join(DIR, 'print');
const NAME = 'Champion-Business-Card';
const STAGE = path.join(DIR, 'build-pkg', NAME);
const ZIP = path.join(DIR, NAME + '.zip');
const F = path.join(DIR, '..', 'node_modules', '@fontsource');
const p = (n) => path.join(PRINT, `champion-card-${n}`);

const README = `CHAMPION — বিজনেস কার্ড (প্রিন্ট ফাইল)
==========================================

সাইজ
----
• কার্ড: 3.5 x 2 ইঞ্চি (88.9 x 50.8 mm) — স্ট্যান্ডার্ড বিজনেস কার্ড সাইজ।
• ফাইলে চারপাশে 3 mm ব্লিড আছে, তাই ফাইলের সাইজ 94.9 x 56.8 mm।
  কাটার পর কার্ড হবে 88.9 x 50.8 mm।
• সব লেখা কাটার লাইন থেকে অন্তত 3 mm ভেতরে।

ফোল্ডার
-------
  day-mode/    সাদা-নীল ডিজাইন (দিনের আলো / উজ্জ্বল জায়গার জন্য)
  night-mode/  ডার্ক নেভি ডিজাইন
  emboss/      এমবসের মাস্ক ফাইল + গাইড ছবি
  00-preview.jpg  সব ডিজাইন একসাথে

প্রতিটি মোডে:
  champion-card-<mode>-front.pdf      সামনের পাশ (প্রেসে এটা দিন)
  champion-card-<mode>-back.pdf       পেছনের পাশ — কমিউনিটি QR
  champion-card-<mode>_front+back.pdf দুই পাশ এক ফাইলে (পেজ ১ = সামনে, পেজ ২ = পেছনে)
  .png ফাইল                            একই ডিজাইন 600 DPI ছবি হিসেবে (PDF না চললে)

প্রিন্টের নোট
-------------
• পেপার: সাধারণত 350–400 gsm আর্ট কার্ড; দুই পাশে ম্যাট লেমিনেশন।
• এমবস: শুধু সামনের পাশের CHAMPION লোগো (ওয়ার্ডমার্ক) এমবস হবে।
  emboss/champion-card-emboss-mask-front.pdf ফাইলে কালো অংশ = উঁচু হবে, সাদা = সমান থাকবে।
  মাস্ক আর ডিজাইন একই সাইজ ও একই পজিশনে, তাই রেজিস্ট্রেশন মিলবে।
  প্রিন্ট আর লেমিনেশনের পরে এমবস করুন।
• পেছনের দিক: ডাই-এমবসের চাপে পেছনে হালকা উল্টো দাগ পড়ে।
  ব্যাক সাইড head-to-head ছাপুন (কার্ড বইয়ের পাতার মতো ডানে-বামে উল্টালে পেছনটা সোজা দেখাবে)।
  তাহলে দাগ পড়বে পেছনের ওপরের ডান দিকের ফাঁকা জায়গায় — কোনো লেখা বা QR কোডে না।
  emboss/emboss-guide.jpg ছবিতে লাল অংশটা দেখুন।
• QR কোডের ওপর কোনো এমবস বা স্পট UV করবেন না — QR সমান থাকতে হবে।
• প্রেস যদি ডাই-এমবসের বদলে "রেইজড স্পট UV" (উঁচু UV) দেয়, একই মাস্ক ফাইল দিয়েই হবে,
  আর সেক্ষেত্রে পেছনে কোনো দাগ পড়বে না।
• ম্যাট লেমিনেশনে রং একটু গাঢ় আর কম উজ্জ্বল দেখায়, বিশেষ করে নাইট মোডে।
  ফাইল RGB-তে; CMYK-তে কনভার্ট করলে ব্র্যান্ড ব্লু #2B83F6 ঠিক আছে কিনা প্রুফে দেখে নিন।
• QR কোড টেস্ট করা হয়েছে: স্ক্যান করলে https://champion.gemten.com.bd/champion-community খোলে।
  প্রুফ হাতে পেলে একবার ফোনে স্ক্যান করে দেখুন।

তথ্যের উৎস: champion.gemten.com.bd (ঠিকানা, ফোন, ইমেইল, খোলার সময়, কমিউনিটি)।
`;

const sheet = () => {
  const img = (n, label) => `<figure><div class="card"><img src="file://${p(n)}.png"></div><figcaption>${label}</figcaption></figure>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Orbitron;font-weight:900;src:url(file://${F}/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(file://${F}/rajdhani/files/rajdhani-latin-600-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(file://${F}/rajdhani/files/rajdhani-latin-700-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1700px;padding:44px 50px;background:#E6EBF2;font-family:Rajdhani,sans-serif;color:#0B0B0C}
h1{font-family:Orbitron;font-weight:900;font-size:34px}h1 em{font-style:normal;color:#2B83F6}
.sub{font-size:21px;font-weight:600;color:#0B0B0C99;margin:6px 0 26px}
.g{display:grid;grid-template-columns:1fr 1fr;gap:34px 40px}
figure{margin:0}
/* show the trimmed card: hide the 3 mm bleed */
.card{width:100%;aspect-ratio:88.9/50.8;overflow:hidden;position:relative;border-radius:10px;box-shadow:0 10px 26px #0B163033}
.card img{position:absolute;width:${(94.9 / 88.9 * 100).toFixed(3)}%;left:${(-3 / 88.9 * 100).toFixed(3)}%;top:${(-3 / 50.8 * 100).toFixed(3)}%}
figcaption{font-size:21px;font-weight:700;margin-top:12px}
figcaption span{color:#1F6FE5}
</style></head><body>
<h1>CHAMPION <em>·</em> Business Card</h1>
<div class="sub">3.5 × 2 in (88.9 × 50.8 mm) · matte lamination · embossed wordmark on the front · shown trimmed (files include 3 mm bleed)</div>
<div class="g">
 ${img('day-front', '<span>DAY</span> · Front')}${img('day-back', '<span>DAY</span> · Back — community QR')}
 ${img('night-front', '<span>NIGHT</span> · Front')}${img('night-back', '<span>NIGHT</span> · Back — community QR')}
</div></body></html>`;
};

(async () => {
  fs.rmSync(path.join(DIR, 'build-pkg'), { recursive: true, force: true });
  for (const d of ['day-mode', 'night-mode', 'emboss']) fs.mkdirSync(path.join(STAGE, d), { recursive: true });
  for (const mode of ['day', 'night']) {
    for (const side of ['front', 'back']) for (const ext of ['pdf', 'png'])
      fs.copyFileSync(`${p(`${mode}-${side}`)}.${ext}`, path.join(STAGE, `${mode}-mode`, `champion-card-${mode}-${side}.${ext}`));
    execFileSync('pdfunite', [`${p(`${mode}-front`)}.pdf`, `${p(`${mode}-back`)}.pdf`, path.join(STAGE, `${mode}-mode`, `champion-card-${mode}_front+back.pdf`)]);
  }
  for (const ext of ['pdf', 'png']) fs.copyFileSync(`${p('emboss-mask-front')}.${ext}`, path.join(STAGE, 'emboss', `champion-card-emboss-mask-front.${ext}`));
  // emboss guide: mask on the front (red) and where it presses through on the back (head-to-head flip)
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image, ImageOps
P, out = sys.argv[1], sys.argv[2]
m = Image.open(P+'emboss-mask-front.png').convert('L').point(lambda v: 255 if v < 128 else 0)
fr = Image.open(P+'day-front.png').convert('RGB'); bk = Image.open(P+'day-back.png').convert('RGB')
red = Image.new('RGB', fr.size, (255, 0, 60))
f2 = Image.composite(Image.blend(fr, red, .55), fr, m)
b2 = Image.composite(Image.blend(bk, red, .45), bk, ImageOps.mirror(m))
w, h = fr.size; o = Image.new('RGB', (w*2+60, h), (230, 235, 242)); o.paste(f2, (0, 0)); o.paste(b2, (w+60, 0))
o.thumbnail((2000, 800)); o.save(out, quality=90)
`, path.join(PRINT, 'champion-card-'), path.join(STAGE, 'emboss', 'emboss-guide.jpg')]);
  fs.writeFileSync(path.join(STAGE, 'README.txt'), README);

  const html = path.join(DIR, 'build-pkg', 'sheet.html');
  fs.writeFileSync(html, sheet());
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 900 } });
  await page.goto('file://' + html);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
  await page.screenshot({ path: path.join(STAGE, '00-preview.jpg'), fullPage: true, type: 'jpeg', quality: 90 });
  await browser.close();

  fs.rmSync(ZIP, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', ZIP, NAME], { cwd: path.join(DIR, 'build-pkg') });
  console.log('wrote', ZIP, (fs.statSync(ZIP).size / 1e6).toFixed(1) + ' MB');
})();
