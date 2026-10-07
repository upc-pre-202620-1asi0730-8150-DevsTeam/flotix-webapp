import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

export class AlertRepository extends LocalStorageRepository {
  constructor() {
    super('alerts.alerts', [
      { id: 'al-1', createdAt: new Date().toISOString(), vehicleId: 'v-3', alertType: 'Mantenimiento próximo (90% de kilometraje)', activatedAt: new Date().toISOString() }
    ])
  }
}
