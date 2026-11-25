// Procedural 3D game controller, own build. Outline traced from a top-view photo; units ~cm.
// Plane: x right, y toward the shoulder edge, z up out of the top face.
import * as THREE from 'three';
import { RoundedBoxGeometry } from './node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { BODY, PANEL } from './outline.js';

const TOP = 2.05;                                   // z of the flat top face
export const droop = y => 0;
function bend(geo, z0 = 0) { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + droop(p.getY(i))); p.needsUpdate = true; geo.computeVertexNormals(); return geo }
function subdivideShape(pts, step = .12) { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let k = 0; k < n; k++) out.push(new THREE.Vector2(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n)) } return out }
function smoothPts(pts, it = 2) { let p = pts; for (let k = 0; k < it; k++) p = p.map((v, i) => { const a = p[(i - 1 + p.length) % p.length], b = p[(i + 1) % p.length]; return new THREE.Vector2((a.x + 2 * v.x + b.x) / 4, (a.y + 2 * v.y + b.y) / 4) }); return p }
function roundRect(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s }
function symbolTex(kind, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const grd = g.createRadialGradient(size * .45, size * .38, size * .05, size * .5, size * .5, size * .6); grd.addColorStop(0, '#ffffff'); grd.addColorStop(1, '#dfe3ea'); g.fillStyle = grd; g.fillRect(0, 0, size, size);
  g.strokeStyle = "#7a8291"; g.lineWidth = size * .06; g.lineCap = 'round'; g.lineJoin = 'round'; const m = size / 2, r = size * .2;
  g.beginPath();
  if (kind === 'tri') { g.moveTo(m, m - r * 1.05); g.lineTo(m + r * 1.08, m + r * .78); g.lineTo(m - r * 1.08, m + r * .78); g.closePath() }
  if (kind === 'cir') g.arc(m, m, r * 1.02, 0, Math.PI * 2);
  if (kind === 'crs') { g.moveTo(m - r, m - r); g.lineTo(m + r, m + r); g.moveTo(m + r, m - r); g.lineTo(m - r, m + r) }
  if (kind === 'sq') g.rect(m - r * .9, m - r * .9, r * 1.8, r * 1.8);
  if (kind === 'arrow') { g.fillStyle = '#9aa0ad'; g.moveTo(m, m - r * .55); g.lineTo(m + r * .45, m + r * .15); g.lineTo(m - r * .45, m + r * .15); g.closePath(); g.fill(); return tex(c) }
  g.stroke(); return tex(c) }
function tex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }

export function buildController() {
  const root = new THREE.Group(); const parts = {};
  const white = new THREE.MeshPhysicalMaterial({ color: 0xeceef3, roughness: .48, clearcoat: .25, clearcoatRoughness: .5, sheen: .2 });
  const black = new THREE.MeshPhysicalMaterial({ color: 0x14161c, roughness: .55, clearcoat: .45, clearcoatRoughness: .35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x22252d, roughness: .66 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x4d8bff, emissive: 0x2f6bff, emissiveIntensity: 2.4, roughness: .3 });
  const own = m => m.clone();
  const reg = (name, obj, anchor) => { obj.name = name; parts[name] = { obj, anchor: anchor || obj.position.clone(), base: obj.position.clone() }; return obj };
  const place = (o, x, y, z) => { o.position.set(x, y, z + droop(y)); return o };

  // body
  const bpts = smoothPts(subdivideShape(BODY), 3);
  const bodyG = bend(new THREE.ExtrudeGeometry(new THREE.Shape(bpts), { depth: 1.35, bevelEnabled: true, bevelThickness: .7, bevelSize: .5, bevelSegments: 10, curveSegments: 12 }));
  const body = new THREE.Mesh(bodyG, white); root.add(body);
  // black centre panel (clip the small spur next to the square button)
  const pp = PANEL.map(([x, y]) => [x, Math.abs(x) > 2.9 ? Math.min(y, .5) : y]);
  const panelG = bend(new THREE.ExtrudeGeometry(new THREE.Shape(smoothPts(subdivideShape(pp), 3)), { depth: .04, bevelEnabled: true, bevelThickness: .1, bevelSize: .06, bevelSegments: 4 }));
  panelG.translate(0, 0, TOP - .03);
  const panel = new THREE.Mesh(panelG, black); root.add(panel);
  // touchpad + light bars
  const tpG = new THREE.ExtrudeGeometry(roundRect(6.3, 2.75, .5), { depth: .06, bevelEnabled: true, bevelThickness: .08, bevelSize: .08, bevelSegments: 4 });
  const tp = new THREE.Mesh(tpG, own(white)); place(tp, 0, 1.98, TOP + .02); root.add(reg('touchpad', tp, new THREE.Vector3(0, 1.98, TOP + .25)));
  for (const s of [-1, 1]) { const lb = new THREE.Mesh(new RoundedBoxGeometry(.12, 2.3, .12, 2, .05), own(blue)); place(lb, s * 3.24, 2.0, TOP + .04); lb.rotation.z = s * .06; root.add(lb); reg(s < 0 ? 'lightL' : 'lightR', lb) }
  // small buttons
  const pill = (w, h, d) => new RoundedBoxGeometry(w, h, d, 3, Math.min(w, h) / 2 - .01);
  const cr = new THREE.Mesh(pill(.3, .72, .22), own(white)); place(cr, -3.82, 2.62, TOP + .06); cr.rotation.z = .18; root.add(reg('create', cr));
  const op = new THREE.Mesh(pill(.3, .72, .22), own(white)); place(op, 3.82, 2.62, TOP + .06); op.rotation.z = -.18; root.add(reg('options', op));
  const ps = new THREE.Mesh(new THREE.CylinderGeometry(.33, .35, .16, 40), own(dark)); ps.rotation.x = Math.PI / 2; place(ps, 0, -1.4, TOP + .12); root.add(reg('ps', ps));
  const mu = new THREE.Mesh(pill(.66, .18, .12), own(dark)); place(mu, 0, -2.2, TOP + .1); root.add(reg('mute', mu));
  for (let r = 0; r < 2; r++) for (let i = 0; i < 7 - r; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .05, 10), new THREE.MeshBasicMaterial({ color: 0x050608 })); d.rotation.x = Math.PI / 2; place(d, (i - (6 - r) / 2) * .17, .02 - r * .15, TOP + .1); root.add(d) }
  // D-pad
  const arrowShape = (() => { const s = new THREE.Shape(); s.moveTo(-.33, 0); s.lineTo(-.33, .6); s.quadraticCurveTo(-.33, .72, -.21, .72); s.lineTo(.21, .72); s.quadraticCurveTo(.33, .72, .33, .6); s.lineTo(.33, 0); s.lineTo(0, -.32); s.closePath(); return s })();
  const dc = [-5.09, .82];
  [['dUp', 0], ['dRight', -Math.PI / 2], ['dDown', Math.PI], ['dLeft', Math.PI / 2]].forEach(([n, a]) => {
    const g = new THREE.ExtrudeGeometry(arrowShape, { depth: .14, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 3 }); g.translate(0, .36, 0);
    const mats = [new THREE.MeshPhysicalMaterial({ color: 0xf2f4f8, roughness: .35, clearcoat: .6, map: symbolTex('arrow') }), own(white)];
    // UV for cap: map shape xy (-.4..1.1) to texture
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + .5), (uv.getY(i) - .1) / 1.1);
    const m = new THREE.Mesh(g, mats); m.rotation.z = a; place(m, dc[0], dc[1], TOP + .04); root.add(m);
    const dir = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0); reg(n, m, new THREE.Vector3(dc[0], dc[1], TOP + .3).addScaledVector(dir, .8)) });
  // face buttons
  const fc = [5.06, .82], fr = 1.23;
  [['triangle', 0, 1, 'tri'], ['circle', 1, 0, 'cir'], ['cross', 0, -1, 'crs'], ['square', -1, 0, 'sq']].forEach(([n, dx, dy, k]) => {
    const g = new THREE.CylinderGeometry(.5, .52, .26, 56);
    const mats = [own(white), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .3, clearcoat: .7, map: symbolTex(k) }), own(white)];
    const m = new THREE.Mesh(g, mats); m.rotation.x = Math.PI / 2; m.rotation.y = 0; place(m, fc[0] + dx * fr, fc[1] + dy * fr, TOP + .12); root.add(reg(n, m, new THREE.Vector3(fc[0] + dx * fr, fc[1] + dy * fr, TOP + .32))) });
  // sticks
  const lathe = new THREE.LatheGeometry([[0, .3], [.5, .28], [.7, .34], [.8, .42], [.82, .35], [.8, .18], [.66, 0], [.32, -.25], [.3, -.6]].map(p => new THREE.Vector2(p[0], p[1])), 56);
  for (const [n, x] of [['lstick', -2.54], ['rstick', 2.54]]) {
    const g = new THREE.Group(); const base = new THREE.Mesh(new THREE.TorusGeometry(.95, .13, 12, 56), dark); g.add(base);
    const cap = new THREE.Mesh(lathe, own(dark)); cap.rotation.x = Math.PI / 2; cap.position.z = .55; g.add(cap);
    const grip = new THREE.Mesh(new THREE.TorusGeometry(.78, .055, 8, 72), new THREE.MeshStandardMaterial({ color: 0x343842, roughness: .95 })); grip.position.z = .97; g.add(grip);
    place(g, x, -1.4, TOP + .04); root.add(g); reg(n, g, new THREE.Vector3(x, -1.4, TOP + 1.05 + droop(-1.4))); parts[n].cap = cap }
  // shoulders
  for (const [n, s] of [['L1', -1], ['R1', 1]]) { const m = new THREE.Mesh(new RoundedBoxGeometry(2.2, .55, .6, 4, .22), own(black)); m.position.set(s * 4.95, 4.05, .95); m.rotation.z = -s * .08; root.add(reg(n, m, new THREE.Vector3(s * 4.95, 4.3, 1.3))) }
  for (const [n, s] of [['L2', -1], ['R2', 1]]) {
    const g = new THREE.Group(); const m = new THREE.Mesh(new RoundedBoxGeometry(1.95, 1.25, .62, 4, .28), own(black)); m.position.set(0, .5, 0); m.rotation.x = -.55; g.add(m);
    g.position.set(s * 4.95, 3.95, -.2); g.rotation.z = -s * .08; root.add(g); reg(n, g, new THREE.Vector3(s * 4.95, 4.9, -.1)); parts[n].mesh = m }
  // back paddles (pro / Edge-style controllers only)
  for (const [n, s] of [['BL', -1], ['BR', 1]]) { const m = new THREE.Mesh(new RoundedBoxGeometry(.5, 1.9, .16, 3, .07), own(black)); m.position.set(s * 3.6, -2.9, -.95 + droop(-2.9) * .4); m.rotation.set(-.25, 0, s * .32); m.visible = false; root.add(reg(n, m, new THREE.Vector3(s * 3.6, -2.9, -1.3))) }
  return { root, parts };
}
