import { defineStore } from 'pinia'
import { incidentService } from '../../application/incident-reporting.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'

/** Pinia store — Incident Management. Wraps IncidentReporting (REST API). */
export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    incidents: []
  }),
  actions: {
    async load() {
      this.incidents = await incidentService.listIncidents()
    },
    async reportVehicleIncident(payload) {
      await incidentService.reportVehicleIncident(payload)
      await Promise.all([this.load(), useAlertsStore().load().catch(() => {})])
    },
    async inspectIncident(id) {
      await incidentService.inspectIncident(id)
      await this.load()
    },
    async resolveIncident(id) {
      await incidentService.resolveIncident(id)
      await this.load()
    },
    async removeIncident(id) {
      await incidentService.removeIncident(id)
      await this.load()
    }
  }
})
