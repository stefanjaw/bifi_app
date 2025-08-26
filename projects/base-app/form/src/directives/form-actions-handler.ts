/* eslint-disable @angular-eslint/directive-selector */
import { DestroyRef, Directive, effect, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FormValueState } from '../interfaces/form-helpers';
import { getFormGroupDirtyValue, markAsDirty } from '../libraries/dirty-utils';
import { ToastManager } from '@avalantec/base-app/core';
import { FormContext } from '../services/form-context';

@Directive({
  providers: [FormContext],
  selector: '[bifiAppFormActionsHandler]',
})
export class FormActionsHandler<TForm extends FormGroup> implements OnInit {
  private formContext = inject(FormContext, { self: true });
  private group = inject(FormGroupDirective, { self: true });
  private destroy$ = inject(DestroyRef);
  private toastManager = inject(ToastManager);

  isPreviewMode = input<boolean>(false);
  appSubmit = output<FormValueState<TForm>>();

  get form() {
    return this.group.form;
  }

  constructor() {
    this.group.ngSubmit.pipe(takeUntilDestroyed(this.destroy$)).subscribe(() => this.submit());

    effect(() => {
      // Sync the form context preview mode with the input
      this.formContext.isPreviewMode.set(this.isPreviewMode());
    });
  }

  ngOnInit(): void {
    // Set the form context form
    this.formContext.form.set(this.group);
  }

  /**
   * Submit the form.
   *
   * Emits the appSubmit event with a FormValueState containing the form's value, dirty value, and raw value.
   *
   * If the form is invalid, marks invalid form controls as dirty (display errors)
   */
  private submit() {
    if (!this.form.dirty) {
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
      console.log(this.form);
      this.toastManager.showError('The form contains errors.');

      // Helper function to mark invalid form controls as dirty (display errors)
      markAsDirty({
        group: this.form,
        target: 'invalid',
      });
    }
  }
}
