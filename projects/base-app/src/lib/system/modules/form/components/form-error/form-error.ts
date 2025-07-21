import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FormErrorComponentValidationErrorsValue } from '@avalantec/base-app/system/modules/form/components/form-error/form-error.model';
import { FormFieldContext } from '@avalantec/base-app/system/modules/form/services/form-field-context';
import { FormTranslation } from '@avalantec/base-app/system/modules/form/services/form-translation';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'bifi-app-form-error',
  standalone: true,
  host: { class: 'text-destructive' },
  template: ` {{ error() }} `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormError {
  private formTranslationService = inject(FormTranslation);
  private context = inject(FormFieldContext, { optional: true });

  // Signal that holds the custom error messages, this can be a callback function that takes the form control as an argument or a static object
  customErrorTranslations = model<
    FormErrorComponentValidationErrorsValue | undefined
  >(undefined);

  // Signal that holds the error message
  error = signal<string>('');

  constructor() {
    effect((onCleanup) => {
      const ngControl = this.context!.ngControl();
      const customMessageTranslations = this.customErrorTranslations();

      if (!ngControl || !ngControl.control) {
        return;
      }

      // Refresh error state when reloading effect dependencies
      this.refreshErrorState(
        ngControl.control.errors,
        customMessageTranslations,
      );

      const control = ngControl.control;

      /**
       * Subscribe to the statusChanges of the control and refresh the error state when the status changes & the errors object changes
       */
      const subscription = control.statusChanges
        .pipe(
          map(() => control.errors),
          distinctUntilChanged(),
        )
        .subscribe((controlErrors) => {
          this.refreshErrorState(controlErrors, customMessageTranslations);
        });

      // When the effect destroys, unsubscribe
      onCleanup(() => subscription.unsubscribe());
    });
  }

  /**
   * Refreshes the error state of the form error component by getting the first error key from the control errors
   * and checking if it exists in the custom message translations. If it does, it uses that message, otherwise it
   * uses the fallback error messages from the form translation service.
   *
   * @param controlErrors the errors object of the form control
   * @param customMessageTranslations the custom message translations
   */
  private refreshErrorState(
    controlErrors: ValidationErrors | null,
    customMessageTranslations:
      | FormErrorComponentValidationErrorsValue
      | undefined,
  ) {
    if (controlErrors) {
      // If the message translations are a callback, call it, otherwise use the static object
      const customMessages =
        typeof customMessageTranslations === 'function'
          ? customMessageTranslations()
          : customMessageTranslations;

      // Get the first error key
      const firstKey = Object.keys(controlErrors)[0];

      let error: string | null = null;

      // Check if the key exists in the custom messages
      if (customMessages?.[firstKey]) {
        // If the key exists in the custom messages, check if it's a string or a function
        const getErrorMessage = customMessages?.[firstKey];

        if (typeof getErrorMessage === 'string') {
          error = getErrorMessage;
        } else if (typeof getErrorMessage === 'function') {
          const params = controlErrors[firstKey];
          error = getErrorMessage(params);
        }
      }

      if (!error) {
        // Use fallback error messages
        error = this.formTranslationService.getErrorMessage({
          errorKey: firstKey,
          params: controlErrors[firstKey],
        });
      }

      if (!error) {
        console.log('No error message provided for key', firstKey);
      } else {
        this.error.set(error);
      }
    } else {
      this.error.set('');
    }
  }

  updateCustomErrors(errors: FormErrorComponentValidationErrorsValue) {
    this.customErrorTranslations.set(errors);
  }
}
