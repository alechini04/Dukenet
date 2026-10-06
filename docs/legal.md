# Las páginas legales

Colombia no exige "unos términos" genéricos, pero sí exige algo concreto en cuanto
recoges un dato personal: **la Ley 1581 de 2012** (habeas data) y el **Decreto 1074 de
2015** obligan a tener una política de tratamiento publicada, a pedir autorización
previa, expresa e informada, y a dar un canal para ejercer derechos. Eso es lo que
cubren estas tres páginas.

| Página | Archivo | Qué cubre |
|---|---|---|
| `/privacidad` | [`src/pages/privacidad.astro`](../src/pages/privacidad.astro) | Política de tratamiento de datos personales (Ley 1581/2012, Decreto 1074/2015). |
| `/cookies` | [`src/pages/cookies.astro`](../src/pages/cookies.astro) | Qué se guarda en el navegador. Hoy: nada. |
| `/terminos` | [`src/pages/terminos.astro`](../src/pages/terminos.astro) | Uso del sitio y reglas de contratación (Ley 1480/2011, Ley 527/1999). |

Las tres usan [`src/layouts/Legal.astro`](../src/layouts/Legal.astro), que arma el
encabezado, el índice lateral y las fechas de vigencia. Se enlazan desde el pie, en la
columna **Legal** y en la línea de abajo.

## Antes de publicar: completar la identidad

La ley pide identificar al responsable con nombre, NIT, domicilio, correo y teléfono. Lo
que no sabíamos quedó vacío en [`src/data/legal.ts`](../src/data/legal.ts) y la página lo
muestra como `[por completar]` en azul, para que no se escape:

```ts
razonSocial: '',   // nombre completo o razón social
nit: '',           // NIT o cédula
domicilio: '',     // dirección de notificaciones
correo: '',        // correo para derechos de habeas data
```

Llena esos cuatro campos y las tres páginas quedan completas. Revisa también `ciudad` y
las fechas `vigencia` y `actualizado`.

## La autorización en el formulario

El formulario tiene una casilla obligatoria («Autorizo a DukeNet a tratar mis datos…»)
que enlaza a la política. Sin marcarla no se envía: es la autorización previa, expresa e
informada que pide el artículo 9 de la Ley 1581. La validación está en
[`src/scripts/app.ts`](../src/scripts/app.ts), junto a la del resto del formulario.

No borres esa casilla aunque estorbe: es el único registro de que el visitante autorizó.

## Lo que dicen las páginas y por qué conviene no exagerar

- **No se recogen datos sensibles** y así está escrito. Si algún día se piden (por
  ejemplo, datos de salud de un cliente del sector), hay que actualizar la política.
- **El formulario no guarda nada**: arma el mensaje y lo abre en WhatsApp. Eso implica
  que el mensaje pasa por Meta, y la política lo dice, porque es una transferencia
  internacional de datos.
- **El sitio no instala cookies.** Si mañana se agrega analítica, hay que actualizar la
  política de cookies **y** pedir consentimiento antes de instalarlas.
- **Las cifras del panel son de ejemplo** y los términos lo repiten: no se promete un
  resultado.

## Un abogado debería revisarlas

Están escritas siguiendo lo que exigen esas normas, pero no son asesoría legal. Antes de
una campaña grande o de vender en línea conviene que un abogado las revise, sobre todo
si se agregan pagos (ahí entra de lleno el Estatuto del Consumidor y el comercio
electrónico) o si el negocio queda obligado a inscribir sus bases de datos en el
Registro Nacional de Bases de Datos de la SIC.
