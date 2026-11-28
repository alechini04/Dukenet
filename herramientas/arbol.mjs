/**
 * Imprime el árbol de accesibilidad REAL de Chromium para una página.
 *
 *   node herramientas/arbol.mjs [/privacidad] [--roles heading,link]
 *
 * Esto es lo que recibe un lector de pantalla. No confundir con el texto que
 * sacan las herramientas de automatización: esas concatenan `textContent` sin
 * aplicar las reglas de `accname` y hacen parecer rotos títulos que están
 * bien (ver `docs/mantenimiento.md`). Dos defectos reales se encontraron aquí:
 * títulos leídos con las palabras pegadas y una casilla anunciada como
 * inválida nada más cargar.
 */
import { pagina, evaluar, REVELAR } from './chrome.mjs';

const args = process.argv.slice(2);
// Se acepta con o sin barra inicial: algunas consolas de Windows convierten
// «/404.html» en una ruta del sistema antes de que llegue aquí.
const suelto = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--roles');
const ruta = suelto ? (suelto.startsWith('/') ? suelto : '/' + suelto) : '/';
const i = args.indexOf('--roles');
const filtro = i >= 0 ? new Set(args[i + 1].split(',')) : null;
const BASE = process.env.BASE || 'http://127.0.0.1:4323';

const { cdp, cerrar } = await pagina({ url: BASE + ruta, perfil: '.perfil-arbol' });
await evaluar(cdp, REVELAR);
await new Promise((r) => setTimeout(r, 500));

const { nodes } = await cdp.enviar('Accessibility.getFullAXTree');
const INTERESAN = new Set(['heading', 'link', 'button', 'navigation', 'main', 'banner', 'contentinfo',
  'dialog', 'textbox', 'checkbox', 'radio', 'radiogroup', 'group', 'form', 'image', 'StaticText', 'status']);

// getFullAXTree devuelve los nodos en un orden interno (los títulos de «Dejas de
// adivinar» y «Cotiza tu web hoy» salían antes que «Cuatro maneras de crecer»,
// aunque en la página van después). Se recorre desde la raíz por childIds para
// imprimirlos en el orden en que los lee un lector de pantalla.
const porId = new Map(nodes.map((x) => [x.nodeId, x]));
const enOrden = [];
const visto = new Set();
const recorrer = (id) => {
  const x = porId.get(id);
  if (!x || visto.has(id)) return;
  visto.add(id);
  enOrden.push(x);
  for (const h of x.childIds || []) recorrer(h);
};
const raices = nodes.filter((x) => !x.parentId);
for (const r of raices.length ? raices : nodes.slice(0, 1)) recorrer(r.nodeId);
for (const x of nodes) if (!visto.has(x.nodeId)) enOrden.push(x);

let n = 0;
for (const nodo of enOrden) {
  if (nodo.ignored) continue;
  const rol = nodo.role?.value;
  if (!rol || !(filtro ? filtro.has(rol) : INTERESAN.has(rol))) continue;
  const nombre = (nodo.name?.value || '').replace(/\s+/g, ' ').trim();
  if (!nombre) continue;
  const extra = {};
  for (const p of nodo.properties || []) {
    if (['required', 'invalid', 'checked', 'disabled', 'expanded', 'modal'].includes(p.name)) {
      extra[p.name] = p.value?.value;
    }
  }
  const desc = (nodo.description?.value || '').replace(/\s+/g, ' ').trim();
  n++;
  console.log(
    String(n).padStart(3) + '  ' + rol.padEnd(12) + ' ' + JSON.stringify(nombre.slice(0, 68)) +
    (desc ? '\n       descripción: ' + JSON.stringify(desc.slice(0, 60)) : '') +
    (Object.keys(extra).length ? '\n       ' + JSON.stringify(extra) : ''),
  );
}
console.log('\nnodos expuestos:', n);
cerrar();
