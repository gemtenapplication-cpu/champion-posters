// Step 2 of 2 (after resize.py). Works in the source's coordinates (artwork group translated by -off).
//  * Background bands, anything touching the source edge (streaks, light beams) and full-width pattern rows
//    (checkers, kerbs, dots) are only cropped.
//  * Small decorations close to a side edge (corner brackets, side ticks) move inward by `off`, so they keep
//    their distance from the new edge.
//  * Artwork wider than the safe area is grouped with everything at the same height and scaled uniformly.
//  * Remaining logo / text groups are shrunk one by one only if they do not fit.
// Saves <base>_source.svg, <base>_PRINT.pdf and preview-<base>.png.   Usage: node fit.js <basename>
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const base = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p0 = await b.newPage(); await p0.goto('file://' + path.join(__dirname, base + '.html'));
  const [TW, H] = await p0.evaluate(() => { const v = document.querySelector('svg').viewBox.baseVal; return [v.width, v.height]; });
  await p0.close();
  const p = await b.newPage({ viewport: { width: Math.round(TW * 96), height: Math.round(H * 96) }, deviceScaleFactor: 30 / 96 });
  await p.goto('file://' + path.join(__dirname, base + '.html'));
  await p.evaluate(() => Promise.all(['900 1em Orbitron', '700 1em Rajdhani'].map(x => document.fonts.load(x))));
  const report = await p.evaluate(() => {
    const svgEl = document.querySelector('svg');
    const SW = +svgEl.dataset.sw, TW = +svgEl.dataset.tw, off = (SW - TW) / 2, CX = SW / 2;
    const SAFE_L = off + 0.6, SAFE_R = SW - off - 0.6, MAX_W = TW - 1.6, LOGO_W = TW * 0.8;
    const root = document.getElementById('art');
    const info = Array.from(root.children).map(el => {
      let bb; try { bb = el.getBBox(); } catch (e) { bb = { x: 0, y: 0, width: 0, height: 0 }; }
      const fill = el.getAttribute('fill') || '';
      return { el, bb, fit: el.classList.contains('fit'), kind: el.dataset.kind,
               glow: /url\(#(glow|.*Glow)/i.test(fill) || (/^(ellipse|circle)$/.test(el.tagName) && /url\(/.test(fill)) };
    });
    const rows = {};
    info.forEach(i => { if (i.bb.width < SW - 1 && !i.fit && i.bb.height <= 2.2) {
      const k = Math.round(i.bb.y * 10); (rows[k] = rows[k] || []).push(i); } });
    Object.values(rows).forEach(r => {
      const x0 = Math.min(...r.map(i => i.bb.x)), x1 = Math.max(...r.map(i => i.bb.x + i.bb.width));
      if (r.length >= 6 && x0 <= 1.0 && x1 >= SW - 1.0) r.forEach(i => (i.pattern = true));
    });
    const band = i => i.bb.width >= SW - 1 || (!i.fit && (i.bb.x < 0.3 || i.bb.x + i.bb.width > SW - 0.3));
    const out = [];
    // small edge decorations: move inward
    info.forEach(i => {
      if (band(i) || i.pattern || i.fit || i.glow || i.bb.width > TW * 0.35) return;
      if (i.bb.x < SAFE_L && i.bb.x + i.bb.width < CX) { i.el.setAttribute('transform', `translate(${off} 0)`); i.used = true; out.push({ part: 'edge decor ' + i.el.tagName + ' left', width: +i.bb.width.toFixed(2), scale: 1 }); }
      else if (i.bb.x + i.bb.width > SAFE_R && i.bb.x > CX) { i.el.setAttribute('transform', `translate(${-off} 0)`); i.used = true; out.push({ part: 'edge decor ' + i.el.tagName + ' right', width: +i.bb.width.toFixed(2), scale: 1 }); }
    });
    const content = info.filter(i => !band(i) && !i.pattern && i.kind !== 'logo' && !i.used);
    const over = content.filter(i => !i.fit && !i.glow && (i.bb.x < SAFE_L || i.bb.x + i.bb.width > SAFE_R));
    over.sort((a, c) => a.bb.y - c.bb.y);
    const blocks = [];
    over.forEach(i => {
      const y0 = i.bb.y, y1 = i.bb.y + i.bb.height, last = blocks[blocks.length - 1];
      if (last && y0 <= last.y1 + 1.0) last.y1 = Math.max(last.y1, y1); else blocks.push({ y0, y1 });
    });
    blocks.forEach(bl => {
      const members = content.filter(i => i.bb.y < bl.y1 + 0.05 && i.bb.y + i.bb.height > bl.y0 - 0.05 && !i.used);
      if (!members.length) return;
      members.forEach(i => (i.used = true));
      const solid = members.filter(i => !i.glow).length ? members.filter(i => !i.glow) : members;
      const x0 = Math.min(...solid.map(i => i.bb.x)), x1 = Math.max(...solid.map(i => i.bb.x + i.bb.width));
      const ys0 = Math.min(...members.map(i => i.bb.y)), ys1 = Math.max(...members.map(i => i.bb.y + i.bb.height));
      const s = Math.min(1, MAX_W / (x1 - x0)), cy = (ys0 + ys1) / 2, cx = (x0 + x1) / 2;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${CX} ${cy.toFixed(3)}) scale(${s.toFixed(4)}) translate(${(-cx).toFixed(3)} ${(-cy).toFixed(3)})`);
      root.insertBefore(g, members[0].el);
      members.forEach(i => g.appendChild(i.el));
      out.push({ part: `block y ${ys0.toFixed(1)}-${ys1.toFixed(1)} (${members.length} items)`, width: +(x1 - x0).toFixed(2), scale: +s.toFixed(3) });
    });
    info.filter(i => i.fit && !i.used).forEach(i => {
      const max = i.kind === 'logo' ? LOGO_W : MAX_W;
      const left = i.bb.x - off, right = TW - (i.bb.x + i.bb.width - off);
      let s = Math.min(1, max / i.bb.width);
      if (s === 1 && Math.min(left, right) < 0.6) s = Math.min(1, (TW - 1.2) / i.bb.width);   // off-centre text near an edge
      const y = +i.el.dataset.y;
      if (s < 1) i.el.setAttribute('transform', `translate(${CX} ${y}) scale(${s.toFixed(4)}) translate(${-CX} ${-y})`);
      out.push({ part: (i.el.textContent || '').trim().slice(0, 30) || 'logo', width: +i.bb.width.toFixed(2), scale: +s.toFixed(3) });
    });
    document.querySelectorAll('g.fit').forEach(g => { g.removeAttribute('class'); delete g.dataset.kind; delete g.dataset.y; });
    delete svgEl.dataset.sw; delete svgEl.dataset.tw;
    return out;
  });
  console.table(report);
  let svg = await p.evaluate(() => document.querySelector('svg').outerHTML);
  if (!/^<svg[^>]*xmlns=/.test(svg)) svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  fs.writeFileSync(path.join(__dirname, base + '_source.svg'), svg);
  await p.pdf({ path: path.join(__dirname, base + '_PRINT.pdf'), width: TW + 'in', height: H + 'in', printBackground: true });
  await p.screenshot({ path: path.join(__dirname, 'preview-' + base + '.png') });
  await b.close();
})();
