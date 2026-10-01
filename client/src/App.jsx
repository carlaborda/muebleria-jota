import { useState } from "react";
import Navbar from "./componentes/Navbar";
import ProductList from "./componentes/ProductList";

function App() {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(producto) {
    setCarrito([...carrito, producto]);
  }

  return (
    <>
      <Navbar cantidad={carrito.length} />
      <main>
        <h2 className="subtitulo">Nuestros productos</h2>
        <ProductList onAgregar={agregarAlCarrito} />
      </main>
    </>
  );
}

export default App;
