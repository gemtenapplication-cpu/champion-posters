#!/bin/bash
# vidstab (strong smoothing, no slow-mo) -> upright correction -> motion-interpolated 0.8x slow-mo
c=$1
ffmpeg -v error -y -i src/$c.mp4 -vf vidstabdetect=shakiness=8:accuracy=15:stepsize=4:result=st2/$c.trf -f null - && \
ffmpeg -v error -y -i src/$c.mp4 -vf "vidstabtransform=input=st2/$c.trf:smoothing=45:optalgo=gauss:zoom=5:optzoom=0:interpol=bicubic,fps=30" -an -c:v libx264 -crf 12 -preset fast st2/${c}_stab.mp4 && \
python3 rectify.py st2/${c}_stab.mp4 st2/${c}_rect.mp4 0.85 && \
ffmpeg -v error -y -i st2/${c}_rect.mp4 -vf "unsharp=5:5:0.45,setpts=1.25*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an -c:v libx264 -crf 14 -preset fast st2/$c.mp4 && echo "done $c"
