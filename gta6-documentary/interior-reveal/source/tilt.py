"""Measure camera roll per frame from near-vertical line segments. usage: tilt.py video [step]"""
import cv2, numpy as np, sys, json
def measure(fr):
    g = cv2.cvtColor(cv2.resize(fr, (960, 540)), cv2.COLOR_BGR2GRAY); g = cv2.GaussianBlur(g, (3, 3), 0)
    lsd = cv2.createLineSegmentDetector(); L = lsd.detect(g)[0]
    if L is None: return None
    out = []
    for x1, y1, x2, y2 in L.reshape(-1, 4):
        dx, dy = x2 - x1, y2 - y1; ln = np.hypot(dx, dy)
        if ln < 45: continue
        a = np.degrees(np.arctan2(dx, dy))  # 0 = vertical
        a = (a + 90) % 180 - 90
        if abs(a) < 15: out.append((a, ln, (x1 + x2) / 2))
    if len(out) < 4: return None
    a = np.array(out)
    # weight central lines more (edges suffer keystone); robust weighted median
    w = a[:, 1] * np.exp(-((a[:, 2] - 480) / 330) ** 2)
    o = np.argsort(a[:, 0]); c = np.cumsum(w[o]); med = a[o][np.searchsorted(c, c[-1] / 2), 0]
    L_ = a[a[:, 2] < 320]; R_ = a[a[:, 2] > 640]
    lm = np.median(L_[:, 0]) if len(L_) > 2 else np.nan; rm = np.median(R_[:, 0]) if len(R_) > 2 else np.nan
    return float(med), float(lm), float(rm), len(out)
if __name__ == '__main__':
    cap = cv2.VideoCapture(sys.argv[1]); step = int(sys.argv[2]) if len(sys.argv) > 2 else 10; i = 0; res = []
    while True:
        ok, fr = cap.read()
        if not ok: break
        if i % step == 0:
            m = measure(fr); res.append((i, m))
        i += 1
    for i, m in res:
        if m: print(f"{i:4d} roll {m[0]:+5.1f}  L {m[1]:+5.1f} R {m[2]:+5.1f} n{m[3]}")
        else: print(i, None)
