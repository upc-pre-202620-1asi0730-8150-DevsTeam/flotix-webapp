<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCommerceStore } from '../stores/commerce.store.js'
import { OrderStatus } from '../../domain/model/value-objects/order-status.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useTrackingStore } from '@/tracking/presentation/stores/tracking.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { productLabel } from '@/shared/infrastructure/domain-text.js'

import PageHeader from '@/shared/presentation/components/page-header.component.vue'
import StatusBadge from '@/shared/presentation/components/status-badge.component.vue'
import EmptyState from '@/shared/presentation/components/empty-state.component.vue'
import AppIcon from '@/shared/presentation/components/app-icon.component.vue'
import IotCheckoutDialog from '../components/iot-checkout-dialog.component.vue'
import LinkIotDeviceDialog from '@/tracking/presentation/components/link-iot-device-dialog.component.vue'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const { t } = useI18n()
const router = useRouter()
const commerce = useCommerceStore()
const fleet = useFleetStore()
const tracking = useTrackingStore()
const { run } = useApiFeedback()

const catalog = commerce.catalog
const quantities = ref(Object.fromEntries(catalog.map((p) => [p.sku, 1])))

const checkoutOpen = ref(false)
const checkoutMode = ref('new')
const checkoutItem = ref(null)
const installOpen = ref(false)
const installSku = ref('gps')

const hasUnequippedVehicles = computed(() => {
  const equipped = new Set(tracking.devices.map((d) => d.vehicleId))
  return fleet.vehicles.some((v) => !equipped.has(v.id))
})

function productName(sku) {
  return productLabel(sku, catalog.find((p) => p.sku === sku)?.name ?? sku)
}

function openCheckout(product) {
  const quantity = Math.max(1, Number(quantities.value[product.sku]) || 1)
  checkoutMode.value = 'new'
  checkoutItem.value = {
    sku: product.sku,
    name: productName(product.sku),
    unitPrice: product.unitPrice,
    quantity,
    totalAmount: +(product.unitPrice * quantity).toFixed(2)
  }
  checkoutOpen.value = true
}

function openPendingPayment(order) {
  const sku = order.sku ?? 'gps'
  const unitPrice = order.deviceQuantity ? +(order.totalAmount / order.deviceQuantity).toFixed(2) : order.totalAmount
  checkoutMode.value = 'pending-order'
  checkoutItem.value = {
    orderId: order.id,
    sku,
    name: productName(sku),
    unitPrice,
    quantity: order.deviceQuantity,
    totalAmount: order.totalAmount
  }
  checkoutOpen.value = true
}

function openInstall(order) {
  installSku.value = order?.sku ?? 'gps'
  installOpen.value = true
}

function advance(order) {
  const flow = [OrderStatus.PENDING_PAYMENT, OrderStatus.IN_PREPARATION, OrderStatus.DELIVERED]
  const next = flow[flow.indexOf(order.status) + 1]
  if (!next) return
  run(() => commerce.updateOrderStatus(order.id, next), {
    errorSummary: t('commerce.updateError'),
    successMessage: next === OrderStatus.DELIVERED ? t('commerce.deliveredToast') : undefined
  })
}

function cancelOrder(order) {
  run(() => commerce.updateOrderStatus(order.id, OrderStatus.CANCELLED), {
    errorSummary: t('commerce.updateError'),
    successMessage: t('commerce.cancelledToast')
  })
}
</script>

<template>
  <PageHeader
    context-label="Digital Experience / IoT Commerce"
    :title="t('commerce.title')"
    :subtitle="t('commerce.subtitle')"
  />

  <div class="grid mb-5">
    <div v-for="(p, idx) in catalog" :key="p.sku" class="col-12 sm:col-4">
      <div class="flex flex-column overflow-hidden rounded-2xl border-subtle shadow-card h-full" style="background: var(--p-surface-0)">
        <div class="relative flex align-items-center justify-content-center bg-navy-gradient" style="height: 7.5rem">
          <span
            v-if="idx === 0"
            class="absolute text-xs font-semibold"
            style="top: .75rem; left: .75rem; padding: .15rem .5rem; border-radius: var(--flotix-radius-chip); background: #fff; color: var(--flotix-navy-900)"
          >
            {{ t('commerce.badgeNew') }}
          </span>
          <AppIcon :name="p.iconName" :size="36" style="color: rgba(255,255,255,.9)" />
        </div>
        <div class="flex flex-column flex-1 p-3">
          <p class="font-semibold text-heading m-0">{{ productName(p.sku) }}</p>
          <p class="text-xs text-muted mt-1 mb-2" style="line-height: 1.45">{{ t(`commerce.specs.${p.sku}`) }}</p>
          <p class="flotix-stat-value mt-1 mb-0" style="font-size: 1.375rem">S/ {{ p.unitPrice.toFixed(2) }}</p>
          <div class="flex align-items-center gap-2 pt-3 mt-auto">
            <InputNumber v-model="quantities[p.sku]" :min="1" :max="50" :input-style="{ width: '3.5rem' }" />
            <Button :label="t('commerce.buyNow')" icon="pi pi-shopping-cart" class="flex-1 justify-content-center" @click="openCheckout(p)" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex align-items-center justify-content-between mb-2">
    <h2 class="text-sm font-semibold text-heading m-0">{{ t('commerce.orders') }}</h2>
    <Button v-if="tracking.devices.length" :label="t('commerce.viewTracking')" icon="pi pi-map-marker" text size="small" @click="router.push('/tracking')" />
  </div>

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
          <div class="flex align-items-center gap-1 flex-wrap">
            <template v-if="data.status === OrderStatus.PENDING_PAYMENT">
              <Button :label="t('commerce.payOrder')" icon="pi pi-credit-card" text size="small" @click="openPendingPayment(data)" />
              <Button :label="t('commerce.cancelOrder')" text severity="danger" size="small" @click="cancelOrder(data)" />
            </template>
            <Button v-else-if="data.status === OrderStatus.IN_PREPARATION" :label="t('commerce.confirmDelivery')" icon="pi pi-check" text size="small" @click="advance(data)" />
            <Button v-else-if="data.status === OrderStatus.DELIVERED && hasUnequippedVehicles" :label="t('commerce.install.action')" icon="pi pi-microchip" text size="small" @click="openInstall(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <IotCheckoutDialog
    v-model:visible="checkoutOpen"
    :mode="checkoutMode"
    :item="checkoutItem"
    @install-order="openInstall"
    @view-tracking="router.push('/tracking')"
  />
  <LinkIotDeviceDialog
    v-model:visible="installOpen"
    :sku="installSku"
    show-tracking-link
    @view-tracking="router.push('/tracking')"
  />
</template>
