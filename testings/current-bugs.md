# Current Bugs — Aggregated from All Test Runs

> **Source:** Compiled from all test result files under `testings/` (asset-roster suite + contacts).
> **Last updated:** 2026-07-21
> **Testing method:** Automated UI tests via Playwright MCP against `http://localhost:4200` (logged in as `opencode@test.com`).
>
> Bugs are grouped by module. Cross-cutting patterns (e.g. "whitespace-only names accepted") are summarized at the bottom under "Recurring Patterns". Severity labels follow this scheme:
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

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| AR-01 | 5.6, 3.2 | **Grid view card template throws `TypeError: Cannot read properties of undefined (reading 'address')`** — Switching to Grid triggers 18 console errors of the form `ERROR TypeError: Cannot read properties of undefined (reading 'address') at AssetRosterList_Conditional_27_For_2_p_card_0_ng_template_2_Template`. Cards render partially (photo/type/model/serial/location) but the footer block (which should display "next PM Overdue" + `maintenanceDate` per test 5.6) is silently broken because the template dereferences an undefined `location.address` (or similar) without null checking. | **High** |
| AR-02 | 28.10, 28.11 | **Dirty form guard re-fires `window.confirm` after accepting** — After clicking `Back to Dashboard` while the notes textarea was dirty, the browser confirm dialog "You have unsaved changes on this asset. Leaving will discard them. Continue?" appeared and re-appeared immediately after accepting, leaving the user stuck on the maintenance page. Only an in-URL navigation (`/asset-roster/equipment/list`) succeeded. Suggests the dirty state re-triggers the guard because the field remains dirty (the discard-on-accept is not wired through to mark the form pristine / actually route). | **Medium** |
| AR-03 | 13.5 | **Maintenance-page Save/Cancel not in page header** — The spec expects Save/Cancel buttons to "only appear when dirty" in the top bar. On the maintenance page the header only contains `Back to Dashboard` + Prev/Next chevrons — no Save/Cancel affordance. Each sub-section (Documents, Notes, etc.) has its own actions instead. May or may not match the intended UX. | **Low** |
| AR-04 | 15.1, 18.1, 22.1, 24.1 | **Section ordinal prefixes not visible in DOM** — Tests expected numeric ordinal prefixes attached to section banners (`General information`, `Documents`, `Activity History`, `Equipment Notes`). The headings render only their textual label without a visible ordinal "1", "2", "5". Possibly the ordinals are stripped via CSS counter or not piped into the heading at all. | **Low** |
| AR-05 | 33.14-33.27 | **Many hardcoded English literals confirmed** — Confirmed hardcoded English strings across the module: "1 of 18" (`of`), "Asset Photo", "Equipment Notes", "Logged By:", "Performed:", "Details", "Click \"Add Document\" to upload.", "Scroll down to load more", "No attachment available.", "Add New Document", "Total maintenance spend", etc. Pre-existing i18n violations, not newly introduced. | **Low** (pre-existing) |
| AR-06 | 11.1 | **Cannot create asset via UI — `p-datepicker` `acquiredDate` FormControl not updating** — The `CreateAssetRosterForm` has `acquiredDate: [null!, [Validators.required]]`. The `p-datepicker` renders the selected date text in the visible input (e.g. `"07/15/2026"`) but the underlying Angular `FormControl` value remains `null`, keeping the form `ng-invalid`. The `FormActionsHandler` directive correctly detects the invalid state and blocks submission (showing the "Save" button but preventing the POST). Clicking calendar gridcells (via Playwright) sets the visible text but does NOT trigger the `FormControl.valueChanges` emitter or `requestUpdate()` that would propagate the value. See `/projects/asset-roster/src/lib/modules/asset-roster/services/create-asset-roster-form.ts:131`. | **High** |
| AR-07 | 18.6 | **Document upload causes template crash** — Open "Add New Document" dialog, select descriptor "Technical Manual", choose a file, click Save. Console floods with: `ERROR TypeError: Cannot read properties of null (reading 'name') at DocumentsSection_For_11_Template`. The `DocumentsSection` template dereferences a null object (likely the uploaded document record) without null checking. This occurs repeatedly in a render loop. | **High** |

---

## 2. Asset Commissioning

Source: `asset-roster/asset-commissioning/asset-commissioning-results_20260721.md`

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| AC-01 | 3.4, 10.2 | **No whitespace validation on Details/Reason fields** — The required "Details" (commission) and "Reason for Decommissioning" fields accept whitespace-only input. The form submits successfully (POST/PUT 200) and creates records with an empty reason. The validator only checks `required`, not trimmed content. | **Medium** |
| AC-02 | 16.6, 13.4 | **Decommissioned assets can be re-commissioned via the UI** — On a decommissioned asset, the "Commissioning & Lifecycle" section shows an ENABLED "Commission" button that opens the full Commission dialog, allowing a decommissioned asset to be commissioned again. The button should be hidden or disabled for `decommissioned` status. | **High** |
| AC-03 | 2.3 | **Commission dialog subtitle typo** — Shows "Peform inspection for:" instead of "Perform inspection for:" (missing "r"). | **Low** |
| AC-04 | 14.4 | **Activity History entries have no expand/collapse** — Details (Logged By, Performed date, Details text) are always visible. Clicking the entry does not toggle expand/collapse. | **Low** |
| AC-05 | 14.5/14.6 | **Labeling inconsistency** — Activity History action button says "Add Attachment" but the dialog header says "Add File to commissioning from asset: null". Inconsistent terminology. | **Low** |
| AC-06 | 15.1 | **Maintenance section visible (not hidden) on awaiting-commissioning assets** — Section is visible with PM buttons disabled and message "This asset is awaiting commissioning. PM schedule cannot be determined yet." | **Low** |
| AC-07 | 4.2, 11.3 | **Double toasts per action** — Each commission/decommission fires two toasts (a domain message like "commissioning created successfully" plus a generic "The element was created/updated successfully!"). Minor UX noise. | **Low** |

---

## 3. Asset Maintenances (Service + PM)

Source: `asset-roster/asset-maintenances/asset-maintenances-results_20260721.md`

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| AM-01 | 6.9, 11.9 | **CRITICAL — Finish Service/PM with empty Notes returns HTTP 400 "notes should not be empty"** — The frontend has NO client-side validation for Notes (no required marker, no error message). The dialog stays open silently with no feedback to the user when the server rejects the submission. | **Critical** |
| AM-02 | 10.3, 14.1 | **MODERATE — "Skip PM" button is NOT shown when PM is in progress** — Only "Finish PM" appears. The spec expects both "Finish PM" and "Skip PM" to be available during in-progress PM. Skip PM is only available when PM is NOT in progress but a maintenance window is due. | **Medium** |
| AM-03 | 10.2 | **MODERATE — Maintenance page status alert shows "Active" instead of "In PM" after initiating PM** — The asset roster list correctly shows "In PM", but the alert banner on the maintenance detail page does not update. | **Medium** |
| AM-04 | 6.3, 11.3 | **MINOR — Double-colon typo in Finish Service/PM confirmation line** — Shows "initiated on:: Jul 21, 2026" (should be "on:" not "on::"). | **Low** |
| AM-05 | 1.3, 1.4 | **MINOR — Initiate Service button is HIDDEN entirely (not just disabled) on awaiting-commissioning and decommissioned assets** — The spec expects "disabled with message". PM buttons are correctly disabled with messages. | **Low** |
| AM-06 | 3.5, 10.4, 19.1, 19.3 | **MINOR — Activity history does NOT show entries immediately after initiating a service or PM** — Entries only appear in history after the maintenance is finished/skipped. | **Low** |
| AM-07 | 18.4 | **MINOR — PM schedule fields remain locked after finishing PM** — Message "Cannot change: PM has been logged for this schedule" persists even after the PM is completed. Fields cannot be edited to change the schedule. | **Low** |
| AM-08 | 3.1 | **MINOR — Double toast on service creation** — Extra generic toast "The element was created successfully!" appears alongside "Service created successfully". | **Low** |

---

## 4. Asset Types (Settings CRUD)

Source: `asset-roster/asset-types/asset-types-results_20260721.md`

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| AT-01 | 4.4 | **Save button only appears when form is dirty** — On both Create and Edit forms, the Save button is hidden until at least one field is modified. Users may not realize they need to type something before the Save button appears. Same pattern as contacts B-01. | **Medium** |
| AT-02 | 5.1 | **Description server-required but not client-validated** — The Description field is required by the API (HTTP 400 on empty), but the form does not mark it as required or show client-side validation. Error only surfaces from API response as toast/400. | **Low** |
| AT-03 | 7.3 | **Orphaned references on asset type deletion** — Deleting an asset type that may be referenced by Asset Roster records succeeds without warning, potentially leaving dangling references. | **Medium** |
| AT-04 | 8.3 | **No unsaved changes prompt** — Navigating back from a dirty form (create or edit) silently discards changes without confirmation. No `confirmDialog.unsavedChanges` prompt. | **Low** |
| AT-05 | 4.6 | **Empty name accepted via whitespace** — Whitespace-only Name passes client-side validation and is accepted by the server (trimmed to empty). Records can be created with empty/null name. | **Low** |
| AT-06 | 10.3 | **Duplicate names silently allowed** — Creating an asset type with a name already used by another record succeeds without any validation error or warning. No unique constraint on name. | **Low** |

---

## 5. Facilities (Settings CRUD — Facilities + Rooms)

Source: `asset-roster/facilities/facilities-results_20260721.md`

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| FA-01 | 4.6 | **Whitespace-only facility name accepted** — Filling the Name field with whitespace passes client-side validation; the server creates a facility with an empty/whitespace name. Record appears in the list with no visible name. | **Medium** |
| FA-02 | 6.7 | **No UI mechanism to clear selected contact** — The Responsible Contact p-select dropdown has no `showClear` icon and no "None" / empty option. Once a contact is selected, there is no UI-only way to clear it. | **Low** |
| FA-03 | 7.3 | **Facility with rooms deleted without warning** — Deleting "pedro" (which had 1 room "Room") succeeded without any warning about related rooms. The room becomes orphaned — still appears in the rooms list with a stale facility reference. | **High** |
| FA-04 | 15.2, 16.3, 16.4 | **Untranslated i18n key in DirtyFormGuard dialog** — The unsaved changes confirmation dialog shows the raw translation key `confirmDialog.unsavedChanges` instead of a proper message. Buttons "Discard" and "Cancel" work correctly. | **Medium** |
| FA-05 | 18.6 | **Duplicate facility names silently allowed** — Creating a facility with a name already used by another record succeeds without any validation error or warning. No unique constraint on facility name. | **Medium** |
| FA-06 | 11.2, 11.5 | **Inconsistent field label vs validation message** — The Room form field label says "Location" but validation error messages refer to "Address". Inconsistent naming may confuse users. | **Low** |

---

## 6. Maintenance Windows (Settings CRUD)

Source: `asset-roster/maintenance-windows/maintenance-windows-results_20260721.md`

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| MW-01 | 4.8 | **Whitespace-only name accepted** — Filling Name with whitespace passes client-side validation; server creates record with empty/whitespace name. Record appears in list with no visible name. | **Medium** |
| MW-02 | 10.4 | **Duplicate names silently allowed** — Creating a maintenance window with a name already used by another record ("Daily") succeeds without any validation error or warning. No unique constraint on name. | **Medium** |
| MW-03 | 8.3 | **No unsaved changes prompt** — Navigating back from a dirty create form silently discards changes without confirmation. No `confirmDialog.unsavedChanges` prompt. | **Medium** |
| MW-04 | 4.5 | **Days Before/After default to 1, masking required validation** — Both number fields default to `1` (valid value), so submitting an empty form only shows Name as required. Users may not realize these fields are required since they're pre-filled. | **Low** |
| MW-05 | 4.2, 11.7 | **Inconsistent section heading casing** — "General information" (lowercase 'i') vs "Window Information" (uppercase 'I') in translation values for the two form sections. | **Low** |
| MW-06 | 2.1, 11.6 | **Column header "Role Name" vs form field "Name"** — The list column uses `roleName` key (renders "Role Name") while the form field uses `name` key (renders "Name"). Both refer to the same concept, causing user confusion. | **Low** |
| MW-07 | 11.9 | **Hardcoded English recurrence labels with typo** — Recurrence dropdown options are hardcoded strings (not translated via i18n). One option has a typo: "Semi-anually" should be "Semi-annually". Options do not switch with language. | **Low** |

---

## 7. Contacts

Source: `contacts/contacts_results_20260721.md` and `contacts/contacts_results_20260717.md`

| ID | Test | Description | Severity |
|----|------|-------------|----------|
| CO-01 | 3.2 | **Save button only appears when form is dirty** — On the Create form, the Save button is hidden until at least one field is modified. Users may not realize they need to type something before the Save button appears. Confusing UX for new users. | **Medium** |
| CO-02 | 6.2 | **Orphaned child contact on parent delete** — Deleting a Company contact that has child contacts succeeds without warning, leaving child contacts with a stale/orphaned parent reference. The child's display name still shows the deleted company name. | **Medium** |
| CO-03 | — | **Missing i18n translation** — The unsaved changes confirmation dialog displays the raw translation key `confirmDialog.unsavedChanges` instead of the translated message. | **Low** |
| CO-04 | 3.4, 4.3 | **CR VAT Type required but not indicated** — The CR VAT Type field is required by the API for both Individual and Company contacts, but the form does not mark it as required or show client-side validation. Error only appears as API 400. | **Low** |
| CO-05 | 3.4, 4.3 | **Contact method required but not indicated** — At least one contact method (phone, email, or website for companies) is required by the API, but the form does not indicate this. Error only surfaces from API response. | **Low** |
| CO-06 | 8–9 | **Export and Import not implemented** — No backend endpoint or frontend UI button for CSV export/import of contacts exists. | **Low** (planned feature) |
| CO-07 | 10 | **No Active/Inactive toggle in UI** — No UI control for toggling contact active/inactive status, though the API filters by `active:true` by default. | **Low** (planned feature) |
| CO-08 | 5.9 | **No UI mechanism to clear parent company** — The Parent Contact p-select dropdown lacks `showClear` property, has no empty/null option, and keyboard shortcuts don't clear the selection. Users cannot remove a parent company once set via the UI. Confirms the known API bug where `parentId` cannot be unset. | **Medium** |
| CO-09 | 3.9 | **Duplicate emails silently allowed** — Creating a contact with an email already used by another contact succeeds without any validation error or warning. This may lead to data confusion if emails are expected to be unique identifiers. | **Low** |
| CO-10 | 5.9 | **parentId cannot be removed via PUT** (from 2026-07-17 run) — Empty string `""` fails `@IsMongoId()` validation (HTTP 400). Omitting parentId from the PUT body preserves the existing value. No way to unset parentId via the API. | **Medium** |

---

## Recurring Patterns (Cross-Module)

Several issues appear across multiple modules and likely indicate shared root causes that should be addressed in `@avalantec/base-app`:

### Pattern A — Whitespace-only required fields accepted
- Affected: AC-01, AT-05, FA-01, MW-01 (and likely any module using `Validators.required` without a trim-based validator)
- Root cause: `Validators.required` only rejects `null`/`undefined`/`''`; whitespace passes through. The backend trims to empty, producing records with no visible name.
- Suggested fix: Add a shared `Validators.required` wrapper (e.g. `nonWhitespaceRequired`) in `@avalantec/base-app/form` that trims before checking, and use it on all `name` / `details` / `reason` fields.

### Pattern B — Duplicate names silently allowed
- Affected: AT-06, FA-05, MW-02, CO-09 (emails)
- Root cause: No client-side or server-side unique constraint on the `name` field (or `email` for contacts).
- Suggested fix: Either add a backend unique index + `409 Conflict` response, or add an async validator that calls a "check uniqueness" endpoint before submit.

### Pattern C — Save button hidden until form is dirty
- Affected: AT-01, CO-01 (and asset-roster create dialog exhibits the same pattern)
- Root cause: `<bifi-app-form-actions>` only renders the Save button when `[formChanged]="form.dirty"` is true. This is intentional UX but documented as confusing in multiple test runs.
- Suggested fix: Either keep the button always visible but disabled until dirty, or add helper text "Make a change to enable Save".

### Pattern D — Orphaned references on parent deletion
- Affected: AT-03, FA-03, CO-02, CO-10
- Root cause: Delete endpoints remove the parent record without checking for or cascading child references.
- Suggested fix: Backend `BaseRoutes.delete` should check for inbound references and either (a) reject with `409 Conflict` listing the dependents, or (b) prompt the user with a warning dialog listing the affected child records before proceeding.

### Pattern E — Untranslated `confirmDialog.unsavedChanges` key
- Affected: FA-04, CO-03 (and likely any module using `DirtyFormGuard`)
- Root cause: The translation key `confirmDialog.unsavedChanges` is missing from the relevant scope's translation JSON (likely `core` or `base-app/form`).
- Suggested fix: Add the en/es pair for `confirmDialog.unsavedChanges` to the appropriate catalog JSON file (probably `base-app-form-translations.json`).

### Pattern F — No unsaved changes prompt on plain forms (non-DirtyFormGuard routes)
- Affected: AT-04, MW-03
- Root cause: Forms without `DirtyFormGuard` on their route silently discard changes when navigating away. The `DirtyFormGuard` is opt-in per route.
- Suggested fix: Either make `DirtyFormGuard` the default on all create/edit routes, or wire the `bifiAppFormActionsHandler` to emit a `beforeunload`-style confirmation.

### Pattern G — Double toasts on create/update
- Affected: AC-07, AM-08 (and observed on asset-roster PUT saves)
- Root cause: Both the domain service AND a generic `NotificationInterceptor` in `@avalantec/base-app/resource` fire a toast on successful POST/PUT.
- Suggested fix: Either suppress the generic interceptor toast when the domain service already shows one, or remove the duplicate domain-level toast. Document which layer owns user-facing success messages.

---

## Summary by Severity

| Severity | Count | IDs |
|----------|-------|-----|
| **Critical** | 1 | AM-01 |
| **High** | 5 | AR-01, AR-06, AR-07, AC-02, FA-03 |
| **Medium** | 16 | AR-02, AC-01, AM-02, AM-03, AT-01, AT-03, FA-01, FA-04, FA-05, MW-01, MW-02, MW-03, CO-01, CO-02, CO-08, CO-10 |
| **Low** | 29 | AR-03, AR-04, AR-05, AC-03, AC-04, AC-05, AC-06, AC-07, AM-04, AM-05, AM-06, AM-07, AM-08, AT-02, AT-04, AT-05, AT-06, FA-02, FA-06, MW-04, MW-05, MW-06, MW-07, CO-03, CO-04, CO-05, CO-06, CO-07, CO-09 |
| **Total** | 51 | |

> Each bug ID is counted exactly once. The **Recurring Patterns** section below cross-references bugs that share a root cause — those references do not add to the total.

---

## How to Update This File

When a new test run finds bugs:
1. Add the new bug to the appropriate module section above with a unique `<MODULE>-NN` ID (e.g. `AR-08` for the next asset-roster bug).
2. If the bug matches one of the **Recurring Patterns**, add a note in that pattern's "Affected" list.
3. Update the **Summary by Severity** table.
4. Update the **Last updated** date at the top.

When a bug is fixed:
1. Do **not** delete the row — move it to a new "## Resolved Bugs" section at the bottom with the resolution date and PR/commit reference. This preserves the audit trail of what was tested and found.
2. Update the **Summary by Severity** table.
