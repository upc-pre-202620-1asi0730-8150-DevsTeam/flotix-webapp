import { LocalStorageRepository } from '@/shared/infrastructure/local-storage-repository.js'

export class ReportRepository extends LocalStorageRepository {
  constructor() {
    super('analytics.reports', [])
  }
}
