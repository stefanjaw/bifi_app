import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudTaskTypes } from '../../services/crud-task-types';
import { taskType } from '../../interfaces/task-type';
import { taskTypeColumns } from '../../libraries/task-type-columns';
import { taskTypeFilters } from '../../libraries/task-type-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-task-types-list',
  providers: [provideResourceManager(CrudTaskTypes)],
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, HasPermission, ButtonsActions],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './task-types-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTypesList {
  private resourceManager = inject<ResourceManager<taskType>>(ResourceManager);
  private crudTaskTypes = inject(CrudTaskTypes);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = taskTypeColumns;
  filters = taskTypeFilters;
  types = this.resourceManager.data;

  deleteType(id: string) {
    this.crudTaskTypes
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.types.reload();
        },
      });
  }

  gotoEditTaskType = (element: taskType) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
