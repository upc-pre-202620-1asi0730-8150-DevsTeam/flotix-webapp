import { ApiRepository } from '@/shared/infrastructure/api-repository.js'
import { http } from '@/shared/infrastructure/http-client.js'

/**
 * TelemetryDataRepository — infrastructure layer, Real-Time Monitoring (/api/v1/telemetry-data).
 * POST only enqueues the packet (HTTP 202); the API processes it in a background
 * service and pushes the new position through the SignalR hub.
 */
export const telemetryFromApi = (r) => ({
  id: r.id,
  deviceId: r.deviceId,
  latitude: Number(r.latitude),
  longitude: Number(r.longitude),
  speed: Number(r.speed),
  timestamp: r.recordedAt
})

const toCreate = (t) => ({
  deviceId: t.deviceId,
  latitude: t.latitude,
  longitude: t.longitude,
  speed: t.speed,
  recordedAt: t.timestamp
})

export class TelemetryDataRepository extends ApiRepository {
  constructor() {
    super('telemetry-data', { fromApi: telemetryFromApi, toCreate })
  }

  /** Sends one packet; the API answers 202 Accepted without a body. */
  async send(packet) {
    await http.post(this.path, this.toCreate(packet))
    return packet
  }
}
