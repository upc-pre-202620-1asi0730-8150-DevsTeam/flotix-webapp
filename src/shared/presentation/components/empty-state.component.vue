<script setup>
import AppIcon from './app-icon.component.vue'

defineProps({
  icon: { type: String, default: 'chart' },
  message: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center rounded-2xl py-5 px-3 text-center" style="background: var(--p-surface-100, #f1f5f9)">
    <AppIcon :name="icon" :size="20" style="color: var(--p-surface-400, #94a3b8)" />
    <p class="text-sm text-muted mt-2 mb-0">{{ message }}</p>
    <div v-if="$slots.action" class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>
