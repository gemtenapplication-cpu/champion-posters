"""Upright correction for handheld interior footage (like a videographer's 'vertical lines' fix).
Per frame: find the vertical vanishing point from near-vertical line segments, derive roll + keystone,
smooth both over time, warp with a homography and zoom just enough to hide the borders.
usage: rectify.py in.mp4 out.mp4 [strength=0.85]   |   rectify.py --image in.jpg out.jpg [strength]"""
import cv2, numpy as np, sys, subprocess

def segments(fr, W=960):
    h, w = fr.shape[:2]; s = W / w
    g = cv2.cvtColor(cv2.resize(fr, (W, int(h * s))), cv2.COLOR_BGR2GRAY); g = cv2.GaussianBlur(g, (3, 3), 0)
    L = cv2.createLineSegmentDetector().detect(g)[0]
    if L is None: return np.zeros((0, 5)), s
    L = L.reshape(-1, 4) / s
    d = L[:, 2:] - L[:, :2]; ln = np.hypot(d[:, 0], d[:, 1]); ang = np.degrees(np.arctan2(d[:, 0], d[:, 1])); ang = (ang + 90) % 180 - 90
    k = (ln > 50 / s * 1.0) & (np.abs(ang) < 18)
    return np.c_[L[k], ln[k]], s

def vanishing(seg, w, h):
    """returns (roll_deg, p) where p = keystone coefficient (1/distance to vertical VP, signed, in centred px units)"""
    if len(seg) < 5: return None
    cx, cy = w / 2, h / 2
    P1 = np.c_[seg[:, 0] - cx, seg[:, 1] - cy, np.ones(len(seg))]; P2 = np.c_[seg[:, 2] - cx, seg[:, 3] - cy, np.ones(len(seg))]
    Lh = np.cross(P1, P2); Lh /= np.linalg.norm(Lh[:, :2], axis=1)[:, None]
    wts = seg[:, 4].copy()
    V = None
    for _ in range(6):
        M = (Lh * wts[:, None]).T @ Lh; e, v = np.linalg.eigh(M); V = v[:, 0]
        # residual: angle between segment and direction to VP
        mid = (P1 + P2) / 2; dirs = P2[:, :2] - P1[:, :2]; dirs /= np.linalg.norm(dirs, axis=1)[:, None]
        if abs(V[2]) > 1e-9: tov = V[:2] / V[2] - mid[:, :2]
        else: tov = np.tile(V[:2], (len(mid), 1))
        tov /= np.linalg.norm(tov, axis=1)[:, None] + 1e-9
        res = np.degrees(np.arcsin(np.clip(np.abs(dirs[:, 0] * tov[:, 1] - dirs[:, 1] * tov[:, 0]), 0, 1)))
        wts = seg[:, 4] / (1 + (res / 1.2) ** 2)
    if V[1] < 0: V = -V
    # roll: direction of VP from centre; keystone: 1/distance
    roll = np.degrees(np.arctan2(V[0], V[1]))
    p = V[2] / np.hypot(V[0], V[1])
    if not np.isfinite(roll) or abs(roll) > 12 or abs(p) > 1 / 900: return None
    return roll, p

def homography(roll, p, w, h, k):
    cx, cy = w / 2, h / 2
    T = np.array([[1, 0, -cx], [0, 1, -cy], [0, 0, 1.]]); Ti = np.linalg.inv(T)
    a = np.radians(roll); R = np.array([[np.cos(a), -np.sin(a), 0], [np.sin(a), np.cos(a), 0], [0, 0, 1.]])
    K = np.array([[1, 0, 0], [0, 1, 0], [0, -k * p, 1.]])
    H = Ti @ K @ R @ T
    # normalise so the centre stays put and its local scale is 1
    c = H @ np.array([cx, cy, 1.]); c /= c[2]; H = np.array([[1, 0, cx - c[0]], [0, 1, cy - c[1]], [0, 0, 1.]]) @ H
    return H

def cover_scale(H, w, h):
    """zoom about the centre needed so the warped frame covers the whole output"""
    Hi = np.linalg.inv(H); cx, cy = w / 2, h / 2
    best = 1.0
    for s in np.linspace(1.0, 1.6, 121):
        S = np.array([[s, 0, cx * (1 - s)], [0, s, cy * (1 - s)], [0, 0, 1.]]); Si = np.linalg.inv(S)
        ok = True
        for x, y in [(0, 0), (w, 0), (w, h), (0, h), (cx, 0), (cx, h), (0, cy), (w, cy)]:
            q = Hi @ Si @ np.array([x, y, 1.]); q /= q[2]
            if not (-0.5 <= q[0] <= w + .5 and -0.5 <= q[1] <= h + .5): ok = False; break
        if ok: return s
    return 1.6

def warp(fr, H, s):
    h, w = fr.shape[:2]; cx, cy = w / 2, h / 2
    S = np.array([[s, 0, cx * (1 - s)], [0, s, cy * (1 - s)], [0, 0, 1.]])
    return cv2.warpPerspective(fr, S @ H, (w, h), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)

def smooth(vals, sigma):
    v = np.array(vals, float); ok = np.isfinite(v)
    if ok.sum() == 0: return np.zeros_like(v)
    idx = np.arange(len(v)); v = np.interp(idx, idx[ok], v[ok])
    r = int(3 * sigma); x = np.arange(-r, r + 1); g = np.exp(-x ** 2 / (2 * sigma ** 2)); g /= g.sum()
    return np.convolve(np.pad(v, r, mode='edge'), g, mode='valid')

if __name__ == '__main__':
    if sys.argv[1] == '--image':
        im = cv2.imread(sys.argv[2]); k = float(sys.argv[4]) if len(sys.argv) > 4 else .85; h, w = im.shape[:2]
        r = vanishing(segments(im)[0], w, h); print('roll/p', r)
        H = homography(r[0], r[1], w, h, k); s = cover_scale(H, w, h); print('scale', round(s, 3))
        cv2.imwrite(sys.argv[3], warp(im, H, s), [cv2.IMWRITE_JPEG_QUALITY, 96]); sys.exit()
    src, out = sys.argv[1], sys.argv[2]; k = float(sys.argv[3]) if len(sys.argv) > 3 else .85
    cap = cv2.VideoCapture(src); frames = []
    while True:
        ok, f = cap.read()
        if not ok: break
        frames.append(f)
    h, w = frames[0].shape[:2]; rolls, ps = [], []
    for f in frames:
        r = vanishing(segments(f)[0], w, h)
        rolls.append(r[0] if r else np.nan); ps.append(r[1] if r else np.nan)
    rs = smooth(rolls, 9); pss = smooth(ps, 12)
    Hs = [homography(a, b, w, h, k) for a, b in zip(rs, pss)]
    sc = max(cover_scale(H, w, h) for H in Hs[::3]); sc = min(sc, 1.25)
    print(f'{src}: frames {len(frames)} roll med {np.nanmedian(rolls):+.2f} range {np.nanmin(rs):+.2f}..{np.nanmax(rs):+.2f}  '
          f'keystone med {np.nanmedian(ps)*1e4:+.2f}e-4  zoom {sc:.3f}  missing {int(np.isnan(rolls).sum())}')
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w}x{h}', '-r', '30', '-i', '-',
                          '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    for f, H in zip(frames, Hs): p.stdin.write(warp(f, H, sc).tobytes())
    p.stdin.close(); p.wait()
