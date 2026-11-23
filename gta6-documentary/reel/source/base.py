"""9:16 reel base: footage in a 1080x1000 centre band with a blurred fill of the same shot behind it."""
import json, subprocess, os
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
os.makedirs("clips", exist_ok=True)
FPS = 30
TL = json.load(open("timeline.json")); TOTAL = TL["total"]
S = "../inv/src/"
SRC = {"t1": S + "t1.mp4", "t2": S + "t2.mp4", "launch": S + "launch.mp4", "gtav": S + "gtav.mp4"}
PRECROP = {"t2": "crop=1280:536:0:92,"}           # trailer 2 is letterboxed inside 16:9
# shot list in story order: (src, a, b, stretch)
SHOTS = [("t2",143.8,145.5,1.0),                                            # presents
         ("t1",5.0,6.5,1.25),("t2",49.9,51.8,1.25),("t1",2.8,4.9,1.2),       # r1-r2
         ("t2",6.0,8.0,1.15),                                               # title
         ("gtav",39.4,42.4,1.0),("gtav",46.6,47.65,1.0),                    # r3
         ("t1",6.6,10.9,1.0),("t1",13.5,14.3,1.0),                          # r4
         ("t1",33.0,34.1,1.0),("t1",19.2,21.7,1.0),("t1",36.0,37.4,1.0),     # r5
         ("t2",63.15,66.15,1.0),("t2",60.6,62.0,1.0),                       # r6
         ("launch",9.3,12.5,1.0),("launch",52.5,54.0,1.0),("t2",147.3,148.2,1.0),("launch",18.0,20.0,1.0),  # r7
         ("launch",65.6,69.0,1.0),                                          # r8
         ("t2",99.7,103.0,1.0),("t2",139.2,141.8,1.0),("launch",2.1,6.0,1.0),("t2",38.4,41.6,1.0),
         ("t2",92.0,96.0,1.0),("gtav",17.1,18.7,1.0),("t1",21.75,24.8,1.0),("t2",153.0,156.0,1.0),("launch",70.5,75.0,1.0)]
GRADE = ("eq=contrast=1.14:saturation=0.9:gamma=0.97,colorbalance=rs=-0.05:bs=0.08:rh=0.08:bh=-0.06,"
         "curves=all='0/0.03 0.25/0.2 0.75/0.8 1/0.97',noise=alls=6:allf=t")

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)

durs = [(b - a) * m for _, a, b, m in SHOTS]
assert sum(durs) >= TOTAL, (sum(durs), TOTAL)
cmd = ["ffmpeg", "-v", "error", "-y"]
for src, a, b, m in SHOTS: cmd += ["-ss", f"{a}", "-t", f"{b-a}", "-i", SRC[src]]
f = []
for i, (src, a, b, m) in enumerate(SHOTS):
    n = max(1, int(round(durs[i] * FPS))); pc = PRECROP.get(src, "")
    f.append(f"[{i}:v]setpts={m}*(PTS-STARTPTS),fps={FPS},{pc}split[a{i}][b{i}];"
             f"[a{i}]scale=-2:1920,crop=1080:1920,gblur=sigma=38,eq=brightness=-0.28:saturation=0.75[bg{i}];"
             f"[b{i}]scale=-2:h='2*trunc(500*(1+0.07*n/{n}))':eval=frame:flags=bicubic,crop=1080:1000[fg{i}];"
             f"[bg{i}][fg{i}]overlay=0:460,setsar=1,format=yuv420p[s{i}]")
f.append("".join(f"[s{i}]" for i in range(len(SHOTS))) + f"concat=n={len(SHOTS)}:v=1:a=0,trim=0:{TOTAL},setpts=PTS-STARTPTS,{GRADE},format=yuv420p[out]")
run(cmd + ["-filter_complex", ";".join(f), "-map", "[out]", "-frames:v", str(int(round(TOTAL * FPS))), "-c:v", "libx264",
           "-preset", "veryfast", "-crf", "16", "-r", str(FPS), "clips/base.mp4"])
# shot log (for footage-synced sfx)
t, log = 0.0, []
for (src, a, b, m), d in zip(SHOTS, durs):
    log.append({"src": src, "a": a, "b": b, "m": m, "start": round(t, 3), "dur": round(d, 3)}); t += d
json.dump(log, open("shots.json", "w"), indent=0)
print("base done", round(sum(durs), 2), "of", TOTAL)
