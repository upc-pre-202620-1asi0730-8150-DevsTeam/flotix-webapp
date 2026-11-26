<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '../stores/session.store.js'
import { UserRole } from '../../domain/model/value-objects/user-role.js'
import { PLAN_CATALOG, findPlan } from '../../domain/model/value-objects/subscription-plan.js'
import { subscriptionService } from '../../application/subscription.service.js'
import AuthShell from '../components/auth-shell.component.vue'
import LegalDocumentModal from '../components/legal-document-modal.component.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const session = useSessionStore()
const localFallbackEnabled = import.meta.env.DEV
const legalModalOpen = ref(false)
const legalDocument = ref('terms')
const error = ref('')

// Plan chosen on the landing page (/register?plan=growth). Without a plan the form behaves as before.
const plan = computed(() => findPlan(route.query.plan))
const plans = Object.values(PLAN_CATALOG)
const step = ref('account') // 'account' | 'payment' (payment only when a plan was selected)
const paying = ref(false)
const card = ref({ holder: '', number: '', expiry: '', cvv: '' })

function planLimitText(item) {
  return item.vehicleLimit ? t('auth.plan.upTo', { count: item.vehicleLimit }) : t('auth.plan.unlimited')
}
function choosePlan(id) {
  router.replace({ query: { ...route.query, plan: id } })
}
// Only fleet owners buy plans, so the role is fixed while a plan is selected.
watch(plan, (value) => { if (value) form.value.role = UserRole.OWNER }, { immediate: false })

function formatCardNumber() {
  card.value.number = card.value.number.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry() {
  const digits = card.value.expiry.replace(/\D/g, '').slice(0, 4)
  card.value.expiry = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}
function cardIsValid() {
  const digits = card.value.number.replace(/\D/g, '')
  const [mm, yy] = card.value.expiry.split('/').map(Number)
  const now = new Date()
  const notExpired = yy != null && mm >= 1 && mm <= 12 && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1))
  return card.value.holder.trim().length > 1 && digits.length >= 13 && notExpired && /^\d{3,4}$/.test(card.value.cvv)
}
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

function validateAccount() {
  const roleFields = {
    [UserRole.OWNER]: [form.value.companyName, form.value.fleetSize],
    [UserRole.DRIVER]: [form.value.licenseNumber, form.value.licenseExpiry],
    [UserRole.MECHANIC]: [form.value.workshopName, form.value.workshopCity, form.value.workshopSpecialty]
  }[form.value.role]

  if (roleFields.some((value) => !String(value).trim())) {
    error.value = 'auth.errors.roleFieldsRequired'
    return false
  }
  if (form.value.role === UserRole.DRIVER && form.value.licenseExpiry < minLicenseExpiry) {
    error.value = 'auth.errors.licenseExpired'
    return false
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'auth.errors.passwordMismatch'
    return false
  }
  if (!form.value.acceptedTerms) {
    error.value = 'auth.errors.termsRequired'
    return false
  }
  if (plan.value?.vehicleLimit && Number(form.value.fleetSize) > plan.value.vehicleLimit) {
    error.value = t('auth.errors.fleetSizeExceedsPlan', { plan: plan.value.name, limit: plan.value.vehicleLimit })
    return false
  }
  return true
}

async function submit() {
  error.value = ''
  if (!validateAccount()) return
  if (plan.value && step.value === 'account') {
    step.value = 'payment'
    return
  }
  if (plan.value && !cardIsValid()) {
    error.value = 'auth.errors.cardInvalid'
    return
  }
  try {
    paying.value = true
    if (plan.value) await new Promise((resolve) => setTimeout(resolve, 1500)) // simulated payment gateway
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
      workshopSpecialty: form.value.workshopSpecialty.trim(),
      // Plan bought at sign-up (simulated payment): sent to the API; only the last 4 digits of the card leave the form
      plan: plan.value?.id ?? null,
      cardLast4: plan.value ? card.value.number.replace(/\D/g, '').slice(-4) : null,
      cardExpiry: plan.value ? card.value.expiry : null
    })
    // The API stores the plan; the local preview provider has no backend, so keep it in the browser instead.
    if (plan.value && !session.user?.subscription) subscriptionService.activate(session.user?.id, plan.value.id, card.value)
    router.push('/dashboard')
  } catch (exception) {
    error.value = exception.message
  } finally {
    paying.value = false
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

      <div v-if="plan" class="plan-summary" data-testid="selected-plan">
        <div class="plan-summary-head">
          <span class="plan-kicker">{{ t('auth.plan.selected') }}</span>
          <strong class="plan-name">{{ plan.name }}</strong>
          <span class="plan-price">S/ {{ plan.priceMonthly }} <small>{{ t('auth.plan.perMonth') }}</small></span>
          <span class="plan-limit">{{ planLimitText(plan) }}</span>
        </div>
        <div v-if="step === 'account'" class="plan-switch" role="radiogroup" :aria-label="t('auth.plan.change')">
          <button v-for="item in plans" :key="item.id" type="button" role="radio" :aria-checked="item.id === plan.id" :class="{ active: item.id === plan.id }" @click="choosePlan(item.id)">{{ item.name }}</button>
        </div>
      </div>
      
      <button v-if="!plan" type="button" class="auth-button auth-button-outline google-button" @click="signUpWithGoogle">
        <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.39 38.06 46.98 31.9 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        <span>{{ t('auth.register.google') }}</span>
      </button>
      <div v-if="!plan" class="auth-divider"><span>{{ t('auth.login.orEmail') }}</span></div>

      <form class="register-form" @submit.prevent="submit">
<div v-show="step === 'account'" class="register-fields">
        <div v-if="!plan" class="auth-field">
          <span class="auth-label">{{ t('auth.register.roleLabel') }}</span>
          <div class="role-segment" role="radiogroup" :aria-label="t('auth.register.roleLabel')">
            <label :class="{ selected: form.role === UserRole.OWNER }"><input v-model="form.role" type="radio" :value="UserRole.OWNER" /><span>{{ t('auth.register.owner') }}</span></label>
            <label :class="{ selected: form.role === UserRole.DRIVER }"><input v-model="form.role" type="radio" :value="UserRole.DRIVER" /><span>{{ t('auth.register.driver') }}</span></label>
            <label :class="{ selected: form.role === UserRole.MECHANIC }"><input v-model="form.role" type="radio" :value="UserRole.MECHANIC" /><span>{{ t('auth.register.mechanic') }}</span></label>
          </div>
        </div>

        <p v-else class="plan-owner-note"><i class="pi pi-info-circle" aria-hidden="true" /><span>{{ t('auth.plan.ownerOnly') }}</span></p>

        <div v-if="form.role === UserRole.OWNER" class="auth-field">
          <label for="register-company">{{ t('auth.register.company') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-building field-icon" aria-hidden="true" /><input id="register-company" v-model="form.companyName" :placeholder="t('auth.register.companyPlaceholder')" maxlength="150" autocomplete="organization" required /></div>
          <label for="register-fleet-size">{{ t('auth.register.fleetSize') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-truck field-icon" aria-hidden="true" /><input id="register-fleet-size" v-model="form.fleetSize" type="number" min="1" step="1" :placeholder="t('auth.register.fleetSizePlaceholder')" required /></div>
        </div>
        <div v-else-if="form.role === UserRole.DRIVER" class="driver-fields">
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
          <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="register-password" v-model="form.password" type="password" :placeholder="t('auth.register.passwordPlaceholder')" autocomplete="new-password" minlength="8" required /></div>
        </div>
        <div class="auth-field">
          <label for="register-confirm-password">{{ t('auth.register.confirmPassword') }} <span class="required">*</span></label>
          <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="register-confirm-password" v-model="form.confirmPassword" type="password" :placeholder="t('auth.register.confirmPlaceholder')" autocomplete="new-password" required /></div>
        </div>
        <label class="terms-check"><input v-model="form.acceptedTerms" type="checkbox" /><span>{{ t('auth.register.agreePrefix') }} <button class="legal-link" type="button" @click="showLegalDocument('terms')">{{ t('auth.register.termsLink') }}</button> {{ t('auth.register.agreeJoin') }} <button class="legal-link" type="button" @click="showLegalDocument('privacy')">{{ t('auth.register.privacyLink') }}</button></span></label>
        </div>

        <section v-if="plan && step === 'payment'" class="checkout" aria-live="polite">
          <h3 class="checkout-title">{{ t('auth.checkout.title') }}</h3>
          <p class="checkout-sub">{{ t('auth.checkout.subtitle', { plan: plan.name }) }}</p>
          <p class="auth-local-note">{{ t('auth.checkout.simulated') }}</p>
          <div class="auth-field">
            <label for="card-holder">{{ t('auth.checkout.cardHolder') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-user field-icon" aria-hidden="true" /><input id="card-holder" v-model="card.holder" autocomplete="cc-name" maxlength="60" required /></div>
          </div>
          <div class="auth-field">
            <label for="card-number">{{ t('auth.checkout.cardNumber') }} <span class="required">*</span></label>
            <div class="auth-input-wrap"><i class="pi pi-credit-card field-icon" aria-hidden="true" /><input id="card-number" v-model="card.number" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" maxlength="19" required @input="formatCardNumber" /></div>
          </div>
          <div class="name-grid">
            <div class="auth-field">
              <label for="card-expiry">{{ t('auth.checkout.expiry') }} <span class="required">*</span></label>
              <div class="auth-input-wrap"><i class="pi pi-calendar field-icon" aria-hidden="true" /><input id="card-expiry" v-model="card.expiry" inputmode="numeric" autocomplete="cc-exp" placeholder="08/28" maxlength="5" required @input="formatExpiry" /></div>
            </div>
            <div class="auth-field">
              <label for="card-cvv">{{ t('auth.checkout.cvv') }} <span class="required">*</span></label>
              <div class="auth-input-wrap"><i class="pi pi-lock field-icon" aria-hidden="true" /><input id="card-cvv" v-model="card.cvv" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" required /></div>
            </div>
          </div>
          <div class="checkout-total"><span>{{ t('auth.checkout.total') }}</span><strong>S/ {{ plan.priceMonthly }}</strong></div>
          <button type="button" class="legal-link checkout-back" :disabled="paying" @click="step = 'account'; error = ''">{{ t('auth.checkout.back') }}</button>
        </section>
        <p v-if="error" class="auth-alert" role="alert"><i class="pi pi-exclamation-circle" aria-hidden="true" /><span>{{ errorText(error) }}</span></p>
        <button class="auth-button auth-button-primary" type="submit" :disabled="paying">
          <template v-if="!plan">{{ t('auth.register.submit') }}</template>
          <template v-else-if="step === 'account'">{{ t('auth.register.continueToPayment') }}</template>
          <template v-else-if="paying">{{ t('auth.checkout.processing') }}</template>
          <template v-else>{{ t('auth.checkout.pay', { amount: plan.priceMonthly }) }}</template>
        </button>
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
.auth-local-note { margin: .75rem 0 0; padding: .65rem .75rem; border: 1px solid #bfdbfe; border-radius: 7px; background: #eff6ff; color: #1e3a8a; font-size: .8rem; line-height: 1.45; }
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
.register-fields { display: grid; gap: 1rem; }
.plan-summary { margin-top: 1rem; padding: .85rem 1rem; border: 1px solid #bfdbfe; border-radius: 10px; background: #eff6ff; }
.plan-summary-head { display: grid; grid-template-columns: 1fr auto; align-items: baseline; column-gap: .75rem; }
.plan-kicker { grid-column: 1 / -1; color: #0662bd; font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.plan-name { color: #0f172a; font-size: 1.25rem; }
.plan-price { color: #0f172a; font-size: 1.25rem; font-weight: 700; }
.plan-price small { color: #64748b; font-size: .8rem; font-weight: 500; }
.plan-limit { grid-column: 1 / -1; color: #64748b; font-size: .85rem; }
.plan-switch { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; margin-top: .75rem; padding: 3px; border: 1px solid #dbeafe; border-radius: 8px; background: #fff; }
.plan-switch button { min-height: 34px; border: 0; border-radius: 6px; background: transparent; color: #64748b; font: inherit; font-size: .8rem; font-weight: 600; cursor: pointer; }
.plan-switch button.active { background: #0879e8; color: #fff; }
.plan-owner-note { display: flex; gap: .5rem; margin: 0; color: #64748b; font-size: .8rem; }
.checkout { display: grid; gap: 1rem; }
.checkout-title { margin: 0; color: #0f172a; font-size: 1.15rem; }
.checkout-sub { margin: -.6rem 0 0; color: #64748b; font-size: .9rem; }
.checkout-total { display: flex; justify-content: space-between; padding-top: .75rem; border-top: 1px solid #e2e8f0; color: #0f172a; }
.checkout-back { justify-self: start; font-size: .85rem; }
.auth-button:disabled { opacity: .7; cursor: wait; }
.register-form { display: grid; gap: 1rem; margin-top: 1.25rem; }
.role-fields { display: grid; gap: 1rem; }
.field-example { color: #64748b; font-size: .75rem; }
.auth-field { display: grid; min-width: 0; gap: .35rem; }
.auth-field label, .auth-label { font-size: .875rem; font-weight: 600; }
.required { color: #a52a1c; }
.name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.driver-fields { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: .75rem; }
.driver-fields .auth-field label { display: flex; min-height: 2.5rem; align-items: flex-end; }
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
@media (max-width: 520px) { .name-grid, .driver-fields { grid-template-columns: 1fr; } .driver-fields .auth-field label { min-height: 0; } }
</style>
