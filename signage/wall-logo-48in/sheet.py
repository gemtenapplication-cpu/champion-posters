"""Size sheet PDF (A4 landscape, 2 pages) for the 14-piece 48in wall logo. Reads pieces.json from build.py."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
m = json.load(open(os.path.join(HERE, 'pieces.json')))
P = m['pieces']; X0, Y0, LW, LH = m['x0'], m['y0'], m['logo_w'], m['letter_h']
STICKER_LOGO_TOP = float(os.environ.get('LOGO_TOP', '46.27'))  # logo top measured from the top of the 120in wall sticker
NOTES = {'L-P': 'inner window cut out', 'L-O': 'inner window cut out', 'T-collar': 'very thin: 3 mm tall',
         'T-star': 'sits inside the cup'}
def row(q):
    w, h = q['w'], q['h']
    return (f'<tr><td class="id">{q["id"]}</td><td>{q["name"]}</td>'
            f'<td class="n"><b>{w:.2f}″</b></td><td class="n"><b>{h:.2f}″</b></td>'
            f'<td class="n">{w*2.54:.1f} × {h*2.54:.1f}</td><td class="n">{w*25.4:.0f} × {h*25.4:.0f}</td>'
            f'<td class="n">{q["x"]-X0:.2f}″</td><td class="n">{q["y"]-Y0:.2f}″</td><td class="n">{q["x"]:.2f}″</td>'
            f'<td class="note">{NOTES.get(q["id"], "")}</td></tr>')
head = ('<tr><th>ID</th><th>Piece</th><th>Width</th><th>Height</th><th>W × H (cm)</th><th>W × H (mm)</th>'
        '<th>X from logo left</th><th>Y from logo top</th><th>X from wall left</th><th>Note</th></tr>')
letters = ''.join(row(q) for q in P if q['id'].startswith('L'))
trophy = ''.join(row(q) for q in P if q['id'].startswith('T'))
# diagram: logo pieces on the 48in wall strip, with dimension lines
pad = 1.4
vb = f'-0.6 -1.6 {48+1.2} {LH+2*pad+1.6}'
shapes = ''.join(f'<path d="{q["d"]}" transform="translate(0 {-Y0+pad})" fill="{"#E8EEF8" if q["id"].startswith("L") else "#2B83F6"}" stroke="{q["color"]}" stroke-width="0.03" fill-rule="evenodd"/>' for q in P)
labels = ''.join(f'<text x="{q["x"]+q["w"]/2:.3f}" y="{pad+LH+0.75:.3f}" class="lb">{q["id"]}</text>' for q in P if q['id'].startswith('L'))
dim = f'''
<rect x="0" y="0" width="48" height="{LH+2*pad}" fill="none" stroke="#9AA6B8" stroke-width="0.04" stroke-dasharray="0.3 0.2"/>
<g class="dl"><line x1="0" y1="-0.9" x2="48" y2="-0.9"/><line x1="0" y1="-1.2" x2="0" y2="-0.6"/><line x1="48" y1="-1.2" x2="48" y2="-0.6"/></g>
<text x="24" y="-1.05" class="dt">WALL 48″ (4 ft) · 121.9 cm</text>
<g class="dl b"><line x1="{X0}" y1="-0.3" x2="{X0+LW}" y2="-0.3"/><line x1="{X0}" y1="-0.5" x2="{X0}" y2="{pad}"/><line x1="{X0+LW}" y1="-0.5" x2="{X0+LW}" y2="{pad}"/></g>
<text x="24" y="-0.42" class="dt b">LOGO {LW:.2f}″ · {LW*2.54:.1f} cm</text>
<text x="{X0/2}" y="{pad+LH/2+0.15}" class="dt s">{X0:.2f}″</text><text x="{48-X0/2}" y="{pad+LH/2+0.15}" class="dt s">{X0:.2f}″</text>
'''
html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}}
@font-face{{font-family:Orbitron;font-weight:700;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-700-normal.woff2)}}
@font-face{{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}}
@font-face{{font-family:Rajdhani;font-weight:600;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-600-normal.woff2)}}
@page{{size:A4 landscape;margin:12mm}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:Rajdhani,sans-serif;color:#0B0B0C;font-weight:600}}
.page{{page-break-after:always;height:183mm;position:relative;overflow:hidden}}
.page:last-child{{page-break-after:auto}}
.top{{display:flex;align-items:center;justify-content:space-between;border-bottom:1.2mm solid #2B83F6;padding-bottom:3mm}}
h1{{font-family:Orbitron;font-weight:900;font-size:19pt;letter-spacing:.5pt}}
h1 span{{color:#2B83F6}}
.badge{{font-family:Orbitron;font-weight:700;font-size:9pt;color:#fff;background:#2B83F6;border-radius:20mm;padding:2mm 4mm}}
.sub{{font-size:11pt;color:#3a4250;margin-top:2mm}}
.kpis{{display:flex;gap:4mm;margin-top:5mm}}
.k{{flex:1;border:.4mm solid #CFE0FA;border-radius:3mm;padding:3mm 4mm;background:#F4F8FF}}
.k b{{display:block;font-family:Orbitron;font-weight:900;font-size:15pt;color:#1F6FE5}}
.k small{{font-size:9.5pt;color:#3a4250}}
svg.dia{{width:100%;margin-top:6mm}}
.dl line{{stroke:#5B6575;stroke-width:.035}} .dl.b line{{stroke:#2B83F6}}
.dt{{font-family:Orbitron;font-weight:700;font-size:.42px;text-anchor:middle;fill:#3a4250}} .dt.b{{fill:#1F6FE5}} .dt.s{{font-size:.36px}}
.lb{{font-family:Orbitron;font-weight:700;font-size:.38px;text-anchor:middle;fill:#5B6575}}
.legend{{display:flex;gap:7mm;font-size:10pt;margin-top:3mm;color:#3a4250}}
.legend i{{display:inline-block;width:8mm;height:3mm;border-radius:1mm;margin-right:2mm;vertical-align:middle}}
h2{{font-family:Orbitron;font-weight:700;font-size:10.5pt;margin:3.5mm 0 1.5mm;color:#1F6FE5;letter-spacing:.5pt}}
table{{width:100%;border-collapse:collapse;font-size:10pt}}
th{{font-family:Orbitron;font-weight:700;font-size:7pt;letter-spacing:.3pt;text-align:left;background:#0B0B0C;color:#fff;padding:1.6mm 2.2mm}}
td{{padding:1.15mm 2.2mm;border-bottom:.3mm solid #E3EAF5}}
tr:nth-child(even) td{{background:#F7FAFF}}
td.n{{font-variant-numeric:tabular-nums;white-space:nowrap}} td.id{{font-family:Orbitron;font-weight:700;font-size:8.5pt;color:#1F6FE5}}
td.note{{color:#B4231A;font-size:9.5pt}}
.notes{{margin-top:3mm;font-size:9.5pt;color:#3a4250;line-height:1.35}}
.notes li{{margin-left:5mm}}
.foot{{position:absolute;bottom:0;left:0;right:0;font-size:8.5pt;color:#7a8597;display:flex;justify-content:space-between}}
</style></head><body>
<div class="page">
  <div class="top"><div><h1>CHAMPION <span>WALL LOGO</span> · ACRYLIC PIECES</h1>
  <div class="sub">4 ft (48″) office wall · same style as the 72″ waiting-zone logo (Champion_05), scaled to exactly 2/3 · white letters + blue trophy icon</div></div>
  <div class="badge">14 PIECES</div></div>
  <div class="kpis">
    <div class="k"><b>{LW:.2f}″</b><small>Logo width · {LW*2.54:.1f} cm · {LW*25.4:.0f} mm</small></div>
    <div class="k"><b>{LH:.2f}″</b><small>Letter height · {LH*2.54:.1f} cm · {LH*25.4:.0f} mm</small></div>
    <div class="k"><b>{X0:.2f}″</b><small>Gap left &amp; right on a 48″ wall · {X0*2.54:.1f} cm</small></div>
    <div class="k"><b>7 + 7</b><small>Letters C H A M P O N + trophy icon pieces</small></div>
  </div>
  <svg class="dia" viewBox="{vb}">{dim}{shapes}{labels}</svg>
  <div class="legend"><span><i style="background:#E8EEF8;border:.3mm solid #E10600"></i>Letters (7) · red cut line</span><span><i style="background:#2B83F6;border:.3mm solid #0047FF"></i>Trophy icon (7) · blue cut line</span><span>The trophy sits in place of the letter I.</span></div>
  <div class="notes"><b>On the 4 ft × 10 ft wall sticker</b> the logo top is <b>{STICKER_LOGO_TOP:.2f}″</b> from the sticker top ({120-STICKER_LOGO_TOP-LH:.2f}″ from the sticker bottom). The sticker prints a thin, faint outline of every piece at this exact size and spot, so each acrylic piece goes straight onto its outline.</div>
  <div class="foot"><span>Cut file: champion-wall-48in-cut-14pcs.svg (real size, inches)</span><span>Page 1 / 2</span></div>
</div>
<div class="page">
  <div class="top"><h1>PIECE <span>SIZES</span></h1><div class="badge">INCH · CM · MM</div></div>
  <h2>LOGO LETTERS · 7 PIECES</h2><table>{head}{letters}</table>
  <h2>TROPHY ICON · 7 PIECES</h2><table>{head}{trophy}</table>
  <ul class="notes">
    <li>Sizes are the outer bounding box of each piece. X / Y = top-left corner of that box.</li>
    <li>At this size the trophy is small: collar is only 3 mm tall and some trophy pieces are just 1 mm apart (collar–stem, podium 1st–2nd, 1st–3rd). Ask the cutter whether to keep them separate or join collar + stem and the 3 podium steps into one piece.</li>
    <li>Thickness, colour and standoffs: same as the 72″ waiting-zone logo, or as your acrylic shop advises.</li>
  </ul>
  <div class="foot"><span>CHAMPION · wall logo 48″ · all sizes from the official logo geometry</span><span>Page 2 / 2</span></div>
</div></body></html>'''
open(os.path.join(HERE, 'size-sheet.html'), 'w').write(html)
