import { defineStore } from 'pinia'
import { fuelControlService, FuelConsumption } from '../../application/fuel-consumption.js'

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
      this.rawRecords = await fuelControlService.listRecords()
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
