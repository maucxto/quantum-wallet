// Simple Web3 Wallet Integration (Alternative to thirdweb)
class Web3Login {
    constructor() {
        this.web3 = null;
        this.provider = null;
        this.connected = false;
        this.currentAccount = null;
        this.walletConnectProvider = null;
    }

    async init() {
        console.log('🦊 Iniciando Web3 login simple');

        // Detectar MetaMask
        if (typeof window.ethereum !== 'undefined') {
            console.log('✅ MetaMask detectado');
            this.provider = window.ethereum;
            return true;
        }

        console.log('❌ No se detectó MetaMask');
        return false;
    }

    async renderLoginOptions() {
        console.log('🎨 Renderizando opciones Web3');
        await this.init();

        const loginCard = document.querySelector('.login-card');
        if (!loginCard) {
            console.error('❌ No se encontró .login-card');
            return;
        }

        // Create divider
        const divider = document.createElement('div');
        divider.style.cssText = `
            display: flex;
            align-items: center;
            margin: 25px 0 20px;
            color: var(--text-secondary);
            font-size: 14px;
        `;

        const line1 = document.createElement('hr');
        line1.style.cssText = `
            flex: 1;
            height: 1px;
            background: var(--border);
            border: none;
        `;

        const text = document.createElement('span');
        text.textContent = 'o conectar wallet';
        text.style.margin = '0 15px';

        const line2 = document.createElement('hr');
        line2.style.cssText = `
            flex: 1;
            height: 1px;
            background: var(--border);
            border: none;
        `;

        divider.appendChild(line1);
        divider.appendChild(text);
        divider.appendChild(line2);

        // Insert after login button
        const loginBtn = loginCard.querySelector('button[onclick*="app.login()"]');
        loginBtn.insertAdjacentElement('afterend', divider);

        // Create Web3 buttons container
        const web3Container = document.createElement('div');
        web3Container.id = 'web3-login-container';
        web3Container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin: 20px 0;
        `;

        divider.insertAdjacentElement('afterend', web3Container);

        // MetaMask Button
        if (this.provider) {
            const metamaskBtn = document.createElement('button');
            metamaskBtn.textContent = '🦊 Conectar MetaMask';
            metamaskBtn.className = 'btn metamask-btn';
            metamaskBtn.onclick = () => this.connectMetaMask();
            web3Container.appendChild(metamaskBtn);
        }

        // WalletConnect Button (fallback)
        const walletConnectBtn = document.createElement('button');
        walletConnectBtn.textContent = '📱 WalletConnect (Mobile)';
        walletConnectBtn.className = 'btn walletconnect-btn';
        walletConnectBtn.onclick = () => this.connectWalletConnect();
        web3Container.appendChild(walletConnectBtn);

        // Apply button styles
        const style = document.createElement('style');
        style.textContent = `
            .metamask-btn {
                background: linear-gradient(135deg, #f6851b 0%, #f7931e 100%) !important;
                border: none !important;
                color: white !important;
                padding: 12px 20px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                transition: transform 0.2s !important;
                font-weight: 600 !important;
            }
            .metamask-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(247, 147, 30, 0.3) !important;
            }
            .walletconnect-btn {
                background: #3b99fc !important;
                border: none !important;
                color: white !important;
                padding: 12px 20px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                transition: transform 0.2s !important;
                font-weight: 600 !important;
            }
            .walletconnect-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(59, 153, 252, 0.3) !important;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ Opciones Web3 renderizadas');
    }

    async connectMetaMask() {
        try {
            console.log('🦊 Conectando MetaMask...');

            // Request account access
            const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            console.log('✅ Conectado a MetaMask:', account);

            // Initialize Web3
            this.web3 = new Web3(this.provider);
            this.connected = true;
            this.currentAccount = account;

            // Handle successful connection
            await this.handleWeb3Login(account, 'MetaMask');

        } catch (error) {
            console.error('❌ Error conectando MetaMask:', error);
            if (error.code === 4001) {
                Helpers.showNotification('Conexión cancelada por el usuario', 'warning');
            } else {
                Helpers.showNotification('Error conectando wallet', 'error');
            }
        }
    }

    async connectWalletConnect() {
        try {
            console.log('📱 Intentando WalletConnect...');

            // Simplificado - mostrar mensaje por ahora
            Helpers.showNotification('WalletConnect próximamente - usa MetaMask por ahora', 'warning');

        } catch (error) {
            console.error('❌ Error con WalletConnect:', error);
            Helpers.showNotification('Error conectando wallet móvil', 'error');
        }
    }

    async handleWeb3Login(walletAddress, provider) {
        try {
            // Create mock user for this wallet
            let user = QuantumDB.users.find(u => u.walletAddress === walletAddress);

            if (!user) {
                // Create new user for this wallet
                user = {
                    id: QuantumDB.users.length + 1,
                    email: `${walletAddress.substring(0, 8)}@${provider.toLowerCase()}.wallet`,
                    password: "", // No password for web3 logins
                    name: `Usuario ${provider}`,
                    avatar: walletAddress.substring(2, 4).toUpperCase(),
                    walletAddress: walletAddress,
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
                    mt5Credentials: null
                };
                QuantumDB.users.push(user);
                console.log('✅ Nuevo usuario Web3 creado:', user.name);
            }

            // Set as current user
            QuantumDB.currentUser = user;
            QuantumDB.authToken = QuantumDB.generateToken();

            // Show success and login
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            await app.init();

            Helpers.showNotification(`¡Bienvenido! Conectado con ${provider}`, 'success');
            console.log('✅ Login Web3 exitoso');

        } catch (error) {
            console.error('❌ Error manejando login Web3:', error);
            Helpers.showNotification('Error procesando conexión', 'error');
        }
    }

    async disconnect() {
        try {
            this.connected = false;
            this.currentAccount = null;
            this.web3 = null;

            // Logout from app
            LoginComponent.logout();

            console.log('✅ Wallet desconectado');
        } catch (error) {
            console.error('❌ Error desconectando:', error);
        }
    }

    // Check connection status
    isConnected() {
        return this.connected;
    }

    getCurrentAccount() {
        return this.currentAccount;
    }
}

// Global instance
const web3Login = new Web3Login();
