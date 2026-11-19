"""Make a narrower version of a Champion pillar / tall-sticker face from its source SVG (any width -> any width,
height unchanged). Step 1 of 2; fit.js finishes the job in the browser.

* The artwork is centred on the new face: translate(-off) with off = (source width - target width) / 2.
* Logo and text become .fit groups so fit.js can shrink only the ones that would not fit.
* Stroke-only paths made of several sub-paths (e.g. the four corner brackets in one path) are split, so each
  corner can be moved inward on its own.
Usage: python3 resize.py <source.svg> <out_basename> <target_width_in>
"""
import re, sys, os
src_path, out, TW = sys.argv[1], sys.argv[2], float(sys.argv[3])
s = open(src_path).read()
SW = float(re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s).group(1))
SH = float(re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s).group(2))
off = (SW - TW) / 2
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
    if it.startswith('<text') or 'skewX' in it[:80] or (it.startswith('<g') and '<text' in it and it.count('<') <= 4):
        return 'text'
    if 'scale(0.0' in it[:90] and 'fill="#FFFFFF" fill-rule="evenodd"' in it[:200]:
        return 'logo'
    return 'keep'

def anchor_y(it, k):
    if k == 'logo':
        return float(re.search(r'translate\([\d.]+ ([\d.]+)\) scale', it).group(1))
    return float(re.search(r'<text[^>]* y="([\d.]+)"', it).group(1))

def split_subpaths(it):
    m = re.match(r'<path d="([^"]+)"([^>]*)/>$', it)
    if not m or 'fill="none"' not in m.group(2) or m.group(1).count('M') < 2:
        return [it]
    return [f'<path d="{sp.strip()}"{m.group(2)}/>' for sp in re.findall(r'M[^M]+', m.group(1))]

parts = []
for it in items:
    k = kind(it)
    if k == 'keep':
        parts.extend(split_subpaths(it))
    else:
        parts.append(f'<g class="fit" data-kind="{k}" data-y="{anchor_y(it, k):.4f}">{it}</g>')
vb = re.search(r'viewBox="[^"]+"', head).group(0)
wd = re.search(r'width="[\d.]+in"', head).group(0)
svg = (head.replace(wd, f'width="{TW:g}in"', 1).replace(vb, f'viewBox="0 0 {TW:g} {SH:g}" data-sw="{SW:g}" data-tw="{TW:g}"', 1)
       + f'<g transform="translate({-off:g} 0)" id="art">' + ''.join(parts) + '</g></svg>')
here = os.path.dirname(os.path.abspath(__file__))
FONTS = '''@font-face{font-family:Orbitron;font-weight:900;src:url(../../node_modules/@fontsource/orbitron/files/orbitron-latin-900-normal.woff2)}
@font-face{font-family:Rajdhani;font-weight:700;src:url(../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2)}'''
open(os.path.join(here, out + '.html'), 'w').write(
    f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}@page{{size:{TW:g}in {SH:g}in;margin:0}}'
    f'*{{margin:0;padding:0}}html,body{{width:{TW:g}in;height:{SH:g}in;overflow:hidden;background:#05070B}}svg{{display:block}}</style></head>'
    f'<body>{svg}</body></html>')
print(f'{SW:g} -> {TW:g} in, offset {off:g}; items {len(items)}, parts {len(parts)}, fit groups', sum('class="fit"' in p for p in parts))
