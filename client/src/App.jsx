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
import RegistroUsuario from "./pages/RegistroUsuario";
import Login from "./pages/Login";
import ProtectedRoute from "./componentes/ProtectedRoute";
import { useCart } from "./context/CartContext";

function App() {
 
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { quitar, actualizarProducto } = useCart();

  // Catálogo traído del backend (GET /api/productos)
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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

  function manejarGuardado(producto) {
    cargarProductos();
    actualizarProducto?.(producto);
  }

  function manejarEliminado(id) {
    cargarProductos();
    quitar(id);
  }

  const estadoCatalogo = {
    productos,
    cargando,
    error,
    onReintentar: () => cargarProductos(),
  };

  return (
    <div className="app">
      <Navbar />
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Inicio {...estadoCatalogo} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistroUsuario />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos" element={<Catalogo {...estadoCatalogo} />} />
          <Route path="/carrito" element={<Carrito  onSeguirComprando={() => navigate("/productos")} />} />

          {/* Rutas dinámicas y de administración */}

          <Route path="/productos/:id" element={<ProductDetail onVolver={() => navigate("/productos")} onEliminado={manejarEliminado} />} />

          {/* Rutas protegidas*/}
         <Route path="/admin/crear-producto" element={<ProtectedRoute soloAdmin> <CrearProducto onGuardado={manejarGuardado} /> </ProtectedRoute>}/>
         <Route path="/admin/editar-producto/:id" element={<ProtectedRoute soloAdmin> <CrearProducto onGuardado={manejarGuardado} /> </ProtectedRoute>}/>


         <Route path="*" element={<div className="contenedor seccion"><EstadoCarga tipo="vacio" mensaje="Página no encontrada." /></div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
