import { findPlan } from '../domain/model/value-objects/subscription-plan.js'

const KEY = 'flotix:identity-access.subscriptions.v1'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {}
  } catch {
    return {}
  }
}

/**
 * Simulated subscription purchase (frontend only, no real charge).
 * Only the last 4 digits of the card are kept; the full number and CVV are never stored.
 */
export const subscriptionService = {
  activate(userId, planId, card) {
    const plan = findPlan(planId)
    if (!plan || !userId) return null
    const digits = String(card?.number ?? '').replace(/\D/g, '')
    const now = new Date()
    const renewal = new Date(now)
    renewal.setMonth(renewal.getMonth() + 1)
    const subscription = {
      planId: plan.id,
      priceMonthly: plan.priceMonthly,
      status: 'active',
      simulated: true,
      startedAt: now.toISOString(),
      renewsAt: renewal.toISOString(),
      cardLast4: digits.slice(-4),
      cardExpiry: card?.expiry ?? ''
    }
    const all = readAll()
    all[userId] = subscription
    localStorage.setItem(KEY, JSON.stringify(all))
    return subscription
  },
  forUser(userId) {
    return readAll()[userId] ?? null
  }
}
