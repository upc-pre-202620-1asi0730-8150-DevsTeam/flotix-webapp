import { defineStore } from 'pinia'
import { analyticsService, AnalyticsService } from '../../application/analytics.service.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useFuelStore } from '@/fuel-control/presentation/stores/fuel.store.js'
import { useMaintenanceStore } from '@/maintenance/presentation/stores/maintenance.store.js'

/** Pinia store — Reporting & Analytics. Wraps AnalyticsService (REST API). */
export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    reports: []
  }),
  getters: {
    summary() {
      return AnalyticsService.consolidateFleetData({
        vehicles: useFleetStore().vehicles,
        fuelRecords: useFuelStore().rawRecords,
        maintenanceRequests: useMaintenanceStore().requests
      })
    },
    performance() {
      return AnalyticsService.generatePerformanceReport({
        vehicles: useFleetStore().vehicles,
        fuelRecords: useFuelStore().rawRecords
      })
    }
  },
  actions: {
    async load() {
      this.reports = await analyticsService.listReports()
    },
    async exportReportToPdf(payload) {
      const report = await analyticsService.exportReportToPdf(payload)
      await this.load()
      return report
    }
  }
})
