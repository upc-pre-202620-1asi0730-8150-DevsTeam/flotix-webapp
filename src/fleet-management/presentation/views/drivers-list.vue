<script setup>
import { ref, computed } from 'vue'
import { useFleetStore } from '../stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Avatar from 'primevue/avatar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const fleet = useFleetStore()
const drivers = fleet.drivers

// One family of brand blues: the avatar identifies a row, it does not encode anything.
const palette = ['#123258', '#0662bd', '#094f94', '#0a2a49']
function avatarColor(id) {
  const idx = drivers.findIndex((d) => d.id === id)
  return palette[idx % palette.length]
}
function initials(name) {
  return name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}
function vehicleFor(driverId) {
  return fleet.vehicles.find((v) => v.driverId === driverId)
}
function statusFor(driverId) {
  return vehicleFor(driverId) ? 'En ruta' : 'Activo'
}

const search = ref('')
const filtered = computed(() =>
  drivers.filter((d) => `${d.name} ${d.email} ${d.licenseNumber}`.toLowerCase().includes(search.value.toLowerCase()))
)
const inRoute = computed(() => filtered.value.filter((d) => vehicleFor(d.id)).length)
</script>

<template>
  <PageHeader context-label="Vehicle & Fleet Management" :title="t('drivers.title')" :subtitle="t('drivers.subtitle', { count: drivers.length })" />

  <div class="flotix-stats mb-3">
    <StatCard :label="t('drivers.stats.total')" :value="drivers.length" icon="users" tone="primary" />
    <StatCard :label="t('drivers.stats.inRoute')" :value="inRoute" icon="truck" />
    <StatCard :label="t('drivers.stats.active')" :value="drivers.length" tone="green" icon="check" />
  </div>

  <div class="mb-3" style="max-width: 24rem">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" :placeholder="t('drivers.search')" fluid />
    </IconField>
  </div>

  <EmptyState v-if="!filtered.length" icon="users" :message="t('drivers.empty')" />

  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="filtered" data-key="id" striped-rows paginator :rows="10" responsive-layout="scroll">
      <Column :header="t('drivers.cols.driver')">
        <template #body="{ data }">
          <div class="flex align-items-center gap-3">
            <Avatar :label="initials(data.name)" shape="circle" :style="{ background: avatarColor(data.id), color: '#fff', fontSize: '.7rem', fontWeight: 700 }" />
            <div>
              <p class="font-semibold text-heading m-0">{{ data.name }}</p>
              <p class="text-xs text-faint m-0">{{ data.email }}</p>
            </div>
          </div>
        </template>
      </Column>
      <Column :header="t('drivers.cols.license')">
        <template #body="{ data }">
          <span class="text-sm text-color-secondary" style="font-variant-numeric: tabular-nums">{{ data.licenseNumber }}</span>
          <p class="text-xs text-faint m-0 mt-1">{{ t('drivers.expires', { date: data.licenseExpiry }) }}</p>
        </template>
      </Column>
      <Column :header="t('drivers.cols.vehicle')">
        <template #body="{ data }">
          <span v-if="vehicleFor(data.id)" class="flotix-plate">{{ vehicleFor(data.id).plate }}</span>
          <span v-else class="text-faint">{{ t('header.unassigned') }}</span>
        </template>
      </Column>
      <Column :header="t('drivers.cols.status')">
        <template #body="{ data }"><StatusBadge :status="statusFor(data.id)" /></template>
      </Column>
      <Column :header="t('common.actions')" style="width: 8rem">
        <template #body>
          <router-link to="/fleet-management" class="flotix-link text-sm">{{ t('drivers.viewProfile') }}</router-link>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
