import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  TableLayout,
  SearchBar,
  ButtonsActions,
  ResourceManager,
  provideResourceManager,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudRecurrentTasks } from '../../services/crud-recurrent-tasks';
import { recurrentTaskColumns } from '../../routes/clinical-tasks-columns';
import { recurrentTaskFilters } from '../../routes/clinical-tasks-filters';
import { recurrentTask } from '../../interfaces/recurrent-task';

@Component({
  selector: 'bifi-app-recurrent-tasks-list',
  providers: [provideResourceManager(CrudRecurrentTasks)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  templateUrl: './recurrent-tasks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for recurrent tasks */
export class RecurrentTasksList {
  private resourceManager = inject<ResourceManager<recurrentTask>>(ResourceManager);
  private crud = inject(CrudRecurrentTasks);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = recurrentTaskColumns;
  filters = recurrentTaskFilters;
  data = this.resourceManager.data;

  /** Deletes a recurrent task after confirmation */
  delete(id: string) {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.resourceManager.data.reload();
        },
      });
  }

  /** Navigates to the recurrent task edit form */
  gotoEdit = (element: recurrentTask) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
