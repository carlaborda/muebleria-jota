# Mueblería Hermanos Jota

Sitio web de catálogo para una mueblería ficticia ("Hermanos Jota"). Es un
sitio estático de HTML, CSS y JavaScript puro: sin frameworks, sin build
step y sin backend.

## Páginas

| Página            | Descripción                                              |
|--------------------|-----------------------------------------------------------|
| `index.html`       | Inicio: hero, texto institucional y productos destacados. |
| `productos.html`   | Catálogo completo con buscador por nombre/material/estilo. |
| `producto.html`    | Detalle de un producto (`producto.html?id=<n>`).           |
| `contacto.html`    | Información de contacto y formulario de consulta.          |

## Estructura del proyecto

```
.
├── index.html
├── productos.html
├── producto.html
├── contacto.html
├── styles.css          # hoja de estilos única del sitio
├── cart.js             # carrito de compras (localStorage), compartido
├── catalogo.js          # datos de los 11 productos + render de index/productos
├── inicio.js            # lógica específica de index.html (destacados)
├── producto.js          # lógica específica de producto.html (detalle)
├── contacto.js           # lógica específica de contacto.html (formulario)
└── img/
    ├── logo.svg
    └── *.png             # fotos de producto
```

No hay `package.json` ni dependencias: los `<script>` se cargan directo
en cada HTML, en este orden (`cart.js` siempre primero para que el
contador del carrito esté disponible antes de cualquier otro script).

## Cómo correrlo en local

Al ser HTML/CSS/JS estático, alcanza con servirlo con cualquier servidor
de archivos estáticos. Por ejemplo, con Node:

```bash
npx serve .
```

o con Python:

```bash
python3 -m http.server 5500
```

Después abrir `http://localhost:5500` (o el puerto que indique la
herramienta elegida). No usar `file://` directamente en el navegador:
algunas rutas relativas y el `fetch` del formulario de contacto pueden
comportarse distinto según el navegador cuando no hay un servidor HTTP
real de por medio.

## Stack

- HTML5 semántico.
- CSS puro con variables (custom properties) para colores y tamaños,
  organizado en una sola hoja (`styles.css`) por secciones: base
  compartida (header, marca, carrito, footer) y una sección por página.
- JavaScript vanilla (sin frameworks ni bundlers), `localStorage` para
  persistir el carrito entre páginas.
- Tipografías: Inter y Playfair Display, vía Google Fonts.

## Carrito de compras

El contador de carrito (`#cart-count`, visible en el header de las 4
páginas) se guarda en `localStorage` bajo la clave `hermanosjota:cart`
como un objeto `{ idProducto: cantidad }`. Se puede agregar productos
desde `producto.html` (con la cantidad elegida) o desde las tarjetas de
`productos.html`. El contador se actualiza solo al cargar cualquier
página, así que persiste al navegar por el sitio.

## Deploy

El sitio no necesita build ni configuración especial: es HTML/CSS/JS
estático servido tal cual. Para desplegarlo en [Vercel](https://vercel.com):

1. Importar el repositorio desde el dashboard de Vercel (o conectar la
   cuenta de GitHub).
2. Framework preset: **Other** (no hay build step).
3. Build command: dejar vacío.
4. Output directory: la raíz del proyecto (`.`).

Cualquier otro hosting de archivos estáticos (Netlify, GitHub Pages,
etc.) funciona igual, sin cambios en el código.
