import { ApiRepository } from '@/shared/infrastructure/api-repository.js'

/** NotificationRepository — infrastructure layer, Alerts & Notifications (/api/v1/notifications). */
const fromApi = (r) => ({
  id: r.id,
  createdAt: r.sentDate,
  userId: r.userId,
  alertId: r.alertId ?? null,
  message: r.message,
  isRead: r.isRead,
  sentAt: r.sentDate
})

const toCreate = (n) => ({
  userId: n.userId,
  alertId: n.alertId ?? null,
  message: String(n.message).slice(0, 500)
})

const toUpdate = (n) => ({ isRead: n.isRead })

export class NotificationRepository extends ApiRepository {
  constructor() {
    super('notifications', { fromApi, toCreate, toUpdate })
  }
}
