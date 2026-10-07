import { createI18n } from 'vue-i18n'
import { content } from '@/shared/infrastructure/content.js'

const STORAGE_KEY = 'flotix:locale'
function initialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch { /* ignore */ }
  return 'en' // default English per the course's i18n requirement
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: content
})

export function setLocale(locale) {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch { /* ignore */ }
  document.documentElement.setAttribute('lang', locale === 'es' ? 'es-419' : 'en-US')
}

export function toggleLocale() {
  setLocale(i18n.global.locale.value === 'en' ? 'es' : 'en')
}

/** Locale-aware long date, e.g. "Saturday, September 19, 2026". */
export function formatLongDate(date = new Date()) {
  const tag = i18n.global.locale.value === 'es' ? 'es-PE' : 'en-US'
  const text = date.toLocaleDateString(tag, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}
