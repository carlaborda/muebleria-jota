import { useState } from "react";
import ProductList from "../componentes/ProductList";

function Catalogo({ productos, ...estadoCatalogo }) {
  const [busqueda, setBusqueda] = useState("");

  const termino = busqueda.trim().toLowerCase();
  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino)
  );

  return (
    <div className="contenedor seccion">
      <div className="seccion__encabezado">
        <h1 className="titulo-seccion">Nuestros productos</h1>
        <label className="buscador">
          <span className="visualmente-oculto">Buscar productos</span>
          <input
            type="search"
            placeholder="Buscar por nombre o material..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>

      <ProductList productos={filtrados} {...estadoCatalogo} />
    </div>
  );
}

export default Catalogo;
