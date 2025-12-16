import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ganttTask } from '../../interfaces/task-gantt';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TasksMaintenanceContext } from '../../services/tasks-maintenance-context';

@Component({
  selector: 'bifi-app-tasks-list-view',
  imports: [CommonModule, ButtonModule],
  templateUrl: './tasks-list-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListView {
  tasks = input<ganttTask[]>([]);

  // services
  protected tasksMaintenanceContext = inject(TasksMaintenanceContext);
}
