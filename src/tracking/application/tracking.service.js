import { IoTDeviceRepository } from '../infrastructure/persistence/iot-device.repository.js'
import { TelemetryDataRepository } from '../infrastructure/persistence/telemetry-data.repository.js'
import { MonitoringHub } from '../infrastructure/realtime/monitoring-hub.js'
import { IoTDevice } from '../domain/model/entities/iot-device.entity.js'
import { TelemetryData } from '../domain/model/entities/telemetry-data.entity.js'
import { alertsService } from '@/alerts/application/alerts.service.js'
import { fleetService } from '@/fleet-management/application/fleet-management.js'

// Lima, Perú as the simulation's geographic center (AV1 targets Peruvian fleets).
const CENTER = { lat: -12.046, lng: -77.043 }

/**
 * TrackingService — application layer, Real-Time Monitoring / Fleet Tracking.
 * Implements ConnectIoTDevice, ReceiveTelemetry and UpdateVehicleLocation
 * (AV1 §4.6.1). ReceiveTelemetry also feeds the Alerts & Notifications
 * context by evaluating the speed-limit threshold on every packet.
 * Until physical GPS devices are installed, packets are simulated in the
 * browser and sent to POST /telemetry-data like a real device would.
 */
export class TrackingService {
  constructor() {
    this.deviceRepository = new IoTDeviceRepository()
    this.telemetryRepository = new TelemetryDataRepository()
    this.hub = new MonitoringHub()
  }

  listDevices() {
    return this.deviceRepository.getAll()
  }

  connectIoTDevice(payload) {
    return this.deviceRepository.add(new IoTDevice({ connectionStatus: 'Conectado', ...payload }))
  }

  /** Last known packet of each device, built from the stored telemetry. */
  async latestTelemetryByDevice() {
    const all = await this.telemetryRepository.getAll()
    const latest = {}
    for (const t of all) {
      if (!latest[t.deviceId] || new Date(t.timestamp) > new Date(latest[t.deviceId].timestamp)) {
        latest[t.deviceId] = t
      }
    }
    return latest
  }

  /** ReceiveTelemetry: sends one simulated GPS/speed packet for a device to the API. */
  async receiveTelemetry(device) {
    const packet = new TelemetryData({
      deviceId: device.id,
      latitude: +(CENTER.lat + (Math.random() - 0.5) * 0.06).toFixed(5),
      longitude: +(CENTER.lng + (Math.random() - 0.5) * 0.06).toFixed(5),
      speed: Math.round(30 + Math.random() * 80)
    })
    await this.telemetryRepository.send(packet)

    const vehicle = await fleetService.getVehicle(device.vehicleId)
    if (vehicle) await alertsService.evaluateSpeedLimit(vehicle, packet.speed).catch(() => {})
    return packet
  }

  startRealtime(onLocation) {
    return this.hub.start(onLocation)
  }

  stopRealtime() {
    return this.hub.stop()
  }
}

export const trackingService = new TrackingService()
