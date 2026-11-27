<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.store.js'
import { AUTH_PREVIEW_ENABLED } from '../../application/user-authentication.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'
import AuthShell from '../components/auth-shell.component.vue'

const router = useRouter()
const { t } = useI18n()
const session = useSessionStore()
const previewEnabled = AUTH_PREVIEW_ENABLED
const localFallbackEnabled = import.meta.env.DEV
const previewRole = ref(UserRole.OWNER)
const previewRoles = Object.values(UserRole)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(false)
const error = ref('')

function errorText(message) {
  return message.startsWith('auth.') ? t(message) : message
}
async function submit() {
  error.value = ''
  try {
    await session.login(email.value, password.value, remember.value)
    router.push('/dashboard')
  } catch (exception) {
    error.value = exception.message
  }
}

async function signInWithGoogle() {
  error.value = ''
  try {
    await session.loginWithGoogle()
  } catch (exception) {
    error.value = exception.message
  }
}

function enterPreview() {
  error.value = ''
  try {
    session.enterPreview(previewRole.value)
    router.push('/dashboard')
  } catch (exception) {
    error.value = exception.message
  }
}
</script>

<template>
  <AuthShell active-tab="login">
    <section class="auth-view">
      <h2 class="auth-title">{{ t('auth.login.title') }}</h2>
      <p class="auth-subtitle">{{ t('auth.login.subtitle') }}</p>


      <div v-if="previewEnabled" class="auth-preview">
        <p>{{ t('auth.preview.description') }}</p>
        <div class="auth-preview-actions">
          <select v-model="previewRole" :aria-label="t('auth.preview.roleLabel')">
            <option v-for="role in previewRoles" :key="role" :value="role">{{ t(`roles.${role}`) }}</option>
          </select>
          <button type="button" @click="enterPreview">{{ t('auth.preview.enter') }}</button>
        </div>
      </div>

      <button type="button" class="auth-button auth-button-outline google-button" @click="signInWithGoogle">
        <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.39 38.06 46.98 31.9 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        <span>{{ t('auth.login.google') }}</span>
      </button>
      <div class="auth-divider"><span>{{ t('auth.login.orEmail') }}</span></div>

      <form class="auth-form" @submit.prevent="submit">
        <div class="auth-field">
          <label for="login-email">{{ t('auth.login.email') }} <span class="required">*</span></label>
          <div class="auth-input-wrap">
            <i class="pi pi-envelope field-icon" aria-hidden="true" />
            <input id="login-email" v-model="email" type="email" :placeholder="t('auth.login.emailPlaceholder')" autocomplete="username" autocapitalize="none" spellcheck="false" inputmode="email" required />
          </div>
        </div>
        <div class="auth-field">
          <label for="login-password">{{ t('auth.login.password') }} <span class="required">*</span></label>
          <div class="auth-input-wrap">
            <i class="pi pi-lock field-icon" aria-hidden="true" />
            <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" :placeholder="t('auth.login.passwordPlaceholder')" autocomplete="current-password" required />
            <button type="button" class="password-toggle" :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')" @click="showPassword = !showPassword"><i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" aria-hidden="true" /></button>
          </div>
        </div>
        <div class="auth-row">
          <label class="auth-check"><input v-model="remember" type="checkbox" /><span>{{ t('auth.login.remember') }}</span></label>
          <RouterLink class="auth-link" to="/forgot-password">{{ t('auth.login.forgot') }}</RouterLink>
        </div>
        <p v-if="error" class="auth-alert" role="alert"><i class="pi pi-exclamation-circle" aria-hidden="true" /><span>{{ errorText(error) }}</span></p>
        <button class="auth-button auth-button-primary" type="submit">{{ t('auth.login.submit') }}</button>
      </form>

      <p class="auth-foot">{{ t('auth.login.noAccount') }} <RouterLink class="auth-link" to="/register">{{ t('auth.login.register') }}</RouterLink></p>
    </section>
  </AuthShell>
</template>

<style scoped>
.auth-view { min-width: 0; }
.auth-title { margin: 0; color: var(--auth-ink); font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.9rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }
.auth-subtitle { margin: .4rem 0 0; color: var(--auth-muted); }
.auth-local-note { margin: .75rem 0 0; padding: .65rem .75rem; border: 1px solid #bfdbfe; border-radius: 7px; background: #eff6ff; color: #1e3a8a; font-size: .8rem; line-height: 1.45; }
.auth-button { display: inline-flex; width: 100%; min-height: 48px; align-items: center; justify-content: center; gap: .55rem; border: 1.5px solid transparent; border-radius: 6px; font: inherit; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background-color .15s ease, border-color .15s ease, color .15s ease, transform .12s cubic-bezier(.23,1,.32,1); }
.auth-button:active { transform: scale(.97); }
.auth-button-primary { margin-top: .15rem; background: #0879e8; color: #fff; }
.auth-button-primary:hover { background: #0662bd; }
.auth-button-outline { border-color: #cbd5e1; background: #fff; color: #0f172a; }
.auth-button-outline:hover { border-color: #0879e8; color: #0879e8; }
.google-button { margin-top: 1.25rem; }
.google-mark { width: 1.15rem; height: 1.15rem; }
.auth-divider { display: flex; align-items: center; gap: .8rem; margin: 1rem 0 .25rem; color: #64748b; font-size: .8rem; }
.auth-divider::before, .auth-divider::after { height: 1px; flex: 1; background: #e2e8f0; content: ''; }
.auth-form { display: grid; gap: 1rem; margin-top: 1.25rem; }
.auth-field { display: grid; gap: .35rem; }
.auth-field label { font-size: .875rem; font-weight: 600; }
.required { color: #a52a1c; }
.auth-input-wrap { position: relative; display: flex; align-items: center; }
.auth-input-wrap input { width: 100%; min-height: 46px; padding: .65rem .9rem .65rem 2.5rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; background: #fff; color: #0f172a; font: inherit; font-size: .95rem; transition: border-color .15s ease, box-shadow .15s ease; }
.auth-input-wrap input::placeholder { color: #94a3b8; }
.auth-input-wrap input:hover { border-color: #94a3b8; }
.auth-input-wrap input:focus { border-color: #0879e8; box-shadow: 0 0 0 3px rgba(8,121,232,.18); }
.field-icon { position: absolute; left: .8rem; color: #64748b; font-size: 1.05rem; pointer-events: none; }
.password-toggle { position: absolute; right: .35rem; display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border: 0; border-radius: 6px; background: none; color: #64748b; font-size: 1.1rem; cursor: pointer; }
.password-toggle:hover { background: #eef6ff; color: #0f172a; }
.auth-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.auth-check { display: inline-flex; align-items: center; gap: .5rem; color: #64748b; font-size: .875rem; cursor: pointer; }
.auth-check input { display: grid; width: 1.1rem; height: 1.1rem; margin: 0; appearance: none; place-items: center; border: 1.5px solid #cbd5e1; border-radius: 4px; background: #fff; cursor: pointer; }
.auth-check input:checked { border-color: #0879e8; background: #0879e8; }
.auth-check input:checked::after { width: .3rem; height: .6rem; transform: rotate(45deg) translate(-1px,-1px); border: solid #fff; border-width: 0 2px 2px 0; content: ''; }
.auth-link { padding: 0; border: 0; background: none; color: #0879e8; font: inherit; font-size: .875rem; font-weight: 600; text-decoration: none; cursor: pointer; }
.auth-link:hover { text-decoration: underline; }
.auth-alert { display: flex; align-items: flex-start; gap: .6rem; margin: 0; padding: .7rem .85rem; border-radius: 6px; background: #fde4e1; color: #a52a1c; font-size: .875rem; font-weight: 500; }
.auth-alert i { margin-top: .2rem; }
.auth-foot { margin: 1.5rem 0 0; color: var(--auth-muted); font-size: .9rem; text-align: center; }
.auth-preview { margin-top: 1rem; padding: .8rem; border: 1px solid #bfdbfe; border-radius: 8px; background: #eff6ff; color: #1e3a8a; font-size: .85rem; }
.auth-preview p { margin: 0 0 .6rem; }
.auth-preview-actions { display: flex; gap: .5rem; }
.auth-preview-actions select, .auth-preview-actions button { min-height: 38px; padding: .4rem .6rem; border: 1px solid #bfdbfe; border-radius: 6px; background: #fff; color: #0f172a; font: inherit; }
.auth-preview-actions select { min-width: 0; flex: 1; }
.auth-preview-actions button { border-color: #0879e8; background: #0879e8; color: #fff; font-weight: 600; cursor: pointer; }
.auth-preview-actions button:hover { background: #0662bd; }
@media (max-width: 520px) { .auth-row { align-items: flex-start; flex-direction: column; gap: .65rem; } }
</style>
