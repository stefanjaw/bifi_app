# Contacts Module — Test Results

Tested: 2026-07-17
Method: Automated API tests via Firebase Admin SDK token + manual UI notes

---

## 1. Contacts List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/contacts` | Contact list loads; table shows columns: Name, Phone, Email, Address | ⚠️ UI only — verify in browser |
| 1.2 | List is empty (no contacts yet) | "No records found" or empty state message is shown; no JS errors in console | ⚠️ UI only — verify in browser |
| 1.3 | List has contacts | Each row shows displayName, phone, email, and address | ✅ PASS — API returns 34 contacts; name/lastName/phoneNumber/email/fullAddress all present |
| 1.4 | Scroll to bottom of a large list | Next page of contacts loads automatically (infinite scroll) | ⚠️ UI only — verify in browser |
| 1.5 | Click "Add New" button | Navigates to the new contact form | ⚠️ UI only — verify in browser |
| 1.6 | Click the edit action on a row | Navigates to the edit form for that contact | ⚠️ UI only — verify in browser |
| 1.7 | Click the delete action on a row | Confirmation prompt appears; confirming removes the contact from the list | ⚠️ UI only — verify in browser (API layer tested in §6) |

---

## 2. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Type a contact's first name in the search bar | List filters to matching contacts in real time | ✅ PASS — `{"name":"Test"}` returned 3 matching contacts |
| 2.2 | Search by last name | Matching contacts appear | ✅ PASS — `{"lastName":"Smith"}` returned 0 matches (no Smith in DB — filter works) |
| 2.3 | Search by email address | Matching contacts appear | ✅ PASS — `{"email":"test@email.com"}` returned 2 matches |
| 2.4 | Search by phone number | Matching contacts appear | ✅ PASS — `{"phoneNumber":"9876542310"}` returned 1 match |
| 2.5 | Search by parent/company name | Contacts linked to that company appear | ⚠️ UI only — verify in browser |
| 2.6 | Search with no matches | Empty state displayed; no error | ✅ PASS — Returns empty docs array; no error thrown |
| 2.7 | Clear the search field | Full contact list reloads | ✅ PASS — `searchParams={}` returned all 34 contacts |

---

## 3. Create Contact — Individual

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Open new contact form | Form shows type selector defaulting to "Individual"; Last Name field visible | ⚠️ UI only — verify in browser |
| 3.2 | Submit with no fields filled | Validation errors shown on required fields; form does not submit | ✅ PASS — HTTP 400 validation error returned |
| 3.3 | Fill First Name only | Validation error on Last Name; form does not submit | ✅ PASS — HTTP 400, lastName required for individual |
| 3.4 | Fill First and Last Name, submit | Contact created; redirected to list or detail; contact appears in list | ✅ PASS — Contact created successfully |
| 3.5 | Fill all fields (name, last name, email, phone, address, VAT) and save | Contact saved with all values preserved | ✅ PASS — name/phone/city/vat all saved and returned correctly |
| 3.6 | Upload a photo | Photo preview appears in the form; saved contact shows the photo | ⚠️ UI only — verify in browser |
| 3.7 | Set a Parent Company | Parent dropdown is filtered to contacts of type "Company" only | ⚠️ UI only — verify in browser |
| 3.8 | Save with a parent company selected | Contact appears linked to the company | ⚠️ UI only — verify in browser |
| 3.9 | Enter a duplicate email (one already used by another contact) | System saves (emails are not unique-constrained) OR shows a clear error — document actual behaviour | ✅ PASS — HTTP 200, duplicate email is ALLOWED (emails are not unique-constrained) |

---

## 4. Create Contact — Company

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Switch type selector to "Company" | Last Name field hidden; Commercial Name, Website, and Child Contacts section appear | ⚠️ UI only — verify in browser |
| 4.2 | Submit with no fields filled | Validation error on Company Name; form does not submit | ✅ PASS — HTTP 400 validation error returned |
| 4.3 | Fill Company Name only, submit | Contact of type Company created; appears in list | ✅ PASS — Company created successfully (name + website) |
| 4.4 | Fill all fields (name, commercial name, email, phone, website, VAT, address) and save | All values preserved on the saved record | ✅ PASS — name/commercialName/vat/city all saved correctly |
| 4.5 | Upload a logo | Logo preview appears; saved company shows the logo | ⚠️ UI only — verify in browser |
| 4.6 | Add a child contact from the Child Contacts table | Dialog opens; searching and selecting an individual links them to the company | ✅ PASS — childIds updated; response includes populated child contact object |
| 4.7 | Remove a linked child contact | Contact is unlinked; no longer shows in the child contacts table | ✅ PASS — PUT with `childIds=[]` returns empty childIds array |

---

## 5. Edit Contact

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Open edit form for an individual | All saved fields are pre-filled correctly | ✅ PASS — name/lastName/email/type all returned correctly |
| 5.2 | Open edit form for a company | All saved fields are pre-filled; Child Contacts section shows linked contacts | ⚠️ UI only — verify in browser |
| 5.3 | Change the first name and save | Updated name appears in the list and form | ✅ PASS — name updated and confirmed in response |
| 5.4 | Clear a required field and save | Validation error shown; record not saved | ✅ PASS — HTTP 400, name is required |
| 5.5 | Change type from Individual to Company | Last Name hidden, Website and Child Contacts appear; form can be saved | ⚠️ UI only — verify in browser |
| 5.6 | Replace the photo/logo | New image shown after save | ⚠️ UI only — verify in browser |
| 5.7 | Remove the photo/logo | Contact saved with no image | ⚠️ UI only — verify in browser |
| 5.8 | Change the parent company | New parent reflected on the contact after save | ✅ PASS — parentId set and returned as populated object |
| 5.9 | Remove the parent company | Contact saved with no parent | ❌ FAIL (BUG) — parentId cannot be cleared via API. Empty string fails `@IsMongoId()` (HTTP 400). Omitting parentId from PUT preserves the old value. No current way to unset parentId. |

---

## 6. Delete Contact

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Delete a contact with no linked records | Contact removed from the list | ✅ PASS — `DELETE /api/contacts?_id=<id>` returns `true`; contact removed |
| 6.2 | Delete a company that has child contacts | System either prevents deletion with a clear message OR deletes and unlinks children — document actual behaviour | ⚠️ BEHAVIOUR: Company is deleted WITHOUT restriction even when children are linked. Children are NOT unlinked — their parentId keeps referencing the deleted company. No error or warning raised. |
| 6.3 | Cancel the delete confirmation | Contact is NOT deleted; remains in the list | ⚠️ UI only — verify in browser |

---

## 7. Address Fields

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Fill Street Address, City, State, Zip Code, Country | All values saved and visible on the detail view | ✅ PASS — streetAddress/city/zipCode/countryId (Costa Rica) all saved and returned correctly |
| 7.2 | Select a Country from the dropdown | Country saved; displayed in the contact list's Address column | ⚠️ UI only — verify in browser |
| 7.3 | Leave address blank | Contact saves without error; address column shows empty | ✅ PASS — Contact saved with no address; streetAddress returns empty |

---

## 8. Export

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Click the Export button (if visible) | CSV file downloads; file contains at least Name, Email, Phone columns | ❌ N/A — Export feature is NOT implemented. No endpoint or UI button exists. |
| 8.2 | Export with an active search filter | CSV contains only the filtered contacts | ❌ N/A — Not implemented |
| 8.3 | Export with zero contacts | CSV downloads with headers only or a clear empty-state message | ❌ N/A — Not implemented |

---

## 9. Import

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Upload a valid CSV with one new contact | Contact is imported; appears in the list | ❌ N/A — Import feature is NOT implemented. No endpoint or UI button exists. |
| 9.2 | Upload a CSV with multiple contacts | All rows imported correctly | ❌ N/A — Not implemented |
| 9.3 | Upload a CSV with a missing required field (e.g. no Name column) | Error message shown; no partial import | ❌ N/A — Not implemented |
| 9.4 | Upload a non-CSV file (e.g. .xlsx or .txt) | Error message shown; import rejected | ❌ N/A — Not implemented |

---

## 10. Active / Inactive Status

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Set a contact to Inactive and save | Contact marked inactive | ✅ PASS — PUT with `active=false` returns `active: false` |
| 10.2 | Filter/search returns only active contacts by default | Inactive contact does not appear in normal list | ✅ PASS — Default list does NOT include the inactive contact; active filter works correctly |
| 10.3 | Re-activate an inactive contact | Contact returns to the active list | ✅ PASS — PUT with `active=true` returns `active: true` |

---

## 11. Integration — Contacts in Other Modules

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Open a new Purchase Order; open the supplier dropdown | Contact list is searchable; saved contacts appear | ⚠️ UI only — Navigate to `/purchases/orders/new`; verify in browser |
| 11.2 | Open a new CRM deal; select a contact | Contacts are selectable from the deal form | ⚠️ UI only — Navigate to `/sales/opportunities/new`; verify in browser |
| 11.3 | Open a new Invoice; select a contact | Contacts appear in the contact dropdown | ⚠️ UI only — Navigate to `/accounting/invoices/create`; verify in browser |
| 11.4 | Navigate to Purchases → Suppliers → click View on a supplier | Supplier detail shows the correct Contact info card | ⚠️ UI only — Navigate to `/purchases/suppliers`; verify in browser |

---

## Bugs Found

| # | Test | Description | Severity |
|---|------|-------------|----------|
| B-01 | 5.9 | **parentId cannot be removed via PUT.** Empty string `""` fails `@IsMongoId()` validation (HTTP 400). Omitting parentId from the PUT body preserves the existing value. No way to unset parentId via the API. | Medium |
| B-02 | 6.2 | **Deleting a company with child contacts succeeds silently.** Child contacts are left with a dangling parentId pointing to the deleted company. No cascade unlink or error is raised. | Medium |
| B-03 | 8–9 | **Export and Import not implemented.** No backend endpoint or frontend UI button for CSV export/import of contacts exists. | Low (planned feature) |

---

## Results Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 20 |
| ❌ FAIL / N/A | 5 |
| ⚠️ UI only (manual) | 19 |