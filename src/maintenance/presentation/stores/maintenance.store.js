import { defineStore } from 'pinia'
import { maintenanceService } from '../../application/maintenance-coordination.js'

/** Pinia store — Maintenance Management. Wraps MaintenanceCoordination. */
export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    requests: maintenanceService.listRequests()
  }),
  getters: {
    byId: (state) => (id) => state.requests.find((r) => r.id === id) ?? null
  },
  actions: {
    refresh() {
      this.requests = maintenanceService.listRequests()
    },
    submitMaintenanceRequest(payload) {
      const r = maintenanceService.submitMaintenanceRequest(payload)
      this.refresh()
      return r
    },
    registerDiagnosticAndQuote(id, payload) {
      maintenanceService.registerDiagnosticAndQuote(id, payload)
      this.refresh()
    },
    approveOrRejectBudget(id, approved) {
      maintenanceService.approveOrRejectBudget(id, approved)
      this.refresh()
    },
    updateRepairStatus(id, status) {
      maintenanceService.updateRepairStatus(id, status)
      this.refresh()
    },
    completeMaintenance(id) {
      maintenanceService.completeMaintenance(id)
      this.refresh()
    },
    removeRequest(id) {
      maintenanceService.removeRequest(id)
      this.refresh()
    }
  }
})
