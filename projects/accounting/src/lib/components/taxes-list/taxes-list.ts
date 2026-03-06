import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudTaxes } from '../../services/crud-taxes';
import { tax } from '../../interfaces/tax';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
  tableColumn,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

const taxColumns: tableColumn<tax>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'taxType', title: 'Type', type: 'text' },
  { field: 'percentage', title: 'Percentage (%)', type: 'number' },
  { field: 'active', title: 'Active', type: 'text' },
];

@Component({
  selector: 'bifi-app-taxes-list',
  providers: [provideResourceManager(CrudTaxes)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './taxes-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxesList {
  private resourceManager = inject<ResourceManager<tax>>(ResourceManager);
  private crudTaxes = inject(CrudTaxes);
  private destroy$ = inject(DestroyRef);

  columns = taxColumns;
  taxes = this.resourceManager.data;

  delete(id: string) {
    this.crudTaxes
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.taxes.reload(); } });
  }
}
