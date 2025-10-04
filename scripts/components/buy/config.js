// Configuración centralizada para el sistema de compra de Quantum Wallet
const QuantumBuyConfig = {
    // Configuración general
    general: {
        minAmount: 100, // MXN
        maxAmount: 100000, // MXN
        defaultCurrency: 'MXN',
        supportedCurrencies: ['MXN', 'USD'],
        commission: {
            baseRate: 0.025, // 2.5%
            fixedFee: 25 // $25 MXN
        }
    },

    // Configuración de criptomonedas
    cryptocurrencies: {
        BTC: {
            name: 'Bitcoin',
            symbol: 'BTC',
            icon: 'fab fa-bitcoin',
            enabled: true,
            minAmount: 0.0001,
            maxAmount: 1,
            defaultPrice: 57000,
            networks: ['bitcoin']
        },
        ETH: {
            name: 'Ethereum',
            symbol: 'ETH',
            icon: 'fab fa-ethereum',
            enabled: true,
            minAmount: 0.001,
            maxAmount: 10,
            defaultPrice: 3200,
            networks: ['ethereum', 'polygon', 'arbitrum']
        },
        SOL: {
            name: 'Solana',
            symbol: 'SOL',
            icon: 'fas fa-sun',
            enabled: true,
            minAmount: 0.1,
            maxAmount: 100,
            defaultPrice: 150,
            networks: ['solana']
        },
        USDC: {
            name: 'USD Coin',
            symbol: 'USDC',
            icon: 'fas fa-usd-circle',
            enabled: true,
            minAmount: 1,
            maxAmount: 10000,
            defaultPrice: 1,
            networks: ['ethereum', 'polygon', 'solana', 'avalanche']
        },
        USDT: {
            name: 'Tether',
            symbol: 'USDT',
            icon: 'fas fa-usd-circle',
            enabled: true,
            minAmount: 1,
            maxAmount: 10000,
            defaultPrice: 1,
            networks: ['ethereum', 'polygon', 'solana', 'avalanche']
        }
    },

    // Configuración de métodos de pago (competitivos como Phantom)
    paymentMethods: {
        applePay: {
            name: 'Apple Pay',
            enabled: true,
            commission: 0.025, // 2.5% (igual que Phantom)
            fixedFee: 25, // $25 MXN (igual que Phantom)
            minAmount: 100,
            maxAmount: 50000,
            processingTime: 'Instantáneo',
            requirements: ['iOS device', 'Touch ID/Face ID']
        },
        googlePay: {
            name: 'Google Pay',
            enabled: true,
            commission: 0.025, // 2.5% (igual que Phantom)
            fixedFee: 25, // $25 MXN (igual que Phantom)
            minAmount: 100,
            maxAmount: 50000,
            processingTime: 'Instantáneo',
            requirements: ['Android device', 'Google account']
        },
        debitCard: {
            name: 'Tarjeta de Débito',
            enabled: true,
            commission: 0.029, // 2.9% (igual que MoonPay)
            fixedFee: 30, // $30 MXN (igual que MoonPay)
            minAmount: 100,
            maxAmount: 25000,
            processingTime: '1-3 minutos',
            requirements: ['Valid debit card', 'CVV']
        },
        creditCard: {
            name: 'Tarjeta de Crédito',
            enabled: true,
            commission: 0.035, // 3.5% (igual que MoonPay)
            fixedFee: 35, // $35 MXN (igual que MoonPay)
            minAmount: 100,
            maxAmount: 100000,
            processingTime: '1-5 minutos',
            requirements: ['Valid credit card', 'CVV']
        },
        spei: {
            name: 'SPEI',
            enabled: true,
            commission: 0.02, // 2% (más económico que competencia)
            fixedFee: 20, // $20 MXN (más económico que competencia)
            minAmount: 100,
            maxAmount: 50000,
            processingTime: '5-30 minutos',
            requirements: ['Mexican bank account', 'CLABE']
        }
    },

    // Configuración de MoonPay
    moonpay: {
        development: {
            enabled: false, // Cambiar a true cuando tengas API key
            apiKey: process.env.MOONPAY_DEV_API_KEY || '',
            sandbox: true,
            webhookSecret: process.env.MOONPAY_DEV_WEBHOOK_SECRET || ''
        },
        production: {
            enabled: false, // Cambiar a true cuando tengas API key de producción
            apiKey: process.env.MOONPAY_PROD_API_KEY || '',
            sandbox: false,
            webhookSecret: process.env.MOONPAY_PROD_WEBHOOK_SECRET || ''
        }
    },

    // Configuración de UI/UX
    ui: {
        theme: {
            primary: '#2563eb',
            secondary: '#10b981',
            accent: '#f59e0b',
            danger: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981'
        },
        animations: {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out'
        },
        notifications: {
            position: 'top-right',
            duration: 5000,
            showProgress: true
        }
    },

    // Configuración de características
    features: {
        realTimePrices: true,
        priceAlerts: false, // Futuro
        recurringBuys: false, // Futuro
        limitOrders: false, // Futuro
        stopLoss: false, // Futuro
        multiLanguage: true,
        darkMode: true,
        biometricAuth: false // Futuro
    },

    // Límites y restricciones
    limits: {
        daily: {
            maxAmount: 100000, // MXN por día
            maxTransactions: 10
        },
        monthly: {
            maxAmount: 500000, // MXN por mes
            maxTransactions: 100
        },
        kyc: {
            requiredAbove: 50000, // MXN
            documents: ['ID', 'Proof of address', 'Selfie']
        }
    }
};

// Función para obtener configuración actual
function getQuantumBuyConfig() {
    return QuantumBuyConfig;
}

// Función para actualizar configuración
function updateQuantumBuyConfig(updates) {
    Object.assign(QuantumBuyConfig, updates);
}

// Función para validar configuración
function validateQuantumBuyConfig() {
    const errors = [];

    // Validar criptomonedas
    if (!QuantumBuyConfig.cryptocurrencies || Object.keys(QuantumBuyConfig.cryptocurrencies).length === 0) {
        errors.push('No hay criptomonedas configuradas');
    }

    // Validar métodos de pago
    if (!QuantumBuyConfig.paymentMethods || Object.keys(QuantumBuyConfig.paymentMethods).length === 0) {
        errors.push('No hay métodos de pago configurados');
    }

    // Validar límites
    if (!QuantumBuyConfig.limits) {
        errors.push('No hay límites configurados');
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Hacer disponible globalmente
window.QuantumBuyConfig = QuantumBuyConfig;
window.getQuantumBuyConfig = getQuantumBuyConfig;
window.updateQuantumBuyConfig = updateQuantumBuyConfig;
window.validateQuantumBuyConfig = validateQuantumBuyConfig;
