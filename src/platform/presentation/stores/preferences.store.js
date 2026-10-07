import { defineStore } from 'pinia'
import { getFleetPreferences, saveFleetPreferences, getNotificationPreferences, saveNotificationPreferences } from '../../infrastructure/user-preferences.js'

/** Pinia store — Platform. Wraps the localStorage preferences module. */
export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    fleet: getFleetPreferences()
  }),
  actions: {
    saveFleet(prefs) {
      this.fleet = { ...prefs }
      saveFleetPreferences(this.fleet)
    },
    notificationsFor(userId) {
      return getNotificationPreferences(userId)
    },
    saveNotificationsFor(userId, prefs) {
      saveNotificationPreferences(userId, prefs)
    }
  }
})
