#!/usr/bin/env bash
# Builds the Champion opening trailer end to end.
#   1. vo.py     - English voice-over (Piper TTS, en_US-ryan-high) placed on the timeline  -> build/vo.wav, build/timings.json
#   2. score.py  - original synthesised score + sound design, ducked under the voice         -> build/mix.wav
#   3. frames.js - renders trailer.html frame by frame (1920x1080, 30 fps) via a local server -> FRAMES dir
#   4. ffmpeg    - H.264 + AAC, loudness normalised to -14 LUFS, faststart                    -> champion-opening-trailer-1080p.mp4
# Usage: ./make.sh <piper_voice.onnx> <frames_dir>
set -euo pipefail
cd "$(dirname "$0")"
VOICE="$1"; FRAMES="$2"
python3 vo.py "$VOICE"
python3 score.py
(cd ../.. && python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 & echo $! > /tmp/champion_trailer_http.pid)
sleep 1
NODE_PATH="$(npm root -g)" node frames.js all "$FRAMES" 30
kill "$(cat /tmp/champion_trailer_http.pid)" || true
ffmpeg -y -v error -framerate 30 -i "$FRAMES/f%05d.jpg" -i build/mix.wav \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -shortest champion-opening-trailer-1080p.mp4
echo "done: champion-opening-trailer-1080p.mp4"
