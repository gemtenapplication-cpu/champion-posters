"""Investigation-doc sound design + mix. Voice is king: music/beds duck ~9 dB under narration and carry a
permanent presence-band dip so the Bengali narration always sits on top."""
import json, subprocess, os, numpy as np
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
TLJ = json.load(open("timeline.json")); TOTAL = TLJ["total"]
LINES = {l["id"]: l for l in TLJ["lines"]}

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
    return r.stderr

def peak_db(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
    return 20 * np.log10(np.abs(np.frombuffer(raw, np.float32)).max() + 1e-9)
PK = {os.path.basename(f)[:-4]: peak_db("sfx/" + f) for f in os.listdir("sfx") if f.endswith(".mp3")}
MEAS = json.load(open("sfx/meas.json"))

# ---------------- one-shot events: (time, sfx, target_peak_dB, trim_len or None) ----------------
E = []
add = lambda t, n, p, L=None: E.append((t, n, p, L))
# cold open
for t, L in [(0.3, 1.2), (2.6, 1.6), (6.9, 1.1)]: add(t, "typewriter", -14, L)
for t, p in [(2.0, -8), (6.35, -12), (8.6, -8), (17.3, -10), (47.45, -10), (64.75, -12), (79.95, -12), (99.95, -12), (115.95, -14)]: add(t, "glitch", p)
for t in [4.3, 15.7, 36.6, 74.0, 97.9, 108.1, 110.6]: add(t, "stamp", -3); add(t, "hit", -15)
add(12.2, "loading", -14)
add(14.6 - MEAS["riser"]["dur"], "riser", -6)
add(14.58, "braam", -2)
# board
add(17.6, "paper", -12)
for t in [20.4, 27.0, 28.85, 30.45, 34.8, 39.2, 43.3, 45.5]: add(t, "whoosh", -12)
# evidence headers
for t in [17.75, 47.9, 65.0, 80.1]: add(t + 0.15, "hit", -5); add(t + 0.35, "glitch", -13)
# leonida tags + map
for t in [51.15, 55.5, 57.95]: add(t, "blip", -10); add(t + 0.2, "keys", -20, 0.8)
add(59.45, "scan", -12); add(61.9, "error", -8)
# duo
for t in [67.9, 70.3]: add(t, "lock", -8)
add(73.0, "paper", -10)
for t in [76.7, 77.7, 78.7]: add(t, "switch", -9)
# city
add(83.7, "static", -12); add(89.1, "static", -15); add(84.2, "horn", -11)
for t in [90.6, 91.4, 92.3]: add(t, "blip", -10)
for t in [95.0, 95.9, 96.8]: add(t, "notif", -8)
# verdict
add(99.98, "braam", -2); add(100.9, "counter", -13, 2.3); add(103.2, "hit", -6)
add(106.1, "loading", -17); add(107.6, "ding", -8)
add(110.6, "braam", -9)
# promo
add(116.0, "whoosh", -8); add(116.3, "logo", -5); add(117.0, "whoosh", -15)
for t in [121.35, 126.1, 130.9]: add(t - 0.1, "whoosh", -13); add(t + 0.1, "blip", -12)
add(126.5, "keys", -14, 2.1); add(131.6, "keypad", -17, 3.6)
add(137.95, "logo", -5)

# ---------------- beds: (start, end, sfx, target LUFS, offset) ----------------
B = [(0.0, 14.9, "drone", -27, 0.0), (3.0, 12.2, "tick", -30, 0.0), (89.6, 94.6, "tick", -31, 2.0), (111.4, 115.6, "tick", -28, 4.0)]

cmd = ["ffmpeg", "-v", "error", "-y"]
f = []; idx = 0
# voice lines
vl = []
for l in TLJ["lines"]:
    cmd += ["-i", f"audio/{l['id']}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(l['start']*1000)}:all=1[vl{idx}]"); vl.append(f"[vl{idx}]"); idx += 1
cmd += ["-i", "music.mp3"]; mi = idx; idx += 1
fx = []
for t, n, p, L in E:
    cmd += ["-i", f"sfx/{n}.mp3"]
    tr = f"atrim=0:{L},afade=t=out:st={max(0,L-0.25)}:d=0.25," if L else ""
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,{tr}volume={p-PK[n]:.1f}dB,adelay={int(max(0,t)*1000)}:all=1[e{idx}]")
    fx.append(f"[e{idx}]"); idx += 1
beds = []
for s, e, n, lufs, off in B:
    d = e - s
    cmd += ["-stream_loop", "-1", "-i", f"sfx/{n}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,atrim={off}:{off+d},asetpts=PTS-STARTPTS,volume={lufs-MEAS[n]['I']:.1f}dB,"
             f"afade=t=in:d=0.6,afade=t=out:st={d-1.0}:d=1.0,adelay={int(s*1000)}:all=1[bd{idx}]"); beds.append(f"[bd{idx}]"); idx += 1

# voice chain: clean, present, consistent
f.append("".join(vl) + f"amix=inputs={len(vl)}:normalize=0,apad=whole_dur={TOTAL},"
         "highpass=f=80,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3000:t=q:w=1.4:g=3,equalizer=f=7500:t=q:w=2:g=-1.5,"
         "acompressor=threshold=-22dB:ratio=3:attack=6:release=120:makeup=2,volume=12dB[vox]")
f.append("[vox]asplit=3[vo][k1][k2]")
# music + beds bus: presence dip, then duck under voice
f.append(f"[{mi}]aformat=sample_rates=48000:channel_layouts=stereo,volume=-7dB,afade=t=in:d=0.5,afade=t=out:st={TOTAL-1.2:.2f}:d=1.2[mus]")
f.append("[mus]" + "".join(beds) + f"amix=inputs={1+len(beds)}:normalize=0:duration=first,equalizer=f=2800:t=q:w=1.2:g=-3.5[bus]")
f.append("[bus][k1]sidechaincompress=threshold=0.02:ratio=5:attack=25:release=380:knee=3[busd]")
# sfx bus: light ducking so hits stay punchy but never mask words
f.append("".join(fx) + f"amix=inputs={len(fx)}:normalize=0,apad=whole_dur={TOTAL}[fxb]")
f.append("[fxb][k2]sidechaincompress=threshold=0.03:ratio=2.5:attack=10:release=250[fxd]")
f.append(f"[vo][busd][fxd]amix=inputs=3:normalize=0:duration=first,atrim=0:{TOTAL}[pre]")
f.append("[pre]alimiter=limit=0.8:attack=4:release=60:level=disabled[out]")
run(cmd + ["-filter_complex", ";".join(f), "-map", "[out]", "-c:a", "pcm_s24le", "clips/mix_pre.wav"])

m = run(["ffmpeg", "-nostats", "-i", "clips/mix_pre.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
I = float([l for l in m.splitlines() if l.strip().startswith("I:")][-1].split()[1])
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/mix_pre.wav", "-af", f"volume={-14.0-I:.2f}dB,alimiter=limit=0.89:attack=3:release=50:level=disabled",
     "-ar", "48000", "-c:a", "pcm_s16le", "clips/mix.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
print("events", len(E), "pre I", I); print("\n".join(l for l in m.splitlines()[-12:] if any(k in l for k in ("I:", "Peak:", "LRA:"))))

# stems for a balance check: voice-only and everything-but-voice
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/mix_pre.wav", "-t", "1", "-f", "null", "-"])
