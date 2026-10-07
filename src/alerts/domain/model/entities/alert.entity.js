import { BaseEntity } from '@/shared/domain/model/base-entity.js'

/**
 * Alert entity — Bounded Context: Alerts & Notifications.
 * Mirrors `alerts` (AV1 §4.8.1): vehicleId, alertType, activatedAt.
 */
export class Alert extends BaseEntity {
  constructor({ id, createdAt, vehicleId, alertType, activatedAt = new Date().toISOString() }) {
    super({ id, createdAt })
    this.vehicleId = vehicleId
    this.alertType = alertType
    this.activatedAt = activatedAt
  }
}
