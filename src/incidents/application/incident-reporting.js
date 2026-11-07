import { IncidentRepository } from '../infrastructure/persistence/incident.repository.js'
import { Incident } from '../domain/model/entities/incident.entity.js'
import { IncidentStatus } from '../domain/model/value-objects/incident-status.js'
import { alertsService } from '@/alerts/application/alerts.service.js'
import { fleetService } from '@/fleet-management/application/fleet-management.js'
import { DEMO_OWNER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
import { i18n } from '@/internationalization/i18n.js'

/**
 * IncidentReporting — application layer, Incident Management.
 * Implements ReportVehicleIncident, InspectIncident and ResolveIncident
 * (AV1 §4.6.1). Reporting an incident triggers an automatic notification
 * towards the vehicle's owner via the Alerts & Notifications bounded context
 * (SendNotification), as described in the report.
 */
export class IncidentReporting {
  constructor() {
    this.repository = new IncidentRepository()
  }

  listIncidents() {
    return this.repository.getAll()
  }

  async reportVehicleIncident(payload) {
    const incident = await this.repository.add(new Incident(payload))
    try {
      const vehicle = await fleetService.getVehicle(incident.vehicleId)
      await alertsService.sendNotification({
        userId: vehicle?.ownerId ?? DEMO_OWNER_ID,
        type: 'incidents',
        message: `Nueva incidencia reportada: ${incident.description}`
      })
    } catch {
      // The incident is already saved; a failed notification must not undo it.
    }
    return incident
  }

  /** The API replaces the whole incident (PUT), so the new status is merged onto the current state. */
  async #changeStatus(id, status) {
    const current = await this.repository.getById(id)
    if (!current) throw new Error(i18n.global.t('errors.incidentGone'))
    return this.repository.update(id, { ...current, status })
  }

  inspectIncident(id) {
    return this.#changeStatus(id, IncidentStatus.IN_REVIEW)
  }

  resolveIncident(id) {
    return this.#changeStatus(id, IncidentStatus.RESOLVED)
  }

  removeIncident(id) {
    return this.repository.remove(id)
  }
}

export const incidentService = new IncidentReporting()
