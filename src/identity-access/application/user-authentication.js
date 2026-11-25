import { Session } from '@/shared/infrastructure/session.js'
import { LocalPreviewAuthenticationProvider } from '../infrastructure/local-preview-authentication.provider.js'

export const AUTH_PREVIEW_ENABLED = import.meta.env.DEV && import.meta.env.VITE_AUTH_PREVIEW === 'true'

// Replace this provider once the IAM endpoints are available.
export class UserAuthentication {
  constructor(provider = new UnavailableAuthenticationProvider()) {
    this.provider = provider
  }

  async signIn(email, password) {
    const user = await this.provider.signIn({ email, password })
    Session.set(user)
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

class UnavailableAuthenticationProvider {
  async signIn() {
    throw new Error('auth.errors.notConfigured')
  }

  async register() {
    throw new Error('auth.errors.notConfigured')
  }

  async signInWithGoogle() {
    throw new Error('auth.errors.googleNotConfigured')
  }

  enterPreview() {
    throw new Error('auth.errors.previewUnavailable')
  }
}

export const identityService = new UserAuthentication(
  AUTH_PREVIEW_ENABLED ? new LocalPreviewAuthenticationProvider() : undefined
)

export function configureAuthenticationProvider(provider) {
  const methods = ['signIn', 'register', 'signInWithGoogle']
  if (!provider || methods.some((method) => typeof provider[method] !== 'function')) {
    throw new TypeError('Authentication provider must implement signIn, register and signInWithGoogle.')
  }
  identityService.provider = provider
}
