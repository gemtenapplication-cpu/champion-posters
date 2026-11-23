"""Footage base layer, Voice-of-Dhaka-style: teal/orange grade, slow push-ins, dissolves in story parts,
hard cuts in action montages. Every frame is real game footage (except the black 'Presents' card)."""
import json, subprocess, os, sys
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
os.makedirs("clips", exist_ok=True)
FPS = 30
TOTAL = json.load(open("timeline.json"))["total"]
S = "../inv/src/"

# (start, end, xfade_seconds, [(src, a, b, stretch)])
SECTIONS = [
 (0.0, 3.5, None, []),                                   # black "Champion Presents"
 (3.5, 8.0, 0.0, [("launch",52.6,53.4,1),("t2",74.9,75.8,1),("launch",46.4,47.2,1),("t2",148.4,149.2,1),("t2",147.3,148.1,1),("gtav",67.1,67.9,1)]),
 (8.0, 27.4, 0.45, [("t1",2.8,4.9,1.3),("t1",5.0,6.5,1.3),("t2",49.9,51.8,1.3),("t2",153.0,156.0,1.25),("launch",28.6,30.0,1.3),
                    ("t2",120.0,122.0,1.25),("t1",31.0,32.5,1.3),("launch",64.6,65.6,1.3),("t2",82.5,85.0,1.25),("t2",98.47,99.6,1.25)]),
 (27.4, 36.8, 0.45, [("t2",6.0,8.0,1.25),("t1",11.0,13.0,1.25),("t2",143.8,147.3,1.25)]),
 (36.8, 82.4, 0.4, [("gtav",15.0,16.6,1.3),("gtav",7.0,9.0,1.3),("gtav",22.85,27.2,1.1),("gtav",32.8,36.6,1.1),("gtav",51.7,54.3,1.1),
                    ("t1",37.45,41.3,1.1),("t1",24.85,27.4,1.1),("gtav",18.75,19.9,1.1),
                    ("gtav",39.4,44.3,1.1),("gtav",46.6,49.6,1.1),("gtav",62.6,67.0,1.1),("gtav",17.1,18.7,1.1),("gtav",29.8,31.3,1.1),
                    ("gtav",55.6,59.1,1.1),("gtav",67.1,70.6,1.1),("t2",153.0,155.5,1.2)]),
 (82.4, 116.8, 0.4, [("t2",85.1,88.2,1.25),("launch",69.1,72.0,1.25),("t2",120.0,123.0,1.2),("t1",72.9,76.4,1.15),("t2",106.8,110.5,1.1),
                     ("launch",52.5,54.4,1.0),("launch",59.3,62.4,1.0),("t1",42.4,46.5,1.1),("t2",129.4,134.4,1.05),
                     ("launch",32.97,35.7,1.2),("t2",103.4,106.7,1.15),("t2",41.6,45.2,1.1)]),
 (116.8, 137.4, 0.35, [("t1",10.95,14.3,1.1),("t1",6.6,10.9,1.1),("t1",18.4,24.8,1.05),("t1",27.45,30.0,1.1),("t1",33.0,34.1,1.1),
                       ("t1",31.0,32.5,1.1),("t1",39.8,41.3,1.15),("t1",2.8,4.9,1.1)]),
 (137.4, 172.5, 0.35, [("t2",34.7,38.3,1.1),("t2",6.0,9.8,1.05),("t1",36.0,37.4,1.1),("launch",2.1,6.0,1.05),("t2",126.73,129.3,1.0),
                       ("t2",138.2,141.8,1.0),("launch",27.2,28.7,1.0),("launch",54.0,57.8,1.0),("t2",148.3,151.5,1.0),
                       ("t2",45.3,49.8,1.0),("launch",46.3,49.0,1.0),("t2",90.4,92.0,1.0),("launch",38.3,41.6,1.0)]),
 (172.5, 210.6, 0.35, [("t2",79.5,83.1,1.15),("t2",88.23,89.5,1.1),("t2",115.5,117.1,1.1),("t2",63.15,66.15,1.1),("t2",111.3,112.5,1.1),
                       ("t2",94.5,96.1,1.1),("t2",60.6,63.0,1.1),("t2",66.25,69.0,1.1),("launch",25.8,27.1,1.1),("launch",40.0,41.6,1.1),
                       ("launch",43.5,44.4,1.1),("t2",27.0,32.0,1.0),("t2",74.8,76.6,1.0),("launch",57.8,59.2,1.0),("t1",68.7,70.2,1.0),
                       ("launch",72.1,73.1,1.0),("t2",97.7,99.6,1.0),("gpv",16.5,21.2,1.0),("t1",44.9,47.5,1.0),("t2",92.0,94.4,1.0),("t2",118.83,119.6,1.0)]),
 (210.6, 234.5, 0.4, [("t2",83.1,85.0,1.2),("t2",153.0,156.0,1.2),("t2",9.8,15.5,1.05),("t2",99.7,103.0,1.0),("t2",141.9,143.7,1.0),
                      ("t2",147.3,148.2,1.0),("t2",18.9,20.4,1.0),("t2",23.3,27.0,1.0),("t2",119.63,124.5,1.0)]),
 (234.5, 271.6, 0.35, [("launch",65.6,69.0,1.15),("launch",9.3,14.4,1.05),("launch",18.0,22.3,1.05),("launch",36.0,37.3,1.05),
                       ("launch",49.0,50.5,1.0),("launch",61.0,63.3,1.0),("launch",70.5,75.0,1.05),("t1",59.6,62.5,1.05),("t1",70.3,72.8,1.05),
                       ("t2",144.0,147.3,1.0),("launch",41.67,43.5,1.0),("t2",112.5,115.5,1.0),("launch",6.0,9.3,1.0),("launch",32.13,32.97,1.0),("t1",13.5,14.3,1.1)]),
 (271.6, TOTAL, 0.4, [("t2",153.0,156.0,1.2),("t2",38.4,41.6,1.0),("gtav",17.08,18.72,1.0),("t1",21.75,24.8,1.0),("launch",2.1,6.0,1.0),
                      ("t2",99.7,103.0,1.0),("launch",18.0,20.5,1.0),("t2",139.2,141.8,1.0),("t1",11.0,14.3,1.0),("t2",6.0,8.0,1.0),
                      ("gtav",32.8,34.4,1.0),("t2",126.73,129.3,1.0),("launch",54.0,56.4,1.0),("t1",18.4,21.7,1.0),("gtav",7.0,9.0,1.0),("gtav",62.6,64.3,1.0)]),
]
SRC = {"t1": S + "t1.mp4", "t2": S + "t2.mp4", "launch": S + "launch.mp4", "gtav": S + "gtav.mp4", "gpv": S + "gp.mp4"}
GRADE = ("eq=contrast=1.16:saturation=0.86:gamma=0.96,"
         "colorbalance=rs=-0.05:gs=0.0:bs=0.09:rm=0.02:bm=-0.02:rh=0.09:gh=0.02:bh=-0.07,"
         "curves=all='0/0.03 0.25/0.2 0.75/0.8 1/0.97',noise=alls=8:allf=t,vignette=PI/4")

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)

only = set(sys.argv[1:])
parts = []
for k, (s0, s1, xd, shots) in enumerate(SECTIONS):
    d = round(s1 - s0, 3); out = f"clips/sec{k:02d}.mp4"; parts.append(out)
    if os.path.exists(out) and (not only or str(k) not in only): continue
    if not shots:
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s=1920x1080:r={FPS}:d={d}",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", out]); continue
    xd = xd or 0.0
    durs = [(b - a) * m for _, a, b, m in shots]
    need = d + xd * (len(shots) - 1)
    if sum(durs) < need + 0.1: print('WARN loop in section', k, round(sum(durs)-need,2), flush=True)
    while sum(durs) < need + 0.1:   # loop the list if short
        shots = shots + shots; durs = durs + durs
    # drop trailing shots that are not needed
    acc, keep = 0, []
    for i, dd in enumerate(durs):
        keep.append(i); acc += dd - (xd if i else 0)
        if acc >= d + 0.05: break
    shots = [shots[i] for i in keep]; durs = [durs[i] for i in keep]
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for src, a, b, m in shots: cmd += ["-ss", f"{a}", "-t", f"{b-a}", "-i", SRC[src]]
    f = []
    for i, (src, a, b, m) in enumerate(shots):
        n = max(1, int(round(durs[i] * FPS)))
        if src == "gpv":   # vertical gameplay: blurred fill + sharp centre
            f.append(f"[{i}:v]setpts={m}*(PTS-STARTPTS),fps={FPS},split[g{i}a][g{i}b];[g{i}a]scale=1920:3414,crop=1920:1080,gblur=sigma=30,eq=brightness=-0.15[g{i}bg];"
                     f"[g{i}b]scale=-2:804[g{i}fg];[g{i}bg][g{i}fg]overlay=(W-w)/2:138,setsar=1,format=yuv420p[f{i}]")
        else:
            f.append(f"[{i}:v]setpts={m}*(PTS-STARTPTS),fps={FPS},scale=1920:1080:flags=lanczos,"
                     f"scale=w='2*trunc(960*(1+0.06*n/{n}))':h=-2:eval=frame,crop=1920:1080,setsar=1,format=yuv420p[f{i}]")
    if xd > 0:
        last, off = "f0", durs[0] - xd
        for i in range(1, len(shots)):
            f.append(f"[{last}][f{i}]xfade=transition=fade:duration={xd}:offset={off:.3f}[x{i}]"); last = f"x{i}"; off += durs[i] - xd
    else:
        f.append("".join(f"[f{i}]" for i in range(len(shots))) + f"concat=n={len(shots)}:v=1:a=0[x0]"); last = "x0"
    f.append(f"[{last}]trim=0:{d},setpts=PTS-STARTPTS,{GRADE},format=yuv420p[out]")
    run(cmd + ["-filter_complex", ";".join(f), "-map", "[out]", "-frames:v", str(int(round(d * FPS))), "-c:v", "libx264",
               "-preset", "veryfast", "-crf", "16", "-r", str(FPS), out])
    print("section", k, d, len(shots), "shots", flush=True)
with open("clips/base_list.txt", "w") as fh:
    for p in parts: fh.write(f"file '{os.path.basename(p)}'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "clips/base_list.txt", "-c", "copy", "clips/base.mp4"])
print("base done")
