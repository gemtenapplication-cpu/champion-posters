"""Pillar 5 . PLAYSTATION - four 16 x 120 in pillar faces in the Champion_12 pillar style.

Background, logo, corner brackets, controller icon and floor grid are copied from the P1A source SVG
(style-source-P1A.svg) so the new faces match the existing 16-sticker set.
Writes Champion_12_P5{A..D}_<name>_16x120in_source.svg plus an HTML wrapper per face for rendering.
"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'style-source-P1A.svg')).read()

DEFS = src[src.index('<defs>'):src.index('</defs>') + 7]
BG = '<rect width="16" height="120" fill="url(#bgN)"/><rect width="16" height="120" fill="url(#scan)"/>'
BRACKETS = re.search(r'<path d="M 0\.9 2\.9[^>]+/>', src).group(0)
LOGO = src[src.index('<g transform="translate(2.0000 3.0000)'):src.index('<rect x="3.0" y="5.75')]
NEON = '<rect x="3.0" y="5.751908396946565" width="10.0" height="0.07" fill="url(#neonH)"/>'
c0 = src.index('<g transform="translate(8.0000 82.5000)')
CONTROLLER = src[c0:src.index('</g>', c0) + 4]
g0 = src.index('<g stroke="#2B83F6" stroke-opacity="0.18"')
FLOOR = src[g0:src.index('<text x="2.6441" y="119.0200"')]
qr = open(os.path.join(HERE, 'qr.svg')).read()
QN = int(re.search(r'viewBox="0 0 (\d+) \1"', qr).group(1))
QR_PATH = re.search(r'<path stroke="#000000" d="([^"]+)"', qr).group(1)

BLUE, LIGHT, DEEP, SKY = '#2B83F6', '#4DA3FF', '#1F6FE5', '#6BB8FF'

def T(x, y, s, size, font='Orbitron', w=900, fill='#FFFFFF', ls=0, anchor='middle', tl=None, extra=''):
    fam = "'Orbitron'" if font == 'Orbitron' else "'Rajdhani'"
    t = f' textLength="{tl}" lengthAdjust="spacingAndGlyphs"' if tl else ''
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-weight="{w}" font-size="{size}" letter-spacing="{ls}" '
            f'fill="{fill}" text-anchor="{anchor}"{t} {extra}>{s}</text>')

def outline(x, y, s, size, tl):
    return T(x, y, s, size, fill='none', tl=tl, extra=f'stroke="{LIGHT}" stroke-width="0.11"')

def chev_text(y, s):
    return T(8, y, s, 0.85, 'Rajdhani', 700, '#FFFFFF', 0.3, tl=(7.2 if len(s) > 10 else None))

def chevrons(y):
    one = ''.join(f'<path d="M {2.0+i*0.605:.4f} {y-0.55} L {2.462+i*0.605:.4f} {y} L {2.0+i*0.605:.4f} {y+0.55} '
                  f'L {2.198+i*0.605:.4f} {y+0.55} L {2.66+i*0.605:.4f} {y} L {2.198+i*0.605:.4f} {y-0.55} Z" '
                  f'fill="{LIGHT}" opacity="{0.57+i*0.215:.2f}"/>' for i in range(3))
    return one + f'<g transform="translate(16 0) scale(-1 1)">{one}</g>'

def sym(kind, cx, cy, r, color='#FFFFFF', sw=None):
    sw = sw or r * 0.22
    if kind == 'tri':
        pts = f'{cx},{cy-r*0.82} {cx+r*0.86},{cy+r*0.62} {cx-r*0.86},{cy+r*0.62}'
        return f'<polygon points="{pts}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round"/>'
    if kind == 'cir':
        return f'<circle cx="{cx}" cy="{cy}" r="{r*0.78}" fill="none" stroke="{color}" stroke-width="{sw}"/>'
    if kind == 'x':
        d = r * 0.68
        return (f'<path d="M{cx-d} {cy-d}L{cx+d} {cy+d}M{cx+d} {cy-d}L{cx-d} {cy+d}" stroke="{color}" '
                f'stroke-width="{sw}" stroke-linecap="round"/>')
    if kind == 'sq':
        d = r * 0.7
        return (f'<rect x="{cx-d}" y="{cy-d}" width="{2*d}" height="{2*d}" rx="{r*0.08}" fill="none" '
                f'stroke="{color}" stroke-width="{sw}"/>')
    # arrows (d-pad): up / right / down / left
    rot = {'up': 0, 'right': 90, 'down': 180, 'left': 270}[kind]
    return (f'<g transform="rotate({rot} {cx} {cy})"><path d="M{cx} {cy-r*0.8} L{cx+r*0.62} {cy-r*0.05} L{cx+r*0.24} {cy-r*0.05} '
            f'L{cx+r*0.24} {cy+r*0.75} L{cx-r*0.24} {cy+r*0.75} L{cx-r*0.24} {cy-r*0.05} L{cx-r*0.62} {cy-r*0.05} Z" '
            f'fill="{color}"/></g>')

def person(cx, cy, s, color):
    return (f'<circle cx="{cx}" cy="{cy-0.42*s}" r="{0.3*s}" fill="{color}"/>'
            f'<path d="M{cx-0.55*s} {cy+0.62*s} q0 -0.72 {0.55*s} -0.72 q{0.55*s} 0 {0.55*s} 0.72 z" fill="{color}"/>')

def cup(cx, cy, s, fill):
    """Generic small trophy cup for achievement tiles."""
    return (f'<path d="M{cx-0.5*s} {cy-0.6*s} H{cx+0.5*s} V{cy-0.2*s} Q{cx+0.5*s} {cy+0.25*s} {cx} {cy+0.3*s} '
            f'Q{cx-0.5*s} {cy+0.25*s} {cx-0.5*s} {cy-0.2*s} Z" fill="{fill}"/>'
            f'<path d="M{cx-0.5*s} {cy-0.45*s} q{-0.28*s} 0 {-0.28*s} {0.2*s} q0 {0.22*s} {0.3*s} {0.26*s}" fill="none" stroke="{fill}" stroke-width="{0.08*s}"/>'
            f'<path d="M{cx+0.5*s} {cy-0.45*s} q{0.28*s} 0 {0.28*s} {0.2*s} q0 {0.22*s} {-0.3*s} {0.26*s}" fill="none" stroke="{fill}" stroke-width="{0.08*s}"/>'
            f'<rect x="{cx-0.08*s}" y="{cy+0.3*s}" width="{0.16*s}" height="{0.22*s}" fill="{fill}"/>'
            f'<rect x="{cx-0.32*s}" y="{cy+0.52*s}" width="{0.64*s}" height="{0.14*s}" rx="{0.03*s}" fill="{fill}"/>')

def frame(label, footer, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="16.0in" height="120.0in" viewBox="0 0 16.0 120.0">'
            f'{DEFS}{BG}{BRACKETS}{LOGO}{NEON}'
            + T(8, 7.7519, label, 0.9, 'Rajdhani', 700, SKY, 0.35)
            + body
            + T(8, 103.0, '4TH FLOOR · IFIC BANK BUILDING', 0.7954, 'Rajdhani', 700, '#8FA3C0', 0.08)
            + T(8, 104.55, 'RANIR BAZAR · CUMILLA', 0.86, 'Rajdhani', 700, '#FFFFFF', 0.12)
            + FLOOR + T(8, 119.02, footer, 0.66, 'Rajdhani', 700, '#8FA3C0', 0.1782) + '</svg>')

def ps5_block(sub, pill):
    return (T(8, 89.4, 'PS5 GAMING', 1.8, tl=13.0) + T(8, 91.2, sub, 0.85, 'Rajdhani', 700, '#C9D6EA', 0.08)
            + '<rect x="2.6" y="96.0" width="10.8" height="1.9" rx="0.95" fill="url(#pill)"/>'
            + T(8, 97.32, pill, 0.9, ls=0.2, tl=(9.2 if len(pill) > 9 else None)))

# ---------------- 5-A BOOK YOUR SLOT ----------------
def face_a():
    b = T(8, 17.6, 'BOOK', 3.3, tl=11.2) + outline(8, 22.0, 'YOUR SLOT', 2.05, 12.8)
    b += chevrons(26.0) + chev_text(26.45, 'SKIP THE WAIT')
    # phone mockup with a booking screen
    b += '<rect x="3.6" y="29.6" width="8.8" height="17.0" rx="1.2" fill="#081733" stroke="#4DA3FF" stroke-width="0.1"/>'
    b += '<rect x="6.6" y="30.1" width="2.8" height="0.35" rx="0.17" fill="#1B3A73"/>'
    b += T(8, 31.95, 'PICK YOUR TIME', 0.62, ls=0.08, fill=SKY)
    for r in range(4):
        for c in range(3):
            x, y = 4.35 + c * 2.5, 32.9 + r * 2.15
            sel = (r, c) == (1, 1)
            b += (f'<rect x="{x}" y="{y}" width="2.3" height="1.7" rx="0.3" fill="{BLUE if sel else "#0E2550"}" '
                  f'stroke="{"#9AD0FF" if sel else "#2B83F6"}" stroke-opacity="{1 if sel else 0.5}" stroke-width="0.05"/>')
            if sel:
                b += f'<path d="M{x+0.72} {y+0.88} l0.36 0.34 l0.62 -0.7" fill="none" stroke="#FFFFFF" stroke-width="0.14" stroke-linecap="round" stroke-linejoin="round"/>'
            else:
                b += f'<rect x="{x+0.5}" y="{y+0.75}" width="1.3" height="0.2" rx="0.1" fill="#4DA3FF" opacity="0.35"/>'
    b += '<rect x="4.35" y="42.1" width="7.3" height="1.35" rx="0.67" fill="url(#pill)"/>' + T(8, 43.05, 'CONFIRM', 0.62, ls=0.15)
    b += '<rect x="6.9" y="45.3" width="2.2" height="0.18" rx="0.09" fill="#4DA3FF" opacity="0.6"/>'
    # QR at eye level (centre about 63in above the floor)
    b += '<rect x="5.1" y="48.3" width="5.8" height="1.4" rx="0.7" fill="url(#pill)"/>' + T(8, 49.33, 'SCAN ME', 0.72, ls=0.22)
    b += '<rect x="3.0" y="51.0" width="10.0" height="10.0" rx="0.55" fill="#FFFFFF"/>'
    b += f'<g transform="translate(3.75 51.75) scale({8.5/QN})"><path stroke="#04070E" d="{QR_PATH}"/></g>'
    for (x, y, dx, dy) in [(2.3, 50.3, 1, 1), (13.7, 50.3, -1, 1), (2.3, 61.7, 1, -1), (13.7, 61.7, -1, -1)]:
        b += f'<path d="M{x} {y+dy*1.4} V{y} H{x+dx*1.4}" fill="none" stroke="{LIGHT}" stroke-width="0.14" stroke-linecap="round"/>'
    b += T(8, 63.9, 'champion.gemten.com.bd', 0.92, 'Rajdhani', 700, '#FFFFFF', 0.04)
    # three steps
    steps = [('01', 'SCAN THE CODE'), ('02', 'PICK YOUR TIME'), ('03', 'PRESS START')]
    b += '<line x1="3.4" y1="68.5" x2="3.4" y2="79.5" stroke="#4DA3FF" stroke-opacity="0.45" stroke-width="0.07" stroke-dasharray="0.3 0.22"/>'
    for i, (n, s) in enumerate(steps):
        y = 68.5 + i * 5.5
        b += f'<circle cx="3.4" cy="{y}" r="1.05" fill="#0B1E46" stroke="{LIGHT}" stroke-width="0.09"/>'
        b += T(3.4, y + 0.33, n, 0.75, fill=LIGHT)
        b += T(5.2, y + 0.36, s, 0.98, anchor='start', tl=None)
    b += ps5_block('BOOK ONLINE · PLAY ON TIME', 'BOOK NOW')
    return frame('ONLINE BOOKING', 'SCAN · BOOK · PLAY', b)

# ---------------- 5-B CHAMPION COMBO ----------------
def face_b():
    b = T(8, 15.6, 'CHAMPION', 2.1, tl=12.6) + outline(8, 20.9, 'COMBO', 3.3, 11.4)
    b += chevrons(24.6) + chev_text(25.05, 'ENTER THE CODE')
    seq = ['up', 'right', 'down', 'left', 'tri', 'cir', 'x', 'sq']
    top, pitch, tile = 28.6, 4.55, 3.5
    b += f'<line x1="8" y1="{top}" x2="8" y2="{top+pitch*7+tile}" stroke="#4DA3FF" stroke-opacity="0.35" stroke-width="0.08" stroke-dasharray="0.25 0.25"/>'
    for i, k in enumerate(seq):
        y = top + i * pitch
        last = i == len(seq) - 1
        if last:
            b += f'<ellipse cx="8" cy="{y+tile/2}" rx="4.2" ry="4.2" fill="url(#glow)"/>'
        b += (f'<rect x="{8-tile/2}" y="{y}" width="{tile}" height="{tile}" rx="0.6" '
              f'fill="{"url(#btnG)" if last else "#0B1E46"}" stroke="{"#9AD0FF" if last else LIGHT}" stroke-width="0.09"/>')
        b += sym(k, 8, y + tile / 2, 1.1, '#FFFFFF' if (last or k in ('up', 'right', 'down', 'left')) else SKY, 0.24)
        b += T(3.2, y + tile / 2 + 0.3, f'{i+1:02d}', 0.8, fill='#4DA3FF', extra='opacity="0.75"')
        b += (f'<path d="M{12.25} {y+tile/2+0.05} l0.36 0.36 l0.72 -0.82" fill="none" stroke="{LIGHT}" '
              f'stroke-width="0.14" stroke-linecap="round" stroke-linejoin="round"/>')
    y = top + pitch * 7 + tile + 1.5   # ~66.95
    b += f'<rect x="1.8" y="{y}" width="12.4" height="3.6" rx="0.4" fill="#0B1E46" stroke="{LIGHT}" stroke-width="0.09"/>'
    b += T(8, y + 1.45, 'COMBO UNLOCKED', 0.95, ls=0.05)
    b += T(8, y + 2.75, 'x8 · PERFECT INPUT', 0.8, 'Rajdhani', 700, SKY, 0.2)
    b += f'<g transform="translate(0 {78.0-82.5})">{CONTROLLER}</g>'
    b += ps5_block('PRACTICE · MASTER · WIN', 'TRY IT HERE')
    return frame('SECRET MOVE', 'PRACTICE MAKES CHAMPIONS', b)

# ---------------- 5-C CHOOSE YOUR MODE ----------------
def face_c():
    b = T(8, 15.8, 'CHOOSE', 2.55, tl=12.4) + outline(8, 20.5, 'YOUR MODE', 2.05, 12.8)
    b += chevrons(24.4) + chev_text(24.85, 'SELECT ONE')
    x, y0, w = 1.4, 28.6, 13.2
    b += f'<rect x="{x}" y="{y0}" width="{w}" height="44.2" rx="0.6" fill="#071430" stroke="{LIGHT}" stroke-width="0.09"/>'
    b += f'<rect x="{x}" y="{y0}" width="{w}" height="2.4" rx="0.6" fill="url(#pill)"/><rect x="{x}" y="{y0+1.6}" width="{w}" height="0.8" fill="#2B83F6"/>'
    b += T(8, y0 + 1.6, 'GAME MODE', 0.85, ls=0.3)
    modes = [('SOLO', 'TRAIN · LEVEL UP', 1), ('CO-OP', 'TEAM UP WITH A FRIEND', 2),
             ('VERSUS', '1V1 · BRAGGING RIGHTS', 'vs'), ('PARTY', 'BRING YOUR SQUAD', 4)]
    for i, (name, sub, ic) in enumerate(modes):
        y = y0 + 3.4 + i * 10.0
        sel = i == 1
        b += (f'<rect x="{x+0.6}" y="{y}" width="{w-1.2}" height="9.0" rx="0.45" fill="{"url(#btnG)" if sel else "#0B1E46"}" '
              f'stroke="{"#9AD0FF" if sel else "#2B83F6"}" stroke-opacity="{1 if sel else 0.55}" stroke-width="0.07"/>')
        cy = y + 3.4
        if ic == 'vs':
            b += f'<circle cx="8" cy="{cy}" r="1.55" fill="#04102A" stroke="{LIGHT}" stroke-width="0.09"/>' + T(8, cy + 0.42, 'VS', 1.05)
            b += person(4.4, cy, 1.9, SKY) + person(11.6, cy, 1.9, '#FFFFFF')
        else:
            n = ic
            span = 2.2
            for k in range(n):
                px = 8 + (k - (n - 1) / 2) * span
                b += person(px, cy, 1.9, ['#FFFFFF', SKY, '#FFFFFF', '#9AA6B8'][k] if not sel else '#FFFFFF')
        b += T(8, y + 6.75, name, 1.15, ls=0.1)
        b += T(8, y + 8.05, sub, 0.72, 'Rajdhani', 700, '#E6F0FF' if sel else '#C9D6EA', 0.12)
        if sel:
            b += f'<path d="M{x+0.05} {y+4.0} l1.0 0.65 l-1.0 0.65 z" fill="#FFFFFF"/>'
    # confirm hint
    b += f'<circle cx="4.6" cy="77.0" r="1.15" fill="#0B1E46" stroke="{LIGHT}" stroke-width="0.09"/>' + sym('x', 4.6, 77.0, 0.75, '#FFFFFF', 0.18)
    b += T(6.2, 77.36, 'TO CONFIRM', 1.0, anchor='start')
    b += f'<circle cx="4.6" cy="80.6" r="1.15" fill="#0B1E46" stroke="{LIGHT}" stroke-opacity="0.6" stroke-width="0.09"/>' + sym('cir', 4.6, 80.6, 0.75, '#C9D6EA', 0.18)
    b += T(6.2, 80.96, 'TO GO BACK', 1.0, anchor='start', fill='#C9D6EA')
    b += ps5_block('SOLO · CO-OP · VERSUS · PARTY', 'PLAY YOUR WAY')
    return frame('SELECT MODE', 'EVERY MODE ENDS IN GG', b)

# ---------------- 5-D TROPHY UNLOCKED ----------------
def face_d():
    b = T(8, 15.8, 'TROPHY', 2.55, tl=12.0) + outline(8, 20.5, 'UNLOCKED', 2.1, 13.2)
    b += chevrons(24.4) + chev_text(24.85, 'PLAY TO EARN')
    # big brand trophy (same shapes as the logo trophy) with glow rings
    cy = 34.6
    b += f'<ellipse cx="8" cy="{cy}" rx="7.2" ry="7.2" fill="url(#glow)"/>'
    b += f'<circle cx="8" cy="{cy}" r="5.6" fill="none" stroke="{LIGHT}" stroke-opacity="0.5" stroke-width="0.08"/>'
    b += f'<circle cx="8" cy="{cy}" r="6.6" fill="none" stroke="{LIGHT}" stroke-opacity="0.25" stroke-width="0.08" stroke-dasharray="0.8 0.5"/>'
    trophy = re.search(r'<g fill="url\(#trophyGrad\)"[^>]*>(.*?)</g>', src).group(1)
    s = 7.6 / (594 - 245)
    b += f'<g fill="url(#trophyGrad)" transform="translate({8 - 103.5*s:.4f} {cy-3.8:.4f}) scale({s:.5f}) translate(-87 -245)">{trophy}</g>'
    tiers = [('FIRST VISIT', 'FOUND THE 4TH FLOOR', '#C98A55', 'BRONZE'),
             ('PLAYER 2 FOUND', 'PLAYED WITH A FRIEND', '#C98A55', 'BRONZE'),
             ('BOOKED ONLINE', 'SKIPPED THE WAIT', '#C9D3E0', 'SILVER'),
             ('GG MASTER', 'SAID GG, WIN OR LOSE', '#F0B429', 'GOLD'),
             ('CHAMPION', 'UNLOCK THEM ALL', '#7CC2FF', 'PLATINUM')]
    for i, (t, d, col, tier) in enumerate(tiers):
        y = 43.4 + i * 6.55
        last = i == len(tiers) - 1
        b += (f'<rect x="1.1" y="{y}" width="13.8" height="5.4" rx="0.55" fill="{"url(#btnG)" if last else "#0B1E46"}" '
              f'stroke="{"#9AD0FF" if last else LIGHT}" stroke-opacity="{1 if last else 0.6}" stroke-width="0.08"/>')
        b += f'<rect x="1.6" y="{y+0.5}" width="4.4" height="4.4" rx="0.45" fill="#04102A" stroke="{col}" stroke-width="0.09"/>'
        b += cup(3.8, y + 2.55, 2.6, col)
        b += T(6.6, y + 1.55, 'TROPHY UNLOCKED', 0.6, 'Rajdhani', 700, '#E6F0FF' if last else SKY, 0.14, 'start')
        b += T(6.6, y + 2.95, t, 0.86 if len(t) < 12 else 0.7, anchor='start')
        b += T(6.6, y + 4.25, d, 0.66, 'Rajdhani', 700, '#E6F0FF' if last else '#C9D6EA', 0.06, 'start')
    b += T(8, 79.6, 'COLLECT THEM ALL', 1.05, tl=12.4)
    b += T(8, 81.2, 'BRONZE · SILVER · GOLD · PLATINUM', 0.72, 'Rajdhani', 700, SKY, 0.12)
    b += ps5_block('PLAY · UNLOCK · REPEAT', 'START COLLECTING')
    return frame('ACHIEVEMENTS', 'EVERY VISIT COUNTS', b)

FACES = [('P5A', 'BookYourSlot', face_a), ('P5B', 'ChampionCombo', face_b),
         ('P5C', 'ChooseYourMode', face_c), ('P5D', 'TrophyUnlocked', face_d)]
FONTS = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}'''
for code, name, fn in FACES:
    svg = fn()
    base = f'Champion_12_{code}_{name}_16x120in'
    open(os.path.join(HERE, base + '_source.svg'), 'w').write(svg)
    open(os.path.join(HERE, base + '.html'), 'w').write(
        f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}@page{{size:16in 120in;margin:0}}'
        f'*{{margin:0;padding:0}}html,body{{width:16in;height:120in;overflow:hidden;background:#04070E}}svg{{display:block}}</style></head>'
        f'<body>{svg}</body></html>')
    print('wrote', base)
