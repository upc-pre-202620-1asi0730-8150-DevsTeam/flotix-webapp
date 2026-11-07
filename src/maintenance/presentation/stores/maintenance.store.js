import { defineStore } from 'pinia'
import { maintenanceService } from '../../application/maintenance-coordination.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

/** Pinia store — Maintenance Management. Wraps MaintenanceCoordination (REST API). */
export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    requests: []
  }),
  getters: {
    byId: (state) => (id) => state.requests.find((r) => r.id === id) ?? null
  },
  actions: {
    async load() {
      this.requests = await maintenanceService.listRequests()
    },
    async submitMaintenanceRequest(payload) {
      const request = await maintenanceService.submitMaintenanceRequest(payload)
      await this.load()
      return request
    },
    async registerDiagnosticAndQuote(id, payload) {
      await maintenanceService.registerDiagnosticAndQuote(id, payload)
      await this.load()
    },
    async approveOrRejectBudget(id, approved) {
      await maintenanceService.approveOrRejectBudget(id, approved)
      await this.load()
    },
    // Starting/finishing a repair also changes the vehicle status, so the fleet is reloaded too.
    async updateRepairStatus(id, status) {
      try {
        await maintenanceService.updateRepairStatus(id, status)
      } finally {
        await Promise.all([this.load(), useFleetStore().load()])
      }
    },
    async completeMaintenance(id) {
      try {
        await maintenanceService.completeMaintenance(id)
      } finally {
        await Promise.all([this.load(), useFleetStore().load()])
      }
    },
    async removeRequest(id) {
      await maintenanceService.removeRequest(id)
      await this.load()
    }
  }
})
