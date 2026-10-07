import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '../../flotix-webapp/src/assets/main.css'

import App from './app.vue'
import app_router from '../../flotix-webapp/src/router/app.router.js'
import { i18n } from '../../flotix-webapp/src/internationalization/i18n.js'
import { FlotixPreset } from '../../flotix-webapp/src/theme/flotix-preset.js'

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
