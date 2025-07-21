import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'bifi-app-form-actions',
  imports: [MatButtonModule],
  templateUrl: './form-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActions {
  isSubmitting = input<boolean>();
  formDisabled = input<boolean>();

  cancelClicked = output<void>();
}
