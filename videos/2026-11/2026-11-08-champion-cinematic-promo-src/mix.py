import subprocess, json, sys, numpy as np
B0,BT=6.88,0.4291
B=lambda k: B0+BT*k
ms=lambda t: int(round(t*1000))
VOFX="highpass=f=60,equalizer=f=110:t=q:w=1:g=4,equalizer=f=3200:t=q:w=1.5:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=3,asetrate=44100*0.945,aresample=44100,atempo=1.0582,aecho=0.85:0.5:38|71|113|167:0.22|0.16|0.11|0.07"
inputs=['music_b.mp3','vo_david_v2.mp3','vo_tag.mp3','sfx_neon.mp3','sfx_braam.mp3','sfx_whoosh.mp3','sfx_glitch.mp3','sfx_hit.mp3','sfx_final.mp3','sfx_suck.mp3']
f=[]
f.append(f"[1:a]aresample=44100,{VOFX},adelay={ms(1.40)}|{ms(1.40)},volume=1.6[vo1]")
f.append(f"[2:a]aresample=44100,{VOFX},asplit=3[tg1][tg2][tg3]")
for src,lab,(a,b,onset,beat) in zip(('tg1','tg2','tg3'),('tga','tgb','tgc'),[(0.0,1.0,0.10,B(22)),(1.40,2.80,0.20,B(25)),(3.00,4.30,0.22,B(28))]):
    st=beat-onset
    f.append(f"[{src}]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=out:st={b-a-0.12:.3f}:d=0.12,adelay={ms(st)}|{ms(st)},volume=1.6[{lab}]")
f.append("[vo1][tga][tgb][tgc]amix=inputs=4:normalize=0:duration=longest,apad=whole_dur=25,asplit=3[vomix][vosc][vosc2]")
f.append("[0:a]aresample=44100,volume=0.85[mus]")
f.append("[mus][vosc]sidechaincompress=threshold=0.03:ratio=5:attack=15:release=280:makeup=1[musd]")
def place(inp, times, vol, label):
    n=len(times)
    if n==1:
        f.append(f"[{inp}:a]aresample=44100,volume={vol},adelay={ms(times[0])}|{ms(times[0])}[{label}]"); return
    outs=''.join(f'[{label}s{k}]' for k in range(n))
    f.append(f"[{inp}:a]aresample=44100,volume={vol},asplit={n}{outs}")
    for k,t in enumerate(times): f.append(f"[{label}s{k}]adelay={ms(t)}|{ms(t)}[{label}{k}]")
    f.append(''.join(f'[{label}{k}]' for k in range(n))+f"amix=inputs={n}:normalize=0[{label}]")
place(3,[0.0],0.55,'neon')
place(4,[3.0],0.6,'braam')
place(5,[3.0-0.19, B(0)-0.19, B(14)-0.19, B(18)-0.19, B(30)-0.19],0.38,'wh')
place(6,[4.56, B(12)],0.5,'gl')
place(7,[B(0),B(22),B(25),B(28),B(30)],0.55,'hit')
place(8,[B(30)],0.6,'fin')
place(9,[B(0)-1.35],0.55,'suck')
f.append("[neon][braam][wh][gl][hit][fin][suck]amix=inputs=7:normalize=0:duration=longest,apad=whole_dur=25[sfxr]")
f.append("[sfxr][vosc2]sidechaincompress=threshold=0.03:ratio=3:attack=8:release=220:makeup=1[sfxd]")
STEMS = len(sys.argv)>1 and sys.argv[1]=='stems'
if STEMS:
    pass
else:
    f.append("[musd][vomix][sfxd]amix=inputs=3:normalize=0:duration=longest,atrim=0:25,asetpts=PTS-STARTPTS[mix]")
graph=';'.join(f)
cmd=['ffmpeg','-v','error','-y']
for i in inputs: cmd+=['-i',i]
if STEMS:
    subprocess.run(cmd+['-filter_complex',graph]+sum([['-map',f'[{k}]','-ac','1','-ar','22050','-f','f32le',f'stem_{n}.raw'] for k,n in (('musd','mus'),('vomix','vo'),('sfxd','sfx'))],[]),check=True)
    st={k:np.fromfile(f'stem_{k}.raw',np.float32) for k in ('mus','vo','sfx')}
    db=lambda x: 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
    for name,(a,b) in {'welcome':(1.45,2.2),'champion':(3.0,3.9),'play':(16.3,16.9),'connect':(17.6,18.3),'win':(18.9,19.5),'drop':(6.88,7.5),'endhit':(19.75,20.5)}.items():
        s=slice(int(a*22050),int(b*22050))
        print(f"{name:9s} vo {db(st['vo'][s]):6.1f}  music {db(st['mus'][s]):6.1f}  sfx {db(st['sfx'][s]):6.1f}")
    sys.exit()
subprocess.run(cmd+['-filter_complex',graph,'-map','[mix]','-c:a','pcm_f32le','-ar','44100','mix_raw.wav'],check=True)
r=subprocess.run(['ffmpeg','-hide_banner','-i','mix_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
m=json.loads(r[r.rindex('{'):r.rindex('}')+1]); print('measured', m['input_i'], m['input_tp'], m['input_lra'])
af=(f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
    "alimiter=limit=0.84:attack=3:release=60:level=disabled,afade=t=out:st=24.35:d=0.65")
subprocess.run(['ffmpeg','-v','error','-y','-i','mix_raw.wav','-af',af,'-ar','48000','-c:a','pcm_s16le','mix_final.wav'],check=True)
r=subprocess.run(['ffmpeg','-hide_banner','-i','mix_final.wav','-af','loudnorm=print_format=json','-f','null','-'],capture_output=True,text=True).stderr
m=json.loads(r[r.rindex('{'):r.rindex('}')+1]); print('final', m['input_i'], 'LUFS  TP', m['input_tp'])
