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
  maqueta del capítulo 02 aparece **terminada**, con la captura real puesta.
- **`rm`**: movimiento reducido. Se va el cursor propio, el pin, el recorrido automático
  de las capturas y los desplazamientos; las líneas se reproducen una vez.
- **`puntero-fino`**: solo con mouse. Enciende el cursor propio y esconde el del sistema.

## El cursor

Dos piezas: un **anillo** que persigue al puntero con 0,42 s de retraso y un **punto**
que va casi pegado (0,08 s). El anillo crece sobre cualquier cosa tocable y se convierte
en un **disco azul con la etiqueta «Ver sitio»** sobre una obra (`data-cursor-label`).
Si agregas un bloque donde el cursor deba decir algo, pon ese atributo y listo.

## Gramática común

| Marca | Qué hace |
|---|---|
| `data-parte` | El título se parte en líneas y sube desde una máscara. |
| `data-sube` | El bloque entra una vez, desde abajo, escalonado. |
| `data-revela` | La imagen se descubre con una máscara que sube, y la foto se asienta desde 1.18. |
| `data-tira` | La captura real se recorre sola dentro de su ventana, en bucle de 26 s. |
| `data-aparece` | Entra dentro de la línea de tiempo de la portada. |
| `data-cursor-label` | El cursor se vuelve disco con esa etiqueta. |

## El capítulo narrado

**02 · Proceso.** Una sola línea de tiempo en pausa, anclada (`pin`) durante
`innerHeight * 3`:

- **Fases** (segundos): `F = [0, 2.4, 4.8, 7.2, 9.8]`, con `FIN = 12`.
- Los bloques del plano se dibujan con `clip-path` de izquierda a derecha.
- La captura real entra con un `clip-path` mientras un barrido de luz cruza el lienzo.
- La barra de direcciones se escribe letra a letra con `urlEn(t)`.
- **Reversible**: `marcarFase(t)` lee el tiempo de la línea; nunca hay disparos de una
  sola vía. Si agregas algo, hazlo igual.

Para cambiar el ritmo mueve `F` y `FIN`; para que dure más o menos scroll, cambia el `3`.

## Probar con movimiento reducido

Windows: **Configuración › Accesibilidad › Efectos visuales › Efectos de animación**.
Chrome DevTools: `Ctrl+Shift+P` → `Emulate CSS prefers-reduced-motion: reduce`.
