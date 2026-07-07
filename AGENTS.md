# BifiApp — Agent Guide

## Stack

Angular 20 monorepo (Turborepo) with npm@11.8.0. Tailwind CSS v4 (PostCSS plugin), PrimeNG 20 (Noir theme via `@primeuix/themes`), Firebase auth, Karma+Jasmine tests. Typescript 5.8, `moduleResolution: "bundler"`.

## Projects

- **app** (only one): `projects/asset-roster-demo` — serves on `:4200`
- **libs** (14): `base-app`, `asset-roster`, `l10n_cr_einvoice`, `calendar`, `website`, `helpdesk`, `tasks`, `projects`, `aduanix`, `sales`, `purchases`, `inventory`, `accounting`, `email-marketing`
- `base-app` is a **multi-entrypoint library** with 28 sub-entrypoints — each under `projects/base-app/<name>/` with its own `ng-package.json`
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
| `search` | `SearchService`, `SearchDestination`, `SearchResultGroup` | `ui` (GlobalSearch), `search-destinations` (list/form) |
| `i18n` | `TranslationService` (signal-based i18n, lazy per-scope loading, `{{param}}` substitution, language switching), `TranslatePipe`, `provideTranslationRoot()`, `provideTranslations(scope)` — see [i18n section](#i18n-internationalization) for usage patterns | All feature libs (via `provideTranslations`), `form` (imports `TranslationService` directly) |
| `translation` | `CrudTranslations`, `CrudLanguages`, `TranslationForm`, `LanguageForm`, `TranslationsList`, `TranslationsForm`, `LanguagesList`, `LanguagesForm`, `TRANSLATION_ROUTES`, `LANGUAGE_ROUTES`, translation/language columns & filters, `LanguageFormModel` | Only internal (Settings → Translation Keys / Languages) |

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
| `search-destinations` | Global search configuration | Only internal (used by `@avalantec/base-app/search`) |
| `reporting` | Report definitions + download | `asset-roster` (via `ReportingDownloadDialog`) |
| `branch-office` | Branch office management | None externally |
| `ai-settings` | AI provider configuration | Only internal (settings routes) |
| `drive-settings` | Drive/file storage configuration | Only internal (settings routes) |
| `notification-settings` | Notification settings | Only internal (settings routes) |
| `bug-reporting` | Bug report dialog | Internal (`ui.UserPanel`) |
| `languages` (in `translation`) | Language management (locale, name, nativeName, active) | Internal (Settings → Languages) — `TranslationService` consumes `languageRecord` |

### Shared Interfaces

| Entrypoint | Interfaces |
|---|---|
| `interfaces` | `user` (includes `language?: string`), `contact`, `company`, `country`, `role`, `policy<T,R>`, `template`, `reporting`, `resource`, `policyAction`, `conditionOperator` |
| `i18n` | `languageRecord` |
| `translation` | `LanguageFormModel` |

### Key Rule

**Before adding CRUD services, list components, form logic, or settings pages in a feature lib, verify that `@avalantec/base-app` doesn't already provide it.** Re-use the existing CRUD services (`CrudUsers`, `CrudContacts`, `CrudCompanies`, `CrudCountries`, `CrudCurrencies`, `CrudTaxes`, `CrudSequences`, etc.) and base-app UI components (`BaseDialog`, `FormModule`, `TableLayout`, `FilterBar`, `SearchBar`, `ButtonsActions`, `FileResolver`, reporting download dialog, etc.) rather than re-implementing similar functionality.

## Permission & Policy System

The app uses a three-layer RBAC/PBAC model: Policy → Role → User.

### Data Model

- **`policy<TResource,TModel>`** — defines a `resource` (e.g. `"asset-rosters"`), `type` (`model`/`menu`/`view`), and optional `conditions[]` for row-level access
- **`role`** — bundles multiple policies with specific CRUD `actions` per policy (`create`/`read`/`update`/`delete`)
- **`user`** — has an array of `roles[]`; permission evaluation flattens `user.roles.flatMap(r => r.policies)`

### Permission String Format

```
resource               → e.g. "asset-rosters"                        (any permission on resource)
resource:action        → e.g. "asset-rosters:read"                   (action filter)
resource:type          → e.g. "asset-rosters:view"                   (type filter)
resource:action:type   → e.g. "asset-rosters:create:model"           (action + type filter)
```

### Policy Types

| Type | Enforced Backend | Used for |
|---|---|---|
| `model` | Yes | CRUD operations on data (form submits, API calls). Always use `resource:action:model` |
| `menu` | No | Menu/navigation item visibility. Always use `resource/menu` |
| `view` | No | Page/view-level access. Used by `permissionGuard` and `clickRowPermission`. Always use `resource/view` or `resource/action:view` |

### Route Protection (permissionGuard)

Every route **MUST** include `permissionGuard` in `canActivate` and a `data.resource` property:

```ts
{
  path: 'list',
  loadComponent: () => ...,
  canActivate: [permissionGuard],
  data: { resource: 'facilities/list' },
}
```

### Resource Naming Convention

| Scope | Pattern | Example |
|---|---|---|
| Route (list) | `module/list` | `facilities/list` |
| Route (create) | `module/create` | `facilities/create` |
| Route (update) | `module/update` | `facilities/update` |
| CRUD action | `module:action:model` | `asset-rosters:create:model` |
| Button/view row | `module/action:view` | `asset-rosters/update:view` |
| Menu item | `module/menu` | `asset-roster/menu` |
| Settings sub-menu | `module/settings/menu` | `asset-roster/settings/menu` |
| Export | `module/export:action:type` | `asset-rosters/export:read:model` |
| Import | `module/import:action:type` | `asset-rosters/import:create:model` |

### UI Protection (HasPermission Directive)

Use `*bifiAppHasPermission` on any element that needs permission gating:

```html
<button *bifiAppHasPermission="'asset-rosters:create:model'">Add New Asset</button>
<div *bifiAppHasPermission="'asset-rosters/update:view'; resourceData: asset; context: { department: 'ops' }">
  Edit Section
</div>
```

The directive is structural (like `*ngIf`). It accepts:
- **`permission`** (required, positional via `*bifiAppHasPermission="'...'"`) — colon-delimited string
- **`resourceData`** (optional) — the actual model data for condition evaluation
- **`context`** (optional) — extra context for template condition resolution (`{{context.*}}`)

### Table Row Click Protection

Pass `clickRowPermission` to `<bifi-app-table-layout>` to gate row navigation:

```html
<bifi-app-table-layout
  clickRowPermission="asset-rosters/update:view"
  ...>
</bifi-app-table-layout>
```

### ButtonsActions Component

The `<bifi-app-buttons-actions>` component automatically checks edit/delete permissions. Pass `resource` to enable it:

```html
<bifi-app-buttons-actions [resource]="'asset-rosters'" [element]="row" />
```

Built-in permission checks:
- Edit button: `${resource}/update:view`
- Delete button: `${resource}:delete:model`

### Menu Registration

When registering menu items via `MainMenuManager.addItems()`, always include a `resource` property:

```ts
{
  label: 'Asset Roster',
  icon: 'pi pi-box',
  route: '/equipment/list',
  resource: 'asset-roster/menu',
}
```

The Scaffold and MainMenu components automatically apply `*bifiAppHasPermission="resource + ':menu'"` to each item.

### Adding a New Module: Permission Checklist

1. **Create policies** in Settings → Policies (one per resource, or per distinct type per resource)
2. **Create a role** in Settings → Roles with the policies + CRUD actions
3. **Assign the role** to users in Settings → Users
4. **Menu registration** — add `resource: 'module/menu'` to menu items
5. **Routes** — add `canActivate: [permissionGuard]` + `data: { resource: 'module/...' }` on every route
6. **Templates** — add `*bifiAppHasPermission` on all action buttons (create, edit, delete, import, export)
7. **TableLayout** — add `clickRowPermission="module/update:view"` if rows are clickable
8. **ButtonsActions** — add `resource` prop for built-in edit/delete gating
9. **Backend** — ensure the corresponding backend route's `BaseRoutes` passes the same resource name to `authorizeMiddleware`

## l10n_cr_einvoice — Costa Rica E-Invoice Localization Plugin

`@avalantec/l10n_cr_einvoice` provides Costa Rica (Ministerio de Hacienda) electronic invoice integration. Registered via `provideL10nCrEinvoice()` in `app.config.ts`. Hooks into 6 base-app forms via the plugin system and adds 3 CRUD maintenance modules under Settings.

### Plugin System Slots

| Slot | Plugin Component | Host Form (lib) | Fields Added |
|---|---|---|---|
| `contacts-form-general-information` | `ContactCrPlugin` | `ContactsForm` (`@avalantec/base-app/contacts`) | `crVatType`, `commercialName`, `crDistrito`, `crEconomicActivityCodes` (FormArray) |
| `product-form-general-information` | `ProductCrPlugin` | `ProductForm` (`@avalantec/inventory`) | `codigoComercial`, `productKind` |
| `uom-form-general-information` | `UomCrPlugin` | `UomForm` (`@avalantec/inventory`) | `crUnidadMedida` |
| `discount-form-general-information` | `DiscountCrPlugin` | `DiscountForm` (`@avalantec/accounting`) | `crNaturalezaDescuento` |
| `tax-form-general-information` | `TaxCrPlugin` | `TaxForm` (`@avalantec/accounting`) | `crCodigo`, `crCodigoTarifa`, `crTarifa` |
| `invoice-form-general-information` | `InvoiceCrPlugin` | `InvoiceForm` (`@avalantec/accounting`) | 12 controls: type, condicion/medio pago, reference info, acceptance fields, Hacienda submission/polling |
| `invoices-list-actions` | `InvoiceImportPlugin` | (standalone — no host form) | Button + dialog to import received invoices from XML |

### CRUD Maintenance Modules (Settings → CR E-Invoice)

All loaded under `/settings/cr-einvoice/`. Follow the same pattern as base-app settings: list + form + CRUD service + BaseForm subclass.

| Module | Routes | Entity | Service | Form Service | Components |
|---|---|---|---|---|---|
| `condicion-venta` | `/settings/cr-einvoice/condicion-venta` | Sale conditions | `CrudCondicionVenta` | `CondicionVentaFormService` | `CondicionVentaList`, `CondicionesVentaForm` |
| `medio-pago` | `/settings/cr-einvoice/medio-pago` | Payment methods | `CrudMedioPago` | `MedioPagoFormService` | `MedioPagoList`, `MediosPagoForm` |
| `cr-einvoice-settings` | `/settings/cr-einvoice/configuracion` | Hacienda credentials + technical config | `CrudCrEinvoiceSettings` | `CrEinvoiceSettingsFormService` | `CrEinvoiceSettingsForm` (singleton, no list) |

### Key Services

| Service | Endpoint | Key Methods | Used by |
|---|---|---|---|
| `CrudCrEinvoice` | `cr-einvoice` | `submitEinvoice`, `pollEinvoiceStatus`, `createNote`, `submitAcceptance`, `pollAcceptanceStatus`, `importReceived` | `InvoiceCrPlugin`, `InvoiceImportPlugin`, any lib needing CR e-invoice operations |
| `CrudCondicionVenta` | `cr-einvoice/condicion-venta` | Standard CRUD | `InvoiceCrPlugin` (populates dropdown), `CondicionVentaList` |
| `CrudMedioPago` | `cr-einvoice/medio-pago` | Standard CRUD | `InvoiceCrPlugin` (populates dropdown), `MedioPagoList` |
| `CrudCrEinvoiceSettings` | `cr-einvoice/settings` | `getSettings`, `putSettings` (FormData) | `InvoiceCrPlugin` (reads emisor config), settings form |

### Shared Interfaces

| Interface | Module |
|---|---|
| `condicionVenta` | `crud-condicion-venta` |
| `condicionVentaFormModel` | `condicion-venta-form` |
| `medioPago` | `crud-medio-pago` |
| `medioPagoFormModel` | `medio-pago-form` |
| `crEinvoiceSettings` | `crud-cr-einvoice-settings` |
| `crEinvoiceSettingsFormModel` | `cr-einvoice-settings-form` |

### Base-App Dependencies

`@avalantec/base-app/plugin-system` (`PluginManager`, `PLUGIN_CONTEXT`), `@avalantec/base-app/routing` (`MainMenuManager`, `MainRoutingManager`), `@avalantec/base-app/core` (`ToastManager`, `BaseDialog`), `@avalantec/base-app/form` (`BaseForm`, `FormModule`, `FormValueState`), `@avalantec/base-app/resource` (`ApiRequestManager`, `TableLayout`, `SearchBar`, etc.), `@avalantec/base-app/auth` (`permissionGuard`, `HasPermission`), `@avalantec/base-app/contacts` (`ContactsForm`), `@avalantec/base-app/companies` (`CrudCompanies`).

### External Library Dependencies

`@avalantec/accounting` (`InvoiceForm`, `TaxForm`, `DiscountForm`), `@avalantec/inventory` (`ProductForm`, `UomForm`).

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

Each `provide*()` should also include `provideTranslations('scope')` from `@avalantec/base-app/i18n` to pre-fetch translations for that lib's scope at bootstrap — see [i18n section](#i18n-internationalization). Reference pattern: `projects/tasks/src/lib/providers/provider.ts`.

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
- **JSDoc is mandatory** for all public methods and exported symbols (see [Documentation section](#documentation-jsdoc) below).

## i18n (Internationalization)

### TranslatePipe — Template Usage

```html
{{ 'key' | translate : params : 'scope' }}
```

- **`key`** — the translation key (e.g. `'pageTitle'`, `'createForm.username'`, `'table.totalRecords'`)
- **`params`** — optional `{{param}}` substitution object (e.g. `{ name: 'John' }`)
- **`scope`** — **always passed explicitly**, never auto-resolved from injector/route. Determines which translation set to query.

Examples from the codebase:

```html
{{ 'pageTitle' | translate: {} : 'base-app/users' }}
{{ 'table.totalRecords' | translate: {} : 'base-app/resource' }}
{{ 'filter.selectField' | translate: {} : 'base-app/resource' }}
```

### TranslationService — TypeScript Usage

```ts
private translationService = inject(TranslationService);

// Returns the translated string for the given key
const label = this.translationService.translate('key', params, 'scope');
```

### Scope Convention

| Where | Scope format | Example |
|---|---|---|
| Base-app settings modules | `base-app/<module>` | `base-app/users`, `base-app/roles`, `base-app/resource` |
| Feature libs (outside base-app) | `<lib-name>` | `sales`, `helpdesk`, `tasks`, `projects` |

The `TranslationService.translate()` method falls back to returning the raw key if no translation is found for the given scope + locale.

### Pre-loading Translations

- **`provideTranslationRoot()`** — called once at bootstrap; pre-fetches all 24 `BASE_APP_SCOPES` for base-app modules.
- **`provideTranslations('scope')`** — called per feature lib to pre-fetch its own scope at bootstrap. Every `provide*()` function should include this (see `projects/tasks/src/lib/providers/provider.ts` for the reference pattern).

Both are from `@avalantec/base-app/i18n`.

### Translations Catalog

Translation entries are stored in `Catalog/translations/` as JSON arrays. Each file follows the naming convention `base-app-<module>-translations.json`. Each entry:

```json
{
  "_id": { "$oid": "..." },
  "locale": "en",
  "scope": "base-app/users",
  "key": "pageTitle",
  "value": "Users",
  "active": true,
  "createdAt": { "$date": "..." },
  "updatedAt": { "$date": "..." },
  "__v": 0
}
```

Both `"en"` and `"es"` locale entries are included per key.

### Column & Filter i18n

Column titles and filter labels are translated **centrally** in `TableLayout` and `FilterBar` — not at the source in each module's library file.

**How it works:**

- `tableColumn.title` and `filterFieldConfig.label` are treated as **translation keys** (e.g. `'username'`, `'email'`, `'signedInWith'`), not display strings.
- `TableLayout` has a `scope` input. In the template, `{{ column.title }}` is rendered as `{{ column.title | translate : {} : scope() }}`.
- `FilterBar` also has a `scope` input. Labels in `fieldOptions()` and `activeChips()` are passed through `TranslationService.translate(label, {}, scope())`.
- Every `<bifi-app-table-layout>` usage must pass `[scope]` with the consumer module's scope (e.g. `[scope]="'base-app/users'"`).

**Column title convention:**

All column `title` values use key-style format (lowercase camelCase, matching existing keys like `pageTitle`, `createForm.name`):

| Before | After |
|---|---|
| `'Username'` | `'username'` |
| `'Signed in with'` | `'signedInWith'` |
| `'Total Policies'` | `'totalPolicies'` |
| `'Percentage (%)'` | `'percentage'` |

**When adding a new module:**

1. Set column `title` values to key convention (do NOT add a `translationKey` field — `title`/`label` IS the key)
2. Add `[scope]` to `<bifi-app-table-layout>` with the module's scope
3. Add en/es entries to the corresponding translations catalog file

### Menu i18n

Menu item labels translate the same way — `label` doubles as the translation key, and each item carries an explicit per-item `scope` field.

**How it works:**

- `label` values use the same key-style convention as column titles (e.g. `'home'`, `'settings'`, `'companies'`, `'aiConfiguration'`).
- Every menu item object includes a `scope` field (e.g. `scope: 'base-app/routing'`, `scope: 'base-app/users'`).
- `MainMenu` component renders labels through `TranslatePipe`: `{{ item.label | translate : {} : item['scope'] }}`.
- `Scaffold` (sidebar) does the same for all template bindings, plus uses `TranslationService.translate()` for TypeScript-based label lookups (breadcrumbs, `currentModuleLabel`, drag-and-drop data).
- The `MainMenuManager.title` signal also uses a translation key (`'welcomeTitle'`) translated with scope `'base-app/routing'`.

**When registering menu items in `MainMenuManager` or feature lib `provide*()` functions:**

1. Set `label` to a key-convention string
2. Add `scope: '<scope>'` matching the scope convention (e.g. `'base-app/users'`, `'sales'`, `'helpdesk'`)
3. Add en/es entries to the translations catalog file

**Scope Convention:**

| Menu item location | Scope pattern | Example |
|---|---|---|
| Base-app routing (Home, Settings, title) | `base-app/routing` | `scope: 'base-app/routing'` |
| Base-app settings modules (Companies, Users, etc.) | `base-app/<module>` | `scope: 'base-app/companies'` |
| Base-app modules (Contacts) | `base-app/<module>` | `scope: 'base-app/contacts'` |
| Feature libs (Sales, Helpdesk, etc.) | `<lib-name>` | `scope: 'sales'` |

### Form Component i18n

Shared form components (`@avalantec/base-app/form`) use `TranslatePipe` from `@avalantec/base-app/i18n` directly (no bridge token — `form` depends on `i18n` like any other consumer).

**How it works:**

- Each component exposes a `scope` input (default `'base-app/form'`) so consumers can override if needed.
- Hardcoded fallback strings are replaced with translation keys (`'goBack'`, `'save'`, `'saving'`, `'format'`, `'notSet'`).
- Templates use `TranslatePipe` with the component's `scope()` signal.
- Form validation errors use `FormTranslation`, which injects `TranslationService` from `@avalantec/base-app/i18n` directly with the hardcoded scope `'core'`. The static `FORM_ERROR_TRANSLATIONS` map serves as a final fallback.

**Components with translated labels:**

| Component | Keys | Default scope |
|---|---|---|
| `FormActions` | `goBack`, `save`, `saving` | `base-app/form` |
| `FormCodeEditor` | `format` | `base-app/form` |
| `FormPreview` | `notSet` | `base-app/form` |

**When adding a new form component with hardcoded text:**

1. Change the hardcoded string to a key-convention value
2. Add `scope = input('base-app/form')` to the component
3. Import `TranslatePipe` from `@avalantec/base-app/i18n` and render `{{ 'key' | translate : {} : scope() }}`
4. Add en/es entries to `base-app-form-translations.json`

## Documentation (JSDoc)

**Documenting code is mandatory** — every public method, exported function, interface, type, and class must have a JSDoc comment (`/** ... */`) explaining its purpose, parameters, and return value.

### Rules

- **All public/exported functions and methods** must have JSDoc — includes CRUD service methods, utility functions, component lifecycle hooks, and handler methods (`handleSubmit`, `goBack`, `addLine`, etc.)
- **Private methods with non-trivial logic** should also have JSDoc
- **Interfaces and types** should have JSDoc if their purpose is not immediately obvious from the name
- **Keep JSDoc concise** — one line summary is sufficient for simple methods. **Always include `@param` and `@returns`** when the method has parameters or a non-`void` return value
- **Never add JSDoc to overrides** of Angular lifecycle hooks (`ngOnInit`, `ngOnDestroy`) or `BaseForm.createForm()` unless the override adds non-trivial behavior

### Examples

```ts
/**
 * Fetches all payments registered against a specific invoice
 * @param invoiceId - The invoice ID
 * @returns Observable of payment records
 */
getPayments(invoiceId: string): Observable<any[]> { ... }

/** Logs out the current user by clearing the session and calling Firebase signOut */
async logout(): Promise<boolean> { ... }

/**
 * Evaluates whether a given user has a specific permission on a resource.
 * Checks user role-based policies, matching resource, action, and type.
 * @param options.user - The user to check permissions for
 * @param options.resource - The resource being accessed
 * @param options.action - Optional CRUD action to check
 * @param options.type - Optional permission type (view/menu/model)
 * @param options.context - Additional context for condition evaluation
 * @returns Whether the user has the required permission
 */
hasPermission<TModel = unknown>({ user, resource, type, action, context }): boolean { ... }
```

### Enforcement

- All new code must include JSDoc per these rules
- When editing existing code, add missing JSDoc to nearby functions if you touch them
- Run `ng lint` before committing — JSDoc rules are enforced via ESLint where configured

## ESLint

- Component selector prefix: `bifi-app` (kebab-case), directive prefix: `bifiApp` (camelCase).
- `@typescript-eslint/no-explicit-any`: **off**. `no-unused-vars`: replaced by `unused-imports/no-unused-imports`.
- Prettier: single quotes, trailing commas (es5), 100 print width, `arrowParens: "avoid"`. HTML parsed as Angular.

## Tests

Karma + Jasmine. `ng test <project>` runs tests for a specific project. Spec files use `*.spec.ts` pattern.

## Asset-Roster i18n

The `asset-roster` feature module has been fully internationalized. Scope: `'asset-roster'`.

### Translation Catalog

`Catalog/translations/asset-roster-translations.json` — 242 unique keys with en/es entries.

### State

| Component | Status | What was done |
|---|---|---|
| `init.ts` | **Done** | All 6 menu items: `label` → key convention, added `scope: 'asset-roster'` |
| Column files (5) | **Done** | All `title` values → camelCase keys (`type`, `model`, `serialNumber`, etc.) |
| Status card | **Done** | `title` values → keys; added `TranslatePipe` to TS + HTML |
| List HTML files (5) | **Done** | Headings, button labels, search labels translated; `[scope]` added to `<bifi-app-table-layout>` and `<bifi-app-search-bar>` |
| Form dialogs (8) | **Done** | All headers, labels, placeholders, form-action labels translated |
| Edit form | **Done** | All buttons, tab headers, headings translated; `TranslatePipe` added to TS |
| Form pages (4) | **Done** | All section titles, labels, placeholders, error text translated |
| Section components | **Done** | `general-information-section`: fully translated; `TranslatePipe` added |
| Remaining sections (7) | **Pending** | `financial-information`, `maintenance-service`, `notes`, `commissioning-lifecycle`, `documents`, `activity-history`, `status-banner` — strings cataloged in translations JSON, but `TranslatePipe` imports and pipe usage in HTML not yet applied |

### Convention

- All translatable strings use `{{ 'key' | translate : {} : 'asset-roster' }}` in templates
- Labels use `[label]="'key' | translate : {} : 'asset-roster'"` for PrimeNG button components
- Placeholders use `[placeholder]="'key' | translate : {} : 'asset-roster'"`
- `cancelLabel` and `saveLabel` on `<bifi-app-form-actions>` use property binding syntax with pipe

## Reference Docs

- `projects/base-app/README.md` — full architecture guide (DI, Signals, naming, structure)
- `projects/base-app/CORE.md` — core module deep-dive (directives, services)
- `projects/base-app/FORMS-README.MD` — form architecture (`BaseForm<T>`, `TypedFormBuilder`)
