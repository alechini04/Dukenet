# Dukenet
Soluciones tecnológicas, páginas web y desarrollo digital para impulsar tu negocio.

Landing de DukeNet: sitio estático en [Astro](https://astro.build) con un objeto 3D en [Three.js](https://threejs.org), animaciones de [GSAP](https://gsap.com) (ScrollTrigger, SplitText) y scroll suave con [Lenis](https://lenis.darkroom.engineering).

## Documentación

En [`docs/`](docs/) está explicado todo el sitio: las
[secciones](docs/secciones.md), cómo cambiar
[textos e imágenes](docs/contenido.md), cómo funcionan las
[animaciones](docs/animaciones.md), cómo [publicar](docs/publicar.md) y las
trampas conocidas al [mantenerlo](docs/mantenimiento.md).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

`dist/` es HTML/CSS/JS estático: se publica tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

## Estructura

- `src/pages/index.astro`: arma la página con los capítulos, en orden.
- `src/pages/404.astro`: página de ruta no encontrada, con desvíos a cada capítulo.
- `src/pages/privacidad.astro`, `cookies.astro`, `terminos.astro`: las políticas legales (ver [docs/legal.md](docs/legal.md)).
- `src/components/`: un capítulo por archivo (Portada, Porque, Servicios, Proceso, Obras, Datos, Contacto) más Header, Footer, Plano y Nucleo.
- `src/data/site.ts`: textos editables (WhatsApp, servicios, fases, ciudades).
- `src/scripts/app.ts`: menú, formulario → WhatsApp y todas las animaciones.
- `src/scripts/tres.ts`: el objeto 3D del fondo; se carga aparte y solo si el equipo puede con él.
- `src/styles/global.css`: colores, tipografía y botones.

## Publicar

El dominio de producción es `https://dukenet.co` y está declarado en `astro.config.mjs` (`site`) y en `public/robots.txt`. Si cambia el dominio hay que actualizar esos dos archivos: de ahí salen el enlace canónico, el sitemap, las etiquetas para redes y los datos estructurados.

Ya incluidos: `robots.txt`, `sitemap-index.xml`, canónico, Open Graph y Twitter con imagen `og.png` (1200×630), datos estructurados de tipo `ProfessionalService`, favicon, `apple-touch-icon` y página de error (`src/pages/404.astro` → `dist/404.html`, marcada `noindex` y fuera del sitemap). Casi todos los hostings la sirven solos; en algunos hay que indicarla en su configuración.

Los pasos completos, las opciones de hosting y la lista de lo que trae resuelto para buscadores están en [docs/publicar.md](docs/publicar.md).

Después de publicar: dar de alta el dominio en [Google Search Console](https://search.google.com/search-console), enviar `https://dukenet.co/sitemap-index.xml` y crear el perfil de Google Business para aparecer en búsquedas locales.

## Imágenes

`public/obras/` tiene las capturas reales de elgatogalletero.com (16 sep 2026), que se usan solo en «Trabajos realizados». Las cifras del panel de datos son de ejemplo y así se indican en la página.
