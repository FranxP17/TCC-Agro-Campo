document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const emailInput = document.getElementById('email');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    // Mostrar contenedor con animación
    const passwordContainer = document.querySelector('.password-container');
    setTimeout(() => {
        passwordContainer.classList.add('show');
    }, 100);
    
    // Validar email al enviar el formulario
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validación simple de email
        if (!email || !isValidEmail(email)) {
            alert('Por favor ingresa un correo electrónico válido');
            return;
        }
        
        // Simular envío del correo (en una aplicación real harías una petición AJAX aquí)
        console.log('Solicitud de recuperación enviada a:', email);
        
        // Mostrar modal de éxito
        successModal.classList.add('show');
        
        // Resetear formulario
        passwordForm.reset();
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', function() {
        successModal.classList.remove('show');
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });
    
    // Función para validar email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});