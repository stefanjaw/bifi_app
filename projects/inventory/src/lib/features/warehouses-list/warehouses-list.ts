import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { warehouse } from '../../interfaces/warehouse';
import { warehouseColumns } from '../../libraries/warehouse-columns';
import { warehouseFilters } from '../../libraries/warehouse-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'bifi-app-warehouses-list',
  providers: [provideResourceManager(CrudWarehouses)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, RouterLink, ToastModule],
  templateUrl: './warehouses-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehousesList {
  private resourceManager = inject<ResourceManager<warehouse>>(ResourceManager);
  private crudWarehouses = inject(CrudWarehouses);
  private destroy$ = inject(DestroyRef);

  warehouseColumns = warehouseColumns;
  warehouseFilters = warehouseFilters;

  entries = this.resourceManager.data;

  delete(id: string) {
    this.crudWarehouses
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.entries.reload() });
  }
}
