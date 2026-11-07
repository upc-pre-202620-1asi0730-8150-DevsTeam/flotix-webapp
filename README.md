# Flotix — Web Application (Frontend)

SPA del proyecto **Flotix** (UPC · Aplicaciones Web · Developers Team),
construida en **Vue 3 + Vite + Pinia + PrimeVue**, siguiendo **Domain-Driven
Design (DDD)** con una carpeta independiente por cada **Bounded Context**:

1. `identity-access` — Identity, Profiles & Security (sesión local, ver nota)
2. `fleet-management` — Vehicle & Fleet Management
3. `fuel-control` — Fuel Control
4. `maintenance` — Maintenance Management
5. `incidents` — Incident Management
6. `tracking` — Real-Time Monitoring / Fleet Tracking
7. `alerts` — Alerts & Notifications
8. `iot-commerce` — Digital Experience / IoT Commerce
9. `analytics` — Reporting & Analytics

## Conexión con el backend

Todos los contextos (excepto identidad) consumen la **API REST de Flotix** (ASP.NET Core + PostgreSQL en Neon).
La dirección de la API se define con una variable de entorno de Vite:

```bash
cp .env.example .env        # y ajusta VITE_API_BASE_URL si hace falta
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_BASE_URL` | URL base de la API (sin `/api/v1`) | `http://localhost:5223` |

> Las variables `VITE_*` se incluyen en el JavaScript público del navegador: **no pongas secretos** en ellas.
> `.env` está en `.gitignore`; solo se sube `.env.example`.

### Arquitectura de la capa de datos

```
vista (.vue) → store (Pinia) → servicio de aplicación → repositorio (HTTP) → API
```

- `src/shared/infrastructure/http-client.js`: cliente axios (URL base, header `Accept-Language`, errores normalizados en `ApiError`).
- `src/shared/infrastructure/api-repository.js`: repositorio genérico (`getAll`, `getById`, `add`, `update`, `remove`).
- Cada contexto tiene su repositorio que **mapea** la entidad del dominio al recurso de la API
  (por ejemplo `plate` ↔ `licensePlate`, `totalCost` ↔ `cost`, `faultDescription` ↔ `description`).
- Todas las operaciones son **asíncronas**. Al abrir el layout se cargan todos los contextos (`shared/infrastructure/bootstrap.js`);
  si la API no responde se muestra un aviso con botón **Reintentar**.
- Los errores de la API (400/404/409) se muestran como notificaciones (`useApiFeedback`).
- El monitoreo GPS recibe posiciones en tiempo real por **SignalR** (`/hubs/monitoring`). Mientras no haya dispositivos físicos,
  el navegador envía paquetes de telemetría simulados a `POST /telemetry-data`.

### Reglas del backend que impactan la UI

- Una solicitud de mantenimiento **requiere un taller (mecánico)** desde que se crea.
- El flujo de mantenimiento es estricto: `Pendiente → Presupuestado → Aprobado → En reparación → Completado`
  (una transición inválida responde `409`). Al iniciar/terminar la reparación el frontend cambia el estado del vehículo.
- Las placas de vehículos son únicas (`409` si se repite).
- Los pedidos IoT guardan cantidad y total; el producto se deduce por el precio unitario del catálogo.

### Perfiles (sin login ni registro)

La aplicación **no tiene inicio de sesión ni registro**: abre directamente en el panel. El backend no tiene módulo de identidad,
así que los tres actores de la plataforma (Dueño de flota, Conductor y Mecánico/Taller) se eligen con el selector **Ver como / View as**
del encabezado, y el perfil elegido se recuerda en el navegador (`localStorage`). Cada perfil muestra su propio panel y menú.
Los perfiles demo tienen GUID fijos (`identity-access/domain/model/value-objects/demo-users.js`) porque la API guarda
referencias a usuarios como GUID.

### Idiomas (inglés y español)

Toda la interfaz está traducida: menú, paneles, listas, formularios, confirmaciones, notificaciones, errores, calendario,
configuración y el reporte exportado. El idioma se cambia con el botón **EN / ES** del encabezado (se recuerda en el navegador)
y también se envía a la API (`Accept-Language`) para que sus mensajes de error lleguen en el mismo idioma.

- Los textos viven en `src/shared/infrastructure/content.js` (menú y paneles) y `content-pages.js` (resto de pantallas), con las mismas claves en `en` y `es`.
- Los valores que la API guarda en español (estados como `En reparación`, tipos de vehículo, textos de alertas generados por el sistema)
  se muestran traducidos con `shared/infrastructure/domain-text.js`; el dato guardado no cambia.
- Lo que escribe el usuario (descripciones de fallas o incidencias, nombres) se muestra tal cual.

## Ejecutar

```bash
npm install
npm run dev          # http://localhost:5173  (la API debe estar en VITE_API_BASE_URL)
npm run build        # genera dist/
```

La API debe permitir el origen del frontend en CORS (`Cors:Origins` / variable `Cors__Origins__0` del backend).

### Datos de demostración (opcional)

La base de datos nueva está vacía. Para cargar vehículos, combustible, una incidencia, dispositivos y un pedido de ejemplo:

```bash
npm run seed                       # contra VITE_API_BASE_URL o http://localhost:5223
npm run seed -- https://mi-api     # contra otra API
npm run seed -- --force            # aunque ya existan vehículos
```

## Despliegue (Netlify)

`netlify.toml` ya publica `dist/` con redirección SPA. En **Site settings → Environment variables** define
`VITE_API_BASE_URL` con la URL pública de la API, y en el backend agrega la URL de Netlify a los orígenes CORS.
