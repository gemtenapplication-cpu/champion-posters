"""4 ft x 10 ft (48 x 120 in) office wall sticker behind the manager's chair.
No printed logo: only thin, faint outlines of the 14 acrylic pieces (exact size and position) plus frame corners."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
m = json.load(open(os.path.join(HERE, 'pieces.json')))
P, X0, Y0, LW, LH = m['pieces'], m['x0'], m['y0'], m['logo_w'], m['letter_h']
LOGO_TOP = 48 - LH/2            # logo centre 48in from the top = 72in (6 ft) from the floor
dy = LOGO_TOP - Y0
outlines = ''.join(f'<path d="{q["d"]}"/>' for q in P)
# frame corners around the logo zone
fx0, fx1, fy0, fy1, arm = X0-0.95, X0+LW+0.95, LOGO_TOP-1.5, LOGO_TOP+LH+1.5, 2.2
corners = (f'M{fx0} {fy0+arm}V{fy0}H{fx0+arm} M{fx1-arm} {fy0}H{fx1}V{fy0+arm} '
           f'M{fx0} {fy1-arm}V{fy1}H{fx0+arm} M{fx1-arm} {fy1}H{fx1}V{fy1-arm}')
cx = 24
ticks = f'M{cx} {fy0-0.5}V{fy0+0.5} M{cx} {fy1-0.5}V{fy1+0.5} M{fx0-0.5} {LOGO_TOP+LH/2}H{fx0+0.5} M{fx1-0.5} {LOGO_TOP+LH/2}H{fx1+0.5}'
# faint PlayStation-style symbols scattered in the upper and middle wall
def sym(k, x, y, s, r, o):
    shape = {'tri': '<polygon points="50,12 90,82 10,82"/>', 'cir': '<circle cx="50" cy="50" r="38"/>',
             'x': '<path d="M18 18L82 82M82 18L18 82"/>', 'sq': '<rect x="14" y="14" width="72" height="72" rx="4"/>'}[k]
    return f'<g transform="translate({x} {y}) rotate({r}) scale({s/100}) translate(-50 -50)" opacity="{o}" stroke-width="{0.14/(s/100):.3f}">{shape}</g>'
syms = ''.join([sym('tri',9,15,3.4,-12,.42), sym('cir',39.5,10,2.8,0,.36), sym('sq',38,29,2.5,14,.30), sym('x',10.5,33,2.3,8,.30),
                sym('cir',8,64,2.0,0,.24), sym('tri',40,68,2.3,10,.24)])
# light streaks: thin diagonal trails between the logo and the horizon
import random
random.seed(7)
streaks=''
for (x1,y1,x2,y2,o,w) in [(-2,72,20,62,.30,.05),(-2,75.5,15,68,.18,.035),(50,70,28,60.5,.30,.05),(50,73.5,33,66.5,.18,.035),(-2,58,9,53.5,.16,.03),(50,57,39,52.5,.16,.03)]:
    streaks+=f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#4DA3FF" stroke-opacity="{o}" stroke-width="{w}"/>'
# perspective floor grid in the lower wall
grid = ''
hy, by = 84, 120
for i in range(-12, 13):
    grid += f'<line x1="{24+i*0.9}" y1="{hy}" x2="{24+i*7}" y2="{by}"/>'
yy = hy
for k in range(1, 12):
    yy = hy + (by-hy)*(k/11)**1.8
    grid += f'<line x1="0" y1="{yy:.3f}" x2="48" y2="{yy:.3f}" opacity="{0.35+0.65*k/11:.2f}"/>'
html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page{{size:48in 120in;margin:0}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:48in;height:120in;overflow:hidden;background:#0B0B0C}}
.w{{position:relative;width:48in;height:120in;overflow:hidden;
  background:
   radial-gradient(28in 9in at 24in {LOGO_TOP+LH/2}in, #2B83F640 0%, #1F6FE51c 45%, transparent 75%),
   radial-gradient(60in 40in at 24in {LOGO_TOP+LH/2}in, #0B1F4566 0%, transparent 70%),
   linear-gradient(180deg,#07090D 0%,#0A0F1A 30%,#0B1222 48%,#090D16 70%,#050608 100%)}}
.sheen{{position:absolute;inset:0;background:linear-gradient(118deg,transparent 0%,transparent 34%,#FFFFFF07 42%,#FFFFFF03 50%,transparent 58%,transparent 100%)}}
.beams{{position:absolute;inset:0;background:
   linear-gradient(180deg,#4DA3FF22,transparent 38in) 9in 0/0.5in 100% no-repeat,
   linear-gradient(180deg,#4DA3FF1a,transparent 30in) 24in 0/0.35in 100% no-repeat,
   linear-gradient(180deg,#4DA3FF22,transparent 38in) 38.5in 0/0.5in 100% no-repeat}}
.band{{position:absolute;left:0;right:0;top:{LOGO_TOP+LH/2-0.04}in;height:.08in;background:linear-gradient(90deg,transparent,#4DA3FF55 18%,#4DA3FF22 50%,#4DA3FF55 82%,transparent)}}
.rail{{position:absolute;top:6in;bottom:6in;width:.16in;border-radius:.08in;background:linear-gradient(180deg,transparent,#2B83F6 18%,#4DA3FF 50%,#2B83F6 82%,transparent);opacity:.75}}
.rail.l{{left:.55in}}.rail.r{{right:.55in}}
.horizon{{position:absolute;left:0;right:0;top:76in;height:16in;background:radial-gradient(30in 6in at 24in 8in,#2B83F633 0%,#1F6FE514 50%,transparent 75%)}}
.hline{{position:absolute;left:3in;right:3in;top:83.95in;height:.1in;border-radius:.05in;background:linear-gradient(90deg,transparent,#4DA3FF99 25%,#4DA3FFcc 50%,#4DA3FF99 75%,transparent)}}
svg.o{{position:absolute;inset:0;width:48in;height:120in}}
.top{{position:absolute;top:0;left:0;right:0;height:.5in;background:linear-gradient(90deg,#1F6FE5,#2B83F6 60%,#4DA3FF)}}
.bot{{position:absolute;bottom:0;left:0;right:0;height:.5in;background:linear-gradient(90deg,#4DA3FF,#2B83F6 40%,#1F6FE5)}}
</style></head><body><div class="w">
<div class="beams"></div><div class="sheen"></div><div class="horizon"></div><div class="hline"></div>
<div class="rail l"></div><div class="rail r"></div><div class="top"></div><div class="bot"></div>
<svg class="o" viewBox="0 0 48 120">
  <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
  <mask id="gm"><rect x="0" y="84" width="48" height="36" fill="url(#fade)"/></mask></defs>
  <g stroke="#2B83F6" stroke-width="0.035" opacity=".55" mask="url(#gm)">{grid}</g>
  <g fill="none" stroke="#4DA3FF" stroke-width="0.14" stroke-linejoin="round" stroke-linecap="round">{syms}</g>
  <g stroke-linecap="round">{streaks}</g>
  <!-- ACRYLIC PLACEHOLDER: thin faint outlines of the 14 pieces, exact size and position -->
  <g id="acrylic-placeholder" transform="translate(0 {dy:.4f})" fill="#FFFFFF" fill-opacity=".035" stroke="#FFFFFF" stroke-opacity=".38" stroke-width="0.03" fill-rule="evenodd">{outlines}</g>
  <path d="{corners} {ticks}" fill="none" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="0.05" stroke-linecap="round"/>
</svg>
</div></body></html>'''
open(os.path.join(HERE, 'office-wall-sticker-48x120.html'), 'w').write(html)
print('logo top from sticker top', round(LOGO_TOP, 2), 'in; from floor (bottom)', round(120-LOGO_TOP-LH, 2))
