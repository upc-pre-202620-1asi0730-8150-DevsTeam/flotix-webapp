# Contributing to Flotix Web Application

Thank you for your interest in contributing to **Flotix**, the intelligent fleet management platform.  
This document outlines the conventions, workflows, and standards we follow to keep the codebase organized and maintainable.

Please take a moment to read this guide before opening your first pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Architecture (Domain-Driven Design)](#project-architecture-domain-driven-design)
- [Branching Strategy (Git Flow)](#branching-strategy-git-flow)
- [Commit Messages (Conventional Commits)](#commit-messages-conventional-commits)
- [Versioning (Semantic Versioning)](#versioning-semantic-versioning)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Internationalization](#internationalization)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

---

## Code of Conduct

This project and everyone participating in it is expected to act respectfully and professionally.  
Be kind, constructive, and inclusive in all discussions, code reviews, and issue comments.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or equivalent package manager)
- A running instance of the **Flotix backend API** (ASP.NET Core + PostgreSQL)

### Setup

```bash
# Clone the repository
git clone https://github.com/upc-pre-202620-1asi0730-8150-DevsTeam/flotix-webapp6.git
cd flotix-webapp6

# Install dependencies
npm install

# Configure the backend API URL (create a .env file)
echo "VITE_API_BASE_URL=http://localhost:8080" > .env

# Start the development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run seed` | Run the demo seed script |

---

## Project Architecture (Domain-Driven Design)

Flotix follows **Domain-Driven Design (DDD)**, organizing the codebase into **Bounded Contexts**.  
Each context is a self-contained module with its own views, stores, services, and repositories.

### Data Flow

```
View (.vue) → Store (Pinia) → Application Service → Repository (HTTP) → API
```

### Bounded Contexts

The `src/` directory contains one folder per bounded context:

| Context | Folder | Responsibility |
|---------|--------|----------------|
| **Identity & Access** | `identity-access/` | Authentication, profiles, and security |
| **Fleet Management** | `fleet-management/` | Vehicle and fleet management |
| **Fuel Control** | `fuel-control/` | Fuel consumption tracking |
| **Maintenance** | `maintenance/` | Maintenance request workflow |
| **Incidents** | `incidents/` | Incident reporting and management |
| **Tracking** | `tracking/` | Real-time GPS monitoring (SignalR) |
| **Alerts** | `alerts/` | Alerts and notifications |
| **IoT Commerce** | `iot-commerce/` | Digital experience and IoT orders |
| **Analytics** | `analytics/` | Reporting and analytics dashboards |

### Shared Infrastructure

| Folder | Purpose |
|--------|---------|
| `shared/` | Common utilities, HTTP client, API repository, composables |
| `platform/` | Core layout, navigation, and global UI structure |
| `router/` | Vue Router configuration |
| `internationalization/` | i18n locale files and configuration |
| `theme/` | PrimeVue theme configuration |
| `assets/` | Static assets (images, styles) |

### Adding Code to a Bounded Context

When working within a context, place your files in the corresponding folder:

```
src/<context>/
├── views/          # Vue components (pages)
├── stores/         # Pinia state management
├── services/       # Application services (business logic)
├── repositories/   # API repositories (HTTP layer)
├── domain/         # Domain entities and value objects
└── assets/         # Context-specific static assets
```

### Key Conventions

- **Each context is independent**: Minimize cross-context dependencies.
- **Domain entities** live in `domain/` and should not depend on infrastructure.
- **Repositories** map domain entities to API resources (e.g., `plate` ↔ `licensePlate`).
- **All operations are asynchronous**.
- **Shared code** belongs in `shared/`, not duplicated across contexts.

---

## Branching Strategy (Git Flow)

This project follows the **[Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)** branching model.

### Branch Naming

| Branch Type | Pattern | Example |
|-------------|---------|---------|
| **Main** | `main` | Production-ready code |
| **Develop** | `develop` | Integration branch for features |
| **Feature** | `feature/<context>-<short-description>` | `feature/fleet-management-add-vehicle-form` |
| **Bugfix** | `bugfix/<context>-<short-description>` | `bugfix/maintenance-status-transition` |
| **Release** | `release/<version>` | `release/2.2.0` |
| **Hotfix** | `hotfix/<short-description>` | `hotfix/api-timeout-handling` |

### Workflow

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/<context>-<description>
   ```

2. **Develop and commit** your changes (see [Commit Messages](#commit-messages-conventional-commits)).

3. **Push and open a Pull Request** against `develop`:
   ```bash
   git push origin feature/<context>-<description>
   ```

4. **After review and approval**, merge the PR into `develop` and delete the branch.

5. **Releases** are created from `develop` → `release/<version>` → merged into `main` and `develop`, then tagged.

### Important Rules

- **Never commit directly to `main` or `develop`**.
- Always keep feature branches up to date with `develop`.
- Close the associated issue when merging the PR.

---

## Commit Messages (Conventional Commits)

All commits must follow the **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code formatting (no logic change) |
| `refactor` | Code refactoring (no feature or fix) |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Maintenance tasks |
| `revert` | Reverting a previous commit |

### Scope

Use the bounded context name or a shared area as the scope:

- `fleet-management`, `fuel-control`, `maintenance`, `incidents`, `tracking`, `alerts`, `iot-commerce`, `analytics`, `identity-access`
- `shared`, `platform`, `router`, `i18n`, `theme`

### Examples

```bash
# Adding a feature in the fleet management context
git commit -m "feat(fleet-management): add vehicle registration form with validation"

# Fixing a bug in the maintenance workflow
git commit -m "fix(maintenance): correct status transition from approved to in-repair"

# Documentation update
git commit -m "docs: update API endpoint documentation for fuel reports"

# Refactoring shared infrastructure
git commit -m "refactor(shared): extract API error handling into useApiFeedback composable"

# Breaking change
git commit -m "feat(tracking): redesign real-time monitoring dashboard

BREAKING CHANGE: SignalR hub endpoint changed from /hubs/gps to /hubs/monitoring"
```

### Commit Body and Footer

- Use the **body** to explain *what* and *why*, not *how*.
- Use the **footer** for references and breaking changes:
  ```
  Closes #42
  BREAKING CHANGE: description of the breaking change
  ```

---

## Versioning (Semantic Versioning)

This project follows **[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)**.

### Version Format

```
MAJOR.MINOR.PATCH
```

| Version Part | Increment When... |
|--------------|-------------------|
| **MAJOR** | You make incompatible API or breaking changes |
| **MINOR** | You add functionality in a backward-compatible manner |
| **PATCH** | You make backward-compatible bug fixes |

### Examples

- `2.1.0` → New backend connection layer added (backward-compatible feature)
- `2.0.0` → Complete rewrite with DDD architecture (breaking change)
- `2.1.1` → Fixed BOM encoding issue in `netlify.toml` (bug fix)

### Managing Versions

The version is defined in `package.json`. When preparing a release:

1. Update the version in `package.json`.
2. Update `CHANGELOG.md` — move entries from `[Unreleased]` to the new version section.
3. Create a git tag:
   ```bash
   git tag -a v2.2.0 -m "Release v2.2.0"
   git push origin v2.2.0
   ```

---

## Pull Request Guidelines

1. **Title**: Use Conventional Commits format.
   - Example: `feat(fleet-management): add vehicle registration form`

2. **Description**: Include:
   - **What** changed and **why**.
   - Links to the related issue (`Closes #XX`).
   - Screenshots for UI changes.
   - Notes on any breaking changes or migration steps.

3. **Checklist** (include in PR description):
   - [ ] Code follows the project's DDD structure.
   - [ ] Commit messages follow Conventional Commits.
   - [ ] Changes are backward-compatible (or breaking changes are documented).
   - [ ] Internationalization keys are added for all new UI text.
   - [ ] The build passes (`npm run build`).
   - [ ] No console errors or warnings in the browser.

4. **Reviews**: At least one review approval is required before merging.

5. **Squash**: PRs are squash-merged into `develop` to keep history clean.

---

## Coding Standards

### Vue Components

- Use the **Composition API** with `<script setup>`.
- Keep components focused on a single responsibility.
- Place page-level components in `views/` and reusable components in `shared/` or the context's component folder.

### Naming Conventions

- **Components**: PascalCase (e.g., `VehicleList.vue`)
- **Stores**: camelCase with `use` prefix (e.g., `useFleetStore.js`)
- **Services**: camelCase with descriptive names (e.g., `maintenanceService.js`)
- **Repositories**: camelCase ending in `Repository` (e.g., `vehicleRepository.js`)
- **Files**: kebab-case (e.g., `vehicle-registration-form.vue`)

### Code Style

- Use **2 spaces** for indentation.
- Prefer **const** over **let**; avoid **var**.
- Use **template literals** for string interpolation.
- Keep lines under **100 characters** where practical.
- Add comments only when the *why* isn't obvious from the code.

### Error Handling

- Use the `useApiFeedback` composable for API error notifications.
- Handle 400, 404, and 409 responses explicitly.
- Never silently swallow errors — log or display them.

---

## Internationalization

All user-facing text must be internationalized. The application supports **English (en)** and **Spanish (es)**.

### Adding Translations

1. Add the new key to both `en` and `es` objects in the appropriate file:
   - `src/shared/infrastructure/content.js` — menus and panels
   - `src/shared/infrastructure/content-pages.js` — screen-specific text
   - `src/shared/infrastructure/domain-text.js` — domain value translations

2. Use the translation composable in your component:
   ```vue
   <template>
     <p>{{ t('myNewKey') }}</p>
   </template>

   <script setup>
   import { useI18n } from 'vue-i18n'
   const { t } = useI18n()
   </script>
   ```

3. **Never hardcode user-facing strings** in templates or components.

---

## Running Tests

Before submitting a PR, verify your changes:

```bash
# Build the production bundle
npm run build

# Preview the build locally
npm run preview
```

Check that:
- The application loads without errors.
- Navigation between all bounded contexts works.
- API calls succeed (or fail gracefully when the backend is unavailable).
- Both English and Spanish translations display correctly.

---

## Deployment

The application is deployed to **Netlify**.

### Configuration

- `netlify.toml` handles SPA routing with fallback to `index.html`.
- Set `VITE_API_BASE_URL` in **Netlify → Site settings → Environment variables**.
- Add the Netlify URL to the backend's CORS allowed origins.

### Deployment Trigger

Merges to `main` trigger an automatic deployment.  
Ensure `CHANGELOG.md` is updated before creating the release merge.

---

## Getting Help

- Check the [README.md](README.md) for architecture and setup details.
- Review the [CHANGELOG.md](CHANGELOG.md) for recent changes.
- Open a **GitHub Issue** with the label `question` for discussions.

---

Thank you for contributing to Flotix! 🚗💨
