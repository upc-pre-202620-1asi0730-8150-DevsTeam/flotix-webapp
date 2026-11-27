import { defineStore } from 'pinia'
import { fuelControlService, FuelConsumption } from '../../application/fuel-consumption.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

/** Pinia store — Fuel Control. Wraps FuelConsumption (REST API). */
export const useFuelStore = defineStore('fuel', {
  state: () => ({
    rawRecords: []
  }),
  getters: {
    /** Records enriched with km/L and the anomaly flag. */
    records: (state) => FuelConsumption.withEfficiency(state.rawRecords)
  },
  actions: {
    async load() {
      const records = await fuelControlService.listRecords()
      if (useSessionStore().scopedOwnerId) {
        const vehicleIds = useFleetStore().vehicleIds
        this.rawRecords = records.filter((r) => vehicleIds.has(r.vehicleId))
      } else {
        this.rawRecords = records
      }
    },
    async registerFuelConsumption(payload) {
      await fuelControlService.registerFuelConsumption(payload)
      await this.load()
    },
    async removeRecord(id) {
      await fuelControlService.removeRecord(id)
      await this.load()
    },
    efficiencyFor(vehicleId) {
      return FuelConsumption.efficiencyFor(this.rawRecords, vehicleId)
    }
  }
})
