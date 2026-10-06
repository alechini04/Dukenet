# Documentación de la landing de DukeNet

Esta carpeta explica cómo está hecha la página, dónde vive cada cosa y qué hay
que tocar para cambiarla sin romperla. Está pensada para quien la mantiene, no
para un cliente.

| Documento | Para qué |
|---|---|
| [secciones.md](secciones.md) | Recorrido de la página, bloque por bloque: qué muestra cada uno, en qué archivo está y qué se mueve. |
| [contenido.md](contenido.md) | Cambiar textos, números de WhatsApp, servicios, casos y fotos. Qué se puede decir y qué no. |
| [animaciones.md](animaciones.md) | Cómo funciona el movimiento, cómo se ajusta y cómo se prueba con movimiento reducido. |
| [publicar.md](publicar.md) | Compilar, publicar, dominio, SEO y qué hacer después de salir al aire. |
| [mantenimiento.md](mantenimiento.md) | Comandos, dependencias, trampas conocidas y cómo verificar que algo no se rompió. |

Documentos que ya existían y siguen siendo la fuente de verdad de otra cosa:

- [`PRODUCT.md`](../PRODUCT.md): qué es DukeNet, a quién le habla, qué se puede
  afirmar en la página (números de contacto, casos reales, límites).
- [`DESIGN.md`](../DESIGN.md): el sistema de diseño (colores, tipografía,
  escalas, componentes, reglas de uso). Si vas a dibujar algo nuevo, empieza ahí.
- [`README.md`](../README.md): arranque rápido del proyecto.

## Dónde cambio qué

| Quiero… | Archivo |
|---|---|
| Cambiar o agregar un número de WhatsApp | [`src/data/site.ts`](../src/data/site.ts) |
| Cambiar los servicios (nombre, texto, qué incluye, foto) | [`src/data/site.ts`](../src/data/site.ts) |
| Cambiar las cinco fases del método | [`src/data/site.ts`](../src/data/site.ts) |
| Cambiar las ciudades de la cinta | [`src/data/site.ts`](../src/data/site.ts) |
| Cambiar el titular de la portada | [`src/components/Portada.astro`](../src/components/Portada.astro) |
| Agregar o editar un caso entregado | [`src/components/Entregadas.astro`](../src/components/Entregadas.astro) |
| Cambiar las cifras del panel de ejemplo | [`src/components/Panel.astro`](../src/components/Panel.astro) |
| Cambiar el título de la pestaña o la descripción para Google | [`src/pages/index.astro`](../src/pages/index.astro) |
| Cambiar el dominio | [`astro.config.mjs`](../astro.config.mjs) y [`public/robots.txt`](../public/robots.txt) |
| Cambiar colores, tipografía o botones | [`src/styles/global.css`](../src/styles/global.css) |
| Ajustar o apagar una animación | [`src/scripts/app.ts`](../src/scripts/app.ts) |
| Reemplazar una foto de relleno | `public/fotos/` (ver [contenido.md](contenido.md)) |

## Cómo está armado

Sitio estático en [Astro](https://astro.build) 7: una sola página (`/`) más una
página de error (`/404`). Cada capítulo es un componente `.astro` con su HTML y
su CSS juntos; el CSS de un componente no se escapa a los demás. Todo el
comportamiento (menú, pestañas, formulario y animaciones) vive en un único
archivo, `src/scripts/app.ts`, que se carga una vez.

```
src/
  pages/index.astro     arma la página con los seis capítulos, en orden
  pages/404.astro       página de ruta no encontrada
  layouts/Base.astro    <head>: título, SEO, datos estructurados, icono
  components/*.astro    un capítulo por archivo (Portada, Plantilla, Servicios,
                        Montaje, Entregadas, Panel, Contacto) más Header y Footer
  lib/iso.ts            la proyección isométrica de la que salen todas las escenas
  data/site.ts          los textos y datos que se cambian seguido
  scripts/app.ts        comportamiento y animaciones
  styles/global.css     colores, tipografía, botones y materiales isométricos
public/                 imágenes, favicon, robots.txt (se copian tal cual)
```

No hay servidor ni base de datos: el formulario arma un mensaje y lo abre en
WhatsApp. Eso significa que la página se puede publicar en cualquier hosting
estático y que no hay nada que se caiga de noche.
