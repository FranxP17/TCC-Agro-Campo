document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.idUser) {
    window.location.href = "inicio_sesion.html";
    return;
  }

  // Rellenar formulario
  document.getElementById("profile-name").value = user.nombreUser || "";
  document.getElementById("profile-email").value = user.emailUser || "";
  document.getElementById("profile-username").value = user.username || "";

  document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("profile-name").value;
    const email = document.getElementById("profile-email").value;
    const username = document.getElementById("profile-username").value;
    const password = document.getElementById("profile-password").value;

    // Debug: muestra los valores enviados
    console.log({ nombre, email, username, password });

    const res = await fetch(`/api/user/${user.idUser}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, username, password }),
    });

    if (res.ok) {
      user.nombreUser = nombre;
      user.emailUser = email;
      user.username = username;
      localStorage.setItem("user", JSON.stringify(user));
      document.getElementById("profile-message").textContent =
        "Datos actualizados correctamente";
    } else {
      document.getElementById("profile-message").textContent =
        "Error al actualizar";
    }
  });

  // Eliminar cuenta
  document.getElementById("delete-account").addEventListener("click", async () => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    )
      return;
    const res = await fetch(`/api/user/${user.idUser}`, { method: "DELETE" });
    if (res.ok) {
      localStorage.clear();
      window.location.href = "inicio_sesion.html";
    } else {
      document.getElementById("profile-message").textContent =
        "Error al eliminar la cuenta";
    }
  });
});