import { BaseEntity } from '@/shared/domain/model/base-entity.js'
import { VehicleStatus } from '../value-objects/vehicle-status.js'

/**
 * Vehicle entity — Bounded Context: Vehicle & Fleet Management.
 * Mirrors the `vehicles` table (AV1 §4.8.1): ownerId, driverId (FK,
 * optional), plate, vehicleType, currentMileage, status.
 */
export class Vehicle extends BaseEntity {
  constructor({
    id,
    createdAt,
    ownerId,
    driverId = null,
    plate,
    vehicleType,
    currentMileage = 0,
    status = VehicleStatus.AVAILABLE
  }) {
    super({ id, createdAt })
    this.ownerId = ownerId
    this.driverId = driverId
    this.plate = plate
    this.vehicleType = vehicleType
    this.currentMileage = currentMileage
    this.status = status
  }
}
