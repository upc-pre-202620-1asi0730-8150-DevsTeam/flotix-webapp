/**
 * LocalStorageRepository
 * Generic infrastructure-layer repository implementing basic persistence
 * operations (CRUD) against the browser's localStorage.
 *
 * This class plays the role that, in the target C# / .NET Core + PostgreSQL
 * architecture described in the AV1 report (section 4.6.3), is played by an
 * Entity Framework Core repository talking to a schema-per-Bounded-Context
 * PostgreSQL database. Swapping this implementation for an HTTP client that
 * calls the real Flotix API is the only change required once the backend
 * is available — the application layer above it never needs to change,
 * since it only depends on this repository's public contract.
 */
export class LocalStorageRepository {
  /**
   * @param {string} storageKey - unique localStorage key for this aggregate
   * @param {Array<object>} seed - initial demo records seeded on first run
   */
  constructor(storageKey, seed = []) {
    this.storageKey = `flotix:${storageKey}`
    if (localStorage.getItem(this.storageKey) === null) {
      localStorage.setItem(this.storageKey, JSON.stringify(seed))
    }
  }

  _readAll() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) ?? []
    } catch {
      return []
    }
  }

  _writeAll(records) {
    localStorage.setItem(this.storageKey, JSON.stringify(records))
  }

  getAll() {
    return this._readAll()
  }

  getById(id) {
    return this._readAll().find((r) => r.id === id) ?? null
  }

  findBy(predicate) {
    return this._readAll().filter(predicate)
  }

  add(record) {
    const records = this._readAll()
    records.unshift(record)
    this._writeAll(records)
    return record
  }

  update(id, patch) {
    const records = this._readAll()
    const idx = records.findIndex((r) => r.id === id)
    if (idx === -1) return null
    records[idx] = { ...records[idx], ...patch }
    this._writeAll(records)
    return records[idx]
  }

  remove(id) {
    const records = this._readAll().filter((r) => r.id !== id)
    this._writeAll(records)
  }

  reset(seed = []) {
    this._writeAll(seed)
  }
}
