# BifiApp — Agent Guide

## Stack

Angular 20 monorepo (Turborepo) with npm@11.8.0. Tailwind CSS v4 (PostCSS plugin), PrimeNG 20 (Noir theme via `@primeuix/themes`), Firebase auth, Karma+Jasmine tests. Typescript 5.8, `moduleResolution: "bundler"`.

## Projects

- **app** (only one): `projects/asset-roster-demo` — serves on `:4200`
- **libs** (14): `base-app`, `asset-roster`, `l10n_cr_einvoice`, `calendar`, `website`, `helpdesk`, `tasks`, `projects`, `aduanix`, `sales`, `purchases`, `inventory`, `accounting`, `email-marketing`
- `base-app` is a **multi-entrypoint library** with 25 sub-entrypoints — each under `projects/base-app/<name>/` with its own `ng-package.json`
- All libs expose via `@avalantec/<name>` path aliases from root `tsconfig.json`

## Base-App Capabilities

`@avalantec/base-app` provides shared infrastructure. **Always check if base-app already provides something before adding new code in feature libs.** Each sub-entrypoint is imported as `@avalantec/base-app/<name>`.

### Framework & Infrastructure

| Entrypoint | Provides | Used by |
|---|---|---|
| `core` | `ToastManager`, `ToolbarManager`, `SidenavManager`, `DebugManager`, `DynamicBreadcrumbService`, `ColWidthManager`, `BaseDialog`, `Icon`/`Text`/`DebugMode` directives, `SplitCaps` pipe, `debouncedSignal`, `maybeSignal`, `<signal>` helper types | All projects |
| `routing` | `MainMenuManager.addItems()`, `MainRoutingManager.addRouting()`, `BaseMenuManager`, `BaseRoutingManager`, `MainMenu` component, `AUTH_ROUTES`/`BASE_APP_ROUTES`/`SETTINGS_ROUTES`, `withLibraryInterceptors`, `UserShortcutsService`, `NotificationCenterService` | All feature libs register via `provide*()` functions |
| `auth` | Firebase auth, `authGuard`/`noAuthGuard`/`permissionGuard`, `HasPermission` directive, `AuthPage`/`PasswordPage`/`AccessTokenDialog`, `APP_AUTH_SERVICE` token, `provideAuth`, `FirebaseAuthService`, `AuthTokenInterceptor` | All projects (routing, ui, users, resource, etc.) |
| `form` | `BaseForm<T>`, `TypedFormBuilder`, `FormModule`, `FormValueState`, `ControlsOf`, form components (`FormField`, `FormError`, `FormActions`, `FormSection`, `FormLayout`, `FormCodeEditor`, `FormUploader`, `FormNavigator`, `FormPreview`, etc.), directives (`FormControlExtension`, `FormActionsHandler`, `TranslatedErrors`), `FORM_ERRORS` provider, `ExtendedFormArray`, `dirtyUtils`, `errorStateTracker`, `arrayValidators` | All feature libs |
| `resource` | `ApiRequestManager` (full CRUD lifecycle), `TableLayout`, `FilterBar`, `SearchBar`, `ButtonsActions`, `TreeList`, `GanttView`/`TimelineView`/`CalendarView`, `FileResolver`, `FilterManager`, `PaginationManager`, `SortManager`, `ListStateManager`, `InfiniteScrollManager`, `ResourceManager`, `BackendListModels`, `NotificationMessageResolver`, `CrudActivityHistories`, `DynamicComponent` directive, `AppErrorInterceptor`, `NotificationInterceptor`, `tableColumn`, `filter`, `orderBy`, `ApiActionConfig` types | All feature libs |
| `ui` | `Scaffold` (app shell with sidebar/toolbar), `UserPanel`, `GlobalSearch`, `SearchService` | Used by `asset-roster-demo` (Scaffold), internal `search-destinations` |
| `plugin-system` | `PluginSlot` component, `PluginManager`, `PLUGIN_CONTEXT` token, `providePluginContext` | `l10n_cr_einvoice` (invoice/tax plugins), `inventory`, `accounting`, `contacts` |

### Feature CRUD Modules (Settings)

All loaded lazily via `SETTINGS_ROUTES` in `routing`. They share the same pattern: list + form + CRUD service + BaseForm subclass + column/filter definitions + `XxxRoutes`.

| Entrypoint | Entity | External consumers |
|---|---|---|
| `users` | User management + profiles + role selection | `helpdesk`, `sales`, `asset-roster`, `tasks` (all via `CrudUsers`) |
| `roles` | Role management with policy assignment | Used internally by `users` |
| `policies` | Policy/RBAC definitions | Used internally by `roles` |
| `contacts` | Contact management | `sales`, `projects`, `asset-roster`, `accounting`, `aduanix`, `purchases`, `l10n_cr_einvoice` |
| `companies` | Company management | `sales`, `aduanix`, `l10n_cr_einvoice` |
| `countries` | Country list | `aduanix`, internally by `companies`/`contacts`/`branch-office` |
| `currency` | Currencies + exchange rates | `sales`, `accounting`, internally by `companies` |
| `taxes` | Tax definitions (interfaces + CRUD only, no UI components) | `sales`, `inventory`, `purchases`, `accounting` |
| `templates` | Code template management | Only internal (settings routes) |
| `sequences` | Document numbering sequences | `sales`, `accounting`, `purchases` |
| `search-destinations` | Global search configuration | Only internal (used by `ui.SearchService`) |
| `reporting` | Report definitions + download | `asset-roster` (via `ReportingDownloadDialog`) |
| `branch-office` | Branch office management | None externally |
| `ai-settings` | AI provider configuration | Only internal (settings routes) |
| `drive-settings` | Drive/file storage configuration | Only internal (settings routes) |
| `notification-settings` | Notification settings | Only internal (settings routes) |
| `bug-reporting` | Bug report dialog | Internal (`ui.UserPanel`) |

### Shared Interfaces

| Entrypoint | Interfaces |
|---|---|
| `interfaces` | `user`, `contact`, `company`, `country`, `role`, `policy<T,R>`, `template`, `reporting`, `resource`, `policyAction`, `conditionOperator` |

### Key Rule

**Before adding CRUD services, list components, form logic, or settings pages in a feature lib, verify that `@avalantec/base-app` doesn't already provide it.** Re-use the existing CRUD services (`CrudUsers`, `CrudContacts`, `CrudCompanies`, `CrudCountries`, `CrudCurrencies`, `CrudTaxes`, `CrudSequences`, etc.) and base-app UI components (`BaseDialog`, `FormModule`, `TableLayout`, `FilterBar`, `SearchBar`, `ButtonsActions`, `FileResolver`, reporting download dialog, etc.) rather than re-implementing similar functionality.

## Commands

```sh
npm run dev              # ng serve --host 0.0.0.0 --port 4200
npm run lint             # ng lint (runs eslint across workspace)
npm run watch            # ng build --watch --configuration development
npm run graphs           # dependency-cruiser SVG graph per lib (whiptail UI)
npm run pre:build        # ts-node prebuild.ts -- fetches templates from backend API
npm run post:build       # build selected libs via tools/build/build.sh
npm run config:library   # full CI flow: submodule update → install → build → install tgz → gen config → build parent

ng test <project>        # e.g. ng test sales, ng test base-app
ng build <project>       # single project build
ng serve                 # serves asset-roster-demo (default app)
```

- Lockfile (`package-lock.json`) and environment files are **gitignored** — run `npm install` after clone.
- `packageManager` is pinned — use `npm` (not yarn/pnpm).

## Build Flow (CI / Docker)

Docker multi-stage build: `node:22` build stage → `nginx:stable` deploy. The config-library.sh script handles the full pipeline (submodule management, dependency install, library compilation + tgz packaging, parent project install/config/build). Output goes to `dist/*/browser`, served by nginx on `:8080`.

## Library Architecture

Each feature lib registers itself via a `provide*()` function (e.g. `provideSales()`) that calls `MainMenuManager.addItems()` and `MainRoutingManager.addRouting()` from `@avalantec/base-app/routing`. These are called in the app's `app.config.ts` providers.

Libs ship as Angular packages via `ng-packagr` (build → `dist/<name>/` → `npm pack` → `.tgz`).

## Code Conventions (from base-app docs)

- **No `.component.ts` / `.service.ts` / `.directive.ts` suffixes** — files end with `.ts` only.
- **Class naming**: omit "Component" / "Directive" / "Pipe" suffixes. Form components pluralize the subject noun (e.g. `AgentsForm`), form services (`BaseForm` subclasses) use singular (e.g. `AgentForm`). Settings-based components use `Page` suffix (e.g. `AiSettingsPage`).
- **Interfaces/types use camelCase starting with lowercase** (e.g. `interface userFormValues`).
- **Standalone components only** — no NgModules.
- **`inject()` over constructor DI**.
- **Angular Signals** (`signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()`) preferred over RxJS. Only use RxJS with `DestroyRef` + `takeUntilDestroyed`.
- **Smart (`features/`) vs dumb (`ui/`) separation**: dumb components only via `input()`/`output()`, no service injection.
- **PrimeNG** is the mandatory UI component library.
- **Import from barrel only** — never from internal paths. E.g. `import { X } from '@avalantec/base-app/core'`.

## ESLint

- Component selector prefix: `bifi-app` (kebab-case), directive prefix: `bifiApp` (camelCase).
- `@typescript-eslint/no-explicit-any`: **off**. `no-unused-vars`: replaced by `unused-imports/no-unused-imports`.
- Prettier: single quotes, trailing commas (es5), 100 print width, `arrowParens: "avoid"`. HTML parsed as Angular.

## Tests

Karma + Jasmine. `ng test <project>` runs tests for a specific project. Spec files use `*.spec.ts` pattern.

## Reference Docs

- `projects/base-app/README.md` — full architecture guide (DI, Signals, naming, structure)
- `projects/base-app/CORE.md` — core module deep-dive (directives, services)
- `projects/base-app/FORMS-README.MD` — form architecture (`BaseForm<T>`, `TypedFormBuilder`)
