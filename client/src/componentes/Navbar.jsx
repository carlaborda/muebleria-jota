import "./Navbar.css";
import { startTransition } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";

function Navbar({ cantidadCarrito }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    // React Router aplica la navegación como transición: si limpiamos la sesión aparte,
    // ProtectedRoute alcanza a redirigir a /login. Juntos van directo al inicio.
    startTransition(() => {
      navigate("/", { replace: true });
      logout();
    });
  }

  return (
    <header className="navbar">
      <div className="contenedor navbar__inner">
        <Link to="/" className="navbar__marca" aria-label="Ir a inicio">
          <img src="/logo.svg" alt="" />
          <span>
            <strong>Hermanos</strong> Jota
          </span>
        </Link>

        <nav aria-label="Menú principal" className="navbar__enlaces">
          <Link to="/" className="navbar__enlace">Inicio</Link>
          <Link to="/contacto" className="navbar__enlace">Sobre Nosotros</Link>
          <Link to="/productos" className="navbar__enlace">Productos</Link>
          {usuario && usuario.rol === "admin" && (
            <Link to="/admin/crear-producto" className="navbar__enlace">Admin</Link>
          )}
        </nav>

        <Link
          to="/carrito"
          className="navbar__carrito"
          aria-label={`Ver carrito, ${cantidadCarrito} productos`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className="navbar__carrito-texto">Carrito</span>
          <span className="navbar__contador">{cantidadCarrito}</span>
        </Link>

        {usuario ? (
          <div className="navbar__sesion">
            <span className="navbar__usuario">
              Hola, {usuario.username}
            </span>
            <button
              type="button"
              className="navbar__carrito secundario"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="navbar__sesion">
            <Link to="/login" className="navbar__enlace">
              Login
            </Link>
            <Link to="/register" className="navbar__carrito secundario">
              Registro
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
