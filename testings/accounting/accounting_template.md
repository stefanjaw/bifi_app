# Accounting Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** Accounting CRUD (accounts, journals, journal-entries/invoices, payments, taxes, discounts, payment-terms, fiscal-positions) + the new GL reporting layer (Phase L): Reports screen at `/accounting/reports` (Balanza, Ledger drill-down, PyG, IVA, Customer Sales) and automatic closing entries, plus the invoice/payment integrity fixes (B1–B7, A1, A2, A2b, B/B2 sweep).
>
> **Pre-requisites:**
> - Backend running (`npm run dev` in `bifi_app_be`) and frontend on `http://localhost:4200`.
> - Logged user with permissions on all accounting resources including `accounting/gl: read` and `accounting/gl: update`.
> - Chart of accounts with PGC-style codes: `572` Banks (asset), `430` Clients (asset), `400` Suppliers (liability), `472`/`477` VAT (asset/liability), `600`/`700` expense/income, at least two `equity` accounts (129-like result + 112 reserves).
> - Journals: at least one `sales` journal, one `purchase` journal, one `bank` journal with default debit/credit accounts, and an active **general** journal (used by GL auto-postings).
> - Settings → Accounting Configuration filled: `purchasePayableAccountId`, `discountGrantedAccountId`, `inventoryAccounts` (inventory + COGS + adjustment loss) and default currency.
> - At least one Tax record whose `accountId` points to 472 (purchases) / 477 (sales).
> - API verification: use header `x-api-key` (see execution_guidelines.md) with `curl` against `http://localhost:PORT/api/...` when UI verification of persisted data is needed.
>
> **Naming note:** Buttons on the Reports screen are translated (Generate / Closing / Back). Tabs are: Balanza, PyG, IVA, customerSales. "JE" = Journal Entry. Invoices ARE Journal Entries with `isInvoice: true` (single collection).

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Expand the sidebar and open the Accounting menu | Accounting section shows the Reports entry along with the accounting CRUD entities | |
| 1.2 | Click the Reports menu item | Navigates to `/accounting/reports`; screen loads with title, filter bar (From date, To date, Currency, Year) and two header buttons (Generate, Closing) | |
| 1.3 | Inspect the Reports screen | 4 tabs visible: Balanza, PyG, IVA, customerSales; Balanza tab active by default; a progress bar shows only while loading | |
| 1.4 | Open each other accounting list (Invoices, Payments, Journals, Accounts) via sidebar | Each list loads without console errors | |

---

## 2. Reports — Balanza / Trial Balance (Ej. 35, `GET /accounting/gl/trial-balance`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | With at least one posted invoice in the default period (Jan 1 → Dec 31 of current year), click Generate | Table fills with one row per account: code, name, nature (type), currency, Debit, Credit, balance | |
| 2.2 | Check the totals block under the table | Total Debit and Total Credit are the Σ of all rows; the "Balanced" tag shows success (Σ Debit = Σ Credit) | |
| 2.3 | Narrow the date range to a single month containing one known invoice and Generate | Only activity inside the range is aggregated; totals shrink accordingly | |
| 2.4 | Select a currency in the filter and Generate | Only JEs posted in that currency are aggregated (grouping is per account+currency) | |
| 2.5 | Set a range with no postings (e.g. a past year without data) and Generate | Empty table or zeroed totals; no console/network errors | |
| 2.6 | Cross-check one account's Debit/Credit against `curl GET /api/accounting/gl/trial-balance?from=...&to=...` | UI values match the API response | |

---

## 3. Reports — Ledger Drill-Down (Ej. 6, `GET /accounting/gl/ledger/:accountId`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | On the Balanza tab, click "Ledger" on a row (e.g. account 430 Clients with a posted invoice) | View switches to the Ledger of that account: header tag with account name, movements table and a Back button | |
| 3.2 | Inspect the opening balance | Opening balance equals the sum of posted JEs dated **before** the From date | |
| 3.3 | Inspect the movements table | One row per JE line in the period (date, reference, debit, credit) with a running balance that evolves row by row | |
| 3.4 | Check the closing balance | Closing balance = opening balance + (period debits − period credits); matches the balance shown for that account in the Balanza | |
| 3.5 | Click Back | Returns to the Balanza table with previous filters intact | |
| 3.6 | Open the Ledger of an account with no movements in the period | Opening = closing; empty movements table; no errors | |

---

## 4. Reports — Tab Switching (regression: tab change must call the matching endpoint)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Click the PyG tab, then click Generate | `GET /api/accounting/gl/income-expenses?...` is fired (NOT `trial-balance`); PyG table loads in the PyG panel | |
| 4.2 | Click the IVA tab, then click Generate | `GET /api/accounting/gl/tax-balances?...` is fired; tax table loads in the IVA panel | |
| 4.3 | Click the customerSales tab, then click Generate | `GET /api/accounting/gl/customer-sales?...` is fired; customer sales table loads **inside the 4th panel** (previously the panel had a mismatched value `"3"` and showed no content) | |
| 4.4 | Go back to Balanza and click Generate | `GET /api/accounting/gl/trial-balance?...` is fired again | |
| 4.5 | Click through all 4 tabs consecutively without generating | Active panel highlight follows the clicked tab every time; no console errors | |

---

## 5. Reports — PyG / Income & Expenses (Ej. 36 base, `GET /accounting/gl/income-expenses`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | With posted income and expense JEs in the selected year, open PyG and Generate | Table lists only accounts of type `income`/`expense` with YTD amounts | |
| 5.2 | Check the totals block | Income Total, Expense Total and Result = Income − Expense; sign is positive for profit, negative for loss | |
| 5.3 | Change the Year field to a different year and Generate | Aggregates recompute for that year only | |
| 5.4 | Select a currency and Generate | Aggregates respect the currency filter | |

---

## 6. Reports — IVA (Ej. 19 base, `GET /accounting/gl/tax-balances`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | With posted sales invoices (477) and purchase invoices (472) in the period, open IVA and Generate | Rows appear ONLY for the accounts configured in `Tax.accountId` (472/477), not for every account | |
| 6.2 | Verify amounts | 477 accumulated equals Σ VAT of posted sales invoices in range; 472 equals Σ VAT of posted purchase invoices in range | |
| 6.3 | Change the date range and Generate | Aggregates follow the range | |

---

## 7. Reports — Customer Sales (Ej. 9 base, `GET /accounting/gl/customer-sales`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | With posted sales invoices for at least 2 different contacts, open customerSales and Generate | One row per customer with YTD sales total; contact names hydrated (not raw IDs) | |
| 7.2 | Cross-check one customer | Row total equals Σ net amount of that contact's posted sales invoices for the year (credit notes reduce it) | |
| 7.3 | Set Year to a year with no invoices and Generate | Empty result set; no errors | |

---

## 8. Closing Entries (Ej. 33/34, `POST /accounting/gl/closing-entries` — includes currencyId fix)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | **Regression (bug fixed):** leave Currency filter empty and click Closing | Closing runs successfully — NO 400 validation error `"property currencyId should not exist"`; an info tag shows the period and result amount | |
| 8.2 | Verify the generated closing JE (via journal entries list or API) | One POSTED JE with expenses on the Credit side, income on the Debit side, and a result line against the first `equity` account; reference = `Closing entries of YYYY` | |
| 8.3 | Verify the opening JE | A second JE exists with every line inverted (Debe↔Haber), dated Jan 1 of the next year, reference = `Opening entries of YYYY+1` | |
| 8.4 | Click Closing again for the same year | Rejected as duplicate (idempotent guard on `reference = "Closing entries of YYYY"`); no second closing JE is created | |
| 8.5 | Select a specific currency and click Closing | Runs without validation error (currencyId is a valid MongoId in the body) | |
| 8.6 | After closing, open Reports → PyG | Income/expense YTD still shows the pre-closing activity (closing JEs do not alter the report source since they net through equity — document actual behaviour if different) | |

---

## 9. Invoice Integrity — Edit & Status Guards (B1/B2)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Edit a DRAFT invoice: change a product line quantity and save | Line totals recalculated AND the JE lines (counterpart + tax) are rebuilt — the entry stays balanced (Σ Debit = Σ Credit) | |
| 9.2 | Edit a draft invoice changing its journal from sales to purchase and save | JE lines re-derived with the new orientation (A1/B1 interaction) | |
| 9.3 | Try to edit a POSTED invoice (edit URL/action) | Validation error — posted invoices cannot be edited; nothing is persisted | |
| 9.4 | Try to edit a CANCELLED invoice | Validation error; nothing is persisted | |

---

## 10. Invoice Cancel & Reversal (B3)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Cancel a POSTED invoice without payments | Status → cancelled; a reversal JE is created with every line inverted and `reversalOf` pointing to the original; transactional (both saved or neither) | |
| 10.2 | Cancel a DRAFT invoice | Cancelled with NO reversal JE created | |
| 10.3 | Try to cancel a posted invoice that has CONFIRMED payments | Blocked with a validation error about confirmed payments | |
| 10.4 | After 10.1, open Reports → Balanza for the period | The cancelled invoice no longer affects balances (its reversal nets it out) | |

---

## 11. Invoice Numbering at Post (B4)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Create a draft invoice (do not post) and check it in the list/API | Draft has NO invoice number; sequence counter NOT consumed | |
| 11.2 | Post the draft | Number assigned exactly at posting; matches the current sequence value | |
| 11.3 | Create another draft, then delete/cancel it before posting, then create and post a third invoice | The third invoice gets the next consecutive number (the abandoned draft consumed nothing) | |

---

## 12. Multi-Installment Due Dates (B5)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | On an invoice form, select a payment term with 2–3 installments (percentage + dueDays per installment) | Due-date chips appear showing each installment: proportional amount and computed date | |
| 12.2 | Change the payment term to a single-installment term | Chips collapse to one installment; dueDate = invoice date + dueDays | |
| 12.3 | Save and post the invoice, then inspect the JE via API | `dueDates` array persisted (`[{amount, date}, ...]`) ordered by date; `dueDate` field equals the last installment date | |
| 12.4 | Change the invoice date on a draft with installments | Installment dates recalculate from the new invoice date | |

---

## 13. Payments — Edit Route (B6)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Open Accounting → Payments list, click edit on a payment | Navigates to `payments/edit/:id` (route exists — previously broken); form opens pre-filled | |
| 13.2 | Modify the amount and save | PUT succeeds; persisted value verifiable via API/list | |
| 13.3 | From a posted invoice's Payments tab, edit an existing payment | Same edit form works from the invoice context | |

---

## 14. Credit Note (B7, `POST /invoices/:id/credit-note`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | On a POSTED sales invoice with pending amount, click "Crear nota de crédito" | New JE created with every line inverted (Debe↔Haber), flagged `isCreditNote` + `reversalOf` = source, and its OWN number | |
| 14.2 | Check the source invoice after the NC | Its `amountDue` was reduced by the credit note amount; `isFullyPaid` recalculates when fully credited | |
| 14.3 | Try a credit note for more than the pending amount | Rejected (pending must be > 0 and credit ≤ pending) | |
| 14.4 | Try a credit note on a DRAFT invoice | Rejected (source must be posted) | |

---

## 15. Purchase Invoice Orientation (A1, Ej. 4)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | Create an invoice on a `purchase` journal with a product line + 21% VAT tax, post it | JE lines: expense/inventory (600) Debit + VAT 472 Debit; counterpart "Accounts Payable" Credit for the total (uses journal default credit account or `purchasePayableAccountId`) | |
| 15.2 | Register an outbound payment for the purchase invoice | Settlement JE discharges the AP account | |
| 15.3 | Create a credit note on the posted purchase invoice | Inverted lines reduce the AP debt (Ej. 7: 400 Debit / 608+472 Credit) | |

---

## 16. Payments — Partial Collection & Discount (Ej. 5 + A2, Ej. 8)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | On a posted sales invoice, register a partial payment (half of pending) | Settlement JE created: Debit bank account / Credit 430 for the paid amount; invoice `amountDue` reduced; payment listed in the invoice's Payments tab linked via `journalEntryId` | |
| 16.2 | Register a payment with a Discount amount (config: `discountGrantedAccountId` set) | JE has 3 lines: Debit bank (cash received), Debit discount account (765-like), Credit 430 for the GROSS amount; `amountDue` settles by payment + discount | |
| 16.3 | Register a payment with discount while `discountGrantedAccountId` is NOT configured | Rejected with a clear error requiring the configuration | |
| 16.4 | Register a payment where payment + discount > pending | Rejected (over-settlement guard) | |
| 16.5 | Delete a payment that included a discount | Invoice outstanding recalculates adding the discount back; balances consistent | |
| 16.6 | Pay the exact remaining pending with discount = 0 | Invoice shows fully paid (`isFullyPaid`) | |

---

## 17. Customer Advances (A2b, Ej. 10)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Create a standalone INBOUND payment for a contact (journal of advances with `defaultCreditAccountId` = 438), confirm it | JE created: Debit 572 / Credit 438 (anticipos); payment NOT linked to any invoice | |
| 17.2 | On a posted invoice of the same contact, open the Payments tab → "Apply advance" | Dialog lists the available advance(s) of that contact (via `GET /payments/advances?partnerId=...`) | |
| 17.3 | Apply the advance to the invoice | JE created: Debit 438 / Credit 430 for the applied amount; payment gets `appliedInvoiceId` + `appliedJournalEntryId`; invoice `amountDue` reduced | |
| 17.4 | Try to apply the same advance again | Rejected (anti-double-apply guard) | |
| 17.5 | Try to apply an advance larger than the invoice pending | Rejected (over-apply guard) | |

---

## 18. Inventory GL Posting Sweep (Fase B/B2, Ej. 11/12)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Ship a sales order (stock movement OUT at PMP cost), then go to Settings → Accounting Configuration → Inventory Posting and click "Publicar asientos pendientes" | Sweep runs and reports `{posted, skipped, failed}`; a POSTED JE exists: Debit COGS (693) / Credit inventory (300) by `totalCost`, referencing the movement (`sourceStockMovementId`) | |
| 18.2 | Click "Publicar asientos pendientes" again with no new movements | Nothing new posted (idempotent — no duplicate JEs for the same movement) | |
| 18.3 | Create an ADJUSTMENT movement DECREASE and sweep | JE: Debit adjustment-loss (693-configurable) / Credit inventory; INCREASE adjustment posts the inverse | |
| 18.4 | Reverse a shipped movement (`POST /stock-movements/:id/reversal`) and sweep | An inverted COGS JE (Debit 300 / Credit 693) is posted for the reversal movement | |
| 18.5 | Clear the inventory account mapping and post a movement, then sweep | Movement skipped with a notification (soft-fail); the stock movement itself is NOT blocked | |
| 18.6 | Create a TRANSFER movement and sweep | No JE generated for transfers | |

---

## 19. Data Integrity & API Contract (posted immutability preconditions)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | `curl -X PUT /api/accounting/journal-entries/<posted-id>` (with `x-api-key`) trying to change a line | Rejected — posted JEs cannot be mutated (aggregation reliability precondition) | |
| 19.2 | Try to post a manual JE that is in `cancel` status (`POST .../post` or equivalent action) | Rejected — cancelled entries cannot be posted | |
| 19.3 | Try to save a manual JE whose lines don't balance (Σ Debit ≠ Σ Credit) | Rejected by double-entry validation (±0.0001 tolerance) | |
| 19.4 | `POST /api/accounting/gl/closing-entries` with body `{ "period": "2026", "currencyId": "" }` | Rejected by DTO (`currencyId` must be a MongoId when present) — empty string must not pass; the UI avoids this by omitting the key | |

---

## 20. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | Generate Balanza/PyG/IVA/customerSales right after a fresh DB (no postings) | Empty tables with zeroed totals; no unhandled errors | |
| 20.2 | Click Closing with zero income and expense activity in the year | Either a graceful no-op message or a JE with zero-result lines — document actual behaviour | |
| 20.3 | Reports with From > To dates and Generate | No crash; either empty result or a date validation error — document actual behaviour | |
| 20.4 | Year field set to a far past/future year (e.g. 1990, 2099) and Generate PyG | Empty aggregates; no console errors | |
| 20.5 | Rapidly switch tabs and click Generate on each | Requests target the correct endpoint per tab every time; no state leakage between tabs | |
| 20.6 | Two browser tabs open on Reports, one runs the Closing, the other generates Balanza | Balanza reflects the closing JEs after regeneration; no race-induced duplicates | |
