# Las animaciones

Todo el movimiento vive en [`src/scripts/app.ts`](../src/scripts/app.ts), en el mismo
orden en que aparece al bajar. Herramientas: [GSAP](https://gsap.com) con ScrollTrigger
y SplitText, y [Lenis](https://lenis.darkroom.engineering) para el scroll suave,
enganchado al reloj de GSAP para que haya un solo bucle.

## Dos interruptores

En el `<head>` corre un script diminuto antes de pintar:

```js
document.documentElement.classList.add('motion');
if (matchMedia('(prefers-reduced-motion: reduce)').matches)
  document.documentElement.classList.add('rm');
```

- **`motion`** solo se agrega si hay JavaScript. Sin JS la página se ve completa y
  quieta: la maqueta del capítulo 03 aparece **terminada**, con la captura real puesta,
  y las cinco fases se leen como lista.
- **`rm`** se agrega si el sistema pide menos movimiento: las líneas de tiempo se
  reproducen una vez en vez de anclarse, los recorridos se vuelven desvanecidos y la
  maqueta deja de flotar. Nada queda invisible.

## Gramática común

| Marca | Qué hace |
|---|---|
| `data-parte` | El título se parte en líneas y sube desde una máscara al entrar. |
| `data-sube` | El bloque entra una vez, desde abajo, con escalonado. |
| `data-aparece` | Igual, pero dentro de la línea de tiempo de la portada. |
| `data-bloque` | Pieza de la maqueta de portada: entra con un rebote corto. |

## Los dos capítulos narrados

**01 · Plantilla.** Una línea ligada al scroll (`scrub: 0.8`): las ocho losas se hunden
y bajan a 30 % de opacidad, la novena sube, aparece su construcción en azul y entran los
tres principios. Subir lo deshace.

**03 · Montaje.** La pieza principal. Una sola línea de tiempo, en pausa, anclada
(`pin`) durante `innerHeight * 3.2`:

- **Fases** (segundos de la línea): `F = [0, 2.4, 4.8, 7.4, 10]`, con `FIN = 12.4`.
- El plano se dibuja con `stroke-dashoffset` sobre polígonos con `pathLength="1"`.
- La captura real entra con un `clipPath` cuyo ancho va de 0 al ancho del plano.
- **Reversible**: la fase activa y la barra de progreso se calculan en `marcarFase(t)` a
  partir del tiempo, nunca con disparos de una sola vía. Si agregas algo, hazlo igual.

Para cambiar el ritmo mueve `F` y `FIN`; para que dure más o menos scroll, cambia el
`3.2`.

## Lo demás

- **Portada**: título por líneas, tachado que se dibuja, maqueta que se arma y luego
  flota (3,6 s la base, 4,4 s la tarjeta).
- **Servicios**: las columnas entran con `data-sube`; el modelo sube 8 px al pasar el
  mouse.
- **Panel**: las cifras cuentan hacia arriba, las barras isométricas rebotan y el embudo
  se abre.
- **Botón flotante**: aparece entre la portada y el formulario.

## Probar con movimiento reducido

En Windows: **Configuración › Accesibilidad › Efectos visuales › Efectos de animación**.
En Chrome DevTools: `Ctrl+Shift+P` → `Emulate CSS prefers-reduced-motion: reduce`.
