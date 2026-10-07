<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useFuelStore } from '../stores/fuel.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

const router = useRouter()
const confirm = useConfirm()
const fuel = useFuelStore()
const fleet = useFleetStore()

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}
function remove(id) {
  confirm.require({
    message: '¿Eliminar este registro de combustible?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptProps: { severity: 'danger' },
    accept: () => fuel.removeRecord(id)
  })
}

const totalLiters = computed(() => fuel.records.reduce((a, r) => a + r.liters, 0).toFixed(0))
const totalCost = computed(() => fuel.records.reduce((a, r) => a + r.totalCost, 0).toFixed(2))
const anomalies = computed(() => fuel.records.filter((r) => r.anomalous).length)
</script>

<template>
  <ConfirmDialog />
  <PageHeader
    context-label="Fuel Control"
    title="Control de combustible"
    subtitle="Registro de recargas, costo asociado y detección de consumo anómalo por unidad."
  >
    <template #actions>
      <AppButton @click="router.push('/fuel/new')">+ Registrar recarga</AppButton>
    </template>
  </PageHeader>

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Litros cargados" :value="totalLiters" icon="fuel" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Gasto total (S/)" :value="totalCost" icon="cash" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Consumos anómalos" :value="anomalies" icon="alert" tone="red" /></div>
  </div>

  <EmptyState v-if="!fuel.records.length" icon="fuel" message="Aún no hay recargas de combustible registradas." />

  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="fuel.records" data-key="id" striped-rows paginator :rows="10" responsive-layout="scroll" :row-class="(r) => r.anomalous ? 'flotix-row-anomaly' : ''">
      <Column field="date" header="Fecha" />
      <Column header="Vehículo">
        <template #body="{ data }"><span class="font-semibold text-heading">{{ plate(data.vehicleId) }}</span></template>
      </Column>
      <Column header="Litros">
        <template #body="{ data }">{{ data.liters }} L</template>
      </Column>
      <Column header="Costo (S/)">
        <template #body="{ data }">S/ {{ data.totalCost.toFixed(2) }}</template>
      </Column>
      <Column header="Odómetro">
        <template #body="{ data }">{{ data.mileageAtRefuel.toLocaleString('es-PE') }} km</template>
      </Column>
      <Column header="Rendimiento">
        <template #body="{ data }">
          <span v-if="data.kmPerLiter === null" class="text-faint">—</span>
          <span v-else :style="{ color: data.anomalous ? '#dc2626' : undefined, fontWeight: data.anomalous ? 600 : 400 }">
            {{ data.kmPerLiter }} km/L <span v-if="data.anomalous">⚠️ anómalo</span>
          </span>
        </template>
      </Column>
      <Column header="Acciones" style="width: 6rem">
        <template #body="{ data }">
          <Button icon="pi pi-trash" text rounded severity="danger" @click="remove(data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
.flotix-row-anomaly { background: #fef2f2 !important; }
</style>
