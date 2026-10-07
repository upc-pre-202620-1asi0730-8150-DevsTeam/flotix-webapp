import { ReportRepository } from '../infrastructure/persistence/report.repository.js'
import { Report } from '../domain/model/entities/report.entity.js'
import { fleetService } from '@/fleet-management/application/fleet-management.js'
import { fuelControlService } from '@/fuel-control/application/fuel-consumption.js'
import { maintenanceService } from '@/maintenance/application/maintenance-coordination.js'
import { MaintenanceStatus } from '@/maintenance/domain/model/value-objects/maintenance-status.js'

/**
 * AnalyticsService — application layer, Reporting & Analytics.
 * Implements ConsolidateFleetData, GeneratePerformanceReport and
 * ExportReportToPdf (AV1 §4.6.1), reading across every other bounded
 * context. Applies the filtering rule described in the report: vehicles
 * with fewer than two historical fuel records are excluded from the
 * performance comparison to avoid statistically meaningless averages.
 */
export class AnalyticsService {
  constructor() {
    this.repository = new ReportRepository()
  }

  /** ConsolidateFleetData */
  consolidateFleetData() {
    const vehicles = fleetService.listVehicles()
    const fuelRecords = fuelControlService.listRecords()
    const maintenanceRequests = maintenanceService.listRequests()

    return {
      totalVehicles: vehicles.length,
      totalFuelCost: fuelRecords.reduce((a, r) => a + r.totalCost, 0),
      totalMaintenanceCost: maintenanceRequests.reduce((a, r) => a + r.estimatedCost, 0),
      completedMaintenance: maintenanceRequests.filter((r) => r.status === MaintenanceStatus.COMPLETED).length
    }
  }

  /** GeneratePerformanceReport: per-vehicle fuel cost & efficiency comparison. */
  generatePerformanceReport() {
    const vehicles = fleetService.listVehicles()
    const fuelRecords = fuelControlService.listRecords()

    return vehicles
      .map((v) => {
        const records = fuelRecords.filter((r) => r.vehicleId === v.id)
        const efficiencies = fuelControlService.efficiencyFor(v.id).map((r) => r.kmPerLiter).filter((v) => v !== null)
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

  /** ExportReportToPdf — simulated locally as a downloadable text export. */
  exportReportToPdf(ownerId, reportType, filterParams = {}) {
    const report = new Report({ ownerId, reportType, filterParams })
    this.repository.add(report)
    return report
  }

  listReports() {
    return this.repository.getAll()
  }
}

export const analyticsService = new AnalyticsService()
