import { BaseEntity } from '@/shared/domain/model/base-entity.js'

/**
 * Report entity — Bounded Context: Reporting & Analytics.
 * Mirrors `reports` (AV1 §4.8.1): ownerId, reportType, generatedAt,
 * filterParams.
 */
export class Report extends BaseEntity {
  constructor({ id, createdAt, ownerId, reportType, generatedAt = new Date().toISOString(), filterParams = {} }) {
    super({ id, createdAt })
    this.ownerId = ownerId
    this.reportType = reportType
    this.generatedAt = generatedAt
    this.filterParams = filterParams
  }
}
