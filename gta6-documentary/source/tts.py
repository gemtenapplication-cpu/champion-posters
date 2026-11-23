import json, subprocess, concurrent.futures as cf, os
sc = json.load(open("script.json"))
jobs = []
for s in sc:
    for i, l in enumerate(s["lines"]):
        jobs.append((f"audio/{s['id']}_{i:02d}.mp3", l["tts"]))
def run(j):
    out, text = j
    if os.path.exists(out) and os.path.getsize(out) > 5000: return out, "cached"
    body = json.dumps({"text": text, "model_id": "eleven_v4",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2, "speed": 0.95}})
    r = subprocess.run(["curl","-s","-o",out,"-w","%{http_code}",
        "https://api.elevenlabs.io/v1/text-to-speech/MNuISDUw2Kqij2hI0QHV?output_format=mp3_44100_128",
        "-H","xi-api-key: dummy","-H","Content-Type: application/json","-d",body],capture_output=True,text=True)
    if r.stdout=="429":
        import time; time.sleep(3); os.remove(out); return run(j)
    return out, r.stdout
with cf.ThreadPoolExecutor(2) as ex:
    for o, c in ex.map(run, jobs): print(o, c)
