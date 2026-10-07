/* ── Los objetos ────────────────────────────────────────────────────────────
   WebGL de verdad (Three.js) en un solo lienzo fijo. Cada objeto se ancla a un
   hueco del HTML (`data-objeto`): se dibuja donde está ese hueco y se va con él
   al bajar. Y cada uno reacciona al scroll: `foco` vale 0 cuando el hueco está
   entrando o saliendo de la pantalla y 1 cuando está justo en el centro, así
   que las piezas se arman mientras lo miras y se sueltan cuando lo dejas. */
import {
  ACESFilmicToneMapping, AdditiveBlending, BoxGeometry, BufferAttribute, BufferGeometry,
  DirectionalLight, EdgesGeometry, Group, HemisphereLight, IcosahedronGeometry, LineBasicMaterial,
  LineSegments, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, OctahedronGeometry, PMREMGenerator,
  PerspectiveCamera, PointLight, Points, PointsMaterial, Scene, SphereGeometry, TorusGeometry,
  Vector3, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';

const AZUL = 0x5980a6;
const AZUL_CLARO = 0xb5d9fd;
const AZUL_HONDO = 0x1d2d3d;
const PAPEL = 0xf2f2f3;

/* Cinco materias, un solo tono: espejo, satén, mate, nieve y brasa encendida */
const cromo = new MeshPhysicalMaterial({ color: AZUL, metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.08 });
const saten = new MeshPhysicalMaterial({ color: AZUL_HONDO, metalness: 1, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.22 });
const mate = new MeshStandardMaterial({ color: AZUL, metalness: 0.9, roughness: 0.3 });
const nieve = new MeshPhysicalMaterial({ color: PAPEL, metalness: 0.2, roughness: 0.14, clearcoat: 1 });
const brasa = new MeshStandardMaterial({ color: AZUL, emissive: AZUL_CLARO, emissiveIntensity: 0.65, metalness: 0.5, roughness: 0.25 });
const hilo = new LineBasicMaterial({ color: AZUL_CLARO, transparent: true, opacity: 0.3 });

type Pieza = { grupo: Group; animar: (t: number, d: number, foco: number) => void };

const caja = (x: number, y: number, z: number, m: MeshStandardMaterial) => new Mesh(new BoxGeometry(x, y, z), m);
const bola = (r: number, m: MeshStandardMaterial) => new Mesh(new SphereGeometry(r, 28, 20), m);
const aro = (r: number, t: number, m: MeshStandardMaterial) => new Mesh(new TorusGeometry(r, t, 14, 72), m);
const suave = (a: number, b: number, k: number) => a + (b - a) * k;
/* Curva de entrada: arranca lento, llega firme. La misma de toda la página. */
const ease = (k: number) => 1 - Math.pow(1 - k, 3);

/* Reparto de Fibonacci: puntos repartidos sobre una esfera, sin grumos */
function esfera(i: number, n: number, r: number, out: Vector3) {
  const y = 1 - (i / Math.max(1, n - 1)) * 2;
  const c = Math.sqrt(Math.max(0, 1 - y * y));
  const a = i * 2.399963;
  return out.set(Math.cos(a) * c * r, y * r * 0.82, Math.sin(a) * c * r);
}

/* ── Portada · el núcleo de la marca ────────────────────────────────────── */
function hacerNucleo(chico: boolean): Pieza {
  const g = new Group();
  const cuerpo = new Mesh(new IcosahedronGeometry(1.06, 2), saten);
  const jaula = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(1.56, 1)), hilo);
  g.add(cuerpo, jaula);

  const aros = [0.32, -0.74].map((t, i) => {
    const a = aro(2, 0.012, cromo);
    a.rotation.set(t, i * 0.9, i * 0.5);
    g.add(a);
    return a;
  });

  const marca = new Group();
  [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([x, y], i) => {
    const c = caja(0.19, 0.19, 0.19, i === 3 ? nieve : cromo);
    c.position.set(x * 0.19, y * 0.19, 2.08);
    marca.add(c);
  });
  g.add(marca);

  const formas = [new OctahedronGeometry(0.3, 0), new IcosahedronGeometry(0.26, 0), new BoxGeometry(0.33, 0.33, 0.33), new SphereGeometry(0.22, 24, 16)];
  const n = chico ? 9 : 15;
  const base = new Vector3();
  const lunas = Array.from({ length: n }, (_, i) => {
    const m = new Mesh(formas[i % formas.length], i % 5 === 0 ? nieve : i % 3 === 0 ? mate : cromo);
    m.scale.setScalar(0.7 + Math.random() * 0.6);
    g.add(m);
    return { m, i, giro: new Vector3(Math.random() * 0.4, Math.random() * 0.5, Math.random() * 0.3), fase: Math.random() * 6.3 };
  });

  let polvo: Points | null = null;
  if (!chico) {
    const cant = 300;
    const pos = new Float32Array(cant * 3);
    const v = new Vector3();
    for (let i = 0; i < cant; i++) pos.set(esfera(i, cant, 3.6 + Math.random() * 2.6, v).toArray(), i * 3);
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    polvo = new Points(geo, new PointsMaterial({ color: AZUL_CLARO, size: 0.035, transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false }));
    g.add(polvo);
  }

  return {
    grupo: g,
    animar(t, d, foco) {
      cuerpo.rotation.y += d * 0.22;
      cuerpo.rotation.x = Math.sin(t * 0.3) * 0.14;
      jaula.rotation.y -= d * 0.32;
      jaula.scale.setScalar(suave(1.1, 1, ease(foco)) + Math.sin(t * 0.8) * 0.012);
      aros[0].rotation.z += d * 0.26;
      aros[1].rotation.x -= d * 0.2;
      marca.rotation.z -= d * 0.55;
      /* Al centrarse el capítulo, las lunas se cierran sobre el núcleo */
      const r = suave(3.9, 2.55, ease(foco));
      for (const l of lunas) {
        esfera(l.i, lunas.length, r, base);
        l.m.position.set(base.x, base.y + Math.sin(t * 0.7 + l.fase) * 0.16, base.z);
        l.m.rotation.x += l.giro.x * d;
        l.m.rotation.y += l.giro.y * d;
        l.m.rotation.z += l.giro.z * d;
      }
      if (polvo) { polvo.rotation.y = t * 0.014; polvo.scale.setScalar(suave(1.25, 1, foco)); }
    },
  };
}

/* ── Tienda · el enjambre que se apila ──────────────────────────────────── */
function hacerApilado(chico: boolean): Pieza {
  const g = new Group();
  const n = chico ? 9 : 14;
  const suelto = new Vector3();
  const piezas = Array.from({ length: n }, (_, i) => {
    const lado = 0.46 + (i % 3) * 0.08;
    const m = new Mesh(new BoxGeometry(lado, lado, lado), i % 5 === 0 ? nieve : i % 3 === 0 ? saten : cromo);
    /* Destino: una torre de tres en fondo, como un pedido ya armado */
    const col = i % 3, fila = Math.floor(i / 3);
    m.userData.fin = new Vector3((col - 1) * 0.56, -1.3 + fila * 0.56, ((i * 7) % 3 - 1) * 0.1);
    m.userData.ini = esfera(i, n, 3.2, new Vector3()).clone();
    m.userData.giro = new Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    g.add(m);
    return m;
  });
  const cinta = aro(1.95, 0.012, cromo);
  cinta.rotation.x = 1.25;
  g.add(cinta);

  return {
    grupo: g,
    animar(t, d, foco) {
      const k = ease(foco);
      g.rotation.y = Math.sin(t * 0.25) * 0.4;
      cinta.rotation.z += d * 0.3;
      cinta.scale.setScalar(suave(1.18, 0.92, k));
      for (const m of piezas) {
        const ini = m.userData.ini as Vector3, fin = m.userData.fin as Vector3, giro = m.userData.giro as Vector3;
        suelto.lerpVectors(ini, fin, k);
        m.position.set(suelto.x, suelto.y + Math.sin(t * 0.8 + ini.x) * 0.1 * (1 - k), suelto.z);
        m.rotation.set(giro.x * (1 - k), giro.y * (1 - k), giro.z * (1 - k));
      }
    },
  };
}

/* ── Página de negocio · las capas de una página, separándose ───────────── */
function hacerCapas(): Pieza {
  const g = new Group();
  /* ancho, alto, material, y, x cuando está abierta */
  const plan: [number, number, MeshStandardMaterial, number, number][] = [
    [2.1, 0.26, cromo, 1.08, 0],
    [1.5, 0.16, nieve, 0.62, -0.3],
    [2.1, 1.0, saten, -0.05, 0],
    [0.66, 0.2, brasa, -0.72, -0.72],
    [2.1, 0.5, cromo, -1.15, 0],
  ];
  const capas = plan.map(([w, h, mat, y, x]) => {
    const c = new Group();
    const placa = caja(w, h, 0.05, mat);
    const borde = new LineSegments(new EdgesGeometry(new BoxGeometry(w, h, 0.05)), hilo);
    c.add(placa, borde);
    c.userData.y = y;
    c.userData.x = x;
    g.add(c);
    return c;
  });
  const marco = new LineSegments(new EdgesGeometry(new BoxGeometry(2.42, 2.9, 0.06)), hilo);
  g.add(marco);
  g.rotation.set(0.2, -0.62, 0);

  return {
    grupo: g,
    animar(t, d, foco) {
      const k = ease(foco);
      /* Cerradas son una pantalla; al mirarlas se abren en sus capas */
      g.rotation.y = suave(-0.95, -0.42, k) + Math.sin(t * 0.3) * 0.1;
      g.rotation.x = 0.2 + Math.sin(t * 0.24) * 0.06;
      marco.scale.set(suave(0.8, 1, k), suave(0.7, 1, k), 1);
      capas.forEach((c, i) => {
        c.position.set(
          suave(0, c.userData.x, k),
          suave((i - 2) * 0.05, c.userData.y, k),
          suave((i - 2) * 0.03, (i - 2) * 0.42, k),
        );
        c.position.y += Math.sin(t * 0.6 + i) * 0.035 * k;
        c.rotation.z = suave(0.09 * (i - 2), 0, k);
      });
    },
  };
}

/* ── Landing · todo converge en un punto ────────────────────────────────── */
function hacerConverge(chico: boolean): Pieza {
  const g = new Group();
  const n = chico ? 16 : 30;
  const p = new Vector3();
  const esquirlas = Array.from({ length: n }, (_, i) => {
    const m = new Mesh(new OctahedronGeometry(0.17 + (i % 4) * 0.035, 0), i % 6 === 0 ? nieve : i % 3 === 0 ? saten : cromo);
    m.userData.ini = esfera(i, n, 3.9, new Vector3()).clone();
    g.add(m);
    return m;
  });
  const nucleo = bola(0.2, brasa);
  g.add(nucleo);
  const anillos = [1.5, 1.05, 0.62].map((r, i) => {
    const a = aro(r, 0.028, i === 1 ? saten : cromo);
    g.add(a);
    return a;
  });

  return {
    grupo: g,
    animar(t, d, foco) {
      const k = ease(foco);
      g.rotation.z += d * 0.05;
      g.rotation.y = Math.sin(t * 0.2) * 0.25;
      nucleo.scale.setScalar(suave(0.2, 1.5, k) + Math.sin(t * 2.4) * 0.07 * k);
      anillos.forEach((a, i) => {
        a.scale.setScalar(suave(1.9 + i * 0.3, 1, k));
        a.rotation.z += d * (0.12 + i * 0.07) * (i % 2 ? -1 : 1);
      });
      esquirlas.forEach((m, i) => {
        const ini = m.userData.ini as Vector3;
        /* Cada esquirla entra con su propio retraso: una lluvia, no un bloque */
        const kk = ease(Math.max(0, Math.min(1, foco * 1.5 - (i % 7) * 0.07)));
        p.copy(ini).multiplyScalar(suave(1, 0.12, kk));
        m.position.set(p.x, p.y + Math.sin(t * 0.9 + i) * 0.1 * (1 - kk), p.z);
        m.rotation.set(t * 0.4 + i, t * 0.3 + i, 0);
        m.scale.setScalar(suave(1, 0.45, kk));
      });
    },
  };
}

/* ── Datos · la onda del panel ──────────────────────────────────────────── */
function hacerOnda(chico: boolean): Pieza {
  const g = new Group();
  const cols = chico ? 6 : 9, filas = chico ? 3 : 5;
  const barras: Mesh[] = [];
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < filas; z++) {
      const b = caja(0.17, 1, 0.17, x === cols - 1 ? brasa : z % 2 ? saten : cromo);
      b.position.set((x - (cols - 1) / 2) * 0.32, 0, (z - (filas - 1) / 2) * 0.32);
      b.userData.f = (x + z) * 0.55;
      g.add(b);
      barras.push(b);
    }
  }
  const base = new LineSegments(new EdgesGeometry(new BoxGeometry(cols * 0.32, 0.02, filas * 0.32)), hilo);
  base.position.y = -0.9;
  g.add(base);
  g.rotation.set(0.38, -0.5, 0);

  return {
    grupo: g,
    animar(t, d, foco) {
      const k = ease(foco);
      g.rotation.y = -0.5 + Math.sin(t * 0.22) * 0.22;
      for (const b of barras) {
        /* La onda solo sube cuando el capítulo está centrado */
        const h = 0.18 + (Math.sin(t * 1.5 + b.userData.f) * 0.5 + 0.5) * 1.5 * k;
        b.scale.y = h;
        b.position.y = -0.9 + h / 2;
      }
    },
  };
}

const catalogo: Record<string, (chico: boolean) => Pieza> = {
  nucleo: hacerNucleo,
  tienda: hacerApilado,
  negocio: () => hacerCapas(),
  landing: hacerConverge,
  datos: hacerOnda,
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
  renderer.toneMappingExposure = 1.08;

  const escena = new Scene();
  const camara = new PerspectiveCamera(42, 1, 0.1, 160);
  camara.position.z = 9;

  /* El entorno es lo que hace que el metal parezca metal y no plástico negro */
  const pmrem = new PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.62;
  pmrem.dispose();

  escena.add(new HemisphereLight(AZUL_CLARO, 0x08090a, 0.55));
  const clave = new DirectionalLight(0xffffff, 2.5);
  clave.position.set(-4, 5, 6);
  escena.add(clave);
  const contra = new PointLight(AZUL_CLARO, 90, 30, 2);
  contra.position.set(3.4, -2.2, -4.5);
  escena.add(contra);
  /* Relleno frontal: sin él, las caras planas de los objetos se van a negro */
  const relleno = new DirectionalLight(AZUL_CLARO, 1.2);
  relleno.position.set(3, -1, 8);
  escena.add(relleno);

  const piezas = anclas.map((el) => {
    const p = catalogo[el.dataset.objeto!](chico);
    escena.add(p.grupo);
    return { el, ...p, dentro: false, foco: 0 };
  });

  let unidad = 1; /* unidades de mundo por píxel, al nivel z = 0 */
  function medir() {
    const w = innerWidth, h = innerHeight;
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    unidad = (2 * camara.position.z * Math.tan((camara.fov * Math.PI) / 360)) / h;
    colocar(1);
  }

  /* El hueco manda: centro, tamaño y avance se leen del HTML, no se inventan */
  function colocar(k: number) {
    const w = innerWidth, h = innerHeight;
    for (const p of piezas) {
      const r = p.el.getBoundingClientRect();
      p.dentro = r.bottom > -h * 0.3 && r.top < h * 1.3;
      p.grupo.visible = p.dentro;
      if (!p.dentro) continue;
      p.grupo.position.set(
        (r.left + r.width / 2 - w / 2) * unidad,
        -(r.top + r.height / 2 - h / 2) * unidad,
        0,
      );
      p.grupo.scale.setScalar((Math.min(r.width, r.height) * unidad / 3.9) * (chico ? 0.92 : 1));
      /* 0 al entrar o salir, 1 justo en el centro de la pantalla */
      const avance = 1 - (r.top + r.height / 2) / h;
      const meta = Math.max(0, 1 - Math.abs(avance * 2 - 1) * 1.25);
      p.foco += (meta - p.foco) * k;
    }
  }

  const raton = { y: 0, dy: 0 };
  if (!quieto) addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') raton.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  let reloj = 0;
  let pintado = false;
  function dibujar(t: number) {
    const d = Math.min(0.05, t - reloj || 0.016);
    reloj = t;
    const k = quieto ? 1 : 1 - Math.pow(0.004, d);
    raton.dy += (raton.y - raton.dy) * Math.min(1, d * 3);
    colocar(k);

    let algo = false;
    for (const p of piezas) {
      if (!p.dentro) continue;
      algo = true;
      p.animar(quieto ? 0 : t, quieto ? 0 : d, quieto ? 1 : p.foco);
      if (!quieto) p.grupo.rotation.x += (raton.dy * 0.16 - p.grupo.rotation.x) * Math.min(1, d * 3);
    }
    /* Si no queda nada a la vista hay que limpiar: el lienzo conserva el último
       fotograma dibujado y las piezas se quedarían flotando en otro capítulo. */
    if (algo) { renderer.render(escena, camara); pintado = true; }
    else if (pintado) { renderer.clear(); pintado = false; }
  }

  medir();
  addEventListener('resize', medir);

  if (quieto) {
    /* Movimiento reducido: el objeto se ve armado, pero como una fotografía.
       Solo se vuelve a dibujar cuando la página se mueve, nunca por su cuenta. */
    let pedido = false;
    const repintar = () => {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(() => { pedido = false; medir(); dibujar(0); });
    };
    addEventListener('scroll', repintar, { passive: true });
    /* Un solo pintado al arrancar se pierde: la medida cambia cuando entran las
       tipografías y las imágenes, así que se repinta cuando eso ocurre. */
    repintar();
    document.fonts?.ready.then(repintar);
    addEventListener('load', repintar);
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
