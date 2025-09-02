import { AbstractControl, FormGroup } from '@angular/forms';
import { FormValue } from '../interfaces/form-helpers';

interface MarkAsDirtyOptions {
  /** The FormGroup to mark as dirty */
  group: FormGroup;
  /**  Whether to target all controls or only invalid controls */
  target?: 'all' | 'invalid';
  /** Whether to mark the form group as dirty */
  dirtyValue?: boolean;
  emitEvent?: boolean;
}

/**
 * Marks all controls in a FormGroup and any nested FormGroups as dirty.
 * This will trigger the dirty event on all controls, and is useful for
 * resetting a form to a dirty state after it has been reset or initially
 * loaded.
 *
 * @param group - The FormGroup whose controls should be marked as dirty.
 */
export function markAsDirty(params: MarkAsDirtyOptions) {
  const { group, target = 'all', dirtyValue = true, emitEvent = true } = params;

  /**
   * Helper function to mark all form controls as dirty or pristine depending on the dirtyValue
   */
  const toggleFunction = (control: AbstractControl) =>
    dirtyValue
      ? control.markAsDirty({
          onlySelf: true,
          emitEvent,
        })
      : control.markAsPristine({
          onlySelf: true,
          emitEvent,
        });

  // Toggle the dirty state of the form group
  toggleFunction(group);

  for (const control of Object.keys(group.controls)) {
    const child = group.get(control)!;

    // Skip if the target is 'invalid' and the control is valid
    if (target === 'invalid' && child.valid) continue;

    if (child instanceof FormGroup) {
      // Recursively mark all controls in nested form groups as dirty
      markAsDirty({ group: child, target, dirtyValue, emitEvent });
    } else {
      toggleFunction(child);
    }
  }
}

/**
 * Retrieves the values of all controls within a FormGroup that have been marked as dirty.
 * This function traverses the form group recursively, including nested form groups,
 * and constructs an object that mirrors the structure of the original form group, but
 * only includes values from controls that are dirty.
 *
 * @template T - The type of the FormGroup.
 * @param group - The FormGroup from which to extract the dirty values.
 * @returns A FormDirtyValue object with the same structure as the provided FormGroup,
 *          containing only the values of controls that have been marked as dirty.
 */

export function getFormGroupDirtyValue<T extends FormGroup>(group: FormGroup): FormValue<T> {
  const dirtyValue: FormValue<T> = {};
  for (const control of Object.keys(group.controls)) {
    const child = group.get(control);
    if (!child!.dirty) continue;

    if (child instanceof FormGroup) {
      dirtyValue[control] = getFormGroupDirtyValue(child);
    } else {
      dirtyValue[control] = child!.value;
    }
  }
  return dirtyValue;
}
