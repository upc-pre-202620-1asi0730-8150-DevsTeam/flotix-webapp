<script setup>
import Button from 'primevue/button'

// Thin wrapper around PrimeVue's Button so every existing call site
// (`<AppButton variant="ghost">`) keeps working while actually
// rendering a real PrimeVue component under the hood.
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | ghost | subtle | danger
  type: { type: String, default: 'button' },
  icon: { type: String, default: '' } // PrimeIcons class, e.g. 'pi pi-plus'
})
defineEmits(['click'])

const severityMap = { primary: undefined, ghost: 'secondary', subtle: 'secondary', danger: 'danger' }
</script>

<template>
  <Button
    :type="type"
    :severity="severityMap[variant]"
    :outlined="variant === 'ghost'"
    :text="false"
    @click="$emit('click', $event)"
  >
    <i v-if="icon" :class="icon" style="font-size: .85em" aria-hidden="true" />
    <slot />
  </Button>
</template>
