<script setup>
import { computed } from 'vue'
import { useSessionStore } from '@/identity-access/presentation/stores/session.store.js'
import { UserRole } from '@/identity-access/domain/model/value-objects/user-role.js'
import OwnerDashboard from './dashboard/owner-dashboard.vue'
import DriverDashboard from './dashboard/driver-dashboard.vue'
import MechanicDashboard from './dashboard/mechanic-dashboard.vue'

// Dispatcher: Flotix ships one dashboard per actor (Owner, Driver,
// Mechanic), each surfacing the data and quick actions relevant to
// that role instead of a one-size-fits-all fleet-management view.
const session = useSessionStore()
const role = computed(() => session.role)
</script>

<template>
  <DriverDashboard v-if="role === UserRole.DRIVER" />
  <MechanicDashboard v-else-if="role === UserRole.MECHANIC" />
  <OwnerDashboard v-else />
</template>
