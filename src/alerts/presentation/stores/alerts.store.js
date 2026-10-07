import { defineStore } from 'pinia'
import { alertsService } from '../../application/alerts.service.js'

/** Pinia store — Alerts & Notifications. Wraps AlertsService. */
export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    alerts: alertsService.listAlerts(),
    notifications: alertsService.listNotifications()
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.isRead).length
  },
  actions: {
    refresh() {
      this.alerts = alertsService.listAlerts()
      this.notifications = alertsService.listNotifications()
    },
    markNotificationAsRead(id) {
      alertsService.markNotificationAsRead(id)
      this.refresh()
    },
    markAllAsRead(userId) {
      this.notifications.filter((n) => !n.isRead && n.userId === userId).forEach((n) => alertsService.markNotificationAsRead(n.id))
      this.refresh()
    }
  }
})
