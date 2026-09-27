# Publicar

## Compilar

```bash
npm install
npm run build
```

`npm run build` deja el sitio terminado en `dist/`: HTML, CSS, JavaScript e
imágenes, sin nada que ejecutar en el servidor. `npm run preview` sirve esa
carpeta igual que la vería un visitante (incluida la página 404), que es la
forma correcta de revisar antes de subir.

## Dónde alojarlo

| Opción | Cómo queda |
|---|---|
| **Vercel o Netlify** (recomendado) | Conectas el repositorio, detectan Astro solos, compilan en cada `push` y sirven la 404 sin configurar nada. Certificado HTTPS y dominio propio incluidos. |
| Hosting propio / cPanel | Subes el contenido de `dist/` a la carpeta pública. Revisa que el servidor use `404.html` como página de error. |
| GitHub Pages | Funciona, pero el sitio quedaría en `usuario.github.io/Dukenet/`: habría que configurar `base` en `astro.config.mjs` y corregir las rutas de las imágenes. Solo vale la pena si no se va a usar dominio propio. |

## Dominio

El dominio de producción es `https://dukenet.co` y está escrito en dos sitios:

- [`astro.config.mjs`](../astro.config.mjs) → `site`
- [`public/robots.txt`](../public/robots.txt) → la línea `Sitemap:`

De ahí salen el enlace canónico, el sitemap, las etiquetas para redes y los
datos estructurados. **Si cambia el dominio, hay que cambiar esos dos archivos**
y volver a compilar; no hay ningún otro lugar donde esté escrito a mano.

## Qué trae ya resuelto para buscadores

- Título de 52 caracteres y descripción de 158, dentro de lo que Google muestra.
- Enlace canónico en cada página.
- Open Graph y Twitter completos: título, descripción, `og.png` de 1200 × 630
  con su texto alternativo, tipo y tamaño declarados.
- Datos estructurados `ProfessionalService` construidos desde los datos reales
  del sitio: nombre, descripción, los dos teléfonos y las ciudades que se
  atienden. Solo se emiten en las páginas indexables.
- `robots.txt` y `sitemap-index.xml` (el sitemap se genera en cada compilación y
  deja la 404 por fuera).
- `meta robots` con `max-image-preview:large`, `geo.region` para Colombia,
  `theme-color`, favicon SVG y `apple-touch-icon` de 180 × 180.
- Idioma declarado `es-CO`.
- Todas las imágenes con medidas reales, para que la página no salte mientras
  carga.
- Página 404 propia, marcada `noindex, follow`.

Si agregas una página nueva, entra al sitemap sola. Si no quieres que se
indexe, pásale `robots="noindex, follow"` al layout, como hace la 404.

## Después de salir al aire

1. Dar de alta el dominio en [Google Search Console](https://search.google.com/search-console)
   y enviar `https://dukenet.co/sitemap-index.xml`.
2. Crear el perfil de Google Business para aparecer en búsquedas locales
   (es lo que más mueve la aguja para un negocio en Colombia).
3. Revisar la miniatura del enlace compartiéndolo en WhatsApp: es por donde va a
   circular.
4. Probar los dos botones de WhatsApp y el formulario desde un celular real,
   con el mensaje ya escrito.
5. Instalar la medición que se le ofrece al cliente (la sección del panel
   promete un reporte mensual; conviene que el propio sitio lo tenga).
