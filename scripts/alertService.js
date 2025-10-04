// Servicio de alertas de precio
class AlertService {
    constructor() {
        this.alerts = JSON.parse(localStorage.getItem('quantumAlerts')) || [];
        this.isMonitoring = false;
    }

    // Crear nueva alerta
    createAlert(symbol, targetPrice, condition, notification = true) {
        const alert = {
            id: Date.now().toString(),
            symbol: symbol.toUpperCase(),
            targetPrice: parseFloat(targetPrice),
            condition: condition, // 'above' or 'below'
            active: true,
            createdAt: new Date().toISOString(),
            triggered: false
        };

        this.alerts.push(alert);
        this.saveAlerts();

        if (notification) {
            Helpers.showNotification(`Alerta creada para ${symbol} a $${targetPrice}`);
        }

        return alert;
    }

    // Eliminar alerta
    removeAlert(alertId) {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
        this.saveAlerts();
        Helpers.showNotification('Alerta eliminada');
    }

    // Verificar alertas contra el precio actual
    checkAlerts(currentPrices) {
        if (!this.isMonitoring) return;

        this.alerts.forEach(alert => {
            if (!alert.active || alert.triggered) return;

            const currentPrice = currentPrices[alert.symbol]?.price;
            if (!currentPrice) return;

            let shouldTrigger = false;

            if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
                shouldTrigger = true;
            } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
                shouldTrigger = true;
            }

            if (shouldTrigger) {
                this.triggerAlert(alert, currentPrice);
            }
        });
    }

    // Disparar alerta
    triggerAlert(alert, currentPrice) {
        alert.triggered = true;
        alert.triggeredAt = new Date().toISOString();
        this.saveAlerts();

        // Mostrar notificación
        const message = `🚨 ${alert.symbol} alcanzó $${currentPrice} (Objetivo: $${alert.targetPrice})`;
        Helpers.showNotification(message, 'warning');

        // Sonido de alerta (opcional)
        this.playAlertSound();

        // Podrías agregar notificaciones push aquí
    }

    // Reproducir sonido de alerta
    playAlertSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAABAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAABQTEFNRTMuMTAwBKkAAAAAAAAAADUgJAOHQQAB9AAAC');
            audio.volume = 0.3;
            audio.play();
        } catch (error) {
            console.log('No se pudo reproducir sonido de alerta');
        }
    }

    // Iniciar monitoreo
    startMonitoring() {
        this.isMonitoring = true;
        console.log('Monitoreo de alertas iniciado');
    }

    // Detener monitoreo
    stopMonitoring() {
        this.isMonitoring = false;
    }

    // Guardar alertas en localStorage
    saveAlerts() {
        localStorage.setItem('quantumAlerts', JSON.stringify(this.alerts));
    }

    // Obtener alertas activas
    getActiveAlerts() {
        return this.alerts.filter(alert => alert.active && !alert.triggered);
    }

    // Obtener alertas por símbolo
    getAlertsBySymbol(symbol) {
        return this.alerts.filter(alert => alert.symbol === symbol.toUpperCase());
    }
}

// Instancia global del servicio de alertas
const alertService = new AlertService();

// Integrar con WebSocket para monitoreo en tiempo real
document.addEventListener('priceUpdate', (event) => {
    const { symbol, price } = event.detail;
    const currentPrices = { [symbol]: { price } };
    alertService.checkAlerts(currentPrices);
});