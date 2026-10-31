// En desarrollo se usa el proxy de Vite. En producción, VITE_API_URL apunta al backend.
const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

async function pedir(ruta, opciones) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('No se pudo conectar con el servidor');
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    const error = new Error(cuerpo.error || `Error ${respuesta.status} al consultar el servidor`);
    error.detalles = cuerpo.detalles;
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
