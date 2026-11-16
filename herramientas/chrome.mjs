/**
 * Maneja un Chrome de verdad por el protocolo de DevTools.
 *
 * Por qué existe: el sitio es casi todo movimiento y color. Nada de eso se
 * puede juzgar leyendo archivos, y las comprobaciones automáticas sin
 * navegador dan falsos positivos (ver `docs/mantenimiento.md`, «Trampas
 * conocidas»). Esto abre un Chrome que **sí pinta**, así que GSAP avanza, las
 * transiciones terminan y el árbol de accesibilidad es el real.
 *
 * No necesita instalar nada: usa el Chrome del equipo y el WebSocket que ya
 * trae Node. Si no encuentra Chrome, lo dice y no sigue.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** Sitios donde suele estar Chrome, por sistema. */
const CANDIDATOS = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export function buscarChrome() {
  const hallado = CANDIDATOS.find((p) => existsSync(p));
  if (!hallado) {
    throw new Error(
      'No encuentro Chrome. Pon la ruta en la variable de entorno CHROME, ' +
        'o instala Chrome/Chromium.',
    );
  }
  return hallado;
}

/**
 * Abre Chrome sin ventana y espera a que responda el puerto de depuración.
 * Devuelve el proceso y la dirección del WebSocket de la primera pestaña.
 */
export async function abrir({ puerto, perfil, url = 'about:blank', ancho = 1440, alto = 900 } = {}) {
  if (!perfil) throw new Error('Hace falta un directorio de perfil (perfil: ...).');
  // Puerto libre al azar: así dos herramientas pueden correr a la vez sin
  // pisarse. Y el perfil tiene que ser ruta absoluta o Chrome lo ignora.
  puerto = puerto ?? 9300 + Math.floor(Math.random() * 600);
  const hijo = spawn(buscarChrome(), [
    `--remote-debugging-port=${puerto}`,
    `--user-data-dir=${resolve(perfil)}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    `--window-size=${ancho},${alto}`,
    url,
  ], { stdio: 'ignore' });

  for (let intento = 0; intento < 80; intento++) {
    try {
      const r = await fetch(`http://127.0.0.1:${puerto}/json/list`);
      const pestañas = (await r.json()).filter((p) => p.type === 'page');
      if (pestañas.length) return { hijo, puerto, wsUrl: pestañas[0].webSocketDebuggerUrl };
    } catch {
      /* todavía no levanta */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  hijo.kill();
  throw new Error('Chrome no abrió el puerto de depuración.');
}

/** Conecta al protocolo y devuelve `enviar(metodo, params)` y `cerrar()`. */
export function conectar(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pendientes = new Map();
  let n = 0;
  const listo = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (!m.id || !pendientes.has(m.id)) return;
    const { res, rej } = pendientes.get(m.id);
    pendientes.delete(m.id);
    m.error ? rej(new Error(m.error.message)) : res(m.result);
  };

  const enviar = async (metodo, params = {}) => {
    await listo;
    const id = ++n;
    return new Promise((res, rej) => {
      pendientes.set(id, { res, rej });
      ws.send(JSON.stringify({ id, method: metodo, params }));
    });
  };
  return { enviar, cerrar: () => ws.close() };
}

/** Evalúa código en la página. El cuerpo puede usar `await` y debe `return`. */
export async function evaluar(cdp, cuerpo) {
  const r = await cdp.enviar('Runtime.evaluate', {
    expression: `(async () => { ${cuerpo} })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description || 'error al evaluar en la página');
  }
  return r.result.value;
}

/**
 * Abre una página lista para medir: Chrome conectado, tamaño fijado y la
 * preferencia de movimiento que se pida. Devuelve también `cerrar()`.
 */
export async function pagina({ url, ancho = 1440, alto = 900, movimiento = 'no-preference', perfil, puerto } = {}) {
  const { hijo, wsUrl } = await abrir({ perfil, puerto, ancho, alto });
  const cdp = conectar(wsUrl);
  await cdp.enviar('Runtime.enable');
  await cdp.enviar('Page.enable');
  await cdp.enviar('Accessibility.enable');
  await cdp.enviar('Emulation.setDeviceMetricsOverride', {
    width: ancho, height: alto, deviceScaleFactor: 1, mobile: ancho < 768,
  });
  await cdp.enviar('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: movimiento }],
  });
  if (url) {
    await cdp.enviar('Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 3200));
  }
  return { cdp, hijo, cerrar: () => { cdp.cerrar(); hijo.kill(); } };
}

/** Revela lo que la animación de entrada mantiene oculto, para poder medirlo. */
export const REVELAR = `
  document.querySelectorAll('[data-sube],[data-aparece],[data-parte],[data-revela]')
    .forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.transform = 'none'; });
  return 1;`;
