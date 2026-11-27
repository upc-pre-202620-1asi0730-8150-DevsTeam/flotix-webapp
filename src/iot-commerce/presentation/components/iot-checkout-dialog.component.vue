<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommerceStore } from '../stores/commerce.store.js'
import { OrderStatus } from '../../domain/model/value-objects/order-status.js'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useTrackingStore } from '@/tracking/presentation/stores/tracking.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { statusLabel, vehicleTypeLabel } from '@/shared/infrastructure/domain-text.js'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: { type: String, default: 'new' }, // 'new' | 'pending-order'
  item: { type: Object, default: null } // { sku, name, unitPrice, quantity, totalAmount, orderId? }
})

const emit = defineEmits(['update:visible', 'install-order', 'view-tracking'])

const { t } = useI18n()
const session = useSessionStore()
const commerce = useCommerceStore()
const fleet = useFleetStore()
const tracking = useTrackingStore()
const { run, success } = useApiFeedback()

const step = ref('payment') // 'payment' | 'confirmed'
const selectedVehicleId = ref('')
const serialPreview = ref('')
const card = ref({ holder: '', number: '', expiry: '', cvv: '' })
const cardError = ref('')
const processing = ref(false)
const receipt = ref(null)

const equippedVehicleIds = computed(() => new Set(tracking.devices.map((d) => d.vehicleId)))
const unequippedVehicles = computed(() =>
  fleet.vehicles
    .filter((v) => !equippedVehicleIds.value.has(v.id))
    .map((v) => ({ id: v.id, plate: v.plate, label: `${v.plate} · ${vehicleTypeLabel(v.vehicleType)}` }))
)
const vehicleOptions = computed(() => [
  { id: '', label: t('commerce.checkout.assignLater') },
  ...unequippedVehicles.value
])

const liveFulfillment = computed(() => (receipt.value ? commerce.fulfillmentByOrder[receipt.value.id] ?? null : null))
const orderStatus = computed(() => liveFulfillment.value?.status ?? receipt.value?.status ?? OrderStatus.IN_PREPARATION)
const linkedDevice = computed(() => liveFulfillment.value?.linkedDevice ?? null)

watch(
  () => props.visible,
  (open) => {
    if (!open || !props.item) return
    step.value = 'payment'
    selectedVehicleId.value = ''
    serialPreview.value = tracking.generateSerialNumber(props.item.sku)
    card.value = { holder: session.user?.name ?? '', number: '', expiry: '', cvv: '' }
    cardError.value = ''
    receipt.value = null
  }
)

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
  const notExpired =
    yy != null &&
    mm >= 1 &&
    mm <= 12 &&
    (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1))
  return card.value.holder.trim().length > 1 && digits.length >= 13 && notExpired && /^\d{3,4}$/.test(card.value.cvv)
}

function close() {
  emit('update:visible', false)
}

async function submitPayment() {
  cardError.value = ''
  if (!cardIsValid()) {
    cardError.value = t('auth.errors.cardInvalid')
    return
  }

  const item = props.item
  const vehicleId = selectedVehicleId.value || null
  const plate = vehicleId ? fleet.byId(vehicleId)?.plate ?? '' : ''
  const serialNumber = vehicleId ? serialPreview.value || tracking.generateSerialNumber(item.sku) : null
  const cardLast4 = card.value.number.replace(/\D/g, '').slice(-4)
  const fallbackOwnerId = (vehicleId ? fleet.byId(vehicleId)?.ownerId : null) ?? fleet.vehicles[0]?.ownerId ?? null

  processing.value = true
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const { ok, value: order } = await run(
    () =>
      props.mode === 'pending-order'
        ? commerce.confirmOrderPayment(item.orderId)
        : commerce.purchaseIoTDevice({
            ownerId: session.actorId ?? session.user?.id,
            fallbackOwnerId,
            sku: item.sku,
            deviceQuantity: item.quantity
          }),
    { errorSummary: t('commerce.purchaseError') }
  )

  processing.value = false
  if (!ok || !order) return

  receipt.value = {
    id: order.id,
    sku: item.sku,
    name: item.name,
    quantity: item.quantity,
    totalAmount: item.totalAmount,
    status: order.status,
    cardLast4
  }
  step.value = 'confirmed'
  success(t('commerce.success', { qty: item.quantity, name: item.name }))

  commerce.scheduleFulfillment(order.id, {
    vehicleId,
    serialNumber,
    plate,
    onInstalled: (device) => success(t('commerce.install.success', { serial: device.serialNumber, plate: device.plate }))
  })
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :closable="!processing"
    :dismissable-mask="!processing"
    :header="step === 'payment' ? t('commerce.checkout.title') : t('commerce.checkout.confirmedTitle')"
    :style="{ width: 'min(94vw, 31rem)' }"
    @update:visible="emit('update:visible', $event)"
  >
    <template v-if="item && step === 'payment'">
      <div class="checkout-box mb-3 flex align-items-center justify-content-between gap-2">
        <div>
          <p class="font-semibold text-heading m-0">{{ item.name }}</p>
          <p class="text-xs text-muted m-0 mt-1">{{ item.quantity }} × S/ {{ item.unitPrice.toFixed(2) }}</p>
        </div>
        <p class="flotix-stat-value m-0" style="font-size: 1.35rem">S/ {{ item.totalAmount.toFixed(2) }}</p>
      </div>

      <form class="flex flex-column gap-3" novalidate @submit.prevent="submitPayment">
        <div v-if="unequippedVehicles.length" class="flex flex-column gap-1">
          <label class="text-sm font-medium text-heading">{{ t('commerce.checkout.assignVehicle') }}</label>
          <Select v-model="selectedVehicleId" :options="vehicleOptions" option-label="label" option-value="id" fluid />
          <small v-if="selectedVehicleId" class="text-xs text-muted">
            {{ t('commerce.checkout.serialPreview', { serial: serialPreview }) }}
          </small>
        </div>

        <div class="flex flex-column gap-1">
          <label for="iot-card-holder" class="text-sm font-medium text-heading">{{ t('auth.checkout.cardHolder') }}</label>
          <InputText id="iot-card-holder" v-model="card.holder" autocomplete="cc-name" maxlength="60" required fluid />
        </div>

        <div class="flex flex-column gap-1">
          <label for="iot-card-number" class="text-sm font-medium text-heading">{{ t('auth.checkout.cardNumber') }}</label>
          <InputText
            id="iot-card-number"
            v-model="card.number"
            inputmode="numeric"
            autocomplete="cc-number"
            placeholder="4242 4242 4242 4242"
            maxlength="19"
            required
            fluid
            @input="formatCardNumber"
          />
        </div>

        <div class="grid">
          <div class="col-6 flex flex-column gap-1">
            <label for="iot-card-expiry" class="text-sm font-medium text-heading">{{ t('auth.checkout.expiry') }}</label>
            <InputText
              id="iot-card-expiry"
              v-model="card.expiry"
              inputmode="numeric"
              autocomplete="cc-exp"
              placeholder="08/28"
              maxlength="5"
              required
              fluid
              @input="formatExpiry"
            />
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label for="iot-card-cvv" class="text-sm font-medium text-heading">{{ t('auth.checkout.cvv') }}</label>
            <InputText
              id="iot-card-cvv"
              v-model="card.cvv"
              inputmode="numeric"
              autocomplete="cc-csc"
              placeholder="123"
              maxlength="4"
              required
              fluid
            />
          </div>
        </div>

        <p v-if="cardError" role="alert" class="checkout-error m-0">
          <i class="pi pi-exclamation-circle" aria-hidden="true" />
          <span>{{ cardError }}</span>
        </p>

        <div class="flex justify-content-end gap-2 pt-2" style="border-top: 1px solid var(--p-surface-200)">
          <Button :label="t('common.cancel')" text severity="secondary" type="button" :disabled="processing" @click="close" />
          <Button
            :label="processing ? t('auth.checkout.processing') : t('commerce.checkout.pay', { amount: item.totalAmount.toFixed(2) })"
            :icon="processing ? 'pi pi-spin pi-spinner' : 'pi pi-lock'"
            type="submit"
            :disabled="processing"
          />
        </div>
      </form>
    </template>

    <template v-else-if="receipt && step === 'confirmed'">
      <div class="flex flex-column gap-3">
        <div class="receipt-banner">
          <span class="receipt-check"><i class="pi pi-check" aria-hidden="true" /></span>
          <div>
            <p class="font-semibold text-heading m-0">{{ t('commerce.checkout.orderPlaced') }}</p>
            <p class="text-xs text-muted m-0 mt-1">
              #{{ String(receipt.id).slice(0, 8).toUpperCase() }} · VISA •••• {{ receipt.cardLast4 }}
            </p>
          </div>
        </div>

        <div class="checkout-box text-sm">
          <div class="flex justify-content-between mb-1">
            <span class="text-muted">{{ t('commerce.cols.product') }}</span>
            <span class="font-semibold text-heading">{{ receipt.quantity }} × {{ receipt.name }}</span>
          </div>
          <div class="flex justify-content-between">
            <span class="text-muted">{{ t('commerce.cols.total') }}</span>
            <span class="font-semibold text-heading">S/ {{ receipt.totalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <div class="fulfillment-track">
          <div class="fulfillment-step done">
            <span class="step-dot"><i class="pi pi-check" /></span>
            <span>{{ t('commerce.checkout.steps.paid') }}</span>
          </div>
          <div class="fulfillment-line" :class="{ filled: orderStatus === OrderStatus.DELIVERED }" />
          <div class="fulfillment-step" :class="orderStatus === OrderStatus.DELIVERED ? 'done' : 'active'">
            <span class="step-dot">
              <i :class="orderStatus === OrderStatus.DELIVERED ? 'pi pi-check' : 'pi pi-spin pi-spinner'" />
            </span>
            <span>{{ statusLabel(OrderStatus.IN_PREPARATION) }}</span>
          </div>
          <div class="fulfillment-line" :class="{ filled: orderStatus === OrderStatus.DELIVERED }" />
          <div class="fulfillment-step" :class="{ done: orderStatus === OrderStatus.DELIVERED }">
            <span class="step-dot"><i class="pi pi-box" /></span>
            <span>{{ statusLabel(OrderStatus.DELIVERED) }}</span>
          </div>
        </div>

        <div v-if="linkedDevice" class="linked-box">
          <i class="pi pi-wifi" style="color: #17663a" aria-hidden="true" />
          <div class="text-sm">
            <p class="font-semibold m-0" style="color: #17663a">{{ t('commerce.install.activeTitle') }}</p>
            <p class="text-xs m-0 mt-1" style="color: #166534">
              {{ linkedDevice.plate }} · S/N {{ linkedDevice.serialNumber }}
            </p>
          </div>
        </div>

        <div class="flex justify-content-end gap-2 pt-2" style="border-top: 1px solid var(--p-surface-200)">
          <Button :label="t('commerce.checkout.close')" text severity="secondary" @click="close" />
          <Button v-if="linkedDevice" :label="t('commerce.viewTracking')" icon="pi pi-map-marker" @click="close(); emit('view-tracking')" />
          <Button
            v-else-if="orderStatus === OrderStatus.DELIVERED && unequippedVehicles.length"
            :label="t('commerce.install.action')"
            icon="pi pi-microchip"
            @click="close(); emit('install-order', receipt)"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.checkout-box { padding: .85rem 1rem; border: 1px solid var(--p-surface-200); border-radius: var(--flotix-radius-panel); background: var(--p-surface-50); }
.checkout-error { display: flex; align-items: flex-start; gap: .5rem; padding: .65rem .8rem; border-radius: var(--flotix-radius-control); background: #fde4e1; color: #a52a1c; font-size: .85rem; font-weight: 500; }
.receipt-banner { display: flex; align-items: center; gap: .75rem; padding: .85rem 1rem; border-radius: var(--flotix-radius-panel); background: #dcf5e7; }
.receipt-check { display: grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 999px; background: #17663a; color: #fff; flex-shrink: 0; }
.fulfillment-track { display: flex; align-items: center; gap: .35rem; padding: .5rem .25rem; }
.fulfillment-step { display: flex; flex-direction: column; align-items: center; gap: .35rem; font-size: .75rem; font-weight: 600; color: var(--p-surface-500); text-align: center; min-width: 5.5rem; }
.fulfillment-step.done { color: #17663a; }
.fulfillment-step.active { color: var(--p-primary-color); }
.step-dot { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; border-radius: 999px; background: var(--p-surface-100); color: var(--p-surface-500); font-size: .75rem; }
.fulfillment-step.done .step-dot { background: #dcf5e7; color: #17663a; }
.fulfillment-step.active .step-dot { background: #e0efff; color: var(--p-primary-color); }
.fulfillment-line { flex: 1; height: 2px; background: var(--p-surface-200); margin-bottom: 1.2rem; transition: background-color .35s ease; }
.fulfillment-line.filled { background: #17663a; }
.linked-box { display: flex; align-items: center; gap: .75rem; padding: .75rem .9rem; border: 1px solid #bbf7d0; border-radius: var(--flotix-radius-control); background: #f0fdf4; }
</style>
