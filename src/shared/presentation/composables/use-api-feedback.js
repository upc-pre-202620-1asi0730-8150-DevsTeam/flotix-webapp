import { useToast } from 'primevue/usetoast'
import { i18n } from '@/internationalization/i18n.js'

/**
 * Composable that runs an API action and reports its outcome with a toast,
 * so views never need their own try/catch around store calls.
 */
export function useApiFeedback() {
  const toast = useToast()

  function error(e, summary = i18n.global.t('api.actionFailed')) {
    toast.add({ severity: 'error', summary, detail: e?.message ?? String(e), life: 6000 })
  }

  function success(detail, summary = i18n.global.t('api.done')) {
    toast.add({ severity: 'success', summary, detail, life: 3000 })
  }

  /** @returns {Promise<{ok: boolean, value?: any, error?: Error}>} */
  async function run(action, { errorSummary, successMessage } = {}) {
    try {
      const value = await action()
      if (successMessage) success(successMessage)
      return { ok: true, value }
    } catch (e) {
      error(e, errorSummary)
      return { ok: false, error: e }
    }
  }

  return { run, error, success }
}
