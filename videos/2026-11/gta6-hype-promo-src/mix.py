import subprocess, sys, os
S=sys.argv[1]; out=sys.argv[2]; stems=len(sys.argv)>3
A=f"{S}/audio"
VO=[(1,0.8),(2,5.6),(3,11.0),(4,13.6),(5,20.0),(6,25.4),(7,30.4),(8,35.6),(9,41.0),(10,45.0)]
SFX=[("boom",0.2,0.45),("riser",1.56,0.8),("boom",4.6,1.0),("waves",4.75,0.32),("whoosh1",10.42,0.7),("slam",12.2,0.75),
     ("uihit",14.4,0.7),("engine",16.6,0.45),("whoosh2",19.0,0.6),("glitch",19.42,0.8),("slam",20.08,0.45),("slam",22.9,0.85),
     ("whoosh2",24.05,0.8),("boom",24.92,0.6),("uihit",25.5,0.7),("uihit",26.74,0.5),("uihit",28.24,0.7),("whoosh1",29.95,0.6),
     ("uihit",30.85,0.7),("slam",32.68,0.8),("whoosh2",34.4,0.5),("braam",35.95,0.8),("shimmer",35.95,0.8),("uihit",38.7,0.6),
     ("whoosh1",40.4,0.5),("slam",41.06,0.8),("uihit",43.62,1.0),("whoosh1",44.75,0.4),("slam",45.1,0.7),("slam",46.34,0.8),
     ("boom",47.66,1.0),("shimmer",47.66,0.7)]
inp=[]; fc=[]
def add(path): inp.extend(["-i",path]); return len(inp)//2-1
# VO bus
labs=[]
for n,t in VO:
    i=add(f"{A}/vo/vo_{n:02d}.mp3"); ms=int(t*1000)
    fc.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{n}]"); labs.append(f"[v{n}]")
fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:duration=longest,apad=whole_dur=54,"
          "highpass=f=70,equalizer=f=110:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=1.8,"
          "volume=3.2,acompressor=threshold=-16dB:ratio=3:attack=5:release=150:makeup=2,aecho=0.85:0.5:38|76:0.10|0.05,atrim=0:54[vo]")
fc.append("[vo]asplit=2[vo1][vosc]")
# music bus with break dip and ducking
i=add(f"{A}/bgm_v1.mp3")
fc.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=54,atrim=0:54,"
          "volume='0.5*(1-0.75*clip((t-19.45)/0.12,0,1)*clip((21.0-t)/0.9,0,1))*(1-0.15*clip((t-12)/2,0,1))*(1-0.38*clip((t-33.5)/1.5,0,1))':eval=frame[mus]")
fc.append("[mus][vosc]sidechaincompress=threshold=0.045:ratio=3.5:attack=25:release=450:makeup=1[musd]")
# sfx bus
labs=[]
for k,(n,t,g) in enumerate(SFX):
    i=add(f"{A}/sfx/{n}.mp3"); ms=int(t*1000)
    extra=",afade=t=out:st=4.8:d=1.2" if n=="waves" else ""
    fc.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g}{extra},adelay={ms}|{ms}[s{k}]"); labs.append(f"[s{k}]")
fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:duration=longest,apad=whole_dur=54,atrim=0:54,volume=0.65[sfx]")
if stems:
    fc.append("[vo1]anull[outvo]"); fc.append("[musd]anull[outmus]"); fc.append("[sfx]anull[outsfx]")
    maps=["-map","[outvo]",out+"_vo.wav","-map","[outmus]",out+"_mus.wav","-map","[outsfx]",out+"_sfx.wav"]
    cmd=["ffmpeg","-nostdin","-v","error","-y",*inp,"-filter_complex",";".join(fc)]+maps
else:
    fc.append("[vo1]volume=1.0[vof];[vof][musd][sfx]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.95:attack=3:release=60,afade=t=out:st=53.2:d=0.8[mix]")
    cmd=["ffmpeg","-nostdin","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[mix]","-c:a","pcm_s24le",out]
subprocess.run(cmd,check=True)
