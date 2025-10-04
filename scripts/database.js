// Base de datos simulada de Quantum Wallet
class QuantumDatabase {
    constructor() {
        this.users = [
            {
                id: 1,
                email: "usuario@quantum.com",
                password: "password123",
                name: "Juan López",
                avatar: "JL",
                portfolio: {
                    balance: 124852.40,
                    assets: [
                        { symbol: "ETH", amount: 2.45, value: 87425.60, change: 2.35 },
                        { symbol: "BTC", amount: 0.0052, value: 6342.80, change: 1.78 },
                        { symbol: "USDC", amount: 1250, value: 21000.00, change: 0.00 },
                        { symbol: "AAPL", amount: 5, value: 912.50, change: 1.25 },
                        { symbol: "TSLA", amount: 3, value: 712.35, change: -0.85 }
                    ]
                },
                transactions: [
                    { id: 1, type: "send", asset: "ETH", amount: -0.12, to: "Carlos Mendoza", date: "Hace 2 horas", status: "completed" },
                    { id: 2, type: "receive", asset: "BTC", amount: 0.025, from: "Ana López", date: "Ayer a las 15:23", status: "completed" },
                    { id: 3, type: "swap", asset: "ETH", amount: -0.5, details: "ETH → USDC", date: "12 Oct 2023", status: "completed" },
                    { id: 4, type: "buy", asset: "AAPL", amount: 5, price: 865.25, date: "5 Oct 2023", status: "completed" },
                    { id: 5, type: "deposit", asset: "MXN", amount: 25000, date: "3 Oct 2023", status: "completed" }
                ],
                markets: {
                    crypto: [
                        { symbol: "BTC", name: "Bitcoin", price: 57342.80, change: 1.78 },
                        { symbol: "ETH", name: "Ethereum", price: 3425.60, change: 2.35 },
                        { symbol: "SOL", name: "Solana", price: 102.45, change: 5.32 },
                        { symbol: "ADA", name: "Cardano", price: 0.45, change: -1.25 },
                        { symbol: "DOT", name: "Polkadot", price: 6.80, change: 3.45 }
                    ],
                    stocks: [
                        { symbol: "AAPL", name: "Apple Inc.", price: 182.50, change: 1.25 },
                        { symbol: "TSLA", name: "Tesla Inc.", price: 237.45, change: -0.85 },
                        { symbol: "MSFT", name: "Microsoft Corp.", price: 345.28, change: 2.15 },
                        { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.75, change: 0.95 },
                        { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.30, change: 1.75 }
                    ]
                },
                mt5Credentials: null
            }
        ];
        
        this.currentUser = null;
        this.authToken = null;
        this.mt5Connected = false;
    }

    // Métodos de autenticación
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.authToken = this.generateToken();
            return { success: true, token: this.authToken, user: user };
        }
        return { success: false, error: "Credenciales inválidas" };
    }

    generateToken() {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
               btoa(JSON.stringify({ userId: this.currentUser.id, exp: Date.now() + 86400000 })) + 
               '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    }

    logout() {
        this.currentUser = null;
        this.authToken = null;
        this.mt5Connected = false;
    }

    // Account registration
    register(email, password, name = null) {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            return { success: false, error: "El correo electrónico ya está registrado" };
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            email: email,
            password: password,
            name: name || email.split('@')[0], // Default name from email
            avatar: (name || email.split('@')[0]).substring(0, 2).toUpperCase(),
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
                stocks: [
                    { symbol: "AAPL", name: "Apple Inc.", price: 182.50, change: 1.25 },
                    { symbol: "TSLA", name: "Tesla Inc.", price: 237.45, change: -0.85 },
                    { symbol: "MSFT", name: "Microsoft Corp.", price: 345.28, change: 2.15 },
                    { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.75, change: 0.95 },
                    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.30, change: 1.75 }
                ]
            },
            mt5Credentials: null
        };

        this.users.push(newUser);
        return { success: true, user: newUser };
    }

    // Métodos de datos
    getPortfolio() {
        return this.currentUser ? this.currentUser.portfolio : null;
    }

    getTransactions() {
        return this.currentUser ? this.currentUser.transactions : [];
    }

    getMarketData(type) {
        return this.currentUser ? this.currentUser.markets[type] || [] : [];
    }

    // Simulación de llamadas API
    async apiCall(endpoint, data = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let response;
                
                switch(endpoint) {
                    case '/auth/login':
                        response = this.login(data.email, data.password);
                        break;
                    case '/portfolio':
                        response = this.getPortfolio();
                        break;
                    case '/transactions':
                        response = this.getTransactions();
                        break;
                    case '/markets':
                        response = this.getMarketData(data.type);
                        break;
                    default:
                        response = { error: "Endpoint no encontrado" };
                }
                
                resolve(response);
            }, 800);
        });
    }
}

// Crear instancia global de la base de datos
const QuantumDB = new QuantumDatabase();
