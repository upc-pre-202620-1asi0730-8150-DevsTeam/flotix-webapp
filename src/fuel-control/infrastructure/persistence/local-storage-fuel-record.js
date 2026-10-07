import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

const seed = [
  { id: 'f-1', createdAt: new Date().toISOString(), vehicleId: 'v-1', driverId: 'u-driver-demo', liters: 45, totalCost: 288.5, mileageAtRefuel: 47800, date: '2026-08-20' },
  { id: 'f-2', createdAt: new Date().toISOString(), vehicleId: 'v-1', driverId: 'u-driver-demo', liters: 42, totalCost: 269.1, mileageAtRefuel: 48200, date: '2026-09-01' },
  { id: 'f-3', createdAt: new Date().toISOString(), vehicleId: 'v-3', driverId: 'u-driver-demo', liters: 12, totalCost: 79.9, mileageAtRefuel: 15320, date: '2026-09-05' }
]

export class LocalStorageFuelRecord extends LocalStorageRepository {
  constructor() {
    super('fuel.records', seed)
  }
}
