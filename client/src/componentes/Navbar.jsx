import "./Navbar.css";
import { Link } from 'react-router-dom';



function Navbar({ cantidadCarrito }) {

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
          <Link to="/productos" className="navbar__enlace" >Productos</Link>
          <Link to="/admin/crear-producto" className="navbar__enlace">Admin</Link>
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
      </div>
    </header>
  );
}

export default Navbar;
