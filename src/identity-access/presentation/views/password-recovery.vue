<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { identityService } from '../../application/user-authentication.js'
import AuthShell from '../components/auth-shell.component.vue'

const route = useRoute()
const { t } = useI18n()
const email = ref(String(route.query.email ?? ''))
const token = computed(() => String(route.query.token ?? route.query.oobCode ?? route.query.code ?? ''))
const isReset = computed(() => route.name === 'reset-password')
const canRequestReset = typeof identityService.provider.requestPasswordReset === 'function'
const canConfirmReset = typeof identityService.provider.confirmPasswordReset === 'function'
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const complete = ref(false)
const busy = ref(false)

function errorText(message) {
  return message.startsWith('auth.') ? t(message) : message
}

async function requestReset() {
  error.value = ''
  complete.value = false
  busy.value = true
  try {
    await identityService.requestPasswordReset(email.value.trim())
    complete.value = true
  } catch (exception) {
    error.value = exception.message
  } finally {
    busy.value = false
  }
}

async function confirmReset() {
  error.value = ''
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'auth.errors.passwordMismatch'
    return
  }
  if (!token.value) {
    error.value = 'auth.recovery.missingToken'
    return
  }

  busy.value = true
  try {
    await identityService.confirmPasswordReset(token.value, newPassword.value)
    complete.value = true
  } catch (exception) {
    error.value = exception.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <AuthShell active-tab="login">
    <section class="auth-view">
      <h2 class="auth-title">{{ isReset ? t('auth.recovery.resetTitle') : t('auth.recovery.title') }}</h2>
      <p class="auth-subtitle">{{ isReset ? t('auth.recovery.resetSubtitle') : t('auth.recovery.subtitle') }}</p>

      <template v-if="complete">
        <p class="recovery-success" role="status">
          {{ isReset ? t('auth.recovery.passwordUpdated') : t('auth.recovery.requestSent') }}
        </p>
        <RouterLink class="auth-button auth-button-primary recovery-return" to="/login">{{ t('auth.recovery.returnLogin') }}</RouterLink>
      </template>

      <template v-else-if="isReset">
        <p v-if="!token" class="auth-alert" role="alert">{{ t('auth.recovery.missingToken') }}</p>
        <p v-else-if="!canConfirmReset" class="auth-alert" role="alert">{{ t('auth.errors.passwordResetUnavailable') }}</p>
        <form v-else class="recovery-form" @submit.prevent="confirmReset">
          <div class="auth-field">
            <label for="recovery-new-password">{{ t('auth.recovery.newPassword') }}</label>
            <input id="recovery-new-password" v-model="newPassword" type="password" autocomplete="new-password" minlength="8" required />
          </div>
          <div class="auth-field">
            <label for="recovery-confirm-password">{{ t('auth.recovery.confirmPassword') }}</label>
            <input id="recovery-confirm-password" v-model="confirmPassword" type="password" autocomplete="new-password" minlength="8" required />
          </div>
          <p v-if="error" class="auth-alert" role="alert">{{ errorText(error) }}</p>
          <button class="auth-button auth-button-primary" type="submit" :disabled="busy">{{ t('auth.recovery.updatePassword') }}</button>
        </form>
      </template>

      <form v-else class="recovery-form" @submit.prevent="requestReset">
        <div class="auth-field">
          <label for="recovery-email">{{ t('auth.recovery.email') }}</label>
          <input id="recovery-email" v-model="email" type="email" autocomplete="email" required />
        </div>
        <p v-if="!canRequestReset" class="auth-alert" role="alert">{{ t('auth.errors.passwordResetUnavailable') }}</p>
        <p v-if="error" class="auth-alert" role="alert">{{ errorText(error) }}</p>
        <button class="auth-button auth-button-primary" type="submit" :disabled="busy || !canRequestReset">{{ t('auth.recovery.send') }}</button>
      </form>

      <p class="auth-foot"><RouterLink class="auth-link" to="/login">{{ t('auth.recovery.returnLogin') }}</RouterLink></p>
    </section>
  </AuthShell>
</template>

<style scoped>
.auth-view { min-width: 0; }
.auth-title { margin: 0; color: var(--auth-ink); font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.9rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }
.auth-subtitle { margin: .4rem 0 0; color: var(--auth-muted); }
.recovery-form { display: grid; gap: 1rem; margin-top: 1.25rem; }
.auth-field { display: grid; gap: .35rem; }
.auth-field label { font-size: .875rem; font-weight: 600; }
.auth-field input { width: 100%; min-height: 46px; box-sizing: border-box; padding: .65rem .9rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; background: #fff; color: #0f172a; font: inherit; }
.auth-field input:focus-visible { border-color: #0879e8; box-shadow: 0 0 0 3px rgba(8,121,232,.18); }
.auth-button { display: inline-flex; width: 100%; min-height: 48px; align-items: center; justify-content: center; border: 1.5px solid transparent; border-radius: 6px; font: inherit; font-size: 1rem; font-weight: 700; text-decoration: none; cursor: pointer; }
.auth-button-primary { background: #0879e8; color: #fff; }
.auth-button:disabled { opacity: .6; cursor: not-allowed; }
.auth-alert { margin: 0; padding: .7rem .85rem; border-radius: 6px; background: #fde4e1; color: #a52a1c; font-size: .875rem; }
.recovery-success { margin: 1.25rem 0 0; color: var(--auth-ink); }
.recovery-return { margin-top: .75rem; }
.auth-foot { margin: 1.5rem 0 0; color: var(--auth-muted); font-size: .9rem; text-align: center; }
.auth-link { color: #0879e8; font-size: inherit; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
</style>
