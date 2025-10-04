// Simulación de API para Quantum Wallet
class QuantumAPI {
    static async login(email, password) {
        return await QuantumDB.apiCall('/auth/login', { email, password });
    }

    static async getPortfolio() {
        return await QuantumDB.apiCall('/portfolio');
    }

    static async getTransactions() {
        return await QuantumDB.apiCall('/transactions');
    }

    static async getMarkets(type) {
        return await QuantumDB.apiCall('/markets', { type });
    }

    static async executeTrade(tradeData) {
        // Simular ejecución de trade
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "Trade ejecutado correctamente" });
            }, 1500);
        });
    }
}