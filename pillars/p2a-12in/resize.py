"""Make a 12 x 120 in version of an original 16 x 120 in Champion_12 pillar face, from its source SVG.

* Full-width bands (background, carbon, checkers, kerb, footer bars) keep their size and are cropped 2in each side.
* Centred artwork (start-light gantry, lights, wheel) keeps its original size: it already fits.
* Logo and text keep their position; any that would not fit is shrunk about its own centre / baseline
  (the exact factor is measured in the browser by fit.js).
Usage: python3 resize.py <source_16x120.svg> <out_basename>
"""
import re, sys, os
src_path, out = sys.argv[1], sys.argv[2]
s = open(src_path).read()
head = s[:s.index('</defs>') + 7]
body = s[s.index('</defs>') + 7:s.rindex('</svg>')]

items, depth, start = [], 0, 0
for m in re.finditer(r'<(/?)(\w+)[^>]*?(/?)>', body):
    close, selfc = m.group(1), m.group(3)
    if not close and not selfc:
        if depth == 0:
            start = m.start()
        depth += 1
    elif close:
        depth -= 1
        if depth == 0:
            items.append(body[start:m.end()])
    elif depth == 0:
        items.append(body[m.start():m.end()])

def kind(it):
    if it.startswith('<text') or 'skewX' in it[:80]:
        return 'text'
    if 'scale(0.0114504)' in it[:90]:
        return 'logo'
    return 'keep'

def anchor_y(it, k):
    if k == 'logo':
        return float(re.search(r'translate\([\d.]+ ([\d.]+)\) scale', it).group(1))
    return float(re.search(r'<text[^>]* y="([\d.]+)"', it).group(1))

parts = []
for it in items:
    k = kind(it)
    if k == 'keep':
        parts.append(it)
    else:
        parts.append(f'<g class="fit" data-kind="{k}" data-y="{anchor_y(it, k):.4f}">{it}</g>')
svg = (head.replace('width="16.0in"', 'width="12in"').replace('viewBox="0 0 16.0 120.0"', 'viewBox="0 0 12 120"')
       + '<g transform="translate(-2 0)">' + ''.join(parts) + '</g></svg>')
assert 'viewBox="0 0 12 120"' in svg
here = os.path.dirname(os.path.abspath(__file__))
FONTS = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}'''
open(os.path.join(here, out + '.html'), 'w').write(
    f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}@page{{size:12in 120in;margin:0}}'
    '*{margin:0;padding:0}html,body{width:12in;height:120in;overflow:hidden;background:#05070B}svg{display:block}</style></head>'
    f'<body>{svg}</body></html>')
print('items', len(items), 'fit groups', sum('class="fit"' in p for p in parts))
