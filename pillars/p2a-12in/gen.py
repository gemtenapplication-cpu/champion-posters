"""Pillar 2-A 'Start Your Engines' rebuilt at 12 x 120 in (the 16in original's source file was not available).
Logo, scanline pattern and gradients come from the Champion_12 P1A source so it matches the pillar set.
Usage: python3 gen.py [width_in]   (default 12)"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
W = float(sys.argv[1]) if len(sys.argv) > 1 else 12.0
H = 120.0
src = open(os.path.join(HERE, '..', 'p5-playstation', 'style-source-P1A.svg')).read()
DEFS = src[src.index('<defs>'):src.index('</defs>') + 7]
LOGO_SRC = src[src.index('<g transform="translate(2.0000 3.0000) scale(0.0114504) translate(-277 -338)">'):
               src.index('<rect x="3.0" y="5.75')]
LOGO_W = W - 3.0                      # 12in logo on a 16in face -> 9in on a 12in face
k = 0.0114504 * LOGO_W / 12.0
CX = W / 2
BLUE, LIGHT, SKY = '#2B83F6', '#4DA3FF', '#6BB8FF'

def T(x, y, s, size, font='Orbitron', w=900, fill='#FFFFFF', ls=0, tl=None, skew=True, extra=''):
    fam = "'Orbitron'" if font == 'Orbitron' else "'Rajdhani'"
    t = f' textLength="{tl}" lengthAdjust="spacingAndGlyphs"' if tl else ''
    tr = f' transform="translate({x} {y}) skewX(-12)"' if skew else f' x="{x}" y="{y}"'
    pos = ' x="0" y="0"' if skew else ''
    return (f'<text{tr}{pos} font-family="{fam}" font-weight="{w}" font-size="{size}" letter-spacing="{ls}" '
            f'fill="{fill}" text-anchor="middle"{t} {extra}>{s}</text>')

def checker(y, rows, sq):
    n = int(W / sq) + 1
    out = f'<rect x="0" y="{y}" width="{W}" height="{rows*sq}" fill="#FFFFFF"/>'
    for r in range(rows):
        for c in range(n):
            if (r + c) % 2 == 0:
                out += f'<rect x="{c*sq:.3f}" y="{y+r*sq:.3f}" width="{sq}" height="{sq}" fill="#0B0B0C"/>'
    return out

def kerb(y, h):
    out = f'<rect x="0" y="{y}" width="{W}" height="{h}" fill="#FFFFFF"/>'
    step = 1.2
    i = -2
    while i * step < W + 2:
        x = i * step
        out += f'<polygon points="{x},{y+h} {x+0.6},{y+h} {x+0.6+h*0.7},{y} {x+h*0.7},{y}" fill="#E5333A"/>'
        i += 1
    return out

def light(cx, cy, r, on_color, glow):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r*1.9}" fill="url(#{glow})"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r*1.08}" fill="#07090D" stroke="#2A2F3A" stroke-width="0.06"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{on_color}"/>'
            f'<ellipse cx="{cx-r*0.28}" cy="{cy-r*0.38}" rx="{r*0.42}" ry="{r*0.26}" fill="#FFFFFF" opacity="0.55"/>')

defs_extra = ('<radialGradient id="redGlow"><stop offset="0" stop-color="#FF3B45" stop-opacity="0.55"/>'
              '<stop offset="1" stop-color="#FF3B45" stop-opacity="0"/></radialGradient>'
              '<radialGradient id="grnGlow"><stop offset="0" stop-color="#2BE07A" stop-opacity="0.55"/>'
              '<stop offset="1" stop-color="#2BE07A" stop-opacity="0"/></radialGradient>'
              '<radialGradient id="redOn" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#FF7A80"/><stop offset="1" stop-color="#D0101C"/></radialGradient>'
              '<radialGradient id="grnOn" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#8CFFB4"/><stop offset="1" stop-color="#0FA34A"/></radialGradient>'
              '<linearGradient id="bgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0D1424"/>'
              '<stop offset="0.5" stop-color="#090D16"/><stop offset="1" stop-color="#05070B"/></linearGradient>')
defs = DEFS.replace('</defs>', defs_extra + '</defs>')

b = f'<rect width="{W}" height="{H}" fill="url(#bgR)"/><rect width="{W}" height="{H}" fill="url(#scan)"/>'
b += checker(0, 2, 0.6)
b += LOGO_SRC.replace('translate(2.0000 3.0000) scale(0.0114504)', f'translate({1.5:.4f} 3.2) scale({k:.7f})', 1)
b += f'<rect x="{W/2-LOGO_W*0.42}" y="6.0" width="{LOGO_W*0.84}" height="0.06" fill="url(#neonH)"/>'
b += T(CX, 9.6, 'START YOUR', 1.05, tl=W - 3.4)
b += T(CX, 12.0, 'ENGINES', 1.75, fill=LIGHT, tl=W - 2.6)
# start-light gantry
hw, top, bot = 5.4, 27.0, 82.0
b += f'<rect x="{CX-0.35}" y="23.6" width="0.7" height="3.6" rx="0.2" fill="#1A1F2B"/>'
b += (f'<rect x="{CX-hw/2}" y="{top}" width="{hw}" height="{bot-top}" rx="0.9" fill="#0C0F16" '
      f'stroke="#262C3A" stroke-width="0.08"/>')
rows = [32.0, 43.0, 54.3, 65.5, 76.6]
r = 1.12
for i, y in enumerate(rows):
    green = i == len(rows) - 1
    for dx in (-1.32, 1.32):
        b += light(CX + dx, y, r, 'url(#grnOn)' if green else 'url(#redOn)', 'grnGlow' if green else 'redGlow')
b += T(CX, 87.0, 'LIGHTS OUT', 1.55, tl=W - 2.2)
b += T(CX, 89.3, 'AND AWAY WE GO', 0.72, 'Rajdhani', 700, '#C9D6EA', 0.3, tl=W - 4.6)
# steering wheel icon
sy = 94.3
b += (f'<g fill="none" stroke="#FFFFFF" stroke-width="0.16" stroke-linecap="round">'
      f'<circle cx="{CX}" cy="{sy}" r="1.25"/><circle cx="{CX}" cy="{sy+0.1}" r="0.34"/>'
      f'<path d="M{CX-1.2} {sy-0.05} Q{CX} {sy-0.55} {CX+1.2} {sy-0.05} M{CX-0.25} {sy+0.4} L{CX-0.55} {sy+1.18} '
      f'M{CX+0.25} {sy+0.4} L{CX+0.55} {sy+1.18}"/></g>')
b += T(CX, 98.9, 'CAR SIMULATOR', 1.0, tl=W - 3.0)
b += T(CX, 101.3, '4TH FLOOR · IFIC BANK BUILDING', 0.6, 'Rajdhani', 700, '#8FA3C0', 0.06, tl=W - 3.4, skew=False)
b += T(CX, 102.65, 'RANIR BAZAR · CUMILLA', 0.66, 'Rajdhani', 700, '#FFFFFF', 0.1, skew=False)
b += kerb(106.0, 1.0)
b += checker(107.6, 3, 0.6)
b += f'<rect x="0" y="117.4" width="{W}" height="2.6" fill="#03050B"/><rect x="0" y="117.35" width="{W}" height="0.08" fill="{BLUE}"/>'
b += T(CX, 119.02, 'CHAMPION · RACING', 0.6, 'Rajdhani', 700, '#8FA3C0', 0.16, skew=False)

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:g}in" height="{H:g}in" viewBox="0 0 {W:g} {H:g}">'
       f'{defs}{b}</svg>')
name = f'Champion_12_P2A_StartYourEngines_{W:g}x120in'
open(os.path.join(HERE, name + '_source.svg'), 'w').write(svg)
FONTS = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}'''
open(os.path.join(HERE, name + '.html'), 'w').write(
    f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}@page{{size:{W:g}in 120in;margin:0}}'
    f'*{{margin:0;padding:0}}html,body{{width:{W:g}in;height:120in;overflow:hidden;background:#05070B}}svg{{display:block}}</style></head>'
    f'<body>{svg}</body></html>')
print('wrote', name)
