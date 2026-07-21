# TESTING GUIDELINES (DO NOT change or modify any code, only run the tests indicated)

## LOGIN Guidelines

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

## NOTES

- Do not try to login if already logged, check first where you are, as LOGING Guidelines suggest, it can be skipped.
- Do not wait much time to check if a page is loaded, first check if loaded on navigation, if not, then wait.
- In forms/dialogs, the Save/Submit/Confirm button may be hidden until the form becomes dirty (i.e. at least one input is changed). If a submit button is not visible, interact with a form field first (type text, select a radio, etc.) to make it appear before concluding it is missing.