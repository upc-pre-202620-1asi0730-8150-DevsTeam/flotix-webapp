import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

export class TelemetryDataRepository extends LocalStorageRepository {
  constructor() {
    // Telemetry is high-frequency data; kept in-memory only (not persisted
    // to localStorage) to mirror how a real MQTT/HTTPS ingestion pipeline
    // would stream to the IoT Telemetry Processor without bloating storage.
    super('tracking.telemetry', [])
    this.reset([])
  }
}
