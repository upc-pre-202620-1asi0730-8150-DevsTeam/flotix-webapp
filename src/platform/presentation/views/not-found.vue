<script setup>
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { t } = useI18n()
</script>
<template>
  <div class="flex flex-column align-items-center justify-content-center text-center" style="min-height: 70vh">
    <p class="flotix-404 m-0" aria-hidden="true">404</p>
    <h1 class="mt-2 mb-0 text-2xl font-semibold text-heading">{{ t('notFound.title') }}</h1>
    <p class="mt-1 text-sm text-muted">{{ t('notFound.subtitle') }}</p>
    <router-link to="/dashboard" class="mt-4">
      <Button :label="t('notFound.back')" />
    </router-link>
  </div>
</template>

<style scoped>
.flotix-404 {
  font-family: var(--flotix-font-display);
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: .04em;
  color: var(--p-surface-300);
}
</style>
