import { defineStore } from 'pinia'
import { commerceService } from '../../application/commerce.service.js'

/** Pinia store — Digital Experience / IoT Commerce. Wraps CommerceService. */
export const useCommerceStore = defineStore('commerce', {
  state: () => ({
    orders: commerceService.listOrders()
  }),
  getters: {
    catalog: () => commerceService.catalog
  },
  actions: {
    refresh() {
      this.orders = commerceService.listOrders()
    },
    purchaseIoTDevice(payload) {
      commerceService.purchaseIoTDevice(payload)
      this.refresh()
    },
    updateOrderStatus(id, status) {
      commerceService.updateOrderStatus(id, status)
      this.refresh()
    }
  }
})
