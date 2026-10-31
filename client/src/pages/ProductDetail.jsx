import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EstadoCarga from "../componentes/EstadoCarga";
import { eliminarProducto, obtenerProducto } from "../servicios/api";
import { formatearClave, formatearPrecio, imagenDe } from "../utils/formato";
import "./ProductDetail.css";

function ProductDetail({ onAgregar, onVolver, onEliminado }) {
  const { id: productoId } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);

  // GET /api/productos/:id cada vez que cambia el producto seleccionado
  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true);
    setError(null);
    setCantidad(1);
    setAgregado(false);

    obtenerProducto(productoId, controlador.signal)
      .then((datos) => setProducto(datos))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    return () => controlador.abort();
  }, [productoId]);

  // El aviso de "agregado" desaparece solo a los pocos segundos
  useEffect(() => {
    if (!agregado) return;
    const timer = setTimeout(() => setAgregado(false), 2500);
    return () => clearTimeout(timer);
  }, [agregado]);

  function manejarAgregar() {
    onAgregar(producto, cantidad);
    setAgregado(true);
  }

  async function manejarEliminar() {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;

    setEliminando(true);
    setErrorEliminar(null);

    try {
      await eliminarProducto(producto.id);
      onEliminado(producto.id);
      navigate("/productos");
    } catch (err) {
      setErrorEliminar(err.message);
      setEliminando(false);
    }
  }

  if (cargando) {
    return (
      <div className="contenedor seccion">
        <EstadoCarga tipo="cargando" mensaje="Cargando producto..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="contenedor seccion">
        <EstadoCarga tipo="error" mensaje={error} />
        <button className="boton boton--link detalle__volver" onClick={onVolver}>
          ← Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="contenedor seccion">
      <button className="boton boton--link detalle__volver" onClick={onVolver}>
        ← Volver al catálogo
      </button>

      <article className="detalle">
        <div className="detalle__imagen">
          <img src={imagenDe(producto)} alt={producto.nombre} />
        </div>

        <div className="detalle__info">
          <h1 className="detalle__nombre">{producto.nombre}</h1>
          <p className="detalle__precio">{formatearPrecio(producto.precio)}</p>
          <p className="detalle__descripcion">{producto.descripcion}</p>
          <p className="detalle__stock">Stock disponible: {producto.stock ?? 0}</p>

          {producto.especificaciones && (
            <dl className="detalle__specs">
              {Object.entries(producto.especificaciones).map(([clave, valor]) => (
                <div key={clave}>
                  <dt>{formatearClave(clave)}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="detalle__compra">
            <div className="cantidad" aria-label="Cantidad">
              <button onClick={() => setCantidad((c) => Math.max(1, c - 1))} aria-label="Restar uno">−</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad((c) => c + 1)} aria-label="Sumar uno">+</button>
            </div>
            <button className="boton boton--principal boton--grande" onClick={manejarAgregar}>
              Añadir al carrito
            </button>
          </div>

          <p className={`detalle__aviso ${agregado ? "detalle__aviso--visible" : ""}`} role="status">
            {agregado && "✓ Agregado al carrito"}
          </p>

          <div className="detalle__admin">
            <Link to={`/admin/editar-producto/${producto.id}`} className="boton boton--secundario">
              Editar
            </Link>
            <button className="boton boton--link" onClick={manejarEliminar} disabled={eliminando}>
              {eliminando ? "Eliminando..." : "Eliminar"}
            </button>
          </div>

          {errorEliminar && <EstadoCarga tipo="error" mensaje={errorEliminar} />}
        </div>
      </article>
    </div>
  );
}

export default ProductDetail;
