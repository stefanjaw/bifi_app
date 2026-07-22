# Current Bugs — Aggregated from All Test Runs

> **Source:** Compiled from all test result files under `testings/` (asset-roster suite + contacts).
> **Last updated:** 2026-07-22 (MW-03 through MW-07 verified via UI test re-run; see Resolved Bugs)
> **Testing method:** Automated UI tests via Playwright MCP against `http://localhost:4200` (logged in as `opencode@test.com`).
>
> Bugs are grouped by module. Each table includes a **Root Cause** column with `file:line` reference and a brief explanation. Full root-cause details are in the **Root Cause Analysis** section at the bottom. Cross-cutting patterns are summarized under **Recurring Patterns**.
>
> Severity labels:
>
> | Severity | Meaning |
> |----------|---------|
> | **Critical** | Causes server error with no client feedback; blocks core functionality |
> | **High** | Breaks a primary user flow; data integrity risk |
> | **Medium** | UX defect or missing validation that allows bad data |
> | **Low** | Cosmetic / wording / minor inconsistency |

---

## 1. Asset Roster (main module)

Source: `asset-roster/asset-roster/asset-roster-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AR-01 | ~ | **Grid view card template throws `TypeError: Cannot read properties of undefined (reading 'address')`** — ✅ **RESOLVED 2026-07-22**: Added optional chaining + fallback: `element.locationId?.address \|\| ('notSet' \| translate)`. File: `asset-roster-list.html:181`. | **Fixed** |
| AR-02 | 28.10, 28.11 | **Dirty form guard re-fires `window.confirm` after accepting** — ✅ **RESOLVED 2026-07-22**: Set `draftService.isDraftNavigating = true` before navigation. See Resolved Bugs. | **Fixed** |
| AR-03 | ~ | **Maintenance-page Save/Cancel not in page header** — ✅ **RESOLVED 2026-07-22**: Removed `@if (isDirty())` gating. Save/Cancel now always visible but disabled when pristine via `[disabled]="!isDirty()"`. File: `asset-roster-edit-form.html:41-59`. | **Fixed** |
| AR-04 | ~ | **Section ordinal prefixes not visible in DOM** — ✅ **RESOLVED 2026-07-22**: Added `{{ ordinal() }}.` to `form-section.html`. See Resolved Bugs. | **Fixed** |
| AR-05 | 33.14-33.27 | **Many hardcoded English literals confirmed** — "Asset Photo", "of" counter, "Not set", "Unnamed", document descriptors, etc. | **Low** (pre-existing) | Multiple files — e.g. `asset-roster-edit-form.html:26` (`of`), `general-information-section.html:503` (`Asset Photo`), `asset-roster-list.html:163` (`Not set`), `asset-roster-document-dialog.ts:50-57` (descriptor options). None use `TranslatePipe`. |
| AR-06 | ~ | **Cannot create asset via UI — `p-datepicker` `acquiredDate` FormControl not updating** — ✅ **RESOLVED 2026-07-22**: Added `appendTo="body"` to p-datepicker inside the dialog. File: `asset-roster-form-dialog.html:319`. | **Fixed** |
| AR-07 | ~ | **Document upload causes template crash** — ✅ **RESOLVED 2026-07-22**: Added null guard `document.file?.name \|\| ('notSet' \| translate)`. File: `documents-section.html:33`. | **Fixed** |

---

## 2. Asset Commissioning

Source: `asset-roster/asset-commissioning/asset-commissioning-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AC-01 | ~ | **No whitespace validation on Details/Reason fields** — ✅ **RESOLVED 2026-07-22**: Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired`. See Resolved Bugs. | **Fixed** |
| AC-02 | ~ | **Decommissioned assets can be re-commissioned via the UI** — ✅ **RESOLVED 2026-07-22**: Added `assetRoster()?.status !== 'decommissioned'` check. See Resolved Bugs. | **Fixed** |
| AC-03 | 2.3 | **Commission dialog subtitle typo "Peform" instead of "Perform"** | **Low** | `asset-commissioning-form-dialog.html:16` uses translation key `performInspectionFor`. The typo is in the **translation catalog value** on the backend (key `performInspectionFor`, scope `asset-roster`). The template itself is correct; the misspelled value "Peform inspection for:" lives in the backend translation database. |
| AC-04 | 14.4 | **Activity History entries have no expand/collapse** — Details always visible. | **Low** | `activity-history-section.html:22-136` — `@for` loop renders each card with all content (badge, dates, cost, details) unconditionally. No `expanded`/`collapsed` signal, no toggle handler, no `@if` guard around details. Component class has no expand-state signal. |
| AC-05 | 14.5/14.6 | **Labeling inconsistency — "Add Attachment" button vs "Add File" dialog header** | **Low** | Button: `activity-history-section.html:120` uses key `addAttachment` → "Add Attachment". Dialog header: `asset-roster-activity-history-add-file-dialog.ts:44-54` returns hardcoded English strings with "Add File" (not routed through `TranslatePipe`). Two different terms for the same action. |
| AC-06 | 15.1 | **Maintenance section visible on awaiting-commissioning assets** — Section visible with disabled buttons instead of hidden. | **Low** | `asset-roster-edit-form.html:118-123` — `<bifi-app-maintenance-service-section>` rendered unconditionally (no `@if` on status). Inside, controls are disabled via `canStartOrSkipPM()`/`canStartService()` returning false, but the section (headers, cards, disabled buttons) is never hidden. |
| AC-08 | ~ | **Decommission button shows on decommissioned assets** — ✅ **RESOLVED 2026-07-22**: Wrapped entire button block in `@if (status !== 'decommissioned')` so neither Commission nor Decommission buttons appear on already-decommissioned assets. Verified: both null (hidden). File: `commissioning-lifecycle-section.html:9-31`. | **Fixed** |
| AC-07 | ~ | **Double toasts per action** — ✅ **RESOLVED 2026-07-22**: Added `notificationConfig: { enable: false }` to commission POST and decommission PUT. See Resolved Bugs. | **Fixed** |

---

## 3. Asset Maintenances (Service + PM)

Source: `asset-roster/asset-maintenances/asset-maintenances-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AM-01 | ~ | **CRITICAL — Finish Service/PM with empty Notes returns HTTP 400 (AM-01)** — ✅ **RESOLVED 2026-07-22**: Added `NonWhitespaceValidators.nonWhitespaceRequired` to notes. Error handler now shows toast. See Resolved Bugs. | **Fixed** |
| AM-02 | ~ | **"Skip PM" button NOT shown when PM is in progress (AM-02)** — ✅ **RESOLVED 2026-07-22**: Skip PM always rendered. See Resolved Bugs. | **Fixed** |
| AM-03 | ~ | **Status alert shows "Active" instead of "In PM" (AM-03)** — ✅ **RESOLVED 2026-07-22**: Added separate `in-pm` branch. See Resolved Bugs. | **Fixed** |
| AM-04 | ~ | **Double-colon typo (AM-04)** — ✅ **RESOLVED 2026-07-22**: Removed extra `:`. See Resolved Bugs. | **Fixed** |
| AM-05 | ~ | **Initiate Service button HIDDEN (AM-05)** — ✅ **RESOLVED 2026-07-22**: Changed to always visible with `[disabled]`. See Resolved Bugs. | **Fixed** |
| AM-06 | 3.5, 10.4, 19.1, 19.3 | **Activity history does NOT show entries immediately after initiating service or PM** | **Low** | `api-request-manager.ts:200-204` — `httpResource` GET request does not set `cache: 'no-store'`. `FetchBackend` passes `req.cache` (undefined) to `fetch()`, so browser uses default cache mode and may return cached GET responses on `reload()`. The code does call `activityHistories.reload()` but the browser cache prevents fresh data. |
| AM-07 | ~ | **PM schedule fields remain locked after finishing PM (AM-07)** — ✅ **RESOLVED 2026-07-22**: Changed to check `pmStarted()`. See Resolved Bugs. | **Fixed** |
| AM-08 | ~ | **Double toast on service creation (AM-08)** — ✅ **RESOLVED 2026-07-22**: Added `notificationConfig: { enable: false }`. See Resolved Bugs. | **Fixed** |

---

## 4. Asset Types (Settings CRUD)

Source: `asset-roster/asset-types/asset-types-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AT-01 | ~ | **Save button only appears when form is dirty** — ✅ **RESOLVED 2026-07-22**: Save button now always visible (disabled when pristine). See Resolved Bugs. | **Fixed** |
| AT-02 | ~ | **Description server-required but not client-validated** — ✅ **RESOLVED 2026-07-22**: Added `NonWhitespaceValidators.nonWhitespaceRequired` to Description field. File: `asset-type-form.ts:16`. | **Fixed** |
| AT-03 | 7.3 | **Orphaned references on asset type deletion** — Deleting referenced type leaves dangling refs. | **Medium** | `asset-types-list.ts:54-63` — direct `delete()` with no reference check. Backend `AssetTypeService` doesn't override `delete`, so `BaseService.delete` (`base-service.ts:261-285`) just soft-deletes (`active: false`). Assets referencing via `assetTypeIds` are left with orphaned refs. |
| AT-04 | ~ | **No unsaved changes prompt** — ✅ **RESOLVED 2026-07-22**: Added `canDeactivate: [DirtyFormGuard]` to `create` and `edit/:id` routes. Files: `asset-types.routes.ts:21,30`. | **Fixed** |
| AT-05 | ~ | **Empty name accepted via whitespace** — ✅ **RESOLVED 2026-07-22**: Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired`. File: `asset-type-form.ts:16`. | **Fixed** |
| AT-06 | 10.3 | **Duplicate names silently allowed** — No uniqueness validation. | **Low** | `asset-type-form.ts:16` — no async uniqueness validator. Backend model (`asset-type.model.ts:8-11`) has no unique index on `name`. Duplicates accepted on both sides. |

---

## 5. Facilities (Settings CRUD — Facilities + Rooms)

Source: `asset-roster/facilities/facilities-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| FA-01 | ~ | **Whitespace-only facility name accepted** — ✅ **RESOLVED 2026-07-22**: Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired`. File: `facility-form.ts:16`. | **Fixed** |
| FA-02 | ~ | **No UI mechanism to clear selected contact** — ✅ **RESOLVED 2026-07-22**: Added `[showClear]="true"` to contactId p-select. File: `facilities-form.html:47`. | **Fixed** |
| FA-03 | 7.3 | **Facility with rooms deleted without warning** — Rooms become orphaned. | **High** | `facilities-list.ts:54-63` — direct delete with only generic confirmation. Backend `FacilityService` overrides `create`/`update` to manage rooms but does **not** override `delete`. `BaseService.delete` soft-deletes only the facility. Rooms reference via `facilityId` (`room.model.ts:21-23`) → orphaned. |
| FA-04 | ~ | **Untranslated i18n key `confirmDialog.unsavedChanges`** in DirtyFormGuard dialog — ✅ **RESOLVED 2026-07-22**: Key added to `base-app-resource-translations.json` (en/es). Dialog now shows "You have unsaved changes. Are you sure you want to leave this page?" | **Fixed** | `dirty-form-confirmation-dialog.html:10` — key `confirmDialog.unsavedChanges` added to catalog. |
| FA-05 | 18.6 | **Duplicate facility names silently allowed** | **Medium** | `facility-form.ts:16` — `name: ['', [Validators.required]]` with no async uniqueness validator. No backend unique index. Same as AT-06. |
| FA-06 | ~ | **Inconsistent field label "Location" vs validation "Address"** — ✅ **RESOLVED 2026-07-22**: Changed label key from `'location'` to `'address'`; fixed column type from `'number'` to `'text'`. Files: `rooms-form.html:52`, `room-columns.ts:20`. | **Fixed** |
| FA-07 | ~ | **No unsaved changes prompt on Facility forms** — ✅ **RESOLVED 2026-07-22**: Added `canDeactivate: [DirtyFormGuard]` and `hasUnsavedChanges()`. Files: `facilities.routes.ts:21,28`, `facilities-form.ts:71-73`. | **Fixed** |

---

## 6. Maintenance Windows (Settings CRUD)

Source: `asset-roster/maintenance-windows/maintenance-windows-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| MW-01 | 4.8 | **Whitespace-only name accepted** — ✅ **VERIFIED 2026-07-22**: Whitespace-only Name rejected with "This field is required" validation error. | **Fixed & Verified** | `maintenance-window-form.ts:19` — replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired`. |
| MW-02 | 10.4 | **Duplicate names silently allowed** | **Medium** | `maintenance-window-form.ts:19` — no async uniqueness validator, no backend unique index. Same as AT-06. |
| MW-03 | 8.3 | **No unsaved changes prompt** — ✅ **VERIFIED 2026-07-22**: DirtyFormGuard shows confirmation dialog "You have unsaved changes. Are you sure you want to leave this page?" with Cancel/Confirm. Cancel stays on form, Confirm discards and navigates. Files: `maintenance-windows.routes.ts:21,30`, `maintenance-windows-form.ts:111-113`. | **Fixed & Verified** |
| MW-04 | 4.5 | **Days Before/After default to 1, masking required validation** — ✅ **VERIFIED 2026-07-22**: Both fields now default to `null!`. When empty on submit, both show "This field is required" with toast error. File: `maintenance-window-form.ts:20-21`. | **Fixed & Verified** |
| MW-05 | 4.2, 11.7 | **Inconsistent section heading casing** — ✅ **VERIFIED 2026-07-22**: Section heading renders as "1. General Information" in English, "1. Información General" in Spanish. Translation catalog already title case. | **Fixed & Verified** |
| MW-06 | 2.1, 11.6 | **Column header "Role Name" vs form field "Name"** — ✅ **VERIFIED 2026-07-22**: Column now shows "Name". All four column headers render correctly (Name, Days Before, Days After, Recurrency). File: `maintenance-window-columns.ts:7`. | **Fixed & Verified** |
| MW-07 | 11.9 | **Hardcoded English recurrence labels with typo "Semi-anually"** — ✅ **VERIFIED 2026-07-22**: Recurrence options now translated via `t('recurrence.*', {}, 'asset-roster')` in form's computed signal and column's `parseField`. Typo fixed to "Semi-annually". Language switch confirmed: English "Daily" → Spanish "Diario". Files: `maintenance-windows-form.ts`, `maintenance-window-columns.ts`. | **Fixed & Verified** |

---

## 7. Contacts

Source: `contacts/contacts_results_20260721.md` and `contacts/contacts_results_20260717.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| CO-01 | 3.2 | **Save button only appears when form is dirty** | **Medium** | `form-actions.html:14` — `@if (formChanged() && showSave())`. Consumer: `contacts-form.html:21` binds `[formChanged]="form.dirty"`. Same shared root cause as AT-01. |
| CO-02 | 6.2 | **Orphaned child contact on parent delete** — Child contacts retain stale parent ref. | **Medium** | `contacts-list.ts:55-64` — direct delete, no child check. Backend `ContactService` has no `delete()` override. `BaseService.delete` removes parent; children's `parentId` points to non-existent ObjectId. |
| CO-03 | ~ | **Missing i18n translation — `confirmDialog.unsavedChanges` shows raw key** — ✅ **RESOLVED 2026-07-22**: Key added to `base-app-resource-translations.json` (en/es). Same fix as FA-04. | **Fixed** | `dirty-form-confirmation-dialog.html:10` — key added to catalog. |
| CO-04 | ~ | **CR VAT Type required but not indicated** — ✅ **RESOLVED 2026-07-22**: Added `Validators.required` to `crVatType` FormControl and `*` required marker to label. File: `contact-cr-plugin.ts:115`. | **Fixed** |
| CO-05 | ~ | **Contact method required but not indicated** — ✅ **RESOLVED 2026-07-22**: Added `atLeastOneContactMethod` group-level validator to `ContactForm.createForm()`. Ensures at least one of phone/email/website is provided. File: `contact-form.ts`. | **Fixed** |
| CO-06 | 8–9 | **Export and Import not implemented** — No buttons or methods. | **Low** (planned) | `contacts-list.html:3-17` — only `goBack` and `addNew` buttons, no export/import. `crud-contacts.ts` — only sets `endpoint = 'contacts'`, no export/import methods. Backend `BaseRoutes` auto-registers `/export`/`/import` but frontend never calls them. |
| CO-07 | 10 | **No Active/Inactive toggle in UI** — `active` field exists but no UI control. | **Low** (planned) | `contact-form.ts:50-81` — `createForm()` has no `active` control. `contacts-form.html` and `contacts-list.html` — no active/inactive toggle. Interface (`contact.ts:24`) and backend model (`contact.model.ts:124-127`) have `active: boolean` but it's not exposed in the UI. |
| CO-08 | ~ | **No UI mechanism to clear parent company** — ✅ **RESOLVED 2026-07-22**: Added `[showClear]="true"` to parentId p-select. Also changed submit handler to send `parentId: null` instead of deleting the key (fixes CO-10 frontend component). Files: `contacts-form.html:115-124`, `contacts-form.ts:179`. | **Fixed** |
| CO-09 | 3.9 | **Duplicate emails silently allowed** | **Low** | `contact-form.ts:55` — `email: ['', [Validators.email]]` has only format validation, no async uniqueness validator. Backend model (`contact.model.ts:25-29`) has `// unique: true,` **commented out**. Neither layer enforces uniqueness. |
| CO-10 | ~ | **parentId cannot be removed via PUT** — ✅ **RESOLVED 2026-07-22**: Three-part fix. (1) Frontend sends `parentId: ''` via FormData when cleared (`contacts-form.ts:179`). (2) Backend DTO adds `@ValidateIf` to skip `@IsMongoId()` for empty/null (`contact.dto.ts:93-95`). (3) Backend service converts `''` → `null` before `super.update()` (`contact-service.ts`). Verified: PUT returns 200, request body shows empty `parentId`. | **Fixed** |

---

## Recurring Patterns (Cross-Module)

Several issues appear across multiple modules and indicate shared root causes in `@avalantec/base-app`:

### Pattern A — Whitespace-only required fields accepted
- **Affected:** AC-01, ~~AT-05~~ (resolved 2026-07-22), ~~FA-01~~ (resolved 2026-07-22), MW-01
- **Root cause:** No shared whitespace/trim validator exists anywhere in `base-app/form` (confirmed by exhaustive search — only match is `dirty-utils.ts:99` `.trim()` inside a label formatter, not a validator). `Validators.required` only rejects `null`/`undefined`/`''`; whitespace passes through.
- **Shared fix location:** `projects/base-app/form/` — add a `nonWhitespaceRequired` validator and use it on all `name`/`details`/`reason` fields.

### Pattern B — Duplicate names silently allowed
- **Affected:** AT-06, FA-05, MW-02, CO-09 (emails)
- **Root cause:** No client-side async uniqueness validator on any `name`/`email` field. No backend unique index (CO-09: `unique: true` is commented out in the model).
- **Shared fix location:** Backend models need unique indexes + `409 Conflict` responses. Frontend form services need async validators calling a uniqueness-check endpoint.

### Pattern C — Save button hidden until form is dirty
- **Affected:** ~~AT-01~~ (resolved 2026-07-22), CO-01 (and asset-roster create dialog)
- **Root cause:** `form-actions.html:14` — `@if (formChanged() && showSave())` removes the Save button from the DOM when form is pristine. This is the shared `FormActions` component in `base-app/form`.
- **Shared fix location:** `projects/base-app/form/src/components/form-actions/form-actions.html:14` — change from conditional render to always-visible-but-disabled.

### Pattern D — Orphaned references on parent deletion
- **Affected:** AT-03, FA-03, CO-02, CO-10
- **Root cause:** Frontend delete handlers call `crud.delete()` directly with no reference check. Backend services don't override `BaseService.delete` to check for inbound references — `base-service.ts:261-285` just soft-deletes (`active: false`).
- **Shared fix location:** `bifi_app_be/src/system/libraries/base-module/base-service.ts` — `delete()` should check for inbound references and reject with `409 Conflict` or cascade-unlink children.

### Pattern E — Untranslated `confirmDialog.unsavedChanges` key
- **Affected:** FA-04, CO-03
- **Root cause:** `dirty-form-confirmation-dialog.html:10` requests key `confirmDialog.unsavedChanges` with scope `base-app/resource`. The translation catalog (`base-app-resource-translations.json`) only defines `confirmDialog.message`/`.header`/`.cancel`/`.confirm` — the `.unsavedChanges` key is missing. `TranslationService.translate()` returns the raw key string when not found (`translation.ts:154-155`). Secondary issue: this is a `base-app/form` component keyed against `base-app/resource` scope — a scope mismatch.
- **Shared fix location:** Add `confirmDialog.unsavedChanges` en/es pair to `base-app-resource-translations.json` (or move the dialog to use `base-app/form` scope and add the key there).

### Pattern F — No unsaved changes prompt on plain forms (non-DirtyFormGuard routes)
- **Affected:** ~~AT-04~~ (resolved 2026-07-22), ~~FA-07~~ (resolved 2026-07-22), ~~MW-03~~ (resolved 2026-07-22)
- **Root cause:** `asset-types.routes.ts:17-30` and `maintenance-windows.routes.ts:19-36` — `create`/`edit` routes only declare `canActivate: [permissionGuard]`, missing `canDeactivate: [DirtyFormGuard]`. The guard is opt-in per route.
- **Shared fix location:** Add `canDeactivate: [DirtyFormGuard]` to all create/edit routes. Reference pattern: `contacts/src/routes/contact-routes.ts:21,29`.

### Pattern G — Double toasts on create/update
- **Affected:** AC-07, AM-08 (and asset-roster PUT saves)
- **Root cause:** `notification.ts:57-63` — `NotificationInterceptor` unconditionally fires a success toast for every POST/PUT/DELETE/PATCH response. The `id: toastId` only replaces the loading toast, not any component-level toast. Feature dialogs also manually call `toastManager.showSuccess(...)` in their `next` handler → two toasts for the same request.
- **Shared fix location:** `projects/base-app/resource/src/libraries/interceptors/notification/notification.ts` — either suppress the interceptor toast when the consuming component shows its own, or remove manual `showSuccess` calls from feature components and rely solely on the interceptor. The interceptor needs a context-level opt-out mechanism.

---

## Root Cause Analysis (Detailed)

This section provides the full file paths, line numbers, and code snippets for each bug's root cause.

### Shared Base-App Root Causes

These root causes live in `@avalantec/base-app` and affect multiple modules:

| # | Component | File | Line(s) | Issue |
|---|-----------|------|---------|-------|
| S-01 | `FormActions` | `base-app/form/src/components/form-actions/form-actions.html` | 14 | `@if (formChanged() && showSave())` — Save button removed from DOM when form pristine (affects AT-01, CO-01) |
| S-02 | `FormSection` | `base-app/form/src/components/form-section/form-section.html` | 10 | `{{ title() }}` only — `ordinal` input declared (`form-section.ts:27`) but never rendered in template (affects AR-04) |
| S-03 | `FormActionsHandler` | `base-app/form/src/directives/form-actions-handler.ts` | 52-55, 65-90 | Not-dirty branch: hardcoded English `'You have not made any changes.'` (line 53). Invalid branch: hardcoded English `'The form contains errors.'` (line 83). Both strings are NOT translated. |
| S-04 | `DirtyFormGuard` | `base-app/form/src/guards/dirty-form.guard.ts` | 17-27 | `canDeactivate()` only short-circuits when `draftService.isDraftNavigating === true`. Without that flag, fires `DirtyFormConfirmationService.requestConfirmation()` even if component already called `window.confirm()` (affects AR-02) |
| S-05 | `DirtyFormConfirmationDialog` | `base-app/form/src/components/dirty-form-confirmation-dialog/dirty-form-confirmation-dialog.html` | 10 | Uses key `confirmDialog.unsavedChanges` with scope `base-app/resource` — key missing from catalog (affects FA-04, CO-03) |
| S-06 | `NotificationInterceptor` | `base-app/resource/src/libraries/interceptors/notification/notification.ts` | 57-63 | Unconditionally shows success toast on every POST/PUT/DELETE/PATCH `Response`. No deduplication against component-level toasts (affects AC-07, AM-08) |
| S-07 | No trim validator | `base-app/form/` (entire entrypoint) | — | No shared whitespace/trim/non-empty-whitespace validator exists. Only `Validators.required` is used everywhere, which accepts whitespace-only strings (affects AC-01, AT-05, FA-01, MW-01) |
| S-08 | `ApiRequestManager` | `base-app/resource/src/libraries/api-request-manager.ts` | 200-204 | `httpResource` GET requests do not set `cache: 'no-store'`. Browser may return cached responses on `reload()` (affects AM-06) |

### Module-Specific Root Causes

#### Asset Roster (AR-01 to AR-07)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| AR-01 | `asset-roster-list.html` | 181 | `{{ element.locationId.address }}` — no `?.`. Line 163 uses `?.` for `assetTypeIds[0]?.name` but this line doesn't. |
| AR-02 | `asset-roster-maintenance.ts` | 376-386 | `confirmDiscardUnsavedChanges()` calls `window.confirm()` but never sets `draftService.isDraftNavigating = true`. Also affects `handleNavigatePrevAsset()` (line 224) and `handleNavigateNextAsset()` (line 231). |
| AR-03 | `asset-roster-edit-form.html` | 41 | `@if (isDirty())` wraps Save/Cancel. `isDirty` is `toSignal(form.events → form.dirty)` from `asset-roster-maintenance.ts:160-166`. After `resetValueToInitialState()` calls `markAsPristine()` (line 495), buttons disappear. |
| AR-04 | `form-section.html` | 10 | See S-02 above. |
| AR-05 | Multiple files | Multiple | See description column for key locations. |
| AR-06 | `asset-roster-form-dialog.html` | 319 | `<p-datepicker formControlName="acquiredDate" [showIcon]="true">` — missing `appendTo="body"`. Dialog modal mask intercepts calendar click before CVA `onChange`. Compare working usage in `tasks/.../create-tasks-form-dialog.html:73-78` which has `appendTo="body"`. |
| AR-07 | `documents-section.html` | 33 | `{{ document.file.name }}` — no null guard. `add-document-form.ts:19` initializes `file: [null!]`. `form-uploader.ts:173-178` writes `file: [data.file]` where `data.file` can be null. |

#### Asset Commissioning (AC-01 to AC-07)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| AC-01 | `create-commissioning-form.ts` / `update-decommissioning-form.ts` | 20 / 17 | `details: ['', [Validators.required]]` — no trim validator. See S-07. |
| AC-02 | `commissioning-lifecycle-section.html` | 7-9 | `@if (!assetCommissioning \|\| assetCommissioning.outcome === 'fail')` — never checks `assetRoster()?.status !== 'decommissioned'`. When decommissioned, `assetCommission` is null → condition is true → Commission button shows. |
| AC-03 | Translation catalog (backend) | — | Key `performInspectionFor` value has typo "Peform" (missing "r"). Template (`asset-commissioning-form-dialog.html:16`) is correct — uses `{{ 'performInspectionFor' | translate }}`. Fix belongs in the translation database. |
| AC-04 | `activity-history-section.html` | 22-136 | `@for` loop renders all content unconditionally. No `expanded` signal, no toggle handler, no `@if` guard. Class (`activity-history-section.ts:31-62`) has no expand-state. |
| AC-05 | `asset-roster-activity-history-add-file-dialog.ts` | 44-54 | `header = computed(() => { ... return 'Add File to Maintenance: ...' / 'Add File to commissioning from asset: ...' })` — hardcoded English strings, not through `TranslatePipe`. Button uses key `addAttachment` → "Add Attachment". |
| AC-06 | `asset-roster-edit-form.html` | 118-123 | `<bifi-app-maintenance-service-section>` rendered with no `@if` on status. Section only disables controls, never hides. |
| AC-07 | `notification.ts` + `commissioning-form-dialog.ts` / `decommissioning-form-dialog.ts` | 57-63 / 82 / 66 | See S-06. Interceptor auto-toast + manual `toastManager.showSuccess()`. |

#### Asset Maintenances (AM-01 to AM-08)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| AM-01 | `update-maintenance-form.ts` / `asset-finish-maintenance-form-dialog.ts` | 18 / 99-101 | `notes: ['']` (no validators) + `error: () => { this.submitLoading.set(false); }` (no user feedback). |
| AM-02 | `maintenance-service-section.html` | 125-151 | Skip PM button in `@if (!pmStarted())` block (line 125). `@else` (line 143) renders only Finish PM. |
| AM-03 | `status-banner-section.html` | 15-20 | `@else if (status === 'active' \|\| status === 'in-pm')` — both show `assetActive` key → "Active". No separate `in-pm` branch. |
| AM-04 | `asset-finish-maintenance-form-dialog.html` | 18 | `{{ 'initiatedOn' | translate: {} : 'asset-roster' }}:` — literal `:` after `}}`. Translation value already ends with `:`. |
| AM-05 | `maintenance-service-section.html` | 163-170 | `@if (canStartService())` — hides button when false instead of `[disabled]="!canStartService()"`. |
| AM-06 | `api-request-manager.ts` | 200-204 | See S-08. `httpResource` without `cache: 'no-store'`. Browser returns cached GET on `reload()`. |
| AM-07 | `maintenance-service-section.ts` | 47-53 | `isMaintenanceWindowsEditLocked = computed(() => assetRoster.maintenanceWindowIds?.length > 0)` — checks if windows were **ever assigned**, not if PM is currently active. Should check `this.pmStarted()`. |
| AM-08 | `asset-maintenance-form-dialog.ts` / `notification.ts` | 80 / 57-63 | See S-06. Manual `toastManager.showSuccess('Service created successfully')` + interceptor auto-toast. |

#### Asset Types (AT-01 to AT-06)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| AT-01 | `form-actions.html` / `asset-types-form.html` | 14 / 17 | See S-01. `@if (formChanged() && showSave())` + `[formChanged]="form.dirty"`. |
| AT-02 | `asset-type-form.ts` | 16 | `description: ['']` — no validators. Backend `asset-type.dto.ts:9-12` requires `@IsNotEmpty()`. Fixed 2026-07-22: added `NonWhitespaceValidators.nonWhitespaceRequired`. |
| AT-03 | `asset-types-list.ts` / `base-service.ts` | 54-63 / 261-285 | Direct delete, no reference check. Backend `BaseService.delete` soft-deletes only. Assets reference via `assetTypeIds`. |
| AT-04 | `asset-types.routes.ts` | 17-30 | Missing `canDeactivate: [DirtyFormGuard]` on `create`/`edit/:id` routes. Fixed 2026-07-22: added guard + `hasUnsavedChanges()` method to `asset-types-form.ts`. |
| AT-05 | `asset-type-form.ts` | 16 | `name: ['', [Validators.required]]` — no trim validator. See S-07. |
| AT-06 | `asset-type-form.ts` | 16 | No async uniqueness validator. No backend unique index on `name`. |

#### Facilities (FA-01 to FA-06)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| FA-01 | `facility-form.ts` | 16 | `name: ['', [Validators.required]]` — no trim validator. See S-07. Fixed 2026-07-22: added `NonWhitespaceValidators.nonWhitespaceRequired`. |
| FA-02 | `facilities-form.html` | 42-47 | `<p-select>` missing `[showClear]="true"`. Fixed 2026-07-22: added `[showClear]="true"`. |
| FA-03 | `facilities-list.ts` / `facility-service.ts` | 54-63 / — | Direct delete. Backend `FacilityService` overrides `create`/`update` but not `delete`. Rooms orphaned via `facilityId`. |
| FA-04 | `dirty-form-confirmation-dialog.html` | 10 | See S-05. Key `confirmDialog.unsavedChanges` added to `base-app-resource-translations.json` but pending backend deployment. |
| FA-05 | `facility-form.ts` | 16 | No async uniqueness validator, no backend unique index. Same as AT-06. |
| FA-06 | `rooms-form.html` / `room-columns.ts` | 50-61 / 17-22 | Label used key `location` → "Location". Column used `title: 'address'` → "Address". Form control is `formControlName="address"`. Fixed 2026-07-22: changed label to `'address'`, column type `'number'` → `'text'`. |
| FA-07 | `facilities.routes.ts` / `facilities-form.ts` | 17-30 / — | Missing `canDeactivate: [DirtyFormGuard]` on Facility create/edit routes. No `hasUnsavedChanges()` method on component. Fixed 2026-07-22: added guard + method. |

#### Maintenance Windows (MW-01 to MW-07)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| MW-01 | `maintenance-window-form.ts` | 19 | `name: ['', [Validators.required]]` — no trim validator. See S-07. |
| MW-02 | `maintenance-window-form.ts` | 19 | No async uniqueness validator, no backend unique index. Same as AT-06. |
| MW-03 | `maintenance-windows.routes.ts` | 21,30 | Missing `canDeactivate: [DirtyFormGuard]`. Fixed 2026-07-22: added guard + `hasUnsavedChanges()`. |
| MW-04 | `maintenance-window-form.ts` | 20-21 | `daysBefore: [1, ...]` and `daysAfter: [1, ...]` — default to `1` instead of `null`. Fixed 2026-07-22: changed to `[null!, ...]`. |
| MW-05 | Translation catalog (`asset-roster-translations.json`) | 3477-3478 | `generalInformation` en value is "General Information" (already title case — no change needed). |
| MW-06 | `maintenance-window-columns.ts` | 7 | `title: 'roleName'` — copy-paste from roles module. Fixed 2026-07-22: changed to `title: 'name'`. |
| MW-07 | `maintenance-windows-form.ts` | 63-70 | Hardcoded English `recurrencyOptions` array. Fixed 2026-07-22: replaced with translation keys `recurrence.*`, fixed value typo `semi-anually` → `semi-annually`. |

#### Contacts (CO-01 to CO-10)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| CO-01 | `form-actions.html` / `contacts-form.html` | 14 / 21 | See S-01. |
| CO-02 | `contacts-list.ts` / `contact-service.ts` (backend) | 55-64 / — | Direct delete, no child check. Backend `ContactService` no `delete` override. Children's `parentId` orphaned. |
| CO-03 | `dirty-form-confirmation-dialog.html` | 10 | See S-05. |
| CO-04 | `contact-cr-plugin.ts` | 115 | `new FormControl('')` — no `Validators.required`. Label (`contact-cr-plugin.html:33`) has no required marker. |
| CO-05 | `contact-form.ts` | 50-81 | `phoneNumber: ['']`, `email: ['', [Validators.email]]`, `website: ['']` — none required, no group-level "at least one" validator. Backend has `AtLeastOneContactConstraint`. |
| CO-06 | `contacts-list.html` / `crud-contacts.ts` | 3-17 / — | No export/import buttons in template. No export/import methods in CRUD service. |
| CO-07 | `contact-form.ts` | 50-81 | `createForm()` has no `active` control. No toggle in form or list templates. `active: boolean` exists on interface and backend model. |
| CO-08 | `contacts-form.html` | 115-124 | `<p-select formControlName="parentId">` missing `[showClear]="true"`. Same as FA-02. |
| CO-09 | `contact-form.ts` / `contact.model.ts` (backend) | 55 / 25-29 | Only `Validators.email` (format), no async uniqueness. Backend `// unique: true,` commented out. |
| CO-10 | `contact.dto.ts` (backend) / `contacts-form.ts` | 93-95 / 173 | `@IsMongoId()` rejects `""`. `@IsOptional()` only skips `null`/`undefined`. Frontend `if (!rawValue.parentId) delete rawValue.parentId;` removes key from payload → backend preserves existing value. |

---

## Summary by Severity

| Severity | Count | IDs (active) |
|----------|-------|-------------|
| **Critical** | 0 | (all resolved) |
| **High** | 1 | FA-03 |
| **Medium** | 4 | AT-03, FA-05, MW-02, CO-02 |
| **Low** | 8 | AR-05, AC-03, AC-04, AC-05, AC-06, AM-06, AT-06, CO-09 |
| **Active total** | 13 | (38 resolved + 6 verified; see Resolved Bugs section.) |
| **Original total** | 51 | |

---

## How to Update This File

When a new test run finds bugs:
1. Add the new bug to the appropriate module section above with a unique `<MODULE>-NN` ID (e.g. `AR-08` for the next asset-roster bug).
2. Fill in the **Root Cause (file:line)** column with the exact source location.
3. Add a detailed entry in the **Root Cause Analysis** section.
4. If the bug matches one of the **Recurring Patterns**, add a note in that pattern's "Affected" list.
5. Update the **Summary by Severity** table.
6. Update the **Last updated** date at the top.

When a bug is fixed:
1. Do **not** delete the row — move it to the "## Resolved Bugs" section at the bottom with the resolution date and PR/commit reference. This preserves the audit trail of what was tested and found.
2. Update the **Summary by Severity** table.

---

## Resolved Bugs

| ID | Module | Description | Resolution | Fix Reference |
|----|--------|-------------|------------|---------------|
| AR-01 | Asset Roster | Grid view card TypeError reading 'address' | 2026-07-22 | Added optional chaining `element.locationId?.address` with `notSet` fallback. File: `asset-roster-list.html:181` |
| AR-02 | Asset Roster | Dirty form guard re-fires `window.confirm` after accepting | 2026-07-22 | Set `draftService.isDraftNavigating = true` before `router.navigate()` in `handleBackToDashboard()`, `handleNavigatePrevAsset()`, and `handleNavigateNextAsset()`. File: `asset-roster-maintenance.ts:367,229,236` |
| AR-03 | Asset Roster | Maintenance-page Save/Cancel not in page header | 2026-07-22 | Removed `@if (isDirty())` gating. Save/Cancel always visible but disabled when pristine. File: `asset-roster-edit-form.html:41-59` |
| AR-04 | Asset Roster | Section ordinal prefixes not visible in DOM | 2026-07-22 | Added `@if (ordinal()) { ... } {{ ordinal() }}.` to `form-section.html:10` template. The `ordinal` input was declared but never rendered. File: `form-section.html:12` |
| AR-06 | Asset Roster | Cannot create asset via UI — p-datepicker FormControl not updating | 2026-07-22 | Added `appendTo="body"` to p-datepicker inside dialog. File: `asset-roster-form-dialog.html:319` |
| AR-07 | Asset Roster | Document upload causes template crash | 2026-07-22 | Added null guard `document.file?.name` with fallback. File: `documents-section.html:33` |
| AM-01 | Asset Maintenances | CRITICAL — Finish Service/PM with empty Notes HTTP 400 | 2026-07-22 | Added `NonWhitespaceValidators.nonWhitespaceRequired` to notes field. Error handler now shows toast. Files: `update-maintenance-form.ts:18`, `asset-finish-maintenance-form-dialog.ts:99-101` |
| AM-02 | Asset Maintenances | "Skip PM" button NOT shown when PM is in progress | 2026-07-22 | Moved Skip PM outside `@if (!pmStarted())` block — always rendered. File: `maintenance-service-section.html:125-151` |
| AM-03 | Asset Maintenances | Status alert shows "Active" instead of "In PM" | 2026-07-22 | Added separate `@else if (status === 'in-pm')` branch. File: `status-banner-section.html:15-23` |
| AM-04 | Asset Maintenances | Double-colon typo "initiated on::" | 2026-07-22 | Removed extra `:` after translation. File: `asset-finish-maintenance-form-dialog.html:18` |
| AM-05 | Asset Maintenances | Initiate Service button HIDDEN (not disabled) | 2026-07-22 | Changed to always rendered with `[disabled]="!canStartService()"`. File: `maintenance-service-section.html:163-170` |
| AM-07 | Asset Maintenances | PM schedule fields remain locked after finishing PM | 2026-07-22 | Changed `isMaintenanceWindowsEditLocked` to check `pmStarted()` not `maintenanceWindowIds?.length`. File: `maintenance-service-section.ts:47-53` |
| AM-08 | Asset Maintenances | Double toast on service creation | 2026-07-22 | Added `notificationConfig: { enable: false }` to service POST. File: `asset-maintenance-form-dialog.ts:72` |
| FA-04 | Facilities | Untranslated i18n key `confirmDialog.unsavedChanges` in DirtyFormGuard dialog | 2026-07-22 | Added en/es pair to `base-app-resource-translations.json`. Key `confirmDialog.unsavedChanges`. Verified: dialog shows proper message. |
| CO-03 | Contacts | Missing i18n translation — `confirmDialog.unsavedChanges` shows raw key | 2026-07-22 | Same fix as FA-04 — added en/es pair to `base-app-resource-translations.json`. |
| AC-01 | Asset Commissioning | No whitespace validation on Details/Reason fields | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `create-commissioning-form.ts:20` and `update-decommissioning-form.ts:17`. Also created shared validator in `base-app/form`. File: `non-whitespace.validator.ts` |
| AC-02 | Asset Commissioning | Decommissioned assets can be re-commissioned via the UI | 2026-07-22 | Added `assetRoster()?.status !== 'decommissioned'` to Commission button condition. File: `commissioning-lifecycle-section.html:9` |
| AC-07 | Asset Commissioning | Double toasts per action | 2026-07-22 | Added `notificationConfig: { enable: false }` to commission POST and decommission PUT. Files: `asset-commissioning-form-dialog.ts:74`, `asset-decommissioning-form-dialog.ts:59` |
| AC-08 | Asset Commissioning | Decommission button shows on decommissioned assets | 2026-07-22 | Wrapped buttons in `@if (status !== 'decommissioned')`. Both Commission and Decommission hidden on decommissioned assets. File: `commissioning-lifecycle-section.html:9-31` |
| AT-01 | Asset Types | Save button only appears when form is dirty | 2026-07-22 | Changed `@if (formChanged() && showSave())` to `@if (showSave())` with `[disabled]="!formChanged() \|\| isSubmitting() \|\| formDisabled()"`. File: `form-actions.html:14-26` |
| AT-02 | Asset Types | Description server-required but not client-validated | 2026-07-22 | Added `NonWhitespaceValidators.nonWhitespaceRequired` to Description field. File: `asset-type-form.ts:16` |
| AT-04 | Asset Types | No unsaved changes prompt | 2026-07-22 | Added `canDeactivate: [DirtyFormGuard]` to `create` and `edit/:id` routes. Added `hasUnsavedChanges()` method to `AssetTypesForm`. Files: `asset-types.routes.ts:21,30`, `asset-types-form.ts:60-62` |
| AT-05 | Asset Types | Empty name accepted via whitespace | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `asset-type-form.ts:16`. File: `non-whitespace.validator.ts` |
| FA-01 | Facilities | Whitespace-only facility name accepted | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `facility-form.ts:16`. File: `non-whitespace.validator.ts` |
| FA-02 | Facilities | No UI mechanism to clear selected contact | 2026-07-22 | Added `[showClear]="true"` to contactId p-select. File: `facilities-form.html:47` |
| FA-06 | Facilities | Inconsistent field label "Location" vs "Address" | 2026-07-22 | Changed label key from `'location'` to `'address'` in rooms form. Fixed column type from `'number'` to `'text'`. Files: `rooms-form.html:52`, `room-columns.ts:20` |
| FA-07 | Facilities | No unsaved changes prompt on Facility forms | 2026-07-22 | Added `canDeactivate: [DirtyFormGuard]` to Facility create/edit routes. Added `hasUnsavedChanges()` to `FacilitiesForm`. Files: `facilities.routes.ts:21,28`, `facilities-form.ts:71-73` |
| MW-01 | Maintenance Windows | Whitespace-only name accepted | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `maintenance-window-form.ts:19`. File: `non-whitespace.validator.ts`. **Verified 2026-07-22: whitespace-only Name rejected with validation error.** |
| MW-03 | Maintenance Windows | No unsaved changes prompt | 2026-07-22 | Added `canDeactivate: [DirtyFormGuard]` to create/edit routes; added `hasUnsavedChanges()` method. Files: `maintenance-windows.routes.ts:21,30`, `maintenance-windows-form.ts:111-113`. **Verified 2026-07-22: confirmation dialog shows "You have unsaved changes..." with Cancel/Confirm.** |
| MW-04 | Maintenance Windows | Days Before/After default to 1, masking required validation | 2026-07-22 | Changed initial values from `1` to `null!`. Requires explicit user entry. File: `maintenance-window-form.ts:20-21`. **Verified 2026-07-22: both fields show "This field is required" when empty on submit.** |
| MW-05 | Maintenance Windows | Inconsistent section heading casing | 2026-07-22 | Translation catalog already had "General Information" (title case) — no change needed. **Verified 2026-07-22: renders as "1. General Information" (EN), "1. Información General" (ES).** |
| MW-06 | Maintenance Windows | Column header "Role Name" vs form field "Name" | 2026-07-22 | Changed `title: 'roleName'` to `title: 'name'` in `maintenance-window-columns.ts:7`. Column now shows "Name" matching the form field. **Verified 2026-07-22: table header shows "Name".** |
| MW-07 | Maintenance Windows | Hardcoded English recurrence labels with typo "Semi-anually" | 2026-07-22 | Replaced hardcoded labels with `t('recurrence.*', {}, 'asset-roster')` in form computed signal + column `parseField`. Fixed typo to "Semi-annually". Files: `maintenance-windows-form.ts`, `maintenance-window-columns.ts`. **Verified 2026-07-22: dropdown shows translated labels, table values translated, switches with language (EN "Daily" → ES "Diario").** |
| CO-01 | Contacts | Save button only appears when form is dirty | 2026-07-22 | Same fix as AT-01 — shared `form-actions.html` change. |
| CO-04 | Contacts | CR VAT Type required but not indicated | 2026-07-22 | Added `Validators.required` to `crVatType` FormControl and `*` marker to label. File: `contact-cr-plugin.ts:115`. |
| CO-05 | Contacts | Contact method required but not indicated | 2026-07-22 | Added `atLeastOneContactMethod` group-level validator to `ContactForm.createForm()`. File: `contact-form.ts`. |
| CO-08 | Contacts | No UI mechanism to clear parent company | 2026-07-22 | Added `[showClear]="true"` to parentId p-select. File: `contacts-form.html:115-124`. |
| CO-10 | Contacts | parentId cannot be removed via PUT | 2026-07-22 | Three files: (1) Frontend sends `parentId: ''` on clear (`contacts-form.ts:179`). (2) Backend DTO: `@ValidateIf` skips `@IsMongoId()` for empty/null (`contact.dto.ts:93-95`). (3) Backend service converts `''` → `null` before update (`contact-service.ts`). Verified PUT 200. |
