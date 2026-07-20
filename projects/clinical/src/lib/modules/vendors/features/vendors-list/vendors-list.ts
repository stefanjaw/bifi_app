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
import { CrudVendors } from '../../services/crud-vendors';
import { vendorColumns } from '../../routes/vendors-columns';
import { vendorFilters } from '../../routes/vendors-filters';
import { vendor } from '../../interfaces/vendors';
import { SelectContactDialog } from '../../../../shared/select-contact-dialog/select-contact-dialog';
import { VendorFormDialog } from '../vendor-form-dialog/vendor-form-dialog';
import { contact } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-vendors-list',
  providers: [provideResourceManager(CrudVendors)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    SelectContactDialog,
    VendorFormDialog,
  ],
  templateUrl: './vendors-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for vendors */
export class VendorsList {
  private resourceManager = inject<ResourceManager<vendor>>(ResourceManager);
  private crud = inject(CrudVendors);
  private destroy$ = inject(DestroyRef);

  columns = vendorColumns;
  filters = vendorFilters;
  data = this.resourceManager.data;
  contactPicker = viewChild.required(SelectContactDialog);
  formDialog = viewChild.required(VendorFormDialog);

  addNew(): void {
    this.contactPicker().open('vendor');
  }

  onContactSelected(c: contact): void {
    this.formDialog().open(undefined, c);
  }

  gotoEdit(element: vendor): void {
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
