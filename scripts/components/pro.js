// Componente Pro de Quantum Wallet
class ProComponent {
    static async loadProTab() {
        const mainContent = document.getElementById('mainContent');

        mainContent.innerHTML = `
            <div class="tab-content active" id="pro-tab">
                <div class="section-title">
                    <span>Cursos y Eventos</span>
                    <a href="#" class="see-all" onclick="ProComponent.nextWorkshop()">Siguiente <i class="fas fa-chevron-right"></i></a>
                </div>

                <div class="workshops-carousel" id="workshops-carousel">
                    <div class="carousel-container">
                        <div class="workshop-item active">
                            <div class="workshop-image">
                                <img src="images/qwbp.jpg" alt="Trading Avanzado" style="width: 100%; height: 150px; object-fit: cover; border-radius: 12px;">
                            </div>
                            <div class="workshop-details">
                                <div class="workshop-name">Seminario de Trading Avanzado</div>
                                <div class="workshop-description">Aprende estrategias avanzadas de trading de mano de expertos con años de experiencia en mercados financieros.</div>
                                <div class="workshop-price">
                                    <span class="price">$299 USD</span>
                                    <button class="btn btn-primary btn-sm" onclick="ModalsComponent.showPurchaseModal('Seminario de Trading Avanzado', 299)">Comprar Workshop</button>
                                </div>
                            </div>
                        </div>

                        <div class="workshop-item">
                            <div class="workshop-image">
                                <img src="images/qwbp.jpg" alt="A2A Inversores" style="width: 100%; height: 150px; object-fit: cover; border-radius: 12px;">
                            </div>
                            <div class="workshop-details">
                                <div class="workshop-name">A2A con Inversores Exitosos</div>
                                <div class="workshop-description">Charlas en vivo con traders profesionales que comparten sus experiencias y estrategias de inversión ganadoras.</div>
                                <div class="workshop-price">
                                    <span class="price">$399 USD</span>
                                    <button class="btn btn-primary btn-sm" onclick="ModalsComponent.showPurchaseModal('A2A con Inversores Exitosos', 399)">Comprar Workshop</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="carousel-indicators">
                    <span class="indicator active" onclick="ProComponent.goToWorkshop(0)"></span>
                    <span class="indicator" onclick="ProComponent.goToWorkshop(1)"></span>
                </div>

                <div class="section-title">
                    <span>Suscripciones</span>
                </div>

                <div class="asset-list">
                    <div class="asset-item" onclick="ModalsComponent.showSubscriptionModal('compra-aqui')">
                        <div class="asset-icon" style="background: var(--gradient-main);">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="asset-details">
                            <div class="asset-name">Comprar Aquí</div>
                            <div class="asset-amount">Acceso inmediato a workshops y cursos</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-price">Desde $99</div>
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>

                    <div class="asset-item" onclick="ModalsComponent.showSubscriptionModal('mensual')">
                        <div class="asset-icon" style="background: var(--primary);">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="asset-details">
                            <div class="asset-name">Suscripción Mensual</div>
                            <div class="asset-amount">Acceso ilimitado a todos los contenidos Pro</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-price">$29/mes</div>
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>

                    <div class="asset-item" onclick="ModalsComponent.showSubscriptionModal('trimestral')">
                        <div class="asset-icon" style="background: var(--secondary);">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="asset-details">
                            <div class="asset-name">Suscripción Trimestral</div>
                            <div class="asset-amount">Ahorra 20% vs mensual • Acceso completo</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-price">$79/tres meses</div>
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>

                    <div class="asset-item" onclick="ModalsComponent.showSubscriptionModal('anual')">
                        <div class="asset-icon" style="background: var(--accent);">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div class="asset-details">
                            <div class="asset-name">Suscripción Anual</div>
                            <div class="asset-amount">Ahorra 40% vs mensual • Beneficios exclusivos</div>
                        </div>
                        <div class="asset-value">
                            <div class="asset-price">$299/año</div>
                            <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inicializar el carousel
        this.currentWorkshopIndex = 0;
        this.initializeCarousel();
    }

    static initializeCarousel() {
        // Auto-rotar el carousel cada 5 segundos
        setInterval(() => {
            this.nextWorkshop();
        }, 5000);
    }

    static nextWorkshop() {
        const workshops = document.querySelectorAll('.workshop-item');
        const indicators = document.querySelectorAll('.indicator');

        if (workshops.length === 0) return;

        workshops[this.currentWorkshopIndex].classList.remove('active');
        indicators[this.currentWorkshopIndex].classList.remove('active');

        this.currentWorkshopIndex = (this.currentWorkshopIndex + 1) % workshops.length;

        workshops[this.currentWorkshopIndex].classList.add('active');
        indicators[this.currentWorkshopIndex].classList.add('active');
    }

    static goToWorkshop(index) {
        const workshops = document.querySelectorAll('.workshop-item');
        const indicators = document.querySelectorAll('.indicator');

        if (index < 0 || index >= workshops.length) return;

        workshops[this.currentWorkshopIndex].classList.remove('active');
        indicators[this.currentWorkshopIndex].classList.remove('active');

        this.currentWorkshopIndex = index;

        workshops[this.currentWorkshopIndex].classList.add('active');
        indicators[this.currentWorkshopIndex].classList.add('active');
    }
}

// Inicializar variables estáticas
ProComponent.currentWorkshopIndex = 0;
