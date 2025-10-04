// Componente de Modales
class ModalsComponent {
    static showProfileModal() {
        const user = QuantumDB.currentUser;
        const isWeb3User = user?.web3User || false;

        const modalHTML = `
            <div class="modal" id="profileModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Mi Perfil</h2>
                        <button class="close-modal" onclick="ModalsComponent.hideModal('profileModal')">&times;</button>
                    </div>

                    <div class="profile-header">
                        <div class="profile-avatar">${user.avatar}</div>
                        <div class="profile-name">${user.name}</div>
                        <div class="profile-email">${user.email}</div>
                        ${isWeb3User ? '<div class="profile-badge" style="background: var(--success); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7em; margin-top: 5px;">Web3</div>' : ''}
                    </div>

                    ${isWeb3User ? `
                        <div class="profile-modal-item" style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success);">
                            <div class="profile-modal-icon" style="background: var(--success);">
                                <i class="fab fa-ethereum"></i>
                            </div>
                            <div class="profile-modal-text">
                                <div class="profile-modal-title">Wallet Conectada</div>
                                <div class="profile-modal-subtitle">${user.walletAddress?.substring(0, 10)}...${user.walletAddress?.substring(user.walletAddress.length - 8)}</div>
                            </div>
                            <div style="color: var(--success); font-size: 0.8em;">
                                <i class="fas fa-check-circle"></i> Activa
                            </div>
                        </div>
                    ` : ''}

                    <div class="profile-modal-item">
                        <div class="profile-modal-icon">
                            <i class="fas fa-user-edit"></i>
                        </div>
                        <div class="profile-modal-text">
                            <div class="profile-modal-title">Editar Perfil</div>
                            <div class="profile-modal-subtitle">Actualiza tu información personal</div>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                    </div>

                    <div class="profile-modal-item" onclick="${isWeb3User ? 'Web3WalletComponent.disconnect()' : 'LoginComponent.logout()'}">
                        <div class="profile-modal-icon" style="background: var(--danger);">
                            <i class="fas fa-sign-out-alt"></i>
                        </div>
                        <div class="profile-modal-text">
                            <div class="profile-modal-title">${isWeb3User ? 'Desconectar Wallet' : 'Cerrar Sesión'}</div>
                            <div class="profile-modal-subtitle">${isWeb3User ? 'Desconectar MetaMask' : 'Salir de tu cuenta'}</div>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--text-tertiary);"></i>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('profileModal').style.display = 'flex';
    }

    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    }

    static showSendModal() {
        Helpers.showNotification('Funcionalidad de envío');
    }

    static showReceiveModal() {
        Helpers.showNotification('Funcionalidad de recepción');
    }

    static showSwapModal() {
        Helpers.showNotification('Funcionalidad de intercambio');
    }

    static showBuyModal() {
        // Delegar al componente especializado de compra
        if (typeof QuantumBuyComponent !== 'undefined') {
            QuantumBuyComponent.showBuyModal();
        } else {
            console.error('QuantumBuyComponent no está definido. Verifica que los scripts estén cargados correctamente.');
            Helpers.showNotification('Sistema de compra no disponible. Recarga la página.', 'error');
        }
    }
   
    static showTradeModal(type) {
        const assetName = type === 'buy' ? 'comprar' : 'vender';
        Helpers.showNotification(`Funcionalidad de ${assetName} en desarrollo`);
        
        // Modal temporal de trade
        const modalHTML = `
            <div class="modal" id="tradeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${type === 'buy' ? 'Comprar' : 'Vender'} Activo</h2>
                        <button class="close-modal" onclick="ModalsComponent.hideModal('tradeModal')">&times;</button>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cantidad</label>
                        <input type="number" class="form-input" placeholder="0.0" id="tradeAmount">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Precio</label>
                        <input type="text" class="form-input" value="$50,000" readonly>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Total</label>
                        <input type="text" class="form-input" value="$0.00" readonly>
                    </div>
                    <button class="btn btn-primary" onclick="ModalsComponent.executeTrade('${type}')">
                        Confirmar ${type === 'buy' ? 'Compra' : 'Venta'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('tradeModal').style.display = 'flex';
    }
    
    static executeTrade(type) {
        const amount = parseFloat(document.getElementById('tradeAmount').value);

        if (!amount || amount <= 0) {
            Helpers.showNotification('Ingresa una cantidad válida', 'error');
            return;
        }

        Helpers.showNotification(`Orden de ${type} ejecutada por ${amount}`);
        this.hideModal('tradeModal');
    }

    static showRegisterModal() {
        const modalHTML = `
            <div class="modal" id="registerModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Crear Cuenta</h2>
                        <button class="close-modal" onclick="ModalsComponent.hideModal('registerModal')">&times;</button>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Nombre completo (opcional)</label>
                        <input type="text" class="form-input" id="registerName" placeholder="Tu nombre">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Correo electrónico *</label>
                        <input type="email" class="form-input" id="registerEmail" placeholder="tu@email.com" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Contraseña *</label>
                        <input type="password" class="form-input" id="registerPassword" placeholder="Mínimo 6 caracteres" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Confirmar contraseña *</label>
                        <input type="password" class="form-input" id="registerPasswordConfirm" placeholder="Repite tu contraseña" required>
                    </div>

                    <button class="btn btn-primary" onclick="ModalsComponent.registerUser()">
                        Crear Cuenta
                    </button>

                    <p style="text-align: center; margin-top: 15px; font-size: 13px; color: var(--text-secondary);">
                        ¿Ya tienes cuenta? <a href="#" onclick="ModalsComponent.hideModal('registerModal')" style="color: var(--primary);">Inicia sesión</a>
                    </p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('registerModal').style.display = 'flex';
    }

    static registerUser() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerPasswordConfirm').value;

        // Validation
        if (!email || !password) {
            Helpers.showNotification('Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Helpers.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            Helpers.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        // Register user
        const result = QuantumDB.register(email, password, name);

        if (result.success) {
            Helpers.showNotification('Cuenta creada exitosamente!', 'success');
            this.hideModal('registerModal');

            // Optionally auto-login
            setTimeout(() => {
                LoginComponent.login();
            }, 1000);
        } else {
            Helpers.showNotification(result.error, 'error');
        }
    }
}
