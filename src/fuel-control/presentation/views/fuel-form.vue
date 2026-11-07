<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFuelStore } from '../stores/fuel.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { DEMO_DRIVER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import FormCard from '@/shared/presentation/components/form-card.component.vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import { useI18n } from 'vue-i18n'
import { localeTag } from '@/internationalization/i18n.js'
import { vehicleTypeLabel } from '@/shared/infrastructure/domain-text.js'

const { t } = useI18n()
const router = useRouter()
const fuel = useFuelStore()
const fleet = useFleetStore()
const session = useSessionStore()
const { run } = useApiFeedback()

const form = ref({
  vehicleId: fleet.vehicles[0]?.id ?? '',
  driverId: session.user?.id ?? DEMO_DRIVER_ID,
  liters: null,
  totalCost: null,
  mileageAtRefuel: null,
  date: new Date().toISOString().slice(0, 10)
})

const numberLocale = computed(() => localeTag())

async function save() {
  const { ok } = await run(() => fuel.registerFuelConsumption({ ...form.value }), {
    errorSummary: t('fuel.form.saveError'),
    successMessage: t('fuel.form.saved')
  })
  if (ok) router.push('/fuel')
}
</script>

<template>
  <PageHeader context-label="Fuel Control" :title="t('fuel.form.title')" :subtitle="t('fuel.form.subtitle')">
    <template #actions>
      <AppButton variant="ghost" @click="router.push('/fuel')">{{ t('fuel.form.back') }}</AppButton>
    </template>
  </PageHeader>

  <FormCard>
    <form class="flex flex-column gap-3" @submit.prevent="save">
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fuel.form.vehicle') }}</label>
        <Select v-model="form.vehicleId" :options="fleet.vehicles" option-label="plate" option-value="id" fluid>
          <template #option="{ option }">{{ option.plate }} — {{ vehicleTypeLabel(option.vehicleType) }}</template>
        </Select>
      </div>
      <div class="grid">
        <div class="col-6 flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('fuel.form.liters') }}</label>
          <InputNumber v-model="form.liters" :min-fraction-digits="1" required fluid />
        </div>
        <div class="col-6 flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('fuel.form.cost') }}</label>
          <InputNumber v-model="form.totalCost" mode="currency" currency="PEN" :locale="numberLocale" required fluid />
        </div>
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fuel.form.odometer') }}</label>
        <InputNumber v-model="form.mileageAtRefuel" :min="0" required fluid />
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('fuel.form.date') }}</label>
        <DatePicker v-model="form.date" date-format="yy-mm-dd" show-icon fluid required />
      </div>
      <div class="flex justify-content-end gap-2 pt-3" style="border-top: 1px solid var(--p-surface-100)">
        <AppButton variant="ghost" type="button" @click="router.push('/fuel')">{{ t('common.cancel') }}</AppButton>
        <AppButton type="submit">{{ t('common.save') }}</AppButton>
      </div>
    </form>
  </FormCard>
</template>
