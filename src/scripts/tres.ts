/* ── Los objetos ────────────────────────────────────────────────────────────
   WebGL de verdad (Three.js) en un solo lienzo fijo. Cada objeto está anclado a
   un hueco del HTML (`data-objeto`): se dibuja donde está ese hueco y se va con
   él al bajar, así que el núcleo vive en la portada y cada servicio tiene su
   propia pieza. Todo es decoración: si no hay WebGL, si el equipo es modesto o
   si la persona pidió menos movimiento, la página se lee igual. */
import {
  ACESFilmicToneMapping, AdditiveBlending, BoxGeometry, BufferAttribute, BufferGeometry, ConeGeometry,
  CylinderGeometry, DirectionalLight, EdgesGeometry, Group, HemisphereLight, IcosahedronGeometry,
  LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, Object3D, OctahedronGeometry,
  PMREMGenerator, PerspectiveCamera, PointLight, Points, PointsMaterial, Scene, SphereGeometry,
  TorusGeometry, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';

const AZUL = 0x5980a6;
const AZUL_CLARO = 0xb5d9fd;
const AZUL_HONDO = 0x1d2d3d;
const PAPEL = 0xf2f2f3;

const acero = new MeshStandardMaterial({ color: AZUL, metalness: 0.92, roughness: 0.22 });
const claro = new MeshStandardMaterial({ color: AZUL_CLARO, metalness: 0.4, roughness: 0.13 });
const papel = new MeshStandardMaterial({ color: PAPEL, metalness: 0.3, roughness: 0.26 });
const hondo = new MeshStandardMaterial({ color: AZUL_HONDO, metalness: 0.85, roughness: 0.4 });
const hilo = new LineBasicMaterial({ color: AZUL_CLARO, transparent: true, opacity: 0.3 });

/* `gira` positivo = vuelta entera continua (solo el núcleo). Negativo = vaivén
   de esa amplitud: lo que tiene cara, como una pantalla o una diana, nunca debe
   darnos la espalda. */
type Suelta = { o: Object3D; gx: number; gy: number; gz: number; fase: number; amp: number; y0?: number };
type Pieza = { grupo: Group; sueltas: Suelta[]; gira: number };

const caja = (x: number, y: number, z: number, m: MeshStandardMaterial) => new Mesh(new BoxGeometry(x, y, z), m);
const bola = (r: number, m: MeshStandardMaterial) => new Mesh(new SphereGeometry(r, 26, 18), m);
const aro = (r: number, t: number, m: MeshStandardMaterial, arco?: number) =>
  new Mesh(new TorusGeometry(r, t, 12, 64, arco), m);

function suelta(o: Object3D, amp = 0.12): Suelta {
  return { o, gx: (Math.random() - 0.5) * 0.4, gy: (Math.random() - 0.5) * 0.5, gz: (Math.random() - 0.5) * 0.3, fase: Math.random() * 6.3, amp };
}

/* ── El núcleo de la marca: lo único que vive en la portada ─────────────── */
function hacerNucleo(chico: boolean): Pieza {
  const g = new Group();
  const sueltas: Suelta[] = [];

  const cuerpo = new Mesh(new IcosahedronGeometry(1.08, 1), acero);
  g.add(cuerpo);
  sueltas.push({ o: cuerpo, gx: 0, gy: 0.18, gz: 0, fase: 0, amp: 0 });

  const jaula = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(1.58, 1)), hilo);
  g.add(jaula);
  sueltas.push({ o: jaula, gx: 0, gy: -0.3, gz: 0, fase: 0, amp: 0 });

  [0.32, -0.74].forEach((t, i) => {
    const a = aro(2.02, 0.011, claro);
    a.rotation.set(t, i * 0.9, i * 0.5);
    g.add(a);
    sueltas.push({ o: a, gx: i ? -0.17 : 0, gy: 0, gz: i ? 0 : 0.22, fase: 0, amp: 0 });
  });

  /* Los cuatro cuadros del logotipo, girando pegados al núcleo */
  const marca = new Group();
  [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([x, y], i) => {
    const c = caja(0.2, 0.2, 0.2, i === 3 ? papel : acero);
    c.position.set(x * 0.19, y * 0.19, 2.12);
    marca.add(c);
  });
  g.add(marca);
  sueltas.push({ o: marca, gx: 0, gy: 0, gz: -0.5, fase: 0, amp: 0 });

  const formas = [new OctahedronGeometry(0.3, 0), new IcosahedronGeometry(0.26, 0), new BoxGeometry(0.34, 0.34, 0.34), new SphereGeometry(0.22, 24, 16), new TorusGeometry(0.26, 0.075, 12, 40)];
  const n = chico ? 8 : 14;
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const a = i * 2.399963;
    const m = new Mesh(formas[i % formas.length], i % 5 === 0 ? claro : i % 3 === 0 ? hondo : acero);
    m.position.set(Math.cos(a) * r * 2.9, y * 2.2, Math.sin(a) * r * 2.9);
    m.scale.setScalar(0.72 + Math.random() * 0.6);
    g.add(m);
    sueltas.push(suelta(m, 0.16));
  }

  if (!chico) {
    const cant = 260;
    const pos = new Float32Array(cant * 3);
    for (let i = 0; i < cant; i++) {
      const r = 3.4 + Math.random() * 2.6;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * 0.7, r * Math.sin(b) * Math.sin(a)], i * 3);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    const polvo = new Points(geo, new PointsMaterial({ color: AZUL_CLARO, size: 0.035, transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false }));
    g.add(polvo);
    sueltas.push({ o: polvo, gx: 0, gy: 0.02, gz: 0, fase: 0, amp: 0 });
  }

  return { grupo: g, sueltas, gira: 0.1 };
}

/* ── Tienda en línea: una bolsa de compras y los productos ──────────────── */
function hacerTienda(): Pieza {
  const g = new Group();
  const sueltas: Suelta[] = [];

  const bolsa = new Group();
  bolsa.add(caja(1.5, 1.6, 0.8, acero));
  const borde = caja(1.57, 0.14, 0.87, claro);
  borde.position.y = 0.8;
  bolsa.add(borde);
  const asa = aro(0.4, 0.05, claro, Math.PI);
  asa.position.y = 0.86;
  bolsa.add(asa);
  const etiqueta = caja(0.34, 0.24, 0.03, papel);
  etiqueta.position.set(0.52, 0.3, 0.43);
  etiqueta.rotation.z = -0.22;
  bolsa.add(etiqueta);
  g.add(bolsa);
  sueltas.push({ o: bolsa, gx: 0, gy: 0, gz: 0, fase: 1.2, amp: 0.07 });

  /* Los productos que entran al carrito */
  const prods: Object3D[] = [caja(0.42, 0.42, 0.42, claro), bola(0.26, acero), caja(0.34, 0.5, 0.34, hondo), new Mesh(new OctahedronGeometry(0.3, 0), acero)];
  prods.forEach((p, i) => {
    const a = (i / prods.length) * Math.PI * 2 + 0.5;
    p.position.set(Math.cos(a) * 1.55, 0.6 + Math.sin(a * 1.7) * 0.9, Math.sin(a) * 1.1);
    g.add(p);
    sueltas.push(suelta(p, 0.17));
  });

  return { grupo: g, sueltas, gira: -0.34 };
}

/* ── Página de negocio: la pantalla grande y el teléfono ────────────────── */
function hacerNegocio(): Pieza {
  const g = new Group();
  const sueltas: Suelta[] = [];

  const pantalla = new Group();
  pantalla.add(caja(2.3, 1.5, 0.08, hondo));
  const barra = caja(2.3, 0.2, 0.09, acero);
  barra.position.y = 0.65;
  pantalla.add(barra);
  [-1, 0, 1].forEach((i) => {
    const p = bola(0.035, claro);
    p.position.set(-0.98 + i * 0.1, 0.65, 0.06);
    pantalla.add(p);
  });
  const vista = caja(2.08, 1.16, 0.02, hondo);
  vista.position.set(0, -0.12, 0.05);
  pantalla.add(vista);
  const titular = caja(1.1, 0.12, 0.02, papel);
  titular.position.set(-0.4, 0.25, 0.07);
  pantalla.add(titular);
  const boton = caja(0.5, 0.16, 0.02, claro);
  boton.position.set(-0.7, -0.05, 0.07);
  pantalla.add(boton);
  pantalla.position.x = -0.2;
  g.add(pantalla);
  sueltas.push({ o: pantalla, gx: 0, gy: 0, gz: 0, fase: 0.4, amp: 0.06 });

  const telefono = new Group();
  telefono.add(caja(0.56, 1.04, 0.09, acero));
  const lamina = caja(0.46, 0.9, 0.02, claro);
  lamina.position.z = 0.055;
  telefono.add(lamina);
  telefono.position.set(1.18, -0.6, 0.5);
  telefono.rotation.set(0, -0.4, 0.12);
  g.add(telefono);
  sueltas.push({ o: telefono, gx: 0, gy: 0, gz: 0, fase: 2.1, amp: 0.1 });

  return { grupo: g, sueltas, gira: -0.3 };
}

/* ── Landing de campaña: una página, un objetivo ────────────────────────── */
function hacerDiana(): Pieza {
  const g = new Group();
  const sueltas: Suelta[] = [];

  const diana = new Group();
  [[1.5, acero], [1.05, claro], [0.6, acero]].forEach(([r, m]) => diana.add(aro(r as number, 0.075, m as MeshStandardMaterial)));
  diana.add(bola(0.2, claro));
  const fondo = new Mesh(new IcosahedronGeometry(1.72, 1), hondo);
  fondo.scale.z = 0.12;
  fondo.position.z = -0.14;
  diana.add(fondo);
  g.add(diana);
  sueltas.push({ o: diana, gx: 0, gy: 0, gz: 0, fase: 0.8, amp: 0.06 });

  /* La flecha que ya dio en el centro */
  const flecha = new Group();
  const vara = new Mesh(new CylinderGeometry(0.035, 0.035, 1.5, 14), papel);
  vara.rotation.x = Math.PI / 2;
  vara.position.z = 0.75;
  flecha.add(vara);
  const punta = new Mesh(new ConeGeometry(0.1, 0.26, 16), claro);
  punta.rotation.x = -Math.PI / 2;
  punta.position.z = 0.1;
  flecha.add(punta);
  [0, 1, 2].forEach((i) => {
    const pluma = caja(0.02, 0.24, 0.3, acero);
    pluma.position.z = 1.4;
    pluma.rotation.z = (i / 3) * Math.PI * 2;
    flecha.add(pluma);
  });
  flecha.rotation.set(-0.3, 0.42, 0);
  g.add(flecha);
  sueltas.push({ o: flecha, gx: 0, gy: 0, gz: 0, fase: 2.6, amp: 0.05 });

  [1, 2].forEach((i) => {
    const a = aro(0.3, 0.05, i === 1 ? claro : acero);
    a.position.set(i === 1 ? -1.9 : 1.75, i === 1 ? 1.2 : -1.3, 0.5);
    a.rotation.set(0.6, 0.4, 0);
    g.add(a);
    sueltas.push(suelta(a, 0.18));
  });

  return { grupo: g, sueltas, gira: -0.24 };
}

/* ── Datos y acompañamiento: el panel que vas a recibir ─────────────────── */
function hacerBarras(): Pieza {
  const g = new Group();
  const sueltas: Suelta[] = [];

  const panel = new Group();
  const base = caja(2.5, 0.1, 1.1, hondo);
  base.position.y = -0.9;
  panel.add(base);
  [0.55, 0.95, 0.75, 1.35, 1.75].forEach((h, i) => {
    const b = caja(0.3, h, 0.3, i === 4 ? claro : acero);
    b.position.set(-0.92 + i * 0.46, -0.85 + h / 2, 0);
    panel.add(b);
  });
  g.add(panel);
  sueltas.push({ o: panel, gx: 0, gy: 0, gz: 0, fase: 0.2, amp: 0.06 });

  const senal = bola(0.19, papel);
  senal.position.set(0.84, 1.25, 0.3);
  g.add(senal);
  sueltas.push(suelta(senal, 0.2));

  const anillo = aro(0.42, 0.05, claro);
  anillo.position.set(-1.5, 0.75, 0.4);
  anillo.rotation.set(0.5, 0.6, 0);
  g.add(anillo);
  sueltas.push(suelta(anillo, 0.16));

  const dado = caja(0.34, 0.34, 0.34, acero);
  dado.position.set(1.6, -0.1, 0.6);
  g.add(dado);
  sueltas.push(suelta(dado, 0.18));

  return { grupo: g, sueltas, gira: -0.3 };
}

const catalogo: Record<string, (chico: boolean) => Pieza> = {
  nucleo: hacerNucleo,
  tienda: () => hacerTienda(),
  negocio: () => hacerNegocio(),
  landing: () => hacerDiana(),
  datos: () => hacerBarras(),
};

/* ── El motor ───────────────────────────────────────────────────────────── */
export function iniciarNucleo(lienzo: HTMLCanvasElement, quieto = false) {
  const anclas = Array.from(document.querySelectorAll<HTMLElement>('[data-objeto]'))
    .filter((el) => catalogo[el.dataset.objeto!]);
  if (!anclas.length) return false;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return false; /* sin WebGL la página se queda con el plano dibujado y ya */
  }

  const chico = matchMedia('(max-width: 760px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, chico ? 1.5 : 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const escena = new Scene();
  const camara = new PerspectiveCamera(42, 1, 0.1, 160);
  camara.position.z = 9;

  /* El entorno es lo que hace que el metal parezca metal y no plástico negro */
  const pmrem = new PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.6;
  pmrem.dispose();

  escena.add(new HemisphereLight(AZUL_CLARO, 0x08090a, 0.55));
  const clave = new DirectionalLight(0xffffff, 2.4);
  clave.position.set(-4, 5, 6);
  escena.add(clave);
  const contra = new PointLight(AZUL_CLARO, 90, 30, 2);
  contra.position.set(3.4, -2.2, -4.5);
  escena.add(contra);
  /* Relleno frontal: sin él, las caras planas de los objetos se van a negro */
  const relleno = new DirectionalLight(AZUL_CLARO, 1.1);
  relleno.position.set(3, -1, 8);
  escena.add(relleno);

  /* Cada objeto vive pegado a su hueco del HTML */
  const piezas = anclas.map((el) => {
    const p = catalogo[el.dataset.objeto!](chico);
    escena.add(p.grupo);
    return { el, ...p, x: 0, y: 0, lado: 0, dentro: false };
  });

  let unidad = 1; /* unidades de mundo por píxel, al nivel z = 0 */
  function medir() {
    const w = innerWidth, h = innerHeight;
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    unidad = (2 * camara.position.z * Math.tan((camara.fov * Math.PI) / 360)) / h;
    colocar();
  }

  /* El hueco manda: centro y tamaño se leen del HTML, no se inventan */
  function colocar() {
    const w = innerWidth, h = innerHeight;
    for (const p of piezas) {
      const r = p.el.getBoundingClientRect();
      p.dentro = r.bottom > -h * 0.4 && r.top < h * 1.4;
      p.grupo.visible = p.dentro;
      if (!p.dentro) continue;
      p.x = (r.left + r.width / 2 - w / 2) * unidad;
      p.y = -(r.top + r.height / 2 - h / 2) * unidad;
      p.lado = Math.min(r.width, r.height) * unidad;
      p.grupo.position.set(p.x, p.y, 0);
      p.grupo.scale.setScalar((p.lado / 3.7) * (chico ? 0.9 : 1));
    }
  }

  let reloj = 0;
  let pintado = false;
  function dibujar(t: number) {
    const d = Math.min(0.05, t - reloj || 0.016);
    reloj = t;
    raton.dy += (raton.y - raton.dy) * Math.min(1, d * 3);
    colocar();
    let algo = false;
    for (const p of piezas) {
      if (!p.dentro) continue;
      algo = true;
      if (!quieto) {
        if (p.gira > 0) p.grupo.rotation.y += d * p.gira;
        else p.grupo.rotation.y = Math.sin(t * 0.32) * -p.gira;
        p.grupo.rotation.x += (raton.dy * 0.2 - p.grupo.rotation.x) * Math.min(1, d * 4);
        for (const s of p.sueltas) {
          s.o.rotation.x += s.gx * d;
          s.o.rotation.y += s.gy * d;
          s.o.rotation.z += s.gz * d;
          if (s.amp) s.o.position.y = s.y0! + Math.sin(t * 0.7 + s.fase) * s.amp;
        }
      }
    }
    /* Si no queda nada a la vista hay que limpiar: el lienzo conserva el último
       fotograma dibujado y las piezas se quedarían flotando en otro capítulo. */
    if (algo) { renderer.render(escena, camara); pintado = true; }
    else if (pintado) { renderer.clear(); pintado = false; }
  }

  const raton = { y: 0, dy: 0 };
  if (!quieto) addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') raton.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  for (const p of piezas) for (const s of p.sueltas) s.y0 = s.o.position.y;
  medir();
  addEventListener('resize', medir);

  if (quieto) {
    /* Movimiento reducido: el objeto se ve, pero como una fotografía. Solo se
       vuelve a dibujar cuando la página se mueve, nunca por su cuenta. */
    let pedido = false;
    const repintar = () => {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(() => { pedido = false; dibujar(0); });
    };
    addEventListener('scroll', repintar, { passive: true });
    dibujar(0);
    gsap.set(lienzo, { autoAlpha: 1 });
  } else {
    let vivo = true;
    gsap.ticker.add((t) => vivo && dibujar(t));
    document.addEventListener('visibilitychange', () => {
      vivo = !document.hidden;
      reloj = gsap.ticker.time;
    });
    gsap.fromTo(lienzo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, ease: 'power2.out', delay: 0.2 });
  }
  return true;
}
