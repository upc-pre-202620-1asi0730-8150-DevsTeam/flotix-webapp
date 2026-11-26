<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.store.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'
import AuthShell from '../components/auth-shell.component.vue'
import LegalDocumentModal from '../components/legal-document-modal.component.vue'

const router = useRouter()
const { t } = useI18n()
const session = useSessionStore()
const legalModalOpen = ref(false)
const legalDocument = ref('terms')
const error = ref('')
const currentDate = new Date()
const minLicenseExpiry = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`

function errorText(message) {
  return message.startsWith('auth.') ? t(message) : message
}
const form = ref({
  role: UserRole.OWNER,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  fleetSize: '',
  licenseNumber: '',
  licenseExpiry: '',
  workshopName: '',
  workshopCity: '',
  workshopSpecialty: '',
  acceptedTerms: false
})

function showLegalDocument(kind) {
  legalDocument.value = kind
  legalModalOpen.value = true
}

async function submit() {
  error.value = ''
  const roleFields = {
    [UserRole.OWNER]: [form.value.companyName, form.value.fleetSize],
    [UserRole.DRIVER]: [form.value.licenseNumber, form.value.licenseExpiry],
    [UserRole.MECHANIC]: [form.value.workshopName, form.value.workshopCity, form.value.workshopSpecialty]
  }[form.value.role]

  if (roleFields.some((value) => !String(value).trim())) {
    error.value = 'auth.errors.roleFieldsRequired'
    return
  }
  if (form.value.role === UserRole.DRIVER && form.value.licenseExpiry < minLicenseExpiry) {
    error.value = 'auth.errors.licenseExpired'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'auth.errors.passwordMismatch'
    return
  }
  if (!form.value.acceptedTerms) {
    error.value = 'auth.errors.termsRequired'
    return
  }
  try {
    await session.register({
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      role: form.value.role,
      companyName: form.value.companyName.trim(),
      fleetSize: Number(form.value.fleetSize),
      licenseNumber: form.value.licenseNumber.trim(),
      licenseExpiry: form.value.licenseExpiry,
      workshopName: form.value.workshopName.trim(),
      workshopCity: form.value.workshopCity.trim(),
      workshopSpecialty: form.value.workshopSpecialty.trim()
    })
    router.push('/dashboard')
  } catch (exception) {
    error.value = exception.message
  }
}

async function signUpWithGoogle() {
  error.value = ''
  try {
    await session.loginWithGoogle()
  } catch (exception) {
    error.value = exception.message
  }
}
</script>

<template>
  <AuthShell active-tab="register">
    <section class="auth-view">
      <h2 class="auth-title">{{ t('auth.register.title') }}</h2>
      <p class="auth-subtitle">{{ t('auth.register.subtitle') }}</p>
      <button type="button" class="auth-button auth-button-outline google-button" @click="signUpWithGoogle">
        <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.39 38.06 46.98 31.9 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        <span>{{ t('auth.register.google') }}</span>
      </button>
      <div class="auth-divider"><span>{{ t('auth.login.orEmail') }}</span></div>

      <form class="register-form" @submit.prevent="submit">
        <div class="auth-field">
          <span class="auth-label">{{ t('auth.register.roleLabel') }}</span>
          <div class="role-segment" role="radiogroup" :aria-label="t('auth.register.roleLabel')">
            <label :class="{ selected: form.role === UserRole.OWNER }"><input v-model="form.role" type="radio" :value="UserRole.OWNER" /><span>{{ t('auth.register.owner') }}</span></label>
            <label :class="{ selected: form.role === UserRole.DRIVER }"><input v-model="form.role" type="radio" :value="UserRole.DRIVER" /><span>{{ t('auth.register.driver') }}</span></label>
            <label :class="{ selected: form.role === UserRole.MECHANIC }"><input v-model="form.role" type="radio" :value="UserRole.MECHANIC" /><span>{{ t('auth.register.mechanic') }}</span></label>
          </div>
        </div>

        <div v-if="form.role === UserRole.OWNER" class="auth-field">
          <label for="register-company">{{ t('auth.register.company') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-building field-icon" aria-hidden="true" /><input id="register-company" v-model="form.companyName" :placeholder="t('auth.register.companyPlaceholder')" maxlength="150" autocomplete="organization" required /></div>
          <label for="register-fleet-size">{{ t('auth.register.fleetSize') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-truck field-icon" aria-hidden="true" /><input id="register-fleet-size" v-model="form.fleetSize" type="number" min="1" step="1" :placeholder="t('auth.register.fleetSizePlaceholder')" required /></div>
        </div>
        <div v-else-if="form.role === UserRole.DRIVER" class="name-grid">
          <div class="auth-field">
            <label for="register-license-number">{{ t('auth.register.licenseNumber') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-id-card field-icon" aria-hidden="true" /><input id="register-license-number" v-model="form.licenseNumber" :placeholder="t('auth.register.licenseNumberPlaceholder')" maxlength="30" required /></div>
          </div>
          <div class="auth-field">
            <label for="register-license-expiry">{{ t('auth.register.licenseExpiry') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-calendar field-icon" aria-hidden="true" /><input id="register-license-expiry" v-model="form.licenseExpiry" type="date" :min="minLicenseExpiry" required /></div>
            <small class="field-example">{{ t('auth.register.licenseExpiryExample') }}</small>
          </div>
        </div>
        <div v-else class="role-fields">
          <div class="auth-field">
            <label for="register-workshop">{{ t('auth.register.workshop') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-wrench field-icon" aria-hidden="true" /><input id="register-workshop" v-model="form.workshopName" :placeholder="t('auth.register.workshopPlaceholder')" maxlength="100" required /></div>
          </div>
          <div class="auth-field">
            <label for="register-workshop-city">{{ t('auth.register.workshopCity') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-map-marker field-icon" aria-hidden="true" /><input id="register-workshop-city" v-model="form.workshopCity" :placeholder="t('auth.register.workshopCityPlaceholder')" maxlength="100" required /></div>
          </div>
          <div class="auth-field">
            <label for="register-workshop-specialty">{{ t('auth.register.workshopSpecialty') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-wrench field-icon" aria-hidden="true" /><input id="register-workshop-specialty" v-model="form.workshopSpecialty" :placeholder="t('auth.register.workshopSpecialtyPlaceholder')" maxlength="100" required /></div>
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
          <div class="auth-input-wrap"><i class="pi pi-envelope field-icon" aria-hidden="true" /><input id="register-email" v-model="form.email" type="email" :placeholder="t('auth.register.emailPlaceholder')" autocomplete="email" autocapitalize="none" spellcheck="false" inputmode="email" maxlength="100" required /></div>
        </div>
        <div class="auth-field">
          <label for="register-password">{{ t('auth.register.password') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="register-password" v-model="form.password" type="password" :placeholder="t('auth.register.passwordPlaceholder')" autocomplete="new-password" required /></div>
        </div>
        <div class="auth-field">
          <label for="register-confirm-password">{{ t('auth.register.confirmPassword') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="register-confirm-password" v-model="form.confirmPassword" type="password" :placeholder="t('auth.register.confirmPlaceholder')" autocomplete="new-password" required /></div>
        </div>
        <label class="terms-check"><input v-model="form.acceptedTerms" type="checkbox" /><span>{{ t('auth.register.agreePrefix') }} <button class="legal-link" type="button" @click="showLegalDocument('terms')">{{ t('auth.register.termsLink') }}</button> {{ t('auth.register.agreeJoin') }} <button class="legal-link" type="button" @click="showLegalDocument('privacy')">{{ t('auth.register.privacyLink') }}</button></span></label>
        <p v-if="error" class="auth-alert" role="alert"><i class="pi pi-exclamation-circle" aria-hidden="true" /><span>{{ errorText(error) }}</span></p>
        <button class="auth-button auth-button-primary" type="submit">{{ t('auth.register.submit') }}</button>
      </form>
      <p class="auth-foot">{{ t('auth.register.haveAccount') }} <RouterLink class="auth-link" to="/login">{{ t('auth.register.login') }}</RouterLink></p>
    </section>
    <LegalDocumentModal v-model="legalModalOpen" :kind="legalDocument" />
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
.role-fields { display: grid; gap: 1rem; }
.field-example { color: #64748b; font-size: .75rem; }
.auth-field { display: grid; min-width: 0; gap: .35rem; }
.auth-field label, .auth-label { font-size: .875rem; font-weight: 600; }
.required { color: #a52a1c; }
.name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.auth-input-wrap { position: relative; display: flex; min-width: 0; align-items: center; }
.auth-input-wrap input { width: 100%; min-height: 46px; padding: .65rem .9rem .65rem 2.5rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; background: #fff; color: #0f172a; font: inherit; font-size: .95rem; transition: border-color .15s ease, box-shadow .15s ease; }
.auth-input-wrap input::placeholder { color: #94a3b8; }
.auth-input-wrap input:hover { border-color: #94a3b8; }
.auth-input-wrap input:focus { border-color: #0879e8; box-shadow: 0 0 0 3px rgba(8,121,232,.18); }
.field-icon { position: absolute; left: .8rem; color: #64748b; font-size: 1.05rem; pointer-events: none; }
.role-segment { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 3px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; }
.role-segment label { position: relative; display: flex; min-height: 40px; align-items: center; justify-content: center; padding: .55rem .25rem; border-radius: 6px; color: #64748b; font-size: .8rem; font-weight: 600; text-align: center; cursor: pointer; }
.role-segment label:hover { color: #0f172a; }
.role-segment label.selected { background: #eef6ff; color: #0879e8; }
.role-segment input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.role-segment input:focus-visible + span { outline: 2px solid #f2a93d; outline-offset: 2px; }
.terms-check { display: flex; align-items: flex-start; gap: .5rem; color: #64748b; font-size: .8rem; cursor: pointer; }
.legal-link { padding: 0; border: 0; background: none; color: #0879e8; font: inherit; font-size: inherit; text-decoration: underline; cursor: pointer; }
.legal-link:hover { color: #0662bd; }
.terms-check input { display: grid; width: 1.1rem; height: 1.1rem; flex: 0 0 auto; margin: .1rem 0 0; appearance: none; place-items: center; border: 1.5px solid #cbd5e1; border-radius: 4px; background: #fff; cursor: pointer; }
.terms-check input:checked { border-color: #0879e8; background: #0879e8; }
.terms-check input:checked::after { width: .3rem; height: .6rem; transform: rotate(45deg) translate(-1px,-1px); border: solid #fff; border-width: 0 2px 2px 0; content: ''; }
.auth-alert { display: flex; align-items: flex-start; gap: .6rem; margin: 0; padding: .7rem .85rem; border-radius: 6px; background: #fde4e1; color: #a52a1c; font-size: .875rem; font-weight: 500; }
.auth-alert i { margin-top: .2rem; }
.auth-foot { margin: 1.5rem 0 0; color: #64748b; font-size: .9rem; text-align: center; }
.auth-link { color: #0879e8; font-size: inherit; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
@media (max-width: 520px) { .name-grid { grid-template-columns: 1fr; } }
</style>
