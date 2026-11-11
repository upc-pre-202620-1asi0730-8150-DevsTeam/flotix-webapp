<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toggleLocale, formatDateTime } from '@/internationalization/i18n.js'
import { notificationMessage } from '@/shared/infrastructure/domain-text.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { UserRole } from '@/identity-access/domain/model/value-objects/user-role.js'
import { useAlertsStore } from '@/alerts/presentation/stores/alerts.store.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useMaintenanceStore } from '@/maintenance/presentation/stores/maintenance.store.js'
import { MaintenanceStatus } from '@/maintenance/domain/model/value-objects/maintenance-status.js'
import { VehicleStatus } from '@/fleet-management/domain/model/value-objects/vehicle-status.js'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Select from 'primevue/select'
import Drawer from 'primevue/drawer'
import flotixLogoMark from '@/assets/brand/flotix-logo-mark.png'
import { bootstrap } from '@/shared/infrastructure/bootstrap.js'
import { useApiStatusStore } from '@/shared/presentation/stores/api-status.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { API_BASE_URL } from '@/shared/infrastructure/http-client.js'


const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const session = useSessionStore()
const alerts = useAlertsStore()
const fleet = useFleetStore()
const maintenance = useMaintenanceStore()
const apiStatus = useApiStatusStore()
const { run } = useApiFeedback()

// Load every bounded context from the API once the layout is shown, and keep the
// notifications fresh (the API creates them from alerts, incidents, etc.).
let notificationsTimer = null
onMounted(() => {
  bootstrap()
  notificationsTimer = setInterval(() => {
    if (apiStatus.ready && !apiStatus.hasError) alerts.load().catch(() => {})
  }, 30000)
})
onUnmounted(() => clearInterval(notificationsTimer))

function retryConnection() {
  bootstrap(true)
}

const user = computed(() => session.user)
const mobileOpen = ref(false)
const notifPanel = ref(null)

const myNotifications = computed(() =>
  alerts.notifications.filter((n) => n.userId === user.value?.id).slice().sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
)
const unreadCount = computed(() => myNotifications.value.filter((n) => !n.isRead).length)

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'grid', key: 'dashboard', roles: [UserRole.OWNER, UserRole.DRIVER, UserRole.MECHANIC] },
  { to: '/fleet-management', icon: 'truck', key: 'fleet', roles: [UserRole.OWNER] },
  { to: '/drivers', icon: 'users', key: 'drivers', roles: [UserRole.OWNER] },
  { to: '/fuel', icon: 'fuel', key: 'fuel', roles: [UserRole.OWNER, UserRole.DRIVER] },
  { to: '/maintenance', icon: 'wrench', key: 'maintenance', roles: [UserRole.OWNER, UserRole.MECHANIC] },
  { to: '/incidents', icon: 'alert', key: 'incidents', roles: [UserRole.OWNER, UserRole.DRIVER] },
  { to: '/tracking', icon: 'pin', key: 'tracking', roles: [UserRole.OWNER] },
  { to: '/workshops', icon: 'building', key: 'workshops', roles: [UserRole.OWNER] },
  { to: '/reports', icon: 'chart', key: 'reports', roles: [UserRole.OWNER] },
  { to: '/commerce', icon: 'chip', key: 'commerce', roles: [UserRole.OWNER] },
  { to: '/settings', icon: 'gear', key: 'settings', roles: [UserRole.OWNER, UserRole.DRIVER, UserRole.MECHANIC] }
]

const nav = computed(() => {
  const role = user.value?.role ?? UserRole.OWNER
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
    ...item,
    label: t(`nav.${item.key}.label`),
    context: t(`nav.${item.key}.context`)
  }))
})

const sidebarSummary = computed(() => {
  const role = user.value?.role
  if (role === UserRole.DRIVER) {
    const mine = fleet.vehicles.find((v) => v.driverId === user.value.id)
    return { label: t('header.sidebarSummaryDriver'), value: mine?.plate ?? t('header.unassigned'), icon: 'truck' }
  }
  if (role === UserRole.MECHANIC) {
    const pending = maintenance.requests.filter((r) => r.mechanicId === user.value.id && r.status === MaintenanceStatus.PENDING)
    return { label: t('header.sidebarSummaryMechanic'), value: String(pending.length), icon: 'wrench' }
  }
  const available = fleet.vehicles.filter((v) => v.status === VehicleStatus.AVAILABLE).length
  return { label: t('header.sidebarSummaryOwner'), value: `${available}/${fleet.vehicles.length}`, icon: 'truck' }
})

function initials(name) {
  return name?.split(' ').map((w) => w[0]).slice(0, 2).join('') ?? '?'
}

function toggleNotif(event) {
  notifPanel.value.toggle(event)
}
function readNotif(n) {
  if (!n.isRead) run(() => alerts.markNotificationAsRead(n.id), { errorSummary: t('alerts.markReadError') })
}
function readAll() {
  run(() => alerts.markAllAsRead(user.value?.id), { errorSummary: t('alerts.markAllError') })
}

// There is no sign-in: the three actors of the platform are selectable from the header.
const roleOptions = computed(() => Object.values(UserRole).map((value) => ({ value, label: t(`roles.${value}`) })))
const roleLabel = computed(() => t(`roles.${user.value?.role ?? UserRole.OWNER}`))
function changeRole(role) {
  session.switchRole(role)
  router.push('/dashboard') // the current page may not exist for the new profile
}
</script>

<template>
  <div class="flex min-h-screen" style="background: var(--p-surface-50, #f8fafc)">
    <!-- Sidebar (persistent on desktop, off-canvas on mobile) -->
    <aside
      class="fixed left-0 flex flex-column bg-navy-gradient flotix-sidebar"
      :class="mobileOpen ? 'flotix-sidebar-open' : ''"
    >
      <div class="flex flex-column gap-2 px-3 pt-4 pb-3">
        <img :src="flotixLogoMark" alt="Flotix" style="height: 28px; width: auto; max-width: 11rem; object-fit: contain; object-position: left" />
        <p class="text-sm m-0" style="color: rgba(255,255,255,.6)">{{ t('header.tagline') }}</p>
      </div>

      <div class="flex flex-column flex-1 overflow-y-auto">
        <nav class="flex flex-column gap-1 px-2">
          <router-link
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flotix-nav-link"
            :class="route.path.startsWith(item.to) ? 'flotix-nav-link-active' : ''"
            @click="mobileOpen = false"
          >
            <AppIcon :name="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="flex align-items-baseline justify-content-between mx-3 mt-3 pt-3" style="border-top: 1px solid rgba(255,255,255,.12)">
          <p class="text-sm m-0" style="color: rgba(255,255,255,.6)">{{ sidebarSummary.label }}</p>
          <p class="flotix-sidebar-figure m-0">{{ sidebarSummary.value }}</p>
        </div>
      </div>

      <div class="p-2" style="border-top: 1px solid rgba(255,255,255,.1)">
        <button
          type="button"
          class="flotix-lang-toggle flotix-lang-toggle-drawer"
          :aria-label="'Language: ' + (locale === 'en' ? 'English' : 'Español')"
          @click="toggleLocale()"
        >
          <span :class="{ active: locale === 'en' }">EN</span>
          <span :class="{ active: locale === 'es' }">ES</span>
        </button>
        <div class="flex align-items-center gap-2 border-round p-2">
          <Avatar :label="initials(user?.name)" shape="circle" style="background: rgba(255,255,255,.14); color: #fff; font-size: .75rem; font-weight: 600" />
          <div class="min-w-0" style="line-height: 1.2">
            <p class="text-sm font-semibold m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis" style="color: #fff; max-width: 10rem">{{ user?.name }}</p>
            <p class="text-xs m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis" style="color: rgba(255,255,255,.6); max-width: 10rem">
              {{ user?.companyName || user?.workshopName || roleLabel }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <div v-if="mobileOpen" class="fixed top-0 left-0 w-full h-full" style="background: rgba(15,23,42,.4); z-index: 30" @click="mobileOpen = false" />

    <!-- Main column -->
    <div class="flex flex-column flex-1 min-h-screen flotix-main">
      <header class="sticky top-0 flex align-items-center justify-content-between px-3 py-2" style="z-index: 20; background: var(--p-surface-0); border-bottom: 1px solid var(--p-surface-200)">
        <div class="flex align-items-center gap-2">
          <Button icon="pi pi-bars" text rounded class="flotix-mobile-toggle" aria-label="Menu" @click="mobileOpen = true" />
          <div class="text-sm text-muted flotix-context-label">
            {{ nav.find(n => route.path.startsWith(n.to))?.context || t('header.platform') }}
          </div>
        </div>
        <div class="flex align-items-center gap-2">
          <button
            type="button"
            class="flotix-lang-toggle"
            :aria-label="'Language: ' + (locale === 'en' ? 'English' : 'Español')"
            @click="toggleLocale()"
          >
            <span :class="{ active: locale === 'en' }">EN</span>
            <span :class="{ active: locale === 'es' }">ES</span>
          </button>

          <span class="text-xs text-muted flotix-context-label">{{ t('roleSwitcher.label') }}</span>
          <Select
            :model-value="user?.role"
            :options="roleOptions"
            option-label="label"
            option-value="value"
            size="small"
            :aria-label="t('roleSwitcher.label')"
            @update:model-value="changeRole"
          />

          <Button text rounded severity="secondary" :aria-label="t('notifications.title')" @click="toggleNotif">
            <template #icon>
              <span class="relative">
                <AppIcon name="bell" :size="19" />
                <span v-if="unreadCount" class="flotix-notif-dot" />
              </span>
            </template>
          </Button>
          <Popover ref="notifPanel" style="width: 22rem">
            <div class="flex align-items-center justify-content-between mb-2">
              <p class="text-sm font-bold m-0 text-heading">{{ t('notifications.title') }}</p>
              <button v-if="unreadCount" type="button" class="flotix-link text-xs" @click="readAll">{{ t('notifications.markAllRead') }}</button>
            </div>
            <div style="max-height: 20rem; overflow-y: auto">
              <p v-if="!myNotifications.length" class="text-sm text-muted text-center py-4 m-0">{{ t('notifications.empty') }}</p>
              <button
                v-for="n in myNotifications.slice(0, 8)"
                :key="n.id"
                type="button"
                class="flotix-notif-item"
                @click="readNotif(n)"
              >
                <span class="flotix-notif-bullet" :style="{ background: n.isRead ? 'transparent' : 'var(--p-primary-color)' }" />
                <span class="min-w-0 flex-1 text-left">
                  <span class="block text-xs" :style="{ color: n.isRead ? 'var(--p-surface-500)' : 'var(--p-surface-800)', fontWeight: n.isRead ? 400 : 600 }">{{ notificationMessage(n.message) }}</span>
                  <span class="block text-xs text-faint mt-1">{{ formatDateTime(n.sentAt) }}</span>
                </span>
              </button>
            </div>
            <router-link to="/alerts" class="flotix-link text-xs block text-center pt-2 mt-2" style="border-top: 1px solid var(--p-surface-200)" @click="notifPanel.hide()">
              {{ t('notifications.viewAll') }}
            </router-link>
          </Popover>

          <div class="text-right flotix-user-summary" style="line-height: 1.2">
            <p class="text-sm font-semibold m-0 text-heading">{{ user?.name }}</p>
            <p class="text-xs m-0 text-faint">{{ user?.companyName || user?.workshopName || roleLabel }}</p>
          </div>
          <Avatar :label="user?.name?.charAt(0) ?? '?'" shape="circle" style="background: var(--p-primary-100); color: var(--p-primary-700); font-weight: 700" />
        </div>
      </header>

      <main class="flex-1 p-3 lg:p-4">
        <div
          v-if="apiStatus.ready && apiStatus.hasError"
          class="flex align-items-center gap-3 p-3 mb-3 border-round-xl"
          style="background: var(--p-red-50, #fef2f2); border: 1px solid var(--p-red-200, #fecaca); color: var(--p-red-700, #b91c1c)"
        >
          <i class="pi pi-exclamation-triangle"></i>
          <div class="flex-1 text-sm">
            <strong>{{ t('api.loadErrorTitle') }}</strong> {{ apiStatus.message }}
            <span class="block text-xs mt-1" style="opacity: .8">{{ t('api.apiAddress') }}: {{ API_BASE_URL }}</span>
          </div>
          <Button :label="t('api.retry')" size="small" severity="danger" outlined @click="retryConnection" />
        </div>
        <div v-if="!apiStatus.ready" class="flex align-items-center justify-content-center gap-2 p-6" style="color: var(--p-surface-500)">
          <i class="pi pi-spin pi-spinner"></i> {{ t('common.loading') }}
        </div>
        <router-view v-else />
      </main>
    </div>
  </div>
</template>

<style scoped>
.flotix-sidebar {
  top: 0;
  bottom: 0;
  width: 16rem;
  z-index: 40;
  transform: translateX(-100%);
  transition: transform .28s var(--flotix-ease-drawer);
}
.flotix-sidebar-open { transform: translateX(0); }
.flotix-main { margin-left: 0; min-width: 0; }

.flotix-nav-link {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .6rem .75rem;
  border-radius: var(--flotix-radius-control);
  font-size: .9375rem;
  font-weight: 500;
  color: rgba(255, 255, 255, .72);
  text-decoration: none;
  transition: background-color .15s ease, color .15s ease;
}
@media (hover: hover) {
  .flotix-nav-link:hover { background: rgba(255, 255, 255, .07); color: #fff; }
}
.flotix-nav-link:focus-visible { outline-color: #fff; outline-offset: -2px; }
.flotix-nav-link-active,
.flotix-nav-link-active:hover { background: var(--p-primary-color); color: #fff; }

.flotix-sidebar-figure {
  font-family: var(--flotix-font-display);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: .03em;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.flotix-notif-dot {
  position: absolute; top: -1px; right: -2px;
  width: 8px; height: 8px; border-radius: 999px;
  background: #ef4444; box-shadow: 0 0 0 2px #fff;
}
.flotix-notif-item {
  display: flex; align-items: flex-start; gap: .6rem; width: 100%;
  padding: .6rem 0; background: none; border: 0; border-bottom: 1px solid var(--p-surface-100);
  cursor: pointer; font-family: inherit;
}
.flotix-notif-item:last-child { border-bottom: 0; }
.flotix-notif-item:hover { background: var(--p-surface-50); }
.flotix-notif-bullet { margin-top: .3rem; width: 6px; height: 6px; border-radius: 999px; flex-shrink: 0; }

.flotix-lang-toggle {
  display: none;
  align-items: center;
  gap: .15rem;
  border: 1px solid var(--p-surface-200);
  border-radius: 999px;
  padding: 2px;
  background: none;
  cursor: pointer;
}
.flotix-lang-toggle span { padding: .15rem .5rem; border-radius: 999px; font-size: .75rem; font-weight: 600; color: var(--p-surface-600); transition: background-color .15s ease, color .15s ease; }
.flotix-lang-toggle span.active { background: var(--p-surface-900); color: #fff; }

.flotix-lang-toggle-drawer { display: inline-flex; margin: .25rem .5rem .5rem; border-color: rgba(255, 255, 255, .25); }
.flotix-lang-toggle-drawer span { color: rgba(255, 255, 255, .72); }
.flotix-lang-toggle-drawer span.active { background: #fff; color: var(--flotix-navy-900); }

.flotix-mobile-toggle { display: inline-flex; }
.flotix-context-label, .flotix-user-summary { display: none; }

@media screen and (min-width: 992px) {
  .flotix-sidebar { transform: none; }
  .flotix-main { margin-left: 16rem; }
  .flotix-mobile-toggle { display: none; }
  .flotix-context-label { display: block; }
  .flotix-user-summary { display: block; }
  .flotix-lang-toggle { display: flex; }
  .flotix-lang-toggle-drawer { display: none; }
}
</style>
