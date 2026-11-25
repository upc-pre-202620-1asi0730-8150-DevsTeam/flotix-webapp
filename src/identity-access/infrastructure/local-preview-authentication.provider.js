import { LocalStorageUserRepository } from './persistence/local-storage-user.repository.js'

export class LocalPreviewAuthenticationProvider {
  constructor(repository = new LocalStorageUserRepository()) {
    this.repository = repository
  }

  signIn() {
    throw new Error('auth.errors.notConfigured')
  }

  register() {
    throw new Error('auth.errors.notConfigured')
  }

  signInWithGoogle() {
    throw new Error('auth.errors.googleNotConfigured')
  }

  enterPreview(role) {
    const user = this.repository.findBy((profile) => profile.role === role)[0]
    if (!user) throw new Error('auth.errors.previewUnavailable')
    return user
  }
}
