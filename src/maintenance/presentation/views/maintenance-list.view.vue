<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useMaintenanceStore } from '../stores/maintenance.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const maintenance = useMaintenanceStore()
const fleet = useFleetStore()
const session = useSessionStore()
const mechanics = session.mechanics
const { run } = useApiFeedback()

const decide = (id, approved) => run(() => maintenance.approveOrRejectBudget(id, approved), { errorSummary: t('maintenance.decisionError') })
const startRepair = (id) => run(() => maintenance.updateRepairStatus(id, 'En reparación'), { errorSummary: t('maintenance.startError') })
const complete = (id) => run(() => maintenance.completeMaintenance(id), { errorSummary: t('maintenance.completeError') })

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}
function mechanicName(id) {
  return mechanics.find((m) => m.id === id)?.name ?? '—'
}

function remove(id) {
  confirm.require({
    message: t('maintenance.confirmDelete'),
    header: t('confirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('confirm.accept'),
    rejectLabel: t('confirm.reject'),
    acceptProps: { severity: 'danger' },
    accept: () => run(() => maintenance.removeRequest(id), { errorSummary: t('maintenance.deleteError'), successMessage: t('maintenance.deleted') })
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
    
    :title="t('maintenance.title')"
    :subtitle="t('maintenance.subtitle')"
  >
    <template #actions>
      <AppButton icon="pi pi-plus" @click="router.push('/maintenance/new')">{{ t('maintenance.new') }}</AppButton>
    </template>
  </PageHeader>

  <div class="flotix-stats mb-3">
    <StatCard :label="t('maintenance.stats.open')" :value="open" icon="folder" />
    <StatCard :label="t('maintenance.stats.inRepair')" :value="inRepair" icon="wrench" tone="amber" />
    <StatCard :label="t('maintenance.stats.completed')" :value="completed" icon="check" />
  </div>

  <EmptyState v-if="!maintenance.requests.length" icon="wrench" :message="t('maintenance.empty')" />

  <div v-else class="flex flex-column gap-3">
    <div v-for="r in maintenance.requests" :key="r.id" class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
      <div class="flex flex-wrap align-items-start justify-content-between gap-2">
        <div>
          <p class="flotix-plate m-0">{{ plate(r.vehicleId) }}</p>
          <p class="text-sm text-color-secondary mt-2 mb-0">{{ r.faultDescription }}</p>
          <p class="text-xs text-faint mt-1 mb-0">
            {{ t('maintenance.workshop') }}: {{ r.mechanicId ? mechanicName(r.mechanicId) : t('maintenance.noWorkshop') }}
            <span v-if="r.estimatedCost" class="ml-3">{{ t('maintenance.budget') }}: S/ {{ r.estimatedCost.toFixed(2) }}</span>
          </p>
        </div>
        <StatusBadge :status="r.status" />
      </div>

      <div class="flex flex-wrap align-items-center gap-2 pt-3 mt-3" style="border-top: 1px solid var(--p-surface-100)">
        <Button v-if="r.status === 'Pendiente'" :label="t('maintenance.actions.quote')" severity="secondary" outlined size="small" @click="router.push(`/maintenance/${r.id}/quote`)" />
        <template v-if="r.status === 'Presupuestado'">
          <Button :label="t('maintenance.actions.approve')" size="small" @click="decide(r.id, true)" />
          <Button :label="t('maintenance.actions.reject')" severity="danger" outlined size="small" @click="decide(r.id, false)" />
        </template>
        <Button v-if="r.status === 'Aprobado'" :label="t('maintenance.actions.start')" severity="warn" size="small" @click="startRepair(r.id)" />
        <Button v-if="r.status === 'En reparación'" :label="t('maintenance.actions.complete')" size="small" @click="complete(r.id)" />
        <Button icon="pi pi-trash" text rounded severity="danger" class="ml-auto" @click="remove(r.id)" />
      </div>
    </div>
  </div>
</template>
