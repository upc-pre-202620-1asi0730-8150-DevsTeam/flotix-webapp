import { defineStore } from 'pinia'
import { fleetService } from '../../application/fleet-management.js'
import { LocalStorageUserRepository } from '@/identity-access/infrastructure/persistence/local-storage-user.repository.js'
import { UserRole } from '@/identity-access/domain/model/value-objects/user-role.js'

/** Pinia store — Vehicle & Fleet Management. Wraps FleetManagement (REST API). */
export const useFleetStore = defineStore('fleet', {
  state: () => ({
    vehicles: [],
    drivers: new LocalStorageUserRepository().findBy((u) => u.role === UserRole.DRIVER)
  }),
  getters: {
    driverName: (state) => (id) => state.drivers.find((d) => d.id === id)?.name ?? null,
    byId: (state) => (id) => state.vehicles.find((v) => v.id === id) ?? null
  },
  actions: {
    async load() {
      this.vehicles = await fleetService.listVehicles()
    },
    async registerVehicle(payload) {
      await fleetService.registerVehicle(payload)
      await this.load()
    },
    async updateVehicleInfo(id, payload) {
      await fleetService.updateVehicleInfo(id, payload)
      await this.load()
    },
    async removeVehicle(id) {
      await fleetService.removeVehicle(id)
      await this.load()
    }
  }
})
