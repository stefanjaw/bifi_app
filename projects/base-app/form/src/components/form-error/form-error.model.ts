import { FormErrorMessages } from '../../interfaces/form-errors';

export type FormErrorComponentValidationErrorsValue =
  | Partial<FormErrorMessages>
  | (() => Partial<FormErrorMessages>);
