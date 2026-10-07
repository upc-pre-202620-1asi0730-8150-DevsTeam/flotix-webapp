<script setup>
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { t } = useI18n()
</script>
<template>
  <div class="flex flex-column align-items-center justify-content-center text-center" style="min-height: 70vh">
    <span class="text-5xl">🧭</span>
    <h1 class="mt-3 text-2xl font-bold text-heading">{{ t('notFound.title') }}</h1>
    <p class="mt-1 text-sm text-muted">{{ t('notFound.subtitle') }}</p>
    <router-link to="/dashboard" class="mt-4">
      <Button :label="t('notFound.back')" />
    </router-link>
  </div>
</template>
