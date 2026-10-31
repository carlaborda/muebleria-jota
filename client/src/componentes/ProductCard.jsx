import { useNavigate } from "react-router-dom";
import { formatearPrecio, imagenDe } from "../utils/formato";
import "./ProductCard.css";

function ProductCard({ producto, onAgregar }) {
  const navigate = useNavigate();
  const verDetalle = () => navigate(`/productos/${producto.id}`);

  return (
    <article className="card">
      <button className="card__imagen" onClick={verDetalle} aria-label={`Ver ${producto.nombre}`}>
        <img src={imagenDe(producto)} alt={producto.nombre} loading="lazy" />
      </button>

      <div className="card__cuerpo">
        <h3 className="card__nombre">{producto.nombre}</h3>
        <p className="card__precio">{formatearPrecio(producto.precio)}</p>

        <div className="card__acciones">
          <button className="boton boton--secundario" onClick={verDetalle}>
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
