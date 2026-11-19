// Turns a resize.py page (16in artwork inside translate(-2 0) on a 12in face) into the final 12in face.
//  * Background bands, anything touching the face edge (speed streaks) and full-width pattern rows
//    (checkers, kerbs) are left alone and simply cropped.
//  * Artwork wider than the safe area (x 2.6..13.4 in 16in coordinates) is grouped with everything that sits
//    in the same height range and that whole block is scaled uniformly about x = 8, so rows, numbers and
//    labels stay aligned.
//  * Remaining logo / text groups (.fit) are shrunk one by one only if they do not fit.
// Then saves <base>_source.svg, <base>_PRINT.pdf and preview-<base>.png.  Usage: node fit.js <basename>
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const base = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 12 * 96, height: 120 * 96 }, deviceScaleFactor: 30 / 96 });
  await p.goto('file://' + path.join(__dirname, base + '.html'));
  await p.evaluate(() => Promise.all(['900 1em Orbitron', '700 1em Rajdhani'].map(x => document.fonts.load(x))));
  const report = await p.evaluate(() => {
    const SAFE_L = 2.6, SAFE_R = 13.4, MAX_W = 10.4, LOGO_W = 9.6;
    const root = document.querySelector('svg > g[transform="translate(-2 0)"]');
    const kids = Array.from(root.children);
    const info = kids.map(el => {
      let bb; try { bb = el.getBBox(); } catch (e) { bb = { x: 0, y: 0, width: 0, height: 0 }; }
      const fill = (el.getAttribute('fill') || '');
      return { el, bb, fit: el.classList.contains('fit'), kind: el.dataset.kind,
               glow: /url\(#(glow|.*Glow)/i.test(fill) || el.tagName === 'ellipse' && /url\(/.test(fill) };
    });
    // full-width bands, and rows of small pieces that together span the full width (checkers, kerb)
    const band = i => i.bb.width >= 15 || (!i.fit && (i.bb.x < 0.3 || i.bb.x + i.bb.width > 15.7));   // touches the edge: background
    const rows = {};
    info.forEach(i => { if (i.bb.width < 15 && !i.fit && i.bb.height <= 2.2) {
      const k = Math.round(i.bb.y * 10); (rows[k] = rows[k] || []).push(i); } });
    Object.values(rows).forEach(r => {
      const x0 = Math.min(...r.map(i => i.bb.x)), x1 = Math.max(...r.map(i => i.bb.x + i.bb.width));
      if (r.length >= 6 && x0 <= 1.0 && x1 >= 15.0) r.forEach(i => (i.pattern = true));
    });
    const content = info.filter(i => !band(i) && !i.pattern && i.kind !== 'logo');
    const over = content.filter(i => !i.fit && !i.glow && (i.bb.x < SAFE_L || i.bb.x + i.bb.width > SAFE_R));
    // cluster overflowing artwork by height, then pull in everything in that height range
    over.sort((a, c) => a.bb.y - c.bb.y);
    const blocks = [];
    over.forEach(i => {
      const y0 = i.bb.y, y1 = i.bb.y + i.bb.height, last = blocks[blocks.length - 1];
      if (last && y0 <= last.y1 + 1.0) last.y1 = Math.max(last.y1, y1); else blocks.push({ y0, y1 });
    });
    const out = [];
    blocks.forEach(bl => {
      const members = content.filter(i => i.bb.y < bl.y1 + 0.05 && i.bb.y + i.bb.height > bl.y0 - 0.05 && !i.used);
      members.forEach(i => (i.used = true));
      const x0 = Math.min(...members.filter(i => !i.glow).map(i => i.bb.x));
      const x1 = Math.max(...members.filter(i => !i.glow).map(i => i.bb.x + i.bb.width));
      const ys0 = Math.min(...members.map(i => i.bb.y)), ys1 = Math.max(...members.map(i => i.bb.y + i.bb.height));
      const s = Math.min(1, MAX_W / (x1 - x0)), cy = (ys0 + ys1) / 2, cx = (x0 + x1) / 2;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(8 ${cy.toFixed(3)}) scale(${s.toFixed(4)}) translate(${(-cx).toFixed(3)} ${(-cy).toFixed(3)})`);
      root.insertBefore(g, members[0].el);
      members.forEach(i => g.appendChild(i.el));
      out.push({ part: `block y ${ys0.toFixed(1)}-${ys1.toFixed(1)} (${members.length} items)`, width: +(x1 - x0).toFixed(2), scale: +s.toFixed(3) });
    });
    info.filter(i => i.fit && !i.used).forEach(i => {
      const max = i.kind === 'logo' ? LOGO_W : MAX_W;
      const s = Math.min(1, max / i.bb.width), y = +i.el.dataset.y;
      if (s < 1) i.el.setAttribute('transform', `translate(8 ${y}) scale(${s.toFixed(4)}) translate(-8 ${-y})`);
      out.push({ part: (i.el.textContent || '').trim().slice(0, 30) || 'logo', width: +i.bb.width.toFixed(2), scale: +s.toFixed(3) });
    });
    document.querySelectorAll('g.fit').forEach(g => { g.removeAttribute('class'); delete g.dataset.kind; delete g.dataset.y; });
    return out;
  });
  console.table(report);
  let svg = await p.evaluate(() => document.querySelector('svg').outerHTML);
  if (!/^<svg[^>]*xmlns=/.test(svg)) svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  fs.writeFileSync(path.join(__dirname, base + '_source.svg'), svg);
  await p.pdf({ path: path.join(__dirname, base + '_PRINT.pdf'), width: '12in', height: '120in', printBackground: true });
  await p.screenshot({ path: path.join(__dirname, 'preview-' + base + '.png') });
  await b.close();
})();
