import { BaseEntity } from '@/shared/domain/model/base-entity.js'

/**
 * IoTDevice entity — Bounded Context: Real-Time Monitoring / Fleet Tracking.
 * Mirrors `iot_devices` (AV1 §4.8.1): vehicleId, serialNumber, connectionStatus.
 */
export class IoTDevice extends BaseEntity {
  constructor({ id, createdAt, vehicleId, serialNumber, connectionStatus = 'Conectado' }) {
    super({ id, createdAt })
    this.vehicleId = vehicleId
    this.serialNumber = serialNumber
    this.connectionStatus = connectionStatus
  }
}
