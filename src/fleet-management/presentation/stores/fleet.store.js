import { defineStore } from 'pinia'
import { fleetService } from '../../application/fleet-management.js'
import { LocalStorageUserRepository } from '@/identity-access/infrastructure/persistence/local-storage-user.repository.js'
import { UserRole } from '@/identity-access/domain/model/value-objects/user-role.js'

/** Pinia store — Vehicle & Fleet Management. Wraps FleetManagement. */
export const useFleetStore = defineStore('fleet', {
  state: () => ({
    vehicles: fleetService.listVehicles(),
    drivers: new LocalStorageUserRepository().findBy((u) => u.role === UserRole.DRIVER)
  }),
  getters: {
    driverName: (state) => (id) => state.drivers.find((d) => d.id === id)?.name ?? null,
    byId: (state) => (id) => state.vehicles.find((v) => v.id === id) ?? null
  },
  actions: {
    refresh() {
      this.vehicles = fleetService.listVehicles()
    },
    registerVehicle(payload) {
      fleetService.registerVehicle(payload)
      this.refresh()
    },
    updateVehicleInfo(id, payload) {
      fleetService.updateVehicleInfo(id, payload)
      this.refresh()
    },
    removeVehicle(id) {
      fleetService.removeVehicle(id)
      this.refresh()
    }
  }
})
