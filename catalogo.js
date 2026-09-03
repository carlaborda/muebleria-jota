const productos = [
  {
    id: 1,
    nombre: "Mesa de Noche Aconcagua",
    descripcion:
      "Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®. Su diseño limpio y funcional permite convivir con diferentes estilos de dormitorio, ofreciendo almacenamiento discreto y elegante para objetos personales.",
    precio: 42000,
    imagen: "img/Mesa-de-Noche-Aconcagua.png",
    especificaciones: {
      medidas: "45 × 35 × 60 cm",
      materiales: "Roble macizo FSC®, herrajes soft-close",
      acabado: "Barniz mate de poliuretano",
      almacenamiento: "1 cajón + repisa inferior",
      caracteristicas: "Cajón con cierre suave"
    }
  },
  {
    id: 2,
    nombre: "Sofá Patagonia",
    descripcion:
      "Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera. Los cojines combinan espuma de alta resiliencia con plumón reciclado, ofreciendo comodidad duradera y sostenible para el hogar moderno.",
    precio: 185000,
    imagen: "img/Sofa-Patagonia.png",
    especificaciones: {
      medidas: "220 × 90 × 80 cm",
      estructura: "Madera de eucalipto certificada FSC®",
      tapizado: "Lino 100% natural premium",
      relleno: "Espuma HR + plumón reciclado",
      sostenibilidad: "Materiales 100% reciclables"
    }
  },
  {
    id: 3,
    nombre: "Mesa Comedor Pampa",
    descripcion:
      "Mesa extensible de roble macizo con tablero biselado y sistema de apertura suave. Su diseño robusto y elegante se adapta perfectamente a reuniones íntimas o grandes celebraciones familiares, extendiéndose de 6 a 10 comensales.",
    precio: 145000,
    imagen: "img/Mesa-Comedor-Pampa.png",
    especificaciones: {
      medidas: "160-240 × 90 × 75 cm",
      materiales: "Roble macizo FSC®, mecanismo alemán",
      acabado: "Aceite-cera natural",
      capacidad: "6-10 comensales",
      extension: "Sistema de mariposa central"
    }
  },
  {
    id: 4,
    nombre: "Sillas Córdoba",
    descripcion:
      "Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular pintada en Sage Green. Su diseño ergonómico y materiales de calidad garantizan comodidad y durabilidad en el uso diario, perfectas para comedores contemporáneos.",
    precio: 98000,
    imagen: "img/Sillas-Cordoba.png",
    especificaciones: {
      medidas: "45 × 52 × 80 cm (cada una)",
      materiales: "Contrachapado nogal, tubo de acero",
      acabado: "Laca mate, pintura epoxi",
      apilables: "Hasta 6 sillas",
      incluye: "Set de 4 sillas"
    }
  },
  {
    id: 5,
    nombre: "Escritorio Costa",
    descripcion:
      "Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado. Ideal para espacios de trabajo en casa, combina funcionalidad moderna con estética minimalista y sostenible, perfecto para el trabajo remoto.",
    precio: 72000,
    imagen: "img/Escritorio-Costa.png",
    especificaciones: {
      medidas: "120 × 60 × 75 cm",
      materiales: "Bambú laminado, herrajes ocultos",
      acabado: "Laca mate resistente",
      almacenamiento: "1 cajón con organizador",
      cables: "Pasacables integrado"
    }
  },
  {
    id: 6,
    nombre: "Silla de Trabajo Belgrano",
    descripcion:
      "Silla ergonómica regulable en altura con respaldo de malla transpirable y asiento tapizado en tejido reciclado. Diseñada para largas jornadas de trabajo con máximo confort y apoyo lumbar, ideal para oficinas en casa y espacios de coworking.",
    precio: 64000,
    imagen: "img/Silla-de-Trabajo-Belgrano.png",
    especificaciones: {
      medidas: "60 × 60 × 90-100 cm",
      materiales: "Malla técnica, tejido reciclado",
      acabado: "Base cromada, tapizado premium",
      regulacion: "Altura + inclinación respaldo",
      certificacion: "Ergonomía europea EN 1335"
    }
  },
  {
    id: 7,
    nombre: "Aparador Uspallata",
    descripcion:
      "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.",
    precio: 210000,
    imagen: "img/Aparador-Uspallata.png",
    especificaciones: {
      medidas: "180 × 45 × 75 cm",
      materiales: "Nogal macizo FSC®, herrajes de latón",
      acabado: "Aceite natural ecológico",
      peso: "68 kg",
      capacidad: "6 compartimentos interiores"
    }
  },
  {
    id: 8,
    nombre: "Biblioteca Recoleta",
    descripcion:
      "Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro. Perfecta para colecciones y objetos de diseño, su diseño versátil se adapta a cualquier espacio contemporáneo con elegancia funcional.",
    precio: 135000,
    imagen: "img/Biblioteca-Recoleta.png",
    especificaciones: {
      medidas: "100 × 35 × 200 cm",
      materiales: "Estructura de acero, estantes de roble",
      acabado: "Laca mate ecológica",
      capacidad: "45 kg por estante",
      modulares: "5 estantes ajustables"
    }
  },
  {
    id: 9,
    nombre: "Butaca Mendoza",
    descripcion:
      "Butaca tapizada en bouclé Dusty Rose con base de madera de guatambú. El respaldo curvo abraza el cuerpo y ofrece máximo confort, mientras que su diseño orgánico aporta calidez y sofisticación a cualquier ambiente contemporáneo.",
    precio: 89000,
    imagen: "img/Butaca-Mendoza.png",
    especificaciones: {
      medidas: "80 × 75 × 85 cm",
      materiales: "Guatambú macizo, tela bouclé",
      acabado: "Cera vegetal, tapizado premium",
      tapizado: "Repelente al agua y manchas",
      confort: "Espuma alta densidad"
    }
  },
  {
    id: 10,
    nombre: "Sillón Copacabana",
    descripcion:
      "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasilera moderna de los 60, combina comodidad excepcional con un diseño icónico que trasciende tendencias y épocas.",
    precio: 165000,
    imagen: "img/Sillon-Copacabana.png",
    especificaciones: {
      medidas: "90 × 85 × 95 cm",
      materiales: "Cuero curtido vegetal, acero pintado",
      acabado: "Cuero anilina premium",
      rotacion: "360° silenciosa y suave",
      garantia: "10 años en estructura"
    }
  },
  {
    id: 11,
    nombre: "Mesa de Centro Araucaria",
    descripcion:
      "Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal. Su diseño minimalista se convierte en el punto focal perfecto para cualquier sala de estar contemporánea, combinando la frialdad del mármol con la calidez de la madera.",
    precio: 115000,
    imagen: "img/Mesa-de-Centro-Araucaria.png",
    especificaciones: {
      medidas: "90 × 90 × 45 cm",
      materiales: "Sobre de mármol Patagonia, patas de nogal",
      acabado: "Mármol pulido, aceite natural en madera",
      peso: "42 kg",
      cargaMaxima: "25 kg distribuidos"
    }
  }
];


const contenedorCatalogo = document.getElementById('catalogo-productos');
const inputBusqueda = document.getElementById('input-busqueda');

// Simulación de una API asíncrona con setTimeout y Promise
function obtenerProductosAsync() {
  return new Promise((resolve) => {
    // Simula una latencia de red de 800 ms
    setTimeout(() => {
      resolve(productos);
    }, 800);
  });
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
        <a href="producto.html?id=${producto.id}" class="btn-ver-producto">Ver producto</a>
      </div>
    `;

    contenedorCatalogo.appendChild(article);
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