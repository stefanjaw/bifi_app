/* eslint-disable @angular-eslint/directive-selector */
import { DestroyRef, Directive, effect, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FormValueState } from '../interfaces/form-helpers';
import { collectFormErrors, getFormGroupDirtyValue, markAsDirty } from '../libraries/dirty-utils';
import { ToastManager } from '@avalantec/base-app/core';
import { TranslationService } from '@avalantec/base-app/i18n';
import { FormContext } from '../services/form-context';
import { FormTranslation } from '../services/form-translation';

@Directive({
  providers: [FormContext],
  selector: '[bifiAppFormActionsHandler]',
})
export class FormActionsHandler<TForm extends FormGroup> implements OnInit {
  private formContext = inject(FormContext, { self: true });
  private group = inject(FormGroupDirective, { self: true });
  private destroy$ = inject(DestroyRef);
  private toastManager = inject(ToastManager);
  private formTranslation = inject(FormTranslation);
  private translationService = inject(TranslationService);

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
   * and shows a toast with specific field-level error messages.
   */
  private submit() {
    if (!this.form.dirty) {
      this.toastManager.showInfo(
        this.translationService.translate('formActions.noChanges', {}, 'base-app/form')
      );
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
      const MAX_SHOWN = 3;
      const fieldErrors = collectFormErrors(this.form);
      const shown = fieldErrors.slice(0, MAX_SHOWN);
      const extra = fieldErrors.length - MAX_SHOWN;

      const lines = shown.map(({ label, errorKey, errorParams }) => {
        const msg =
          this.formTranslation.getErrorMessage({ errorKey, params: errorParams }) ?? errorKey;
        return `${label}: ${msg}`;
      });

      if (extra > 0) {
        lines.push(`+${extra} more`);
      }

      const description = lines.length > 0 ? lines.join('\n') : undefined;

      this.toastManager.showError(
        this.translationService.translate('formActions.formErrors', {}, 'base-app/form'),
        { description }
      );

      // Mark invalid form controls as dirty to surface inline errors
      markAsDirty({
        group: this.form,
        target: 'invalid',
      });
    }
  }
}
