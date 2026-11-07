import { LocalStorageUserRepository } from '../infrastructure/persistence/local-storage-user.repository.js'
import { Session } from '@/shared/infrastructure/session.js'
import { UserRole } from '../domain/model/value-objects/user-role.js'

/**
 * UserProfiles — application layer, Identity, Profiles & Security.
 * The backend has no identity module and the app has no sign-in / sign-up:
 * it opens directly with a demo profile. The three actors from the Context
 * Diagram (Owner, Driver, Mechanic) are selectable from the header, and the
 * selected profile is remembered in the browser.
 */
export class UserAuthentication {
  constructor() {
    this.repository = new LocalStorageUserRepository()
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
