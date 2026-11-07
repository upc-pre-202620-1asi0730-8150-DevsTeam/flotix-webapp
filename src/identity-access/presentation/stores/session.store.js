import { defineStore } from 'pinia'
import { identityService } from '../../application/user-authentication.js'
import { LocalStorageUserRepository } from '../../infrastructure/persistence/local-storage-user.repository.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'

/**
 * Pinia store — Identity, Profiles & Security. Thin reactive wrapper around
 * UserAuthentication (kept framework-agnostic in the application layer).
 * There is no sign-in or sign-up: the active profile (Owner, Driver or
 * Mechanic) is chosen from the header. Also centralizes the read-only user
 * directory (mechanics/workshops lookups) so presentation code never reaches
 * into LocalStorageUserRepository directly.
 */
export const useSessionStore = defineStore('session', {
  state: () => ({
    user: identityService.currentUser(),
    mechanics: new LocalStorageUserRepository().findBy((u) => u.role === UserRole.MECHANIC)
  }),
  getters: {
    role: (state) => state.user?.role ?? null,
    getUserById: () => (id) => new LocalStorageUserRepository().getById(id)
  },
  actions: {
    switchRole(role) {
      this.user = identityService.switchRole(role)
    },
    updateProfile(patch) {
      identityService.updateProfile(this.user.id, patch)
      this.user = identityService.currentUser()
    }
  }
})
