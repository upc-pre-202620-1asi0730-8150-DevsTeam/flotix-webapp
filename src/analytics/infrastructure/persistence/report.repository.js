import { ApiRepository, toIsoDate } from '@/shared/infrastructure/api-repository.js'
import { http } from '@/shared/infrastructure/http-client.js'

/** ReportRepository — infrastructure layer, Reporting & Analytics (/api/v1/reports). */
const fromApi = (r) => ({
  id: r.id,
  createdAt: r.generatedDate,
  ownerId: r.ownerId,
  reportType: r.reportType,
  generatedAt: r.generatedDate,
  filterParams: r.filterParams
})

export class ReportRepository extends ApiRepository {
  constructor() {
    super('reports', { fromApi, toCreate: (r) => r })
  }

  /**
   * Asks the API to generate (and store) a report for a period.
   * @returns the generated report with its per-vehicle lines and totals
   */
  async generate({ ownerId, reportType, from, to }) {
    const { data } = await http.post(this.path, { ownerId, reportType, from: toIsoDate(from), to: toIsoDate(to) })
    return {
      ...fromApi(data),
      lines: data.lines ?? [],
      totalRecords: data.totalRecords,
      totalQuantity: Number(data.totalQuantity),
      totalCost: Number(data.totalCost),
      message: data.message ?? null
    }
  }
}
