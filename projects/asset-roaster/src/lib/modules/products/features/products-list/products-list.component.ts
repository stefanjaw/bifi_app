import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ProductStatusCardComponent } from '@avalantec/asset-roaster/modules/products/ui/product-status-card/product-status-card.component';
import {
  FilterManager,
  paginationOptions,
  SearchBar,
  tableColumn,
  TableLayout,
} from '@avalantec/base-app';
import { CrudProductsService } from '@avalantec/asset-roaster/modules/products/services/crud-products.service';
import { PageEvent } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { product } from '@avalantec/asset-roaster/modules/products/interfaces/product.model';
import { MatMenuItem } from '@angular/material/menu';
import { equipmentFilters } from '@avalantec/asset-roaster/modules/products/utils/equipment-filters';

@Component({
  selector: 'bifi-app-products-list',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    ProductStatusCardComponent,
    TableLayout,
    MatIcon,
    MatMenuItem,
    SearchBar,
  ],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  columns = signal<tableColumn<product>[]>([
    {
      field: 'productModel',
      title: 'Product Model',
      type: 'text',
    },
    {
      field: 'serialNumber',
      title: 'Serial Number',
      type: 'text',
    },
    {
      field: 'acquiredDate',
      title: 'Acquired Date',
      type: 'date',
    },
    {
      field: 'acquiredPrice',
      title: 'Acquired Price',
      type: 'currency',
    },
    {
      field: 'currentPrice',
      title: 'Current Price',
      type: 'currency',
    },
    {
      field: 'condition',
      title: 'Condition',
      type: 'text',
    },
  ]);

  //#region  manage pagination
  paginationOptions = signal<paginationOptions>({
    paginate: true,
    page: 1,
    limit: 5,
  });

  changePage(page: PageEvent) {
    this.paginationOptions.update((value) => ({
      ...value,
      limit: page.pageSize,
      page: page.pageIndex + 1,
    }));
  }
  //#endregion

  //#region manage filters
  private filterManager = inject(FilterManager);
  equipmentFilters = equipmentFilters;

  // when a filter is applied in manager, then this will be updated
  filters = computed(() => {
    if (this.filterManager.filters().length > 0) {
      return this.filterManager.getFilterObject('or');
    } else return {};
  });
  //#endregion

  //#region manage products
  private crudProducts = inject(CrudProductsService);

  products = this.crudProducts.getWithPagination({
    searchParams: this.filters,
    paginateOptions: this.paginationOptions,
  });
  //#endregion

  ngOnDestroy(): void {
    this.filterManager.clearFilters();
  }
}
