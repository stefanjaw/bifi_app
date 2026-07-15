import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudWarehouses } from '../../services/crud-warehouses';
import { warehouse } from '../../interfaces/warehouse';
import { warehouseColumns } from '../../libraries/warehouse-columns';
import { warehouseFilters } from '../../libraries/warehouse-filters';
import { ButtonModule } from 'primeng/button';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastModule } from 'primeng/toast';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-warehouses-list',
  providers: [provideResourceManager(CrudWarehouses)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    ToastModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  templateUrl: './warehouses-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehousesList {
  private resourceManager = inject<ResourceManager<warehouse>>(ResourceManager);
  private crudWarehouses = inject(CrudWarehouses);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  warehouseColumns = warehouseColumns;
  warehouseFilters = warehouseFilters;

  entries = this.resourceManager.data;

  delete(id: string) {
    this.crudWarehouses
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.entries.reload() });
  }

  gotoEditWarehouse = (element: warehouse) => {
    this.router.navigate([`../warehouses/${element._id}/edit`], { relativeTo: this.route });
  };
}
