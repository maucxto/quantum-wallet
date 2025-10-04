// Script de inicialización para el sistema de compra de Quantum Wallet
class QuantumBuyInitializer {
    static initialized = false;

    // Inicializar sistema de compra
    static async initialize() {
        if (this.initialized) {
            console.log('✅ Sistema de compra ya inicializado');
            return true;
        }

        try {
            console.log('🚀 Inicializando sistema de compra...');

            // Verificar componentes requeridos
            const requiredComponents = [
                'QuantumBuyComponent',
                'PaymentMethodsComponent',
                'MoonPayIntegration',
                'ThirdwebBuyIntegration'
            ];

            for (const component of requiredComponents) {
                if (typeof window[component] === 'undefined') {
                    console.warn(`⚠️ Componente ${component} no encontrado`);
                    return false;
                }
            }

            // Configurar componentes
            this.setupComponents();

            // Configurar tema por defecto
            this.setupTheme();

            // Configurar listeners globales
            this.setupGlobalListeners();

            this.initialized = true;
            console.log('✅ Sistema de compra inicializado correctamente');

            return true;

        } catch (error) {
            console.error('❌ Error inicializando sistema de compra:', error);
            return false;
        }
    }

    static setupComponents() {
        // Configurar método de pago por defecto
        if (PaymentMethodsComponent) {
            PaymentMethodsComponent.selectedMethod = 'debitCard';
        }

        // Configurar criptomoneda por defecto
        if (QuantumBuyComponent) {
            QuantumBuyComponent.currentCrypto = 'BTC';
        }

        // Configurar ambiente de desarrollo para MoonPay
        if (MoonPayIntegration) {
            try {
                MoonPayIntegration.setEnvironment('development');
            } catch (error) {
                console.log('MoonPay en modo desarrollo simulado');
            }
        }
    }

    static setupTheme() {
        // Aplicar colores de Quantum al sistema de compra
        const quantumTheme = {
            primary: '#2563eb',
            secondary: '#10b981',
            accent: '#f59e0b',
            danger: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981'
        };

        // Aplicar tema a variables CSS
        const root = document.documentElement;
        Object.entries(quantumTheme).forEach(([key, value]) => {
            root.style.setProperty(`--quantum-${key}`, value);
        });
    }

    static setupGlobalListeners() {
        // Listener para tecla Escape en modal de compra
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const buyModal = document.getElementById('quantumBuyModal');
                if (buyModal && buyModal.style.display === 'flex') {
                    QuantumBuyComponent.hideBuyModal();
                }
            }
        });

        // Listener para clicks fuera del modal
        document.addEventListener('click', (e) => {
            const buyModal = document.getElementById('quantumBuyModal');
            if (buyModal && buyModal.style.display === 'flex') {
                if (e.target === buyModal) {
                    QuantumBuyComponent.hideBuyModal();
                }
            }
        });
    }

    // Verificar estado del sistema
    static getStatus() {
        return {
            initialized: this.initialized,
            components: {
                quantumBuy: typeof QuantumBuyComponent !== 'undefined',
                paymentMethods: typeof PaymentMethodsComponent !== 'undefined',
                moonpay: typeof MoonPayIntegration !== 'undefined',
                thirdweb: typeof ThirdwebBuyIntegration !== 'undefined'
            },
            configuration: {
                environment: MoonPayIntegration?.currentConfig?.environment || 'development',
                supportedCryptos: Object.keys(QuantumBuyComponent?.supportedCryptos || {}),
                paymentMethods: PaymentMethodsComponent?.getAvailableMethods().length || 0
            }
        };
    }

    // Reinicializar sistema
    static async reinitialize() {
        this.initialized = false;
        return await this.initialize();
    }
}

// Inicializar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    // Pequeño delay para asegurar que todos los scripts estén cargados
    setTimeout(async () => {
        const success = await QuantumBuyInitializer.initialize();

        if (success) {
            console.log('🎉 Quantum Buy System Ready!');
            console.log('💳 Métodos de pago disponibles:', PaymentMethodsComponent.getAvailableMethods().map(m => `${m.name} (${(m.commission * 100).toFixed(1)}% + $${m.fixedFee})`));
            console.log('🌍 Criptomonedas soportadas:', Object.keys(QuantumBuyComponent.supportedCryptos));
            console.log('🏆 Comisiones competitivas como Phantom: ¡Listo para competir!');
        } else {
            console.warn('⚠️ Sistema de compra no se pudo inicializar completamente');
        }
    }, 100);
});

// Hacer disponible globalmente
window.QuantumBuyInitializer = QuantumBuyInitializer;
