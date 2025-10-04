// Sistema Web3 Opcional para Quantum Wallet
class Web3WalletComponent {
    static initialized = false;
    static web3 = null;
    static connected = false;
    static currentAccount = null;
    static provider = null;

    // Configuración de redes soportadas
    static supportedNetworks = {
        1: {
            name: 'Ethereum Mainnet',
            symbol: 'ETH',
            rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
            blockExplorer: 'https://etherscan.io'
        },
        137: {
            name: 'Polygon Mainnet',
            symbol: 'MATIC',
            rpcUrl: 'https://polygon-rpc.com',
            blockExplorer: 'https://polygonscan.com'
        },
        56: {
            name: 'BNB Smart Chain',
            symbol: 'BNB',
            rpcUrl: 'https://bsc-dataseed.binance.org',
            blockExplorer: 'https://bscscan.com'
        }
    };

    // Inicializar sistema Web3 (completamente opcional)
    static async initialize() {
        if (this.initialized) {
            console.log('✅ Web3 Wallet ya inicializado');
            return true;
        }

        try {
            console.log('🔗 Inicializando Web3 Wallet (opcional)...');

            // Verificar si MetaMask está disponible
            if (typeof window.ethereum !== 'undefined') {
                console.log('✅ MetaMask detectado');
                this.provider = window.ethereum;
                this.web3 = new Web3(window.ethereum);
                this.initialized = true;
                return true;
            } else {
                console.log('ℹ️ MetaMask no detectado - Web3 disponible cuando se instale');
                return false;
            }

        } catch (error) {
            console.error('❌ Error inicializando Web3:', error);
            return false;
        }
    }

    // Agregar botón Web3 opcional a la pantalla de login
    static async addWeb3Button() {
        const loginCard = document.querySelector('.login-card');
        if (!loginCard) {
            console.log('Pantalla de login no encontrada');
            return;
        }

        // Verificar si ya existe el botón Web3
        const existingWeb3 = document.getElementById('web3-wallet-section');
        if (existingWeb3) {
            console.log('Botón Web3 ya existe');
            return;
        }

        // Crear sección Web3
        const web3Section = document.createElement('div');
        web3Section.id = 'web3-wallet-section';
        web3Section.style.cssText = `
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        `;

        // Título opcional
        const title = document.createElement('div');
        title.textContent = 'O conectar con wallet';
        title.style.cssText = `
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
            margin-bottom: 15px;
        `;
        web3Section.appendChild(title);

        // Contenedor de botones Web3
        const web3Container = document.createElement('div');
        web3Container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // Botón MetaMask
        const metamaskBtn = document.createElement('button');
        metamaskBtn.className = 'web3-btn metamask-btn';
        metamaskBtn.innerHTML = '<i class="fab fa-ethereum"></i> Conectar MetaMask';
        metamaskBtn.onclick = () => this.connectMetaMask();

        // Botón WalletConnect (placeholder para futuro)
        const walletConnectBtn = document.createElement('button');
        walletConnectBtn.className = 'web3-btn walletconnect-btn';
        walletConnectBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> WalletConnect (Próximamente)';
        walletConnectBtn.onclick = () => this.showWalletConnectComingSoon();

        web3Container.appendChild(metamaskBtn);
        web3Container.appendChild(walletConnectBtn);
        web3Section.appendChild(web3Container);

        // Insertar después del botón de login tradicional
        const loginBtn = loginCard.querySelector('button[onclick*="app.login()"]');
        if (loginBtn) {
            loginBtn.insertAdjacentElement('afterend', web3Section);
        }

        // Agregar estilos CSS
        this.addWeb3Styles();

        console.log('✅ Botón Web3 agregado opcionalmente');
    }

    // Conectar MetaMask
    static async connectMetaMask() {
        try {
            console.log('🦊 Conectando MetaMask...');

            if (!this.provider) {
                if (!await this.initialize()) {
                    Helpers.showNotification('Instala MetaMask para conectar tu wallet', 'warning');
                    return;
                }
            }

            // Solicitar conexión
            const accounts = await this.provider.request({
                method: 'eth_requestAccounts'
            });

            const account = accounts[0];
            console.log('✅ Conectado a MetaMask:', account);

            this.connected = true;
            this.currentAccount = account;

            // Obtener información de la red
            const chainId = await this.provider.request({ method: 'eth_chainId' });
            const network = this.supportedNetworks[parseInt(chainId)];

            // Crear usuario Web3
            await this.createWeb3User(account, 'MetaMask', network);

        } catch (error) {
            console.error('❌ Error conectando MetaMask:', error);

            if (error.code === 4001) {
                Helpers.showNotification('Conexión cancelada por el usuario', 'info');
            } else if (error.code === -32002) {
                Helpers.showNotification('Conexión ya en proceso. Revisa MetaMask.', 'warning');
            } else {
                Helpers.showNotification('Error conectando wallet. Verifica MetaMask.', 'error');
            }
        }
    }

    // Crear usuario Web3
    static async createWeb3User(walletAddress, provider, network) {
        try {
            // Buscar usuario existente
            let user = QuantumDB.users.find(u => u.walletAddress === walletAddress);

            if (!user) {
                // Crear nuevo usuario Web3
                user = {
                    id: QuantumDB.users.length + 1,
                    email: `${walletAddress.substring(0, 8)}@${provider.toLowerCase()}.web3`,
                    password: "", // No password para Web3
                    name: `Usuario ${provider}`,
                    avatar: walletAddress.substring(2, 4).toUpperCase(),
                    walletAddress: walletAddress,
                    walletProvider: provider,
                    network: network,
                    portfolio: {
                        balance: 0,
                        assets: []
                    },
                    transactions: [],
                    markets: {
                        crypto: [
                            { symbol: "BTC", name: "Bitcoin", price: 57342.80, change: 1.78 },
                            { symbol: "ETH", name: "Ethereum", price: 3425.60, change: 2.35 },
                            { symbol: "SOL", name: "Solana", price: 102.45, change: 5.32 },
                            { symbol: "ADA", name: "Cardano", price: 0.45, change: -1.25 },
                            { symbol: "DOT", name: "Polkadot", price: 6.80, change: 3.45 }
                        ],
                        stocks: []
                    },
                    mt5Credentials: null,
                    web3User: true // Marcar como usuario Web3
                };

                QuantumDB.users.push(user);
                console.log('✅ Nuevo usuario Web3 creado:', user.name);
            }

            // Establecer como usuario actual
            QuantumDB.currentUser = user;
            QuantumDB.authToken = QuantumDB.generateToken();

            // Ocultar pantalla de login y mostrar app
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';

            // Inicializar aplicación
            await app.init();

            // Mostrar notificación de éxito
            Helpers.showNotification(
                `¡Bienvenido! Conectado con ${provider} (${network?.name || 'Red desconocida'})`,
                'success'
            );

            console.log('✅ Login Web3 exitoso');

        } catch (error) {
            console.error('❌ Error creando usuario Web3:', error);
            Helpers.showNotification('Error procesando conexión Web3', 'error');
        }
    }

    // Mostrar mensaje de WalletConnect próximamente
    static showWalletConnectComingSoon() {
        Helpers.showNotification('WalletConnect disponible próximamente - usa MetaMask por ahora', 'info');
    }

    // Obtener balance de la wallet conectada
    static async getWalletBalance() {
        if (!this.connected || !this.web3) {
            return '0';
        }

        try {
            const balance = await this.web3.eth.getBalance(this.currentAccount);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Error obteniendo balance:', error);
            return '0';
        }
    }

    // Cambiar de red
    static async switchNetwork(chainId) {
        if (!this.provider) return false;

        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }]
            });
            return true;
        } catch (error) {
            console.error('Error cambiando de red:', error);

            // Si la red no está agregada, intentar agregarla
            if (error.code === 4902) {
                return await this.addNetwork(chainId);
            }

            return false;
        }
    }

    // Agregar nueva red
    static async addNetwork(chainId) {
        const network = this.supportedNetworks[chainId];
        if (!network) return false;

        try {
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: `0x${chainId.toString(16)}`,
                    chainName: network.name,
                    nativeCurrency: {
                        name: network.symbol,
                        symbol: network.symbol,
                        decimals: 18
                    },
                    rpcUrls: [network.rpcUrl],
                    blockExplorerUrls: [network.blockExplorer]
                }]
            });
            return true;
        } catch (error) {
            console.error('Error agregando red:', error);
            return false;
        }
    }

    // Desconectar wallet
    static async disconnect() {
        try {
            this.connected = false;
            this.currentAccount = null;
            this.web3 = null;

            // Logout de la aplicación
            LoginComponent.logout();

            console.log('✅ Wallet Web3 desconectada');
            Helpers.showNotification('Wallet desconectada', 'info');

        } catch (error) {
            console.error('❌ Error desconectando wallet:', error);
        }
    }

    // Verificar conexión
    static isConnected() {
        return this.connected && this.currentAccount;
    }

    // Obtener cuenta actual
    static getCurrentAccount() {
        return this.currentAccount;
    }

    // Agregar estilos CSS para botones Web3
    static addWeb3Styles() {
        const style = document.createElement('style');
        style.textContent = `
            .web3-btn {
                padding: 12px 20px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .metamask-btn {
                background: linear-gradient(135deg, #f6851b 0%, #f7931e 100%);
                color: white;
            }

            .metamask-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(247, 147, 30, 0.3);
            }

            .walletconnect-btn {
                background: #3b99fc;
                color: white;
            }

            .walletconnect-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(59, 153, 252, 0.3);
            }

            .web3-connected {
                background: linear-gradient(135deg, #10b981, #059669) !important;
            }

            .network-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }

    // Mostrar indicador de conexión
    static showConnectionIndicator() {
        if (!this.currentAccount) return;

        const indicator = document.createElement('div');
        indicator.className = 'network-indicator';
        indicator.innerHTML = `
            <i class="fas fa-circle" style="font-size: 8px; margin-right: 5px;"></i>
            ${this.currentAccount.substring(0, 6)}...${this.currentAccount.substring(this.currentAccount.length - 4)}
        `;

        // Remover indicador existente
        const existing = document.querySelector('.network-indicator');
        if (existing) existing.remove();

        document.body.appendChild(indicator);

        // Agregar botón de desconexión al header
        this.addDisconnectButton();
    }

    // Agregar botón de desconexión al header
    static addDisconnectButton() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        // Verificar si ya existe
        const existing = document.querySelector('.web3-disconnect-btn');
        if (existing) return;

        const disconnectBtn = document.createElement('button');
        disconnectBtn.className = 'header-btn web3-disconnect-btn';
        disconnectBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        disconnectBtn.onclick = () => this.disconnect();
        disconnectBtn.title = 'Desconectar Wallet';

        headerActions.appendChild(disconnectBtn);
    }
}

// Hacer disponible globalmente
window.Web3WalletComponent = Web3WalletComponent;
