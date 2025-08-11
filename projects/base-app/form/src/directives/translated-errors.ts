/* eslint-disable @angular-eslint/directive-selector */
import { Directive, effect, inject, input } from '@angular/core';
import { FormError } from '../components/form-error/form-error';
import { FormFieldContext } from '../services/form-field-context';
import { FormErrorMessages } from '../interfaces/form-errors';

@Directive({
  selector: '[bifiAppTranslatedErrors]',
})
export class TranslatedErrors {
  // Inject the parent component and the context service to get the form control
  private parent = inject(FormError, { optional: true });
  private context = inject(FormFieldContext, { optional: true });

  //  Dynamic translation with a prefix and error keys
  prefix = input<string>();
  translateFn = input<(key: string, params?: Record<string, unknown>) => string>();
  constructor() {
    if (!this.parent) {
      throw new Error('appTranslatedErrors must be used inside app-form-error');
    }

    if (!this.context) {
      throw new Error('appTranslatedErrors must be used inside app-form-field');
    }

    effect(() => {
      const control = this.context?.abstractControl();
      if (!control) {
        return;
      }

      // Dynamic translation
      const prefix = this.prefix();

      // The path to the error messages
      const path = `${prefix?.length ? prefix + '.' : ''}${control.name}.errors`;
      const translateFn = this.translateFn();

      if (translateFn) {
        // Use error messages from dynamic translation, we use a callback to generate the error messages dynamically
        this.parent!.updateCustomErrors(() => {
          // This code will be executed each time the form control checks for error messages
          const data: Partial<FormErrorMessages> = {};
          if (control.errors) {
            for (const errorKey in control.errors) {
              data[errorKey] = params => {
                const key = `${path}.${errorKey}`;
                const translation = translateFn(key, params);

                // When transloco does not find a translation, it returns the same key as the value
                // Example abc.error if not found will return abc.error
                // If the translation includes the key (was not found), return null as the component will use a default message
                if (translation.includes(key)) {
                  return null!;
                } else return translation;
              };
            }
          }

          return data;
        });
      } else {
        throw new Error(
          'appTranslatedErrors must be used with either prefix & translateFn or customErrorMessages'
        );
      }
    });
  }
}
