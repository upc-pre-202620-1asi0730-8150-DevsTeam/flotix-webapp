<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toggleLocale } from '@/internationalization/i18n.js'
import { useSessionStore } from '../stores/session.store.js'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import flotixLogoMark from '@/assets/brand/flotix-logo-mark.png'
import flotixIcon from '@/assets/brand/flotix-icon.png'
import GoogleAccountPicker from '../components/google-account-picker.component.vue'

const router = useRouter()
const { t, tm, locale } = useI18n()
const session = useSessionStore()
const email = ref('')
const password = ref('')
const error = ref('')
const googlePickerOpen = ref(false)

function submit() {
  error.value = ''
  try {
    session.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  }
}

function selectGoogleAccount(account) {
  googlePickerOpen.value = false
  if (account.existing) {
    email.value = account.email
    password.value = 'Owner123'
    submit()
    return
  }
  router.push({ path: '/register', query: { email: account.email, name: account.name } })
}
</script>

<template>
  <div class="grid m-0 min-h-screen">
    <!-- Hero panel -->
    <div class="hidden lg:flex col-6 flex-column justify-content-between bg-navy-gradient p-6 relative overflow-hidden">
      <div class="flex align-items-center gap-2">
        <img :src="flotixLogoMark" alt="Flotix" style="height: 32px; width: auto; max-width: 12.5rem; object-fit: contain; object-position: left" />
      </div>

      <div class="relative z-1">
        <h1 class="text-5xl font-bold text-white m-0 line-height-3" style="letter-spacing: -0.02em">{{ t('auth.brand') }}</h1>
        <p class="text-sm mt-3" style="color: rgba(255,255,255,.6); max-width: 26rem; line-height: 1.6">{{ t('auth.brandSubtitle') }}</p>
        <ul class="list-none p-0 mt-5 flex flex-column gap-3">
          <li v-for="f in tm('auth.features')" :key="f" class="flex align-items-center gap-3 text-sm font-medium" style="color: rgba(255,255,255,.8)">
            <span class="flex align-items-center justify-content-center border-round" style="width: 1.75rem; height: 1.75rem; background: rgba(255,255,255,.1); color: #fff">
              <AppIcon name="truck" :size="15" />
            </span>
            {{ f }}
          </li>
        </ul>
      </div>

      <div>
        <p class="text-xs relative z-1 m-0" style="color: rgba(255,255,255,.55)">{{ t('auth.prototype') }}</p>
        <p class="text-xs relative z-1 mt-2 mb-0" style="color: rgba(255,255,255,.3)">© 2026 Flotix, UPC Developers Team</p>
      </div>
    </div>

    <!-- Form panel -->
    <div class="col-12 lg:col-6 flex flex-column justify-content-center px-4 py-6 sm:px-7">
      <div class="mx-auto w-full" style="max-width: 24rem">
        <div class="flex align-items-center justify-content-between lg:justify-content-end mb-5">
          <div class="flex lg:hidden align-items-center gap-2">
            <img :src="flotixIcon" alt="Flotix" style="height: 2rem; width: 2rem; object-fit: contain" />
            <p class="font-bold text-heading m-0">FLOTIX</p>
          </div>
          <button type="button" class="flotix-lang-toggle-inline" @click="toggleLocale()">
            <span :class="{ active: locale === 'en' }">EN</span>
            <span :class="{ active: locale === 'es' }">ES</span>
          </button>
        </div>

        <h2 class="text-2xl font-bold text-heading m-0" style="letter-spacing: -0.02em">{{ t('auth.login.title') }}</h2>
        <p class="text-sm text-muted mt-1">{{ t('auth.login.subtitle') }}</p>

        <form class="flex flex-column gap-3 mt-4" @submit.prevent="submit">
          <Button type="button" severity="secondary" outlined class="w-full justify-content-center py-3" @click="googlePickerOpen = true">
            <template #icon><i class="pi pi-google" aria-hidden="true" /></template>
            <span>{{ t('auth.login.google') }}</span>
          </Button>
          <div class="auth-divider"><span>{{ t('auth.login.orEmail') }}</span></div>
          <div class="flex flex-column gap-1">
            <label for="login-email" class="text-sm font-medium text-heading">{{ t('auth.login.email') }} <span class="text-red-500">*</span></label>
            <InputText id="login-email" v-model="email" type="email" autocomplete="username" required fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label for="login-password" class="text-sm font-medium text-heading">{{ t('auth.login.password') }} <span class="text-red-500">*</span></label>
            <Password input-id="login-password" v-model="password" :feedback="false" toggle-mask fluid autocomplete="current-password" required />
          </div>
          <p v-if="error" role="alert" class="text-sm p-2 border-round m-0" style="background: #fef2f2; color: #b91c1c">{{ t(error) }}</p>
          <Button type="submit" :label="t('auth.login.submit')" class="w-full justify-content-center py-3" />
        </form>

        <p class="text-xs text-muted mt-4 mb-0 line-height-3">{{ t('auth.login.demoHint') }}<br />
          owner@flotix.pe / Owner123 · driver@flotix.pe / Driver123 · mechanic@flotix.pe / Mechanic123
        </p>

        <p class="text-sm text-muted text-center mt-4">
          {{ t('auth.login.noAccount') }}
          <router-link to="/register" class="flotix-link">{{ t('auth.login.register') }}</router-link>
        </p>
      </div>
    </div>
    <GoogleAccountPicker v-model="googlePickerOpen" @select="selectGoogleAccount" />
  </div>
</template>

<style scoped>
.flotix-lang-toggle-inline {
  display: flex; align-items: center; gap: .15rem;
  border: 1px solid var(--p-surface-200); border-radius: 999px; padding: 2px;
  background: none; cursor: pointer;
}
.flotix-lang-toggle-inline span { padding: .15rem .5rem; border-radius: 999px; font-size: .7rem; font-weight: 700; color: var(--p-surface-900); }
.flotix-lang-toggle-inline span.active { background: var(--p-surface-900); color: #fff; }
.auth-divider { display: flex; align-items: center; gap: .75rem; color: var(--p-surface-500); font-size: .75rem; }
.auth-divider::before, .auth-divider::after { content: ''; height: 1px; flex: 1; background: var(--p-surface-200); }
</style>
