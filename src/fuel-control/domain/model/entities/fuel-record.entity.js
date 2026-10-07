import { BaseEntity } from '@/shared/domain/model/base-entity.js'

/**
 * FuelRecord entity — Bounded Context: Fuel Control.
 * Mirrors the `fuel_records` table (AV1 §4.8.1): vehicleId, driverId,
 * liters, totalCost, mileageAtRefuel, date.
 */
export class FuelRecord extends BaseEntity {
  constructor({ id, createdAt, vehicleId, driverId, liters, totalCost, mileageAtRefuel, date = new Date().toISOString().slice(0, 10) }) {
    super({ id, createdAt })
    this.vehicleId = vehicleId
    this.driverId = driverId
    this.liters = Number(liters)
    this.totalCost = Number(totalCost)
    this.mileageAtRefuel = Number(mileageAtRefuel)
    this.date = date
  }
}
