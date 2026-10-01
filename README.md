# Mueblería Hermanos Jota

Catálogo online para una mueblería ficticia ("Hermanos Jota"). Aplicación
de una sola página (SPA) en **React + Vite** que consume una **API REST en
Node.js + Express**.

## Integrantes — Grupo 4

| Integrante |
| :--------: |
| Almada Alejo Matías |
| Luciano Losardo |
| Sebastian Paz Friaz |
| Marcos Ezequiel Diaz |
| Borda Carla |

## Cómo correrlo

Requiere Node.js 20.19 o superior (lo pide Vite). Se levantan dos procesos,
cada uno en su terminal:

```bash
cd backend
npm install
npm run dev        # API en http://localhost:3000
```

```bash
cd client
npm install
npm run dev        # Front en http://localhost:5173
```

En desarrollo, Vite redirige las peticiones a `/api` hacia el backend
(ver `client/vite.config.js`), así que no hace falta configurar CORS.

## API

| Método | Ruta                  | Respuesta                                  |
|--------|-----------------------|--------------------------------------------|
| GET    | `/api/productos`      | Array con los 11 productos.                |
| GET    | `/api/productos/:id`  | Un producto, o `404 { error }` si no existe. |

Cualquier otra ruta bajo `/api` responde `404 { error: 'Endpoint no encontrado' }`.
Todas las peticiones pasan por un middleware logger (`backend/mi-logger.js`).

## Estructura del proyecto

```
.
├── backend/
│   ├── server.js            # app Express, middlewares y 404
│   ├── mi-logger.js         # middleware que loguea método y ruta
│   ├── routes/productos.js  # router modular de /api/productos
│   └── data/catalogo.js     # datos de los productos
└── client/
    ├── public/              # logo e imágenes de productos
    └── src/
        ├── App.jsx          # estado global: vista actual, productos y carrito
        ├── servicios/api.js # fetch a la API
        ├── utils/formato.js # formato de precios
        ├── styles/base.css  # variables, reset, botones y layout compartido
        ├── componentes/     # Navbar, Footer, ProductList, ProductCard,
        │                    # ProductDetail, ContactForm, Carrito, EstadoCarga
        └── vistas/          # Inicio, Catalogo, Contacto
```

Cada componente importa su propio `.css`; los estilos globales están en
`styles/base.css`.

## Funcionalidades del front

- **Catálogo desde la API**: `App` hace `fetch` a `GET /api/productos` al
  montar y maneja los estados de carga, error (con botón para reintentar)
  y lista vacía.
- **Detalle de producto**: al hacer clic en una tarjeta se muestra
  `ProductDetail`, que pide `GET /api/productos/:id`.
- **Carrito**: vive como estado en `App` (`[{ producto, cantidad }]`). El
  contador del `Navbar` llega por props. Se pueden sumar y restar unidades,
  quitar productos y ver el total.
- **Formulario de contacto**: controlado con `useState`, con validación
  por campo y envío a Formspree.
- **Buscador** en el catálogo, que filtra por nombre o descripción.
