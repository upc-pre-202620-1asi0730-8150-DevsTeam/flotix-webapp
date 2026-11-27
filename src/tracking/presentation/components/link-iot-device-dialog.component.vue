<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFleetStore } from '@/fleet-management/presentation/stores/fleet.store.js'
import { useTrackingStore } from '../stores/tracking.store.js'
import { useApiFeedback } from '@/shared/presentation/composables/use-api-feedback.js'
import { vehicleTypeLabel } from '@/shared/infrastructure/domain-text.js'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  sku: { type: String, default: 'gps' },
  showTrackingLink: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'linked', 'view-tracking'])

const { t } = useI18n()
const fleet = useFleetStore()
const tracking = useTrackingStore()
const { run } = useApiFeedback()

const vehicleId = ref('')
const serialNumber = ref('')
const errorMsg = ref('')
const submitting = ref(false)

const unequippedVehicles = computed(() => {
  const equipped = new Set(tracking.devices.map((d) => d.vehicleId))
  return fleet.vehicles
    .filter((v) => !equipped.has(v.id))
    .map((v) => ({ id: v.id, plate: v.plate, label: `${v.plate} · ${vehicleTypeLabel(v.vehicleType)}` }))
})

watch(
  () => props.visible,
  (open) => {
    if (!open) return
    vehicleId.value = unequippedVehicles.value[0]?.id ?? ''
    serialNumber.value = tracking.generateSerialNumber(props.sku)
    errorMsg.value = ''
  }
)

function close() {
  emit('update:visible', false)
}

async function submit() {
  errorMsg.value = ''
  const serial = serialNumber.value.trim().toUpperCase()
  if (!vehicleId.value) {
    errorMsg.value = t('commerce.install.vehicleRequired')
    return
  }
  if (!/^[A-Z0-9-]+$/.test(serial)) {
    errorMsg.value = t('commerce.install.serialInvalid')
    return
  }

  submitting.value = true
  const plate = fleet.byId(vehicleId.value)?.plate ?? ''
  const { ok, value: device } = await run(
    () => tracking.connectIoTDevice({ vehicleId: vehicleId.value, serialNumber: serial, connectionStatus: 'Conectado' }),
    { errorSummary: t('commerce.install.error'), successMessage: t('commerce.install.success', { serial, plate }) }
  )
  submitting.value = false
  if (ok) {
    close()
    emit('linked', { device, plate })
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="t('commerce.install.title')"
    :style="{ width: 'min(94vw, 27rem)' }"
    @update:visible="emit('update:visible', $event)"
  >
    <p class="text-sm text-muted mt-0 mb-3">{{ t('commerce.install.subtitle') }}</p>
    <form v-if="unequippedVehicles.length" class="flex flex-column gap-3" novalidate @submit.prevent="submit">
      <div class="flex flex-column gap-1">
        <label class="text-sm font-medium text-heading">{{ t('commerce.install.vehicle') }}</label>
        <Select v-model="vehicleId" :options="unequippedVehicles" option-label="label" option-value="id" fluid />
      </div>
      <div class="flex flex-column gap-1">
        <label for="iot-link-serial" class="text-sm font-medium text-heading">{{ t('commerce.install.serial') }}</label>
        <InputText id="iot-link-serial" v-model="serialNumber" maxlength="100" required fluid />
        <small class="text-xs text-muted">{{ t('commerce.install.serialHint') }}</small>
      </div>
      <p v-if="errorMsg" role="alert" class="link-dialog-error m-0">
        <i class="pi pi-exclamation-circle" aria-hidden="true" />
        <span>{{ errorMsg }}</span>
      </p>
      <div class="flex justify-content-end gap-2 pt-2" style="border-top: 1px solid var(--p-surface-200)">
        <Button :label="t('common.cancel')" text severity="secondary" type="button" :disabled="submitting" @click="close" />
        <Button
          :label="t('commerce.install.submit')"
          :icon="submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          type="submit"
          :disabled="submitting"
        />
      </div>
    </form>
    <div v-else class="flex flex-column gap-3">
      <p class="text-sm text-muted m-0">{{ t('commerce.install.allEquipped') }}</p>
      <div class="flex justify-content-end gap-2">
        <Button :label="t('commerce.checkout.close')" text severity="secondary" @click="close" />
        <Button v-if="showTrackingLink" :label="t('commerce.viewTracking')" icon="pi pi-map-marker" @click="close(); emit('view-tracking')" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.link-dialog-error {
  display: flex;
  align-items: flex-start;
  gap: .5rem;
  padding: .65rem .8rem;
  border-radius: var(--flotix-radius-control);
  background: #fde4e1;
  color: #a52a1c;
  font-size: .85rem;
  font-weight: 500;
}
</style>
