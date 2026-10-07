import { defineStore } from 'pinia'
import { fuelControlService } from '../../application/fuel-consumption.js'

/** Pinia store — Fuel Control. Wraps FuelConsumption. */
export const useFuelStore = defineStore('fuel', {
  state: () => ({
    records: fuelControlService.allRecordsWithEfficiency()
  }),
  actions: {
    refresh() {
      this.records = fuelControlService.allRecordsWithEfficiency()
    },
    registerFuelConsumption(payload) {
      fuelControlService.registerFuelConsumption(payload)
      this.refresh()
    },
    removeRecord(id) {
      fuelControlService.removeRecord(id)
      this.refresh()
    },
    efficiencyFor(vehicleId) {
      return fuelControlService.efficiencyFor(vehicleId)
    }
  }
})
