<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  contextLabel: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-column sm:flex-row sm:align-items-end sm:justify-content-between mb-4 gap-2">
    <div>
      <p v-if="contextLabel" class="text-xs font-semibold uppercase m-0 mb-1" style="color: var(--p-primary-color); letter-spacing: .06em">
        {{ contextLabel }}
      </p>
      <h1 class="text-2xl font-bold text-heading m-0" style="letter-spacing: -0.02em">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-muted mt-1 mb-0">{{ subtitle }}</p>
    </div>
    <div class="flex gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
