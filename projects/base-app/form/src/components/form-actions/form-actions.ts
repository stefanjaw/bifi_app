import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-form-actions',
  imports: [ButtonModule],
  templateUrl: './form-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActions {
  isSubmitting = input<boolean>();
  formDisabled = input<boolean>();
  position = input<'start' | 'end'>('end');

  cancelClicked = output<void>();

  cancelLabel = input<string>();
  saveLabel = input<string>();
}
