# Maintenance Windows Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

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
| 1.1 | Navigate to `/settings/asset-roster/maintenance-windows` | Maintenance Windows list page loads at `/settings/asset-roster/maintenance-windows/list` | |
| 1.2 | Verify the page heading | Heading shows "Maintenance Windows" (translation key `maintenanceWindows`, scope `asset-roster`) | |
| 1.3 | Verify the "Add New" button is shown | Button with label "Add New Maintenance Window" (translation key `addNewMaintenanceWindow`, scope `asset-roster`) is visible, gated by `maintenance-windows/create:view` permission | |
| 1.4 | Click the "Add New" button | Navigates to the create form at `/settings/asset-roster/maintenance-windows/create` | |

---

## 2. Maintenance Windows List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the table columns | Table shows columns: Name (translation key `roleName`), Days Before (`daysBefore`), Days After (`daysAfter`), Recurrence (`recurrency`) — note: `roleName` may be a copy-paste bug from roles module | |
| 2.2 | List has maintenance window records | Each row shows name, daysBefore, daysAfter, and recurrency | |
| 2.3 | List is empty (no records) | "No records found" or empty state message is shown | |
| 2.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | |
| 2.5 | Click a row in the table | Navigates to the edit form at `/settings/asset-roster/maintenance-windows/edit/:id`, gated by `maintenance-windows/update:view` permission | |
| 2.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the maintenance window from the list | |
| 2.7 | Verify the search bar | Search bar is shown with label "Search by name, recurrency" (translation key `searchByNameRecurrency`, scope `asset-roster`) | |

---

## 3. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Type a name in the search bar | List filters to matching maintenance windows in real time (filter field: `name`) | |
| 3.2 | Type a recurrence value in the search bar | Matching maintenance windows appear (filter field: `recurrency`) | |
| 3.3 | Search with no matches | Empty state displayed; no error | |
| 3.4 | Clear the search field | Full maintenance window list reloads | |

---

## 4. Create Maintenance Window — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Navigate to the create form | Form loads with title "Create Maintenance Window" (translation key `createMaintenanceWindow`, scope `asset-roster`) | |
| 4.2 | Verify the form sections | Two sections: "General Information" (ordinal 1) with Name field, and "Window Information" (ordinal 2) with Days Before, Days After, and Recurrence fields | |
| 4.3 | Verify the form fields | Name (text input, required), Days Before (number input, required, min=1), Days After (number input, required, min=1), Recurrence (p-select dropdown with options: Daily, Weekly, Monthly, Quarterly, Semi-annually, Annually) | |
| 4.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | |
| 4.5 | Click Save without filling any fields | Validation error shown on required fields ("This field is required"); form does not submit | |
| 4.6 | Fill Name only, click Save | Validation errors still shown on Days Before and Days After | |
| 4.7 | Set Days Before or Days After to 0 or negative, click Save | Validation error shown for min=1 ("The minimum allowed value is 1"); form does not submit | |
| 4.8 | Fill Name with whitespace only, click Save | Validation error or document actual behaviour | |

---

## 5. Create Maintenance Window — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Enter Name "Preventive Check", Days Before "3", Days After "5", Recurrence "Monthly", click Save | Maintenance window created; redirected to the list | |
| 5.2 | Verify the new maintenance window appears in the list | The newly created "Preventive Check" row shows with daysBefore=3, daysAfter=5, recurrency="Monthly" | |
| 5.3 | Create a second window "Weekly Inspection" with Days Before "1", Days After "2", Recurrence "Weekly", click Save | Created successfully | |
| 5.4 | Verify both records appear in the list | Both "Preventive Check" and "Weekly Inspection" visible in the list | |

---

## 6. Edit Maintenance Window

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Click a row in the list to open the edit form | Edit form loads with title "Update Maintenance Window" (translation key `updateMaintenanceWindow`, scope `asset-roster`) | |
| 6.2 | Verify all saved fields are pre-filled | Name, Days Before, Days After, and Recurrence show the existing values | |
| 6.3 | Change the Name and click Save | Updated name appears in the list | |
| 6.4 | Change Days Before and click Save | Updated daysBefore appears in the list | |
| 6.5 | Change Days After and click Save | Updated daysAfter appears in the list | |
| 6.6 | Change the Recurrence and click Save | Updated recurrency appears in the list | |
| 6.7 | Clear the Name field (required) and click Save | Validation error shown; record not saved | |
| 6.8 | Set Days Before to 0 and click Save | Validation error shown for min=1; record not saved | |
| 6.9 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed | |

---

## 7. Delete Maintenance Window

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click the delete action on a row, confirm the deletion | Confirmation dialog appears; confirming removes the record from the list | |
| 7.2 | Cancel the delete confirmation | Dialog closes; record remains in the list | |
| 7.3 | Delete a maintenance window that may be referenced by asset rosters | System allows deletion — document actual behaviour (may leave dangling references) | |

---

## 8. Cancel & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | On the create form, click "Go Back" | Navigates back to the list without saving | |
| 8.2 | On the edit form, click "Go Back" | Navigates back to the list without saving | |
| 8.3 | On the create form, fill a field, then click "Go Back" | Navigates back directly — no unsaved changes prompt (document actual behaviour) | |

---

## 9. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Verify the list route is guarded by `permissionGuard` | A user without `maintenance-windows/list` permission cannot access the list | |
| 9.2 | Verify the "Add New" button is permission-gated | The button is hidden for users without `maintenance-windows/create:view` permission | |
| 9.3 | Verify the create route is guarded | A user without `maintenance-windows/create` permission cannot access the create form | |
| 9.4 | Verify the edit route is guarded | A user without `maintenance-windows/update` permission cannot access the edit form | |
| 9.5 | Verify row clicks are permission-gated | Rows are not clickable for users without `maintenance-windows/update:view` permission | |
| 9.6 | Verify the delete button is permission-gated | The delete button is hidden for users without `maintenance-windows:delete:model` permission | |

---

## 10. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Enter a very long Name (e.g. 255+ characters) | Value is accepted or rejected — document actual behaviour | |
| 10.2 | Set Days Before to a very large number (e.g. 99999) | Value is accepted or rejected — document actual behaviour | |
| 10.3 | Set Days After to a very large number (e.g. 99999) | Value is accepted or rejected — document actual behaviour | |
| 10.4 | Enter a duplicate Name (same as an existing record) | System allows it or shows an error — document actual behaviour | |
| 10.5 | Create a maintenance window, then immediately edit it | Edit form loads with correct pre-filled values | |
| 10.6 | Rapidly click Save on the create form | Only one POST request is fired | |

---

## 11. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Verify the list page heading uses translation | Heading shows "Maintenance Windows" (translation key `maintenanceWindows`, scope `asset-roster`) | |
| 11.2 | Verify the "Add New" button label uses translation | Button shows "Add New Maintenance Window" (translation key `addNewMaintenanceWindow`, scope `asset-roster`) | |
| 11.3 | Verify the create form title uses translation | Title shows "Create Maintenance Window" (translation key `createMaintenanceWindow`, scope `asset-roster`) | |
| 11.4 | Verify the edit form title uses translation | Title shows "Update Maintenance Window" (translation key `updateMaintenanceWindow`, scope `asset-roster`) | |
| 11.5 | Verify the search bar label uses translation | Label shows "Search by name, recurrency" (translation key `searchByNameRecurrency`, scope `asset-roster`) | |
| 11.6 | Verify column headers use translation | Columns show `roleName`, `daysBefore`, `daysAfter`, `recurrency` — note: `roleName` may display a raw key if no translation exists in asset-roster scope (document actual behaviour) | |
| 11.7 | Verify the "General Information" section title uses translation | Section shows "General Information" (translation key `generalInformation`, scope `asset-roster`) | |
| 11.8 | Verify the "Window Information" section title uses translation | Section shows "Window Information" (translation key `windowInformation`, scope `asset-roster`) | |
| 11.9 | Verify recurrence dropdown labels | Dropdown shows English labels ("Daily", "Weekly", etc.) — document if hardcoded or translated | |
| 11.10 | Switch the app language to Spanish | All labels translate correctly — document actual behaviour | |
