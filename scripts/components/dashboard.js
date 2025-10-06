// Componente del Dashboard Principal
class DashboardComponent {
    static currentTab = 'home';
    static balanceVisible = true;
    static currentMarket = 'crypto';

    static async loadHomeTab() {
        const portfolio = await QuantumAPI.getPortfolio();
        const mainContent = document.getElementById('mainContent');
        
        // Verificar si portfolio existe
        if (!portfolio) {
            mainContent.innerHTML = `
                <div class="tab-content active" id="home-tab">
                    <div class="balance-card">
                        <div class="balance-label">Balance Total</div>
                        <div class="balance-amount">$0.00</div>
                        <div class="balance-mxn">≈ $0.00 MXN</div>
                    </div>
                    <p style="text-align: center; color: var(--text-secondary); padding: 20px;">
                        Error cargando el portfolio. Intenta recargar la página.
                    </p>
                </div>
            `;
            return;
        }
        
        mainContent.innerHTML = `
            <div class="tab-content active" id="home-tab">
                <div class="balance-card">
                    <div class="balance-label">Balance Total</div>
                    <div class="balance-amount" id="balanceAmount">${Helpers.formatCurrency(portfolio.balance)}</div>
                    <div class="balance-mxn">
                        <span id="balanceMXN">≈ ${Helpers.formatCurrency(portfolio.balance * 19)} MXN</span>
                        <button class="eye-toggle" id="eyeToggle" onclick="DashboardComponent.toggleBalance()">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="actions">
                    <button class="action-btn" onclick="ModalsComponent.showSendModal()">
                        <div class="action-icon"><i class="fas fa-paper-plane"></i></div>
                        <div class="action-label">Enviar</div>
                    </button>
                    <button class="action-btn" onclick="ModalsComponent.showReceiveModal()">
                        <div class="action-icon"><i class="fas fa-download"></i></div>
                        <div class="action-label">Recibir</div>
                    </button>
                    <button class="action-btn" onclick="ModalsComponent.showSwapModal()">
                        <div class="action-icon"><i class="fas fa-exchange-alt"></i></div>
                        <div class="action-label">Convertir</div>
                    </button>
                    <button class="action-btn" onclick="QuantumBuyComponent.showBuyModal()">
                        <div class="action-icon"><i class="fas fa-plus"></i></div>
                        <div class="action-label">Comprar</div>
                    </button>
                </div>

                <div class="markets-tabs">
                    <div class="market-tab active" onclick="DashboardComponent.switchMarket('crypto')">Crypto</div>
                    <div class="market-tab" onclick="DashboardComponent.switchMarket('stocks')">Acciones</div>
                    <div class="market-tab" onclick="DashboardComponent.switchMarket('etfs')">ETFs</div>
                    <div class="market-tab" onclick="DashboardComponent.switchMarket('futures')">Futuros</div>
                </div>
                
                <div class="section-title">
                    <span>Tus Activos</span>
                    <a href="#" class="see-all" onclick="DashboardComponent.refreshPortfolio()">Actualizar <i class="fas fa-sync-alt"></i></a>
                </div>
                
                <div class="asset-list" id="crypto-assets">
                    ${this.renderAssets(portfolio.assets, 'crypto')}
                </div>

                <div class="asset-list hidden" id="stocks-assets">
                    ${this.renderAssets(portfolio.assets, 'stocks')}
                </div>



                <div class="section-title">
                    <span>Noticias del Mercado</span>
                    <a href="#" class="see-all">Ver todas <i class="fas fa-chevron-right"></i></a>
                </div>

                <div class="news-feed">
                    <div class="news-item">
                        <div class="news-icon">
                            <i class="fas fa-newspaper"></i>
                        </div>
                        <div class="news-content">
                            <div class="news-title">Bitcoin supera los $57,000</div>
                            <div class="news-excerpt">El precio de Bitcoin continúa mostrando fortaleza en el mercado...</div>
                            <div class="news-time">Hace 2 horas</div>
                        </div>
                    </div>
                    
                    <div class="news-item">
                        <div class="news-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="news-content">
                            <div class="news-title">Ethereum se prepara para actualización</div>
                            <div class="news-excerpt">La próxima actualización de Ethereum podría mejorar significativamente...</div>
                            <div class="news-time">Hace 5 horas</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inicializar gráfico interactivo si existe
        this.initializeHomeChart();
    }

    static renderAssets(assets, type) {
        if (!assets || !Array.isArray(assets)) {
            return '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No hay activos para mostrar</p>';
        }

        let filteredAssets = [];
        
        if (type === 'crypto') {
            filteredAssets = assets.filter(a => ['ETH', 'BTC', 'USDC', 'SOL', 'ADA', 'DOT'].includes(a.symbol));
        } else if (type === 'stocks') {
            filteredAssets = assets.filter(a => ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL'].includes(a.symbol));
        } else {
            filteredAssets = assets;
        }

        if (filteredAssets.length === 0) {
            return '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No hay activos en esta categoría</p>';
        }

        return filteredAssets.map(asset => {
            const changeClass = asset.change >= 0 ? 'positive' : 'negative';
            const changeIcon = asset.change >= 0 ? '▲' : '▼';
            
            return `
                <div class="asset-item" onclick="DashboardComponent.showAssetDetails('${asset.symbol}')">
                    <div class="asset-icon" style="background: ${type === 'crypto' ? 'var(--primary)' : Helpers.getStockColor(asset.symbol)};">
                        ${type === 'crypto' ? `<i class="fab fa-${asset.symbol.toLowerCase()}"></i>` : asset.symbol.charAt(0)}
                    </div>
                    <div class="asset-details">
                        <div class="asset-name">${Helpers.getAssetName(asset.symbol)}</div>
                        <div class="asset-amount">${asset.amount} ${asset.symbol}</div>
                    </div>
                    <div class="asset-value">
                        <div class="asset-price">${Helpers.formatCurrency(asset.value)}</div>
                        <div class="asset-change ${changeClass}">${changeIcon} ${Math.abs(asset.change).toFixed(2)}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static initializeHomeChart() {
        // Simular datos de gráfico para el dashboard
        const chart = document.getElementById('btcChart');
        if (chart) {
            // El gráfico SVG ya está incluido en el HTML
            console.log('Gráfico del dashboard inicializado');
        }
    }

    static toggleBalance() {
        const balanceAmount = document.getElementById('balanceAmount');
        const balanceMXN = document.getElementById('balanceMXN');
        const eyeToggle = document.getElementById('eyeToggle');
        
        if (!balanceAmount || !balanceMXN || !eyeToggle) {
            console.warn('Elementos de balance no encontrados');
            return;
        }
        
        this.balanceVisible = !this.balanceVisible;
        
        if (this.balanceVisible) {
            balanceAmount.textContent = '$124,852.40';
            balanceMXN.textContent = '≈ $2,356,420.80 MXN';
            eyeToggle.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            balanceAmount.textContent = '•••••••';
            balanceMXN.textContent = '≈ ••••••••• MXN';
            eyeToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    }

    static async refreshPortfolio() {
        Helpers.showNotification('Actualizando portfolio...');
        
        try {
            await this.loadHomeTab();
            Helpers.showNotification('Portfolio actualizado correctamente');
        } catch (error) {
            console.error('Error actualizando portfolio:', error);
            Helpers.showNotification('Error actualizando portfolio', 'error');
        }
    }

    static async syncData() {
        const syncBtn = document.querySelector('.header-btn:nth-child(2)');
        const originalHtml = syncBtn.innerHTML;
        
        // Mostrar animación de carga
        syncBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        
        Helpers.showNotification('Sincronizando datos...');
        
        try {
            // Simular sincronización
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Recargar datos
            await this.loadHomeTab();
            
            Helpers.showNotification('Datos sincronizados correctamente');
        } catch (error) {
            console.error('Error sincronizando datos:', error);
            Helpers.showNotification('Error sincronizando datos', 'error');
        } finally {
            // Restaurar ícono original
            syncBtn.innerHTML = originalHtml;
        }
    }

    static switchMarket(market) {
        this.currentMarket = market;
        
        // Deactivate all market tabs
        document.querySelectorAll('.market-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Activate selected market tab
        const marketTabs = document.querySelectorAll('.market-tab');
        const activeIndex = Array.from(marketTabs).findIndex(tab => 
            tab.getAttribute('onclick').includes(`'${market}'`)
        );
        
        if (activeIndex >= 0) {
            marketTabs[activeIndex].classList.add('active');
        }
        
        // Hide all asset lists
        document.querySelectorAll('#crypto-assets, #stocks-assets').forEach(list => {
            if (list) list.classList.add('hidden');
        });
        
        // Show selected market assets
        if (market === 'crypto') {
            const cryptoAssets = document.getElementById('crypto-assets');
            if (cryptoAssets) cryptoAssets.classList.remove('hidden');
        } else if (market === 'stocks') {
            const stocksAssets = document.getElementById('stocks-assets');
            if (stocksAssets) stocksAssets.classList.remove('hidden');
        } else {
            // Para ETFs y Futuros, mostrar mensaje
            const cryptoAssets = document.getElementById('crypto-assets');
            if (cryptoAssets) {
                cryptoAssets.classList.remove('hidden');
                cryptoAssets.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Mercado de ${market} en desarrollo</p>`;
            }
        }

        Helpers.showNotification(`Cambiado a mercado: ${market}`);
    }

    static showNotificationCenter() {
        // Implementar centro de notificaciones simple
        const notificationHTML = `
            <div class="modal" id="notificationCenter">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Centro de Notificaciones</h2>
                        <button class="close-modal" onclick="ModalsComponent.hideModal('notificationCenter')">&times;</button>
                    </div>
                    
                    <div class="notification-list">
                        <div class="notification-item success">
                            <div class="notification-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="notification-content">
                                <div class="notification-title">Transacción Exitosa</div>
                                <div class="notification-message">Has comprado 0.05 BTC por $2,117.53</div>
                                <div class="notification-time">Hace 2 horas</div>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="notification-content">
                                <div class="notification-title">Depósito Recibido</div>
                                <div class="notification-message">Se ha depositado $5,000.00 en tu cuenta</div>
                                <div class="notification-time">Ayer</div>
                            </div>
                        </div>
                        
                        <div class="notification-item warning">
                            <div class="notification-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="notification-content">
                                <div class="notification-title">Alerta de Precio</div>
                                <div class="notification-message">BTC ha alcanzado $42,350.60</div>
                                <div class="notification-time">Hace 3 días</div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn" style="margin-top: 15px; background: var(--card-bg); color: var(--text-primary); border: 1px solid var(--border);">
                        <i class="fas fa-trash"></i> Limpiar Todas
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
        document.getElementById('notificationCenter').style.display = 'flex';
    }

    static showAssetDetails(symbol) {
        const portfolio = QuantumDB.currentUser?.portfolio;
        if (!portfolio) return;

        const asset = portfolio.assets.find(a => a.symbol === symbol);
        if (!asset) return;

        const modalHTML = `
            <div class="modal" id="assetDetailsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Detalles de ${symbol}</h2>
                        <button class="close-modal" onclick="ModalsComponent.hideModal('assetDetailsModal')">&times;</button>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div class="asset-icon" style="width: 60px; height: 60px; margin: 0 auto; background: ${Helpers.getStockColor(symbol)};">
                            ${['BTC', 'ETH', 'USDC', 'SOL', 'ADA', 'DOT'].includes(symbol) ? `<i class="fab fa-${symbol.toLowerCase()}"></i>` : symbol.charAt(0)}
                        </div>
                    </div>
                    
                    <div class="asset-details-grid">
                        <div class="detail-card">
                            <div class="detail-label">En tu portfolio</div>
                            <div class="detail-value">${asset.amount} ${symbol}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-label">Valor total</div>
                            <div class="detail-value">${Helpers.formatCurrency(asset.value)}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-label">Cambio 24h</div>
                            <div class="detail-value ${asset.change >= 0 ? 'positive' : 'negative'}">${asset.change >= 0 ? '+' : ''}${asset.change}%</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-label">Rendimiento</div>
                            <div class="detail-value ${asset.change >= 0 ? 'positive' : 'negative'}">${asset.change >= 0 ? '▲' : '▼'} ${Math.abs(asset.change)}%</div>
                        </div>
                    </div>
                    
                    <div class="section-title" style="margin: 20px 0 10px 0;">
                        <span>Acciones Rápidas</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <button class="btn btn-primary" onclick="ModalsComponent.showTradeModal('buy')">Comprar</button>
                        <button class="btn" style="background: var(--danger); color: white;" onclick="ModalsComponent.showTradeModal('sell')">Vender</button>
                    </div>
                    
                    <button class="btn" style="background: var(--warning); color: white;" onclick="ChartsComponent.showAlertModal('${symbol}')">
                        <i class="fas fa-bell"></i> Crear Alerta
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('assetDetailsModal').style.display = 'flex';
    }

    // Método para cargar datos de mercado en tiempo real
    static async loadRealTimeData() {
        try {
            const prices = await cryptoAPI.getCryptoPrices();
            this.updateRealTimePrices(prices);
        } catch (error) {
            console.error('Error cargando datos en tiempo real:', error);
        }
    }

    static updateRealTimePrices(prices) {
        // Actualizar precios en los activos si es necesario
        console.log('Precios actualizados:', prices);
    }

    // Método para iniciar actualizaciones automáticas
    static startAutoUpdates() {
        // Actualizar cada 30 segundos
        setInterval(() => {
            this.loadRealTimeData();
        }, 30000);
    }
}

// Hacer componentes disponibles globalmente para compatibilidad
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que QuantumBuyComponent esté disponible
    if (typeof QuantumBuyComponent !== 'undefined') {
        console.log('✅ QuantumBuyComponent cargado correctamente');
    } else {
        console.warn('⚠️ QuantumBuyComponent no está disponible');
    }

    // Iniciar actualizaciones después de un breve delay
    setTimeout(() => {
        DashboardComponent.startAutoUpdates();
    }, 5000);
});
