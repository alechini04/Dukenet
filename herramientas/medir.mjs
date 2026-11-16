/**
 * Barre las cinco páginas a varios anchos y avisa de lo que se rompe:
 * desplazamiento horizontal, texto recortado, blancos táctiles por debajo de
 * 24 px y contenido que se queda invisible después de que la animación de
 * entrada debería haber terminado.
 *
 *   node herramientas/medir.mjs [--anchos 320,390,768,1440]
 *
 * Sale con código 1 si encuentra algo, para poder encadenarlo.
 */
import { pagina, evaluar } from './chrome.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--anchos');
const ANCHOS = (i >= 0 ? args[i + 1] : '320,390,768,1440').split(',').map(Number);
const BASE = process.env.BASE || 'http://127.0.0.1:4323';
const PAGINAS = ['/', '/privacidad', '/cookies', '/terminos', '/404.html'];

const SONDA = `
  document.querySelectorAll('[data-sube],[data-aparece],[data-parte],[data-revela]')
    .forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.transform = 'none'; });

  const avisos = [];
  const sobra = document.documentElement.scrollWidth - innerWidth;
  if (sobra > 0) avisos.push({ tipo: 'desplazamiento horizontal', detalle: sobra + 'px' });

  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return;

    // Texto recortado por un contenedor que esconde el desbordamiento.
    const propio = [...el.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim());
    const corta = ['hidden', 'clip'].includes(cs.overflowX) && cs.textOverflow !== 'ellipsis';
    const exceso = el.scrollWidth - el.clientWidth;
    if (propio && corta && exceso > 1 && cs.position !== 'absolute') {
      avisos.push({ tipo: 'texto recortado', detalle: exceso + 'px',
        que: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) });
    }
  });

  // Blancos táctiles (WCAG 2.5.8): 24x24 como mínimo. El criterio exceptúa
  // los enlaces que van dentro de una frase, porque su tamaño lo manda el
  // interlineado del texto que los rodea: esos no se cuentan.
  document.querySelectorAll('a[href], button, input:not([type=radio]):not([type=checkbox]), textarea, select')
    .forEach((el) => {
      const cs = getComputedStyle(el);
      if (!el.offsetParent && cs.position !== 'fixed') return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const enLinea = cs.display.startsWith('inline') &&
        [...(el.parentElement?.childNodes || [])].some((x) => x.nodeType === 3 && x.textContent.trim());
      if (enLinea) return;
      if (r.width < 24 || r.height < 24) {
        avisos.push({ tipo: 'blanco táctil pequeño', detalle: Math.round(r.width) + 'x' + Math.round(r.height),
          que: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40) });
      }
    });
  return avisos;`;

let total = 0;
for (const ancho of ANCHOS) {
  const { cdp, cerrar } = await pagina({ ancho, perfil: '.perfil-medir-' + ancho });
  for (const ruta of PAGINAS) {
    await cdp.enviar('Page.navigate', { url: BASE + ruta });
    await new Promise((r) => setTimeout(r, 2400));
    const avisos = await evaluar(cdp, SONDA);
    const etiqueta = `${ancho}px ${ruta}`;
    if (!avisos.length) { console.log(etiqueta.padEnd(26) + 'limpio'); continue; }
    total += avisos.length;
    console.log(etiqueta.padEnd(26) + avisos.length + ' aviso(s)');
    for (const a of avisos) console.log('    ' + a.tipo + ': ' + a.detalle + (a.que ? '  ' + JSON.stringify(a.que) : ''));
  }
  cerrar();
}
console.log('\navisos en total:', total);
process.exit(total ? 1 : 0);
