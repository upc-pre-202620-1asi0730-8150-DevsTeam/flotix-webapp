<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useFleetStore } from '../stores/fleet.store.js'
import { VehicleStatus } from '../../domain/model/value-objects/vehicle-status.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

const router = useRouter()
const confirm = useConfirm()
const fleet = useFleetStore()

function remove(id) {
  confirm.require({
    message: '¿Eliminar este vehículo de la flota?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptProps: { severity: 'danger' },
    accept: () => fleet.removeVehicle(id)
  })
}

const total = computed(() => fleet.vehicles.length)
const available = computed(() => fleet.vehicles.filter((v) => v.status === VehicleStatus.AVAILABLE).length)
const inMaintenance = computed(() => fleet.vehicles.filter((v) => v.status === VehicleStatus.IN_MAINTENANCE).length)
</script>

<template>
  <ConfirmDialog />
  <PageHeader
    context-label="Vehicle & Fleet Management"
    title="Flota de vehículos"
    subtitle="Registro, estado operativo y asignación de conductores del parque automotor."
  >
    <template #actions>
      <AppButton @click="router.push('/fleet-management/new')">+ Registrar vehículo</AppButton>
    </template>
  </PageHeader>

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Vehículos en flota" :value="total" icon="truck" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Disponibles" :value="available" icon="check" /></div>
    <div class="col-6 sm:col-4"><StatCard label="En mantenimiento" :value="inMaintenance" icon="wrench" tone="amber" /></div>
  </div>

  <EmptyState v-if="!fleet.vehicles.length" icon="truck" message="Aún no registras vehículos en tu flota." />

  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="fleet.vehicles" data-key="id" striped-rows paginator :rows="10" responsive-layout="scroll">
      <Column field="plate" header="Placa">
        <template #body="{ data }"><span class="font-semibold text-heading">{{ data.plate }}</span></template>
      </Column>
      <Column field="vehicleType" header="Tipo" />
      <Column header="Conductor asignado">
        <template #body="{ data }">{{ fleet.driverName(data.driverId) ?? 'Sin asignar' }}</template>
      </Column>
      <Column header="Kilometraje">
        <template #body="{ data }">{{ data.currentMileage.toLocaleString('es-PE') }} km</template>
      </Column>
      <Column header="Estado">
        <template #body="{ data }"><StatusBadge :status="data.status" /></template>
      </Column>
      <Column header="Acciones" style="width: 10rem">
        <template #body="{ data }">
          <div class="flex gap-1 justify-content-end">
            <Button icon="pi pi-pencil" text rounded severity="secondary" @click="router.push(`/fleet-management/${data.id}/edit`)" />
            <Button icon="pi pi-trash" text rounded severity="danger" @click="remove(data.id)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
