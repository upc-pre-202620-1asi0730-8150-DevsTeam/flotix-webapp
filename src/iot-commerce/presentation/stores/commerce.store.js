import { defineStore } from 'pinia'
import { commerceService } from '../../application/commerce.service.js'
import { OrderStatus } from '../../domain/model/value-objects/order-status.js'
import { useTrackingStore } from '@/tracking/presentation/stores/tracking.store.js'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'

const pendingTimers = new Map()

/** Pinia store — Digital Experience / IoT Commerce. Wraps CommerceService (REST API). */
export const useCommerceStore = defineStore('commerce', {
  state: () => ({
    orders: [],
    fulfillmentByOrder: {}
  }),
  getters: {
    catalog: () => commerceService.catalog
  },
  actions: {
    async load() {
      const ownerId = useSessionStore().scopedOwnerId
      this.orders = await commerceService.listOrders(ownerId)
    },
    async purchaseIoTDevice(payload) {
      let order = null
      try {
        order = await commerceService.purchaseIoTDevice(payload)
      } finally {
        await this.load()
      }
      return order
    },
    async confirmOrderPayment(id) {
      let order = null
      try {
        order = await commerceService.confirmOrderPayment(id)
      } finally {
        await this.load()
      }
      return order
    },
    async updateOrderStatus(id, status) {
      let order = null
      try {
        order = await commerceService.updateOrderStatus(id, status)
      } finally {
        await this.load()
      }
      return order
    },
    /**
     * Completes order fulfillment (and optional device installation) at store level
     * so closing the checkout modal or navigating away never cancels delivery.
     */
    scheduleFulfillment(orderId, { vehicleId = null, serialNumber = null, plate = '', onInstalled = null, delayMs = 5500 } = {}) {
      if (pendingTimers.has(orderId)) clearTimeout(pendingTimers.get(orderId))
      this.fulfillmentByOrder = {
        ...this.fulfillmentByOrder,
        [orderId]: { status: OrderStatus.IN_PREPARATION, linkedDevice: null }
      }

      const timerId = setTimeout(async () => {
        pendingTimers.delete(orderId)
        try {
          const updated = await this.updateOrderStatus(orderId, OrderStatus.DELIVERED)
          const current = this.fulfillmentByOrder[orderId] ?? {}
          this.fulfillmentByOrder = {
            ...this.fulfillmentByOrder,
            [orderId]: { ...current, status: updated?.status ?? OrderStatus.DELIVERED }
          }

          if (vehicleId && serialNumber) {
            const tracking = useTrackingStore()
            const alreadyEquipped = tracking.devices.some((d) => d.vehicleId === vehicleId)
            if (!alreadyEquipped) {
              const device = await tracking.connectIoTDevice({
                vehicleId,
                serialNumber,
                connectionStatus: 'Conectado'
              })
              const linkedDevice = { ...device, plate }
              this.fulfillmentByOrder = {
                ...this.fulfillmentByOrder,
                [orderId]: { ...this.fulfillmentByOrder[orderId], linkedDevice }
              }
              if (typeof onInstalled === 'function') onInstalled(linkedDevice)
            }
          }
        } catch {
          // Order remains manageable manually from the order history table.
        }
      }, delayMs)

      pendingTimers.set(orderId, timerId)
    }
  }
})
