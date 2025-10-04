// Inicializador Web3 Opcional para Quantum Wallet
class Web3Initializer {
    static initialized = false;

    // Inicializar Web3 de forma completamente opcional
    static async initialize() {
        if (this.initialized) {
            console.log('✅ Web3 ya inicializado');
            return true;
        }

        try {
            console.log('🔗 Inicializando Web3 (opcional)...');

            // Inicializar componente Web3
            if (typeof Web3WalletComponent !== 'undefined') {
                await Web3WalletComponent.initialize();
                console.log('✅ Web3WalletComponent inicializado');
            }

            // Agregar botón Web3 opcional a la pantalla de login
            this.addWeb3ButtonToLogin();

            this.initialized = true;
            console.log('✅ Web3 inicializado correctamente (opcional)');

            return true;

        } catch (error) {
            console.error('❌ Error inicializando Web3:', error);
            return false;
        }
    }

    // Agregar botón Web3 opcional a la pantalla de login
    static addWeb3ButtonToLogin() {
        // Esperar a que la pantalla de login esté completamente cargada
        const checkLoginScreen = () => {
            const loginScreen = document.getElementById('loginScreen');
            if (loginScreen && loginScreen.style.display !== 'none') {
                // Agregar botón Web3 opcional
                Web3WalletComponent.addWeb3Button();
            } else {
                // Reintentar después de un breve delay
                setTimeout(checkLoginScreen, 500);
            }
        };

        // Iniciar chequeo
        setTimeout(checkLoginScreen, 100);
    }

    // Verificar si MetaMask está disponible
    static isMetaMaskAvailable() {
        return typeof window.ethereum !== 'undefined';
    }

    // Obtener estado del sistema Web3
    static getStatus() {
        return {
            initialized: this.initialized,
            metaMaskAvailable: this.isMetaMaskAvailable(),
            web3WalletComponent: typeof Web3WalletComponent !== 'undefined',
            connected: Web3WalletComponent?.isConnected() || false,
            currentAccount: Web3WalletComponent?.getCurrentAccount() || null
        };
    }
}

// Inicializar Web3 automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    // Delay para asegurar que todos los componentes estén cargados
    setTimeout(async () => {
        try {
            await Web3Initializer.initialize();

            const status = Web3Initializer.getStatus();
            console.log('🔗 Estado Web3:', status);

            if (status.metaMaskAvailable) {
                console.log('🦊 MetaMask detectado - Web3 opcional disponible');
            } else {
                console.log('ℹ️ MetaMask no detectado - instala para usar Web3');
            }

        } catch (error) {
            console.error('❌ Error en inicialización Web3:', error);
        }
    }, 200);
});

// Hacer disponible globalmente
window.Web3Initializer = Web3Initializer;
