# Changelog

All notable changes to the **Flotix Web Application** will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2026-11-09

### Added

- **PrimeUI license configuration**: Added PrimeUI license key for commercial component support.
- **Backend connection layer**: Integrated frontend with the Flotix ASP.NET Core + PostgreSQL API.
  - Added `http-client.js` (Axios-based HTTP client with base URL, `Accept-Language` header, and normalized `ApiError`).
  - Added `api-repository.js` (generic repository with `getAll`, `getById`, `add`, `update`, `remove`).
  - Added `bootstrap.js` (loads all bounded contexts on layout open; shows retry banner on API failure).
  - Added `useApiFeedback` composable for API error notifications (400/404/409).
  - Configured backend port connection (8080).
- **SignalR real-time monitoring**: Connected to `/hubs/monitoring` for live GPS telemetry; browser sends simulated telemetry packets to `POST /telemetry-data`.

### Changed

- Updated README with backend connection architecture and deployment instructions.

## [2.0.0] - 2026-10-06

### Added

This major release introduces the complete Flotix fleet management SPA built with **Vue 3 + Vite + Pinia + PrimeVue**, following **Domain-Driven Design (DDD)** with one folder per Bounded Context.

#### Bounded Contexts

- **Identity & Access** (`identity-access`): Identity, profiles, and security (local session).
- **Shared** (`shared`): Shared infrastructure, utilities, and common components.
- **Platform** (`platform`): Core platform layout and navigation.
- **Fuel Control** (`fuel-control`): Fuel consumption tracking and management.
- **Maintenance** (`maintenance`): Maintenance request workflow (`Pendiente → Presupuestado → Aprobado → En reparación → Completado`).
- **Incidents** (`incidents`): Incident reporting and management.
- **Alerts** (`alerts`): Alerts and notifications system.
- **Fleet Management** (`fleet-management`): Vehicle and fleet management.
- **Analytics** (`analytics`): Reporting and analytics dashboards.
- **Tracking** (`tracking`): Real-time monitoring and fleet tracking.
- **IoT Commerce** (`iot-commerce`): Digital experience and IoT commerce orders.

#### Internationalization

- Full i18n support with **English (EN)** and **Spanish (ES)** translations.
- Translated UI: menus, panels, lists, forms, confirmations, notifications, errors, calendar, settings, and exported reports.
- Language toggle button in the header (persisted in browser).
- `Accept-Language` header sent to the API for localized error messages.
- Translation files: `content.js` (menus/panels), `content-pages.js` (screens), `domain-text.js` (domain value translations).

#### Infrastructure

- **Vite** build tool with Vue 3 plugin.
- **Pinia** for state management.
- **PrimeVue** component library with PrimeFlex utilities and PrimeIcons.
- **Vue Router** for SPA navigation.
- **Axios** for HTTP requests.
- **Netlify** deployment configuration (`netlify.toml` with SPA redirect rules).
- Demo seed script (`scripts/seed-demo.mjs`).

### Fixed

- Removed BOM from `netlify.toml` to prevent deployment issues.
- Added `src/main.js` and `netlify.toml` for proper application entry point.

---

## Project Overview

**Flotix** is an intelligent fleet management platform built as a single-page application using Domain-Driven Design principles. The frontend communicates with an ASP.NET Core + PostgreSQL backend API, supporting real-time GPS monitoring via SignalR and full internationalization.

### Architecture

```
View (.vue) → Store (Pinia) → Application Service → Repository (HTTP) → API
```

[Unreleased]: https://github.com/upc-pre-202620-1asi0730-8150-DevsTeam/flotix-webapp6/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/upc-pre-202620-1asi0730-8150-DevsTeam/flotix-webapp6/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/upc-pre-202620-1asi0730-8150-DevsTeam/flotix-webapp6/compare/v1.0.0...v2.0.0
