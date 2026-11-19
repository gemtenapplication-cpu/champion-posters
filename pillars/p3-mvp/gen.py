"""Esports pillar face 'MVP' at 13 x 120 in, a companion to 3-D VICTORY (same bright-blue gradient, white rays,
gold sparkle and confetti, logo and fonts from the P3D source) with its own design: gold medal, player card, COULD BE YOU.
Only true facts: tournaments with gifts and the trophy (community sticker), location lines."""
import os, re, math, random
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'style-source-P3D.svg')).read()
DEFS = src[src.index('<defs>'):src.index('</defs>')]
LOGO = src[src.index('<g transform="translate(2.0000 2.8000) scale(0.0114504)'):]
# the logo group ends where the first element after it starts: find the matching close by depth
depth, end = 0, 0
for m in re.finditer(r'<(/?)g\b[^>]*>', LOGO):
    depth += -1 if m.group(1) else 1
    if depth == 0:
        end = m.end(); break
LOGO = LOGO[:end]

W, H, CX = 13.0, 120.0, 6.5
GOLD, NAVY, PALE = '#F2C14E', '#0A1A3A', '#D6E9FF'
EXTRA = ('<radialGradient id="medal" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#FFF1B8"/>'
         '<stop offset="0.45" stop-color="#F7CF5A"/><stop offset="1" stop-color="#C08414"/></radialGradient>'
         '<radialGradient id="medalIn" cx="0.6" cy="0.7" r="0.8"><stop offset="0" stop-color="#FFE28A"/>'
         '<stop offset="1" stop-color="#D99A1E"/></radialGradient>'
         '<linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F2C14E"/><stop offset="1" stop-color="#FFE08A"/></linearGradient>')

def T(x, y, s, size, font='Orbitron', fill='#FFFFFF', ls=0, anchor='middle', tl=None, extra=''):
    fam, w = ("'Orbitron'", 900) if font == 'Orbitron' else ("'Rajdhani'", 700)
    t = f' textLength="{tl}" lengthAdjust="spacingAndGlyphs"' if tl else ''
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-weight="{w}" font-size="{size}" letter-spacing="{ls}" '
            f'fill="{fill}" text-anchor="{anchor}"{t} {extra}>{s}</text>')

def star(cx, cy, r, fill, stroke=None, sw=0):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append(f'{cx + rr*math.cos(a):.3f},{cy + rr*math.sin(a):.3f}')
    st = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"{st}/>'

b = f'<rect width="{W}" height="{H}" fill="url(#bgBr)"/>'
# white rays from the medal, like VICTORY's
MX, MY = CX, 33.0
rays = ''
for i in range(16):
    a = math.radians(i * 22.5 + 6)
    d = math.radians(3.2)
    L = 40
    p1 = (MX + L*math.cos(a-d), MY + L*math.sin(a-d)); p2 = (MX + L*math.cos(a+d), MY + L*math.sin(a+d))
    rays += f'<polygon points="{MX},{MY} {p1[0]:.2f},{p1[1]:.2f} {p2[0]:.2f},{p2[1]:.2f}" fill="#FFFFFF"/>'
b += f'<g opacity="0.14">{rays}</g>'
# confetti
random.seed(12)
cols = ['#FFFFFF', GOLD, '#7CC2FF', NAVY]
for _ in range(70):
    x, y = random.uniform(0.3, W - 0.3), random.uniform(11, 95)
    if 1.0 < x < 12.0 and 42.5 < y < 66.5:
        continue                                   # keep the player card clean
    w, h = random.uniform(0.18, 0.45), random.uniform(0.1, 0.28)
    b += (f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{random.choice(cols)}" '
          f'opacity="{random.uniform(0.55, 0.95):.2f}" transform="rotate({random.randint(0, 179)} {x+w/2:.2f} {y+h/2:.2f})"/>')
b += LOGO.replace('translate(2.0000 2.8000) scale(0.0114504)', f'translate({CX-5.0:.4f} 2.8) scale({0.0114504*10/12:.7f})', 1)
b += T(CX, 13.6, 'MVP', 4.4, tl=8.6)
b += T(CX, 15.9, 'MOST VALUABLE PLAYER', 0.85, 'Rajdhani', PALE, 0.3, tl=10.2)
# ribbon
b += f'<polygon points="3.6,17.6 5.6,17.6 7.4,29.4 5.4,29.4" fill="{NAVY}"/><polygon points="4.25,17.6 4.95,17.6 6.75,29.4 6.05,29.4" fill="{GOLD}"/>'
b += f'<polygon points="9.4,17.6 7.4,17.6 5.6,29.4 7.6,29.4" fill="#1F6FE5"/><polygon points="8.75,17.6 8.05,17.6 6.25,29.4 6.95,29.4" fill="#FFFFFF"/>'
b += f'<rect x="5.55" y="28.6" width="1.9" height="1.4" rx="0.25" fill="#C08414"/>'
# gold sparkle dashes around the medal
for i in range(14):
    a = math.radians(i * (360 / 14) - 90)
    r0 = 5.55
    x, y = MX + r0 * math.cos(a), MY + r0 * math.sin(a)
    b += (f'<rect x="{x-0.17:.3f}" y="{y-0.55:.3f}" width="0.34" height="1.1" rx="0.17" fill="{GOLD}" '
          f'transform="rotate({math.degrees(a)+90:.1f} {x:.3f} {y:.3f})"/>')
# medal
b += f'<ellipse cx="{MX}" cy="{MY}" rx="6.4" ry="6.4" fill="url(#glow)"/>'
b += f'<circle cx="{MX+0.12}" cy="{MY+0.3}" r="4.25" fill="#7A4E08" opacity="0.6"/>'
b += f'<circle cx="{MX}" cy="{MY}" r="4.2" fill="url(#medal)" stroke="#FFF1B8" stroke-width="0.08"/>'
b += f'<circle cx="{MX}" cy="{MY}" r="3.25" fill="url(#medalIn)" stroke="#B57A10" stroke-width="0.1"/>'
b += f'<circle cx="{MX}" cy="{MY}" r="3.25" fill="none" stroke="#FFF1B8" stroke-width="0.05" stroke-dasharray="0.18 0.14" opacity="0.8"/>'
b += star(MX + 0.08, MY + 0.12, 2.0, '#B57A10')
b += star(MX, MY, 2.0, '#FFFFFF', '#FFF1B8', 0.04)
b += f'<ellipse cx="{MX-1.5}" cy="{MY-2.3}" rx="1.3" ry="0.45" fill="#FFFFFF" opacity="0.35" transform="rotate(-30 {MX-1.5} {MY-2.3})"/>'
b += T(CX, 40.6, 'PLAY LIKE A CHAMPION', 0.8, 'Rajdhani', GOLD, 0.25, tl=9.0)
# player card
cx0, cy0, cw, ch = 1.0, 43.0, 11.0, 23.0
b += f'<rect x="{cx0+0.15}" y="{cy0+0.25}" width="{cw}" height="{ch}" rx="0.55" fill="#020814" opacity="0.45"/>'
b += f'<rect x="{cx0}" y="{cy0}" width="{cw}" height="{ch}" rx="0.55" fill="{NAVY}" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="0.07"/>'
b += f'<rect x="{cx0}" y="{cy0}" width="{cw}" height="2.2" rx="0.55" fill="#1F6FE5"/><rect x="{cx0}" y="{cy0+1.4}" width="{cw}" height="0.8" fill="#1F6FE5"/>'
b += T(cx0 + 0.6, cy0 + 1.5, 'PLAYER CARD', 0.72, ls=0.12, anchor='start')
# avatar + name + overall
ax, ay = cx0 + 2.3, cy0 + 5.0
b += f'<circle cx="{ax}" cy="{ay}" r="1.75" fill="#0F2D66" stroke="{GOLD}" stroke-width="0.1"/>'
b += f'<circle cx="{ax}" cy="{ay-0.45}" r="0.62" fill="#FFFFFF"/><path d="M{ax-1.05} {ay+1.15} q0 -1.15 1.05 -1.15 q1.05 0 1.05 1.15 z" fill="#FFFFFF"/>'
b += T(cx0 + 4.5, cy0 + 4.6, 'YOU?', 1.0, anchor='start')
b += T(cx0 + 4.5, cy0 + 5.75, 'NEXT CHAMPION', 0.62, 'Rajdhani', PALE, 0.1, 'start', tl=3.7)
b += f'<rect x="{cx0+cw-2.55}" y="{cy0+3.2}" width="2.05" height="2.6" rx="0.3" fill="{GOLD}"/>'
b += T(cx0 + cw - 1.525, cy0 + 4.55, '99', 1.05, fill=NAVY) + T(cx0 + cw - 1.525, cy0 + 5.45, 'OVR', 0.55, 'Rajdhani', NAVY, 0.1)
for i in range(5):
    b += star(cx0 + 2.55 + i * 1.5, cy0 + 8.6, 0.6, GOLD)
b += f'<rect x="{cx0+0.6}" y="{cy0+9.75}" width="{cw-1.2}" height="0.05" fill="#FFFFFF" opacity="0.25"/>'
stats = ['SKILL', 'TEAMWORK', 'FAIR PLAY', 'CLUTCH']
for i, st in enumerate(stats):
    y = cy0 + 11.4 + i * 2.7
    b += T(cx0 + 0.6, y, st, 0.66, 'Rajdhani', '#FFFFFF', 0.2, 'start')
    b += T(cx0 + cw - 0.6, y, 'MAX', 0.62, fill=GOLD, anchor='end')
    b += f'<rect x="{cx0+0.6}" y="{y+0.45}" width="{cw-1.2}" height="0.62" rx="0.31" fill="#16346E"/>'
    b += f'<rect x="{cx0+0.6}" y="{y+0.45}" width="{cw-1.2}" height="0.62" rx="0.31" fill="url(#bar)"/>'
    for k in range(1, 10):
        b += f'<rect x="{cx0+0.6+k*(cw-1.2)/10:.3f}" y="{y+0.45}" width="0.05" height="0.62" fill="{NAVY}" opacity="0.35"/>'
b += T(CX, cy0 + ch - 0.95, 'EVERY MATCH WRITES YOUR STATS', 0.66, 'Rajdhani', PALE, 0.12, tl=9.4)
# COULD BE YOU
b += T(CX, 72.2, 'COULD BE', 1.95, tl=10.4)
b += T(CX, 77.2, 'YOU', 3.6, fill='none', tl=7.0, extra='stroke="#FFFFFF" stroke-width="0.1"')
b += T(CX, 79.9, 'SHOW UP · LEVEL UP · STAND OUT', 0.72, 'Rajdhani', PALE, 0.14, tl=10.0)
b += f'<rect x="1.3" y="82.4" width="10.4" height="1.9" rx="0.95" fill="#FFFFFF"/>'
b += T(CX, 83.72, 'TOURNAMENTS · GIFTS · TROPHY', 0.82, 'Rajdhani', NAVY, 0.12, tl=9.0)
b += T(CX, 86.4, 'PLAY ON THE BIG SCREENS', 0.7, 'Rajdhani', '#FFFFFF', 0.2, tl=8.6)
b += T(CX, 91.6, '4TH FLOOR · IFIC BANK BUILDING', 0.7954, 'Rajdhani', PALE, 0.08, tl=10.6)
b += T(CX, 93.15, 'RANIR BAZAR · CUMILLA', 0.86, 'Rajdhani', '#FFFFFF', 0.12, tl=9.0)
grid = ''.join(f'<line x1="{CX}" y1="96" x2="{CX + i*2.4:.2f}" y2="117.4"/>' for i in range(-7, 8))
grid += ''.join(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>' for y in [96.296, 97.36, 99.318, 102.248, 106.208, 111.245, 117.4])
b += f'<g stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="0.04" fill="none">{grid}</g>'
b += f'<rect x="0" y="117.4" width="{W}" height="2.6" fill="#061536"/><rect x="0" y="117.35" width="{W}" height="0.08" fill="#2B83F6"/>'
b += T(CX, 119.02, 'CHAMPION · ESPORTS', 0.66, 'Rajdhani', '#8FA3C0', 0.1782)

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:g}in" height="{H:g}in" viewBox="0 0 {W:g} {H:g}">'
       f'{DEFS}{EXTRA}</defs>{b}</svg>')
name = 'Champion_12_P3E_MVP_13x120in'
open(os.path.join(HERE, name + '_source.svg'), 'w').write(svg)
FONTS = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}'''
open(os.path.join(HERE, name + '.html'), 'w').write(
    f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}@page{{size:{W:g}in 120in;margin:0}}'
    f'*{{margin:0;padding:0}}html,body{{width:{W:g}in;height:120in;overflow:hidden;background:#061536}}svg{{display:block}}</style></head>'
    f'<body>{svg}</body></html>')
print('wrote', name)
