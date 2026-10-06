---
name: DukeNet
description: Custom websites for Colombian businesses, told as an isometric build that assembles while you scroll.
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
  tinta: "#0c0d0e"
  tinta-2: "#141618"
  tinta-3: "#1d2023"
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

**Creative North Star: "La maqueta"**

DukeNet builds the thing that makes a business sell, so the whole page is that thing
being built. Every scene is one isometric model —a platform, blocks stacking, a site
taking shape— drawn as SVG polygons from a single 2:1 projection and assembled while
you scroll. The ground is near-black, the models are steel blue lit from one side, and
the only white surfaces are the ones you are meant to act on: the buttons and the quote
form. Nothing is decorated: if a shape is on screen it is a piece of the build.

The page reads as **six chapters, one screen each**, numbered like a plan: 01 Por qué,
02 Qué hacemos, 03 Cómo, 04 Obras, 05 Datos, 06 Hablemos. Each chapter states one idea
and shows one model. The third is the long one: the site assembles in five phases while
the screen stays still.

Replaced in October 2026: the construction-site costume (FR-0x plates, barrier stripes,
bolted sign panels, ficha técnica tables). The palette survived the change; the metaphor
did not.

**Key Characteristics:**
- One isometric projection everywhere, from `src/lib/iso.ts`: unit cubes twice as wide
  as tall, three face values (top azul-400, left azul-700, right azul-800).
- Chapters are full screens with a mono number-and-rule eyebrow.
- Type does the shouting: 800 weight, tight tracking, nothing above it.
- Buttons are pills; cards are 14px; isometric blocks are hard-edged.
- Dark ground, blue models, white only for actions and the form.
- Real client screenshots are projected onto the model's top face with the same
  isometric matrix, so the work shows up inside the drawing.

## Colors

Three materials: ink ground, steel-blue model, white paper for action.

### Primary
- **Azul** (`--azul`, #5980a6) with its 100–900 ramp. 300 for accents, legends and the
  wordmark's second half; 400/700/800 are the three faces of every isometric block;
  900 for deep shadow mixes.

### Neutral
- **Tinta** (#0c0d0e): the page ground. tinta-2 for cards, tinta-3 for device frames.
- **Papel** (#f2f2f3): buttons, the quote form, and text on the dark ground.
- **Grises** 300–800: form rules, placeholders and the grey faces of unbuilt blocks.
- **Blanco puro** (`--blanco`, #ffffff): only the screen of a drawn device.
- **Negro puro** (`--negro`, #000000): only as the colour of a shadow, always mixed with
  transparency.
- **Error** (`--error`, #8a1f1f): the only hue outside the blue ramp. It exists so a
  failed field on white paper reads as an error and nothing else; never use it for
  decoration or for a second accent.

## Typography

Overpass Variable for everything, Overpass Mono for data: numbers, labels, eyebrows,
domains and deliverables. Every size in the page is a token in `global.css`; nothing
invents its own scale.

### Scale as built

| Token | Valor | Dónde |
|---|---|---|
| `--fs-marca` | clamp(3.2rem, 14.5vw, 14rem) | la marca del pie |
| `--fs-hero` | clamp(2.5rem, 5.9vw, 6.2rem) | titular de portada y de la 404 |
| `--fs-cap` | clamp(2.2rem, 5.2vw, 5.4rem) | `.titulo`, el título de cada capítulo |
| `--fs-d3` | clamp(2rem, 4.4vw, 4.2rem) | títulos de las páginas legales |
| `--fs-d4` | clamp(1.8rem, 3vw, 3rem) | nombre de obra, cupo del mes, menú móvil |
| `--fs-d5` | clamp(1.6rem, 2.6vw, 2.6rem) | nombre de fase, teléfonos de contacto |
| `--fs-d6` | clamp(1.4rem, 2.2vw, 2.1rem) | cifras del tablero |
| `--fs-t0` | clamp(1.3rem, 2vw, 1.9rem) | encabezados de las políticas |
| `--fs-t1` | clamp(1.15rem, 1.6vw, 1.5rem) | títulos de tarjeta y principios |
| `--fs-t2` | clamp(1.05rem, 1.4vw, 1.2rem) | subtítulos de las políticas |
| `--fs-lead` | clamp(1.05rem, 1.25vw, 1.35rem) | párrafos de entrada |
| `--fs-base` / `--fs-small` / `--fs-mini` / `--fs-micro` | 1 / 0.86 / 0.72 / 0.62rem | cuerpo, apoyo, datos mono, etiquetas de gráfica |

Las dos medidas dentro del SVG del capítulo 03 (11 y 15 unidades) no son tipografía de
página: son unidades de dibujo que escalan con el `viewBox`, y por eso no salen de la
escala.

## Layout

- `.marco`: max 1440px with a `clamp(20px, 4vw, 72px)` gutter.
- `.cap`: one chapter, `min-height: 100svh`, content vertically centred.
- Two-column chapters collapse to one at 1000px (860px for the Obras header).

## Components

### Botón (`.btn`)
Pill, 54px tall, three skins: papel (default), azul (primary action) and línea
(outlined, on dark). Lifts 2px on hover and the trailing arrow steps up-right.

### Capítulo (`.cap` + `.cap__num`)
Full-screen section with a mono eyebrow —`03 · Cómo`— followed by a hairline rule.

### Escena isométrica (`.iso`)
An SVG whose polygons come from `caja()`, `losa()` and `rejilla()` in `src/lib/iso.ts`.
Classes `.top`, `.izq`, `.der` carry the three face values; `--papel` and `--gris`
variants give white and unbuilt blocks. Never hand-write points: the helper keeps every
model on the same projection.

### Tarjeta de datos (`.tablero`)
Dark card, 14px radius, hairline border: KPIs that count up, an isometric bar row and a
funnel. Always labelled **Ejemplo** while the figures are illustrative.

### Hoja (`.hoja`)
The quote form: solid white, 14px radius, the only paper surface in the page. Fields are
underlines, options are pills, and the selected option inverts to ink.

### Obra entregada (`.caso`)
A browser chrome bar plus the real screenshot, with the mobile capture overlapping its
corner. On hover the screenshot scrolls itself. The ficha underneath is three mono rows.

## Motion

GSAP with ScrollTrigger and SplitText, Lenis smooth scroll (lerp 0.1), easing
`power3.out` / `power2.inOut`, durations 0.5–1.4s.

- **Entrada**: lines unmask upward (`[data-parte]`), blocks rise and settle
  (`[data-sube]`), the cover's model assembles piece by piece with a back ease.
- **Scrollytelling**: chapter 01 is scrubbed —eight slabs sink and dim while the ninth
  rises and builds— and chapter 03 pins for 3.2 screens while one timeline raises the
  base, draws the plan, fills the volumes, wipes the real screenshot in and grows the
  data bars. Both read their state from the timeline's time, so scrolling back undoes
  them exactly.
- **Reposo**: the cover model floats on a 3.6s sine, its card on 4.4s.
- **Reduced motion**: timelines play once instead of pinning, travel becomes a fade,
  and the float stops. Nothing is left invisible.
- **Without JS**: everything is drawn in its finished state, including the built site
  with its screenshot; the five phases read as a list.

## Do's and Don'ts

### Do
- **Do** build every illustration from `src/lib/iso.ts` so the whole page shares one
  vanishing geometry.
- **Do** give each chapter one idea, one model and one number.
- **Do** keep white for actions: buttons, the form, and the client's own screenshots.
- **Do** label example data as example, every time it appears.
- **Do** let text carry the weight: 800, tight, large, on a plain ground.

### Don't
- **Don't** reintroduce costume elements (hazard stripes, bolts, plates) — the page is a
  model of the work, not a theme park of it.
- **Don't** add a second hue: the only colour is the blue ramp, with `--error` reserved
  for form validation and nothing else.
- **Don't** write a literal size, radius or colour in a component: if the system lacks
  the step you need, add the token here first.
- **Don't** round the isometric blocks or soften their faces with gradients.
- **Don't** animate anything that does not explain something; motion here is narration.
