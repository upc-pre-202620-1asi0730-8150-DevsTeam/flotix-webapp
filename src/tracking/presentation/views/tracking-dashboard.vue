<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTrackingStore } from '../stores/tracking.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { usePreferencesStore } from '@/platform/presentation/stores/preferences.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { statusLabel, vehicleTypeLabel } from '@/shared/infrastructure/domain-text.js'
import { localeTag } from '@/internationalization/i18n.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import FleetMap from '../components/fleet-map.component.vue'
import LinkIotDeviceDialog from '../components/link-iot-device-dialog.component.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const { t } = useI18n()
const router = useRouter()
const tracking = useTrackingStore()
const fleet = useFleetStore()
const preferences = usePreferencesStore()
const { run } = useApiFeedback()

const fleetMap = ref(null)
const searchQuery = ref('')
const togglingId = ref(null)
const linkOpen = ref(false)

const speedLimit = computed(() => Number(preferences.fleet?.speedLimitKmh) || 90)
const vehicleFor = (vehicleId) => fleet.byId(vehicleId)
const plate = (vehicleId) => vehicleFor(vehicleId)?.plate ?? '—'
const formatTime = (iso) => (iso ? new Date(iso).toLocaleTimeString(localeTag(), { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—')

const hasUnequippedVehicles = computed(() => {
  const equipped = new Set(tracking.devices.map((d) => d.vehicleId))
  return fleet.vehicles.some((v) => !equipped.has(v.id))
})

const filteredDevices = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const sorted = tracking.devices.slice().sort((a, b) => {
    const rank = (d) => (d.connectionStatus === 'Conectado' ? 0 : 1)
    return rank(a) - rank(b) || plate(a.vehicleId).localeCompare(plate(b.vehicleId))
  })
  return q ? sorted.filter((d) => plate(d.vehicleId).toLowerCase().includes(q) || String(d.serialNumber ?? '').toLowerCase().includes(q)) : sorted
})

const connected = computed(() => tracking.devices.filter((d) => d.connectionStatus === 'Conectado').length)
const avgSpeed = computed(() => {
  const activeIds = new Set(tracking.devices.filter((d) => d.connectionStatus === 'Conectado').map((d) => d.id))
  const speeds = Object.values(tracking.latestByDevice).filter((p) => activeIds.has(p.deviceId)).map((p) => Number(p.speed)).filter(Number.isFinite)
  return speeds.length ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length) : 0
})

function selectDevice(deviceId, pan = true) {
  tracking.selectDevice(deviceId)
  if (pan) fleetMap.value?.flyToDevice(deviceId)
}

async function toggleConnection(device) {
  togglingId.value = device.id
  await run(() => tracking.setDeviceConnection(device, device.connectionStatus !== 'Conectado'), { errorSummary: t('tracking.connectionError') })
  togglingId.value = null
}

async function onDeviceLinked({ device }) {
  if (!device) return
  await tracking.receiveTelemetry(device, vehicleFor(device.vehicleId)).catch(() => {})
  await nextTick()
  selectDevice(device.id, true)
}

onMounted(() => tracking.startMonitoring())
onUnmounted(() => tracking.stopMonitoring())
</script>

<template>
  <PageHeader context-label="Real-Time Monitoring / Fleet Tracking" :title="t('tracking.title')" :subtitle="t('tracking.subtitle')">
    <template #actions>
      <div class="flex align-items-center gap-2 flex-wrap">
        <span class="live-pill" :class="tracking.realtimeStatus === 'connected' ? 'is-live' : 'is-sync'">
          <span class="live-dot" />
          {{ tracking.realtimeStatus === 'connected' ? t('tracking.live') : t('tracking.syncing') }}
        </span>
        <AppButton v-if="hasUnequippedVehicles" icon="pi pi-plus" @click="linkOpen = true">
          {{ t('tracking.linkDevice') }}
        </AppButton>
      </div>
    </template>
  </PageHeader>

  <div class="flotix-stats mb-3">
    <StatCard :label="t('tracking.stats.connected')" :value="`${connected}/${tracking.devices.length}`" icon="signal" tone="primary" />
    <StatCard :label="t('tracking.stats.avgSpeed')" :value="`${avgSpeed} km/h`" icon="truck" />
    <StatCard :label="t('tracking.stats.packets')" :value="tracking.packetsCount" icon="signal" />
  </div>

  <EmptyState v-if="!tracking.devices.length" icon="signal" :message="t('tracking.empty')">
    <div class="flex justify-content-center gap-2 mt-3">
      <AppButton v-if="hasUnequippedVehicles" icon="pi pi-plus" @click="linkOpen = true">{{ t('tracking.linkDevice') }}</AppButton>
      <AppButton variant="ghost" @click="router.push('/commerce')">{{ t('tracking.goStore') }}</AppButton>
    </div>
  </EmptyState>

  <div v-else class="grid">
    <div class="col-12 lg:col-8">
      <FleetMap
        ref="fleetMap"
        :devices="tracking.devices"
        :latest-by-device="tracking.latestByDevice"
        :trails-by-device="tracking.trailsByDevice"
        :selected-device-id="tracking.selectedDeviceId"
        :speed-limit="speedLimit"
        :plate-for="plate"
        @select="(id) => selectDevice(id, false)"
      />
    </div>

    <div class="col-12 lg:col-4">
      <div class="rounded-2xl border-subtle p-3 flex flex-column gap-2" style="background: var(--p-surface-0)">
        <div class="flex align-items-center justify-content-between gap-2">
          <h2 class="text-sm font-bold text-heading m-0">{{ t('tracking.unitsTitle') }}</h2>
          <span class="text-xs text-muted">{{ filteredDevices.length }}</span>
        </div>
        <InputText v-model="searchQuery" :placeholder="t('tracking.searchPlaceholder')" size="small" fluid />

        <div class="units-list flex flex-column gap-2 mt-1">
          <div
            v-for="d in filteredDevices"
            :key="d.id"
            class="unit-card rounded-xl border-subtle p-3 cursor-pointer"
            :class="{ 'is-selected': tracking.selectedDeviceId === d.id }"
            @click="selectDevice(d.id, true)"
          >
            <div class="flex align-items-center justify-content-between gap-2">
              <div class="flex align-items-center gap-2 min-w-0">
                <span class="flotix-plate">{{ plate(d.vehicleId) }}</span>
                <span v-if="vehicleFor(d.vehicleId)" class="text-xs text-muted white-space-nowrap overflow-hidden text-overflow-ellipsis">
                  {{ vehicleTypeLabel(vehicleFor(d.vehicleId).vehicleType) }}
                </span>
              </div>
              <span class="inline-flex align-items-center gap-1 text-xs font-semibold flex-shrink-0" :style="{ color: d.connectionStatus === 'Conectado' ? '#17663a' : 'var(--p-surface-500)' }">
                <span class="border-round-full" style="width: .45rem; height: .45rem" :style="{ background: d.connectionStatus === 'Conectado' ? '#16a34a' : '#94a3b8' }" />
                {{ statusLabel(d.connectionStatus) }}
              </span>
            </div>

            <p class="text-xs text-faint mt-1 mb-0">{{ t('tracking.serial', { serial: d.serialNumber }) }} · {{ tracking.routeNameFor(d.id) }}</p>

            <div v-if="tracking.latestByDevice[d.id]" class="flex align-items-center justify-content-between gap-2 mt-2 text-xs text-color-secondary">
              <p class="m-0 white-space-nowrap">
                {{ t('tracking.speed') }}:
                <span class="font-semibold" :style="{ color: d.connectionStatus === 'Conectado' && tracking.latestByDevice[d.id].speed > speedLimit ? '#dc2626' : 'var(--p-surface-900)' }">
                  {{ Math.round(tracking.latestByDevice[d.id].speed) }} km/h
                </span>
              </p>
              <p class="m-0 text-right white-space-nowrap" style="font-variant-numeric: tabular-nums">
                {{ Number(tracking.latestByDevice[d.id].latitude).toFixed(4) }}, {{ Number(tracking.latestByDevice[d.id].longitude).toFixed(4) }}
              </p>
            </div>

            <div class="flex align-items-center justify-content-between mt-2 pt-2" style="border-top: 1px solid var(--p-surface-100)">
              <span class="text-xs text-muted">
                {{ tracking.latestByDevice[d.id] ? t('tracking.updatedAt', { time: formatTime(tracking.latestByDevice[d.id].timestamp) }) : t('tracking.awaitingSignal') }}
              </span>
              <Button
                :label="d.connectionStatus === 'Conectado' ? t('tracking.disconnect') : t('tracking.connect')"
                text
                size="small"
                :severity="d.connectionStatus === 'Conectado' ? 'secondary' : 'primary'"
                :loading="togglingId === d.id"
                style="padding: .15rem .45rem; font-size: .75rem"
                @click.stop="toggleConnection(d)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LinkIotDeviceDialog v-model:visible="linkOpen" @linked="onDeviceLinked" />
</template>

<style scoped>
.live-pill { display: inline-flex; align-items: center; gap: .45rem; padding: .3rem .7rem; border-radius: 999px; font-size: .78rem; font-weight: 600; }
.live-pill.is-live { background: #dcf5e7; color: #17663a; }
.live-pill.is-sync { background: #e0efff; color: #0a56a3; }
.live-dot { width: .5rem; height: .5rem; border-radius: 999px; background: currentColor; animation: livePulse 1.8s ease-in-out infinite; }
.units-list { max-height: 455px; overflow-y: auto; padding-right: .15rem; }
.unit-card { background: var(--p-surface-0); transition: border-color .15s ease, background-color .15s ease; }
.unit-card:hover { border-color: var(--p-primary-300, #93c5fd); }
.unit-card.is-selected { border-color: var(--p-primary-color); background: #f0f7ff; }
@keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.85); } }
</style>
