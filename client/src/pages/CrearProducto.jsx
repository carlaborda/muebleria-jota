// Ruta: /admin/crear-producto (Formulario controlado)
import { useState } from "react";

import "../componentes/ContactForm.css"; 

const API_URL = "/api/productos";
// El modelo exige nombre y precio requeridos, el resto son opcionales[cite: 4]
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

export default function CrearProducto() {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  // Estados: "inicial" | "enviando" | "exito" | "error"
  const [estado, setEstado] = useState("inicial");

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
      // Petición POST para crear un producto
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify(productoAEnviar),
      });

      // El backend debería responder con código 201 al crear
      if (!respuesta.ok && respuesta.status !== 201) {
        throw new Error("Error al crear el producto");
      }

      setEstado("exito");
      setDatos(DATOS_INICIALES); // Limpiar formulario tras el éxito
      
      // Opcional: Volver al estado inicial después de unos segundos
      setTimeout(() => setEstado("inicial"), 4000);
      
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="contenedor">
      <h2>Alta de producto</h2>
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
          {estado === "enviando" ? "Guardando..." : "Crear Producto"}
        </button>

        {estado === "exito" && (
          <p className="form__mensaje form__mensaje--exito" role="status">
            ¡Producto creado correctamente en la base de datos!
          </p>
        )}
        {estado === "error" && (
          <p className="form__mensaje form__mensaje--error" role="alert">
            Hubo un problema al conectar con el servidor. Revisá la consola para más detalles.
          </p>
        )}
      </form>
    </div>
  );
}
