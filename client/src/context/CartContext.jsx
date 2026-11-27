import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

function leerCarritoInicial() {
  try {
    const guardado = localStorage.getItem('carrito');
    if (!guardado || guardado === 'undefined' || guardado === 'null') return [];
    const parsed = JSON.parse(guardado);
    // Conserva el mismo filtro de seguridad para descartar ítems viejos con ID numérico
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item.producto?.id === 'string')
      : [];
  } catch {
    localStorage.removeItem('carrito');
    return [];
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarritoInicial);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  function agregar(producto, cantidad = 1) {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.producto.id === producto.id);
      if (existente) {
        return actual.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...actual, { producto, cantidad }];
    });
  }

  function vaciar() {
    setCarrito([]);
  }

  // Funciones extra opcionales por si las seguís usando en Carrito.jsx o App.jsx:
  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return quitar(id);
    setCarrito((actual) =>
      actual.map((item) => (item.producto.id === id ? { ...item, cantidad } : item))
    );
  }

  function quitar(id) {
    setCarrito((actual) => actual.filter((item) => item.producto.id !== id));
  }

  function actualizarProducto(productoActualizado) {
    setCarrito((actual) =>
      actual.map((item) =>
        item.producto.id === productoActualizado.id
          ? { ...item, producto: productoActualizado }
          : item
      )
    );
  }

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  const total = carrito.reduce(
    (suma, item) => suma + item.producto.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregar,
        vaciar,
        cantidadTotal,
        total,
        cambiarCantidad,
        quitar,
        actualizarProducto,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un CartProvider');
  return ctx;
}