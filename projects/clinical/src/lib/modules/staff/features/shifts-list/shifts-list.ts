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
import { CrudShifts } from '../../services/crud-shifts';
import { shiftColumns } from '../../routes/staff-columns';
import { shiftFilters } from '../../routes/staff-filters';
import { shift } from '../../interfaces/staff';
import { ShiftFormDialog } from '../shift-form-dialog/shift-form-dialog';

@Component({
  selector: 'bifi-app-shifts-list',
  providers: [provideResourceManager(CrudShifts)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    ShiftFormDialog,
  ],
  templateUrl: './shifts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for shifts */
export class ShiftsList {
  private resourceManager = inject<ResourceManager<shift>>(ResourceManager);
  private crud = inject(CrudShifts);
  private destroy$ = inject(DestroyRef);

  columns = shiftColumns;
  filters = shiftFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(ShiftFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit(element: shift): void {
    this.formDialog().open(element);
  }

  onSaved(): void {
    this.data.reload();
  }

  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
