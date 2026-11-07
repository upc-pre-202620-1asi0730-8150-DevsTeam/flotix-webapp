<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMaintenanceStore } from '../stores/maintenance.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import FormCard from '@/shared/presentation/components/form-card.component.vue'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { vehicleTypeLabel, alertTypeLabel, notificationMessage, productLabel } from '@/shared/infrastructure/domain-text.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const maintenance = useMaintenanceStore()
const fleet = useFleetStore()
const session = useSessionStore()
const { run } = useApiFeedback()

const workshop = session.getUserById(route.params.id)
if (!workshop) router.replace('/workshops')

const form = ref({ vehicleId: fleet.vehicles[0]?.id ?? '', faultDescription: '' })

async function save() {
  const { ok } = await run(() => maintenance.submitMaintenanceRequest({ ...form.value, mechanicId: workshop.id }), {
    errorSummary: t('workshops.request.saveError'),
    successMessage: t('workshops.request.saved')
  })
  if (ok) router.push('/maintenance')
}
</script>

<template>
  <template v-if="workshop">
    <PageHeader context-label="Maintenance Management" :title="t('workshops.request.title')" :subtitle="t('workshops.request.subtitle', { name: workshop.workshopName })">
      <template #actions>
        <AppButton variant="ghost" @click="router.push('/workshops')">{{ t('workshops.request.back') }}</AppButton>
      </template>
    </PageHeader>

    <FormCard>
      <form class="flex flex-column gap-3" @submit.prevent="save">
        <div class="flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('workshops.request.vehicle') }}</label>
          <Select v-model="form.vehicleId" :options="fleet.vehicles" option-label="plate" option-value="id" fluid>
            <template #option="{ option }">{{ option.plate }} — {{ vehicleTypeLabel(option.vehicleType) }}</template>
          </Select>
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('workshops.request.problem') }}</label>
          <Textarea v-model="form.faultDescription" required rows="4" fluid />
        </div>
        <div class="flex justify-content-end gap-2 pt-3" style="border-top: 1px solid var(--p-surface-100)">
          <AppButton variant="ghost" type="button" @click="router.push('/workshops')">{{ t('common.cancel') }}</AppButton>
          <AppButton type="submit">{{ t('workshops.request.submit') }}</AppButton>
        </div>
      </form>
    </FormCard>
  </template>
</template>
