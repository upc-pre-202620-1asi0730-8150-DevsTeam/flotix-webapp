<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LIMA_CENTER } from '../../infrastructure/simulation/telemetry-simulator.js'

const props = defineProps({
  devices: { type: Array, default: () => [] },
  latestByDevice: { type: Object, default: () => ({}) },
  trailsByDevice: { type: Object, default: () => ({}) },
  selectedDeviceId: { type: String, default: null },
  speedLimit: { type: Number, default: 90 },
  plateFor: { type: Function, required: true }
})

const emit = defineEmits(['select'])

const { t } = useI18n()
const container = ref(null)

let map = null
let fittedInitial = false
const markers = new Map()
const polylines = new Map()
const animFrames = new Map()
const renderedLatLng = new Map()
const lastAnimatedKey = new Map()

function buildMarkerIcon(device, packet, isSelected) {
  const isConnected = device.connectionStatus === 'Conectado'
  const speed = packet ? Math.round(Number(packet.speed)) : null
  const isSpeeding = isConnected && speed != null && speed > props.speedLimit
  const stateClass = !isConnected ? 'is-offline' : isSpeeding ? 'is-speeding' : 'is-online'
  const selectedClass = isSelected ? 'is-selected' : ''
  const speedText = speed != null ? `${speed} km/h` : '—'

  return L.divIcon({
    className: 'flotix-map-icon-wrapper',
    html: `<div class="flotix-map-pin ${stateClass} ${selectedClass}"><span class="pin-dot"></span><span class="pin-plate">${props.plateFor(device.vehicleId)}</span><span class="pin-speed">${speedText}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  })
}

function animateAlongPath(deviceId, marker, pathPoints) {
  if (animFrames.has(deviceId)) {
    cancelAnimationFrame(animFrames.get(deviceId))
    animFrames.delete(deviceId)
  }

  const pts = pathPoints.filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]))
  if (!pts.length) return

  const target = pts[pts.length - 1]
  const prev = renderedLatLng.get(deviceId)
  const fullPath = prev && Math.hypot(prev[0] - pts[0][0], prev[1] - pts[0][1]) <= 0.008 ? [prev, ...pts] : pts

  const segs = []
  let totalLen = 0
  for (let i = 0; i < fullPath.length - 1; i += 1) {
    const len = Math.hypot(fullPath[i + 1][0] - fullPath[i][0], fullPath[i + 1][1] - fullPath[i][1])
    if (len > 0.000005) {
      segs.push({ a: fullPath[i], b: fullPath[i + 1], start: totalLen, len })
      totalLen += len
    }
  }

  if (!segs.length || totalLen > 0.015) {
    marker.setLatLng(target)
    renderedLatLng.set(deviceId, target)
    return
  }

  const duration = 2600
  const startTime = performance.now()
  const step = (now) => {
    const progress = Math.min(1, (now - startTime) / duration)
    const dist = progress * totalLen
    const seg = segs.find((s) => dist <= s.start + s.len) ?? segs[segs.length - 1]
    const localT = Math.min(1, Math.max(0, (dist - seg.start) / seg.len))
    const lat = seg.a[0] + (seg.b[0] - seg.a[0]) * localT
    const lng = seg.a[1] + (seg.b[1] - seg.a[1]) * localT
    marker.setLatLng([lat, lng])
    renderedLatLng.set(deviceId, [lat, lng])
    if (progress < 1) animFrames.set(deviceId, requestAnimationFrame(step))
    else animFrames.delete(deviceId)
  }
  animFrames.set(deviceId, requestAnimationFrame(step))
}

function syncLayers() {
  if (!map) return
  const activeIds = new Set(props.devices.map((d) => d.id))

  for (const [id, marker] of markers.entries()) {
    if (activeIds.has(id)) continue
    if (animFrames.has(id)) {
      cancelAnimationFrame(animFrames.get(id))
      animFrames.delete(id)
    }
    marker.remove()
    markers.delete(id)
    renderedLatLng.delete(id)
    lastAnimatedKey.delete(id)
  }
  for (const [id, line] of polylines.entries()) {
    if (activeIds.has(id)) continue
    line.remove()
    polylines.delete(id)
  }

  const boundsPoints = []
  for (const device of props.devices) {
    const packet = props.latestByDevice[device.id]
    if (!packet) continue

    const lat = Number(packet.latitude)
    const lng = Number(packet.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

    boundsPoints.push([lat, lng])
    const isSelected = props.selectedDeviceId === device.id
    const isConnected = device.connectionStatus === 'Conectado'
    const isSpeeding = isConnected && Number(packet.speed) > props.speedLimit
    const packetKey = `${packet.timestamp}|${lat}|${lng}`

    let marker = markers.get(device.id)
    if (!marker) {
      marker = L.marker([lat, lng], {
        icon: buildMarkerIcon(device, packet, isSelected),
        zIndexOffset: isSelected ? 500 : isSpeeding ? 300 : 100
      }).addTo(map)
      marker.on('click', () => emit('select', device.id))
      markers.set(device.id, marker)
      renderedLatLng.set(device.id, [lat, lng])
      lastAnimatedKey.set(device.id, packetKey)
    } else {
      marker.setIcon(buildMarkerIcon(device, packet, isSelected))
      marker.setZIndexOffset(isSelected ? 500 : isSpeeding ? 300 : 100)
      if (lastAnimatedKey.get(device.id) !== packetKey) {
        lastAnimatedKey.set(device.id, packetKey)
        const pathPoints = Array.isArray(packet.pathSlice) && packet.pathSlice.length > 1 ? packet.pathSlice : [[lat, lng]]
        animateAlongPath(device.id, marker, pathPoints)
      }
    }

    const trail = (props.trailsByDevice[device.id] ?? []).map((pt) => [Number(pt.latitude), Number(pt.longitude)])
    if (trail.length > 1) {
      const style = {
        color: !isConnected ? '#94a3b8' : isSpeeding ? '#dc2626' : '#0879e8',
        weight: isSelected ? 4 : 2.5,
        opacity: isSelected ? 0.85 : 0.45,
        dashArray: isSelected ? null : '5 6'
      }
      let line = polylines.get(device.id)
      if (!line) polylines.set(device.id, L.polyline(trail, style).addTo(map))
      else {
        line.setLatLngs(trail)
        line.setStyle(style)
      }
    }
  }

  if (!fittedInitial && boundsPoints.length) {
    fittedInitial = true
    fitFleet(false)
  }
}

function fitFleet(animate = true) {
  if (!map) return
  const points = props.devices
    .map((d) => props.latestByDevice[d.id])
    .filter((p) => p && Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)))
    .map((p) => [Number(p.latitude), Number(p.longitude)])

  if (!points.length) map.setView([LIMA_CENTER.lat, LIMA_CENTER.lng], 12, { animate })
  else if (points.length === 1) map.setView(points[0], 14, { animate })
  else map.fitBounds(L.latLngBounds(points), { padding: [46, 46], maxZoom: 14, animate })
}

function flyToDevice(deviceId) {
  const packet = props.latestByDevice[deviceId]
  if (map && packet) {
    map.flyTo([Number(packet.latitude), Number(packet.longitude)], Math.max(map.getZoom(), 14), { duration: 0.75 })
  }
}

defineExpose({ fitFleet, flyToDevice })

watch(() => [props.devices, props.latestByDevice, props.trailsByDevice, props.selectedDeviceId], syncLayers, { deep: true })

onMounted(() => {
  map = L.map(container.value, { center: [LIMA_CENTER.lat, LIMA_CENTER.lng], zoom: 12, zoomControl: true })
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)
  syncLayers()
})

onUnmounted(() => {
  for (const frame of animFrames.values()) cancelAnimationFrame(frame)
  animFrames.clear()
  markers.clear()
  polylines.clear()
  renderedLatLng.clear()
  lastAnimatedKey.clear()
  if (map) map.remove()
  map = null
})
</script>

<template>
  <div class="flotix-map-wrap rounded-2xl border-subtle overflow-hidden">
    <div ref="container" class="flotix-map-canvas" />
    <div class="map-overlay-badge">
      <i class="pi pi-map-marker" aria-hidden="true" />
      <span>{{ t('tracking.mapLabel') }}</span>
    </div>
    <button type="button" class="map-fit-btn" @click="fitFleet(true)">
      <i class="pi pi-compass" aria-hidden="true" />
      <span>{{ t('tracking.fitFleet') }}</span>
    </button>
  </div>
</template>

<style scoped>
.flotix-map-wrap { position: relative; z-index: 1; isolation: isolate; min-height: 500px; height: 100%; background: #e2e8f0; }
.flotix-map-canvas { width: 100%; height: 100%; min-height: 500px; }
.map-overlay-badge { position: absolute; top: .75rem; left: 3.25rem; z-index: 500; display: inline-flex; align-items: center; gap: .45rem; padding: .35rem .7rem; border-radius: 999px; background: rgba(10, 42, 73, .88); color: #fff; font-size: .75rem; font-weight: 600; backdrop-filter: blur(4px); pointer-events: none; }
.map-fit-btn { position: absolute; top: .75rem; right: .75rem; z-index: 500; display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .75rem; border: 1px solid var(--p-surface-200); border-radius: var(--flotix-radius-control); background: rgba(255, 255, 255, .95); color: var(--p-surface-900); font: inherit; font-size: .8rem; font-weight: 600; cursor: pointer; transition: border-color .15s ease, color .15s ease; }
.map-fit-btn:hover { border-color: var(--p-primary-color); color: var(--p-primary-color); }
:deep(.flotix-map-icon-wrapper) { background: transparent; border: 0; }
:deep(.flotix-map-pin) { position: relative; transform: translate(-50%, -50%); display: inline-flex; align-items: center; gap: .28rem; padding: .16rem .42rem .16rem .34rem; border-radius: 999px; border: 1.5px solid #fff; background: rgba(10, 42, 73, .94); color: #fff; font-family: var(--flotix-font-display); font-size: .72rem; font-weight: 600; white-space: nowrap; box-shadow: 0 3px 10px rgba(15, 23, 42, .26); transition: transform .15s ease, box-shadow .15s ease; }
:deep(.flotix-map-pin.is-selected) { transform: translate(-50%, -50%) scale(1.09); box-shadow: 0 0 0 4px rgba(8, 121, 232, .35), 0 6px 16px rgba(15, 23, 42, .32); }
:deep(.flotix-map-pin.is-online .pin-dot) { background: #38bdf8; }
:deep(.flotix-map-pin.is-speeding) { background: #b91c1c; animation: speedingRing 1.2s ease-out infinite; }
:deep(.flotix-map-pin.is-speeding .pin-dot) { background: #fde047; }
:deep(.flotix-map-pin.is-offline) { background: #64748b; opacity: .82; }
:deep(.flotix-map-pin.is-offline .pin-dot) { background: #cbd5e1; }
:deep(.pin-dot) { width: .48rem; height: .48rem; border-radius: 999px; flex-shrink: 0; }
:deep(.pin-plate) { letter-spacing: .04em; }
:deep(.pin-speed) { font-family: var(--flotix-font-body); font-size: .7rem; font-weight: 600; padding: .05rem .32rem; border-radius: 999px; background: rgba(255, 255, 255, .16); font-variant-numeric: tabular-nums; }
@keyframes speedingRing {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, .55), 0 4px 12px rgba(15, 23, 42, .28); }
  100% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0), 0 4px 12px rgba(15, 23, 42, .28); }
}
</style>
