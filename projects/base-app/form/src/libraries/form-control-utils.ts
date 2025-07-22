import { AbstractControl } from '@angular/forms';

export function isFormControlInvalid(control: AbstractControl) {
  return control.status === 'INVALID' && control.dirty;
}
