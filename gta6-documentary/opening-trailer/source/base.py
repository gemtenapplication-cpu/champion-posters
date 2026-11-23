"""Cinematic action opening trailer: GTA VI footage + Champion venue footage (stabilized), no voiceover."""
import subprocess, os, json
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D); os.makedirs("clips", exist_ok=True)
FPS = 30; T = "../inv/src/"
SRC = {"t1": T+"t1.mp4", "t2": T+"t2.mp4", "launch": T+"launch.mp4", "v1": "src/v1s.mp4", "v2": "src/v2s.mp4", "v3": "src/v3s.mp4", "v4": "src/v4s.mp4"}
GAME = ("eq=contrast=1.16:saturation=0.86:gamma=0.96,colorbalance=rs=-0.05:bs=0.09:rh=0.09:bh=-0.07,"
        "curves=all='0/0.03 0.25/0.2 0.75/0.8 1/0.97',noise=alls=7:allf=t,vignette=PI/4")
VENUE = ("eq=contrast=1.28:saturation=0.82:brightness=-0.04:gamma=0.92,colorbalance=rs=0.04:gs=0.02:bs=-0.06:rh=0.06:gh=0.04,"
         "curves=all='0/0 0.3/0.2 0.7/0.78 1/1',noise=alls=6:allf=t,vignette=PI/3.8")
# (start, end, look, shots[(src,a,b,stretch)], extra)
SECTIONS = [
 (0.0, 3.0, None, [], ""),
 (3.0, 10.0, GAME, [("t1",2.8,4.9,1.3),("t2",49.9,51.8,1.3),("t2",153.0,155.0,1.3)], ""),
 (10.0, 14.0, GAME, [("t2",6.0,8.0,1.25),("t2",143.8,145.2,1.15)], ",eq=brightness=-0.08"),
 (14.0, 24.0, GAME, [("launch",52.6,53.5,1),("t2",74.9,75.8,1),("launch",46.4,47.3,1),("t2",148.4,149.3,1),("t2",63.2,64.3,1),("t2",60.7,61.6,1),
                     ("t1",39.8,41.0,1),("t2",147.3,148.2,1),("launch",60.0,60.9,1),("t2",99.8,100.7,1),("launch",72.1,73.0,1)], ""),
 (24.0, 40.25, VENUE, [("v2",0.0,1.0,2.0),("v2",5.0,8.3,1.25),("v1",3.5,5.8,1.45),("v4",0.0,1.8,1.5),
                       ("t2",88.23,89.5,1.1),("launch",40.0,41.6,1.0),("t2",79.5,81.4,1.0)], ""),
 (40.25, 46.0, VENUE, [("v4",7.0,8.29,2.3),("v4",7.6,8.29,4.0)], ""),
 (46.0, 56.0, VENUE, [("v1",0.0,5.8,1.75)], ",gblur=sigma=14,eq=brightness=-0.12"),
]
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
parts, log = [], []
for k, (s0, s1, look, shots, extra) in enumerate(SECTIONS):
    d = round(s1 - s0, 3); out = f"clips/sec{k:02d}.mp4"; parts.append(out)
    if os.path.exists(out) and k not in (4, 5): continue
    if not shots:
        run(["ffmpeg","-v","error","-y","-f","lavfi","-i",f"color=c=black:s=1920x1080:r={FPS}:d={d}","-c:v","libx264","-preset","veryfast","-crf","16","-pix_fmt","yuv420p",out]); continue
    durs = [(b-a)*m for _,a,b,m in shots]; assert sum(durs) >= d - 0.05, (k, sum(durs), d)
    cmd = ["ffmpeg","-v","error","-y"]
    for src,a,b,m in shots: cmd += ["-ss",f"{a}","-t",f"{b-a}","-i",SRC[src]]
    f = []; t = s0
    for i,(src,a,b,m) in enumerate(shots):
        n = max(1,int(round(durs[i]*FPS)))
        slow = f"setpts={m}*(PTS-STARTPTS),framerate=fps={FPS}:interp_start=0:interp_end=255:scene=100" if m > 1 else f"setpts=PTS-STARTPTS,fps={FPS}"
        f.append(f"[{i}:v]{slow},scale=1920:1080:flags=lanczos,scale=w='2*trunc(960*(1+0.06*n/{n}))':h=-2:eval=frame,crop=1920:1080,setsar=1,format=yuv420p[f{i}]")
        log.append({"src":src,"a":a,"b":b,"m":m,"start":round(t,3)}); t += durs[i]
    f.append("".join(f"[f{i}]" for i in range(len(shots))) + f"concat=n={len(shots)}:v=1:a=0,trim=0:{d},setpts=PTS-STARTPTS,{look}{extra},format=yuv420p[out]")
    run(cmd + ["-filter_complex",";".join(f),"-map","[out]","-frames:v",str(int(round(d*FPS))),"-c:v","libx264","-preset","veryfast","-crf","15","-r",str(FPS),out])
    print("section",k,d,flush=True)
open("clips/list.txt","w").write("".join(f"file '{os.path.basename(p)}'\n" for p in parts))
run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","clips/list.txt","-c","copy","clips/base.mp4"])
json.dump(log, open("shots.json","w"), indent=0); print("base done")
