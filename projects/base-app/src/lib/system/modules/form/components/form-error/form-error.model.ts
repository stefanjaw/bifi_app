import { FormErrorMessages } from '@avalantec/base-app/system/modules/form/interfaces/form-errors';

export type FormErrorComponentValidationErrorsValue =
  | Partial<FormErrorMessages>
  | (() => Partial<FormErrorMessages>);
