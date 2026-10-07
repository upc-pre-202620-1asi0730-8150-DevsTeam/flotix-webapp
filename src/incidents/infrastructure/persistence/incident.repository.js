import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

const seed = [
  { id: 'i-1', createdAt: new Date().toISOString(), vehicleId: 'v-1', driverId: 'u-driver-demo', description: 'Luz de check engine encendida en ruta', status: 'Abierto', reportedAt: new Date().toISOString() }
]

export class IncidentRepository extends LocalStorageRepository {
  constructor() {
    super('incidents.incidents', seed)
  }
}
