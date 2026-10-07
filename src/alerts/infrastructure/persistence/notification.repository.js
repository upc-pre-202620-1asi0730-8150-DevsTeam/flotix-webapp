import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

export class NotificationRepository extends LocalStorageRepository {
  constructor() {
    super('alerts.notifications', [
      { id: 'n-1', createdAt: new Date().toISOString(), userId: 'u-owner-demo', alertId: 'al-1', message: 'El vehículo MTX-556 está próximo a alcanzar el 90% del kilometraje para su revisión preventiva.', isRead: false, sentAt: new Date().toISOString() }
    ])
  }
}
