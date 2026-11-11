<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { UserRole } from '@/identity-access/domain/model/value-objects/user-role.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useCommerceStore } from '@/iot-commerce/presentation/stores/commerce.store.js'
import { usePreferencesStore } from '../stores/preferences.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import ToggleSwitch from '@/shared/presentation/components/toggle-switch.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Avatar from 'primevue/avatar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useI18n } from 'vue-i18n'
import { statusLabel } from '@/shared/infrastructure/domain-text.js'

const { t } = useI18n()
const router = useRouter()
const session = useSessionStore()
const fleet = useFleetStore()
const commerce = useCommerceStore()
const preferences = usePreferencesStore()

const user = session.user
const isOwner = user?.role === UserRole.OWNER

const tabs = computed(() => (isOwner ? ['account', 'fleet', 'notifications', 'billing'] : ['account', 'notifications']).map((id) => ({ id, label: t(`settings.tabs.${id}`) })))
const activeTab = ref('account')

// --- Account ---
const accountForm = ref({ name: user?.name ?? '', email: user?.email ?? '', companyName: user?.companyName ?? '', workshopName: user?.workshopName ?? '' })
const accountSaved = ref(false)
function saveAccount() {
  session.updateProfile({ ...accountForm.value })
  accountSaved.value = true
  setTimeout(() => (accountSaved.value = false), 3000)
}

// --- Fleet (Owner only) ---
const fleetForm = ref({ ...preferences.fleet })
const fleetSaved = ref(false)
function saveFleetPrefs() {
  preferences.saveFleet({
    speedLimitKmh: Number(fleetForm.value.speedLimitKmh),
    maintenanceIntervalKm: Number(fleetForm.value.maintenanceIntervalKm),
    fuelAnomalyDropPct: Number(fleetForm.value.fuelAnomalyDropPct)
  })
  fleetSaved.value = true
  setTimeout(() => (fleetSaved.value = false), 3000)
}

// --- Notifications ---
const notifForm = ref(preferences.notificationsFor(user?.id))
const notifSaved = ref(false)
function saveNotifPrefs() {
  preferences.saveNotificationsFor(user.id, { ...notifForm.value })
  notifSaved.value = true
  setTimeout(() => (notifSaved.value = false), 3000)
}

// --- Billing (Owner only) ---
const totalSpent = computed(() => commerce.orders.reduce((a, o) => a + o.totalAmount, 0))
</script>

<template>
  <PageHeader context-label="Platform" :title="t('settings.title')" :subtitle="t('settings.subtitle')" />

  <div class="flex gap-5 mb-4" style="border-bottom: 1px solid var(--p-surface-200)">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="flotix-tab-btn"
      :class="activeTab === tab.id ? 'flotix-tab-btn-active' : ''"
      @click="activeTab = tab.id"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- Account -->
  <div v-if="activeTab === 'account'" class="grid">
    <div class="col-12 lg:col-8">
      <div class="flex flex-column gap-3">
        <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
          <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('settings.account.personal') }}</h2>
          <div class="grid">
            <div class="col-12 sm:col-6 flex flex-column gap-1">
              <label class="text-sm font-medium text-heading">{{ t('settings.account.name') }}</label>
              <InputText v-model="accountForm.name" fluid />
            </div>
            <div class="col-12 sm:col-6 flex flex-column gap-1">
              <label class="text-sm font-medium text-heading">{{ t('settings.account.email') }}</label>
              <InputText v-model="accountForm.email" fluid />
            </div>
          </div>
        </div>

        <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
          <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('settings.account.company') }}</h2>
          <div class="grid">
            <div class="col-12 sm:col-6 flex flex-column gap-1">
              <label class="text-sm font-medium text-heading">{{ t('settings.account.companyName') }}</label>
              <InputText v-model="accountForm.companyName" fluid />
            </div>
            <div class="col-12 sm:col-6 flex flex-column gap-1">
              <label class="text-sm font-medium text-heading">{{ t('settings.account.workshopName') }}</label>
              <InputText v-model="accountForm.workshopName" fluid />
            </div>
          </div>
        </div>

        <div class="flex align-items-center justify-content-end gap-3">
          <p v-if="accountSaved" class="flotix-saved text-sm font-medium m-0" role="status"><i class="pi pi-check" aria-hidden="true" />{{ t('settings.saved') }}</p>
          <AppButton @click="saveAccount">{{ t('settings.saveChanges') }}</AppButton>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="flex flex-column gap-3">
        <div class="rounded-2xl border-subtle shadow-card p-3 text-center" style="background: var(--p-surface-0)">
          <Avatar :label="user?.name?.charAt(0)" shape="circle" size="xlarge" style="background: var(--p-primary-100); color: var(--p-primary-700); font-weight: 700" />
          <p class="font-bold text-heading mt-3 mb-0">{{ user?.name }}</p>
          <p class="text-xs text-faint m-0">{{ user?.email }}</p>
          <span class="inline-block border-round-full px-2 py-1 text-xs font-semibold mt-2" style="background: var(--p-primary-50); color: var(--p-primary-700)">{{ t(`roles.${user?.role}`) }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Fleet -->
  <div v-else-if="activeTab === 'fleet'" class="grid">
    <div class="col-12 lg:col-8">
      <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
        <h2 class="text-sm font-bold text-heading m-0">{{ t('settings.fleet.thresholds') }}</h2>
        <p class="text-xs text-faint mt-1 mb-3">{{ t('settings.fleet.thresholdsHint') }}</p>
        <div class="grid">
          <div class="col-12 sm:col-4 flex flex-column gap-1">
            <label class="text-sm font-medium text-heading">{{ t('settings.fleet.speedLimit') }}</label>
            <InputNumber v-model="fleetForm.speedLimitKmh" :min="1" fluid />
          </div>
          <div class="col-12 sm:col-4 flex flex-column gap-1">
            <label class="text-sm font-medium text-heading">{{ t('settings.fleet.serviceInterval') }}</label>
            <InputNumber v-model="fleetForm.maintenanceIntervalKm" :min="500" :step="500" fluid />
          </div>
          <div class="col-12 sm:col-4 flex flex-column gap-1">
            <label class="text-sm font-medium text-heading">{{ t('settings.fleet.anomaly') }}</label>
            <InputNumber v-model="fleetForm.fuelAnomalyDropPct" :min="5" :max="90" fluid />
          </div>
        </div>
        <p class="text-xs text-faint mt-3 mb-0" v-html="t('settings.fleet.explanation', { pct: fleetForm.fuelAnomalyDropPct })"></p>
        <div class="flex align-items-center justify-content-end gap-3 pt-3 mt-3" style="border-top: 1px solid var(--p-surface-100)">
          <p v-if="fleetSaved" class="flotix-saved text-sm font-medium m-0" role="status"><i class="pi pi-check" aria-hidden="true" />{{ t('settings.prefsSaved') }}</p>
          <AppButton @click="saveFleetPrefs">{{ t('settings.saveChanges') }}</AppButton>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="flex flex-column gap-3">
        <StatCard :label="t('settings.fleet.vehicles')" :value="fleet.vehicles.length" icon="truck" />
        <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('settings.fleet.adjustTitle') }}</h2>
          <p class="text-xs text-faint mt-1 mb-3">{{ t('settings.fleet.adjustHint') }}</p>
          <AppButton variant="ghost" class="w-full justify-content-center" @click="router.push('/fleet-management')">{{ t('settings.fleet.goVehicles') }}</AppButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Notifications -->
  <div v-else-if="activeTab === 'notifications'" style="max-width: 40rem">
    <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
      <h2 class="text-sm font-bold text-heading m-0">{{ t('settings.notif.types') }}</h2>
      <p class="text-xs text-faint mt-1 mb-3">{{ t('settings.notif.hint') }}</p>

      <div class="flex flex-column">
        <div class="flex align-items-center justify-content-between py-3" style="border-bottom: 1px solid var(--p-surface-100)">
          <div>
            <p class="text-sm font-semibold text-heading m-0">{{ t('settings.notif.maintenance') }}</p>
            <p class="text-xs text-faint m-0">{{ t('settings.notif.maintenanceHint') }}</p>
          </div>
          <ToggleSwitch v-model="notifForm.maintenance" />
        </div>
        <div class="flex align-items-center justify-content-between py-3" style="border-bottom: 1px solid var(--p-surface-100)">
          <div>
            <p class="text-sm font-semibold text-heading m-0">{{ t('settings.notif.speed') }}</p>
            <p class="text-xs text-faint m-0">{{ t('settings.notif.speedHint') }}</p>
          </div>
          <ToggleSwitch v-model="notifForm.speed" />
        </div>
        <div class="flex align-items-center justify-content-between py-3">
          <div>
            <p class="text-sm font-semibold text-heading m-0">{{ t('settings.notif.incidents') }}</p>
            <p class="text-xs text-faint m-0">{{ t('settings.notif.incidentsHint') }}</p>
          </div>
          <ToggleSwitch v-model="notifForm.incidents" />
        </div>
      </div>

      <div class="flex align-items-center justify-content-end gap-3 pt-3 mt-3" style="border-top: 1px solid var(--p-surface-100)">
        <p v-if="notifSaved" class="flotix-saved text-sm font-medium m-0" role="status"><i class="pi pi-check" aria-hidden="true" />{{ t('settings.prefsSaved') }}</p>
        <AppButton @click="saveNotifPrefs">{{ t('settings.saveChanges') }}</AppButton>
      </div>
    </div>
  </div>

  <!-- Billing -->
  <div v-else-if="activeTab === 'billing'">
    <div class="flotix-stats mb-3">
      <StatCard :label="t('settings.billing.spent')" :value="`S/ ${totalSpent.toFixed(2)}`" icon="cash" />
      <StatCard :label="t('settings.billing.orders')" :value="commerce.orders.length" icon="cart" />
      <StatCard :label="t('settings.billing.plan')" value="Growth" icon="shield" tone="primary" />
    </div>

    <div class="grid">
      <div class="col-12 lg:col-8">
        <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
          <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('settings.billing.history') }}</h2>
          <EmptyState v-if="!commerce.orders.length" icon="cart" :message="t('settings.billing.emptyHistory')" />
          <DataTable v-else :value="commerce.orders" data-key="id" striped-rows>
            <Column field="orderDate" :header="t('settings.billing.cols.date')" />
            <Column :header="t('settings.billing.cols.concept')">
              <template #body="{ data }">{{ t('settings.billing.concept', { qty: data.deviceQuantity, sku: data.sku }) }}</template>
            </Column>
            <Column :header="t('settings.billing.cols.amount')">
              <template #body="{ data }">S/ {{ data.totalAmount.toFixed(2) }}</template>
            </Column>
            <Column :header="t('settings.billing.cols.status')">
              <template #body="{ data }"><StatusBadge :status="data.status" /></template>
            </Column>
          </DataTable>
        </div>
      </div>

      <div class="col-12 lg:col-4">
        <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
          <h2 class="text-sm font-bold text-heading m-0 mb-3">{{ t('settings.billing.paymentMethod') }}</h2>
          <div class="flex align-items-center gap-3 border-round-xl p-3" style="background: var(--p-surface-50)">
            <span class="flex align-items-center justify-content-center border-round" style="width: 3rem; height: 2.25rem; background: var(--flotix-navy-900); color: #fff; font-size: 10px; font-weight: 700">VISA</span>
            <div>
              <p class="text-sm font-semibold text-heading m-0">{{ t('settings.billing.endingIn') }}</p>
              <p class="text-xs text-faint m-0">{{ t('settings.billing.expires') }}</p>
            </div>
          </div>
          <AppButton variant="ghost" class="w-full justify-content-center mt-3" @click="router.push('/commerce')">{{ t('settings.billing.goStore') }}</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flotix-tab-btn {
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 0 0 .75rem 0; margin-bottom: -1px; font-size: .875rem; font-weight: 500;
  color: var(--p-surface-500); cursor: pointer;
  font-family: inherit; transition: color .15s ease, border-color .15s ease;
}
@media (hover: hover) { .flotix-tab-btn:hover { color: var(--p-surface-900); } }
.flotix-tab-btn-active { border-bottom-color: var(--p-primary-color); color: var(--p-primary-color); }
</style>
