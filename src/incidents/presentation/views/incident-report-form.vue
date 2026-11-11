<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useIncidentsStore } from '../stores/incidents.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { DEMO_DRIVER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
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
const incidents = useIncidentsStore()
const fleet = useFleetStore()
const session = useSessionStore()
const { run } = useApiFeedback()

const form = ref({ vehicleId: fleet.vehicles[0]?.id ?? '', driverId: session.user?.id ?? DEMO_DRIVER_ID, description: '' })

async function save() {
  const { ok } = await run(() => incidents.reportVehicleIncident({ ...form.value }), {
    errorSummary: t('incidents.form.saveError'),
    successMessage: t('incidents.form.saved')
  })
  if (ok) router.push('/incidents')
}
</script>

<template>
  <PageHeader context-label="Incident Management" :title="t('incidents.form.title')" :subtitle="t('incidents.form.subtitle')">
    <template #actions>
      <AppButton variant="ghost" icon="pi pi-arrow-left" @click="router.push('/incidents')">{{ t('incidents.form.back') }}</AppButton>
    </template>
  </PageHeader>

  <FormCard>
    <form class="flex flex-column gap-3" @submit.prevent="save">
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('incidents.form.vehicle') }}</label>
        <Select v-model="form.vehicleId" :options="fleet.vehicles" option-label="plate" option-value="id" fluid>
          <template #option="{ option }"><span class="flotix-plate mr-2">{{ option.plate }}</span>{{ vehicleTypeLabel(option.vehicleType) }}</template>
        </Select>
      </div>
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('incidents.form.description') }}</label>
        <Textarea v-model="form.description" required rows="4" fluid />
      </div>
      <div class="flex justify-content-end gap-2 pt-3" style="border-top: 1px solid var(--p-surface-100)">
        <AppButton variant="ghost" type="button" @click="router.push('/incidents')">{{ t('common.cancel') }}</AppButton>
        <AppButton type="submit">{{ t('incidents.form.submit') }}</AppButton>
      </div>
    </form>
  </FormCard>
</template>
