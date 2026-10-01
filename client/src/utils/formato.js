const formatoPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  return formatoPesos.format(valor);
}

// "cargaMaxima" -> "Carga maxima"
export function formatearClave(clave) {
  const texto = clave.replace(/([A-Z])/g, ' $1').toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
