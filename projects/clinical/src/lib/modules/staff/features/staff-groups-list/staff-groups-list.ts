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
import { CrudStaffGroups } from '../../services/crud-staff-groups';
import { staffGroupColumns } from '../../routes/staff-columns';
import { staffGroupFilters } from '../../routes/staff-filters';
import { staffGroup } from '../../interfaces/staff';
import { StaffGroupFormDialog } from '../staff-group-form-dialog/staff-group-form-dialog';

@Component({
  selector: 'bifi-app-staff-groups-list',
  providers: [provideResourceManager(CrudStaffGroups)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    StaffGroupFormDialog,
  ],
  templateUrl: './staff-groups-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for staff groups */
export class StaffGroupsList {
  private resourceManager = inject<ResourceManager<staffGroup>>(ResourceManager);
  private crud = inject(CrudStaffGroups);
  private destroy$ = inject(DestroyRef);

  columns = staffGroupColumns;
  filters = staffGroupFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(StaffGroupFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit(element: staffGroup): void {
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
