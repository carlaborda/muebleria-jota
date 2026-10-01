import EstadoCarga from "./EstadoCarga";
import { formatearPrecio } from "../utils/formato";
import "./Carrito.css";

function Carrito({ items, onCambiarCantidad, onQuitar, onVaciar, onSeguirComprando }) {
  const total = items.reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0);

  return (
    <div className="contenedor seccion">
      <h1 className="titulo-seccion">Tu carrito</h1>

      {items.length === 0 ? (
        <>
          <EstadoCarga tipo="vacio" mensaje="Todavía no agregaste productos." />
          <button className="boton boton--principal carrito__seguir" onClick={onSeguirComprando}>
            Ver productos
          </button>
        </>
      ) : (
        <div className="carrito">
          <ul className="carrito__lista">
            {items.map(({ producto, cantidad }) => (
              <li key={producto.id} className="carrito__item">
                <img src={producto.imagen} alt="" />
                <div className="carrito__info">
                  <h3>{producto.nombre}</h3>
                  <p>{formatearPrecio(producto.precio)} c/u</p>
                </div>
                <div className="cantidad" aria-label={`Cantidad de ${producto.nombre}`}>
                  <button onClick={() => onCambiarCantidad(producto.id, cantidad - 1)} aria-label="Restar uno">−</button>
                  <span>{cantidad}</span>
                  <button onClick={() => onCambiarCantidad(producto.id, cantidad + 1)} aria-label="Sumar uno">+</button>
                </div>
                <p className="carrito__subtotal">{formatearPrecio(producto.precio * cantidad)}</p>
                <button className="carrito__quitar" onClick={() => onQuitar(producto.id)} aria-label={`Quitar ${producto.nombre}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>

          <aside className="carrito__resumen">
            <div className="carrito__total">
              <span>Total</span>
              <strong>{formatearPrecio(total)}</strong>
            </div>
            <button className="boton boton--principal boton--grande" onClick={onSeguirComprando}>
              Seguir comprando
            </button>
            <button className="boton boton--link" onClick={onVaciar}>
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Carrito;
