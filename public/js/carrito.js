document.addEventListener("DOMContentLoaded", function () {
  // Variables
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartSummary = document.querySelector(".cart-summary");
  const emptyCartHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos desde nuestra tienda</p>
            <a href="index.html" class="btn">Ir a la tienda</a>
        </div>
    `;

  // Mostrar productos en el carrito
  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = emptyCartHTML;
      cartSummary.style.display = "none";
      return;
    }

    cartSummary.style.display = "block";
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p class="item-price">$${item.price.toFixed(2)}/kg</p>
                        <div class="item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${
                              item.quantity
                            }" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn-remove"><i class="fas fa-trash"></i> Eliminar</button>
                        <p class="item-total">$${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;

      cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    // Actualizar resumen
    const shipping = subtotal > 50 ? 0 : 2.0; // Envío gratis para compras mayores a $50
    const total = subtotal + shipping;

    document.querySelector(".summary-details").innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Envío:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;

    // Asignar eventos a los botones
    assignCartEvents();
  }

  // Asignar eventos a los elementos del carrito
  function assignCartEvents() {
    // Botones de cantidad
    document.querySelectorAll(".quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const itemElement = this.closest(".cart-item");
        const itemId = itemElement.getAttribute("data-id");
        const input = itemElement.querySelector(".quantity-input");
        let quantity = parseInt(input.value);

        if (this.classList.contains("minus")) {
          if (quantity > 1) {
            quantity--;
          }
        } else if (this.classList.contains("plus")) {
          quantity++;
        }

        input.value = quantity;
        updateCartItem(itemId, quantity);
      });
    });

    // Input de cantidad manual
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", function () {
        const itemElement = this.closest(".cart-item");
        const itemId = itemElement.getAttribute("data-id");
        let quantity = parseInt(this.value);

        if (quantity < 1) {
          quantity = 1;
          this.value = 0;
        }

        updateCartItem(itemId, quantity);
      });
    });

    // Botones de eliminar
    document.querySelectorAll(".btn-remove").forEach((button) => {
      button.addEventListener("click", function () {
        const itemElement = this.closest(".cart-item");
        const itemId = itemElement.getAttribute("data-id");
        removeCartItem(itemId);
      });
    });
  }

  // Actualizar cantidad de un producto en el carrito
  function updateCartItem(productId, quantity) {
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  }

  // Eliminar producto del carrito
  function removeCartItem(productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  // Actualizar contador del carrito en el header
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach((element) => {
      element.textContent = totalItems;
    });
  }

  // Procesar pago
  const checkoutBtn = document.querySelector(".btn-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }
      window.location.href = "../html/method_pago.html";
    });
  }

  // Manejar compra directa (si viene de un botón "Comprar ahora")
  const urlParams = new URLSearchParams(window.location.search);
  const buyNowId = urlParams.get("buyNow");

  if (buyNowId) {
    // Limpiar carrito y añadir solo el producto de compra directa
    const productToBuy = cart.find((item) => item.id === buyNowId);

    if (productToBuy) {
      cart = [
        {
          id: productToBuy.id,
          name: productToBuy.name,
          price: productToBuy.price,
          img: productToBuy.img,
          quantity: 1,
        },
      ];

      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }

  // Inicializar carrito
  renderCart();
});

window.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('showInvoice') === 'true') {
    document.querySelector('.invoice-container').style.display = 'block';

    // Datos de la factura
    const invoiceData = JSON.parse(localStorage.getItem('invoiceData'));
    if (invoiceData && invoiceData.cart && invoiceData.cart.length > 0) {
      // Fecha y número de orden
      document.getElementById('invoice-date').textContent = "Fecha: " + new Date().toLocaleDateString();
      document.getElementById('invoice-order-number').textContent = Math.floor(Math.random() * 90000 + 10000);

      // Cliente (puedes personalizar si tienes usuario)
      const user = localStorage.getItem('username');
      document.getElementById('invoice-client').textContent = user ? user : "Consumidor Final";

      // Productos
      let rows = '';
      invoiceData.cart.forEach(item => {
        rows += `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `;
      });
      document.getElementById('invoice-products').innerHTML = rows;

      // Totales
      document.getElementById('invoice-subtotal').textContent = `$${invoiceData.subtotal.toFixed(2)}`;
      document.getElementById('invoice-shipping').textContent = `$${invoiceData.shipping.toFixed(2)}`;
      document.getElementById('invoice-total').textContent = `$${invoiceData.total.toFixed(2)}`;
    }

    // Limpia la bandera para que no se muestre siempre
    localStorage.removeItem('showInvoice');
  } else {
    document.querySelector('.invoice-container').style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const printBtn = document.getElementById('print-invoice');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      const invoice = document.querySelector('.invoice-container');
      if (invoice) {
        const opt = {
          margin:       0.2,
          filename:     'Factura_AgroCampo.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(invoice).save();
      }
    });
  }
});

