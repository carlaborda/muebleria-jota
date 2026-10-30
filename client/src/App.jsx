import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
import ProductDetail from "./pages/ProductDetail";
import Carrito from "./componentes/Carrito";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import CrearProducto from "./pages/CrearProducto";
import { obtenerProductos } from "./servicios/api";

function App() {
 
  const navigate = useNavigate();

  // Catálogo traído del backend (GET /api/productos)
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Carrito: [{ producto, cantidad }]
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
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

          {/* Rutas dinámicas y de administración */}

          <Route path="/productos/:id" element={<ProductDetail onAgregar={agregarAlCarrito} onVolver={() => navigate("/productos")} />} />
          <Route path="/admin/crear-producto" element={<CrearProducto />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
