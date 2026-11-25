// usage: FMT=h|v node render2.js <startFrame> <endFrame> <out.mp4> <base.mp4>
// renders overlay frames and composites them over the base video segment in one pass (no huge intermediates)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const V = process.env.FMT === 'v';
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: V ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.goto('file://' + path.join(process.cwd(), 'overlay.html') + '?fmt=' + (V ? 'v' : 'h'), { waitUntil: 'networkidle' });
  await page.evaluate(() => window.init());
  const [s, e, out, base] = [parseInt(process.argv[2]), parseInt(process.argv[3]), process.argv[4], process.argv[5]];
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-ss', (s / 30).toFixed(4), '-i', base, '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-filter_complex', '[0:v]fps=30,setpts=PTS-STARTPTS[b];[b][1:v]overlay=0:0:format=auto:shortest=1,format=yuv420p[o]', '-map', '[o]',
    '-frames:v', String(e - s), '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = s; f < e; f++) {
    await page.evaluate(t => render(t), f / 30);
    const buf = await page.screenshot({ omitBackground: true, type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log(out, f);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
})();
