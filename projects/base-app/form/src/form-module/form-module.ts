import { NgModule } from '@angular/core';
import { FormActions } from '../components/form-actions/form-actions';
import { FormError } from '../components/form-error/form-error';
import { FormField } from '../components/form-field/form-field';
import { FormUploader } from '../components/form-image-uploader/form-uploader';
import { FormLabel } from '../components/form-label/form-label';
import { FormLayout } from '../components/form-layout/form-layout';
import { FormNavigator } from '../components/form-navigator/form-navigator';
import { FormPreview } from '../components/form-preview/form-preview';
import { FormSection } from '../components/form-section/form-section';
import { Hint } from '../components/hint/hint';
import { FormActionsHandler } from '../directives/form-actions-handler';
import { FormControlExtension } from '../directives/form-control-extension';
import { TranslatedErrors } from '../directives/translated-errors';
import { FormSelectFooter } from '../components/form-select-footer/form-select-footer';
import { FormSelectNavigateFooter } from '../components/form-select-navigate-footer/form-select-navigate-footer';

@NgModule({
  imports: [
    FormActions,
    FormError,
    FormField,
    FormUploader,
    FormLabel,
    FormLayout,
    FormNavigator,
    FormPreview,
    FormSection,
    Hint,
    FormActionsHandler,
    FormControlExtension,
    TranslatedErrors,
    FormSelectFooter,
    FormSelectNavigateFooter,
  ],
  exports: [
    FormActions,
    FormError,
    FormField,
    FormUploader,
    FormLabel,
    FormLayout,
    FormNavigator,
    FormPreview,
    FormSection,
    Hint,
    FormActionsHandler,
    FormControlExtension,
    TranslatedErrors,
    FormSelectFooter,
    FormSelectNavigateFooter,
  ],
})
export class FormModule {}
