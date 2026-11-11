<script setup>
// `contextLabel` is still accepted so existing call sites keep working, but it
// is no longer rendered here: the top bar already names the current area.
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  contextLabel: { type: String, default: '' }
})
</script>

<template>
  <div class="flex flex-column sm:flex-row sm:align-items-end sm:justify-content-between mb-4 gap-3">
    <div>
      <h1 class="flotix-page-title text-heading m-0">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-muted mt-1 mb-0" style="max-width: 42rem">{{ subtitle }}</p>
    </div>
    <div class="flex gap-2 flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.flotix-page-title {
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.15;
}
</style>
