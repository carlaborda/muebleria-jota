// Carrito de compras compartido por las 4 páginas del sitio.
// Persiste en localStorage para que el contador (#cart-count) del
// header se mantenga al navegar entre index.html, productos.html,
// producto.html y contacto.html.

const CART_STORAGE_KEY = 'hermanosjota:cart';

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(CART_STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : {};
  } catch (error) {
    console.error('No se pudo leer el carrito guardado:', error);
    return {};
  }
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
  } catch (error) {
    console.error('No se pudo guardar el carrito:', error);
  }
}

function contarUnidadesCarrito(carrito) {
  return Object.values(carrito).reduce((total, cantidad) => total + cantidad, 0);
}

// Refleja el total de unidades en todos los #cart-count del header
// (solo hay uno por página, pero querySelectorAll cubre el caso general).
function actualizarContadorCarrito() {
  const total = contarUnidadesCarrito(leerCarrito());
  document.querySelectorAll('#cart-count').forEach((elemento) => {
    elemento.textContent = total;
  });
}

function agregarAlCarrito(id, cantidad = 1) {
  const carrito = leerCarrito();
  carrito[id] = (carrito[id] || 0) + cantidad;
  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);
