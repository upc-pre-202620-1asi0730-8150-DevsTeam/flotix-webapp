<script setup>
import { ref } from 'vue'
import { useCommerceStore } from '../stores/commerce.store.js'
import { OrderStatus } from '../../domain/model/value-objects/order-status.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { DEMO_OWNER_ID } from '@/identity-access/domain/model/value-objects/demo-users.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import AppButton from '@/shared/presentation/components/app-button.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useI18n } from 'vue-i18n'
import { statusLabel, productLabel } from '@/shared/infrastructure/domain-text.js'

const { t } = useI18n()
const session = useSessionStore()
const commerce = useCommerceStore()
const { run } = useApiFeedback()
const catalog = commerce.catalog
const quantities = ref(Object.fromEntries(catalog.map((p) => [p.sku, 1])))
const successMsg = ref('')

async function buy(product) {
  const quantity = quantities.value[product.sku]
  const { ok } = await run(
    () => commerce.purchaseIoTDevice({ ownerId: session.user?.id ?? DEMO_OWNER_ID, sku: product.sku, deviceQuantity: quantity }),
    { errorSummary: t('commerce.purchaseError') }
  )
  if (!ok) return
  successMsg.value = t('commerce.success', { qty: quantity, name: productLabel(product.sku, product.name) })
  setTimeout(() => (successMsg.value = ''), 4000)
}

function productName(sku) {
  return productLabel(sku, catalog.find((p) => p.sku === sku)?.name ?? sku)
}

function advance(order) {
  const flow = [OrderStatus.PENDING_PAYMENT, OrderStatus.IN_PREPARATION, OrderStatus.DELIVERED]
  const next = flow[flow.indexOf(order.status) + 1]
  if (!next) return
  run(() => commerce.updateOrderStatus(order.id, next), { errorSummary: t('commerce.updateError') })
}
</script>

<template>
  <PageHeader
    context-label="Digital Experience / IoT Commerce"
    
    :title="t('commerce.title')"
    :subtitle="t('commerce.subtitle')"
  />

  <p v-if="successMsg" role="status" class="flex align-items-center gap-2 text-sm px-3 py-2 border-round-lg mb-3" style="background: #dcf5e7; color: #17663a">
    <i class="pi pi-check" aria-hidden="true" />{{ successMsg }}
  </p>

  <div class="grid mb-5">
    <div v-for="(p, idx) in catalog" :key="p.sku" class="col-12 sm:col-4">
      <div class="flex flex-column overflow-hidden rounded-2xl border-subtle shadow-card h-full" style="background: var(--p-surface-0)">
        <div class="relative flex align-items-center justify-content-center bg-navy-gradient" style="height: 7rem">
          <span v-if="idx === 0" class="absolute text-xs font-semibold" style="top: .75rem; left: .75rem; padding: .1rem .45rem; border-radius: var(--flotix-radius-chip); background: #fff; color: var(--flotix-navy-900)">{{ t('commerce.badgeNew') }}</span>
          <AppIcon :name="p.iconName" :size="34" style="color: rgba(255,255,255,.85)" />
        </div>
        <div class="flex flex-column flex-1 p-3">
          <p class="font-semibold text-heading m-0">{{ productName(p.sku) }}</p>
          <p class="flotix-stat-value mt-1 mb-0" style="font-size: 1.375rem">S/ {{ p.unitPrice.toFixed(2) }}</p>
          <div class="flex align-items-center gap-2 pt-3 mt-auto">
            <InputNumber v-model="quantities[p.sku]" :min="1" :input-style="{ width: '3.5rem' }" />
            <Button :label="t('commerce.buyNow')" class="flex-1 justify-content-center" @click="buy(p)" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <h2 class="text-sm font-semibold text-heading mt-0 mb-2">{{ t('commerce.orders') }}</h2>
  <EmptyState v-if="!commerce.orders.length" icon="cart" :message="t('commerce.emptyOrders')" />
  <div v-else class="rounded-2xl border-subtle shadow-card overflow-hidden" style="background: var(--p-surface-0)">
    <DataTable :value="commerce.orders" data-key="id" striped-rows responsive-layout="scroll">
      <Column field="orderDate" :header="t('commerce.cols.date')" />
      <Column :header="t('commerce.cols.product')">
        <template #body="{ data }">{{ productName(data.sku) }}</template>
      </Column>
      <Column field="deviceQuantity" :header="t('commerce.cols.quantity')" />
      <Column :header="t('commerce.cols.total')">
        <template #body="{ data }">S/ {{ data.totalAmount.toFixed(2) }}</template>
      </Column>
      <Column :header="t('commerce.cols.status')">
        <template #body="{ data }"><StatusBadge :status="data.status" /></template>
      </Column>
      <Column :header="t('common.actions')">
        <template #body="{ data }">
          <Button
            v-if="data.status !== 'Entregado' && data.status !== 'Cancelado'"
            :label="t('commerce.advance')"
            text
            size="small"
            @click="advance(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
