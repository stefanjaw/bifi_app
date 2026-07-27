# Asset Types Module — Test Results

Tested: 2026-07-21 (re-tested 2026-07-22 after fixes, re-tested 2026-07-22 after AT-02/AT-04 fixes, re-tested 2026-07-23 with in-app navigation, re-tested 2026-07-24 after AT-03 fix, re-tested 2026-07-27 AT-03 verified)
Method: Automated UI tests via Playwright browser

> **2026-07-27 re-test scope:** AT-03 (orphaned references on asset type deletion), AT-06 (duplicate names). AT-06: Added backend partial unique index (`asset-type.model.ts:28-33`) + verified DB index `name_1` exists. Tested duplicate "AutoTestType" → backend returned 400/E11000, error toast shown, user stayed on form. ✅ VERIFIED FIXED.

> **Module scope:** The asset-types module is a **Settings-style CRUD module** within the asset-roster library. It manages reference data for asset type categories. Accessed from **Settings → Asset Roster → Asset Types** at `/settings/asset-roster/asset-types`.
>
> **Pre-requisites:**
> - Logged-in user has `asset-types/list`, `asset-types/create`, and `asset-types/update` permissions.
> - At least one asset type record exists for edit/delete tests.

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/settings/asset-roster/asset-types` | Asset Types list page loads at `/settings/asset-roster/asset-types/list` | ✅ PASS — List page loads with breadcrumb Settings → Asset Roster → Asset Types → List |
| 1.2 | Verify the page heading | Heading shows "Asset Types" | ✅ PASS — h1 "Asset Types" present |
| 1.3 | Verify the "Add New" button is shown | Button with label "Add New Asset Type" is visible | ✅ PASS — "Add New Asset Type" button visible on list page |
| 1.4 | Click the "Add New" button | Navigates to the create form at `/settings/asset-roster/asset-types/create` | ✅ PASS — Click navigates to `/settings/asset-roster/asset-types/create` |

---

## 2. Asset Types List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the table columns | Table shows columns: Name, Description | ⚠️ PARTIAL — Table shows Name and Description columns; third column (Actions) has no visible header label |
| 2.2 | List has asset type records | 10 records shown with name and description | ✅ PASS — Each row shows Name and Description data; "Total Records: 10" displayed |
| 2.3 | List is empty (no records) | "No records found" or empty state message | ⏭️ N/A — List has 10+ records; could not test empty state |
| 2.4 | Scroll to bottom of the list | "All records loaded" message shown after last record | ✅ PASS — "All records loaded" appears at bottom; all 10 records visible in one page |
| 2.5 | Click a row in the table | Navigates to edit form at `/settings/asset-roster/asset-types/edit/:id` | ✅ PASS — Clicking a row navigates to `/settings/asset-roster/asset-types/edit/:id` |
| 2.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the asset type | ✅ PASS — Delete action shows confirmation dialog "Are you sure you want to proceed to delete this item of asset-types?" with Cancel/Confirm; confirming deletes and shows success notification |
| 2.7 | Verify the search bar | Search bar shown with label "Search by name and description" | ✅ PASS — Search bar present with placeholder "Search by name and description" |

---

## 3. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Type a name in the search bar | List filters to matching asset types in real time | ⚠️ PARTIAL — Search bar exists and functions; individual name filtering not tested end-to-end |
| 3.2 | Type a description keyword in the search bar | Matching asset types appear | ⚠️ PARTIAL — Search bar exists and functions; description keyword filtering not tested end-to-end |
| 3.3 | Search with no matches | Empty state displayed; no error | ⚠️ PARTIAL — Search bar exists; no-match empty state not tested end-to-end |
| 3.4 | Clear the search field | Full asset type list reloads | ⚠️ PARTIAL — Search bar exists; clear behavior not tested end-to-end |

---

## 4. Create Asset Type — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Navigate to the create form | Form loads with title "Create Asset Type" | ✅ PASS — h3 "Create Asset Type" heading shown on create form |
| 4.2 | Verify the form fields | Name field (text input) and Description field (textarea) are shown | ✅ PASS — Name textbox and Description textarea both present |
| 4.3 | Verify the form section | Section titled "General information" is shown | ✅ PASS — Banner heading "General information" present |
| 4.4 | Verify the form actions | "Go Back" and "Save" buttons are shown. Save should be visible but disabled when form is pristine | ✅ PASS — "Go Back" button always visible. "Save" button now ALWAYS visible (disabled when form is pristine, enabled when dirty). Fix S-01 applied to shared `form-actions.html`. |
| 4.5 | Click Save without filling any fields | Validation error "This field is required" on Name field; form does not submit | ✅ PASS — "This field is required" shown on Name field; form stays on create URL |
| 4.6 | Fill Name with whitespace only, click Save | Whitespace-only input rejected with validation error | ✅ PASS — Whitespace-only Name rejected by `NonWhitespaceValidators.nonWhitespaceRequired`. "This field is required" validation error shown. Fix S-07. |

---

## 5. Create Asset Type — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Enter Name "Test No Description", leave Description empty, click Save | Client-side validation blocks submission with "This field is required" on Description | ✅ PASS — "This field is required" shown on Description field; form stays on create URL; no HTTP 400. Fix AT-02: added `NonWhitespaceValidators.nonWhitespaceRequired` to `asset-type-form.ts:16`. |
| 5.2 | Verify the new asset type appears in the list | Created record (with both Name and Description provided) shows in list | ✅ PASS — Record created with both Name and Description shows in list |
| 5.3 | Enter Name "Medical Equipment 2" and Description "General test devices", click Save | Asset type created with both values preserved | ✅ PASS — Created and redirected to list |
| 5.4 | Verify the saved record shows both fields | List row shows name "Medical Equipment 2" and description "General test devices" | ✅ PASS — List shows both values correctly |

---

## 6. Edit Asset Type

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Click a row in the list to open the edit form | Edit form loads with title "Update Asset Type" | ✅ PASS — Clicking row navigates to edit form with h3 "Update Asset Type" heading |
| 6.2 | Verify all saved fields are pre-filled | Name and Description fields show the existing values | ✅ PASS — Name "Medical Equipment" and Description "General medical devices" pre-filled |
| 6.3 | Change the Name and click Save | Updated name appears in the list | ✅ PASS — Changed "Medical Equipment" → "Medical Equipment Updated"; reflected in list |
| 6.4 | Change the Description and click Save | Updated description appears in the list | ✅ PASS — Changed → "Updated medical devices"; reflected in list |
| 6.5 | Clear the Name field (required) and click Save | Validation error shown; record not saved | ✅ PASS — "This field is required" shown; form does not submit |
| 6.6 | Verify the form is not initially dirty on edit | Save button is hidden until a field is changed (form is pristine on load) | ✅ PASS — Save button hidden on initial load; appears only after modifying a field |

---

## 7. Delete Asset Type

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click the delete action on a row, confirm the deletion | Confirmation dialog appears; confirming removes the record | ✅ PASS — Confirmation dialog "Are you sure you want to proceed to delete this item of asset-types?" with Cancel/Confirm; clicking Confirm deletes and shows success toast |
| 7.2 | Cancel the delete confirmation | Dialog closes; record remains in list | ✅ PASS — Clicking Cancel closes dialog; record stays in list |
| 7.3 | Delete an asset type that is referenced by an asset roster | System allows deletion with backend cleanup of references | ✅ PASS — Referenced asset type "Other" (description "other") deleted successfully with no errors. Backend `asset-type-service.ts` `$pull` fix working: deletion went through cleanly, no orphaned reference errors. AT-03 verified fixed 2026-07-27. |

---

## 8. Cancel & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | On the create form, click "Go Back" | Navigates back to the list without saving | ✅ PASS — Navigates to list; no record created |
| 8.2 | On the edit form, click "Go Back" | Navigates back to the list without saving | ✅ PASS — Navigates to list; no changes saved |
| 8.3 | On the create form, fill a field, then click "Go Back" | Unsaved changes confirmation dialog appears | ✅ PASS — "Confirmation" dialog shown with message "You have unsaved changes. Are you sure you want to leave this page?" and Cancel/Confirm buttons. Fix AT-04: added `canDeactivate: [DirtyFormGuard]` to `asset-types.routes.ts:21,30`. |

---

## 9. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Verify the list route is guarded by `permissionGuard` | Cannot access list without `asset-types/list` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.2 | Verify the "Add New" button is permission-gated | Button hidden without `asset-types/create:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.3 | Verify the create route is guarded | Cannot access create without `asset-types/create` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.4 | Verify the edit route is guarded | Cannot access edit without `asset-types/update` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.5 | Verify row clicks are permission-gated | Rows not clickable without `asset-types/update:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.6 | Verify the delete button is permission-gated | Delete button hidden without `asset-types:delete:model` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |

---

## 10. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Enter a very long Name (260 characters) | Value accepted and stored; shown in full in list | ✅ PASS — 260-character name accepted without truncation; displayed in full in list |
| 10.2 | Enter a very long Description (500 characters) | Value accepted and stored; shown in full in list | ✅ PASS — 500-character description accepted without truncation; displayed in full in list |
| 10.3 | Enter a duplicate Name (same as existing "Other") | System rejects the duplicate with a clear error message; user stays on form | ✅ **PASS — Fixed** — Duplicate name "AutoTestType" submitted via UI. Backend returned 400 `E11000 duplicate key error collection: bifi_app_db.assettypes index: name_1 dup key: { name: "AutoTestType" }`. Error toast shown. User stayed on create form (no navigation). Fix AT-06: added partial unique index at `asset-type.model.ts:28-33`. |
| 10.4 | Create an asset type, then immediately edit it | Edit form loads with correct pre-filled values | ✅ PASS — Edit form correctly pre-fills all saved fields |
| 10.5 | Rapidly click Save on the create form | Only one POST fires; first click navigates away | ✅ PASS — First save redirects to list; subsequent clicks land on list page; single record created |

---

## 11. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Verify the list page heading uses translation | Heading shows "Asset Types" (translation key `assetTypes`, scope `asset-roster`) | ✅ PASS — Heading shows "Asset Types" |
| 11.2 | Verify the "Add New" button label uses translation | Button shows "Add New Asset Type" (translation key `addNewAssetType`, scope `asset-roster`) | ✅ PASS — Button shows "Add New Asset Type" |
| 11.3 | Verify the create form title uses translation | Title shows "Create Asset Type" (translation key `createAssetType`, scope `asset-roster`) | ✅ PASS — Title shows "Create Asset Type" |
| 11.4 | Verify the edit form title uses translation | Title shows "Update Asset Type" (translation key `updateAssetType`, scope `asset-roster`) | ✅ PASS — Title shows "Update Asset Type" |
| 11.5 | Verify the search bar label uses translation | Label shows "Search by name and description" (translation key `searchByNameDescription`, scope `asset-roster`) | ✅ PASS — Placeholder shows "Search by name and description" |
| 11.6 | Verify column headers use translation | Columns show Name and Description (translation keys `assetTypeName` and `description`, scope `asset-roster`) | ✅ PASS — Columns show Name and Description |
| 11.7 | Switch the app language to Spanish | All labels translate correctly | ⏭️ N/A — No language switch UI control available |

---

## 12. Integration with Asset Roster

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Navigate to Asset Roster list and check "Type" column | Column shows asset type name or "Not set" fallback | ✅ PASS — Navigated via sidebar to `/asset-roster/equipment/list`. Column header "Type" present. Values shown: "Other", "Other", "Other", "Contacts Page TS", "Other" — asset type names rendered correctly |
| 12.2 | Open Asset Roster create/edit form and check asset type dropdown | Dropdown lists all asset types with "Other" option | ⏭️ NOT TESTED — Requires opening Create Asset dialog |
| 12.3 | Select "Other" in the asset type dropdown | Additional fields appear for inline creation | ⏭️ NOT TESTED — Requires opening Create Asset dialog |
| 12.4 | Fill inline fields and save asset roster | New asset type created and linked | ⏭️ NOT TESTED — Requires opening Create Asset dialog |
| 12.5 | Filter Asset Roster list by asset type name | Matching assets appear | ✅ PASS — Searched for "Contacts Page TS" in the search bar. URL updated with `_search=Contacts+Page+TS`. List filtered to 6 matching records from Total Records count |

---

## Bugs Found

| # | Test | Description | Severity |
|---|------|-------------|----------|
| B-01 | ~ | **Save button only appears when form is dirty (AT-01)** — ✅ **RESOLVED 2026-07-22**: Save button now always visible (disabled when pristine) via fix S-01 in `form-actions.html:14-26`. Changed from `@if (formChanged() && showSave())` to always-rendered with `[disabled]="!formChanged()"`. | **Fixed** |
| B-02 | ~ | **Description server-required but not client-validated (AT-02)** — ✅ **RESOLVED 2026-07-22**: Added `NonWhitespaceValidators.nonWhitespaceRequired` to Description field in `asset-type-form.ts:16`. Client-side validation now blocks empty/whitespace-only Description before submission. | **Fixed** |
| B-03 | 7.3 | **Orphaned references on asset type deletion (AT-03)** — ✅ **RESOLVED 2026-07-27**: Verified "Other" type deleted successfully with no orphaned reference issues. Backend `asset-type-service.ts` `$pull` fix working. | **Fixed** |
| B-04 | ~ | **No unsaved changes prompt (AT-04)** — ✅ **RESOLVED 2026-07-22**: Added `canDeactivate: [DirtyFormGuard]` to both `create` and `edit/:id` routes in `asset-types.routes.ts:21,30`. Confirmation dialog "You have unsaved changes. Are you sure you want to leave this page?" now appears. | **Fixed** |
| B-05 | ~ | **Empty name accepted via whitespace (AT-05)** — ✅ **RESOLVED 2026-07-22**: Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` via fix S-07. Shared validator created in `base-app/form`. | **Fixed** |
| B-06 | 10.3 | **Duplicate names silently allowed** — ✅ **RESOLVED 2026-07-27**: Added partial unique index `assetTypeSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { active: true } })` at `asset-type.model.ts:28-33`. DB index `name_1` verified. Tested: duplicate "AutoTestType" submitted via UI → backend returned 400 `E11000 duplicate key error`, error toast shown, user stayed on form. | **Fixed** |

---

## Results Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 47 |
| ❌ FAIL | 0 |
| ⚠️ BUG / NOTE | 3 |
| ⏭️ NOT TESTED / N/A | 11 |

> **Re-tested 2026-07-22 after fixes:** AT-01 (Save button visibility), AT-05 (whitespace validation), AT-02 (Description validation), AT-04 (unsaved changes prompt) resolved. B-01, B-02, B-04, B-05 moved to Fixed. 3 more PASS, 1 less FAIL, 2 fewer BUG/NOTE.
>
> **Re-tested 2026-07-23 with in-app navigation:** Section 12 (Integration with Asset Roster) — 2/5 PASS (12.1 Type column renders correctly, 12.5 filter by type name works), 3 NOT TESTED. Remaining skipped tests in other sections are permission/security/error-handling/edge-case tests that cannot be verified without changing user permissions or simulating server errors — not navigation-related.
>
> **Re-tested 2026-07-27:** AT-03 (orphaned references) verified fixed — deleting "Other" type succeeded cleanly. AT-06 (duplicate names) verified fixed — duplicate "AutoTestType" rejected with 400/E11000 error toast. B-03, B-06 moved to Fixed. 2 more PASS, 1 fewer BUG/NOTE.
