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
import { CrudOutcomes } from '../../services/crud-outcomes';
import { outcomeColumns } from '../../routes/care-plan-columns';
import { outcomeFilters } from '../../routes/care-plan-filters';
import { outcome } from '../../interfaces/care-plan';
import { OutcomeFormDialog } from '../outcome-form-dialog/outcome-form-dialog';

/** List component for outcomes */
@Component({
  selector: 'bifi-app-outcomes-list',
  providers: [provideResourceManager(CrudOutcomes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    OutcomeFormDialog,
  ],
  templateUrl: './outcomes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomesList {
  private resourceManager = inject<ResourceManager<outcome>>(ResourceManager);
  private crud = inject(CrudOutcomes);
  private destroy$ = inject(DestroyRef);

  columns = outcomeColumns;
  filters = outcomeFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(OutcomeFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: outcome): void => {
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
