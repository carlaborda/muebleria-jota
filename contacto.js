const catalogoProductos = [
  {
    id: 1,
    nombre: 'Mesa de roble',
    descripcion: 'Mesa de comedor en roble macizo con terminación natural y líneas sobrias.',
    precio: 185000,
  },
  {
    id: 2,
    nombre: 'Silla clásica',
    descripcion: 'Diseño funcional y resistente, ideal para uso cotidiano en cocina o comedor.',
    precio: 32000,
  },
  {
    id: 3,
    nombre: 'Juego de comedor',
    descripcion: 'Conjunto de mesa y sillas en madera de roble con un acabado artesanal.',
    precio: 420000,
  },
  {
    id: 4,
    nombre: 'Estantería modular',
    descripcion: 'Solución elegante y práctica para ordenar libros, objetos y piezas decorativas.',
    precio: 89000,
  },
  {
    id: 5,
    nombre: 'Escritorio de trabajo',
    descripcion: 'Espacio de trabajo pensado para hogares y estudios con estilo atemporal.',
    precio: 120000,
  },
  {
    id: 6,
    nombre: 'Banco de madera',
    descripcion: 'Banco multifuncional para entrada, cocina o living, con estructura sólida.',
    precio: 46000,
  },
];

const cartCountElement = document.querySelector('#cart-count');
const productsGrid = document.querySelector('#products-grid');
const contactForm = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');

let cartCount = 0;

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

const renderProducts = async () => {
  if (!productsGrid) {
    return;
  }

  try {
    productsGrid.innerHTML = '';

    await new Promise((resolve) => setTimeout(resolve, 500));

    catalogoProductos.forEach((producto) => {
      const card = document.createElement('article');
      card.className = 'product-card';

      const initials = producto.nombre
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');

      card.innerHTML = `
        <div class="product-visual" aria-hidden="true">${initials}</div>
        <div class="product-body">
          <span class="product-tag">Madera artesanal</span>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(producto.precio)}</span>
            <button class="add-to-cart" type="button" data-id="${producto.id}">Agregar al carrito</button>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    attachCartEvents();
  } catch (error) {
    productsGrid.innerHTML = '<p class="empty-state">No pudimos cargar los productos destacados.</p>';
    console.error('Error al cargar productos:', error);
  }
};

const attachCartEvents = () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  if (!addToCartButtons.length) {
    return;
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      cartCount += 1;
      cartCountElement.textContent = cartCount;

      const originalText = button.textContent;
      button.textContent = 'Agregado';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 900);
    });
  });
};

const showFormMessage = (message, type) => {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
};

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.querySelector('#nombre').value.trim();
    const email = document.querySelector('#email').value.trim();
    const mensaje = document.querySelector('#mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      showFormMessage('Todos los campos son obligatorios.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showFormMessage('Ingresá un email válido para continuar.', 'error');
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    showFormMessage('Enviando tu consulta...', 'success');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Formspree rechazó el envío');
      }

      showFormMessage(`Gracias ${nombre}. Tu consulta fue enviada con éxito.`, 'success');
      contactForm.reset();
    } catch (error) {
      showFormMessage('No pudimos enviar tu consulta. Intentá nuevamente.', 'error');
      console.error('Error al enviar la consulta:', error);
    } finally {
      submitButton.disabled = false;
    }
  });
}

renderProducts();
