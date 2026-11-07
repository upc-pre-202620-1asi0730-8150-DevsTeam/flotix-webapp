import { defineStore } from 'pinia'
import { commerceService } from '../../application/commerce.service.js'

/** Pinia store — Digital Experience / IoT Commerce. Wraps CommerceService (REST API). */
export const useCommerceStore = defineStore('commerce', {
  state: () => ({
    orders: []
  }),
  getters: {
    catalog: () => commerceService.catalog
  },
  actions: {
    async load() {
      this.orders = await commerceService.listOrders()
    },
    async purchaseIoTDevice(payload) {
      try {
        await commerceService.purchaseIoTDevice(payload)
      } finally {
        await this.load()
      }
    },
    async updateOrderStatus(id, status) {
      await commerceService.updateOrderStatus(id, status)
      await this.load()
    }
  }
})
