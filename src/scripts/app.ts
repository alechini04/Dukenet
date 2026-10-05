import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

const motion = document.documentElement.classList.contains('motion');
// Reduced motion keeps fades and count-ups; travel, zoom, parallax, pinning and smooth scroll are dropped.
const rm = document.documentElement.classList.contains('rm');
const Y = (n: number) => (rm ? 0 : n);
const HEADER = 67;

/* ── Smooth scroll ──────────────────────────────────────────────────────── */
let lenis: Lenis | null = null;
if (motion && !rm) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const scrollToHash = (hash: string) => {
  const target = hash === '#inicio' ? document.body : $(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target as HTMLElement, { offset: hash === '#inicio' ? 0 : -HEADER + 1, duration: 1.4 });
  else target.scrollIntoView({ block: 'start' });
};

document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a || a.getAttribute('href') === '#') return;
  const hash = a.getAttribute('href')!;
  if (!$(hash) && hash !== '#inicio') return;
  e.preventDefault();
  closeMenu();
  scrollToHash(hash);
  history.replaceState(null, '', hash);
  const plan = a.dataset.plan;
  if (plan) selectPlan(plan);
});

/* ── Mobile menu ────────────────────────────────────────────────────────── */
const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
const menu = $('[data-menu]');
const menuLabel = $('[data-menu-label]');
function openMenu() {
  if (!toggle || !menu) return;
  menu.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  if (menuLabel) menuLabel.textContent = 'Cerrar menú';
  lenis?.stop();
  document.body.style.overflow = 'hidden';
  if (motion) gsap.fromTo($$('li, .menu__cta', menu), { y: Y(24), autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, ease: 'expo.out' });
  $<HTMLAnchorElement>('a', menu)?.focus();
}
function closeMenu() {
  if (!toggle || !menu || menu.hidden) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  if (menuLabel) menuLabel.textContent = 'Abrir menú';
  lenis?.start();
  document.body.style.overflow = '';
}
toggle?.addEventListener('click', () => (menu?.hidden ? openMenu() : closeMenu()));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) { closeMenu(); toggle?.focus(); }
});
matchMedia('(min-width: 861px)').addEventListener('change', (m) => m.matches && closeMenu());

/* ── Frentes: progress band, current code, nav state, floating CTA ──────── */
const fill = $('[data-avance]');
const code = $('[data-frente-code]');
const name = $('[data-frente-name]');
const FR: Record<string, [string, string]> = {
  inicio: ['FR-01', 'Inicio'], manifiesto: ['FR-02', 'Manifiesto'], obras: ['FR-03', 'Obras'],
  entregadas: ['FR-04', 'Entregadas'], cronograma: ['FR-05', 'Cronograma'], panel: ['FR-06', 'Panel'], contacto: ['FR-07', 'Cotizar'],
};
const setFrente = (id: string) => {
  const f = FR[id]; if (!f || !code || !name) return;
  if (code.textContent === f[0]) return;
  code.textContent = f[0]; name.textContent = f[1];
  frenteActivo = $(`#${id}`);
  if (hudCode && hudName) { hudCode.textContent = f[0]; hudName.textContent = f[1]; }
  if (marco && motion && !rm) gsap.fromTo(marco, { opacity: 0.25 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  $$('[data-navlink]').forEach((l) => l.setAttribute('aria-current', String(l.dataset.navlink === id)));
  if (motion) gsap.fromTo([code, name], { yPercent: Y(60), autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'expo.out' });
};
$$('[data-frente]').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec, start: 'top 45%', end: 'bottom 45%', refreshPriority: -1,
    onToggle: (self) => self.isActive && setFrente(sec.dataset.frente!),
  });
});
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: (self) => { if (fill) fill.style.transform = `scaleX(${self.progress.toFixed(4)})`; },
});
/* ── Survey overlay ────────────────────────────────────────────────────────
   The HUD reads the page like an instrument: the frame locks onto the frente in
   view and tracks it while it moves, the readout reports viewport and progress.
   Decorative, desktop-only and off with reduced motion. */
const hud = $('[data-hud]');
const marco = $('[data-hud-marco]');
const hudCode = $('[data-hud-code]');
const hudName = $('[data-hud-name]');
const lectura = $('[data-hud-lectura]');
let frenteActivo: HTMLElement | null = null;
if (hud && marco && motion && !rm) {
  const setL = gsap.quickSetter(marco, 'left', 'px');
  const setT = gsap.quickSetter(marco, 'top', 'px');
  const setW = gsap.quickSetter(marco, 'width', 'px');
  const setH = gsap.quickSetter(marco, 'height', 'px');
  const M = 26;
  const seguirMarco = (p = 0) => {
    const sec = frenteActivo || $('#inicio');
    if (!sec) return;
    const b = sec.getBoundingClientRect();
    const top = Math.max(79 + M, b.top + M);
    const bottom = Math.min(innerHeight - M, b.bottom - M);
    const left = Math.max(M, b.left + M);
    const right = Math.min(innerWidth - M, b.right - M);
    setL(left); setT(top); setW(Math.max(0, right - left)); setH(Math.max(0, bottom - top));
    if (lectura) lectura.textContent = `${innerWidth}×${innerHeight} · obra ${Math.round(p * 100)}%`;
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => seguirMarco(self.progress), onRefresh: (self) => seguirMarco(self.progress) });
  addEventListener('resize', () => seguirMarco());
  seguirMarco();
}

const flota = $('[data-flota]');
const contacto = $('#contacto');
if (flota && contacto) {
  // Visible only between the hero (which has its own WhatsApp plate) and the quote form.
  const hero = $('#inicio')!;
  const update = () => {
    const pastHero = hero.getBoundingClientRect().bottom < innerHeight * 0.4;
    const atContact = contacto.getBoundingClientRect().top < innerHeight * 0.85;
    const lote = $('.lote')?.getBoundingClientRect();
    const atLote = !!lote && lote.top < innerHeight && lote.bottom > innerHeight * 0.55;
    flota.classList.toggle('is-hidden', !pastHero || atContact || atLote);
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update });
}

/* ── Obras: tabs ────────────────────────────────────────────────────────── */
const tabs = $$<HTMLButtonElement>('[data-tab]');
const panels = $$('[data-panel]');
function selectTab(i: number, focus = false) {
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
  panels.forEach((p, k) => {
    const on = k === i;
    if (on && p.hidden) {
      p.hidden = false;
      if (motion) {
        const foto = $('.panel__photo', p)!;
        const scan = $('[data-scan-obra]', p);
        const tl = gsap.timeline();
        tl.fromTo(foto, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.inOut' })
          .fromTo($('.panel__photo img', p), { scale: rm ? 1 : 1.18 }, { scale: 1, duration: 1.3, ease: 'expo.out' }, 0)
          .fromTo($$('.panel__info > *', p), { y: Y(26), autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: 'expo.out' }, 0.15);
        // a light runs ahead of the reveal, like a scanner laying the image down
        if (scan && !rm) tl.fromTo(scan, { x: 0, autoAlpha: 1 }, {
          x: () => foto.clientWidth, duration: 0.9, ease: 'expo.inOut',
          onComplete: () => gsap.set(scan, { autoAlpha: 0 }),
        }, 0);
      }
    } else if (!on) p.hidden = true;
  });
  if (focus) tabs[i].focus();
  ScrollTrigger.refresh();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(i));
  t.addEventListener('keydown', (e) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); selectTab((i + keys[e.key] + tabs.length) % tabs.length, true); }
    if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
    if (e.key === 'End') { e.preventDefault(); selectTab(tabs.length - 1, true); }
  });
});

/* ── Form → WhatsApp ────────────────────────────────────────────────────── */
function selectPlan(plan: string) {
  const r = $$<HTMLInputElement>('input[name="plan"]').find((x) => x.value === plan);
  if (r) r.checked = true;
}
const form = $<HTMLFormElement>('[data-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const status = $('[data-status]', form)!;
  let firstBad: HTMLInputElement | null = null;
  for (const key of ['nombre', 'negocio']) {
    const input = form.elements.namedItem(key) as HTMLInputElement;
    const bad = !String(data.get(key) || '').trim();
    input.closest('.field')!.classList.toggle('has-error', bad);
    input.setAttribute('aria-invalid', String(bad));
    if (bad && !firstBad) firstBad = input;
  }
  if (firstBad) {
    status.textContent = 'Revisa los campos marcados.';
    firstBad.focus();
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
  status.textContent = win ? 'Listo: abrimos WhatsApp con tu mensaje escrito. Solo dale enviar.' : 'Tu navegador bloqueó la ventana. Toca de nuevo o escríbenos directo al 316 328 9924.';
  if (!win) location.href = url;
});
form?.addEventListener('input', (e) => {
  const input = e.target as HTMLInputElement;
  const field = input.closest('.field');
  if (field?.classList.contains('has-error') && input.value.trim()) { field.classList.remove('has-error'); input.setAttribute('aria-invalid', 'false'); }
});

/* ── Case screenshots: measure frames so hover scroll ends at the bottom ─── */
const measureShots = () => {
  $$('[data-caso]').forEach((stage) => {
    const view = $('.browser__view', stage); const phone = $('.phone__view', stage);
    if (view) stage.style.setProperty('--view-h', `${view.clientHeight}px`);
    if (phone) stage.style.setProperty('--phone-h', `${phone.clientHeight}px`);
  });
};
measureShots();
addEventListener('resize', measureShots);

/* ── Hero etapas ticker (static first stage without motion) ─────────────── */
const etapas = $$('[data-etapas] li');
if (motion && etapas.length) {
  let k = 0;
  setInterval(() => {
    k = (k + 1) % etapas.length;
    etapas.forEach((li, j) => { li.classList.toggle('is-on', j === k); li.classList.toggle('is-done', j < k); });
  }, 1900);
}

/* A sweep of light across a NET plate; the class drives a one-shot CSS animation */
const destella = (el: Element | null) => {
  if (!el || rm) return;
  el.classList.remove('destella');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('destella');
  setTimeout(() => el.classList.remove('destella'), 1200);
};

/* ══ Motion ══════════════════════════════════════════════════════════════ */
if (motion) document.fonts.ready.then(initMotion);

function initMotion() {
  const mm = gsap.matchMedia();

  /* ── The lamp ──────────────────────────────────────────────────────────────
     One work light in the room. It follows the pointer, the sign sheets catch it
     as a glint, and the panels lean a couple of degrees toward it so the page
     reads as objects in a space instead of boxes on a plane. Fine pointers only:
     there is no lamp to follow with a finger, and none of it runs with reduced
     motion. Everything here writes transforms and custom properties only. */
  const fino = matchMedia('(hover: hover) and (pointer: fine)');
  if (!rm && fino.matches) {
    const root = document.documentElement;
    const paneles = $$('[data-glint]');
    const zonas = $$('.luz').map((el) => el.parentElement!).filter(Boolean);
    const tilts = $$('[data-tilt]').map((el) => ({
      el,
      g: parseFloat(el.dataset.tilt || '1.2'),
      rx: gsap.quickTo(el, 'rotationX', { duration: 1, ease: 'power3' }),
      ry: gsap.quickTo(el, 'rotationY', { duration: 1, ease: 'power3' }),
    }));
    const planos = $$('[data-paralaje]').map((el) => ({
      f: parseFloat(el.dataset.paralaje || '1'),
      x: gsap.quickTo(el, 'xPercent', { duration: 1.1, ease: 'power3' }),
      y: gsap.quickTo(el, 'yPercent', { duration: 1.1, ease: 'power3' }),
    }));

    const mira = $('[data-hud-mira]');
    const miraX = mira ? gsap.quickTo(mira, 'x', { duration: 0.45, ease: 'power3' }) : null;
    const miraY = mira ? gsap.quickTo(mira, 'y', { duration: 0.45, ease: 'power3' }) : null;

    let tx = innerWidth * 0.5, ty = innerHeight * 0.24;
    let cx = tx, cy = ty, raf = 0;

    const cuadro = () => {
      cx += (tx - cx) * 0.085;
      cy += (ty - cy) * 0.085;
      root.style.setProperty('--mx', `${((cx / innerWidth) * 100).toFixed(2)}%`);
      root.style.setProperty('--my', `${((cy / innerHeight) * 100).toFixed(2)}%`);

      // every rect first, then every write: reading and writing in turns would
      // force a layout per element on each frame
      const rz = zonas.map((z) => z.getBoundingClientRect());
      const rp = paneles.map((p) => p.getBoundingClientRect());
      const rt = tilts.map((t) => t.el.getBoundingClientRect());

      zonas.forEach((z, i) => {
        const b = rz[i];
        if (b.bottom < -300 || b.top > innerHeight + 300 || !b.width) return;
        z.style.setProperty('--lx', `${(((cx - b.left) / b.width) * 100).toFixed(1)}%`);
        z.style.setProperty('--ly', `${(((cy - b.top) / b.height) * 100).toFixed(1)}%`);
      });

      paneles.forEach((p, i) => {
        const b = rp[i];
        if (b.bottom < -160 || b.top > innerHeight + 160 || !b.width) return;
        const gx = ((cx - b.left) / b.width) * 100;
        const gy = ((cy - b.top) / b.height) * 100;
        p.style.setProperty('--gx', `${gx.toFixed(1)}%`);
        p.style.setProperty('--gy', `${gy.toFixed(1)}%`);
        // the sheet only flares while the lamp is near it
        const d = Math.hypot(gx - 50, gy - 50) / 100;
        p.style.setProperty('--glint', gsap.utils.clamp(0, 1, 1.3 - d * 1.5).toFixed(3));
      });

      tilts.forEach((t, i) => {
        const b = rt[i];
        if (b.bottom < -160 || b.top > innerHeight + 160 || !b.width) return;
        const nx = gsap.utils.clamp(-1, 1, (cx - (b.left + b.width / 2)) / (b.width / 2));
        const ny = gsap.utils.clamp(-1, 1, (cy - (b.top + b.height / 2)) / (b.height / 2));
        t.ry(nx * t.g);
        t.rx(-ny * t.g * 0.7);
      });

      const px = gsap.utils.clamp(-1, 1, (cx / innerWidth - 0.5) * 2);
      const py = gsap.utils.clamp(-1, 1, (cy / innerHeight - 0.5) * 2);
      for (const pl of planos) { pl.x(px * pl.f); pl.y(py * pl.f * 0.6); }

      miraX?.(tx); miraY?.(ty);

      raf = Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(cuadro) : 0;
    };

    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(cuadro);
    }, { passive: true });
    cuadro();
  }

  /* Hero: the sign is raised, then lettered, then the old promise is crossed out */
  const valla = $('[data-valla]');
  if (valla) {
    const lines = $$('.line__in', valla);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(valla, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.25, ease: 'expo.inOut', clearProps: 'clipPath' })
      .fromTo(lines, rm ? { autoAlpha: 0 } : { yPercent: 108 }, rm ? { autoAlpha: 1, duration: 0.9, stagger: 0.12 } : { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.55)
      .fromTo($('[data-tachado]'), { '--tachado': 0 }, { '--tachado': 1, duration: 0.7, ease: 'power3.inOut' }, 1.25)
      .fromTo($$('[data-hero-pitch] > *'), { y: Y(30), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 1.0)
      .fromTo($('[data-ficha]'), { y: Y(60), autoAlpha: 0, rotate: rm ? 0 : 1.5 }, { y: 0, autoAlpha: 1, rotate: 0, duration: 1.2 }, 1.05)
      .fromTo($$('.ficha__rows > div'), { x: Y(-14), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 }, 1.3);
    $$('.bolt', valla).forEach((b, i) => tl.fromTo(b, { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }, 1.0 + i * 0.05));
    // a light runs along the new sheeting once it is up
    tl.fromTo(valla, { '--gx': '-15%', '--gy': '40%', '--glint': 0 }, { '--gx': '115%', duration: 1.6, ease: 'power1.inOut' }, 0.9)
      .to(valla, { '--glint': 0.95, duration: 0.5 }, 0.9)
      .to(valla, { '--glint': 0, duration: 0.7 }, 1.9)
      .call(() => destella($('[data-net]')), undefined, 1.6);

    // The sign recedes as you leave it
    if (!rm) gsap.to(valla, { scale: 0.94, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* Manifesto: words switch on as you read them */
  const words = $('[data-words]');
  if (words) {
    const split = SplitText.create(words, { type: 'words', wordsClass: 'w' });
    if (rm) {
      gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: words, start: 'top 80%', once: true } });
    } else {
      gsap.fromTo(split.words, { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: words, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
      });
    }
  }

  /* Display headings: lettering rises out of a mask; supporting copy follows */
  $$('.t-display[data-rise]').forEach((h) => {
    SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, { ...(rm ? { autoAlpha: 0 } : { yPercent: 110 }), duration: 1.15, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 86%', once: true } }),
    });
  });
  ScrollTrigger.batch($$('[data-rise]:not(.t-display)'), {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.fromTo(els, { y: Y(36), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });
  gsap.set($$('[data-rise]:not(.t-display)'), { autoAlpha: 0 });

  /* Manifesto photo */
  $$('[data-clip]').forEach((el) => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      .fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.inOut' })
      .fromTo($('img', el), { scale: rm ? 1 : 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
  });

  /* Cases: device frames drift apart; on touch, screenshots scroll with the page */
  if (!rm) $$('[data-caso]').forEach((stage) => {
    const phone = $('.phone', stage);
    const browser = $('.browser', stage);
    gsap.fromTo(browser, { yPercent: 6 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (phone) gsap.fromTo(phone, { yPercent: 30 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  mm.add('(hover: none) and (prefers-reduced-motion: no-preference)', () => {
    $$('[data-caso]').forEach((stage) => {
      $$<HTMLImageElement>('[data-scrollshot]', stage).forEach((img) => {
        const frame = img.parentElement!;
        gsap.to(img, {
          y: () => -(img.offsetHeight - frame.clientHeight), ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top 75%', end: 'bottom 25%', scrub: 0.8, invalidateOnRefresh: true },
        });
      });
    });
  });

  /* Cronograma: "obra en vivo". One timeline builds the client's site in five phases;
     scroll scrubs it while the stage is pinned, or it plays once in reduced motion. */
  const crono = $('[data-crono]');
  const obra = $('[data-obra]');
  if (crono && obra) {
    const fases = $$('[data-fase]');
    const tracks = $$('[data-track] .track__fill');
    const url = $('[data-url]', obra)!;
    const revealRect = $<SVGRectElement>('[data-reveal-rect]', obra)!;
    const scan = $<SVGLineElement>('[data-scan]', obra)!;
    const luzObra = $('[data-obra-luz]', crono);
    const PHASES = [0, 2.2, 4.6, 7.2, 10.2];
    const END = 12.8;

    const DOMAIN = 'elgatogalletero.com';
    const urlAt = (t: number) => {
      if (t < PHASES[1]) return 'borrador · diagnóstico';
      if (t < PHASES[2]) return 'borrador · propuesta';
      if (t < PHASES[3]) return 'diseño · pantalla de inicio';
      return DOMAIN.slice(0, Math.max(1, Math.round(gsap.utils.clamp(0, 1, t - PHASES[3]) * DOMAIN.length)));
    };

    function build() {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true });
      tl.addLabel('diagnostico', PHASES[0])
        // starts drawn, not blank: arriving from a menu link parks you here, and an empty box reads as broken
        .fromTo($('[data-layer="grid"]', obra), { opacity: 0.4 }, { opacity: 1, duration: 0.8 }, 0)
        .fromTo($$('[data-nota]', obra), { autoAlpha: 0, y: Y(40), rotate: 0 }, { autoAlpha: 1, y: 0, rotate: (i, el) => getComputedStyle(el).getPropertyValue('--r'), duration: 1, stagger: 0.35, ease: 'back.out(1.6)' }, 0.3)

        .addLabel('propuesta', PHASES[1])
        .to($$('[data-nota]', obra), { autoAlpha: 0, y: Y(-30), duration: 0.6, stagger: 0.08, ease: 'power2.in' }, PHASES[1])
        .fromTo($$('.wire__box', obra), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.14, ease: 'power2.inOut' }, PHASES[1] + 0.3)
        .fromTo($$('.wire__label', obra), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.14 }, PHASES[1] + 0.8)
        .fromTo($('[data-layer="cotas"]', obra), { opacity: 0 }, { opacity: 1, duration: 0.01 }, PHASES[1] + 1.2)
        .fromTo($$('[data-cota] line', obra), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.2, ease: 'power2.inOut' }, PHASES[1] + 1.2)
        .fromTo($$('[data-cota] text', obra), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.2 }, PHASES[1] + 1.6)

        .addLabel('diseno', PHASES[2])
        .fromTo($$('[data-layer="skel"] rect', obra), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.045, ease: 'expo.out' }, PHASES[2])
        .to($('[data-layer="wire"]', obra), { opacity: 0, duration: 0.8 }, PHASES[2] + 0.6)
        .to($('[data-layer="grid"]', obra), { opacity: 0.25, duration: 0.8 }, PHASES[2] + 0.6)

        .addLabel('lanzamiento', PHASES[3])
        .to($$('[data-layer="cotas"], [data-layer="wire"]', obra), { opacity: 0, duration: 0.5 }, PHASES[3] + 0.4)
        .set(scan, { opacity: 1 }, PHASES[3] + 0.5)
        .fromTo(revealRect, { attr: { width: 0 } }, { attr: { width: 1440 }, duration: 1.6, ease: 'power3.inOut' }, PHASES[3] + 0.5)
        .fromTo(scan, { attr: { x1: 0, x2: 0 } }, { attr: { x1: 1440, x2: 1440 }, duration: 1.6, ease: 'power3.inOut' }, PHASES[3] + 0.5)
        .set(scan, { opacity: 0 }, PHASES[3] + 2.1)
        .fromTo($('[data-sello]', obra), { autoAlpha: 0, scale: rm ? 1 : 1.8, rotate: rm ? 0 : -8 }, { autoAlpha: 1, scale: 1, rotate: -4, duration: 0.7, ease: 'back.out(2.2)' }, PHASES[3] + 2)
        // the screen turns on and lights the room
        .fromTo(luzObra, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power2.out' }, PHASES[3] + 0.5)

        .addLabel('crecer', PHASES[4])
        .fromTo($('[data-reporte]', obra), { autoAlpha: 0, y: Y(50) }, { autoAlpha: 1, y: 0, duration: 1 }, PHASES[4] + 0.2)
        .fromTo($$('[data-rbar]', obra), { scaleY: 0 }, { scaleY: 1, duration: 1.2, stagger: 0.1, ease: 'elastic.out(1, 0.6)' }, PHASES[4] + 0.6)
        .to({}, { duration: 0.6 }, END - 0.6);

      // initial hidden states that fromTo() only applies once playback reaches them
      gsap.set([$('[data-sello]', obra), $('[data-reporte]', obra), ...$$('[data-nota]', obra)], { autoAlpha: 0 });
      gsap.set($$('[data-layer="skel"] rect', obra), { scaleX: 0 });
      gsap.set($$('.wire__label, [data-cota] text', obra), { opacity: 0 });
      gsap.set($$('.wire__box, [data-cota] line', obra), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(luzObra, { opacity: 0 });
      gsap.set($('[data-layer="cotas"]', obra), { opacity: 0 });
      revealRect.setAttribute('width', '0');
      tl.eventCallback('onUpdate', () => setPhase(tl.time()));
      // the markup carries the finished obra for the no-JS case; wind it back to phase one
      setPhase(0);
      return tl;
    }

    function setPhase(t: number) {
      const idx = PHASES.reduce((acc, start, i) => (t >= start - 0.01 ? i : acc), 0);
      fases.forEach((f, i) => f.classList.toggle('is-on', i === idx));
      tracks.forEach((tr, i) => {
        const start = PHASES[i];
        const end = PHASES[i + 1] ?? END;
        gsap.set(tr, { scaleX: gsap.utils.clamp(0, 1, (t - start) / (end - start)) });
      });
      const u = urlAt(t);
      if (url.textContent !== u) url.textContent = u;
    }

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = build();
      const st = ScrollTrigger.create({
        trigger: $('[data-crono-pin]'), start: 'top top', end: () => `+=${innerHeight * 3.4}`,
        pin: true, anticipatePin: 1, scrub: 0.6,
        animation: tl,
      });
      return () => { st.kill(); tl.kill(); };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const tl = build();
      const st = ScrollTrigger.create({ trigger: obra, start: 'top 70%', once: true, onEnter: () => tl.timeScale(1.6).play() });
      return () => { st.kill(); tl.kill(); };
    });
  }

  /* Dashboard: numbers and bars move with mass, then settle */
  const dash = $('[data-dash]');
  if (dash) {
    const fmt = (v: number, f: string) =>
      f === 'pct' ? v.toFixed(2).replace('.', ',') + '%' : f === 'cop' ? '$' + Math.round(v).toLocaleString('es-CO') : Math.round(v).toLocaleString('es-CO');
    const counters = $$('[data-count]', dash);
    const bars = $$('[data-bar]', dash);
    const funnel = $$('[data-funnel]', dash);
    gsap.set(bars, { scaleY: 0 });
    gsap.set(funnel, { scaleX: 0 });
    counters.forEach((c) => (c.textContent = fmt(0, c.dataset.format!)));
    ScrollTrigger.create({
      trigger: dash, start: 'top 75%', once: true,
      onEnter: () => {
        const barrido = $('[data-barrido]', dash);
        if (barrido && !rm) gsap.fromTo(barrido, { xPercent: -110, opacity: 1 }, { xPercent: 110, duration: 1.5, ease: 'power2.inOut', onComplete: () => gsap.set(barrido, { opacity: 0 }) });
        counters.forEach((c) => {
          const o = { v: 0 };
          gsap.to(o, { v: parseFloat(c.dataset.count!), duration: 2.2, ease: 'expo.out', onUpdate: () => (c.textContent = fmt(o.v, c.dataset.format!)) });
        });
        gsap.to(bars, { scaleY: 1, duration: 1.6, stagger: 0.07, ease: 'elastic.out(1, 0.55)' });
        gsap.to(funnel, { scaleX: 1, duration: 1.5, stagger: 0.12, ease: 'expo.out', delay: 0.2 });
      },
    });
  }

  /* The closing sign arrives from depth like everything else in the room (data-vuelo) */

  /* The instrument acquires the first frente: the frame comes in wide and locks on */
  if (hud && marco && !rm) {
    gsap.fromTo(hud, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out', delay: 0.9 });
    gsap.fromTo(marco, { scale: 1.08, transformOrigin: '50% 50%' }, { scale: 1, duration: 1.1, ease: 'expo.out', delay: 0.9 });
  }

  /* Dust hanging in the work light: a thin field of motes drifting upward.
     It is what makes a beam of light look like a beam and not a gradient. */
  const lienzo = $<HTMLCanvasElement>('[data-polvo]');
  if (lienzo && !rm && innerWidth >= 900) {
    const ctx = lienzo.getContext('2d');
    if (ctx) {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      let w = 0, h = 0;
      const motas = Array.from({ length: 70 }, () => ({
        x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7,
        s: 0.5 + Math.random() * 1.5, v: 0.015 + Math.random() * 0.05,
      }));
      const medir = () => { w = lienzo.width = Math.round(innerWidth * dpr); h = lienzo.height = Math.round(innerHeight * dpr); };
      medir();
      addEventListener('resize', medir);
      const pintar = () => {
        if (!document.hidden) {
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = '#b5d9fd';
          for (const m of motas) {
            m.y -= m.v / 120;
            if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
            m.x += Math.sin((m.y + m.z) * 6) * 0.00018;
            ctx.globalAlpha = 0.06 + m.z * 0.15;
            ctx.beginPath();
            ctx.arc(m.x * w, m.y * h, m.s * m.z * dpr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        requestAnimationFrame(pintar);
      };
      pintar();
    }
  }

  /* Things arrive from depth: the camera is in the room, so objects come toward
     you instead of sliding up a page. Scrubbed, so going back puts them away. */
  if (!rm) $$('[data-vuelo]').forEach((el) => {
    gsap.fromTo(el, { z: -340, rotationX: 6, autoAlpha: 0.35 }, {
      z: 0, rotationX: 0, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 58%', scrub: 0.7 },
    });
  });

  /* Barrier tape drifts as you pass each threshold */
  if (!rm) $$('.rail').forEach((r) => {
    gsap.fromTo(r, { backgroundPosition: '0px 0px' }, {
      backgroundPosition: '-396px 0px', ease: 'none',
      scrollTrigger: { trigger: r, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  /* Footer wordmark: it rises and its plate catches the light once */
  const mark = $('.pie__mark');
  if (mark) gsap.fromTo(mark.children, { yPercent: Y(40), autoAlpha: 0 }, {
    yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.3, ease: 'expo.out',
    scrollTrigger: { trigger: mark, start: 'top 92%', once: true },
    onComplete: () => destella($('.pie__net')),
  });

  addEventListener('load', () => ScrollTrigger.refresh());
  $$('img').forEach((img) => !img.complete && img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }));

  if (location.hash) setTimeout(() => scrollToHash(location.hash), 300);
}
