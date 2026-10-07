import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

const seed = [
  { id: 'v-1', createdAt: new Date().toISOString(), ownerId: 'u-owner-demo', driverId: 'u-driver-demo', plate: 'V4A-123', vehicleType: 'Camión de carga', currentMileage: 48200, status: 'Disponible' },
  { id: 'v-2', createdAt: new Date().toISOString(), ownerId: 'u-owner-demo', driverId: null, plate: 'ABC-908', vehicleType: 'Camioneta', currentMileage: 21750, status: 'Disponible' },
  { id: 'v-3', createdAt: new Date().toISOString(), ownerId: 'u-owner-demo', driverId: 'u-driver-demo', plate: 'MTX-556', vehicleType: 'Mototaxi', currentMileage: 15320, status: 'En mantenimiento' }
]

export class VehicleRepository extends LocalStorageRepository {
  constructor() {
    super('fleet-management.vehicles', seed)
  }
}
