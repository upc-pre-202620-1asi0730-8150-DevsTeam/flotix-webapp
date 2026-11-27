import { defineStore } from 'pinia'
import { alertsService } from '../../application/alerts.service.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

/** Pinia store — Alerts & Notifications. Wraps AlertsService (REST API). */
export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    alerts: [],
    notifications: []
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.isRead).length
  },
  actions: {
    async load() {
      const session = useSessionStore()
      const ownerId = session.scopedOwnerId
      const [alerts, notifications] = await Promise.all([
        alertsService.listAlerts(),
        alertsService.listNotifications(session.actorId)
      ])
      if (ownerId) {
        const vehicleIds = useFleetStore().vehicleIds
        this.alerts = alerts.filter((a) => vehicleIds.has(a.vehicleId))
      } else {
        this.alerts = alerts
      }
      this.notifications = notifications
    },
    async markNotificationAsRead(id) {
      await alertsService.markNotificationAsRead(id)
      await this.load()
    },
    async markAllAsRead(userId) {
      const unread = this.notifications.filter((n) => !n.isRead && n.userId === userId)
      await Promise.all(unread.map((n) => alertsService.markNotificationAsRead(n.id)))
      await this.load()
    }
  }
})
