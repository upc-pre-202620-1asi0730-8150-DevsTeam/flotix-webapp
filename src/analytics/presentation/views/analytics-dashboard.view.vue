<script setup>
import { computed } from 'vue'
import { useAnalyticsStore } from '../stores/analytics.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { DEMO_OWNER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatCard from '@/shared/presentation/components/stat-card.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatNumber, localeTag } from '@/internationalization/i18n.js'

const { t } = useI18n()
const session = useSessionStore()
const analytics = useAnalyticsStore()
const { run } = useApiFeedback()
const summary = computed(() => analytics.summary)
const performance = computed(() => analytics.performance)

const maxCost = computed(() => Math.max(1, ...performance.value.map((p) => p.totalCost)))

async function exportReport() {
  // The API generates and stores the report for the last 12 months.
  const to = new Date()
  const from = new Date(to.getFullYear() - 1, to.getMonth(), to.getDate())
  const { ok, value: report } = await run(
    () => analytics.exportReportToPdf({
      ownerId: session.user?.id ?? DEMO_OWNER_ID,
      reportType: t('reports.reportTypeFuel'),
      from,
      to
    }),
    { errorSummary: t('reports.exportError'), successMessage: t('reports.exported') }
  )
  if (!ok) return

  const s = summary.value
  const money = (n) => Number(n).toFixed(2)
  const f = (key, params) => t(`reports.file.${key}`, params)
  const lines = [
    f('title'),
    f('generated', { date: formatDateTime(report.generatedAt) }),
    f('type', { type: report.reportType }),
    f('period', { period: report.filterParams }),
    '',
    f('vehicles', { n: s.totalVehicles }),
    f('fuelSpend', { n: money(s.totalFuelCost) }),
    f('maintenanceSpend', { n: money(s.totalMaintenanceCost) }),
    f('completedMaintenance', { n: s.completedMaintenance }),
    '',
    f('totals', { records: report.totalRecords, liters: money(report.totalQuantity), cost: money(report.totalCost) }),
    ...(report.message ? [report.message] : []),
    ...report.lines.map((l) => '  - ' + f('line', { plate: l.licensePlate, records: l.records, liters: money(l.quantity), cost: money(l.totalCost) })),
    '',
    f('comparison'),
    ...performance.value.map((p) => '  - ' + f('comparisonLine', { plate: p.plate, cost: money(p.totalCost), eff: p.avgEfficiency ?? '—' }))
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = f('fileName', { id: report.id.slice(0, 8) })
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <PageHeader
    context-label="Reporting & Analytics"
    
    :title="t('reports.title')"
    :subtitle="t('reports.subtitle')"
  >
    <template #actions>
      <AppButton @click="exportReport">{{ t('reports.export') }}</AppButton>
    </template>
  </PageHeader>

  <div class="grid mb-3">
    <div class="col-6 md:col-3"><StatCard :label="t('reports.stats.vehicles')" :value="summary.totalVehicles" icon="truck" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('reports.stats.fuel')" :value="`S/ ${summary.totalFuelCost.toFixed(0)}`" icon="fuel" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('reports.stats.maintenance')" :value="`S/ ${summary.totalMaintenanceCost.toFixed(0)}`" icon="wrench" tone="amber" /></div>
    <div class="col-6 md:col-3"><StatCard :label="t('reports.stats.completed')" :value="summary.completedMaintenance" icon="check" /></div>
  </div>

  <div class="rounded-2xl border-subtle shadow-card p-3 mb-3" style="background: var(--p-surface-0)">
    <h2 class="text-sm font-semibold text-heading mb-3">{{ t('reports.fuelByVehicle') }}</h2>
    <EmptyState v-if="!performance.length" icon="chart" :message="t('reports.needMore')" />
    <div v-else class="flex flex-column gap-3">
      <div v-for="p in performance" :key="p.vehicleId" class="flex align-items-center gap-3">
        <span class="text-sm font-medium text-color-secondary flex-shrink-0" style="width: 5rem">{{ p.plate }}</span>
        <div class="flex-1 overflow-hidden border-round-full" style="height: .75rem; background: var(--p-surface-100)">
          <div class="h-full border-round-full" :style="{ width: `${(p.totalCost / maxCost) * 100}%`, background: 'var(--p-primary-color)' }" />
        </div>
        <span class="text-sm text-color-secondary text-right flex-shrink-0" style="width: 6rem">S/ {{ p.totalCost.toFixed(0) }}</span>
        <span class="text-xs text-faint text-right flex-shrink-0" style="width: 5rem">{{ p.avgEfficiency ?? '—' }} km/L</span>
      </div>
    </div>
  </div>

  <div class="rounded-2xl border-subtle shadow-card p-3" style="background: var(--p-surface-0)">
    <h2 class="text-sm font-semibold text-heading mb-2">{{ t('reports.history') }}</h2>
    <EmptyState v-if="!analytics.reports.length" icon="folder" :message="t('reports.emptyHistory')" />
    <ul v-else class="list-none p-0 m-0">
      <li v-for="r in analytics.reports" :key="r.id" class="flex align-items-center justify-content-between py-2 text-sm" style="border-bottom: 1px solid var(--p-surface-100)">
        <span class="text-color-secondary">{{ r.reportType }}</span>
        <span class="text-xs text-faint">{{ formatDateTime(r.generatedAt) }}</span>
      </li>
    </ul>
  </div>
</template>
