import { Session } from '@/shared/infrastructure/session.js'
import { LocalPreviewAuthenticationProvider } from '../infrastructure/local-preview-authentication.provider.js'
import { ApiAuthenticationProvider } from '../infrastructure/api-authentication.provider.js'

export const AUTH_PREVIEW_ENABLED = import.meta.env.DEV && import.meta.env.VITE_AUTH_PREVIEW === 'true'

export class UserAuthentication {
  constructor(provider = new ApiAuthenticationProvider()) {
    this.provider = provider
  }

  async signIn(email, password, remember = true) {
    const user = await this.provider.signIn({ email, password, remember })
    Session.set(user, remember)
    return user
  }

  async register(profile) {
    const user = await this.provider.register(profile)
    Session.set(user)
    return user
  }

  currentUser() {
    return Session.get()
  }

  signOut() {
    Session.clear()
  }

  async signInWithGoogle() {
    return this.provider.signInWithGoogle()
  }

  switchRole(role) {
    return this.enterPreview(role)
  }

  enterPreview(role) {
    if (typeof this.provider.enterPreview !== 'function') throw new Error('auth.errors.previewUnavailable')
    const user = this.provider.enterPreview(role)
    Session.set(user)
    return user
  }

  updateProfile() {
    throw new Error('auth.errors.notConfigured')
  }
}

export const identityService = new UserAuthentication(
  AUTH_PREVIEW_ENABLED ? new LocalPreviewAuthenticationProvider() : new ApiAuthenticationProvider()
)

export function configureAuthenticationProvider(provider) {
  const methods = ['signIn', 'register', 'signInWithGoogle']
  if (!provider || methods.some((method) => typeof provider[method] !== 'function')) {
    throw new TypeError('Authentication provider must implement signIn, register and signInWithGoogle.')
  }
  identityService.provider = provider
}
