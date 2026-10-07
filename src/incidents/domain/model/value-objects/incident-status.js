/**
 * IncidentStatus value object — Bounded Context: Incident Management.
 * Flow (AV1 §4.6.1): ReportVehicleIncident -> InspectIncident -> ResolveIncident.
 */
export const IncidentStatus = Object.freeze({
  OPEN: 'Abierto',
  IN_REVIEW: 'En revisión',
  RESOLVED: 'Resuelto'
})
