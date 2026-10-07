/**
 * Lightweight localStorage-backed preferences store — Bounded Context:
 * Platform. Unlike the per-entity repositories, these are singleton
 * objects (one fleet-management-wide config, one notification config per user),
 * so they skip LocalStorageRepository's array/id model.
 *
 * Fleet preferences feed real business rules: FuelConsumption's
 * anomaly detection and AlertsService's maintenance/speed thresholds
 * read these instead of hardcoded constants, so the "Flota" tab in
 * Settings actually changes system behavior, not just its own display.
 */
const FLEET_KEY = 'flotix.fleet-management-preferences'
const NOTIF_KEY_PREFIX = 'flotix.notification-preferences.'

const FLEET_DEFAULTS = Object.freeze({
  speedLimitKmh: 90,
  maintenanceIntervalKm: 10000,
  fuelAnomalyDropPct: 30
})

const NOTIFICATION_DEFAULTS = Object.freeze({
  maintenance: true,
  speed: true,
  incidents: true
})

function readJSON(key, defaults) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore persistence failures (e.g. storage disabled) */
  }
}

export function getFleetPreferences() {
  return readJSON(FLEET_KEY, FLEET_DEFAULTS)
}

export function saveFleetPreferences(prefs) {
  writeJSON(FLEET_KEY, prefs)
}

export function getNotificationPreferences(userId) {
  return readJSON(NOTIF_KEY_PREFIX + (userId ?? 'anon'), NOTIFICATION_DEFAULTS)
}

export function saveNotificationPreferences(userId, prefs) {
  writeJSON(NOTIF_KEY_PREFIX + (userId ?? 'anon'), prefs)
}
