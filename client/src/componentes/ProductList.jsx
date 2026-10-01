import productos from "../data/catalogo";
import ProductCard from "./ProductCard";

function ProductList({ onAgregar }) {
  return (
    <section className="catalogo">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAgregar={onAgregar}
        />
      ))}
    </section>
  );
}

export default ProductList;
