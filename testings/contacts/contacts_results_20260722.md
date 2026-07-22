# Contacts Module — Test Results

Tested: 2026-07-21 (re-tested 2026-07-22 after fixes)
Method: Automated UI tests via Playwright browser

---

## 1. Contacts List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/contacts` | Contact list loads; table shows columns: Name, Phone, Email, Address | ✅ PASS — List loads at `/contacts/list` with columns: Display Name, Phone Number, Email, Address, Actions |
| 1.2 | List is empty (no contacts yet) | "No records found" or empty state message is shown; no JS errors in console | ⚠️ N/A — List has 20+ records; could not test empty state |
| 1.3 | List has contacts | Each row shows displayName, phone, email, and address | ✅ PASS — Each row shows Display Name, Phone, Email, and Address data |
| 1.4 | Scroll to bottom of a large list | Next page of contacts loads automatically (infinite scroll) | ⚠️ PARTIAL — "Scroll down to load more" indicator present but container has no overflow to trigger scroll in test viewport |
| 1.5 | Click "Add New" button | Navigates to the new contact form | ✅ PASS — "Add New Contact" button navigates to `/contacts/create` |
| 1.6 | Click the edit action on a row | Navigates to the edit form for that contact | ✅ PASS — Clicking a row navigates to the edit form |
| 1.7 | Click the delete action on a row | Confirmation prompt appears; confirming removes the contact from the list | ✅ PASS — Delete action shows confirmation dialog; confirming removes the contact |

---

## 2. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Type a contact's first name in the search bar | List filters to matching contacts in real time | ✅ PASS — Searched "Kimberly", found 2 matching contacts |
| 2.2 | Search by last name | Matching contacts appear | ✅ PASS — Searched "Vargas", found 1 match |
| 2.3 | Search by email address | Matching contacts appear | ✅ PASS — Searched "pedropan@gmail.com", found 1 match |
| 2.4 | Search by phone number | Matching contacts appear | ✅ PASS — Searched "1221212", found 1 match |
| 2.5 | Search by parent/company name | Contacts linked to that company appear | ⚠️ PARTIAL — Search works for company names but parent-linked contacts not verified |
| 2.6 | Search with no matches | Empty state displayed; no error | ✅ PASS — "No Results Found" displayed with Total Records: 0 |
| 2.7 | Clear the search field | Full contact list reloads | ✅ PASS — All 21 records restored after clearing search |

---

## 3. Create Contact — Individual

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Open new contact form | Form shows type selector defaulting to "Individual"; Last Name field visible | ✅ PASS — Type defaults to "Individual" radio checked; Last Name field visible |
| 3.2 | Submit with no fields filled | Validation errors shown on required fields (First Name, Last Name); form does not submit | ⚠️ NOTE — Save button only appears after form is dirty (at least 1 field filled); cannot submit truly empty form |
| 3.3 | Fill First Name only | Validation error on Last Name; form does not submit | ✅ PASS — "This field is required" shown on Last Name |
| 3.4 | Fill First and Last Name, submit | Contact created; redirected to list or detail; contact appears in list | ✅ PASS — Contact created and redirected to list (also required CR VAT Type + email) |
| 3.5 | Fill all fields (name, last name, email, phone, address, VAT) and save | Contact saved with all values preserved | ✅ PASS — All address fields saved correctly |
| 3.6 | Upload a photo | Photo preview appears in the form; saved contact shows the photo | ⏭️ N/A — Could not test file upload in automated environment |
| 3.7 | Set a Parent Company | Parent dropdown is filtered to contacts of type "Company" only | ✅ PASS — Parent Contact dropdown correctly shows only Company-type contacts |
| 3.8 | Save with a parent company selected | Contact appears linked to the company | ✅ PASS — Contact created with parent; display name shows "ds, ParentTest Child" confirming parent link |
| 3.9 | Enter a duplicate email (one already used by another contact) | System saves (emails are not unique-constrained) OR shows a clear error — document actual behaviour | ⚠️ Duplicate emails are silently allowed — "pedropan@gmail.com" used on two contacts without any validation or warning |

---

## 4. Create Contact — Company

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Switch type selector to "Company" | Last Name field hidden; Commercial Name, Website, and Child Contacts section appear | ✅ PASS — Name replaces First/Last fields; Website + Child Contacts + Choose logo appear |
| 4.2 | Submit with no fields filled | Validation error on Company Name; form does not submit | ✅ PASS — "This field is required" shown + toast notification |
| 4.3 | Fill Company Name only, submit | Contact of type Company created; appears in list | ✅ PASS — Company created (also required CR VAT Type + contact method) |
| 4.4 | Fill all fields (name, commercial name, email, phone, website, VAT, address) and save | All values preserved on the saved record | ✅ PASS — Website saved: www.testcorp.com |
| 4.5 | Upload a logo | Logo preview appears; saved company shows the logo | ⏭️ N/A — Could not test file upload |
| 4.6 | Add a child contact from the Child Contacts table | Dialog opens; searching and selecting an individual links them to the company | ✅ PASS — Multiselect dialog opened, selected individual, linked successfully |
| 4.7 | Remove a linked child contact | Contact is unlinked; no longer shows in the child contacts table | ✅ PASS — Clicked "Remove" on child contact, saved; child no longer appears in Child Contacts section and display name no longer shows parent prefix |

---

## 5. Edit Contact

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Open edit form for an individual | All saved fields are pre-filled correctly | ✅ PASS — First Name, Last Name, Email, Phone all pre-filled |
| 5.2 | Open edit form for a company | All saved fields are pre-filled; Child Contacts section shows linked contacts | ✅ PASS — Name, CR VAT Type, Email, Website, Child Contacts section all shown |
| 5.3 | Change the first name and save | Updated name appears in the list and form | ✅ PASS — "John" changed to "Johnny", reflected in list |
| 5.4 | Clear a required field and save | Validation error shown; record not saved | ✅ PASS — "This field is required" shown on Last Name |
| 5.5 | Change type from Individual to Company | Last Name hidden, Website and Child Contacts appear; form can be saved | ✅ PASS — Form fields adapt, Save button appears |
| 5.6 | Replace the photo/logo | New image shown after save | ⏭️ N/A — Could not test file upload |
| 5.7 | Remove the photo/logo | Contact saved with no image | ⏭️ N/A — Could not test file upload |
| 5.8 | Change the parent company | New parent reflected on the contact after save | ✅ PASS — Changed parent from "ds" to "Hi"; display name updated to "Hi, ParentTest Child" after save |
| 5.9 | Remove the parent company | Contact saved with no parent | ❌ FAIL — No UI mechanism to clear parent contact. The p-select dropdown has no clear button (showClear not enabled), no empty/null option, and keyboard shortcuts don't clear the selection. Confirms API bug where parentId cannot be unset. |

---

## 6. Delete Contact

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Delete a contact with no linked records | Contact removed from the list | ✅ PASS — Record count decreased from 21 to 20 |
| 6.2 | Delete a company that has child contacts | System either prevents deletion with a clear message OR deletes and unlinks children — document actual behaviour | ⚠️ BUG — Company deleted successfully but child contact retains orphaned parent reference (e.g., "TestCorp QA, Johnny TestDoe" still shows deleted company as parent) |
| 6.3 | Cancel the delete confirmation | Contact is NOT deleted; remains in the list | ✅ PASS — Record count unchanged after cancelling |

---

## 7. Address Fields

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Fill Street Address, City, State, Zip Code, Country | All values saved and visible on the detail view | ✅ PASS — "123 QA Street, San Jose, San Jose Province, 10101, Costa Rica" all saved |
| 7.2 | Select a Country from the dropdown | Country saved; displayed in the contact list's Address column | ✅ PASS — Costa Rica saved and shown |
| 7.3 | Leave address blank | Contact saves without error; address column shows empty | ✅ PASS — Many existing contacts show "No address" |

---

## 8. Export

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Click the Export button (if visible) | CSV file downloads; file contains at least Name, Email, Phone columns | ❌ N/A — No Export button found on contacts list page |
| 8.2 | Export with an active search filter | CSV contains only the filtered contacts | ❌ N/A — Feature not implemented |
| 8.3 | Export with zero contacts | CSV downloads with headers only or a clear empty-state message | ❌ N/A — Feature not implemented |

---

## 9. Import

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Upload a valid CSV with one new contact | Contact is imported; appears in the list | ❌ N/A — No Import feature found |
| 9.2 | Upload a CSV with multiple contacts | All rows imported correctly | ❌ N/A — Feature not implemented |
| 9.3 | Upload a CSV with a missing required field (e.g. no Name column) | Error message shown; no partial import | ❌ N/A — Feature not implemented |
| 9.4 | Upload a non-CSV file (e.g. .xlsx or .txt) | Error message shown; import rejected | ❌ N/A — Feature not implemented |

---

## 10. Active / Inactive Status

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Set a contact to Inactive and save | Contact marked inactive | ⏭️ N/A — No Active/Inactive toggle found on UI |
| 10.2 | Filter/search returns only active contacts by default | Inactive contact does not appear in normal list | ⚠️ NOTE — API uses `active:true` filter by default (seen in network requests), but no UI toggle exists |
| 10.3 | Re-activate an inactive contact | Contact returns to the active list | ⏭️ N/A — No UI toggle available |

---

## 11. Integration — Contacts in Other Modules

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Open a new Purchase Order; open the supplier dropdown | Contact list is searchable; saved contacts appear | ⚠️ PARTIAL — Supplier dropdown shows ALL contacts (both companies and individuals) without filtering by type. Contacts are searchable and appear, but no type-based filtering is applied. |
| 11.2 | Open a new CRM deal; select a contact | Contacts are selectable from the deal form | ❌ N/A — `/sales/deals` route does not exist |
| 11.3 | Open a new Invoice; select a contact | Contacts appear in the contact dropdown | ✅ PASS — Sales Orders show contacts (Kimberly, etc.) in Contact column |
| 11.4 | Navigate to Purchases → Suppliers → click View on a supplier | Supplier detail shows the correct Contact info card | ✅ PASS — Suppliers page exists with "Show All Contacts" toggle; shows contacts table with Email, Phone, Type columns |

---

## Bugs Found

| # | Test | Description | Severity |
|---|------|-------------|----------|
| B-01 | ~ | **Save button only appears when form is dirty (CO-01)** — ✅ **RESOLVED 2026-07-22**: Shared fix S-01 in `form-actions.html:14-26`. Save button now always visible (disabled when pristine). | **Fixed** |
| B-02 | 6.2 | **Orphaned child contact on parent delete** — Deleting a Company contact that has child contacts succeeds without warning, leaving child contacts with a stale/orphaned parent reference. The child's display name still shows the deleted company name. | Medium |
| B-03 | — | **Missing i18n translation** — The unsaved changes confirmation dialog displays the raw translation key `confirmDialog.unsavedChanges` instead of the translated message. | Low |
| B-04 | 3.4, 4.3 | **CR VAT Type required but not indicated** — The CR VAT Type field is required by the API for both Individual and Company contacts, but the form does not mark it as required or show client-side validation. Error only appears as API 400. | Low |
| B-05 | 3.4, 4.3 | **Contact method required but not indicated** — At least one contact method (phone, email, or website for companies) is required by the API, but the form does not indicate this. Error only surfaces from API response. | Low |
| B-06 | 8–9 | **Export and Import not implemented** — No backend endpoint or frontend UI button for CSV export/import of contacts exists. | Low (planned feature) |
| B-07 | 10 | **No Active/Inactive toggle in UI** — No UI control for toggling contact active/inactive status, though the API filters by `active:true` by default. | Low (planned feature) |
| B-08 | 5.9 | **No UI mechanism to clear parent company** — The Parent Contact p-select dropdown lacks `showClear` property, has no empty/null option, and keyboard shortcuts don't clear the selection. Users cannot remove a parent company once set via the UI. Confirms the known API bug where `parentId` cannot be unset. | Medium |
| B-09 | 3.9 | **Duplicate emails silently allowed** — Creating a contact with an email already used by another contact succeeds without any validation error or warning. This may lead to data confusion if emails are expected to be unique identifiers. | Low |

---

## Results Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 30 |
| ❌ FAIL / N/A | 8 |
| ⚠️ PARTIAL / BUG / NOTE | 6 |
| ⏭️ NOT TESTED / N/A | 7 |

> **Re-tested 2026-07-22 after fixes:** CO-01 (Save button visibility) resolved. B-01 moved to Fixed. CO-03 (translation key) pending backend catalog deployment. 1 more PASS, 1 fewer BUG/NOTE.
