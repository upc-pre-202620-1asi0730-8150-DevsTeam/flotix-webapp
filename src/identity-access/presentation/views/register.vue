<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.store.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'
import AuthShell from '../components/auth-shell.component.vue'
import GoogleAccountPicker from '../components/google-account-picker.component.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const session = useSessionStore()
const googlePickerOpen = ref(false)
const googleSignup = ref(false)
const error = ref('')
const form = ref({
  role: UserRole.OWNER,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
})

function submit() {
  error.value = ''
  if (!googleSignup.value && form.value.password !== form.value.confirmPassword) {
    error.value = 'auth.errors.passwordMismatch'
    return
  }
  if (!form.value.acceptedTerms) {
    error.value = 'auth.errors.termsRequired'
    return
  }
  try {
    session.register({
      name: `${form.value.firstName.trim()} ${form.value.lastName.trim()}`.trim(),
      email: form.value.email,
      role: form.value.role
    })
    router.push('/dashboard')
  } catch (exception) {
    error.value = exception.message
  }
}

function selectGoogleAccount(account) {
  googlePickerOpen.value = false
  if (account.existing) {
    router.push({ path: '/login', query: { email: account.email } })
    return
  }
  const [firstName = '', ...lastName] = account.name.split(' ')
  form.value.email = account.email
  form.value.firstName = firstName
  form.value.lastName = lastName.join(' ')
  googleSignup.value = true
}

onMounted(() => {
  if (typeof route.query.email === 'string') {
    form.value.email = route.query.email
    const [firstName = '', ...lastName] = (typeof route.query.name === 'string' ? route.query.name : '').split(' ')
    form.value.firstName = firstName
    form.value.lastName = lastName.join(' ')
    googleSignup.value = route.query.mode === 'google'
  }
})
</script>

<template>
  <AuthShell active-tab="register">
    <section class="auth-view">
      <template v-if="!googleSignup">
        <h2 class="auth-title">{{ t('auth.register.title') }}</h2>
        <p class="auth-subtitle">{{ t('auth.register.subtitle') }}</p>
        <button type="button" class="auth-button auth-button-outline google-button" @click="googlePickerOpen = true">
          <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.39 38.06 46.98 31.9 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          <span>{{ t('auth.register.google') }}</span>
        </button>
        <div class="auth-divider"><span>{{ t('auth.login.orEmail') }}</span></div>
      </template>
      <template v-else>
        <h2 class="auth-title">{{ t('auth.google.lastStep') }}</h2>
        <p class="auth-subtitle">{{ t('auth.google.lastStepSubtitle') }}</p>
        <div class="google-email-chip"><i class="pi pi-envelope" aria-hidden="true" /><span>{{ form.email }}</span></div>
      </template>

      <form class="register-form" @submit.prevent="submit">
        <div class="auth-field">
          <span class="auth-label">{{ t('auth.register.roleLabel') }}</span>
          <div class="role-segment" role="radiogroup" :aria-label="t('auth.register.roleLabel')">
            <label :class="{ selected: form.role === UserRole.OWNER }"><input v-model="form.role" type="radio" :value="UserRole.OWNER" /><span>{{ t('auth.register.owner') }}</span></label>
            <label :class="{ selected: form.role === UserRole.DRIVER }"><input v-model="form.role" type="radio" :value="UserRole.DRIVER" /><span>{{ t('auth.register.driver') }}</span></label>
            <label :class="{ selected: form.role === UserRole.MECHANIC }"><input v-model="form.role" type="radio" :value="UserRole.MECHANIC" /><span>{{ t('auth.register.mechanic') }}</span></label>
          </div>
        </div>

        <div class="name-grid">
          <div class="auth-field">
            <label for="register-first-name">{{ t('auth.register.firstName') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-user field-icon" aria-hidden="true" /><input id="register-first-name" v-model="form.firstName" :placeholder="t('auth.register.firstPlaceholder')" autocomplete="given-name" maxlength="50" required /></div>
          </div>
          <div class="auth-field">
            <label for="register-last-name">{{ t('auth.register.lastName') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-user field-icon" aria-hidden="true" /><input id="register-last-name" v-model="form.lastName" :placeholder="t('auth.register.lastPlaceholder')" autocomplete="family-name" maxlength="50" required /></div>
          </div>
        </div>
        <div class="auth-field">
          <label for="register-email">{{ t('auth.register.email') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-envelope field-icon" aria-hidden="true" /><input id="register-email" v-model="form.email" type="email" :placeholder="t('auth.register.emailPlaceholder')" autocomplete="email" autocapitalize="none" spellcheck="false" inputmode="email" maxlength="100" :readonly="googleSignup" required /></div>
        </div>
        <template v-if="!googleSignup">
          <div class="auth-field">
            <label for="register-password">{{ t('auth.register.password') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="register-password" v-model="form.password" type="password" :placeholder="t('auth.register.passwordPlaceholder')" autocomplete="new-password" required /></div>
          </div>
          <div class="auth-field">
            <label for="register-confirm-password">{{ t('auth.register.confirmPassword') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="register-confirm-password" v-model="form.confirmPassword" type="password" :placeholder="t('auth.register.confirmPlaceholder')" autocomplete="new-password" required /></div>
          </div>
        </template>
        <label class="terms-check"><input v-model="form.acceptedTerms" type="checkbox" /><span>{{ t('auth.register.agreePrefix') }} <a href="#" @click.prevent>{{ t('auth.register.termsLink') }}</a> {{ t('auth.register.agreeJoin') }} <a href="#" @click.prevent>{{ t('auth.register.privacyLink') }}</a></span></label>
        <p v-if="error" class="auth-alert" role="alert"><i class="pi pi-exclamation-circle" aria-hidden="true" /><span>{{ t(error) }}</span></p>
        <button class="auth-button auth-button-primary" type="submit">{{ t(googleSignup ? 'auth.google.finish' : 'auth.register.submit') }}</button>
        <button v-if="googleSignup" type="button" class="cancel-link" @click="googleSignup = false">{{ t('auth.google.cancel') }}</button>
      </form>
      <p v-if="!googleSignup" class="auth-foot">{{ t('auth.register.haveAccount') }} <RouterLink class="auth-link" to="/login">{{ t('auth.register.login') }}</RouterLink></p>
    </section>
    <GoogleAccountPicker v-model="googlePickerOpen" @select="selectGoogleAccount" />
  </AuthShell>
</template>

<style scoped>
.auth-view { min-width: 0; }
.auth-title { margin: 0; color: #0f172a; font-family: var(--flotix-font-display, 'Barlow Semi Condensed', sans-serif); font-size: 1.9rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }
.auth-subtitle { margin: .4rem 0 0; color: #64748b; }
.auth-button { display: inline-flex; width: 100%; min-height: 48px; align-items: center; justify-content: center; gap: .55rem; border: 1.5px solid transparent; border-radius: 6px; font: inherit; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background-color .15s ease, border-color .15s ease, color .15s ease, transform .12s cubic-bezier(.23,1,.32,1); }
.auth-button:active { transform: scale(.97); }
.auth-button-primary { background: #0879e8; color: #fff; }
.auth-button-primary:hover { background: #0662bd; }
.auth-button-outline { border-color: #cbd5e1; background: #fff; color: #0f172a; }
.auth-button-outline:hover { border-color: #0879e8; color: #0879e8; }
.google-button { margin-top: 1.25rem; }
.google-mark { width: 1.15rem; height: 1.15rem; }
.auth-divider { display: flex; align-items: center; gap: .8rem; margin: 1rem 0 .25rem; color: #64748b; font-size: .8rem; }
.auth-divider::before, .auth-divider::after { height: 1px; flex: 1; background: #e2e8f0; content: ''; }
.register-form { display: grid; gap: 1rem; margin-top: 1.25rem; }
.auth-field { display: grid; min-width: 0; gap: .35rem; }
.auth-field label, .auth-label { font-size: .875rem; font-weight: 600; }
.required { color: #a52a1c; }
.name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.auth-input-wrap { position: relative; display: flex; min-width: 0; align-items: center; }
.auth-input-wrap input { width: 100%; min-height: 46px; padding: .65rem .9rem .65rem 2.5rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; background: #fff; color: #0f172a; font: inherit; font-size: .95rem; transition: border-color .15s ease, box-shadow .15s ease; }
.auth-input-wrap input::placeholder { color: #94a3b8; }
.auth-input-wrap input:hover { border-color: #94a3b8; }
.auth-input-wrap input:focus { border-color: #0879e8; box-shadow: 0 0 0 3px rgba(8,121,232,.18); }
.auth-input-wrap input[readonly] { background: #f8fafc; color: #64748b; }
.field-icon { position: absolute; left: .8rem; color: #64748b; font-size: 1.05rem; pointer-events: none; }
.role-segment { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 3px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; }
.role-segment label { position: relative; display: flex; min-height: 40px; align-items: center; justify-content: center; padding: .55rem .25rem; border-radius: 6px; color: #64748b; font-size: .8rem; font-weight: 600; text-align: center; cursor: pointer; }
.role-segment label:hover { color: #0f172a; }
.role-segment label.selected { background: #eef6ff; color: #0879e8; }
.role-segment input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.role-segment input:focus-visible + span { outline: 2px solid #f2a93d; outline-offset: 2px; }
.terms-check { display: flex; align-items: flex-start; gap: .5rem; color: #64748b; font-size: .8rem; cursor: pointer; }
.terms-check input { display: grid; width: 1.1rem; height: 1.1rem; flex: 0 0 auto; margin: .1rem 0 0; appearance: none; place-items: center; border: 1.5px solid #cbd5e1; border-radius: 4px; background: #fff; cursor: pointer; }
.terms-check input:checked { border-color: #0879e8; background: #0879e8; }
.terms-check input:checked::after { width: .3rem; height: .6rem; transform: rotate(45deg) translate(-1px,-1px); border: solid #fff; border-width: 0 2px 2px 0; content: ''; }
.auth-alert { display: flex; align-items: flex-start; gap: .6rem; margin: 0; padding: .7rem .85rem; border-radius: 6px; background: #fde4e1; color: #a52a1c; font-size: .875rem; font-weight: 500; }
.auth-alert i { margin-top: .2rem; }
.auth-foot { margin: 1.5rem 0 0; color: #64748b; font-size: .9rem; text-align: center; }
.auth-link { color: #0879e8; font-size: inherit; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
.google-email-chip { display: flex; align-items: center; gap: .6rem; margin: 1rem 0 0; padding: .6rem .8rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; font-size: .9rem; }
.cancel-link { border: 0; background: none; color: #0879e8; font: inherit; font-size: .9rem; cursor: pointer; }
.cancel-link:hover { text-decoration: underline; }
@media (max-width: 520px) { .name-grid { grid-template-columns: 1fr; } }
</style>
