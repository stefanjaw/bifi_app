import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { CrudStaff } from '../../services/crud-staff';
import { staffColumns } from '../../routes/staff-columns';
import { staffFilters } from '../../routes/staff-filters';
import { staff } from '../../interfaces/staff';
import { SelectContactDialog } from '../../../../shared/select-contact-dialog/select-contact-dialog';
import { StaffFormDialog } from '../staff-form-dialog/staff-form-dialog';
import { contact } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-staff-list',
  providers: [provideResourceManager(CrudStaff)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    SelectContactDialog,
    StaffFormDialog,
  ],
  templateUrl: './staff-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for staff members */
export class StaffList {
  private resourceManager = inject<ResourceManager<staff>>(ResourceManager);
  private crud = inject(CrudStaff);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);

  columns = staffColumns;
  filters = staffFilters;
  data = this.resourceManager.data;
  contactPicker = viewChild.required(SelectContactDialog);
  formDialog = viewChild.required(StaffFormDialog);

  addNew(): void {
    this.contactPicker().open('staff');
  }

  onContactSelected(c: contact): void {
    this.formDialog().open(undefined, c);
  }

  gotoEdit(element: staff): void {
    this.formDialog().open(element);
  }

  onFormSaved(): void {
    this.data.reload();
  }

  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
