import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './assets/main.css'
import App from './app.vue'
import app_router from './router/app.router.js'
import { i18n } from './internationalization/i18n.js'
import { FlotixPreset } from './theme/flotix-preset.js'

const app = createApp(App)

app.use(createPinia())
app.use(app_router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: FlotixPreset,
    options: { darkModeSelector: false, cssLayer: false }
  }
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
