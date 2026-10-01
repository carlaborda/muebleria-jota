function Navbar({ cantidad }) {
  return (
    <nav className="navbar">
      <h1>Mueblería Hermanos Jota</h1>
      <span className="carrito">Carrito ({cantidad})</span>
    </nav>
  );
}

export default Navbar;