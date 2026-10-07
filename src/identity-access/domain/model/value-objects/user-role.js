/**
 * UserRole value object.
 * Enumerates the three actors identified in the Context Diagram
 * (AV1 §4.6.2): Owner (Dueño), Driver (Conductor), Mechanic (Mecánica).
 */
export const UserRole = Object.freeze({
  OWNER: 'Owner',
  DRIVER: 'Driver',
  MECHANIC: 'Mechanic'
})

export const RoleLabels = {
  [UserRole.OWNER]: 'Dueño de flota',
  [UserRole.DRIVER]: 'Conductor',
  [UserRole.MECHANIC]: 'Mecánico / Taller'
}
