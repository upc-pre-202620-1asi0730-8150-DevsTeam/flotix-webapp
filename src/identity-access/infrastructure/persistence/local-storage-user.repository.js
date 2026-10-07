import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

/**
 * LocalStorageUserRepository — infrastructure layer, Identity, Profiles & Security.
 * Seeded with one demo account per role so reviewers can log in
 * immediately without registering first.
 */
const seed = [
  {
    id: 'u-owner-demo',
    createdAt: new Date().toISOString(),
    name: 'Renzo Dueño',
    email: 'owner@flotix.pe',
    passwordHash: '1234',
    role: 'Owner',
    licenseNumber: null,
    licenseExpiry: null,
    companyName: 'Transportes Renzo S.A.C.',
    workshopName: null
  },
  {
    id: 'u-driver-demo',
    createdAt: new Date().toISOString(),
    name: 'Luis Conductor',
    email: 'driver@flotix.pe',
    passwordHash: '1234',
    role: 'Driver',
    licenseNumber: 'Q12345678',
    licenseExpiry: '2027-05-10',
    companyName: null,
    workshopName: null
  },
  {
    id: 'u-mechanic-demo',
    createdAt: new Date().toISOString(),
    name: 'Miguel Mecánico',
    email: 'mechanic@flotix.pe',
    passwordHash: '1234',
    role: 'Mechanic',
    licenseNumber: null,
    licenseExpiry: null,
    companyName: null,
    workshopName: 'Taller Miguel'
  }
]

export class LocalStorageUserRepository extends LocalStorageRepository {
  constructor() {
    super('identity-access.users', seed)
  }

  findByEmail(email) {
    return this.getAll().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  }
}
