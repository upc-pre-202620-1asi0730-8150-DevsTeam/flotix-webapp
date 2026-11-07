import { ApiRepository } from '@/shared/infrastructure/api-repository.js'
import { http } from '@/shared/infrastructure/http-client.js'

/**
 * MaintenanceRequestRepository — infrastructure layer, Maintenance Management.
 * The request lifecycle is exposed by the API as dedicated transitions
 * (POST /maintenance-requests/{id}/...), not as a generic PUT.
 */
const fromApi = (r) => ({
  id: r.id,
  createdAt: r.requestDate,
  vehicleId: r.vehicleId,
  mechanicId: r.mechanicId,
  faultDescription: r.description,
  estimatedCost: Number(r.estimatedCost),
  status: r.status
})

const toCreate = (m) => ({
  vehicleId: m.vehicleId,
  mechanicId: m.mechanicId,
  description: m.faultDescription
})

export class MaintenanceRequestRepository extends ApiRepository {
  constructor() {
    super('maintenance-requests', { fromApi, toCreate })
  }

  async #transition(id, action, body) {
    const { data } = await http.post(`${this.path}/${id}/${action}`, body)
    return this.fromApi(data)
  }

  registerDiagnosticAndQuote(id, estimatedCost) {
    return this.#transition(id, 'diagnostic-and-quote', { estimatedCost: Number(estimatedCost) })
  }

  decideBudget(id, isApproved) {
    return this.#transition(id, 'budget-decision', { isApproved })
  }

  startRepair(id) {
    return this.#transition(id, 'repair-start')
  }

  complete(id) {
    return this.#transition(id, 'completion')
  }
}
