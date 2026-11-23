#!/bin/sh
set -e
cd "$(dirname "$0")"
printf "file 'ov_0.mov'\nfile 'ov_1.mov'\nfile 'ov_2.mov'\nfile 'ov_3.mov'\n" > clips/ov_list.txt
ffmpeg -v error -y -f concat -safe 0 -i clips/ov_list.txt -c copy clips/overlay.mov
T=$(python3 -c "import json;print(json.load(open('timeline.json'))['total'])")
ffmpeg -v error -y -i clips/base.mp4 -i clips/overlay.mov -i clips/mix.wav \
  -filter_complex "[0:v][1:v]overlay=eof_action=pass,format=yuv420p[v]" -map "[v]" -map 2:a -t $T \
  -c:v libx264 -preset slow -crf 17 -profile:v high -r 30 -c:a aac -b:a 320k -movflags +faststart The_Story_of_GTA_VI_v3.mp4
ffprobe -v error -show_entries format=duration,size -of compact The_Story_of_GTA_VI_v3.mp4
