<script setup>
import { watch } from 'vue'
import Toast from 'primevue/toast'
import { usePrimeVue } from 'primevue/config'
import { i18n } from '@/internationalization/i18n.js'
import { primeLocales } from '@/internationalization/primevue-locale.js'

// Keep PrimeVue's own texts (calendar months, etc.) in the selected language.
const primevue = usePrimeVue()
watch(
  () => i18n.global.locale.value,
  (locale) => Object.assign(primevue.config.locale, primeLocales[locale]),
  { immediate: true }
)
</script>
<template>
  <Toast position="top-right" />
  <router-view />
</template>
