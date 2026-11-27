import { IoTOrderRepository } from '../infrastructure/persistence/iot-order.repository.js'
import { IoTOrder } from '../domain/model/entities/iot-order.entity.js'
import { IoTCatalog, OrderStatus } from '../domain/model/value-objects/order-status.js'
import { DEMO_OWNER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
import { i18n } from '@/internationalization/i18n.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Resolves a valid owner UUID for Commerce API endpoints.
 * IAM/Profile ids are integers while Commerce expects a Guid (`ownerId`).
 */
export function resolveOwnerUuid(candidates = []) {
  for (const candidate of candidates) {
    if (UUID_RE.test(String(candidate ?? ''))) return candidate
  }
  return DEMO_OWNER_ID
}

/**
 * CommerceService — application layer, Digital Experience / IoT Commerce.
 * Implements PurchaseIoTDevice, ProcessPayment and UpdateOrderStatus
 * (AV1 §4.6.1). ProcessPayment creates the order and immediately transitions
 * it to "En preparación" once payment is confirmed.
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

  async purchaseIoTDevice({ ownerId, fallbackOwnerId = null, sku, deviceQuantity }) {
    const resolvedOwnerId = resolveOwnerUuid([ownerId, fallbackOwnerId])
    const product = IoTCatalog.find((p) => p.sku === sku)
    const order = await this.repository.add(
      new IoTOrder({
        ownerId: resolvedOwnerId,
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

  async confirmOrderPayment(orderId) {
    return this.updateOrderStatus(orderId, OrderStatus.IN_PREPARATION)
  }

  async updateOrderStatus(orderId, status) {
    const current = await this.repository.getById(orderId)
    if (!current) throw new Error(i18n.global.t('errors.orderGone'))
    return this.repository.update(orderId, { ...current, status })
  }
}

export const commerceService = new CommerceService()
