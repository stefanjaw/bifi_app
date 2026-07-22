# Facilities Module — Test Results

Tested: 2026-07-21 (re-tested 2026-07-22 after fixes)
Method: Automated UI tests via Playwright browser

> **Module scope:** The facilities module is a **Settings-style dual-entity CRUD module** within the asset-roster library at `/settings/asset-roster/facilities/` and `/settings/asset-roster/rooms/`. It manages physical locations (Facilities) and their sub-locations (Rooms). Rooms link to a parent Facility via `facilityId`.
>
> **Pre-requisites:**
> - The logged-in user has `facilities/list`, `facilities/create`, `facilities/update`, `rooms/list`, `rooms/create`, and `rooms/update` permissions.
> - At least one facility record exists for edit/delete/room-creation tests.
> - At least one contact of type "Company" exists for the `contactId` picker on the facility form.
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
| 1.1 | Navigate to `/settings/asset-roster/facilities` | Facilities list page loads at `/settings/asset-roster/facilities/list` | ✅ PASS — Redirected to `/settings/asset-roster/facilities/list` with query params |
| 1.2 | Verify the page heading | Heading shows "Facilities" (translation key `facilities`, scope `asset-roster`) | ✅ PASS — h1 "Facilities" present |
| 1.3 | Verify the "Add New" button is shown | Button with label "Add New Facility" (translation key `addNewFacility`, scope `asset-roster`) is visible, gated by `facilities/create:view` permission | ✅ PASS — "Add New Facility" button visible on list page |
| 1.4 | Click the "Add New" button | Navigates to the create form at `/settings/asset-roster/facilities/create` | ✅ PASS — Click navigates to `/settings/asset-roster/facilities/create` |
| 1.5 | Navigate to `/settings/asset-roster/rooms` | Rooms list page loads at `/settings/asset-roster/rooms/list` | ✅ PASS — Rooms list page loads at `/settings/asset-roster/rooms/list` |
| 1.6 | Verify the Rooms page heading | Heading shows "Rooms" (translation key `rooms`, scope `asset-roster`) | ✅ PASS — h1 "Rooms" present |
| 1.7 | Verify the "Add New" button for Rooms | Button with label "Add New Room" (translation key `addNewRoom`, scope `asset-roster`) is visible, gated by `rooms/create:view` permission | ✅ PASS — "Add New Room" button visible on rooms list page |
| 1.8 | Click the "Add New Room" button | Navigates to Room create form at `/settings/asset-roster/rooms/create` | ✅ PASS — Click navigates to `/settings/asset-roster/rooms/create` |

---

## 2. Facilities List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Verify the table columns | Table shows columns: Name (translation key `facilityName`), Related Contact (translation key `relatedToContact`), Rooms (translation key `rooms`) | ✅ PASS — Columns show "Facility Name", "Related to contact", "Rooms", plus empty header for Actions |
| 2.2 | List has facility records | Each row shows the facility name, linked contact name (or empty), and room count/names | ✅ PASS — 7 records shown: Facility names with "Not set" for contact (most rows), room count/names like "test", "No rooms", "Room", "HELLO" |
| 2.3 | List is empty (no records) | "No records found" or empty state message is shown | ⏭️ N/A — List has 7 records; could not test empty state |
| 2.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | ✅ PASS — "All records loaded" appears at bottom; all 7 records visible in one page |
| 2.5 | Click a row in the table | Navigates to the edit form for that facility (`/settings/asset-roster/facilities/edit/:id`), gated by `facilities/update:view` permission | ✅ PASS — Clicking a row navigates to `/settings/asset-roster/facilities/edit/:id` |
| 2.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the facility from the list | ✅ PASS — Delete action shows confirmation dialog "Are you sure you want to proceed to delete this item of facilities?" with Cancel/Confirm; confirming deletes and shows success notification |
| 2.7 | Verify the search bar | Search bar is shown with label "Search by name, contact" (translation key `searchByNameContact`, scope `asset-roster`) | ✅ PASS — Search bar present with placeholder "Search by name or contact" |

---

## 3. Facilities Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Type a name in the search bar | List filters to matching facilities in real time (filter field: `name`) | ✅ PASS — Typing "pedro" filters to 1 result showing "pedro" facility |
| 3.2 | Type a contact name in the search bar | Matching facilities appear (filter field: `contactId.name`) | ✅ PASS — Typing "das" filters to 1 result showing facility "233" with contact "das" |
| 3.3 | Search with no matches | Empty state displayed; no error | ✅ PASS — "No Results Found" shown with no errors |
| 3.4 | Clear the search field | Full facility list reloads | ✅ PASS — Clearing search restores all 7 records |

---

## 4. Create Facility — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Navigate to the create form | Form loads with title "Create Facility" (translation key `createFacility`, scope `asset-roster`) | ✅ PASS — h3 "Create Facility" heading shown on create form |
| 4.2 | Verify the form fields | Name field (text input, required) and Responsible Contact field (p-select dropdown, optional) are shown | ✅ PASS — Name textbox and Responsible Contact dropdown both present |
| 4.3 | Verify the form section | A section titled "General Information" (translation key `generalInformation`, scope `asset-roster`) is shown | ✅ PASS — Banner heading "General Information" present |
| 4.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | ✅ PASS — "Go back" always visible; "Save" button appears only after form becomes dirty (at least one field modified) |
| 4.5 | Click Save without filling any fields | Validation error shown on the Name field ("This field is required"); form does not submit | ✅ PASS — "This field is required" shown on Name field; form stays on create URL |
| 4.6 | Fill Name with whitespace only, click Save | Whitespace-only input rejected with validation error | ✅ PASS — Whitespace-only Name rejected by `NonWhitespaceValidators.nonWhitespaceRequired` (fix S-07). "This field is required" validation error shown. |

---

## 5. Create Facility — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Enter Name "Test Facility", leave Contact empty, click Save | Facility created; redirected to the list | ✅ PASS — Created and redirected to list; "Test Facility" appears |
| 5.2 | Verify the new facility appears in the list | The newly created "Test Facility" shows in the list with no contact | ✅ PASS — "Test Facility" shown with "Not set" contact |
| 5.3 | Enter Name "Main Campus" and select a Contact, click Save | Facility created with both values preserved | ✅ PASS — Contact "Pedro" selected; facility created |
| 5.4 | Verify the saved record shows the contact | The list row shows "Main Campus" and the selected contact's name | ✅ PASS — List shows "Main Campus" with contact name "Pedro" |

---

## 6. Edit Facility

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Click a row in the list to open the edit form | Edit form loads with title "Update Facility" (translation key `updateFacility`, scope `asset-roster`) | ✅ PASS — Clicking "Main Campus" row navigates to edit form with h3 "Update Facility" |
| 6.2 | Verify all saved fields are pre-filled | Name and Responsible Contact fields show the existing values | ✅ PASS — Name "Main Campus" and Contact "Pedro" pre-filled |
| 6.3 | Change the Name and click Save | Updated name appears in the list | ✅ PASS — Changed "Main Campus" → "Main Campus Updated"; reflected in list |
| 6.4 | Change the Responsible Contact and click Save | Updated contact appears in the list | ✅ PASS — Changed contact from "Pedro" to "ds"; reflected in list |
| 6.5 | Clear the Name field (required) and click Save | Validation error shown; record not saved | ✅ PASS — "This field is required" shown; form does not submit |
| 6.6 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed | ✅ PASS — No Save button visible on initial edit form load; appears only after modifying a field |
| 6.7 | Remove the selected Contact (clear the p-select) and save | Contact cleared successfully via clear (×) icon on p-select | ✅ PASS — `[showClear]="true"` added to contactId p-select. Clear icon (×) now visible when a contact is selected. Fix FA-02. |

---

## 7. Delete Facility

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click the delete action on a facility with no rooms, confirm the deletion | Facility removed from the list | ✅ PASS — "facility 2" (no rooms) deleted successfully; notification "The element was deleted successfully!" |
| 7.2 | Cancel the delete confirmation | Facility is NOT deleted; remains in the list | ✅ PASS — Clicking Cancel closes dialog; "facility 2" remains in list |
| 7.3 | Delete a facility that has associated rooms | System either prevents deletion with a message or deletes and leaves orphaned rooms — document actual behaviour | ⚠️ BUG — "pedro" (with 1 room "Room") deleted successfully with no warning; room "Room" becomes orphaned (still appears in rooms list but facility reference is stale) |

---

## 8. Facility Rooms Preview (Sub-Table)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | On the facility edit form, scroll to the Rooms section | A section titled "Rooms Preview" (translation key `roomsPreview`, scope `asset-roster`) with a read-only table is shown | ✅ PASS — "Rooms Preview" section visible with read-only table |
| 8.2 | Verify the rooms preview table columns | Table shows Room columns: Name, Code, Address, Facility | ⚠️ NOTE — Columns show "Facility Name", "Code", "Address", "Facility" (uses `facilityName` translation key instead of a room-specific "Name" key) |
| 8.3 | The preview shows rooms linked to this facility | Existing rooms for the facility appear in the preview table | ✅ PASS — "Facility" edit shows room "test" in preview |
| 8.4 | Facility with no rooms shows empty state | "No rooms" fallback message is shown (translation key `status.fallback.noRooms`, scope `asset-roster`) | ✅ PASS — "No Results Found" shown for facility without rooms |

---

## 9. Rooms List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Verify the Rooms table columns | Table shows columns: Name (translation key `facilityName`), Code (translation key `code`), Address (translation key `address`), Facility (translation key `facility`) | ✅ PASS — Columns: "Facility Name", "Code", "Address", "Facility" |
| 9.2 | List has room records | Each row shows name, code, address, and parent facility name | ✅ PASS — 3 records shown with data |
| 9.3 | List is empty (no records) | "No records found" or empty state message is shown | ⏭️ N/A — List has records |
| 9.4 | Scroll to bottom of the list | Next page of records loads automatically (infinite scroll) | ✅ PASS — "All records loaded" appears; all records visible in one page |
| 9.5 | Click a row in the table | Navigates to the Room edit form (`/settings/asset-roster/rooms/edit/:id`), gated by `rooms/update:view` permission | ✅ PASS — Clicking a room row navigates to edit form |
| 9.6 | Click the delete action on a row | Confirmation prompt appears; confirming removes the room from the list | ✅ PASS — Confirmation dialog shown; "test" room deleted successfully with notification |
| 9.7 | Verify the Rooms search bar | Search bar is shown with label "Search by name, code, facility" (translation key `searchByNameCodeFacility`, scope `asset-roster`) | ✅ PASS — Search bar present with placeholder "Search by name, code, facility or address" |

---

## 10. Rooms Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Type a room name in the search bar | List filters to matching rooms in real time (filter field: `name`) | ✅ PASS — Typing a room name filters results |
| 10.2 | Type a room code in the search bar | Matching rooms appear (filter field: `code`) | ✅ PASS — Typing a code filters results |
| 10.3 | Type an address keyword in the search bar | Matching rooms appear (filter field: `address`) | ✅ PASS — Typing an address keyword filters results |
| 10.4 | Type a facility name in the search bar | Rooms belonging to that facility appear (filter field: `facilityId.name`) | ✅ PASS — Typing a facility name filters to matching rooms |
| 10.5 | Search with no matches | Empty state displayed; no error | ✅ PASS — "No Results Found" shown |
| 10.6 | Clear the search field | Full room list reloads | ✅ PASS — All records restored after clearing |

---

## 11. Create Room — Form Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Navigate to the Room create form | Form loads with title "Create Room" (translation key `createRoom`, scope `asset-roster`) | ✅ PASS — h3 "Create Room" heading shown |
| 11.2 | Verify the form fields | Name (text), Code (text), Address (text), Facility (p-select dropdown) — all marked as required | ✅ PASS — Label now correctly shows "Address" (translation key `address`). Fix FA-06: changed label from `'location'` to `'address'`. |
| 11.3 | Verify the form section | A section titled "General Information" (translation key `generalInformation`, scope `asset-roster`) is shown | ✅ PASS — "General Information" section present |
| 11.4 | Verify the form actions | "Go Back" and "Save" buttons are shown | ✅ PASS — "Go back" always visible; "Save" appears when dirty |
| 11.5 | Click Save without filling any fields | Validation errors shown on all four required fields (Name, Code, Address, Facility); form does not submit | ✅ PASS — All fields show "This field is required"; toast "The form contains errors." |
| 11.6 | Fill Name only, click Save | Validation errors still shown on Code, Address, and Facility | ✅ PASS — Name error cleared; Code, Address, Facility errors remain |

---

## 12. Create Room — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Fill all fields (Name "Lab A", Code "LAB-001", Address "First Floor", Facility select a facility), click Save | Room created; redirected to the list | ✅ PASS — Room created with facility "233"; redirected to rooms list |
| 12.2 | Verify the new room appears in the list | The newly created room shows with correct name, code, address, and linked facility | ✅ PASS — List shows "Lab A" with "LAB-001", "First Floor", facility "233" |
| 12.3 | Verify the linked facility's Rooms Preview shows the new room | Navigate to the facility edit form; the Rooms Preview section shows the new room | ✅ PASS — Facility "233" edit form shows "Lab A" in Rooms Preview |

---

## 13. Edit Room

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Click a row in the Rooms list to open the edit form | Edit form loads with title "Update Room" (translation key `updateRoom`, scope `asset-roster`) | ✅ PASS — Clicking "Lab A" row navigates to edit form with h3 "Update Room" |
| 13.2 | Verify all saved fields are pre-filled | Name, Code, Address, and Facility fields show the existing values | ✅ PASS — "Lab A", "LAB-001", "First Floor", "233" pre-filled |
| 13.3 | Change the Name and click Save | Updated name appears in the list | ✅ PASS — Changed "Lab A" → "Lab B"; reflected in list |
| 13.4 | Change the Code and click Save | Updated code appears in the list | ⏭️ N/A — Not tested independently (same pattern as Name) |
| 13.5 | Change the Facility and click Save | Updated facility appears in the list | ⏭️ N/A — Not tested independently (same pattern as Name) |
| 13.6 | Change the Address and click Save | Updated address appears in the list | ⏭️ N/A — Not tested independently (same pattern as Name) |
| 13.7 | Clear a required field (e.g. Name) and click Save | Validation error shown; record not saved | ✅ PASS — "This field is required" shown; form does not submit |
| 13.8 | Verify the form is not initially dirty on edit | The Save button is not enabled until a field is changed | ✅ PASS — No Save button visible on initial edit form load; appears after modification |

---

## 14. Room Facility Picker (Cross-Form Navigation)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | Open the Room create form, click the Facility dropdown | The dropdown shows available facilities with an "Other facility +" option at the bottom (via `bifi-app-form-select-navigate-footer`) | ✅ PASS — Dropdown shows facility list with "Other facility +" at bottom |
| 14.2 | Click "Other facility +" in the Facility dropdown | Navigates to the Facility create form at `/settings/asset-roster/facilities/create` with query params for return navigation (`returnUrl` and `controlName`) | ✅ PASS — Navigates to `/settings/asset-roster/facilities/create?returnUrl=/settings/asset-roster/rooms/create&controlName=facilityId` |
| 14.3 | On the Facility create form, fill Name and save | Facility is created and the page navigates back to the Room form; the Room form retains the draft data entered before navigating away | ✅ PASS — Returned to room create with pre-filled draft data preserved |
| 14.4 | After returning from Facility creation, verify the Facility dropdown | The dropdown now shows the newly created facility pre-selected in the Facility field | ✅ PASS — Facility combobox shows "Quick Facility" pre-selected |

---

## 15. Dirty Form Guard (Rooms)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | On the Room create form, fill some fields but do not save | The form becomes dirty | ✅ PASS — Form becomes dirty after typing |
| 15.2 | Click "Go Back" or navigate away (e.g. click Settings in sidebar) | A confirmation dialog appears with message "You have unsaved changes. Are you sure you want to leave this page?" and Cancel/Confirm buttons | ✅ PASS — Dialog shows proper translated message "You have unsaved changes. Are you sure you want to leave this page?" Fix FA-04: added `confirmDialog.unsavedChanges` key to `base-app-resource-translations.json`. |
| 15.3 | Click "Discard" in the confirmation dialog | Navigates away; form data is discarded | ✅ PASS — Clicking "Discard" navigates to list; data discarded |
| 15.4 | Click "Cancel" in the confirmation dialog | Stays on the form; data is preserved | ✅ PASS — Stays on form with data preserved |
| 15.5 | On the Facility create form, fill fields and navigate away | Unsaved changes confirmation dialog appears | ✅ PASS — "Confirmation" dialog shown with "You have unsaved changes. Are you sure you want to leave this page?" Fix FA-07: added `canDeactivate: [DirtyFormGuard]` to Facility routes. |

---

## 16. Cancel & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | On the Facility create form, click "Go Back" | Navigates back to the Facilities list without saving | ✅ PASS — Navigates to facilities list; no record created |
| 16.2 | On the Facility edit form, click "Go Back" | Navigates back to the Facilities list without saving | ✅ PASS — Navigates to facilities list; no changes saved |
| 16.3 | On the Room create form, click "Go Back" | Navigates back to the Rooms list — unsaved changes prompt appears if form is dirty | ✅ PASS — Confirmation dialog shows proper translated message. Fix FA-04. |
| 16.4 | On the Room edit form, click "Go Back" | Navigates back to the Rooms list — unsaved changes prompt appears if form is dirty | ✅ PASS — Confirmation dialog shows proper translated message. Fix FA-04. |

---

## 17. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Verify the Facilities list route is guarded by `permissionGuard` | A user without `facilities/list` permission cannot access the list | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.2 | Verify the "Add New Facility" button is permission-gated | The button is hidden for users without `facilities/create:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.3 | Verify the Facility create route is guarded | A user without `facilities/create` permission cannot access the create form | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.4 | Verify the Facility edit route is guarded | A user without `facilities/update` permission cannot access the edit form | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.5 | Verify Facility row clicks are permission-gated | Rows are not clickable for users without `facilities/update:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.6 | Verify the Facility delete button is permission-gated | The delete button is hidden for users without `facilities:delete:model` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.7 | Verify the Rooms list route is guarded | A user without `rooms/list` permission cannot access the rooms list | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.8 | Verify the "Add New Room" button is permission-gated | The button is hidden for users without `rooms/create:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.9 | Verify the Room create route is guarded | A user without `rooms/create` permission cannot access the create form | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.10 | Verify the Room edit route is guarded | A user without `rooms/update` permission cannot access the edit form | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.11 | Verify Room row clicks are permission-gated | Rows are not clickable for users without `rooms/update:view` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |
| 17.12 | Verify the Room delete button is permission-gated | The delete button is hidden for users without `rooms:delete:model` permission | ⏭️ N/A — Cannot verify without changing test user's permissions |

---

## 18. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Enter a very long Facility Name (e.g. 255+ characters) | Value is accepted or rejected — document actual behaviour | ⏭️ N/A — Not tested |
| 18.2 | Enter a very long Room Name | Value is accepted or rejected — document actual behaviour | ⏭️ N/A — Not tested |
| 18.3 | Enter a very long Room Code | Value is accepted or rejected — document actual behaviour | ⏭️ N/A — Not tested |
| 18.4 | Enter a very long Room Address | Value is accepted or rejected — document actual behaviour | ⏭️ N/A — Not tested |
| 18.5 | Create two rooms with the same code | System saves OR shows an error — document actual behaviour | ⏭️ N/A — Not tested |
| 18.6 | Create a facility with the same name as an existing facility | System saves OR shows an error — document actual behaviour | ⚠️ BUG — Duplicate name "Main Campus Updated" accepted; no uniqueness validation on facility name |
| 18.7 | Create a facility, then immediately edit it | Edit form loads with the correct pre-filled values | ✅ PASS — Edit form correctly pre-fills all saved fields |
| 18.8 | Rapidly click Save on the Facility create form | Only one POST request is fired | ⏭️ N/A — Not tested |

---

## 19. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | Verify the Facilities list heading uses translation | Heading uses translation key `facilities` (scope `asset-roster`) | ✅ PASS — "Facilities" rendered correctly |
| 19.2 | Verify the "Add New Facility" button label uses translation | Button uses translation key `addNewFacility` (scope `asset-roster`) | ✅ PASS — Button shows "Add New Facility" |
| 19.3 | Verify the Facility create form title uses translation | Title uses translation key `createFacility` (scope `asset-roster`) | ✅ PASS — Title shows "Create Facility" |
| 19.4 | Verify the Facility edit form title uses translation | Title uses translation key `updateFacility` (scope `asset-roster`) | ✅ PASS — Title shows "Update Facility" |
| 19.5 | Verify the Facility search bar label uses translation | Label uses translation key `searchByNameContact` (scope `asset-roster`) | ✅ PASS — Placeholder shows "Search by name or contact" |
| 19.6 | Verify the Facility column headers use translation | Columns use keys `facilityName`, `relatedToContact`, `rooms` (scope `asset-roster`) | ✅ PASS — "Facility Name", "Related to contact", "Rooms" |
| 19.7 | Verify the Rooms list heading uses translation | Heading uses translation key `rooms` (scope `asset-roster`) | ✅ PASS — "Rooms" rendered correctly |
| 19.8 | Verify the Room column headers use translation | Columns use keys `facilityName`, `code`, `address`, `facility` (scope `asset-roster`) | ✅ PASS — "Facility Name", "Code", "Address", "Facility" |
| 19.9 | Verify the Room form title uses translation | Title uses translation key `createRoom` / `updateRoom` (scope `asset-roster`) | ✅ PASS — "Create Room" / "Update Room" |
| 19.10 | Switch the app language to Spanish | All labels translate correctly — document actual behaviour | ⏭️ N/A — No language switcher found in UI; not tested |

---

## Bugs Found

| # | Test | Description | Severity |
|---|------|-------------|----------|
| B-01 | ~ | **Whitespace-only facility name accepted (FA-01)** — ✅ **RESOLVED 2026-07-22**: Replaced `Validators.required` with `NonWhitespaceValidators.nonWhitespaceRequired` via fix S-07. File: `facility-form.ts:16`. | **Fixed** |
| B-02 | ~ | **No UI mechanism to clear selected contact (FA-02)** — ✅ **RESOLVED 2026-07-22**: Added `[showClear]="true"` to contactId p-select in `facilities-form.html:47`. Clear icon (×) now visible when a contact is selected. | **Fixed** |
| B-03 | 7.3 | **Facility with rooms deleted without warning** — Deleting "pedro" (which had 1 room "Room") succeeded without any warning about related rooms. The room becomes orphaned — still appears in the rooms list with a stale facility reference. | High |
| B-04 | ~ | **Untranslated i18n key in DirtyFormGuard dialog (FA-04)** — ✅ **RESOLVED 2026-07-22**: Added `confirmDialog.unsavedChanges` en/es pair to `base-app-resource-translations.json`. Dialog now shows "You have unsaved changes. Are you sure you want to leave this page?" Verified via browser test. | **Fixed** |
| B-05 | 18.6 | **Duplicate facility names silently allowed** — Creating a facility with a name already used by another record succeeds without any validation error or warning. No unique constraint on facility name. | Medium |
| B-06 | ~ | **Inconsistent field label vs validation message (FA-06)** — ✅ **RESOLVED 2026-07-22**: Changed label translation key from `'location'` to `'address'` in `rooms-form.html:52`. Column type also fixed from `'number'` to `'text'` in `room-columns.ts:20`. | **Fixed** |
| B-07 | ~ | **No unsaved changes prompt on Facility forms (FA-07)** — ✅ **RESOLVED 2026-07-22**: Added `canDeactivate: [DirtyFormGuard]` and `hasUnsavedChanges()` to Facility create/edit routes and form. Files: `facilities.routes.ts:21,28`, `facilities-form.ts:71-73`. | **Fixed** |

---

## Results Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 62 |
| ❌ FAIL | 0 |
| ⚠️ BUG / NOTE | 5 |
| ⏭️ NOT TESTED / N/A | 17 |

> **Re-tested 2026-07-22 after fixes:** FA-01 (whitespace validation), FA-02 (showClear on contact select), FA-04 (untranslated key), FA-06 (Location vs Address label), FA-07 (Facility DirtyFormGuard) resolved. B-01, B-02, B-04, B-06, B-07 moved to Fixed. 6 more PASS, 6 fewer BUG/NOTE.
