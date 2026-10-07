/**
 * Static en/es copy for the parts of the app that get full i18n
 * coverage in this pass: the sidebar/header shell, the three
 * role-specific dashboards (Owner, Driver, Mechanic) and the auth
 * screens. Other detail pages keep their page-header title wired to
 * `nav` below (so navigation stays consistent when the locale is
 * switched) while their in-page content is translated incrementally.
 */
export const content = {
  en: {
    nav: {
      dashboard: { label: 'Dashboard', context: 'Overview' },
      fleet: { label: 'Vehicles', context: 'Vehicle & Fleet Management' },
      drivers: { label: 'Drivers', context: 'Vehicle & Fleet Management' },
      fuel: { label: 'Fuel', context: 'Fuel Control' },
      maintenance: { label: 'Maintenance', context: 'Maintenance Management' },
      incidents: { label: 'Incidents', context: 'Incident Management' },
      tracking: { label: 'GPS Tracking', context: 'Real-Time Monitoring / Fleet Tracking' },
      workshops: { label: 'Workshops', context: 'Maintenance Management' },
      reports: { label: 'Reports', context: 'Reporting & Analytics' },
      commerce: { label: 'IoT Devices', context: 'Digital Experience / IoT Commerce' },
      alerts: { label: 'Alerts', context: 'Alerts & Notifications' },
      settings: { label: 'Settings', context: 'Platform' }
    },
    header: {
      tagline: 'Your fleet-management, under control',
      logout: 'Log out',
      sidebarSummaryOwner: 'Active fleet-management',
      sidebarSummaryDriver: 'My vehicle',
      sidebarSummaryMechanic: 'Pending requests',
      unassigned: 'Not assigned'
    },
    common: {
      viewAll: 'View all',
      available: 'available',
      none: 'None',
      loading: 'Loading…'
    },
    auth: {
      brand: 'Manage your fleet-management from a single place',
      brandSubtitle:
        'Real-time GPS monitoring, fuel control, preventive maintenance and more. The platform that replaces your spreadsheets and WhatsApp groups.',
      features: [
        'Real-time GPS monitoring',
        'Fuel consumption control',
        'Preventive maintenance alerts',
        'Automatic exportable reports'
      ],
      login: {
        title: 'Welcome back',
        subtitle: 'Enter your credentials to continue',
        email: 'Email',
        password: 'Password',
        forgot: 'Forgot your password?',
        submit: 'Log in',
        noAccount: "Don't have an account?",
        register: 'Sign up',
        roleTabs: { owner: { title: 'Fleet Owner', subtitle: 'Full management' }, driver: { title: 'Driver', subtitle: 'Mobile view' }, mechanic: { title: 'Workshop', subtitle: 'Requests view' } }
      },
      register: {
        title: 'Create your Flotix account',
        chooseRoleTitle: 'How will you use Flotix?',
        chooseRoleSubtitle: "Choose your role and we'll tailor the sign-up to it.",
        back: '← Choose a different role',
        boundedContext: 'Bounded Context: Identity, Profiles & Security',
        name: 'Full name',
        email: 'Email',
        password: 'Password',
        role: 'UserRole',
        licenseNumber: "Driver's license number",
        licenseExpiry: 'License expiry date',
        companyOptional: 'Company (optional)',
        workshopOptional: 'Workshop name (optional)',
        submit: 'Create account',
        haveAccount: 'Already have an account?',
        login: 'Log in'
      }
    },
    notFound: {
      title: 'Page not found',
      subtitle: "The route you're looking for doesn't exist in Flotix.",
      back: 'Back to dashboard'
    },
    dashboard: {
      owner: {
        title: 'Dashboard',
        urgentPrefix: 'Urgent:',
        urgentSuffix: 'requires immediate attention.',
        viewNow: 'View now',
        stats: { activeFleet: 'Active fleet-management', inMaintenance: 'In maintenance', fuelMonth: 'Fuel (this month)', openAlerts: 'Open alerts' },
        fleetStatus: 'Fleet status',
        pendingMaintenance: 'Pending maintenance',
        noPending: 'Nothing pending 🎉',
        recentActivity: 'Recent activity',
        noActivity: 'No recent activity yet.',
        quickActions: 'Quick actions',
        actions: { registerVehicle: 'Register vehicle', viewReports: 'View reports', buyIot: 'Buy IoT device', workshops: 'Affiliated workshops' },
        fuelTrend: 'Fuel spend — last refuels'
      },
      driver: {
        title: 'Hello',
        subtitle: 'Here is what your day looks like',
        noVehicle: "You don't have an assigned vehicle yet.",
        myVehicle: 'My assigned vehicle',
        mileage: 'Mileage',
        status: 'Status',
        stats: { mileage: 'Current mileage', lastEfficiency: 'Last efficiency', openIncidents: 'My open incidents', unreadAlerts: 'Unread alerts' },
        kmPerLiter: 'km/L',
        quickActions: 'Quick actions',
        actions: { logFuel: 'Log fuel', reportIncident: 'Report incident', viewAlerts: 'View alerts' },
        upcomingMaintenance: 'Upcoming maintenance',
        noMaintenance: 'No maintenance scheduled for your vehicle.',
        recentFuel: 'My recent fuel logs',
        noFuel: "You haven't logged any fuel yet.",
        tipTitle: 'Efficient-driving tip',
        tip: 'Keeping a steady speed and avoiding harsh braking can improve fuel efficiency by up to 15%.'
      },
      mechanic: {
        title: 'Hello',
        subtitle: 'Here is your workshop activity',
        stats: { pending: 'Pending requests', inRepair: 'In repair', completedMonth: 'Completed (this month)', revenueMonth: 'Estimated revenue (month)' },
        recentRequests: 'Recent requests',
        noRequests: 'No requests assigned to your workshop yet.',
        vehiclesInShop: 'Vehicles currently at your workshop',
        noVehiclesInShop: 'No vehicles in your workshop right now.',
        myWorkshop: 'My workshop profile',
        editProfile: 'Edit in settings',
        viewAllRequests: 'View all requests',
        rating: 'Rating'
      }
    }
  },

  es: {
    nav: {
      dashboard: { label: 'Dashboard', context: 'Panel general' },
      fleet: { label: 'Vehículos', context: 'Vehicle & Fleet Management' },
      drivers: { label: 'Conductores', context: 'Vehicle & Fleet Management' },
      fuel: { label: 'Combustible', context: 'Fuel Control' },
      maintenance: { label: 'Mantenimiento', context: 'Maintenance Management' },
      incidents: { label: 'Incidencias', context: 'Incident Management' },
      tracking: { label: 'Monitoreo GPS', context: 'Real-Time Monitoring / Fleet Tracking' },
      workshops: { label: 'Talleres', context: 'Maintenance Management' },
      reports: { label: 'Reportes', context: 'Reporting & Analytics' },
      commerce: { label: 'Dispositivos IoT', context: 'Digital Experience / IoT Commerce' },
      alerts: { label: 'Alertas', context: 'Alerts & Notifications' },
      settings: { label: 'Configuración', context: 'Platform' }
    },
    header: {
      tagline: 'Tu flota bajo control',
      logout: 'Salir',
      sidebarSummaryOwner: 'Flota activa',
      sidebarSummaryDriver: 'Mi vehículo',
      sidebarSummaryMechanic: 'Solicitudes pendientes',
      unassigned: 'Sin asignar'
    },
    common: {
      viewAll: 'Ver todos',
      available: 'disponibles',
      none: 'Ninguno',
      loading: 'Cargando…'
    },
    auth: {
      brand: 'Gestiona tu flota desde un solo lugar',
      brandSubtitle:
        'Monitoreo GPS en tiempo real, control de combustible, mantenimiento preventivo y más. La plataforma que reemplaza tus hojas de cálculo y grupos de WhatsApp.',
      features: [
        'Monitoreo GPS en tiempo real',
        'Control de consumo de combustible',
        'Alertas de mantenimiento preventivo',
        'Reportes automáticos exportables'
      ],
      login: {
        title: 'Bienvenido de vuelta',
        subtitle: 'Ingresa tus credenciales para continuar',
        email: 'Correo electrónico',
        password: 'Contraseña',
        forgot: '¿Olvidaste tu contraseña?',
        submit: 'Iniciar sesión',
        noAccount: '¿No tienes cuenta?',
        register: 'Regístrate',
        roleTabs: { owner: { title: 'Dueño de flota', subtitle: 'Gestión completa' }, driver: { title: 'Conductor', subtitle: 'Vista móvil' }, mechanic: { title: 'Mecánica / Taller', subtitle: 'Vista solicitudes' } }
      },
      register: {
        title: 'Crear cuenta en Flotix',
        chooseRoleTitle: '¿Cómo vas a usar Flotix?',
        chooseRoleSubtitle: 'Elige tu rol y adaptaremos el registro a él.',
        back: '← Elegir otro rol',
        boundedContext: 'Bounded Context: Identity, Profiles & Security',
        name: 'Nombre completo',
        email: 'Correo electrónico',
        password: 'Contraseña',
        role: 'Rol',
        licenseNumber: 'N° de licencia de conducir',
        licenseExpiry: 'Fecha de expiración de licencia',
        companyOptional: 'Empresa (opcional)',
        workshopOptional: 'Nombre del taller (opcional)',
        submit: 'Crear cuenta',
        haveAccount: '¿Ya tienes cuenta?',
        login: 'Inicia sesión'
      }
    },
    notFound: {
      title: 'Página no encontrada',
      subtitle: 'La ruta que buscas no existe en Flotix.',
      back: 'Volver al dashboard'
    },
    dashboard: {
      owner: {
        title: 'Dashboard',
        urgentPrefix: 'Urgente:',
        urgentSuffix: 'requiere atención inmediata.',
        viewNow: 'Ver ahora',
        stats: { activeFleet: 'Flota activa', inMaintenance: 'En mantenimiento', fuelMonth: 'Combustible (mes)', openAlerts: 'Alertas abiertas' },
        fleetStatus: 'Estado de flota',
        pendingMaintenance: 'Mantenimientos pendientes',
        noPending: 'Sin pendientes 🎉',
        recentActivity: 'Actividad reciente',
        noActivity: 'Aún no hay actividad reciente.',
        quickActions: 'Accesos rápidos',
        actions: { registerVehicle: 'Registrar vehículo', viewReports: 'Ver reportes', buyIot: 'Comprar dispositivo IoT', workshops: 'Talleres afiliados' },
        fuelTrend: 'Gasto en combustible — últimas cargas'
      },
      driver: {
        title: 'Hola',
        subtitle: 'Esto es lo que tienes hoy',
        noVehicle: 'Aún no tienes un vehículo asignado.',
        myVehicle: 'Mi vehículo asignado',
        mileage: 'Kilometraje',
        status: 'Estado',
        stats: { mileage: 'Kilometraje actual', lastEfficiency: 'Último rendimiento', openIncidents: 'Mis incidencias abiertas', unreadAlerts: 'Alertas sin leer' },
        kmPerLiter: 'km/L',
        quickActions: 'Accesos rápidos',
        actions: { logFuel: 'Registrar combustible', reportIncident: 'Reportar incidencia', viewAlerts: 'Ver alertas' },
        upcomingMaintenance: 'Próximo mantenimiento',
        noMaintenance: 'No hay mantenimiento programado para tu vehículo.',
        recentFuel: 'Mis cargas de combustible recientes',
        noFuel: 'Aún no has registrado cargas de combustible.',
        tipTitle: 'Consejo de conducción eficiente',
        tip: 'Mantener una velocidad constante y evitar frenadas bruscas puede mejorar el rendimiento hasta en un 15%.'
      },
      mechanic: {
        title: 'Hola',
        subtitle: 'Esta es la actividad de tu taller',
        stats: { pending: 'Solicitudes pendientes', inRepair: 'En reparación', completedMonth: 'Completadas (mes)', revenueMonth: 'Ingresos estimados (mes)' },
        recentRequests: 'Solicitudes recientes',
        noRequests: 'Aún no hay solicitudes asignadas a tu taller.',
        vehiclesInShop: 'Vehículos actualmente en tu taller',
        noVehiclesInShop: 'No hay vehículos en tu taller por ahora.',
        myWorkshop: 'Perfil de mi taller',
        editProfile: 'Editar en configuración',
        viewAllRequests: 'Ver todas las solicitudes',
        rating: 'Calificación'
      }
    }
  }
}
