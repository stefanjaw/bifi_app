import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormControlState,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { FormGroupLike } from './form-helpers';
import { IsPlainObject } from '@avalantec/base-app/core';
import { TypedFormArrayExtension } from '../libraries/extensions/extended-form-array';

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ControlsOf<T extends FormGroupLike, TUseExtendedArray = false> = Prettify<{
  [K in keyof T]-?: T[K] extends AbstractControl
    ? T[K]
    : Required<T[K]> extends (infer R)[]
      ? TUseExtendedArray extends true
        ? ExtendedArrayControls<R>
        : BaseArrayControls<R>
      : IsPlainObject<Required<T[K]>> extends true
        ? FormGroup<Required<ControlsOf<T[K]>>>
        : FormControl<T[K]>;
}>;

export type InputControls<T> = Prettify<
  IsPlainObject<Required<T>> extends true
    ? {
        [K in keyof T]-?: InputControls<T[K]>;
      }
    : Required<T> extends (infer R)[]
      ? IFArray<R>
      : PermissiveControlConfig<T>
>;

// An array of controls, if R is a record object, then it creates a form group, else it creates a normal control that is not nullable.
export type ExtendedArrayControls<R> = R extends FormGroupLike
  ? TypedFormArrayExtension<FormGroup<ControlsOf<R>>>
  : TypedFormArrayExtension<FormControl<R>>;

export type BaseArrayControls<R> = R extends FormGroupLike
  ? FormArray<FormGroup<ControlsOf<R>>>
  : FormArray<FormControl<R>>;

export type IFArray<R> = {
  formArrayElements: R[];
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
} & (R extends FormGroupLike
  ? {
      template: InputControls<R>;
    }
  : {
      template: PermissiveControlConfig<R>;
    });

// A Permissive control config (an array with a value and validators)
// export type PermissiveControlConfig<T> = (T | FormControlState<T> | ValidatorConfig)[];
export type PermissiveControlConfig<T> = [
  T | FormControlState<T>,
  (ValidatorFn | ValidatorFn[] | AbstractControlOptions | null)?,
  (AsyncValidatorFn | AsyncValidatorFn[] | null)?,
];

export type GroupReturn<T extends FormGroupLike> = FormGroup<ControlsOf<T, true>>;

type Required<T> = T extends null | undefined ? never : T;
