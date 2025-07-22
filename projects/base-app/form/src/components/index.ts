import { FormActions } from './form-actions/form-actions';
import { FormError } from './form-error/form-error';
import { FormField } from './form-field/form-field';
import { FormLabel } from './form-label/form-label';
import { FormLayout } from './form-layout/form-layout';
import { FormNavigator } from './form-navigator/form-navigator';
import { FormSection } from './form-section/form-section';
import { Hint } from './hint/hint';
import { FormActionsHandler } from '../directives/form-actions-handler';
import { FormControlExtension } from '../directives/form-control-extension';
import { TranslatedErrors } from '../directives/translated-errors';

export const AppFormExtensionsImports = [
  FormLayout,
  FormNavigator,
  FormSection,
  FormError,
  FormField,
  FormLabel,
  Hint,
  FormControlExtension,
  TranslatedErrors,
  FormActions,
  FormActionsHandler,
];
