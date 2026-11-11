<script setup>
import AppIcon from './app-icon.component.vue'

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  trend: { type: String, default: '' },
  icon: { type: String, default: '' },
  tone: { type: String, default: 'ink' } // ink | primary | amber | red | green
})

// The tone only colours the small icon beside the label; the figure itself
// stays in the heading colour so a row of stats reads as one band.
const toneColor = {
  ink: 'var(--p-surface-400, #94a3b8)',
  primary: 'var(--p-primary-color, #0879e8)',
  amber: '#b45309',
  red: '#b91c1c',
  green: '#17663a'
}
</script>

<template>
  <div class="flotix-stat">
    <p class="flex align-items-center gap-2 text-sm text-muted m-0">
      <AppIcon v-if="icon" :name="icon" :size="14" :style="{ color: toneColor[tone] }" />
      {{ label }}
    </p>
    <p class="flotix-stat-value mt-2 mb-0">{{ value }}</p>
    <p v-if="hint" class="text-xs text-muted mt-1 mb-0">{{ hint }}</p>
    <p v-if="trend" class="flex align-items-center gap-1 text-xs font-medium mt-1 mb-0" :style="{ color: trend.startsWith('-') ? '#b91c1c' : '#17663a' }">
      <i class="pi" :class="trend.startsWith('-') ? 'pi-arrow-down' : 'pi-arrow-up'" style="font-size: .65rem" />
      {{ trend.replace(/^[+-]/, '') }}
    </p>
  </div>
</template>
