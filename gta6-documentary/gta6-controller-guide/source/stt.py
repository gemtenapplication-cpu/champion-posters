import json, subprocess, os, sys, concurrent.futures as cf, time
D = sys.argv[1]; os.chdir(D); os.makedirs('words', exist_ok=True)
SC = json.load(open('script.json'))
def run(l):
    out = f"words/{l['id']}.stt.json"
    if not os.path.exists(out):
        for _ in range(5):
            r = subprocess.run(["curl","-s","-o",out,"-w","%{http_code}","https://api.elevenlabs.io/v1/speech-to-text","-H","xi-api-key: dummy",
                "-F","model_id=scribe_v1","-F","language_code=ben","-F","timestamps_granularity=word","-F",f"file=@audio/{l['id']}.mp3"],capture_output=True,text=True)
            if r.stdout=="200": break
            time.sleep(3)
    d = json.load(open(out)); ws = [w for w in d.get('words',[]) if w.get('type')=='word']
    N = len(l['cap'].split()); M = len(ws)
    wt = [round(ws[min(M-1, round(i*M/N))]['start'], 3) for i in range(N)] if M else []
    json.dump(wt, open(f"words/{l['id']}.json","w"))
    return l['id'], d.get('text','')
with cf.ThreadPoolExecutor(3) as ex:
    for i, t in ex.map(run, SC): print(i, '|', t)
