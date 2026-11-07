import { ReportRepository } from '../infrastructure/persistence/report.repository.js'
import { FuelConsumption } from '@/fuel-control/application/fuel-consumption.js'
import { MaintenanceStatus } from '@/maintenance/domain/model/value-objects/maintenance-status.js'

/**
 * AnalyticsService — application layer, Reporting & Analytics.
 * Implements ConsolidateFleetData, GeneratePerformanceReport and
 * ExportReportToPdf (AV1 §4.6.1), reading across every other bounded
 * context. Applies the filtering rule described in the report: vehicles
 * with fewer than two historical fuel records are excluded from the
 * performance comparison to avoid statistically meaningless averages.
 *
 * The consolidation and performance comparison are pure functions over the
 * data the other contexts already loaded; generating/storing a report goes
 * through POST /reports.
 */
export class AnalyticsService {
  constructor() {
    this.repository = new ReportRepository()
  }

  /** ConsolidateFleetData */
  static consolidateFleetData({ vehicles, fuelRecords, maintenanceRequests }) {
    return {
      totalVehicles: vehicles.length,
      totalFuelCost: fuelRecords.reduce((a, r) => a + r.totalCost, 0),
      totalMaintenanceCost: maintenanceRequests.reduce((a, r) => a + r.estimatedCost, 0),
      completedMaintenance: maintenanceRequests.filter((r) => r.status === MaintenanceStatus.COMPLETED).length
    }
  }

  /** GeneratePerformanceReport: per-vehicle fuel cost & efficiency comparison. */
  static generatePerformanceReport({ vehicles, fuelRecords }) {
    return vehicles
      .map((v) => {
        const records = fuelRecords.filter((r) => r.vehicleId === v.id)
        const efficiencies = FuelConsumption.efficiencyFor(fuelRecords, v.id).map((r) => r.kmPerLiter).filter((k) => k !== null)
        const avgEfficiency = efficiencies.length ? +(efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length).toFixed(2) : null
        return {
          vehicleId: v.id,
          plate: v.plate,
          recordCount: records.length,
          totalCost: records.reduce((a, r) => a + r.totalCost, 0),
          avgEfficiency
        }
      })
      // Business rule (AV1 §4.6.1): exclude vehicles with fewer than 2 historical fuel records
      .filter((row) => row.recordCount >= 2)
  }

  /** ExportReportToPdf: the API generates and stores the report for the period. */
  exportReportToPdf({ ownerId, reportType, from, to }) {
    return this.repository.generate({ ownerId, reportType, from, to })
  }

  listReports() {
    return this.repository.getAll()
  }
}

export const analyticsService = new AnalyticsService()
