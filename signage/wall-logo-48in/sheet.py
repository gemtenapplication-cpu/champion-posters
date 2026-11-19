"""Size sheet PDF (A4 landscape, 3 pages) for the 21-piece 48in wall logo. Reads pieces.json from build.py."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
m = json.load(open(os.path.join(HERE, 'pieces.json')))
P = m['pieces']; X0, LW, LH = m['x0'], m['logo_w'], m['letter_h']
WT, IT, IH, IW, GAP, WB = m['word_top'], m['icon_top'], m['icon_h'], m['icon_w'], m['gap'], m['word_bottom_from_floor']
F = m['wall_h']
NOTES = {'L-P': 'inner window cut out', 'L-O': 'inner window cut out', 'T-collar': 'very thin: 3 mm tall',
         'T-star': 'sits inside the cup', 'I-star': 'sits inside the cup'}

def row(q):
    w, h = q['w'], q['h']
    return (f'<tr><td class="id">{q["id"]}</td><td>{q["name"]}</td>'
            f'<td class="n"><b>{w:.2f}″</b></td><td class="n"><b>{h:.2f}″</b></td>'
            f'<td class="n">{w*2.54:.1f} × {h*2.54:.1f}</td><td class="n">{w*25.4:.0f} × {h*25.4:.0f}</td>'
            f'<td class="n">{q["x"]:.2f}″</td><td class="n">{q["y"]:.2f}″</td><td class="n">{F-q["y"]-q["h"]:.2f}″</td>'
            f'<td class="note">{NOTES.get(q["id"], "")}</td></tr>')
head = ('<tr><th>ID</th><th>Piece</th><th>Width</th><th>Height</th><th>W × H (cm)</th><th>W × H (mm)</th>'
        '<th>X from wall left</th><th>Y from sticker top</th><th>Bottom above floor</th><th>Note</th></tr>')
tbl = lambda g: ''.join(row(q) for q in P if q['group'] == g)

# diagram of the logo block in wall coordinates
bx0, bx1, by0, by1 = -0.5, 48.5, IT - 3.2, WT + LH + 2.4
shapes = ''.join(f'<path d="{q["d"]}" fill="{"#E8EEF8" if q["group"] == "letters" else "#2B83F6"}" stroke="{q["color"]}" '
                 f'stroke-width="0.04" fill-rule="evenodd"/>' for q in P)
ix0 = 24 - IW / 2
dim = f'''
<rect x="0" y="{by0+0.4}" width="48" height="{by1-by0-0.4}" fill="none" stroke="#9AA6B8" stroke-width="0.05" stroke-dasharray="0.4 0.25"/>
<g class="dl"><line x1="0" y1="{by0+1.3}" x2="48" y2="{by0+1.3}"/></g><text x="6" y="{by0+1.1}" class="dt">WALL 48″ · 121.9 cm</text>
<g class="dl b"><line x1="{X0}" y1="{WT+LH+1.2}" x2="{X0+LW}" y2="{WT+LH+1.2}"/><line x1="{X0}" y1="{WT+LH+0.4}" x2="{X0}" y2="{WT+LH+1.5}"/><line x1="{X0+LW}" y1="{WT+LH+0.4}" x2="{X0+LW}" y2="{WT+LH+1.5}"/></g>
<text x="24" y="{WT+LH+2.05}" class="dt b">WORDMARK {LW:.2f}″ × {LH:.2f}″ · {LW*2.54:.1f} × {LH*2.54:.1f} cm</text>
<g class="dl b"><line x1="{ix0-1.2}" y1="{IT}" x2="{ix0-1.2}" y2="{IT+IH}"/><line x1="{ix0-1.6}" y1="{IT}" x2="{ix0-0.6}" y2="{IT}"/><line x1="{ix0-1.6}" y1="{IT+IH}" x2="{ix0-0.6}" y2="{IT+IH}"/></g>
<text x="{ix0-1.7}" y="{IT+IH/2}" class="dt b" style="text-anchor:end">ICON {IW:.2f}″ × {IH:.2f}″</text>
<text x="{ix0-1.7}" y="{IT+IH/2+0.8}" class="dt s" style="text-anchor:end">{IW*2.54:.1f} × {IH*2.54:.1f} cm</text>
<g class="dl"><line x1="{24+IW/2+1.2}" y1="{IT+IH}" x2="{24+IW/2+1.2}" y2="{WT}"/></g>
<text x="{24+IW/2+1.6}" y="{IT+IH+GAP/2+0.25}" class="dt s" style="text-anchor:start">GAP {GAP:.2f}″</text>
<text x="{24+IW/2+1.0}" y="{IT+0.5}" class="dt r" style="text-anchor:start">top {F-IT:.2f}″ above floor</text>
<text x="47.6" y="{WT+LH+2.05}" class="dt r">bottom {WB:.2f}″ above floor</text>
'''
fonts = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Orbitron;font-weight:700;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:600;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-600-normal.woff2)}'''
css = '''@page{size:A4 landscape;margin:12mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Rajdhani,sans-serif;color:#0B0B0C;font-weight:600}
.page{page-break-after:always;height:183mm;position:relative;overflow:hidden}
.page:last-child{page-break-after:auto}
.top{display:flex;align-items:center;justify-content:space-between;border-bottom:1.2mm solid #2B83F6;padding-bottom:3mm}
h1{font-family:Orbitron;font-weight:900;font-size:18pt;letter-spacing:.5pt} h1 span{color:#2B83F6}
.badge{font-family:Orbitron;font-weight:700;font-size:9pt;color:#fff;background:#2B83F6;border-radius:20mm;padding:2mm 4mm;white-space:nowrap}
.sub{font-size:10.5pt;color:#3a4250;margin-top:1.5mm}
.cols{display:flex;gap:6mm;margin-top:4mm}
.kpis{width:72mm;display:flex;flex-direction:column;gap:2.6mm}
.k{border:.4mm solid #CFE0FA;border-radius:3mm;padding:2.4mm 3.5mm;background:#F4F8FF}
.k b{display:block;font-family:Orbitron;font-weight:900;font-size:13pt;color:#1F6FE5}
.k small{font-size:9.5pt;color:#3a4250}
svg.dia{flex:1;height:150mm}
.dl line{stroke:#5B6575;stroke-width:.05} .dl.b line{stroke:#2B83F6}
.dt{font-family:Orbitron;font-weight:700;font-size:.62px;text-anchor:middle;fill:#3a4250} .dt.b{fill:#1F6FE5} .dt.s{font-size:.5px}
.dt.r{text-anchor:end;font-size:.5px;fill:#B4231A}
h2{font-family:Orbitron;font-weight:700;font-size:10.5pt;margin:3.5mm 0 1.5mm;color:#1F6FE5;letter-spacing:.5pt}
table{width:100%;border-collapse:collapse;font-size:10pt}
th{font-family:Orbitron;font-weight:700;font-size:7pt;letter-spacing:.3pt;text-align:left;background:#0B0B0C;color:#fff;padding:1.6mm 2.2mm}
td{padding:1.15mm 2.2mm;border-bottom:.3mm solid #E3EAF5}
tr:nth-child(even) td{background:#F7FAFF}
td.n{font-variant-numeric:tabular-nums;white-space:nowrap} td.id{font-family:Orbitron;font-weight:700;font-size:8pt;color:#1F6FE5}
td.note{color:#B4231A;font-size:9.5pt}
.notes{margin-top:3mm;font-size:9.5pt;color:#3a4250;line-height:1.35} .notes li{margin-left:5mm}
.foot{position:absolute;bottom:0;left:0;right:0;font-size:8.5pt;color:#7a8597;display:flex;justify-content:space-between}'''
html = f'''<!doctype html><html><head><meta charset="utf-8"><style>{fonts}{css}</style></head><body>
<div class="page">
  <div class="top"><div><h1>CHAMPION <span>WALL LOGO</span> · ACRYLIC PIECES</h1>
  <div class="sub">Office wall behind the manager's desk · 4 ft × 10 ft sticker · big trophy icon above the CHAMPION wordmark · same style as the 72″ waiting-zone logo</div></div>
  <div class="badge">21 PIECES</div></div>
  <div class="cols">
    <div class="kpis">
      <div class="k"><b>{IW:.2f}″ × {IH:.2f}″</b><small>Trophy icon · {IW*2.54:.1f} × {IH*2.54:.1f} cm · 7 pieces</small></div>
      <div class="k"><b>{LW:.2f}″ × {LH:.2f}″</b><small>CHAMPION wordmark · {LW*2.54:.1f} × {LH*2.54:.1f} cm · 7 letters + 7-piece small trophy</small></div>
      <div class="k"><b>{WB:.0f}″ · {WB*2.54:.0f} cm</b><small>Wordmark bottom above the floor (5′ 8″). Seated head ≈ 56″, chair back ≈ 50″, desk ≈ 30″: one foot of clear wall above the head.</small></div>
      <div class="k"><b>{F-IT:.2f}″ · {(F-IT)*2.54:.0f} cm</b><small>Icon top above the floor · {IT:.2f}″ below the sticker top</small></div>
      <div class="k"><b>{X0:.2f}″</b><small>Wordmark gap left &amp; right on the 48″ wall · icon centred</small></div>
    </div>
    <svg class="dia" viewBox="{bx0} {by0} {bx1-bx0} {by1-by0}" preserveAspectRatio="xMidYMid meet">{dim}{shapes}</svg>
  </div>
  <div class="foot"><span>Cut file: champion-wall-48in-cut-21pcs.svg (real size, inches, laid out as mounted) · heights assume the sticker runs floor to ceiling (120″)</span><span>Page 1 / 3</span></div>
</div>
<div class="page">
  <div class="top"><h1>WORDMARK <span>PIECES</span></h1><div class="badge">14 PIECES · INCH · CM · MM</div></div>
  <h2>LETTERS · 7 PIECES</h2><table>{head}{tbl("letters")}</table>
  <h2>SMALL TROPHY (THE “I”) · 7 PIECES</h2><table>{head}{tbl("small-trophy")}</table>
  <div class="foot"><span>Sizes = outer box of each piece. X / Y = top-left corner of that box on the 48 × 120 in sticker.</span><span>Page 2 / 3</span></div>
</div>
<div class="page">
  <div class="top"><h1>TROPHY ICON <span>PIECES</span></h1><div class="badge">7 PIECES · INCH · CM · MM</div></div>
  <h2>BIG TROPHY ICON ABOVE THE WORDMARK · 7 PIECES</h2><table>{head}{tbl("icon")}</table>
  <ul class="notes">
    <li>The sticker prints a thin, faint outline of every one of the 21 pieces at this exact size and spot. Stick each acrylic piece onto its own outline.</li>
    <li>Small trophy in the wordmark: the collar is only 3 mm tall and some pieces are 1 mm apart (collar–stem, podium steps). Ask the cutter whether to join collar + stem and the 3 podium steps into one piece.</li>
    <li>Big icon: the same 7 shapes at {IH:.0f}″ tall, so gaps are about 4 mm and every piece is easy to cut and place.</li>
    <li>Heights assume the sticker starts at the floor. If it starts higher, keep the wordmark bottom at {WB:.0f}″ above the floor and shift the outlines with it.</li>
    <li>Thickness, colour and standoffs: same as the 72″ waiting-zone logo, or as your acrylic shop advises.</li>
  </ul>
  <div class="foot"><span>CHAMPION · 48″ office wall logo · all shapes from the official logo geometry</span><span>Page 3 / 3</span></div>
</div></body></html>'''
open(os.path.join(HERE, 'size-sheet.html'), 'w').write(html)
