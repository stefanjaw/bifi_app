import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { GanttViewMode } from '../../interfaces/gantt';

@Component({
  selector: 'bifi-app-gantt-switcher',
  imports: [],
  templateUrl: './gantt-switcher.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttSwitcher {
  mode = model<GanttViewMode>('Week');
}
