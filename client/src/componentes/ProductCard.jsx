function ProductCard({ producto, onAgregar }) {
  return (
    <article className="producto-card">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio}</p>
      <button onClick={() => onAgregar(producto)}>Agregar al carrito</button>
    </article>
  );
}

export default ProductCard;
