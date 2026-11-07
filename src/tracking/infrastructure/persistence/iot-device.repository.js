import { ApiRepository } from '@/shared/infrastructure/api-repository.js'

/**
 * IoTDeviceRepository — infrastructure layer, Real-Time Monitoring (/api/v1/iot-devices).
 * The API stores a boolean `isConnected`; the UI shows "Conectado"/"Desconectado".
 */
const CONNECTED = 'Conectado'

const fromApi = (r) => ({
  id: r.id,
  vehicleId: r.vehicleId,
  serialNumber: r.serialNumber,
  connectionStatus: r.isConnected ? CONNECTED : 'Desconectado'
})

const toCreate = (d) => ({
  vehicleId: d.vehicleId,
  serialNumber: d.serialNumber,
  isConnected: d.connectionStatus === CONNECTED
})

const toUpdate = (d) => ({ vehicleId: d.vehicleId, isConnected: d.connectionStatus === CONNECTED })

export class IoTDeviceRepository extends ApiRepository {
  constructor() {
    super('iot-devices', { fromApi, toCreate, toUpdate })
  }
}
