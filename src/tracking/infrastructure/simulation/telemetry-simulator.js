import { LIMA_ROUTES } from './lima-routes.data.js'

/**
 * TelemetrySimulator — pure JavaScript GPS telemetry generator following exact
 * OpenStreetMap road-snapped closed driving loops in Metropolitan Lima.
 *
 * Key properties:
 * - Zero Vue/DOM dependencies: runs in the browser today or in a Node script later.
 * - Clock-synchronized deterministic positioning: two browsers viewing the fleet
 *   simultaneously agree on each vehicle's exact street location (no SignalR jitter).
 * - Physics-checked external yielding: if an external GPS transmitter sends smooth,
 *   physically plausible sequential readings over SignalR, local emission pauses
 *   automatically for that device; impossible multi-kilometer teleports (e.g. from
 *   legacy random clients) are ignored while local road mode is active.
 */

export const LIMA_CENTER = Object.freeze({ lat: -12.088, lng: -77.032 })
export { LIMA_ROUTES }

const METERS_PER_DEG_LAT = 111_320
const COS_LIMA_LAT = Math.cos((-12.08 * Math.PI) / 180)
const EXTERNAL_YIELD_MS = 20_000
const LOCAL_MATCH_TOLERANCE_M = 80
const MAX_PLAUSIBLE_JUMP_M = 650

function hashString(input) {
  let hash = 2166136261
  const text = String(input ?? '')
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function distanceMeters(lat1, lng1, lat2, lng2) {
  const dy = (lat2 - lat1) * METERS_PER_DEG_LAT
  const dx = (lng2 - lng1) * METERS_PER_DEG_LAT * COS_LIMA_LAT
  return Math.hypot(dx, dy)
}

function computeBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const rLat1 = lat1 * (Math.PI / 180)
  const rLat2 = lat2 * (Math.PI / 180)
  const y = Math.sin(dLng) * Math.cos(rLat2)
  const x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLng)
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360
}

// Precompute cumulative road lengths in meters for each OSRM loop once.
const PREPARED_ROUTES = LIMA_ROUTES.map((route) => {
  const cumMeters = [0]
  let total = 0
  for (let i = 0; i < route.waypoints.length - 1; i += 1) {
    const a = route.waypoints[i]
    const b = route.waypoints[i + 1]
    total += distanceMeters(a[0], a[1], b[0], b[1])
    cumMeters.push(total)
  }
  return { ...route, cumMeters, totalMeters: Math.max(1, total) }
})

function findSegmentIndex(cumMeters, dist) {
  let lo = 0
  let hi = cumMeters.length - 2
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (cumMeters[mid] <= dist) lo = mid
    else hi = mid - 1
  }
  return lo
}

function pointAtDistance(preparedRoute, dist) {
  const d = ((dist % preparedRoute.totalMeters) + preparedRoute.totalMeters) % preparedRoute.totalMeters
  const idx = findSegmentIndex(preparedRoute.cumMeters, d)
  const segStart = preparedRoute.cumMeters[idx]
  const segEnd = preparedRoute.cumMeters[idx + 1]
  const segLen = Math.max(0.001, segEnd - segStart)
  const t = clamp((d - segStart) / segLen, 0, 1)
  const a = preparedRoute.waypoints[idx]
  const b = preparedRoute.waypoints[idx + 1]
  return {
    idx,
    lat: +(a[0] + (b[0] - a[0]) * t).toFixed(5),
    lng: +(a[1] + (b[1] - a[1]) * t).toFixed(5)
  }
}

function extractRoadSlice(preparedRoute, fromDist, toDist) {
  const total = preparedRoute.totalMeters
  const start = ((fromDist % total) + total) % total
  let delta = ((toDist - fromDist) % total + total) % total
  if (delta > total * 0.5) delta = 0

  const pStart = pointAtDistance(preparedRoute, start)
  const slice = [[pStart.lat, pStart.lng]]
  if (delta <= 1) return slice

  let remaining = delta
  let idx = pStart.idx
  let cursor = start
  let guard = 0

  while (remaining > 0.5 && guard < 250) {
    guard += 1
    const segEnd = preparedRoute.cumMeters[idx + 1]
    const room = segEnd - cursor
    if (remaining < room) {
      const pEnd = pointAtDistance(preparedRoute, cursor + remaining)
      slice.push([pEnd.lat, pEnd.lng])
      remaining = 0
    } else {
      remaining -= room
      const v = preparedRoute.waypoints[idx + 1]
      slice.push([v[0], v[1]])
      if (idx + 1 < preparedRoute.waypoints.length - 1) {
        idx += 1
        cursor = segEnd
      } else {
        idx = 0
        cursor = 0
      }
    }
  }
  return slice
}

export class TelemetrySimulator {
  constructor() {
    this.lastDistanceByDevice = new Map()
    this.lastLocalByDevice = new Map()
    this.lastExternalCandidate = new Map()
    this.externalYieldUntil = new Map()
  }

  /** Allows disabling browser emission via env variable when an external gateway is active. */
  isLocalEmissionEnabled() {
    const flag = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_TELEMETRY_SIMULATION : undefined
    return flag !== 'false'
  }

  shouldEmitFor(deviceId) {
    if (!this.isLocalEmissionEnabled()) return false
    const yieldUntil = this.externalYieldUntil.get(deviceId) ?? 0
    return Date.now() >= yieldUntil
  }

  markLocalTransmission(deviceId, packet) {
    this.lastLocalByDevice.set(deviceId, {
      latitude: Number(packet.latitude),
      longitude: Number(packet.longitude),
      sentAt: Date.now()
    })
  }

  /**
   * Evaluates a packet arriving via SignalR.
   * Returns `true` if the packet should be applied to the map, or `false` if it
   * is an implausible multi-kilometer teleport while local road tracking is active
   * (for example, legacy random telemetry from another open tab).
   */
  acceptRealtimePacket(deviceId, packet, currentPacket = null) {
    if (!this.isLocalEmissionEnabled()) return true

    const lat = Number(packet.latitude)
    const lng = Number(packet.longitude)
    const now = Date.now()

    const recentLocal = this.lastLocalByDevice.get(deviceId)
    if (
      recentLocal &&
      now - recentLocal.sentAt < 12_000 &&
      distanceMeters(recentLocal.latitude, recentLocal.longitude, lat, lng) <= LOCAL_MATCH_TOLERANCE_M
    ) {
      return true
    }

    // Check whether an external source is sending coherent, continuous road movement (2 consecutive plausible steps).
    const prevExt = this.lastExternalCandidate.get(deviceId)
    const isPlausibleStep =
      prevExt &&
      now - prevExt.seenAt >= 1_000 &&
      now - prevExt.seenAt <= 12_000 &&
      distanceMeters(prevExt.latitude, prevExt.longitude, lat, lng) <= MAX_PLAUSIBLE_JUMP_M
    const streak = isPlausibleStep ? (prevExt.streak ?? 0) + 1 : 0
    this.lastExternalCandidate.set(deviceId, { latitude: lat, longitude: lng, seenAt: now, streak })

    if (streak >= 2) {
      this.externalYieldUntil.set(deviceId, now + EXTERNAL_YIELD_MS)
      return true
    }

    return false
  }

  _profileFor(deviceId) {
    const seed = hashString(deviceId)
    const route = PREPARED_ROUTES[seed % PREPARED_ROUTES.length]
    const offsetRatio = ((seed >>> 4) % 1000) / 1000
    const phase = ((seed >>> 14) % 628) / 100
    const speedFactor = 0.92 + (((seed >>> 22) % 17) / 100)
    return {
      route,
      offsetMeters: offsetRatio * route.totalMeters,
      phase,
      cruiseMetersPerSec: (route.baseSpeed / 3.6) * speedFactor * 1.45
    }
  }

  routeNameFor(deviceId) {
    return this._profileFor(deviceId).route.name
  }

  /**
   * Computes the vehicle's exact road-snapped position and speed at `nowMs`.
   * Includes `pathSlice` (every intermediate road vertex traversed since the
   * last tick) so trails and markers turn corners strictly along paved streets.
   */
  nextReading(deviceId, nowMs = Date.now()) {
    const profile = this._profileFor(deviceId)
    const { route, offsetMeters, phase, cruiseMetersPerSec } = profile

    const currentDist = (offsetMeters + (nowMs / 1000) * cruiseMetersPerSec) % route.totalMeters
    const prevDist = this.lastDistanceByDevice.get(deviceId) ?? (currentDist - cruiseMetersPerSec * 2.5 + route.totalMeters) % route.totalMeters
    this.lastDistanceByDevice.set(deviceId, currentDist)

    const pathSlice = extractRoadSlice(route, prevDist, currentDist)
    const last = pathSlice[pathSlice.length - 1]
    const prev = pathSlice[Math.max(0, pathSlice.length - 2)]

    const halfRange = (route.maxSpeed - route.minSpeed) / 2
    const midSpeed = (route.maxSpeed + route.minSpeed) / 2
    const wave = Math.sin(nowMs / 18_000 + phase) * halfRange * 0.85 + Math.cos(nowMs / 7_500 + phase) * 3
    const speed = clamp(Math.round(midSpeed + wave), route.minSpeed, route.maxSpeed)

    return {
      latitude: last[0],
      longitude: last[1],
      speed,
      heading: Math.round(computeBearing(prev[0], prev[1], last[0], last[1])),
      routeName: route.name,
      pathSlice,
      timestamp: new Date(nowMs).toISOString()
    }
  }
}

export const telemetrySimulator = new TelemetrySimulator()
