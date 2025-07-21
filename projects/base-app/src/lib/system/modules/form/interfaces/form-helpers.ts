import { AbstractControl, FormGroup } from '@angular/forms';

export type FormValue<T extends AbstractControl<unknown>> = T['value'];
export type FormRawValue<T extends AbstractControl<unknown>> = ReturnType<
  T['getRawValue']
>;

/** The state of a form, including its value, dirty value, and raw value. */
export interface FormValueState<T extends FormGroup> {
  /** The value of the form controls */
  value: FormValue<T>;
  /** The value of the form controls that have been marked as dirty (modified by the user) */
  dirtyValue: FormValue<T>;
  /** The raw value of the form controls */
  rawValue: FormRawValue<T>;
}
