import { formatearPrecio } from "../utils/formato";
import "./ProductCard.css";

function ProductCard({ producto, onVerDetalle, onAgregar }) {
  return (
    <article className="card">
      <button className="card__imagen" onClick={() => onVerDetalle(producto.id)} aria-label={`Ver ${producto.nombre}`}>
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
      </button>

      <div className="card__cuerpo">
        <h3 className="card__nombre">{producto.nombre}</h3>
        <p className="card__precio">{formatearPrecio(producto.precio)}</p>

        <div className="card__acciones">
          <button className="boton boton--secundario" onClick={() => onVerDetalle(producto.id)}>
            Ver detalle
          </button>
          <button className="boton boton--principal" onClick={() => onAgregar(producto)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
