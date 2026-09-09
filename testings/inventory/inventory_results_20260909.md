# Inventory Valuation (WAC) — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** Historical inventory valuation (Weighted Average Cost) — `@avalantec/inventory` + `bifi_app_be/src/modules/inventory`. Covers movement cost stamping/WAC math, immutability & reversals, transfers, valuation report (AS_OF / DATE_RANGE), dashboard integration, and access control.
>
> **Pre-requisites:** Backend on :8080 with env `MONGO_DB_URL=mongodb://localhost:27017/bifi_app_db`; frontend on :4200 (user `opencode@test.com`, role Admin); API key header `x-api-key` works only on localhost with `dbname: bifi_app_db`.
>
> **Naming note:** Test flows can be executed via the UI or supplemented with API calls (curl) per execution_guidelines.md. WAC math verified against `GET /inventory/products/:id` (`averageCost`) and `GET /inventory/valuation`.

---

## 1. Backfill (9.14)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Run `npm run backfill-inventory-valuation -- --dry-run` | Script connects, reports counts without writing; exit 0 | |
| 1.2 | Check every legacy movement has `unitCost`/`totalCost`; settings `valuationMethod = WEIGHTED_AVERAGE` | Movements stamped (or 0 scans when already stamped); settings present | |
| 1.3 | `GET /inventory/valuation?mode=AS_OF&asOfDate=<past date>` | Past-date report renders with historical values | |

## 2. Movement Immutability (9.9)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | `PUT /api/inventory/movements` (update quantity) | 404/405 — routes removed | |
| 2.2 | `DELETE /api/inventory/movements/:id` | 404/405 — routes removed | |

## 3. WAC Mechanics (9.4–9.7)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Create test product (costPrice 100); IN 10 @ override 50 | Movement `unitCost=50`, `totalCost=500`; product `averageCost=50` | |
| 3.2 | IN 10 @ override 90 | Product `averageCost = (10×50 + 10×90)/20 = 70` | |
| 3.3 | ADJUSTMENT DECREASE 30 units (> available 20) | 400 ValidationException: "Insufficient stock at this location. Available: 20, requested: 30" | |
| 3.4 | ADJUSTMENT DECREASE 5 (valid) | Opposite direction recorded (`unitCost=70` current avg); average unchanged | |
| 3.5 | OUT 5 | Movement `unitCost=70` (current avg), `totalCost=350`; average unchanged | |
| 3.6 | TRANSFER 5 between locations | Both legs `unitCost=70`, `referenceType` `transfer-out`/`transfer-in`; product average unchanged; shared-location transfer → 400 | |

## 4. Reversals (9.8)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | `POST /inventory/movements/:id/reversal` on a TRANSFER leg | 400 — "Transfers cannot be reversed..." | |
| 4.2 | Reverse an ADJUSTMENT | Opposing movement (`INCREASE` for a DECREASE original) with `reversalOf` set, original unitCost | |
| 4.3 | Reverse an IN (after consumption) | Opposing OUT at original unitCost; product average re-symmetrically; ledger stays sane | |
| 4.4 | Reverse an OUT | Opposing IN at original unitCost; value restored | |
| 4.5 | Reverse the same movement again | 400 — "This movement has already been reversed." | |

## 5. Valuation Report — AS_OF (9.10)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | AS_OF today for the isolated test product | Rows match the hand-computed ledger replay (qty + running WAC per transfer/reversal flows) | |
| 5.2 | AS_OF with `productId` filter | Only that product's row; totals correct | |
| 5.3 | AS_OF with `locationId` filter | Only stock positioned at that location at the date | |
| 5.4 | Row name/sku populated | Product name + SKU present (hydration) | |

## 6. Valuation Report — DATE_RANGE (9.11)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Range covering the full test-product ledger | `beginningValue + incomingValue − outgoingValue + adjustmentsValue == endingValue` | |
| 6.2 | Summary cards in UI match API totals | Beginning/Incoming/Outgoing/Adjustments/Ending rendered | |

## 7. Dashboard (9.12)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | `GET /inventory/dashboard` `totalStockValue` | Equals Σ(stock balances × product `averageCost`) | |
| 7.2 | UI dashboard card | Rendered value matches API | |

## 8. Movement Form UI (Phase 6)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | New Movement form (type IN) | "Costo unitario"/"Unit Cost" field with placeholder defaulting to product cost | |
| 8.2 | Switch type to Ajuste | "Dirección del ajuste" select appears, default Aumentar (INCREASE) | |

## 9. Movements List UI (Phase 6)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Movements list columns | `unitCost`/`totalCost` currency columns visible with values | |
| 9.2 | Row actions | Reverse (pi-replay, warn) button present per row; no edit/delete affordances | |

## 10. Permissions (9.13)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Valuation menu item visible + page reachable for Admin role | Menu item visible; route guarded opens | |
| 10.2 | API without/invalid api key | 401 Unauthorized (auth layer) | |
| 10.3 | User without `inventory/valuation` model policy → API call | 403 — needs a second user/role without the policy (not yet createable in this env) | |
| 10.4 | User without `inventory/valuation/menu` view | submenu item hidden — document actual behaviour | |

---

---

# Test run findings (execute pass 2026-09-09, backend :8080 / db bifi_app_db, admin user + api-key)

## Bugs found

### INV-V1 — Ledger replay diverges from live WAC after reversals (❌ code bug)

| | |
|---|---|
| **Where** | `bifi_app_be/src/modules/inventory/services/inventory-valuation-service.ts` (replay avg handling on signed movements) vs `stock-movement-service.ts` `reverse()` |
| **Repro** | Isolated product QA-VAL-1: IN 10@50 → IN 10@90 (avg 70) → ADJ-DEC 5 → OUT 5 → transfer 5 → reverse ADJ → reverse IN(@90) → reverse OUT. Live `product.averageCost` = **50**; `AS_OF` report row = **70 / $700** (expected 50 / $500). |
| **Also breaks** | DATE_RANGE invariant: `0 + 2450 − 1600 − 350 = 500` but engine `endingValue` = **700** → invariant violated whenever reversals exist. Products without reversals are correct (143,400 checked). |
| **Root cause** | The replay maintains the average layerically (OUT/reversal legs only decrement quantity, average unchanged), while `reverse()` (per plan 2.9) de-layers `averageCost` when removing an IN (70 → 30 → restore 50). The two bookkeeping models disagree. |
| **Proposed fix (pick one convention)** | Option A — replay as a value ledger: for every signed movement add/subtract the movement's recorded `totalCost`, and `avg = (Σ signed totalCost) / qty` (matches OUT consumes-at-recorded-cost and both reversal directions). Option B: change `reverse()` to consume at current WAC (never de-layer) so replay and service stay in their current models. Option A keeps live values the source of truth and is mathematically consistent with "OUT consumes at current average". |
| **Severity** | High (valuation reports misleading after any IN reversal) |

### INV-V2 — Date-only query params get timezone-shifted by end-of-day normalization (⚠️)

| | |
|---|---|
| **Where** | `inventory-valuation-service.ts` `parseDateOrThrow` + `endOfDay` (server TZ = CST −06:00) |
| **Detail** | `asOfDate=2026-09-09` parses as **UTC midnight**, then `setHours(23,59,59,999)` yields **2026-09-10T05:59:59.999Z**. "Today" queries therefore include movements up to tomorrow 05:59Z, and historical windows shift a full day for date-only inputs. (UI date pickers that send time-qualified ISO values are consistent.) |
| **Proposed fix** | Parse `YYYY-MM-DD` strings as **server-local midnight** (`new Date(y, m, d)`) so end-of-day normalization lands inside the intended calendar day in any timezone. |
| **Severity** | Medium (cutoff windows are surprising; core math unaffected) |

### INV-V3 — Data integrity pre-condition ⚠️ (pre-existing, tracked as Phase 10.3)

Stock balances (`Computer` qty **219**) disagree with the movement ledger replay (`Computer` **109**) — direct `/inventory/stock-balances` POST/PUT/DELETE CRUD (still open) historically bypassed the ledger. This also explains dashboard (balances-based = 298,900) vs valuation report (ledger-based) differences. Restricting balance writes (plan 10.3) plus a reconciliation decision is required before dashboard and AS_OF totals can be expected to match.

## UI verification summary (Playwright, Spanish locale)

- Dashboard card renders **$298,900.00** = API value ✅
- Valuation page: filters, table, Spanish labels, product links, totals ✅ (values reflect INV-V1: replay avg shown)
- Movements list: `Costo unitario` / `totalCost` currency columns populated ✅; Reverse (pi-replay warn) buttons present per row ✅; no edit/delete affordances ✅
- Movement form: "Costo unitario" field (placeholder "Por defecto el costo del producto") for IN ✅; type=Ajuste reveals "Dirección del ajuste" defaulting to "Aumentar" ✅
- Valuation visible for admin (menu + route) ✅; no-key/bad-key API = 401 ✅; policy-level 403 and menu-hidden-without-policy require a second user/role without the policy → ⚠️ pending (P4 in plan)

## Summary

| Verdict | Count |
|---|---|
| ✅ Pass | 24 |
| ⚠️ Partial / blocked | 5 (5.2/5.3 filters work but INV-V1/INV-V2 skew verification; 10.3/10.4 need another user; INV-V3 data note) |
| ❌ Fail | 2 (5.1/6.1 — INV-V1 replay divergence) |

**Bugs created:** INV-V1 (must fix before release — replay consistency), INV-V2 (should fix — date parsing), INV-V3 (already planned as 10.3).

**QA data created:** product `QA Valuation Item` (QA-VAL-1, id 6aa19fb41da47079b925baaf) with movements under reference `QA-*` and location `QA Bay B`.


---

# Re-test after fixes (Phase 9.1 — 2026-09-09, same environment)

## INV-V1 **UPDATED** — ✅ FIXED

- Engine replay converted to **value-ledger accounting** (`ReplayState.valueCost` = Σ signed `movement.totalCost`; `averageCost = valueCost / quantity`), making the replay mathematically identical to `StockMovementService` including reversal de-layer/restore.

| Re-test | Expected | Result |
|---|---|---|
| AS_OF `asOfDate=2026-09-09` (date-only), product QA-VAL-1, `productId` filter | qty 10, unitCost 50, totalValue 500 | ✅ `('QA Valuation Item', 10, 50.0, 500.0)`, total 500 |
| DATE_RANGE today (date-only), same product | beginning 0 + incoming 2450 − outgoing 1600 + adjustments (−350) = ending 500 | ✅ **exact assert passed** (engine: 0 / 2450 / 1600 / −350 / 500) |
| 5.1 / 6.1 re-run | — | ✅ / ✅ (previously ❌) |
| Regression: AS_OF 2026-08-31 (full ledger, no reversals involved) | unchanged from pre-fix run (Computer 89@1500 = 133,500; Massages 99@100 = 9,900; total 143,400) | ✅ identical |

## INV-V2 **UPDATED** — ✅ FIXED

- Date-only strings parse as **server-local midnight** (`new Date(y, m-1, d)`, overflow dates rejected).

| Re-test | Expected | Result |
|---|---|---|
| `asOfDate=2026-09-09` (age-only) window | local full day: 2026-09-09T06:00Z → 2026-09-10T05:59:59.999Z (CST −06) | ✅ |
| DATE_RANGE from/to date-only | from local midnight 2026-09-09T06:00:00.000Z, to local 23:59:59.999 | ✅ (see above, from=06:00Z Sep 9) |

## Subsequent verification notes

- **Location-filtered AS_OF (QA Bay B)**: qty 5, avg **70** — correct pseudo-exception to document: the only movement touching location B is the `transfer-in` leg recorded at cost 70 (transfer transacted when the product average was 70). Product-level totals (the headline numbers) are exact; location-scoped replay preserves the cost recorded on the transfer leg. Under WAC location-scoped values are intentionally approximate.
- **Backfill dry-run after fix**: 0 scans, 0 failures (state already stamped) ✅ (9.1.3)
- Back-end `tsc --noEmit`: zero errors ✅ (9.1.5)

## Updated summary

| Verdict | Count |
|---|---|
| ✅ Pass | 27 (incl. re-tests) |
| ⚠️ Partial/blocked | 4 (location-scoped pricing nuance, 10.3/10.4 permission needs, INV-V3 data note) |
| ❌ Fail | 0 |

**INV-V1 / INV-V2: fixed and re-verified. INV-V3 remains an open data-integrity item tracked as Phase 10.3.**
