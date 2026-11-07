import { http } from './http-client.js'

/**
 * ApiRepository
 * Generic infrastructure-layer repository that talks to one REST resource of
 * the Flotix API. It keeps the same method names as the old localStorage
 * repository (getAll / getById / add / update / remove) but every call is now
 * asynchronous, and each bounded context supplies the mapping between its
 * domain entity and the API resource:
 *
 *   fromApi(resource) -> entity          toCreate(entity) -> POST body
 *   toUpdate(entity)  -> PUT body
 */
export class ApiRepository {
  /**
   * @param {string} path - resource path under /api/v1 (e.g. 'vehicles')
   * @param {{fromApi: Function, toCreate: Function, toUpdate?: Function}} mapper
   */
  constructor(path, { fromApi, toCreate, toUpdate = toCreate }) {
    this.path = path
    this.fromApi = fromApi
    this.toCreate = toCreate
    this.toUpdate = toUpdate
  }

  async getAll(params = {}) {
    const { data } = await http.get(this.path, { params })
    return data.map((resource) => this.fromApi(resource))
  }

  async getById(id) {
    try {
      const { data } = await http.get(`${this.path}/${id}`)
      return this.fromApi(data)
    } catch (error) {
      if (error.status === 404) return null
      throw error
    }
  }

  async add(entity) {
    const { data } = await http.post(this.path, this.toCreate(entity))
    return this.fromApi(data)
  }

  /** Sends the FULL representation (the API uses PUT semantics). */
  async update(id, entity) {
    const { data } = await http.put(`${this.path}/${id}`, this.toUpdate(entity))
    return this.fromApi(data)
  }

  async remove(id) {
    await http.delete(`${this.path}/${id}`)
  }
}

/** Normalizes a date (Date, ISO string or yyyy-mm-dd) to yyyy-mm-dd. */
export function toIsoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10)
  if (value instanceof Date) {
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${value.getFullYear()}-${m}-${d}`
  }
  return String(value).slice(0, 10)
}
