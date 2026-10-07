<script setup>
import Card from 'primevue/card'

defineProps({
  title: { type: String, default: '' }
})
</script>

<template>
  <Card class="mx-auto" style="max-width: 36rem">
    <template v-if="title" #title>{{ title }}</template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>
