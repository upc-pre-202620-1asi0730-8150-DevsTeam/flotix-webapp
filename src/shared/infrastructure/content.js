import { pagesEn, pagesEs } from './content-pages.js'

/**
 * Static en/es copy for the whole app: the shell (sidebar/header), the three
 * role dashboards, and every page (see content-pages.js).
 */
const base = {
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
      platform: 'Flotix Platform',
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
      platform: 'Flotix Platform',
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

function merge(a, b) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && typeof out[k] === 'object' ? merge(out[k], v) : v
  }
  return out
}

export const content = {
  en: merge(base.en, pagesEn),
  es: merge(base.es, pagesEs)
}
