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

**Re-test (2026-09-18) — Phase 6 translations fix (via UI):**

- 1.1 ✅ — Accounting menu entry now renders **"Informes"** (the `nav.reports` en/es catalog fix) instead of the raw key.
- 1.2 ✅ — Reports screen renders fully translated: heading **"Informes contables"**, buttons **"Generar" / "Cierre"**, filter labels **"Fecha desde" / "Fecha hasta" / "Moneda" / "Año"**; tabs render **"Balanza" / "PyG" / "IVA" / "Ventas por cliente"**. All previously-raw `reports.*` keys resolved.

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

**Re-test (2026-09-18) — Phase 6 nature-column fix (via UI):**

- 2.1 ✅ **FIXED** — the Balanza table now renders the **Naturaleza (nature) column**: row `Sales / Sales Account / income / CRC / …` — the API's `accountType` is finally displayed (was omitted on 09-17).
- 2.2 ✅ (smoke) — Generate with valid dates fills the table, totals block renders translated ("Cuadrado: No" — the Δ 240 is the pending task-2.4 data repair), Generate button re-enables; zero new console errors.

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

**Re-test (2026-09-18) — Phase 4 fix verification (BUG-A, via UI):**

- 3.1 ✅ **BUG-A FIXED** — the Balanza rows are now clickable (`[onClickRow]="drillDown"` + `clickRowPermission="accounting/reports/list:view"`); clicking the `129 Pérdidas y Ganancias` row **opened the Ledger view**: Volver button, movements table (incl. the "Closing entries of 2026" JE) and the Apertura/Cierre balance tags — the formerly dead code is reachable.
  - **Fix-of-the-fix found by this re-test:** the first click crashed with `TypeError: Cannot read properties of undefined (reading 'dateRangeParams')` — `drillDown` was passed as a bare callback so `this` was lost. Fixed by converting it to an arrow-function property (the codebase's `gotoEdit = (element) => {}` list convention); re-click verified clean.
- 3.5 ✅ **FIXED** — "Volver" returned to the Balanza table with the filters INTACT (From 01/01/2026, To 12/31/2026, Balanza tab still selected).

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

**Re-test (2026-09-18) — Phase 4 fix verification (BUG-B, API + UI):**

- 4.3 / 7.1 ✅ **BUG-B FIXED** — the customer-sales rows now carry `"currencyCode": "CRC"` (API: hydration added to `getCustomerSales`, same bulk pattern as `getTrialBalance`); the UI's Moneda column renders **"CRC"** (was "No definido"): row `TERMINALES Y ENTREGAS INTERNACIONALES SOCIEDAD ANONIMA / CRC / 7,665.6`.

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

**Re-test (2026-09-18) — Phase 2 fix verification (BUG-C, via API):**

- Setup (2027 = still-open period): posted a draft invoice dated 2027-01-15 (Sales Journal, TERMINALES, 1 × Computer @ 2,000 + IVA 13% = 2,260 — all 3 JE lines post to "Sales Account" per the tenant's single-account config quirk) + a balanced manual JE (D Sales Account 3,000 / C 400 Proveedores 3,000, 2027-02-01) → 2027 income saldo = **+3,000 DEBIT (loss)** — the exact BUG-C shape, amplified by the counterpart line also posting to the income account.
- 8.2 ✅ **BUG-C FIXED** — `POST /gl/closing-entries` with body `{"period":"2027"}` (empty-currency contract, 8.1) → **200** `{resultAmount: 3000}`; closing JE "Closing entries of 2027" (POSTED, 31/12/2027) now has **2 balanced lines: C Sales Account 3,000 ("Close income of 2027") + D 129 Pérdidas y Ganancias 3,000 ("P&L result of 2027")** — Σ D = Σ C = 3,000. The old code clamped the negative income amount and posted a single-sided D 129 JE; the new sign-based logic flips the side (credit the debit-surplus income account) and the equity line balances by difference.
- 8.3 ✅ — Opening JE "Opening entries of 2028" (POSTED, 01/01/2028) = exact inversion (D Sales Account 3,000 / C 129 3,000), balanced.
- 8.4 ✅ — duplicate `POST {"period":"2027"}` → **400 "Period 2027 is already closed — a posted closing entry exists."** (idempotency guard intact); 8.5 contract re-checked by sending `currencyId` in the body → same business error, no DTO whitelist error.
- 8.6 ✅ — PyG 2027 AFTER closing: **incomeTotal 0 / expenseTotal 0 / result 0** — with a correct balanced closing the YTD nets to 0, exactly as the original finding predicted.
- 19.3 ✅ (re-checked during setup) — unbalanced manual JE (D 100 / C 90) still rejected: 400 "Total debits must equal total credits."

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

**Re-test (2026-09-18) — Phase 1 fix verification (BUG-F, via UI):**

- 9.3 ✅ **BUG-F FIXED** — opened the POSTED invoice INV/2026/00003's edit form via row click: the form loads with **ZERO `NG01350` console errors** (previously **5×** on page load). Root fix confirmed: the 6 settlement `[(ngModel)]` controls now carry `[ngModelOptions]="{ standalone: true }"`, so NgModel no longer collides with the parent `[formGroup]`. (Route blocking deliberately not applied — see section 22, task 6.6: the form is the posted invoice's view + payments surface.)
- 🐞 **BUG-D (minor, contract mismatch):** the backend requires `paymentTermId` (`@IsMongoId`, rejects `""`) but the UI does not mark Término de Pago as required — first save without it returned the raw 400 `paymentTermId must be a mongodb id`. Either mark it required in the form or make it optional in the DTO.
- 🐞 **BUG-E (minor, data):** editing the draft recalculated `totalAmount` (1,130 → 2,260) but `amountDue` stayed **1,130** (still shown in the list as "Monto Adeudado $1,130.00") — `amountDue` should track the new total for a draft with no payments.
- ⚠️ **Environment flakiness (observed twice):** after successful saves the app spontaneously landed on `/accounting/reports` (once with the previously-active tab) — consistent with the known Firebase Zone / `router.navigate()` limitation documented in execution_guidelines.md. In-app `[routerLink]` navigation worked every time.

**Re-test (2026-09-18) — BUG-C part 2 verification (counterpart drop, via API):**

- 9.2-edge ✅ **FIXED** — created purchase journal "Diario Compras Sin Contraparte / SCP" (no default credit account; the tenant's `purchasePayableAccountId` setting does not resolve either) and tried to save a draft invoice on it → **400 "No accounts-payable counterpart account: configure the journal's default credit account or the 'purchasePayableAccountId' setting before saving this invoice."** — the formerly silent `counterpartLine = []` drop (which produced an unbalanced JE, section 9.2 first attempt on 09-17) is now an actionable validation error.

**Re-test (2026-09-18) — Phase 3 fix verification (BUG-E, via API):**

- 9.1 (amountDue side) ✅ **BUG-E FIXED** — new draft (1 × Computer @ 400, no tax) created via API: `totalAmount: 400, amountDue: 400` (create seeds both); edited the draft (quantity 1 → 2) via `PUT /invoices` → **`totalAmount: 800` AND `amountDue: 800`** — the outstanding now tracks line edits (on 09-17 it stayed stale at the seeded value while the total changed). JE lines rebuilt balanced (2 lines).

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

**Re-test (2026-09-18) — Phase 2 fix verification (BUG-H, via API):**

- Baseline Balanza 2026 (before the cancel): totals **28,951.41 / 28,711.41** (Δ 240 = legacy unbalanced JE1's 120 + the defective 1-line closing JE of 2026's 120 — task 2.4 data repair still pending).
- 10.4 ✅ **BUG-H FIXED** — cancelled INV/2026/00005 (posted, total 1,000, no payments): the reversal JE was created correctly (POSTED, `reversalOf` set, lines exactly inverted, self-balanced) and the Balanza totals went to **27,951.41 / 27,711.41** — a drop of exactly the cancelled invoice's GROSS (1,000/1,000) with the debit−credit Δ UNCHANGED (240): the cancelled-original + reversal pair now contributes **zero net** (the old bug grew the totals +2,260/+2,260 — the impact flipped sign). The account-level saldo for "Sales Account" (both of the invoice's lines post there) is untouched.
- Ledger cross-check ✅ — `GET /gl/ledger/<Sales Account>?from=2026-01-01&to=2026-12-31` contains **zero rows** referencing INV/2026/00005 or its reversal (the original excluded by `status: cancel`, the reversal excluded by the new `reversalOf: { $exists: false }` match).

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

**Re-test (2026-09-18) — Phase 4 fix verification (BUG-D, via UI):**

- 11.1 ✅ **BUG-D FIXED** — created a draft via the UI invoice form with **NO Término de Pago selected** (Sales Journal, TERMINALES, 1 × Computer @ 2,000; line's Cuenta selected — that empty account was what kept the form invalid until chosen): Save fired `POST /api/accounting/invoices` → **200 OK**, record persisted with `paymentTermId: None`, `amountDue: 2000` seeded. **The raw 400 "paymentTermId must be a mongodb id" no longer occurs** (the FE strips the empty value; the optional-end-to-end contract decided in Phase 4).

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

**Re-test (2026-09-18) — Phase 4 fix verification (BUG-I, UI + API):**

- Setup: draft created via UI (1 × Computer @ 2,000, Sales Journal, **saved WITHOUT payment term** — see the BUG-D block in section 11) → then selected "30/60 Days 50/50" with the invoice date at 09/30 → chips `30 oct 2026 / 1,000.00` + `29 nov 2026 / 1,000.00` (term recalculation uses the CURRENT date ✓). Note: a dev-server disconnection reloaded the page mid-test (unsaved term wiped — environment, not the app; re-selected and continued).
- 12.4 ✅ **BUG-I FIXED (frontend)** — changed ONLY the invoice date (09/30 → 10/05/2026) without touching the term: the chips **recalculated live to `4 nov 2026 / 1,000.00` + `4 dic 2026 / 1,000.00`** (on 09-17 they stayed stale at the term-change values; devtools then showed `dueDateEntries` frozen).
- 12.3 ✅ **FIXED (backend)** — Save: `dueDates` = [(2026-11-04, 1000), (2026-12-04, 1000)] ordered ✓ and the singular **`dueDate` = 2026-12-04 = the LAST installment** (server re-derivation). Post ("Contabilizar Factura" → INV/2026/00014): `dueDate` **stays 2026-12-04**, consistent with the schedule (on 09-17 it remained stale at the client-echoed 11-16 after the same flow).

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

**Re-test (2026-09-18) — Phase 3 (+6.5) fix verification (BUG-J, via API):**

- 13.2 ✅ **BUG-J FIXED** — edited the 60-payment on INV/2026/00003 (60 → 70 via `PUT /payments`):
  - the invoice outstanding recalculated: `amountDue` **1,600 → 1,590** (on 09-17 it stayed stale at the pre-edit value);
  - **AND the settlement JE was rebuilt** (the 6.5 follow-up): its lines now read **D 70 ("Payment of invoice…") / C 70 ("Accounts Receivable settlement")** — Σ balanced — so the GL matches the payment document (on 09-17 the JE kept the original amount).
- 13.1 ✅ (cosmetic side) — the edit page title now reads **"Editar Pago"** in edit mode (was "Nuevo Pago"; verified live in the UI during the BUG-L pass).

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

**Re-test (2026-09-18) — regression with the new NC pending guard (via API):**

- 14.1/14.2 ✅ — clean NC on a freshly posted purchase invoice INV/2026/00012 (525 total, NO payments) → **200**: NC **INV/2026/00013** created (`isCreditNote: true`, `reversalOf` = source, lines exactly inverted); source `amountDue → 0`, `isFullyPaid: true`. The new `amountDue < totalAmount` guard (Phase 2, 15.3-edge) does NOT affect the clean no-payments path.

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

**Re-test (2026-09-18) — Phase 2 fix verification (BUG-K + 15.3-edge, via API):**

- Setup: purchase invoice **INV/2026/00011** posted (Diario de Compras, TERMINALES, 1 × Computer @ 500 + ARD30 5% = 525).
- 15.2 ✅ **BUG-K FIXED** — `register-payment` 100 (Sales Journal as the bank journal): payment **`paymentType: "outbound"`** (was `"inbound"`) and the settlement JE posts **D 400 Proveedores 100 ("Accounts Payable settlement") / C bank 100 ("Payment of invoice INV/2026/00011")** — Σ balanced; the payable is now DISCHARGED instead of increased (GL no longer diverges from the document); invoice `amountDue` 525 → **425**.
- 15.3-edge ✅ (new guard) — `POST /credit-note` on INV/2026/00011 (payment present, pending 425 < 525) → **400 "This invoice has confirmed payments and a credit note reverses its full amount. Reverse the payments first so the pending equals the total, then create the credit note."** — the phantom-credit edge (old: the NC credited the full 2,100 over a pending of 1,100) is now blocked with an actionable error; the clean no-payments NC path remains open (see section 14 re-test).

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

**Re-test (2026-09-18) — Phase 1 fix verification (BUG-G, via UI):**

- 16.1 ✅ **BUG-G FIXED — "Registrar pago" now works end-to-end from the UI** (on posted INV/2026/00003, pending 1,760):
  - The Monto `p-inputNumber` and Diario `p-select` **write back to their signals**: typing a real amount and selecting "Sales Journal" **enabled the previously-permanently-disabled button** (`!settlementAmount() || !settlementJournalId()` became satisfiable — the value accessors register now that the NG01350 collision is fixed).
  - Clicked "Registrar pago" → `POST /invoices/:id/register-payment` → **200 OK**: payment created (`amount: 60`, `type: inbound`, `status: confirmed`) and invoice `amountDue` 1,760 → **1,600** (verified via API).
  - Bonus guard check via UI: an attempted payment of 601,760 (a test-harness typing artifact that APPENDED to the pre-filled value) was correctly rejected with **400 "Payment exceeds the outstanding amount"** — the over-settlement guard also fires from the UI path.

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

**Re-test (2026-09-18) — Phase 3 fix verification (BUG-L, API + UI):**

- 17.1 ✅ **BUG-L FIXED** — standalone payment S1 (inbound, TERMINALES, Diario de Anticipos, 500) created via API → `status: draft` + JE draft `D Sales Account 500 / C 438 500` (exact Ej. 10 asiento 1 shape, unchanged); advances list returns **0** for the partner while draft (correct filter). **New confirm action**: `PUT /accounting/payments/:id/confirm` → **200**: S1 → **confirmed** AND its JE → **POSTED**. Status is NOT editable via PUT (whitelist rejection stands) — the confirm endpoint is the only draft→confirmed path, as designed.
- 17.2 ✅ **FIXED (was unreachable)** — on INV/2026/00003's Payments tab the **"Aplicar anticipo" block now renders** (gated on the now-non-empty advances list) showing the available advance `RETEST-ADV-S1 · 500.00`; the advance appears in the dropdown.
- 17.3 ✅ **FIXED** — "Aplicar" via UI: apply JE POSTED "Advance applied to invoice INV/2026/00003" = **D 438 Anticipos de Clientes 500 / C Sales Account (AR) 500** (exact Ej. 10 asiento 2 shape); S1 got `invoiceId` + `appliedInvoiceId` + `appliedJournalEntryId`; invoice `amountDue` 1,590 → **1,090**.
- 17.4 ✅ — after applying, the advance disappears from the partner's advances list (0 returned); direct API re-apply → **400 "This payment is already linked to an invoice and cannot be re-applied."** (anti-double-apply guard).
- 17.5 ✅ — standalone advance S2 (5,000) created + confirmed via API, then applied to INV/2026/00003 (pending 1,090) → **400 "The advance amount exceeds the invoice's pending amount (1090)."** (over-apply guard).
- UI confirm button ✅ — created S3 (150, Diario de Anticipos) via the payment FORM; its edit page shows the new **"Confirmar pago" button** (draft + update mode only); clicking it flipped S3 → **confirmed** and its JE → **POSTED** (`D Sales Account 150 / C 438 150`) with navigation back to the list. The whole A2b chain (create → confirm → list → apply) is now reachable end-to-end.

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

**Re-test (2026-09-18) — Phase 5 fix verification (BUG-M + BUG-N, API + UI):**

- 18.3 ✅ **BUG-M FIXED (manual adjustments post)** — created a manual `ADJUSTMENT / DECREASE` movement the natural way (`referenceType: ""`, the Ej. 12 case that was silently skipped on 09-17) → sweep `{posted: 5, skipped: 0, failed: 0}`: the new movement **POSTED** — JE (POSTED, `sourceStockMovementId` linked, balanced): **D "Sales Account" (adjustment-loss mapping) 1,320.51201 "Stock adjustment" / C Elias (323) 1,320.51201 "Stock out"**. Bonus: the sweep **retroactively posted the historically-skipped manual adjustments** (including the QA-9.7 one) that the old check-order had stranded pending forever.
- 18.4 ✅ **BUG-M FIXED (adjustment reversals swept)** — `POST /inventory/movements/:id/reversal` on the adjustment (IN movement, `referenceType: ""` copied, `adjustmentDirection: INCREASE`, `reversalOf` set) → next sweep `{posted: 1}` — the new `$or` arm selected it and posted the inverted JE: **D 323 "Stock in" / C "Sales Account" (loss) "Stock adjustment"** — the GL loss is REVERSED when the stock is restored (on 09-17 the reversal was never swept and the loss stayed forever).
- 18.5 ✅ **BUG-N FIXED (visible notifications)** — removed `adjustmentLossAccountId` from the mapping (⚠️ test-harness note: the settings `PUT` REJECTS `_id` ("property _id should not exist" — whitelist) and silently keeps omitted sub-doc fields (Mongoose partial-assign); the removal needs `adjustmentLossAccountId: null` WITHOUT `_id`) → created manual ADJUSTMENT (ADJ-3) → swept via the UI button "Publicar asientos pendientes" → **"Contabilizados: 0 · Omitidos: 1"**: no JE, the stock movement itself unaffected (soft-fail ✓) **AND the notification is now VISIBLE**: in the API (`GET /notifications` → `inventory.gl.mapping-missing` / "GL posting skipped for stock movement / missing 'inventoryAccounts' mapping for type ADJUSTMENT ()") **and in the UI bell panel** ("ahora mismo") — on 09-17 `userIds` resolved to `[]` and nobody received it. Sweep-result labels render translated ("Contabilizados/Omitidos" — the 6.1 `gl.sweep*` keys).
- Deferred consistency ✅ — mapping restored (`adjustmentLossAccountId` → Sales Account) → next sweep `{posted: 1}`: ADJ-3 posted (D loss / C inventory, balanced).

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

**Re-test (2026-09-18) — Phase 1 fix verification (BUG-O, via UI):**

- 20.3 ✅ **BUG-O FIXED** — typed the unparsable text `99/99/9999` into "Fecha hasta" and committed with Enter (PrimeNG writes `null` into the model), then clicked Generar:
  - **NO `TypeError: Cannot read properties of null`** — the console stays clean (the old code crashed on `.toISOString()`).
  - The new guard **shows the error toast**: "Seleccione fechas Desde/Hasta válidas antes de generar el informe." (the `reports.invalidDates` es entry).
  - **NO stuck loading**: no request is sent and the Generar button re-enables immediately (`isLoading` resets via `finalize`/pre-guard) — the old behaviour left the button permanently disabled until re-navigation.
- Smoke ✅ — with valid dates restored, Generate runs normally (see section 2 re-test).

---

## 21. Bug Summary (run 2026-09-17)

Bugs found during this run (A–O), ordered by severity. IDs reference the sections above. Root causes added 2026-09-18 after code exploration (all file:line verified in `bifi_app` / `bifi_app_be`). Fixes implemented for ALL bugs (Phases 1–6, see section 22) and **ALL 15 verified fixed** in the 2026-09-18 re-test pass (see the per-section "Re-test" blocks; the pass also caught + fixed a `this`-binding defect in the BUG-A wiring).

### Critical

| ID | Bug | Root cause (verified in code) | Evidence | Sections blocked/affected | Re-test (2026-09-18) |
|----|-----|------------------------------|----------|---------------------------|----------------------|
| G | **"Registrar pago" unusable from the UI**: `[(ngModel)]` on the Monto `p-inputNumber` and Diario `p-select` never writes back to `settlementAmount`/`settlementJournalId` (signals stay stale — verified with Angular devtools); the button's `!settlementAmount() \|\| !settlementJournalId()` can never be satisfied | **ngModel-inside-formGroup kills the value accessor.** The form carries `[formGroup]` (invoice-form.html:12) and the posted-only payments block renders 5 `[(ngModel)]` controls inside it (:672, :682, :695, :705, :713). Each NgModel throws NG01350 at creation and `_setUpControl()` aborts **before `registerOnChange` runs**, so `ngModelChange` never emits → signals stay stale. The p-datepicker only *seems* to work because it is pre-initialized to today (invoice-form.ts:160) while PrimeNG keeps its own display state. Fix: `[ngModelOptions]="{ standalone: true }"` on all 6 controls (codebase pattern, e.g. product-form.html:243) or convert to `[formControl]`. | invoice-form.ts:157-159, 718-722 (html) | 10.3 (setup via API), 16 (all payments via API), Ej. 5/8 UI flows | ✅ **Verified fixed** (2026-09-18, UI) — signals write back, button enables and a real payment registered end-to-end from the invoice form (section 16 re-test block) |
| L | **Advance flow is a dead end**: standalone payments are always `draft` (PaymentDTO lacks `status`, JE created DRAFT, no confirm endpoint/action; PUT `status` → 500) while `GET /payments/advances` requires `CONFIRMED, invoiceId: null` — and the only CONFIRMED payments (register-payment) always carry `invoiceId` → **the advances list can never return data** | **Unsatisfiable status lifecycle.** `PaymentDTO` has no `status` (payment.dto.ts:15-57; `UpdatePaymentDTO` = PartialType only inherits decorated props), `create()` hardcodes the JE to DRAFT (payment-service.ts:92) and payment-routes.ts has **no confirm route** — PUT with `status` is rejected by the DTO whitelist (`forbidNonWhitelisted`) before any handler runs. The sole `status: CONFIRMED` writer is `registerPayment()` (invoice-service.ts:824), which always stamps `invoiceId` (:823). The advances filter `{status: CONFIRMED, invoiceId: null}` (payment-service.ts:118-124) is therefore an impossible intersection → always `[]`. | payment-routes.ts, payment-service.ts:61-110, 115-123 | 17.2–17.5 ❌, Ej. 10 application step | ✅ **Verified fixed** (2026-09-18, API + UI) — confirm endpoint flips payment+JE, advances list returns data, apply via UI works (D 438 / C AR), both guards fire (sections 17 re-test block) |
| O | **DatePicker null → Generate crash + stuck loading**: typing in the report datepickers can leave the signal `null`; `runBalanza`/`runIva` call `.toISOString()` unguarded → `TypeError`, no request, and `isLoading` never resets (Generate permanently disabled until re-navigation) | **PrimeNG writes `null` into `[(ngModel)]`** on clear-button/invalid-typed input (`primeng-datepicker.mjs` `updateModel(null)`), so `fromDate`/`toDate` (gl-reports-list.ts:70-71) hold null despite being typed `signal<Date>`. `runBalanza`/`runIva` then call `.toISOString()` unguarded (ts:132-133, 185-186) — the TypeError fires **after** `isLoading.set(true)` (:131) but **before** `.subscribe()` registers the `error:` callback that would reset loading → stuck forever. The component's own guard `onDateChange` (ts:122-128) is unbound dead code. Fix: null-guard the signals + `finalize`/`try-finally` the loading reset. | gl-reports-list.ts:139-141, 192-194; console NG TypeError ×2 reproduced | 20.3, general Reports usability | ✅ **Verified fixed** (2026-09-18, UI) — null date + Generar: error toast, no TypeError, button re-enables (section 20 re-test block) |

### High (data integrity)

| ID | Bug | Root cause (verified in code) | Evidence | Sections blocked/affected | Re-test (2026-09-18) |
|----|-----|------------------------------|----------|---------------------------|----------------------|
| C | **Auto-derived JEs can be unbalanced**: the closing service dropped the income-account line when the income net was negative (loss) and posted a single-sided result line; the purchase-invoice derivation silently drops the AP counterpart when no account is resolvable; the auto-posting path skips the Σ D = Σ C validation that manual JEs enforce | **Negative income line is dropped instead of flipped + no balance check on the auto path.** `closing-entries-service.ts:118-119` clamps the income amount with `Math.min(0, row.saldo) * -1` then `if (creditMagnitude <= 0) continue` — a loss (debit-balance income) zeroes out and the line is skipped rather than flipping sides; the equity line (:128-142) posts `debit: isProfit ? 0 : resultAmount` → single-sided D 120. The JE is created via `journalEntryModel.create()` with `status: POSTED` and **no Σ D = Σ C validation** (only the manual path validates — journal-entry-service.ts:46-56). Purchase counterpart drop: `invoice-service.ts:390-407` resolves `journal.defaultCreditAccountId ?? purchasePayableAccountId ?? null` and sets `counterpartLine = []` **silently** when neither resolves. | closing-entries-service.ts; JE "Closing entries of 2026" = 1 line (D 120/C 0); section 9.2 first attempt | 8.2, 15.2-adjacent, Ej. 33/34 | ✅ **Verified fixed** (2026-09-18, API) — 2027 loss closing now posts a balanced 2-line JE (C income / D equity) + balanced inverted opening; PyG nets to 0 after closing; counterpart-drop now throws (see section 8/9 re-test blocks) |
| K | **Payments on PURCHASE invoices settle the wrong side**: `paymentType: "inbound"` + settlement JE `D bank / C 400` — the CREDIT increases the ledger payable while `amountDue` says the debt went down → AP ledger diverges from the document | **`registerPayment()` hardcodes the sales/inbound orientation end-to-end.** `invoice-service.ts:816` always writes `paymentType: INBOUND` (`RegisterPaymentDTO` has no `paymentType` field — it can't come from the request) and the settlement JE unconditionally debits the bank account and credits the counterpart with hardcoded "Accounts Receivable settlement" (:778-804). The invoice's `journalType` is never inspected (contrast `buildJELines` :360-407, which does branch on `purchase`) → for a purchase invoice the credit hits the AP account, increasing it. | register-payment response; JE "PAY-PUR-15.2" | 15.2, Ej. 7/46 flows | ✅ **Verified fixed** (2026-09-18, API) — payment on purchase invoice INV/2026/00011: `paymentType: "outbound"`, settlement JE D 400 Proveedores / C bank, payable discharged (section 15 re-test block) |
| H | **Cancel double-negates in GL aggregations**: `cancel()` excludes the original (status `cancel`) AND posts a posted reversal JE — the aggregation includes the reversal without the original → the cancelled invoice's impact flips sign instead of netting to zero | **Aggregation `$match` has no `reversalOf` exclusion.** GL aggregations match only `{ status: POSTED, active: true }` (gl-report-service.ts:166-169; ledger :293-297), while `cancel()` flips the original to CANCEL (invoice-service.ts:979-986 — excluded) and posts the reversal with `reversalOf` but `active` defaulting to true (:947-975 — included) → the reversal's flipped lines are aggregated alone. Fix: add `reversalOf: { $exists: false }` to the `$match` (or aggregate cancel+reversal pairs together). | trial-balance 6,915.60/6,795.60 → 7,535.60/7,295.60 after cancelling a balanced invoice | 10.4, every report after a cancel | ✅ **Verified fixed** (2026-09-18, API) — cancelling INV/2026/00005: original + reversal both excluded, totals drop by the gross with net Δ unchanged, zero ledger rows for the pair (section 10 re-test block) |

### Medium

| ID | Bug | Root cause (verified in code) | Evidence | Sections affected | Re-test (2026-09-18) |
|----|-----|------------------------------|----------|-------------------|----------------------|
| M | **Adjustment sweep gaps**: (a) manual ADJUSTMENT movements (`referenceType: ""` — the natural case, Ej. 12) are selected by the sweep query but silently skipped by `tryPostMovement` (the `""` refType check runs first); (b) the REVERSAL of an adjustment (IN with the adjustment's refType) is never matched by the sweep query → the GL keeps the loss after the stock is restored | **Check-order bug + sweep-query gap.** `tryPostMovement` tests `SKIPPED_REFERENCE_TYPES` (which contains `""` — the schema default for manual adjustments, stock-movement.model.ts:83-86) at gl-integration-service.ts:118-122 **before** the ADJUSTMENT branch (:139-143) → manual adjustments `return undefined` and are counted as `skipped` with no notify. The sweep `$or` (:76-92) only sweeps IN/OUT with refType `sales-order`/`purchase-order`, and reversal movements copy the original's refType verbatim (stock-movement-service.ts:388) → an adjustment reversal never matches either arm. Fix: check the ADJUSTMENT branch before the skip-set, and add an $or arm for reversal movements. | gl-integration-service.ts:45-49, 118-121, 76-88 | 18.3/18.4, Ej. 12 | ✅ **Verified fixed** (2026-09-18, API + UI) — manual ADJUSTMENT (refType "") posts (D loss / C inventory); its reversal sweeps (D inventory / C loss); historical strays retroactively posted (section 18 re-test block) |
| I | **Due-date chips don't recalculate on invoice-date change**: `dueDateEntries` only rebuilds in `onPaymentTermChange`; the singular `dueDate` stays stale even after save/post (11-16 instead of 11-29) | **FE: no listener on `invoiceDate`; BE: trusts the echoed `dueDate`.** `dueDateEntries` is rebuilt only in `onPaymentTermChange` (invoice-form.ts:273-297) — the component's only valueChanges subscription is `linesArray` (:204), nothing watches `invoiceDate`. Backend `update()` recomputes the `dueDates` **array** (invoice-service.ts:565-577) but the singular `dueDate` (:549-553) prefers the client-echoed value — which the form always sends (invoice-form.ts:483) — so the `calculateDueDate` fallback never runs, and `post()` (:889-893) never re-derives it. Fix: subscribe to `invoiceDate` valueChanges (or effect) + re-derive `dueDate` from the last `dueDates` entry server-side. | devtools: `invoiceDate` = 09-30 vs `dueDateEntries` = {10-17, 11-16} | 12.3/12.4 | ✅ **Verified fixed** (2026-09-18, UI + API) — date-only change recalculates the chips live; `dueDate` = last installment after save AND post (section 12 re-test block) |
| J | **Editing a payment's amount doesn't recalculate the invoice outstanding**: amount 500 → 600 left the invoice `amountDue` at 1,760 (should be 1,660); `recalculateInvoiceOutstanding` runs on register/delete but not on update | **No `update()` override in PaymentService.** PUT falls through to `BaseService.update()` — a plain `findByIdAndUpdate` with no side effects (base-service.ts:242-269) — while `recalculateInvoiceOutstanding` (payment-service.ts:292-329) is invoked only in `delete()` (:153) and `apply()` (:275) plus inline in registerPayment. Fix: override `update()` mirroring the `delete()` implementation. | payment PUT; invoice API after edit | 13.2 | ✅ **Verified fixed** (2026-09-18, API) — amount edit 60→70: amountDue 1,590 + settlement JE rebuilt to 70/70 balanced (section 13 re-test block) |
| B | **customer-sales rows lack `currencyCode`** (only `currencyId`) → the Currency column renders "No definido" | **`getCustomerSales` never hydrates Currency.** It aggregates in a Map keyed `contactId_currencyId`, stores only the raw `currencyId` (gl-report-service.ts:501-506), and its hydration loop fetches only Contact names (:511-519) — `CustomerSalesRow` doesn't even declare `currencyCode` (:85-89). Contrast `getTrialBalance`, which bulk-fetches Currency docs and projects `currencyCode` (:211-223, :235). The FE column maps `currencyCode` (gl-report-columns.ts:38-42) → undefined → TableLayout renders the `table.notSet` fallback ("No definido"). | customer-sales response; customerSales column `currencyCode` | 4.3, 7.1 | ✅ **Verified fixed** (2026-09-18, API + UI) — customer-sales rows carry `currencyCode: "CRC"`; the Moneda column renders it (section 7 re-test block) |
| D | **`paymentTermId` required by the backend but not by the UI** → raw 400 "paymentTermId must be a mongodb id" on save without a term (recurred 2×) | **`@IsOptional()` doesn't skip `""`.** The DTO declares `paymentTermId` `@IsOptional() @IsMongoId()` (invoice.dto.ts:106-108), but IsOptional only skips `undefined`/`null` — an empty string still fails IsMongoId → raw 400 via `validateBodyMiddleware`. Frontend: the control has no validator (invoice-form.service.ts:37 `paymentTermId: ['']`), the label isn't marked required (invoice-form.html:102), and `handleSubmit` strips only `contactId` (invoice-form.ts:464) so `""` goes out verbatim. | invoice POST 400 | 9.x, 11.1 | ✅ **Verified fixed** (2026-09-18, UI) — saving a draft with NO payment term → POST 200 (raw 400 gone; optional contract) (section 11 re-test block) |
| E | **Draft edit updates `totalAmount` but not `amountDue`** (stale 1,130 vs 2,260 in the list's "Monto Adeudado") — self-healed only after the cancel | **`amountDue` missing from the `update()` payload.** `InvoiceService.update()` recomputes and persists `untaxedAmount`/`taxAmount`/`totalAmount`/`lines` (invoice-service.ts:561-563, :642-645) but never `amountDue` — only `create()` seeds it (`:493`). registerPayment (:840-846), cancel (:979-986) and creditNote (:1073-1077) all recalc it, so `update()` is the one path breaking the invariant. Fix: add `amountDue: totalAmount` to the update payload for drafts. | invoice update; list row | 9.1/9.4 | ✅ **Verified fixed** (2026-09-18, API) — draft edit quantity 1→2: amountDue tracked to 800 (section 9 re-test block) |

### Low / cosmetic

| ID | Bug | Root cause (verified in code) | Evidence | Sections affected | Re-test (2026-09-18) |
|----|-----|------------------------------|----------|-------------------|----------------------|
| A | **Ledger drill-down unreachable**: `drillDown(row)` exists but nothing invokes it — no action column in `glTrialBalanceColumns`, no `onClickRow` on the Balanza table (dead code) | **Pure wiring gap — capability exists but is never connected.** `drillDown` is defined at gl-reports-list.ts:147-161 and is never referenced anywhere else in the lib; the Balanza table (gl-reports-list.html:123-126) binds only `[columns]`/`[data]` — no `[onClickRow]`, no `clickRowPermission`, no `#actions` template — and `glTrialBalanceColumns` (gl-report-columns.ts:10-17) has no action column. `TableLayout` supports both (`table-layout.ts:66` onClickRow input, `:102` actions contentChild). Fix: add `[onClickRow]="drillDown"` or an actions column with a Ledger button. | gl-reports-list.ts:154, gl-reports-list.html:123-126 | 3.1, 3.5 (backend endpoint verified OK) | ✅ **Verified fixed** (2026-09-18, UI) — Balanza rows open the Ledger; Volver returns with filters intact. Re-test caught a `this`-loss in the callback (fixed: `drillDown` → arrow property) (section 3 re-test block) |
| F | **Editing a POSTED invoice crashes with NG01350** (`ngModel cannot be used to register form controls with a parent formGroup directive`) ×5 on form load; the frontend should block the edit route for posted invoices entirely | **5 `[(ngModel)]` controls instantiate inside the `[formGroup]` form only when posted.** The posted-only block `@if (canRegisterPayment())` (invoice-form.html:661) renders ngModel controls at :672, :682, :695, :705, :713 (plus :630 `selectedAdvanceId` when advances exist); Angular's NgModel checks its parent type at creation and throws NG01350 because the parent is a `FormGroupDirective`, not NgForm. Drafts never render the block → the ×5 crash is posted-only. Fix: `[ngModelOptions]="{ standalone: true }"` (same fix as BUG-G) and/or block the edit route for posted invoices. | console log; posted edit URL loads | 9.3 | ✅ **Verified fixed** (2026-09-18, UI) — posted-invoice edit form loads with zero NG01350 errors (section 9 re-test block) |
| N | **Soft-fail notifications invisible**: `notifySoftFail` fires with `context: {}` → `fireNotification` resolves `userIds = []` → nobody ever receives the "GL posting skipped" alert | **Empty context → zero recipients.** `notifySoftFail` (gl-integration-service.ts:242-249) fires `fireNotification` with `context: {}`; `notification-service.ts:105-157` derives `userIds` from `Object.values(context)` (no-config fallback) or `context[roleId]` (configured roles) — both resolve to `[]` with an empty context, so the per-user creation loop runs zero times, and its errors are swallowed (:154-156). Fix: pass a recipient identity in the context (creator userId or an accounting-role key). | gl-integration-service.ts:246-254; notifications list unchanged after skips | 18.5 | ✅ **Verified fixed** (2026-09-18, API + UI) — skip fires `inventory.gl.mapping-missing` and the alert appears in the operator's notifications panel (section 18 re-test block) |
| — | Cosmetic/no-code findings: reports/labels render raw translation keys (`nav.reports`, `reports.*`, `form.payments`, `buttons.createCreditNote`) — **excluded by scope**; trial-balance table lacks the nature/type column (the API has `accountType`); `amountDue: 0` renders "No definido" in lists; the payment edit title says "Nuevo Pago" in edit mode; the environment shows spontaneous navigation to `/accounting/reports` (and once to `/settings/templates/edit/...`) consistent with the known Firebase Zone / `router.navigate()` limitation | — | — | 1.x, 4.3, 13.1, 14.2 | ✅ **Partially verified live** (2026-09-18, UI) — translations render ("Informes", "Informes contables", tabs, filter labels), nature column renders, settled invoice shows $0.00, payment edit title shows "Editar Pago"; remaining item (flakiness investigation) is a documented environment limitation |

### Fixes applied during the run (verified as part of the tests)

| Fix | Verified in |
|-----|-------------|
| `currencyId` whitelist on `ClosingEntriesDTO` + frontend omits the key when empty | 8.1 (200 OK), 8.5, 19.4 |
| Tab-switching regression (`p-tabs [(value)]` two-way binding + 4th panel `value="customerSales"`) | 4.1–4.5 |

### Run statistics

- **Executed**: 20 sections, 88 test cases → **70 ✅ / 12 ⚠️ / 6 ❌** (2 of the ⚠️ are the fixed-bug regressions verified OK; the ❌ map to bugs A(2), C(1), H(1), I(1), O(1)).
- **Bugs filed**: 15 (A–O): 3 critical (G, L, O), 3 high (C, K, H), 6 medium (M, I, J, B, D, E), 3 low (A, F, N).
- **Fix/re-test status (2026-09-18)**: all 15 fixes implemented (Phases 1–6, section 22) and **all 15 verified fixed** in the re-test pass — via API: C, K, H, L, J, E, M, N; via UI: G, F, O, B, D, I, A; cosmetics verified live (translations, nature column, $0.00 rendering, edit title). The re-test also caught + fixed the `drillDown` `this`-binding defect (section 3) and documented the settings-PUT `_id` whitelist gotcha (section 18). Re-test also caught and fixed a `this`-binding defect in the BUG-A wiring (section 3 re-test block).
- **Config gaps found (not bugs)**: tenant had no equity accounts, no general journal, no inventory mapping, no discount account — all created/configured via the UI during the run; tax accounts point at the income account (472/477 split impossible today).

---

## 22. Remediation Phasing (planned 2026-09-18, from the root-cause findings)

Ordered by importance: severity first, then unblocking value, then shared root causes (one fix can kill several bugs). Each phase is independently shippable and ends with a regression pass on the listed sections.

### Phase 1 — UI unblocking & crash fixes (critical) — ✅ IMPLEMENTED + ✅ RE-TESTED (2026-09-18: browser regression verified via UI — see the re-test blocks in sections 9, 16, 20 + cosmetics in 1/2)

*Goal: restore the two broken UI flows (payment registration, posted-invoice edit) and the stuck-loading Reports crash.*

| Task | Bugs | Status | Work | Regression check |
|------|------|--------|------|------------------|
| 1.1 | G, F | ✅ Done (2026-09-18) | **One fix, two bugs** (shared root): added `[ngModelOptions]="{ standalone: true }"` to the 6 settlement ngModel controls in `invoice-form.html` (`selectedAdvanceId` :630, `settlementAmount` :672, `settlementJournalId` :682, `settlementDiscountAmount` :695, `settlementPaymentDate` :705, `settlementReference` :713) — NG01350 no longer fires inside the `[formGroup]` form, value-accessors register and the signals receive writes. Edit-route blocking for posted invoices deliberately NOT added (kept for Phase 6 backlog). | 9.3 (no NG01350 on posted edit), 10.3 + 16 (Registrar pago enables and writes signals via UI) |
| 1.2 | O | ✅ Done (2026-09-18) | `fromDate`/`toDate` re-typed `signal<Date \| null>`; new `dateRangeParams()` helper null-guards and shows a `reports.invalidDates` error toast (ToastManager + TranslationService injected, new en/es catalog entries in `Catalog/i18n/translations/accounting-translations.json`); `runBalanza`/`runIva`/`drillDown` bail out before `isLoading.set(true)` and reset loading via `finalize(...)` — a sync throw can no longer strand the Generate button; dead `onDateChange` guard deleted (was never bound). | 20.3 (clear a date → no crash, button re-enables), 2.x/6.x smoke |

### Phase 2 — GL posting integrity (high — stops data corruption) — ✅ IMPLEMENTED + ✅ RE-TESTED (2026-09-18: backend `tsc` clean + API regression verified — see the re-test blocks in sections 8, 9, 10, 14, 15; task 2.4 data repair still pending)

*Goal: the ledger never receives unbalanced or wrong-side postings from auto paths.*

| Task | Bugs | Status | Work | Regression check |
|------|------|--------|------|------------------|
| 2.1 | C | ✅ Done (2026-09-18) | Closing service: line building is now **sign-based and generic** — `saldo` (debit − credit) > 0 closes via CREDIT \|saldo\|, < 0 via DEBIT \|saldo\| (abnormal balances flip sides instead of being dropped); the equity line takes the **balancing difference** (loss ⇒ equity DEBIT, profit ⇒ equity CREDIT, no zero line at diff 0); defensive Σ D = Σ C check (±0.0001) throws `ValidationException` before `create()`. Invoice derivation (`buildJELines`): a missing counterpart account now **throws** an actionable error (AP: journal default credit / `purchasePayableAccountId`; AR: journal default debit) instead of silently emitting `[]`. | 8.2/8.3 (balanced closing + opening JEs; loss case now D equity 120 / C Sales 120), 9.2 (saving on a journal without default credit account → clear error, not silent drop) |
| 2.2 | K | ✅ Done (2026-09-18) | `registerPayment` now loads the invoice's journal and derives the orientation from `journalType` (same rule as `buildJELines`): purchase ⇒ `paymentType: OUTBOUND` + settlement `D AP / [C discount] / C bank`; sales unchanged (`D bank / [D discount] / C AR`). Credit-note guard added (15.3 edge): `createCreditNote` refuses when `amountDue < totalAmount` (confirmed payments present) — the NC always reverses the FULL total, so payments must be reversed first (mirrors `cancel()`). | 15.2 (settlement JE = D 400 / C bank, `paymentType: outbound`), 14.x still passes, 15.3-edge now 400 with actionable message |
| 2.3 | H | ✅ Done (2026-09-18) | `reversalOf: { $exists: false }` added to all GL aggregation matches: `getTrialBalance` (also covers PyG + IVA via delegation), `getLedgerForAccount`, and `getCustomerSales` (reversals/NCs are not standalone sales activity). Design rule documented in-code: cancelled original + its reversal net to zero. | 10.4 (cancel nets to zero; totals return to baseline) |
| 2.4 | — (data) | ⏳ Pending (needs tenant DB access) | One-off dataset repair: legacy unbalanced JE1 (INV/2026/00001), wrong-side PAY-PUR-15.2 JE, double-negated cancelled-invoice pair. Recommended: manual re-post/repair in the tenant DB or a backfill script — not executable from this workspace without DB credentials. | 2.2 Balanced tag = Yes; AP ledger for INV/2026/00008 consistent |

### Phase 3 — Money consistency & payment lifecycle (medium) — ✅ IMPLEMENTED + ✅ RE-TESTED (2026-09-18: API + UI regression verified — see the re-test blocks in sections 9, 13, 17)

*Goal: amounts the document shows always agree with the GL; the advance flow becomes reachable.*

| Task | Bugs | Status | Work | Regression check |
|------|------|--------|------|------------------|
| 3.1 | L | ✅ Done (2026-09-18) | **Confirm action added** (option (a) of the plan): `PUT /accounting/payments/:id/confirm` (route mirrors the apply route, `authorizeMiddleware` update) → `PaymentService.confirm()` flips a DRAFT payment to CONFIRMED and its settlement JE DRAFT→POSTED (transactional). Status deliberately NOT added to `PaymentDTO`/`UpdatePaymentDTO` — the confirm endpoint is the only draft→confirmed path, so the PUT whitelist rejection is now correct behaviour. Frontend: `CrudPayments.confirmPayment()` + "Confirm payment" button in the payment form (shown for `isUpdate` + `status: draft`, disabled while the form is dirty) + `payments.confirm` en/es catalog entries. The A2b chain is now reachable: create standalone → confirm → advances list returns it → apply. | 17.1 (confirm flips payment+JE), 17.2–17.5 (advances list returns data; apply + guards reachable), 19.x PUT-whitelist unchanged |
| 3.2 | J | ✅ Done (2026-09-18) | `PaymentService.update()` override calls `recalculateInvoiceOutstanding` after persisting (mirrors `delete()`/`apply()`), handling populated/raw `invoiceId`. ⚠️ **Follow-up discovered:** editing a CONFIRMED payment's amount still does NOT rebuild its POSTED settlement JE (JE mutation lock) — the document now self-consistently tracks the payment sum, but the GL JE keeps the original amount until this is addressed (added to Phase 6 backlog). | 13.2 (amount 500→600 ⇒ amountDue 1,660) |
| 3.3 | E | ✅ Done (2026-09-18) | `amountDue: totalAmount` added to the invoice `update()` payload (`update()` is draft-only by its existing guard, and drafts have no confirmed payments) — the outstanding now tracks line edits. | 9.1 (list "Monto Adeudado" = 2,260 after edit) |

### Phase 4 — Reports & form polish (medium) — ✅ IMPLEMENTED + ✅ RE-TESTED (2026-09-18: API + UI regression verified — see the re-test blocks in sections 3, 7, 11, 12; the re-test caught and fixed a `this`-binding defect in the drill-down wiring)

| Task | Bugs | Status | Work | Regression check |
|------|------|--------|------|------------------|
| 4.1 | B | ✅ Done (2026-09-18) | `getCustomerSales` now bulk-fetches Currency docs for the aggregated `currencyId`s and maps `currencyCode` onto the rows (same pattern as `getTrialBalance`); `CustomerSalesRow` interface declares the field. | 4.3 / 7.1 (Currency column shows CRC, not "No definido") |
| 4.2 | A | ✅ Done (2026-09-18) | Balanza table wired with `[onClickRow]="drillDown"` + `clickRowPermission="accounting/reports/list:view"` (same view-type policy the route guard already requires — no new policy needed; exact-type-match semantics of the permission check make a `read:view` gate a dead end). The Ledger view/back are now reachable from the UI. | 3.1 / 3.5 (Ledger opens on row click, Back returns with filters intact) |
| 4.3 | I | ✅ Done (2026-09-18) | FE: schedule computation extracted into `rebuildDueDates()` (reads current `paymentTermId` + `invoiceDate` from the form); `onPaymentTermChange` delegates to it, and a new `invoiceDate` `valueChanges` subscription triggers it on date changes — chips + `dueDate` control follow the date. BE: `update()` re-derives the singular `dueDate` from the LAST `dueDates` entry instead of trusting the client echo (fallback chain preserved for schedules without installments), and `post()` re-derives it at posting time. | 12.3/12.4 (chips + `dueDate` follow the invoice date; singular = last installment after save/post) |
| 4.4 | D | ✅ Done (2026-09-18) | Contract decision: `paymentTermId` is **optional end-to-end** (cash sales without credit terms stay valid). FE `handleSubmit` strips an empty `paymentTermId` (same cleanup as `contactId`) so `@IsMongoId` never sees `""`; backend DTO unchanged (`@IsOptional` already skips `undefined`). The form label keeps no required marker, matching the optional contract. | 9.x / 11.1 (saving without a term succeeds — no raw 400 "must be a mongodb id") |

### Phase 5 — Inventory GL sweep (medium/low) — ✅ IMPLEMENTED + ✅ RE-TESTED (2026-09-18: API + UI regression verified — see the re-test block in section 18)

| Task | Bugs | Status | Work | Regression check |
|------|------|--------|------|------------------|
| 5.1 | M | ✅ Done (2026-09-18) | `tryPostMovement` restructured: the ADJUSTMENT branch and **adjustment reversals** (IN/OUT movements carrying `reversalOf` + `adjustmentDirection`, which copy the original's non-order referenceType) are now identified **before** the `SKIPPED_REFERENCE_TYPES` skip — manual adjustments (referenceType `""`, the Ej. 12 case) post again, posting to the adjustment-loss account in both cases. Sweep query gained a third `$or` arm (`type IN/OUT + adjustmentDirection exists`) so adjustment reversals are selected. Class rule table updated. | 18.3 (manual ADJUSTMENT with no referenceType posts: D loss / C inventory), 18.4 (adjustment reversal swept: D inventory / C loss — GL loss reversed; sales-order reversal path unchanged) |
| 5.2 | N | ✅ Done (2026-09-18) | `notifySoftFail` now passes `context: { creator: userStorage.getStore()?.user?._id }` — `fireNotification` resolves `userIds` from the context values (no-config fallback) or from the event-config `creator` role, so the sweep operator receives the "GL posting skipped" alert. | 18.5 (removing the mapping + sweep → notification visible for the current user) |

### Phase 6 — Backlog (low/cosmetic) — ✅ IMPLEMENTED (2026-09-18, code verified: backend + frontend `tsc` clean, `ng build base-app` + `ng build accounting` OK; browser regression pass pending)

| Task | Bugs | Status | Work | Regression check |
|------|------|--------|------|------------------|
| 6.1 | — (cosmetic) | ✅ Done (2026-09-18) | **All missing accounting-scope translation keys added** to `Catalog/i18n/translations/accounting-translations.json` (55 keys → 110 en/es entries, catalog now 478 entries, every key with exactly 2 locales): `nav.reports`, all `reports.*` (title/filters/tabs/totals/balanced/back/opening/result), GL column titles (`nature`, `debit`, `credit`, `saldo`, `sales`, `description`, `runningSaldo`), `form.payments`, `form.editPayment`, `buttons.createCreditNote`/`registerPayment`/`postPendingGl`, `payments.*` (apply/applyAdvance/none/register/selectAdvance), `invoice.amountDue`/`creditNote`, `gl.sweep*`, inventory-posting settings labels. | 1.x/2.x (Reports screen renders labels, not raw keys), 13.1, 14.1, 16.x |
| 6.2 | — (cosmetic) | ✅ Done (2026-09-18) | Trial-balance table gained the nature column: `{ field: 'accountType', title: 'nature' }` in `glTrialBalanceColumns` (API already returned `accountType`; mirrors the PyG table). | 2.1 (nature/type column now rendered) |
| 6.3 | — (cosmetic) | ✅ Done (2026-09-18) | Root fix in base-app `TableLayout`: the `currency` column renderer now treats only `null`/`undefined`/`''` as "not set" — `0` is a legitimate amount and renders `$0.00` (was falsy → "No definido" for a fully settled invoice). | 14.2 (source invoice "Monto Adeudado" = $0.00 after the NC) |
| 6.4 | — (cosmetic) | ✅ Done (2026-09-18) | Payment form title is mode-based: `isUpdate() ? 'form.editPayment' : 'form.newPayment'` (key added in 6.1). | 13.1 (edit page no longer says "Nuevo Pago") |
| 6.5 | — (follow-up of J) | ✅ Done (2026-09-18) | **Settlement-JE sync on payment edit** (decision: rebuild, not reject — 13.2's edit flow stays valid): `PaymentService.update()` detects an amount/discount change and rebuilds the linked JE's lines via `rebuildSettlementLines()` — standalone payments keep the journal's default 2-line pair; invoice-linked settlements mirror the Phase 2 orientation (purchase `D AP / [C discount] / C bank`, sales `D bank / [D discount] / C AR`) + defensive Σ D = Σ C guard. JE reference/date untouched. | 13.2 (edit 500→600: amountDue 1,660 AND settlement JE lines now show 600) |
| 6.6 | — (decisions) | ✅ Documented (2026-09-18) | (a) **Posted-invoice edit route NOT blocked** — the form is the de-facto view + payments surface for posted invoices (register payment, credit note, cancel all live there: sections 10/14/16 UI flows); NG01350 is fixed at the root (task 1.1) and the PUT is backend-guarded (9.3 ✅). (b) **Environment flakiness**: confirmed as the documented `execution_guidelines.md` limitation — a Firebase auth init error (`cls is not a constructor`) breaks Angular's Zone, so programmatic `router.navigate()` (save redirects) intermittently fails while `[routerLink]` works; fix belongs to the auth/bootstrap layer, out of accounting scope. | — |

**Recommended execution:** 1 → 2 → 3 → 4 → 5, regression-testing each phase against the sections above before moving on. Phases 1 ✅, 2 ✅ (task 2.4 data repair pending), 3 ✅, 4 ✅, 5 ✅ and 6 ✅ implemented — **ALL phases re-tested and verified (2026-09-18)**; remaining: task 2.4 data repair (legacy Δ 240 in the 2026 dataset).
