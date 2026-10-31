# Mueblería Hermanos Jota

Tienda online para una mueblería ficticia ("Hermanos Jota"). Aplicación de una
sola página (SPA) en **React + Vite** que consume una **API REST en Node.js +
Express** con persistencia en **MongoDB**.

## Integrantes — Grupo 4

| Integrante |
| :--------: |
| Almada Alejo Matías |
| Luciano Losardo |
| Sebastian Paz Friaz |
| Marcos Ezequiel Diaz |
| Borda Carla |

## Arquitectura

```
Navegador (React)  ──HTTP/JSON──▶  API Express  ──Mongoose──▶  MongoDB
     /client                        /backend
```

En desarrollo el front llama a `/api` y Vite lo redirige al backend. En
producción el front usa `VITE_API_URL` y el backend habilita ese origen con
`CORS_ORIGIN`.

## Tecnologías

- **Frontend:** React 19, React Router DOM 7, Vite 8, oxlint.
- **Backend:** Node.js, Express 5, Mongoose 9, cors, dotenv.
- **Base de datos:** MongoDB (Atlas o local).

## Instalación

Requiere Node.js 20.19 o superior y una base MongoDB.

```bash
cd backend
npm install
```

```bash
cd client
npm install
```

## Variables de entorno

Los archivos `.env` no se suben al repositorio. Cada carpeta tiene un
`.env.example` para copiar.

**`backend/.env`**

| Variable      | Obligatoria | Descripción |
|---------------|-------------|-------------|
| `MONGO_URI`   | Sí          | Cadena de conexión a MongoDB. Sin ella la API no arranca. |
| `PORT`        | No          | Puerto de la API (por defecto `3000`). |
| `CORS_ORIGIN` | En producción | Orígenes del front habilitados, separados por coma. |

**`client/.env`**

| Variable       | Obligatoria   | Descripción |
|----------------|---------------|-------------|
| `VITE_API_URL` | En producción | URL pública del backend, sin barra final. |

### Configurar MongoDB Atlas

1. Crear un cluster y un usuario de base de datos.
2. En **Network Access**, permitir la IP de tu máquina. Render usa IP dinámicas
   en el plan gratuito, por lo que hay que habilitar `0.0.0.0/0`.
3. Copiar la cadena de conexión en `MONGO_URI`, agregando el nombre de la base:
   `mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/muebleria-jota`.

## Ejecución local

Se levantan dos procesos, cada uno en su terminal:

```bash
cd backend
npm run seed       # opcional: carga el catálogo inicial
npm run dev        # API en http://localhost:3000
```

```bash
cd client
npm run dev        # Front en http://localhost:5173
```

`npm run seed` se puede repetir: solo inserta los productos que todavía no
existen, comparando por nombre, y no modifica ni borra los demás.

## API

| Método | Ruta                 | Funcionalidad       | Éxito |
|--------|----------------------|---------------------|-------|
| GET    | `/api/productos`     | Listar productos    | `200` |
| GET    | `/api/productos/:id` | Obtener un producto | `200` |
| POST   | `/api/productos`     | Crear un producto   | `201` |
| PUT    | `/api/productos/:id` | Actualizar producto | `200` |
| DELETE | `/api/productos/:id` | Eliminar producto   | `200` |

Campos de un producto:

| Campo              | Tipo   | Notas |
|--------------------|--------|-------|
| `nombre`           | String | Obligatorio. |
| `precio`           | Number | Obligatorio, no negativo. |
| `descripcion`      | String | |
| `stock`            | Number | No negativo, por defecto `0`. |
| `imagenUrl`        | String | |
| `especificaciones` | Map    | Ficha técnica opcional, cargada por el seed. |

Los errores responden `{ error }`:

| Código | Caso |
|--------|------|
| `400`  | ID con formato inválido, JSON mal formado o datos inválidos (incluye `detalles` por campo). |
| `404`  | Producto o endpoint inexistente. |
| `503`  | Base de datos no disponible. |
| `500`  | Error interno. |

## Rutas del front

| Ruta                         | Página |
|------------------------------|--------|
| `/`                          | Inicio con productos destacados |
| `/productos`                 | Catálogo con buscador |
| `/productos/:id`             | Detalle, con acciones de editar y eliminar |
| `/carrito`                   | Carrito, guardado en `localStorage` |
| `/contacto`                  | Formulario de contacto (Formspree) |
| `/admin/crear-producto`      | Alta de producto |
| `/admin/editar-producto/:id` | Edición de producto |

Las rutas de administración no tienen autenticación.

## Despliegue

Desplegar primero el backend, porque el front necesita su URL.

### Backend en Render

1. Crear el servicio desde el Blueprint `render.yaml` o como **Web Service** con
   Root Directory `backend`, Build Command `npm ci` y Start Command `npm start`.
2. Cargar `MONGO_URI` y `CORS_ORIGIN` con la URL del front.
3. Para cargar el catálogo, correr `npm run seed` una vez desde tu máquina con
   la `MONGO_URI` de producción.

### Frontend en Vercel o Netlify

Crear el proyecto con Root Directory (o Base directory) `client`, comando
`npm run build` y carpeta de salida `dist`. Definir `VITE_API_URL` con la URL de
Render **antes** de compilar, porque Vite la incorpora en el build.

`client/vercel.json` y `client/public/_redirects` hacen que las rutas del front
funcionen al recargar la página en Vercel y Netlify respectivamente.

### URLs de producción

- **Frontend (Vercel):** https://muebleria-jota-zeta.vercel.app
- **Backend (Render):** https://muebleria-jota-api-5c7k.onrender.com/api/productos

El backend usa el plan gratuito de Render: después de un rato sin uso, la primera
petición puede demorar 50 segundos o más.

## Estructura del proyecto

```
.
├── render.yaml                # Blueprint de Render
├── backend/
│   ├── app.js                 # Express, conexión a MongoDB y manejo de errores
│   ├── mi-logger.js           # middleware que loguea método y ruta
│   ├── models/Product.js      # esquema y modelo de Mongoose
│   ├── routes/productos.js    # CRUD de /api/productos
│   ├── seed.js                # carga del catálogo inicial
│   └── data/catalogo.js       # datos usados por el seed
└── client/
    ├── public/                # logo, imágenes y redirecciones de Netlify
    ├── vercel.json            # redirecciones de Vercel
    └── src/
        ├── App.jsx            # rutas, catálogo y carrito
        ├── servicios/api.js   # peticiones a la API
        ├── utils/formato.js   # formato de precios e imagen por defecto
        ├── styles/base.css    # variables, reset, botones y layout compartido
        ├── componentes/       # Navbar, Footer, ProductList, ProductCard,
        │                      # ContactForm, Carrito, EstadoCarga
        └── pages/             # Inicio, Catalogo, ProductDetail, Contacto,
                               # CrearProducto (alta y edición)
```
