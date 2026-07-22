import { ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export class NonWhitespaceValidators {
  public static nonWhitespaceRequired: ValidatorFn = (control: AbstractControl) => {
    const requiredResult = Validators.required(control);
    if (requiredResult) return requiredResult;

    if (typeof control.value === 'string' && control.value.trim().length === 0) {
      return { nonWhitespaceRequired: true };
    }

    return null;
  };
}
