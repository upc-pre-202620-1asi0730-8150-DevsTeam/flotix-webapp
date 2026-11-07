/**
 * Loads a small demo data set into the Flotix API (vehicles, fuel records, an incident,
 * a maintenance request, devices and an order) so the screens are not empty.
 *
 *   npm run seed                      # uses VITE_API_BASE_URL or http://localhost:5223
 *   npm run seed -- https://my-api    # explicit API address
 *   npm run seed -- --force           # seed even if vehicles already exist
 *
 * It only sends data through the public REST API; it contains no credentials.
 */
const OWNER = '11111111-1111-4111-8111-111111111111'
const DRIVER = '22222222-2222-4222-8222-222222222222'
const MECHANIC = '33333333-3333-4333-8333-333333333333'

const args = process.argv.slice(2)
const force = args.includes('--force')
const base = (args.find((a) => a.startsWith('http')) || process.env.VITE_API_BASE_URL || 'http://localhost:5223').replace(/\/+$/, '')
const api = `${base}/api/v1`

async function call(method, path, body) {
  const res = await fetch(`${api}/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept-Language': 'es-PE' },
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${path} -> HTTP ${res.status}: ${text.slice(0, 200)}`)
  return text ? JSON.parse(text) : null
}

const day = (d) => `${d}T12:00:00Z`

try {
  const existing = await call('GET', 'vehicles')
  if (existing.length && !force) {
    console.log(`La API ya tiene ${existing.length} vehículo(s). Usa --force para cargar los datos de demo igualmente.`)
    process.exit(0)
  }

  const truck = await call('POST', 'vehicles', { ownerId: OWNER, driverId: DRIVER, licensePlate: 'V4A-123', vehicleType: 'Camión de carga', currentMileage: 48200, status: 'Disponible' })
  await call('POST', 'vehicles', { ownerId: OWNER, driverId: null, licensePlate: 'ABC-908', vehicleType: 'Camioneta', currentMileage: 21750, status: 'Disponible' })
  const moto = await call('POST', 'vehicles', { ownerId: OWNER, driverId: DRIVER, licensePlate: 'MTX-556', vehicleType: 'Mototaxi', currentMileage: 15320, status: 'Disponible' })

  for (const [vehicleId, liters, cost, km, date] of [
    [truck.id, 45, 288.5, 47800, '2026-08-20'],
    [truck.id, 42, 269.1, 48200, '2026-09-01'],
    [moto.id, 12, 79.9, 15320, '2026-09-05']
  ]) {
    await call('POST', 'fuel-records', { vehicleId, driverId: DRIVER, liters, cost, mileageAtRefill: km, recordedDate: day(date) })
  }

  await call('POST', 'incidents', { vehicleId: truck.id, driverId: DRIVER, description: 'Luz de check engine encendida en ruta', status: 'Abierto' })
  await call('POST', 'maintenance-requests', { vehicleId: truck.id, mechanicId: MECHANIC, description: 'Ruido en la suspensión delantera' })

  const alert = await call('POST', 'alerts', { vehicleId: moto.id, alertType: 'Mantenimiento próximo (90% de kilometraje)' })
  await call('POST', 'notifications', { userId: OWNER, alertId: alert.id, message: 'El vehículo MTX-556 alcanzó el 90% del kilometraje de revisión preventiva.' })

  await call('POST', 'iot-devices', { vehicleId: truck.id, serialNumber: 'FLX-GPS-0001', isConnected: true })
  await call('POST', 'iot-devices', { vehicleId: moto.id, serialNumber: 'FLX-GPS-0002', isConnected: true })

  const order = await call('POST', 'iot-orders', { ownerId: OWNER, quantity: 2, totalAmount: 299.8 })
  await call('PUT', `iot-orders/${order.id}`, { status: 'Entregado' })

  console.log(`Datos de demo cargados en ${api}`)
  console.log('Abre la app y elige el perfil (Owner / Driver / Mechanic) desde el encabezado: no hay inicio de sesión.')
} catch (error) {
  console.error('No se pudieron cargar los datos de demo:', error.message)
  process.exit(1)
}
