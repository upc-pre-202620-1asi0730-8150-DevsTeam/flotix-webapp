/**
 * Stores the authenticated user returned by the configured identity provider.
 */
const SESSION_KEY = 'flotix:auth-session.v1'

export const Session = {
  set(user, remember = true) {
    this.clear()
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(SESSION_KEY, JSON.stringify(user))
  },
  get() {
    for (const storage of [localStorage, sessionStorage]) {
      try {
        const user = storage.getItem(SESSION_KEY)
        if (user) return JSON.parse(user)
      } catch {
        continue
      }
    }
    return null
  },
  clear() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  }
}
