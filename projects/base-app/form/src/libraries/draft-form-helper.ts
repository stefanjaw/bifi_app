import { effect, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormGroup } from '@angular/forms';
import { DraftService } from '../services/draft-service';
import { markAsDirty } from './dirty-utils';

function markDraftControlsDirty(form: FormGroup, draft: Record<string, unknown>): void {
  for (const key of Object.keys(draft)) {
    const control = form.get(key);
    if (!control) continue;
    if (control instanceof FormArray) {
      control.controls.forEach(c => {
        c.markAsDirty();
        if (c instanceof FormGroup) {
          markAsDirty({ group: c });
        }
      });
    } else if (control instanceof FormGroup) {
      markAsDirty({ group: control });
    } else {
      control.markAsDirty();
    }
  }
}

export interface AutoFormResult {
  draftRestored: Signal<boolean>;
}

/**
 * Sets up an effect that handles draft restoration for a form.
 *
 * - If a draft exists for the current URL: calls `beforePatch` (if provided),
 *   patches the form, marks it dirty, clears the draft, and blocks further
 *   data loading so the draft values are preserved.
 * - If no draft: calls `load(data)` when the data signal produces a value,
 *   or resets the form when data is undefined.
 *
 * @param form - The FormGroup to patch from the draft
 * @param router - Router (used to read the current URL as the draft key)
 * @param draftService - DraftService instance
 * @param data - Signal of the entity data (e.g. `resource.value`)
 * @param load - Called with the entity data when no draft exists
 * @param beforePatch - Optional callback invoked with the raw draft before
 *   `patchValue`. Use this to prepare the form array length (e.g. ensure
 *   `locationAssignments` has enough rows).
 * @returns An object exposing a `draftRestored` signal that is `true` once
 *   a draft has been successfully restored. Consumers can use this in
 *   separate effects (e.g. for post-restore data hydration).
 */
export function autoForm<T>(
  form: FormGroup,
  router: Router,
  draftService: DraftService,
  data: Signal<T | undefined>,
  load: (data: T) => void,
  beforePatch?: (draft: Record<string, unknown>) => void,
): AutoFormResult {
  const restored = signal(false);

  effect(() => {
    const current = data();

    if (!restored()) {
      const draft = draftService.getDraft(router.url);
      if (draft) {
        beforePatch?.(draft);
        form.patchValue(draft);
        markDraftControlsDirty(form, draft);
        draftService.clearDraft(router.url);
        restored.set(true);
        return;
      }
    }

    if (restored()) return;

    if (current) {
      load(current);
    } else {
      form.reset();
    }
  });

  return { draftRestored: restored };
}

/**
 * Navigates back to the returnUrl provided as a query parameter.
 *
 * If `returnUrl` and `controlName` are present (set by
 * `form-select-navigate-footer`), the created entity ID is written into the
 * parent form's draft via `DraftService.updateDraftField`. The
 * `isDraftNavigating` flag is set to bypass the DirtyFormGuard on the
 * parent route.
 *
 * When there is no returnUrl (direct navigation, not from a select footer),
 * navigates to the list route based on `isUpdate`.
 *
 * @param route - ActivatedRoute (reads `returnUrl` and `controlName` query params)
 * @param router - Router
 * @param draftService - DraftService instance
 * @param createdId - The ID of the newly created entity, if any
 * @param isUpdate - Whether the form is in edit mode (affects the fallback list route)
 */
export function navigateBack(
  route: ActivatedRoute,
  router: Router,
  draftService: DraftService,
  createdId?: string,
  isUpdate?: boolean,
): void {
  const returnUrl = route.snapshot.queryParamMap.get('returnUrl');
  const controlName = route.snapshot.queryParamMap.get('controlName');

  if (returnUrl) {
    if (createdId && controlName) {
      draftService.updateDraftField(returnUrl, controlName, createdId);
    }

    draftService.isDraftNavigating = true;
    router.navigateByUrl(returnUrl);
    return;
  }

  const listRoute = isUpdate ? '../../list' : '../list';
  router.navigate([listRoute], { relativeTo: route });
}
