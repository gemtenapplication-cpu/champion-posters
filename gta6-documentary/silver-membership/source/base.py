"""Promo base layers (16:9 and 9:16) from one shot list."""
import json, subprocess, os, sys
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D); os.makedirs("clips", exist_ok=True)
FPS = 30; TOTAL = json.load(open("timeline.json"))["total"]; T = "../inv/src/"
SRC = {"t1": T+"t1.mp4", "t2": T+"t2.mp4", "launch": T+"launch.mp4", "v1": "../trailer/src/v1s.mp4", "v2": "../trailer/src/v2s.mp4", "v4": "../trailer/src/v4s.mp4"}
PRE = {"t2": "crop=1280:536:0:92,"}
SHOTS = [("v4",7.0,8.29,1.3),                                                       # logo intro (welcome banner)
         ("v2",5.0,8.3,1.0),("t2",79.5,81.4,1.0),                                    # play at champion
         ("t2",6.0,8.0,1.0),("t1",33.0,34.1,1.0),("launch",65.6,67.8,1.0),           # silver member 10%
         ("t2",88.23,89.5,1.0),("launch",40.0,41.6,1.0),("v4",0.0,1.8,1.4),("t2",115.5,117.1,1.0),  # no fee / account
         ("t1",21.75,24.8,1.0),("t2",139.2,141.8,1.0),                               # points / book ahead
         ("launch",2.1,6.0,1.0),("t2",153.0,156.0,1.0),("launch",9.3,12.5,1.0),("t1",11.0,14.3,1.0),
         ("t2",38.4,41.6,1.0),("v1",3.5,5.8,1.5),("v2",5.5,8.3,1.3)]
GRADE = "eq=contrast=1.15:saturation=1.05:gamma=0.97,colorbalance=rs=-0.03:bs=0.07:rh=0.07:bh=-0.05,curves=all='0/0.02 0.25/0.2 0.75/0.8 1/0.98'"
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-3000:]); raise SystemExit(1)
durs = [(b-a)*m for _,a,b,m in SHOTS]; assert sum(durs) >= TOTAL, (sum(durs), TOTAL)
for fmt in sys.argv[1:] or ["h", "v"]:
    cmd = ["ffmpeg","-v","error","-y"]
    for s,a,b,m in SHOTS: cmd += ["-ss",f"{a}","-t",f"{b-a}","-i",SRC[s]]
    f = []
    for i,(s,a,b,m) in enumerate(SHOTS):
        n = max(1,int(round(durs[i]*FPS)))
        sl = f"setpts={m}*(PTS-STARTPTS),framerate=fps={FPS}:interp_start=0:interp_end=255:scene=100" if m > 1 else f"setpts=PTS-STARTPTS,fps={FPS}"
        if fmt == "h":
            f.append(f"[{i}:v]{sl},scale=1920:1080,scale=w='2*trunc(960*(1+0.07*n/{n}))':h=-2:eval=frame,crop=1920:1080,setsar=1,format=yuv420p[s{i}]")
        else:
            pc = PRE.get(s, "")
            f.append(f"[{i}:v]{sl},{pc}split[a{i}][b{i}];[a{i}]scale=-2:1920,crop=1080:1920,gblur=sigma=38,eq=brightness=-0.28:saturation=0.8[bg{i}];"
                     f"[b{i}]scale=-2:h='2*trunc(500*(1+0.07*n/{n}))':eval=frame,crop=1080:1000[fg{i}];[bg{i}][fg{i}]overlay=0:460,setsar=1,format=yuv420p[s{i}]")
    f.append("".join(f"[s{i}]" for i in range(len(SHOTS))) + f"concat=n={len(SHOTS)}:v=1:a=0,trim=0:{TOTAL},setpts=PTS-STARTPTS,{GRADE},format=yuv420p[out]")
    run(cmd + ["-filter_complex",";".join(f),"-map","[out]","-frames:v",str(int(round(TOTAL*FPS))),"-c:v","libx264","-preset","veryfast","-crf","15","-r",str(FPS),f"clips/base_{fmt}.mp4"])
    print("base", fmt, "done", flush=True)
t, log = 0.0, []
for (s,a,b,m),d in zip(SHOTS,durs): log.append({"src":s,"a":a,"b":b,"m":m,"start":round(t,3)}); t += d
json.dump(log, open("shots.json","w"), indent=0)
