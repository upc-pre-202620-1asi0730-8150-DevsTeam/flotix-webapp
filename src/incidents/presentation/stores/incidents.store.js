import { defineStore } from 'pinia'
import { incidentService } from '../../application/incident-reporting.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

/** Pinia store — Incident Management. Wraps IncidentReporting (REST API). */
export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    incidents: []
  }),
  actions: {
    async load() {
      const incidents = await incidentService.listIncidents()
      if (useSessionStore().scopedOwnerId) {
        const vehicleIds = useFleetStore().vehicleIds
        this.incidents = incidents.filter((i) => vehicleIds.has(i.vehicleId))
      } else {
        this.incidents = incidents
      }
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
