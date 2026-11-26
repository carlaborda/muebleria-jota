import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "../componentes/ContactForm.css";

const DATOS_INICIALES = {
  email: "",
  password: ""
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(datos) {
  const errores = {};

  if (!datos.email.trim() || !EMAIL_REGEX.test(datos.email.trim())) {
    errores.email = "Ingresá un correo electrónico válido.";
  }

  if (!datos.password) {
    errores.password = "La contraseña es obligatoria.";
  }

  return errores;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  // Estados: "inicial" | "enviando" | "error"
  const [estado, setEstado] = useState("inicial");
  const [mensajeError, setMensajeError] = useState("");

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormData((actual) => ({ ...actual, [name]: value }));

    if (errores[name]) {
      setErrores((actual) => ({ ...actual, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validar(formData);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEstado("enviando");
    setMensajeError("");

    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      setFormData(DATOS_INICIALES);
      setEstado("inicial");
      navigate(location.state?.desde || "/", { replace: true });
    } catch (err) {
      setErrores(err.detalles ?? {});
      setMensajeError(err.message || "No se pudo iniciar sesión.");
      setEstado("error");
    }
  }

  return (
    <div className="contenedor">
      <h2>Ingresar</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__campo">
          <label htmlFor="email">Correo electrónico *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Ej: usuario@correo.com"
            value={formData.email}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.email)}
          />
          {errores.email && <span className="form__error">{errores.email}</span>}
        </div>

        <div className="form__campo">
          <label htmlFor="password">Contraseña *</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresá tu contraseña"
            value={formData.password}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.password)}
          />
          {errores.password && <span className="form__error">{errores.password}</span>}
        </div>

        <button
          className="boton boton--principal boton--grande"
          type="submit"
          disabled={estado === "enviando"}
        >
          {estado === "enviando" ? "Ingresando..." : "Ingresar"}
        </button>

        {estado === "error" && (
          <p className="form__mensaje form__mensaje--error" role="alert">
            {mensajeError}
          </p>
        )}
      </form>

      <p>
        ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
      </p>
    </div>
  );
}