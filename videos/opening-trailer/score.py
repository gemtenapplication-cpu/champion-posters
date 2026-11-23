"""Original cinematic score + sound design for the opening trailer, synthesised with numpy (no third-party audio).
Drone bed, driving pulse, impacts / braams on the cuts, whooshes, risers, heartbeat, clock ticks, final logo hit.
Hits are placed from build/timings.json so they land on the voice-over. Music ducks under the voice.
Writes build/score.wav and build/mix.wav (stereo 48 kHz)."""
import json, os, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else 'build')
SR = 48000
tm = json.load(open(os.path.join(B, 'timings.json')))
V = tm.get('design', tm['vo'])                      # all event times below are DESIGN times (the English cut)
TOTAL = tm['total']                                 # real length of this language's trailer
WR, WD = (np.array(a) for a in zip(*tm.get('warp', [[0, 0], [TOTAL, TOTAL]])))
def Wt(td): return float(np.interp(td, WD, WR))     # design time -> real time
N = int(TOTAL * SR); t_all = np.arange(N) / SR
tau_all = np.interp(t_all, WR, WD)                  # real sample -> design time
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def lp(x, f, o=4): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=4): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, f1, f2, o=2): return sosfilt(butter(o, [f1, f2], 'band', fs=SR, output='sos'), x)
def put(x, t0, gain=1.0, pan=0.0):
    i = int(Wt(t0) * SR); n = min(len(x), N - i)
    if n <= 0: return
    L[i:i+n] += x[:n] * gain * np.sqrt(0.5 * (1 - pan)) * 1.414
    R[i:i+n] += x[:n] * gain * np.sqrt(0.5 * (1 + pan)) * 1.414
def add(a, b):
    n = max(len(a), len(b)); out = np.zeros(n); out[:len(a)] += a; out[:len(b)] += b; return out
def env_exp(n, k): return np.exp(-np.arange(n) / SR * k)

def impact(strength=1.0, length=2.2):
    n = int(length * SR); t = np.arange(n) / SR
    f = 32 + 70 * np.exp(-t * 9)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 2.2)
    noise = lp(rng.standard_normal(n), 2500) * env_exp(n, 14) * 0.8
    crack = hp(rng.standard_normal(n), 3000) * env_exp(n, 40) * 0.35
    x = np.tanh((sub * 1.4 + noise + crack) * 1.6)
    return x * strength

def braam(root=55.0, length=3.8, strength=1.0):
    n = int(length * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for mult, g in [(1, 1.0), (1.5, 0.6), (2, 0.55), (3, 0.25), (0.5, 0.8)]:
        for det in (-0.6, 0.0, 0.7):
            ph = 2 * np.pi * (root * mult + det) * t
            x += g * (2 * ((ph / (2 * np.pi)) % 1) - 1)        # saw
    cutoff_env = 300 + 2200 * np.exp(-t * 1.6)
    out = np.zeros(n); blk = 2400
    for s in range(0, n, blk):                                   # time-varying low-pass, block-wise
        out[s:s+blk] = lp(x[s:s+blk], float(cutoff_env[s]), 2)
    a = np.minimum(1, t / 0.03) * np.exp(-t * 0.9)
    return np.tanh(out * a * 0.35) * strength

def whoosh(length=0.9, up=True):
    n = int(length * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); out = np.zeros(n); blk = 1200
    for s in range(0, n, blk):
        p = s / n
        fc = 300 + (4000 if up else 4000 * (1 - p)) * (p if up else 1)
        out[s:s+blk] = bp(x[s:s+blk], max(80, fc * 0.6), min(18000, fc * 1.6))
    a = np.sin(np.pi * np.minimum(1, t / length)) ** 2
    return out * a * 0.9

def riser(length=3.0):
    n = int(length * SR); t = np.arange(n) / SR; p = t / length
    tone = np.sin(2 * np.pi * np.cumsum(120 + 900 * p ** 2) / SR) * 0.35
    noise = np.zeros(n); x = rng.standard_normal(n); blk = 2400
    for s in range(0, n, blk):
        fc = 500 + 7000 * (s / n) ** 2
        noise[s:s+blk] = bp(x[s:s+blk], fc * 0.5, min(19000, fc * 1.5))
    return (tone + noise * 0.8) * p ** 2.2

def heartbeat():
    n = int(0.9 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for d, g in [(0.0, 1.0), (0.26, 0.7)]:
        i = int(d * SR); m = n - i; tt = np.arange(m) / SR
        x[i:] += np.sin(2 * np.pi * (48 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 11) * g
    return np.tanh(x * 1.5)

def tick():
    n = int(0.05 * SR); t = np.arange(n) / SR
    return (hp(rng.standard_normal(n), 4000) * 0.6 + np.sin(2 * np.pi * 3100 * t) * 0.5) * np.exp(-t * 120)

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    return np.tanh(np.sin(2 * np.pi * np.cumsum(45 + 120 * np.exp(-t * 35)) / SR) * np.exp(-t * 7) * 1.6)

def rev_swell(length=1.2):
    x = impact(1.0, length)[::-1]
    return x * np.linspace(0, 1, len(x)) ** 2 * 0.6

# ---- drone bed (whole trailer), swelling with the story
drone = np.zeros(N)
for f, g in [(41.2, 0.5), (61.7, 0.3), (82.4, 0.22), (123.5, 0.08)]:
    drone += g * np.sin(2 * np.pi * f * t_all + 0.3 * np.sin(2 * np.pi * 0.07 * t_all))
air = lp(hp(rng.standard_normal(N), 300), 2500) * 0.05
shape = np.interp(tau_all, [0, 3, 8, 22.5, 24, 26.3, 26.5, 29.5, 36, 42, 44], [0.2, 0.55, 0.6, 0.9, 0.35, 0.5, 1.0, 0.8, 0.55, 0.5, 0])
L += (drone + air) * shape * 0.32; R += (drone + air) * shape * 0.32

# ---- driving pulse 8.0 - 22.6 (120 bpm), ticks on the off-beats, building
for i, tb in enumerate(np.arange(7.8, 22.6, 0.5)):
    build = 0.55 + 0.45 * (tb - 7.8) / 14.8
    put(kick(), tb, 0.55 * build)
    put(tick(), tb + 0.25, 0.10 * build, pan=0.4 if i % 2 else -0.4)
    if tb > 18.3:
        put(kick(), tb + 0.25, 0.35 * build)

# ---- hits on the cuts
def S(k): return V[k]['start']
hits = [(3.9, 0.8, 'braam'), (S('B1') - 0.05, 0.85, 'imp'), (S('B2') - 0.05, 0.8, 'imp'), (S('B3') - 0.05, 0.9, 'imp'),
        (13.6, 0.75, 'braam'), (S('C2') - 0.05, 0.6, 'imp'), (S('D1') - 0.05, 0.85, 'imp'), (S('D2') - 0.05, 0.9, 'imp'),
        (S('D3') - 0.05, 1.0, 'imp'), (S('F2') - 0.05, 0.85, 'imp'), (S('G2') - 0.05, 0.9, 'braam')]
for th, g, kind in hits:
    put(impact(g) if kind == 'imp' else add(braam(55, 3.6, g), impact(g * 0.6)), th, 0.7)
    put(whoosh(0.5, True), th - 0.5, 0.25, pan=-0.3)
put(rev_swell(1.4), 3.9 - 1.4, 0.7)
put(whoosh(1.2, True), 12.6, 0.35, pan=0.5)
put(whoosh(1.4, True), 14.0, 0.3, pan=-0.5)
# ---- tension: silence-ish, heartbeat, riser into the logo slam
LOGO = round(V['E2']['end'] + 0.02, 2)
put(heartbeat(), S('E1') - 0.2, 0.75); put(heartbeat(), S('E1') + 0.75, 0.6)
put(riser(Wt(LOGO) - Wt(23.4)), 23.4, 0.55)
put(rev_swell(1.0), LOGO - 1.0, 0.8)
put(add(braam(41.2, 4.5, 1.2), impact(1.2, 3.0)), LOGO, 0.95)
put(hp(rng.standard_normal(int(2.5 * SR)), 5000) * env_exp(int(2.5 * SR), 1.8) * 0.12, LOGO, 1.0)   # shimmer
# ---- opening card: clock ticks before "Ten A M"
for k in range(6):
    put(tick(), S('F2') + 0.2 + k * 0.33, 0.18)
put(impact(0.6), S('F3') - 0.05, 0.55)
# ---- end
fade = np.interp(tau_all, [0, 42.6, 44], [1, 1, 0])
L *= fade; R *= fade
score = np.stack([L, R], 1)
score /= np.max(np.abs(score)) + 1e-9

# ---- duck under the voice, then mix
def read_wav(p):
    with wave.open(p) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
vo = read_wav(os.path.join(B, 'vo.wav'))[:N]
venv = np.convolve(np.abs(vo), np.ones(4800) / 4800, mode='same')
duck = 1 - 0.45 * np.clip(venv / 0.05, 0, 1)
duck = np.convolve(duck, np.ones(2400) / 2400, mode='same')
mix = score * 0.62 * duck[:, None] + vo[:, None] * 0.95
mix /= np.max(np.abs(mix)) / 0.95
def write(p, x):
    with wave.open(p, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
write(os.path.join(B, 'score.wav'), score * 0.9); write(os.path.join(B, 'mix.wav'), mix)
json.dump({**tm, 'logo': LOGO, 'hits': [h[0] for h in hits]}, open(os.path.join(B, 'timings.json'), 'w'), indent=1, ensure_ascii=False)
print('logo slam at design', LOGO, 'real', round(Wt(LOGO), 2), 'hits', [round(h[0], 2) for h in hits])
