<script setup>
import AppIcon from './app-icon.component.vue'

defineProps({
  icon: { type: String, default: 'chart' },
  message: { type: String, default: 'No hay registros todavía.' }
})
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center rounded-2xl py-6 text-center" style="border: 1.5px dashed var(--p-surface-300, #cbd5e1); background: var(--p-surface-0, #fff)">
    <div class="flex align-items-center justify-content-center border-round-full" style="width: 2.75rem; height: 2.75rem; background: var(--p-surface-100); color: var(--p-surface-400)">
      <AppIcon :name="icon" :size="20" />
    </div>
    <p class="text-sm text-muted mt-3 mb-0">{{ message }}</p>
    <div class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>
