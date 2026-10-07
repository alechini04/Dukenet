import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

const motion = document.documentElement.classList.contains('motion');
const rm = document.documentElement.classList.contains('rm');
const fino = document.documentElement.classList.contains('puntero-fino');
const Y = (n: number) => (rm ? 0 : n);
const HEADER = 76;

/* ── Scroll suave ───────────────────────────────────────────────────────── */
let lenis: Lenis | null = null;
if (motion && !rm) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.3 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const irA = (hash: string) => {
  const destino = hash === '#inicio' ? document.body : $(hash);
  if (!destino) return;
  if (lenis) lenis.scrollTo(destino as HTMLElement, { offset: hash === '#inicio' ? 0 : -HEADER, duration: 1.25 });
  else destino.scrollIntoView({ block: 'start' });
};

document.addEventListener('click', (e) => {
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
  if (motion) gsap.fromTo($$('li, .menu__cta', menu), { y: Y(18), autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out' });
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

/* ── Encabezado ─────────────────────────────────────────────────────────── */
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

/* ── Cursor ─────────────────────────────────────────────────────────────────
   Un anillo que sigue al puntero con retraso y un punto que va pegado a él. El
   anillo crece sobre lo que se puede tocar y se convierte en etiqueta sobre una
   obra. Solo con puntero fino y sin movimiento reducido. */
if (fino && motion && !rm) {
  const anillo = $('[data-cursor]');
  const punto = $('[data-cursor-punto]');
  const texto = $('[data-cursor-txt]');
  if (anillo && punto) {
    const ax = gsap.quickTo(anillo, 'x', { duration: 0.42, ease: 'power3' });
    const ay = gsap.quickTo(anillo, 'y', { duration: 0.42, ease: 'power3' });
    const px = gsap.quickTo(punto, 'x', { duration: 0.08, ease: 'power2' });
    const py = gsap.quickTo(punto, 'y', { duration: 0.08, ease: 'power2' });

    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      ax(e.clientX); ay(e.clientY); px(e.clientX); py(e.clientY);
    }, { passive: true });

    document.addEventListener('pointerover', (e) => {
      const obra = (e.target as Element).closest<HTMLElement>('[data-cursor-label]');
      const tocable = (e.target as Element).closest('a, button, label, summary, input, textarea');
      anillo.classList.toggle('es-obra', !!obra);
      anillo.classList.toggle('es-enlace', !obra && !!tocable);
      if (texto) texto.textContent = obra?.dataset.cursorLabel ?? '';
    });
    addEventListener('blur', () => anillo.classList.remove('es-obra', 'es-enlace'));
  }
}

/* ── El objeto 3D ───────────────────────────────────────────────────────────
   Se carga aparte y solo si tiene sentido: con JavaScript, sin ahorro de datos y
   con un equipo que pueda con ello. Si algo de eso falla la página se queda con
   el plano y el halo dibujados en CSS. Con movimiento reducido el objeto se
   dibuja igual, pero quieto: una preferencia de movimiento no es una orden de
   esconder la imagen. */
const red = (navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number });
const puedeCon3d = motion && !red.connection?.saveData && !(red.deviceMemory && red.deviceMemory < 2);
if (puedeCon3d) {
  const lienzo = $<HTMLCanvasElement>('[data-nucleo]');
  if (lienzo) {
    import('./tres')
      .then(({ iniciarNucleo }) => { if (iniciarNucleo(lienzo, rm)) document.documentElement.classList.add('con-3d'); })
      .catch((e) => console.warn('Sin objeto 3D:', e));
  }
}

/* ── Botón flotante ─────────────────────────────────────────────────────── */
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
  /* Portada: el titular sube línea por línea y el resto aparece detrás */
  const titulo = $('[data-titulo]');
  if (titulo) {
    const tachado = $('[data-tachado]');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo($$('.ln > span', titulo), rm ? { autoAlpha: 0 } : { yPercent: 112 },
      rm ? { autoAlpha: 1, duration: 0.8, stagger: 0.1 } : { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.15);
    if (tachado) tl.fromTo(tachado, { '--tachado': 0 }, { '--tachado': 1, duration: 0.65, ease: 'power2.inOut' }, 1.05);
    tl.fromTo($$('[data-aparece]'), { y: Y(20), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.08 }, 0.4);
  }

  /* Las capturas reales se recorren solas: el sitio del cliente, vivo */
  if (!rm) $$('[data-tira]').forEach((img) => {
    const marco = img.parentElement!;
    const recorrido = () => Math.max(0, img.offsetHeight - marco.clientHeight);
    gsap.fromTo(img, { y: 0 }, {
      y: () => -recorrido(), duration: 26, ease: 'none', repeat: -1, yoyo: true,
      repeatRefresh: true,
    });
  });

  /* Títulos: cada línea entra desde su propia máscara */
  $$('[data-parte]').forEach((h) => {
    SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, {
        ...(rm ? { autoAlpha: 0 } : { yPercent: 110 }), duration: 1.05, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }),
    });
  });

  /* Bloques y líneas de dato que entran al verse */
  const suben = $$('[data-sube]');
  if (suben.length) {
    ScrollTrigger.batch(suben, {
      start: 'top 88%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: Y(28), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out', overwrite: true }),
    });
    gsap.set(suben, { autoAlpha: 0 });
  }

  /* Imágenes que se revelan con una máscara que sube */
  $$('[data-revela]').forEach((el) => {
    const img = $('img', el);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 84%', once: true } })
      .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' })
      .fromTo(img, { scale: rm ? 1 : 1.18 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
  });

  /* Marcos y cajas: la línea se dibuja al entrar */
  $$('[data-traza]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* Proceso: el sitio del cliente se construye dentro de la ventana, fase por
     fase, mientras la pantalla queda fija. Todo se lee del tiempo de la línea,
     así que subir lo deshace igual. */
  const proceso = $('[data-proceso]');
  if (proceso) {
    const fases = $$('[data-fase]', proceso);
    const pistas = $$('[data-pista] i', proceso);
    const url = $('[data-url]', proceso)!;
    const caret = $('[data-caret]', proceso);
    const F = [0, 2.4, 4.8, 7.2, 9.8];
    const FIN = 12;
    const capa = (n: string) => $(`[data-capa="${n}"]`, proceso);
    const DOMINIO = 'tunegocio.com';
    const urlEn = (t: number) => {
      if (t < F[1]) return 'borrador · diagnóstico';
      if (t < F[2]) return 'borrador · propuesta';
      if (t < F[3]) return 'diseño · pantalla de inicio';
      return DOMINIO.slice(0, Math.max(1, Math.round(gsap.utils.clamp(0, 1, (t - F[3]) / 1.4) * DOMINIO.length)));
    };

    function construir() {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
      tl.fromTo($$('[data-nota]', proceso), { autoAlpha: 0, y: Y(18), scale: rm ? 1 : 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.3, ease: 'back.out(1.6)' }, 0.2)
        .to($$('[data-nota]', proceso), { autoAlpha: 0, y: Y(-14), duration: 0.5, stagger: 0.08 }, F[1])
        .fromTo($$('[data-wire]', proceso), { autoAlpha: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, stagger: 0.09 }, F[1] + 0.25)
        .fromTo($$('[data-skel]', proceso), { autoAlpha: 0, scaleY: 0, transformOrigin: 'top' }, { autoAlpha: 1, scaleY: 1, duration: 0.6, stagger: 0.07 }, F[2])
        .to(capa('wire'), { autoAlpha: 0.25, duration: 0.6 }, F[2] + 0.7)
        .to(capa('wire'), { autoAlpha: 0, duration: 0.5 }, F[3])
        .set($('[data-barrido]', proceso), { autoAlpha: 1 }, F[3] + 0.2)
        .set(capa('sitio'), { autoAlpha: 1 }, F[3] + 0.2)
        .fromTo(capa('sitio'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut' }, F[3] + 0.2)
        .fromTo($('[data-barrido]', proceso), { x: 0 }, { x: () => $('.lienzo', proceso)!.clientWidth, duration: 1.3, ease: 'power3.inOut' }, F[3] + 0.2)
        .set($('[data-barrido]', proceso), { autoAlpha: 0 }, F[3] + 1.5)
        .to($('[data-vivo]', proceso), { autoAlpha: 1, duration: 0.4 }, F[3] + 1.5)
        .fromTo(capa('panel'), { autoAlpha: 0, y: Y(24) }, { autoAlpha: 1, y: 0, duration: 0.7 }, F[4])
        .fromTo($$('[data-pbarra]', proceso), { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.6)' }, F[4] + 0.2)
        .to({}, { duration: 0.4 }, FIN - 0.4);

      gsap.set([capa('sitio'), capa('panel')], { autoAlpha: 0 });
      gsap.set(capa('sitio'), { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set($$('[data-nota], [data-wire], [data-skel]', proceso), { autoAlpha: 0 });
      gsap.set([$('[data-vivo]', proceso), $('[data-barrido]', proceso)], { autoAlpha: 0 });
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
      const u = urlEn(t);
      if (url.textContent !== u) url.textContent = u;
      if (caret) caret.style.opacity = t >= F[3] + 1.4 ? '0' : '';
    }

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = construir();
      const st = ScrollTrigger.create({
        trigger: $('[data-proceso-pin]', proceso), start: 'top top', end: () => `+=${innerHeight * 3}`,
        pin: true, anticipatePin: 1, scrub: 0.55, animation: tl,
      });
      return () => { st.kill(); tl.kill(); };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const tl = construir();
      const st = ScrollTrigger.create({ trigger: proceso, start: 'top 70%', once: true, onEnter: () => tl.timeScale(1.8).play() });
      return () => { st.kill(); tl.kill(); };
    });
  }

  /* Datos: las cifras cuentan, las barras suben y el embudo se abre */
  const tablero = $('[data-tablero]');
  if (tablero) {
    const fmt = (v: number, f: string) =>
      f === 'pct' ? v.toFixed(2).replace('.', ',') + '%' : f === 'cop' ? '$' + Math.round(v).toLocaleString('es-CO') : Math.round(v).toLocaleString('es-CO');
    const cuentas = $$('[data-cuenta]', tablero);
    const barras = $$('[data-barra]', tablero);
    const vias = $$('[data-embudo]', tablero);
    gsap.set(barras, { scaleY: 0 });
    gsap.set(vias, { scaleX: 0 });
    cuentas.forEach((c) => (c.textContent = fmt(0, c.dataset.formato!)));
    ScrollTrigger.create({
      trigger: tablero, start: 'top 78%', once: true,
      onEnter: () => {
        cuentas.forEach((c) => {
          const o = { v: 0 };
          gsap.to(o, { v: parseFloat(c.dataset.cuenta!), duration: 2, ease: 'power3.out', onUpdate: () => (c.textContent = fmt(o.v, c.dataset.formato!)) });
        });
        gsap.to(barras, { scaleY: 1, duration: 0.9, stagger: 0.06, ease: 'power3.out' });
        gsap.to(vias, { scaleX: 1, duration: 1.1, stagger: 0.09, ease: 'power3.out', delay: 0.2 });
      },
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
  $$('img').forEach((img) => !img.complete && img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }));
  if (location.hash) setTimeout(() => irA(location.hash), 300);
}
