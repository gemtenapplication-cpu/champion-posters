set -e
S=../trailer/src
# one ~30s venue loop, graded + softened, then looped to 260s
ffmpeg -v error -y -i $S/v2s.mp4 -i $S/v1s.mp4 -i $S/v4s.mp4 -i $S/v3s.mp4 -filter_complex \
"[0:v]setpts=1.6*(PTS-STARTPTS),fps=30,scale=1920:1080,setsar=1[a];[1:v]setpts=1.6*(PTS-STARTPTS),fps=30,scale=1920:1080,setsar=1[b];[2:v]setpts=1.6*(PTS-STARTPTS),fps=30,scale=1920:1080,setsar=1[c];[3:v]setpts=1.6*(PTS-STARTPTS),fps=30,scale=1920:1080,setsar=1[d];\
[a][b]xfade=transition=fade:duration=1:offset=12.3[ab];[ab][c]xfade=transition=fade:duration=1:offset=20.7[abc];[abc][d]xfade=transition=fade:duration=1:offset=33.0[out0];\
[out0]eq=contrast=1.1:saturation=0.75:brightness=-0.06,colorbalance=bs=0.08:bm=0.05,gblur=sigma=3,vignette=PI/3.5,format=yuv420p[out]" \
 -map "[out]" -c:v libx264 -preset veryfast -crf 20 loop_h.mp4
ffmpeg -v error -y -i loop_h.mp4 -vf "scale=-2:1920,crop=1080:1920,format=yuv420p" -c:v libx264 -preset veryfast -crf 20 loop_v.mp4
for f in h v; do ffmpeg -v error -y -stream_loop 6 -i loop_$f.mp4 -t 260 -c copy base_$f.mp4; done
ffprobe -v error -show_entries format=duration -of csv=p=0 loop_h.mp4 base_h.mp4 base_v.mp4
