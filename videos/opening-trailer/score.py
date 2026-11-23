"""Original cinematic score for the opening trailer: hybrid orchestral, synthesised with numpy (no third-party audio).

D minor, Dm - Bb - F - C, 120 bpm on a steady grid in REAL time, with sections and hits placed on the voice-over:
  intro     dark string pad, bell motif, sub swells
  trophy    strings + choir swell, brass braam
  action    staccato string ostinato, taiko pattern, snare fills, impacts on every cut
  location  ostinato + rising arpeggio
  squad     full drums, ostinato up an octave, snare roll build
  tension   drop out: heartbeat, high string tremolo on A, riser + reverse swell
  logo      huge hit, triumphant D major chord: brass, choir, strings, bells
  date      drums return, ostinato, clock ticks
  end       Bb - C - D major lift, final hit on the last line, ring out
Everything goes through a hall reverb; the music ducks under the voice.
Usage: python3 score.py <build dir>   (reads timings.json; design times are mapped to real time with its warp)
Writes <build>/score.wav and <build>/mix.wav (stereo 48 kHz)."""
import json, os, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else 'build')
SR = 48000
tm = json.load(open(os.path.join(B, 'timings.json')))
V = tm.get('design', tm['vo']); RV = tm['vo']; TOTAL = tm['total']
WR, WD = (np.array(a) for a in zip(*tm.get('warp', [[0, 0], [TOTAL, TOTAL]])))
def Wt(td): return float(np.interp(td, WD, WR))       # design time -> real time
N = int(TOTAL * SR)
rng = np.random.default_rng(11)
BUS = {k: np.zeros((N, 2)) for k in ('music', 'drums', 'fx')}

def lp(x, f, o=4): return sosfilt(butter(o, min(f, SR / 2 - 100), 'low', fs=SR, output='sos'), x)
def hp(x, f, o=4): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, f1, f2, o=2): return sosfilt(butter(o, [f1, min(f2, SR / 2 - 100)], 'band', fs=SR, output='sos'), x)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def env(n, a, d=None, r=0.05, sus=1.0):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4))
    if d: e = e * (sus + (1 - sus) * np.exp(-np.maximum(0, t - a) / d))
    rel = int(r * SR)
    if rel and rel < n: e[-rel:] *= np.linspace(1, 0, rel)
    return e
def put(bus, x, t_real, gain=1.0, pan=0.0):
    i = int(t_real * SR)
    if i >= N or len(x) == 0: return
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), N - i)
    if x.ndim == 1:
        BUS[bus][i:i + n, 0] += x[:n] * gain * np.sqrt(1 - pan)
        BUS[bus][i:i + n, 1] += x[:n] * gain * np.sqrt(1 + pan)
    else:
        BUS[bus][i:i + n] += x[:n] * gain

# ---------------------------------------------------------------- instruments
def saw(f, n, det=0.0):
    t = np.arange(n) / SR; ph = (f * (1 + det)) * t + rng.random()
    return 2 * (ph % 1) - 1
def strings(notes, dur, att=0.6, rel=1.2, bright=1800, vib=True):
    n = int((dur + rel) * SR); t = np.arange(n) / SR; out = np.zeros((n, 2))
    for m in notes:
        for k, det in enumerate((-0.006, -0.002, 0.002, 0.006, 0.0)):
            f = hz(m) * (1 + (0.003 * np.sin(2 * np.pi * 5.2 * t + k) if vib else 0))
            ph = np.cumsum(f * (1 + det)) / SR + rng.random()
            w = 2 * (ph % 1) - 1
            pan = (k - 2) / 2.5
            out[:, 0] += w * np.sqrt(1 - pan * .6); out[:, 1] += w * np.sqrt(1 + pan * .6)
    out = np.stack([lp(out[:, 0], bright, 2), lp(out[:, 1], bright, 2)], 1)
    e = env(n, att, r=rel)
    return out * e[:, None] / (len(notes) * 5) * 1.6
def choir(notes, dur, att=0.9, rel=1.5):
    n = int((dur + rel) * SR); t = np.arange(n) / SR; src = np.zeros(n)
    for m in notes:
        for det in (-0.004, 0.0, 0.004):
            f = hz(m) * (1 + det) * (1 + 0.004 * np.sin(2 * np.pi * 4.8 * t + rng.random() * 6))
            src += 2 * ((np.cumsum(f) / SR + rng.random()) % 1) - 1
    v = bp(src, 650, 950) * 1.0 + bp(src, 1000, 1300) * 0.7 + bp(src, 2600, 3200) * 0.35   # "aah" formants
    v = v * env(n, att, r=rel) / (len(notes) * 3)
    return np.stack([v * 0.9, v], 1) * 2.2
def stacc(m, length=0.11, bright=3000):
    n = int(0.25 * SR); t = np.arange(n) / SR
    w = sum(2 * ((hz(m) * (1 + d) * t + rng.random()) % 1) - 1 for d in (-0.004, 0.0, 0.004)) / 3
    w = lp(w, bright, 2) * np.exp(-t / length) * np.minimum(1, t / 0.004)
    return w
def bell(m, length=3.0):
    n = int(length * SR); t = np.arange(n) / SR; f = hz(m)
    x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 2)
         + 0.3 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 4) + 0.25 * np.sin(2 * np.pi * f * 2 * t))
    return x * np.exp(-t * 1.3) * np.minimum(1, t / 0.002) * 0.35
def brass(notes, dur, strength=1.0):
    n = int((dur + 0.8) * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for det in (-0.003, 0.0, 0.003):
            x += 2 * ((hz(m) * (1 + det) * t + rng.random()) % 1) - 1
    cut = 400 + 2600 * np.exp(-t * 1.2) * np.minimum(1, t / 0.08)
    out = np.zeros(n); blk = 2400
    for s in range(0, n, blk): out[s:s + blk] = lp(x[s:s + blk], float(cut[s]), 2)
    return np.tanh(out * env(n, 0.04, r=0.8) / len(notes) * 0.9) * strength
def taiko(strength=1.0, low=True):
    n = int(1.2 * SR); t = np.arange(n) / SR
    f0 = 58 if low else 92
    body = np.sin(2 * np.pi * np.cumsum(f0 + 70 * np.exp(-t * 28)) / SR) * np.exp(-t * (4.5 if low else 7))
    skin = bp(rng.standard_normal(n), 150, 900) * np.exp(-t * 30) * 0.7
    return np.tanh((body * 1.3 + skin) * 1.4) * strength
def snare(strength=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    return (bp(rng.standard_normal(n), 1200, 7000) * np.exp(-t * 18) * 0.8 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.5) * strength
def impact(strength=1.0, length=2.4):
    n = int(length * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(30 + 75 * np.exp(-t * 9)) / SR) * np.exp(-t * 2)
    noise = lp(rng.standard_normal(n), 2200) * np.exp(-t * 12) * 0.8
    crack = hp(rng.standard_normal(n), 3500) * np.exp(-t * 35) * 0.35
    return np.tanh((sub * 1.5 + noise + crack) * 1.5) * strength
def cymbal_swell(length):
    n = int(length * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 5000) * (t / length) ** 3 * 0.5
def crash(length=3.0):
    n = int(length * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 3500) * np.exp(-t * 1.6) * 0.45
def riser(length):
    n = int(length * SR); t = np.arange(n) / SR; p = t / length
    tone = np.sin(2 * np.pi * np.cumsum(110 + 1200 * p ** 2.2) / SR) * 0.3
    x = rng.standard_normal(n); out = np.zeros(n); blk = 2400
    for s in range(0, n, blk):
        fc = 400 + 8000 * (s / n) ** 2; out[s:s + blk] = bp(x[s:s + blk], fc * 0.5, fc * 1.6)
    return (tone + out * 0.7) * p ** 2.4
def heartbeat():
    n = int(0.9 * SR); x = np.zeros(n)
    for d, g in [(0.0, 1.0), (0.26, 0.7)]:
        i = int(d * SR); tt = np.arange(n - i) / SR
        x[i:] += np.sin(2 * np.pi * (48 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 11) * g
    return np.tanh(x * 1.6)
def tick():
    n = int(0.05 * SR); t = np.arange(n) / SR
    return (hp(rng.standard_normal(n), 4000) * 0.6 + np.sin(2 * np.pi * 3100 * t) * 0.5) * np.exp(-t * 120)
def whoosh(length=0.7):
    n = int(length * SR); t = np.arange(n) / SR; x = rng.standard_normal(n); out = np.zeros(n); blk = 1200
    for s in range(0, n, blk):
        fc = 300 + 5000 * (s / n); out[s:s + blk] = bp(x[s:s + blk], fc * 0.6, fc * 1.6)
    return out * np.sin(np.pi * t / length) ** 2 * 0.9
def rev_swell(length=1.4):
    x = impact(1.0, length)[::-1]; return x * np.linspace(0, 1, len(x)) ** 2 * 0.6
def sub_drop(length=2.5):
    n = int(length * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t * 0.7) + 25) / SR) * np.exp(-t * 1.2) * np.minimum(1, t / 0.01)

# ---------------------------------------------------------------- harmony and grid
CH = {'Dm': [50, 53, 57], 'Bb': [46, 50, 53], 'F': [53, 57, 60], 'C': [48, 52, 55], 'A': [45, 49, 52], 'D': [50, 54, 57]}
PROG = ['Dm', 'Bb', 'F', 'C']
BEAT = 0.5; BAR = 4 * BEAT
S = {k: Wt(v) for k, v in {'trophy': 3.9, 'action': 7.8, 'location': 13.6, 'squad': 18.4, 'tension': 22.8,
                           'date': 29.7, 'end': 35.6}.items()}
LOGO_D = round(V['E2']['end'] + 0.02, 2); LOGO = Wt(LOGO_D)
S['logo'] = LOGO
def vstart(k): return RV[k]['start']
def grid_from(t0, t1):                       # 16th-note grid times between two real times, phase-locked to t=0
    k0 = int(np.ceil(t0 / (BEAT / 4))); out = []
    while k0 * BEAT / 4 < t1: out.append(k0 * BEAT / 4); k0 += 1
    return out
def chord_at(t, prog=PROG): return prog[int(t // BAR) % len(prog)]

# intro: dark pad + bell motif + sub
put('music', strings([38, 50, 53, 57], S['trophy'] + 0.5, att=1.8, bright=900), 0.0, 0.8)
for k, (m, tt) in enumerate([(74, 0.9), (77, 1.9), (81, 2.6), (79, 3.2)]):
    put('music', bell(m), tt, 0.55, pan=(-0.3, 0.3, -0.15, 0.15)[k])
put('fx', rev_swell(1.4), S['trophy'] - 1.4, 0.7)
# trophy: strings + choir swell, brass braam
put('music', strings([38, 50, 57, 62, 65], S['action'] - S['trophy'] + 0.3, att=2.2, bright=2200), S['trophy'], 0.9)
put('music', choir([62, 65, 69], S['action'] - S['trophy'], att=2.0), S['trophy'] + 0.4, 0.7)
put('music', brass([38, 50, 57], 2.6, 1.0), S['trophy'], 0.9)
put('drums', impact(0.9), S['trophy'], 0.9); put('fx', crash(), S['trophy'], 0.5)
put('drums', taiko(1.0), S['trophy'], 0.8)
put('fx', cymbal_swell(1.6), S['action'] - 1.6, 0.8)

# rhythmic sections: ostinato + taiko + pads, steady 120 bpm
def ostinato(t0, t1, octave=0, gain=0.5, prog=PROG):
    pat = [0, 2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2, 0, 1, 2, 1]          # index into chord tones (root, third, fifth)
    for i, tg in enumerate(grid_from(t0, t1)):
        c = CH[chord_at(tg, prog)]; step = int(round(tg / (BEAT / 4))) % 16
        m = c[pat[step]] + 12 + octave
        acc = 1.0 if step % 4 == 0 else 0.7
        put('music', stacc(m), tg, gain * acc, pan=-0.35 if step % 2 else 0.35)
        if step % 4 == 0: put('music', stacc(c[0] - 12 + octave, 0.16, 1200), tg, gain * 0.9)
def pads(t0, t1, prog=PROG, gain=0.55, top=0):
    b0 = int(t0 // BAR)
    tb = b0 * BAR
    while tb < t1:
        c = CH[chord_at(tb, prog)]; st = max(tb, t0); ln = min(tb + BAR, t1) - st
        if ln > 0.05: put('music', strings([c[0] - 12] + [m + 12 + top for m in c], ln, att=0.3, rel=0.6, bright=2400), st, gain)
        tb += BAR
def drums(t0, t1, pattern, gain=0.8):
    for tg in grid_from(t0, t1):
        step = int(round(tg / (BEAT / 4))) % 16
        if pattern[step] == 2: put('drums', taiko(1.0), tg, gain)
        elif pattern[step] == 1: put('drums', taiko(0.7, low=False), tg, gain * 0.8, pan=0.3)
        elif pattern[step] == 3: put('drums', snare(0.8), tg, gain * 0.6, pan=-0.2)
P_ACTION = [2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 0, 3, 0, 0, 0]
P_SQUAD = [2, 0, 1, 0, 3, 0, 1, 1, 2, 0, 1, 0, 3, 0, 1, 3]
P_DATE = [2, 0, 0, 1, 3, 0, 0, 0, 2, 0, 1, 0, 3, 0, 0, 0]
ostinato(S['action'], S['location']); pads(S['action'], S['location']); drums(S['action'], S['location'], P_ACTION)
ostinato(S['location'], S['squad']); pads(S['location'], S['squad'], gain=0.6)
drums(S['location'], S['squad'], P_ACTION, 0.85)
for i, tg in enumerate(grid_from(S['location'], S['squad'])):          # rising arpeggio
    if int(round(tg / (BEAT / 4))) % 2 == 0:
        c = CH[chord_at(tg)]; m = c[i % 3] + 24 + 12 * (i % 6 >= 3)
        put('music', bell(m, 0.8) * 0.6, tg, 0.35, pan=0.5 * np.sin(i))
ostinato(S['squad'], S['tension'], octave=12, gain=0.55); pads(S['squad'], S['tension'], gain=0.7, top=12)
drums(S['squad'], S['tension'], P_SQUAD, 0.95)
roll0 = S['tension'] - 1.5
for k, tg in enumerate(np.arange(roll0, S['tension'], 1 / 16)):   # snare roll build
    put('drums', snare(0.3 + 0.7 * k / 24), tg, 0.5)
# hits on every cut (design -> real)
for d in [7.95, 9.25, 10.55, 13.6, 15.55, 18.55, 19.95, 21.35]:
    put('drums', impact(0.75), Wt(d), 0.7); put('fx', whoosh(0.5), Wt(d) - 0.5, 0.3, pan=-0.3)
# tension: everything drops, heartbeat, tremolo on A, riser
trem_len = LOGO - S['tension']
tr = strings([69, 76, 81], trem_len, att=0.8, rel=0.1, bright=3500)
tr *= (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 12 * np.arange(len(tr)) / SR)))[:, None]
put('music', tr, S['tension'], 0.45)
put('music', strings([33, 45], trem_len, att=1.0, rel=0.1, bright=600), S['tension'], 0.7)
put('fx', heartbeat(), vstart('E1') - 0.2, 0.8); put('fx', heartbeat(), vstart('E1') + 0.75, 0.65)
put('fx', riser(LOGO - (S['tension'] + 0.6)), S['tension'] + 0.6, 0.6)
put('fx', rev_swell(1.2), LOGO - 1.2, 0.9); put('fx', cymbal_swell(1.5), LOGO - 1.5, 0.9)
# LOGO: huge hit + triumphant D major
hold = S['date'] - LOGO + 0.6
put('drums', impact(1.3, 3.2), LOGO, 1.0); put('drums', taiko(1.2), LOGO, 1.0); put('fx', sub_drop(), LOGO, 0.8)
put('fx', crash(4.0), LOGO, 0.7)
put('music', brass([38, 50, 54, 57, 62], hold, 1.2), LOGO, 1.0)
put('music', strings([38, 50, 57, 62, 66, 69, 74], hold, att=0.05, rel=1.5, bright=4200), LOGO, 1.0)
put('music', choir([62, 66, 69, 74], hold, att=0.2), LOGO, 0.9)
for k, m in enumerate([74, 78, 81, 86]): put('music', bell(m, 3.5), LOGO + 0.15 * k, 0.5, pan=(k - 1.5) / 2)
# date: drums back, ostinato, clock ticks
ostinato(S['date'], S['end'], gain=0.45); pads(S['date'], S['end'], gain=0.55); drums(S['date'], S['end'], P_DATE, 0.8)
for d in [31.36]: put('drums', impact(0.85), Wt(d), 0.75)
for k in range(6): put('fx', tick(), vstart('F2') + 0.25 + k * 0.33, 0.2)
put('drums', impact(0.6), vstart('F3') - 0.05, 0.6)
# end: lift Bb - C - D major, final hit, ring out
END_PROG = ['Bb', 'C', 'D', 'D']
g2 = vstart('G2') - 0.05
pads(S['end'], g2, prog=END_PROG, gain=0.6); ostinato(S['end'], g2, gain=0.4, prog=END_PROG)
drums(S['end'], g2 - 1.0, [2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0], 0.7)
for k, tg in enumerate(np.arange(g2 - 1.0, g2, 1 / 16)): put('drums', snare(0.3 + 0.7 * k / 16), tg, 0.45)
put('fx', cymbal_swell(1.2), g2 - 1.2, 0.8)
tail = TOTAL - g2 + 0.2
put('drums', impact(1.2, 3.0), g2, 1.0); put('drums', taiko(1.2), g2, 1.0); put('fx', crash(4.0), g2, 0.6)
put('music', brass([38, 50, 54, 57, 62], tail, 1.1), g2, 0.95)
put('music', strings([26, 38, 50, 57, 62, 66, 69, 74], tail, att=0.05, rel=0.3, bright=4000), g2, 1.0)
put('music', choir([62, 66, 69, 74], tail, att=0.1, rel=0.3), g2, 0.85)

# ---------------------------------------------------------------- mix: hall reverb, master, ducking
ir_n = int(2.8 * SR); ti = np.arange(ir_n) / SR
ir = np.stack([rng.standard_normal(ir_n), rng.standard_normal(ir_n)], 1) * np.exp(-ti * 2.4)[:, None]
ir[:int(0.012 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum(0))
def reverb(x, wet):
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], 1)
    return x + wet * y
music = reverb(BUS['music'], 0.55); drums_b = reverb(BUS['drums'], 0.25); fx = reverb(BUS['fx'], 0.35)
score = music * 0.9 + drums_b * 0.8 + fx * 0.7
fade = np.interp(np.arange(N) / SR, [0, TOTAL - 1.4, TOTAL], [1, 1, 0])[:, None]
score = np.tanh(score / (np.max(np.abs(score)) + 1e-9) * 1.6) * fade
score /= np.max(np.abs(score)) + 1e-9

def read_wav(p):
    with wave.open(p) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
vo = read_wav(os.path.join(B, 'vo.wav'))[:N]
vo = np.pad(vo, (0, N - len(vo)))
venv = np.convolve(np.abs(vo), np.ones(4800) / 4800, mode='same')
duck = 1 - 0.5 * np.clip(venv / 0.05, 0, 1)
duck = np.convolve(duck, np.ones(3600) / 3600, mode='same')
mix = score * 0.6 * duck[:, None] + vo[:, None] * 0.95
mix /= np.max(np.abs(mix)) / 0.95
def write(p, x):
    with wave.open(p, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
write(os.path.join(B, 'score.wav'), score * 0.9); write(os.path.join(B, 'mix.wav'), mix)
hits = [3.9, 7.95, 9.25, 10.55, 13.6, 15.55, 18.55, 19.95, 21.35, 31.36, 40.35]
json.dump({**tm, 'logo': LOGO_D, 'hits': hits}, open(os.path.join(B, 'timings.json'), 'w'), indent=1, ensure_ascii=False)
print('sections (real s):', {k: round(v, 2) for k, v in S.items()}, 'logo real', round(LOGO, 2))
