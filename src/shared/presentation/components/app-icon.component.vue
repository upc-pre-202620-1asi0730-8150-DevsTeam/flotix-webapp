<script setup>
/**
 * AppIcon — maps Flotix's semantic icon names to PrimeIcons classes
 * (`pi pi-*`), so every existing call site (`<AppIcon name="truck" />`)
 * keeps working unchanged while actually rendering PrimeVue's icon set.
 */
const ICON_MAP = {
  grid: 'th-large', truck: 'truck', users: 'users', fuel: 'bolt', wrench: 'wrench',
  alert: 'exclamation-triangle', pin: 'map-marker', building: 'building', chart: 'chart-bar',
  chip: 'microchip', bell: 'bell', gear: 'cog', menu: 'bars', logout: 'sign-out', plus: 'plus',
  search: 'search', chevronRight: 'chevron-right', download: 'download', star: 'star', phone: 'phone',
  mail: 'envelope', camera: 'camera', shield: 'shield', check: 'check', folder: 'folder',
  cash: 'money-bill', signal: 'wifi', cart: 'shopping-cart', globe: 'globe', play: 'play',
  close: 'times', send: 'send', quote: 'align-left'
}

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 }
})
</script>

<template>
  <i class="pi" :class="`pi-${ICON_MAP[name] || name}`" :style="{ fontSize: typeof size === 'number' ? size + 'px' : size, lineHeight: 1 }" />
</template>
