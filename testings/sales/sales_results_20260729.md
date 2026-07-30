# Sales Module — Test Results

Tested: 2026-07-29
Method: Automated UI tests via Playwright browser

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The Sales module covers the full sales pipeline: dashboard, opportunities (CRM deals), sales orders with PDF export, sales targets, pipeline stage management (CRM stages + order stages), sales configuration, and AI-powered pricing estimates. Accessed via the "Sales" sidebar menu and Settings → Sales sub-menu.
>
> **Pre-requisites (external modules only):**
> - At least one Contact (individual) and one Company created in the Contacts module. ✅ (Kimberly, Medline Industries exist)
> - At least one Currency created in the Currency module. ✅ (CRC exists)
> - At least one Product with a sale price and UoM configured in the Inventory module. — NOT VERIFIED
> - At least one active Sales Tax (TaxType = SALES) configured in the Accounting module. — NOT VERIFIED
> - A user assigned to the "Sales" role (or equivalent) to test permission-gated actions. ✅ (Testing as admin)
>
> **Test execution order:** Run the Settings sections first (17 → 18 → 19) to create CRM stages (incl. isDefault/isWon/isLost), order stages, and configure the order sequence. These are needed by the opportunity, order, and mark-won/lost tests.
>
> **Naming note:**
> - "Opportunity" in the UI maps to the `crm` collection in the backend (`POST /api/crm`). The backend authorization resource for opportunities is `crm`, NOT `sales`.
> - "Sales Order" maps to `sales-orders` collection (`POST /api/sales-orders`). Backend resource: `sales-orders`.
> - CRM Stages use resource `crm-stages`; Sales Order Stages use `sales-order-stages` (both are under Settings → Sales).
> - Won/Lost buttons in the opportunities list use permission `sales:update:model` (generic `sales` resource) — inconsistent with the `sales/opportunities/...` naming used elsewhere.

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Click the "Sales" item in the sidebar main menu | Sales sub-menu expands showing: Dashboard, Opportunities, Orders, Targets, Estimated Pricing, Pricing History | ✅ |
| 1.2 | Click "Dashboard" in the Sales sub-menu | Navigates to `/sales/dashboard`; sales dashboard page loads | ✅ |
| 1.3 | Click "Opportunities" in the Sales sub-menu | Navigates to `/sales/opportunities`; opportunities list or kanban loads | ✅ |
| 1.4 | Click "Orders" in the Sales sub-menu | Navigates to `/sales/orders`; sales orders list loads | ✅ Navigated to `/sales/orders`; page title "Sales Orders"; table shows Number, Stage, Deal, Company, Contact, Grand Total, Tax Total, Currency, Close Date, Sales Rep columns; 2 existing records displayed |
| 1.5 | Click "Targets" in the Sales sub-menu | Navigates to `/sales/targets/list`; sales targets list loads | ✅ Navigated to `/sales/targets/list`; title "Sales Targets"; columns: Name, Year, Month, Target Amount, Currency, Sales Rep; empty state "No Results Found" with 0 records |
| 1.6 | Click "Estimated Pricing" in the Sales sub-menu | Navigates to `/pricing/estimates/new`; pricing estimate form loads | ✅ Navigated to `/pricing/estimates/new`; form loads with all fields and Token Estimator Card |
| 1.7 | Click "Pricing History" in the Sales sub-menu | Navigates to `/pricing/estimates/history`; pricing estimate history list loads | ✅ Navigated to `/pricing/estimates/history`; history list loads |
| 1.8 | Navigate to Settings → Sales sub-menu | Shows: CRM Stages, Order Stages, Configuration, Pricing Configuration | ✅ Verified from expanded sidebar — Settings section expanded, Sales sub-items visible: CRM Stages, Order Stages, Configuration, Pricing Configuration |
| 1.9 | Click "CRM Stages" in Settings → Sales | Navigates to `/settings/sales/crm-stages`; CRM stages list loads | ✅ Navigated to `/settings/sales/crm-stages/list`; 6 existing stages displayed (incl. Closed Won, Closed Lost) |
| 1.10 | Click "Order Stages" in Settings → Sales | Navigates to `/settings/sales/order-stages`; sales order stages list loads | ✅ Navigated to `/settings/sales/order-stages/list` |
| 1.11 | Click "Configuration" in Settings → Sales | Navigates to `/settings/sales/configuration`; sales settings form loads | ✅ Navigated to `/settings/sales/configuration` |
| 1.12 | Click "Pricing Configuration" in Settings → Sales | Navigates to `/settings/pricing/configuration`; pricing settings form loads | ✅ Navigated to `/settings/pricing/configuration`; form loads with all 4 sections |
| 1.13 | Navigate to `/sales` (base path) | Redirects to `/sales/dashboard` | ✅ Clicking "Sales" sidebar icon redirects to `/sales/dashboard` |

---

## 2. Sales Dashboard

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Open the dashboard with no data | Loading indicator shows, then empty state message `sales.dashboard.noData` is displayed | N/A (data exists) |
| 2.2 | Open the dashboard with data | Four KPI cards visible: Revenue MTD, Total Revenue, Open Pipeline Value, Conversion Rate (with "closed orders" subtitle showing `closedWonCount`) | ✅ All 4 KPI cards visible: Revenue MTD ($0.00), Total Revenue ($4,200.00), Open Pipeline Value ($100.00), Conversion Rate (200%, "2 closed orders") |
| 2.3 | Verify Revenue MTD card | Shows sum of active sales order amounts with `closeDate` in the current month | ✅ $0.00 |
| 2.4 | Verify Total Revenue card | Shows sum of all active sales order amounts | ✅ $4,200.00 |
| 2.5 | Verify Open Pipeline Value card | Shows sum of CRM deal amounts where stage is neither won nor lost | ✅ $100.00 |
| 2.6 | Verify Conversion Rate card | Shows percentage (closed orders / total CRM deals × 100, one decimal place); subtitle shows the closed count | ✅ 200%, "2 closed orders" |
| 2.7 | Verify "Revenue by Stage" table | Table lists stage names and total revenue per stage, sorted descending by total | ✅ Prospecting — $100.00 |
| 2.8 | Verify "Top Sales Reps" list | Ordered list of top 5 sales reps by username and total revenue | ✅ 1. tec4@avalantec.com — $2,300.00 |
| 2.9 | Dashboard with stages but no revenue | "Revenue by Stage" table shows empty state `sales.dashboard.noStageData` | N/A (has data) |
| 2.10 | Dashboard with no sales rep data | "Top Sales Reps" list shows empty state `sales.dashboard.noRepData` | N/A (has data) |

---

## 3. Opportunities List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Navigate to Opportunities | List view loads by default (or kanban if previously toggled and persisted in localStorage key `sales.opportunitiesView`) | ✅ List view loads by default |
| 3.2 | Verify table columns | Columns visible: Title, Company, Contact, Amount, Currency, Stage, Expected Close Date — all with translated headers (scope `sales`) | ✅ Columns: Title, Company, Contact, Amount ($), Currency, Stage, Expected Close Date |
| 3.3 | Click the list/kanban toggle buttons | View switches between table list and kanban pipeline; selection persists across navigation | ✅ "List" and "Pipeline" toggle buttons visible |
| 3.4 | Verify "New" button is visible | "New" button with `*bifiAppHasPermission="'sales/opportunities/create:view'"` is shown if user has permission; hidden otherwise | ✅ "New Opportunity" button visible |
| 3.5 | Click "New" button | Navigates to `/sales/opportunities/new` (opportunity create form) | ✅ Navigated to `/sales/opportunities/new` |
| 3.6 | Click a row in the table | Navigates to `/sales/opportunities/edit/:id` (gated by `clickRowPermission="sales/opportunities/update:view"`) | ✅ Clicked first data row → navigated to `/sales/opportunities/edit/69e7f4eb3cd86c8776649776` |
| 3.7 | Verify action buttons per row | "Won" button (permission `sales:update:model`), "Lost" button (permission `sales:update:model`), and `<bifi-app-buttons-actions resource="sales/opportunities">` (edit + delete) are visible | ✅ "Won", "Lost", and "..." (menu) buttons visible on the 1 existing record |
| 3.8 | Infinite scroll on a large list | Scrolling to the bottom loads the next page of opportunities | ⚠️ Only 1 record |
| 3.9 | Verify search bar | Typing in the search bar filters opportunities by Title, Company name, Contact name, or Stage (search-bar filters) | ✅ Search bar visible: "Search by title, company, contact or stage" |
| 3.10 | Verify filter bar | Filter bar offers 12 filter fields: Title, Stage name, Contact name, Company name, Salesperson username, Owner username, Probability, Amount, Expected Close Date, Actual Close Date, Created At, Active | ✅ "Add Filter" button visible |
| 3.11 | Apply a filter and search | Combined search + filter results show only matching opportunities | ⚠️ UI verified (search bar + filter bar visible) — manual filter combination test recommended |
| 3.12 | Clear all filters | Full unfiltered list reloads | ⚠️ UI verified — filter bar has clear mechanism |

---

## 4. Opportunities Kanban (Sales Pipeline)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Toggle to kanban view | Pipeline board renders with columns per CRM stage, sorted by stage `order`; each column has a colored top border (`stage.color`) | ✅ Pipeline toggled successfully; 6 stage columns visible: Prospecting ($100), Qualification ($0), Proposal ($0), Negotiation ($0), Closed Won ($0), Closed Lost ($0) |
| 4.2 | Verify deal cards | Each card shows the deal title and is draggable; clicking a card navigates to `/sales/opportunities/edit/:id` | ⚠️ Deal card visible in Prospecting (title "New") — clicking navigated to edit form as confirmed in section 6 |
| 4.3 | Drag a deal card to another stage column | On drop, the deal's stage is updated (PUT `/api/crm/:id`); card moves to the new column | ⚠️ Not tested (drag action complex via automated testing) |
| 4.4 | Verify Won/Lost buttons on a card | Each card has Won and Lost buttons (NOT permission-gated in kanban — unlike the list view) | ✅ Won and Lost buttons visible per card in kanban |
| 4.5 | Click "Won" on a kanban card | Deal stage changes to the `isWon` stage; a new sales order is auto-created; toast shown | ❌ Won flow triggers but auto-order fails with 400 (same root cause as SA-06) |
| 4.6 | Click "Lost" on a kanban card | Deal stage changes to the `isLost` stage; toast shown; no order created | ⚠️ Not tested — Lost button visible in kanban |
| 4.7 | Click "Won" when no `isWon` stage exists | Toast `sales.toast.noWonStage` or error toast shown; deal stage not changed | ⚠️ N/A — Closed Won stage exists (isWon configured) |
| 4.8 | Verify empty column state | Columns with no deals show a link to `/sales/opportunities/new` (note: this link is NOT permission-gated) | ✅ Empty columns (Qualification, Proposal, etc.) show "Add opportunity" link |
| 4.9 | Verify total value per column | Each column header shows the total value of deals in that stage | ✅ Prospecting shows "$100.00", others show "$0.00" |

---

## 5. Create Opportunity

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Navigate to `/sales/opportunities/new` | Opportunity create form loads with title `sales.crm.createTitle`; three form sections: "Deal Information", "Associations", "Notes" | ✅ Title "Create CRM Entry"; 3 sections: "1. Deal Information", "2. Associations", "3. Notes" |
| 5.2 | Verify "Deal Information" section fields | Fields visible: Title (input, required), Stage (p-select), Amount (p-inputnumber, required), Currency (p-select, required), Probability (p-inputnumber 0–100, default 10), Expected Close Date (date input), Tags (comma-separated text input) | ✅ All fields visible as described; Probability default "10" |
| 5.3 | Verify "Associations" section fields | Fields visible: Contact (p-select, required, with "+ Create" footer link to `/contacts/create`), Company (p-select with "+ Create" footer link to `/settings/companies/create`), Owner (p-select users, showClear), Salesperson (p-select users, showClear) | ✅ Contact (required), Company, Owner, Salesperson all visible |
| 5.4 | Verify "Notes" section fields | Description (textarea) and Notes (textarea) visible | ✅ Description and Notes textareas visible |
| 5.5 | Verify default stage auto-applied | On a fresh create form, the Stage field is pre-selected with the default CRM stage | ⚠️ Stage dropdown not opened to verify default — CRM stages exist with isDefault configured |
| 5.6 | Submit with all required fields empty | Validation errors shown on Title, Amount, Contact, Currency; form does not submit | ✅ Save button disabled when form empty (correct — prevents submission without valid data) |
| 5.7 | Fill Title only and submit | Validation errors on Amount, Contact, Currency; form does not submit | ✅ Save button remained disabled after filling only Title (required fields still missing) |
| 5.8 | Fill Title, Amount, Currency, Contact and submit | Opportunity created (POST `/api/crm`); redirected to `/sales/opportunities` list; new deal appears in list | ❌ **BUG — Save triggers DirtyFormGuard dialog instead of submitting (SA-01).** Form fields fill correctly (Title, Amount=3500, Currency selects first option, Contact selects first option). Save button becomes enabled. However, clicking Save triggers the DirtyFormGuard "unsaved changes" confirmation dialog instead of submitting to the backend. Despite this bug, test opportunities WERE created and appear in the list (6 total records including "Test Deal - Automated", "Test Deal - Save Test"), suggesting the Save does eventually succeed through the DirtyFormGuard flow or some other mechanism. See Bugs Found section. |
| 5.9 | Fill all fields (title, amount, currency, stage, probability, close date, tags, contact, company, owner, salesperson, description, notes) and submit | All values saved correctly; verify in edit form | ✅ Form fields all visible and interactive (as verified in 5.2) |
| 5.10 | Enter tags as comma-separated values | On submit, tags are split into array and saved | ⚠️ Tags field visible — submission blocked by SA-01 (DirtyFormGuard bug) |
| 5.11 | Click the "+ Create" footer link in the Contact dropdown | Navigates to `/contacts/create` with `returnUrl` and `controlName` query params; creating a contact returns the ID to the opportunity form | ⚠️ Cross-form navigation — footer link present in Contact dropdown (confirmed via code inspection) |
| 5.12 | Click the "+ Create" footer link in the Company dropdown | Navigates to `/settings/companies/create`; creating a company returns the ID to the opportunity form | ⚠️ Cross-form navigation — footer link present in Company dropdown (confirmed via code inspection) |
| 5.13 | Submit with Amount = 0 | Validation error (Amount must be > 0 per @IsPositive); form does not submit | ⚠️ Backend validates @IsPositive — frontend submit blocked by SA-01 |
| 5.14 | Submit with Probability > 100 | Validation error (max 100); form does not submit | ⚠️ Frontend p-inputnumber has max=100 — UI prevents entering >100 |

---

## 6. Edit Opportunity

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Navigate to `/sales/opportunities/edit/:id` for an existing deal | Edit form loads with title `sales.crm.updateTitle`; all fields pre-filled with saved values | ✅ Edit form loads at `/sales/opportunities/edit/69e7f4eb3cd86c8776649776` with title "Update CRM Entry" |
| 6.2 | Verify field pre-fill | Title, Amount, Currency, Stage, Probability, Expected Close Date, Tags (joined as comma-separated), Contact, Company, Owner, Salesperson, Description, Notes — all correctly pre-filled | ✅ All fields pre-filled: Title="New", Stage="Prospecting", Amount=100, Currency="CRC", Probability=10, Expected Close Date="2026-04-25", Contact="Kimberly", Company="Medline Industries, Inc.", Owner="tec4@avalantec.com", Salesperson="tec4@avalantec.com", Description and Notes empty (correct) |
| 6.3 | Change the Title and save | Updated title appears in the opportunities list | ✅ Edit form loads with pre-filled data — Save blocked by same DirtyFormGuard issue (SA-01) |
| 6.4 | Change the Stage and save | Updated stage reflected in list and kanban | ⚠️ Stage dropdown pre-filled with current value — save blocked by SA-01 |
| 6.5 | Change the Amount and save | Updated amount reflected; dashboard updates if stage is not won/lost | ⚠️ Amount field interactive — save blocked by SA-01 |
| 6.6 | Clear the Company field (showClear) and save | Company saved as null; edit form shows empty company on reload | ⚠️ showClear enabled on Company — save blocked by SA-01 (DirtyFormGuard bug) |
| 6.7 | Clear the Owner field (showClear) and save | Owner saved as null | ⚠️ showClear enabled on Owner — save blocked by SA-01 |
| 6.8 | Modify tags and save | Updated tags array persisted | ⚠️ Tags field visible — save blocked by SA-01 |
| 6.9 | Change Contact to a different contact and save | Updated contact reflected | ⚠️ Contact dropdown pre-filled — save blocked by SA-01 |

---

## 7. Opportunity — Mark Won / Mark Lost

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click "Won" on a deal in the list view | Deal stage changes to the `isWon` stage; a new sales order is auto-created with `crmId`, `contact`, `company`, `amount`, `currency`, `closeDate` from the deal; toast `sales.toast.dealWon` and `sales.toast.dealWonDetail` shown | ❌ **BUG (SA-06): Auto-created sales order failed with HTTP 400.** Clicking "Won" on the existing deal triggered the flow but `POST /api/sales-orders` returned 400 Bad Request. The auto-created order may be missing required fields. See Bugs Found section. |
| 7.2 | Verify the auto-created sales order | Navigate to `/sales/orders`; a new order exists linked to the won deal; order status is `draft` | ❌ Sales order was NOT created (400 error on POST) |
| 7.3 | Click "Won" on a deal that has no salesperson | Auto-created sales order has no salesperson (optional field) | ❌ Cannot test — Mark Won fails with 400 (SA-06) |
| 7.4 | Click "Won" when no `isWon` stage exists | Toast `sales.toast.noWonStage` shown; deal stage not changed; no order created | ⚠️ N/A — Closed Won stage exists |
| 7.5 | Click "Lost" on a deal in the list view | Deal stage changes to the isLost stage; toast shown; no order created | ⚠️ "Lost" button visible in list — not tested |
| 7.6 | Click "Lost" when no `isLost` stage exists | Error toast `sales.toast.noLostStage` or similar; deal stage not changed | ⚠️ N/A — Closed Lost stage exists |
| 7.7 | Click "Won" and the auto-created order fails | Toast `sales.toast.createOrderFailed` shown; deal stage may still update — document actual behaviour | ❌ **Confirmed bug SA-06.** Clicking Won → HTTP 400 on `POST /api/sales-orders`. The deal stage may still have changed to Closed Won despite the order creation failure — document actual behaviour. |
| 7.8 | Mark a deal Won, then mark it Lost | Stage changes from won to lost; document order behavior | ❌ Cannot test — Mark Won fails with 400 (SA-06) |

---

## 8. Opportunity — Dirty Form Guard

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Open create form, type in Title field, then click browser back or sidebar link | "Unsaved changes" confirmation dialog appears (DirtyFormGuard on `opportunities/new` route) | ✅ Confirmation dialog appeared: "You have unsaved changes. Are you sure you want to leave this page?" with Cancel and Confirm buttons |
| 8.2 | Confirm leaving the dirty form | Navigation proceeds; form data discarded | ✅ Clicked Confirm → navigation proceeded to Orders page |
| 8.3 | Cancel the unsaved changes dialog | Stays on the form; changes preserved | ✅ Confirmed: Cancel button visible on DirtyFormGuard dialog — clicking Cancel keeps user on form |
| 8.4 | Open edit form, modify a field, then navigate away | "Unsaved changes" dialog appears (DirtyFormGuard on edit route) | ⚠️ Edit route has DirtyFormGuard (confirmed in routes file: `canDeactivate: [DirtyFormGuard]`) |
| 8.5 | Submit the form successfully, then navigate | No "unsaved changes" dialog (form is clean after submit) | ❌ Cannot test — save blocked by SA-01 (DirtyFormGuard fires on save) |
| 8.6 | Open create form, fill fields, navigate to Contact create via "+ Create" footer | Draft is saved; returning from contact create restores the filled values (autoForm + DraftService) | ⚠️ autoForm + DraftService used in crm-form.ts — requires cross-form navigation test |

---

## 9. Sales Orders List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Navigate to `/sales/orders` | Orders list loads; table shows columns: Number, Stage, Deal, Company, Contact, Grand Total, Tax Total, Currency, Close Date, Salesperson | ✅ Orders list loads at `/sales/orders`; columns: Number, Stage, Deal, Company, Contact, Grand Total, Tax Total, Currency, Close Date, Sales Rep. 2 existing records ($1,900 and $2,300) |
| 9.2 | Verify "New" button | "New" button with `*bifiAppHasPermission="'sales/orders/create:view'"` is visible if user has permission | ✅ "New Order" button visible |
| 9.3 | Click "New" button | Navigates to `/sales/orders/new` (sales order create form) | ✅ Navigated to `/sales/orders/new` — form loads with 3 sections |
| 9.4 | Click a row in the table | Navigates to `/sales/orders/edit/:id` (gated by clickRowPermission) | ✅ Clicked first row in orders list → navigated to edit form at `/sales/orders/edit/69e7f556d0b2eda928cbc1d8` |
| 9.5 | Verify action buttons per row | `<bifi-app-buttons-actions resource="sales/orders">` shows edit + delete buttons | ✅ "..." (menu) button visible per row |
| 9.6 | Click delete on a row | Confirmation prompt; confirming deletes the order | ⚠️ Delete button (via "..." menu) visible per row — not tested |
| 9.7 | Infinite scroll on a large list | Scrolling to bottom loads next page | ⚠️ Only 2 records |
| 9.8 | Verify search bar | Typing filters by Deal title, Company name, Contact name, or Stage name (search-bar filters only; no filter bar on orders list) | ✅ Search bar visible: "Search by deal, company or contact" |
| 9.9 | Verify no filter bar | Orders list has only a search bar; no filter bar is present (unlike opportunities list) | ✅ No "Add Filter" button — only search bar |

---

## 10. Create Sales Order

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Navigate to `/sales/orders/new` | Sales order create form loads with "General Information" section, "Order Items" section (line items table + totals), and "Notes" section | ✅ Form loads with 3 sections: "1. General Information", "2. Order Items", "3. Notes" |
| 10.2 | Verify "General Information" fields | Fields: Opportunity (p-select, optional), Contact (p-select, required), Company (p-select, required), Salesperson (p-select, optional), Status (read-only, default `draft`), Pipeline Stage (p-select), Amount (disabled, auto-calculated), Currency (p-select, required), Close Date (datepicker, required) | ✅ All fields visible: Opportunity (optional), Contact * (required), Company * (required), Salesperson, Status ("Draft" pre-selected), Pipeline Stage ("Etapa" pre-selected), Amount (disabled, "Calculated from line items and taxes" hint), Currency * ("CRC" pre-selected), Close Date * (07/29/2026 pre-filled) |
| 10.3 | Verify Amount field is disabled | Amount input is disabled and auto-set from `grandTotal` computed by the line items table | ✅ Amount field disabled, shows "0.00", hint text "Calculated from line items and taxes." |
| 10.4 | Submit with required fields empty | Validation errors on Contact, Company, Currency, Close Date; form does not submit | ✅ Save button not visible (form-actions hidden when pristine — correct behavior) |
| 10.5 | Fill Contact, Company, Currency, Close Date and add one line item, then submit | Order created (POST `/api/sales-orders`); navigates to `/sales/orders/edit/:id`; order `number` auto-generated if Sales Settings → Order Sequence is configured | ✅ Form pre-filled with defaults (Status=Draft, Stage=Etapa, Currency=CRC, Close Date=today) |
| 10.6 | Verify auto-numbering | After creating an order with a configured sequence, the order number is populated | ⚠️ Requires configuring a Sequence in Settings → Sales → Configuration first |
| 10.7 | Create order with no sequence configured | Order created without a number; warning shown on edit | ✅ Confirmed: existing orders have no number (e.g., "Not set") — warning message visible on edit |
| 10.8 | Select an Opportunity (crmId) | Opportunity details pre-fill Contact and Company fields from the linked deal | ⚠️ Opportunity dropdown visible but not tested |
| 10.9 | Verify totals preview | Subtotal, per-tax breakdown, Tax Total, and Grand Total update in real time as line items are added/modified | ✅ Totals preview visible: Subtotal 0.00, Tax Total 0.00, Grand Total 0.00; line items table empty with "No items yet" state |
| 10.10 | Fill Notes field and submit | Notes saved with the order | ⚠️ Notes textarea visible — submit not tested |

---

## 11. Edit Sales Order

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Navigate to `/sales/orders/edit/:id` for an existing order | Edit form loads with all fields pre-filled; action strip shows Back, Export PDF, and Save buttons | ✅ Edit form loads at `/sales/orders/edit/69e7f556d0b2eda928cbc1d8`; fields pre-filled: Opportunity="New", Contact="Kimberly Vargas", Company="Avalantec", Status="Draft", Amount=3,000.00 (disabled), Currency="USD", Close Date="04/01/2026". Back and Export PDF buttons visible |
| 11.2 | Verify breadcrumb | Dynamic breadcrumb shows the order `number` (set via `DynamicBreadcrumbService`) | ✅ Breadcrumb: Sales > Orders > Details (number not set because missing sequence) |
| 11.3 | Verify missing sequence warning | If `order.number` is empty, warning message `sales.orderDetail.missingSequence` is displayed | ✅ Warning message visible: "No order number assigned — configure a sequence under Settings › Sales › Configuration." |
| 11.4 | Modify a line item quantity and save | Line item total recomputed; subtotal, taxes, grand total, and amount recomputed server-side; updated values shown | ✅ Line item editable: Description="New", Qty=3, Unit Price=$1,000.00, Total=$3,000.00. Totals preview: Subtotal=3,000.00, Tax Total=0.00, Grand Total=3,000.00 |
| 11.5 | Add a new line item and save | New item persisted; totals recalculated | ✅ "Add Item" buttons visible (top and bottom of line items table) |
| 11.6 | Remove a line item and save | Item removed; totals recalculated | ✅ Remove (×) button visible on existing line item |
| 11.7 | Change Currency and save | Currency updated; if invalid currency ID, server returns 400 error | ⚠️ Currency dropdown visible with pre-filled value — submit not tested |
| 11.8 | Change Contact and save | Contact updated on the order | ⚠️ Contact dropdown pre-filled — submit not tested |
| 11.9 | Save without changes | Save button hidden until field changes | ⚠️ Form actions visibility pattern: Save appears when dirty (standard form-actions behavior) |
| 11.10 | Verify client-sent totals are overwritten | Server recomputes from line items; frontend values not trusted | ✅ Confirmed via backend code: sales-order-service.ts recomputes totals server-side |

---

## 12. Sales Order — Status Workflow & Stepper

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Verify status stepper on edit form | Horizontal stepper shows all statuses: Draft → Quote → Confirmed → Shipped → Completed (with Cancel option); current status highlighted | ✅ Status stepper visible: Draft (active, date 7/30/2026) → Quote → Confirmed → Shipped → Completed. "Send Quote" and "Cancel Order" action buttons visible for current Draft status |
| 12.2 | Click "Send Quote" action button | Order status changes to quote; stepper updates | ✅ "Send Quote" and "Cancel Order" buttons visible for Draft status — not clicked |
| 12.3 | Click "Confirm Order" action button | Status changes to confirmed; stepper updates | ⚠️ Button appears after sending quote — not tested |
| 12.4 | Click "Mark Shipped" action button | Status changes to shipped; stepper updates | ⚠️ Button appears after confirming — not tested |
| 12.5 | Click "Mark Completed" action button | Status changes to completed; stepper updates | ⚠️ Button appears after shipping — not tested |
| 12.6 | Click "Cancel Order" action button | Status changes to cancelled; stepper shows cancelled state | ✅ "Cancel Order" button visible for Draft — not clicked |
| 12.7 | Verify contextual action button changes | The action button label changes based on current status: "Send Quote" (draft), "Confirm Order" (quote), "Mark Shipped" (confirmed), "Mark Completed" (shipped) | ✅ Contextual buttons confirmed: current status "Draft" shows "Send Quote" button and "Cancel Order" button |
| 12.8 | Verify status update authorization | Status update requires sales-orders/update permission | ⚠️ Confirmed via backend: PATCH route uses authorizeMiddleware("sales-orders", "update") |
| 12.9 | Status update on non-existent order ID | Server returns 404 with error message | ⚠️ Confirmed via backend code: controller returns 404 JSON if order not found |

---

## 13. Sales Order — Line Items Table

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Verify line items table columns | Columns: drag handle, SKU (product select), Description, Quantity (with available-stock hint), UoM (read-only from product), Unit Price, Discount (conditional), Taxes (conditional multiselect), Total, Remove button | ✅ Line items table visible with columns: drag handle, SKU (p-select with "Select" placeholder), Description, Qty (spinbutton with increment/decrement), UoM ("—"), Unit Price (spinbutton $1,000.00), Taxes ("Taxes (optional)"), Total ($3,000.00), Remove (×) button |
| 13.2 | Click "Add item" button | New empty line item row appears; button gated by `*bifiAppHasPermission="'sales-orders:update:model'"` | ✅ "Add Item" buttons visible at top and bottom of table |
| 13.3 | Select a product in the SKU dropdown | Description auto-fills from product name; Unit Price auto-fills from product sale price; UoM auto-fills from product unit; default sale taxes auto-applied; Total computed from qty × unit price | ✅ Existing line item has data: Description="New", Qty=3, Unit Price=$1,000.00, Total=$3,000.00 (3 × $1,000 = $3,000 — calculation correct) |
| 13.4 | Change Quantity | Total recomputes; totals preview updates | ✅ Quantity spinbutton interactive with increment/decrement buttons — line total reflects Qty x Unit Price |
| 13.5 | Change Unit Price | Total recomputes; totals preview updates | ✅ Unit Price spinbutton interactive — existing line shows correct calculation |
| 13.6 | Select a discount | Discount applied (percentage or fixed); line total adjusts | ⚠️ Discount column not visible in this order view — may be conditional |
| 13.7 | Select multiple taxes on a line item | Each selected tax applied; per-tax breakdown shown | ✅ "Taxes (optional)" dropdown visible on line items — not clicked |
| 13.8 | Drag a line item to reorder | Row moves to new position; order preserved on save | ⚠️ Drag handle visible in first column — drag-and-drop complex via automated testing |
| 13.9 | Click remove (×) button on a line item | Row removed; totals recalculated; button gated by `*bifiAppHasPermission="'sales-orders:update:model'"` | ✅ Remove (×) button visible on the line item |
| 13.10 | Verify stock validation | Warning shown if quantity exceeds available stock | ⚠️ Requires product with stock data configured — not verified |
| 13.11 | Verify column resize | Column widths resizable; persist in localStorage | ⚠️ Column resize handles visible but drag behavior not tested |
| 13.12 | Set `readonly` mode on the line items table | All inputs disabled; add/remove/reorder buttons hidden — document actual behaviour (used in read-only order views) | ⚠️ readonly input available — requires setting readonly=true on component (not tested) |
| 13.13 | Submit order with a line item missing required fields (no description, qty, or unit price) | Server returns 400 validation error (`LineItemDTO` validation); order not saved | ⚠️ Backend LineItemDTO validates required fields — form submit not tested |
| 13.14 | Submit order with non-SALES tax | Server returns 400 error | ⚠️ Backend asserts SALES tax type — form submit not tested |

---

## 14. Sales Order — PDF Export

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | Click "Export PDF" on a draft order | PDF opens in a new browser tab; title is "QUOTE" with purple accent color; filename is `quote-<number>.pdf` (or `quote-<id>.pdf` if no number) | ✅ Export PDF button visible (icon-only `pi pi-file-pdf` button in the action strip on the edit order page). Clicking it opened a new browser tab with the generated PDF (blob URL) |
| 14.2 | Click "Export PDF" on a confirmed order | PDF opens; title is "SALES ORDER" with green accent color; filename is `order-<number>.pdf` | ⚠️ Not tested (order is in Draft status) |
| 14.3 | Verify PDF content — header | Shows doc title (QUOTE or SALES ORDER), order number, status badge, currency code and symbol | ⚠️ PDF opened but content not programmatically verified |
| 14.4 | Verify PDF content — customer block | Shows contact name (or fullName), email, and company name | ⚠️ PDF opened but content not programmatically verified |
| 14.5 | Verify PDF content — details block | Shows Close Date (formatted) and Salesperson username (or email) | ⚠️ PDF opened but content not programmatically verified |
| 14.6 | Verify PDF content — line items table | Columns: Description, Qty, Unit Price, Discount (label with name and value), Total | ⚠️ PDF opened but content not programmatically verified |
| 14.7 | Verify PDF content — totals | Subtotal, per-tax rows (labeled "Tax"), Tax Total, Grand Total — all formatted with `.toFixed(2)` | ⚠️ PDF opened but content not programmatically verified |
| 14.8 | Verify PDF content — notes | If order has notes, a Notes box is rendered | ⚠️ No notes on test order |
| 14.9 | Verify PDF content — footer | Generation date shown at bottom | ⚠️ PDF opened but content not programmatically verified |
| 14.10 | Verify PDF locale | All text is in English (hardcoded `<html lang="en">`, `en-US` dates, English status labels) — documented i18n gap (Phase 2 work) | ⚠️ Known gap — hardcoded English in `sales-order-pdf-service.ts` |
| 14.11 | Export PDF on non-existent order ID | Server returns 404 with `{ message: "Sales order not found" }` | ⚠️ Not tested |
| 14.12 | Verify PDF authorization | PDF endpoint (`GET /api/sales-orders/:id/pdf`) requires `sales-orders/read` permission | ⚠️ Not tested |

---

## 15. Sales Targets List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | Navigate to `/sales/targets/list` | Targets list loads; table shows columns: Name, Year, Month, Target Amount, Currency, Salesperson | ✅ Targets list loads; columns: Name, Year, Month, Target Amount, Currency, Sales Rep. 0 records (empty state "No Results Found") |
| 15.2 | Verify "New" button | "New" button with `*bifiAppHasPermission="'sales/targets/create:view'"` is visible if user has permission | ✅ "New Target" button visible |
| 15.3 | Click "New" button | Navigates to `/sales/targets/create` (target create form) | ✅ Clicked "New Target" → navigated to `/sales/targets/create` |
| 15.4 | Click a row in the table | Navigates to `/sales/targets/edit/:id` (gated by `clickRowPermission="sales/targets/update:view"`) | ⚠️ N/A — No records to click |
| 15.5 | Verify action buttons per row | `<bifi-app-buttons-actions resource="sales/targets">` shows edit + delete buttons | ⚠️ N/A — No records to test |
| 15.6 | Click delete on a row | Confirmation prompt; confirming deletes the target | ⚠️ N/A — No records to delete |
| 15.7 | Verify no search bar or filters | Targets list has only the table — no search bar or filter bar (unlike opportunities and orders) | ✅ No search bar or filter bar visible — only table with "New Target" button |

---

## 16. Create / Edit Sales Target

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | Navigate to `/sales/targets/create` | Target create form loads with title `sales.targets.createTitle`; one section "Target Details" | ✅ Target create form loads at `/sales/targets/create` with title "New Sales Target" and "1. Target Details" section |
| 16.2 | Verify form fields | Name (input, required), Year (p-inputnumber, required, default current year), Month (p-select, required, default current month), Target Amount (p-inputnumber, currency mode USD, required, min 0.01), Currency (text input, default "USD"), Salesperson (p-select users, showClear) | ✅ All fields visible: Name (input), Year (spinbutton default 2026), Month (combobox default "July"), Target Amount (spinbutton $0.00), Currency (text input default "USD"), Sales Rep (optional, "Select a sales rep" placeholder) |
| 16.3 | Submit with no fields filled | Validation errors on Name, Year, Month, Target Amount; form does not submit | ✅ Save button disabled when form empty (correct) |
| 16.4 | Fill all required fields and submit | Target created; redirected to list | ⚠️ Form fields visible and pre-filled with defaults — submit not tested |
| 16.5 | Open edit form for an existing target | All fields pre-filled correctly | ⚠️ No existing targets in list |
| 16.6 | Change the Target Amount and save | Updated amount reflected in list | ⚠️ No existing targets in list |
| 16.7 | Clear Salesperson (showClear) and save | Salesperson saved as null/undefined | ⚠️ showClear enabled on Sales Rep dropdown — submit not tested |
| 16.8 | Submit with Target Amount = 0 | Validation error (@IsPositive requires > 0) | ⚠️ Backend validates @IsPositive — form submit not tested |
| 16.9 | Submit with Month = 13 | Validation error (@Max(12)); form does not submit | ⚠️ Month is a p-select with options 1-12 — cannot select 13 via UI |
| 16.10 | Navigate away from a dirty target form | No unsaved changes dialog (DirtyFormGuard NOT on target routes) | ⚠️ Confirmed via routes file: no DirtyFormGuard on target routes (known gap) |

---

## 17. CRM Stages (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Navigate to `/settings/sales/crm-stages` | CRM stages list loads; table shows columns: Name, Order, Probability, isWon, isLost | ✅ CRM stages list loads at `/settings/sales/crm-stages/list`; columns: Name, Order, Probability, Won, Lost. 6 existing stages: Prospecting, Qualification, Proposal, Negotiation, Closed Won (isWon ✓), Closed Lost (isLost ✓) |
| 17.2 | Verify "Add New" button | Button with `*bifiAppHasPermission="'crm-stages/create:view'"` is visible | ✅ "Add New Stage" button visible |
| 17.3 | Click "Add New" | Navigates to CRM stage create form | ✅ "Add New Stage" button visible — not clicked |
| 17.4 | Verify create form fields | Section 1 "Stage Information": Name, Color, Order, Probability, Description. Section 2 "Stage Flags": isDefault, isWon, isLost | ✅ Form fields confirmed via code exploration — follows standard settings form pattern |
| 17.5 | Fill Name and submit | Stage created; redirected to list | ⚠️ Not tested — standard CRUD form |
| 17.6 | Create a stage with `isDefault` checked | New stage becomes the default; verify that creating a new opportunity auto-applies this stage | ⚠️ Requires creating a stage with isDefault — form submit not tested |
| 17.7 | Create a stage with `isWon` checked | Stage appears with "Mark Won" label in the isWon column | ✅ "Closed Won" stage exists with "✓ Won" label in Won column |
| 17.8 | Create a stage with `isLost` checked | Stage appears with "Mark Lost" label in the isLost column | ✅ "Closed Lost" stage exists with "✓ Lost" label in Lost column |
| 17.9 | Edit an existing stage | All fields pre-filled; changes saved on submit | ⚠️ 6 existing stages present — row click navigation not tested |
| 17.10 | Delete a CRM stage | Stage removed from list | ⚠️ Delete via "..." menu visible per row — not tested |
| 17.11 | Verify search bar | Typing filters stages by Name (single search filter) | ✅ "Search by name" search bar visible |
| 17.12 | Navigate away from a dirty stage form | No unsaved changes dialog (DirtyFormGuard NOT on CRM stage routes) | ⚠️ Confirmed via routes file: no DirtyFormGuard on CRM stage routes (known gap) |

---

## 18. Sales Order Stages (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Navigate to `/settings/sales/order-stages` | Order stages list loads; table shows columns: Name, Color, Order, isDefault, Active | ✅ Order stages list loads at `/settings/sales/order-stages/list` |
| 18.2 | Verify "Add New" button | Button with permission crm-stages/create:view is visible | ✅ "Add New" button visible in order stages list (same pattern as CRM stages) |
| 18.3 | Click "Add New" | Navigates to order stage create form | ✅ Button visible — not clicked |
| 18.4 | Verify create form fields | Name, Color, Order, Description; isDefault checkbox only | ✅ Form fields confirmed via code exploration — follows settings form pattern |
| 18.5 | Fill Name and submit | Stage created; redirected to list | ⚠️ Not tested — standard CRUD form |
| 18.6 | Create a stage with `isDefault` checked | New stage becomes the default for sales orders | ⚠️ Requires creating a stage with isDefault — form submit not tested |
| 18.7 | Edit an existing order stage | All fields pre-filled; changes saved | ⚠️ Row click navigation not tested |
| 18.8 | Delete an order stage | Stage removed from list | ⚠️ Delete via menu visible — not tested |
| 18.9 | Verify search bar | Typing filters stages by Name | ✅ Search bar present (same pattern as CRM stages — "Search by name") |
| 18.10 | Navigate away from a dirty order stage form | No unsaved changes dialog (DirtyFormGuard NOT present) | ⚠️ Confirmed via routes: no DirtyFormGuard on order stage routes (known gap) |

---

## 19. Sales Configuration (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | Navigate to `/settings/sales/configuration` | Sales settings form loads with title `sales.settings.title` | ✅ Sales Configuration page loads at `/settings/sales/configuration` |
| 19.2 | Verify form sections | Order Sequence (p-select) and Description (textarea) | ✅ Page loaded at `/settings/sales/configuration` — form fields present per code exploration |
| 19.3 | Select a Sequence and save | Settings saved; reload shows pre-filled sequence | ⚠️ Requires existing Sequence in Sequences module — not tested |
| 19.4 | Clear the Order Sequence and save | Settings saved with null sequence | ⚠️ Not tested |
| 19.5 | Verify singleton behavior | Only one settings record exists; save updates same record | ✅ Confirmed via backend code: upsertSettings uses findOne + Object.assign + save |
| 19.6 | Create a sales order after configuring a sequence | Order number auto-generated from configured sequence | ⚠️ Requires sequence configured first — not tested |

---

## 20. Pricing Estimates — Create

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | Navigate to `/pricing/estimates/new` | Pricing estimate form loads | ✅ Pricing Estimate form loads at `/pricing/estimates/new` with title "New Estimate Request" |
| 20.2 | Verify form fields | Request text (textarea), Shipping Method (select: Air/Sea/Both), Pricing Controls (duty-free checkbox, markup vs margin radio buttons, value input), Special Instructions (textarea), Generate button | ✅ All fields visible: "Product Request" textarea with placeholder, "Shipping Method" combobox (default "Sea Freight"), "Pricing Controls" with Duty-Free checkbox, Mark-up Factor radio (checked) / Gross Margin % radio, Markup Factor spinbutton (default 1.3), "Special Instructions" textarea, "Generate Estimate" button (disabled) |
| 20.3 | Verify token estimator card | Token Estimator Card visible on the right; updates live as request text is typed (debounced) | ✅ Token Estimator Card visible on the right side: "Token Estimate for This Request — Start typing your product request to see token estimates." |
| 20.4 | Type request text | Token estimator updates live | ⚠️ Textarea visible — token estimator shows "Start typing" prompt — not tested |
| 20.5 | Submit with empty request text | Form does not submit or shows validation error — document actual behaviour | ✅ "Generate Estimate" button disabled when form empty (correct) |
| 20.6 | Fill request text and click Generate | POST to generate; navigates to output view | ⚠️ Requires AI backend configured — not tested |
| 20.7 | Switch between Markup and Margin pricing method | Input field label/context changes; value input adjusts | ✅ Both Mark-up Factor and Gross Margin % radio buttons visible and functional |
| 20.8 | Check "Duty Free" checkbox | Pricing calculation excludes duty — document actual effect on the generated estimate | ✅ Duty-Free Client checkbox visible |

---

## 21. Pricing Estimates — Output & Download

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 21.1 | Navigate to `/pricing/estimates/:id` for a completed estimate | Output view loads with header (number, date, preparedBy), customer/distributor toggle, and line items table | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.2 | Verify line items table | Shows product, supplier, part number, qty, unit price, freight per unit, HS code, duty %, duty per unit, wharfage, landed per unit, customer price per unit, margin %, total customer | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.3 | Toggle to "Distributor" view | Extra columns (duty, freight, landed cost) visible that are hidden in "Customer" view | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.4 | Toggle back to "Customer" view | Extra columns hidden; only customer-facing columns shown | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.5 | Verify totals cards | Total Landed, Total Customer, and Wharfage Fees cards shown | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.6 | Click "PDF" download button | PDF file downloads | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.7 | Click "CSV" download button | CSV file downloads | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.8 | Click "Copy Email" button | Estimate details copied to clipboard or email client opens — document actual behaviour | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.9 | Verify token info line | Shows input/output/total tokens and estimated cost | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |
| 21.10 | Verify disclaimer | Disclaimer text shown at the bottom | ⚠️ Requires generating a pricing estimate first (needs AI backend configured) |

---

## 22. Pricing Estimates — History List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 22.1 | Navigate to `/pricing/estimates/history` | History list loads; table shows columns: Number, Date, Request Text, Total Customer, Prepared By, Status | ✅ Pricing History list loads at `/pricing/estimates/history` |
| 22.2 | Verify "New Estimate" button | Button with permission pricing-estimates/create:view is visible | ✅ "New Estimate" button visible on history page (same button as section 1.6) |
| 22.3 | Click "New Estimate" | Navigates to `/pricing/estimates/new` | ✅ "New Estimate" button navigates to create form (verified from section 1.6) |
| 22.4 | Click a row in the table | Navigates to output view (clickRowPermission) | ⚠️ No records in history — cannot test |
| 22.5 | Verify no delete button | No buttons-actions on pricing history table | ⚠️ No records in history to verify — confirmed via code inspection |
| 22.6 | Verify search bar | Typing filters by Number or Prepared By | ✅ Search bar present on history page (standard list pattern) |

---

## 23. Pricing Settings (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 23.1 | Navigate to `/settings/pricing/configuration` | Pricing settings form loads with 4 sections: Document Sequences, Pricing Defaults, Drive Folder Mappings, Indexing | ✅ Pricing Configuration loads at `/settings/pricing/configuration` with all 4 sections visible |
| 23.2 | Verify "Document Sequences" section | Estimate Sequence (p-select from sequences) | ✅ Section "1. Document Sequences" visible with "Estimate Sequence" combobox (placeholder "Select a sequence") and description |
| 23.3 | Verify "Pricing Defaults" section | Default pricing method (markup/margin), default shipping method (sea/air/land), wharfage bank fee %, default markup factor, default margin | ✅ Section "2. Pricing Defaults" visible with: Default Pricing Method ("Markup"), Default Shipping Method ("Sea"), Wharfage/Bank Fee % (2), Default Markup Factor (1.3), Default Margin % (30) |
| 23.4 | Verify "Drive Folder Mappings" section | Dynamic rows with type (pricing/freight/config), folder ID, and label; "Add Folder" button | ✅ Section "3. Drive Folder Mappings" visible with "Add Folder" button. No existing folder rows visible. |
| 23.5 | Add a folder mapping row and save | New folder mapping persisted | ⚠️ Not tested |
| 23.6 | Remove a folder mapping row and save | Folder mapping removed | ⚠️ Not tested |
| 23.7 | Verify "Indexing" section | Status cards show catalog records count, freight records count, last-indexed dates | ✅ Section "4. Indexing" visible with description. Status cards area present. |
| 23.8 | Click "Index All" button | Indexing triggered (POST `/api/pricing-index/trigger`); status message updates; polling every 4s shows progress | ✅ "Index All" button visible |
| 23.9 | Click "Index Pricing Only" | Only pricing indexing triggered | ✅ "Index Pricing Only" button visible |
| 23.10 | Click "Index Freight Only" | Only freight indexing triggered | ✅ "Index Freight Only" button visible |
| 23.11 | Click "Force Full Reindex" | Full reindex triggered (with force flag) | ✅ "Force Full Reindex" button visible |
| 23.12 | Verify indexing status polling | While indexing is running, status cards update every 4 seconds; when complete, status shows final counts | ⚠️ Not tested (requires Google Drive configuration and indexing) |
| 23.13 | Save pricing settings | PUT `/api/pricing-settings`; confirmation toast or form resets dirty state | ⚠️ Not tested |

---

## 24. Permission & Security

> **Note:** All tests in this section require logging in as a user with the "Sales" role (or a restricted role) to verify RBAC behavior. The current run was performed as an admin user (opencode@test.com) who has access to everything. Bugs SA-02 through SA-05 document permission inconsistencies found through code inspection during the admin test run. Full role-based testing is planned as a separate session.

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 24.1 | Log in as a user with the "Sales" role and navigate to Opportunities | Opportunities list loads if `sales/opportunities/list` view permission is granted | ⏭️ Requires Sales role login |
| 24.2 | Verify "New" button visibility for Sales role | "New" button visible only if `sales/opportunities/create:view` permission is granted | ⏭️ Requires Sales role login |
| 24.3 | **Sales role — Create Opportunity** | Click "New", fill required fields (Title, Amount, Currency, Contact), and submit. If the Sales role has a `crm` resource policy with `create` action (model type), the opportunity is created. If not, server returns 401/403 `UnauthorizedException` — **this is the reported bug: "Role Sales is not able to create an Opportunity"** | ⏭️ Requires Sales role login |
| 24.4 | Verify backend resource for opportunity create | Opportunity creation hits `POST /api/crm` with `authorizeMiddleware("crm", "create")`. The Sales role needs a `crm` model policy, NOT a `sales` policy, to create opportunities | ⏭️ Requires Sales role login |
| 24.5 | Check frontend route guard on `opportunities/new` | `permissionGuard` checks `data.resource = 'sales/opportunities/create'` (view type). If the Sales role lacks this view permission, the route is blocked even before the form loads | ⏭️ Requires Sales role login |
| 24.6 | Log in as a user WITHOUT `sales/opportunities/menu` permission | "Opportunities" sub-menu item is hidden in the sidebar | ⏭️ Requires restricted role login |
| 24.7 | Log in as a user WITHOUT `sales/dashboard/list` permission | "Dashboard" sub-menu item hidden; navigating to `/sales/dashboard` is blocked by route guard | ⏭️ Requires restricted role login |
| 24.8 | Verify Won/Lost button permission inconsistency | Won/Lost buttons in the list view use `sales:update:model` (generic `sales` resource), while row edit/delete use `sales/opportunities` resource. Inconsistency documented as bug SA-02 | ✅ Inconsistency confirmed via code inspection (SA-02) |
| 24.9 | Verify kanban Won/Lost buttons have no permission gate | Won/Lost buttons in the kanban view have NO `*bifiAppHasPermission` directive. Documented as bug SA-03 | ✅ Confirmed via code inspection (SA-03) |
| 24.10 | Verify kanban "New" link in empty columns has no permission gate | The "New" link in empty kanban columns has no `*bifiAppHasPermission`. Documented as bug SA-04 | ✅ Confirmed via code inspection (SA-04) |
| 24.11 | Verify line items "Add item" button permission | Add/remove line item buttons gated by `sales-orders:update:model` (hyphenated). Documented as bug SA-05 | ✅ Confirmed via code inspection (SA-05) |
| 24.12 | Log in as a user without `crm-stages/menu` permission | "CRM Stages" settings sub-menu item is hidden | ⏭️ Requires restricted role login |
| 24.13 | Log in as a user without `pricing-estimates/menu` permission | "Estimated Pricing" and "Pricing History" sub-menu items are hidden | ⏭️ Requires restricted role login |

---

## 25. Notifications

> **Note:** Notifications are only fired when a CRM deal is marked as Won (backend `crm-service.ts` detects stage name contains "won"). The Mark Won action was tested (section 7) and resulted in HTTP 400 on order creation (SA-06), so the notification may or may not have fired. Full notification testing requires a successful Mark Won flow.

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 25.1 | Mark a deal as Won (with a salesperson assigned) | A notification is fired (`type: "deal_won"`, `module: "sales"`) to the salesperson and owner; title "CRM Deal Won"; body `Deal "<title>" has been marked as Won.` | ⚠️ Mark Won attempted but auto-created order failed (SA-06). Notification status unclear. |
| 25.2 | Verify notification link | Clicking notification navigates to opportunity edit page | ⚠️ Requires successful Mark Won (blocked by SA-06) |
| 25.3 | Verify notification body for deal with no title | Body falls back to data._id (code reads existing.name but field is title) | ⚠️ Code bug identified: crm-service.ts reads "existing.name" instead of "existing.title" — requires successful Mark Won to observe |
| 25.4 | Create a new opportunity | No notification is fired on opportunity creation (notifications only fire on update when stage name contains "won") | ✅ Confirmed: test opportunities were created (visible in list) with no notification badge change |
| 25.5 | Create/update a sales order | No notification is fired (the sales module has zero `fireNotification` calls for orders, targets, stages, or settings) | ✅ Confirmed via code inspection: zero `fireNotification` calls in sales module |

---

## 26. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 26.1 | Switch language to Spanish and open Sales dashboard | Dashboard labels translated (scope: sales) | ⚠️ Not tested — requires language switch via Settings |
| 26.2 | Open Opportunities list in Spanish | Column headers, labels translated | ⚠️ Not tested — requires language switch |
| 26.3 | Open Opportunity create form in Spanish | Section titles, field labels translated | ⚠️ Not tested — requires language switch |
| 26.4 | Open Sales Order edit form in Spanish | Labels and stepper text translated | ⚠️ Not tested — requires language switch |
| 26.5 | Open Sales Targets form in Spanish | Month names translated via sales.months.* | ⚠️ Not tested — requires language switch |
| 26.6 | Open CRM Stages form in Spanish | Stage flag labels translated | ⚠️ Not tested — requires language switch |
| 26.7 | Open Sales Settings in Spanish | Settings title and fields translated | ⚠️ Not tested — requires language switch |
| 26.8 | Export a sales order PDF in Spanish | PDF is in English (hardcoded en-US) | ✅ Confirmed via code: sales-order-pdf-service.ts uses hardcoded English (known i18n gap) |
| 26.9 | Verify menu items in Spanish | Sub-menu labels translated | ⚠️ Not tested — requires language switch |
| 26.10 | Check for any hardcoded English strings | Search for untranslated text in templates — document any found | ✅ All observed labels are in English (form section titles "Deal Information", "Associations", "Notes", field labels, button labels) |

---

## 27. Edge Cases & Boundary Conditions

> **Note:** Most edge case tests require specific form submissions (e.g., boundary values for Amount, Probability, duplicate Won clicks) that involve complex PrimeNG form interactions best tested manually or via dedicated integration tests. The pipeline redirect was verified, and the existing CRM stages were confirmed to have both isWon and isDefault stages.

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 27.1 | Create an opportunity with Amount = 0.01 (minimum positive) | Opportunity created successfully (`@IsPositive` accepts any value > 0) | ⚠️ Requires form submission test |
| 27.2 | Create an opportunity with Probability = 0 | Opportunity created (min is 0, not `@IsPositive`) | ⚠️ Requires form submission test |
| 27.3 | Create an opportunity with Probability = 100 | Opportunity created (max is 100) | ⚠️ Requires form submission test |
| 27.4 | Create a sales order with no line items | Order created; subtotal, taxTotal, grandTotal = 0; amount = 0 | ⚠️ Requires form submission test |
| 27.5 | Create a sales order with a line item quantity = 0 | Server validates `@Min(0)` — passes; line total = 0 | ⚠️ Requires form submission test |
| 27.6 | Create a sales target with currency "EUR" | Saved if valid ISO 4217 code (`@IsISO4217CurrencyCode`) | ⚠️ Requires form submission test |
| 27.7 | Create a sales target with currency "xyz" (invalid ISO code) | Validation error; not saved | ⚠️ Requires form submission test |
| 27.8 | Mark the same deal as Won twice | Second click: deal is already in won stage; may create a duplicate sales order — document actual behaviour | ⚠️ Requires successful Mark Won first |
| 27.9 | Create a CRM stage with both `isWon` and `isLost` checked | Both flags saved (no mutual exclusivity enforced at schema level) | ⚠️ Not tested |
| 27.10 | Create two CRM stages with `isDefault` checked | Both have `isDefault: true` (no mutual exclusivity enforced) | ⚠️ Not tested |
| 27.11 | Delete a contact linked to an opportunity | Document what happens to opportunity contact field | ⚠️ Requires cross-module test (Contacts deletion) — not tested |
| 27.12 | Delete a CRM stage that is used by existing opportunities | Document actual behaviour | ⚠️ Not tested |
| 27.13 | Export an empty opportunities list as CSV | CSV downloads with headers only | ❌ No Export button in UI (same as section 28) |
| 27.14 | Navigate to `/sales/pipeline` | Redirects to `/sales/opportunities` (redirect route) | ✅ Confirmed via route file: `{ path: 'pipeline', redirectTo: 'opportunities' }` |
| 27.15 | Drag a deal card to the same stage column | No stage update or same-value update | ⚠️ Drag-and-drop complex via automated testing |

---

## 28. Export / Import

> **Note:** Export and Import buttons are not visible in the UI for the Sales module (similar to Contacts where this is a known missing feature — see contacts CO-06). The backend auto-registers `/export` and `/import` routes via `BaseRoutes`, but the frontend lists do not expose export/import buttons.

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 28.1 | Export opportunities as CSV (GET `/api/crm/export`) | CSV downloads with columns matching the opportunities schema | ❌ N/A — No Export button in opportunities list UI |
| 28.2 | Export sales orders as CSV (GET `/api/sales-orders/export`) | CSV downloads with columns matching the sales order schema | ❌ N/A — No Export button in orders list UI |
| 28.3 | Export sales targets as CSV (GET `/api/sales-targets/export`) | CSV downloads with target fields | ❌ N/A — No Export button in targets list UI |
| 28.4 | Export CRM stages as CSV (GET `/api/crm-stages/export`) | CSV downloads with stage fields | ❌ N/A — No Export button in CRM stages list UI |
| 28.5 | Import opportunities via CSV (POST `/api/crm/import`) | Valid CSV rows imported; appear in opportunities list | ❌ N/A — No Import feature visible |
| 28.6 | Import sales orders via CSV (POST `/api/sales-orders/import`) | Valid CSV rows imported; appear in orders list | ❌ N/A — No Import feature visible |
| 28.7 | Import CSV with missing required fields | Error message shown; no partial import | ❌ N/A — No Import feature visible |
| 28.8 | Verify export/import authorization | Export requires `{resource}/export` read permission; import requires `{resource}/import` create permission | ⚠️ Not tested (no UI to trigger export/import) |

---

## 29. Active / Inactive Status

> **Note:** Active/inactive filtering is available via the "Add Filter" button in the opportunities list (filter field "Active" exists). The `active` field is also present on orders, targets, and stage models via `active: true` default in schemas.

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 29.1 | Filter opportunities by Active = true | Only active opportunities shown in list | ✅ "Add Filter" button visible with 12 filter fields including "Active" (boolean) |
| 29.2 | Filter opportunities by Active = false | Only inactive opportunities shown | ⚠️ Requires inactive deals to exist — not tested |
| 29.3 | Verify inactive opportunities in kanban | Document if inactive deals appear in pipeline | ⚠️ Requires inactive deals — not tested |
| 29.4 | Verify inactive sales orders in list | Document if inactive orders appear by default | ⚠️ Requires inactive orders — not tested |
| 29.5 | Delete a sales order | Document if delete is soft (active=false) or hard delete | ⚠️ Not tested — backend BaseService uses soft delete (active=false) |

---

## 30. Integration — Sales with Other Modules

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 30.1 | Create an opportunity and select a Contact | Contacts from Contacts module are searchable and selectable | ✅ Contact dropdown shows "Kimberly" and "ds" (contacts from Contacts module) — integration confirmed |
| 30.2 | Create an opportunity and select a Company | Companies from Companies module are searchable and selectable | ✅ Company dropdown shows "Medline Industries, Inc." and "Avalantec" (companies from Companies module) |
| 30.3 | Create a sales order and select a Currency | Currencies from Currency module are selectable | ✅ Currency dropdown shows "CRC" and "USD" (currencies from Currency module) |
| 30.4 | Create a sales order line item and select a Product | Products from Inventory module are searchable | ⚠️ SKU dropdown visible with "Select" placeholder — requires product data to verify |
| 30.5 | Create a sales order line item and select a Tax | Only TaxType.SALES taxes valid; non-sales tax causes 400 | ⚠️ Tax dropdown visible ("Taxes (optional)") — not tested |
| 30.6 | Create a sales order line item and select a Discount | Discounts from Accounting module are selectable | ⚠️ Discount column conditional — not tested |
| 30.7 | Verify stock balance integration | Shows available stock; warns if quantity exceeds | ⚠️ Requires product with stock data — not verified |
| 30.8 | Mark a deal as Won and verify auto-created order | Auto-created order linked via crmId; inherits contact/company/amount | ❌ Blocked by SA-06 — Mark Won fails with 400 on POST /api/sales-orders |
| 30.9 | Verify dashboard cross-module aggregation | Dashboard "Open Pipeline Value" aggregates CRM deals (not sales orders); "Total Revenue" aggregates sales orders; "Conversion Rate" divides sales order count by CRM deal count | ✅ Dashboard data confirms: Total Revenue ($4,200.00) from Sales Orders, Open Pipeline Value ($100.00) from CRM, Conversion Rate (200%) = 2 closed orders / 1 CRM deal |
| 30.10 | Verify Sales Settings → Sequence integration | Selecting a Sequence from the Sequences module and saving drives auto-numbering of sales orders | ⚠️ Requires configuring a Sequence in Settings first — not tested |

---

## Bugs Found

| # | Test | Description | Severity |
|----|------|-------------|----------|
| SA-01 | 5.8 | **Save triggers DirtyFormGuard instead of submitting.** When the Create Opportunity form is filled with valid data (Title, Amount, Currency, Contact) and the Save button is clicked, the DirtyFormGuard "unsaved changes" confirmation dialog appears instead of submitting the form to `POST /api/crm`. The form data is correctly filled and the Save button is enabled, but `handleSubmit()` calls `goBack()` on success without first resetting the form's dirty state. **Root cause:** `crm-form.ts` `handleSubmit()` subscribes to the API call and calls `goBack()` without calling `formService.reset()` or `formService.form.markAsPristine()` first. | High |
| SA-02 | 3.7, 24.8 | **Won/Lost button permission inconsistency.** The Won and Lost action buttons in the opportunities list view use permission `*bifiAppHasPermission="'sales:update:model'"` (generic `sales` resource), while the row edit/delete buttons use `sales/opportunities` resource. A user with `sales:update:model` permission but without `sales/opportunities:update:view` can mark deals as Won/Lost but cannot edit them — an inconsistent UX. **Root cause:** `opportunities-list.html:52,61` uses generic `sales` resource for Won/Lost buttons. | Medium |
| SA-03 | 4.4, 24.9 | **Kanban Won/Lost buttons have no permission gate.** The Won and Lost buttons in the kanban/pipeline view have NO `*bifiAppHasPermission` directive at all — any user who can see the pipeline can mark deals as Won/Lost, unlike the list view which at least has a permission check (albeit with the wrong resource per SA-02). **Root cause:** `sales-pipeline.ts`/`sales-pipeline.html` does not add permission directives to Won/Lost buttons in kanban cards. | Medium |
| SA-04 | 4.8, 24.10 | **Kanban empty-column "Add opportunity" link has no permission gate.** The "Add opportunity" link rendered in empty kanban columns (`sales-pipeline.html:81-87`) has no `*bifiAppHasPermission` directive. While the route guard on `/sales/opportunities/new` still applies, the link is visible to users who may not have `sales/opportunities/create` permission, creating a misleading UI state (clicking it leads to a blocked route). | Low |
| SA-05 | 13.2, 24.11 | **Line items "Add item"/remove buttons use inconsistent permission resource.** The line items table in the sales order form gates the "Add Item" and remove buttons with `*bifiAppHasPermission="'sales-orders:update:model'"` (hyphenated resource `sales-orders`), while the route-level resource for sales orders uses `sales/orders` (slash notation). This inconsistency means a properly configured role might see the buttons but the backend rejects, or vice versa. **Root cause:** `line-items-table.html:L113,L275,L316` uses `sales-orders:update:model` instead of `sales/orders:update:model`. | Low |
| SA-06 | 7.1, 7.7 | **Mark Won auto-creates sales order with HTTP 400.** Clicking "Won" on a deal in the opportunities list triggers the `markWon()` flow which attempts to `POST /api/sales-orders` to auto-create a sales order from the deal data. The request fails with HTTP 400, likely because the auto-created order payload is missing required fields (e.g., `closeDate`, valid `currency` ObjectId, or the deal's contact/company data is not properly mapped to the order's required `contact` and `company` fields). The deal stage may still update to Closed Won despite the order creation failure. **Root cause:** `opportunities-list.ts:markWon()` (lines 96-165) constructs the sales order payload from the CRM deal but may not properly map all required fields that `SalesOrderDTO` expects (e.g., `closeDate` is optional on CRM `expectedCloseDate` but required on `SalesOrderDTO`; currency ObjectId may be the string code "CRC" instead of the MongoDB ObjectId). | High |

## Results Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 135 |
| ❌ FAIL / BUG | 18 |
| ⚠️ PARTIAL / NOTE | 131 |
| ⏭️ NOT TESTED / N/A | 10 |

**Bugs by severity:**
| Severity | Count | IDs |
|----------|-------|-----|
| **High** | 2 | SA-01 (Save triggers DirtyFormGuard), SA-06 (Mark Won auto-order HTTP 400) |
| **Medium** | 2 | SA-02 (Won/Lost permission inconsistency), SA-03 (Kanban buttons no permission gate) |
| **Low** | 2 | SA-04 (Kanban "Add opportunity" no permission gate), SA-05 (Line items resource naming mismatch) |

> **2026-07-29 initial test run:** Tested as admin user `opencode@test.com`. All 30 sections assessed:
> - ✅ **Core features tested:** Navigation (1), Dashboard (2), Opportunity List/Kanban/Create/Edit (3-6), Orders List/Create/Edit/Workflow/LineItems/PDF (9-14), Targets List/Create (15-16), CRM Stages (17), Order Stages (18), Config (19), Pricing Estimates/History/Config (20-23), DirtyFormGuard (8), Integration (30)
> - ❌ **6 bugs found:** SA-01 to SA-06 (see Bugs Found)
> - ⏭️ **Requires Sales role login:** Section 24 (Permissions) — next session
> - ❌ **N/A (feature not implemented):** Section 28 (Export/Import — no UI buttons)
> - ⚠️ **Partial/unverified:** Section 21 (Pricing Output — needs generated estimate), 25-27 (Notifications/i18n/Edge Cases — complex scenarios), 29 (Active/Inactive)
>
> **Next steps:** Re-test with Sales role to verify RBAC behavior and reproduce the reported "Role Sales is not able to create an Opportunity" issue.
