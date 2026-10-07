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

const toneStyle = {
  ink: { background: 'var(--p-surface-100, #f1f5f9)', color: 'var(--p-surface-600, #475569)' },
  primary: { background: 'var(--p-primary-100, #dbeafe)', color: 'var(--p-primary-700, #0662bd)' },
  amber: { background: '#fef3c7', color: '#b45309' },
  red: { background: '#fee2e2', color: '#b91c1c' },
  green: { background: '#d1fae5', color: '#047857' }
}
</script>

<template>
  <div class="rounded-2xl border-subtle p-3 shadow-card" style="background: var(--p-surface-0, #fff)">
    <div class="flex align-items-start justify-content-between">
      <p class="text-xs font-medium text-muted m-0">{{ label }}</p>
      <div v-if="icon" class="flotix-stat-icon" :style="toneStyle[tone]">
        <AppIcon :name="icon" :size="16" />
      </div>
    </div>
    <p class="text-2xl font-bold text-heading mt-1 mb-0" style="letter-spacing: -0.02em">{{ value }}</p>
    <p v-if="hint" class="text-xs text-faint mt-1 mb-0">{{ hint }}</p>
    <p v-if="trend" class="text-xs font-medium mt-1 mb-0" :style="{ color: trend.startsWith('-') ? '#dc2626' : '#059669' }">
      {{ trend.startsWith('-') ? '↓' : '↑' }} {{ trend.replace(/^[+-]/, '') }}
    </p>
  </div>
</template>
