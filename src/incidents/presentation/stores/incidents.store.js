import { defineStore } from 'pinia'
import { incidentService } from '../../application/incident-reporting.js'

/** Pinia store — Incident Management. Wraps IncidentReporting. */
export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    incidents: incidentService.listIncidents()
  }),
  actions: {
    refresh() {
      this.incidents = incidentService.listIncidents()
    },
    reportVehicleIncident(payload) {
      incidentService.reportVehicleIncident(payload)
      this.refresh()
    },
    inspectIncident(id) {
      incidentService.inspectIncident(id)
      this.refresh()
    },
    resolveIncident(id) {
      incidentService.resolveIncident(id)
      this.refresh()
    },
    removeIncident(id) {
      incidentService.removeIncident(id)
      this.refresh()
    }
  }
})
