# Current Bugs — Aggregated from All Test Runs

> **Source:** Compiled from all test result files under `testings/` (asset-roster suite + contacts).
> **Last updated:** 2026-07-22 (fixes applied: see Resolved Bugs)
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
| AR-01 | 5.6, 3.2 | **Grid view card template throws `TypeError: Cannot read properties of undefined (reading 'address')`** — Switching to Grid triggers 18 console errors. Cards render partially but the footer block is silently broken. | **High** | `asset-roster-list.html:181` — `{{ element.locationId.address }}` dereferences `locationId` without optional chaining. Adjacent line 163 uses `?.` correctly for `assetTypeIds[0]?.name` but this line doesn't. Backend returns assets with no location → `locationId` is `undefined`. |
| AR-02 | 28.10, 28.11 | **Dirty form guard re-fires `window.confirm` after accepting** — Confirm dialog re-appears after accepting, leaving user stuck. | **Medium** | `asset-roster-maintenance.ts:376-386` — `confirmDiscardUnsavedChanges()` calls `window.confirm()` but never sets `draftService.isDraftNavigating = true` before navigating. `DirtyFormGuard` (`dirty-form.guard.ts:17-27`) then fires a second confirm because `isDraftNavigating === false` and form is still dirty. Compare correct pattern in `form-select-navigate-footer.ts:27`. |
| AR-03 | 13.5 | **Maintenance-page Save/Cancel not in page header** — Header only has Back to Dashboard + Prev/Next. | **Low** | `asset-roster-edit-form.html:41` — Save/Cancel wrapped in `@if (isDirty())`. After `resetValueToInitialState()` calls `markAsPristine()` (line 495), `isDirty()` is false so buttons disappear. Intentional gating but confusing UX. |
| AR-04 | 15.1, 18.1, 22.1, 24.1 | **Section ordinal prefixes not visible in DOM** — Headings render without numeric ordinal "1", "2", "5". | **Low** | `form-section.html:10` — Template renders only `{{ title() }}`. The `ordinal` input is declared (`form-section.ts:27`) and callers pass it, but it is **never referenced in the template** — completely discarded. |
| AR-05 | 33.14-33.27 | **Many hardcoded English literals confirmed** — "Asset Photo", "of" counter, "Not set", "Unnamed", document descriptors, etc. | **Low** (pre-existing) | Multiple files — e.g. `asset-roster-edit-form.html:26` (`of`), `general-information-section.html:503` (`Asset Photo`), `asset-roster-list.html:163` (`Not set`), `asset-roster-document-dialog.ts:50-57` (descriptor options). None use `TranslatePipe`. |
| AR-06 | 11.1 | **Cannot create asset via UI — `p-datepicker` `acquiredDate` FormControl not updating** — Date text renders but FormControl value stays `null`, form stays `ng-invalid`. | **High** | `asset-roster-form-dialog.html:319` — `<p-datepicker formControlName="acquiredDate" [showIcon]="true">` is missing `appendTo="body"`. Inside a `p-dialog`, the dialog's modal mask intercepts the calendar click before the ControlValueAccessor's `onChange` fires. No fallback `(onChange)`/`(onSelect)` handler to manually `patchValue`. Compare working usages (e.g. `tasks/.../create-tasks-form-dialog.html:73-78`) which include `appendTo="body"`. |
| AR-07 | 18.6 | **Document upload causes template crash** — `Cannot read properties of null (reading 'name')` at `DocumentsSection_For_11_Template`. | **High** | `documents-section.html:33` — `{{ document.file.name }}` dereferences `file` without null guard. `AddDocumentForm` initializes `file` control with `[null!]` (`add-document-form.ts:19`). When `handleDocumentAdded` pushes an entry whose `file` is null, the template crashes in a render loop. |

---

## 2. Asset Commissioning

Source: `asset-roster/asset-commissioning/asset-commissioning-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AC-01 | 3.4, 10.2 | **No whitespace validation on Details/Reason fields** — Whitespace-only input accepted and submitted. | **Medium** | `create-commissioning-form.ts:20` and `update-decommissioning-form.ts:17` — both use `details: ['', [Validators.required]]`. `Validators.required` only rejects `null`/`undefined`/`''`; whitespace passes through. No trim validator exists in `base-app/form` (confirmed by search). |
| AC-02 | 16.6, 13.4 | **Decommissioned assets can be re-commissioned via the UI** — Commission button enabled on decommissioned assets. | **High** | `commissioning-lifecycle-section.html:7-9` — Condition is `@if (!assetCommissioning \|\| assetCommissioning.outcome === 'fail')`. It never checks `assetRoster()?.status !== 'decommissioned'`. When an asset is decommissioned, `assetCommission` becomes null (deactivated by backend), so `!assetCommissioning` is true → Commission button shows. |
| AC-03 | 2.3 | **Commission dialog subtitle typo "Peform" instead of "Perform"** | **Low** | `asset-commissioning-form-dialog.html:16` uses translation key `performInspectionFor`. The typo is in the **translation catalog value** on the backend (key `performInspectionFor`, scope `asset-roster`). The template itself is correct; the misspelled value "Peform inspection for:" lives in the backend translation database. |
| AC-04 | 14.4 | **Activity History entries have no expand/collapse** — Details always visible. | **Low** | `activity-history-section.html:22-136` — `@for` loop renders each card with all content (badge, dates, cost, details) unconditionally. No `expanded`/`collapsed` signal, no toggle handler, no `@if` guard around details. Component class has no expand-state signal. |
| AC-05 | 14.5/14.6 | **Labeling inconsistency — "Add Attachment" button vs "Add File" dialog header** | **Low** | Button: `activity-history-section.html:120` uses key `addAttachment` → "Add Attachment". Dialog header: `asset-roster-activity-history-add-file-dialog.ts:44-54` returns hardcoded English strings with "Add File" (not routed through `TranslatePipe`). Two different terms for the same action. |
| AC-06 | 15.1 | **Maintenance section visible on awaiting-commissioning assets** — Section visible with disabled buttons instead of hidden. | **Low** | `asset-roster-edit-form.html:118-123` — `<bifi-app-maintenance-service-section>` rendered unconditionally (no `@if` on status). Inside, controls are disabled via `canStartOrSkipPM()`/`canStartService()` returning false, but the section (headers, cards, disabled buttons) is never hidden. |
| AC-07 | 4.2, 11.3 | **Double toasts per action** — Domain toast + generic toast fire for same request. | **Low** | `notification.ts:57-63` — `NotificationInterceptor` auto-shows generic success toast for every POST/PUT. `commissioning-form-dialog.ts:82` and `decommissioning-form-dialog.ts:66` also manually call `toastManager.showSuccess(...)`. Two layers independently fire toasts for the same HTTP response. |

---

## 3. Asset Maintenances (Service + PM)

Source: `asset-roster/asset-maintenances/asset-maintenances-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AM-01 | 6.9, 11.9 | **CRITICAL — Finish Service/PM with empty Notes returns HTTP 400 "notes should not be empty"** — No client-side validation; no error feedback to user. | **Critical** | **Missing validation:** `update-maintenance-form.ts:18` — `notes: ['']` has no validators. Backend requires notes. **No error feedback:** `asset-finish-maintenance-form-dialog.ts:99-101` — `error` callback only resets `submitLoading`, shows no toast/error. |
| AM-02 | 10.3, 14.1 | **"Skip PM" button NOT shown when PM is in progress** — Only Finish PM appears. | **Medium** | `maintenance-service-section.html:125-151` — Skip PM button is inside `@if (!pmStarted())` block (line 125), only rendered when PM is **not** in progress. When `pmStarted()` is true, `@else` (line 143) renders only Finish PM. Skip PM should also be available during in-progress state. |
| AM-03 | 10.2 | **Maintenance page status alert shows "Active" instead of "In PM"** after initiating PM. | **Medium** | `status-banner-section.html:15-20` — `@else if (assetRoster()?.status === 'active' \|\| assetRoster()?.status === 'in-pm')` groups both statuses in one branch. Both display `assetActive` translation key → "Active". No separate branch for `'in-pm'` that would show an "In PM" label. |
| AM-04 | 6.3, 11.3 | **Double-colon typo "initiated on::"** in Finish Service/PM confirmation line. | **Low** | `asset-finish-maintenance-form-dialog.html:18` — `{{ 'initiatedOn' | translate: {} : 'asset-roster' }}:` has a literal `:` after `}}`. The `initiatedOn` translation value already ends with `:`, so the template adds a second `:` → "Initiated on::". |
| AM-05 | 1.3, 1.4 | **Initiate Service button HIDDEN (not disabled) on awaiting-commissioning and decommissioned assets** | **Low** | `maintenance-service-section.html:163-170` — Initiate Service wrapped in `@if (canStartService())` which **removes from DOM** when false. Should use `[disabled]="!canStartService()"` to keep visible but disabled. |
| AM-06 | 3.5, 10.4, 19.1, 19.3 | **Activity history does NOT show entries immediately after initiating service or PM** | **Low** | `api-request-manager.ts:200-204` — `httpResource` GET request does not set `cache: 'no-store'`. `FetchBackend` passes `req.cache` (undefined) to `fetch()`, so browser uses default cache mode and may return cached GET responses on `reload()`. The code does call `activityHistories.reload()` but the browser cache prevents fresh data. |
| AM-07 | 18.4 | **PM schedule fields remain locked after finishing PM** — "Cannot change" message persists. | **Low** | `maintenance-service-section.ts:47-53` — `isMaintenanceWindowsEditLocked` checks `assetRoster.maintenanceWindowIds?.length > 0` (whether windows were **ever assigned**). Once assigned, they persist even after PM finishes, so the condition stays `true` forever. Should check `this.pmStarted()` (currently active) instead. |
| AM-08 | 3.1 | **Double toast on service creation** — Extra generic toast alongside domain toast. | **Low** | `asset-maintenance-form-dialog.ts:80` — manual `toastManager.showSuccess('Service created successfully')` + `notification.ts:57-63` interceptor auto-toast. Same double-toast pattern as AC-07. Also affects `handleInitiatePM()` at `asset-roster-maintenance.ts:360`. |

---

## 4. Asset Types (Settings CRUD)

Source: `asset-roster/asset-types/asset-types-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| AT-01 | 4.4 | **Save button only appears when form is dirty** — Hidden until a field is modified. | **Medium** | `form-actions.html:14` — `@if (formChanged() && showSave())` conditionally renders the Save button. Consumer binds `[formChanged]="form.dirty"`. When form is pristine, Save is removed from DOM entirely (not just disabled). |
| AT-02 | 5.1 | **Description server-required but not client-validated** — HTTP 400 on empty description. | **Low** | `asset-type-form.ts:17` — `description: ['']` has no validators. Backend DTO (`asset-type.dto.ts:9-12`) requires it with `@IsNotEmpty()`. Frontend performs no validation. |
| AT-03 | 7.3 | **Orphaned references on asset type deletion** — Deleting referenced type leaves dangling refs. | **Medium** | `asset-types-list.ts:54-63` — direct `delete()` with no reference check. Backend `AssetTypeService` doesn't override `delete`, so `BaseService.delete` (`base-service.ts:261-285`) just soft-deletes (`active: false`). Assets referencing via `assetTypeIds` are left with orphaned refs. |
| AT-04 | 8.3 | **No unsaved changes prompt** — Navigating away silently discards changes. | **Low** | `asset-types.routes.ts:17-30` — `create` and `edit/:id` routes only declare `canActivate: [permissionGuard]`, missing `canDeactivate: [DirtyFormGuard]`. Compare `contacts/src/routes/contact-routes.ts:21,29` which includes it. |
| AT-05 | 4.6 | **Empty name accepted via whitespace** — Whitespace-only Name passes validation. | **Low** | `asset-type-form.ts:16` — `name: ['', [Validators.required]]`. `Validators.required` accepts whitespace-only strings. No trim validator exists in `base-app/form` (confirmed by search). |
| AT-06 | 10.3 | **Duplicate names silently allowed** — No uniqueness validation. | **Low** | `asset-type-form.ts:16` — no async uniqueness validator. Backend model (`asset-type.model.ts:8-11`) has no unique index on `name`. Duplicates accepted on both sides. |

---

## 5. Facilities (Settings CRUD — Facilities + Rooms)

Source: `asset-roster/facilities/facilities-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| FA-01 | 4.6 | **Whitespace-only facility name accepted** | **Medium** | `facility-form.ts:16` — `name: ['', [Validators.required]]`. Same as AT-05: no trim validator. |
| FA-02 | 6.7 | **No UI mechanism to clear selected contact** | **Low** | `facilities-form.html:42-47` — `<p-select>` for `contactId` is missing `[showClear]="true"`. PrimeNG only renders clear (×) button when `showClear` is explicitly enabled. |
| FA-03 | 7.3 | **Facility with rooms deleted without warning** — Rooms become orphaned. | **High** | `facilities-list.ts:54-63` — direct delete with only generic confirmation. Backend `FacilityService` overrides `create`/`update` to manage rooms but does **not** override `delete`. `BaseService.delete` soft-deletes only the facility. Rooms reference via `facilityId` (`room.model.ts:21-23`) → orphaned. |
| FA-04 | 15.2, 16.3, 16.4 | **Untranslated i18n key `confirmDialog.unsavedChanges`** in DirtyFormGuard dialog. | **Medium** | `dirty-form-confirmation-dialog.html:10` — uses key `confirmDialog.unsavedChanges` with scope `base-app/resource`. Translation catalog (`base-app-resource-translations.json`) only defines `confirmDialog.message`, `confirmDialog.header`, `.cancel`, `.confirm` — **no** `confirmDialog.unsavedChanges` entry exists. `TranslationService.translate()` returns raw key when not found. |
| FA-05 | 18.6 | **Duplicate facility names silently allowed** | **Medium** | `facility-form.ts:16` — `name: ['', [Validators.required]]` with no async uniqueness validator. No backend unique index. Same as AT-06. |
| FA-06 | 11.2, 11.5 | **Inconsistent field label "Location" vs validation "Address"** | **Low** | `rooms-form.html:50-61` — label uses translation key `location` → "Location", but the form control is `formControlName="address"`, the column header uses `title: 'address'` → "Address" (`room-columns.ts:17-22`), and the model field is `address`. Validation errors refer to "Address" while the visible label says "Location". |

---

## 6. Maintenance Windows (Settings CRUD)

Source: `asset-roster/maintenance-windows/maintenance-windows-results_20260721.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| MW-01 | 4.8 | **Whitespace-only name accepted** | **Medium** | `maintenance-window-form.ts:19` — `name: ['', [Validators.required]]`. Same as AT-05: no trim validator. |
| MW-02 | 10.4 | **Duplicate names silently allowed** | **Medium** | `maintenance-window-form.ts:19` — no async uniqueness validator, no backend unique index. Same as AT-06. |
| MW-03 | 8.3 | **No unsaved changes prompt** | **Medium** | `maintenance-windows.routes.ts:19-36` — `create` and `edit/:id` routes missing `canDeactivate: [DirtyFormGuard]`. Same as AT-04. |
| MW-04 | 4.5 | **Days Before/After default to 1, masking required validation** | **Low** | `maintenance-window-form.ts:20-21` — `daysBefore: [1, [Validators.required, Validators.min(1)]]` and `daysAfter: [1, ...]`. Initial value is `1` (valid) instead of `null`, so `Validators.required` never fails on a new form. Users see pre-filled values and can submit without entering them. |
| MW-05 | 4.2, 11.7 | **Inconsistent section heading casing** — "General information" vs "Window Information". | **Low** | Translation catalog values: `generalInformation` = "General information" (sentence case) vs `windowInformation` = "Window Information" (title case). Both in `asset-roster-translations.json`. Inconsistent capitalization in the translation values themselves. |
| MW-06 | 2.1, 11.6 | **Column header "Role Name" vs form field "Name"** | **Low** | `maintenance-window-columns.ts:4-10` — `title: 'roleName'` (copy-paste from roles module). Key `roleName` translates to "Role Name". Should be `title: 'name'` which translates to "Name". The form field (`maintenance-windows-form.html:31`) correctly uses key `name`. |
| MW-07 | 11.9 | **Hardcoded English recurrence labels with typo "Semi-anually"** | **Low** | `maintenance-windows-form.ts:63-70` — `recurrencyOptions` array uses hardcoded English string literals for `label` (not translation keys). Line 68: `'Semi-anually'` (missing "n", should be "Semi-annually"). Typo also propagates into `value: 'semi-anually'` — misspelled enum value persisted to database. |

---

## 7. Contacts

Source: `contacts/contacts_results_20260721.md` and `contacts/contacts_results_20260717.md`

| ID | Test | Description | Severity | Root Cause (file:line) |
|----|------|-------------|----------|------------------------|
| CO-01 | 3.2 | **Save button only appears when form is dirty** | **Medium** | `form-actions.html:14` — `@if (formChanged() && showSave())`. Consumer: `contacts-form.html:21` binds `[formChanged]="form.dirty"`. Same shared root cause as AT-01. |
| CO-02 | 6.2 | **Orphaned child contact on parent delete** — Child contacts retain stale parent ref. | **Medium** | `contacts-list.ts:55-64` — direct delete, no child check. Backend `ContactService` has no `delete()` override. `BaseService.delete` removes parent; children's `parentId` points to non-existent ObjectId. |
| CO-03 | — | **Missing i18n translation — `confirmDialog.unsavedChanges` shows raw key** | **Low** | `dirty-form-confirmation-dialog.html:10` — key `confirmDialog.unsavedChanges` with scope `base-app/resource`. Catalog only has `confirmDialog.message`/`.header`/`.cancel`/`.confirm` — no `.unsavedChanges` entry. Same as FA-04. |
| CO-04 | 3.4, 4.3 | **CR VAT Type required but not indicated** — API 400 on empty, no client validation. | **Low** | `contact-cr-plugin.ts:115` — `new FormControl('')` with no `Validators.required`. Label (`contact-cr-plugin.html:33`) has no required marker (`*`). Control is dynamically added by plugin, never receives required validator. |
| CO-05 | 3.4, 4.3 | **Contact method required but not indicated** — At least one method required by API. | **Low** | `contact-form.ts:50-81` — `phoneNumber: ['']`, `email: ['', [Validators.email]]`, `website: ['']`. None have `Validators.required`, no group-level validator enforcing "at least one." Backend has `AtLeastOneContactConstraint` (`contact.dto.ts:24-41,97`) but frontend has no equivalent. |
| CO-06 | 8–9 | **Export and Import not implemented** — No buttons or methods. | **Low** (planned) | `contacts-list.html:3-17` — only `goBack` and `addNew` buttons, no export/import. `crud-contacts.ts` — only sets `endpoint = 'contacts'`, no export/import methods. Backend `BaseRoutes` auto-registers `/export`/`/import` but frontend never calls them. |
| CO-07 | 10 | **No Active/Inactive toggle in UI** — `active` field exists but no UI control. | **Low** (planned) | `contact-form.ts:50-81` — `createForm()` has no `active` control. `contacts-form.html` and `contacts-list.html` — no active/inactive toggle. Interface (`contact.ts:24`) and backend model (`contact.model.ts:124-127`) have `active: boolean` but it's not exposed in the UI. |
| CO-08 | 5.9 | **No UI mechanism to clear parent company** — p-select lacks clear button. | **Medium** | `contacts-form.html:115-124` — `<p-select formControlName="parentId">` missing `[showClear]="true"`. Same as FA-02. Additionally, `contacts-form.ts:173` does `if (!rawValue.parentId) delete rawValue.parentId;` but the user can never produce an empty `parentId` to trigger that path. |
| CO-09 | 3.9 | **Duplicate emails silently allowed** | **Low** | `contact-form.ts:55` — `email: ['', [Validators.email]]` has only format validation, no async uniqueness validator. Backend model (`contact.model.ts:25-29`) has `// unique: true,` **commented out**. Neither layer enforces uniqueness. |
| CO-10 | 5.9 | **parentId cannot be removed via PUT** — Empty string fails `@IsMongoId()`. | **Medium** | `contact.dto.ts:93-95` — `@IsMongoId()` rejects empty string `""`. `@IsOptional()` only skips for `null`/`undefined`, not `""`. Compounded by `contacts-form.ts:173` — `if (!rawValue.parentId) delete rawValue.parentId;` deletes the key from the payload entirely, so backend never receives instruction to null it out → existing `parentId` preserved. |

---

## Recurring Patterns (Cross-Module)

Several issues appear across multiple modules and indicate shared root causes in `@avalantec/base-app`:

### Pattern A — Whitespace-only required fields accepted
- **Affected:** AC-01, AT-05, FA-01, MW-01
- **Root cause:** No shared whitespace/trim validator exists anywhere in `base-app/form` (confirmed by exhaustive search — only match is `dirty-utils.ts:99` `.trim()` inside a label formatter, not a validator). `Validators.required` only rejects `null`/`undefined`/`''`; whitespace passes through.
- **Shared fix location:** `projects/base-app/form/` — add a `nonWhitespaceRequired` validator and use it on all `name`/`details`/`reason` fields.

### Pattern B — Duplicate names silently allowed
- **Affected:** AT-06, FA-05, MW-02, CO-09 (emails)
- **Root cause:** No client-side async uniqueness validator on any `name`/`email` field. No backend unique index (CO-09: `unique: true` is commented out in the model).
- **Shared fix location:** Backend models need unique indexes + `409 Conflict` responses. Frontend form services need async validators calling a uniqueness-check endpoint.

### Pattern C — Save button hidden until form is dirty
- **Affected:** AT-01, CO-01 (and asset-roster create dialog)
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
- **Affected:** AT-04, MW-03
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
| AT-02 | `asset-type-form.ts` | 17 | `description: ['']` — no validators. Backend `asset-type.dto.ts:9-12` requires `@IsNotEmpty()`. |
| AT-03 | `asset-types-list.ts` / `base-service.ts` | 54-63 / 261-285 | Direct delete, no reference check. Backend `BaseService.delete` soft-deletes only. Assets reference via `assetTypeIds`. |
| AT-04 | `asset-types.routes.ts` | 17-30 | Missing `canDeactivate: [DirtyFormGuard]` on `create`/`edit/:id` routes. |
| AT-05 | `asset-type-form.ts` | 16 | `name: ['', [Validators.required]]` — no trim validator. See S-07. |
| AT-06 | `asset-type-form.ts` | 16 | No async uniqueness validator. No backend unique index on `name`. |

#### Facilities (FA-01 to FA-06)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| FA-01 | `facility-form.ts` | 16 | `name: ['', [Validators.required]]` — no trim validator. See S-07. |
| FA-02 | `facilities-form.html` | 42-47 | `<p-select>` missing `[showClear]="true"`. |
| FA-03 | `facilities-list.ts` / `facility-service.ts` | 54-63 / — | Direct delete. Backend `FacilityService` overrides `create`/`update` but not `delete`. Rooms orphaned via `facilityId`. |
| FA-04 | `dirty-form-confirmation-dialog.html` | 10 | See S-05. Key `confirmDialog.unsavedChanges` missing from `base-app-resource-translations.json`. |
| FA-05 | `facility-form.ts` | 16 | No async uniqueness validator, no backend unique index. Same as AT-06. |
| FA-06 | `rooms-form.html` / `room-columns.ts` | 50-61 / 17-22 | Label uses key `location` → "Location". Column uses `title: 'address'` → "Address". Form control is `formControlName="address"`. Model field is `address`. |

#### Maintenance Windows (MW-01 to MW-07)

| ID | File | Line(s) | Code / Detail |
|----|------|---------|---------------|
| MW-01 | `maintenance-window-form.ts` | 19 | `name: ['', [Validators.required]]` — no trim validator. See S-07. |
| MW-02 | `maintenance-window-form.ts` | 19 | No async uniqueness validator, no backend unique index. Same as AT-06. |
| MW-03 | `maintenance-windows.routes.ts` | 19-36 | Missing `canDeactivate: [DirtyFormGuard]`. Same as AT-04. |
| MW-04 | `maintenance-window-form.ts` | 20-21 | `daysBefore: [1, ...]` and `daysAfter: [1, ...]` — default to `1` instead of `null`, masking required validation. |
| MW-05 | Translation catalog (`asset-roster-translations.json`) | — | `generalInformation` = "General information" (sentence case) vs `windowInformation` = "Window Information" (title case). |
| MW-06 | `maintenance-window-columns.ts` | 4-10 | `title: 'roleName'` — copy-paste from roles module. Should be `title: 'name'`. Key `roleName` → "Role Name". |
| MW-07 | `maintenance-windows-form.ts` | 63-70 | Hardcoded English `recurrencyOptions` array. Line 68: `'Semi-anually'` (typo, should be "Semi-annually"). Typo also in `value: 'semi-anually'` — persisted to DB. |

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
| **Critical** | 1 | AM-01 |
| **High** | 5 | AR-01, AR-06, AR-07, AC-02, FA-03 |
| **Medium** | 11 | AM-02, AM-03, AT-03, FA-04, FA-05, MW-02, MW-03, CO-02, CO-08, CO-10, CO-03 |
| **Low** | 26 | AR-03, AR-05, AC-03, AC-04, AC-05, AC-06, AC-07, AM-04, AM-05, AM-06, AM-07, AM-08, AT-02, AT-04, AT-06, FA-02, FA-06, MW-04, MW-05, MW-06, MW-07, CO-04, CO-05, CO-06, CO-07, CO-09 |
| **Active total** | 43 | (8 resolved, see Resolved Bugs section. FA-04 and CO-03 pending backend translation catalog deployment.) |
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
| AR-02 | Asset Roster | Dirty form guard re-fires `window.confirm` after accepting | 2026-07-22 | Set `draftService.isDraftNavigating = true` before `router.navigate()` in `handleBackToDashboard()`, `handleNavigatePrevAsset()`, and `handleNavigateNextAsset()`. File: `asset-roster-maintenance.ts:367,229,236` |
| AR-04 | Asset Roster | Section ordinal prefixes not visible in DOM | 2026-07-22 | Added `@if (ordinal()) { ... } {{ ordinal() }}.` to `form-section.html:10` template. The `ordinal` input was declared but never rendered. File: `form-section.html:12` |
| | | | | |
| | | **Note on FA-04 / CO-03:** The `confirmDialog.unsavedChanges` translation key was added to the local `base-app-resource-translations.json` catalog file, but translations are served from the backend API at runtime (`GET /api/translations/scope`). The raw key is still displayed because the backend catalog has not been updated. These fixes require backend deployment to take effect. | | |
| AC-01 | Asset Commissioning | No whitespace validation on Details/Reason fields | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `create-commissioning-form.ts:20` and `update-decommissioning-form.ts:17`. Also created shared validator in `base-app/form`. File: `non-whitespace.validator.ts` |
| AT-01 | Asset Types | Save button only appears when form is dirty | 2026-07-22 | Changed `@if (formChanged() && showSave())` to `@if (showSave())` with `[disabled]="!formChanged() \|\| isSubmitting() \|\| formDisabled()"`. File: `form-actions.html:14-26` |
| AT-05 | Asset Types | Empty name accepted via whitespace | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `asset-type-form.ts:16`. File: `non-whitespace.validator.ts` |
| FA-01 | Facilities | Whitespace-only facility name accepted | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `facility-form.ts:16`. File: `non-whitespace.validator.ts` |
| MW-01 | Maintenance Windows | Whitespace-only name accepted | 2026-07-22 | Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` on `maintenance-window-form.ts:19`. File: `non-whitespace.validator.ts` |
| CO-01 | Contacts | Save button only appears when form is dirty | 2026-07-22 | Same fix as AT-01 — shared `form-actions.html` change. |
