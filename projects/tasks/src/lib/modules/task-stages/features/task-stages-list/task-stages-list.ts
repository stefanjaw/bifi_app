import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudTaskStages } from '../../services/crud-task-stages';
import { taskStage } from '../../interfaces/task-stage';
import { taskStageColumns } from '../../libraries/task-stage-columns';
import { taskStageFilters } from '../../libraries/task-stage-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-task-stages-list',
  providers: [provideResourceManager(CrudTaskStages)],
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './task-stages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStagesList {
  private resourceManager = inject<ResourceManager<taskStage>>(ResourceManager);
  private crudTaskStages = inject(CrudTaskStages);
  private destroy$ = inject(DestroyRef);

  columns = taskStageColumns;
  filters = taskStageFilters;
  stages = this.resourceManager.data;

  deleteStage(id: string) {
    this.crudTaskStages
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.stages.reload();
        },
      });
  }
}
