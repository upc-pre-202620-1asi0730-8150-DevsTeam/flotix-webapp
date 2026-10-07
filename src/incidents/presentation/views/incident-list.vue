<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useIncidentsStore } from '../stores/incidents.store.js'
import { IncidentStatus } from '../../domain/model/value-objects/incident-status.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

const router = useRouter()
const confirm = useConfirm()
const incidents = useIncidentsStore()
const fleet = useFleetStore()

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}
function remove(id) {
  confirm.require({
    message: '¿Eliminar esta incidencia?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptProps: { severity: 'danger' },
    accept: () => incidents.removeIncident(id)
  })
}

const open = computed(() => incidents.incidents.filter((i) => i.status === IncidentStatus.OPEN).length)
const resolved = computed(() => incidents.incidents.filter((i) => i.status === IncidentStatus.RESOLVED).length)
</script>

<template>
  <ConfirmDialog />
  <PageHeader
    context-label="Incident Management"
    title="Incidencias en ruta"
    subtitle="Reporte y seguimiento de fallas o anomalías imprevistas durante la operación."
  >
    <template #actions>
      <AppButton @click="router.push('/incidents/new')">+ Reportar incidencia</AppButton>
    </template>
  </PageHeader>

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Incidencias totales" :value="incidents.incidents.length" icon="alert" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Abiertas" :value="open" icon="alert" tone="amber" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Resueltas" :value="resolved" icon="check" /></div>
  </div>

  <EmptyState v-if="!incidents.incidents.length" icon="alert" message="No hay incidencias reportadas." />

  <div v-else class="flex flex-column gap-3">
    <div v-for="i in incidents.incidents" :key="i.id" class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
      <div class="flex flex-wrap align-items-start justify-content-between gap-2">
        <div>
          <p class="text-sm font-semibold text-heading m-0">{{ plate(i.vehicleId) }}</p>
          <p class="text-sm text-color-secondary m-0">{{ i.description }}</p>
          <p class="text-xs text-faint mt-1 mb-0">Reportado: {{ new Date(i.reportedAt).toLocaleString('es-PE') }}</p>
        </div>
        <StatusBadge :status="i.status" />
      </div>
      <div class="flex align-items-center gap-2 pt-3 mt-3" style="border-top: 1px solid var(--p-surface-100)">
        <Button v-if="i.status === 'Abierto'" label="Marcar en inspección" severity="secondary" outlined size="small" @click="incidents.inspectIncident(i.id)" />
        <Button v-if="i.status === 'En revisión'" label="Marcar como resuelto" size="small" @click="incidents.resolveIncident(i.id)" />
        <Button icon="pi pi-trash" text rounded severity="danger" class="ml-auto" @click="remove(i.id)" />
      </div>
    </div>
  </div>
</template>
