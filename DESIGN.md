---
name: DukeNet
description: Custom websites for Colombian businesses, led by a 3D steel-blue core and four full-screen service chapters.
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
    fontWeight: 700
    letterSpacing: "-0.055em"
  hero:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 5.8rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.05em"
  cap:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 4.8rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  d3:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  d4:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3rem)"
    fontWeight: 700
    letterSpacing: "-0.035em"
  d5:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.6rem)"
    fontWeight: 700
  d6:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 2.1rem)"
    fontWeight: 700
  t0:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2vw, 1.9rem)"
    fontWeight: 700
  t1:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)"
    fontWeight: 700
  t2:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)"
    fontWeight: 700
  logo:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.32rem, 2.1vw, 1.72rem)"
    fontWeight: 700
    letterSpacing: "-0.045em"
  lead:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.02rem, 1.2vw, 1.3rem)"
    lineHeight: 1.55
  cuerpo:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(15.5px, 1vw, 17px)"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "0.86rem"
  dato:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.72rem"
    letterSpacing: "0.14em"
    textTransform: uppercase
  micro:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.62rem"
    letterSpacing: "0.18em"
    textTransform: uppercase
  nano:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.5rem"
rounded:
  xs: "4px"
  sm: "8px"
  md: "14px"
  pantalla: "16px"
  dispositivo: "22px"
  pill: "999px"
  bloque: "0px"
spacing:
  borde: "clamp(18px, 3.4vw, 64px)"
  max: "1520px"
  celda: "92px"
  capitulo: "100svh"
components:
  boton:
    backgroundColor: transparent
    textColor: "{colors.papel}"
    border: "1px solid papel 16%"
    rounded: "{rounded.pill}"
    height: "50px"
  boton-azul:
    backgroundColor: transparent
    textColor: "{colors.azul-200}"
    border: "1px solid {colors.azul}"
    rounded: "{rounded.pill}"
  caja:
    backgroundColor: "tinta-2 92%"
    border: "1px solid papel 9%"
    rounded: "{rounded.bloque}"
  ventana:
    backgroundColor: "{colors.tinta-2}"
    border: "1px solid papel 9%"
    rounded: "{rounded.sm}"
  pildora:
    backgroundColor: transparent
    textColor: "{colors.azul-200}"
    border: "1px solid azul-300 45%"
    rounded: "{rounded.pill}"
  nucleo:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.azul-300}"
---

# Design System: DukeNet

## Overview

**Creative North Star: "El núcleo arriba, un objeto por servicio"**

La página es un espacio oscuro con **objetos 3D de verdad**, metal azul acero con luz y
reflejo. Arriba vive **el núcleo de la marca** —una esfera facetada, su jaula de alambre,
dos aros finos y los cuatro cuadros del logotipo girando alrededor—, y se queda ahí: se
va con la portada al bajar, no persigue al lector.

Lo que brilla son los **servicios**: cada uno ocupa su propia pantalla completa y tiene
**su propio objeto, que no ilustra el servicio sino que lo actúa** —el catálogo se
apila, la página se abre en capas, la campaña converge en un punto encendido y el panel
respira como una onda—, con el texto al otro lado y alternando. El trabajo entregado de los
clientes no compite con ellos: vive solo en «Trabajos realizados», como prueba.

Detrás del 3D sigue el **plano técnico**: rejilla de hilos azules fija al viewport, dos
ejes verticales marcando la columna de contenido, viñeta radial que oscurece los bordes,
y micro-etiquetas monoespaciadas en todo lo que es dato.

El azul acero es el único tono: es el metal del objeto, el acento del texto y la señal
de lo accionable. El blanco puro aparece solo dentro de la pantalla de un dispositivo.

Reemplazado en octubre de 2026: la obra del cliente como protagonista de la portada, y
antes de eso los bloques isométricos. La ilustración plana se cambió por geometría real
con luz, material y reflejo.

**Características:**
- Objetos 3D en WebGL (Three.js) anclados a un hueco del HTML, uno por capítulo.
- Un capítulo a pantalla completa por servicio, con cifra de marca de agua al fondo.
- Encabezado mínimo: logotipo centrado y botón de menú; el menú ocupa la pantalla.
- Plano fijo: rejilla de 92px, ejes de columna y viñeta radial.
- Cajas de hilo (`.caja`) opacas, con muescas azules en dos esquinas.
- Cursor propio: anillo con retraso, punto pegado, disco con etiqueta sobre una obra.

## Colors

- **Azul** (`--azul` #5980a6) y su rampa 100–900: único tono. Es el material del núcleo
  (metalness 1, roughness 0.17), el acento del texto y la señal de lo vivo.
- **Tinta** #08090a (fondo), tinta-2/3/4 para cajas, barras de ventana y bloques.
- **Papel** #f2f2f3 para el texto; mezclas de 58–72% para texto secundario (por debajo
  de 58% sobre este negro ya no se cumple el contraste mínimo).
- **Blanco puro** solo en la pantalla de un dispositivo y en un cuadro de la marca;
  **negro puro** solo en sombras; `--error` solo en validación de formulario.
- **Líneas**: `--linea` (papel 9%), `--linea-fuerte` (16%) y `--rejilla` (azul-300 7%).

## Typography

Overpass Variable para todo, Overpass Mono para los datos: etiquetas, números, dominios,
estados y entregables. La escala vive en tokens (`--fs-nano` … `--fs-marca`) y ningún
componente inventa medidas. `--fs-logo` existe solo para el logotipo del encabezado;
`--fs-nano` (0.5rem) solo para etiquetas **dentro** de una maqueta dibujada.

## Components

### Objetos 3D (`<Nucleo />` + `src/scripts/tres.ts`)
Un solo lienzo WebGL fijo, decorativo por completo. Cada objeto se dibuja **donde esté su
hueco en el HTML**: un `<div data-objeto="…">` vacío con su propia altura. El motor lee
ese rectángulo cuadro a cuadro y coloca y escala la pieza ahí, así que el objeto se va
con la página al bajar y nunca se monta sobre el texto. Se carga aparte y solo con
JavaScript, sin ahorro de datos y con memoria suficiente; si falta algo, el hueco
desaparece y queda el halo en CSS.

Cada objeto recibe además un `foco` de 0 a 1 según lo centrado que esté su capítulo en
la pantalla: con él se arma al mirarlo y se suelta al dejarlo. Lo que tiene cara se mece
en lugar de dar vueltas enteras; solo el núcleo gira sin parar.

### Capítulo de servicio (`.serv`)
Pantalla completa: a un lado el texto (orden, nombre, claim en mono, descripción,
píldoras de lo que incluye y el botón de cotizar), al otro el hueco del objeto con su
rótulo debajo. La cifra grande del fondo es decoración (`::before`), nunca texto del
DOM.

### Ventana (`.ventana`)
Navegador dibujado: barra con tres puntos, dominio centrado y estado «en línea». Dentro
va el trabajo real del cliente (capturas) o la maqueta que se construye en el proceso.

### Caja (`.caja`)
Marco de hilo con fondo opaco (tinta-2 al 92%) y dos muescas azules en esquinas
opuestas. Es una placa: el 3D pasa por detrás, nunca por encima del texto.

### Etiqueta (`.tag`) y lectura (`.lectura`)
La etiqueta abre cada capítulo con un cuadro azul, el nombre y una regla que se extiende.
La lectura son columnas de micro-texto mono con un dato en azul.

### Botón (`.btn`)
Píldora con contorno; al pasar, el relleno sube desde abajo y el texto se invierte. La
variante azul es la acción principal.

## Motion

GSAP + ScrollTrigger + SplitText, Lenis (lerp 0.085) enganchado al reloj de GSAP: un
solo bucle por cuadro para el scroll, las líneas de tiempo y el dibujo 3D.

- **Objetos**: el scroll los arma. Cada uno recibe un `foco` de 0 a 1 según lo centrado
  que esté su capítulo: los bloques se apilan, las capas se abren, las esquirlas
  convergen y la onda sube. Encima, giro o vaivén lento y una inclinación hacia el
  puntero. Solo se dibuja lo que está a la vista.
- **Cursor**: anillo con retraso de 0.42s, punto a 0.08s. Crece sobre lo tocable y se
  vuelve disco con la etiqueta «Ver sitio» sobre una obra. Solo con puntero fino.
- **Entrada**: títulos por líneas desde máscara (`[data-parte]`), bloques que suben
  (`[data-sube]`), imágenes que se revelan con máscara ascendente (`[data-revela]`).
- **Trabajos**: las capturas reales se recorren solas dentro de su ventana, 26s de ida
  y vuelta.
- **Proceso**: un pin de 3 pantallas donde una sola línea de tiempo levanta el plano,
  dibuja los bloques, los rellena, barre para revelar el sitio publicado mientras se
  escribe el dominio, y sube el panel de reporte. Reversible: la fase se calcula del
  tiempo de la línea.
- **Reducido**: los objetos se ven armados pero quietos; sin cursor, sin pin, sin
  recorrido automático, y las líneas se reproducen una vez. **Sin JS**: todo se ve terminado y los capítulos se recogen a una
  sola columna.

## Do's and Don'ts

### Do
- **Do** darle a cada capítulo su propio objeto, y dejarlo anclado a su hueco.
- **Do** darle a cada servicio su pantalla completa; son lo que se vende.
- **Do** mantener el plano visible: la rejilla y los ejes son la identidad.
- **Do** escribir los datos en mono y en mayúsculas, con tracking amplio.
- **Do** apagar el 3D sin drama: la página tiene que leerse igual sin él.

### Don't
- **Don't** poner el trabajo de un cliente como protagonista fuera de «Trabajos».
- **Don't** usar geometría plana o falso 3D: si hay volumen, es WebGL con material real.
- **Don't** dejar que el objeto pase por encima del texto; las cajas son placas opacas.
- **Don't** bajar el texto secundario de 58% de papel sobre el fondo.
- **Don't** añadir un segundo tono ni rellenar las cajas con degradados.
