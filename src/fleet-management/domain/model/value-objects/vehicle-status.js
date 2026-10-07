/**
 * VehicleStatus value object — Bounded Context: Vehicle & Fleet Management.
 * "En mantenimiento" is set automatically by a cross-context business rule
 * triggered from Maintenance Management (UpdateRepairStatus) as described
 * in AV1 §4.6.1, to prevent the vehicle from being assigned to a route.
 */
export const VehicleStatus = Object.freeze({
  AVAILABLE: 'Disponible',
  IN_MAINTENANCE: 'En mantenimiento',
  INACTIVE: 'Inactivo'
})

export const VehicleTypes = ['Automóvil', 'Camioneta', 'Mototaxi', 'Camión de carga', 'Van de pasajeros']
