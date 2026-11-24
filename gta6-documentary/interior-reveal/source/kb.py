"""Ken Burns for stills with sub-pixel affine (no zoompan jitter). usage: kb.py photo out.mp4 fmt dur x0 y0 w0 x1 y1 w1  (crop windows in photo px; h aspect 16:9, v aspect 4:5)"""
import sys, subprocess, numpy as np
from PIL import Image
ph, out, fmt, dur = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]); a = list(map(float, sys.argv[5:11]))
W, H = (1920, 1080) if fmt == 'h' else (1080, 1350); asp = H / W
im = Image.open(ph).convert('RGB'); N = int(round(dur * 30))
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '30', '-i', '-', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
ease = lambda x: x * x * (3 - 2 * x)
for i in range(N):
    k = ease(i / max(1, N - 1)) * .85 + (i / max(1, N - 1)) * .15
    x, y, w = [a[j] + (a[j + 3] - a[j]) * k for j in range(3)]; h = w * asp; s = w / W
    fr = im.transform((W, H), Image.AFFINE, (s, 0, x, 0, s, y), resample=Image.BICUBIC)
    p.stdin.write(fr.tobytes())
p.stdin.close(); p.wait()
