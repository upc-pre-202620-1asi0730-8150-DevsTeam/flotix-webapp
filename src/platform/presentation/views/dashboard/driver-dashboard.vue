<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatLongDate } from '@/internationalization/i18n.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useFuelStore } from '@/fuel-control/presentation/stores/fuel.store.js'
import { useMaintenanceStore } from '@/maintenance/presentation/stores/maintenance.store.js'
import { useIncidentsStore } from '@/incidents/presentation/stores/incidents.store.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'
import { MaintenanceStatus } from '@/maintenance/domain/model/value-objects/maintenance-status.js'
import { IncidentStatus } from '@/incidents/domain/model/value-objects/incident-status.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'

const router = useRouter()
const { t } = useI18n()
const session = useSessionStore()
const fleet = useFleetStore()
const fuel = useFuelStore()
const maintenance = useMaintenanceStore()
const incidents = useIncidentsStore()
const alerts = useAlertsStore()

const user = session.user
const myVehicle = computed(() => fleet.vehicles.find((v) => v.driverId === user?.id) ?? null)
const myFuelRecords = computed(() => fuel.records.filter((r) => r.driverId === user?.id).sort((a, b) => new Date(b.date) - new Date(a.date)))
const efficiency = computed(() => (myVehicle.value ? fuel.efficiencyFor(myVehicle.value.id) : []))
const lastEfficiency = computed(() => {
  const withKm = efficiency.value.filter((r) => r.kmPerLiter !== null)
  return withKm.length ? withKm[withKm.length - 1].kmPerLiter : null
})
const myIncidents = computed(() => incidents.incidents.filter((i) => i.driverId === user?.id && i.status !== IncidentStatus.RESOLVED))
const myMaintenance = computed(() =>
  myVehicle.value
    ? maintenance.requests.filter((r) => r.vehicleId === myVehicle.value.id && ![MaintenanceStatus.COMPLETED, MaintenanceStatus.REJECTED].includes(r.status))
    : []
)
const unreadAlerts = computed(() => alerts.notifications.filter((n) => n.userId === user?.id && !n.isRead).length)

const today = formatLongDate()
</script>

<template>
  <PageHeader :title="`${t('dashboard.driver.title')}, ${user?.name?.split(' ')[0] ?? ''}`" :subtitle="t('dashboard.driver.subtitle') + ' · ' + today" />

  <div class="grid">
    <div class="col-12 lg:col-8">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.driver.myVehicle') }}</h2>
        <EmptyState v-if="!myVehicle" icon="truck" :message="t('dashboard.driver.noVehicle')" />
        <div v-else class="flex align-items-center justify-content-between border-round-xl p-3" style="background: var(--p-surface-50)">
          <div class="flex align-items-center gap-3">
            <span class="flex align-items-center justify-content-center border-round-xl" style="width: 3rem; height: 3rem; background: var(--p-primary-100); color: var(--p-primary-700)">
              <AppIcon name="truck" :size="22" />
            </span>
            <div>
              <p class="text-lg font-bold text-heading m-0">{{ myVehicle.plate }}</p>
              <p class="text-xs text-muted m-0">{{ myVehicle.vehicleType }}</p>
              <p class="text-xs text-faint mt-1 mb-0">{{ t('dashboard.driver.mileage') }}: {{ myVehicle.currentMileage.toLocaleString() }} km</p>
            </div>
          </div>
          <StatusBadge :status="myVehicle.status" />
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.driver.quickActions') }}</h2>
        <div class="flex flex-column gap-2">
          <AppButton class="w-full justify-content-center gap-2" @click="router.push('/fuel')">
            <AppIcon name="fuel" :size="15" /> {{ t('dashboard.driver.actions.logFuel') }}
          </AppButton>
          <AppButton variant="ghost" class="w-full justify-content-center gap-2" @click="router.push('/incidents')">
            <AppIcon name="alert" :size="15" /> {{ t('dashboard.driver.actions.reportIncident') }}
          </AppButton>
          <AppButton variant="ghost" class="w-full justify-content-center gap-2" @click="router.push('/alerts')">
            <AppIcon name="bell" :size="15" /> {{ t('dashboard.driver.actions.viewAlerts') }}
          </AppButton>
        </div>
      </div>
    </div>
  </div>

  <div class="grid my-1">
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.driver.stats.mileage')" :value="myVehicle ? `${myVehicle.currentMileage.toLocaleString()} km` : '—'" icon="pin" tone="primary" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.driver.stats.lastEfficiency')" :value="lastEfficiency !== null ? `${lastEfficiency} ${t('dashboard.driver.kmPerLiter')}` : '—'" icon="fuel" tone="green" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.driver.stats.openIncidents')" :value="myIncidents.length" icon="alert" tone="amber" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.driver.stats.unreadAlerts')" :value="unreadAlerts" icon="bell" tone="red" /></div>
  </div>

  <div class="grid">
    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.driver.upcomingMaintenance') }}</h2>
        <div v-if="!myMaintenance.length" class="text-center text-sm text-faint py-4">{{ t('dashboard.driver.noMaintenance') }}</div>
        <div v-else class="flex flex-column gap-3">
          <div v-for="m in myMaintenance" :key="m.id" class="pb-3 flotix-row-divider">
            <div class="flex align-items-center justify-content-between">
              <p class="text-sm font-semibold text-heading m-0">{{ myVehicle.plate }}</p>
              <StatusBadge :status="m.status" />
            </div>
            <p class="text-xs text-faint mt-1 mb-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ m.faultDescription }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between mb-3">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('dashboard.driver.recentFuel') }}</h2>
          <router-link to="/fuel" class="flotix-link text-xs">{{ t('common.viewAll') }} →</router-link>
        </div>
        <div v-if="!myFuelRecords.length" class="text-center text-sm text-faint py-4">{{ t('dashboard.driver.noFuel') }}</div>
        <div v-else class="flex flex-column gap-3">
          <div v-for="r in myFuelRecords.slice(0, 4)" :key="r.id" class="flex align-items-center justify-content-between pb-3 flotix-row-divider">
            <div>
              <p class="text-sm font-semibold text-heading m-0">{{ r.liters }} L</p>
              <p class="text-xs text-faint m-0">{{ r.date }}</p>
            </div>
            <p class="text-sm font-bold text-heading m-0">S/ {{ r.totalCost.toFixed(0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="flex flex-column justify-content-between border-round-2xl p-3 h-full" style="border: 1px solid var(--p-primary-200); background: var(--p-primary-50)">
        <div>
          <span class="flex align-items-center justify-content-center border-round-lg" style="width: 2.25rem; height: 2.25rem; background: var(--p-primary-color); color: #fff">
            <AppIcon name="signal" :size="17" />
          </span>
          <h2 class="text-sm font-bold text-heading mt-3 mb-0">{{ t('dashboard.driver.tipTitle') }}</h2>
          <p class="text-xs text-muted mt-2 mb-0" style="line-height: 1.6">{{ t('dashboard.driver.tip') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flotix-row-divider { border-bottom: 1px solid var(--p-surface-100); }
.flotix-row-divider:last-child { border-bottom: 0; padding-bottom: 0; }
</style>
