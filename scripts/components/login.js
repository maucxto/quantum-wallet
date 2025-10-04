// Componente de Login
class LoginComponent {
    static async login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const response = await QuantumAPI.login(email, password);
        
        if (response.success) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            
            // Inicializar la aplicación
            await app.init();
            
            Helpers.showNotification('Sesión iniciada correctamente');
        } else {
            Helpers.showNotification('Error: ' + response.error, 'error');
        }
    }

    static logout() {
        QuantumDB.logout();
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
        Helpers.showNotification('Sesión cerrada');
    }
}