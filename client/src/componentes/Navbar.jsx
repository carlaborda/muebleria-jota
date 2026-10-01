import "./Navbar.css";

const ENLACES = [
  { vista: "inicio", texto: "Inicio" },
  { vista: "productos", texto: "Productos" },
  { vista: "contacto", texto: "Contacto" },
];

function Navbar({ vistaActual, onNavegar, cantidadCarrito }) {
  // El detalle de producto cuenta como parte de "Productos" para resaltar el enlace
  const seccionActiva = vistaActual === "detalle" ? "productos" : vistaActual;

  return (
    <header className="navbar">
      <div className="contenedor navbar__inner">
        <button className="navbar__marca" onClick={() => onNavegar("inicio")} aria-label="Ir a inicio">
          <img src="/logo.svg" alt="" />
          <span>
            <strong>Hermanos</strong> Jota
          </span>
        </button>

        <nav aria-label="Menú principal">
          <ul className="navbar__enlaces">
            {ENLACES.map(({ vista, texto }) => (
              <li key={vista}>
                <button
                  className="navbar__enlace"
                  aria-current={seccionActiva === vista ? "page" : undefined}
                  onClick={() => onNavegar(vista)}
                >
                  {texto}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="navbar__carrito"
          onClick={() => onNavegar("carrito")}
          aria-label={`Ver carrito, ${cantidadCarrito} productos`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className="navbar__carrito-texto">Carrito</span>
          <span className="navbar__contador">{cantidadCarrito}</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
