import { defineStore } from 'pinia'
import { trackingService } from '../../application/tracking.service.js'

/** Pinia store — Real-Time Monitoring / Fleet Tracking. Wraps TrackingService. */
export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    devices: trackingService.listDevices(),
    latestByDevice: trackingService.latestTelemetryByDevice()
  }),
  actions: {
    refresh() {
      this.devices = trackingService.listDevices()
      this.latestByDevice = trackingService.latestTelemetryByDevice()
    },
    connectIoTDevice(payload) {
      trackingService.connectIoTDevice(payload)
      this.refresh()
    },
    receiveTelemetry(device) {
      const packet = trackingService.receiveTelemetry(device)
      this.refresh()
      return packet
    }
  }
})
