import "./EstadoCarga.css";

// Mensaje reutilizable para los estados de carga, error y lista vacía
function EstadoCarga({ tipo, mensaje, onReintentar }) {
  return (
    <div className={`estado estado--${tipo}`} role={tipo === "error" ? "alert" : "status"}>
      {tipo === "cargando" && <span className="estado__spinner" aria-hidden="true" />}
      <p>{mensaje}</p>
      {onReintentar && (
        <button className="boton boton--secundario" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default EstadoCarga;
