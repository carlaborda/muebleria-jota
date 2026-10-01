const API_URL = '/api';

async function pedir(ruta, signal) {
  const respuesta = await fetch(`${API_URL}${ruta}`, { signal });

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new Error(cuerpo.error || `Error ${respuesta.status} al consultar el servidor`);
  }

  return respuesta.json();
}

// GET /api/productos
export function obtenerProductos(signal) {
  return pedir('/productos', signal);
}

// GET /api/productos/:id
export function obtenerProducto(id, signal) {
  return pedir(`/productos/${id}`, signal);
}
