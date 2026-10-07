<script setup>
import { computed } from 'vue'
import { useAlertsStore } from '../stores/alerts.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import Button from 'primevue/button'

const alerts = useAlertsStore()
const fleet = useFleetStore()

function plate(id) {
  return fleet.byId(id)?.plate ?? '—'
}

const unread = computed(() => alerts.notifications.filter((n) => !n.isRead).length)
</script>

<template>
  <PageHeader
    context-label="Alerts & Notifications"
    title="Alertas y notificaciones"
    subtitle="Evaluación continua de umbrales operativos y mensajería interna hacia los usuarios."
  />

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Alertas activas" :value="alerts.alerts.length" icon="bell" tone="amber" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Notificaciones" :value="alerts.notifications.length" icon="mail" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Sin leer" :value="unread" icon="bell" tone="red" /></div>
  </div>

  <div class="grid">
    <div class="col-12 lg:col-6">
      <h2 class="text-sm font-semibold text-heading mb-2">Alertas generadas</h2>
      <EmptyState v-if="!alerts.alerts.length" icon="bell" message="No hay alertas activas." />
      <ul v-else class="list-none p-0 m-0 flex flex-column gap-2">
        <li v-for="a in alerts.alerts" :key="a.id" class="border-round-lg p-3 text-sm" style="border: 1px solid #fde68a; background: #fffbeb">
          <p class="font-semibold m-0" style="color: #92400e">{{ plate(a.vehicleId) }}</p>
          <p class="m-0" style="color: #b45309">{{ a.alertType }}</p>
          <p class="text-xs mt-1 mb-0" style="color: #d97706">{{ new Date(a.activatedAt).toLocaleString('es-PE') }}</p>
        </li>
      </ul>
    </div>

    <div class="col-12 lg:col-6">
      <h2 class="text-sm font-semibold text-heading mb-2">Notificaciones</h2>
      <EmptyState v-if="!alerts.notifications.length" icon="mail" message="No tienes notificaciones." />
      <ul v-else class="list-none p-0 m-0 flex flex-column gap-2">
        <li
          v-for="n in alerts.notifications"
          :key="n.id"
          class="flex align-items-start justify-content-between gap-2 border-round-lg p-3 text-sm"
          :style="n.isRead ? 'border: 1px solid var(--p-surface-100); background: var(--p-surface-0)' : 'border: 1px solid var(--p-primary-200); background: var(--p-primary-50)'"
        >
          <div>
            <p class="m-0" :style="{ color: n.isRead ? 'var(--p-surface-600)' : 'var(--p-surface-900)', fontWeight: n.isRead ? 400 : 600 }">{{ n.message }}</p>
            <p class="text-xs text-faint mt-1 mb-0">{{ new Date(n.sentAt).toLocaleString('es-PE') }}</p>
          </div>
          <Button v-if="!n.isRead" label="Marcar leída" text size="small" class="flex-shrink-0" @click="alerts.markNotificationAsRead(n.id)" />
        </li>
      </ul>
    </div>
  </div>
</template>
