// usage: node render.js <startFrame> <endFrame> <outfile.mov>   |  node render.js --test t1,t2,...
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: process.env.FMT==='v'?{ width: 1080, height: 1920 }:{ width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()) });
  await page.goto('file://' + path.join(__dirname, 'overlay.html') + '?fmt=' + (process.env.FMT||'h'), { waitUntil: 'networkidle' });
  await page.evaluate(() => window.init());
  if (process.argv[2] === '--test') {
    for (const t of process.argv[3].split(',').map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: path.join(__dirname, 'test', `ov_${process.env.FMT||'h'}_${t}.png`), omitBackground: true });
    }
    await browser.close(); return;
  }
  const [s, e, out] = [parseInt(process.argv[2]), parseInt(process.argv[3]), process.argv[4]];
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-c:v', 'qtrle', '-pix_fmt', 'argb', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = s; f < e; f++) {
    await page.evaluate(t => render(t), f / 30);
    const buf = await page.screenshot({ omitBackground: true, type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log(out, f);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
})();
