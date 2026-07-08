import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ganttProject } from '../../interfaces/project-gantt';
import { ButtonsActions, GanttNode, TreeList } from '@avalantec/base-app/resource';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HasPermission } from '@avalantec/base-app/auth';
import { LocaleDatePipe, TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-projects-list-view',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    ButtonsActions,
    HasPermission,
    TreeList,
    LocaleDatePipe,
    TranslatePipe,
  ],
  templateUrl: './projects-list-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListView {
  private translationService = inject(TranslationService);

  projects = input<GanttNode<ganttProject>[]>([]);
  expandToggle = output<string>();
  editProject = output<string>();
  viewTasks = output<string>();
  deleteProject = output<string>();
  addSubitem = output<string>();
  itemReorder = output<{ id: string; targetId: string; mode: 'before' | 'after' }>();
  itemReparent = output<{ id: string; parentId: string }>();

  formatPriority(priority: string | undefined): string {
    if (!priority) return '—';
    return this.translationService.translate('priority.' + priority, {}, 'projects');
  }
}
