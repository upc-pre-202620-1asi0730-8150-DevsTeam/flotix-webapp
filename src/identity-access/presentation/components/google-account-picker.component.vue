<script setup>
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'select'])
const { t } = useI18n()

const accounts = [
  { name: 'Renzo Valdivia', email: 'owner@flotix.pe', existing: true },
  { name: 'Ana Perez', email: 'ana.perez@gmail.com', existing: false }
]
</script>

<template>
  <Dialog :visible="modelValue" modal :header="t('auth.google.title')" :style="{ width: 'min(92vw, 26rem)' }" @update:visible="emit('update:modelValue', $event)">
    <p class="text-sm text-muted mt-0">{{ t('auth.google.subtitle') }}</p>
    <div class="flex flex-column gap-2">
      <button v-for="account in accounts" :key="account.email" type="button" class="google-demo-account" @click="emit('select', account)">
        <span class="google-demo-avatar">{{ account.name.charAt(0) }}</span>
        <span class="flex flex-column text-left">
          <strong>{{ account.name }}</strong>
          <small>{{ account.email }}</small>
          <small class="text-muted">{{ account.existing ? t('auth.google.existing') : t('auth.google.new') }}</small>
        </span>
      </button>
    </div>
    <template #footer>
      <Button :label="t('auth.google.close')" severity="secondary" text @click="emit('update:modelValue', false)" />
    </template>
  </Dialog>
</template>

<style scoped>
.google-demo-account {
  display: flex; align-items: center; gap: .8rem; width: 100%; padding: .8rem;
  border: 1px solid var(--p-surface-200); border-radius: 8px; background: #fff;
  color: var(--p-surface-900); cursor: pointer; font: inherit;
}
.google-demo-account:hover { border-color: var(--p-primary-400); background: var(--p-primary-50); }
.google-demo-account small { font-size: .75rem; }
.google-demo-avatar {
  display: grid; place-items: center; width: 2.5rem; height: 2.5rem; flex: 0 0 auto;
  border-radius: 50%; background: var(--p-primary-100); color: var(--p-primary-700); font-weight: 700;
}
</style>
