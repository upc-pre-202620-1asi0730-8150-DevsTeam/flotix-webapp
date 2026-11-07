import { defineStore } from 'pinia'

/** Pinia store — tracks whether the initial load from the API succeeded. */
export const useApiStatusStore = defineStore('api-status', {
  state: () => ({
    ready: false,
    loading: false,
    errors: []
  }),
  getters: {
    hasError: (state) => state.errors.length > 0,
    message: (state) => state.errors[0] ?? ''
  }
})
