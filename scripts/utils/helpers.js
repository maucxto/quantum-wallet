// Funciones auxiliares para Quantum Wallet
class Helpers {
    static getAssetName(symbol) {
        const names = {
            'ETH': 'Ethereum',
            'BTC': 'Bitcoin',
            'USDC': 'USDC',
            'SOL': 'Solana',
            'ADA': 'Cardano',
            'DOT': 'Polkadot',
            'AAPL': 'Apple Inc.',
            'TSLA': 'Tesla Inc.',
            'MSFT': 'Microsoft Corp.',
            'AMZN': 'Amazon.com Inc.',
            'GOOGL': 'Alphabet Inc.'
        };
        return names[symbol] || symbol;
    }

    static getStockColor(symbol) {
        const colors = {
            'AAPL': '#333',
            'TSLA': '#e82127',
            'MSFT': '#0070c0',
            'AMZN': '#ff9900',
            'GOOGL': '#4285f4'
        };
        return colors[symbol] || 'var(--primary)';
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    static showNotification(message, type = 'success') {
        // Eliminar notificación existente si hay alguna
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const iconColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}" style="color: ${iconColor};"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Eliminar notificación después de la animación
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    static getAssetIcon(symbol) {
    const cryptoIcons = ['BTC', 'ETH', 'USDC', 'SOL', 'ADA', 'DOT'];
    if (cryptoIcons.includes(symbol)) {
        return `<i class="fab fa-${symbol.toLowerCase()}"></i>`;
    }
    return symbol.charAt(0);
}
}