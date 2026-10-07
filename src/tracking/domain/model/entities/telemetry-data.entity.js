import { BaseEntity } from '@/shared/domain/model/base-entity.js'

/**
 * TelemetryData entity — Bounded Context: Real-Time Monitoring / Fleet Tracking.
 * Mirrors `telemetry_data` (AV1 §4.8.1): deviceId, latitude, longitude,
 * speed, timestamp.
 */
export class TelemetryData extends BaseEntity {
  constructor({ id, createdAt, deviceId, latitude, longitude, speed, timestamp = new Date().toISOString() }) {
    super({ id, createdAt })
    this.deviceId = deviceId
    this.latitude = latitude
    this.longitude = longitude
    this.speed = speed
    this.timestamp = timestamp
  }
}
