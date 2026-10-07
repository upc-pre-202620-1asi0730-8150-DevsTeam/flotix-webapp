import { MaintenanceRequestRepository } from '../infrastructure/persistence/maintenance-request.repository.js'
import { MaintenanceRequest } from '../domain/model/entities/maintenance-request.entity.js'
import { MaintenanceStatus } from '../domain/model/value-objects/maintenance-status.js'
import { fleetService } from '@/fleet-management/application/fleet-management.js'

/**
 * MaintenanceCoordination — application layer, Maintenance Management.
 * Orchestrates the full request lifecycle and enforces the automatic
 * cross-context business rule from AV1 §4.6.1: entering "En reparación"
 * flips the related vehicle to "En mantenimiento" in Vehicle & Fleet
 * Management, and completion returns it to "Disponible".
 */
export class MaintenanceCoordination {
  constructor() {
    this.repository = new MaintenanceRequestRepository()
  }

  listRequests() {
    return this.repository.getAll()
  }

  submitMaintenanceRequest(payload) {
    const request = new MaintenanceRequest(payload)
    return this.repository.add(request)
  }

  registerDiagnosticAndQuote(id, { mechanicId, estimatedCost }) {
    return this.repository.update(id, { mechanicId, estimatedCost: Number(estimatedCost), status: MaintenanceStatus.QUOTED })
  }

  approveOrRejectBudget(id, approved) {
    const status = approved ? MaintenanceStatus.APPROVED : MaintenanceStatus.REJECTED
    return this.repository.update(id, { status })
  }

  updateRepairStatus(id, status) {
    const updated = this.repository.update(id, { status })
    if (status === MaintenanceStatus.IN_REPAIR && updated) {
      fleetService.markInMaintenance(updated.vehicleId)
    }
    return updated
  }

  completeMaintenance(id) {
    const updated = this.repository.update(id, { status: MaintenanceStatus.COMPLETED })
    if (updated) {
      fleetService.markAvailable(updated.vehicleId)
    }
    return updated
  }

  removeRequest(id) {
    this.repository.remove(id)
  }
}

export const maintenanceService = new MaintenanceCoordination()
