---
name: DukeNet
description: Custom websites for Colombian businesses, presented as a licensed construction project.
colors:
  sign: "#5980a6"
  sign-100: "#eef6ff"
  sign-200: "#d6ebff"
  sign-300: "#b5d9fd"
  sign-400: "#94bce3"
  sign-500: "#749dc4"
  sign-700: "#416180"
  sign-800: "#2c455d"
  sign-900: "#1d2d3d"
  ink: "#0c0d0e"
  ink-2: "#141618"
  ink-3: "#1d2023"
  paper: "#f2f2f3"
  paper-2: "#e7e7ea"
  concrete-300: "#d4d4d7"
  concrete-400: "#b7b7ba"
  concrete-500: "#98989b"
  concrete-600: "#7a7a7d"
  concrete-700: "#5d5d60"
  concrete-800: "#424244"
typography:
  display:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(3rem, min(8.8vw, 15.5svh), 9.4rem)"
    fontWeight: 850
    lineHeight: 0.86
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.8vw, 7.2rem)"
    fontWeight: 850
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3.4rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  body:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(16px, 1.05vw, 18px)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  button:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "0.04em"
  label:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
    fontFeature: "tnum"
rounded:
  plate: "0px"
  sign: "clamp(12px, 1.4vw, 22px)"
spacing:
  gutter: "clamp(16px, 3.2vw, 44px)"
  max: "1520px"
  section: "clamp(88px, 11vw, 170px)"
  sign-inset: "clamp(8px, 0.8vw, 12px)"
components:
  plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.plate}"
    padding: "0 1.35em 0 1.4em"
    height: "56px"
  plate-hover:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.ink}"
  plate-sign:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
  plate-sign-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  plate-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
  plate-paper-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  plate-sm:
    typography: "{typography.button}"
    padding: "0 1em"
    height: "42px"
  sign-panel:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sign}"
    padding: "clamp(40px, 4.4vw, 76px) clamp(26px, 4.4vw, 76px)"
  ficha:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "18px 20px 20px"
  frente-plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "5px 10px 4px 5px"
  selector-pending:
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "16px 18px 16px 14px"
  selector-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.plate}"
  field:
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "10px 0"
---

# Design System: DukeNet

## Overview

**Creative North Star: "Valla de obra"**

Every DukeNet surface is a municipal construction-site license sign and the paperwork that travels with it. The sign is a steel-blue informative road-sign panel with a reflective white inner border and four bolts; around it lies the night-site ground in near-black ink, with off-white plates carrying actions, and concrete greys for secondary text and rules. Black-and-white barrier stripes mark the threshold between one frente (work front) and the next, each carrying its FR-0x plate code. Data is laid out as a ficha técnica: monospace terms, heavy values, hairline rules.

The world is dense and declarative. Headlines are highway-sign lettering at heavy weights, uppercase and tightly set; body copy is plain Overpass at a comfortable measure. Photography is never shown raw; it is duotoned into sign blue. State is shown the way a site schedule shows it: dashed is pending or not selected, solid is done or selected. Motion builds things: the sign rises, lines are unmasked, a promise is struck through, and a client site is built in front of you as you scroll. Copy is Spanish (es-CO), direct, in tuteo.

Rejected: the dark-agency hero with condensed giant type and moody unprocessed photos, and any yellow or orange "construction" cliché. Construction is carried by blue sign, black ink, white plates and stripes only.

**Key Characteristics:**
- Steel-blue sign panels drench whole regions; ink ground everywhere else.
- Sign panels alone are rounded; every other surface is square.
- Buttons are plates with a fill wipe from below on hover.
- Barrier-stripe rails with FR-01…FR-07 plates as section thresholds.
- Ficha técnica tables with Overpass Mono terms.
- Dashed = pending / not selected; solid = done / selected.
- Duotone photos multiplied in sign blue.

## Colors

A three-material palette: blue sign panel, black ink ground, reflective white plate, with concrete greys doing all secondary work.

### Primary
- **Informative Sign Blue** (sign): the valla panels (hero, closing contact sign), the plate-sign button, the fill of hover wipes, progress bars and phase tracks, selected letter badges, estado tags and frente code chips. Its 100–900 ramp is the only tint family: 300/400 for accents and legends on ink, 700 for labels and status text on paper, 800 behind duotone photos, 900 for the pinned schedule ground and tinted shadows.

### Neutral
- **Night-Site Ink** (ink): page ground, sign lettering on blue for the emphasised line, primary plate fill, selected selectors, strike-through bars. ink-2 and ink-3 are only for device-frame depictions.
- **Reflective Plate White** (paper): body text on ink, the sign's inner border, ficha and form sheets, paper plates, light sections (Obras, Panel). paper-2 for browser chrome in mockups.
- **Concrete Greys** (concrete-300 to 800): hairline rules on paper (300), dot/idle borders (400), dashed pending borders (500), secondary text on paper (700, 800).

### Named Rules
**The No Hazard Colours Rule.** Construction is signalled with sign blue, ink, paper and stripes. Yellow and orange never appear.

**The Blue Drench Rule.** Sign blue fills whole regions (a sign, a schedule ground) or small solid chips. It is never a thin decorative gradient or a glow.

**The Ink On Sign Rule.** On sign blue, running text and leads are ink; paper lettering on blue is reserved for display-size headlines, where contrast holds.

## Typography

**Display Font:** Overpass Variable (with Overpass, system-ui)
**Body Font:** Overpass Variable (with Overpass, system-ui)
**Label/Mono Font:** Overpass Mono Variable (with Overpass Mono, ui-monospace)

**Character:** Overpass descends from US highway-sign lettering, so the same family reads as road sign at 850–900 uppercase and as plain, legible text at 400. Overpass Mono is the site-paperwork voice: plate codes, ficha terms, data.

### Hierarchy
- **Display** (850, clamp(3rem, min(8.8vw, 15.5svh), 9.4rem), 0.86, uppercase, -0.035em): the hero valla headline only; sized so the whole sign holds in one desktop viewport. Footer wordmark runs heavier (900) at up to 19rem.
- **Headline** (850, roughly clamp(2.5rem, 5.6–8vw, 6–8.6rem), 0.88, uppercase, -0.035em): section titles, set in two short balanced lines.
- **Title** (800–850, clamp(1.45rem–2rem, 2.2–4.2vw, 2.1–4.4rem), 0.92–1.08, uppercase for object names): service panel names, case names, phase names; principle heads stay sentence case at 800.
- **Body** (400–450, clamp(16px, 1.05vw, 18px), 1.55): paragraphs capped at 42–48ch; leads step up to about 1.35rem at 450 with 800 for emphasis. Ficha values are 650.
- **Button** (750, 1rem, 0.04em, uppercase): plates and nav (nav at 650, 0.92rem, 0.06em).
- **Label** (Mono 500, 0.75rem, 0.08em, uppercase, tabular numerals): plate codes, ficha terms (0.72rem, 0.06em), captions, chart axes. Header labels in ficha heads step to 700.

### Scale reference (as built)
Everything under 1rem comes from six tokens in `global.css`; a new small size means picking the nearest step, not inventing one.

| Token | Size | Used for |
| --- | --- | --- |
| `--fs-micro` | 0.62rem | chart day labels, stage captions, the smallest legends |
| `--fs-mini` | 0.7rem | dashboard block labels, frente codes, KPI terms |
| `--fs-plate` | 0.74rem | `.t-plate`: ficha terms, plate codes, form labels |
| `--fs-small` | 0.85rem | secondary copy, ticker cities, small plates, case links |
| `--fs-note` | 0.92rem | nav items, form status, compact titles |
| `--fs-base` | 1rem | plates, ficha values |

Display and headline sizes stay per component as `clamp()` pairs, because each one is tuned to its own container: hero `clamp(3rem, min(8.8vw, 15.5svh), 9.4rem)`, section headlines `clamp(2.5–2.6rem, 5.8–6.8vw, 6.2–7.2rem)`, object titles `clamp(1.8–2.2rem, 3.2–4.2vw, 3–4.4rem)`, leads `clamp(1.02–1.08rem, 1.2–1.35vw, 1.2–1.35rem)`, footer wordmark `clamp(4rem, 17.5vw, 19rem)`. Inside the Cronograma stage, type is set in the SVG's own 1440×900 units (20–22px), so it scales with the frame.

### Corner reference (as built)
Square is the default (`--radius-plate: 0`). The only non-zero radii, and the one reason each is allowed:

| Value | Where | Why |
| --- | --- | --- |
| `--radius-sign` clamp(12px, 1.4vw, 22px) | hero valla, closing sign | it is a road sign |
| 8–10px | "En línea" stamp, "En obra" sign | small signs, with the same inset border |
| 4px | wordmark NET badge | the sign at wordmark scale |
| 6px / 14–26px / 50% | browser window, phone frame, bolts and dots | depicted physical objects |
| 2px / 6px | focus ring, scrollbar thumb | browser chrome themed from the palette |

### Named Rules
**The Plate Code Rule.** Mono labels name data, objects and frentes (terms, codes, captions, legends). They never sit as eyebrows above section headlines.

**The Tabular Rule.** Every number that moves or is compared (KPIs, codes, phases) uses tabular numerals.

## Layout

Full-width sections in a centred container (max 1520px, fluid gutter clamp(16px, 3.2vw, 44px)). Sections alternate ground: ink (hero ground, Manifiesto, Entregadas, Contacto), paper (Obras, Panel) and sign-900 (Cronograma). Vertical rhythm is generous and fluid, around clamp(88px, 11vw, 170px) per section, with barrier rails (14px) as the only hard thresholds between frentes.

Grids are asymmetric fractions (5/7, 4/7, 8/4, 4/8, 1.1/1) rather than equal columns; the sign panels bleed nearly edge to edge inside a thin ink margin (clamp(12px, 1.6vw, 22px)). The header is a fixed 64px ink strip with a 3px avance progress line under it. Breakpoints collapse two-column grids to one at 960–980px, switch to the mobile menu at 860px, and at 480–560px make plates full-width with the arrow pushed to the end.

## Elevation & Depth

Depth is material, not atmospheric. The ground is flat; objects sitting on a sign or on the ground (ficha sheet, form sheet, dashboard, floating WhatsApp plate, device mockups) cast one long, soft, negatively spread drop shadow tinted toward sign-900 or black, as a sheet clipped to a panel would. Sign panels themselves never cast shadows; their depth comes from the inset reflective border and the bolts.

### Shadow Vocabulary
- **Clipped sheet** (`box-shadow: 0 18px 40px -18px color-mix(in srgb, var(--sign-900) 75%, transparent), 0 2px 0 color-mix(in srgb, var(--sign-900) 30%, transparent)`): a paper sheet lying on a sign.
- **Document on ground** (`box-shadow: 0 50px 90px -50px color-mix(in srgb, var(--sign-800) 90%, transparent)`): the dashboard and form sheet.
- **Floating plate** (`box-shadow: 0 16px 34px -10px color-mix(in srgb, #000 70%, transparent)`): the fixed WhatsApp plate.
- **Bolt** (`box-shadow: 0 1px 1px color-mix(in srgb, var(--ink) 45%, transparent)`): sign fixings only.

### Named Rules
**The Sheets Cast, Signs Don't Rule.** Only loose objects (sheets, mockups, the floating plate) cast shadows; signs, plates in flow and sections stay flat.

## Shapes

Two corners only. Sign panels carry a road-sign radius (clamp(12px, 1.4vw, 22px)) with a paper inner border inset clamp(8px, 0.8vw, 12px), clamp(3px, 0.32vw, 5px) thick, radius reduced by 6px, and bolts at the four corners. The wordmark's NET badge repeats the sign at small scale (inset ink then paper rings). Everything else is square: plates, sheets, tabs, fields, chips, tags, charts.

Exceptions are depictions of real objects, not surfaces: bolts and stepper dots are circles, browser and phone mockups keep device radii. Borders do the structural work: 2px ink rules head a ficha, 1px concrete hairlines separate rows, 1.5–2px dashed lines mean pending.

**The Two Corners Rule.** If it is not a sign panel or a depicted physical object, its corner is 0.

**The Dashed Means Pending Rule.** Dashed stroke = not selected, not yet done, under construction. Solid stroke or solid fill = selected, done, delivered. Never use dashes decoratively.

## Components

### Buttons (Plates)
Tactile sign plates that get painted on hover.
- **Shape:** square (0px), 2px border in the fill colour, min-height 56px (42px small).
- **Primary (ink plate):** ink fill, paper lettering, 750 uppercase, trailing up-right arrow.
- **Sign plate:** sign fill, ink lettering; used for Cotizar in the header and service CTAs.
- **Paper plate:** paper fill, ink lettering, for use on ink grounds.
- **Ghost light / dark:** transparent with a 55% paper or 70% ink border.
- **Hover / Focus:** a fill wipes up from below (0.5s, ease-out cubic-bezier(0.16, 1, 0.3, 1)) in the variant's hover colour (sign for ink plates, paper for sign plates, ink for paper plates), the lettering swaps, the arrow nudges 3px up-right; active presses 1px down. Focus is a 3px sign-300 outline offset 3px.

### Chips and Tags
- **Frente plate:** ink plate with a 30% paper hairline, mono label, code in a sign-blue chip (FR-0x). Sits on the right end of each barrier rail and in the header next to the wordmark (sign-300 code in a sign hairline box).
- **Estado tag:** square sign chip with ink 750 uppercase; "en obra" variant is paper with a 3px sign underline.
- **Photo tag / entregable tag:** paper chip with mono ink label.

### Cards / Containers
- **Valla (sign panel):** sign fill, road-sign radius, reflective inset border, four bolts, paper headline with the emphasised line in ink.
- **Ficha técnica:** square paper sheet, 2px ink rule under a mono header row, two-column dl with mono concrete-700 terms, 650 values and 1px concrete-300 row rules; may end in the ETAPAS stepper (3px track, dot per phase, sign for done/current).
- **Dashboard sheet:** square ink sheet on paper ground, sign-300 mono KPI terms, 850 values with trend line, bars in sign-700 with the top bar sign-300.
- **Obra en construcción:** 2px dashed paper frame around an ink-bordered small sign.

### Inputs / Fields
- **Style:** underline only, 2px concrete-400 bottom border on transparent, square, ink text at 1.12rem; label above in 0.8rem uppercase sign-700.
- **Focus:** bottom border turns sign with a 2px sign underline shadow.
- **Error:** bottom border becomes ink and dashed, message in 650 ink below.

### Selectors (tabs and option cards)
- **Pending:** transparent, 1.5–2px dashed border (ink 38% or concrete-500), a square letter badge (A–D) outlined in currentColor.
- **Hover:** border turns solid-colour ink but stays dashed.
- **Selected:** solid ink fill, paper text, solid border, letter badge filled sign with ink letter; tabs reveal a sign-400 arrow.

### Navigation
- **Header:** fixed ink strip (92% opacity), wordmark DUKE in paper 72% plus NET in a mini sign badge, frente code readout, uppercase 650 nav links with a 2px sign underline that scales in from the left on hover or current, small sign plate Cotizar. A 3px avance line beneath fills with page progress.
- **Mobile:** 46px square outlined toggle; full-height ink menu with FR-0x mono codes beside large 850 uppercase labels, divided by paper hairlines, ending in a sign plate.

### Barrier Rail (signature)
14px repeating -45deg stripe, paper and ink in 14px bands, spanning the full width between frentes, with the frente plate riding its right end. It is the only use of stripes.

### Pinned Schedule (signature)
**Obra en vivo (signature).** Cronograma pins at every width and scrubs one GSAP timeline on a sign-900 ground: a browser frame builds the El Gato Galletero home in five phases. Diagnóstico pins paper notes (taped with sign-300) on a drafting grid; Propuesta draws labeled wireframe boxes and dimension lines (cotas) in sign-300/paper; Diseño grows a grey skeleton block by block; Lanzamiento types the domain in the URL bar while a sign-300 scan line wipes the real screenshot in, then a bolted "En línea" sign stamps on; Crecer raises an ink "Reporte del mes · Ejemplo" plate whose bars settle elastically. A five-segment track and the swapping phase text follow the timeline's time, so scrubbing backwards restores every state. With reduced motion the stage does not pin; the same timeline plays once, faster, when it enters view. Stage geometry is measured from `public/obras/gato-galletero.jpg`; changing that capture means re-measuring the skeleton and wire boxes.

### Motion
GSAP with Lenis smooth scroll (lerp 0.1). Easing is expo.out / expo.inOut (CSS ease-out cubic-bezier(0.16, 1, 0.3, 1), ease-in-out cubic-bezier(0.76, 0, 0.24, 1)); durations 0.5–1.3s. Entrance grammar: the sign rises by clip-path from below, headline lines unmask upward, the refused words are struck through word by word, the ficha drops in with a slight rotation, bolts spin in. Photos reveal by clip-path with a scale settle. Numbers count up with damped expo easing; chart bars settle with a soft elastic. Reduced motion keeps fades and count-ups and drops smooth scroll, pinning, parallax, scale and travel.

## Do's and Don'ts

### Do:
- **Do** drench whole regions in sign blue (#5980a6) and keep leads and small text on it in ink.
- **Do** give sign panels the road-sign radius, the inset paper border and four bolts; keep every other surface square.
- **Do** build every action as a plate with the fill-wipe hover and a trailing arrow.
- **Do** separate frentes with the 14px barrier rail and its FR-0x plate.
- **Do** present facts as a ficha técnica: Overpass Mono terms, heavy values, hairline rows.
- **Do** use dashed strokes for pending or unselected and solid for done or selected.
- **Do** duotone every photo into sign blue (grayscale image under a sign multiply layer on sign-800).
- **Do** keep reduced motion to fades and count-ups.

### Don't:
- **Don't** use yellow, orange or any hazard colour; construction is blue, ink, paper and stripes.
- **Don't** round plates, sheets, fields, tabs or tags.
- **Don't** use barrier stripes as decoration inside sections; they are thresholds only.
- **Don't** show unprocessed or moody full-colour photography.
- **Don't** set mono plate labels as eyebrows above headlines.
- **Don't** put shadows on sign panels or in-flow plates.
- **Don't** show a progress percentage or metric that is not real; show real phases instead.
