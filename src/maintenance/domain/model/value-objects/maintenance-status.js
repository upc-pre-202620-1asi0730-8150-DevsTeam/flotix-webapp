/**
 * MaintenanceStatus value object — Bounded Context: Maintenance Management.
 * Models the lifecycle described in AV1 §4.6.1:
 * SubmitMaintenanceRequest -> RegisterDiagnosticAndQuote ->
 * ApproveOrRejectBudget -> UpdateRepairStatus -> CompleteMaintenance.
 */
export const MaintenanceStatus = Object.freeze({
  PENDING: 'Pendiente',
  QUOTED: 'Presupuestado',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  IN_REPAIR: 'En reparación',
  COMPLETED: 'Completado'
})
