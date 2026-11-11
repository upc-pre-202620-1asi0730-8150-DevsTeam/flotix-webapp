<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useIncidentsStore } from '../stores/incidents.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { IncidentStatus } from '../../domain/model/value-objects/incident-status.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatNumber, localeTag } from '@/internationalization/i18n.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const incidents = useIncidentsStore()
const fleet = useFleetStore()
const { run } = useApiFeedback()

const inspect = (id) => run(() => incidents.inspectIncident(id), { errorSummary: t('incidents.updateError') })
const resolve = (id) => run(() => incidents.resolveIncident(id), { errorSummary: t('incidents.updateError') })

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}
function remove(id) {
  confirm.require({
    message: t('incidents.confirmDelete'),
    header: t('confirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('confirm.accept'),
    rejectLabel: t('confirm.reject'),
    acceptProps: { severity: 'danger' },
    accept: () => run(() => incidents.removeIncident(id), { errorSummary: t('incidents.deleteError'), successMessage: t('incidents.deleted') })
  })
}

const open = computed(() => incidents.incidents.filter((i) => i.status === IncidentStatus.OPEN).length)
const resolved = computed(() => incidents.incidents.filter((i) => i.status === IncidentStatus.RESOLVED).length)
</script>

<template>
  <ConfirmDialog />
  <PageHeader
    context-label="Incident Management"
    
    :title="t('incidents.title')"
    :subtitle="t('incidents.subtitle')"
  >
    <template #actions>
      <AppButton icon="pi pi-plus" @click="router.push('/incidents/new')">{{ t('incidents.report') }}</AppButton>
    </template>
  </PageHeader>

  <div class="flotix-stats mb-3">
    <StatCard :label="t('incidents.stats.total')" :value="incidents.incidents.length" icon="alert" />
    <StatCard :label="t('incidents.stats.open')" :value="open" icon="alert" tone="amber" />
    <StatCard :label="t('incidents.stats.resolved')" :value="resolved" icon="check" />
  </div>

  <EmptyState v-if="!incidents.incidents.length" icon="alert" :message="t('incidents.empty')" />

  <div v-else class="flex flex-column gap-3">
    <div v-for="i in incidents.incidents" :key="i.id" class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
      <div class="flex flex-wrap align-items-start justify-content-between gap-2">
        <div>
          <p class="flotix-plate m-0">{{ plate(i.vehicleId) }}</p>
          <p class="text-sm text-color-secondary mt-2 mb-0">{{ i.description }}</p>
          <p class="text-xs text-faint mt-1 mb-0">{{ t('incidents.reported', { date: formatDateTime(i.reportedAt) }) }}</p>
        </div>
        <StatusBadge :status="i.status" />
      </div>
      <div class="flex align-items-center gap-2 pt-3 mt-3" style="border-top: 1px solid var(--p-surface-100)">
        <Button v-if="i.status === 'Abierto'" :label="t('incidents.actions.inspect')" severity="secondary" outlined size="small" @click="inspect(i.id)" />
        <Button v-if="i.status === 'En revisión'" :label="t('incidents.actions.resolve')" size="small" @click="resolve(i.id)" />
        <Button icon="pi pi-trash" text rounded severity="danger" class="ml-auto" @click="remove(i.id)" />
      </div>
    </div>
  </div>
</template>
