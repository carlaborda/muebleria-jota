const contenedorCatalogo = document.getElementById('catalogo-productos');
const inputBusqueda = document.getElementById('input-busqueda');


// Petición al endpoint del servidor
async function obtenerProductosAsync() {
  const respuesta = await fetch('/api/productos');
  if (!respuesta.ok) throw new Error('Error al cargar productos');
  return await respuesta.json();
}

// Función de renderizado en el DOM
function renderizarProductos(lista) {
  if (!contenedorCatalogo) return;
  contenedorCatalogo.innerHTML = '';

  if (lista.length === 0) {
    contenedorCatalogo.innerHTML = `
      <p class="sin-resultados">No se encontraron productos que coincidan con la búsqueda.</p>
    `;
    return;
  }

  lista.forEach((producto) => {
    const article = document.createElement('article');
    article.className = 'producto-card';

    article.innerHTML = `
      <div class="producto-card-visual">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="producto-card-body">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <span class="precio">$${producto.precio.toLocaleString('es-AR')}</span>
        <div class="producto-card-acciones">
          <a href="producto.html?id=${producto.id}" class="btn-ver-producto">Ver producto</a>
          <button type="button" class="btn-agregar-catalogo" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </div>
    `;

    contenedorCatalogo.appendChild(article);
  });
}

// Delegación de eventos: un solo listener cubre las tarjetas que se
// vuelven a renderizar en cada búsqueda (el contenedor no se recrea).
if (contenedorCatalogo) {
  contenedorCatalogo.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-agregar-catalogo');
    if (!boton) return;
    agregarAlCarrito(Number(boton.dataset.id), 1);
  });
}

// Variable para almacenar los productos una vez cargados
let productosCargados = [];

// Consumo asíncrono con async/await
async function inicializarCatalogo() {
  const contenedorCatalogo = document.getElementById('catalogo-productos');

  // Estado de carga inicial en la interfaz
  if (contenedorCatalogo) {
    contenedorCatalogo.innerHTML = '<p class="cargando">Cargando catálogo de muebles...</p>';
  }

  try {
    // Espera la resolución asíncrona
    productosCargados = await obtenerProductosAsync();
    renderizarProductos(productosCargados);
  } catch (error) {
    if (contenedorCatalogo) {
      contenedorCatalogo.innerHTML = '<p class="error">Hubo un error al cargar el catálogo.</p>';
    }
  }
}

// Ejecución inicial
inicializarCatalogo();


// Función para limpiar mayúsculas, comas y puntos
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/[,.]/g, '') 
    .trim();
}

// Filtrado en tiempo real al tipear
if (inputBusqueda) {
  inputBusqueda.addEventListener('input', (e) => {
    const termino = normalizarTexto(e.target.value);

    if (!termino) {
      renderizarProductos(productosCargados);
      return;
    }

    const productosFiltrados = productosCargados.filter((producto) => {
      const nombreLimpio = normalizarTexto(producto.nombre);
      const descripcionLimpia = normalizarTexto(producto.descripcion);

      return nombreLimpio.includes(termino) || descripcionLimpia.includes(termino);
    });

    renderizarProductos(productosFiltrados);
  });
}