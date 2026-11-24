"""Retypeset a text run (cursor smudge / wording removal): fill box with bg, redraw with Inter."""
from PIL import Image, ImageFont, ImageDraw
import numpy as np
FD='/usr/share/fonts/opentype/inter/Inter-%s.otf'
DARK=(58,58,66); BLUE=(37,99,235)
def retype(im, x0, x1, y0, y1, runs, size=None, fitto=None):
    """runs: [(text,color,weight)]. size fitted so that `fitto` runs (orig text) span x0..x1."""
    a=np.array(im.convert('L')).astype(int); rows=np.where((a[y0:y1,x0:x1]<170).any(1))[0]
    bg=im.getpixel((min(x1+8,im.width-1),y0+1))
    fr=fitto or runs
    if size is None:
        lo,hi=8.0,20.0
        for _ in range(30):
            m=(lo+hi)/2; w=sum(ImageFont.truetype(FD%(r[2] if len(r)>2 else 'Regular'),m).getlength(r[0]) for r in fr)
            (lo,hi)=(m,hi) if w<(x1-x0) else (lo,m)
        size=lo
    d=ImageDraw.Draw(im); d.rectangle([x0-1,y0,x1+3,y1],fill=bg)
    f0=ImageFont.truetype(FD%'Regular',size); top=y0+rows.min(); asc=f0.getbbox('T')[1]; x=x0
    for r in runs:
        f=ImageFont.truetype(FD%(r[2] if len(r)>2 else 'Regular'),size); d.text((x,top-asc),r[0],font=f,fill=r[1]); x+=f.getlength(r[0])
    return size
