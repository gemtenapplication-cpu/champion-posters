#!/usr/bin/env bash
# Builds the Champion opening trailer end to end.
#   ./make.sh en <piper_voice.onnx> <frames_dir>   English: Piper TTS (en_US-ryan-high)          -> champion-opening-trailer-1080p.mp4
#   VOICE=rayhan ./make.sh bn <frames_dir>         Bangla: ElevenLabs eleven_v3, voice Rayhan (or rakib),
#                                                  on-screen text in Tiro Bangla                  -> champion-opening-trailer-bangla-1080p.mp4
# The Bangla cut reuses the English cut (build/timings.json) as its design timeline, so build English first.
# Steps: vo.py (voice-over on the timeline) -> score.py (original score, ducked) -> frames.js (renders trailer.html
# frame by frame, 1920x1080 30 fps) -> ffmpeg (H.264 + AAC, -14 LUFS, faststart).
set -euo pipefail
cd "$(dirname "$0")"
LANG_CODE="$1"; shift
if [ "$LANG_CODE" = en ]; then python3 vo.py en "$1"; shift; BUILD=build; OUT=champion-opening-trailer-1080p.mp4
else python3 vo.py "$LANG_CODE"; BUILD="build_$LANG_CODE"; OUT="champion-opening-trailer-bangla-1080p.mp4"; fi
FRAMES="$1"
python3 score.py "$BUILD"
(cd ../.. && python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 & echo $! > /tmp/champion_trailer_http.pid)
sleep 1
LANG_Q="$LANG_CODE" NODE_PATH="$(npm root -g)" node frames.js all "$FRAMES" 30
kill "$(cat /tmp/champion_trailer_http.pid)" || true
ffmpeg -y -v error -framerate 30 -i "$FRAMES/f%05d.jpg" -i "$BUILD/mix.wav" \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -shortest "$OUT"
echo "done: $OUT"
