"""Recompute where each source shot lands on the final timeline (same selection logic as base.py)."""
import json, os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "base.py")).read()
pre = src[:src.index("SRC =")]
pre = pre.replace('os.chdir(D)', 'os.chdir(D)\n')
g = {"__file__": os.path.abspath("base.py")}; exec(pre.replace('os.makedirs("clips", exist_ok=True)', ''), g)
out = []
for k, (s0, s1, xd, shots) in enumerate(g["SECTIONS"]):
    if not shots: continue
    xd = xd or 0.0; d = s1 - s0
    durs = [(b - a) * m for _, a, b, m in shots]; need = d + xd * (len(shots) - 1)
    while sum(durs) < need + 0.1: shots = shots + shots; durs = durs + durs
    acc, keep = 0, []
    for i, dd in enumerate(durs):
        keep.append(i); acc += dd - (xd if i else 0)
        if acc >= d + 0.05: break
    t = s0
    for i in keep:
        src_, a, b, m = shots[i]
        out.append({"sec": k, "src": src_, "a": a, "b": b, "m": m, "start": round(t, 3), "dur": round(durs[i], 3)})
        t += durs[i] - xd
json.dump(out, open("shots.json", "w"), indent=0)
print(len(out), "shots")
