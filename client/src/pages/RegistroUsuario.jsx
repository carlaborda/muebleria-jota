import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../componentes/ContactForm.css";

const DATOS_INICIALES = {
  username: "",
  email: "",
  password: "",
  confirmarPassword: ""
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(datos) {
  const errores = {};

  if (datos.username.trim().length < 3) {
    errores.username = "El nombre de usuario es obligatorio (mínimo 3 caracteres).";
  }

  if (!datos.email.trim() || !EMAIL_REGEX.test(datos.email.trim())) {
    errores.email = "Ingresá un correo electrónico válido.";
  }

  if (!datos.password || datos.password.length < 6) {
    errores.password = "La contraseña es obligatoria (mínimo 6 caracteres).";
  }

  if (datos.confirmarPassword !== datos.password) {
    errores.confirmarPassword = "Las contraseñas no coinciden.";
  }

  return errores;
}

export default function RegistroUsuario({ onRegistrado }) {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = validar(formData);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEstado("enviando");
    setMensajeError("");

    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    try {
      const response = await fetch("/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al registrar el usuario.");
      }

      const data = await response.json();
      alert(`¡Registro exitoso para ${data.username}!`);

      if (onRegistrado) {
        onRegistrado(data);
      }

      setFormData(DATOS_INICIALES);
      setEstado("inicial");
      navigate("/login");
    } catch (error) {
      setMensajeError(error.message);
      setEstado("error");
      alert(`Error en el registro: ${error.message}`);
    }
  };

  return (
    <div className="contenedor">
      <h2>Registro de usuario</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__campo">
          <label htmlFor="username">Nombre de usuario *</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Ej: luciano_dev"
            value={formData.username}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.username)}
          />
          {errores.username && <span className="form__error">{errores.username}</span>}
        </div>

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
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.password)}
          />
          {errores.password && <span className="form__error">{errores.password}</span>}
        </div>

        <div className="form__campo">
          <label htmlFor="confirmarPassword">Confirmar contraseña *</label>
          <input
            id="confirmarPassword"
            name="confirmarPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repetí la contraseña"
            value={formData.confirmarPassword}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.confirmarPassword)}
          />
          {errores.confirmarPassword && (
            <span className="form__error">{errores.confirmarPassword}</span>
          )}
        </div>

        <button
          className="boton boton--principal boton--grande"
          type="submit"
          disabled={estado === "enviando"}
        >
          {estado === "enviando" ? "Registrando..." : "Crear cuenta"}
        </button>

        {estado === "error" && (
          <p className="form__mensaje form__mensaje--error" role="alert">
            {mensajeError}
          </p>
        )}
      </form>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
      </p>
    </div>
  );
}