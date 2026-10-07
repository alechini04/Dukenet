# Las animaciones

Todo el movimiento vive en [`src/scripts/app.ts`](../src/scripts/app.ts), en el mismo
orden en que aparece al bajar. Herramientas: [GSAP](https://gsap.com) con ScrollTrigger y
SplitText, y [Lenis](https://lenis.darkroom.engineering) para el scroll suave, enganchado
al reloj de GSAP para que haya un solo bucle. Esa es la razón de que se sienta fluida
aunque haya mucho moviéndose: una sola línea de tiempo por cuadro y solo transformaciones.

## Tres interruptores

En el `<head>`, antes de pintar:

```js
document.documentElement.classList.add('motion');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) classList.add('rm');
if (matchMedia('(hover: hover) and (pointer: fine)').matches) classList.add('puntero-fino');
```

- **`motion`**: solo con JavaScript. Sin él la página se ve completa y quieta, y la
  maqueta del proceso aparece **terminada**, con el sitio publicado puesto.
- **`rm`**: movimiento reducido. Se va el objeto 3D, el cursor propio, el pin, el
  recorrido automático de las capturas y los desplazamientos; las líneas se reproducen
  una vez.
- **`puntero-fino`**: solo con mouse. Enciende el cursor propio y esconde el del sistema.

Hay un cuarto, que lo pone el propio script cuando el 3D arrancó bien: **`con-3d`**. Sin
él los capítulos de servicio se recogen a una sola columna, porque la columna vacía solo
tiene sentido si ahí vive el núcleo.

## Los objetos 3D

Viven aparte, en [`src/scripts/tres.ts`](../src/scripts/tres.ts), y se cargan con
`import()` solo si hay `motion`, no hay ahorro de datos y el equipo tiene memoria
suficiente. Son unos 127 KB comprimidos que no pesan en la primera carga.

**Cada objeto se dibuja donde está su hueco.** El hueco es un div vacío con su propia
altura, y el nombre decide qué pieza se construye:

```html
<div class="serv__objeto" data-objeto="tienda"></div>
```

| Nombre | Qué se dibuja | Dónde está |
|---|---|---|
| `nucleo` | La esfera de la marca, su jaula y los cuatro cuadros | Portada |
| `tienda` | Bolsa de compras con sus productos | Servicio 01 |
| `negocio` | Pantalla de navegador y teléfono | Servicio 02 |
| `landing` | Diana con la flecha en el centro | Servicio 03 |
| `datos` | Las barras del panel | Servicio 04 |

El motor lee el rectángulo del hueco en cada cuadro y coloca ahí el objeto, a la escala
que quepa. Por eso el núcleo se queda arriba y se va con la portada: no viaja por la
página. Solo se dibuja lo que está a la vista, y cuando no queda nada visible el lienzo
se limpia; si no, se quedaría pegado el último fotograma.

Lo que tiene cara se mece en vez de dar vueltas enteras (`gira` negativo en el catálogo);
solo el núcleo gira sin parar.

Para añadir un objeto nuevo: una función que devuelva su `Group` en `tres.ts`, una
entrada en `catalogo` y un div con ese `data-objeto` donde lo quieras. Para apagarlos de
raíz, quita `<Nucleo />` del layout.

## Gramática común

| Marca | Qué hace |
|---|---|
| `data-parte` | El título se parte en líneas y sube desde una máscara. |
| `data-sube` | El bloque entra una vez, desde abajo, escalonado. |
| `data-revela` | La imagen se descubre con una máscara que sube, y la foto se asienta desde 1.18. |
| `data-tira` | La captura real se recorre sola dentro de su ventana, en bucle de 26 s. |
| `data-objeto` | El hueco donde se dibuja un objeto 3D, y cuál. |
| `data-aparece` | Entra dentro de la línea de tiempo de la portada. |
| `data-cursor-label` | El cursor se vuelve disco con esa etiqueta. |

## El capítulo narrado

**Proceso.** Una sola línea de tiempo en pausa, anclada (`pin`) durante
`innerHeight * 3`:

- **Fases** (segundos): `F = [0, 2.4, 4.8, 7.2, 9.8]`, con `FIN = 12`.
- Los bloques del plano se dibujan con `clip-path` de izquierda a derecha.
- El sitio publicado entra con un `clip-path` mientras un barrido de luz cruza el lienzo.
- La barra de direcciones se escribe letra a letra con `urlEn(t)`.
- **Reversible**: `marcarFase(t)` lee el tiempo de la línea; nunca hay disparos de una
  sola vía. Si agregas algo, hazlo igual.

Para cambiar el ritmo mueve `F` y `FIN`; para que dure más o menos scroll, cambia el `3`.

## Probar con movimiento reducido

Windows: **Configuración › Accesibilidad › Efectos visuales › Efectos de animación**.
Chrome DevTools: `Ctrl+Shift+P` → `Emulate CSS prefers-reduced-motion: reduce`.
