import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { GanttViewMode } from '../../interfaces/gantt';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-gantt-switcher',
  imports: [TranslatePipe],
  templateUrl: './gantt-switcher.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttSwitcher {
  mode = model<GanttViewMode>('Week');
}
