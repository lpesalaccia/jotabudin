// --- Carrito Offcanvas en tienda ---
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
          <img src='${getImagenRuta(item.imagen)}' class='img-fluid rounded-start' style='width:60px; height:60px; object-fit:cover; border-radius:8px; margin:10px;'>
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
  // Total
  const totalDiv = document.createElement("div");
  totalDiv.className = "mt-2 mb-2";
  totalDiv.innerHTML = `<strong>Total: $${suma}</strong>`;
  lista.appendChild(totalDiv);

  // Configurar botón de acción según estado del carrito
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

// Evento para mostrar el carrito en el offcanvas
document.addEventListener("DOMContentLoaded", () => {
  const offcanvasCarrito = document.getElementById("offcanvasCarrito");
  if (offcanvasCarrito) {
    offcanvasCarrito.addEventListener("show.bs.offcanvas", mostrarCarritoOffcanvas);
  }
});

// -------------------------------------------------- Búsqueda simple en tienda --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos-tienda");
  if (!productosContainer) return; // solo funciona en la página de tienda

  const searchForm = document.querySelector('nav.navbar form[role="search"]');
  const searchInput = searchForm ? searchForm.querySelector('input[type="search"]') : null;

  // Guardar el orden original de las tarjetas
  const tarjetasOriginales = Array.from(productosContainer.children);

  function buscarProductos(textoBusqueda) {
    // Si no hay texto, mostrar todos los productos en orden original
    if (!textoBusqueda || textoBusqueda.trim() === "") {
      tarjetasOriginales.forEach(tarjeta => productosContainer.appendChild(tarjeta));
      return;
    }

    // Convertir texto a minúsculas para comparar
    const texto = textoBusqueda.toLowerCase().trim();
    const tarjetas = Array.from(productosContainer.children);
    
    // Array para guardar las tarjetas con su puntuación
    const tarjetasConPuntuacion = [];

    tarjetas.forEach(tarjeta => {
      // Obtener el nombre del producto desde el título de la tarjeta
      const titulo = tarjeta.querySelector('.card-title');
      const nombreProducto = titulo ? titulo.textContent.toLowerCase() : "";
      
      let puntuacion = 0;
      
      // Si el nombre contiene el texto buscado, dar puntos
      if (nombreProducto.includes(texto)) {
        puntuacion = 100; // Muchos puntos si contiene el texto
        
        // Bonus si empieza con el texto buscado
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

// Carrito de compras completo y persistente en localStorage ---------------------------------------------------------------------------------------------------------

function getImagenRuta(imagen) {
  return '/assets/' + imagen;
}

const productosTienda = [
  { id: 1, nombre: "Alfajores de almendras (6 unidades)", precio: 8000, imagen: "./assets/alfajores-almendras.jpg" },
  { id: 2, nombre: "Budín marmolado", precio: 17000, imagen: "./assets/budin-marmolado.jpg" },
  { id: 3, nombre: "Budín de banana", precio: 18000, imagen: "./assets/budin-banana.jpg" },
  { id: 4, nombre: "Budín de limoncillo", precio: 20000, imagen: "./assets/budin-limoncillo.jpg" },
  { id: 5, nombre: "Budín de hamburgues", precio: 22000, imagen: "./assets/budin-hamburgues.jpg" },
  { id: 6, nombre: "Budín de zanahoria", precio: 22000, imagen: "./assets/budin-zanahoria.jpg" },
  { id: 7, nombre: "Cookie (cualquier sabor)", precio: 4000, imagen: "./assets/cookie.jpg" },
  { id: 8, nombre: "Brownie", precio: 28000, imagen: "./assets/brownie.jpg" },
  { id: 9, nombre: "Sablée de almendras", precio: 30000, imagen: "./assets/sablee-almendras.jpg" },
  { id: 10, nombre: "Rogel", precio: 20000, imagen: "./assets/rogel.jpg" },
  { id: 11, nombre: "Caja de petit fours", precio: 24000, imagen: "./assets/petit-fours.jpg" },
  { id: 12, nombre: "Caja mini alfajores (36 unidades)", precio: 25000, imagen: "./assets/mini-alfajores.jpg" },
  { id: 13, nombre: "Caja mini budines", precio: 20000, imagen: "./assets/mini-budines.jpg" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// function agregarAlCarrito(id) {
//   const producto = productosTienda.find(p => p.id == id);
//   if (!producto) return;
//   const item = carrito.find(p => p.id == id);
//   if (item) {
//     item.cantidad++;
//   } else {
//     carrito.push({ ...producto, cantidad: 1 });
//   }
//   guardarCarrito();
//   mostrarCarrito();
//   actualizarContadorCarrito();
// }

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
  const descuento = document.getElementById("descuento");
  if (!lista) return;
  lista.innerHTML = "";
  let suma = 0;
  let envioValor = 0;
  let descuentoValor = 0;
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
          <img src='${getImagenRuta(item.imagen)}' class='img-fluid rounded-start' style='width:80px; height:80px; object-fit:cover; border-radius:8px; margin:12px;'>
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
  descuentoValor = suma > 5000 ? Math.round(suma * 0.1) : 0;
  if (total) total.textContent = suma - descuentoValor + envioValor;
  if (envio) envio.textContent = envioValor;
  if (descuento) descuento.textContent = descuentoValor;
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
    // pathname como /54911...
    const path = url.pathname || "";
    const digits = sanitizePhoneNumber(path);
    return digits;
  } catch (_) {
    return sanitizePhoneNumber(link.getAttribute('href'));
  }
}

function construirMensajeWhatsapp() {
  let lineas = [];
  lineas.push("Hola Juana! 👋");
  lineas.push("Quisiera hacer un pedido con estos productos:");
  lineas.push("");

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    lineas.push(`- ${item.nombre} x${item.cantidad} = $${subtotal}`);
  });

  lineas.push("");
  lineas.push(`Total: $${total}`);
  lineas.push("");
  lineas.push("Para la fecha...");

  return lineas.join("\n");
}

// Checkout simulado
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
  if (checkoutBtn) checkoutBtn.addEventListener("click", function () {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    const mensaje = construirMensajeWhatsapp();
    // Tomar href base del HTML y solo agregar ?text=...
    const baseHref = checkoutBtn.getAttribute('href') || 'https://wa.me/5491134567890';
    const url = `${baseHref}${baseHref.includes('?') ? '&' : '?'}text=${encodeURIComponent(mensaje)}`;
    checkoutBtn.setAttribute('href', url);
    // no prevenimos navegación; dejamos que el <a> funcione
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarCarrito);
} else {
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

// Fin menu desplegable -------------------------------------------------------------------------------------------------------------------------