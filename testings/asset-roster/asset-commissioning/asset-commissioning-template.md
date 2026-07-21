# Asset Commissioning Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The asset-commissioning module is a **dialog-driven sub-feature** of the asset-roster module. It has no routes or list of its own. All tests are performed from the **Asset Roster maintenance page** (`/asset-roster/equipment/maintenance/:id`), which hosts the Commission and Decommission dialogs.
>
> **Pre-requisites:**
> - At least one asset roster record exists with status `awaiting-commissioning` (no `assetCommission` record yet) — used for the Commission flow.
> - At least one asset roster record exists with status `active` (has a passed `assetCommission` record) — used for the Decommission flow.
> - At least one asset roster record exists with status `decommissioned` OR a failed commission (`assetCommission.outcome === 'fail'`) — used for the Re-attempt Commission flow.
> - The logged-in user has `asset-rosters:update` permission (required to access the maintenance page).
>
> **Naming note:** The interface is spelled `assetCommissionning` (double `n`) throughout the codebase — this is intentional and preserved consistently.

---

## 1. Access & Navigation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/asset-roster` (list) | Asset Roster list loads with equipment rows | |
| 1.2 | Click a row for an asset with status `awaiting-commissioning` | Navigates to the maintenance page for that asset (`/asset-roster/equipment/maintenance/:id`) | |
| 1.3 | Verify the maintenance page loads the Commissioning Lifecycle section | A green "Commission" button is shown (because no `assetCommission` record exists) | |
| 1.4 | Verify permission guard blocks unauthorized users | A user without `asset-rosters/update` permission is redirected away from the maintenance route | |

---

## 2. Commission Dialog — Open & Form Display

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | Click the "Commission" button | The Commission dialog opens as a modal | |
| 2.2 | Verify the dialog header | Header shows "Commission" (translation key `commission`, scope `asset-roster`) when no prior commission exists | |
| 2.3 | Verify the dialog subtitle | Shows "Perform inspection for: {productModel} - {serialNumber}" (translation key `performInspectionFor`) | |
| 2.4 | Verify the Outcome field | Two radio buttons are shown: "Pass" (green text) and "Fail" (red text); "Fail" is selected by default | |
| 2.5 | Verify the Details field | A textarea is shown with placeholder "Enter details" (translation key `enterDetails`) | |
| 2.6 | Verify the Attachments field | A file upload control is shown (single file, `application/*` accepted, max ~100MB) | |
| 2.7 | Verify the form actions | "Cancel" and "Save" buttons are shown; Save is disabled until the form is valid and dirty | |
| 2.8 | Close the dialog via the X button | Dialog closes without submitting; no toast is shown | |
| 2.9 | Re-open the dialog | Form is reset (Outcome defaults to "Fail", Details is empty, no attachments) — no stale data from previous open | |

---

## 3. Commission Dialog — Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Open the dialog and click Save without selecting an outcome | Validation error shown on the Outcome field; form does not submit | |
| 3.2 | Open the dialog, leave Details empty, select "Pass", click Save | Validation error shown on the Details field ("This field is required"); form does not submit | |
| 3.3 | Open the dialog, select "Fail", leave Details empty, click Save | Validation error shown on the Details field; form does not submit | |
| 3.4 | Open the dialog, fill Details with whitespace only, click Save | Validation error shown (if whitespace validator exists) OR form submits — document actual behaviour | |

---

## 4. Commission Dialog — Submit (Pass Outcome)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Select "Pass", enter Details "Inspection passed all checks", click Save | `POST /api/asset-commissioning` is called with `{ assetRosterId, outcome: 'pass', details: 'Inspection passed all checks' }` | |
| 4.2 | Verify success toast | Toast message "commissioning created successfully" is displayed (hardcoded English, lowercase 'c') | |
| 4.3 | Verify dialog closes | The dialog closes automatically after successful submission | |
| 4.4 | Verify the asset roster reloads | The parent maintenance page reloads the asset roster and activity history | |
| 4.5 | Verify the asset status changes | The asset's status changes from `awaiting-commissioning` to `active` | |
| 4.6 | Verify the Commissioning Lifecycle section updates | The green "Commission" button is replaced by a red "Decommission" button | |
| 4.7 | Verify the activity history shows the new commissioning record | A new entry appears in the Activity History section with outcome "pass" and the entered details | |

---

## 5. Commission Dialog — Submit (Fail Outcome)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | On an asset with `awaiting-commissioning` status, open the Commission dialog, select "Fail", enter Details "Failed voltage test", click Save | `POST /api/asset-commissioning` is called with `{ assetRosterId, outcome: 'fail', details: 'Failed voltage test' }` | |
| 5.2 | Verify success toast | Toast message "commissioning created successfully" is displayed | |
| 5.3 | Verify dialog closes | Dialog closes after successful submission | |
| 5.4 | Verify the Commissioning Lifecycle section updates | A yellow "Re-attempt Commission" button is shown (because `assetCommission.outcome === 'fail'`) | |
| 5.5 | Verify the activity history shows the failed commissioning record | A new entry appears in the Activity History with outcome "fail" and the entered details | |
| 5.6 | Verify the asset status | Asset status remains `awaiting-commissioning` (failed commission does NOT activate the asset) — document actual behaviour | |

---

## 6. Commission Dialog — Re-attempt Commission

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | On an asset with a failed commission, click "Re-attempt Commission" | The Commission dialog opens | |
| 6.2 | Verify the dialog header | Header shows "Re-attempt Commission" (translation key `reattemptCommission`, scope `asset-roster`) — different from the initial "Commission" header | |
| 6.3 | Verify the form is reset | Outcome defaults to "Fail", Details is empty, no attachments (no stale data from the previous failed attempt) | |
| 6.4 | Select "Pass", enter Details, click Save | A new commissioning record is created via `POST /api/asset-commissioning` | |
| 6.5 | Verify the asset status changes to `active` | After the re-attempt passes, the asset becomes active and the "Decommission" button appears | |
| 6.6 | Verify the activity history shows both records | Both the failed attempt and the passed re-attempt appear in the Activity History | |

---

## 7. Commission Dialog — Attachments (File Upload)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Open the Commission dialog, fill required fields, upload a PDF file | The file appears in the upload control with the file name | |
| 7.2 | Submit with the attachment | `POST /api/asset-commissioning` includes the `attachments` array in the payload | |
| 7.3 | Verify the saved commissioning record shows the attachment | The activity history entry for the commissioning record shows the attached file | |
| 7.4 | Attempt to upload a non-application file (e.g. `.jpg`) | Upload is rejected OR allowed — document actual behaviour (the `accept` attribute is `application/*`) | |
| 7.5 | Attempt to upload a file larger than 100MB | Upload is rejected with a size error | |
| 7.6 | Attempt to upload multiple files | Only one file is accepted (the `multiple` attribute is `false`) | |
| 7.7 | Submit without any attachment | `POST` succeeds; the `attachments` field is omitted or sent as empty array — document actual behaviour | |

---

## 8. Commission Dialog — Cancel & Error Handling

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Open the dialog, fill some fields, click "Cancel" | Dialog closes without submitting; no toast is shown | |
| 8.2 | Open the dialog, fill some fields, click the X button | Dialog closes without submitting; no toast is shown | |
| 8.3 | Submit a valid form that triggers a server error (e.g. network failure) | Dialog remains open; `submitLoading` resets to false; no success toast; error is NOT shown as a toast (only `submitLoading` resets) | |
| 8.4 | After a server error, re-submit the form | The form is still populated with the previous values (not reset on error); re-submit attempts the POST again | |

---

## 9. Decommission Dialog — Open & Form Display

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | On an asset with status `active` (passed commission), verify the red "Decommission" button is shown | The Commissioning Lifecycle section shows a red "Decommission" button (not the green "Commission" button) | |
| 9.2 | Click the "Decommission" button | The Decommission dialog opens as a modal | |
| 9.3 | Verify the dialog header | Header shows "Decommission Asset" (translation key `decommissionAsset`, scope `asset-roster`) | |
| 9.4 | Verify the dialog subtitle | Shows "Decommission confirm" (translation key `decommissionConfirm`) followed by the asset type name and product model with serial number | |
| 9.5 | Verify the asset type fallback | If the asset has no type, the text "No type" is shown (hardcoded English fallback) | |
| 9.6 | Verify the Details field | A textarea is shown with placeholder "Enter details" (translation key `enterDetails`) | |
| 9.7 | Verify NO attachments field | The decommission dialog does NOT have a file upload control (unlike the commission dialog) | |
| 9.8 | Verify the form actions | "Cancel" and "Confirm" buttons are shown (note: the save button label is "Confirm", not "Save" — translation key `confirm`) | |
| 9.9 | Close and re-open the dialog | Form is reset (Details is empty) — no stale data | |

---

## 10. Decommission Dialog — Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | Open the dialog, leave Details empty, click "Confirm" | Validation error shown on the Details field ("This field is required"); form does not submit | |
| 10.2 | Open the dialog, fill Details with whitespace only, click "Confirm" | Validation error shown (if whitespace validator exists) OR form submits — document actual behaviour | |

---

## 11. Decommission Dialog — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | Enter Details "Asset retired due to end of life", click "Confirm" | `PUT /api/asset-commissioning/{commissioningId}/decommission` is called with `{ details: 'Asset retired due to end of life' }` | |
| 11.2 | Verify the `_id` in the URL targets the commissioning record | The URL uses `assetRoster.assetCommission._id` (the commissioning record ID), NOT the asset roster ID | |
| 11.3 | Verify success toast | Toast message "Decommissioned successfully" is displayed (hardcoded English, capital 'D') | |
| 11.4 | Verify dialog closes | The dialog closes automatically after successful submission | |
| 11.5 | Verify the asset roster reloads | The parent maintenance page reloads the asset roster and activity history | |
| 11.6 | Verify the asset status changes to `decommissioned` | The asset's status changes from `active` to `decommissioned` | |
| 11.7 | Verify the Commissioning Lifecycle section updates | The "Decommission" button is no longer shown (or a different state is shown) — document actual behaviour | |
| 11.8 | Verify the activity history shows the decommission record | A new entry appears in the Activity History reflecting the decommission action | |

---

## 12. Decommission Dialog — Cancel & Error Handling

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Open the dialog, enter some text, click "Cancel" | Dialog closes without submitting; no toast is shown | |
| 12.2 | Open the dialog, enter some text, click the X button | Dialog closes without submitting; no toast is shown | |
| 12.3 | Submit a valid form that triggers a server error (e.g. network failure) | Dialog remains open; `submitLoading` resets to false; no success toast; error is NOT shown as a toast | |
| 12.4 | After a server error, re-submit the form | The form is still populated with the previous values (not reset on error); re-submit attempts the PUT again | |

---

## 13. Commissioning Lifecycle State Machine

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Asset with NO `assetCommission` record (status `awaiting-commissioning`) | Green "Commission" button is shown; "Decommission" button is hidden | |
| 13.2 | Asset with `assetCommission.outcome === 'fail'` | Yellow "Re-attempt Commission" button is shown; "Decommission" button is hidden | |
| 13.3 | Asset with `assetCommission.outcome === 'pass'` (status `active`) | Red "Decommission" button is shown; "Commission"/"Re-attempt" buttons are hidden | |
| 13.4 | Asset with status `decommissioned` | Verify which buttons are shown — document actual behaviour (no commission/re-attempt/decommission button expected) | |
| 13.5 | Asset with status `under-service` or `in-pm` | Verify which commissioning buttons are shown — document actual behaviour | |

---

## 14. Activity History Integration

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | After a successful commission (pass), check the Activity History section | A new activity history entry appears with type "commissioning", outcome "pass", and the entered details | |
| 14.2 | After a failed commission, check the Activity History section | A new activity history entry appears with type "commissioning", outcome "fail", and the entered details | |
| 14.3 | After a decommission, check the Activity History section | A new activity history entry appears reflecting the decommission action | |
| 14.4 | Click on a commissioning activity history entry | The entry expands or shows details (outcome, details, attachments if any) | |
| 14.5 | Use the "Add File" action on a commissioning activity history entry | The Add File dialog opens; uploading a file calls `PUT /api/asset-commissioning/:id` with `{ attachments: file }` | |
| 14.6 | Verify the Add File dialog header for commissioning records | Header reads "Add File to commissioning from asset: {productModel}" (hardcoded English) | |
| 14.7 | Verify the Add File dialog correctly distinguishes commissioning vs maintenance records | Commissioning records (no `name` field) use `CrudAssetCommissioning.put`; maintenance records (with `name` field) use `CrudAssetMaintenances.put` | |

---

## 15. Maintenance Service Section Interaction

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | On an asset with NO commission record (status `awaiting-commissioning`) | The Maintenance Service section is hidden or disabled (maintenance requires a passed commission) | |
| 15.2 | On an asset with a passed commission (status `active`) | The Maintenance Service section is visible and functional | |
| 15.3 | On an asset with a failed commission | The Maintenance Service section is hidden or disabled (failed commission does not unlock maintenance) | |
| 15.4 | On a decommissioned asset | Verify the Maintenance Service section state — document actual behaviour | |

---

## 16. Data Integrity & API Contract

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | Verify the `assetCommissionning` interface fields are persisted | Saved record has `_id`, `outcome`, `details`, `assetRosterId` (populated), `active` | |
| 16.2 | Verify `details` is coerced to empty string when null/undefined | The backend receives `details: ''` (not `null`) when the form value is falsy | |
| 16.3 | Verify `attachments` is conditionally included in the POST payload | When the FormArray is empty, `attachments` is still sent as `[]` (empty array is truthy) OR omitted — document actual behaviour | |
| 16.4 | Verify the decommission PUT uses `specificEndpoint: 'decommission'` | The request URL is `PUT /api/asset-commissioning/{id}/decommission`, not a plain `PUT /api/asset-commissioning/{id}` | |
| 16.5 | Verify the `assetRosterId` in the POST payload is the asset's `_id` | The commissioning record is linked to the correct asset roster | |
| 16.6 | Verify a decommissioned asset cannot be re-commissioned via the UI | After decommission, the "Commission" button is not shown — document actual behaviour | |

---

## 17. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Verify the Commission dialog header translation | Header uses translation key `commission` (scope `asset-roster`) — not a hardcoded string | |
| 17.2 | Verify the Re-attempt Commission dialog header translation | Header uses translation key `reattemptCommission` (scope `asset-roster`) | |
| 17.3 | Verify the Decommission dialog header translation | Header uses translation key `decommissionAsset` (scope `asset-roster`) | |
| 17.4 | Verify the success toast for commissioning | Toast is hardcoded English "commissioning created successfully" — NOT translated (known convention violation) | |
| 17.5 | Verify the success toast for decommissioning | Toast is hardcoded English "Decommissioned successfully" — NOT translated (known convention violation) | |
| 17.6 | Verify the "No type" fallback in the decommission dialog | The fallback "No type" is hardcoded English — NOT translated (known convention violation) | |
| 17.7 | Switch the app language to Spanish and open the Commission dialog | Verify which strings translate and which remain in English — document actual behaviour | |

---

## 18. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | Open the Commission dialog, upload a file, then remove it, then submit | Form submits without the attachment; `attachments` is empty or omitted | |
| 18.2 | Open the Commission dialog, fill the form, close without saving, then re-open | Form is completely reset (no leftover values from the previous open) | |
| 18.3 | Rapidly click "Save" multiple times on the Commission dialog | Only one `POST` request is fired (submit button is disabled while `submitLoading` is true) | |
| 18.4 | Rapidly click "Confirm" multiple times on the Decommission dialog | Only one `PUT` request is fired | |
| 18.5 | Open the Decommission dialog on an asset whose `assetCommission` is missing | The dialog either prevents opening or the PUT fails with an empty `_id` — document actual behaviour | |
| 18.6 | Commission an asset, then immediately try to commission it again | The "Commission" button is no longer shown (replaced by "Decommission"); cannot re-commission a passed asset | |
| 18.7 | Verify the `outcome` field only accepts `'pass'` or `'fail'` | The radio buttons only offer these two values; no other outcome is possible | |

---

## 19. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | Verify the maintenance route is guarded by `permissionGuard` | A user without `asset-rosters/update` permission cannot access `/asset-roster/equipment/maintenance/:id` | |
| 19.2 | Verify the Commission/Decommission dialogs inherit the page permission | There are no `*bifiAppHasPermission` directives inside the dialog templates; access is gated by the parent route | |
| 19.3 | Verify a user with only `asset-rosters:read` permission cannot commission | The maintenance page is blocked, so the dialogs are never reachable | |
| 19.4 | Verify the `POST /api/asset-commissioning` endpoint enforces authorization | A direct API call without `asset-rosters:create:model` permission is rejected by the backend | |
| 19.5 | Verify the `PUT /api/asset-commissioning/:id/decommission` endpoint enforces authorization | A direct API call without `asset-rosters:update:model` permission is rejected by the backend | |

---

## 20. Integration with Asset Roster List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | After commissioning an asset (pass), navigate to the Asset Roster list | The asset's status column shows "Active" (severity `success`) | |
| 20.2 | After failing a commission, navigate to the Asset Roster list | The asset's status column shows "Awaiting Commissioning" (severity `warn`) | |
| 20.3 | After decommissioning an asset, navigate to the Asset Roster list | The asset's status column shows "Decommissioned" (severity `danger`) | |
| 20.4 | Use the status filter cards on the Asset Roster list | Filtering by "Awaiting Commissioning" shows only assets with no passed commission; filtering by "Active" shows commissioned assets; filtering by "Decommissioned" shows decommissioned assets | |