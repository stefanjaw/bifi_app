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
import { CrudMaritalStatuses } from '../../services/crud-marital-statuses';
import { maritalStatusColumns } from '../../routes/settings-columns';
import { maritalStatusFilters } from '../../routes/settings-filters';
import { maritalStatus } from '../../interfaces/settings';
import { MaritalStatusFormDialog } from '../marital-status-form-dialog/marital-status-form-dialog';

/** List component for marital statuses */
@Component({
  selector: 'bifi-app-marital-statuses-list',
  providers: [provideResourceManager(CrudMaritalStatuses)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    MaritalStatusFormDialog,
  ],
  templateUrl: './marital-statuses-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaritalStatusesList {
  private resourceManager = inject<ResourceManager<maritalStatus>>(ResourceManager);
  private crud = inject(CrudMaritalStatuses);
  private destroy$ = inject(DestroyRef);

  columns = maritalStatusColumns;
  filters = maritalStatusFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(MaritalStatusFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: maritalStatus): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes a marital status record after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
