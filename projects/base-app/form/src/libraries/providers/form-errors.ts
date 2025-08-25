import { InjectionToken } from '@angular/core';
import { FormErrorMessages } from '../../interfaces/form-errors';

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
  passwordMatch: `Passwords do not match.`,
  arrayMinLength: ({ requiredLength }) => `This field must have at least ${requiredLength} items.`,
  arrayMaxLength: ({ requiredLength }) =>
    `This field must not have more than ${requiredLength} items.`,
};

/**
 * Injection token for form error messages
 */
export const FORM_ERROR_TRANSLATIONS = new InjectionToken<FormErrorMessages>('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});
