import { useState } from "react";
import "./ContactForm.css";

const FORMSPREE_URL = "https://formspree.io/f/mqpklkej";
const DATOS_INICIALES = { nombre: "", email: "", mensaje: "" };
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(datos) {
  const errores = {};
  if (datos.nombre.trim().length < 2) errores.nombre = "Ingresá tu nombre.";
  if (!EMAIL_VALIDO.test(datos.email.trim())) errores.email = "Ingresá un email válido.";
  if (datos.mensaje.trim().length < 10) errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  return errores;
}

function ContactForm() {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  // "inicial" | "enviando" | "exito" | "error"
  const [estado, setEstado] = useState("inicial");

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
    // Si el campo tenía un error, lo limpiamos mientras el usuario corrige
    if (errores[name]) setErrores((actual) => ({ ...actual, [name]: undefined }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEstado("enviando");
    try {
      const respuesta = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(datos),
      });
      if (!respuesta.ok) throw new Error("Respuesta no válida");

      setEstado("exito");
      setDatos(DATOS_INICIALES);
    } catch {
      setEstado("error");
    }
  }

  return (
    <form className="form" onSubmit={manejarEnvio} noValidate>
      <div className="form__campo">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          value={datos.nombre}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.nombre)}
        />
        {errores.nombre && <span className="form__error">{errores.nombre}</span>}
      </div>

      <div className="form__campo">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tuemail@ejemplo.com"
          autoComplete="email"
          value={datos.email}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.email)}
        />
        {errores.email && <span className="form__error">{errores.email}</span>}
      </div>

      <div className="form__campo">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={6}
          placeholder="Contanos qué necesitás..."
          value={datos.mensaje}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.mensaje)}
        />
        {errores.mensaje && <span className="form__error">{errores.mensaje}</span>}
      </div>

      <button className="boton boton--principal boton--grande" type="submit" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando..." : "Enviar consulta"}
      </button>

      {estado === "exito" && (
        <p className="form__mensaje form__mensaje--exito" role="status">
          ¡Gracias! Recibimos tu consulta y te respondemos a la brevedad.
        </p>
      )}
      {estado === "error" && (
        <p className="form__mensaje form__mensaje--error" role="alert">
          No pudimos enviar el mensaje. Probá de nuevo en unos minutos.
        </p>
      )}
    </form>
  );
}

export default ContactForm;
