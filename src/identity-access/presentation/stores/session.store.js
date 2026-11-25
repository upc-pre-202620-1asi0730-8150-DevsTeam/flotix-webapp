import { defineStore } from 'pinia'
import { identityService } from '../../application/user-authentication.js'
import { LocalStorageUserRepository } from '../../infrastructure/persistence/local-storage-user.repository.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'

// Keeps the current session and the user directory used by fleet screens.
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
    },
    async login(email, password) {
      this.user = await identityService.signIn(email, password)
    },
    async loginWithGoogle() {
      this.user = await identityService.signInWithGoogle()
    },
    async register(profile) {
      this.user = await identityService.register(profile)
    },
    signOut() {
      identityService.signOut()
      this.user = null
    }
  }
})
