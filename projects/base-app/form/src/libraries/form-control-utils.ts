import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs';

export function isFormControlInvalid(control: AbstractControl) {
  return control.status === 'INVALID' && control.dirty;
}

export function formRawValueSignal<T extends AbstractControl>(
  control: T
): Signal<ReturnType<T['getRawValue']>> {
  return toSignal(control.valueChanges.pipe(map(() => control.getRawValue())));
}
