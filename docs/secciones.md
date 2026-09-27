# Las secciones, en orden

La página se arma en [`src/pages/index.astro`](../src/pages/index.astro). Cada
bloque de abajo es un componente en `src/components/`.

Entre secciones hay una **cinta de obra** (`Rail.astro`): las franjas diagonales
con una placa a la derecha (`FR-03 · Obras`). Es decorativa y está marcada como
tal para los lectores de pantalla.

El encabezado muestra en todo momento en qué "frente" vas (`FR-01 · Inicio`,
`FR-02 · Manifiesto`…). Esa numeración vive en dos sitios que deben coincidir:
`FRENTES` en [`src/data/site.ts`](../src/data/site.ts) y el objeto `FR` en
[`src/scripts/app.ts`](../src/scripts/app.ts).

---

## Encabezado · `Header.astro`

Fijo arriba, 67 px de alto (64 de barra + 3 de la banda de avance). Contiene la
marca, el frente actual, el menú de escritorio, el botón **Cotizar** y, en
celular, el botón de menú.

- La banda azul de abajo se llena a medida que bajas: es el avance de lectura.
- El menú de celular **no está dentro de `<header>`** a propósito. El header
  tiene `backdrop-filter` y eso lo convertiría en el marco de referencia del
  panel, recortándolo a 67 px de alto. Si lo mueves adentro, el menú se ve
  cortado.
- Se cierra con `Esc`, al tocar un enlace o al pasar a pantalla ancha.

## Portada · `Hero.astro` · `#inicio` · FR-01

La valla azul: titular, el párrafo de presentación, tres botones (Cotizar y los
dos WhatsApp, que salen de `WHATSAPP` en `site.ts`) y la **ficha de obra** con
el proyecto, el constructor, la cobertura y las cinco etapas.

- El titular tacha "páginas bonitas" palabra por palabra, para que la línea
  sobreviva cuando el texto se parte en celular.
- La lista de etapas va rotando sola cada 1,9 s (solo indica en qué consiste el
  método; no es el avance de ningún proyecto real).

## Cinta · `Cinta.astro`

Dos filas que se desplazan en direcciones opuestas: arriba, qué construimos;
abajo, las ciudades (`CIUDADES` en `site.ts`). El texto está duplicado para que
el bucle no tenga costura. Con movimiento reducido se queda quieta.

## Manifiesto · `Manifiesto.astro` · `#manifiesto` · FR-02

La frase grande ("Una plantilla te hace uno más…") que se ilumina palabra por
palabra mientras la lees, la foto de diagnóstico y los tres principios.

Los tres principios están en el propio archivo, en el arreglo `principios`.

## Obras · `Obras.astro` · `#obras` · FR-03

Los cuatro tipos de proyecto (A, B, C, D) como pestañas: a la izquierda la
lista, a la derecha el panel con foto, descripción, qué incluye y un botón de
cotizar. Los datos salen de `SERVICIOS` en `site.ts`.

- Funciona con teclado: flechas para moverse, `Inicio` y `Fin` para los extremos.
- El botón de cada panel lleva `data-plan`: al hacer clic te baja al formulario
  **y deja marcada esa opción**.

## Obras entregadas · `Entregadas.astro` · `#entregadas` · FR-04

Los casos reales, cada uno dentro de un navegador y un celular dibujados, con
capturas de pantalla completas. Abajo, el bloque "Tu marca aquí" con el cupo
del mes.

Los casos están en el arreglo `casos`, dentro del mismo archivo. Convite aparece
como "En construcción".

- En pantallas con mouse, los marcos se desplazan levemente a distinto ritmo.
- En celular, la captura se recorre sola mientras bajas, como si el sitio se
  estuviera navegando.

## Cronograma · `Cronograma.astro` · `#cronograma` · FR-05

La pieza principal: la pantalla se ancla y, al bajar, una obra se construye en
cinco fases (notas → planos → diseño → lanzamiento → reporte), con el texto de
la fase actualizándose a la izquierda. Los textos de las fases salen de `FASES`
en `site.ts`; los planos, cotas y notas adhesivas están dibujados en SVG dentro
del componente.

La línea de tiempo completa está explicada en [animaciones.md](animaciones.md).

## Panel · `Panel.astro` · `#panel` · FR-06

El panel de datos: cuatro indicadores que cuentan hacia arriba, una gráfica por
día y un embudo de compra.

**Las cifras son de ejemplo y la página lo dice.** El rótulo "Ejemplo" tiene que
quedarse mientras no haya datos reales autorizados por un cliente.

## Cotizar · `Contacto.astro` · `#contacto` · FR-07

La valla de cierre: los dos WhatsApp y el formulario. El formulario no envía
nada a ningún servidor: arma un mensaje y abre WhatsApp con el texto escrito.

- Obligatorios: nombre y negocio. Si faltan, se marcan y el foco va al primero.
- El mensaje sale hacia el **primer número** de `WHATSAPP` (`data-tel` del
  formulario).
- Si el navegador bloquea la ventana emergente, se navega a WhatsApp en la misma
  pestaña y se avisa en pantalla.

## Pie · `Footer.astro`

La marca grande, los enlaces (WhatsApp, obras entregadas, secciones) y el año.

También vive aquí el **botón flotante de WhatsApp**, que aparece solo entre la
portada y el formulario, y se esconde sobre el bloque "Tu marca aquí" para no
tapar su botón.

## Ruta no encontrada · `src/pages/404.astro`

Mismo mundo visual: cartel azul con "Esta ruta no existe", botón de volver al
inicio, los dos WhatsApp y un desvío a cada sección. Va marcada `noindex` y
queda fuera del sitemap.
