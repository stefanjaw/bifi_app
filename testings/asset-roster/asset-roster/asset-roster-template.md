# Asset Roster Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The asset-roster module is the **main feature module** of the `asset-roster` library (the central entry point via `index.ts`). It is a **dashboard-based asset management module** accessed from the sidebar at **Asset Roster → Equipment** at `/asset-roster/equipment/list`. It includes a status-card dashboard, list/grid views, a Create Asset dialog, and a tabbed maintenance/edit page (`/asset-roster/equipment/maintenance/:id`) with 9 UI sections including a financial/depreciation calculator and TCO chart. It hosts 8 dialogs (create, document, image, commissioning, decommissioning, service, finish service/maintenance, skip PM, activity-history add file).
>
> **Pre-requisites:**
> - Logged-in user has `asset-rosters/list`, `asset-rosters/create:model`, `asset-rosters/update:model`, `asset-rosters/update:view`, `asset-rosters/export:read:model`, `asset-rosters/import:create:model`, `reporting/generate-report:read:model`, and `activity-history/export:read:model` permissions.
> - At least one **commissioned** asset (status `active` or `in-pm`) and at least one **awaiting commissioning** asset exist for state-machine tests.
> - At least one **Asset Type** and one **Contact (Company)** exist for the create-form inline "Other" lookup tests.
> - At least one **Maintenance Window** and one **Room/Location** exist for the maintenance section tests.
> - At least one **Reporting Template** of model `AssetRoster` exists for the reporting download test.
>
> **Known issues (pre-existing):**
> - Many hardcoded English strings throughout sections (Location label, "Asset Photo" card header, "+ Add Location", Software Configuration labels, "Total:"/"Assigned:"/"Unassigned:", "yrs" suffix, TCO range buttons, descriptor options, dialog headers, toast messages like "Asset updated successfully", `window.confirm` messages). These violate the i18n convention.
> - The Notes Section reuses ordinal **2** (collision with Documents Section) — appears to be a leftover bug.
> - The `getUserName()` helper in notes-section always returns the **current user's** contact name regardless of which user authored the note (incorrect lookup).
> - The Create dialog sends `makeInformation: { ..., website: 'www.example.com' }` (hardcoded fake website) when creating a new OEM/make inline.
> - The activity-history-add-file-dialog class name has a typo: `AssetRosterActiviyHistoryAddFileDialog`.
> - Default photo URL returned by `getPhoto()` in the list is a hardcoded placeholder when an asset lacks `_id`.
> - The list has **no delete action** on rows — deletion must be done elsewhere (if at all). Document this in tests.
> - The maintenance page is **edit-by-default**; the `isEditMode` toggle is vestigial (no UI caller).

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Click the "Asset Roster" sidebar icon | Navigates to `/asset-roster/equipment/list` (the dashboard list page) | |
| 1.2 | Navigate directly to `/asset-roster/equipment` | Redirects to `/asset-roster/equipment/list` | |
| 1.3 | Verify the page heading | Dashboard title shows "Asset Dashboard" (translation key `assetDashboard`, scope `asset-roster`) | |
| 1.4 | Verify the breadcrumb | Breadcrumb shows "Asset Roster → List" | |
| 1.5 | Click a table row | Navigates to the maintenance page at `/asset-roster/equipment/maintenance/:id`, gated by `asset-rosters/update:view` permission | |
| 1.6 | Click the "View Details" tag on a row | Navigates to the maintenance page for that asset | |

---

## 2. Dashboard — Status Cards

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the 5 status cards are shown | Cards visible: Under Service (`underService`), Overdue (`overdue`), Due (`due`), In PM (`inPm`), PM Not Set (`pmNotSet`) | |
| 2.2 | Verify each card shows a count and label | Each card displays the matching translation key label and a numeric count | |
| 2.3 | Verify icons per card | Icons: under-service `pi-hammer`, overdue `pi-exclamation-triangle`, due `pi-clock`, in-pm `pi-cog`, pm-not-set `pi-question` | |
| 2.4 | Click the "Under Service" card | List filters to assets currently under service (status = `under-service`) | |
| 2.5 | Click the "Overdue" card | List filters to assets where `maxMaintenanceDate < now` | |
| 2.6 | Click the "Due" card | List filters to assets where `minMaintenanceDate <= now <= maxMaintenanceDate` | |
| 2.7 | Click the "In PM" card | List filters to assets with status = `in-pm` | |
| 2.8 | Click the "PM Not Set" card | List filters to assets with no `maintenanceWindowIds` | |
| 2.9 | Click a status card while another is active | Filter updates to the newly clicked variant (replaces the previous filter) | |
| 2.10 | Verify card count refreshes after creating/editing an asset | Counts reflect the updated asset list (context emits `'saved'` event → reloads counts) | |

---

## 3. Dashboard — Toolbar & View Toggle

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Verify the List/Grid toggle (p-selectButton) | A two-option segmented control is visible with "List" and "Grid" options | |
| 3.2 | Click "Grid" | View switches from the table to a responsive card grid | |
| 3.3 | Click "List" | View switches back to the table | |
| 3.4 | Verify the "Reporting" button is visible, gated by permission | Button labelled `reporting` (icon `pi-file-pdf`) visible only with `reporting/generate-report:read:model` permission | |
| 3.5 | Verify the "Import CSV" button is visible, gated by permission | Button labelled `importCsv` visible only with `asset-rosters/import:create:model` permission | |
| 3.6 | Verify the "Export CSV" button is visible, gated by permission | Button labelled `exportCsv` visible only with `asset-rosters/export:read:model` permission | |
| 3.7 | Verify the "Add New Asset" button is visible, gated by permission | Button labelled `addNewAsset` (icon `pi-plus`) visible only with `asset-rosters:create:model` permission | |
| 3.8 | Click the "Add New Asset" button | Opens the Create Asset Form Dialog (no navigation) | |
| 3.9 | Verify sticky-header shadow on scroll | Scrolling the list toggles a shadow on the sticky header and switches status cards to compact mode | |

---

## 4. Asset Roster List — Table View

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Verify the table columns | Columns render with the keys defined in `assetRosterColumns` (e.g. photo, status, serial number, product model, asset type) — verify each column header is translated with scope `asset-roster` | |
| 4.2 | List has asset records | Each row shows the asset's data (photo thumbnail, status tag, identifying fields) | |
| 4.3 | List is empty (no records / no-match search) | Empty state "No Results Found" is shown | |
| 4.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | |
| 4.5 | Verify the row actions column | Each row has a "View Details" `p-tag` (warn severity) linking to the maintenance page, gated by `asset-rosters/update:view` permission | |
| 4.6 | Verify there is no delete button on rows | The list does NOT provide a delete action — document actual behaviour | |
| 4.7 | Verify the search bar | Search bar present with placeholder "Search assets" (translation key `searchAssets`, scope `asset-roster`) | |
| 4.8 | Verify the status filter dropdown | A `<bifi-app-asset-roster-status-select>` is visible next to the search bar with placeholder "Filter by status" | |

---

## 5. Asset Roster List — Grid View

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Switch to grid view | A responsive grid of cards appears (1 col mobile, up to 4 cols xl) | |
| 5.2 | Verify each grid card content | Card shows: photo (or default placeholder), status tag, asset type name (or "Not set"), product model (bold), serial number, location address | |
| 5.3 | Verify status tag on each card | Tag shows asset status with hyphens replaced by spaces (e.g. "under service") — note: hardcoded transformation, not translated | |
| 5.4 | Verify "Not set" fallback for asset type | When an asset has no `assetTypeIds`, the card shows "Not set" (hardcoded English) | |
| 5.5 | Verify default photo placeholder | When an asset has no photo, a hardcoded default image URL is shown | |
| 5.6 | Verify footer of grid card | Shows "next PM Overdue" label + `maintenanceDate` value | |
| 5.7 | Click a grid card | Navigates to the maintenance page for that asset | |
| 5.8 | Scroll grid view to bottom | Next page loads (infinite scroll on the grid container) | |

---

## 6. Status Filter Select

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Open the status select dropdown | Options shown: All Statuses, Active, Awaiting Commissioning, Under Service, Decommissioned, Due, Overdue, In PM, PM Not Set | |
| 6.2 | Select "Active" | List filters to assets with status `active` | |
| 6.3 | Select "Awaiting Commissioning" | List filters to assets with status `awaiting-commissioning` | |
| 6.4 | Select "Under Service" | List filters to assets with status `under-service` | |
| 6.5 | Select "Decommissioned" | List filters to assets with status `decommissioned` | |
| 6.6 | Select "All Statuses" | Filter cleared; full list shown | |
| 6.7 | Verify two-way binding with status card selection | Clicking a status card updates the dropdown's selected value (and vice-versa) | |

---

## 7. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Type a serial number or product model in the search bar | List filters in real time using the searchFilters (`assetRosterFilters`) | |
| 7.2 | Search with no matches | Empty state displayed; no error | |
| 7.3 | Clear the search field | Full asset list reloads | |
| 7.4 | Combine search text with a status card filter | Both filters apply together (AND behaviour) | |
| 7.5 | Combine search text with status dropdown selection | Both filters apply together | |

---

## 8. Create Asset — Form Dialog — Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Click "Add New Asset" | A modal `p-dialog` opens with header "Add New Medical Asset" (translation key `addNewMedicalAsset`, scope `asset-roster`) | |
| 8.2 | Verify the device type radio buttons | Three options shown: "Serialized" (`serialized`), "Non-Serialized" (`nonSerialized`), "Software" (`software`); `serialized` is selected by default | |
| 8.3 | Verify the "Type of Equipment" p-select | Dropdown lists existing asset types with an "Other" option prepended, filterable | |
| 8.4 | Verify the "Make" p-select | Dropdown lists existing contacts (companies) with an "Other" option prepended, filterable | |
| 8.5 | Verify the "Date Acquired" date picker | Required date picker visible with icon | |
| 8.6 | Verify the "Save" and "Cancel" buttons via `<bifi-app-form-actions>` | Cancel always visible; Save labelled `save`/`saving` and disabled until form dirty | |
| 8.7 | Click Save without filling any fields | Validation errors on required fields (`deviceType`, `acquiredDate`, plus `serialNumber`/`productModel` for serialized); `markAllAsTouched()` fires | |
| 8.8 | Verify "Cancel" closes the dialog | Dialog closes; no record created | |
| 8.9 | Verify the `CreateAssetRosterForm` device-type effect | Selecting `non-serialized` clears `serialNumber` errors and makes `description` required; selecting `software` shows the Software Configuration group | |

---

## 9. Create Asset — Device Type Variants

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Select "Serialized", leave required fields empty | Fields shown: Model, Serial Number; both required | |
| 9.2 | Select "Non-Serialized" | Fields shown: Description (required), Quantity (optional, min 1); Serial Number/Model hidden | |
| 9.3 | Select "Software" | Fields shown: Description (required) + Software Configuration group (Regulatory Classification, Version, License Type, Parent Asset ID, UDI-DI, FDA/MDR Class, License Key, Do Not Patch toggle); Serial Number/Model hidden | |
| 9.4 | Verify Software Configuration regulatory classification options | Options: "OS / Middleware", "SiMD – Software in a Medical Device", "SaMD – Software as a Medical Device" (hardcoded English) | |
| 9.5 | Verify FDA/MDR class options | Options: "Class I", "Class II", "Class III" (hardcoded English) | |
| 9.6 | Verify license type options | Options: "Perpetual", "Subscription SaaS" (hardcoded English) | |
| 9.7 | Verify Parent Asset ID dropdown lists other assets | Filterable, clearable; shows serial number or product model or description or "Unnamed" fallback | |
| 9.8 | Toggle "Do not patch (Prevent Auto Update)" | Boolean toggle bound to `preventAutoUpdate`, defaults to false | |

---

## 10. Create Asset — Inline "Other" Type/Make Creation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Select "Other" in the Type of Equipment dropdown | Two new fields appear: "New Asset Type Name" (placeholder `egLaserTherapyUnity`) and "New Asset Type Description" (placeholder `egTherapeuticLaser`); `createdType.name` and `description` become required | |
| 10.2 | Switch back to a real asset type | The "New Asset Type Name/Description" fields disappear; their validators are cleared | |
| 10.3 | Select "Other" in the Make dropdown | A new "Other OEM Name" field appears with placeholder `enterOemName`; `createdMake.oemName` becomes required | |
| 10.4 | Switch back to a real make | The "Other OEM Name" field disappears; its validator is cleared | |

---

## 11. Create Asset — Submit (Serialized Happy Path)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Fill serialized form with valid values (Type, Make, Model "Optima XR220amx", Serial "SN00X", Date Acquired today), click Save | Asset created via `POST /api/asset-rosters`; dialog closes; success state; list reloads with new record | |
| 11.2 | Verify the new asset appears in the list (and grid) | New record visible in both list and grid views with correct data | |
| 11.3 | Verify the 5 dashboard status card counts refresh | Under Service / Overdue / Due / In PM / PM Not Set counts update to include the new asset | |

---

## 12. Create Asset — Submit (Non-Serialized & Software Variants)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Create a non-serialized asset (Description, Quantity=10, valid Type/Make/Acquired Date), Save | Created; payload includes `description` and `quantity` but no `serialNumber`/`productModel` | |
| 12.2 | Verify the new non-serialized asset appears in the list | New record visible | |
| 12.3 | Create a software asset with full Software Configuration (Regulatory Classification, Version, License Type, Parent Asset ID, UDI-DI, FDA/MDR Class, License Key, preventAutoUpdate=true), Save | Created with nested `softwareConfiguration` object; only provided optional sub-fields are included; `preventAutoUpdate` defaults to false if omitted | |
| 12.4 | Create an asset with "Other" inline type creation, Save | Server creates the new asset type; payload sends `assetTypeInformation:{name, description}` instead of `assetTypeIds` | |
| 12.5 | Create an asset with "Other" inline make creation, Save | Server creates the new OEM contact; payload sends `makeInformation:{name, lastName, type:'company', website:'www.example.com'}` (note: hardcoded fake website — document behaviour) | |

---

## 13. Maintenance Page — Access & Layout

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Navigate to `/asset-roster/equipment/maintenance/:id` for an existing asset | The maintenance/edit page loads with title "Asset Details" (translation key `assetDetails`) | |
| 13.2 | Verify the prev/next navigation controls | Two chevron buttons (Previous, Next) with `aria-label`s; disabled at first/last asset respectively | |
| 13.3 | Verify the asset counter | Shows `currentIndex + 1` of `totalAssets` (note: hardcoded "of" — document behaviour) | |
| 13.4 | Verify the "Back to Dashboard" button | Always-visible button with `backToDashboard` label and `pi-arrow-left` icon | |
| 13.5 | Verify the "Save" & "Cancel" action buttons only appear when dirty | Save (label `saving`/`saveChanges`, `pi-spinner`/`pi-check`) and Cancel appear only when `isDirty()` is true; Save gated by `asset-rosters/update:model` | |
| 13.6 | Verify the DirtyFormGuard on the maintenance route | Attempting to navigate away while dirty triggers a confirmation (translation key `confirmDialog.unsavedChanges`) | |
| 13.7 | Verify the page is in edit mode by default | No "Edit" button to toggle; the form is editable on load (vestigial `toggleEditMode`) | |
| 13.8 | Verify the two tabs | Tab 0 label `infoMaintenance` (General/Maintenance) and Tab 1 label `lifecycleTco` (Lifecycle/TCO) are visible | |
| 13.9 | Click the "Lifecycle / TCO" tab | Tab 1 content (Financial Information Section + Depreciation Calculator + TCO chart) shows; Tab 0 content hides | |

---

## 14. Status Banner Section

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | Open an asset with status `awaiting-commissioning` | Banner shows warn `<p-message>` with icon `pi-question-circle`, title `assetAwaitingCommissioning` and description `assetAwaitingCommissioningDesc` | |
| 14.2 | Open an asset with status `active` | Banner shows success `<p-message>` with icon `pi-check-circle`, title `assetActive` (no description) | |
| 14.3 | Open an asset with status `in-pm` | Banner shows success `<p-message>` with title `assetActive` (reuses active copy) | |
| 14.4 | Open an asset with status `under-service` | Banner shows warn `<p-message>` with title `assetUnderService` and description `assetUnderServiceDesc` | |
| 14.5 | Open an asset with status `decommissioned` | Banner shows error `<p-message>` with icon `pi-ban`, title `assetDecommissioned` (no description) | |
| 14.6 | Verify the banner is not closable | All `<p-message>` instances have `closable="false"` | |

---

## 15. General Information Section (Tab 0, Ordinal 1)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | Verify the section heading | Section title shows `generalInformation` with ordinal "1" | |
| 15.2 | Verify the layout: 2/3 left fields + 1/3 right photo | Two-column layout with form fields on left and "Asset Photo" card on right | |
| 15.3 | Verify the "Asset Photo" card header is hardcoded English | Card header reads "Asset Photo" (not translated) | |
| 15.4 | Verify the photo uploader in edit mode | A `<bifi-app-form-uploader>` with basic `p-fileUpload` (single, `image/*`, max 100MB) is shown with "Choose photo" / "Replace photo" labels (hardcoded) | |
| 15.5 | Click the uploaded photo | Opens the Asset Image Dialog (`<bifi-app-asset-roster-image-dialog>`) | |
| 15.6 | Verify keyboard accessibility of photo click | Enter/Space on the photo also opens the image dialog (`keyup.enter`/`keyup.space`) | |
| 15.7 | Verify fields shown for `serialized` device type | Visible: Serial Number, Type, Make, Product Model, Acquired Date, Condition (optional), Vendor, Location (label hardcoded "Location"), Warranty Date | |
| 15.8 | Verify fields shown for `non-serialized` device type | Visible: Description, Type, Make, Quantity, Acquired Date, Condition, Vendor, Warranty Date + Location Distribution card | |
| 15.9 | Verify fields shown for `software` device type | Visible: Description, Type, Make, Acquired Date, Support End Date + Software Configuration card | |
| 15.10 | Verify the Vendor p-select has a "navigate-to-create" footer | A `<bifi-app-form-select-navigate-footer>` is present allowing inline creation by navigating to `/contacts/create` | |
| 15.11 | Verify the Location p-select has a "navigate-to-create" footer | Footer allows navigating to `/settings/asset-roster/rooms/create` for inline creation | |

---

## 16. General Information — Location Distribution (Non-Serialized)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | Switch an asset to `non-serialized` (or open one) | A "Location Distribution" card appears with stats Total / Assigned / Unassigned (hardcoded English labels) | |
| 16.2 | Verify assigned-quantity minimum | The `assignedQuantity` input has `min=0` | |
| 16.3 | Verify the "+ Add Location" button (edit mode only) | Button with hardcoded "+ Add Location" label adds a new empty location row | |
| 16.4 | Verify the remove button on each row | Each row has a remove button that calls `removeLocation(index)` | |
| 16.5 | Verify the "Error" warning when total < assigned | Red text: "Error: Total quantity cannot be less than the total assigned quantity." appears (hardcoded) | |
| 16.6 | Verify the "Warning" when total > assigned | Orange text: "Warning: Total quantity is greater than assigned quantity." appears (hardcoded) | |
| 16.7 | Verify the "No locations assigned." empty state in view mode | When no location assignments, italic "No locations assigned." is shown (hardcoded) | |
| 16.8 | Verify the duplicate-location exclusion in dropdown | `getAvailableRoomOptions(currentIndex)` excludes locations already chosen by other rows (minus own) | |

---

## 17. General Information — Software Configuration (Software Device Type)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Switch an asset to `software` (or open one) | A "Software Configuration" card appears (hardcoded header) | |
| 17.2 | Verify all 8 sub-fields | Regulatory Classification (select), Version (text), License Type (select), Parent Asset ID (select, clearable), UDI-DI (text, optional), FDA/MDR Class (select, clearable), License Key (text, optional), preventAutoUpdate toggle | |
| 17.3 | Verify all field labels are hardcoded English | All 8 labels are hardcoded English (i18n violation) — document behaviour | |
| 17.4 | Verify the preventAutoUpdate toggle label | Label reads "Do not patch (Prevent Auto Update)" (hardcoded) | |

---

## 18. Documents Section (Tab 0, Ordinal 2)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Verify the section heading | Section title `documents` with ordinal "2" | |
| 18.2 | Verify "Add Document" button in edit mode | Button `addDocument` (`pi-plus`) visible only in edit mode | |
| 18.3 | Click "Add Document" | Opens the `AssetRosterDocumentDialog` (Add Document Dialog) | |
| 18.4 | Verify the edit-mode helper text | Italic `clickAddDocumentToUpload` shown when no documents | |
| 18.5 | Verify the view-mode empty state | Italic `noDocumentsUploaded` shown when no documents in view mode | |
| 18.6 | Add a document via the dialog, confirm | New attachment row appears with the file name | |
| 18.7 | Click the "View" button on a document | `fileResolver.downloadFileInBrowser` triggers a download (document actual browser behaviour) | |
| 18.8 | Click the red remove (trash) icon in edit mode | Document is removed from the FormArray | |
| 18.9 | Verify the AI Assistant textarea | Edit mode shows a textarea bound to `aiquestion` with placeholder `askQuestionsAboutDocument` | |
| 18.10 | Type a question and click "Ask Gemini" | Loading state set; `crudAssetRoster.readDocuments(files, question)` POSTs to `/api/asset-rosters/read-documents`; response appears in an info `<p-message>` prefixed `aiAssistant:` | |
| 18.11 | Verify the AI response is shown verbatim | The `aiResponse` object is interpolated directly into a font-medium div — document actual rendering | |

---

## 19. Maintenance Service Section (Tab 0, Ordinal 3) — PM State Machine

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | Open an asset that has never been commissioned | PM Schedule status shows `not-commissioned` (orange `assetAwaitingCommissioningStatus`); "Initiate PM" and "Skip PM" buttons disabled | |
| 19.2 | Open an asset with status `decommissioned` | PM Schedule status shows `decommissioned` (red `assetDecommissionedStatus`); PM buttons disabled | |
| 19.3 | Open an asset commissioned but with no maintenance window set | PM Schedule status shows `not-scheduled` (orange `noActivePmSchedule`); PM buttons disabled | |
| 19.4 | Open an asset under service | PM Schedule status shows `under-service` (orange `cannotInitiatePmUnderService`); PM buttons disabled | |
| 19.5 | Open a commissioned, scheduled asset due for PM | PM Schedule status shows `available` (green `pmDueOn {{ maintenanceDate }}. ...`); "Initiate PM" enabled | |
| 19.6 | Open an asset with active PM (`in-pm`) | PM Schedule status shows `in-progress` (blue `pmInProgressInitiatedOn {{ dateStart }}`); "Finish PM" button visible | |
| 19.7 | Open an asset with finished PM in the past | PM Schedule status shows `finished` (plain `nextScheduledPm {{ maintenanceDate }}`) | |
| 19.8 | Verify Maintenance Window + First PM Date are locked once PM is logged | When `maintenanceWindowIds` already set and a PM has been logged, both `maintenanceWindowIds` and `maintenanceDate` are disabled with orange hint `cannotChangePmLogged` ("Cannot change: PM has been logged for this schedule." hardcoded) | |

---

## 20. Maintenance Service Section — PM Actions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | Click "Initiate PM" on an available asset | POSTs a new `CrudAssetMaintenances` record (`type:'preventive-maintenance'`, `dateStart: now`); toast "PM initiated successfully" (hardcoded); asset reloads | |
| 20.2 | Click "Skip PM" on an available asset | Opens the Skip Maintenance Dialog (`<bifi-app-asset-skip-maintenance-form-dialog>`) | |
| 20.3 | Click "Finish PM" on an in-progress asset | Opens the Finish PM Dialog (`<bifi-app-asset-finish-maintenance-form-dialog #finishPM>`) | |
| 20.4 | Verify the Service card shows "Initiate Service" when nothing is active | `canStartService()` returns true → warn "Initiate Service" button visible | |
| 20.5 | Click "Initiate Service" | Opens the Service Dialog (`<bifi-app-asset-maintenance-form-dialog>`) | |
| 20.6 | Verify the Service card shows "Finish Service" when service active | Shows `serviceInProgress` text + warn "Finish Service" button | |
| 20.7 | Click "Finish Service" | Opens the Finish Service Dialog (`<bifi-app-asset-finish-maintenance-form-dialog #finishService>`) | |
| 20.8 | Verify "cannot initiate service pm in progress" message | When PM is active, the service card shows orange `cannotInitiateServicePmInProgress` text | |

---

## 21. Commissioning Lifecycle Section (Tab 0, Ordinal 4)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 21.1 | Open an asset never commissioned | Section shows a success button labelled `commission` — click opens Commissioning Dialog | |
| 21.2 | Open an asset whose commission `outcome === 'fail'` | Section shows a warn button labelled `reAttemptCommission` — click opens Commissioning Dialog | |
| 21.3 | Open an asset with commission `outcome === 'pass'` | Section shows a danger button labelled `decommission` — click opens Decommissioning Dialog | |
| 21.4 | Verify successful commission unlocks PM section | After commission pass, the Maintenance Service Section becomes actionable (interval selector enabled) | |

---

## 22. Activity History Section (Tab 0, Ordinal 5)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 22.1 | Verify the section heading | Section title with ordinal "5" | |
| 22.2 | Verify empty state | When no histories, `noHistoryRecorded` italic text shown | |
| 22.3 | Verify the "Export CSV" button top-right | Button `exportCsv` (`pi-download`) visible, gated by `activity-history/export:read:model` permission | |
| 22.4 | Verify each history card shows title, badge, dates, cost, user, details | A `<p-tag>` with severity from `getBadgeVariant`: commissioned=success, commission failed=warn, decommissioned=danger, else info. Maintenance-type events show `initiated/finished/cost`; all events show `loggedBy`/`performed`/`details` | |
| 22.5 | Click "Export CSV" | Triggers `crudActivityHistories.exportCSV(assetRoster._id)` (document download behaviour) | |
| 22.6 | Verify "View: <attachment>" button when history has attachments and title ≠ "Decommissioned" | Button visible that downloads the first attachment on click | |
| 22.7 | Verify "Add Attachment" button when history has no attachments and title ≠ "Decommissioned" and `isNotValidForAttachmentAdding` returns false (i.e. it's a maintenance/commissioning event) | Button `addAttachment` opens the `AssetRosterActiviyHistoryAddFileDialog` | |
| 22.8 | Verify the "no attachment available" message when title === "Decommissioned" or it's a roster-level event | Italic `noAttachmentAvailable` shown | |

---

## 23. Activity History Add File Dialog

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 23.1 | Click "Add Attachment" on a maintenance history | Dialog opens with header `Add File to Maintenance: {{ model.name }}` (hardcoded English) | |
| 23.2 | Click "Add Attachment" on a commissioning history | Dialog opens with header `Add File to commissioning from asset: {{ assetRosterId.productModel }}` (hardcoded English) | |
| 23.3 | Open the dialog with no `activityHistoryDocument` | Header reads "Add File" (hardcoded English fallback) | |
| 23.4 | Verify the file uploader | Single file, `accept="application/*"`, 100MB max via `<p-fileUpload>` | |
| 23.5 | Verify save button label `addFile` and cancel `cancel` | Form actions present | |
| 23.6 | Submit a file on a maintenance event | `CrudAssetMaintenances.put({data:{attachments: file}})` is called; dialog closes; context `handleActivityHistoryAddFile` reloads activity history | |
| 23.7 | Submit a file on a commissioning event | `CrudAssetCommissioning.put({data:{attachments: file}})` is called; dialog closes; activity history reloads | |
| 23.8 | Click Cancel/close | Dialog closes without uploading | |

---

## 24. Notes Section (Tab 0, Ordinal 2 — collision)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 24.1 | Verify the section ordinal | Section renders with ordinal **2** (note: collides with Documents Section — document behaviour) | |
| 24.2 | Verify the textarea + "Add Note" button in edit mode | Textarea (placeholder `enterNote`) and secondary "Add Note" button (`addNote`, `pi-plus`) visible | |
| 24.3 | Type a note and click "Add Note" | `formService.addRemark(text, currentUser())` adds the remark; textarea clears; `remarksVersion` bumps | |
| 24.4 | Verify the latest note displays as an info `<p-message>` | Latest remark shows with footer "createdBy `<name>`, `<performDate | localeDate>`" | |
| 24.5 | Verify the "Show Previous Notes" / "Hide Previous Notes" toggle | When more than 1 note exists, button toggles older notes section (`showPreviousNotes` / `hidePreviousNotes` with chevron icons) | |
| 24.6 | Verify older notes show as secondary `<p-message>` | Each older note rendered with severity secondary when expanded | |
| 24.7 | Verify the getUserName bug | `getUserName(userId)` only ever returns the **current user's** contact name regardless of which user authored the note — document behaviour | |

---

## 25. Financial Information Section (Tab 1)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 25.1 | Switch to the Lifecycle / TCO tab | Financial Information Section visible with three stacked cards | |
| 25.2 | Verify Card 1 — "Financial Information & Lifecycle" (ordinal 1) | Fields: Commissioned Date, Price Paid (optional), Current Price (optional), Current Value (est. computed read-only), Estimated Economic Life Years, Remaining Economic Life Years (computed) | |
| 25.3 | Verify Current Value calculation | `depreciationResults().currentBookValue` rendered with `currency:'USD'` or italic `notSet` when invalid | |
| 25.4 | Verify "calculatedFromDepreciation" helper text | Helper text under Current Value field is shown | |
| 25.5 | Verify "yrs" hardcoded suffix | Remaining Economic Life Years renders as `{{ remainingYears | number:'1.1-1' }} yrs` (hardcoded "yrs" — i18n violation) | |
| 25.6 | Verify Card 2 — "Depreciation Calculator" (ordinal 2) | Fields: Depreciation Method (p-select with `straightLine`/`acceleratedDecliningBalance`), Salvage Value, Acceleration Factor (only when method is accelerated) | |
| 25.7 | Select "Accelerated Declining Balance" method | Acceleration Factor field appears (inputnumber min 100 max 400) | |
| 25.8 | Verify the results panel — valid state | Three currency boxes: `currentBookValue`, `annualDepreciation`, `accumulatedDepreciation` | |
| 25.9 | Verify the results panel — invalid state | Italic `ensurePriceAndLifeSet` shown when no price/life set | |
| 25.10 | Verify Card 3 — "Total Cost of Ownership" (custom h3, no form-section) | Shows total maintenance spend description, range buttons, service/PM toggle, chart type buttons, and the chart | |
| 25.11 | Verify the TCO range buttons | 7 buttons: "1W", "1M", "3M", "6M", "YTD", "1Y", "All" (hardcoded labels — i18n violation) | |
| 25.12 | Click each range button | `selectedTcoRange` updates and the chart data is re-filtered by `getCutoff(range)` | |
| 25.13 | Toggle the "Service" cost visibility button | `showServiceCost` flips; orange service dataset appears/disappears from the chart | |
| 25.14 | Toggle the "PM" cost visibility button | `showPmCost` flips; green PM dataset appears/disappears | |
| 25.15 | Toggle the chart type between Bar and Line | `chartType` switches; `<p-chart>` re-renders | |
| 25.16 | Toggle "Stacked" (only visible for bar) | `stackedBars` flips; chart stacks/unstacks | |
| 25.17 | Verify the empty chart state | When no maintenance cost data: `pi-file` icon + `maintenanceCostOverTime` heading + `noMaintenanceCostData` text | |
| 25.18 | Verify "Total maintenance spend (period)" footer | Shows `totalMaintenanceSpendPeriod` label + computed total | |
| 25.19 | Verify currency formatting | Chart tooltips use `'en-US'` / `'USD'` (hardcoded locale/currency — i18n violation) | |

---

## 26. Asset Image Dialog (Photo Viewer)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 26.1 | In edit mode, click the photo thumbnail | The image dialog opens showing the uploaded photo full-size | |
| 26.2 | Verify the dialog has no header and no modal style | The `<p-dialog>` is bare (no `header`, no `modal`, no size class) — document actual behaviour | |
| 26.3 | Verify the dialog shows the photo's object URL | `<img [src]="uploadedFile()?.url">` renders the resolved file | |
| 26.4 | Close the dialog | Dialog closes; photo control unchanged | |
| 26.5 | Open when no photo is set | Image dialog opens with no image / broken `src` — document behaviour | |

---

## 27. Add Document Dialog

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 27.1 | Open the Add Document dialog | `p-dialog` with header `addNewDocument`, modal, max-w-md | |
| 27.2 | Verify the Document Descriptor dropdown options | Hardcoded English: "Technical Manual", "User Manual", "Purchase Invoice", "Training Material", "Safety Instructions", "Other" | |
| 27.3 | Select "Other" descriptor | A new "Description for Other" input appears (bound to `descriptor` control, placeholder `egWarrantyCard`) | |
| 27.4 | Select a non-"Other" descriptor | The "Description for Other" input hides; the `descriptor` control is patched with the selected value | |
| 27.5 | Verify the file uploader | Single file, `accept="application/*"`, 100MB max | |
| 27.6 | Upload a file and submit | `submitted` emits `addDocumentFormModel`; dialog closes; parent `handleDocumentAdded` adds to `attachments` + `attachmentsMetadata` FormArrays | |
| 27.7 | Click Cancel | Dialog closes without emitting | |

---

## 28. Save / Cancel / Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 28.1 | With a dirty form, click "Cancel" | Calls `handleCancel()` (delegates to context) — document actual behaviour (clears dirtiness? reverts?) | |
| 28.2 | With a dirty form, click "Save" | POSTs/PUTs filtered payload; on success toasts "Asset updated successfully" (hardcoded), emits `'saved'`, reloads asset, marks form pristine | |
| 28.3 | Verify save strips empty remarks | Remarks with empty trimmed string are removed before save | |
| 28.4 | Verify save strips empty location assignments | Rows with no `locationId` or `assignedQuantity <= 0` are removed before save | |
| 28.5 | Verify save wraps single-element ID arrays | `assetTypeIds`, `makeIds`, `vendorIds`, `maintenanceWindowIds` are wrapped into single-element arrays | |
| 28.6 | Verify save ISO-converts dates | `acquiredDate`, `warrantyDate`, `supportEndDate`, `maintenanceDate`, `commissionedDate` are ISO-converted if present | |
| 28.7 | Verify `fileFields=['photo']` is sent | The PUT includes photo as a file field | |
| 28.8 | Click "Previous Asset" chevron with a dirty form | `confirmDiscardUnsavedChanges()` runs; if dirty (not submitLoading), a `window.confirm` "You have unsaved changes on this asset. Leaving will discard them. Continue?" (hardcoded English) appears | |
| 28.9 | Click "Next Asset" chevron while `submitLoading` is true | Toast "Please wait — your changes are still being saved." (hardcoded) appears; navigation blocked | |
| 28.10 | Click "Back to Dashboard" with a dirty form | Same `confirmDiscardUnsavedChanges` confirmation appears | |
| 28.11 | Navigate to a sibling route while dirty (`DirtyFormGuard`) | The route's `DirtyFormGuard` triggers a confirmation dialog (translation key `confirmDialog.unsavedChanges`) with Discard/Cancel | |
| 28.12 | Verify draft restore on navigation | `DraftService` rehydrates unsaved data when returning to a URL with a saved draft — document behaviour | |

---

## 29. Import / Export CSV

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 29.1 | Click "Import CSV" | A hidden file input opens the file picker (accept=".csv") | |
| 29.2 | Select a CSV file | File is read; `crudAssetRoster.post({data:{csv}, specificEndpoint:'import'})` fires; list + counts reload on success | |
| 29.3 | Verify the file input is reset after import | Subsequent imports can pick the same filename again (input value reset) | |
| 29.4 | Click "Export CSV" | `crudAssetRoster.exportCSV()` downloads a CSV of the current filtered list — document download behaviour | |
| 29.5 | Import an invalid CSV file | Document error behaviour (toast/400) | |

---

## 30. Reporting Download

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 30.1 | Click the Reporting button | Opens `<bifi-app-reporting-download-dialog [model]="'AssetRoster'">` | |
| 30.2 | Verify the button is disabled when no reporting templates exist | Tooltip `configureReportTemplate` shown when no templates available | |
| 30.3 | Submit a report download | Document actual behaviour (file generated) | |

---

## 31. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 31.1 | Verify the list route is guarded by `permissionGuard` | A user without `asset-rosters/list` permission cannot access the dashboard | |
| 31.2 | Verify the maintenance route is guarded | A user without `asset-rosters/update` permission cannot access `/asset-roster/equipment/maintenance/:id` | |
| 31.3 | Verify the "Add New Asset" button is permission-gated | Hidden for users without `asset-rosters:create:model` | |
| 31.4 | Verify the "Import CSV" button is permission-gated | Hidden for users without `asset-rosters/import:create:model` | |
| 31.5 | Verify the "Export CSV" button is permission-gated | Hidden for users without `asset-rosters/export:read:model` | |
| 31.6 | Verify the Reporting button is permission-gated | Hidden for users without `reporting/generate-report:read:model` | |
| 31.7 | Verify table row clicks are permission-gated | Rows not clickable for users without `asset-rosters/update:view` (via `clickRowPermission`) | |
| 31.8 | Verify the "View Details" tag is permission-gated | Hidden for users without `asset-rosters/update:view` | |
| 31.9 | Verify the Save button is permission-gated | Hidden for users without `asset-rosters:update:model` | |
| 31.10 | Verify the Activity History Export CSV button is permission-gated | Hidden for users without `activity-history/export:read:model` | |

---

## 32. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 32.1 | Create a serialized asset with the maximum-length serial number (255+ chars) | Document behaviour (accepted/truncated/rejected) | |
| 32.2 | Create an asset with `quantity = 0` (non-serialized) | Document behaviour (validators allow since quantity is optional) | |
| 32.3 | In software config, set `accelerationFactor` outside 100-400 range | Document behaviour (validator behaviour) | |
| 32.4 | Set `estimatedEconomicLifeYears` to 0 | Depreciation results should be invalid (`life === 0`) — document behaviour | |
| 32.5 | Set `acquiredPrice` and `currentPrice` both to 0 | Depreciation uses `acquiredPrice` if > 0 else `currentPrice`; both 0 → invalid — document behaviour | |
| 32.6 | Create an asset, immediately navigate to its maintenance page | Edit form pre-fills all saved fields via `resetValueToInitialState` | |
| 32.7 | Rapidly click Save on the maintenance page | Only one PUT fires; `isSubmitLoading` blocks duplicate clicks | |
| 32.8 | Create an asset with no asset type and no make (using "Other" with empty names) | Validation fails (`createdType.name` and `createdMake.oemName` required) — document behaviour | |
| 32.9 | Open an asset at the end of the list and click "Next" | Next button is disabled (boundary) | |
| 32.10 | Open the first asset and click "Previous" | Previous button is disabled (boundary) | |
| 32.11 | Upload a photo larger than 100MB in the form uploader | File rejected by `maxFileSize=100000000` — document behaviour | |

---

## 33. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 33.1 | Verify the dashboard heading uses translation | "Asset Dashboard" via key `assetDashboard` | |
| 33.2 | Verify the "Add New Asset" button label uses translation | `addNewAsset` | |
| 33.3 | Verify the Import/Export button labels | `importCsv` / `exportCsv` | |
| 33.4 | Verify the "Reporting" button label | `reporting` | |
| 33.5 | Verify the search bar placeholder | `searchAssets` | |
| 33.6 | Verify the status select placeholder | `filterByStatus` | |
| 33.7 | Verify the maintenance page title | `assetDetails` | |
| 33.8 | Verify the tab labels | `infoMaintenance` and `lifecycleTco` | |
| 33.9 | Verify the "Back to Dashboard" button label | `backToDashboard` | |
| 33.10 | Verify the Save button labels | `save` / `saving` / `saveChanges` | |
| 33.11 | Verify the column headers use translation (scope `asset-roster`) | All column titles are translation keys resolved with scope `asset-roster` | |
| 33.12 | Verify the 5 status card labels | `underService`, `overdue`, `due`, `inPm`, `pmNotSet` | |
| 33.13 | Verify the status select options | All 9 status keys translated via scope `asset-roster` | |
| 33.14 | Verify the deprecated "of" hardcoded in the counter | "{{ currentIndex + 1 }} of {{ totalAssets }}" — hardcoded "of" (i18n violation) | |
| 33.15 | Verify hardcoded "Asset Photo" card header | Not translated — i18n violation | |
| 33.16 | Verify hardcoded "Location" field label | Not translated — i18n violation (route label says "Location" but translation key elsewhere uses different label) | |
| 33.17 | Verify hardcoded "+ Add Location" / "No locations assigned." / "Total:" / "Assigned:" / "Unassigned:" | All hardcoded English — i18n violations | |
| 33.18 | Verify "Software Configuration" card + all 8 field labels + toggle label | All hardcoded English — i18n violations | |
| 33.19 | Verify "yrs" hardcoded suffix in financial section | Not translated — i18n violation | |
| 33.20 | Verify TCO range buttons ("1W", "1M", etc.) hardcoded | Not translated — i18n violation | |
| 33.21 | Verify the Add Document descriptor options hardcoded English | "Technical Manual", "User Manual", "Purchase Invoice", "Training Material", "Safety Instructions", "Other" — i18n violations | |
| 33.22 | Verify the Activity History Add File dialog header is hardcoded English | "Add File", "Add File to Maintenance: ...", "Add File to commissioning from asset: ..." — i18n violations | |
| 33.23 | Verify toast/notification messages hardcoded English | "PM initiated successfully", "Asset updated successfully", "Please wait — your changes are still being saved." — i18n violations | |
| 33.24 | Verify the `window.confirm` "You have unsaved changes..." message is hardcoded English | i18n violation | |
| 33.25 | Verify the status tag in grid view uses hardcoded transformation `status.replace('-', ' ')` | Not translated — i18n violation | |
| 33.26 | Verify "Unnamed" fallback in parent asset options is hardcoded English | i18n violation | |
| 33.27 | Verify "Not set" fallback for asset type in grid cards is hardcoded English | i18n violation | |
| 33.28 | Switch the app language to Spanish | Document actual translation coverage — verify which keys translate and which hardcoded strings remain English | |

---

## 34. Integration with Sibling Sub-Modules

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 34.1 | Verify the maintenance page hosts dialogs from `asset-commissioning` | `<bifi-app-asset-commissioning-form-dialog>` and `<bifi-app-asset-decommissioning-form-dialog>` load successfully | |
| 34.2 | Verify the maintenance page hosts dialogs from `asset-maintenances` | `<bifi-app-asset-maintenance-form-dialog>`, `<bifi-app-asset-finish-maintenance-form-dialog>` (×2: service & PM), and `<bifi-app-asset-skip-maintenance-form-dialog>` load successfully | |
| 34.3 | Open an awaiting-commissioning asset and complete commissioning via the dialog | Asset status transitions from `awaiting-commissioning` to `active` (pass) or stays + shows re-attempt (fail) — verify list and banner update | |
| 34.4 | Initiate a service maintenance from the maintenance page | A service maintenance record is created and reflected in the Activity History section | |
| 34.5 | Initiate a PM from the maintenance page | A preventive-maintenance record is created; status transitions to `in-pm`; status card counts update | |
| 34.6 | Verify the maintenance page uses `Asset Roster Maintenance Context` to coordinate cross-component events | Saved events from any section trigger list + counts reload | |
| 34.7 | Verify the General Information section's Vendor dropdown can navigate to `/contacts/create` to create a new contact inline | Navigate-to-create footer works cross-module | |
| 34.8 | Verify the General Information section's Location dropdown can navigate to `/settings/asset-roster/rooms/create` | Navigate-to-create footer works cross-module | |
| 34.9 | Verify the Maintenance Service section depends on `maintenance-windows` module | Maintenance window dropdown lists records from `CrudMaintenanceWindows`; selecting one computes `minMaintenanceDate`/`maxMaintenanceDate` | |
| 34.10 | Verify the Financial Information section depends on `asset-maintenances` module | Service and PM cost datasets are read from `CrudAssetMaintenances` filtered by `assetRosterId` and `type` | |