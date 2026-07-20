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
import { CrudInterventions } from '../../services/crud-interventions';
import { interventionColumns } from '../../routes/care-plan-columns';
import { interventionFilters } from '../../routes/care-plan-filters';
import { intervention } from '../../interfaces/care-plan';
import { InterventionFormDialog } from '../intervention-form-dialog/intervention-form-dialog';

/** List component for interventions */
@Component({
  selector: 'bifi-app-interventions-list',
  providers: [provideResourceManager(CrudInterventions)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    InterventionFormDialog,
  ],
  templateUrl: './interventions-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionsList {
  private resourceManager = inject<ResourceManager<intervention>>(ResourceManager);
  private crud = inject(CrudInterventions);
  private destroy$ = inject(DestroyRef);

  columns = interventionColumns;
  filters = interventionFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(InterventionFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: intervention): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
