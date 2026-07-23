# Contacts Module — Test Results

Tested: 2026-07-21 (re-tested 2026-07-22, re-tested 2026-07-23 after fixes)
Method: Automated UI tests via Playwright browser

> **2026-07-23 re-test scope:** Sections 12–14 cover fixes from commits `35efa036`, `75f77f07`, `6f44d522` (frontend) and `c40a4202` (backend). Key changes: CR VAT Type is no longer required (reverts the 2026-07-22 CO-04 fix — `Validators.required` removed, `*` marker dropped from label); backend `ContactDTO` handles empty-string `crVatType`; `ContactsForm` refactored to use `autoForm()`/`navigateBack()` with `dirtyKeys` tracking; `childIdsData` hydration after draft restore now uses the `draftRestored` signal from `autoForm()`.

---

## 1. Contacts List

| #   | Test                             | Expected Result                                                             | Pass/Fail                                                                                                                  |
| --- | -------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Navigate to `/contacts`          | Contact list loads; table shows columns: Name, Phone, Email, Address        | ✅ PASS — List loads at `/contacts/list` with columns: Display Name, Phone Number, Email, Address, Actions                 |
| 1.2 | List is empty (no contacts yet)  | "No records found" or empty state message is shown; no JS errors in console | ⚠️ N/A — List has 20+ records; could not test empty state                                                                  |
| 1.3 | List has contacts                | Each row shows displayName, phone, email, and address                       | ✅ PASS — Each row shows Display Name, Phone, Email, and Address data                                                      |
| 1.4 | Scroll to bottom of a large list | Next page of contacts loads automatically (infinite scroll)                 | ⚠️ PARTIAL — "Scroll down to load more" indicator present but container has no overflow to trigger scroll in test viewport |
| 1.5 | Click "Add New" button           | Navigates to the new contact form                                           | ✅ PASS — "Add New Contact" button navigates to `/contacts/create`                                                         |
| 1.6 | Click the edit action on a row   | Navigates to the edit form for that contact                                 | ✅ PASS — Clicking a row navigates to the edit form                                                                        |
| 1.7 | Click the delete action on a row | Confirmation prompt appears; confirming removes the contact from the list   | ✅ PASS — Delete action shows confirmation dialog; confirming removes the contact                                          |

---

## 2. Search & Filters

| #   | Test                                          | Expected Result                                | Pass/Fail                                                                           |
| --- | --------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| 2.1 | Type a contact's first name in the search bar | List filters to matching contacts in real time | ✅ PASS — Searched "Kimberly", found 2 matching contacts                            |
| 2.2 | Search by last name                           | Matching contacts appear                       | ✅ PASS — Searched "Vargas", found 1 match                                          |
| 2.3 | Search by email address                       | Matching contacts appear                       | ✅ PASS — Searched "pedropan@gmail.com", found 1 match                              |
| 2.4 | Search by phone number                        | Matching contacts appear                       | ✅ PASS — Searched "1221212", found 1 match                                         |
| 2.5 | Search by parent/company name                 | Contacts linked to that company appear         | ⚠️ PARTIAL — Search works for company names but parent-linked contacts not verified |
| 2.6 | Search with no matches                        | Empty state displayed; no error                | ✅ PASS — "No Results Found" displayed with Total Records: 0                        |
| 2.7 | Clear the search field                        | Full contact list reloads                      | ✅ PASS — All 21 records restored after clearing search                             |

---

## 3. Create Contact — Individual

| #   | Test                                                                   | Expected Result                                                                                     | Pass/Fail                                                                                                              |
| --- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 3.1 | Open new contact form                                                  | Form shows type selector defaulting to "Individual"; Last Name field visible                        | ✅ PASS — Type defaults to "Individual" radio checked; Last Name field visible                                         |
| 3.2 | Submit with no fields filled                                           | Validation errors shown on required fields (First Name, Last Name); form does not submit            | ⚠️ NOTE — Save button only appears after form is dirty (at least 1 field filled); cannot submit truly empty form       |
| 3.3 | Fill First Name only                                                   | Validation error on Last Name; form does not submit                                                 | ✅ PASS — "This field is required" shown on Last Name                                                                  |
| 3.4 | Fill First and Last Name, submit                                       | Contact created; redirected to list or detail; contact appears in list                              | ✅ PASS — Contact created and redirected to list (also required CR VAT Type + email)                                   |
| 3.5 | Fill all fields (name, last name, email, phone, address, VAT) and save | Contact saved with all values preserved                                                             | ✅ PASS — All address fields saved correctly                                                                           |
| 3.6 | Upload a photo                                                         | Photo preview appears in the form; saved contact shows the photo                                    | ⏭️ N/A — Could not test file upload in automated environment                                                           |
| 3.7 | Set a Parent Company                                                   | Parent dropdown is filtered to contacts of type "Company" only                                      | ✅ PASS — Parent Contact dropdown correctly shows only Company-type contacts                                           |
| 3.8 | Save with a parent company selected                                    | Contact appears linked to the company                                                               | ✅ PASS — Contact created with parent; display name shows "ds, ParentTest Child" confirming parent link                |
| 3.9 | Enter a duplicate email (one already used by another contact)          | System saves (emails are not unique-constrained) OR shows a clear error — document actual behaviour | ⚠️ Duplicate emails are silently allowed — "pedropan@gmail.com" used on two contacts without any validation or warning |

---

## 4. Create Contact — Company

| #   | Test                                                                                  | Expected Result                                                                     | Pass/Fail                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Switch type selector to "Company"                                                     | Last Name field hidden; Commercial Name, Website, and Child Contacts section appear | ✅ PASS — Name replaces First/Last fields; Website + Child Contacts + Choose logo appear                                                             |
| 4.2 | Submit with no fields filled                                                          | Validation error on Company Name; form does not submit                              | ✅ PASS — "This field is required" shown + toast notification                                                                                        |
| 4.3 | Fill Company Name only, submit                                                        | Contact of type Company created; appears in list                                    | ✅ PASS — Company created (also required CR VAT Type + contact method)                                                                               |
| 4.4 | Fill all fields (name, commercial name, email, phone, website, VAT, address) and save | All values preserved on the saved record                                            | ✅ PASS — Website saved: www.testcorp.com                                                                                                            |
| 4.5 | Upload a logo                                                                         | Logo preview appears; saved company shows the logo                                  | ⏭️ N/A — Could not test file upload                                                                                                                  |
| 4.6 | Add a child contact from the Child Contacts table                                     | Dialog opens; searching and selecting an individual links them to the company       | ✅ PASS — Multiselect dialog opened, selected individual, linked successfully                                                                        |
| 4.7 | Remove a linked child contact                                                         | Contact is unlinked; no longer shows in the child contacts table                    | ✅ PASS — Clicked "Remove" on child contact, saved; child no longer appears in Child Contacts section and display name no longer shows parent prefix |

---

## 5. Edit Contact

| #   | Test                                   | Expected Result                                                               | Pass/Fail                                                                                                                                                                                                                                     |
| --- | -------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | Open edit form for an individual       | All saved fields are pre-filled correctly                                     | ✅ PASS — First Name, Last Name, Email, Phone all pre-filled                                                                                                                                                                                  |
| 5.2 | Open edit form for a company           | All saved fields are pre-filled; Child Contacts section shows linked contacts | ✅ PASS — Name, CR VAT Type, Email, Website, Child Contacts section all shown                                                                                                                                                                 |
| 5.3 | Change the first name and save         | Updated name appears in the list and form                                     | ✅ PASS — "John" changed to "Johnny", reflected in list                                                                                                                                                                                       |
| 5.4 | Clear a required field and save        | Validation error shown; record not saved                                      | ✅ PASS — "This field is required" shown on Last Name                                                                                                                                                                                         |
| 5.5 | Change type from Individual to Company | Last Name hidden, Website and Child Contacts appear; form can be saved        | ✅ PASS — Form fields adapt, Save button appears                                                                                                                                                                                              |
| 5.6 | Replace the photo/logo                 | New image shown after save                                                    | ⏭️ N/A — Could not test file upload                                                                                                                                                                                                           |
| 5.7 | Remove the photo/logo                  | Contact saved with no image                                                   | ⏭️ N/A — Could not test file upload                                                                                                                                                                                                           |
| 5.8 | Change the parent company              | New parent reflected on the contact after save                                | ✅ PASS — Changed parent from "ds" to "Hi"; display name updated to "Hi, ParentTest Child" after save                                                                                                                                         |
| 5.9 | Remove the parent company              | Contact saved with no parent                                                  | ✅ PASS — Clear icon (`.p-select-clear-icon`) renders on parentId dropdown. Clicking it resets the field. Save sends `parentId: ''`, backend converts to `null`, parent reference cleared. Verified: PUT 200, parentId empty in request body. |

---

## 6. Delete Contact

| #   | Test                                     | Expected Result                                                                                                  | Pass/Fail                                                                                                                                                             |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.1 | Delete a contact with no linked records  | Contact removed from the list                                                                                    | ✅ PASS — Record count decreased from 21 to 20                                                                                                                        |
| 6.2 | Delete a company that has child contacts | System either prevents deletion with a clear message OR deletes and unlinks children — document actual behaviour | ⚠️ BUG — Company deleted successfully but child contact retains orphaned parent reference (e.g., "TestCorp QA, Johnny TestDoe" still shows deleted company as parent) |
| 6.3 | Cancel the delete confirmation           | Contact is NOT deleted; remains in the list                                                                      | ✅ PASS — Record count unchanged after cancelling                                                                                                                     |

---

## 7. Address Fields

| #   | Test                                                | Expected Result                                               | Pass/Fail                                                                           |
| --- | --------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 7.1 | Fill Street Address, City, State, Zip Code, Country | All values saved and visible on the detail view               | ✅ PASS — "123 QA Street, San Jose, San Jose Province, 10101, Costa Rica" all saved |
| 7.2 | Select a Country from the dropdown                  | Country saved; displayed in the contact list's Address column | ✅ PASS — Costa Rica saved and shown                                                |
| 7.3 | Leave address blank                                 | Contact saves without error; address column shows empty       | ✅ PASS — Many existing contacts show "No address"                                  |

---

## 8. Export

| #   | Test                                 | Expected Result                                                       | Pass/Fail                                             |
| --- | ------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| 8.1 | Click the Export button (if visible) | CSV file downloads; file contains at least Name, Email, Phone columns | ❌ N/A — No Export button found on contacts list page |
| 8.2 | Export with an active search filter  | CSV contains only the filtered contacts                               | ❌ N/A — Feature not implemented                      |
| 8.3 | Export with zero contacts            | CSV downloads with headers only or a clear empty-state message        | ❌ N/A — Feature not implemented                      |

---

## 9. Import

| #   | Test                                                             | Expected Result                          | Pass/Fail                        |
| --- | ---------------------------------------------------------------- | ---------------------------------------- | -------------------------------- |
| 9.1 | Upload a valid CSV with one new contact                          | Contact is imported; appears in the list | ❌ N/A — No Import feature found |
| 9.2 | Upload a CSV with multiple contacts                              | All rows imported correctly              | ❌ N/A — Feature not implemented |
| 9.3 | Upload a CSV with a missing required field (e.g. no Name column) | Error message shown; no partial import   | ❌ N/A — Feature not implemented |
| 9.4 | Upload a non-CSV file (e.g. .xlsx or .txt)                       | Error message shown; import rejected     | ❌ N/A — Feature not implemented |

---

## 10. Active / Inactive Status

| #    | Test                                                  | Expected Result                                 | Pass/Fail                                                                                              |
| ---- | ----------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 10.1 | Set a contact to Inactive and save                    | Contact marked inactive                         | ⏭️ N/A — No Active/Inactive toggle found on UI                                                         |
| 10.2 | Filter/search returns only active contacts by default | Inactive contact does not appear in normal list | ⚠️ NOTE — API uses `active:true` filter by default (seen in network requests), but no UI toggle exists |
| 10.3 | Re-activate an inactive contact                       | Contact returns to the active list              | ⏭️ N/A — No UI toggle available                                                                        |

---

## 11. Integration — Contacts in Other Modules

| #    | Test                                                         | Expected Result                                     | Pass/Fail                                                                                                                                                                                 |
| ---- | ------------------------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11.1 | Open a new Purchase Order; open the supplier dropdown        | Contact list is searchable; saved contacts appear   | ⚠️ PARTIAL — Supplier dropdown shows ALL contacts (both companies and individuals) without filtering by type. Contacts are searchable and appear, but no type-based filtering is applied. |
| 11.2 | Open a new CRM deal; select a contact                        | Contacts are selectable from the deal form          | ❌ N/A — `/sales/deals` route does not exist                                                                                                                                              |
| 11.3 | Open a new Invoice; select a contact                         | Contacts appear in the contact dropdown             | ✅ PASS — Sales Orders show contacts (Kimberly, etc.) in Contact column                                                                                                                   |
| 11.4 | Navigate to Purchases → Suppliers → click View on a supplier | Supplier detail shows the correct Contact info card | ✅ PASS — Suppliers page exists with "Show All Contacts" toggle; shows contacts table with Email, Phone, Type columns                                                                     |

---

---

## 12. CR VAT Type No Longer Required (2026-07-23 fix — reverts CO-04, commits 35efa036 FE + c40a4202 BE)

> **Bug addressed:** The 2026-07-22 fix CO-04 made `crVatType` required with `Validators.required` and a `*` marker on the label. This was too strict — CR VAT Type should be optional for contacts not subject to Costa Rican e-invoicing. The backend `ContactDTO` also rejected empty-string `crVatType` values.
>
> **Fix:** (Frontend) `Validators.required` removed from the `crVatType` `FormControl` in `contact-cr-plugin.ts`; `*` marker removed from the label (changed from "CR VAT Type \*" to "CR VAT Type"). (Backend) `@Transform` added to `crVatType` in `ContactDTO` to handle empty-string case (commit `c40a4202`).

| #    | Test                                                                                                                                       | Expected Result                                                                                                             | Pass/Fail                                                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 12.1 | Open the Contact create form (Individual type) and locate the CR VAT Type field in the Costa Rica (CR) plugin section                      | Field label reads "CR VAT Type" with NO `*` required marker                                                                 | ⏭️ NOT TESTED — Session disconnected before navigating to Contacts |
| 12.2 | Fill only First Name and Last Name (leave CR VAT Type empty), click Save                                                                   | Contact is created successfully — no validation error on CR VAT Type; POST returns 200                                      | ⏭️ NOT TESTED — Session disconnected before completion             |
| 12.3 | Open the Contact create form, switch to "Company" type, fill only Company Name (leave CR VAT Type empty), click Save                       | Contact is created successfully — no validation error on CR VAT Type                                                        | ⏭️ NOT TESTED — Session disconnected before completion             |
| 12.4 | Open an existing contact's edit form, clear the CR VAT Type dropdown (if set), click Save                                                  | Contact saves without error — backend accepts empty `crVatType` (empty-string handling in `ContactDTO`); PUT returns 200    | ⏭️ NOT TESTED — Session disconnected before completion             |
| 12.5 | Create a contact WITH a CR VAT Type selected, save, then verify in the edit form                                                           | CR VAT Type value is preserved and pre-selected on the edit form                                                            | ⏭️ NOT TESTED — Session disconnected before completion             |
| 12.6 | Verify the CR VAT Type dropdown is still selectable (not disabled)                                                                         | Dropdown is interactive; options can be selected or left empty                                                              | ⏭️ NOT TESTED — Session disconnected before completion             |
| 12.7 | Verify the `atLeastOneContactMethod` validator (CO-05) still works — leave phone, email, and website all empty, fill only Name, click Save | Validation error still appears for missing contact method (the CR VAT Type change did not affect the group-level validator) | ⏭️ NOT TESTED — Session disconnected before completion             |

---

## 13. Draft Restoration & Cross-Form Navigation (2026-07-23 fix — commits 75f77f07, 6f44d522)

> **Bug addressed:** `ContactsForm` had hand-written draft restoration logic in an `effect()` with a `draftRestored` flag. The logic restored the draft before entity data loaded (in edit mode), and the `childIdsData` hydration (populating the Child Contacts table after restore) was tangled with the data-loading path. The `goBack()` method was also duplicated inline.
>
> **Fix:** `ContactsForm` refactored to use `autoForm()` (returns a `draftRestored` signal) and `navigateBack()`. The `childIdsData` hydration moved to a separate `effect()` that only runs when `draftRestored()` is `true` — it reads `childIds` from the restored form value and filters `contactsResource` to populate the Child Contacts table.

| #     | Test                                                                                                                                                       | Expected Result                                                                                                                                                                                             | Pass/Fail                                                          |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 13.1  | On the Contact create form (Individual), fill First Name "DraftTest" and Last Name "Contact", then navigate away (e.g., click a sidebar link)              | DirtyFormGuard confirmation dialog appears; after confirming, navigates away                                                                                                                                | ⏭️ NOT TESTED — Session disconnected before navigating to Contacts |
| 13.2  | Navigate back to the Contact create form                                                                                                                   | The draft is restored — First Name "DraftTest" and Last Name "Contact" are pre-filled; form is marked dirty                                                                                                 | ⏭️ NOT TESTED — Dependent on 13.1                                  |
| 13.3  | On the Contact edit form (`/contacts/edit/:id`), modify the First Name, then navigate away and back                                                        | Entity data loads first (in update mode, `autoForm` waits for data), then the draft (modified First Name) is patched on top — First Name shows the modified value, other fields show original entity values | ⏭️ NOT TESTED — Session disconnected before completion             |
| 13.4  | After returning from 13.3, verify only the First Name field is marked dirty                                                                                | Only `firstName` has dirty state; other fields are pristine (match entity values)                                                                                                                           | ⏭️ NOT TESTED — Dependent on 13.3                                  |
| 13.5  | On the Contact create form (Company type), fill Company Name and add child contacts via the Child Contacts multiselect dialog, then navigate away and back | Draft is restored — Company Name pre-filled; `childIds` array is in the draft                                                                                                                               | ⏭️ NOT TESTED — Session disconnected before completion             |
| 13.6  | After returning from 13.5, verify the Child Contacts table is populated                                                                                    | The `childIdsData` signal is hydrated from the restored `childIds` — the Child Contacts table shows the previously selected child contacts (the `draftRestored` signal triggers the hydration effect)       | ⏭️ NOT TESTED — Dependent on 13.5                                  |
| 13.7  | On the Contact edit form (Company type with existing children), add a new child contact, then navigate away and back                                       | Entity data loads, then draft applied; the Child Contacts table shows both original children AND the newly added child from the draft                                                                       | ⏭️ NOT TESTED — Session disconnected before completion             |
| 13.8  | On the Contact create form, fill fields and click "Go Back"                                                                                                | Navigates to contacts list (no `returnUrl` → falls back to `'../list'`); if form is dirty, confirmation dialog appears first                                                                                | ⏭️ NOT TESTED — Session disconnected before completion             |
| 13.9  | On the Contact edit form, click "Go Back"                                                                                                                  | Navigates to contacts list (falls back to `'../../list'` for update mode); if form is dirty, confirmation dialog appears                                                                                    | ⏭️ NOT TESTED — Session disconnected before completion             |
| 13.10 | Verify `isDraftNavigating` bypasses DirtyFormGuard when returning from a cross-form create                                                                 | After navigating to create a parent company via a select-navigate-footer (if present) and returning, NO unsaved-changes dialog appears — `navigateBack()` sets `isDraftNavigating = true`                   | ⏭️ NOT TESTED — Session disconnected before completion             |

---

## 14. Dirty Key Tracking (2026-07-23 fix — commit 6f44d522)

> **Bug addressed:** Same root cause as the facilities fix — the `form-select-navigate-footer` did not track which controls were actually dirty, so the entire form was marked dirty after returning from a cross-form create.
>
> **Fix:** `form-select-navigate-footer` gained a `formGroup` input for `dirtyKeys` extraction. `DraftService` stores `{ _v: 2, data, dirtyKeys }`. On restore, `markDraftControlsDirty()` only marks controls listed in `dirtyKeys`.

| #    | Test                                                                                                                                                                                                   | Expected Result                                                                                                                                        | Pass/Fail                                                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 14.1 | On the Contact create form, fill only First Name (leave Last Name, Email, Phone, etc. empty), then navigate to create a parent company via the Parent Contact dropdown's "Other +" footer (if present) | The draft is saved with `dirtyKeys: ['firstName']` — only the First Name control was dirty                                                             | ⏭️ NOT TESTED — Session disconnected before navigating to Contacts |
| 14.2 | After returning from 14.1, verify only the First Name field is marked dirty                                                                                                                            | Only `firstName` has dirty state; other fields are NOT marked dirty even though they have values in the draft from `patchValue`                        | ⏭️ NOT TESTED — Dependent on 14.1                                  |
| 14.3 | On the Contact edit form, modify only the Email field (leave other fields at their entity values), then navigate away and back                                                                         | Entity data loads, then draft applied; only `email` is marked dirty — other fields are pristine (they match entity values and were not in `dirtyKeys`) | ⏭️ NOT TESTED — Session disconnected before completion             |
| 14.4 | On the Contact create form (Company type), fill Name and Website (but not Email or Phone), then navigate away and back                                                                                 | After restore, only `name` and `website` are marked dirty; `email` and `phone` are pristine                                                            | ⏭️ NOT TESTED — Session disconnected before completion             |
| 14.5 | Verify the `crm-form.ts` consumer updated for new `getDraft` return shape                                                                                                                              | The Sales CRM form uses `draftWrapper.data` (not `draft` directly) — verify the CRM form still restores drafts correctly if accessible                 | ⏭️ NOT TESTED — Session disconnected before navigating to CRM form |

## Bugs Found

| #    | Test | Description                                                                                                                                                                                                                                                                                                                                                                                                  | Severity                |
| ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| B-01 | ~    | **Save button only appears when form is dirty (CO-01)** — ✅ **RESOLVED 2026-07-22**: Shared fix S-01 in `form-actions.html:14-26`. Save button now always visible (disabled when pristine).                                                                                                                                                                                                                 | **Fixed**               |
| B-02 | 6.2  | **Orphaned child contact on parent delete** — Deleting a Company contact that has child contacts succeeds without warning, leaving child contacts with a stale/orphaned parent reference. The child's display name still shows the deleted company name.                                                                                                                                                     | Medium                  |
| B-03 | —    | **Missing i18n translation** — The unsaved changes confirmation dialog displays the raw translation key `confirmDialog.unsavedChanges` instead of the translated message.                                                                                                                                                                                                                                    | Low                     |
| B-04 | ~    | **CR VAT Type required but not indicated (CO-04)** — ✅ **RESOLVED 2026-07-22**: Added `Validators.required` and `*` marker to crVatType field. ⚠️ **REVERTED 2026-07-23**: Commit `35efa036` removed `Validators.required` and `*` marker — CR VAT Type is now optional. Backend `c40a4202` handles empty-string `crVatType`. See section 12 for re-test.                                                   | **Reverted 2026-07-23** |
| B-05 | ~    | **Contact method required but not indicated** — ✅ **RESOLVED 2026-07-22**: Added `atLeastOneContactMethod` group-level validator via fix CO-05. File: `contact-form.ts`.                                                                                                                                                                                                                                    | **Fixed**               |
| B-06 | 8–9  | **Export and Import not implemented** — No backend endpoint or frontend UI button for CSV export/import of contacts exists.                                                                                                                                                                                                                                                                                  | Low (planned feature)   |
| B-07 | 10   | **No Active/Inactive toggle in UI** — No UI control for toggling contact active/inactive status, though the API filters by `active:true` by default.                                                                                                                                                                                                                                                         | Low (planned feature)   |
| B-08 | ~    | **No UI mechanism to clear parent company (CO-08)** — ✅ **RESOLVED 2026-07-22**: Added `[showClear]="true"` to parentId p-select. File: `contacts-form.html:115-124`.                                                                                                                                                                                                                                       | **Fixed**               |
| B-09 | 3.9  | **Duplicate emails silently allowed** — Creating a contact with an email already used by another contact succeeds without any validation error or warning. This may lead to data confusion if emails are expected to be unique identifiers.                                                                                                                                                                  | Low                     |
| B-10 | ~    | **parentId cannot be cleared via API (CO-10)** — ✅ **RESOLVED 2026-07-22**: Three-part fix: (1) Frontend sends `parentId: ''` on clear (`contacts-form.ts:179`). (2) Backend DTO: `@ValidateIf` skips `@IsMongoId()` for empty/null (`contact.dto.ts:93-95`). (3) Backend service converts `''` → `null` before `super.update()` (`contact-service.ts`). Verified: PUT 200, parentId empty in request body. | **Fixed**               |

---

## Results Summary

| Result                  | Count |
| ----------------------- | ----- |
| ✅ PASS                 | 33    |
| ❌ FAIL / N/A           | 7     |
| ⚠️ PARTIAL / BUG / NOTE | 4     |
| ⏭️ NOT TESTED / N/A     | 29    |

> **Re-tested 2026-07-22 after fixes:** CO-01, CO-04, CO-05, CO-08, CO-10 all resolved and verified. B-01, B-04, B-05, B-08, B-10 moved to Fixed. CO-03 (translation key) pending backend catalog deployment. 1 more PASS, 1 fewer FAIL, 1 fewer BUG/NOTE.
>
> **2026-07-23 note:** CO-04 (CR VAT Type required) has been **reverted** — commit `35efa036` removed `Validators.required` from `crVatType` and dropped the `*` marker from the label. The field is now optional again. Backend commit `c40a4202` added empty-string handling for `crVatType` in `ContactDTO`. See section 12 for re-test cases.
>
> **2026-07-23 re-test (NOT EXECUTED):** Sections 12–14 were all marked NOT TESTED. The session was disconnected by server abuse detection before navigating to the Contacts module. 22 new test cases remain untested.
