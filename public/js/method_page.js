let cart = JSON.parse(localStorage.getItem("cart")) || [];
document.querySelectorAll("#user-name").forEach((element, index) => {
  // Mostrar nombre de usuario o "Usuario Anónimo" si no hay nombre
  const user = localStorage.getItem("username");
  element.textContent = `${user || "Usuario"} (${
    cart.length
  } productos en el carrito)`;
});

document.querySelectorAll(".cart-count").forEach((element) => {
  // Actualizar contador del carrito en el header
  element.textContent = cart.length;
});

// Plantillas de formularios para cada método
const forms = {
  "credit-card": `
    <form id="form-credit-card">
      <label for="card-number">Número de Tarjeta:</label>
      <input type="text" id="card-number" maxlength="19" placeholder="1234 5678 9012 3456" required />

      <label for="expiry-date">Fecha de Expiración:</label>
      <input type="text" id="expiry-date" maxlength="5" placeholder="MM/AA" required />

      <label for="cvv">CVV:</label>
      <input type="text" id="cvv" maxlength="4" placeholder="123" required />
    </form>
  `,
  Nequi: `
    <form id="form-nequi">
      <label for="nequi-phone">Número de Teléfono:</label>
      <input type="text" maxlength="10" id="nequi-phone" placeholder="3001234567" required />
      <label for="nequi-password">Código:</label>
      <input type="password" maxlength="6" id="nequi-password" placeholder="Código de Nequi" required />
      <button>Enviar código</button>
      <p>Recibirás un código de verificación en tu número de Nequi.</p>
    </form>
  `,
  "bank-transfer": `
    <form id="form-bank">
      <label for="bank-name">Banco:</label>
      <input type="text" id="bank-name" placeholder="Nombre del banco" required />

      <label for="account-number">Número de Cuenta:</label>
      <input type="text" id="account-number" placeholder="0000000000" required />

      <label for="account-holder">Titular de la Cuenta:</label>
      <input type="text" id="account-holder" placeholder="Nombre completo" required />
    </form>
  `,
};

// Función para mostrar el formulario correspondiente
function showPaymentForm(method) {
  document.getElementById("payment-details").innerHTML = forms[method];
  if (method === "credit-card") {
    // Formateo automático de tarjeta y fecha
    const cardInput = document.getElementById("card-number");
    cardInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "").substring(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
      e.target.value = value;
    });
    const expiryInput = document.getElementById("expiry-date");
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "").substring(0, 4);
      if (value.length > 2)
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      e.target.value = value;
    });
  }
}

// Inicializar con el método por defecto
showPaymentForm("credit-card");

// Cambiar formulario al seleccionar método
document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
  input.addEventListener("change", (e) => {
    showPaymentForm(e.target.value);
  });
});

// Botón volver al carrito
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "../html/carrito.html";
});

// Botón pagar
document.getElementById("pay-btn").addEventListener("click", async (e) => {
  e.preventDefault();
  const selected = document.querySelector(
    'input[name="payment-method"]:checked'
  ).value;
  let valid = false;
  if (selected === "credit-card") {
    const form = document.getElementById("form-credit-card");
    valid = form.checkValidity();
  } else if (selected === "Nequi") {
    const form = document.getElementById("form-nequi");
    valid = form.checkValidity();
  } else if (selected === "bank-transfer") {
    const form = document.getElementById("form-bank");
    valid = form.checkValidity();
  }
  if (valid) {
    alert(
      "¡Pago procesado correctamente con " +
        document.querySelector('input[name="payment-method"]:checked').labels[0]
          .innerText +
        "!"
    );
    // Guardar estado para mostrar factura
    localStorage.setItem("showInvoice", "true");
    // Guardar datos del carrito y totales para la factura
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    const shipping = subtotal > 50 ? 0 : 2.0;
    const total = subtotal + shipping;
    localStorage.setItem(
      "invoiceData",
      JSON.stringify({
        cart,
        subtotal,
        shipping,
        total,
      })
    );

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idUser && cart.length > 0) {
      // Prepara productos para el backend
      const productos = cart.map((item) => ({
        idProducto: item.id,
        cantidad: item.quantity,
        precio: item.price,
      }));
      // Guarda la compra en el backend
      await fetch("/api/compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: user.idUser,
          productos,
          total,
        }),
      });
    }
    window.location.href = "../html/carrito.html"; // Redirigir al carrito
  } else {
    alert("Por favor, complete todos los campos requeridos.");
  }
});
