// Aplicación Principal de Quantum Wallet
class QuantumApp {
    constructor() {
        this.currentTab = 'home';
        this.init();
    }

    async init() {
        // Inicializar la aplicación
        await this.loadTab('home');
        this.setupEventListeners();

        // Inicializar login systems si estamos en pantalla de login
        this.initLoginSystems();

        // Cargar datos iniciales de criptomonedas
        this.preloadCryptoData();
    }

    async initLoginSystems() {
        // Inicializar sistema de login con thirdweb cuando el DOM esté listo
        if (document.getElementById('loginScreen')) {
            console.log('🚀 Inicializando sistemas de login...');

            try {
                // Inicializar Web3 login simple
                console.log('🚀 Inicializando login Web3 simple');

                // Renderizar opciones de login Web3
                await web3Login.renderLoginOptions();
                console.log('✅ Opciones de login Web3 renderizadas');

            } catch (error) {
                console.error('❌ Error inicializando sistemas de login Web3:', error);
            }
        } else {
            console.log('❌ No se encontró loginScreen');
        }
    }

    async waitForThirdweb() {
        // Esperar hasta 10 segundos a que thirdweb esté disponible
        const maxAttempts = 40; // 40 intentos x 250ms = 10 segundos
        let attempts = 0;

        return new Promise((resolve) => {
            const checkThirdweb = () => {
                attempts++;
                if (typeof thirdweb !== 'undefined') {
                    console.log(`✅ Thirdweb cargado después de ${attempts} intentos`);
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    console.log('❌ Tercer cargado después del límite de tiempo');
                    resolve(false);
                } else {
                    setTimeout(checkThirdweb, 250);
                }
            };
            checkThirdweb();
        });
    }

    async loadTab(tabName) {
        this.currentTab = tabName;
        
        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const navItems = document.querySelectorAll('.nav-item');
        const activeIndex = Array.from(navItems).findIndex(item => 
            item.getAttribute('onclick').includes(`'${tabName}'`)
        );
        
        if (activeIndex >= 0) {
            navItems[activeIndex].classList.add('active');
        }
        
        // Cargar contenido de la pestaña
        switch(tabName) {
            case 'home':
                await DashboardComponent.loadHomeTab();
                break;
            case 'academy':
                await AcademyComponent.loadAcademyTab();
                break;
            case 'charts':
                await ChartsComponent.loadChartsTab();
                break;
            case 'pro':
                await ProComponent.loadProTab();
                break;
            case 'profile':
                await this.loadProfileTab();
                break;
        }
    }

    async loadMarketsTab() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div class="tab-content active" id="markets-tab">
                <div class="section-title">
                    <span>Mercados en Tiempo Real</span>
                    <a href="#" class="see-all" onclick="app.refreshMarkets()">Actualizar <i class="fas fa-sync-alt"></i></a>
                </div>

                <div class="search-bar">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Buscar criptomonedas..." oninput="app.searchMarkets(this.value)">
                </div>

                <div class="markets-tabs">
                    <div class="market-tab active" onclick="app.switchMarketType('crypto')">Criptomonedas</div>
                    <div class="market-tab" onclick="app.switchMarketType('stocks')">Acciones</div>
                    <div class="market-tab" onclick="app.switchMarketType('forex')">Forex</div>
                </div>

                <div class="asset-list" id="markets-list">
                    <div class="loading-text">Cargando datos de mercado...</div>
                </div>
            </div>
        `;

        await this.loadMarketData();
    }

    async loadProfileTab() {
        const mainContent = document.getElementById('mainContent');
        const user = QuantumDB.currentUser;
        
        mainContent.innerHTML = `
            <div class="tab-content active" id="profile-tab">
                <div class="profile-header">
                    <div class="profile-avatar">${user.avatar}</div>
                    <div class="profile-name">${user.name}</div>
                    <div class="profile-email">${user.email}</div>
                </div>
                
                <div class="section-title">
                    <span>Mi Cuenta</span>
                </div>
                
                <div class="asset-list">
                    <div class="asset-item" onclick="ModalsComponent.showSecuritySettings()">
                        <div class="asset-icon" style="background: var(--success);"><i class="fas fa-shield-alt"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Seguridad</div>
                            <div class="asset-amount">Autenticación de dos factores, contraseña</div>
                        </div>
                        <div class="asset-value">
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>
                    
                    <div class="asset-item" onclick="ModalsComponent.showNotificationsSettings()">
                        <div class="asset-icon" style="background: var(--warning);"><i class="fas fa-bell"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Notificaciones</div>
                            <div class="asset-amount">Alertas de precios, transacciones</div>
                        </div>
                        <div class="asset-value">
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>
                    
                    <div class="asset-item" onclick="ModalsComponent.showBackupSettings()">
                        <div class="asset-icon" style="background: var(--accent);"><i class="fas fa-key"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Respaldar Wallet</div>
                            <div class="asset-amount">Frase de recuperación de 12 palabras</div>
                        </div>
                        <div class="asset-value">
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>
                </div>

                <div class="section-title">
                    <span>Preferencias</span>
                </div>

                <div class="asset-list">
                    <div class="asset-item" onclick="ModalsComponent.showAppearanceSettings()">
                        <div class="asset-icon" style="background: var(--primary);"><i class="fas fa-paint-brush"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Apariencia</div>
                            <div class="asset-amount">Tema claro/oscuro, idioma</div>
                        </div>
                        <div class="asset-value">
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>

                    <div class="asset-item" onclick="ModalsComponent.showPrivacySettings()">
                        <div class="asset-icon" style="background: var(--secondary);"><i class="fas fa-user-lock"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Privacidad</div>
                            <div class="asset-amount">Configuración de datos y privacidad</div>
                        </div>
                        <div class="asset-value">
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>

                    <div class="asset-item" onclick="ModalsComponent.showHelp()">
                        <div class="asset-icon" style="background: var(--accent);"><i class="fas fa-question-circle"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Ayuda y Soporte</div>
                            <div class="asset-amount">Centro de ayuda, contactar soporte</div>
                        </div>
                        <div class="asset-value">
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>
                </div>

                <div class="section-title">
                    <span>Estadísticas</span>
                </div>

                <div class="asset-list">
                    <div class="asset-item">
                        <div class="asset-icon" style="background: var(--success);"><i class="fas fa-chart-line"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Rendimiento Total</div>
                            <div class="asset-amount">+15.8% en los últimos 30 días</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-change positive">+15.8%</div>
                        </div>
                    </div>

                    <div class="asset-item">
                        <div class="asset-icon" style="background: var(--primary);"><i class="fas fa-exchange-alt"></i></div>
                        <div class="asset-details">
                            <div class="asset-name">Transacciones</div>
                            <div class="asset-amount">24 operaciones este mes</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-change neutral">24</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadMarketData() {
        try {
            const marketsList = document.getElementById('markets-list');
            marketsList.innerHTML = '<div class="loading-text">Cargando datos en tiempo real...</div>';

            const prices = await cryptoAPI.getCryptoPrices();
            
            marketsList.innerHTML = Object.values(prices).map(asset => {
                const changeClass = asset.change >= 0 ? 'positive' : 'negative';
                const changeIcon = asset.change >= 0 ? '▲' : '▼';
                
                return `
                    <div class="asset-item" onclick="app.selectMarketAsset('${asset.symbol}')">
                        <div class="asset-icon">${asset.symbol.charAt(0)}</div>
                        <div class="asset-details">
                            <div class="asset-name">${asset.name}</div>
                            <div class="asset-amount">${asset.symbol}/USD • Volumen: $${(asset.price * 1000000).toLocaleString()}</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-price">${Helpers.formatCurrency(asset.price)}</div>
                            <div class="asset-change ${changeClass}">${changeIcon} ${Math.abs(asset.change).toFixed(2)}%</div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error cargando datos de mercado:', error);
            document.getElementById('markets-list').innerHTML = `
                <div class="error-text">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error cargando datos de mercado</p>
                    <button class="btn btn-primary" onclick="app.loadMarketData()">Reintentar</button>
                </div>
            `;
        }
    }

    async refreshMarkets() {
        Helpers.showNotification('Actualizando datos de mercado...');
        await this.loadMarketData();
        Helpers.showNotification('Mercados actualizados');
    }

    searchMarkets(query) {
        const items = document.querySelectorAll('#markets-list .asset-item');
        
        items.forEach(item => {
            const assetName = item.querySelector('.asset-name').textContent.toLowerCase();
            const assetSymbol = item.querySelector('.asset-amount').textContent.toLowerCase();
            
            if (assetName.includes(query.toLowerCase()) || assetSymbol.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    switchMarketType(type) {
        // Actualizar pestañas de mercado
        document.querySelectorAll('.market-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = Array.from(document.querySelectorAll('.market-tab')).find(tab => 
            tab.getAttribute('onclick').includes(type)
        );
        
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Por ahora solo tenemos criptomonedas, pero se puede expandir
        if (type === 'crypto') {
            this.loadMarketData();
        } else {
            Helpers.showNotification(`Mercado de ${type} próximamente`, 'warning');
        }
    }

    selectMarketAsset(symbol) {
        // Navegar a la pestaña de gráficos con este activo seleccionado
        this.switchTab('charts');
        
        // Esperar a que cargue la pestaña de gráficos y luego seleccionar el activo
        setTimeout(() => {
            if (typeof ChartsComponent !== 'undefined') {
                ChartsComponent.selectAsset(symbol);
            }
        }, 1000);
    }

    async preloadCryptoData() {
        // Precargar datos de criptomonedas en segundo plano
        try {
            await cryptoAPI.getCryptoPrices();
            console.log('Datos de criptomonedas precargados');
        } catch (error) {
            console.log('Usando datos locales para criptomonedas');
        }
    }

    switchTab(tabName) {
        this.loadTab(tabName);
    }

    setupEventListeners() {
        // Agregar interactividad táctil mejorada
        document.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('action-btn') || 
                e.target.classList.contains('asset-item') || 
                e.target.classList.contains('nav-item')) {
                e.target.style.transform = 'scale(0.95)';
                e.target.style.transition = 'transform 0.1s ease';
            }
        });
        
        document.addEventListener('touchend', function(e) {
            if (e.target.classList.contains('action-btn') || 
                e.target.classList.contains('asset-item') || 
                e.target.classList.contains('nav-item')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });

        // Mejorar accesibilidad del teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Cerrar modales con ESC
                const openModal = document.querySelector('.modal[style*="display: flex"]');
                if (openModal) {
                    openModal.style.display = 'none';
                    openModal.remove();
                }
            }
        });
    }

    // Método de login accesible globalmente
    login() {
        LoginComponent.login();
    }

    // Método para manejar errores globalmente
    static handleError(error, context) {
        console.error(`Error en ${context}:`, error);
        Helpers.showNotification(`Error en ${context}. Por favor, intenta nuevamente.`, 'error');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.app = new QuantumApp();
        console.log('🚀 Quantum Wallet inicializada correctamente');
        console.log('📊 APIs integradas: CoinGecko, TradingView');
        console.log('💎 Funcionalidades: Gráficos en tiempo real, Precios live, Trading simulado');
    } catch (error) {
        console.error('❌ Error inicializando Quantum Wallet:', error);
        Helpers.showNotification('Error inicializando la aplicación', 'error');
    }
});

// Prevenir zoom en doble tap para móviles
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Manejar errores no capturados globalmente
window.addEventListener('error', function(e) {
    console.error('Error global no capturado:', e.error);
    QuantumApp.handleError(e.error, 'sistema');
});

// Exportar para uso global (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumApp;
}
