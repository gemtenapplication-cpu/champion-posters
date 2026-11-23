"""Voice-over for the Champion opening trailer, placed on the trailer timeline.

  python3 vo.py en <piper_voice.onnx>   English, Piper TTS (en_US-ryan-high)          -> build/
  VOICE=rayhan python3 vo.py bn         Bangla, ElevenLabs eleven_v3 (rayhan | rakib)  -> build_bn/
                                        (the API key is injected by the network proxy)

Each fragment is synthesised on its own so the dramatic pauses are exact, then processed into a trailer voice
(slight pitch drop for English only, low-end EQ, compression, short reverb).

The English cut is the DESIGN timeline (scenes, hits, logo slam). Another language keeps its natural speed:
its fragments are laid in order keeping every design gap, so a longer line simply makes the trailer longer.
timings.json then holds `warp`: (real time, design time) anchor pairs that score.py and trailer.html use to
stretch the design timeline onto the real one, so cuts, hits and the logo slam still land on the words.
Writes <build>/vo.wav (48 kHz) and <build>/timings.json.
"""
import json, os, subprocess, sys, wave, urllib.request
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LANG = sys.argv[1]
B = os.path.join(HERE, 'build' if LANG == 'en' else f'build_{LANG}'); os.makedirs(B, exist_ok=True)
SR, TOTAL = 48000, 44.0
FRAGS = {
    'en': [('A1', 1.0, 'Cumilla.'), ('A2', 2.3, 'Your game has been waiting.'),
           ('B1', 8.0, 'Big screens.'), ('B2', 9.3, 'Real rivals.'), ('B3', 10.6, 'PlayStation. And PC gaming.'),
           ('C1', 13.8, 'A new arena rises.'), ('C2', 15.6, 'Fourth floor. Ranir Bazar.'),
           ('D1', 18.6, 'Bring your squad.'), ('D2', 20.0, 'Join the Arena.'), ('D3', 21.4, 'Climb the ranks.'),
           ('E1', 23.8, 'But only one...'), ('E2', 25.2, 'will be the Champion.'),
           ('F1', 30.0, 'Grand opening.'), ('F2', 31.4, 'November twenty fifth.'), ('F3', 33.3, 'Ten A M.'),
           ('G1', 36.0, 'Book your slot at champion dot gemten dot com dot B D.'), ('G2', 40.4, 'Game on.')],
    'bn': [('A1', 1.0, 'কুমিল্লার গেমাররা...'), ('A2', 2.2, 'অনেক দিন তো অপেক্ষা করলে, তাই না?'),
           ('B1', 8.0, 'এবার খেলা হবে বড় স্ক্রিনে।'), ('B2', 9.3, 'বন্ধুর সাথে, একদম সামনাসামনি।'),
           ('B3', 10.6, 'প্লেস্টেশন আছে, গেমিং পিসিও আছে।'),
           ('C1', 13.8, 'জায়গাটা চেনো তো?'), ('C2', 15.6, 'রানীর বাজার, আইএফআইসি ব্যাংক ভবনের চারতলায়।'),
           ('D1', 18.6, 'দলবল নিয়ে চলে আসো।'), ('D2', 20.0, 'এরিনায় যোগ দাও...'), ('D3', 21.4, 'আর দেখিয়ে দাও, কে আসল খেলোয়াড়।'),
           ('E1', 23.6, 'কারণ এখানে জিতবে একজনই...'), ('E2', 25.0, 'চ্যাম্পিয়ন।'),
           ('F1', 30.0, 'আমরা খুলছি...'), ('F2', 31.4, 'পঁচিশে নভেম্বর,'), ('F3', 33.3, 'সকাল দশটায়।'),
           ('G1', 36.0, 'স্লট বুক করে ফেলো অনলাইনেই, চ্যাম্পিয়ন ডট জেমটেন ডট কম ডট বিডি।'), ('G2', 40.4, 'তাহলে দেখা হচ্ছে!')],
}[LANG]
EL_VOICES = {'rakib': 'VizHiwkPO7hXc967v4tE',     # Rakib - Deep, Authoritative (ElevenLabs voice library)
             'rayhan': 'vvOYlSJHf8lTWIG4tDNP'}    # Rayhan - Engaging & Excitement, advertisement (ElevenLabs voice library)
EL_NAME = os.environ.get('VOICE', 'rayhan'); EL_VOICE = EL_VOICES[EL_NAME]

def synth(fid, text, raw):
    if LANG == 'en':
        subprocess.run([sys.executable, '-m', 'piper', '-m', sys.argv[2], '-f', raw, '--length-scale', '1.16',
                        '--sentence-silence', '0.25'], input=text.encode(), check=True, capture_output=True)
        return
    import hashlib
    mp3 = raw.replace('_raw.wav', f'_{EL_NAME}_{hashlib.md5(text.encode()).hexdigest()[:8]}.mp3')   # cache per voice + text
    if not os.path.exists(mp3):            # cache: each fragment costs API characters
        body = json.dumps({'text': text, 'model_id': 'eleven_v3', 'language_code': 'bn',
                           'voice_settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.45}}).encode()
        req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{EL_VOICE}?output_format=mp3_44100_128',
                                     data=body, headers={'Content-Type': 'application/json', 'xi-api-key': 'proxy-injected'})
        open(mp3, 'wb').write(urllib.request.urlopen(req, timeout=180).read())
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-ac', '1', raw], check=True)

def read_wav(p):
    with wave.open(p) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768

pitch = 'asetrate=22050*0.915,aresample=48000,atempo=1.0929,' if LANG == 'en' else 'aresample=48000,'
chain = (pitch + 'highpass=f=60,equalizer=f=120:t=q:w=1:g=4,equalizer=f=3500:t=q:w=1.2:g=2.5,'
         'acompressor=threshold=-20dB:ratio=4:attack=5:release=120:makeup=4,aecho=0.85:0.5:45|90:0.18|0.10,alimiter=limit=0.9')
design = json.load(open(os.path.join(HERE, 'build', 'timings.json')))['vo'] if LANG != 'en' else None
pieces, timings, cursor = [], {}, 0.0
prev_design_end = 0.0
for k, (fid, t0, text) in enumerate(FRAGS):
    raw, proc = os.path.join(B, f'vo_{fid}_raw.wav'), os.path.join(B, f'vo_{fid}.wav')
    synth(fid, text, raw)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', chain, '-ac', '1', '-ar', str(SR), proc], check=True)
    x = read_wav(proc)
    nz = np.where(np.abs(x) > 0.01)[0]
    x = x[max(nz[0] - 480, 0): nz[-1] + 4800]
    if design is None:
        start = max(t0, cursor + 0.15)
    else:
        d = design[fid]
        start = cursor + max(0.15, d['start'] - prev_design_end) if k else d['start']
        prev_design_end = d['end']
    pieces.append((start, x))
    cursor = start + len(x) / SR
    timings[fid] = {'start': round(start, 3), 'end': round(cursor, 3), 'text': text}
    print(f'{fid} {start:6.2f} - {cursor:6.2f}  {text}')
if design is None:
    total, warp = TOTAL, [[0, 0], [TOTAL, TOTAL]]
    design = timings
else:
    total = round(cursor + (TOTAL - prev_design_end), 2)
    warp = [[0, 0]] + [[timings[f]['start'], design[f]['start']] for f, _, _ in FRAGS] \
           + [[timings[f]['end'], design[f]['end']] for f, _, _ in FRAGS] + [[total, TOTAL]]
    warp.sort()
track = np.zeros(int(total * SR) + SR, dtype=np.float32)
for start, x in pieces:
    i = int(start * SR); track[i:i + len(x)] += x[:len(track) - i]
track = track[:int(total * SR)]
track = track / np.max(np.abs(track)) * 0.89
with wave.open(os.path.join(B, 'vo.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((track * 32767).astype(np.int16).tobytes())
json.dump({'total': total, 'lang': LANG, 'vo': timings, 'design': {f: {'start': design[f]['start'], 'end': design[f]['end']} for f in timings}, 'warp': warp}, open(os.path.join(B, 'timings.json'), 'w'), indent=1, ensure_ascii=False)
