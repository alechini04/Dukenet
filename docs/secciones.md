# Los capítulos, en orden

La página se arma en [`src/pages/index.astro`](../src/pages/index.astro). Todo ocurre
sobre el **plano**: la rejilla fija, los ejes y el cursor propio, que vive en
[`src/components/Plano.astro`](../src/components/Plano.astro) y se monta una sola vez
desde el layout.

| # | Id | Archivo | Qué cuenta |
|---|---|---|---|
| — | — | `Header.astro` | Marca, nav mono numerada, estado «cupo abierto» y barra de avance. |
| — | `#inicio` | `Portada.astro` | La promesa y la obra real moviéndose sola. |
| 00 | `#porque` | `Porque.astro` | Por qué no usamos plantillas. |
| 01 | `#servicios` | `Servicios.astro` | Las cuatro maneras de crecer. |
| 02 | `#proceso` | `Proceso.astro` | Las cinco fases, construyéndose dentro del navegador. |
| 03 | `#obras` | `Obras.astro` | Los sitios reales y el cupo del mes. |
| 04 | `#datos` | `Datos.astro` | El panel que vas a recibir. |
| 05 | `#contacto` | `Contacto.astro` | Formulario y los dos WhatsApp. |
| — | — | `Footer.astro` | Marca grande, enlaces, legales y botón flotante. |

---

## Portada

Titular en tres líneas con «páginas bonitas» tachado, y a la derecha **la obra real**:
una ventana de navegador con la captura de elgatogalletero.com que se recorre sola, y el
teléfono encima con la versión móvil. Abajo, tres datos en mono.

## 00 · Por qué

La frase grande («Una plantilla te hace uno más…») y los tres principios en cajas de
hilo, con una lectura lateral que contrasta plantilla contra a medida.

## 01 · Servicios

Cuatro cajas, una por servicio, con número, nombre, promesa corta en mono, texto, lista
de lo que incluye y enlace que baja al formulario **dejando marcada esa opción**. Los
datos salen de `SERVICIOS` en `site.ts`.

## 02 · Proceso — el capítulo largo

La pantalla se queda fija unas tres pantallas mientras, dentro de una ventana de
navegador, el sitio se construye:

1. **Diagnóstico**: el lienzo con la rejilla del plano y tres notas pegadas.
2. **Propuesta**: se dibujan los bloques de la estructura, con su nombre.
3. **Diseño**: los bloques se rellenan.
4. **Lanzamiento**: un barrido de luz revela la captura real, la barra de direcciones
   termina de escribir el dominio y aparece «en línea».
5. **Crecer**: entra el panel de reporte con sus barras.

La fase activa y la barra de progreso se calculan del tiempo de la línea, así que subir
lo deshace exactamente. Los textos salen de `FASES` en `site.ts`.

## 03 · Obras

Los dos sitios entregados, cada uno en su ventana con la captura recorriéndose y el
teléfono encima. El cursor se convierte en un disco con la etiqueta **«Ver sitio»**
cuando pasas por encima. Debajo, el bloque del cupo del mes con la nota de Convite.

## 04 · Datos

Tablero dentro de una caja: cuatro cifras que cuentan, gráfica de barras y embudo.
**Las cifras son de ejemplo y la página lo dice**; ese rótulo se queda mientras no haya
datos reales autorizados.

## 05 · Contacto

Los dos números grandes a la izquierda y el formulario a la derecha, dentro de una caja
de hilo. No envía nada a ningún servidor: arma el mensaje y abre WhatsApp. Lleva la
casilla obligatoria de autorización de datos.

## Páginas legales y 404

`/privacidad`, `/cookies` y `/terminos` comparten `Legal.astro` (ver [legal.md](legal.md)).
La 404 usa el mismo mundo: una ventana vacía con la rejilla y los seis desvíos.
