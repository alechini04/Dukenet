import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

const motion = document.documentElement.classList.contains('motion');
// Reduced motion keeps reveals and count-ups; travel, pinning and parallax drop out.
const rm = document.documentElement.classList.contains('rm');
const Y = (n: number) => (rm ? 0 : n);
const HEADER = 74;

/* ── Scroll suave ───────────────────────────────────────────────────────── */
let lenis: Lenis | null = null;
if (motion && !rm) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const irA = (hash: string) => {
  const destino = hash === '#inicio' ? document.body : $(hash);
  if (!destino) return;
  if (lenis) lenis.scrollTo(destino as HTMLElement, { offset: hash === '#inicio' ? 0 : -HEADER + 1, duration: 1.3 });
  else destino.scrollIntoView({ block: 'start' });
};

document.addEventListener('click', (e) => {
  // "#algo" y, cuando ya estamos en la portada, también "/#algo": los enlaces del
  // encabezado son absolutos para que funcionen desde las páginas legales
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
  if (!a) return;
  const bruto = a.getAttribute('href')!;
  if (bruto === '#' || bruto === '/#') return;
  const hash = bruto.startsWith('/#') ? bruto.slice(1) : bruto;
  if (bruto.startsWith('/#') && location.pathname !== '/') return;
  if (!$(hash) && hash !== '#inicio') return;
  e.preventDefault();
  cerrarMenu();
  irA(hash);
  history.replaceState(null, '', hash);
  const plan = a.dataset.plan;
  if (plan) marcarPlan(plan);
});

/* ── Menú ───────────────────────────────────────────────────────────────── */
const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
const menu = $('[data-menu]');
const menuLabel = $('[data-menu-label]');
function abrirMenu() {
  if (!toggle || !menu) return;
  menu.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  if (menuLabel) menuLabel.textContent = 'Cerrar menú';
  lenis?.stop();
  document.body.style.overflow = 'hidden';
  if (motion) gsap.fromTo($$('li, .menu__cta', menu), { y: Y(20), autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.55, ease: 'power3.out' });
  $<HTMLAnchorElement>('a', menu)?.focus();
}
function cerrarMenu() {
  if (!toggle || !menu || menu.hidden) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  if (menuLabel) menuLabel.textContent = 'Abrir menú';
  lenis?.start();
  document.body.style.overflow = '';
}
toggle?.addEventListener('click', () => (menu?.hidden ? abrirMenu() : cerrarMenu()));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) { cerrarMenu(); toggle?.focus(); }
});
matchMedia('(min-width: 901px)').addEventListener('change', (m) => m.matches && cerrarMenu());

/* ── Encabezado: fondo al despegar, barra de avance, enlace activo ──────── */
const hdr = $('[data-hdr]');
const avance = $('[data-avance]');
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: (self) => {
    if (avance) avance.style.transform = `scaleX(${self.progress.toFixed(4)})`;
    hdr?.classList.toggle('is-pegado', self.scroll() > 40);
  },
});
$$('[data-cap]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec, start: 'top 45%', end: 'bottom 45%', refreshPriority: -1,
    onToggle: (self) => {
      if (!self.isActive) return;
      const id = sec.dataset.cap!;
      $$('[data-navlink]').forEach((l) => l.setAttribute('aria-current', String(l.dataset.navlink === id)));
    },
  });
});

/* ── Botón flotante: aparece entre la portada y el formulario ───────────── */
const flota = $('[data-flota]');
const contacto = $('#contacto');
if (flota && contacto) {
  const portada = $('#inicio')!;
  const revisar = () => {
    const pasoPortada = portada.getBoundingClientRect().bottom < innerHeight * 0.4;
    const enContacto = contacto.getBoundingClientRect().top < innerHeight * 0.85;
    flota.classList.toggle('oculta', !pasoPortada || enContacto);
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: revisar, onRefresh: revisar });
}

/* ── Formulario → WhatsApp ──────────────────────────────────────────────── */
function marcarPlan(plan: string) {
  const r = $$<HTMLInputElement>('input[name="plan"]').find((x) => x.value === plan);
  if (r) r.checked = true;
}
const form = $<HTMLFormElement>('[data-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const estado = $('[data-estado]', form)!;
  let primerFallo: HTMLInputElement | null = null;
  for (const key of ['nombre', 'negocio']) {
    const input = form.elements.namedItem(key) as HTMLInputElement;
    const mal = !String(data.get(key) || '').trim();
    input.closest('.campo')!.classList.toggle('con-error', mal);
    input.setAttribute('aria-invalid', String(mal));
    if (mal && !primerFallo) primerFallo = input;
  }
  const permiso = $<HTMLInputElement>('[data-permiso]', form);
  const faltaPermiso = !!permiso && !permiso.checked;
  form.classList.toggle('sin-permiso', faltaPermiso);
  if (primerFallo || faltaPermiso) {
    estado.textContent = faltaPermiso && !primerFallo
      ? 'Marca la autorización de datos para poder enviarlo.'
      : 'Revisa los campos marcados.';
    (primerFallo ?? permiso)?.focus();
    return;
  }
  const detalle = String(data.get('detalle') || '').trim();
  const txt = [
    'Hola DukeNet, quiero cotizar mi página.',
    `Nombre: ${String(data.get('nombre')).trim()}`,
    `Negocio: ${String(data.get('negocio')).trim()}`,
    `Necesito: ${data.get('plan')}`,
    detalle && `Detalle: ${detalle}`,
  ].filter(Boolean).join('\n');
  const url = `https://wa.me/${form.dataset.tel}?text=${encodeURIComponent(txt)}`;
  const win = window.open(url, '_blank', 'noopener');
  estado.textContent = win
    ? 'Listo: abrimos WhatsApp con tu mensaje escrito. Solo dale enviar.'
    : 'Tu navegador bloqueó la ventana. Toca de nuevo o escríbenos directo.';
  if (!win) location.href = url;
});
form?.addEventListener('change', (e) => {
  if ((e.target as HTMLInputElement).dataset.permiso !== undefined) form.classList.remove('sin-permiso');
});
form?.addEventListener('input', (e) => {
  const input = e.target as HTMLInputElement;
  const campo = input.closest('.campo');
  if (campo?.classList.contains('con-error') && input.value.trim()) {
    campo.classList.remove('con-error');
    input.setAttribute('aria-invalid', 'false');
  }
});

/* ══ Movimiento ══════════════════════════════════════════════════════════ */
if (motion) document.fonts.ready.then(iniciarMovimiento);

function iniciarMovimiento() {
  /* Portada: el título sube por líneas, la escena se arma bloque por bloque */
  const titulo = $('[data-titulo]');
  const escena = $('[data-escena]');
  if (titulo) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const tachado = $('[data-tachado]');
    tl.fromTo($$('.ln > span', titulo), rm ? { autoAlpha: 0 } : { yPercent: 110 },
      rm ? { autoAlpha: 1, duration: 0.8, stagger: 0.1 } : { yPercent: 0, duration: 1.05, stagger: 0.09 }, 0.1);
    if (tachado) tl.fromTo(tachado, { '--tachado': 0 }, { '--tachado': 1, duration: 0.6, ease: 'power2.inOut' }, 0.95);
    tl
      .fromTo($$('[data-aparece]'), { y: Y(22), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.09 }, 0.35);
    if (escena) {
      tl.fromTo($$('[data-bloque]', escena),
        { yPercent: rm ? 0 : 14, autoAlpha: 0, scale: rm ? 1 : 0.94, transformOrigin: '50% 50%' },
        { yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.95, stagger: 0.12, ease: 'back.out(1.5)' }, 0.5);
    }
  }

  /* Cap 01: ocho plantillas se hunden, la novena se levanta y se construye */
  const plantilla = $('[data-plantilla]');
  if (plantilla) {
    const losas = $$('[data-losa]', plantilla);
    const otras = losas.filter((l) => !l.dataset.centro);
    const centro = losas.find((l) => l.dataset.centro);
    const crece = $('[data-crece]', plantilla);
    const principios = $$('[data-principio]', plantilla);
    gsap.set(principios, { autoAlpha: 0, y: Y(18) });

    const tl = gsap.timeline({
      scrollTrigger: rm
        ? { trigger: plantilla, start: 'top 70%', once: true }
        : { trigger: plantilla, start: 'top 72%', end: 'bottom 62%', scrub: 0.8 },
      defaults: { ease: 'power2.out' },
    });
    tl.to(otras, { y: Y(16), autoAlpha: 0.3, duration: 0.8, stagger: { each: 0.05, from: 'edges' } }, 0)
      .to(centro ?? {}, { y: Y(-26), duration: 0.9 }, 0.2)
      .to(crece, { autoAlpha: 1, duration: 0.5 }, 0.5)
      .fromTo($$('[data-crece] > g'), { y: Y(28), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.18 }, 0.55)
      .to(principios, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.25 }, 0.9);
  }

  /* Cosas que entran al ver: una sola gramática para toda la página */
  const suben = $$('[data-sube]');
  if (suben.length) {
    ScrollTrigger.batch(suben, {
      start: 'top 86%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: Y(34), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.08, ease: 'power3.out', overwrite: true }),
    });
    gsap.set(suben, { autoAlpha: 0 });
  }

  $$('[data-parte]').forEach((h) => {
    SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, {
        ...(rm ? { autoAlpha: 0 } : { yPercent: 108 }), duration: 1.05, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }),
    });
  });

  /* Cap 03: la obra se construye en cinco fases mientras la pantalla queda fija.
     Todo se calcula desde el tiempo de la línea, así que subir la deshace igual. */
  const montaje = $('[data-montaje]');
  if (montaje) {
    const fases = $$('[data-fase]', montaje);
    const pistas = $$('[data-pista] i', montaje);
    const revela = $<SVGRectElement>('[data-revela]', montaje)!;
    const FOTO_W = 6;
    const F = [0, 2.4, 4.8, 7.4, 10];
    const FIN = 12.4;
    const capa = (n: string) => $(`[data-capa="${n}"]`, montaje);

    function construir() {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
      tl.fromTo($$('[data-nota]', montaje), { autoAlpha: 0, y: Y(26) }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.3 }, 0.2)
        .to(capa('base'), { autoAlpha: 1, duration: 0.6 }, F[1] - 0.4)
        .to($$('[data-nota]', montaje), { autoAlpha: 0, y: Y(-22), duration: 0.5, stagger: 0.08 }, F[1])
        .fromTo($$('[data-wire] polygon', montaje), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.06, ease: 'power1.inOut' }, F[1] + 0.2)
        .to(capa('solido'), { autoAlpha: 1, duration: 0.8 }, F[2])
        .fromTo($$('[data-solido]', montaje), { autoAlpha: 0, y: Y(22) }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, F[2])
        .to(capa('plano'), { autoAlpha: 0.35, duration: 0.6 }, F[2] + 0.6)
        .to(capa('foto'), { autoAlpha: 1, duration: 0.01 }, F[3])
        .fromTo(revela, { attr: { width: 0 } }, { attr: { width: FOTO_W }, duration: 1.4, ease: 'power3.inOut' }, F[3])
        .fromTo(capa('sello'), { autoAlpha: 0, scale: rm ? 1 : 1.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }, F[3] + 1.3)
        .to(capa('barras'), { autoAlpha: 1, duration: 0.3 }, F[4])
        .fromTo($$('[data-barra]', montaje), { autoAlpha: 0, y: Y(30) }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(1.4)' }, F[4])
        .to({}, { duration: 0.5 }, FIN - 0.5);

      gsap.set([capa('base'), capa('solido'), capa('foto'), capa('barras'), capa('sello')], { autoAlpha: 0 });
      gsap.set($$('[data-nota]', montaje), { autoAlpha: 0 });
      gsap.set($$('[data-wire] polygon', montaje), { strokeDashoffset: 1 });
      revela.setAttribute('width', '0');
      tl.eventCallback('onUpdate', () => marcarFase(tl.time()));
      marcarFase(0);
      return tl;
    }

    function marcarFase(t: number) {
      const i = F.reduce((acc, ini, k) => (t >= ini - 0.01 ? k : acc), 0);
      fases.forEach((f, k) => f.classList.toggle('activa', k === i));
      pistas.forEach((p, k) => {
        const ini = F[k]; const fin = F[k + 1] ?? FIN;
        gsap.set(p, { scaleX: gsap.utils.clamp(0, 1, (t - ini) / (fin - ini)) });
      });
    }

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = construir();
      const st = ScrollTrigger.create({
        trigger: $('[data-montaje-pin]', montaje), start: 'top top', end: () => `+=${innerHeight * 3.2}`,
        pin: true, anticipatePin: 1, scrub: 0.6, animation: tl,
      });
      return () => { st.kill(); tl.kill(); };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const tl = construir();
      const st = ScrollTrigger.create({ trigger: montaje, start: 'top 70%', once: true, onEnter: () => tl.timeScale(1.8).play() });
      return () => { st.kill(); tl.kill(); };
    });
  }

  /* Cap 05: el tablero se arma: cifras que cuentan, barras isométricas que suben */
  const tablero = $('[data-tablero]');
  if (tablero) {
    const fmt = (v: number, f: string) =>
      f === 'pct' ? v.toFixed(2).replace('.', ',') + '%' : f === 'cop' ? '$' + Math.round(v).toLocaleString('es-CO') : Math.round(v).toLocaleString('es-CO');
    const cuentas = $$('[data-cuenta]', tablero);
    const barras = $$('[data-barra-iso]', tablero);
    const vias = $$('[data-embudo]', tablero);
    gsap.set(vias, { scaleX: 0 });
    cuentas.forEach((c) => (c.textContent = fmt(0, c.dataset.formato!)));
    ScrollTrigger.create({
      trigger: tablero, start: 'top 75%', once: true,
      onEnter: () => {
        cuentas.forEach((c) => {
          const o = { v: 0 };
          gsap.to(o, { v: parseFloat(c.dataset.cuenta!), duration: 2, ease: 'power3.out', onUpdate: () => (c.textContent = fmt(o.v, c.dataset.formato!)) });
        });
        gsap.fromTo(barras, { autoAlpha: 0, y: Y(24) }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'back.out(1.5)' });
        gsap.to(vias, { scaleX: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
      },
    });
  }

  /* La escena de portada flota despacio, como una maqueta sobre la mesa */
  const maqueta = $('[data-maqueta]');
  const tarjeta = $('[data-tarjeta]');
  if (maqueta && !rm) gsap.to(maqueta, { y: -14, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  if (tarjeta && !rm) gsap.to(tarjeta, { y: -26, duration: 4.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  addEventListener('load', () => ScrollTrigger.refresh());
  $$('img').forEach((img) => !img.complete && img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }));
  if (location.hash) setTimeout(() => irA(location.hash), 300);
}
