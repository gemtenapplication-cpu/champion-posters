#!/bin/bash
cd "$(dirname "$0")"; TOT=1319
for fmt in h v; do : > clips_list_$fmt.txt; step=$(( (TOT+3)/4 ))
  for i in 0 1 2 3; do s=$((i*step)); e=$(( (i+1)*step )); [ $e -gt $TOT ] && e=$TOT
    FMT=$fmt node render2.js $s $e seg_${fmt}_$i.mp4 base_$fmt.mp4 > seg_${fmt}_$i.log 2>&1 &
    echo "file 'seg_${fmt}_$i.mp4'" >> clips_list_$fmt.txt; done; wait
  ffmpeg -v error -y -f concat -safe 0 -i clips_list_$fmt.txt -c copy vid_$fmt.mp4; echo "VID $fmt"
done
ffmpeg -v error -y -i music.mp3 -af "atrim=0:43.967,afade=t=out:st=42.9:d=1.06,loudnorm=I=-14:TP=-1.2:LRA=11" -ar 48000 bgm.wav
for fmt in h v; do ffmpeg -v error -y -i vid_$fmt.mp4 -i bgm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart final_$fmt.mp4; done
echo ALLDONE
