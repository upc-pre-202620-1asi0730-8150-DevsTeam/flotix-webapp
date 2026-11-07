/**
 * Session helper (Identity, Profiles & Security support infrastructure).
 * Remembers the active demo profile in localStorage so it survives a page refresh.
 * There is no sign-in: the app always opens with a profile.
 */
const SESSION_KEY = 'flotix:session'

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
