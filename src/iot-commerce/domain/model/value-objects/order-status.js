/**
 * OrderStatus value object — Bounded Context: Digital Experience / IoT Commerce.
 * Flow (AV1 §4.6.1): PurchaseIoTDevice -> ProcessPayment -> UpdateOrderStatus.
 * A confirmed payment automatically moves the order to "En preparación".
 */
export const OrderStatus = Object.freeze({
  PENDING_PAYMENT: 'Pendiente de pago',
  IN_PREPARATION: 'En preparación',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado'
})

export const IoTCatalog = [
  { sku: 'gps', name: 'Rastreador GPS Flotix', unitPrice: 149.9, iconName: 'pin' },
  { sku: 'odometer', name: 'Odómetro digital Flotix', unitPrice: 89.9, iconName: 'signal' },
  { sku: 'fuel-sensor', name: 'Sensor de combustible Flotix', unitPrice: 119.9, iconName: 'fuel' }
]
