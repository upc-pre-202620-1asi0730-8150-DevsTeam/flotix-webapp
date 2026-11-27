import { defineStore } from 'pinia'
import { identityService } from '../../application/user-authentication.js'
import { LocalStorageUserRepository } from '../../infrastructure/persistence/local-storage-user.repository.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const isUuid = (value) => UUID_RE.test(String(value ?? ''))

// Keeps the current session and the user directory used by fleet screens.
export const useSessionStore = defineStore('session', {
  state: () => ({
    user: identityService.currentUser(),
    mechanics: new LocalStorageUserRepository().findBy((u) => u.role === UserRole.MECHANIC)
  }),
  getters: {
    role: (state) => state.user?.role ?? null,
    /** Valid UUID identifying the signed-in user in business endpoints (vehicles, orders, reports, notifications). */
    actorId: (state) => (isUuid(state.user?.ownerId) ? state.user.ownerId : isUuid(state.user?.id) ? state.user.id : null),
    /** Owner UUID used to scope fleet queries to the authenticated fleet owner's own resources. */
    scopedOwnerId: (state) =>
      state.user?.role === UserRole.OWNER && isUuid(state.user?.ownerId) ? state.user.ownerId : null,
    getUserById: () => (id) => new LocalStorageUserRepository().getById(id)
  },
  actions: {
    enterPreview(role) {
      this.user = identityService.enterPreview(role)
    },
    updateProfile(patch) {
      identityService.updateProfile(this.user.id, patch)
      this.user = identityService.currentUser()
    },
    async login(email, password, remember) {
      this.user = await identityService.signIn(email, password, remember)
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
