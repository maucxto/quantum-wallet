// Sistema de Métodos de Pago para Quantum Buy
class PaymentMethodsComponent {
    static selectedMethod = 'debitCard';

    // Configuración detallada de métodos de pago (competitivos como Phantom)
    static paymentConfigs = {
        applePay: {
            name: 'Apple Pay',
            icon: 'fab fa-apple-pay',
            available: true,
            commission: 0.025, // 2.5% (igual que Phantom)
            fixedFee: 25, // $25 MXN (igual que Phantom)
            processingTime: 'Instantáneo',
            minAmount: 100,
            maxAmount: 50000,
            supportedCurrencies: ['MXN', 'USD'],
            requirements: ['Dispositivo Apple', 'Touch ID/Face ID'],
            features: ['Sin contacto', 'Máxima seguridad', 'Procesamiento instantáneo']
        },
        googlePay: {
            name: 'Google Pay',
            icon: 'fab fa-google-pay',
            available: true,
            commission: 0.025, // 2.5% (igual que Phantom)
            fixedFee: 25, // $25 MXN (igual que Phantom)
            processingTime: 'Instantáneo',
            minAmount: 100,
            maxAmount: 50000,
            supportedCurrencies: ['MXN', 'USD'],
            requirements: ['Dispositivo Android/Cualquier dispositivo', 'Google Account'],
            features: ['Universal', 'Procesamiento rápido', 'Amplia aceptación']
        },
        debitCard: {
            name: 'Tarjeta de Débito',
            icon: 'fas fa-credit-card',
            available: true,
            commission: 0.029, // 2.9% (igual que MoonPay)
            fixedFee: 30, // $30 MXN (igual que MoonPay)
            processingTime: '1-3 minutos',
            minAmount: 100,
            maxAmount: 25000,
            supportedCurrencies: ['MXN', 'USD'],
            requirements: ['Tarjeta de débito válida', 'CVV', 'Fecha de expiración'],
            features: ['Amplia aceptación', 'Procesamiento rápido', 'Bancos mexicanos']
        },
        creditCard: {
            name: 'Tarjeta de Crédito',
            icon: 'fas fa-credit-card',
            available: true,
            commission: 0.035, // 3.5% (igual que MoonPay)
            fixedFee: 35, // $35 MXN (igual que MoonPay)
            processingTime: '1-5 minutos',
            minAmount: 100,
            maxAmount: 100000,
            supportedCurrencies: ['MXN', 'USD'],
            requirements: ['Tarjeta de crédito válida', 'CVV', 'Fecha de expiración'],
            features: ['Límites más altos', 'Protección al comprador', 'Acumulación de puntos']
        },
        spei: {
            name: 'SPEI',
            icon: 'fas fa-university',
            available: true,
            commission: 0.02, // 2% (más económico que competencia)
            fixedFee: 20, // $20 MXN (más económico que competencia)
            processingTime: '5-30 minutos',
            minAmount: 100,
            maxAmount: 50000,
            supportedCurrencies: ['MXN'],
            requirements: ['Cuenta bancaria mexicana', 'CLABE'],
            features: ['Método local', 'Comisión más baja', 'Procesamiento bancario']
        }
    };

    static calculateCommission(amount, method = 'debitCard') {
        const config = this.paymentConfigs[method];
        if (!config) return { commission: 0, fixedFee: 0, total: amount };

        const commissionAmount = amount * config.commission;
        const total = amount + commissionAmount + config.fixedFee;

        return {
            commission: commissionAmount,
            fixedFee: config.fixedFee,
            total: total,
            method: method
        };
    }

    static validatePaymentMethod(amount, method = 'debitCard') {
        const config = this.paymentConfigs[method];
        if (!config) {
            return { valid: false, error: 'Método de pago no válido' };
        }

        if (!config.available) {
            return { valid: false, error: `${config.name} no está disponible actualmente` };
        }

        if (amount < config.minAmount) {
            return { valid: false, error: `El monto mínimo para ${config.name} es $${config.minAmount} MXN` };
        }

        if (amount > config.maxAmount) {
            return { valid: false, error: `El monto máximo para ${config.name} es $${config.maxAmount} MXN` };
        }

        return { valid: true };
    }

    static getAvailableMethods() {
        return Object.entries(this.paymentConfigs)
            .filter(([key, config]) => config.available)
            .map(([key, config]) => ({ key, ...config }));
    }

    static renderPaymentMethodSelector(currentMethod = 'debitCard') {
        const methods = this.getAvailableMethods();

        return methods.map(method => `
            <div class="payment-method ${method.key} ${currentMethod === method.key ? 'selected' : ''}"
                 onclick="PaymentMethodsComponent.selectMethod('${method.key}')"
                 style="padding: 15px; border: 2px solid ${currentMethod === method.key ? 'var(--primary)' : 'var(--border)'}; border-radius: 12px; cursor: pointer; background: ${currentMethod === method.key ? 'rgba(37, 99, 235, 0.05)' : 'var(--card-bg)'}; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 50px; height: 35px; background: var(--background); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            <i class="${method.icon}" style="font-size: 1.4em; color: var(--text-primary);"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary); font-size: 1.1em;">${method.name}</div>
                            <div style="font-size: 0.85em; color: var(--text-secondary);">${method.processingTime}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1em; color: var(--text-primary); font-weight: 600;">${(method.commission * 100).toFixed(1)}%</div>
                        <div style="font-size: 0.8em; color: var(--text-secondary);">${method.fixedFee > 0 ? `+$${method.fixedFee}` : 'Sin cargo fijo'}</div>
                    </div>
                </div>

                <!-- Características adicionales -->
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border);">
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${method.features.map(feature => `
                            <span style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75em;">
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    static renderPaymentMethodSelectorByCategory(category) {
        const categoryMethods = {
            wallets: ['applePay', 'googlePay'],
            cards: ['debitCard', 'creditCard'],
            bank: ['spei']
        };

        const methodKeys = categoryMethods[category] || [];
        const methods = this.getAvailableMethods().filter(method => methodKeys.includes(method.key));

        return methods.map(method => `
            <div class="payment-method ${method.key}"
                 onclick="PaymentMethodsComponent.selectMethod('${method.key}')"
                 style="padding: 12px; border: 2px solid var(--border); border-radius: 10px; cursor: pointer; background: var(--card-bg);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 40px; height: 30px; background: var(--background); border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                            <i class="${method.icon}" style="font-size: 1.2em; color: var(--text-primary);"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary);">${method.name}</div>
                            <div style="font-size: 0.8em; color: var(--text-secondary);">${method.processingTime}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.9em; color: var(--text-primary);">${(method.commission * 100).toFixed(1)}%</div>
                        <div style="font-size: 0.8em; color: var(--text-secondary);">${method.fixedFee > 0 ? `+$${method.fixedFee}` : 'Sin cargo fijo'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static selectMethod(methodKey) {
        // Actualizar selección visual
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('selected');
        });

        const selectedMethod = document.querySelector(`.payment-method.${methodKey}`);
        if (selectedMethod) {
            selectedMethod.classList.add('selected');
        }

        this.selectedMethod = methodKey;

        // Actualizar cálculo de comisiones
        if (typeof QuantumBuyComponent !== 'undefined') {
            QuantumBuyComponent.updateBuyPreview();
        }
    }

    static getSelectedMethod() {
        return this.paymentConfigs[this.selectedMethod];
    }

    static async processPayment(paymentData) {
        // Simular procesamiento según método de pago
        const method = this.getSelectedMethod();

        return new Promise((resolve, reject) => {
            // Simular diferentes tiempos de procesamiento según método
            let processingTime = 2000; // 2 segundos base

            switch (method.key) {
                case 'applePay':
                case 'googlePay':
                    processingTime = 1000; // Más rápido
                    break;
                case 'debitCard':
                case 'creditCard':
                    processingTime = 2500; // Tiempo medio
                    break;
                case 'spei':
                    processingTime = 5000; // Más lento (transferencia bancaria)
                    break;
            }

            setTimeout(() => {
                // Simular éxito en 95% de casos
                if (Math.random() > 0.05) {
                    resolve({
                        success: true,
                        transactionId: 'QX_' + Date.now(),
                        method: method.key,
                        amount: paymentData.amount,
                        cryptoAmount: paymentData.cryptoAmount,
                        commission: paymentData.commission
                    });
                } else {
                    reject(new Error(`Error procesando pago con ${method.name}`));
                }
            }, processingTime);
        });
    }

    static getMethodIcon(methodKey) {
        const method = this.paymentConfigs[methodKey];
        return method ? method.icon : 'fas fa-credit-card';
    }

    static getMethodName(methodKey) {
        const method = this.paymentConfigs[methodKey];
        return method ? method.name : 'Método desconocido';
    }
}

// Agregar estilos CSS responsivos para métodos de pago
const paymentMethodsStyles = document.createElement('style');
paymentMethodsStyles.textContent = `
    /* Estilos responsivos para métodos de pago */

    /* Móviles pequeños (< 480px) */
    @media (max-width: 480px) {
        .payment-method {
            padding: 12px !important;
            margin-bottom: 8px !important;
        }

        .payment-method div:first-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
        }

        .payment-method div:first-child > div:last-child {
            width: 100% !important;
        }

        .payment-method .features {
            margin-top: 8px !important;
        }

        .payment-method .features span {
            font-size: 0.7em !important;
            padding: 2px 6px !important;
        }
    }

    /* Tablets (481px - 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
        .payment-method {
            padding: 14px !important;
        }
    }

    /* Estilos mejorados para métodos de pago */
    .payment-method {
        transition: all 0.2s ease !important;
        border: 2px solid var(--border) !important;
    }

    .payment-method:hover {
        border-color: var(--primary) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1) !important;
    }

    .payment-method.selected {
        border-color: var(--primary) !important;
        background: rgba(37, 99, 235, 0.05) !important;
    }

    .payment-method .features {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        margin-top: 10px !important;
        padding-top: 10px !important;
        border-top: 1px solid var(--border) !important;
    }

    .payment-method .features span {
        background: var(--primary) !important;
        color: white !important;
        padding: 3px 8px !important;
        border-radius: 8px !important;
        font-size: 0.75em !important;
        font-weight: 500 !important;
    }
`;

// Agregar estilos solo si no existen
if (!document.querySelector('#payment-methods-styles')) {
    paymentMethodsStyles.id = 'payment-methods-styles';
    document.head.appendChild(paymentMethodsStyles);
}

// Hacer disponible globalmente
window.PaymentMethodsComponent = PaymentMethodsComponent;
