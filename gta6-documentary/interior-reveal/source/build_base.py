import subprocess, os
G = "eq=contrast=1.10:saturation=1.15:gamma=0.95:brightness=-0.015,colorbalance=rs=-0.04:bs=0.06:rh=0.03:bh=-0.02,vignette=angle=PI/4.2,noise=alls=5:allf=t"
# (name, source, start, dur, v-center-x in 2400-wide space)
SEQ = [('p5', 'seg/p5', 0, 3.0, None), ('p1', 'seg/p1', 0, 2.95, None), ('c1', 'st/c1.mp4', 0.5, 4.4, 1200), ('c5', 'st/c5.mp4', 4.2, 4.1, 1080),
       ('c2', 'st/c2.mp4', 1.0, 5.0, 1050), ('c6a', 'st/c6.mp4', 0.0, 3.35, 850), ('c6b', 'st/c6.mp4', 8.0, 5.4, 1150),
       ('p2', 'seg/p2', 0, 2.4, None), ('p4', 'seg/p4', 0, 2.4, None), ('c4', 'st/c4.mp4', 0.0, 3.55, 1150)]
def run(a): r = subprocess.run(['ffmpeg', '-v', 'error', '-y'] + a, capture_output=True, text=True); assert r.returncode == 0, r.stderr
os.makedirs('g', exist_ok=True)
for fmt in 'hv':
    files = []
    for n, src, s, d, cx in SEQ:
        out = f'g/{n}_{fmt}.mp4'; N = int(round(d * 30))
        inp = (src + f'_{fmt}.mp4') if src.startswith('seg/') else src
        if fmt == 'h':
            vf = f"trim=start={s}:duration={d},setpts=PTS-STARTPTS,fps=30,scale=1920:1080,{G}"
        else:
            core = f"scale=1080:1350" if src.startswith('seg/') else f"scale=2400:1350,crop=1080:1350:{cx-540}:0"
            vf = (f"trim=start={s}:duration={d},setpts=PTS-STARTPTS,fps=30,split[a][b];[a]{core},{G}[m];"
                  f"[b]scale=-2:1920,crop=1080:1920,boxblur=40:2,eq=brightness=-0.22:saturation=0.8[bg];[bg][m]overlay=0:285")
        run(['-i', inp, '-filter_complex' if fmt == 'v' else '-vf', vf, '-frames:v', str(N), '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-r', '30', out])
        files.append(out)
    W, H = (1920, 1080) if fmt == 'h' else (1080, 1920)
    for n, d in [('blkA', 3.4), ('blkB', 4.05)]:
        run(['-f', 'lavfi', '-i', f'color=c=black:s={W}x{H}:r=30:d={d}', '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', f'g/{n}_{fmt}.mp4'])
    with open(f'g/list_{fmt}.txt', 'w') as f:
        for x in [f'blkA_{fmt}.mp4'] + [os.path.basename(p) for p in files] + [f'blkB_{fmt}.mp4']: f.write(f"file '{x}'\n")
    run(['-f', 'concat', '-safe', '0', '-i', f'g/list_{fmt}.txt', '-c', 'copy', f'base_{fmt}.mp4'])
    print(fmt, subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'base_{fmt}.mp4'], capture_output=True, text=True).stdout.strip())
