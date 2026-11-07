import { MaintenanceRequestRepository } from '../infrastructure/persistence/maintenance-request.repository.js'
import { MaintenanceRequest } from '../domain/model/entities/maintenance-request.entity.js'
import { MaintenanceStatus } from '../domain/model/value-objects/maintenance-status.js'
import { fleetService } from '@/fleet-management/application/fleet-management.js'
import { i18n } from '@/internationalization/i18n.js'

/**
 * MaintenanceCoordination — application layer, Maintenance Management.
 * Orchestrates the full request lifecycle and enforces the automatic
 * cross-context business rule from AV1 §4.6.1: entering "En reparación"
 * flips the related vehicle to "En mantenimiento" in Vehicle & Fleet
 * Management, and completion returns it to "Disponible".
 * Each transition is a dedicated API endpoint that validates the allowed
 * previous status (409 Conflict otherwise).
 */
export class MaintenanceCoordination {
  constructor() {
    this.repository = new MaintenanceRequestRepository()
  }

  listRequests() {
    return this.repository.getAll()
  }

  /** The API requires the workshop (mechanic) that will diagnose the fault. */
  submitMaintenanceRequest(payload) {
    if (!payload.mechanicId) throw new Error(i18n.global.t('errors.workshopRequired'))
    return this.repository.add(new MaintenanceRequest(payload))
  }

  registerDiagnosticAndQuote(id, { estimatedCost }) {
    return this.repository.registerDiagnosticAndQuote(id, estimatedCost)
  }

  approveOrRejectBudget(id, approved) {
    return this.repository.decideBudget(id, approved)
  }

  async updateRepairStatus(id, status) {
    if (status !== MaintenanceStatus.IN_REPAIR) {
      throw new Error(i18n.global.t('errors.unsupportedTransition', { status }))
    }
    const updated = await this.repository.startRepair(id)
    await fleetService.markInMaintenance(updated.vehicleId)
    return updated
  }

  async completeMaintenance(id) {
    const updated = await this.repository.complete(id)
    await fleetService.markAvailable(updated.vehicleId)
    return updated
  }

  removeRequest(id) {
    return this.repository.remove(id)
  }
}

export const maintenanceService = new MaintenanceCoordination()
