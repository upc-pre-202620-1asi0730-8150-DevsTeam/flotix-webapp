import { http } from '@/shared/infrastructure/http-client.js'
import { Session } from '@/shared/infrastructure/session.js'

const normalizeEmail = (email) => email.trim().toLowerCase()

export class ApiAuthenticationProvider {
  async signIn({ email, password }) {
    const authUser = await this._createToken(email, password)
    Session.set({ token: authUser.token, authUserId: authUser.id }, false)

    try {
      const profile = await this._findProfileByEmail(email)
      return this._sessionUser(authUser, profile)
    } catch (error) {
      Session.clear()
      throw error
    }
  }

  async register(profile) {
    const email = normalizeEmail(profile.email)
    let authUser

    try {
      await http.post('users', { username: email, password: profile.password })
    } catch (error) {
      if (error.status !== 409) throw error

      authUser = await this._createToken(email, profile.password)
      Session.set({ token: authUser.token, authUserId: authUser.id }, false)
      let existingProfile
      try {
        existingProfile = await this._findProfileByEmail(email)
      } catch (lookupError) {
        Session.clear()
        throw lookupError
      }
      if (existingProfile) {
        Session.clear()
        throw new Error('auth.errors.emailTaken')
      }
    }

    if (!authUser) {
      authUser = await this._createToken(email, profile.password)
      Session.set({ token: authUser.token, authUserId: authUser.id }, false)
    }

    try {
      const { data } = await http.post('profiles', {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email,
        role: profile.role,
        ...(profile.plan
          ? { plan: profile.plan, paymentCardLast4: profile.cardLast4, paymentCardExpiry: profile.cardExpiry }
          : {})
      })
      return this._sessionUser(authUser, data)
    } catch (error) {
      Session.clear()
      throw error
    }
  }

  async signInWithGoogle() {
    throw new Error('auth.errors.googleNotConfigured')
  }

  async _createToken(email, password) {
    const { data } = await http.post('tokens', {
      username: normalizeEmail(email),
      password
    })
    return data
  }

  async _findProfileByEmail(email) {
    const { data: profiles } = await http.get('profiles')
    const normalizedEmail = normalizeEmail(email)
    return profiles.find((profile) => normalizeEmail(profile.email) === normalizedEmail) ?? null
  }

  _sessionUser(authUser, profile) {
    if (!profile) throw new Error('auth.errors.profileNotFound')

    const user = {
      id: profile.id,
      authUserId: authUser.id,
      name: profile.fullName,
      email: profile.email,
      role: profile.role,
      token: authUser.token,
      subscription: profile.plan
        ? {
            planId: String(profile.plan).toLowerCase(),
            priceMonthly: profile.planPriceMonthly,
            startedAt: profile.planStartedAt,
            renewsAt: profile.planRenewsAt,
            cardLast4: profile.paymentCardLast4,
            cardExpiry: profile.paymentCardExpiry
          }
        : null
    }
    return user
  }
}
