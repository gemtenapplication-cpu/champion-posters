#!/bin/bash
c=$1
ffmpeg -v error -y -i src/$c.mp4 -vf vidstabdetect=shakiness=8:accuracy=15:result=st/$c.trf -f null - && \
ffmpeg -v error -y -i src/$c.mp4 -vf "vidstabtransform=input=st/$c.trf:smoothing=30:zoom=6:optzoom=0,unsharp=5:5:0.5,setpts=1.25*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an -c:v libx264 -crf 14 -preset fast st/$c.mp4 && echo done $c
