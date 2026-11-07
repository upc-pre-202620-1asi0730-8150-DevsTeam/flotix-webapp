<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useFleetStore } from '../stores/fleet.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
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
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatNumber } from '@/internationalization/i18n.js'
import { statusLabel, vehicleTypeLabel } from '@/shared/infrastructure/domain-text.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const fleet = useFleetStore()
const { run } = useApiFeedback()

function remove(id) {
  confirm.require({
    message: t('fleet.confirmDelete'),
    header: t('confirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('confirm.accept'),
    rejectLabel: t('confirm.reject'),
    acceptProps: { severity: 'danger' },
    accept: () => run(() => fleet.removeVehicle(id), { errorSummary: t('fleet.deleteError'), successMessage: t('fleet.deleted') })
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
    
    :title="t('fleet.title')"
    :subtitle="t('fleet.subtitle')"
  >
    <template #actions>
      <AppButton @click="router.push('/fleet-management/new')">{{ t('fleet.register') }}</AppButton>
    </template>
  </PageHeader>

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard :label="t('fleet.stats.total')" :value="total" icon="truck" /></div>
    <div class="col-6 sm:col-4"><StatCard :label="t('fleet.stats.available')" :value="available" icon="check" /></div>
    <div class="col-6 sm:col-4"><StatCard :label="t('fleet.stats.inMaintenance')" :value="inMaintenance" icon="wrench" tone="amber" /></div>
  </div>

  <EmptyState v-if="!fleet.vehicles.length" icon="truck" :message="t('fleet.empty')" />

  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="fleet.vehicles" data-key="id" striped-rows paginator :rows="10" responsive-layout="scroll">
      <Column field="plate" :header="t('fleet.cols.plate')">
        <template #body="{ data }"><span class="font-semibold text-heading">{{ data.plate }}</span></template>
      </Column>
      <Column field="vehicleType" :header="t('fleet.cols.type')">
        <template #body="{ data }">{{ vehicleTypeLabel(data.vehicleType) }}</template>
      </Column>
      <Column :header="t('fleet.cols.driver')">
        <template #body="{ data }">{{ fleet.driverName(data.driverId) ?? t('header.unassigned') }}</template>
      </Column>
      <Column :header="t('fleet.cols.mileage')">
        <template #body="{ data }">{{ formatNumber(data.currentMileage) }} km</template>
      </Column>
      <Column :header="t('fleet.cols.status')">
        <template #body="{ data }"><StatusBadge :status="data.status" /></template>
      </Column>
      <Column :header="t('common.actions')" style="width: 10rem">
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
