import { defineStore } from 'pinia'
import { analyticsService } from '../../application/analytics.service.js'

/** Pinia store — Reporting & Analytics. Wraps AnalyticsService. */
export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    reports: analyticsService.listReports()
  }),
  getters: {
    summary: () => analyticsService.consolidateFleetData(),
    performance: () => analyticsService.generatePerformanceReport()
  },
  actions: {
    refresh() {
      this.reports = analyticsService.listReports()
    },
    exportReportToPdf(userId, title, params) {
      const report = analyticsService.exportReportToPdf(userId, title, params)
      this.refresh()
      return report
    }
  }
})
