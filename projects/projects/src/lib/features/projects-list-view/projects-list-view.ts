import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ganttProject } from '../../interfaces/project-gantt';
import { ButtonsActions, GanttNode } from '@avalantec/base-app/resource';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-projects-list-view',
  imports: [CommonModule, ButtonModule, TooltipModule, ButtonsActions, HasPermission],
  templateUrl: './projects-list-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListView {
  projects = input<GanttNode<ganttProject>[]>([]);
  expandToggle = output<string>();
  editProject = output<string>();
  viewTasks = output<string>();
  deleteProject = output<string>();

  formatPriority(priority: string | undefined): string {
    if (!priority) return '—';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
}
