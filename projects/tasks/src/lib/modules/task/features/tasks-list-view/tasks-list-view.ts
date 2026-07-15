import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ganttTask } from '../../interfaces/task-gantt';
import { ButtonsActions, GanttNode, TreeList } from '@avalantec/base-app/resource';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';
import { TooltipModule } from 'primeng/tooltip';
import { LocaleDatePipe, TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-tasks-list-view',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    HasPermission,
    ButtonsActions,
    TreeList,
    LocaleDatePipe,
    TranslatePipe,
  ],
  templateUrl: './tasks-list-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListView {
  tasks = input<GanttNode<ganttTask>[]>([]);
  itemReorder = output<{ id: string; targetId: string; mode: 'before' | 'after' }>();
  itemReparent = output<{ id: string; parentId: string }>();

  protected tasksMaintenanceContext = inject(TasksMaintenanceContext);
  private translationService = inject(TranslationService);

  formatPriority(priority: string | undefined): string {
    if (!priority) return '\u2014';
    return this.translationService.translate('priority.' + priority, {}, 'tasks');
  }
}
