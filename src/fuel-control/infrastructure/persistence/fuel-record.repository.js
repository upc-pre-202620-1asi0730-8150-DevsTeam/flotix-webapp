import { ApiRepository, toIsoDate } from '@/shared/infrastructure/api-repository.js'

/**
 * FuelRecordRepository — infrastructure layer, Fuel Control.
 * Talks to /api/v1/fuel-records. API names: cost, mileageAtRefill, recordedDate.
 */
const fromApi = (r) => ({
  id: r.id,
  createdAt: r.recordedDate,
  vehicleId: r.vehicleId,
  driverId: r.driverId,
  liters: Number(r.liters),
  totalCost: Number(r.cost),
  mileageAtRefuel: Number(r.mileageAtRefill),
  date: String(r.recordedDate).slice(0, 10)
})

// Noon UTC keeps the calendar day stable in any time zone.
const recordedDate = (date) => `${toIsoDate(date)}T12:00:00Z`

const toCreate = (f) => ({
  vehicleId: f.vehicleId,
  driverId: f.driverId,
  liters: Number(f.liters),
  cost: Number(f.totalCost),
  mileageAtRefill: Number(f.mileageAtRefuel),
  recordedDate: recordedDate(f.date)
})

const toUpdate = (f) => ({
  liters: Number(f.liters),
  cost: Number(f.totalCost),
  mileageAtRefill: Number(f.mileageAtRefuel),
  recordedDate: recordedDate(f.date)
})

export class FuelRecordRepository extends ApiRepository {
  constructor() {
    super('fuel-records', { fromApi, toCreate, toUpdate })
  }
}
