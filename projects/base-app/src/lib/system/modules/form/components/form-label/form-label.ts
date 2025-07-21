import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Icon } from '@avalantec/base-app/system/directives/icon';
import { FormFieldContext } from '@avalantec/base-app/system/modules/form/services/form-field-context';
import { TooltipModule } from 'primeng/tooltip';

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
}
