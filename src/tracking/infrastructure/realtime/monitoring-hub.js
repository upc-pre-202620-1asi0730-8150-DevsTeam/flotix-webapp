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

  /**
   * @param {(location: {deviceId: string, vehicleId: string, latitude: number, longitude: number, speed: number, timestamp: string}) => void} onLocation
   * @param {(status: 'connected' | 'reconnecting' | 'disconnected') => void} [onStatusChange]
   */
  async start(onLocation, onStatusChange) {
    if (this.connection) return
    const notify = (status) => {
      if (typeof onStatusChange === 'function') onStatusChange(status)
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/monitoring`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    this.connection.on('VehicleLocationUpdated', (r) => {
      onLocation({ ...telemetryFromApi({ ...r, id: crypto.randomUUID() }), vehicleId: r.vehicleId })
    })
    this.connection.onreconnecting(() => notify('reconnecting'))
    this.connection.onreconnected(() => notify('connected'))
    this.connection.onclose(() => notify('disconnected'))

    try {
      await this.connection.start()
      notify('connected')
    } catch (error) {
      // Real-time push is optional: the dashboard still works with the REST responses.
      console.warn('No se pudo conectar al hub de monitoreo en tiempo real:', error?.message ?? error)
      this.connection = null
      notify('disconnected')
    }
  }

  async stop() {
    if (!this.connection) return
    await this.connection.stop().catch(() => {})
    this.connection = null
  }
}
