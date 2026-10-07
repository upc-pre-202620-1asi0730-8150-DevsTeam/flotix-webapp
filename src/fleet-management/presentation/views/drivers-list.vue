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

const fleet = useFleetStore()
const drivers = fleet.drivers

const palette = ['#0879e8', '#059669', '#d97706', '#7c3aed', '#e11d48', '#0891b2']
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
  <PageHeader context-label="Vehicle & Fleet Management" title="Conductores" :subtitle="`${drivers.length} conductores registrados`" />

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Total" :value="drivers.length" icon="users" tone="primary" /></div>
    <div class="col-6 sm:col-4"><StatCard label="En ruta" :value="inRoute" icon="truck" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Activos" :value="drivers.length" tone="green" icon="check" /></div>
  </div>

  <div class="mb-3" style="max-width: 24rem">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" placeholder="Buscar por nombre, email o licencia..." fluid />
    </IconField>
  </div>

  <EmptyState v-if="!filtered.length" icon="users" message="No se encontraron conductores." />

  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="filtered" data-key="id" striped-rows paginator :rows="10" responsive-layout="scroll">
      <Column header="Conductor">
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
      <Column header="Licencia">
        <template #body="{ data }">
          <span style="font-family: 'JetBrains Mono', monospace" class="text-xs text-color-secondary">{{ data.licenseNumber }}</span>
          <p class="text-xs text-faint m-0 mt-1">Vence {{ data.licenseExpiry }}</p>
        </template>
      </Column>
      <Column header="Vehículo">
        <template #body="{ data }">
          <span v-if="vehicleFor(data.id)" class="font-semibold text-heading" style="font-family: 'JetBrains Mono', monospace">{{ vehicleFor(data.id).plate }}</span>
          <span v-else class="text-faint">Sin asignar</span>
        </template>
      </Column>
      <Column header="Estado">
        <template #body="{ data }"><StatusBadge :status="statusFor(data.id)" /></template>
      </Column>
      <Column header="Acciones" style="width: 8rem">
        <template #body>
          <router-link to="/fleet-management" class="flotix-link text-sm">Ver perfil →</router-link>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
