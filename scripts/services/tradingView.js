// Servicio para integración con TradingView
class TradingViewService {
    constructor() {
        this.widgets = {};
        this.currentSymbol = 'BTCUSD';
    }

    // Crear widget de TradingView
    createWidget(containerId, symbol = 'BINANCE:BTCUSDT', interval = '15', theme = 'dark') {
        // Limpiar contenedor previo
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Contenedor no encontrado:', containerId);
            return;
        }

        container.innerHTML = '';

        // Crear iframe con el widget de TradingView
        const widgetHTML = `
            <div class="tradingview-widget-container">
                <div id="tradingview_${containerId}" style="height: 400px;"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
                {
                    "autosize": true,
                    "symbol": "${symbol}",
                    "interval": "${interval}",
                    "timezone": "America/Mexico_City",
                    "theme": "${theme}",
                    "style": "1",
                    "locale": "es",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_${containerId}",
                    "studies": [
                        "RSI@tv-basicstudies",
                        "MACD@tv-basicstudies"
                    ],
                    "show_popup_button": true,
                    "popup_width": "1000",
                    "popup_height": "650"
                }
                </script>
            </div>
        `;

        container.innerHTML = widgetHTML;
        this.widgets[containerId] = symbol;
    }

    // Cambiar símbolo en el widget
    changeSymbol(containerId, symbol) {
        if (this.widgets[containerId]) {
            this.createWidget(containerId, symbol);
        }
    }

    // Crear widget de mini gráfico
    createMiniChart(containerId, symbol = 'BINANCE:BTCUSDT') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
                {
                    "symbol": "${symbol}",
                    "width": "100%",
                    "height": "220",
                    "locale": "es",
                    "dateRange": "12M",
                    "colorTheme": "dark",
                    "trendLineColor": "#37a6ef",
                    "underLineColor": "rgba(55, 166, 239, 0.15)",
                    "underLineBottomColor": "rgba(55, 166, 239, 0)",
                    "isTransparent": false,
                    "autosize": true,
                    "largeChartUrl": ""
                }
                </script>
            </div>
        `;
    }

    // Obtener lista de símbolos populares
    getPopularSymbols() {
        return [
            { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin / USDT' },
            { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum / USDT' },
            { symbol: 'BINANCE:SOLUSDT', name: 'Solana / USDT' },
            { symbol: 'BINANCE:ADAUSDT', name: 'Cardano / USDT' },
            { symbol: 'BINANCE:DOTUSDT', name: 'Polkadot / USDT' },
            { symbol: 'NASDAQ:AAPL', name: 'Apple Inc.' },
            { symbol: 'NASDAQ:TSLA', name: 'Tesla Inc.' },
            { symbol: 'SP:SPX', name: 'S&P 500' }
        ];
    }
}

// Instancia global de TradingView
const tradingViewService = new TradingViewService();
