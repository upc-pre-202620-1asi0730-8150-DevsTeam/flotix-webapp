import { Session } from '@/shared/infrastructure/session.js'
import { LocalPreviewAuthenticationProvider } from '../infrastructure/local-preview-authentication.provider.js'
import { ApiAuthenticationProvider } from '../infrastructure/api-authentication.provider.js'

export const AUTH_PREVIEW_ENABLED = import.meta.env.DEV && import.meta.env.VITE_AUTH_PREVIEW === 'true'

export class UserAuthentication {
  constructor(provider = new ApiAuthenticationProvider()) {
    this.provider = provider
    this.localProvider = new LocalPreviewAuthenticationProvider()
  }

  async signIn(email, password, remember = true) {
    const user = await this._authenticate('signIn', { email, password, remember })
    Session.set(user, remember)
    return user
  }

  async register(profile) {
    const user = await this._authenticate('register', profile)
    Session.set(user)
    return user
  }

  async _authenticate(action, payload) {
    try {
      return await this.provider[action](payload)
    } catch (error) {
      const apiUnavailable = error.status === 0
      if (!import.meta.env.DEV || !(this.provider instanceof ApiAuthenticationProvider) || !apiUnavailable) {
        throw error
      }
      return this.localProvider[action](payload)
    }
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

  async requestPasswordReset(email) {
    if (typeof this.provider.requestPasswordReset !== 'function') {
      throw new Error('auth.errors.passwordResetUnavailable')
    }
    return this.provider.requestPasswordReset({ email })
  }

  async confirmPasswordReset(token, newPassword) {
    if (typeof this.provider.confirmPasswordReset !== 'function') {
      throw new Error('auth.errors.passwordResetUnavailable')
    }
    return this.provider.confirmPasswordReset({ token, newPassword })
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
