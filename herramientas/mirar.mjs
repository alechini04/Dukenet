/**
 * Captura la página sección por sección, a los anchos que importan.
 *
 *   node herramientas/mirar.mjs [carpeta] [--ancho 390] [--movimiento reduce]
 *
 * Deja un JPEG por sección. Sirve para lo que ninguna comprobación automática
 * resuelve: mirar. Varios defectos reales del sitio salieron así.
 *
 * Necesita el sitio servido en http://127.0.0.1:4323 (`npm run preview`).
 */
import { pagina, evaluar, REVELAR } from './chrome.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const opcion = (nombre, pordefecto) => {
  const i = args.indexOf('--' + nombre);
  return i >= 0 ? args[i + 1] : pordefecto;
};
const salida = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true) || 'capturas';
const ancho = Number(opcion('ancho', 1440));
const movimiento = opcion('movimiento', 'no-preference');
const BASE = opcion('base', 'http://127.0.0.1:4323');

const SECCIONES = ['inicio', 'porque', 'servicios', 'proceso', 'obras', 'datos', 'contacto'];
const PAGINAS = [['privacidad', '/privacidad'], ['cookies', '/cookies'], ['terminos', '/terminos'], ['404', '/404.html']];

mkdirSync(salida, { recursive: true });
const { cdp, cerrar } = await pagina({ url: BASE + '/', ancho, movimiento, perfil: salida + '/.perfil' });

for (const id of SECCIONES) {
  await evaluar(cdp, `document.getElementById('${id}').scrollIntoView({ block: 'start' }); return 1;`);
  await new Promise((r) => setTimeout(r, 2200));
  const { data } = await cdp.enviar('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
  const archivo = `${salida}/${ancho}-${id}.jpg`;
  writeFileSync(archivo, Buffer.from(data, 'base64'));
  console.log('capturada', archivo);
}

for (const [nombre, ruta] of PAGINAS) {
  await cdp.enviar('Page.navigate', { url: BASE + ruta });
  await new Promise((r) => setTimeout(r, 2600));
  await evaluar(cdp, REVELAR);
  const { data } = await cdp.enviar('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
  const archivo = `${salida}/${ancho}-${nombre}.jpg`;
  writeFileSync(archivo, Buffer.from(data, 'base64'));
  console.log('capturada', archivo);
}
cerrar();
