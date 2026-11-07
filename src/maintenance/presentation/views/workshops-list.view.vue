<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { DEMO_MECHANIC_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const session = useSessionStore()
const mechanics = session.mechanics

// Demo details of the affiliated workshops; specialties are i18n keys so they follow the language.
const enrichment = {
  [DEMO_MECHANIC_ID]: { city: 'Medellín', address: 'Cra. 50 #32-15, Industriales', phone: '+57 4 444 8820', rating: 4.8, tags: ['brakes', 'engine', 'transmission', 'electrical'] }
}
const defaults = { city: 'Lima', address: null, phone: '—', rating: 4.5, tags: ['general'] }
const workshops = mechanics.map((m) => ({ ...m, ...(enrichment[m.id] ?? defaults) }))
const tagLabel = (tag) => (tag === 'general' ? t('workshops.generalMaintenance') : t(`workshops.tags.${tag}`))
const searchable = (w) => `${w.workshopName} ${w.city} ${w.tags.map(tagLabel).join(' ')}`.toLowerCase()

const search = ref('')
const filtered = computed(() => workshops.filter((w) => searchable(w).includes(search.value.toLowerCase())))
</script>

<template>
  <PageHeader context-label="Maintenance Management" :title="t('workshops.title')" :subtitle="t('workshops.subtitle', { count: workshops.length })" />

  <div class="mb-3" style="max-width: 24rem">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" :placeholder="t('workshops.search')" fluid />
    </IconField>
  </div>

  <EmptyState v-if="!filtered.length" icon="building" :message="t('workshops.empty')" />

  <div v-else class="grid">
    <div v-for="w in filtered" :key="w.id" class="col-12 sm:col-6">
      <div class="rounded-2xl border-subtle shadow-card p-3 h-full" style="background: var(--p-surface-0)">
        <div class="flex align-items-start justify-content-between">
          <div>
            <p class="font-bold text-heading m-0">{{ w.workshopName }}</p>
            <p class="flex align-items-center gap-1 text-xs text-faint mt-1 mb-0"><AppIcon name="pin" :size="12" /> {{ w.city }}</p>
          </div>
          <span class="flex align-items-center gap-1 text-sm font-semibold" style="color: #d97706">
            <AppIcon name="star" :size="14" /> {{ w.rating }}
          </span>
        </div>

        <div class="flex flex-column gap-2 mt-3 text-xs text-muted">
          <p class="flex align-items-center gap-2 m-0"><AppIcon name="pin" :size="13" /> {{ w.address ?? t('workshops.noAddress') }}</p>
          <p class="flex align-items-center gap-2 m-0"><AppIcon name="phone" :size="13" /> {{ w.phone }}</p>
          <p class="flex align-items-center gap-2 m-0"><AppIcon name="mail" :size="13" /> {{ w.email }}</p>
        </div>

        <div class="my-3" style="border-top: 1px solid var(--p-surface-100)" />

        <div class="flex flex-wrap gap-2">
          <span v-for="tag in w.tags" :key="tag" class="border-round-full px-2 py-1 text-xs font-medium" style="background: var(--p-primary-50); color: var(--p-primary-700)">{{ tagLabel(tag) }}</span>
        </div>

        <div class="flex gap-2 mt-3">
          <AppButton variant="ghost" class="flex-1 justify-content-center">{{ t('workshops.details') }}</AppButton>
          <AppButton class="flex-1 justify-content-center" @click="router.push(`/workshops/${w.id}/request`)">{{ t('workshops.requestService') }}</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
