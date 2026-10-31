// Rutas: /admin/crear-producto y /admin/editar-producto/:id (Formulario controlado)
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EstadoCarga from "../componentes/EstadoCarga";
import { actualizarProducto, crearProducto, obtenerProducto } from "../servicios/api";

import "../componentes/ContactForm.css";

// El modelo exige nombre y precio requeridos, el resto son opcionales
const DATOS_INICIALES = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagenUrl: ""
};

function validar(datos) {
  const errores = {};

  // Validación de campos requeridos
  if (datos.nombre.trim().length < 2) {
    errores.nombre = "El nombre del producto es obligatorio (mínimo 2 caracteres).";
  }

  if (!datos.precio || isNaN(datos.precio) || Number(datos.precio) <= 0) {
    errores.precio = "El precio es obligatorio y debe ser un número mayor a 0.";
  }

  // Validación de campos opcionales
  if (datos.stock && (isNaN(datos.stock) || Number(datos.stock) < 0)) {
    errores.stock = "El stock debe ser un número válido (0 o mayor).";
  }

  return errores;
}

export default function CrearProducto({ onGuardado }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  // Estados: "inicial" | "cargando" | "error-carga" | "enviando" | "error"
  const [estado, setEstado] = useState(editando ? "cargando" : "inicial");
  const [mensajeError, setMensajeError] = useState("");

  // En edición, GET /api/productos/:id para precargar el formulario
  useEffect(() => {
    setErrores({});
    setMensajeError("");

    if (!id) {
      setDatos(DATOS_INICIALES);
      setEstado("inicial");
      return;
    }

    const controlador = new AbortController();
    setEstado("cargando");

    obtenerProducto(id, controlador.signal)
      .then((producto) => {
        setDatos({
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? "",
          precio: String(producto.precio),
          stock: String(producto.stock ?? ""),
          imagenUrl: producto.imagenUrl ?? "",
        });
        setEstado("inicial");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setMensajeError(err.message);
          setEstado("error-carga");
        }
      });

    return () => controlador.abort();
  }, [id]);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setDatos((actual) => ({ ...actual, [name]: value }));

    if (errores[name]) {
      setErrores((actual) => ({ ...actual, [name]: undefined }));
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEstado("enviando");

    // Formatear los datos para que coincidan con los tipos del modelo (Number y String)
    const productoAEnviar = {
      ...datos,
      precio: Number(datos.precio),
      stock: datos.stock ? Number(datos.stock) : 0
    };

    try {
      const guardado = editando
        ? await actualizarProducto(id, productoAEnviar)
        : await crearProducto(productoAEnviar);

      onGuardado(guardado);
      navigate(`/productos/${guardado.id}`);
    } catch (err) {
      setErrores(err.detalles ?? {});
      setMensajeError(err.message);
      setEstado("error");
    }
  }

  if (estado === "cargando") {
    return (
      <div className="contenedor seccion">
        <EstadoCarga tipo="cargando" mensaje="Cargando producto..." />
      </div>
    );
  }

  if (estado === "error-carga") {
    return (
      <div className="contenedor seccion">
        <EstadoCarga tipo="error" mensaje={mensajeError} />
      </div>
    );
  }

  return (
    <div className="contenedor">
      <h2>{editando ? "Editar producto" : "Alta de producto"}</h2>
      <form className="form" onSubmit={manejarEnvio} noValidate>


        <div className="form__campo">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Ej: Silla de Roble"
            value={datos.nombre}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.nombre)}
          />
          {errores.nombre && <span className="form__error">{errores.nombre}</span>}
        </div>


        <div className="form__campo">
          <label htmlFor="precio">Precio ($) *</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="1"
            placeholder="Ej: 15000"
            value={datos.precio}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.precio)}
          />
          {errores.precio && <span className="form__error">{errores.precio}</span>}
        </div>


        <div className="form__campo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            placeholder="Detalles del mueble..."
            value={datos.descripcion}
            onChange={manejarCambio}
          />
        </div>


        <div className="form__campo">
          <label htmlFor="stock">Stock Disponible</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            placeholder="Ej: 10"
            value={datos.stock}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.stock)}
          />
          {errores.stock && <span className="form__error">{errores.stock}</span>}
        </div>


        <div className="form__campo">
          <label htmlFor="imagenUrl">URL de la Imagen</label>
          <input
            id="imagenUrl"
            name="imagenUrl"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={datos.imagenUrl}
            onChange={manejarCambio}
          />
        </div>

        <button
          className="boton boton--principal boton--grande"
          type="submit"
          disabled={estado === "enviando"}
        >
          {estado === "enviando" ? "Guardando..." : editando ? "Guardar cambios" : "Crear Producto"}
        </button>

        {estado === "error" && (
          <p className="form__mensaje form__mensaje--error" role="alert">
            {mensajeError}
          </p>
        )}
      </form>
    </div>
  );
}
