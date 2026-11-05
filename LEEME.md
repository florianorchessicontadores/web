# Florián Orchessi & Asociados — Sitio web estático

Sitio HTML/CSS/JS sin frameworks, compatible con GitHub Pages. Para probarlo en local usa un servidor
(`python3 -m http.server` y abre http://localhost:8000) o la extensión "Live Server" de VS Code.
*(Con doble clic en `index.html` casi todo funciona, pero el formulario y la verificación de archivos requieren http/https.)*

## Publicar en GitHub Pages
1. Sube TODO el contenido de esta carpeta al repositorio (reemplaza los archivos anteriores).
2. Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
3. Si usas el dominio propio www.florianorchessi.com, configúralo en Settings → Pages → Custom domain.
   Las URLs de SEO (canonical, Open Graph, sitemap, robots) ya apuntan a `https://www.florianorchessi.com/`.

## Estructura
- `index.html`, `quienes-somos.html`, páginas de servicios, `recursos.html` (Recursos y Blog)
- `style.css` (única hoja de estilos), `script.js` (menú, animaciones y formulario)
- `recursos-data.js` → catálogo de descargas · `blog-data.js` → índice del blog · `recursos.js` → genera las tarjetas (no se edita)
- `recursos-archivos/` → Excel/PDF descargables · `assets/docs/` → brochure (no tocar) · `blog/` → artículos

## Cómo agregar un Excel o PDF nuevo
1. Copia el archivo a `recursos-archivos/` (respeta mayúsculas y espacios del nombre).
2. Abre `recursos-data.js`, copia uno de los bloques `{ ... }` al final de la lista `window.RECURSOS` (con coma entre bloques) y cambia:
   `titulo`, `descripcion`, `categoria`, `archivo` (nombre exacto), `tipo` y, si quieres, `boton`.
3. Sube a GitHub. La tarjeta aparece sola, agrupada por categoría. Los filtros se crean automáticamente.
- Categorías sugeridas: Gestión tributaria · Gestión contable · Gestión laboral · Herramientas empresariales (puedes crear otras).
- Para quitar un recurso: borra su bloque (o pon `activo: false`). Si el archivo no existe en el servidor, la tarjeta no se muestra.

## Cómo agregar un artículo al Blog
1. Copia `blog/plantilla-articulo.html` a `blog/nombre-del-articulo.html` (minúsculas y guiones).
2. Edítalo: título (`<title>`, `og:title`, `<h1>`), categoría, fecha, resumen y contenido.
   Cambia `NOMBRE-DEL-ARCHIVO` en `canonical` y `og:url`, y **borra la línea `<meta name="robots" content="noindex">`**.
3. En `blog-data.js` agrega un bloque con `titulo`, `categoria`, `fecha` (AAAA-MM-DD), `resumen` y `archivo: "blog/nombre-del-articulo.html"`.
4. En `sitemap.xml` agrega: `<url><loc>https://www.florianorchessi.com/blog/nombre-del-articulo.html</loc></url>`
5. Sube a GitHub. El blog está vacío a propósito: no se publicó ningún contenido de ejemplo.

## Formulario "Solicitar asesoría" (FormSubmit)
- Envía a `info@florianorchessi.com` (dirección en el atributo `action` del `<form id="contact-form">` de `index.html`).
- **Activación obligatoria (una sola vez):** tras publicar el sitio, envía un mensaje de prueba desde el formulario real.
  FormSubmit enviará un correo de activación a esa casilla: abre el correo y pulsa el botón de confirmar.
  Mientras no se active, los mensajes NO se entregan y el sitio mostrará el aviso de error con WhatsApp y correo alternativos.
- Revisa también la carpeta de spam la primera vez.
- Recomendado: tras activar, FormSubmit te permite usar un código aleatorio en lugar del correo en la URL
  (ej. `https://formsubmit.co/abc123...`), lo que evita exponer el correo a robots de spam. Pégalo en el `action`.
- Qué hace: valida nombre, correo y mensaje (obligatorios) y el formato del correo; bloquea envíos dobles;
  trampa anti-spam (campo oculto `_honey`) y tiempo mínimo; muestra confirmación o error claros; el botón "Responder" del correo recibido va al visitante.
- Si deseas recibir en `gerencia@florianorchessi.com`, cambia solo el correo en `action` y repite la activación.

## Mapa de ubicación
`index.html`, sección Contacto y ubicación: el mapa se busca por la dirección escrita (sin coordenadas inventadas), por lo que el pin puede no caer
exactamente en el inmueble. Para fijar el punto exacto: Google Maps → busca tu oficina → Compartir → Insertar un mapa → copia el valor `src="..."`
del iframe y reemplaza el `src` del iframe actual. Actualiza igualmente el enlace "Abrir en Google Maps" con el enlace de "Compartir".

## Datos de contacto vigentes
Correo gerencia@florianorchessi.com · WhatsApp +51 949 943 032 (`https://wa.me/51949943032`) · www.florianorchessi.com ·
Calle Marcelo Corne 289 Dpto. 201 - San Andrés - Trujillo - Perú.

## Pendientes
- Fotografías: provienen del brochure; reemplázalas con el mismo nombre en `assets/images/` si deseas.
- Logotipos oficiales de las instituciones: la sección usa siglas tipográficas. Si deseas logos, guárdalos en `assets/images/instituciones/`
  y reemplaza el texto de `<span class="inst-sig">SUNAT</span>` por `<span class="inst-sig"><img src="assets/images/instituciones/sunat.png" alt="SUNAT"></span>`
  (verifica las condiciones de uso de cada entidad).
- "Más de 20 años": cifra tomada del contenido original de la web.
