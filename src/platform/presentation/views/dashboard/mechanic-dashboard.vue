<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatLongDate } from '@/internationalization/i18n.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useMaintenanceStore } from '@/maintenance/presentation/stores/maintenance.store.js'
import { MaintenanceStatus } from '@/maintenance/domain/model/value-objects/maintenance-status.js'
import { VehicleStatus } from '@/fleet-management/domain/model/value-objects/vehicle-status.js'

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
const maintenance = useMaintenanceStore()

const user = session.user
const myRequests = computed(() => maintenance.requests.filter((r) => r.mechanicId === user?.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
const pending = computed(() => myRequests.value.filter((r) => r.status === MaintenanceStatus.PENDING))
const inRepair = computed(() => myRequests.value.filter((r) => r.status === MaintenanceStatus.IN_REPAIR))
const completedThisMonth = computed(() => myRequests.value.filter((r) => r.status === MaintenanceStatus.COMPLETED))
const revenueThisMonth = computed(() => completedThisMonth.value.reduce((sum, r) => sum + r.estimatedCost, 0))
const vehiclesInShop = computed(() => fleet.vehicles.filter((v) => v.status === VehicleStatus.IN_MAINTENANCE && myRequests.value.some((r) => r.vehicleId === v.id)))

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}

const profile = { city: 'Lima', rating: 4.8, tags: ['Frenos', 'Motor', 'Transmisión'] }
const today = formatLongDate()
</script>

<template>
  <PageHeader :title="`${t('dashboard.mechanic.title')}, ${user?.name?.split(' ')[0] ?? ''}`" :subtitle="t('dashboard.mechanic.subtitle') + ' · ' + today" />

  <div class="grid mb-1">
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.mechanic.stats.pending')" :value="pending.length" icon="alert" tone="amber" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.mechanic.stats.inRepair')" :value="inRepair.length" icon="wrench" tone="primary" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.mechanic.stats.completedMonth')" :value="completedThisMonth.length" icon="check" tone="green" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('dashboard.mechanic.stats.revenueMonth')" :value="`S/ ${revenueThisMonth.toFixed(0)}`" icon="cash" tone="green" /></div>
  </div>

  <div class="grid">
    <div class="col-12 lg:col-8">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between mb-3">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('dashboard.mechanic.recentRequests') }}</h2>
          <router-link to="/maintenance" class="flotix-link text-xs">{{ t('dashboard.mechanic.viewAllRequests') }} →</router-link>
        </div>
        <EmptyState v-if="!myRequests.length" icon="wrench" :message="t('dashboard.mechanic.noRequests')" />
        <div v-else class="flex flex-column gap-3">
          <div v-for="r in myRequests.slice(0, 5)" :key="r.id" class="flex align-items-center justify-content-between pb-3 flotix-row-divider">
            <div class="flex align-items-center gap-3">
              <span class="flex align-items-center justify-content-center border-round-lg" style="width: 2.25rem; height: 2.25rem; background: var(--p-surface-100); color: var(--p-surface-500)">
                <AppIcon name="wrench" :size="16" />
              </span>
              <div>
                <p class="text-sm font-semibold text-heading m-0">{{ plate(r.vehicleId) }}</p>
                <p class="text-xs text-faint m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis" style="max-width: 16rem">{{ r.faultDescription }}</p>
              </div>
            </div>
            <StatusBadge :status="r.status" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 shadow-card h-full" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.mechanic.myWorkshop') }}</h2>
        <div class="border-round-xl p-3" style="background: var(--p-surface-50)">
          <p class="font-bold text-heading m-0">{{ user?.workshopName ?? '—' }}</p>
          <p class="flex align-items-center gap-2 text-xs text-faint mt-1 mb-0"><AppIcon name="pin" :size="12" /> {{ profile.city }}</p>
          <p class="flex align-items-center gap-2 text-sm font-semibold mt-2 mb-0" style="color: #d97706"><AppIcon name="star" :size="14" /> {{ profile.rating }} {{ t('dashboard.mechanic.rating') }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="tag in profile.tags" :key="tag" class="border-round-full px-2 py-1 text-xs font-medium" style="background: var(--p-primary-50); color: var(--p-primary-700)">{{ tag }}</span>
          </div>
        </div>
        <AppButton variant="ghost" class="w-full justify-content-center mt-3" @click="router.push('/settings')">{{ t('dashboard.mechanic.editProfile') }}</AppButton>
      </div>
    </div>
  </div>

  <div class="rounded-2xl border-subtle p-3 shadow-card mt-1" style="background: var(--p-surface-0)">
    <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('dashboard.mechanic.vehiclesInShop') }}</h2>
    <EmptyState v-if="!vehiclesInShop.length" icon="truck" :message="t('dashboard.mechanic.noVehiclesInShop')" />
    <div v-else class="grid">
      <div v-for="v in vehiclesInShop" :key="v.id" class="col-12 sm:col-6 lg:col-4">
        <div class="flex align-items-center gap-3 border-round-xl border-subtle p-3">
          <span class="flex align-items-center justify-content-center border-round-lg" style="width: 2.25rem; height: 2.25rem; background: #fef3c7; color: #b45309">
            <AppIcon name="truck" :size="16" />
          </span>
          <div>
            <p class="text-sm font-semibold text-heading m-0">{{ v.plate }}</p>
            <p class="text-xs text-faint m-0">{{ v.vehicleType }}</p>
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
