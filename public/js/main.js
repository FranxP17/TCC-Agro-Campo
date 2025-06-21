document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelectorAll(".cart-count");

  // Actualizar contador del carrito
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.forEach((element) => {
      element.textContent = totalItems;
    });
  }

  function linkOpen() {
    const links = document.querySelectorAll(".nav-link");

    links.forEach((link) => {
      link.addEventListener("click", function () {
        links.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Manejar clic en botón "Añadir al carrito"
  function setupCartButtons() {
    document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        const productCard = this.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;
        const productPrice = parseFloat(
          productCard
            .querySelector(".product-price")
            .textContent.replace(/[^\d.]/g, "")
        );
        const productImg = productCard.querySelector("img").src;

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find((item) => item.id === productId);

        if (existingItem) {
          existingItem.quantity += 0;
        } else {
          cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            img: productImg,
            quantity: 1,
          });
        }

        // Guardar en localStorage y actualizar contador
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        // Mostrar notificación
        showNotification(`${productName} añadido al carrito`);
      });
    });

    // Manejar clic en botón "Comprar ahora"
    document.querySelectorAll(".btn-buy-now").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        const productCard = this.closest(".product-card");
        const productName = productCard.querySelector("h3").textContent;

        // Redirigir al carrito con parámetro para compra directa
        window.location.href = `carrito.html?buyNow=${productId}`;
      });
    });
  }

  // Función para mostrar notificaciones
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 300);
  }

  // Función para buscar productos
  function searchProducts() {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase()
      .trim();
    const productCards = document.querySelectorAll(".product-card");
    const categorySections = document.querySelectorAll(".category-section");

    let hasResults = false;

    productCards.forEach((card) => {
      const productName = card.querySelector("h3").textContent.toLowerCase();
      const productDescription = card
        .querySelector(".product-description")
        .textContent.toLowerCase();

      if (
        searchTerm === "" ||
        productName.includes(searchTerm) ||
        productDescription.includes(searchTerm)
      ) {
        card.style.display = "block";
        hasResults = true;
      } else {
        card.style.display = "none";
      }
    });

    // Mostrar/ocultar secciones según si tienen resultados
    categorySections.forEach((section) => {
      const visibleProducts = section.querySelectorAll(
        '.product-card[style="display: block"]'
      );
      if (visibleProducts.length > 0 || searchTerm === "") {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });

    // Mostrar mensaje si no hay resultados
    const noResultsMessage = document.getElementById("no-results-message");
    if (!hasResults && searchTerm) {
      if (!noResultsMessage) {
        const message = document.createElement("div");
        message.id = "no-results-message";
        message.className = "no-results";
        message.innerHTML = `<p>No se encontraron productos para "${searchTerm}"</p>`;
        document
          .querySelector("main")
          .insertBefore(message, document.querySelector(".product-section"));
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }

    // Reconfigurar botones del carrito para los productos visibles
    setupCartButtons();
  }

  // Configurar el buscador
  function setupSearch() {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");

    if (searchInput) {
      // Mostrar todos los productos al cargar la página
      searchProducts();

      // Botón para limpiar búsqueda
      const clearButton = document.createElement("button");
      clearButton.innerHTML = '<i class="fa fa-times"></i>';
      clearButton.className = "clear-search";
      clearButton.style.display = "none";
      clearButton.setAttribute("aria-label", "Limpiar búsqueda");
      clearButton.addEventListener("click", function () {
        searchInput.value = "";
        clearButton.style.display = "none";
        searchProducts();
      });

      searchInput.parentNode.appendChild(clearButton);

      // Event listeners
      searchInput.addEventListener("input", function () {
        clearButton.style.display = this.value ? "inline-block" : "none";
        searchProducts();
      });

      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          this.value = "";
          clearButton.style.display = "none";
          searchProducts();
        }
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchProducts();
      });
    }
  }

  // --- PERFIL DE USUARIO EN NAVEGACIÓN CON MENÚ ---
  function mostrarPerfilUsuario() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navUser = document.getElementById("nav-user-profile");
    const navAdmin = document.getElementById("nav-admin-link");
    if (user && navUser) {
      navUser.innerHTML = `
            <div class="user-profile-dropdown">
                <a href="#" class="user-profile">
                    <img src="../img/logo vaca.png" alt="Perfil" class="user-avatar"> 
                    <span>${user.username}</span>
                    <i class="fa fa-caret-down"></i>
                </a>
                <div class="dropdown-content">
                    ${
                      user.username === "admin"
                        ? '<a href="../html/admin.html" id="admin-btn"><i class="fa fa-cogs"></i> Abrir Panel de administración</a>'
                        : ""
                    }
                    <a href="../html/perfil.html"><i class="fa fa-user"></i> Perfil</a>
                    <a href="#" id="logout-btn"><i class="fa fa-sign-out-alt"></i> Cerrar sesión</a>
                </div>
            </div>
        `;
      if (navAdmin && user.username === "admin") {
        navAdmin.style.display = "inline-block";
      } else if (navAdmin) {
        navAdmin.style.display = "none";
      }
      document.getElementById("logout-btn").onclick = function () {
        localStorage.removeItem("user");
        
        window.location.reload();
      };
    } else if (navAdmin) {
      navAdmin.style.display = "none";
    }
  }

  mostrarPerfilUsuario();

  // Cargar productos dinámicamente en el index y en el panel admin
  async function cargarProductosDinamicos() {
    const container = document.getElementById("products-dynamic-container");
    const adminTableBody = document.getElementById("products-table-body");
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      // Mostrar loader mientras carga
      if (container)
        container.innerHTML = '<div class="loader">Cargando productos...</div>';
      if (adminTableBody)
        adminTableBody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';

      const res = await fetch("/admin/productos", { cache: "no-store" });
      const productos = await res.json();
      if (!Array.isArray(productos)) return;
      // Renderizado para el index (agregar sección destacada de productos)
      if (container) {
        let html = '<div class="product-grid">';
        productos.forEach((prod) => {
          html += `
                    <div class="product-card destacado" data-id="${
                      prod.idProducto
                    }">
                    <figure>
                      <img src="${prod.urlImagen}" alt="${
            prod.nombreProducto
          }"/>
                    </figure>
                        <div class="product-info">
                            <h3>${prod.nombreProducto}</h3>
                            <p class="product-description">${
                              prod.descripcion || ""
                            }</p>
                            <p class="product-price">$${prod.precioProducto}</p>
                            <div class="product-actions">
                                <button class="btn-add-to-cart" data-id="${
                                  prod.idProducto
                                }">
                                    <i class="fas fa-cart-plus"></i> Añadir al carrito
                                </button>
                                ${
                                  user && user.username === "admin"
                                    ? `
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                    `;
        });
        html += "</div>";
        container.innerHTML = html;
        setupCartButtons();
        updateCartCount();
        // if (user && user.username === 'admin') setupAdminProductActions();
      }
      // Renderizado para la tabla del admin
      if (adminTableBody) {
        let tableHtml = "";
        productos.forEach((prod) => {
          tableHtml += `
                    <tr>
                        <td>${prod.idProducto}</td>
                        <td>${prod.nombreProducto}</td>
                        <td>${prod.precioProducto}</td>
                        <td><img src="${prod.urlImagen}" alt="${prod.nombreProducto}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;"></td>
                        <td>
                            <button class="btn-edit-product" data-id="${prod.idProducto}">Editar</button>
                            <button class="btn-delete-product" data-id="${prod.idProducto}">Eliminar</button>
                        </td>
                    </tr>
                    `;
        });
        adminTableBody.innerHTML = tableHtml;
        setupAdminProductActions();
      }
    } catch (error) {
      if (container)
        container.innerHTML =
          '<p style="color:red">No se pudieron cargar los productos.</p>';
      if (adminTableBody)
        adminTableBody.innerHTML =
          '<tr><td colspan="5">No se pudieron cargar los productos.</td></tr>';
      console.error("Error al cargar productos:", error);
    }
  }

  // Forzar recarga de productos en ambas páginas al agregar/editar/eliminar
  window.cargarProductosDinamicos = cargarProductosDinamicos;

  function setupAdminProductActions() {
    document.querySelectorAll(".btn-delete-product").forEach((btn) => {
      btn.onclick = async function () {
        if (confirm("¿Seguro que deseas eliminar este producto?")) {
          const id = this.getAttribute("data-id");
          await fetch(`/admin/productos/${id}`, { method: "DELETE" });
          cargarProductosDinamicos();
          if (window.opener && window.opener.cargarProductosDinamicos) {
            window.opener.cargarProductosDinamicos();
          }
        }
      };
    });
    document.querySelectorAll(".btn-edit-product").forEach((btn) => {
      btn.onclick = async function () {
        const id = this.getAttribute("data-id");
        const res = await fetch(`/admin/productos/${id}`);
        const prod = await res.json();
        document.getElementById("product-id").value = prod.idProducto;
        document.getElementById("product-name").value = prod.nombreProducto;
        document.getElementById("product-price").value = prod.precioProducto;
        document.getElementById("product-img").value = prod.urlImagen;
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  }

  // Interceptar el submit del formulario de productos para crear/actualizar desde admin.html o index.html
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const id = document.getElementById("product-id").value;
      const nombre = document.getElementById("product-name").value;
      const precio = document.getElementById("product-price").value;
      const imagenInput = document.getElementById("product-img");
      let imagen = imagenInput.value.trim();
      // Si la imagen no empieza por 'http', 'img/' o '../img/', la ajustamos automáticamente
      // if (
      //   imagen &&
      //   !/^https?:\/\//.test(imagen) &&
      //   !imagen.startsWith("img/") &&
      //   !imagen.startsWith("../img/")
      // ) {
      //   imagen = "img/" + imagen;
      // }
      const method = id ? "PUT" : "POST";
      const url = id ? `/admin/productos/${id}` : "/admin/productos";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, imagen }),
      });
      productForm.reset();
      cargarProductosDinamicos();
      // Si está abierta la otra página, recargar productos también allí
      if (window.opener && window.opener.cargarProductosDinamicos) {
        window.opener.cargarProductosDinamicos();
      }
    });
  }

  function mostrarLoader() {
    setTimeout(() => {
      const container = document.getElementById("products-dynamic-container");
      if (container) {
        container.innerHTML = '<div class="loader">Cargando productos...</div>';
      }
      updateCartCount(); // Actualizar contador al cargar
      linkOpen(); // Configurar enlaces activos
      console.log("Página cargada y contador del carrito actualizado.");
    }, 1000);
  }

  function linkCatalogo() {
  const catalogoLink = document.getElementById('btn_catalogo');
    catalogoLink.addEventListener('click', () => {
        window.location.href = "#catalogo";
    })
  }
  // Mostrar el formulario de productos solo para el admin en el index
  function mostrarFormularioAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));
    const form = document.getElementById("product-form");
    if (form) {
      form.style.display = user && user.username === "admin" ? "flex" : "none";
    }
  }
  mostrarFormularioAdmin();

  document.addEventListener("DOMContentLoaded", cargarProductosDinamicos);
  setupCartButtons(); // Configurar botones del carrito
  setupSearch(); // Configurar buscador
  updateCartCount(); // Actualizar contador del carrito al cargar la página

  // Refrescar productos también al volver a la pestaña o ventana
  window.addEventListener("focus", () => {
    cargarProductosDinamicos();
  });
  linkOpen();
  mostrarLoader(); // Mostrar loader al cargar la páginal
  linkCatalogo();
});


document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (
      link &&
      link.href &&
      !link.href.startsWith('javascript:') &&
      !link.target &&
      !link.hasAttribute('download') &&
      !link.classList.contains('no-loader')
    ) {
      // Solo para enlaces internos o externos que navegan
      e.preventDefault();
      document.getElementById('global-loader').style.display = 'flex';
      setTimeout(() => {
        window.location.href = link.href;
      }, 700); // Puedes ajustar el tiempo si quieres
    }
  });

  // ...existing code...
});
