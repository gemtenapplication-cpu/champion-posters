"""Action-cinematic mix: heavy deep narration on top, two-part trailer score, footage-synced action SFX,
impacts/whooshes on every title, chapter and graphic. Mastered loud (-12 LUFS) like the reference channel."""
import json, subprocess, os, numpy as np
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
TLJ = json.load(open("timeline.json")); TOTAL = TLJ["total"]
L = {l["id"]: l for l in TLJ["lines"]}
Ls = lambda i: L[i]["start"]; Le = lambda i: L[i]["start"] + L[i]["dur"]
M = json.load(open("sfx/meas.json"))
SHOTS = json.load(open("shots.json"))

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
    return r.stderr

E = []   # (time, sfx, target_peak_dB, trim)
def add(t, n, p, L_=None, at_peak=False):
    if at_peak: t -= M[n]["peak_t"]
    E.append((t, n, p, L_))

# --- Presents -> action montage
add(3.5, "subdrop", -3, at_peak=True); add(3.5, "braam", -2, at_peak=True)
cuts = [3.5 + 0.75 * k for k in range(6)]
for c in cuts: add(c - 0.15, "whip", -10)
add(cuts[0], "explosion", -4, at_peak=True); add(cuts[1], "gunfire", -6); add(cuts[2], "siren", -12, 1.4); add(cuts[2], "carpass", -8)
add(cuts[3], "bikepass", -8); add(cuts[4], "heli", -10, 1.2); add(cuts[4], "wave", -10, 1.0); add(cuts[5], "explosion", -4, at_peak=True)
add(8.0, "metalhit", -4, at_peak=True); add(8.0, "boomtail", -8)
# --- hook
add(Ls("h1") - 0.25, "hit", -10, at_peak=True)
add(Ls("h4") + 1.6, "revhit", -4, at_peak=True)
# --- title drop
T0 = Le("h5") + 0.15
add(T0 - M["riser"]["dur"], "riser", -5); add(T0, "braam", -1, at_peak=True); add(T0, "subdrop", -3, at_peak=True); add(T0, "boomtail", -7)
add(36.6, "whip", -10)
# --- chapter cards
for l in TLJ["lines"]:
    if "chapter" in l:
        t0 = l["start"] - 3.35
        add(t0, "revhit", -4, at_peak=True); add(t0, "metalhit", -6, at_peak=True); add(t0, "boomtail", -10); add(t0 - 0.3, "whoosh", -12)
        add(l["start"] + 0.2, "whip", -13)
# --- lower thirds, big words, statements, counters
for t in [Ls("a2")+1.2, Ls("a3")+1.0, Ls("a3")+2.9, Ls("a3")+4.8, Ls("a4")+1.0, Ls("a6")+.3, Ls("e2")+.1, Ls("e3")+.1, Ls("e5")+.2, Ls("g2")+.3]:
    add(t - 0.1, "whoosh", -16)
for t in [Le("c3")-1.3, Ls("d1")+.2, Ls("e6")+1.4]: add(t, "hit", -13, at_peak=True); add(t, "boomtail", -16)
add(Ls("a7")+2.0, "hit", -15, at_peak=True); add(Le("b5")+.15, "braam", -4, at_peak=True); add(Le("b3")+.1, "explosion", -6, at_peak=True)
for t in [Ls("a5")+.2, Ls("c2")+.2, Ls("f3")+.8, Ls("g3")+.2]: add(t, "hit", -14, at_peak=True); add(t + 0.1, "counter", -24, 1.5)
add(Le("g4")+.1, "cheer", -12, 3.5)
add(Ls("g4")-.3, "flash", -8, at_peak=True); add(Ls("g5")-.25, "hit", -9, at_peak=True); add(Le("g5")+.1, "ding", -10)
# map + delays timeline
add(Ls("d3")-.3, "whoosh", -14); add(Ls("d4")-.35, "stutter", -14)
add(Le("f2")+.1, "stutter", -10); add(Ls("f4")-.3, "stutter", -12); add(Le("f4")+.1, "hit", -8, at_peak=True)
# social pops
for i in range(3): add(Ls("e7")+.4+i*.7, "notif", -9)
# --- promo
a = Ls("p2") - .3
add(a, "whoosh", -8); add(a + .1, "logo", -3, at_peak=True); add(a + .1, "subdrop", -8, at_peak=True)
for t in [Ls("p3")-.1, Ls("p4")-.1, Ls("p5")-.1]: add(t - .1, "whoosh", -12)
add(Ls("p4")+.6, "keys", -14, 2.2); add(Ls("p5")+1.4, "keypad", -17, 3.9)
add(Ls("p6")-.2, "braam", -4, at_peak=True); add(Ls("p6")-.2, "logo", -5, at_peak=True); add(TOTAL - 3.0, "boomtail", -10)

# --- footage-synced action SFX: (src, source_time, sfx, peak)
FOOT = [("launch",52.9,"explosion",-5),("launch",60.2,"explosion",-6),("gtav",67.4,"explosion",-6),("t2",75.0,"gunfire",-8),
        ("launch",72.3,"gunfire",-8),("launch",46.5,"siren",-12),("launch",46.6,"carpass",-9),("t2",148.4,"bikepass",-9),
        ("t2",147.4,"wave",-11),("t2",138.3,"heli",-11),("t2",139.4,"wave",-11),("gtav",17.2,"wave",-12),("t1",23.4,"wave",-12),
        ("t2",27.1,"engine",-13),("launch",49.0,"bikepass",-10),("t2",45.4,"siren",-15),("t2",90.5,"hit",-12),("launch",64.7,"gunfire",-14),
        ("t2",143.9,"carpass",-11),("gtav",23.0,"carpass",-13),("launch",19.0,"carpass",-12),("launch",59.5,"gunfire",-9)]
for src, st, n, p in FOOT:
    for s in SHOTS:
        if s["src"] == src and s["a"] <= st < s["b"] and not (3.5 <= s["start"] < 8.0):
            add(s["start"] + (st - s["a"]) * s["m"], n, p - 4, None, at_peak=(n in ("explosion", "gunfire", "hit")))

# beds: (start, end, sfx, LUFS)
B = [(8.6, 27.4, "heartbeat", -30), (9.0, 26.0, "tension", -31), (Ls("b1")-.5, Ls("b3"), "heartbeat", -29), (Ls("f1")-.3, Le("f4"), "tick", -30)]

cmd = ["ffmpeg", "-v", "error", "-y"]; f = []; idx = 0
vl = []
for l in TLJ["lines"]:
    cmd += ["-i", f"audio/{l['id']}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=mono,adelay={int(l['start']*1000)}:all=1[vl{idx}]"); vl.append(f"[vl{idx}]"); idx += 1
cmd += ["-i", "music_A.mp3", "-i", "music_B.mp3"]; mA, mB = idx, idx + 1; idx += 2
fx = []
for t, n, p, Ltr in E:
    cmd += ["-i", f"sfx/{n}.mp3"]
    tr = f"atrim=0:{Ltr},afade=t=out:st={max(0,Ltr-0.3)}:d=0.3," if Ltr else ""
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,{tr}volume={p-M[n]['pk']:.1f}dB,adelay={int(max(0,t)*1000)}:all=1[e{idx}]")
    fx.append(f"[e{idx}]"); idx += 1
beds = []
for s, e, n, lufs in B:
    d = e - s; cmd += ["-stream_loop", "-1", "-i", f"sfx/{n}.mp3"]
    f.append(f"[{idx}]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{d:.3f},asetpts=PTS-STARTPTS,volume={lufs-M[n]['I']:.1f}dB,"
             f"afade=t=in:d=0.8,afade=t=out:st={d-1.2:.3f}:d=1.2,adelay={int(s*1000)}:all=1[bd{idx}]"); beds.append(f"[bd{idx}]"); idx += 1

# heavy, deep, clear narration
f.append("".join(vl) + f"amix=inputs={len(vl)}:normalize=0,apad=whole_dur={TOTAL},"
         "rubberband=pitch=0.9:formant=preserved:pitchq=quality,highpass=f=60,lowshelf=f=140:g=4,equalizer=f=320:t=q:w=1:g=-2.5,"
         "equalizer=f=3200:t=q:w=1.3:g=3,highshelf=f=9000:g=1.5,acompressor=threshold=-24dB:ratio=3.5:attack=5:release=110:makeup=3,"
         "aecho=0.85:0.35:28|46:0.07|0.04,aformat=channel_layouts=stereo,volume=8dB[vox]")
f.append("[vox]asplit=3[vo][k1][k2]")
f.append(f"[{mA}]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=out:st=172.2:d=0.35[ma]")
f.append(f"[{mB}]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.15,adelay=172400:all=1[mb]")
f.append(f"[ma][mb]amix=inputs=2:normalize=0,afade=t=out:st={TOTAL-2.5:.2f}:d=2.5,volume=-5dB[mus]")
f.append("[mus]" + "".join(beds) + f"amix=inputs={1+len(beds)}:normalize=0:duration=first,equalizer=f=2800:t=q:w=1.3:g=-4,equalizer=f=1000:t=q:w=1:g=-1.5[bus]")
f.append("[bus][k1]sidechaincompress=threshold=0.01:ratio=8:attack=12:release=480:knee=3[busd]")
f.append("".join(fx) + f"amix=inputs={len(fx)}:normalize=0,apad=whole_dur={TOTAL}[fxb]")
f.append("[fxb][k2]sidechaincompress=threshold=0.012:ratio=6:attack=5:release=300[fxd]")
f.append(f"[vo][busd][fxd]amix=inputs=3:normalize=0:duration=first,atrim=0:{TOTAL}[pre]")
# glue compression for a dense, heavy master
f.append("[pre]acompressor=threshold=-16dB:ratio=2.2:attack=15:release=200:makeup=1,alimiter=limit=0.8:attack=4:release=60:level=disabled[out]")
run(cmd + ["-filter_complex", ";".join(f), "-map", "[out]", "-c:a", "pcm_s24le", "clips/mix_pre.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix_pre.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
I = float([l for l in m.splitlines() if l.strip().startswith("I:")][-1].split()[1])
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/mix_pre.wav", "-af", f"volume={-12.0-I:.2f}dB,alimiter=limit=0.84:attack=2:release=40:level=disabled",
     "-ar", "48000", "-c:a", "pcm_s16le", "clips/mix.wav"])
m = run(["ffmpeg", "-nostats", "-i", "clips/mix.wav", "-af", "ebur128=peak=true", "-f", "null", "-"])
print("events", len(E), "| pre I", I); print(" ".join(l.strip() for l in m.splitlines()[-12:] if any(k in l for k in ("I:", "LRA:", "Peak:"))))
