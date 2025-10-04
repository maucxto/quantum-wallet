// Componente de Compra de Crypto para Quantum Wallet
class QuantumBuyComponent {
    static currentCrypto = 'BTC';
    static currentAmount = '';
    static currentCurrency = 'MXN';

    // Configuración de criptomonedas soportadas
    static supportedCryptos = {
        BTC: {
            name: 'Bitcoin',
            symbol: 'BTC',
            icon: 'fab fa-bitcoin',
            minAmount: 0.0001,
            maxAmount: 1,
            price: 57000 // precio aproximado en USD
        },
        ETH: {
            name: 'Ethereum',
            symbol: 'ETH',
            icon: 'fab fa-ethereum',
            minAmount: 0.001,
            maxAmount: 10,
            price: 3200
        },
        SOL: {
            name: 'Solana',
            symbol: 'SOL',
            icon: 'fas fa-sun',
            minAmount: 0.1,
            maxAmount: 100,
            price: 150
        },
        USDC: {
            name: 'USD Coin',
            symbol: 'USDC',
            icon: 'fas fa-usd-circle',
            minAmount: 1,
            maxAmount: 10000,
            price: 1
        },
        USDT: {
            name: 'Tether',
            symbol: 'USDT',
            icon: 'fas fa-usd-circle',
            minAmount: 1,
            maxAmount: 10000,
            price: 1
        }
    };

    // Configuración de métodos de pago (competitivos como Phantom)
    static paymentMethods = {
        applePay: {
            name: 'Apple Pay',
            icon: 'fab fa-apple-pay',
            available: true,
            commission: 0.025, // 2.5% (igual que Phantom)
            fixedFee: 25, // $25 MXN (igual que Phantom)
            processingTime: 'Instantáneo'
        },
        googlePay: {
            name: 'Google Pay',
            icon: 'fab fa-google-pay',
            available: true,
            commission: 0.025, // 2.5% (igual que Phantom)
            fixedFee: 25, // $25 MXN (igual que Phantom)
            processingTime: 'Instantáneo'
        },
        debitCard: {
            name: 'Tarjeta de Débito',
            icon: 'fas fa-credit-card',
            available: true,
            commission: 0.029, // 2.9% (igual que MoonPay)
            fixedFee: 30, // $30 MXN (igual que MoonPay)
            processingTime: '1-3 minutos'
        },
        creditCard: {
            name: 'Tarjeta de Crédito',
            icon: 'fas fa-credit-card',
            available: true,
            commission: 0.035, // 3.5% (igual que MoonPay)
            fixedFee: 35, // $35 MXN (igual que MoonPay)
            processingTime: '1-5 minutos'
        },
        spei: {
            name: 'SPEI',
            icon: 'fas fa-university',
            available: true,
            commission: 0.02, // 2% (más económico que competencia)
            fixedFee: 20, // $20 MXN (más económico que competencia)
            processingTime: '5-30 minutos'
        }
    };

    static showBuyModal() {
        const modalHTML = `
            <div class="modal" id="quantumBuyModal" style="background: rgba(0,0,0,0.8);">
                <div class="modal-content" style="width: 95%; max-width: 400px; margin: auto; background: var(--card-bg); border-radius: 20px; overflow: hidden; position: relative;">

                    <!-- Header -->
                    <div class="modal-header" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 20px; text-align: center;">
                        <h2 class="modal-title" style="margin: 0; font-size: 1.5em;">Comprar Cripto</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 0.9em;">Compra rápida y segura</p>
                    </div>

                    <!-- Selector de criptomoneda -->
                    <div style="padding: 20px;">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 10px; color: var(--text-primary); font-weight: 600;">Seleccionar Criptomoneda</label>
                            <div class="crypto-selector" id="cryptoSelector" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 8px; max-width: 100%;">
                                ${this.renderCryptoOptions()}
                            </div>
                        </div>

                        <!-- Input de cantidad -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 10px; color: var(--text-primary); font-weight: 600;">Cantidad</label>
                            <div style="position: relative;">
                                <input type="number" id="buyAmount" class="form-input"
                                       placeholder="0.00"
                                       style="padding: 15px; border-radius: 12px; border: 2px solid var(--border); font-size: 1.1em; width: 100%;"
                                       oninput="QuantumBuyComponent.updateBuyPreview()">
                                <div id="amountShortcuts" style="margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap; overflow-x: auto; padding-bottom: 5px;">
                                    <button type="button" class="btn btn-sm" onclick="QuantumBuyComponent.setAmount(100)" style="font-size: 0.8em; padding: 8px 12px; white-space: nowrap; flex-shrink: 0;">$100</button>
                                    <button type="button" class="btn btn-sm" onclick="QuantumBuyComponent.setAmount(500)" style="font-size: 0.8em; padding: 8px 12px; white-space: nowrap; flex-shrink: 0;">$500</button>
                                    <button type="button" class="btn btn-sm" onclick="QuantumBuyComponent.setAmount(1000)" style="font-size: 0.8em; padding: 8px 12px; white-space: nowrap; flex-shrink: 0;">$1,000</button>
                                    <button type="button" class="btn btn-sm" onclick="QuantumBuyComponent.setAmount(5000)" style="font-size: 0.8em; padding: 8px 12px; white-space: nowrap; flex-shrink: 0;">$5,000</button>
                                </div>
                            </div>
                        </div>

                        <!-- Preview de compra -->
                        <div id="buyPreview" class="buy-preview" style="background: var(--background); border-radius: 12px; padding: 15px; margin-bottom: 20px; display: none;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: var(--text-secondary);">Recibirás:</span>
                                <span id="previewAmount" style="color: var(--text-primary); font-weight: 600;">0.00 BTC</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: var(--text-secondary);">Precio:</span>
                                <span id="previewPrice" style="color: var(--text-primary);">$57,000.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: var(--text-secondary);">Comisión:</span>
                                <span id="previewCommission" style="color: var(--warning);">$0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 1.1em; font-weight: 600; padding-top: 8px; border-top: 1px solid var(--border);">
                                <span style="color: var(--text-primary);">Total:</span>
                                <span id="previewTotal" style="color: var(--primary);">$0.00</span>
                            </div>
                        </div>

                        <!-- Métodos de pago -->
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 10px; color: var(--text-primary); font-weight: 600;">Método de Pago</label>
                            <div id="paymentMethods" style="display: grid; gap: 8px;">
                                ${PaymentMethodsComponent.renderPaymentMethodSelector('debitCard')}
                            </div>
                        </div>

                        <!-- Información adicional -->
                        <div style="background: var(--background); border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 0.85em;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <i class="fas fa-info-circle" style="color: var(--primary); margin-right: 8px;"></i>
                                <span style="color: var(--text-secondary);">Compra procesada por MoonPay</span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <i class="fas fa-shield-alt" style="color: var(--success); margin-right: 8px;"></i>
                                <span style="color: var(--text-secondary);">Transacción segura y encriptada</span>
                            </div>
                        </div>

                        <!-- Botón de compra -->
                        <button id="confirmBuyBtn" class="btn btn-primary" onclick="QuantumBuyComponent.confirmPurchase()"
                                style="width: 100%; padding: 15px; font-size: 1.1em; font-weight: 600; border-radius: 12px; margin-bottom: 10px; background: linear-gradient(135deg, var(--primary), var(--secondary));">
                            <i class="fas fa-shopping-cart" style="margin-right: 8px;"></i>
                            Comprar Ahora
                        </button>

                        <!-- Información de mercado -->
                        <div style="text-align: center; font-size: 0.8em; color: var(--text-tertiary);">
                            Precios en tiempo real • Sin cargos ocultos
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal existente si hay uno
        const existingModal = document.getElementById('quantumBuyModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('quantumBuyModal').style.display = 'flex';

        // Inicializar valores por defecto
        this.currentCrypto = 'BTC';
        this.currentAmount = '';
        this.currentCurrency = 'MXN';

        // Actualizar preview inicial
        this.updateBuyPreview();
    }

    static renderCryptoOptions() {
        return Object.entries(this.supportedCryptos).map(([key, crypto]) => `
            <div class="crypto-option ${this.currentCrypto === key ? 'active' : ''}"
                 onclick="QuantumBuyComponent.selectCrypto('${key}')"
                 style="padding: 12px; border: 2px solid ${this.currentCrypto === key ? 'var(--primary)' : 'var(--border)'}; border-radius: 12px; text-align: center; cursor: pointer; background: ${this.currentCrypto === key ? 'var(--primary)' : 'var(--card-bg)'}; color: ${this.currentCrypto === key ? 'white' : 'var(--text-primary)'};">
                <div style="font-size: 1.5em; margin-bottom: 4px;">
                    <i class="${crypto.icon}"></i>
                </div>
                <div style="font-size: 0.8em; font-weight: 600;">${crypto.symbol}</div>
                <div style="font-size: 0.7em; opacity: 0.8;">${crypto.name}</div>
            </div>
        `).join('');
    }

    static renderPaymentMethods() {
        return Object.entries(this.paymentMethods).map(([key, method]) => `
            <div class="payment-method ${key}"
                 onclick="QuantumBuyComponent.selectPaymentMethod('${key}')"
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

    static selectCrypto(crypto) {
        this.currentCrypto = crypto;

        // Actualizar opciones visuales
        document.querySelectorAll('.crypto-option').forEach(option => {
            option.classList.remove('active');
        });
        event.target.closest('.crypto-option').classList.add('active');

        // Actualizar estilos
        document.querySelectorAll('.crypto-option').forEach(option => {
            const cryptoKey = option.onclick.toString().match(/'([^']+)'/)[1];
            if (cryptoKey === crypto) {
                option.style.borderColor = 'var(--primary)';
                option.style.background = 'var(--primary)';
                option.style.color = 'white';
            } else {
                option.style.borderColor = 'var(--border)';
                option.style.background = 'var(--card-bg)';
                option.style.color = 'var(--text-primary)';
            }
        });

        this.updateBuyPreview();
    }

    static setAmount(amount) {
        document.getElementById('buyAmount').value = amount;
        this.currentAmount = amount.toString();
        this.updateBuyPreview();
    }

    static updateBuyPreview() {
        const amountInput = document.getElementById('buyAmount');
        const preview = document.getElementById('buyPreview');

        if (!amountInput || !preview) return;

        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) {
            preview.style.display = 'none';
            return;
        }

        preview.style.display = 'block';

        const crypto = this.supportedCryptos[this.currentCrypto];
        const cryptoAmount = amount / crypto.price;

        // Calcular comisión usando el método seleccionado
        const selectedMethod = PaymentMethodsComponent.getSelectedMethod();
        const commissionAmount = (amount * selectedMethod.commission) + selectedMethod.fixedFee;
        const total = amount + commissionAmount;

        // Actualizar preview
        document.getElementById('previewAmount').textContent = `${cryptoAmount.toFixed(6)} ${crypto.symbol}`;
        document.getElementById('previewPrice').textContent = `$${crypto.price.toLocaleString()} USD`;
        document.getElementById('previewCommission').textContent = `$${commissionAmount.toFixed(2)}`;
        document.getElementById('previewTotal').textContent = `$${total.toFixed(2)}`;
    }

    static selectPaymentMethod(method) {
        // Actualizar selección visual
        document.querySelectorAll('.payment-method').forEach(pm => {
            pm.style.borderColor = 'var(--border)';
        });
        event.target.closest('.payment-method').style.borderColor = 'var(--primary)';

        this.updateBuyPreview();
    }

    static async confirmPurchase() {
        const amountInput = document.getElementById('buyAmount');
        const confirmBtn = document.getElementById('confirmBuyBtn');

        if (!amountInput) return;

        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) {
            Helpers.showNotification('Ingresa una cantidad válida', 'error');
            return;
        }

        const crypto = this.supportedCryptos[this.currentCrypto];

        // Validar monto mínimo
        if (amount < 100) {
            Helpers.showNotification('El monto mínimo es $100 MXN', 'error');
            return;
        }

        // Validar método de pago seleccionado
        const selectedMethod = PaymentMethodsComponent.getSelectedMethod();
        const validation = PaymentMethodsComponent.validatePaymentMethod(amount, selectedMethod.key);

        if (!validation.valid) {
            Helpers.showNotification(validation.error, 'error');
            return;
        }

        // Mostrar loading
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Procesando...';
        confirmBtn.disabled = true;

        try {
            // Procesar pago usando el sistema avanzado
            const cryptoAmount = amount / crypto.price;
            const commission = PaymentMethodsComponent.calculateCommission(amount, selectedMethod.key);

            const paymentData = {
                amount: amount,
                cryptoAmount: cryptoAmount,
                crypto: crypto.symbol,
                method: selectedMethod.key,
                commission: commission.commission + commission.fixedFee
            };

            await PaymentMethodsComponent.processPayment(paymentData);

            // Mostrar éxito con detalles
            Helpers.showNotification(
                `¡Compra exitosa! Has adquirido ${cryptoAmount.toFixed(6)} ${crypto.symbol} por $${amount} MXN usando ${selectedMethod.name}`,
                'success'
            );

            // Cerrar modal
            this.hideBuyModal();

        } catch (error) {
            console.error('Error procesando compra:', error);
            Helpers.showNotification(`Error procesando la compra con ${selectedMethod.name}. Intenta nuevamente.`, 'error');
        } finally {
            // Restaurar botón
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    static async processPayment(amount) {
        // Simular procesamiento de pago
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular 95% éxito, 5% error
                if (Math.random() > 0.05) {
                    resolve({ success: true, transactionId: 'QX_' + Date.now() });
                } else {
                    reject(new Error('Error de procesamiento de pago'));
                }
            }, 2000);
        });
    }

    static hideBuyModal() {
        const modal = document.getElementById('quantumBuyModal');
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    }
}

// Agregar estilos CSS responsivos
const buyModalStyles = document.createElement('style');
buyModalStyles.textContent = `
    /* Estilos responsivos para el modal de compra */

    /* Móviles pequeños (< 480px) */
    @media (max-width: 480px) {
        .modal-content {
            width: 95vw !important;
            max-width: none !important;
            margin: 5px !important;
            border-radius: 15px !important;
        }

        .modal-header {
            padding: 15px !important;
        }

        .modal-title {
            font-size: 1.3em !important;
        }

        .crypto-selector {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
        }

        .crypto-option {
            padding: 10px !important;
            font-size: 0.9em !important;
        }

        .amount-shortcuts {
            gap: 3px !important;
        }

        .btn-sm {
            font-size: 0.75em !important;
            padding: 6px 10px !important;
        }

        .form-input {
            font-size: 1em !important;
            padding: 12px !important;
        }

        .payment-method {
            padding: 10px !important;
        }

        .payment-method div:first-child {
            font-size: 0.9em !important;
        }
    }

    /* Tablets y móviles grandes (481px - 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
        .modal-content {
            width: 90vw !important;
            max-width: 350px !important;
        }

        .crypto-selector {
            grid-template-columns: repeat(3, 1fr) !important;
        }
    }

    /* Desktop (> 768px) */
    @media (min-width: 769px) {
        .modal-content {
            width: 400px !important;
            max-width: 400px !important;
        }

        .crypto-selector {
            grid-template-columns: repeat(3, 1fr) !important;
        }
    }

    /* Estilos generales mejorados */
    .crypto-option {
        transition: all 0.2s ease !important;
        min-height: 80px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .crypto-option:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15) !important;
    }

    .amount-shortcuts {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
    }

    .amount-shortcuts::-webkit-scrollbar {
        display: none !important;
    }

    .payment-method {
        transition: all 0.2s ease !important;
    }

    .payment-method:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    .buy-preview {
        animation: slideIn 0.3s ease-out !important;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Indicador de carga mejorado */
    .btn:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
    }

    .fa-spin {
        animation: fa-spin 1s infinite linear !important;
    }

    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(buyModalStyles);

// Hacer disponible globalmente
window.QuantumBuyComponent = QuantumBuyComponent;
