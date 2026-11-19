"""4 ft x 10 ft (48 x 120 in) office wall sticker behind the manager's desk and chair.

The logo is printed in full as a 3D-look acrylic sign (white glossy letters, blue trophy pieces, thickness,
wall shadow and a blue LED-style halo) at the exact size and spot of the 21 acrylic pieces, so the real acrylic
can later be mounted straight on top. pieces.json (from build.py) holds wall coordinates.
Open the HTML with #mock to overlay a desk / chair / seated-person silhouette and a height ruler
(preview only, never in the print file)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
m = json.load(open(os.path.join(HERE, 'pieces.json')))
P, X0, LW, LH = m['pieces'], m['x0'], m['logo_w'], m['letter_h']
WT, IT = m['word_top'], m['icon_top']
BLOCK_TOP, BLOCK_BOT = IT, WT + LH
CY = (BLOCK_TOP + BLOCK_BOT) / 2
outlines = ''.join(f'<path d="{q["d"]}"/>' for q in P)

# 3D-look printed logo: wall shadow, LED halo, extruded thickness, glossy face
def paths(groups):
    return ''.join(f'<path d="{q["d"]}"/>' for q in P if q['group'] in groups)
ALL = paths(('letters', 'small-trophy', 'icon'))
DEPTH = {'icon': 0.30, 'letters': 0.16, 'small-trophy': 0.07}
# soft wall shadow: stacked translucent copies, each a little further and wider (vector, no blur filter)
logo3d = ''.join(f'<g transform="translate({0.012*k:.3f} {0.05*k:.3f})" fill="#000000" fill-opacity="0.045" stroke="#000000" '
                 f'stroke-opacity="0.045" stroke-width="{0.11*k:.3f}" stroke-linejoin="round" fill-rule="evenodd">{ALL}</g>'
                 for k in range(1, 8))
logo3d += ''.join(f'<g fill="none" stroke="#2B83F6" stroke-opacity="{o}" stroke-width="{w}" stroke-linejoin="round">{ALL}</g>'
                  for w, o in [(1.1, 0.045), (0.85, 0.06), (0.62, 0.08), (0.42, 0.11), (0.25, 0.16)])
for grp in ('icon', 'letters', 'small-trophy'):
    d, n = DEPTH[grp], 10
    side = ('#6F7B8E', '#A9B4C4') if grp == 'letters' else ('#0D2E6E', '#1F5BC4')
    for i in range(n, 0, -1):
        t = i / n
        col = side[0] if i > n * 0.5 else side[1]
        logo3d += (f'<g transform="translate({d*0.35*t:.4f} {d*t:.4f})" fill="{col}" fill-rule="evenodd">{paths((grp,))}</g>')
    face = 'url(#faceW)' if grp == 'letters' else 'url(#faceB)'
    edge = '#FFFFFF' if grp == 'letters' else '#BFE1FF'
    logo3d += (f'<g fill="{face}" stroke="{edge}" stroke-opacity="0.85" stroke-width="0.025" fill-rule="evenodd">'
               f'{paths((grp,))}</g>')
FACE_DEFS = ('<linearGradient id="faceW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/>'
             '<stop offset="0.55" stop-color="#EEF2F7"/><stop offset="1" stop-color="#C9D2DE"/></linearGradient>'
             '<linearGradient id="faceB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CCBFF"/>'
             '<stop offset="0.5" stop-color="#2B83F6"/><stop offset="1" stop-color="#1A5CD6"/></linearGradient>')

def sym(k, x, y, s, r, o):
    shape = {'tri': '<polygon points="50,12 90,82 10,82"/>', 'cir': '<circle cx="50" cy="50" r="38"/>',
             'x': '<path d="M18 18L82 82M82 18L18 82"/>', 'sq': '<rect x="14" y="14" width="72" height="72" rx="4"/>'}[k]
    return (f'<g transform="translate({x} {y}) rotate({r}) scale({s/100}) translate(-50 -50)" opacity="{o}" '
            f'stroke-width="{0.14/(s/100):.3f}">{shape}</g>')
syms = ''.join([sym('tri', 8, 12, 3.2, -12, .40), sym('cir', 40, 8, 2.6, 0, .34), sym('sq', 41, 24, 2.3, 14, .28),
                sym('x', 7.5, 26, 2.2, 8, .28), sym('cir', 8, 66, 2.0, 0, .22), sym('tri', 40, 69, 2.3, 10, .22)])
streaks = ''.join(f'<line x1="{a}" y1="{b}" x2="{c}" y2="{d}" stroke="#4DA3FF" stroke-opacity="{o}" stroke-width="{w}"/>'
                  for a, b, c, d, o, w in [(-2, 74, 20, 64, .30, .05), (-2, 77.5, 15, 70, .18, .035),
                                           (50, 72, 28, 62.5, .30, .05), (50, 75.5, 33, 68.5, .18, .035)])
grid = ''
hy, by = 84, 120
for i in range(-12, 13):
    grid += f'<line x1="{24+i*0.9}" y1="{hy}" x2="{24+i*7}" y2="{by}"/>'
for k in range(1, 12):
    yy = hy + (by - hy) * (k / 11) ** 1.8
    grid += f'<line x1="0" y1="{yy:.3f}" x2="48" y2="{yy:.3f}" opacity="{0.35+0.65*k/11:.2f}"/>'

# preview-only overlay: desk 30in, high-back chair top 50in, seated head top 56in (floor = y 120)
F = 120
def fy(h): return F - h
mock = f'''
<g id="mock" opacity=".93">
  <path d="M13.5 {fy(50)} q0 -1.2 1.2 -1.2 h18.6 q1.2 0 1.2 1.2 V{fy(22)} H13.5Z" fill="#1E232D"/>
  <ellipse cx="24" cy="{fy(51.5)}" rx="4.4" ry="5.2" fill="#2A303C"/>
  <path d="M14.5 {fy(36)} q0 -8 9.5 -9.4 q9.5 1.4 9.5 9.4 V{fy(28)} H14.5Z" fill="#2A303C"/>
  <rect x="-1" y="{fy(30)}" width="50" height="1.6" rx=".3" fill="#3A2C22"/>
  <rect x="-1" y="{fy(28.4)}" width="50" height="28.4" fill="#2B2019"/>
  <rect x="-1" y="{fy(28.4)}" width="50" height=".25" fill="#5a4535"/>
</g>
<g id="ruler" font-family="Arial" font-weight="700" font-size="0.85">
  {''.join(f'<line x1="44.6" x2="48" y1="{fy(h)}" y2="{fy(h)}" stroke="{c}" stroke-width=".08" stroke-dasharray="{dash}"/>'
           f'<text x="44.4" y="{fy(h)+0.3}" text-anchor="end" fill="{c}">{lbl}</text>'
           for h, lbl, c, dash in [(30, 'DESK 30″', '#C9A27E', '0.3 0.2'), (50, 'CHAIR 50″', '#AEB7C6', '0.3 0.2'),
                                   (56, 'HEAD 56″', '#FF8A80', '0.3 0.2'), (m['word_bottom_from_floor'], f'LOGO {m["word_bottom_from_floor"]:.0f}″', '#4DA3FF', ''),
                                   (F - IT, f'ICON TOP {F-IT:.0f}″', '#4DA3FF', '')])}
  <line x1="4" x2="44" y1="{fy(61)}" y2="{fy(61)}" stroke="#FF8A80" stroke-opacity=".7" stroke-width=".06" stroke-dasharray=".5 .35"/>
  <text x="4" y="{fy(61)-0.45}" font-size="0.7" fill="#FF8A80" fill-opacity=".85">seated visitor's view line over the head ≈ 61″</text>
</g>'''

html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page{{size:48in 120in;margin:0}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:48in;height:120in;overflow:hidden;background:#0B0B0C}}
.w{{position:relative;width:48in;height:120in;overflow:hidden;
  background:
   radial-gradient(26in 16in at 24in {CY}in, #2B83F640 0%, #1F6FE51c 45%, transparent 75%),
   radial-gradient(60in 44in at 24in {CY}in, #0B1F4566 0%, transparent 70%),
   linear-gradient(180deg,#07090D 0%,#0A0F1A 24%,#0B1222 40%,#090D16 66%,#050608 100%)}}
.sheen{{position:absolute;inset:0;background:linear-gradient(118deg,transparent 0%,transparent 34%,#FFFFFF07 42%,#FFFFFF03 50%,transparent 58%,transparent 100%)}}
.beams{{position:absolute;inset:0;background:
   linear-gradient(180deg,#4DA3FF22,transparent 30in) 9in 0/0.5in 100% no-repeat,
   linear-gradient(180deg,#4DA3FF1a,transparent 24in) 24in 0/0.35in 100% no-repeat,
   linear-gradient(180deg,#4DA3FF22,transparent 30in) 38.5in 0/0.5in 100% no-repeat}}
.horizon{{position:absolute;left:0;right:0;top:76in;height:16in;background:radial-gradient(30in 6in at 24in 8in,#2B83F633 0%,#1F6FE514 50%,transparent 75%)}}
.hline{{position:absolute;left:3in;right:3in;top:83.95in;height:.1in;border-radius:.05in;background:linear-gradient(90deg,transparent,#4DA3FF99 25%,#4DA3FFcc 50%,#4DA3FF99 75%,transparent)}}
.rail{{position:absolute;top:6in;bottom:6in;width:.16in;border-radius:.08in;background:linear-gradient(180deg,transparent,#2B83F6 18%,#4DA3FF 50%,#2B83F6 82%,transparent);opacity:.75}}
.rail.l{{left:.55in}}.rail.r{{right:.55in}}
svg.o{{position:absolute;inset:0;width:48in;height:120in}}
.top{{position:absolute;top:0;left:0;right:0;height:.5in;background:linear-gradient(90deg,#1F6FE5,#2B83F6 60%,#4DA3FF)}}
.bot{{position:absolute;bottom:0;left:0;right:0;height:.5in;background:linear-gradient(90deg,#4DA3FF,#2B83F6 40%,#1F6FE5)}}
#mock,#ruler{{display:none}} .showmock #mock,.showmock #ruler{{display:inline}}
</style></head><body><div class="w">
<div class="beams"></div><div class="sheen"></div><div class="horizon"></div><div class="hline"></div>
<div class="rail l"></div><div class="rail r"></div><div class="top"></div><div class="bot"></div>
<svg class="o" viewBox="0 0 48 120">
  <defs>{FACE_DEFS}<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
  <mask id="gm"><rect x="0" y="84" width="48" height="36" fill="url(#fade)"/></mask></defs>
  <g stroke="#2B83F6" stroke-width="0.035" opacity=".55" mask="url(#gm)">{grid}</g>
  <g fill="none" stroke="#4DA3FF" stroke-linejoin="round" stroke-linecap="round">{syms}</g>
  <g stroke-linecap="round">{streaks}</g>
  <!-- PRINTED LOGO: 3D-look acrylic at the exact size and spot of the 21 pieces (real acrylic goes on top later) -->
  <g id="logo-3d">{logo3d}</g>
  {mock}
</svg>
</div>
<script>if (location.hash === '#mock') document.body.classList.add('showmock');</script>
</body></html>'''
open(os.path.join(HERE, 'office-wall-sticker-48x120.html'), 'w').write(html)
print(f'icon top {IT:.2f} in from sticker top ({120-IT:.2f} from floor); wordmark bottom {120-WT-LH:.2f} from floor')
