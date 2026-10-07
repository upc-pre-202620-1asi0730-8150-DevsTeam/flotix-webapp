<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useTrackingStore } from '../stores/tracking.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'

const tracking = useTrackingStore()
const fleet = useFleetStore()
let timer = null

function plate(vehicleId) {
  return fleet.byId(vehicleId)?.plate ?? '—'
}

function positionFor(packet) {
  if (!packet) return { top: '50%', left: '50%' }
  const top = 50 - (packet.latitude - -12.046) * 900
  const left = 50 + (packet.longitude - -77.043) * 900
  return { top: `${Math.min(92, Math.max(8, top))}%`, left: `${Math.min(92, Math.max(8, left))}%` }
}

function tick() {
  for (const d of tracking.devices) tracking.receiveTelemetry(d)
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 3000)
})
onUnmounted(() => clearInterval(timer))

const connected = computed(() => tracking.devices.filter((d) => d.connectionStatus === 'Conectado').length)
const avgSpeed = computed(() => {
  const speeds = Object.values(tracking.latestByDevice).map((t) => t.speed)
  return speeds.length ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length) : 0
})
</script>

<template>
  <PageHeader
    context-label="Real-Time Monitoring / Fleet Tracking"
    title="Monitoreo en tiempo real"
    subtitle="Telemetría GPS simulada cada 3 segundos por dispositivo IoT conectado."
  />

  <div class="grid mb-3">
    <div class="col-6 sm:col-4"><StatCard label="Dispositivos conectados" :value="connected" icon="signal" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Velocidad promedio" :value="`${avgSpeed} km/h`" icon="truck" /></div>
    <div class="col-6 sm:col-4"><StatCard label="Paquetes recibidos" :value="Object.keys(tracking.latestByDevice).length" icon="signal" /></div>
  </div>

  <EmptyState v-if="!tracking.devices.length" icon="signal" message="No hay dispositivos IoT conectados a la flota." />

  <div v-else class="grid">
    <div class="col-12 lg:col-8">
      <div class="relative border-round-2xl overflow-hidden bg-navy-gradient" style="aspect-ratio: 1 / 1">
        <div class="absolute" style="inset: 0; opacity: .2; background-image: radial-gradient(circle, #0879e8 1px, transparent 1px); background-size: 24px 24px" />
        <p class="absolute text-xs font-medium m-0" style="top: .75rem; left: .75rem; color: rgba(255,255,255,.5)">Radar de flota (simulado) · Lima, Perú</p>
        <div
          v-for="d in tracking.devices"
          :key="d.id"
          class="absolute"
          :style="{ ...positionFor(tracking.latestByDevice[d.id]), transform: 'translate(-50%, -50%)', transition: 'all 1s linear' }"
        >
          <div class="flex flex-column align-items-center">
            <span class="border-round-full" style="width: .75rem; height: .75rem; background: var(--p-primary-400); box-shadow: 0 0 0 6px rgba(8,121,232,.25)" />
            <span class="border-round mt-1 px-2 py-1 text-xs font-medium" style="background: rgba(0,0,0,.5); color: #fff; font-size: 10px">{{ plate(d.vehicleId) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4">
      <div class="flex flex-column gap-3">
        <div v-for="d in tracking.devices" :key="d.id" class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
          <div class="flex align-items-center justify-content-between">
            <p class="text-sm font-semibold text-heading m-0">{{ plate(d.vehicleId) }}</p>
            <span class="inline-flex align-items-center gap-2 text-xs font-medium" style="color: var(--p-primary-color)">
              <span class="border-round-full" style="width: .4rem; height: .4rem; background: var(--p-primary-color)" /> {{ d.connectionStatus }}
            </span>
          </div>
          <p class="text-xs text-faint mt-1 mb-0">S/N {{ d.serialNumber }}</p>
          <div v-if="tracking.latestByDevice[d.id]" class="grid mt-2 text-xs text-color-secondary">
            <p class="col-6 m-0">Velocidad: <span class="font-semibold" :style="{ color: tracking.latestByDevice[d.id].speed > 90 ? '#dc2626' : 'var(--p-surface-900)' }">{{ tracking.latestByDevice[d.id].speed }} km/h</span></p>
            <p class="col-6 m-0">Lat/Lng: {{ tracking.latestByDevice[d.id].latitude }}, {{ tracking.latestByDevice[d.id].longitude }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
