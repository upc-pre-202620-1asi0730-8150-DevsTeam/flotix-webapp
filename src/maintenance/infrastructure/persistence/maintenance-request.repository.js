import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

const seed = [
  { id: 'm-1', createdAt: new Date().toISOString(), vehicleId: 'v-3', mechanicId: 'u-mechanic-demo', faultDescription: 'Cambio de aceite y filtro por cumplimiento de kilometraje', estimatedCost: 180, status: 'En reparación' },
  { id: 'm-2', createdAt: new Date().toISOString(), vehicleId: 'v-1', mechanicId: null, faultDescription: 'Ruido en la suspensión delantera', estimatedCost: 0, status: 'Pendiente' }
]

export class MaintenanceRequestRepository extends LocalStorageRepository {
  constructor() {
    super('maintenance.requests', seed)
  }
}
