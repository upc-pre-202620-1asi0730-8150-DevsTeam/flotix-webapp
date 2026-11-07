import { ApiRepository } from '@/shared/infrastructure/api-repository.js'
import { IoTCatalog } from '../../domain/model/value-objects/order-status.js'

/**
 * IoTOrderRepository — infrastructure layer, Digital Experience / IoT Commerce (/api/v1/iot-orders).
 * The API stores quantity and total only (no product), so the product (sku) is
 * derived from the unit price (every catalog item has a different price).
 */
function skuFor(quantity, totalAmount) {
  if (!quantity) return null
  const unit = totalAmount / quantity
  return IoTCatalog.find((p) => Math.abs(p.unitPrice - unit) < 0.01)?.sku ?? null
}

const fromApi = (r) => ({
  id: r.id,
  createdAt: r.orderDate,
  ownerId: r.ownerId,
  sku: skuFor(r.quantity, Number(r.totalAmount)),
  deviceQuantity: r.quantity,
  totalAmount: Number(r.totalAmount),
  status: r.status,
  orderDate: String(r.orderDate).slice(0, 10)
})

const toCreate = (o) => ({
  ownerId: o.ownerId,
  quantity: Number(o.deviceQuantity),
  totalAmount: Number(o.totalAmount)
})

const toUpdate = (o) => ({ status: o.status })

export class IoTOrderRepository extends ApiRepository {
  constructor() {
    super('iot-orders', { fromApi, toCreate, toUpdate })
  }
}
