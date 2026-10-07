import { BaseEntity } from '@/shared/domain/model/base-entity.js'
import { UserRole } from '../value-objects/user-role.js'

/**
 * User entity — Bounded Context: Identity, Profiles & Security.
 * Mirrors the `users` table from the AV1 Database Design (§4.8.1):
 * name, email, passwordHash, role, licenseNumber, licenseExpiry,
 * companyName, workshopName.
 *
 * Business rule (AV1 §4.6.1): licenseNumber and licenseExpiry are
 * mandatory when role === Driver.
 */
export class User extends BaseEntity {
  constructor({
    id,
    createdAt,
    name,
    email,
    passwordHash,
    role = UserRole.OWNER,
    licenseNumber = null,
    licenseExpiry = null,
    companyName = null,
    workshopName = null
  }) {
    super({ id, createdAt })
    this.name = name
    this.email = email
    this.passwordHash = passwordHash
    this.role = role
    this.licenseNumber = licenseNumber
    this.licenseExpiry = licenseExpiry
    this.companyName = companyName
    this.workshopName = workshopName

    if (this.role === UserRole.DRIVER && (!this.licenseNumber || !this.licenseExpiry)) {
      throw new Error('El número de licencia y su fecha de expiración son obligatorios para el rol Conductor.')
    }
  }
}
