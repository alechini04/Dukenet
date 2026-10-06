# Mantenimiento

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # compila a dist/
npm run preview  # sirve dist/ como lo vería un visitante
```

## Dependencias

| Paquete | Versión | Para qué |
|---|---|---|
| `astro` | 7.3 | El framework: compila a HTML estático. |
| `@astrojs/sitemap` | 3.7 | Genera `sitemap-index.xml` en cada compilación. |
| `gsap` | 3.15 | Animaciones (ScrollTrigger, SplitText). |
| `lenis` | 1.3 | Desplazamiento suave. |
| `@fontsource-variable/overpass` y `overpass-mono` | 5.3 | Las dos tipografías, servidas desde el propio sitio (no dependen de Google Fonts). |

Antes de subir una versión mayor de Astro o GSAP, compila y revisa el
cronograma: es lo que más depende de ScrollTrigger.

## Trampas conocidas

Cosas que ya nos mordieron una vez y conviene no repetir.

**El CSS de un componente no llega a sus hijos.** Astro le pone un ámbito al
CSS de cada `.astro`. Para darle estilo a un icono o a algo que viene de otro
componente hay que usar `:global(...)`. Si un icono aparece enorme, casi
siempre es esto.

**`backdrop-filter` recorta lo que esté fijo adentro.** El encabezado lleva
desenfoque, y eso lo convierte en el marco de referencia de cualquier elemento
`position: fixed` que esté dentro. Por eso el menú de celular vive fuera del
`<header>`. Si lo mueves adentro, se recorta a 67 px de alto.

**El movimiento reducido es más común de lo que parece.** Windows trae los
efectos de animación apagados en muchos equipos, así que hay visitantes reales
viendo la versión sin anclaje ni paralaje. Esa versión también tiene que verse
terminada: revísala cuando cambies algo grande
(ver [animaciones.md](animaciones.md)).

**Los anclajes y el scroll suave.** Los enlaces `#capitulo` los maneja el
script, que compensa los 74 px del encabezado. El valor está en la constante
`HEADER` de `app.ts`: si cambia la altura de la barra, cámbialo ahí también.

**Las escenas isométricas.** Nunca escribas puntos a mano: todas salen de
`src/lib/iso.ts`. Para que una fila de bloques se vea horizontal en pantalla hay
que moverse lo mismo en +x y en −y (si solo creces en x, la fila baja en
diagonal).

**Las imágenes mueven las medidas.** ScrollTrigger calcula posiciones al
cargar; por eso se llama `ScrollTrigger.refresh()` cuando termina cada imagen y
al cambiar de pestaña en Obras. Si insertas contenido nuevo por JavaScript,
llámalo tú.

**El servidor de desarrollo y el puerto 4321.** Si `npm run dev` no arranca,
casi siempre hay otro proceso ocupando el puerto. Ciérralo o usa
`npm run dev -- --port 4322`.

## Antes de dar por bueno un cambio

1. `npm run build` sin errores.
2. Míralo en cuatro anchos: escritorio (1440), tableta/portátil (1100), celular
   (390) y celular pequeño (320). La mayoría de los problemas salen entre 860 y
   1100 px, donde cambian las rejillas, y por debajo de 430 px, donde los
   botones y las rejillas de dos columnas dejan de caber.
3. Consola del navegador sin errores.
4. Recorre la página entera de arriba abajo **y de vuelta hacia arriba**: el
   cronograma tiene que verse bien en los dos sentidos.
5. Si tocaste algo con movimiento, míralo también con movimiento reducido.
6. Si tocaste el formulario, el encabezado o el cronograma, míralo además con
   JavaScript desactivado: esas tres piezas tienen una versión propia para ese
   caso (ver [animaciones.md](animaciones.md)).

## Estado de accesibilidad

Revisado sobre la página compilada, en escritorio y en celular:

- Un solo `<h1>`, y los títulos bajan en orden sin saltarse niveles.
- Todas las imágenes con texto alternativo; las decorativas, marcadas como
  tales.
- Formulario con etiquetas asociadas, `autocomplete`, errores anunciados y foco
  que va al primer campo con problema.
- Enlaces y botones con nombre accesible; ningún enlace vacío ni ancla rota.
- Contraste suficiente en todos los textos.
- Todas las zonas para tocar llegan a 24 px (WCAG 2.5.8).
- Ningún ancho entre 320 y 1920 px produce desplazamiento horizontal ni recorta
  contenido. Si agregas un bloque, evita que un hijo de rejilla quede con
  `1fr` a secas: usa `minmax(0, 1fr)`, o el contenido más ancho impondrá el
  tamaño mínimo de toda la página.
- Enlace para saltar al contenido, visible al tabular.
- Las pestañas de Obras se manejan con flechas, `Inicio` y `Fin`; el menú de
  celular se cierra con `Esc`.

Si agregas una sección, eso es lo que hay que sostener.
