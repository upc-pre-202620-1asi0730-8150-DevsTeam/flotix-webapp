/**
 * BaseEntity
 * Root ancestor for every domain entity across bounded contexts.
 * Guarantees a stable identity-access (id) and a createdAt timestamp,
 * consistent with DDD's Entity pattern (identity-access over attributes).
 */
export class BaseEntity {
  constructor({ id = crypto.randomUUID(), createdAt = new Date().toISOString() } = {}) {
    this.id = id
    this.createdAt = createdAt
  }
}
