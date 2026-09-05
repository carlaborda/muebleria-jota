const contactForm = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');

const showFormMessage = (message, type) => {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
};

// Simula el tiempo de respuesta de un servidor sin enviar datos fuera
// del navegador. El sitio se mantiene completamente del lado del cliente.
const simularEnvio = () => new Promise((resolve) => {
  setTimeout(resolve, 800);
});

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
      await simularEnvio();
      showFormMessage(`Gracias ${nombre}. Tu consulta fue enviada con éxito.`, 'success');
      contactForm.reset();
    } catch (error) {
      showFormMessage('No pudimos enviar tu consulta. Intentá nuevamente.', 'error');
      console.error('Error al simular el envío:', error);
    } finally {
      submitButton.disabled = false;
    }
  });
}
