# Cambiar textos, datos e imágenes

## Lo que se cambia seguido: `src/data/site.ts`

Un solo archivo alimenta varias secciones a la vez. Tocar aquí es lo más seguro.

| Dato | Qué alimenta |
|---|---|
| `WHATSAPP` | Los botones de la portada, los de la sección de cotizar, la lista del pie, el botón flotante y los teléfonos de los datos estructurados. El **primero** de la lista es al que llega el formulario. |
| `wa(tel, texto)` | Arma el enlace `wa.me` con el mensaje ya escrito. Si agregas un botón nuevo de WhatsApp, úsala en vez de escribir la URL a mano. |
| `SERVICIOS` | Las cuatro pestañas de Obras: letra, nombre, texto, qué incluye, botón, foto y su descripción alternativa. |
| `FASES` | Las cinco etapas: en la ficha de la portada y en el cronograma. |
| `CIUDADES` | La cinta de cobertura y la lista de ciudades de los datos estructurados. |

Para agregar un número de WhatsApp basta con añadirlo a `WHATSAPP`: aparece solo
en la portada, en cotizar, en el pie y en el SEO. El formato de `tel` es el
internacional sin signos (`573163289924`) y el de `label` es como se lee
(`316 328 9924`).

## Textos que viven dentro de su sección

No todo está en `site.ts`: lo que solo aparece una vez se quedó junto a su
sección, para no inflar el archivo de datos.

| Texto | Archivo |
|---|---|
| Titular de la portada | `Portada.astro` |
| Frase del capítulo 00 y los tres principios | `Porque.astro`, arreglo `principios` |
| Casos entregados (nombre, dominio, tipo, estado, texto, capturas) | `Obras.astro`, arreglo `casos` |
| Notas y bloques del plano del capítulo 02 | `Proceso.astro`, arreglos `notas` y `bloques` |
| Cifras, gráfica y embudo del panel | `Datos.astro`, arreglos `metricas`, `semana`, `embudo` |
| Opciones del formulario | `Contacto.astro`, arreglo `opciones` |
| Título de la pestaña y descripción para Google | `src/pages/index.astro` |

## Qué se puede afirmar y qué no

Esto no es una preferencia de estilo, es lo que sostiene la credibilidad de la
página (está también en [`PRODUCT.md`](../PRODUCT.md)):

- **No hay testimonios, logos de clientes, premios, precios ni métricas reales.**
  No los inventes ni los pidas prestados de una plantilla.
- Las cifras del panel son de ejemplo y el rótulo **"Ejemplo"** tiene que seguir
  visible mientras no haya datos reales con permiso del cliente.
- Los casos que se muestran son reales: El Gato Galletero y Suè están en
  producción; Convite está en construcción y así se dice.
- Voz: directa, en español claro, tuteo, sin tecnicismos. La promesa es vender,
  no decorar.

## Imágenes

Van en `public/`, se copian tal cual y se referencian con ruta absoluta
(`/fotos/obra-tienda.jpg`).

### Fotos de relleno · `public/fotos/`

Son de Unsplash y están para que ninguna sección se vea vacía. Cámbialas por
fotos reales **conservando el nombre del archivo** y actualiza el texto
alternativo en `SERVICIOS` (o en el componente, para `diagnostico.jpg`).

| Archivo | Dónde se ve | Medidas | Peso |
|---|---|---|---|
| `obra-tienda.jpg` | Obras · pestaña A | 1200 × 857 | 84 KB |
| `obra-negocio.jpg` | Obras · pestaña B | 1200 × 857 | 126 KB |
| `obra-landing.jpg` | Obras · pestaña C | 1200 × 857 | 53 KB |
| `obra-datos.jpg` | Obras · pestaña D | 1200 × 857 | 93 KB |
| `diagnostico.jpg` | Manifiesto | 1200 × 857 | 70 KB |
| `convite.jpg` | Caso Convite | 1200 × 857 | 63 KB |

Los créditos de cada una están en el [`README.md`](../README.md) de la raíz.
La más urgente de reemplazar es `convite.jpg`: lo ideal es una captura real del
producto.

### Capturas de los casos · `public/obras/`

| Archivo | Medidas | Peso |
|---|---|---|
| `gato-galletero.jpg` | 1200 × 2167 | 184 KB |
| `gato-galletero-movil.jpg` | 560 × 2297 | 62 KB |
| `suue.jpg` | 1200 × 2167 | 185 KB |
| `suue-movil.jpg` | 560 × 2297 | 87 KB |

Son capturas de página completa (por eso son tan altas: se recorren solas). Si
rehaces una, mantén la proporción o ajusta el `width`/`height` de la etiqueta
`<img>` en `Entregadas.astro`, porque esas medidas son las que evitan que la
página salte mientras carga.

`gato-galletero.jpg` se usa en tres sitios: la portada, el capítulo 02 (donde se
revela al final del montaje) y la ficha de la obra. Si la cambias, revisa los tres.

### Reglas para cualquier imagen nueva

1. Exporta al tamaño en que se va a ver, no más grande. Todas las fotos de
   sección caben en 1200 px de ancho.
2. Siempre `width` y `height` en la etiqueta, `loading="lazy"` y
   `decoding="async"` (menos si fuera lo primero que se ve).
3. El texto alternativo describe lo que se ve, en español, sin "imagen de".
   Si la imagen es decorativa, `alt=""`.
4. Revisa que no aparezcan marcas de terceros en la foto.
5. `og.png` (1200 × 630) es la miniatura al compartir el enlace; si cambia el
   titular de la portada, conviene rehacerla.
