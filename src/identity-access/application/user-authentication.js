import { LocalStorageUserRepository } from '../infrastructure/persistence/local-storage-user.repository.js'
import { User } from '../domain/model/entities/user.entity.js'
import { Session } from '@/shared/infrastructure/session.js'

/**
 * UserAuthentication — application layer, Identity, Profiles & Security.
 * Orchestrates RegisterUser and AuthenticateUser use cases described
 * in AV1 §4.6.1 (Design-Level EventStorming).
 */
export class UserAuthentication {
  constructor() {
    this.repository = new LocalStorageUserRepository()
  }

  registerUser(payload) {
    if (this.repository.findByEmail(payload.email)) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.')
    }
    const user = new User({ ...payload, passwordHash: payload.password })
    this.repository.add(user)
    Session.set(this._toSessionUser(user))
    return user
  }

  authenticateUser(email, password) {
    const user = this.repository.findByEmail(email)
    if (!user || user.passwordHash !== password) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.')
    }
    Session.set(this._toSessionUser(user))
    return user
  }

  updateProfile(id, patch) {
    return this.repository.update(id, patch)
  }

  logout() {
    Session.clear()
  }

  currentUser() {
    return Session.get()
  }

  _toSessionUser(user) {
    const { passwordHash, ...safe } = user
    return safe
  }
}

export const identityService = new UserAuthentication()
