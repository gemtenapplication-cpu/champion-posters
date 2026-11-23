"""Voice-over for the Champion opening trailer (Piper TTS, en_US-ryan-high), placed on the trailer timeline.

Each fragment is synthesised on its own so the dramatic pauses are exact, processed into a deeper trailer voice
(slight pitch drop, low-end EQ, compression, short reverb) and laid at its target time (pushed later if the
previous fragment is still speaking). Writes build/vo.wav (48 kHz) and build/timings.json used by the score and
the visuals.  Usage: python3 vo.py <piper_voice.onnx>
"""
import json, os, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(HERE, 'build'); os.makedirs(B, exist_ok=True)
VOICE = sys.argv[1]
SR = 48000
TOTAL = 44.0
FRAGS = [  # id, target start (s), text
    ('A1', 1.0, 'Cumilla.'), ('A2', 2.3, 'Your game has been waiting.'),
    ('B1', 8.0, 'Big screens.'), ('B2', 9.3, 'Real rivals.'), ('B3', 10.6, 'PlayStation. And PC gaming.'),
    ('C1', 13.8, 'A new arena rises.'), ('C2', 15.6, 'Fourth floor. Ranir Bazar.'),
    ('D1', 18.6, 'Bring your squad.'), ('D2', 20.0, 'Join the Arena.'), ('D3', 21.4, 'Climb the ranks.'),
    ('E1', 23.8, 'But only one...'), ('E2', 25.2, 'will be the Champion.'),
    ('F1', 30.0, 'Grand opening.'), ('F2', 31.4, 'November twenty fifth.'), ('F3', 33.3, 'Ten A M.'),
    ('G1', 36.0, 'Book your slot at champion dot gemten dot com dot B D.'), ('G2', 40.4, 'Game on.'),
]

def read_wav(p):
    with wave.open(p) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        return x, w.getframerate()

track = np.zeros(int(TOTAL * SR), dtype=np.float32)
timings, cursor = {}, 0.0
for fid, t0, text in FRAGS:
    raw, proc = os.path.join(B, f'vo_{fid}_raw.wav'), os.path.join(B, f'vo_{fid}.wav')
    subprocess.run([sys.executable, '-m', 'piper', '-m', VOICE, '-f', raw, '--length-scale', '1.16',
                    '--sentence-silence', '0.25'], input=text.encode(), check=True, capture_output=True)
    # deeper trailer voice: pitch down ~1.5 semitones (same speed), warm low end, compression, short room reverb
    af = ('asetrate=22050*0.915,aresample=48000,atempo=1.0929,'
          'highpass=f=60,equalizer=f=120:t=q:w=1:g=4,equalizer=f=3500:t=q:w=1.2:g=2.5,'
          'acompressor=threshold=-20dB:ratio=4:attack=5:release=120:makeup=4,'
          'aecho=0.85:0.5:45|90:0.18|0.10,alimiter=limit=0.9')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', af, '-ac', '1', '-ar', str(SR), proc], check=True)
    x, _ = read_wav(proc)
    nz = np.where(np.abs(x) > 0.01)[0]
    x = x[max(nz[0] - 480, 0): nz[-1] + 4800]          # trim silence, keep the reverb tail
    start = max(t0, cursor + 0.15)
    i = int(start * SR)
    track[i:i + len(x)] += x[:len(track) - i]
    cursor = start + len(x) / SR
    timings[fid] = {'start': round(start, 3), 'end': round(cursor, 3), 'text': text}
    print(f'{fid} {start:6.2f} - {cursor:6.2f}  {text}')
peak = np.max(np.abs(track))
track = track / peak * 0.89
with wave.open(os.path.join(B, 'vo.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((track * 32767).astype(np.int16).tobytes())
json.dump({'total': TOTAL, 'vo': timings}, open(os.path.join(B, 'timings.json'), 'w'), indent=1)
