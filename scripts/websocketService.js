// Servicio de WebSockets para datos en tiempo real
class WebSocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.subscriptions = new Set();
        this.messageHandlers = new Map();
    }

    // Conectar a WebSocket
    connect() {
        return new Promise((resolve, reject) => {
            try {
                // Usaremos Binance WebSocket para datos reales
                this.socket = new WebSocket('wss://stream.binance.com:9443/ws');
                
                this.socket.onopen = () => {
                    this.isConnected = true;
                    console.log('WebSocket conectado');
                    Helpers.showNotification('Conexión en tiempo real activa');
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };

                this.socket.onclose = () => {
                    this.isConnected = false;
                    console.log('WebSocket desconectado');
                    // Reconectar después de 5 segundos
                    setTimeout(() => this.connect(), 5000);
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    // Suscribirse a un símbolo
    subscribe(symbol) {
        if (!this.isConnected || !this.socket) {
            console.warn('WebSocket no conectado');
            return;
        }

        const stream = `${symbol.toLowerCase()}@ticker`;
        const message = {
            method: 'SUBSCRIBE',
            params: [stream],
            id: Date.now()
        };

        this.socket.send(JSON.stringify(message));
        this.subscriptions.add(symbol);
    }

    // Desuscribirse
    unsubscribe(symbol) {
        if (!this.isConnected || !this.socket) return;

        const stream = `${symbol.toLowerCase()}@ticker`;
        const message = {
            method: 'UNSUBSCRIBE',
            params: [stream],
            id: Date.now()
        };

        this.socket.send(JSON.stringify(message));
        this.subscriptions.delete(symbol);
    }

    // Manejar mensajes entrantes
    handleMessage(data) {
        if (data.e === '24hrTicker') {
            this.handleTickerUpdate(data);
        }
    }

    // Actualizar datos del ticker
    handleTickerUpdate(tickerData) {
        const symbol = tickerData.s.replace('USDT', '');
        const price = parseFloat(tickerData.c);
        const change = parseFloat(tickerData.P);
        const changePercent = parseFloat(tickerData.p);

        // Actualizar datos en tiempo real
        if (ChartsComponent.realTimeData[symbol]) {
            ChartsComponent.realTimeData[symbol].price = price;
            ChartsComponent.realTimeData[symbol].change = changePercent;
            ChartsComponent.updatePriceDisplay();
        }

        // Disparar evento personalizado
        const event = new CustomEvent('priceUpdate', {
            detail: {
                symbol: symbol,
                price: price,
                change: changePercent,
                data: tickerData
            }
        });
        document.dispatchEvent(event);
    }

    // Registrar manejador de mensajes
    on(event, handler) {
        if (!this.messageHandlers.has(event)) {
            this.messageHandlers.set(event, []);
        }
        this.messageHandlers.get(event).push(handler);
    }

    // Desconectar
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.isConnected = false;
        }
    }
}

// Instancia global del servicio WebSocket
const webSocketService = new WebSocketService();

// Inicializar WebSocket cuando la aplicación cargue
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await webSocketService.connect();
        
        // Suscribirse a símbolos populares
        const popularSymbols = ['btcusdt', 'ethusdt', 'solusdt', 'adausdt', 'dotusdt'];
        popularSymbols.forEach(symbol => {
            setTimeout(() => webSocketService.subscribe(symbol), 1000);
        });

    } catch (error) {
        console.error('Error inicializando WebSocket:', error);
    }
});