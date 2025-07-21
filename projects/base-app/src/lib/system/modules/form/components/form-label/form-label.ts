import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldContext } from '@avalantec/base-app/system/modules/form/services/form-field-context';

@Component({
  selector: 'bifi-app-form-label',
  imports: [MatTooltipModule, MatIconModule],
  host: {
    class: 'flex items-center gap-1',
  },
  templateUrl: './form-label.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLabel {
  protected readonly contextService = inject(FormFieldContext);

  tooltip = input<string>();
}
