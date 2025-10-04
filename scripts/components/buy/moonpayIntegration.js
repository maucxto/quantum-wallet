// Integración con MoonPay para Quantum Wallet
class MoonPayIntegration {
    static config = {
        // Configuración para desarrollo (simulada)
        development: {
            apiKey: 'dev_api_key_placeholder',
            environment: 'sandbox',
            endpoint: 'https://api.moonpay.com',
            webhookUrl: 'https://quantum-wallet.dev/webhooks/moonpay'
        },

        // Configuración para producción (requiere aprobación de MoonPay)
        production: {
            apiKey: process.env.MOONPAY_API_KEY || '',
            environment: 'production',
            endpoint: 'https://api.moonpay.com',
            webhookUrl: 'https://quantum-wallet.com/webhooks/moonpay'
        }
    };

    static currentConfig = this.config.development;

    // Mapeo de criptomonedas Quantum a MoonPay
    static cryptoMapping = {
        BTC: {
            moonpayCode: 'btc',
            network: 'bitcoin',
            supportsNetworkFees: true
        },
        ETH: {
            moonpayCode: 'eth',
            network: 'ethereum',
            supportsNetworkFees: true
        },
        SOL: {
            moonpayCode: 'sol',
            network: 'solana',
            supportsNetworkFees: true
        },
        USDC: {
            moonpayCode: 'usdc',
            network: 'ethereum', // USDC en Ethereum
            supportsNetworkFees: false
        },
        USDT: {
            moonpayCode: 'usdt',
            network: 'ethereum', // USDT en Ethereum
            supportsNetworkFees: false
        }
    };

    // Crear URL de compra MoonPay
    static createBuyUrl(crypto, amount, currency = 'MXN') {
        const cryptoConfig = this.cryptoMapping[crypto];
        if (!cryptoConfig) {
            throw new Error(`Criptomoneda ${crypto} no soportada por MoonPay`);
        }

        const baseUrl = this.currentConfig.environment === 'production'
            ? 'https://buy.moonpay.com'
            : 'https://buy-sandbox.moonpay.com';

        const params = new URLSearchParams({
            apiKey: this.currentConfig.apiKey,
            currencyCode: currency,
            baseCurrencyAmount: amount.toString(),
            baseCurrencyCode: currency,
            cryptocurrencyCode: cryptoConfig.moonpayCode,
            walletAddress: this.getWalletAddress(crypto),
            redirectURL: this.getRedirectUrl(),
            showWalletAddressForm: 'false'
        });

        return `${baseUrl}?${params.toString()}`;
    }

    // Obtener dirección de wallet según criptomoneda
    static getWalletAddress(crypto) {
        // En producción, esto debería obtener la dirección real de la wallet del usuario
        const walletAddresses = {
            BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Dirección de prueba
            ETH: '0x1234567890123456789012345678901234567890', // Dirección de prueba
            SOL: '11111111111111111111111111111112', // Dirección de prueba
            USDC: '0x1234567890123456789012345678901234567890', // Dirección de prueba
            USDT: '0x1234567890123456789012345678901234567890'  // Dirección de prueba
        };

        return walletAddresses[crypto] || '';
    }

    // URL de redirección después de compra
    static getRedirectUrl() {
        return this.currentConfig.environment === 'production'
            ? 'https://quantum-wallet.com/buy/success'
            : 'http://localhost:3000/buy/success';
    }

    // Procesar webhook de MoonPay
    static async processWebhook(payload) {
        console.log('Procesando webhook de MoonPay:', payload);

        try {
            const { type, data } = payload;

            switch (type) {
                case 'transaction_created':
                    await this.handleTransactionCreated(data);
                    break;
                case 'transaction_updated':
                    await this.handleTransactionUpdated(data);
                    break;
                case 'transaction_failed':
                    await this.handleTransactionFailed(data);
                    break;
                default:
                    console.log('Tipo de webhook no manejado:', type);
            }

            return { success: true };
        } catch (error) {
            console.error('Error procesando webhook:', error);
            throw error;
        }
    }

    static async handleTransactionCreated(transactionData) {
        console.log('Nueva transacción creada:', transactionData);

        // Guardar en base de datos
        const transaction = {
            id: transactionData.id,
            status: 'pending',
            cryptoCurrency: transactionData.currency.code,
            fiatAmount: transactionData.baseCurrencyAmount,
            cryptoAmount: transactionData.quoteCurrencyAmount,
            userId: transactionData.metadata?.userId,
            createdAt: new Date()
        };

        // Aquí se guardaría en QuantumDB
        console.log('Guardando transacción:', transaction);
    }

    static async handleTransactionUpdated(transactionData) {
        console.log('Transacción actualizada:', transactionData);

        // Actualizar estado en base de datos
        const updatedTransaction = {
            id: transactionData.id,
            status: this.mapMoonPayStatus(transactionData.status),
            updatedAt: new Date()
        };

        console.log('Actualizando transacción:', updatedTransaction);

        // Notificar al usuario si la transacción se completó
        if (updatedTransaction.status === 'completed') {
            Helpers.showNotification(
                `¡Compra completada! Has recibido ${transactionData.quoteCurrencyAmount} ${transactionData.currency.code}`,
                'success'
            );
        }
    }

    static async handleTransactionFailed(transactionData) {
        console.log('Transacción fallida:', transactionData);

        // Marcar como fallida en base de datos
        const failedTransaction = {
            id: transactionData.id,
            status: 'failed',
            failureReason: transactionData.failureReason,
            updatedAt: new Date()
        };

        console.log('Marcando transacción como fallida:', failedTransaction);

        // Notificar al usuario
        Helpers.showNotification(
            `La compra de ${transactionData.currency.code} ha fallado. Razón: ${transactionData.failureReason}`,
            'error'
        );
    }

    // Mapear estados de MoonPay a estados internos
    static mapMoonPayStatus(moonpayStatus) {
        const statusMap = {
            'waitingPayment': 'pending',
            'pending': 'pending',
            'waitingAuthorization': 'pending',
            'completed': 'completed',
            'failed': 'failed',
            'cancelled': 'cancelled'
        };

        return statusMap[moonpayStatus] || 'unknown';
    }

    // Verificar si MoonPay está disponible para desarrollo
    static isDevelopmentReady() {
        return this.currentConfig.apiKey !== '' && this.currentConfig.apiKey !== 'dev_api_key_placeholder';
    }

    // Cambiar entre desarrollo y producción
    static setEnvironment(environment) {
        if (environment === 'production' && !this.config.production.apiKey) {
            throw new Error('API Key de MoonPay no configurada para producción');
        }

        this.currentConfig = this.config[environment];
        console.log(`MoonPay configurado para ambiente: ${environment}`);
    }

    // Obtener tasas de cambio actuales
    static async getExchangeRates() {
        if (this.currentConfig.environment === 'development') {
            // Retornar tasas simuladas para desarrollo
            return {
                BTC: 57000,
                ETH: 3200,
                SOL: 150,
                USDC: 1,
                USDT: 1
            };
        }

        try {
            const response = await fetch(`${this.currentConfig.endpoint}/v3/currencies/`, {
                headers: {
                    'Authorization': `Api-Key ${this.currentConfig.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error('Error obteniendo tasas de cambio');
            }

            const data = await response.json();

            // Procesar y retornar tasas
            const rates = {};
            data.forEach(currency => {
                if (this.cryptoMapping[currency.code.toUpperCase()]) {
                    rates[currency.code.toUpperCase()] = currency.price;
                }
            });

            return rates;
        } catch (error) {
            console.error('Error obteniendo tasas de cambio:', error);
            throw error;
        }
    }

    // Validar configuración antes de usar
    static validateConfiguration() {
        if (!this.currentConfig.apiKey) {
            return {
                valid: false,
                error: 'API Key de MoonPay no configurada'
            };
        }

        if (!this.currentConfig.webhookUrl) {
            return {
                valid: false,
                error: 'Webhook URL no configurado'
            };
        }

        return { valid: true };
    }
}

// Hacer disponible globalmente
window.MoonPayIntegration = MoonPayIntegration;
