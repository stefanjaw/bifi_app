import { AbstractControl } from '@angular/forms';

/** A JS record object */
export type FormGroupLike = Record<string, any>;
export type AllPartial<T> = {
  [P in keyof T]?: T[P] extends FormGroupLike
    ? AllPartial<T[P]>
    : T[P] extends (infer U)[]
      ? AllPartial<U>[]
      : T[P];
};

export type FormValue<T extends AbstractControl<unknown>> = T['value'];
export type FormModelValue<T extends FormGroupLike> = AllPartial<T>;

export type FormRawValue<T extends AbstractControl<unknown>> = ReturnType<T['getRawValue']>;
export type FormModelRawValue<T extends FormGroupLike> = T;

/** The state of a form, including its value, dirty value, and raw value. */
export interface FormValueState<T extends AbstractControl<unknown> | FormGroupLike> {
  /** The value of the form controls */
  value: T extends AbstractControl ? FormValue<T> : FormModelValue<T>;
  /** The value of the form controls that have been marked as dirty (modified by the user) */
  dirtyValue: T extends AbstractControl ? FormValue<T> : FormModelValue<T>;
  /** The raw value of the form controls */
  rawValue: T extends AbstractControl ? FormRawValue<T> : FormModelRawValue<T>;
}
