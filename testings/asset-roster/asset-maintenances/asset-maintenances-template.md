# Asset Maintenances Module — Test Cases

All tests are manual unless noted otherwise. Pass/Fail column to be filled in during the test run.

> **Module scope:** The asset-maintenances module is a **dialog-driven sub-feature** of the asset-roster module. It has no routes or list of its own. All tests are performed from the **Asset Roster maintenance page** (`/asset-roster/equipment/maintenance/:id`), which hosts three dialogs: Initiate Service, Finish Service/PM, and Skip PM.
>
> **Pre-requisites:**
> - At least one asset with a passed commission (status `active`) and no active service or PM — used for Initiate Service and Initiate PM tests.
> - At least one asset with an active service (status `under-service`) — used for Finish Service tests.
> - At least one asset with an active PM (status `in-pm`) and a scheduled maintenance date — used for Finish PM and Skip PM tests.
> - The logged-in user has `asset-rosters:update` permission (required to access the maintenance page).
>
> **Naming note:** The interface is `assetMaintenance` with `type: 'service' | 'preventive-maintenance'`. The finish dialog uses a computed property `assetMaintenace` (missing an 'n' — preserved typo in the codebase).

---

## 1. Access & Maintenance Section Display

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1.1 | Navigate to `/asset-roster` and click an asset with status `active` (passed commission) | Maintenance page loads; the Maintenance Service section is visible | |
| 1.2 | Verify the Maintenance Service section shows available actions | "Initiate Service" button and PM-related actions (Initiate PM / Skip PM) are shown, enabled when no service/PM is active | |
| 1.3 | Verify the section is gated by commission status | On an asset with no passed commission (status `awaiting-commissioning`), the service/PM buttons are disabled with a message indicating commission is required | |
| 1.4 | Verify the section is gated on a decommissioned asset | On a decommissioned asset, the service/PM buttons are disabled — document actual behaviour | |

---

## 2. Initiate Service Dialog — Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 2.1 | On an `active` asset with no active service, click "Initiate Service" | The Initiate Service dialog opens as a modal | |
| 2.2 | Verify the dialog header | Header shows "Perform Service" (translation key `performService`, scope `asset-roster`) | |
| 2.3 | Verify the asset identity line | Shows the asset type name (or "No type" fallback), product model, and serial number | |
| 2.4 | Verify the Service Type field | Four radio buttons are shown: calibration, verification, unscheduled-maintenance, repair | |
| 2.5 | Verify the Description field | A textarea is shown with placeholder text (translation key `describeServiceReason`) | |
| 2.6 | Verify the form actions | "Cancel" and "Save" buttons are shown | |
| 2.7 | Click Save without selecting a service type | Validation error shown on the Service Type field; form does not submit | |
| 2.8 | Select a service type but leave Description empty, click Save | Validation error shown on the Description field; form does not submit | |
| 2.9 | Close the dialog (X or Cancel), then re-open it | Form is reset (no service type selected, Description empty) — no stale data | |

---

## 3. Initiate Service — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 3.1 | Select "calibration", enter Description "Quarterly calibration", click Save | Success toast "Service created successfully" is shown | |
| 3.2 | Verify the dialog closes | Dialog closes automatically after submission | |
| 3.3 | Verify the asset status changes | Status changes from `active` to `under-service` | |
| 3.4 | Verify the Maintenance Service section updates | The "Initiate Service" button is replaced/disabled; a "Finish Service" button appears | |
| 3.5 | Verify the activity history | A new entry appears in the Activity History reflecting the initiated service | |
| 3.6 | Navigate to the Asset Roster list | The asset's status column shows "Under Service" | |

---

## 4. Initiate Service — Other Types

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 4.1 | Select "verification", enter a description, click Save | Service created successfully; asset status changes to `under-service` | |
| 4.2 | Select "unscheduled-maintenance", enter a description, click Save | Service created successfully | |
| 4.3 | Select "repair", enter a description, click Save | Service created successfully | |

---

## 5. Initiate Service — Cancel & Error Handling

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 5.1 | Open the dialog, fill fields, click "Cancel" or X button | Dialog closes without submitting; no toast is shown | |
| 5.2 | Submit a valid form that triggers a server error (e.g. network failure) | Dialog remains open; Save button re-enables; no success toast | |
| 5.3 | After a server error, re-submit the form | Form retains previous values; re-submit attempts again | |

---

## 6. Finish Service Dialog — Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 6.1 | On an asset with an active service (status `under-service`), click "Finish Service" | The Finish Service dialog opens as a modal | |
| 6.2 | Verify the dialog header | Header shows "Complete Service" (translation key `completeService`, scope `asset-roster`) | |
| 6.3 | Verify the confirmation line | Shows "Confirm completion of" + the service name + "initiated on" + the start date | |
| 6.4 | Verify the Notes field | A textarea is shown with placeholder text (translation key `egNoIssues`) | |
| 6.5 | Verify the Cost field | A currency input (`p-inputnumber`, mode currency, USD) is shown with placeholder "e.g., 250.00" | |
| 6.6 | Verify the Attachments field | A file upload control is shown (single file, `application/*`, ~100MB max) | |
| 6.7 | Verify the form actions | "Cancel" and "Confirm Service Done" buttons (translation key `confirmServiceDone`) | |
| 6.8 | Verify the form is dirty on open | The Save button is enabled immediately (the dialog marks the form as touched/dirty on open) | |
| 6.9 | Submit with all fields empty (no notes, no cost, no attachments) | Form submits successfully (no required validators on this form) | |
| 6.10 | Close and re-open the dialog | Form is reset (Notes empty, Cost null, no attachments) | |

---

## 7. Finish Service — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 7.1 | Enter Notes "Service completed, all checks passed", enter Cost 150.00, click "Confirm Service Done" | The service is finished; no success toast is shown (finish dialogs do not show toasts) | |
| 7.2 | Verify the dialog closes | Dialog closes automatically after submission | |
| 7.3 | Verify the asset status changes | Status changes from `under-service` back to `active` | |
| 7.4 | Verify the Maintenance Service section updates | The "Finish Service" button is replaced; "Initiate Service" becomes available again | |
| 7.5 | Verify the activity history | A new entry appears reflecting the completed service, including notes and cost | |
| 7.6 | Navigate to the Asset Roster list | The asset's status column shows "Active" | |

---

## 8. Finish Service — Attachments

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 8.1 | Open the Finish Service dialog, upload a PDF file | The file appears in the upload control with its name | |
| 8.2 | Submit with the attachment | The service is finished with the attachment saved | |
| 8.3 | Verify the saved record shows the attachment | The activity history entry shows the attached file | |
| 8.4 | Attempt to upload a non-application file (e.g. `.jpg`) | Upload is rejected OR allowed — document actual behaviour (`accept="application/*"`) | |
| 8.5 | Attempt to upload a file larger than 100MB | Upload is rejected with a size error | |
| 8.6 | Attempt to upload multiple files | Only one file is accepted (`multiple="false"`) | |
| 8.7 | Upload a file, then remove it, then submit | Form submits without the attachment | |

---

## 9. Finish Service — Cancel & Error Handling

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 9.1 | Open the dialog, enter text, click "Cancel" or X button | Dialog closes without submitting; no toast is shown | |
| 9.2 | Submit a valid form that triggers a server error | Dialog remains open; Confirm button re-enables; no success toast | |
| 9.3 | After a server error, re-submit the form | Form retains previous values; re-submit attempts again | |
| 9.4 | Rapidly click "Confirm Service Done" multiple times | Only one request is fired (button disabled while loading) | |

---

## 10. Initiate PM (Preventive Maintenance)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 10.1 | On an `active` asset with no active service/PM and a scheduled maintenance date, click "Initiate PM" | PM is initiated WITHOUT a dialog; success toast "PM initiated successfully" is shown | |
| 10.2 | Verify the asset status changes | Status changes from `active` to `in-pm` | |
| 10.3 | Verify the Maintenance Service section updates | "Initiate PM" is replaced; "Finish PM" and "Skip PM" buttons appear | |
| 10.4 | Verify the activity history | A new entry appears reflecting the initiated PM | |
| 10.5 | Navigate to the Asset Roster list | The asset's status column shows "In PM" | |
| 10.6 | Attempt to initiate a PM when no maintenance windows are scheduled | The "Initiate PM" button is disabled — document actual behaviour | |
| 10.7 | Attempt to initiate a PM when a service is already active | The "Initiate PM" button is disabled | |

---

## 11. Finish PM Dialog — Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 11.1 | On an asset with an active PM (status `in-pm`), click "Finish PM" | The Finish PM dialog opens as a modal | |
| 11.2 | Verify the dialog header | Header shows "Complete PM" (translation key `completePm`, scope `asset-roster`) — different from the Finish Service header | |
| 11.3 | Verify the confirmation line | Shows "Confirm completion of" + the PM name + "initiated on" + the start date | |
| 11.4 | Verify the Notes field | A textarea is shown with placeholder text (translation key `egNoIssues`) | |
| 11.5 | Verify the Cost field | A currency input is shown (same as Finish Service) | |
| 11.6 | Verify the Attachments field | A file upload control is shown (same as Finish Service) | |
| 11.7 | Verify the form actions | "Cancel" and "Confirm PM Done" buttons (translation key `confirmPmDone`) — different label from Finish Service | |
| 11.8 | Verify the form is dirty on open | The Save button is enabled immediately (form marked as touched/dirty on open) | |
| 11.9 | Submit with all fields empty | Form submits successfully (no required validators) | |

---

## 12. Finish PM — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 12.1 | Enter Notes "PM completed", enter Cost 300.00, click "Confirm PM Done" | The PM is finished; no success toast is shown | |
| 12.2 | Verify the dialog closes | Dialog closes automatically after submission | |
| 12.3 | Verify the asset status changes | Status changes from `in-pm` back to `active` | |
| 12.4 | Verify the Maintenance Service section updates | The "Finish PM" button is replaced; "Initiate PM" becomes available again | |
| 12.5 | Verify the activity history | A new entry appears reflecting the completed PM, including notes and cost | |
| 12.6 | Navigate to the Asset Roster list | The asset's status column shows "Active" | |

---

## 13. Finish PM — Cancel & Error Handling

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 13.1 | Open the dialog, enter text, click "Cancel" or X button | Dialog closes without submitting; no toast is shown | |
| 13.2 | Submit a valid form that triggers a server error | Dialog remains open; Confirm button re-enables; no success toast | |
| 13.3 | After a server error, re-submit the form | Form retains previous values; re-submit attempts again | |
| 13.4 | Rapidly click "Confirm PM Done" multiple times | Only one request is fired | |

---

## 14. Skip PM Dialog — Display & Validation

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 14.1 | On an asset with an active PM (status `in-pm`) and a scheduled maintenance date, click "Skip PM" | The Skip PM dialog opens as a modal | |
| 14.2 | Verify the dialog header | Header shows "Skip PM" (translation key `skipPm`, scope `asset-roster`) | |
| 14.3 | Verify the confirmation line | Shows "Confirm skip PM" + the scheduled maintenance date | |
| 14.4 | Verify the Notes field | A textarea is shown with placeholder text (translation key `egNoIssues`) | |
| 14.5 | Verify NO Cost field | The Skip PM dialog does NOT have a cost input (unlike the Finish dialogs) | |
| 14.6 | Verify NO Attachments field | The Skip PM dialog does NOT have a file upload control | |
| 14.7 | Verify the form actions | "Cancel" and "Confirm Skip" buttons (translation key `confirmSkip`) | |
| 14.8 | Verify the form is dirty on open | The Save button is enabled immediately (form marked as touched/dirty on open) | |
| 14.9 | Submit with Notes empty | Form submits successfully (no required validators on the notes field) | |

---

## 15. Skip PM — Submit

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 15.1 | Enter Notes "PM skipped due to scheduling conflict", click "Confirm Skip" | The PM is skipped; no success toast is shown | |
| 15.2 | Verify the dialog closes | Dialog closes automatically after submission | |
| 15.3 | Verify the asset status changes | Status changes from `in-pm` back to `active` — document actual behaviour | |
| 15.4 | Verify the Maintenance Service section updates | The "Skip PM" and "Finish PM" buttons are replaced; PM actions return to available state | |
| 15.5 | Verify the activity history | A new entry appears reflecting the skipped PM | |

---

## 16. Skip PM — Cancel & Error Handling

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 16.1 | Open the dialog, enter text, click "Cancel" or X button | Dialog closes without submitting; no toast is shown | |
| 16.2 | Submit a valid form that triggers a server error | Dialog remains open; Confirm button re-enables; no success toast | |
| 16.3 | After a server error, re-submit the form | Form retains previous values; re-submit attempts again | |

---

## 17. Maintenance Lifecycle State Machine

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 17.1 | Asset with status `active` (no service/PM active) | "Initiate Service" and "Initiate PM" buttons are enabled (if PM is scheduled) | |
| 17.2 | Asset with an active service (status `under-service`) | "Initiate Service" is disabled; "Finish Service" is shown; "Initiate PM" is disabled | |
| 17.3 | Asset with an active PM (status `in-pm`) | "Initiate PM" is disabled; "Finish PM" and "Skip PM" are shown; "Initiate Service" is disabled | |
| 17.4 | Asset with status `awaiting-commissioning` | All maintenance buttons are disabled with a message indicating commission is required | |
| 17.5 | Asset with a failed commission | All maintenance buttons are disabled — document actual behaviour | |
| 17.6 | Attempt to start a service while a PM is active | The "Initiate Service" button is disabled | |
| 17.7 | Attempt to start a PM while a service is active | The "Initiate PM" button is disabled | |

---

## 18. PM Schedule & Maintenance Windows

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 18.1 | On an `active` asset with no maintenance windows assigned | The "Initiate PM" button is disabled — document actual behaviour | |
| 18.2 | On an asset where the maintenance date is in the future | The "Initiate PM" button is disabled — document actual behaviour | |
| 18.3 | Verify the PM window/date fields lock when a PM is active | The maintenance window and date fields become read-only when a PM is in progress | |
| 18.4 | After finishing a PM, verify the window/date fields unlock | The fields become editable again | |

---

## 19. Activity History Integration

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 19.1 | After initiating a service, check the Activity History section | A new entry appears reflecting the initiated service with the service type and description | |
| 19.2 | After finishing a service, check the Activity History section | A new entry appears reflecting the completed service with notes and cost | |
| 19.3 | After initiating a PM, check the Activity History section | A new entry appears reflecting the initiated PM | |
| 19.4 | After finishing a PM, check the Activity History section | A new entry appears reflecting the completed PM with notes and cost | |
| 19.5 | After skipping a PM, check the Activity History section | A new entry appears reflecting the skipped PM with notes | |
| 19.6 | Use the "Add File" action on a maintenance activity history entry | The Add File dialog opens; uploading a file attaches it to the maintenance record | |
| 19.7 | Verify the Add File dialog header for maintenance records | Header reads "Add File to maintenance from asset: {productModel}" — document actual behaviour | |

---

## 20. Internationalization (i18n)

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 20.1 | Verify the Initiate Service dialog header translation | Header uses translation key `performService` (scope `asset-roster`) | |
| 20.2 | Verify the Finish Service dialog header translation | Header uses translation key `completeService` (scope `asset-roster`) | |
| 20.3 | Verify the Finish PM dialog header translation | Header uses translation key `completePm` (scope `asset-roster`) | |
| 20.4 | Verify the Skip PM dialog header translation | Header uses translation key `skipPm` (scope `asset-roster`) | |
| 20.5 | Verify the service creation success toast | Toast is hardcoded English "Service created successfully" — NOT translated | |
| 20.6 | Verify the PM initiation success toast | Toast is hardcoded English "PM initiated successfully" — NOT translated | |
| 20.7 | Verify the "No type" fallback in the Initiate Service dialog | "No type" is hardcoded English — NOT translated (known convention violation) | |
| 20.8 | Switch the app language to Spanish and open the Initiate Service dialog | Dialog labels translate; toasts and "No type" fallback remain in English — document actual behaviour | |

---

## 21. Edge Cases & Boundary Conditions

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 21.1 | Open the Initiate Service dialog, fill the form, close without saving, then re-open | Form is completely reset (no service type selected, Description empty) | |
| 21.2 | Open the Finish Service dialog, fill fields, close, then re-open | Form is completely reset (Notes empty, Cost null, no attachments) | |
| 21.3 | Enter a negative cost value in the Finish dialog | The cost input rejects negative values (`[min]="0"`) — document actual behaviour | |
| 21.4 | Enter a very large cost value (e.g. 999999999) in the Finish dialog | The value is accepted or rejected — document actual behaviour | |
| 21.5 | Open the Finish dialog on an asset with no active maintenance of the expected type | The dialog either prevents opening or the PUT fails — document actual behaviour | |
| 21.6 | Verify the service type radio buttons only accept the four defined values | Only calibration, verification, unscheduled-maintenance, repair are selectable | |
| 21.7 | Initiate a service, then immediately try to initiate another | The "Initiate Service" button is disabled while a service is active | |

---

## 22. Permission & Security

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 22.1 | Verify the maintenance route is guarded by `permissionGuard` | A user without `asset-rosters/update` permission cannot access `/asset-roster/equipment/maintenance/:id` | |
| 22.2 | Verify the maintenance buttons inherit the page permission | There are no `*bifiAppHasPermission` directives on the maintenance buttons; access is gated by the parent route | |
| 22.3 | Verify a user with only `asset-rosters:read` permission cannot initiate/finish/skip | The maintenance page is blocked, so the dialogs are never reachable | |
| 22.4 | Verify the `POST /api/asset-maintenances` endpoint enforces authorization | A direct API call without permission is rejected by the backend | |
| 22.5 | Verify the `PUT /api/asset-maintenances/:id` endpoint enforces authorization | A direct API call without permission is rejected by the backend | |
| 22.6 | Verify the `PUT /api/asset-rosters/:id/skip-pm` endpoint enforces authorization | A direct API call without permission is rejected by the backend | |

---

## 23. Integration with Asset Roster List

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 23.1 | After initiating a service, navigate to the Asset Roster list | The asset's status column shows "Under Service" | |
| 23.2 | After finishing a service, navigate to the Asset Roster list | The asset's status column shows "Active" | |
| 23.3 | After initiating a PM, navigate to the Asset Roster list | The asset's status column shows "In PM" | |
| 23.4 | After finishing a PM, navigate to the Asset Roster list | The asset's status column shows "Active" | |
| 23.5 | After skipping a PM, navigate to the Asset Roster list | The asset's status column shows "Active" — document actual behaviour | |
| 23.6 | Use the status filter cards on the Asset Roster list | Filtering by "Under Service" shows only assets with an active service; filtering by "In PM" shows only assets with an active PM | |
