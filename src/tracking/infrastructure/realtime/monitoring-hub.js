import * as signalR from '@microsoft/signalr'
import { API_BASE_URL } from '@/shared/infrastructure/http-client.js'
import { telemetryFromApi } from '../persistence/telemetry-data.repository.js'

/**
 * MonitoringHub — infrastructure layer, Real-Time Monitoring.
 * Subscribes to the API's SignalR hub (/hubs/monitoring). Every telemetry
 * packet processed by the backend is pushed here as `VehicleLocationUpdated`.
 */
export class MonitoringHub {
  constructor() {
    this.connection = null
  }

  /** @param {(location: {deviceId: string, vehicleId: string, latitude: number, longitude: number, speed: number, timestamp: string}) => void} onLocation */
  async start(onLocation) {
    if (this.connection) return
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/monitoring`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    this.connection.on('VehicleLocationUpdated', (r) => {
      onLocation({ ...telemetryFromApi({ ...r, id: crypto.randomUUID() }), vehicleId: r.vehicleId })
    })

    try {
      await this.connection.start()
    } catch (error) {
      // Real-time push is optional: the dashboard still works with the REST responses.
      console.warn('No se pudo conectar al hub de monitoreo en tiempo real:', error?.message ?? error)
      this.connection = null
    }
  }

  async stop() {
    if (!this.connection) return
    await this.connection.stop().catch(() => {})
    this.connection = null
  }
}
