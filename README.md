# Mueblería Hermanos Jota

Aplicación web de una tienda de muebles ficticia. Está formada por:

- un frontend SPA construido con React, React Router y Vite;
- una API REST construida con Node.js, Express y Mongoose;
- MongoDB como base de datos.

## Integrantes

- Almada Alejo Matías
- Luciano Losardo
- Sebastian Paz Friaz
- Marcos Ezequiel Diaz
- Borda Carla

## Arquitectura

```text
Navegador
  -> React Router administra las vistas
  -> Contextos mantienen sesión y carrito
  -> servicios/api.js o fetch realiza las llamadas HTTP
  -> API Express bajo /api
  -> MongoDB mediante Mongoose
```

En desarrollo, Vite recibe las rutas `/api` y las reenvía a
`http://localhost:3000`. En producción se usa `VITE_API_URL` en las llamadas
centralizadas del frontend.

## Tecnologías

- Frontend: React 19, React Router DOM 7, Vite 8.
- Backend: Node.js, Express 5, Mongoose 9.
- Seguridad: bcrypt para contraseñas y JWT para autenticación.
- Base de datos: MongoDB local o MongoDB Atlas.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- Una instancia de MongoDB.
- Las variables `MONGO_URI` y `JWT_SECRET` en el backend.

## Instalación

Instalar las dependencias en las dos aplicaciones:

```bash
cd backend
npm install
```

```bash
cd client
npm install
```

## Variables de entorno

### Backend: `backend/.env`

| Variable | Obligatoria | Uso |
|---|---:|---|
| `MONGO_URI` | Sí | Conexión a MongoDB. La API no inicia sin ella. |
| `JWT_SECRET` | Sí | Firma y verifica los tokens JWT. |
| `PORT` | No | Puerto HTTP. Predeterminado: `3000`. |
| `CORS_ORIGIN` | Producción | Orígenes separados por coma permitidos por CORS. |

Ejemplo local:

```env
MONGO_URI=mongodb://127.0.0.1:27017/muebleria-jota
JWT_SECRET=una_clave_larga_y_secreta
PORT=3000
```

Ejemplo para Atlas:

```text
mongodb+srv://usuario:password@cluster.mongodb.net/muebleria-jota
```

### Frontend: `client/.env`

| Variable | Uso |
|---|---|
| `VITE_API_URL` | URL pública del backend, sin barra final. En desarrollo puede quedar vacía. |

```env
VITE_API_URL=
```

## Ejecución local

Levantar MongoDB y abrir dos terminales:

```bash
cd backend
npm run seed
npm run dev
```

El backend queda disponible en `http://localhost:3000`.

```bash
cd client
npm run dev
```

Vite normalmente queda disponible en `http://localhost:5173`.

`npm run seed` crea las categorías y carga los productos iniciales sin eliminar
datos existentes. Las categorías se crean por nombre y los productos se insertan
solo si todavía no existe uno con el mismo nombre.

## API REST

Todas las rutas se encuentran bajo `/api`.

### Productos

El esquema de producto contiene:

| Campo | Tipo | Obligatorio |
|---|---|---|
| `nombre` | String | Sí |
| `descripcion` | String | No |
| `precio` | Number, mayor o igual a 0 | Sí |
| `stock` | Number, mayor o igual a 0 | No; predeterminado `0` |
| `imagenUrl` | String | No |
| `categoria` | ObjectId de `Categoria` | No |
| `especificaciones` | Map de claves y valores String | No |

| Método | Ruta | Protección | Descripción | Respuesta |
|---|---|---|---|---|
| `GET` | `/api/productos` | Pública | Lista todos los productos. `?categoria=<id>` filtra por categoría. La categoría devuelta incluye su nombre. | `200` |
| `GET` | `/api/productos/:id` | Pública | Devuelve un producto por ID, con categoría poblada. | `200`; `400` ID inválido; `404` no existe |
| `POST` | `/api/productos` | JWT + rol `admin` | Crea un producto. Valida que la categoría exista. | `201`; `400` datos o categoría inválidos |
| `PUT` | `/api/productos/:id` | JWT + rol `admin` | Reemplaza los campos incluidos y ejecuta las validaciones del esquema. | `200`; `400`; `404` |
| `DELETE` | `/api/productos/:id` | JWT + rol `admin` | Elimina un producto y devuelve el eliminado. | `200`; `400`; `404` |

Ejemplo de creación:

```json
{
  "nombre": "Silla de Roble",
  "descripcion": "Silla fabricada con madera maciza.",
  "precio": 15000,
  "stock": 10,
  "imagenUrl": "https://ejemplo.com/silla.jpg",
  "categoria": "6712f0a1c3e9a1b2c3d4e5f6"
}
```

Las respuestas públicas usan `id` como virtual de Mongoose y permiten que el
frontend navegue con rutas como `/productos/:id`.

### Categorías

| Método | Ruta | Protección | Descripción | Respuesta |
|---|---|---|---|---|
| `GET` | `/api/categorias` | Pública | Lista las categorías ordenadas alfabéticamente. | `200` |
| `POST` | `/api/categorias` | Pública en la implementación actual | Crea una categoría. `nombre` es requerido y único. | `201`; `400`; `409` |

### Usuarios

| Método | Ruta | Protección | Descripción | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/usuarios/register` | Pública | Registra un usuario. Recibe `username`, `email` y `password`. | `201`; `400`; `500` |
| `POST` | `/api/usuarios/login` | Pública | Valida credenciales y genera un JWT con duración de una hora. | `200`; `401`; `500` |

El cuerpo de login es:

```json
{
  "email": "usuario@correo.com",
  "password": "clave-secreta"
}
```

La respuesta incluye:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "username": "<usuario>",
    "mail": "<email>",
    "rol": "usuario"
  }
}
```

El rol predeterminado es `usuario`. El modelo admite también `admin`. Las
contraseñas se almacenan hasheadas con bcrypt y no se devuelven en el registro.

### Pedidos

| Método | Ruta | Protección | Descripción | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/pedidos` | JWT | Recibe los items del carrito y crea una respuesta simulada. No persiste el pedido en MongoDB. | `201`; `400`; `401`; `403` |

Ejemplo de cuerpo:

```json
{
  "items": [
    {
      "id": "<id-producto>",
      "nombre": "Silla de Roble",
      "precio": 15000,
      "cantidad": 2
    }
  ]
}
```

La API calcula el total con `precio * cantidad`, identifica al usuario desde el
JWT y devuelve un pedido con ID temporal.

### Encabezados protegidos

Las rutas protegidas esperan:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

Los errores suelen devolver:

```json
{ "error": "Mensaje de error" }
```

Autenticación y registro pueden usar `message` en lugar de `error`. El frontend
normaliza ambos campos en sus servicios de API.

## Lógica del frontend

### Punto de entrada y proveedores

`main.jsx` monta la aplicación dentro de:

1. `BrowserRouter`, que interpreta las rutas del navegador.
2. `AuthProvider`, que administra la sesión.
3. `CartProvider`, que administra el carrito.
4. `App`, que carga el catálogo y renderiza las páginas.

### Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Inicio | Público |
| `/productos` | Catálogo y buscador | Público |
| `/productos/:id` | Detalle del producto | Público |
| `/carrito` | Carrito y simulación de compra | Público; compra requiere login |
| `/contacto` | Información de contacto | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro | Público |
| `/admin/crear-producto` | Alta de producto | JWT y rol `admin` |
| `/admin/editar-producto/:id` | Edición de producto | JWT y rol `admin` |
| `*` | Estado de página no encontrada | Público |

`ProtectedRoute` redirige usuarios no autenticados a `/login` y conserva la ruta
original en el estado de navegación. Si el usuario está autenticado pero no es
administrador, muestra un mensaje de acceso denegado.

### Sesión

`AuthContext` guarda en `localStorage` la sesión completa que devuelve el login:

```text
localStorage["sesion"] = { token, user }
```

El token se lee al realizar peticiones y se agrega automáticamente como header
`Authorization: Bearer <token>`. Cerrar sesión elimina esa clave y limpia el
usuario del contexto.

La protección de las rutas se basa en los datos del usuario conservados en el
contexto. La protección definitiva es la del backend mediante JWT y rol
administrador.

### Catálogo

Al iniciar `App`, se ejecuta `GET /api/productos`. El resultado se comparte con
Inicio y Catálogo mediante props.

- Inicio muestra los primeros cuatro productos como destacados.
- Catálogo filtra localmente por coincidencia en nombre o descripción.
- Los estados de carga, error y reintento se muestran con `EstadoCarga`.
- Un `AbortController` cancela las solicitudes activas al desmontar el
  componente o cambiar el recurso seleccionado.

### Detalle y administración

La página de detalle ejecuta `GET /api/productos/:id` y permite:

- elegir una cantidad;
- agregar el producto al carrito;
- volver al catálogo;
- editar o eliminar cuando el usuario tiene rol `admin`.

El formulario compartido de creación y edición valida nombre, precio y stock en
el navegador. En edición precarga el producto mediante `GET /api/productos/:id`.
Después usa `POST /api/productos` o `PUT /api/productos/:id`.

Los errores enviados por el backend se muestran dentro del formulario.

### Carrito

`CartContext` almacena el carrito en `localStorage`:

```text
localStorage["carrito"] = [{ producto, cantidad }]
```

El contexto ofrece:

- agregar una unidad o una cantidad elegida;
- sumar cantidades si el producto ya existe;
- incrementar o disminuir la cantidad;
- quitar un producto;
- vaciar el carrito;
- calcular la cantidad total y el importe;
- reemplazar el producto almacenado después de una actualización.

Al finalizar la compra:

1. si no hay sesión, se redirige a login;
2. se confirma que haya al menos un producto;
3. se envía `POST /api/pedidos` con el token;
4. ante éxito se vacía el carrito y se muestra la referencia devuelta;
5. ante error se conserva el carrito y se muestra el mensaje.

La compra actual es una simulación: el backend no persiste ni valida contra stock
los pedidos, aunque sí exige un usuario autenticado y un array de items no vacío.

### Comunicación con la API

El frontend calcula la URL base como:

```text
VITE_API_URL || http://localhost:3000
```

`servicios/api.js` centraliza productos y autenticación. Agrega el token de
sesión, serializa cuerpos JSON y transforma errores HTTP en objetos `Error`
con `status` y `detalles`.

El carrito usa directamente `fetch` para `/pedidos`, y el registro usa
directamente `/api/usuarios/register`; ambas rutas pasan por el proxy de Vite
durante el desarrollo.

## Pruebas del contrato

La suite necesita que el backend esté ejecutándose y que MongoDB tenga categorías
cargadas:

```bash
cd backend
npm run seed
npm run dev
```

En otra terminal:

```bash
cd backend
npm test
```

Las pruebas verifican categorías, filtros de productos, detalle poblado y acceso
de administrador. `JWT_SECRET` en las pruebas debe coincidir con el del
servidor.

## Despliegue

### Backend en Render

`render.yaml` configura un Web Service de Node con:

- Root Directory: `backend`
- Build: `npm ci`
- Start: `npm start`
- Health check: `/`

Cargar `MONGO_URI`, `JWT_SECRET` y `CORS_ORIGIN` en el panel de Render. La
variable `CORS_ORIGIN` debe contener la URL exacta del frontend.

Después del primer despliegue se puede ejecutar `npm run seed` localmente usando
la cadena de producción o desde un entorno autorizado.

### Frontend

Para Vercel o Netlify:

- Root/Base directory: `client`
- Comando: `npm run build`
- Directorio de salida: `dist`
- Variable: `VITE_API_URL=<url pública del backend>`

`client/vercel.json` y `client/public/_redirects` mantienen activas las rutas de
React Router al recargar la página.
