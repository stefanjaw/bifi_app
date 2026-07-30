# Sales Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The Sales module covers the full sales pipeline: dashboard, opportunities (CRM deals), sales orders with PDF export, sales targets, pipeline stage management (CRM stages + order stages), sales configuration, and AI-powered pricing estimates. Accessed via the "Sales" sidebar menu and Settings → Sales sub-menu.
>
> **Pre-requisites (external modules only):**
> - At least one Contact (individual) and one Company created in the Contacts module.
> - At least one Currency created in the Currency module.
> - At least one Product with a sale price and UoM configured in the Inventory module.
> - At least one active Sales Tax (TaxType = SALES) configured in the Accounting module.
> - A user assigned to the "Sales" role (or equivalent) to test permission-gated actions.
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
| 1.1 | Click the "Sales" item in the sidebar main menu | Sales sub-menu expands showing: Dashboard, Opportunities, Orders, Targets, Estimated Pricing, Pricing History | |
| 1.2 | Click "Dashboard" in the Sales sub-menu | Navigates to `/sales/dashboard`; sales dashboard page loads | |
| 1.3 | Click "Opportunities" in the Sales sub-menu | Navigates to `/sales/opportunities`; opportunities list or kanban loads | |
| 1.4 | Click "Orders" in the Sales sub-menu | Navigates to `/sales/orders`; sales orders list loads | |
| 1.5 | Click "Targets" in the Sales sub-menu | Navigates to `/sales/targets/list`; sales targets list loads | |
| 1.6 | Click "Estimated Pricing" in the Sales sub-menu | Navigates to `/pricing/estimates/new`; pricing estimate form loads | |
| 1.7 | Click "Pricing History" in the Sales sub-menu | Navigates to `/pricing/estimates/history`; pricing estimate history list loads | |
| 1.8 | Navigate to Settings → Sales sub-menu | Shows: CRM Stages, Order Stages, Configuration, Pricing Configuration | |
| 1.9 | Click "CRM Stages" in Settings → Sales | Navigates to `/settings/sales/crm-stages`; CRM stages list loads | |
| 1.10 | Click "Order Stages" in Settings → Sales | Navigates to `/settings/sales/order-stages`; sales order stages list loads | |
| 1.11 | Click "Configuration" in Settings → Sales | Navigates to `/settings/sales/configuration`; sales settings form loads | |
| 1.12 | Click "Pricing Configuration" in Settings → Sales | Navigates to `/settings/pricing/configuration`; pricing settings form loads | |
| 1.13 | Navigate to `/sales` (base path) | Redirects to `/sales/dashboard` | |

---

## 2. Sales Dashboard

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Open the dashboard with no data | Loading indicator shows, then empty state message `sales.dashboard.noData` is displayed | |
| 2.2 | Open the dashboard with data | Four KPI cards visible: Revenue MTD, Total Revenue, Open Pipeline Value, Conversion Rate (with "closed orders" subtitle showing `closedWonCount`) | |
| 2.3 | Verify Revenue MTD card | Shows sum of active sales order amounts with `closeDate` in the current month | |
| 2.4 | Verify Total Revenue card | Shows sum of all active sales order amounts | |
| 2.5 | Verify Open Pipeline Value card | Shows sum of CRM deal amounts where stage is neither won nor lost | |
| 2.6 | Verify Conversion Rate card | Shows percentage (closed orders / total CRM deals × 100, one decimal place); subtitle shows the closed count | |
| 2.7 | Verify "Revenue by Stage" table | Table lists stage names and total revenue per stage, sorted descending by total | |
| 2.8 | Verify "Top Sales Reps" list | Ordered list of top 5 sales reps by username and total revenue | |
| 2.9 | Dashboard with stages but no revenue | "Revenue by Stage" table shows empty state `sales.dashboard.noStageData` | |
| 2.10 | Dashboard with no sales rep data | "Top Sales Reps" list shows empty state `sales.dashboard.noRepData` | |

---

## 3. Opportunities List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Navigate to Opportunities | List view loads by default (or kanban if previously toggled and persisted in localStorage key `sales.opportunitiesView`) | |
| 3.2 | Verify table columns | Columns visible: Title, Company, Contact, Amount, Currency, Stage, Expected Close Date — all with translated headers (scope `sales`) | |
| 3.3 | Click the list/kanban toggle buttons | View switches between table list and kanban pipeline; selection persists across navigation | |
| 3.4 | Verify "New" button is visible | "New" button with `*bifiAppHasPermission="'sales/opportunities/create:view'"` is shown if user has permission; hidden otherwise | |
| 3.5 | Click "New" button | Navigates to `/sales/opportunities/new` (opportunity create form) | |
| 3.6 | Click a row in the table | Navigates to `/sales/opportunities/edit/:id` (gated by `clickRowPermission="sales/opportunities/update:view"`) | |
| 3.7 | Verify action buttons per row | "Won" button (permission `sales:update:model`), "Lost" button (permission `sales:update:model`), and `<bifi-app-buttons-actions resource="sales/opportunities">` (edit + delete) are visible | |
| 3.8 | Infinite scroll on a large list | Scrolling to the bottom loads the next page of opportunities | |
| 3.9 | Verify search bar | Typing in the search bar filters opportunities by Title, Company name, Contact name, or Stage (search-bar filters) | |
| 3.10 | Verify filter bar | Filter bar offers 12 filter fields: Title, Stage name, Contact name, Company name, Salesperson username, Owner username, Probability, Amount, Expected Close Date, Actual Close Date, Created At, Active | |
| 3.11 | Apply a filter and search | Combined search + filter results show only matching opportunities | |
| 3.12 | Clear all filters | Full unfiltered list reloads | |

---

## 4. Opportunities Kanban (Sales Pipeline)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Toggle to kanban view | Pipeline board renders with columns per CRM stage, sorted by stage `order`; each column has a colored top border (`stage.color`) | |
| 4.2 | Verify deal cards | Each card shows the deal title and is draggable; clicking a card navigates to `/sales/opportunities/edit/:id` | |
| 4.3 | Drag a deal card to another stage column | On drop, the deal's stage is updated (PUT `/api/crm/:id`); card moves to the new column | |
| 4.4 | Verify Won/Lost buttons on a card | Each card has Won and Lost buttons (NOT permission-gated in kanban — unlike the list view) | |
| 4.5 | Click "Won" on a kanban card | Deal stage changes to the `isWon` stage; a new sales order is auto-created (POST `/api/sales-orders`) linked to the deal; toast `sales.toast.dealWonDetailPipeline` shown | |
| 4.6 | Click "Lost" on a kanban card | Deal stage changes to the `isLost` stage; toast `sales.toast.dealLost` shown | |
| 4.7 | Click "Won" when no `isWon` stage exists | Toast `sales.toast.noWonStage` or error toast shown; deal stage not changed | |
| 4.8 | Verify empty column state | Columns with no deals show a link to `/sales/opportunities/new` (note: this link is NOT permission-gated) | |
| 4.9 | Verify total value per column | Each column header shows the total value of deals in that stage | |

---

## 5. Create Opportunity

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Navigate to `/sales/opportunities/new` | Opportunity create form loads with title `sales.crm.createTitle`; three form sections: "Deal Information", "Associations", "Notes" | |
| 5.2 | Verify "Deal Information" section fields | Fields visible: Title (input, required), Stage (p-select), Amount (p-inputnumber, required), Currency (p-select, required), Probability (p-inputnumber 0–100, default 10), Expected Close Date (date input), Tags (comma-separated text input) | |
| 5.3 | Verify "Associations" section fields | Fields visible: Contact (p-select, required, with "+ Create" footer link to `/contacts/create`), Company (p-select with "+ Create" footer link to `/settings/companies/create`), Owner (p-select users, showClear), Salesperson (p-select users, showClear) | |
| 5.4 | Verify "Notes" section fields | Description (textarea) and Notes (textarea) visible | |
| 5.5 | Verify default stage auto-applied | On a fresh create form, the Stage field is pre-selected with the default CRM stage (`isDefault: true`) if one exists | |
| 5.6 | Submit with all required fields empty | Validation errors shown on Title, Amount, Contact, Currency; form does not submit | |
| 5.7 | Fill Title only and submit | Validation errors on Amount, Contact, Currency; form does not submit | |
| 5.8 | Fill Title, Amount, Currency, Contact and submit | Opportunity created (POST `/api/crm`); redirected to `/sales/opportunities` list; new deal appears in list | |
| 5.9 | Fill all fields (title, amount, currency, stage, probability, close date, tags, contact, company, owner, salesperson, description, notes) and submit | All values saved correctly; verify in edit form | |
| 5.10 | Enter tags as comma-separated values (e.g. "urgent, q4, enterprise") | On submit, tags are split into array `["urgent", "q4", "enterprise"]` and saved | |
| 5.11 | Click the "+ Create" footer link in the Contact dropdown | Navigates to `/contacts/create` with `returnUrl` and `controlName` query params; creating a contact returns the ID to the opportunity form | |
| 5.12 | Click the "+ Create" footer link in the Company dropdown | Navigates to `/settings/companies/create`; creating a company returns the ID to the opportunity form | |
| 5.13 | Submit with Amount = 0 | Validation error (Amount must be > 0 per `@IsPositive`); form does not submit | |
| 5.14 | Submit with Probability > 100 | Validation error (max 100); form does not submit | |

---

## 6. Edit Opportunity

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | Navigate to `/sales/opportunities/edit/:id` for an existing deal | Edit form loads with title `sales.crm.updateTitle`; all fields pre-filled with saved values | |
| 6.2 | Verify field pre-fill | Title, Amount, Currency, Stage, Probability, Expected Close Date, Tags (joined as comma-separated), Contact, Company, Owner, Salesperson, Description, Notes — all correctly pre-filled | |
| 6.3 | Change the Title and save | Updated title appears in the opportunities list | |
| 6.4 | Change the Stage and save | Updated stage reflected in list and kanban | |
| 6.5 | Change the Amount and save | Updated amount reflected; dashboard "Open Pipeline Value" updates if stage is not won/lost | |
| 6.6 | Clear the Company field (showClear) and save | Company saved as null; edit form shows empty company on reload | |
| 6.7 | Clear the Owner field (showClear) and save | Owner saved as null | |
| 6.8 | Modify tags and save | Updated tags array persisted | |
| 6.9 | Change Contact to a different contact and save | Updated contact reflected | |

---

## 7. Opportunity — Mark Won / Mark Lost

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Click "Won" on a deal in the list view | Deal stage changes to the `isWon` stage; a new sales order is auto-created with `crmId`, `contact`, `company`, `amount`, `currency`, `closeDate` from the deal; toast `sales.toast.dealWon` and `sales.toast.dealWonDetail` shown | |
| 7.2 | Verify the auto-created sales order | Navigate to `/sales/orders`; a new order exists linked to the won deal; order status is `draft` | |
| 7.3 | Click "Won" on a deal that has no salesperson | Auto-created sales order has no salesperson (optional field) | |
| 7.4 | Click "Won" when no `isWon` stage exists | Toast `sales.toast.noWonStage` shown; deal stage not changed; no order created | |
| 7.5 | Click "Lost" on a deal in the list view | Deal stage changes to the `isLost` stage; toast `sales.toast.dealLost` shown; no sales order created | |
| 7.6 | Click "Lost" when no `isLost` stage exists | Error toast `sales.toast.noLostStage` or similar; deal stage not changed | |
| 7.7 | Click "Won" and the auto-created order fails | Toast `sales.toast.createOrderFailed` shown; deal stage may still update — document actual behaviour | |
| 7.8 | Mark a deal Won, then mark it Lost | Stage changes from won to lost; verify whether the auto-created order is affected — document actual behaviour | |

---

## 8. Opportunity — Dirty Form Guard

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Open create form, type in Title field, then click browser back or sidebar link | "Unsaved changes" confirmation dialog appears (DirtyFormGuard on `opportunities/new` route) | |
| 8.2 | Confirm leaving the dirty form | Navigation proceeds; form data discarded | |
| 8.3 | Cancel the unsaved changes dialog | Stays on the form; changes preserved | |
| 8.4 | Open edit form, modify a field, then navigate away | "Unsaved changes" dialog appears (DirtyFormGuard on `opportunities/edit/:id` route) | |
| 8.5 | Submit the form successfully, then navigate | No "unsaved changes" dialog (form is clean after submit) | |
| 8.6 | Open create form, fill fields, navigate to Contact create via "+ Create" footer | Draft is saved; returning from contact create restores the filled values (autoForm + DraftService) | |

---

## 9. Sales Orders List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Navigate to `/sales/orders` | Orders list loads; table shows columns: Number, Stage, Deal, Company, Contact, Grand Total, Tax Total, Currency, Close Date, Salesperson | |
| 9.2 | Verify "New" button | "New" button with `*bifiAppHasPermission="'sales/orders/create:view'"` is visible if user has permission | |
| 9.3 | Click "New" button | Navigates to `/sales/orders/new` (sales order create form) | |
| 9.4 | Click a row in the table | Navigates to `/sales/orders/edit/:id` (gated by `clickRowPermission="sales/orders/update:view"`) | |
| 9.5 | Verify action buttons per row | `<bifi-app-buttons-actions resource="sales/orders">` shows edit + delete buttons | |
| 9.6 | Click delete on a row | Confirmation prompt; confirming deletes the order (DELETE `/api/sales-orders/:id`) | |
| 9.7 | Infinite scroll on a large list | Scrolling to bottom loads next page | |
| 9.8 | Verify search bar | Typing filters by Deal title, Company name, Contact name, or Stage name (search-bar filters only; no filter bar on orders list) | |
| 9.9 | Verify no filter bar | Orders list has only a search bar; no filter bar is present (unlike opportunities list) | |

---

## 10. Create Sales Order

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Navigate to `/sales/orders/new` | Sales order create form loads with "General Information" section, "Order Items" section (line items table + totals), and "Notes" section | |
| 10.2 | Verify "General Information" fields | Fields: Opportunity (p-select, optional), Contact (p-select, required), Company (p-select, required), Salesperson (p-select, optional), Status (read-only, default `draft`), Pipeline Stage (p-select), Amount (disabled, auto-calculated), Currency (p-select, required), Close Date (datepicker, required) | |
| 10.3 | Verify Amount field is disabled | Amount input is disabled and auto-set from `grandTotal` computed by the line items table | |
| 10.4 | Submit with required fields empty | Validation errors on Contact, Company, Currency, Close Date; form does not submit | |
| 10.5 | Fill Contact, Company, Currency, Close Date and add one line item, then submit | Order created (POST `/api/sales-orders`); navigates to `/sales/orders/edit/:id`; order `number` auto-generated if Sales Settings → Order Sequence is configured | |
| 10.6 | Verify auto-numbering | After creating an order with a configured sequence, the order `number` field is populated (e.g. "SO-0001") | |
| 10.7 | Create order with no sequence configured | Order created without a `number` (field is null/empty); warning `sales.orderDetail.missingSequence` may show on edit | |
| 10.8 | Select an Opportunity (crmId) | Opportunity details pre-fill Contact and Company fields from the linked deal — document actual behaviour | |
| 10.9 | Verify totals preview | Subtotal, per-tax breakdown, Tax Total, and Grand Total update in real time as line items are added/modified | |
| 10.10 | Fill Notes field and submit | Notes saved with the order | |

---

## 11. Edit Sales Order

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Navigate to `/sales/orders/edit/:id` for an existing order | Edit form loads with all fields pre-filled; action strip shows Back, Export PDF, and Save buttons | |
| 11.2 | Verify breadcrumb | Dynamic breadcrumb shows the order `number` (set via `DynamicBreadcrumbService`) | |
| 11.3 | Verify missing sequence warning | If `order.number` is empty, warning message `sales.orderDetail.missingSequence` is displayed | |
| 11.4 | Modify a line item quantity and save | Line item total recomputed; subtotal, taxes, grand total, and amount recomputed server-side; updated values shown | |
| 11.5 | Add a new line item and save | New item persisted; totals recalculated | |
| 11.6 | Remove a line item and save | Item removed; totals recalculated | |
| 11.7 | Change Currency and save | Currency updated; if invalid currency ID, server returns 400 error | |
| 11.8 | Change Contact and save | Contact updated on the order | |
| 11.9 | Save without changes | Form is not dirty; Save button may not be visible until a field changes — document actual behaviour | |
| 11.10 | Verify client-sent totals are overwritten | Modify subtotal/taxTotal/grandTotal in the payload (if possible via devtools); server recomputes from line items — frontend values are NOT trusted | |

---

## 12. Sales Order — Status Workflow & Stepper

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Verify status stepper on edit form | Horizontal stepper shows all statuses: Draft → Quote → Confirmed → Shipped → Completed (with Cancel option); current status highlighted | |
| 12.2 | Click "Send Quote" action button | Order status changes to `quote` (PATCH `/api/sales-orders/:id/status` with `{ status: "quote" }`); stepper updates | |
| 12.3 | Click "Confirm Order" action button | Status changes to `confirmed`; stepper updates | |
| 12.4 | Click "Mark Shipped" action button | Status changes to `shipped`; stepper updates | |
| 12.5 | Click "Mark Completed" action button | Status changes to `completed`; stepper updates | |
| 12.6 | Click "Cancel Order" action button | Status changes to `cancelled`; stepper shows cancelled state | |
| 12.7 | Verify contextual action button changes | The action button label changes based on current status: "Send Quote" (draft), "Confirm Order" (quote), "Mark Shipped" (confirmed), "Mark Completed" (shipped) | |
| 12.8 | Verify status update authorization | Status update endpoint requires `sales-orders/update` permission (PATCH `/api/sales-orders/:id/status`) | |
| 12.9 | Status update on non-existent order ID | Server returns 404 with `{ message: "Sales order not found" }` | |

---

## 13. Sales Order — Line Items Table

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Verify line items table columns | Columns: drag handle, SKU (product select), Description, Quantity (with available-stock hint), UoM (read-only from product), Unit Price, Discount (conditional), Taxes (conditional multiselect), Total, Remove button | |
| 13.2 | Click "Add item" button | New empty line item row appears; button gated by `*bifiAppHasPermission="'sales-orders:update:model'"` | |
| 13.3 | Select a product in the SKU dropdown | Description auto-fills from product name; Unit Price auto-fills from product sale price; UoM auto-fills from product unit; default sale taxes auto-applied; Total computed from qty × unit price | |
| 13.4 | Change Quantity | Total recomputes (quantity × unit price - discount + taxes); totals preview updates | |
| 13.5 | Change Unit Price | Total recomputes; totals preview updates | |
| 13.6 | Select a discount | Discount applied (percentage or fixed based on discount type); line total adjusts | |
| 13.7 | Select multiple taxes on a line item | Each selected tax is applied; per-tax breakdown shown in totals preview | |
| 13.8 | Drag a line item to reorder | Row moves to new position; order preserved on save (CDK drag-and-drop) | |
| 13.9 | Click remove (×) button on a line item | Row removed; totals recalculated; button gated by `*bifiAppHasPermission="'sales-orders:update:model'"` | |
| 13.10 | Verify stock validation | If quantity exceeds available stock, warning `sales.lineItems.exceedsStock` is shown | |
| 13.11 | Verify column resize | Column widths are resizable and persist (localStorage key `lineItems.sales.colWidths`) | |
| 13.12 | Set `readonly` mode on the line items table | All inputs disabled; add/remove/reorder buttons hidden — document actual behaviour (used in read-only order views) | |
| 13.13 | Submit order with a line item missing required fields (no description, qty, or unit price) | Server returns 400 validation error (`LineItemDTO` validation); order not saved | |
| 13.14 | Submit order with a tax that is not TaxType.SALES | Server returns 400 error (`assertLineTaxesValid` rejects non-sales taxes); order not saved | |

---

## 14. Sales Order — PDF Export

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | Click "Export PDF" on a draft order | PDF opens in a new browser tab; title is "QUOTE" with purple accent color; filename is `quote-<number>.pdf` (or `quote-<id>.pdf` if no number) | |
| 14.2 | Click "Export PDF" on a confirmed order | PDF opens; title is "SALES ORDER" with green accent color; filename is `order-<number>.pdf` | |
| 14.3 | Verify PDF content — header | Shows doc title (QUOTE or SALES ORDER), order number, status badge, currency code and symbol | |
| 14.4 | Verify PDF content — customer block | Shows contact name (or fullName), email, and company name | |
| 14.5 | Verify PDF content — details block | Shows Close Date (formatted) and Salesperson username (or email) | |
| 14.6 | Verify PDF content — line items table | Columns: Description, Qty, Unit Price, Discount (label with name and value), Total | |
| 14.7 | Verify PDF content — totals | Subtotal, per-tax rows (labeled "Tax"), Tax Total, Grand Total — all formatted with `.toFixed(2)` | |
| 14.8 | Verify PDF content — notes | If order has notes, a Notes box is rendered | |
| 14.9 | Verify PDF content — footer | Generation date shown at bottom | |
| 14.10 | Verify PDF locale | All text is in English (`<html lang="en">`, dates `en-US`, status labels English) — document as known i18n gap | |
| 14.11 | Export PDF on non-existent order ID | Server returns 404 with `{ message: "Sales order not found" }` | |
| 14.12 | Verify PDF authorization | PDF endpoint (`GET /api/sales-orders/:id/pdf`) requires `sales-orders/read` permission | |

---

## 15. Sales Targets List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | Navigate to `/sales/targets/list` | Targets list loads; table shows columns: Name, Year, Month, Target Amount, Currency, Salesperson | |
| 15.2 | Verify "New" button | "New" button with `*bifiAppHasPermission="'sales/targets/create:view'"` is visible if user has permission | |
| 15.3 | Click "New" button | Navigates to `/sales/targets/create` (target create form) | |
| 15.4 | Click a row in the table | Navigates to `/sales/targets/edit/:id` (gated by `clickRowPermission="sales/targets/update:view"`) | |
| 15.5 | Verify action buttons per row | `<bifi-app-buttons-actions resource="sales/targets">` shows edit + delete buttons | |
| 15.6 | Click delete on a row | Confirmation prompt; confirming deletes the target | |
| 15.7 | Verify no search bar or filters | Targets list has only the table — no search bar or filter bar (unlike opportunities and orders) | |

---

## 16. Create / Edit Sales Target

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | Navigate to `/sales/targets/create` | Target create form loads with title `sales.targets.createTitle`; one section "Target Details" | |
| 16.2 | Verify form fields | Name (input, required), Year (p-inputnumber, required, default current year), Month (p-select, required, default current month, options January–December translated via `sales.months.*`), Target Amount (p-inputnumber, currency mode USD, required, min 0.01), Currency (text input, default "USD"), Salesperson (p-select users, showClear, label `sales.targets.salesRepOptional`) | |
| 16.3 | Submit with no fields filled | Validation errors on Name, Year, Month, Target Amount; form does not submit | |
| 16.4 | Fill all required fields and submit | Target created (POST `/api/sales-targets`); redirected to `/sales/targets/list`; new target appears in list | |
| 16.5 | Open edit form for an existing target | All fields pre-filled correctly | |
| 16.6 | Change the Target Amount and save | Updated amount reflected in list | |
| 16.7 | Clear Salesperson (showClear) and save | Salesperson saved as null/undefined | |
| 16.8 | Submit with Target Amount = 0 | Validation error (`@IsPositive` requires > 0); form does not submit | |
| 16.9 | Submit with Month = 13 | Validation error (`@Max(12)`); form does not submit | |
| 16.10 | Navigate away from a dirty target form | No "unsaved changes" dialog (DirtyFormGuard is NOT on target routes — document as a known gap) | |

---

## 17. CRM Stages (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Navigate to `/settings/sales/crm-stages` | CRM stages list loads; table shows columns: Name, Order, Probability, isWon, isLost | |
| 17.2 | Verify "Add New" button | Button with `*bifiAppHasPermission="'crm-stages/create:view'"` is visible | |
| 17.3 | Click "Add New" | Navigates to CRM stage create form | |
| 17.4 | Verify create form fields | Section 1 "Stage Information": Name (required), Color (color picker, default `#6366f1`), Order (number), Probability (0–100), Description. Section 2 "Stage Flags": isDefault checkbox (`sales.stageFlags.setDefault`), isWon checkbox (`sales.stageFlags.markWon`), isLost checkbox (`sales.stageFlags.markLost`) | |
| 17.5 | Fill Name and submit | Stage created (POST `/api/crm-stages`); redirected to list; new stage appears | |
| 17.6 | Create a stage with `isDefault` checked | New stage becomes the default; verify that creating a new opportunity auto-applies this stage | |
| 17.7 | Create a stage with `isWon` checked | Stage appears with "Mark Won" label in the isWon column | |
| 17.8 | Create a stage with `isLost` checked | Stage appears with "Mark Lost" label in the isLost column | |
| 17.9 | Edit an existing stage | All fields pre-filled; changes saved on submit | |
| 17.10 | Delete a CRM stage | Stage removed from list | |
| 17.11 | Verify search bar | Typing filters stages by Name (single search filter) | |
| 17.12 | Navigate away from a dirty stage form | No "unsaved changes" dialog (DirtyFormGuard is NOT on CRM stage routes — document as a known gap) | |

---

## 18. Sales Order Stages (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Navigate to `/settings/sales/order-stages` | Order stages list loads; table shows columns: Name, Color, Order, isDefault, Active | |
| 18.2 | Verify "Add New" button | Button with `*bifiAppHasPermission="'sales-order-stages/create:view'"` is visible | |
| 18.3 | Click "Add New" | Navigates to order stage create form | |
| 18.4 | Verify create form fields | Section 1: Name (required), Color (color picker, default `#6366f1`), Order (number), Description. Section 2 "Stage Options": isDefault checkbox (`sales.orderStages.setDefault`). No isWon/isLost fields (those are CRM-stage only) | |
| 18.5 | Fill Name and submit | Stage created (POST `/api/sales-order-stages`); redirected to list | |
| 18.6 | Create a stage with `isDefault` checked | New stage becomes the default for sales orders | |
| 18.7 | Edit an existing order stage | All fields pre-filled; changes saved on submit | |
| 18.8 | Delete an order stage | Stage removed from list | |
| 18.9 | Verify search bar | Typing filters stages by Name | |
| 18.10 | Navigate away from a dirty order stage form | No "unsaved changes" dialog (DirtyFormGuard is NOT on order stage routes — document as a known gap) | |

---

## 19. Sales Configuration (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | Navigate to `/settings/sales/configuration` | Sales settings form loads with title `sales.settings.title` | |
| 19.2 | Verify form sections | Section "Document Sequences": Order Sequence (p-select from sequences, placeholder `sales.settings.selectSequence`). Section "Additional Information": Description (textarea) | |
| 19.3 | Select a Sequence and save | Settings saved (PUT `/api/sales/settings`); on reload, the selected sequence is pre-filled | |
| 19.4 | Clear the Order Sequence and save | Settings saved with null sequence; new sales orders will not be auto-numbered | |
| 19.5 | Verify singleton behavior | Only one settings record exists; saving again updates the same record (upsert) | |
| 19.6 | Create a sales order after configuring a sequence | Order `number` is auto-generated from the configured sequence | |

---

## 20. Pricing Estimates — Create

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | Navigate to `/pricing/estimates/new` | Pricing estimate form loads | |
| 20.2 | Verify form fields | Request text (textarea), Shipping Method (select: Air/Sea/Both), Pricing Controls (duty-free checkbox, markup vs margin radio buttons, value input), Special Instructions (textarea), Generate button | |
| 20.3 | Verify token estimator card | Token Estimator Card visible on the right; updates live as request text is typed (debounced) | |
| 20.4 | Type request text | Token estimator updates: shows catalog rows to retrieve, freight rows, input/output/total tokens, within-limits status | |
| 20.5 | Submit with empty request text | Form does not submit or shows validation error — document actual behaviour | |
| 20.6 | Fill request text and click Generate | Loading state; POST `/api/pricing-estimates/generate`; on success, navigates to `/pricing/estimates/:id` (output view) | |
| 20.7 | Switch between Markup and Margin pricing method | Input field label/context changes; value input adjusts | |
| 20.8 | Check "Duty Free" checkbox | Pricing calculation excludes duty — document actual effect on the generated estimate | |

---

## 21. Pricing Estimates — Output & Download

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 21.1 | Navigate to `/pricing/estimates/:id` for a completed estimate | Output view loads with header (number, date, preparedBy), customer/distributor toggle, and line items table | |
| 21.2 | Verify line items table | Shows product, supplier, part number, qty, unit price, freight per unit, HS code, duty %, duty per unit, wharfage, landed per unit, customer price per unit, margin %, total customer | |
| 21.3 | Toggle to "Distributor" view | Extra columns (duty, freight, landed cost) visible that are hidden in "Customer" view | |
| 21.4 | Toggle back to "Customer" view | Extra columns hidden; only customer-facing columns shown | |
| 21.5 | Verify totals cards | Total Landed, Total Customer, and Wharfage Fees cards shown | |
| 21.6 | Click "PDF" download button | PDF file downloads | |
| 21.7 | Click "CSV" download button | CSV file downloads | |
| 21.8 | Click "Copy Email" button | Estimate details copied to clipboard or email client opens — document actual behaviour | |
| 21.9 | Verify token info line | Shows input/output/total tokens and estimated cost | |
| 21.10 | Verify disclaimer | Disclaimer text shown at the bottom | |

---

## 22. Pricing Estimates — History List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 22.1 | Navigate to `/pricing/estimates/history` | History list loads; table shows columns: Number, Date, Request Text, Total Customer, Prepared By, Status | |
| 22.2 | Verify "New Estimate" button | Button with `*bifiAppHasPermission="'pricing-estimates/create:view'"` is visible | |
| 22.3 | Click "New Estimate" | Navigates to `/pricing/estimates/new` | |
| 22.4 | Click a row in the table | Navigates to `/pricing/estimates/:id` (output view, gated by `clickRowPermission="pricing-estimates/read:view"`) | |
| 22.5 | Verify no delete button | No `<bifi-app-buttons-actions>` on the pricing history table (no delete from list) | |
| 22.6 | Verify search bar | Typing filters by Number or Prepared By | |

---

## 23. Pricing Settings (Settings)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 23.1 | Navigate to `/settings/pricing/configuration` | Pricing settings form loads with 4 sections: Document Sequences, Pricing Defaults, Drive Folder Mappings, Indexing | |
| 23.2 | Verify "Document Sequences" section | Estimate Sequence (p-select from sequences) | |
| 23.3 | Verify "Pricing Defaults" section | Default pricing method (markup/margin), default shipping method (sea/air/land), wharfage bank fee %, default markup factor, default margin | |
| 23.4 | Verify "Drive Folder Mappings" section | Dynamic rows with type (pricing/freight/config), folder ID, and label; "Add Folder" button | |
| 23.5 | Add a folder mapping row and save | New folder mapping persisted | |
| 23.6 | Remove a folder mapping row and save | Folder mapping removed | |
| 23.7 | Verify "Indexing" section | Status cards show catalog records count, freight records count, last-indexed dates | |
| 23.8 | Click "Index All" button | Indexing triggered (POST `/api/pricing-index/trigger`); status message updates; polling every 4s shows progress | |
| 23.9 | Click "Index Pricing Only" | Only pricing indexing triggered | |
| 23.10 | Click "Index Freight Only" | Only freight indexing triggered | |
| 23.11 | Click "Force Full Reindex" | Full reindex triggered (with force flag) | |
| 23.12 | Verify indexing status polling | While indexing is running, status cards update every 4 seconds; when complete, status shows final counts | |
| 23.13 | Save pricing settings | PUT `/api/pricing-settings`; confirmation toast or form resets dirty state | |

---

## 24. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 24.1 | Log in as a user with the "Sales" role and navigate to Opportunities | Opportunities list loads if `sales/opportunities/list` view permission is granted | |
| 24.2 | Verify "New" button visibility for Sales role | "New" button visible only if `sales/opportunities/create:view` permission is granted | |
| 24.3 | **Sales role — Create Opportunity** | Click "New", fill required fields (Title, Amount, Currency, Contact), and submit. If the Sales role has a `crm` resource policy with `create` action (model type), the opportunity is created. If not, server returns 401/403 `UnauthorizedException` — **this is the reported bug: "Role Sales is not able to create an Opportunity"** | |
| 24.4 | Verify backend resource for opportunity create | Opportunity creation hits `POST /api/crm` with `authorizeMiddleware("crm", "create")`. The Sales role needs a `crm` model policy, NOT a `sales` policy, to create opportunities | |
| 24.5 | Check frontend route guard on `opportunities/new` | `permissionGuard` checks `data.resource = 'sales/opportunities/create'` (view type). If the Sales role lacks this view permission, the route is blocked even before the form loads | |
| 24.6 | Log in as a user WITHOUT `sales/opportunities/menu` permission | "Opportunities" sub-menu item is hidden in the sidebar | |
| 24.7 | Log in as a user WITHOUT `sales/dashboard/list` permission | "Dashboard" sub-menu item hidden; navigating to `/sales/dashboard` is blocked by route guard | |
| 24.8 | Verify Won/Lost button permission inconsistency | Won/Lost buttons in the list view use `sales:update:model` (generic `sales` resource), while row edit/delete use `sales/opportunities` resource. A Sales role with `sales:update:model` but NOT `sales/opportunities:update:view` can mark won/lost but cannot edit the deal — document this inconsistency | |
| 24.9 | Verify kanban Won/Lost buttons have no permission gate | Won/Lost buttons in the kanban view have NO `*bifiAppHasPermission` directive — any user who can see the pipeline can mark won/lost | |
| 24.10 | Verify kanban "New" link in empty columns has no permission gate | The "New" link in empty kanban columns (`sales-pipeline.html:81-87`) has no `*bifiAppHasPermission` — but the route guard on `opportunities/new` still applies | |
| 24.11 | Verify line items "Add item" button permission | Add/remove line item buttons gated by `sales-orders:update:model` (note: hyphenated `sales-orders`, not slash `sales/orders`) | |
| 24.12 | Log in as a user without `crm-stages/menu` permission | "CRM Stages" settings sub-menu item is hidden | |
| 24.13 | Log in as a user without `pricing-estimates/menu` permission | "Estimated Pricing" and "Pricing History" sub-menu items are hidden | |

---

## 25. Notifications

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 25.1 | Mark a deal as Won (with a salesperson assigned) | A notification is fired (`type: "deal_won"`, `module: "sales"`) to the salesperson and owner; title "CRM Deal Won"; body `Deal "<title>" has been marked as Won.` | |
| 25.2 | Verify notification link | Clicking the notification navigates to `/sales/opportunities/edit/:id` | |
| 25.3 | Verify notification body for deal with no title | If the deal title is empty, body falls back to `data._id` (pre-existing bug: code reads `existing.name` but the schema field is `title`, so `existing.name` is `undefined`) — document actual notification body text | |
| 25.4 | Create a new opportunity | No notification is fired on opportunity creation (notifications only fire on update when stage name contains "won") | |
| 25.5 | Create/update a sales order | No notification is fired (the sales module has zero `fireNotification` calls for orders, targets, stages, or settings) | |

---

## 26. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 26.1 | Switch language to Spanish and open the Sales dashboard | All dashboard labels (KPI card titles, table headers, empty states) translated using scope `sales` | |
| 26.2 | Open Opportunities list in Spanish | Column headers, search bar, filter labels, and button labels translated (scope `sales`) | |
| 26.3 | Open Opportunity create form in Spanish | Form section titles, field labels, placeholders, and action buttons translated (scope `sales`) | |
| 26.4 | Open Sales Order edit form in Spanish | All labels and status stepper text translated (scope `sales`) | |
| 26.5 | Open Sales Targets form in Spanish | Month names translated via `sales.months.january` through `sales.months.december` | |
| 26.6 | Open CRM Stages form in Spanish | Stage flag labels (`sales.stageFlags.setDefault`, `sales.stageFlags.markWon`, `sales.stageFlags.markLost`) translated | |
| 26.7 | Open Sales Settings in Spanish | Settings title and field labels translated | |
| 26.8 | Export a sales order PDF in Spanish | PDF content is in English (hardcoded `<html lang="en">`, `en-US` dates, English status labels) — document as known i18n gap (Phase 2 work) | |
| 26.9 | Verify menu items in Spanish | All Sales sub-menu labels (`sales.nav.dashboard`, `sales.nav.opportunities`, etc.) and Settings sub-menu labels translated | |
| 26.10 | Check for any hardcoded English strings | Search for untranslated text in templates — document any found | |

---

## 27. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 27.1 | Create an opportunity with Amount = 0.01 (minimum positive) | Opportunity created successfully (`@IsPositive` accepts any value > 0) | |
| 27.2 | Create an opportunity with Probability = 0 | Opportunity created (min is 0, not `@IsPositive`) | |
| 27.3 | Create an opportunity with Probability = 100 | Opportunity created (max is 100) | |
| 27.4 | Create a sales order with no line items | Order created; subtotal, taxTotal, grandTotal = 0; amount = 0 | |
| 27.5 | Create a sales order with a line item quantity = 0 | Server validates `@Min(0)` — passes; line total = 0 | |
| 27.6 | Create a sales target with currency "EUR" | Saved if valid ISO 4217 code (`@IsISO4217CurrencyCode`) | |
| 27.7 | Create a sales target with currency "xyz" (invalid ISO code) | Validation error; not saved | |
| 27.8 | Mark the same deal as Won twice | Second click: deal is already in won stage; may create a duplicate sales order — document actual behaviour | |
| 27.9 | Create a CRM stage with both `isWon` and `isLost` checked | Both flags saved (no mutual exclusivity enforced at schema level) — document actual behaviour and impact on Mark Won/Lost | |
| 27.10 | Create two CRM stages with `isDefault` checked | Both have `isDefault: true` (no mutual exclusivity enforced in `SalesOrderStageService`; `CrmStageService` may handle differently) — document actual behaviour | |
| 27.11 | Delete a contact that is linked to an opportunity | Document what happens to the opportunity's `contact` field — does it become null or retain a dangling ref? | |
| 27.12 | Delete a CRM stage that is used by existing opportunities | Document actual behaviour — are deals reassigned, orphaned, or is deletion blocked? | |
| 27.13 | Export an empty opportunities list as CSV | CSV downloads with headers only or empty state message | |
| 27.14 | Navigate to `/sales/pipeline` | Redirects to `/sales/opportunities` (redirect route) | |
| 27.15 | Drag a deal card to the same stage column (no-op drag) | No stage update request sent, or stage update sent with same value — document actual behaviour | |

---

## 28. Export / Import

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 28.1 | Export opportunities as CSV (GET `/api/crm/export`) | CSV downloads with columns matching the opportunities schema | |
| 28.2 | Export sales orders as CSV (GET `/api/sales-orders/export`) | CSV downloads with columns matching the sales order schema | |
| 28.3 | Export sales targets as CSV (GET `/api/sales-targets/export`) | CSV downloads with target fields | |
| 28.4 | Export CRM stages as CSV (GET `/api/crm-stages/export`) | CSV downloads with stage fields | |
| 28.5 | Import opportunities via CSV (POST `/api/crm/import`) | Valid CSV rows imported; appear in opportunities list | |
| 28.6 | Import sales orders via CSV (POST `/api/sales-orders/import`) | Valid CSV rows imported; appear in orders list | |
| 28.7 | Import CSV with missing required fields | Error message shown; no partial import | |
| 28.8 | Verify export/import authorization | Export requires `{resource}/export` read permission; import requires `{resource}/import` create permission | |

---

## 29. Active / Inactive Status

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 29.1 | Filter opportunities by Active = true | Only active opportunities shown in list | |
| 29.2 | Filter opportunities by Active = false | Only inactive opportunities shown | |
| 29.3 | Verify inactive opportunities in kanban | Document whether inactive deals appear in the pipeline — document actual behaviour | |
| 29.4 | Verify inactive sales orders in list | Document whether inactive orders appear by default | |
| 29.5 | Delete a sales order | Document whether the delete is a soft delete (active = false) or hard delete — document actual behaviour | |

---

## 30. Integration — Sales with Other Modules

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 30.1 | Create an opportunity and select a Contact | Contacts from the Contacts module are searchable and selectable in the Contact dropdown | |
| 30.2 | Create an opportunity and select a Company | Companies from the Companies module are searchable and selectable | |
| 30.3 | Create a sales order and select a Currency | Currencies from the Currency module are selectable | |
| 30.4 | Create a sales order line item and select a Product | Products from the Inventory module are searchable; selecting one auto-fills description, unit price, UoM, and default taxes | |
| 30.5 | Create a sales order line item and select a Tax | Only active taxes with TaxType.SALES from the Accounting module are valid; selecting a non-sales tax causes a 400 error on save | |
| 30.6 | Create a sales order line item and select a Discount | Discounts from the Accounting module are selectable | |
| 30.7 | Verify stock balance integration | Line items table shows available stock from the Inventory module's stock balances; warns if quantity exceeds stock | |
| 30.8 | Mark a deal as Won and verify auto-created sales order | The auto-created order is linked to the deal via `crmId`; order inherits contact, company, amount, currency, closeDate from the deal | |
| 30.9 | Verify dashboard cross-module aggregation | Dashboard "Open Pipeline Value" aggregates CRM deals (not sales orders); "Total Revenue" aggregates sales orders; "Conversion Rate" divides sales order count by CRM deal count | |
| 30.10 | Verify Sales Settings → Sequence integration | Selecting a Sequence from the Sequences module and saving drives auto-numbering of sales orders | |
