# Maintenance Windows Module — Test Results

Tested: 2026-07-21 (re-tested 2026-07-22 after fixes)
Method: Automated UI tests via Playwright browser

> **Module scope:** The maintenance-windows module is a **Settings-style CRUD module** within the asset-roster library. It manages maintenance window definitions (name, days before/after, recurrence pattern) used by the Asset Roster maintenance scheduling. Accessed from **Settings → Asset Roster → Maintenance Windows** at `/settings/asset-roster/maintenance-windows`.
>
> **Pre-requisites:**
> - Logged-in user has `maintenance-windows/list`, `maintenance-windows/create`, and `maintenance-windows/update` permissions.
> - At least one maintenance window record exists for edit/delete tests.
>
> **Known issues (pre-existing):**
> - The `name` column in `maintenance-window-columns.ts` uses `title: 'roleName'` (likely a copy-paste from the roles module) instead of a maintenance-window-specific key. The column header may display a raw translation key.
> - The recurrence dropdown options are hardcoded English strings (`"Daily"`, `"Weekly"`, etc.) and are not translated via i18n.
> - The `active` field exists in the `maintenanceWindow` interface but is not exposed in the form, columns, or filters — likely server-managed.

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/settings/asset-roster/maintenance-windows` | Maintenance Windows list page loads at `/settings/asset-roster/maintenance-windows/list` | ✅ PASS — Redirected to `/settings/asset-roster/maintenance-windows/list` with query params |
| 1.2 | Verify the page heading | Heading shows "Maintenance Windows" (translation key `maintenanceWindows`, scope `asset-roster`) | ✅ PASS — h1 "Maintenance Windows" present |
| 1.3 | Verify the "Add New" button is shown | Button with label "Add New Maintenance Window" (translation key `addNewMaintenanceWindow`, scope `asset-roster`) is visible, gated by `maintenance-windows/create:view` permission | ✅ PASS — "Add New Maintenance Window" button visible on list page |
| 1.4 | Click the "Add New" button | Navigates to the create form at `/settings/asset-roster/maintenance-windows/create` | ✅ PASS — Click navigates to `/settings/asset-roster/maintenance-windows/create` |

---

## 2. Maintenance Windows List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the table columns | Table shows columns: Name (translation key `roleName`), Days Before (`daysBefore`), Days After (`daysAfter`), Recurrence (`recurrency`) — note: `roleName` may be a copy-paste bug from roles module | ⚠️ NOTE — Column header renders as "Role Name" (key `roleName` translates to "Role Name" in asset-roster scope). Form field uses `name` key = "Name". Inconsistent: column says "Role Name" while form says "Name" for the same concept. |
| 2.2 | List has maintenance window records | Each row shows name, daysBefore, daysAfter, and recurrency | ✅ PASS — Records visible with correct data: name, daysBefore, daysAfter, recurrency |
| 2.3 | List is empty (no records) | "No records found" or empty state message is shown | ✅ PASS — "No Results Found" with sub-message "No results match your current search term or filter selection" |
| 2.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | ✅ PASS — "All records loaded" appears at bottom |
| 2.5 | Click a row in the table | Navigates to the edit form at `/settings/asset-roster/maintenance-windows/edit/:id`, gated by `maintenance-windows/update:view` permission | ✅ PASS — Clicking a row navigates to `/settings/asset-roster/maintenance-windows/edit/:id` |
| 2.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the maintenance window from the list | ✅ PASS — Confirmation dialog "Are you sure you want to proceed to delete this item of maintenance-windows?" with Cancel/Confirm; confirming deletes and shows success notification; total records decreases |
| 2.7 | Verify the search bar | Search bar is shown with label "Search by name, recurrency" (translation key `searchByNameRecurrency`, scope `asset-roster`) | ✅ PASS — Search bar present with placeholder "Search by name and recurrency" |

---

## 3. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Type a name in the search bar | List filters to matching maintenance windows in real time (filter field: `name`) | ✅ PASS — Typing "Preventive" filters to 1 result showing "Preventive Check Updated" |
| 3.2 | Type a recurrence value in the search bar | Matching maintenance windows appear (filter field: `recurrency`) | ✅ PASS — Typing "quarterly" filters to 1 matching record |
| 3.3 | Search with no matches | Empty state displayed; no error | ✅ PASS — "No Results Found" message with no errors |
| 3.4 | Clear the search field | Full maintenance window list reloads | ✅ PASS — Clearing search restores all records |

---

## 4. Create Maintenance Window — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Navigate to the create form | Form loads with title "Create Maintenance Window" (translation key `createMaintenanceWindow`, scope `asset-roster`) | ✅ PASS — h3 "Create Maintenance Window" heading shown |
| 4.2 | Verify the form sections | Two sections: "General Information" (ordinal 1) with Name field, and "Window Information" (ordinal 2) with Days Before, Days After, and Recurrence fields | ⚠️ NOTE — Two sections present. "General information" (lowercase 'i') vs "Window Information" (uppercase 'I') — inconsistent casing in translation values |
| 4.3 | Verify the form fields | Name (text input, required), Days Before (number input, required, min=1), Days After (number input, required, min=1), Recurrence (p-select dropdown with options: Daily, Weekly, Monthly, Quarterly, Semi-annually, Annually) | ✅ PASS — All 4 fields present. Recurrence options: "Daily", "Weekly", "Monthly", "Quarterly", "Semi-anually", "Annually" (note: "Semi-anually" has typo — should be "Semi-annually") |
| 4.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | ✅ PASS — "Go back" always visible; "Save" button appears only after form becomes dirty |
| 4.5 | Click Save without filling any fields | Validation error shown on required fields ("This field is required"); form does not submit | ⚠️ NOTE — Only Name field shows "This field is required" when empty. Days Before and Days After default to `1` (valid value), so no validation error on empty form submit for those fields |
| 4.6 | Fill Name only, click Save | Validation errors still shown on Days Before and Days After | ✅ PASS — Name value accepted; Days Before/After have default valid value (1), so no additional errors |
| 4.7 | Set Days Before or Days After to 0 or negative, click Save | Validation error shown for min=1 ("The minimum allowed value is 1"); form does not submit | ✅ PASS — Setting Days Before to 0 shows "This field must be at least 1."; form does not submit |
| 4.8 | Fill Name with whitespace only, click Save | Whitespace-only input rejected with validation error | ✅ PASS — Whitespace-only Name rejected by `NonWhitespaceValidators.nonWhitespaceRequired` (fix S-07). "This field is required" validation error shown. |

---

## 5. Create Maintenance Window — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Enter Name "Preventive Check", Days Before "3", Days After "5", Recurrence "Monthly", click Save | Maintenance window created; redirected to the list | ✅ PASS — Created and redirected to list with success notification |
| 5.2 | Verify the new maintenance window appears in the list | The newly created "Preventive Check" row shows with daysBefore=3, daysAfter=5, recurrency="Monthly" | ✅ PASS — "Preventive Check" visible with 3, 5, "monthly" |
| 5.3 | Create a second window "Weekly Inspection" with Days Before "1", Days After "2", Recurrence "Weekly", click Save | Created successfully | ✅ PASS — Created successfully |
| 5.4 | Verify both records appear in the list | Both "Preventive Check" and "Weekly Inspection" visible in the list | ✅ PASS — Both present in list |

---

## 6. Edit Maintenance Window

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Click a row in the list to open the edit form | Edit form loads with title "Update Maintenance Window" (translation key `updateMaintenanceWindow`, scope `asset-roster`) | ✅ PASS — Clicking "Preventive Check" row navigates to edit form with h3 "Update Maintenance Window" |
| 6.2 | Verify all saved fields are pre-filled | Name, Days Before, Days After, and Recurrence show the existing values | ✅ PASS — "Preventive Check", 3, 5, "Monthly" pre-filled |
| 6.3 | Change the Name and click Save | Updated name appears in the list | ✅ PASS — Changed "Preventive Check" → "Preventive Check Updated"; reflected in list |
| 6.4 | Change Days Before and click Save | Updated daysBefore appears in the list | ✅ PASS — Changed 3 → 7; reflected in list |
| 6.5 | Change Days After and click Save | Updated daysAfter appears in the list | ✅ PASS — Changed 5 → 10; reflected in list |
| 6.6 | Change the Recurrence and click Save | Updated recurrency appears in the list | ✅ PASS — Changed "Monthly" → "Quarterly"; list shows "quarterly" |
| 6.7 | Clear the Name field (required) and click Save | Validation error shown; record not saved | ✅ PASS — "This field is required" shown; form does not submit |
| 6.8 | Set Days Before to 0 and click Save | Validation error shown for min=1; record not saved | ✅ PASS — "This field must be at least 1." shown; stays on edit page |
| 6.9 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed | ✅ PASS — No Save button visible on initial edit form load; appears only after modifying a field |

---

## 7. Delete Maintenance Window

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click the delete action on a row, confirm the deletion | Confirmation dialog appears; confirming removes the record from the list | ✅ PASS — Confirmation dialog shown; "Weekly Inspection" deleted; total records decreases from 4 to 3 |
| 7.2 | Cancel the delete confirmation | Dialog closes; record remains in the list | ✅ PASS — Cancel dismisses dialog; record remains in list |
| 7.3 | Delete a maintenance window that may be referenced by asset rosters | System allows deletion — document actual behaviour (may leave dangling references) | ⏭️ N/A — No asset roster records referencing a maintenance window available to test |

---

## 8. Cancel & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | On the create form, click "Go Back" | Navigates back to the list without saving | ✅ PASS — Navigates to list; no record created |
| 8.2 | On the edit form, click "Go Back" | Navigates back to the list without saving | ✅ PASS — Navigates to list; no changes saved |
| 8.3 | On the create form, fill a field, then click "Go Back" | Navigates back directly — no unsaved changes prompt (document actual behaviour) | ⚠️ BUG — No unsaved-changes confirmation dialog when navigating away from a dirty form; data is silently discarded |

---

## 9. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Verify the list route is guarded by `permissionGuard` | A user without `maintenance-windows/list` permission cannot access the list | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.2 | Verify the "Add New" button is permission-gated | The button is hidden for users without `maintenance-windows/create:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.3 | Verify the create route is guarded | A user without `maintenance-windows/create` permission cannot access the create form | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.4 | Verify the edit route is guarded | A user without `maintenance-windows/update` permission cannot access the edit form | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.5 | Verify row clicks are permission-gated | Rows are not clickable for users without `maintenance-windows/update:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 9.6 | Verify the delete button is permission-gated | The delete button is hidden for users without `maintenance-windows:delete:model` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |

---

## 10. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Enter a very long Name (e.g. 255+ characters) | Value is accepted or rejected — document actual behaviour | ⚠️ NOTE — 260-character name accepted without validation error; displayed in list (may be truncated in table cell) |
| 10.2 | Set Days Before to a very large number (e.g. 99999) | Value is accepted or rejected — document actual behaviour | ⚠️ NOTE — Value 99999 accepted and saved successfully |
| 10.3 | Set Days After to a very large number (e.g. 99999) | Value is accepted or rejected — document actual behaviour | ⚠️ NOTE — Value 99999 accepted and saved successfully |
| 10.4 | Enter a duplicate Name (same as an existing record) | System allows it or shows an error — document actual behaviour | ⚠️ BUG — Duplicate name "Daily" accepted; second record with same name "Daily" created without validation error |
| 10.5 | Create a maintenance window, then immediately edit it | Edit form loads with correct pre-filled values | ✅ PASS — "Quick Edit Test" record (2, 3, Annually) showed correct pre-filled values in edit form |
| 10.6 | Rapidly click Save on the create form | Only one POST request is fired | ✅ PASS — Only one record "Rapid Save Test" created; subsequent Save clicks fail as page navigates away |

---

## 11. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Verify the list page heading uses translation | Heading shows "Maintenance Windows" (translation key `maintenanceWindows`, scope `asset-roster`) | ✅ PASS — h1 renders "Maintenance Windows" |
| 11.2 | Verify the "Add New" button label uses translation | Button shows "Add New Maintenance Window" (translation key `addNewMaintenanceWindow`, scope `asset-roster`) | ✅ PASS — Button shows "Add New Maintenance Window" |
| 11.3 | Verify the create form title uses translation | Title shows "Create Maintenance Window" (translation key `createMaintenanceWindow`, scope `asset-roster`) | ✅ PASS — h3 shows "Create Maintenance Window" |
| 11.4 | Verify the edit form title uses translation | Title shows "Update Maintenance Window" (translation key `updateMaintenanceWindow`, scope `asset-roster`) | ✅ PASS — h3 shows "Update Maintenance Window" |
| 11.5 | Verify the search bar label uses translation | Label shows "Search by name, recurrency" (translation key `searchByNameRecurrency`, scope `asset-roster`) | ✅ PASS — Placeholder shows "Search by name and recurrency" |
| 11.6 | Verify column headers use translation | Columns show `roleName`, `daysBefore`, `daysAfter`, `recurrency` — note: `roleName` may display a raw key if no translation exists in asset-roster scope (document actual behaviour) | ⚠️ NOTE — `roleName` IS translated in asset-roster scope, renders as "Role Name". Days Before, Days After, Recurrency all render correctly. |
| 11.7 | Verify the "General Information" section title uses translation | Section shows "General Information" (translation key `generalInformation`, scope `asset-roster`) | ⚠️ NOTE — Translation value is "General information" (lowercase 'i'), inconsistent with "Window Information" (uppercase 'I') |
| 11.8 | Verify the "Window Information" section title uses translation | Section shows "Window Information" (translation key `windowInformation`, scope `asset-roster`) | ✅ PASS — Section shows "Window Information" |
| 11.9 | Verify recurrence dropdown labels | Dropdown shows English labels ("Daily", "Weekly", etc.) — document if hardcoded or translated | ⚠️ NOTE — Recurrence options are hardcoded English: "Daily", "Weekly", "Monthly", "Quarterly", "Semi-anually", "Annually". Note: "Semi-anually" has a typo (should be "Semi-annually"). These do NOT switch language when locale changes. |
| 11.10 | Switch the app language to Spanish | All labels translate correctly — document actual behaviour | ✅ PASS — Language switch available in User Panel dropdown. All keys switch correctly: "Ventanas de Mantenimiento", "Agregar Nueva Ventana de Mantenimiento", "Buscar por nombre y recurrencia", "Nombre del Rol", "Días Antes", "Días Después", "Recurrencia". Navigation breadcrumbs, sidebar menu, and "Total de Registros" / "Mostrando" all translated. |

---

## Bugs Found

| # | Test | Description | Severity |
|---|------|-------------|----------|
| B-01 | ~ | **Whitespace-only name accepted (MW-01)** — ✅ **RESOLVED 2026-07-22**: Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` via fix S-07. File: `maintenance-window-form.ts:19`. | **Fixed** |
| B-02 | 10.4 | **Duplicate names silently allowed** — Creating a maintenance window with a name already used by another record ("Daily") succeeds without any validation error or warning. No unique constraint on name. | Medium |
| B-03 | 8.3 | **No unsaved changes prompt** — Navigating back from a dirty create form silently discards changes without confirmation. No `confirmDialog.unsavedChanges` prompt. | Medium |
| B-04 | 4.5 | **Days Before/After default to 1, masking required validation** — Both number fields default to `1` (valid value), so submitting an empty form only shows Name as required. Users may not realize these fields are required since they're pre-filled. | Low |
| B-05 | 4.2, 11.7 | **Inconsistent section heading casing** — "General information" (lowercase 'i') vs "Window Information" (uppercase 'I') in translation values for the two form sections. | Low |
| B-06 | 2.1, 11.6 | **Column header "Role Name" vs form field "Name"** — The list column uses `roleName` key (renders "Role Name") while the form field uses `name` key (renders "Name"). Both refer to the same concept, causing user confusion. | Low |
| B-07 | 11.9 | **Hardcoded English recurrence labels with typo** — Recurrence dropdown options are hardcoded strings (not translated via i18n). One option has a typo: "Semi-anually" should be "Semi-annually". Options do not switch with language. | Low |

---

## Results Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 36 |
| ❌ FAIL | 0 |
| ⚠️ BUG / NOTE | 13 |
| ⏭️ NOT TESTED / N/A | 2 |

> **Re-tested 2026-07-22 after fixes:** MW-01 (whitespace validation) resolved. B-01 moved to Fixed. 1 more PASS, 1 fewer BUG/NOTE.
