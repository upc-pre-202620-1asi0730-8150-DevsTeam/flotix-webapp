import { ApiRepository } from '@/shared/infrastructure/api-repository.js'

/** IncidentRepository — infrastructure layer, Incident Management (/api/v1/incidents). */
const fromApi = (r) => ({
  id: r.id,
  createdAt: r.reportedDate,
  vehicleId: r.vehicleId,
  driverId: r.driverId,
  description: r.description,
  status: r.status,
  reportedAt: r.reportedDate
})

const toCreate = (i) => ({
  vehicleId: i.vehicleId,
  driverId: i.driverId,
  description: i.description,
  status: i.status
})

const toUpdate = (i) => ({ description: i.description, status: i.status })

export class IncidentRepository extends ApiRepository {
  constructor() {
    super('incidents', { fromApi, toCreate, toUpdate })
  }
}
