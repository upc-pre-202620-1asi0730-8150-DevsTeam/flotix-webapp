import { BaseEntity } from '@/shared/domain/model/base-entity.js'

/**
 * Notification entity — Bounded Context: Alerts & Notifications.
 * Mirrors `notifications` (AV1 §4.8.1): userId, alertId (optional),
 * message, isRead, sentAt.
 */
export class Notification extends BaseEntity {
  constructor({ id, createdAt, userId, alertId = null, message, isRead = false, sentAt = new Date().toISOString() }) {
    super({ id, createdAt })
    this.userId = userId
    this.alertId = alertId
    this.message = message
    this.isRead = isRead
    this.sentAt = sentAt
  }
}
