/* eslint-disable @angular-eslint/directive-selector */
import { DestroyRef, Directive, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FormValueState } from '../interfaces/form-helpers';
import { getFormGroupDirtyValue, markAsDirty } from '../libraries/dirty-utils';
import { ToastManager } from '@avalantec/base-app/core';

@Directive({
  selector: '[formGroup][bifiAppFormActionsHandler]',
})
export class FormActionsHandler<TForm extends FormGroup> {
  private group = inject(FormGroupDirective, { self: true });
  private destroy$ = inject(DestroyRef);
  private toastManager = inject(ToastManager);

  appSubmit = output<FormValueState<TForm>>();

  get form() {
    return this.group.form;
  }

  constructor() {
    this.group.ngSubmit.pipe(takeUntilDestroyed(this.destroy$)).subscribe(() => this.submit());
  }

  /**
   * Submit the form.
   *
   * Emits the appSubmit event with a FormValueState containing the form's value, dirty value, and raw value.
   *
   * If the form is invalid, marks invalid form controls as dirty (display errors)
   */
  private submit() {
    if (!this.form.touched) {
      this.toastManager.showInfo('You have not made any changes.');
      return;
    }

    if (this.form.valid) {
      const data: FormValueState<TForm> = {
        value: this.form.value,
        dirtyValue: getFormGroupDirtyValue(this.form),
        rawValue: this.form.getRawValue(),
      };

      this.appSubmit.emit(data);
    } else {
      this.toastManager.showError('There are errors in the form.');

      // Helper function to mark invalid form controls as dirty (display errors)
      markAsDirty({
        group: this.form,
        target: 'invalid',
      });
    }
  }
}
