document.addEventListener("DOMContentLoaded", () => {
  // 1. Obtener el ID desde la query string (?id=X)
  const parametros = new URLSearchParams(window.location.search);
  const id = Number(parametros.get("id"));

  // 2. Localizar el objeto en el catálogo
  const item = productos.find((p) => p.id === id);

  // 3. Manejo de error si no existe o la URL no trae ID
  if (!item) {
    const seccion = document.querySelector(".detalle-producto");
    if (seccion) {
      seccion.innerHTML = "<p>El producto solicitado no existe o no fue seleccionado.</p>";
    }
    return;
  }

  
  const titulo = document.getElementById("producto-titulo");
  const precio = document.getElementById("producto-precio");
  const descripcion = document.getElementById("producto-descripcion");
  const imagen = document.getElementById("producto-imagen");

  titulo.textContent = item.nombre;
  precio.textContent = `$${item.precio.toLocaleString("es-AR")}`;
  descripcion.textContent = item.descripcion;

  imagen.src = item.imagen;
  imagen.alt = item.nombre;

  // 5. Renderizado dinámico de la lista (creación de nodos DOM)
  const listaSpecs = document.getElementById("producto-especificaciones");
  listaSpecs.innerHTML = ""; // Limpiar contenido previo

  if (item.especificaciones) {
    Object.entries(item.especificaciones).forEach(([clave, valor]) => {
      // Crear elemento <li>
      const li = document.createElement("li");

      // Crear y configurar etiqueta fuerte <strong>
      const strong = document.createElement("strong");
      strong.textContent = `${clave.charAt(0).toUpperCase() + clave.slice(1)}: `;

      // Crear nodo de texto con el valor
      const textoValor = document.createTextNode(valor);

      // Ensamblar la estructura en el DOM
      li.appendChild(strong);
      li.appendChild(textoValor);
      listaSpecs.appendChild(li);
    });
  }
});