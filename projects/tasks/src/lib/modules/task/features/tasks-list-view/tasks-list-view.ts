import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ganttTask } from '../../interfaces/task-gantt';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-tasks-list-view',
  imports: [CommonModule, ButtonModule],
  templateUrl: './tasks-list-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListView {
  tasks = input<ganttTask[]>([]);
  toggleExpand = output<string>();
  taskCreatedOrUpdated = output<void>();
}
