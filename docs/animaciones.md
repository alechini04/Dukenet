# Las animaciones

Todo el movimiento está en [`src/scripts/app.ts`](../src/scripts/app.ts), en un
solo archivo y en el mismo orden en que aparece al bajar por la página.

Herramientas: [GSAP](https://gsap.com) con ScrollTrigger y SplitText para las
animaciones, y [Lenis](https://lenis.darkroom.engineering) para el desplazamiento
suave. Lenis se engancha al reloj de GSAP, así que hay un solo bucle de
animación y no dos peleándose.

## Dos interruptores: `motion` y `rm`

En el `<head>` ([`Base.astro`](../src/layouts/Base.astro)) corre un script
diminuto antes de pintar:

```js
document.documentElement.classList.add('motion');
if (matchMedia('(prefers-reduced-motion: reduce)').matches)
  document.documentElement.classList.add('rm');
```

- **`motion`** se agrega solo si hay JavaScript. Sin JS la página se ve completa
  y quieta: nada arranca escondido esperando una animación que no va a llegar.
- **`rm`** se agrega si el sistema del visitante pide menos movimiento.

Sin JavaScript la página queda completa y quieta, y además cambia lo que no
tendría sentido: el botón de menú (que no podría abrir nada) deja su lugar al
de cotizar, el botón de enviar del formulario se reemplaza por los dos números
de WhatsApp, y el cronograma muestra la obra terminada —la tienda real, el
sello y el reporte— en vez de quedarse a medio construir. Esas reglas se
escriben con `:global(html:not(.motion))`.

Con `rm` la página **no se queda sin vida**: conserva las apariciones suaves y
el conteo de cifras, pero se van el desplazamiento suave, el anclaje del
cronograma, los desplazamientos en paralaje, los zooms y los recorridos largos.
En el código eso se ve así:

- `const rm = ...` decide cada caso.
- `Y(n)` devuelve `0` cuando hay movimiento reducido: los desplazamientos
  verticales se vuelven simples apariciones.
- El cronograma se reparte en dos con `gsap.matchMedia()`: anclado y ligado al
  scroll si hay movimiento; reproducido una vez, más rápido, si no.

## La luz

El sitio es una obra de noche, así que está iluminado, no plano. Hay **una sola
lámpara** que sigue al puntero y a la que responden todas las superficies:

- **El suelo.** Cada zona oscura lleva una capa `.luz` (un `<span>` dentro de la
  sección) con un degradado radial azul muy bajo. La capa es absoluta y el motor
  le pasa a cada sección dónde está el puntero dentro de ella (`--lx`, `--ly`),
  así que se lee como una lámpara que camina por la página. Si la capa fuera
  `fixed`, Chrome la compone por encima de los carteles y los lava.
- **El cartel.** No se ilumina la cara: se ilumina su **borde reflectante**, que
  es la parte que en una valla real lleva la lámina. Eso no es un capricho: el
  texto blanco sobre azul va a 3,6:1, y cualquier aclarado de la cara lo baja del
  mínimo. El brillo es `.glint`, un marco enmascarado con un radial en `--gx` /
  `--gy` y una intensidad `--glint` que baja con la distancia.
- **La profundidad.** Los paneles se inclinan como máximo 1,2°, puestos sobre un
  contenedor con `.escena` (la perspectiva) y marcados con `data-tilt`. Dentro del
  cartel, el titular y la ficha se separan un par de puntos porcentuales con
  `data-paralaje` (no se usa `translateZ` porque `overflow: hidden` aplana el 3D).
- **Las pantallas.** Cada caso entregado tiene un halo `.brillo` detrás del
  dispositivo que sube al pasar el mouse; el cronograma enciende su propia luz
  cuando el sitio sale al aire; el panel de datos recibe un barrido de lectura
  mientras cuentan las cifras.
- **La marca.** La placa NET recibe un destello al pasar el mouse y una vez al
  llegar (clase `.net-sheet` más `.destella`).

Todo esto corre **solo con puntero fino** (`hover: hover and pointer: fine`), solo
con `motion` y nunca con movimiento reducido. El bucle se despierta al mover el
mouse y se duerme solo; cada cuadro lee primero todas las medidas y después
escribe, para no forzar un reflujo por elemento.

## Qué se mueve en cada sección

| Sección | Qué pasa |
|---|---|
| Portada | El cartel sube como una valla que se iza, las líneas del titular salen de una máscara, se tacha "páginas bonitas", entran los botones y la ficha, y los tornillos giran a su sitio. Al bajar, el cartel se aleja un poco. |
| Cinta | Dos filas en bucle infinito, en direcciones opuestas (CSS puro, 38 s y 52 s). |
| Manifiesto | La frase se enciende palabra por palabra al ritmo del scroll; la foto se descubre de abajo hacia arriba. |
| Títulos grandes | Se parten en líneas y suben desde una máscara la primera vez que entran en pantalla. |
| Obras | Al cambiar de pestaña, la foto se descubre de izquierda a derecha y el texto entra escalonado. |
| Entregadas | El navegador y el celular se desplazan a distinto ritmo. En pantallas táctiles, las capturas se recorren solas. |
| Cronograma | La obra se construye en cinco fases mientras la pantalla está anclada (ver abajo). |
| Panel | Las cifras cuentan hacia arriba, las barras rebotan y el embudo se abre. |
| Cierre | La valla del formulario se iza igual que la de la portada. |
| Pie | La marca grande sube en dos tiempos. |

## El cronograma, por dentro

Es una sola línea de tiempo de GSAP, en pausa, ligada al scroll:

- **Fases** (en segundos de la línea de tiempo):
  `PHASES = [0, 2.2, 4.6, 7.2, 10.2]` y `END = 12.8`.
  Cada valor es el comienzo de una fase: diagnóstico, propuesta, diseño,
  lanzamiento, crecer.
- **Anclaje**: la escena queda fija durante `innerHeight * 3.4`, o sea unas tres
  pantallas y media de scroll.
- **Reversible**: la barra de direcciones y la fase activa se calculan a partir
  del tiempo (`urlAt(t)` y `setPhase(t)`), no con disparos de una sola vía. Por
  eso se puede subir y bajar cuantas veces se quiera y siempre muestra lo que
  corresponde. Si agregas algo, hazlo igual: evita `.call()` para cambiar el
  contenido, porque al devolverte queda desfasado.
- **Arranque dibujado**: la cuadrícula del plano empieza al 40 % de opacidad, no
  en cero. Si alguien entra directo con `#cronograma`, cae justo en el segundo 0
  y una caja vacía se lee como un error de carga.

Para cambiar el ritmo, mueve los valores de `PHASES` (y `END`); para que dure
más o menos scroll, cambia el `3.4`.

## Probar con movimiento reducido

En Windows: **Configuración › Accesibilidad › Efectos visuales › Efectos de
animación**. Apagado = movimiento reducido. Ojo: Windows suele traerlo apagado,
así que si en tu equipo la página se ve "sin animaciones", revisa esto primero.

En las herramientas de desarrollo de Chrome: `Ctrl+Shift+P` →
`Emulate CSS prefers-reduced-motion: reduce`.

## Si algo queda invisible

Casi siempre es lo mismo: un elemento que GSAP dejó en `autoAlpha: 0` porque su
animación nunca llegó a dispararse. Cosas que ayudan:

- `ScrollTrigger.refresh()` ya se llama al cargar, al terminar cada imagen y al
  cambiar de pestaña en Obras. Si insertas contenido después, vuelve a llamarlo.
- Las secciones que aparecen al entrar usan `once: true`: se animan una sola vez
  y se quedan.
- Sin JavaScript no hay `motion`, y por eso todo el CSS de arranque escondido
  está detrás de `html.motion`. Si escribes una regla nueva que esconda algo,
  ponla dentro de `:global(html.motion:not(.rm))` o quedará escondido para
  siempre en el peor de los casos.
