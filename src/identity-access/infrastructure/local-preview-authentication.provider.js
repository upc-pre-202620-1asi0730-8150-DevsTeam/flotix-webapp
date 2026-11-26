import { LocalStorageUserRepository } from './persistence/local-storage-user.repository.js'

const CREDENTIALS_KEY = 'flotix:identity-access.local-credentials.v1'
const PASSWORD_ITERATIONS = 120000

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(value) {
  return Uint8Array.from(value.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
}

async function hashPassword(password, salt, iterations = PASSWORD_ITERATIONS) {
  if (!globalThis.crypto?.subtle) throw new Error('auth.errors.localAuthUnavailable')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: hexToBytes(salt), iterations, hash: 'SHA-256' }, key, 256)
  return bytesToHex(new Uint8Array(result))
}

function matchesHash(actual, expected) {
  const left = hexToBytes(actual)
  const right = hexToBytes(expected)
  if (left.length !== right.length) return false
  return left.reduce((different, byte, index) => different | (byte ^ right[index]), 0) === 0
}

export class LocalPreviewAuthenticationProvider {
  constructor(repository = new LocalStorageUserRepository()) {
    this.repository = repository
  }

  async signIn({ email, password }) {
    const normalizedEmail = normalizeEmail(email)
    const account = this._readCredentials().find((entry) => entry.email === normalizedEmail)
    if (!account) throw new Error('auth.errors.invalidCredentials')

    const passwordHash = await hashPassword(password, account.salt, account.iterations)
    if (!matchesHash(passwordHash, account.passwordHash)) throw new Error('auth.errors.invalidCredentials')

    const user = this.repository.getById(account.userId)
    if (!user) throw new Error('auth.errors.profileNotFound')
    return { ...user, authMode: 'local-development' }
  }

  async register(profile) {
    const email = normalizeEmail(profile.email)
    const existingProfile = this.repository.findBy((user) => normalizeEmail(user.email) === email)[0]
    if (existingProfile || this._readCredentials().some((account) => account.email === email)) {
      throw new Error('auth.errors.emailTaken')
    }

    const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)))
    const iterations = PASSWORD_ITERATIONS
    const passwordHash = await hashPassword(profile.password, salt, iterations)
    const user = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim(),
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email,
      role: profile.role,
      companyName: profile.companyName?.trim() || null,
      fleetSize: profile.fleetSize || null,
      licenseNumber: profile.licenseNumber?.trim() || null,
      licenseExpiry: profile.licenseExpiry || null,
      workshopName: profile.workshopName?.trim() || null,
      workshopCity: profile.workshopCity?.trim() || null,
      workshopSpecialty: profile.workshopSpecialty?.trim() || null
    }
    const credentials = this._readCredentials()

    this.repository.add(user)
    try {
      this._writeCredentials([...credentials, { userId: user.id, email, salt, iterations, passwordHash }])
    } catch (error) {
      this.repository.remove(user.id)
      throw error
    }
    return { ...user, authMode: 'local-development' }
  }

  signInWithGoogle() {
    throw new Error('auth.errors.googleNotConfigured')
  }

  enterPreview(role) {
    const user = this.repository.findBy((profile) => profile.role === role)[0]
    if (!user) throw new Error('auth.errors.previewUnavailable')
    return user
  }

  _readCredentials() {
    try {
      return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) ?? '[]')
    } catch {
      return []
    }
  }

  _writeCredentials(credentials) {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
  }
}
