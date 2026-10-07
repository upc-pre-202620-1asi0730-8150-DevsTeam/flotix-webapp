import { BaseEntity } from '@/shared/domain/model/base-entity.js'
import { IncidentStatus } from '../value-objects/incident-status.js'

/**
 * Incident entity — Bounded Context: Incident Management.
 * Mirrors `incidents` (AV1 §4.8.1): vehicleId, driverId, description,
 * status, reportedAt.
 */
export class Incident extends BaseEntity {
  constructor({ id, createdAt, vehicleId, driverId, description, status = IncidentStatus.OPEN, reportedAt = new Date().toISOString() }) {
    super({ id, createdAt })
    this.vehicleId = vehicleId
    this.driverId = driverId
    this.description = description
    this.status = status
    this.reportedAt = reportedAt
  }
}
