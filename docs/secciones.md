# Los capítulos, en orden

La página se arma en [`src/pages/index.astro`](../src/pages/index.astro). Todo ocurre
sobre dos fondos fijos que el layout monta una sola vez: el **núcleo 3D**
([`Nucleo.astro`](../src/components/Nucleo.astro) + [`tres.ts`](../src/scripts/tres.ts))
y el **plano** —rejilla, ejes y cursor propio—
([`Plano.astro`](../src/components/Plano.astro)).

| Id | Archivo | Qué cuenta |
|---|---|---|
| — | `Header.astro` | Logotipo centrado, botón de menú y barra de avance. |
| `#inicio` | `Portada.astro` | La promesa, los cuatro servicios y el núcleo de la marca. |
| `#porque` | `Porque.astro` | Por qué no usamos plantillas. |
| `#servicios` | `Servicios.astro` | Un capítulo a pantalla completa por servicio. |
| `#proceso` | `Proceso.astro` | Las cinco fases, construyéndose dentro del navegador. |
| `#obras` | `Obras.astro` | El trabajo entregado y el cupo del mes. |
| `#datos` | `Datos.astro` | El panel que vas a recibir. |
| `#contacto` | `Contacto.astro` | Formulario y los dos WhatsApp. |
| — | `Footer.astro` | Marca grande, enlaces, legales y botón flotante de WhatsApp. |

---

## Encabezado

Solo el logotipo —**Duke** en papel, **Net** en azul— centrado, y a la derecha el botón
de menú. El menú ocupa la pantalla completa con las cinco secciones, el botón de cotizar
y los dos WhatsApp. Debajo del encabezado, una línea de un píxel marca cuánto llevas
leído.

## Portada

Titular en tres líneas con «páginas bonitas» tachado, el párrafo de promesa y los
botones. Abajo, los cuatro servicios como píldoras que bajan a su capítulo. A la derecha
está el núcleo 3D de la marca, y **se queda ahí**: se va con la portada al bajar, no
persigue al lector por el resto de la página.

## Por qué

La frase grande («Una plantilla te hace uno más…») y los tres principios en cajas de
hilo, con una lectura lateral que contrasta plantilla contra a medida.

## Servicios — lo que brilla

Una presentación corta y después **un capítulo a pantalla completa por servicio**,
alternando lado: texto a la izquierda y núcleo a la derecha, luego al revés. Cada uno
lleva su orden (01 / 04), el nombre en grande, la promesa corta en mono, el texto, las
píldoras de lo que incluye y el botón que baja al formulario **dejando marcada esa
opción**. La cifra gigante del fondo es decoración.

Cada uno tiene **su propio objeto 3D**, que no ilustra el servicio sino que lo actúa, y
que **se arma mientras lo miras**: el catálogo se apila en una torre, la página se abre
en sus capas, la campaña converge en un punto encendido y el panel respira como una onda.
Los datos salen de `SERVICIOS` en `site.ts`.

## Proceso — el capítulo largo

La pantalla se queda fija unas tres pantallas mientras, dentro de una ventana de
navegador, se construye una página:

1. **Diagnóstico**: el lienzo con la rejilla del plano y tres notas pegadas.
2. **Propuesta**: se dibujan los bloques de la estructura, con su nombre.
3. **Diseño**: los bloques se rellenan.
4. **Lanzamiento**: un barrido de luz revela el sitio publicado, la barra de direcciones
   termina de escribir `tunegocio.com` y aparece «en línea».
5. **Crecer**: entra el panel de reporte con sus barras.

El sitio que aparece al final está **dibujado**, no es la captura de ningún cliente: esto
es una maqueta de cómo se construye la tuya. La fase activa y la barra de progreso se
calculan del tiempo de la línea, así que subir lo deshace exactamente. Los textos salen
de `FASES` en `site.ts`.

## Trabajos realizados

Aquí —y solo aquí— aparece el trabajo de un cliente: su ventana con la captura
recorriéndose sola y el teléfono encima. El cursor se convierte en un disco con la
etiqueta **«Ver sitio»** cuando pasas por encima. Debajo, el bloque del cupo del mes con
la nota de Convite.

## Datos

Tablero dentro de una caja: cuatro cifras que cuentan, gráfica de barras y embudo.
**Las cifras son de ejemplo y la página lo dice**; ese rótulo se queda mientras no haya
datos reales autorizados.

## Contacto

Los dos números grandes a la izquierda y el formulario a la derecha, dentro de una caja
de hilo. No envía nada a ningún servidor: arma el mensaje y abre WhatsApp. Lleva la
casilla obligatoria de autorización de datos.

## Páginas legales y 404

`/privacidad`, `/cookies` y `/terminos` comparten `Legal.astro` (ver [legal.md](legal.md)).
La 404 usa el mismo mundo: una ventana vacía con la rejilla y los desvíos.
