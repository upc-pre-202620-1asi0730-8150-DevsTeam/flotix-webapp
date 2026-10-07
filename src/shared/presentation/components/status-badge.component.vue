<script setup>
import Tag from 'primevue/tag'

/** StatusBadge — maps a domain status string to a PrimeVue Tag severity. */
const props = defineProps({
  status: { type: String, required: true }
})

const SEVERITY = {
  blue: ['Active', 'Disponible', 'Activo', 'En ruta', 'Conectado', 'Presupuestado'],
  green: ['Completado', 'Aprobado', 'Resuelto', 'Entregado', 'Disponibles'],
  amber: ['En mantenimiento', 'Mantenimiento', 'En revisión', 'Pendiente', 'En preparación', 'En reparación', 'Abierto'],
  red: ['Inactivo', 'Rechazado', 'Crítico', 'Desconectado', 'Cancelado', 'Urgente', 'Fuera de servicio', 'Vencido']
}
const TO_PRIME_SEVERITY = { blue: 'info', green: 'success', amber: 'warn', red: 'danger', gray: 'secondary' }

function toneOf(status) {
  for (const [tone, list] of Object.entries(SEVERITY)) {
    if (list.includes(status)) return tone
  }
  return 'gray'
}

const severity = TO_PRIME_SEVERITY[toneOf(props.status)]
</script>

<template>
  <Tag :value="status" :severity="severity" rounded />
</template>
