import { ApiRepository } from '@/shared/infrastructure/api-repository.js'

/**
 * VehicleRepository — infrastructure layer, Vehicle & Fleet Management.
 * Talks to GET/POST/PUT/DELETE /api/v1/vehicles. The API calls the plate
 * `licensePlate`; the domain entity keeps `plate`.
 */
const fromApi = (r) => ({
  id: r.id,
  ownerId: r.ownerId,
  driverId: r.driverId ?? null,
  plate: r.licensePlate,
  vehicleType: r.vehicleType,
  currentMileage: Number(r.currentMileage),
  status: r.status
})

const toCreate = (v) => ({
  ownerId: v.ownerId,
  driverId: v.driverId || null,
  licensePlate: v.plate,
  vehicleType: v.vehicleType,
  currentMileage: Number(v.currentMileage),
  status: v.status
})

const toUpdate = (v) => ({
  driverId: v.driverId || null,
  licensePlate: v.plate,
  vehicleType: v.vehicleType,
  currentMileage: Number(v.currentMileage),
  status: v.status
})

export class VehicleRepository extends ApiRepository {
  constructor() {
    super('vehicles', { fromApi, toCreate, toUpdate })
  }
}
