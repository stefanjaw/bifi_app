import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormControlState,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { FormGroupLike } from './form-helpers';
import { IsPlainObject } from '@avalantec/base-app/core';

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ControlsOf<T extends FormGroupLike> = Prettify<{
  [K in keyof T]-?: T[K] extends AbstractControl
    ? T[K]
    : Required<T[K]> extends (infer R)[]
      ? FArray<R>
      : IsPlainObject<Required<T[K]>> extends true
        ? FormGroup<Required<ControlsOf<T[K]>>>
        : FormControl<T[K]>;
}>;

// export type InputControls<T extends FormGroupLike> = T extends FormGroupLike
//   ? Prettify<{
//       [K in keyof T]-?: Required<T[K]> extends (infer R)[]
//         ? IFArray<R>
//         : IsPlainObject<Required<T[K]>> extends true
//           ? Required<InputControls<T[K]>>
//           : PermissiveControlConfig<T[K]>;
//     }>
//   : T extends (infer R)[]
//     ? IFArray<R>
//     : PermissiveControlConfig<T>;

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
export type FArray<R> = R extends FormGroupLike
  ? FormArray<FormGroup<ControlsOf<R>>>
  : FormArray<FormControl<R>>;

export type IFArray<R> = R extends FormGroupLike
  ? {
      template: InputControls<R>;
      formArrayElements: R[];
    }
  : {
      template: PermissiveControlConfig<R>;
      formArrayElements: R[];
    };

// A Permissive control config (an array with a value and validators)
export type PermissiveControlConfig<T> = (T | FormControlState<T> | ValidatorConfig)[];

// Possible validator configs
type ValidatorConfig = ValidatorFn | AsyncValidatorFn | ValidatorFn[] | AsyncValidatorFn[];

type Required<T> = T extends null | undefined ? never : T;
