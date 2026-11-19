"""Build the 48in-wall CHAMPION acrylic logo from the 72in Champion_05 cut file.

Layout on the 4 ft x 10 ft (48 x 120 in) office wall, behind an executive desk and chair:
  * CHAMPION wordmark (7 letters + 7-piece small trophy as the I), exactly 2/3 of the 72in logo:
    42.67in wide, 3.46in letters. Its bottom edge sits WORD_BOTTOM in above the floor, which clears
    a seated person's head (about 56in) by a foot, so the chair or a head never hides it.
  * Big trophy icon (7 pieces) centred above the wordmark, ICON_H tall, GAP above the letters.

All coordinates in pieces.json are WALL coordinates: inches from the sticker's top-left corner
(sticker = 48 x 120 in, floor at y = 120).
Outputs: champion-wall-48in-cut-21pcs.svg (real size, inches) and pieces.json.
"""
import re, json, os
from svgpathtools import parse_path

HERE = os.path.dirname(os.path.abspath(__file__))
WALL_W, WALL_H = 48.0, 120.0
WORD_BOTTOM = 68.0     # in above the floor
GAP = 3.5              # between the icon's podium and the top of the letters
ICON_H = 14.0          # big trophy icon height
S = 2 / 3              # wordmark scale vs the 72in file

src = open(os.path.join(HERE, 'source-Champion_05_cut_72x30in.svg')).read()
paths = re.findall(r'<path d="([^"]+)" transform="([^"]+)" fill="none" stroke="(#[0-9A-F]+)"', src)[:14]
LETTERS = [('L-C', 'Letter C'), ('L-H', 'Letter H'), ('L-A', 'Letter A'), ('L-M', 'Letter M'),
           ('L-P', 'Letter P'), ('L-O', 'Letter O'), ('L-N', 'Letter N')]
TROPHY = [('cup', 'cup'), ('star', 'star'), ('collar', 'collar'), ('stem', 'stem'),
          ('podium-1st', 'podium 1st'), ('podium-2nd', 'podium 2nd'), ('podium-3rd', 'podium 3rd')]


def to_72(d, t):
    """Original path -> inches on the 72 x 30 in panel."""
    p = parse_path(d)
    for op, a in reversed(re.findall(r'(translate|scale)\(([^)]+)\)', t)):
        v = [float(x) for x in a.split()]
        p = p.translated(complex(v[0], v[1])) if op == 'translate' else p.scaled(v[0])
    return p


src72 = [to_72(d, t) for d, t, _ in paths]
cols = [c for _, _, c in paths]

# wordmark: 72in logo spans x 4..68, letters top at 10.32824
LOGO_W = 64 * S
X0 = (WALL_W - LOGO_W) / 2
LETTER_H = 5.19 * S
word_top = WALL_H - WORD_BOTTOM - (max(p.bbox()[3] for p in src72[:7]) - 10.32824) * S

pieces = []
def add(pid, name, group, col, p, contours):
    xmin, xmax, ymin, ymax = p.bbox()
    pieces.append(dict(id=pid, name=name, group=group, color=col, d=p.d(),
                       x=xmin, y=ymin, w=xmax - xmin, h=ymax - ymin, contours=contours))

for i, (p, (pid, name)) in enumerate(zip(src72[:7], LETTERS)):
    add(pid, name, 'letters', cols[i], p.translated(complex(-4, -10.32824)).scaled(S).translated(complex(X0, word_top)),
        len(re.findall(r'[Mm]', paths[i][0])))
for j, (p, (pid, name)) in enumerate(zip(src72[7:], TROPHY)):
    add('T-' + pid, 'Small trophy ' + name, 'small-trophy', cols[7 + j],
        p.translated(complex(-4, -10.32824)).scaled(S).translated(complex(X0, word_top)), 1)

# big icon: same 7 trophy shapes, scaled up and centred above the wordmark
tb = [p.bbox() for p in src72[7:]]
tx0, tx1 = min(b[0] for b in tb), max(b[1] for b in tb)
ty0, ty1 = min(b[2] for b in tb), max(b[3] for b in tb)
k = ICON_H / (ty1 - ty0)
icon_w = (tx1 - tx0) * k
icon_top = word_top - GAP - ICON_H
for j, (p, (pid, name)) in enumerate(zip(src72[7:], TROPHY)):
    add('I-' + pid, 'Icon ' + name, 'icon', '#0047FF',
        p.translated(complex(-tx0, -ty0)).scaled(k).translated(complex(WALL_W / 2 - icon_w / 2, icon_top)), 1)

# cut file: same layout as on the wall, cropped to the logo block with a 1in margin
cy0 = icon_top - 1.0
cy1 = word_top + LETTER_H + 1.0
def fsize(q):
    return 0.35 if q['group'] == 'icon' and q['id'] == 'I-cup' else (0.2 if q['group'] != 'small-trophy' else 0.1)
lab = ''.join(f'<text x="{q["x"]:.4f}" y="{q["y"] - cy0 - 0.08:.4f}" font-family="Arial" font-weight="700" '
              f'font-size="{fsize(q)}" fill="#0066CC">{q["id"]}</text>'
              for q in pieces if q['id'] in ('I-cup',) or q['group'] == 'letters' or q['id'] == 'T-cup')
body = ''.join(f'<path id="{q["id"]}" d="{q["d"]}" transform="translate(0 {-cy0:.4f})" fill="none" '
               f'stroke="{q["color"]}" stroke-width="0.01" fill-rule="evenodd"/>' for q in pieces)
H = cy1 - cy0
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{WALL_W}in" height="{H:.4f}in" viewBox="0 0 {WALL_W} {H:.4f}">'
       '<!-- CHAMPION 48in wall logo: 21 acrylic pieces at real size (inches), laid out exactly as mounted. '
       'Artboard = 48in wall width. Red = letters, blue = trophy pieces. Labels are NOT cut lines. -->'
       f'<g id="cut-pieces">{body}</g><g id="labels-do-not-cut">{lab}</g></svg>')
open(os.path.join(HERE, 'champion-wall-48in-cut-21pcs.svg'), 'w').write(svg)

meta = dict(wall_w=WALL_W, wall_h=WALL_H, logo_w=LOGO_W, x0=X0, letter_h=LETTER_H, word_top=word_top,
            word_bottom_from_floor=WORD_BOTTOM, icon_top=icon_top, icon_h=ICON_H, icon_w=icon_w, gap=GAP,
            cut_y0=cy0, pieces=pieces)
json.dump(meta, open(os.path.join(HERE, 'pieces.json'), 'w'), indent=1)
for q in pieces:
    print(f'{q["id"]:18s} {q["w"]:6.2f} x {q["h"]:5.2f} in   x {q["x"]:6.2f}  y {q["y"]:6.2f}  floor {WALL_H - q["y"] - q["h"]:6.2f}')
print(f'wordmark {LOGO_W:.2f} x {LETTER_H:.2f}  top {word_top:.2f} from sticker top; icon {icon_w:.2f} x {ICON_H}  '
      f'top {icon_top:.2f} from top = {WALL_H - icon_top:.2f} from floor')
