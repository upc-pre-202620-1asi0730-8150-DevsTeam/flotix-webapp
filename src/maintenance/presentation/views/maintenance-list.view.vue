<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useMaintenanceStore } from '../stores/maintenance.store.js'
import { MaintenanceStatus } from '../../domain/model/value-objects/maintenance-status.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

const router = useRouter()
const confirm = useConfirm()
const maintenance = useMaintenanceStore()
const fleet = useFleetStore()
const session = useSessionStore()
const mechanics = session.mechanics

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}
function mechanicName(id) {
  return mechanics.find((m) => m.id === id)?.name ?? '—'
}

function remove(id) {
  confirm.require({
    message: '¿Eliminar esta solicitud de mantenimiento?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptProps: { severity: 'danger' },
    accept: () => maintenance.removeRequest(id)
  })
}

const open = computed(() => maintenance.requests.filter((r) => ![MaintenanceStatus.COMPLETED, MaintenanceStatus.REJECTED].includes(r.status)).length)
const inRepair = computed(() => maintenance.requests.filter((r) => r.status === MaintenanceStatus.IN_REPAIR).length)
const completed = computed(() => maintenance.requests.filter((r) => r.status === MaintenanceStatus.COMPLETED).length)
</script>

<template>
  <ConfirmDialog />
  <PageHeader
    context-label="Maintenance Management"
    title="Mantenimiento preventivo y correctivo"
    subtitle="Ciclo de vida completo: solicitud, diagnóstico, presupuesto, reparación y cierre."
  >
    <template #actions>
      <AppButton @click="router.push('/maintenance/new')">+ Nueva solicitud</AppButton>
    </template>
  </PageHeader>

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Solicitudes abiertas" :value="open" icon="folder" /></div>
    <div class="col-6 sm:col-4"><StatCard label="En reparación" :value="inRepair" icon="wrench" tone="amber" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Completadas" :value="completed" icon="check" /></div>
  </div>

  <EmptyState v-if="!maintenance.requests.length" icon="wrench" message="No hay solicitudes de mantenimiento registradas." />

  <div v-else class="flex flex-column gap-3">
    <div v-for="r in maintenance.requests" :key="r.id" class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
      <div class="flex flex-wrap align-items-start justify-content-between gap-2">
        <div>
          <p class="text-sm font-semibold text-heading m-0">{{ plate(r.vehicleId) }}</p>
          <p class="text-sm text-color-secondary m-0">{{ r.faultDescription }}</p>
          <p class="text-xs text-faint mt-1 mb-0">
            Taller: {{ r.mechanicId ? mechanicName(r.mechanicId) : 'Sin asignar' }}
            <span v-if="r.estimatedCost"> · Presupuesto: S/ {{ r.estimatedCost.toFixed(2) }}</span>
          </p>
        </div>
        <StatusBadge :status="r.status" />
      </div>

      <div class="flex flex-wrap align-items-center gap-2 pt-3 mt-3" style="border-top: 1px solid var(--p-surface-100)">
        <Button v-if="r.status === 'Pendiente'" label="Registrar diagnóstico y cotización" severity="secondary" outlined size="small" @click="router.push(`/maintenance/${r.id}/quote`)" />
        <template v-if="r.status === 'Presupuestado'">
          <Button label="Aprobar presupuesto" size="small" @click="maintenance.approveOrRejectBudget(r.id, true)" />
          <Button label="Rechazar" severity="danger" outlined size="small" @click="maintenance.approveOrRejectBudget(r.id, false)" />
        </template>
        <Button v-if="r.status === 'Aprobado'" label="Iniciar reparación" severity="warn" size="small" @click="maintenance.updateRepairStatus(r.id, 'En reparación')" />
        <Button v-if="r.status === 'En reparación'" label="Marcar como completado" size="small" @click="maintenance.completeMaintenance(r.id)" />
        <Button icon="pi pi-trash" text rounded severity="danger" class="ml-auto" @click="remove(r.id)" />
      </div>
    </div>
  </div>
</template>
