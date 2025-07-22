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

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ControlsOf<T extends FormGroupLike> = {
  [K in keyof T]-?: T[K] extends AbstractControl
    ? T[K]
    : Required<T[K]> extends (infer R)[]
      ? FArray<R>
      : Required<T[K]> extends Record<string, any>
        ? FormGroup<Required<ControlsOf<T[K]>>>
        : FormControl<T[K]>;
};

export type InputControls<T extends FormGroupLike> = Prettify<{
  [K in keyof T]-?: T[K] extends AbstractControl
    ? T[K]
    : Required<T[K]> extends (infer R)[]
      ? IFArray<R>
      : Required<T[K]> extends Record<string, any>
        ? Required<InputControls<T[K]>>
        : PermissiveControlConfig<T[K]>;
}>;

// An array of controls, if R is a record object, then it creates a form group, else it creates a normal control that is not nullable.
export type FArray<R> = FormArray<
  R extends Record<any, any> ? FormGroup<ControlsOf<R>> : FormControl<R>
>;

export type IFArray<R> = R extends FormGroupLike ? R[] : R[];

// A Permissive control config (an array with a value and validators)
export type PermissiveControlConfig<T> = (T | FormControlState<T> | ValidatorConfig)[];

// Possible validator configs
type ValidatorConfig = ValidatorFn | AsyncValidatorFn | ValidatorFn[] | AsyncValidatorFn[];

type Required<T> = T extends null | undefined ? never : T;
