import { BaseEntity } from '@/shared/domain/model/base-entity.js'
import { MaintenanceStatus } from '../value-objects/maintenance-status.js'

/**
 * MaintenanceRequest entity — Bounded Context: Maintenance Management.
 * Mirrors `maintenance_requests` (AV1 §4.8.1): vehicleId, mechanicId,
 * faultDescription, estimatedCost, status, createdAt.
 */
export class MaintenanceRequest extends BaseEntity {
  constructor({ id, createdAt, vehicleId, mechanicId = null, faultDescription, estimatedCost = 0, status = MaintenanceStatus.PENDING }) {
    super({ id, createdAt })
    this.vehicleId = vehicleId
    this.mechanicId = mechanicId
    this.faultDescription = faultDescription
    this.estimatedCost = Number(estimatedCost)
    this.status = status
  }
}
