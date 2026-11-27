import { defineStore } from 'pinia'
import { trackingService } from '../../application/tracking.service.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

const MAX_TRAIL_POINTS = 90
const TELEMETRY_INTERVAL_MS = 3000

let telemetryTimer = null
let ticking = false
let batchCursor = 0

/** Pinia store — Real-Time Monitoring / Fleet Tracking. Wraps TrackingService (REST API + SignalR). */
export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    devices: [],
    latestByDevice: {},
    trailsByDevice: {},
    packetsCount: 0,
    realtimeStatus: 'disconnected',
    selectedDeviceId: null
  }),
  actions: {
    async load() {
      const [devices, latest] = await Promise.all([trackingService.listDevices(), trackingService.latestTelemetryByDevice()])
      this.devices = devices
      const mergedLatest = { ...latest, ...this.latestByDevice }
      for (const [deviceId, packet] of Object.entries(latest)) {
        const current = mergedLatest[deviceId]
        if (!current || new Date(packet.timestamp) >= new Date(current.timestamp)) {
          mergedLatest[deviceId] = packet
        }
      }
      this.latestByDevice = mergedLatest

      const nextTrails = { ...this.trailsByDevice }
      for (const [deviceId, packet] of Object.entries(this.latestByDevice)) {
        if (!nextTrails[deviceId]?.length) {
          nextTrails[deviceId] = [{ latitude: packet.latitude, longitude: packet.longitude }]
        }
      }
      this.trailsByDevice = nextTrails
      if (this.packetsCount < Object.keys(this.latestByDevice).length) {
        this.packetsCount = Object.keys(this.latestByDevice).length
      }
    },
    selectDevice(deviceId) {
      this.selectedDeviceId = deviceId
    },
    async connectIoTDevice(payload) {
      const created = await trackingService.connectIoTDevice(payload)
      await this.load()
      return created
    },
    async setDeviceConnection(device, isConnected) {
      await trackingService.updateIoTDevice(device.id, {
        ...device,
        connectionStatus: isConnected ? 'Conectado' : 'Desconectado'
      })
      await this.load()
    },
    generateSerialNumber(sku = 'gps') {
      return trackingService.generateSerialNumber(
        sku,
        this.devices.map((d) => d.serialNumber)
      )
    },
    routeNameFor(deviceId) {
      return trackingService.routeNameFor(deviceId)
    },
    /** Aligns connected units onto their exact road positions immediately on view open. */
    primeRoadPositions() {
      if (!trackingService.isLocalEmissionEnabled()) return
      for (const device of this.devices) {
        if (device.connectionStatus !== 'Conectado') continue
        const reading = trackingService.localRoadReading(device)
        if (reading) this.setLatest(reading, { fromRealtime: false, countPacket: false })
      }
    },
    advanceLocalPosition(device) {
      const reading = trackingService.localRoadReading(device)
      if (reading) this.setLatest(reading, { fromRealtime: false, countPacket: false })
      return reading
    },
    /** Keeps only the newest packet of each device and appends to its path trail. */
    setLatest(packet, { fromRealtime = false, countPacket = true } = {}) {
      if (!packet) return
      const current = this.latestByDevice[packet.deviceId]

      if (fromRealtime && !trackingService.acceptRealtimePacket(packet, current)) return

      const isNewer = !current || new Date(packet.timestamp) >= new Date(current.timestamp)
      if (!isNewer) return

      const moved =
        !current ||
        Math.abs(current.latitude - packet.latitude) > 0.00001 ||
        Math.abs(current.longitude - packet.longitude) > 0.00001 ||
        current.timestamp !== packet.timestamp

      this.latestByDevice = {
        ...this.latestByDevice,
        [packet.deviceId]: { ...current, ...packet }
      }

      if (moved) {
        const trail = this.trailsByDevice[packet.deviceId] ?? []
        const lastPoint = trail[trail.length - 1]
        const incomingPoints =
          Array.isArray(packet.pathSlice) && packet.pathSlice.length > 1
            ? packet.pathSlice.map(([latitude, longitude]) => ({ latitude, longitude }))
            : [{ latitude: packet.latitude, longitude: packet.longitude }]

        const firstIncoming = incomingPoints[0]
        const jumpDist = lastPoint
          ? Math.hypot(lastPoint.latitude - firstIncoming.latitude, lastPoint.longitude - firstIncoming.longitude)
          : 0

        const baseTrail = lastPoint && jumpDist > 0.005 ? [] : trail
        const merged = [...baseTrail]
        for (const pt of incomingPoints) {
          const prev = merged[merged.length - 1]
          if (!prev || Math.hypot(prev.latitude - pt.latitude, prev.longitude - pt.longitude) > 0.00001) {
            merged.push(pt)
          }
        }

        this.trailsByDevice = {
          ...this.trailsByDevice,
          [packet.deviceId]: merged.slice(-MAX_TRAIL_POINTS)
        }
        if (countPacket && (!fromRealtime || !current || current.timestamp !== packet.timestamp)) {
          this.packetsCount += 1
        }
      }
    },
    async receiveTelemetry(device, vehicle = null) {
      const packet = await trackingService.receiveTelemetry(device, vehicle)
      if (packet) this.setLatest(packet)
      return packet
    },
    async refreshAlerts() {
      await useAlertsStore().load().catch(() => {})
    },
    async runTelemetryTick() {
      if (ticking) return
      ticking = true
      try {
        const active = this.devices.filter((d) => d.connectionStatus === 'Conectado')
        if (!active.length) return

        const fleet = useFleetStore()
        let apiBatch = active
        if (active.length > 8) {
          const selected = active.find((d) => d.id === this.selectedDeviceId)
          const rest = active.filter((d) => d.id !== selected?.id)
          const slice = Array.from({ length: Math.min(5, rest.length) }, (_, i) => rest[(batchCursor + i) % rest.length])
          batchCursor = (batchCursor + slice.length) % Math.max(1, rest.length)
          apiBatch = selected ? [selected, ...slice] : slice
        }

        const batchIds = new Set(apiBatch.map((d) => d.id))
        for (const d of active) {
          if (!batchIds.has(d.id)) this.advanceLocalPosition(d)
        }

        await Promise.all(apiBatch.map((d) => this.receiveTelemetry(d, fleet.byId(d.vehicleId))))
        await this.refreshAlerts()
      } catch (e) {
        console.warn('Telemetría no enviada:', e?.message ?? e)
      } finally {
        ticking = false
      }
    },
    async startMonitoring() {
      await this.startRealtime()
      this.primeRoadPositions()
      if (telemetryTimer) clearInterval(telemetryTimer)
      this.runTelemetryTick()
      telemetryTimer = setInterval(() => this.runTelemetryTick(), TELEMETRY_INTERVAL_MS)
    },
    stopMonitoring() {
      if (telemetryTimer) {
        clearInterval(telemetryTimer)
        telemetryTimer = null
      }
      return this.stopRealtime()
    },
    startRealtime() {
      return trackingService.startRealtime(
        (location) => this.setLatest(location, { fromRealtime: true }),
        (status) => {
          this.realtimeStatus = status
        }
      )
    },
    stopRealtime() {
      this.realtimeStatus = 'disconnected'
      return trackingService.stopRealtime()
    }
  }
})
