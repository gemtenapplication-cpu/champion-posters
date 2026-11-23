import json, subprocess, concurrent.futures as cf, os, time, sys
sc = json.load(open("script.json"))
def run(l):
    out = f"audio/{l['id']}.mp3"
    if os.path.exists(out) and os.path.getsize(out) > 5000: return out, "cached"
    body = json.dumps({"text": l["tts"], "model_id": "eleven_v4",
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.85, "style": 0.35, "speed": 0.9}})
    for _ in range(8):
        r = subprocess.run(["curl","-s","-o",out,"-w","%{http_code}",
            "https://api.elevenlabs.io/v1/text-to-speech/MNuISDUw2Kqij2hI0QHV?output_format=mp3_44100_128",
            "-H","xi-api-key: dummy","-H","Content-Type: application/json","-d",body],capture_output=True,text=True)
        if r.stdout == "200": return out, "200"
        time.sleep(4)
    return out, r.stdout + open(out).read()[:200]
with cf.ThreadPoolExecutor(2) as ex:
    for o, c in ex.map(run, sc): print(o, c)
