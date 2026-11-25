#!/bin/bash
cd "$(dirname "$0")"; TOT=$(python3 -c "import json,math;print(math.ceil(json.load(open('timeline.json'))['total']*30))")
for fmt in h v; do : > clips/list_$fmt.txt; N=4; step=$(( (TOT+N-1)/N ))
  for i in $(seq 0 $((N-1))); do s=$((i*step)); e=$(( (i+1)*step )); [ $e -gt $TOT ] && e=$TOT
    FMT=$fmt node render2.js $s $e clips/seg_${fmt}_$i.mp4 base_$fmt.mp4 > clips/seg_${fmt}_$i.log 2>&1 &
    echo "file 'seg_${fmt}_$i.mp4'" >> clips/list_$fmt.txt; done; wait
  ffmpeg -v error -y -f concat -safe 0 -i clips/list_$fmt.txt -i clips/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart clips/final_$fmt.mp4
  echo "DONE $fmt $(ffprobe -v error -show_entries format=duration -of csv=p=0 clips/final_$fmt.mp4)"
done
