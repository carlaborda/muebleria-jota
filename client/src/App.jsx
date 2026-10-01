import { useCallback, useEffect, useState } from "react";
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
import ProductDetail from "./componentes/ProductDetail";
import Carrito from "./componentes/Carrito";
import Inicio from "./vistas/Inicio";
import Catalogo from "./vistas/Catalogo";
import Contacto from "./vistas/Contacto";
import { obtenerProductos } from "./servicios/api";

function App() {
  // Navegación simple por estado: "inicio" | "productos" | "detalle" | "contacto" | "carrito"
  const [vista, setVista] = useState("inicio");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Catálogo traído del backend (GET /api/productos)
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Carrito: [{ producto, cantidad }]
  const [carrito, setCarrito] = useState([]);

  const cargarProductos = useCallback((signal) => {
    setCargando(true);
    setError(null);

    obtenerProductos(signal)
      .then((datos) => setProductos(datos))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!signal?.aborted) setCargando(false);
      });
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    cargarProductos(controlador.signal);
    return () => controlador.abort();
  }, [cargarProductos]);

  function navegar(nuevaVista) {
    setVista(nuevaVista);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function verDetalle(id) {
    setProductoSeleccionado(id);
    navegar("detalle");
  }

  function agregarAlCarrito(producto, cantidad = 1) {
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

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return quitarDelCarrito(id);
    setCarrito((actual) =>
      actual.map((item) => (item.producto.id === id ? { ...item, cantidad } : item))
    );
  }

  function quitarDelCarrito(id) {
    setCarrito((actual) => actual.filter((item) => item.producto.id !== id));
  }

  const cantidadEnCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

  const estadoCatalogo = {
    productos,
    cargando,
    error,
    onReintentar: () => cargarProductos(),
    onVerDetalle: verDetalle,
    onAgregar: agregarAlCarrito,
  };

  return (
    <div className="app">
      <Navbar vistaActual={vista} onNavegar={navegar} cantidadCarrito={cantidadEnCarrito} />

      <main className="app-main">
        {vista === "inicio" && <Inicio {...estadoCatalogo} onNavegar={navegar} />}
        {vista === "productos" && <Catalogo {...estadoCatalogo} />}
        {vista === "detalle" && (
          <ProductDetail
            productoId={productoSeleccionado}
            onAgregar={agregarAlCarrito}
            onVolver={() => navegar("productos")}
          />
        )}
        {vista === "contacto" && <Contacto />}
        {vista === "carrito" && (
          <Carrito
            items={carrito}
            onCambiarCantidad={cambiarCantidad}
            onQuitar={quitarDelCarrito}
            onVaciar={() => setCarrito([])}
            onSeguirComprando={() => navegar("productos")}
          />
        )}
      </main>

      <Footer onNavegar={navegar} />
    </div>
  );
}

export default App;
