#!/bin/sh
set -e
cd "$(dirname "$0")"
printf "file 'ov_0.mov'\nfile 'ov_1.mov'\nfile 'ov_2.mov'\nfile 'ov_3.mov'\n" > clips/ov_list.txt
ffmpeg -v error -y -f concat -safe 0 -i clips/ov_list.txt -c copy clips/overlay.mov
T=$(python3 -c "import json;print(json.load(open('timeline.json'))['total'])")
ffmpeg -v error -y -i clips/base.mp4 -i clips/overlay.mov \
  -ss 443.5 -t 5.6 -i src/chase.mp4 \
  -ss 16.5 -t 4.7 -i src/gp.mp4 \
  -i clips/mix.wav -filter_complex "\
[2:v]fps=30,crop=300:176:70:12,scale=640:376:flags=lanczos,gblur=sigma=0.6,eq=saturation=0.35:contrast=1.15:brightness=-0.03,colorbalance=gs=0.12:gm=0.08,noise=alls=14:allf=t,format=yuva420p,fade=t=in:st=0:d=0.2:alpha=1,fade=t=out:st=5.35:d=0.25:alpha=1,setpts=PTS-STARTPTS+83.7/TB[cc];\
[3:v]fps=30,scale=392:697:flags=lanczos,crop=392:692:0:2,eq=contrast=1.05:saturation=1.05,format=yuva420p,fade=t=in:st=0:d=0.2:alpha=1,fade=t=out:st=4.45:d=0.25:alpha=1,setpts=PTS-STARTPTS+94.9/TB[ph];\
[0:v][cc]overlay=110:230:eof_action=pass[b1];[b1][ph]overlay=164:192:eof_action=pass[b2];[b2][1:v]overlay=eof_action=pass,format=yuv420p[v]" \
  -map "[v]" -map 4:a -t $T -c:v libx264 -preset slow -crf 17 -profile:v high -r 30 -c:a aac -b:a 256k -movflags +faststart GTA6_Investigation_Champion.mp4
ffprobe -v error -show_entries format=duration,size -of compact GTA6_Investigation_Champion.mp4
