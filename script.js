// --- carrito offcanvas en tienda ------------------------------------------------------------------------------------------
function mostrarCarritoOffcanvas() {
  const lista = document.getElementById("carrito-offcanvas-lista");
  if (!lista) return;
  lista.innerHTML = "";
  let suma = 0;
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr";
  grid.style.gap = "16px";
  grid.style.justifyItems = "center";
  carrito.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card mb-2";
    card.style.maxWidth = "400px";
    card.style.width = "100%";
    card.style.boxShadow = "0 2px 8px #0001";
    card.style.borderRadius = "12px";
    card.innerHTML = `
      <div class="row g-0 align-items-center">
        <div class="col-auto">
          <img src='${item.imagen}' class='img-fluid rounded-start' style='width:60px; height:60px; object-fit:cover; border-radius:8px; margin:10px;'>
        </div>
        <div class="col">
          <div class="card-body" style="padding:10px 8px;">
            <h5 class="card-title" style="font-size:1rem; font-weight:600; margin-bottom:4px;">${item.nombre}</h5>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <button onclick='cambiarCantidad(${index}, -1)' class='btn btn-sm btn-outline-secondary'>-</button>
              <span style='font-weight:bold;'>${item.cantidad}</span>
              <button onclick='cambiarCantidad(${index}, 1)' class='btn btn-sm btn-outline-secondary'>+</button>
              <button onclick='eliminarProducto(${index})' class='btn btn-sm btn-link' title='Eliminar'><span class="material-symbols-outlined" style="color:#c00; font-size:22px; vertical-align:middle;">delete</span></button>
            </div>
            <div style="font-size:1.1rem; font-weight:bold;">$${item.precio * item.cantidad}</div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
    suma += item.precio * item.cantidad;
  });
  lista.appendChild(grid);
  // total
  const totalDiv = document.createElement("div");
  totalDiv.className = "mt-2 mb-2";
  totalDiv.innerHTML = `<strong>Total: $${suma}</strong>`;
  lista.appendChild(totalDiv);

  // configurar boton de accion segun estado del carrito
  const cerrarPagoBtn = document.getElementById("cerrar-pago-btn");
  if (cerrarPagoBtn) {
    if (carrito.length === 0) {
      cerrarPagoBtn.textContent = "Agregar productos";
      cerrarPagoBtn.onclick = function () {
        window.location.href = "./tienda.html";
      };
    } else {
      cerrarPagoBtn.textContent = "Cerrar pago";
      cerrarPagoBtn.onclick = function () {
        window.location.href = "./carrito.html";
      };
    }
  }
}

// evento para mostrar el carrito en el offcanvas
document.addEventListener("DOMContentLoaded", () => {
  const offcanvasCarrito = document.getElementById("offcanvasCarrito");
  if (offcanvasCarrito) {
    offcanvasCarrito.addEventListener("show.bs.offcanvas", mostrarCarritoOffcanvas);
  }
});

// -------------------------------------------------- busqueda en tienda --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos-tienda");
  if (!productosContainer) return; // solo funciona en la pagina de tienda

  const searchForm = document.querySelector('nav.navbar form[role="search"]');
  const searchInput = searchForm ? searchForm.querySelector('input[type="search"]') : null;

  // guardar el orden original de las tarjetas
  const tarjetasOriginales = Array.from(productosContainer.children);

  function buscarProductos(textoBusqueda) {
    // si no hay texto, mostrar todos los productos en orden original
    if (!textoBusqueda || textoBusqueda.trim() === "") {
      tarjetasOriginales.forEach(tarjeta => productosContainer.appendChild(tarjeta));
      return;
    }

    // convertir texto a minusculas para comparar
    const texto = textoBusqueda.toLowerCase().trim();
    const tarjetas = Array.from(productosContainer.children);
    
    // array para guardar las tarjetas con su puntuacion
    const tarjetasConPuntuacion = [];

    tarjetas.forEach(tarjeta => {
      // obtener el nombre del producto desde el titulo de la tarjeta
      const titulo = tarjeta.querySelector('.card-title');
      const nombreProducto = titulo ? titulo.textContent.toLowerCase() : "";
      
      let puntuacion = 0;
      
      // si el nombre contiene el texto buscado, dar puntos
      if (nombreProducto.includes(texto)) {
        puntuacion = 100; // Muchos puntos si contiene el texto
        
        // bonus si empieza con el texto buscado
        if (nombreProducto.startsWith(texto)) {
          puntuacion += 50;
        }
      }
      
      // Guardar la tarjeta con su puntuación
      tarjetasConPuntuacion.push({
        tarjeta: tarjeta,
        puntuacion: puntuacion
      });
    });

    // Ordenar por puntuación (mayor puntuación primero)
    tarjetasConPuntuacion.sort((a, b) => b.puntuacion - a.puntuacion);

    // Limpiar el contenedor
    productosContainer.innerHTML = "";

    // Agregar las tarjetas en el nuevo orden
    tarjetasConPuntuacion.forEach(item => {
      productosContainer.appendChild(item.tarjeta);
    });
  }

  // Cuando se envía el formulario de búsqueda
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar que la página se recargue
      buscarProductos(searchInput.value);
    });
  }
});

// carrito de compras persistente en localstorage ---------------------------------------------------------------------------------------------------------


const productosTienda = [
  { id: 1, nombre: "Alfajores de almendras (6 unidades)", precio: 8000, imagen: getImagePath("alfajores-almendras.jpg") },
  { id: 2, nombre: "Budín marmolado", precio: 17000, imagen: getImagePath("budin-marmolado.jpg") },
  { id: 3, nombre: "Budín de banana", precio: 18000, imagen: getImagePath("budin-banana.jpg") },
  { id: 4, nombre: "Budín de limoncillo", precio: 20000, imagen: getImagePath("budin-limoncillo.jpg") },
  { id: 5, nombre: "Budín de hamburgues", precio: 22000, imagen: getImagePath("budin-hamburgues.jpg") },
  { id: 6, nombre: "Budín de zanahoria", precio: 22000, imagen: getImagePath("budin-zanahoria.jpg") },
  { id: 7, nombre: "Cookie (cualquier sabor)", precio: 4000, imagen: getImagePath("cookie.jpg") },
  { id: 8, nombre: "Brownie", precio: 28000, imagen: getImagePath("brownie.jpg") },
  { id: 9, nombre: "Sablée de almendras", precio: 30000, imagen: getImagePath("sablee-almendras.jpg") },
  { id: 10, nombre: "Rogel", precio: 20000, imagen: getImagePath("rogel.jpg") },
  { id: 11, nombre: "Caja de petit fours", precio: 24000, imagen: getImagePath("petit-fours.jpg") },
  { id: 12, nombre: "Caja mini alfajores (36 unidades)", precio: 25000, imagen: getImagePath("mini-alfajores.jpg") },
  { id: 13, nombre: "Caja mini budines", precio: 20000, imagen: getImagePath("mini-budines.jpg") }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// funcion para detectar la ruta correcta segun la ubicacion actual
function getImagePath(imageName) {
  // Si estamos en la carpeta sections/, necesitamos ir un nivel arriba
  if (window.location.pathname.includes('/sections/')) {
    return `../assets/img/${imageName}`;
  }
  // Si estamos en la raíz, usamos la ruta relativa normal
  return `./assets/img/${imageName}`;
}


function agregarAlCarrito(id) {
  // Buscar solo productos que existen en la tienda
  const producto = productosTienda.find(p => p.id == id);

  // Si no existe en productosTienda, se cancela
  if (!producto) {
    console.warn("Intento de agregar producto no válido:", id);
    return;
  }

  // Si existe, agregamos normalmente
  const item = carrito.find(p => p.id == id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  mostrarCarrito();
  mostrarCarritoOffcanvas(); // importante para actualizar el carrito lateral
  actualizarContadorCarrito();
  
  // Abrir el offcanvas automáticamente después de agregar
  const offcanvasCarrito = document.getElementById("offcanvasCarrito");
  if (offcanvasCarrito) {
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasCarrito);
    bsOffcanvas.show();
  }
}


function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total");
  const envio = document.getElementById("envio");
  if (!lista) return;
  lista.innerHTML = "";
  let suma = 0;
  let envioValor = 0;
  // Grid de cards estilo ejemplo
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr";
  grid.style.gap = "24px";
  grid.style.justifyItems = "center";
  carrito.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.style.maxWidth = "500px";
    card.style.width = "100%";
    card.style.boxShadow = "0 2px 8px #0001";
    card.style.borderRadius = "12px";
    card.innerHTML = `
      <div class="row g-0 align-items-center">
        <div class="col-auto">
          <img src='${item.imagen}' class='img-fluid rounded-start' style='width:80px; height:80px; object-fit:cover; border-radius:8px; margin:12px;'>
        </div>
        <div class="col">
          <div class="card-body" style="padding:12px 8px;">
            <h5 class="card-title" style="font-size:1rem; font-weight:600; margin-bottom:4px;">${item.nombre}</h5>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <button onclick='cambiarCantidad(${index}, -1)' class='btn btn-sm btn-outline-secondary'>-</button>
              <span style='font-weight:bold;'>${item.cantidad}</span>
              <button onclick='cambiarCantidad(${index}, 1)' class='btn btn-sm btn-outline-secondary'>+</button>
              <button onclick='eliminarProducto(${index})' class='btn btn-sm btn-link' title='Eliminar'><span class="material-symbols-outlined" style="color:#c00; font-size:22px; vertical-align:middle;">delete</span></button>
            </div>
            <div style="font-size:1.1rem; font-weight:bold;">$${item.precio * item.cantidad}</div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
    suma += item.precio * item.cantidad;
  });
  lista.appendChild(grid);
  envioValor = suma > 0 ? (suma > 4000 ? 0 : 500) : 0;
  if (total) total.textContent = suma + envioValor;
  if (envio) envio.textContent = envioValor;
}

window.cambiarCantidad = function (index, delta) {
  if (carrito[index]) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    guardarCarrito();
    mostrarCarrito();
    // Actualiza también el offcanvas si está abierto
    mostrarCarritoOffcanvas();
    actualizarContadorCarrito();
  }
}

window.eliminarProducto = function (index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
  // Actualiza también el offcanvas si está abierto
  mostrarCarritoOffcanvas();
  actualizarContadorCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  actualizarContadorCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  if (contador) {
    let total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.textContent = total;
    
    // Mostrar u ocultar el contador según si hay items
    if (total > 0) {
      contador.style.display = "flex";
    } else {
      contador.style.display = "none";
    }
  }
}

// --- mensaje de compra realizada en whatsapp ---------------------------------------------------------------------------------------------------------

function sanitizePhoneNumber(raw) {
  if (!raw) return "";
  return String(raw).replace(/[^0-9]/g, "");
}

function getWhatsappNumberFromFooter() {
  // Busca el primer enlace de wa.me y toma el número
  const link = document.querySelector('a[href^="https://wa.me/"]');
  if (!link) return "";
  try {
    const url = new URL(link.href);
    // pathname tiene el número
    const path = url.pathname || "";
    const digits = sanitizePhoneNumber(path);
    return digits;
  } catch (_) {
    return sanitizePhoneNumber(link.getAttribute('href'));
  }
}

function construirMensajeWhatsapp() {
  let lineas = [];
  lineas.push("Hola Juana!");
  lineas.push("Quisiera hacer un pedido con estos productos:");
  lineas.push("");

  let subtotal = 0;
  carrito.forEach(item => {
    const itemSubtotal = item.precio * item.cantidad;
    subtotal += itemSubtotal;
    lineas.push(`- ${item.nombre} x${item.cantidad} = $${itemSubtotal}`);
  });

  const envio = subtotal > 0 ? (subtotal > 4000 ? 0 : 500) : 0;
  const total = subtotal + envio;

  lineas.push("");
  lineas.push(`Subtotal: $${subtotal}`);
  if (envio > 0) {
    lineas.push(`Envío: $${envio}`);
  } else {
    lineas.push(`Envío: Gratis`);
  }
  lineas.push(`Total: $${total}`);
  lineas.push("");
  lineas.push("Para la fecha...");

  const mensaje = lineas.join("\n");
  console.log("Mensaje construido:", mensaje);
  return mensaje;
}

// --- checkout ---------------------------------------------------------------------------------
function inicializarCarrito() {
  carrito = carrito.filter(p => productosTienda.some(pt => pt.id === p.id));
  guardarCarrito();
  mostrarCarrito();
  actualizarContadorCarrito();
  document.querySelectorAll(".agregar-carrito").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      agregarAlCarrito(this.dataset.id);
    });
  });
  const vaciarBtn = document.getElementById("vaciarCarrito");
  if (vaciarBtn) vaciarBtn.addEventListener("click", vaciarCarrito);
  const checkoutBtn = document.getElementById("checkout");
  if (checkoutBtn) {
    console.log("Botón checkout encontrado:", checkoutBtn);
    checkoutBtn.addEventListener("click", function (e) {
      console.log("Click en checkout, carrito:", carrito);
      
      if (carrito.length === 0) {
        e.preventDefault();
        alert("El carrito está vacío.");
        return;
      }
      
      // Construir el mensaje con los productos del carrito
      const mensaje = construirMensajeWhatsapp();
      
      // Tomar el href base del botón y agregar el mensaje
      const baseHref = checkoutBtn.getAttribute('href') || 'https://wa.me/5492983409498';
      const url = `${baseHref}${baseHref.includes('?') ? '&' : '?'}text=${encodeURIComponent(mensaje)}`;
      
      console.log("URL final:", url);
      
      // Actualizar el href del enlace antes de que navegue
      checkoutBtn.setAttribute('href', url);
      
      // Dejar que el enlace navegue naturalmente (no preventDefault)
    });
  } else {
    console.log("Botón checkout no encontrado");
  }
}

// inicializar contador del carrito en todas las paginas
function inicializarContadorCarrito() {
  // cargar carrito del localstorage
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  // actualizar contador visual
  actualizarContadorCarrito();
}

// ejecutar en todas las paginas
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    inicializarContadorCarrito();
    inicializarCarrito();
  });
} else {
  inicializarContadorCarrito();
  inicializarCarrito();
}

// fin carrito ---------------------------------------------------------------------------------------------------------



// menu desplegable ---------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.querySelector(".menu-container");
  const menuIcon = document.querySelector(".menu-icon");

  // Mostrar / ocultar menú al hacer clic en el icono
  menuIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita que se cierre inmediatamente
    menuContainer.classList.toggle("active");
  });

  // Cerrar el menú si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (!menuContainer.contains(e.target)) {
      menuContainer.classList.remove("active");
    }
  });

  // Evitar que clics dentro del menú cierren el menú
  const dropdown = document.querySelector(".dropdown");
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

});

// fin menu desplegable -------------------------------------------------------------------------------------------------------------------------

// scroll to top ---------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop");
  
  if (scrollToTopBtn) {
    // Mostrar/ocultar el botón según el scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) { // Aparece después de 300px de scroll
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    });

    // Funcionalidad de scroll al hacer click
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});

// fin scroll to top -------------------------------------------------------------------------------------------------------------------------