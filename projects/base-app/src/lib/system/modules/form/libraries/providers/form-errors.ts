import { InjectionToken } from '@angular/core';
import { FormErrorMessages } from '@avalantec/base-app/system/modules/form/interfaces/form-errors';

/**
 * Default form error messages
 */
const defaultErrors: FormErrorMessages = {
  required: `This field is required`,
  minlength: ({ requiredLength }) =>
    `This field must be at least ${requiredLength} characters long.`,
  maxlength: ({ requiredLength }) =>
    `This field must not be longer than ${requiredLength} characters long.`,
  email: `Invalid email address.`,
  min: ({ min }) => `This field must be at least ${min}.`,
  max: ({ max }) => `This field must be at most ${max}.`,
  pattern: () => `Invalid format.`,
  null: `This field is required.`,
};

/**
 * Injection token for form error messages
 */
export const FORM_ERROR_TRANSLATIONS = new InjectionToken<FormErrorMessages>(
  'FORM_ERRORS',
  {
    providedIn: 'root',
    factory: () => defaultErrors,
  },
);
