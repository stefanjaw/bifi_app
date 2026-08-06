# TESTING GUIDELINES (DO NOT change or modify any code, only run the tests indicated)

## LOGIN Guidelines

- Use playwright MCP for testings
- Navigate to http://localhost:4200
- On the login screen, use the following credentians: email: opencode@test.com ; password: 123456
- Once logged, the home screen will be presented.
- If in page load, you are presented with home screen skipping login completely, login is taken as successful.

## TESTING Guidelines

- A folder under testings/{module_name} will contain a file {module_name}_template.md, this file includes all testings to execute.
- Using the current logged user, execute the tests indicated in the template file.
- Once a test or tests in the same date are performed, copy the template, in the same directory using {module_name}_results_{date}.md.
- Show the results of each test, also include  with ✅ / ❌ / ⚠️ icons on each result under pass/fail column.
- This results will be updated and included in the current date file.

## TEMPLATE CREATION Guidelines

When creating a new `{module_name}_template.md` file, follow the structure observed in the existing templates (`contacts_template.md`, `asset-commissioning-template.md`).

### File & Folder Structure

- **Folder**: `testings/{module_name}/` for a top-level module, or `testings/{parent_module}/{sub_module}/` for a sub-feature (e.g. `testings/asset-roster/asset-commissioning/`).
- **Template file**: `{module_name}_template.md` in the module folder. Use underscore `_` as the separator (matching `contacts_template.md`). For sub-features with hyphenated names, the separator style should stay consistent with the module's file naming.
- **Results file**: `{module_name}_results_{date}.md` where `{date}` is `YYYYMMDD` (e.g. `contacts_results_20260721.md`). Copied from the template and filled in during the test run.

### Template File Structure

```markdown
# {Module Name} Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** (optional) Brief description of what the module covers and how it is accessed (route, dialog, settings page, etc.).
>
> **Pre-requisites:** (optional) Bullet list of data/state required before running the tests (e.g. "at least one record with status X", "user has Y permission").
>
> **Naming note:** (optional) Any codebase-specific naming quirks the tester should be aware of.

---

## 1. {Section Name}

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | {action to perform} | {what should happen} | |
| 1.2 | ... | ... | |

---

## 2. {Section Name}
...
```

### Mandatory Elements

1. **Title**: `# {Module Name} Module — Test Cases` (em dash `—`, capitalised module name).
2. **Intro line**: `All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.`
3. **Numbered sections**: `## N. Section Name` — each section groups related tests. Use `---` horizontal rules between sections.
4. **Test tables**: Each section contains a markdown table with exactly these columns:
   - `#` — test identifier in `{section}.{item}` format (e.g. `1.1`, `3.4`).
   - `Test` — the action to perform (imperative: "Click...", "Navigate to...", "Select...").
   - `Expected Result` — what should happen if the feature works correctly. Reference specific UI elements, routes, translation keys, or API endpoints where relevant.
   - `Pass/Fail` — **left empty** in the template; filled with ✅ / ❌ / ⚠️ during the test run.
5. **Empty Pass/Fail column**: The template must never contain pre-filled results.

### Optional Elements

- **Blockquote preamble** (`>` prefixed): Use when the module has access pre-requisites, scope limitations, or naming quirks. Keep it concise. Omit entirely for simple modules (as `contacts_template.md` does).
- **"document actual behaviour" tests**: When the expected behaviour is unknown or intentionally flexible, phrase the Expected Result as "... — document actual behaviour" so the tester records what really happens.

### Section Coverage Guidelines

A comprehensive template should cover the module's full feature surface. Use these section categories as a checklist — include only the ones that apply to the module being tested:

| Category | When to include | Example section name |
|---|---|---|
| Access & Navigation | Always (for routed modules) | `Access & Navigation` |
| List view | If the module has a list/table | `Contacts List` / `Asset Roster List` |
| Search & Filters | If the list has a search bar or filters | `Search & Filters` |
| Create — {variant} | For each create form/type variant | `Create Contact — Individual`, `Create Contact — Company` |
| Form display & validation | For each form/dialog | `Commission Dialog — Open & Form Display`, `Commission Dialog — Validation` |
| Submit (success paths) | For each submit outcome | `Commission Dialog — Submit (Pass Outcome)`, `Submit (Fail Outcome)` |
| Edit | If the module has an edit form | `Edit Contact` |
| Delete | If the module has delete | `Delete Contact` |
| File uploads / Attachments | If forms accept files | `Commission Dialog — Attachments (File Upload)` |
| Cancel & Error Handling | For each form/dialog | `Commission Dialog — Cancel & Error Handling` |
| State machine / Lifecycle | If the entity has status-driven UI | `Commissioning Lifecycle State Machine` |
| Activity History / Audit | If records appear in a history feed | `Activity History Integration` |
| Related-section gating | If the module unlocks/hides other sections | `Maintenance Service Section Interaction` |
| Data Integrity & API Contract | Optional — only for backend-critical modules | `Data Integrity & API Contract` |
| Internationalization (i18n) | If the module has translated strings or hardcoded English | `Internationalization (i18n)` |
| Edge Cases & Boundary Conditions | Always recommended | `Edge Cases & Boundary Conditions` |
| Permission & Security | If routes/buttons are permission-gated | `Permission & Security` |
| Export / Import | If the module has export/import | `Export`, `Import` |
| Active / Inactive Status | If the entity has an active flag | `Active / Inactive Status` |
| Integration with other modules | If the entity is consumed elsewhere | `Integration — Contacts in Other Modules` |

### Writing Good Test Cases

- **Be specific**: Reference actual routes (`/contacts/create`), element labels ("Add New Contact" button), translation keys (`commission`, scope `asset-roster`), API endpoints (`POST /api/asset-commissioning`), and field names — not generic placeholders.
- **One action per test**: Each row should test one discrete behaviour. Split compound checks ("fill the form and save and verify the list") into separate rows.
- **Cover both happy and sad paths**: Include validation failures, empty states, and error handling — not just successful submissions.
- **Cover UI state transitions**: If an action changes what buttons/sections are visible afterwards, add a test verifying the new state (e.g. "Commission button replaced by Decommission button").
- **Note hardcoded strings**: If the codebase has known hardcoded English strings (violating the i18n convention), include tests that document them so they are tracked.
- **Avoid untestable cases**: Do not include tests that cannot be verified via the UI (e.g. internal API payload shape, database field coercion) unless the module has no other way to verify that behaviour. Mark such tests clearly if included.

## NAVIGATION Guidelines

- **Use the app's own navigation buttons to move between pages — NEVER navigate by URL.**
  - Click sidebar links, breadcrumbs, "Go back" buttons, "Add New" buttons, table row clicks, and any other in-app navigation affordance.
  - The only exception is the **initial login navigation** to `http://localhost:4200` (see LOGIN Guidelines).
- **Why this matters:** The Angular router's lifecycle (`canActivate` guards, `canDeactivate` guards like `DirtyFormGuard`, `runGuardsAndResolvers`, route param binding, component reuse strategy) only runs through in-app navigation. Jumping straight to a URL via `playwright_browser_navigate`:
  - Bypasses `DirtyFormGuard` — the "unsaved changes" confirmation dialog never fires, so dirty-form/draft tests silently pass or fail for the wrong reason.
  - Skips `permissionGuard` route activation — permission-gating tests become inaccurate.
  - Discards in-memory component state — `DraftService` localStorage keys are keyed by `router.url`, but the draft-restore `effect()` only runs on a fresh component instantiation through the router, not on a hard URL load.
  - Loses breadcrumb, sidenav active-state, and resource signal subscriptions — list pages may render empty because `ApiRequestManager` resources were never triggered by the route param `input()`.
  - Breaks cross-form navigation round-trips — the `returnUrl`/`controlName` query params set by `form-select-navigate-footer` only flow correctly when the user follows the in-app "+ Create" link and the create form's `navigateBack()` returns along the same router history stack.
- **Consequence:** Many "NOT TESTED" or unexpected results in prior runs were caused by navigating by URL instead of using the app's buttons. If a test cannot be reached via in-app navigation, record that as the reason rather than forcing a URL jump.

## NOTES

- Do not try to login if already logged, check first where you are, as LOGING Guidelines suggest, it can be skipped.
- Do not wait much time to check if a page is loaded, first check if loaded on navigation, if not, then wait.
- In forms/dialogs, the Save/Submit/Confirm button may be hidden until the form becomes dirty (i.e. at least one input is changed). If a submit button is not visible, interact with a form field first (type text, select a radio, etc.) to make it appear before concluding it is missing.
- **Navigate using in-app buttons only** (see NAVIGATION Guidelines above). Do not use `playwright_browser_navigate` to jump to URLs after the initial login — it bypasses router guards and loses component state, causing false test results.

### Real-world example: SA-01 false negative

During Sales module testing, the Create Opportunity form was tested twice:

1. **Via direct URL** (`page.goto('/sales/opportunities/new')`): Save clicked → POST `/api/crm` returned 200 → **concluded: "form submission works end-to-end, no bugs"** ❌

2. **Via sidebar** (click Sales → Opportunities → New Opportunity): Save clicked → POST `/api/crm` returned 200 → **DirtyFormGuard dialog appeared** blocking redirect → **found bug SA-01** ✅

**Why the difference:** Direct URL navigation bypasses the Angular router lifecycle entirely. The `DirtyFormGuard` only fires when the router processes a navigation away from a dirty form. With `page.goto`, there is no "navigation away" — the page simply loads. The form components also initialize differently: validators may not bind properly, the `autoForm()` effect may not run, and `DraftService` localStorage keys are keyed to `router.url` which differs.

**Consequence:** Testing via direct URL gave a **false negative** (passed when it should have failed). The bug was invisible until tested through proper in-app navigation.

**Always use sidebar links, breadcrumbs, "Add New" buttons, and other in-app affordances — never `page.goto` after login.** If a page cannot be reached via in-app navigation, record that as a limitation rather than force a URL jump.

## SIDEBAR NAVIGATION WORKFLOW

The app uses a PrimeNG-based sidebar (Scaffold component) with two modes: compact (icon-only) and expanded (icon + label). Navigate through sub-menus correctly:

### Steps to Navigate

1. **Expand sidebar**: Click the hamburger button (first button in the `<p-toolbar>`) to toggle `sidenavManager.openSidenav()`.
2. **Expand parent menu**: Items with children show a chevron button (`pi pi-angle-down`). Click it to expand/collapse sub-items.
3. **Navigate**: Click the link (`[routerLink]` anchor) to navigate to the route.

### Known Limitation

Buttons that call `router.navigate()` programmatically (e.g. "Go back", some "Add New" buttons) may not work if Angular's Zone is broken by a Firebase auth initialization error (`cls is not a constructor`). Links using `[routerLink]` directives always work.

---

## MANAGED TESTING PROCESS (Linear-based)

When executing a large test suite across multiple sections (e.g. full module testing), follow this process:

### 1. Preparation

- **Explore both FE and BE codebases** before testing. Create a comprehensive inventory of routes, components, services, models, DTOs, and API endpoints (see Sales module exploration report pattern).
- **Create a test plan** with sections as Linear issues in a dedicated project (e.g. "Sales Module Testing"). Each issue contains a markdown table with test cases.
- **Set priority**: Label blocking/prerequisite sections as high priority (execute first).

### 2. Execution Order

Test in dependency order:

| Priority | What | Why first |
|----------|------|-----------|
| 1st | Settings/Configuration sections | Create stage defaults, sequences, and config needed by CRUD flows |
| 2nd | Entity CRUD (List → Create → Edit → Delete) | Core business flows |
| 3rd | Special features (Dashboard, Pipeline, PDF exports) | Dependent on CRUD data |
| 4th | Cross-cutting concerns (Permissions, i18n, Edge cases) | Verify system-wide |

### 3. Testing Approach

- **Test via the app UI** using Playwright MCP. Validate page loads, field visibility, button interactions, form submissions, data display, and navigation.
- **Supplement with API calls** (curl) when: (a) UI button navigation is blocked, (b) verifying data persisted after form submit, (c) testing edge cases that require specific payloads.
- **Check API responses match UI data** — cross-reference KPI values, table records, and form pre-filled values against API GET responses.

### 4. Bug Tracking

- **Create bug sub-issues** as children of the parent section issue using `linear_save_issue` with `parentId`.
- Each bug issue must include: reproduction steps, actual behavior, expected behavior, and root cause analysis.
- Link related bugs across sections (e.g. same root cause for multiple sections).
- **Always set the `team` parameter** when creating issues. For sub-issues (bugs), omit the `project` parameter — they automatically inherit the parent's project. For standalone test issues, set both `team` and `project` explicitly.

### 5. Results Management

- **Do NOT create `results.md` files** when using Linear — update the issue description directly with the test table and ✅/❌/⚠️ results.
- **Update statuses** as testing progresses:
  - `Done` — all testable items pass, no code bugs found (partial/blocked items are configuration gaps, not code defects).
  - `In Progress` — code bugs found (sub-issues open), or critical test items failing.
- **Re-test after fixes**: When a blocking issue is resolved (e.g., sidebar navigation), go back and re-test previously blocked items, updating the issue with new results.

### 6. Writing Test Results in Linear

When updating an issue description with results:

```
**Test Results (YYYY-MM-DD)**

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | {action} | {expected} | ✅ / ❌ / ⚠️ |
| 1.2 | ... | ... | |
```

Place the results table **below** the existing test table. Add section-level findings at the bottom.

### 7. Retesting Blocked Items

When a previously-blocked feature becomes testable (e.g., sidebar navigation fixed):

1. Re-navigate using the now-working workflow.
2. Re-run the previously blocked test items.
3. Update the issue description with `**UPDATED**` markers showing the new result.
4. Update ARD-44 (system navigation status) with the refined diagnosis.

---

## FORM SUBMISSION & VERIFICATION WORKFLOW

### Save/Submit Button Behavior

The Save/Submit button uses `bifiAppFormActionsHandler` directive which:
1. Validates the form
2. Calls `handleSubmit(data)` on the component
3. Component calls `crud.post()` or `crud.put()` via HTTP
4. On success, calls `goBack()` which uses `router.navigate()`

### Known Limitation

In the current dev environment, `router.navigate()` may not work due to a Firebase auth Zone error (`cls is not a constructor`). This means:
- Form submission **works** (API call succeeds, data saved)
- Post-save redirect **fails** (page stays on form, does not navigate back to list)
- The "Go back" button also fails (uses `router.navigate()`)
- Sidebar links, breadcrumbs, and `[routerLink]` anchors **work** correctly

### How to Test Form Submission

1. Fill required fields in the form
2. Click Save/Submit
3. The Save button click triggers the API call (check via network tab)
4. If the API returns 200 but no navigation occurs, the data was saved successfully
5. Verify via API: `curl GET /api/{endpoint}` to confirm the record exists
6. Navigate back to the list via sidebar link to see the new record in the UI

### How to Test Form Validation

- Check if Save button is **disabled** when the form is empty (required fields not filled)
- After filling all required fields, Save should become **enabled**
- On submit with missing fields, the form stays and validation errors appear
- The form service (`CrmForm`, `SalesOrderForm`, etc.) defines validators like `Validators.required`, `Validators.min(0)`, `Validators.max(100)`

---

## LINEAR ISSUE STATUS CONVENTION

When testing across multiple issues in a project, use this convention for consistency:

| Status | When to use |
|--------|-------------|
| **Todo** | Issue created but not yet tested. **Bug sub-issues** use this when not started. |
| **In Progress** | Testing started; bugs found with sub-issues open; items still failing. A **test issue** stays In Progress until all its bugs are fixed and retested. |
| **Done** | All testable items verified pass, **and** no code bugs found (partial = config/blocked only). If any bug sub-issue exists, the parent **cannot** be Done. |
| **Canceled** | Section not applicable; duplicate of another issue |

### Rules for parent issues with bug sub-issues:

1. **Parent test issue** → `In Progress` — bugs found, sub-issues open. **Never** set a parent to `Done` while any bug sub-issue is open.
2. **Bug sub-issues** → `Todo` when filed but not started; `In Progress` when being fixed/tested; `Done` when the fix is verified.
3. **Parent transitions to `Done`** only after all its bug sub-issues are `Done` and the test items are re-verified.
4. **Parent with no bugs, all items pass** → `Done` directly (no need for In Progress).

Apply status changes immediately after completing a section's testing cycle.