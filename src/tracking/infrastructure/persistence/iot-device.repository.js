import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

const seed = [
  { id: 'd-1', createdAt: new Date().toISOString(), vehicleId: 'v-1', serialNumber: 'FLX-GPS-0001', connectionStatus: 'Conectado' },
  { id: 'd-2', createdAt: new Date().toISOString(), vehicleId: 'v-3', serialNumber: 'FLX-GPS-0002', connectionStatus: 'Conectado' }
]

export class IoTDeviceRepository extends LocalStorageRepository {
  constructor() {
    super('tracking.devices', seed)
  }
}
