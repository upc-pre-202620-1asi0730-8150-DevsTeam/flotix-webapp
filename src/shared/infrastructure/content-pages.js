/** en/es copy for every page of the app (merged into content.js). */

export const pagesEn = {
  auth: {
    kicker: 'Fleet platform',
    brandTitle: 'Control your fleet from a single platform',
    brandSub: 'Flotix connects vehicles, drivers and maintenance workshops through IoT and GPS, so owners monitor fuel, mileage and routes in real time.',
    brand: 'Your fleet, in good hands',
    brandSubtitle: 'Flotix brings your vehicles, drivers and maintenance together in one clear view.',
    features: ['Fleet management', 'Fuel control', 'Coordinated maintenance', 'Real-time GPS tracking'],
    stats: ['vehicles tracked in the pilot', 'affiliated workshops', 'GPS device uptime'],
    prototype: 'Frontend preview · Authentication is not connected to the backend yet.',
    tabsLabel: 'Authentication',
    showPassword: 'Show password', hidePassword: 'Hide password',
    preview: { description: 'Local panel preview. No account is created or authenticated.', roleLabel: 'Choose a preview role', enter: 'Open preview' },
    localDevelopmentNotice: '',
    legal: {
      close: 'Close',
      terms: {
        title: 'Terms and conditions',
        lede: 'These terms describe how visitors and registered users may use the Flotix landing page, web application and IoT device.',
        sections: [
          { title: '1. Scope', body: 'These terms apply to the Flotix landing page, the web application and the companion GPS, odometer and fuel sensor device offered to fleet owners.' },
          { title: '2. Accounts and roles', body: 'Every account belongs to one of three roles: owner, driver or workshop. Each role sees only the screens and data relevant to its work, and an owner may assign roles to the members of their organization.' },
          { title: '3. Acceptable use', body: 'Users agree to provide accurate vehicle and account information, to use the IoT device only on vehicles they own or operate, and not to interfere with telemetry data belonging to another account.' },
          { title: '4. Data and privacy', body: 'Location, fuel and maintenance data collected through the platform is used to power the features owners, drivers and workshops rely on, and is not sold to third parties.' },
          { title: '5. Professional responsibility', body: 'The Flotix team follows recognized software engineering ethics guidance in how the platform is built, tested and deployed, and documents changes to the service through its public version control repository.' }
        ]
      },
      privacy: {
        title: 'Privacy policy',
        lede: 'This page explains what information Flotix collects, why it is collected and how it is protected.',
        sections: [
          { title: '1. Information we collect', body: 'Account details such as name, email and role, together with vehicle, location, fuel and maintenance data reported by the web application and the IoT device.' },
          { title: '2. How we use it', body: 'The data powers fleet management, fuel control, preventive maintenance and real time monitoring, and helps us improve the platform.' },
          { title: '3. Sharing', body: 'Information is shared only inside the organization that owns the account and with affiliated workshops when a maintenance task requires it. It is never sold to third parties.' },
          { title: '4. Security and retention', body: 'We apply access controls by role and keep data only as long as the account is active or as needed to provide the service.' },
          { title: '5. Your rights', body: 'You may ask to access, correct or delete your personal information at any time by contacting the Flotix team.' }
        ]
      }
    },
    login: {
      tab: 'Sign in',
      title: 'Welcome back', subtitle: 'Sign in to manage your fleet.', email: 'Email', password: 'Password',
      emailPlaceholder: 'name{\'@\'}company.com', passwordPlaceholder: 'Your password', forgot: 'Forgot your password?',
      submit: 'Sign in', noAccount: "Don’t have an account?", register: 'Create account',
      google: 'Continue with Google', orEmail: 'or continue with email', remember: 'Keep me signed in',
    },
    register: {
      tab: 'Sign up',
      title: 'Create your account', subtitle: 'Join Flotix and start tracking your fleet.', name: 'Full name',
      chooseRoleTitle: 'Choose your profile', chooseRoleSubtitle: 'Select the role that best describes you.', back: 'Back to roles',
      firstName: 'First name', lastName: 'Last name', roleLabel: 'I am a…',
      firstPlaceholder: 'Maria', lastPlaceholder: 'Lopez', emailPlaceholder: 'name{\'@\'}company.com',
      passwordPlaceholder: 'At least 8 characters', confirmPlaceholder: 'Repeat your password',
      email: 'Email', password: 'Password', confirmPassword: 'Confirm password', role: 'I am a…',
      owner: 'Fleet owner', driver: 'Driver', mechanic: 'Mechanic / Workshop', company: 'Fleet or business name',
      companyPlaceholder: 'e.g. Lima Cargo', fleetSize: 'Vehicles in your fleet', fleetSizePlaceholder: 'e.g. 5',
      workshop: 'Workshop or business name', workshopPlaceholder: 'e.g. Taller San Martín',
      workshopCity: 'City or district', workshopCityPlaceholder: 'e.g. San Miguel, Lima',
      workshopSpecialty: 'Main specialty', workshopSpecialtyPlaceholder: 'e.g. Engine diagnostics',
      licenseNumber: 'License number', licenseNumberPlaceholder: 'e.g. Q12345678', licenseExpiry: 'License expiration',
      licenseExpiryExample: 'Example: Dec 31, 2028. Select the expiry date printed on your license.',
      submit: 'Create account', haveAccount: 'Already have an account?', login: 'Sign in',
      google: 'Sign up with Google', agreePrefix: 'I agree to the', termsLink: 'Terms', agreeJoin: 'and', privacyLink: 'Privacy Policy.',
      continueToPayment: 'Continue to payment'
    },
    plan: {
      selected: 'Selected plan', perMonth: '/ month', unlimited: 'Unlimited vehicles', upTo: 'Up to {count} vehicles',
      change: 'Change plan', ownerOnly: 'Fleet plans are for fleet owners, so your profile is set to Fleet owner.'
    },
    checkout: {
      title: 'Payment details', subtitle: 'Complete your subscription to the {plan} plan.',
      simulated: 'Simulated payment: this is a demo, no real charge is made. Use any test card number.',
      cardHolder: 'Name on card', cardNumber: 'Card number', expiry: 'Expiry (MM/YY)', cvv: 'CVV',
      summary: 'Order summary', total: 'Total today', pay: 'Pay S/ {amount} and create account',
      processing: 'Processing payment…', back: 'Back to account details'
    },
    google: {
      title: 'Choose an account', subtitle: 'to continue to Flotix',
      lastStep: 'One last step', lastStepSubtitle: 'Tell us who you are on the platform to finish creating your account.',
      finish: 'Finish sign up', cancel: 'Cancel',
      existing: 'Continue with demo profile', new: 'Continue as a new profile', close: 'Close'
    },
    errors: {
      invalidCredentials: 'Email or password is incorrect.',
      notConfigured: 'Sign-in is unavailable because the authentication service is not connected yet.',
      googleNotConfigured: 'Google sign-in is not configured yet.',
      profileNotFound: 'No Flotix profile is linked to this email. Finish registration or contact support.',
      previewUnavailable: 'The local preview profile is not available.',
      emailTaken: 'An account with this email already exists.', passwordMismatch: 'Passwords do not match.',
      termsRequired: 'You need to accept to continue.',
      roleFieldsRequired: 'Complete all required information for your selected role.',
      licenseExpired: 'Your driver license must be valid and not expired.',
      fleetSizeExceedsPlan: 'Your fleet has more vehicles than the {plan} plan allows ({limit}). Choose a larger plan.',
      cardInvalid: 'Check your card details: number, expiry date and CVV.'
    }
  },
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
    previewMode: 'Local preview is active. API data and write actions are unavailable.',
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
    register: 'Register vehicle',
    stats: { total: 'Vehicles in fleet', available: 'Available', inMaintenance: 'In maintenance' },
    empty: "You haven't registered any vehicles yet.",
    cols: { plate: 'Plate', type: 'Type', driver: 'Assigned driver', mileage: 'Mileage', status: 'Status' },
    confirmDelete: 'Remove this vehicle from the fleet?',
    deleteError: 'Could not delete the vehicle',
    deleted: 'Vehicle deleted',
    form: {
      titleNew: 'Register vehicle', titleEdit: 'Edit vehicle',
      subtitle: 'Operating data of the vehicle and its assigned driver.',
      back: 'Back to fleet', plate: 'Plate', type: 'Vehicle type', mileage: 'Current mileage',
      driver: 'Assigned driver', status: 'Status',
      saveError: 'Could not save the vehicle', savedNew: 'Vehicle registered', savedEdit: 'Vehicle updated'
    }
  },
  drivers: {
    title: 'Drivers', subtitle: '{count} registered drivers',
    stats: { total: 'Total', inRoute: 'On the road', active: 'Active' },
    search: 'Search by name, email or license', empty: 'No drivers found.',
    cols: { driver: 'Driver', license: 'License', vehicle: 'Vehicle', status: 'Status' },
    expires: 'Expires {date}', viewProfile: 'View profile'
  },
  fuel: {
    title: 'Fuel control',
    subtitle: 'Refuel log, associated cost and abnormal-consumption detection per unit.',
    register: 'Log refuel',
    stats: { liters: 'Liters loaded', cost: 'Total spend (S/)', anomalies: 'Abnormal consumption' },
    empty: 'No fuel refuels logged yet.',
    cols: { date: 'Date', vehicle: 'Vehicle', liters: 'Liters', cost: 'Cost (S/)', odometer: 'Odometer', efficiency: 'Efficiency' },
    anomalous: 'abnormal',
    confirmDelete: 'Delete this fuel record?', deleteError: 'Could not delete the record', deleted: 'Record deleted',
    form: {
      title: 'Log fuel refuel', subtitle: 'Liters loaded, associated cost and mileage at the time of the refuel.',
      back: 'Back to fuel', vehicle: 'Vehicle', liters: 'Liters', cost: 'Total cost (S/)',
      odometer: 'Current mileage (odometer)', date: 'Date',
      saveError: 'Could not log the refuel', saved: 'Fuel refuel logged'
    }
  },
  maintenance: {
    title: 'Preventive and corrective maintenance',
    subtitle: 'Full lifecycle: request, diagnosis, quote, repair and closure.',
    new: 'New request',
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
      back: 'Back to maintenance', vehicle: 'Vehicle', workshop: 'Workshop / mechanic',
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
    search: 'Search by name, city or specialty', empty: 'No affiliated workshops yet.',
    details: 'View details', requestService: 'Request service',
    noAddress: 'Address not registered', generalMaintenance: 'General maintenance',
    tags: { brakes: 'Brakes', engine: 'Engine', transmission: 'Transmission', electrical: 'Electrical' },
    request: {
      title: 'Request service', subtitle: 'Workshop: {name}', back: 'Back to workshops',
      vehicle: 'Vehicle', problem: 'Problem description', submit: 'Submit request',
      saveError: 'Could not submit the request', saved: 'Request sent to the workshop'
    }
  },
  incidents: {
    title: 'On-road incidents',
    subtitle: 'Report and follow-up of unexpected faults or anomalies during operation.',
    report: 'Report incident',
    stats: { total: 'Total incidents', open: 'Open', resolved: 'Resolved' },
    empty: 'No incidents reported.', reported: 'Reported: {date}',
    actions: { inspect: 'Mark as under inspection', resolve: 'Mark as resolved' },
    confirmDelete: 'Delete this incident?', deleteError: 'Could not delete the incident', deleted: 'Incident deleted',
    updateError: 'Could not update the incident',
    form: {
      title: 'Report incident', subtitle: 'Describe the fault or anomaly detected during operation.',
      back: 'Back to incidents', vehicle: 'Vehicle', description: 'Problem description', submit: 'Report',
      saveError: 'Could not report the incident', saved: 'Incident reported'
    }
  },
  tracking: {
    title: 'Real-time monitoring',
    subtitle: 'Simulated GPS telemetry sent every few seconds by each connected IoT device.',
    stats: { connected: 'Connected devices', avgSpeed: 'Average speed', packets: 'Packets received' },
    empty: 'No IoT devices connected to the fleet.',
    radar: 'Fleet radar, Lima (simulated)',
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
    badgeNew: 'New', buyNow: 'Buy now',
    products: { gps: 'Flotix GPS tracker', odometer: 'Flotix digital odometer', 'fuel-sensor': 'Flotix fuel sensor' },
    orders: 'Order history', emptyOrders: "You haven't placed any orders yet.",
    cols: { date: 'Date', product: 'Product', quantity: 'Quantity', total: 'Total', status: 'Status' },
    advance: 'Advance status',
    success: 'Purchase of {qty} unit(s) of "{name}" processed successfully.',
    purchaseError: 'Could not process the purchase', updateError: 'Could not update the order'
  },
  reports: {
    title: 'Reports and analytics',
    subtitle: 'Consolidation of operating and historical data for management decisions.',
    export: 'Export report',
    stats: { vehicles: 'Vehicles', fuel: 'Fuel spend', maintenance: 'Maintenance spend', completed: 'Completed maint.' },
    fuelByVehicle: 'Fuel spend by vehicle',
    needMore: 'At least 2 fuel records per vehicle are needed to generate the comparison.',
    history: 'Exported report history', emptyHistory: "You haven't exported any reports yet.",
    exportError: 'Could not generate the report', exported: 'Report generated',
    reportTypeFuel: 'Reporte de consumo de combustible',
    file: {
      title: 'FLOTIX: Fleet Performance Report (simulated export)',
      generated: 'Generated: {date}', type: 'Type: {type}', period: 'Period: {period}',
      vehicles: 'Vehicles in fleet: {n}', fuelSpend: 'Total fuel spend: S/ {n}',
      maintenanceSpend: 'Total maintenance spend: S/ {n}', completedMaintenance: 'Completed maintenance: {n}',
      totals: 'Records in period: {records} | Liters: {liters} | Cost: S/ {cost}',
      line: '{plate}: {records} records | {liters} L | S/ {cost}',
      comparison: 'Per-vehicle comparison (min. 2 fuel records):',
      comparisonLine: '{plate}: S/ {cost} | {eff} km/L',
      fileName: 'flotix-report-{id}.txt'
    }
  },
  settings: {
    title: 'Settings', subtitle: 'Manage your account, fleet and preferences',
    tabs: { account: 'My account', fleet: 'Fleet', notifications: 'Notifications', billing: 'Billing' },
    saved: 'Changes saved', prefsSaved: 'Preferences saved', saveChanges: 'Save changes',
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
      paymentMethod: 'Payment method', endingIn: 'Ending in {last4}', expires: 'Expires {date}', goStore: 'Go to the IoT store'
    }
  },
  notifications: {
    title: 'Notifications', markAllRead: 'Mark all as read', empty: "You don't have notifications.",
    viewAll: 'View all alerts'
  }
}


export const pagesEs = {
  auth: {
    kicker: 'Plataforma de flotas',
    brandTitle: 'Controla tu flota desde una sola plataforma',
    brandSub: 'Flotix conecta vehículos, conductores y talleres con IoT y GPS para que monitorees combustible, kilometraje y rutas en tiempo real.',
    brand: 'Tu flota, siempre en buenas manos',
    brandSubtitle: 'Flotix reúne tus vehículos, conductores y mantenimientos en una vista clara.',
    features: ['Gestión de flota', 'Control de combustible', 'Mantenimiento coordinado', 'Monitoreo GPS en tiempo real'],
    stats: ['vehículos en el piloto', 'talleres afiliados', 'disponibilidad GPS'],
    prototype: 'Vista previa del frontend · La autenticación aún no está conectada al backend.',
    tabsLabel: 'Autenticación',
    showPassword: 'Mostrar contraseña', hidePassword: 'Ocultar contraseña',
    preview: { description: 'Vista previa local del panel. No se crea ni autentica una cuenta.', roleLabel: 'Elige un rol para la vista previa', enter: 'Abrir vista previa' },
    localDevelopmentNotice: 'Si no se puede conectar con el API, este acceso de desarrollo guarda las cuentas solo en este navegador; no crea una cuenta IAM.',
    demo: { title: 'Cuentas de demostración', description: 'Estas cuentas son para la vista previa local. Pulsa Usar para completar el formulario.', use: 'Usar' },
    legal: {
      close: 'Cerrar',
      terms: {
        title: 'Términos y condiciones',
        lede: 'Estos términos describen cómo los visitantes y usuarios registrados pueden usar el landing page, la aplicación web y el dispositivo IoT de Flotix.',
        sections: [
          { title: '1. Alcance', body: 'Estos términos aplican al landing page de Flotix, la aplicación web y el dispositivo de GPS, odómetro y sensor de combustible ofrecido a los dueños de flota.' },
          { title: '2. Cuentas y roles', body: 'Cada cuenta pertenece a uno de tres roles: dueño, conductor o taller. Cada rol ve únicamente las pantallas y los datos relevantes para su trabajo, y un dueño puede asignar roles a los miembros de su organización.' },
          { title: '3. Uso aceptable', body: 'Los usuarios se comprometen a proporcionar información precisa de vehículos y cuenta, a usar el dispositivo IoT solo en vehículos que posean u operen, y a no interferir con los datos de telemetría de otra cuenta.' },
          { title: '4. Datos y privacidad', body: 'Los datos de ubicación, combustible y mantenimiento recolectados por la plataforma se usan para las funciones que dueños, conductores y talleres necesitan, y no se venden a terceros.' },
          { title: '5. Responsabilidad profesional', body: 'El equipo de Flotix sigue lineamientos reconocidos de ética en ingeniería de software para construir, probar y desplegar la plataforma, y documenta los cambios del servicio en su repositorio público de control de versiones.' }
        ]
      },
      privacy: {
        title: 'Política de privacidad',
        lede: 'Esta página explica qué información recopila Flotix, por qué se recopila y cómo se protege.',
        sections: [
          { title: '1. Información que recopilamos', body: 'Datos de la cuenta como nombre, correo y rol, junto con los datos de vehículos, ubicación, combustible y mantenimiento que reportan la aplicación web y el dispositivo IoT.' },
          { title: '2. Cómo la usamos', body: 'Los datos permiten la gestión de flotas, el control de combustible, el mantenimiento preventivo y el monitoreo en tiempo real, y nos ayudan a mejorar la plataforma.' },
          { title: '3. Compartir', body: 'La información se comparte solo dentro de la organización dueña de la cuenta y con talleres afiliados cuando una tarea de mantenimiento lo requiere. Nunca se vende a terceros.' },
          { title: '4. Seguridad y conservación', body: 'Aplicamos control de acceso por rol y conservamos los datos solo mientras la cuenta esté activa o sea necesario para prestar el servicio.' },
          { title: '5. Tus derechos', body: 'Puedes solicitar acceso, corrección o eliminación de tu información personal en cualquier momento contactando al equipo de Flotix.' }
        ]
      }
    },
    login: {
      tab: 'Iniciar sesión',
      title: 'Te damos la bienvenida', subtitle: 'Inicia sesión para gestionar tu flota.', email: 'Correo electrónico', password: 'Contraseña',
      emailPlaceholder: 'nombre{\'@\'}empresa.com', passwordPlaceholder: 'Tu contraseña', forgot: '¿Olvidaste tu contraseña?',
      submit: 'Iniciar sesión', noAccount: '¿Aún no tienes una cuenta?', register: 'Crear cuenta',
      google: 'Continuar con Google', orEmail: 'o continúa con tu correo', remember: 'Mantener sesión iniciada',
    },
    register: {
      tab: 'Registrarse',
      title: 'Crea tu cuenta', subtitle: 'Únete a Flotix y empieza a monitorear tu flota.', name: 'Nombre completo',
      chooseRoleTitle: 'Elige tu perfil', chooseRoleSubtitle: 'Selecciona el rol que mejor te describe.', back: 'Volver a los roles',
      firstName: 'Nombre', lastName: 'Apellido', roleLabel: 'Soy…',
      firstPlaceholder: 'María', lastPlaceholder: 'López', emailPlaceholder: 'nombre{\'@\'}empresa.com',
      passwordPlaceholder: 'Mínimo 8 caracteres', confirmPlaceholder: 'Repite tu contraseña',
      email: 'Correo electrónico', password: 'Contraseña', confirmPassword: 'Confirmar contraseña', role: 'Soy…',
      owner: 'Dueño de flota', driver: 'Conductor', mechanic: 'Mecánico / Taller', company: 'Nombre de flota o empresa',
      companyPlaceholder: 'Ej.: Transportes Lima', fleetSize: 'Vehículos en tu flota', fleetSizePlaceholder: 'Ej.: 5',
      workshop: 'Nombre del taller o negocio', workshopPlaceholder: 'Ej.: Taller San Martín',
      workshopCity: 'Ciudad o distrito', workshopCityPlaceholder: 'Ej.: San Miguel, Lima',
      workshopSpecialty: 'Especialidad principal', workshopSpecialtyPlaceholder: 'Ej.: Diagnóstico de motores',
      licenseNumber: 'N.º de licencia', licenseNumberPlaceholder: 'Ej.: Q12345678', licenseExpiry: 'Vencimiento de licencia',
      licenseExpiryExample: 'Ejemplo: 31/12/2028. Selecciona el vencimiento que aparece en tu licencia.',
      submit: 'Crear cuenta', haveAccount: '¿Ya tienes una cuenta?', login: 'Iniciar sesión',
      google: 'Registrarse con Google', agreePrefix: 'Acepto los', termsLink: 'Términos', agreeJoin: 'y la', privacyLink: 'Política de privacidad.',
      continueToPayment: 'Continuar al pago'
    },
    plan: {
      selected: 'Plan seleccionado', perMonth: '/ mes', unlimited: 'Vehículos ilimitados', upTo: 'Hasta {count} vehículos',
      change: 'Cambiar plan', ownerOnly: 'Los planes son para dueños de flota, por eso tu perfil queda como Dueño de flota.'
    },
    checkout: {
      title: 'Datos de pago', subtitle: 'Completa tu suscripción al plan {plan}.',
      simulated: 'Pago simulado: es una demostración, no se realiza ningún cobro real. Usa cualquier número de tarjeta de prueba.',
      cardHolder: 'Nombre en la tarjeta', cardNumber: 'Número de tarjeta', expiry: 'Vencimiento (MM/AA)', cvv: 'CVV',
      summary: 'Resumen del pedido', total: 'Total hoy', pay: 'Pagar S/ {amount} y crear cuenta',
      processing: 'Procesando pago…', back: 'Volver a los datos de la cuenta'
    },
    google: {
      title: 'Elige una cuenta', subtitle: 'para continuar en Flotix',
      lastStep: 'Un último paso', lastStepSubtitle: 'Cuéntanos qué rol tienes en la plataforma para terminar de crear tu cuenta.',
      finish: 'Terminar registro', cancel: 'Cancelar',
      existing: 'Continuar con perfil demo', new: 'Continuar como perfil nuevo', close: 'Cerrar'
    },
    errors: {
      invalidCredentials: 'El correo o la contraseña no son correctos.',
      notConfigured: 'No es posible iniciar sesión porque el servicio de autenticación aún no está conectado.',
      googleNotConfigured: 'El inicio de sesión con Google aún no está configurado.',
      profileNotFound: 'No hay un perfil Flotix vinculado a este correo. Completa el registro o contacta al equipo.',
      previewUnavailable: 'El perfil de vista previa local no está disponible.',
      emailTaken: 'Ya existe una cuenta con este correo.', passwordMismatch: 'Las contraseñas no coinciden.',
      termsRequired: 'Debes aceptar para continuar.',
      roleFieldsRequired: 'Completa los datos obligatorios del rol seleccionado.',
      licenseExpired: 'Tu licencia de conducir debe estar vigente.',
      fleetSizeExceedsPlan: 'Tu flota supera los vehículos que permite el plan {plan} ({limit}). Elige un plan mayor.',
      cardInvalid: 'Revisa los datos de tu tarjeta: número, fecha de vencimiento y CVV.'
    }
  },
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
    previewMode: 'Vista previa local activa. Los datos y acciones del API no están disponibles.',
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
    register: 'Registrar vehículo',
    stats: { total: 'Vehículos en flota', available: 'Disponibles', inMaintenance: 'En mantenimiento' },
    empty: 'Aún no registras vehículos en tu flota.',
    cols: { plate: 'Placa', type: 'Tipo', driver: 'Conductor asignado', mileage: 'Kilometraje', status: 'Estado' },
    confirmDelete: '¿Eliminar este vehículo de la flota?',
    deleteError: 'No se pudo eliminar el vehículo',
    deleted: 'Vehículo eliminado',
    form: {
      titleNew: 'Registrar vehículo', titleEdit: 'Editar vehículo',
      subtitle: 'Datos operativos del vehículo y su conductor asignado.',
      back: 'Volver a la flota', plate: 'Placa', type: 'Tipo de vehículo', mileage: 'Kilometraje actual',
      driver: 'Conductor asignado', status: 'Estado',
      saveError: 'No se pudo guardar el vehículo', savedNew: 'Vehículo registrado', savedEdit: 'Vehículo actualizado'
    }
  },
  drivers: {
    title: 'Conductores', subtitle: '{count} conductores registrados',
    stats: { total: 'Total', inRoute: 'En ruta', active: 'Activos' },
    search: 'Buscar por nombre, email o licencia', empty: 'No se encontraron conductores.',
    cols: { driver: 'Conductor', license: 'Licencia', vehicle: 'Vehículo', status: 'Estado' },
    expires: 'Vence {date}', viewProfile: 'Ver perfil'
  },
  fuel: {
    title: 'Control de combustible',
    subtitle: 'Registro de recargas, costo asociado y detección de consumo anómalo por unidad.',
    register: 'Registrar recarga',
    stats: { liters: 'Litros cargados', cost: 'Gasto total (S/)', anomalies: 'Consumos anómalos' },
    empty: 'Aún no hay recargas de combustible registradas.',
    cols: { date: 'Fecha', vehicle: 'Vehículo', liters: 'Litros', cost: 'Costo (S/)', odometer: 'Odómetro', efficiency: 'Rendimiento' },
    anomalous: 'anómalo',
    confirmDelete: '¿Eliminar este registro de combustible?', deleteError: 'No se pudo eliminar el registro', deleted: 'Registro eliminado',
    form: {
      title: 'Registrar recarga de combustible', subtitle: 'Litros cargados, costo asociado y kilometraje al momento de la recarga.',
      back: 'Volver a combustible', vehicle: 'Vehículo', liters: 'Litros', cost: 'Costo total (S/)',
      odometer: 'Kilometraje actual (odómetro)', date: 'Fecha',
      saveError: 'No se pudo registrar la carga', saved: 'Carga de combustible registrada'
    }
  },
  maintenance: {
    title: 'Mantenimiento preventivo y correctivo',
    subtitle: 'Ciclo de vida completo: solicitud, diagnóstico, presupuesto, reparación y cierre.',
    new: 'Nueva solicitud',
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
      back: 'Volver a mantenimiento', vehicle: 'Vehículo', workshop: 'Taller / mecánico',
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
    search: 'Buscar por nombre, ciudad o especialidad', empty: 'No hay talleres afiliados todavía.',
    details: 'Ver detalle', requestService: 'Solicitar servicio',
    noAddress: 'Dirección no registrada', generalMaintenance: 'Mantenimiento general',
    tags: { brakes: 'Frenos', engine: 'Motor', transmission: 'Transmisión', electrical: 'Eléctrico' },
    request: {
      title: 'Solicitar servicio', subtitle: 'Taller: {name}', back: 'Volver a talleres',
      vehicle: 'Vehículo', problem: 'Descripción del problema', submit: 'Enviar solicitud',
      saveError: 'No se pudo enviar la solicitud', saved: 'Solicitud enviada al taller'
    }
  },
  incidents: {
    title: 'Incidencias en ruta',
    subtitle: 'Reporte y seguimiento de fallas o anomalías imprevistas durante la operación.',
    report: 'Reportar incidencia',
    stats: { total: 'Incidencias totales', open: 'Abiertas', resolved: 'Resueltas' },
    empty: 'No hay incidencias reportadas.', reported: 'Reportado: {date}',
    actions: { inspect: 'Marcar en inspección', resolve: 'Marcar como resuelto' },
    confirmDelete: '¿Eliminar esta incidencia?', deleteError: 'No se pudo eliminar la incidencia', deleted: 'Incidencia eliminada',
    updateError: 'No se pudo actualizar la incidencia',
    form: {
      title: 'Reportar incidencia', subtitle: 'Describe la falla o anomalía detectada durante la operación.',
      back: 'Volver a incidencias', vehicle: 'Vehículo', description: 'Descripción del problema', submit: 'Reportar',
      saveError: 'No se pudo reportar la incidencia', saved: 'Incidencia reportada'
    }
  },
  tracking: {
    title: 'Monitoreo en tiempo real',
    subtitle: 'Telemetría GPS simulada cada pocos segundos por cada dispositivo IoT conectado.',
    stats: { connected: 'Dispositivos conectados', avgSpeed: 'Velocidad promedio', packets: 'Paquetes recibidos' },
    empty: 'No hay dispositivos IoT conectados a la flota.',
    radar: 'Radar de flota, Lima (simulado)',
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
    badgeNew: 'Nuevo', buyNow: 'Comprar ahora',
    products: { gps: 'Rastreador GPS Flotix', odometer: 'Odómetro digital Flotix', 'fuel-sensor': 'Sensor de combustible Flotix' },
    orders: 'Historial de pedidos', emptyOrders: 'Aún no has realizado pedidos.',
    cols: { date: 'Fecha', product: 'Producto', quantity: 'Cantidad', total: 'Total', status: 'Estado' },
    advance: 'Avanzar estado',
    success: 'Compra de {qty} unidad(es) de "{name}" procesada correctamente.',
    purchaseError: 'No se pudo procesar la compra', updateError: 'No se pudo actualizar el pedido'
  },
  reports: {
    title: 'Reportes y analítica',
    subtitle: 'Consolidación de datos operativos e históricos para la toma de decisiones gerenciales.',
    export: 'Exportar reporte',
    stats: { vehicles: 'Vehículos', fuel: 'Gasto combustible', maintenance: 'Gasto mantenimiento', completed: 'Mant. completados' },
    fuelByVehicle: 'Gasto de combustible por vehículo',
    needMore: 'Se necesitan al menos 2 registros de combustible por vehículo para generar el comparativo.',
    history: 'Historial de reportes exportados', emptyHistory: 'Aún no has exportado ningún reporte.',
    exportError: 'No se pudo generar el reporte', exported: 'Reporte generado',
    reportTypeFuel: 'Reporte de consumo de combustible',
    file: {
      title: 'FLOTIX: Reporte de Rendimiento de Flota (exportación simulada)',
      generated: 'Generado: {date}', type: 'Tipo: {type}', period: 'Período: {period}',
      vehicles: 'Vehículos en flota: {n}', fuelSpend: 'Gasto total en combustible: S/ {n}',
      maintenanceSpend: 'Gasto total en mantenimiento: S/ {n}', completedMaintenance: 'Mantenimientos completados: {n}',
      totals: 'Registros del período: {records} | Litros: {liters} | Costo: S/ {cost}',
      line: '{plate}: {records} registros | {liters} L | S/ {cost}',
      comparison: 'Comparativo por vehículo (mín. 2 registros de combustible):',
      comparisonLine: '{plate}: S/ {cost} | {eff} km/L',
      fileName: 'flotix-reporte-{id}.txt'
    }
  },
  settings: {
    title: 'Configuración', subtitle: 'Gestiona tu cuenta, flota y preferencias',
    tabs: { account: 'Mi cuenta', fleet: 'Flota', notifications: 'Notificaciones', billing: 'Facturación' },
    saved: 'Cambios guardados', prefsSaved: 'Preferencias guardadas', saveChanges: 'Guardar cambios',
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
      paymentMethod: 'Método de pago', endingIn: 'Terminada en {last4}', expires: 'Expira {date}', goStore: 'Ir a la tienda IoT'
    }
  },
  notifications: {
    title: 'Notificaciones', markAllRead: 'Marcar todas como leídas', empty: 'No tienes notificaciones.',
    viewAll: 'Ver todas las alertas'
  }
}
