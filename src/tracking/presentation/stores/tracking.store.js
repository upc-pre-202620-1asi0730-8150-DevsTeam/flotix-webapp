import { defineStore } from 'pinia'
import { trackingService } from '../../application/tracking.service.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'

/** Pinia store — Real-Time Monitoring / Fleet Tracking. Wraps TrackingService (REST API + SignalR). */
export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    devices: [],
    latestByDevice: {}
  }),
  actions: {
    async load() {
      const [devices, latest] = await Promise.all([trackingService.listDevices(), trackingService.latestTelemetryByDevice()])
      this.devices = devices
      this.latestByDevice = latest
    },
    async connectIoTDevice(payload) {
      await trackingService.connectIoTDevice(payload)
      await this.load()
    },
    /** Keeps only the newest packet of each device (used by both REST and SignalR). */
    setLatest(packet) {
      const current = this.latestByDevice[packet.deviceId]
      if (!current || new Date(packet.timestamp) >= new Date(current.timestamp)) {
        this.latestByDevice = { ...this.latestByDevice, [packet.deviceId]: packet }
      }
    },
    async receiveTelemetry(device) {
      const packet = await trackingService.receiveTelemetry(device)
      this.setLatest(packet)
      return packet
    },
    async refreshAlerts() {
      await useAlertsStore().load().catch(() => {})
    },
    startRealtime() {
      return trackingService.startRealtime((location) => this.setLatest(location))
    },
    stopRealtime() {
      return trackingService.stopRealtime()
    }
  }
})
