# MCM & Asociados — Estudio Jurídico

Landing page estática (HTML + CSS + JS, sin backend ni build) para el estudio jurídico **MCM & Asociados** — Dra. Lorena.

## Secciones
Inicio · Servicios (Sucesiones, Accidentes laborales ART, Jubilaciones y pensiones, Casos penales, Contencioso administrativo) · El Estudio · Cómo trabajamos · Preguntas frecuentes · Contacto.

Todos los botones de contacto, el formulario y el botón flotante abren WhatsApp (`+54 9 385 514-7492`) con un mensaje pre-cargado según la consulta.

Enlaces directos a cada servicio: `#sucesiones`, `#art`, `#jubilaciones`, `#penales`, `#contencioso`.

## Publicar en GitHub Pages
1. En el repositorio: **Settings → Pages**.
2. *Source*: **Deploy from a branch** → Branch **main** / carpeta **/(root)** → **Save**.
3. En 1–2 minutos el sitio queda en `https://<usuario>.github.io/abogados_landing/`.

## Editar
- Número de WhatsApp: constante `WA_NUMBER` en `js/main.js`.
- Mensajes pre-cargados: atributo `data-wa="..."` de cada botón en `index.html`.
- Colores y tipografías: variables al inicio de `css/styles.css`.
- Flyers: `assets/img/*.webp`.
