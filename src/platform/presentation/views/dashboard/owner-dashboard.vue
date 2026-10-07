<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatLongDate } from '@/internationalization/i18n.js'
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
import AppButton from '@/shared/presentation/components/app-button.component.vue'

const router = useRouter()
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

const today = formatLongDate()
</script>

<template>
  <PageHeader :title="t('dashboard.owner.title')" :subtitle="today" />

  <div v-if="urgentIncident" class="flex align-items-center gap-3 border-round-xl px-3 py-3 mb-4" style="border: 1px solid #fecaca; background: #fef2f2">
    <AppIcon name="alert" :size="18" style="color: #dc2626; flex-shrink: 0" />
    <p class="text-sm m-0" style="color: #b91c1c">
      <span class="font-semibold">{{ t('dashboard.owner.urgentPrefix') }}</span> {{ plate(urgentIncident.vehicleId) }} {{ t('dashboard.owner.urgentSuffix') }}
    </p>
    <router-link to="/incidents" class="ml-auto text-sm font-semibold flex-shrink-0" style="color: #b91c1c">{{ t('dashboard.owner.viewNow') }} →</router-link>
  </div>

  <div class="grid mb-3">
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.owner.stats.activeFleet')" :value="`${available}/${fleet.vehicles.length}`" :hint="`${available} ${t('common.available')}`" icon="truck" tone="primary" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.owner.stats.inMaintenance')" :value="inMaintenance" icon="wrench" tone="amber" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.owner.stats.fuelMonth')" :value="`S/ ${monthFuelCost.toFixed(0)}`" icon="fuel" tone="green" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.owner.stats.openAlerts')" :value="alerts.alerts.length" icon="bell" tone="red" /></div>
  </div>

  <div class="grid">
    <div class="col-12 lg:col-8">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between mb-3">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('dashboard.owner.fleetStatus') }}</h2>
          <router-link to="/fleet-management" class="flotix-link text-xs">{{ t('common.viewAll') }} →</router-link>
        </div>
        <div class="flex flex-column gap-3">
          <div v-for="v in fleet.vehicles.slice(0, 5)" :key="v.id" class="flex align-items-center justify-content-between pb-3 flotix-row-divider">
            <div class="flex align-items-center gap-3">
              <span class="flex align-items-center justify-content-center border-round-lg" style="width: 2.25rem; height: 2.25rem; background: var(--p-surface-100); color: var(--p-surface-500)">
                <AppIcon name="truck" :size="16" />
              </span>
              <div>
                <p class="text-sm font-semibold text-heading m-0">{{ v.plate }}</p>
                <p class="text-xs text-faint m-0">{{ v.vehicleType }} · {{ driverName(v.driverId) }}</p>
              </div>
            </div>
            <StatusBadge :status="v.status" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between mb-3">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('dashboard.owner.pendingMaintenance') }}</h2>
          <router-link to="/maintenance" class="flotix-link text-xs">{{ t('common.viewAll') }} →</router-link>
        </div>
        <div v-if="!openMaintenance.length" class="text-center text-sm text-faint py-4">{{ t('dashboard.owner.noPending') }}</div>
        <div v-else class="flex flex-column gap-3">
          <div v-for="m in openMaintenance.slice(0, 5)" :key="m.id" class="pb-3 flotix-row-divider">
            <div class="flex align-items-center justify-content-between">
              <p class="text-sm font-semibold text-heading m-0">{{ plate(m.vehicleId) }}</p>
              <StatusBadge :status="m.status" />
            </div>
            <p class="text-xs text-faint mt-1 mb-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ m.faultDescription }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid mt-1">
    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.owner.fuelTrend') }}</h2>
        <div v-if="!fuelTrend.length" class="text-center text-sm text-faint py-5">{{ t('dashboard.owner.noActivity') }}</div>
        <div v-else class="flex align-items-end gap-2" style="height: 8rem">
          <div v-for="r in fuelTrend" :key="r.id" class="flex flex-column align-items-center gap-2 flex-1">
            <div class="flex align-items-end justify-content-center w-full" style="height: 96px">
              <div class="w-full border-round-top" :style="{ height: r.heightPct + '%', background: 'var(--p-primary-400)', maxWidth: '26px' }" :title="`S/ ${r.totalCost.toFixed(0)}`" />
            </div>
            <p class="text-xs font-medium text-faint m-0" style="font-size: 10px">{{ r.date.slice(5) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.owner.recentActivity') }}</h2>
        <div v-if="!notifications.length" class="text-center text-sm text-faint py-5">{{ t('dashboard.owner.noActivity') }}</div>
        <ul v-else class="list-none p-0 m-0 flex flex-column gap-3">
          <li v-for="n in notifications.slice(0, 4)" :key="n.id" class="flex align-items-start gap-2 pb-3 text-xs flotix-row-divider">
            <span class="flex align-items-center justify-content-center border-round-full flex-shrink-0 mt-1" style="width: 1.5rem; height: 1.5rem; background: var(--p-surface-100); color: var(--p-surface-500)">
              <AppIcon name="bell" :size="12" />
            </span>
            <p class="m-0 text-color-secondary">{{ n.message }}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.owner.quickActions') }}</h2>
        <div class="grid">
          <div class="col-6">
            <AppButton variant="ghost" class="w-full flex-column align-items-start gap-2 py-3" @click="router.push('/fleet-management')">
              <AppIcon name="plus" :size="15" />
              <span class="text-xs font-semibold">{{ t('dashboard.owner.actions.registerVehicle') }}</span>
            </AppButton>
          </div>
          <div class="col-6">
            <AppButton variant="ghost" class="w-full flex-column align-items-start gap-2 py-3" @click="router.push('/reports')">
              <AppIcon name="chart" :size="15" />
              <span class="text-xs font-semibold">{{ t('dashboard.owner.actions.viewReports') }}</span>
            </AppButton>
          </div>
          <div class="col-6">
            <AppButton variant="ghost" class="w-full flex-column align-items-start gap-2 py-3" @click="router.push('/commerce')">
              <AppIcon name="chip" :size="15" />
              <span class="text-xs font-semibold">{{ t('dashboard.owner.actions.buyIot') }}</span>
            </AppButton>
          </div>
          <div class="col-6">
            <AppButton variant="ghost" class="w-full flex-column align-items-start gap-2 py-3" @click="router.push('/workshops')">
              <AppIcon name="building" :size="15" />
              <span class="text-xs font-semibold">{{ t('dashboard.owner.actions.workshops') }}</span>
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flotix-row-divider { border-bottom: 1px solid var(--p-surface-100); }
.flotix-row-divider:last-child { border-bottom: 0; padding-bottom: 0; }
</style>
