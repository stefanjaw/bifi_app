import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
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

  const toggle = (control: AbstractControl) => {
    if (dirtyValue) {
      control.markAsDirty({ onlySelf: true, emitEvent });
      control.markAsTouched({ onlySelf: true, emitEvent });
    } else {
      control.markAsPristine({ onlySelf: true, emitEvent });
      control.markAsUntouched({ onlySelf: true, emitEvent });
    }
  };

  const walk = (control: AbstractControl) => {
    // Skip valid controls if target === 'invalid'
    if (target === 'invalid' && control.valid) {
      return;
    }

    toggle(control);

    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(walk);
    }

    if (control instanceof FormArray) {
      control.controls.forEach(walk);
    }
  };

  walk(group);
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

export interface FormErrorEntry {
  label: string;
  errorKey: string;
  errorParams: any;
}

/**
 * Converts a camelCase string to Title Case with spaces.
 * E.g. "firstName" → "First Name", "roles" → "Roles"
 */
function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

/**
 * Collects the first validation error for each invalid control in a FormGroup,
 * returning a human-readable label alongside the error key and params.
 *
 * Rules:
 * - If a control has its own errors, those are captured and its children are NOT visited.
 * - FormArray children are not descended into — only array-level errors are captured
 *   (e.g. arrayMinLength set on the FormArray itself).
 * - Nested FormGroups are recursed into when they have no own errors.
 *
 * @param group - The root FormGroup to inspect.
 * @returns An array of error entries, one per invalid control (up to one error per control).
 */
export function collectFormErrors(group: FormGroup): FormErrorEntry[] {
  const errors: FormErrorEntry[] = [];

  const walk = (control: AbstractControl, label: string) => {
    if (control.valid) return;

    if (control.errors) {
      const firstKey = Object.keys(control.errors)[0];
      errors.push({ label, errorKey: firstKey, errorParams: control.errors[firstKey] });
      return;
    }

    if (control instanceof FormArray) {
      return;
    }

    if (control instanceof FormGroup) {
      for (const [key, child] of Object.entries(control.controls)) {
        walk(child, toTitleCase(key));
      }
    }
  };

  for (const [key, child] of Object.entries(group.controls)) {
    walk(child, toTitleCase(key));
  }

  return errors;
}
