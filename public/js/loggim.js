
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if(passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '👁️';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="remember"]').checked;

    if(username.trim() === '' || password.trim() === '') {
        alert('Por favor, completa todos los campos');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username, password, remember })
        });
        const data = await response.json();
        if (response.ok && data.idUser) {
            // Guarda todos los datos necesarios en localStorage
            const user = {
                idUser: data.idUser,
                nombreUser: data.nombreUser,
                emailUser: data.emailUser,
                username: data.username
            };
            localStorage.setItem('user', JSON.stringify(user));
            alert(data.message || 'Inicio de sesión exitoso');
            if (data.username === 'admin') {
                window.location.href = '../html/admin.html';
            } else {
                window.location.href = '../html/index.html';
            }
        } else {
            alert(data.message || 'Usuario o contraseña incorrectos');
        }
    } catch (error) {
        alert('Error al iniciar sesión');
    }
});