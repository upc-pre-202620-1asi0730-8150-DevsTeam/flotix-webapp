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
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatNumber, localeTag } from '@/internationalization/i18n.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const maintenance = useMaintenanceStore()
const fleet = useFleetStore()
const session = useSessionStore()
const mechanics = session.mechanics
const { run } = useApiFeedback()

function mechanicLabel(id) {
  const m = mechanics.find((x) => x.id === id)
  return m ? `${m.name} (${m.workshopName})` : '—'
}

const request = maintenance.byId(route.params.id)
if (!request) router.replace('/maintenance')

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}

const form = ref({ estimatedCost: request?.estimatedCost || null })

async function save() {
  const { ok } = await run(() => maintenance.registerDiagnosticAndQuote(request.id, form.value), {
    errorSummary: t('maintenance.quote.saveError'),
    successMessage: t('maintenance.quote.saved')
  })
  if (ok) router.push('/maintenance')
}
</script>

<template>
  <template v-if="request">
    <PageHeader context-label="Maintenance Management"   :title="t('maintenance.quote.title')" :subtitle="`${plate(request.vehicleId)} — ${request.faultDescription}`">
      <template #actions>
        <AppButton variant="ghost" @click="router.push('/maintenance')">{{ t('maintenance.form.back') }}</AppButton>
      </template>
    </PageHeader>

    <FormCard>
      <form class="flex flex-column gap-3" @submit.prevent="save">
        <div class="flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('maintenance.quote.workshop') }}</label>
          <InputText :model-value="mechanicLabel(request.mechanicId)" disabled fluid />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('maintenance.quote.cost') }}</label>
          <InputNumber v-model="form.estimatedCost" mode="currency" currency="PEN" :locale="localeTag()" required fluid />
        </div>
        <div class="flex justify-content-end gap-2 pt-3" style="border-top: 1px solid var(--p-surface-100)">
          <AppButton variant="ghost" type="button" @click="router.push('/maintenance')">{{ t('common.cancel') }}</AppButton>
          <AppButton type="submit">{{ t('maintenance.quote.save') }}</AppButton>
        </div>
      </form>
    </FormCard>
  </template>
</template>
