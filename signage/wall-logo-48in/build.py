"""Build the 48in-wall CHAMPION acrylic logo (14 pieces) from the 72in Champion_05 cut file.
Everything is scaled by exactly 2/3, so the 64in logo becomes 42.67in and the 5.19in letters 3.46in.
Outputs: champion-wall-48in-cut-14pcs.svg (real size, inches) and pieces.json (for the size sheet)."""
import re, json, os
from svgpathtools import parse_path
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'source-Champion_05_cut_72x30in.svg')).read()
paths = re.findall(r'<path d="([^"]+)" transform="([^"]+)" fill="none" stroke="(#[0-9A-F]+)"', src)[:14]  # 7 letters + 7 trophy (tagline dropped)
IDS = [('L-C','Letter C'),('L-H','Letter H'),('L-A','Letter A'),('L-M','Letter M'),('L-P','Letter P'),('L-O','Letter O'),('L-N','Letter N'),
       ('T-cup','Trophy cup'),('T-star','Trophy star'),('T-collar','Trophy collar'),('T-stem','Trophy stem'),
       ('T-podium-1st','Podium 1st'),('T-podium-2nd','Podium 2nd'),('T-podium-3rd','Podium 3rd')]
S = 2/3; WALL = 48.0; LOGO_W = 64*S; X0 = (WALL-LOGO_W)/2; MARGIN_Y = 1.0
def apply(p, t):
    for op, a in reversed(re.findall(r'(translate|scale)\(([^)]+)\)', t)):
        v = [float(x) for x in a.split()]
        p = p.translated(complex(v[0], v[1])) if op == 'translate' else p.scaled(v[0])
    return p
pieces = []
for (d, t, col), (pid, name) in zip(paths, IDS):
    p = apply(parse_path(d), t)                      # 72in panel inches
    p = p.translated(complex(-4, -10.32824)).scaled(S).translated(complex(X0, MARGIN_Y))
    xmin, xmax, ymin, ymax = p.bbox()
    pieces.append(dict(id=pid, name=name, color=col, d=p.d(), x=xmin, y=ymin, w=xmax-xmin, h=ymax-ymin,
                       contours=len(re.findall(r'[Mm]', d))))
H = max(q['y']+q['h'] for q in pieces) + MARGIN_Y
lab = ''.join(f'<text x="{q["x"]:.4f}" y="{q["y"]-0.08:.4f}" font-family="Arial" font-weight="700" font-size="{0.2 if q["id"].startswith("L") else 0.12}" fill="#0066CC">{q["id"]}</text>' for q in pieces)
body = ''.join(f'<path id="{q["id"]}" d="{q["d"]}" fill="none" stroke="{q["color"]}" stroke-width="0.01" fill-rule="evenodd"/>' for q in pieces)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{WALL}in" height="{H:.4f}in" viewBox="0 0 {WALL} {H:.4f}">'
       f'<!-- CHAMPION wall logo, 14 acrylic pieces, real size in inches. Artboard = 48in wall width. Red = letters, blue = trophy. Labels are NOT cut lines. -->'
       f'<g id="cut-letters-and-trophy">{body}</g><g id="labels-do-not-cut">{lab}</g></svg>')
open(os.path.join(HERE, 'champion-wall-48in-cut-14pcs.svg'), 'w').write(svg)
meta = dict(wall=WALL, logo_w=LOGO_W, x0=X0, y0=MARGIN_Y, art_h=H,
            letter_h=max(q['h'] for q in pieces if q['id'].startswith('L')), pieces=pieces)
json.dump(meta, open(os.path.join(HERE, 'pieces.json'), 'w'), indent=1)
for q in pieces: print(f'{q["id"]:14s} {q["w"]:6.2f} x {q["h"]:5.2f} in   x {q["x"]-X0:6.2f}  y {q["y"]-MARGIN_Y:5.2f}  contours {q["contours"]}')
print('logo', round(LOGO_W,3), 'letter h', round(meta['letter_h'],3), 'artboard', WALL, 'x', round(H,3))
