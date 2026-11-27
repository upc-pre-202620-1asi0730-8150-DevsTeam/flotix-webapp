import { IoTDeviceRepository } from '../infrastructure/persistence/iot-device.repository.js'
import { TelemetryDataRepository } from '../infrastructure/persistence/telemetry-data.repository.js'
import { MonitoringHub } from '../infrastructure/realtime/monitoring-hub.js'
import { telemetrySimulator } from '../infrastructure/simulation/telemetry-simulator.js'
import { IoTDevice } from '../domain/model/entities/iot-device.entity.js'
import { TelemetryData } from '../domain/model/entities/telemetry-data.entity.js'
import { alertsService } from '@/alerts/application/alerts.service.js'
import { fleetService } from '@/fleet-management/application/fleet-management.js'

const SERIAL_PREFIX = Object.freeze({
  gps: 'GPS',
  odometer: 'ODO',
  'fuel-sensor': 'FUL'
})

/**
 * TrackingService — application layer, Real-Time Monitoring / Fleet Tracking.
 * Implements ConnectIoTDevice, UpdateIoTDevice, ReceiveTelemetry and
 * UpdateVehicleLocation (AV1 §4.6.1). ReceiveTelemetry feeds the Alerts &
 * Notifications context by evaluating the speed-limit threshold on every packet.
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

  updateIoTDevice(id, payload) {
    return this.deviceRepository.update(id, payload)
  }

  /** Generates a valid Flotix serial number matching backend `^[A-Z0-9-]+$`. */
  generateSerialNumber(sku = 'gps', existingSerials = []) {
    const tag = SERIAL_PREFIX[sku] ?? 'GPS'
    const taken = new Set(existingSerials.map((s) => String(s).toUpperCase()))
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    for (let attempt = 0; attempt < 20; attempt += 1) {
      let suffix = ''
      for (let i = 0; i < 4; i += 1) suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
      const candidate = `FLX-${tag}-${suffix}`
      if (!taken.has(candidate)) return candidate
    }
    return `FLX-${tag}-${Date.now().toString(36).slice(-4).toUpperCase()}`
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

  routeNameFor(deviceId) {
    return telemetrySimulator.routeNameFor(deviceId)
  }

  isLocalEmissionEnabled() {
    return telemetrySimulator.isLocalEmissionEnabled()
  }

  acceptRealtimePacket(packet, currentPacket = null) {
    return telemetrySimulator.acceptRealtimePacket(packet.deviceId, packet, currentPacket)
  }

  /** Computes the current clock-synced road reading without sending an HTTP request. */
  localRoadReading(device) {
    if (!telemetrySimulator.shouldEmitFor(device.id)) return null
    const reading = telemetrySimulator.nextReading(device.id)
    const packet = new TelemetryData({
      deviceId: device.id,
      latitude: reading.latitude,
      longitude: reading.longitude,
      speed: reading.speed,
      timestamp: reading.timestamp
    })
    return {
      ...packet,
      heading: reading.heading,
      routeName: reading.routeName,
      pathSlice: reading.pathSlice
    }
  }

  /**
   * ReceiveTelemetry: sends the next road-snapped GPS/speed reading for a
   * connected device along its Lima loop to POST /api/v1/telemetry-data,
   * unless an external transmitter is currently feeding that device.
   */
  async receiveTelemetry(device, knownVehicle = null) {
    if (!telemetrySimulator.shouldEmitFor(device.id)) return null

    const reading = telemetrySimulator.nextReading(device.id)
    const packet = new TelemetryData({
      deviceId: device.id,
      latitude: reading.latitude,
      longitude: reading.longitude,
      speed: reading.speed,
      timestamp: reading.timestamp
    })

    telemetrySimulator.markLocalTransmission(device.id, packet)
    await this.telemetryRepository.send(packet)

    const vehicle = knownVehicle ?? (await fleetService.getVehicle(device.vehicleId).catch(() => null))
    if (vehicle) await alertsService.evaluateSpeedLimit(vehicle, packet.speed).catch(() => {})

    return {
      ...packet,
      heading: reading.heading,
      routeName: reading.routeName,
      pathSlice: reading.pathSlice
    }
  }

  startRealtime(onLocation, onStatusChange) {
    return this.hub.start(onLocation, onStatusChange)
  }

  stopRealtime() {
    return this.hub.stop()
  }
}

export const trackingService = new TrackingService()
