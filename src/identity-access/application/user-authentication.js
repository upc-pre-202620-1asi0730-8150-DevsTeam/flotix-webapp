import { LocalStorageUserRepository } from '../infrastructure/persistence/local-storage-user.repository.js'
import { Session } from '@/shared/infrastructure/session.js'
import { UserRole } from '../domain/model/value-objects/user-role.js'

/**
 * Identity, Profiles & Security application layer.
 * Sign-in and registration currently use demo profiles in browser storage;
 * the IAM API is not connected. The three actors (Owner, Driver, Mechanic)
 * can also be selected from the header in this local preview.
 */
export class UserAuthentication {
  constructor() {
    this.repository = new LocalStorageUserRepository()
  }

  /** Signs in a demo user locally until the IAM API is available. */
  signIn(email, password) {
    const credentials = {
      'owner@flotix.pe': { password: 'Owner123', role: UserRole.OWNER },
      'driver@flotix.pe': { password: 'Driver123', role: UserRole.DRIVER },
      'mechanic@flotix.pe': { password: 'Mechanic123', role: UserRole.MECHANIC }
    }
    const normalizedEmail = email.trim().toLowerCase()
    const demo = credentials[normalizedEmail]
    const user = this.repository.findBy((item) => item.email.toLowerCase() === normalizedEmail)[0]
    if (!demo || demo.password !== password || !user) {
      throw new Error('auth.errors.invalidCredentials')
    }
    const sessionUser = this._toSessionUser(user)
    Session.set(sessionUser)
    return sessionUser
  }

  /** Creates a browser-only profile for the signup prototype. */
  register(profile) {
    const email = profile.email.trim().toLowerCase()
    if (this.repository.findBy((item) => item.email.toLowerCase() === email).length) {
      throw new Error('auth.errors.emailTaken')
    }
    const user = this.repository.add({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: profile.name.trim(),
      email,
      role: profile.role,
      licenseNumber: profile.licenseNumber || null,
      licenseExpiry: profile.licenseExpiry || null,
      companyName: profile.companyName || null,
      workshopName: profile.workshopName || null
    })
    const sessionUser = this._toSessionUser(user)
    Session.set(sessionUser)
    return sessionUser
  }

  /** The active profile; defaults to the demo Owner on the first visit. */
  currentUser() {
    const stored = Session.get()
    const fresh = stored ? this.repository.getById(stored.id) : null
    if (fresh) return this._toSessionUser(fresh)
    return this.switchRole(UserRole.OWNER)
  }

  /** Activates the demo profile of the given role. */
  switchRole(role) {
    const user = this.repository.findBy((u) => u.role === role)[0] ?? this.repository.getAll()[0]
    const sessionUser = this._toSessionUser(user)
    Session.set(sessionUser)
    return sessionUser
  }

  updateProfile(id, patch) {
    return this.repository.update(id, patch)
  }

  _toSessionUser(user) {
    return { ...user }
  }
}

export const identityService = new UserAuthentication()
