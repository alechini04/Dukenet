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
        const tl = gsap.timeline();
        tl.fromTo($('.panel__photo', p), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.inOut' })
          .fromTo($('.panel__photo img', p), { scale: rm ? 1 : 1.18 }, { scale: 1, duration: 1.3, ease: 'expo.out' }, 0)
          .fromTo($$('.panel__info > *', p), { y: Y(26), autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: 'expo.out' }, 0.15);
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

/* ══ Motion ══════════════════════════════════════════════════════════════ */
if (motion) document.fonts.ready.then(initMotion);

function initMotion() {
  const mm = gsap.matchMedia();

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
        .fromTo($('[data-layer="grid"]', obra), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0)
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

        .addLabel('crecer', PHASES[4])
        .fromTo($('[data-reporte]', obra), { autoAlpha: 0, y: Y(50) }, { autoAlpha: 1, y: 0, duration: 1 }, PHASES[4] + 0.2)
        .fromTo($$('[data-rbar]', obra), { scaleY: 0 }, { scaleY: 1, duration: 1.2, stagger: 0.1, ease: 'elastic.out(1, 0.6)' }, PHASES[4] + 0.6)
        .to({}, { duration: 0.6 }, END - 0.6);

      // initial hidden states that fromTo() only applies once playback reaches them
      gsap.set([$('[data-sello]', obra), $('[data-reporte]', obra), ...$$('[data-nota]', obra)], { autoAlpha: 0 });
      gsap.set($$('[data-layer="skel"] rect', obra), { scaleX: 0 });
      gsap.set($$('.wire__label, [data-cota] text', obra), { opacity: 0 });
      gsap.set($$('.wire__box, [data-cota] line', obra), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set($('[data-layer="cotas"]', obra), { opacity: 0 });
      revealRect.setAttribute('width', '0');
      tl.eventCallback('onUpdate', () => setPhase(tl.time()));
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
        counters.forEach((c) => {
          const o = { v: 0 };
          gsap.to(o, { v: parseFloat(c.dataset.count!), duration: 2.2, ease: 'expo.out', onUpdate: () => (c.textContent = fmt(o.v, c.dataset.format!)) });
        });
        gsap.to(bars, { scaleY: 1, duration: 1.6, stagger: 0.07, ease: 'elastic.out(1, 0.55)' });
        gsap.to(funnel, { scaleX: 1, duration: 1.5, stagger: 0.12, ease: 'expo.out', delay: 0.2 });
      },
    });
  }

  /* Closing sign: rises into place like the first one */
  const fin = $('.valla-fin');
  if (fin && !rm) gsap.fromTo(fin, { clipPath: 'inset(18% 4% 0% 4% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: { trigger: fin, start: 'top bottom', end: 'top 30%', scrub: true } });

  /* Footer wordmark */
  const mark = $('.pie__mark');
  if (mark) gsap.fromTo(mark.children, { yPercent: Y(40), autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: mark, start: 'top 92%', once: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
  $$('img').forEach((img) => !img.complete && img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }));

  if (location.hash) setTimeout(() => scrollToHash(location.hash), 300);
}
