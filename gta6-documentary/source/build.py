import json, subprocess, os
D = os.path.dirname(os.path.abspath(__file__))
os.chdir(D)
os.makedirs("clips", exist_ok=True)
FPS = 30
LEAD, GAP, TAIL = 1.3, 0.5, 1.1
TITLE_LEN, END_LEN = 5.0, 7.5

def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True).stdout)

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); raise SystemExit(1)

script = json.load(open("script.json"))
timeline = []      # (scene_id, duration, [(sub_png, start, end)])
voice = []         # (mp3, absolute_start)
t0 = 0.0
order = [script[0], "TITLE"] + script[1:]
for s in order:
    if s == "TITLE":
        timeline.append(("s00", TITLE_LEN, [])); t0 += TITLE_LEN; continue
    t = LEAD; subs = []
    for i, _ in enumerate(s["lines"]):
        a = f"audio/{s['id']}_{i:02d}.mp3"; d = dur(a)
        voice.append((a, t0 + t))
        subs.append((f"frames/{s['id']}_{i:02d}_sub.png", t - 0.1, t + d + 0.25))
        t += d + GAP
    t += TAIL - GAP
    timeline.append((s["id"], round(t, 3), subs))
    t0 += t
timeline.append(("s11", END_LEN, []))
total = t0 + END_LEN
print(f"total {total:.1f}s")

# --- trailer footage (clean shots only: no logos, ratings, text cards or social-media frames) ---
SPEED = 1.25   # 0.8x slow motion
FOOT = {
 "s01": [("t1",2.8,10.9),("launch",2.1,6.0),("t1",18.4,21.7),("launch",9.3,11.2),("t1",31.0,32.5)],
 "s04": [("t1",36.0,42.3),("t1",24.85,30.0),("t1",32.6,35.6),("t1",59.6,60.5)],
 "s05": [("t1",10.95,14.3),("t1",21.75,24.8),("launch",27.2,28.6),("launch",54.0,57.8),("t1",60.5,62.5),
         ("t1",72.85,77.3),("launch",25.8,27.1),("t1",6.6,8.4),("launch",40.0,41.6),("t1",68.7,72.8),("launch",65.5,67.8)],
 "s06": [("launch",46.3,54.0),("launch",28.7,35.7),("launch",18.0,22.3),("launch",37.3,39.7),("launch",41.6,43.5)],
 "s07": [("launch",67.9,75.5),("launch",11.2,14.4),("launch",57.8,63.3),("t1",30.0,31.0),("launch",6.0,9.3),("launch",43.5,46.2),("t1",38.0,40.0)],
 "s09": [("launch",63.3,65.5),("launch",6.0,9.3),("launch",35.7,37.3),("t1",21.7,23.3),("launch",69.0,71.5),("t1",27.4,29.0),("launch",41.6,43.5),("t1",33.0,35.6)],
 "s10": [("t1",2.8,5.0),("launch",65.5,67.8),("t1",10.95,14.3),("t1",36.0,37.4),("t1",18.4,21.7)],
}

def footage(sid, d):
    shots, acc = [], 0.0
    for src, a, b in FOOT[sid]:
        shots.append((src, a, b)); acc += (b - a) * SPEED
        if acc >= d + 0.5: break
    assert acc >= d, (sid, acc, d)
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for src, a, b in shots: cmd += ["-ss", f"{a}", "-t", f"{b-a}", "-i", f"src/{src}.mp4"]
    f = ";".join(f"[{i}:v]setpts={SPEED}*(PTS-STARTPTS),fps={FPS},scale=1920:1080:flags=lanczos,setsar=1,eq=contrast=1.06:saturation=1.08[f{i}]" for i in range(len(shots)))
    f += ";" + "".join(f"[f{i}]" for i in range(len(shots))) + f"concat=n={len(shots)}:v=1:a=0,trim=0:{d},setpts=PTS-STARTPTS[out]"
    out = f"clips/{sid}_foot.mp4"
    run(cmd + ["-filter_complex", f, "-map", "[out]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-r", str(FPS), out])
    return out

# --- video: one clip per scene ---
parts = []
for sid, d, subs in timeline:
    n = int(round(d * FPS))
    foot = sid in FOOT
    if os.path.exists(f"clips/{sid}.mp4"):
        parts.append(f"clips/{sid}.mp4"); continue
    if foot:
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", footage(sid, d)]
    else:
        cmd = ["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-t", f"{d}", "-i", f"frames/{sid}_bg.png"]
    for png, _, _ in subs: cmd += ["-i", png]
    cmd += ["-i", "frames/chrome.png"]
    if foot: cmd += ["-loop", "1", "-framerate", str(FPS), "-t", f"{d}", "-i", f"frames/{sid}_panel.png", "-i", "frames/credit.png"]
    if foot:
        k = len(subs) + 2
        f = (f"[{k}]format=rgba,fade=t=in:st=0.2:d=0.6:alpha=1,fade=t=out:st=5.2:d=0.8:alpha=1[pn];"
             f"[0][pn]overlay=shortest=1[p1];[p1][{k+1}]overlay[v0]")
    else:
        f = f"[0]scale=w='2*trunc(960*(1+0.07*n/{n}))':h=-2:eval=frame:flags=bicubic,crop=1920:1080,setsar=1[v0]"
    last = "v0"
    for k, (_, a, b) in enumerate(subs, start=1):
        f += f";[{last}][{k}]overlay=enable='between(t,{a:.3f},{b:.3f})'[v{k}]"; last = f"v{k}"
    if sid not in ("s00",):  # watermark everywhere except the title card
        f += f";[{last}][{len(subs)+1}]overlay[vw]"; last = "vw"
    f += f";[{last}]fade=t=in:st=0:d=0.5,fade=t=out:st={d-0.5:.3f}:d=0.5,format=yuv420p[out]"
    out = f"clips/{sid}.mp4"
    run(cmd + ["-filter_complex", f, "-map", "[out]", "-frames:v", str(n), "-c:v", "libx264", "-preset", "medium",
               "-crf", "18", "-r", str(FPS), out])
    parts.append(out); print("clip", sid, d)
with open("clips/list.txt", "w") as fh:
    for p in parts: fh.write(f"file '{os.path.basename(p)}'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "clips/list.txt", "-c", "copy", "clips/video.mp4"])

# --- audio: voice track placed on timeline ---
cmd = ["ffmpeg", "-v", "error", "-y"]
for a, _ in voice: cmd += ["-i", a]
f = ";".join(f"[{i}]aresample=44100,aformat=channel_layouts=stereo,adelay={int(st*1000)}|{int(st*1000)}[a{i}]" for i, (_, st) in enumerate(voice))
f += ";" + "".join(f"[a{i}]" for i in range(len(voice))) + f"amix=inputs={len(voice)}:normalize=0,apad=whole_dur={total}[v]"
run(cmd + ["-filter_complex", f, "-map", "[v]", "-t", f"{total}", "-c:a", "pcm_s16le", "clips/voice.wav"])

# --- music: extend with a crossfaded loop if needed, duck under voice ---
mlen = dur("music.mp3")
f = "[1]aformat=channel_layouts=stereo[m1];[2]aformat=channel_layouts=stereo[m2];[m1][m2]acrossfade=d=6[mm];" if mlen < total + 1 else "[1]aformat=channel_layouts=stereo[mm];"
f += (f"[mm]atrim=0:{total},volume=0.32,afade=t=in:d=1.5,afade=t=out:st={total-4.5:.2f}:d=4.5[mus];"
      "[0]asplit=2[vo][sc];"
      "[mus][sc]sidechaincompress=threshold=0.03:ratio=6:attack=80:release=600[duck];"
      "[vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11[aout]")
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/voice.wav", "-i", "music.mp3", "-i", "music.mp3",
     "-filter_complex", f, "-map", "[aout]", "-ar", "48000", "-c:a", "pcm_s16le", "clips/mix.wav"])

# --- final mux ---
run(["ffmpeg", "-v", "error", "-y", "-i", "clips/video.mp4", "-i", "clips/mix.wav", "-map", "0:v", "-map", "1:a",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", "GTA6_Bangla_Documentary.mp4"])

# --- SRT subtitles ---
def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}"
srt, k, t0 = [], 1, 0.0
for sid, d, subs in timeline:
    sc = next((s for s in script if s["id"] == sid), None)
    for i, (_, a, b) in enumerate(subs):
        srt.append(f"{k}\n{ts(t0+a+0.1)} --> {ts(t0+b-0.25)}\n{sc['lines'][i]['sub']}\n"); k += 1
    t0 += d
open("GTA6_Bangla_Documentary.srt", "w").write("\n".join(srt))
print("done", dur("GTA6_Bangla_Documentary.mp4"))
