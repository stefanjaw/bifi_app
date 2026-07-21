# Contacts Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

---

## 1. Contacts List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/contacts` | Contact list loads; table shows columns: Name, Phone, Email, Address | |
| 1.2 | List is empty (no contacts yet) | "No records found" or empty state message is shown; no JS errors in console | |
| 1.3 | List has contacts | Each row shows displayName, phone, email, and address | |
| 1.4 | Scroll to bottom of a large list | Next page of contacts loads automatically (infinite scroll) | |
| 1.5 | Click "Add New" button | Navigates to the new contact form | |
| 1.6 | Click the edit action on a row | Navigates to the edit form for that contact | |
| 1.7 | Click the delete action on a row | Confirmation prompt appears; confirming removes the contact from the list | |

---

## 2. Search & Filters

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Type a contact's first name in the search bar | List filters to matching contacts in real time | |
| 2.2 | Search by last name | Matching contacts appear | |
| 2.3 | Search by email address | Matching contacts appear | |
| 2.4 | Search by phone number | Matching contacts appear | |
| 2.5 | Search by parent/company name | Contacts linked to that company appear | |
| 2.6 | Search with no matches | Empty state displayed; no error | |
| 2.7 | Clear the search field | Full contact list reloads | |

---

## 3. Create Contact — Individual

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Open new contact form | Form shows type selector defaulting to "Individual"; Last Name field visible | |
| 3.2 | Submit with no fields filled | Validation errors shown on required fields (First Name, Last Name); form does not submit | |
| 3.3 | Fill First Name only | Validation error on Last Name; form does not submit | |
| 3.4 | Fill First and Last Name, submit | Contact created; redirected to list or detail; contact appears in list | |
| 3.5 | Fill all fields (name, last name, email, phone, address, VAT) and save | Contact saved with all values preserved | |
| 3.6 | Upload a photo | Photo preview appears in the form; saved contact shows the photo | |
| 3.7 | Set a Parent Company | Parent dropdown is filtered to contacts of type "Company" only | |
| 3.8 | Save with a parent company selected | Contact appears linked to the company | |
| 3.9 | Enter a duplicate email (one already used by another contact) | System saves (emails are not unique-constrained) OR shows a clear error — document actual behaviour | |

---

## 4. Create Contact — Company

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Switch type selector to "Company" | Last Name field hidden; Commercial Name, Website, and Child Contacts section appear | |
| 4.2 | Submit with no fields filled | Validation error on Company Name; form does not submit | |
| 4.3 | Fill Company Name only, submit | Contact of type Company created; appears in list | |
| 4.4 | Fill all fields (name, commercial name, email, phone, website, VAT, address) and save | All values preserved on the saved record | |
| 4.5 | Upload a logo | Logo preview appears; saved company shows the logo | |
| 4.6 | Add a child contact from the Child Contacts table | Dialog opens; searching and selecting an individual links them to the company | |
| 4.7 | Remove a linked child contact | Contact is unlinked; no longer shows in the child contacts table | |

---

## 5. Edit Contact

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Open edit form for an individual | All saved fields are pre-filled correctly | |
| 5.2 | Open edit form for a company | All saved fields are pre-filled; Child Contacts section shows linked contacts | |
| 5.3 | Change the first name and save | Updated name appears in the list and form | |
| 5.4 | Clear a required field and save | Validation error shown; record not saved | |
| 5.5 | Change type from Individual to Company | Last Name hidden, Website and Child Contacts appear; form can be saved | |
| 5.6 | Replace the photo/logo | New image shown after save | |
| 5.7 | Remove the photo/logo | Contact saved with no image | |
| 5.8 | Change the parent company | New parent reflected on the contact after save | |
| 5.9 | Remove the parent company | Contact saved with no parent | |

---

## 6. Delete Contact

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Delete a contact with no linked records | Contact removed from the list | |
| 6.2 | Delete a company that has child contacts | System either prevents deletion with a clear message OR deletes and unlinks children — document actual behaviour | |
| 6.3 | Cancel the delete confirmation | Contact is NOT deleted; remains in the list | |

---

## 7. Address Fields

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Fill Street Address, City, State, Zip Code, Country | All values saved and visible on the detail view | |
| 7.2 | Select a Country from the dropdown | Country saved; displayed in the contact list's Address column | |
| 7.3 | Leave address blank | Contact saves without error; address column shows empty | |

---

## 8. Export

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Click the Export button (if visible) | CSV file downloads; file contains at least Name, Email, Phone columns | |
| 8.2 | Export with an active search filter | CSV contains only the filtered contacts | |
| 8.3 | Export with zero contacts | CSV downloads with headers only or a clear empty-state message | |

---

## 9. Import

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Upload a valid CSV with one new contact | Contact is imported; appears in the list | |
| 9.2 | Upload a CSV with multiple contacts | All rows imported correctly | |
| 9.3 | Upload a CSV with a missing required field (e.g. no Name column) | Error message shown; no partial import | |
| 9.4 | Upload a non-CSV file (e.g. .xlsx or .txt) | Error message shown; import rejected | |

---

## 10. Active / Inactive Status

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Set a contact to Inactive and save | Contact marked inactive | |
| 10.2 | Filter/search returns only active contacts by default | Inactive contact does not appear in normal list | |
| 10.3 | Re-activate an inactive contact | Contact returns to the active list | |

---

## 11. Integration — Contacts in Other Modules

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Open a new Purchase Order; open the supplier dropdown | Contact list is searchable; saved contacts appear | |
| 11.2 | Open a new CRM deal; select a contact | Contacts are selectable from the deal form | |
| 11.3 | Open a new Invoice; select a contact | Contacts appear in the contact dropdown | |
| 11.4 | Navigate to Purchases → Suppliers → click View on a supplier | Supplier detail shows the correct Contact info card | |