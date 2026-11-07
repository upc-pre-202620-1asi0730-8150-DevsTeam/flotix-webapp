import { useApiStatusStore } from '@/shared/presentation/stores/api-status.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useFuelStore } from '@/fuel-control/presentation/stores/fuel.store.js'
import { useMaintenanceStore } from '@/maintenance/presentation/stores/maintenance.store.js'
import { useIncidentsStore } from '@/incidents/presentation/stores/incidents.store.js'
import { useTrackingStore } from '@/tracking/presentation/stores/tracking.store.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'
import { useCommerceStore } from '@/iot-commerce/presentation/stores/commerce.store.js'
import { useAnalyticsStore } from '@/analytics/presentation/stores/analytics.store.js'

let pending = null

/**
 * Loads every bounded context from the Flotix API once (or again with force=true).
 * Failures do not throw: they are collected in the api-status store so the
 * layout can show a banner with a "Retry" button.
 */
export function bootstrap(force = false) {
  if (pending && !force) return pending
  const status = useApiStatusStore()
  status.loading = true
  pending = (async () => {
    const loaders = [
      useFleetStore().load(),
      useFuelStore().load(),
      useMaintenanceStore().load(),
      useIncidentsStore().load(),
      useTrackingStore().load(),
      useAlertsStore().load(),
      useCommerceStore().load(),
      useAnalyticsStore().load()
    ]
    const results = await Promise.allSettled(loaders)
    status.errors = [...new Set(results.filter((r) => r.status === 'rejected').map((r) => r.reason?.message ?? String(r.reason)))]
    status.ready = true
    status.loading = false
  })()
  return pending
}
