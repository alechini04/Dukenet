# Dukenet
Soluciones tecnológicas, páginas web y desarrollo digital para impulsar tu negocio.

Landing de DukeNet: sitio estático en [Astro](https://astro.build) con animaciones de [GSAP](https://gsap.com) (ScrollTrigger, SplitText) y scroll suave con [Lenis](https://lenis.darkroom.engineering).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

`dist/` es HTML/CSS/JS estático: se publica tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

## Estructura

- `src/pages/index.astro`: arma la página con las secciones.
- `src/components/`: una sección por archivo (Hero, Obras, Entregadas, Cronograma, Panel, Contacto…).
- `src/data/site.ts`: textos editables (WhatsApp, servicios, fases, ciudades).
- `src/scripts/app.ts`: menú, pestañas, formulario → WhatsApp y todas las animaciones.
- `src/styles/global.css`: colores, tipografía y botones.

## Publicar

El dominio de producción es `https://dukenet.co` y está declarado en `astro.config.mjs` (`site`) y en `public/robots.txt`. Si cambia el dominio hay que actualizar esos dos archivos: de ahí salen el enlace canónico, el sitemap, las etiquetas para redes y los datos estructurados.

Ya incluidos: `robots.txt`, `sitemap-index.xml`, canónico, Open Graph y Twitter con imagen `og.png` (1200×630), datos estructurados de tipo `ProfessionalService`, favicon y `apple-touch-icon`.

Después de publicar: dar de alta el dominio en [Google Search Console](https://search.google.com/search-console), enviar `https://dukenet.co/sitemap-index.xml` y crear el perfil de Google Business para aparecer en búsquedas locales.

## Imágenes para reemplazar

Las fotos de `public/fotos/` son de relleno (Unsplash, vía picsum.photos). Cámbialas por fotos reales conservando el nombre de archivo:

| Archivo | Uso | Origen |
|---|---|---|
| `obra-tienda.jpg` | Servicio A · Tienda en línea | Vadim Sherbakov, unsplash.com/photos/tCICLJ5ktBE |
| `obra-negocio.jpg` | Servicio B · Página de negocio | Dogancan Ozturan, unsplash.com/photos/94taEmdowRw |
| `obra-landing.jpg` | Servicio C · Landing de campaña | Alejandro Escamilla, unsplash.com/photos/Dl6jeyfihLk |
| `obra-datos.jpg` | Servicio D · Datos y acompañamiento | Galymzhan Abdugalimov, unsplash.com/photos/ICW6QYOcdlg |
| `diagnostico.jpg` | Manifiesto | Alejandro Escamilla, unsplash.com/photos/BbQLHCpVUqA |
| `convite.jpg` | Caso Convite (ideal: captura real del producto) | Vee O, unsplash.com/photos/hGO27G5tZJ8 |

`public/obras/` tiene capturas reales de elgatogalletero.com y suue.shop (16 sep 2026). Las cifras del panel de datos son de ejemplo y así se indican en la página.
