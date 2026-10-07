import { BaseEntity } from '@/shared/domain/model/base-entity.js'
import { OrderStatus } from '../value-objects/order-status.js'

/**
 * IoTOrder entity — Bounded Context: Digital Experience / IoT Commerce.
 * Mirrors `iot_orders` (AV1 §4.8.1): ownerId, deviceQuantity, totalAmount,
 * status, orderDate.
 */
export class IoTOrder extends BaseEntity {
  constructor({ id, createdAt, ownerId, sku, deviceQuantity, totalAmount, status = OrderStatus.PENDING_PAYMENT, orderDate = new Date().toISOString().slice(0, 10) }) {
    super({ id, createdAt })
    this.ownerId = ownerId
    this.sku = sku
    this.deviceQuantity = Number(deviceQuantity)
    this.totalAmount = Number(totalAmount)
    this.status = status
    this.orderDate = orderDate
  }
}
