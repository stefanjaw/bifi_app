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

npm run release          # full build + pack + publish of all 14 libs (see Versioning & Publishing)
npm run post:build       # build selected libs via tools/build/build.sh

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
- **Class naming**: omit "Component" / "Directive" / "Pipe" suffixes. Settings-based components use `Page` suffix (e.g. `AiSettingsPage`).
- **Form naming convention — MANDATORY**: Form services (BaseForm subclasses) MUST use **singular** noun, form components MUST use **plural** noun. This applies to ALL modules across the monorepo — no exceptions.
  ```typescript
  // ✅ CORRECT — mandatory pattern
  // Service file: services/room-form.ts
  export class RoomForm extends BaseForm<RoomFormModel> { ... }  // singular
  
  // Component file: features/rooms-form/rooms-form.ts
  export class RoomsForm implements OnInit { ... }  // plural
  
  // ✅ CORRECT — more examples
  // services/patient-form.ts → export class PatientForm
  // features/patients-form/patients-form.ts → export class PatientsForm
  
  // services/asset-roster-form.ts → export class AssetRosterForm
  // features/asset-rosters-form/asset-rosters-form.ts → export class AssetRostersForm
  
  // ❌ WRONG — using same name for both
  // services/patient-form.ts → export class PatientForm
  // features/patient-form/patient-form.ts → export class PatientForm  // ❌ WRONG
  
  // ❌ WRONG — using singular for component
  // services/room-form.ts → export class RoomForm
  // features/room-form/room-form.ts → export class RoomForm  // ❌ WRONG, should be RoomsForm
  ```
- **Interfaces/types use camelCase starting with lowercase** (e.g. `interface userFormValues`).
- **Standalone components only** — no NgModules.
- **`inject()` is the only DI pattern** — never use constructor-based dependency injection. Constructor must not have parameters. Always use `inject()` at the field level.
  ```typescript
  // ✅ Correct — Angular 20 style
  export class XxxList {
    private crud = inject(CrudXxx);
    private router = inject(Router);
  }

  // ❌ Wrong — no constructor DI
  constructor(private crud: CrudXxx, private router: Router) {}
  ```
- **Signal-based `input()`/`output()` over decorators** — always use `input<T>()`, `output<T>()`, and `model<T>()` from `@angular/core`. Never use `@Input()`, `@Output()`, or `@HostBinding()` decorators.
  ```typescript
  // ✅ Correct — Angular 20 signal inputs/outputs
  @Component({ selector: 'bifi-app-xxx-child' })
  export class XxxChild {
    value = input.required<string>();
    disabled = input(false);
    changed = output<string>();
  }

  // ❌ Wrong — decorator-based inputs/outputs
  @Input() value!: string;
  @Output() changed = new EventEmitter<string>();
  ```
- **Angular Signals** (`signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()`) preferred over RxJS for all state management. Only use RxJS when bridging third-party libraries (e.g. Angular HTTP events, Firebase auth state). When using RxJS, always pair with `DestroyRef` + `takeUntilDestroyed()`.
- **Smart (`features/`) vs dumb (`ui/`) separation**: dumb components only via `input()`/`output()`, no service injection.
- **PrimeNG** is the mandatory UI component library.
- **Import from barrel only** — never from internal paths. E.g. `import { X } from '@avalantec/base-app/core'`.
- **JSDoc is mandatory** for all public methods and exported symbols (see [Documentation section](#documentation-jsdoc) below).
- **Never use `any` as a type shortcut.** Every variable, parameter, return type, and interface field must have an explicit type. Use `string | null`, `number | null`, proper nested interfaces, or `Record<string, string>` for dynamic objects. This applies to all modules across the monorepo — no exceptions. Reference: `projects/asset-roster/src/lib/modules/asset-roster/services/create-asset-roster-form.ts`
  ```typescript
  // ❌ WRONG — using `any` as a shortcut
  export interface BadModel {
    patientId: any;
    medications: any;
    extraFields: any;
  }

  // ✅ CORRECT — explicit types, no `any`
  export interface MedicationItem {
    name: string;
    dosage: string;
    frequency: string;
  }

  export interface GoodModel {
    patientId: string;
    medications: MedicationItem[];
    extraFields: Record<string, string>;
  }
  ```

## Feature Module Conventions

> **Mandatory rule**: Every component, view, route, and service **must** follow the [Permission & Policy System](#permission--policy-system) and [i18n/Translation](#i18n-internationalization) guidelines listed in this document. Exceptions only when explicitly directed otherwise.

### Component File Structure
- **Every component lives in its own folder** under `features/` (or `ui/`). The folder name matches the component name (kebab-case). Inside the folder, the `.ts` and `.html` files share the same name.
  ```
  features/
    asset-roster-list/
      asset-roster-list.ts
      asset-roster-list.html
    asset-roster-form-dialog/
      asset-roster-form-dialog.ts
      asset-roster-form-dialog.html
  ```
- **Every component must have a matching `.html` template file** referenced via `templateUrl`. Exceptions: plugin components (no template needed), and very simple settings CRUD lists (like l10n_cr_einvoice's `CondicionVentaList`) may use inline `template` when the markup is minimal.
- **Never create `.ts`-only components** for list/form views — always produce a `.html` + `.ts` pair inside a dedicated folder.
- **File naming**: component files use kebab-case (e.g. `ticket-list.ts` / `ticket-list.html`). No `.component.ts` suffix.
- **`templateUrl`** is relative to the component's own folder: `templateUrl: './ticket-list.html'`.

### List Component Pattern
Every list component must follow this structure (reference: `projects/helpdesk/src/lib/features/ticket-list/ticket-list.ts`):

```typescript
@Component({
  selector: 'bifi-app-xxx-list',
  providers: [provideResourceManager(CrudXxx)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout, SearchBar, ButtonModule, RouterLink,
    HasPermission, ButtonsActions, TranslatePipe,
  ],
  templateUrl: './xxx-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XxxList {
  private resourceManager = inject<ResourceManager<Xxx>>(ResourceManager);
  private crud = inject(CrudXxx);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = xxxColumns;
  filters = xxxFilters;
  data = this.resourceManager.data;

  delete(id: string) { /* ... */ }
  gotoEdit = (element: Xxx) => { /* ... */ };
}
```

**Template** (`xxx-list.html`) must include:
- An "Add New" `p-button` with `*bifiAppHasPermission` for the create route
- `<bifi-app-search-bar>` with `[label]` and `[searchFilters]`
- `<bifi-app-table-layout>` with `[infiniteScroll]`, `[columns]`, `[data]`, `[onClickRow]`, `clickRowPermission`, and a `#actions` ng-template containing `<bifi-app-buttons-actions>`

### CRUD Service Pattern
- **One class per file** — never define multiple `@Injectable()` CRUD classes in the same file.
- **File naming**: `crud-<entity-name>.ts` using kebab-case (e.g. `crud-roles.ts`, `crud-tickets.ts`).
- **Use `inject()` never constructor DI** — set endpoint as a class field or in a parameterless constructor:

```typescript
// ✅ Correct — field-level endpoint + no constructor
@Injectable({ providedIn: 'root' })
export class CrudXxx extends ApiRequestManager<xxx> {
  endpoint = 'xxx-endpoint';
}

// ✅ Correct — parameterless constructor with super call
@Injectable({ providedIn: 'root' })
export class CrudXxx extends ApiRequestManager<xxx> {
  constructor() {
    super();
    this.endpoint = 'xxx-endpoint';
  }
}
```

- If the interface is simple and module-specific, it MAY be co-located in the same file (as `l10n_cr_einvoice` does). Otherwise import from a separate `interfaces/` barrel.

### Form Service Pattern
- **One class per file** — exactly one `BaseForm<T>` subclass per file, matching one backend entity. Never define multiple form services in a single file.
- **File naming**: `<entity>-form.ts` using kebab-case, singular noun (e.g. `policy-form.ts`, `patient-form.ts`).
- **Must define a `FormModel` interface** as a named export in the same file, describing the form's control structure.
- **Must override `createForm()`** returning a `FormGroup` via `this.fb.group()`.
- **Must use `inject()`** — no constructor DI.
- **Array fields** MUST use the `{ template, formArrayElements }` pattern from `TypedFormBuilder`. The `template` must match the interface structure exactly. Never use bare `[[]]` or `any`. Reference: `projects/asset-roster/src/lib/modules/asset-roster/services/update-asset-roster-form.ts`

```typescript
// Define interfaces for array items
export interface LocationAssignmentModel {
  locationId: string;
  assignedQuantity: number;
}

export interface NotesModel {
  remark: string;
  createdBy: string;
  performDate: Date;
}

export interface UpdateAssetRosterFormModel {
  deviceType: string;
  locationAssignments: LocationAssignmentModel[];
  remarks: NotesModel[] | null;
  photo: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class UpdateAssetRosterForm extends BaseForm<UpdateAssetRosterFormModel> {
  override createForm() {
    return this.fb.group<UpdateAssetRosterFormModel>({
      deviceType: ['serialized'],
      // ✅ CORRECT — template matches LocationAssignmentModel interface
      locationAssignments: {
        template: {
          locationId: [''],
          assignedQuantity: [0],
        },
        formArrayElements: [],
      },
      // ✅ CORRECT — template matches NotesModel interface
      remarks: {
        template: {
          remark: [''],
          createdBy: [''],
          performDate: [new Date()],
        },
        formArrayElements: [],
      },
      // ✅ CORRECT — template matches FormUploaderFile interface
      photo: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }

  // Helper methods to add/remove items
  addLocationAssignment() {
    this.form.controls.locationAssignments.push(
      this.fb.group<LocationAssignmentModel>({
        locationId: [''],
        assignedQuantity: [0],
      })
    );
  }

  removeLocationAssignment(index: number) {
    this.form.controls.locationAssignments.removeAt(index);
  }
}
```

**❌ WRONG patterns:**
```typescript
// ❌ WRONG — using bare [[]]
locationAssignments: [[]],

// ❌ WRONG — using any in template
locationAssignments: {
  template: {
    locationId: [null],
    assignedQuantity: [null],
  } as any,
  formArrayElements: [],
},

// ❌ WRONG — template doesn't match interface
locationAssignments: {
  template: {
    name: [''],  // ❌ interface has locationId, not name
  },
  formArrayElements: [],
},
```

### Form Component Pattern
Every form/create-edit component must follow this structure (reference: `projects/base-app/policies/src/components/policies-form/policies-form.ts`):

```typescript
@Component({
  selector: 'bifi-app-xxx-form',
  providers: [provideResourceManager(CrudXxx)],
  imports: [
    FormModule, ReactiveFormsModule, TranslatePipe,
    SelectModule, InputText, Button, /* ... */
  ],
  templateUrl: './xxx-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XxxForm implements OnInit {
  protected formService = inject(XxxForm);
  private crud = inject(CrudXxx);
  private translationService = inject(TranslationService);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  resource = this.crud.get({ id: this.id, triggerRequest: computed(() => this.id() !== undefined) });
  entity = this.resource.value;

  form = this.formService.form;
  loading = this.resource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.entity());

  constructor() {
    effect(() => {
      const data = this.entity();
      if (data) this.formService.patchValue(data);
      else this.formService.reset();
    });
  }

  ngOnInit(): void { this.formService.reset(); }

  async handleSubmit(data: FormValueState<XxxFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crud.put({ _id: this.entity()?._id || '', data: rawValue })
      : this.crud.post({ data: rawValue });
    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => { this.isSubmitLoading.set(false); this.goBack(); },
      error: () => { this.isSubmitLoading.set(false); },
    });
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
```

**Template** (`xxx-form.html`) must use the following structure:
- `<bifi-app-form-layout>` with a `[title]` using `TranslatePipe` and dynamic create/update key
- `<bifi-app-form-actions>` with `[isSubmitting]`, `(cancelClicked)`, `[formChanged]`
- `<bifi-app-form-section>` with `[title]`, `[ordinal]` for each group of fields
- `<bifi-app-form-field>` + `<bifi-app-form-label>` + `<bifi-app-form-error>` for each individual control
- Loading state via `@if (!loading())` / `@else if (error())` / `@else` with progress bar
- All display strings through `TranslatePipe` with explicit scope

### Dialog Component Pattern

Dialogs are used for create/edit forms that appear as modals rather than full-page routes (reference: `projects/asset-roster/src/lib/modules/asset-roster/features/asset-roster-form-dialog/asset-roster-form-dialog.ts`).

**Structure:**
```
features/<dialog-name>/
  <dialog-name>.ts     -- component class extending BaseDialog
  <dialog-name>.html   -- template with p-dialog wrapper
```

**Class conventions:**
- **Extend `BaseDialog`** from `@avalantec/base-app/core` — provides `dialogState` model signal, `openDialog()`, `closeDialog()`
- **No "Component" suffix** in class name (e.g. `AssetRosterFormDialog`, not `AssetRosterFormDialogComponent`)
- **`inject()` only** — never constructor DI
- **`input.required<T>()`** for data passed into the dialog
- **`templateUrl`** — never inline `template`
- **Override `openDialog()`** to reset form state, then call `super.openDialog()`
- **`handleSubmit(data: FormValueState<T>)`** for form submission, using `takeUntilDestroyed(this.destroy$)`
- All labels through `TranslatePipe` with explicit scope

```typescript
@Component({
  selector: 'bifi-app-xxx-form-dialog',
  imports: [
    DialogModule, ReactiveFormsModule, FormModule, TranslatePipe,
    SelectModule, InputText, /* ... */
  ],
  templateUrl: './xxx-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XxxFormDialog extends BaseDialog {
  protected formService = inject(XxxForm);
  private crud = inject(CrudXxx);
  private destroy$ = inject(DestroyRef);

  // inputs
  entity = input.required<Xxx>();

  // state
  form = this.formService.form;
  submitLoading = signal<boolean>(false);

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<XxxFormModel>) {
    this.submitLoading.set(true);
    const { rawValue } = data;
    this.crud.post({ data: rawValue })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
        },
        error: () => { this.submitLoading.set(false); },
      });
  }
}
```

**Template** (`xxx-form-dialog.html`) must use the following structure:
```html
<p-dialog
  [header]="'dialogTitleKey' | translate : {} : 'scope'"
  [(visible)]="dialogState"
  [modal]="true"
  styleClass="w-full max-w-full sm:max-w-sm md:max-w-2xl max-h-[90vh]"
>
  <form
    [formGroup]="form"
    bifiAppFormActionsHandler
    (appSubmit)="handleSubmit($event)"
  >
    <bifi-app-form-field>
      <bifi-app-form-label>{{ 'fieldLabel' | translate : {} : 'scope' }}</bifi-app-form-label>
      <p-select formControlName="field" [options]="options()" [filter]="true"></p-select>
      <bifi-app-form-error></bifi-app-form-error>
    </bifi-app-form-field>

    <bifi-app-form-actions
      [isSubmitting]="submitLoading()"
      (cancelClicked)="closeDialog()"
      [cancelLabel]="'cancel' | translate : {} : 'scope'"
      [formChanged]="form.dirty"
    ></bifi-app-form-actions>
  </form>
</p-dialog>
```

Key differences from full-page form pattern:
- `<p-dialog>` wrapper instead of `<bifi-app-form-layout>` — dialog visibility bound to `dialogState` from `BaseDialog`
- `bifiAppFormActionsHandler` directive + `(appSubmit)` on `<form>` instead of `FormActions`'s `(formSubmit)`
- `cancelClicked` on `FormActions` calls `closeDialog()` instead of `goBack()`
- No `FormSection` for simple dialogs (use raw `div` grids or individual form-field groups)
- No `Router` or `ActivatedRoute` — dialogs receive data via `input()` signals

### Column & Filter File Grouping
- Column and filter definition files may group **multiple arrays per file**, but each array must target a **single entity model**.
- **NOT allowed**: mixing columns for different entity types in the same array.
- **Allowed**: separate named exports per entity in the same file (e.g. `settings-columns.ts` exports `genderColumns`, `maritalStatusColumns`, etc., each typed as `tableColumn<gender>[]`, `tableColumn<maritalStatus>[]`).
- Column objects must use `title` (not `header`) and `type: 'text'` with `parseField` for boolean display.
- Filter objects must use `type: 'string'` | `'number'` | `'date'` | `'boolean'` (not `'text'` or `'select'`).

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

### Global `t()` Function — TypeScript Usage Without DI

The `t()` function is the TypeScript equivalent of `| translate`, usable **anywhere** without injecting `TranslationService`:

```ts
import { t } from '@avalantec/base-app/i18n';

// Inside static callbacks (column files, filters, etc.):
const label = t('assetRoster.status.active', {}, 'asset-roster');
const fallback = t('fallback.notSet', {}, 'asset-roster');
```

**Parameters** (same as `TranslationService.translate()` and `| translate` pipe):

| Param | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | yes | Translation key |
| `params` | `Record<string, any>` | no | `{{param}}` substitution map |
| `scope` | `string` | no | Scope identifier |

**When to use:**

| Context | Use | Example |
|---|---|---|
| Templates | `\| translate` pipe | `{{ 'key' \| translate : {} : 'scope' }}` |
| Components / Services | `TranslationService.translate()` | `inject(TranslationService).translate('key', {}, 'scope')` |
| Static callbacks (column `parseField`, `component`, filter files, etc.) | `t()` | `t('key', {}, 'scope')` |

**Prefer `TranslationService.translate()` in components/services that already inject `TranslationService`.** Only use `t()` when you cannot access DI (static column/filter files, module-level callbacks). The `t()` function is wired globally by `provideTranslationRoot()` at bootstrap — no additional providers needed in feature libs.

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

Translation entries live in `Catalog/translations/` as JSON arrays.

**File naming** — two patterns:

| Pattern | Examples |
|---|---|
| `base-app-<module>-translations.json` | `base-app-users-translations.json`, `base-app-resource-translations.json` |
| `<lib-name>-translations.json` | `asset-roster-translations.json`, `website-translations.json` |

Most files serve one scope (1:1 with the module). One file is **cross-cutting** and contains entries for multiple scopes:
- `base-app-columns-filters-translations.json` — column headers and filter labels

**Note:** Menu/navigation labels were previously in `base-app-menu-translations.json` but have been distributed to their respective scope-specific files (e.g. `base-app-routing-translations.json` for `home`, `settings`, `welcomeTitle`; `base-app-companies-translations.json` for `companies`, etc.).

**Entry structure:**

| Field | Required | Description |
|---|---|---|
| `locale` | yes | `"en"` or `"es"` |
| `scope` | yes | Module namespace — `"base-app/users"`, `"sales"`, `"asset-roster"` |
| `key` | yes | Translation key — see conventions below |
| `value` | yes | Translated text, may contain `{{param}}` substitution |
| `active` | yes | Always `true` |
| `createdAt` / `updatedAt` | yes | ISO timestamps in `{ "$date": "..." }` format |
| `__v` | yes | `0` |
| `_id` | DB-managed only | `{ "$oid": "..." }` — **omit** for standalone lib files (loaded as static JSON rather than via MongoDB) |

**Key naming** — three styles, all lowercase start:

```
# Flat
pageTitle, home, save, addNew

# Dot-notation groups (max 3 levels)
filter.selectField, form.generalInfo.name, notification.create.success

# camelCase compound
cannotInactivateSelf, searchPlaceholder
```

**Parameter substitution** uses `{{param}}` syntax in `value`:

```json
{ "key": "notification.create.success", "value": "The {{ element }} was created successfully!" }
```

**Locale strategy:** Every key must have **exactly two entries** — one with `"locale": "en"`, one with `"locale": "es"` — placed consecutively (en first). The key count is always even.

**When adding translations for a new lib:**
1. Create `Catalog/translations/<lib-name>-translations.json`
2. Add en/es pair for each key using the conventions above
3. Reference filename in the `provideTranslations('scope')` call in your lib's provider

**When creating or updating Catalog translation files, always cross-reference every translation key used in:**
- Column `title` values in `*-columns.ts` files (translated by `| translate` pipe via `TableLayout` scope)
- `t('key', {}, 'scope')` calls in column `parseField` / `component` configs
- Template `| translate` references in `.html` files
- `TranslationService.translate()` calls in `.ts` files

Every key must have an en/es pair in the corresponding scope's JSON file, or the UI will show the raw key string.

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

### Pipes Must Be Imported in Every Component

Any component whose template uses `TranslatePipe` (`| translate`) or `LocaleDatePipe` (`| localeDate`) **must** import the pipe in its `imports` array. The Angular compiler will not resolve pipes from parent modules or ancestor components — standalone components require explicit imports.

```ts
// Always add to the component's imports array:
imports: [
  // ... other imports
  TranslatePipe,   // if using | translate in the template
  LocaleDatePipe,  // if using | localeDate in the template
],
```

Missing a pipe import will produce: `NG8004: No pipe found with name 'translate'` or `NG8004: No pipe found with name 'localeDate'`.

### LocaleDatePipe — Date Formatting

**`LocaleDatePipe`** from `@avalantec/base-app/i18n` formats dates using the browser's native `Intl.DateTimeFormat` API. It uses the current locale from `TranslationService.activeLanguage()` — no locale data files need to be imported.

**Template Usage:**

```html
{{ value | localeDate : options }}
```

- **`options`** — an `Intl.DateTimeFormatOptions` object (e.g. `{ dateStyle: 'medium' }`, `{ month: 'short', day: 'numeric' }`)
- The pipe is **impure** — re-evaluates when the locale signal changes
- **Never use `| date`** — always use `| localeDate` so date formatting is locale-aware

**Common format mappings from the old `| date` pipe:**

| Old `| date:format` | New `| localeDate : options` |
|---|---|
| `\| date` (default) | `\| localeDate : { dateStyle: 'medium' }` |
| `\| date : 'short'` | `\| localeDate : { dateStyle: 'short' }` |
| `\| date : 'medium'` | `\| localeDate : { dateStyle: 'medium' }` |
| `\| date : 'shortDate'` | `\| localeDate : { dateStyle: 'short' }` |
| `\| date : 'mediumDate'` | `\| localeDate : { dateStyle: 'medium' }` |
| `\| date : 'fullDate'` | `\| localeDate : { dateStyle: 'full' }` |
| `\| date : 'shortTime'` | `\| localeDate : { timeStyle: 'short' }` |
| `\| date : 'mediumTime'` | `\| localeDate : { timeStyle: 'medium' }` |
| `\| date : 'MMM'` | `\| localeDate : { month: 'short' }` |
| `\| date : 'EEE'` | `\| localeDate : { weekday: 'short' }` |
| `\| date : 'MMM d, yy'` | `\| localeDate : { month: 'short', day: 'numeric', year: '2-digit' }` |
| `\| date : 'MM/dd/yyyy'` | `\| localeDate : { year: 'numeric', month: '2-digit', day: '2-digit' }` |

**Import:**

```ts
import { LocaleDatePipe } from '@avalantec/base-app/i18n';
```

```ts
imports: [CommonModule, LocaleDatePipe, /* ... */],
```

**TypeScript Usage (no pipe needed — use `Intl.DateTimeFormat` directly):**

```ts
const locale = this.translationService.activeLanguage();
const fmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
return fmt.format(date);
```

**How it works under the hood:**

```ts
// projects/base-app/i18n/src/pipes/locale-date.ts
@Pipe({ name: 'localeDate', pure: false })
export class LocaleDatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(value: string | number | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string | null {
    if (value == null || value === '') return null;
    const locale = this.translationService.activeLanguage();
    return new Intl.DateTimeFormat(locale, options).format(new Date(value));
  }
}
```

The browser's `Intl.DateTimeFormat` is built-in — no locale data files, no dynamic imports, no per-locale bundling. It supports every locale the browser does, automatically.

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

## Reference Docs

- `projects/base-app/README.md` — full architecture guide (DI, Signals, naming, structure)
- `projects/base-app/CORE.md` — core module deep-dive (directives, services)
- `projects/base-app/FORMS-README.MD` — form architecture (`BaseForm<T>`, `TypedFormBuilder`)

## Agent Task Management

**MANDATORY for AI agents**: When working on tasks in this codebase, you MUST mark tasks as **completed** when finished. Do not leave tasks in an ambiguous state.

- Use clear task tracking (checklists, TODOs, or explicit status markers)
- Mark each task as **done/completed** immediately after finishing it
- If a task cannot be completed, mark it as **blocked** or **failed** with a clear reason
- Never leave tasks in a "partially done" state without explicit documentation

This ensures the human developer knows exactly what is finished and what remains.

## Versioning & Publishing

### Version Bump Policy

After adding translations support (i18n), all 14 libraries were bumped from
their individual `0.0.x` versions to a unified **`0.1.0`** to reflect the
coordinated release. All inter-library `peerDependencies` were updated to
`^0.1.0` accordingly.

### Build Order

Libraries must be built in topological order based on their peer dependency
graph. Each layer must complete before the next begins; libraries within the
same layer can build in parallel.

| Layer | Libraries | Depends on |
|-------|-----------|------------|
| 0 | `base-app` | _(none — foundation)_ |
| 1 | `projects`, `inventory`, `asset-roster`, `website`, `aduanix`, `email-marketing` | base-app |
| 2 | `tasks`, `sales`, `purchases`, `accounting` | base-app + Layer 1 |
| 3 | `helpdesk`, `l10n_cr_einvoice` | base-app + Layer 2 |
| 4 | `calendar` | all previous layers |

**Execution:**

```sh
# Layer 0
ng build base-app

# Layer 1 (parallel)
ng build projects inventory asset-roster website aduanix email-marketing

# Layer 2 (parallel)
ng build tasks sales purchases accounting

# Layer 3 (parallel)
ng build helpdesk l10n_cr_einvoice

# Layer 4
ng build calendar
```

### Pack & Publish

After building, each library's output in `dist/<name>/` must be packed into a
`.tgz` and published to the private npm registry. **Publish in the same
topological order as the build** so dependents can resolve the new version.

**Automated release script** — builds all libs in order, packs, and publishes:

```sh
sh tools/build/release.sh
```

The script follows the layered build order below. Each library is built with
`ng build --configuration production`, then `npm pack` + `npm publish` to the
private registry.

**Manual equivalent:**

```sh
# Full release pipeline
ng build base-app
(cd dist/base-app && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)

ng build projects inventory asset-roster website aduanix email-marketing
(cd dist/projects && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/inventory && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/asset-roster && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/website && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/aduanix && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/email-marketing && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)

ng build tasks sales purchases accounting
(cd dist/tasks && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/sales && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/purchases && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/accounting && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)

ng build helpdesk l10n_cr_einvoice
(cd dist/helpdesk && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
(cd dist/l10n_cr_einvoice && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)

ng build calendar
(cd dist/calendar && npm pack && npm publish --registry http://libraries.assetroster.com:4873/)
```

Private registry URL: `http://libraries.assetroster.com:4873/`
