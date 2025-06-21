document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    } else if ((!document.getElementById("terms").checked) && (password.length > 8 || password.length < 20)) {
        alert("Debes aceptar los términos y condiciones");
        return;
    } 

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Ocurrió un error al registrar. Por favor, intenta nuevamente.");
    }
});
