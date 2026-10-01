import ProductCard from "./ProductCard";
import EstadoCarga from "./EstadoCarga";
import "./ProductList.css";

function ProductList({ productos, cargando, error, onReintentar, onVerDetalle, onAgregar }) {
  if (cargando) {
    return <EstadoCarga tipo="cargando" mensaje="Cargando productos..." />;
  }

  if (error) {
    return (
      <EstadoCarga
        tipo="error"
        mensaje={`No pudimos cargar los productos: ${error}`}
        onReintentar={onReintentar}
      />
    );
  }

  if (productos.length === 0) {
    return <EstadoCarga tipo="vacio" mensaje="No encontramos productos." />;
  }

  return (
    <section className="lista-productos">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onVerDetalle={onVerDetalle}
          onAgregar={onAgregar}
        />
      ))}
    </section>
  );
}

export default ProductList;
