import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EstadoCarga from "./EstadoCarga";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatearPrecio, imagenDe } from "../utils/formato";
import "./Carrito.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function Carrito({ onSeguirComprando }) {
  const navigate = useNavigate();
  const { usuario, token } = useAuth();
  const { carrito, vaciar, total, cambiarCantidad, quitar } = useCart();

  const [enviando, setEnviando] = useState(false);
  const [errorCompra, setErrorCompra] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  async function manejarFinalizarCompra() {
    setErrorCompra(null);
    setConfirmacion(null);

    if (!usuario || !token) {
      navigate("/login", { state: { from: "/carrito" } });
      return;
    }

    if (carrito.length === 0) return;

    setEnviando(true);
    try {
      const res = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: carrito.map(({ producto, cantidad }) => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "No se pudo procesar la compra.");
      }

      vaciar();
      setConfirmacion(`Compra realizada con éxito (ref: ${data.pedido?.id || "ok"}).`);
    } catch (err) {
      setErrorCompra(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor seccion">
      <h1 className="titulo-seccion">Tu carrito</h1>

      {confirmacion && (
        <div className="carrito__aviso" role="status">
          {confirmacion}
        </div>
      )}

      {errorCompra && <EstadoCarga tipo="error" mensaje={errorCompra} />}

      {carrito.length === 0 ? (
        <>
          <EstadoCarga tipo="vacio" mensaje="Todavía no agregaste productos." />
          <button className="boton boton--principal carrito__seguir" onClick={onSeguirComprando}>
            Ver productos
          </button>
        </>
      ) : (
        <div className="carrito">
          <ul className="carrito__lista">
            {carrito.map(({ producto, cantidad }) => (
              <li key={producto.id} className="carrito__item">
                <img src={imagenDe(producto)} alt="" />
                <div className="carrito__info">
                  <h3>{producto.nombre}</h3>
                  <p>{formatearPrecio(producto.precio)} c/u</p>
                </div>
                <div className="cantidad" aria-label={`Cantidad de ${producto.nombre}`}>
                  <button onClick={() => cambiarCantidad(producto.id, cantidad - 1)} aria-label="Restar uno">−</button>
                  <span>{cantidad}</span>
                  <button onClick={() => cambiarCantidad(producto.id, cantidad + 1)} aria-label="Sumar uno">+</button>
                </div>
                <p className="carrito__subtotal">{formatearPrecio(producto.precio * cantidad)}</p>
                <button className="carrito__quitar" onClick={() => quitar(producto.id)} aria-label={`Quitar ${producto.nombre}`}>
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
            <button
              type="button"
              className="boton boton--principal boton--grande"
              onClick={manejarFinalizarCompra}
              disabled={enviando}
            >
              {enviando ? "Procesando..." : "Finalizar compra"}
            </button>
            <button className="boton boton--link" onClick={onSeguirComprando}>
              Seguir comprando
            </button>
            <button className="boton boton--link" onClick={vaciar}>
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Carrito;