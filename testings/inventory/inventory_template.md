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
