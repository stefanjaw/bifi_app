import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
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
import { RecurrentTaskFormDialog } from '../recurrent-task-form-dialog/recurrent-task-form-dialog';

/** List component for recurrent tasks */
@Component({
  selector: 'bifi-app-recurrent-tasks-list',
  providers: [provideResourceManager(CrudRecurrentTasks)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    RecurrentTaskFormDialog,
  ],
  templateUrl: './recurrent-tasks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecurrentTasksList {
  private resourceManager = inject<ResourceManager<recurrentTask>>(ResourceManager);
  private crud = inject(CrudRecurrentTasks);
  private destroy$ = inject(DestroyRef);

  columns = recurrentTaskColumns;
  filters = recurrentTaskFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(RecurrentTaskFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: recurrentTask): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a recurrent task after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
