---
name: DukeNet
description: Custom websites for Colombian businesses, shown as live client work on a technical plan.
colors:
  azul: "#5980a6"
  azul-100: "#eef6ff"
  azul-200: "#d6ebff"
  azul-300: "#b5d9fd"
  azul-400: "#94bce3"
  azul-500: "#749dc4"
  azul-700: "#416180"
  azul-800: "#2c455d"
  azul-900: "#1d2d3d"
  tinta: "#08090a"
  tinta-2: "#0d0f11"
  tinta-3: "#141719"
  tinta-4: "#1b1f22"
  papel: "#f2f2f3"
  papel-2: "#e7e7ea"
  gris-300: "#d4d4d7"
  gris-400: "#b7b7ba"
  gris-500: "#98989b"
  gris-600: "#7a7a7d"
  gris-700: "#5d5d60"
  gris-800: "#424244"
  blanco: "#ffffff"
  negro: "#000000"
  error: "#8a1f1f"
typography:
  marca:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 14.5vw, 14rem)"
    fontWeight: 800
    letterSpacing: "-0.05em"
  hero:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.9vw, 6.2rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.045em"
  capitulo:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5.2vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  d3:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 4.2rem)"
    fontWeight: 800
    letterSpacing: "-0.04em"
  d4:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3rem)"
    fontWeight: 800
    letterSpacing: "-0.04em"
  d5:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.6rem)"
    fontWeight: 800
    letterSpacing: "-0.035em"
  d6:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 2.1rem)"
    fontWeight: 800
    letterSpacing: "-0.04em"
  t0:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2vw, 1.9rem)"
    fontWeight: 800
  t1:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)"
    fontWeight: 750
  t2:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)"
    fontWeight: 750
  micro:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.62rem"
  nano:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.5rem"
  cuerpo:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(16px, 1.02vw, 18px)"
    fontWeight: 400
    lineHeight: 1.55
  lead:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.25vw, 1.35rem)"
    lineHeight: 1.5
  dato:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.72rem"
    letterSpacing: "0.2em"
    textTransform: uppercase
rounded:
  xs: "4px"
  sm: "8px"
  md: "14px"
  pantalla: "16px"
  dispositivo: "22px"
  pill: "999px"
  bloque: "0px"
spacing:
  borde: "clamp(20px, 4vw, 72px)"
  max: "1440px"
  capitulo: "100svh"
components:
  boton:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
    height: "54px"
  boton-azul:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.tinta}"
  boton-linea:
    backgroundColor: transparent
    textColor: "{colors.papel}"
    border: "1px solid papel 34%"
  tarjeta:
    backgroundColor: "{colors.tinta-2}"
    border: "1px solid papel 12%"
    rounded: "{rounded.tarjeta}"
  hoja:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.tarjeta}"
  cara-superior:
    backgroundColor: "{colors.azul-400}"
  cara-izquierda:
    backgroundColor: "{colors.azul-700}"
  cara-derecha:
    backgroundColor: "{colors.azul-800}"
---

# Design System: DukeNet

## Overview

**Creative North Star: "El plano y la obra viva"**

DukeNet vende sitios que funcionan, así que la página muestra sitios que funcionan.
Todo ocurre sobre un **plano técnico**: fondo casi negro, rejilla de hilos azules fija
al viewport, dos ejes verticales marcando la columna de contenido, marcos de línea fina
con muescas en las esquinas y micro-etiquetas monoespaciadas pegadas a los bordes, como
la lectura de un instrumento. Sobre ese plano flota una sola cosa por capítulo: **el
trabajo real del cliente**, dentro de un navegador dibujado, moviéndose solo.

El azul acero es el único tono: marca lo vivo, lo medido y lo accionable. El blanco puro
aparece únicamente dentro de las pantallas de los dispositivos, que es donde de verdad
vive el sitio del cliente.

Reemplazado en octubre de 2026: los bloques isométricos. La ilustración abstracta se
cambió por la obra real; la prueba del estudio son dos sitios en producción, no un
dibujo.

**Características:**
- Plano fijo: rejilla de 92px, ejes de columna y viñeta radial que oscurece los bordes.
- Micro-tipografía mono en mayúsculas con tracking amplio para todo lo que es dato.
- Cajas de hilo (`.caja`) con muescas azules en dos esquinas.
- Botones de píldora con contorno y relleno que sube desde abajo.
- Cursor propio: anillo que persigue con retraso, punto que va pegado, y que se
  convierte en disco con etiqueta sobre una obra.
- Ventana de navegador (`.ventana`) como contenedor canónico del trabajo real.

## Colors

- **Azul** (`--azul` #5980a6) y su rampa 100–900: único tono. 300 para acentos, datos y
  lo vivo; 700/800 para barras y superficies; 900 para profundidad.
- **Tinta** #08090a (fondo), tinta-2/3/4 para cajas, barras de ventana y bloques.
- **Papel** #f2f2f3 para el texto; mezclas de 58–70% para texto secundario (por debajo
  de 58% sobre este negro ya no se cumple el contraste mínimo).
- **Blanco puro** solo en la pantalla de un dispositivo; **negro puro** solo en sombras;
  `--error` solo en validación de formulario.
- **Líneas**: `--linea` (papel 9%), `--linea-fuerte` (16%) y `--rejilla` (azul-300 7%).

## Typography

Overpass Variable para todo, Overpass Mono para los datos: etiquetas, números, dominios,
estados y entregables. La escala vive en tokens (`--fs-nano` … `--fs-marca`) y ningún
componente inventa medidas. `--fs-nano` (0.5rem) existe solo para las etiquetas que van
**dentro** de una maqueta dibujada, nunca para texto de página.

## Components

### Ventana (`.ventana`)
Navegador dibujado: barra con tres puntos, dominio centrado y estado «en línea» a la
derecha; dentro, la captura real del cliente. Es el único recipiente del trabajo y se
usa igual en portada, proceso, obras y 404.

### Caja (`.caja`)
Marco de hilo con fondo apenas más claro que el plano y dos muescas azules en las
esquinas opuestas. Envuelve tarjetas, tableros y el formulario.

### Etiqueta (`.tag`) y lectura (`.lectura`)
La etiqueta abre cada capítulo: cuadro azul, número, nombre y una regla que se extiende.
La lectura son columnas de micro-texto mono con un dato en azul, como el índice lateral
de un instrumento.

### Botón (`.btn`)
Píldora con contorno; al pasar, el relleno sube desde abajo y el texto se invierte. La
variante azul es la acción principal.

### Tablero (`.tablero`)
Panel de datos dentro de una caja: cifras que cuentan, barras que suben y embudo. Siempre
rotulado **Ejemplo** mientras las cifras sean ilustrativas.

## Motion

GSAP + ScrollTrigger + SplitText, Lenis (lerp 0.085), easing `power3.out`.

- **Cursor**: anillo con retraso de 0.42s, punto a 0.08s. Crece sobre lo tocable y se
  vuelve disco con la etiqueta «Ver sitio» sobre una obra. Solo con puntero fino.
- **Entrada**: títulos por líneas desde máscara (`[data-parte]`), bloques que suben
  (`[data-sube]`), imágenes que se revelan con máscara ascendente (`[data-revela]`).
- **Obra viva**: las capturas reales se recorren solas dentro de su ventana, en bucle
  lento de 26s, de ida y vuelta.
- **Proceso**: un pin de 3 pantallas donde una sola línea de tiempo levanta el plano,
  dibuja los bloques, los rellena, barre la captura real y sube el panel de reporte.
  Reversible: la fase se calcula del tiempo de la línea.
- **Reducido**: sin cursor, sin pin, sin recorrido automático; las líneas se reproducen
  una vez. **Sin JS**: todo se ve terminado, incluida la obra con su captura.

## Do's and Don'ts

### Do
- **Do** mostrar trabajo real en una `.ventana` antes que cualquier ilustración.
- **Do** mantener el plano visible: la rejilla y los ejes son la identidad.
- **Do** escribir los datos en mono y en mayúsculas, con tracking amplio.
- **Do** dejar que el azul señale lo vivo, lo medido y lo accionable.

### Don't
- **Don't** volver a la ilustración abstracta (bloques, isométricos, formas sueltas).
- **Don't** bajar el texto secundario de 58% de papel sobre el fondo.
- **Don't** añadir un segundo tono ni rellenar las cajas con degradados.
- **Don't** animar nada que no explique algo: el movimiento aquí narra.
