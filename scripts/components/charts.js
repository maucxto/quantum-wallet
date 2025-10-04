// Componente de Gráficos con APIs reales
class ChartsComponent {
    static currentPair = 'BINANCE:BTCUSDT';
    static realTimeData = {};

    static async loadChartsTab() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div class="tab-content active" id="charts-tab">
                <div class="section-title">
                    <span>Gráficos de Trading en Tiempo Real</span>
                </div>

                <div class="trading-pair-selector" id="tradingPairSelector">
                    <!-- Los pares se cargarán dinámicamente -->
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <div class="chart-title" id="chartTitle">BTC/USDT</div>
                        <div class="chart-timeframes">
                            <div class="timeframe-btn active" onclick="ChartsComponent.changeTimeframe('15')">15m</div>
                            <div class="timeframe-btn" onclick="ChartsComponent.changeTimeframe('60')">1h</div>
                            <div class="timeframe-btn" onclick="ChartsComponent.changeTimeframe('240')">4h</div>
                            <div class="timeframe-btn" onclick="ChartsComponent.changeTimeframe('1D')">1D</div>
                        </div>
                    </div>
                    <div id="tradingview-chart" style="height: 400px;"></div>
                </div>

                <div class="section-title">
                    <span>Precios en Tiempo Real</span>
                </div>

                <div class="asset-list" id="realTimePrices">
                    <!-- Los precios se actualizarán en tiempo real -->
                </div>

                <div class="trading-view">
                    <div class="trading-controls">
                        <div class="loading-overlay" id="tradeLoading">
                            <div class="loader"></div>
                        </div>
                        <button class="trade-btn buy-btn" onclick="ModalsComponent.showTradeModal('buy')">Comprar</button>
                        <button class="trade-btn sell-btn" onclick="ModalsComponent.showTradeModal('sell')">Vender</button>
                        <button class="trade-btn" style="background:var(--warning);" onclick="ChartsComponent.showAlertModal('BTC')"><i class="fas fa-bell"></i> Alertas </button>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Cantidad</label>
                        <input type="number" class="form-input" placeholder="0.0" id="tradeAmount" oninput="ChartsComponent.calculateTradeTotal()">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Precio Actual</label>
                        <input type="text" class="form-input" id="currentPrice" value="Cargando..." readonly>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Total</label>
                        <input type="text" class="form-input" id="tradeTotal" value="$0.00" readonly>
                    </div>
                    
                    <button class="btn btn-primary" onclick="ChartsComponent.executeTrade()">Ejecutar Orden</button>
                </div>
            </div>
        `;

        // Inicializar componentes
        await this.initializeCharts();
        await this.loadRealTimePrices();
        this.startPriceUpdates();
    }

    static async initializeCharts() {
        // Cargar selector de pares
        await this.loadTradingPairs();
        
        // Inicializar widget de TradingView
        setTimeout(() => {
            tradingViewService.createWidget('tradingview-chart', this.currentPair, '15');
        }, 1000);
    }

    static async loadTradingPairs() {
        const pairs = tradingViewService.getPopularSymbols();
        const selector = document.getElementById('tradingPairSelector');
        
        selector.innerHTML = pairs.map(pair => `
            <div class="trading-pair ${pair.symbol === this.currentPair ? 'active' : ''}" 
                 onclick="ChartsComponent.switchTradingPair('${pair.symbol}', '${pair.name}')">
                ${pair.name}
            </div>
        `).join('');
    }

    static async loadRealTimePrices() {
        try {
            const prices = await cryptoAPI.getCryptoPrices();
            this.realTimeData = prices;
            this.updatePriceDisplay();
        } catch (error) {
            console.error('Error cargando precios:', error);
            Helpers.showNotification('Error cargando precios en tiempo real', 'error');
        }
    }

    static updatePriceDisplay() {
        const container = document.getElementById('realTimePrices');
        if (!container) return;

        container.innerHTML = Object.values(this.realTimeData).map(asset => {
            const changeClass = asset.change >= 0 ? 'positive' : 'negative';
            const changeIcon = asset.change >= 0 ? '▲' : '▼';
            
            return `
                <div class="asset-item" onclick="ChartsComponent.selectAsset('${asset.symbol}')">
                    <div class="asset-icon">${asset.symbol.charAt(0)}</div>
                    <div class="asset-details">
                        <div class="asset-name">${asset.name}</div>
                        <div class="asset-amount">${asset.symbol}/USD</div>
                    </div>
                    <div class="asset-value">
                        <div class="asset-price">${Helpers.formatCurrency(asset.price)}</div>
                        <div class="asset-change ${changeClass}">${changeIcon} ${Math.abs(asset.change).toFixed(2)}%</div>
                    </div>
                </div>
            `;
        }).join('');

        // Actualizar precio actual para trading
        const currentAsset = this.realTimeData['BTC']; // Bitcoin por defecto
        if (currentAsset) {
            document.getElementById('currentPrice').value = Helpers.formatCurrency(currentAsset.price);
        }
    }

    static startPriceUpdates() {
        // Actualizar precios cada 30 segundos
        setInterval(async () => {
            await this.loadRealTimePrices();
        }, 30000);
    }

    static switchTradingPair(symbol, name) {
        this.currentPair = symbol;
        
        // Actualizar selector
        document.querySelectorAll('.trading-pair').forEach(pair => {
            pair.classList.remove('active');
        });
        
        const activePair = Array.from(document.querySelectorAll('.trading-pair')).find(pair => 
            pair.getAttribute('onclick').includes(symbol)
        );
        
        if (activePair) {
            activePair.classList.add('active');
        }

        // Actualizar título
        document.getElementById('chartTitle').textContent = name;

        // Actualizar widget de TradingView
        tradingViewService.changeSymbol('tradingview-chart', symbol);

        Helpers.showNotification(`Cambiado a ${name}`);
    }

    static changeTimeframe(timeframe) {
        // Actualizar botones de timeframe
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = Array.from(document.querySelectorAll('.timeframe-btn')).find(btn => 
            btn.getAttribute('onclick').includes(timeframe)
        );
        
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Recargar widget con nuevo timeframe
        tradingViewService.createWidget('tradingview-chart', this.currentPair, timeframe);
    }

    static selectAsset(symbol) {
        const asset = this.realTimeData[symbol];
        if (asset) {
            // Encontrar el símbolo correspondiente en TradingView
            const tvSymbol = this.getTradingViewSymbol(symbol);
            if (tvSymbol) {
                this.switchTradingPair(tvSymbol, asset.name);
            }
        }
    }

    static getTradingViewSymbol(symbol) {
        const mapping = {
            'BTC': 'BINANCE:BTCUSDT',
            'ETH': 'BINANCE:ETHUSDT',
            'SOL': 'BINANCE:SOLUSDT',
            'ADA': 'BINANCE:ADAUSDT',
            'DOT': 'BINANCE:DOTUSDT'
        };
        return mapping[symbol];
    }

    static calculateTradeTotal() {
        const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
        const priceText = document.getElementById('currentPrice').value;
        const price = parseFloat(priceText.replace(/[$,]/g, '')) || 0;
        const total = amount * price;
        
        document.getElementById('tradeTotal').value = Helpers.formatCurrency(total);
    }

    static async executeTrade() {
        const amount = parseFloat(document.getElementById('tradeAmount').value);
        
        if (!amount || amount <= 0) {
            Helpers.showNotification('Ingresa una cantidad válida', 'error');
            return;
        }

        // Mostrar loading
        document.getElementById('tradeLoading').style.display = 'flex';

        try {
            // Simular ejecución de trade
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Helpers.showNotification('Orden ejecutada correctamente');
        } catch (error) {
            Helpers.showNotification('Error ejecutando la orden', 'error');
        } finally {
            document.getElementById('tradeLoading').style.display = 'none';
        }
    }
}