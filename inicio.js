// Lógica de la página de inicio: carga simulada de productos destacados
// y render dinámico de las tarjetas en el DOM.

const CANTIDAD_DESTACADOS = 4;

// Simula una llamada a un servidor: envuelve un setTimeout en una Promise
// para poder consumirla con async/await más abajo, tal como se haría con
// una llamada real a una API (fetch).
function obtenerProductosDesdeServidor() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos);
    }, 1000);
  });
}

// Formatea un número como precio en pesos argentinos (ej: 150000 -> "$150.000").
function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Construye el nodo <article> de una tarjeta de producto usando
// document.createElement, sin recurrir a innerHTML con datos dinámicos.
function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-producto";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.className = "tarjeta-producto__imagen";
  imagen.loading = "lazy";

  const nombre = document.createElement("h3");
  nombre.className = "tarjeta-producto__nombre";
  nombre.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "tarjeta-producto__precio";
  precio.textContent = formatearPrecio(producto.precio);

  const enlace = document.createElement("a");
  enlace.href = `producto.html?id=${producto.id}`;
  enlace.className = "boton boton--secundario";
  enlace.textContent = "Ver detalle";

  tarjeta.append(imagen, nombre, precio, enlace);
  return tarjeta;
}

// Muestra los productos destacados en #destacados-grid.
// Usa async/await sobre la promesa simulada de arriba y va mostrando
// un estado de carga mientras tanto.
async function mostrarDestacados() {
  const grilla = document.getElementById("destacados-grid");
  grilla.textContent = "Cargando productos...";

  const listaProductos = await obtenerProductosDesdeServidor();
  const destacados = listaProductos.slice(0, CANTIDAD_DESTACADOS);

  grilla.textContent = "";
  destacados.forEach((producto) => {
    grilla.appendChild(crearTarjetaProducto(producto));
  });
}

// Placeholder del carrito: todavía no hay lógica real de compras,
// solo se deja el listener enganchado para no romper la navegación futura.
function configurarCarrito() {
  const carrito = document.querySelector(".carrito");
  carrito.addEventListener("click", (evento) => {
    evento.preventDefault();
    console.log("Carrito próximamente");
  });
}

mostrarDestacados();
configurarCarrito();
