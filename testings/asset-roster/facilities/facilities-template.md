# Facilities Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The facilities module is a **Settings-style dual-entity CRUD module** within the asset-roster library at `/settings/asset-roster/facilities/` and `/settings/asset-roster/rooms/`. It manages physical locations (Facilities) and their sub-locations (Rooms). Rooms link to a parent Facility via `facilityId`.
>
> **Pre-requisites:**
> - The logged-in user has `facilities/list`, `facilities/create`, `facilities/update`, `rooms/list`, `rooms/create`, and `rooms/update` permissions.
> - At least one facility record exists for edit/delete/room-creation tests (create one first if the list is empty).
> - At least one contact of type "Company" should exist for the `contactId` picker on the facility form.
>
> **Known issues (pre-existing):**
> - The `address` column in `room-columns.ts` has `type: 'number'` instead of `type: 'text'` — filtering may behave unexpectedly.
> - The room column title for `name` uses translation key `facilityName` (same as facility name column) instead of a room-specific key.
> - `RoomsForm` template has a stray `]` character on the first line.
> - `handleFacilityCreation()` in `RoomsForm` is an empty stub method.

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/settings/asset-roster/facilities` | Facilities list page loads at `/settings/asset-roster/facilities/list` | |
| 1.2 | Verify the page heading | Heading shows "Facilities" (translation key `facilities`, scope `asset-roster`) | |
| 1.3 | Verify the "Add New" button is shown | Button with label "Add New Facility" (translation key `addNewFacility`, scope `asset-roster`) is visible, gated by `facilities/create:view` permission | |
| 1.4 | Click the "Add New" button | Navigates to the create form at `/settings/asset-roster/facilities/create` | |
| 1.5 | Navigate to `/settings/asset-roster/rooms` | Rooms list page loads at `/settings/asset-roster/rooms/list` | |
| 1.6 | Verify the Rooms page heading | Heading shows "Rooms" (translation key `rooms`, scope `asset-roster`) | |
| 1.7 | Verify the "Add New" button for Rooms | Button with label "Add New Room" (translation key `addNewRoom`, scope `asset-roster`) is visible, gated by `rooms/create:view` permission | |
| 1.8 | Click the "Add New Room" button | Navigates to Room create form at `/settings/asset-roster/rooms/create` | |

---

## 2. Facilities List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the table columns | Table shows columns: Name (translation key `facilityName`), Related Contact (translation key `relatedToContact`), Rooms (translation key `rooms`) | |
| 2.2 | List has facility records | Each row shows the facility name, linked contact name (or empty), and room count/names | |
| 2.3 | List is empty (no records) | "No records found" or empty state message is shown | |
| 2.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | |
| 2.5 | Click a row in the table | Navigates to the edit form for that facility (`/settings/asset-roster/facilities/edit/:id`), gated by `facilities/update:view` permission | |
| 2.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the facility from the list | |
| 2.7 | Verify the search bar | Search bar is shown with label "Search by name, contact" (translation key `searchByNameContact`, scope `asset-roster`) | |

---

## 3. Facilities Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Type a name in the search bar | List filters to matching facilities in real time (filter field: `name`) | |
| 3.2 | Type a contact name in the search bar | Matching facilities appear (filter field: `contactId.name`) | |
| 3.3 | Search with no matches | Empty state displayed; no error | |
| 3.4 | Clear the search field | Full facility list reloads | |

---

## 4. Create Facility — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Navigate to the create form | Form loads with title "Create Facility" (translation key `createFacility`, scope `asset-roster`) | |
| 4.2 | Verify the form fields | Name field (text input, required) and Responsible Contact field (p-select dropdown, optional) are shown | |
| 4.3 | Verify the form section | A section titled "General Information" (translation key `generalInformation`, scope `asset-roster`) is shown | |
| 4.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | |
| 4.5 | Click Save without filling any fields | Validation error shown on the Name field ("This field is required"); form does not submit | |
| 4.6 | Fill Name with whitespace only, click Save | Validation error or document actual behaviour | |

---

## 5. Create Facility — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Enter Name "Test Facility", leave Contact empty, click Save | Facility created; redirected to the list | |
| 5.2 | Verify the new facility appears in the list | The newly created "Test Facility" shows in the list with no contact | |
| 5.3 | Enter Name "Main Campus" and select a Contact, click Save | Facility created with both values preserved | |
| 5.4 | Verify the saved record shows the contact | The list row shows "Main Campus" and the selected contact's name | |

---

## 6. Edit Facility

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Click a row in the list to open the edit form | Edit form loads with title "Update Facility" (translation key `updateFacility`, scope `asset-roster`) | |
| 6.2 | Verify all saved fields are pre-filled | Name and Responsible Contact fields show the existing values | |
| 6.3 | Change the Name and click Save | Updated name appears in the list | |
| 6.4 | Change the Responsible Contact and click Save | Updated contact appears in the list | |
| 6.5 | Clear the Name field (required) and click Save | Validation error shown; record not saved | |
| 6.6 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed | |
| 6.7 | Remove the selected Contact (clear the p-select) and save | Contact cleared successfully (check for `showClear` support on p-select) — document actual behaviour | |

---

## 7. Delete Facility

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click the delete action on a facility with no rooms, confirm the deletion | Facility removed from the list | |
| 7.2 | Cancel the delete confirmation | Facility is NOT deleted; remains in the list | |
| 7.3 | Delete a facility that has associated rooms | System either prevents deletion with a message or deletes and leaves orphaned rooms — document actual behaviour | |

---

## 8. Facility Rooms Preview (Sub-Table)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | On the facility edit form, scroll to the Rooms section | A section titled "Rooms Preview" (translation key `roomsPreview`, scope `asset-roster`) with a read-only table is shown | |
| 8.2 | Verify the rooms preview table columns | Table shows Room columns: Name, Code, Address, Facility | |
| 8.3 | The preview shows rooms linked to this facility | Existing rooms for the facility appear in the preview table | |
| 8.4 | Facility with no rooms shows empty state | "No rooms" fallback message is shown (translation key `status.fallback.noRooms`, scope `asset-roster`) | |

---

## 9. Rooms List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Verify the Rooms table columns | Table shows columns: Name (translation key `facilityName`), Code (translation key `code`), Address (translation key `address`), Facility (translation key `facility`) | |
| 9.2 | List has room records | Each row shows name, code, address, and parent facility name | |
| 9.3 | List is empty (no records) | "No records found" or empty state message is shown | |
| 9.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | |
| 9.5 | Click a row in the table | Navigates to the Room edit form (`/settings/asset-roster/rooms/edit/:id`), gated by `rooms/update:view` permission | |
| 9.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the room from the list | |
| 9.7 | Verify the Rooms search bar | Search bar is shown with label "Search by name, code, facility" (translation key `searchByNameCodeFacility`, scope `asset-roster`) | |

---

## 10. Rooms Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Type a room name in the search bar | List filters to matching rooms in real time (filter field: `name`) | |
| 10.2 | Type a room code in the search bar | Matching rooms appear (filter field: `code`) | |
| 10.3 | Type an address keyword in the search bar | Matching rooms appear (filter field: `address`) | |
| 10.4 | Type a facility name in the search bar | Rooms belonging to that facility appear (filter field: `facilityId.name`) | |
| 10.5 | Search with no matches | Empty state displayed; no error | |
| 10.6 | Clear the search field | Full room list reloads | |

---

## 11. Create Room — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Navigate to the Room create form | Form loads with title "Create Room" (translation key `createRoom`, scope `asset-roster`) | |
| 11.2 | Verify the form fields | Name (text), Code (text), Address/Location (text), Facility (p-select dropdown) — all marked as required | |
| 11.3 | Verify the form section | A section titled "General Information" (translation key `generalInformation`, scope `asset-roster`) is shown | |
| 11.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | |
| 11.5 | Click Save without filling any fields | Validation errors shown on all four required fields (Name, Code, Address, Facility); form does not submit | |
| 11.6 | Fill Name only, click Save | Validation errors still shown on Code, Address, and Facility | |

---

## 12. Create Room — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Fill all fields (Name "Lab A", Code "LAB-001", Address "First Floor", Facility select a facility), click Save | Room created; redirected to the list | |
| 12.2 | Verify the new room appears in the list | The newly created room shows with correct name, code, address, and linked facility | |
| 12.3 | Verify the linked facility's Rooms Preview shows the new room | Navigate to the facility edit form; the Rooms Preview section shows the new room | |

---

## 13. Edit Room

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Click a row in the Rooms list to open the edit form | Edit form loads with title "Update Room" (translation key `updateRoom`, scope `asset-roster`) | |
| 13.2 | Verify all saved fields are pre-filled | Name, Code, Address, and Facility fields show the existing values | |
| 13.3 | Change the Name and click Save | Updated name appears in the list | |
| 13.4 | Change the Code and click Save | Updated code appears in the list | |
| 13.5 | Change the Facility and click Save | Updated facility appears in the list | |
| 13.6 | Change the Address and click Save | Updated address appears in the list | |
| 13.7 | Clear a required field (e.g. Name) and click Save | Validation error shown; record not saved | |
| 13.8 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed | |

---

## 14. Room Facility Picker (Cross-Form Navigation)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | Open the Room create form, click the Facility dropdown | The dropdown shows available facilities with an "Other facility +" option at the bottom (via `bifi-app-form-select-navigate-footer`) | |
| 14.2 | Click "Other facility +" in the Facility dropdown | Navigates to the Facility create form at `/settings/asset-roster/facilities/create` with query params for return navigation (`returnUrl` and `controlName`) | |
| 14.3 | On the Facility create form, fill Name and save | Facility is created and the page navigates back to the Room form; the Room form retains the draft data entered before navigating away | |
| 14.4 | After returning from Facility creation, verify the Facility dropdown | The dropdown now shows the newly created facility pre-selected in the Facility field | |

---

## 15. Dirty Form Guard (Rooms)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | On the Room create form, fill some fields but do not save | The form becomes dirty | |
| 15.2 | Click "Go Back" or navigate away (e.g. click Settings in sidebar) | A confirmation dialog appears (translation key `confirmDialog.unsavedChanges`) with "Discard" and "Cancel" options (guarded by `DirtyFormGuard`) | |
| 15.3 | Click "Discard" in the confirmation dialog | Navigates away; form data is discarded | |
| 15.4 | Click "Cancel" in the confirmation dialog | Stays on the form; data is preserved | |
| 15.5 | On the Facility create form (no DirtyFormGuard), fill fields and navigate away | No unsaved changes dialog — navigates directly away, discarding changes (document actual behaviour) | |

---

## 16. Cancel & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | On the Facility create form, click "Go Back" | Navigates back to the Facilities list without saving | |
| 16.2 | On the Facility edit form, click "Go Back" | Navigates back to the Facilities list without saving | |
| 16.3 | On the Room create form, click "Go Back" | Navigates back to the Rooms list — unsaved changes prompt appears if form is dirty | |
| 16.4 | On the Room edit form, click "Go Back" | Navigates back to the Rooms list — unsaved changes prompt appears if form is dirty | |

---

## 17. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Verify the Facilities list route is guarded by `permissionGuard` | A user without `facilities/list` permission cannot access the list | |
| 17.2 | Verify the "Add New Facility" button is permission-gated | The button is hidden for users without `facilities/create:view` permission | |
| 17.3 | Verify the Facility create route is guarded | A user without `facilities/create` permission cannot access the create form | |
| 17.4 | Verify the Facility edit route is guarded | A user without `facilities/update` permission cannot access the edit form | |
| 17.5 | Verify Facility row clicks are permission-gated | Rows are not clickable for users without `facilities/update:view` permission | |
| 17.6 | Verify the Facility delete button is permission-gated | The delete button is hidden for users without `facilities:delete:model` permission | |
| 17.7 | Verify the Rooms list route is guarded | A user without `rooms/list` permission cannot access the rooms list | |
| 17.8 | Verify the "Add New Room" button is permission-gated | The button is hidden for users without `rooms/create:view` permission | |
| 17.9 | Verify the Room create route is guarded | A user without `rooms/create` permission cannot access the create form | |
| 17.10 | Verify the Room edit route is guarded | A user without `rooms/update` permission cannot access the edit form | |
| 17.11 | Verify Room row clicks are permission-gated | Rows are not clickable for users without `rooms/update:view` permission | |
| 17.12 | Verify the Room delete button is permission-gated | The delete button is hidden for users without `rooms:delete:model` permission | |

---

## 18. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Enter a very long Facility Name (e.g. 255+ characters) | Value is accepted or rejected — document actual behaviour | |
| 18.2 | Enter a very long Room Name | Value is accepted or rejected — document actual behaviour | |
| 18.3 | Enter a very long Room Code | Value is accepted or rejected — document actual behaviour | |
| 18.4 | Enter a very long Room Address | Value is accepted or rejected — document actual behaviour | |
| 18.5 | Create two rooms with the same code | System saves OR shows an error — document actual behaviour | |
| 18.6 | Create a facility with the same name as an existing facility | System saves OR shows an error — document actual behaviour | |
| 18.7 | Create a facility, then immediately edit it | Edit form loads with the correct pre-filled values | |
| 18.8 | Rapidly click Save on the Facility create form | Only one POST request is fired | |

---

## 19. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | Verify the Facilities list heading uses translation | Heading uses translation key `facilities` (scope `asset-roster`) | |
| 19.2 | Verify the "Add New Facility" button label uses translation | Button uses translation key `addNewFacility` (scope `asset-roster`) | |
| 19.3 | Verify the Facility create form title uses translation | Title uses translation key `createFacility` (scope `asset-roster`) | |
| 19.4 | Verify the Facility edit form title uses translation | Title uses translation key `updateFacility` (scope `asset-roster`) | |
| 19.5 | Verify the Facility search bar label uses translation | Label uses translation key `searchByNameContact` (scope `asset-roster`) | |
| 19.6 | Verify the Facility column headers use translation | Columns use keys `facilityName`, `relatedToContact`, `rooms` (scope `asset-roster`) | |
| 19.7 | Verify the Rooms list heading uses translation | Heading uses translation key `rooms` (scope `asset-roster`) | |
| 19.8 | Verify the Room column headers use translation | Columns use keys `facilityName`, `code`, `address`, `facility` (scope `asset-roster`) | |
| 19.9 | Verify the Room form title uses translation | Title uses translation key `createRoom` / `updateRoom` (scope `asset-roster`) | |
| 19.10 | Switch the app language to Spanish | All labels translate correctly — document actual behaviour | |

(End of file - total 342 lines)
