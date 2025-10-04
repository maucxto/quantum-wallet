# Sistema de Compra de Crypto - Quantum Wallet

## 🎯 Visión General

El sistema de compra de crypto de Quantum Wallet está diseñado para proporcionar una experiencia de compra fluida y segura, combinando la identidad propia de Quantum con las mejores prácticas de plataformas como Phantom Wallet.

## 🏗️ Arquitectura

### Componentes Principales

```
scripts/components/buy/
├── quantumBuy.js           # Componente principal de compra
├── paymentMethods.js       # Sistema avanzado de métodos de pago
├── moonpayIntegration.js   # Integración con MoonPay (producción)
├── thirdwebIntegration.js  # Integración con Thirdweb (Web3)
├── config.js              # Configuración centralizada
└── README.md              # Esta documentación
```

## 🚀 Inicio Rápido

### 1. Integración Básica

```javascript
// En tu dashboard o componente principal
import { QuantumBuyComponent } from './scripts/components/buy/quantumBuy.js';

// Mostrar modal de compra
QuantumBuyComponent.showBuyModal();
```

### 2. Configuración

```javascript
// Cargar configuración
import { QuantumBuyConfig } from './scripts/components/buy/config.js';

// Personalizar configuración
QuantumBuyConfig.general.minAmount = 50; // Cambiar monto mínimo
QuantumBuyConfig.paymentMethods.applePay.enabled = false; // Deshabilitar Apple Pay
```

## 💳 Métodos de Pago Soportados

### Desarrollo (Simulados) - ¡Competitivos como Phantom!
- **Apple Pay** - 2.5% comisión + $25 MXN (igual que Phantom)
- **Google Pay** - 2.5% comisión + $25 MXN (igual que Phantom)
- **Tarjeta de Débito** - 2.9% comisión + $30 MXN (igual que MoonPay)
- **Tarjeta de Crédito** - 3.5% comisión + $35 MXN (igual que MoonPay)
- **SPEI** - 2.0% comisión + $20 MXN (más económico que competencia)

### Producción (MoonPay)
- **Apple Pay** - Comisión real de MoonPay
- **Google Pay** - Comisión real de MoonPay
- **Tarjetas de crédito/débito** - Comisión real de MoonPay
- **Transferencias bancarias** - Comisión real de MoonPay

## 🌍 Criptomonedas Soportadas

| Cripto | Estado | Redes | Precio Aprox. |
|--------|--------|-------|---------------|
| **BTC** | ✅ Activa | Bitcoin | $57,000 USD |
| **ETH** | ✅ Activa | Ethereum, Polygon, Arbitrum | $3,200 USD |
| **SOL** | ✅ Activa | Solana | $150 USD |
| **USDC** | ✅ Activa | Multi-red | $1 USD |
| **USDT** | ✅ Activa | Multi-red | $1 USD |

## 📋 Guía de Implementación

### Paso 1: Configuración Básica

```javascript
// 1. Cargar componentes necesarios
import './scripts/components/buy/config.js';
import './scripts/components/buy/paymentMethods.js';
import './scripts/components/buy/quantumBuy.js';

// 2. Configurar métodos de pago disponibles
PaymentMethodsComponent.selectedMethod = 'debitCard';

// 3. Mostrar modal de compra
QuantumBuyComponent.showBuyModal();
```

### Paso 2: Personalización

```javascript
// Personalizar criptomonedas disponibles
QuantumBuyConfig.cryptocurrencies.SOL.enabled = false; // Deshabilitar SOL

// Personalizar límites
QuantumBuyConfig.limits.daily.maxAmount = 50000; // $50k MXN diarios

// Configurar tema
QuantumBuyConfig.ui.theme.primary = '#your-brand-color';
```

### Paso 3: Integración con MoonPay (Producción)

```javascript
// 1. Configurar API Key de MoonPay
QuantumBuyConfig.moonpay.production.apiKey = 'your-moonpay-api-key';

// 2. Habilitar MoonPay
QuantumBuyConfig.moonpay.production.enabled = true;

// 3. Cambiar a modo producción
MoonPayIntegration.setEnvironment('production');
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# MoonPay
MOONPAY_DEV_API_KEY=your_dev_api_key
MOONPAY_PROD_API_KEY=your_prod_api_key
MOONPAY_DEV_WEBHOOK_SECRET=your_dev_webhook_secret
MOONPAY_PROD_WEBHOOK_SECRET=your_prod_webhook_secret

# Thirdweb
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

### Webhooks de MoonPay

Configurar los siguientes endpoints en tu servidor:

```javascript
// Webhook para transacciones creadas
app.post('/webhooks/moonpay/transaction_created', (req, res) => {
    MoonPayIntegration.processWebhook(req.body);
    res.json({ received: true });
});

// Webhook para transacciones actualizadas
app.post('/webhooks/moonpay/transaction_updated', (req, res) => {
    MoonPayIntegration.processWebhook(req.body);
    res.json({ received: true });
});
```

## 🎨 Personalización de UI

### Tema Personalizado

```javascript
const customTheme = {
    primary: '#2563eb',    // Azul Quantum
    secondary: '#10b981',  // Verde éxito
    accent: '#f59e0b',     // Amarillo warning
    danger: '#ef4444',     // Rojo error
    warning: '#f59e0b',    // Naranja warning
    success: '#10b981'     // Verde éxito
};

QuantumBuyConfig.ui.theme = customTheme;
```

### Textos en Español

El sistema incluye textos en español por defecto. Para personalizar:

```javascript
// Agregar nuevos textos
QuantumBuyConfig.texts = {
    buyButton: 'Comprar Ahora',
    processing: 'Procesando...',
    success: '¡Compra exitosa!',
    error: 'Error en la compra'
};
```

## 🔒 Seguridad

### Validaciones Implementadas

- ✅ **Validación de montos** (mínimo/máximo por método)
- ✅ **Validación de métodos de pago** (disponibilidad)
- ✅ **Verificación de criptomonedas** (soporte técnico)
- ✅ **Límites diarios/mensuales** (prevención fraude)
- ✅ **KYC automático** (MoonPay integrado)

### Mejores Prácticas

1. **Siempre validar en servidor** las transacciones
2. **Usar HTTPS** para todas las comunicaciones
3. **Implementar rate limiting** en endpoints de compra
4. **Guardar logs** de todas las transacciones
5. **Verificar webhooks** con firma de MoonPay

## 🚀 Migración a Producción

### Checklist para Producción

- [ ] **Obtener API Key de MoonPay** (requiere sitio web público)
- [ ] **Configurar webhooks** en tu servidor
- [ ] **Verificar dominio** con MoonPay
- [ ] **Probar con tarjetas reales** (necesario para aprobación)
- [ ] **Configurar monitoreo** de transacciones
- [ ] **Implementar sistema de reembolsos**
- [ ] **Agregar soporte 24/7**

### Pasos Detallados

1. **Crear cuenta MoonPay** en https://www.moonpay.com/
2. **Solicitar acceso a producción** (requiere sitio web activo)
3. **Configurar API Keys** en variables de entorno
4. **Implementar webhooks** para manejar eventos
5. **Probar integración** con tarjetas de prueba
6. **Enviar para aprobación** (MoonPay revisa la integración)

## 📊 Monitoreo y Analytics

### Métricas Importantes

```javascript
// Ejemplo de métricas a rastrear
const metrics = {
    conversionRate: 'Tasa de conversión de visitas a compras',
    averageOrderValue: 'Valor promedio de compra',
    paymentMethodPopularity: 'Método de pago más usado',
    failureRate: 'Tasa de fallos por método de pago',
    userRetention: 'Retención de usuarios que compran'
};
```

### Logs Recomendados

```javascript
// En cada transacción
console.log({
    timestamp: Date.now(),
    userId: user.id,
    crypto: 'BTC',
    amount: 1000,
    paymentMethod: 'debitCard',
    commission: 25,
    total: 1025,
    success: true
});
```

## 🛠️ Solución de Problemas

### Problemas Comunes

**1. Modal no se abre**
```javascript
// Verificar que componentes estén cargados
console.log(typeof QuantumBuyComponent); // Debe mostrar 'function'
console.log(typeof PaymentMethodsComponent); // Debe mostrar 'function'
```

**2. Métodos de pago no aparecen**
```javascript
// Verificar configuración
console.log(QuantumBuyConfig.paymentMethods.debitCard.enabled); // Debe ser true
```

**3. Error de comisión**
```javascript
// Verificar cálculo
const commission = PaymentMethodsComponent.calculateCommission(1000, 'debitCard');
console.log(commission); // { commission: 25, fixedFee: 25, total: 1050 }
```

## 🔮 Funcionalidades Futuras

### Próximas Características

- [ ] **Compras recurrentes** (cada mes/semana)
- [ ] **Órdenes limit** (comprar cuando precio baje)
- [ ] **Stop loss** (vender cuando precio suba)
- [ ] **Alertas de precio** personalizadas
- [ ] **Soporte multi-idioma** completo
- [ ] **Integración con exchanges** mexicanos
- [ ] **Perpetual swaps** (perps)
- [ ] **Acciones tokenizadas**

## 📞 Soporte

Para soporte técnico o preguntas sobre la integración:

1. **Documentación oficial** de MoonPay
2. **Comunidad de desarrolladores** de Thirdweb
3. **Fork de Phantom** en GitHub para referencia
4. **Logs del sistema** para debugging

## 📄 Licencia

Este sistema es parte de Quantum Wallet y sigue la misma licencia que el proyecto principal.

---

**¡Feliz coding! 🚀**
*Equipo de Quantum Wallet*
