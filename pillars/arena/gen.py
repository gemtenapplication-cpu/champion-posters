"""ARENA pillar (master pillar): membership + community, in the Champion_12 pillar style.

  Front  20 x 120 in : JOIN THE ARENA, Champ, sign-up QR at eye level, Silver member card + 6 community icons
  Left   12 x 120 in : BE A MEMBER   - member-badge hero icon, the member perks, Arena tie-in
  Right  12 x 120 in : RISE TOGETHER - community-network hero icon, 4 steps from sign-up to trophy, member tie-in

Facts come only from the existing membership / community stickers (Silver free, 10% off standard sessions booked
from your account, member ID + QR, 10 points per Tk 100, rewards such as a free hour, Gold at 2,000 points,
refer a friend 20% off one slot, community feed / leaderboard / challenges / teams / tournaments / chat).
Logo, background gradient, scanline pattern and pill gradient come from the P1A source (../p5-playstation).
"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, '..', 'p5-playstation', 'style-source-P1A.svg')).read()
DEFS = src[src.index('<defs>'):src.index('</defs>')]
LOGO = src[src.index('<g transform="translate(2.0000 3.0000) scale(0.0114504)'):src.index('<rect x="3.0" y="5.75')]
qr = open(os.path.join(HERE, '..', 'p5-playstation', 'qr.svg')).read()
QN = int(re.search(r'viewBox="0 0 (\d+) \1"', qr).group(1))
QR_PATH = re.search(r'<path stroke="#000000" d="([^"]+)"', qr).group(1)
champ = open(os.path.join(HERE, 'champ-cheer.svg')).read()
CHAMP = champ[champ.index('<defs>'):champ.rindex('</svg>')]
TROPHY = re.search(r'<g fill="url\(#trophyGrad\)"[^>]*>(.*?)</g>', src).group(1)

BLUE, LIGHT, DEEP, SKY = '#2B83F6', '#4DA3FF', '#1F6FE5', '#6BB8FF'
EXTRA = ('<linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F7FB"/>'
         '<stop offset="0.45" stop-color="#C9D3E0"/><stop offset="0.55" stop-color="#E9EEF5"/><stop offset="1" stop-color="#9AA6B8"/></linearGradient>'
         '<linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16346E"/><stop offset="1" stop-color="#0A1838"/></linearGradient>'
         '<linearGradient id="arenaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AD0FF"/>'
         '<stop offset="0.5" stop-color="#4DA3FF"/><stop offset="1" stop-color="#1F6FE5"/></linearGradient>')

def T(x, y, s, size, font='Orbitron', w=900, fill='#FFFFFF', ls=0, anchor='middle', tl=None, extra=''):
    fam = "'Orbitron'" if font == 'Orbitron' else "'Rajdhani'"
    t = f' textLength="{tl}" lengthAdjust="spacingAndGlyphs"' if tl else ''
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-weight="{w}" font-size="{size}" letter-spacing="{ls}" '
            f'fill="{fill}" text-anchor="{anchor}"{t} {extra}>{s}</text>')

def R(x, y, s, size, fill='#C9D6EA', ls=0.08, anchor='middle', tl=None):
    return T(x, y, s, size, 'Rajdhani', 700, fill, ls, anchor, tl)

ICONS = {
    'feed': '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7.5 8h9M7.5 12h9M7.5 16h5"/>',
    'board': '<path d="M4 20v-7h4v7M10 20V5h4v15M16 20v-10h4v10M2.5 20.5h19"/>',
    'vs': '<circle cx="12" cy="12" r="9"/><path d="M7 9l2.2 6 2.2-6M17 9.6c-.6-.6-1.4-.8-2.2-.6-.9.3-1.2 1.2-.6 1.8.5.5 1.6.6 2.2 1.1.7.6.4 1.7-.5 2-.8.3-1.8 0-2.3-.6"/>',
    'teams': '<circle cx="12" cy="7.5" r="3"/><path d="M6.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6"/><circle cx="5" cy="9.5" r="2"/><circle cx="19" cy="9.5" r="2"/><path d="M1.5 18.5c0-2.2 1.5-3.8 3.5-3.8M22.5 18.5c0-2.2-1.5-3.8-3.5-3.8"/>',
    'cup': '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5c0 2.5 1.2 4 3 4.2M17 6h2.5c0 2.5-1.2 4-3 4.2M12 14v3M9.5 17h5M8 20.5h8"/>',
    'chat': '<path d="M4 4.5h16v11H10l-5 4v-4H4z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>',
    'card': '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 9.5h19M5.5 15h5"/>',
    'coin': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.6"/><path d="M12 9.2v5.6M9.2 12h5.6"/>',
    'gift': '<rect x="3" y="8.5" width="18" height="4" rx="1"/><path d="M4.5 12.5v8h15v-8M12 8.5v12M12 8.5c-1.5-3.5-5.5-4-5.5-1.6 0 1.6 3 1.6 5.5 1.6 2.5 0 5.5 0 5.5-1.6 0-2.4-4-1.9-5.5 1.6"/>',
    'crown': '<path d="M3 17.5L2 7l5.5 4L12 4l4.5 7L22 7l-1 10.5z"/><path d="M4 21h16"/>',
    'refer': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5M19 7.5v6M16 10.5h6"/>',
    'at': '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2"/>',
    'join': '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20.5c0-3.6 2.9-6.5 6.5-6.5 1.4 0 2.7.4 3.7 1.2M18.5 14v7M15 17.5h7"/>',
}
def icon(name, cx, cy, size, color='#FFFFFF', sw=1.7):
    s = size / 24
    return (f'<g transform="translate({cx - size/2:.4f} {cy - size/2:.4f}) scale({s:.5f})" fill="none" stroke="{color}" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{ICONS[name]}</g>')

def qr_card(x, y, size):
    pad = size * 0.075
    return (f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="{size*0.06:.3f}" fill="#FFFFFF"/>'
            f'<g transform="translate({x+pad:.4f} {y+pad:.4f}) scale({(size-2*pad)/QN:.5f})"><path stroke="#04070E" d="{QR_PATH}"/></g>')

def chevrons(cx, y, half):
    one = ''.join(f'<path d="M {cx-half+i*0.6:.3f} {y-0.5} L {cx-half+0.45+i*0.6:.3f} {y} L {cx-half+i*0.6:.3f} {y+0.5} '
                  f'L {cx-half+0.2+i*0.6:.3f} {y+0.5} L {cx-half+0.65+i*0.6:.3f} {y} L {cx-half+0.2+i*0.6:.3f} {y-0.5} Z" '
                  f'fill="{LIGHT}" opacity="{0.57+i*0.215:.2f}"/>' for i in range(3))
    return one + f'<g transform="translate({2*cx} 0) scale(-1 1)">{one}</g>'

def pill(cx, y, w, s, size=0.95):
    return (f'<rect x="{cx-w/2}" y="{y}" width="{w}" height="1.9" rx="0.95" fill="url(#pill)"/>'
            + T(cx, y + 1.32, s, size, ls=0.2, tl=(w - 1.4 if len(s) * size * 0.95 > w - 1.4 else None)))

def frame(W, label, footer, body):
    cx = W / 2
    lw = 14.0 if W >= 18 else 9.6
    k = 0.0114504 * lw / 12
    logo = LOGO.replace('translate(2.0000 3.0000) scale(0.0114504)', f'translate({cx-lw/2:.4f} 3.0) scale({k:.7f})', 1)
    a = 2.0
    br = (f'M 0.9 {0.9+a} L 0.9 0.9 L {0.9+a} 0.9 M {W-0.9-a} 0.9 L {W-0.9} 0.9 L {W-0.9} {0.9+a} '
          f'M 0.9 112.6 L 0.9 114.6 L {0.9+a} 114.6 M {W-0.9-a} 114.6 L {W-0.9} 114.6 L {W-0.9} 112.6')
    grid = ''
    for i in range(-6, 7):
        grid += f'<line x1="{cx}" y1="107.2" x2="{cx + i*W*0.19:.3f}" y2="117.4"/>'
    for yy in [107.398, 108.110, 109.420, 111.380, 114.030, 117.400]:
        grid += f'<line x1="0" y1="{yy}" x2="{W}" y2="{yy}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:g}in" height="120in" viewBox="0 0 {W:g} 120">'
            f'{DEFS}{EXTRA}</defs><rect width="{W}" height="120" fill="url(#bgN)"/><rect width="{W}" height="120" fill="url(#scan)"/>'
            f'<path d="{br}" fill="none" stroke="{LIGHT}" stroke-width="0.1" stroke-linecap="square"/>{logo}'
            f'<rect x="{cx-lw*0.42:.3f}" y="5.95" width="{lw*0.84:.3f}" height="0.07" fill="url(#neonH)"/>'
            + T(cx, 8.1, label, 0.9, 'Rajdhani', 700, SKY, 0.35)
            + body
            + R(cx, 101.4, '4TH FLOOR · IFIC BANK BUILDING', 0.7954, '#8FA3C0', 0.08, tl=(W - 2.0 if W < 16 else None))
            + R(cx, 102.95, 'RANIR BAZAR · CUMILLA', 0.86, '#FFFFFF', 0.12, tl=(W - 2.6 if W < 16 else None))
            + R(cx, 104.4, 'OPEN 10:00–23:00 · 01603-754074', 0.72, SKY, 0.1, tl=(W - 2.2 if W < 16 else None))
            + f'<g stroke="#2B83F6" stroke-opacity="0.18" stroke-width="0.04" fill="none">{grid}</g>'
            + f'<rect x="0" y="117.4" width="{W}" height="2.6" fill="#03050B"/><rect x="0" y="117.35" width="{W}" height="0.08" fill="{BLUE}"/>'
            + R(cx, 119.02, footer, 0.66, '#8FA3C0', 0.1782) + '</svg>')

# ------------------------------------------------------------------ FRONT 20in
def front():
    W, cx = 20.0, 10.0
    b = T(cx, 14.0, 'JOIN THE', 2.3, tl=12.6)
    b += T(cx, 21.4, 'ARENA', 6.0, fill='url(#arenaFill)', tl=17.4)
    b += chevrons(cx, 24.3, 7.4) + R(cx, 24.62, 'PLAY TOGETHER · RISE TOGETHER', 0.9, '#FFFFFF', 0.25, tl=10.0)
    # Champ with glow, rings and a speech bubble (feet ~ 72in above the floor)
    ccx, top, h = 7.4, 27.4, 19.6
    s = h / 250
    b += f'<ellipse cx="{ccx}" cy="{top+h*0.5}" rx="8.6" ry="8.6" fill="url(#glow)"/>'
    b += f'<circle cx="{ccx}" cy="{top+h*0.5}" r="7.2" fill="none" stroke="{LIGHT}" stroke-opacity="0.35" stroke-width="0.08" stroke-dasharray="0.8 0.5"/>'
    b += f'<ellipse cx="{ccx}" cy="{top+h-0.55}" rx="5.2" ry="0.8" fill="#2B83F6" opacity="0.35"/>'
    b += f'<g transform="translate({ccx - 110*s:.4f} {top:.4f}) scale({s:.5f})">{CHAMP}</g>'
    bx, by, bw, bh = 12.0, 28.8, 7.2, 7.4
    b += (f'<path d="M{bx+0.5} {by} H{bx+bw-0.5} Q{bx+bw} {by} {bx+bw} {by+0.5} V{by+bh-0.5} Q{bx+bw} {by+bh} {bx+bw-0.5} {by+bh} '
          f'H{bx+1.9} L{bx-0.6} {by+bh+1.5} L{bx+0.9} {by+bh} H{bx+0.5} Q{bx} {by+bh} {bx} {by+bh-0.5} V{by+0.5} Q{bx} {by} {bx+0.5} {by} Z" '
          f'fill="#FFFFFF"/>')
    b += T(bx + bw/2, by + 1.85, 'GG!', 1.35, fill=DEEP)
    b += R(bx + bw/2, by + 3.35, 'YOUR NEXT RIVAL', 0.8, '#0B1E46', 0.08, tl=5.8)
    b += R(bx + bw/2, by + 4.45, 'IS ALREADY HERE.', 0.8, '#0B1E46', 0.08, tl=5.8)
    b += R(bx + bw/2, by + 6.15, '— CHAMP', 0.72, BLUE, 0.2)
    b += R(15.6, 39.6, 'MEET CHAMP', 0.8, SKY, 0.3)
    b += R(15.6, 40.8, 'YOUR ARENA HOST', 0.7, '#C9D6EA', 0.2)
    # sign-up panel with the QR at eye level (centre ~ 64in above the floor)
    py = 49.2
    b += f'<rect x="1.2" y="{py}" width="17.6" height="15.4" rx="0.7" fill="#071430" stroke="{LIGHT}" stroke-width="0.09"/>'
    b += qr_card(2.2, py + 1.0, 9.4)
    tx = 14.95
    b += T(tx, py + 2.2, 'SCAN TO', 0.95, ls=0.1)
    b += T(tx, py + 3.6, 'JOIN', 1.55, fill=LIGHT, tl=4.6)
    b += T(tx, py + 5.6, 'FREE', 2.0, tl=5.6)
    b += f'<rect x="{tx-2.9}" y="{py+6.4}" width="5.8" height="0.06" fill="{LIGHT}" opacity="0.6"/>'
    for i, (ic, t1) in enumerate([('card', 'BOOK'), ('coin', 'EARN POINTS'), ('cup', 'PLAY TOURNEYS')]):
        yy = py + 7.6 + i * 1.75
        b += icon(ic, tx - 2.35, yy - 0.3, 1.1, LIGHT, 1.8)
        b += R(tx - 1.55, yy, t1, 0.78, '#FFFFFF', 0.08, 'start', tl=(4.1 if len(t1) > 10 else None))
    b += R(tx, py + 13.3, 'ONE ACCOUNT · 1 MINUTE', 0.68, SKY, 0.1, tl=5.4)
    b += R(cx, py + 14.65, 'champion.gemten.com.bd', 0.95, '#FFFFFF', 0.04)
    # two power-ups: Silver membership + Arena community
    hy = 67.6
    b += T(cx, hy, 'ONE ACCOUNT · TWO POWER-UPS', 0.95, fill='#FFFFFF', tl=16.0)
    cy0, ch, cw = 68.9, 20.6, 8.6
    # membership card
    x1 = 1.0
    b += f'<rect x="{x1}" y="{cy0}" width="{cw}" height="{ch}" rx="0.6" fill="url(#cardBg)" stroke="#C9D3E0" stroke-width="0.09"/>'
    b += R(x1 + cw/2, cy0 + 1.35, 'MEMBERSHIP', 0.8, SKY, 0.3)
    b += f'<rect x="{x1+0.8}" y="{cy0+2.0}" width="{cw-1.6}" height="4.3" rx="0.45" fill="url(#silver)"/>'
    b += f'<rect x="{x1+1.3}" y="{cy0+2.6}" width="1.3" height="1.0" rx="0.2" fill="#9AA6B8" stroke="#6B778A" stroke-width="0.04"/>'
    b += T(x1 + cw/2 + 0.55, cy0 + 3.5, 'SILVER', 0.95, fill='#0B1E46', tl=4.2)
    b += R(x1 + cw/2 + 0.55, cy0 + 4.55, 'MEMBER', 0.85, '#16346E', 0.4)
    b += R(x1 + 1.3, cy0 + 5.75, 'ID · 0000 0000', 0.55, '#4A5568', 0.1, 'start')
    b += T(x1 + cw/2, cy0 + 9.2, '10%', 3.0, fill='#FFFFFF', tl=6.0)
    b += T(x1 + cw/2, cy0 + 10.5, 'OFF', 1.0, fill=LIGHT, ls=0.3)
    b += R(x1 + cw/2, cy0 + 11.6, 'EVERY STANDARD SESSION', 0.66, '#C9D6EA', 0.06, tl=6.8)
    for i, (ic, t1) in enumerate([('card', 'MEMBER ID + QR'), ('coin', '+10 PTS / TK 100'), ('crown', 'GOLD AT 2,000')]):
        yy = cy0 + 13.3 + i * 1.6
        b += icon(ic, x1 + 1.35, yy - 0.3, 1.15, LIGHT, 1.8)
        b += R(x1 + 2.25, yy, t1, 0.74, '#FFFFFF', 0.04, 'start', tl=(5.7 if len(t1) > 13 else None))
    b += pill(x1 + cw/2, cy0 + ch - 2.75, cw - 1.6, 'FREE', 0.9)
    # arena card
    x2 = 10.4
    b += f'<rect x="{x2}" y="{cy0}" width="{cw}" height="{ch}" rx="0.6" fill="url(#cardBg)" stroke="{LIGHT}" stroke-width="0.09"/>'
    b += R(x2 + cw/2, cy0 + 1.35, 'ARENA COMMUNITY', 0.8, SKY, 0.3, tl=6.6)
    feats = [('feed', 'FEED'), ('board', 'LEADERBOARD'), ('vs', 'CHALLENGES'), ('teams', 'TEAMS'), ('cup', 'TOURNAMENTS'), ('chat', 'CHAT')]
    for i, (ic, t1) in enumerate(feats):
        col, row = i % 2, i // 2
        fx, fy = x2 + 2.2 + col * 4.2, cy0 + 2.4 + row * 4.85
        b += f'<rect x="{fx-1.7}" y="{fy}" width="3.4" height="3.0" rx="0.4" fill="#0B1E46" stroke="{BLUE}" stroke-opacity="0.6" stroke-width="0.06"/>'
        b += icon(ic, fx, fy + 1.5, 2.0, '#FFFFFF', 1.6)
        b += R(fx, fy + 3.85, t1, 0.62, '#FFFFFF', 0.06, tl=(3.7 if len(t1) > 9 else None))
    b += pill(x2 + cw/2, cy0 + ch - 2.75, cw - 1.6, 'FREE', 0.9)
    b += R(cx, 91.6, 'NEW TOURNAMENTS ARE POSTED IN THE ARENA FIRST', 0.82, SKY, 0.08, tl=16.4)
    b += pill(cx, 92.8, 13.0, 'SIGN UP FREE TODAY')
    b += R(cx, 96.6, '10% member discount applies to standard sessions booked from your account.', 0.5, '#7C8BA3', 0.02, tl=16.6)
    b += R(cx, 97.35, 'Not combined with packs & offers. Points and rewards have no cash value.', 0.5, '#7C8BA3', 0.02, tl=16.0)
    return frame(W, 'THE CHAMPION COMMUNITY', 'CHAMPION · ARENA', b)

# ------------------------------------------------------------------ SIDES 12in
def side_qr(cx, y):
    return (qr_card(cx - 2.9, y, 5.8) + T(cx, y + 6.9, 'SCAN · JOIN FREE', 0.72, ls=0.1)
            + R(cx, y + 7.9, 'champion.gemten.com.bd', 0.72, '#C9D6EA', 0.03))

def hero(cx, cy, inner):
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="5.6" ry="5.6" fill="url(#glow)"/>'
            f'<circle cx="{cx}" cy="{cy}" r="4.3" fill="#0B1E46" stroke="{LIGHT}" stroke-width="0.1"/>'
            f'<circle cx="{cx}" cy="{cy}" r="5.1" fill="none" stroke="{LIGHT}" stroke-opacity="0.3" stroke-width="0.08" stroke-dasharray="0.7 0.45"/>'
            + inner)

def row_card(x, y, w, h, ic, title, sub, hi=False):
    t = 3.4                                   # icon tile
    tx = x + 0.45 + t + 0.45
    avail = x + w - 0.4 - tx
    tl_lines, sub_lines = title.split(' / '), sub.split(' / ')
    block = len(tl_lines) * 0.88 + 0.3 + len(sub_lines) * 0.72
    y0 = y + (h - block) / 2 + 0.66
    out = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="0.45" fill="{"url(#btnG)" if hi else "#0B1E46"}" '
           f'stroke="{"#9AD0FF" if hi else LIGHT}" stroke-opacity="{1 if hi else 0.6}" stroke-width="0.07"/>'
           f'<rect x="{x+0.45}" y="{y+(h-t)/2}" width="{t}" height="{t}" rx="0.35" fill="#04102A" stroke="{LIGHT}" stroke-width="0.06"/>'
           + icon(ic, x + 0.45 + t/2, y + h/2, t - 1.0, '#FFFFFF', 1.7))
    for i, ln in enumerate(tl_lines):
        est = len(ln) * 0.74 * 0.72
        out += T(tx, y0 + i * 0.88, ln, 0.72, anchor='start', tl=(avail if est > avail else None))
    ys = y0 + (len(tl_lines) - 1) * 0.88 + 0.3 + 0.72
    for i, ln in enumerate(sub_lines):
        est = len(ln) * 0.29
        out += R(tx, ys + i * 0.72, ln, 0.6, '#E6F0FF' if hi else '#C9D6EA', 0.04, 'start', tl=(avail if est > avail else None))
    return out

def left():
    W, cx = 12.0, 6.0
    b = T(cx, 14.0, 'BE A', 2.0, tl=5.6)
    b += T(cx, 18.6, 'MEMBER', 2.2, fill='none', tl=9.6, extra=f'stroke="{LIGHT}" stroke-width="0.11"')
    b += chevrons(cx, 21.6, 5.2) + R(cx, 21.92, 'FREE · 1 MINUTE', 0.85, '#FFFFFF', 0.25, tl=4.6)
    # hero: silver member badge (shield + star)
    hy = 30.0
    badge = (f'<g transform="translate({cx-3.0} {hy-3.3}) scale(0.25)"><path d="M12 1.5l10 3.6v7.6c0 6.4-4.3 11-10 12.8C6.3 23.7 2 19.1 2 12.7V5.1z" '
             f'fill="url(#silver)" stroke="#FFFFFF" stroke-width="0.5"/><path d="M12 7l1.6 3.4 3.7.4-2.8 2.5.8 3.7L12 15.1 8.7 17l.8-3.7-2.8-2.5 3.7-.4z" fill="#16346E"/></g>')
    b += hero(cx, hy, badge)
    b += R(cx, 37.0, 'SILVER MEMBER', 0.85, '#FFFFFF', 0.35)
    perks = [('card', '10% OFF', 'EVERY STANDARD / SESSION', True), ('coin', '+10 POINTS', 'FOR EVERY / TK 100 YOU PAY', False),
             ('gift', 'REWARDS', 'LIKE A FREE HOUR / AT THE COUNTER', False), ('crown', 'GOLD AT / 2,000 POINTS', 'BOOK FRI & SAT / 30 DAYS AHEAD', False),
             ('refer', 'REFER A / FRIEND', '20% OFF ONE SLOT / AFTER THEIR 1ST VISIT', False)]
    for i, (ic, t1, t2, hi) in enumerate(perks):
        b += row_card(0.8, 39.2 + i * 6.3, 10.4, 5.5, ic, t1, t2, hi)
    b += side_qr(cx, 71.4)
    b += T(cx, 83.4, '+ THE ARENA', 0.95, fill=LIGHT, tl=7.0)
    for i, ic in enumerate(['vs', 'teams', 'cup']):
        b += icon(ic, cx - 2.6 + i * 2.6, 85.6, 1.6, '#FFFFFF', 1.6)
    b += R(cx, 88.2, 'CHALLENGES · TEAMS · TOURNAMENTS', 0.62, '#C9D6EA', 0.06, tl=9.6)
    b += pill(cx, 90.0, 9.4, 'SIGN UP FREE')
    b += R(cx, 94.4, 'Discount on standard sessions booked', 0.5, '#7C8BA3', 0.02)
    b += R(cx, 95.1, 'from your account. Not with packs & offers.', 0.5, '#7C8BA3', 0.02, tl=9.6)
    b += R(cx, 95.8, 'Points have no cash value.', 0.5, '#7C8BA3', 0.02)
    return frame(W, 'MEMBER PERKS', 'CHAMPION · MEMBERS', b)

def right():
    W, cx = 12.0, 6.0
    b = T(cx, 14.0, 'RISE', 2.6, tl=7.2)
    b += T(cx, 18.4, 'TOGETHER', 1.9, fill='none', tl=10.0, extra=f'stroke="{LIGHT}" stroke-width="0.11"')
    b += chevrons(cx, 21.6, 5.2) + R(cx, 21.92, 'THE ARENA', 0.85, '#FFFFFF', 0.25)
    # hero: community network (players linked around a trophy)
    hy = 30.0
    nodes = [(cx, hy - 2.6), (cx + 2.5, hy - 0.8), (cx + 1.55, hy + 2.2), (cx - 1.55, hy + 2.2), (cx - 2.5, hy - 0.8)]
    net = ''.join(f'<line x1="{a[0]}" y1="{a[1]}" x2="{c[0]}" y2="{c[1]}" stroke="{LIGHT}" stroke-width="0.08" stroke-opacity="0.7"/>'
                  for i, a in enumerate(nodes) for c in nodes[i+1:])
    net += ''.join(f'<circle cx="{x}" cy="{y}" r="0.78" fill="{"#FFFFFF" if i % 2 == 0 else SKY}"/>'
                   f'<circle cx="{x}" cy="{y-0.2}" r="0.27" fill="#0B1E46"/><path d="M{x-0.42} {y+0.5} q0 -0.42 0.42 -0.42 q0.42 0 0.42 0.42" fill="#0B1E46"/>'
                   for i, (x, y) in enumerate(nodes))
    ts = 1.6 / (594 - 245)
    net += f'<g fill="url(#trophyGrad)" transform="translate({cx - 103.5*ts:.4f} {hy-0.85:.4f}) scale({ts:.5f}) translate(-87 -245)">{TROPHY}</g>'
    b += hero(cx, hy, net)
    b += R(cx, 37.0, 'PLAY TOGETHER · RISE TOGETHER', 0.72, '#FFFFFF', 0.12, tl=9.6)
    steps = [('join', 'JOIN / CHAMPION', 'IT TAKES A MINUTE', False), ('at', 'PICK YOUR / @HANDLE', 'FOLLOW PLAYERS / & TEAMS', False),
             ('vs', 'CHALLENGE / & PLAY', 'BOTH CONFIRM / THE SCORE', False), ('cup', 'CLIMB / & WIN', 'TROPHIES / AND GIFTS', True)]
    for i, (ic, t1, t2, hi) in enumerate(steps):
        y = 39.2 + i * 7.35
        b += row_card(0.8, y, 10.4, 5.5, ic, t1, t2, hi)
        b += T(10.75, y + 5.05, f'0{i+1}', 0.62, fill='#9AD0FF' if hi else LIGHT, anchor='end')
        if i < 3:
            b += f'<path d="M{cx} {y+5.75} v1.1 m-0.4 -0.45 l0.4 0.45 l0.4 -0.45" fill="none" stroke="{LIGHT}" stroke-width="0.09" stroke-linecap="round"/>'
    b += side_qr(cx, 71.4)
    b += T(cx, 83.4, '+ MEMBERS', 0.95, fill=LIGHT, tl=6.8)
    b += icon('card', cx - 1.6, 85.6, 1.6, '#FFFFFF', 1.6) + icon('coin', cx + 1.6, 85.6, 1.6, '#FFFFFF', 1.6)
    b += R(cx, 88.2, 'SAVE 10% · EARN POINTS EVERY VISIT', 0.62, '#C9D6EA', 0.06, tl=9.6)
    b += pill(cx, 90.0, 9.4, 'JOIN THE ARENA')
    b += R(cx, 94.4, 'Free with your Champion account.', 0.55, '#7C8BA3', 0.02)
    b += R(cx, 95.2, 'New tournaments are posted', 0.55, '#7C8BA3', 0.02)
    b += R(cx, 96.0, 'in the Arena first.', 0.55, '#7C8BA3', 0.02)
    return frame(W, 'COMMUNITY', 'CHAMPION · COMMUNITY', b)

FACES = [('Front', 20, front), ('Left', 12, left), ('Right', 12, right)]
FONTS = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}'''
for name, W, fn in FACES:
    svg = fn()
    base = f'Champion_12_Arena_{name}_{W}x120in'
    open(os.path.join(HERE, base + '_source.svg'), 'w').write(svg)
    open(os.path.join(HERE, base + '.html'), 'w').write(
        f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}@page{{size:{W}in 120in;margin:0}}'
        f'*{{margin:0;padding:0}}html,body{{width:{W}in;height:120in;overflow:hidden;background:#04070E}}svg{{display:block}}</style></head>'
        f'<body>{svg}</body></html>')
    print('wrote', base)
