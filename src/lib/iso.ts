/**
 * Isometric projection used by every scene in the page.
 *
 * World coordinates are (x, y, z) in grid units: x goes right-down, y goes
 * left-down, z goes up. The projection is the classic 2:1 isometric, so a unit
 * cube is twice as wide as it is tall and every edge lands on a half-pixel-free
 * angle. Everything is computed at build time: the browser only gets polygons.
 */
const COS = Math.cos(Math.PI / 6); // 0.866
const SIN = Math.sin(Math.PI / 6); // 0.5

export type Pt = [number, number];

/** One world point to screen, in SVG units. */
export const pt = (x: number, y: number, z = 0, u = 1): Pt => [
  (x - y) * COS * u,
  (x + y) * SIN * u - z * u,
];

const join = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

/** The three visible faces of a box standing on (x, y) with size (w, d, h). */
export function caja(x: number, y: number, z: number, w: number, d: number, h: number, u = 1) {
  const top = join([
    pt(x, y, z + h, u),
    pt(x + w, y, z + h, u),
    pt(x + w, y + d, z + h, u),
    pt(x, y + d, z + h, u),
  ]);
  // left face: the one facing down-left (along +y)
  const izq = join([
    pt(x, y + d, z + h, u),
    pt(x + w, y + d, z + h, u),
    pt(x + w, y + d, z, u),
    pt(x, y + d, z, u),
  ]);
  // right face: the one facing down-right (along +x)
  const der = join([
    pt(x + w, y, z + h, u),
    pt(x + w, y + d, z + h, u),
    pt(x + w, y + d, z, u),
    pt(x + w, y, z, u),
  ]);
  return { top, izq, der };
}

/** A flat slab on the ground plane (no sides), handy for floors and shadows. */
export const losa = (x: number, y: number, w: number, d: number, z = 0, u = 1) =>
  join([pt(x, y, z, u), pt(x + w, y, z, u), pt(x + w, y + d, z, u), pt(x, y + d, z, u)]);

/** A grid of lines on the ground plane, as an SVG path. */
export function rejilla(w: number, d: number, paso = 1, u = 1, z = 0) {
  const p: string[] = [];
  for (let x = 0; x <= w; x += paso) {
    const a = pt(x, 0, z, u); const b = pt(x, d, z, u);
    p.push(`M${a[0].toFixed(2)},${a[1].toFixed(2)}L${b[0].toFixed(2)},${b[1].toFixed(2)}`);
  }
  for (let y = 0; y <= d; y += paso) {
    const a = pt(0, y, z, u); const b = pt(w, y, z, u);
    p.push(`M${a[0].toFixed(2)},${a[1].toFixed(2)}L${b[0].toFixed(2)},${b[1].toFixed(2)}`);
  }
  return p.join('');
}
