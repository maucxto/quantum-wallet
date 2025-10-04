// Integración con Thirdweb para funcionalidades avanzadas de compra
class ThirdwebBuyIntegration {
    static thirdweb = null;
    static initialized = false;

    // Configuración de Thirdweb para compras
    static config = {
        clientId: process.env.THIRDWEB_CLIENT_ID || 'your-client-id',
        supportedChains: [
            {
                name: 'Ethereum',
                chainId: 1,
                currency: 'ETH',
                rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'
            },
            {
                name: 'Polygon',
                chainId: 137,
                currency: 'MATIC',
                rpcUrl: 'https://polygon-rpc.com'
            },
            {
                name: 'Solana',
                chainId: 101,
                currency: 'SOL',
                rpcUrl: 'https://api.mainnet-beta.solana.com'
            }
        ]
    };

    // Inicializar Thirdweb
    static async initialize() {
        try {
            if (typeof thirdweb === 'undefined') {
                console.warn('Thirdweb no está disponible');
                return false;
            }

            // Crear cliente Thirdweb
            this.thirdweb = await thirdweb.createThirdwebClient({
                clientId: this.config.clientId
            });

            this.initialized = true;
            console.log('✅ Thirdweb inicializado para compras');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Thirdweb:', error);
            return false;
        }
    }

    // Comprar crypto usando contratos inteligentes
    static async buyWithSmartContract(crypto, amount, paymentMethod) {
        if (!this.initialized || !this.thirdweb) {
            throw new Error('Thirdweb no inicializado');
        }

        try {
            // Obtener wallet del usuario
            const wallet = await this.getUserWallet();
            if (!wallet) {
                throw new Error('Wallet no conectada');
            }

            // Obtener contrato de compra
            const buyContract = await this.getBuyContract(crypto);

            // Preparar transacción
            const transaction = {
                to: buyContract.address,
                value: this.convertToWei(amount, crypto),
                data: buyContract.interface.encodeFunctionData('buy', [amount])
            };

            // Ejecutar transacción
            const txHash = await wallet.sendTransaction(transaction);

            // Esperar confirmación
            const receipt = await wallet.waitForTransaction(txHash);

            return {
                success: true,
                transactionHash: txHash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed
            };

        } catch (error) {
            console.error('Error comprando con Thirdweb:', error);
            throw error;
        }
    }

    // Obtener wallet del usuario
    static async getUserWallet() {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask no instalado');
            }

            // Solicitar conexión
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Crear wallet Thirdweb
            const wallet = await this.thirdweb.wallet.connect('metamask');

            return wallet;
        } catch (error) {
            console.error('Error conectando wallet:', error);
            return null;
        }
    }

    // Obtener contrato de compra para una criptomoneda específica
    static async getBuyContract(crypto) {
        // En producción, estos serían contratos reales desplegados
        const contractAddresses = {
            BTC: '0x0000000000000000000000000000000000000000', // Dirección del contrato
            ETH: '0x0000000000000000000000000000000000000000',
            USDC: '0x0000000000000000000000000000000000000000'
        };

        const address = contractAddresses[crypto];
        if (!address) {
            throw new Error(`Contrato no disponible para ${crypto}`);
        }

        // ABI básico del contrato de compra
        const buyContractABI = [
            {
                "inputs": [
                    {"name": "amount", "type": "uint256"}
                ],
                "name": "buy",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ];

        return new this.thirdweb.ethers.Contract(address, buyContractABI);
    }

    // Convertir monto a Wei (para Ethereum)
    static convertToWei(amount, crypto) {
        if (crypto === 'ETH') {
            return this.thirdweb.ethers.utils.parseEther(amount.toString());
        }
        return amount;
    }

    // Obtener balance de la wallet
    static async getWalletBalance(crypto = 'ETH') {
        try {
            const wallet = await this.getUserWallet();
            if (!wallet) return '0';

            let balance;
            if (crypto === 'ETH') {
                balance = await wallet.getBalance();
                return this.thirdweb.ethers.utils.formatEther(balance);
            }

            // Para otros tokens, necesitarías el contrato del token
            return '0';

        } catch (error) {
            console.error('Error obteniendo balance:', error);
            return '0';
        }
    }

    // Crear orden de compra usando Thirdweb Marketplace
    static async createBuyOrder(orderData) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const {
                crypto,
                amount,
                price,
                paymentMethod
            } = orderData;

            // Crear orden usando Thirdweb Marketplace
            const buyOrder = await this.thirdweb.marketplace.createBuyOrder({
                assetContractAddress: this.getTokenContract(crypto),
                tokenId: '0', // Para tokens fungibles
                quantity: amount,
                currencyContractAddress: this.getPaymentToken(paymentMethod),
                totalPrice: price
            });

            return {
                success: true,
                orderId: buyOrder.id,
                status: 'created'
            };

        } catch (error) {
            console.error('Error creando orden de compra:', error);
            throw error;
        }
    }

    // Obtener contrato de token
    static getTokenContract(crypto) {
        const contracts = {
            BTC: '0x0000000000000000000000000000000000000000',
            ETH: '0x0000000000000000000000000000000000000000',
            USDC: '0xA0b86a33E6C0cCcD4E4c8E4B2F5E2c5E6F8A1D9F'
        };

        return contracts[crypto] || '';
    }

    // Obtener token de pago
    static getPaymentToken(paymentMethod) {
        const tokens = {
            debitCard: '0x0000000000000000000000000000000000000000', // USDC
            creditCard: '0x0000000000000000000000000000000000000000', // USDC
            applePay: '0x0000000000000000000000000000000000000000', // USDC
            googlePay: '0x0000000000000000000000000000000000000000' // USDC
        };

        return tokens[paymentMethod] || tokens.debitCard;
    }

    // Verificar si Thirdweb está disponible
    static isAvailable() {
        return typeof thirdweb !== 'undefined' && this.initialized;
    }

    // Obtener cotizaciones de precios usando Thirdweb
    static async getPriceQuotes(crypto, fiatCurrency = 'USD') {
        try {
            if (!this.thirdweb) {
                await this.initialize();
            }

            // Usar servicio de precios de Thirdweb
            const priceService = await this.thirdweb.getPriceService();
            const price = await priceService.getPrice({
                tokenAddress: this.getTokenContract(crypto),
                currency: fiatCurrency
            });

            return {
                price: price.value,
                currency: fiatCurrency,
                timestamp: Date.now()
            };

        } catch (error) {
            console.error('Error obteniendo cotización:', error);
            return null;
        }
    }

    // Crear wallet si el usuario no tiene una
    static async createWallet() {
        try {
            if (!this.thirdweb) {
                await this.initialize();
            }

            // Crear wallet usando Thirdweb
            const wallet = await this.thirdweb.wallet.create();

            return {
                success: true,
                address: wallet.address,
                mnemonic: wallet.mnemonic
            };

        } catch (error) {
            console.error('Error creando wallet:', error);
            throw error;
        }
    }

    // Verificar soporte de red
    static async checkNetworkSupport(crypto) {
        try {
            const wallet = await this.getUserWallet();
            if (!wallet) return false;

            const chainId = await wallet.getChainId();

            // Verificar si la red actual soporta la criptomoneda
            const supportedChains = this.config.supportedChains;
            const currentChain = supportedChains.find(chain => chain.chainId === chainId);

            if (!currentChain) return false;

            // Verificar si la criptomoneda es compatible con la red actual
            const cryptoConfig = QuantumBuyConfig.cryptocurrencies[crypto];
            if (!cryptoConfig) return false;

            return cryptoConfig.networks.includes(currentChain.name.toLowerCase());

        } catch (error) {
            console.error('Error verificando soporte de red:', error);
            return false;
        }
    }
}

// Hacer disponible globalmente
window.ThirdwebBuyIntegration = ThirdwebBuyIntegration;
