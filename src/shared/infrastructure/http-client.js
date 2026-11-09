import axios from 'axios'
import { i18n } from '@/internationalization/i18n.js'

/**
 * HTTP client for the Flotix REST API (ASP.NET Core backend).
 * The base URL comes from the VITE_API_BASE_URL environment variable (see
 * .env.example) so no environment-specific value is hardcoded or committed.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL).replace(/\/+$/, '')

export const http = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000, // Neon computes can take a few seconds to wake up when idle
  headers: { 'Content-Type': 'application/json' }
})

// The backend localizes its error messages (en, en-US, es, es-PE) from this header.
http.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.global.locale.value === 'es' ? 'es-PE' : 'en-US'
  return config
})

/** Error raised for every failed API call, with a message that is safe to show to the user. */
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function messageFrom(error) {
  const t = (key, params) => i18n.global.t(key, params)
  if (!error.response) return t('api.unreachable')
  const { status, data } = error.response
  // The backend answers 400/404/409 with a plain localized string...
  if (typeof data === 'string' && data.trim()) return data.trim()
  // ...model validation with ValidationProblemDetails ({ errors: { field: [messages] } })...
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat().filter(Boolean)
    if (first.length) return first.join(' ')
  }
  // ...and unexpected failures with ProblemDetails.
  if (data?.detail) return data.detail
  if (data?.title) return data.title
  if (status === 404) return t('api.notFound')
  if (status === 409) return t('api.conflict')
  if (status >= 500) return t('api.server')
  return t('api.failed', { status })
}

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new ApiError(messageFrom(error), error.response?.status ?? 0, error.response?.data ?? null))
)
