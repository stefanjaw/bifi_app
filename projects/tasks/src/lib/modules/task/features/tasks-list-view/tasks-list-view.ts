import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ganttTask } from '../../interfaces/task-gantt';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'bifi-app-tasks-list-view',
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './tasks-list-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListView {
  tasks = input<ganttTask[]>([]);

  protected tasksMaintenanceContext = inject(TasksMaintenanceContext);

  formatPriority(priority: string | undefined): string {
    if (!priority) return '—';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
}
