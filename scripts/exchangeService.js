// Servicio multi-exchange
class ExchangeService {
    constructor() {
        this.exchanges = {
            'binance': 'https://api.binance.com/api/v3',
            'coinbase': 'https://api.coinbase.com/v2',
            'kraken': 'https://api.kraken.com/0/public'
        };
    }

    // Obtener precios de múltiples exchanges
    async getMultiExchangePrice(symbol) {
        try {
            const [binancePrice, coinbasePrice, krakenPrice] = await Promise.allSettled([
                this.getBinancePrice(symbol),
                this.getCoinbasePrice(symbol),
                this.getKrakenPrice(symbol)
            ]);

            return {
                binance: binancePrice.status === 'fulfilled' ? binancePrice.value : null,
                coinbase: coinbasePrice.status === 'fulfilled' ? coinbasePrice.value : null,
                kraken: krakenPrice.status === 'fulfilled' ? krakenPrice.value : null
            };
        } catch (error) {
            console.error('Error obteniendo precios multi-exchange:', error);
            return {};
        }
    }

    // Binance API
    async getBinancePrice(symbol = 'BTCUSDT') {
        try {
            const response = await fetch(`${this.exchanges.binance}/ticker/price?symbol=${symbol}`);
            if (!response.ok) throw new Error('Binance API error');
            const data = await response.json();
            return { price: parseFloat(data.price), exchange: 'Binance' };
        } catch (error) {
            console.error('Error Binance:', error);
            return null;
        }
    }

    // Coinbase API
    async getCoinbasePrice(symbol = 'BTC-USD') {
        try {
            const response = await fetch(`${this.exchanges.coinbase}/prices/${symbol}/spot`);
            if (!response.ok) throw new Error('Coinbase API error');
            const data = await response.json();
            return { price: parseFloat(data.data.amount), exchange: 'Coinbase' };
        } catch (error) {
            console.error('Error Coinbase:', error);
            return null;
        }
    }

    // Kraken API
    async getKrakenPrice(pair = 'XBTUSD') {
        try {
            const response = await fetch(`${this.exchanges.kraken}/Ticker?pair=${pair}`);
            if (!response.ok) throw new Error('Kraken API error');
            const data = await response.json();
            const resultKey = Object.keys(data.result)[0];
            return { 
                price: parseFloat(data.result[resultKey].c[0]), 
                exchange: 'Kraken' 
            };
        } catch (error) {
            console.error('Error Kraken:', error);
            return null;
        }
    }

    // Obtener el mejor precio para compra/venta
    async getBestPrice(symbol) {
        const prices = await this.getMultiExchangePrice(symbol);
        const validPrices = Object.values(prices).filter(price => price !== null);
        
        if (validPrices.length === 0) return null;

        // Encontrar el precio más bajo para compra
        const bestBuy = validPrices.reduce((best, current) => 
            current.price < best.price ? current : best
        );

        // Encontrar el precio más alto para venta
        const bestSell = validPrices.reduce((best, current) => 
            current.price > best.price ? current : best
        );

        return {
            bestBuy,
            bestSell,
            spread: bestSell.price - bestBuy.price,
            spreadPercent: ((bestSell.price - bestBuy.price) / bestBuy.price * 100).toFixed(2)
        };
    }
}

// Instancia global del servicio de exchanges
const exchangeService = new ExchangeService();