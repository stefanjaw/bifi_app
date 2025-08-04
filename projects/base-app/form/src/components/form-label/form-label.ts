import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { FormFieldContext } from '../../services/form-field-context';
import { Icon } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-form-label',
  imports: [TooltipModule, Icon],
  host: {
    class: 'flex items-center gap-1',
  },
  templateUrl: './form-label.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLabel {
  protected readonly contextService = inject(FormFieldContext);

  tooltip = input<string>();

  controlId = this.contextService.controlId;
}
