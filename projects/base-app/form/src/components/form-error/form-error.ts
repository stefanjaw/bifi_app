import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { ControlContainer, NgControl, ValidationErrors } from '@angular/forms';
import { FormErrorComponentValidationErrorsValue } from './form-error.model';
import { distinctUntilChanged, map } from 'rxjs';
import { FormFieldContext } from '../../services/form-field-context';
import { FormTranslation } from '../../services/form-translation';

@Component({
  selector: 'bifi-app-form-error',
  standalone: true,
  host: { class: 'text-red-400' },
  template: ` {{ error() }} `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormError {
  private formTranslationService = inject(FormTranslation);
  private context = inject(FormFieldContext, { optional: true });

  // Inject the NgControl (FormControl) or ControlContainer (FormGroup, FormArray) to be used if no form field context is provided or if the context does not provide a form control
  controlContainer = inject(ControlContainer, { optional: true });
  ngControl = inject(NgControl, { optional: true });

  // Signal that holds the custom error messages, this can be a callback function that takes the form control as an argument or a static object
  customErrorTranslations = model<FormErrorComponentValidationErrorsValue | undefined>(undefined);

  // Signal that holds the error message
  error = signal<string>('');

  constructor() {
    effect(onCleanup => {
      // Get the abstract control
      const absControl = this.controlContainer || this.ngControl || this.context?.abstractControl();

      // Get the custom error messages
      const customMessageTranslations = this.customErrorTranslations();

      // If there is no abstract control or no control, return
      if (!absControl || !absControl.control) {
        return;
      }

      // Refresh error state when reloading effect dependencies
      this.refreshErrorState(absControl.control.errors, customMessageTranslations);

      const control = absControl.control;

      /**
       * Subscribe to the statusChanges of the control and refresh the error state when the status changes & the errors object changes
       */
      const subscription = control.statusChanges
        .pipe(
          map(() => control.errors),
          distinctUntilChanged()
        )
        .subscribe(controlErrors => {
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
    customMessageTranslations: FormErrorComponentValidationErrorsValue | undefined
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
