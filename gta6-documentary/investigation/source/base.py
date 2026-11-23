"""Builds the footage base layer (no text): graded trailer shots cut to the narration timeline."""
import json, subprocess, os
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
os.makedirs("clips", exist_ok=True)
FPS = 30
TOTAL = json.load(open("timeline.json"))["total"]

# (section_start, section_end, look, [(src, a, b, stretch)])  stretch>1 = slow motion
SECTIONS = [
 (0.0, 14.6, "dark", [("launch",28.6,30.0,1.25),("t1",5.0,6.5,1.25),("t2",49.9,51.8,1.25),("launch",33.0,34.3,1.25),
                     ("t1",2.8,4.9,1.25),("launch",64.6,65.6,1.25),("t2",120.0,122.0,1.25),("t1",31.2,32.5,1.25)]),
 (14.6, 17.6, "title", [("t2",103.4,106.7,1)]),
 (17.6, 47.5, "grade", [("gtav",15.0,16.6,1),("gtav",7.0,8.3,1),                                  # l01 rockstar
                       ("gtav",22.85,25.3,1),("gtav",34.55,36.6,1),("gtav",51.7,53.1,1),("gtav",32.8,33.8,1),   # l02 an open city
                       ("t1",39.8,41.3,1),("t1",25.0,27.4,1),("t1",37.45,39.7,1),("t2",38.4,39.85,1),   # l03 vice city era
                       ("gtav",39.4,42.4,1),("gtav",46.6,47.65,1),("gtav",67.1,67.65,1),                 # l04 GTA V
                       ("t2",79.5,81.4,1),("t2",81.4,83.1,1),("t2",88.3,88.6,1),                         # l04 storytelling
                       ("t1",36.0,37.4,1),("t2",20.5,23.2,1)]),                                          # l05
 (47.5, 64.8, "grade", [("t2",6.0,8.0,1),("t1",31.0,32.5,1),("t1",33.0,34.1,1),("t1",11.0,14.3,1),("t1",19.2,21.7,1),
                       ("t2",8.2,9.8,1),("t2",34.7,38.3,1),("t2",139.2,140.0,1),("t2",141.9,142.6,1),("launch",13.5,14.4,1)]),
 (64.8, 80.0, "grade", [("t2",60.6,63.0,1),("t2",63.15,66.15,1),("t2",66.25,69.0,1),("t2",111.35,112.5,1),("t2",94.5,96.1,1),
                       ("t2",27.0,29.5,1),("t2",150.0,151.5,1),("t2",97.7,98.4,1)]),
 (80.0, 100.0, "grade", [("t2",45.3,47.5,1),("t1",21.75,23.2,1),("launch",46.3,49.0,1),("t2",90.4,92.0,1),("t2",148.3,150.0,1),
                        ("t2",74.8,75.85,1),("t2",76.0,76.6,1),("t2",106.8,108.3,1),("launch",57.8,60.4,1),
                        ("t2",124.6,125.7,1),("t1",42.4,44.9,1),("t2",129.4,131.0,1)]),
 (100.0, 110.3, "grade", [("launch",54.0,57.0,1),("t2",141.9,143.7,1),("launch",52.5,54.0,1),("t2",147.3,148.2,1),
                         ("launch",65.5,67.8,1),("t1",13.5,14.3,1)]),
 (110.3, 116.0, "dark", [("t2",87.0,88.2,1.6),("launch",69.1,70.2,1.6),("t2",121.0,122.0,1.6),("t1",72.9,73.5,1.6)]),
 (116.0, TOTAL, "promo", [("launch",2.1,9.0,1),("t2",99.7,103.0,1),("t2",139.2,141.8,1),("t2",92.0,96.0,1),("launch",9.3,12.0,1),
                         ("t2",9.8,13.6,1),("t2",112.5,115.5,1),("t2",153.0,156.0,1)]),
]
INTRO = (0.0, 3.0, "intro", [("t2",143.8,146.8,1)])


LOOK = {
 # cinematic investigation grade: teal shadows / warm highlights, crushed contrast, grain, vignette
 "grade": "eq=contrast=1.12:saturation=0.9:gamma=0.97,colorbalance=rs=-0.04:bs=0.06:rh=0.05:bh=-0.04,noise=alls=7:allf=t,vignette=PI/4.2",
 "dark":  "eq=contrast=1.15:saturation=0.55:brightness=-0.06,colorbalance=bs=0.08:bm=0.04,noise=alls=9:allf=t,vignette=PI/3.6",
 "title": "eq=contrast=1.2:saturation=0.5:brightness=-0.1,colorbalance=rs=0.15:rm=0.05:bs=-0.05,noise=alls=10:allf=t,vignette=PI/3.4",
 "promo": "eq=contrast=1.08:saturation=1.0:brightness=-0.06,colorbalance=bs=0.06:bh=0.04,vignette=PI/4",
 "intro": "eq=contrast=1.15:saturation=0.75:brightness=-0.12,colorbalance=bs=0.1:bm=0.05,noise=alls=8:allf=t,vignette=PI/3.5",
}

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2500:]); raise SystemExit(1)

parts = []
for k, (s0, s1, look, shots) in list(enumerate(SECTIONS)) + [(99, INTRO)]:
    if k == 99:
        (s0, s1, look, shots) = INTRO
    d = round(s1 - s0, 3); out = f"clips/sec{k:02d}.mp4"
    if k != 99: parts.append(out)
    if os.path.exists(out): continue
    if look == "black":
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s=1920x1080:r={FPS}:d={d}",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", out]); continue
    acc = sum((b - a) * m for _, a, b, m in shots); assert acc >= d - 0.05, (k, acc, d)
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for src, a, b, m in shots: cmd += ["-ss", f"{a}", "-t", f"{b-a}", "-i", f"src/{src}.mp4"]
    f = ";".join(f"[{i}:v]setpts={m}*(PTS-STARTPTS),fps={FPS},scale=1920:1080:flags=lanczos,setsar=1[f{i}]" for i, (_, _, _, m) in enumerate(shots))
    f += ";" + "".join(f"[f{i}]" for i in range(len(shots))) + f"concat=n={len(shots)}:v=1:a=0,trim=0:{d},setpts=PTS-STARTPTS,{LOOK[look]},format=yuv420p[out]"
    run(cmd + ["-filter_complex", f, "-map", "[out]", "-frames:v", str(int(round(d * FPS))), "-c:v", "libx264",
               "-preset", "veryfast", "-crf", "16", "-r", str(FPS), out])
    print("section", k, look, d)
with open("clips/base_list.txt", "w") as fh:
    for p in parts: fh.write(f"file '{os.path.basename(p)}'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "clips/base_list.txt", "-c", "copy", "clips/base.mp4"])
print("base done")
