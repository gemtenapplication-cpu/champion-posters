#!/usr/bin/env python3
"""Champion — 25s cinematic action promo renderer (1080x1920 @ 30fps).

usage:
  render.py preview t1 t2 ...        -> PNG stills in promo/preview/
  render.py chunk START END OUT.mp4  -> encode frames [START, END) to OUT.mp4
"""
import sys, math, os, subprocess
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = '/tmp/claude-0/-home-user-champion-posters/5a1c628b-cc2b-5aee-8f28-351161cb1e83/scratchpad'
P = S + '/promo'
BRAND = '/home/user/champion-posters/brand/'
UP = '/root/.claude/uploads/5a1c628b-cc2b-5aee-8f28-351161cb1e83/'
FD = S + '/fontpkg/node_modules/@fontsource/'

W, H, FPS = 1080, 1920, 30
DUR = 25.0
NF = int(round(DUR * FPS))
HF = 0.5 / FPS
BEAT0, BEAT = 6.88, 0.4291
def B(k): return BEAT0 + BEAT * k

WHITE = (255, 255, 255)
BLUE = (43, 131, 246)
LBLUE = (77, 163, 255)
DBLUE = (31, 111, 229)

# ---------------------------------------------------------------- easing
def c01(x): return 0.0 if x < 0 else (1.0 if x > 1 else x)
def lin(t, a, b): return c01((t - a) / (b - a)) if b > a else float(t >= a)
def eo3(x): x = c01(x); return 1 - (1 - x) ** 3
def eoexp(x): x = c01(x); return 1.0 if x >= 1 else 1 - 2 ** (-10 * x)
def eob(x, s=1.9): x = c01(x) - 1; return x * x * ((s + 1) * x + s) + 1
def ss(x): x = c01(x); return x * x * (3 - 2 * x)
def decay(t, t0, tau):
    dt = t - (t0 - HF)
    return math.exp(-dt / tau) if dt >= 0 else 0.0
def active(t, a, b): return (a - HF) <= t < (b - HF)

# ---------------------------------------------------------------- sources
NFR = {'v10': len(os.listdir(P + '/src/v10')), 'v11': len(os.listdir(P + '/src/v11'))}

@lru_cache(maxsize=48)
def srcframe(clip, idx):
    idx = max(0, min(NFR[clip] - 1, idx))
    return np.asarray(Image.open(f'{P}/src/{clip}/{idx + 1:04d}.jpg').convert('RGB'), dtype=np.float32) / 255.0

def sample(clip, ts, spd):
    nsub = 1 if spd <= 1.35 else 2
    acc = None
    for j in range(nsub):
        tj = ts + (j / nsub) * spd * (0.45 / FPS)
        fi = tj * 30.0
        i0 = int(math.floor(fi)); w = fi - i0
        f = srcframe(clip, i0) if w < 0.02 else srcframe(clip, i0) * (1 - w) + srcframe(clip, i0 + 1) * w
        acc = f if acc is None else acc + f
    return acc / nsub

def grade(x):
    """Cinematic grade for the LED footage: shift violet-blue toward brand azure, crush blacks."""
    lum = float(x.mean())
    x = x * min(1.6, max(0.85, (0.30 / max(lum, 1e-3)) ** 0.5))
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    y = np.stack([0.84 * r + 0.05 * b, 0.85 * g + 0.25 * b * np.clip(1 - g, 0, 1), 0.93 * b + 0.06 * g], -1)
    y = np.clip((y - 0.06) * 1.18, 0, 1)
    y = y * y * (3 - 2 * y) * 0.55 + y * 0.45
    return y

def to_pil(x): return Image.fromarray((np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8))

def load_img_graded(path, mul, contrast=1.1):
    a = np.asarray(Image.open(path).convert('RGB'), np.float32) / 255.0
    a = a * np.array(mul, np.float32)
    a = np.clip((a - 0.5) * contrast + 0.5, 0, 1)
    return to_pil(a)

IMGS = {}
def img(name):
    if name not in IMGS:
        if name == 'office':
            IMGS[name] = load_img_graded(UP + '5e61bd67-image.png', (0.88, 0.95, 1.08), 1.12)
        elif name == 'sign':
            IMGS[name] = load_img_graded(UP + '9a04f941-image.png', (1.0, 1.0, 1.05), 1.08)
    return IMGS[name]

# ---------------------------------------------------------------- precomputed full-frame maps
YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
_r = np.sqrt(((XX - W / 2) / (W * 0.62)) ** 2 + ((YY - H / 2) / (H * 0.62)) ** 2)
VIGNETTE = (1 - 0.62 * np.clip(_r, 0, 1.4) ** 2.4).clip(0.15, 1)[..., None].astype(np.float32)
_rng = np.random.default_rng(11)
GRAIN = []
for _ in range(6):
    g = _rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32)
    GRAIN.append(np.repeat(np.repeat(g, 2, 0), 2, 1)[..., None])
# readability band behind text cards
def band_mask(cy, hh):
    return np.exp(-((YY[:, :1] - cy) / hh) ** 2).astype(np.float32)[..., None]
BAND = band_mask(1000, 360)
# end card maps
EC_CX, EC_CY = W / 2, 600
_dx, _dy = XX - EC_CX, YY - EC_CY
EC_TH = np.arctan2(_dy, _dx).astype(np.float32)
EC_R = np.sqrt(_dx ** 2 + _dy ** 2).astype(np.float32)
EC_GLOW = (np.exp(-(EC_R / 620) ** 2)[..., None] * np.array([0.03, 0.10, 0.28], np.float32)).astype(np.float32)
EC_FALL = np.exp(-EC_R / 700).astype(np.float32)
del _dx, _dy, _r

# anamorphic streak
_yy = np.arange(-130, 131, dtype=np.float32)
_prof = 1.0 * np.exp(-(_yy / 2.6) ** 2) + 0.35 * np.exp(-(_yy / 16) ** 2) + 0.12 * np.exp(-(_yy / 55) ** 2)
_xx = np.arange(W, dtype=np.float32)
_hz = np.exp(-((_xx - W / 2) / (W * 0.42)) ** 2) * 0.85 + 0.15
STREAK = (_prof[:, None] * _hz[None, :])[..., None] * np.array([0.55, 0.78, 1.0], np.float32)

def add_streak(frame, y, k):
    if k < 0.01: return
    y = int(y); y0, y1 = y - 130, y + 131
    s0 = max(0, -y0); y0c, y1c = max(0, y0), min(H, y1)
    frame[y0c:y1c] += STREAK[s0:s0 + (y1c - y0c)] * k

# embers
_pr = np.random.default_rng(5)
NP = 110
EMB = dict(x=_pr.uniform(0, W, NP), y=_pr.uniform(0, H + 80, NP), vy=_pr.uniform(50, 190, NP),
           sz=_pr.choice([0, 1, 2, 3], NP, p=[0.45, 0.3, 0.17, 0.08]), br=_pr.uniform(0.35, 1.0, NP),
           ph=_pr.uniform(0, 6.283, NP), dr=_pr.uniform(10, 45, NP), white=_pr.random(NP) < 0.3)
SPRITES = []
for sg in (1.4, 2.2, 3.4, 5.0):
    r = int(sg * 4); yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    SPRITES.append(np.exp(-(xx ** 2 + yy ** 2) / (2 * sg * sg)).astype(np.float32)[..., None])

def embers(frame, t, k):
    if k < 0.01: return
    for i in range(NP):
        sp = SPRITES[EMB['sz'][i]]; r = sp.shape[0] // 2
        y = (EMB['y'][i] - EMB['vy'][i] * t) % (H + 80) - 40
        x = EMB['x'][i] + EMB['dr'][i] * math.sin(t * 0.9 + EMB['ph'][i])
        fl = 0.55 + 0.45 * math.sin(t * 6.0 + EMB['ph'][i] * 3)
        col = np.array([0.85, 0.93, 1.0] if EMB['white'][i] else [0.25, 0.58, 1.0], np.float32)
        xi, yi = int(x), int(y)
        x0, y0, x1, y1 = xi - r, yi - r, xi + r + 1, yi + r + 1
        if x1 <= 0 or y1 <= 0 or x0 >= W or y0 >= H: continue
        sx0, sy0 = max(0, -x0), max(0, -y0)
        x0c, y0c, x1c, y1c = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
        frame[y0c:y1c, x0c:x1c] += sp[sy0:sy0 + (y1c - y0c), sx0:sx0 + (x1c - x0c)] * col * (EMB['br'][i] * fl * k * 1.4)

# ---------------------------------------------------------------- layers (text, logos)
class Layer:
    """over: RGBA float (straight alpha), add: RGB float additive glow."""
    def __init__(self, over_pil, add_pil):
        self.over_pil, self.add_pil = over_pil, add_pil
        self.cache = {}
        self.w, self.h = over_pil.size
    def get(self, s):
        key = round(s, 3)
        if key not in self.cache:
            if len(self.cache) > 6: self.cache.clear()
            if abs(key - 1) < 1e-3:
                o, a = self.over_pil, self.add_pil
            else:
                sz = (max(1, int(self.w * key)), max(1, int(self.h * key)))
                o, a = self.over_pil.resize(sz, Image.BILINEAR), self.add_pil.resize(sz, Image.BILINEAR)
            self.cache[key] = (np.asarray(o, np.float32) / 255.0, np.asarray(a, np.float32) / 255.0)
        return self.cache[key]

def glow_from_mask(mask, color, r, k):
    m1 = np.asarray(mask.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255.0
    m2 = np.asarray(mask.filter(ImageFilter.GaussianBlur(r * 3.2)), np.float32) / 255.0
    g = np.clip(m1 * 0.9 + m2 * 0.75, 0, 1) * k
    return to_pil(g[..., None] * np.array(color, np.float32) / 255.0)

def font(fam, wt, size):
    return ImageFont.truetype(f'{FD}{fam}/files/{fam}-latin-{wt}-normal.woff', int(size))

def text_mask(text, fam, wt, size, track=0.0, pad=60):
    f = font(fam, wt, size)
    tr = track * size
    ws = [f.getlength(c) for c in text]
    tw = sum(ws) + tr * (len(text) - 1)
    asc, desc = f.getmetrics()
    m = Image.new('L', (int(math.ceil(tw)) + 2 * pad, asc + desc + 2 * pad), 0)
    d = ImageDraw.Draw(m)
    if tr == 0:
        d.text((pad, pad), text, font=f, fill=255)
    else:
        x = pad
        for c, w in zip(text, ws):
            d.text((x, pad), c, font=f, fill=255); x += w + tr
    bb = m.getbbox()
    return m.crop((bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad))

def text_layer(text, fam='orbitron', wt=900, size=120, fill=WHITE, track=0.0, glow=BLUE, glow_r=14, glow_k=0.9):
    m = text_mask(text, fam, wt, size, track, pad=int(glow_r * 4) + 6)
    over = Image.new('RGBA', m.size, fill + (0,)); over.putalpha(m)
    return Layer(over, glow_from_mask(m, glow, glow_r, glow_k))

def fit_size(text, fam, wt, maxw, maxsize, track=0.0):
    s = maxsize
    while s > 20:
        f = font(fam, wt, s)
        w = sum(f.getlength(c) for c in text) + track * s * (len(text) - 1)
        if w <= maxw: return s
        s -= 2
    return s

def logo_layer(path, width, glow_r=18, glow_k=0.85, glow=BLUE):
    im = Image.open(path).convert('RGBA')
    im = im.crop(im.getbbox())
    h = int(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    pad = int(glow_r * 4)
    canvas = Image.new('RGBA', (width + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad), im)
    return Layer(canvas, glow_from_mask(canvas.split()[3], glow, glow_r, glow_k))

def pill_layer(text, fam='orbitron', wt=800, size=40, track=0.25, padx=46, pady=24, border=BLUE, fillc=(43, 131, 246, 60), txt=WHITE, glow_r=12):
    tm = text_mask(text, fam, wt, size, track, pad=0)
    tw, th = tm.size
    gpad = glow_r * 4
    w, h = tw + 2 * padx, th + 2 * pady
    over = Image.new('RGBA', (w + 2 * gpad, h + 2 * gpad), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    d.rounded_rectangle((gpad, gpad, gpad + w, gpad + h), radius=h // 2, fill=fillc, outline=border + (255,), width=4)
    txtl = Image.new('RGBA', tm.size, txt + (0,)); txtl.putalpha(tm)
    over.alpha_composite(txtl, (gpad + padx, gpad + pady))
    edge = Image.new('L', over.size, 0)
    ImageDraw.Draw(edge).rounded_rectangle((gpad, gpad, gpad + w, gpad + h), radius=h // 2, outline=255, width=6)
    return Layer(over, glow_from_mask(edge, border, glow_r, 0.9))

def line_layer(w, h=4, color=BLUE):
    over = Image.new('RGBA', (w + 40, h + 40), (0, 0, 0, 0))
    ImageDraw.Draw(over).rectangle((20, 20, 20 + w, 20 + h), fill=color + (255,))
    return Layer(over, glow_from_mask(over.split()[3], color, 6, 0.8))

def glitch_arrays(o, a, amt, seed):
    if amt < 0.02: return o, a
    rng = np.random.default_rng(seed)
    o = o.copy(); a = a.copy()
    h = o.shape[0]; y = 0
    while y < h:
        bh = int(rng.integers(4, max(6, h // 6)))
        if rng.random() < 0.55:
            dx = int(rng.normal(0, 1) * 60 * amt)
            o[y:y + bh] = np.roll(o[y:y + bh], dx, axis=1)
            a[y:y + bh] = np.roll(a[y:y + bh], dx, axis=1)
        y += bh
    sh = int(10 * amt) + 1
    o[..., 0] = np.roll(o[..., 0], -sh, axis=1)
    o[..., 2] = np.roll(o[..., 2], sh, axis=1)
    return o, a

def comp(frame, layer, cx, cy, o=1.0, s=1.0, glow_k=1.0, glitch=0.0, seed=0, sweep=None):
    if o < 0.004 or s < 0.01: return
    ov, ad = layer.get(s)
    if glitch > 0.02: ov, ad = glitch_arrays(ov, ad, glitch, seed)
    h, w = ov.shape[:2]
    x0, y0 = int(round(cx - w / 2)), int(round(cy - h / 2))
    x0c, y0c, x1c, y1c = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if x1c <= x0c or y1c <= y0c: return
    sl = (slice(y0c - y0, y1c - y0), slice(x0c - x0, x1c - x0))
    ovs, ads = ov[sl], ad[sl]
    al = ovs[..., 3:4] * o
    reg = frame[y0c:y1c, x0c:x1c]
    reg += ads * (o * glow_k)
    reg *= (1 - al)
    reg += ovs[..., :3] * al
    reg += ads * (o * glow_k * 0.4)
    if sweep is not None:
        hh, ww = ovs.shape[:2]
        xs = (np.arange(ww, dtype=np.float32) + (x0c - x0)) / w
        ys = (np.arange(hh, dtype=np.float32) + (y0c - y0)) / max(h, 1)
        d = xs[None, :] - sweep + (ys[:, None] - 0.5) * 0.35 * (h / w)
        band = np.exp(-(d / 0.045) ** 2)[..., None]
        reg += band * al * np.array([0.9, 0.95, 1.0], np.float32) * 0.85

# ---------------------------------------------------------------- build static layers
L = {}
def build_layers():
    L['welcome'] = text_layer('WELCOME TO', 'orbitron', 700, 64, track=0.42, glow_r=14, glow_k=0.8)
    L['trophy'] = logo_layer(BRAND + 'trophy-gradient.png', 300, glow_r=26, glow_k=0.95)
    L['wordmark'] = logo_layer(BRAND + 'wordmark-white-gradient-trophy.png', 900, glow_r=16, glow_k=0.7)
    L['zone'] = text_layer('GAMING ZONE  ·  CUMILLA', 'rajdhani', 700, 44, fill=(205, 228, 255), track=0.32, glow=BLUE, glow_r=10, glow_k=0.6)
    L['wait1'] = text_layer('THE WAIT IS', 'orbitron', 800, 84, track=0.06, glow_r=16)
    L['wait2'] = text_layer('ALMOST OVER', 'orbitron', 900, fit_size('ALMOST OVER', 'orbitron', 900, 940, 120, 0.04), track=0.04, glow_r=18)
    # montage cards
    cards = []
    def card(a, b, kicker=None, big=(), sub=(), url=None, cy=1000):
        c = dict(a=a, b=b, items=[])
        bsz = min(fit_size(x, 'orbitron', 900, 940, 175, 0.02) for x in big)
        blocks = []
        if kicker:
            blocks.append(('kicker', text_layer(kicker, 'rajdhani', 700, 48, fill=LBLUE, track=0.38, glow=BLUE, glow_r=9, glow_k=0.6), 18))
        for x in big:
            blocks.append(('big', text_layer(x, 'orbitron', 900, bsz, track=0.02, glow_r=18, glow_k=0.95), 8))
        for x in sub:
            ssz = fit_size(x, 'rajdhani', 700, 940, 54, 0.12)
            blocks.append(('sub', text_layer(x, 'rajdhani', 700, ssz, fill=(225, 238, 255), track=0.12, glow=BLUE, glow_r=8, glow_k=0.45), 4))
        if url:
            blocks.append(('url', pill_layer(url, 'rajdhani', 700, 52, track=0.04, padx=40, pady=18, fillc=(10, 22, 48, 200)), 0))
        # vertical layout: use ink heights (layer heights minus glow pads)
        def ink_h(kind, lay):
            pad = {'kicker': 9, 'big': 18, 'sub': 8, 'url': 12}[kind] * 4 + 6
            return lay.h - 2 * (pad if kind != 'url' else 48)
        gaps = {'kicker': 26, 'big': 18, 'sub': 14, 'url': 0}
        hs = [ink_h(k, l) for k, l, _ in blocks]
        total = sum(hs) + sum(gaps[k] for k, _, _ in blocks[:-1]) + (20 if url else 0)
        y = cy - total / 2
        for (kind, lay, _), hgt in zip(blocks, hs):
            if kind == 'url': y += 20
            c['items'].append(dict(kind=kind, layer=lay, cy=y + hgt / 2))
            y += hgt + gaps[kind]
        cards.append(c)
    card(B(0), B(4), kicker="CUMILLA'S NEW", big=('GAMING', 'ARENA'))
    card(B(4), B(8), big=('2 PS5',), sub=('STATIONS ON 55-INCH SCREENS',))
    card(B(8), B(12), kicker='PLUS', big=('GAMING PC',), sub=('ON A 30-INCH MONITOR',))
    card(B(14), B(18), kicker='FIND US', big=('4TH FLOOR',), sub=('IFIC BANK BUILDING', 'RANIR BAZAR, CUMILLA'))
    card(B(18), B(22), kicker='BOOK YOUR SLOT', big=('ONLINE',), url='champion.gemten.com.bd')
    L['cards'] = cards
    L['kline'] = line_layer(70, 4, BLUE)
    for wd in ('PLAY', 'CONNECT', 'WIN'):
        L['tag_' + wd] = text_layer(wd, 'orbitron', 900, fit_size(wd, 'orbitron', 900, 960, 250, 0.03), track=0.03, glow_r=24, glow_k=1.0)
    L['plus'] = text_layer('+', 'orbitron', 900, 90, fill=LBLUE, glow_r=12)
    # end card
    L['e_trophy'] = logo_layer(BRAND + 'trophy-gradient.png', 330, glow_r=30, glow_k=1.0)
    L['e_lockup'] = logo_layer(BRAND + 'logo-white-gradient-trophy.png', 900, glow_r=14, glow_k=0.55)
    L['e_soon'] = pill_layer('OPENING SOON', 'orbitron', 800, 40, track=0.25)
    L['e_loc1'] = text_layer('IFIC BANK BUILDING (4TH FLOOR)', 'rajdhani', 700, 46, fill=(232, 242, 255), track=0.08, glow_r=8, glow_k=0.4)
    L['e_loc2'] = text_layer('RANIR BAZAR, CUMILLA', 'rajdhani', 700, 46, fill=(232, 242, 255), track=0.08, glow_r=8, glow_k=0.4)
    L['e_book'] = text_layer('BOOK ONLINE', 'rajdhani', 700, 38, fill=LBLUE, track=0.4, glow_r=8, glow_k=0.5)
    L['e_url'] = text_layer('champion.gemten.com.bd', 'rajdhani', 700, 60, fill=WHITE, track=0.03, glow_r=12, glow_k=0.7)

# ---------------------------------------------------------------- timeline
def V(**k):
    d = dict(z0=1.08, z1=1.16, dark=1.0, blur=0); d.update(k); return d
SHOTS = [
    V(a=0.0, b=3.0, src='v11', ss=7.2, spd=0.55, z0=1.10, z1=1.22),
    V(a=3.0, b=4.6, src='v10', ss=4.4, spd=0.5, z0=1.12, z1=1.24, dark=0.42, blur=2.2),
    dict(a=4.6, b=5.10, src='sign', bh=780, cx0=1380, cy0=622, cx1=1700, cy1=622, z0=1.0, z1=1.04, dark=0.85, blur=0),
    V(a=5.10, b=5.53, src='v11', ss=13.6, spd=1.0, dark=0.62),
    V(a=5.53, b=5.90, src='v11', ss=30.0, spd=1.5, dark=0.5),
    V(a=5.90, b=6.20, src='v10', ss=12.6, spd=1.5, dark=0.55),
    V(a=6.20, b=6.45, src='v11', ss=15.5, spd=2.0, dark=0.6),
    V(a=6.45, b=6.63, src='v10', ss=2.6, spd=2.0, dark=0.6),
    V(a=6.63, b=B(0), src='v11', ss=11.0, spd=2.0, dark=0.6),
    dict(a=B(0), b=B(4), src='office', bh=1086, cx0=1105, cy0=543, cx1=1170, cy1=470, z0=1.0, z1=1.2, dark=0.92, blur=0),
    V(a=B(4), b=B(6), src='v10', ss=2.0, spd=1.0),
    V(a=B(6), b=B(8), src='v11', ss=38.5, spd=1.0),
    V(a=B(8), b=B(10), src='v11', ss=28.4, spd=1.0),
    V(a=B(10), b=B(12), src='v10', ss=0.0, spd=1.0),
    V(a=B(12), b=B(12.5), src='v11', ss=15.0, spd=1.5, z0=1.2, z1=1.12),
    V(a=B(12.5), b=B(13), src='v11', ss=11.0, spd=1.5, z0=1.2, z1=1.12),
    V(a=B(13), b=B(13.5), src='v10', ss=12.0, spd=1.5, z0=1.2, z1=1.12),
    V(a=B(13.5), b=B(14), src='v11', ss=26.0, spd=1.5, z0=1.2, z1=1.12),
    V(a=B(14), b=B(16), src='v11', ss=25.6, spd=0.8),
    V(a=B(16), b=B(18), src='v11', ss=0.0, spd=1.0),
    V(a=B(18), b=B(20), src='v10', ss=10.2, spd=1.0),
    V(a=B(20), b=B(22), src='v11', ss=14.3, spd=1.0),
    V(a=B(22), b=B(25), src='v10', ss=1.6, spd=1.1, z0=1.25, z1=1.1),
    V(a=B(25), b=B(28), src='v11', ss=21.0, spd=1.2, z0=1.25, z1=1.1),
    V(a=B(28), b=B(30), src='v11', ss=36.9, spd=1.0, z0=1.25, z1=1.12),
    dict(a=B(30), b=DUR + 1, src='end'),
]

# impacts: (time, flash, shake_px, chroma_px, zoom_punch)
IMPACTS = [(3.0, 0.9, 24, 10, 0.10), (4.6, 0.35, 12, 14, 0.06)]
for tc in (5.10, 5.53, 5.90, 6.20, 6.45, 6.63):
    IMPACTS.append((tc, 0.22, 7, 5, 0.06))
IMPACTS.append((B(0), 1.0, 28, 12, 0.14))
for k in (4, 6, 8, 10, 14, 16, 18, 20):
    IMPACTS.append((B(k), 0.38, 12, 6, 0.08))
for k in (12, 12.5, 13, 13.5):
    IMPACTS.append((B(k), 0.32, 14, 8, 0.09))
for k in (22, 25, 28):
    IMPACTS.append((B(k), 0.75, 22, 11, 0.12))
IMPACTS.append((B(30), 1.0, 30, 14, 0.10))
IMPACTS += [(B(31), 0.18, 6, 3, 0.02), (B(32), 0.15, 5, 3, 0.02)]
_cuts = {round(x[0], 3) for x in IMPACTS}
for k in range(0, 30):
    if round(B(k), 3) not in _cuts and k not in (12, 13):
        IMPACTS.append((B(k), 0.07, 4, 2, 0.025))

def fx(t):
    fl = sh = ch = pu = 0.0
    for (ti, f, s, c, p) in IMPACTS:
        if t < ti - HF or t > ti + 1.5: continue
        fl += f * decay(t, ti, 0.085)
        sh += s * decay(t, ti, 0.2)
        ch += c * decay(t, ti, 0.11)
        pu += p * decay(t, ti, 0.16)
    return min(fl, 1.0), sh, ch, pu

def shake_xy(t, amp):
    return (amp * (0.6 * math.sin(t * 53 + 1.3) + 0.4 * math.sin(t * 91 + 0.4)),
            amp * (0.6 * math.sin(t * 47 + 2.1) + 0.4 * math.sin(t * 83 + 3.3)))

# ---------------------------------------------------------------- background
def render_shot(shot, t, shx, shy, punch):
    u = lin(t, shot['a'], shot['b'])
    src = shot['src']
    if src in ('v10', 'v11'):
        ts = shot['ss'] + (t - shot['a']) * shot['spd']
        x = grade(sample(src, ts, shot['spd']))
        im = to_pil(x)
        if shot['blur']: im = im.filter(ImageFilter.GaussianBlur(shot['blur']))
        else: im = im.filter(ImageFilter.UnsharpMask(radius=6, percent=55, threshold=1))
        sw, sh_ = im.size
        bh0 = sh_; cx, cy = sw / 2, sh_ / 2
    else:
        im = img(src); sw, sh_ = im.size
        bh0 = shot['bh']
        cx = shot['cx0'] + (shot['cx1'] - shot['cx0']) * ss(u)
        cy = shot['cy0'] + (shot['cy1'] - shot['cy0']) * ss(u)
    z = (shot['z0'] + (shot['z1'] - shot['z0']) * u) * (1 + punch)
    bh = bh0 / z; bw = bh * W / H
    cx += shx * bh / H; cy += shy * bh / H
    cx = min(max(cx, bw / 2), sw - bw / 2); cy = min(max(cy, bh / 2), sh_ - bh / 2)
    out = im.resize((W, H), Image.LANCZOS, box=(cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2))
    if src in ('v10', 'v11') and not shot['blur']:
        out = out.filter(ImageFilter.UnsharpMask(radius=2.0, percent=95, threshold=2))
    return np.asarray(out, np.float32) * (shot['dark'] / 255.0)

def intro_flicker(t):
    if t < 0.55: return 0.0
    for a, b, v in ((0.58, 0.66, 0.4), (0.70, 0.73, 0.18), (1.04, 1.13, 0.65), (1.20, 1.23, 0.25)):
        if a <= t < b: return v
    if t < 1.28: return 0.03
    return 1.0

def end_bg(t):
    te = t - B(30)
    x = grade(sample('v10', 1.6 + te * 0.35, 0.35))
    im = to_pil(x).filter(ImageFilter.GaussianBlur(5))
    out = np.asarray(im.resize((W, H), Image.BILINEAR, box=(40, 70, 440, 781)), np.float32) / 255.0
    out *= 0.20
    out += EC_GLOW * (0.8 + 0.2 * math.sin(te * 2.2))
    k = 0.11 * eo3(lin(te, 0.0, 0.6))
    rays = (0.5 + 0.5 * np.cos(EC_TH * 16 + te * 0.35)) ** 8 * EC_FALL
    rays2 = (0.5 + 0.5 * np.cos(EC_TH * 9 - te * 0.22 + 1.0)) ** 10 * EC_FALL
    out += ((rays + 0.7 * rays2) * k)[..., None] * np.array([0.35, 0.65, 1.0], np.float32)
    return out

# ---------------------------------------------------------------- main frame
def render(i):
    t = i / FPS
    flash, shake, chroma, punch = fx(t)
    shx, shy = shake_xy(t, shake)
    shot = next(s for s in SHOTS if active(t, s['a'], s['b']))
    # ---- background
    if shot['src'] == 'end':
        frame = end_bg(t)
    else:
        frame = render_shot(shot, t, shx, shy, punch)
        if shot is SHOTS[0]:
            frame *= intro_flicker(t) * (0.72 - 0.30 * eo3(lin(t, 1.3, 2.4)))
        frame *= VIGNETTE
    # ---- overlays
    ox, oy = shx * 0.6, shy * 0.6
    # INTRO: WELCOME TO + logo slam
    if t < 4.6 - HF:
        if t >= 1.45:
            o = eo3(lin(t, 1.45, 1.85))
            fl = 1.0 if t > 1.9 else (0.55 + 0.45 * math.sin(t * 90))
            yy = 960 - 400 * eoexp(lin(t, 3.0, 3.25))
            s = 1.10 - 0.10 * eo3(lin(t, 1.45, 3.0))
            g = 0.6 * decay(t, 1.45, 0.25) + (0.8 * lin(t, 4.42, 4.6))
            comp(frame, L['welcome'], W / 2 + ox, yy + oy, o * fl, s, glitch=g, seed=i)
        if t >= 3.0 - HF:
            u = lin(t, 3.0 - HF, 3.16)
            s = 1.75 - 0.75 * eo3(u)
            g = 0.9 * decay(t, 3.0, 0.08) + (1.0 * lin(t, 4.42, 4.6))
            sweep = -0.2 + 1.5 * lin(t, 3.45, 4.15)
            comp(frame, L['trophy'], W / 2 + ox, 860 + oy, min(1, u * 4), s, glow_k=1.0 + 0.6 * decay(t, 3.0, 0.4), glitch=g, seed=i + 3)
            s2 = 1.45 - 0.45 * eo3(lin(t, 3.03, 3.2))
            comp(frame, L['wordmark'], W / 2 + ox, 1150 + oy, min(1, lin(t, 3.02, 3.08)), s2, glitch=g, seed=i + 5, sweep=sweep)
            o3 = eo3(lin(t, 3.4, 3.8))
            comp(frame, L['zone'], W / 2 + ox, 1258 + oy + 20 * (1 - o3), o3, glitch=g, seed=i + 7)
            add_streak(frame, 1150 + oy, 1.1 * decay(t, 3.0, 0.35))
            embers(frame, t, 0.8 * lin(t, 3.0, 3.4))
    # TENSION text
    if active(t, 5.10, 6.77):
        o = eo3(lin(t, 5.10, 5.3)) * (1 - lin(t, 6.66, 6.77))
        flk = 0.35 if (5.30 < t < 5.36 or 5.95 < t < 5.99) else 1.0
        frame *= 1 - 0.35 * BAND * o
        comp(frame, L['wait1'], W / 2 + ox, 905 + oy, o * flk, 1.06 - 0.06 * eo3(lin(t, 5.1, 6.7)), glitch=0.7 * decay(t, 5.1, 0.12), seed=i)
        o2 = eo3(lin(t, 5.53, 5.75)) * (1 - lin(t, 6.66, 6.77))
        comp(frame, L['wait2'], W / 2 + ox, 1035 + oy, o2 * flk, 1.12 - 0.12 * eoexp(lin(t, 5.53, 5.8)), glitch=0.8 * decay(t, 5.53, 0.12), seed=i + 1)
    # build to white before drop
    if active(t, 6.70, B(0)):
        frame += (1 - frame) * (0.85 * lin(t, 6.70, B(0)) ** 2)
    # MONTAGE cards
    for c in L['cards']:
        if not active(t, c['a'], c['b']): continue
        out = lin(t, c['b'] - 0.12, c['b'] - HF)
        bo = eo3(lin(t, c['a'], c['a'] + 0.15)) * (1 - out)
        frame *= 1 - 0.42 * BAND * bo
        for j, it in enumerate(c['items']):
            kind, lay = it['kind'], it['layer']
            if kind == 'big':
                d0 = c['a'] + 0.03 * j
                u = lin(t, d0, d0 + 0.22)
                s = (1.28 - 0.28 * eoexp(u)) * (1 + 0.04 * out)
                o = min(1, lin(t, d0, d0 + 0.07)) * (1 - out)
                comp(frame, lay, W / 2 + ox, it['cy'] + oy, o, s, glow_k=1 + 0.8 * decay(t, d0, 0.2), glitch=0.9 * decay(t, d0, 0.1), seed=i + j)
            elif kind == 'kicker':
                d0 = c['a'] + 0.06
                u = eo3(lin(t, d0, d0 + 0.3)); o = u * (1 - out)
                comp(frame, lay, W / 2 - 50 * (1 - u) + ox, it['cy'] + oy, o)
                lw = lay.w - 2 * (9 * 4 + 6)
                comp(frame, L['kline'], W / 2 - lw / 2 - 70 + ox - 30 * (1 - u), it['cy'] + oy, o)
                comp(frame, L['kline'], W / 2 + lw / 2 + 70 + ox + 30 * (1 - u), it['cy'] + oy, o)
            elif kind == 'sub':
                d0 = c['a'] + 0.14 + 0.06 * j
                u = eo3(lin(t, d0, d0 + 0.3)); o = u * (1 - out)
                comp(frame, lay, W / 2 + ox, it['cy'] + 28 * (1 - u) + oy, o)
            elif kind == 'url':
                d0 = c['a'] + 0.22
                u = lin(t, d0, d0 + 0.32); o = min(1, u * 3) * (1 - out)
                comp(frame, lay, W / 2 + ox, it['cy'] + oy, o, 0.7 + 0.3 * eob(u), sweep=-0.3 + 1.6 * lin(t, d0 + 0.4, d0 + 1.1))
        if c['a'] == B(0):
            add_streak(frame, 1000 + oy, 0.9 * decay(t, B(0), 0.3))
    # TAGLINE
    for wd, a, b in (('PLAY', B(22), B(25)), ('CONNECT', B(25), B(28)), ('WIN', B(28), B(30))):
        if not active(t, a, b): continue
        out = lin(t, b - 0.1, b - HF)
        u = lin(t, a, a + 0.2)
        s = (1.45 - 0.45 * eoexp(u)) * (1 + 0.05 * lin(t, a + 0.2, b))
        o = min(1, lin(t, a, a + 0.06)) * (1 - out)
        frame *= 1 - 0.4 * BAND * o
        comp(frame, L['tag_' + wd], W / 2 + ox, 1000 + oy, o, s, glow_k=1 + 1.2 * decay(t, a, 0.25), glitch=0.9 * decay(t, a, 0.1), seed=i)
        add_streak(frame, 1000 + oy, 0.8 * decay(t, a, 0.3))
    # END CARD
    if t >= B(30) - HF:
        te = t - B(30)
        u = lin(te, -HF, 0.17)
        st = 1.7 - 0.7 * eo3(u)
        comp(frame, L['e_trophy'], W / 2 + ox, 598 + oy, min(1, u * 5), st, glow_k=1.0 + 0.9 * decay(t, B(30), 0.5) + 0.12 * math.sin(te * 3),
             glitch=0.8 * decay(t, B(30), 0.09), seed=i, sweep=-0.3 + 1.6 * lin(te, 1.9, 2.6))
        a1 = B(31) - B(30)
        u1 = lin(te, a1, a1 + 0.35)
        comp(frame, L['e_lockup'], W / 2 + ox, 965 + oy + 30 * (1 - eo3(u1)), eo3(u1), 1.08 - 0.08 * eo3(u1),
             sweep=-0.25 + 1.5 * lin(te, 2.1, 3.0))
        a2 = B(32) - B(30)
        u2 = lin(te, a2, a2 + 0.32)
        comp(frame, L['e_soon'], W / 2 + ox, 1112 + oy, min(1, u2 * 3), 0.6 + 0.4 * eob(u2), glow_k=0.8 + 0.25 * math.sin(te * 4))
        for nm, yy, d0 in (('e_loc1', 1212, 1.15), ('e_loc2', 1264, 1.25), ('e_book', 1352, 1.5), ('e_url', 1408, 1.6)):
            uu = eo3(lin(te, d0, d0 + 0.4))
            comp(frame, L[nm], W / 2 + ox, yy + oy + 22 * (1 - uu), uu)
        add_streak(frame, 600 + oy, 1.2 * decay(t, B(30), 0.45))
        embers(frame, t, 0.9 * lin(te, 0, 0.5))
        frame *= VIGNETTE * 0.35 + 0.65
    # ---- finishing
    if flash > 0.005:
        frame += (1 - np.clip(frame, 0, 1)) * flash
    c = int(round(chroma))
    if c >= 1:
        r = frame[..., 0].copy(); b = frame[..., 2].copy()
        frame[:, c:, 0] = r[:, :-c]; frame[:, :-c, 2] = b[:, c:]
    frame += GRAIN[i % 6] * 0.028
    if t > 24.5:
        frame *= 1 - ss(lin(t, 24.5, 24.97))
    if t < 0.3:
        frame *= 0.0
    return np.clip(frame, 0, 1)

def to_u8(frame): return (frame * 255 + 0.5).astype(np.uint8)

if __name__ == '__main__':
    build_layers()
    mode = sys.argv[1]
    if mode == 'preview':
        os.makedirs(P + '/preview', exist_ok=True)
        for ts_ in sys.argv[2:]:
            i = int(round(float(ts_) * FPS))
            Image.fromarray(to_u8(render(i))).save(f'{P}/preview/f_{float(ts_):05.2f}.jpg', quality=88)
            print('saved', ts_)
    elif mode == 'chunk':
        a, b, out = int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                                '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p',
                                '-x264-params', 'keyint=60', out], stdin=subprocess.PIPE)
        for i in range(a, b):
            enc.stdin.write(to_u8(render(i)).tobytes())
            if (i - a) % 50 == 0: print(f'[{a}-{b}] frame {i}', flush=True)
        enc.stdin.close(); enc.wait()
        print('done', out)
