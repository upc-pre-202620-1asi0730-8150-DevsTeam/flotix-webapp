import { ApiRepository } from '@/shared/infrastructure/api-repository.js'

/** AlertRepository — infrastructure layer, Alerts & Notifications (/api/v1/alerts). */
const fromApi = (r) => ({
  id: r.id,
  createdAt: r.triggerDate,
  vehicleId: r.vehicleId,
  alertType: r.alertType,
  activatedAt: r.triggerDate
})

const toCreate = (a) => ({ vehicleId: a.vehicleId, alertType: String(a.alertType).slice(0, 50) })

export class AlertRepository extends ApiRepository {
  constructor() {
    super('alerts', { fromApi, toCreate })
  }
}
