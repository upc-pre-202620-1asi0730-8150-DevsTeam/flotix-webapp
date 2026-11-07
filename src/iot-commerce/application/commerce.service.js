import { IoTOrderRepository } from '../infrastructure/persistence/iot-order.repository.js'
import { IoTOrder } from '../domain/model/entities/iot-order.entity.js'
import { IoTCatalog, OrderStatus } from '../domain/model/value-objects/order-status.js'
import { i18n } from '@/internationalization/i18n.js'

/**
 * CommerceService — application layer, Digital Experience / IoT Commerce.
 * Implements PurchaseIoTDevice, ProcessPayment and UpdateOrderStatus
 * (AV1 §4.6.1). ProcessPayment is simulated (no real Payment Gateway
 * integration) but always succeeds and immediately applies the
 * "confirmed payment" business rule.
 */
export class CommerceService {
  constructor() {
    this.repository = new IoTOrderRepository()
  }

  get catalog() {
    return IoTCatalog
  }

  listOrders() {
    return this.repository.getAll()
  }

  async purchaseIoTDevice({ ownerId, sku, deviceQuantity }) {
    const product = IoTCatalog.find((p) => p.sku === sku)
    const order = await this.repository.add(
      new IoTOrder({
        ownerId,
        sku,
        deviceQuantity,
        totalAmount: +(product.unitPrice * Number(deviceQuantity)).toFixed(2),
        status: OrderStatus.PENDING_PAYMENT
      })
    )
    return this.processPayment(order)
  }

  /** ProcessPayment: on success, auto-transitions the order to "En preparación". */
  processPayment(order) {
    return this.repository.update(order.id, { ...order, status: OrderStatus.IN_PREPARATION })
  }

  async updateOrderStatus(orderId, status) {
    const current = await this.repository.getById(orderId)
    if (!current) throw new Error(i18n.global.t('errors.orderGone'))
    return this.repository.update(orderId, { ...current, status })
  }
}

export const commerceService = new CommerceService()
