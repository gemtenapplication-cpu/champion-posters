"""Trailer mix (no voiceover): score + action SFX locked to cuts and titles. Loud trailer master."""
import json, subprocess, os
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
M = json.load(open("sfx/meas.json")); TOTAL = 56.0
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
    return r.stderr
E = []
def add(t, n, p, L=None, at_peak=False):
    if at_peak: t -= M[n]["peak_t"]
    E.append((t, n, p, L))
add(0.4, "logo", -12, at_peak=True); add(3.0, "subdrop", -4, at_peak=True); add(3.0, "boomtail", -10)
add(4.0, "hit", -12, at_peak=True); add(6.7, "hit", -12, at_peak=True); add(6.0, "heartbeat", -18, 3.8)
add(10.0 - M["riser"]["dur"], "riser", -4); add(10.0, "braam", -1, at_peak=True); add(10.0, "subdrop", -2, at_peak=True)
add(12.2, "metalhit", -3, at_peak=True); add(12.2, "boomtail", -6); add(13.7, "revhit", -6, at_peak=False)
cuts = [14.0, 14.9, 15.8, 16.7, 17.6, 18.7, 19.6, 20.8, 21.7, 22.6, 23.5]
for c in cuts: add(c - 0.1, "whip", -10)
add(14.0, "explosion", -3, at_peak=True); add(14.9, "gunfire", -5); add(15.8, "siren", -14, 0.9); add(15.8, "carpass", -7)
add(16.7, "bikepass", -7); add(19.6, "metalhit", -5, at_peak=True); add(20.8, "wave", -9, 0.9); add(21.7, "explosion", -4, at_peak=True)
add(23.5, "gunfire", -5); add(23.7, "stutter", -8)
add(24.0, "braam", -2, at_peak=True); add(24.0, "subdrop", -4, at_peak=True)
for c in [26.0, 30.1, 33.4, 36.1, 37.5, 39.1, 40.25]: add(c - 0.15, "whoosh", -11)
for c in [26.4, 30.4, 33.7, 36.4]: add(c, "hit", -11, at_peak=True)
add(41.6 - M["riser"]["dur"], "riser", -6); add(41.6, "logo", -2, at_peak=True); add(41.6, "braam", -3, at_peak=True); add(41.6, "subdrop", -5, at_peak=True)
add(46.0, "whoosh", -8); add(46.6, "hit", -7, at_peak=True)
for c in [47.2, 47.55, 47.9]: add(c, "whoosh", -16)
add(54.6, "boomtail", -9)
cmd = ["ffmpeg", "-v", "error", "-y", "-i", "music2.mp3"]; f = ["[0]aformat=sample_rates=48000:channel_layouts=stereo,volume=-3dB,afade=t=out:st=54.8:d=1.2[mu]"]; lab = ["[mu]"]
for i, (t, n, p, L) in enumerate(E, start=1):
    cmd += ["-i", f"sfx/{n}.mp3"]; tr = f"atrim=0:{L},afade=t=out:st={max(0,L-.25)}:d=0.25," if L else ""
    f.append(f"[{i}]aformat=sample_rates=48000:channel_layouts=stereo,{tr}volume={p-M[n]['pk']-2:.1f}dB,adelay={int(max(0,t)*1000)}:all=1[e{i}]"); lab.append(f"[e{i}]")
f.append("".join(lab) + f"amix=inputs={len(lab)}:normalize=0:duration=first,atrim=0:{TOTAL},acompressor=threshold=-16dB:ratio=2:attack=10:release=180:makeup=1,alimiter=limit=0.8:attack=3:release=50:level=disabled[o]")
run(cmd + ["-filter_complex", ";".join(f), "-map", "[o]", "-c:a", "pcm_s24le", "clips/mix_pre.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix_pre.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
I = float([l for l in m.splitlines() if l.strip().startswith("I:")][-1].split()[1])
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/mix_pre.wav", "-af", f"volume={-12.0-I:.2f}dB,alimiter=limit=0.86:attack=2:release=40:level=disabled", "-ar", "48000", "-c:a", "pcm_s16le", "clips/mix.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
print("events", len(E), " ".join(l.strip() for l in m.splitlines()[-12:] if any(k in l for k in ("I:", "LRA:", "Peak:"))))
