// En desarrollo se usa el proxy de Vite. En producción, VITE_API_URL apunta al backend.
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;
import { obtenerToken } from '../context/AuthContext.jsx';

async function pedir(ruta, opciones = {}) {
  const token = obtenerToken();

  const headers = {
    ...(opciones.headers || {}),
  };

  // Solo agregamos Content-Type si hay body y no es FormData
  if (opciones.body && !(opciones.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('No se pudo conectar con el servidor');
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    const mensajeBackend = cuerpo.error || cuerpo.mensaje || cuerpo.message;
    const error = new Error(
      mensajeBackend || `Error ${respuesta.status} al consultar el servidor`
    );
    error.status = respuesta.status;
    error.detalles = cuerpo.detalles ?? cuerpo.errores ?? cuerpo.errors;
    throw error;
  }

  return respuesta.json();
}

function enviar(ruta, method, datos) {
  return pedir(ruta, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
}

// GET /api/productos
export function obtenerProductos(signal) {
  return pedir('/productos', { signal });
}

// GET /api/productos/:id
export function obtenerProducto(id, signal) {
  return pedir(`/productos/${id}`, { signal });
}

// POST /api/productos
export function crearProducto(datos) {
  return enviar('/productos', 'POST', datos);
}

// PUT /api/productos/:id
export function actualizarProducto(id, datos) {
  return enviar(`/productos/${id}`, 'PUT', datos);
}

// DELETE /api/productos/:id
export function eliminarProducto(id) {
  return pedir(`/productos/${id}`, { method: 'DELETE' });
}


// POST /api/usuarios/login 
export function iniciarSesion(credenciales) {
  return enviar('/usuarios/login', 'POST', credenciales);
}

// POST /api/usuarios/register 
export function registrarUsuario(datosUsuario) {
  return enviar('/usuarios/register', 'POST', datosUsuario);
}