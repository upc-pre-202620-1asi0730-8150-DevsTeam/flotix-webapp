<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useFuelStore } from '../stores/fuel.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatNumber } from '@/internationalization/i18n.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const fuel = useFuelStore()
const fleet = useFleetStore()
const { run } = useApiFeedback()

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}
function remove(id) {
  confirm.require({
    message: t('fuel.confirmDelete'),
    header: t('confirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('confirm.accept'),
    rejectLabel: t('confirm.reject'),
    acceptProps: { severity: 'danger' },
    accept: () => run(() => fuel.removeRecord(id), { errorSummary: t('fuel.deleteError'), successMessage: t('fuel.deleted') })
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
    
    :title="t('fuel.title')"
    :subtitle="t('fuel.subtitle')"
  >
    <template #actions>
      <AppButton icon="pi pi-plus" @click="router.push('/fuel/new')">{{ t('fuel.register') }}</AppButton>
    </template>
  </PageHeader>

  <div class="flotix-stats mb-3">
    <StatCard :label="t('fuel.stats.liters')" :value="totalLiters" icon="fuel" />
    <StatCard :label="t('fuel.stats.cost')" :value="totalCost" icon="cash" />
    <StatCard :label="t('fuel.stats.anomalies')" :value="anomalies" icon="alert" tone="red" />
  </div>

  <EmptyState v-if="!fuel.records.length" icon="fuel" :message="t('fuel.empty')" />

  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="fuel.records" data-key="id" striped-rows paginator :rows="10" responsive-layout="scroll" :row-class="(r) => r.anomalous ? 'flotix-row-anomaly' : ''">
      <Column field="date" :header="t('fuel.cols.date')" />
      <Column :header="t('fuel.cols.vehicle')">
        <template #body="{ data }"><span class="flotix-plate">{{ plate(data.vehicleId) }}</span></template>
      </Column>
      <Column :header="t('fuel.cols.liters')">
        <template #body="{ data }">{{ data.liters }} L</template>
      </Column>
      <Column :header="t('fuel.cols.cost')">
        <template #body="{ data }">S/ {{ data.totalCost.toFixed(2) }}</template>
      </Column>
      <Column :header="t('fuel.cols.odometer')">
        <template #body="{ data }">{{ formatNumber(data.mileageAtRefuel) }} km</template>
      </Column>
      <Column :header="t('fuel.cols.efficiency')">
        <template #body="{ data }">
          <span v-if="data.kmPerLiter === null" class="text-faint">—</span>
          <span v-else :style="{ color: data.anomalous ? '#b91c1c' : undefined, fontWeight: data.anomalous ? 600 : 400 }">
            {{ data.kmPerLiter }} km/L <span v-if="data.anomalous" class="inline-flex align-items-center gap-1 ml-2"><i class="pi pi-exclamation-triangle" style="font-size: .8rem" aria-hidden="true" />{{ t('fuel.anomalous') }}</span>
          </span>
        </template>
      </Column>
      <Column :header="t('common.actions')" style="width: 6rem">
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
