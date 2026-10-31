import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
import ProductDetail from "./pages/ProductDetail";
import Carrito from "./componentes/Carrito";
import EstadoCarga from "./componentes/EstadoCarga";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import CrearProducto from "./pages/CrearProducto";
import { obtenerProductos } from "./servicios/api";

function App() {
 
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Catálogo traído del backend (GET /api/productos)
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Carrito: [{ producto, cantidad }]
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    // Los ítems viejos tienen id numérico del catálogo estático y ya no existen en la base
    return guardado
      ? JSON.parse(guardado).filter((item) => typeof item.producto.id === "string")
      : [];
  });

useEffect(() => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}, [carrito]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Mantiene catálogo y carrito al día después de crear o editar un producto
  function manejarGuardado(producto) {
    cargarProductos();
    setCarrito((actual) =>
      actual.map((item) => (item.producto.id === producto.id ? { ...item, producto } : item))
    );
  }

  function manejarEliminado(id) {
    cargarProductos();
    quitarDelCarrito(id);
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
    onAgregar: agregarAlCarrito,
  };

  return (
    <div className="app">
      <Navbar cantidadCarrito={cantidadEnCarrito} />
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Inicio {...estadoCatalogo} />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos" element={<Catalogo {...estadoCatalogo} />} />
          <Route path="/carrito" element={<Carrito items={carrito} onCambiarCantidad={cambiarCantidad} onQuitar={quitarDelCarrito} onVaciar={() => setCarrito([])} onSeguirComprando={() => navigate("/productos")} />} />

          {/* Rutas dinámicas y de administración */}

          <Route path="/productos/:id" element={<ProductDetail onAgregar={agregarAlCarrito} onVolver={() => navigate("/productos")} onEliminado={manejarEliminado} />} />
          <Route path="/admin/crear-producto" element={<CrearProducto onGuardado={manejarGuardado} />} />
          <Route path="/admin/editar-producto/:id" element={<CrearProducto onGuardado={manejarGuardado} />} />
          <Route path="*" element={<div className="contenedor seccion"><EstadoCarga tipo="vacio" mensaje="Página no encontrada." /></div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
