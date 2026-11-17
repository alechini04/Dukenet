# Herramientas de verificación

Tres programas que abren un **Chrome de verdad** y miden el sitio ya compilado.
Viven en [`herramientas/`](../herramientas/) y no hacen falta para construir la
página: son para comprobarla.

Antes de usarlas, sirve el sitio:

```bash
npm run build
npm run preview        # queda en http://127.0.0.1:4323 (puerto fijado en astro.config.mjs)
```

| Comando | Para qué |
|---|---|
| `npm run mirar -- capturas --ancho 390` | Un JPEG por sección y por página legal, al ancho que pidas. Para mirar. |
| `npm run medir -- --anchos 320,390,768,1440` | Barre las cinco páginas y avisa de desplazamiento horizontal, texto recortado y blancos táctiles pequeños. Sale con código 1 si encuentra algo. |
| `npm run arbol -- privacidad --roles heading,link` | Imprime el árbol de accesibilidad real: lo que recibe un lector de pantalla. |

Si el preview ya estaba corriendo en otro puerto, detenlo (`npx astro preview stop`) y vuelve a lanzarlo: el que queda vivo conserva el puerto antiguo y las herramientas ven la página de error de Chrome.

La ruta se puede escribir con barra inicial o sin ella.

## Por qué un Chrome aparte

Las dos cosas que más cuestan de este sitio -el movimiento y el color- no se
pueden juzgar leyendo archivos, y medirlas mal es fácil. Están documentadas en
[mantenimiento.md](mantenimiento.md), en «Trampas conocidas», las dos que
costaron tiempo de verdad:

- **Una ventana que no se está pintando congela las animaciones.** El reloj de
  GSAP va sobre `requestAnimationFrame`, así que en una pestaña oculta nada
  avanza y las transiciones se quedan en el valor inicial. Medido: cero
  fotogramas en 800 ms. Este Chrome sí pinta.
- **El árbol que imprimen las herramientas de automatización no es el nombre
  accesible.** Concatena texto sin aplicar `accname`. `npm run arbol` pide el
  árbol a Chromium, que es la fuente autoritativa.

## Lo que ya encontraron

- Títulos que un lector de pantalla leía con las palabras pegadas («Dejasde
  adivinar»), porque SplitText calcula su `aria-label` del `textContent`.
- La casilla de autorización anunciada como inválida nada más cargar.
- El cursor propio aparcado en la esquina mientras el nativo ya estaba oculto:
  ningún cursor visible hasta mover el ratón.

## Si añades una comprobación

Que no avise de lo que no es un problema. `medir.mjs` excluye a propósito los
enlaces que van dentro de una frase, porque el criterio 2.5.8 de WCAG los
exceptúa: su tamaño lo manda el interlineado del texto que los rodea. Sin esa
excepción la herramienta sacaba cuatro avisos falsos y se habría vuelto ruido.

## Requisitos

Chrome o Chromium instalado. Se busca en las rutas habituales de Windows, macOS
y Linux; si está en otro sitio, ponlo en la variable de entorno `CHROME`. No
instala nada: usa el WebSocket que ya trae Node.
