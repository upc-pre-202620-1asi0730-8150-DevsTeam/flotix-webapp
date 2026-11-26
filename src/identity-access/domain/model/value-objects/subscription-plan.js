/**
 * SubscriptionPlan value object — plans offered on the Flotix landing page.
 * `vehicleLimit: null` means unlimited vehicles.
 */
export const SubscriptionPlan = Object.freeze({
  STARTER: 'starter',
  GROWTH: 'growth',
  FLEET: 'fleet'
})

export const PLAN_CATALOG = Object.freeze({
  [SubscriptionPlan.STARTER]: { id: SubscriptionPlan.STARTER, name: 'Starter', priceMonthly: 149, vehicleLimit: 5 },
  [SubscriptionPlan.GROWTH]: { id: SubscriptionPlan.GROWTH, name: 'Growth', priceMonthly: 349, vehicleLimit: 25, recommended: true },
  [SubscriptionPlan.FLEET]: { id: SubscriptionPlan.FLEET, name: 'Fleet', priceMonthly: 749, vehicleLimit: null }
})

/** Returns the plan for a query/param value, or null when it is missing or unknown. */
export function findPlan(id) {
  return PLAN_CATALOG[String(id ?? '').toLowerCase()] ?? null
}
