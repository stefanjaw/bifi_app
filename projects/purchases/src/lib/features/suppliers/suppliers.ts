import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TableLayout } from '@avalantec/base-app/resource';
import { CrudSuppliers } from '../../services/crud-suppliers';
import { supplierColumns } from '../../libraries/supplier-columns';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bifi-app-suppliers',
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, RouterLink],
  templateUrl: './suppliers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Suppliers {
  private crudSuppliers = inject(CrudSuppliers);

  showAll = signal(false);
  supplierColumns = supplierColumns;

  searchParams = computed(() => this.showAll() ? { showAll: 'true' } : {});

  suppliersResource = this.crudSuppliers.getWithPagination({
    searchParams: this.searchParams,
    getInactive: null,
  });

  entries = this.suppliersResource;

  toggleShowAll() {
    this.showAll.update(v => !v);
  }
}
