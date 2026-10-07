import { defineStore } from 'pinia'
import { identityService } from '../../application/user-authentication.js'
import { LocalStorageUserRepository } from '../../infrastructure/persistence/local-storage-user.repository.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'

/**
 * Pinia store — Identity, Profiles & Security. Thin reactive wrapper
 * around UserAuthentication (kept framework-agnostic in the application
 * layer); the store just mirrors its state for components to consume.
 * Also centralizes the read-only user directory (mechanics/workshops
 * lookups) so presentation code never reaches into LocalStorageUserRepository
 * directly.
 */
export const useSessionStore = defineStore('session', {
  state: () => ({
    user: identityService.currentUser(),
    mechanics: new LocalStorageUserRepository().findBy((u) => u.role === UserRole.MECHANIC)
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state) => state.user?.role ?? null,
    getUserById: () => (id) => new LocalStorageUserRepository().getById(id)
  },
  actions: {
    login(email, password) {
      identityService.authenticateUser(email, password)
      this.user = identityService.currentUser()
    },
    register(payload) {
      identityService.registerUser(payload)
      this.user = identityService.currentUser()
    },
    updateProfile(patch) {
      identityService.updateProfile(this.user.id, patch)
      this.user = identityService.currentUser()
    },
    logout() {
      identityService.logout()
      this.user = null
    }
  }
})
