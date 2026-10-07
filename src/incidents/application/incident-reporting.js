import { IncidentRepository } from '../infrastructure/persistence/incident.repository.js'
import { Incident } from '../domain/model/entities/incident.entity.js'
import { IncidentStatus } from '../domain/model/value-objects/incident-status.js'
import { alertsService } from '@/alerts/application/alerts.service.js'

/**
 * IncidentReporting — application layer, Incident Management.
 * Implements ReportVehicleIncident, InspectIncident and ResolveIncident
 * (AV1 §4.6.1). Reporting an incident triggers an automatic critical
 * notification towards administrators via the Alerts & Notifications
 * bounded context (SendNotification), as described in the report.
 */
export class IncidentReporting {
  constructor() {
    this.repository = new IncidentRepository()
  }

  listIncidents() {
    return this.repository.getAll()
  }

  reportVehicleIncident(payload) {
    const incident = new Incident(payload)
    this.repository.add(incident)
    alertsService.sendNotification({
      userId: 'u-owner-demo',
      type: 'incidents',
      message: `Nueva incidencia reportada: ${incident.description}`
    })
    return incident
  }

  inspectIncident(id) {
    return this.repository.update(id, { status: IncidentStatus.IN_REVIEW })
  }

  resolveIncident(id) {
    return this.repository.update(id, { status: IncidentStatus.RESOLVED })
  }

  removeIncident(id) {
    this.repository.remove(id)
  }
}

export const incidentService = new IncidentReporting()
