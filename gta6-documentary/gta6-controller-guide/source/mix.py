"""Explainer mix: voice on top (music & sfx 14 dB under while talking), UI sfx from scene data."""
import json, subprocess, os, sys, re, numpy as np
D = sys.argv[1]; os.chdir(D)
TL = json.load(open("timeline.json")); TOTAL = TL["total"]; L = {l["id"]: l for l in TL["lines"]}
S = lambda i: L[i]["start"]; E_ = lambda i: L[i]["start"] + L[i]["dur"]
def T(r):
    m = re.match(r'^([a-z]\d+)(e|w\d+)?([+-]\d*\.?\d+)?$', r); l = L[m.group(1)]; t = l['start']
    if m.group(2) == 'e': t = l['start'] + l['dur']
    elif m.group(2): t = l['wt'][min(int(m.group(2)[1:]), len(l['wt']) - 1)]
    return t + (float(m.group(3)) if m.group(3) else 0)
M = json.load(open("sfx/meas.json")); DD = json.load(open("data_dump.json")); VID = os.path.basename(os.getcwd())
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
    return r.stderr
EV = []
def add(t, n, p, at_peak=False):
    if at_peak: t -= M[n]["peak_t"]
    EV.append((t, n, p))
first = TL["lines"][0]["id"]
add(0.05, "logo", -3, True); add(0.05, "subdrop", -5, True); add(S(first) - .15, "whoosh", -8); add(S(first) + .25, "hit", -7, True)
for s in DD["sections"]: add(T(s["a"]) - .05, "swipe", -7)
prev = None
for k in DD["kf"]:
    if prev and k["img"] != prev: add(T(k["t"]) - .05, "swipe", -12)
    prev = k["img"]
for c in DD["cur"]: add(T(c["t"]), "click", -6, True)
for h in DD["hl"]: add(T(h["a"]) + .02, "pop", -16)
for b in DD["badges"]:
    for it in b["items"]: add(T(it["t"]), "pop", -10)
for r, n, p_, *pk in DD.get("sfx", []): add(T(r), n, p_, bool(pk and pk[0]))
endA = DD["endA"]
add(T(endA) - .3, "whoosh", -9); add(S("q5") - .3, "whoosh", -11); add(S("q7") - .3, "whoosh", -11)
add(S("q8") - .3, "braam", -4, True); add(S("q8") - .3, "logo", -5, True); add(TOTAL - 2.6, "boomtail", -11)
cmd = ["ffmpeg", "-v", "error", "-y"]; f = []; idx = 0; vl = []
for l in TL["lines"]:
    cmd += ["-i", f"audio/{l['id']}.mp3"]; f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=mono,adelay={int(l['start']*1000)}:all=1[v{idx}]"); vl.append(f"[v{idx}]"); idx += 1
cmd += ["-i", "music.mp3"]; mi = idx; idx += 1
fx = []
for t, n, p in EV:
    cmd += ["-i", f"sfx/{n}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,volume={p-M[n]['pk']:.1f}dB,adelay={int(max(0,t)*1000)}:all=1[e{idx}]"); fx.append(f"[e{idx}]"); idx += 1
f.append("".join(vl) + f"amix=inputs={len(vl)}:normalize=0,apad=whole_dur={TOTAL},"
         "rubberband=pitch=0.95:formant=preserved:pitchq=quality,highpass=f=60,lowshelf=f=140:g=4,equalizer=f=320:t=q:w=1:g=-2.5,"
         "equalizer=f=3200:t=q:w=1.3:g=3,highshelf=f=9000:g=1.5,acompressor=threshold=-24dB:ratio=3.5:attack=5:release=110:makeup=3,"
         f"aecho=0.85:0.35:28|46:0.07|0.04,aformat=channel_layouts=stereo,atrim=0:{TOTAL}[vo]")
f.append(f"[{mi}]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.3,afade=t=out:st={TOTAL-1.8:.2f}:d=1.8,equalizer=f=2800:t=q:w=1.3:g=-4,atrim=0:{TOTAL}[mu]")
f.append("".join(fx) + f"amix=inputs={len(fx)}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[fx]")
run(cmd + ["-filter_complex", ";".join(f), "-map", "[vo]", "-c:a", "pcm_f32le", "-ar", "48000", "clips/st_voice.wav",
           "-map", "[mu]", "-c:a", "pcm_f32le", "-ar", "48000", "clips/st_music.wav", "-map", "[fx]", "-c:a", "pcm_f32le", "-ar", "48000", "clips/st_sfx.wav"])
SR = 48000
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
V, Mu, Fx = load("clips/st_voice.wav"), load("clips/st_music.wav"), load("clips/st_sfx.wav")
N = min(len(V), len(Mu), len(Fx)); V, Mu, Fx = V[:N], Mu[:N], Fx[:N]
merged = []
for a_, b_ in sorted((l["start"] - 0.22, l["start"] + l["dur"] + 0.30) for l in TL["lines"]):
    if merged and a_ - merged[-1][1] < 0.9: merged[-1][1] = max(merged[-1][1], b_)
    else: merged.append([a_, b_])
speech = np.zeros(N, np.float32)
for a_, b_ in merged: speech[max(0, int(a_*SR)):min(N, int(b_*SR))] = 1
duck = np.empty_like(speech); v = 0.0
for i in range(0, N, 480):
    tgt = speech[i]; v = min(tgt, v + 480 / (0.2 * SR)) if tgt > v else max(tgt, v - 480 / (0.45 * SR)); duck[i:i+480] = v
db = lambda x: 10 * np.log10(np.mean(x ** 2) + 1e-12)
sp = speech > 0.5
vr = np.sqrt(np.convolve(V[:, 0] ** 2, np.ones(4800) / 4800, mode="same")); active = sp & (vr > 10 ** (-45 / 20))
VOICE = db(V[active])
Mu *= 10 ** (((VOICE - 3.0) - db(Mu[~sp])) / 20)
fx_on = (~sp) & (np.abs(Fx[:, 0]) > 1e-4)
if fx_on.any(): Fx *= 10 ** (((VOICE - 4.0) - db(Fx[fx_on])) / 20)
DM = max(-45.0, min(-6.0, (VOICE - 14.0) - db(Mu[active])))
fx_sp = active & (np.abs(Fx[:, 0]) > 1e-4); DF = max(-30.0, min(-6.0, (VOICE - 14.0) - db(Fx[fx_sp]))) if fx_sp.any() else -10.0
gm = 10 ** (DM * duck / 20); gf = 10 ** (DF * duck / 20)
mix = V + Mu * gm[:, None] + Fx * gf[:, None]
print(f"DM {DM:.1f} DF {DF:.1f} | while talking: music {VOICE-db((Mu*gm[:,None])[active]):.1f} dB under, sfx {VOICE-(db((Fx*gf[:,None])[fx_sp]) if fx_sp.any() else -99):.1f} dB under the voice")
mix.astype(np.float32).tofile("clips/mix_raw.f32")
run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "clips/mix_raw.f32", "-af",
     "acompressor=threshold=-18dB:ratio=1.8:attack=20:release=250:makeup=1,alimiter=limit=0.8:attack=4:release=60:level=disabled", "-c:a", "pcm_s24le", "clips/mix_pre.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix_pre.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
I = float([l for l in m.splitlines() if l.strip().startswith("I:")][-1].split()[1])
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/mix_pre.wav", "-af", f"volume={-13.0-I:.2f}dB,alimiter=limit=0.84:attack=2:release=40:level=disabled", "-ar", "48000", "-c:a", "pcm_s16le", "clips/mix.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
print("events", len(EV), " ".join(l.strip() for l in m.splitlines()[-12:] if any(k in l for k in ("I:", "Peak:"))))
