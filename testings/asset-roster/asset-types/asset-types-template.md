# Asset Types Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The asset-types module is a **Settings-style CRUD module** within the asset-roster library. It manages reference data for asset type categories (e.g. "Laser Therapy Unit"). It is accessed from **Settings → Asset Roster → Asset Types** at `/settings/asset-roster/asset-types`.
>
> **Pre-requisites:**
> - The logged-in user has `asset-types/list`, `asset-types/create`, and `asset-types/update` permissions.
> - At least one asset type record exists for edit/delete tests (create one first if the list is empty).

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/settings/asset-roster/asset-types` | Asset Types list page loads | |
| 1.2 | Verify the page heading | Heading shows "Asset Types" (translation key `assetTypes`, scope `asset-roster`) | |
| 1.3 | Verify the "Add New" button is shown | Button with label "Add New Asset Type" (translation key `addNewAssetType`) is visible, gated by `asset-types/create:view` permission | |
| 1.4 | Click the "Add New" button | Navigates to the create form at `/settings/asset-roster/asset-types/create` | |

---

## 2. Asset Types List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the table columns | Table shows columns: Name (translation key `assetTypeName`), Description (translation key `description`) | |
| 2.2 | List has asset type records | Each row shows the name and description of the asset type | |
| 2.3 | List is empty (no records) | "No records found" or empty state message is shown | |
| 2.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | |
| 2.5 | Click a row in the table | Navigates to the edit form for that asset type (`/settings/asset-roster/asset-types/edit/:id`) | |
| 2.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the asset type from the list | |
| 2.7 | Verify the search bar | Search bar is shown with label "Search by name, description" (translation key `searchByNameDescription`) | |

---

## 3. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Type a name in the search bar | List filters to matching asset types in real time | |
| 3.2 | Type a description keyword in the search bar | Matching asset types appear | |
| 3.3 | Search with no matches | Empty state displayed; no error | |
| 3.4 | Clear the search field | Full asset type list reloads | |

---

## 4. Create Asset Type — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Navigate to the create form | Form loads with title "Create Asset Type" (translation key `createAssetType`, scope `asset-roster`) | |
| 4.2 | Verify the form fields | Name field (text input) and Description field (textarea) are shown | |
| 4.3 | Verify the form section | A section titled "General Information" (translation key `generalInformation`) is shown | |
| 4.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | |
| 4.5 | Click Save without filling any fields | Validation error shown on the Name field ("This field is required"); form does not submit | |
| 4.6 | Fill Name with whitespace only, click Save | Validation error shown OR form submits — document actual behaviour | |

---

## 5. Create Asset Type — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Enter Name "Test Asset Type", leave Description empty, click Save | Asset type created; redirected to the list | |
| 5.2 | Verify the new asset type appears in the list | The newly created "Test Asset Type" shows in the list with empty description | |
| 5.3 | Enter Name "Medical Equipment" and Description "General medical devices", click Save | Asset type created with both values preserved | |
| 5.4 | Verify the saved record shows both fields | The list row shows name "Medical Equipment" and description "General medical devices" | |

---

## 6. Edit Asset Type

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Click a row in the list to open the edit form | Edit form loads with title "Update Asset Type" (translation key `updateAssetType`, scope `asset-roster`) | |
| 6.2 | Verify all saved fields are pre-filled | Name and Description fields show the existing values | |
| 6.3 | Change the Name and click Save | Updated name appears in the list | |
| 6.4 | Change the Description and click Save | Updated description appears in the list | |
| 6.5 | Clear the Name field (required) and click Save | Validation error shown; record not saved | |
| 6.6 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed (form is patched then dirty state is reset) | |

---

## 7. Delete Asset Type

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click the delete action on a row, confirm the deletion | Asset type removed from the list | |
| 7.2 | Cancel the delete confirmation | Asset type is NOT deleted; remains in the list | |
| 7.3 | Delete an asset type that is referenced by an asset roster | System either prevents deletion OR deletes and leaves the asset with a dangling reference — document actual behaviour | |

---

## 8. Cancel & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | On the create form, click "Go Back" | Navigates back to the list without saving | |
| 8.2 | On the edit form, click "Go Back" | Navigates back to the list without saving | |
| 8.3 | On the create form, fill a field, then click "Go Back" | Navigates back (unsaved changes prompt may appear — document actual behaviour) | |

---

## 9. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Verify the list route is guarded by `permissionGuard` | A user without `asset-types/list` permission cannot access the list | |
| 9.2 | Verify the "Add New" button is permission-gated | The button is hidden for users without `asset-types/create:view` permission | |
| 9.3 | Verify the create route is guarded | A user without `asset-types/create` permission cannot access the create form | |
| 9.4 | Verify the edit route is guarded | A user without `asset-types/update` permission cannot access the edit form | |
| 9.5 | Verify row clicks are permission-gated | Rows are not clickable for users without `asset-types/update:view` permission | |
| 9.6 | Verify the delete button is permission-gated | The delete button is hidden for users without `asset-types:delete:model` permission | |

---

## 10. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Enter a very long Name (e.g. 255+ characters) | Value is accepted or rejected — document actual behaviour | |
| 10.2 | Enter a very long Description | Value is accepted or rejected — document actual behaviour | |
| 10.3 | Enter a duplicate Name (same as an existing asset type) | System saves OR shows an error — document actual behaviour | |
| 10.4 | Create an asset type, then immediately edit it | Edit form loads with the correct pre-filled values | |
| 10.5 | Rapidly click Save on the create form | Only one POST request is fired | |

---

## 11. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Verify the list page heading uses translation | Heading uses translation key `assetTypes` (scope `asset-roster`) | |
| 11.2 | Verify the "Add New" button label uses translation | Button uses translation key `addNewAssetType` (scope `asset-roster`) | |
| 11.3 | Verify the create form title uses translation | Title uses translation key `createAssetType` (scope `asset-roster`) | |
| 11.4 | Verify the edit form title uses translation | Title uses translation key `updateAssetType` (scope `asset-roster`) | |
| 11.5 | Verify the search bar label uses translation | Label uses translation key `searchByNameDescription` (scope `asset-roster`) | |
| 11.6 | Verify column headers use translation | Columns use keys `assetTypeName` and `description` (scope `asset-roster`) | |
| 11.7 | Switch the app language to Spanish | All labels translate correctly — document actual behaviour | |

---

## 12. Integration with Asset Roster

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Navigate to the Asset Roster list and check the "Type" column | The column shows the asset type name (or "Not set" fallback) from the linked `assetTypeIds` | |
| 12.2 | Open the Asset Roster create/edit form dialog and check the asset type dropdown | The dropdown lists all asset types with an "Other" option for inline creation | |
| 12.3 | Select "Other" in the asset type dropdown | Additional Name and Description fields appear for creating a new asset type inline | |
| 12.4 | Fill the inline new asset type fields and save the asset roster | The new asset type is created and linked to the asset — verify it appears in the Asset Types list | |
| 12.5 | Filter the Asset Roster list by asset type name | Assets with the matching type name appear | |
