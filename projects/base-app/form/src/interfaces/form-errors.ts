/**
 * Defines an interface with Angular's base form validation error keys
 */
export interface FormErrorMessages {
  required: string;
  minlength: (error: {
    requiredLength: number;
    actualLength: number;
  }) => string;
  maxlength: (error: {
    requiredLength: number;
    actualLength: number;
  }) => string;
  email: string;
  min: (error: { min: number; actual: number }) => string;
  max: (error: { max: number; actual: number }) => string;
  pattern: (error: { requiredPattern: string; actualValue: string }) => string;
  [key: string]: string | ((error: any) => string);
}

export interface RawFormErrorMessages {
  required: string;
  minlength: string;
  maxlength: string;
  email: string;
  min: string;
  max: string;
  pattern: string;
  [key: string]: string;
}

export type ParamMap = Record<string, unknown>;
