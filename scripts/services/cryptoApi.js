// Servicio para APIs de criptomonedas
class CryptoAPI {
    constructor() {
        this.baseURL = 'https://api.coingecko.com/api/v3';
    }

    // Obtener precios de múltiples criptomonedas
    async getCryptoPrices(coins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']) {
        try {
            const response = await fetch(
                `${this.baseURL}/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_24hr_change=true`
            );
            
            if (!response.ok) {
                throw new Error('Error al obtener precios');
            }
            
            const data = await response.json();
            return this.formatCryptoData(data);
        } catch (error) {
            console.error('Error en CryptoAPI:', error);
            return this.getFallbackData();
        }
    }

    // Obtener datos del mercado
    async getMarketData(coins = ['bitcoin', 'ethereum']) {
        try {
            const response = await fetch(
                `${this.baseURL}/coins/markets?vs_currency=usd&ids=${coins.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
            );
            
            if (!response.ok) {
                throw new Error('Error al obtener datos de mercado');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en Market Data:', error);
            return [];
        }
    }

    // Formatear datos de criptomonedas
    formatCryptoData(data) {
        const formatted = {};
        
        for (const [coin, info] of Object.entries(data)) {
            const symbol = this.getSymbol(coin);
            formatted[symbol] = {
                price: info.usd,
                change: info.usd_24h_change,
                symbol: symbol,
                name: this.getName(coin)
            };
        }
        
        return formatted;
    }

    getSymbol(coinId) {
        const symbols = {
            'bitcoin': 'BTC',
            'ethereum': 'ETH',
            'solana': 'SOL',
            'cardano': 'ADA',
            'polkadot': 'DOT',
            'ripple': 'XRP',
            'dogecoin': 'DOGE',
            'matic-network': 'MATIC'
        };
        return symbols[coinId] || coinId.toUpperCase();
    }

    getName(coinId) {
        const names = {
            'bitcoin': 'Bitcoin',
            'ethereum': 'Ethereum',
            'solana': 'Solana',
            'cardano': 'Cardano',
            'polkadot': 'Polkadot'
        };
        return names[coinId] || coinId;
    }

    // Datos de respaldo en caso de error
    getFallbackData() {
        return {
            'BTC': { price: 57342.80, change: 1.78, symbol: 'BTC', name: 'Bitcoin' },
            'ETH': { price: 3425.60, change: 2.35, symbol: 'ETH', name: 'Ethereum' },
            'SOL': { price: 102.45, change: 5.32, symbol: 'SOL', name: 'Solana' },
            'ADA': { price: 0.45, change: -1.25, symbol: 'ADA', name: 'Cardano' },
            'DOT': { price: 6.80, change: 3.45, symbol: 'DOT', name: 'Polkadot' }
        };
    }

    // Obtener datos históricos para gráficos
    async getHistoricalData(coinId = 'bitcoin', days = 7) {
        try {
            const response = await fetch(
                `${this.baseURL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
            );
            
            if (!response.ok) {
                throw new Error('Error al obtener datos históricos');
            }
            
            const data = await response.json();
            return data.prices; // [[timestamp, price], ...]
        } catch (error) {
            console.error('Error en Historical Data:', error);
            return this.generateMockHistoricalData();
        }
    }

    generateMockHistoricalData() {
        const data = [];
        const basePrice = 50000;
        const now = Date.now();
        
        for (let i = 7; i >= 0; i--) {
            const timestamp = now - (i * 24 * 60 * 60 * 1000);
            const variation = (Math.random() - 0.5) * 0.1; // ±5%
            const price = basePrice * (1 + variation);
            data.push([timestamp, price]);
        }
        
        return data;
    }
}

// Instancia global de la API
const cryptoAPI = new CryptoAPI();