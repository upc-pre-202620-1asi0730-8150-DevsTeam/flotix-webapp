/**
 * Stores the authenticated user returned by the configured identity provider.
 */
const SESSION_KEY = 'flotix:auth-session.v1'

export const Session = {
  set(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  },
  get() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY))
    } catch {
      return null
    }
  },
  clear() {
    localStorage.removeItem(SESSION_KEY)
  }
}
