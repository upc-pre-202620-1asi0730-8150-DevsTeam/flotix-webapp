<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFleetStore } from '../stores/fleet.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { DEMO_OWNER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { VehicleStatus, VehicleTypes } from '../../domain/model/value-objects/vehicle-status.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import FormCard from '@/shared/presentation/components/form-card.component.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { useI18n } from 'vue-i18n'
import { statusLabel, vehicleTypeLabel } from '@/shared/infrastructure/domain-text.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const fleet = useFleetStore()
const session = useSessionStore()
const { run } = useApiFeedback()
const saving = ref(false)

const editingId = route.params.id ?? null
const existing = editingId ? fleet.byId(editingId) : null

const form = ref(
  existing
    ? { ...existing, driverId: existing.driverId ?? '' }
    : { ownerId: session.user?.id ?? DEMO_OWNER_ID, driverId: '', plate: '', vehicleType: VehicleTypes[0], currentMileage: 0, status: VehicleStatus.AVAILABLE }
)

const title = computed(() => (editingId ? t('fleet.form.titleEdit') : t('fleet.form.titleNew')))
const driverOptions = computed(() => [{ id: '', name: t('header.unassigned') }, ...fleet.drivers])
const typeOptions = computed(() => VehicleTypes.map((value) => ({ value, label: vehicleTypeLabel(value) })))
const statusOptions = computed(() => Object.values(VehicleStatus).map((value) => ({ value, label: statusLabel(value) })))

async function save() {
  const payload = { ...form.value, driverId: form.value.driverId || null, currentMileage: Number(form.value.currentMileage) }
  saving.value = true
  const { ok } = await run(
    () => (editingId ? fleet.updateVehicleInfo(editingId, payload) : fleet.registerVehicle(payload)),
    { errorSummary: t('fleet.form.saveError'), successMessage: editingId ? t('fleet.form.savedEdit') : t('fleet.form.savedNew') }
  )
  saving.value = false
  if (ok) router.push('/fleet-management')
}
</script>

<template>
  <PageHeader context-label="Vehicle & Fleet Management" :title="title" :subtitle="t('fleet.form.subtitle')">
    <template #actions>
      <AppButton variant="ghost" @click="router.push('/fleet-management')">{{ t('fleet.form.back') }}</AppButton>
    </template>
  </PageHeader>

  <FormCard>
    <form class="flex flex-column gap-3" @submit.prevent="save">
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fleet.form.plate') }}</label>
        <InputText v-model="form.plate" required fluid />
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fleet.form.type') }}</label>
        <Select v-model="form.vehicleType" :options="typeOptions" option-label="label" option-value="value" fluid />
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fleet.form.mileage') }}</label>
        <InputNumber v-model="form.currentMileage" :min="0" fluid />
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fleet.form.driver') }}</label>
        <Select v-model="form.driverId" :options="driverOptions" option-label="name" option-value="id" fluid />
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fleet.form.status') }}</label>
        <Select v-model="form.status" :options="statusOptions" option-label="label" option-value="value" fluid />
      </div>
      <div class="flex justify-content-end gap-2 pt-3" style="border-top: 1px solid var(--p-surface-100)">
        <AppButton variant="ghost" type="button" @click="router.push('/fleet-management')">{{ t('common.cancel') }}</AppButton>
        <AppButton type="submit" :disabled="saving">{{ t('common.save') }}</AppButton>
      </div>
    </form>
  </FormCard>
</template>
