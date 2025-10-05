// Componente de Login
class LoginComponent {
    static async login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('🔐 Intentando login con:', email);

        try {
            const response = await QuantumAPI.login(email, password);
            console.log('📡 Respuesta del servidor:', response);

            if (response.success) {
                console.log('✅ Login exitoso, cambiando a dashboard');
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('appContainer').style.display = 'block';

                // Cargar la primera pestaña del dashboard
                if (typeof app !== 'undefined' && app.loadTab) {
                    await app.loadTab('home');
                }

                Helpers.showNotification('Sesión iniciada correctamente');
            } else {
                console.error('❌ Error de login:', response.error);
                Helpers.showNotification('Error: ' + response.error, 'error');
            }
        } catch (error) {
            console.error('💥 Error en login:', error);
            Helpers.showNotification('Error de conexión. Verifica la consola.', 'error');
        }
    }

    static logout() {
        QuantumDB.logout();
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
        Helpers.showNotification('Sesión cerrada');
    }
}
