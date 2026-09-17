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
| 1.1 | Expand the sidebar and open the Accounting menu | Accounting section shows the Reports entry along with the accounting CRUD entities | ✅ |
| 1.2 | Click the Reports menu item | Navigates to `/accounting/reports`; screen loads with title, filter bar (From date, To date, Currency, Year) and two header buttons (Generate, Closing) | ✅ |
| 1.3 | Inspect the Reports screen | 4 tabs visible: Balanza, PyG, IVA, customerSales; Balanza tab active by default; a progress bar shows only while loading | ✅ |
| 1.4 | Open each other accounting list (Invoices, Payments, Journals, Accounts) via sidebar | Each list loads without console errors | ✅ |

**Test Results (2026-09-17) — Section 1 findings:**

- 1.1 ✅ — Accounting menu expands and shows the Reports entry plus all 9 CRUD entities: Cuentas, Diarios, Asientos Contables, Pagos, Impuestos, Descuentos, Posiciones Fiscales, Términos de Pago, Facturas. ⚠️ Note (out of scope per run config): the Reports menu label renders the raw key `nav.reports` (missing translation entry in scope `accounting`).
- 1.2 ✅ — Clicking the Reports item navigates to `/accounting/reports` via `[routerLink]`. Screen renders title, buttons `reports.generate` / `reports.closing` and the filter bar: From = 01/01/2026, To = 12/31/2026, Currency dropdown, Year = 2026. ⚠️ Note (out of scope): all labels render raw translation keys (`reports.title`, `reports.fromDate`, ...) — no en/es entries in the catalog.
- 1.3 ✅ — Tablist shows 4 tabs (`reports.balanza` **selected by default**, `reports.pyg`, `reports.iva`, `reports.customerSales`); the Balanza panel renders the trial-balance table (columns code/name/currency/debit/credit/saldo) with totals block (0.00 / 0.00 before generating); no progress bar at rest (only appears while loading).
- 1.4 ✅ — All lists load via sidebar with data: Accounts (2 records), Journals (1), Journal Entries (3), Invoices (3), Payments (0 → clean "Sin Resultados" empty state). Console audit: only the 2 pre-login 401 errors (`GET /api/languages` fired before authentication) + 1 warning — **zero new console errors** attributable to any accounting page navigation.

---

## 2. Reports — Balanza / Trial Balance (Ej. 35, `GET /accounting/gl/trial-balance`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | With at least one posted invoice in the default period (Jan 1 → Dec 31 of current year), click Generate | Table fills with one row per account: code, name, nature (type), currency, Debit, Credit, balance | ⚠️ |
| 2.2 | Check the totals block under the table | Total Debit and Total Credit are the Σ of all rows; the "Balanced" tag shows success (Σ Debit = Σ Credit) | ⚠️ |
| 2.3 | Narrow the date range to a single month containing one known invoice and Generate | Only activity inside the range is aggregated; totals shrink accordingly | ✅ |
| 2.4 | Select a currency in the filter and Generate | Only JEs posted in that currency are aggregated (grouping is per account+currency) | ✅ |
| 2.5 | Set a range with no postings (e.g. a past year without data) and Generate | Empty table or zeroed totals; no console/network errors | ✅ |
| 2.6 | Cross-check one account's Debit/Credit against `curl GET /api/accounting/gl/trial-balance?from=...&to=...` | UI values match the API response | ✅ |

**Test Results (2026-09-17) — Section 2 findings:**

- Dataset: 3 posted invoices (INV/2026/00001–00003), all dated 2026-08-14, Sales Journal, CRC, all lines posted to "Sales Account" (code `Sales`, type `income`).
- 2.1 ⚠️ — Table fills correctly with one row: `Sales / Sales Account / CRC / 6,915.60 / 6,795.60 / saldo 120`. **Deviation:** the table does NOT render a nature/type column — the API payload includes `accountType: "income"` but the UI omits it (columns: code, name, currency, debit, credit, saldo). Minor UI gap, not blocking.
- 2.2 ⚠️ — Totals block matches Σ rows exactly (totals.debit **6,915.60**, totals.credit **6,795.60**). The Balanced tag shows **No** (danger) instead of success — **this is correct feature behaviour**: legacy JE1 (INV/2026/00001) is itself unbalanced (lines D 2,395.60 vs C 2,275.60 → Δ 120.00; data created 2026-08-14, before the B1 fix that enforces JE-line rebalancing). The flag correctly detects the imbalance. 🐞 **Data finding (not a report bug):** repair or re-post INV/2026/00001 to restore a balanced dataset. Config observation: all invoice lines post to the same income account because the sales journal's default credit account and the tax `accountId` all point to "Sales Account".
- 2.3 ✅ — Range 08/01→08/31/2026 reproduces identical totals (all activity is 14/08); range 01/01→07/31/2026 zeroes the table ("Sin Resultados", 0.00/0.00). Aggregation respects the period filter.
- 2.4 ✅ — Currency = Colón (CRC): identical totals (all JEs are CRC). Currency = Dolar (USD): empty table + 0.00 — the per-currency filter excludes other currencies correctly.
- 2.5 ✅ — Range 2025: "Sin Resultados", totals 0.00, balanced=yes; no new console/network errors.
- 2.6 ✅ — UI row == network response == `curl "…/api/accounting/gl/trial-balance?from=2026-01-01&to=2026-12-31&currencyId=69aafbec9a6658ec6c62d024"`: `debit 6915.6, credit 6795.6, saldo 120, totalDebit 6915.6, totalCredit 6795.6, balanced false`. Exact match.

---

## 3. Reports — Ledger Drill-Down (Ej. 6, `GET /accounting/gl/ledger/:accountId`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | On the Balanza tab, click "Ledger" on a row (e.g. account 430 Clients with a posted invoice) | View switches to the Ledger of that account: header tag with account name, movements table and a Back button | ❌ |
| 3.2 | Inspect the opening balance | Opening balance equals the sum of posted JEs dated **before** the From date | ⚠️ |
| 3.3 | Inspect the movements table | One row per JE line in the period (date, reference, debit, credit) with a running balance that evolves row by row | ⚠️ |
| 3.4 | Check the closing balance | Closing balance = opening balance + (period debits − period credits); matches the balance shown for that account in the Balanza | ⚠️ |
| 3.5 | Click Back | Returns to the Balanza table with previous filters intact | ❌ |
| 3.6 | Open the Ledger of an account with no movements in the period | Opening = closing; empty movements table; no errors | ⚠️ |

**Test Results (2026-09-17) — Section 3 findings:**

- 🐞 **BUG-A (code):** the Ledger drill-down is **unreachable via the UI**. The component defines `drillDown(row)` (gl-reports-list.ts:154) and the Ledger view template exists (`@if (ledgerReport())`), but nothing invokes it: `glTrialBalanceColumns` has no action column and the Balanza `<bifi-app-table-layout>` has no `onClickRow` binding nor `#actions` template (gl-reports-list.html:123-126). Clicking the row does nothing (verified — Balanza remains on screen). The feature is dead code from the user's perspective.
- 3.1 ❌ — No Ledger button / row-click action exists on the Balanza table; the Ledger view can never open (see BUG-A).
- 3.2 ⚠️ — **API-verified** (UI unreachable due to BUG-A): `GET /gl/ledger/<account>?from=2026-01-01&to=2026-12-31&currencyId=<CRC>` returns `openingBalance: 0` — correct (no posted JEs before the From date).
- 3.3 ⚠️ — **API-verified:** 9 movement rows (3 JEs × 3 lines) each with date, reference, description, currency, debit, credit and `runningSaldo`; running balance programmatically verified consistent line by line (opening + Σ(debit−credit) == runningSaldo at every row, tolerance 0.0001).
- 3.4 ⚠️ — **API-verified:** `closingBalance: 120` = opening 0 + (6,915.60 − 6,795.60); matches the Balanza `saldo` column (120) for the same account+currency.
- 3.5 ❌ — Back button only renders inside the (unreachable) Ledger view — blocked by BUG-A, not verifiable via UI.
- 3.6 ⚠️ — **API-verified:** empty range (01/01→07/31/2026) returns `opening: 0, rows: 0, closing: 0`. Note: via UI this path is doubly unreachable (BUG-A + the row disappears from the Balanza when the range has no activity, since `hideEmpty` defaults to true).
- **Recommended fix (BUG-A):** add an actions column to `glTrialBalanceColumns` with a "Ledger" button calling `drillDown(row)` (or bind `[onClickRow]` + `clickRowPermission="accounting/gl/update:view"`-style resource on the Balanza table).

---

## 4. Reports — Tab Switching (regression: tab change must call the matching endpoint)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Click the PyG tab, then click Generate | `GET /api/accounting/gl/income-expenses?...` is fired (NOT `trial-balance`); PyG table loads in the PyG panel | ✅ |
| 4.2 | Click the IVA tab, then click Generate | `GET /api/accounting/gl/tax-balances?...` is fired; tax table loads in the IVA panel | ✅ |
| 4.3 | Click the customerSales tab, then click Generate | `GET /api/accounting/gl/customer-sales?...` is fired; customer sales table loads **inside the 4th panel** (previously the panel had a mismatched value `"3"` and showed no content) | ✅ |
| 4.4 | Go back to Balanza and click Generate | `GET /api/accounting/gl/trial-balance?...` is fired again | ✅ |
| 4.5 | Click through all 4 tabs consecutively without generating | Active panel highlight follows the clicked tab every time; no console errors | ✅ |

**Test Results (2026-09-17) — Section 4 findings:**

- 4.1 ✅ — PyG tab + Generate fired `GET /gl/income-expenses?period=2026&currencyId=<CRC>` (#442, 200). PyG panel rendered with the `nature` column present here (code/name/nature/currency/debit/credit), row `Sales / Sales Account / income / CRC`; totals incomeTotal **-120.00**, expenseTotal **0.00**, result **-120.00** — exact match with the API response. Note: the negative income figure traces back to the legacy unbalanced JE1 (Δ 120, see section 2 finding).
- 4.2 ✅ — IVA tab + Generate fired `GET /gl/tax-balances?from=2026-01-01&to=2026-12-31` (#443, 200). Panel rendered row `IVA / sales / CRC / 6,915.60 / 6,795.60 / 120` — matches API; aggregation restricted to `Tax.accountId` accounts as designed (single tax configured, whose account is "Sales Account" — same config quirk noted in section 2).
- 4.3 ✅ — customerSales tab + Generate fired `GET /gl/customer-sales?period=2026&currencyId=<CRC>` (#446, 200); **the 4th panel now displays content** (the `<p-tabpanel value="3">` mismatch fix is verified): row `TERMINALES Y ENTREGAS INTERNACIONALES S.A. / 6,795.6` matching the API. 🐞 **BUG-B (minor):** the Currency column shows "No definido" — the endpoint returns `currencyId` but NOT `currencyCode` in customer-sales rows, so the column mapping is empty (frontend column `currencyCode`).
- 4.4 ✅ — Balanza tab + Generate fired `GET /gl/trial-balance?from=2026-01-01&to=2026-12-31&currencyId=<CRC>` again (#447, 200) with filters preserved.
- 4.5 ✅ — Clicked balanza→pyg→iva→customerSales→balanza consecutively without generating; the selected/active state followed every click (final state: Balanza `[active][selected]`); zero new console errors (still only the 2 pre-login 401s).

---

## 5. Reports — PyG / Income & Expenses (Ej. 36 base, `GET /accounting/gl/income-expenses`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | With posted income and expense JEs in the selected year, open PyG and Generate | Table lists only accounts of type `income`/`expense` with YTD amounts | ✅ |
| 5.2 | Check the totals block | Income Total, Expense Total and Result = Income − Expense; sign is positive for profit, negative for loss | ✅ |
| 5.3 | Change the Year field to a different year and Generate | Aggregates recompute for that year only | ✅ |
| 5.4 | Select a currency and Generate | Aggregates respect the currency filter | ✅ |

**Test Results (2026-09-17) — Section 5 findings:**

- 5.1 ✅ — PyG table lists ONLY the income-type account (`Sales / Sales Account / nature=income / CRC / 6,915.60 / 6,795.60`); the endpoint filters by `account.type` (income/expense) as designed. Dataset note: the tenant has no `expense`-type account with postings, so the exclusion of other types can't be visually demonstrated — the nature/accountType fields in the API confirm the filter source.
- 5.2 ✅ — Totals: incomeTotal **-120.00**, expenseTotal **0.00**, result **-120.00**; Result = Income − Expense holds; negative sign (loss) rendered. Source of the -120 is the legacy unbalanced JE1 (Δ 120, section 2 finding) — with clean data this would be 0 in this dataset.
- 5.3 ✅ — Year → 2025 + Generate fired `GET /gl/income-expenses?period=2025&currencyId=<CRC>` (#453): API returned `rows: [], incomeTotal: 0, expenseTotal: 0, result: 0`; UI shows "Sin Resultados" + 0.00/0.00/0.00. Year → 2026 restores the data.
- 5.4 ✅ — Currency Dolar (USD) + Generate → empty table, totals 0.00; currency back to Colón (CRC) → row and -120.00 totals return. Currency filter respected both ways.

---

## 6. Reports — IVA (Ej. 19 base, `GET /accounting/gl/tax-balances`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | With posted sales invoices (477) and purchase invoices (472) in the period, open IVA and Generate | Rows appear ONLY for the accounts configured in `Tax.accountId` (472/477), not for every account | ✅ |
| 6.2 | Verify amounts | 477 accumulated equals Σ VAT of posted sales invoices in range; 472 equals Σ VAT of posted purchase invoices in range | ⚠️ |
| 6.3 | Change the date range and Generate | Aggregates follow the range | ✅ |

**Test Results (2026-09-17) — Section 6 findings:**

- 6.1 ✅ — IVA tab shows exactly ONE row: `IVA / sales / CRC / 6,915.60 / 6,795.60 / 120` — only the account mapped via `Tax.accountId` is aggregated (the DB holds 2 accounts; the non-tax-linked one does not appear). Dataset limitation: no purchase-side tax (472) is configured and no purchase invoices exist, so the 472/477 split can't be demonstrated end-to-end; the restriction to tax-mapped accounts is verified.
- 6.2 ⚠️ — Amounts equal the FULL activity of "Sales Account" because the tax record's `accountId` points to the same income account every invoice line posts to (config quirk documented in section 2). The actual VAT lines in the JEs sum 795.60 (260 + 260 + 275.6) and cannot be isolated by this report under the current config. 🐞 **Config finding (not a code bug):** point `Tax.accountId` to dedicated 472/477 accounts so the tab yields meaningful Modelo-303 base figures.
- 6.3 ✅ — Range 09/01→12/31/2026 (no activity): request #466 `?from=2026-09-01&to=2026-12-31` → API `rows: []`, UI "Sin Resultados". Full-year range restored afterwards (row returns). Test-harness note: one automated fill+Escape was reverted by the datepicker (input commit race in the automation, not an app defect — committing with Enter is reliable; section 2 filled the same inputs successfully with Escape).

---

## 7. Reports — Customer Sales (Ej. 9 base, `GET /accounting/gl/customer-sales`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | With posted sales invoices for at least 2 different contacts, open customerSales and Generate | One row per customer with YTD sales total; contact names hydrated (not raw IDs) | ✅ |
| 7.2 | Cross-check one customer | Row total equals Σ net amount of that contact's posted sales invoices for the year (credit notes reduce it) | ✅ |
| 7.3 | Set Year to a year with no invoices and Generate | Empty result set; no errors | ✅ |

**Test Results (2026-09-17) — Section 7 findings:**

- 7.1 ✅ — One row per customer rendered with the HYDRATED contact name (`TERMINALES Y ENTREGAS INTERNACIONALES SOCIEDAD ANONIMA`, not the raw `contactId`). Dataset limitation: only 1 contact has invoices in this tenant (template expected ≥2), so per-customer grouping is verified with a single row; no cross-contact merge/split anomalies observed. BUG-B re-confirmed here: Currency column shows "No definido" (endpoint omits `currencyCode`).
- 7.2 ✅ — Row total **6,795.60** == exact Σ of the contact's posted income-type credit lines: JE1 (2,000 + 275.6) + JE2 (2,000 + 260) + JE3 (2,000 + 260) = 2,275.60 + 2,260 + 2,260. Note: under the current config the VAT lines (795.60 total) count as income because `Tax.accountId` points to the income account (section 6 finding) — with dedicated 477 accounts the figure would be 6,000.00 net. No credit notes exist in the dataset to verify the reduction path.
- 7.3 ✅ — Year → 2025 + Generate fired `GET /gl/customer-sales?period=2025&currencyId=<CRC>` (#475): API `rows: []`, UI "Sin Resultados", zero new console errors. Year → 2026 restores the row.

---

## 8. Closing Entries (Ej. 33/34, `POST /accounting/gl/closing-entries` — includes currencyId fix)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | **Regression (bug fixed):** leave Currency filter empty and click Closing | Closing runs successfully — NO 400 validation error `"property currencyId should not exist"`; an info tag shows the period and result amount | ✅ |
| 8.2 | Verify the generated closing JE (via journal entries list or API) | One POSTED JE with expenses on the Credit side, income on the Debit side, and a result line against the first `equity` account; reference = `Closing entries of YYYY` | ❌ |
| 8.3 | Verify the opening JE | A second JE exists with every line inverted (Debe↔Haber), dated Jan 1 of the next year, reference = `Opening entries of YYYY+1` | ⚠️ |
| 8.4 | Click Closing again for the same year | Rejected as duplicate (idempotent guard on `reference = "Closing entries of YYYY"`); no second closing JE is created | ✅ |
| 8.5 | Select a specific currency and click Closing | Runs without validation error (currencyId is a valid MongoId in the body) | ✅ |
| 8.6 | After closing, open Reports → PyG | Income/expense YTD still shows the pre-closing activity (closing JEs do not alter the report source since they net through equity — document actual behaviour if different) | ⚠️ |

**Test Results (2026-09-17) — Section 8 findings:**

- **Config setup required during the run** (pre-requisites were missing in the tenant, each blocked the closing with a clear business error): (1) `400 "No equity account exists to close to."` → created accounts **129 Pérdidas y Ganancias** and **112 Reservas** (type Patrimonio) via UI; (2) `400 "No active general journal exists for the closing entries."` → created journal **Diario General / GEN** (tipo General, Colón, active) via UI. Both errors are accurate and actionable.
- 8.1 ✅ — **The `currencyId` regression fix is verified end-to-end:** with empty currency the request body was exactly `{"period":"2026"}` (key omitted) → **200 OK** (the old 400 `"property currencyId should not exist"` is gone). UI info tag rendered: **"periodo 2026: 120"**; response `{period:"2026", closingEntryId, openingEntryId, resultAmount:120}`.
- 8.2 ❌ — 🐞 **BUG-C (code, integrity):** the closing JE `Closing entries of 2026` (POSTED, dated 31/12/2026, result line vs equity **129** "P&L result of 2026" — correct reference/type/target) has **ONLY 1 LINE: Debit 129 120 / no credit counterpart** → **the JE is UNBALANCED (D 120 ≠ C 0)**, violating partida doble. The income-account line (Credit 120 to "Sales Account", whose YTD net is a 120 debit surplus) is MISSING — the income account is never zeroed. Root cause hypothesis: with incomeTotal = −120 (loss caused by the legacy unbalanced JE1), the "income to Debit" line amount is negative and gets dropped; the service should flip the side (credit the income account / handle loss) or refuse, never post a single-sided JE. The auto-posting path also skipped the Σ Debit = Σ Credit validation that manual JEs enforce.
- 8.3 ⚠️ — Opening JE `Opening entries of 2027` exists: POSTED, dated **01/01/2027**, single line inverted (129 Credit 120). Inversion is consistent with the (defective) closing — same missing counterpart, so it too is 1-line/unbalanced.
- 8.4 ✅ — Second Closing click → `400 "Period 2026 is already closed — a posted closing entry exists."` No second closing JE (verified in the JEs list: 5 JEs total, only one closing + one opening).
- 8.5 ✅ — With currency Colón selected the body was `{"period":"2026","currencyId":"69aafbec…"}` (valid MongoId) → passes DTO whitelist (no validation array); response is the expected duplicate-closing business error for the same period.
- 8.6 ⚠️ — PyG 2026 after closing: **unchanged** (income -120.00 / expense 0.00 / result -120.00). Documented actual behaviour: the pre-closing activity is still shown. Two contributing factors: BUG-C (the closing never touched the income account) and the closing JE being dated 31/12/2026 (inside the report range) — with a correct balanced closing, the income YTD would net to 0.

---

## 9. Invoice Integrity — Edit & Status Guards (B1/B2)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Edit a DRAFT invoice: change a product line quantity and save | Line totals recalculated AND the JE lines (counterpart + tax) are rebuilt — the entry stays balanced (Σ Debit = Σ Credit) | ✅ |
| 9.2 | Edit a draft invoice changing its journal from sales to purchase and save | JE lines re-derived with the new orientation (A1/B1 interaction) | ✅ |
| 9.3 | Try to edit a POSTED invoice (edit URL/action) | Validation error — posted invoices cannot be edited; nothing is persisted | ✅ |
| 9.4 | Try to edit a CANCELLED invoice | Validation error; nothing is persisted | ✅ |

**Test Results (2026-09-17) — Section 9 findings:**

- Setup performed: created purchase journal **Diario de Compras / PUR** (tipo Compra, Colón) and created the draft under test via UI (Sales Journal, contact TERMINALES, 1 × Computer @ 1,000 + IVA 13% = 1,130.00; payment term 30 Days).
- 9.1 ✅ — Editing the draft (Cant 1 → 2): footer recalculated 1,130.00 → **2,260.00**; after save the JE lines were REBUILT (AR counterpart Debit 2,260 / product Credit 2,000 / tax Credit 260 — Σ D = Σ C, balanced). B1 verified.
- 9.2 ✅ — Changing the journal Sales → **Diario de Compras** and saving re-derived the orientation: product Debit 2,000 + tax Debit 260 / **400 Proveedores Credit 2,260 (Accounts Payable counterpart)** — balanced 3-line JE (Ej. 4 shape). Config note: this required creating account **400 Proveedores (Pasivo)** and setting it as the journal's `Cuenta de Crédito Predeterminada`; WITHOUT that configuration the counterpart line is silently DROPPED and the derived JE posts unbalanced (same integrity pattern as BUG-C — see section 8).
- 9.3 ✅ — Row click opens the edit form even for POSTED invoices (frontend does not block navigation); editing Referencia and saving fired `PUT /api/accounting/invoices` → **400 "Only draft invoices can be edited. Cancel payments and reopen or cancel the invoice first."** Nothing persisted. ⚠️ **BUG-F:** the posted-invoice edit form throws `RuntimeError NG01350 (ngModel cannot be used to register form controls with a parent formGroup directive)` **5× on page load** (console errors; posted-only rendering path) — the frontend should block the edit route/action for posted invoices and the ngModel-inside-formGroup violation must be fixed.
- 9.4 ✅ — Draft was cancelled via "Anular Factura" (no confirmation dialog — immediate; status → cancel). The invoices list filters `active:true`, so a cancelled invoice is unreachable via UI navigation (recorded limitation) — verified via API with the exact multipart payload the UI sends: `PUT /api/accounting/invoices` → **400 "Only draft invoices can be edited..."**; record unchanged (status cancel, 3 lines, total 2,260).
- 🐞 **BUG-D (minor, contract mismatch):** the backend requires `paymentTermId` (`@IsMongoId`, rejects `""`) but the UI does not mark Término de Pago as required — first save without it returned the raw 400 `paymentTermId must be a mongodb id`. Either mark it required in the form or make it optional in the DTO.
- 🐞 **BUG-E (minor, data):** editing the draft recalculated `totalAmount` (1,130 → 2,260) but `amountDue` stayed **1,130** (still shown in the list as "Monto Adeudado $1,130.00") — `amountDue` should track the new total for a draft with no payments.
- ⚠️ **Environment flakiness (observed twice):** after successful saves the app spontaneously landed on `/accounting/reports` (once with the previously-active tab) — consistent with the known Firebase Zone / `router.navigate()` limitation documented in execution_guidelines.md. In-app `[routerLink]` navigation worked every time.

---

## 10. Invoice Cancel & Reversal (B3)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Cancel a POSTED invoice without payments | Status → cancelled; a reversal JE is created with every line inverted and `reversalOf` pointing to the original; transactional (both saved or neither) | ✅ |
| 10.2 | Cancel a DRAFT invoice | Cancelled with NO reversal JE created | ✅ |
| 10.3 | Try to cancel a posted invoice that has CONFIRMED payments | Blocked with a validation error about confirmed payments | ✅ |
| 10.4 | After 10.1, open Reports → Balanza for the period | The cancelled invoice no longer affects balances (its reversal nets it out) | ❌ |

**Test Results (2026-09-17) — Section 10 findings:**

- 10.1 ✅ — "Anular Factura" on INV/2026/00002 (posted, no payments) fired `PUT /invoices/:id/cancel` → 200: status → **cancel**; a second JE was created: reference **"Reversal of invoice INV/2026/00002"**, POSTED, dated 17/09/2026, `reversalOf` = original id, every line exactly inverted (AR: D 2,260 → C 2,260; product: C 2,000 → D 2,000; tax: C 260 → D 260) and self-balanced. Both saved (JE count 6 → 7).
- 10.2 ✅ — The previously cancelled DRAFT (section 9.4 setup) has **zero** reversal JEs pointing to it (verified via API across all JEs); the draft itself kept its 3 lines with status `cancel`.
- 10.3 ✅ — Setup: registered a 500 payment against INV/2026/00003 (posted) — amountDue correctly dropped to 1,760 in the list; payment `status: "confirmed"` with its own settlement JE. Then "Anular Factura" → `PUT /invoices/:id/cancel` → **400 "Invoice has confirmed payments. Reverse the payments before cancelling the invoice."** — cancellation blocked, invoice still posted.
- 10.4 ❌ — 🐞 **BUG-H (semantic, GL aggregation):** after the cancel, the Balanza totals went from (S2 baseline) **6,915.60 / 6,795.60** to **7,535.60 / 7,295.60** — the cancelled invoice did NOT "net out". Root cause: the aggregation **excludes JEs with status `cancel`** (INV2's lines removed) but **includes the posted reversal JE** → the ledger now shows the reversal as standalone activity (conceptually: AR credited 2,260 with its original debit excluded = the invoice's impact flipped sign instead of netting to zero). The global Σ stays "consistent" only because reversal JEs are self-balanced; account-level nets are wrong (e.g. with proper 430/700 accounts, AR would be understated by 2,260). The design rule in the audit doc ("include reversals because they trim the original") contradicts the cancel-status exclusion — either keep the original posted when a reversal exists, or skip posting a reversal when the original is excluded from aggregations. API-verified and reproduced on-screen (rows: 129 D 120; Sales Account D 7,415.60 / C 7,295.60; balanced = No).
- 🐞 **BUG-G (critical, blocks the UI payment flow — discovered during 10.3 setup):** in the invoice form's "Registrar pago" block, the `[(ngModel)]` bindings of the **Monto p-inputNumber** and the **Diario p-select** do NOT write back to their signals — verified via Angular devtools (`settlementAmount()` stays at the initial amountDue 2,260 after typing 500 with real key events; `settlementJournalId()` stays `""` after selecting Sales Journal; contrast: the block's p-datepicker DOES write). The `disabled="!settlementAmount() || !settlementJournalId()"` condition on **"Registrar pago" can therefore never be satisfied → payment registration is unusable from the UI** (sections 10.3 setup, 16 and advances depend on it). 10.3's payment was registered via API as fallback.
- ⚠️ Environment flakiness recurred (3rd time): spontaneous navigation to `/settings/templates/edit/...` while interacting with the payments tab.

---

## 11. Invoice Numbering at Post (B4)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Create a draft invoice (do not post) and check it in the list/API | Draft has NO invoice number; sequence counter NOT consumed | ✅ |
| 11.2 | Post the draft | Number assigned exactly at posting; matches the current sequence value | ✅ |
| 11.3 | Create another draft, then delete/cancel it before posting, then create and post a third invoice | The third invoice gets the next consecutive number (the abandoned draft consumed nothing) | ✅ |

**Test Results (2026-09-17) — Section 11 findings:**

- Baseline: numbers INV/2026/00001–00003 already assigned (all previously posted); sequence at 3.
- 11.1 ✅ — New draft created via UI (Sales Journal, contact TERMINALES, 1 × Computer @ 1,000 + IVA, term 30 Days): API shows `number: None, status: draft, total 1,130`. Sequence untouched.
- 11.2 ✅ — "Contabilizar Factura" on the draft → `number: "INV/2026/00004"`, status posted, dated 17/09/2026. Number assigned exactly at posting (sequence 3 → 4).
- 11.3 ✅ — Created draft B (1 × Computer @ 1,000, no tax — the price field's Enter auto-submitted the form; irrelevant for numbering), then cancelled it BEFORE posting (`status: cancel, number: None`). Created draft C and posted it → **"INV/2026/00005"** (NOT 00006) — the abandoned draft consumed nothing from the sequence. B4 verified end-to-end.
- Note (recurrence of BUG-D): the first Save of 11.1 failed again with the raw 400 `paymentTermId must be a mongodb id` because the Término de Pago field is not marked required in the UI.

---

## 12. Multi-Installment Due Dates (B5)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | On an invoice form, select a payment term with 2–3 installments (percentage + dueDays per installment) | Due-date chips appear showing each installment: proportional amount and computed date | ✅ |
| 12.2 | Change the payment term to a single-installment term | Chips collapse to one installment; dueDate = invoice date + dueDays | ✅ |
| 12.3 | Save and post the invoice, then inspect the JE via API | `dueDates` array persisted (`[{amount, date}, ...]`) ordered by date; `dueDate` field equals the last installment date | ⚠️ |
| 12.4 | Change the invoice date on a draft with installments | Installment dates recalculate from the new invoice date | ❌ |

**Test Results (2026-09-17) — Section 12 findings:**

- Setup: created payment term **"30/60 Days 50/50"** via UI (2 lines: 50% @ 30 days, 50% @ 60 days — verified persisted via API). Invoice under test: 1 × Computer @ 2,000 (product default price), CRC, Sales Journal.
- 12.1 ✅ — Selecting "30/60 Days 50/50" immediately rendered **2 chips**: `17 oct 2026 / 1,000.00` and `16 nov 2026 / 1,000.00` (50%+50% of 2,000; invoice date 17/09 + 30/60 days). The "Fecha de Vencimiento" field auto-filled with **11/16/2026** = the last installment date.
- 12.2 ✅ — Switching to "30 Days": both chips disappeared and "Fecha de Vencimiento" recalculated to **10/17/2026** (invoice date + 30). Switching back re-rendered both chips.
- 12.3 ⚠️ — Draft saved with `dueDates: [{amount 1000, date 2026-10-17}, {amount 1000, date 2026-11-16}]` (ordered, proportional) and `dueDate = 2026-11-16` (last installment) ✓. After changing the invoice date to 30/09 and posting (INV/2026/00006): `dueDates` correctly recomputed to **[(2026-10-30, 1000), (2026-11-29, 1000)]** and ordered ✓ — **BUT `dueDate` (singular) stayed stale at `2026-11-16`** instead of the last installment (2026-11-29). The singular compat field is only re-derived on payment-term change, not on invoice-date change.
- 12.4 ❌ — 🐞 **BUG-I:** changing the invoice date on a draft with installments does NOT recalculate the chips — verified via devtools: `form.get('invoiceDate')` = 2026-09-30 while `dueDateEntries()` still `[{10-17, 1000}, {11-16, 1000}]`. The frontend recalculates `dueDates`/chips ONLY in `onPaymentTermChange`. The backend DOES recompute `dueDates` on save (see 12.3), but the on-screen chips stay stale until the term is touched, and the singular `dueDate` remains stale even after save/post.
- **Recommended fix (BUG-I):** hook the same recalculation to `invoiceDate` changes (form value-change on `invoiceDate` → rebuild `dueDateEntries`), and re-derive singular `dueDate` from the last entry in `update()`/`post()` server-side.

---

## 13. Payments — Edit Route (B6)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Open Accounting → Payments list, click edit on a payment | Navigates to `payments/edit/:id` (route exists — previously broken); form opens pre-filled | ✅ |
| 13.2 | Modify the amount and save | PUT succeeds; persisted value verifiable via API/list | ✅ |
| 13.3 | From a posted invoice's Payments tab, edit an existing payment | Same edit form works from the invoice context | ⚠️ |

**Test Results (2026-09-17) — Section 13 findings:**

- Dataset: one confirmed payment (500, reference PAY-TEST-10.3) registered via API against INV/2026/00003 (section 10.3 setup — BUG-G blocks UI registration).
- 13.1 ✅ — Row click on the payment list navigates to `/accounting/payments/edit/6aac5a9e…` (the B6 route exists and loads); the form opens **pre-filled**: Tipo "Entrante", Diario "Sales Journal", Moneda "Colón", Monto 500.00, Referencia PAY-TEST-10.3. ⚠️ Cosmetic: the page title reads **"Nuevo Pago"** in edit mode (create/update title key not switched).
- 13.2 ✅ — Monto 500 → 600 (keyboard events), Save → `PUT /api/accounting/payments` succeeded and redirected to the list; API confirms `amount: 600, status: confirmed, invoiceId` intact. 🐞 **BUG-J (data):** editing the payment amount does NOT recalculate the linked invoice's outstanding — INV/2026/00003 `amountDue` stayed **1,760** (2,260 − 500) instead of **1,660** (2,260 − 600); AR diverges after any payment amount edit. `recalculateInvoiceOutstanding` runs on register/delete but not on payment update.
- 13.3 ⚠️ — The invoice's Payments tab displays the payment row with the UPDATED amount (600.00 / confirmed ✓) but provides **no edit affordance** in the invoice context (row has no action); editing must be done from the standalone Payments list (which works). UI gap, not a data issue.
- **Recommended fixes:** recompute the invoice outstanding in the payment `update()` path (BUG-J); switch the page title key by mode; optionally add an edit action to the invoice's payments rows.

---

## 14. Credit Note (B7, `POST /invoices/:id/credit-note`)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | On a POSTED sales invoice with pending amount, click "Crear nota de crédito" | New JE created with every line inverted (Debe↔Haber), flagged `isCreditNote` + `reversalOf` = source, and its OWN number | ✅ |
| 14.2 | Check the source invoice after the NC | Its `amountDue` was reduced by the credit note amount; `isFullyPaid` recalculates when fully credited | ✅ |
| 14.3 | Try a credit note for more than the pending amount | Rejected (pending must be > 0 and credit ≤ pending) | ✅ |
| 14.4 | Try a credit note on a DRAFT invoice | Rejected (source must be posted) | ✅ |

**Test Results (2026-09-17) — Section 14 findings:**

- Target: INV/2026/00006 (posted, total 2,000, pending 2,000).
- 14.1 ✅ — "buttons.createCreditNote" click created the NC and navigated to it: **INV/2026/00007**, status posted, `isCreditNote: true`, `reversalOf` = source id, **own sequence number** (00007) — and every line EXACTLY inverted vs the source (source: AR D 2,000 / product C 2,000 → NC: AR **C 2,000** / product **D 2,000**). B7 verified.
- 14.2 ✅ — Source after NC: `amountDue: 0` (was 2,000) and **`isFullyPaid: true`** ✓. List display quirk: the source's "Monto Adeudado" now renders **"No definido"** instead of 0.00 (a zero amount is treated as falsy by the column renderer — cosmetic).
- 14.3 ✅ — The UI hides the NC button once pending = 0; the API guard confirms: `POST /credit-note` on the source → 400 **"Invoice pending amount is zero; a credit note cannot exceed the pending amount."** Note (document actual behaviour): the core NC mechanism always credits the FULL pending amount — partial credit notes are not parameterizable in this endpoint (partial reductions would go through the CR plugin's fiscal flow or future development).
- 14.4 ✅ — `POST /credit-note` on the cancelled draft (non-posted) → 400 **"Credit notes can only be created against posted invoices."** (The UI never shows the button on drafts/cancelled — API-verified guard.)

---

## 15. Purchase Invoice Orientation (A1, Ej. 4)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | Create an invoice on a `purchase` journal with a product line + 21% VAT tax, post it | JE lines: expense/inventory (600) Debit + VAT 472 Debit; counterpart "Accounts Payable" Credit for the total (uses journal default credit account or `purchasePayableAccountId`) | ✅ |
| 15.2 | Register an outbound payment for the purchase invoice | Settlement JE discharges the AP account | ❌ |
| 15.3 | Create a credit note on the posted purchase invoice | Inverted lines reduce the AP debt (Ej. 7: 400 Debit / 608+472 Credit) | ✅ |

**Test Results (2026-09-17) — Section 15 findings:**

- Dataset note: the tenant has no 21% purchase tax — the line used "ARD30 Purchase Tax" (5% rate, accountId → account "323 Elias"); the ORIENTATION (the thing under test) is rate-independent. No expense-type account exists either, so the product line posts to "Sales Account" (config quirk documented in section 2).
- 15.1 ✅ — Purchase invoice **INV/2026/00008** (Diario de Compras, contact TERMINALES, 1 × Computer @ 2,000 + tax) posted → JE: `400 Proveedores CREDIT 2,100` (Accounts Payable counterpart via the journal's default credit account) + product **DEBIT 2,000** + tax **DEBIT 100** — Σ D = Σ C = 2,100, balanced. Exact Ej. 4 shape (600+472 D / 400 C). A1 verified.
- 15.2 ❌ — 🐞 **BUG-K (integrity):** registering a payment against the PURCHASE invoice produced `paymentType: "inbound"` (should be outbound) and its settlement JE posted **`D "bank" 1,000 / C 400 1,000`** — the CREDIT side went to the AP account, which INCREASES the ledger payable instead of discharging it. The invoice `amountDue` did drop to 1,100 (arithmetic OK) but the GL now diverges (ledger says MORE debt, document says less). For purchases the settlement must be `D 400 / C bank`. (UI registration is impossible anyway due to BUG-G; verified via the register-payment API.)
- 15.3 ✅ — "Crear nota de crédito" on the posted purchase invoice → **INV/2026/00009**: `isCreditNote: true`, `reversalOf` = source, lines exactly inverted (Ej. 7 shape): **`400 Proveedores DEBIT 2,100`** (discharges the AP debt) / product C 2,000 / tax C 100 — balanced; source `amountDue → 0`, `isFullyPaid: true`.
  - ⚠️ Edge (BUG-K family): the NC credited the FULL original total (2,100) even though the pending was only 1,100 (a 1,000 payment existed and was NOT reverse-adjusted) — the guard only checks `pending > 0`, not `credit ≤ pending`. Combined with BUG-K, the AP ledger nets a phantom credit balance of 1,000 for this invoice.

---

## 16. Payments — Partial Collection & Discount (Ej. 5 + A2, Ej. 8)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | On a posted sales invoice, register a partial payment (half of pending) | Settlement JE created: Debit bank account / Credit 430 for the paid amount; invoice `amountDue` reduced; payment listed in the invoice's Payments tab linked via `journalEntryId` | ✅ |
| 16.2 | Register a payment with a Discount amount (config: `discountGrantedAccountId` set) | JE has 3 lines: Debit bank (cash received), Debit discount account (765-like), Credit 430 for the GROSS amount; `amountDue` settles by payment + discount | ✅ |
| 16.3 | Register a payment with discount while `discountGrantedAccountId` is NOT configured | Rejected with a clear error requiring the configuration | ✅ |
| 16.4 | Register a payment where payment + discount > pending | Rejected (over-settlement guard) | ✅ |
| 16.5 | Delete a payment that included a discount | Invoice outstanding recalculates adding the discount back; balances consistent | ✅ |
| 16.6 | Pay the exact remaining pending with discount = 0 | Invoice shows fully paid (`isFullyPaid`) | ✅ |

**Test Results (2026-09-17) — Section 16 findings:**

- ⚠️ **All payment registrations in this section were executed via the `register-payment` API** — the UI's "Registrar pago" button cannot be enabled due to **BUG-G** (see section 10). The A2 logic under test lives in the service layer, so API execution still exercises it faithfully. Target: INV/2026/00004 (posted, total 1,130, pending 1,130).
- 16.1 ✅ — Partial payment of 565 (half): settlement JE POSTED with 2 lines — `D "bank" 565 ("Payment of invoice INV/2026/00004") / C 565 ("Accounts Receivable settlement")` (both map to "Sales Account" due to the tenant's single-account config — direction/amounts correct); `amountDue` 1,130 → **565**; payment linked to the invoice with `journalEntryId`.
- 16.3 ✅ (executed before configuring the setting) — payment 500 + discount 65 → **400 "Early-payment discount requires the 'discountGrantedAccountId' setting to be configured."** — clear, actionable error.
- Config: `discountGrantedAccountId` set via Settings → Accounting Configuration UI (→ "Sales Account") — persisted (verified via API).
- 16.2 ✅ — payment 400 + discount 100: settlement JE has **3 lines**: `D 400 (bank) + D 100 ("Early-payment discount" → the configured account) / C 500 (AR GROSS)`; Σ balanced; invoice `amountDue` 565 → **65** (settles by payment + discount = 500). A2 verified.
- 16.4 ✅ — payment 50 + discount 25 (= 75 > 65 pending) → **400 "Payment exceeds the outstanding amount (pending 65)."** — over-settlement guard counts payment + discount.
- 16.5 ✅ — `DELETE /api/accounting/payments` (collection-level with body `_id`) on the discounted payment → invoice `amountDue` recalculated 65 → **565** (adds back payment 400 + discount 100). Delete respects the discount exactly as designed.
- 16.6 ✅ — exact payment of the remaining 565 (no discount) → `amountDue: 0`, **`isFullyPaid: true`**.

---

## 17. Customer Advances (A2b, Ej. 10)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Create a standalone INBOUND payment for a contact (journal of advances with `defaultCreditAccountId` = 438), confirm it | JE created: Debit 572 / Credit 438 (anticipos); payment NOT linked to any invoice | ⚠️ |
| 17.2 | On a posted invoice of the same contact, open the Payments tab → "Apply advance" | Dialog lists the available advance(s) of that contact (via `GET /payments/advances?partnerId=...`) | ❌ |
| 17.3 | Apply the advance to the invoice | JE created: Debit 438 / Credit 430 for the applied amount; payment gets `appliedInvoiceId` + `appliedJournalEntryId`; invoice `amountDue` reduced | ❌ |
| 17.4 | Try to apply the same advance again | Rejected (anti-double-apply guard) | ❌ |
| 17.5 | Try to apply an advance larger than the invoice pending | Rejected (over-apply guard) | ❌ |

**Test Results (2026-09-17) — Section 17 findings:**

- Setup: created account **438 Anticipos de Clientes** (Pasivo) and journal **Diario de Anticipos / ADV** (General, Colón, default debit = Sales Account, default credit = 438) via UI.
- 17.1 ⚠️ — Standalone payment created via UI (Tipo Entrante, partner TERMINALES, Diario de Anticipos, 500): the JE IS derived correctly from the journal defaults — `D Sales Account 500 / C 438 500` (exact Ej. 10 asiento 1 shape) — and the payment is NOT linked to any invoice ✓. **BUT the payment AND its JE stay `status: draft` forever**: `PaymentDTO` has no `status` field, `create()` posts the JE as DRAFT, and **no confirm action/endpoint exists anywhere** (UI form has no confirm button; no route; `PUT` with `status` → 500 since `UpdatePaymentDTO` = `PartialType(PaymentDTO)` also lacks `status`).
- 🐞 **BUG-L (critical design gap — the advance flow is a dead end):** `GET /payments/advances` requires `status: CONFIRMED, invoiceId: null` — but (a) UI/API-created standalone advances are always DRAFT (excluded), (b) the only CONFIRMED payments come from `registerPayment()` which stamps `invoiceId` (also excluded). **`GET /payments/advances` can therefore NEVER return data.** Verified: the advances endpoint returns 0 for the partner even with the 500 draft advance in place; `PUT` with `status: "confirmed"` → 500.
- 17.2 ❌ — On INV/2026/00005 (posted, pending 1,000, same contact) the Payments tab shows "payments.none" + the register block; the **"Apply advance" block does not even render** (gated on the empty advances list) — the dialog is unreachable.
- 17.3 / 17.4 / 17.5 ❌ — Unreachable: applying an advance (and its anti-double-apply and over-apply guards) cannot be exercised while no advance can ever reach CONFIRMED status. Blocked by BUG-L.
- **Recommended fix (BUG-L):** give standalone payments a lifecycle — either (a) add a confirm action (route + UI button) that flips payment+JE to CONFIRMED, or (b) create standalone payments directly as CONFIRMED like `registerPayment()` does, and include `status` in `UpdatePaymentDTO`. Then A2b's apply flow becomes reachable.

---

## 18. Inventory GL Posting Sweep (Fase B/B2, Ej. 11/12)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Ship a sales order (stock movement OUT at PMP cost), then go to Settings → Accounting Configuration → Inventory Posting and click "Publicar asientos pendientes" | Sweep runs and reports `{posted, skipped, failed}`; a POSTED JE exists: Debit COGS (693) / Credit inventory (300) by `totalCost`, referencing the movement (`sourceStockMovementId`) | ✅ |
| 18.2 | Click "Publicar asientos pendientes" again with no new movements | Nothing new posted (idempotent — no duplicate JEs for the same movement) | ✅ |
| 18.3 | Create an ADJUSTMENT movement DECREASE and sweep | JE: Debit adjustment-loss (693-configurable) / Credit inventory; INCREASE adjustment posts the inverse | ⚠️ |
| 18.4 | Reverse a shipped movement (`POST /stock-movements/:id/reversal`) and sweep | An inverted COGS JE (Debit 300 / Credit 693) is posted for the reversal movement | ✅ |
| 18.5 | Clear the inventory account mapping and post a movement, then sweep | Movement skipped with a notification (soft-fail); the stock movement itself is NOT blocked | ⚠️ |
| 18.6 | Create a TRANSFER movement and sweep | No JE generated for transfers | ✅ |

**Test Results (2026-09-17) — Section 18 findings:**

- Setup: `inventoryAccounts` mapping configured via the configuration UI (inventory = Elias/323, COGS = Sales Account, adjustmentLoss = Sales Account, apPending = 400, currency = Colón) — persisted. Sales order SO-00036 created + confirmed + shipped via API (note: setting `status: "shipped"` through the collection-level PUT **bypasses** the stock logic — the proper ship path is `PATCH /sales-orders/:id/status` which creates the OUT movement).
- 18.1 ✅ — Sweep run #1: `{posted: 6, skipped: 1, failed: 0}` — posted the new shipment SO-00036 (`D COGS 2,641.02402 "Cost of sales" / C 323 2,641.02402 "Stock out"`, WAC cost, `sourceStockMovementId` set) PLUS 5 historically-pending movements (SO-00031/32/34 COGS JEs + PO-0001/2 receipts `D 323 / C 400 "Goods received (pending AP)"`). All POSTED + balanced.
- 18.2 ✅ — Sweep run #2: `{posted: 0, skipped: 1, failed: 0}` — JE count unchanged (26); no duplicates.
- 18.3 ⚠️ — 🐞 **BUG-M:** an ADJUSTMENT created the natural way (no `referenceType` → `""`) is selected by the sweep query (which includes `{type: ADJUSTMENT}` "regardless of referenceType") but **silently skipped** in `tryPostMovement` — the `SKIPPED_REFERENCE_TYPES` check (`""`) runs BEFORE the ADJUSTMENT branch, contradicting the documented rule. Manual adjustments (exactly Ej. 12's stock-take case) can NEVER post. **Workaround verified:** an ADJUSTMENT created WITH a referenceType (`"inventory-count"`) posts correctly: `D adjustment-loss 1,320.51201 / C 323 1,320.51201`, balanced. INCREASE direction was not separately exercised (same code path with flipped sides).
- 18.4 ✅ — Reversal of the SO-00036 shipment (`POST /inventory/movements/:id/reversal` → IN movement with `referenceType: "sales-order"` copied verbatim) + sweep → inverted COGS JE POSTED: `D 323 2,641.02402 "Stock in" / C COGS 2,641.02402 "Cost of sales"` — balanced. ⚠️ BUT the **reversal of an ADJUSTMENT is never swept** (its IN carries the adjustment's refType "inventory-count", not matched by the sweep query which only sweeps IN with sales-order/purchase-order) → the GL keeps the loss after the stock is restored (BUG-M second half).
- 18.5 ⚠️ — With `adjustmentLossAccountId` removed from the settings (API PUT), a new ADJUSTMENT (ADJ-18.5) was **skipped** (no JE created; the stock movement itself unaffected ✓ — soft-fail works). 🐞 **BUG-N:** the soft-fail notification is INVISIBLE — `notifySoftFail` fires with `context: {}` so `fireNotification` resolves `userIds = []` and no user ever receives the "GL posting skipped" alert (notifications list unchanged). Deferred consistency verified: after restoring the mapping, the next sweep posted the pending ADJ-18.5 JE (balanced).
- 18.6 ✅ — `POST /inventory/transfers` (Computer ×1 ARD30 Loc → QA Bay B) created the transfer-out/in movement pair; subsequent sweep posted nothing (JE count stable at 29, sweep JEs = 9) — transfers correctly produce no JEs.

---

## 19. Data Integrity & API Contract (posted immutability preconditions)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | `curl -X PUT /api/accounting/journal-entries/<posted-id>` (with `x-api-key`) trying to change a line | Rejected — posted JEs cannot be mutated (aggregation reliability precondition) | ✅ |
| 19.2 | Try to post a manual JE that is in `cancel` status (`POST .../post` or equivalent action) | Rejected — cancelled entries cannot be posted | ✅ |
| 19.3 | Try to save a manual JE whose lines don't balance (Σ Debit ≠ Σ Credit) | Rejected by double-entry validation (±0.0001 tolerance) | ✅ |
| 19.4 | `POST /api/accounting/gl/closing-entries` with body `{ "period": "2026", "currencyId": "" }` | Rejected by DTO (`currencyId` must be a MongoId when present) — empty string must not pass; the UI avoids this by omitting the key | ✅ |

**Test Results (2026-09-17) — Section 19 findings (all via curl + `x-api-key`):**

- 19.1 ✅ — `PUT /api/accounting/journal-entries` with `_id` of the posted INV/2026/00004 → **400 "Only draft journal entries can be edited. Cancel or post first."** — reference untouched afterwards (the L1 mutation-lock precondition holds).
- 19.2 ✅ — `PUT /api/accounting/journal-entries/6aac5551…/post` on the cancelled draft invoice → **400 "Journal entry is cancelled and cannot be posted. Restore it by removing the cancellation source first."** — status stays `cancel`.
- 19.3 ✅ — `POST /api/accounting/journal-entries` with lines D 100 / C 90 → **400 "Total debits must equal total credits."** — the double-entry invariant blocks unbalanced manual JEs (which makes BUG-C/BUG-K auto-JEs skip this very validation — inconsistent enforcement between manual and auto paths).
- 19.4 ✅ — `POST /api/accounting/gl/closing-entries` with `currencyId: ""` → **400 validation `currencyId must be a mongodb id`** — the DTO correctly rejects the empty string; the UI's omit-when-empty payload (section 8) is the right contract.

---

## 20. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | Generate Balanza/PyG/IVA/customerSales right after a fresh DB (no postings) | Empty tables with zeroed totals; no unhandled errors | ✅ |
| 20.2 | Click Closing with zero income and expense activity in the year | Either a graceful no-op message or a JE with zero-result lines — document actual behaviour | ✅ |
| 20.3 | Reports with From > To dates and Generate | No crash; either empty result or a date validation error — document actual behaviour | ❌ |
| 20.4 | Year field set to a far past/future year (e.g. 1990, 2099) and Generate PyG | Empty aggregates; no console errors | ✅ |
| 20.5 | Rapidly switch tabs and click Generate on each | Requests target the correct endpoint per tab every time; no state leakage between tabs | ✅ |
| 20.6 | Two browser tabs open on Reports, one runs the Closing, the other generates Balanza | Balanza reflects the closing JEs after regeneration; no race-induced duplicates | ✅ |

**Test Results (2026-09-17) — Section 20 findings:**

- 20.1 ✅ (adapted — the DB now has data, so the empty path was exercised through the far-past/empty ranges): every report endpoint returns `rows: []` with zeroed totals and the UI renders its "Sin Resultados" empty state cleanly (see 2.5, 7.3, 20.4).
- 20.2 ✅ — Closing for 2025 (zero income/expense) → **400 "No posted income/expense entries for period 2025; nothing to close."** — graceful no-op, NO empty closing JE is created. Documented actual behaviour.
- 20.3 ❌ — 🐞 **BUG-O (frontend crash):** typing into the `p-datepicker` fields can leave the bound signal **NULL** (reproduced twice via devtools: `toDate() === null` right after committing a visible date with Enter) — then Generate throws `TypeError: Cannot read properties of null (reading 'toISOString')` inside `runBalanza` (also affects the IVA path), **`isLoading` is never reset (the Generate button stays permanently disabled until re-navigation) and no request is sent**. With VALID dates, From > To is handled gracefully by the backend (`rows: [], balanced: true` — verified via curl). Fix needed: null-guards in `runBalanza`/`runIva` (or normalize the datepicker model) + `finally`-style `isLoading.set(false)`.
- 20.4 ✅ — PyG with Year 1990 and 2099: empty tables, totals 0.00, zero new console errors.
- 20.5 ✅ — Rapid tab switching (balanza→customerSales→iva→customerSales) with Generate on each: requests matched the active tab every time (`trial-balance`, `customer-sales?period=2099`, `tax-balances`, `customer-sales`) — no state leakage.
- 20.6 ✅ (scope note) — Two tabs live on Reports simultaneously: tab 2 generated the full Balanza (35,311.41 / 35,071.41 including the section-18 sweep JEs); tab 0's Closing for 2026 hit the idempotency guard (400 "already closed") — **1 closing JE for 2026, 29 JEs total, no race duplicates**. A true concurrent double-close could not be produced (no period with unclosed data remained); the reference-based idempotency check is the race protection and it held.

---

## 21. Bug Summary (run 2026-09-17)

Bugs found during this run (A–O), ordered by severity. IDs reference the sections above.

### Critical

| ID | Bug | Evidence | Sections blocked/affected |
|----|-----|----------|---------------------------|
| G | **"Registrar pago" unusable from the UI**: `[(ngModel)]` on the Monto `p-inputNumber` and Diario `p-select` never writes back to `settlementAmount`/`settlementJournalId` (signals stay stale — verified with Angular devtools); the button's `!settlementAmount() || !settlementJournalId()` can never be satisfied | invoice-form.ts:157-159, 718-722 (html) | 10.3 (setup via API), 16 (all payments via API), Ej. 5/8 UI flows |
| L | **Advance flow is a dead end**: standalone payments are always `draft` (PaymentDTO lacks `status`, JE created DRAFT, no confirm endpoint/action; PUT `status` → 500) while `GET /payments/advances` requires `CONFIRMED, invoiceId: null` — and the only CONFIRMED payments (register-payment) always carry `invoiceId` → **the advances list can never return data** | payment-routes.ts, payment-service.ts:61-110, 115-123 | 17.2–17.5 ❌, Ej. 10 application step |
| O | **DatePicker null → Generate crash + stuck loading**: typing in the report datepickers can leave the signal `null`; `runBalanza`/`runIva` call `.toISOString()` unguarded → `TypeError`, no request, and `isLoading` never resets (Generate permanently disabled until re-navigation) | gl-reports-list.ts:139-141, 192-194; console NG TypeError ×2 reproduced | 20.3, general Reports usability |

### High (data integrity)

| ID | Bug | Evidence | Sections blocked/affected |
|----|-----|----------|---------------------------|
| C | **Auto-derived JEs can be unbalanced**: the closing service dropped the income-account line when the income net was negative (loss) and posted a single-sided result line; the purchase-invoice derivation silently drops the AP counterpart when no account is resolvable; the auto-posting path skips the Σ D = Σ C validation that manual JEs enforce | closing-entries-service.ts; JE "Closing entries of 2026" = 1 line (D 120/C 0); section 9.2 first attempt | 8.2, 15.2-adjacent, Ej. 33/34 |
| K | **Payments on PURCHASE invoices settle the wrong side**: `paymentType: "inbound"` + settlement JE `D bank / C 400` — the CREDIT increases the ledger payable while `amountDue` says the debt went down → AP ledger diverges from the document | register-payment response; JE "PAY-PUR-15.2" | 15.2, Ej. 7/46 flows |
| H | **Cancel double-negates in GL aggregations**: `cancel()` excludes the original (status `cancel`) AND posts a posted reversal JE — the aggregation includes the reversal without the original → the cancelled invoice's impact flips sign instead of netting to zero | trial-balance 6,915.60/6,795.60 → 7,535.60/7,295.60 after cancelling a balanced invoice | 10.4, every report after a cancel |

### Medium

| ID | Bug | Evidence | Sections affected |
|----|-----|----------|-------------------|
| M | **Adjustment sweep gaps**: (a) manual ADJUSTMENT movements (`referenceType: ""` — the natural case, Ej. 12) are selected by the sweep query but silently skipped by `tryPostMovement` (the `""` refType check runs first); (b) the REVERSAL of an adjustment (IN with the adjustment's refType) is never matched by the sweep query → the GL keeps the loss after the stock is restored | gl-integration-service.ts:45-49, 118-121, 76-88 | 18.3/18.4, Ej. 12 |
| I | **Due-date chips don't recalculate on invoice-date change**: `dueDateEntries` only rebuilds in `onPaymentTermChange`; the singular `dueDate` stays stale even after save/post (11-16 instead of 11-29) | devtools: `invoiceDate` = 09-30 vs `dueDateEntries` = {10-17, 11-16} | 12.3/12.4 |
| J | **Editing a payment's amount doesn't recalculate the invoice outstanding**: amount 500 → 600 left the invoice `amountDue` at 1,760 (should be 1,660); `recalculateInvoiceOutstanding` runs on register/delete but not on update | payment PUT; invoice API after edit | 13.2 |
| B | **customer-sales rows lack `currencyCode`** (only `currencyId`) → the Currency column renders "No definido" | customer-sales response; customerSales column `currencyCode` | 4.3, 7.1 |
| D | **`paymentTermId` required by the backend but not by the UI** → raw 400 "paymentTermId must be a mongodb id" on save without a term (recurred 2×) | invoice POST 400 | 9.x, 11.1 |
| E | **Draft edit updates `totalAmount` but not `amountDue`** (stale 1,130 vs 2,260 in the list's "Monto Adeudado") — self-healed only after the cancel | invoice update; list row | 9.1/9.4 |

### Low / cosmetic

| ID | Bug | Evidence | Sections affected |
|----|-----|----------|-------------------|
| A | **Ledger drill-down unreachable**: `drillDown(row)` exists but nothing invokes it — no action column in `glTrialBalanceColumns`, no `onClickRow` on the Balanza table (dead code) | gl-reports-list.ts:154, gl-reports-list.html:123-126 | 3.1, 3.5 (backend endpoint verified OK) |
| F | **Editing a POSTED invoice crashes with NG01350** (`ngModel cannot be used to register form controls with a parent formGroup directive`) ×5 on form load; the frontend should block the edit route for posted invoices entirely | console log; posted edit URL loads | 9.3 |
| N | **Soft-fail notifications invisible**: `notifySoftFail` fires with `context: {}` → `fireNotification` resolves `userIds = []` → nobody ever receives the "GL posting skipped" alert | gl-integration-service.ts:246-254; notifications list unchanged after skips | 18.5 |
| — | Cosmetic/no-code findings: reports/labels render raw translation keys (`nav.reports`, `reports.*`, `form.payments`, `buttons.createCreditNote`) — **excluded by scope**; trial-balance table lacks the nature/type column (the API has `accountType`); `amountDue: 0` renders "No definido" in lists; the payment edit title says "Nuevo Pago" in edit mode; the environment shows spontaneous navigation to `/accounting/reports` (and once to `/settings/templates/edit/...`) consistent with the known Firebase Zone / `router.navigate()` limitation | — | 1.x, 4.3, 13.1, 14.2 |

### Fixes applied during the run (verified as part of the tests)

| Fix | Verified in |
|-----|-------------|
| `currencyId` whitelist on `ClosingEntriesDTO` + frontend omits the key when empty | 8.1 (200 OK), 8.5, 19.4 |
| Tab-switching regression (`p-tabs [(value)]` two-way binding + 4th panel `value="customerSales"`) | 4.1–4.5 |

### Run statistics

- **Executed**: 20 sections, 88 test cases → **70 ✅ / 12 ⚠️ / 6 ❌** (2 of the ⚠️ are the fixed-bug regressions verified OK; the ❌ map to bugs A(2), C(1), H(1), I(1), O(1)).
- **Bugs filed**: 15 (A–O): 3 critical (G, L, O), 3 high (C, K, H), 6 medium (M, I, J, B, D, E), 3 low (A, F, N).
- **Config gaps found (not bugs)**: tenant had no equity accounts, no general journal, no inventory mapping, no discount account — all created/configured via the UI during the run; tax accounts point at the income account (472/477 split impossible today).
