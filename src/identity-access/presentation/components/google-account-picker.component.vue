<script setup>
import { useI18n } from 'vue-i18n'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'select'])
const { t } = useI18n()
const accounts = [
  { name: 'Carlos Rojas', email: 'owner@flotix.com', existing: true },
  { name: 'Ana Perez', email: 'ana.perez@gmail.com', existing: false }
]

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="google-modal" role="presentation" @click.self="close" @keydown.esc="close">
    <section class="google-sheet" role="dialog" aria-modal="true" :aria-labelledby="`google-dialog-title`">
      <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.39 38.06 46.98 31.9 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      <h3 id="google-dialog-title">{{ t('auth.google.title') }}</h3>
      <p>{{ t('auth.google.subtitle') }}</p>
      <button v-for="account in accounts" :key="account.email" type="button" class="google-account" @click="emit('select', account)">
        <span class="account-avatar">{{ account.name.charAt(0) }}</span>
        <span>{{ account.name }}<small>{{ account.email }}</small></span>
      </button>
      <button type="button" class="google-cancel" @click="close">{{ t('auth.google.cancel') }}</button>
    </section>
  </div>
</template>

<style scoped>
.google-modal { position: fixed; z-index: 1000; inset: 0; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(11,27,43,.55); }
.google-sheet { width: 100%; max-width: 22rem; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; color: #0f172a; }
.google-mark { width: 1.5rem; height: 1.5rem; }
.google-sheet h3 { margin: .5rem 0 0; font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.2rem; }
.google-sheet > p { margin: .2rem 0 .8rem; color: #64748b; font-size: .875rem; }
.google-account { display: flex; width: 100%; align-items: center; gap: .7rem; padding: .7rem .3rem; border: 0; border-top: 1px solid #e2e8f0; background: none; color: #0f172a; font: inherit; font-size: .9rem; text-align: left; cursor: pointer; }
.google-account:hover { background: #eef6ff; }
.google-account small { display: block; color: #64748b; }
.account-avatar { display: grid; width: 2rem; height: 2rem; flex: 0 0 auto; place-items: center; border-radius: 50%; background: #eef6ff; color: #0879e8; font-size: .85rem; font-weight: 700; }
.google-cancel { margin-top: .8rem; padding: 0; border: 0; background: none; color: #0879e8; font: inherit; font-size: .875rem; cursor: pointer; }
.google-cancel:hover { text-decoration: underline; }
</style>
