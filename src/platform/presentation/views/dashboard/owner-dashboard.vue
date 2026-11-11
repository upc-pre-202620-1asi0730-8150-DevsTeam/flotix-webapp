<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatLongDate, formatDateTime } from '@/internationalization/i18n.js'
import { vehicleTypeLabel, notificationMessage } from '@/shared/infrastructure/domain-text.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useFuelStore } from '@/fuel-control/presentation/stores/fuel.store.js'
import { useMaintenanceStore } from '@/maintenance/presentation/stores/maintenance.store.js'
import { useIncidentsStore } from '@/incidents/presentation/stores/incidents.store.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'
import { VehicleStatus } from '@/fleet-management/domain/model/value-objects/vehicle-status.js'
import { MaintenanceStatus } from '@/maintenance/domain/model/value-objects/maintenance-status.js'
import { IncidentStatus } from '@/incidents/domain/model/value-objects/incident-status.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'

const { t } = useI18n()
const fleet = useFleetStore()
const fuel = useFuelStore()
const maintenance = useMaintenanceStore()
const incidents = useIncidentsStore()
const alerts = useAlertsStore()

const available = computed(() => fleet.vehicles.filter((v) => v.status === VehicleStatus.AVAILABLE).length)
const inMaintenance = computed(() => fleet.vehicles.filter((v) => v.status === VehicleStatus.IN_MAINTENANCE).length)
const openMaintenance = computed(() => maintenance.requests.filter((r) => ![MaintenanceStatus.COMPLETED, MaintenanceStatus.REJECTED].includes(r.status)))
const urgentIncident = computed(() => incidents.incidents.find((i) => i.status === IncidentStatus.OPEN))
const monthFuelCost = computed(() => fuel.records.reduce((a, r) => a + r.totalCost, 0))
const notifications = computed(() => alerts.notifications.slice().sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)))

function plate(id) {
  return fleet.vehicles.find((v) => v.id === id)?.plate ?? '—'
}
function driverName(id) {
  return fleet.driverName(id) ?? t('header.unassigned')
}

const fuelTrend = computed(() => {
  const recent = fuel.records.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-6)
  const max = Math.max(1, ...recent.map((r) => r.totalCost))
  return recent.map((r) => ({ ...r, heightPct: Math.max(6, Math.round((r.totalCost / max) * 100)) }))
})

const today = computed(() => formatLongDate())

const quickActions = [
  { to: '/fleet-management/new', icon: 'plus', key: 'registerVehicle' },
  { to: '/reports', icon: 'chart', key: 'viewReports' },
  { to: '/commerce', icon: 'chip', key: 'buyIot' },
  { to: '/workshops', icon: 'building', key: 'workshops' }
]
</script>

<template>
  <PageHeader :title="t('dashboard.owner.title')" :subtitle="today" />

  <div v-if="urgentIncident" role="alert" class="flex align-items-center gap-3 border-round-xl px-3 py-3 mb-3" style="background: #fde4e1; color: #a52a1c">
    <AppIcon name="alert" :size="18" style="flex-shrink: 0" />
    <p class="text-sm m-0">
      <span class="font-semibold">{{ t('dashboard.owner.urgentPrefix') }}</span>
      <span class="flotix-plate mx-2">{{ plate(urgentIncident.vehicleId) }}</span>{{ t('dashboard.owner.urgentSuffix') }}
    </p>
    <router-link to="/incidents" class="ml-auto text-sm font-semibold flex-shrink-0" style="color: inherit">{{ t('dashboard.owner.viewNow') }}</router-link>
  </div>

  <div class="flotix-stats mb-3">
    <StatCard :label="t('dashboard.owner.stats.activeFleet')" :value="`${available}/${fleet.vehicles.length}`" :hint="`${available} ${t('common.available')}`" icon="truck" tone="primary" />
    <StatCard :label="t('dashboard.owner.stats.inMaintenance')" :value="inMaintenance" icon="wrench" tone="amber" />
    <StatCard :label="t('dashboard.owner.stats.fuelMonth')" :value="`S/ ${monthFuelCost.toFixed(0)}`" icon="fuel" />
    <StatCard :label="t('dashboard.owner.stats.openAlerts')" :value="alerts.alerts.length" icon="bell" :tone="alerts.alerts.length ? 'red' : 'ink'" />
  </div>

  <div class="grid">
    <div class="col-12 lg:col-8">
      <div class="rounded-2xl border-subtle p-3 h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between mb-2">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('dashboard.owner.fleetStatus') }}</h2>
          <router-link to="/fleet-management" class="flotix-link text-sm">{{ t('common.viewAll') }}</router-link>
        </div>
        <div class="flex flex-column">
          <div v-for="v in fleet.vehicles.slice(0, 5)" :key="v.id" class="flex align-items-center gap-3 py-2 flotix-row-divider">
            <span class="flotix-plate flex-shrink-0">{{ v.plate }}</span>
            <p class="text-sm m-0 flex-1 min-w-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">
              <span class="text-heading">{{ vehicleTypeLabel(v.vehicleType) }}</span>
              <span class="text-muted ml-2">{{ driverName(v.driverId) }}</span>
            </p>
            <StatusBadge :status="v.status" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between mb-2">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('dashboard.owner.pendingMaintenance') }}</h2>
          <router-link to="/maintenance" class="flotix-link text-sm">{{ t('common.viewAll') }}</router-link>
        </div>
        <p v-if="!openMaintenance.length" class="text-sm text-muted py-3 m-0">{{ t('dashboard.owner.noPending') }}</p>
        <div v-else class="flex flex-column">
          <div v-for="m in openMaintenance.slice(0, 5)" :key="m.id" class="py-2 flotix-row-divider">
            <div class="flex align-items-center justify-content-between">
              <span class="flotix-plate">{{ plate(m.vehicleId) }}</span>
              <StatusBadge :status="m.status" />
            </div>
            <p class="text-sm text-muted mt-1 mb-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ m.faultDescription }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid mt-1">
    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.owner.fuelTrend') }}</h2>
        <p v-if="!fuelTrend.length" class="text-sm text-muted py-3 m-0">{{ t('dashboard.owner.noActivity') }}</p>
        <div v-else class="flex align-items-end gap-2" style="height: 9.5rem">
          <div v-for="r in fuelTrend" :key="r.id" class="flex flex-column align-items-center gap-1 flex-1 h-full">
            <div class="flex flex-column align-items-center justify-content-end w-full flex-1">
              <span class="text-xs text-color-secondary mb-1" style="font-variant-numeric: tabular-nums">{{ r.totalCost.toFixed(0) }}</span>
              <div class="w-full" :style="{ height: r.heightPct * 0.8 + '%', background: 'var(--p-primary-color)', maxWidth: '28px', borderRadius: '2px 2px 0 0' }" />
            </div>
            <p class="text-xs text-muted m-0 pt-1 w-full text-center" style="border-top: 1px solid var(--p-surface-200)">{{ r.date.slice(8) }}/{{ r.date.slice(5, 7) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-2">{{ t('dashboard.owner.recentActivity') }}</h2>
        <p v-if="!notifications.length" class="text-sm text-muted py-3 m-0">{{ t('dashboard.owner.noActivity') }}</p>
        <ul v-else class="list-none p-0 m-0 flex flex-column">
          <li v-for="n in notifications.slice(0, 4)" :key="n.id" class="py-2 flotix-row-divider">
            <p class="text-sm m-0 text-color-secondary">{{ notificationMessage(n.message) }}</p>
            <p class="text-xs text-muted mt-1 mb-0">{{ formatDateTime(n.sentAt) }}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-2">{{ t('dashboard.owner.quickActions') }}</h2>
        <nav class="flex flex-column">
          <router-link v-for="a in quickActions" :key="a.to" :to="a.to" class="flotix-action flotix-row-divider">
            <AppIcon :name="a.icon" :size="15" />
            <span class="flex-1">{{ t(`dashboard.owner.actions.${a.key}`) }}</span>
            <AppIcon name="chevronRight" :size="12" class="flotix-action-chevron" />
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flotix-row-divider { border-bottom: 1px solid var(--p-surface-100); }
.flotix-row-divider:last-child { border-bottom: 0; }

.flotix-action {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .65rem 0;
  font-size: .9375rem;
  font-weight: 500;
  color: var(--p-surface-800);
  text-decoration: none;
  transition: color .15s ease;
}
.flotix-action-chevron {
  color: var(--p-surface-400);
  transition: transform .15s var(--flotix-ease-out);
}
@media (hover: hover) {
  .flotix-action:hover { color: var(--p-primary-color); }
  .flotix-action:hover .flotix-action-chevron { transform: translateX(3px); color: var(--p-primary-color); }
}
</style>
