import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'
import { DEMO_OWNER_ID, DEMO_DRIVER_ID, DEMO_MECHANIC_ID } from '../../domain/model/value-objects/demo-users.js'

/**
 * LocalStorageUserRepository — infrastructure layer, Identity, Profiles & Security.
 * Seeded with one demo profile per role (there is no sign-in or sign-up).
 */
const seed = [
  {
    id: DEMO_OWNER_ID,
    createdAt: new Date().toISOString(),
    name: 'Renzo Valdivia',
    email: 'owner@flotix.pe',
    role: 'Owner',
    licenseNumber: null,
    licenseExpiry: null,
    companyName: 'Transportes Renzo S.A.C.',
    workshopName: null
  },
  {
    id: DEMO_DRIVER_ID,
    createdAt: new Date().toISOString(),
    name: 'Luis Quispe',
    email: 'driver@flotix.pe',
    role: 'Driver',
    licenseNumber: 'Q12345678',
    licenseExpiry: '2027-05-10',
    companyName: null,
    workshopName: null
  },
  {
    id: DEMO_MECHANIC_ID,
    createdAt: new Date().toISOString(),
    name: 'Miguel Ramos',
    email: 'mechanic@flotix.pe',
    role: 'Mechanic',
    licenseNumber: null,
    licenseExpiry: null,
    companyName: null,
    workshopName: 'Miguel Auto Service'
  }
]

export class LocalStorageUserRepository extends LocalStorageRepository {
  constructor() {
    // v3: user ids are GUIDs (required by the API) and the demo profiles have language-neutral names.
    super('identity-access.users.v3', seed)
  }
}
