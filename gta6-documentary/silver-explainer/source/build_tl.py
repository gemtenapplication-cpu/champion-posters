"""Timeline from voice durations (estimates for lines not yet voiced). Word times from STT if words/<id>.json exists, else proportional."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
SC = json.load(open("script.json"))
dur = lambda p: float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p],capture_output=True,text=True).stdout)
have = {l["id"]: dur(f"audio/{l['id']}.mp3") for l in SC if os.path.exists(f"audio/{l['id']}.mp3")}
rate = 0.0755 if not have else sum(have[l["id"]] for l in SC if l["id"] in have) / sum(len(l["tts"]) for l in SC if l["id"] in have)
# gap BEFORE each line (scene changes get room for transitions)
GAP = {"g1": 2.6, "g2": 0.7, "g3": 0.6, "g4": 1.1, "g5": 1.0, "g6": 0.7, "g7": 0.7, "g8": 1.2, "g9": 1.2, "g10": 0.6, "g11": 0.7, "g12": 1.2, "g13": 1.2, "g14": 1.1, "g15": 0.8, "q8": 0.6}
t, lines, est = 0.0, [], []
for l in SC:
    t += GAP.get(l["id"], 0.45)
    d = have.get(l["id"]) or round(len(l["tts"]) * rate + 0.3, 3)
    if l["id"] not in have: est.append(l["id"])
    words = l["cap"].split()
    wf = f"words/{l['id']}.json"
    if os.path.exists(wf): wt = [round(t + x, 3) for x in json.load(open(wf))]
    else:
        L = [len(w) for w in words]; tot = sum(L); acc = 0; wt = []
        for x in L: wt.append(round(t + 0.1 + (d - 0.3) * acc / tot, 3)); acc += x
    lines.append({"id": l["id"], "start": round(t, 3), "dur": round(d, 3), "cap": l["cap"], "words": words, "wt": wt, "est": l["id"] not in have})
    t += d
total = round(t + 3.2, 2)
json.dump({"total": total, "lines": lines}, open("timeline.json", "w"), ensure_ascii=False, indent=0)
print("total", total, "estimated:", est)
