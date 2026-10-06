# Los capítulos, en orden

La página se arma en [`src/pages/index.astro`](../src/pages/index.astro) y son **seis
capítulos a pantalla completa**, cada uno con su número y su idea. Todas las escenas
isométricas salen del mismo proyector: [`src/lib/iso.ts`](../src/lib/iso.ts).

| # | Id | Archivo | Qué cuenta |
|---|---|---|---|
| — | — | `Header.astro` | Marca, cuatro enlaces, botón de cotizar y barra de avance. |
| 00 | `#inicio` | `Portada.astro` | La promesa y la maqueta que se arma sola. |
| 01 | `#plantilla` | `Plantilla.astro` | Por qué no usamos plantillas. |
| 02 | `#obras` | `Servicios.astro` | Las cuatro maneras de crecer. |
| 03 | `#montaje` | `Montaje.astro` | Las cinco fases, construyéndose. |
| 04 | `#entregadas` | `Entregadas.astro` | Obras reales y el cupo del mes. |
| 05 | `#panel` | `Panel.astro` | Los datos que vas a recibir. |
| 06 | `#contacto` | `Contacto.astro` | El formulario y los dos WhatsApp. |
| — | — | `Footer.astro` | Marca grande, enlaces y el botón flotante. |

---

## 00 · Portada

Titular en tres líneas con «páginas bonitas» tachado, el párrafo de presentación y tres
botones (cotizar y los dos WhatsApp, que salen de `WHATSAPP` en `site.ts`).

A la derecha, la **maqueta**: una plataforma con cuatro bloques que se apilan al cargar
y una tarjeta que flota aparte. Respira despacio mientras no la tocas.

## 01 · Plantilla

Nueve losas idénticas en isométrico. Al bajar, ocho se hunden y se apagan y la novena se
levanta y se construye en azul, mientras aparecen los tres principios. La animación está
ligada al scroll: si subes, se deshace.

## 02 · Servicios

Cuatro columnas, una por servicio, cada una con su propio modelo isométrico (tienda,
página, landing, datos). Los datos salen de `SERVICIOS` en `site.ts`. El enlace de cada
columna baja al formulario **y deja marcada esa opción**.

## 03 · Montaje — el capítulo largo

La pantalla se queda fija durante unas tres pantallas y media de scroll mientras una
sola línea de tiempo construye el sitio:

1. **Diagnóstico**: el lote vacío con tres notas flotando.
2. **Propuesta**: se dibuja el plano, arista por arista.
3. **Diseño**: los volúmenes se llenan.
4. **Lanzamiento**: entra la captura real de El Gato Galletero, proyectada sobre la cara
   superior con la misma matriz isométrica, y se estampa «EN LÍNEA».
5. **Crecer**: suben las barras de datos al lado.

El texto de la fase y la barra de progreso se calculan desde el tiempo de la línea, así
que el capítulo es reversible. Los textos salen de `FASES` en `site.ts`.

## 04 · Entregadas

Los casos reales dentro de un navegador dibujado, con la captura móvil encima de la
esquina. Al pasar el mouse, la captura se recorre sola. Debajo, el bloque del cupo del
mes y la nota de Convite (en construcción).

## 05 · Panel

Tablero oscuro: cuatro cifras que cuentan hacia arriba, una gráfica de barras
isométricas y el embudo de compra. **Las cifras son de ejemplo y la página lo dice**;
ese rótulo se queda mientras no haya datos reales autorizados.

## 06 · Contacto

A la izquierda el titular y los dos números grandes; a la derecha el formulario sobre
papel blanco, la única superficie blanca grande de la página. No envía nada a ningún
servidor: arma el mensaje y abre WhatsApp con el texto escrito.

## Página 404

Mismo mundo: lote vacío con un bloque, botones de volver y los seis desvíos. Va marcada
`noindex` y fuera del sitemap.
