import { AlertRepository } from '../infrastructure/persistence/alert.repository.js'
import { NotificationRepository } from '../infrastructure/persistence/notification.repository.js'
import { Alert } from '../domain/model/entities/alert.entity.js'
import { Notification } from '../domain/model/entities/notification.entity.js'
import { getFleetPreferences, getNotificationPreferences } from '@/platform/infrastructure/user-preferences.js'

/**
 * AlertsService — application layer, Alerts & Notifications.
 * Implements EvaluateThresholds, MaintenanceAlertGenerated /
 * SpeedLimitExceededAlertGenerated, SendNotification and
 * MarkNotificationAsRead (AV1 §4.6.1). Also acts as the inbound
 * integration point other bounded contexts use to raise alerts
 * (Incident Management, Fuel Control, Real-Time Monitoring).
 * Thresholds and the per-type notification toggle both come from
 * Settings (Flota / Notificaciones) instead of hardcoded values.
 */
const MAINTENANCE_THRESHOLD_RATIO = 0.9 // 90% of the configured service interval
const SPEED_ALERT_COOLDOWN_MS = 60_000 // telemetry arrives every few seconds; avoid one alert per packet

export class AlertsService {
  constructor() {
    this.alertRepository = new AlertRepository()
    this.notificationRepository = new NotificationRepository()
    this.lastSpeedAlertAt = new Map()
  }

  listAlerts() {
    return this.alertRepository.getAll()
  }

  listNotifications() {
    return this.notificationRepository.getAll()
  }

  generateAlert({ vehicleId, alertType }) {
    return this.alertRepository.add(new Alert({ vehicleId, alertType }))
  }

  /** SendNotification, gated by the recipient's per-type preference (Settings → Notificaciones). */
  async sendNotification({ userId, alertId = null, message, type = 'maintenance' }) {
    if (!getNotificationPreferences(userId)[type]) return null
    return this.notificationRepository.add(new Notification({ userId, alertId, message }))
  }

  markNotificationAsRead(id) {
    return this.notificationRepository.update(id, { isRead: true })
  }

  /**
   * EvaluateThresholds: called with a vehicle's current mileage since its
   * last service. Generates a MaintenanceAlertGenerated event once 90% of
   * the configured service interval (Settings → Flota) is reached.
   */
  async evaluateMaintenanceThreshold(vehicle, kmSinceLastService) {
    const serviceIntervalKm = getFleetPreferences().maintenanceIntervalKm
    const ratio = kmSinceLastService / serviceIntervalKm
    if (ratio < MAINTENANCE_THRESHOLD_RATIO) return null
    const alert = await this.generateAlert({
      vehicleId: vehicle.id,
      alertType: `Mantenimiento próximo (${Math.round(ratio * 100)}% de kilometraje)`
    })
    await this.sendNotification({
      userId: vehicle.ownerId,
      alertId: alert.id,
      type: 'maintenance',
      message: `El vehículo ${vehicle.plate} alcanzó el ${Math.round(ratio * 100)}% del kilometraje de revisión preventiva.`
    })
    return alert
  }

  async evaluateSpeedLimit(vehicle, speedKmh, limitKmh = getFleetPreferences().speedLimitKmh) {
    if (speedKmh <= limitKmh) return null
    const last = this.lastSpeedAlertAt.get(vehicle.id) ?? 0
    if (Date.now() - last < SPEED_ALERT_COOLDOWN_MS) return null
    this.lastSpeedAlertAt.set(vehicle.id, Date.now())

    const alert = await this.generateAlert({ vehicleId: vehicle.id, alertType: `Exceso de velocidad (${speedKmh} km/h)` })
    await this.sendNotification({
      userId: vehicle.ownerId,
      alertId: alert.id,
      type: 'speed',
      message: `El vehículo ${vehicle.plate} superó el límite de velocidad: ${speedKmh} km/h.`
    })
    return alert
  }
}

export const alertsService = new AlertsService()
