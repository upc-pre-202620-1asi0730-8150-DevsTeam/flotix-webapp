<script setup>
import ToggleSwitch from 'primevue/toggleswitch'

defineProps({ modelValue: { type: Boolean, required: true } })
defineEmits(['update:modelValue'])
</script>

<template>
  <ToggleSwitch :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
</template>
