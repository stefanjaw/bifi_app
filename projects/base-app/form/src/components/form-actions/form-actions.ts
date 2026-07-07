import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-form-actions',
  imports: [ButtonModule, TranslatePipe],
  templateUrl: './form-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActions {
  isSubmitting = input<boolean>();
  formDisabled = input<boolean>();
  position = input<'start' | 'end'>('end');

  submitClicked = output<void>();
  cancelClicked = output<void>();

  cancelLabel = input<string>('goBack');
  saveLabel = input<string>();
  scope = input('base-app/form');

  showCancel = input<boolean>(true);
  showSave = input<boolean>(true);

  formChanged = input.required<boolean>();
}
