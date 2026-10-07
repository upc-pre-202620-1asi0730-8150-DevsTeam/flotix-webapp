import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

const seed = [
  { id: 'o-1', createdAt: new Date().toISOString(), ownerId: 'u-owner-demo', sku: 'gps', deviceQuantity: 2, totalAmount: 299.8, status: 'Entregado', orderDate: '2026-07-15' }
]

export class IoTOrderRepository extends LocalStorageRepository {
  constructor() {
    super('commerce.orders', seed)
  }
}
