/** en/es copy for every page of the app (merged into content.js). */

export const pagesEn = {
  common: {
    save: 'Save', cancel: 'Cancel', delete: 'Delete', confirm: 'Confirm', retry: 'Retry',
    actions: 'Actions', dash: '—', loadingShort: 'Loading…'
  },
  confirm: { header: 'Confirm', accept: 'Delete', reject: 'Cancel' },
  roles: { Owner: 'Fleet owner', Driver: 'Driver', Mechanic: 'Mechanic / Workshop' },
  roleSwitcher: { label: 'View as' },
  api: {
    loadErrorTitle: 'Some data could not be loaded.',
    actionFailed: 'Could not complete the action',
    done: 'Done',
    retry: 'Retry',
    apiAddress: 'API',
    unreachable: 'Could not reach the server. Check that the API is running and your internet connection.',
    notFound: 'The requested resource does not exist.',
    conflict: 'The operation conflicts with the current state of the data.',
    server: 'An unexpected server error occurred.',
    failed: 'The request failed (HTTP {status}).'
  },
  errors: {
    vehicleGone: 'The vehicle no longer exists.',
    incidentGone: 'The incident no longer exists.',
    orderGone: 'The order no longer exists.',
    workshopRequired: 'Select the workshop that will handle the request.',
    unsupportedTransition: 'Unsupported transition: {status}'
  },
  status: {
    'Disponible': 'Available', 'En mantenimiento': 'In maintenance', 'Inactivo': 'Inactive',
    'Pendiente': 'Pending', 'Presupuestado': 'Quoted', 'Aprobado': 'Approved', 'Rechazado': 'Rejected',
    'En reparación': 'In repair', 'Completado': 'Completed',
    'Abierto': 'Open', 'En revisión': 'Under review', 'Resuelto': 'Resolved',
    'Pendiente de pago': 'Pending payment', 'En preparación': 'In preparation', 'Entregado': 'Delivered', 'Cancelado': 'Cancelled',
    'En ruta': 'On the road', 'Activo': 'Active', 'Conectado': 'Connected', 'Desconectado': 'Disconnected'
  },
  vehicleTypes: {
    'Automóvil': 'Car', 'Camioneta': 'Pickup truck', 'Mototaxi': 'Mototaxi',
    'Camión de carga': 'Cargo truck', 'Van de pasajeros': 'Passenger van'
  },
  fleet: {
    title: 'Vehicle fleet',
    subtitle: 'Registration, operating status and driver assignment of the vehicle pool.',
    register: '+ Register vehicle',
    stats: { total: 'Vehicles in fleet', available: 'Available', inMaintenance: 'In maintenance' },
    empty: "You haven't registered any vehicles yet.",
    cols: { plate: 'Plate', type: 'Type', driver: 'Assigned driver', mileage: 'Mileage', status: 'Status' },
    confirmDelete: 'Remove this vehicle from the fleet?',
    deleteError: 'Could not delete the vehicle',
    deleted: 'Vehicle deleted',
    form: {
      titleNew: 'Register vehicle', titleEdit: 'Edit vehicle',
      subtitle: 'Operating data of the vehicle and its assigned driver.',
      back: '← Back to fleet', plate: 'Plate', type: 'Vehicle type', mileage: 'Current mileage',
      driver: 'Assigned driver', status: 'Status',
      saveError: 'Could not save the vehicle', savedNew: 'Vehicle registered', savedEdit: 'Vehicle updated'
    }
  },
  drivers: {
    title: 'Drivers', subtitle: '{count} registered drivers',
    stats: { total: 'Total', inRoute: 'On the road', active: 'Active' },
    search: 'Search by name, email or license...', empty: 'No drivers found.',
    cols: { driver: 'Driver', license: 'License', vehicle: 'Vehicle', status: 'Status' },
    expires: 'Expires {date}', viewProfile: 'View profile →'
  },
  fuel: {
    title: 'Fuel control',
    subtitle: 'Refuel log, associated cost and abnormal-consumption detection per unit.',
    register: '+ Log refuel',
    stats: { liters: 'Liters loaded', cost: 'Total spend (S/)', anomalies: 'Abnormal consumption' },
    empty: 'No fuel refuels logged yet.',
    cols: { date: 'Date', vehicle: 'Vehicle', liters: 'Liters', cost: 'Cost (S/)', odometer: 'Odometer', efficiency: 'Efficiency' },
    anomalous: 'abnormal',
    confirmDelete: 'Delete this fuel record?', deleteError: 'Could not delete the record', deleted: 'Record deleted',
    form: {
      title: 'Log fuel refuel', subtitle: 'Liters loaded, associated cost and mileage at the time of the refuel.',
      back: '← Back to fuel', vehicle: 'Vehicle', liters: 'Liters', cost: 'Total cost (S/)',
      odometer: 'Current mileage (odometer)', date: 'Date',
      saveError: 'Could not log the refuel', saved: 'Fuel refuel logged'
    }
  },
  maintenance: {
    title: 'Preventive and corrective maintenance',
    subtitle: 'Full lifecycle: request, diagnosis, quote, repair and closure.',
    new: '+ New request',
    stats: { open: 'Open requests', inRepair: 'In repair', completed: 'Completed' },
    empty: 'No maintenance requests registered.',
    workshop: 'Workshop', noWorkshop: 'Not assigned', budget: 'Quote',
    actions: {
      quote: 'Register diagnosis and quote', approve: 'Approve quote', reject: 'Reject',
      start: 'Start repair', complete: 'Mark as completed'
    },
    confirmDelete: 'Delete this maintenance request?', deleteError: 'Could not delete the request', deleted: 'Request deleted',
    decisionError: 'Could not record the decision', startError: 'Could not start the repair', completeError: 'Could not complete the maintenance',
    form: {
      title: 'New maintenance request', subtitle: 'Describe the fault so a workshop can diagnose and quote it.',
      back: '← Back to maintenance', vehicle: 'Vehicle', workshop: 'Workshop / mechanic',
      fault: 'Fault description', submit: 'Submit request',
      saveError: 'Could not submit the request', saved: 'Request submitted'
    },
    quote: {
      title: 'Diagnosis and quote', workshop: 'Workshop / mechanic', cost: 'Estimated cost (S/)',
      save: 'Save quote', saveError: 'Could not save the quote', saved: 'Quote registered'
    }
  },
  workshops: {
    title: 'Affiliated workshops', subtitle: '{count} workshops available in the Flotix network',
    search: 'Search by name, city or specialty...', empty: 'No affiliated workshops yet.',
    details: 'View details', requestService: 'Request service',
    noAddress: 'Address not registered', generalMaintenance: 'General maintenance',
    tags: { brakes: 'Brakes', engine: 'Engine', transmission: 'Transmission', electrical: 'Electrical' },
    request: {
      title: 'Request service', subtitle: 'Workshop: {name}', back: '← Back to workshops',
      vehicle: 'Vehicle', problem: 'Problem description', submit: 'Submit request',
      saveError: 'Could not submit the request', saved: 'Request sent to the workshop'
    }
  },
  incidents: {
    title: 'On-road incidents',
    subtitle: 'Report and follow-up of unexpected faults or anomalies during operation.',
    report: '+ Report incident',
    stats: { total: 'Total incidents', open: 'Open', resolved: 'Resolved' },
    empty: 'No incidents reported.', reported: 'Reported: {date}',
    actions: { inspect: 'Mark as under inspection', resolve: 'Mark as resolved' },
    confirmDelete: 'Delete this incident?', deleteError: 'Could not delete the incident', deleted: 'Incident deleted',
    updateError: 'Could not update the incident',
    form: {
      title: 'Report incident', subtitle: 'Describe the fault or anomaly detected during operation.',
      back: '← Back to incidents', vehicle: 'Vehicle', description: 'Problem description', submit: 'Report',
      saveError: 'Could not report the incident', saved: 'Incident reported'
    }
  },
  tracking: {
    title: 'Real-time monitoring',
    subtitle: 'Simulated GPS telemetry sent every few seconds by each connected IoT device.',
    stats: { connected: 'Connected devices', avgSpeed: 'Average speed', packets: 'Packets received' },
    empty: 'No IoT devices connected to the fleet.',
    radar: 'Fleet radar (simulated) · Lima, Peru',
    serial: 'S/N {serial}', speed: 'Speed', latLng: 'Lat/Lng'
  },
  alerts: {
    title: 'Alerts and notifications',
    subtitle: 'Continuous evaluation of operating thresholds and internal messaging to users.',
    stats: { active: 'Active alerts', notifications: 'Notifications', unread: 'Unread' },
    generated: 'Generated alerts', notifications: 'Notifications',
    emptyAlerts: 'No active alerts.', emptyNotifications: "You don't have notifications.",
    markRead: 'Mark as read', markReadError: 'Could not mark as read', markAllError: 'Could not mark the notifications',
    types: { speed: 'Speed limit exceeded ({speed} km/h)', maintenance: 'Maintenance due soon ({pct}% of mileage)' },
    messages: {
      speed: 'Vehicle {plate} exceeded the speed limit: {speed} km/h.',
      maintenance: 'Vehicle {plate} reached {pct}% of the preventive-maintenance mileage.',
      incident: 'New incident reported: {description}'
    }
  },
  commerce: {
    title: 'Telematics hardware store',
    subtitle: 'Purchase GPS devices, odometers and fuel sensors to equip your fleet.',
    badgeNew: 'NEW', buyNow: 'Buy now →',
    products: { gps: 'Flotix GPS tracker', odometer: 'Flotix digital odometer', 'fuel-sensor': 'Flotix fuel sensor' },
    orders: 'Order history', emptyOrders: "You haven't placed any orders yet.",
    cols: { date: 'Date', product: 'Product', quantity: 'Quantity', total: 'Total', status: 'Status' },
    advance: 'Advance status →',
    success: 'Purchase of {qty} unit(s) of "{name}" processed successfully.',
    purchaseError: 'Could not process the purchase', updateError: 'Could not update the order'
  },
  reports: {
    title: 'Reports and analytics',
    subtitle: 'Consolidation of operating and historical data for management decisions.',
    export: '⬇ Export report',
    stats: { vehicles: 'Vehicles', fuel: 'Fuel spend', maintenance: 'Maintenance spend', completed: 'Completed maint.' },
    fuelByVehicle: 'Fuel spend by vehicle',
    needMore: 'At least 2 fuel records per vehicle are needed to generate the comparison.',
    history: 'Exported report history', emptyHistory: "You haven't exported any reports yet.",
    exportError: 'Could not generate the report', exported: 'Report generated',
    reportTypeFuel: 'Reporte de consumo de combustible',
    file: {
      title: 'FLOTIX — Fleet Performance Report (simulated export)',
      generated: 'Generated: {date}', type: 'Type: {type}', period: 'Period: {period}',
      vehicles: 'Vehicles in fleet: {n}', fuelSpend: 'Total fuel spend: S/ {n}',
      maintenanceSpend: 'Total maintenance spend: S/ {n}', completedMaintenance: 'Completed maintenance: {n}',
      totals: 'Records in period: {records} · Liters: {liters} · Cost: S/ {cost}',
      line: '{plate}: {records} records · {liters} L · S/ {cost}',
      comparison: 'Per-vehicle comparison (min. 2 fuel records):',
      comparisonLine: '{plate}: S/ {cost} · {eff} km/L',
      fileName: 'flotix-report-{id}.txt'
    }
  },
  settings: {
    title: 'Settings', subtitle: 'Manage your account, fleet and preferences',
    tabs: { account: 'My account', fleet: 'Fleet', notifications: 'Notifications', billing: 'Billing' },
    saved: '✅ Changes saved', prefsSaved: '✅ Preferences saved', saveChanges: 'Save changes',
    account: {
      personal: 'Personal information', name: 'Full name', email: 'Email',
      company: 'Company information', companyName: 'Company name', workshopName: 'Workshop name'
    },
    fleet: {
      thresholds: 'Automatic alert thresholds',
      thresholdsHint: "These values feed the system's Alerts and Fuel rules directly.",
      speedLimit: 'Speed limit (km/h)', serviceInterval: 'Maintenance interval (km)', anomaly: 'Anomaly sensitivity (%)',
      explanation: "A refuel is flagged as <strong>abnormal</strong> when its efficiency drops more than {pct}% below the vehicle's historical average. A maintenance alert is generated at 90% of the configured interval, and a speeding alert when the configured limit is exceeded.",
      vehicles: 'Vehicles in fleet', adjustTitle: 'Need to adjust your fleet?',
      adjustHint: 'Register, edit or remove vehicles from the fleet module.', goVehicles: 'Go to Vehicles'
    },
    notif: {
      types: 'Notification types',
      hint: 'Choose which events create a notification for your account (visible from the bell in the header).',
      maintenance: 'Maintenance due soon', maintenanceHint: 'When a vehicle reaches the configured mileage threshold.',
      speed: 'Speed limit exceeded', speedHint: 'When GPS telemetry reports a speed above the limit.',
      incidents: 'Reported incidents', incidentsHint: 'When a driver reports a fault or anomaly on the road.'
    },
    billing: {
      spent: 'Total IoT hardware spend', orders: 'Orders placed', plan: 'Current plan',
      history: 'Billing history', emptyHistory: "You don't have any purchases yet.",
      cols: { date: 'Date', concept: 'Item', amount: 'Amount', status: 'Status' },
      concept: '{qty}× IoT device ({sku})',
      paymentMethod: 'Payment method', endingIn: 'Ending in 4417', expires: 'Expires 08/28', goStore: 'Go to the IoT store'
    }
  },
  notifications: {
    title: 'Notifications', markAllRead: 'Mark all as read', empty: "You don't have notifications.",
    viewAll: 'View all alerts →'
  }
}


export const pagesEs = {
  common: {
    save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', confirm: 'Confirmar', retry: 'Reintentar',
    actions: 'Acciones', dash: '—', loadingShort: 'Cargando…'
  },
  confirm: { header: 'Confirmar', accept: 'Eliminar', reject: 'Cancelar' },
  roles: { Owner: 'Dueño de flota', Driver: 'Conductor', Mechanic: 'Mecánico / Taller' },
  roleSwitcher: { label: 'Ver como' },
  api: {
    loadErrorTitle: 'No se pudieron cargar algunos datos.',
    actionFailed: 'No se pudo completar la acción',
    done: 'Listo',
    retry: 'Reintentar',
    apiAddress: 'API',
    unreachable: 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución y tu conexión a internet.',
    notFound: 'El recurso solicitado no existe.',
    conflict: 'La operación entra en conflicto con el estado actual de los datos.',
    server: 'Ocurrió un error inesperado en el servidor.',
    failed: 'La solicitud falló (HTTP {status}).'
  },
  errors: {
    vehicleGone: 'El vehículo ya no existe.',
    incidentGone: 'La incidencia ya no existe.',
    orderGone: 'El pedido ya no existe.',
    workshopRequired: 'Selecciona el taller que atenderá la solicitud.',
    unsupportedTransition: 'Transición no soportada: {status}'
  },
  status: {
    'Disponible': 'Disponible', 'En mantenimiento': 'En mantenimiento', 'Inactivo': 'Inactivo',
    'Pendiente': 'Pendiente', 'Presupuestado': 'Presupuestado', 'Aprobado': 'Aprobado', 'Rechazado': 'Rechazado',
    'En reparación': 'En reparación', 'Completado': 'Completado',
    'Abierto': 'Abierto', 'En revisión': 'En revisión', 'Resuelto': 'Resuelto',
    'Pendiente de pago': 'Pendiente de pago', 'En preparación': 'En preparación', 'Entregado': 'Entregado', 'Cancelado': 'Cancelado',
    'En ruta': 'En ruta', 'Activo': 'Activo', 'Conectado': 'Conectado', 'Desconectado': 'Desconectado'
  },
  vehicleTypes: {
    'Automóvil': 'Automóvil', 'Camioneta': 'Camioneta', 'Mototaxi': 'Mototaxi',
    'Camión de carga': 'Camión de carga', 'Van de pasajeros': 'Van de pasajeros'
  },
  fleet: {
    title: 'Flota de vehículos',
    subtitle: 'Registro, estado operativo y asignación de conductores del parque automotor.',
    register: '+ Registrar vehículo',
    stats: { total: 'Vehículos en flota', available: 'Disponibles', inMaintenance: 'En mantenimiento' },
    empty: 'Aún no registras vehículos en tu flota.',
    cols: { plate: 'Placa', type: 'Tipo', driver: 'Conductor asignado', mileage: 'Kilometraje', status: 'Estado' },
    confirmDelete: '¿Eliminar este vehículo de la flota?',
    deleteError: 'No se pudo eliminar el vehículo',
    deleted: 'Vehículo eliminado',
    form: {
      titleNew: 'Registrar vehículo', titleEdit: 'Editar vehículo',
      subtitle: 'Datos operativos del vehículo y su conductor asignado.',
      back: '← Volver a la flota', plate: 'Placa', type: 'Tipo de vehículo', mileage: 'Kilometraje actual',
      driver: 'Conductor asignado', status: 'Estado',
      saveError: 'No se pudo guardar el vehículo', savedNew: 'Vehículo registrado', savedEdit: 'Vehículo actualizado'
    }
  },
  drivers: {
    title: 'Conductores', subtitle: '{count} conductores registrados',
    stats: { total: 'Total', inRoute: 'En ruta', active: 'Activos' },
    search: 'Buscar por nombre, email o licencia...', empty: 'No se encontraron conductores.',
    cols: { driver: 'Conductor', license: 'Licencia', vehicle: 'Vehículo', status: 'Estado' },
    expires: 'Vence {date}', viewProfile: 'Ver perfil →'
  },
  fuel: {
    title: 'Control de combustible',
    subtitle: 'Registro de recargas, costo asociado y detección de consumo anómalo por unidad.',
    register: '+ Registrar recarga',
    stats: { liters: 'Litros cargados', cost: 'Gasto total (S/)', anomalies: 'Consumos anómalos' },
    empty: 'Aún no hay recargas de combustible registradas.',
    cols: { date: 'Fecha', vehicle: 'Vehículo', liters: 'Litros', cost: 'Costo (S/)', odometer: 'Odómetro', efficiency: 'Rendimiento' },
    anomalous: 'anómalo',
    confirmDelete: '¿Eliminar este registro de combustible?', deleteError: 'No se pudo eliminar el registro', deleted: 'Registro eliminado',
    form: {
      title: 'Registrar recarga de combustible', subtitle: 'Litros cargados, costo asociado y kilometraje al momento de la recarga.',
      back: '← Volver a combustible', vehicle: 'Vehículo', liters: 'Litros', cost: 'Costo total (S/)',
      odometer: 'Kilometraje actual (odómetro)', date: 'Fecha',
      saveError: 'No se pudo registrar la carga', saved: 'Carga de combustible registrada'
    }
  },
  maintenance: {
    title: 'Mantenimiento preventivo y correctivo',
    subtitle: 'Ciclo de vida completo: solicitud, diagnóstico, presupuesto, reparación y cierre.',
    new: '+ Nueva solicitud',
    stats: { open: 'Solicitudes abiertas', inRepair: 'En reparación', completed: 'Completadas' },
    empty: 'No hay solicitudes de mantenimiento registradas.',
    workshop: 'Taller', noWorkshop: 'Sin asignar', budget: 'Presupuesto',
    actions: {
      quote: 'Registrar diagnóstico y cotización', approve: 'Aprobar presupuesto', reject: 'Rechazar',
      start: 'Iniciar reparación', complete: 'Marcar como completado'
    },
    confirmDelete: '¿Eliminar esta solicitud de mantenimiento?', deleteError: 'No se pudo eliminar la solicitud', deleted: 'Solicitud eliminada',
    decisionError: 'No se pudo registrar la decisión', startError: 'No se pudo iniciar la reparación', completeError: 'No se pudo completar el mantenimiento',
    form: {
      title: 'Nueva solicitud de mantenimiento', subtitle: 'Describe la falla para que un taller pueda diagnosticarla y cotizarla.',
      back: '← Volver a mantenimiento', vehicle: 'Vehículo', workshop: 'Taller / mecánico',
      fault: 'Descripción de la falla', submit: 'Enviar solicitud',
      saveError: 'No se pudo enviar la solicitud', saved: 'Solicitud enviada'
    },
    quote: {
      title: 'Diagnóstico y cotización', workshop: 'Taller / mecánico', cost: 'Costo estimado (S/)',
      save: 'Guardar cotización', saveError: 'No se pudo guardar la cotización', saved: 'Cotización registrada'
    }
  },
  workshops: {
    title: 'Talleres afiliados', subtitle: '{count} talleres disponibles en la red Flotix',
    search: 'Buscar por nombre, ciudad o especialidad...', empty: 'No hay talleres afiliados todavía.',
    details: 'Ver detalle', requestService: 'Solicitar servicio',
    noAddress: 'Dirección no registrada', generalMaintenance: 'Mantenimiento general',
    tags: { brakes: 'Frenos', engine: 'Motor', transmission: 'Transmisión', electrical: 'Eléctrico' },
    request: {
      title: 'Solicitar servicio', subtitle: 'Taller: {name}', back: '← Volver a talleres',
      vehicle: 'Vehículo', problem: 'Descripción del problema', submit: 'Enviar solicitud',
      saveError: 'No se pudo enviar la solicitud', saved: 'Solicitud enviada al taller'
    }
  },
  incidents: {
    title: 'Incidencias en ruta',
    subtitle: 'Reporte y seguimiento de fallas o anomalías imprevistas durante la operación.',
    report: '+ Reportar incidencia',
    stats: { total: 'Incidencias totales', open: 'Abiertas', resolved: 'Resueltas' },
    empty: 'No hay incidencias reportadas.', reported: 'Reportado: {date}',
    actions: { inspect: 'Marcar en inspección', resolve: 'Marcar como resuelto' },
    confirmDelete: '¿Eliminar esta incidencia?', deleteError: 'No se pudo eliminar la incidencia', deleted: 'Incidencia eliminada',
    updateError: 'No se pudo actualizar la incidencia',
    form: {
      title: 'Reportar incidencia', subtitle: 'Describe la falla o anomalía detectada durante la operación.',
      back: '← Volver a incidencias', vehicle: 'Vehículo', description: 'Descripción del problema', submit: 'Reportar',
      saveError: 'No se pudo reportar la incidencia', saved: 'Incidencia reportada'
    }
  },
  tracking: {
    title: 'Monitoreo en tiempo real',
    subtitle: 'Telemetría GPS simulada cada pocos segundos por cada dispositivo IoT conectado.',
    stats: { connected: 'Dispositivos conectados', avgSpeed: 'Velocidad promedio', packets: 'Paquetes recibidos' },
    empty: 'No hay dispositivos IoT conectados a la flota.',
    radar: 'Radar de flota (simulado) · Lima, Perú',
    serial: 'S/N {serial}', speed: 'Velocidad', latLng: 'Lat/Lng'
  },
  alerts: {
    title: 'Alertas y notificaciones',
    subtitle: 'Evaluación continua de umbrales operativos y mensajería interna hacia los usuarios.',
    stats: { active: 'Alertas activas', notifications: 'Notificaciones', unread: 'Sin leer' },
    generated: 'Alertas generadas', notifications: 'Notificaciones',
    emptyAlerts: 'No hay alertas activas.', emptyNotifications: 'No tienes notificaciones.',
    markRead: 'Marcar leída', markReadError: 'No se pudo marcar como leída', markAllError: 'No se pudieron marcar las notificaciones',
    types: { speed: 'Exceso de velocidad ({speed} km/h)', maintenance: 'Mantenimiento próximo ({pct}% de kilometraje)' },
    messages: {
      speed: 'El vehículo {plate} superó el límite de velocidad: {speed} km/h.',
      maintenance: 'El vehículo {plate} alcanzó el {pct}% del kilometraje de revisión preventiva.',
      incident: 'Nueva incidencia reportada: {description}'
    }
  },
  commerce: {
    title: 'Tienda de hardware telemático',
    subtitle: 'Adquisición de dispositivos GPS, odómetro y sensores de combustible para equipar tu flota.',
    badgeNew: 'NUEVO', buyNow: 'Comprar ahora →',
    products: { gps: 'Rastreador GPS Flotix', odometer: 'Odómetro digital Flotix', 'fuel-sensor': 'Sensor de combustible Flotix' },
    orders: 'Historial de pedidos', emptyOrders: 'Aún no has realizado pedidos.',
    cols: { date: 'Fecha', product: 'Producto', quantity: 'Cantidad', total: 'Total', status: 'Estado' },
    advance: 'Avanzar estado →',
    success: 'Compra de {qty} unidad(es) de "{name}" procesada correctamente.',
    purchaseError: 'No se pudo procesar la compra', updateError: 'No se pudo actualizar el pedido'
  },
  reports: {
    title: 'Reportes y analítica',
    subtitle: 'Consolidación de datos operativos e históricos para la toma de decisiones gerenciales.',
    export: '⬇ Exportar reporte',
    stats: { vehicles: 'Vehículos', fuel: 'Gasto combustible', maintenance: 'Gasto mantenimiento', completed: 'Mant. completados' },
    fuelByVehicle: 'Gasto de combustible por vehículo',
    needMore: 'Se necesitan al menos 2 registros de combustible por vehículo para generar el comparativo.',
    history: 'Historial de reportes exportados', emptyHistory: 'Aún no has exportado ningún reporte.',
    exportError: 'No se pudo generar el reporte', exported: 'Reporte generado',
    reportTypeFuel: 'Reporte de consumo de combustible',
    file: {
      title: 'FLOTIX — Reporte de Rendimiento de Flota (exportación simulada)',
      generated: 'Generado: {date}', type: 'Tipo: {type}', period: 'Período: {period}',
      vehicles: 'Vehículos en flota: {n}', fuelSpend: 'Gasto total en combustible: S/ {n}',
      maintenanceSpend: 'Gasto total en mantenimiento: S/ {n}', completedMaintenance: 'Mantenimientos completados: {n}',
      totals: 'Registros del período: {records} · Litros: {liters} · Costo: S/ {cost}',
      line: '{plate}: {records} registros · {liters} L · S/ {cost}',
      comparison: 'Comparativo por vehículo (mín. 2 registros de combustible):',
      comparisonLine: '{plate}: S/ {cost} · {eff} km/L',
      fileName: 'flotix-reporte-{id}.txt'
    }
  },
  settings: {
    title: 'Configuración', subtitle: 'Gestiona tu cuenta, flota y preferencias',
    tabs: { account: 'Mi cuenta', fleet: 'Flota', notifications: 'Notificaciones', billing: 'Facturación' },
    saved: '✅ Cambios guardados', prefsSaved: '✅ Preferencias guardadas', saveChanges: 'Guardar cambios',
    account: {
      personal: 'Información personal', name: 'Nombre completo', email: 'Correo electrónico',
      company: 'Información de empresa', companyName: 'Nombre de la empresa', workshopName: 'Nombre del taller'
    },
    fleet: {
      thresholds: 'Umbrales de alertas automáticas',
      thresholdsHint: 'Estos valores alimentan directamente las reglas de Alertas y Combustible del sistema.',
      speedLimit: 'Límite de velocidad (km/h)', serviceInterval: 'Intervalo de mantenimiento (km)', anomaly: 'Sensibilidad de anomalía (%)',
      explanation: 'Una carga se marca como <strong>anómala</strong> cuando su rendimiento cae más de {pct}% por debajo del promedio histórico del vehículo. Se genera una alerta de mantenimiento al llegar al 90% del intervalo configurado, y de exceso de velocidad al superar el límite configurado.',
      vehicles: 'Vehículos en flota', adjustTitle: '¿Necesitas ajustar tu flota?',
      adjustHint: 'Registra, edita o retira vehículos desde el módulo de flota.', goVehicles: 'Ir a Vehículos'
    },
    notif: {
      types: 'Tipos de notificación',
      hint: 'Elige qué eventos generan una notificación para tu cuenta (visible desde la campana del encabezado).',
      maintenance: 'Mantenimiento próximo', maintenanceHint: 'Cuando un vehículo alcanza el umbral de kilometraje configurado.',
      speed: 'Exceso de velocidad', speedHint: 'Cuando la telemetría GPS reporta una velocidad por encima del límite.',
      incidents: 'Incidencias reportadas', incidentsHint: 'Cuando un conductor reporta una falla o anomalía en ruta.'
    },
    billing: {
      spent: 'Gasto total en hardware IoT', orders: 'Pedidos realizados', plan: 'Plan actual',
      history: 'Historial de facturación', emptyHistory: 'Aún no tienes compras registradas.',
      cols: { date: 'Fecha', concept: 'Concepto', amount: 'Monto', status: 'Estado' },
      concept: '{qty}× dispositivo IoT ({sku})',
      paymentMethod: 'Método de pago', endingIn: 'Terminada en 4417', expires: 'Expira 08/28', goStore: 'Ir a la tienda IoT'
    }
  },
  notifications: {
    title: 'Notificaciones', markAllRead: 'Marcar todas como leídas', empty: 'No tienes notificaciones.',
    viewAll: 'Ver todas las alertas →'
  }
}
