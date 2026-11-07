import { VehicleRepository } from '../infrastructure/persistence/vehicle.repository.js'
import { Vehicle } from '../domain/model/entities/vehicle.entity.js'
import { VehicleStatus } from '../domain/model/value-objects/vehicle-status.js'
import { i18n } from '@/internationalization/i18n.js'

/**
 * FleetManagement — application layer, Vehicle & Fleet Management.
 * Implements RegisterVehicle, UpdateVehicleInfo, ChangeVehicleStatus
 * and AssignDriverToVehicle (AV1 §4.6.1). All operations are asynchronous
 * because they go through the Flotix REST API.
 */
export class FleetManagement {
  constructor() {
    this.repository = new VehicleRepository()
  }

  listVehicles() {
    return this.repository.getAll()
  }

  getVehicle(id) {
    return this.repository.getById(id)
  }

  registerVehicle(payload) {
    return this.repository.add(new Vehicle(payload))
  }

  /** The API replaces the whole vehicle (PUT), so the patch is merged onto the current state first. */
  async updateVehicleInfo(id, patch) {
    const current = await this.repository.getById(id)
    if (!current) throw new Error(i18n.global.t('errors.vehicleGone'))
    return this.repository.update(id, { ...current, ...patch })
  }

  assignDriverToVehicle(vehicleId, driverId) {
    return this.updateVehicleInfo(vehicleId, { driverId })
  }

  changeVehicleStatus(vehicleId, status) {
    return this.updateVehicleInfo(vehicleId, { status })
  }

  /** Cross-context reaction: called from Maintenance Management (UpdateRepairStatus). */
  markInMaintenance(vehicleId) {
    return this.changeVehicleStatus(vehicleId, VehicleStatus.IN_MAINTENANCE)
  }

  markAvailable(vehicleId) {
    return this.changeVehicleStatus(vehicleId, VehicleStatus.AVAILABLE)
  }

  removeVehicle(id) {
    return this.repository.remove(id)
  }
}

export const fleetService = new FleetManagement()
