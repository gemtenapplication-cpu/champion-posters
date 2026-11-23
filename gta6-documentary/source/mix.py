"""Sound design + final mix: voice, scene-synced score, ambience beds, transition/accent SFX."""
import json, subprocess, os
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
tl = json.load(open("timeline.json")); T = {x["id"]: x for x in tl}
TOTAL = tl[-1]["start"] + tl[-1]["dur"]

# measured integrated loudness (LUFS) of each source -> gain to reach a target level
MEAS = {"whoosh": -8.0, "impact": -10.9, "riser": -6.6, "glitch": -7.8, "cash": -18.5, "crowd": -12.7, "notif": -10.2,
        "amb_beach": -24.9, "amb_city": -36.1, "amb_glitch": -20.9, "amb_retro": -39.9, "amb_chase": -15.5}
def g(name, target): return target - MEAS[name]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
    return r.stderr

# ---------- one-shot SFX events: (start_time, name, target_LUFS) ----------
ev = []
title = T["s00"]["start"]
ev += [(title - 3.53, "riser", -19), (title - 0.36, "whoosh", -18), (title - 0.20, "impact", -14)]
for sid in ["s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "s10", "s11"]:
    st = T[sid]["start"]
    ev.append((st - 0.36, "whoosh", -21))
    if sid != "s11": ev.append((st + 0.25, "impact", -23))     # chapter title reveal
L = lambda sid, i: T[sid]["lines"][i][0]
ev += [(T["s03"]["start"] + 0.9, "glitch", -24), (L("s03", 1) + 0.2, "glitch", -25), (L("s03", 2) - 0.3, "glitch", -22)]
ev += [(L("s07", 0) - 0.4, "crowd", -25), (L("s07", 2) + 3.4, "cash", -24), (L("s07", 2) + 4.0, "crowd", -28)]
ev += [(L("s08", 1) - 0.2, "notif", -29)]

# ---------- ambience beds: (scene, name, target_LUFS) ----------
beds = [("s01", "amb_beach", -33), ("s02", "amb_retro", -34), ("s03", "amb_glitch", -33), ("s04", "amb_city", -32),
        ("s05", "amb_beach", -33), ("s06", "amb_chase", -31), ("s07", "amb_city", -33), ("s08", "amb_city", -35),
        ("s09", "amb_city", -33), ("s10", "amb_beach", -34), ("s11", "amb_beach", -35)]

cmd = ["ffmpeg", "-v", "error", "-y", "-i", "clips/voice.wav", "-i", "music2.mp3"]
f = []
idx = 2
bed_labels, sfx_labels = [], []
for sid, name, tgt in beds:
    st, d = max(0.0, T[sid]["start"] - 0.3), T[sid]["dur"] + 0.6
    cmd += ["-stream_loop", "-1", "-i", f"sfx/{name}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{d:.3f},asetpts=PTS-STARTPTS,"
             f"volume={g(name, tgt):.1f}dB,afade=t=in:d=0.8,afade=t=out:st={d-1.0:.3f}:d=1.0,adelay={int(st*1000)}:all=1[b{idx}]")
    bed_labels.append(f"[b{idx}]"); idx += 1
for st, name, tgt in ev:
    cmd += ["-i", f"sfx/{name}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,volume={g(name, tgt):.1f}dB,adelay={int(max(0, st)*1000)}:all=1[e{idx}]")
    sfx_labels.append(f"[e{idx}]"); idx += 1

# music: score is pre-timed to the scenes; base level is strong, ducks ~5 dB under narration
f.append("[1]aformat=sample_rates=48000:channel_layouts=stereo,volume=-8.5dB,afade=t=in:d=0.8,"
         f"afade=t=out:st={TOTAL-3.5:.2f}:d=3.5[mus]")
f.append("[0]aformat=sample_rates=48000:channel_layouts=stereo,volume=11dB,"
         "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=1,"
         "equalizer=f=3200:t=q:w=1.2:g=2[vox]")
f.append("[vox]asplit=3[v1][k1][k2]")
f.append(f"[mus]{''.join(bed_labels) and ''}anull[m0]")
f.append(f"[m0]{''.join(bed_labels)}amix=inputs={1+len(bed_labels)}:normalize=0:duration=first[bed]")
f.append("[bed][k1]sidechaincompress=threshold=0.035:ratio=3.2:attack=40:release=450:knee=4[duck]")
f.append(f"{''.join(sfx_labels)}amix=inputs={len(sfx_labels)}:normalize=0,apad=whole_dur={TOTAL:.3f}[fx]")
f.append("[fx][k2]sidechaincompress=threshold=0.05:ratio=2:attack=20:release=300[fxd]")
f.append(f"[v1][duck][fxd]amix=inputs=3:normalize=0:duration=first,atrim=0:{TOTAL:.3f}[pre]")
f.append("[pre]alimiter=limit=0.84:attack=5:release=60:level=disabled[out]")
run(cmd + ["-filter_complex", ";".join(f), "-map", "[out]", "-c:a", "pcm_s24le", "clips/mix_pre.wav"])

# loudness: measure, then a static gain to -14 LUFS (YouTube target) + true-peak limiter
m = run(["ffmpeg", "-nostats", "-i", "clips/mix_pre.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
I = float([l for l in m.splitlines() if l.strip().startswith("I:")][-1].split()[1])
gain = -14.0 - I
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/mix_pre.wav", "-af",
     f"volume={gain:.2f}dB,alimiter=limit=0.89:attack=3:release=50:level=disabled", "-c:a", "pcm_s16le", "clips/mix.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
print("pre I", I, "gain", round(gain, 2)); print("\n".join(l for l in m.splitlines()[-12:] if "I:" in l or "Peak:" in l or "LRA:" in l))

run(["ffmpeg", "-v", "error", "-y", "-i", "clips/video.mp4", "-i", "clips/mix.wav", "-map", "0:v", "-map", "1:a",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", "GTA6_Bangla_Documentary.mp4"])
print("muxed")
